import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { ORG_ID, LOCAL_ID, breadcrumbLd } from "../../lib/seo";

export const metadata: Metadata = {
  title: "학원·교육 마케팅 대행 — 하랑마케팅 | 수강생 55% 증가",
  description: "학원·교육기관 전문 마케팅. 맘카페 입소문, 홈페이지형 블로그, 지역 키워드 상위노출로 수강생 55% 증가 달성. 무료 상담 0원.",
  keywords: ["학원 마케팅", "교육 마케팅", "학원 블로그 마케팅", "학원 맘카페 마케팅", "학원 플레이스 상위노출", "학원 상위노출", "교습소 마케팅", "학원 광고"],
  alternates: { canonical: "https://www.harangmarketing.com/services/academy" },
  openGraph: {
    title: "학원·교육 마케팅 대행 — 하랑마케팅",
    description: "맘카페 입소문 · 홈페이지형 블로그 · 지역 키워드 SEO. 3개월 만에 수강생 55% 증가.",
    url: "https://www.harangmarketing.com/services/academy",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "학원 마케팅 대행 하랑마케팅" }],
  },
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "학원·교육 마케팅 대행",
            "provider": { "@id": LOCAL_ID },
            "brand": { "@id": ORG_ID },
            "inLanguage": "ko-KR",
            "serviceOutput": { "@type": "Thing", "name": "플레이스 순위 계측 기록", "description": "학원·교육 전문 마케팅. 계측 기록: 네이버 플레이스 지역 카페 키워드 56위→1위(32일), 지역 맛집 키워드 13위→1위(32일), 지역 치과 키워드 5위→1위(32일). 순위는 매일 저장한 스냅샷 실측값이며 방문객·매출은 계측 대상이 아니다." },
            "offers": { "@type": "Offer", "description": "학원·교육 전문 마케팅. 과목·진행 범위에 따라 견적 산정, 상담·진단 0원." },
            "description": "학원·교육기관 전문 맘카페 바이럴, 블로그 SEO, 지역 키워드 마케팅 대행",
            "areaServed": ["서울", "경기도", "인천"],
            "url": "https://www.harangmarketing.com/services/academy",
          }),
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: "서비스", path: "/services" },
          { name: "학원·교육 마케팅", path: "/services/academy" },
        ])}
      />
      {children}
    </>
  );
}
