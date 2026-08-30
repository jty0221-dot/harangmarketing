import { NextRequest, NextResponse } from "next/server";
import { verifyMemberToken, MEMBER_COOKIE_NAME } from "../../../lib/member-auth";
import { getMemberById, getLedger } from "../../../lib/members";

/** 로그인한 회원의 정보·잔액·최근 원장 */
export async function GET(req: NextRequest) {
  const memberId = verifyMemberToken(req.cookies.get(MEMBER_COOKIE_NAME)?.value);
  if (!memberId) return NextResponse.json({ ok: false, error: "로그인이 필요합니다" }, { status: 401 });
  try {
    const member = await getMemberById(memberId);
    if (!member) return NextResponse.json({ ok: false, error: "회원을 찾을 수 없습니다" }, { status: 404 });
    const ledger = await getLedger(memberId, 30);
    return NextResponse.json({
      ok: true,
      member: { name: member.name, phone: member.phone, balance: member.balance },
      ledger,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "정보를 불러오지 못했습니다" }, { status: 500 });
  }
}
