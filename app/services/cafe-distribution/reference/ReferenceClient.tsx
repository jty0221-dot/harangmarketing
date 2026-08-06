"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { REF_CATEGORIES, refImage } from "../../../lib/cafe-distribution";

/**
 * 업종별 카페 노출 레퍼런스 뷰어
 *
 * design_handoff_cafe_distribution 의 Cafe-Reference-Page 재현.
 * - 다크 배경(--cd-dark) 위에 흰 콘텐츠 카드
 * - 브레드크럼 업종명은 선택 탭에 따라 함께 바뀐다
 * - 탭 전환 시 주소도 갱신해 딥링크 유지 (라우터 대신 replaceState —
 *   라우팅을 돌리면 캡처 33장이 통째로 다시 마운트된다)
 * - 캡처는 lazy + width/height 필수. 없으면 스크롤 중 레이아웃이 계속 밀린다.
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
      {/* 브레드크럼 바 */}
      <div className="px-4 py-3 md:px-8" style={{ background: "var(--cd-dark-2)" }}>
        <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[14px] font-bold md:text-[15px]" style={{ color: "var(--cd-primary-lt3)" }}>
            {cat.crumb}
          </span>
          <span className="text-[13px] md:text-[14px]" style={{ color: "#8f9cba" }}>
            【 카페 상위 노출 배포 】 레퍼런스
          </span>
        </div>
      </div>

      {/* 흰 콘텐츠 카드 */}
      <div className="px-3 pb-14 md:px-8 md:pb-20" style={{ background: "var(--cd-dark)" }}>
        <div className="mx-auto w-full max-w-[1080px] overflow-hidden rounded-[20px] bg-white md:rounded-[26px]">

          {/* 업종 탭 — 모바일은 가로 스크롤 칩 */}
          <div className="sticky top-[64px] z-30 bg-white/95 px-4 py-4 backdrop-blur md:top-[68px] md:px-8"
            style={{ borderBottom: "1px solid var(--cd-border-2)" }}>
            <div
              className="flex gap-2 overflow-x-auto scrollbar-hide md:flex-wrap md:overflow-visible"
              role="tablist"
              aria-label="업종 선택"
            >
              {REF_CATEGORIES.map((c, i) => (
                <button
                  key={c.slug}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => select(i)}
                  className="flex min-h-[44px] shrink-0 items-center rounded-full px-4 text-[13px] font-bold transition-colors md:text-[15px]"
                  style={
                    i === active
                      ? { background: "var(--cd-primary)", color: "#fff" }
                      : { background: "var(--cd-tint)", border: "1px solid var(--cd-border)", color: "var(--cd-body-2)" }
                  }
                >
                  {c.label}
                  <span
                    className="ml-1.5 text-[12px]"
                    style={{ color: i === active ? "rgba(255,255,255,.7)" : "var(--cd-primary)" }}
                  >
                    {c.keywords.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 레퍼런스 행 */}
          <div className="flex flex-col gap-3 px-3 py-5 md:gap-4 md:px-8 md:py-8">
            {cat.keywords.length === 0 ? (
              <div
                className="flex flex-col items-center gap-2 rounded-[14px] py-16 text-center"
                style={{ background: "var(--cd-tint)", border: "1px solid var(--cd-border)" }}
              >
                <ImageOff size={22} style={{ color: "var(--cd-muted)" }} strokeWidth={2} />
                <p className="text-[15px]" style={{ color: "var(--cd-body-2)" }}>레퍼런스 준비 중입니다.</p>
              </div>
            ) : (
              cat.keywords.map((kw, i) => (
                <figure
                  key={`${cat.slug}-${i}`}
                  className="overflow-hidden rounded-[14px]"
                  style={{ border: "1px solid var(--cd-border)" }}
                >
                  <figcaption
                    className="flex items-center gap-2.5 px-3 py-2.5 md:px-[18px] md:py-3"
                    style={{ background: "var(--cd-tint)", borderBottom: "1px solid var(--cd-border-2)" }}
                  >
                    <span
                      className="flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-[5px] text-[11px] font-black text-white"
                      style={{ background: "var(--cd-primary)" }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="min-w-0 flex-1 truncate text-[14px] font-bold md:text-[16px]"
                      style={{ color: "var(--cd-ink-2)" }}
                      title={kw}
                    >
                      {kw}
                    </span>
                    <span className="hidden shrink-0 text-[13px] sm:block" style={{ color: "var(--cd-muted)" }}>
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
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
