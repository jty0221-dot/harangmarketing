"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import type { PortfolioIndustry } from "../lib/portfolio";

/** 업종 탭 + 검색으로 사례를 걸러 보여준다 */
export default function PortfolioGrid({ industries }: { industries: PortfolioIndustry[] }) {
  const [tab, setTab] = useState<string>("all");
  const [q, setQ] = useState("");

  const all = useMemo(
    () => industries.flatMap((i) => i.cases.map((c) => ({ ...c, industry: i.name, slug: i.slug }))),
    [industries]
  );

  const visible = useMemo(() => {
    const key = q.trim().toLowerCase();
    return all
      .filter((c) => tab === "all" || c.slug === tab)
      .filter(
        (c) =>
          !key ||
          c.title.toLowerCase().includes(key) ||
          c.excerpt.toLowerCase().includes(key) ||
          c.industry.toLowerCase().includes(key)
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [all, tab, q]);

  return (
    <>
      {/* 검색 */}
      <div className="relative mb-4">
        <Search
          size={16}
          strokeWidth={2.5}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--w-label-disable)" }}
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="업종·키워드로 검색 (예: 치과, 플레이스, 청소)"
          className="w-input"
          style={{ paddingLeft: 44 }}
        />
      </div>

      {/* 업종 탭 */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        <button
          onClick={() => setTab("all")}
          className="w-btn w-btn-sm"
          style={
            tab === "all"
              ? { background: "var(--w-label-strong)", color: "#fff" }
              : { background: "var(--w-bg)", color: "var(--w-label-alt)", border: "1px solid var(--w-line-strong)" }
          }
        >
          전체 {all.length}
        </button>
        {industries.map((i) => (
          <button
            key={i.slug}
            onClick={() => setTab(i.slug)}
            className="w-btn w-btn-sm"
            style={
              tab === i.slug
                ? { background: "var(--w-label-strong)", color: "#fff" }
                : { background: "var(--w-bg)", color: "var(--w-label-alt)", border: "1px solid var(--w-line-strong)" }
            }
          >
            {i.name} {i.count}
          </button>
        ))}
      </div>

      {/* 사례 카드 */}
      {visible.length === 0 ? (
        <p className="w-body-2 py-16 text-center" style={{ color: "var(--w-label-assistive)" }}>
          조건에 맞는 사례가 없습니다. 다른 키워드로 찾아보세요.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => (
            <a
              key={c.logNo}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-card group flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--w-shadow-md)]"
            >
              {c.image && (
                /* 블로그에서 받아 720px 로 줄여 저장한 대표 이미지 */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.image}
                  alt=""
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  style={{ background: "var(--w-cn-98)" }}
                />
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="w-chip w-chip-blue">{c.industry}</span>
                  <span className="w-caption-1 w-num" style={{ color: "var(--w-label-assistive)" }}>
                    {c.date}
                  </span>
                </div>
                <p
                  className="w-label-1 font-bold leading-snug"
                  style={{ color: "var(--w-label-strong)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                >
                  {c.title}
                </p>
                {c.excerpt && (
                  <p
                    className="w-caption-1 mt-2 flex-1"
                    style={{ color: "var(--w-label-alt)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                  >
                    {c.excerpt}
                  </p>
                )}
                <span
                  className="w-caption-1 mt-3 inline-flex items-center gap-1 font-bold"
                  style={{ color: "var(--w-primary)" }}
                >
                  사례 자세히 보기
                  <ExternalLink size={11} strokeWidth={2.5} />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
