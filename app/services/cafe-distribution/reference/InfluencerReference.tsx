"use client";

import { useState } from "react";
import {
  INFLUENCER_REFS,
  INFLUENCER_REF_CATEGORIES,
  INFLUENCER_REF_TOTAL,
  shortDate,
} from "../../../lib/influencer-distribution";

/**
 * 인플루언서 배포 레퍼런스 뷰어. 카페 뷰어(ReferenceClient)와 같은 카드 틀을 쓴다.
 * 건수가 아직 적어 업종 탭을 주소에 싣지 않고, 번호 페이지 대신 더 보기로 끊는다.
 * 탭 줄은 붙박이로 두지 않는다. 둥근 흰 카드(overflow-hidden) 안에서는 sticky 가 카드 기준으로 밀려 첫 줄 캡션을 덮는다.
 * 캡처는 lazy + width/height 필수 (없으면 스크롤 중 레이아웃이 밀린다).
 */
const STEP = 12;

export default function InfluencerReference() {
  const [slug, setSlug] = useState("");
  const [shown, setShown] = useState(STEP);
  const list = slug ? INFLUENCER_REFS.filter((r) => r.category === slug) : INFLUENCER_REFS;
  const tabs = [{ slug: "", short: "전체", label: "전체", count: INFLUENCER_REF_TOTAL }, ...INFLUENCER_REF_CATEGORIES];

  return (
    <>
      <div className="px-4 py-3 md:px-8" style={{ background: "var(--cd-dark-2)" }}>
        <p className="mx-auto w-full max-w-[1080px] text-[13px] leading-relaxed md:text-[14px]" style={{ color: "var(--cd-on-dark)" }}>
          여기 캡처는 하랑이 함께 쓰는 협력 배포망의 게시 실적입니다. 하랑이 단독으로 진행한 건만 모은 것은 아닙니다. 캡처한 날의 화면이고, 글이 어디에 얼마나 오래 보이는지는 네이버가 정합니다.
        </p>
      </div>

      <div className="px-3 pb-14 md:px-8 md:pb-20" style={{ background: "var(--cd-dark)" }}>
        <div className="mx-auto w-full max-w-[1080px] overflow-hidden rounded-[20px] bg-white md:rounded-[26px]">
          <div
            className="px-4 py-3 md:px-8 md:py-4"
            style={{ borderBottom: "1px solid var(--cd-border-2)" }}
          >
            <div className="flex gap-2 overflow-x-auto scrollbar-hide lg:flex-wrap lg:overflow-visible" role="tablist" aria-label="업종 선택">
              {tabs.map((c) => {
                const on = c.slug === slug;
                return (
                  <button
                    key={c.slug || "all"}
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setSlug(c.slug);
                      setShown(STEP);
                    }}
                    title={c.label}
                    className="flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-full px-3.5 text-[13px] font-bold transition-colors md:text-[14px]"
                    style={
                      on
                        ? { background: "var(--cd-primary)", color: "#fff" }
                        : { background: "var(--cd-tint)", border: "1px solid var(--cd-border)", color: "var(--cd-body-2)" }
                    }
                  >
                    {c.short}
                    <span className="ml-1.5 text-[12px]" style={{ color: on ? "rgba(255,255,255,.88)" : "var(--cd-primary)" }}>
                      {c.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 px-3 py-5 md:gap-4 md:px-8 md:py-8 lg:grid-cols-2">
            {list.slice(0, shown).map((r, i) => (
              <figure key={r.image} className="overflow-hidden rounded-[14px]" style={{ border: "1px solid var(--cd-border)" }}>
                <figcaption
                  className="flex items-center gap-2.5 px-3 py-2.5 md:px-[18px] md:py-3"
                  style={{ background: "var(--cd-tint)", borderBottom: "1px solid var(--cd-border-2)" }}
                >
                  <span
                    className="flex h-[21px] min-w-[21px] shrink-0 items-center justify-center rounded-[5px] px-1 text-[11px] font-black text-white"
                    style={{ background: "var(--cd-primary)" }}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[14px] font-bold md:text-[16px]" style={{ color: "var(--cd-ink-2)" }} title={r.keyword}>
                    {r.keyword}
                  </span>
                  <span className="shrink-0 text-[12px] md:text-[13px]" style={{ color: "var(--cd-muted)" }}>
                    {shortDate(r.date)} 캡처
                  </span>
                </figcaption>
                <img
                  src={r.image}
                  alt={`'${r.keyword}' 검색 화면의 인플루언서 글 캡처`}
                  width={r.w}
                  height={r.h}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </figure>
            ))}
          </div>

          {shown < list.length && (
            <div className="px-4 pb-8 text-center md:px-8">
              <button
                onClick={() => setShown((n) => n + STEP)}
                className="min-h-11 rounded-xl px-6 text-[15px] font-bold transition-colors"
                style={{ background: "var(--cd-tint)", border: "1px solid var(--cd-border)", color: "var(--cd-body-2)" }}
              >
                더 보기 ({list.length - shown}건 남음)
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
