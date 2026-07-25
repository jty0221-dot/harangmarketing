import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "카페·베이커리 마케팅 대행 — 하랑마케팅 | 네이버 플레이스 상위노출 전문",
  description: "카페·베이커리 전문 마케팅. 네이버 플레이스 상위노출, 포토리뷰 전략, 인스타그램 비주얼 마케팅으로 방문객 167% 증가 달성. 경기·서울·인천 무료 상담.",
  keywords: ["카페 마케팅", "베이커리 마케팅", "카페 플레이스 상위노출", "카페 네이버 마케팅", "카페 인스타그램 마케팅", "카페 리뷰 마케팅", "카페 체험단", "베이커리 플레이스"],
  alternates: { canonical: "https://www.harangmarketing.com/services/cafe" },
  openGraph: {
    title: "카페·베이커리 마케팅 대행 — 하랑마케팅",
    description: "네이버 플레이스 상위노출 · 포토리뷰 전략 · 인스타 비주얼. 3개월 만에 방문객 167% 증가 실제 사례.",
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
            "provider": {
              "@type": "LocalBusiness",
              "name": "하랑마케팅",
              "url": "https://www.harangmarketing.com",
              "telephone": "010-7541-9054",
            },
            "description": "카페·베이커리 전문 네이버 플레이스 SEO, 포토리뷰 전략, 인스타그램 마케팅 대행 서비스",
            "areaServed": ["서울", "경기도", "인천"],
            "serviceType": "마케팅 대행",
            "url": "https://www.harangmarketing.com/services/cafe",
            "offers": {
              "@type": "Offer",
              "price": "300000",
              "priceCurrency": "KRW",
              "description": "카페 마케팅 스타터 패키지 — 플레이스 SEO + 블로그 관리",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
