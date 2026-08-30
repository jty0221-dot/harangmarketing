import crypto from "crypto";
import { getSql } from "./db";

/**
 * SNS 스토어 회원 데이터 계층 (서버 전용)
 * 비밀번호는 scrypt 로 해시해 저장한다(평문 저장 금지).
 */

export interface Member {
  id: number;
  phone: string;
  name: string;
  balance: number;
  status: string;
  createdAt: string;
}

/** 휴대폰 번호에서 숫자만 남긴다 — 로그인 아이디 정규화(하이픈·공백 무시) */
export function normalizePhone(input: string): string {
  return (input || "").replace(/[^0-9]/g, "");
}

/** 저장용 해시: `${salt}:${hash}` */
export function hashPassword(pw: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(pw: string, stored: string): boolean {
  const [salt, hash] = (stored || "").split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(pw, salt, 64).toString("hex");
  const a = Buffer.from(hash);
  const b = Buffer.from(test);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

type Row = Record<string, unknown>;

function mapMember(r: Row): Member {
  return {
    id: Number(r.id),
    phone: String(r.phone),
    name: String(r.name),
    balance: Number(r.balance), // 원 단위 — 21억 미만이라 number 안전
    status: String(r.status),
    createdAt: String(r.created_at),
  };
}

export async function getMemberByPhone(phone: string): Promise<Member | null> {
  const rows = (await getSql()`select * from members where phone = ${phone} limit 1`) as Row[];
  return rows[0] ? mapMember(rows[0]) : null;
}

/** 로그인용 — 비밀번호 해시를 함께 반환한다(다른 곳에는 해시를 노출하지 않는다) */
export async function getMemberAuthByPhone(
  phone: string
): Promise<{ member: Member; passwordHash: string } | null> {
  const rows = (await getSql()`select * from members where phone = ${phone} limit 1`) as Row[];
  if (!rows[0]) return null;
  return { member: mapMember(rows[0]), passwordHash: String(rows[0].password_hash) };
}

export async function getMemberById(id: number): Promise<Member | null> {
  const rows = (await getSql()`select * from members where id = ${id} limit 1`) as Row[];
  return rows[0] ? mapMember(rows[0]) : null;
}

/** 회원 생성. phone 중복이면 DB unique 제약이 에러를 던진다(호출부에서 처리). */
export async function createMember(
  phone: string,
  name: string,
  passwordHash: string
): Promise<Member> {
  const rows = (await getSql()`
    insert into members (phone, name, password_hash)
    values (${phone}, ${name}, ${passwordHash})
    returning *
  `) as Row[];
  return mapMember(rows[0]);
}

export interface MemberSummary extends Member {
  orderCount: number;
  chargedTotal: number;
}

/** 어드민: 전체 회원 + 주문 건수·누적 충전액 */
export async function getAllMembers(): Promise<MemberSummary[]> {
  const rows = (await getSql()`
    select m.*,
           (select count(*) from orders o where o.member_id = m.id) as order_count,
           coalesce((select sum(l.amount) from ledger l
                      where l.member_id = m.id and l.kind = 'charge'), 0) as charged_total
      from members m
     order by m.created_at desc
  `) as Row[];
  return rows.map((r) => ({
    ...mapMember(r),
    orderCount: Number(r.order_count),
    chargedTotal: Number(r.charged_total),
  }));
}

/** 최근 원장(충전·주문·환불 내역) */
export interface LedgerEntry {
  id: number;
  kind: string;
  amount: number;
  balanceAfter: number;
  ref: string | null;
  memo: string | null;
  createdAt: string;
}

export async function getLedger(memberId: number, limit = 30): Promise<LedgerEntry[]> {
  const rows = (await getSql()`
    select * from ledger where member_id = ${memberId}
    order by created_at desc limit ${limit}
  `) as Row[];
  return rows.map((r) => ({
    id: Number(r.id),
    kind: String(r.kind),
    amount: Number(r.amount),
    balanceAfter: Number(r.balance_after),
    ref: r.ref == null ? null : String(r.ref),
    memo: r.memo == null ? null : String(r.memo),
    createdAt: String(r.created_at),
  }));
}
