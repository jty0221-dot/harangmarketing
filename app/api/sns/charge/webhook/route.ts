import { NextRequest, NextResponse } from "next/server";
import {
  getPayment,
  verifyWebhookSignature,
  chargeIdFromPaymentId,
  portoneConfigured,
} from "../../../../lib/portone";
import { approveChargeByPayment } from "../../../../lib/charges";

/**
 * 포트원 결제 웹훅 (공개 엔드포인트)
 *
 * 가상계좌에 입금이 들어오면 포트원이 이 주소로 알린다.
 * 웹훅 본문은 신뢰하지 않는다 — 서명을 확인하고, 포트원 API 로 결제를 다시 조회해
 * 상태(PAID)와 금액이 맞을 때만 잔액을 올린다. 같은 웹훅이 여러 번 와도 한 번만 반영된다.
 *
 * 포트원 콘솔에 등록할 주소:
 *   https://www.harangmarketing.com/api/sns/charge/webhook
 */

export async function POST(req: NextRequest) {
  // 키가 아직 없으면(=PG 심사 전) 조용히 무시한다. 200 을 줘야 포트원이 재시도하지 않는다.
  if (!portoneConfigured()) {
    return NextResponse.json({ ok: true, skipped: "not-configured" });
  }

  const raw = await req.text();
  const valid = verifyWebhookSignature(raw, {
    id: req.headers.get("webhook-id"),
    timestamp: req.headers.get("webhook-timestamp"),
    signature: req.headers.get("webhook-signature"),
  });
  if (!valid) {
    return NextResponse.json({ ok: false, error: "서명 검증 실패" }, { status: 401 });
  }

  let paymentId: string | undefined;
  try {
    const body = JSON.parse(raw) as { data?: { paymentId?: string } };
    paymentId = body.data?.paymentId;
  } catch {
    return NextResponse.json({ ok: false, error: "본문 형식 오류" }, { status: 400 });
  }
  if (!paymentId) return NextResponse.json({ ok: true, skipped: "no-payment-id" });

  const chargeId = chargeIdFromPaymentId(paymentId);
  if (!chargeId) return NextResponse.json({ ok: true, skipped: "not-a-charge" });

  try {
    // 최종 검증 — 포트원에 직접 물어본다
    const payment = await getPayment(paymentId);
    if (payment.status !== "PAID") {
      // 가상계좌 발급(READY) 등 입금 전 단계 — 아직 충전하지 않는다
      return NextResponse.json({ ok: true, skipped: payment.status });
    }

    const result = await approveChargeByPayment(chargeId, paymentId, payment.amount.total);

    if (result === "mismatch") {
      await notifyOwner(
        `[SNS 부스트] 충전 금액 불일치 — 확인 필요\n충전#${chargeId} · 입금 ${payment.amount.total.toLocaleString("ko-KR")}원\n신청 금액과 달라 자동 반영하지 않았습니다. 어드민에서 확인하세요.`
      );
      return NextResponse.json({ ok: false, error: "amount-mismatch" }, { status: 200 });
    }
    if (!result) {
      return NextResponse.json({ ok: true, skipped: "already-processed" });
    }

    await notifyOwner(
      `[SNS 부스트] 자동 충전 완료\n충전#${chargeId} · ${result.amount.toLocaleString("ko-KR")}원 입금\n회원 잔액 ${result.balanceAfter.toLocaleString("ko-KR")}원`
    );
    return NextResponse.json({ ok: true, balanceAfter: result.balanceAfter });
  } catch (e) {
    console.error("충전 웹훅 처리 실패:", e);
    // 500 을 주면 포트원이 재시도한다 — 일시적 오류일 수 있으므로 그대로 둔다
    return NextResponse.json({ ok: false, error: "처리 실패" }, { status: 500 });
  }
}

async function notifyOwner(text: string) {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {}
}
