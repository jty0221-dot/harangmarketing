import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import {
  PLACE_RANK_AS_OF,
  PLACE_RANK_MEASURE_TIME,
  byVolume,
  type PlaceRankCase,
} from "../lib/place-rank-cases";

/**
 * 플레이스 키워드 순위표. 카드와 같은 계측값을 한 표에 줄로 세운다.
 *
 * 2026-09-17 (목) 대표 지시
 *   「별도 순위표도 만들어서 진행사례에 뿐만 아니라 서비스에 보이도록」
 *   카드는 키워드 하나를 크게 보여 주고, 표는 여러 키워드를 한눈에 견주게 한다.
 *
 * 숫자는 전부 app/lib/place-rank-cases.ts 에서만 온다. 여기서 순위를 새로 계산하지 않는다.
 *
 * 몇 줄인지 세는 문장을 적지 않는다 (2026-09-07 (월) 대표 지시).
 *   「이런 멘트 자체를 넣지마 고객이 보았을 때 이것밖에 안하는 매장처럼 보이잖아」
 *   이 표는 그날 1~5위 안에 있던 키워드의 발췌라서, 줄 수를 적으면 그것이 전부로 읽힌다.
 *
 * 유지 줄은 유지로만 적는다. 올랐다는 말을 붙이지 않는다.
 * volume(월 검색수)은 줄 순서에만 쓰고 화면에 적지 않는다.
 * 재는 시각은 PLACE_RANK_MEASURE_TIME 한 곳에서만 가져온다. 「실시간」이라고 쓰지 않는다.
 *
 * 서버 · 클라이언트 컴포넌트 양쪽에서 부를 수 있게 훅과 fs 를 쓰지 않는다.
 */

const WIDTH = { "5xl": "max-w-5xl", "6xl": "max-w-6xl" } as const;
const TONE = { white: "bg-white", gray: "bg-gray-50" } as const;

export default function PlaceRankTable({
  cases,
  limit,
  id = "place-rank-table",
  eyebrow = "순위표",
  title = "플레이스 키워드 순위표",
  align = "left",
  tone = "white",
  width = "6xl",
  more,
}: {
  /** 넘기지 않으면 검색이 많은 키워드부터 (byVolume) */
  cases?: PlaceRankCase[];
  limit?: number;
  id?: string;
  eyebrow?: string;
  title?: string;
  align?: "left" | "center";
  tone?: keyof typeof TONE;
  width?: keyof typeof WIDTH;
  more?: { href: string; label: string };
}) {
  const all = cases ?? byVolume();
  const rows = typeof limit === "number" ? all.slice(0, limit) : all;
  if (rows.length === 0) return null;

  const center = align === "center";

  return (
    <section id={id} className={`py-10 md:py-14 border-t border-gray-100 ${TONE[tone]}`}>
      <div className={`${WIDTH[width]} mx-auto px-4 md:px-6 lg:px-8`}>
        <div className={`max-w-4xl ${center ? "mx-auto text-center" : ""}`}>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--w-primary)" }}
          >
            {eyebrow}
          </p>
          <h2 className="text-xl md:text-2xl font-black text-gray-900">{title}</h2>
          <p className={`mt-2 text-sm text-gray-500 leading-relaxed max-w-2xl ${center ? "mx-auto" : ""}`}>
            {PLACE_RANK_AS_OF} 계측분에서 1~5위 안에 있는 키워드입니다. 시작 순위와 최근 순위,
            계측 기간만 적었습니다.
          </p>
        </div>

        <div
          className={`mt-6 max-w-4xl ${center ? "mx-auto" : ""} rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">
                {PLACE_RANK_AS_OF} 계측 기준 플레이스 키워드별 시작 순위, 최근 순위, 계측 기간
              </caption>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th scope="col" className="pl-4 pr-2 md:px-4 py-3 font-bold text-gray-700">
                    키워드
                  </th>
                  <th scope="col" className="hidden md:table-cell px-4 py-3 font-bold text-gray-700">
                    업종
                  </th>
                  <th scope="col" className="px-2 md:px-4 py-3 font-bold text-gray-700 whitespace-nowrap">
                    시작<span className="hidden md:inline"> 순위</span>
                  </th>
                  <th scope="col" className="px-2 md:px-4 py-3 font-bold text-gray-700 whitespace-nowrap">
                    최근<span className="hidden md:inline"> 순위</span>
                  </th>
                  <th scope="col" className="pl-2 pr-4 md:px-4 py-3 font-bold text-gray-700 whitespace-nowrap">
                    <span className="hidden md:inline">계측 </span>기간
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => {
                  const k = c.keywords[0];
                  const held = c.trend === "유지";
                  return (
                    <tr key={c.code} className="border-b border-gray-100 last:border-0 align-top">
                      <th scope="row" className="pl-4 pr-2 md:px-4 py-3 text-left font-normal">
                        <span className="block font-semibold text-gray-900">{k.detail}</span>
                        <span className="md:hidden block mt-0.5 text-xs text-gray-500">{c.industry}</span>
                      </th>
                      <td className="hidden md:table-cell px-4 py-3 text-gray-600">{c.industry}</td>
                      <td className="px-2 md:px-4 py-3 text-gray-500 tabular-nums whitespace-nowrap">
                        {k.from}위
                      </td>
                      <td className="px-2 md:px-4 py-3 whitespace-nowrap">
                        <span className="font-bold tabular-nums" style={{ color: "var(--w-primary)" }}>
                          {k.to}위
                        </span>
                        {held && (
                          <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-gray-500">
                            <ShieldCheck size={11} strokeWidth={2.5} aria-hidden="true" />
                            유지
                          </span>
                        )}
                      </td>
                      <td className="pl-2 pr-4 md:px-4 py-3 text-gray-600 tabular-nums whitespace-nowrap">
                        {k.days}일
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={`mt-4 max-w-4xl ${center ? "mx-auto" : ""} flex flex-col gap-3 md:flex-row md:items-start md:justify-between`}
        >
          <p className="text-xs text-gray-500 leading-relaxed text-left">
            {PLACE_RANK_MEASURE_TIME} 사이에 잰 애드랭크 계측값입니다. 계측 기간은 계측을 시작한 날부터
            그 순위가 확인된 날까지입니다. 상호와 지역명은 적지 않았습니다.
          </p>
          {more && (
            <Link
              href={more.href}
              className="inline-flex items-center gap-1.5 shrink-0 text-sm font-bold min-h-11 md:min-h-0 hover:underline"
              style={{ color: "var(--w-primary)" }}
            >
              {more.label}
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
