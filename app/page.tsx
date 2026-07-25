"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, X, Phone, MessageCircle,
  TrendingUp, Users, Star, BarChart3, FileText, MapPin,
  Search, BookOpen, Megaphone, AtSign, ChevronRight, ChevronDown,
  ShieldCheck, Clock, Handshake, Quote,
  Coffee, Scissors, GraduationCap, Stethoscope,
  UtensilsCrossed, ShoppingBag, Calculator,
} from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import AnimatedCounter from "./components/AnimatedCounter";
import YouTubeCard from "./components/YouTubeCard";
import PhotoPlaceholder from "./components/PhotoPlaceholder";
import RevealOnScroll from "./components/RevealOnScroll";
import ReviewsSection from "./components/ReviewsSection";
import ClientLogosSection from "./components/ClientLogosSection";
import DifferenceSection from "./components/DifferenceSection";
import EntryPopup from "./components/EntryPopup";
import RegionalSection from "./components/RegionalSection";

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
  { icon: ShieldCheck, title: "검증된 10년 경력", desc: "2014년부터 500개 이상 프로젝트 직접 진행", color: "from-blue-600 to-blue-800" },
  { icon: Handshake, title: "95% 재계약률", desc: "성과로 증명. 고객이 먼저 다시 찾는 대행사", color: "from-blue-500 to-blue-700" },
  { icon: Clock, title: "24시간 내 응답", desc: "문의 후 24시간 이내 연락, 평일 항상 대응", color: "from-blue-600 to-indigo-700" },
  { icon: TrendingUp, title: "매출 중심 관리", desc: "노출 수가 아닌 실제 매출 증대를 목표로 운영", color: "from-blue-700 to-indigo-800" },
];

/* ─── Countdown Hook ────────────────────────────── */

function useMonthEndCountdown() {
  const getSecondsLeft = () => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
    return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  };
  const [secs, setSecs] = useState<number | null>(null);
  useEffect(() => {
    setSecs(getSecondsLeft());
    const id = setInterval(() => setSecs(getSecondsLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  const d = secs === null ? null : Math.floor(secs / 86400);
  const h = secs === null ? null : Math.floor((secs % 86400) / 3600);
  const m = secs === null ? null : Math.floor((secs % 3600) / 60);
  const s = secs === null ? null : secs % 60;
  return { d, h, m, s };
}

/* ─── ChecklistSection ──────────────────────────── */

const CHECKLIST_ITEMS = [
  "플레이스에 우리 매장이 3페이지 이후에 있다",
  "리뷰가 경쟁 매장에 비해 현저히 적다",
  "SNS는 있는데 팔로워가 늘지 않는다",
  "마케팅 대행사에 맡겼는데 효과를 모르겠다",
  "광고비 대비 실제 방문객이 늘지 않는다",
  "블로그 포스팅이 검색에 잘 안 잡힌다",
  "어떤 마케팅을 해야 할지 방향을 모르겠다",
  "담당자가 자주 바뀌어 처음부터 다시 설명해야 했다",
];

function ChecklistSection() {
  const [checked, setChecked] = React.useState<Set<number>>(new Set());
  const toggle = (i: number) => setChecked((prev) => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });
  const count = checked.size;
  const urgency = count >= 5 ? { text: "즉시 전략 점검이 필요합니다", color: "text-red-400" }
    : count >= 3 ? { text: "마케팅 방향 재설정이 필요합니다", color: "text-amber-400" }
    : count >= 1 ? { text: "개선 여지가 있습니다", color: "text-white/70" }
    : { text: "해당 항목을 클릭해보세요", color: "text-gray-500" };

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="rounded-2xl p-6 md:p-10 shadow-xl" style={{ background: "var(--h-navy)" }}>
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>Self-Check</p>
            <h2 className="text-xl md:text-2xl font-black text-white mb-2">
              지금 이 중 하나라도 해당되시나요?
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>해당 항목을 클릭하면 얼마나 시급한지 알 수 있습니다</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {CHECKLIST_ITEMS.map((item, i) => (
              <button
                key={item}
                onClick={() => toggle(i)}
                className={`flex items-start gap-3 rounded-xl px-4 py-3 border text-left transition-all ${
                  checked.has(i)
                    ? "bg-white/25 border-white/50"
                    : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40"
                }`}
              >
                <div className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                  checked.has(i) ? "border-white bg-white" : "border-white/40 bg-white/20"
                }`}>
                  {checked.has(i) && <CheckCircle2 size={10} strokeWidth={3} style={{ color: "var(--h-navy)" }} />}
                </div>
                <span className={`text-sm leading-relaxed transition-colors ${checked.has(i) ? "text-white font-semibold" : "text-blue-50"}`}>
                  {item}
                </span>
              </button>
            ))}
          </div>
          {/* Counter */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="inline-flex items-center gap-3 bg-white/20 border border-white/30 rounded-xl px-5 py-3 anim-float-slow">
              <div className="text-2xl font-black text-white">{count}<span className="text-blue-200 text-base font-normal">/8</span></div>
              <div className="text-sm font-bold text-white">{urgency.text}</div>
            </div>
          </div>

          {/* 진단 결과 — 3개 이상 체크 시 */}
          {count >= 3 && (
            <div className="mb-6 bg-white/15 border border-white/30 rounded-xl p-5">
              <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-3">하랑마케팅 추천 솔루션</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { label: "플레이스 SEO", desc: "검색·지도 노출 상위 진입" },
                  { label: "블로그 마케팅", desc: "키워드 검색 유입 증대" },
                  { label: "리뷰 마케팅", desc: "신뢰도·재방문율 상승" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/30 bg-white/20 px-3 py-2.5 text-white">
                    <div className="font-black text-sm mb-0.5">{s.label}</div>
                    <div className="text-[11px] text-blue-100">{s.desc}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-blue-200 mt-3">· 무료 상담에서 업종별 최적 조합을 안내해드립니다</p>
            </div>
          )}

          <div className="text-center">
            <Link href={count > 0 ? `/contact?checklist=${count}` : "/contact"}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-base transition-opacity hover:opacity-90 shadow-lg"
              style={{ background: "white", color: "var(--h-navy)" }}>
              {count >= 3 ? `${count}가지 문제 지금 해결하기` : count > 0 ? `${count}가지 무료 진단받기` : "무료 전략 진단 신청"}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Component ─────────────────────────────────── */

function PromoSection() {
  const { d, h, m, s } = useMonthEndCountdown();
  const pad = (n: number | null) => n === null ? "--" : String(n).padStart(2, "0");
  return (
    <section className="py-10 md:py-12 border-y" style={{ background: "var(--h-bg)", borderColor: "var(--h-border)" }}>
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--h-navy)" }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--h-navy)" }}>이번 달 한정</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-1">
              신규 상담 3팀에게 무료 경쟁사 분석 리포트 제공
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              내 업종 상위 경쟁 매장 분석 · 키워드 격차 리포트 · 맞춤 전략 제안 — 비용 없이 받아보세요.
            </p>
            {/* Countdown */}
            <div className="inline-flex items-center gap-1.5 bg-white rounded-xl px-3 py-2 shadow-sm" style={{ border: "1px solid var(--h-border)" }}>
              <span className="text-[10px] text-gray-400 font-semibold mr-1">마감까지</span>
              {[{ val: pad(d), label: "일" }, { val: pad(h), label: "시간" }, { val: pad(m), label: "분" }, { val: pad(s), label: "초" }].map(({ val, label }, i) => (
                <React.Fragment key={label}>
                  {i > 0 && <span className="font-black text-sm" style={{ color: "var(--h-muted)" }}>:</span>}
                  <div className="flex flex-col items-center">
                    <span className="text-base font-black text-gray-900 tabular-nums leading-none">{val}</span>
                    <span className="text-[8px] text-gray-400">{label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((n) => (
                  <div key={n} className={`w-6 h-6 rounded-lg border text-[10px] font-black flex items-center justify-center ${n <= 1 ? "line-through" : n <= 2 ? "" : "bg-gray-100 border-gray-200 text-gray-300"}`}
                    style={n <= 2 ? { background: "var(--h-surface)", borderColor: "var(--h-border)", color: n <= 1 ? "var(--h-muted)" : "var(--h-navy)" } : {}}>
                    {n}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-400">3팀 중 1팀 남음</span>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 shadow-sm"
              style={{ background: "var(--h-navy)" }}>
              지금 신청하기 <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────
// 유튜브 영상 목록 — 영상 ID를 실제 값으로 교체하세요
// YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
// ──────────────────────────────────────────
const YOUTUBE_VIDEOS = [
  {
    videoId: "LWjHEAujJr0",
    title: "리뷰 마케팅 실전 전략 — 소상공인이 꼭 알아야 할 리뷰 관리법",
    desc: "리뷰 수집부터 답글·활용까지, 매출로 연결되는 리뷰 마케팅 전 과정",
    badge: "리뷰 마케팅",
  },
  {
    videoId: "owgcIulD8xk",
    title: "네이버 플레이스 예약·쿠폰·마케팅 메시지 100% 활용법",
    desc: "예약 시스템·쿠폰 설정·마케팅 메시지로 재방문율 높이는 실전 가이드",
    badge: "플레이스 활용",
  },
  {
    videoId: "1oiqvVTtF_w",
    title: "네이버 플레이스 등록부터 SEO 최적화 세팅까지 한 번에",
    desc: "플레이스 신규 등록 방법과 상위 노출을 위한 SEO 세팅 완전 정복",
    badge: "플레이스 SEO",
  },
];

function YouTubeSection() {
  const hasRealVideos = YOUTUBE_VIDEOS.some(v => !v.videoId.startsWith("PLACEHOLDER"));
  return (
    <section className="py-14 md:py-20 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">YouTube</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
              마케팅 노하우, 영상으로 공유합니다
            </h2>
            <p className="text-gray-500 text-sm">실전 전략을 무료로 공개 — 구독하면 최신 영상을 받아볼 수 있습니다</p>
          </div>
          <a
            href="https://www.youtube.com/@madaenam"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            채널 구독하기
          </a>
        </div>

        {hasRealVideos ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {YOUTUBE_VIDEOS.map(v => (
              <YouTubeCard key={v.videoId} {...v} />
            ))}
          </div>
        ) : (
          /* 영상 ID 미입력 상태 — 채널 배너만 표시 */
          <a
            href="https://www.youtube.com/@madaenam"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-red-900/40 to-gray-900 border border-red-500/20 p-8 md:p-10 text-center hover:border-red-500/40 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-red-900/40 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <h3 className="text-xl font-black text-white mb-2">마대남 — 마케팅 대신 해주는 남자</h3>
              <p className="text-gray-400 text-sm mb-5">
                소상공인 마케팅 실전 전략을 영상으로 무료 공개합니다.<br />
                플레이스 SEO, 리뷰 마케팅, SNS 전략 등 바로 써먹는 콘텐츠
              </p>
              <span className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                유튜브 채널 바로가기
              </span>
            </div>
          </a>
        )}
      </div>
    </section>
  );
}

const HOME_FAQS = [
  {
    q: "상담 비용이 있나요?",
    a: "아니요, 완전 무료입니다. 초기 상담부터 경쟁사 분석 리포트까지 비용이 없습니다. 계약 여부와 관계없이 현황 분석 자료를 드립니다.",
  },
  {
    q: "계약 최소 기간이 얼마나 되나요?",
    a: "최소 3개월을 권장합니다. 플레이스 SEO는 2~4주부터 순위 변동이 시작되고, 블로그는 3개월부터 검색 유입이 안정됩니다. 1개월 단위 계약도 가능하지만 성과가 충분히 나오기 전에 종료될 수 있습니다.",
  },
  {
    q: "성과가 보장되나요?",
    a: "100% 보장은 드리기 어렵습니다. 다만 95%의 재계약률과 500곳 이상의 실제 성과가 증명합니다. 진행 전 업종·지역 경쟁 현황을 분석해 현실적인 예상 수치를 먼저 알려드립니다.",
  },
  {
    q: "외주 작가가 아닌 대표가 직접 하는 건가요?",
    a: "네, 하랑마케팅은 대표가 직접 전략을 수립하고 담당합니다. 외주 제작도 대표 감수 후 납품됩니다. 중간 관리자나 외주에 떠넘기는 방식은 사용하지 않습니다.",
  },
  {
    q: "어떤 업종이든 가능한가요?",
    a: "카페, 음식점, 미용, 병원·의원, 학원, 쇼핑몰 등 소상공인·1인 사업자라면 모두 가능합니다. 다만 일부 업종(성인 콘텐츠, 불법 사업자 등)은 진행이 어렵습니다.",
  },
  {
    q: "지역 제한이 있나요?",
    a: "전국 가능합니다. 서울·경기·인천 수도권뿐 아니라 부산, 대구, 대전, 광주 등 전국 어디든 온라인으로 진행할 수 있습니다. 현장 방문이 필요한 경우 협의합니다.",
  },
];

function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-14 md:py-20" style={{ background: "var(--h-bg)" }}>
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="w-6 h-[2px]" style={{ background: "var(--h-amber)" }} />
            <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-amber)" }}>FAQ</span>
            <div className="w-6 h-[2px]" style={{ background: "var(--h-amber)" }} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}>상담 전에 가장 많이 물어보시는 것들</h2>
          <p className="text-sm" style={{ color: "var(--h-muted)" }}>더 궁금한 게 있으시면 카카오톡으로 바로 물어보세요</p>
        </div>
        <div className="space-y-2">
          {HOME_FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border" style={{ borderColor: "var(--h-border)" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50"
              >
                <span className="font-bold text-sm" style={{ color: "var(--h-dark)" }}>{faq.q}</span>
                <ChevronDown size={16} className={`shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} style={{ color: "var(--h-muted)" }} />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm leading-relaxed pt-3 border-t" style={{ color: "#4B5563", borderColor: "var(--h-border)" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/faq" className="inline-flex items-center gap-1.5 font-bold text-sm hover:underline" style={{ color: "var(--h-blue)" }}>
            전체 FAQ 보기 <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <EntryPopup />
      <Header />
      <main>

        {/* ══ Hero — 클로드 디자인 영상 히어로 ══ */}
        <HeroSection />

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
              <p className="text-[10px] font-black uppercase tracking-[0.18em] shrink-0" style={{ color: "var(--h-muted)" }}>운영 플랫폼</p>
              <div className="h-px flex-1 hidden sm:block" style={{ background: "var(--h-border)" }} />
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 md:gap-5">
                {[
                  { name: "네이버 플레이스", letter: "N" },
                  { name: "카카오맵", letter: "K" },
                  { name: "배달의민족", letter: "B" },
                  { name: "쿠팡이츠", letter: "C" },
                  { name: "인스타그램", letter: "I" },
                  { name: "구글 리뷰", letter: "G" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white" style={{ background: "var(--h-navy)" }}>
                      {p.letter}
                    </div>
                    <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "var(--h-muted)" }}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 차별화 비교표 ══ */}
        <DifferenceSection />

        {/* ══ 견적 계산기 배너 ══ */}
        <section className="py-8 border-b" style={{ background: "var(--h-bg)", borderColor: "var(--h-border)" }}>
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-1" style={{ color: "var(--h-blue)" }}>신규 · 3분 완성</p>
                <p className="text-base md:text-lg font-black" style={{ color: "var(--h-dark)" }}>
                  내 업종·예산에 맞는 마케팅 패키지가 궁금하신가요?
                </p>
                <p className="text-sm" style={{ color: "var(--h-muted)" }}>업종을 선택하면 예상 ROI와 추천 패키지를 즉시 계산해드립니다</p>
              </div>
              <Link href="/estimate"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-black text-sm transition-opacity hover:opacity-90 shadow-sm"
                style={{ background: "var(--h-navy)" }}>
                <Calculator size={15} />
                패키지 견적 계산기
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 업종별 특화 ══ */}
        <section className="py-16 md:py-24" style={{ background: "var(--h-bg)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-12">
              <RevealOnScroll>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-[2px]" style={{ background: "var(--h-navy)" }} />
                    <p className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-navy)" }}>실제 성과 데이터</p>
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
                  <Link key={ind.name} href={`/contact?industry=${encodeURIComponent(ind.name)}`}
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
                        <div className="text-[10px] mt-0.5" style={{ color: "var(--h-muted)" }}>{ind.resultLabel}</div>
                      </div>
                    </div>

                    <div className="p-5">
                      {/* before / after */}
                      <div className="flex items-center gap-2 mb-4 rounded-xl p-3" style={{ background: "var(--h-bg)", border: "1px solid var(--h-border)" }}>
                        <div className="flex-1 text-center">
                          <div className="text-[10px] font-bold text-red-500 mb-1">BEFORE</div>
                          <div className="text-xs font-semibold" style={{ color: "var(--h-muted)" }}>{ind.before}</div>
                        </div>
                        <ChevronRight size={14} strokeWidth={1.5} style={{ color: "var(--h-border)" }} className="shrink-0" />
                        <div className="flex-1 text-center">
                          <div className="text-[10px] font-bold mb-1" style={{ color: "var(--h-blue)" }}>AFTER</div>
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
        <section className="py-16 md:py-20" style={{ background: "var(--h-bg)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <RevealOnScroll>
            <div className="text-center mb-12">
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
                        <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--h-muted)" }}>고객 고민</p>
                        <h3 className="font-black text-base md:text-lg leading-snug mb-2" style={{ color: "var(--h-dark)" }}>"{item.q}"</h3>
                        <p className="text-sm leading-relaxed pl-3" style={{ borderLeft: "2px solid var(--h-amber)", color: "#4B5563" }}>{item.a}</p>
                      </div>
                      {/* result badge — amber */}
                      <div className="shrink-0">
                        <div className="inline-flex flex-col items-center gap-0.5 px-5 py-4 rounded-2xl min-w-[100px] text-center" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                          <span className="text-lg md:text-xl font-black tabular-nums" style={{ color: "var(--h-amber)" }}>{item.result}</span>
                          <span className="text-[10px] font-medium" style={{ color: "var(--h-muted)" }}>{item.period}</span>
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

        {/* ══ 고객 후기 ══ */}
        <ReviewsSection />

        {/* ══ 파트너 로고 슬라이더 ══ */}
        <ClientLogosSection />

        {/* ══ 대표 소개 ══ */}
        <section className="py-16 md:py-24 bg-white">
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
                  해병대 장교로 전역 후 전 재산을 털어 일산에서 카페를 창업했다가 실패했습니다. 그때 마케팅 대행사에게 사기도 당했습니다.
                  그 절박함을 직접 겪었기 때문에 <strong className="text-gray-800">대표님의 돈을 제 돈처럼 무겁게 생각합니다.</strong>
                  이후 10년간 수도권·전국 현장을 직접 뛰어 소상공인 500곳 이상과 함께 성장해왔습니다.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-7">
                  {[
                    { label: "해병대 장교 출신", sub: "책임감·원칙" },
                    { label: "카페 창업 실패", sub: "현장 공감" },
                    { label: "수도권·전국 10년", sub: "현장 전문가" },
                    { label: "500+ 클라이언트", sub: "검증된 성과" },
                    { label: "결과 미달 시 조정", sub: "성과 보장" },
                    { label: "외주 없음", sub: "대표 직접 전담" },
                  ].map((b) => (
                    <div key={b.label} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                      <div className="text-xs font-black text-gray-900 mb-0.5">{b.label}</div>
                      <div className="text-[10px] text-gray-400">{b.sub}</div>
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
                      <div className="text-[10px] text-gray-400 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div></RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ══ 지역 밀착 마케팅 ══ */}
        <RegionalSection />

        {/* ══ 체크리스트 공감 ══ */}
        <ChecklistSection />

        {/* ══ 신뢰 지표 (카운터) ══ */}
        <section className="py-16 md:py-24 bg-white overflow-hidden" style={{ borderTop: "1px solid var(--h-border)", borderBottom: "1px solid var(--h-border)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-[3px]" style={{ background: "var(--h-amber)" }} />
                <p className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-amber)" }}>10년 운영 데이터</p>
              </div>
            </RevealOnScroll>

            {/* Editorial large stats — divided columns */}
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderLeft: "1px solid var(--h-border)" }}>
              {[
                { to: 500, suffix: "+", label: "완료 프로젝트", sub: "2015년~현재" },
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
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            {/* Section header — editorial style */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end mb-14">
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
        <section className="py-16 md:py-24 overflow-hidden" style={{ background: "var(--h-surface)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <RevealOnScroll>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[3px]" style={{ background: "var(--h-amber)" }} />
              <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-amber)" }}>진행 과정</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end mb-14">
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
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
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
        <section className="py-14 md:py-20" style={{ background: "var(--h-surface)" }}>
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
                        <span className="text-[10px] text-white/70 font-semibold">{post.views} 조회</span>
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
                  bg: "bg-green-500",
                  ring: "ring-green-100",
                  textColor: "text-green-600",
                  letter: "N",
                },
                {
                  label: "카카오톡 채널",
                  sub: "평균 응답 10분 이내",
                  desc: "지금 바로 무료 상담 연결",
                  preview: "현재 상담 가능 · 24시간 운영",
                  href: "https://pf.kakao.com/_MuUkG/chat",
                  bg: "bg-yellow-400",
                  ring: "ring-yellow-100",
                  textColor: "text-yellow-600",
                  darkText: true,
                  letter: "K",
                },
                {
                  label: "인스타그램",
                  sub: "작업 포트폴리오",
                  desc: "진행 현장·성공 사례·최신 소식",
                  preview: "팔로우하면 매주 마케팅 팁 무료 제공",
                  href: "https://www.instagram.com/jty0221/",
                  bg: "bg-gradient-to-br from-purple-500 to-pink-500",
                  ring: "ring-purple-100",
                  textColor: "text-purple-600",
                  letter: "I",
                },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all overflow-hidden"
                  style={{ borderColor: "var(--h-border)" }}>
                  <div className="flex items-center gap-4 p-5 pb-3">
                    <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center font-black text-xl shadow-sm shrink-0 group-hover:scale-105 transition-transform ${s.darkText ? "text-gray-900" : "text-white"}`}>
                      {s.letter}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="font-bold text-gray-900 text-sm">{s.label}</div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-gray-50 ${s.textColor}`}>{s.sub}</span>
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
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <RevealOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end mb-14">
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
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ background: "var(--h-amber)", color: "white" }}>인기</span>
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
        <section className="py-14 md:py-20 bg-gray-50 border-t border-gray-100">
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
                    <span className="text-[10px] font-black px-2 py-1 rounded-lg" style={{ color: "var(--h-navy)", background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>실제 사례 기반</span>
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
                  <div className="mt-5 grid grid-cols-2 gap-2 text-[10px] text-center">
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
        <section className="py-16 md:py-24 bg-white">
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
                    <div className="text-[10px] text-gray-400">{item.note}</div>
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
                      <span className="text-[10px] font-black px-2 py-1 rounded-lg" style={{ color: "var(--h-navy)", background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>{pkg.roi}</span>
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
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
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
                        <div className="text-[10px] font-black mb-0.5" style={{ color: "var(--h-navy)" }}>하랑마케팅</div>
                        <span className="text-gray-800 text-xs leading-relaxed font-medium">{item.harang}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                        <X size={10} className="text-red-400" strokeWidth={3} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-gray-400 mb-0.5">일반 대행사</div>
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
        <section className="py-14 md:py-20 bg-white border-t border-gray-100">
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
                        <div className="mt-3 inline-flex items-center gap-1 bg-white/15 border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {c.service}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 text-center">
                          <div className="text-[9px] font-black text-red-400 mb-0.5 uppercase">Before</div>
                          <div className="text-[10px] text-gray-400 mb-1 leading-tight">{c.before.label}</div>
                          <div className="text-sm font-black text-red-500">{c.before.value}</div>
                        </div>
                        <div className="rounded-xl p-2.5 text-center" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                          <div className="text-[9px] font-black mb-0.5 uppercase" style={{ color: "var(--h-navy)" }}>After</div>
                          <div className="text-[10px] text-gray-400 mb-1 leading-tight">{c.after.label}</div>
                          <div className="text-sm font-black" style={{ color: "var(--h-navy)" }}>{c.after.value}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">{c.period}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ color: "var(--h-navy)", background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>{c.highlight}</span>
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
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-16 md:pt-24 pb-8">
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
                  { val: "4.9/5", label: "평균 만족도" },
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
                        <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
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

        {/* ══ 기간별 성과 타임라인 ══ */}
        <section className="py-14 md:py-20 bg-white border-t" style={{ borderColor: "var(--h-border)" }}>
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-10">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <div className="w-6 h-[2px]" style={{ background: "var(--h-amber)" }} />
                  <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-amber)" }}>성과 타임라인</span>
                  <div className="w-6 h-[2px]" style={{ background: "var(--h-amber)" }} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}>
                  언제부터 효과가 나타날까요?
                </h2>
                <p className="text-sm max-w-md mx-auto" style={{ color: "var(--h-muted)" }}>500+ 프로젝트 데이터 기반 평균 타임라인입니다. 업종·경쟁 강도에 따라 달라질 수 있습니다.</p>
              </div>
            </RevealOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  period: "1개월차",
                  color: "from-blue-500 to-blue-700",
                  items: [
                    "플레이스 정보 최적화 완료",
                    "블로그 키워드 3~5건 게시",
                    "초기 순위 변화 시작",
                    "체험단 리뷰 10개+ 확보",
                  ],
                  highlight: "순위 변화 감지",
                },
                {
                  period: "3개월차",
                  color: "from-blue-600 to-indigo-700",
                  items: [
                    "플레이스 Top 5~10 진입",
                    "블로그 월 방문자 100명+",
                    "리뷰 30개 이상 축적",
                    "SNS 팔로워 300~500명",
                  ],
                  highlight: "대부분 성과 체감",
                },
                {
                  period: "6개월차",
                  color: "from-blue-700 to-indigo-800",
                  items: [
                    "주요 키워드 1~3위 목표",
                    "브랜드 인지도 지역 내 정착",
                    "리뷰 100개+ 자생 구조",
                    "신규 고객 월 30명+ 유입",
                  ],
                  highlight: "매출 지속 우상향",
                },
              ].map((phase, i) => (
                <RevealOnScroll key={phase.period} delay={i * 100}>
                  <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--h-border)" }}>
                    <div className={`bg-gradient-to-br ${phase.color} px-5 py-4`}>
                      <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">목표</div>
                      <div className="text-white font-black text-xl">{phase.period}</div>
                      <div className="text-blue-100 text-xs font-semibold mt-1">{phase.highlight}</div>
                    </div>
                    <div className="p-5 space-y-2.5" style={{ background: "var(--h-bg)" }}>
                      {phase.items.map((item) => (
                        <div key={item} className="flex items-start gap-2.5">
                          <CheckCircle2 size={13} className="shrink-0 mt-0.5" strokeWidth={2.5} style={{ color: "var(--h-blue)" }} />
                          <span className="text-sm leading-snug" style={{ color: "#374151" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-xs mb-4" style={{ color: "var(--h-muted)" }}>* 위 수치는 평균값이며 업종·예산·경쟁 강도에 따라 달라집니다.</p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-black text-sm transition-colors shadow-sm hover:opacity-90"
                style={{ background: "var(--h-dark)" }}>
                내 업종 예상 성과 상담받기 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 마케팅 인사이트 ══ */}
        <section className="py-14 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">마케팅 인사이트</p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">소상공인이 꼭 알아야 할 것들</h2>
                <p className="text-gray-400 text-sm">10년 현장 경험에서 나온 실전 인사이트</p>
              </div>
              <Link href="/blog"
                className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:underline shrink-0">
                인사이트 전체 보기 <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {[
                {
                  tag: "플레이스 SEO",
                  tagColor: "bg-blue-50 text-blue-600 border-blue-100",
                  title: "2024 네이버 플레이스 상위 노출 알고리즘 완전 분석",
                  preview: "리뷰 수, 답글률, 저장 수 — 순위를 결정하는 7가지 요소를 실제 데이터로 분석했습니다.",
                  readTime: "8분",
                  accent: "border-l-blue-500",
                  href: "/blog/naver-place-algorithm",
                },
                {
                  tag: "리뷰 마케팅",
                  tagColor: "bg-blue-50 text-blue-600 border-blue-100",
                  title: "네이버 플레이스 리뷰 100개 만들기 — 실전 로드맵",
                  preview: "리뷰 요청 문자 템플릿, 사장님 답글 공식, 3개월 단계별 로드맵을 공개합니다.",
                  readTime: "8분",
                  accent: "border-l-blue-500",
                  href: "/blog/naver-place-review-100",
                },
                {
                  tag: "업종별 전략",
                  tagColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
                  title: "맘카페 바이럴 마케팅 완전 가이드 — 수강생 55% 늘린 전략",
                  preview: "자연스럽게 입소문을 내면서 효과를 내는 방법, 업종별 콘텐츠 포인트를 공개합니다.",
                  readTime: "7분",
                  accent: "border-l-indigo-500",
                  href: "/blog/momcafe-viral-guide",
                },
                {
                  tag: "SNS 마케팅",
                  tagColor: "bg-blue-50 text-blue-700 border-blue-100",
                  title: "인스타그램 릴스로 예약 폭발 — 미용실 성공 케이스",
                  preview: "수원 네일샵이 릴스 3개로 2주 만에 예약을 마감한 실제 사례와 해시태그 전략.",
                  readTime: "7분",
                  accent: "border-l-blue-600",
                  href: "/blog/instagram-reels-beauty",
                },
              ].map((post) => (
                <Link
                  key={post.title}
                  href={post.href}
                  className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 ${post.accent}`}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black ${post.tagColor}`}>{post.tag}</span>
                      <span className="text-[10px] text-gray-300">{post.readTime}</span>
                    </div>
                    <h3 className="font-black text-gray-900 text-sm leading-snug mb-2.5 group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{post.preview}</p>
                    <div className="flex items-center gap-1 mt-4 text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                      읽기 <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 이달의 프로모션 ══ */}
        <PromoSection />

        {/* ══ 자주 묻는 질문 (홈) ══ */}
        <section id="faq" className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">FAQ</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">상담 전에 궁금하신 것들</h2>
            </div>
            <div className="space-y-2">
              {[
                { q: "상담 비용이 있나요? 계약을 강요하진 않나요?", a: "상담 비용은 완전 무료입니다. 분석 결과를 공유해드리고, 진행 여부는 전적으로 사장님 결정입니다. 상담 후 '지금은 아니다'고 하셔도 전혀 괜찮습니다." },
                { q: "효과가 없으면 어떻게 되나요?", a: "3개월 기준으로 협의한 목표에 미달하면 다음 달 비용을 조정합니다. 단, 계약 전에 현실적으로 달성 가능한 목표를 먼저 솔직하게 말씀드립니다. 어렵다고 판단하면 계약을 권하지 않습니다." },
                { q: "매달 비용이 얼마나 드나요?", a: "기본 플레이스 SEO 단독은 월 30~50만원대, 블로그+플레이스 패키지는 월 60~90만원대가 일반적입니다. 업종·경쟁 강도에 따라 달라지며, 상담 후 매장 상황에 맞는 견적을 드립니다. 불필요한 서비스를 끼워팔지 않습니다." },
                { q: "얼마나 기다려야 효과가 나오나요?", a: "플레이스 SEO는 빠르면 3~4주 안에 순위 변동이 시작됩니다. 블로그 검색 유입은 2~3개월, SNS는 1~2개월이 현실적입니다. 업종과 경쟁 강도마다 다르므로 첫 상담에서 정확한 기간을 안내드립니다." },
                { q: "이미 다른 대행사를 쓰고 있는데 바꿔도 되나요?", a: "네, 전체 클라이언트의 약 40%가 대행사를 교체하고 오신 분들입니다. 기존 작업 내역을 분석해서 어디서 막혔는지 파악하고 이어서 진행합니다. 계약 잔여기간이 있다면 종료 후 시작하셔도 됩니다." },
                { q: "서울이나 지방도 상담 가능한가요?", a: "네, 전국 어디서나 비대면으로 진행합니다. 서울·수도권은 물론 지방도 가능합니다. 자료는 온라인으로 공유하고, 보고도 카카오톡·전화·화상으로 드립니다." },
              ].map((faq, i) => (
                <details key={i} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-blue-100 transition-colors">
                  <summary className="flex items-center gap-3 p-5 cursor-pointer list-none select-none hover:bg-blue-50/30 transition-colors">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-bold text-gray-800 text-sm flex-1">{faq.q}</span>
                    <ChevronDown size={15} className="text-gray-400 group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <div className="px-5 pb-5 pt-3 ml-9 text-sm text-gray-500 leading-relaxed border-t border-blue-50">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/faq" className="text-blue-600 font-semibold text-sm hover:underline inline-flex items-center gap-1">
                전체 FAQ 보기 (6개 카테고리) <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 오늘 상담이 맞는 분 ══ */}
        <section className="py-14 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">하랑마케팅 적합 여부 확인</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">혹시 이런 상황이신가요?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { text: "광고비를 쓰는데 매출이 안 오른다", severe: true },
                { text: "네이버 플레이스에서 경쟁사에 계속 밀린다", severe: true },
                { text: "리뷰가 적어서 신규 고객 유입이 안 된다", severe: false },
                { text: "SNS를 해야 하는데 어떻게 해야 할지 모른다", severe: false },
                { text: "이전 대행사 결과가 기대에 못 미쳤다", severe: true },
                { text: "마케팅을 처음 시작하려는데 어디서부터 해야 할지 모른다", severe: false },
              ].map((item) => (
                <div key={item.text} className={`flex items-start gap-3 p-4 rounded-xl border ${item.severe ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.severe ? "bg-red-100" : "bg-gray-200"}`}>
                    <CheckCircle2 size={11} className={item.severe ? "text-red-500" : "text-gray-400"} strokeWidth={3} />
                  </div>
                  <p className={`text-sm font-medium leading-snug ${item.severe ? "text-red-700" : "text-gray-600"}`}>{item.text}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
                <div>
                  <p className="text-blue-200 text-sm font-semibold mb-2">1개라도 해당된다면</p>
                  <h3 className="text-xl font-black text-white mb-2">지금 바로 무료 진단을 받아보세요</h3>
                  <ul className="space-y-1.5 mt-3">
                    {["경쟁사 현황 분석", "마케팅 공백 진단", "예산별 채널 추천", "현실적 성과 안내"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-blue-200">
                        <CheckCircle2 size={11} className="text-blue-300 shrink-0" strokeWidth={2.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Link href="/free-check"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blue-700 font-black text-sm hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap">
                    무료 플레이스 진단받기 <ArrowRight size={14} />
                  </Link>
                  <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 text-gray-900 font-bold text-sm hover:bg-yellow-300 transition-colors whitespace-nowrap">
                    <MessageCircle size={13} /> 카카오로 바로 상담
                  </a>
                  <p className="text-center text-[11px] text-blue-300">24시간 내 연락 · 비용 0원</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 상담 진행 프로세스 ══ */}
        <section className="py-14 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">진행 과정</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">신청하면 이렇게 진행됩니다</h2>
              <p className="text-gray-400 text-sm">상담 신청 후 어떤 순서로 진행되는지 미리 확인하세요</p>
            </div>

            {/* 데스크톱: 가로 타임라인 */}
            <div className="hidden md:grid grid-cols-4 gap-0 relative mb-10">
              {/* 연결선 */}
              <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 z-0" />
              {[
                {
                  step: "01",
                  icon: FileText,
                  title: "상담 신청",
                  desc: "간단한 정보 입력\n(업종·현재 상황·목표)",
                  time: "2분",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  step: "02",
                  icon: Search,
                  title: "사전 분석",
                  desc: "경쟁사·키워드·현재\n노출 현황 파악",
                  time: "24시간 이내",
                  color: "from-indigo-500 to-blue-600",
                },
                {
                  step: "03",
                  icon: MessageCircle,
                  title: "무료 전략 상담",
                  desc: "분석 결과 공유\n맞춤 전략 제안",
                  time: "20~30분",
                  color: "from-blue-600 to-indigo-700",
                },
                {
                  step: "04",
                  icon: TrendingUp,
                  title: "시작 여부 결정",
                  desc: "계약 강요 없이\n사장님이 결정",
                  time: "비용 0원",
                  color: "from-blue-700 to-indigo-800",
                },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.step} className="flex flex-col items-center relative z-10 px-3">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg mb-3`}>
                      <Icon size={22} className="text-white" strokeWidth={2} />
                    </div>
                    <span className="text-[10px] font-black text-gray-300 mb-1">STEP {s.step}</span>
                    <h3 className="text-sm font-black text-gray-900 mb-1.5 text-center">{s.title}</h3>
                    <p className="text-[11px] text-gray-400 text-center leading-relaxed whitespace-pre-line mb-2">{s.desc}</p>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">{s.time}</span>
                  </div>
                );
              })}
            </div>

            {/* 모바일: 세로 타임라인 */}
            <div className="md:hidden space-y-3 mb-8">
              {[
                { step: "1", icon: FileText, title: "상담 신청", desc: "간단한 정보 입력 (업종·현재 상황·목표)", time: "2분", color: "from-blue-500 to-blue-600" },
                { step: "2", icon: Search, title: "사전 분석", desc: "경쟁사·키워드·현재 노출 현황 파악", time: "24시간 이내", color: "from-indigo-500 to-blue-600" },
                { step: "3", icon: MessageCircle, title: "무료 전략 상담", desc: "분석 결과 공유 및 맞춤 전략 제안", time: "20~30분", color: "from-blue-600 to-indigo-700" },
                { step: "4", icon: TrendingUp, title: "시작 여부 결정", desc: "계약 강요 없이 사장님이 결정", time: "비용 0원", color: "from-blue-700 to-indigo-800" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.step} className="flex items-start gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h3 className="text-sm font-black text-gray-900">STEP {s.step} · {s.title}</h3>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full shrink-0">{s.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-600 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-blue-200 text-xs font-semibold mb-1">지금 바로 시작할 수 있습니다</p>
                <p className="text-white font-black text-base">상담 신청부터 전략 제안까지 비용 0원 · 부담 없이 시작하세요</p>
              </div>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-700 font-black text-sm hover:bg-blue-50 transition-colors shadow-sm shrink-0 whitespace-nowrap">
                무료 상담 신청 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 긴급성 배너 ══ */}
        <section className="py-10 md:py-14 bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Clock, label: "이번 달 신규 접수", value: "2자리 남음", sub: "선착순 마감 원칙", color: "from-blue-600 to-indigo-700" },
                { icon: TrendingUp, label: "평균 매출 상승", value: "+34%", sub: "3개월 기준 평균", color: "from-blue-600 to-blue-800" },
                { icon: ShieldCheck, label: "100% 무료 상담", value: "0원", sub: "계약 강요 없음", color: "from-blue-500 to-blue-700" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon size={18} className="text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">{stat.label}</div>
                      <div className="text-xl font-black text-white">{stat.value}</div>
                      <div className="text-[11px] text-gray-600">{stat.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ 상담 신청 시 받게 되는 것 ══ */}
        <section className="py-14 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">무료 상담 혜택</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">지금 상담 신청하면 받게 되는 것</h2>
              <p className="text-gray-400 text-sm mt-2">비용 0원 · 계약 강요 없음 · 1영업일 내 전달</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: Search,
                  title: "플레이스 현황 진단",
                  desc: "내 매장의 네이버 플레이스 순위·리뷰·정보 완성도를 체크합니다.",
                  badge: "무료",
                },
                {
                  icon: Users,
                  title: "경쟁사 3곳 비교",
                  desc: "상위 노출 중인 경쟁 매장의 전략을 분석해 차이점을 찾아드립니다.",
                  badge: "무료",
                },
                {
                  icon: TrendingUp,
                  title: "3개월 성과 예측",
                  desc: "업종·예산·현재 순위를 기반으로 달성 가능한 목표 수치를 제시합니다.",
                  badge: "무료",
                },
                {
                  icon: FileText,
                  title: "맞춤 전략 제안서",
                  desc: "예산에 맞는 최적 서비스 조합과 실행 우선순위를 정리해 드립니다.",
                  badge: "무료",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
                        <Icon size={17} className="text-white" strokeWidth={2} />
                      </div>
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">{item.badge}</span>
                    </div>
                    <h3 className="font-black text-gray-900 text-sm mb-1.5">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm shrink-0 mx-auto sm:mx-0">
                <Clock size={17} className="text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-blue-900 mb-0.5">1영업일 내 대표가 직접 연락드립니다</p>
                <p className="text-xs text-blue-700">상담 내용은 철저히 비밀이 유지되며, 계약 강요는 일절 없습니다.</p>
              </div>
              <Link href="/contact"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors whitespace-nowrap shrink-0">
                지금 신청 <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 유튜브 채널 섹션 ══ */}
        <YouTubeSection />

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

        {/* ══ FAQ 섹션 ══ */}
        <HomeFAQ />

        {/* ══ 무료 가이드 리드 마그넷 ══ */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-10 relative overflow-hidden">
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
        <section className="py-20 md:py-32 bg-gray-950 relative overflow-hidden">
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
                { icon: Star, text: "4.9 / 5.0 만족도" },
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
