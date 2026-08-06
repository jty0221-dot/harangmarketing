"use client";

import { useState, useRef } from "react";
import { ImageOff, ChevronLeft, ChevronRight } from "lucide-react";
import { REF_CATEGORIES, refImage } from "../../../lib/cafe-distribution";

/**
 * 업종별 카페 노출 레퍼런스 뷰어
 *
 * design_handoff_cafe_distribution 의 Cafe-Reference-Page 재현.
 * - 다크 배경(--cd-dark) 위에 흰 콘텐츠 카드
 * - 브레드크럼 업종명은 선택 탭에 따라 함께 바뀐다
 * - 탭·페이지 전환 시 주소도 갱신해 딥링크 유지 (라우터 대신 replaceState —
 *   라우팅을 돌리면 캡처 수십 장이 통째로 다시 마운트된다)
 * - 캡처는 lazy + width/height 필수. 없으면 스크롤 중 레이아웃이 계속 밀린다.
 *
 * 맛집 업종이 127건이라 한 화면에 다 깔면 스크롤이 끝나지 않는다.
 * PER_PAGE 단위로 끊어 번호 페이지네이션을 붙였다.
 */

/** 한 페이지에 보여줄 레퍼런스 수 */
const PER_PAGE = 20;
/** 페이지 번호 버튼을 한 번에 몇 개까지 늘어놓을지 */
const WINDOW = 5;

export default function ReferenceClient({
  initialSlug,
  initialPage,
}: {
  initialSlug: string;
  initialPage: number;
}) {
  const initialIndex = Math.max(0, REF_CATEGORIES.findIndex((c) => c.slug === initialSlug));
  const [active, setActive] = useState(initialIndex);
  const [page, setPage] = useState(initialPage);
  /** 페이지를 넘겼을 때 목록 맨 위로 되돌리기 위한 기준점 */
  const listTop = useRef<HTMLDivElement>(null);

  const cat = REF_CATEGORIES[active];
  const totalPages = Math.max(1, Math.ceil(cat.keywords.length / PER_PAGE));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * PER_PAGE;
  const slice = cat.keywords.slice(start, start + PER_PAGE);

  // 범위를 벗어난 page 는 위 current 에서 보정하고, 탭 전환 시 selectTab 이 1로 되돌린다.
  // 별도 effect 로 setState 를 부르면 렌더가 한 번 더 도는 것 외에 얻는 게 없다.

  function syncUrl(slug: string, p: number) {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("category", slug);
    if (p > 1) url.searchParams.set("page", String(p));
    else url.searchParams.delete("page");
    window.history.replaceState(null, "", url);
  }

  function selectTab(i: number) {
    setActive(i);
    setPage(1);
    syncUrl(REF_CATEGORIES[i].slug, 1);
  }

  function goPage(p: number) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    syncUrl(cat.slug, next);
    // 페이지를 넘기면 목록 상단으로. 탭 바가 sticky 라 그만큼 여유를 둔다.
    const top = listTop.current?.getBoundingClientRect().top ?? 0;
    window.scrollTo({ top: window.scrollY + top - 120, behavior: "smooth" });
  }

  /** 현재 페이지 주변으로 번호를 좁혀 보여준다 (127건이면 7페이지라 대부분 전부 노출) */
  const from = Math.max(1, Math.min(current - Math.floor(WINDOW / 2), totalPages - WINDOW + 1));
  const pageNums = Array.from({ length: Math.min(WINDOW, totalPages) }, (_, i) => from + i);

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
                  onClick={() => selectTab(i)}
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

          <div ref={listTop} />

          {/* 현재 구간 안내 */}
          {cat.keywords.length > 0 && (
            <div
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-8"
              style={{ background: "var(--cd-tint)", borderBottom: "1px solid var(--cd-border-2)" }}
            >
              <p className="text-[13px] md:text-[14px]" style={{ color: "var(--cd-body-2)" }}>
                전체 <strong style={{ color: "var(--cd-primary)" }}>{cat.keywords.length}</strong>건 중{" "}
                <strong style={{ color: "var(--cd-ink-2)" }}>
                  {start + 1}–{start + slice.length}
                </strong>
                번
              </p>
              <p className="text-[13px] md:text-[14px]" style={{ color: "var(--cd-muted)" }}>
                {current} / {totalPages} 페이지
              </p>
            </div>
          )}

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
              slice.map((kw, i) => {
                const idx = start + i; // 캡처 파일 번호는 전체 기준을 유지해야 한다
                return (
                  <figure
                    key={`${cat.slug}-${idx}`}
                    className="overflow-hidden rounded-[14px]"
                    style={{ border: "1px solid var(--cd-border)" }}
                  >
                    <figcaption
                      className="flex items-center gap-2.5 px-3 py-2.5 md:px-[18px] md:py-3"
                      style={{ background: "var(--cd-tint)", borderBottom: "1px solid var(--cd-border-2)" }}
                    >
                      <span
                        className="flex h-[21px] min-w-[21px] shrink-0 items-center justify-center rounded-[5px] px-1 text-[11px] font-black text-white"
                        style={{ background: "var(--cd-primary)" }}
                      >
                        {idx + 1}
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
                      src={refImage(cat, idx)}
                      alt={`'${kw}' 검색 시 네이버 카페 영역 노출 화면`}
                      width={1000}
                      height={290}
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full"
                    />
                  </figure>
                );
              })
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav
              className="flex flex-wrap items-center justify-center gap-1.5 px-4 py-6 md:gap-2 md:px-8 md:py-8"
              style={{ borderTop: "1px solid var(--cd-border-2)" }}
              aria-label="레퍼런스 페이지"
            >
              <button
                onClick={() => goPage(current - 1)}
                disabled={current === 1}
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors disabled:opacity-35"
                style={{ background: "var(--cd-tint)", border: "1px solid var(--cd-border)", color: "var(--cd-body-2)" }}
                aria-label="이전 페이지"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>

              {from > 1 && (
                <>
                  <button
                    onClick={() => goPage(1)}
                    className="h-11 min-w-[44px] rounded-xl px-3 text-[15px] font-bold transition-colors"
                    style={{ background: "var(--cd-tint)", border: "1px solid var(--cd-border)", color: "var(--cd-body-2)" }}
                  >
                    1
                  </button>
                  <span className="px-0.5 text-[15px]" style={{ color: "var(--cd-muted-3)" }}>···</span>
                </>
              )}

              {pageNums.map((p) => (
                <button
                  key={p}
                  onClick={() => goPage(p)}
                  aria-current={p === current ? "page" : undefined}
                  className="h-11 min-w-[44px] rounded-xl px-3 text-[15px] font-bold transition-colors"
                  style={
                    p === current
                      ? { background: "var(--cd-primary)", color: "#fff" }
                      : { background: "var(--cd-tint)", border: "1px solid var(--cd-border)", color: "var(--cd-body-2)" }
                  }
                >
                  {p}
                </button>
              ))}

              {from + WINDOW - 1 < totalPages && (
                <>
                  <span className="px-0.5 text-[15px]" style={{ color: "var(--cd-muted-3)" }}>···</span>
                  <button
                    onClick={() => goPage(totalPages)}
                    className="h-11 min-w-[44px] rounded-xl px-3 text-[15px] font-bold transition-colors"
                    style={{ background: "var(--cd-tint)", border: "1px solid var(--cd-border)", color: "var(--cd-body-2)" }}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => goPage(current + 1)}
                disabled={current === totalPages}
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors disabled:opacity-35"
                style={{ background: "var(--cd-tint)", border: "1px solid var(--cd-border)", color: "var(--cd-body-2)" }}
                aria-label="다음 페이지"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
