import type { Metadata } from "next";
import { SITE, ogImage } from "../../lib/seo";

const URL = `${SITE.base}/services/persuasion`;

export const metadata: Metadata = {
  title: "상세페이지 · 홈페이지 구성 진단, 걱정 세 개부터",
  // 80자 상한(npm run check:meta)에 맞춰 첫 문장만 둔다. 상품명 · 업체명만으로 시작할 수 있다는 안내는 본문에 있다
  description: "손님이 사기 전에 하는 걱정 세 개를 정하고, 걱정마다 받는 섹션으로 상세페이지와 홈페이지 구성을 짭니다.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "걱정 세 개부터 정하고 짜는 구성 · 하랑마케팅",
    description: "재료를 모으고, 걱정을 고르고, 걱정마다 받는 섹션을 정합니다. 시안 두 벌을 함께 보실 수 있습니다.",
    url: URL,
    images: [ogImage("하랑마케팅 구성 진단")],
  },
};

export default function PersuasionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
