import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../lib/admin-auth";
import { listInquiries, updateInquiryStatus } from "../../../lib/inquiries";
import { isInquiryStatus } from "../../../lib/inquiry-status";

/**
 * 홈페이지 문의 관리 API (관리자 전용)
 *
 * GET  : 문의 목록 (최신순 · 이름·연락처 포함)
 * POST : { op: "status", id, status } · 상태만 바꾼다
 *
 * /admin/inquiries 화면만 부른다. 인증은 관리자 세션 쿠키 한 갈래다.
 * 문의 내용은 개인정보라 삭제·내보내기 기능은 두지 않는다 (필요하면 DB 에서 직접).
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
  try {
    const inquiries = await listInquiries();
    return NextResponse.json({ ok: true, inquiries });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return unauthorized();
  try {
    const body = (await req.json()) as Record<string, unknown>;
    if (body.op !== "status") {
      return NextResponse.json({ ok: false, error: "지원하지 않는 작업입니다" }, { status: 400 });
    }
    const id = Number(body.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ ok: false, error: "문의 번호가 올바르지 않습니다" }, { status: 400 });
    }
    if (!isInquiryStatus(body.status)) {
      return NextResponse.json({ ok: false, error: "상태 값이 올바르지 않습니다" }, { status: 400 });
    }
    const changed = await updateInquiryStatus(id, body.status);
    if (!changed) {
      return NextResponse.json({ ok: false, error: "해당 문의를 찾을 수 없습니다" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
