import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../../lib/admin-auth";
import { listInquiries } from "../../../../lib/inquiries";
import { INQUIRY_STATUS_LABEL, inquirySourceLabel } from "../../../../lib/inquiry-status";
import { buildInquiryReply } from "../../../../lib/inquiry-reply";

/**
 * 홈페이지 문의 피드 (관리자 전용 · 읽기만)
 *
 * 왜 있나 : 준수(본부장)와 보라(상담실장)는 로컬에서 도는 에이전트라 관리자 화면을 열 수 없다.
 *   scripts/inquiries/pull.js 가 이 피드를 읽어 최근 문의와 첫 답 문안을 보고 파일로 만든다.
 * 인증은 /api/admin/reports 와 같은 두 갈래다.
 *   1) 관리자 세션 쿠키
 *   2) Authorization: Bearer <REPORTS_API_TOKEN> (환경변수가 없으면 쿠키만 허용)
 * 응답에는 이름과 연락처가 그대로 실린다. 받는 쪽(pull.js)이 화면 밖으로 낼 때 가린다.
 * 상태를 바꾸거나 무엇을 보내지는 않는다. 보내는 것은 사람이다.
 *
 * GET /api/admin/inquiries/feed?since=24h
 *   since : 24h · 7d 같은 상대값, 또는 YYYY-MM-DD 나 ISO 시각. 기본 24h
 */

export const dynamic = "force-dynamic";

const MAX_ROWS = 300;

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

/** since 값을 시각으로 푼다. 못 풀면 null */
function parseSince(raw: string | null): Date | null {
  const v = (raw || "24h").trim();
  const rel = /^(\d{1,3})([hd])$/.exec(v);
  if (rel) {
    const n = Number(rel[1]);
    const ms = rel[2] === "h" ? n * 3_600_000 : n * 86_400_000;
    return new Date(Date.now() - ms);
  }
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET(req: NextRequest) {
  if (!(await isAuthed(req))) return unauthorized();

  const since = parseSince(req.nextUrl.searchParams.get("since"));
  if (!since) {
    return NextResponse.json(
      { ok: false, error: "since 는 24h · 7d 같은 상대값이나 YYYY-MM-DD 로 적습니다" },
      { status: 400 },
    );
  }

  try {
    const rows = await listInquiries(MAX_ROWS);
    const sinceMs = since.getTime();
    const inquiries = rows
      .filter((r) => new Date(r.createdAt).getTime() >= sinceMs)
      // 메모는 관리자 화면 안에서만 보는 내부 기록이라 피드로 내보내지 않는다
      .map((r) => ({
        ...r,
        memo: undefined,
        sourceLabel: inquirySourceLabel(r.source),
        statusLabel: INQUIRY_STATUS_LABEL[r.status],
        // 관리자 화면과 같은 문안. 같은 문의면 같은 글이 나온다
        reply: buildInquiryReply(r),
      }));
    return NextResponse.json({
      ok: true,
      since: since.toISOString(),
      count: inquiries.length,
      inquiries,
    });
  } catch (e) {
    console.error("문의 피드 실패:", e);
    return NextResponse.json({ ok: false, error: "문의를 불러오지 못했습니다" }, { status: 500 });
  }
}
