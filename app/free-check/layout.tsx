import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "무료 플레이스 진단 — 하랑마케팅 | 지금 내 매장 순위 확인",
  description: "내 매장의 네이버 플레이스·블로그·리뷰 현황을 무료로 진단해드립니다. 경쟁사 대비 어디가 부족한지, 3개월 후 어떻게 바뀔 수 있는지 안내해드려요.",
  openGraph: {
    title: "무료 플레이스 진단 신청 — 하랑마케팅",
    description: "지금 내 매장 순위, 리뷰, 경쟁사 비교까지 무료로 확인하세요.",
    url: "https://www.harangmarketing.com/free-check",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "무료 플레이스 진단 — 하랑마케팅" }],
  },
};

export default function FreeCheckLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
