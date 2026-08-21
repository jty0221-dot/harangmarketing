import { withTransaction } from "./db";

/**
 * 예치금 잔액 증감 (원자적)
 *
 * balance 갱신과 ledger(원장) 기록을 한 트랜잭션으로 처리한다.
 * 동시에 여러 요청이 와도 UPDATE 의 조건(balance >= amount)과 트랜잭션이
 * 잔액을 음수로 만들지 않는다. balance = SUM(ledger.amount) 불변식 유지.
 */

/** 충전·환불·조정 — 잔액을 늘린다. 반환: 반영 후 잔액(원) */
export async function creditMember(
  memberId: number,
  amount: number,
  kind: "charge" | "refund" | "admin_adjust",
  ref?: string,
  memo?: string
): Promise<number> {
  if (!Number.isInteger(amount) || amount <= 0) throw new Error("금액이 올바르지 않습니다");
  return withTransaction(async (c) => {
    const upd = await c.query(
      "update members set balance = balance + $1 where id = $2 returning balance",
      [amount, memberId]
    );
    if (upd.rowCount === 0) throw new Error("회원을 찾을 수 없습니다");
    const balanceAfter = Number(upd.rows[0].balance);
    await c.query(
      "insert into ledger (member_id, kind, amount, balance_after, ref, memo) values ($1,$2,$3,$4,$5,$6)",
      [memberId, kind, amount, balanceAfter, ref ?? null, memo ?? null]
    );
    return balanceAfter;
  });
}

/** 주문 — 잔액을 줄인다. 잔액 부족이면 예외. 반환: 반영 후 잔액(원) */
export async function debitMember(
  memberId: number,
  amount: number,
  kind: "order" | "admin_adjust",
  ref?: string,
  memo?: string
): Promise<number> {
  if (!Number.isInteger(amount) || amount <= 0) throw new Error("금액이 올바르지 않습니다");
  return withTransaction(async (c) => {
    const upd = await c.query(
      "update members set balance = balance - $1 where id = $2 and balance >= $1 returning balance",
      [amount, memberId]
    );
    if (upd.rowCount === 0) throw new Error("잔액이 부족합니다");
    const balanceAfter = Number(upd.rows[0].balance);
    await c.query(
      "insert into ledger (member_id, kind, amount, balance_after, ref, memo) values ($1,$2,$3,$4,$5,$6)",
      [memberId, kind, -amount, balanceAfter, ref ?? null, memo ?? null]
    );
    return balanceAfter;
  });
}
