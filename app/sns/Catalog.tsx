"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, ThumbsUp, Coins, Search } from "lucide-react";
import {
  SNS_PLATFORMS, groupedByPlatform, platformHasProducts, productsByPlatform, won,
  type PlatformId, type SnsProduct,
} from "../lib/sns-store";
import { PlatformLogo, brandColor } from "./PlatformLogo";

/**
 * 스토어 카탈로그 — 플랫폼 로고 탭 + 그룹 소제목 + 상품 카드 그리드
 *
 * 상품이 293개라 플랫폼(탭) → 그룹(소제목) 2단으로 정리한다.
 * 검색어가 있으면 전 플랫폼에서 상품명으로 필터한다.
 * 커머스 문법(카드·큰 가격·담기 버튼)을 따르되 사이트 공통 톤을 유지한다.
 */

const BADGE_META: Record<
  NonNullable<SnsProduct["badge"]>,
  { icon: typeof Flame; cls: string }
> = {
  인기: { icon: Flame, cls: "bg-red-50 text-red-600 ring-red-100" },
  추천: { icon: ThumbsUp, cls: "bg-blue-50 text-blue-700 ring-blue-100" },
  가성비: { icon: Coins, cls: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
};

function ProductCard({ p }: { p: SnsProduct }) {
  const badge = p.badge ? BADGE_META[p.badge] : null;
  return (
    <Link
      href={`/sns/order?p=${p.slug}`}
      className="group relative flex flex-col rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm card-hover overflow-hidden"
    >
      <span
        className="absolute inset-x-0 top-0 h-1 opacity-80"
        style={{ background: brandColor(p.platform) }}
        aria-hidden
      />
      <div className="p-4 md:p-5 flex-1">
        <div className="flex items-start justify-between gap-3">
          <PlatformLogo id={p.platform} size={38} />
          {badge && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-black ring-1 ${badge.cls}`}>
              <badge.icon size={11} strokeWidth={2.5} />
              {p.badge}
            </span>
          )}
        </div>
        <h4 className="mt-3 text-[14.5px] font-black text-gray-900 leading-snug line-clamp-2">
          {p.name}
        </h4>
        <p className="mt-1.5 text-[12px] leading-relaxed text-gray-500 line-clamp-2">
          {p.desc}
        </p>
      </div>
      <div className="px-4 md:px-5 pb-4 md:pb-5">
        <div className="flex items-end justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-[10.5px] font-bold text-gray-400">1{p.unitLabel}당</p>
            <p className="text-[21px] leading-none font-black text-gray-900 tabular-nums">
              {won(p.unitPrice)}
              <span className="text-[12px] font-black text-gray-500">원</span>
            </p>
          </div>
          <div className="text-right text-[11px] leading-tight text-gray-400 tabular-nums">
            최소 {won(p.min)}{p.unitLabel}
            <br />
            <span className="font-bold text-gray-500">{won(p.min * p.unitPrice)}원~</span>
          </div>
        </div>
        <span className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-black text-white transition-colors group-hover:bg-blue-700">
          주문하기
          <ArrowRight size={13} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export default function Catalog() {
  const [active, setActive] = useState<PlatformId>("instagram");
  const [q, setQ] = useState("");

  const query = q.trim();
  const searchResults = useMemo(() => {
    if (query.length < 1) return null;
    const all = SNS_PLATFORMS.flatMap((pl) => productsByPlatform(pl.id));
    return all.filter((p) => p.name.includes(query) || p.desc.includes(query));
  }, [query]);

  const groups = groupedByPlatform(active);
  const activeMeta = SNS_PLATFORMS.find((p) => p.id === active);
  const activeCount = productsByPlatform(active).length;

  return (
    <div>
      {/* 검색 */}
      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.2} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="상품 검색 (예: 한국인 팔로워, 조회수)"
          className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-base focus:border-blue-400 focus:outline-none transition-colors"
        />
      </div>

      {/* 검색 결과 모드 */}
      {searchResults ? (
        <div>
          <p className="mb-4 text-sm text-gray-500">
            <strong className="font-black text-gray-800">&ldquo;{query}&rdquo;</strong> 검색 결과 {searchResults.length}개
          </p>
          {searchResults.length === 0 ? (
            <p className="rounded-2xl bg-gray-50 ring-1 ring-gray-100 p-8 text-center text-sm text-gray-400">
              검색 결과가 없습니다. 다른 단어로 찾아보시거나 카카오톡으로 문의해 주세요.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((p) => (
                <ProductCard key={p.slug} p={p} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 플랫폼 탭 */}
          <div
            role="tablist"
            aria-label="플랫폼 선택"
            className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap pb-2"
          >
            {SNS_PLATFORMS.filter((pl) => platformHasProducts(pl.id)).map((pl) => {
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
                    <span className="block text-[10px] font-bold text-gray-400">{count}개</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* 그룹별 상품 */}
          <div className="mt-6 space-y-8">
            {groups.map(({ group, items }) => (
              <section key={group}>
                <div className="flex items-center gap-2.5 mb-3">
                  <PlatformLogo id={active} size={22} />
                  <h3 className="text-[15px] font-black text-gray-900">
                    {activeMeta?.name} · {group}
                  </h3>
                  <span className="text-[11px] font-bold text-gray-400">{items.length}개</span>
                  <span className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((p) => (
                    <ProductCard key={p.slug} p={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-6 text-[11px] text-gray-400">
            {activeMeta?.name} 상품 {activeCount}개 · 표시 가격 그대로 입금하시면 됩니다.
            세금계산서·현금영수증이 필요하시면 카카오톡으로 요청해 주세요 (부가세 별도).
            플랫폼 수급 상황에 따라 일부 상품은 일시 품절될 수 있습니다.
          </p>
        </>
      )}
    </div>
  );
}
