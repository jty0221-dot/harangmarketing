import { NextResponse } from "next/server";
import { MEMBER_COOKIE_NAME } from "../../../../lib/member-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(MEMBER_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
