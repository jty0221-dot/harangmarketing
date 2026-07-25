import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마케팅 인사이트 블로그 — 하랑마케팅 | 소상공인 마케팅 노하우",
  description: "소상공인 마케팅 노하우, 네이버 플레이스 SEO 비법, 업종별 성공 전략을 무료로 공유합니다. 하랑마케팅 대표가 직접 씁니다.",
  keywords: ["소상공인 마케팅 블로그", "네이버 플레이스 SEO 방법", "마케팅 노하우", "자영업자 마케팅"],
  openGraph: {
    title: "하랑마케팅 블로그 — 소상공인 마케팅 노하우",
    description: "10년 경력 대표가 직접 쓰는 소상공인 마케팅 인사이트",
    url: "https://www.harangmarketing.com/blog",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 블로그 — 소상공인 마케팅 노하우" }],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
