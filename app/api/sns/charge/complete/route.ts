import { NextRequest, NextResponse } from "next/server";
import { verifyMemberToken, MEMBER_COOKIE_NAME } from "../../../../lib/member-auth";
import { getPayment, chargeIdFromPaymentId, portoneConfigured } from "../../../../lib/portone";
import { approveChargeByPayment } from "../../../../lib/charges";

/**
 * 결제창에서 돌아온 브라우저가 부르는 확인 엔드포인트.
 *
 * 브라우저 말은 믿지 않는다 — 받은 것은 paymentId 하나뿐이고,
 * 상태(PAID)와 금액은 포트원 API 에 다시 물어서 확인한다. 웹훅과 같은 함수를 쓰므로
 * 웹훅이 먼저 들어왔더라도 두 번 충전되지 않는다(이미 처리됐으면 already 로 돌아온다).
 *
 * 카드 결제는 결제창에서 바로 승인이 떨어져 웹훅을 기다릴 이유가 없다.
 * 가상계좌는 여기서 READY 로 돌아오고, 실제 입금은 웹훅이 받는다.
 */
export async function POST(req: NextRequest) {
  const memberId = verifyMemberToken(req.cookies.get(MEMBER_COOKIE_NAME)?.value);
  if (!memberId) return NextResponse.json({ ok: false, error: "로그인이 필요합니다" }, { status: 401 });
  if (!portoneConfigured()) {
    return NextResponse.json({ ok: false, error: "결제가 아직 준비 중입니다" }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const paymentId = typeof body.paymentId === "string" ? body.paymentId : "";
  const chargeId = chargeIdFromPaymentId(paymentId);
  if (!chargeId) return NextResponse.json({ ok: false, error: "결제 번호가 올바르지 않습니다" }, { status: 400 });

  try {
    const payment = await getPayment(paymentId);

    if (payment.status === "PAID") {
      const result = await approveChargeByPayment(chargeId, paymentId, payment.amount.total);
      if (result === "mismatch") {
        return NextResponse.json({ ok: false, error: "결제 금액이 신청 금액과 다릅니다. 확인 후 반영해 드리겠습니다" }, { status: 200 });
      }
      // result 가 null 이면 웹훅이 이미 처리한 것 — 사용자에게는 똑같이 완료다
      return NextResponse.json({ ok: true, status: "paid", balanceAfter: result ? result.balanceAfter : null });
    }

    // 가상계좌 발급 등 입금 전 단계
    return NextResponse.json({ ok: true, status: payment.status });
  } catch {
    return NextResponse.json({ ok: false, error: "결제 확인에 실패했습니다. 잠시 후 마이페이지에서 잔액을 확인해 주세요" }, { status: 500 });
  }
}
