// 하이라이트 세팅 납품 실물 · 홈페이지 노출용
// 자동 생성 : 본부장/홈페이지/하이라이트세팅_소재 · 2026-09-07 (월)
//
// 업체명은 어떤 업체든 적지 않는다 (대표 지시 2026-09-07 (월)).
// 사진 안에 보이던 상호 · 로고 글자 · 주소는 전부 모자이크로 지웠고,
// 지워도 화면이 남지 않는 컷과 인물 컷은 아예 빼서 납품에 넣지 않았다.
// industry 는 묶는 기준이 아니라 라벨이다. 모르면 기타.

export interface HlShot {
  file: string;
  kind: "cover" | "story";
  w: number;
  h: number;
}

// 프로필에 실제로 걸린 하이라이트 줄. 원 안의 상호 · 로고와 상호가 적힌 칸 이름은
// 전부 지우고 그 자리에 업종을 다시 써 넣었다.
export interface HlBand {
  file: string;
  w: number;
  h: number;
}

export interface HlWork {
  slug: string;
  title: string;    // 화면 표기 — 업종만. 상호 · 브랜드는 쓰지 않는다
  industry: string; // 업종 라벨. 모르면 기타
  covers: HlShot[];
  stories: HlShot[];
  band?: HlBand;   // 프로필 캡처가 있는 곳만. 없으면 비운다 (C-42 : 모르면 비워둔다)
  menu?: string[]; // 그 줄에 보이는 칸 이름. 밴드에서 읽은 그대로 옮긴다
}

export const HL_WORKS: HlWork[] = [
  // 2026-10-22 (목) 수동 추가 · 지은 인계 · 대표 지시 · 실제 계정에 걸린 5칸 12장
  // 재료는 지은이 넘긴 익명 처리본만 쓴다.
  // 로고 · 상호 · 계정 · 연락처 · 링크 · 작업복 무늬 · 예약 화면 업체명은 모자이크. 표기는 청소업체 A (C-52)
  {
    slug: "clean1",
    title: "청소업체 A",
    industry: "생활 · 홈케어 청소",
    covers: [],
    stories: [
      { file: "clean1-s01.webp", kind: "story", w: 720, h: 1280 },
      { file: "clean1-s02.webp", kind: "story", w: 720, h: 1280 },
      { file: "clean1-s03.webp", kind: "story", w: 720, h: 1280 },
      { file: "clean1-s04.webp", kind: "story", w: 720, h: 1280 },
      { file: "clean1-s05.webp", kind: "story", w: 720, h: 1280 },
      { file: "clean1-s06.webp", kind: "story", w: 720, h: 1280 },
      { file: "clean1-s07.webp", kind: "story", w: 720, h: 1280 },
      { file: "clean1-s08.webp", kind: "story", w: 720, h: 1280 },
      { file: "clean1-s09.webp", kind: "story", w: 720, h: 1280 },
      { file: "clean1-s10.webp", kind: "story", w: 720, h: 1280 },
      { file: "clean1-s11.webp", kind: "story", w: 720, h: 1280 },
      { file: "clean1-s12.webp", kind: "story", w: 720, h: 1280 },
    ],
    band: { file: "clean1.webp", w: 540, h: 110 },
    menu: ["서비스", "사례", "예약", "거주/입주청소", "문의"],
  },
  {
    slug: "beauty1",
    title: "속눈썹 연장 전문점",
    industry: "뷰티 · 속눈썹",
    covers: [
      { file: "beauty1-c01.jpg", kind: "cover", w: 720, h: 720 },
      { file: "beauty1-c02.jpg", kind: "cover", w: 720, h: 720 },
      { file: "beauty1-c03.jpg", kind: "cover", w: 720, h: 720 },
      { file: "beauty1-c04.jpg", kind: "cover", w: 720, h: 720 },
      { file: "beauty1-c05.jpg", kind: "cover", w: 720, h: 720 },
    ],
    stories: [
      { file: "beauty1-s01.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty1-s02.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty1-s03.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty1-s04.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty1-s05.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty1-s06.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty1-s07.jpg", kind: "story", w: 540, h: 960 },
    ],
    // 2026-10-23 (금) TR-0006 · 지은 2차 세팅 후 휴대폰 화면에서 하이라이트 줄만 잘라 왔다 (프로필 줄은 잘라냄)
    band: { file: "beauty1.webp", w: 592, h: 168 },
    menu: ["리뷰", "이벤트", "가격", "찾아오시는길"],
  },
  {
    slug: "beauty2",
    title: "맞춤 가발 브랜드",
    industry: "뷰티 · 가발",
    covers: [],
    stories: [
      { file: "beauty2-s01.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty2-s02.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty2-s03.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty2-s04.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty2-s05.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty2-s06.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty2-s07.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty2-s08.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty2-s09.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty2-s10.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty2-s11.jpg", kind: "story", w: 540, h: 960 },
    ],
    band: { file: "beauty2.jpg", w: 448, h: 140 },
    menu: ["리뷰", "소개", "자주묻는질문", "비포&에프터"],
  },
  {
    slug: "beauty3",
    title: "왁싱 전문점",
    industry: "뷰티 · 왁싱",
    // 2026-10-23 (금) TR-0006 · 실계정 칸별 커버 4장 중 상호가 든 1번은 빼고 3장 (공개 화면 최대 150px)
    covers: [
      { file: "beauty3-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "beauty3-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "beauty3-c03.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [
      { file: "beauty3-s01.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty3-s02.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty3-s03.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty3-s04.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty3-s05.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty3-s06.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty3-s07.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty3-s08.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty3-s09.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty3-s10.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty3-s11.jpg", kind: "story", w: 540, h: 960 },
      { file: "beauty3-s12.jpg", kind: "story", w: 540, h: 960 },
    ],
    band: { file: "beauty3.jpg", w: 386, h: 142 },
    menu: ["소개", "가격", "이벤트", "찾아오시는길"],
  },
  {
    slug: "travel1",
    title: "풀빌라 펜션",
    industry: "숙박 · 풀빌라",
    covers: [
      { file: "travel1-c01.jpg", kind: "cover", w: 720, h: 720 },
      { file: "travel1-c02.jpg", kind: "cover", w: 720, h: 720 },
      { file: "travel1-c03.jpg", kind: "cover", w: 720, h: 720 },
      { file: "travel1-c04.jpg", kind: "cover", w: 720, h: 720 },
    ],
    stories: [
      { file: "travel1-s01.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel1-s02.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel1-s03.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel1-s04.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel1-s05.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel1-s06.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel1-s07.jpg", kind: "story", w: 540, h: 960 },
    ],
    // 2026-10-23 (금) Q-0707 정정 · c05~c09 와 프로필 줄은 다른 숙소(travel3) 것이 섞여 있었다 (지은 2차 대조)
  },
  // 2026-10-23 (금) 펜션 두 곳(travel3 · travel2)은 대표 지시로 내렸다 '펜션 저따구로 올릴꺼면 올리지마'. 커버를 다시 만들기 전에는 올리지 않는다
  {
    slug: "food1",
    title: "만두 전문점",
    industry: "음식 · 만두",
    covers: [
      { file: "food1-c01.jpg", kind: "cover", w: 720, h: 720 },
      { file: "food1-c02.jpg", kind: "cover", w: 720, h: 720 },
      { file: "food1-c03.jpg", kind: "cover", w: 720, h: 720 },
      { file: "food1-c04.jpg", kind: "cover", w: 720, h: 720 },
      { file: "food1-c05.jpg", kind: "cover", w: 720, h: 720 },
    ],
    // 2026-10-23 (금) TR-0006 · 지은 2차 · 로고 · 업체명 · 지역명을 가린 안쪽 스토리 17장
    stories: [
      { file: "food1-s01.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s02.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s03.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s04.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s05.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s06.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s07.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s08.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s09.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s10.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s11.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s12.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s13.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s14.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s15.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s16.webp", kind: "story", w: 720, h: 1280 },
      { file: "food1-s17.webp", kind: "story", w: 720, h: 1280 },
    ],
    band: { file: "food1.jpg", w: 540, h: 154 },
    menu: ["만두 전문점", "메뉴소개", "리얼 후기", "방송출연"],
  },
  {
    slug: "food2",
    title: "등갈비 · 고깃집",
    industry: "음식 · 고깃집",
    covers: [],
    stories: [
      { file: "food2-s01.jpg", kind: "story", w: 540, h: 960 },
      { file: "food2-s02.jpg", kind: "story", w: 540, h: 960 },
      { file: "food2-s03.jpg", kind: "story", w: 540, h: 960 },
      { file: "food2-s04.jpg", kind: "story", w: 540, h: 960 },
      { file: "food2-s05.jpg", kind: "story", w: 540, h: 960 },
      { file: "food2-s06.jpg", kind: "story", w: 540, h: 960 },
    ],
    band: { file: "food2.jpg", w: 432, h: 110 },
    menu: ["메뉴", "리뷰", "이벤트", "위치", "메뉴판"],
  },
  {
    slug: "cafe1",
    title: "카페",
    industry: "카페",
    covers: [
      { file: "cafe1-c01.jpg", kind: "cover", w: 720, h: 720 },
      { file: "cafe1-c02.jpg", kind: "cover", w: 720, h: 720 },
      { file: "cafe1-c03.jpg", kind: "cover", w: 720, h: 720 },
      { file: "cafe1-c04.jpg", kind: "cover", w: 720, h: 720 },
      { file: "cafe1-c05.jpg", kind: "cover", w: 720, h: 720 },
    ],
    // 2026-10-23 (금) TR-0006 · 지은 2차 · 상호를 가린 시그니처 메뉴 스토리 4장
    stories: [
      { file: "cafe1-s01.webp", kind: "story", w: 720, h: 1280 },
      { file: "cafe1-s02.webp", kind: "story", w: 720, h: 1280 },
      { file: "cafe1-s03.webp", kind: "story", w: 720, h: 1280 },
      { file: "cafe1-s04.webp", kind: "story", w: 720, h: 1280 },
    ],
    band: { file: "cafe1.jpg", w: 540, h: 140 },
    menu: ["Cafe", "Signature", "Reviews", "Location"],
  },
  // 2026-10-23 (금) TR-0006 신규 · 지은 2차 · 실계정 공개 화면 칸별 커버 10장 중 5장 (공개 화면 최대 150px)
  // 원단 브랜드 로고 · 상자가 든 3장과 모자이크가 남은 2장은 뺐다. 프로필 줄 캡처는 가려지지 않은 글자가 있어 쓰지 않는다
  {
    slug: "suit1",
    title: "맞춤 정장",
    industry: "패션 · 맞춤정장",
    covers: [
      { file: "suit1-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "suit1-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "suit1-c03.webp", kind: "cover", w: 150, h: 150 },
      { file: "suit1-c04.webp", kind: "cover", w: 150, h: 150 },
      { file: "suit1-c05.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
  },
  // 2026-10-23 (금) TR-0014 신규 · 지은 3차 · 통일 글자 커버 6칸 중 5장 (공개 화면 최대 150px)
  // 제품 브랜드명이 적힌 1장은 뺐다. 프로필 줄 캡처도 같은 브랜드명이 보여 쓰지 않는다
  {
    slug: "pmu1",
    title: "반영구 메이크업",
    industry: "뷰티 · 반영구",
    covers: [
      { file: "pmu1-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "pmu1-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "pmu1-c03.webp", kind: "cover", w: 150, h: 150 },
      { file: "pmu1-c04.webp", kind: "cover", w: 150, h: 150 },
      { file: "pmu1-c05.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
  },
  // 2026-10-24 (토) TR-0018 · 지은 전수 폴더 (하이라이트_포트폴리오_전수_20261022) 에서 품질 게이트를 통과한 19곳
  // 기준 : 깨끗한 컷 3장 이상 (커버 + 프로필 줄) · 모자이크 · 상호 · 아이디 · 지역 글자 · 번호판이 든 커버는 뺐다 · 숙박 · C 등급 · 51/52 제외
  // 커버는 공개 화면 최대 150px 라 카드에서 112px 로만 쓰고 대표 이미지(HL_COVERS)로는 안 쓴다. 줄은 지은 익명본에서 하이라이트 줄만 잘랐다
  {
    slug: "clean2",
    title: "입주 · 정기 청소",
    industry: "생활 · 청소",
    covers: [
      { file: "clean2-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "clean2-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "clean2-c03.webp", kind: "cover", w: 150, h: 150 },
      { file: "clean2-c04.webp", kind: "cover", w: 150, h: 150 },
      { file: "clean2-c05.webp", kind: "cover", w: 150, h: 150 },
      { file: "clean2-c06.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "clean2.webp", w: 540, h: 84 },
    menu: ["청소 전후", "서비스", "가격", "현장", "보장 후기", "문의"],
  },
  {
    slug: "nail1",
    title: "네일샵",
    industry: "뷰티 · 네일",
    covers: [
      { file: "nail1-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "nail1-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "nail1-c03.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "nail1.webp", w: 540, h: 116 },
    menu: ["후기", "전체연장", "공지", "가격표"],
  },
  {
    slug: "skin1",
    title: "피부관리실",
    industry: "뷰티 · 피부관리",
    covers: [
      { file: "skin1-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "skin1-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "skin1-c03.webp", kind: "cover", w: 150, h: 150 },
      { file: "skin1-c04.webp", kind: "cover", w: 150, h: 150 },
      { file: "skin1-c05.webp", kind: "cover", w: 150, h: 150 },
      { file: "skin1-c06.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "skin1.webp", w: 540, h: 97 },
    menu: ["비포&에프터", "카카오 채널", "이벤트", "프로그램", "후기"],
  },
  {
    slug: "dessert1",
    title: "디저트 카페",
    industry: "카페 · 디저트",
    covers: [
      { file: "dessert1-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "dessert1-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "dessert1-c03.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "dessert1.webp", w: 540, h: 196 },
    menu: ["답례품 · 간식", "빙수 리뷰"],
  },
  {
    slug: "food3",
    title: "찌개 전문점",
    industry: "음식 · 찌개",
    covers: [
      { file: "food3-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "food3-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "food3-c03.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "food3.webp", w: 540, h: 119 },
    menu: ["김치부대찌개", "김치삼겹살"],
  },
  {
    slug: "food4",
    title: "피자 전문점",
    industry: "음식 · 피자",
    covers: [
      { file: "food4-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "food4-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "food4-c03.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "food4.webp", w: 540, h: 147 },
    menu: ["Space", "PIZZA", "PASTA", "SIDE"],
  },
  {
    slug: "gym1",
    title: "헬스장",
    industry: "운동 · 헬스",
    covers: [
      { file: "gym1-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "gym1-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "gym1-c03.webp", kind: "cover", w: 150, h: 150 },
      { file: "gym1-c04.webp", kind: "cover", w: 150, h: 150 },
      { file: "gym1-c05.webp", kind: "cover", w: 150, h: 150 },
      { file: "gym1-c06.webp", kind: "cover", w: 150, h: 150 },
      { file: "gym1-c07.webp", kind: "cover", w: 150, h: 150 },
      { file: "gym1-c08.webp", kind: "cover", w: 150, h: 150 },
      { file: "gym1-c09.webp", kind: "cover", w: 150, h: 150 },
      { file: "gym1-c10.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "gym1.webp", w: 540, h: 81 },
    menu: ["청결한헬스장", "Before&After", "PT후기", "수업영상", "헬스장분위기"],
  },
  {
    slug: "pet1",
    title: "애견 미용",
    industry: "반려동물 · 미용",
    covers: [
      { file: "pet1-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "pet1-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "pet1-c03.webp", kind: "cover", w: 150, h: 150 },
      { file: "pet1-c04.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "pet1.webp", w: 540, h: 117 },
    menu: ["daily", "후기", "After"],
  },
  {
    slug: "pet2",
    title: "반려견 분양",
    industry: "반려동물 · 분양",
    covers: [
      { file: "pet2-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "pet2-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "pet2-c03.webp", kind: "cover", w: 150, h: 150 },
      { file: "pet2-c04.webp", kind: "cover", w: 150, h: 150 },
      { file: "pet2-c05.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "pet2.webp", w: 540, h: 117 },
    menu: ["Family", "Story", "Baby", "Review"],
  },
  {
    slug: "maker1",
    title: "스포츠 매트 제조",
    industry: "제조 · 스포츠 매트",
    covers: [
      { file: "maker1-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "maker1-c02.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "maker1.webp", w: 492, h: 272 },
    menu: ["PROJECT", "CONTACT"],
  },
  {
    slug: "dental1",
    title: "치과",
    industry: "병의원 · 치과",
    covers: [
      { file: "dental1-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "dental1-c02.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "dental1.webp", w: 492, h: 274 },
    menu: ["진료시간", "예약하기"],
  },
  {
    slug: "lash2",
    title: "속눈썹 전문점",
    industry: "뷰티 · 속눈썹",
    covers: [
      { file: "lash2-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "lash2-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "lash2-c03.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "lash2.webp", w: 540, h: 198 },
    menu: ["성장제", "REVIEW"],
  },
  {
    slug: "cafe2",
    title: "브런치 카페",
    industry: "카페 · 브런치",
    covers: [
      { file: "cafe2-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "cafe2-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "cafe2-c03.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "cafe2.webp", w: 540, h: 147 },
    menu: ["Daily", "Bakery", "Brunch", "Drink"],
  },
  {
    slug: "lash3",
    title: "속눈썹 · 눈썹 전문점",
    industry: "뷰티 · 속눈썹",
    covers: [
      { file: "lash3-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "lash3-c02.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "lash3.webp", w: 540, h: 147 },
    menu: ["review", "lash perm", "Brow", "notice"],
  },
  {
    slug: "food5",
    title: "숙성육 고깃집",
    industry: "음식 · 고깃집",
    covers: [
      { file: "food5-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "food5-c02.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "food5.webp", w: 540, h: 82 },
    menu: ["고객후기", "이벤트", "매장안내"],
  },
  {
    slug: "flower1",
    title: "꽃집",
    industry: "생활 · 꽃",
    covers: [
      { file: "flower1-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "flower1-c02.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "flower1.webp", w: 540, h: 146 },
    menu: ["꽃다발", "꽃바구니", "소중한후기"],
  },
  {
    slug: "food6",
    title: "조개구이 전문점",
    industry: "음식 · 조개구이",
    covers: [
      { file: "food6-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "food6-c02.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "food6.webp", w: 540, h: 150 },
    menu: ["점심특선", "포장"],
  },
  {
    slug: "gym2",
    title: "PT 헬스장",
    industry: "운동 · 헬스",
    covers: [
      { file: "gym2-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "gym2-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "gym2-c03.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "gym2.webp", w: 540, h: 99 },
    menu: ["PT Review", "운영시간", "찾아오시는 길"],
  },
  {
    slug: "wrap1",
    title: "자동차 랩핑",
    industry: "자동차 · 랩핑",
    covers: [
      { file: "wrap1-c01.webp", kind: "cover", w: 150, h: 150 },
      { file: "wrap1-c02.webp", kind: "cover", w: 150, h: 150 },
      { file: "wrap1-c03.webp", kind: "cover", w: 150, h: 150 },
      { file: "wrap1-c04.webp", kind: "cover", w: 150, h: 150 },
      { file: "wrap1-c05.webp", kind: "cover", w: 150, h: 150 },
      { file: "wrap1-c06.webp", kind: "cover", w: 150, h: 150 },
      { file: "wrap1-c07.webp", kind: "cover", w: 150, h: 150 },
    ],
    stories: [],
    band: { file: "wrap1.webp", w: 540, h: 82 },
    menu: ["스토리", "in-stall", "Review", "Get Featured", "New Releases", "Ultra-Gloss"],
  },
];

export const HL_TOTAL = HL_WORKS.reduce((n, w) => n + w.covers.length + w.stories.length, 0);

export const HL_SHOP_TOTAL = HL_WORKS.length;

export const HL_BANDS = HL_WORKS.filter((w) => w.band);

export const HL_INDUSTRIES = Array.from(new Set(HL_WORKS.map((w) => w.industry)));

// 첫 컷만 뽑은 대표 이미지. 커버가 없는 곳은 스토리 첫 장으로 대신한다.
// 공개 화면에서 받은 150px 커버는 큰 카드에서 뭉개지므로 대표 이미지로 쓰지 않는다 (2026-10-23 (금) TR-0006).
const HL_MIN_COVER_W = 300;
export const HL_COVERS = HL_WORKS.map((w) => {
  const s = w.covers.find((c) => c.w >= HL_MIN_COVER_W) ?? w.stories[0] ?? w.covers[0];
  return {
    src: `/highlight-ref/${s.file}`,
    alt: `${w.industry} 하이라이트 세팅 실제 납품물`,
    kind: s.kind,
    w: s.w,
    h: s.h,
  };
});
