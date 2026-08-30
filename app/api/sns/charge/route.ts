import { NextRequest, NextResponse } from "next/server";
import { verifyMemberToken, MEMBER_COOKIE_NAME } from "../../../lib/member-auth";
import { createChargeRequest, getMemberCharges } from "../../../lib/charges";
import { getMemberById } from "../../../lib/members";
import { SNS_STORE_ENABLED } from "../../../lib/feature-flags";

const MIN = 5000;
const MAX = 2000000;
const BANK = process.env.SNS_BANK || "국민은행 0947-0104-384081 (예금주: 전태영(하랑))";

/** 충전 신청(pending 생성) + 입금 계좌 반환 */
export async function POST(req: NextRequest) {
  // 스토어를 감춘 동안에는 새 충전 신청을 받지 않는다 (app/lib/feature-flags.ts).
  // 화면이 404 라 정상 경로로는 닿을 수 없지만, 직접 호출까지 막아 둔다.
  if (!SNS_STORE_ENABLED) return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404 });
  const memberId = verifyMemberToken(req.cookies.get(MEMBER_COOKIE_NAME)?.value);
  if (!memberId) return NextResponse.json({ ok: false, error: "로그인이 필요합니다" }, { status: 401 });
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const amount = Math.floor(Number(body.amount));
    if (!Number.isFinite(amount) || amount < MIN || amount > MAX) {
      return NextResponse.json(
        { ok: false, error: `충전 금액은 ${MIN.toLocaleString("ko-KR")}~${MAX.toLocaleString("ko-KR")}원 사이여야 합니다` },
        { status: 400 }
      );
    }
    const charge = await createChargeRequest(memberId, amount);
    // 결제창에 넣을 구매자 정보 — 카드 결제일 때만 쓰인다(회원 본인 값이라 새로 묻지 않는다)
    const member = await getMemberById(memberId);
    return NextResponse.json({
      ok: true,
      charge,
      bank: BANK,
      buyer: { name: member?.name ?? "", phone: member?.phone ?? "" },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "충전 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}

/** 내 충전 신청 내역 */
export async function GET(req: NextRequest) {
  const memberId = verifyMemberToken(req.cookies.get(MEMBER_COOKIE_NAME)?.value);
  if (!memberId) return NextResponse.json({ ok: false, error: "로그인이 필요합니다" }, { status: 401 });
  try {
    const charges = await getMemberCharges(memberId);
    return NextResponse.json({ ok: true, charges, bank: BANK });
  } catch {
    return NextResponse.json({ ok: false, error: "불러오지 못했습니다" }, { status: 500 });
  }
}
