import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { ORG_ID, LOCAL_ID, breadcrumbLd } from "../../lib/seo";

export const metadata: Metadata = {
  title: "의원·한의원·피부과 마케팅 대행 — 하랑마케팅 | 신규 예약 175% 증가",
  description: "의원·한의원·피부과 전문 마케팅. 네이버 블로그 신뢰도 강화, 체험단 후기, 플레이스 SEO로 월 신규 예약 175% 증가 달성. 무료 상담 0원.",
  keywords: ["병원 마케팅", "의원 마케팅", "한의원 마케팅", "피부과 마케팅", "병원 네이버 플레이스", "한의원 블로그 마케팅", "피부과 체험단", "의원 상위노출"],
  alternates: { canonical: "https://www.harangmarketing.com/services/clinic" },
  openGraph: {
    title: "의원·한의원·피부과 마케팅 대행 — 하랑마케팅",
    description: "블로그 신뢰도 강화 · 체험단 후기 · 플레이스 SEO. 4개월 만에 월 신규 예약 175% 증가.",
    url: "https://www.harangmarketing.com/services/clinic",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "병원 마케팅 대행 하랑마케팅" }],
  },
};

export default function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "의원·한의원·피부과 마케팅 대행",
            "provider": { "@id": LOCAL_ID },
            "brand": { "@id": ORG_ID },
            "inLanguage": "ko-KR",
            "serviceOutput": { "@type": "Thing", "name": "마케팅 실측 성과", "description": "의원·한의원·피부과 전문 마케팅. 실측 성과: 서울 강서 피부과 신규 예약 월 12건→33건(+300%, 6개월), 경기 안양 한의원 초진 예약 월 15건→45건(4개월)." },
            "offers": { "@type": "Offer", "price": "300000", "priceCurrency": "KRW", "description": "월 30만원부터 시작. 상담·진단 0원." },
            "description": "의원·한의원·피부과 전문 네이버 블로그 마케팅, 체험단, 플레이스 SEO 대행",
            "areaServed": ["서울", "경기도", "인천"],
            "serviceType": "의료기관 마케팅 대행",
            "url": "https://www.harangmarketing.com/services/clinic",
          }),
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: "서비스", path: "/services" },
          { name: "의원·한의원·피부과 마케팅", path: "/services/clinic" },
        ])}
      />
      {children}
    </>
  );
}
