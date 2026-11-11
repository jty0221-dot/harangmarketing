"use client";

import { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { PlaceRankCaseCards } from "../components/PlaceRankCases";
import {
  PLACE_RANK_AS_OF,
  PLACE_RANK_CASES,
  PLACE_RANK_INDUSTRIES,
  PLACE_RANK_LABEL_NOTE,
  PLACE_RANK_NOTE,
} from "../lib/place-rank-cases";

/* /cases 의 업종 탭 + 검색 + 키워드 카드. 숫자와 표기는 app/lib/place-rank-cases.ts 한 곳에서만 온다 */
const CATEGORIES = ["전체", ...PLACE_RANK_INDUSTRIES];

export default function CasesFilter() {
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
    {/* Search */}
    <div className="relative mb-4 max-w-sm">
      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" strokeWidth={2} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="업종, 지역, 서비스로 검색..."
        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-base md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[var(--w-primary)] focus:ring-[3px] focus:ring-[rgba(0,102,255,0.12)] transition-colors"
      />
      {query && (
        <button
          type="button"
          aria-label="검색어 지우기"
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
          type="button"
          aria-pressed={active === cat}
          onClick={() => setActive(cat)}
          className={`inline-flex items-center px-4 py-2 min-h-11 md:min-h-0 rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
            active === cat
              ? "bg-gray-900 text-white"
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
          <button type="button" className="ml-2 text-blue-600 font-semibold hover:underline" onClick={() => setQuery("")}>검색어 지우기</button>
        )}
      </p>
    )}

    {/* Empty state */}
    {filtered.length === 0 && (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
        <p className="font-bold text-gray-700 mb-1">검색 결과가 없습니다</p>
        <p className="text-sm text-gray-500 mb-4">다른 키워드나 카테고리를 선택해보세요</p>
        <button
          type="button"
          onClick={() => { setQuery(""); setActive("전체"); }}
          className="inline-flex items-center px-4 py-2 min-h-11 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm font-bold hover:border-gray-500 transition-colors"
        >
          전체 기록 보기
        </button>
      </div>
    )}

    {/* 카드 — 숫자와 표기는 app/lib/place-rank-cases.ts 한 곳에서만 온다 */}
    <PlaceRankCaseCards cases={filtered} columns={2} />

    {filtered.length > 0 && (
      <p className="mt-5 text-xs text-gray-500 leading-relaxed">
        가장 최근 계측은 {PLACE_RANK_AS_OF} 이고, 카드마다 마지막으로 잰 날짜를 적었습니다. {PLACE_RANK_NOTE} {PLACE_RANK_LABEL_NOTE}
      </p>
    )}
    </>
  );
}
