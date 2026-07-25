import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { ArrowRight, MapPin, TrendingUp, Users, Star, Building2 } from "lucide-react";

const BASE = "https://www.harangmarketing.com";

const SEOUL_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE}/location/seoul`,
  "name": "하랑마케팅 — 서울 소상공인 마케팅",
  "url": `${BASE}/location/seoul`,
  "logo": `${BASE}/favicon.svg`,
  "image": `${BASE}/opengraph-image`,
  "description": "서울 강남·강서·마포·성수·홍대·종로 소상공인 맞춤 마케팅. 10년 경력, 대표 직접 담당. 네이버 플레이스 SEO, 블로그, 체험단, 인스타그램 전문.",
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
  description: "서울 강남·강서·마포·성수·홍대·종로 소상공인 맞춤 마케팅. 10년 경력, 대표 직접 담당. 네이버 플레이스 SEO, 블로그, 체험단, 인스타그램 전문. 무료 상담.",
  keywords: [
    "서울 마케팅 대행사", "서울 소상공인 마케팅", "서울 플레이스 SEO",
    "강남 마케팅", "강서 마케팅", "마포 마케팅", "성수 마케팅", "홍대 마케팅",
    "서울 네이버 플레이스", "서울 블로그 마케팅", "서울 체험단", "종로 마케팅", "송파 마케팅",
  ],
  alternates: { canonical: `${BASE}/location/seoul` },
  openGraph: {
    title: "서울 소상공인 마케팅 대행사 — 하랑마케팅",
    description: "서울 강남·강서·마포·성수·홍대 지역 실제 성과 보유. 10년 경력 대표 직접 담당.",
    url: `${BASE}/location/seoul`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "서울 마케팅 대행사 하랑마케팅" }],
  },
};

const REGIONS = [
  { name: "강남·서초", cases: "피부과 신규 예약 +220% · 5개월", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "강서·양천", cases: "카페 플레이스 1위 · 4개월", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
  { name: "마포·홍대", cases: "음식점 배달 매출 +113% · 4개월", color: "bg-purple-50 border-purple-100 text-purple-700" },
  { name: "성수·뚝섬", cases: "카페 SNS 팔로워 0→2천명 · 3개월", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "목동·신정", cases: "학원 수강생 +60% · 3개월", color: "bg-green-50 border-green-100 text-green-700" },
  { name: "종로·인사동", cases: "음식점 외국인 관광객 유입 +40%", color: "bg-amber-50 border-amber-100 text-amber-700" },
  { name: "노원·도봉", cases: "네일샵 예약 2주 치 마감 · 2개월", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "송파·잠실", cases: "한의원 초진 +180% · 6개월", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
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
              강남·강서·마포·성수·홍대·목동 등 서울 전 지역에서 실제 성과를 만들어왔습니다.
              서울 상권의 치열한 경쟁 구도를 정확히 이해하고 있습니다.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mb-8">
              {[
                { val: "150+", label: "서울 클라이언트" },
                { val: "95%", label: "재계약률" },
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

        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 text-center">서울 지역별 실제 성과</h2>
            <p className="text-gray-500 text-sm text-center mb-10">서울은 경쟁이 치열합니다 — 그만큼 전략이 정교해야 합니다</p>
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
                  color: "from-amber-500 to-orange-600",
                  title: "리뷰 질 관리",
                  desc: "서울 소비자는 리뷰 내용을 꼼꼼히 봅니다. 단순 별점이 아닌 신뢰도 높은 텍스트 리뷰 확보 전략이 필요합니다.",
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
