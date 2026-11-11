import raw from "../../content/result-cases.json";

/**
 * 성과 사례 — 고객에게 드린 결과 보고서를 상호 · 지역을 가려 다시 쓴 것 (2026-11-11 (수) 대표 지시).
 * 글은 아론이 쓰고(본부장\블로그\성과사례_초안_*.json) 화면은 여기서 읽기만 한다.
 * 근거 보고서 코드(source) 는 화면에 내보내지 않는다. 옮길 때 빼고 넣고, 혹시 남아 있어도 여기서 버린다.
 * sample: true 는 실제 자료가 오기 전 가상 시안이다. 운영 반영 전에 실제 자료로 바꾼다.
 */

export interface ResultRow {
  label: string;
  before: string;
  after: string;
  note?: string;
}

export interface ResultCase {
  id: string;
  sample?: boolean;
  label: string;
  industry: string;
  region: string;
  period: string;
  services: string[];
  before: string;
  did: string[];
  results: ResultRow[];
  low?: string;
  summary: string;
}

export const RESULT_CASES: ResultCase[] = (raw as (ResultCase & { source?: unknown })[]).map(
  ({ source: _source, ...c }) => c,
);

export const getResultCase = (id: string) => RESULT_CASES.find((c) => c.id === id);
