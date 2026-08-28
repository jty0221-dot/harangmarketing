import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { ORG_ID, LOCAL_ID, breadcrumbLd } from "../../lib/seo";

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
            "provider": { "@id": LOCAL_ID },
            "brand": { "@id": ORG_ID },
            "inLanguage": "ko-KR",
            "serviceOutput": { "@type": "Thing", "name": "플레이스 순위 계측 기록", "description": "온라인 쇼핑몰 전문 마케팅. 계측 기록: 네이버 플레이스 지역 카페 키워드 56위→1위(32일), 지역 맛집 키워드 13위→1위(32일), 지역 치과 키워드 5위→1위(32일). 순위는 매일 저장한 스냅샷 실측값이며 방문객·매출은 계측 대상이 아니다." },
            "offers": { "@type": "Offer", "description": "쇼핑몰 전문 마케팅. 상품군·진행 범위에 따라 견적 산정, 상담·진단 0원." },
            "description": "온라인 쇼핑몰 전문 블로그 SEO, 체험단, 콘텐츠 마케팅 대행",
            "areaServed": "대한민국",
            "url": "https://www.harangmarketing.com/services/shopping",
          }),
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: "서비스", path: "/services" },
          { name: "온라인 쇼핑몰 마케팅", path: "/services/shopping" },
        ])}
      />
      {children}
    </>
  );
}
