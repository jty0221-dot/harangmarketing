import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마케팅 성공 사례 — 하랑마케팅 | 카페·음식점·미용·병원 실제 성과",
  description: "하랑마케팅과 함께한 소상공인의 실제 성공 사례. 플레이스 1위, 매출 2배, 예약 마감 등 업종별 구체적인 성과를 확인하세요. 경기·서울·전국 지역 매장 포트폴리오.",
  keywords: ["마케팅 성공사례", "소상공인 마케팅 사례", "플레이스 SEO 사례", "카페 마케팅 사례", "음식점 마케팅 성과", "하랑마케팅 포트폴리오"],
  openGraph: {
    title: "하랑마케팅 성공 사례 — 실제 매장의 매출·방문객 증가 스토리",
    description: "플레이스 1위 달성, 방문객 +167%, 매출 +113% — 하랑마케팅과 함께한 업종별 실제 성과를 확인하세요.",
    url: "https://www.harangmarketing.com/cases",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "하랑마케팅 성공 사례" }],
  },
};

export default function CasesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
