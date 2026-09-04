import raw from "../../content/place-rank-cases.json";

/**
 * 네이버 플레이스 순위 계측 사례 — 홈페이지 표시용 정본
 *
 * 원본은 E:\하랑\순위모니터\성과대장.tsv 이고,
 * scripts/place-rank/build_cases.py 가 가림 처리까지 끝낸 뒤 content 파일을 쓴다.
 * 대장이 바뀌면 그 스크립트를 다시 돌린다. 손으로 숫자를 고치지 않는다.
 *
 *   python scripts/place-rank/build_cases.py --write
 *
 * 규칙 (헌장 C-36 · C-41 · C-42 · C-50)
 * 1) storeLabel · keywordLabel 을 화면에서 다시 만들지 않는다. 이미 가림이 끝난 값이다.
 *    상호를 유추해 넣거나 새 이름을 붙이지 않는다.
 * 2) 상호와 지역명을 적지 않는다. 업종과 행정단위까지만 공개한다 (2026-09-04 (금) 대표 지시).
 *    00시 · 00동 의 00 을 화면에서 실제 지명으로 되살리지 않는다.
 * 3) 쓸 수 있는 문장은 `67위에서 3위 (21일)` 하나뿐이다.
 *    보장 · 확약 · 며칠 만에 몇 위 같은 말을 붙이지 않고, 평균 몇 계단 같은 집계값도 만들지 않는다.
 * 4) medical 이 true 인 카드는 진우 검수를 통과하기 전까지 화면에 오르지 않는다.
 *    생성기가 pendingReview 로 빼내므로 cases 에는 애초에 오지 않는다.
 * 5) 표기 순위는 최고 기록이 아니라 최신 스냅샷의 현재 순위다.
 *    한 번 1위를 찍고 지금 12위인 곳을 1위로 적지 않는다 (2026-09-04 (금) 대표 지시).
 * 6) 올라간 건과 지키고 있는 건을 함께 싣는다 (2026-09-05 (토) 대표 지시).
 *    떨어진 건만 뺀다. trend 가 유지인 카드에 올랐다고 적지 않는다 — 3위에서 3위는 지킨 것이다.
 * 7) 카드 순서의 기본은 키워드 월 검색수다 (같은 대표 지시).
 *    검색수는 content/keyword-volume.tsv 실측값이고 화면에 숫자로 적지 않는다.
 *    많이 찾는 키워드를 앞에 두는 정렬 기준일 뿐, 성과의 크기가 아니다.
 *
 * 한 카드가 한 작품이다. 같은 매장이 키워드 셋을 올렸으면 카드도 셋이고,
 * 표기가 겹쳐도 묶지 않는다 — 대표 지시가 겹치는 게 있다면 그래도 추가해 별도의 작품이니깐 이다.
 *
 * app/lib/rank-records.ts 와는 다른 데이터다. 그쪽은 키워드 단위 스냅샷 집계고
 * 여기는 성과대장에 등재된 개별 상승 기록이다.
 * 다만 일수의 정의는 이제 같다 — 둘 다 계측을 시작한 날부터 표시 순위가 확인된 날까지다.
 */

export interface PlaceRankKeyword {
  /** 가림 처리가 끝난 키워드 표기. `00시 맛집` */
  detail: string;
  /** 계측 시작 순위 */
  from: number;
  /** 최신 스냅샷의 현재 순위 */
  to: number;
  /** 계측 시작일부터 그 순위가 확인된 날까지의 일수 */
  days: number;
  /** 성과대장 등급 */
  grade: string;
  /** 성과대장 원장 ID */
  ids: string[];
}

export interface PlaceRankCase {
  /** 화면에 그대로 나가는 업종 표기. `00청소업체` */
  label: string;
  industry: string;
  /** 이 카드의 키워드. 한 카드에 하나다 */
  keywords: PlaceRankKeyword[];
  /** 대표 기록 — 카드가 하나의 키워드라 keywords[0] 과 같다 */
  best: { from: number; to: number; days: number };
  /** 1~5위 안에 있는가 */
  page1: boolean;
  /** 이 순위를 확인한 스냅샷 날짜 */
  asOf: string;
  /** 성과대장 ID. 앵커와 key 로 쓴다 */
  code: string;
  /** 상승 · 유지 — 떨어진 건은 애초에 오지 않는다 */
  trend: "상승" | "유지";
  /** 이 키워드 종류의 월 검색수. 정렬용이고 화면에 적지 않는다 */
  volume: number;
  /** 가림 처리된 키워드 종류. `맛집` `청소업체` — 지역명이 빠진 형태다 */
  keywordType: string;
}

interface RawCase {
  id: string;
  industry: string;
  storeLabel: string;
  keywordLabel: string;
  from: number;
  to: number;
  days: number;
  startDate: string;
  asOf: string;
  page1: boolean;
  grade: string;
  trend: "상승" | "유지";
  volume: number;
  keywordType: string;
}

interface PlaceRankFile {
  generated: string;
  source: string;
  note: string;
  volumeAsOf: string;
  monitoring: {
    stores: number;
    keywords: number;
    page1Keywords: number;
    page1Stores: number;
    asOf: string;
  };
  cases: RawCase[];
  pendingReview: { id: string; reason: string }[];
}

const FILE = raw as unknown as PlaceRankFile;

/** 계측값을 뽑은 날짜 */
export const PLACE_RANK_GENERATED = FILE.generated;

/** 가장 최근 순위 계측일 */
export const PLACE_RANK_AS_OF = FILE.monitoring.asOf;

/** 화면에 올릴 수 있는 사례. 한 카드가 한 작품이다 */
export const PLACE_RANK_CASES: PlaceRankCase[] = (FILE.cases ?? []).map((c) => {
  const kw: PlaceRankKeyword = {
    detail: c.keywordLabel,
    from: c.from,
    to: c.to,
    days: c.days,
    grade: c.grade,
    ids: [c.id],
  };
  return {
    label: c.storeLabel,
    industry: c.industry,
    keywords: [kw],
    best: { from: c.from, to: c.to, days: c.days },
    page1: c.page1,
    asOf: c.asOf,
    code: c.id,
    trend: c.trend,
    volume: c.volume,
    keywordType: c.keywordType,
  };
});

/** 검색수를 잰 날 */
export const PLACE_RANK_VOLUME_AS_OF = FILE.volumeAsOf;

/** 올라온 카드 수 */
export const PLACE_RANK_RISEN = PLACE_RANK_CASES.filter((c) => c.trend === "상승").length;

/** 자리를 지키고 있는 카드 수 */
export const PLACE_RANK_HELD = PLACE_RANK_CASES.filter((c) => c.trend === "유지").length;

/**
 * 집계.
 * stores · keywords 는 실제로 매일 재고 있는 수이고 (계약이 확인된 곳만 센다),
 * works 는 그중 상승이 확인돼 사례로 실은 수다. 두 숫자는 다르고 섞어 쓰지 않는다.
 */
export const PLACE_RANK_TOTALS = {
  /** 매일 계측 중인 매장 수 */
  stores: FILE.monitoring.stores,
  /** 매일 계측 중인 키워드 수 */
  keywords: FILE.monitoring.keywords,
  /** 계측일에 1~5위를 지키고 있는 키워드 수 */
  page1Keywords: FILE.monitoring.page1Keywords,
  /** 그 키워드를 가진 매장 수 */
  page1Stores: FILE.monitoring.page1Stores,
  /** 사례로 실은 작품 수 */
  works: PLACE_RANK_CASES.length,
  /** 사례에 담긴 서로 다른 업종 수 */
  industries: new Set(PLACE_RANK_CASES.map((c) => c.industry)).size,
};

/** 계단 수 — 시작 순위에서 현재 순위까지 몇 칸 올라왔나 */
export const caseGap = (c: PlaceRankCase) => c.best.from - c.best.to;

/**
 * 계단 수가 가장 큰 사례.
 * 「최대」는 손으로 적지 않는다. 대장이 바뀌면 이 값도 같이 바뀐다.
 */
export const PLACE_RANK_BIGGEST_GAIN = PLACE_RANK_CASES.reduce<PlaceRankCase | undefined>(
  (a, b) => (a === undefined || caseGap(b) > caseGap(a) ? b : a),
  undefined,
);

/**
 * 업종 대표 사례 — 그 업종에서 계단 수가 가장 큰 것.
 * 없는 업종이면 undefined 다. 없는 업종에 남의 기록을 붙이지 않는다 (C-42).
 */
export function bestCase(industry: string): PlaceRankCase | undefined {
  return byIndustry(industry).reduce<PlaceRankCase | undefined>(
    (a, b) => (a === undefined || caseGap(b) > caseGap(a) ? b : a),
    undefined,
  );
}

/**
 * 정답 블록에 들어가는 한 줄 — 계단 수 상위 여섯 건.
 * 화면에 손으로 적어 두면 대장에서 빠진 기록이 그대로 남는다. 매번 다시 뽑는다.
 */
export const PLACE_RANK_TOP_LINES = [...PLACE_RANK_CASES]
  .filter((c) => c.trend === "상승")
  .sort((a, b) => caseGap(b) - caseGap(a))
  .slice(0, 6)
  .map((c) => `${c.keywords[0].detail} ${c.keywords[0].from}위에서 ${c.keywords[0].to}위(${c.keywords[0].days}일 계측)`)
  .join(", ");

/** 업종 목록 — 필터 칩에 쓴다 */
export const PLACE_RANK_INDUSTRIES: string[] = Array.from(
  new Set(PLACE_RANK_CASES.map((c) => c.industry))
);

/**
 * `67위에서 3위` · 자리를 지킨 기록은 `3위 유지`.
 * from 과 to 가 같으면 올랐다고 적지 않는다 (2026-09-05 (토) 대표 지시).
 */
export const fmtMove = (k: { from: number; to: number }) =>
  k.from === k.to ? `${k.to}위 유지` : `${k.from}위에서 ${k.to}위`;

/** `67위에서 3위 (21일)` — 밖으로 나갈 수 있는 유일한 형태 */
export const fmtMoveDays = (k: { from: number; to: number; days: number }) =>
  `${fmtMove(k)} (${k.days}일)`;

/**
 * `67위 → 3위` — 좁은 자리에서 쓰는 짧은 형태 (헌장 C-36 예시 표기).
 * 자리를 지킨 기록은 `3위 유지`.
 */
export const fmtArrow = (k: { from: number; to: number }) =>
  k.from === k.to ? `${k.to}위 유지` : `${k.from}위 → ${k.to}위`;

/** 업종으로 고른다. 없으면 빈 배열 — 없는 업종에 남의 기록을 붙이지 않는다 */
export function byIndustry(...industries: string[]): PlaceRankCase[] {
  return PLACE_RANK_CASES.filter((c) => industries.includes(c.industry));
}

/**
 * 검색수가 큰 키워드부터 고른다. 정렬일 뿐이고 평균 같은 집계값을 만들지 않는다.
 * 같은 검색수면 계단 수가 큰 쪽, 그다음은 현재 순위가 높은 쪽이다.
 *
 * skip 은 자리마다 다른 카드를 싣기 위한 것이다 (홈 0 · 사례 4 · 플레이스 8).
 * 대장 ID 를 페이지에 박아 두면 그 ID 가 대장에서 빠질 때 조용히 빈 배열이 되고,
 * 카드 컴포넌트가 빈 배열에서 null 을 돌려주므로 섹션 하나가 통째로 사라진다.
 * 타입 오류도 런타임 오류도 없이 사라져서 ID 로 고르는 방식을 걷었다.
 */
export function byVolume(limit?: number, skip = 0): PlaceRankCase[] {
  const sorted = [...PLACE_RANK_CASES].sort(
    (a, b) => b.volume - a.volume || caseGap(b) - caseGap(a) || a.best.to - b.best.to,
  );
  if (typeof limit !== "number") return sorted.slice(skip);
  const start = sorted.length > skip ? skip : 0;
  return sorted.slice(start, start + limit);
}

/**
 * 시작 순위가 낮았던 순서로 고른다. 정렬일 뿐이고 평균 같은 집계값을 만들지 않는다.
 *
 * 기본 정렬은 이제 byVolume 이다 (2026-09-05 (토) 대표 지시 — 많이 찾는 키워드를 앞에).
 * byDepth 는 계단 수를 앞세우고 싶은 자리에만 남겨 둔다.
 */
export function byDepth(limit?: number, skip = 0): PlaceRankCase[] {
  const sorted = [...PLACE_RANK_CASES].sort((a, b) => b.best.from - a.best.from);
  if (typeof limit !== "number") return sorted.slice(skip);
  // 대장이 줄어 skip 이 목록보다 커져도 자리가 비지 않게 앞에서 다시 채운다
  const start = sorted.length > skip ? skip : 0;
  return sorted.slice(start, start + limit);
}

/** 화면 · JSON-LD · llms.txt 가 같은 문장을 쓰도록 한 곳에서 만든다 */
export const PLACE_RANK_NOTE =
  `애드랭크 순위 계측 데이터를 기준으로 한 네이버 플레이스 실측값입니다. ` +
  `표시된 순위는 최고 기록이 아니라 ${PLACE_RANK_AS_OF} 계측분의 현재 순위이고, ` +
  `괄호 안 일수는 계측을 시작한 날부터 그 순위가 확인된 날까지의 기간입니다. ` +
  `업종 · 지역 경쟁 강도에 따라 결과는 달라집니다. 순위를 보장하지 않습니다.`;

/**
 * 1페이지가 무엇인지 설명하는 문장 — 숫자는 이 대장에서만 가져온다.
 *
 * 예전에는 rank-records 의 PAGE1_NOTE 를 썼는데, 그 문장은 애드랭크 스냅샷만 센
 * 숫자여서 바로 옆 카드의 총계와 어긋났다. 범위가 넓은 쪽에서 다시 만든다.
 */
export const PLACE_RANK_PAGE1_NOTE =
  `네이버 플레이스 1페이지는 광고 지면 3개와 순위 1~5위로 구성됩니다. ` +
  `${PLACE_RANK_AS_OF} 기준 계측 키워드 ${PLACE_RANK_TOTALS.keywords}개 가운데 ` +
  `${PLACE_RANK_TOTALS.page1Keywords}개가 1~5위를 지키고 있고, 매장으로 세면 ${PLACE_RANK_TOTALS.page1Stores}곳입니다.`;

export const PLACE_RANK_LABEL_NOTE =
  `상호와 지역명은 적지 않고 업종과 행정단위까지만 적었습니다. ` +
  `방문객과 매출은 계측 대상이 아니어서 수치로 적지 않습니다.`;
