import type { Metadata } from "next";
import { SITE, ogImage } from "../../lib/seo";

const PATH = "/services/instagram";
const URL = `${SITE.base}${PATH}`;

export const metadata: Metadata = {
  // 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙이므로 여기서는 브랜드명을 넣지 않는다
  title: "인스타그램 계정 관리 · 하이라이트 세팅 · 릴스",
  description:
    "인스타그램 계정을 30개 항목으로 실측해 막힌 곳부터 찾고 하이라이트 세팅과 릴스 발행을 합니다. 팔로워는 사지 않으며 상담·진단은 0원입니다.",
  keywords: [
    "인스타그램 마케팅", "인스타 계정 관리", "인스타 계정 최적화",
    "인스타 하이라이트", "인스타 팔로워", "인스타 릴스 만들기",
    "릴스 제작", "숏폼 마케팅", "인스타그램 광고", "카드뉴스 제작",
    "인스타 대행", "인스타그램 상위 노출", "하랑마케팅 인스타그램",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "하랑마케팅 인스타그램 계정 관리",
    description:
      "팔로워를 사기 전에 계정부터 고칩니다. 30개 항목 진단, 하이라이트 6칸, 정기 발행, 확산까지.",
    url: URL,
    images: [ogImage("하랑마케팅 인스타그램 계정 관리")],
  },
};

/**
 * 이 layout 은 메타데이터만 담당한다.
 * 구조화 데이터(JSON-LD)는 하위 경로가 생겼을 때 중복 상속되지 않도록 page.tsx 에서 선언한다.
 */
export default function InstagramServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
