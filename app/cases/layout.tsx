import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마케팅 성공 사례 — 하랑마케팅 | 카페·음식점·미용·병원 실제 성과",
  description: "하랑마케팅과 함께한 소상공인의 실제 사례. 네이버 플레이스 순위를 매일 계측해 업종별로 공개합니다. 경기·서울·전국 지역 매장 포트폴리오.",
  keywords: ["마케팅 성공사례", "소상공인 마케팅 사례", "플레이스 SEO 사례", "카페 마케팅 사례", "음식점 마케팅 성과", "하랑마케팅 포트폴리오"],
  alternates: { canonical: "https://www.harangmarketing.com/cases" },
  openGraph: {
    title: "하랑마케팅 사례 — 업종별 플레이스 순위 상승 기록",
    description: "지역 맛집 키워드 72위 → 2위, 지역 상가청소 키워드 67위 → 4위 — 하랑마케팅이 직접 계측한 업종별 순위 기록입니다.",
    url: "https://www.harangmarketing.com/cases",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 성공 사례" }],
  },
};

export default function CasesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
