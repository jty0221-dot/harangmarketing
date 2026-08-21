import { getSql, withTransaction } from "./db";

/**
 * 충전(가상계좌/무통장) 신청 · 승인 데이터 계층
 *
 * P4(포트원) 전까지는 pg_provider='manual' 무통장 방식:
 *   회원이 충전 신청(pending) → 사장님이 입금 확인 → approveCharge 로 잔액 반영.
 * P4 에서는 포트원 웹훅이 approveCharge 자리를 자동으로 대신한다.
 */

export interface Charge {
  id: number;
  memberId: number;
  amount: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

type Row = Record<string, unknown>;

function mapCharge(r: Row): Charge {
  return {
    id: Number(r.id),
    memberId: Number(r.member_id),
    amount: Number(r.amount),
    status: String(r.status),
    createdAt: String(r.created_at),
    paidAt: r.paid_at == null ? null : String(r.paid_at),
  };
}

/** 무통장 충전 신청 생성 (pending) */
export async function createChargeRequest(memberId: number, amount: number): Promise<Charge> {
  const rows = (await getSql()`
    insert into charges (member_id, amount, status, pg_provider)
    values (${memberId}, ${amount}, 'pending', 'manual')
    returning *
  `) as Row[];
  return mapCharge(rows[0]);
}

/** 회원 본인의 충전 신청 내역 */
export async function getMemberCharges(memberId: number, limit = 20): Promise<Charge[]> {
  const rows = (await getSql()`
    select * from charges where member_id = ${memberId}
    order by created_at desc limit ${limit}
  `) as Row[];
  return rows.map(mapCharge);
}

export interface PendingCharge extends Charge {
  memberName: string;
  memberPhone: string;
}

/** 어드민: 입금 확인이 필요한(대기중) 충전 신청 — 회원 정보 포함 */
export async function getPendingCharges(): Promise<PendingCharge[]> {
  const rows = (await getSql()`
    select c.*, m.name as member_name, m.phone as member_phone
    from charges c join members m on m.id = c.member_id
    where c.status = 'pending'
    order by c.created_at asc
  `) as Row[];
  return rows.map((r) => ({
    ...mapCharge(r),
    memberName: String(r.member_name),
    memberPhone: String(r.member_phone),
  }));
}

/**
 * 어드민 승인 — 입금 확인된 충전 신청을 잔액에 반영한다.
 * charge 상태 전환 + 잔액 증가 + 원장 기록을 한 트랜잭션으로 처리한다.
 * 멱등: 이미 처리된(=pending 아님) 건은 null 을 반환한다(이중 지급 방지).
 */
export async function approveCharge(
  chargeId: number
): Promise<{ memberId: number; amount: number; balanceAfter: number } | null> {
  return withTransaction(async (c) => {
    const ch = await c.query(
      "update charges set status='paid', paid_at=now() where id=$1 and status='pending' returning member_id, amount",
      [chargeId]
    );
    if (ch.rowCount === 0) return null;
    const memberId = Number(ch.rows[0].member_id);
    const amount = Number(ch.rows[0].amount);
    const upd = await c.query(
      "update members set balance = balance + $1 where id=$2 returning balance",
      [amount, memberId]
    );
    const balanceAfter = Number(upd.rows[0].balance);
    await c.query(
      "insert into ledger (member_id, kind, amount, balance_after, ref) values ($1,'charge',$2,$3,$4)",
      [memberId, amount, balanceAfter, `충전신청#${chargeId}`]
    );
    return { memberId, amount, balanceAfter };
  });
}

/** 어드민: 충전 신청 반려 (입금 없음 등) */
export async function rejectCharge(chargeId: number): Promise<boolean> {
  const rows = (await getSql()`
    update charges set status='failed' where id = ${chargeId} and status = 'pending' returning id
  `) as Row[];
  return rows.length > 0;
}
