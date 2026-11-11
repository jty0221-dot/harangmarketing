import type { Metadata } from "next";
import "../../wds.css";
import { SITE, ogImage } from "../../lib/seo";

const PATH = "/services/homepage";
const URL = `${SITE.base}${PATH}`;

export const metadata: Metadata = {
  // 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙이므로 여기서는 브랜드명을 넣지 않는다
  title: "홈페이지 제작, 검색에서 발견되고 문의하기까지",
  description:
    "홈페이지 제작. 업종별 디자인에 SEO·GEO·AEO를 고려한 정보 구성과 문의 동선을 함께 설계합니다. 실제 시안을 비교해 보세요.",
  keywords: [
    "홈페이지 제작", "홈페이지 제작 비용", "소상공인 홈페이지", "업종별 홈페이지", "홈페이지 시안",
    "반응형 홈페이지", "홈페이지 유지보수", "홈페이지 관리", "네이버 홈페이지 노출", "하랑마케팅 홈페이지",
    "홈페이지 제작 업체", "반응형 홈페이지 제작", "GEO 마케팅", "AEO 마케팅", "AI 검색 최적화",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "검색에서 발견되고 문의까지 잇는 홈페이지 제작 · 하랑마케팅",
    description: "업종별 디자인과 SEO·GEO·AEO 정보 구성, 고객이 이해하고 문의할 수 있는 흐름을 함께 설계합니다",
    url: URL,
    images: [ogImage("하랑마케팅 홈페이지 제작")],
  },
};

/** 메타데이터만 담당한다. JSON-LD 는 page.tsx 에서 (하위 경로 중복 상속 방지) */
export default function HomepageServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
