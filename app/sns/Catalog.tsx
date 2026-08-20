"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Camera, MonitorPlay, AtSign, Music2, ThumbsUp, Hash, Leaf, MessageCircle } from "lucide-react";
import {
  SNS_PLATFORMS, productsByPlatform, won,
  type PlatformId, type SnsProduct,
} from "../lib/sns-store";

/**
 * 플랫폼 탭 + 상품 목록 (에디토리얼 행 스타일)
 *
 * PC 는 표처럼 한 줄에 상품·단가·최소주문·버튼을 놓고,
 * 모바일은 두 줄로 접는다. 가로 스크롤 금지.
 *
 * 이 lucide 버전에는 브랜드 아이콘(Instagram·Youtube 등)이 없다.
 * 중립 아이콘으로 대신한다 — 브랜드 아이콘을 import 하면 빌드가 깨진다.
 */

const PLATFORM_ICON: Record<PlatformId, typeof Camera> = {
  instagram: Camera,
  youtube: MonitorPlay,
  threads: AtSign,
  tiktok: Music2,
  facebook: ThumbsUp,
  x: Hash,
  naver: Leaf,
  kakao: MessageCircle,
};

const BADGE_STYLE: Record<NonNullable<SnsProduct["badge"]>, string> = {
  인기: "bg-blue-50 text-blue-700 ring-blue-100",
  추천: "bg-amber-50 text-amber-700 ring-amber-100",
  가성비: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

export default function Catalog() {
  const [active, setActive] = useState<PlatformId>("instagram");
  const products = productsByPlatform(active);

  return (
    <div>
      {/* 플랫폼 탭 */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap pb-1">
        {SNS_PLATFORMS.map((pl) => {
          const Icon = PLATFORM_ICON[pl.id];
          const isActive = pl.id === active;
          return (
            <button
              key={pl.id}
              onClick={() => setActive(pl.id)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[13px] font-bold ring-1 transition-colors min-h-[44px] ${
                isActive
                  ? "bg-gray-900 text-white ring-gray-900"
                  : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50"
              }`}
              aria-pressed={isActive}
            >
              <Icon size={14} strokeWidth={2.2} />
              <span className="md:hidden">{pl.short}</span>
              <span className="hidden md:inline">{pl.name}</span>
            </button>
          );
        })}
      </div>

      {/* 상품 목록 */}
      <div className="mt-5 rounded-2xl ring-1 ring-gray-100 shadow-sm overflow-hidden bg-white">
        {/* PC 헤더 행 */}
        <div className="hidden md:grid grid-cols-[1fr_130px_130px_110px] gap-4 px-6 py-3 bg-gray-50 text-[11px] font-black tracking-wide text-gray-400">
          <span>상품</span>
          <span className="text-right">1개당</span>
          <span className="text-right">최소 주문</span>
          <span />
        </div>

        {products.map((p) => (
          <div
            key={p.slug}
            className="svc-row grid grid-cols-1 md:grid-cols-[1fr_130px_130px_110px] gap-2 md:gap-4 px-4 md:px-6 py-4 md:items-center"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-black text-gray-900">{p.name}</span>
                {p.badge && (
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ring-1 ${BADGE_STYLE[p.badge]}`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-gray-500">{p.desc}</p>
            </div>

            <div className="md:text-right">
              <span className="text-[15px] font-black text-gray-900 tabular-nums">{won(p.unitPrice)}원</span>
              <span className="text-[11px] text-gray-400"> /{p.unitLabel}</span>
            </div>

            <div className="md:text-right text-[12.5px] text-gray-500 tabular-nums">
              {won(p.min)}
              {p.unitLabel}부터
              <span className="text-gray-300"> · </span>
              {won(p.min * p.unitPrice)}원
            </div>

            <div className="md:text-right mt-1 md:mt-0">
              <Link
                href={`/sns/order?p=${p.slug}`}
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-black text-white transition hover:bg-blue-700 min-h-[44px] w-full md:w-auto"
              >
                주문
                <ArrowRight size={13} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-gray-400">
        표시 가격 그대로 입금하시면 됩니다. 세금계산서·현금영수증이 필요하시면 카카오톡으로
        요청해 주세요 (부가세 별도). 플랫폼 수급 상황에 따라 일부 상품은 일시 품절될 수 있습니다.
      </p>
    </div>
  );
}
