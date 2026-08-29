"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, MessageCircle, X, ChevronUp, ChevronDown, ArrowRight, Shield, Handshake } from "lucide-react";

import { SITE } from "../lib/seo";
function useBusinessHours() {
  const [status, setStatus] = useState<"open" | "closing" | "closed">("open");
  useEffect(() => {
    const check = () => {
      // 24시간 소통 가능 (블로그 기준: 주말 포함 언제든지 연락 가능)
      const h = new Date().getHours();
      if (h >= 23 || h < 7) setStatus("closed");
      else if (h >= 21) setStatus("closing");
      else setStatus("open");
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, []);
  return status;
}

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  /** 아직 아래로 더 내려갈 여지가 있을 때만 '맨 아래로' 를 노출한다 */
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const bizStatus = useBusinessHours();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const remaining = document.documentElement.scrollHeight - y - window.innerHeight;
      setVisible(y > 300);
      setShowScrollTop(y > 600);
      setShowScrollBottom(remaining > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!visible) return null;

  const statusConfig = {
    open: { dot: "bg-green-400", text: "지금 상담 가능", sub: "24시간 · 주말 포함 소통 가능" },
    closing: { dot: "bg-blue-400", text: "야간 상담 가능", sub: "늦은 시간도 카카오로 문의 주세요" },
    closed: { dot: "bg-gray-400", text: "새벽 시간대", sub: "문의 접수 후 오전 7시 이후 연락" },
  }[bizStatus];

  return (
    <>
      {/* Desktop: 우측 플로팅 */}
      <div className="hidden md:flex fixed right-6 bottom-8 z-40 flex-col items-end gap-3">
        {/* 맨 위 / 맨 아래 이동 — 긴 페이지(레퍼런스 등)에서 왕복을 줄여준다 */}
        {(showScrollTop || showScrollBottom) && (
          <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
            {showScrollTop && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex h-10 w-10 items-center justify-center text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
                aria-label="맨 위로"
                title="맨 위로"
              >
                <ChevronUp size={18} />
              </button>
            )}
            {showScrollTop && showScrollBottom && <div className="h-px bg-gray-200" />}
            {showScrollBottom && (
              <button
                onClick={() =>
                  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
                }
                className="flex h-10 w-10 items-center justify-center text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
                aria-label="맨 아래로"
                title="맨 아래로"
              >
                <ChevronDown size={18} />
              </button>
            )}
          </div>
        )}

        {expanded && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-64 animate-fade-in">
            {/* Header */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-black text-gray-900">하랑마케팅 빠른 상담</p>
                <button onClick={() => setExpanded(false)} className="p-0.5 rounded hover:bg-gray-100 text-gray-400">
                  <X size={14} />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <Handshake size={10} className="text-blue-400" strokeWidth={2.5} />
                <span className="text-[11px] text-gray-400">재계약률 {SITE.stats.renewalRate} · 500+ 프로젝트</span>
              </div>
              {/* Business hours status */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`w-2 h-2 rounded-full ${statusConfig.dot} ${bizStatus === "open" ? "animate-pulse" : ""}`} />
                <span className="text-[11px] font-bold text-gray-700">{statusConfig.text}</span>
              </div>
              <p className="text-[11px] text-gray-400 ml-3.5">{statusConfig.sub}</p>
            </div>

            {/* Trust badge */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mb-2 flex items-center gap-2">
              <Shield size={11} className="text-blue-500 shrink-0" strokeWidth={2.5} />
              <p className="text-[11px] font-bold text-blue-700">고의 누락 시 결제금액 10배 보상 정책 운용 중</p>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <a
                href="https://pf.kakao.com/_MuUkG/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-yellow-400 text-gray-900 font-bold text-sm hover:bg-yellow-300 transition-colors"
              >
                <MessageCircle size={14} strokeWidth={2.5} />
                <span className="flex-1">카카오톡 바로 상담</span>
                <span className="text-[11px] text-gray-600">10분 내</span>
              </a>
              <a
                href="tel:010-7541-9054"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors"
              >
                <Phone size={14} strokeWidth={2.5} />
                <span className="flex-1">010-7541-9054</span>
              </a>
              <Link
                href="/free-check"
                onClick={() => setExpanded(false)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                무료 플레이스 진단
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className={`relative w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all font-bold text-white ${
            expanded
              ? "bg-gray-700 hover:bg-gray-800"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/30 hover:shadow-2xl hover:-translate-y-0.5"
          }`}
          aria-label="상담 메뉴"
        >
          {expanded ? <X size={20} /> : <MessageCircle size={22} />}
          {!expanded && (
            <>
              {bizStatus === "open" && (
                <span className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
              )}
            </>
          )}
        </button>
      </div>

      {/* Mobile: 하단 고정 바 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-2xl">
        <div className={`px-3 py-1.5 border-b text-center flex items-center justify-center gap-2 ${
          bizStatus === "open" ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${bizStatus === "open" ? "animate-pulse" : ""}`} />
          <p className={`text-[11px] font-black ${bizStatus === "open" ? "text-green-700" : "text-gray-600"}`}>
            {statusConfig.text} · {statusConfig.sub}
          </p>
        </div>
        <div className="px-3 py-2.5 flex gap-2">
          <a
            href="https://pf.kakao.com/_MuUkG/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-yellow-400 text-gray-900 font-black text-sm"
          >
            <MessageCircle size={15} />
            카카오
          </a>
          <a
            href="tel:010-7541-9054"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gray-900 text-white font-black text-sm"
          >
            <Phone size={15} />
            전화
          </a>
          <Link
            href="/free-check"
            className="flex-[1.4] flex items-center justify-center gap-1 py-3 rounded-xl bg-blue-600 text-white font-black text-sm"
          >
            무료 진단
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Mobile 하단 바 공간 확보 */}
      <div className="md:hidden h-[88px]" />
    </>
  );
}
