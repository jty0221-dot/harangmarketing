import type { Metadata } from "next";
import { byKeyword, fmt } from "../../lib/rank-records";

/* 순위 문구는 정본에서 만든다. 기록이 없으면 문장에서 빠진다 (C-42 · C-50). */
const DENTAL = byKeyword("지역 치과 키워드");
const DENTAL_LINE = DENTAL ? `지역 치과 키워드 ${fmt(DENTAL)}, ${DENTAL.days}일 계측 기록.` : "";

/* JSON-LD 의 계측 기록 절 — 화면 문구와 같은 정본에서 만든다 */
const DENTAL_STN = byKeyword("지역 역세권 치과 키워드");
const DERMA = byKeyword("지역 피부과 키워드");
const CLINIC_LD_LINE = (() => {
  const parts = [
    DENTAL && `네이버 플레이스 지역 치과 키워드 ${DENTAL.from}위→${DENTAL.to}위(${DENTAL.days}일)`,
    DENTAL_STN && `지역 역세권 치과 키워드 ${DENTAL_STN.from}위→${DENTAL_STN.to}위(${DENTAL_STN.days}일)`,
    DERMA && `지역 피부과 키워드 ${DERMA.from}위→${DERMA.to}위(${DERMA.days}일)`,
  ].filter(Boolean);
  return parts.length > 0 ? `계측 기록: ${parts.join(", ")}.` : "";
})();
import JsonLd from "../../components/JsonLd";
import { ORG_ID, LOCAL_ID, breadcrumbLd } from "../../lib/seo";

export const metadata: Metadata = {
  title: "의원·한의원·피부과 마케팅 대행 | 의료법 준수 · 플레이스 SEO",
  description: `의원·한의원·피부과 전문 마케팅. 의료법 준수 블로그, 플레이스 상위노출, 리뷰 관리. ${DENTAL_LINE} 무료 상담 0원.`,
  keywords: ["병원 마케팅", "의원 마케팅", "한의원 마케팅", "피부과 마케팅", "병원 네이버 플레이스", "한의원 블로그 마케팅", "의료광고 심의", "의원 상위노출"],
  alternates: { canonical: "https://www.harangmarketing.com/services/clinic" },
  openGraph: {
    title: "의원·한의원·피부과 마케팅 대행 | 하랑마케팅",
    description: `의료법 준수 블로그 · 플레이스 SEO · 리뷰 관리. ${DENTAL_LINE}`,
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
            "provider": { "@id": LOCAL_ID },
            "brand": { "@id": ORG_ID },
            "inLanguage": "ko-KR",
            "serviceOutput": { "@type": "Thing", "name": "플레이스 순위 계측 기록", "description": `의원·한의원·피부과 전문 마케팅. ${CLINIC_LD_LINE} 순위는 매일 저장한 스냅샷 실측값이며 방문객·매출은 계측 대상이 아니다.` },
            "offers": { "@type": "Offer", "description": "의원·한의원 전문 마케팅. 진료 과목·진행 범위에 따라 견적 산정, 상담·진단 0원." },
            "description": "의원·한의원·피부과 전문 네이버 블로그 마케팅, 플레이스 SEO, 리뷰 관리 대행",
            "areaServed": "대한민국",
            "serviceType": "의료기관 마케팅 대행",
            "url": "https://www.harangmarketing.com/services/clinic",
          }),
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: "서비스", path: "/services" },
          { name: "의원·한의원·피부과 마케팅", path: "/services/clinic" },
        ])}
      />
      {children}
    </>
  );
}
