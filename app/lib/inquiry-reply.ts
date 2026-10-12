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

import { extractInquiryLinks, type InquiryResearch } from "./inquiry-links";
import type { InquiryKnowledge } from "./inquiry-knowledge";
import { composeUnderstoodReply, assessInquiry, type InquiryAssessment } from "./inquiry-understanding";

export type InquiryKind = "cafe" | "food" | "clean" | "beauty" | "medical" | "edu" | "shop" | "other";

export interface InquiryReplyInput {
  name: string;
  industry?: string | null;
  goals?: string | null;
  message?: string | null;
  budget?: string | null;
  source?: string | null;
  research?: InquiryResearch | null;
  knowledge?: InquiryKnowledge | null;
  /** Administrator-only memo may contain a specifically delimited reviewed reply. */
  memo?: string | null;
}

export interface InquiryReply {
  kind: InquiryKind;
  kindLabel: string;
  /** 카톡용 · 문단 넷 · 빈 줄로 나눈다 */
  kakao: string;
  /** 문자용 · 한 문단 · 짧게 */
  sms: string;
  providedLinks: string[];
  needsResearch: boolean;
  reviewed?: boolean;
  assessment?: InquiryAssessment;
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

/** Interpret the actual request before drafting. Reviewed replies remain authoritative. */
export function buildInquiryReply(q: InquiryReplyInput): InquiryReply {
  const industryKind = classifyIndustry(q.industry);
  const links = extractInquiryLinks(q.message);
  const kind = industryKind === "other" ? classifyIndustry(`${q.message || ""} ${q.goals || ""}`) : industryKind;
  const who = honorific(kind, q.name);
  const received = receivedLine(q.source);

  const head = `안녕하세요 ${who}, 마케팅 대행사 하랑 대표 전태영입니다.\n${received}`;
  const reviewed = q.memo?.match(/(?:^|\n)\[검토 완료 문안\]\r?\n([\s\S]*?)\r?\n\[문안 끝\](?:\r?\n|$)/)?.[1]?.trim();
  if (reviewed) {
    return { kind, kindLabel: INQUIRY_KIND_LABEL[kind], kakao: reviewed, sms: reviewed.replace(/\s*\n\s*/g, " "),
      providedLinks: links, needsResearch: false, reviewed: true, assessment: assessInquiry(q, kind, links) };
  }
  const draft = composeUnderstoodReply(q, kind, head, links);
  return { kind, kindLabel: INQUIRY_KIND_LABEL[kind], providedLinks: links, ...draft };
}

/** 문자 앱을 여는 링크. 숫자만 남기고, 아이폰은 &body 그 외는 ?body 를 쓴다. */
export function smsHref(phone: string, body: string, userAgent?: string): string {
  const digits = (phone || "").replace(/[^\d+]/g, "");
  const ua = userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
  const sep = /iPhone|iPad|iPod/i.test(ua) ? "&" : "?";
  return `sms:${digits}${sep}body=${encodeURIComponent(body)}`;
}
