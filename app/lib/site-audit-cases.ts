import raw from "../../content/site-audit-cases.json";

/**
 * 홈페이지 분석 · 개선안 사례 · 화면 표시용 정본 (2026-10-23 (금) 대표 지시 · 루미 배정)
 *
 * 규칙
 * 1) consent 가 true 인 사례만 화면에 오른다. 동의가 없으면 아예 넘기지 않는다.
 * 2) madeByHarang 이 false 면 화면에 제작 · 리뉴얼 낱말을 쓰지 않는다. 분석 · 개선안 사례로만 부른다.
 * 3) after 숫자는 고객 사이트를 다시 잰 값이 아니라 가상 시안에서 잰 값이다. afterNote 를 같이 보인다.
 * 4) 상호 · 지역 · 사람 · 연락처 · 도메인 · 요금 숫자는 데이터에 적지 않는다.
 *    같은 /portfolio 의 플레이스 순위 구역에 이 업종 키워드가 오르면 익명이 깨질 수 있어
 *    scripts/place-rank/build_cases.py 가 세무 업종 카드의 지역 단위를 뺀다 (AUDIT_ANON).
 */

export interface AuditImage {
  src: string;
  w: number;
  h: number;
  alt: string;
}

export interface AuditMetrics {
  label: string;
  performance: number;
  lcp: string;
  weight: string;
  pages: string;
}

export interface SiteAuditCase {
  slug: string;
  title: string;
  industry: string;
  region: string;
  kind: string;
  madeByHarang: boolean;
  consent: boolean;
  measuredAt: string;
  work: string[];
  good: string[];
  issues: string[];
  before: AuditMetrics;
  after: AuditMetrics;
  afterNote: string;
  images: { before: AuditImage; after: AuditImage };
  demo?: string;
  service?: string;
}

const ALL = (raw as { cases: SiteAuditCase[] }).cases;

/** 동의가 확인된 사례만 */
export const SITE_AUDIT_CASES: SiteAuditCase[] = ALL.filter((c) => c.consent === true);

export function siteAuditCase(slug: string): SiteAuditCase | undefined {
  return SITE_AUDIT_CASES.find((c) => c.slug === slug);
}

/** 2026-10-23 → 2026.10.23 */
export function auditDate(iso: string): string {
  return iso.split("-").join(".");
}
