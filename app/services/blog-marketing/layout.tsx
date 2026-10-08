import type { Metadata } from "next";
import { SITE, ogImage } from "../../lib/seo";
import { BLOG_MARKETING_TITLE, BLOG_MARKETING_DESC } from "../../lib/keyword-pages";

const URL = `${SITE.base}/services/blog-marketing`;

// 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙인다
export const metadata: Metadata = {
  title: BLOG_MARKETING_TITLE,
  description: BLOG_MARKETING_DESC,
  alternates: { canonical: URL },
  openGraph: { type: "website", title: BLOG_MARKETING_TITLE, description: BLOG_MARKETING_DESC, url: URL, images: [ogImage(BLOG_MARKETING_TITLE)] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
