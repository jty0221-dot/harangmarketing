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
    covers: [],
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
      { file: "travel1-c05.jpg", kind: "cover", w: 720, h: 720 },
      { file: "travel1-c06.jpg", kind: "cover", w: 720, h: 720 },
      { file: "travel1-c07.jpg", kind: "cover", w: 720, h: 720 },
      { file: "travel1-c08.jpg", kind: "cover", w: 720, h: 720 },
      { file: "travel1-c09.jpg", kind: "cover", w: 720, h: 720 },
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
    band: { file: "travel1.jpg", w: 432, h: 109 },
    menu: ["후기", "이용 안내", "이용 안내", "추천 장소"],
  },
  {
    slug: "travel2",
    title: "펜션",
    industry: "숙박",
    covers: [],
    stories: [
      { file: "travel2-s01.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel2-s02.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel2-s03.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel2-s04.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel2-s05.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel2-s06.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel2-s07.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel2-s08.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel2-s09.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel2-s10.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel2-s11.jpg", kind: "story", w: 540, h: 960 },
      { file: "travel2-s12.jpg", kind: "story", w: 540, h: 960 },
    ],
  },
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
    stories: [],
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
    stories: [],
    band: { file: "cafe1.jpg", w: 540, h: 140 },
    menu: ["Cafe", "Signature", "Reviews", "Location"],
  },
];

export const HL_TOTAL = HL_WORKS.reduce((n, w) => n + w.covers.length + w.stories.length, 0);

export const HL_SHOP_TOTAL = HL_WORKS.length;

export const HL_BANDS = HL_WORKS.filter((w) => w.band);

export const HL_INDUSTRIES = Array.from(new Set(HL_WORKS.map((w) => w.industry)));

// 첫 컷만 뽑은 대표 이미지. 커버가 없는 곳은 스토리 첫 장으로 대신한다.
export const HL_COVERS = HL_WORKS.map((w) => {
  const s = w.covers[0] ?? w.stories[0];
  return {
    src: `/highlight-ref/${s.file}`,
    alt: `${w.industry} 하이라이트 세팅 실제 납품물`,
    kind: s.kind,
    w: s.w,
    h: s.h,
  };
});
