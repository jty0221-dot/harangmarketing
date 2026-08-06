/**
 * 카페 배포 상품 데이터 (서버·클라이언트 공용, 순수 데이터만)
 *
 * 상세페이지 · 레퍼런스 페이지 · 구조화 데이터 · llms.txt 가 모두 이 파일을 참조한다.
 * 가격이나 수량을 바꿀 때는 여기만 고치면 전부 따라간다.
 *
 * 출처: design_handoff_cafe_distribution (2026-08 핸드오프)
 */

/* ─────────────────────────────────────────────────────────
   캠페인 지표

   주의: 아래 값은 핸드오프 시점의 임시값이다.
   실제 잔여 슬롯·마감일과 다르면 허위 표시가 되므로
   운영값으로 교체하거나 showCampaignBar 를 false 로 둘 것.
   ───────────────────────────────────────────────────────── */
export const CAMPAIGN = {
  /** 캠페인 지표 바 노출 여부 — 실제 수치를 관리하지 않는 동안에는 false 권장 */
  showCampaignBar: false,
  deadlineLabel: "D-14",
  remainingSlots: 11,
  cumulativeCount: "1,480",
  allocationRate: 78,
} as const;

export interface RewardPlan {
  /** 기준 상품 수량 */
  base: string;
  /** 추가 제공되는 카페 배포 건수 */
  bonus: string;
  /** 정상가 (원, 부가세 별도) */
  listPrice: number;
  /** 이벤트가 (원, 부가세 별도) */
  eventPrice: number;
  /** 할인율 (%) — 원고 미포함 플랜은 표기하지 않음 */
  discount?: number;
  /** 총 건수 */
  totalCount: string;
  /** 1건당 단가 (원) */
  unitPrice: number;
  /** 가장 많이 선택하는 플랜 강조 */
  featured?: boolean;
}

/** REWARD 01 — 원고 작성 포함 */
export const REWARD_WITH_COPY: RewardPlan[] = [
  { base: "최블 10건", bonus: "카페 배포 5건 추가",  listPrice: 643000,  eventPrice: 579000,  discount: 10, totalCount: "총 15건", unitPrice: 38600 },
  { base: "최블 20건", bonus: "카페 배포 10건 추가", listPrice: 1287000, eventPrice: 1092000, discount: 15, totalCount: "총 30건", unitPrice: 36400 },
  { base: "최블 30건", bonus: "카페 배포 20건 추가", listPrice: 2145000, eventPrice: 1715000, discount: 20, totalCount: "총 50건", unitPrice: 34300, featured: true },
];

/** REWARD 02 — 원고 작성 미포함 (원고를 직접 제공하는 경우) */
export const REWARD_WITHOUT_COPY: RewardPlan[] = [
  { base: "최블 10건", bonus: "카페 배포 5건",  listPrice: 536000,  eventPrice: 483000,  totalCount: "총 15건", unitPrice: 32200 },
  { base: "최블 20건", bonus: "카페 배포 10건", listPrice: 1072000, eventPrice: 912000,  totalCount: "총 30건", unitPrice: 30400 },
  { base: "최블 30건", bonus: "카페 배포 20건", listPrice: 1787000, eventPrice: 1430000, totalCount: "총 50건", unitPrice: 28600 },
];

export const PRICE_NOTE = [
  "표기 금액은 부가세 별도입니다.",
  "정상가는 이벤트 미적용 시 기준 단가입니다.",
];

/** 카페 배포가 필요한 이유 */
export const WHY_CAFE = [
  {
    no: "01",
    title: "노출 면적 확대",
    desc: "블로그 + 카페 동시 노출로 같은 키워드에서 진입 경로를 늘립니다.",
  },
  {
    no: "02",
    title: "체류 시간 확보",
    desc: "카페 글은 읽고 넘어가는 흐름이 길어 브랜드 인지에 유리합니다.",
  },
  {
    no: "03",
    title: "추가 비용 없음",
    desc: "이벤트 기간 중에는 기존 상품 진행분에 배포 건이 얹혀 제공됩니다.",
  },
];

/** 진행 프로세스 4단계 */
export const PROCESS_STEPS = [
  { no: 1, title: "상담 · 신청",     desc: "업종과 목표 키워드 확인 후 수량 확정" },
  { no: 2, title: "원고 · 소재 준비", desc: "포함 상품은 원고 작성까지 진행" },
  { no: 3, title: "카페 배포",       desc: "주제와 맞는 카페에 순차 게시" },
  { no: 4, title: "URL 보고",        desc: "전체 게시 링크를 정리해 전달" },
];

/** 상세페이지 FAQ — FAQPage 구조화 데이터와 공용 */
export const CAFE_FAQ = [
  {
    q: "카페 배포 건은 어느 카페에 올라가나요?",
    a: "업종과 지역, 목표 키워드를 기준으로 주제가 맞는 카페에 배정합니다. 진행 후 게시 URL을 전달드리므로 결과를 직접 확인하실 수 있습니다.",
  },
  {
    q: "원고 미포함으로 진행하면 무엇을 준비해야 하나요?",
    a: "본문 텍스트와 사용 가능한 이미지를 전달해 주시면 됩니다. 카페별 게시 형식에 맞춘 편집은 하랑마케팅이 처리합니다.",
  },
  {
    q: "이벤트가 종료되면 카페 배포는 못 받나요?",
    a: "이벤트는 회차별 슬롯이 정해져 있어 마감 시 다음 회차 대기로 넘어갑니다. 종료 후에는 카페 배포가 별도 상품으로 전환됩니다.",
  },
  {
    q: "수량을 나눠서 진행할 수 있나요?",
    a: "가능합니다. 신청 수량 기준으로 혜택이 적용되며, 실제 게시 일정은 협의해 분산 진행할 수 있습니다.",
  },
  {
    q: "카페 배포는 블로그 배포와 무엇이 다른가요?",
    a: "블로그 배포는 네이버 블로그 탭에, 카페 배포는 카페 탭에 노출됩니다. 카페 탭은 실사용자 후기가 모이는 영역으로 인식되어 신뢰도가 높고, 두 영역에 함께 노출되면 같은 키워드에서 고객이 유입될 경로가 늘어납니다.",
  },
];

export interface RefCategory {
  slug: string;
  label: string;
  crumb: string;
  imagePrefix: string;
  keywords: string[];
}

/**
 * 업종별 카페 상위노출 레퍼런스 (실사 캡처)
 *
 * 캡처에서 판독한 실제 노출 키워드이므로 임의로 수정하지 말 것.
 * 이미지 경로 = imagePrefix + 2자리 인덱스 + ".png"
 */
export const REF_CATEGORIES: RefCategory[] = [
  {
    slug: "photo-mobile",
    label: "사진관 / 휴대폰",
    crumb: "사진관/휴대폰",
    imagePrefix: "/cafe-ref/ref-m-",
    keywords: [
      "용인 휴대폰 성지",
      "인천 아이폰 수리",
      "경주 휴대폰 성지",
      "광주 휴대폰성지",
      "부천아이폰AS",
      "아이폰 침수 수리",
      "용산 아이폰 수리",
      "용인 휴대폰",
      "인천아이폰AS",
      "파주 아이폰수리",
      "원동휴대폰수리",
      "원동휴대폰수리 후기",
    ],
  },
  {
    slug: "fitness",
    label: "헬스 / PT / 스포츠",
    crumb: "헬스/PT/스포츠",
    imagePrefix: "/cafe-ref/ref-f-",
    keywords: [
      "미사 헬스장",
      "목동필라테스",
      "서울대입구역 헬스장",
      "압구정 PT 후기",
      "압구정 헬스장",
      "영등포 헬스장",
      "오송 PT",
      "오송 헬스장",
      "오송피티",
      "오송피티 후기",
      "후쿠오카 골프",
      "후쿠오카 골프 후기",
    ],
  },
  {
    slug: "interior",
    label: "인테리어 / 이사 / 청소",
    crumb: "인테리어/이사/청소",
    imagePrefix: "/cafe-ref/ref-x-",
    keywords: [
      "천안커튼",
      "부산 폐기물",
      "천안철거",
      "거실 액자",
      "거실 액자 인테리어",
      "거창입주청소",
      "광주 이사준비",
      "광주 이사준비 비교",
      "광주리모델링",
      "광주인테리어",
      "그림 구매",
      "그림 선택",
      "김천이사청소",
      "김천입주청소",
      "김해 대형가구 처리",
      "김해 유품정리",
      "김해 특수청소",
      "김해 폐기물",
      "김해 폐기물",
      "대구 포장이사",
      "대구식당철거",
      "대구아파트인테리어",
      "대구아파트인테리어 견적",
      "대구아파트인테리어 견적 비교",
      "대구아파트인테리어 리모델링",
      "대구이사청소",
      "대구집정리",
      "대전입주청소업체",
      "대전철거",
      "대전철거 업체",
    ],
  },
  {
    slug: "pet",
    label: "반려동물",
    crumb: "반려동물",
    imagePrefix: "/cafe-ref/ref-p-",
    keywords: [
      "강아지 간식",
      "강아지 간식 추천",
      "강아지 눈물사료",
      "강아지 눈물사료 추천",
      "강아지 눈물자국",
      "강아지 알러지 사료",
      "고양이 무료분양 후기",
      "군포 고양이",
      "김포 고양이",
      "눈물사료 추천",
      "동탄고양이분양",
      "부산 강아지 분양",
      "부산 고양이 분양",
      "서울 강아지 분양",
      "서울강아지분양",
      "수원 고양이 분양",
      "안산 고양이",
      "안산 고양이 분양",
      "안산고양이분양",
      "오산 고양이",
      "원주 고양이분양",
      "원주고양이분양",
      "원주고양이분양 후기",
    ],
  },
  {
    slug: "beauty",
    label: "뷰티 / 케어 / 미용",
    crumb: "뷰티/케어/미용",
    imagePrefix: "/cafe-ref/ref-b-",
    keywords: [
      "동탄피부관리",
      "인천 미용실",
      "김포 마사지",
      "김포 장기동 마사지",
      "울산 속눈썹",
      "울산 속눈썹펌",
      "위례미용실",
      "장기동 마사지",
      "천안 피부관리",
    ],
  },
  {
    slug: "general",
    label: "일반 키워드",
    crumb: "일반키워드",
    imagePrefix: "/cafe-ref/ref-g-",
    keywords: [
      "50대 엄마생일선물",
      "50대엄마생신선물",
      "60대 엄마 생신선물",
      "개업 축하화환",
      "개업화환",
      "성남세무사",
      "성남세무사 상담 후기",
      "엄마 생신선물",
      "엄마생일선물",
      "용돈박스",
      "원주 금은방",
      "증여 상담 후기",
      "축하화환",
    ],
  },
  {
    slug: "clinic",
    label: "병의원 / 장례",
    crumb: "병의원/장례",
    imagePrefix: "/cafe-ref/ref-h-",
    keywords: [
      "보청기 교체",
      "위례 발톱무좀",
      "은평구보청기",
    ],
  },
  {
    slug: "travel",
    label: "여행 / 숙박",
    crumb: "여행/숙박",
    imagePrefix: "/cafe-ref/ref-t-",
    keywords: [
      "경주 숙소",
      "경주 숙소",
      "경주 펜션",
      "광안리 풀빌라",
      "강릉 아이와 가볼만한곳",
      "강릉 전시장",
      "강릉 핫플",
      "강화도 가볼만한곳",
      "강화도 여행",
      "강화도 여행코스",
      "경주 가족숙소",
      "경주 가족여행",
      "경주 숙소 추천",
      "경주 여행 숙소",
      "경주 한옥",
      "경주 한옥 펜션",
      "경주 핫플",
      "경주여행 숙소",
      "광안리 가족숙소",
      "서귀포 가볼만한곳",
      "서귀포 여행",
      "서귀포 여행코스",
      "전주 인생포토존",
      "제주도 가족여행",
      "제주도 가족여행 코스",
      "제주도 아이랑 동반 여행",
      "제주도 아이랑 여행",
      "제주도여행",
      "제주도여행코스",
      "후쿠오카 골프 여행",
    ],
  },
  {
    slug: "furniture",
    label: "가구 / 기념품 / 답례품",
    crumb: "가구/기념품/답례품",
    imagePrefix: "/cafe-ref/refs-",
    keywords: [
      "성수동 가구점",
      "세교 가구점",
      "송탄가구단지",
      "송파 가구거리",
      "송파가구단지",
      "수서 가구점",
      "신장동 가구점",
      "양주가구단지",
      "여수가구단지",
      "오산가구단지",
      "왕십리 가구",
      "왕십리 가구점",
      "용인 가구",
      "용인 가구전시회",
      "용인가구단지",
      "의왕 가구단지",
      "의왕 가구점",
      "의정부가구거리",
      "인천가구거리",
      "인천가구단지",
      "인천가구싼곳",
      "인천가구싼곳",
      "인천가구추천",
      "창원 가구",
      "창원 가구점",
      "창원가구",
      "창원가구거리",
      "창원가구매장",
      "포천가구거리",
      "하남 가구",
      "하남 가구매장",
      "하남가구단지",
      "화성가구단지",
    ],
  },
];

/** 레퍼런스 총 키워드 수 */
export const REF_TOTAL = REF_CATEGORIES.reduce((n, c) => n + c.keywords.length, 0);

/** 인덱스 → 캡처 이미지 경로 */
export function refImage(cat: RefCategory, index: number): string {
  return `${cat.imagePrefix}${String(index + 1).padStart(2, "0")}.png`;
}

/** 금액 표기 — 1234000 → "1,234,000원" */
export function won(n: number): string {
  return `${n.toLocaleString("ko-KR")}원`;
}
