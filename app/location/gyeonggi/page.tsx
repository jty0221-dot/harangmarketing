import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import Link from "next/link";
import { ArrowRight, MapPin, TrendingUp, Users } from "lucide-react";
import { SITE } from "../../lib/seo";

const BASE = "https://www.harangmarketing.com";

const GYEONGGI_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE}/location/gyeonggi`,
  "name": "하랑마케팅 — 경기도 소상공인 마케팅",
  "url": `${BASE}/location/gyeonggi`,
  "logo": `${BASE}/favicon.svg`,
  "image": `${BASE}/og-image.png`,
  "telephone": SITE.phone,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": SITE.address.street,
    "addressLocality": SITE.address.locality,
    "addressRegion": SITE.address.region,
    "postalCode": SITE.address.postalCode,
    "addressCountry": SITE.address.country,
  },
  "description": "경기도 카페·음식점·미용·병원·학원 맞춤 마케팅. 일산·분당·수원·고양·성남·화성 지역 특화 전략으로 네이버 플레이스 상위노출, 리뷰 확보, SNS 운영까지.",
  "areaServed": [
    { "@type": "State", "name": "경기도" },
    { "@type": "City", "name": "고양시" },
    { "@type": "City", "name": "성남시" },
    { "@type": "City", "name": "수원시" },
    { "@type": "City", "name": "부천시" },
    { "@type": "City", "name": "화성시" },
    { "@type": "City", "name": "용인시" },
    { "@type": "City", "name": "안양시" },
    { "@type": "City", "name": "파주시" },
    { "@type": "City", "name": "김포시" },
  ],
  "knowsAbout": ["네이버 플레이스 SEO", "소상공인 마케팅", "경기도 마케팅 대행", "블로그 마케팅", "체험단 마케팅"],
  "sameAs": [`${BASE}`],
  "parentOrganization": { "@type": "Organization", "name": "하랑마케팅", "url": BASE },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": BASE },
      { "@type": "ListItem", "position": 2, "name": "지역별 서비스", "item": `${BASE}/location` },
      { "@type": "ListItem", "position": 3, "name": "경기도", "item": `${BASE}/location/gyeonggi` },
    ],
  },
};

export const metadata: Metadata = {
  title: "경기도 소상공인 마케팅 대행사 — 하랑마케팅 | 네이버 플레이스 SEO 전문",
  description: "경기도 카페·음식점·미용·병원·학원 맞춤 마케팅. 일산·분당·수원·고양·성남·화성 지역 특화 전략으로 플레이스 상위 노출, 리뷰 확보, SNS 운영까지. 무료 상담.",
  keywords: [
    "경기도 마케팅 대행사", "경기 소상공인 마케팅", "경기도 플레이스 SEO",
    "일산 마케팅", "분당 마케팅", "수원 마케팅", "고양 마케팅", "성남 마케팅",
    "경기도 네이버 플레이스", "경기 블로그 마케팅", "경기도 체험단", "화성 마케팅", "용인 마케팅",
  ],
  alternates: { canonical: `${BASE}/location/gyeonggi` },
  openGraph: {
    title: "경기도 소상공인 마케팅 대행사 — 하랑마케팅",
    description: "경기도 지역 특화 마케팅. 일산·분당·수원·고양 등 전 지역 담당.",
    url: `${BASE}/location/gyeonggi`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "경기도 마케팅 대행사 하랑마케팅" }],
  },
};

const REGIONS = [
  { name: "포천·의정부", focus: "경기북부 관문 · 나들이 목적 검색이 많다", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "성남·분당", focus: "병의원·학원 밀집 · 브랜드 검색 경쟁이 강하다", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
  { name: "수원", focus: "구도심과 신도시가 섞여 있어 키워드를 나눠 잡는다", color: "bg-purple-50 border-purple-100 text-purple-700" },
  { name: "부천", focus: "생활 밀착 상권 · 방문과 배달 검색이 함께 움직인다", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "화성·동탄", focus: "신도시 · 맘카페 영향력이 특히 강하다", color: "bg-green-50 border-green-100 text-green-700" },
  { name: "고양·일산", focus: "요식업 밀집 · 플레이스 리뷰 경쟁이 치열하다", color: "bg-slate-50 border-slate-100 text-slate-700" },
  { name: "안양·평촌", focus: "학원가·병의원 · 지역 커뮤니티 유입 비중이 크다", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "용인·수지", focus: "주거 신도시 · 재방문 고객 관리가 핵심이다", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "파주·김포", focus: "신도시가 커지는 중 · 초기 노출 선점이 유리하다", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
];

const RESULTS = [
  { label: "계약 기간", value: "월 단위", sub: "1개월부터 · 위약금 없음" },
  { label: "상담 비용", value: "0원", sub: "진단 리포트 포함" },
  { label: "재계약률", value: SITE.stats.renewalRate, sub: "전체 기준" },
];

export default function GyeonggiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(GYEONGGI_LD) }} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* Hero */}
        <section className="bg-gray-950 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <MapPin size={12} className="text-blue-400" />
              <span className="text-gray-400 text-xs font-medium">경기도 전 지역 · 현장 방문 가능</span>
            </div>
            <h1 className="text-[36px] md:text-[52px] font-black text-white leading-tight mb-5">
              경기도 소상공인<br />
              <span className="text-blue-400">마케팅 대행사</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              일산·분당·수원·고양·성남·부천·화성 등 경기도 전 지역의 매장을 맡고 있습니다.
              지역 상권과 경쟁 구도를 정확히 파악하고 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact?region=경기도"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors">
                경기도 무료 상담 신청 <ArrowRight size={15} />
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
          question="경기도 마케팅 대행사를 찾고 있습니다"
          answer="하랑마케팅은 경기도 소상공인을 전문으로 하는 마케팅 대행사입니다. 포천·파주·김포·의정부 등 경기북부는 물론 수원·성남·안양·부천·용인 등 경기 전 지역을 지원합니다. 경기도는 지역 맘카페 영향력이 커서 맘카페 바이럴을 함께 씁니다. 네이버 플레이스 순위는 매일 스냅샷으로 저장해 월 리포트로 공유하며, 경기 지역에서는 지역 맛집 키워드가 72위에서 2위(32일 계측), 지역 상가청소 키워드가 67위에서 4위(17일 계측)가 된 기록이 있습니다. 계약은 월 단위가 기본이라 1개월부터 시작할 수 있고 중도 해지 위약금이 없습니다. 전화 010-7541-9054로 무료 상담이 가능합니다."
          facts={[
            { label: "담당 지역", value: "경기 전 지역" },
            { label: "경기 계측 기록", value: "72위 → 2위" },
            { label: "계약 기간", value: "월 단위 · 1개월부터" },
            { label: "상담 비용", value: "0원" },
          ]}
        />


        {/* 수치 */}
        <section className="py-10 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              {RESULTS.map(r => (
                <div key={r.label}>
                  <div className="text-3xl md:text-4xl font-black text-blue-600 mb-1">{r.value}</div>
                  <div className="text-sm font-bold text-gray-900 mb-0.5">{r.label}</div>
                  <div className="text-xs text-gray-400">{r.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 지역별 실적 */}
        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">경기도 상권별 특성</h2>
              <p className="text-gray-500 text-sm">지역마다 고객이 찾아오는 경로가 다릅니다 — 상권에 맞춰 채널을 나눕니다</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REGIONS.map(r => (
                <div key={r.name} className={`rounded-2xl border p-5 ${r.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} strokeWidth={2.5} />
                    <span className="font-black text-sm">{r.name}</span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">{r.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 왜 지역 특화인가 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 text-center">
              경기도 상권, 수도권과 다릅니다
            </h2>
            <p className="text-gray-500 text-sm text-center mb-10">같은 업종이라도 지역 상권 특성에 맞는 전략이 달라야 합니다</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: MapPin,
                  color: "from-blue-500 to-blue-700",
                  title: "신도시 vs 구도심 전략",
                  desc: "동탄·판교·위례 신도시는 블로그+인스타 비중이 높고, 구시가지는 플레이스 SEO가 절대적입니다. 지역별로 채널 믹스가 완전히 다릅니다.",
                },
                {
                  icon: Users,
                  color: "from-indigo-500 to-purple-600",
                  title: "맘카페 네트워크 강세",
                  desc: "경기도는 맘카페 영향력이 서울보다 훨씬 강합니다. 고양·성남·수원 맘카페 커뮤니티를 통한 바이럴 전략이 핵심입니다.",
                },
                {
                  icon: TrendingUp,
                  color: "from-green-500 to-green-700",
                  title: "광역 키워드 경쟁 분석",
                  desc: "'경기 카페' '수원 맛집' 등 광역 키워드와 동 단위 로컬 키워드를 병행해야 최대 효과가 납니다.",
                },
              ].map((s) => (
                <div key={s.title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 shadow-sm" style={{ background: "var(--w-primary)" }}>
                    <s.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-2">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 md:py-20 bg-gray-950">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              경기도 매장, 무료로 진단받으세요
            </h2>
            <p className="text-gray-400 text-sm mb-7">
              지역 경쟁사 현황·플레이스 순위·블로그 공백을 분석해<br />무엇부터 해야 할지 정확히 알려드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact?region=경기도"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-sm">
                무료 상담 신청 <ArrowRight size={15} />
              </Link>
              <Link href="/cases"
                className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-white font-medium px-7 py-3.5 rounded-xl transition-colors text-sm">
                경기도 성공 사례 보기
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
