import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마케팅 패키지 견적 계산기 — 하랑마케팅 | 3분 맞춤 설계",
  description: "업종·예산·목표를 선택하면 10년 경력 데이터로 최적의 마케팅 패키지와 예상 ROI를 즉시 제안합니다. 무료, 3분 완성.",
  keywords: ["마케팅 견적", "소상공인 마케팅 비용", "마케팅 패키지 추천", "플레이스 SEO 비용", "마케팅 대행사 견적"],
  openGraph: {
    title: "하랑마케팅 견적 계산기 — 업종별 맞춤 패키지 즉시 확인",
    description: "3분만에 내 매장에 맞는 마케팅 패키지와 예상 성과를 확인하세요.",
    url: "https://www.harangmarketing.com/estimate",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "하랑마케팅 견적 계산기" }],
  },
};

export default function EstimateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
