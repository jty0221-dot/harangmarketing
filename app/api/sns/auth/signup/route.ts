import { NextRequest, NextResponse } from "next/server";
import { normalizePhone, hashPassword, createMember, getMemberByPhone } from "../../../../lib/members";
import { createMemberToken, MEMBER_COOKIE_NAME, MEMBER_SESSION_MAX_AGE } from "../../../../lib/member-auth";
import { SNS_STORE_ENABLED } from "../../../../lib/feature-flags";

export async function POST(req: NextRequest) {
  // 스토어를 감춘 동안에는 새 가입을 받지 않는다 (app/lib/feature-flags.ts).
  // 화면이 404 라 정상 경로로는 닿을 수 없지만, 직접 호출까지 막아 둔다.
  if (!SNS_STORE_ENABLED) return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404 });
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const phone = normalizePhone(String(body.phone ?? ""));
    const name = String(body.name ?? "").trim();
    const password = String(body.password ?? "");

    if (phone.length < 10 || phone.length > 11)
      return NextResponse.json({ ok: false, error: "휴대폰 번호를 정확히 입력해 주세요" }, { status: 400 });
    if (name.length < 1 || name.length > 30)
      return NextResponse.json({ ok: false, error: "이름을 입력해 주세요" }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ ok: false, error: "비밀번호는 6자 이상이어야 합니다" }, { status: 400 });

    if (await getMemberByPhone(phone))
      return NextResponse.json({ ok: false, error: "이미 가입된 휴대폰 번호입니다" }, { status: 409 });

    const member = await createMember(phone, name, hashPassword(password));
    const res = NextResponse.json({ ok: true, member: { name: member.name, balance: member.balance } });
    res.cookies.set(MEMBER_COOKIE_NAME, createMemberToken(member.id), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: MEMBER_SESSION_MAX_AGE,
    });
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "가입 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
