"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ImageOff, Maximize2, Info } from "lucide-react";
import { REF_TABS, type RefWork } from "../../../lib/detail-page-reference";

/**
 * 상세페이지 레퍼런스 뷰어 (연우디자인스튜디오 파트너 작업물)
 *
 * 카페 배포 레퍼런스와 같은 뼈대다 — 종류 탭 + 목록 + 딥링크.
 * 다른 점은 상세페이지가 세로로 길다는 것 하나다. 카페 캡처는 가로 한 장이라
 * 그냥 쌓으면 됐는데, 상세페이지는 한 장이 1만 픽셀을 넘어가서 그렇게 못 한다.
 * 그래서 목록은 상단 3:4 크롭 카드로 깔고, 누르면 전체를 세로로 펼친다.
 *
 * 색은 카페 배포의 --cd-* 토큰을 쓰지 않는다. 그건 그 상품 핸드오프 전용이고
 * globals.css 에 통합하지 말라고 적혀 있다. 여기는 /services/detail-page 본편과
 * 같은 계열(gray + blue-600)로 맞춘다.
 *
 * 클라이언트 상호·브랜드는 화면에 쓰지 않는다 — 연우 허락은 받았지만
 * 해당 클라이언트 동의는 아직 받지 못했다 (D-0078).
 */

export default function ReferenceClient({ initialSlug }: { initialSlug: string }) {
  const initialIndex = Math.max(0, REF_TABS.findIndex((t) => t.slug === initialSlug));
  const [active, setActive] = useState(initialIndex);
  /** 열려 있는 작업물의 현재 탭 내 위치. 닫혀 있으면 -1 */
  const [open, setOpen] = useState(-1);
  const listTop = useRef<HTMLDivElement>(null);

  const tab = REF_TABS[active];
  const works = tab.works;

  function syncUrl(slug: string) {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (slug === REF_TABS[0].slug) url.searchParams.delete("category");
    else url.searchParams.set("category", slug);
    window.history.replaceState(null, "", url);
  }

  function selectTab(i: number) {
    setActive(i);
    syncUrl(REF_TABS[i].slug);
  }

  const move = useCallback(
    (delta: number) => setOpen((p) => (p < 0 ? p : (p + delta + works.length) % works.length)),
    [works.length],
  );

  // 확대 중에는 뒷배경이 같이 스크롤되면 안 된다. 키보드로도 닫고 넘길 수 있게 한다.
  useEffect(() => {
    if (open < 0) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(-1);
      else if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, move]);

  const shown: RefWork | null = open >= 0 ? works[open] : null;

  return (
    <>
      {/* 종류 탭 — 좁은 화면에서는 가로 스크롤 한 줄 */}
      <div className="sticky top-[64px] z-30 border-b border-gray-200 bg-white/95 backdrop-blur md:top-[68px]">
        <div className="mx-auto max-w-6xl px-4 py-3 md:px-6 md:py-4 lg:px-8">
          <div
            className="flex gap-2 overflow-x-auto scrollbar-hide lg:flex-wrap lg:overflow-visible"
            role="tablist"
            aria-label="상세페이지 종류 선택"
          >
            {REF_TABS.map((t, i) => (
              <button
                key={t.slug}
                role="tab"
                aria-selected={i === active}
                onClick={() => selectTab(i)}
                className={
                  "flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[13px] font-bold transition-colors md:text-sm " +
                  (i === active
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300")
                }
              >
                {t.label}
                <span className={i === active ? "text-blue-100" : "text-blue-600"}>{t.works.length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={listTop} />

      <section className="bg-gray-50 py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-gray-600">
              {tab.label} <strong className="font-black text-blue-600">{works.length}</strong>건
            </p>
            <p className="text-xs text-gray-500 md:text-[13px]">카드를 누르면 상세페이지 전체가 펼쳐집니다</p>
          </div>

          {works.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white py-16 text-center">
              <ImageOff size={22} className="text-gray-400" strokeWidth={2} />
              <p className="text-[15px] text-gray-600">레퍼런스 준비 중입니다.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {works.map((w, i) => (
                <li key={w.slug}>
                  <button
                    onClick={() => setOpen(i)}
                    className="group block w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-colors hover:border-blue-300"
                  >
                    <span className="relative block aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={"/detail-ref/" + w.slug + ".jpg"}
                        alt={w.title + " 상세페이지 상단 화면"}
                        width={w.tw}
                        height={w.th}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                      />
                      <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <Maximize2 size={13} strokeWidth={2.5} />
                      </span>
                    </span>
                    <span className="block px-3 py-2.5 md:px-3.5 md:py-3">
                      <span className="block truncate text-[13px] font-bold text-gray-900 md:text-sm" title={w.title}>
                        {w.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-gray-500 md:text-xs">
                        {w.when} · {w.cuts}컷
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 확대 — 상세페이지 한 장을 통째로 세로로 펼친다 */}
      {shown && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/95"
          role="dialog"
          aria-modal="true"
          aria-label={shown.title + " 상세페이지 전체 보기"}
          onClick={() => setOpen(-1)}
        >
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-white/10 bg-gray-950/90 px-4 py-3 backdrop-blur md:gap-3 md:px-6">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white md:text-base">{shown.title}</p>
              <p className="truncate text-[11px] text-gray-400 md:text-xs">
                {tab.label} · {shown.when} · 디자인 파트너 연우디자인스튜디오
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); move(-1); }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 text-white transition-colors hover:bg-white/10"
              aria-label="이전 작업물"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); move(1); }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 text-white transition-colors hover:bg-white/10"
              aria-label="다음 작업물"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(-1); }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="닫기"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="px-3 py-5 md:px-6 md:py-8" onClick={(e) => e.stopPropagation()}>
            <img
              src={"/detail-ref/full/" + shown.slug + ".jpg"}
              alt={shown.title + " 상세페이지 전체"}
              width={shown.fw}
              height={shown.fh}
              className="mx-auto block h-auto w-full max-w-[760px] rounded-xl bg-white"
            />
            {shown.clipped && (
              <p className="mx-auto mt-4 flex max-w-[760px] items-start gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-relaxed text-gray-400">
                <Info size={14} className="mt-0.5 shrink-0" strokeWidth={2} />
                원본이 길어 앞부분만 실었습니다. 전체 분량은 상담 때 보여드립니다.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
