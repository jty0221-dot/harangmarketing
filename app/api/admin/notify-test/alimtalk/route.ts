import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../../lib/admin-auth";
import { alimtalkEnvStatus, sendInquiryAlimtalk, ALIMTALK_TEMPLATE_TEXT } from "../../../../lib/alimtalk";

/**
 * 알림톡 점검 API (관리자 전용 · 2026-10-03 (토))
 *
 * GET  : 환경변수 유무와 빠진 이름 · 받는 번호 개수 · 심사에 올릴 템플릿 본문. 보내지 않는다
 * POST : 받는 번호마다 시험 알림톡 한 통 (문의 번호 0 · 들어온 곳 알림 점검 시험)
 * 비밀값 · 번호는 돌려주지 않는다. /admin/notify-test 의 알림톡 칸만 부른다.
 */

async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

function unauthorized() {
  return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
}

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  return NextResponse.json({ ok: true, status: alimtalkEnvStatus(), template: ALIMTALK_TEMPLATE_TEXT });
}

export async function POST() {
  if (!(await isAuthed())) return unauthorized();
  const result = await sendInquiryAlimtalk({ id: 0, source: "알림 점검 시험", industry: "시험 발송" });
  if (!result.ok && !result.skipped) console.error("알림톡 점검 실패:", result.error);
  return NextResponse.json({ ok: result.ok, status: alimtalkEnvStatus(), result });
}
