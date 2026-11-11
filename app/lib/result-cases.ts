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
  // 아래는 전부 선택 칸이다. 없으면 상세 화면에서 그 구역을 그리지 않는다 (2026-11-11 대표 지적 '단순하게만 쓰면 신뢰도가 올라?')
  headline?: { value: string; label: string }[];
  diagnosis?: { problem: string; action: string; result: string }[];
  timeline?: { when: string; what: string }[];
  series?: RankSeries[];
  series_note?: string;
  scope?: string[];
  voice?: { text: string; who: string };
  // 전후 사진 : 연진 manifest(본부장\영상\성과사례_전후_*) 기준 · 그림은 public/cases/<id>/ 로 복사해 쓴다
  beforeAfter?: { caption: string; before: string; after: string; beforeDate: string; afterDate: string }[];
}

export interface RankSeries {
  label: string;
  unit: string;
  points: { d: string; v: number | null }[];
}

export const RESULT_CASES: ResultCase[] = (raw as (ResultCase & { source?: unknown; proof?: unknown })[]).map(
  ({ source: _source, proof: _proof, ...c }) => c,
);

export const getResultCase = (id: string) => RESULT_CASES.find((c) => c.id === id);

// 목록 구역 소개 문장 : 아론 본부장\블로그\성과사례_목록소개_20261111.md 발행 본문 세 줄.
// 원문 '다섯 곳' 은 case-01 을 화면에서 뺀 뒤(2026-11-11 준수 판정) 실제 건수에 맞춰 '네 곳' 으로 옮겼다. 건수가 바뀌면 같이 고친다
export const RESULT_CASES_INTRO = [
  "하랑이 실제로 맡았던 매장 네 곳의 기록입니다. 상호와 지역, 검색어 원문은 가렸고, 숫자는 그 매장 대표님께 드린 보고서와 매일 자동으로 잰 순위 기록에서 그대로 옮겼습니다.",
  "좋았던 날만 고르지 않았습니다. 순위가 내려간 날과 아직 돌아오지 못한 숫자도 같은 그래프와 표에 그대로 남겼습니다.",
  "순위는 검색하는 위치와 시간에 따라 달라지며, 같은 결과를 약속드리는 자료가 아닙니다.",
];

/** 대표 숫자 한 줄 : headline 첫 칸이 있으면 그것, 없으면 첫 결과 줄 */
export function leadFigure(c: ResultCase) {
  const h = c.headline?.[0];
  if (h) return { value: h.value, label: h.label };
  const r = c.results[0];
  return r ? { value: `${r.before} → ${r.after}`, label: r.label } : null;
}

// 진행한 서비스 이름 → 이미 있는 서비스 안내 주소. 안내 쪽이 없는 서비스(블로그 · 광고 · 계측)는 링크를 걸지 않는다
const SERVICE_PAGES = [
  { match: "플레이스", name: "플레이스 관리", href: "/services/place" },
  { match: "체험단", name: "체험단", href: "/services/review" },
  { match: "카페 배포", name: "카페 배포", href: "/services/cafe-distribution" },
];

export const serviceLinks = (services: string[]) =>
  SERVICE_PAGES.filter((p) => services.some((s) => s.includes(p.match) && !s.includes("계측")));

/** 같은 업종을 먼저, 모자라면 목록 순서로 채워 두 건 */
export const otherCases = (c: ResultCase) =>
  [...RESULT_CASES.filter((o) => o.id !== c.id)]
    .sort((a, b) => Number(b.industry === c.industry) - Number(a.industry === c.industry))
    .slice(0, 2);
