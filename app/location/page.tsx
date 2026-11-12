import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SearchSketch, TermList, SianMain, PageHead, AnswerRow, Section, ItemList, CloseBand } from "../components/sian/Sian";
import { PLAIN_TERMS } from "../lib/plain-terms";
import { SITE, ogImage } from "../lib/seo";

const BASE = SITE.base;

/**
 * 지역별 서비스 허브.
 *
 * 왜 만들었나 (2026-08-22): /location/gyeonggi · seoul · incheon 세 페이지의
 * BreadcrumbList 2단계가 `${BASE}/location` 을 가리키는데 그 URL 이 404 였다.
 * 구글이 읽는 구조화 데이터가 존재하지 않는 페이지를 참조하면 빵부스러기 리치결과가 깨진다.
 * 겸사겸사 지역 페이지를 묶는 내부 링크 허브 역할도 한다.
 */

const LOCATION_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${BASE}/location`,
  name: "지역별 마케팅 서비스 · 하랑마케팅",
  url: `${BASE}/location`,
  description:
    "하랑마케팅이 지원하는 지역별 소상공인 마케팅 안내. 전국 어디든 담당하고, 경기·서울·인천은 방문 상담도 가능합니다.",
  isPartOf: { "@id": `${BASE}/#website` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: BASE },
      { "@type": "ListItem", position: 2, name: "지역별 서비스", item: `${BASE}/location` },
    ],
  },
  hasPart: [
    { "@type": "WebPage", name: "경기도", url: `${BASE}/location/gyeonggi` },
    { "@type": "WebPage", name: "서울", url: `${BASE}/location/seoul` },
    { "@type": "WebPage", name: "인천", url: `${BASE}/location/incheon` },
  ],
};

export const metadata: Metadata = {
  title: "지역별 마케팅 서비스 · 전국 소상공인 마케팅 대행사",
  description:
    "전국 소상공인 마케팅을 지원하며 경기·서울·인천은 방문 상담도 가능합니다. 지역 상권에 맞춘 플레이스 SEO·블로그·체험단 전략을 정리했습니다.",
  keywords: [
    "전국 마케팅 대행사", "지역별 마케팅 대행사", "경기 마케팅 대행사", "서울 마케팅 대행사", "인천 마케팅 대행사",
    "고양 마케팅 대행사", "일산 마케팅 대행사", "파주 마케팅", "김포 마케팅", "부천 마케팅",
    "소상공인 마케팅 지역", "우리 동네 마케팅 대행사",
  ],
  alternates: { canonical: `${BASE}/location` },
  openGraph: {
    title: "지역별 마케팅 서비스 · 하랑마케팅",
    description: "전국 소상공인 마케팅. 경기·서울·인천은 방문 상담.",
    url: `${BASE}/location`,
    images: [ogImage("하랑마케팅 지역별 서비스")],
  },
};

const AREAS = [
  {
    href: "/location/gyeonggi",
    name: "경기도",
    head: "가장 많이 맡은 지역",
    body: "고양·일산·파주·김포·부천·수원·성남까지. 경기 북서부는 방문 상담이 가장 빠릅니다.",
    spots: "고양·일산 · 파주 · 김포 · 부천 · 수원 · 성남",
  },
  {
    href: "/location/seoul",
    name: "서울",
    head: "경쟁이 가장 치열한 곳",
    body: "강남·마포·성수·목동 등 상권별 검색 패턴이 완전히 다릅니다. 키워드를 좁게 잡습니다.",
    spots: "강남·서초 · 마포·홍대 · 성수 · 목동 · 종로",
  },
  {
    href: "/location/incheon",
    name: "인천",
    head: "신도시와 구도심이 다른 곳",
    body: "송도·청라는 맘카페와 인스타, 부평·구월은 플레이스와 블로그 비중을 높입니다.",
    spots: "송도·연수 · 부평·계산 · 검단 · 구월·남동",
  },
];

export default function LocationHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCATION_LD) }} />
      <Header />
      <SianMain>
        <PageHead
          where="전국 어디든"
          title={<>지역마다 검색하는 말이<br />다릅니다</>}
          lead="같은 업종이라도 일산에서 찾는 말과 강남에서 찾는 말이 다릅니다. 지역 상권을 먼저 보고 키워드를 잡습니다. 경기 북서부는 방문 상담도 가능합니다."
          primary={{ href: "/contact", label: "무료 상담 신청" }}
          link={{ href: "/free-check", label: "내 매장 무료 진단" }}
          facts={[
            { label: "설립", value: "2020년 4월 15일" },
            { label: "방문 상담", value: "경기 북서부" },
            { label: "지원 지역", value: "전국" },
            { label: "상담 비용", value: "0원" },
          ]}
        />

        <AnswerRow
          question="하랑마케팅은 어느 지역까지 담당하나요?"
          answer="하랑마케팅은 전국 소상공인을 지원합니다. 지금까지 맡은 매장이 부산·대구·제주·세종을 포함해 14개 시·도에 있습니다. 고양·일산·파주·김포·부천 등 경기 북서부는 사무실이 가까워 방문 상담이 가능하고, 그 밖의 지역은 카카오톡·전화·화상으로 상담합니다. 온라인 마케팅 작업 자체는 지역과 상관없이 동일하게 진행하며, 지역마다 검색 패턴이 달라 상권을 먼저 분석한 뒤 키워드를 정합니다. 상담 비용은 0원입니다."
        />

        {/* 지역 이름을 붙여 검색했을 때 보이는 화면 그림 · 처음 보는 대표님용 */}
        <Section soft title="동네 이름을 붙여 검색하면 이런 화면이 나옵니다" desc="손님은 가게 이름보다 동네 이름과 업종을 먼저 칩니다. 그래서 지역마다 채워야 하는 자리가 다릅니다.">
          <SearchSketch focus={["place", "post"]} />
          <TermList terms={[PLAIN_TERMS.keyword, PLAIN_TERMS.place]} />
        </Section>

        <Section title="지역별 전략 보기" desc="지역을 고르면 그 지역 상권에서 실제로 만든 성과를 볼 수 있습니다">
          <ItemList one items={AREAS.map((a) => ({ title: `${a.name} · ${a.head}`, desc: `${a.body} (${a.spots})`, href: a.href }))} />
        </Section>

        <CloseBand
          title="찾으시는 지역이 목록에 없나요"
          text="온라인 마케팅은 지역과 무관하게 진행할 수 있습니다. 실제로 포항·울산·부산·창원 매장도 담당하고 있습니다. 지역을 알려주시면 그 상권의 검색량부터 확인해 드립니다."
          primary={{ href: "/contact", label: "내 지역 상권 확인 요청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
