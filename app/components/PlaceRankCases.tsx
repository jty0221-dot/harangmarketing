import Link from "next/link";
import { ArrowRight, Check, Clock, Store } from "lucide-react";
import {
  PLACE_RANK_AS_OF,
  PLACE_RANK_LABEL_NOTE,
  PLACE_RANK_NOTE,
  type PlaceRankCase,
} from "../lib/place-rank-cases";

/**
 * 순위 계측 카드 — 카드 하나가 작품 하나다.
 *
 * 한 매장이 키워드 셋을 올렸으면 카드도 셋이고, 표기가 겹쳐도 묶지 않는다
 * (2026-09-04 (금) 대표 지시 — 겹치는 게 있다면 그래도 추가해 별도의 작품이니깐).
 * 그래서 카드의 제목은 매장이 아니라 키워드다.
 *
 * 숫자와 표기는 app/lib/place-rank-cases.ts 한 곳에서만 온다. 이 파일에 숫자를 적지 않는다.
 * label 과 keyword 는 이미 가림 처리가 끝난 값이라 화면에서 다시 만들지 않는다.
 * 쓸 수 있는 문장은 `67위에서 3위 (21일)` 하나뿐이고 집계값을 새로 만들지 않는다.
 *
 * 서버 · 클라이언트 컴포넌트 양쪽에서 부를 수 있게 훅과 fs 를 쓰지 않는다.
 */

export function PlaceRankCaseCards({
  cases,
  columns = 4,
}: {
  cases: PlaceRankCase[];
  columns?: 2 | 3 | 4;
}) {
  if (cases.length === 0) return null;

  const grid =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${grid} gap-3 md:gap-4`}>
      {cases.map((c) => {
        const k = c.keywords[0];
        return (
          <article
            key={c.code}
            id={`case-${c.code.toLowerCase()}`}
            className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm min-w-0"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{k.detail}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                  <Store size={11} strokeWidth={2.5} className="shrink-0" />
                  <span className="truncate">{c.label}</span>
                </p>
              </div>
              {c.page1 && (
                <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                  <Check size={10} strokeWidth={3} />
                  1~5위
                </span>
              )}
            </div>

            <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
              <span className="text-base font-semibold text-gray-400 tabular-nums">{k.from}위</span>
              <span className="text-xs text-gray-400">에서</span>
              <span className="text-2xl font-bold tabular-nums" style={{ color: "var(--w-primary)" }}>
                {k.to}위
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 tabular-nums">
                <Clock size={11} strokeWidth={2.5} />({k.days}일)
              </span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {c.industry} · {c.asOf} 계측
            </p>
          </article>
        );
      })}
    </div>
  );
}

export default function PlaceRankCasesSection({
  cases,
  eyebrow = "순위 계측 기록",
  title,
  description,
  cta,
  columns = 4,
  compact = false,
  background = "bg-white",
}: {
  cases: PlaceRankCase[];
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: { href: string; label: string };
  columns?: 2 | 3 | 4;
  /** 좁은 자리에서는 아래 안내 문장을 한 줄로 줄인다 */
  compact?: boolean;
  background?: string;
}) {
  if (cases.length === 0) return null;

  return (
    <section className={`py-10 md:py-14 border-t border-gray-100 ${background}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 md:mb-8">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--w-primary)" }}>
              {eyebrow}
            </p>
            <h2 className="text-xl md:text-2xl font-black text-gray-900">{title}</h2>
            {description && (
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-2xl">{description}</p>
            )}
          </div>
          {cta && (
            <Link
              href={cta.href}
              className="inline-flex items-center gap-1.5 shrink-0 text-sm font-bold min-h-11 md:min-h-0 hover:underline"
              style={{ color: "var(--w-primary)" }}
            >
              {cta.label}
              <ArrowRight size={13} />
            </Link>
          )}
        </div>

        <PlaceRankCaseCards cases={cases} columns={columns} />

        <p className="mt-5 text-xs text-gray-400 leading-relaxed">
          {PLACE_RANK_AS_OF} 기준 계측값입니다. {PLACE_RANK_NOTE}
          {!compact && ` ${PLACE_RANK_LABEL_NOTE}`}
        </p>
      </div>
    </section>
  );
}
