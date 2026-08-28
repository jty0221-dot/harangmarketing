/**
 * SNS 부스트 스토어 — 상품 카탈로그 단일 소스
 *
 * 페이지·주문 API·구조화 데이터가 전부 이 파일을 참조한다.
 * 상품 데이터 자체는 sns-catalog.generated.ts 에서 온다 (자동 생성).
 *
 * sid 는 공급 파트너 쪽 서비스 번호다. 파트너 API 주소·키는
 * 환경변수(SMM_API_URL·SMM_API_KEY)에만 두고 코드에 쓰지 않는다.
 *
 * 가격 원칙:
 * - unitPrice 는 1개(1명·1회)당 소비자가. 총액 = unitPrice × 수량.
 * - min·max 는 공급 파트너의 주문 가능 범위 안쪽으로만 잡는다.
 * - 도매가를 코드·주석에 적지 말 것 (공개 저장소).
 */

import { SNS_CATALOG } from "./sns-catalog.generated";

export type PlatformId =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "threads"
  | "naver"
  | "x"
  | "facebook"
  | "telegram"
  | "kakao"
  // 커머스는 브랜드마다 서비스가 다르다 — 한 덩어리로 묶지 않는다
  | "coupang"
  | "musinsa"
  | "oliveyoung"
  | "ohou"
  | "baemin"
  | "daangn";

export interface SnsPlatform {
  id: PlatformId;
  name: string;
  short: string;
}

export const SNS_PLATFORMS: SnsPlatform[] = [
  { id: "instagram", name: "인스타그램", short: "인스타" },
  { id: "youtube", name: "유튜브", short: "유튜브" },
  { id: "tiktok", name: "틱톡", short: "틱톡" },
  { id: "threads", name: "스레드", short: "스레드" },
  { id: "naver", name: "네이버", short: "네이버" },
  { id: "x", name: "엑스 (트위터)", short: "엑스" },
  { id: "facebook", name: "페이스북", short: "페북" },
  { id: "telegram", name: "텔레그램", short: "텔레" },
  { id: "kakao", name: "카카오", short: "카카오" },
  { id: "coupang", name: "쿠팡", short: "쿠팡" },
  { id: "musinsa", name: "무신사", short: "무신사" },
  { id: "oliveyoung", name: "올리브영", short: "올영" },
  { id: "ohou", name: "오늘의집", short: "오늘의집" },
  { id: "baemin", name: "배달의민족", short: "배민" },
  { id: "daangn", name: "당근", short: "당근" },
];

/** 상품 그룹 노출 순서 — 카탈로그에서 이 순서로 소제목이 나온다 */
export const SNS_GROUPS = [
  "팔로워·구독",
  "좋아요·반응",
  "조회수",
  "댓글",
  "노출·저장",
  "상위노출",
  "리뷰",
  "확산·바이럴",
  "계정 관리",
  "기타",
] as const;

export type SnsGroup = (typeof SNS_GROUPS)[number];

export interface SnsProduct {
  slug: string;
  platform: PlatformId;
  /** 상품 그룹 — 카탈로그 소제목 분류 */
  group: string;
  name: string;
  desc: string;
  /** 수량 단위 표기: 명 · 개 · 회 */
  unitLabel: string;
  /** 1개당 소비자가 (원) */
  unitPrice: number;
  min: number;
  max: number;
  /** 수량 입력 증감 단위 (UI 편의) */
  step: number;
  /** 공급 파트너 서비스 번호 (고객 화면에는 노출하지 않는다) */
  sid: number;
  /** 주문 링크 입력란 라벨·예시 */
  linkLabel: string;
  linkHint: string;
  /** 지정 댓글형 — 댓글 내용을 받아 줄 수 = 수량으로 처리 */
  needsComments?: boolean;
  badge?: "인기" | "추천" | "가성비";
}

/**
 * 전체 카탈로그는 scripts/sns/gen-catalog.js 가 생성한다.
 * 293개 상품의 소비자가·이름·분류가 자동 산출된다 (도매가는 담기지 않는다).
 * 상품을 추가·수정하거나 마진을 바꾸려면 그 스크립트를 고쳐 다시 생성할 것.
 */
export const SNS_PRODUCTS: SnsProduct[] = SNS_CATALOG;

/* ────────────────────────────────────────────────
   조회 헬퍼
   ──────────────────────────────────────────────── */

export function getProduct(slug: string): SnsProduct | undefined {
  return SNS_PRODUCTS.find((p) => p.slug === slug);
}

export function productsByPlatform(platform: PlatformId): SnsProduct[] {
  return SNS_PRODUCTS.filter((p) => p.platform === platform);
}

/** 플랫폼 상품을 그룹 순서대로 묶어 반환 (카탈로그 소제목용) */
export function groupedByPlatform(platform: PlatformId): { group: string; items: SnsProduct[] }[] {
  const items = productsByPlatform(platform);
  const order = SNS_GROUPS as readonly string[];
  const seen = new Map<string, SnsProduct[]>();
  for (const p of items) {
    if (!seen.has(p.group)) seen.set(p.group, []);
    seen.get(p.group)!.push(p);
  }
  return [...seen.keys()]
    .sort((a, b) => {
      const ia = order.indexOf(a), ib = order.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    })
    .map((group) => ({ group, items: seen.get(group)! }));
}

/** 플랫폼에 상품이 하나라도 있는지 (탭 노출 판단) */
export function platformHasProducts(platform: PlatformId): boolean {
  return SNS_PRODUCTS.some((p) => p.platform === platform);
}

export function platformName(id: PlatformId): string {
  return SNS_PLATFORMS.find((p) => p.id === id)?.name ?? id;
}

export function won(n: number): string {
  return n.toLocaleString("ko-KR");
}

/** 총액 계산 — 서버·클라이언트 공용. 반드시 서버에서 재계산해 검증한다. */
export function calcTotal(product: SnsProduct, qty: number): number {
  return product.unitPrice * qty;
}

export function isQtyValid(product: SnsProduct, qty: number): boolean {
  return Number.isInteger(qty) && qty >= product.min && qty <= product.max;
}

/* ────────────────────────────────────────────────
   주문 상태 — 화면 표기 공용
   ──────────────────────────────────────────────── */

export type OrderStatus = "pending" | "processing" | "partial" | "completed" | "canceled";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "입금 확인 대기",
  processing: "진행 중",
  partial: "부분 완료",
  completed: "완료",
  canceled: "취소됨",
};

/* ────────────────────────────────────────────────
   페이지 공용 문구
   ──────────────────────────────────────────────── */

export const STORE = {
  name: "SNS 부스트 스토어",
  nameEn: "Harang SNS Boost Store",
  tagline: "대행 계약 없이, 필요한 만큼만 건당 주문",
  /** 시작 안내 — 상품별 확약 대신 보수적인 공통 안내를 쓴다 */
  startNote: "입금 확인 후 보통 당일, 늦어도 24시간 안에 시작됩니다.",
} as const;

export interface SnsFaqItem {
  q: string;
  a: string;
}

export const SNS_FAQ: SnsFaqItem[] = [
  {
    q: "회원가입이나 계정 비밀번호가 필요한가요?",
    a: "둘 다 필요 없습니다. 공개된 프로필·게시물 링크만 있으면 진행됩니다. 비밀번호를 요구하는 일은 절대 없으니, 누가 요구한다면 저희가 아닙니다.",
  },
  {
    q: "주문하면 언제 시작되나요?",
    a: "입금 확인 후 보통 당일 시작되고, 늦어도 24시간 안에 시작됩니다. 수량이 크면 계정 안전을 위해 며칠에 나눠 자연스러운 속도로 들어갑니다. 시작 전 주문은 전액 환불됩니다.",
  },
  {
    q: "계정이 비공개여도 되나요?",
    a: "비공개 계정은 진행이 되지 않습니다. 주문 전에 프로필 또는 게시물을 공개 상태로 바꿔주세요. 진행이 끝난 뒤 다시 비공개로 돌리셔도 됩니다.",
  },
  {
    q: "팔로워나 좋아요가 나중에 줄어들지 않나요?",
    a: "플랫폼 정기 점검 때 일부가 줄어들 수 있습니다. 이는 모든 업체가 동일하게 겪는 현상입니다. 진행 후 30일 안에 눈에 띄게 줄면 카카오톡으로 알려주세요. 확인 후 보충해 드립니다.",
  },
  {
    q: "검색 순위나 알고리즘 노출까지 보장되나요?",
    a: "그 부분은 약속드리지 않습니다. 각 플랫폼의 알고리즘 기준은 공개되어 있지 않기 때문입니다. 이 스토어가 보장하는 것은 주문하신 수치(팔로워·좋아요·조회수 등)가 채워지는 것까지입니다. 노출 전략이 필요하시면 대행 서비스 상담을 이용해 주세요.",
  },
  {
    q: "결제는 어떻게 하나요?",
    a: "무통장입금으로 진행됩니다. 주문을 접수하면 주문번호와 입금 안내를 보여드리고, 입금자명을 확인한 뒤 작업을 시작합니다. 세금계산서·현금영수증이 필요하시면 카카오톡으로 요청해 주세요.",
  },
  {
    q: "환불 규정은 어떻게 되나요?",
    a: "작업 시작 전에는 전액 환불됩니다. 시작 후에는 진행되지 않은 수량만큼 환불됩니다. 링크를 잘못 입력해 이미 진행된 주문은 환불이 어려우니 주문 전에 링크를 꼭 확인해 주세요.",
  },
  {
    q: "일반 업체와 뭐가 다른가요?",
    a: "하랑마케팅은 소상공인 마케팅을 10년째 해온 대행사이고, 이 스토어의 프로그램은 저희가 실제 고객사 캠페인에 쓰는 것과 같습니다. 계정 상태에 맞지 않는 과주문은 접수 단계에서 저희가 먼저 말리고, 진행 상황은 주문 조회 페이지에서 실시간으로 확인됩니다.",
  },
];
