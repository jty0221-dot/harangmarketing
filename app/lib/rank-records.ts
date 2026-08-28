/**
 * 플레이스 순위 계측 기록 — 홈페이지 단일 정본
 *
 * 출처: E:\하랑\순위모니터\snapshots\*.tsv (세영 · 애드랭크 일일 스냅샷)
 * 기준 스냅샷: 2026-08-26 (6회 누적 · 2026-08-21 ~ 2026-08-26)
 * 시작 순위·시작일은 애드랭크가 보관하는 30~32일치 이력에서 가장 오래된 실측값이다.
 *
 * 규칙 (헌장 C-36 · C-42)
 * 1) 순위 외 지표를 쓰지 않는다. 방문객·매출·예약 건수는 계측 대상이 아니다.
 * 2) 퍼센트로 말하지 않는다. `8위 → 3위 (7일)` 처럼 순위와 일수로만 말한다.
 * 3) 업체명·지역명을 쓰지 않는다. 업종과 키워드 유형까지만 공개한다.
 * 4) 하락·정체 기록은 싣지 않되 지우지도 않는다 (아래 EXCLUDED 참고).
 * 5) 최상급(최대·최고)은 이 파일의 계산값으로만 쓴다. 손으로 적지 않는다.
 *
 * 갱신 방법
 *   cd E:\하랑\순위모니터 && python report.py --diff
 *   최신 snapshots/YYYY-MM-DD.tsv 를 열어 아래 RECORDS 와 SUMMARY 를 다시 채운다.
 *   TSV 는 저장소 밖에 있어 빌드 시점에 읽을 수 없다. 손으로 옮기되 반드시 스냅샷을 보고 옮긴다.
 */

export type RankRecord = {
  /** 업종 — 화면에 그대로 나간다 */
  industry: string;
  /** 키워드 유형 — 지역명을 뺀 형태 */
  keyword: string;
  /** 계측 시작 순위 */
  from: number;
  /** 기준 스냅샷 순위 */
  to: number;
  /** 계측 일수 */
  days: number;
  /** 6회 스냅샷 전부에서 1~5위를 벗어나지 않았는가 */
  heldPage1: boolean;
};

/** 기준 스냅샷 날짜 — 화면 표기용 */
export const SNAPSHOT_DATE = "2026-08-26";

/**
 * 게시 가능 기록 — 상승했고, 기준일 순위가 1페이지(1~5위) 안이다.
 * 계단 수 내림차순.
 */
export const RECORDS: RankRecord[] = [
  { industry: "음식점", keyword: "지역 맛집 키워드", from: 72, to: 2, days: 32, heldPage1: true },
  { industry: "청소", keyword: "지역 상가청소 키워드", from: 67, to: 4, days: 17, heldPage1: true },
  { industry: "음식점", keyword: "지역 맛집 키워드", from: 56, to: 1, days: 32, heldPage1: false },
  { industry: "청소", keyword: "지역 청소업체 키워드", from: 49, to: 5, days: 13, heldPage1: false },
  { industry: "청소", keyword: "지역 정기청소 키워드", from: 36, to: 4, days: 17, heldPage1: true },
  { industry: "카페", keyword: "지역 카페 키워드", from: 19, to: 1, days: 20, heldPage1: false },
  { industry: "청소", keyword: "지역 병원청소 키워드", from: 22, to: 5, days: 17, heldPage1: true },
  { industry: "음식점", keyword: "지역 역세권 맛집 키워드", from: 13, to: 1, days: 32, heldPage1: true },
  { industry: "피부과", keyword: "지역 피부과 키워드", from: 10, to: 2, days: 32, heldPage1: true },
  { industry: "꽃집", keyword: "지역 꽃집 키워드", from: 8, to: 1, days: 32, heldPage1: true },
  { industry: "청소", keyword: "지역 후드청소 키워드", from: 9, to: 2, days: 8, heldPage1: true },
  { industry: "치과", keyword: "지역 역세권 치과 키워드", from: 6, to: 1, days: 32, heldPage1: true },
  { industry: "치과", keyword: "지역 치과 키워드", from: 5, to: 1, days: 32, heldPage1: true },
  { industry: "입주청소", keyword: "지역 입주청소 키워드", from: 4, to: 2, days: 32, heldPage1: false },
  { industry: "카센터", keyword: "지역 카센터 키워드", from: 5, to: 3, days: 32, heldPage1: true },
  { industry: "카페", keyword: "지역 디저트카페 키워드", from: 3, to: 1, days: 9, heldPage1: true },
  { industry: "가발", keyword: "지역 가발 키워드", from: 4, to: 3, days: 32, heldPage1: true },
];

/**
 * 싣지 않는 기록 — 지우지 않는다. 왜 안 실었는지가 남아 있어야
 * 다음 사람이 같은 숫자를 다시 주워 오지 않는다 (헌장 C-36 · 스냅샷 삭제 금지의 취지).
 *
 * 하락 — 지역 역세권 맛집 45위 → 110위 · 지역 고기집 125위 → 134위 ·
 *        지역 관광지 14위 → 26위 · 지역 네일 20위 → 21위 · 지역 맞춤가발 6위 → 9위 ·
 *        지역 정장 5위 → 7위 · 지역 맛집(해리단길) 25위 → 28위
 * 상승했으나 1페이지 밖 — 지역 꽃집 98위 → 15위 · 지역 사무실청소 94위 → 26위 ·
 *        지역 맛집 196위 → 143위 · 지역 상가청소 53위 → 8위 · 지역 피부과 21위 → 8위
 * 데이터 부족 — 4건 (계측 시작 직후라 시작값이 없다)
 */
export const EXCLUDED_COUNT = { declined: 7, outsidePage1: 5, insufficient: 4 };

/** 기준 스냅샷 집계 — 손으로 고치지 않는다. 스냅샷을 다시 세어 넣는다. */
export const SUMMARY = {
  /** 매일 계측 중인 매장 수 */
  stores: 19,
  /** 매일 계측 중인 키워드 수 (데이터 부족 4건 제외) */
  keywords: 46,
  /** 기준일에 1페이지(1~5위)를 지키고 있는 키워드 수 */
  page1Keywords: 21,
  /** 기준일에 1페이지를 지키고 있는 매장 수 */
  page1Stores: 12,
  /** 누적 스냅샷 6회 내내 한 번도 1페이지 밖으로 나가지 않은 키워드 수 */
  heldAllSnapshots: 16,
  /** 누적 스냅샷 회차 */
  snapshots: 6,
};

/** 계단 수 */
export const gap = (r: RankRecord) => r.from - r.to;

/**
 * 1페이지 진입 기록 중 최대 상승폭.
 * 「최대 순위 상승」이라고만 쓰면 거짓이 된다 — 1페이지 밖 기록에 더 큰 상승이 있다
 * (지역 꽃집 98위 → 15위 · 83계단). 반드시 조건을 붙여 쓴다.
 */
export const BIGGEST_GAIN = RECORDS.reduce((a, b) => (gap(b) > gap(a) ? b : a));

/** 업종별 기록 — 없으면 빈 배열. 없는 업종에 남의 기록을 붙이지 않는다. */
export function byIndustry(...industries: string[]): RankRecord[] {
  return RECORDS.filter((r) => industries.includes(r.industry));
}

/** `72위 → 2위` */
export const fmt = (r: RankRecord) => `${r.from}위 → ${r.to}위`;

/** `72위 → 2위 · 32일 계측` */
export const fmtLong = (r: RankRecord) => `${fmt(r)} · ${r.days}일 계측`;

/** 화면·JSON-LD·llms.txt 가 같은 문장을 쓰도록 한 곳에서 만든다 */
export const MEASURE_NOTE =
  `순위는 매일 저장한 스냅샷 실측값이며 업종·지역 경쟁 강도에 따라 달라집니다. ` +
  `방문객과 매출은 계측 대상이 아니어서 수치로 제시하지 않습니다.`;

export const PAGE1_NOTE =
  `네이버 플레이스 1페이지는 광고 지면 3개와 순위 1~5위로 구성됩니다. ` +
  `${SNAPSHOT_DATE} 기준 ${SUMMARY.page1Keywords}개 키워드가 1~5위를 지키고 있고, ` +
  `그중 ${SUMMARY.heldAllSnapshots}개는 누적 스냅샷 ${SUMMARY.snapshots}회 내내 한 번도 1페이지를 벗어나지 않았습니다.`;
