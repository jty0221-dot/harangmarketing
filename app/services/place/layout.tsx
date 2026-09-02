import type { Metadata } from "next";
import { SITE } from "../../lib/seo";

const PATH = "/services/place";
const URL = `${SITE.base}${PATH}`;

export const metadata: Metadata = {
  // 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙이므로 여기서는 브랜드명을 넣지 않는다
  title: "네이버 플레이스 상위노출 · 지도 등록 대행",
  description:
    "네이버 지도에 가게를 등록하는 것까지는 무료이고 사장님이 직접 하실 수 있습니다. 저희가 하는 일은 그다음입니다. 키워드를 골라 넣고 매일 순위를 재서 밀린 자리를 되찾습니다. 순위는 매일 저장한 스냅샷 실측값으로만 말씀드리고 보장하지 않습니다. 상담 0원.",
  keywords: [
    "네이버 플레이스", "네이버플레이스등록", "플레이스 상위노출", "플레이스상위노출대행",
    "네이버 지도 등록", "네이버지도상위노출", "플레이스 광고", "네이버플레이스광고",
    "플레이스 리뷰", "네이버플레이스리뷰", "지도 검색", "플레이스 저장",
    "플레이스 SEO", "스마트플레이스", "지역 검색 최적화",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "네이버 플레이스 상위노출 · 지도 등록 대행",
    description:
      "등록은 직접 하셔도 됩니다. 저희는 그다음을 합니다. 매일 잰 순위 실측값으로만 말씀드립니다.",
    url: URL,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 네이버 플레이스 상위노출" }],
  },
};

/**
 * 이 layout 은 메타데이터만 담당한다.
 * 구조화 데이터(JSON-LD)는 하위 경로가 생겼을 때 중복 상속되지 않도록 page.tsx 에서 선언한다.
 * (cafe-distribution 에서 /reference 가 FAQPage 를 상속받아 겪은 문제와 같은 이유)
 */
export default function PlaceServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
