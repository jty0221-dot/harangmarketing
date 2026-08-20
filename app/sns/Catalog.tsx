"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, ThumbsUp, Coins } from "lucide-react";
import {
  SNS_PLATFORMS, productsByPlatform, won,
  type PlatformId, type SnsProduct,
} from "../lib/sns-store";
import { PlatformLogo, brandColor } from "./PlatformLogo";

/**
 * 스토어 카탈로그 — 플랫폼 로고 탭 + 상품 카드 그리드
 *
 * 커머스 문법(카드 · 큰 가격 · 담기 버튼)을 따르되
 * 사이트 공통 톤(화이트 카드 · ring-gray · navy/blue)을 유지한다.
 * 가로 스크롤은 모바일 탭 바 안에서만 허용 (scrollbar-hide 패턴).
 */

const BADGE_META: Record<
  NonNullable<SnsProduct["badge"]>,
  { icon: typeof Flame; cls: string }
> = {
  인기: { icon: Flame, cls: "bg-red-50 text-red-600 ring-red-100" },
  추천: { icon: ThumbsUp, cls: "bg-blue-50 text-blue-700 ring-blue-100" },
  가성비: { icon: Coins, cls: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
};

export default function Catalog() {
  const [active, setActive] = useState<PlatformId>("instagram");
  const products = productsByPlatform(active);
  const activeMeta = SNS_PLATFORMS.find((p) => p.id === active);

  return (
    <div>
      {/* 플랫폼 탭 — 로고 타일 */}
      <div
        role="tablist"
        aria-label="플랫폼 선택"
        className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap pb-2"
      >
        {SNS_PLATFORMS.map((pl) => {
          const isActive = pl.id === active;
          const count = productsByPlatform(pl.id).length;
          return (
            <button
              key={pl.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(pl.id)}
              className={`group flex items-center gap-2.5 whitespace-nowrap rounded-2xl pl-2 pr-3.5 py-2 ring-1 transition-all min-h-[52px] ${
                isActive
                  ? "bg-gray-900 ring-gray-900 shadow-md"
                  : "bg-white ring-gray-200 hover:ring-gray-300 hover:shadow-sm"
              }`}
            >
              <PlatformLogo id={pl.id} size={34} />
              <span className="text-left leading-tight">
                <span className={`block text-[13px] font-black ${isActive ? "text-white" : "text-gray-800"}`}>
                  <span className="md:hidden">{pl.short}</span>
                  <span className="hidden md:inline">{pl.name}</span>
                </span>
                <span className={`block text-[10px] font-bold ${isActive ? "text-gray-400" : "text-gray-400"}`}>
                  {count}개 상품
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* 상품 카드 그리드 */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => {
          const badge = p.badge ? BADGE_META[p.badge] : null;
          return (
            <Link
              key={p.slug}
              href={`/sns/order?p=${p.slug}`}
              className="group relative flex flex-col rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm card-hover overflow-hidden"
            >
              {/* 브랜드색 상단 라인 */}
              <span
                className="absolute inset-x-0 top-0 h-1 opacity-80"
                style={{ background: brandColor(p.platform) }}
                aria-hidden
              />

              <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <PlatformLogo id={p.platform} size={40} />
                  {badge && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-black ring-1 ${badge.cls}`}>
                      <badge.icon size={11} strokeWidth={2.5} />
                      {p.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-3.5 text-[16px] font-black text-gray-900 leading-snug">
                  {p.name}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-gray-500 line-clamp-2">
                  {p.desc}
                </p>
              </div>

              <div className="px-5 pb-5">
                <div className="flex items-end justify-between border-t border-gray-100 pt-3.5">
                  <div>
                    <p className="text-[10.5px] font-bold text-gray-400">1{p.unitLabel}당</p>
                    <p className="text-[22px] leading-none font-black text-gray-900 tabular-nums">
                      {won(p.unitPrice)}
                      <span className="text-[12px] font-black text-gray-500">원</span>
                    </p>
                  </div>
                  <div className="text-right text-[11px] leading-tight text-gray-400 tabular-nums">
                    최소 {won(p.min)}{p.unitLabel}
                    <br />
                    <span className="font-bold text-gray-500">{won(p.min * p.unitPrice)}원부터</span>
                  </div>
                </div>

                <span className="mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-[13.5px] font-black text-white transition-colors group-hover:bg-blue-700">
                  주문하기
                  <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] text-gray-400">
        {activeMeta?.name} 상품 {products.length}개 · 표시 가격 그대로 입금하시면 됩니다.
        세금계산서·현금영수증이 필요하시면 카카오톡으로 요청해 주세요 (부가세 별도).
        플랫폼 수급 상황에 따라 일부 상품은 일시 품절될 수 있습니다.
      </p>
    </div>
  );
}
