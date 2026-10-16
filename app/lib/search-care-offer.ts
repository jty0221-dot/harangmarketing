/**
 * 네이버 통합검색 월 관리 안내 팝업 (블로그 마케팅 · 카페 배포 페이지)
 *
 * 2026-10-16 (금) 대표 지시 「이거 하랑에 맞춰 변경하고 블로그, 카페 배포쪽에 팝업 같이 뜨도록」.
 * 원본 홍보물의 「통검 상위노출 · 25일 노출보장 · 노출 확인 후 입금」 은 쓰지 않는다.
 * 10/13 네이버가 이 사이트 광고를 막은 사유가 「상위노출 · 노출보장」 문구였고, 노출을 조건으로 한
 * 약속도 위반 항목으로 적혀 있다 (광고운영_태욱\재점검_20261011\네이버_비즈채널_정정실행표_20261013.md).
 * 대표가 「네이버 기준 문구로」 를 골랐다. 상품 구조(월 300,000원부터 · 25일 · 선입금 없음 ·
 * 카페 또는 블로그 · 키워드별 확인)는 그대로 두고, 우리가 실제로 하는 일(원고 · 게시 · 매일 확인 · 기록 보고)로 적는다.
 *
 * 금액은 부가세 별도(공급가)다 (2026-10-16 대표 결정 「전부 부가세 미포함 기준으로 작성해」). 금액을 바꾸는 것은 C-35 결재다.
 */

/** 이 팝업을 띄우는 경로. 앞부분이 맞으면 하위 경로까지 뜬다 */
export const SEARCH_CARE_PATHS = ["/services/blog-marketing", "/services/cafe-distribution"];

export const SEARCH_CARE_OFFER = {
  /** 이 값을 바꾸면 하루 그만 보기를 누른 사람에게도 다시 뜬다 */
  id: "search-care-2026-10-16",
  eyebrow: "네이버 통합검색 월 관리",
  title: "카페 · 블로그 통합검색 월 관리",
  price: "300,000원부터",
  priceNote: "월 단위 · 25일 기록 기준 · 부가세 별도",
  points: [
    "카페 또는 블로그 중 키워드에 맞는 쪽으로 원고를 쓰고 게시합니다",
    "25일 동안 통합검색에서 글이 보이는지 매일 확인해 기록으로 보고합니다",
    "선입금 없이 진행하고, 기록을 확인하신 뒤 정산합니다",
    "키워드마다 진행 가능 여부와 단가를 먼저 확인해 드립니다",
  ],
  footnote: "검색 결과의 위치는 네이버가 정합니다. 몇 위에 오른다고 약속드리지 않고, 매일 확인한 기록을 그대로 보여드립니다.",
  cta: "키워드 보내고 단가 받기",
  later: "오늘은 그만 보기",
} as const;

/** 하루 그만 보기 기록 키. 값은 그만 보기를 누른 날짜(YYYY-MM-DD · 한국 시간)다 */
export const SEARCH_CARE_STORAGE_KEY = `harang_offer_${SEARCH_CARE_OFFER.id}`;

export function searchCareShowsOn(pathname: string): boolean {
  return SEARCH_CARE_PATHS.some((p) => pathname.startsWith(p));
}

/** 오늘 날짜 (한국 시간). 하루 그만 보기는 자정이 지나면 풀린다 */
export function todayKst(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
}
