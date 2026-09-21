import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../../lib/admin-auth";
import { getKakaoRestApiKey } from "../../../../lib/kakao-token-store";
import { KAKAO_STATE_COOKIE, KAKAO_STATE_COOKIE_PATH, kakaoRedirectUri } from "../../../../lib/kakao-oauth";

/**
 * [카카오 계정 연결] 1단계 — 관리자를 카카오 동의 화면으로 보낸다.
 * 어느 계정으로 동의했는지는 2단계(callback)에서 카카오 회원번호로 확인해 DB 에 넣는다.
 */
export async function GET(req: NextRequest) {
  const store = await cookies();
  if (!verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  const restApiKey = getKakaoRestApiKey();
  if (!restApiKey) {
    return NextResponse.redirect(new URL("/admin/notify-test?kakao=error&code=NO_REST_KEY", req.url));
  }

  const label = (new URL(req.url).searchParams.get("label") ?? "")
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .trim()
    .slice(0, 20);
  const state = crypto.randomBytes(16).toString("hex");

  const authorize = new URL("https://kauth.kakao.com/oauth/authorize");
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("client_id", restApiKey);
  authorize.searchParams.set("redirect_uri", kakaoRedirectUri(req));
  authorize.searchParams.set("scope", "talk_message");
  authorize.searchParams.set("state", state);
  // 브라우저에 남아 있는 다른 카카오 계정으로 동의되는 사고를 막는다 — 매번 로그인 화면을 띄운다
  authorize.searchParams.set("prompt", "login");

  const res = NextResponse.redirect(authorize.toString());
  res.cookies.set(KAKAO_STATE_COOKIE, `${state}.${encodeURIComponent(label)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: KAKAO_STATE_COOKIE_PATH,
    maxAge: 10 * 60,
  });
  return res;
}
