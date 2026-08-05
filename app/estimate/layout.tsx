import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { SITE, ANSWER_SENTENCES, webPageLd, breadcrumbLd } from "../lib/seo";

export const metadata: Metadata = {
  title: "마케팅 패키지 견적 계산기 — 하랑마케팅 | 3분 맞춤 설계",
  description: "업종·예산·목표를 선택하면 10년 경력 데이터로 최적의 마케팅 패키지와 예상 ROI를 즉시 제안합니다. 무료, 3분 완성.",
  keywords: ["마케팅 견적", "소상공인 마케팅 비용", "마케팅 패키지 추천", "플레이스 SEO 비용", "마케팅 대행사 견적"],
  openGraph: {
    title: "하랑마케팅 견적 계산기 — 업종별 맞춤 패키지 즉시 확인",
    description: "3분만에 내 매장에 맞는 마케팅 패키지와 예상 성과를 확인하세요.",
    url: "https://www.harangmarketing.com/estimate",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 견적 계산기" }],
  },
};

/* 가격 질의는 AI 답변 엔진에서 가장 많이 들어오는 유형이라
   가격 구간을 Offer 로 명시해 근사값이 아니라 실제 범위가 인용되게 한다. */
const ESTIMATE_LD = [
  webPageLd({
    path: "/estimate",
    name: "마케팅 패키지 견적 계산기 — 하랑마케팅",
    description: ANSWER_SENTENCES.price,
  }),
  {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    "@id": `${SITE.base}/estimate#pricing`,
    name: "하랑마케팅 마케팅 대행 요금",
    description: ANSWER_SENTENCES.price,
    priceCurrency: "KRW",
    lowPrice: "300000",
    highPrice: "2500000",
    offerCount: 3,
    url: `${SITE.base}/estimate`,
    offers: [
      {
        "@type": "Offer",
        name: "단독 서비스 (1종)",
        description: "플레이스 SEO, 블로그, 체험단, 인스타그램 중 1개 채널 집중 운영",
        priceCurrency: "KRW",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "300000",
          maxPrice: "500000",
          priceCurrency: "KRW",
          unitText: "월",
        },
      },
      {
        "@type": "Offer",
        name: "묶음 패키지 (2~3종)",
        description: "업종에 맞는 2~3개 채널을 조합해 운영",
        priceCurrency: "KRW",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "700000",
          maxPrice: "1200000",
          priceCurrency: "KRW",
          unitText: "월",
        },
      },
      {
        "@type": "Offer",
        name: "통합 관리 (전체)",
        description: "전 채널 통합 운영 및 월 2회 상세 리포트",
        priceCurrency: "KRW",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "1500000",
          maxPrice: "2500000",
          priceCurrency: "KRW",
          unitText: "월",
        },
      },
    ],
  },
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "견적 계산기", path: "/estimate" },
  ]),
];

export default function EstimateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={ESTIMATE_LD} />
      {children}
    </>
  );
}
