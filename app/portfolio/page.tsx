import type { Metadata } from "next";
import { RESULT_CASES, RESULT_CASES_INTRO, caseKinds, leadFigure, serviceNames } from "../lib/result-cases";
import ResultCaseGrid from "./ResultCaseGrid";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPortfolio } from "../lib/portfolio";
import { TRACK_RECORD, TRACK_TOTALS } from "../lib/track-record";
import PortfolioGrid from "./PortfolioGrid";
import HighlightCase from "./HighlightCase";
import SiteAuditCase from "./SiteAuditCase";
import { SianMain, PageHead, Section, Fold, RankSection, CloseBand } from "../components/sian/Sian";
import JsonLd from "../components/JsonLd";
import { breadcrumbLd, webPageLd, updatedAt, ogImage } from "../lib/seo";
import {
  PLACE_RANK_AS_OF, PLACE_RANK_GENERATED, PLACE_RANK_LABEL_NOTE,
} from "../lib/place-rank-cases";

const PORTFOLIO_TITLE = "업종별 마케팅 사례";
const PORTFOLIO_DESCRIPTION =
  "업종별 마케팅 사례. 음식점·카페·병원·미용실·학원부터 인테리어·여행까지 하랑마케팅이 직접 진행한 일과 결과를 업종별로 모았습니다.";
const PORTFOLIO_URL = "https://www.harangmarketing.com/portfolio";

export const metadata: Metadata = {
  title: PORTFOLIO_TITLE,
  description: PORTFOLIO_DESCRIPTION,
  alternates: { canonical: PORTFOLIO_URL },
  openGraph: {
    title: "우리 업종에서 한 일과 결과를 보는 마케팅 사례 · 하랑마케팅",
    description: PORTFOLIO_DESCRIPTION,
    url: PORTFOLIO_URL,
    images: [ogImage("하랑마케팅 업종별 마케팅 사례")],
  },
};

/* WebPage · 빵부스러기 JSON-LD (2026-09-21 · 요청 70) · 순위 데이터 날짜까지 같이 본다 */
const PORTFOLIO_LD = [
  webPageLd({
    path: "/portfolio",
    type: "CollectionPage",
    name: `${PORTFOLIO_TITLE} | 하랑마케팅`,
    description: PORTFOLIO_DESCRIPTION,
    dateModified: updatedAt("/portfolio", PLACE_RANK_GENERATED),
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "업종별 사례", path: "/portfolio" },
  ]),
];

export default function PortfolioPage() {
  const { industries, total, generatedAt } = getPortfolio();

  return (
    <>
      <Header />
      <SianMain>
        <JsonLd data={PORTFOLIO_LD} />
        {/* 머리 사실 줄 · 예전 관리 매장 이력 위 합계 세 칸을 옮겼다 */}
        <PageHead
          where="사례 · 업종별 포트폴리오"
          title="업종별 마케팅 사례"
          lead={`블로그에 공개한 사례 ${total}건입니다. 공개 동의를 받은 곳만 올리기 때문에, 대행·대대행으로 관리 중인 매장은 이보다 많습니다. 나머지는 아래에 상호를 빼고 업종과 지역으로만 정리했습니다.`}
          primary={{ href: "/contact", label: "무료 진단 신청" }}
          link={{ href: "/cases/place-rank", label: "순위 계측 사례 전체 보기" }}
          facts={[
            { label: "블로그 공개 사례", value: `${total}건` },
            { label: "관리 매장", value: `${TRACK_TOTALS.stores}곳` },
            { label: "업종", value: `${TRACK_TOTALS.trades}종` },
            { label: "맡아서 한 일", value: `${TRACK_TOTALS.workKinds}종` },
          ]}
        />

        {/* 성과 사례 : 고객 결과 보고서를 상호 · 지역을 가려 다시 쓴 것 (2026-11-11 (수) 대표 지시) · 종류 칩은 3c2929f */}
        {RESULT_CASES.length > 0 && (
          <Section
            id="result-cases"
            title="보고서로 남긴 성과 사례"
            desc={RESULT_CASES_INTRO.join(" ")}
          >
            <ResultCaseGrid
              cards={RESULT_CASES.map((c) => ({
                id: c.id,
                label: c.label,
                industry: c.industry,
                period: c.period,
                sample: c.sample,
                figure: leadFigure(c),
                summary: c.summary,
                services: serviceNames(c),
                kinds: caseKinds(c),
              }))}
            />
          </Section>
        )}

        {/* 블로그 공개 사례 · 업종 탭 + 검색 · 처음 12건만 그리고 「더 보기」로 늘린다 */}
        <Section
          soft
          id="blog-cases"
          title="블로그에 공개한 사례"
          desc="업종을 고르면 우리 매장과 비슷한 곳이 어떻게 달라졌는지 바로 확인하실 수 있습니다."
        >
          <PortfolioGrid industries={industries} />
        </Section>

        {/* 인스타그램 하이라이트 세팅 사례 · 2026-10-22 · 이미지와 칸 이름은 HL_WORKS 에서 온다 */}
        <HighlightCase />

        {/* 홈페이지 분석 · 개선안 사례 · 2026-10-23 · consent 가 있는 것만 content/site-audit-cases.json 에서 온다 */}
        <SiteAuditCase />

        {/* 순위 계측 사례 · 블로그 사례와 채널이 다른 실적이다.
            숫자와 표기는 app/lib/place-rank-cases.ts 한 곳에서만 온다. 예전 카드 전체 목록은 /cases/place-rank 로 넘긴다 */}
        <RankSection
          soft
          label="업종"
          title="정해진 시각에 잰 네이버 플레이스 순위"
          desc={`위가 블로그에 글로 공개한 사례라면, 여기는 순위를 재서 스냅샷으로 남긴 기록입니다. 정해진 시각에 잰 순위를 그대로 옮겼고, 줄마다 마지막으로 잰 날짜를 적었습니다(가장 최근 계측 ${PLACE_RANK_AS_OF}). ${PLACE_RANK_LABEL_NOTE}`}
          more={{ href: "/cases/place-rank", label: "계측 사례 전체 보기" }}
        />

        <Section
          id="track-record"
          title="상호 없이 공개하는 관리 매장 이력"
          desc="위 사례는 블로그에 글로 공개한 것이고, 아래는 실제로 맡아 관리한 매장을 업종별로 정리한 것입니다. 상호와 지점명은 밝히지 않고 업종 · 지역 · 진행한 항목만 적었습니다. 계약 금액은 넣지 않습니다."
        >
          {TRACK_RECORD.map((group, gi) => (
            <Fold key={group.key} summary={`${group.name} ${group.items.length}곳`} open={gi === 0}>
              <ul className="space-y-3">
                {group.items.map((item, i) => (
                  <li key={`${group.key}-${i}`} className="min-w-0">
                    <span className="font-semibold" style={{ color: "var(--w-label-strong)" }}>{item.trade}</span>
                    {item.branches && (
                      <span className="w-num ml-2 text-sm" style={{ color: "var(--w-label-alt)" }}>
                        {item.branches}
                        {item.unit ?? "지점"}
                      </span>
                    )}
                    <p className="mt-1 text-sm" style={{ color: "var(--w-label-alt)" }}>{item.work.join(" · ")}</p>
                  </li>
                ))}
              </ul>
            </Fold>
          ))}
          <p className="mt-5 text-sm" style={{ color: "var(--w-label-alt)" }}>
            계약 대장과 견적 · 계약 서류에서 뽑았습니다. 상호 · 지점명 · 지역 · 연락처 · 계약 금액은 넣지 않고 업종과
            맡아서 한 일만 적습니다. 업종을 확인하지 못한 곳과 아직 착수하지 않은 곳은 뺐습니다.
          </p>
          {generatedAt && (
            <p className="mt-3 text-sm" style={{ color: "var(--w-label-alt)" }}>최종 갱신 {generatedAt}</p>
          )}
        </Section>

        <CloseBand
          title="우리 매장은 어떻게 될지 궁금하세요?"
          text="상담 비용 없음 · 계약 강요 없음 · 카카오톡 24시간 접수"
          primary={{ href: "/contact", label: "무료 진단 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
