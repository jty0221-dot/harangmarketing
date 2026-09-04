import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LineChart } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import AnswerBlock from "../../components/AnswerBlock";
import PlaceRankExplorer from "./PlaceRankExplorer";
import PlaceRankMonitoring from "../../components/PlaceRankMonitoring";
import { breadcrumbLd, itemListLd, webPageLd } from "../../lib/seo";
import {
  PLACE_RANK_CASES,
  PLACE_RANK_AS_OF,
  PLACE_RANK_GENERATED,
  PLACE_RANK_HELD,
  PLACE_RANK_LABEL_NOTE,
  PLACE_RANK_NOTE,
  PLACE_RANK_RISEN,
  PLACE_RANK_TOTALS,
  fmtMoveDays,
} from "../../lib/place-rank-cases";

/**
 * 매장별 순위 계측 사례 전체 목록.
 *
 * 숫자와 표기는 app/lib/place-rank-cases.ts 에서만 온다. 이 파일에 순위를 적지 않는다.
 * 병 · 의원 사례는 lib 의 필터에서 걸러지므로 여기서 다시 거르지 않는다.
 */

const PATH = "/cases/place-rank";
const DESCRIPTION =
  "꽃집 · 음식점 · 청소 업체 · 네일숍 · 카페 · 가발 전문점의 네이버 플레이스 순위 계측 기록입니다. 상호와 지역명은 적지 않고, 시작 순위와 확인된 순위와 걸린 일수만 그대로 적었습니다.";

export const metadata: Metadata = {
  title: "네이버 플레이스 순위 계측 사례 | 업종·지역별 기록",
  description: DESCRIPTION,
  keywords: [
    "네이버 플레이스 순위",
    "플레이스 상위노출 사례",
    "업종별 플레이스 순위 사례",
    "청소업체 플레이스 마케팅",
    "카페 플레이스 순위",
    "플레이스 순위 계측",
  ],
  alternates: { canonical: `https://www.harangmarketing.com${PATH}` },
  openGraph: {
    title: "네이버 플레이스 순위 계측 사례 | 하랑마케팅",
    description: DESCRIPTION,
    url: `https://www.harangmarketing.com${PATH}`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 순위 계측 사례" }],
  },
};

const LIST_LD = itemListLd({
  path: PATH,
  name: "네이버 플레이스 순위 계측 사례",
  items: PLACE_RANK_CASES.map((c) => ({
    name: `${c.keywords[0].detail} 키워드 ${fmtMoveDays(c.keywords[0])}`,
    path: `${PATH}#case-${c.code.toLowerCase()}`,
    description: `${c.industry} · ${c.label} · ${fmtMoveDays(c.keywords[0])} · ${c.asOf} 계측`,
  })),
});

const PAGE_LD = webPageLd({
  path: PATH,
  name: "네이버 플레이스 순위 계측 사례",
  description: DESCRIPTION,
  type: "CollectionPage",
  dateModified: PLACE_RANK_GENERATED,
});

const CRUMB_LD = breadcrumbLd([
  { name: "홈", path: "/" },
  { name: "사례", path: "/cases" },
  { name: "플레이스 순위 계측", path: PATH },
]);

const LINKS = [
  { href: "/services/place", label: "네이버 플레이스 SEO", desc: "이 기록을 만든 작업이 무엇인지 봅니다" },
  { href: "/cases", label: "전체 성공 사례", desc: "과정까지 적은 심층 리포트" },
  { href: "/portfolio", label: "업종별 마케팅 사례", desc: "블로그에 공개한 사례와 관리 매장 이력" },
  { href: "/free-check", label: "무료 진단 신청", desc: "지금 우리 매장 순위부터 재 봅니다" },
];

export default function PlaceRankCasesPage() {
  return (
    <>
      <JsonLd data={PAGE_LD} />
      <JsonLd data={LIST_LD} />
      <JsonLd data={CRUMB_LD} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        <section className="bg-gray-950 py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">
              <LineChart size={13} strokeWidth={2.5} />
              Place Rank
            </p>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
              네이버 플레이스 순위,
              <br />
              잰 그대로 적었습니다
            </h1>
            <p className="mt-5 text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl">
              하랑마케팅이 관리하는 매장의 네이버 플레이스 순위를 매일 재서 남긴 기록입니다.
              시작 순위와 확인된 순위, 걸린 일수만 적었습니다.
            </p>
            <p className="mt-3 text-xs md:text-sm text-gray-400 leading-relaxed max-w-2xl">
              {PLACE_RANK_LABEL_NOTE}
            </p>
          </div>
        </section>

        <AnswerBlock
          question="하랑마케팅의 네이버 플레이스 순위 계측 결과는 어떤가요?"
          answer={`${PLACE_RANK_AS_OF} 기준으로 ${PLACE_RANK_TOTALS.stores}곳 ${PLACE_RANK_TOTALS.keywords}개 키워드를 매일 재고 있고, 그중 올라간 ${PLACE_RANK_RISEN}건과 자리를 지키고 있는 ${PLACE_RANK_HELD}건을 키워드마다 한 장씩 공개합니다. ${PLACE_RANK_CASES.slice(0, 4)
            .map((c) => `${c.industry} ${c.keywords[0].detail} 키워드 ${fmtMoveDays(c.keywords[0])}`)
            .join(", ")}. ${PLACE_RANK_NOTE}`}
          facts={[
            { label: "계측 매장", value: `${PLACE_RANK_TOTALS.stores}곳` },
            { label: "계측 키워드", value: `${PLACE_RANK_TOTALS.keywords}개` },
            { label: "1~5위 유지 키워드", value: `${PLACE_RANK_TOTALS.page1Keywords}개` },
            { label: "공개 사례", value: `${PLACE_RANK_TOTALS.works}건` },
          ]}
        />

        {/* 재고 있는 전체 규모 — 카드는 올라간 건만 보여주므로 여기서 전체를 밝힌다 */}
        <PlaceRankMonitoring background="bg-white" />

        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <PlaceRankExplorer />
            <p className="mt-6 text-xs text-gray-500 leading-relaxed max-w-3xl">
              {PLACE_RANK_NOTE}
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-lg md:text-xl font-black text-gray-900 mb-5">이어서 볼 곳</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-4 md:p-5 transition-colors"
                >
                  <p className="text-sm font-semibold text-gray-900">{l.label}</p>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">{l.desc}</p>
                  <span
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold"
                    style={{ color: "var(--w-primary)" }}
                  >
                    바로 가기
                    <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
