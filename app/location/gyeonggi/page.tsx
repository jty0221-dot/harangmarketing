import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import Link from "next/link";
import { CheckCircle2, ArrowRight, MapPin, TrendingUp, Star, Clock, Users, ShieldCheck } from "lucide-react";

const BASE = "https://www.harangmarketing.com";

const GYEONGGI_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE}/location/gyeonggi`,
  "name": "하랑마케팅 — 경기도 소상공인 마케팅",
  "url": `${BASE}/location/gyeonggi`,
  "logo": `${BASE}/favicon.svg`,
  "image": `${BASE}/og-image.png`,
  "telephone": "010-0000-0000",
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
    description: "경기도 지역 특화 마케팅. 일산·분당·수원·고양 실제 성과 보유.",
    url: `${BASE}/location/gyeonggi`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "경기도 마케팅 대행사 하랑마케팅" }],
  },
};

const REGIONS = [
  { name: "고양·일산", cases: "카페 '일산 카페' 키워드 1위 · 3개월", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "성남·분당", cases: "피부과 신규 예약 +300% · 6개월", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
  { name: "수원", cases: "네일샵 예약 마감 · 3개월", color: "bg-purple-50 border-purple-100 text-purple-700" },
  { name: "부천", cases: "음식점 배달 매출 +113% · 4개월", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "화성·동탄", cases: "학원 수강생 +55% · 3개월", color: "bg-green-50 border-green-100 text-green-700" },
  { name: "안양·평촌", cases: "한의원 초진 +200% · 5개월", color: "bg-amber-50 border-amber-100 text-amber-700" },
  { name: "용인·수지", cases: "카페 체인 3곳 동시 운영", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "파주·김포", cases: "음식점 플레이스 1위 · 2개월", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
];

const RESULTS = [
  { label: "경기 지역 완료 프로젝트", value: "180+", sub: "10년 누적" },
  { label: "플레이스 Top 3 달성율", value: "87%", sub: "3개월 기준" },
  { label: "재계약률", value: "95%", sub: "경기 클라이언트" },
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
              일산·분당·수원·고양·성남·부천·화성 등 경기도 전 지역에서 180곳 이상의 매장과 함께한 실제 성과가 있습니다.
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
          answer="하랑마케팅은 경기도 고양시 일산동구에 본사를 둔 경기도 소상공인 전문 마케팅 대행사입니다. 고양·파주·김포·의정부 등 경기북부는 물론 수원·성남·안양·부천·용인 등 경기 전 지역을 지원합니다. 경기도는 지역 맘카페 영향력이 커서 맘카페 바이럴 전환율이 일반 블로그의 2~3배입니다. 실제 성과로 경기 고양 카페 방문객 +167%(3개월), 경기 파주 네일샵 예약 100% 마감(6주), 경기 고양 학원 수강생 +55%(3개월), 경기 안양 한의원 초진 예약 +175%(4개월)를 달성했습니다. 전화 010-7541-9054로 무료 상담이 가능합니다."
          facts={[
            { label: "본사", value: "경기 고양 일산" },
            { label: "카페 방문객", value: "+167%" },
            { label: "학원 수강생", value: "+55%" },
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
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">경기도 지역별 실제 성과</h2>
              <p className="text-gray-500 text-sm">지역 상권 이해도가 다릅니다 — 실제 경기도 클라이언트 데이터</p>
            </div>
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
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-sm`}>
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
