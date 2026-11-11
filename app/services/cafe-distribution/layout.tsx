import type { Metadata } from "next";
import { SITE, ogImage } from "../../lib/seo";
import { PRICE_MIN, CAFE_TIER_MIN, PRICE_REVISED_AT, won } from "../../lib/cafe-distribution";

const PATH = "/services/cafe-distribution";
const URL = `${SITE.base}${PATH}`;

export const metadata: Metadata = {
  // 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙이므로 여기서는 브랜드명을 넣지 않는다
  title: "블로그 원고 · 카페 게시 대행 | 네이버 카페 게시 대행 배포 대행",
  description:
    `블로그 원고·게시 대행와 네이버 카페 배포를 함께 진행합니다. 10건 · 30건 패키지 ${won(PRICE_MIN)}부터, 카페 단건 ${won(CAFE_TIER_MIN)}부터입니다.`,
  keywords: [
    "카페 배포", "네이버 카페 배포", "카페 게시 대행", "카페 마케팅 대행",
    "블로그 배포", "블로그 원고·게시 대행", "최블 배포", "블로그 원고 작성",
    "네이버 카페 홍보", "카페 글 배포", "바이럴 배포 대행", "키워드 현황 분석",
    "블로그 배포 가격", "카페 배포 단가", "하랑마케팅 카페 배포",
    "블로그 원고 작성 대행", "카페 홍보 게시 대행",
    "맘카페 배포", "대표 카페 배포", "카페 게시 대행",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "게시 URL까지 보고하는 블로그 원고 · 카페 게시 대행 · 하랑마케팅",
    description:
      `원고 작성과 게시 URL 보고. 10건 · 30건 패키지 ${won(PRICE_MIN)}부터, 카페 단건 ${won(CAFE_TIER_MIN)}부터. ${PRICE_REVISED_AT} 개정 단가.`,
    url: URL,
    images: [ogImage("하랑마케팅 카페 배포")],
  },
};

/**
 * 이 layout 은 메타데이터만 담당한다.
 *
 * 구조화 데이터(JSON-LD)를 여기 두면 하위 경로인 /reference 에도 그대로 상속되어,
 * FAQ 가 보이지 않는 레퍼런스 페이지에 FAQPage 가 붙고 BreadcrumbList 도 중복된다.
 * 따라서 JSON-LD 는 각 page.tsx 에서 선언한다.
 */
export default function CafeDistributionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
