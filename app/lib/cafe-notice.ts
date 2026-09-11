/**
 * 대표카페 운영 공지 — 화면에 뜨는 공지 팝업의 유일한 출처.
 *
 * 문구·날짜·노출 경로를 여기서만 고친다. 컴포넌트 안에 문장을 적지 않는다.
 * 공지를 새로 띄우려면 id 를 바꾼다 — 닫기 기록이 id 로 저장돼서
 * id 가 바뀌면 이미 닫은 사람에게도 다시 뜬다.
 *
 * 단가는 여기 적지 않는다. cafe-distribution.ts 의 CAFE_TIERS 가 정본이고
 * 팝업은 그것을 읽어서 보여준다. 두 곳에 숫자를 적으면 한쪽만 고쳐진다.
 */

import { CAFE_TIERS } from "./cafe-distribution";

/** 카페 한 곳. 줄 하나가 표의 한 행이 된다 */
export type CafeRow = {
  /** 카페 이름 그대로. 2026-09-10 (목) 대표 지시 「이건 카페 이름 그대로 보여도 되」 */
  name: string;
  /** 로고 파일 이름. cafeLogoSrc() 가 public/cafe-logo/cafe-<logo>.png 로 바꾼다 */
  logo: string;
  /** 이번에 새로 들어온 곳인가. 배포처 표의 NEW 표시를 그대로 옮긴 것이다 */
  isNew?: boolean;
};

/**
 * 배포처 단가표 캡처에서 잘라낸 한 장.
 *
 * 크기를 같이 들고 다니는 이유가 있다. img 에 width/height 를 적어 두면 그림이
 * 도착하기 전에 브라우저가 자리를 먼저 잡는다. 안 적으면 카드가 한 번 출렁인다.
 */
export type CafeSheet = {
  /** public/cafe-sheet/ 아래 파일 */
  src: string;
  /** 원본 크기 (px) */
  width: number;
  height: number;
};

export interface CafeGroup {
  /** 화면에 뜨는 묶음 이름 */
  label: string;
  /**
   * 단가를 찾는 열쇠. CAFE_TIERS 의 grade 와 글자까지 같아야 한다.
   * 여기에 금액을 적지 않는 이유가 이것이다 — 등급표를 고치면 이 표도 같이 따라온다.
   */
  grade: string;
  /** 묶음 이름만으로 부족할 때 붙이는 한 마디 */
  note?: string;
  /** 이 묶음을 찍은 캡처 조각. 화면에 뜨는 것은 이 그림이다 */
  sheet: CafeSheet;
  /**
   * 그림 안에 있는 카페들.
   *
   * 화면에 줄로 그리지 않는다. 개수를 세고(21곳 · 신규 6곳) 그림을 못 볼 때
   * 읽히는 대체 문구를 만드는 데 쓴다. 명단을 두 벌 적지 않으려고 여기 한 벌만 둔다.
   */
  cafes: CafeRow[];
}

/**
 * 지금 배포할 수 있는 카페.
 *
 * 2026-09-10 (목) 대표가 배포처 단가표를 넘기며 지시했다
 * 「팝업에 이렇게 정리해서 어떤 업체가 가능한지 보이게 해놓으라고
 *   금액은 당연히 도매처 금액이니 우리 맞게 변경하고」.
 *
 * 처음에는 이름만 옮겨 글자 표로 다시 그렸는데 2026-09-11 (금) 대표가 되돌렸다
 * 「아니 그냥 로고 이미지에 있는 사진 그대로 팝업으로 만들어서 띄워」.
 * 그래서 지금 화면에 뜨는 것은 배포처 캡처 자체다 (public/cafe-sheet/).
 *
 * 원본에서 잘라낸 것은 두 열뿐이다.
 *   1) 「가격」 열 — 배포처 도매가라 우리 원가다. 화면에 뜨면 안 된다
 *   2) 「구분」 열 — 「화력보장」 배지가 성과를 약속하는 말이라 검색광고 심사에서 반려된다 (헌장 C-36)
 * 번호 · NEW 리본 · 로고 · 카페 이름은 원본 픽셀 그대로 남겼다.
 * 자른 좌표와 검증은 scratchpad 의 ship-sheet.py 가 들고 있다.
 *
 * 묶음은 배포처 단가로 가른다 — 배포처 원가 20,000 · 30,000 · 50,000 이
 * 우리 등급표의 24,000 · 36,000 · 60,000 과 그대로 짝이 맞는다.
 * 그림에는 금액이 없으므로 단가는 묶음 머리에 글자로 붙는다. 출처는 CAFE_TIERS 다.
 */
export const CAFE_GROUPS: CafeGroup[] = [
  {
    label: "대표카페",
    grade: "대형 카페",
    note: "네이버 대표카페 배지가 붙은 곳입니다.",
    sheet: { src: "/cafe-sheet/cafe-sheet-1.webp", width: 422, height: 606 },
    cafes: [
      { name: "결혼준비는제이웨딩", logo: "jwedding" },
      { name: "차박은 내친구", logo: "charbak", isNew: true },
      { name: "레드펄스바다낚시", logo: "redpulse", isNew: true },
      { name: "예카", logo: "yeka", isNew: true },
      { name: "샤넬오픈런", logo: "chanel", isNew: true },
      { name: "쇼핑지름신", logo: "shoji", isNew: true },
      { name: "시계거래소", logo: "watch", isNew: true },
      { name: "컬처블룸", logo: "culturebloom" },
    ],
  },
  {
    label: "리뷰 · 문화 카페",
    grade: "리뷰 · 문화 카페",
    sheet: { src: "/cafe-sheet/cafe-sheet-2.webp", width: 422, height: 152 },
    cafes: [
      { name: "맛슐랭 코리아", logo: "matsulen" },
      { name: "세종시닷컴", logo: "sejongsi" },
    ],
  },
  {
    label: "지역 · 주제 카페",
    grade: "지역 · 주제 카페",
    sheet: { src: "/cafe-sheet/cafe-sheet-3.webp", width: 422, height: 834 },
    cafes: [
      { name: "현명한 소비철학", logo: "sobichulhak" },
      { name: "더먹자", logo: "deomeokja" },
      { name: "혼결모", logo: "hongyeolmo" },
      { name: "인테리어에 진심인 사람들", logo: "interior" },
      { name: "누수제로", logo: "nusuzero" },
      { name: "커튼블라인드홈", logo: "curtainblind" },
      { name: "청소 폐기물 119", logo: "cleaning119" },
      { name: "애랑먹자", logo: "aerangmeokja" },
      { name: "서귀포 한입여행", logo: "seogwipo" },
      { name: "제주놀라갑서", logo: "jejunolra" },
      { name: "모두의 셀프 스킨케어", logo: "selfskincare" },
    ],
  },
];

/** 표에 실린 카페 수. 손으로 세지 않는다 */
export const CAFE_GROUPS_TOTAL = CAFE_GROUPS.reduce((n, g) => n + g.cafes.length, 0);

/** 그중 이번에 새로 붙은 곳. 공지 문장이 이 수를 가져다 쓴다 */
export const CAFE_NEW_TOTAL = CAFE_GROUPS.reduce(
  (n, g) => n + g.cafes.filter((c) => c.isNew).length,
  0,
);

/**
 * 01 번 문장.
 *
 * 표 안에서 세어 쓴다. 손으로 적으면 카페를 더 붙였을 때 문장만 옛 수로 남는다
 * (2026-09-10 (목) 실제로 공지는 두 곳 · 표는 여섯 곳으로 어긋나 있었다).
 * 템플릿 문자열은 `as const` 객체 안에 직접 못 넣으므로 여기서 만들어 넘긴다.
 */
/**
 * 카페 로고 파일 경로.
 *
 * 2026-09-11 (금) 대표 지시 「팝업 자체를 조금 늘려서 이미지나 로고 까지 같이 올라갈 수 있게
 * 해줘 · 보면 못알아봐 고객 입장에서 항상 생각하라고」.
 * 배포처가 넘긴 단가표 이미지에서 21곳의 로고를 실측 좌표로 잘라
 * public/cafe-logo/ 에 56x56 PNG 로 넣었다. 폴더가 바뀌면 여기 한 줄만 고친다.
 *
 * 같은 날 저녁 캡처를 통째로 올리기로 바뀌면서 화면에서는 더 쓰지 않는다.
 * 그래도 함수와 21장은 지우지 않는다 (헌장 C-24) — 배포처가 넘긴 원본에서 잘라낸
 * 유일한 로고 자산이라, 다시 필요해지면 이것 말고 가져올 데가 없다.
 */
export function cafeLogoSrc(logo: string): string {
  return `/cafe-logo/cafe-${logo}.png`;
}

/**
 * 그림을 못 볼 때 대신 읽히는 문장.
 *
 * 카페 이름이 그림 안에 들어 있어서, 그림이 안 뜨거나 화면을 읽어 주는 기기로 보면
 * 아무것도 안 남는다. 그래서 이름을 여기서 풀어 준다. 명단을 두 벌 적는 게 아니라
 * 위 한 벌에서 만들어 쓴다 — 카페를 더 붙이면 이 문장도 같이 따라온다.
 */
export function cafeSheetAlt(group: CafeGroup): string {
  return `${group.label} ${group.cafes.length}곳 · ${group.cafes.map((c) => c.name).join(", ")}`;
}

/**
 * 팝업 한 장에 올릴 묶음.
 *
 * 캡처 조각 세 장을 세로로 세우면 1,592px 이라 한 장에 안 들어간다.
 * 「알아서 팝업 크기 조정해 2장으로 쪼개던지」 에 따라 표를 두 장으로 나눈다.
 * 대표카페가 한 장(606px), 나머지 두 묶음이 한 장(152 + 834px)이다.
 * 묶음을 반으로 잘라 두 장에 걸치지 않는다 — 단가가 묶음 머리에 글자로 붙어 있어서
 * 쪼개면 금액 없는 그림이 생긴다. 묶음을 더 만들면 자동으로 뒷장에 붙는다.
 */
export const CAFE_PAGES: CafeGroup[][] = [
  CAFE_GROUPS.filter((g) => g.label === "대표카페"),
  CAFE_GROUPS.filter((g) => g.label !== "대표카페"),
].filter((page) => page.length > 0);

/** 팝업 장 수. 첫 장은 공지 본문이고 나머지가 카페 표다. 손으로 세지 않는다 */
export const NOTICE_PAGES = 1 + CAFE_PAGES.length;

const POINT_NEW_BODY = `대표카페 제휴처 ${CAFE_NEW_TOTAL}곳을 새로 확보했습니다. 아래 표에서 신규로 표시한 곳입니다. 다른 대표카페와도 제휴 협의를 이어가고 있습니다.`;

/**
 * 묶음의 건당 단가. CAFE_TIERS 에서 찾아온다.
 *
 * 못 찾으면 undefined 를 돌려주고 화면은 금액 칸을 비운다.
 * 찾다 만 값을 0 으로 채우면 무료로 읽힌다 (헌장 C-42 · 틀린 값이 빈 값보다 나쁘다).
 */
export function groupPrice(grade: string): number | undefined {
  return CAFE_TIERS.find((t) => t.grade === grade)?.price;
}

/**
 * 공지를 띄울 경로.
 *
 * "/" 는 메인 한 장에서만 뜬다. 앞부분 매칭으로 두면 39개 라우트 전부에 뜬다.
 * 나머지 항목은 앞부분이 맞으면 뜬다 (하위 경로 포함).
 */
export const NOTICE_PATHS = ["/", "/services/cafe-distribution"];

export const CAFE_NOTICE = {
  /** 이 값을 바꾸면 이미 닫은 사람에게도 다시 뜬다 */
  id: "cafe-notice-2026-09-10",
  date: "2026-09-10 (목)",
  eyebrow: "운영 공지",
  title: "대표카페 운영 변경 안내",
  intro: "대표카페 운영에 바뀐 점이 있어 먼저 알려드립니다.",

  points: [
    {
      no: "01",
      label: "대표카페 제휴처 추가 확보",
      body: POINT_NEW_BODY,
    },
    {
      no: "02",
      label: "대표카페 단가 조정",
      body: "네이버 노출 환경이 바뀌면서 게시 자리를 잡고 발행 뒤 노출을 확인하는 작업이 늘었습니다. 그 작업 비용을 반영해 단가를 조정했습니다.",
    },
  ],

  /** 2장 머리글. 1장은 공지 본문, 2장은 카페 표다 */
  cafeTitle: "지금 배포할 수 있는 카페",
  cafeLeadSub: "건당 금액이며 부가세는 별도입니다.",

  /** 표 아래 한 줄 */
  tierNote: "원고 작성을 맡기시면 건당 추가 비용이 붙습니다. 카페는 상담에서 골라 정합니다.",

  closing: [
    "지금은 제휴처를 늘리는 일을 가장 앞에 두고 있습니다. 제휴처가 넓어지는 대로 단가를 다시 내릴 계획입니다.",
    "갑작스러운 변경으로 불편을 드려 죄송합니다. 빠르게 정상화하겠습니다.",
  ],

  /** 장 넘김 버튼. more 는 카페 표가 두 장으로 나뉘면서 생긴 가운데 버튼이다 */
  nav: { next: "카페 목록 보기", more: "나머지 카페 보기", prev: "이전" },
  cta: { label: "단가 문의하기", href: "/contact" },
  dismiss: "확인했습니다",
} as const;

/** 닫기 기록 저장 키. 두 컴포넌트가 각자 문자열을 조립하면 한쪽만 틀어진다 */
export const NOTICE_STORAGE_KEY = `harang_notice_${CAFE_NOTICE.id}`;

/**
 * 이 경로에서 공지 카드가 뜨는가.
 *
 * "/" 만 정확히 맞춘다. 앞부분 매칭으로 두면 모든 라우트에 뜬다.
 */
export function noticeShowsOn(pathname: string): boolean {
  return NOTICE_PATHS.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));
}

/**
 * 공지 카드가 지금 그 자리를 차지하고 있는가.
 *
 * 같은 자리(데스크톱 우하단 · 모바일 하단)에 카드를 띄우는 쪽이 물어본다.
 * 메인에는 상담 카드가 이미 그 자리에 뜬다 — 두 장이 겹치면 뒤 카드가 앞 카드를 통째로 덮는다.
 * 저장소를 못 읽으면 공지는 뜨는 쪽으로 동작하므로 여기서도 뜬다고 답한다.
 */
export function noticeOccupies(pathname: string): boolean {
  if (!noticeShowsOn(pathname)) return false;
  try {
    return !localStorage.getItem(NOTICE_STORAGE_KEY);
  } catch {
    return true;
  }
}
