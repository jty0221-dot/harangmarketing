import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "온라인 쇼핑몰 마케팅 대행 — 하랑마케팅 | 월 매출 64% 증가",
  description: "온라인 쇼핑몰 전문 마케팅. 블로그 SEO 최적화, 체험단 후기 확보, 콘텐츠 마케팅으로 월 매출 64% 증가 달성. 무료 상담 0원.",
  keywords: ["쇼핑몰 마케팅", "온라인 쇼핑몰 마케팅", "쇼핑몰 블로그 마케팅", "쇼핑몰 체험단", "스마트스토어 마케팅", "쇼핑몰 상위노출", "온라인몰 마케팅", "쇼핑몰 SEO"],
  alternates: { canonical: "https://www.harangmarketing.com/services/shopping" },
  openGraph: {
    title: "온라인 쇼핑몰 마케팅 대행 — 하랑마케팅",
    description: "블로그 SEO · 체험단 후기 · 콘텐츠 마케팅. 4개월 만에 월 매출 64% 증가.",
    url: "https://www.harangmarketing.com/services/shopping",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "쇼핑몰 마케팅 대행 하랑마케팅" }],
  },
};

export default function ShoppingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "온라인 쇼핑몰 마케팅 대행",
            "provider": { "@type": "LocalBusiness", "name": "하랑마케팅", "url": "https://www.harangmarketing.com", "telephone": "010-7541-9054" },
            "description": "온라인 쇼핑몰 전문 블로그 SEO, 체험단, 콘텐츠 마케팅 대행",
            "areaServed": "대한민국",
            "url": "https://www.harangmarketing.com/services/shopping",
          }),
        }}
      />
      {children}
    </>
  );
}
