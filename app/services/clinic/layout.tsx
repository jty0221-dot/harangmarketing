import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "의원·한의원·피부과 마케팅 대행 — 하랑마케팅 | 신규 예약 175% 증가",
  description: "의원·한의원·피부과 전문 마케팅. 네이버 블로그 신뢰도 강화, 체험단 후기, 플레이스 SEO로 월 신규 예약 175% 증가 달성. 무료 상담 0원.",
  keywords: ["병원 마케팅", "의원 마케팅", "한의원 마케팅", "피부과 마케팅", "병원 네이버 플레이스", "한의원 블로그 마케팅", "피부과 체험단", "의원 상위노출"],
  alternates: { canonical: "https://www.harangmarketing.com/services/clinic" },
  openGraph: {
    title: "의원·한의원·피부과 마케팅 대행 — 하랑마케팅",
    description: "블로그 신뢰도 강화 · 체험단 후기 · 플레이스 SEO. 4개월 만에 월 신규 예약 175% 증가.",
    url: "https://www.harangmarketing.com/services/clinic",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "병원 마케팅 대행 하랑마케팅" }],
  },
};

export default function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "의원·한의원·피부과 마케팅 대행",
            "provider": { "@type": "LocalBusiness", "name": "하랑마케팅", "url": "https://www.harangmarketing.com", "telephone": "010-7541-9054" },
            "description": "의원·한의원·피부과 전문 네이버 블로그 마케팅, 체험단, 플레이스 SEO 대행",
            "areaServed": ["서울", "경기도", "인천"],
            "serviceType": "의료기관 마케팅 대행",
            "url": "https://www.harangmarketing.com/services/clinic",
          }),
        }}
      />
      {children}
    </>
  );
}
