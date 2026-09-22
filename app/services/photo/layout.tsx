import type { Metadata } from "next";

export const metadata: Metadata = {
  twitter: { card: "summary_large_image", title: "매장 사진촬영 | 하랑마케팅", description: "음식점 메뉴와 매장 공간 촬영 구성 및 가격, 업체별 촬영 사례를 확인하세요.", images: ["/photo-pricing/standard.jpg"] },
  title: "매장 사진촬영 | 음식 사진 · 매장 공간 촬영",
  description:
    "음식점 메뉴 사진과 매장 공간 사진을 촬영합니다. 촬영한 컷은 네이버 플레이스와 블로그, 인스타그램, 상세페이지에 그대로 씁니다. 촬영 협력사와 함께 진행합니다.",
  keywords: ["매장 사진촬영", "음식 사진 촬영", "음식점 촬영", "매장 공간 촬영", "플레이스 사진"],
  alternates: { canonical: "https://www.harangmarketing.com/services/photo" },
  openGraph: {
    title: "매장 사진촬영 | 하랑마케팅",
    description: "음식 사진과 매장 공간 사진을 찍어 플레이스와 채널에 바로 씁니다.",
    url: "https://www.harangmarketing.com/services/photo",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "매장 사진촬영 하랑마케팅" }],
  },
};

export default function PhotoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
