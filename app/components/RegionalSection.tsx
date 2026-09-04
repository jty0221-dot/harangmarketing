import { MapPin, TrendingUp, Users, Star, Globe } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

import { SITE } from "../lib/seo";
const REGIONS = [
  {
    name: "수도권",
    cities: "서울 · 경기 · 인천",
    desc: "카페, 음식점, 미용, 의원 등 전 업종 대응",
    color: "border-blue-200 bg-blue-50",
    tagColor: "bg-blue-600 text-white",
    tag: "주력 지역",
  },
  {
    name: "충청권",
    cities: "대전 · 세종 · 천안 · 청주",
    desc: "신도시 상권 중심 플레이스·블로그 특화",
    color: "border-indigo-200 bg-indigo-50",
    tagColor: "bg-indigo-600 text-white",
    tag: "운영 중",
  },
  {
    name: "영남권",
    cities: "부산 · 대구 · 포항 · 울산",
    desc: "지역 맘카페·커뮤니티 바이럴 강점",
    color: "border-violet-200 bg-violet-50",
    tagColor: "bg-violet-600 text-white",
    tag: "운영 중",
  },
  {
    name: "호남·제주",
    cities: "광주 · 전주 · 여수 · 제주",
    desc: "관광·로컬 상권 맞춤 마케팅 전략",
    color: "border-sky-200 bg-sky-50",
    tagColor: "bg-sky-600 text-white",
    tag: "운영 중",
  },
  {
    name: "강원권",
    cities: "강릉 · 춘천 · 원주 · 속초",
    desc: "관광 시즌 연계 마케팅·리뷰 관리",
    color: "border-teal-200 bg-teal-50",
    tagColor: "bg-teal-600 text-white",
    tag: "운영 중",
  },
  {
    name: "전국 비대면",
    cities: "온라인 쇼핑몰 · SNS 전문",
    desc: "지역 무관 블로그 SEO · 인스타 · 체험단",
    color: "border-blue-200 bg-blue-50",
    tagColor: "bg-blue-700 text-white",
    tag: "온라인 전용",
  },
];

const STATS = [
  { icon: Globe, val: "전국", sub: "서비스 지역" },
  { icon: Users, val: "500+", sub: "누적 클라이언트" },
  { icon: TrendingUp, val: "10년+", sub: "마케팅 현장 경력" },
  { icon: Star, val: SITE.stats.renewalRate, sub: "재계약률" },
];

export default function RegionalSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px]" style={{ background: "var(--h-amber)" }} />
                <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--w-primary-strong)" }}>전국 서비스</span>
              </div>
              <h2
                className="text-2xl md:text-3xl font-black leading-tight"
                style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}
              >
                전국 어디서나,<br className="md:hidden" /> 대표가 직접 관리합니다
              </h2>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--h-muted)" }}>
                수도권에 가장 많은 매장을 두고 있고, 대부분의 작업이 비대면이라 지역 제한은 없습니다.<br />
                업종과 상권에 맞는 전략을 전국 어디서든 동일하게 제공합니다.
              </p>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-3 shrink-0">
              {STATS.map(({ icon: Icon, val, sub }) => (
                <div
                  key={sub}
                  className="flex flex-col items-center text-center px-4 py-3 rounded-xl"
                  style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}
                >
                  <Icon size={14} strokeWidth={2} className="mb-1.5" style={{ color: "var(--h-blue)" }} />
                  <span className="text-base font-black" style={{ color: "var(--h-dark)" }}>{val}</span>
                  <span className="text-[11px] mt-0.5" style={{ color: "var(--h-muted)" }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Region cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {REGIONS.map((r, i) => (
            <RevealOnScroll key={r.name} delay={i * 50}>
              <div className={`rounded-2xl border p-4 h-full flex flex-col gap-2 ${r.color}`}>
                <span className={`self-start text-[11px] font-black px-2 py-0.5 rounded-full ${r.tagColor}`}>
                  {r.tag}
                </span>
                <p className="font-black text-sm text-gray-900 leading-snug">{r.name}</p>
                <p className="text-[11px] text-gray-400 font-semibold leading-snug">{r.cities}</p>
                <p className="text-[11px] text-gray-500 leading-snug flex-1">{r.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <p className="mt-4 text-xs leading-relaxed" style={{ color: "var(--h-muted)" }}>
          홈페이지에 지역까지 밝혀 공개한 사례는 매장 동의를 받은 일부입니다.
          대행·대대행으로 관리 중인 매장은 이보다 많습니다.
        </p>

        {/* 지역 선택 CTA */}
        <RevealOnScroll>
          <div className="mt-8 rounded-2xl p-5 md:p-7 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
            <div>
              <p className="font-black text-gray-900 text-sm md:text-base">
                우리 지역 경쟁 매장 현황이 궁금하신가요?
              </p>
              <p className="text-xs text-gray-500 mt-1">
                지역별 플레이스 순위 · 경쟁사 리뷰 현황 · 공략 키워드까지 무료로 분석해드립니다
              </p>
            </div>
            <a
              href="/free-check"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-colors hover:opacity-90 shadow-sm"
              style={{ background: "var(--h-blue)" }}
            >
              <MapPin size={14} />
              우리 지역 무료 분석 받기
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
