import { NextRequest, NextResponse } from "next/server";
import { getSql } from "../../../lib/db";
import {
  KS_LATEST_VERSION,
  buildPayload,
  loadSigningKey,
  parseKsRequest,
  signPayload,
  tooManyChecks,
} from "../../../lib/ks-check";

/**
 * POST /api/kakao-sender/check · 카톡 예약 발송 서버 정품 확인 (1.13.0)
 *
 * 설계 정본: E:\하랑\본부장\카톡예약\서버확인_설계_1.13.0.md
 * 요청 {m,k,v,n,u} → ks_devices 업서트 (체험 사용 수는 줄어들지 않는다) · ks_revoked 조회
 * → {p, s}  (p = 한 줄 JSON {m,n,t,u,r,l} · s = p 의 UTF-8 바이트에 대한 Ed25519 서명 hex)
 *
 * 손님 PC 는 꺼지면 막지 않는다 (fail-open). 그래서 여기서 실패하면 숨기지 않고 503 을 돌려주고,
 * 손님 PC 는 마지막 정상 답 기준으로 계속 돈다.
 * 표 만들기: scripts/db/kakao-sender-check-schema.sql (실행은 결재)
 */

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" };

function fail(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooManyChecks(ip)) return fail(429, "too_many");

  const key = loadSigningKey(process.env.KS_SERVER_SIGNING_KEY);
  if (!key) return fail(503, "not_configured");

  const raw = await req.text().catch(() => "");
  if (raw.length > 1024) return fail(413, "too_large");
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, "bad_json");
  }
  const q = parseKsRequest(body);
  if (typeof q === "string") return fail(400, "bad_" + q);

  let trialUsed: number;
  let revoked: boolean;
  try {
    const sql = getSql();
    const rows = (await sql`
      WITH up AS (
        INSERT INTO ks_devices (machine, first_seen, last_seen, version, trial_used, key_hash, checks)
        VALUES (${q.m}, now(), now(), ${q.v}, ${q.u}, nullif(${q.k}, ''), 1)
        ON CONFLICT (machine) DO UPDATE SET
          last_seen  = now(),
          version    = excluded.version,
          trial_used = greatest(ks_devices.trial_used, excluded.trial_used),
          key_hash   = coalesce(excluded.key_hash, ks_devices.key_hash),
          checks     = ks_devices.checks + 1
        RETURNING trial_used
      )
      SELECT
        (SELECT trial_used FROM up) AS trial_used,
        (${q.k} <> '' AND EXISTS (SELECT 1 FROM ks_revoked WHERE key_hash = ${q.k})) AS revoked
    `) as { trial_used: number | string; revoked: boolean }[];
    const row = rows[0];
    if (!row) return fail(503, "db_empty");
    trialUsed = Number(row.trial_used);
    revoked = row.revoked === true;
    if (!Number.isInteger(trialUsed) || trialUsed < 0) return fail(503, "db_value");
  } catch {
    return fail(503, "db_unavailable");
  }

  const p = buildPayload({
    m: q.m,
    n: q.n,
    t: Math.floor(Date.now() / 1000),
    u: trialUsed,
    r: revoked,
    l: KS_LATEST_VERSION,
  });
  const s = signPayload(p, key);
  return NextResponse.json({ p, s }, { headers: NO_STORE });
}
