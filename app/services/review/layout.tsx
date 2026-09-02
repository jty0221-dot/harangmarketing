import type { Metadata } from "next";
import { SITE } from "../../lib/seo";

const PATH = "/services/review";
const URL = `${SITE.base}${PATH}`;

export const metadata: Metadata = {
  // 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙이므로 여기서는 브랜드명을 넣지 않는다
  title: "블로그 체험단 · 인플루언서 체험단 모집 대행",
  description:
    "매장에 방문할 블로거와 인플루언서를 모집하고 후기가 올라오는 것까지 대표가 직접 진행합니다. 모집 규모는 월 10명에서 30명, 첫 체험단 시작까지 1주에서 2주. 리뷰를 사지 않고 대가를 받은 글에는 그 사실을 표시하게 합니다. 상담 0원.",
  keywords: [
    "블로그 체험단", "체험단", "체험단 모집", "체험단 대행", "네이버 체험단",
    "인플루언서 체험단", "리뷰 체험단", "블로그 협찬", "체험단 사이트",
    "리뷰 마케팅", "플레이스 리뷰", "하랑마케팅 체험단",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "하랑마케팅 블로그 체험단 · 인플루언서 체험단",
    description:
      "실제로 방문한 사람이 실제로 쓴 글만 남깁니다. 리뷰를 사지 않고, 병원에는 체험단을 하지 않습니다.",
    url: URL,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 체험단 모집 대행" }],
  },
};

/**
 * 이 layout 은 메타데이터만 담당한다.
 * 구조화 데이터(JSON-LD)는 하위 경로가 생겼을 때 중복 상속되지 않도록 page.tsx 에서 선언한다.
 * (cafe-distribution 에서 /reference 가 FAQPage 를 상속받아 겪은 문제와 같은 이유)
 */
export default function ReviewServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
