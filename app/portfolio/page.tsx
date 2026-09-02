import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, LineChart, Store } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPortfolio } from "../lib/portfolio";
import { TRACK_RECORD, TRACK_TOTALS } from "../lib/track-record";
import PortfolioGrid from "./PortfolioGrid";
import { PlaceRankCaseCards } from "../components/PlaceRankCases";
import {
  byCode, PLACE_RANK_GENERATED, PLACE_RANK_LABEL_NOTE, PLACE_RANK_NOTE, PLACE_RANK_TOTALS,
} from "../lib/place-rank-cases";

export const metadata: Metadata = {
  title: "업종별 마케팅 사례",
  description:
    "음식점·카페·병원·미용실·학원부터 인테리어·여행까지, 하랑마케팅이 직접 진행한 업종별 마케팅 사례를 모았습니다.",
  alternates: { canonical: "https://www.harangmarketing.com/portfolio" },
};

export default function PortfolioPage() {
  const { industries, total, generatedAt } = getPortfolio();

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "var(--w-bg-alt)" }}>
        <div className="mx-auto max-w-[1100px] px-5 py-12 md:py-16">
          <div className="mb-8">
            <span className="w-chip w-chip-blue">
              <Briefcase size={12} strokeWidth={2.5} />
              PORTFOLIO
            </span>
            <h1 className="w-heading-1 mt-3" style={{ color: "var(--w-label-strong)" }}>
              업종별 마케팅 사례
            </h1>
            <p className="w-body-1 mt-3 max-w-[640px]" style={{ color: "var(--w-label-alt)" }}>
              블로그에 공개한 사례 <strong style={{ color: "var(--w-primary)" }}>{total}건</strong>입니다.
              공개 동의를 받은 곳만 올리기 때문에, 대행·대대행으로 관리 중인 매장은 이보다 많습니다.
              나머지는 아래에 상호를 빼고 업종과 지역으로만 정리했습니다.
              업종을 고르면 우리 매장과 비슷한 곳이 어떻게 달라졌는지 바로 확인하실 수 있습니다.
            </p>
          </div>

          <PortfolioGrid industries={industries} />

          {/* 순위 계측 사례 — 블로그 사례와 채널이 다른 실적이다.
              숫자와 표기는 app/lib/place-rank-cases.ts 한 곳에서만 온다 */}
          <section className="mt-16">
            <div className="mb-6">
              <span className="w-chip w-chip-blue">
                <LineChart size={12} strokeWidth={2.5} />
                PLACE RANK
              </span>
              <h2 className="w-heading-2 mt-3" style={{ color: "var(--w-label-strong)" }}>
                매일 잰 네이버 플레이스 순위
              </h2>
              <p className="w-body-2 mt-3 max-w-[680px]" style={{ color: "var(--w-label-alt)" }}>
                위가 블로그에 글로 공개한 사례라면, 여기는 순위를 매일 재서 남긴 기록입니다.
                {" "}{PLACE_RANK_GENERATED} 기준 {PLACE_RANK_TOTALS.stores}곳 {PLACE_RANK_TOTALS.keywords}개 키워드를 계측하고 있고 그중 세 곳입니다.
                {" "}{PLACE_RANK_LABEL_NOTE}
              </p>
            </div>

            <PlaceRankCaseCards cases={byCode("HC-06", "HC-05", "HC-08")} columns={3} />

            <p className="w-caption-1 mt-4" style={{ color: "var(--w-label-assistive)" }}>
              {PLACE_RANK_NOTE}
            </p>

            <Link
              href="/cases/place-rank"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: "var(--w-primary)" }}
            >
              계측 사례 전체 보기
              <ArrowRight size={14} />
            </Link>
          </section>

          <section className="mt-16">
            <div className="mb-6">
              <span className="w-chip w-chip-neutral">
                <Store size={12} strokeWidth={2.5} />
                TRACK RECORD
              </span>
              <h2 className="w-heading-2 mt-3" style={{ color: "var(--w-label-strong)" }}>
                상호 없이 공개하는 관리 매장 이력
              </h2>
              <p className="w-body-2 mt-3 max-w-[680px]" style={{ color: "var(--w-label-alt)" }}>
                위 사례는 블로그에 글로 공개한 것이고, 아래는 실제로 맡아 관리한 매장을 업종별로 정리한 것입니다.
                상호와 지점명은 밝히지 않고 업종 · 지역 · 진행한 항목만 적었습니다. 계약 금액은 넣지 않습니다.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "관리 매장", value: TRACK_TOTALS.stores, unit: "곳" },
                { label: "업종", value: TRACK_TOTALS.trades, unit: "종" },
                { label: "시·도", value: TRACK_TOTALS.regions, unit: "곳" },
                { label: "지금도 관리 중", value: TRACK_TOTALS.ongoing, unit: "곳" },
              ].map((s) => (
                <div key={s.label} className="w-card px-4 py-4 md:px-5 md:py-5">
                  <p className="w-caption-1" style={{ color: "var(--w-label-assistive)" }}>
                    {s.label}
                  </p>
                  <p
                    className="w-title-1 w-num mt-1"
                    style={{ color: "var(--w-label-strong)" }}
                  >
                    {s.value}
                    <span className="w-label-2 ml-0.5" style={{ color: "var(--w-label-alt)" }}>
                      {s.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-4">
              {TRACK_RECORD.map((group) => (
                <div key={group.key} className="w-card p-5 md:p-6">
                  <div className="mb-4 flex items-baseline gap-2">
                    <h3 className="w-title-3" style={{ color: "var(--w-label-strong)" }}>
                      {group.name}
                    </h3>
                    <span className="w-caption-1 w-num" style={{ color: "var(--w-label-assistive)" }}>
                      {group.items.length}곳
                    </span>
                  </div>
                  <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((item, i) => (
                      <li
                        key={`${group.key}-${i}`}
                        className="min-w-0 rounded-lg px-3.5 py-3"
                        style={{ background: "var(--w-bg-alt)" }}
                      >
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span
                            className="w-label-1"
                            style={{ color: "var(--w-label-strong)", fontWeight: 700 }}
                          >
                            {item.trade}
                          </span>
                          {item.region && (
                            <span className="w-caption-1" style={{ color: "var(--w-label-assistive)" }}>
                              {item.region}
                            </span>
                          )}
                          {item.branches && (
                            <span className="w-caption-1 w-num" style={{ color: "var(--w-label-alt)" }}>
                              {item.branches}
                              {item.unit ?? "지점"}
                            </span>
                          )}
                          {item.status === "진행 중" && (
                            <span className="w-chip w-chip-blue">진행 중</span>
                          )}
                        </div>
                        <p className="w-caption-1 mt-1.5" style={{ color: "var(--w-label-alt)" }}>
                          {item.work.join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="w-caption-1 mt-5" style={{ color: "var(--w-label-assistive)" }}>
              계약 대장과 견적 · 계약 서류에서 뽑았습니다. 상호 · 지점명 · 연락처 · 계약 금액은 넣지 않고, 지역은 광역 단위까지만
              적습니다. 업종을 확인하지 못한 곳과 아직 착수하지 않은 곳은 뺐습니다.
            </p>
          </section>

          <div
            className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-[16px] px-7 py-8"
            style={{ background: "var(--w-label-strong)" }}
          >
            <div>
              <p className="w-title-2" style={{ color: "#fff" }}>
                우리 매장은 어떻게 될지 궁금하세요?
              </p>
              <p className="w-body-2 mt-1.5" style={{ color: "var(--w-label-disable)" }}>
                상담 비용 없음 · 계약 강요 없음 · 24시간 내 연락
              </p>
            </div>
            <Link href="/contact" className="w-btn w-btn-primary">
              무료 진단 신청
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          {generatedAt && (
            <p className="w-caption-1 mt-6 text-center" style={{ color: "var(--w-label-assistive)" }}>
              최종 갱신 {generatedAt}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
