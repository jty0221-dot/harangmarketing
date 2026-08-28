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
            "serviceOutput": { "@type": "Thing", "name": "플레이스 순위 계측 기록", "description": "의원·한의원·피부과 전문 마케팅. 계측 기록: 네이버 플레이스 지역 카페 키워드 56위→1위(32일), 지역 맛집 키워드 13위→1위(32일), 지역 치과 키워드 5위→1위(32일). 순위는 매일 저장한 스냅샷 실측값이며 방문객·매출은 계측 대상이 아니다." },
            "offers": { "@type": "Offer", "description": "의원·한의원 전문 마케팅. 진료 과목·진행 범위에 따라 견적 산정, 상담·진단 0원." },
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
