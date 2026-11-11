"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FILTER_KINDS, KIND_LABEL, type CaseKind } from "../lib/case-kinds";

// 카드에 보이는 칸만 받는다 (sensitive 견적 항목 · 원본 자료는 브라우저로 내려보내지 않는다)
export interface ResultCaseCard {
  id: string;
  label: string;
  industry: string;
  period: string;
  sample?: boolean;
  figure: { value: string; label: string } | null;
  summary: string;
  services: string[];
  kinds: CaseKind[];
}

const chip = (on: boolean) =>
  on
    ? { background: "var(--w-label-strong)", color: "#fff" }
    : { background: "var(--w-bg)", color: "var(--w-label-alt)", border: "1px solid var(--w-line-strong)" };

export default function ResultCaseGrid({ cards }: { cards: ResultCaseCard[] }) {
  const [kind, setKind] = useState<CaseKind | "all">("all");
  const kinds = FILTER_KINDS.filter((k) => cards.some((c) => c.kinds.includes(k)));
  const shown = kind === "all" ? cards : cards.filter((c) => c.kinds.includes(kind));

  return (
    <>
      {kinds.length > 1 && (
        <div className="mb-5 overflow-x-auto scrollbar-hide" role="group" aria-label="사례 종류로 보기">
          <div className="flex w-max gap-1.5">
            {(["all", ...kinds] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                aria-pressed={kind === k}
                className="w-btn w-btn-sm min-h-11 shrink-0"
                style={chip(kind === k)}
              >
                {k === "all" ? "전체" : KIND_LABEL[k]} {k === "all" ? cards.length : cards.filter((c) => c.kinds.includes(k)).length}
              </button>
            ))}
          </div>
        </div>
      )}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {shown.map((c) => (
          <li key={c.id} className="min-w-0">
            <Link href={`/portfolio/cases/${c.id}`} className="flex h-full flex-col rounded-2xl border p-5 md:p-6" style={{ borderColor: "var(--w-line)", background: "var(--w-bg)" }}>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="w-chip w-chip-blue">{c.industry}</span>
                <span className="w-caption-1" style={{ color: "var(--w-label-assistive)" }}>{c.period}</span>
                {c.sample && <span className="w-chip w-chip-neutral">가상 시안</span>}
              </div>
              <h3 className="w-title-3 mt-3" style={{ color: "var(--w-label-strong)" }}>{c.label}</h3>
              {c.figure && (
                <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--w-line)" }}>
                  <p className="w-heading-2 w-num" style={{ color: "var(--w-primary)" }}>{c.figure.value}</p>
                  <p className="w-caption-1 mt-1" style={{ color: "var(--w-label-alt)" }}>{c.figure.label}</p>
                </div>
              )}
              <p className="w-body-2 mt-4 line-clamp-2" style={{ color: "var(--w-label)" }}>{c.summary}</p>
              <ul className="mt-3 flex flex-wrap gap-1" aria-label="사례 종류">
                {c.kinds.map((k) => (
                  <li key={k} className="w-chip w-chip-neutral">{KIND_LABEL[k]}</li>
                ))}
              </ul>
              {c.services.length > 0 && (
                <p className="w-caption-1 mt-2 line-clamp-2" style={{ color: "var(--w-label-assistive)" }}>
                  {c.services.join(" · ")}
                </p>
              )}
              <span className="mt-auto inline-flex min-h-11 items-center gap-1 pt-4 text-sm font-semibold" style={{ color: "var(--w-primary)" }}>
                사례 보기
                <ArrowRight size={14} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
