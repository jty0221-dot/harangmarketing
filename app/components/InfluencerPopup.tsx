"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import InfluencerPoster from "./InfluencerPoster";
import { noticeOccupies, NOTICE_CLOSED_EVENT, NOTICE_OPEN_EVENT } from "../lib/cafe-notice";
import { searchCareOccupies, SEARCH_CARE_CLOSED_EVENT } from "../lib/search-care-offer";
import {
  INFLUENCER_OFFER as O,
  INFLUENCER_CTA_HREF,
  INFLUENCER_STORAGE_KEY,
  influencerShowsOn,
  todayKst,
} from "../lib/influencer-distribution";

/**
 * 인플루언서 배포 안내 팝업. 블로그 마케팅 · 카페 배포 페이지에서만 뜬다.
 *
 * 자리는 통합검색 월 관리 안내(SearchCarePopup)와 같은 상자를 쓰고, 앞선 두 장에게 차례를 양보한다.
 *   · 월 관리 안내가 떠 있으면 : 그 안내가 닫힌 뒤(SEARCH_CARE_CLOSED_EVENT) 같은 자리에 뜬다
 *   · 월 관리 안내를 오늘 그만 보기로 닫은 날 : 월 관리 안내가 하던 대로 선다
 *     (넓은 화면은 운영 공지 옆 왼쪽 아래 · 좁은 화면은 운영 공지가 닫힌 뒤)
 *   · 좁은 화면에서 운영 공지와 월 관리 안내가 둘 다 남아 있으면 : 이번 화면에서는 뜨지 않는다.
 *     세 장을 연달아 띄우지 않는다. 같은 내용이 카페 배포 페이지 본문에 카드로 있다
 *
 * X 는 이번 화면에서만 닫고, 「오늘은 그만 보기」 는 한국 시간 자정까지 다시 띄우지 않는다.
 */
const SIDE_BY_SIDE_QUERY = "(min-width: 1100px)";

export default function InfluencerPopup() {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [left, setLeft] = useState(false);
  const onPath = influencerShowsOn(pathname);

  useEffect(() => {
    if (!onPath) return;
    try {
      if (localStorage.getItem(INFLUENCER_STORAGE_KEY) === todayKst()) return;
    } catch {
      /* 저장소를 못 쓰는 브라우저. 그냥 띄운다 */
    }
    const notice = noticeOccupies(pathname);
    const care = searchCareOccupies(pathname);
    const wide = window.matchMedia(SIDE_BY_SIDE_QUERY).matches;
    if (!wide && notice && care) return;

    setLeft(wide && notice);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const show = (delay: number) => {
      timer = setTimeout(() => setOpen(true), delay);
    };
    // 기다릴 앞 장 : 월 관리 안내가 먼저고, 없으면 좁은 화면의 운영 공지다
    const waitFor = care ? SEARCH_CARE_CLOSED_EVENT : !wide && notice ? NOTICE_CLOSED_EVENT : "";
    if (!waitFor) {
      show(1200);
      return () => clearTimeout(timer);
    }
    const onClosed = () => show(250);
    window.addEventListener(waitFor, onClosed, { once: true });
    return () => {
      window.removeEventListener(waitFor, onClosed);
      clearTimeout(timer);
    };
  }, [onPath, pathname]);

  // 「카페 목록 다시 보기」 로 공지를 다시 열면, 같은 자리를 쓰는 좁은 화면에서는 이 안내가 비켜 준다
  useEffect(() => {
    if (left) return;
    const yield_ = () => setOpen(false);
    window.addEventListener(NOTICE_OPEN_EVENT, yield_);
    return () => window.removeEventListener(NOTICE_OPEN_EVENT, yield_);
  }, [left]);

  const close = (rememberToday: boolean) => {
    if (rememberToday) {
      try {
        localStorage.setItem(INFLUENCER_STORAGE_KEY, todayKst());
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
      aria-label={O.eyebrow}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !e.nativeEvent.isComposing) close(false);
      }}
      className={
        left
          ? "pointer-events-none fixed z-[9998] left-6 top-32 bottom-24 flex w-[420px] items-end"
          : "pointer-events-none fixed z-[9998] left-4 right-4 top-28 bottom-44 flex items-end sm:left-auto sm:right-6 md:right-24 sm:top-32 sm:bottom-24 sm:w-[420px]"
      }
      style={{
        animation: closing
          ? "haInfOut 0.18s ease both"
          : "haInfIn 0.32s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <style>{`
        @keyframes haInfIn  { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform:none } }
        @keyframes haInfOut { from { opacity:1 } to { opacity:0; transform: translateY(8px) } }
      `}</style>

      <div
        className="pointer-events-auto relative flex max-h-full w-full flex-col overflow-hidden rounded-2xl"
        style={{ background: "var(--w-bg)", border: "1px solid var(--w-line-strong)", boxShadow: "var(--w-shadow-lg)" }}
      >
        <button
          onClick={() => close(false)}
          aria-label="안내 닫기"
          className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
        >
          <X size={16} className="text-white" />
        </button>

        <div className="min-h-0 overflow-y-auto">
          <InfluencerPoster compact />
          <p className="w-caption-1 px-4 pt-3 sm:px-5" style={{ color: "var(--w-label-alt)" }}>
            {O.footnote}
          </p>
        </div>

        {/* 버튼 줄은 본문 스크롤 밖에 둔다. 작은 화면에서 본문이 길어도 그만 보기가 잘리지 않는다 */}
        <div className="shrink-0 px-4 pb-3 pt-3 sm:px-5">
          <Link
            href={INFLUENCER_CTA_HREF}
            onClick={() => close(false)}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors bg-[var(--w-primary)] hover:bg-[var(--w-primary-strong)]"
          >
            {O.cta}
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
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
