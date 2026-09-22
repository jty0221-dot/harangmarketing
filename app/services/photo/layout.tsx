import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { ORG_ID, LOCAL_ID, breadcrumbLd } from "../../lib/seo";

export const metadata: Metadata = {
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
  return (
    <>
      {/* 가격은 적지 않는다. 촬영 범위가 매장마다 달라 화면에 숫자를 두면 그게 약속이 된다 (C-35) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "매장 사진촬영",
            description:
              "음식점 메뉴 사진과 매장 공간 사진을 촬영하고 보정해 네이버 플레이스와 블로그, 인스타그램, 상세페이지에 등록합니다.",
            serviceType: "상업 사진 촬영",
            provider: { "@id": LOCAL_ID },
            brand: { "@id": ORG_ID },
            inLanguage: "ko-KR",
            offers: {
              "@type": "Offer",
              description: "촬영 범위와 컷 수에 따라 달라집니다. 상담 후 안내합니다.",
            },
            areaServed: "대한민국",
            url: "https://www.harangmarketing.com/services/photo",
          }),
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: "서비스", path: "/services" },
          { name: "매장 사진촬영", path: "/services/photo" },
        ])}
      />
      {children}
    </>
  );
}
