"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Phone, MessageCircle,
  Search, TrendingUp, Star, Shield, Clock, Users,
  MapPin, BarChart3, AlertCircle, Handshake,
} from "lucide-react";

import { SITE } from "../lib/seo";
const CHECKS = [
  { icon: Search, label: "플레이스 현재 순위", desc: "주요 키워드 Top 10 진입 여부" },
  { icon: Star, label: "리뷰 수·평점 분석", desc: "경쟁사 대비 리뷰 부족분 파악" },
  { icon: BarChart3, label: "콘텐츠 포화도", desc: "블로그·SNS 노출 공백 확인" },
  { icon: Users, label: "경쟁사 3곳 비교", desc: "상위 노출 경쟁사 전략 분석" },
  { icon: TrendingUp, label: "목표 기간 산정", desc: "이 상권이 어느 정도 걸리는 자리인지" },
];

const CASES = [
  { category: "카페", loc: "지역 카페 키워드", result: "플레이스 1위", period: "32일 계측", metric: "56위 → 1위" },
  { category: "치과", loc: "지역 치과 키워드", result: "플레이스 1위", period: "32일 계측", metric: "5위 → 1위" },
  { category: "음식점", loc: "지역 맛집 키워드", result: "플레이스 1위", period: "32일 계측", metric: "13위 → 1위" },
];

const STEPS = [
  { n: "1", text: "아래 폼 또는 카카오로 매장명·업종 전달" },
  { n: "2", text: "1영업일 내 무료 진단 리포트 전송" },
  { n: "3", text: "전략 제안 및 맞춤 견적 안내 (강요 없음)" },
];

export default function FreeCheckPage() {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [phone, setPhone] = useState("");
  const [rank, setRank] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rankInfo = rank ? `\n현재 플레이스 순위: ${rank}위권` : "";
    const msg = encodeURIComponent(
      `[무료 진단 신청]\n사장님 성함: ${name}\n매장명·업종: ${business}\n연락처: ${phone}${rankInfo}`
    );
    window.open(`https://pf.kakao.com/_MuUkG/chat?text=${msg}`, "_blank");
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Top bar */}
      <div className="bg-gray-950 border-b border-white/5 py-3 px-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2 min-h-11">
          <img src="/harang-icon.svg" alt="하랑마케팅 로고" className="w-7 h-7" />
          <span className="text-white font-black text-[15px]">하랑<span className="text-blue-400">마케팅</span></span>
        </Link>
        <a
          href="tel:010-7541-9054"
          className="flex items-center gap-1.5 min-h-11 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <Phone size={12} strokeWidth={2.5} />
          010-7541-9054
        </a>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">

          {/* Left: Info */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 rounded-full px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-400 text-xs font-bold">무료 · 부담 없음 · 1영업일 내 결과</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
              내 매장,<br /><span className="text-blue-400">지금 어디가 문제인지</span><br />무료로 알려드립니다
            </h1>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              네이버 플레이스 순위, 리뷰, 경쟁사 3곳 비교까지 —
              진단 비용 0원, 계약 강요 없습니다.
            </p>

            {/* What we check */}
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">진단 항목</p>
              <div className="space-y-3">
                {CHECKS.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-blue-400" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{c.label}</p>
                        <p className="text-xs text-gray-400">{c.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How it works */}
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">진행 방법</p>
              <div className="space-y-2.5">
                {STEPS.map((s) => (
                  <div key={s.n} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shrink-0">{s.n}</span>
                    <p className="text-sm text-gray-300">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What you get */}
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">진단 후 받게 되는 것</p>
              <div className="space-y-2">
                {[
                  "플레이스 키워드별 현재 순위 PDF 리포트",
                  "경쟁 상위 3곳과 내 매장 비교 분석표",
                  "리뷰·콘텐츠 부족분 및 우선순위 정리",
                  "업종·상권 기준 현실적인 목표 기간",
                  "업종 맞춤 마케팅 전략 요약 1페이지",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-blue-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <p className="text-sm text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cases */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">진단 후 실제 성과</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CASES.map((c) => (
                  <div key={c.category} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[11px] font-bold text-blue-400 bg-blue-500/15 px-1.5 py-0.5 rounded">{c.category}</span>
                      <span className="text-[11px] text-gray-500">{c.loc}</span>
                    </div>
                    <p className="font-black text-white text-sm">{c.result}</p>
                    <p className="text-xs text-blue-400 font-bold mt-0.5">{c.metric} · {c.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:sticky lg:top-6">
            {sent ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle2 size={28} className="text-white" strokeWidth={2} />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">신청 완료!</h2>
                <p className="text-gray-500 text-sm mb-6">카카오톡 채널에서 신청이 접수됩니다.<br />24시간 내 연락드립니다.</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline"
                >
                  홈으로 돌아가기 <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Form header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Handshake size={12} className="text-yellow-300" strokeWidth={2.5} />
                    <span className="text-blue-200 text-[11px]">재계약률 {SITE.stats.renewalRate} · 500+ 프로젝트</span>
                  </div>
                  <h2 className="text-white font-black text-lg leading-tight">무료 플레이스 진단 신청</h2>
                  <p className="text-blue-200 text-xs mt-1">비용 0원 · 계약 강요 없음 · 1영업일 내 결과</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">사장님 성함</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="홍길동"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">매장명 · 업종</label>
                    <input
                      type="text"
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      placeholder="예: 하랑카페 / 카페"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">연락처</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      현재 플레이스 순위 <span className="text-gray-400 font-normal">(선택)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
                        placeholder="예: 15"
                        min="1"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">위</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">모르시면 비워두셔도 됩니다</p>
                  </div>

                  {/* Trust indicators */}
                  <div className="flex flex-col gap-1.5 py-1">
                    {[
                      { icon: Shield, text: "개인정보는 상담 목적으로만 사용됩니다" },
                      { icon: Clock, text: "24시간 내 연락" },
                      { icon: AlertCircle, text: "계약·비용 강요 일절 없음" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Icon size={10} className="text-gray-400" strokeWidth={2.5} />
                        {text}
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-colors shadow-sm shadow-blue-200 flex items-center justify-center gap-2"
                  >
                    무료 진단 신청하기 <ArrowRight size={15} />
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 bg-white text-[11px] text-gray-400">또는</span>
                    </div>
                  </div>

                  <a
                    href="https://pf.kakao.com/_MuUkG/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={15} />
                    카카오로 바로 문의
                  </a>
                </form>

                {/* Bottom badge */}
                <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex items-center justify-center gap-4">
                  <span className="flex items-center gap-1 text-[11px] text-gray-500">
                    <MapPin size={10} className="text-blue-500" strokeWidth={2.5} />
                    경기·서울·인천
                  </span>
                  <span className="text-[11px] text-gray-400">10년 경력</span>
                  <span className="text-[11px] text-gray-400">500+ 프로젝트</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
