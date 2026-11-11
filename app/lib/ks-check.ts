/**
 * 카톡 예약 발송 · 서버 정품 확인 (1.13.0 · 향후 방향 4)
 *
 * 설계 정본: E:\하랑\본부장\카톡예약\서버확인_설계_1.13.0.md (3장 주고받는 것 · 4장 서버)
 * 근거: 대표 지시 2026-10-08 (목) H-1169 · D-0632
 *
 * 이 파일은 DB 를 모른다. 요청 검사 · 답 만들기 · 서명만 한다 (route.ts 가 DB 를 붙인다).
 *
 * 서명 형식 (손님 PC online.verify_reply 와 맞춘다)
 *   p = JSON.stringify({m, n, t, u, r, l})  · 키 순서 고정 · 공백 없음 · 한 줄
 *   s = Ed25519(서버 비밀키, p 의 UTF-8 바이트) 를 소문자 hex 128자로
 *   손님 PC 는 p 를 다시 만들지 않고 받은 문자열 그대로의 UTF-8 바이트를 확인한다.
 *
 * 서명키: 환경 변수 KS_SERVER_SIGNING_KEY (이름까지만 · 값은 대표가 Vercel 에 넣는다)
 *   1) PKCS8 PEM (`-----BEGIN PRIVATE KEY-----` · make_server_key.py 가 만드는 _server_key.pem 내용 그대로) ← 기본
 *   2) 32바이트 seed 를 hex 64자로 (PEM 을 한 줄로 넣기 어려울 때)
 *   PEM 을 한 줄로 붙여 넣으면서 줄바꿈이 문자 \n 으로 들어간 경우도 받아 준다.
 *   정품키 서명키(_signing_key.pem)와는 다른 키다.
 *
 * 받는 것은 기기 코드(m) · 키 지문(k) · 버전(v) · 일회용 값(n) · 체험 사용 수(u) 뿐이다.
 * 방 이름 · 메시지 · 연락처 · 카톡 계정 · IP 는 저장하지 않는다 (IP 는 분당 제한용 메모리에만 1분).
 */

import { createPrivateKey, sign as edSign, type KeyObject } from "node:crypto";

/** 최신 버전 안내. 일단 상수로 둔다 (손님 배포가 나가면 같이 올린다) */
export const KS_LATEST_VERSION = "1.12.0";

/** 체험 사용 수 상한 (요청 검사용). 한도 자체는 exe 의 TRIAL_LIMIT 10 이다 */
export const KS_TRIAL_MAX = 1000;

export type KsRequest = { m: string; k: string; v: string; n: string; u: number };
export type KsPayload = { m: string; n: string; t: number; u: number; r: boolean; l: string };

/* license.ALPHABET (0 O 1 I 를 뺀 32자) 4자 셋을 - 로 이은 것 */
const RE_MACHINE = /^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;
const RE_KEYHASH = /^[0-9a-f]{32}$/;
const RE_NONCE = /^[0-9a-f]{32}$/;
const RE_VERSION = /^\d{1,3}\.\d{1,3}\.\d{1,3}$/;

/** 요청 검사. 맞으면 정리된 값, 아니면 이유 문자열 */
export function parseKsRequest(body: unknown): KsRequest | string {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "body";
  const b = body as Record<string, unknown>;
  const { m, k, v, n, u } = b;
  if (typeof m !== "string" || !RE_MACHINE.test(m)) return "m";
  if (typeof k !== "string" || (k !== "" && !RE_KEYHASH.test(k))) return "k";
  if (typeof v !== "string" || v.length > 11 || !RE_VERSION.test(v)) return "v";
  if (typeof n !== "string" || !RE_NONCE.test(n)) return "n";
  if (typeof u !== "number" || !Number.isInteger(u) || u < 0 || u > KS_TRIAL_MAX) return "u";
  return { m, k, v, n, u };
}

/** p 문자열. 키 순서를 여기서 고정한다 */
export function buildPayload(x: KsPayload): string {
  const ordered: KsPayload = { m: x.m, n: x.n, t: x.t, u: x.u, r: x.r, l: x.l };
  return JSON.stringify(ordered);
}

/* Ed25519 PKCS8 DER 머리 (RFC 8410) + 32바이트 seed */
const PKCS8_ED25519_PREFIX = Buffer.from("302e020100300506032b657004220420", "hex");

/** 환경 변수 값 → 비밀키. 형식이 틀리면 null (값은 어디에도 찍지 않는다) */
export function loadSigningKey(raw: string | undefined): KeyObject | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v) return null;
  try {
    let key: KeyObject;
    if (v.includes("-----BEGIN")) {
      key = createPrivateKey({ key: v.replace(/\\n/g, "\n"), format: "pem" });
    } else if (/^[0-9a-fA-F]{64}$/.test(v)) {
      const der = Buffer.concat([PKCS8_ED25519_PREFIX, Buffer.from(v, "hex")]);
      key = createPrivateKey({ key: der, format: "der", type: "pkcs8" });
    } else {
      return null;
    }
    return key.asymmetricKeyType === "ed25519" ? key : null;
  } catch {
    return null;
  }
}

/** p 의 UTF-8 바이트에 Ed25519 서명 → 소문자 hex 128자 */
export function signPayload(p: string, key: KeyObject): string {
  return edSign(null, Buffer.from(p, "utf8"), key).toString("hex");
}

/* ---- 같은 IP 분당 30회 ----
   /api/contact · /api/sns/order 와 같은 방식 (서버리스 인스턴스 단위 메모리).
   완전한 차단이 아니라 자동 도배를 늦추는 장치다. IP 는 1분 지나면 지운다. */
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;
const recent = new Map<string, number[]>();

export function tooManyChecks(ip: string, now: number = Date.now()): boolean {
  const list = (recent.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  recent.set(ip, list);
  if (recent.size > 5000) {
    for (const [k, ts] of recent) {
      if (ts.every((t) => now - t >= RATE_WINDOW_MS)) recent.delete(k);
    }
  }
  return list.length > RATE_LIMIT;
}
