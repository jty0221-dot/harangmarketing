"use client";

import { useState } from "react";
import { ImageOff, Search } from "lucide-react";
import { REF_CATEGORIES, refImage } from "../../../lib/cafe-distribution";

/**
 * 업종별 카페 노출 레퍼런스 뷰어
 *
 * - 탭 전환은 클라이언트 상태로 처리하고, 주소도 함께 갱신해 딥링크가 되도록 한다.
 *   (history.replaceState 사용 — 라우터 네비게이션을 돌리면 165장이 다시 마운트된다)
 * - 캡처는 업종당 최대 33장이라 loading="lazy" 와 width/height 지정이 필수다.
 *   크기를 주지 않으면 스크롤 중 레이아웃이 계속 밀린다(CLS).
 */
export default function ReferenceClient({ initialSlug }: { initialSlug: string }) {
  const initialIndex = Math.max(0, REF_CATEGORIES.findIndex((c) => c.slug === initialSlug));
  const [active, setActive] = useState(initialIndex);
  const cat = REF_CATEGORIES[active];

  function select(i: number) {
    setActive(i);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("category", REF_CATEGORIES[i].slug);
      window.history.replaceState(null, "", url);
    }
  }

  return (
    <>
      {/* 업종 탭 — 모바일에서는 가로 스크롤 칩 */}
      <div className="sticky top-[64px] z-30 border-b bg-white/95 backdrop-blur md:top-[68px]"
        style={{ borderColor: "var(--h-border)" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3" role="tablist" aria-label="업종 선택">
            {REF_CATEGORIES.map((c, i) => (
              <button
                key={c.slug}
                role="tab"
                aria-selected={i === active}
                onClick={() => select(i)}
                className={`flex min-h-[44px] shrink-0 items-center rounded-xl px-3.5 text-xs font-bold transition-colors md:text-[13px] ${
                  i === active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "hover:bg-gray-50"
                }`}
                style={
                  i === active
                    ? undefined
                    : { background: "var(--h-surface)", border: "1px solid var(--h-border)", color: "#5a627a" }
                }
              >
                {c.label}
                <span className={`ml-1.5 tabular-nums ${i === active ? "text-blue-200" : "text-blue-700"}`}>
                  {c.keywords.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 선택 업종 헤더 */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 pt-6 md:pt-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-xl md:text-2xl font-black" style={{ color: "var(--h-dark)", letterSpacing: "-0.02em" }}>
            {cat.label}
          </h2>
          <span className="text-sm" style={{ color: "var(--h-muted)" }}>
            키워드 <span className="font-bold tabular-nums text-blue-700">{cat.keywords.length}</span>개
          </span>
        </div>
        <p className="mt-1.5 text-[13px]" style={{ color: "var(--h-muted)" }}>
          네이버 모바일 통합검색 · 카페 영역 실사 캡처입니다.
        </p>
      </div>

      {/* 캡처 목록 */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {cat.keywords.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 rounded-2xl py-16 text-center"
            style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}
          >
            <ImageOff size={22} className="text-gray-400" strokeWidth={2} />
            <p className="text-sm" style={{ color: "var(--h-muted)" }}>레퍼런스 준비 중입니다.</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {cat.keywords.map((kw, i) => (
              <figure
                key={`${cat.slug}-${i}`}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
                style={{ border: "1px solid var(--h-border)" }}
              >
                <figcaption
                  className="flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-3"
                  style={{ background: "var(--h-surface)", borderBottom: "1px solid var(--h-border)" }}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-600 text-[11px] font-black text-white tabular-nums">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold" style={{ color: "var(--h-dark)" }} title={kw}>
                    {kw}
                  </span>
                  <span className="hidden shrink-0 items-center gap-1 text-[11px] sm:flex" style={{ color: "#7a8298" }}>
                    <Search size={10} strokeWidth={2.5} />
                    모바일 통합검색 · 카페 영역
                  </span>
                </figcaption>
                <img
                  src={refImage(cat, i)}
                  alt={`'${kw}' 검색 시 네이버 카페 영역 노출 화면`}
                  width={1000}
                  height={290}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </figure>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
