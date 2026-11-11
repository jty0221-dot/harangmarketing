import type { Metadata } from "next";
import { SITE, ogImage } from "../../lib/seo";
import { POWERCONTENTS_TITLE, POWERCONTENTS_DESC } from "../../lib/keyword-pages";

const URL = `${SITE.base}/services/powercontents`;

// 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙인다
export const metadata: Metadata = {
  title: POWERCONTENTS_TITLE,
  description: POWERCONTENTS_DESC,
  alternates: { canonical: URL },
  openGraph: { type: "website", title: "원고 설계부터 검수 대응까지, 파워컨텐츠 원고 대행 · 하랑마케팅", description: POWERCONTENTS_DESC, url: URL, images: [ogImage(POWERCONTENTS_TITLE)] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
