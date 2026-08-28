"use client";

import { useState } from "react";
import type { FC } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { TrendingUp, ArrowRight, MessageCircle, Clock, Filter, Search, X, Handshake } from "lucide-react";
import AnimatedCounter from "../components/AnimatedCounter";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import JsonLd from "../components/JsonLd";
import AnswerBlock from "../components/AnswerBlock";
import { SITE, itemListLd, webPageLd, breadcrumbLd } from "../lib/seo";

const ALL_CASES = [
  {
    category: "카페",
    location: "경기 포천",
    title: "플레이스 '지역+카페' 키워드 1위 달성",
    period: "3개월",
    services: ["플레이스 SEO", "블로그 배포", "리뷰 마케팅"],
    before: { "플레이스 순위": "15위 밖", "리뷰 수": "8개", "하루 방문객": "평균 30명" },
    after: { "플레이스 순위": "1위 달성", "리뷰 수": "120개+", "하루 방문객": "평균 80명" },
    metric: "+167%", metricLabel: "방문객 증가",
    story: "개업 6개월차였지만 근처 카페에 치여 검색에서 전혀 보이지 않았어요. 하랑과 함께 3개월 만에 지역 카페 키워드 1위가 됐고, 주말엔 대기줄이 생겼습니다.",
    color: "from-blue-500 to-blue-700",
  },
  {
    category: "병원·의원",
    location: "서울 강서",
    title: "피부과 인스타그램 신규 예약 300% 달성",
    period: "6개월",
    services: ["인스타그램 마케팅", "체험단 모집", "블로그 관리"],
    before: { "팔로워": "200명", "SNS 운영": "거의 없음", "월 신규 예약": "20건" },
    after: { "팔로워": "3,800명", "체험단 후기": "60개+", "월 신규 예약": "80건" },
    metric: "+300%", metricLabel: "신규 예약 증가",
    story: "SNS를 어떻게 해야 할지 막막했어요. 6개월 후엔 예약이 밀릴 정도가 됐고, 원장님이 직접 운영하지 않아도 돌아가는 채널이 생겼습니다.",
    color: "from-blue-600 to-indigo-700",
  },
  {
    category: "음식점",
    location: "서울 마포",
    title: "배달앱 리뷰 10개 → 180개, 매출 2배",
    period: "4개월",
    services: ["리뷰 마케팅", "맘카페 바이럴", "블로그 배포"],
    before: { "배달앱 노출": "저조", "리뷰 수": "10개 미만", "월 배달 매출": "150만원" },
    after: { "배달앱 노출": "상위 노출", "리뷰 수": "180개+", "월 배달 매출": "320만원" },
    metric: "+113%", metricLabel: "배달 매출 증가",
    story: "맛은 자신 있었는데 리뷰가 없으니 주문이 없더라고요. 4개월 만에 매출이 두 배가 됐어요. 이제 리뷰가 리뷰를 부릅니다.",
    color: "from-blue-500 to-blue-700",
  },
  {
    category: "뷰티·네일",
    location: "경기 수원",
    title: "개업 3개월 만에 2주 치 예약 완전 마감",
    period: "3개월",
    services: ["인스타그램 마케팅", "체험단 모집", "카카오맵 마케팅"],
    before: { "개업 초기": "인지도 없음", "리뷰 수": "0개", "예약": "하루 2~3건" },
    after: { "수원 네일 검색": "상위 노출", "인스타 팔로워": "1,200명", "예약": "2주 치 마감" },
    metric: "예약 마감", metricLabel: "3개월 만에 달성",
    story: "개업하고 손님이 없어 너무 막막했어요. 인스타그램 비포애프터와 체험단을 모집했더니 3개월 만에 예약이 꽉 찼습니다.",
    color: "from-blue-700 to-indigo-800",
  },
  {
    category: "카카오맵",
    location: "경기 부천",
    title: "카카오맵 리뷰 0개 → 95개, 지도 순위 급상승",
    period: "2개월",
    services: ["카카오맵 매장 등록", "리뷰 마케팅", "트렌드 랭킹 관리"],
    before: { "카카오맵 리뷰": "0개", "지도 노출": "거의 없음", "신규 고객": "월 5명 내외" },
    after: { "카카오맵 리뷰": "95개", "지역 검색 순위": "상위 3위", "신규 고객": "월 40명+" },
    metric: "+700%", metricLabel: "카카오 신규 유입",
    story: "네이버만 신경 썼는데 카카오맵으로 오는 손님이 의외로 많더라고요. 2달 만에 카카오에서도 우리 매장이 보이기 시작했어요.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    category: "학원·교육",
    location: "수도권",
    title: "맘카페 입소문으로 수강생 55% 증가",
    period: "3개월",
    services: ["맘카페 바이럴", "홈페이지형 블로그 제작", "블로그 관리"],
    before: { "지역 인지도": "낮음", "블로그": "없음", "수강생": "40명" },
    after: { "맘카페 추천": "1위", "블로그 월 방문": "500+", "수강생": "62명" },
    metric: "+55%", metricLabel: "수강생 증가",
    story: "학원 앞에 현수막만 걸었었는데 한계가 있더라고요. 맘카페 바이럴 하나로 3개월 만에 수강생이 절반 이상 늘었어요.",
    color: "from-blue-600 to-blue-800",
  },
  {
    category: "온라인 쇼핑몰",
    location: "서울",
    title: "블로그 유입 10배 성장, 매출 64% 증가",
    period: "5개월",
    services: ["블로그 관리", "블로그 배포", "체험단 모집"],
    before: { "블로그 월 방문": "80명", "제품 후기": "거의 없음", "월 매출": "500만원" },
    after: { "블로그 월 방문": "900명", "체험단 후기": "40개+", "월 매출": "820만원" },
    metric: "+64%", metricLabel: "매출 증가",
    story: "제품은 좋은데 알아주는 사람이 없었어요. 5개월 만에 검색 유입이 생기기 시작하더니 매출이 60% 이상 올랐습니다.",
    color: "from-blue-700 to-blue-900",
  },
  {
    category: "한의원·한방",
    location: "수도권",
    title: "플레이스 신뢰도 강화로 초진 예약 3배 증가",
    period: "4개월",
    services: ["플레이스 SEO", "블로그 관리", "리뷰 마케팅"],
    before: { "플레이스 리뷰": "12개", "블로그 노출": "거의 없음", "초진 예약": "월 15건" },
    after: { "플레이스 리뷰": "89개", "블로그 월 방문": "750명+", "'지역+한의원' 검색": "Top 3" },
    metric: "+200%", metricLabel: "초진 예약 증가",
    story: "한의원은 신뢰가 전부인데 온라인이 너무 취약했어요. 원장님 전문성을 블로그에 담고 리뷰를 쌓았더니 4개월 만에 초진 예약이 3배가 됐습니다.",
    color: "from-blue-600 to-indigo-700",
  },
];

const CATEGORIES = ["전체", "카페", "음식점", "병원·의원", "뷰티·네일", "카카오맵", "학원·교육", "온라인 쇼핑몰", "한의원·한방"];

/* ─── 구조화 데이터 ───────────────────────────────
   ItemList 로 사례 목록을 노출하면 AI 가 "어떤 성과 사례가 있나" 질의에
   개별 사례를 항목 단위로 인용할 수 있다. */
const CASES_LD = [
  itemListLd({
    path: "/cases",
    name: "하랑마케팅 마케팅 성공 사례",
    items: ALL_CASES.map((c) => ({
      name: `${c.location} ${c.category} — ${c.title}`,
      path: "/cases",
      description: `${c.period} 진행, ${c.metricLabel} ${c.metric}. ${c.story}`,
    })),
  }),
  webPageLd({
    path: "/cases",
    type: "CollectionPage",
    name: "마케팅 성공 사례 — 하랑마케팅",
    description:
      "하랑마케팅이 진행한 소상공인 마케팅 실제 성과 사례. 업종별 진행 기간과 전후 수치를 그대로 공개합니다.",
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "진행 사례", path: "/cases" },
  ]),
];

const CasesPage: FC = () => {
  const [active, setActive] = useState("전체");
  const [query, setQuery] = useState("");

  const filtered = ALL_CASES.filter((c) => {
    const matchCat = active === "전체" || c.category === active;
    const q = query.trim().toLowerCase();
    const matchQ = !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.services.some((s) => s.toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  return (
    <>
      <JsonLd data={CASES_LD} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Cases</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              실제 사장님들의<br /><span className="text-blue-400">성공 이야기</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
              숫자만 보여주지 않습니다. 함께 만들어온 성장의 이야기를 직접 읽어보세요.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xl mt-4">
              아래는 지역까지 공개 동의를 받은 사례입니다. 수도권 전역에 여러 업종을 맡고 있고,
              대행·대대행으로 관리 중인 매장은 이보다 많습니다.
            </p>
          </div>
        </section>

        {/* Summary */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { to: 500, suffix: "+", decimals: 0, label: "완료 프로젝트", sub: "10년 누적", color: "text-blue-600" },
                { to: SITE.stats.renewalRateNum, suffix: "%", decimals: 1, label: "재계약률", sub: "업계 최고 수준", color: "text-blue-600" },
                { to: 6, suffix: "개+", decimals: 0, label: "특화 업종", sub: "카페·음식점·미용 등", color: "text-indigo-600" },
                { to: 300, suffix: "%", decimals: 0, label: "최대 매출 상승", sub: "실제 달성 수치", color: "text-blue-700" },
              ].map((s) => (
                <div key={s.label} className="text-center py-2">
                  <div className={`text-2xl md:text-3xl font-black ${s.color} mb-0.5`}>
                    <AnimatedCounter to={s.to} suffix={s.suffix} decimals={s.decimals} duration={1400} />
                  </div>
                  <div className="text-xs md:text-sm font-bold text-gray-700 mb-0.5">{s.label}</div>
                  <div className="text-[11px] text-gray-400">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AEO — 성과 질의 한 줄 정답 */}
        <AnswerBlock
          question="하랑마케팅의 실제 마케팅 성과는 어느 정도인가요?"
          answer="하랑마케팅이 매일 계측하는 네이버 플레이스 순위 기록입니다. 지역 맛집 키워드 56위에서 1위(32일 계측)와 13위에서 1위(32일 계측), 지역 카페 키워드 19위에서 1위(20일 계측), 지역 치과 키워드 5위에서 1위(32일 계측), 지역 꽃집 키워드 8위에서 1위(32일 계측). 순위는 매일 저장한 스냅샷 실측값이며 업종·지역 경쟁 강도에 따라 달라집니다. 방문객과 매출은 계측 대상이 아니어서 수치로 제시하지 않습니다."
          facts={[
            { label: "완료 프로젝트", value: "500건+" },
            { label: "재계약률", value: SITE.stats.renewalRate },
            { label: "최대 순위 상승", value: "56위 → 1위" },
            { label: "계측 기간", value: "32일" },
          ]}
        />

        {/* Filter + Cases */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            {/* Search */}
            <div className="relative mb-4 max-w-sm">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="업종, 지역, 서비스로 검색..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-base md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-11 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              <Filter size={14} className="text-gray-400 shrink-0 mr-1" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`inline-flex items-center px-4 py-2 min-h-11 md:min-h-0 rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                    active === cat
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-blue-200 hover:text-blue-600"
                  }`}
                >
                  {cat}
                  {cat !== "전체" && (
                    <span className={`ml-1.5 text-xs ${active === cat ? "text-blue-200" : "text-gray-300"}`}>
                      {ALL_CASES.filter((c) => c.category === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Result count */}
            {query && (
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-bold text-gray-800">"{query}"</span> 검색 결과 {filtered.length}건
                {filtered.length === 0 && (
                  <span className="ml-2 text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => setQuery("")}>검색어 지우기</span>
                )}
              </p>
            )}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search size={22} className="text-gray-400" strokeWidth={1.5} />
                </div>
                <p className="font-bold text-gray-700 mb-1">검색 결과가 없습니다</p>
                <p className="text-sm text-gray-400 mb-4">다른 키워드나 카테고리를 선택해보세요</p>
                <button
                  onClick={() => { setQuery(""); setActive("전체"); }}
                  className="inline-flex items-center px-4 py-2 min-h-11 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                  전체 사례 보기
                </button>
              </div>
            )}

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {filtered.map((c, idx) => (
                <div key={c.title} className="contents">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    {/* Photo slot */}
                    <PhotoPlaceholder
                      label={`${c.category} · ${c.location} 실제 매장 사진`}
                      hint="마케팅 전·후 비교 사진 교체 예정"
                      height="h-40"
                      className="rounded-none border-0 border-b-2"
                    />
                    {/* Gradient header banner */}
                    <div className={`bg-gradient-to-br ${c.color} px-6 py-5`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-2.5 py-0.5 rounded-lg bg-white/20 text-white text-xs font-black">{c.category}</span>
                            <span className="text-white/70 text-xs">{c.location}</span>
                          </div>
                          <h3 className="font-black text-white text-sm leading-snug">{c.title}</h3>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black text-white">{c.metric}</div>
                          <div className="text-[11px] text-white/70">{c.metricLabel}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      {/* Before / After */}
                      <div className="grid grid-cols-2 gap-2.5 mb-4">
                        <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                          <p className="text-[11px] font-black text-red-400 uppercase tracking-wider mb-2">Before</p>
                          {Object.entries(c.before).map(([k, v]) => (
                            <div key={k} className="text-xs text-gray-500 leading-relaxed">
                              <span className="text-gray-400 block text-[11px]">{k}</span>
                              <span className="font-medium text-gray-700">{v}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                          <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-2">After</p>
                          {Object.entries(c.after).map(([k, v]) => (
                            <div key={k} className="text-xs leading-relaxed">
                              <span className="text-gray-400 block text-[11px]">{k}</span>
                              <span className="font-black text-blue-700">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Story */}
                      <p className="text-sm text-gray-500 leading-relaxed italic mb-4 border-l-2 border-blue-200 pl-3 bg-blue-50/40 py-2 rounded-r-lg">"{c.story}"</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                          <Clock size={11} strokeWidth={2} />{c.period} 진행
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {c.services.map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[11px] font-medium">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2개 후 인라인 CTA 삽입 (전체 목록에서만) */}
                  {idx === 1 && active === "전체" && (
                    <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-blue-200 text-xs font-semibold mb-1">위 사례들이 내 업종과 비슷하다면</p>
                        <h3 className="text-white font-black text-base md:text-lg mb-1">내 매장은 얼마나 성장할 수 있을까요?</h3>
                        <p className="text-blue-100 text-xs">무료 상담에서 업종·경쟁사를 분석해 지금 어디가 비어 있는지 알려드립니다</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                        <Link href="/contact"
                          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-black text-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
                          무료 분석 신청 <ArrowRight size={13} />
                        </Link>
                        <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-yellow-400 text-gray-900 font-bold text-sm hover:bg-yellow-300 transition-colors whitespace-nowrap">
                          <MessageCircle size={13} />카카오 문의
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-sm">해당 업종의 사례를 준비 중입니다.</p>
                <Link href="/contact" className="inline-flex items-center gap-1.5 mt-3 text-blue-600 font-bold text-sm hover:underline">
                  업종 상담 신청하기 <ArrowRight size={13} />
                </Link>
              </div>
            )}

            {/* My industry CTA */}
            <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-900 px-6 py-5">
                <h3 className="font-black text-white text-lg mb-1">내 업종은 무엇부터 해야 할까요?</h3>
                <p className="text-gray-400 text-sm">업종별 상권 난이도와 추천 서비스를 무료로 안내해드립니다</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                  {[
                    { name: "카페·베이커리", result: "플레이스 SEO" },
                    { name: "음식점·배달", result: "리뷰 마케팅" },
                    { name: "미용·뷰티", result: "인스타그램" },
                    { name: "의원·한의원", result: "블로그 마케팅" },
                    { name: "학원·교육", result: "맘카페 바이럴" },
                    { name: "온라인 쇼핑몰", result: "블로그 SEO" },
                  ].map((ind) => (
                    <Link key={ind.name} href={`/contact?industry=${encodeURIComponent(ind.name)}`}
                      className="flex flex-col p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                      <span className="text-xs font-bold text-gray-700 group-hover:text-blue-700">{ind.name}</span>
                      <span className="text-[11px] text-blue-600 font-black mt-0.5">{ind.result}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/contact" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors">
                  내 업종 무료 사례 문의 <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-gray-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                <Handshake size={15} className="text-yellow-300" strokeWidth={2.5} />
                <span className="text-gray-400 text-xs">재계약률 {SITE.stats.renewalRate} · 500+ 프로젝트</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 leading-snug">
                다음 성공 사례의 주인공이 되세요
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
                위 사례들은 모두 무료 상담 한 번으로 시작됐습니다.<br />
                지금 신청하시면 24시간 내에 연락드립니다.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { ind: "카페·베이커리", result: "19위 → 1위", time: "20일 계측", color: "from-blue-600 to-orange-500" },
                { ind: "음식점·배달", result: "13위 → 1위", time: "32일 계측", color: "from-green-500 to-emerald-600" },
                { ind: "꽃집·화훼", result: "8위 → 1위", time: "32일 계측", color: "from-pink-500 to-rose-600" },
                { ind: "의원·치과", result: "5위 → 1위", time: "32일 계측", color: "from-blue-500 to-blue-700" },
              ].map((r) => (
                <div key={r.ind} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className={`text-lg font-black bg-gradient-to-br ${r.color} bg-clip-text text-transparent mb-0.5`}>{r.result}</div>
                  <div className="text-xs text-gray-400 font-medium">{r.ind}</div>
                  <div className="text-[11px] text-gray-600 mt-1">{r.time}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30">
                무료 진단 신청하기 <ArrowRight size={15} />
              </Link>
              <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300 transition-colors">
                <MessageCircle size={15} /> 카카오 바로 상담
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/15 transition-colors">
                상담 신청 <ArrowRight size={15} />
              </Link>
            </div>
            <p className="text-center text-[11px] text-gray-600 mt-4">상담 비용 0원 · 계약 강요 없음 · 24시간 내 연락</p>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CasesPage;
