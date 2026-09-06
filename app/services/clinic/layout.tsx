import type { Metadata } from "next";
import {
  byKeyword, fmtLong,
  CLINIC_LINES, CLINIC_NOTE,
} from "../../lib/rank-records";

/*
 * 순위 문구는 정본에서 만든다. 기록이 없으면 문장에서 빠진다 (C-42 · C-50).
 *
 * 숫자를 여기서 손으로 붙이지 않는다. 예전에는 `4위→4위` 처럼 화살표로 이어 붙였는데
 * 자리를 지킨 기록이 올라간 기록처럼 읽혔다. 지킨 것과 오른 것을 갈라 쓰는 일은
 * app/lib/rank-records.ts 의 fmt 계열과 CLINIC_ 상수들이 한다 (진우 판정 제4-C절 · 제5절).
 *
 * 스키마 타입도 여기서 정한다. 우리는 의료기관이 아니라 마케팅 대행사다.
 * MedicalBusiness · MedicalClinic · Physician · Dentist · MedicalWebPage · MedicalOrganization 을
 * 우리 도메인에 쓰지 않는다. 우리가 쓰는 것은 Service · ProfessionalService · Organization 뿐이다.
 * 우리 문서에 의료기관 타입을 붙이면 검색엔진과 AI 가 하랑마케팅을 의료기관으로 읽는다
 * (진우 판정 제8절 · 의료법 제56조 제1항 · C-50).
 */
const DENTAL = byKeyword("지역 치과 키워드");
const DENTAL_LINE = DENTAL ? `지역 치과 키워드 ${fmtLong(DENTAL)} 기록.` : "";

/* JSON-LD 의 계측 기록 절 — 화면에 뜨는 문장과 글자까지 같은 것을 쓴다 */
const CLINIC_LD_LINE = [CLINIC_NOTE, ...CLINIC_LINES].filter(Boolean).join(" ");
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
