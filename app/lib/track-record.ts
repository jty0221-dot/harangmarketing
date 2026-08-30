/**
 * 관리 매장 이력 — 상호를 공개하지 않고 업종·지역·진행 항목만 남긴 목록.
 *
 * content/portfolio.json 과 성격이 다르다. 그쪽은 scripts/portfolio/collect.py 가
 * 네이버 블로그에서 긁어 만드는 자동 생성물이라 손으로 고치면 다음 수집에 덮어써진다.
 * 이 파일은 계약 대장과 견적·계약 서류에서 뽑아 손으로 적는다. 수집기가 건드리지 않는다.
 *
 * 넣지 않는 것: 상호 · 지점명 · 연락처 · 계약 금액 · 정산 내역.
 * 지역은 광역 단위까지만 적는다. 시·군·구까지 적으면 업종과 겹쳐 업체가 특정된다.
 * 이름만으로 업종을 확신할 수 없는 건과 착수 전 건은 넣지 않는다.
 */

export type TrackStatus = "완료" | "진행 중";

export interface TrackRecordItem {
  /** 업종. 블로그 사례에서 쓰는 말과 같게 맞춘다 */
  trade: string;
  /** 광역 단위 지역. 출장 위주라 권역이 넓거나 확인되지 않으면 비운다 */
  region?: string;
  /** 같은 브랜드의 매장·권역을 한 줄로 묶은 경우 그 수 */
  branches?: number;
  /** branches 를 세는 단위. 기본은 지점 */
  unit?: "지점" | "권역" | "지역";
  /** 실제로 진행한 항목 */
  work: string[];
  status: TrackStatus;
}

export interface TrackRecordGroup {
  key: string;
  name: string;
  items: TrackRecordItem[];
}

export const TRACK_RECORD: TrackRecordGroup[] = [
  {
    key: "food",
    name: "음식점",
    items: [
      { trade: "태국 음식점", region: "경기", work: ["플레이스 상위노출"], status: "완료" },
      { trade: "낙지 전문점", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "체험단"], status: "완료" },
      { trade: "고깃집", region: "서울", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화", "인스타그램 운영", "예약자 리뷰 관리"], status: "완료" },
      { trade: "만두 전문점", region: "경기", work: ["플레이스 SEO 최적화", "네이버 광고 최적화", "체험단"], status: "완료" },
      { trade: "일식당", region: "부산", work: ["플레이스 상위노출"], status: "완료" },
      { trade: "조개구이 전문점", work: ["플레이스 상위노출"], status: "완료" },
      { trade: "고깃집", region: "경기", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "고기국수 전문점", work: ["플레이스 SEO 최적화", "네이버 광고 최적화"], status: "완료" },
      { trade: "향토 음식점", region: "제주", work: ["플레이스 상위노출"], status: "완료" },
      { trade: "고깃집", region: "제주", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "예약자 리뷰 관리", "체험단"], status: "완료" },
      { trade: "고깃집", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "한식당", region: "서울", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "샤브샤브 전문점", region: "경기", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "샤브샤브 전문점", region: "경기·인천", branches: 2, work: ["플레이스 SEO 최적화", "네이버 광고 최적화", "지역 커뮤니티 배포", "파워컨텐츠"], status: "진행 중" },
      { trade: "갈비 전문점", work: ["사진 촬영", "플레이스 SEO 최적화"], status: "완료" },
      { trade: "고깃집", work: ["플레이스 순위 관리"], status: "진행 중" },
      { trade: "소갈비 전문점", region: "울산", work: ["플레이스 SEO 최적화", "대표 키워드 상위노출"], status: "진행 중" },
      { trade: "떡갈비 전문점", region: "대구", work: ["인플루언서 릴스"], status: "완료" },
      { trade: "고깃집", region: "서울", work: ["리뷰 답글 관리"], status: "완료" },
      { trade: "치킨 전문점", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화"], status: "완료" },
      { trade: "한식당", region: "서울", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "체험단"], status: "완료" },
      { trade: "돈까스 전문점", region: "서울", work: ["플레이스 SEO 최적화", "사진 촬영"], status: "완료" },
      { trade: "토스트 전문점", work: ["블로그 상위노출"], status: "완료" },
      { trade: "한식당", region: "경남", work: ["플레이스 SEO 최적화"], status: "완료" },
    ],
  },
  {
    key: "cafe",
    name: "카페·베이커리",
    items: [
      { trade: "카페", region: "서울·경기·부산", branches: 3, work: ["플레이스 상위노출", "플레이스 SEO 최적화", "체험단", "네이버 광고 최적화", "예약자 리뷰 관리", "지역 커뮤니티 배포"], status: "완료" },
      { trade: "카페", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화"], status: "완료" },
      { trade: "베이커리 카페", region: "경기·인천", branches: 2, work: ["플레이스 순위 관리"], status: "진행 중" },
      { trade: "카페", region: "대구", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화", "체험단"], status: "완료" },
      { trade: "카페", work: ["플레이스 SEO 최적화"], status: "완료" },
      { trade: "플라워 카페", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "디저트 카페", region: "경기", work: ["플레이스 순위 관리"], status: "진행 중" },
      { trade: "카페", region: "전남", work: ["브랜딩"], status: "진행 중" },
      { trade: "베이커리", work: ["파워컨텐츠", "블로그 상위노출"], status: "완료" },
      { trade: "카페", region: "인천", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화", "체험단", "카카오맵 노출"], status: "완료" },
    ],
  },
  {
    key: "beauty",
    name: "미용·뷰티",
    items: [
      { trade: "미용실", region: "경기", work: ["플레이스 상위노출"], status: "완료" },
      { trade: "미용실", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "붙임머리 전문점", region: "서울", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화"], status: "완료" },
      { trade: "속눈썹 연장 전문점", region: "서울", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화"], status: "완료" },
      { trade: "눈썹 전문점", region: "인천", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화"], status: "완료" },
      { trade: "네일숍", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "네일숍", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "뷰티샵", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "뷰티샵", region: "대전", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "피부관리실", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "탈모 관리 전문점", region: "부산", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "체험단"], status: "완료" },
      { trade: "두피·탈모 관리", region: "서울", work: ["플레이스 상위노출", "체험단"], status: "완료" },
      { trade: "왁싱샵", region: "경기", work: ["인스타그램 운영"], status: "완료" },
      { trade: "체형 관리샵", region: "서울", work: ["플레이스 상위노출", "플레이스 SEO 최적화"], status: "완료" },
      { trade: "미용실", region: "서울", work: ["플레이스 상위노출", "블로그 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화", "체험단"], status: "완료" },
    ],
  },
  {
    key: "clinic",
    name: "병원·의원",
    items: [
      { trade: "치과", region: "경기", work: ["플레이스 상위노출"], status: "완료" },
      { trade: "치과", region: "경기", work: ["플레이스 순위 관리"], status: "진행 중" },
      { trade: "치과", region: "경남", work: ["블로그 상위노출"], status: "진행 중" },
      { trade: "의원", work: ["플레이스 순위 관리"], status: "진행 중" },
      { trade: "보청기 전문점", region: "대구", work: ["블로그 상위노출", "플레이스 상위노출"], status: "완료" },
      { trade: "의원", work: ["플레이스 SEO 최적화", "예약자 리뷰 관리"], status: "완료" },
    ],
  },
  {
    key: "edu",
    name: "운동·교육",
    items: [
      { trade: "헬스장", region: "부산", branches: 3, work: ["플레이스 상위노출", "플레이스 SEO 최적화"], status: "완료" },
      { trade: "체형교정 운동센터", region: "서울", work: ["플레이스 상위노출", "예약자 리뷰 관리"], status: "완료" },
      { trade: "영어 회화 학원", work: ["플레이스 SEO 최적화", "네이버 광고 최적화"], status: "완료" },
      { trade: "미술학원", region: "서울", work: ["플레이스 SEO 최적화", "예약자 리뷰 관리"], status: "완료" },
      { trade: "태권도장", region: "서울", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "예약자 리뷰 관리"], status: "완료" },
      { trade: "줄넘기 클럽", region: "경기", work: ["블로그 상위노출", "영상 제작"], status: "완료" },
      { trade: "퍼스널 트레이닝", work: ["플레이스 상위노출", "블로그 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화"], status: "완료" },
      { trade: "영어 학원", work: ["브랜딩"], status: "완료" },
    ],
  },
  {
    key: "service",
    name: "생활 서비스·설비",
    items: [
      { trade: "에어컨 설치", region: "경기·충남·충북", branches: 8, unit: "지역", work: ["플레이스 순위 관리", "블로그 상위노출"], status: "완료" },
      { trade: "하수구 설비", region: "인천", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화"], status: "완료" },
      { trade: "덕트 설비", work: ["블로그 상위노출"], status: "완료" },
      { trade: "입주청소", region: "울산", work: ["플레이스 순위 관리"], status: "진행 중" },
      { trade: "입주청소", region: "경기", branches: 2, unit: "권역", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "청소업체", region: "인천", work: ["플레이스 순위 관리"], status: "진행 중" },
      { trade: "청소업체", region: "세종·대전", branches: 2, unit: "권역", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "청소업체", region: "세종·대전", branches: 2, unit: "권역", work: ["플레이스 순위 관리"], status: "진행 중" },
      { trade: "청소업체", work: ["블로그 상위노출"], status: "완료" },
      { trade: "스카이차", region: "대전", work: ["파워컨텐츠", "블로그 상위노출"], status: "완료" },
      { trade: "스카이차", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "소방 설비", work: ["블로그 상위노출"], status: "진행 중" },
      { trade: "가설재", work: ["플레이스 순위 관리"], status: "진행 중" },
      { trade: "용달 이사", region: "충북", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "주간보호센터", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "냉난방 공조 설비", region: "충남", work: ["플레이스 상위노출", "블로그 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화", "파워컨텐츠"], status: "완료" },
      { trade: "하수구 설비", region: "충남", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화"], status: "완료" },
    ],
  },
  {
    key: "auto",
    name: "자동차",
    items: [
      { trade: "자동차 정비소", region: "경기", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "자동차 디테일링", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "수입차 영업", work: ["블로그 상위노출"], status: "진행 중" },
      { trade: "자동차 검사소", region: "경기", work: ["플레이스 상위노출", "블로그 상위노출"], status: "완료" },
    ],
  },
  {
    key: "pet",
    name: "반려동물",
    items: [
      { trade: "반려동물 매장", region: "경기", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "예약자 리뷰 관리"], status: "완료" },
      { trade: "강아지 분양", region: "서울", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "반려동물 토탈케어", region: "경기·경북", branches: 3, work: ["블로그 상위노출"], status: "진행 중" },
      { trade: "반려동물 용품", work: ["블로그 상위노출"], status: "완료" },
      { trade: "반려동물 분양", region: "경기", work: ["플레이스 상위노출", "체험단"], status: "완료" },
    ],
  },
  {
    key: "home",
    name: "부동산·인테리어",
    items: [
      { trade: "공인중개사", region: "경기", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화"], status: "완료" },
      { trade: "인테리어", work: ["블로그 상위노출"], status: "완료" },
      { trade: "커튼·블라인드", region: "경기", branches: 2, work: ["플레이스 순위 관리"], status: "완료" },
    ],
  },
  {
    key: "stay",
    name: "숙박·레저",
    items: [
      { trade: "오토캠핑장", work: ["플레이스 순위 관리"], status: "완료" },
      { trade: "풀빌라 펜션", work: ["인스타그램 운영"], status: "완료" },
      { trade: "호텔", work: ["사진 촬영", "플레이스 SEO 최적화"], status: "완료" },
      { trade: "테마파크", work: ["플레이스 순위 관리"], status: "완료" },
    ],
  },
  {
    key: "event",
    name: "웨딩·꽃",
    items: [
      { trade: "꽃집", work: ["플레이스 상위노출", "플레이스 SEO 최적화", "네이버 광고 최적화"], status: "완료" },
      { trade: "웨딩 업체", work: ["인스타그램 운영"], status: "진행 중" },
      { trade: "꽃집", work: ["플레이스 상위노출", "블로그 상위노출", "플레이스 SEO 최적화"], status: "완료" },
    ],
  },
];

const ALL_ITEMS = TRACK_RECORD.flatMap((g) => g.items);

/** 화면 위쪽 요약 숫자. 배열에서 세므로 목록과 어긋날 수 없다 */
export const TRACK_TOTALS = {
  /** 계약 단위 업체 수 */
  clients: ALL_ITEMS.length,
  /** 지점·권역까지 편 실제 관리 수 */
  stores: ALL_ITEMS.reduce((n, i) => n + (i.branches ?? 1), 0),
  /** 서로 다른 업종 수 */
  trades: new Set(ALL_ITEMS.map((i) => i.trade)).size,
  /** 지역이 확인된 항목에서 뽑은 광역 수 */
  regions: new Set(ALL_ITEMS.flatMap((i) => (i.region ? i.region.split("·") : []))).size,
  /** 지금도 관리 중인 항목 수 */
  ongoing: ALL_ITEMS.filter((i) => i.status === "진행 중").length,
};
