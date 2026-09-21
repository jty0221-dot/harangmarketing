import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../../lib/admin-auth";
import { getKakaoRestApiKey, saveKakaoRecipient } from "../../../../lib/kakao-token-store";
import { KAKAO_STATE_COOKIE, KAKAO_STATE_COOKIE_PATH, kakaoRedirectUri } from "../../../../lib/kakao-oauth";

/**
 * [카카오 계정 연결] 2단계 — 카카오가 돌려준 인가 코드를 리프레시 토큰으로 바꿔 DB 에 암호화해 넣는다.
 * 토큰 값은 응답 · 로그 · 쿼리 어디에도 적지 않는다. 화면에는 결과 코드만 돌아간다.
 */
const TOKEN_URL = "https://kauth.kakao.com/oauth/token";
const TOKEN_INFO_URL = "https://kapi.kakao.com/v1/user/access_token_info";

function back(req: NextRequest, query: string) {
  const res = NextResponse.redirect(new URL(`/admin/notify-test?${query}`, req.url));
  res.cookies.set(KAKAO_STATE_COOKIE, "", { path: KAKAO_STATE_COOKIE_PATH, maxAge: 0 });
  return res;
}

function safeCode(raw: string): string {
  return raw.replace(/[^A-Za-z0-9_]/g, "").slice(0, 24) || "UNKNOWN";
}

function sameString(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export async function GET(req: NextRequest) {
  const store = await cookies();
  if (!verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const params = new URL(req.url).searchParams;
  if (params.get("error")) {
    return back(req, `kakao=error&code=${safeCode(params.get("error_code") ?? "DENIED")}`);
  }

  const code = params.get("code") ?? "";
  const state = params.get("state") ?? "";
  const cookieRaw = store.get(KAKAO_STATE_COOKIE)?.value ?? "";
  const dot = cookieRaw.indexOf(".");
  const expected = dot >= 0 ? cookieRaw.slice(0, dot) : cookieRaw;
  const label = dot >= 0 ? decodeURIComponent(cookieRaw.slice(dot + 1)) : "";
  if (!code || !state || !expected || !sameString(state, expected)) {
    return back(req, "kakao=error&code=STATE");
  }

  const restApiKey = getKakaoRestApiKey();
  if (!restApiKey) return back(req, "kakao=error&code=NO_REST_KEY");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: restApiKey,
    redirect_uri: kakaoRedirectUri(req),
    code,
  });
  const clientSecret = (process.env.KAKAO_CLIENT_SECRET ?? "").trim();
  if (clientSecret) body.set("client_secret", clientSecret);

  let tokenRes: Response;
  try {
    tokenRes = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    return back(req, "kakao=error&code=NETWORK");
  }
  const token = (await tokenRes.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    scope?: string;
    error_code?: string;
  };
  if (!tokenRes.ok || !token.refresh_token || !token.access_token) {
    return back(req, `kakao=error&code=${safeCode(token.error_code ?? `HTTP${tokenRes.status}`)}`);
  }
  if (!(token.scope ?? "").split(" ").includes("talk_message")) {
    return back(req, "kakao=error&code=NO_SCOPE");
  }

  // 같은 계정으로 다시 연결하면 덮어쓰기가 되도록 카카오 회원번호를 id 로 쓴다
  let id = "";
  try {
    const info = await fetch(TOKEN_INFO_URL, {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    const data = (await info.json().catch(() => ({}))) as { id?: number };
    if (info.ok && typeof data.id === "number") id = `kakao-${data.id}`;
  } catch {
    /* 회원번호를 못 받으면 아래에서 임의 id 로 저장한다 */
  }
  if (!id) id = `kakao-${crypto.randomBytes(6).toString("hex")}`;

  const saved = await saveKakaoRecipient(id, label || "연결 계정", token.refresh_token);
  return back(req, saved ? "kakao=ok" : "kakao=error&code=STORE");
}
