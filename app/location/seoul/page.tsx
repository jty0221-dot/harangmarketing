import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { SianMain, PageHead, AnswerRow, Section, ItemList, CloseBand } from "../../components/sian/Sian";

import { SITE, ogImage, companyYear } from "../../lib/seo";
const BASE = "https://www.harangmarketing.com";

const SEOUL_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE}/location/seoul`,
  "name": "하랑마케팅 · 서울 소상공인 마케팅",
  "url": `${BASE}/location/seoul`,
  "logo": `${BASE}/harang-logo-square.png`,
  "image": `${BASE}/og-image.png`,
  "telephone": SITE.phone,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": SITE.address.street,
    "addressLocality": SITE.address.locality,
    "addressRegion": SITE.address.region,
    "postalCode": SITE.address.postalCode,
    "addressCountry": SITE.address.country,
  },
  "description": "서울 강남·강서·마포·성수·홍대·종로 소상공인 맞춤 마케팅. 10년 경력, 대표가 직접 관리. 네이버 플레이스 SEO, 블로그, 체험단, 인스타그램 전문.",
  "areaServed": [
    { "@type": "City", "name": "서울특별시" },
    { "@type": "AdministrativeArea", "name": "강남구" },
    { "@type": "AdministrativeArea", "name": "강서구" },
    { "@type": "AdministrativeArea", "name": "마포구" },
    { "@type": "AdministrativeArea", "name": "성동구" },
    { "@type": "AdministrativeArea", "name": "종로구" },
    { "@type": "AdministrativeArea", "name": "송파구" },
    { "@type": "AdministrativeArea", "name": "영등포구" },
  ],
  "knowsAbout": ["네이버 플레이스 SEO", "서울 소상공인 마케팅", "블로그 마케팅", "체험단 마케팅", "인스타그램 마케팅"],
  "parentOrganization": { "@type": "Organization", "name": "하랑마케팅", "url": BASE },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": BASE },
      { "@type": "ListItem", "position": 2, "name": "지역별 서비스", "item": `${BASE}/location` },
      { "@type": "ListItem", "position": 3, "name": "서울", "item": `${BASE}/location/seoul` },
    ],
  },
};

export const metadata: Metadata = {
  title: "서울 소상공인 마케팅 대행사 | 네이버 플레이스·블로그·SNS",
  description: "서울 강남·강서·마포·성수·홍대·종로 소상공인 마케팅으로 네이버 플레이스 SEO·블로그·체험단·인스타그램을 10년 경력 대표가 직접 관리합니다.",
  keywords: [
    "서울 마케팅 대행사", "서울 소상공인 마케팅", "서울 플레이스 SEO",
    "강남 마케팅", "강서 마케팅", "마포 마케팅", "성수 마케팅", "홍대 마케팅",
    "서울 네이버 플레이스", "서울 블로그 마케팅", "서울 체험단", "종로 마케팅", "송파 마케팅",
  ],
  alternates: { canonical: `${BASE}/location/seoul` },
  openGraph: {
    title: "서울 소상공인 마케팅 대행사 | 하랑마케팅",
    description: "서울 강남·강서·마포·성수·홍대 등 전 지역 담당. 10년 경력 대표 직접 관리.",
    url: `${BASE}/location/seoul`,
    images: [ogImage("서울 마케팅 대행사 하랑마케팅")],
  },
};

const REGIONS = [
  { name: "강남·서초", focus: "병의원·피부과 밀집 · 브랜드 검색 경쟁이 가장 세다" },
  { name: "강서·양천", focus: "마곡 업무지구 · 직장인 점심·퇴근 검색 비중이 높다" },
  { name: "마포·홍대", focus: "유동인구 상권 · 방문과 배달 검색이 함께 움직인다" },
  { name: "성수·뚝섬", focus: "카페·편집숍 밀집 · 인스타에서 넘어오는 유입이 크다" },
  { name: "목동·신정", focus: "학원가 · 학부모 커뮤니티 영향력이 특히 강하다" },
  { name: "종로·인사동", focus: "관광 상권 · 지도 노출과 외국어 검색을 함께 본다" },
  { name: "노원·도봉", focus: "주거 밀집 · 재방문과 리뷰 관리가 순위를 좌우한다" },
  { name: "송파·잠실", focus: "대형 주거 상권 · 병의원·한방 경쟁 밀도가 높다" },
];

export default function SeoulPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SEOUL_LD) }} />
      <Header />
      <SianMain>
        <PageHead
          where="서울 전 지역 · 방문 상담 가능"
          title={<>서울 소상공인<br />마케팅 대행사</>}
          lead="강남·강서·마포·성수·홍대·목동 등 서울 전 지역을 맡고 있습니다. 서울 상권의 치열한 경쟁 구도를 정확히 이해하고 있습니다."
          primary={{ href: "/contact?region=서울", label: "서울 무료 상담 신청" }}
          link={{ href: "/free-check", label: "내 매장 무료 진단" }}
          facts={[
            { value: "월 단위", label: "계약 기간 · 처음이면 2~3개월 이상" },
            { value: `${companyYear()}년차`, label: "2020년 개업" },
            { value: "10년", label: "경력" },
            { value: "0원", label: "상담 비용" },
          ]}
        />

        {/* AEO · 지역 질의 한 줄 정답 (speakable) */}
        <AnswerRow
          question="서울 소상공인 마케팅 대행사, 어디에 맡겨야 하나요?"
          answer="하랑마케팅은 서울 전 지역 소상공인을 지원하는 마케팅 대행사입니다. 강남·강서·마포·성수·홍대·종로·송파·영등포 등 상권별 경쟁 강도가 다르기 때문에 지역마다 다른 키워드 전략을 씁니다. 서울은 경쟁이 치열한 상권이 많아 몇 달 안에 몇 위라고 미리 약속드리지 않고, 상담 때 지금 순위부터 재서 어느 정도 걸리는 자리인지 말씀드립니다. 계약은 월 단위가 기본이고 중도 해지 위약금이 없습니다. 다만 마케팅을 처음 하시는 분은 기본 세팅부터 잡아야 해서 2~3개월 이상은 진행하셔야 합니다. 서울 전 지역 방문 상담과 비대면 상담 모두 가능하며 상담 비용은 0원입니다."
        />

        <Section soft title="서울 상권별 특성" desc="같은 서울이어도 고객이 찾아오는 경로가 다릅니다. 상권에 맞춰 채널을 나눕니다">
          <ItemList items={REGIONS.map((r) => ({ title: r.name, desc: r.focus }))} />
        </Section>

        <Section title="서울 마케팅, 이렇게 다릅니다" desc="경쟁이 치열할수록 더 정교한 전략이 필요합니다">
          <ItemList one items={[
            { title: "키워드 경쟁 강도 분석", desc: "서울은 같은 업종 경쟁자가 수백 개입니다. 틈새 키워드와 롱테일 키워드 전략 없이는 순위 진입이 불가능합니다." },
            { title: "MZ 타겟 SNS 전략", desc: "성수·홍대·합정 권역은 인스타그램과 릴스 영향력이 절대적입니다. 트렌드에 맞는 콘텐츠 포맷이 핵심입니다." },
            { title: "리뷰 질 관리", desc: "서울 소비자는 리뷰 내용을 꼼꼼히 봅니다. 단순 별점이 아닌 신뢰도 높은 텍스트 실제 이용 후기 안내 전략이 필요합니다." },
          ]} />
        </Section>

        <CloseBand
          title="서울 매장, 무료로 진단받으세요"
          text="지역 경쟁사 분석부터 맞춤 전략까지 비용 0원."
          primary={{ href: "/contact?region=서울", label: "무료 상담 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
