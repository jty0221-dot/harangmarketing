// 사례 종류 (2026-11-11 대표 지시 '플레이스만 보고서에 해당 되는 것이 아님') · 한 사례가 여럿을 가질 수 있다
// 클라이언트 필터도 이 파일을 쓴다. 사례 자료(JSON)를 가져오는 result-cases.ts 와 따로 둬야 자료가 브라우저 번들로 딸려 가지 않는다
export type CaseKind = "place" | "blog" | "seo" | "content" | "local";
export const KIND_LABEL: Record<CaseKind, string> = {
  place: "플레이스 순위 관리",
  blog: "블로그",
  seo: "SEO 세팅",
  content: "콘텐츠",
  local: "지역 소식",
};
/** 목록 필터 칩에 올리는 종류 (사례가 0건이면 칩을 그리지 않는다) */
export const FILTER_KINDS: CaseKind[] = ["place", "blog", "seo", "content"];

