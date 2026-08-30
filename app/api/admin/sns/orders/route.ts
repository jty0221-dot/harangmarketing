import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../../lib/admin-auth";
import {
  getAllOrders,
  getOrderByNo,
  markDispatched,
  markDispatchFailed,
  syncOrderStatus,
  cancelAndRefund,
} from "../../../../lib/member-orders";
import { panelAddOrder, panelStatusMulti, mapPanelStatus } from "../../../../lib/smm-panel";

/**
 * 회원 잔액 주문 관리 (DB orders)
 * 비회원 건별 주문(GitHub 대장)은 /api/admin/sns 가 담당한다.
 */

async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ ok: true, orders });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

/** { op: "dispatch" | "refresh" | "cancel", no? } */
export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { op?: string; no?: string };

  try {
    /* ── 재발주: 결제는 됐으나 파트너 발주가 실패한 주문 ── */
    if (body.op === "dispatch") {
      const order = await getOrderByNo(String(body.no));
      if (!order) return NextResponse.json({ ok: false, error: "주문 없음" }, { status: 404 });
      if (order.panelOrderId)
        return NextResponse.json({ ok: false, error: "이미 발주된 주문입니다" }, { status: 400 });
      if (order.status !== "pending")
        return NextResponse.json({ ok: false, error: `발주 가능한 상태가 아닙니다 (${order.status})` }, { status: 400 });

      try {
        const panelOrderId = await panelAddOrder({
          sid: order.sid,
          link: order.link,
          quantity: order.qty,
          comments: order.comments ?? undefined,
        });
        await markDispatched(order.no, panelOrderId);
        return NextResponse.json({ ok: true, panelOrderId });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        await markDispatchFailed(order.no, msg).catch(() => {});
        return NextResponse.json({ ok: false, error: `발주 실패: ${msg}` }, { status: 502 });
      }
    }

    /* ── 상태 동기화: 진행 중인 주문 전체 ── */
    if (body.op === "refresh") {
      const orders = await getAllOrders();
      const active = orders.filter(
        (o) => o.panelOrderId && (o.status === "processing" || o.status === "partial")
      );
      if (active.length === 0) return NextResponse.json({ ok: true, updated: 0 });

      const map = await panelStatusMulti(active.map((o) => o.panelOrderId as number));
      let updated = 0;
      for (const o of active) {
        const ps = map[String(o.panelOrderId)];
        if (!ps?.status) continue;
        const next = mapPanelStatus(ps.status);
        const startCount = ps.start_count !== undefined ? Number(ps.start_count) : (o.startCount ?? undefined);
        const remains = ps.remains !== undefined ? Number(ps.remains) : (o.remains ?? undefined);
        if (next !== o.status || ps.status !== o.panelStatus || remains !== o.remains) {
          await syncOrderStatus(o.no, { status: next, panelStatus: ps.status, startCount, remains });
          updated++;
        }
      }
      return NextResponse.json({ ok: true, updated });
    }

    /* ── 취소 + 환불: 발주 전 주문만 ── */
    if (body.op === "cancel") {
      const result = await cancelAndRefund(String(body.no));
      if (!result)
        return NextResponse.json(
          { ok: false, error: "취소할 수 없는 주문입니다 (이미 발주됐거나 처리됨)" },
          { status: 400 }
        );
      return NextResponse.json({ ok: true, result });
    }

    return NextResponse.json({ ok: false, error: "알 수 없는 작업" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
