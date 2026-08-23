import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import Link from "next/link";
import { ArrowRight, MapPin, TrendingUp, Users, Anchor } from "lucide-react";

const BASE = "https://www.harangmarketing.com";

const INCHEON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE}/location/incheon`,
  "name": "하랑마케팅 — 인천 소상공인 마케팅",
  "url": `${BASE}/location/incheon`,
  "logo": `${BASE}/favicon.svg`,
  "image": `${BASE}/og-image.png`,
  "description": "인천 부평·송도·연수·부천·검단·계양 소상공인 맞춤 마케팅. 네이버 플레이스 SEO, 블로그, 체험단 전문. 10년 경력 전담 팀장 직접 관리.",
  "areaServed": [
    { "@type": "City", "name": "인천광역시" },
    { "@type": "AdministrativeArea", "name": "부평구" },
    { "@type": "AdministrativeArea", "name": "연수구" },
    { "@type": "AdministrativeArea", "name": "계양구" },
    { "@type": "AdministrativeArea", "name": "서구" },
    { "@type": "AdministrativeArea", "name": "남동구" },
    { "@type": "City", "name": "부천시" },
  ],
  "knowsAbout": ["네이버 플레이스 SEO", "인천 소상공인 마케팅", "블로그 마케팅", "체험단 마케팅", "송도 마케팅"],
  "parentOrganization": { "@type": "Organization", "name": "하랑마케팅", "url": BASE },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": BASE },
      { "@type": "ListItem", "position": 2, "name": "지역별 서비스", "item": `${BASE}/location` },
      { "@type": "ListItem", "position": 3, "name": "인천", "item": `${BASE}/location/incheon` },
    ],
  },
};

export const metadata: Metadata = {
  title: "인천 소상공인 마케팅 대행사 — 하랑마케팅 | 부평·송도·부천·검단 전문",
  description: "인천 부평·송도·연수·부천·검단·계양 소상공인 맞춤 마케팅. 네이버 플레이스 SEO, 블로그, 체험단 전문. 10년 경력 전담 팀장 직접 관리. 무료 상담.",
  keywords: [
    "인천 마케팅 대행사", "인천 소상공인 마케팅", "부평 마케팅", "송도 마케팅",
    "인천 플레이스 SEO", "검단 마케팅", "부천 마케팅", "계양 마케팅",
    "인천 네이버 플레이스", "인천 블로그 마케팅", "인천 체험단",
  ],
  alternates: { canonical: `${BASE}/location/incheon` },
  openGraph: {
    title: "인천 소상공인 마케팅 대행사 — 하랑마케팅",
    description: "인천 부평·송도·부천·검단 지역 실제 성과. 10년 경력 전담 팀장 직접 관리.",
    url: `${BASE}/location/incheon`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "인천 마케팅 대행사 하랑마케팅" }],
  },
};

const REGIONS = [
  { name: "부평·계산", cases: "미용실 예약 +120% · 3개월", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "송도·연수", cases: "카페 플레이스 Top 3 · 2개월", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
  { name: "검단·원당", cases: "음식점 배달 매출 +90% · 4개월", color: "bg-purple-50 border-purple-100 text-purple-700" },
  { name: "구월·남동", cases: "학원 수강생 +45% · 3개월", color: "bg-green-50 border-green-100 text-green-700" },
];

export default function IncheonPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(INCHEON_LD) }} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        <section className="bg-gray-950 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Anchor size={12} className="text-blue-400" />
              <span className="text-gray-400 text-xs font-medium">인천 전 지역 · 현장 방문 가능</span>
            </div>
            <h1 className="text-[36px] md:text-[52px] font-black text-white leading-tight mb-5">
              인천 소상공인<br />
              <span className="text-blue-400">마케팅 대행사</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              부평·송도·검단·구월·연수 등 인천 전 지역에서 실제 성과를 만들어왔습니다.
              인천 지역 상권과 경쟁 구도를 잘 이해하고 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact?region=인천"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors">
                인천 무료 상담 신청 <ArrowRight size={15} />
              </Link>
              <Link href="/free-check"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/30 text-white font-medium text-sm transition-colors">
                내 매장 무료 진단
              </Link>
            </div>
          </div>
        </section>

        {/* AEO — 지역 질의 한 줄 정답 */}
        <AnswerBlock
          question="인천 소상공인 마케팅은 어떻게 진행되나요?"
          answer="하랑마케팅은 인천 전 지역 소상공인을 지원합니다. 송도·청라·부평·구월동·검단 등 신도시와 구도심의 검색 패턴이 크게 다르기 때문에 상권별로 키워드를 나눠 공략합니다. 신도시는 맘카페와 인스타그램, 구도심은 네이버 플레이스와 블로그 비중을 높이는 방식입니다. 인천은 서울 대비 경쟁 강도가 낮아 평균 4~6주 내 플레이스 Top 5 진입이 가능합니다. 인천은 비대면 상담과 방문 상담 모두 지원하고 상담 비용은 0원입니다."
          facts={[
            { label: "Top 5 진입", value: "4~6주" },
            { label: "주요 상권", value: "송도·청라·부평" },
            { label: "최소 계약", value: "3개월" },
            { label: "상담 비용", value: "0원" },
          ]}
        />


        <section className="py-14 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">인천 지역별 실제 성과</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REGIONS.map(r => (
                <div key={r.name} className={`rounded-2xl border p-5 ${r.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} strokeWidth={2.5} />
                    <span className="font-black text-sm">{r.name}</span>
                  </div>
                  <p className="text-xs opacity-80">{r.cases}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 bg-gray-950">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">인천 매장 무료 진단</h2>
            <p className="text-gray-400 text-sm mb-7">지역 경쟁사 분석부터 맞춤 전략까지 0원.</p>
            <Link href="/contact?region=인천"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-sm">
              무료 상담 신청 <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
