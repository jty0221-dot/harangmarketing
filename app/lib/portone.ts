import crypto from "crypto";

/**
 * 포트원(PortOne) V2 연동 — 서버 전용
 *
 * 가상계좌 입금이 확인되면 포트원이 웹훅을 보낸다. 웹훅 본문은 신뢰하지 않고
 * 반드시 포트원 REST API 로 결제를 다시 조회해 금액·상태를 확인한 뒤 잔액을 올린다.
 * (웹훅은 위조될 수 있지만 API 재조회는 위조할 수 없다)
 *
 * 필요한 환경변수 — PG 심사 승인 후 발급받아 Vercel 에 넣는다:
 *   PORTONE_API_SECRET     REST API 시크릿 (V2)
 *   PORTONE_WEBHOOK_SECRET 웹훅 시크릿 (선택 — 있으면 서명까지 검증한다)
 */

const API_BASE = "https://api.portone.io";

export function portoneConfigured(): boolean {
  return Boolean(process.env.PORTONE_API_SECRET);
}

function apiSecret(): string {
  const s = process.env.PORTONE_API_SECRET;
  if (!s) throw new Error("PORTONE_API_SECRET 환경변수가 설정되지 않았습니다");
  return s;
}

export interface PortonePayment {
  id: string;
  status: string; // READY | PAID | CANCELLED | FAILED ...
  amount: { total: number };
  method?: { type?: string };
}

/** 결제 단건 조회 — 웹훅 내용을 믿지 않고 여기서 확인한다 */
export async function getPayment(paymentId: string): Promise<PortonePayment> {
  const res = await fetch(`${API_BASE}/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `PortOne ${apiSecret()}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`포트원 결제 조회 실패 (HTTP ${res.status})`);
  return (await res.json()) as PortonePayment;
}

/**
 * 웹훅 서명 검증 (Standard Webhooks 규격)
 * 서명 비밀이 설정돼 있지 않으면 검증을 건너뛴다 — 이때도 API 재조회가 최종 방어선이다.
 */
export function verifyWebhookSignature(
  rawBody: string,
  headers: { id?: string | null; timestamp?: string | null; signature?: string | null }
): boolean {
  const secret = process.env.PORTONE_WEBHOOK_SECRET;
  if (!secret) return true; // 미설정 — API 재조회로만 검증
  const { id, timestamp, signature } = headers;
  if (!id || !timestamp || !signature) return false;

  // 재전송 공격 방지 — 5분 이상 지난 웹훅은 거부
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = crypto.createHmac("sha256", key).update(`${id}.${timestamp}.${rawBody}`).digest("base64");

  // 헤더에는 "v1,<서명>" 이 공백으로 여러 개 올 수 있다
  for (const part of signature.split(" ")) {
    const sig = part.includes(",") ? part.split(",")[1] : part;
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return true;
  }
  return false;
}

/** 우리 충전 건과 포트원 결제를 잇는 식별자 */
export function paymentIdForCharge(chargeId: number): string {
  return `harang-charge-${chargeId}`;
}

export function chargeIdFromPaymentId(paymentId: string): number | null {
  const m = /^harang-charge-(\d+)$/.exec(paymentId);
  return m ? Number(m[1]) : null;
}
