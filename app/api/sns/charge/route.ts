import { NextRequest, NextResponse } from "next/server";
import { verifyMemberToken, MEMBER_COOKIE_NAME } from "../../../lib/member-auth";
import { createChargeRequest, getMemberCharges } from "../../../lib/charges";

const MIN = 5000;
const MAX = 2000000;
const BANK = process.env.SNS_BANK || "국민은행 0947-0104-384081 (예금주: 전태영(하랑))";

/** 충전 신청(pending 생성) + 입금 계좌 반환 */
export async function POST(req: NextRequest) {
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
    return NextResponse.json({ ok: true, charge, bank: BANK });
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
