import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnswerBlock from "../components/AnswerBlock";
import { MapPin, ArrowRight, Building2, Train, Store } from "lucide-react";
import { SITE } from "../lib/seo";

const BASE = SITE.base;

/**
 * 지역별 서비스 허브.
 *
 * 왜 만들었나 (2026-08-22): /location/gyeonggi · seoul · incheon 세 페이지의
 * BreadcrumbList 2단계가 `${BASE}/location` 을 가리키는데 그 URL 이 404 였다.
 * 구글이 읽는 구조화 데이터가 존재하지 않는 페이지를 참조하면 빵부스러기 리치결과가 깨진다.
 * 겸사겸사 지역 페이지를 묶는 내부 링크 허브 역할도 한다.
 */

const LOCATION_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${BASE}/location`,
  name: "지역별 마케팅 서비스 — 하랑마케팅",
  url: `${BASE}/location`,
  description:
    "하랑마케팅이 지원하는 지역별 소상공인 마케팅 안내. 경기·서울·인천 전 지역을 담당합니다.",
  isPartOf: { "@id": `${BASE}/#website` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: BASE },
      { "@type": "ListItem", position: 2, name: "지역별 서비스", item: `${BASE}/location` },
    ],
  },
  hasPart: [
    { "@type": "WebPage", name: "경기도", url: `${BASE}/location/gyeonggi` },
    { "@type": "WebPage", name: "서울", url: `${BASE}/location/seoul` },
    { "@type": "WebPage", name: "인천", url: `${BASE}/location/incheon` },
  ],
};

export const metadata: Metadata = {
  title: "지역별 마케팅 서비스 — 경기·서울·인천 소상공인 마케팅 대행사",
  description:
    "하랑마케팅은 경기·서울·인천 전 지역 소상공인을 지원합니다. 지역별 상권 특성에 맞춘 플레이스 SEO·블로그·체험단 전략을 확인하세요.",
  keywords: [
    "지역별 마케팅 대행사", "경기 마케팅 대행사", "서울 마케팅 대행사", "인천 마케팅 대행사",
    "고양 마케팅 대행사", "일산 마케팅 대행사", "파주 마케팅", "김포 마케팅", "부천 마케팅",
    "소상공인 마케팅 지역", "우리 동네 마케팅 대행사",
  ],
  alternates: { canonical: `${BASE}/location` },
  openGraph: {
    title: "지역별 마케팅 서비스 — 하랑마케팅",
    description: "경기·서울·인천 전 지역 소상공인 마케팅.",
    url: `${BASE}/location`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 지역별 서비스" }],
  },
};

const AREAS = [
  {
    href: "/location/gyeonggi",
    name: "경기도",
    head: "가장 많이 맡은 지역",
    body: "고양·일산·파주·김포·부천·수원·성남까지. 경기 북서부는 방문 상담이 가장 빠릅니다.",
    spots: "고양·일산 · 파주 · 김포 · 부천 · 수원 · 성남",
    icon: Building2,
  },
  {
    href: "/location/seoul",
    name: "서울",
    head: "경쟁이 가장 치열한 곳",
    body: "강남·마포·성수·목동 등 상권별 검색 패턴이 완전히 다릅니다. 키워드를 좁게 잡습니다.",
    spots: "강남·서초 · 마포·홍대 · 성수 · 목동 · 종로",
    icon: Train,
  },
  {
    href: "/location/incheon",
    name: "인천",
    head: "신도시와 구도심이 다른 곳",
    body: "송도·청라는 맘카페와 인스타, 부평·구월은 플레이스와 블로그 비중을 높입니다.",
    spots: "송도·연수 · 부평·계산 · 검단 · 구월·남동",
    icon: Store,
  },
];

export default function LocationHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCATION_LD) }} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        <section className="bg-gray-950 py-16 md:py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <MapPin size={12} className="text-blue-400" />
              <span className="text-gray-400 text-xs font-medium">경기 · 서울 · 인천 전 지역</span>
            </div>
            <h1 className="text-[36px] md:text-[52px] font-black text-white leading-tight mb-5">
              지역마다 검색하는 말이<br />
              <span className="text-blue-400">다릅니다</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              같은 업종이라도 일산에서 찾는 말과 강남에서 찾는 말이 다릅니다.
              지역 상권을 먼저 보고 키워드를 잡습니다. 경기 북서부는 방문 상담도 가능합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors"
              >
                무료 상담 신청 <ArrowRight size={15} />
              </Link>
              <Link
                href="/free-check"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/30 text-white font-medium text-sm transition-colors"
              >
                내 매장 무료 진단
              </Link>
            </div>
          </div>
        </section>

        <AnswerBlock
          question="하랑마케팅은 어느 지역까지 담당하나요?"
          answer="하랑마케팅은 경기·서울·인천 전 지역 소상공인을 지원합니다. 고양·일산·파주·김포·부천 등 경기 북서부는 방문 상담이 가능하고, 그 외 지역은 비대면 상담으로 진행합니다. 지역마다 검색 패턴이 달라 상권을 먼저 분석한 뒤 키워드를 정하며, 상담 비용은 0원입니다. 전국 어디든 온라인 마케팅 자체는 동일하게 진행할 수 있습니다."
          facts={[
            { label: "설립", value: "2020년 4월" },
            { label: "방문 상담", value: "경기 북서부" },
            { label: "지원 지역", value: "경기·서울·인천" },
            { label: "상담 비용", value: "0원" },
          ]}
        />

        <section className="py-14 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2 text-center">지역별 전략 보기</h2>
            <p className="text-sm text-gray-500 text-center mb-8">
              지역을 고르면 그 지역 상권에서 실제로 만든 성과를 볼 수 있습니다
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AREAS.map((a) => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="group rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                      <Icon size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base md:text-lg font-bold text-gray-900">{a.name}</h3>
                      <span className="text-[11px] text-blue-700 bg-blue-50 rounded-md px-2 py-0.5 font-medium">
                        {a.head}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{a.body}</p>
                    <p className="text-xs md:text-[13px] text-gray-400 mb-4 truncate" title={a.spots}>
                      {a.spots}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                      자세히 보기 <ArrowRight size={14} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3">
              찾으시는 지역이 목록에 없나요
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-7">
              온라인 마케팅은 지역과 무관하게 진행할 수 있습니다. 실제로 포항·울산·부산·창원 매장도 담당하고 있습니다.
              지역을 알려주시면 그 상권의 검색량부터 확인해 드립니다.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 md:py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm transition-colors"
            >
              내 지역 상권 확인 요청 <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
