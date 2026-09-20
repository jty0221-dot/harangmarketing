/**
 * 홈페이지 문의 첫 답 문안 (카톡용 · 문자용)
 *
 * 왜 있나 : 문의가 들어오면 그 업종과 원하는 것에 맞춘 첫 답을 바로 복사해 보낼 수 있어야 한다.
 *   관리자 화면(/admin/inquiries)의 '보낼 문안' 블록과 문의 피드(/api/admin/inquiries/feed)가 같이 쓴다.
 * 순수 모듈이다 : db 도 next 도 부르지 않는다. 클라이언트 페이지에서 바로 import 한다.
 * 문안 기준 : 상담실장 페르소나 L2(대표 명의 · 답 먼저 · 되묻기) · 회사 사실 표기 기준(하랑 대표 / 대표님 · 원장님).
 *   가격 숫자 · 성과 약속 · 큰따옴표 · 긴 대시 · 이모지는 넣지 않는다. 문장을 바꿀 때는 보라 앞 인계서로 남긴다.
 *   병의원은 격식 존댓말이고 규정 안에서 가능한 범위만 말한다. 검수는 진우 몫이다.
 */

export type InquiryKind = "cafe" | "food" | "clean" | "beauty" | "medical" | "edu" | "shop" | "other";

export interface InquiryReplyInput {
  name: string;
  industry?: string | null;
  goals?: string | null;
  message?: string | null;
  budget?: string | null;
  source?: string | null;
}

export interface InquiryReply {
  kind: InquiryKind;
  kindLabel: string;
  /** 카톡용 · 문단 넷 · 빈 줄로 나눈다 */
  kakao: string;
  /** 문자용 · 한 문단 · 짧게 */
  sms: string;
}

export const INQUIRY_KIND_LABEL: Record<InquiryKind, string> = {
  cafe: "카페·베이커리",
  food: "음식점",
  clean: "청소·시설",
  beauty: "미용·뷰티",
  medical: "병의원",
  edu: "학원·교육",
  shop: "온라인 판매",
  other: "기타",
};

/** 먼저 맞는 것이 이긴다. 병의원을 맨 앞에 두는 이유는 '피부과' 가 미용 쪽 단어와 겹치기 때문이다. */
const KIND_WORDS: [InquiryKind, string[]][] = [
  ["medical", ["의원", "병원", "치과", "한의원", "피부과", "성형", "정형외과", "내과", "한방", "클리닉", "안과", "이비인후과", "산부인과", "소아과", "비뇨기과", "정신건강", "재활의학"]],
  ["cafe", ["카페", "베이커리", "빵", "디저트", "커피", "브런치", "케이크", "마카롱", "베이글", "도넛"]],
  ["beauty", ["미용", "네일", "뷰티", "헤어", "피부관리", "속눈썹", "왁싱", "에스테틱", "마사지", "살롱", "메이크업", "반영구", "두피", "태닝"]],
  ["clean", ["청소", "시설", "설비", "철거", "누수", "인테리어", "소방", "방수", "이사", "폐기물", "세차", "수리", "도배", "배관", "방역", "리모델링", "공사"]],
  ["edu", ["학원", "교육", "과외", "교습", "어학", "공부방", "유치원", "키즈", "스터디", "학습"]],
  ["shop", ["쇼핑몰", "스토어", "온라인", "쿠팡", "자사몰", "이커머스", "공동구매"]],
  ["food", ["음식점", "식당", "맛집", "고기", "치킨", "횟집", "분식", "술집", "주점", "포차", "초밥", "국밥", "삼겹", "족발", "피자", "파스타", "한식", "중식", "일식", "양식", "뷔페", "레스토랑", "곱창", "냉면", "칼국수", "돈까스", "보쌈", "배달"]],
];

export function classifyIndustry(text: string | null | undefined): InquiryKind {
  const t = (text || "").toLowerCase();
  if (!t.trim()) return "other";
  for (const [kind, words] of KIND_WORDS) {
    if (words.some((w) => t.includes(w))) return kind;
  }
  return "other";
}

/** 상담 신청 폼의 '원하는 것' 항목을 문안에 들어갈 짧은 말로 바꾼다. 서버는 쉼표로 이어 붙여 저장한다. */
const GOAL_WORDS: [string[], string][] = [
  [["플레이스"], "플레이스 순위"],
  [["리뷰", "후기"], "리뷰"],
  [["sns", "팔로워", "인지도", "인스타"], "인스타그램"],
  [["블로그"], "블로그 노출"],
  [["방문"], "매장 방문"],
  [["매출"], "온라인 매출"],
  [["신뢰", "브랜드"], "브랜드 신뢰"],
];

function goalPhrases(goals: string | null | undefined): string[] {
  const out: string[] = [];
  for (const piece of (goals || "").split(",")) {
    const p = piece.trim().toLowerCase();
    if (!p) continue;
    for (const [words, label] of GOAL_WORDS) {
      if (words.some((w) => p.includes(w))) {
        if (!out.includes(label)) out.push(label);
        break;
      }
    }
  }
  return out;
}

/** 업종별 둘째 문단. 왜 그것부터 보는지를 한 문장으로 말한다. */
const WHY: Record<InquiryKind, string> = {
  cafe: "카페는 플레이스와 리뷰, 인스타그램이 같이 가야 해서, 지금 어느 키워드에서 몇 위에 있는지부터 보고 말씀드리는 게 맞는 거 같습니다.",
  food: "음식점은 플레이스 순위와 리뷰가 손님을 부르는 쪽이라, 지금 어느 키워드에서 몇 위에 있는지부터 보고 말씀드리는 게 맞는 거 같습니다.",
  clean: "청소·시설 쪽은 검색해서 바로 전화하는 손님이 많아서, 플레이스와 블로그에서 지금 어디에 뜨는지부터 보고 말씀드리는 게 맞는 거 같습니다.",
  beauty: "미용·뷰티는 인스타그램과 플레이스가 같이 가야 해서, 지금 계정과 플레이스 상태부터 보고 말씀드리는 게 맞는 거 같습니다.",
  medical: "병의원은 의료광고 규정 안에서 할 수 있는 것과 없는 것을 먼저 가르는 게 순서라, 지금 운영 중인 블로그와 플레이스 상태를 보고 가능한 범위부터 말씀드리겠습니다.",
  edu: "학원은 학부모가 검색하는 블로그와 플레이스가 먼저라, 지금 동네 검색에서 어디에 뜨는지부터 보고 말씀드리는 게 맞는 거 같습니다.",
  shop: "온라인 판매는 상세페이지와 블로그 검색 노출이 같이 가야 해서, 지금 스토어와 검색 상태부터 보고 말씀드리는 게 맞는 거 같습니다.",
  other: "업종마다 먼저 할 일이 달라서, 지금 어디에 어떻게 노출되고 있는지부터 보고 말씀드리는 게 맞는 거 같습니다.",
};

/** 보내 달라는 것 (카톡용). 링크 하나면 되고 없으면 이름과 동네면 된다. */
const ASK: Record<InquiryKind, string> = {
  cafe: "네이버 플레이스 링크(없으면 매장 이름과 동네)만",
  food: "네이버 플레이스 링크(없으면 매장 이름과 동네)만",
  clean: "네이버 플레이스 링크(없으면 업체 이름과 주로 나가는 지역)만",
  beauty: "네이버 플레이스 링크(없으면 매장 이름과 동네)만",
  medical: "플레이스 링크(없으면 병원 이름과 지역)만",
  edu: "네이버 플레이스 링크(없으면 학원 이름과 동네)만",
  shop: "스토어 링크(없으면 브랜드 이름과 파는 상품)만",
  other: "네이버 플레이스 링크(없으면 상호와 동네)만",
};

/** 보내 달라는 것 (문자용 · 더 짧게) */
const ASK_SHORT: Record<InquiryKind, string> = {
  cafe: "플레이스 링크나 매장 이름과 동네만",
  food: "플레이스 링크나 매장 이름과 동네만",
  clean: "플레이스 링크나 업체 이름과 지역만",
  beauty: "플레이스 링크나 매장 이름과 동네만",
  medical: "플레이스 링크나 병원 이름과 지역만",
  edu: "플레이스 링크나 학원 이름과 동네만",
  shop: "스토어 링크나 브랜드 이름만",
  other: "플레이스 링크나 상호와 동네만",
};

/** 마무리 한 줄. 카페·음식점·미용·학원·판매·기타는 대표 말투 그대로, 청소는 짧게, 병의원은 격식. */
const CLOSE: Record<InquiryKind, string> = {
  cafe: "통화가 편하신 시간 알려 주시면 그 시간에 연락드리겠습니다^^",
  food: "통화가 편하신 시간 알려 주시면 그 시간에 연락드리겠습니다^^",
  clean: "통화 편하신 시간 알려 주시면 그때 연락드리겠습니다.",
  beauty: "통화가 편하신 시간 알려 주시면 그 시간에 연락드리겠습니다^^",
  medical: "통화가 편하신 시간을 알려 주시면 그 시간에 연락드리겠습니다.",
  edu: "통화가 편하신 시간 알려 주시면 그 시간에 연락드리겠습니다^^",
  shop: "통화가 편하신 시간 알려 주시면 그 시간에 연락드리겠습니다^^",
  other: "통화가 편하신 시간 알려 주시면 그 시간에 연락드리겠습니다^^",
};

const CLOSE_SMS = "통화 편하신 시간 알려 주시면 그때 연락드리겠습니다.";
const CLOSE_SMS_MEDICAL = "통화가 편하신 시간을 알려 주시면 그 시간에 연락드리겠습니다.";

/** 이름 뒤에 붙여 적은 호칭은 떼고 붙인다. '홍길동 대표' 가 '홍길동 대표 대표님' 이 되지 않게. */
function cleanName(name: string): string {
  return (name || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s*(대표님|사장님|원장님|담당자님|대표|사장|원장|님)$/u, "")
    .trim()
    .slice(0, 30);
}

function honorific(kind: InquiryKind, name: string): string {
  const title = kind === "medical" ? "원장님" : "대표님";
  const n = cleanName(name);
  return n ? `${n} ${title}` : title;
}

function receivedLine(source: string | null | undefined): string {
  return source === "free-check"
    ? "홈페이지로 주신 무료 진단 신청 확인했습니다."
    : "홈페이지로 주신 상담 신청 확인했습니다.";
}

/** 무료 진단은 '현재 플레이스 순위: N위권' 을 message 로 보낸다. 그 숫자를 받아 준다. */
function messageLine(message: string | null | undefined): string {
  const m = (message || "").trim();
  if (!m) return "";
  const rank = m.match(/(\d{1,3})\s*위/);
  if (rank) return `적어 주신 현재 순위(${rank[1]}위권)를 기준으로 왜 거기에 있는지부터 보겠습니다.`;
  return "적어 주신 내용도 같이 봤습니다.";
}

function budgetLine(budget: string | null | undefined): string {
  const b = (budget || "").trim();
  if (!b || b.includes("미정")) return "예산은 상담하면서 같이 잡아도 됩니다.";
  return "적어 주신 예산 안에서 먼저 할 것부터 순서를 잡아 드리겠습니다.";
}

function goalsLine(goals: string | null | undefined): string {
  const g = goalPhrases(goals);
  if (g.length === 0) return "";
  return `${g.join(", ")} 쪽을 원하신다고 적어 주셨구요.`;
}

/**
 * 문의 한 건 → 카톡용 · 문자용 첫 답.
 * 답 먼저(확인했다) → 왜 그것부터 보나 → 보내 달라는 것 하나 → 통화 시간 되묻기. 다섯 단계 골격의 앞 넷이다.
 * 문의 본문은 문안에 옮겨 적지 않는다(고객이 쓴 글이 그대로 되돌아가면 기계 답으로 읽힌다).
 */
export function buildInquiryReply(q: InquiryReplyInput): InquiryReply {
  const kind = classifyIndustry(q.industry);
  const who = honorific(kind, q.name);
  const received = receivedLine(q.source);

  const head = `안녕하세요 ${who}, 마케팅 대행사 하랑 대표 전태영입니다.\n${received}`;
  const why = [goalsLine(q.goals), WHY[kind], messageLine(q.message)].filter(Boolean).join(" ");
  const ask = `${ASK[kind]} 보내 주시면 현재 상태를 제가 먼저 확인해서 되는 것과 안 되는 것부터 말씀드리겠습니다. ${budgetLine(q.budget)} 상담과 진단은 비용 없습니다.`;
  const kakao = [head, why, ask, CLOSE[kind]].join("\n\n");

  const sms = [
    `안녕하세요 ${who}, 마케팅 대행사 하랑 대표 전태영입니다.`,
    received,
    `${ASK_SHORT[kind]} 보내 주시면 현재 상태 먼저 확인해서 되는 것과 안 되는 것부터 말씀드리겠습니다.`,
    "상담과 진단은 비용 없습니다.",
    kind === "medical" ? CLOSE_SMS_MEDICAL : CLOSE_SMS,
  ].join(" ");

  return { kind, kindLabel: INQUIRY_KIND_LABEL[kind], kakao, sms };
}

/** 문자 앱을 여는 링크. 숫자만 남기고, 아이폰은 &body 그 외는 ?body 를 쓴다. */
export function smsHref(phone: string, body: string, userAgent?: string): string {
  const digits = (phone || "").replace(/[^\d+]/g, "");
  const ua = userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
  const sep = /iPhone|iPad|iPod/i.test(ua) ? "&" : "?";
  return `sms:${digits}${sep}body=${encodeURIComponent(body)}`;
}
