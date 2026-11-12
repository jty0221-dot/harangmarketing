import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import PlaceRankExplorer from "./PlaceRankExplorer";
import {
  SianMain, PageHead, AnswerRow, Section, ItemList, QuestionList, CloseBand, SearchSketch, TermList,
} from "../../components/sian/Sian";
import { PLAIN_TERMS } from "../../lib/plain-terms";
import PlaceRankMonitoring from "../../components/PlaceRankMonitoring";
import { SITE, breadcrumbLd, faqLd, itemListLd, webPageLd, updatedAt, type FaqItem, ogImage } from "../../lib/seo";
import {
  PLACE_RANK_CASES,
  PLACE_RANK_AS_OF,
  PLACE_RANK_GENERATED,
  PLACE_RANK_EXCLUSIONS,
  PLACE_RANK_EXCLUSIONS_NOTE,
  PLACE_RANK_LABEL_NOTE,
  PLACE_RANK_NOTE,
  PLACE_RANK_MEASURE_TIME,
  PLACE_RANK_BIGGEST_GAIN,
  PLACE_RANK_INDUSTRIES,
  fmtArrow,
  fmtMoveDays,
} from "../../lib/place-rank-cases";

/**
 * 매장별 순위 계측 사례 전체 목록.
 *
 * 숫자와 표기는 app/lib/place-rank-cases.ts 에서만 온다. 이 파일에 순위를 적지 않는다.
 * 병 · 의원 사례는 lib 의 필터에서 걸러지므로 여기서 다시 거르지 않는다.
 */

const PATH = "/cases/place-rank";
/**
 * 순위 기록을 볼 때 자주 묻는 것 — 화면 FAQ 와 FAQPage JSON-LD 가 같은 배열을 쓴다 (seo.ts 원칙 1 · 3).
 * 답은 이 페이지에 이미 있는 문장(제외 기준 · 재는 시각)을 그대로 옮긴 것이라 손으로 적은 숫자가 없다.
 * 질문형 소제목과 직답 한 문단이 AI 검색 · 답변 엔진에 인용되는 단위다 (2026-09-20 · D-0290 · 요청 68).
 */
const RANK_FAQ: FaqItem[] = [
  {
    q: "순위는 언제 재나요?",
    a: `${PLACE_RANK_MEASURE_TIME}에 재서 그날 값으로 남깁니다. 재지 못한 날은 빈칸으로 두고, 내려간 키워드는 원인을 찾아 손본 뒤 다시 잽니다.`,
  },
  { q: "여기 적힌 순위는 언제 잰 값인가요?", a: PLACE_RANK_EXCLUSIONS[2].body },
  { q: "상호와 지역명은 왜 없나요?", a: PLACE_RANK_EXCLUSIONS[1].body },
  { q: "1페이지는 어디까지인가요?", a: PLACE_RANK_EXCLUSIONS[0].body },
  { q: "방문객이나 매출도 보여 주시나요?", a: PLACE_RANK_EXCLUSIONS[3].body },
  { q: "몇 위까지 올려 주시나요?", a: PLACE_RANK_EXCLUSIONS[4].body },
];
/** 업종은 기록에서 뽑는다. 손으로 적으면 기록이 빠진 업종이 설명에 남는다 */
const DESCRIPTION = `네이버 플레이스 순위 계측 기록입니다. ${PLACE_RANK_INDUSTRIES.join("·")}의 시작 순위와 확인된 순위, 걸린 일수만 적었습니다.`;

export const metadata: Metadata = {
  title: "네이버 플레이스 순위 계측 사례 | 업종·지역별 기록",
  description: DESCRIPTION,
  keywords: [
    "네이버 플레이스 순위",
    "플레이스 정보 정비 사례",
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
    images: [ogImage("하랑마케팅 순위 계측 사례")],
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
  // 페이지 코드가 바뀐 날(PAGE_UPDATED)과 순위 데이터를 다시 만든 날 중 늦은 쪽. sitemap 도 같은 값을 쓴다 (2026-09-20 · 요청 69)
  dateModified: updatedAt(PATH, PLACE_RANK_GENERATED),
});

const CRUMB_LD = breadcrumbLd([
  { name: "홈", path: "/" },
  { name: "사례", path: "/cases" },
  { name: "플레이스 순위 계측", path: PATH },
]);

const LINKS = [
  { href: "/services/place", label: "네이버 플레이스 SEO", desc: "이 기록을 만든 작업이 무엇인지 봅니다" },
  { href: "/cases", label: "전체 성공 사례", desc: "업종별 순위 기록과 맡아 온 매장 수" },
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
      <SianMain>
        <PageHead
          where="진행 사례 · 플레이스 순위 기록"
          title={<>네이버 플레이스 순위,<br />잰 그대로 적었습니다</>}
          lead={<>
            하랑마케팅이 관리하는 매장의 네이버 플레이스 순위를 정해진 시각에 재서 남긴 기록입니다.
            시작 순위와 확인된 순위, 걸린 일수만 적었습니다. {PLACE_RANK_LABEL_NOTE}
          </>}
          primary={{ href: "/free-check", label: "내 매장 순위 무료로 재보기" }}
          link={{ href: "/services/place", label: "이 기록을 만든 작업 보기" }}
          facts={[
            { label: "순위 계측", value: "정해진 시각" },
            { label: "최대 상승", value: PLACE_RANK_BIGGEST_GAIN ? fmtArrow(PLACE_RANK_BIGGEST_GAIN.best) : "계측 중" },
            { label: "기준일", value: PLACE_RANK_AS_OF },
          ]}
        />

        {/* 처음 보는 대표님용 · 카드 읽는 법. 뜻풀이는 app/lib/plain-terms.ts */}
        <Section id="plain" eyebrow="처음이시라면" title="이 기록은 이렇게 읽습니다" desc="카드 한 장이 키워드 하나입니다. 상호와 지역명은 적지 않았습니다.">
          <SearchSketch focus={["place"]} />
          <TermList terms={[PLAIN_TERMS.place, PLAIN_TERMS.keyword, PLAIN_TERMS.snapshot, PLAIN_TERMS.exposure]} />
        </Section>

        <AnswerRow
          question="하랑마케팅의 네이버 플레이스 순위 계측 결과는 어떤가요?"
          answer={`직접 저장한 네이버 플레이스 순위를 키워드마다 한 장씩 공개합니다. 검색량이 큰 키워드부터 보면 ${PLACE_RANK_CASES.slice(0, 4)
            .map((c) => `${c.industry} ${c.keywords[0].detail} 키워드 ${fmtMoveDays(c.keywords[0])}`)
            .join(", ")}. ${PLACE_RANK_NOTE}`}
        />

        {/* 올린 뒤에도 계속 재고 있다는 것 — 세는 값 없이 재는 방식만 보여준다 (2026-09-07 (월) 대표 지시) */}
        <PlaceRankMonitoring background="bg-white" />

        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <PlaceRankExplorer />
            <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-3xl">
              {PLACE_RANK_NOTE}
            </p>
          </div>
        </section>

        {/*
          화면에 올리지 않는 것 — /cases 의 「계측 방법과 제외 기준 보기」 가 약속한 쪽.
          문구는 전부 app/lib/place-rank-cases.ts 에서 온다. 여기서 기준을 새로 만들지 않는다.
        */}
        <Section title="화면에 올리지 않는 것" desc={PLACE_RANK_EXCLUSIONS_NOTE}>
          <ItemList items={PLACE_RANK_EXCLUSIONS.map((x) => ({ title: x.title, desc: x.body }))} />
        </Section>

        <JsonLd data={faqLd(RANK_FAQ, `${SITE.base}${PATH}`)} />
        <Section
          soft
          id="faq"
          title="순위 기록을 보실 때 자주 묻는 것"
          desc="여기 적힌 답은 위 카드와 제외 기준의 문장을 그대로 옮긴 것입니다."
          more={{ href: "/faq", label: "전체 질문 보기" }}
        >
          <QuestionList items={RANK_FAQ} />
        </Section>

        <Section title="이어서 볼 곳">
          <ItemList items={LINKS.map((l) => ({ title: l.label, desc: l.desc, href: l.href }))} />
        </Section>

        <CloseBand
          title="지금 우리 매장은 몇 위인지부터 재 봅니다"
          text="매장명과 지역, 노리는 검색어를 알려 주시면 현재 순위를 재서 알려 드립니다. 상담 비용은 0원입니다."
          primary={{ href: "/free-check", label: "무료 진단 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
