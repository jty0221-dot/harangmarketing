import raw from "../../content/place-rank-cases.json";

/**
 * 매장별 네이버 플레이스 순위 계측 사례 — 홈페이지 표시용 정본
 *
 * 원본은 E:\하랑\순위모니터\홈페이지사례.json 이다 (세영 · 성과대장에서 추출).
 * content/place-rank-cases.json 은 그 파일을 그대로 들여온 사본이고 여기서는 읽기만 한다.
 * 대장이 바뀌면 순위모니터에서 다시 뽑아 content 파일을 갈아끼운다. 손으로 숫자를 고치지 않는다.
 *
 * 규칙 (헌장 C-36 · C-41 · C-50)
 * 1) label 을 화면에서 다시 만들지 않는다. 이미 가림 처리가 끝난 값이다.
 *    named 가 false 인 카드에 상호를 유추해 넣거나 새 이름을 붙이지 않는다.
 * 2) 지역은 시 · 군까지다. 동 · 역 · 상권 이름을 되살리지 않는다.
 * 3) 쓸 수 있는 문장은 `67위에서 4위 (10일)` 하나뿐이다.
 *    보장 · 확약 · 며칠 만에 몇 위 같은 말을 붙이지 않고, 평균 몇 계단 같은 집계값도 만들지 않는다.
 * 4) medical 이 true 인 카드는 진우 검수를 통과하기 전까지 화면에 오르지 않는다.
 *    아래 필터가 그 문지기다 — content 파일에 두 장을 붙이면 필터를 지나야 화면에 나온다.
 *
 * app/lib/rank-records.ts 와는 다른 데이터다. 그쪽은 키워드 단위 스냅샷 기록이고
 * 여기는 매장 단위 성과 기록이라 같은 계측이라도 세는 일수의 정의가 다르다.
 * rank-records 의 `N일 계측` 은 계측을 이어온 전체 기간이고,
 * 여기의 `(N일)` 은 시작 순위에서 표시 순위까지 확인되기까지 걸린 일수다.
 * 두 숫자를 서로 옮겨 적지 않는다.
 */

export interface PlaceRankKeyword {
  /** 지역명을 뺀 키워드 유형 */
  detail: string;
  /** 계측 시작 순위 */
  from: number;
  /** 확인된 순위 */
  to: number;
  /** 시작 순위에서 확인 순위까지 걸린 일수 */
  days: number;
  /** 성과대장 등급 */
  grade: string;
  /** 성과대장 원장 ID */
  ids: string[];
}

export interface PlaceRankCase {
  /** 화면에 그대로 나가는 표기. 고쳐 쓰지 않는다 */
  label: string;
  /** 상호 공개 동의를 받았는가 */
  named: boolean;
  industry: string;
  /** 시 · 군 단위 */
  region: string;
  /** 병 · 의원 여부. true 면 화면에 오르지 않는다 */
  medical: boolean;
  keywords: PlaceRankKeyword[];
  best: { from: number; to: number; days: number };
  /** 이 매장에서 계측 중인 키워드 수 */
  count: number;
  /** HC-01 형식 식별자. 앵커와 key 로 쓴다 */
  code: string;
}

interface PlaceRankFile {
  generated: string;
  source: string;
  note: string;
  sources: string[];
  pendingReview: { code: string; reason: string }[];
  cases: PlaceRankCase[];
}

const FILE = raw as unknown as PlaceRankFile;

/** 계측값을 뽑은 날짜 */
export const PLACE_RANK_GENERATED = FILE.generated;

/** 계측 도구 */
export const PLACE_RANK_SOURCES = FILE.sources;

/** 화면에 올릴 수 있는 사례. 병 · 의원은 여기서 걸린다 */
export const PLACE_RANK_CASES: PlaceRankCase[] = (FILE.cases ?? []).filter(
  (c) => c && c.medical !== true
);

/** 집계는 배열에서 센다. 손으로 적으면 목록과 어긋난다 */
export const PLACE_RANK_TOTALS = {
  /** 계측된 매장 수 */
  stores: PLACE_RANK_CASES.length,
  /** 계측된 키워드 수 */
  keywords: PLACE_RANK_CASES.reduce((n, c) => n + c.keywords.length, 0),
  /** 서로 다른 업종 수 */
  industries: new Set(PLACE_RANK_CASES.map((c) => c.industry)).size,
  /** 서로 다른 시 · 군 수 */
  regions: new Set(PLACE_RANK_CASES.map((c) => c.region)).size,
};

/** 업종 목록 — 필터 칩에 쓴다 */
export const PLACE_RANK_INDUSTRIES: string[] = Array.from(
  new Set(PLACE_RANK_CASES.map((c) => c.industry))
);

/** `113위에서 18위` */
export const fmtMove = (k: { from: number; to: number }) => `${k.from}위에서 ${k.to}위`;

/** `113위에서 18위 (14일)` — 밖으로 나갈 수 있는 유일한 형태 */
export const fmtMoveDays = (k: { from: number; to: number; days: number }) =>
  `${fmtMove(k)} (${k.days}일)`;

/** 코드로 고른다. 자리마다 어떤 카드를 실을지 페이지에서 정한다 */
export function byCode(...codes: string[]): PlaceRankCase[] {
  return codes
    .map((code) => PLACE_RANK_CASES.find((c) => c.code === code))
    .filter((c): c is PlaceRankCase => Boolean(c));
}

/** 업종으로 고른다. 없으면 빈 배열 — 없는 업종에 남의 기록을 붙이지 않는다 */
export function byIndustry(...industries: string[]): PlaceRankCase[] {
  return PLACE_RANK_CASES.filter((c) => industries.includes(c.industry));
}

/** 시작 순위가 낮았던 순서. 정렬일 뿐이고 평균 같은 집계값을 만들지 않는다 */
export function byDepth(limit?: number): PlaceRankCase[] {
  const sorted = [...PLACE_RANK_CASES].sort((a, b) => b.best.from - a.best.from);
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

/** 화면 · JSON-LD · llms.txt 가 같은 문장을 쓰도록 한 곳에서 만든다 */
export const PLACE_RANK_NOTE =
  `네이버 플레이스 순위 실측값입니다 (계측 도구 ${PLACE_RANK_SOURCES.join(" · ")}). ` +
  `괄호 안 일수는 시작 순위에서 그 순위가 확인되기까지 걸린 기간이고, ` +
  `계측을 이어온 전체 기간과는 세는 방식이 다릅니다. ` +
  `업종 · 지역 경쟁 강도에 따라 결과는 달라집니다. 순위를 보장하지 않습니다.`;

export const PLACE_RANK_LABEL_NOTE =
  `상호는 공개에 동의한 곳만 적고 나머지는 업종과 지역으로만 적었습니다. ` +
  `방문객과 매출은 계측 대상이 아니어서 수치로 적지 않습니다.`;
