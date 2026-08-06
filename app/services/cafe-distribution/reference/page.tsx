import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import JsonLd from "../../../components/JsonLd";
import ReferenceClient from "./ReferenceClient";
import { SITE, ORG_ID, breadcrumbLd, webPageLd } from "../../../lib/seo";
import { REF_CATEGORIES, REF_TOTAL } from "../../../lib/cafe-distribution";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";

const PATH = "/services/cafe-distribution/reference";
const URL = `${SITE.base}${PATH}`;

export const metadata: Metadata = {
  // 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙이므로 여기서는 브랜드명을 넣지 않는다
  title: "카페 배포 레퍼런스 — 업종별 카페 상위노출 실사 캡처",
  description: `사진관·헬스·인테리어·반려동물·뷰티·여행·가구 등 9개 업종 ${REF_TOTAL}개 키워드의 네이버 카페 영역 상위노출 실사 캡처를 공개합니다. 하랑마케팅 카페 배포 실제 진행 결과입니다.`,
  keywords: [
    "카페 배포 레퍼런스", "카페 상위노출 사례", "네이버 카페 노출 실적",
    "카페 배포 후기", "카페 마케팅 사례", "키워드 상위노출 캡처",
    "하랑마케팅 레퍼런스",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "카페 배포 레퍼런스 — 업종별 상위노출 실사 캡처",
    description: `9개 업종 ${REF_TOTAL}개 키워드의 네이버 카페 영역 노출 화면을 그대로 공개합니다.`,
    url: URL,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 카페 배포 레퍼런스" }],
  },
};

/* 키워드 목록 자체가 이 페이지의 핵심 콘텐츠다.
   업종별 키워드를 구조화 데이터로도 노출해 AI 가 "어떤 키워드를 올려봤나"에 답할 수 있게 한다. */
const LD = [
  webPageLd({
    path: PATH,
    type: "CollectionPage",
    name: "카페 배포 레퍼런스 — 하랑마케팅",
    description: `9개 업종 ${REF_TOTAL}개 키워드의 네이버 카페 영역 상위노출 실사 캡처 모음.`,
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "블로그 배포 (최적화·카페)", path: "/services/cafe-distribution" },
    { name: "레퍼런스", path: PATH },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${URL}#keywords`,
    name: "카페 상위노출 진행 키워드",
    numberOfItems: REF_TOTAL,
    publisher: { "@id": ORG_ID },
    itemListElement: REF_CATEGORIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "ItemList",
        name: c.label,
        numberOfItems: c.keywords.length,
        itemListElement: c.keywords.map((kw, j) => ({
          "@type": "ListItem",
          position: j + 1,
          name: kw,
        })),
      },
    })),
  },
];

export default async function ReferencePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initialSlug = category ?? REF_CATEGORIES[0].slug;

  return (
    <>
      <JsonLd data={LD} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 py-10 md:py-16">
          <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            {/* -my-2 py-2 로 시각적 여백은 유지하면서 터치 영역만 44px 로 넓힌다 */}
            <Link
              href="/services/cafe-distribution"
              className="-my-2 mb-3 inline-flex items-center gap-1.5 py-2 text-xs text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={13} /> 카페 배포 상품
            </Link>

            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-400">Reference</p>
            <h1 className="mb-4 text-2xl font-black leading-tight text-white md:text-4xl">
              카페 상위 노출,<br />
              <span className="text-blue-400">실제 화면으로 확인하세요</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-300 md:text-base">
              하랑마케팅이 진행한 9개 업종 {REF_TOTAL}개 키워드의
              네이버 모바일 통합검색 카페 영역 노출 캡처입니다. 보정 없이 그대로 싣습니다.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[`${REF_CATEGORIES.length}개 업종`, `${REF_TOTAL}개 키워드`, "모바일 통합검색 기준"].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-xl border border-blue-400/30 bg-white/5 px-3 py-1.5 text-xs font-semibold text-blue-100"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ReferenceClient initialSlug={initialSlug} />

        {/* CTA */}
        <section className="py-12 md:py-16" style={{ background: "var(--h-surface)" }}>
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h2
              className="mb-3 text-xl font-black md:text-2xl"
              style={{ color: "var(--h-dark)", letterSpacing: "-0.02em" }}
            >
              내 업종 키워드도 가능한지 확인해 드립니다
            </h2>
            <p className="mb-7 text-sm leading-relaxed" style={{ color: "var(--h-muted)" }}>
              업종과 목표 키워드를 알려주시면 진행 가능 여부와 예상 수량을 안내드립니다. 상담 비용은 0원입니다.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact?service=cafe-distribution"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-black text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                무료 상담 신청 <ArrowRight size={15} />
              </Link>
              <a
                href="https://pf.kakao.com/_MuUkG/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-3.5 text-sm font-bold text-gray-900 transition-colors hover:bg-yellow-300"
              >
                <MessageCircle size={15} /> 카카오톡 상담
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
