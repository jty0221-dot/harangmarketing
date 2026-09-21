import crypto from "crypto";
import { getSql } from "./db";

/**
 * 카카오 리프레시 토큰 저장소 (서버 전용).
 *
 * 왜 필요한가 — 카카오 리프레시 토큰은 2개월짜리이고, 갱신 호출 때 만료가 한 달 미만이면
 * 새 리프레시 토큰이 응답에 같이 내려온다. 그 새 토큰을 어딘가에 적어 두지 않으면
 * 환경변수에 박힌 옛 토큰은 두 달 뒤 반드시 죽는다 (청설모 2026-09-21 관리자 알림 테스트 400 KOE319 가 그것).
 * 하랑 홈페이지도 같은 구조였다 — kakao-notify.ts 주석에 "저장할 곳이 없다" 고 적혀 있었다.
 *
 * 어디에 두나 — Neon 테이블 kakao_recipients (문의 저장과 같은 DB · 같은 lazy create 패턴).
 * 토큰은 AES-256-GCM 으로 감싸서 적는다. 키는 ADMIN_SESSION_SECRET 에서 파생한다.
 * 비밀값은 환경변수에만 있고 DB 에는 암호문만 남는다. ADMIN_SESSION_SECRET 을 바꾸면 저장된 토큰은
 * 못 읽게 되고 환경변수 토큰으로 되돌아간다 (관리자 화면에서 다시 연결하면 된다).
 *
 * 수신자는 두 갈래다.
 * - env  : KAKAO_REFRESH_TOKEN (쉼표 구분) 에서 온 토큰. id 는 토큰 해시라 값이 바뀌면 새 수신자로 본다.
 *          회전된 토큰이 DB 에 있으면 DB 것이 이긴다.
 * - store: 관리자 화면 [카카오 계정 연결] 로 들어온 토큰. 환경변수 없이 DB 만으로 산다.
 *
 * 이 파일의 함수는 예외를 던지지 않는다. DB 가 죽어도 알림은 환경변수 토큰으로 계속 간다.
 */

export interface KakaoRecipient {
  id: string;
  label: string;
  refreshToken: string;
  source: "env" | "store";
  updatedAt?: string;
  lastOkAt?: string;
  lastError?: string;
}

interface StoredRow {
  id: string;
  label: string;
  /** AES-256-GCM 암호문: base64url(iv).base64url(tag).base64url(cipher) */
  enc: string;
  updated_at: string | Date;
  last_ok_at: string | Date | null;
  last_error: string | null;
}

/* ── 암호화 ── */

function deriveKey(): Buffer | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  return crypto.createHash("sha256").update(`kakao-token:${secret}`).digest();
}

function encrypt(plain: string): string | null {
  const key = deriveKey();
  if (!key) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, body].map((b) => b.toString("base64url")).join(".");
}

function decrypt(enc: string): string | null {
  const key = deriveKey();
  if (!key) return null;
  const parts = enc.split(".");
  if (parts.length !== 3) return null;
  try {
    const [iv, tag, body] = parts.map((p) => Buffer.from(p, "base64url"));
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

/* ── 환경변수 ── */

export function getKakaoRestApiKey(): string {
  // 복사 과정에서 섞인 공백·특수문자를 제거 (REST 키는 16진수)
  return (process.env.KAKAO_REST_API_KEY ?? "").replace(/[^a-f0-9]/gi, "");
}

function cleanToken(raw: string): string {
  return raw.replace(/[^A-Za-z0-9\-_]/g, "");
}

function envTokenId(token: string): string {
  return `env-${crypto.createHash("sha256").update(token).digest("hex").slice(0, 10)}`;
}

function getEnvRecipients(): KakaoRecipient[] {
  return (process.env.KAKAO_REFRESH_TOKEN ?? "")
    .split(",")
    .map(cleanToken)
    .filter(Boolean)
    .map((token, i) => ({
      id: envTokenId(token),
      label: `환경변수 ${i + 1}`,
      refreshToken: token,
      source: "env" as const,
    }));
}

/* ── DB ── */

let tableReady = false;

async function ensureTable() {
  if (tableReady) return;
  await getSql()`
    create table if not exists kakao_recipients (
      id         text primary key,
      label      text not null,
      enc        text not null,
      added_at   timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      last_ok_at timestamptz,
      last_error text
    )
  `;
  tableReady = true;
}

function iso(v: string | Date | null | undefined): string | undefined {
  if (!v) return undefined;
  return v instanceof Date ? v.toISOString() : String(v);
}

async function readRows(): Promise<StoredRow[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    await ensureTable();
    return (await getSql()`
      select id, label, enc, updated_at, last_ok_at, last_error
      from kakao_recipients
      order by added_at
    `) as StoredRow[];
  } catch (e) {
    console.error("카카오 토큰 저장소 읽기 실패:", e);
    return [];
  }
}

/** DB 상태 — 화면에서 저장소가 살아 있는지 보여 준다. 값은 내보내지 않는다 */
export async function kakaoStoreHealth(): Promise<{ ok: boolean; detail: string }> {
  if (!process.env.DATABASE_URL) return { ok: false, detail: "DATABASE_URL 미설정" };
  if (!deriveKey()) return { ok: false, detail: "ADMIN_SESSION_SECRET 미설정 (암호화 키)" };
  try {
    await ensureTable();
    const rows = (await getSql()`select count(*)::int as n from kakao_recipients`) as { n: number }[];
    return { ok: true, detail: `정상 · 저장된 계정 ${rows[0]?.n ?? 0}개` };
  } catch (e) {
    return { ok: false, detail: `DB 연결 실패 · ${String(e).slice(0, 80)}` };
  }
}

/**
 * 알림을 보낼 수신자 전부. 환경변수 토큰 + DB 토큰을 합치고,
 * 같은 id 가 양쪽에 있으면 DB(회전된 최신 토큰)가 이긴다.
 */
export async function getKakaoRecipients(): Promise<KakaoRecipient[]> {
  const env = getEnvRecipients();
  const rows = await readRows();
  const byId = new Map<string, KakaoRecipient>(env.map((r) => [r.id, r]));

  for (const s of rows) {
    const token = decrypt(s.enc);
    if (!token) continue; // 키가 바뀌었거나 손상 → 환경변수 값으로 남긴다
    const base = byId.get(s.id);
    byId.set(s.id, {
      id: s.id,
      label: s.label || base?.label || "수신자",
      refreshToken: token,
      source: base ? "env" : "store",
      updatedAt: iso(s.updated_at),
      lastOkAt: iso(s.last_ok_at),
      lastError: s.last_error ?? undefined,
    });
  }
  return [...byId.values()];
}

/** 화면용 — 토큰 값은 절대 내보내지 않는다 */
export async function describeKakaoRecipients(): Promise<Array<Omit<KakaoRecipient, "refreshToken">>> {
  const list = await getKakaoRecipients();
  return list.map(({ refreshToken: _omit, ...rest }) => rest);
}

/** 새 토큰(회전 응답 · 관리자 연결)을 저장한다. 실패해도 예외를 던지지 않는다. */
export async function saveKakaoRecipient(id: string, label: string, refreshToken: string): Promise<boolean> {
  const enc = encrypt(cleanToken(refreshToken));
  if (!enc || !process.env.DATABASE_URL) return false;
  try {
    await ensureTable();
    await getSql()`
      insert into kakao_recipients (id, label, enc)
      values (${id}, ${label || "수신자"}, ${enc})
      on conflict (id) do update
        set enc = excluded.enc,
            label = case when ${label} = '' then kakao_recipients.label else excluded.label end,
            updated_at = now(),
            last_error = null
    `;
    return true;
  } catch (e) {
    console.error("카카오 토큰 저장 실패:", e);
    return false;
  }
}

/** 갱신 결과(정상 시각 · 마지막 오류)를 남긴다. DB 에 없는 env 수신자는 건드리지 않는다. */
export async function markKakaoRecipient(id: string, result: { ok: true } | { ok: false; error: string }): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  try {
    await ensureTable();
    if (result.ok) {
      // 정상 기록은 하루 한 번만 쓴다 — 문의마다 쓰기를 쌓지 않는다
      await getSql()`
        update kakao_recipients
        set last_ok_at = now(), last_error = null
        where id = ${id}
          and (last_error is not null or last_ok_at is null or last_ok_at < now() - interval '24 hours')
      `;
    } else {
      await getSql()`
        update kakao_recipients
        set last_error = ${result.error}
        where id = ${id} and last_error is distinct from ${result.error}
      `;
    }
  } catch (e) {
    console.error("카카오 토큰 상태 기록 실패:", e);
  }
}

export async function removeKakaoRecipient(id: string): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    await ensureTable();
    await getSql()`delete from kakao_recipients where id = ${id}`;
    return true;
  } catch (e) {
    console.error("카카오 수신자 해제 실패:", e);
    return false;
  }
}
