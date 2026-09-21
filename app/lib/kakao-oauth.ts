import type { NextRequest } from "next/server";
import { SITE } from "./seo";

/**
 * [카카오 계정 연결] 두 라우트(connect · callback)가 같이 쓰는 값.
 *
 * 리다이렉트 URI 는 카카오 개발자 콘솔에 글자 그대로 등록돼 있어야 한다 (아니면 KOE006).
 * 운영은 SITE.base(https://www.harangmarketing.com) 고정 — 요청 호스트를 믿지 않는다.
 * 로컬(localhost)만 http 로 되돌린다.
 */
export const KAKAO_STATE_COOKIE = "harang_kakao_state";
export const KAKAO_STATE_COOKIE_PATH = "/api/admin/kakao";

export function kakaoRedirectUri(req: NextRequest): string {
  const host = req.headers.get("host") ?? "";
  const origin = host.startsWith("localhost") ? `http://${host}` : SITE.base;
  return `${origin}/api/admin/kakao/callback`;
}
