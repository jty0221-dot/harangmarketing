import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { SITE, ORG_ID, ANSWER_SENTENCES, webPageLd, breadcrumbLd } from "../lib/seo";

export const metadata: Metadata = {
  title: "무료 상담 신청 | 24시간 내 연락",
  description: "업종·지역·예산을 알려주시면 10년 경력 대표가 24시간 내 직접 연락드립니다. 상담 비용 0원, 부담 없이 신청하세요.",
  keywords: ["마케팅 무료 상담", "소상공인 마케팅 상담", "하랑마케팅 상담", "마케팅 대행사 문의", "플레이스 SEO 상담"],
  alternates: { canonical: `${SITE.base}/contact` },
  openGraph: {
    title: "하랑마케팅 무료 상담 신청 | 10년 경력 대표 직접 응대",
    description: "카카오·전화·폼 중 편한 방법으로 신청하세요. 업종 분석부터 맞춤 전략까지 0원에 제공합니다.",
    url: "https://www.harangmarketing.com/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 무료 상담 신청" }],
  },
};

/* ContactPage + ContactPoint — "하랑마케팅 연락처/상담 신청" 질의 대응 */
const CONTACT_LD = [
  webPageLd({
    path: "/contact",
    type: "ContactPage",
    name: "무료 상담 신청 | 하랑마케팅",
    description: ANSWER_SENTENCES.contact,
  }),
  {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "@id": `${SITE.base}/contact#contactpoint`,
    contactType: "sales",
    name: "하랑마케팅 무료 상담",
    telephone: SITE.phoneIntl,
    email: SITE.email,
    url: `${SITE.base}/contact`,
    availableLanguage: ["ko"],
    areaServed: "KR",
    description: ANSWER_SENTENCES.contact,
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    parentOrganization: { "@id": ORG_ID },
  },
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "무료 상담", path: "/contact" },
  ]),
];

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={CONTACT_LD} />
      {children}
    </>
  );
}
