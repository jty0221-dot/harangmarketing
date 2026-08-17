/**
 * 최적화 블로그 · 카페 배포 상품 데이터 (서버·클라이언트 공용, 순수 데이터만)
 *
 * 상세페이지 · 레퍼런스 페이지 · 구조화 데이터 · llms.txt 가 모두 이 파일을 참조한다.
 * 가격이나 수량을 바꿀 때는 여기만 고치면 전부 따라간다.
 *
 * 출처: design_handoff_cafe_distribution (2026-08 핸드오프)
 */

/* ─────────────────────────────────────────────────────────
   캠페인 지표 — 손대지 않아도 회차가 자동으로 굴러간다.

   cycleAnchor 부터 cycleDays 주기로 회차가 반복된다.
   마감일이 지나면 다음 회차 마감일로 자동 이동하고 잔여 슬롯도 리셋된다.
   따라서 "D-14" 가 굳어버리거나 마감 이후 카운트다운이 멈추는 일이 없다.

   잔여 슬롯은 회차 진행률에 따라 slotsAtStart → slotsAtEnd 로 줄어든다.
   실제 예약 현황을 연동한 값이 아니라 회차 배정 추이를 반영한 수치이므로,
   실측 슬롯을 관리하게 되면 remainingSlots() 를 그 값으로 교체할 것.
   운영을 멈출 때는 showCampaignBar 를 false 로 두면 바 전체가 사라진다.
   ───────────────────────────────────────────────────────── */
export const CAMPAIGN = {
  /** 캠페인 지표 바 노출 여부 */
  showCampaignBar: true,
  /** 회차 기준일 — 이 날짜를 시작점으로 cycleDays 마다 회차가 반복된다 */
  cycleAnchor: "2026-08-06",
  /** 한 회차 길이(일) */
  cycleDays: 14,
  /** 회차 총 슬롯 */
  totalSlots: 50,
  /** 회차 시작 시 잔여 슬롯 */
  slotsAtStart: 42,
  /** 마감 임박 시 남는 잔여 슬롯 */
  slotsAtEnd: 4,
  /** 누적 진행 건수 (실적값 — 자동 증가시키지 않는다) */
  cumulativeCount: 1480,
  /** 카페 배포 주간 처리량 */
  weeklyVolume: 1000,
} as const;

const DAY_MS = 86_400_000;

/** 기준일 자정(KST)의 epoch */
function anchorMs(): number {
  return new Date(`${CAMPAIGN.cycleAnchor}T00:00:00+09:00`).getTime();
}

export interface CampaignRound {
  /** 회차 번호 (1부터) */
  round: number;
  /** 마감까지 남은 일수 (최소 1 — 0 이면 이미 다음 회차로 넘어간다) */
  dday: number;
  /** 회차 진행률 0~1 */
  progress: number;
}

/**
 * 지금 시점의 회차 정보.
 * 마감이 지나면 자동으로 다음 회차가 되므로 별도 관리가 필요 없다.
 */
export function currentRound(now: Date = new Date()): CampaignRound {
  const cycleMs = CAMPAIGN.cycleDays * DAY_MS;
  const elapsed = now.getTime() - anchorMs();
  const index = Math.floor(elapsed / cycleMs);
  const intoCycle = elapsed - index * cycleMs;
  const progress = Math.min(1, Math.max(0, intoCycle / cycleMs));
  const dday = Math.max(1, Math.ceil((cycleMs - intoCycle) / DAY_MS));
  return { round: index + 1, dday, progress };
}

/** 회차 진행률에 따라 줄어드는 잔여 슬롯 */
export function remainingSlots(now: Date = new Date()): number {
  const { progress } = currentRound(now);
  const { slotsAtStart, slotsAtEnd } = CAMPAIGN;
  return Math.max(slotsAtEnd, Math.round(slotsAtStart - (slotsAtStart - slotsAtEnd) * progress));
}

/** 이번 회차 배정률(%) — 잔여 슬롯에서 역산 */
export function allocationRate(now: Date = new Date()): number {
  return Math.round(((CAMPAIGN.totalSlots - remainingSlots(now)) / CAMPAIGN.totalSlots) * 100);
}

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
  /** 탭 버튼용 축약 라벨 — 업종이 14개라 정식 라벨로는 탭이 3줄로 접힌다 */
  short: string;
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
    slug: "restaurant",
    short: "맛집·카페",
    label: "맛집 / 카페 / 외식",
    crumb: "맛집/카페/외식",
    imagePrefix: "/cafe-ref/ref-r-",
    keywords: [
      "경주 보문단지 맛집",
      "강화도 카페",
      "신촌 맛집",
      "일산 맛집",
      "황리단길 카페",
      "360도CC 아침식사",
      "가족외식 장소 추천",
      "가평 닭갈비",
      "가평 닭갈비 맛집",
      "가평 현지인 맛집",
      "강화도 고기집",
      "강화도 전등사 맛집",
      "강화도 전등사 맛집",
      "강화도 찐맛집",
      "강화도 카페 추천",
      "경주 맛집 추천",
      "공덕 고기집",
      "공덕 고기집 맛집",
      "공덕 고기집 추천",
      "공덕 맛집",
      "공덕 맛집",
      "공덕 제철회",
      "공덕 한우",
      "공덕 회식",
      "광안리 가성비 맛집",
      "광안리 가족외식",
      "광안리 가족외식 장소",
      "광안리 가족외식 장소 추천",
      "광안리 데이트",
      "광안리 데이트 맛집",
      "광안리 맛집",
      "광안리 저녁",
      "광안리 저녁 맛집",
      "광안리 저녁 맛집",
      "광안리 조개한상",
      "광안리 해산물 맛집",
      "광안리 현지인 맛집",
      "광안리 현지인 맛집",
      "광주 상무지구 맛집",
      "광주 상무지구 맛집",
      "구의 맛집",
      "구의 맛집",
      "구의역 혼밥",
      "기장 철마 맛집",
      "기장 한우 맛집",
      "낙산사 맛집",
      "낙산사 해수욕장 맛집",
      "남악 가족식사",
      "남악 낙지",
      "남악 낙지 맛집",
      "남악 저녁맛집",
      "논현역 맛집",
      "당산 맛집",
      "당산 회식",
      "당산역 맛집",
      "대구 찜갈비",
      "대구 찜갈비 맛집",
      "대구 카츠 맛집",
      "대구 현지인 맛집",
      "대부도 수산시장",
      "대부도 왕새우",
      "대전 대흥동 맛집",
      "대전역 라멘",
      "대치동 맛집",
      "대흥동 맛집",
      "대흥역 맛집",
      "대흥역 맛집",
      "마두역 맛집",
      "마두역 모임",
      "마포 맛집",
      "마포 맛집",
      "마포 맛집 추천",
      "망포 맛집",
      "목동 맛집",
      "목동 맛집 추천",
      "무안 낙지",
      "무안 낙지 맛집",
      "무안 로컬 맛집",
      "무안 산낙지",
      "무주 계곡 카페",
      "무주 데이트",
      "무주 맛집 리뷰",
      "무주 카페",
      "무주 카페",
      "무주 카페 추천",
      "무주 카페 추천",
      "물왕리 맛집",
      "물왕리 밥집",
      "물왕리 밥집 추천",
      "물왕리 현지인 추천",
      "물왕저수지 맛집",
      "방이동 맛집",
      "범어동 우동",
      "범어동 카츠",
      "범어역 밥집",
      "별내 맛집",
      "보문단지 맛집",
      "부산 광안리 술집",
      "부산 데이트",
      "부산 데이트 맛집",
      "부산 수육",
      "부산 수육 맛집",
      "부산 해장 맛집",
      "사당 회식",
      "사당 회식",
      "사당 회식 맛집",
      "사당 회식 장소",
      "사당역 가족 외식",
      "사당역 외식",
      "삼성역 데이트",
      "삼성역맛집",
      "상남동 닭갈비",
      "상남동 점심",
      "상남동 횟집",
      "상무지구 맛집",
      "서강대 맛집",
      "서귀포 흑돼지",
      "서귀포 흑돼지 맛집",
      "서산 맛집",
      "서산 점심",
      "서오릉 맛집",
      "서울 회전초밥",
      "서울 회전초밥 맛집",
      "서울대학교병원 맛집",
      "서호시장 맛집",
      "석모리 맛집",
      "성대 맛집",
    ],
  },
  {
    slug: "photo-mobile",
    short: "사진관·폰",
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
    short: "헬스·PT",
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
    short: "인테리어·청소",
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
    short: "반려동물",
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
    short: "뷰티·미용",
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
    short: "일반 키워드",
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
    short: "병의원·장례",
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
    short: "여행·숙박",
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
    short: "가구·답례품",
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
  {
    slug: "wedding",
    short: "웨딩·돌잔치",
    label: "결혼 / 웨딩 / 돌잔치",
    crumb: "결혼/웨딩/돌잔치",
    imagePrefix: "/cafe-ref/ref-w-",
    keywords: [
      "인천 단독홀",
      "인천맞춤정장",
      "평택웨딩홀",
      "전주 맞춤정장",
      "광주스드메",
      "김포 웨딩홀",
      "광주드레스샵",
      "광주스드메",
      "광주웨딩드레스",
      "광주웨딩플래너",
      "김포 스몰웨딩",
      "인천 스몰웨딩",
      "인천스몰웨딩",
      "전주 맞춤예복",
      "평택결혼식 후기",
      "평택예식장",
      "평택예식장 후기",
      "구로 맞춤정장",
      "의정부한복대여",
      "일산맞춤 예복",
      "잠실 한복대여",
      "종로한복대여",
      "천호 맞춤정장",
    ],
  },
  {
    slug: "fortune",
    short: "점집·사주",
    label: "점집 / 사주 / 타로",
    crumb: "점집/사주",
    imagePrefix: "/cafe-ref/ref-j-",
    keywords: [
      "양산점집",
      "양산점집 후기",
      "인천용한점집",
      "인천점집후기",
      "광명점집",
      "남동구점집",
      "재회타로",
      "전화신점",
      "간석동 신점",
      "간석동점집",
      "광명시 점집",
      "남동구 신점",
      "대전용한점집",
      "재회타로 상담",
      "재회타로 상담 후기",
      "재회타로 후기",
      "전화사주 후기",
      "전화신점 후기",
      "포천 점집 후기",
      "포천신점",
      "포천점집",
      "구로점집",
      "김포점집",
      "대구 점집",
      "전화타로",
      "연신내 가게터",
      "연신내 사업운",
      "연신내 점집",
      "전화타로 상담",
      "전화타로 상담 후기",
      "타로 상담",
    ],
  },
  {
    slug: "car",
    short: "자동차·정비",
    label: "자동차 / 정비 / 세차",
    crumb: "자동차/정비/세차",
    imagePrefix: "/cafe-ref/ref-c-",
    keywords: [
      "서울폐차장",
      "수입차 수리",
      "인천 타이어",
      "송도덴트",
      "송도덴트 후기",
      "영종도 덴트",
      "의정부덴트",
      "인천 송도덴트",
      "청라덴트",
      "대전 범퍼복원",
      "대전 범퍼수리",
      "대전 부분도색",
      "대전 실내세차",
      "대전 썬팅",
      "대전 크리닝",
      "볼보 XC90 PPF",
      "인천PPF",
      "일산덴트",
      "파주덴트",
      "파주덴트 랩핑",
      "파주덴트 전체",
    ],
  },
  {
    slug: "edu",
    short: "교육·레슨",
    label: "여행 / 교육 / 레슨",
    crumb: "여행/교육",
    imagePrefix: "/cafe-ref/ref-e-",
    keywords: [
      "인천공항 발렛파킹",
      "인천공항 무료 주차비",
      "영덕 달빛고래 트레킹",
      "강남 보컬학원",
      "정보올림피아드",
      "정보올림피아드 준비",
      "광주보컬학원",
      "광주보컬학원",
      "동탄골프레슨",
      "분당골프레슨",
      "사회복지과 공부",
      "안산골프레슨",
      "천안보컬레슨",
      "천안보컬학원",
      "평택 고덕수학학원",
      "평택 온탑수학학원",
    ],
  },
];

/**
 * 상세페이지 인라인 증거용 업종별 대표 캡처.
 *
 * 와디즈형 상세페이지는 "말"보다 "실제 화면"이 설득력을 만든다.
 * 레퍼런스 페이지로 넘어가지 않아도 상세페이지에서 업종 전체 스펙트럼을 보게 한다.
 *
 * 업종을 직접 나열하지 않고 REF_CATEGORIES 에서 뽑는다.
 * 업종이 추가되거나 키워드 순서가 바뀌어도 자동으로 따라간다.
 */
export interface ProofSample {
  keyword: string;
  image: string;
  industry: string;
  /** 해당 업종 총 키워드 수 */
  count: number;
  /** 레퍼런스 페이지 딥링크용 */
  slug: string;
}

/** 업종별 대표 캡처 1장씩 (업종 순서 = REF_CATEGORIES 순서) */
export const PROOF_SAMPLES: ProofSample[] = REF_CATEGORIES
  .filter((c) => c.keywords.length > 0)
  .map((c) => ({
    keyword: c.keywords[0],
    image: `${c.imagePrefix}01.png`,
    industry: c.label,
    count: c.keywords.length,
    slug: c.slug,
  }));

/** 상세페이지 신뢰 보장 항목 */
export const GUARANTEES = [
  { title: "게시 URL 전체 전달", desc: "진행한 건마다 실제 게시 링크를 정리해 드립니다. 확인 못 하는 작업은 없습니다." },
  { title: "표기 금액 부가세 별도", desc: "결제 단계에서 금액이 달라지지 않도록 기준을 먼저 밝힙니다." },
  { title: "상담·업종 가능 여부 진단 0원", desc: "진행이 어려운 업종이면 계약 전에 솔직하게 말씀드립니다." },
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
