"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { HP_DRAFTS, HP_GROUPS, HP_MOODS, hpDemoUrl, hpThumb } from "../../lib/homepage-portfolio";

const PAGE = 24;

const on = { background: "var(--w-label-strong)", color: "#fff" } as const;
const off = { background: "var(--w-bg)", color: "var(--w-label-alt)", border: "1px solid var(--w-line-strong)" } as const;

/** 업종군 · 무드 · 검색으로 시안을 걸러 보여준다. 카드를 누르면 시안이 새 창으로 열린다 */
export default function HomepageGallery() {
  const [group, setGroup] = useState("all");
  const [mood, setMood] = useState("all");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);

  const visible = useMemo(() => {
    const key = q.trim().toLowerCase();
    return HP_DRAFTS.filter((d) => group === "all" || d.group === group)
      .filter((d) => mood === "all" || d.moods.includes(mood))
      .filter((d) => !key || `${d.name} ${d.industry} ${d.design} ${d.moods.join(" ")}`.toLowerCase().includes(key));
  }, [group, mood, q]);

  const pick = (fn: () => void) => {
    fn();
    setShown(PAGE);
  };

  return (
    <>
      <div className="relative mb-4">
        <Search size={16} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--w-label-assistive)" }} />
        <input
          value={q}
          onChange={(e) => pick(() => setQ(e.target.value))}
          placeholder="업종 · 디자인으로 검색 (예: 카페, 치과, 다크)"
          aria-label="시안 검색"
          className="w-input text-base"
          style={{ paddingLeft: 44 }}
        />
      </div>

      <div className="mb-3 flex gap-1.5 overflow-x-auto scrollbar-hide pb-1" role="tablist" aria-label="업종">
        <button role="tab" aria-selected={group === "all"} onClick={() => pick(() => setGroup("all"))} className="w-btn w-btn-sm shrink-0 min-h-[44px] md:min-h-0" style={group === "all" ? on : off}>
          전체 {HP_DRAFTS.length}
        </button>
        {HP_GROUPS.map((g) => (
          <button key={g.key} role="tab" aria-selected={group === g.key} onClick={() => pick(() => setGroup(g.key))} className="w-btn w-btn-sm shrink-0 min-h-[44px] md:min-h-0" style={group === g.key ? on : off}>
            {g.label} {g.count}
          </button>
        ))}
      </div>

      <div className="mb-6 flex gap-1.5 overflow-x-auto scrollbar-hide pb-1" aria-label="무드">
        {["all", ...HP_MOODS].map((m) => (
          <button key={m} onClick={() => pick(() => setMood(m))} aria-pressed={mood === m} className="w-btn w-btn-sm shrink-0 min-h-[44px] md:min-h-0" style={mood === m ? { ...on, background: "var(--w-primary)" } : off}>
            {m === "all" ? "모든 무드" : m === "실사형" ? "실사형 (구조가 다른 업체)" : m}
          </button>
        ))}
      </div>

      <p className="w-caption-1 mb-4" style={{ color: "var(--w-label-alt)" }}>
        시안 {visible.length}개 · 업체명과 수치는 가상입니다
      </p>

      {visible.length === 0 ? (
        <p className="w-body-2 py-16 text-center" style={{ color: "var(--w-label-assistive)" }}>
          조건에 맞는 시안이 없습니다. 다른 업종이나 무드를 골라 보세요.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.slice(0, shown).map((d) => (
            <a
              key={d.slug}
              href={hpDemoUrl(d.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-card group flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--w-shadow-md)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden" style={{ background: "var(--w-cn-98)" }}>
                {/* 공장에서 1280 화면을 560px webp 로 줄여 저장한 시안 첫 화면 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hpThumb(d.slug)} alt={`${d.industry} 홈페이지 시안 PC 화면`} width={560} height={350} loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hpThumb(d.slug, true)} alt={`${d.industry} 홈페이지 시안 모바일 화면`} width={180} height={351} loading="lazy"
                  className="absolute bottom-2 right-2 w-[22%] rounded-lg border-2 shadow-sm" style={{ borderColor: "var(--w-label-strong)" }} />
              </div>
              <div className="flex flex-1 flex-col p-4 md:p-5">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <span className="w-chip w-chip-blue">{d.industry}</span>
                  {d.moods.map((m) => (
                    <span key={m} className="w-chip w-chip-neutral">{m}</span>
                  ))}
                </div>
                <p className="w-label-1 font-bold leading-snug" style={{ color: "var(--w-label-strong)" }}>
                  {d.name}
                </p>
                <p className="w-caption-1 mt-1 flex-1" style={{ color: "var(--w-label-alt)" }}>
                  {d.real ? `실사형 레이아웃 · ${d.design}` : `디자인 · ${d.design}`}
                </p>
                <span className="w-caption-1 mt-3 inline-flex items-center gap-1 font-bold" style={{ color: "var(--w-primary)" }}>
                  시안 열어 보기
                  <ExternalLink size={11} strokeWidth={2.5} />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {shown < visible.length && (
        <div className="mt-6 text-center">
          <button onClick={() => setShown((n) => n + PAGE)} className="w-btn w-btn-secondary min-h-[44px]">
            시안 더 보기 ({visible.length - shown}개 남음)
          </button>
        </div>
      )}
    </>
  );
}
