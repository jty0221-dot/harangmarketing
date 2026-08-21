import crypto from "crypto";
import { getSql } from "./db";

/**
 * 클라이언트 진행 보고서 데이터 계층 (서버 전용)
 *
 * 왜 있나
 *   카카오 알림톡 버튼(작업 완료 보고 · 주간 진행 보고)이 여는 페이지다.
 *   사장님은 로그인 없이 코드 하나로 열어본다 — 그래서 코드는 추측 불가능해야 하고,
 *   페이지는 검색엔진에 잡히면 안 된다(다른 업체 보고서가 검색에 뜨면 사고다).
 *
 * 코드 규칙
 *   12자. 헷갈리는 글자(0 O 1 l I)를 뺀 31자 알파벳 → 31^12 ≈ 7.9e17 가지.
 *   무작위 대입으로 맞출 수 없는 크기다.
 */

const CODE_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz"; // 0 o 1 l i 제외
const CODE_LENGTH = 12;

export function newCode(): string {
  const bytes = crypto.randomBytes(CODE_LENGTH * 2);
  let out = "";
  for (let i = 0; out.length < CODE_LENGTH && i < bytes.length; i++) {
    // 편향을 없애려고 알파벳 길이의 배수를 넘는 값은 버린다
    const max = Math.floor(256 / CODE_ALPHABET.length) * CODE_ALPHABET.length;
    if (bytes[i] >= max) continue;
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out.length === CODE_LENGTH ? out : newCode();
}

export function isValidCode(code: string): boolean {
  if (typeof code !== "string" || code.length !== CODE_LENGTH) return false;
  for (const ch of code) if (!CODE_ALPHABET.includes(ch)) return false;
  return true;
}

export interface ReportMetric {
  label: string;
  before: string;
  after: string;
}

export interface Report {
  code: string;
  clientId: string | null;
  clientName: string;
  title: string;
  period: string;
  summary: string;
  metrics: ReportMetric[];
  body: string;
  requests: string;
  status: "draft" | "published";
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  lastViewedAt: string | null;
}

export interface ReportInput {
  code?: string;
  clientId?: string | null;
  clientName: string;
  title: string;
  period?: string;
  summary?: string;
  metrics?: ReportMetric[];
  body?: string;
  requests?: string;
  status?: "draft" | "published";
}

type Row = Record<string, unknown>;

/**
 * 테이블이 없으면 만든다. 프로세스당 한 번만 확인한다.
 *
 * 왜 이렇게 하나
 *   보고서 하나 쓰자고 Neon 콘솔에 들어가 SQL 을 붙여넣는 단계를 없애려는 것이다.
 *   create table if not exists 라서 이미 있으면 아무 일도 하지 않고, 데이터를 건드리지도 않는다.
 *   나중에 컬럼이 바뀌면 이 함수가 아니라 scripts/db/reports-schema.sql 을 고쳐 직접 반영해야 한다.
 */
let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        create table if not exists reports (
          code           text primary key,
          client_id      text,
          client_name    text not null,
          title          text not null,
          period         text,
          summary        text,
          metrics        jsonb not null default '[]',
          body           text not null default '',
          requests       text,
          status         text not null default 'draft',
          view_count     integer not null default 0,
          created_at     timestamptz not null default now(),
          updated_at     timestamptz not null default now(),
          published_at   timestamptz,
          last_viewed_at timestamptz
        )
      `;
      await sql`create index if not exists reports_client_idx on reports(client_name, created_at desc)`;
      await sql`create index if not exists reports_created_idx on reports(created_at desc)`;
    })().catch((e) => {
      schemaReady = null; // 실패하면 다음 요청에서 다시 시도한다
      throw e;
    });
  }
  return schemaReady;
}

function str(v: unknown): string {
  return v == null ? "" : String(v);
}

function mapReport(r: Row): Report {
  let raw = r.metrics;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = [];
    }
  }
  // 읽을 때도 같은 규칙으로 거른다.
  // 저장 규칙을 바꾸기 전에 들어간 줄(값 없이 라벨만 있는 것)이 DB 에 남아 있어도
  // 화면에 '- → -' 로 나오지 않게 하려는 것이다. 다시 저장하지 않아도 고쳐진다.
  const metrics = cleanMetrics(raw);
  return {
    code: String(r.code),
    clientId: r.client_id == null ? null : String(r.client_id),
    clientName: str(r.client_name),
    title: str(r.title),
    period: str(r.period),
    summary: str(r.summary),
    metrics,
    body: str(r.body),
    requests: str(r.requests),
    status: r.status === "published" ? "published" : "draft",
    viewCount: Number(r.view_count || 0),
    createdAt: str(r.created_at),
    updatedAt: str(r.updated_at),
    publishedAt: r.published_at == null ? null : String(r.published_at),
    lastViewedAt: r.last_viewed_at == null ? null : String(r.last_viewed_at),
  };
}

/**
 * 지표 배열 정리 — 문자열 강제, 개수 제한, 쓸모없는 줄 제거.
 *
 * 값(이전·현재)이 하나도 없는 줄은 버린다. 화면에 '- → -' 로 찍혀서
 * 아무 정보도 주지 못하고 보고서만 허술해 보이기 때문이다(라벨만 적고 값을 안 채운 경우).
 */
export function cleanMetrics(input: unknown): ReportMetric[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((m) => {
      const o = (m || {}) as Record<string, unknown>;
      return { label: str(o.label).trim(), before: str(o.before).trim(), after: str(o.after).trim() };
    })
    .filter((m) => m.before || m.after)
    .slice(0, 12);
}

/** 공개 조회 — published 만. 조회수·최근 열람시각을 함께 올린다. */
export async function getPublishedReport(code: string): Promise<Report | null> {
  if (!isValidCode(code)) return null;
  await ensureSchema();
  const rows = (await getSql()`
    update reports
       set view_count = view_count + 1,
           last_viewed_at = now()
     where code = ${code} and status = 'published'
    returning *
  `) as Row[];
  return rows[0] ? mapReport(rows[0]) : null;
}

/** 관리자 조회 — 임시저장(draft)도 본다. 조회수는 올리지 않는다. */
export async function getReport(code: string): Promise<Report | null> {
  if (!isValidCode(code)) return null;
  await ensureSchema();
  const rows = (await getSql()`select * from reports where code = ${code} limit 1`) as Row[];
  return rows[0] ? mapReport(rows[0]) : null;
}

export async function listReports(limit = 100): Promise<Report[]> {
  await ensureSchema();
  const rows = (await getSql()`
    select * from reports order by created_at desc limit ${limit}
  `) as Row[];
  return rows.map(mapReport);
}

/** 새 보고서. code 를 돌려준다(링크에 쓸 값). */
export async function createReport(input: ReportInput): Promise<Report> {
  await ensureSchema();
  const code = input.code && isValidCode(input.code) ? input.code : newCode();
  const status = input.status === "published" ? "published" : "draft";
  const rows = (await getSql()`
    insert into reports (code, client_id, client_name, title, period, summary, metrics, body, requests, status, published_at)
    values (
      ${code},
      ${input.clientId || null},
      ${input.clientName},
      ${input.title},
      ${input.period || ""},
      ${input.summary || ""},
      ${JSON.stringify(cleanMetrics(input.metrics))}::jsonb,
      ${input.body || ""},
      ${input.requests || ""},
      ${status},
      ${status === "published" ? new Date().toISOString() : null}
    )
    returning *
  `) as Row[];
  return mapReport(rows[0]);
}

/** 수정. 처음 published 로 바뀌는 순간에만 published_at 을 박는다. */
export async function updateReport(code: string, input: ReportInput): Promise<Report | null> {
  if (!isValidCode(code)) return null;
  await ensureSchema();
  const status = input.status === "published" ? "published" : "draft";
  const rows = (await getSql()`
    update reports set
      client_id   = ${input.clientId || null},
      client_name = ${input.clientName},
      title       = ${input.title},
      period      = ${input.period || ""},
      summary     = ${input.summary || ""},
      metrics     = ${JSON.stringify(cleanMetrics(input.metrics))}::jsonb,
      body        = ${input.body || ""},
      requests    = ${input.requests || ""},
      status      = ${status},
      updated_at  = now(),
      published_at = case
        when ${status} = 'published' and published_at is null then now()
        else published_at
      end
    where code = ${code}
    returning *
  `) as Row[];
  return rows[0] ? mapReport(rows[0]) : null;
}

export async function deleteReport(code: string): Promise<boolean> {
  if (!isValidCode(code)) return false;
  await ensureSchema();
  const rows = (await getSql()`delete from reports where code = ${code} returning code`) as Row[];
  return rows.length > 0;
}
