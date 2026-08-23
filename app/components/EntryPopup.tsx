"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

/**
 * 진입 안내 카드
 *
 * 예전에는 화면 전체를 덮는 모달에 빨간 '마감 임박' 배지를 깜빡였다.
 * 재촉하는 인상이 강해 브랜드에 맞지 않아, 화면을 막지 않는 조용한 카드로 바꿨다.
 *   - 배경을 어둡게 덮지 않는다(읽던 내용을 계속 볼 수 있다)
 *   - 데스크톱은 우하단, 모바일은 하단에 붙는다
 *   - 사실만 담는다: 전담 팀장이 직접 관리해서 월 상담 수가 한정된다는 것
 */
export default function EntryPopup() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("harang_popup_dismissed")) return;
    const timer = setTimeout(() => setOpen(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("harang_popup_dismissed", "1");
    setClosing(true);
    setTimeout(() => setOpen(false), 180);
  };

  if (!open) return null;

  return (
    <div
      className="fixed z-[9998] left-4 right-4 bottom-4 sm:left-auto sm:right-6 sm:bottom-24 sm:w-[340px]"
      style={{
        animation: closing
          ? "haCardOut 0.18s ease both"
          : "haCardIn 0.32s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <style>{`
        @keyframes haCardIn  { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform:none } }
        @keyframes haCardOut { from { opacity:1 } to { opacity:0; transform: translateY(8px) } }
      `}</style>

      <div
        className="relative overflow-hidden rounded-[16px]"
        style={{
          background: "var(--w-bg)",
          border: "1px solid var(--w-line-strong)",
          boxShadow: "var(--w-shadow-lg)",
        }}
      >
        <button
          onClick={dismiss}
          aria-label="닫기"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--w-fill)]"
        >
          <X size={14} style={{ color: "var(--w-label-assistive)" }} />
        </button>

        <div className="p-5">
          <p className="w-label-2 font-bold" style={{ color: "var(--w-primary)" }}>
            상담 0원 · 24시간 내 연락
          </p>
          <p className="w-title-3 mt-1.5" style={{ color: "var(--w-label-strong)" }}>
            매장을 보고 맞춤으로 제안드립니다
          </p>
          <p className="w-caption-1 mt-2" style={{ color: "var(--w-label-alt)" }}>
            전담 팀장이 직접 관리해서 한 달에 받는 신규 상담이 많지 않습니다.
            지금 신청하시면 경쟁사 분석 리포트도 함께 드립니다.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <Link
              href="/free-check"
              onClick={dismiss}
              className="w-btn w-btn-primary w-btn-sm flex-1"
            >
              무료 진단 신청
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
            <button onClick={dismiss} className="w-btn w-btn-ghost w-btn-sm">
              나중에
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
