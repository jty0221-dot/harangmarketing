import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "node:crypto";
import { createSessionToken, ADMIN_COOKIE_NAME } from "../../../lib/admin-auth";

/* 무차별 대입 지연 — 인스턴스 단위라 완전 차단은 아니고 자동 대입을 늦추는 장치다.
   cheongsulmo 어드민 로그인과 같은 방식으로 맞춘다. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

/** 길이까지 감추기 위해 해시를 떠서 상수시간 비교한다 */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "시도가 너무 많습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({ password: "" }));
    const password = typeof body?.password === "string" ? body.password : "";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { ok: false, error: "서버에 관리자 비밀번호(ADMIN_PASSWORD)가 설정되지 않았습니다. 관리자에게 문의하세요." },
        { status: 500 }
      );
    }
    if (!safeEqual(password, adminPassword)) {
      return NextResponse.json({ ok: false, error: "비밀번호가 일치하지 않습니다" }, { status: 401 });
    }
    if (!process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.json(
        { ok: false, error: "서버에 세션 비밀키(ADMIN_SESSION_SECRET)가 설정되지 않았습니다. 관리자에게 문의하세요." },
        { status: 500 }
      );
    }

    attempts.delete(ip);

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
