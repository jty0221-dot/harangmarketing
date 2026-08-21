import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, ADMIN_COOKIE_NAME } from "../../../lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({ password: "" }));
    const password = typeof body?.password === "string" ? body.password : "";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { ok: false, error: "서버에 관리자 비밀번호(ADMIN_PASSWORD)가 설정되지 않았습니다. 관리자에게 문의하세요." },
        { status: 500 }
      );
    }
    if (password !== adminPassword) {
      return NextResponse.json({ ok: false, error: "비밀번호가 일치하지 않습니다" }, { status: 401 });
    }
    if (!process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.json(
        { ok: false, error: "서버에 세션 비밀키(ADMIN_SESSION_SECRET)가 설정되지 않았습니다. 관리자에게 문의하세요." },
        { status: 500 }
      );
    }

    const token = createSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
