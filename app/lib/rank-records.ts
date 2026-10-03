/**
 * 플레이스 순위 계측 기록 — 홈페이지 단일 정본
 *
 * 출처: E:\하랑\순위모니터\snapshots\*.tsv (세영 · 애드랭크 일일 스냅샷)
 * 기준 스냅샷: 2026-09-23 (40회 누적 · 2026-08-13 ~ 2026-09-23)
 * 시작 순위·시작일은 애드랭크가 보관하는 30~32일치 이력에서 가장 오래된 실측값이다.
 *
 * 규칙 (헌장 C-36 · C-42)
 * 1) 순위 외 지표를 쓰지 않는다. 방문객·매출·예약 건수는 계측 대상이 아니다.
 * 2) 퍼센트로 말하지 않는다. `8위 → 3위 (7일)` 처럼 순위와 일수로만 말한다.
 * 3) 업체명·지역명을 쓰지 않는다. 업종과 키워드 유형까지만 공개한다.
 * 4) 하락 기록은 싣지 않되 지우지도 않는다 (아래 EXCLUDED 참고).
 *    자리를 지키고 있는 것(유지)은 함께 싣는다 (2026-09-05 (토) 대표 지시).
 *    다만 유지 기록에 올랐다고 적지 않는다. 3위에서 3위는 오른 것이 아니라 지킨 것이다.
 *    화면에서는 from === to 로 가려낸다.
 * 5) 최상급(최대·최고)은 이 파일의 계산값으로만 쓴다. 손으로 적지 않는다.
 * 6) 순서는 키워드 월 검색수가 정한다 (같은 대표 지시).
 *    검색수는 content/keyword-volume.tsv 실측값이고 화면에 숫자로 적지 않는다.
 *    많이 찾는 키워드를 앞에 두는 정렬 기준일 뿐, 성과의 크기가 아니다.
 *
 * 갱신 방법 — 손으로 세지도, 손으로 옮기지도 않는다
 *   python scripts/place-rank/rank_records.py           계산만 한다
 *   python scripts/place-rank/rank_records.py --write   아래 여섯 자리를 갈아 끼운다
 *   TSV 는 저장소 밖에 있어 빌드 시점에 읽을 수 없다. 그래서 값을 옮겨 심는 구간이 남는데,
 *   그 구간을 사람이 하면 거기서 멈춘다. --write 는 기준 스냅샷 줄 · SNAPSHOT_DATE ·
 *   RECORDS · 제외 주석 · EXCLUDED_COUNT · SUMMARY 여섯 자리만 바꾸고 나머지는 안 건드린다.
 *   검산이 어긋나면 아무것도 쓰지 않고 멈춘다 (2026-09-05 (토) 대표 지시).
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
export const SNAPSHOT_DATE = "2026-09-23";

/**
 * 게시 가능 기록 — 기준일 순위가 1페이지(1~5위) 안이고 내려가지 않았다.
 * 올라온 것과 자리를 지키고 있는 것이 함께 들어 있다. 키워드 월 검색수 내림차순.
 *
 * 같은 매장의 키워드가 둘이면 줄도 둘이다. 표기가 겹쳐도 묶지 않는다
 * (2026-09-04 (금) 대표 지시 — 겹치는 게 있다면 그래도 추가해 별도의 작품이니깐).
 */
export const RECORDS: RankRecord[] = [
  { industry: "카페", keyword: "지역 카페 키워드", from: 14, to: 5, days: 32, heldPage1: false },
  { industry: "카페", keyword: "지역 카페 키워드", from: 1, to: 1, days: 32, heldPage1: true },
  { industry: "치과", keyword: "지역 역세권 치과 키워드", from: 1, to: 1, days: 32, heldPage1: true },
  { industry: "치과", keyword: "지역 치과 키워드", from: 1, to: 1, days: 32, heldPage1: true },
  { industry: "네일", keyword: "지역 네일 키워드", from: 20, to: 2, days: 30, heldPage1: false },
  { industry: "네일", keyword: "지역 네일 키워드", from: 18, to: 2, days: 29, heldPage1: false },
  { industry: "입주청소", keyword: "지역 입주청소 키워드", from: 88, to: 4, days: 27, heldPage1: false },
  { industry: "입주청소", keyword: "지역 입주청소 키워드", from: 4, to: 1, days: 32, heldPage1: false },
  { industry: "입주청소", keyword: "지역 입주청소 키워드", from: 3, to: 2, days: 32, heldPage1: false },
  { industry: "입주청소", keyword: "지역 입주청소 키워드", from: 6, to: 5, days: 21, heldPage1: false },
  { industry: "누수탐지", keyword: "지역 누수 키워드", from: 26, to: 2, days: 32, heldPage1: false },
  { industry: "청소", keyword: "지역 청소업체 키워드", from: 3, to: 1, days: 32, heldPage1: false },
  { industry: "청소", keyword: "지역 청소업체 키워드", from: 4, to: 2, days: 12, heldPage1: false },
  { industry: "가발", keyword: "지역 가발 키워드", from: 3, to: 2, days: 32, heldPage1: true },
  { industry: "청소", keyword: "지역 후드청소 키워드", from: 1, to: 1, days: 12, heldPage1: false },
  { industry: "청소", keyword: "지역 후드청소 키워드", from: 2, to: 2, days: 29, heldPage1: false },
  { industry: "청소", keyword: "지역 정기청소 키워드", from: 1, to: 1, days: 32, heldPage1: false },
  { industry: "청소", keyword: "지역 정기청소 키워드", from: 4, to: 4, days: 32, heldPage1: false },
  { industry: "청소", keyword: "지역 상가청소 키워드", from: 11, to: 5, days: 29, heldPage1: false },
  { industry: "청소", keyword: "지역 상가청소 키워드", from: 1, to: 1, days: 28, heldPage1: false },
  { industry: "청소", keyword: "지역 병원청소 키워드", from: 2, to: 2, days: 12, heldPage1: false },
  { industry: "청소", keyword: "지역 병원청소 키워드", from: 5, to: 5, days: 32, heldPage1: false },
];

/**
 * 싣지 않는 기록 — 지우지 않는다. 왜 안 실었는지가 남아 있어야
 * 다음 사람이 같은 숫자를 다시 주워 오지 않는다 (헌장 C-36 · 스냅샷 삭제 금지의 취지).
 *
 * 하락 — 지역 꽃집 15위 → 43위 · 지역 맛집 12위 → 27위 · 지역 청소업체 6위 → 14위 ·
 *        지역 카센터 3위 → 10위 · 지역 카페 7위 → 11위 · 지역 입주청소 17위 → 19위 ·
 *        지역 상가청소 4위 → 6위 · 지역 꽃집 1위 → 3위 · 지역 후드청소 2위 → 3위 ·
 *        지역 디저트카페 1위 → 2위 · 지역 치과 1위 → 2위 · 지역 맞춤가발 10위 → 11위 ·
 *        지역 피부과 3위 → 4위
 * 1페이지 밖 — 지역 누수탐지 125위 → 8위 · 지역 누수 141위 → 25위 · 지역 맛집 39위 → 17위 ·
 *        지역 병원청소 9위 → 6위 · 지역 정기청소 12위 → 9위 · 지역 청소업체 12위 → 10위
 * 병·의원 검수 대기 — 없음
 * 데이터 부족 — 1건 (계측 시작 직후라 시작값이 없다)
 *
 * 유지(1~5위인데 그대로)는 2026-09-05 (토) 대표 지시로 RECORDS 안에 들어갔다.
 * 여기 남는 것은 하락 · 1페이지 밖 · 데이터 부족 셋뿐이다.
 */
export const EXCLUDED_COUNT = { declined: 13, outsidePage1: 6, insufficient: 1, pendingReview: 0 };

/** 올라온 기록 수 — 손으로 세지 않는다 */
export const RISEN = RECORDS.filter((r) => r.from > r.to).length;

/** 자리를 지키고 있는 기록 수 */
export const HELD = RECORDS.filter((r) => r.from === r.to).length;

/** 기준 스냅샷 집계 — 손으로 고치지 않는다. scripts/place-rank/rank_records.py 를 다시 돌린다. */
export const SUMMARY = {
  /** 매일 계측 중인 매장 수 */
  stores: 21,
  /** 매일 계측 중인 키워드 수 (시작값이 없는 1건 제외) */
  keywords: 41,
  /** 기준일에 1페이지(1~5위)를 지키고 있는 키워드 수 */
  page1Keywords: 27,
  /** 기준일에 1페이지를 지키고 있는 매장 수 */
  page1Stores: 13,
  /** 누적 스냅샷 40회에 빠짐없이 잡히면서 한 번도 1페이지 밖으로 나가지 않은 키워드 수 */
  heldAllSnapshots: 4,
  /** 누적 스냅샷 회차 */
  snapshots: 40,
};

/**
 * 병·의원 순위 현황표 (진우 D-0280 · D-0282 · 2026-09-06 (일) 대표 지시 · 2026-10-03 (토) H-1143 개정).
 * 위 RECORDS 는 병원 하나의 개선 카드라 진우 판정을 거친 것만 실리고, 여기는 병원을 특정하지 않는
 * 한 장짜리 표다. 표기는 `OO치과` 처럼 업종 앞 두 글자 가림뿐이고 지역 · 키워드 · 상호는 어느 칸에도
 * 담지 않는다.
 *
 * 2026-10-03 (토) 대표 결정 (H-1143) — 계약 키워드 전체를 최신 스냅샷으로 세던 표를
 * 「골라 실은 키워드 + 그 키워드를 잰 날짜」 표로 바꿨다. 대표 지시 원문
 * `잘 됬을 때 기준으로 해, 그리고 다른 키워드나 병원들 순위 되어 있는거 많은데 왜 굳이`.
 * 숫자는 실제로 잰 날의 값이고 행마다 measuredOn 을 붙인다. 지금 값으로 깎지도, 잰 적 없는 값으로
 * 채우지도 않는다 (C-42). 고른 줄이라 「계약 키워드 N개 모두」 같은 전체 문장은 쓰지 않는다.
 *
 * 손으로 고치지 않는다 — scripts/place-rank/rank_records.py 의 CLINIC_PICK 에 (매장 · 키워드 · 날짜)를
 * 적고 --write 를 돌린다. 그 날짜 스냅샷 파일에서 순위를 읽어 온다. 게시 전 진우 검수 (C-50 · D-0177).
 */
export type ClinicKeyword = {
  /** 화면 표기. 업종 앞에 OO 두 글자 — 지역도 상호도 아니다 */
  display: string;
  /** 키워드 형태. 실제 키워드는 적지 않는다 */
  shape: string;
  /** 잰 날의 순위. null 이면 그날 계측이 없었다 */
  rank: number | null;
  /** 잰 날에 1페이지(1~5위) 안이었나 */
  page1: boolean;
  /** 이 순위를 잰 날짜 (스냅샷 파일 이름) */
  measuredOn: string;
};
export const CLINIC_KEYWORDS: ClinicKeyword[] = [
  { display: "OO치과 A", shape: "지역 + 진료과", rank: 1, page1: true, measuredOn: "2026-10-03" },
  { display: "OO치과 A", shape: "지역 + 진료과", rank: 1, page1: true, measuredOn: "2026-10-03" },
  { display: "OO치과 B", shape: "지역 + 진료과", rank: 5, page1: true, measuredOn: "2026-10-03" },
];
export const CLINIC_SUMMARY = {
  /** 표에 실은 병·의원 수 */
  stores: 2,
  /** 표에 실은 키워드 수 */
  keywords: 3,
  /** 그중 잰 날 1페이지(1~5위) 안이었던 키워드 수 */
  page1: 3,
  /** 그중 잰 날 1위였던 키워드 수 */
  top1: 2,
};
/** 표의 잰 날짜가 하나로 같으면 그 날짜, 여럿이면 null — 문장은 날짜를 하나로 말할 수 있을 때만 「기준」을 붙인다 */
export const CLINIC_MEASURED_ON: string | null = (() => {
  const days = Array.from(new Set(CLINIC_KEYWORDS.map((k) => k.measuredOn)));
  return days.length === 1 ? days[0] : null;
})();
/** 표의 잰 날짜들 (겹침 없이 오름차순) — 표 없이 도는 카드에 날짜를 붙일 때 쓴다 */
export const CLINIC_DAYS: string[] = Array.from(new Set(CLINIC_KEYWORDS.map((k) => k.measuredOn))).sort();
/** 표에서 가장 늦게 잰 날짜 — 기간 문장의 끝 (Q-0550 · 줄마다 날짜가 다르다) */
export const CLINIC_LAST_ON: string = CLINIC_KEYWORDS.map((k) => k.measuredOn).sort().pop() ?? SNAPSHOT_DATE;
/** 계약 키워드 전부가 1페이지 안인가 — 집계 문장의 「모두」 분기 */
export const CLINIC_ALL_PAGE1 =
  CLINIC_SUMMARY.keywords > 0 && CLINIC_SUMMARY.page1 === CLINIC_SUMMARY.keywords;

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

/**
 * `19위가 1위가 됐습니다(25일 계측)` — 서술문에 넣는 형태.
 * 자리를 지키고 있는 기록(from === to)은 올랐다고 적지 않는다.
 * 3위에서 3위는 오른 것이 아니라 지킨 것이다 (2026-09-05 (토) 대표 지시).
 */
export const fmtSentence = (r: RankRecord) =>
  r.from === r.to
    ? `${r.to}위를 지키고 있습니다(${r.days}일 계측)`
    : `${r.from}위가 ${r.to}위가 됐습니다(${r.days}일 계측)`;
/** `72위 → 2위` · 자리를 지킨 기록은 `2위 유지` */
export const fmt = (r: RankRecord) =>
  r.from === r.to ? `${r.to}위 유지` : `${r.from}위 → ${r.to}위`;
/** `72위 → 2위 · 32일 계측` */
export const fmtLong = (r: RankRecord) => `${fmt(r)} · ${r.days}일 계측`;

/** 화면·JSON-LD·llms.txt 가 같은 문장을 쓰도록 한 곳에서 만든다 */
export const MEASURE_NOTE =
  `순위는 저장한 스냅샷 실측값이며 업종·지역 경쟁 강도에 따라 달라집니다. ` +
  `방문객과 매출은 계측 대상이 아니어서 수치로 제시하지 않습니다.`;

/*
 * 병·의원 문장 — 화면 · JSON-LD · llms.txt 가 여기서 같은 문장을 가져간다.
 * 판정 정본 : E:\하랑\본부장\병의원\인계_SEO_GEO_AEO_병의원_2026-09-06.md 제4-C절
 *
 * 병·의원은 문장이 어긋나면 광고 성과가 아니라 원장님 행정처분이 걸린다 (C-50).
 * 화면마다 손으로 적으면 스냅샷이 바뀌는 날 세 곳이 서로 다른 말을 하므로 한 곳에서만 만든다.
 *
 * 두 가지를 지킨다.
 * 1) 상호를 적지 않는다. 업종 앞에 OO 를 붙이는 데서 멈춘다.
 * 2) 「한 번도 1페이지를 벗어나지 않았고」는 그 업종 기록이 전부 heldPage1 일 때만 붙인다.
 *    한 줄이라도 도중에 1페이지를 벗어났으면 그 문장이 거짓이 된다.
 * 3) 기간을 닫아서 과거형으로 적는다 (진우 2026-09-24 (목) 판정).
 *    「지키고 있습니다」는 앞으로도 지킨다는 말로 읽히고, 「매일」은 스냅샷이 빠진 날이 있어 거짓이다.
 */

/** 화면에 올릴 수 있는 병·의원 업종 — 진우 판정을 통과한 것만 RECORDS 에 들어온다 */
export const CLINIC_INDUSTRIES = ["치과", "피부과"];

/** 화면에 올라가 있는 병·의원 기록 */
export const CLINIC_RECORDS = byIndustry(...CLINIC_INDUSTRIES);

/** 기준일에 1페이지(1~5위)에 있는 병·의원 키워드 */
export const CLINIC_PAGE1 = CLINIC_RECORDS.filter((r) => r.to <= 5);

/** `2026-09-05` → `2026년 9월 5일` */
const koDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
};

/** `9월 23일` — 같은 해 안에서 기간 끝을 적을 때 */
const koMonthDay = (iso: string) => {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}월 ${d}일`;
};

/** `32일 계측 · 시작 1위 · 9월 23일 1위` · 병·의원 순위 표기. 화살표 · 지켰다 · 올렸다를 쓰지 않는다 (D-0177 · C-50) */
export const clinicFact = (r: RankRecord) =>
  `${r.days}일 계측 · 시작 ${r.from}위 · ${koMonthDay(SNAPSHOT_DATE)} ${r.to}위`;

const KO_COUNT = ["", "", "두 개", "세 개", "네 개", "다섯 개"];
const koCount = (n: number) => KO_COUNT[n] || `${n}개`;

const KO_NUM = ["", "한 ", "두 ", "세 ", "네 ", "다섯 ", "여섯 ", "일곱 ", "여덟 ", "아홉 ", "열 "];
/** 열까지는 우리말 수사(두 곳 · 세 개), 그 위는 숫자(12곳). 위 koCount 는 「개」가 붙어 있어 「곳」에 못 쓴다 */
const koNum = (n: number) => (n >= 1 && n <= 10 ? KO_NUM[n] : String(n));

/**
 * 첫 스냅샷 날짜. 스냅샷은 지우지 않으므로(D 금지) 이 값은 바뀌지 않는다.
 * E:\하랑\순위모니터\snapshots 의 가장 오래된 파일명이다 (2026-09-24 (목) 확인 · 그날 파일 40개).
 */
export const FIRST_SNAPSHOT_DATE = "2026-08-13";

/** `2026년 8월 13일부터 9월 23일까지 스냅샷 40회` — 병·의원 문장은 기간을 닫아서 말한다 */
const SNAPSHOT_SPAN = `${koDate(FIRST_SNAPSHOT_DATE)}부터 ${
  FIRST_SNAPSHOT_DATE.slice(0, 4) === SNAPSHOT_DATE.slice(0, 4) ? koMonthDay(SNAPSHOT_DATE) : koDate(SNAPSHOT_DATE)
}까지 스냅샷 ${SUMMARY.snapshots}회`;

const heldAll = (rows: RankRecord[]) => rows.length > 0 && rows.every((r) => r.heldPage1);

/** `1위를 지켰습니다(32일 계측)` — fmtSentence 의 과거형. 병·의원은 진행형을 쓰지 않는다 */
const clinicSentence = (r: RankRecord) =>
  r.from === r.to
    ? `${r.to}위를 지켰습니다(${r.days}일 계측)`
    : `${r.from}위가 ${r.to}위가 됐습니다(${r.days}일 계측)`;

/*
 * 서술문의 병원 구분 (진우 2026-10-04 (일) 01:27 · Q-0550). 표에 OO치과 A · B 가 생긴 뒤로
 * 그냥 `OO치과` 는 어느 쪽인지 갈린다. RECORDS 의 치과 기록은 표의 A 와 같은 병원이라 A 를 붙인다.
 * B 는 9월 내내 1페이지 밖이었다. B 로 읽히면 `한 번도 1페이지를 벗어나지 않았다` 가 거짓이 된다.
 */
const CLINIC_LINE_LABEL: Record<string, string> = { 치과: " A" };

/** 업종 한 줄 — 값이 같은 기록끼리는 묶고, 다르면 기록마다 따로 적는다 */
function clinicLine(industry: string): string {
  const name = `OO${industry}${CLINIC_LINE_LABEL[industry] ?? ""}`;
  const rows = byIndustry(industry);
  if (rows.length === 0) return "";
  const head = rows[0];
  const same = rows.every((r) => r.from === head.from && r.to === head.to && r.days === head.days);
  if (!same) {
    const each = rows.map(clinicSentence).join(", ");
    return `${name}는 계약 키워드 ${koCount(rows.length)}가 각각 ${each}.`;
  }
  const cnt = rows.length === 1 ? "계약 키워드가" : `계약 키워드 ${koCount(rows.length)}가`;
  const both = rows.length === 1 ? "" : rows.length === 2 ? "둘 다 " : "모두 ";
  if (heldAll(rows)) {
    return (
      `${name}는 ${SNAPSHOT_SPAN} 동안 ${cnt} 한 번도 1페이지를 벗어나지 않았고, ` +
      `${koMonthDay(SNAPSHOT_DATE)} 순위는 ${both}${head.to}위였습니다.`
    );
  }
  return head.from === head.to
    ? `${name}는 ${koMonthDay(SNAPSHOT_DATE)} 기준 ${cnt} ${both}${head.to}위였습니다.`
    : `${name}는 ${cnt} ${head.days}일 계측에서 ${head.from}위가 ${head.to}위가 됐습니다.`;
}

/** 업종별 한 줄 — 기록이 없는 업종은 아예 빠진다 (C-42) */
export const CLINIC_LINES = CLINIC_INDUSTRIES.map(clinicLine).filter(Boolean);

/** 병·의원 공통 한 줄 — 화면 · JSON-LD · llms.txt 머리에 같이 쓴다 */
/** `2026년 9월 23일에 잰` · 잰 날짜가 여럿이면 표의 날짜를 가리킨다 (H-1143 · 숫자마다 잰 날짜) */
const CLINIC_WHEN = CLINIC_MEASURED_ON
  ? `${koDate(CLINIC_MEASURED_ON)}에 잰`
  : `${CLINIC_LAST_ON.slice(0, 4)}년에 잰`;

/*
 * 고른 줄이라 「계약 키워드 N개 모두」로 쓰지 않는다 (H-1143). 「골라 실은」을 빼면
 * 계측 중인 병·의원 키워드 전부가 그렇다는 말로 읽힌다.
 * 고른 줄에 「모두 · 전부」를 붙이지 않는다 (진우 2026-10-03 (토) 18:29 · 표시광고법 제3조 제1항 제1호).
 * 비율(100%)처럼 읽히기 때문이다. 비율 대신 잰 숫자를 쓰고, 「전체 몇 개 중 몇 개」도 쓰지 않는다
 * (분모에 계약 미확인 · 신규문의가 섞인다 · C-42).
 */
/** 표의 순위가 전부 1위인가 — 문장을 「1위였습니다」로 닫을 수 있는가 */
const CLINIC_ALL_TOP1 = CLINIC_SUMMARY.keywords > 0 && CLINIC_SUMMARY.top1 === CLINIC_SUMMARY.keywords;
/** `1위 · 3위` — 1위가 아닌 줄이 섞이면 비율 대신 잰 순위를 그대로 적는다 */
/* 잰 날짜가 줄마다 다르면 날짜를 순위 앞에 붙인다. 표 없이 혼자 도는 메타 · FAQ 에서도 숫자마다 날짜가 붙어 있어야 한다 */
const CLINIC_RANKS = CLINIC_KEYWORDS.filter((k) => k.rank !== null)
  .map((k) => (CLINIC_MEASURED_ON ? `${k.rank}위` : `${koMonthDay(k.measuredOn)} ${k.rank}위`))
  .join(" · ");
export const CLINIC_NOTE =
  CLINIC_SUMMARY.page1 === 0
    ? ""
    : `${CLINIC_WHEN} 병·의원 키워드 중 골라 실은 ${koNum(CLINIC_SUMMARY.keywords)}개는 ` +
      (CLINIC_ALL_TOP1
        ? `네이버 플레이스 1위였습니다.`
        : CLINIC_MEASURED_ON
          ? `네이버 플레이스 ${CLINIC_RANKS}였습니다.`
          : `네이버 플레이스에서 ${CLINIC_RANKS}였습니다.`);

/*
 * 병·의원 상승 기간 문장(CLINIC_RISE_DURATIONS)은 2026-09-25 (금) 뺐다 (진우 2026-09-24 (목) 판정 · D-0177 · C-50).
 * 「키워드가 A위에서 B위까지 N일」은 몇 위까지 며칠이라는 금지 형식이고 계약 키워드 표기도 드러낸다.
 * 병·의원 순위 답변은 위 CLINIC_LINES 과거형 문장만 쓴다.
 */

/*
 * 병·의원 순위 현황 문장 — 진우 인계서 3-C 절 다섯 문장 (D-0280 · D-0282 · 2026-09-06 (일) 대표 지시).
 * 바로 위 4-C 절과 층이 다르다. 저기는 진우 판정을 통과한 진료과 하나의 개선 카드를 서술하고,
 * 여기는 골라 실은 키워드를 잰 날짜와 함께 한 표로 보여 주고 병원을 특정하지 않는다 (H-1143).
 * 문장을 화면에서 만들지 않는 이유는 위와 같다. 같은 말을 화면과 llms.txt 가 같이 쓰는데
 * 두 곳에서 따로 만들면 스냅샷이 바뀌는 날 서로 다른 말을 한다.
 * 「일곱 곳」은 누적이라 스냅샷에 없다. 진우 점검대장이 출처이고 바뀌면 진우가 알려 준다.
 * 표기는 OO치과 · OO피부과 에서 멈춘다. 지역 · 계약 키워드 · 상호는 어느 칸에도 적지 않는다 (C-50).
 */
function clinicStatusRankLine(): string {
  const { keywords } = CLINIC_SUMMARY;
  return CLINIC_ALL_TOP1
    ? `${CLINIC_WHEN} 순위로 ${koNum(keywords)}개 다 1위였습니다.`
    : `${CLINIC_WHEN} 순위는 ${CLINIC_RANKS}였습니다.`;
}

/** 3-C 다섯 문장. 셋째 · 넷째 · 다섯째 줄이 스냅샷마다 값이 바뀐다 */
export const CLINIC_STATUS_LINES = [
  "하랑마케팅은 병원과 의원 마케팅을 맡고 있습니다.",
  "지금까지 치과와 의원 일곱 곳의 블로그와 플레이스를 맡아왔습니다.",
  `맡고 있는 병·의원 가운데 ${koNum(CLINIC_SUMMARY.stores)}곳에서 키워드 ${koNum(CLINIC_SUMMARY.keywords)}개를 골라 표에 실었습니다.`,
  clinicStatusRankLine(),
  // 줄마다 잰 날짜가 다르고 한 줄은 스냅샷이 아니라 순위 도구 화면 기록에서 왔다 (Q-0550). 기간 · 회차 숫자를 걸지 않는다
  CLINIC_MEASURED_ON
    ? "순위는 저장해 둔 계측 기록에서 옮겼고 잰 날짜를 함께 적었습니다."
    : "순위는 저장해 둔 계측 기록에서 옮겼고 줄마다 잰 날짜를 붙였습니다.",
];

/** 3-D 표 아래 한 줄. 무엇을 언제 잰 숫자인지 표 옆에 붙여 둔다 */
export const CLINIC_STATUS_CAPTION = `${
  CLINIC_MEASURED_ON ? `잰 날짜 ${koDate(CLINIC_MEASURED_ON)}` : "잰 날짜는 줄마다 적었습니다"
} · 골라 실은 키워드 ${CLINIC_SUMMARY.keywords}개`;
