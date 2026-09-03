import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import JsonLd from "../../../components/JsonLd";
import ReferenceClient from "./ReferenceClient";
import { SITE, ORG_ID, breadcrumbLd, webPageLd } from "../../../lib/seo";
import {
  REF_TABS, REF_CATEGORIES, REF_TOTAL, REF_ALL, REF_CUTS, REF_GENRE,
} from "../../../lib/detail-page-reference";
import { ArrowRight, MessageCircle, ShieldCheck, Layers } from "lucide-react";

/**
 * 상세페이지 레퍼런스 — 종류별 실물 상세페이지 모음
 *
 * /services/detail-page 본편이 '어떻게 만드는지' 를 공개하는 공정 페이지라면,
 * 여기는 '만든 게 이렇게 생겼다' 를 종류별로 보여주는 목록이다.
 * 최적화 블로그 · 카페 배포 레퍼런스와 같은 자리에 같은 형태로 세운다 (대표 지시 2026-08-27).
 *
 * 여기 실린 작업물은 하랑마케팅이 제작·공급하는 상세페이지다.
 * 제작 협의가 끝나 파트너·외주 표기는 화면에 넣지 않는다 (2026-08-27 (목) 대표 지시).
 * 다만 각 상품 판매자의 상호 노출 동의는 아직 받지 못했으므로
 * 화면에는 제품 종류만 적고 상호·브랜드는 쓰지 않는다 (C-42).
 * 성과 수치도 실측 근거가 있는 건만 적는다 — 없으면 비워 둔다.
 */

const PATH = "/services/detail-page/reference";
const URL = `${SITE.base}${PATH}`;

export const metadata: Metadata = {
  // 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙이므로 여기서는 브랜드명을 넣지 않는다
  title: "상세페이지 레퍼런스 | 종류별 스마트스토어 상세페이지 실물",
  description: `생활·리빙, 수납·가구, 차량, 뷰티·헬스, 반려동물, 유아, 패션, 식품 등 ${REF_CATEGORIES.length}개 종류 ${REF_TOTAL}건의 스마트스토어 상세페이지 실물을 그대로 공개합니다. 기획·카피·이미지까지 하랑마케팅이 만든 상세페이지입니다.`,
  keywords: [
    "상세페이지 레퍼런스", "스마트스토어 상세페이지 사례", "상세페이지 포트폴리오",
    "상세페이지 디자인 예시", "제품 상세페이지 제작 사례", "상세페이지 종류별",
    "하랑마케팅 상세페이지",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "상세페이지 레퍼런스 | 종류별 상세페이지 실물",
    description: `${REF_CATEGORIES.length}개 종류 ${REF_TOTAL}건의 상세페이지를 처음부터 끝까지 펼쳐 보여드립니다.`,
    url: URL,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 상세페이지 레퍼런스" }],
  },
};

const LD = [
  webPageLd({
    path: PATH,
    type: "CollectionPage",
    name: "상세페이지 레퍼런스 — 하랑마케팅",
    description: `${REF_CATEGORIES.length}개 종류 ${REF_TOTAL}건의 스마트스토어 상세페이지 실물 모음. 하랑마케팅이 만든 상세페이지.`,
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "스마트스토어 상세페이지 제작", path: "/services/detail-page" },
    { name: "레퍼런스", path: PATH },
  ]),
  /**
   * 작업물 38건을 평탄한 ItemList 로 낸다.
   * 예전에는 종류별 ItemList 를 중첩했는데 이름만 있고 이미지가 없어
   * 이미지 검색에 한 장도 잡히지 않았다. 포트폴리오는 그림이 걸려야 문의가 온다.
   * 각 건에 썸네일 절대 URL · 만든 시기 · 종류를 같이 준다 (확인된 값만).
   */
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${URL}#works`,
    name: "종류별 상세페이지 레퍼런스",
    numberOfItems: REF_TOTAL,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: REF_ALL.map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        "@id": `${URL}#${w.slug}`,
        name: `${w.title} 상세페이지`,
        genre: REF_GENRE[w.slug],
        dateCreated: w.when,
        creator: { "@id": ORG_ID },
        inLanguage: "ko",
        image: {
          "@type": "ImageObject",
          contentUrl: `${SITE.base}/detail-ref/${w.slug}.jpg`,
          width: w.tw,
          height: w.th,
          caption: `${w.title} 스마트스토어 상세페이지 상단 화면`,
        },
      },
    })),
  },
];

export default async function DetailPageReferencePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initialSlug = category ?? REF_TABS[0].slug;

  return (
    <>
      <JsonLd data={LD} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* 히어로 */}
        <section className="relative overflow-hidden bg-gray-950 py-14 md:py-20">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
            <Link
              href="/services/detail-page"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-white/25 hover:text-gray-200"
            >
              <Layers size={12} className="text-blue-400" />
              스마트스토어 상세페이지 제작
            </Link>
            <h1 className="mb-5 text-[32px] font-black leading-tight text-white md:text-[52px]">
              종류별로 모아 놓고
              <br />
              <span className="text-blue-400">끝까지 펼쳐 봅니다</span>
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg">
              상세페이지는 첫 화면만 봐서는 판단이 안 됩니다. 어디서 불안을 지우고 어디서 결제로
              넘기는지는 끝까지 내려봐야 보입니다. 그래서 {REF_TOTAL}건 전부를 원본 {REF_CUTS}컷
              그대로, 중간을 요약하거나 뒷부분을 잘라내지 않고 열어 뒀습니다.
            </p>
            <dl className="grid grid-cols-3 gap-3 md:max-w-lg">
              {[
                { k: "공개 건수", v: `${REF_TOTAL}건` },
                { k: "원본 컷", v: `${REF_CUTS}컷` },
                { k: "잘라낸 구간", v: "0" },
              ].map((s) => (
                <div key={s.k} className="rounded-xl border border-white/10 px-3 py-3 md:px-4">
                  <dt className="text-[11px] text-gray-500 md:text-xs">{s.k}</dt>
                  <dd className="mt-1 text-lg font-black text-white md:text-xl">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 표기 원칙 — 상호를 왜 안 적는지, 성과를 왜 비워 두는지 목록보다 먼저 밝힌다 */}
        <section className="border-b border-gray-200 bg-white py-6 md:py-8">
          <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 md:flex-row md:items-start md:gap-5 md:p-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                <ShieldCheck size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-gray-900 md:text-base">
                  표기 원칙 — 상호는 적지 않고, 없는 성과는 만들지 않습니다
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600 md:text-sm">
                  제품 상호와 브랜드명은 각 판매자의 노출 동의를 받기 전이라 적지 않고, 제품 종류만 적었습니다.
                  성과 수치도 실측 근거가 있는 건만 적고, 없으면 비워 둡니다. 화면에 적힌 숫자는 전부 확인된 것입니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ReferenceClient initialSlug={initialSlug} />

        {/* 무엇을 보면 되는지 */}
        <section className="border-t border-gray-200 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
            <h2 className="mb-2 text-xl font-black text-gray-900 md:text-2xl">
              같은 상품도 순서를 바꾸면 결과가 달라집니다
            </h2>
            <p className="mb-8 text-sm text-gray-500">
              레퍼런스를 볼 때 디자인보다 이 세 가지를 먼저 보시면 됩니다.
            </p>
            <ol className="space-y-2.5">
              {[
                {
                  n: "1",
                  t: "첫 화면에서 무엇을 말하고 있나",
                  d: "제품 이름이 아니라 사려는 사람의 상황부터 꺼내는지 봅니다. 3초 안에 멈추게 하는 자리입니다.",
                },
                {
                  n: "2",
                  t: "불안을 몇 번째에서 지우나",
                  d: "크기가 맞을까, 깨지지 않을까, 냄새가 나지 않을까. 이 질문이 생기는 자리 바로 다음 칸에 답이 있는지 봅니다.",
                },
                {
                  n: "3",
                  t: "마지막에 무엇을 남기나",
                  d: "구성과 옵션, 배송과 반품이 끝에 정리돼 있는지 봅니다. 결제 직전에 되묻게 만들면 거기서 이탈합니다.",
                },
              ].map((r) => (
                <li key={r.n} className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 md:gap-4 md:p-5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-xs font-black text-white">
                    {r.n}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 md:text-base">{r.t}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-gray-600 md:text-sm">{r.d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-gray-200 p-4 md:p-5">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gray-400" strokeWidth={2} />
              <p className="text-[13px] leading-relaxed text-gray-600 md:text-sm">
                판매량이나 전환율 수치는 적지 않았습니다. 저희가 실측한 값이 아니기 때문입니다.
                숫자가 필요하시면 진행 후 실제로 재서 드립니다.
              </p>
            </div>
          </div>
        </section>

        {/* 하단 CTA */}
        <section className="bg-gray-950 py-14 md:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center md:px-6 lg:px-8">
            <h2 className="text-xl font-black leading-snug text-white md:text-2xl">
              사진이 아직 없어도 시작할 수 있습니다
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400 md:text-base">
              무엇을 어떤 순서로 찍어야 하는지부터 정해 드립니다. 상담과 견적은 0원입니다.
            </p>
            <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/contact?service=detail-page"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-500"
              >
                상세페이지 상담 신청 <ArrowRight size={15} />
              </Link>
              <a
                href="https://pf.kakao.com/_MuUkG/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/30"
              >
                <MessageCircle size={15} /> 카카오톡으로 문의
              </a>
            </div>
            <Link
              href="/services/detail-page"
              className="mt-6 inline-block text-[13px] text-gray-500 underline underline-offset-4 transition-colors hover:text-gray-300"
            >
              제작 공정과 단가 보러 가기
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
