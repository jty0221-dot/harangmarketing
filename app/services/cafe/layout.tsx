import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { ORG_ID, LOCAL_ID, breadcrumbLd } from "../../lib/seo";

export const metadata: Metadata = {
  title: "카페·베이커리 마케팅 대행 — 하랑마케팅 | 네이버 플레이스 상위노출 전문",
  description: "카페·베이커리 전문 마케팅. 네이버 플레이스 상위노출, 포토리뷰 전략, 인스타그램 비주얼 마케팅. 지역 카페 키워드 19위 → 1위, 20일 계측 기록. 전국 무료 상담.",
  keywords: ["카페 마케팅", "베이커리 마케팅", "카페 플레이스 상위노출", "카페 네이버 마케팅", "카페 인스타그램 마케팅", "카페 리뷰 마케팅", "카페 체험단", "베이커리 플레이스"],
  alternates: { canonical: "https://www.harangmarketing.com/services/cafe" },
  openGraph: {
    title: "카페·베이커리 마케팅 대행 — 하랑마케팅",
    description: "네이버 플레이스 상위노출 · 포토리뷰 전략 · 인스타 비주얼. 지역 카페 키워드 19위 → 1위, 20일 계측 기록.",
    url: "https://www.harangmarketing.com/services/cafe",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "카페 마케팅 대행 하랑마케팅" }],
  },
};

export default function CafeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "카페·베이커리 마케팅 대행",
            "provider": { "@id": LOCAL_ID },
            "brand": { "@id": ORG_ID },
            "inLanguage": "ko-KR",
            "serviceOutput": { "@type": "Thing", "name": "플레이스 순위 계측 기록", "description": "카페·베이커리 전문 마케팅. 계측 기록: 네이버 플레이스 지역 카페 키워드 19위→1위(20일), 지역 디저트카페 키워드 3위→1위(9일). 순위는 매일 저장한 스냅샷 실측값이며 방문객·매출은 계측 대상이 아니다." },
            "description": "카페·베이커리 전문 네이버 플레이스 SEO, 포토리뷰 전략, 인스타그램 마케팅 대행 서비스",
            "areaServed": "대한민국",
            "serviceType": "마케팅 대행",
            "url": "https://www.harangmarketing.com/services/cafe",
            "offers": {
              "@type": "Offer",
              "description": "카페 마케팅 스타터 패키지 — 플레이스 SEO + 블로그 관리. 상권·진행 범위에 따라 견적 산정.",
            },
          }),
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: "서비스", path: "/services" },
          { name: "카페·베이커리 마케팅", path: "/services/cafe" },
        ])}
      />
      {children}
    </>
  );
}
