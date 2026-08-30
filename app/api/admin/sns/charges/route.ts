import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../../lib/admin-auth";
import { getPendingCharges, approveCharge, rejectCharge } from "../../../../lib/charges";

async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

/** 입금 확인이 필요한(대기중) 충전 신청 목록 */
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
  try {
    const charges = await getPendingCharges();
    return NextResponse.json({ ok: true, charges });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

/** { op: "approve" | "reject", id } */
export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { op?: string; id?: number };
  const id = Number(body.id);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false, error: "잘못된 요청" }, { status: 400 });

  try {
    if (body.op === "approve") {
      const result = await approveCharge(id);
      if (!result)
        return NextResponse.json({ ok: false, error: "이미 처리되었거나 없는 신청입니다" }, { status: 400 });
      return NextResponse.json({ ok: true, result });
    }
    if (body.op === "reject") {
      const ok = await rejectCharge(id);
      if (!ok) return NextResponse.json({ ok: false, error: "이미 처리되었거나 없는 신청입니다" }, { status: 400 });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "알 수 없는 작업" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
