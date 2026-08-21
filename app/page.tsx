"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, X, Phone, MessageCircle,
  TrendingUp, Users, Star, BarChart3, FileText, MapPin,
  Search, BookOpen, Megaphone, AtSign, ChevronRight,
  ShieldCheck, Clock, Handshake, Quote,
  Coffee, Scissors, GraduationCap, Stethoscope,
  UtensilsCrossed, ShoppingBag,
} from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import AnimatedCounter from "./components/AnimatedCounter";
import YouTubeSectionNew from "./components/YouTubeSection";
import PhotoPlaceholder from "./components/PhotoPlaceholder";
import RevealOnScroll from "./components/RevealOnScroll";
import ClientLogosSection from "./components/ClientLogosSection";
import { PlatformLogo, brandColor } from "./sns/PlatformLogo";
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

/* ─── AEO/GEO 구조화 데이터 (홈) ───────────────────
   FAQPage·DefinedTermSet 는 아래 화면에 실제로 렌더링되는
   FaqAccordion / GlossarySection 과 1:1로 대응한다.
   둘 중 하나를 지우면 나머지도 반드시 함께 지울 것. */
const HOME_LD = [
  webPageLd({
    path: "/",
    name: "하랑마케팅 — 소상공인 전문 마케팅 대행사",
    description: ANSWER_SENTENCES.whoWeAre,
  }),
  breadcrumbLd([{ name: "홈", path: "/" }]),
  faqLd(CORE_FAQ, `${SITE.base}/`),
  definitionsLd("/"),
];

/* ─── Data ─────────────────────────────────────── */

const INDUSTRIES = [
  {
    icon: Coffee,
    name: "카페·베이커리",
    color: "from-blue-500 to-blue-700",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-100",
    points: ["플레이스 상위 3위 진입", "포토리뷰 전략", "인스타 비주얼"],
    result: "+167%",
    resultLabel: "월 방문객",
    before: "일 방문 28명",
    after: "일 방문 75명",
    duration: "3개월",
    location: "경기 고양",
  },
  {
    icon: UtensilsCrossed,
    name: "음식점·배달",
    color: "from-blue-600 to-indigo-700",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-100",
    points: ["배달앱 리뷰 전략", "맘카페 바이럴", "블로그 맛집 등록"],
    result: "+113%",
    resultLabel: "월 배달 매출",
    before: "월 매출 480만",
    after: "월 매출 1,022만",
    duration: "4개월",
    location: "경기 고양",
  },
  {
    icon: Scissors,
    name: "미용·네일·뷰티",
    color: "from-blue-500 to-blue-700",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-100",
    points: ["인스타 포트폴리오", "체험단 모집", "예약 전환 최적화"],
    result: "예약 완전 마감",
    resultLabel: "진행 6주 후",
    before: "예약 가동률 40%",
    after: "예약 100% 마감",
    duration: "2개월",
    location: "경기 파주",
  },
  {
    icon: Stethoscope,
    name: "의원·한의원·피부과",
    color: "from-blue-600 to-blue-800",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-100",
    points: ["블로그 신뢰도 강화", "체험단 후기", "플레이스 SEO"],
    result: "+175%",
    resultLabel: "월 신규 예약",
    before: "월 신규 12건",
    after: "월 신규 33건",
    duration: "4개월",
    location: "경기 안양",
  },
  {
    icon: GraduationCap,
    name: "학원·교육",
    color: "from-blue-700 to-indigo-800",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-100",
    points: ["맘카페 입소문", "홈페이지형 블로그", "블로그 지역 키워드"],
    result: "+55%",
    resultLabel: "수강생",
    before: "수강생 62명",
    after: "수강생 96명",
    duration: "3개월",
    location: "경기 고양",
  },
  {
    icon: ShoppingBag,
    name: "온라인 쇼핑몰",
    color: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-100",
    points: ["블로그 SEO 최적화", "체험단 후기 확보", "콘텐츠 마케팅"],
    result: "+64%",
    resultLabel: "월 매출",
    before: "월 매출 230만",
    after: "월 매출 377만",
    duration: "4개월",
    location: "전국 온라인",
  },
];

const SERVICES = [
  { icon: Search, title: "플레이스 SEO 최적화", desc: "업종별 주요 키워드를 분석해 네이버 플레이스 검색 상위에 올려드립니다.", color: "from-blue-600 to-blue-700", popular: true },
  { icon: Star, title: "리뷰 마케팅", desc: "좋은 리뷰를 꾸준히 쌓아 처음 찾아오는 손님의 선택을 이끌어냅니다.", color: "from-blue-500 to-blue-700", popular: true },
  { icon: AtSign, title: "인스타그램 마케팅", desc: "콘텐츠 기획부터 릴스·광고 운영까지 인스타그램 채널 성장을 전담합니다.", color: "from-blue-600 to-indigo-700", popular: true },
  { icon: FileText, title: "블로그 배포(기자단)", desc: "전문 작가가 매장 맞춤 글을 작성하고 20개 이상의 채널에 동시에 올립니다.", color: "from-blue-500 to-blue-700" },
  { icon: BookOpen, title: "홈페이지형 블로그 제작", desc: "네이버 블로그를 전문 홈페이지처럼 꾸며 신뢰도와 검색 노출을 높입니다.", color: "from-blue-600 to-blue-800" },
  { icon: MapPin, title: "카카오맵 마케팅", desc: "카카오맵 플레이스를 최적화해 지역 검색 상위 노출과 방문객을 늘립니다.", color: "from-blue-500 to-blue-700" },
  { icon: Users, title: "체험단 모집 대행", desc: "실제 방문 후기를 남길 체험단을 모집해 믿을 수 있는 리뷰를 만들어드립니다.", color: "from-blue-600 to-indigo-700" },
  { icon: TrendingUp, title: "플레이스 순위상승", desc: "방문자·저장·리뷰 등 여러 항목을 함께 관리해 플레이스 순위를 올려드립니다.", color: "from-blue-600 to-blue-800" },
  { icon: BarChart3, title: "블로그 관리 대행", desc: "꾸준한 글쓰기와 검색 최적화로 블로그 노출을 높이고 방문자를 유지합니다.", color: "from-blue-500 to-blue-700" },
  { icon: Megaphone, title: "맘카페 바이럴", desc: "지역 맘카페·육아 커뮤니티를 통해 주요 고객층에 입소문을 만들어드립니다.", color: "from-blue-600 to-blue-800" },
];

const COMPARE_ITEMS = [
  { category: "전략 설계", harang: "업종별 맞춤형 전략 (카페·병원·쇼핑몰 특화)", general: "일괄 패키지, 템플릿 기반" },
  { category: "분석 방식", harang: "데이터 기반, 매출 직접 연동 추적", general: "노출·클릭 수 위주, 감각 운영" },
  { category: "보고 체계", harang: "월 2회 상세 리포트 + 주간 최적화", general: "월 1회 간단 보고, 설정 후 방치" },
  { category: "담당자", harang: "10년 경력 대표가 1:1 전담", general: "신입 담당자 수시 교체" },
  { category: "성과 기준", harang: "실제 방문객·예약·매출 기준", general: "노출 수·팔로워 수 등 허수 지표" },
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
    name: "스타터",
    priceHint: "월 30~50만원대",
    desc: "처음 시작하는 분들을 위한 기본 패키지",
    roi: "투자 대비 평균 1.8배 효과",
    features: ["플레이스 SEO 최적화", "블로그 관리 (주 2회)", "월 리포트 1회"],
    color: "from-blue-500 to-blue-600",
    popular: false,
  },
  {
    name: "그로스",
    priceHint: "월 70~100만원대",
    desc: "빠른 성장이 필요한 매장을 위한 핵심 패키지",
    roi: "투자 대비 평균 2.4배 효과",
    features: ["플레이스 SEO + 순위상승", "블로그 배포 (월 4건)", "체험단 모집 대행", "리뷰 마케팅", "월 리포트 2회"],
    color: "from-blue-600 to-indigo-600",
    popular: true,
  },
  {
    name: "풀패키지",
    priceHint: "월 150만원~",
    desc: "멀티채널 통합 운영이 필요한 업체",
    roi: "투자 대비 평균 3.1배 효과",
    features: ["그로스 전체 포함", "인스타그램 마케팅", "맘카페 바이럴", "카카오맵 마케팅", "주간 최적화 리포트"],
    color: "from-blue-700 to-indigo-800",
    popular: false,
  },
];


const TRUST_ITEMS = [
  { icon: ShieldCheck, title: "검증된 10년 경력", desc: "대학생 서포터즈부터 시작해 500개 이상 프로젝트 직접 진행", color: "from-blue-600 to-blue-800" },
  { icon: Handshake, title: "95% 재계약률", desc: "성과로 증명. 고객이 먼저 다시 찾는 대행사", color: "from-blue-500 to-blue-700" },
  { icon: Clock, title: "24시간 내 응답", desc: "문의 후 24시간 이내 연락, 평일 항상 대응", color: "from-blue-600 to-indigo-700" },
  { icon: TrendingUp, title: "매출 중심 관리", desc: "노출 수가 아닌 실제 매출 증대를 목표로 운영", color: "from-blue-700 to-indigo-800" },
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
            { label: "재계약률", value: "95%" },
            { label: "시작 비용", value: "월 30만원~" },
          ]}
        />

        {/* ══ 신뢰 마퀸 배너 ══ */}
        <div className="py-3 overflow-hidden" style={{ background: "var(--h-navy)" }}>
          <div className="flex animate-marquee whitespace-nowrap">
            {([
              { text: "플레이스 Top 5 진입 · 평균 6주 만에", dot: "bg-white/60" },
              { text: "재계약률 95% · 500+ 프로젝트", dot: "bg-blue-200" },
              { text: "월 신규 예약 +175% · 경기 안양 한의원", dot: "bg-white/60" },
              { text: "대표 직접 담당 · 상담 비용 0원", dot: "bg-blue-200" },
              { text: "방문객 +167% · 경기 고양 카페", dot: "bg-white/60" },
              { text: "배달 매출 +113% · 경기 고양 음식점", dot: "bg-blue-200" },
              { text: "수강생 +55% · 경기 고양 학원", dot: "bg-white/60" },
              { text: "예약 완전 마감 · 경기 파주 네일샵", dot: "bg-blue-200" },
              { text: "상담 비용 0원 · 계약 강요 없음", dot: "bg-white/60" },
              { text: "10년+ 경력 · 업종별 맞춤 전략", dot: "bg-blue-200" },
              { text: "24시간 내 연락 보장", dot: "bg-white/60" },
              { text: "이번 달 신규 상담 잔여 2자리", dot: "bg-blue-200" },
              { text: "투자 대비 1.8배 효과 · 3개월 실측치", dot: "bg-white/60" },
              { text: "블로그 지역 키워드 4주 만에 상위권", dot: "bg-blue-200" },
              { text: "카카오맵 리뷰 0 → 78개 · 2개월", dot: "bg-white/60" },
              { text: "매출 월평균 +89% · 3개월 계약 기준", dot: "bg-blue-200" },
              { text: "플레이스 지역 음식점 1위 달성", dot: "bg-white/60" },
            ] as { text: string; dot: string }[])
              .concat(([
                { text: "플레이스 Top 5 진입 · 평균 6주 만에", dot: "bg-white/60" },
                { text: "재계약률 95% · 500+ 프로젝트", dot: "bg-blue-200" },
                { text: "월 신규 예약 +175% · 경기 안양 한의원", dot: "bg-white/60" },
                { text: "대표 직접 담당 · 상담 비용 0원", dot: "bg-blue-200" },
                { text: "방문객 +167% · 경기 고양 카페", dot: "bg-white/60" },
                { text: "배달 매출 +113% · 경기 고양 음식점", dot: "bg-blue-200" },
                { text: "수강생 +55% · 경기 고양 학원", dot: "bg-white/60" },
                { text: "예약 완전 마감 · 경기 파주 네일샵", dot: "bg-blue-200" },
                { text: "상담 비용 0원 · 계약 강요 없음", dot: "bg-white/60" },
                { text: "10년+ 경력 · 업종별 맞춤 전략", dot: "bg-blue-200" },
                { text: "24시간 내 연락 보장", dot: "bg-white/60" },
                { text: "이번 달 신규 상담 잔여 2자리", dot: "bg-blue-200" },
                { text: "투자 대비 1.8배 효과 · 3개월 실측치", dot: "bg-white/60" },
                { text: "블로그 지역 키워드 4주 만에 상위권", dot: "bg-blue-200" },
                { text: "카카오맵 리뷰 0 → 78개 · 2개월", dot: "bg-white/60" },
                { text: "매출 월평균 +89% · 3개월 계약 기준", dot: "bg-blue-200" },
                { text: "플레이스 지역 음식점 1위 달성", dot: "bg-white/60" },
              ] as { text: string; dot: string }[]))
              .map((item, i) => (
                <span key={i} className="flex items-center gap-3 px-6 text-xs text-white font-semibold">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.dot} shrink-0`} />
                  {item.text}
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
                        <p className="text-[11px] text-gray-400">1{r.unit}당</p>
                      </div>
                      <p className="text-[15px] font-black text-blue-600 tabular-nums shrink-0">{r.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

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
                          <div className="text-[11px] font-bold text-red-500 mb-1">BEFORE</div>
                          <div className="text-xs font-semibold" style={{ color: "var(--h-muted)" }}>{ind.before}</div>
                        </div>
                        <ChevronRight size={14} strokeWidth={1.5} style={{ color: "var(--h-border)" }} className="shrink-0" />
                        <div className="flex-1 text-center">
                          <div className="text-[11px] font-bold mb-1" style={{ color: "var(--h-blue)" }}>AFTER</div>
                          <div className="text-xs font-bold" style={{ color: "var(--h-dark)" }}>{ind.after}</div>
                        </div>
                      </div>

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
                <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-amber)" }}>왜 하랑인가</span>
                <div className="w-6 h-[2px]" style={{ background: "var(--h-amber)" }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}>이런 고민, 해결된 증거 있습니다</h2>
              <p className="text-sm" style={{ color: "var(--h-muted)" }}>마케팅 대행사와 일해본 사장님들이 가장 많이 하는 말 — 하랑이 어떻게 바꿨는지</p>
            </div>
            </RevealOnScroll>
            <div className="space-y-4">
              {[
                {
                  q: "광고비는 쓰는데 매출이 안 늘어요",
                  a: "업종 특성을 무시한 일괄 마케팅이 원인입니다. 하랑은 카페·병원·학원 등 업종별 실데이터 기반 맞춤 전략만 설계합니다. 같은 비용으로 효과가 다릅니다.",
                  result: "매출 평균 +89%",
                  period: "3개월 계약 실측치",
                  icon: TrendingUp,
                  iconColor: "from-blue-500 to-blue-700",
                  cardBorder: "border-blue-100",
                  badgeBg: "bg-blue-50",
                  badgeText: "text-blue-700",
                },
                {
                  q: "보고서를 봐도 뭔지 모르겠어요",
                  a: "복잡한 마케팅 용어 없이 방문객 수·예약 수·매출 변화를 숫자로만 보고드립니다. 대표가 직접 카카오톡으로 설명합니다.",
                  result: "재계약률 95%",
                  period: "6개월 이상 계약 기준",
                  icon: BarChart3,
                  iconColor: "from-blue-600 to-blue-800",
                  cardBorder: "border-blue-100",
                  badgeBg: "bg-blue-50",
                  badgeText: "text-blue-700",
                },
                {
                  q: "담당자가 계속 바뀌어서 지쳐요",
                  a: "하랑은 계약부터 종료까지 대표가 직접 담당합니다. 10년 현장 경험을 가진 전문가가 처음부터 끝까지 함께합니다.",
                  result: "담당자 교체 0회",
                  period: "10년 전 계약부터 현재까지",
                  icon: Handshake,
                  iconColor: "from-blue-600 to-indigo-700",
                  cardBorder: "border-blue-100",
                  badgeBg: "bg-blue-50",
                  badgeText: "text-blue-700",
                },
                {
                  q: "마케팅이 효과 있는지 도통 모르겠어요",
                  a: "플레이스 순위·방문자·리뷰 증감을 매월 2회 수치로 정리해 공유합니다. '감'이 아닌 숫자로 성과를 확인하실 수 있습니다.",
                  result: "월 2회 성과 리포트",
                  period: "전 클라이언트 공통 적용",
                  icon: BarChart3,
                  iconColor: "from-blue-700 to-indigo-800",
                  cardBorder: "border-blue-100",
                  badgeBg: "bg-blue-50",
                  badgeText: "text-blue-700",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <RevealOnScroll key={item.q} delay={idx * 60}>
                  <div className="bg-white rounded-2xl border p-5 md:p-7 hover:shadow-lg transition-all group" style={{ borderColor: "var(--h-border)" }}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      {/* content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--h-muted)" }}>고객 고민</p>
                        <h3 className="font-black text-base md:text-lg leading-snug mb-2" style={{ color: "var(--h-dark)" }}>"{item.q}"</h3>
                        <p className="text-sm leading-relaxed pl-3" style={{ borderLeft: "2px solid var(--h-amber)", color: "#4B5563" }}>{item.a}</p>
                      </div>
                      {/* result badge — amber */}
                      <div className="shrink-0">
                        <div className="inline-flex flex-col items-center gap-0.5 px-5 py-4 rounded-2xl min-w-[100px] text-center" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                          <span className="text-lg md:text-xl font-black tabular-nums" style={{ color: "var(--h-amber)" }}>{item.result}</span>
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

        {/* ══ 파트너 로고 슬라이더 ══ */}
        <ClientLogosSection />

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
                  <p className="text-xs mt-4 font-semibold" style={{ color: "var(--h-muted)" }}>— 하랑마케팅 대표</p>
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
                    { label: "결과 미달 시 조정", sub: "성과 보장" },
                    { label: "외주 없음", sub: "대표 직접 전담" },
                  ].map((b) => (
                    <div key={b.label} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                      <div className="text-xs font-black text-gray-900 mb-0.5">{b.label}</div>
                      <div className="text-[11px] text-gray-400">{b.sub}</div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gray-950 hover:bg-gray-800 text-white font-bold text-sm transition-colors"
                >
                  대표와 직접 상담하기 <ArrowRight size={14} />
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
                    { val: "95%", label: "재계약률" },
                    { val: "500+", label: "완료 프로젝트" },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl py-3">
                      <div className="text-base font-black text-gray-900">{s.val}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{s.label}</div>
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
                <p className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-amber)" }}>10년 운영 데이터</p>
              </div>
            </RevealOnScroll>

            {/* Editorial large stats — divided columns */}
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderLeft: "1px solid var(--h-border)" }}>
              {[
                { to: 500, suffix: "+", label: "완료 프로젝트", sub: "2020년~현재" },
                { to: 95, suffix: "%", label: "재계약률", sub: "6개월 이상 계약 기준" },
                { to: 10, suffix: "년+", label: "대표 경력", sub: "직접 담당 전담" },
                { to: 89, suffix: "%", label: "평균 매출 상승", sub: "3개월 계약 실측치" },
              ].map((item, i) => (
                <RevealOnScroll key={item.label} delay={i * 70}>
                  <div className="px-5 md:px-8 py-6 md:py-8" style={{ borderRight: "1px solid var(--h-border)" }}>
                    <div className="editorial-num tabular-nums mb-1" style={{ color: "var(--h-dark)" }}>
                      <AnimatedCounter to={item.to} suffix={item.suffix} duration={1600} />
                    </div>
                    <div className="text-sm font-bold text-gray-700 mb-0.5">{item.label}</div>
                    <div className="text-[11px]" style={{ color: "var(--h-muted)" }}>{item.sub}</div>
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

        {/* ══ 결과 보장 약속 ══ */}
        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            {/* Section header — editorial style */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end mb-8">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-[3px]" style={{ background: "var(--h-amber)" }} />
                  <p className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-amber)" }}>하랑의 약속</p>
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
                { icon: Handshake, num: "02", title: "대표 직접 담당", desc: "외주·인턴 없이 대표가 직접 매장을 분석하고 전략을 세웁니다. 담당자가 바뀌는 일이 없습니다." },
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
              <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-amber)" }}>진행 과정</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end mb-8">
              <h2 className="text-3xl md:text-5xl font-black leading-tight" style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}>
                신청 후 4단계,<br />전부 대표가 직접 합니다
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--h-muted)" }}>
                상담부터 성과 보고까지<br />외주 없이 대표가 직접 담당
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
                  <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-amber)" }}>무료 마케팅 인사이트</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}>
                  10년 노하우, 무료로 읽어보세요
                </h2>
                <p className="text-sm" style={{ color: "var(--h-muted)" }}>실전에서 검증된 소상공인 마케팅 전략을 공개합니다</p>
              </div>
              <Link href="/blog"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-colors shadow-sm hover:opacity-90"
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
                  title: "카페·의원·학원 — 마케팅 채널이 달라야 하는 이유",
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
                        <span className="text-[11px] text-gray-400">{post.readTime} 읽기</span>
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
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">SNS 채널에서도 만나보세요</p>
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
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-gray-50" style={{ color: brandColor(s.logo) }}>{s.sub}</span>
                      </div>
                      <div className="text-xs text-gray-400">{s.desc}</div>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 shrink-0 transition-colors group-hover:opacity-60" />
                  </div>
                  <div className="mx-5 mb-4 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-[11px] text-gray-400 truncate">{s.preview}</p>
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
                  <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-amber)" }}>서비스</span>
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
                    <span className="text-[11px] font-black tabular-nums w-6 shrink-0" style={{ color: "var(--h-border)" }}>{num}</span>
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
                    <ArrowRight size={14} strokeWidth={2} className="shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "var(--h-border)" }} />
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
                  많은 분들이 "사진만 예쁘게 올리면 되는 거 아닌가요?"라고 물어보세요.
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
                        <span className="text-gray-400 pt-1">{row.label}</span>
                        <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5 text-red-600 font-semibold">
                          <X size={10} strokeWidth={3} />{row.you}
                        </div>
                        <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-lg px-2.5 py-1.5 text-green-600 font-semibold">
                          <CheckCircle2 size={10} strokeWidth={3} />{row.comp}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] text-center">
                    <div className="text-red-500 font-bold">내 매장 (예시)</div>
                    <div className="text-green-600 font-bold">경쟁 매장 (예시)</div>
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
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--h-navy)" }}>패키지</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">대략적인 가격대가 궁금하신가요?</h2>
              <p className="text-gray-500 text-base max-w-xl mx-auto">
                아래는 예시 패키지이며, 실제 견적은 업종·목표·상황에 따라 달라집니다.<br />
                상담 후 최적 조합을 제안해드립니다.
              </p>
            </div>

            {/* ROI 계산 힌트 */}
            <div className="rounded-2xl p-5 md:p-6 mb-8" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                {[
                  { label: "월 마케팅 비용", value: "50만원", note: "그로스 패키지 기준" },
                  { label: "평균 매출 증가", value: "+120만원", note: "3개월 평균 실측치" },
                  { label: "투자 대비 수익", value: "2.4배", note: "ROI 기준" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-xl md:text-2xl font-black" style={{ color: "var(--h-navy)" }}>{item.value}</div>
                    <div className="text-xs font-bold text-gray-700 mt-0.5">{item.label}</div>
                    <div className="text-[11px] text-gray-400">{item.note}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-4">* 실제 수치는 업종·지역·시작 상태에 따라 다릅니다. 무료 상담에서 업종별 예상 ROI를 안내해드립니다.</p>
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
                    <div className="text-lg font-black text-gray-900 mb-0.5">{pkg.priceHint}</div>
                    <p className="text-xs text-gray-400 mb-5">{pkg.desc}</p>
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
                      이 패키지 문의하기
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              * 가격은 서비스 구성·업종·목표에 따라 달라집니다. 정확한 견적은 무료 상담 후 안내드립니다.
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
                <div className="p-5 text-xs font-bold uppercase tracking-wider flex items-end" style={{ background: "var(--h-dark)", color: "#6B7280" }}>구분</div>
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
                      <span className="text-gray-400 text-xs md:text-sm leading-relaxed">{item.general}</span>
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
                        <div className="text-[11px] font-black text-gray-400 mb-0.5">일반 대행사</div>
                        <span className="text-gray-400 text-xs leading-relaxed">{item.general}</span>
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
                <p className="text-gray-400 text-sm">과장 없는 실제 클라이언트의 before·after 데이터</p>
              </div>
              <Link href="/cases" className="inline-flex items-center gap-1.5 font-bold text-sm hover:underline shrink-0" style={{ color: "var(--h-navy)" }}>
                전체 사례 보기 <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {[
                {
                  industry: "카페",
                  location: "경기 고양",
                  service: "플레이스 SEO + 블로그",
                  before: { label: "플레이스 순위", value: "12위" },
                  after: { label: "플레이스 순위", value: "2위" },
                  period: "6주",
                  highlight: "월 매출 +47%",
                  color: "from-blue-500 to-blue-700",
                  icon: Coffee,
                },
                {
                  industry: "미용실",
                  location: "서울 강서",
                  service: "블로그 + 체험단",
                  before: { label: "월 신규 고객", value: "8명" },
                  after: { label: "월 신규 고객", value: "31명" },
                  period: "3개월",
                  highlight: "신규 유입 3.9배",
                  color: "from-blue-600 to-indigo-700",
                  icon: Scissors,
                },
                {
                  industry: "음식점",
                  location: "인천 부평",
                  service: "플레이스 SEO + 리뷰",
                  before: { label: "리뷰 개수", value: "12개" },
                  after: { label: "리뷰 개수", value: "86개" },
                  period: "4개월",
                  highlight: "예약 문의 4배",
                  color: "from-blue-700 to-blue-900",
                  icon: UtensilsCrossed,
                },
                {
                  industry: "한의원",
                  location: "경기 안양",
                  service: "블로그 + 플레이스 SEO",
                  before: { label: "초진 예약", value: "월 15건" },
                  after: { label: "초진 예약", value: "월 45건" },
                  period: "4개월",
                  highlight: "초진 예약 +200%",
                  color: "from-blue-600 to-indigo-700",
                  icon: Stethoscope,
                },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.industry} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* 그라데이션 비주얼 헤더 (사진 대체) */}
                    <div className={`bg-gradient-to-br ${c.color} px-5 py-6 relative overflow-hidden`}>
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
                          <div className="text-[11px] font-black text-red-400 mb-0.5 uppercase">Before</div>
                          <div className="text-[11px] text-gray-400 mb-1 leading-tight">{c.before.label}</div>
                          <div className="text-sm font-black text-red-500">{c.before.value}</div>
                        </div>
                        <div className="rounded-xl p-2.5 text-center" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                          <div className="text-[11px] font-black mb-0.5 uppercase" style={{ color: "var(--h-navy)" }}>After</div>
                          <div className="text-[11px] text-gray-400 mb-1 leading-tight">{c.after.label}</div>
                          <div className="text-sm font-black" style={{ color: "var(--h-navy)" }}>{c.after.value}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-400">{c.period}</span>
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full" style={{ color: "var(--h-navy)", background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>{c.highlight}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-6">
              <Link href="/cases"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-gray-600 font-bold text-sm transition-colors hover:opacity-80" style={{ borderColor: "var(--h-border)" }}>
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
                  <span className="text-[11px] font-black tracking-[0.22em] uppercase" style={{ color: "var(--h-amber)" }}>
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
                  { val: "95%", label: "재계약률" },
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

          {/* Editorial testimonials — full width stacked */}
          {[
            {
              name: "카페 사장님", location: "경기 고양", service: "플레이스 SEO",
              metric: "+167%", metricLabel: "방문객 · 3개월",
              text: "3개월 만에 주요 키워드 1위가 됐어요. 주말엔 대기줄이 생겼습니다. 처음엔 반신반의했는데 정말 효과가 있을 줄 몰랐어요.",
            },
            {
              name: "피부과 원장님", location: "서울 강서", service: "인스타그램 마케팅",
              metric: "+300%", metricLabel: "신규 예약 · 6개월",
              text: "인스타그램 신규 예약이 6개월 만에 3배가 됐습니다. 보고서도 이해하기 쉬웠고, 대표님이 항상 직접 연락 주시는 게 신뢰가 갔어요.",
            },
            {
              name: "학원 원장님", location: "경기 고양", service: "맘카페 바이럴",
              metric: "+55%", metricLabel: "수강생 · 2개월",
              text: "맘카페 바이럴 하나로 수강생이 50% 늘었습니다. 지역 엄마들 사이에서 입소문이 났어요. 이전 대행사랑 비교가 안 될 정도예요.",
            },
          ].map((t) => (
            <div key={t.name} className="border-t" style={{ borderColor: "var(--h-border)" }}>
              <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
                <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_120px] gap-6 md:gap-10 items-start">
                  <div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={12} className="fill-blue-400 text-blue-400" />
                      ))}
                    </div>
                    <div className="text-sm font-black" style={{ color: "var(--h-dark)" }}>{t.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--h-muted)" }}>{t.location}</div>
                    <div
                      className="text-[11px] font-bold mt-2 px-2 py-1 rounded-lg inline-block"
                      style={{ background: "var(--h-border)", color: "#4B5563" }}
                    >
                      {t.service}
                    </div>
                  </div>
                  <p
                    className="font-black leading-snug"
                    style={{
                      fontSize: "clamp(18px, 2.5vw, 28px)",
                      letterSpacing: "-0.02em",
                      color: "var(--h-dark)",
                    }}
                  >
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="md:text-right">
                    <div className="text-3xl md:text-4xl font-black tabular-nums" style={{ color: "var(--h-amber)" }}>
                      {t.metric}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--h-muted)" }}>{t.metricLabel}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

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
                <p className="text-gray-500 text-sm">온라인 진행 기본, 수도권 현장 방문 가능</p>
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
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-bold hover:bg-white/10 hover:text-white transition-colors">
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
                  <p className="text-blue-100 text-sm leading-relaxed mb-6">
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
                        <span className="text-blue-100 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 lg:w-52">
                  <Link href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-black px-6 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm text-center">
                    무료 가이드 받기 <ArrowRight size={15} />
                  </Link>
                  <p className="text-blue-200 text-xs text-center">상담 신청 후 카카오톡으로 전송</p>
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
              <span className="text-gray-400 text-xs font-medium">지금 상담 가능 · 오늘 3명 신청</span>
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
                { icon: Clock, text: "24시간 내 대표 직접 연락" },
                { icon: Star, text: "재계약률 95%" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-gray-600">
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
