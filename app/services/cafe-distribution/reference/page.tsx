import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import JsonLd from "../../../components/JsonLd";
import ReferenceClient from "./ReferenceClient";
import { SITE, ORG_ID, breadcrumbLd, webPageLd } from "../../../lib/seo";
import { REF_CATEGORIES, REF_TOTAL } from "../../../lib/cafe-distribution";
import { ArrowRight, MessageCircle, ChevronDown } from "lucide-react";

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
    { name: "최적화 블로그 · 카페 배포", path: "/services/cafe-distribution" },
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
      <main className="cafe-dist pt-[104px] md:pt-[108px]" style={{ background: "var(--cd-dark)" }}>

        {/* ══ 배너 ══ */}
        <div className="px-3 pt-5 md:px-8 md:pt-8">
          <div className="mx-auto w-full max-w-[1080px] overflow-hidden rounded-t-[20px] md:rounded-t-[26px]">
            {/* 상단 그라디언트 라인 */}
            <div className="h-3" style={{ background: "linear-gradient(90deg,#2f6bf5,#7fa6ff)" }} />

            <div
              className="px-5 py-10 text-center md:px-12 md:py-14"
              style={{ background: "linear-gradient(165deg,#1655e8,#1449c8 60%,#0f42c0)" }}
            >
              <Link
                href="/services/cafe-distribution"
                className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[14px] font-black transition-opacity hover:opacity-90 md:text-[15px]"
                style={{ color: "var(--cd-primary-deep)" }}
              >
                <img src="/harang-icon.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
                하랑마케팅
              </Link>

              <p
                className="mx-auto mb-7 w-full max-w-[560px] rounded-full px-5 py-3 text-[14px] font-bold text-white md:text-[17px]"
                style={{ background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.35)" }}
              >
                카페배포 상위 노출 · 주간 1000건 이상
              </p>

              <h1
                className="cd-display text-[52px] leading-[.98] text-white md:text-[88px]"
                style={{ letterSpacing: "-4px", textShadow: "0 8px 0 rgba(0,0,0,.18)" }}
              >
                카페배포
                <br />
                레퍼런스
              </h1>

              <div className="mx-auto mt-8 flex w-full max-w-[620px] flex-col gap-3">
                {[
                  "모바일 통합검색 기준 100% 카페 상위 노출",
                  "실제 대행사에 전달된 100% 실사 증빙 자료",
                  "지역맘 카페 · 대형 카페 100% 커뮤니티 노출",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white px-4 py-3 text-[14px] font-black md:px-6 md:py-3.5 md:text-[21px]"
                    style={{ color: "var(--cd-primary-deep)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ 구분 바 ══ */}
        <div className="px-3 py-7 text-center md:px-8 md:py-9" style={{ background: "var(--cd-dark)" }}>
          <p className="flex items-center justify-center gap-2 text-[15px] font-black text-white md:text-[26px]">
            <ChevronDown size={18} strokeWidth={3} className="shrink-0" />
            <span>인기주제 · 인기카페글 · 인기글 각 영역 레퍼런스</span>
            <ChevronDown size={18} strokeWidth={3} className="shrink-0" />
          </p>
        </div>

        <ReferenceClient initialSlug={initialSlug} />

        {/* ══ 하단 CTA ══ */}
        <section
          className="px-5 py-14 text-center md:px-8 md:py-20"
          style={{ background: "linear-gradient(165deg,#101a36,#0b1226)" }}
        >
          <div className="mx-auto w-full max-w-[720px]">
            <h2 className="text-[20px] font-bold leading-[1.4] text-white md:text-[26px]">
              노출된 결과만 증빙으로 남깁니다
            </h2>
            <p className="mt-3 text-[14px] md:text-[16px]" style={{ color: "var(--cd-on-dark-2)" }}>
              진행 건별 게시 URL과 검색 결과 캡처를 함께 전달드립니다. 상담 비용 0원.
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-[520px] flex-col gap-3">
              <Link
                href="/contact?service=cafe-distribution"
                className="flex items-center justify-center gap-2 rounded-full py-4 text-[17px] font-black text-white transition-opacity hover:opacity-90 md:py-5 md:text-[21px]"
                style={{ background: "linear-gradient(90deg,#1655e8,#5b8dfa)" }}
              >
                카페 배포 문의 바로가기 <ArrowRight size={17} />
              </Link>
              <a
                href="https://pf.kakao.com/_MuUkG/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold text-gray-900 transition-opacity hover:opacity-90"
                style={{ background: "#FAE100" }}
              >
                <MessageCircle size={16} /> 카카오톡 상담
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
