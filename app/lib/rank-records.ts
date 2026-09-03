/**
 * 플레이스 순위 계측 기록 — 홈페이지 단일 정본
 *
 * 출처: E:\하랑\순위모니터\snapshots\*.tsv (세영 · 애드랭크 일일 스냅샷)
 * 기준 스냅샷: 2026-08-31 (11회 누적 · 2026-08-21 ~ 2026-08-31)
 * 시작 순위·시작일은 애드랭크가 보관하는 30~32일치 이력에서 가장 오래된 실측값이다.
 *
 * 규칙 (헌장 C-36 · C-42)
 * 1) 순위 외 지표를 쓰지 않는다. 방문객·매출·예약 건수는 계측 대상이 아니다.
 * 2) 퍼센트로 말하지 않는다. `8위 → 3위 (7일)` 처럼 순위와 일수로만 말한다.
 * 3) 업체명·지역명을 쓰지 않는다. 업종과 키워드 유형까지만 공개한다.
 * 4) 하락·정체 기록은 싣지 않되 지우지도 않는다 (아래 EXCLUDED 참고).
 * 5) 최상급(최대·최고)은 이 파일의 계산값으로만 쓴다. 손으로 적지 않는다.
 *
 * 갱신 방법 — 손으로 세지 않는다
 *   python scripts/place-rank/rank_records.py
 *   찍힌 블록을 아래 RECORDS · EXCLUDED · SUMMARY 자리에 그대로 옮긴다.
 *   TSV 는 저장소 밖에 있어 빌드 시점에 읽을 수 없다. 그래서 옮겨 적되 세는 건 스크립트가 한다.
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
  /** 누적 스냅샷 전 회차에 빠짐없이 잡히면서 1~5위를 한 번도 벗어나지 않았는가 */
  heldPage1: boolean;
};

/** 기준 스냅샷 날짜 — 화면 표기용 */
export const SNAPSHOT_DATE = "2026-08-31";

/**
 * 게시 가능 기록 — 상승했고, 기준일 순위가 1페이지(1~5위) 안이다.
 * 계단 수 내림차순.
 *
 * 같은 매장의 키워드가 둘이면 줄도 둘이다. 표기가 겹쳐도 묶지 않는다
 * (2026-09-04 (금) 대표 지시 — 겹치는 게 있다면 그래도 추가해 별도의 작품이니깐).
 */
export const RECORDS: RankRecord[] = [
  { industry: "음식점", keyword: "지역 맛집 키워드", from: 72, to: 2, days: 32, heldPage1: false },
  { industry: "음식점", keyword: "지역 맛집 키워드", from: 70, to: 4, days: 32, heldPage1: true },
  { industry: "청소", keyword: "지역 상가청소 키워드", from: 67, to: 3, days: 22, heldPage1: true },
  { industry: "청소", keyword: "지역 상가청소 키워드", from: 53, to: 4, days: 13, heldPage1: false },
  { industry: "청소", keyword: "지역 청소업체 키워드", from: 49, to: 3, days: 18, heldPage1: false },
  { industry: "음식점", keyword: "지역 맛집 키워드", from: 44, to: 3, days: 32, heldPage1: false },
  { industry: "청소", keyword: "지역 정기청소 키워드", from: 36, to: 4, days: 22, heldPage1: true },
  { industry: "카페", keyword: "지역 카페 키워드", from: 19, to: 1, days: 25, heldPage1: false },
  { industry: "청소", keyword: "지역 병원청소 키워드", from: 22, to: 5, days: 22, heldPage1: true },
  { industry: "음식점", keyword: "지역 역세권 맛집 키워드", from: 11, to: 1, days: 32, heldPage1: true },
  { industry: "청소", keyword: "지역 후드청소 키워드", from: 9, to: 2, days: 13, heldPage1: true },
  { industry: "꽃집", keyword: "지역 꽃집 키워드", from: 7, to: 1, days: 32, heldPage1: true },
  { industry: "치과", keyword: "지역 치과 키워드", from: 7, to: 2, days: 32, heldPage1: true },
  { industry: "치과", keyword: "지역 역세권 치과 키워드", from: 7, to: 2, days: 32, heldPage1: true },
  { industry: "카페", keyword: "지역 카페 키워드", from: 8, to: 4, days: 32, heldPage1: true },
  { industry: "피부과", keyword: "지역 피부과 키워드", from: 6, to: 3, days: 32, heldPage1: true },
  { industry: "가발", keyword: "지역 가발 키워드", from: 3, to: 2, days: 32, heldPage1: true },
  { industry: "카페", keyword: "지역 디저트카페 키워드", from: 3, to: 2, days: 14, heldPage1: true },
];

/**
 * 싣지 않는 기록 — 지우지 않는다. 왜 안 실었는지가 남아 있어야
 * 다음 사람이 같은 숫자를 다시 주워 오지 않는다 (헌장 C-36 · 스냅샷 삭제 금지의 취지).
 *
 * 하락 — 지역 맛집 70위 → 199위 · 지역 고기집 36위 → 49위 · 지역 고기집 12위 → 18위 ·
 *        지역 청소업체 5위 → 9위 · 지역 맛집 79위 → 83위 · 지역 입주청소 2위 → 5위 ·
 *        지역 맞춤가발 6위 → 9위 · 지역 소갈비 29위 → 32위 · 지역 입주청소 2위 → 4위 ·
 *        지역 정장 7위 → 8위 · 지역 정장 8위 → 9위 · 지역 카페 3위 → 4위
 * 1페이지 밖 — 지역 꽃집 65위 → 20위 · 지역 입주청소 88위 → 43위 · 지역 맛집 187위 → 155위 ·
 *        지역 정기청소 35위 → 9위 · 지역 맛집 57위 → 33위 · 지역 병원청소 22위 → 6위 ·
 *        지역 카페 50위 → 35위 · 지역 네일 20위 → 10위 · 지역 네일 18위 → 9위 ·
 *        지역 카페 20위 → 12위 · 지역 샤브샤브 43위 → 39위 · 지역 카페 9위 → 6위 ·
 *        지역 피부과 13위 → 10위 · 지역 맛집 20위 → 18위 · 지역 청소업체 12위 → 10위 ·
 *        지역 고기집 31위 → 29위 · 지역 역세권 맛집 77위 → 76위 · 지역 데이트 12위 → 11위 ·
 *        지역 맛집 68위 → 68위 · 지역 맛집 12위 → 12위 · 지역 샤브샤브 6위 → 6위
 * 1~5위인데 그대로 — 지역 카페 1위 · 지역 샤브샤브 3위 · 지역 카센터 5위
 *        (이미 1페이지에 있어 올릴 자리가 없다. 지키는 것이 일이라 상승 기록에는 넣지 않는다)
 * 데이터 부족 — 8건 (계측 시작 직후라 시작값이 없다)
 */
export const EXCLUDED_COUNT = { declined: 12, outsidePage1: 21, heldNoGain: 3, insufficient: 8 };

/** 기준 스냅샷 집계 — 손으로 고치지 않는다. scripts/place-rank/rank_records.py 를 다시 돌린다. */
export const SUMMARY = {
  /** 매일 계측 중인 매장 수 */
  stores: 18,
  /** 매일 계측 중인 키워드 수 (시작값이 없는 8건 제외) */
  keywords: 54,
  /** 기준일에 1페이지(1~5위)를 지키고 있는 키워드 수 */
  page1Keywords: 24,
  /** 기준일에 1페이지를 지키고 있는 매장 수 */
  page1Stores: 13,
  /** 누적 스냅샷 11회에 빠짐없이 잡히면서 한 번도 1페이지 밖으로 나가지 않은 키워드 수 */
  heldAllSnapshots: 16,
  /** 누적 스냅샷 회차 */
  snapshots: 11,
};

/** 계단 수 */
export const gap = (r: RankRecord) => r.from - r.to;

/**
 * 1페이지 진입 기록 중 최대 상승폭.
 * 조건을 빼고 「최대 순위 상승」이라고만 쓰지 않는다. 1페이지 밖 기록이 더 클 때가 있어서
 * (2026-08-26 기준에는 지역 꽃집 98위 → 15위 · 83계단이 있었다) 조건이 빠진 문장은
 * 스냅샷이 바뀌는 날 거짓이 된다. 지금 우연히 전체 최대와 같더라도 조건은 붙여 둔다.
 */
export const BIGGEST_GAIN = RECORDS.reduce((a, b) => (gap(b) > gap(a) ? b : a));

/** 업종별 기록 — 없으면 빈 배열. 없는 업종에 남의 기록을 붙이지 않는다. */
export function byIndustry(...industries: string[]): RankRecord[] {
  return RECORDS.filter((r) => industries.includes(r.industry));
}

/**
 * 업종 대표 기록 — 그 업종에서 계단 수가 가장 큰 것.
 *
 * 없는 업종이면 undefined 다. 없는 업종에 남의 기록을 붙이지 않는다 (C-42).
 * 화면 여섯 곳이 이 값을 손으로 적고 있었는데, 스냅샷이 6회에서 11회로 바뀌자
 * 여섯 중 넷이 틀린 숫자가 됐다 (치과 5위 → 1위는 아예 사라진 기록이었다).
 * 손으로 적는 자리를 없애려고 만든 함수다.
 */
export function best(industry: string): RankRecord | undefined {
  return byIndustry(industry).reduce<RankRecord | undefined>(
    (a, b) => (a === undefined || gap(b) > gap(a) ? b : a),
    undefined,
  );
}

/**
 * 키워드 표기로 찾는다 — 같은 표기가 여럿이면 계단 수가 가장 큰 것.
 *
 * 없으면 undefined 다. 화면은 그 자리를 비우거나 「계측 중」으로 내린다.
 * 스냅샷이 바뀌면 기록이 사라지기도 한다 — 실제로 지역 치과 5위 → 1위는
 * 08-31 스냅샷에서 사라졌는데 화면 다섯 곳에 그대로 남아 있었다.
 */
export function byKeyword(keyword: string): RankRecord | undefined {
  return RECORDS.filter((r) => r.keyword === keyword).reduce<RankRecord | undefined>(
    (a, b) => (a === undefined || gap(b) > gap(a) ? b : a),
    undefined,
  );
}

/** `19위가 1위가 됐습니다(25일 계측)` — 서술문에 넣는 형태 */
export const fmtSentence = (r: RankRecord) => `${r.from}위가 ${r.to}위가 됐습니다(${r.days}일 계측)`;

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
