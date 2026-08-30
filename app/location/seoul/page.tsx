import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import Link from "next/link";
import { ArrowRight, MapPin, TrendingUp, Users, Star, Building2 } from "lucide-react";

import { SITE } from "../../lib/seo";
const BASE = "https://www.harangmarketing.com";

const SEOUL_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE}/location/seoul`,
  "name": "하랑마케팅 — 서울 소상공인 마케팅",
  "url": `${BASE}/location/seoul`,
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
  "description": "서울 강남·강서·마포·성수·홍대·종로 소상공인 맞춤 마케팅. 10년 경력, 대표가 직접 관리. 네이버 플레이스 SEO, 블로그, 체험단, 인스타그램 전문.",
  "areaServed": [
    { "@type": "City", "name": "서울특별시" },
    { "@type": "AdministrativeArea", "name": "강남구" },
    { "@type": "AdministrativeArea", "name": "강서구" },
    { "@type": "AdministrativeArea", "name": "마포구" },
    { "@type": "AdministrativeArea", "name": "성동구" },
    { "@type": "AdministrativeArea", "name": "종로구" },
    { "@type": "AdministrativeArea", "name": "송파구" },
    { "@type": "AdministrativeArea", "name": "영등포구" },
  ],
  "knowsAbout": ["네이버 플레이스 SEO", "서울 소상공인 마케팅", "블로그 마케팅", "체험단 마케팅", "인스타그램 마케팅"],
  "parentOrganization": { "@type": "Organization", "name": "하랑마케팅", "url": BASE },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": BASE },
      { "@type": "ListItem", "position": 2, "name": "지역별 서비스", "item": `${BASE}/location` },
      { "@type": "ListItem", "position": 3, "name": "서울", "item": `${BASE}/location/seoul` },
    ],
  },
};

export const metadata: Metadata = {
  title: "서울 소상공인 마케팅 대행사 — 하랑마케팅 | 네이버 플레이스·블로그·SNS",
  description: "서울 강남·강서·마포·성수·홍대·종로 소상공인 맞춤 마케팅. 10년 경력, 대표가 직접 관리. 네이버 플레이스 SEO, 블로그, 체험단, 인스타그램 전문. 무료 상담.",
  keywords: [
    "서울 마케팅 대행사", "서울 소상공인 마케팅", "서울 플레이스 SEO",
    "강남 마케팅", "강서 마케팅", "마포 마케팅", "성수 마케팅", "홍대 마케팅",
    "서울 네이버 플레이스", "서울 블로그 마케팅", "서울 체험단", "종로 마케팅", "송파 마케팅",
  ],
  alternates: { canonical: `${BASE}/location/seoul` },
  openGraph: {
    title: "서울 소상공인 마케팅 대행사 — 하랑마케팅",
    description: "서울 강남·강서·마포·성수·홍대 등 전 지역 담당. 10년 경력 대표 직접 관리.",
    url: `${BASE}/location/seoul`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "서울 마케팅 대행사 하랑마케팅" }],
  },
};

const REGIONS = [
  { name: "강남·서초", focus: "병의원·피부과 밀집 · 브랜드 검색 경쟁이 가장 세다", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "강서·양천", focus: "마곡 업무지구 · 직장인 점심·퇴근 검색 비중이 높다", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
  { name: "마포·홍대", focus: "유동인구 상권 · 방문과 배달 검색이 함께 움직인다", color: "bg-purple-50 border-purple-100 text-purple-700" },
  { name: "성수·뚝섬", focus: "카페·편집숍 밀집 · 인스타에서 넘어오는 유입이 크다", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "목동·신정", focus: "학원가 · 학부모 커뮤니티 영향력이 특히 강하다", color: "bg-green-50 border-green-100 text-green-700" },
  { name: "종로·인사동", focus: "관광 상권 · 지도 노출과 외국어 검색을 함께 본다", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "노원·도봉", focus: "주거 밀집 · 재방문과 리뷰 관리가 순위를 좌우한다", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "송파·잠실", focus: "대형 주거 상권 · 병의원·한방 경쟁 밀도가 높다", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
];

export default function SeoulPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SEOUL_LD) }} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        <section className="bg-gray-950 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Building2 size={12} className="text-blue-400" />
              <span className="text-gray-400 text-xs font-medium">서울 전 지역 · 방문 상담 가능</span>
            </div>
            <h1 className="text-[36px] md:text-[52px] font-black text-white leading-tight mb-5">
              서울 소상공인<br />
              <span className="text-blue-400">마케팅 대행사</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              강남·강서·마포·성수·홍대·목동 등 서울 전 지역을 맡고 있습니다.
              서울 상권의 치열한 경쟁 구도를 정확히 이해하고 있습니다.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mb-8">
              {[
                { val: "월 단위", label: "계약 기간" },
                { val: SITE.stats.renewalRate, label: "재계약률" },
                { val: "10년+", label: "경력" },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <div className="text-xl font-black text-white mb-0.5">{s.val}</div>
                  <div className="text-[11px] text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact?region=서울"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors">
                서울 무료 상담 신청 <ArrowRight size={15} />
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
          question="서울 소상공인 마케팅 대행사, 어디에 맡겨야 하나요?"
          answer="하랑마케팅은 서울 전 지역 소상공인을 지원하는 마케팅 대행사입니다. 강남·강서·마포·성수·홍대·종로·송파·영등포 등 상권별 경쟁 강도가 다르기 때문에 지역마다 다른 키워드 전략을 씁니다. 서울은 경쟁이 치열해 플레이스 상위 노출까지 보통 1~2개월이 걸립니다. 계약은 월 단위가 기본이라 1개월부터 시작할 수 있고 중도 해지 위약금이 없습니다. 서울 전 지역 방문 상담과 비대면 상담 모두 가능하며 상담 비용은 0원입니다."
          facts={[
            { label: "계약 기간", value: "월 단위 · 1개월부터" },
            { label: "상위 노출 기간", value: "1~2개월" },
            { label: "중도 해지", value: "위약금 없음" },
            { label: "상담 비용", value: "0원" },
          ]}
        />


        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 text-center">서울 상권별 특성</h2>
            <p className="text-gray-500 text-sm text-center mb-10">같은 서울이어도 고객이 찾아오는 경로가 다릅니다. 상권에 맞춰 채널을 나눕니다</p>
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

        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 text-center">
              서울 마케팅, 이렇게 다릅니다
            </h2>
            <p className="text-gray-500 text-sm text-center mb-10">경쟁이 치열할수록 더 정교한 전략이 필요합니다</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: TrendingUp,
                  color: "from-blue-500 to-blue-700",
                  title: "키워드 경쟁 강도 분석",
                  desc: "서울은 같은 업종 경쟁자가 수백 개입니다. 틈새 키워드와 롱테일 키워드 전략 없이는 순위 진입이 불가능합니다.",
                },
                {
                  icon: Users,
                  color: "from-purple-500 to-purple-700",
                  title: "MZ 타겟 SNS 전략",
                  desc: "성수·홍대·합정 권역은 인스타그램과 릴스 영향력이 절대적입니다. 트렌드에 맞는 콘텐츠 포맷이 핵심입니다.",
                },
                {
                  icon: Star,
                  color: "from-blue-600 to-orange-600",
                  title: "리뷰 질 관리",
                  desc: "서울 소비자는 리뷰 내용을 꼼꼼히 봅니다. 단순 별점이 아닌 신뢰도 높은 텍스트 리뷰 확보 전략이 필요합니다.",
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

        <section className="py-14 md:py-20 bg-gray-950">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">서울 매장, 무료로 진단받으세요</h2>
            <p className="text-gray-400 text-sm mb-7">지역 경쟁사 분석부터 맞춤 전략까지 비용 0원.</p>
            <Link href="/contact?region=서울"
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
