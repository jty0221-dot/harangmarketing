import { getSql } from "./db";
import { INQUIRY_MEMO_MAX, isInquiryStatus, type InquiryStatus } from "./inquiry-status";

/**
 * 상담 신청 저장 (서버 전용)
 *
 * 예전에는 카카오 웹훅만 쏘고 아무 데도 남기지 않았다. 알림을 놓치면 문의가 사라졌다.
 * 이제 DB 에 남긴다. 웹훅은 그대로 두되, 저장이 먼저다.
 *
 * 공개 알림(홈페이지 우하단)에는 이름·연락처를 절대 내보내지 않는다.
 * 업종과 경과 시간만 쓴다.
 */

export interface InquiryInput {
  name: string;
  phone: string;
  industry?: string;
  budget?: string;
  goals?: string;
  message?: string;
  source?: string;
}

let tableReady = false;

async function ensureTable() {
  if (tableReady) return;
  await getSql()`
    create table if not exists inquiries (
      id         bigserial primary key,
      name       text not null,
      phone      text not null,
      industry   text,
      region     text,
      budget     text,
      goals      text,
      message    text,
      source     text,
      status     text not null default 'new',
      memo       text,
      created_at timestamptz not null default now()
    )
  `;
  // 관리자 메모 (2026-09-24 추가). 이미 있는 테이블에도 붙도록 따로 한 번 더 건다.
  // 기본값 없는 nullable 열이라 기존 행을 다시 쓰지 않는다.
  // 여기서 실패해도 상담 신청 저장은 막지 않는다 (저장이 먼저다). 메모 화면만 오류를 본다.
  try {
    await getSql()`alter table inquiries add column if not exists memo text`;
  } catch (e) {
    console.error("inquiries memo 열 추가 실패:", e);
  }
  await getSql()`create index if not exists inquiries_created_idx on inquiries(created_at desc)`;
  tableReady = true;
}

export async function saveInquiry(input: InquiryInput): Promise<number> {
  await ensureTable();
  const rows = (await getSql()`
    insert into inquiries (name, phone, industry, budget, goals, message, source)
    values (${input.name}, ${input.phone}, ${input.industry ?? null},
            ${input.budget ?? null}, ${input.goals ?? null},
            ${input.message ?? null}, ${input.source ?? null})
    returning id
  `) as Record<string, unknown>[];
  return Number(rows[0].id);
}

export interface PublicInquiry {
  industry: string;
  createdAt: string;
}

/** 공개 알림용 — 최근 상담 신청을 업종·시각만 남겨 반환한다 */
export async function getRecentPublicInquiries(limit = 8): Promise<PublicInquiry[]> {
  try {
    await ensureTable();
    const rows = (await getSql()`
      select industry, created_at from inquiries
      where created_at > now() - interval '30 days'
      order by created_at desc limit ${limit}
    `) as Record<string, unknown>[];
    return rows
      .filter((r) => r.industry)
      .map((r) => ({ industry: String(r.industry), createdAt: String(r.created_at) }));
  } catch {
    return [];
  }
}

export interface InquiryRow {
  id: number;
  name: string;
  phone: string;
  industry: string | null;
  budget: string | null;
  goals: string | null;
  message: string | null;
  source: string | null;
  status: InquiryStatus;
  /** 관리자 내부 메모. 없으면 null */
  memo: string | null;
  createdAt: string;
}

function toIso(v: unknown): string {
  const d = new Date(v as string | number | Date);
  return Number.isNaN(d.getTime()) ? String(v) : d.toISOString();
}

/**
 * 관리자 화면용 전체 목록 (최신순). 여기서만 이름·연락처가 나간다.
 * 호출하는 쪽(/api/admin/inquiries)이 관리자 세션을 확인한다.
 */
export async function listInquiries(limit = 300): Promise<InquiryRow[]> {
  await ensureTable();
  const rows = (await getSql()`
    select id, name, phone, industry, budget, goals, message, source, status, memo, created_at
    from inquiries
    order by created_at desc, id desc
    limit ${limit}
  `) as Record<string, unknown>[];
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name ?? ""),
    phone: String(r.phone ?? ""),
    industry: r.industry ? String(r.industry) : null,
    budget: r.budget ? String(r.budget) : null,
    goals: r.goals ? String(r.goals) : null,
    message: r.message ? String(r.message) : null,
    source: r.source ? String(r.source) : null,
    status: isInquiryStatus(r.status) ? r.status : "new",
    memo: r.memo ? String(r.memo) : null,
    createdAt: toIso(r.created_at),
  }));
}

/** 상태만 바꾼다. 없는 번호면 false */
export async function updateInquiryStatus(id: number, status: InquiryStatus): Promise<boolean> {
  await ensureTable();
  const rows = (await getSql()`
    update inquiries set status = ${status} where id = ${id} returning id
  `) as Record<string, unknown>[];
  return rows.length > 0;
}

/**
 * 메모만 바꾼다. null 이나 빈 문자열이면 메모를 지운다. 없는 번호면 false.
 * 길이 검사는 API 가 먼저 하지만, 여기서도 상한을 넘으면 저장하지 않는다.
 */
export async function updateInquiryMemo(id: number, memo: string | null): Promise<boolean> {
  const value = memo ? memo : null;
  if (value && value.length > INQUIRY_MEMO_MAX) {
    throw new Error(`메모는 ${INQUIRY_MEMO_MAX}자까지 저장합니다`);
  }
  await ensureTable();
  const rows = (await getSql()`
    update inquiries set memo = ${value} where id = ${id} returning id
  `) as Record<string, unknown>[];
  return rows.length > 0;
}
