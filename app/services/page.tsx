import { PUBLIC_SERVICES, isProgram } from "../lib/service-catalog";
import { HP_DRAFTS, HP_STATS, hpThumb } from "../lib/homepage-portfolio";
import { FOOD_PLANS, STAY_PLANS } from "../lib/photo-pricing";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import {
  BookOpen, MapPin, Star, AtSign, BarChart3, MessageSquare,
  Navigation, Palette, Layers, LayoutTemplate, Globe2, ScrollText, Camera,
} from "lucide-react";
import JsonLd from "../components/JsonLd";
import { UNIT_MIN, PACKAGES, BLOG_UNIT_WITH_COPY, BLOG_UNIT_WITHOUT_COPY, CAFE_TIERS, CAFE_TIER_MIN, CAFE_COPY_FEE, MONTHLY_MIN, packageLabel, won } from "../lib/cafe-distribution";
import { REF_TOTAL as DP_TOTAL, REF_CUTS as DP_CUTS, REF_CATEGORIES as DP_CATEGORIES } from "../lib/detail-page-reference";
import { HL_COVERS, HL_TOTAL, HL_SHOP_TOTAL } from "../lib/highlight-reference";
import { FOOD_SHOTS, SPACE_SHOTS } from "../lib/photo-reference";
import { KS, KS_PLANS, won as ksWon } from "../lib/kakao-sender";
import {
  SianMain, PageHead, AnswerRow, Section, LineList, ItemList, LinkList, Steps,
  RankSection, QuestionList, CostLine, CloseBand, Fold, Table,
} from "../components/sian/Sian";
import s from "../components/sian/sian.module.css";
import { SITE, DEFINITIONS, ANSWER_SENTENCES, webPageLd, updatedAt, breadcrumbLd, definitionsLd, faqLd, OG_IMAGE, ogImage, companyYear } from "../lib/seo";
import { best, fmtLong } from "../lib/rank-records";
import { LANDING_RANK_PROOF } from "../lib/landing-gate";

/*
 * 업종별 추천 — 순위 칸은 손으로 적지 않는다.
 * 여기 세 줄을 직접 써 뒀더니 스냅샷이 바뀌는 동안 전부 틀린 값이 됐다
 * (의원 칸의 5위 → 1위는 08-31 스냅샷에 아예 없는 기록이었다).
 * 계측 기록이 있는 업종만 순위를 쓰고, 없는 업종은 fallback 문구를 그대로 쓴다 (C-42).
 *
 * 카드 머리띠는 그라데이션을 쓰지 않는다 (WDS · 그라데이션 아이콘 박스 금지).
 * 여덟 장이 서로 다른 파랑을 쓰던 것을 Primary 한 색으로 맞췄다.
 */
type IndustryRec = {
  industry: string;
  firstRec: string;
  recs: string[];
  /** 계측 기록을 가져올 업종. 없으면 fallback 문구를 쓴다 */
  rank?: string;
  fallback: string;
};

const INDUSTRY_RECS = ([
  { industry: "카페·베이커리", firstRec: "플레이스 SEO", recs: ["체험단·리뷰", "인스타그램"], rank: "카페", fallback: "플레이스 SEO 중심" },
  { industry: "음식점·식당", firstRec: "리뷰 마케팅", recs: ["맘카페 바이럴", "플레이스 SEO"], rank: "음식점", fallback: "리뷰 마케팅 중심" },
  { industry: "미용·뷰티·네일", firstRec: "인스타그램", recs: ["체험단·리뷰", "카카오맵"], fallback: "인스타그램 중심 설계" },
  { industry: "의원·한의원·피부과", firstRec: "블로그 마케팅", recs: ["플레이스 SEO", "리뷰 답글 관리"], rank: "피부과", fallback: "의료법 검수 원고 중심" },
  { industry: "학원·교육", firstRec: "맘카페 바이럴", recs: ["블로그 마케팅", "홈페이지형 블로그"], fallback: "맘카페 바이럴 중심" },
  { industry: "온라인 쇼핑몰", firstRec: "블로그 SEO", recs: ["체험단·리뷰", "블로그 배포"], fallback: "블로그 SEO 중심" },
  { industry: "청소·시설관리", firstRec: "플레이스 SEO", recs: ["블로그 관리", "리뷰 마케팅"], rank: "청소", fallback: "플레이스 SEO 중심" },
  { industry: "개업·창업 준비", firstRec: "창업 지원·브랜딩", recs: ["플레이스 세팅", "블로그 마케팅"], fallback: "오픈 전 플레이스 세팅" },
] as IndustryRec[]).map(({ rank, fallback, ...row }) => {
  // 광고 착지 화면이라 순위 사례 스위치를 따른다 (lib/landing-gate.ts). 꺼져 있으면 fallback 문구
  const r = rank && LANDING_RANK_PROOF ? best(rank) : undefined;
  return { ...row, result: r ? fmtLong(r) : fallback };
});

export const metadata: Metadata = {
  title: "마케팅 서비스 | 검색광고·콘텐츠·사진촬영·디자인",
  twitter: { card: "summary_large_image", title: "하랑마케팅 서비스", description: "마케팅 운영부터 사진촬영, 상세페이지와 홈페이지형 블로그 제작까지 품목별 구성과 사례를 확인하세요.", images: [OG_IMAGE.url] },
  description: "플레이스 SEO, 블로그·카페 배포, 체험단, 인스타그램, 파워컨텐츠, 네이버 광고, 사진촬영, 상세페이지·홈페이지형 블로그 제작을 합니다.",
  keywords: [
    "마케팅 서비스", "네이버 플레이스 SEO", "플레이스 정보 정비",
    "블로그 마케팅", "블로그 정보 정비", "키워드 SEO",
    "체험단 모집", "체험단 대행", "리뷰 마케팅",
    "인스타그램 마케팅", "릴스 마케팅", "SNS 마케팅",
    "맘카페 바이럴", "맘카페 마케팅",
    "카페 배포", "대표 카페 배포", "카페 배포 월 단위",
    "카카오맵 마케팅", "카카오맵 매장 정보 정비",
    "소상공인 마케팅", "자영업자 마케팅", "소상공인 광고",
    "카페 마케팅", "음식점 마케팅", "미용실 마케팅",
    "학원 마케팅", "병원 마케팅", "피부과 마케팅",
    "네이버 블로그 대행", "플레이스 최적화", "구글 지도 마케팅",
  ],
  alternates: { canonical: "https://www.harangmarketing.com/services" },
  openGraph: {
    title: "진단 후 업종에 맞춰 고르는 마케팅 서비스 · 하랑마케팅",
    description: "플레이스 SEO부터 블로그·SNS까지. 10년 노하우 기반 업종별 맞춤 마케팅 서비스. 견적은 진단 후 산정, 상담 무료.",
    url: "https://www.harangmarketing.com/services",
    images: [ogImage()],
  },
};

/**
 * 상세페이지 카드 커버 — 한 장이 아니라 여러 장을 세워 넣는다.
 *
 * 상세페이지는 세로로 긴 물건(560x747)인데 카드 커버는 가로로 넓다(960x176).
 * 한 장을 폭에 맞추면 높이가 1229px 로 늘어나 위쪽 14% 만 남고,
 * 상세페이지의 위쪽 14% 는 배경 여백이라 화면에는 빈 띠만 보인다.
 * 칸을 좁게 나누면 같은 높이에서 잘리는 비율이 준다 — 5칸이면 한 장당 90% 가 보인다.
 *
 * 고르는 기준은 종류마다 첫 건이다. 앞에서부터 자르면 생활·리빙만 나와서
 * 생활용품만 하는 곳으로 읽힌다.
 */
/**
 * 커버 한 칸의 규격. 실치수를 같이 들고 다닌다.
 * 예전에는 렌더 쪽에 560x747 을 박아 뒀는데, 그 값은 상세페이지 썸네일 하나에만 맞는 값이라
 * 비율이 다른 커버를 걸면 그 커버가 잘렸다.
 */
type ServiceCover = { src: string; alt: string; w: number; h: number };

const DP_COVERS: ServiceCover[] = DP_CATEGORIES.slice(0, 5).map((c) => ({
  src: `/detail-ref/${c.works[0].slug}.jpg`,
  alt: `${c.works[0].title} 상세페이지 실제 납품 화면`,
  w: 560,
  h: 747,
}));

/**
 * 하이라이트 세팅 카드 커버 — 곳마다 대표 한 장씩 다섯 곳.
 *
 * 상세페이지 커버와 달리 여기는 비율이 두 가지 섞여 있다.
 * 커버는 720x720(1:1) 이고 스토리는 540x960(9:16) 이다.
 * 그래서 이 카드만 object-contain 으로 받는다(coverFit). object-cover object-top 으로 받으면
 * 1:1 커버의 좌우가 잘려 나가 커버 안에 넣은 글자가 날아간다.
 *
 * 업체명은 어떤 업체든 화면에 올리지 않는다 (대표 지시 2026-09-07 (월)).
 * alt 도 데이터가 만든 문장을 그대로 쓴다. 여기서 상호를 붙이지 않는다.
 */
const HL_CARD_COVERS: ServiceCover[] = HL_COVERS.slice(0, 5).map((c) => ({
  src: c.src,
  alt: c.alt,
  w: c.w,
  h: c.h,
}));

/**
 * 사진촬영 카드 커버 — 음식 셋 · 공간 둘.
 *
 * 가로로 담기는 자리라 세로 컷은 넣지 않았다. 세로를 눕히면 위아래가 잘려
 * 무엇을 찍은 컷인지 알아볼 수 없게 된다.
 * alt 는 데이터가 가진 장면 문장을 그대로 쓴다 (협력사 상호는 쓰지 않는다).
 */
const PHOTO_CARD_COVERS: ServiceCover[] = [
  FOOD_SHOTS[0],
  FOOD_SHOTS[1],
  FOOD_SHOTS[2],
  SPACE_SHOTS[0],
  SPACE_SHOTS[7],
].map((s) => ({ src: s.src, alt: s.alt, w: s.w, h: s.h }));

/** 홈페이지 제작 카드 커버 — 업종이 겹치지 않게 시안 다섯 장. 전부 가상 업체 시안이라 alt 에 그렇게 적는다. */
const HP_CARD_COVERS: ServiceCover[] = HP_DRAFTS.filter((d, i, a) => a.findIndex((x) => x.industry === d.industry) === i)
  .slice(0, 5)
  .map((d) => ({ src: hpThumb(d.slug), alt: `${d.industry} 업종 홈페이지 시안 (가상 업체)`, w: 560, h: 350 }));

const SERVICES = [
  {
    id: "powercontents", icon: ScrollText, color: "bg-blue-700", tag: "광고 원고", href: "/services/powercontents",
    title: "파워컨텐츠 원고 설계·검수", subtitle: "원고 설계와 검수 대응",
    desc: "파워컨텐츠 광고에 사용할 원고를 설계하고 검수 대응을 준비합니다.",
    timeline: "키워드와 원고 범위를 확인한 뒤 일정 협의",
    deliverables: [{ label: "기준 단가", value: "1편 5만원", note: "부가세 별도" }, { label: "진행 범위", value: "원고 설계·검수 대응", note: "광고 집행은 별도 협의" }],
    features: ["광고에 사용할 원고 설계", "검수 대응을 위한 문구 확인"],
    rec: "파워컨텐츠 광고에 사용할 원고가 필요한 매장", result: "작업 범위를 정한 뒤 진행합니다",
  },
  {
    id: "naver-ads", icon: BarChart3, color: "bg-blue-700", tag: "광고 운영",
    title: "네이버 광고 세팅·운영대행", subtitle: "광고 설정과 운영 관리",
    desc: "네이버 광고 세팅과 운영을 대행합니다. 운영대행비와 광고 집행비를 구분해 안내합니다.",
    timeline: "광고 계정과 진행 범위를 확인한 뒤 일정 협의",
    deliverables: [{ label: "운영대행 기준", value: "월 15만원", note: "부가세 별도" }, { label: "광고 집행비", value: "실비 별도", note: "집행 예산은 상담 시 협의" }],
    features: ["네이버 광고 세팅", "광고 운영대행", "집행비와 운영대행비 구분 안내"],
    rec: "광고 설정과 운영 관리가 필요한 매장", result: "광고비와 대행비를 구분해 견적을 안내합니다",
  },
  {
    id: "cafe-distribution",
    icon: Layers,
    color: "bg-blue-700",
    tag: "배포",
    title: "블로그 원고 · 카페 게시 대행",
    subtitle: "원고 작성과 게시 URL 보고",
    desc: "업체의 실제 서비스에 맞는 원고를 작성하고 홍보가 허용된 블로그와 카페에 확정한 건수만큼 게시한 뒤 주소를 보고합니다. 검색 노출이나 순위는 약속하지 않으며, 25일 기록 기준의 통합검색 월 관리는 별도 상품으로 진행합니다.",
    timeline: "게시 시작 3~7일 · 수량별 순차 진행",
    deliverables: [
      { label: "패키지", value: "10건 · 30건", note: "원고 포함 · 직접 제공" },
      { label: "1건당 단가", value: `${won(UNIT_MIN)}~`, note: "부가세 별도" },
      { label: "결과 보고", value: "게시 URL 전체", note: "노출 위치 확인 포함" },
    ],
    features: [
      "업종·지역·목표 키워드 기준 카페 배정",
      "원고 작성 포함 / 미포함 선택 가능",
      "카페별 게시 형식에 맞춘 편집 처리",
      "게시 완료 후 전체 URL 정리 보고",
      "수량 분할 진행 협의 가능",
      "통합검색 월 관리 (25일 기록 기준 · 월 300,000원부터) 별도 진행",
      "회원이 많고 매일 새 글이 올라오는 대표 카페 배정",
    ],
    rec: "블로그 노출은 되는데 검색 유입이 더 필요한 매장",
    // 결과 칸은 하랑이 넘기는 납품 항목으로 적는다. 레퍼런스 캡처 숫자는 레퍼런스 페이지에서만 보여 주고,
    // 커버는 캡처 대신 브랜드 밴드로 둔다 (광고 착지 화면 문구 정리)
    result: "게시 글 주소 전체 정리 보고 · 노출 위치 확인 포함",
    href: "/services/cafe-distribution",
  },
  {
    // 팔고 있는데 이 목록에 없어서 /services 에서 상세페이지로 가는 길이 없었다.
    // 단가·일정은 /services/detail-page 의 PLANS 가 정본이고 여기는 요약만 적는다 (C-22).
    id: "detail-page",
    icon: LayoutTemplate,
    color: "bg-blue-700",
    tag: "상세페이지",
    title: "스마트스토어 상세페이지 제작",
    subtitle: "기획 · 카피 · 이미지까지 9단 구성",
    desc: "상품은 좋은데 안 팔리는 이유는 대부분 순서입니다. 어디서 멈추게 하고 어디서 불안을 지우고 어디서 결제로 넘길지를 먼저 짜고, 그 순서대로 이미지를 만듭니다.",
    timeline: "기획형 3영업일 · 제작형 7영업일",
    deliverables: [
      { label: "기획형", value: "150,000원", note: "구성표·카피·프롬프트" },
      { label: "제작형", value: "350,000원", note: "상세 이미지까지 · 기본 추천" },
      { label: "제작+영상형", value: "550,000원", note: "첫 화면 GIF·숏폼 포함" },
    ],
    features: [
      "9단 섹션 구성표 · 무엇을 몇 번째에 보여줄지 먼저 정합니다",
      "섹션별 카피 작성 (확정 안 된 값은 비워 두고 여쭙습니다)",
      "9단 상세 이미지 제작 · 모바일 가독성 판 별도 조정",
      "슬라이스 파일 납품 · 받아서 바로 올리시면 됩니다",
      "문구 수정 2회 · 이미지 재생성 컷당 3회 포함",
      "식품은 표시사항(원재료·용량·소비기한·보관·제조원) 확인 후 등록",
    ],
    rec: "상품은 올렸는데 들어와서 그냥 나가는 스토어",
    result: `실물 상세페이지 ${DP_TOTAL}건 · 원본 ${DP_CUTS}컷 전체 공개 (잘라낸 구간 없음)`,
    href: "/services/detail-page",
    covers: DP_COVERS,
    coverFit: "cover" as const,
    coverBadge: "실제 납품 화면",
  },
  {
    // 대행 서비스가 아니라 자사 프로그램. 상세는 /studio 에 따로 있다.
    id: "studio",
    icon: Palette,
    color: "bg-slate-800",
    tag: "프로그램",
    title: "하랑 스튜디오 · 사진·영상 정리 프로그램",
    subtitle: "동영상 GIF 변환 · 사진 세탁 · 워터마크",
    desc: "대행 일을 하면서 매일 겪는 문제라 직접 만들어 쓰는 윈도우 프로그램입니다. 현장 사진 100장을 1분 안에 정리하고, 영상은 끌어다 놓으면 움짤이 됩니다. 파일을 외부에 올리지 않고 내 컴퓨터 안에서 처리합니다.",
    timeline: "설치 없음 · 받는 즉시 사용",
    deliverables: [
      { label: "무료 체험", value: "100장", note: "기능 제한 없음" },
      { label: "한 달", value: "4,900원", note: "1년 39,000원" },
      { label: "대행사 PC 3대", value: "89,000원", note: "1년 기준" },
    ],
    features: [
      "동영상 GIF 변환 · 목표 용량 자동 맞춤",
      "사진 100장 일괄 보정 (장마다 다른 값)",
      "영상에서 사진 뽑기 · 장면 전환 감지",
      "시공 전후 사진 한 장으로 붙이기",
      "매장명·연락처 워터마크",
      "영상 용량 줄이기 (카톡·블로그 규격)",
    ],
    rec: "현장 사진이 매일 쌓이는 대행사·청소·인테리어·설비",
    result: "사진 100장 정리 2시간 → 1분 (사무실 노트북 실측)",
    href: "/studio",
    cover: "/studio/shot-files.png",
    coverAlt: "하랑 스튜디오 사진 선택 화면",
    coverBadge: "프로그램 화면",
  },
  {
    // 대행 서비스가 아니라 자사 프로그램. 상세는 /kakao-sender 에 따로 있다.
    // 가격 숫자는 app/lib/kakao-sender.ts (판매설정.json 옮김) 에서 가져온다. 여기에 박지 않는다.
    // 커버는 실제 프로그램 캡처(1.6.0 · 예시 방 이름). 카드 머리와 태그 배지는 s.color 단색 배경이다
    // (WDS · 그라데이션 금지 · 2026-10-03 전 카드를 bg-* 단색으로 바꿈).
    id: "kakao-sender",
    icon: MessageSquare,
    color: "bg-slate-800",
    tag: "프로그램",
    title: "카톡 예약 발송 · 단체 · 예약 발송 프로그램",
    subtitle: "거래처 · 고객 · 회원 카톡방에 한 번에, 원하는 시각에",
    desc: "PC 카카오톡 채팅방 여러 곳에 같은 글을 한 번에 보내거나 원하는 시각에 예약해 보내는 윈도우 프로그램입니다. 명절 인사와 공지를 방마다 붙여 넣지 않아도 됩니다. 휴대폰에서는 쓸 수 없고 PC 에서 내려받습니다.",
    timeline: "PC 에서 내려받아 바로 사용",
    deliverables: [
      { label: "무료 체험", value: `${KS.trialCount}건`, note: "방 1곳에 한 번이 1건" },
      { label: "명절 한 달권", value: `${ksWon(KS_PLANS[0].price)}원`, note: `1년 ${ksWon(KS_PLANS[2].price)}원 · 부가세 별도` },
      { label: "사무실 PC 3대", value: `${ksWon(KS_PLANS[3].price)}원`, note: "1년 기준" },
    ],
    features: [
      "여러 방에 같은 글 한 번에 보내기",
      "예약 발송 (한 번 · 매일 · 매주)",
      "예약 목록에서 시각 · 방 · 글 바로 고치기",
      "사진 · 동영상 · 파일 같이 보내기",
      "방 목록 저장 · 그룹으로 묶기",
      "보내기 전 확인 · 예약은 승인해야 발송",
    ],
    rec: "설 · 추석 · 연말에 거래처 방 여러 곳으로 인사를 보내는 보험 · 딜러 · 대행사",
    result: `정품키 없이 ${KS.trialCount}건 무료 체험 · 자동 결제 없음`,
    href: "/kakao-sender",
    cover: "/kakao-sender/shot-send.png",
    coverAlt: "카톡 예약 발송 보내기 화면. 보낼 카톡방을 고르고 글과 예약 시각을 넣는 화면",
    coverBadge: "프로그램 화면",
  },
  {
    id: "blog",
    href: "/services/blog-marketing",
    icon: BookOpen,
    color: "bg-blue-600",
    tag: "SEO",
    title: "블로그 마케팅",
    subtitle: "키워드 원고 → 원고 작성·게시 주소 보고",
    desc: "네이버 블로그 지역 키워드에 맞춰 원고를 작성하고 게시 주소를 보고하는 콘텐츠 마케팅입니다.",
    timeline: "첫 발행 1주 이내 · 이후 계약 물량대로 정기 발행",
    deliverables: [
      { label: "월 콘텐츠", value: "4~8건", note: "키워드 분석 기반" },
      { label: "SEO 최적화", value: "매 포스팅", note: "제목·본문·태그" },
      { label: "성과 리포트", value: "월 1회", note: "순위·조회수 포함" },
    ],
    features: [
      "업종·지역 키워드 분석 및 전략 수립",
      "업종·지역에 맞는 원고 작성",
      "사진·영상 첨부 고품질 콘텐츠",
      "경쟁사 블로그 분석 및 차별화",
      "월간 순위 변화 리포트 제공",
    ],
    rec: "네이버 검색으로 신규 고객을 유입하고 싶은 매장",
    result: "게시 URL 전체 공개 · 순위 변동 월간 리포트",
  },
  {
    id: "place",
    icon: MapPin,
    color: "bg-blue-700",
    tag: "플레이스",
    title: "네이버 플레이스 SEO",
    subtitle: "플레이스 정보 정비 → 지도 상단 노출 관리",
    desc: "지금 근처 맛집을 찾는 손님이 보는 네이버 지도·플레이스에서 매장 정보와 키워드를 정리하고, 잰 순위를 매월 리포트로 보고합니다.",
    timeline: "정보 최적화 1~2주 · 이후 오후 2~3시 순위 계측",
    deliverables: [
      { label: "플레이스 최적화", value: "초기 완성", note: "정보·사진·카테고리" },
      { label: "키워드 세팅", value: "20개 이상", note: "지역·업종·특징" },
      { label: "순위 모니터링", value: "주 1회", note: "측정일별 순위 기록" },
    ],
    features: [
      "플레이스 정보 빈칸 없이 채우는 최적화",
      "업종·지역·특징 키워드 세팅",
      "경쟁 분석 기반 차별화 전략",
      "사진 구성 및 업로드 가이드",
      "주간 순위 모니터링 및 조정",
    ],
    rec: "근처 검색으로 당장 찾아오는 고객이 필요한 매장",
    result: "오후 2~3시 순위 계측 · 밀린 날 원인까지 보고",
    href: "/services/place",
    // 플레이스 랜딩에도 가격이 없다. 기본 라벨(가격 보기)을 쓰면 없는 것을 약속하게 된다.
    hrefLabel: "플레이스 안내 보기",
  },
  {
    id: "review",
    icon: Star,
    color: "bg-blue-600",
    tag: "리뷰",
    title: "리뷰 마케팅 · 체험단",
    subtitle: "리뷰 요청 동선 → 리뷰 축적 · 답글 관리",
    desc: "체험단 모집부터 리뷰 답글 관리까지 맡습니다. 매장에 쌓인 후기와 답글이 처음 오는 손님의 결정을 돕습니다.",
    timeline: "체험단 시작 1~2주 · 리뷰 쌓기 1개월",
    deliverables: [
      { label: "체험단 모집", value: "회차당 5~30명", note: "원하시는 규모로 구성" },
      { label: "리뷰 포스팅", value: "체험단 전원", note: "블로그·플레이스" },
      { label: "리뷰 관리", value: "월 2회 점검", note: "답글 가이드 포함" },
    ],
    features: [
      "업종 맞춤 체험단 모집 및 관리",
      "블로그·플레이스·카카오맵 실제 이용 후기 안내",
      "체험단 안내자료·가이드 제작",
      "부정 리뷰 모니터링 및 대응 전략",
      "리뷰 답글 작성 대행",
    ],
    rec: "리뷰가 부족해 신규 고객 유입이 어려운 매장",
    // 결과 칸은 납품 항목으로 적는다 (광고 착지 화면 문구 정리)
    result: "리뷰 월 2회 점검 · 답글 가이드 포함",
    href: "/services/review",
    // 체험단 랜딩에는 가격이 없다. 기본 라벨(가격 보기)을 그대로 쓰면 없는 것을 약속하게 된다.
    hrefLabel: "체험단 안내 보기",
  },
  {
    id: "sns",
    icon: AtSign,
    color: "bg-blue-700",
    tag: "SNS",
    title: "SNS · 인스타그램 마케팅",
    subtitle: "릴스 · 피드 운영 → 예약 동선 연결",
    desc: "인스타그램 계정 육성부터 맘카페 입소문 마케팅까지. 손님이 방문 전에 확인하는 채널을 꾸준히 채웁니다.",
    timeline: "콘텐츠 세팅 1~2주 · 이후 정기 발행",
    deliverables: [
      { label: "콘텐츠 제작", value: "월 12~16건", note: "피드·스토리·릴스" },
      { label: "맘카페 바이럴", value: "월 4~8건", note: "업종별 맞춤 전략" },
      { label: "게시물 구성·발행", value: "해시태그 최적화", note: "지역·업종 태그" },
    ],
    features: [
      "인스타그램 계정 육성 및 세팅",
      "하이라이트 커버 제작 · 업종에 맞춘 칸 순서 설계",
      "피드·스토리·릴스 콘텐츠 제작",
      "게시물 구성과 발행 계획",
      "맘카페·지역 커뮤니티 자연스러운 입소문",
      "콘텐츠 공유·확산",
    ],
    rec: "비주얼 중심 업종(카페·미용·음식점)이나 주부 고객 타겟 매장",
    result: `발행 수와 도달을 월간 리포트로 공개 · 하이라이트 세팅 실물 ${HL_SHOP_TOTAL}곳 ${HL_TOTAL}장 공개`,
    href: "/services/instagram",
    // 하이라이트 세팅은 마지막 불릿 한 줄에 묻혀 있었다. 파는 물건인데 화면이 없었다는 뜻이라
    // 상세페이지 카드와 같은 방식으로 실물 커버를 건다 (2026-09-07 (월)).
    covers: HL_CARD_COVERS,
    coverFit: "contain" as const,
    coverBadge: "실제 세팅 화면",
    // 인스타 랜딩에도 가격이 없다. 기본 라벨(가격 보기)을 쓰면 없는 것을 약속하게 된다.
    hrefLabel: "인스타 안내 보기",
  },
  {
    id: "kakaomap",
    icon: Navigation,
    color: "bg-blue-600",
    tag: "카카오맵",
    title: "카카오맵 매장 관리",
    subtitle: "카카오맵 매장 정보 정비 → 카카오 검색 노출 관리",
    desc: "카카오맵에서 매장을 찾는 고객이 정보를 확인할 수 있도록 매장 등록과 정보, 사진을 관리합니다.",
    timeline: "등록·최적화 1~2주 · 이후 월간 리포트",
    deliverables: [
      { label: "매장 관리 등록", value: "대행 처리", note: "등록·최적화 1~2주" },
      { label: "카카오맵 리뷰", value: "실유저 기반", note: "실사용자 후기" },
      { label: "트렌드 랭킹", value: "정보 정비 관리", note: "매장 정보·사진 정비" },
    ],
    features: [
      "카카오맵 매장 관리 등록 대행",
      "매장 정보 완성도 최적화",
      "실유저 기반 실제 이용 후기 안내",
      "매장 정보와 사진 정비",
      "카카오 플레이스 통합 관리",
    ],
    rec: "카카오맵으로 유입되는 고객을 놓치고 싶지 않은 매장",
    result: "네이버에서 놓친 검색을 카카오에서 받는 구조",
  },
  {
    id: "homepage",
    icon: Globe2,
    color: "bg-blue-700",
    tag: "홈페이지",
    title: "홈페이지 제작",
    subtitle: "업종별 시안을 먼저 보고 고르는 제작",
    desc: `업종 ${HP_STATS.industries}개 · 시안 ${HP_STATS.drafts}개를 미리 만들어 두었습니다. 마음에 드는 시안을 고르시면 대표님 업체의 상호 · 사진 · 문구로 바꿔 넘겨 드리고, 네이버 통합검색과 AI 답변 노출 기본 세팅까지 넣습니다.`,
    timeline: "계약금 입금일부터 15영업일",
    href: "/services/homepage",
    covers: HP_CARD_COVERS,
    deliverables: [
      { label: "제작비", value: "1,000,000원부터", note: "부가세 별도 · 3단 구성" },
      { label: "월 관리", value: "선택", note: "오픈 후 3개월 오류 수정 무상" },
      { label: "시안", value: `${HP_STATS.drafts}개`, note: "업종 · 무드별로 직접 눌러 보기" },
    ],
    features: ["업종별 시안 중에서 선택", "상호 · 사진 · 문구 교체", "문의 전환 동선", "검색 노출 기본 세팅"],
    rec: "블로그 말고 우리 업체 이름으로 된 홈페이지가 필요한 대표님",
    result: "고른 시안 그대로의 구조로 15영업일 안에 넘겨 받는 홈페이지",
  },
  {
    id: "startup",
    icon: Palette,
    color: "bg-blue-800",
    tag: "창업지원",
    title: "창업 지원 · 홈페이지형 블로그",
    subtitle: "개업 전 온라인 세팅 → 오픈 첫날 정보 준비 완료",
    desc: "개업 준비부터 브랜딩까지. 홈페이지형 블로그 제작, 로고·명함 디자인, 메뉴판 제작을 원스텝으로 해결합니다.",
    timeline: "제작 기간 1~2주 · 오픈 전 완성 가능",
    deliverables: [
      { label: "홈페이지형 블로그", value: "전문 디자인", note: "네이버 블로그 기반" },
      { label: "로고·명함 디자인", value: "맞춤 제작", note: "브랜드 아이덴티티" },
      { label: "메뉴판 제작", value: "인쇄 가능 파일", note: "PDF·인쇄본" },
    ],
    features: [
      "홈페이지형 블로그 디자인 제작",
      "로고·명함·간판 디자인 지원",
      "메뉴판·전단지 제작",
      "플레이스·카카오맵 초기 세팅",
      "개업 전 온라인 인지도 빌드업",
    ],
    rec: "개업 예정이거나 브랜드를 새로 만들고 싶은 대표님",
    result: "개업 첫날 온라인 정보가 다 갖춰진 매장 세팅",
  },
  {
    // 2026-09-21 대표 지시로 신설. 촬영 협력사와 함께 진행한다.
    id: "photo",
    icon: Camera,
    color: "bg-blue-700",
    tag: "촬영",
    title: "매장 사진촬영",
    subtitle: "음식 사진 · 매장 공간 촬영",
    desc: "음식점 메뉴와 시설 공간을 촬영합니다. 상품별 제공 컷과 촬영 시간, 모델 유무를 비교하고 실제 촬영 사례를 확인할 수 있습니다.",
    timeline: "상품별 작업 기간 5~9일 · 촬영 일정 협의",
    deliverables: [
      { label: "음식점 촬영", value: FOOD_PLANS.map(p => `${p.price / 10000}만원`).join(" · "), note: "상품별 구성 · 부가세 별도" },
      { label: "시설·숙박 촬영", value: STAY_PLANS.map(p => `${p.price / 10000}만원`).join(" · "), note: "모델 유무·면적별 구성 · 부가세 별도" },
      { label: "보정·수정", value: "상품별 보정 · 수정 2회", note: "시설 촬영은 A컷 보정" },
    ],
    features: [
      "대표 메뉴 단품 컷과 상차림 컷을 나눠 촬영",
      "가로 컷과 세로 컷을 같이 확보해 채널마다 재단",
      "매장 외관 · 홀 · 창가 자리 · 저녁 조명 분리 촬영",
      "네이버 플레이스 등록 항목에 맞춘 컷 목록 사전 확인",
      "영업에 지장이 없는 시간대로 일정 협의",
      "촬영 협력사와 함께 진행",
    ],
    rec: "휴대폰으로 찍어 메신저로 넘긴 사진만 가지고 계신 매장",
    result: "채널마다 다시 찍지 않고 한 번 촬영으로 나눠 쓰는 구조",
    href: "/services/photo",
    covers: PHOTO_CARD_COVERS,
    coverBadge: "실제 촬영 컷",
    hrefLabel: "촬영 서비스 안내",
  },
];

const FAQS = [
  {
    q: "계약 기간은 최소 얼마나 되나요?",
    a: "월 단위 계약이 기본이고 중도 해지 위약금이 없습니다. 다만 마케팅을 처음 하시는 분은 기초공사와 인테리어 같은 기본 세팅부터 잡아야 해서 2~3개월 이상은 진행하셔야 합니다.",
  },
  {
    q: "계약하면 바로 시작하나요?",
    a: "계약 당일 온보딩 미팅 후 즉시 착수합니다. 초기 분석(업종·경쟁사·키워드)은 1주일 내 완료하고 2주차부터 콘텐츠가 발행됩니다.",
  },
  {
    q: "결과가 안 나오면 어떻게 되나요?",
    a: "매월 성과 리포트를 함께 검토하며, 목표 미달 시 전략을 즉시 조정합니다. 단, 초기 기대치는 현실적으로 맞춰드립니다.",
  },
  {
    q: "여러 서비스를 함께 하면 할인되나요?",
    a: "여러 서비스를 함께 진행할 때는 필요한 채널과 물량을 조합해 견적을 안내합니다. 서비스별 비용과 포함 범위를 상담에서 확인하실 수 있습니다.",
  },
  {
    q: "지역 제한이 있나요?",
    a: "전국 어디서나 비대면으로 진행합니다. 현장 촬영이 필요한 경우에는 사전에 안내드리고 별도 협의합니다.",
  },
  {
    q: "직접 담당자가 매번 바뀌지 않나요?",
    a: "대표가 모든 프로젝트에 직접 참여합니다. 상담한 사람이 계약부터 운영까지 그대로 맡습니다.",
  },
  {
    q: "작은 매장도 효과가 있나요?",
    a: "매장 규모보다 업종, 상권 경쟁, 현재 노출 상태에 따라 필요한 작업이 달라집니다. 진단 후 예산 안에서 우선 진행할 채널과 확인할 지표를 제안합니다.",
  },
  {
    q: "지금 마케팅이 잘 되고 있는지 모르겠어요.",
    a: "무료 진단 상담을 통해 현재 노출 순위·경쟁사 현황·리뷰 현황을 분석해드립니다. 진단 결과만으로도 개선 방향이 보입니다. 비용은 0원입니다.",
  },
];

const INDUSTRY_LINKS = [
  { name: "카페·베이커리", href: "/services/cafe", color: "from-blue-600 to-orange-500", desc: "플레이스 SEO · 포토리뷰 · 인스타" },
  { name: "병원·의원", href: "/services/clinic", color: "from-blue-500 to-blue-700", desc: "의료광고 심의 확인 · 블로그 · 플레이스 SEO" },
  { name: "뷰티·네일", href: "/services/beauty", color: "from-pink-500 to-rose-600", desc: "릴스 · 비포애프터 · 리뷰 관리" },
  { name: "음식점·식당", href: "/services/restaurant", color: "from-orange-500 to-red-500", desc: "플레이스 SEO · 리뷰 · 맘카페" },
  { name: "학원·교육", href: "/services/academy", color: "from-green-500 to-emerald-600", desc: "맘카페 · 블로그 · 플레이스 SEO" },
  { name: "쇼핑몰·소매점", href: "/services/shopping", color: "from-purple-500 to-purple-700", desc: "스마트스토어 · 인스타 · 오프라인" },
];

/* ────────────────────────────────────────────────────────────
   가격 산출 근거 — 아래 숫자는 전부 실제로 나간 견적서에서 가져온다.
   단가를 바꾸면 CALC_EXAMPLES 의 합계도 같이 맞춘다. 월 금액 구간은 만들지 않는다 — HOW_WE_COMPOSE 참조.
   원본: E:/하랑/{미미샵|영삼이네우정소갈비|이지클린}/build_quote_hwp.py
   배포 두 줄과 두 번째 예시는 lib/cafe-distribution.ts 에서 파생한다 (2026-09-07 (월) 매입 단가 기준 갱신).
   ──────────────────────────────────────────────────────────── */

const UNIT_PRICES: { item: string; unit: string; price: string; note?: string }[] = [
  { item: "플레이스 SEO 최적화", unit: "1회 세팅", price: "10~15만원", note: "업종마다 다릅니다. 음식점 · 카페는 메뉴를 전부 넣고 메뉴마다 설명을 써야 해 작업이 더 많습니다." },
  { item: "대표키워드 정보 정비·계측", unit: "키워드 1개 · 월", price: "키워드 확인 후 안내" },
  { item: "블로그 관리대행", unit: "1편", price: "평균 3~5만원", note: "업종마다 다릅니다. 병원 · 법률처럼 단가가 높은 키워드는 확인할 것이 많아 따로 안내합니다." },
  { item: "블로그 원고·게시 대행", unit: "1건", price: won(BLOG_UNIT_WITH_COPY), note: `원고 작성 포함 10건 패키지 기준. 원고를 직접 주시면 ${won(BLOG_UNIT_WITHOUT_COPY)}.` },
  { item: "카페 단건 배포 (등급별)", unit: "1건", price: `${won(CAFE_TIER_MIN)}~`, note: `카페 등급별 ${CAFE_TIERS.map((t) => t.price.toLocaleString("ko-KR")).join(" · ")}원. 원고 작성까지 맡기시면 건당 ${won(CAFE_COPY_FEE)} 추가.` },
  // 단가표 행을 고치면 llms.txt 단가표도 같이 맞춘다
  { item: "체험단", unit: "1회 (5~30명)", price: "상담 시 안내", note: "업종과 인원에 따라 달라집니다. 병·의원은 체험단을 권하지 않습니다." },
  { item: "파워컨텐츠 원고 설계·검수 대응", unit: "1편", price: "5만원" },
  { item: "홈페이지형 블로그 디자인 STANDARD", unit: "1회", price: "10만원", note: "PC 전용입니다." },
  { item: "홈페이지형 블로그 디자인 DELUXE", unit: "1회", price: "20만원", note: "PC와 모바일, 위젯 15개 이하입니다." },
  { item: "홈페이지형 블로그 디자인 PREMIUM", unit: "1회", price: "30만원", note: "섹션과 위젯 수에 제한이 없습니다." },
  { item: "홈페이지 제작", unit: "건별", price: "1,000,000원부터", note: "부가세 별도 · 업종별 시안은 /services/homepage" },
  { item: "네이버 광고 세팅·운영대행", unit: "월", price: "15만원" },
  { item: "키워드 설계 · 리뷰 동선 · 순위 모니터링", unit: "월", price: "계약 시 포함" },
];

/** 두 번째 산출 예시의 기준 구성 — 10건 혼합형 (최블 5건 + 카페 5건) */
const MIX10 = PACKAGES.find((p) => p.size === 10 && p.kind === "혼합형") ?? PACKAGES[0];

const CALC_EXAMPLES: {
  title: string;
  sub: string;
  lines: { label: string; calc: string; amount: string }[];
  total: string;
  note: string;
}[] = [
  {
    title: "플레이스만 잡으면 되는 경우",
    sub: "대표키워드가 이미 3위여서 정보 정비와 계측 범위를 정했던 고깃집",
    lines: [
      { label: "플레이스 SEO 최적화", calc: "15만원 × 1회", amount: "150,000" },
      { label: "대표키워드 정보 정비·계측", calc: "키워드 확인 후 안내", amount: "0" },
      { label: "리뷰 동선 · 소식/쿠폰 · 순위 모니터링", calc: "계약 포함", amount: "0" },
    ],
    total: "150,000",
    note: "부가세 별도 금액입니다. 대표키워드 관리는 키워드를 확인한 뒤 금액을 안내드려 합계에 넣지 않았습니다.",
  },
  {
    title: "글을 퍼뜨리기만 하면 되는 경우",
    sub: `플레이스를 쓸 수 없어 검색 유입만 만들면 되는 해외 매장 · ${MIX10.size}건 혼합형 구성 예시`,
    lines: [
      { label: "블로그 · 카페 통합 배포 (패키지)", calc: `${packageLabel(MIX10)} · 원고 작성 포함`, amount: MIX10.withCopy.toLocaleString("ko-KR") },
      { label: "키워드 설계 · 촬영 가이드", calc: "계약 포함", amount: "0" },
    ],
    total: MIX10.withCopy.toLocaleString("ko-KR"),
    note: "부가세 별도 금액입니다. 패키지 금액은 카페 배포 상세 가격표와 같습니다.",
  },
  {
    title: "바닥부터 만들어야 하는 경우",
    sub: "리뷰 0건 · 가격표 13개 중 10개가 공란이던 청소업체",
    lines: [
      { label: "플레이스 SEO 최적화", calc: "10만원 × 1회", amount: "100,000" },
      { label: "홈페이지형 블로그 디자인 DELUXE", calc: "20만원 × 1회", amount: "200,000" },
      { label: "블로그 관리대행", calc: "평균 4만원 × 10편", amount: "400,000" },
      { label: "파워컨텐츠 원고 설계·검수", calc: "5만원 × 1편", amount: "50,000" },
      { label: "네이버 광고 세팅·운영대행", calc: "계약 포함", amount: "0" },
    ],
    total: "750,000",
    note: "부가세 별도 금액입니다. 1회성 세팅비가 빠지는 2개월차부터 월 450,000원",
  },
];

/**
 * 월 금액을 구간으로 묶어 걸어두지 않는다 (대표 지시 2026-08-23).
 * 업체마다 출발점과 물량이 달라 '월 얼마' 를 먼저 정해두면 매장을 그 금액에 맞추게 된다.
 * 대신 금액이 나오기까지의 순서를 공개한다 — 항목이 정해지면 금액은 계산의 결과다.
 */
const HOW_WE_COMPOSE: { step: string; title: string; body: string }[] = [
  {
    step: "현황 진단",
    title: "지금 비어 있는 칸부터 찾습니다",
    body: "리뷰 수 · 가격표 · 사진 · 현재 순위 · 경쟁 매장을 먼저 확인합니다. 이미 갖춰져 있는 항목에는 비용을 붙이지 않습니다.",
  },
  {
    step: "항목 선별",
    title: "꼭 필요한 것만 남깁니다",
    body: "채널을 전부 돌리는 게 정답이 아닙니다. 그 업종의 손님이 실제로 지나는 검색 경로에 있는 항목만 남기고 나머지는 물립니다.",
  },
  {
    step: "물량 조정",
    title: "양은 상권 경쟁도에 맞춥니다",
    body: "같은 블로그여도 경쟁이 촘촘한 상권은 편수가 올라가고 여유 있는 상권은 내려갑니다. 예산이 정해져 있으면 항목보다 물량을 먼저 조정합니다.",
  },
  {
    step: "견적 산출",
    title: "고른 항목만 더합니다",
    body: "필요 없는 항목까지 묶은 패키지를 권하지 않습니다. 항목과 물량이 정해지면 금액은 그 계산의 결과로 나옵니다.",
  },
];

const INDUSTRY_PRICE_DIFF: { industry: string; behavior: string; channel: string; volume: string }[] = [
  { industry: "음식점 · 뷔페", behavior: "지금 근처에서 먹을 곳을 찾는다", channel: "플레이스 SEO · 블로그/카페 배포", volume: "경쟁 상권은 배포 월 30건까지" },
  { industry: "카페 · 베이커리", behavior: "사진을 보고 갈 곳을 정한다", channel: "플레이스 · 인스타 · 광고", volume: "인스타 발행 월 8~20건" },
  { industry: "청소 · 시공", behavior: "문제가 생겼을 때 검색한다", channel: "블로그 · 파워링크", volume: "블로그 월 10~15편" },
  { industry: "뷰티 · 가발", behavior: "오래 비교하고 후기부터 본다", channel: "블로그 · 인스타 릴스", volume: "블로그 10편 + 릴스/피드 주 2회" },
  { industry: "레저 · 숙박", behavior: "주말과 시즌에 몰린다", channel: "파워링크 · 플레이스", volume: "성수기에 광고 예산 집중" },
];

const WHY_PRICE_DIFFERS: { title: string; body: string }[] = [
  {
    title: "출발점이 다릅니다",
    body: "리뷰가 0건이고 가격표가 비어 있으면 세팅부터 해야 합니다. 실제로 첫 달 750,000원이던 견적이 세팅이 끝난 2개월차에 450,000원으로 내려갔습니다 (부가세 별도). 이미 갖춰진 매장은 이 비용이 아예 붙지 않습니다.",
  },
  {
    title: "지금 순위가 다릅니다",
    body: "이미 3위인 매장을 1~2위로 밀어올리는 일과, 노출이 아예 없는 매장을 처음 올리는 일은 들어가는 물량이 다릅니다. 앞의 경우는 플레이스 항목만 붙이고 끝났고, 뒤의 경우는 콘텐츠 물량이 함께 들어갑니다.",
  },
  {
    title: "상권 경쟁 밀도가 다릅니다",
    body: "같은 고깃집이어도 대형 매장이 몰려 있는 수도권 상권과 지방 동네 상권은 필요한 배포 건수가 다릅니다. 경쟁이 촘촘할수록 같은 순위를 유지하는 데 드는 콘텐츠 양이 늘어납니다.",
  },
  {
    title: "채널 수와 물량이 다릅니다",
    body: "단가가 채널별 · 건별로 붙습니다. 블로그를 평균 4만원으로 잡아도 월 4편과 월 15편은 440,000원 차이가 납니다. 게다가 그 단가 자체가 업종을 탑니다. 병원 · 법률처럼 단가가 높은 키워드는 따로 안내합니다. 플레이스만 하는 것과 블로그 · 카페 · 파워컨텐츠 · 광고를 같이 도는 것은 항목 수부터 다릅니다.",
  },
  {
    title: "심의와 계절이 다릅니다",
    body: "의료 · 법률처럼 심의를 통과해야 하는 업종은 원고 설계와 검수 대응에 공수가 더 붙습니다. 에어컨 청소처럼 3~6월에 검색이 몰리는 업종은 비수기에 기반을 깔아둬야 성수기에 노출을 받습니다.",
  },
];

const SERVICES_LD = {
  '@context': 'https://schema.org', '@type': 'ItemList', numberOfItems: SERVICES.length,
  itemListElement: SERVICES.map((service, index) => ({
    '@type': 'ListItem', position: index + 1,
    item: { '@type': isProgram(service.id) ? 'SoftwareApplication' : 'Service',
      name: service.title, description: service.desc,
      url: SITE.base + (PUBLIC_SERVICES.find(item => item.id === service.id)?.href ?? '/services#' + service.id),
    },
  })),
};

const SERVICES_PAGE_LD = [
  SERVICES_LD,
  faqLd(FAQS, SITE.base + "/services"),
  webPageLd({
    path: "/services",
    type: "CollectionPage",
    name: "서비스 | 하랑마케팅",
    description: ANSWER_SENTENCES.whatWeDo,
    dateModified: updatedAt("/services"),
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
  ]),
  // 아래 GlossarySection 렌더링과 짝을 이룸
  definitionsLd("/services"),
];

/* 2026-11-12 시안 3차 · 목록 페이지로 줄였다.
   서비스마다 한 줄(제목 · 부제 · 일정)만 두고, 받게 되는 것 · 포함 항목은 접힌 표 하나에 모았다 (가격 문자열은 그대로 DOM 에 남는다).
   카드 커버 사진 · 목적별 찾기(ServiceFinder) · 정답 상자(ServicePriceAnswer) · 용어 카드(GlossarySection) · 순위표(PlaceRankTable)는 걷었다.
   서비스 줄마다 id 를 그대로 단다 (/services#blog · #naver-ads · #kakaomap · #startup · #sns · #powercontents 를 다른 파일이 가리킨다). */
const GROUPS: { title: string; desc: string; ids: string[] }[] = [
  { title: "채널 서비스", desc: "검색과 지도, 리뷰와 SNS 에서 손님이 지나는 자리를 채웁니다.", ids: ["place", "blog", "cafe-distribution", "review", "sns", "powercontents", "naver-ads", "kakaomap"] },
  { title: "제작", desc: "홈페이지 · 상세페이지 · 사진 · 개업 준비물을 만들어 넘겨 드립니다.", ids: ["homepage", "detail-page", "photo", "startup"] },
  { title: "프로그램", desc: "대행 일을 하면서 직접 만들어 쓰는 윈도우 프로그램입니다.", ids: ["studio", "kakao-sender"] },
];

const byId = (id: string) => SERVICES.find((v) => v.id === id)!;

function ServiceRows({ ids }: { ids: string[] }) {
  return (
    <dl className={`${s.items} ${s.items1}`}>
      {ids.map(byId).map((v) => (
        <div key={v.id} id={v.id} style={{ scrollMarginTop: 96 }}>
          <dt>{"href" in v && v.href ? <Link href={v.href}>{v.title}</Link> : v.title}</dt>
          <dd>{v.subtitle} · {v.timeline}</dd>
        </div>
      ))}
    </dl>
  );
}

const PROMISES = [
  { title: "월 1회 성과 리포트", desc: "순위 · 리뷰 수 · 게시 URL 처럼 직접 잰 숫자를 매월 그대로 공유합니다. 좋은 숫자만 보여드리지 않습니다." },
  { title: "목표 미달 시 전략 즉시 조정", desc: "매월 순위 기록을 함께 보고, 목표에 못 미치는 부분은 다음 달 작업 계획에서 바로 고칩니다." },
  { title: "계약 강요 없는 상담", desc: "상담 후 진행이 어렵다고 판단되면 직접 말씀드립니다. 계약을 위한 과장된 약속은 드리지 않습니다." },
];

const TIMELINE = [
  { title: "1주차 · 분석 완료", desc: "업종·키워드·경쟁사 분석 리포트 + 전략 미팅" },
  { title: "2~4주 · 첫 콘텐츠 발행", desc: "블로그·플레이스 초기 콘텐츠 세팅, 첫 글 발행과 노출 위치 확인 시작" },
  { title: "1~2개월 · 순위 계측 공개", desc: "키워드별 순위를 정해진 시각에 재서 저장하고 월간 리포트로 확인" },
  { title: "3개월+ · 누적 콘텐츠 관리", desc: "발행물이 쌓이며 검색 유입 경로가 늘어나는 구간" },
];

const COMBOS = [
  { title: "한 채널 집중", desc: "이미 순위가 어느 정도 나오거나, 한 곳만 확실히 잡으면 되는 매장", services: ["플레이스 SEO 최적화 1회", "대표키워드 정보 정비·계측", "리뷰 유도 동선 설계", "순위 모니터링 · 경쟁업체 분석", "월 성과 리포트"], result: "대표 키워드 한 곳에 집중" },
  { title: "두세 채널 묶음 (기본 추천)", desc: "검색 유입부터 만들어야 하는 매장 · 기본으로 권해 드리는 구성", services: ["플레이스 SEO 최적화", "블로그 관리대행", "파워컨텐츠 원고 설계 · 검수 대응", "네이버 광고 세팅 · 운영대행", "월 성과 리포트"], result: "검색 유입부터 문의 동선까지 한 번에 세팅" },
  { title: "전 채널 통합", desc: "경쟁이 촘촘한 상권 · 지점이 여러 곳인 브랜드", services: ["블로그 · 카페 배포", "파워컨텐츠 원고", "플레이스 SEO · 주간 순위 관리", "인스타 피드 · 릴스", "광고 운영 (집행비 별도)", "주간 성과 리포트"], result: "지역 키워드 여러 구간 동시 공략" },
];

const COMPARE = [
  ["담당자", "신입·인턴 가능, 자주 교체", "대표가 직접 관리 · 누적 500건"],
  ["전략", "일괄 패키지 적용", "업종별 맞춤 전략 설계"],
  ["성과 보고", "월 1회 수치 리포트", "직접 잰 순위 기록 + 게시 URL 전체 전달"],
  ["소통", "이메일·티켓 시스템", "카카오 직통 · 하루 이내 답변"],
  ["계약", "6개월~1년 장기 의무", "월 단위 · 처음이면 2~3개월 이상"],
];

const block = { display: "block" } as const;

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={SERVICES_PAGE_LD} />
      <Header />
      <SianMain>
        <PageHead
          where="서비스"
          title={<>업종별로 다른 전략,<br />결과로 증명합니다</>}
          lead={<>핵심 마케팅 채널을 단독 또는 패키지로 운영합니다.<br />모든 서비스는 대표가 직접 관리합니다.</>}
          primary={{ href: "/contact", label: "무료 전략 진단 신청" }}
          link={{ href: "#pricing", label: "항목별 단가 보기" }}
          facts={[
            { value: "500건", label: "누적 프로젝트" },
            { value: "오후 2~3시", label: "순위 계측" },
            { value: `${companyYear()}년차`, label: "2020년 개업" },
            { value: "10년", label: "마케터 경력" },
          ]}
        />

        {/* AEO · 서비스 · 가격 정답 (예전 ServicePriceAnswer 의 speakable 문장 그대로 · 단가는 아래 #pricing 표) */}
        <AnswerRow
          question="하랑마케팅은 어떤 서비스를 얼마에 제공하나요?"
          answer="하랑마케팅은 패키지 정찰제가 아니라 항목별 단가를 조합해 견적을 냅니다. 광고 집행비는 실비로 별도이고 상담과 진단은 0원입니다."
        />

        {GROUPS.map((g, i) => (
          <Section key={g.title} soft={i % 2 === 0} title={g.title} desc={g.desc}>
            <ServiceRows ids={g.ids} />
            {g.ids.includes("photo") && (
              <LinkList links={[
                { href: "/services/photo/price", label: "사진촬영 가격표" },
                { href: "/services/photo/food", label: "음식점 촬영 사례" },
                { href: "/services/photo/stay", label: "시설·숙박 촬영 사례" },
              ]} />
            )}
          </Section>
        ))}

        <Section title="서비스별 받게 되는 것" desc="품목마다 받게 되는 것과 포함 항목입니다. 자세한 설명과 사례는 각 서비스 페이지에 있습니다.">
          <Fold summary="받게 되는 것 · 포함 서비스 · 일정 전체 보기">
            <Table
              label="서비스별 받게 되는 것"
              head={["서비스", "받게 되는 것", "포함 서비스", "일정"]}
              rows={SERVICES.map((v) => [
                <span key="t"><span className="font-semibold" style={block}>{v.title}</span><small style={block}>{v.rec}</small></span>,
                v.deliverables.map((d) => <span key={d.label} style={block}>{d.label} {d.value} ({d.note})</span>),
                v.features.join(" · "),
                v.timeline,
              ])}
            />
          </Fold>
        </Section>

        <Section
          soft
          title="업종별 페이지"
          desc="업종마다 효과적인 채널과 전략이 다릅니다. 내 업종 전용 페이지를 확인하세요"
        >
          <ItemList
            one
            items={[
              ...INDUSTRY_LINKS.map((l) => ({ title: l.name, desc: l.desc, href: l.href })),
              /* 병원 홈페이지 허브 (TR-0080 · 제목 C-01 · 설명 C-02 · 진우 10/27 통과) */
              { title: "병원 홈페이지 · AI 읽기 정비", desc: "진료 정보를 글자와 구조화 데이터로 정리하는 홈페이지 제작과 정비", href: "/services/homepage/clinic" },
              /* 병·의원 자료 · 본문은 /services/clinic/medical-ad-guide 가 정본이다 (HP/MED) */
              { title: "의료광고 심의 대상 판정 자료", desc: "병원 · 치과 · 한의원 광고에서 어느 채널이 사전심의 대상인지, 심의 없이 쓸 수 있는 항목이 무엇인지를 조문 번호와 함께 정리했습니다", href: "/services/clinic/medical-ad-guide" },
            ]}
          />
          <Fold summary="내 업종엔 어떤 서비스가 맞나요? 업종별로 성과가 가장 빠른 서비스를 먼저 추천합니다">
            <Table
              label="업종별 추천 서비스"
              head={["업종", "우선 추천", "추가 옵션", "기록"]}
              rows={INDUSTRY_RECS.map((r) => [r.industry, r.firstRec, r.recs.join(" · "), r.result])}
            />
          </Fold>
        </Section>

        {/* 순위 · 2026-09-17 (목) 대표 지시 : 진행사례뿐 아니라 서비스에도 보이게.
            광고 착지 화면이라 순위 사례 스위치를 따른다 (lib/landing-gate.ts) */}
        {LANDING_RANK_PROOF && (
          <RankSection label="업종별" title="키워드별 순위, 잰 그대로 적었습니다" more={{ href: "/cases/place-rank", label: "계측 사례 전체 보기" }} />
        )}

        {/* 가격 산출 근거 · 홈과 업종 페이지가 /services#pricing 으로 온다. 단가 · 부가세 문구는 그대로 */}
        <Section
          id="pricing"
          soft={!LANDING_RANK_PROOF}
          eyebrow="가격 산출 근거"
          title="필요한 일을 먼저 고르고, 금액은 그 합으로 정합니다"
          desc="항목별 단가를 정해두고 매장에 필요한 항목만 더해 견적을 냅니다. 아래 단가는 실제로 나간 견적서에 쓰인 금액 그대로이고, 계산 과정도 그대로 공개합니다."
        >
          <Table
            label="항목별 단가"
            head={["항목", "단위", "단가"]}
            rows={UNIT_PRICES.map((u) => [
              <span key="i"><span className="font-semibold" style={block}>{u.item}</span>{u.note && <small style={block}>{u.note}</small>}</span>,
              u.unit,
              <span key="p" className="font-semibold" style={{ whiteSpace: "nowrap" }}>{u.price}</span>,
            ])}
          />
          <p className={s.note}>모든 금액은 부가세 별도입니다. 네이버·인스타 광고 집행비는 매체에 직접 나가는 실비라 대행료에 넣지 않습니다.</p>

          <Fold summary="실제 견적 3건이 어떻게 나왔는가">
            {CALC_EXAMPLES.map((c) => (
              <div key={c.title} style={{ marginBottom: 24 }}>
                <p><span className="font-semibold">{c.title}</span> · {c.sub}</p>
                <Table
                  label={c.title}
                  head={["항목", "계산", "금액"]}
                  rows={[
                    ...c.lines.map((l) => [l.label, l.calc, l.amount]),
                    [<span key="t" className="font-semibold">월 합계</span>, "", <span key="v" className="font-semibold">{c.total}원</span>],
                  ]}
                />
                <p className={s.note}>{c.note}</p>
              </div>
            ))}
          </Fold>
          <Fold summary="필요한 것만 골라서 조합합니다">
            <ItemList one items={HOW_WE_COMPOSE.map((c) => ({ title: `${c.step} · ${c.title}`, desc: c.body }))} />
            <p className={s.note}>그래서 &lsquo;월 얼마짜리 패키지&rsquo; 를 미리 만들어두지 않습니다. 같은 예산이어도 매장 상황에 따라 들어가는 항목이 달라지기 때문입니다.</p>
          </Fold>
          <Fold summary="업종마다 구성이 달라지는 지점">
            <Table
              label="업종마다 구성이 달라지는 지점"
              head={["업종", "고객이 검색하는 방식", "주력 채널", "월 물량"]}
              rows={INDUSTRY_PRICE_DIFF.map((r) => [r.industry, r.behavior, r.channel, r.volume])}
            />
            <p className={s.note}>같은 예산이어도 업종에 따라 쓰는 곳이 달라집니다. 음식점은 배포 건수로, 청소업은 블로그 편수로, 카페는 사진과 인스타로 갑니다.</p>
          </Fold>
          <Fold summary="가격이 다를 수밖에 없는 이유">
            <ItemList one items={WHY_PRICE_DIFFERS.map((w) => ({ title: w.title, desc: w.body }))} />
          </Fold>
          <p className={s.note}>
            그래서 홈페이지에는 항목별 기준 단가를 공개하고, 월 금액은 현황을 먼저 본 뒤 필요한 항목만 골라 견적을 냅니다.
            진단과 견적은 0원이고, 견적을 받고 안 하셔도 됩니다.
          </p>
        </Section>

        <Section
          eyebrow="구성 예시"
          title="실제로 이런 조합으로 계약합니다"
          desc="세 가지 중 하나를 고르는 게 아니라, 여기서 필요 없는 항목은 빼고 부족한 항목은 더해 매장에 맞게 다시 짜드립니다."
        >
          <ItemList one items={COMBOS.map((c) => ({ title: c.title, desc: `${c.desc}. ${c.services.join(" · ")}. 목표: ${c.result}` }))} />
          <p className={s.note}>실제 계약·견적 9건에서 뽑은 구성입니다. 항목마다 물량은 매장마다 다르게 잡으므로 진단 후에 항목별로 다시 계산합니다.</p>
        </Section>

        <Section soft eyebrow="진행 순서" title="계약 후 무엇이 언제 진행되나요?" desc="성과가 나는 시점을 약속드리는 표가 아니라, 작업이 진행되는 순서입니다.">
          <Steps steps={TIMELINE} />
        </Section>

        <Section eyebrow="하랑의 약속" title="결과를 숫자로 말하는 대행사입니다" desc="결과가 없으면 전략을 바꾸고, 실패하면 솔직히 말하는 것이 하랑의 방식입니다.">
          <ItemList one items={PROMISES} />
          <LineList items={["상담 비용 0원 · 부담 없이 시작", "카카오톡 접수 24시간 · 하루 이내 답변"]} />
        </Section>

        <Section soft eyebrow="왜 하랑인가" title="일반 대행사와 무엇이 다른가요?" desc="클라이언트가 바꾸고 나서 가장 많이 하는 말을 정리했습니다">
          <Table label="일반 대행사와 하랑마케팅 비교" head={["비교 항목", "일반 대행사", "하랑마케팅"]} rows={COMPARE} />
          <p className={s.note}>기존 작업 내역을 먼저 확인한 뒤 필요한 항목만 제안합니다.</p>
        </Section>

        <Section
          id="faq"
          title="자주 묻는 질문"
          desc="상담 전에 가장 많이 물어보시는 내용을 정리했습니다."
          more={{ href: "/faq", label: "비용·계약·효과 등 전체 FAQ 보기" }}
          footer={<CostLine text="진단과 견적은 0원이고, 견적을 받고 안 하셔도 됩니다." link={{ href: "#pricing", label: "항목별 단가 보기" }} />}
        >
          <QuestionList items={FAQS} />
        </Section>

        {/* 용어 정의 · definitionsLd("/services") 와 짝. 홈의 「마케팅 용어」 접힌 목록이 여기를 전체 화면으로 가리킨다 */}
        <Section soft id="glossary" title="마케팅 용어, 쉽게 정리했습니다" desc="상담 중 가장 많이 나오는 용어를 대표님 눈높이에서 풀어썼습니다.">
          <Fold summary={`용어 ${DEFINITIONS.length}개 전체 보기`}>
            <dl className={`${s.items} ${s.items1}`}>
              {DEFINITIONS.map((d) => (
                <div key={d.term}>
                  <dt>{d.term}</dt>
                  <dd className="speakable">{d.definition}</dd>
                </div>
              ))}
            </dl>
          </Fold>
          <LinkList links={[
            { href: "https://blog.naver.com/harangmarketing", label: "네이버 블로그 운영 사례" },
            { href: "https://www.instagram.com/harang.marketing/", label: "인스타그램 운영 사례" },
          ]} />
        </Section>

        <CloseBand
          title="어떤 서비스가 맞는지 모르겠다면?"
          text="업종·예산·목표를 알려주시면 최적의 서비스 조합을 무료로 추천해드립니다. 비용·계약 강요 없습니다."
          primary={{ href: "/contact", label: "무료 전략 진단 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
