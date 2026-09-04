import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { SITE, ORG_ID, SITE_ID, webPageLd, breadcrumbLd } from "../lib/seo";

export const metadata: Metadata = {
  title: "마케팅 인사이트 블로그 | 소상공인 마케팅 노하우",
  description: "소상공인 마케팅 노하우, 네이버 플레이스 SEO 비법, 업종별 성공 전략을 무료로 공유합니다. 하랑마케팅 실무진이 직접 씁니다.",
  keywords: ["소상공인 마케팅 블로그", "네이버 플레이스 SEO 방법", "마케팅 노하우", "자영업자 마케팅"],
  openGraph: {
    title: "하랑마케팅 블로그 | 소상공인 마케팅 노하우",
    description: "10년 경력 실무진이 직접 쓰는 소상공인 마케팅 인사이트",
    url: "https://www.harangmarketing.com/blog",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 블로그 | 소상공인 마케팅 노하우" }],
  },
};

/* Blog 엔티티 — AI 가 "이 주제에 대한 하랑마케팅 글"을 찾을 때의 진입점 */
const BLOG_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE.base}/blog#blog`,
    name: "하랑마케팅 마케팅 인사이트",
    description:
      "네이버 플레이스 SEO, 블로그 마케팅, 리뷰·체험단, 인스타그램 등 소상공인이 바로 적용할 수 있는 실전 마케팅 노하우를 10년 경력 대표가 직접 씁니다.",
    url: `${SITE.base}/blog`,
    inLanguage: "ko-KR",
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    author: { "@id": ORG_ID },
    about: [
      "네이버 플레이스 SEO",
      "블로그 마케팅",
      "체험단 마케팅",
      "인스타그램 마케팅",
      "소상공인 마케팅",
    ],
  },
  webPageLd({
    path: "/blog",
    type: "CollectionPage",
    name: "마케팅 인사이트 | 하랑마케팅",
    description: "소상공인이 바로 적용할 수 있는 실전 마케팅 노하우 모음.",
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "마케팅 인사이트", path: "/blog" },
  ]),
];

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={BLOG_LD} />
      {children}
    </>
  );
}
