/**
 * 사진촬영 레퍼런스 데이터 — 촬영 협력사와 함께 작업한 결과물 목록 (순수 데이터만)
 *
 * 2026-09-21 대표 지시로 촬영 협력사의 사진을 허락받아 가져왔다.
 * 협력사 상호 · 촬영 업체 상호 · 지역명은 화면 · 파일명 · alt 어디에도 쓰지 않는다.
 * 노출 동의를 받은 것은 사진 자체까지이고 상호는 별개다 (C-42 · 틀린 값이 빈 값보다 나쁘다).
 * 화면에 상호가 필요해지면 그때 서면으로 다시 받는다.
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
  /** 화면 대체 텍스트 — 상호 · 지역명은 쓰지 않는다 */
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
];
