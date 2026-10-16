"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Search, Check, MessageCircle } from "lucide-react";
import { SITE } from "../lib/seo";
import { noticeOccupies } from "../lib/cafe-notice";
import {
  SEARCH_CARE_OFFER as O,
  SEARCH_CARE_STORAGE_KEY,
  searchCareShowsOn,
  todayKst,
} from "../lib/search-care-offer";

/**
 * 네이버 통합검색 월 관리 안내 팝업. 블로그 마케팅 · 카페 배포 페이지에서만 뜬다.
 *
 * 자리는 카페 운영 공지(CafeNoticePopup)와 같은 상자를 쓴다. 하단 상담 바(모바일)와
 * 오른쪽 아래 플로팅 버튼 줄(데스크톱)을 덮지 않는 자리다.
 * 카페 배포 페이지에서 운영 공지가 아직 떠 있으면 이 팝업은 뜨지 않는다. 두 장이 겹치면
 * 뒤 카드가 앞 카드를 통째로 덮는다. 공지를 닫은 뒤 다음 방문부터 이 팝업이 뜬다.
 *
 * X 는 이번 화면에서만 닫고, 「오늘은 그만 보기」 는 한국 시간 자정까지 다시 띄우지 않는다.
 * 문구와 금액은 app/lib/search-care-offer.ts 에 있다. 이 파일에는 문장을 적지 않는다.
 */
export default function SearchCarePopup() {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const onPath = searchCareShowsOn(pathname);

  useEffect(() => {
    if (!onPath) return;
    if (noticeOccupies(pathname)) return;
    try {
      if (localStorage.getItem(SEARCH_CARE_STORAGE_KEY) === todayKst()) return;
    } catch {
      /* 저장소를 못 쓰는 브라우저. 그냥 띄운다 */
    }
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [onPath, pathname]);

  const close = (rememberToday: boolean) => {
    if (rememberToday) {
      try {
        localStorage.setItem(SEARCH_CARE_STORAGE_KEY, todayKst());
      } catch {
        /* 못 적어도 닫히기는 해야 한다 */
      }
    }
    setClosing(true);
    setTimeout(() => setOpen(false), 180);
  };

  if (!open || !onPath) return null;

  return (
    <aside
      aria-label={O.title}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !e.nativeEvent.isComposing) close(false);
      }}
      className="pointer-events-none fixed z-[9998] left-4 right-4 top-28 bottom-44 flex items-end sm:left-auto sm:right-6 md:right-24 sm:top-32 sm:bottom-24 sm:w-[420px]"
      style={{
        animation: closing
          ? "haOfferOut 0.18s ease both"
          : "haOfferIn 0.32s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <style>{`
        @keyframes haOfferIn  { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform:none } }
        @keyframes haOfferOut { from { opacity:1 } to { opacity:0; transform: translateY(8px) } }
      `}</style>

      <div
        className="pointer-events-auto relative flex max-h-full w-full flex-col overflow-hidden rounded-2xl"
        style={{
          background: "var(--w-bg)",
          border: "1px solid var(--w-line-strong)",
          boxShadow: "var(--w-shadow-lg)",
        }}
      >
        <button
          onClick={() => close(false)}
          aria-label="안내 닫기"
          className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-[var(--w-fill)]"
        >
          <X size={16} style={{ color: "var(--w-label-assistive)" }} />
        </button>

        <div className="min-h-0 overflow-y-auto px-4 pb-4 pr-12 pt-4 sm:px-5 sm:pb-5 sm:pr-12 sm:pt-5">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "var(--w-primary)" }}
            >
              <Search size={13} strokeWidth={2.5} style={{ color: "var(--w-text-inverse)" }} />
            </span>
            <span className="w-label-2 font-bold" style={{ color: "var(--w-primary-strong)" }}>
              {O.eyebrow}
            </span>
          </div>

          <h2 className="w-title-3 mt-2" style={{ color: "var(--w-label-strong)" }}>
            {O.title}
          </h2>

          <div className="mt-3 rounded-xl px-4 py-3" style={{ background: "var(--w-fill)" }}>
            <div className="text-2xl md:text-[28px] font-black tabular-nums" style={{ color: "var(--w-label-strong)" }}>
              {O.price}
            </div>
            <div className="w-caption-1 mt-0.5" style={{ color: "var(--w-label-alt)" }}>
              {O.priceNote}
            </div>
          </div>

          <ul className="mt-3 space-y-2">
            {O.points.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0" style={{ color: "var(--w-primary-strong)" }} />
                <span className="text-sm leading-relaxed" style={{ color: "var(--w-label-neutral)" }}>
                  {p}
                </span>
              </li>
            ))}
          </ul>

          <p className="w-caption-1 mt-3" style={{ color: "var(--w-label-alt)" }}>
            {O.footnote}
          </p>
        </div>

        {/* 버튼 줄은 본문 스크롤 밖에 둔다. 작은 화면에서 본문이 길어도 그만 보기가 잘리지 않는다 */}
        <div className="shrink-0 border-t px-4 pb-3 pt-3 sm:px-5" style={{ borderColor: "var(--w-line-strong)" }}>
          <a
            href={SITE.kakaoChat}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors bg-[var(--w-primary)] hover:bg-[var(--w-primary-strong)]"
          >
            <MessageCircle size={16} strokeWidth={2.5} />
            {O.cta}
          </a>
          <button
            onClick={() => close(true)}
            className="mt-1 flex min-h-11 w-full items-center justify-center rounded-xl text-sm transition-colors hover:bg-[var(--w-fill)]"
            style={{ color: "var(--w-label-alt)" }}
          >
            {O.later}
          </button>
        </div>
      </div>
    </aside>
  );
}
