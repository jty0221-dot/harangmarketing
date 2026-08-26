/**
 * 상세페이지 레퍼런스 데이터 — 종류별 실물 상세페이지 목록 (순수 데이터만)
 *
 * 출처는 디자인 파트너 연우디자인스튜디오의 공개 포트폴리오다.
 * 게재 허락은 연우에게 받았다 (대표 확인 2026-08-27 · D-0078).
 * 다만 각 상품 판매자의 상호 노출 동의는 아직 받지 못했으므로
 * title 에 상호·브랜드를 쓰지 않고 제품 종류만 적는다 (C-42 · 틀린 값이 빈 값보다 나쁘다).
 *
 * 원본 노션에는 생활용품·반려동물·의류·뷰티 네 칸만 분류돼 있고
 * 나머지 20건은 아래에 그냥 쌓여 있었다. 그래서 종류는 여기서 다시 나눴다.
 *
 * 이미지는 노션을 직접 물고 있지 않고 public/detail-ref 로 받아 뒀다.
 * 남의 서버를 우리 페이지 로딩 경로에 넣으면 그쪽이 바뀔 때 우리 화면이 깨진다.
 *   public/detail-ref/<slug>.jpg        카드 썸네일 (상단 3:4 크롭)
 *   public/detail-ref/full/<slug>.jpg   전체 상세페이지 (여러 컷이면 이어 붙인 것)
 *
 * cuts 는 노션 원본의 컷 수, clipped 는 원본이 너무 길어 앞부분만 실은 건이다.
 */

export interface RefWork {
  /** 이미지 파일명 겸 식별자 */
  slug: string;
  /** 화면 표기 — 제품 종류만. 상호·브랜드는 쓰지 않는다 */
  title: string;
  /** 제작 시기 YYYY-MM (연·월까지만 확인된 건은 연도만) */
  when: string;
  /** 노션 원본의 컷 수 */
  cuts: number;
  /** 썸네일 실치수 — width/height 를 안 박으면 스크롤 중 레이아웃이 계속 밀린다 */
  tw: number;
  th: number;
  /** 전체보기 실치수 */
  fw: number;
  fh: number;
  /** 원본이 길어 앞부분만 실었나 */
  clipped: boolean;
}

export interface RefCategory {
  slug: string;
  label: string;
  /** 탭 버튼용 축약 라벨 */
  short: string;
  works: RefWork[];
}

export const REF_CATEGORIES: RefCategory[] = [
  {
    slug: "living",
    label: "생활·리빙",
    short: "생활·리빙",
    works: [
    { slug: "acrylic-bookstand",       title: "360도 회전 아크릴 독서대",                 when: "2024-04",  cuts: 12,  tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    { slug: "magnet-hook",             title: "펀치프리 자석 후크",                      when: "2024-04",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 8660,  clipped: false },
    { slug: "travel-cover-set",        title: "일회용 여행커버 올인원 세트",                 when: "2024-04",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 11480, clipped: false },
    { slug: "waterproof-drawer-mat",   title: "방수 서랍 매트",                        when: "2024-05",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 11842, clipped: false },
    { slug: "gadget-hook",             title: "힘쎈 가제트 고리",                       when: "2024-05",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 13397, clipped: false },
    { slug: "cleaning-brush",          title: "깔끔 청소솔",                          when: "2024-05",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 13433, clipped: false },
    { slug: "steel-slicer-set",        title: "3타입 스텐 채칼 세트",                    when: "2024-05",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 11665, clipped: false },
    { slug: "mood-light-frame",        title: "액자형 무드등 (리뉴얼)",                   when: "2024-12",  cuts: 24,  tw: 560,  th: 717,  fw: 760,  fh: 18000, clipped: true },
    ],
  },
  {
    slug: "storage",
    label: "수납·가구",
    short: "수납·가구",
    works: [
    { slug: "ground-chair",            title: "접이식 그라운드 체어",                     when: "2024-05",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 12569, clipped: false },
    { slug: "console-drawer",          title: "콘솔 서랍장",                          when: "2024-05",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 16467, clipped: false },
    { slug: "cosmetic-organizer",      title: "대용량 화장품 정리대",                     when: "2024-07",  cuts: 12,  tw: 560,  th: 718,  fw: 760,  fh: 17696, clipped: false },
    { slug: "cable-shelf",             title: "멀티탭 선 정리 무타공 선반",                 when: "2025-01",  cuts: 5,   tw: 560,  th: 747,  fw: 760,  fh: 17548, clipped: false },
    { slug: "plant-shelf-1",           title: "화분 선반 (1차안)",                     when: "2025-04",  cuts: 8,   tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    { slug: "plant-shelf-2",           title: "화분 선반 (2차안)",                     when: "2025-04",  cuts: 8,   tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    { slug: "fridge-cabinet",          title: "냉장고장",                            when: "2025",     cuts: 9,   tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    { slug: "wardrobe",                title: "붙박이장",                            when: "2025",     cuts: 9,   tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    ],
  },
  {
    slug: "car",
    label: "차량·모빌리티",
    short: "차량",
    works: [
    { slug: "carnival-monitor-mount",  title: "카니발 차량용 모니터 거치대",                 when: "2024-05",  cuts: 10,  tw: 560,  th: 561,  fw: 760,  fh: 14249, clipped: false },
    { slug: "car-mount-2406",          title: "차량용 거치대",                         when: "2024-06",  cuts: 9,   tw: 560,  th: 735,  fw: 760,  fh: 18000, clipped: true },
    { slug: "phone-mount",             title: "차량용 핸드폰 거치대",                     when: "2024-09",  cuts: 22,  tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    { slug: "car-mount-2410",          title: "차량용 거치대",                         when: "2024-10",  cuts: 16,  tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    { slug: "car-mount-2501",          title: "차량용 태블릿 거치대",                     when: "2025-01",  cuts: 6,   tw: 560,  th: 747,  fw: 760,  fh: 16343, clipped: false },
    ],
  },
  {
    slug: "beauty",
    label: "뷰티·헬스",
    short: "뷰티·헬스",
    works: [
    { slug: "armpit-sweat-pad",        title: "겨드랑이 땀 패드",                       when: "2024-04",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 11575, clipped: false },
    { slug: "tweezer-set",             title: "트위저 세트",                          when: "2024-04",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 9115,  clipped: false },
    { slug: "hairbrush-set",           title: "헤어브러쉬 세트",                        when: "2024-06",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 16564, clipped: false },
    { slug: "perfume-bottle",          title: "향수 공병",                           when: "2025",     cuts: 2,   tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    { slug: "posture-pillow",          title: "흉요추 자세 베개",                       when: "2025",     cuts: 22,  tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    ],
  },
  {
    slug: "pet",
    label: "반려동물",
    short: "반려동물",
    works: [
    { slug: "pet-postbiotics",         title: "반려동물 포스트바이오틱스",                   when: "2024-04",  cuts: 10,  tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    { slug: "pet-house",               title: "반려동물 숨숨집",                        when: "2024-04",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 15200, clipped: false },
    { slug: "pet-brush-1",             title: "반려동물 이중모 빗 (1차)",                 when: "2025-09",  cuts: 9,   tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    { slug: "pet-brush-2",             title: "반려동물 이중모 빗 (2차)",                 when: "2025-09",  cuts: 11,  tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    ],
  },
  {
    slug: "kids",
    label: "유아·어린이",
    short: "유아",
    works: [
    { slug: "kids-toothbrush",         title: "어린이 칫솔",                          when: "2024-05",  cuts: 2,   tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    { slug: "bib",                     title: "턱받이",                             when: "2024-06",  cuts: 10,  tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    { slug: "baby-cushion",            title: "아기 방석",                           when: "2025-03",  cuts: 15,  tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    ],
  },
  {
    slug: "fashion",
    label: "패션·잡화",
    short: "패션",
    works: [
    { slug: "aqua-shoes",              title: "아쿠아 슈즈",                          when: "2024-04",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 14781, clipped: false },
    { slug: "linen-wide-pants",        title: "린넨 와이드 밴딩 팬츠",                    when: "2024-05",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 10958, clipped: false },
    { slug: "yoga-socks",              title: "논슬립 요가·필라테스 양말",                  when: "2024-06",  cuts: 1,   tw: 560,  th: 747,  fw: 760,  fh: 12277, clipped: false },
    ],
  },
  {
    slug: "food",
    label: "식품",
    short: "식품",
    works: [
    { slug: "soy-crab",                title: "간장게장",                            when: "2024-11",  cuts: 13,  tw: 560,  th: 443,  fw: 760,  fh: 18000, clipped: true },
    ],
  },
  {
    slug: "course",
    label: "강의·컨설팅",
    short: "강의·컨설팅",
    works: [
    { slug: "image-consulting",        title: "이미지 컨설팅 강의",                      when: "2024-06",  cuts: 17,  tw: 560,  th: 747,  fw: 760,  fh: 18000, clipped: true },
    ],
  },
];

/** 전체 공개 건수 */
export const REF_TOTAL = REF_CATEGORIES.reduce((n, c) => n + c.works.length, 0);

/** 전체 작업물 — 탭 순서와 같게 평탄화한 것 */
export const REF_ALL: RefWork[] = REF_CATEGORIES.flatMap((c) => c.works);

/**
 * 화면 탭 = 전체 + 종류별.
 * 카페 배포는 업종 하나가 127건이라 전체 탭을 두지 않았는데,
 * 여기는 다 합쳐 38건이라 한 번에 훑는 쪽이 더 쓸모 있다.
 */
export const REF_TABS: RefCategory[] = [
  { slug: "all", label: "전체", short: "전체", works: REF_ALL },
  ...REF_CATEGORIES,
];
