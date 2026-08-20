/**
 * SNS 부스트 스토어 — 상품 카탈로그 단일 소스
 *
 * 페이지·주문 API·구조화 데이터가 전부 이 파일을 참조한다.
 * 가격을 바꾸면 화면과 결제 금액 계산이 함께 바뀐다.
 *
 * sid 는 공급 파트너 쪽 서비스 번호다. 파트너 API 주소·키는
 * 환경변수(SMM_API_URL·SMM_API_KEY)에만 두고 코드에 쓰지 않는다.
 *
 * 가격 원칙:
 * - unitPrice 는 1개(1명·1회)당 소비자가. 총액 = unitPrice × 수량.
 * - min·max 는 공급 파트너의 주문 가능 범위 안쪽으로만 잡는다.
 * - 도매가를 코드·주석에 적지 말 것 (공개 저장소).
 */

export type PlatformId =
  | "instagram"
  | "youtube"
  | "threads"
  | "tiktok"
  | "facebook"
  | "x"
  | "naver"
  | "kakao";

export interface SnsPlatform {
  id: PlatformId;
  name: string;
  short: string;
}

export const SNS_PLATFORMS: SnsPlatform[] = [
  { id: "instagram", name: "인스타그램", short: "인스타" },
  { id: "youtube", name: "유튜브", short: "유튜브" },
  { id: "threads", name: "스레드", short: "스레드" },
  { id: "tiktok", name: "틱톡", short: "틱톡" },
  { id: "facebook", name: "페이스북", short: "페북" },
  { id: "x", name: "엑스 (트위터)", short: "엑스" },
  { id: "naver", name: "네이버", short: "네이버" },
  { id: "kakao", name: "카카오", short: "카카오" },
];

export interface SnsProduct {
  slug: string;
  platform: PlatformId;
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

export const SNS_PRODUCTS: SnsProduct[] = [
  /* ── 인스타그램 ── */
  {
    slug: "ig-follower-kr",
    platform: "instagram",
    name: "한국인 팔로워",
    desc: "실제 활동하는 한국인 계정이 팔로우합니다. 자연스러운 속도로 유입됩니다.",
    unitLabel: "명",
    unitPrice: 150,
    min: 50,
    max: 10000,
    step: 10,
    sid: 3,
    linkLabel: "인스타그램 프로필 링크",
    linkHint: "https://instagram.com/아이디",
    badge: "인기",
  },
  {
    slug: "ig-follower-global",
    platform: "instagram",
    name: "외국인 팔로워",
    desc: "해외 실계정 팔로워입니다. 규모를 빠르게 갖출 때 씁니다.",
    unitLabel: "명",
    unitPrice: 20,
    min: 100,
    max: 50000,
    step: 50,
    sid: 615,
    linkLabel: "인스타그램 프로필 링크",
    linkHint: "https://instagram.com/아이디",
    badge: "가성비",
  },
  {
    slug: "ig-like-kr",
    platform: "instagram",
    name: "한국인 좋아요",
    desc: "게시물·릴스에 실제 한국인 계정의 좋아요가 자연 속도로 붙습니다.",
    unitLabel: "개",
    unitPrice: 25,
    min: 30,
    max: 5000,
    step: 10,
    sid: 121,
    linkLabel: "게시물 링크",
    linkHint: "https://instagram.com/p/게시물주소",
    badge: "인기",
  },
  {
    slug: "ig-like-global",
    platform: "instagram",
    name: "외국인 좋아요",
    desc: "해외 계정 좋아요입니다. 게시물 반응 수치를 저렴하게 채웁니다.",
    unitLabel: "개",
    unitPrice: 3,
    min: 100,
    max: 10000,
    step: 50,
    sid: 329,
    linkLabel: "게시물 링크",
    linkHint: "https://instagram.com/p/게시물주소",
  },
  {
    slug: "ig-reels-view",
    platform: "instagram",
    name: "릴스·동영상 조회수",
    desc: "한국인 조회수입니다. 릴스 초기 반응 구간에 특히 많이 쓰입니다.",
    unitLabel: "회",
    unitPrice: 4,
    min: 500,
    max: 100000,
    step: 100,
    sid: 673,
    linkLabel: "릴스·동영상 링크",
    linkHint: "https://instagram.com/reel/게시물주소",
    badge: "추천",
  },
  {
    slug: "ig-comment-kr",
    platform: "instagram",
    name: "한국인 랜덤 댓글",
    desc: "게시물 맥락에 맞는 자연스러운 한국어 댓글이 달립니다.",
    unitLabel: "개",
    unitPrice: 300,
    min: 5,
    max: 300,
    step: 1,
    sid: 509,
    linkLabel: "게시물 링크",
    linkHint: "https://instagram.com/p/게시물주소",
  },
  {
    slug: "ig-comment-custom",
    platform: "instagram",
    name: "한국인 지정 댓글",
    desc: "원하는 문구 그대로 댓글이 달립니다. 한 줄에 댓글 하나씩 적어주세요.",
    unitLabel: "개",
    unitPrice: 400,
    min: 5,
    max: 300,
    step: 1,
    sid: 139,
    linkLabel: "게시물 링크",
    linkHint: "https://instagram.com/p/게시물주소",
    needsComments: true,
  },
  {
    slug: "ig-reach",
    platform: "instagram",
    name: "노출·도달·방문 (인사이트)",
    desc: "게시물 인사이트의 노출·도달·프로필 방문 수치를 함께 올립니다.",
    unitLabel: "회",
    unitPrice: 2,
    min: 500,
    max: 100000,
    step: 100,
    sid: 11,
    linkLabel: "게시물 링크",
    linkHint: "https://instagram.com/p/게시물주소",
  },
  {
    slug: "ig-save",
    platform: "instagram",
    name: "한국인 저장",
    desc: "게시물 저장 수를 올립니다. 저장은 노출 알고리즘의 주요 신호입니다.",
    unitLabel: "개",
    unitPrice: 2,
    min: 100,
    max: 20000,
    step: 50,
    sid: 13,
    linkLabel: "게시물 링크",
    linkHint: "https://instagram.com/p/게시물주소",
  },

  /* ── 유튜브 ── */
  {
    slug: "yt-sub-global",
    platform: "youtube",
    name: "외국인 구독자",
    desc: "해외 실계정 구독자입니다. 채널 규모를 갖출 때 씁니다.",
    unitLabel: "명",
    unitPrice: 100,
    min: 100,
    max: 20000,
    step: 50,
    sid: 774,
    linkLabel: "채널 링크",
    linkHint: "https://youtube.com/@채널명",
  },
  {
    slug: "yt-sub-kr",
    platform: "youtube",
    name: "한국인 구독자",
    desc: "실제 한국인 계정이 구독합니다. 국내 채널 신뢰도에 유리합니다.",
    unitLabel: "명",
    unitPrice: 550,
    min: 100,
    max: 5000,
    step: 10,
    sid: 155,
    linkLabel: "채널 링크",
    linkHint: "https://youtube.com/@채널명",
    badge: "인기",
  },
  {
    slug: "yt-view-global",
    platform: "youtube",
    name: "외국인 조회수",
    desc: "해외 시청 조회수입니다. 대량 물량에 적합합니다.",
    unitLabel: "회",
    unitPrice: 8,
    min: 500,
    max: 100000,
    step: 100,
    sid: 747,
    linkLabel: "동영상 링크",
    linkHint: "https://youtube.com/watch?v=영상주소",
  },
  {
    slug: "yt-view-kr",
    platform: "youtube",
    name: "한국인 조회수",
    desc: "국내 IP 기반 한국인 조회수입니다. 국내 타겟 영상에 권장합니다.",
    unitLabel: "회",
    unitPrice: 15,
    min: 1000,
    max: 50000,
    step: 100,
    sid: 1148,
    linkLabel: "동영상 링크",
    linkHint: "https://youtube.com/watch?v=영상주소",
    badge: "추천",
  },
  {
    slug: "yt-like-kr",
    platform: "youtube",
    name: "한국인 좋아요",
    desc: "동영상·쇼츠에 한국인 계정 좋아요가 붙습니다.",
    unitLabel: "개",
    unitPrice: 20,
    min: 50,
    max: 5000,
    step: 10,
    sid: 156,
    linkLabel: "동영상 링크",
    linkHint: "https://youtube.com/watch?v=영상주소",
  },
  {
    slug: "yt-comment-kr",
    platform: "youtube",
    name: "한국인 랜덤 댓글",
    desc: "영상 맥락에 맞는 자연스러운 한국어 댓글이 달립니다.",
    unitLabel: "개",
    unitPrice: 350,
    min: 5,
    max: 300,
    step: 1,
    sid: 157,
    linkLabel: "동영상 링크",
    linkHint: "https://youtube.com/watch?v=영상주소",
  },

  /* ── 스레드 ── */
  {
    slug: "th-follower-kr",
    platform: "threads",
    name: "한국인 팔로워",
    desc: "실제 한국인 계정이 팔로우합니다. 스레드 초기 육성에 씁니다.",
    unitLabel: "명",
    unitPrice: 180,
    min: 10,
    max: 5000,
    step: 10,
    sid: 733,
    linkLabel: "스레드 프로필 링크",
    linkHint: "https://threads.net/@아이디",
  },
  {
    slug: "th-like-kr",
    platform: "threads",
    name: "한국인 좋아요",
    desc: "게시물에 실제 한국인 계정의 좋아요가 붙습니다.",
    unitLabel: "개",
    unitPrice: 35,
    min: 10,
    max: 5000,
    step: 10,
    sid: 734,
    linkLabel: "게시물 링크",
    linkHint: "https://threads.net/@아이디/post/게시물주소",
  },

  /* ── 틱톡 ── */
  {
    slug: "tt-follower",
    platform: "tiktok",
    name: "팔로워",
    desc: "해외 실계정 팔로워입니다. 계정 규모를 빠르게 갖춥니다.",
    unitLabel: "명",
    unitPrice: 25,
    min: 100,
    max: 50000,
    step: 50,
    sid: 1138,
    linkLabel: "틱톡 프로필 링크",
    linkHint: "https://tiktok.com/@아이디",
  },
  {
    slug: "tt-view",
    platform: "tiktok",
    name: "조회수 (한국인)",
    desc: "한국인 조회수입니다. 초기 반응 구간에 효과적입니다.",
    unitLabel: "회",
    unitPrice: 2,
    min: 500,
    max: 100000,
    step: 100,
    sid: 124,
    linkLabel: "영상 링크",
    linkHint: "https://tiktok.com/@아이디/video/영상주소",
  },

  /* ── 페이스북 ── */
  {
    slug: "fb-like-kr",
    platform: "facebook",
    name: "한국인 게시물 좋아요",
    desc: "게시물에 실제 한국인 계정의 좋아요가 붙습니다.",
    unitLabel: "개",
    unitPrice: 60,
    min: 10,
    max: 3000,
    step: 10,
    sid: 23,
    linkLabel: "게시물 링크",
    linkHint: "https://facebook.com/게시물주소",
  },
  {
    slug: "fb-follower-kr",
    platform: "facebook",
    name: "한국인 프로필 팔로워",
    desc: "실제 한국인 계정이 프로필을 팔로우합니다.",
    unitLabel: "명",
    unitPrice: 400,
    min: 10,
    max: 3000,
    step: 10,
    sid: 349,
    linkLabel: "프로필 링크",
    linkHint: "https://facebook.com/아이디",
  },

  /* ── 엑스 ── */
  {
    slug: "x-follower",
    platform: "x",
    name: "외국인 팔로워",
    desc: "해외 실계정 팔로워입니다.",
    unitLabel: "명",
    unitPrice: 90,
    min: 50,
    max: 20000,
    step: 10,
    sid: 1146,
    linkLabel: "프로필 링크",
    linkHint: "https://x.com/아이디",
  },
  {
    slug: "x-view",
    platform: "x",
    name: "조회수 (한국인)",
    desc: "게시물 조회수를 올립니다.",
    unitLabel: "회",
    unitPrice: 1,
    min: 1000,
    max: 500000,
    step: 500,
    sid: 29,
    linkLabel: "게시물 링크",
    linkHint: "https://x.com/아이디/status/게시물주소",
  },

  /* ── 네이버 ── */
  {
    slug: "nv-blog-visit",
    platform: "naver",
    name: "블로그 방문자",
    desc: "실제 한국인 방문 트래픽입니다. 일 방문자 수 관리에 씁니다.",
    unitLabel: "회",
    unitPrice: 6,
    min: 500,
    max: 100000,
    step: 100,
    sid: 1015,
    linkLabel: "블로그 글 링크",
    linkHint: "https://blog.naver.com/아이디/글번호",
  },
  {
    slug: "nv-blog-like",
    platform: "naver",
    name: "블로그 공감",
    desc: "실제 한국인 계정의 공감이 붙습니다.",
    unitLabel: "개",
    unitPrice: 220,
    min: 10,
    max: 1000,
    step: 5,
    sid: 1012,
    linkLabel: "블로그 글 링크",
    linkHint: "https://blog.naver.com/아이디/글번호",
  },
  {
    slug: "nv-blog-buddy",
    platform: "naver",
    name: "블로그 이웃추가",
    desc: "실제 한국인 계정이 이웃추가합니다.",
    unitLabel: "명",
    unitPrice: 400,
    min: 10,
    max: 2000,
    step: 5,
    sid: 301,
    linkLabel: "블로그 홈 링크",
    linkHint: "https://blog.naver.com/아이디",
  },
  {
    slug: "nv-place-save",
    platform: "naver",
    name: "플레이스 저장",
    desc: "네이버 지도·플레이스 저장 수를 올립니다. 플레이스 지표 관리용.",
    unitLabel: "개",
    unitPrice: 120,
    min: 20,
    max: 10000,
    step: 10,
    sid: 1107,
    linkLabel: "플레이스 링크",
    linkHint: "https://naver.me/단축주소 또는 플레이스 URL",
    badge: "추천",
  },
  {
    slug: "nv-place-alarm",
    platform: "naver",
    name: "플레이스 알림받기",
    desc: "플레이스 알림받기(구 단골) 수를 올립니다.",
    unitLabel: "개",
    unitPrice: 160,
    min: 10,
    max: 5000,
    step: 10,
    sid: 700,
    linkLabel: "플레이스 링크",
    linkHint: "https://naver.me/단축주소 또는 플레이스 URL",
  },

  /* ── 카카오 ── */
  {
    slug: "kk-channel-add",
    platform: "kakao",
    name: "카카오톡 채널 친구추가",
    desc: "실제 한국인 계정이 채널을 친구추가합니다.",
    unitLabel: "명",
    unitPrice: 380,
    min: 100,
    max: 100000,
    step: 50,
    sid: 244,
    linkLabel: "카카오톡 채널 링크",
    linkHint: "https://pf.kakao.com/채널주소",
  },
];

/* ────────────────────────────────────────────────
   조회 헬퍼
   ──────────────────────────────────────────────── */

export function getProduct(slug: string): SnsProduct | undefined {
  return SNS_PRODUCTS.find((p) => p.slug === slug);
}

export function productsByPlatform(platform: PlatformId): SnsProduct[] {
  return SNS_PRODUCTS.filter((p) => p.platform === platform);
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
