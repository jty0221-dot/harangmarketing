import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "harang_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7일

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET 환경변수가 설정되지 않았습니다");
  return secret;
}

export function createSessionToken(): string {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const sig = crypto.createHmac("sha256", getSecret()).update(`admin:${expiry}`).digest("hex");
  return `${expiry}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expiryStr, sig] = token.split(".");
  if (!expiryStr || !sig) return false;
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  const expectedSig = crypto.createHmac("sha256", getSecret()).update(`admin:${expiry}`).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
