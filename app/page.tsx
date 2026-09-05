"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, X, Phone, MessageCircle,
  TrendingUp, Users, Star, BarChart3, FileText, MapPin,
  Search, BookOpen, Megaphone, AtSign, ChevronRight,
  ShieldCheck, Clock, Handshake,
  Coffee, Scissors, GraduationCap, Stethoscope,
  UtensilsCrossed, ShoppingBag, Sparkles, Store,
} from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import AnimatedCounter from "./components/AnimatedCounter";
import YouTubeSectionNew from "./components/YouTubeSection";
import PhotoPlaceholder from "./components/PhotoPlaceholder";
import RevealOnScroll from "./components/RevealOnScroll";
import ClientLogosSection from "./components/ClientLogosSection";
import { SNS_STORE_ENABLED } from "./lib/feature-flags";
import { PlatformLogo, brandTextColor } from "./sns/PlatformLogo";
import type { PlatformId } from "./lib/sns-store";
import DifferenceSection from "./components/DifferenceSection";
import EntryPopup from "./components/EntryPopup";
import Card3DTilt from "./components/Card3DTilt";
import JsonLd from "./components/JsonLd";
import AnswerBlock from "./components/AnswerBlock";
import FaqAccordion from "./components/FaqAccordion";
import GlossarySection from "./components/GlossarySection";
import {
  SITE, CORE_FAQ, ANSWER_SENTENCES,
  faqLd, webPageLd, breadcrumbLd, definitionsLd,
} from "./lib/seo";
import type { LucideIcon } from "lucide-react";
import { fmt, byKeyword, BIGGEST_GAIN } from "./lib/rank-records";
import { TRACK_RECORD, TRACK_TOTALS } from "./lib/track-record";

/*
 * 업종 카드와 마퀴의 순위 칸 — 손으로 적지 않는다.
 * 여기 숫자를 직접 써 뒀더니 스냅샷이 6회에서 11회로 바뀌는 동안 여섯 줄이 틀린 값이 됐다
 * (지역 치과 5위 → 1위는 08-31 스냅샷에서 아예 사라진 기록이다).
 * 기록이 없어지면 「계측 중」으로 내려간다. 틀린 값보다 빈 값이 낫다 (C-42).
 */
function rankCells(keyword: string) {
  const r = byKeyword(keyword);
  if (!r) {
    return {
      result: "계측 중",
      resultLabel: "플레이스 순위",
      before: "진단 전",
      after: "목표 설정",
      duration: "월 리포트",
    };
  }
  return {
    result: fmt(r),
    resultLabel: r.keyword,
    before: `${r.from}위`,
    after: `${r.to}위`,
    duration: `${r.days}일 계측`,
  };
}

/** 같은 업종의 두 번째 기록 한 줄 — 없으면 칸 자체를 붙이지 않는다 */
function rankExtra(keyword: string) {
  const r = byKeyword(keyword);
  return r ? { extra: `${r.keyword} ${fmt(r)} · ${r.days}일 계측` } : {};
}

/*
 * 사례 카드 넉 장 — Before · After · 걸린 일수를 손으로 적지 않는다.
 * 여기 넉 장을 직접 써 뒀더니 셋이 틀린 값이 됐다 (치과 5위 → 1위는 아예 없는 기록이고,
 * 청소는 67위 → 3위 · 22일, 카페는 25일이다). 기록이 없으면 카드가 통째로 빠진다 (C-42).
 * 1위 달성 · 1페이지 진입 배지도 계측값이 정한다 — 2위를 1위라고 적지 않게.
 */
const CASE_CARDS = [
  { industry: "음식점", keyword: "지역 맛집 키워드", service: "플레이스 SEO + 리뷰", icon: UtensilsCrossed },
  { industry: "청소", keyword: "지역 상가청소 키워드", service: "플레이스 SEO + 블로그", icon: Sparkles },
  { industry: "카페", keyword: "지역 카페 키워드", service: "플레이스 SEO + 블로그", icon: Coffee },
  { industry: "치과", keyword: "지역 치과 키워드", service: "블로그 + 플레이스 SEO", icon: Stethoscope },
].flatMap((c) => {
  const r = byKeyword(c.keyword);
  if (!r) return [];
  return [
    {
      industry: c.industry,
      service: c.service,
      icon: c.icon,
      location: r.keyword,
      before: { label: "플레이스 순위", value: `${r.from}위` },
      after: { label: "플레이스 순위", value: `${r.to}위` },
      period: `${r.days}일 계측`,
      highlight: r.to === 1 ? "플레이스 1위 달성" : "플레이스 1페이지 진입",
    },
  ];
});

/** 마퀴 한 줄 — 기록이 없으면 빈 배열이라 줄이 사라진다 */
function tickerLine(keyword: string) {
  const r = byKeyword(keyword);
  return r ? [`${r.keyword} ${fmt(r)} · ${r.days}일 계측`] : [];
}
import PlaceRankCasesSection from "./components/PlaceRankCases";
import {
  byVolume, PLACE_RANK_AS_OF, PLACE_RANK_HELD, PLACE_RANK_RISEN, PLACE_RANK_TOTALS,
} from "./lib/place-rank-cases";

/* ─── AEO/GEO 구조화 데이터 (홈) ───────────────────
   FAQPage·DefinedTermSet 는 아래 화면에 실제로 렌더링되는
   FaqAccordion / GlossarySection 과 1:1로 대응한다.
   둘 중 하나를 지우면 나머지도 반드시 함께 지울 것. */
const HOME_LD = [
  webPageLd({
    path: "/",
    name: "하랑마케팅 | 소상공인 전문 마케팅 대행사",
    description: ANSWER_SENTENCES.whoWeAre,
  }),
  breadcrumbLd([{ name: "홈", path: "/" }]),
  faqLd(CORE_FAQ, `${SITE.base}/`),
  definitionsLd("/"),
];

/* ─── Data ─────────────────────────────────────── */

type Industry = {
  icon: LucideIcon;
  name: string;
  color: string;
  bgLight: string;
  borderLight: string;
  points: string[];
  result: string;
  resultLabel: string;
  before: string;
  after: string;
  duration: string;
  location: string;
  /** 같은 업종에서 계측된 두 번째 기록 — 없는 업종에는 붙이지 않는다 */
  extra?: string;
};

const INDUSTRIES: Industry[] = [
  {
    icon: Coffee,
    name: "카페·베이커리",
    color: "from-blue-500 to-blue-700",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-100",
    points: ["플레이스 SEO 세팅", "포토리뷰 전략", "인스타 비주얼"],
    ...rankCells("지역 카페 키워드"),
    ...rankExtra("지역 디저트카페 키워드"),
    location: "플레이스 순위",
  },
  {
    icon: UtensilsCrossed,
    name: "음식점·배달",
    color: "from-blue-600 to-indigo-700",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-100",
    points: ["배달앱 리뷰 전략", "맘카페 바이럴", "블로그 맛집 등록"],
    ...rankCells("지역 맛집 키워드"),
    ...rankExtra("지역 역세권 맛집 키워드"),
    location: "플레이스 순위",
  },
  {
    icon: Scissors,
    name: "미용·네일·뷰티",
    color: "from-blue-500 to-blue-700",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-100",
    points: ["인스타 포트폴리오", "체험단 모집", "예약 전환 최적화"],
    result: "계측 중",
    resultLabel: "플레이스 순위",
    before: "진단 전",
    after: "목표 설정",
    duration: "월 리포트",
    location: "전 지역",
  },
  {
    icon: Stethoscope,
    name: "의원·한의원·피부과",
    color: "from-blue-600 to-blue-800",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-100",
    points: ["블로그 신뢰도 강화", "의료광고 심의 확인", "플레이스 SEO"],
    ...rankCells("지역 치과 키워드"),
    ...rankExtra("지역 피부과 키워드"),
    location: "플레이스 순위",
  },
  {
    icon: GraduationCap,
    name: "학원·교육",
    color: "from-blue-700 to-indigo-800",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-100",
    points: ["맘카페 입소문", "홈페이지형 블로그", "블로그 지역 키워드"],
    result: "계측 중",
    resultLabel: "플레이스 순위",
    before: "진단 전",
    after: "목표 설정",
    duration: "월 리포트",
    location: "전 지역",
  },
  {
    icon: ShoppingBag,
    name: "온라인 쇼핑몰",
    color: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-100",
    points: ["블로그 SEO 최적화", "체험단 후기 확보", "콘텐츠 마케팅"],
    result: "계측 중",
    resultLabel: "플레이스 순위",
    before: "진단 전",
    after: "목표 설정",
    duration: "월 리포트",
    location: "전 지역",
  },
];

const SERVICES = [
  { icon: Search, title: "플레이스 SEO 최적화", desc: "업종별 주요 키워드를 분석해 네이버 플레이스 검색 상위에 올려드립니다.", color: "from-blue-600 to-blue-700", popular: true },
  { icon: Star, title: "리뷰 마케팅", desc: "좋은 리뷰를 꾸준히 쌓아 처음 찾아오는 손님의 선택을 이끌어냅니다.", color: "from-blue-500 to-blue-700", popular: true },
  { icon: AtSign, title: "인스타그램 마케팅", desc: "콘텐츠 기획부터 릴스·광고 운영까지 인스타그램 채널 성장을 전담합니다.", color: "from-blue-600 to-indigo-700", popular: true },
  { icon: FileText, title: "블로그 배포(기자단)", desc: "전문 작가가 매장 맞춤 글을 작성하고 20개 이상의 채널에 동시에 올립니다.", color: "from-blue-500 to-blue-700" },
  { icon: BookOpen, title: "홈페이지형 블로그 제작", desc: "네이버 블로그를 전문 홈페이지처럼 꾸며 신뢰도와 검색 노출을 높입니다.", color: "from-blue-600 to-blue-800" },
  { icon: MapPin, title: "카카오맵 마케팅", desc: "카카오맵 플레이스 정보·사진·리뷰를 정리해 지역 검색 노출을 관리합니다.", color: "from-blue-500 to-blue-700" },
  { icon: Users, title: "체험단 모집 대행", desc: "실제 방문 후기를 남길 체험단을 모집해 믿을 수 있는 리뷰를 만들어드립니다.", color: "from-blue-600 to-indigo-700" },
  { icon: TrendingUp, title: "플레이스 순위상승", desc: "방문자·저장·리뷰 등 여러 항목을 함께 관리해 플레이스 순위를 올려드립니다.", color: "from-blue-600 to-blue-800" },
  { icon: BarChart3, title: "블로그 관리 대행", desc: "꾸준한 글쓰기와 검색 최적화로 블로그 노출을 높이고 방문자를 유지합니다.", color: "from-blue-500 to-blue-700" },
  { icon: Megaphone, title: "맘카페 바이럴", desc: "지역 맘카페·육아 커뮤니티를 통해 주요 고객층에 입소문을 만들어드립니다.", color: "from-blue-600 to-blue-800" },
];

const COMPARE_ITEMS = [
  { category: "전략 설계", harang: "업종별 맞춤형 전략 (카페·병원·쇼핑몰 특화)", general: "일괄 패키지, 템플릿 기반" },
  { category: "분석 방식", harang: "플레이스 순위 매일 스냅샷 계측", general: "노출·클릭 수 위주, 감각 운영" },
  { category: "보고 체계", harang: "월 2회 상세 리포트 + 주간 최적화", general: "월 1회 간단 보고, 설정 후 방치" },
  { category: "담당자", harang: "10년 경력 대표가 1:1 관리", general: "신입 담당자 수시 교체" },
  { category: "성과 기준", harang: "계측 가능한 순위·리뷰 수치 기준", general: "노출 수·팔로워 수 등 허수 지표" },
  { category: "소통 방식", harang: "카카오·전화 24시간 응대, 직접 연락", general: "이메일·업무시스템, 응답 지연 빈번" },
];

const PROCESS_STEPS = [
  { step: "01", title: "무료 상담 신청", desc: "전화·카카오·폼 중 편한 방법으로 연락해주세요. 부담 없습니다.", icon: MessageCircle, color: "from-blue-500 to-blue-700" },
  { step: "02", title: "현황 무료 분석", desc: "업종·경쟁사·현재 순위를 분석해 문제점과 기회를 정리합니다.", icon: Search, color: "from-blue-600 to-blue-800" },
  { step: "03", title: "맞춤 전략 제안", desc: "분석 결과를 바탕으로 업종에 맞는 전략과 견적을 제안합니다.", icon: FileText, color: "from-blue-700 to-indigo-700" },
  { step: "04", title: "계약 후 즉시 시작", desc: "계약 당일부터 작업이 시작됩니다. 월 2회 상세 리포트로 성과를 확인합니다.", icon: TrendingUp, color: "from-blue-600 to-blue-800" },
];

const PACKAGES = [
  {
    name: "한 채널 집중",
    desc: "한 곳만 확실히 잡으면 되는 매장",
    roi: "대표 키워드 한 곳에 집중",
    features: ["플레이스 SEO 최적화 1회", "대표키워드 5개 관리", "리뷰 유도 동선 설계", "월 리포트 1회"],
    popular: false,
  },
  {
    name: "두세 채널 묶음",
    desc: "검색 유입부터 만들어야 하는 매장",
    roi: "검색 유입 만들고 문의로 전환",
    features: ["플레이스 SEO 최적화", "블로그 관리대행 월 10~15편", "파워컨텐츠 원고 설계·검수", "네이버 광고 운영대행", "월 리포트 2회"],
    popular: true,
  },
  {
    name: "전 채널 통합",
    desc: "경쟁이 촘촘한 상권 · 지점이 여러 곳인 브랜드",
    roi: "지역 키워드 전 구간 점유",
    features: ["블로그·카페 배포 월 15~30건", "파워컨텐츠 월 5편", "플레이스 SEO·트래픽·길찾기", "인스타 피드·릴스 월 8~20건", "주간 최적화 리포트"],
    popular: false,
  },
];


const TRUST_ITEMS = [
  { icon: ShieldCheck, title: "검증된 10년 경력", desc: "대학생 서포터즈부터 시작해 500개 이상 프로젝트 직접 진행", color: "from-blue-600 to-blue-800" },
  { icon: Handshake, title: `${SITE.stats.renewalRate} 재계약률`, desc: "성과로 증명. 고객이 먼저 다시 찾는 대행사", color: "from-blue-500 to-blue-700" },
  { icon: Clock, title: "24시간 내 응답", desc: "문의 후 24시간 이내 연락, 평일 항상 대응", color: "from-blue-600 to-indigo-700" },
  { icon: TrendingUp, title: "매출 중심 관리", desc: "노출 수가 아닌 실제 매출 증대를 목표로 운영", color: "from-blue-700 to-indigo-800" },
];

/**
 * 신뢰 마퀴 문구 — 끝기지 않게 흘려야 해서 렌더링에서 두 번 펜다.
 * 예전엔 같은 배열을 두 벌 적어 두었는데, 한쪽만 고치면 흘러가다 문구가 바뀜다.
 * 근거 없는 수치와 재촉 문구는 넣지 않는다 (WDS — 재촉형 UI 금지).
 */
const TICKER = [
  ...tickerLine("지역 카페 키워드"),
  `재계약률 ${SITE.stats.renewalRate} · 500+ 프로젝트`,
  ...tickerLine("지역 치과 키워드"),
  "대표가 직접 관리 · 상담 비용 0원",
  ...tickerLine("지역 맛집 키워드"),
  ...tickerLine("지역 상가청소 키워드"),
  ...tickerLine("지역 꽃집 키워드"),
  "업종별 맞춤 설계 · 묶음 강요 없음",
  ...tickerLine("지역 피부과 키워드"),
  "매일 순위 계측 · 월 리포트 제공",
  "상담 비용 0원 · 계약 강요 없음",
  ...tickerLine("지역 정기청소 키워드"),
  "10년+ 경력 · 업종별 맞춤 전략",
  "24시간 내 연락",
  `플레이스 1페이지 유지 ${PLACE_RANK_TOTALS.page1Keywords}개 키워드 · ${PLACE_RANK_AS_OF} 기준`,
  "네이버 플레이스 스냅샷 매일 저장",
  "성과 확약 없음 · 계측값만 보고",
  `1페이지 진입 기록 중 최대 상승폭 ${fmt(BIGGEST_GAIN)}`,
];


export default function HomePage() {
  return (
    <>
      <JsonLd data={HOME_LD} />
      <EntryPopup />
      <Header />
      <main>

        {/* ══ Hero — 클로드 디자인 영상 히어로 ══ */}
        <HeroSection />

        {/* ══ AEO — AI 답변 엔진이 인용하는 한 줄 정답 ══ */}
        <AnswerBlock
          question="하랑마케팅은 어떤 회사인가요?"
          answer={ANSWER_SENTENCES.whoWeAre}
          facts={[
            { label: "설립", value: "2020년" },
            { label: "누적 프로젝트", value: "500건+" },
            { label: "재계약률", value: SITE.stats.renewalRate },
            { label: "상담·진단", value: "0원" },
          ]}
        />

        {/* ══ 신뢰 마퀸 배너 ══ */}
        <div className="py-3 overflow-hidden" style={{ background: "var(--h-navy)" }}>
          <div className="flex animate-marquee whitespace-nowrap">
            {[...TICKER, ...TICKER].map((text, i) => (
              <span key={i} className="flex items-center gap-3 px-6 text-xs text-white font-semibold">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i % 2 ? "bg-blue-200" : "bg-white/60"}`} />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* ══ 플랫폼 신뢰 스트립 ══ */}
        <section className="py-7 bg-white border-b" style={{ borderColor: "var(--h-border)" }}>
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] shrink-0" style={{ color: "var(--h-muted)" }}>운영 플랫폼</p>
              <div className="h-px flex-1 hidden sm:block" style={{ background: "var(--h-border)" }} />
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 md:gap-5">
                {([
                  { name: "인스타그램", logo: "instagram" },
                  { name: "유튜브", logo: "youtube" },
                  { name: "네이버", logo: "naver" },
                  { name: "카카오", logo: "kakao" },
                  { name: "틱톡", logo: "tiktok" },
                  { name: "스레드", logo: "threads" },
                ] as { name: string; logo: PlatformId }[]).map((p) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <PlatformLogo id={p.logo} size={24} />
                    <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "var(--h-muted)" }}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 매장별 순위 계측 발췌 ══ */}
        {/* 숫자와 표기는 app/lib/place-rank-cases.ts 한 곳에서만 온다.
            카드 하나가 키워드 하나이고, 전체 목록은 /cases/place-rank 에 있다.
            많이 찾는 키워드부터 전부 싣는다 (2026-09-05 (토) 대표 지시). */}
        <PlaceRankCasesSection
          cases={byVolume()}
          eyebrow="Place Rank"
          title="키워드별 순위, 잰 그대로 적었습니다"
          description={`${PLACE_RANK_AS_OF} 기준으로 ${PLACE_RANK_TOTALS.stores}곳 ${PLACE_RANK_TOTALS.keywords}개 키워드를 매일 재고 있습니다. 그중 올라간 ${PLACE_RANK_RISEN}건과 자리를 지키고 있는 ${PLACE_RANK_HELD}건을 키워드마다 한 장씩 실었습니다. 많이 찾는 키워드부터 놓았습니다.`}
          cta={{ href: "/cases/place-rank", label: "계측 사례 전체 보기" }}
          compact
        />

        {/* ══ 함께한 브랜드 로고 슬라이더 ══ */}
        <ClientLogosSection />

        {/* ══ 관리 매장 이력 ══ */}
        {/* 상호 없이 업종·지역·진행 상태만 적는다. 정본은 app/lib/track-record.ts 한 곳이고
            /portfolio · /services/review 가 같은 데이터를 쓴다.
            홈에서는 업종 칩을 접지 않고 99곳 전부 펼친다 — 진행 항목까지는 /portfolio 로 넘긴다
            (2026-09-05 (토) 대표 지시 · 관리 매장을 홈에 최대한 많이 보이게). */}
        <section className="py-12 md:py-16 border-t" style={{ background: "#fff", borderColor: "var(--h-border)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="max-w-3xl">
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.16em]"
                  style={{ background: "var(--h-bg)", color: "var(--h-blue)" }}
                >
                  <Store size={13} strokeWidth={2.5} />
                  Track Record
                </span>
                <h2 className="mt-3 text-2xl md:text-[32px] font-black leading-tight" style={{ color: "var(--h-navy)" }}>
                  맡아온 매장을 업종별로 전부 적었습니다
                </h2>
                <p className="mt-3 text-sm md:text-[15px] leading-relaxed" style={{ color: "var(--h-muted)" }}>
                  계약 대장과 계약 서류에서 확인한 것만 옮겼습니다. 상호와 지점명은 밝히지 않고 업종 · 지역 · 진행 상태만
                  적습니다. 지역은 시 · 군 · 구까지 적으면 업종과 겹쳐 업체가 드러나기 때문에 광역 단위까지만 남겼고,
                  출장 위주라 권역이 넓은 곳은 비워 두었습니다.
                </p>
              </div>
            </RevealOnScroll>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: TRACK_TOTALS.stores, unit: "곳", label: "맡아온 매장", sub: "서류로 확인한 것만" },
                { value: TRACK_TOTALS.trades, unit: "종", label: "업종", sub: "음식점부터 설비까지" },
                { value: TRACK_TOTALS.regions, unit: "곳", label: "시 · 도", sub: "지역 표기가 있는 건 기준" },
                { value: TRACK_TOTALS.ongoing, unit: "곳", label: "지금도 관리 중", sub: "계약 진행 중" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border p-4 md:p-5"
                  style={{ background: "var(--h-bg)", borderColor: "var(--h-border)" }}
                >
                  <p className="text-2xl md:text-3xl font-black tabular-nums leading-none" style={{ color: "var(--h-navy)" }}>
                    {s.value}
                    <span className="text-base md:text-lg font-bold ml-0.5">{s.unit}</span>
                  </p>
                  <p className="mt-2 text-[13px] font-bold" style={{ color: "var(--h-navy)" }}>{s.label}</p>
                  <p className="mt-0.5 text-[11px] md:text-xs" style={{ color: "var(--h-muted)" }}>{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              {TRACK_RECORD.map((group) => (
                <div
                  key={group.key}
                  className="grid gap-2.5 border-t py-4 md:grid-cols-[168px_1fr] md:gap-6 md:py-5"
                  style={{ borderColor: "var(--h-border)" }}
                >
                  <div className="flex items-baseline gap-2 md:block">
                    <h3 className="text-[15px] md:text-base font-bold" style={{ color: "var(--h-navy)" }}>{group.name}</h3>
                    <p className="text-xs tabular-nums md:mt-1" style={{ color: "var(--h-muted)" }}>{group.items.length}곳</p>
                  </div>
                  <ul className="flex flex-wrap gap-1.5 md:gap-2">
                    {group.items.map((item, i) => (
                      <li
                        key={group.key + "-" + i}
                        className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5"
                        style={{ background: "var(--h-bg)", borderColor: "var(--h-border)" }}
                      >
                        {item.status === "진행 중" && (
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--h-blue)" }} aria-hidden />
                        )}
                        <span className="text-[12px] md:text-[13px] font-semibold" style={{ color: "var(--h-navy)" }}>{item.trade}</span>
                        {item.region && (
                          <span className="text-[11px] md:text-xs" style={{ color: "var(--h-muted)" }}>{item.region}</span>
                        )}
                        {item.branches && (
                          <span className="text-[11px] font-bold tabular-nums" style={{ color: "var(--h-blue)" }}>
                            {item.branches}{item.unit ?? "지점"}
                          </span>
                        )}
                        {item.status === "진행 중" && <span className="sr-only">진행 중</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              className="mt-6 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "var(--h-border)" }}
            >
              <p className="flex items-start gap-2 text-xs leading-relaxed max-w-2xl" style={{ color: "var(--h-muted)" }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: "var(--h-blue)" }} aria-hidden />
                파란 점은 지금도 관리 중인 곳입니다. 숫자가 붙은 칸은 같은 브랜드의 지점 · 권역을 한 줄로 묶은 것입니다.
              </p>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white shrink-0"
                style={{ background: "var(--h-blue)" }}
              >
                업종별 진행 항목까지 보기
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 차별화 비교표 ══ */}
        <DifferenceSection />

        {/* ══ 무료 진단 배너 ══ */}
        <section className="py-8 border-b" style={{ background: "var(--h-bg)", borderColor: "var(--h-border)" }}>
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] mb-1" style={{ color: "var(--h-blue)" }}>상담 0원 · 24시간 내 연락</p>
                <p className="text-base md:text-lg font-black" style={{ color: "var(--h-dark)" }}>
                  우리 매장엔 뭐가 필요한지 궁금하신가요?
                </p>
                <p className="text-sm" style={{ color: "var(--h-muted)" }}>업종·상권·경쟁 상황마다 필요한 게 달라, 매장을 직접 보고 맞춤으로 제안드립니다</p>
              </div>
              <Link href="/contact"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-black text-sm transition-opacity hover:opacity-90 shadow-sm"
                style={{ background: "var(--h-blue)" }}>
                <MessageCircle size={15} />
                무료 진단 신청
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ SNS 부스트 스토어 배너 ══ */}
        {/* 스토어를 감춘 동안에는 배너도 내린다 (app/lib/feature-flags.ts) */}
        {SNS_STORE_ENABLED && (
          <section className="py-10 md:py-14" style={{ background: "var(--h-dark)" }}>
            <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002966] via-[#16224a] to-[#003E9C] ring-1 ring-white/10 px-6 py-8 md:px-10 md:py-10">
                <div className="dot-grid-navy absolute inset-0 opacity-40" aria-hidden />
                <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-black text-blue-300 ring-1 ring-white/15">
                      <Star size={12} strokeWidth={2.5} />
                      NEW · 회원가입 없이 건당 주문
                    </div>
                    <h2 className="mt-4 text-2xl md:text-[32px] font-black text-white leading-tight" style={{ letterSpacing: "-0.03em" }}>
                      SNS 부스트 스토어
                    </h2>
                    <p className="mt-2.5 text-sm md:text-[15px] leading-relaxed text-gray-300 max-w-xl">
                      인스타·유튜브·틱톡·네이버 등 8개 플랫폼의 팔로워·좋아요·조회수를
                      대행 계약 없이 필요한 만큼만 주문하세요. 비밀번호 없이 링크만으로 진행되고,
                      주문번호로 진행 상황을 실시간 확인할 수 있습니다.
                    </p>
                    <div className="mt-5 flex items-center gap-2.5 flex-wrap">
                      {(["instagram", "youtube", "tiktok", "threads", "naver", "x", "facebook", "telegram", "kakao"] as PlatformId[]).map((id) => (
                        <PlatformLogo key={id} id={id} size={32} className="ring-2 ring-white/10" />
                      ))}
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                      <Link href="/sns"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-400 text-gray-900 font-black text-sm transition hover:bg-blue-300 shadow-sm">
                        스토어 구경하기
                        <ArrowRight size={15} strokeWidth={2.5} />
                      </Link>
                      <Link href="/sns/track"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white font-black text-sm ring-1 ring-white/20 transition hover:bg-white/20">
                        주문 조회
                      </Link>
                    </div>
                  </div>
                  {/* 가격 미리보기 카드 */}
                  <div className="hidden lg:flex flex-col gap-2.5 w-64">
                    {[
                      { logo: "instagram" as PlatformId, name: "한국인 팔로워", price: "150원", unit: "명" },
                      { logo: "youtube" as PlatformId, name: "한국인 조회수", price: "15원", unit: "회" },
                      { logo: "naver" as PlatformId, name: "플레이스 저장", price: "100원", unit: "개" },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
                        <PlatformLogo id={r.logo} size={36} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-black text-gray-900 truncate">{r.name}</p>
                          <p className="text-[11px] text-gray-600">1{r.unit}당</p>
                        </div>
                        <p className="text-[15px] font-black text-blue-600 tabular-nums shrink-0">{r.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ 업종별 특화 ══ */}
        <section className="py-10 md:py-16" style={{ background: "var(--h-bg)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-7">
              <RevealOnScroll>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-[2px]" style={{ background: "var(--h-navy)" }} />
                    <p className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-navy)" }}>실제 성과 데이터</p>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black leading-tight" style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}>
                    내 업종에도<br />효과가 있을까요?
                  </h2>
                </div>
                <p className="text-sm max-w-xs leading-relaxed" style={{ color: "var(--h-muted)" }}>
                  같은 업종 실제 클라이언트의 before·after 수치입니다.<br />
                  카드를 클릭하면 해당 업종 무료 진단을 신청할 수 있습니다.
                </p>
              </div>
              </RevealOnScroll>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {INDUSTRIES.map((ind) => {
                const Icon = ind.icon;
                return (
                  <Card3DTilt key={ind.name} style={{ borderRadius: "16px" }}>
                  <Link href={`/contact?industry=${encodeURIComponent(ind.name)}`}
                    className="group relative bg-white overflow-hidden block card-hover card-navy-accent"
                    style={{ borderRadius: "16px", border: "1px solid var(--h-border)", borderTop: "3px solid var(--h-navy)" }}>
                    {/* Result ribbon */}
                    <div className="px-5 pt-5 pb-4 flex items-start justify-between" style={{ borderBottom: "1px solid var(--h-border)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--h-navy)" }}>
                          <Icon size={17} className="text-white" strokeWidth={2} />
                        </div>
                        <div>
                          <h3 className="font-black text-sm leading-tight" style={{ color: "var(--h-dark)" }}>{ind.name}</h3>
                          <p className="text-[11px] mt-0.5" style={{ color: "var(--h-muted)" }}>{ind.location} · {ind.duration}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-black leading-none tabular-nums" style={{ color: "var(--h-amber)" }}>{ind.result}</div>
                        <div className="text-[11px] mt-0.5" style={{ color: "var(--h-muted)" }}>{ind.resultLabel}</div>
                      </div>
                    </div>

                    <div className="p-5">
                      {/* before / after */}
                      <div className="flex items-center gap-2 mb-4 rounded-xl p-3" style={{ background: "var(--h-bg)", border: "1px solid var(--h-border)" }}>
                        <div className="flex-1 text-center">
                          <div className="text-[11px] font-bold text-red-700 mb-1">BEFORE</div>
                          <div className="text-xs font-semibold" style={{ color: "var(--h-muted)" }}>{ind.before}</div>
                        </div>
                        <ChevronRight size={14} strokeWidth={1.5} style={{ color: "var(--w-label-assistive)" }} className="shrink-0" />
                        <div className="flex-1 text-center">
                          <div className="text-[11px] font-bold mb-1" style={{ color: "var(--h-blue)" }}>AFTER</div>
                          <div className="text-xs font-bold" style={{ color: "var(--h-dark)" }}>{ind.after}</div>
                        </div>
                      </div>

                      {/* 같은 업종 추가 계측 기록 */}
                      {ind.extra && (
                        <div className="mb-4 rounded-lg px-3 py-2 text-[11px] leading-relaxed"
                          style={{ background: "var(--h-bg)", border: "1px solid var(--h-border)", color: "var(--h-muted)" }}>
                          같은 업종 추가 계측 · <span className="font-bold tabular-nums" style={{ color: "var(--h-dark)" }}>{ind.extra}</span>
                        </div>
                      )}

                      {/* strategy points */}
                      <ul className="space-y-1.5 mb-4">
                        {ind.points.map((p) => (
                          <li key={p} className="flex items-center gap-2 text-[11px]" style={{ color: "var(--h-muted)" }}>
                            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--h-navy)" }} />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all" style={{ color: "var(--h-blue)" }}>
                        이 업종 무료 진단받기 <ArrowRight size={11} />
                      </div>
                    </div>
                  </Link>
                  </Card3DTilt>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm mb-4" style={{ color: "var(--h-muted)" }}>위 업종 외에도 상담 가능합니다</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 shadow-sm"
                style={{ background: "var(--h-navy)" }}
              >
                내 업종 무료 진단 받기
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 고민 해결 ══ */}
        <section className="py-10 md:py-14" style={{ background: "var(--h-bg)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <RevealOnScroll>
            <div className="text-center mb-7">
              <div className="flex items-center gap-3 justify-center mb-4">
                <div className="w-6 h-[2px]" style={{ background: "var(--h-amber)" }} />
                <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--w-primary-strong)" }}>왜 하랑인가</span>
                <div className="w-6 h-[2px]" style={{ background: "var(--h-amber)" }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}>이런 고민, 해결된 증거 있습니다</h2>
              <p className="text-sm" style={{ color: "var(--h-muted)" }}>마케팅 대행사와 일해본 사장님들이 가장 많이 하는 말, 하랑이 어떻게 바꿨는지</p>
            </div>
            </RevealOnScroll>
            <div className="space-y-4">
              {[
                {
                  q: "광고비는 쓰는데 매출이 안 늘어요",
                  a: "업종 특성을 무시한 일괄 마케팅이 원인입니다. 하랑은 카페·병원·학원 등 업종별 맞춤 전략만 설계합니다. 다만 매출은 저희가 계측할 수 있는 값이 아니라 수치로 약속드리지 않습니다.",
                  result: "플레이스 순위로 계측",
                  period: "매일 스냅샷 · 월 리포트",
                  icon: TrendingUp,
                  iconColor: "from-blue-500 to-blue-700",
                  cardBorder: "border-blue-100",
                  badgeBg: "bg-blue-50",
                  badgeText: "text-blue-700",
                },
                {
                  q: "보고서를 봐도 뭔지 모르겠어요",
                  a: "복잡한 마케팅 용어 없이 플레이스 순위·리뷰 변화를 숫자로만 보고드립니다. 대표가 직접 카카오톡으로 설명합니다.",
                  result: `재계약률 ${SITE.stats.renewalRate}`,
                  period: "6개월 이상 계약 기준",
                  icon: BarChart3,
                  iconColor: "from-blue-600 to-blue-800",
                  cardBorder: "border-blue-100",
                  badgeBg: "bg-blue-50",
                  badgeText: "text-blue-700",
                },
                {
                  q: "담당자가 계속 바뀌어서 지쳐요",
                  a: "하랑은 계약부터 종료까지 대표가 직접 관리합니다. 상담 전화를 받은 사람이 처음부터 끝까지 함께합니다.",
                  result: "대표가 직접 상담",
                  period: "2020년 개업부터 현재까지",
                  icon: Handshake,
                  iconColor: "from-blue-600 to-indigo-700",
                  cardBorder: "border-blue-100",
                  badgeBg: "bg-blue-50",
                  badgeText: "text-blue-700",
                },
                {
                  q: "마케팅이 효과 있는지 도통 모르겠어요",
                  a: "플레이스 순위·리뷰 증감을 매월 2회 수치로 정리해 공유합니다. '감'이 아닌 숫자로 성과를 확인하실 수 있습니다.",
                  result: "월 2회 성과 리포트",
                  period: "전 클라이언트 공통 적용",
                  icon: BarChart3,
                  iconColor: "from-blue-700 to-indigo-800",
                  cardBorder: "border-blue-100",
                  badgeBg: "bg-blue-50",
                  badgeText: "text-blue-700",
                },
              ].map((item, idx) => {
                return (
                  <RevealOnScroll key={item.q} delay={idx * 60}>
                  <div className="bg-white rounded-2xl border p-5 md:p-7 hover:shadow-lg transition-all group" style={{ borderColor: "var(--h-border)" }}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      {/* content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--h-muted)" }}>고객 고민</p>
                        <h3 className="font-black text-base md:text-lg leading-snug mb-2" style={{ color: "var(--h-dark)" }}>&lsquo;{item.q}&rsquo;</h3>
                        <p className="text-sm leading-relaxed pl-3" style={{ borderLeft: "2px solid var(--h-amber)", color: "#4B5563" }}>{item.a}</p>
                      </div>
                      {/* result badge — amber */}
                      <div className="shrink-0">
                        <div className="inline-flex flex-col items-center gap-0.5 px-5 py-4 rounded-2xl min-w-[100px] text-center" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                          <span className="text-lg md:text-xl font-black tabular-nums" style={{ color: "var(--w-primary-strong)" }}>{item.result}</span>
                          <span className="text-[11px] font-medium" style={{ color: "var(--h-muted)" }}>{item.period}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ 대표 소개 ══ */}
        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-center">
              {/* Content */}
              <RevealOnScroll from="left"><div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: "var(--h-navy)" }}>About CEO</p>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
                  실패해 본 대표가<br />성공하는 길을<br />가장 잘 압니다
                </h2>

                {/* Quote highlight */}
                <div className="relative rounded-2xl p-6 mb-7" style={{ background: "var(--h-surface)", borderLeft: "3px solid var(--h-amber)" }}>
                  <p className="text-base md:text-[17px] leading-relaxed" style={{ color: "#374151" }}>
                    대표님은 사업의 본질에만 집중하십시오.<br />
                    골치 아픈 홍보와 전략은 하랑이<br className="hidden sm:block" /> 대신 고민하고 실행하겠습니다.
                  </p>
                  <p className="text-xs mt-4 font-semibold" style={{ color: "var(--h-muted)" }}>하랑마케팅 대표</p>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  2018년 해병대 장교로 전역 후 카페를 창업했다가 실패했습니다. 이후 마케팅 대행사에 취업해 팀장까지 올라갔지만,
                  고객을 대충 대하고 성과도 없이 돈만 받는 방식에 혐오감을 느껴 2020년 직접 창업했습니다.
                  <strong className="text-gray-800">대표님의 돈을 제 돈처럼 무겁게 생각합니다.</strong>
                  현재까지 소상공인 500곳 이상과 함께 성장해왔습니다.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-7">
                  {[
                    { label: "해병대 장교 출신", sub: "책임감·원칙" },
                    { label: "카페 창업 실패", sub: "현장 공감" },
                    { label: "대행사 팀장 출신", sub: "내부 구조 파악" },
                    { label: "500+ 클라이언트", sub: "검증된 성과" },
                    { label: "결과 미달 시 조정", sub: "다음 달 비용" },
                    { label: "외주 없음", sub: "대표가 직접 관리" },
                  ].map((b) => (
                    <div key={b.label} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                      <div className="text-xs font-black text-gray-900 mb-0.5">{b.label}</div>
                      <div className="text-[11px] text-gray-600">{b.sub}</div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gray-950 hover:bg-gray-800 text-white font-bold text-sm transition-colors"
                >
                  대표와 상담하기 <ArrowRight size={14} />
                </Link>
              </div></RevealOnScroll>

              {/* Photo */}
              <RevealOnScroll from="right"><div>
                <PhotoPlaceholder
                  label="대표 프로필 사진"
                  hint="실제 사진으로 교체 예정 · 세로 비율 (3:4) 권장"
                  width="w-full"
                  height="h-[440px]"
                  className="rounded-2xl shadow-lg"
                />
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  {[
                    { val: "10년+", label: "마케팅 경력" },
                    { val: SITE.stats.renewalRate, label: "재계약률" },
                    { val: "500+", label: "완료 프로젝트" },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl py-3">
                      <div className="text-base font-black text-gray-900">{s.val}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div></RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ══ 신뢰 지표 (카운터) ══ */}
        <section className="py-10 md:py-16 bg-white overflow-hidden" style={{ borderTop: "1px solid var(--h-border)", borderBottom: "1px solid var(--h-border)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-[3px]" style={{ background: "var(--h-amber)" }} />
                <p className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--w-primary-strong)" }}>10년 운영 데이터</p>
              </div>
            </RevealOnScroll>

            {/* Editorial large stats — divided columns
                구분선은 그리드 아이템(RevealOnScroll)에 건다. 안쪽 div 에 걸면
                칸 높이가 달라질 때 선이 행 높이를 못 채우고 짧게 끊긴다.
                모바일 2x2 에서는 3·4번째 칸에 가로선을 넣어 행을 나눈다. */}
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderLeft: "1px solid var(--h-border)" }}>
              {[
                { to: 500, suffix: "+", decimals: 0, label: "완료 프로젝트", sub: "2020년~현재" },
                { to: SITE.stats.renewalRateNum, suffix: "%", decimals: 1, label: "재계약률", sub: "6개월 이상 계약 기준" },
                { to: 10, suffix: "년+", decimals: 0, label: "마케팅 경력", sub: "플레이스·블로그 실무" },
                { to: 89, suffix: "%", decimals: 0, label: "평균 매출 상승", sub: "3개월 계약 실측치" },
              ].map((item, i) => (
                <RevealOnScroll
                  key={item.label}
                  delay={i * 70}
                  className={`min-w-0 border-r border-[color:var(--h-border)]${i >= 2 ? " border-t md:border-t-0" : ""}`}
                >
                  <div className="px-4 md:px-5 lg:px-8 py-6 md:py-8">
                    <div className="editorial-num mb-1.5" style={{ color: "var(--h-dark)" }}>
                      <AnimatedCounter to={item.to} suffix={item.suffix} decimals={item.decimals} duration={1600} />
                    </div>
                    <div className="text-sm font-bold text-gray-700 mb-0.5">{item.label}</div>
                    <div className="text-[11px] leading-snug" style={{ color: "var(--h-muted)" }}>{item.sub}</div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            {/* Trust items as inline row */}
            <div className="mt-10 pt-8 grid grid-cols-2 md:grid-cols-4 gap-4" style={{ borderTop: "1px solid var(--h-border)" }}>
              {TRUST_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                      <Icon size={14} strokeWidth={1.8} style={{ color: "var(--h-navy)" }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{item.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--h-muted)" }}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ 하랑의 약속 ══ */}
        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            {/* Section header — editorial style */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end mb-8">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-[3px]" style={{ background: "var(--h-amber)" }} />
                  <p className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--w-primary-strong)" }}>하랑의 약속</p>
                </div>
                <h2 className="text-3xl md:text-5xl font-black leading-tight" style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}>
                  결과가 없으면<br />말씀드립니다
                </h2>
              </div>
              <p className="text-sm md:text-base leading-relaxed max-w-xs" style={{ color: "var(--h-muted)" }}>
                과장된 약속보다 정직한 진단.<br />
                계약 전에 성과 가능 여부를 먼저 솔직하게 말씀드립니다.
              </p>
            </div>

            {/* 3-column split — each promise as a full editorial block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ border: "1px solid var(--h-border)", borderRadius: "16px", overflow: "hidden" }}>
              {[
                { icon: ShieldCheck, num: "01", title: "무결과 시 비용 조정", desc: "3개월 안에 협의한 목표치를 달성하지 못하면 다음 달 비용을 조정합니다. 눈속임 없이." },
                { icon: Handshake, num: "02", title: "대표가 직접 관리", desc: "외주·인턴 없이 대표가 직접 매장을 분석하고 전략을 세웁니다. 담당자가 바뀌는 일이 없습니다." },
                { icon: Clock, num: "03", title: "24시간 내 연락", desc: "상담 신청 후 24시간 이내에 반드시 연락드립니다. 응답이 늦으면 먼저 연락드립니다." },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="relative p-6 md:p-8 flex flex-col gap-4"
                    style={{
                      borderRight: idx < 2 ? "1px solid var(--h-border)" : undefined,
                      borderTop: idx > 0 ? "1px solid var(--h-border)" : undefined,
                    }}>
                    {/* Ghost number */}
                    <div className="absolute top-4 right-5 text-6xl font-black select-none" style={{ color: "var(--h-surface)", letterSpacing: "-0.04em" }}>{item.num}</div>
                    <div className="relative">
                      <Icon size={28} strokeWidth={1.5} style={{ color: "var(--h-navy)" }} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg mb-2" style={{ color: "var(--h-dark)" }}>{item.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--h-muted)" }}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <Link href="/free-check"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold transition-opacity hover:opacity-90"
                style={{ background: "var(--h-dark)", color: "white" }}>
                무료 플레이스 진단 신청
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 진행 프로세스 ══ */}
        <section className="py-10 md:py-16 overflow-hidden" style={{ background: "var(--h-surface)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <RevealOnScroll>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[3px]" style={{ background: "var(--h-amber)" }} />
              <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--w-primary-strong)" }}>진행 과정</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end mb-8">
              <h2 className="text-3xl md:text-5xl font-black leading-tight" style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}>
                신청 후 4단계,<br />전부 대표가 직접 합니다
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--h-muted)" }}>
                상담부터 성과 보고까지<br />외주 없이 대표가 직접 관리
              </p>
            </div>
            </RevealOnScroll>

            {/* Editorial steps — horizontal rule-divided list */}
            <div style={{ borderTop: "1px solid var(--h-border)" }}>
              {PROCESS_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.step} className="grid grid-cols-[auto_1fr] md:grid-cols-[120px_1fr_auto] gap-4 md:gap-8 items-start py-6 md:py-8"
                    style={{ borderBottom: "1px solid var(--h-border)" }}>
                    {/* Ghost number */}
                    <div className="w-[72px] md:w-[120px] shrink-0 leading-none font-black select-none tabular-nums"
                      style={{ fontSize: "clamp(40px, 5vw, 72px)", color: "var(--h-border)", letterSpacing: "-0.05em" }}>
                      {s.step}
                    </div>
                    {/* Content */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                          <Icon size={13} strokeWidth={2} style={{ color: "var(--h-navy)" }} />
                        </div>
                        <h3 className="font-black text-base md:text-lg" style={{ color: "var(--h-dark)" }}>{s.title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--h-muted)" }}>{s.desc}</p>
                    </div>
                    {/* Step label — desktop only */}
                    <div className="hidden md:flex items-center self-center">
                      {i === 0 && (
                        <span className="text-[11px] font-black px-2.5 py-1 rounded-full"
                          style={{ background: "var(--h-amber)", color: "white" }}>무료</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-black text-sm transition-opacity hover:opacity-90"
                style={{ background: "var(--h-dark)" }}>
                01 무료 상담 시작하기
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 무료 마케팅 인사이트 ══ */}
        <section className="py-8 md:py-12" style={{ background: "var(--h-surface)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <RevealOnScroll>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-[2px]" style={{ background: "var(--h-amber)" }} />
                  <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--w-primary-strong)" }}>무료 마케팅 인사이트</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}>
                  10년 노하우, 무료로 읽어보세요
                </h2>
                <p className="text-sm" style={{ color: "var(--h-muted)" }}>실전에서 검증된 소상공인 마케팅 전략을 공개합니다</p>
              </div>
              <Link href="/blog"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-3 md:py-2.5 rounded-xl text-white text-sm font-bold transition-colors shadow-sm hover:opacity-90"
                style={{ background: "var(--h-dark)" }}>
                인사이트 전체보기 <ArrowRight size={13} />
              </Link>
            </div>
            </RevealOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  tag: "플레이스 SEO",
                  headerBg: "var(--h-navy)",
                  title: "네이버 플레이스 순위 올리는 핵심 3가지",
                  desc: "리뷰 수, 키워드 세팅, 저장수. 이 세 가지만 잡아도 경쟁 매장보다 2배 빠르게 상위에 오릅니다.",
                  readTime: "3분",
                  views: "12,400",
                  icon: Search,
                },
                {
                  tag: "리뷰 마케팅",
                  headerBg: "var(--h-navy-mid)",
                  title: "리뷰 하나가 신규 고객 10명을 데려오는 이유",
                  desc: "리뷰는 단순 평점이 아닙니다. 검색 알고리즘과 신뢰도를 동시에 올리는 방법을 소개합니다.",
                  readTime: "4분",
                  views: "8,730",
                  icon: Star,
                },
                {
                  tag: "업종별 전략",
                  headerBg: "var(--h-dark)",
                  title: "카페·의원·학원, 마케팅 채널이 달라야 하는 이유",
                  desc: "같은 비용을 써도 업종에 맞는 채널을 선택해야 ROI가 나옵니다. 업종별 최적 채널 선택 가이드.",
                  readTime: "5분",
                  views: "6,210",
                  icon: BarChart3,
                },
              ].map((post) => {
                const PostIcon = post.icon;
                return (
                  <Link key={post.title} href="/blog"
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">
                    <div className="p-5" style={{ background: post.headerBg }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                          <PostIcon size={16} className="text-white" strokeWidth={2} />
                        </div>
                        <span className="text-[11px] text-white/70 font-semibold">{post.views} 조회</span>
                      </div>
                      <span className="text-[11px] font-black text-white/90 uppercase tracking-wider">{post.tag}</span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-black text-gray-900 text-sm leading-snug mb-2 transition-colors flex-1 group-hover:opacity-80">{post.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{post.desc}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-[11px] text-gray-600">{post.readTime} 읽기</span>
                        <div className="flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all" style={{ color: "var(--h-navy)" }}>
                          읽으러 가기 <ArrowRight size={11} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {/* 더보기 카드 */}
              <Link href="/blog"
                className="group rounded-2xl border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center p-8 text-center min-h-[220px]"
                style={{ background: "var(--h-surface)", borderColor: "var(--h-border)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: "var(--h-border)" }}>
                  <BookOpen size={18} strokeWidth={1.5} style={{ color: "var(--h-dark)" }} />
                </div>
                <p className="font-black text-sm mb-1" style={{ color: "var(--h-dark)" }}>인사이트 더 보기</p>
                <p className="text-xs mb-4" style={{ color: "var(--h-muted)" }}>10년 노하우 전략 · 업종별 성공 공식</p>
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors" style={{ background: "var(--h-dark)", color: "white" }}>
                  전체 글 보기 <ArrowRight size={11} />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ══ SNS ══ */}
        <section className="py-10 md:py-14 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-6">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">SNS 채널에서도 만나보세요</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "네이버 블로그",
                  sub: "누적 조회 120만+",
                  desc: "마케팅 팁·성공 사례·업종별 전략 무료 공개",
                  preview: "최근 글: 네이버 플레이스 3개월 만에 1위 올린 방법",
                  href: "https://blog.naver.com/harangmarketing",
                  logo: "naver" as PlatformId,
                },
                {
                  label: "카카오톡 채널",
                  sub: "평균 응답 10분 이내",
                  desc: "지금 바로 무료 상담 연결",
                  preview: "현재 상담 가능 · 24시간 운영",
                  href: "https://pf.kakao.com/_MuUkG/chat",
                  logo: "kakao" as PlatformId,
                },
                {
                  label: "인스타그램",
                  sub: "작업 포트폴리오",
                  desc: "진행 현장·성공 사례·최신 소식",
                  preview: "팔로우하면 매주 마케팅 팁 무료 제공",
                  href: "https://www.instagram.com/jty0221/",
                  logo: "instagram" as PlatformId,
                },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all overflow-hidden"
                  style={{ borderColor: "var(--h-border)" }}>
                  <div className="flex items-center gap-4 p-5 pb-3">
                    <div className="shrink-0 group-hover:scale-105 transition-transform">
                      <PlatformLogo id={s.logo} size={48} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="font-bold text-gray-900 text-sm">{s.label}</div>
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-gray-50" style={{ color: brandTextColor(s.logo) }}>{s.sub}</span>
                      </div>
                      <div className="text-xs text-gray-500">{s.desc}</div>
                    </div>
                    <ChevronRight size={14} className="text-gray-500 shrink-0 transition-colors group-hover:opacity-60" />
                  </div>
                  <div className="mx-5 mb-4 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-[11px] text-gray-500 truncate">{s.preview}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 서비스 ══ */}
        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <RevealOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end mb-8">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-[3px]" style={{ background: "var(--h-amber)" }} />
                  <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--w-primary-strong)" }}>서비스</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black leading-tight" style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}>
                  카페·병원·학원,<br />업종마다 전략이 다릅니다
                </h2>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--h-muted)" }}>
                일괄 패키지 없이 업종별 데이터 기반으로<br />가장 효과적인 서비스를 추천해드립니다.
              </p>
            </div>
            </RevealOnScroll>

            {/* Editorial numbered service list */}
            <div style={{ borderTop: "1px solid var(--h-border)" }}>
              {SERVICES.map((service, idx) => {
                const Icon = service.icon;
                const num = String(idx + 1).padStart(2, "0");
                return (
                  <Link key={service.title} href="/services"
                    className="svc-row group flex items-center gap-4 md:gap-8 py-4 md:py-5 px-2 -mx-2">
                    {/* Number */}
                    <span className="text-[11px] font-black tabular-nums w-6 shrink-0" style={{ color: "var(--w-label-assistive)" }}>{num}</span>
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                      <Icon size={15} strokeWidth={2} style={{ color: "var(--h-navy)" }} />
                    </div>
                    {/* Title + badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-sm md:text-base" style={{ color: "var(--h-dark)" }}>{service.title}</h3>
                        {service.popular && (
                          <span className="text-[11px] font-black px-1.5 py-0.5 rounded" style={{ background: "var(--h-amber)", color: "white" }}>인기</span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm mt-0.5 line-clamp-1 hidden sm:block" style={{ color: "var(--h-muted)" }}>{service.desc}</p>
                    </div>
                    {/* Arrow */}
                    <ArrowRight size={14} strokeWidth={2} className="shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "var(--w-label-assistive)" }} />
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-black text-sm transition-opacity hover:opacity-90"
                style={{ background: "var(--h-dark)" }}>
                업종별 맞춤 전략 무료 진단 <ArrowRight size={15} />
              </Link>
              <Link href="/services"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-colors hover:bg-gray-50"
                style={{ color: "var(--h-navy)", border: "1px solid var(--h-border)" }}>
                전체 서비스 보기 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 네이버 플레이스 원리 ══ */}
        <section className="py-8 md:py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-4" style={{ background: "var(--h-surface)", color: "var(--h-navy)", border: "1px solid var(--h-border)" }}>
                  <Search size={10} strokeWidth={2.5} /> 10년 분석 인사이트
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-5 leading-snug">
                  네이버 플레이스 상위 노출,<br /><span style={{ color: "var(--h-navy)" }}>이 3가지가 핵심입니다</span>
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  많은 분들이 &lsquo;사진만 예쁘게 올리면 되는 거 아닌가요?&rsquo;라고 물어보세요.
                  하랑이 10년간 500개 매장을 분석한 결과는 다릅니다.
                </p>
                <div className="space-y-4">
                  {[
                    { rank: "1위", factor: "리뷰 수 · 최신성", weight: "40%", desc: "리뷰가 많고 최근에 달린 매장이 알고리즘에서 우선순위를 가집니다. 답글 달린 리뷰는 추가 가점.", bar: "w-[80%]", color: "bg-[#0C2351]" },
                    { rank: "2위", factor: "키워드 일치도", weight: "35%", desc: "업체명·카테고리·소개글의 키워드가 검색어와 얼마나 맞는지 분석합니다. 숨겨진 태그도 포함.", bar: "w-[70%]", color: "bg-[#1A3A6E]" },
                    { rank: "3위", factor: "저장수 · 클릭률", weight: "25%", desc: "플레이스 저장 및 클릭이 많을수록 인기 매장으로 인식됩니다. 체험단·SNS 연동이 여기를 올립니다.", bar: "w-[50%]", color: "bg-[#1860D5]" },
                  ].map((f) => (
                    <div key={f.rank} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white rounded-full w-5 h-5 flex items-center justify-center" style={{ background: "var(--h-navy)" }}>{f.rank.charAt(0)}</span>
                          <span className="text-sm font-bold text-gray-900">{f.factor}</span>
                        </div>
                        <span className="text-xs font-black" style={{ color: "var(--h-navy)" }}>{f.weight}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full mb-2">
                        <div className={`h-full rounded-full ${f.color} ${f.bar}`} />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900 text-base">경쟁 매장과 비교해보세요</h3>
                    <span className="text-[11px] font-black px-2 py-1 rounded-lg" style={{ color: "var(--h-navy)", background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>실제 사례 기반</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "리뷰 수", you: "12개", comp: "87개", bad: true },
                      { label: "최근 리뷰", you: "3개월 전", comp: "어제", bad: true },
                      { label: "키워드 설정", you: "미설정", comp: "20개+", bad: true },
                      { label: "플레이스 저장", you: "낮음", comp: "높음", bad: true },
                    ].map((row) => (
                      <div key={row.label} className="grid grid-cols-[80px_1fr_1fr] gap-2 text-xs">
                        <span className="text-gray-500 pt-1">{row.label}</span>
                        <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5 text-red-700 font-semibold">
                          <X size={10} strokeWidth={3} />{row.you}
                        </div>
                        <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-lg px-2.5 py-1.5 text-green-700 font-semibold">
                          <CheckCircle2 size={10} strokeWidth={3} />{row.comp}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] text-center">
                    <div className="text-red-700 font-bold">내 매장 (예시)</div>
                    <div className="text-green-700 font-bold">경쟁 매장 (예시)</div>
                  </div>
                </div>
                <Link href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
                  style={{ background: "var(--h-navy)" }}>
                  내 매장 플레이스 무료 진단받기 <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 패키지 가격대 ══ */}
        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--h-navy)" }}>구성</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">매장에 필요한 것만 골라 조합합니다</h2>
              <p className="text-gray-500 text-base max-w-xl mx-auto">
                정해둔 패키지 금액에 매장을 맞추지 않습니다.<br />
                아래는 실제로 나간 구성이고, 여기서 필요 없는 항목은 빼고 부족한 항목은 더해 다시 짜드립니다.
              </p>
            </div>

            {/* 가격 산출 근거 요약 */}
            <div className="rounded-2xl p-5 md:p-6 mb-8" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                {[
                  { label: "견적 방식", value: "항목 조합", note: "정찰제 패키지 없습니다" },
                  { label: "기준 단가", value: "블로그 4만원", note: "1편 기준 · 업종별 조정 · 부가세 별도" },
                  { label: "상담 · 현황 진단", value: "0원", note: "견적 받고 안 하셔도 됩니다" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-xl md:text-2xl font-black tabular-nums" style={{ color: "var(--h-navy)" }}>{item.value}</div>
                    <div className="text-xs font-bold text-gray-700 mt-0.5">{item.label}</div>
                    <div className="text-[11px] text-gray-600">{item.note}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 text-center mt-4">
                * 단가는 실제로 나간 견적서에 쓴 금액 그대로입니다. 부가세 별도이고 광고 집행비는 매체에 직접 나가는 실비라 대행료에 넣지 않습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 stagger-children">
              {PACKAGES.map((pkg) => (
                <div key={pkg.name} className={`relative rounded-2xl overflow-hidden card-hover ${pkg.popular ? "shadow-xl" : "shadow-sm"}`}
                  style={{ border: pkg.popular ? "2px solid var(--h-navy)" : "1px solid var(--h-border)" }}>
                  {pkg.popular && (
                    <div className="text-white text-xs font-black text-center py-2 tracking-wider uppercase" style={{ background: "var(--h-navy)" }}>
                      가장 많이 선택
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="inline-flex px-3 py-1.5 rounded-full text-white text-xs font-black" style={{ background: "var(--h-navy)" }}>
                        {pkg.name}
                      </div>
                      <span className="text-[11px] font-black px-2 py-1 rounded-lg" style={{ color: "var(--h-navy)", background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>{pkg.roi}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-5 leading-relaxed">{pkg.desc}</p>
                    <ul className="space-y-2.5 mb-6">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 size={14} className="shrink-0" strokeWidth={2.5} style={{ color: "var(--h-navy)" }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact"
                      className={`block text-center py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 ${pkg.popular ? "text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      style={pkg.popular ? { background: "var(--h-navy)" } : {}}>
                      이 구성으로 문의하기
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-500 mt-6 leading-relaxed">
              * 같은 구성이어도 출발점 · 현재 순위 · 상권 경쟁도에 따라 붙는 항목과 물량이 달라집니다.{" "}
              <Link href="/services#pricing" className="inline-flex items-center min-h-11 md:min-h-0 font-bold underline underline-offset-2" style={{ color: "var(--h-navy)" }}>
                항목별 단가와 계산 과정 보기
              </Link>
            </p>
          </div>
        </section>

        {/* ══ 비교표 ══ */}
        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-7">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-4" style={{ color: "var(--h-navy)", background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                <ShieldCheck size={11} strokeWidth={2.5} /> 직접 비교
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">하랑마케팅이 다른 이유</h2>
              <p className="text-gray-500 text-base">선택 전, 꼭 확인해보세요</p>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <div className="grid grid-cols-[160px_1fr_1fr]">
                <div className="p-5 text-xs font-bold uppercase tracking-wider flex items-end" style={{ background: "var(--h-dark)", color: "#99A1AF" }}>구분</div>
                <div className="p-5 text-center" style={{ background: "var(--h-navy)" }}>
                  <div className="text-white font-black text-sm tracking-wide">하랑마케팅</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>10년 경력 · 데이터 기반</div>
                </div>
                <div className="p-5 text-center" style={{ background: "var(--h-surface)" }}>
                  <div className="font-bold text-sm" style={{ color: "#374151" }}>일반 대행사</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--h-muted)" }}>일반적인 경우</div>
                </div>
              </div>
              {COMPARE_ITEMS.map((item, i) => (
                <div key={item.category} className={`grid grid-cols-[160px_1fr_1fr] border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <div className="p-4 md:p-5 font-black text-gray-600 text-xs flex items-center border-r border-gray-100">{item.category}</div>
                  <div className="p-4 md:p-5 border-r" style={{ background: "rgba(12,35,81,0.03)", borderColor: "var(--h-border)" }}>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "var(--h-navy)" }}>
                        <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                      </div>
                      <span className="text-gray-800 text-xs md:text-sm leading-relaxed font-medium">{item.harang}</span>
                    </div>
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                        <X size={9} className="text-red-400" strokeWidth={3} />
                      </div>
                      <span className="text-gray-500 text-xs md:text-sm leading-relaxed">{item.general}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-[160px_1fr_1fr] border-t border-gray-200">
                <div className="bg-gray-50 p-4" />
                <div className="p-4 text-center" style={{ background: "var(--h-navy)" }}>
                  <Link href="/contact" className="inline-flex items-center gap-1.5 text-white text-xs font-black bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                    무료 상담 신청 <ArrowRight size={11} />
                  </Link>
                </div>
                <div className="p-4" style={{ background: "var(--h-surface)" }} />
              </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {COMPARE_ITEMS.map((item) => (
                <div key={item.category} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="px-4 py-2.5 text-xs font-black" style={{ background: "var(--h-dark)", color: "#9CA3AF" }}>{item.category}</div>
                  <div className="divide-y divide-gray-100">
                    <div className="flex items-start gap-3 p-4 bg-blue-50/50">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "var(--h-navy)" }}>
                        <CheckCircle2 size={11} className="text-white" strokeWidth={3} />
                      </div>
                      <div>
                        <div className="text-[11px] font-black mb-0.5" style={{ color: "var(--h-navy)" }}>하랑마케팅</div>
                        <span className="text-gray-800 text-xs leading-relaxed font-medium">{item.harang}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                        <X size={10} className="text-red-400" strokeWidth={3} />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-gray-500 mb-0.5">일반 대행사</div>
                        <span className="text-gray-500 text-xs leading-relaxed">{item.general}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/contact" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white text-sm font-black mt-2 transition-opacity hover:opacity-90"
                style={{ background: "var(--h-navy)" }}>
                무료 상담 신청 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 성공 사례 미리보기 ══ */}
        <section className="py-8 md:py-12 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--h-navy)" }}>진행 사례</p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">실제 매장, 실제 수치입니다</h2>
                <p className="text-gray-500 text-sm">과장 없는 실제 클라이언트의 before·after 데이터</p>
              </div>
              <Link href="/cases" className="inline-flex items-center gap-1.5 font-bold text-sm hover:underline shrink-0 min-h-11 md:min-h-0" style={{ color: "var(--h-navy)" }}>
                전체 사례 보기 <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {CASE_CARDS.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.industry} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* 비주얼 헤더 (사진 대체) — 그라데이션을 쓰지 않는다 (WDS) */}
                    <div className="px-5 py-6 relative overflow-hidden" style={{ backgroundColor: "var(--h-navy)" }}>
                      <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
                      <div className="absolute -right-2 -bottom-6 w-14 h-14 bg-white/8 rounded-full" />
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3 shadow-sm">
                          <Icon size={18} className="text-white" strokeWidth={2} />
                        </div>
                        <div className="text-white font-black text-base leading-tight">{c.industry}</div>
                        <div className="text-white/70 text-[11px] mt-0.5">{c.location}</div>
                        <div className="mt-3 inline-flex items-center gap-1 bg-white/15 border border-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                          {c.service}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 text-center">
                          <div className="text-[11px] font-black text-red-700 mb-0.5 uppercase">Before</div>
                          <div className="text-[11px] text-gray-600 mb-1 leading-tight">{c.before.label}</div>
                          <div className="text-sm font-black text-red-700">{c.before.value}</div>
                        </div>
                        <div className="rounded-xl p-2.5 text-center" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                          <div className="text-[11px] font-black mb-0.5 uppercase" style={{ color: "var(--h-navy)" }}>After</div>
                          <div className="text-[11px] text-gray-600 mb-1 leading-tight">{c.after.label}</div>
                          <div className="text-sm font-black" style={{ color: "var(--h-navy)" }}>{c.after.value}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-600">{c.period}</span>
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full" style={{ color: "var(--h-navy)", background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>{c.highlight}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-6">
              <Link href="/cases"
                className="inline-flex items-center gap-2 px-5 py-3 md:py-2.5 rounded-xl border text-gray-600 font-bold text-sm transition-colors hover:opacity-80" style={{ borderColor: "var(--h-border)" }}>
                더 많은 사례 보기 <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 후기 — editorial format ══ */}
        <section style={{ background: "var(--h-surface)" }}>
          {/* Section header */}
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-10 md:pt-16 pb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-[2px]" style={{ background: "var(--h-amber)" }} />
                  <span className="text-[11px] font-black tracking-[0.22em] uppercase" style={{ color: "var(--w-primary-strong)" }}>
                    Client Testimonials
                  </span>
                </div>
                <h2
                  className="font-black leading-tight"
                  style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.03em", color: "var(--h-dark)" }}
                >
                  실제 사장님들의<br />성장 이야기
                </h2>
              </div>
              <div className="flex items-center gap-8 shrink-0">
                {[
                  { val: "10년+", label: "대표 경력" },
                  { val: SITE.stats.renewalRate, label: "재계약률" },
                  { val: "500+", label: "누적 고객사" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl md:text-3xl font-black tabular-nums" style={{ color: "var(--h-amber)" }}>
                      {s.val}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--h-muted)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="border-t" style={{ borderColor: "var(--h-border)" }}>
            <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 text-center">
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
                style={{ border: "1.5px solid var(--h-border)", color: "var(--h-dark)", background: "white" }}
              >
                전체 성공 사례 보기 <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>


        {/* ══ 유튜브 채널 섹션 ══ */}
        <YouTubeSectionNew />

        {/* ══ 지역 커버리지 ══ */}
        <section className="py-12 md:py-16 bg-gray-950 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">전국 서비스</p>
                <h2 className="text-xl md:text-2xl font-black text-white mb-1">어디든 달려갑니다</h2>
                <p className="text-gray-400 text-sm">온라인 진행 기본, 수도권 현장 방문 가능</p>
                {/* 지역 허브는 sitemap 에만 있고 들어갈 링크가 없어 고립돼 있었다 */}
                <Link
                  href="/location"
                  className="mt-2 inline-flex items-center gap-1 min-h-11 md:min-h-0 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  지역별 안내 자세히 보기 <ArrowRight size={12} />
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "서울", href: "/location/seoul" },
                  { name: "경기도", href: "/location/gyeonggi" },
                  { name: "인천", href: "/location/incheon" },
                  { name: "부산", href: "/contact?region=부산" },
                  { name: "대구", href: "/contact?region=대구" },
                  { name: "전국", href: "/contact" },
                ].map(r => (
                  <Link key={r.name} href={r.href}
                    className="inline-flex items-center px-3 py-1.5 min-h-11 md:min-h-0 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-bold hover:bg-white/10 hover:text-white transition-colors">
                    {r.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 용어 정의 — 정의형 질의 대응 (AEO) ══ */}
        <GlossarySection />

        {/* ══ FAQ 섹션 — 화면 노출 + FAQPage 구조화 데이터 (HOME_LD 와 짝) ══ */}
        <FaqAccordion
          items={CORE_FAQ}
          title="사장님들이 가장 많이 묻는 질문"
          subtitle="10년간 상담하며 가장 많이 받은 질문을 그대로 정리했습니다. 상담 전에 미리 확인해보세요."
          showMoreHref="/faq"
        />

        {/* ══ 무료 가이드 리드 마그넷 ══ */}
        <section className="py-8 md:py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="bg-blue-600 rounded-3xl p-6 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
              <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 mb-4">
                    <FileText size={12} className="text-white" />
                    <span className="text-white text-xs font-bold">무료 가이드</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
                    플레이스 순위를 올리는<br />7가지 체크리스트
                  </h2>
                  <p className="text-blue-50 text-sm leading-relaxed mb-6">
                    10년간 500개 매장 데이터에서 추출한 플레이스 SEO 핵심 포인트.
                    지금 무료 상담 신청하면 PDF로 바로 보내드립니다.
                  </p>
                  <div className="space-y-2">
                    {[
                      "리뷰 수·답글률·사진 수 최적 기준표",
                      "경쟁사 분석 방법 3단계",
                      "한 달 만에 순위 오르는 우선순위 액션 7가지",
                    ].map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-blue-200 shrink-0" strokeWidth={2.5} />
                        <span className="text-blue-50 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 lg:w-52">
                  <Link href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-black px-6 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm text-center">
                    무료 가이드 받기 <ArrowRight size={15} />
                  </Link>
                  <p className="text-blue-50 text-xs text-center">상담 신청 후 카카오톡으로 전송</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 최종 CTA ══ */}
        <section className="py-12 md:py-20 bg-gray-950 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-blue-600/8 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-indigo-600/8 blur-3xl rounded-full" />
            <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          </div>

          <div className="relative max-w-3xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-gray-400 text-xs font-medium">상담 신청 24시간 접수</span>
            </div>

            <h2 className="text-[36px] md:text-[52px] font-black text-white leading-tight mb-5">
              오늘 상담하면,<br />
              <span className="text-blue-400">내일 전략 리포트</span>가 옵니다
            </h2>

            <p className="text-gray-400 text-base md:text-lg mb-10 leading-relaxed max-w-xl mx-auto">
              업종·경쟁사·현재 순위를 분석해<br className="hidden md:block" />
              무엇을 먼저 해야 할지 정확히 알려드립니다. 비용 0원.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-[18px] rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base transition-all shadow-2xl shadow-blue-600/30 hover:-translate-y-0.5">
                <FileText size={16} /> 무료 상담 신청 (0원)
              </Link>
              <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-base transition-all">
                <MessageCircle size={16} /> 카카오톡 상담
              </a>
              <a href="tel:010-7541-9054"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/15 hover:border-white/30 text-white font-medium text-base transition-all">
                <Phone size={16} /> 010-7541-9054
              </a>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                { icon: ShieldCheck, text: "상담 비용 0원" },
                { icon: Handshake, text: "계약 강요 없음" },
                { icon: Clock, text: "24시간 내 대표가 직접 연락" },
                { icon: Star, text: `재계약률 ${SITE.stats.renewalRate}` },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Icon size={12} className="text-blue-500" strokeWidth={2} />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
