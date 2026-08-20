import { NextRequest, NextResponse } from "next/server";
import { readOrders, updateOrder, contactMatches } from "../../../lib/sns-orders";
import { panelStatusMulti, mapPanelStatus } from "../../../lib/smm-panel";
import { ORDER_STATUS_LABEL, platformName, type OrderStatus, type PlatformId } from "../../../lib/sns-store";

/**
 * 주문 조회 (공개)
 *
 * 주문번호 + 주문 시 남긴 연락처가 둘 다 맞아야 상태를 보여준다.
 * 응답에는 연락처·링크 같은 개인정보를 다시 담지 않는다.
 */
export async function POST(req: NextRequest) {
  let body: { no?: string; contact?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "요청 형식이 올바르지 않습니다" }, { status: 400 });
  }

  const no = String(body.no ?? "").trim().toUpperCase();
  const contact = String(body.contact ?? "").trim();
  if (!no || contact.length < 4) {
    return NextResponse.json({ ok: false, error: "주문번호와 연락처를 입력해 주세요" }, { status: 400 });
  }

  let orders;
  try {
    orders = await readOrders();
  } catch (e) {
    console.error("주문 조회 실패:", e);
    return NextResponse.json({ ok: false, error: "조회 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }

  const order = orders.find((o) => o.no.toUpperCase() === no);
  if (!order || !contactMatches(order.contact, contact)) {
    return NextResponse.json(
      { ok: false, error: "주문을 찾지 못했습니다. 주문번호와 연락처를 다시 확인해 주세요." },
      { status: 404 }
    );
  }

  // 발주된 주문은 파트너 쪽 최신 상태를 실시간으로 반영한다 (실패해도 저장값으로 응답)
  let status: OrderStatus = order.status;
  let startCount = order.startCount;
  let remains = order.remains;
  if (order.panelOrderId && status !== "completed" && status !== "canceled") {
    try {
      const map = await panelStatusMulti([order.panelOrderId]);
      const ps = map[String(order.panelOrderId)];
      if (ps?.status) {
        status = mapPanelStatus(ps.status);
        startCount = ps.start_count !== undefined ? Number(ps.start_count) : startCount;
        remains = ps.remains !== undefined ? Number(ps.remains) : remains;
        if (status !== order.status || remains !== order.remains) {
          await updateOrder(order.no, { status, panelStatus: ps.status, startCount, remains }, `상태 동기화: ${order.no}`).catch(() => {});
        }
      }
    } catch {
      // 파트너 조회 실패 시 저장된 상태로 응답
    }
  }

  return NextResponse.json({
    ok: true,
    order: {
      no: order.no,
      createdAt: order.createdAt,
      platformId: order.platform,
      platform: platformName(order.platform as PlatformId),
      productName: order.productName,
      qty: order.qty,
      total: order.total,
      status,
      statusLabel: ORDER_STATUS_LABEL[status],
      startCount: startCount ?? null,
      remains: remains ?? null,
    },
  });
}
