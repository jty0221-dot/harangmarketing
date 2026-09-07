/**
 * 플레이스 순위 계측 기록 — 홈페이지 단일 정본
 *
 * 출처: E:\하랑\순위모니터\snapshots\*.tsv (세영 · 애드랭크 일일 스냅샷)
 * 기준 스냅샷: 2026-09-05 (16회 누적 · 2026-08-21 ~ 2026-09-05)
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
export const SNAPSHOT_DATE = "2026-09-05";

/**
 * 게시 가능 기록 — 기준일 순위가 1페이지(1~5위) 안이고 내려가지 않았다.
 * 올라온 것과 자리를 지키고 있는 것이 함께 들어 있다. 키워드 월 검색수 내림차순.
 *
 * 같은 매장의 키워드가 둘이면 줄도 둘이다. 표기가 겹쳐도 묶지 않는다
 * (2026-09-04 (금) 대표 지시 — 겹치는 게 있다면 그래도 추가해 별도의 작품이니깐).
 */
export const RECORDS: RankRecord[] = [
  { industry: "카페", keyword: "지역 카페 키워드", from: 21, to: 3, days: 32, heldPage1: false },
  { industry: "카페", keyword: "지역 카페 키워드", from: 1, to: 1, days: 25, heldPage1: true },
  { industry: "카페", keyword: "지역 카페 키워드", from: 3, to: 3, days: 25, heldPage1: true },
  { industry: "음식점", keyword: "지역 맛집 키워드", from: 49, to: 4, days: 32, heldPage1: false },
  { industry: "음식점", keyword: "지역 맛집 키워드", from: 39, to: 5, days: 32, heldPage1: true },
  { industry: "음식점", keyword: "지역 맛집 키워드", from: 26, to: 4, days: 32, heldPage1: false },
  { industry: "음식점", keyword: "지역 맛집 키워드", from: 14, to: 2, days: 32, heldPage1: false },
  { industry: "음식점", keyword: "지역 맛집 키워드", from: 8, to: 2, days: 32, heldPage1: false },
  { industry: "음식점", keyword: "지역 역세권 맛집 키워드", from: 4, to: 1, days: 32, heldPage1: true },
  { industry: "피부과", keyword: "지역 피부과 키워드", from: 4, to: 4, days: 32, heldPage1: true },
  { industry: "치과", keyword: "지역 치과 키워드", from: 7, to: 1, days: 32, heldPage1: true },
  { industry: "치과", keyword: "지역 역세권 치과 키워드", from: 7, to: 1, days: 32, heldPage1: true },
  { industry: "음식점", keyword: "지역 샤브샤브 키워드", from: 3, to: 3, days: 32, heldPage1: false },
  { industry: "청소", keyword: "지역 청소업체 키워드", from: 49, to: 3, days: 23, heldPage1: false },
  { industry: "카페", keyword: "지역 디저트카페 키워드", from: 3, to: 2, days: 19, heldPage1: true },
];

/**
 * 싣지 않는 기록 — 지우지 않는다. 왜 안 실었는지가 남아 있어야
 * 다음 사람이 같은 숫자를 다시 주워 오지 않는다 (헌장 C-36 · 스냅샷 삭제 금지의 취지).
 *
 * 하락 — 지역 역세권 맛집 65위 → 76위 · 지역 입주청소 2위 → 8위 · 지역 맞춤가발 6위 → 12위 ·
 *        지역 청소업체 6위 → 11위 · 지역 입주청소 1위 → 5위 · 지역 고기집 125위 → 128위 ·
 *        지역 피부과 9위 → 11위 · 지역 가발 1위 → 2위 · 지역 카센터 7위 → 8위
 * 1페이지 밖 — 지역 누수탐지 125위 → 29위 · 지역 누수 141위 → 58위 · 지역 맛집 110위 → 36위 ·
 *        지역 입주청소 88위 → 14위 · 지역 맛집 74위 → 13위 · 지역 상가청소 67위 → 20위 ·
 *        지역 상가청소 53위 → 26위 · 지역 정기청소 36위 → 12위 · 지역 누수 30위 → 13위 ·
 *        지역 정기청소 35위 → 18위 · 지역 병원청소 22위 → 6위 · 지역 병원청소 22위 → 7위 ·
 *        지역 네일 20위 → 8위 · 지역 맛집 79위 → 67위 · 지역 카페 19위 → 7위 ·
 *        지역 네일 18위 → 7위 · 지역 고기집 31위 → 27위 · 지역 샤브샤브 43위 → 41위 ·
 *        지역 누수탐지 139위 → 137위 · 지역 정장 7위 → 6위 · 지역 정장 7위 → 6위 ·
 *        지역 청소업체 12위 → 11위 · 지역 소갈비 29위 → 28위 · 지역 후드청소 9위 → 8위 ·
 *        지역 샤브샤브 6위 → 6위
 * 병·의원 검수 대기 — 없음
 * 데이터 부족 — 11건 (계측 시작 직후라 시작값이 없다)
 *
 * 유지(1~5위인데 그대로)는 2026-09-05 (토) 대표 지시로 RECORDS 안에 들어갔다.
 * 여기 남는 것은 하락 · 1페이지 밖 · 데이터 부족 셋뿐이다.
 */
export const EXCLUDED_COUNT = { declined: 9, outsidePage1: 25, insufficient: 11, pendingReview: 0 };

/** 올라온 기록 수 — 손으로 세지 않는다 */
export const RISEN = RECORDS.filter((r) => r.from > r.to).length;

/** 자리를 지키고 있는 기록 수 */
export const HELD = RECORDS.filter((r) => r.from === r.to).length;

/** 기준 스냅샷 집계 — 손으로 고치지 않는다. scripts/place-rank/rank_records.py 를 다시 돌린다. */
export const SUMMARY = {
  /** 매일 계측 중인 매장 수 */
  stores: 18,
  /** 매일 계측 중인 키워드 수 (시작값이 없는 11건 제외) */
  keywords: 49,
  /** 기준일에 1페이지(1~5위)를 지키고 있는 키워드 수 */
  page1Keywords: 17,
  /** 기준일에 1페이지를 지키고 있는 매장 수 */
  page1Stores: 9,
  /** 누적 스냅샷 16회에 빠짐없이 잡히면서 한 번도 1페이지 밖으로 나가지 않은 키워드 수 */
  heldAllSnapshots: 9,
  /** 누적 스냅샷 회차 */
  snapshots: 16,
};

/**
 * 병·의원 순위 현황 — 집계 층 (진우 D-0280 · D-0282 · 2026-09-06 (일) 대표 지시).
 * 위 RECORDS 는 병원 하나의 개선 카드라 진우 판정을 거친 것만 실리고, 여기는 계약 키워드 전체를
 * 한 표로 세는 집계라 병원을 특정하지 않는다. 표기는 `OO치과` 처럼 업종 앞 두 글자 가림뿐이고
 * 지역 · 키워드 · 상호는 어느 칸에도 담지 않는다. 계약 키워드만 센다 (관측용 서브 키워드 제외).
 * 손으로 고치지 않는다 — scripts/place-rank/rank_records.py --write 가 채운다.
 */
export type ClinicKeyword = {
  /** 화면 표기. 업종 앞에 OO 두 글자 — 지역도 상호도 아니다 */
  display: string;
  /** 키워드 형태. 실제 키워드는 적지 않는다 */
  shape: string;
  /** 기준일 순위. null 이면 그날 계측이 없었다 */
  rank: number | null;
  /** 기준일에 1페이지(1~5위) 안인가 */
  page1: boolean;
};
export const CLINIC_KEYWORDS: ClinicKeyword[] = [
  { display: "OO치과", shape: "지역 + 진료과", rank: 1, page1: true },
  { display: "OO치과", shape: "지역 + 진료과", rank: 1, page1: true },
  { display: "OO피부과", shape: "지역 + 진료과", rank: 4, page1: true },
];
export const CLINIC_SUMMARY = {
  /** 플레이스 순위 계약이 있는 병·의원 수 */
  stores: 2,
  /** 계약 키워드 수 (관측용 서브 키워드는 세지 않는다) */
  keywords: 3,
  /** 기준일에 1페이지(1~5위) 안에 있는 계약 키워드 수 */
  page1: 3,
  /** 기준일에 1위인 계약 키워드 수 */
  top1: 2,
};
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
  `순위는 매일 저장한 스냅샷 실측값이며 업종·지역 경쟁 강도에 따라 달라집니다. ` +
  `방문객과 매출은 계측 대상이 아니어서 수치로 제시하지 않습니다.`;

export const PAGE1_NOTE =
  `네이버 플레이스 1페이지는 광고 지면 3개와 순위 1~5위로 구성됩니다. ` +
  `${SNAPSHOT_DATE} 기준 ${SUMMARY.page1Keywords}개 키워드가 1~5위를 지키고 있고, ` +
  `그중 ${SUMMARY.heldAllSnapshots}개는 누적 스냅샷 ${SUMMARY.snapshots}회 내내 한 번도 1페이지를 벗어나지 않았습니다.`;

/*
 * 병·의원 문장 — 화면 · JSON-LD · llms.txt 가 여기서 같은 문장을 가져간다.
 * 판정 정본 : E:\하랑\본부장\병의원\인계_SEO_GEO_AEO_병의원_2026-09-06.md 제4-C절
 *
 * 병·의원은 문장이 어긋나면 광고 성과가 아니라 원장님 행정처분이 걸린다 (C-50).
 * 화면마다 손으로 적으면 스냅샷이 바뀌는 날 세 곳이 서로 다른 말을 하므로 한 곳에서만 만든다.
 *
 * 두 가지를 지킨다.
 * 1) 상호를 적지 않는다. 업종 앞에 OO 를 붙이는 데서 멈춘다.
 * 2) 「누적 스냅샷 N회 내내」는 그 업종 기록이 전부 heldPage1 일 때만 붙인다.
 *    한 줄이라도 도중에 1페이지를 벗어났으면 그 문장이 거짓이 된다.
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

const KO_COUNT = ["", "", "두 개", "세 개", "네 개", "다섯 개"];
const koCount = (n: number) => KO_COUNT[n] || `${n}개`;

const heldAll = (rows: RankRecord[]) => rows.length > 0 && rows.every((r) => r.heldPage1);
const HELD_TAIL = `누적 스냅샷 ${SUMMARY.snapshots}회 내내 1페이지를 지키고 있습니다.`;

/** `32일 계측에서 7위가 1위가 됐고` · 자리를 지킨 기록은 `4위이고` */
const clinicClause = (r: RankRecord, cont: boolean) =>
  r.from === r.to
    ? `${r.to}위${cont ? "이고" : "입니다"}`
    : `${r.days}일 계측에서 ${r.from}위가 ${r.to}위가 ${cont ? "됐고" : "됐습니다"}`;

/** 업종 한 줄 — 값이 같은 기록끼리는 묶고, 다르면 기록마다 따로 적는다 */
function clinicLine(industry: string): string {
  const rows = byIndustry(industry);
  if (rows.length === 0) return "";
  const head = rows[0];
  const same = rows.every((r) => r.from === head.from && r.to === head.to && r.days === head.days);
  if (!same) {
    const each = rows.map((r) => fmtSentence(r)).join(", ");
    return `OO${industry}는 계약 키워드 ${koCount(rows.length)}가 각각 ${each}.`;
  }
  const cnt = rows.length === 1 ? "계약 키워드가" : `계약 키워드 ${koCount(rows.length)}가`;
  return heldAll(rows)
    ? `OO${industry}는 ${cnt} ${clinicClause(head, true)}, ${HELD_TAIL}`
    : `OO${industry}는 ${cnt} ${clinicClause(head, false)}.`;
}

/** 업종별 한 줄 — 기록이 없는 업종은 아예 빠진다 (C-42) */
export const CLINIC_LINES = CLINIC_INDUSTRIES.map(clinicLine).filter(Boolean);

/** 병·의원 공통 한 줄 — 화면 · JSON-LD · llms.txt 머리에 같이 쓴다 */
export const CLINIC_NOTE =
  CLINIC_PAGE1.length === 0
    ? ""
    : `${koDate(SNAPSHOT_DATE)} 기준 병·의원 계약 키워드 ${CLINIC_PAGE1.length}개가 ` +
      `네이버 플레이스 1페이지에 있습니다.` +
      (heldAll(CLINIC_PAGE1)
        ? ` 누적 스냅샷 ${SUMMARY.snapshots}회 내내 한 번도 1페이지를 벗어나지 않았습니다.`
        : "");

/**
 * 올라온 기록만 기간을 말한다.
 * 자리를 지킨 기록에 「4위에서 4위까지 32일」이라고 적으면 읽는 사람이 뜻을 못 잡는다.
 */
export const CLINIC_RISE_DURATIONS = CLINIC_RECORDS.filter((r) => r.from > r.to)
  .map((r) => `${r.keyword}가 ${r.from}위에서 ${r.to}위까지 ${r.days}일`)
  .join(", ");

/*
 * 병·의원 순위 현황 문장 — 진우 인계서 3-C 절 다섯 문장 (D-0280 · D-0282 · 2026-09-06 (일) 대표 지시).
 * 바로 위 4-C 절과 층이 다르다. 저기는 진우 판정을 통과한 진료과 하나의 개선 카드를 서술하고,
 * 여기는 계약 키워드 전체를 한 표로 세는 집계라 병원을 특정하지 않는다.
 * 문장을 화면에서 만들지 않는 이유는 위와 같다. 같은 말을 화면과 llms.txt 가 같이 쓰는데
 * 두 곳에서 따로 만들면 스냅샷이 바뀌는 날 서로 다른 말을 한다.
 * 「일곱 곳」은 누적이라 스냅샷에 없다. 진우 점검대장이 출처이고 바뀌면 진우가 알려 준다.
 * 표기는 OO치과 · OO피부과 에서 멈춘다. 지역 · 계약 키워드 · 상호는 어느 칸에도 적지 않는다 (C-50).
 */
const KO_NUM = ["", "한 ", "두 ", "세 ", "네 ", "다섯 ", "여섯 ", "일곱 ", "여덟 ", "아홉 ", "열 "];
/** 열까지는 우리말 수사(두 곳 · 세 개), 그 위는 숫자(12곳). 위 koCount 는 「개」가 붙어 있어 「곳」에 못 쓴다 */
const koNum = (n: number) => (n >= 1 && n <= 10 ? KO_NUM[n] : String(n));

function clinicStatusRankLine(): string {
  const { keywords, page1, top1 } = CLINIC_SUMMARY;
  const body = CLINIC_ALL_PAGE1
    ? `${koNum(keywords)}개 모두 1페이지 안에 있`
    : page1 === 0
      ? `${koNum(keywords)}개 중 1페이지 안에 있는 것이 없`
      : `${koNum(keywords)}개 중 ${koNum(page1)}개가 1페이지 안에 있`;
  const tail = top1 > 0 ? `고 그중 ${koNum(top1)}개는 1위입니다.` : "습니다.";
  return `${koDate(SNAPSHOT_DATE)} 기준으로 ${body}${tail}`;
}

/** 3-C 다섯 문장. 넷째 줄만 스냅샷마다 값이 바뀐다 */
export const CLINIC_STATUS_LINES = [
  "하랑마케팅은 병원과 의원 마케팅을 맡고 있습니다.",
  "지금까지 치과와 의원 일곱 곳의 블로그와 플레이스를 맡아왔습니다.",
  `플레이스 순위 계약은 현재 ${koNum(CLINIC_SUMMARY.stores)}곳이고 계약 키워드는 ${koNum(CLINIC_SUMMARY.keywords)}개입니다.`,
  clinicStatusRankLine(),
  "순위는 매일 계측하고 결과를 하루도 빠뜨리지 않고 기록으로 남깁니다.",
];

/** 3-D 표 아래 한 줄. 무엇을 언제 잰 숫자인지 표 옆에 붙여 둔다 */
export const CLINIC_STATUS_CAPTION = `기준일 ${koDate(SNAPSHOT_DATE)} · 계약 키워드 ${CLINIC_SUMMARY.keywords}개 ${
  CLINIC_ALL_PAGE1 ? "전부" : `중 ${CLINIC_SUMMARY.page1}개`
} 1페이지 안 · 매일 계측`;
