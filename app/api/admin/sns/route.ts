import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../lib/admin-auth";
import { readOrders, updateOrder } from "../../../lib/sns-orders";
import { panelAddOrder, panelBalance, panelStatusMulti, mapPanelStatus } from "../../../lib/smm-panel";

/**
 * SNS 부스트 스토어 — 어드민 주문 관리
 *
 * GET  : 주문 목록 + 공급 파트너 잔액
 * POST : { op: "submit" | "refresh" | "cancel" | "memo", no?, memo? }
 *
 * submit 은 실제 비용이 차감되는 발주다.
 * 반드시 입금을 확인한 주문에만 실행할 것 (버튼 라벨에도 명시).
 */

async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
  }
  try {
    const orders = await readOrders();
    let balance: { balance: number; currency: string } | null = null;
    try {
      balance = await panelBalance();
    } catch {
      // 잔액 조회 실패는 목록 표시를 막지 않는다
    }
    return NextResponse.json({ ok: true, orders, balance });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
  }

  const body = (await req.json()) as { op?: string; no?: string; memo?: string };
  const op = body.op;

  try {
    /* ── 발주: 입금 확인된 대기 주문을 공급 파트너에 넣는다 ── */
    if (op === "submit") {
      const orders = await readOrders();
      const order = orders.find((o) => o.no === body.no);
      if (!order) return NextResponse.json({ ok: false, error: "주문 없음" }, { status: 404 });
      if (order.panelOrderId) {
        return NextResponse.json({ ok: false, error: "이미 발주된 주문입니다 (중복 발주 방지)" }, { status: 400 });
      }
      if (order.status !== "pending") {
        return NextResponse.json({ ok: false, error: `발주 가능한 상태가 아닙니다 (${order.status})` }, { status: 400 });
      }
      try {
        const panelOrderId = await panelAddOrder({
          sid: order.sid,
          link: order.link,
          quantity: order.qty,
          comments: order.comments,
        });
        const updated = await updateOrder(
          order.no,
          {
            panelOrderId,
            status: "processing",
            submittedAt: new Date().toISOString(),
            lastError: undefined,
          },
          `발주: ${order.no}`
        );
        return NextResponse.json({ ok: true, order: updated });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        await updateOrder(order.no, { lastError: msg }, `발주 실패 기록: ${order.no}`).catch(() => {});
        return NextResponse.json({ ok: false, error: `발주 실패: ${msg}` }, { status: 502 });
      }
    }

    /* ── 상태 새로고침: 발주된 진행 중 주문 전체를 한 번에 동기화 ── */
    if (op === "refresh") {
      const orders = await readOrders();
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
        const startCount = ps.start_count !== undefined ? Number(ps.start_count) : o.startCount;
        const remains = ps.remains !== undefined ? Number(ps.remains) : o.remains;
        if (next !== o.status || ps.status !== o.panelStatus || remains !== o.remains) {
          await updateOrder(o.no, { status: next, panelStatus: ps.status, startCount, remains }, `상태 동기화: ${o.no}`);
          updated++;
        }
      }
      return NextResponse.json({ ok: true, updated });
    }

    /* ── 취소: 발주 전 주문만 로컬에서 취소 처리 ── */
    if (op === "cancel") {
      const orders = await readOrders();
      const order = orders.find((o) => o.no === body.no);
      if (!order) return NextResponse.json({ ok: false, error: "주문 없음" }, { status: 404 });
      if (order.panelOrderId) {
        return NextResponse.json(
          { ok: false, error: "이미 발주된 주문입니다. 취소는 카카오톡으로 파트너 확인 후 처리하세요." },
          { status: 400 }
        );
      }
      const updated = await updateOrder(order.no, { status: "canceled" }, `주문 취소: ${order.no}`);
      return NextResponse.json({ ok: true, order: updated });
    }

    /* ── 메모 ── */
    if (op === "memo") {
      if (typeof body.memo !== "string") {
        return NextResponse.json({ ok: false, error: "메모 내용 없음" }, { status: 400 });
      }
      const updated = await updateOrder(String(body.no), { adminMemo: body.memo }, `메모: ${body.no}`);
      return NextResponse.json({ ok: true, order: updated });
    }

    return NextResponse.json({ ok: false, error: "알 수 없는 작업" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
