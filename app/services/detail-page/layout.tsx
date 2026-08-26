import type { Metadata } from "next";
import { SITE } from "../../lib/seo";

const PATH = "/services/detail-page";
const URL = `${SITE.base}${PATH}`;

export const metadata: Metadata = {
  // 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙이므로 여기서는 브랜드명을 넣지 않는다
  title: "스마트스토어 상세페이지 제작, 기획부터 이미지까지",
  description:
    "스마트스토어 상세페이지를 9단 구성으로 만듭니다. 기획 200,000원 · 제작 200,000원 · 확장 300,000원, 무상 수정 3회. 어떤 불안을 몇 번째 화면에서 지우는지부터 정하고 시작합니다. 공정 전체를 공개합니다.",
  keywords: [
    "상세페이지 제작", "스마트스토어 상세페이지", "상세페이지 외주", "상세페이지 대행",
    "제품 상세페이지", "상세페이지 디자인", "상세페이지 기획", "스마트스토어 상세",
    "상세페이지 제작 비용", "상세페이지 가격", "쇼핑몰 상세페이지", "하랑마케팅 상세페이지",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "하랑마케팅 스마트스토어 상세페이지 제작",
    description:
      "이미지를 파는 게 아니라 순서를 팝니다. 9단 구성 · 게이트 2개 · 공정 전체 공개. 200,000원부터.",
    url: URL,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 상세페이지 제작" }],
  },
};

/**
 * 이 layout 은 메타데이터만 담당한다.
 * 구조화 데이터(JSON-LD)는 하위 경로가 생겼을 때 중복 상속되지 않도록 page.tsx 에서 선언한다.
 * (cafe-distribution 에서 /reference 가 FAQPage 를 상속받아 겪은 문제와 같은 이유)
 */
export default function DetailPageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
