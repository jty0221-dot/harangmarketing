/**
 * 사진촬영 레퍼런스 데이터 — 촬영 협력사와 함께 작업한 결과물 목록 (순수 데이터만)
 *
 * 2026-09-21 대표 지시로 촬영 협력사의 사진을 허락받아 가져왔다.
 * 협력사 상호는 화면 · 파일명 · alt 어디에도 쓰지 않는다.
 * 촬영한 업체 상호는 2026-09-24 (목) 대표 결정으로 사진촬영 포트폴리오에서 보여도 된다.
 * 이 목록의 alt 는 장면만 적고, 업체명은 포트폴리오(content/photo-portfolios.json 의 name)가 맡는다.
 *
 * 원본은 협력사 서버에 있지만 public/photo-ref 로 받아 뒀다.
 * 남의 서버를 우리 페이지 로딩 경로에 넣으면 그쪽이 바뀔 때 우리 화면이 깨진다.
 *   public/photo-ref/food-NN.jpg    음식 촬영
 *   public/photo-ref/space-NN.jpg   공간 촬영
 *
 * 긴 변 1600px · JPEG 품질 82 · EXIF 제거 후 저장했다.
 * EXIF 를 지우는 이유는 촬영 위치 좌표와 장비 정보가 그대로 따라 들어오기 때문이다.
 *
 * w · h 는 리사이즈 결과 실치수다. 여기를 비우면 스크롤 중 레이아웃이 계속 밀린다.
 *
 * 받아온 18장 중 2장은 화면에 올리지 않았다.
 * 한 장은 벽에 상호 글씨와 전화번호가 읽혔고, 한 장은 사람이 프레임에 들어와 있었다.
 * 둘 다 서면 동의 범위 밖이라 뺐고 번호는 당겨 붙였다.
 */

export interface PhotoShot {
  /** public 기준 경로 */
  src: string;
  /** 화면 대체 텍스트 · 장면만 적는다 (협력사 상호는 쓰지 않는다) */
  alt: string;
  /** 리사이즈 결과 실치수 */
  w: number;
  h: number;
}

/** 음식 촬영 예시 */
export const FOOD_SHOTS: PhotoShot[] = [
  { src: "/photo-ref/food-01.jpg", alt: "찜기에 담긴 만두 촬영 예시", w: 1600, h: 1067 },
  { src: "/photo-ref/food-02.jpg", alt: "소쿠리에 담은 군만두 촬영 예시", w: 1600, h: 1067 },
  { src: "/photo-ref/food-03.jpg", alt: "면 요리 클로즈업 촬영 예시", w: 1600, h: 1067 },
  { src: "/photo-ref/food-04.jpg", alt: "김이 오르는 덮밥 촬영 예시", w: 1036, h: 1382 },
  { src: "/photo-ref/food-05.jpg", alt: "철판에 구워지는 고기 촬영 예시", w: 1216, h: 1520 },
  { src: "/photo-ref/food-06.jpg", alt: "찜 요리 상차림 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-ref/food-07.jpg", alt: "전골 조리 장면 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/styled-bread-overhead.webp", alt: "여러 종류의 빵과 음료를 한 상에 차린 부감 촬영 예시", w: 1920, h: 1920 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/styled-bread-sunlight.webp", alt: "야외 테이블에 차린 빵과 음료를 자연광으로 담은 촬영 예시", w: 1920, h: 1920 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/styled-bread-water.webp", alt: "물가 테이블에 올린 빵 접시와 음료 촬영 예시", w: 1920, h: 1440 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/styled-dessert-water.webp", alt: "물가 테이블에 올린 디저트와 파르페 촬영 예시", w: 1920, h: 1440 },
  { src: "/photo-partner/restaurant/63/01.jpg", alt: "숯불 위 불꽃을 가까이 담은 촬영 예시", w: 1920, h: 1817 },
  { src: "/photo-partner/restaurant/63/02.jpg", alt: "고기와 반찬을 함께 차린 상차림 부감 촬영 예시", w: 1920, h: 2559 },
  { src: "/photo-partner/restaurant/63/05.jpg", alt: "뚝배기에 치즈를 올린 요리 촬영 예시", w: 1036, h: 1382 },
  { src: "/photo-partner/restaurant/63/06.jpg", alt: "철판에 올린 스테이크 촬영 예시", w: 1216, h: 1520 },
  { src: "/photo-partner/restaurant/84/02.jpg", alt: "게 요리를 손질하는 조리 장면 촬영 예시", w: 1920, h: 1920 },
  { src: "/photo-partner/restaurant/84/07.jpg", alt: "찜기에서 게 요리를 꺼내는 장면 촬영 예시", w: 1920, h: 1920 },
  { src: "/photo-partner/restaurant/84/09.jpg", alt: "게 요리를 접시에 담아낸 촬영 예시", w: 1920, h: 1920 },
  { src: "/photo-partner/restaurant/chunnam-gangnam/menu-10.jpg", alt: "손질한 게를 금속 접시에 올린 촬영 예시", w: 2048, h: 2048 },
  { src: "/photo-partner/restaurant/chunnam-gangnam/menu-13.jpg", alt: "게를 넣고 끓인 전골 촬영 예시", w: 2000, h: 2000 },
  { src: "/photo-partner/restaurant/chunnam-gangnam/menu-16.jpg", alt: "조리 중인 게 요리를 가까이 담은 촬영 예시", w: 2048, h: 2048 },
  { src: "/photo-partner/restaurant/chunnam-gangnam/menu-21.jpg", alt: "게 요리 상차림 촬영 예시", w: 2000, h: 2000 },
  { src: "/photo-partner/restaurant/jingalmaegal/menu-01.jpg", alt: "볶음밥을 접시에 담아낸 촬영 예시", w: 700, h: 500 },
  { src: "/photo-partner/restaurant/jingalmaegal/menu-02.jpg", alt: "양념한 생고기를 접시에 펼친 촬영 예시", w: 700, h: 500 },
  { src: "/photo-partner/restaurant/jingalmaegal/menu-03.jpg", alt: "김치를 넣고 끓인 전골 촬영 예시", w: 700, h: 500 },
  { src: "/photo-partner/restaurant/jingalmaegal/menu-08.jpg", alt: "떡과 버섯을 올린 전골 냄비 촬영 예시", w: 700, h: 500 },
  { src: "/photo-partner/restaurant/jingalmaegal/menu-09.jpg", alt: "생갈비를 접시에 담은 촬영 예시", w: 700, h: 500 },
  { src: "/photo-partner/restaurant/jingalmaegal/menu-16.jpg", alt: "뚝배기에 끓인 된장찌개 촬영 예시", w: 700, h: 500 },
];

/** 메뉴 컷 촬영 예시 · 배경을 지운 컷 */
export const MENU_SHOTS: PhotoShot[] = [
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-21.webp", alt: "레몬을 올린 에이드 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-23.webp", alt: "베리를 넣은 에이드 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-25.webp", alt: "시나몬 스틱을 곁들인 음료 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-26.webp", alt: "라떼 아트를 올린 카페라떼 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-27.webp", alt: "바스크 치즈케이크 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-28.webp", alt: "노란 잔에 담은 카푸치노 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-29.webp", alt: "로즈마리를 올린 붉은 에이드 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-30.webp", alt: "초록 잔에 담은 말차 라떼 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-33.webp", alt: "로즈마리를 올린 크림 음료 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-34.webp", alt: "벌집을 올린 아이스크림 파르페 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-37.webp", alt: "말차 소프트 파르페 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-38.webp", alt: "카라멜을 두른 라떼 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-39.webp", alt: "로즈마리를 올린 딸기 라떼 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-41.webp", alt: "초코를 두른 아이스 음료 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-42.webp", alt: "도기 잔에 담은 말차 라떼 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-43.webp", alt: "초코를 입힌 소금빵 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-44.webp", alt: "휘낭시에 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-45.webp", alt: "초코 스콘 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-47.webp", alt: "딸기 소프트 아이스크림 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/menu-50.webp", alt: "크림을 채운 소금빵 샌드 메뉴 컷 촬영 예시", w: 1600, h: 1600 },
];

/** 공간 촬영 예시 */
export const SPACE_SHOTS: PhotoShot[] = [
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/space-symmetry.webp", alt: "수변 전망과 조형 조명을 담은 카페 전경 촬영 예시", w: 1920, h: 1280 },
  { src: "/photo-ref/space-01.jpg", alt: "한옥 마당과 연못 촬영 예시", w: 1600, h: 1067 },
  { src: "/photo-ref/space-02.jpg", alt: "실내 수영 공간 촬영 예시", w: 1600, h: 1067 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/space-window.webp", alt: "넓은 창과 수변 전망을 담은 카페 공간 촬영 예시", w: 1920, h: 1280 },
  { src: "/photo-ref/space-03.jpg", alt: "김이 오르는 야외 온수 공간 촬영 예시", w: 1600, h: 1067 },
  { src: "/photo-ref/space-04.jpg", alt: "해 질 무렵 마당 촬영 예시", w: 1600, h: 1067 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/space-garden.webp", alt: "식물과 좌석 동선을 담은 카페 실내 촬영 예시", w: 1920, h: 1280 },
  { src: "/photo-ref/space-05.jpg", alt: "담장과 정원수 촬영 예시", w: 1600, h: 1067 },
  { src: "/photo-ref/space-06.jpg", alt: "커튼을 두른 침실 촬영 예시", w: 1600, h: 1067 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/space-stair-view.webp", alt: "계단에서 좌석과 창을 넓게 담은 카페 공간 촬영 예시", w: 1920, h: 1280 },
  { src: "/photo-ref/space-07.jpg", alt: "서까래가 드러난 객실 촬영 예시", w: 1600, h: 1067 },
  { src: "/photo-ref/space-08.jpg", alt: "창가 다이닝 공간 촬영 예시", w: 1600, h: 1067 },
  { src: "/photo-partner/restaurant/salt-garden-ganghwa/space-wide-angle.webp", alt: "좌석 규모와 창 면적을 함께 담은 카페 전경 촬영 예시", w: 1920, h: 1280 },
  { src: "/photo-ref/space-09.jpg", alt: "정원 쉼터 공간 촬영 예시", w: 1600, h: 1067 },
  { src: "/photo-partner/stay/69/02.jpg", alt: "한옥 채와 마당을 함께 담은 촬영 예시", w: 1920, h: 1280 },
  { src: "/photo-partner/stay/69/07.jpg", alt: "낮에 담은 한옥 마당 전경 촬영 예시", w: 1920, h: 1280 },
];
