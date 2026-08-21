import { getSql, withTransaction } from "./db";
import { calcTotal, type SnsProduct, type OrderStatus } from "./sns-store";
import { genOrderNo } from "./sns-orders";

/**
 * 회원 잔액 주문 (서버 전용)
 *
 * 비회원 건별 주문(app/lib/sns-orders.ts, GitHub 대장)과 별개다.
 * 회원 주문은 예치금에서 즉시 결제되므로 입금 확인 단계가 없고,
 * 결제 성공 즉시 공급 파트너로 발주한다.
 *
 * 상태 의미 (회원 주문 기준)
 *   pending    결제 완료 · 발주 대기 (파트너 발주 실패 시 여기 머문다 → 어드민이 재시도)
 *   processing 발주 완료 · 진행 중
 *   partial    부분 완료
 *   completed  완료
 *   canceled   취소(환불 처리됨)
 */

export class InsufficientBalance extends Error {
  constructor() {
    super("잔액이 부족합니다");
    this.name = "InsufficientBalance";
  }
}

export interface MemberOrder {
  no: string;
  memberId: number | null;
  product: string;
  productName: string;
  platform: string;
  sid: number;
  qty: number;
  unitPrice: number;
  total: number;
  link: string;
  comments: string | null;
  status: OrderStatus;
  panelOrderId: number | null;
  panelStatus: string | null;
  startCount: number | null;
  remains: number | null;
  createdAt: string;
  submittedAt: string | null;
  lastError: string | null;
}

type Row = Record<string, unknown>;

function mapOrder(r: Row): MemberOrder {
  const num = (v: unknown) => (v == null ? null : Number(v));
  const str = (v: unknown) => (v == null ? null : String(v));
  return {
    no: String(r.no),
    memberId: num(r.member_id),
    product: String(r.product),
    productName: String(r.product_name),
    platform: String(r.platform),
    sid: Number(r.sid),
    qty: Number(r.qty),
    unitPrice: Number(r.unit_price),
    total: Number(r.total),
    link: String(r.link),
    comments: str(r.comments),
    status: String(r.status) as OrderStatus,
    panelOrderId: num(r.panel_order_id),
    panelStatus: str(r.panel_status),
    startCount: num(r.start_count),
    remains: num(r.remains),
    createdAt: String(r.created_at),
    submittedAt: str(r.submitted_at),
    lastError: str(r.last_error),
  };
}

/**
 * 잔액 결제 주문 생성 — 차감·주문·원장을 한 트랜잭션으로 처리한다.
 * 잔액이 모자라면 InsufficientBalance 를 던지고 아무것도 남기지 않는다.
 */
export async function createMemberOrder(opts: {
  memberId: number;
  product: SnsProduct;
  qty: number;
  link: string;
  comments?: string;
}): Promise<{ no: string; total: number; balanceAfter: number }> {
  const { memberId, product, qty, link, comments } = opts;
  const total = calcTotal(product, qty);

  // 주문번호 충돌(희박)에 대비해 몇 번 다시 뽑는다. 실패한 트랜잭션은 롤백되므로 재시도가 안전하다.
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    const no = genOrderNo();
    try {
      return await withTransaction(async (c) => {
        const upd = await c.query(
          "update members set balance = balance - $1 where id = $2 and balance >= $1 returning balance",
          [total, memberId]
        );
        if (upd.rowCount === 0) throw new InsufficientBalance();
        const balanceAfter = Number(upd.rows[0].balance);

        await c.query(
          `insert into orders
             (no, member_id, product, product_name, platform, sid, qty, unit_price, total, link, comments, status)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending')`,
          [
            no,
            memberId,
            product.slug,
            product.name,
            product.platform,
            product.sid,
            qty,
            product.unitPrice,
            total,
            link,
            comments ?? null,
          ]
        );
        await c.query(
          "insert into ledger (member_id, kind, amount, balance_after, ref) values ($1,'order',$2,$3,$4)",
          [memberId, -total, balanceAfter, no]
        );
        return { no, total, balanceAfter };
      });
    } catch (e) {
      if (e instanceof InsufficientBalance) throw e;
      lastErr = e;
      // 주문번호 중복이면 다시 뽑아 재시도, 그 외 오류면 즉시 중단
      if (!String(e).includes("orders_pkey")) throw e;
    }
  }
  throw lastErr ?? new Error("주문 생성에 실패했습니다");
}

export async function getMemberOrders(memberId: number, limit = 50): Promise<MemberOrder[]> {
  const rows = (await getSql()`
    select * from orders where member_id = ${memberId}
    order by created_at desc limit ${limit}
  `) as Row[];
  return rows.map(mapOrder);
}

export async function getOrderByNo(no: string): Promise<MemberOrder | null> {
  const rows = (await getSql()`select * from orders where no = ${no} limit 1`) as Row[];
  return rows[0] ? mapOrder(rows[0]) : null;
}

/** 발주 대기(pending) 또는 진행 중인 주문 — 어드민 목록·상태 동기화용 */
export async function getAllOrders(limit = 200): Promise<MemberOrder[]> {
  const rows = (await getSql()`
    select * from orders order by created_at desc limit ${limit}
  `) as Row[];
  return rows.map(mapOrder);
}

/** 발주 성공 기록 */
export async function markDispatched(no: string, panelOrderId: number): Promise<void> {
  await getSql()`
    update orders
       set panel_order_id = ${panelOrderId}, status = 'processing',
           submitted_at = now(), last_error = null
     where no = ${no}
  `;
}

/** 발주 실패 기록 — 주문은 pending 으로 남겨 어드민이 재시도한다 */
export async function markDispatchFailed(no: string, message: string): Promise<void> {
  await getSql()`update orders set last_error = ${message.slice(0, 500)} where no = ${no}`;
}

/** 파트너 상태 동기화 */
export async function syncOrderStatus(
  no: string,
  patch: { status: OrderStatus; panelStatus?: string; startCount?: number; remains?: number }
): Promise<void> {
  await getSql()`
    update orders
       set status = ${patch.status},
           panel_status = ${patch.panelStatus ?? null},
           start_count = ${patch.startCount ?? null},
           remains = ${patch.remains ?? null}
     where no = ${no}
  `;
}

/**
 * 주문 취소 + 환불 — 발주 전(panel_order_id 없음) 주문만 가능.
 * 상태 전환·잔액 복구·원장을 한 트랜잭션으로 처리한다. 멱등(이미 취소면 null).
 */
export async function cancelAndRefund(
  no: string
): Promise<{ memberId: number; amount: number; balanceAfter: number } | null> {
  return withTransaction(async (c) => {
    const o = await c.query(
      "update orders set status='canceled' where no=$1 and status='pending' and panel_order_id is null returning member_id, total",
      [no]
    );
    if (o.rowCount === 0) return null;
    const memberId = Number(o.rows[0].member_id);
    const amount = Number(o.rows[0].total);
    if (!memberId) return null; // 회원 주문이 아니면 환불 대상이 아니다

    const upd = await c.query(
      "update members set balance = balance + $1 where id=$2 returning balance",
      [amount, memberId]
    );
    const balanceAfter = Number(upd.rows[0].balance);
    await c.query(
      "insert into ledger (member_id, kind, amount, balance_after, ref, memo) values ($1,'refund',$2,$3,$4,'주문 취소 환불')",
      [memberId, amount, balanceAfter, no]
    );
    return { memberId, amount, balanceAfter };
  });
}
