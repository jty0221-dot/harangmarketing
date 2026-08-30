import crypto from "crypto";

/**
 * SNS 스토어 회원 세션 (어드민 세션과 별도 쿠키)
 *
 * 서명 비밀키는 어드민과 같은 ADMIN_SESSION_SECRET 을 재사용한다(서버 공통 비밀).
 * 필요하면 MEMBER_SESSION_SECRET 로 분리할 수 있다.
 * 토큰 형식: `${memberId}.${expiry}.${hmac}` — 위변조 불가, 만료 포함.
 */

export const MEMBER_COOKIE_NAME = "harang_sns_member";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30일

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET 환경변수가 설정되지 않았습니다");
  return s;
}

export function createMemberToken(memberId: number): string {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(`member:${memberId}:${expiry}`)
    .digest("hex");
  return `${memberId}.${expiry}.${sig}`;
}

/** 유효하면 memberId, 아니면 null */
export function verifyMemberToken(token: string | undefined): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [idStr, expStr, sig] = parts;
  const memberId = Number(idStr);
  const expiry = Number(expStr);
  if (!Number.isFinite(memberId) || !Number.isFinite(expiry)) return null;
  if (Date.now() > expiry) return null;

  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(`member:${memberId}:${expiry}`)
    .digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return crypto.timingSafeEqual(a, b) ? memberId : null;
}

export const MEMBER_SESSION_MAX_AGE = Math.floor(SESSION_DURATION_MS / 1000);
