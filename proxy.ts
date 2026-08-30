import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "./app/lib/admin-auth";

/**
 * Next 16 에서 middleware 규약이 proxy 로 바뀌었다.
 * proxy 는 항상 Node.js 런타임으로 돌고 runtime 설정을 export 하면 에러가 난다.
 * (admin-auth 가 node crypto 를 쓰므로 기존 runtime = "nodejs" 와 동작이 같다)
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
