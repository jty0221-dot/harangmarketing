"use client";

import { useState } from "react";
import type { FC } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowRight, MessageCircle, Filter, Search, X, Handshake } from "lucide-react";
import AnimatedCounter from "../components/AnimatedCounter";
import JsonLd from "../components/JsonLd";
import AnswerBlock from "../components/AnswerBlock";
import { SITE, itemListLd, webPageLd, breadcrumbLd } from "../lib/seo";
import { PlaceRankCaseCards } from "../components/PlaceRankCases";
import {
  PLACE_RANK_AS_OF,
  PLACE_RANK_BIGGEST_GAIN,
  PLACE_RANK_HELD,
  PLACE_RANK_CASES,
  PLACE_RANK_INDUSTRIES,
  PLACE_RANK_LABEL_NOTE,
  PLACE_RANK_NOTE,
  PLACE_RANK_RISEN,
  PLACE_RANK_TOP_LINES,
  PLACE_RANK_TOTALS,
  bestCase,
  fmtArrow,
  fmtMoveDays,
} from "../lib/place-rank-cases";

/*
 * 이 페이지가 인용하는 대장은 하나다 — app/lib/place-rank-cases.ts.
 *
 * 예전에는 카드만 이 대장에서 오고 정답 블록과 아래 타일은 rank-records 에서 왔다.
 * 두 대장은 세는 범위가 달라서(54개 키워드 · 61개 키워드) 같은 화면에 다른 총계가 붙었고,
 * 「72위 → 2위」와 「72위에서 4위」가 같은 맛집으로 읽혔다. 실제로는 다른 매장이다.
 * 숫자를 새로 만든 게 아니라 인용하는 대장을 카드와 같은 것으로 맞췄다.
 * rank-records 는 카드 격자가 없는 다른 페이지들의 정본으로 그대로 남는다.
 *
 * 성과 문장에 들어가는 순위도 손으로 적지 않는다. 대장에서 빠진 기록이 화면에 남지 않도록
 * 계단 수 상위 6건을 PLACE_RANK_TOP_LINES 가 매번 다시 뽑는다.
 */

/*
 * 사례 목록 — 손으로 적은 사례를 두지 않는다.
 *
 * 여기 여덟 건이 손으로 적혀 있었다. 방문객 +167% · 배달 매출 +113% · 신규 예약 +300% 같은
 * 값인데 어느 계측에서 나온 숫자인지 댈 수가 없었고, 둘은 병원이라 예약 건수를 적은 것만으로
 * D-0177 에 걸렸다. 대체안을 기다리지 않고 걷는다 (D-0181 · 빼기 먼저 · 채우기 나중).
 *
 * 대신 매일 잰 순위 기록을 싣는다. 카드 하나가 키워드 하나이고, 한 매장이 키워드 셋을
 * 올렸으면 카드도 셋이다 (2026-09-04 (금) 대표 지시 — 겹치는 게 있다면 그래도 추가해).
 */
const CATEGORIES = ["전체", ...PLACE_RANK_INDUSTRIES];

/* ─── 구조화 데이터 ───────────────────────────────
   ItemList 로 사례 목록을 노출하면 AI 가 "어떤 성과 사례가 있나" 질의에
   개별 사례를 항목 단위로 인용할 수 있다. */
const CASES_LD = [
  itemListLd({
    path: "/cases",
    name: "하랑마케팅 마케팅 성공 사례",
    items: PLACE_RANK_CASES.map((c) => ({
      name: `${c.industry} · ${c.keywords[0].detail}`,
      path: "/cases",
      description: `${c.label} ${c.keywords[0].detail} 키워드 ${fmtMoveDays(c.keywords[0])}. ${c.asOf} 계측분입니다.`,
    })),
  }),
  webPageLd({
    path: "/cases",
    type: "CollectionPage",
    name: "순위 계측 기록 · 하랑마케팅",
    description:
      "하랑마케팅이 매일 잰 네이버 플레이스 순위 기록. 키워드마다 시작 순위 · 현재 순위 · 계측 일수만 적었습니다.",
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "진행 사례", path: "/cases" },
  ]),
];

const CasesPage: FC = () => {
  const [active, setActive] = useState("전체");
  const [query, setQuery] = useState("");

  const filtered = PLACE_RANK_CASES.filter((c) => {
    const matchCat = active === "전체" || c.industry === active;
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      c.industry.toLowerCase().includes(q) ||
      c.label.toLowerCase().includes(q) ||
      c.keywords.some((k) => k.detail.toLowerCase().includes(q));
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
              매일 잰 순위를<br /><span className="text-blue-400">그대로 옮긴 기록</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
              키워드 하나가 몇 위에서 몇 위가 됐는지, 며칠 걸렸는지만 적었습니다.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xl mt-4">
              상호와 지역명은 적지 않고 업종과 행정단위까지만 적었습니다. 방문객과 매출은 계측 대상이 아니어서
              수치로 적지 않습니다. 순위는 보장하지 않습니다.
            </p>
          </div>
        </section>

        {/* Summary */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { to: 500, suffix: "+", decimals: 0, label: "완료 프로젝트", sub: "10년 누적", color: "text-blue-600" },
                { to: SITE.stats.renewalRateNum, suffix: "%", decimals: 1, label: "재계약률", sub: "진행 고객 기준", color: "text-blue-600" },
                { to: 6, suffix: "개+", decimals: 0, label: "특화 업종", sub: "카페·음식점·미용 등", color: "text-indigo-600" },
                { to: PLACE_RANK_TOTALS.works, suffix: "건", decimals: 0, label: "순위 계측 사례", sub: `${PLACE_RANK_AS_OF} 기준 상승·유지 확인분`, color: "text-blue-700" },
              ].map((s) => (
                <div key={s.label} className="text-center py-2">
                  <div className={`text-2xl md:text-3xl font-black ${s.color} mb-0.5`}>
                    <AnimatedCounter to={s.to} suffix={s.suffix} decimals={s.decimals} duration={1400} />
                  </div>
                  <div className="text-xs md:text-sm font-bold text-gray-700 mb-0.5">{s.label}</div>
                  <div className="text-[11px] text-gray-600">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AEO — 성과 질의 한 줄 정답 */}
        <AnswerBlock
          question="하랑마케팅의 실제 마케팅 성과는 어느 정도인가요?"
          answer={`하랑마케팅이 매일 계측하는 네이버 플레이스 순위 기록입니다. ${PLACE_RANK_TOP_LINES}. ${PLACE_RANK_AS_OF} 기준 ${PLACE_RANK_TOTALS.keywords}개 계측 키워드 가운데 ${PLACE_RANK_TOTALS.page1Keywords}개가 네이버 플레이스 1페이지(1~5위)를 지키고 있습니다. 순위는 매일 저장한 스냅샷 실측값이며 업종·지역 경쟁 강도에 따라 달라집니다. 방문객과 매출은 계측 대상이 아니어서 수치로 제시하지 않습니다.`}
          facts={[
            { label: "완료 프로젝트", value: "500건+" },
            { label: "재계약률", value: SITE.stats.renewalRate },
            { label: "최대 상승", value: PLACE_RANK_BIGGEST_GAIN ? fmtArrow(PLACE_RANK_BIGGEST_GAIN.best) : "계측 중" },
            { label: "1페이지 유지 키워드", value: `${PLACE_RANK_TOTALS.page1Keywords}개` },
          ]}
        />

        {/* Filter + Cases */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            {/* 섹션 머리 — 무엇을 세었는지 먼저 말한다 */}
            <div className="mb-6 md:mb-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--w-primary)" }}>
                Place Rank
              </p>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">키워드마다 한 장씩 실은 계측 기록</h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-2xl">
                {PLACE_RANK_AS_OF} 기준 {PLACE_RANK_TOTALS.stores}곳 {PLACE_RANK_TOTALS.keywords}개 키워드를 매일 재고 있습니다.
                그중 올라간 {PLACE_RANK_RISEN}건과 자리를 지키고 있는 {PLACE_RANK_HELD}건을 키워드마다 한 장씩 실었습니다.
              </p>
              <Link
                href="/cases/place-rank"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold min-h-11 hover:underline"
                style={{ color: "var(--w-primary)" }}
              >
                계측 방법과 제외 기준 보기 <ArrowRight size={13} />
              </Link>
            </div>

            {/* Search */}
            <div className="relative mb-4 max-w-sm">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" strokeWidth={2} />
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
              <Filter size={14} className="text-gray-500 shrink-0 mr-1" />
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
                    <span className={`ml-1.5 text-xs ${active === cat ? "text-white" : "text-gray-500"}`}>
                      {PLACE_RANK_CASES.filter((c) => c.industry === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Result count */}
            {query && (
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-bold text-gray-800">&lsquo;{query}&rsquo;</span> 검색 결과 {filtered.length}건
                {filtered.length === 0 && (
                  <span className="ml-2 text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => setQuery("")}>검색어 지우기</span>
                )}
              </p>
            )}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search size={22} className="text-gray-500" strokeWidth={1.5} />
                </div>
                <p className="font-bold text-gray-700 mb-1">검색 결과가 없습니다</p>
                <p className="text-sm text-gray-500 mb-4">다른 키워드나 카테고리를 선택해보세요</p>
                <button
                  onClick={() => { setQuery(""); setActive("전체"); }}
                  className="inline-flex items-center px-4 py-2 min-h-11 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                  전체 기록 보기
                </button>
              </div>
            )}

            {/* 카드 — 숫자와 표기는 app/lib/place-rank-cases.ts 한 곳에서만 온다 */}
            <PlaceRankCaseCards cases={filtered} columns={3} />

            {filtered.length > 0 && (
              <p className="mt-5 text-xs text-gray-500 leading-relaxed">
                {PLACE_RANK_AS_OF} 기준 계측값입니다. {PLACE_RANK_NOTE} {PLACE_RANK_LABEL_NOTE}
              </p>
            )}

            {/* 상담 CTA — 그라데이션을 쓰지 않는다 (WDS) */}
            <div
              className="mt-8 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ backgroundColor: "var(--h-navy)" }}
            >
              <div className="min-w-0">
                <p className="text-blue-200 text-xs font-semibold mb-1">위 기록이 내 업종과 비슷하다면</p>
                <h3 className="text-white font-black text-base md:text-lg mb-1">내 매장은 지금 몇 위인가요?</h3>
                <p className="text-blue-100 text-xs">무료 진단에서 업종·경쟁 상황을 함께 보고 지금 어디가 비어 있는지 알려드립니다</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-11 rounded-xl bg-white text-blue-700 font-black text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  무료 진단 신청 <ArrowRight size={13} />
                </Link>
                <a
                  href="https://pf.kakao.com/_MuUkG/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-11 rounded-xl bg-yellow-400 text-gray-900 font-bold text-sm hover:bg-yellow-300 transition-colors whitespace-nowrap"
                >
                  <MessageCircle size={13} />카카오 문의
                </a>
              </div>
            </div>

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

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {/* 업종 이름도 대장에서 온다. 없는 업종을 적어 두면 남의 기록이 그 자리에 붙는다 */}
              {PLACE_RANK_INDUSTRIES.flatMap((industry) => {
                const c = bestCase(industry);
                return c ? [{ ind: industry, result: fmtArrow(c.best), time: `${c.best.days}일 계측` }] : [];
              }).map((r) => (
                <div key={r.ind} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-lg font-black text-white tabular-nums mb-0.5">{r.result}</div>
                  <div className="text-xs text-gray-400 font-medium">{r.ind}</div>
                  <div className="text-[11px] text-gray-400 mt-1">{r.time}</div>
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
            <p className="text-center text-[11px] text-gray-400 mt-4">상담 비용 0원 · 계약 강요 없음 · 24시간 내 연락</p>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CasesPage;
