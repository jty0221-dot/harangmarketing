import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../lib/admin-auth";
import {
  listReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  isValidCode,
  type ReportInput,
} from "../../../lib/reports";

/**
 * 보고서 관리 API (관리자 전용)
 *
 * 인증은 두 갈래를 받는다.
 *  1) 관리자 세션 쿠키 — 브라우저에서 /admin/reports 로 쓸 때
 *  2) Authorization: Bearer <REPORTS_API_TOKEN> — 세금계산서 시스템·스크립트가 자동 등록할 때
 * 2번은 환경변수 REPORTS_API_TOKEN 이 설정된 경우에만 열린다(미설정이면 쿠키만 허용).
 */

async function isAuthed(req: NextRequest): Promise<boolean> {
  const store = await cookies();
  if (verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value)) return true;

  const token = process.env.REPORTS_API_TOKEN;
  if (!token) return false;
  const header = req.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  // 길이가 다르면 timingSafeEqual 이 던지므로 먼저 거른다
  if (!bearer || bearer.length !== token.length) return false;
  const a = Buffer.from(bearer);
  const b = Buffer.from(token);
  const { timingSafeEqual } = await import("crypto");
  return timingSafeEqual(a, b);
}

function unauthorized() {
  return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
}

function normalize(input: Record<string, unknown>): ReportInput | string {
  const clientName = String(input.clientName || "").trim();
  const title = String(input.title || "").trim();
  if (!clientName) return "업체명을 입력해주세요";
  if (!title) return "보고서 제목을 입력해주세요";
  return {
    clientId: input.clientId ? String(input.clientId).trim() : null,
    clientName,
    title,
    period: String(input.period || "").trim(),
    summary: String(input.summary || "").trim(),
    metrics: Array.isArray(input.metrics) ? (input.metrics as ReportInput["metrics"]) : [],
    body: String(input.body || ""),
    requests: String(input.requests || "").trim(),
    status: input.status === "published" ? "published" : "draft",
  };
}

export async function GET(req: NextRequest) {
  if (!(await isAuthed(req))) return unauthorized();
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (code) {
      const report = await getReport(code);
      if (!report) return NextResponse.json({ ok: false, error: "보고서를 찾을 수 없습니다" }, { status: 404 });
      return NextResponse.json({ ok: true, report });
    }
    return NextResponse.json({ ok: true, reports: await listReports() });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed(req))) return unauthorized();
  try {
    const raw = (await req.json()) as Record<string, unknown>;
    const input = normalize(raw);
    if (typeof input === "string") return NextResponse.json({ ok: false, error: input }, { status: 400 });

    const code = raw.code ? String(raw.code) : "";
    if (code) {
      if (!isValidCode(code)) return NextResponse.json({ ok: false, error: "코드 형식이 올바르지 않습니다" }, { status: 400 });
      const updated = await updateReport(code, input);
      if (!updated) return NextResponse.json({ ok: false, error: "보고서를 찾을 수 없습니다" }, { status: 404 });
      return NextResponse.json({ ok: true, report: updated });
    }
    return NextResponse.json({ ok: true, report: await createReport(input) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthed(req))) return unauthorized();
  try {
    const code = req.nextUrl.searchParams.get("code") || "";
    const removed = await deleteReport(code);
    if (!removed) return NextResponse.json({ ok: false, error: "보고서를 찾을 수 없습니다" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
