import Link from "next/link";
import { ArrowRight, Clock, Layers, MapPin } from "lucide-react";
import {
  PLACE_RANK_GENERATED,
  PLACE_RANK_LABEL_NOTE,
  PLACE_RANK_NOTE,
  fmtMoveDays,
  type PlaceRankCase,
} from "../lib/place-rank-cases";

/**
 * 매장별 순위 계측 카드.
 *
 * 숫자와 표기는 app/lib/place-rank-cases.ts 한 곳에서만 온다. 이 파일에 숫자를 적지 않는다.
 * label 은 이미 가림 처리가 끝난 값이라 화면에서 다시 만들지 않는다.
 * 쓸 수 있는 문장은 `67위에서 4위 (10일)` 하나뿐이고 집계값을 새로 만들지 않는다.
 *
 * 서버 · 클라이언트 컴포넌트 양쪽에서 부를 수 있게 훅과 fs 를 쓰지 않는다.
 */

export function PlaceRankCaseCards({
  cases,
  showAllKeywords = false,
  columns = 4,
}: {
  cases: PlaceRankCase[];
  /** 키워드를 전부 펼칠지. 좁은 자리에서는 대표 한 줄만 보여준다 */
  showAllKeywords?: boolean;
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
        const rest = c.keywords.filter((k) => k !== c.keywords[0]);
        return (
          <article
            key={c.code}
            id={`case-${c.code.toLowerCase()}`}
            className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm min-w-0"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{c.label}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={11} strokeWidth={2.5} className="shrink-0" />
                  <span className="truncate">
                    {c.region} · {c.industry}
                  </span>
                </p>
              </div>
              {c.count > 1 && (
                <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                  <Layers size={10} strokeWidth={2.5} />
                  키워드 {c.count}개
                </span>
              )}
            </div>

            <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
              <span className="text-base font-semibold text-gray-400 tabular-nums">
                {c.keywords[0].from}위
              </span>
              <span className="text-xs text-gray-400">에서</span>
              <span className="text-2xl font-bold tabular-nums" style={{ color: "var(--w-primary)" }}>
                {c.keywords[0].to}위
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 tabular-nums">
                <Clock size={11} strokeWidth={2.5} />({c.keywords[0].days}일)
              </span>
            </p>
            <p className="mt-1 text-xs text-gray-500">계측 키워드 · {c.keywords[0].detail}</p>

            {showAllKeywords && rest.length > 0 && (
              <ul className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
                {rest.map((k) => (
                  <li key={k.detail} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-gray-500 truncate">{k.detail}</span>
                    <span className="font-semibold text-gray-700 tabular-nums shrink-0">
                      {fmtMoveDays(k)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
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
  showAllKeywords = false,
  columns = 4,
  compact = false,
  background = "bg-white",
}: {
  cases: PlaceRankCase[];
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: { href: string; label: string };
  showAllKeywords?: boolean;
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

        <PlaceRankCaseCards cases={cases} showAllKeywords={showAllKeywords} columns={columns} />

        <p className="mt-5 text-xs text-gray-400 leading-relaxed">
          {PLACE_RANK_GENERATED} 기준 계측값입니다. {PLACE_RANK_NOTE}
          {!compact && ` ${PLACE_RANK_LABEL_NOTE}`}
        </p>
      </div>
    </section>
  );
}
