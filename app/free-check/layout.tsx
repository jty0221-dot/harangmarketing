import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { SITE, ORG_ID, webPageLd, breadcrumbLd } from "../lib/seo";

export const metadata: Metadata = {
  title: "무료 플레이스 진단 — 하랑마케팅 | 지금 내 매장 순위 확인",
  description: "내 매장의 네이버 플레이스·블로그·리뷰 현황을 무료로 진단해드립니다. 경쟁사 대비 어디가 부족한지, 3개월 후 어떻게 바뀔 수 있는지 안내해드려요.",
  alternates: { canonical: `${SITE.base}/free-check` },
  openGraph: {
    title: "무료 플레이스 진단 신청 — 하랑마케팅",
    description: "지금 내 매장 순위, 리뷰, 경쟁사 비교까지 무료로 확인하세요.",
    url: "https://www.harangmarketing.com/free-check",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "무료 플레이스 진단 — 하랑마케팅" }],
  },
};

const FREE_CHECK_LD = [
  webPageLd({
    path: "/free-check",
    name: "무료 플레이스 진단 — 하랑마케팅",
    description:
      "내 매장의 네이버 플레이스 순위, 리뷰 현황, 콘텐츠 포화도, 경쟁사 3곳을 무료로 진단해 1영업일 내 리포트로 보내드립니다. 비용 0원, 계약 강요 없음.",
  }),
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE.base}/free-check#service`,
    name: "네이버 플레이스 무료 진단",
    serviceType: "마케팅 현황 진단",
    provider: { "@id": ORG_ID },
    url: `${SITE.base}/free-check`,
    inLanguage: "ko-KR",
    description:
      "매장명과 업종만 알려주시면 플레이스 현재 순위, 리뷰 수·평점, 콘텐츠 포화도, 경쟁사 3곳 비교, 업종·상권 기준 현실적인 목표 기간을 정리해 1영업일 내 무료로 보내드립니다.",
    areaServed: { "@type": "Country", name: "대한민국" },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
      description: "진단 비용 0원. 계약 의무 없음.",
      availability: "https://schema.org/InStock",
    },
  },
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "무료 진단", path: "/free-check" },
  ]),
];

export default function FreeCheckLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={FREE_CHECK_LD} />
      {children}
    </>
  );
}
