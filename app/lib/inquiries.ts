import { getSql } from "./db";

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
      created_at timestamptz not null default now()
    )
  `;
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
