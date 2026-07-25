import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "음식점·배달 마케팅 대행 — 하랑마케팅 | 배달 매출 113% 증가",
  description: "음식점·배달 전문 마케팅. 배달앱 리뷰 전략, 맘카페 바이럴, 블로그 맛집 등록으로 월 배달 매출 113% 증가 달성. 무료 상담 0원.",
  keywords: ["음식점 마케팅", "배달 마케팅", "맛집 마케팅", "식당 플레이스 상위노출", "배달앱 리뷰 마케팅", "맛집 블로그 마케팅", "음식점 체험단", "배달의민족 마케팅"],
  alternates: { canonical: "https://www.harangmarketing.com/services/restaurant" },
  openGraph: {
    title: "음식점·배달 마케팅 대행 — 하랑마케팅",
    description: "배달앱 리뷰 전략 · 맘카페 바이럴 · 블로그 맛집 등록. 4개월 만에 배달 매출 113% 증가.",
    url: "https://www.harangmarketing.com/services/restaurant",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "음식점 마케팅 대행 하랑마케팅" }],
  },
};

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "음식점·배달 마케팅 대행",
            "provider": { "@type": "LocalBusiness", "name": "하랑마케팅", "url": "https://www.harangmarketing.com", "telephone": "010-7541-9054" },
            "description": "음식점·배달 전문 배달앱 리뷰, 맘카페 바이럴, 블로그 맛집 마케팅 대행",
            "areaServed": ["서울", "경기도", "인천"],
            "url": "https://www.harangmarketing.com/services/restaurant",
          }),
        }}
      />
      {children}
    </>
  );
}
