import type { Metadata } from "next";
import "../../wds.css";
import { SITE, ogImage } from "../../lib/seo";
import { HP_STATS } from "../../lib/homepage-portfolio";

const PATH = "/services/homepage";
const URL = `${SITE.base}${PATH}`;

export const metadata: Metadata = {
  // 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙이므로 여기서는 브랜드명을 넣지 않는다
  title: "홈페이지 제작, 업종별 시안부터 보고 고르세요",
  // 업종 · 시안 수는 content/homepage-portfolio.json 에서 빌드 시점에 센다 (손으로 적지 않는다)
  description:
    `업종 ${HP_STATS.industries}개 · 시안 ${HP_STATS.drafts}개를 미리 만들어 두었습니다. 네이버 통합검색과 AI 답변 노출 기본 세팅까지 넣어 15영업일 안에 대표님 명의로 넘겨 드립니다.`,
  keywords: [
    "홈페이지 제작", "홈페이지 제작 비용", "소상공인 홈페이지", "업종별 홈페이지", "홈페이지 시안",
    "반응형 홈페이지", "홈페이지 유지보수", "홈페이지 관리", "네이버 홈페이지 노출", "하랑마케팅 홈페이지",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: `하랑마케팅 홈페이지 제작 · 업종별 시안 ${HP_STATS.drafts}개`,
    description: "시안부터 눌러 보고 고르세요. 검색 노출 기본 세팅 · 대표님 명의 · 15영업일.",
    url: URL,
    images: [ogImage("하랑마케팅 홈페이지 제작")],
  },
};

/** 메타데이터만 담당한다. JSON-LD 는 page.tsx 에서 (하위 경로 중복 상속 방지) */
export default function HomepageServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
