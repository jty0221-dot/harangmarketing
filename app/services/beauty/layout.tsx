import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { ORG_ID, LOCAL_ID, breadcrumbLd } from "../../lib/seo";

export const metadata: Metadata = {
  title: "미용·네일·뷰티 마케팅 대행 — 하랑마케팅 | 예약 100% 마감 달성",
  description: "미용실·네일샵·뷰티샵 전문 마케팅. 인스타그램 포트폴리오, 체험단 모집, 예약 전환 최적화로 예약 완전 마감 달성. 무료 상담 0원.",
  keywords: ["미용실 마케팅", "네일샵 마케팅", "뷰티 마케팅", "미용실 인스타그램", "네일샵 플레이스", "미용실 체험단", "뷰티샵 상위노출", "헤어샵 마케팅"],
  alternates: { canonical: "https://www.harangmarketing.com/services/beauty" },
  openGraph: {
    title: "미용·네일·뷰티 마케팅 대행 — 하랑마케팅",
    description: "인스타그램 포트폴리오 · 체험단 · 예약 전환 최적화. 2개월 만에 예약 100% 마감.",
    url: "https://www.harangmarketing.com/services/beauty",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "미용 마케팅 대행 하랑마케팅" }],
  },
};

export default function BeautyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "미용·네일·뷰티 마케팅 대행",
            "provider": { "@id": LOCAL_ID },
            "brand": { "@id": ORG_ID },
            "inLanguage": "ko-KR",
            "serviceOutput": { "@type": "Thing", "name": "플레이스 순위 계측 기록", "description": "미용·네일·뷰티 전문 마케팅. 계측 기록: 네이버 플레이스 지역 카페 키워드 56위→1위(32일), 지역 맛집 키워드 13위→1위(32일), 지역 치과 키워드 5위→1위(32일). 순위는 매일 저장한 스냅샷 실측값이며 방문객·매출은 계측 대상이 아니다." },
            "offers": { "@type": "Offer", "description": "미용·뷰티 전문 마케팅. 시술 구성·진행 범위에 따라 견적 산정, 상담·진단 0원." },
            "description": "미용실·네일샵·뷰티샵 전문 인스타그램 마케팅, 체험단, 플레이스 SEO 대행",
            "areaServed": ["서울", "경기도", "인천"],
            "url": "https://www.harangmarketing.com/services/beauty",
          }),
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: "서비스", path: "/services" },
          { name: "미용·네일·뷰티 마케팅", path: "/services/beauty" },
        ])}
      />
      {children}
    </>
  );
}
