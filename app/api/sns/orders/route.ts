import { NextRequest, NextResponse } from "next/server";
import { verifyMemberToken, MEMBER_COOKIE_NAME } from "../../../lib/member-auth";
import { getMemberOrders } from "../../../lib/member-orders";

/** 로그인한 회원의 주문 목록 */
export async function GET(req: NextRequest) {
  const memberId = verifyMemberToken(req.cookies.get(MEMBER_COOKIE_NAME)?.value);
  if (!memberId) return NextResponse.json({ ok: false, error: "로그인이 필요합니다" }, { status: 401 });
  try {
    const orders = await getMemberOrders(memberId);
    return NextResponse.json({ ok: true, orders });
  } catch {
    return NextResponse.json({ ok: false, error: "주문을 불러오지 못했습니다" }, { status: 500 });
  }
}
