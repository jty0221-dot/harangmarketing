import type { Metadata } from "next";
import { SITE, ogImage } from "../../../lib/seo";
import { CLINIC_HOMEPAGE_TITLE, CLINIC_HOMEPAGE_DESC, CLINIC_HOMEPAGE_KEYWORDS } from "../../../lib/clinic-homepage";

const URL = `${SITE.base}/services/homepage/clinic`;

// /services/homepage 레이아웃 아래라 루트 title.template 이 붙지 않아 브랜드를 직접 붙인다 (2026-10-27 화면 확인)
export const metadata: Metadata = {
  title: { absolute: `${CLINIC_HOMEPAGE_TITLE} | 하랑마케팅` },
  description: CLINIC_HOMEPAGE_DESC,
  keywords: CLINIC_HOMEPAGE_KEYWORDS,
  alternates: { canonical: URL },
  openGraph: { type: "website", title: CLINIC_HOMEPAGE_TITLE, description: CLINIC_HOMEPAGE_DESC, url: URL, images: [ogImage(CLINIC_HOMEPAGE_TITLE)] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
