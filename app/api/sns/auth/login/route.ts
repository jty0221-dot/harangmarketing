import { NextRequest, NextResponse } from "next/server";
import { normalizePhone, verifyPassword, getMemberAuthByPhone } from "../../../../lib/members";
import { createMemberToken, MEMBER_COOKIE_NAME, MEMBER_SESSION_MAX_AGE } from "../../../../lib/member-auth";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const phone = normalizePhone(String(body.phone ?? ""));
    const password = String(body.password ?? "");

    if (!phone || !password)
      return NextResponse.json({ ok: false, error: "휴대폰과 비밀번호를 입력해 주세요" }, { status: 400 });

    const found = await getMemberAuthByPhone(phone);
    if (!found || !verifyPassword(password, found.passwordHash))
      return NextResponse.json(
        { ok: false, error: "휴대폰 번호 또는 비밀번호가 일치하지 않습니다" },
        { status: 401 }
      );
    if (found.member.status !== "active")
      return NextResponse.json(
        { ok: false, error: "이용이 제한된 계정입니다. 고객센터로 문의해 주세요." },
        { status: 403 }
      );

    const res = NextResponse.json({ ok: true, member: { name: found.member.name, balance: found.member.balance } });
    res.cookies.set(MEMBER_COOKIE_NAME, createMemberToken(found.member.id), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: MEMBER_SESSION_MAX_AGE,
    });
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
