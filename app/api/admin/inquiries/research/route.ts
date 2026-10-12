import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "../../../../lib/admin-auth";
import { listInquiries } from "../../../../lib/inquiries";
import { buildInquiryReply } from "../../../../lib/inquiry-reply";
import { researchInquiryLinks } from "../../../../lib/inquiry-research";
import { getPublicInquiryKnowledge } from "../../../../lib/inquiry-knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Read-only research. URLs come from the stored inquiry, never a request-supplied URL. */
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  let authorized = false;
  try { authorized = verifySessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value); } catch { /* Missing secret must fail closed. */ }
  const token = process.env.REPORTS_API_TOKEN;
  const bearer = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!authorized && token && bearer) {
    const a = Buffer.from(bearer), b = Buffer.from(token);
    authorized = a.length === b.length && timingSafeEqual(a, b);
  }
  if (!authorized) return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ ok: false, error: "문의 번호가 올바르지 않습니다" }, { status: 400 });
  try {
    const inquiry = (await listInquiries(300)).find(q => q.id === id);
    if (!inquiry) return NextResponse.json({ ok: false, error: "문의를 찾을 수 없습니다" }, { status: 404 });
    const initial = buildInquiryReply(inquiry);
    const support = initial.assessment?.intents.some(i => ["refund", "complaint", "existing"].includes(i));
    const [research, knowledge] = await Promise.all([
      initial.reviewed || support ? Promise.resolve({ links: [], checkedAt: new Date().toISOString(), truncated: false }) : researchInquiryLinks(inquiry.message),
      initial.assessment?.intents.includes("price") && !initial.reviewed && !support ? getPublicInquiryKnowledge() : Promise.resolve(null),
    ]);
    return NextResponse.json({ ok: true, research, reply: buildInquiryReply({ ...inquiry, research, knowledge }) }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "문의 링크를 확인하지 못했습니다" }, { status: 500 });
  }
}
