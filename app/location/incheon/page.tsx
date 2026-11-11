import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { SianMain, PageHead, AnswerRow, Section, ItemList, CloseBand } from "../../components/sian/Sian";
import { SITE, ogImage } from "../../lib/seo";

const BASE = "https://www.harangmarketing.com";

const INCHEON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE}/location/incheon`,
  "name": "하랑마케팅 · 인천 소상공인 마케팅",
  "url": `${BASE}/location/incheon`,
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
  "description": "인천 부평·송도·연수·부천·검단·계양 소상공인 맞춤 마케팅. 네이버 플레이스 SEO, 블로그, 체험단 전문. 10년 경력 대표 직접 관리.",
  "areaServed": [
    { "@type": "City", "name": "인천광역시" },
    { "@type": "AdministrativeArea", "name": "부평구" },
    { "@type": "AdministrativeArea", "name": "연수구" },
    { "@type": "AdministrativeArea", "name": "계양구" },
    { "@type": "AdministrativeArea", "name": "서구" },
    { "@type": "AdministrativeArea", "name": "남동구" },
    { "@type": "City", "name": "부천시" },
  ],
  "knowsAbout": ["네이버 플레이스 SEO", "인천 소상공인 마케팅", "블로그 마케팅", "체험단 마케팅", "송도 마케팅"],
  "parentOrganization": { "@type": "Organization", "name": "하랑마케팅", "url": BASE },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": BASE },
      { "@type": "ListItem", "position": 2, "name": "지역별 서비스", "item": `${BASE}/location` },
      { "@type": "ListItem", "position": 3, "name": "인천", "item": `${BASE}/location/incheon` },
    ],
  },
};

export const metadata: Metadata = {
  title: "인천 소상공인 마케팅 대행사 | 부평·송도·부천·검단 전문",
  description: "인천 부평·송도·연수·부천·검단·계양 소상공인 맞춤 마케팅으로 네이버 플레이스 SEO, 블로그, 체험단을 10년 경력 대표가 직접 관리합니다.",
  keywords: [
    "인천 마케팅 대행사", "인천 소상공인 마케팅", "부평 마케팅", "송도 마케팅",
    "인천 플레이스 SEO", "검단 마케팅", "부천 마케팅", "계양 마케팅",
    "인천 네이버 플레이스", "인천 블로그 마케팅", "인천 체험단",
  ],
  alternates: { canonical: `${BASE}/location/incheon` },
  openGraph: {
    title: "인천 소상공인 마케팅 대행사 | 하랑마케팅",
    description: "인천 부평·송도·연수·검단 등 전 지역 담당. 10년 경력 대표 직접 관리.",
    url: `${BASE}/location/incheon`,
    images: [ogImage("인천 마케팅 대행사 하랑마케팅")],
  },
};

const REGIONS = [
  { name: "부평·계산", focus: "구도심 생활 상권 · 플레이스와 블로그 비중이 높다" },
  { name: "송도·연수", focus: "신도시 · 검색 유입과 인스타 비중이 함께 높다" },
  { name: "검단·원당", focus: "신규 입주가 이어지는 상권 · 초기 매장 정보 정비가 필요하다" },
  { name: "구월·남동", focus: "인천 중심 상권 · 학원·병의원 경쟁 밀도가 높다" },
];

export default function IncheonPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(INCHEON_LD) }} />
      <Header />
      <SianMain>
        <PageHead
          where="인천 전 지역 · 현장 방문 가능"
          title={<>인천 소상공인<br />마케팅 대행사</>}
          lead="부평·송도·검단·구월·연수 등 인천 전 지역의 매장을 맡고 있습니다. 인천 지역 상권과 경쟁 구도를 잘 이해하고 있습니다."
          primary={{ href: "/contact?region=인천", label: "인천 무료 상담 신청" }}
          link={{ href: "/free-check", label: "내 매장 무료 진단" }}
          facts={[
            { label: "순위 계측", value: "스냅샷 기록" },
            { label: "주요 상권", value: "송도·청라·부평" },
            { label: "계약 기간 · 처음이면 2~3개월 이상", value: "월 단위" },
            { label: "상담 비용", value: "0원" },
          ]}
        />

        {/* AEO · 지역 질의 한 줄 정답 (speakable) */}
        <AnswerRow
          question="인천 소상공인 마케팅은 어떻게 진행되나요?"
          answer="하랑마케팅은 인천 전 지역 소상공인을 지원합니다. 송도·청라·부평·구월동·검단 등 신도시와 구도심의 검색 패턴이 크게 다르기 때문에 상권별로 키워드를 나눠 공략합니다. 신도시는 맘카페와 인스타그램, 구도심은 네이버 플레이스와 블로그 비중을 높이는 방식입니다. 인천은 서울 대비 경쟁 강도가 낮은 편입니다. 다만 몇 주 안에 몇 위라고 미리 약속드리지는 않고, 상담 때 지금 몇 위인지부터 재 보고 이 상권이 어느 정도 걸리는 자리인지 말씀드립니다. 계약은 월 단위가 기본이고 중도 해지 위약금이 없습니다. 다만 마케팅을 처음 하시는 분은 기본 세팅부터 잡아야 해서 2~3개월 이상은 진행하셔야 합니다. 인천은 비대면 상담과 방문 상담 모두 지원하고 상담 비용은 0원입니다."
        />

        <Section soft title="인천 상권별 특성" desc="신도시와 구도심의 검색 경로가 다릅니다. 상권에 맞춰 채널을 나눕니다">
          <ItemList items={REGIONS.map((r) => ({ title: r.name, desc: r.focus }))} />
        </Section>

        <CloseBand
          title="인천 매장 무료 진단"
          text="지역 경쟁사 분석부터 맞춤 전략까지 0원."
          primary={{ href: "/contact?region=인천", label: "무료 상담 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
