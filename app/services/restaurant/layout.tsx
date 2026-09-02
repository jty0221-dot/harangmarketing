import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { ORG_ID, LOCAL_ID, breadcrumbLd } from "../../lib/seo";

export const metadata: Metadata = {
  title: "음식점·배달 마케팅 대행 — 하랑마케팅 | 네이버 플레이스 상위노출 전문",
  description: "음식점·배달 전문 마케팅. 배달앱 리뷰 전략, 맘카페 바이럴, 블로그 맛집 등록. 지역 맛집 키워드 72위 → 2위, 32일 계측 기록. 무료 상담 0원.",
  keywords: ["음식점 마케팅", "배달 마케팅", "맛집 마케팅", "식당 플레이스 상위노출", "배달앱 리뷰 마케팅", "맛집 블로그 마케팅", "음식점 체험단", "배달의민족 마케팅"],
  alternates: { canonical: "https://www.harangmarketing.com/services/restaurant" },
  openGraph: {
    title: "음식점·배달 마케팅 대행 — 하랑마케팅",
    description: "배달앱 리뷰 전략 · 맘카페 바이럴 · 블로그 맛집 등록. 지역 맛집 키워드 72위 → 2위, 32일 계측 기록.",
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
            "provider": { "@id": LOCAL_ID },
            "brand": { "@id": ORG_ID },
            "inLanguage": "ko-KR",
            "serviceOutput": { "@type": "Thing", "name": "플레이스 순위 계측 기록", "description": "음식점·배달 전문 마케팅. 계측 기록: 네이버 플레이스 지역 맛집 키워드 72위→2위(32일), 지역 맛집 키워드 56위→1위(32일), 지역 역세권 맛집 키워드 13위→1위(32일). 순위는 매일 저장한 스냅샷 실측값이며 방문객·매출은 계측 대상이 아니다." },
            "offers": { "@type": "Offer", "description": "음식점·배달 전문 마케팅. 배달·홀 비중과 진행 범위에 따라 견적 산정, 상담·진단 0원." },
            "description": "음식점·배달 전문 배달앱 리뷰, 맘카페 바이럴, 블로그 맛집 마케팅 대행",
            "areaServed": "대한민국",
            "url": "https://www.harangmarketing.com/services/restaurant",
          }),
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: "서비스", path: "/services" },
          { name: "음식점·배달 마케팅", path: "/services/restaurant" },
        ])}
      />
      {children}
    </>
  );
}
