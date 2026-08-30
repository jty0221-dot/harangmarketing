import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../../lib/admin-auth";
import { getAllMembers, getLedger } from "../../../../lib/members";
import { creditMember, debitMember } from "../../../../lib/wallet";

async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

/** 회원 목록 (+ memberId 지정 시 해당 회원 원장) */
export async function GET(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
  try {
    const idParam = req.nextUrl.searchParams.get("memberId");
    if (idParam) {
      const ledger = await getLedger(Number(idParam), 50);
      return NextResponse.json({ ok: true, ledger });
    }
    const members = await getAllMembers();
    return NextResponse.json({ ok: true, members });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

/**
 * 잔액 수동 조정 — { op: "adjust", memberId, amount, memo }
 * amount 가 양수면 지급, 음수면 차감. 원장에 admin_adjust 로 남는다.
 */
export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as {
    op?: string;
    memberId?: number;
    amount?: number;
    memo?: string;
  };
  const memberId = Number(body.memberId);
  const amount = Math.floor(Number(body.amount));
  if (body.op !== "adjust") return NextResponse.json({ ok: false, error: "알 수 없는 작업" }, { status: 400 });
  if (!Number.isFinite(memberId) || !Number.isFinite(amount) || amount === 0) {
    return NextResponse.json({ ok: false, error: "회원과 금액을 확인해 주세요" }, { status: 400 });
  }

  try {
    const balanceAfter =
      amount > 0
        ? await creditMember(memberId, amount, "admin_adjust", undefined, body.memo || "관리자 지급")
        : await debitMember(memberId, -amount, "admin_adjust", undefined, body.memo || "관리자 차감");
    return NextResponse.json({ ok: true, balanceAfter });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
