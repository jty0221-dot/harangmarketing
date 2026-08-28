import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import JsonLd from "../../components/JsonLd";
import { SITE, ORG_ID, LOCAL_ID, faqLd, breadcrumbLd, webPageLd, howToLd, type FaqItem } from "../../lib/seo";
import { getDetailPageCases, INDUSTRY_LABEL } from "../../lib/detail-page-cases";
import { REF_TOTAL, REF_CATEGORIES } from "../../lib/detail-page-reference";
import {
  ArrowRight, Check, Layers, ShieldCheck, Ban, FileText, Camera,
  Image as ImageIcon, Film, ClipboardList, Info,
} from "lucide-react";

/**
 * 스마트스토어 상세페이지 제작 — 서비스 상세 페이지
 *
 * 처음에는 납품 사례가 적어서 공정 공개형으로만 세웠는데(D-0077), 레퍼런스 38건을
 * 전량 수집해 두고도 이 페이지에서는 맨 아래 글자 링크 한 줄로만 걸어 놨었다.
 * 상세페이지를 맡길지 고민하는 사람이 제일 먼저 찾는 건 공정이 아니라 '만든 게 어떻게
 * 생겼나' 다 — 그걸 찾다가 못 찾으면 그냥 나간다 (2026-08-28 (금) 대표 지시).
 * 그래서 히어로 바로 밑에 실물 썸네일 밴드를 세웠다.
 *
 * 다섯 층이다. 0층 레퍼런스 · 1층 공정(9단) · 2층 게이트 · 3층 원칙 · 4층 사례.
 * 0층과 4층은 다른 것을 답한다 — 0층은 '무엇을 만들었나'(상호 없이 실물),
 * 4층은 '누구 것을 만들었나'(상호 공개 동의를 받은 건). 4층이 비어도 페이지는 선다.
 *
 * 단가는 우리 4등급안이다 (기획형 150,000 · 제작형 350,000 · 제작+영상형 550,000 · 앵커 1,500,000).
 * 블로그 홈페이지형 디자인 상품(STANDARD·DELUXE·PREMIUM) 등급표는 다른 상품의 것이라 여기 쓰지 않는다
 * (2026-08-27 (목) 대표 지시로 원복 · D-0078). 그 값이 들어가는 자리는 앵커 안의 스토어 스킨 원가 한 줄뿐이다.
 * 부가세 기준은 아직 확정 전이라 이 화면에 부가세 문구를 쓰지 않는다 (C-42).
 *
 * 디자인 기준은 WDS 다 (harang/CLAUDE.md).
 * 아이콘 박스는 단색 배경 + 흰 아이콘으로 한다 — 그라데이션 금지.
 * services/shopping 이 bg-gradient-to-br 를 쓰고 있는데 그건 기존 코드의 위반이라 베끼지 않는다.
 */

const PATH = "/services/detail-page";
const URL = `${SITE.base}${PATH}`;
const CTA_HREF = "/contact?service=detail-page";
const KAKAO_HREF = "https://pf.kakao.com/_MuUkG/chat";

/* 1층 · 공정 9단 (본부장 상세페이지_제작시스템.md 제2장과 같은 값) */
/**
 * 히어로 밑 밴드에 거는 미리보기 12장.
 * 종류마다 첫 건을 먼저 뽑고 남는 자리를 두 번째 건으로 채운다 —
 * 앞에서부터 12장을 자르면 생활·리빙만 나와서 '이 사람은 생활용품만 하는구나' 로 읽힌다.
 */
const SHOWCASE = REF_CATEGORIES
  .flatMap((c) => c.works.slice(0, 2).map((w, i) => ({ ...w, cat: c.slug, catShort: c.short, rank: i })))
  .sort((a, b) => a.rank - b.rank)
  .slice(0, 12);

const REF_HREF = "/services/detail-page/reference";

const SECTIONS = [
  { code: "S0", name: "인트로 훅", role: "3초 안에 멈추게 한다", note: "실물 컷을 모션으로" },
  { code: "S1", name: "메인카피", role: "약속을 한 문장으로 말한다", note: "카피 일체형 디자인" },
  { code: "S2", name: "대표 실사컷", role: "실물이 이렇게 생겼다는 증명", note: "실물 원본에서 출발" },
  { code: "S3", name: "신뢰 블록", role: "산지·등급·측정값", note: "확정된 값만 올린다" },
  { code: "S4", name: "디테일·단면", role: "가까이서 봐도 괜찮은가", note: "접사 컷" },
  { code: "S5", name: "구성·옵션", role: "고르게 만든다", note: "표로 정리" },
  { code: "S6", name: "배송·포장", role: "깨지거나 상하지 않을까를 지운다", note: "포장 방식 공개" },
  { code: "S7", name: "표시사항", role: "식품이면 법정 요건", note: "원재료·소비기한 등" },
  { code: "S8", name: "CS·반품", role: "분쟁을 미리 막는다", note: "교환·환불 기준 명시" },
];

/* 등급 · 4등급 단가안 (2026-08-27 (목) 대표 지시로 원복 — 블로그 홈페이지형 디자인 등급표는 다른 상품이라 여기 쓰지 않는다) */
const PLANS = [
  {
    key: "planning",
    name: "기획형",
    price: "150,000원",
    amount: 150000,
    lead: "3영업일",
    summary: "기획만 받고 제작은 직접 하십니다",
    forWhom: "디자이너나 편집자가 이미 있는 경우",
    includes: [
      "9단 섹션 구성표",
      "섹션별 카피 (문구)",
      "3블록 이미지 생성 프롬프트 패키지",
      "촬영 기획안",
    ],
    excludes: ["상세 이미지 제작은 들어가지 않습니다"],
    recommended: false,
  },
  {
    key: "production",
    name: "제작형",
    price: "350,000원",
    amount: 350000,
    lead: "7영업일",
    summary: "기획부터 상세 이미지 완성까지",
    forWhom: "만들 사람이 없는 경우, 대부분 여기입니다",
    includes: [
      "기획형 전부",
      "9단 상세페이지 이미지 제작",
      "모바일 가독성 판 (글자 크기·여백 재조정)",
      "슬라이스 파일 납품",
    ],
    excludes: [],
    recommended: true,
  },
  {
    key: "video",
    name: "제작+영상형",
    price: "550,000원",
    amount: 550000,
    lead: "10영업일",
    summary: "상세 이미지에 움직이는 첫 화면까지",
    forWhom: "사진부터 없는 경우 · 촬영 기획부터 같이 갑니다",
    includes: [
      "제작형 전부",
      "S0 첫 화면 훅 GIF",
      "숏폼 1편 (15초 내외)",
      "START·END 프레임 기반 제작",
    ],
    excludes: [],
    recommended: false,
  },
];

/* 앵커 — 실제로 파는 상품이다. 팔 생각 없는 가짜 등급은 표시광고법 위반이라 세우지 않는다 */
const PACKAGE = {
  key: "brand",
  name: "브랜드 패키지",
  price: "1,500,000원",
  amount: 1500000,
  lead: "20영업일",
  summary: "상품 하나가 아니라 스토어 하나를 세웁니다",
  includes: [
    "상품 3종 상세페이지",
    "스마트스토어 스킨 디자인",
    "블로그·카페 배포 원고 3편",
  ],
};

const EXTRAS = [
  { name: "텍스트·문구 수정", price: "2회 포함 / 초과 회당 30,000원", note: "카피와 문구를 고치는 수정입니다" },
  { name: "이미지 재생성", price: "컷당 3회 포함 / 초과 컷당 20,000원", note: "같은 자리의 이미지를 다시 뽑는 경우입니다" },
  { name: "구성 순서 변경", price: "1회 포함 / 이후 기획 재작업 80,000원", note: "순서가 바뀌면 카피와 이미지가 전부 다시 갑니다" },
  { name: "촬영 원본 교체", price: "1회 포함 / 이후 재제작 견적 별도", note: "사진이 바뀌면 그 자리부터 다시 만듭니다" },
];

/* 2층 · 순서를 강제하는 게이트 두 개 */
const GATES = [
  {
    icon: ClipboardList,
    title: "기획 없이 이미지를 만들지 않습니다",
    body: "구성표와 카피가 확정되기 전에는 이미지 생성을 시작하지 않습니다. 순서를 정하지 않고 만든 이미지는 예쁘게 나와도 자리를 못 찾아 결국 다시 만들게 됩니다.",
  },
  {
    icon: Film,
    title: "이미지가 확정되기 전에 영상을 만들지 않습니다",
    body: "영상은 확정된 이미지에서 출발합니다. 이미지가 흔들리는 상태에서 영상부터 만들면 이미지를 고치는 순간 영상을 통째로 다시 만들어야 합니다.",
  },
];

/* 3층 · 원칙 */
const PRINCIPLES = [
  {
    icon: Camera,
    title: "실물 사진에서 출발합니다",
    body: "AI 로 보정하거나 실사화하더라도 출발점은 사장님이 보내주신 실물 사진입니다. 글자만으로 없는 제품을 만들어 올리지 않습니다.",
  },
  {
    icon: ShieldCheck,
    title: "받아본 손님이 사진과 다르다고 할 수 있으면 그건 보정이 아닙니다",
    body: "밝기·색온도·먼지 제거·배경 정리까지가 보정입니다. 양을 늘리거나 크기·색을 실물과 다르게 만드는 것은 하지 않습니다.",
  },
  {
    icon: FileText,
    title: "모르는 값은 비워두고 여쭙습니다",
    body: "식품 표시사항의 원재료·용량·소비기한·제조원은 확인된 것만 적습니다. 상세페이지에서는 틀린 값이 빈 값보다 나쁩니다.",
  },
  {
    icon: Ban,
    title: "안 하는 것도 적어 둡니다",
    body: "검증할 수 없는 최상급 표현, 효능·질병 예방 문구, 실제 판매 이력이 없는 정가에 붙이는 할인율, 남은 수량 깜빡임 같은 재촉 장치는 쓰지 않습니다.",
  },
];

/* 고객이 겪는 순서 */
const STEPS = [
  { name: "상품 확인", text: "상품·가격·옵션·표시사항과 지금 갖고 계신 사진을 봅니다. 사진이 없어도 시작합니다." },
  { name: "구성 기획", text: "어떤 불안을 몇 번째 화면에서 지울지 정합니다. 9단 구성표와 카피가 여기서 나옵니다." },
  { name: "촬영 기획", text: "필요한 컷을 목록으로 드립니다. 직접 찍으셔도 되고 촬영을 맡기셔도 됩니다." },
  { name: "이미지 제작", text: "섹션별로 만들고, 고르는 게 아니라 고쳐서 확정합니다." },
  { name: "확정과 납품", text: "슬라이스 파일로 드립니다. 등록까지 맡기시면 스토어에 올려 드립니다." },
];

const FAQS: FaqItem[] = [
  {
    q: "상세페이지 제작 비용은 얼마인가요?",
    a: "하랑마케팅 상세페이지는 세 등급입니다. 기획만 받는 기획형 150,000원, 기획과 이미지 제작을 함께 하는 제작형 350,000원, 여기에 첫 화면 훅 GIF 와 숏폼 1편이 붙는 제작+영상형 550,000원입니다. 상품 3종에 스토어 스킨과 배포 원고까지 묶는 브랜드 패키지는 1,500,000원입니다. 상담과 견적은 0원입니다.",
  },
  {
    q: "어느 등급을 골라야 하나요?",
    a: "질문 하나로 갈립니다. 사진도 있고 만들 사람도 있다면 기획형입니다. 사진은 있는데 만들 사람이 없다면 제작형이고 대부분 여기입니다. 사진부터 없다면 제작+영상형으로 촬영 기획부터 같이 갑니다. 저희는 상담에서 제작형을 기본으로 안내드립니다.",
  },
  {
    q: "제품 사진이 아직 없는데 시작할 수 있나요?",
    a: "시작할 수 있습니다. 사진이 없는 단계에서는 촬영 기획안부터 만듭니다. 어떤 컷이 몇 장 필요한지, 각 컷을 어떤 각도와 배경으로 찍어야 하는지를 목록으로 드리기 때문에 직접 찍으셔도 되고 촬영을 맡기셔도 됩니다. 사진이 없어서 시작을 미루지 않으셔도 됩니다.",
  },
  {
    q: "수정은 몇 번까지 되나요?",
    a: "수정은 종류마다 횟수가 다릅니다. 문구 수정은 2회까지 포함이고 넘으면 회당 30,000원, 이미지 재생성은 컷당 3회까지 포함이고 넘으면 컷당 20,000원입니다. 구성 순서 변경은 1회까지 포함이고 이후에는 기획 재작업 80,000원, 촬영 원본 교체는 1회까지 포함이고 이후에는 재제작 견적을 따로 드립니다. 순서와 사진이 바뀌면 카피와 이미지가 전부 다시 가기 때문입니다. 무제한 수정은 약속드리지 않습니다.",
  },
  {
    q: "AI 로 만든 이미지를 쓰나요?",
    a: "씁니다. 다만 실물 사진에서 출발한 것만 씁니다. 보내주신 제품 사진을 밝기·색·배경 정리를 거쳐 상세컷 수준으로 다듬는 방식이고 글자만으로 없는 제품을 만들어 내지 않습니다. AI 를 쓴 작업은 사례에도 그렇게 표시합니다.",
  },
  {
    q: "만든 파일을 직접 고칠 수 있나요?",
    a: "편집 가능한 원본 파일을 50,000원에 드립니다. 다만 유료 폰트나 유료 이미지가 들어간 뒤에 요청하시면 무료 소스로 바꾸는 작업이 한 번 더 들어가므로, 원본이 필요하시면 시작할 때 미리 말씀해 주시는 편이 낫습니다.",
  },
];

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "스마트스토어 상세페이지 제작",
    alternateName: ["상세페이지 제작", "상세페이지 외주", "제품 상세페이지 디자인"],
    serviceType: "이커머스 상세페이지 기획·제작",
    provider: { "@id": LOCAL_ID },
    brand: { "@id": ORG_ID },
    url: URL,
    inLanguage: "ko-KR",
    description:
      "스마트스토어 상세페이지를 9단 구성으로 기획하고 제작합니다. 기획 없이 이미지를 만들지 않고, 이미지가 확정되기 전에 영상을 만들지 않습니다. 실물 사진에서 출발한 컷만 사용합니다.",
    areaServed: { "@type": "Country", name: "대한민국" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KRW",
      lowPrice: 150000,
      highPrice: 1500000,
      offerCount: PLANS.length + 1,
      offers: [...PLANS, PACKAGE].map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: p.amount,
        priceCurrency: "KRW",
        description: p.summary,
        url: URL,
      })),
    },
  },
  webPageLd({
    path: PATH,
    name: "하랑마케팅 스마트스토어 상세페이지 제작",
    description: "이미지를 파는 게 아니라 순서를 팝니다. 9단 구성 · 게이트 2개 · 공정 전체 공개. 150,000원부터.",
  }),
  howToLd({
    path: PATH,
    name: "상세페이지 제작이 진행되는 순서",
    description: "상품 확인부터 납품까지 다섯 단계로 진행합니다. 사진이 없는 상태에서도 시작합니다.",
    totalTime: "P7D",
    steps: STEPS.map((s) => ({ name: s.name, text: s.text })),
  }),
  faqLd(FAQS, URL),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "스마트스토어 상세페이지 제작", path: PATH },
  ]),
];

export default function DetailPageServicePage() {
  const cases = getDetailPageCases();

  return (
    <>
      <JsonLd data={LD} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* 히어로 */}
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
              <Layers size={12} className="text-blue-400" />
              <span className="text-gray-400 text-xs font-medium">스마트스토어 상세페이지 제작</span>
            </div>
            <h1 className="text-[32px] md:text-[52px] font-black text-white leading-tight mb-5">
              이미지를 파는 게 아니라
              <br />
              <span className="text-blue-400">순서를 팝니다</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              같은 상품도 어떤 불안을 몇 번째 화면에서 지우느냐에 따라 결과가 달라집니다.
              그래서 저희는 예쁘게 만들기 전에 순서부터 정합니다. 그 순서를 이 페이지에 전부 공개합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={CTA_HREF}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors"
              >
                상세페이지 상담 신청 <ArrowRight size={15} />
              </Link>
              <a
                href={KAKAO_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/30 text-white font-medium text-sm transition-colors"
              >
                카카오톡으로 문의
              </a>
              <Link
                href={REF_HREF}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/30 text-white font-medium text-sm transition-colors"
              >
                제작 사례 {REF_TOTAL}건 보기 <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* 0층 · 레퍼런스 (만든 것부터 보여준다) */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
              <div className="min-w-0">
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                  <Layers size={16} className="text-white" strokeWidth={2.5} />
                </span>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2 leading-tight">
                  만든 상세페이지 {REF_TOTAL}건을 그대로 열어 뒀습니다
                </h2>
                <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed max-w-xl">
                  앞부분만 잘라 붙인 미리보기가 아니라 처음부터 끝까지 다 있습니다.
                  {REF_CATEGORIES.length}가지 종류로 나눠 뒀으니 내 상품과 가까운 것부터 보시면 됩니다.
                </p>
              </div>
              <Link
                href={REF_HREF}
                className="hidden md:inline-flex min-h-[44px] shrink-0 items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors"
              >
                전체 보기 <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>

            {/* 종류별 바로가기 */}
            <div className="flex flex-wrap gap-2 mb-5">
              {REF_CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`${REF_HREF}?category=${c.slug}`}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm transition-colors hover:border-blue-300 hover:text-blue-600"
                >
                  {c.short}
                  <span className="tabular-nums font-semibold text-gray-400">{c.works.length}</span>
                </Link>
              ))}
            </div>

            {/* 실물 썸네일 */}
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {SHOWCASE.map((w) => (
                <li key={w.slug}>
                  <Link
                    href={`${REF_HREF}?category=${w.cat}`}
                    className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors hover:border-blue-300"
                  >
                    <span className="relative block aspect-[3/4] overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/detail-ref/${w.slug}.jpg`}
                        alt={`${w.title} 상세페이지 상단 화면`}
                        width={w.tw}
                        height={w.th}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                      />
                    </span>
                    <span className="block px-3 py-2.5">
                      <span className="mb-0.5 block text-[11px] font-bold text-blue-600">{w.catShort}</span>
                      <span className="block text-xs font-bold leading-snug text-gray-900 line-clamp-2">{w.title}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={REF_HREF}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-gray-800"
            >
              {REF_TOTAL}건 전부 펼쳐 보기 <ArrowRight size={15} strokeWidth={2.5} />
            </Link>

            <p className="mt-3 text-center text-[11px] text-gray-400">
              상호 노출 동의를 받기 전이라 제품 종류만 적습니다. 상호·브랜드는 쓰지 않습니다.
            </p>
          </div>
        </section>

        {/* AEO 한 줄 정답 */}
        <AnswerBlock
          question="스마트스토어 상세페이지 제작은 비용이 얼마이고 무엇부터 하나요?"
          answer="하랑마케팅 상세페이지 제작은 세 등급입니다. 기획만 받는 기획형 150,000원, 기획과 이미지 제작을 함께 하는 제작형 350,000원, 첫 화면 훅 GIF 와 숏폼 1편까지 붙는 제작+영상형 550,000원입니다. 제작은 이미지부터가 아니라 구성 기획부터 시작합니다. 어떤 불안을 몇 번째 화면에서 지울지 정한 다음 9단 구성표와 카피를 만들고 그 다음에 이미지를 만듭니다. 제품 사진이 아직 없어도 촬영 기획안부터 진행할 수 있습니다. 상담과 견적은 0원입니다."
          facts={[
            { label: "기획형", value: "150,000원" },
            { label: "제작형", value: "350,000원" },
            { label: "제작+영상형", value: "550,000원" },
            { label: "상담·견적", value: "0원" },
          ]}
        />

        {/* 1층 · 공정 9단 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                상세페이지는 아홉 칸으로 만듭니다
              </h2>
              <p className="text-gray-500 text-sm">칸마다 하는 일이 다릅니다. 순서가 곧 설득 순서입니다.</p>
            </div>
            <ol className="space-y-2.5">
              {SECTIONS.map((s) => (
                <li
                  key={s.code}
                  className="flex items-start gap-3 md:gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  <span className="shrink-0 w-9 h-9 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                    {s.code}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h3 className="font-bold text-gray-900 text-sm">{s.name}</h3>
                      <span className="text-gray-500 text-xs">{s.role}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{s.note}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-gray-500 text-xs md:text-[13px] mt-6 leading-relaxed">
              식품이 아니면 S7 이 빠지고 옵션이 하나면 S5 가 짧아집니다.
              칸 수를 채우려고 넣지 않습니다. 할 말이 없는 칸은 비웁니다.
            </p>
          </div>
        </section>

        {/* 2층 · 게이트 */}
        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                순서를 지키게 만드는 장치 두 개
              </h2>
              <p className="text-gray-500 text-sm">이 둘만 지키면 다시 만드는 일이 거의 없습니다.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GATES.map((g) => (
                <div key={g.title} className="bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center mb-4 shadow-sm">
                    <g.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-2">{g.title}</h3>
                  <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed">{g.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 진행 순서 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">진행 순서</h2>
              <p className="text-gray-500 text-sm">사진이 없는 상태에서도 2번부터 시작할 수 있습니다.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {STEPS.map((s, i) => (
                <div key={s.name} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-black mb-3">
                    {i + 1}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm mb-1.5">{s.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 등급 */}
        <section id="plans" className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">등급과 금액</h2>
              <p className="text-gray-500 text-sm">상담에서는 제작형을 기본으로 안내드립니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-start">
              {PLANS.map((p) => (
                <div
                  key={p.key}
                  className={
                    p.recommended
                      ? "bg-white rounded-2xl p-5 md:p-6 border-2 border-blue-600 shadow-sm relative"
                      : "bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm"
                  }
                >
                  {p.recommended && (
                    <span className="absolute -top-2.5 left-5 inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white">
                      <Check size={11} strokeWidth={3} /> 기본 추천
                    </span>
                  )}
                  <h3 className="font-black text-gray-900 text-base mb-1">{p.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{p.summary}</p>
                  <div className="mb-1">
                    <span className="text-2xl font-black text-gray-900">{p.price}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    {p.lead} · {p.forWhom}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {p.includes.map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <Check size={14} className="text-blue-600 mt-0.5 shrink-0" strokeWidth={3} />
                        <span className="text-xs md:text-[13px] text-gray-700 leading-relaxed">{it}</span>
                      </li>
                    ))}
                    {p.excludes.map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <Ban size={14} className="text-gray-400 mt-0.5 shrink-0" strokeWidth={2.5} />
                        <span className="text-xs md:text-[13px] text-gray-400 leading-relaxed">
                          {it}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`${CTA_HREF}&plan=${p.key}`}
                    className={
                      p.recommended
                        ? "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-bold text-white transition-colors"
                        : "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 hover:border-gray-400 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors"
                    }
                  >
                    이 등급으로 문의
                  </Link>
                </div>
              ))}
            </div>


            {/* 앵커 — 상품 하나가 아니라 스토어 하나 */}
            <div className="mt-4 rounded-2xl border border-gray-900 bg-gray-900 p-5 md:p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                      <Layers size={14} className="text-white" strokeWidth={2.5} />
                    </span>
                    <h3 className="font-black text-white text-base">{PACKAGE.name}</h3>
                  </div>
                  <p className="text-[13px] text-gray-400 mb-3">{PACKAGE.summary}</p>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {PACKAGE.includes.map((it) => (
                      <li key={it} className="flex items-center gap-1.5">
                        <Check size={13} className="text-blue-400 shrink-0" strokeWidth={3} />
                        <span className="text-xs md:text-[13px] text-gray-200">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="shrink-0 md:text-right">
                  <div className="text-2xl font-black text-white">{PACKAGE.price}</div>
                  <p className="text-xs text-gray-400 mb-3">{PACKAGE.lead}</p>
                  <Link
                    href={`${CTA_HREF}&plan=${PACKAGE.key}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-900 transition-colors"
                  >
                    이 구성으로 문의
                  </Link>
                </div>
              </div>
            </div>

            {/* 등급 밖 항목 */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm">등급에 들어가지 않는 항목</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {EXTRAS.map((e) => (
                  <li key={e.name} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <div className="sm:w-56 shrink-0">
                      <span className="text-sm font-medium text-gray-900">{e.name}</span>
                    </div>
                    <div className="sm:w-32 shrink-0">
                      <span className="text-sm font-bold text-gray-900">{e.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed min-w-0">{e.note}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-white border border-gray-200 p-4">
              <Info size={15} className="text-gray-400 mt-0.5 shrink-0" />
              <div className="text-xs md:text-[13px] text-gray-500 leading-relaxed">
                <p className="mb-1">표기 금액은 상품 1개 기준입니다. 등급 사이 금액과 장당 단가는 따로 만들지 않습니다.</p>
                <p>
                  수정 횟수는 위 표대로입니다. 섹션 순서를 바꾸거나 촬영 원본을 교체하는 것은 수정이 아니라
                  재제작이라 따로 안내드립니다. 무제한 수정은 약속드리지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3층 · 원칙 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">일하는 원칙</h2>
              <p className="text-gray-500 text-sm">할 수 있는 것보다 안 하는 것을 먼저 적어 둡니다.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-sm">
                    <p.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-2 leading-snug">{p.title}</h3>
                  <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4층 · 사례 (없으면 없다고 적는다) */}
        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">작업 사례</h2>
              <p className="text-gray-500 text-sm">상호 노출에 동의해 주신 건만 올립니다.</p>
            </div>

            {cases.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center mb-4 shadow-sm">
                  <ImageIcon size={16} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-gray-900 text-sm mb-2">상호를 밝힌 사례는 아직 없습니다</h3>
                <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed mb-4">
                  만든 상세페이지는 맨 위에 {REF_TOTAL}건을 종류별로 펼쳐 뒀습니다.
                  다만 상호와 브랜드명까지 적으려면 사장님의 서면 동의가 필요해서, 이 자리에는
                  동의를 받은 건부터 하나씩 올립니다. 동의 없이 상호를 적거나 성과를 지어내지 않습니다.
                </p>
                <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed">
                  대신 위에 공정을 전부 적어 두었습니다.{" "}
                  <span className="font-medium text-gray-700">이 사람이 내 상품을 어떻게 다룰까</span>
                  에는 완성 이미지 몇 장보다 이쪽이 더 직접 답한다고 봅니다.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cases.map((c) => (
                  <article key={c.slug} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {c.thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.thumb} alt={c.title} className="w-full h-40 object-cover" loading="lazy" />
                    )}
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <span className="w-chip w-chip-blue">{INDUSTRY_LABEL[c.industry] ?? c.industry}</span>
                        {c.aiUsed && <span className="w-chip w-chip-neutral">AI 활용</span>}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{c.title}</h3>
                      <p className="text-xs text-gray-400 mb-3">
                        {c.client} · {c.date} · {c.sections}단 구성
                      </p>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-[11px] font-medium text-gray-400 mb-0.5">문제</dt>
                          <dd className="text-xs text-gray-600 leading-relaxed">{c.problem}</dd>
                        </div>
                        <div>
                          <dt className="text-[11px] font-medium text-gray-400 mb-0.5">푼 방법</dt>
                          <dd className="text-xs text-gray-600 leading-relaxed">{c.approach}</dd>
                        </div>
                        {/* 성과는 근거가 있는 건만 채운다. 비어 있으면 영역 자체를 그리지 않는다 */}
                        {c.result && (
                          <div>
                            <dt className="text-[11px] font-medium text-gray-400 mb-0.5">성과</dt>
                            <dd className="text-xs font-medium text-gray-900 leading-relaxed">{c.result}</dd>
                          </div>
                        )}
                      </dl>
                      {c.aiNote && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-[11px] text-gray-400">{c.aiNote}</p>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            <Link
              href="/services/detail-page/reference"
              className="mt-4 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-300 md:p-6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                <Layers size={16} className="text-white" strokeWidth={2.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black text-gray-900">
                  제작한 상세페이지 {REF_TOTAL}건을 종류별로 열어 뒀습니다
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-gray-500 md:text-[13px]">
                  하랑마케팅이 만든 상세페이지입니다. 생활·수납·차량·뷰티·반려동물 등
                  {" "}{REF_CATEGORIES.length}가지 종류로 나눠 처음부터 끝까지 펼쳐 볼 수 있습니다.
                </span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-gray-400" />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-8">자주 묻는 질문</h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="group bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  <summary className="cursor-pointer list-none px-5 py-4 flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-md bg-gray-900 text-white text-[11px] font-black flex items-center justify-center">
                      Q
                    </span>
                    <span className="font-bold text-gray-900 text-sm leading-relaxed">{f.q}</span>
                  </summary>
                  <div className="px-5 pb-5 pl-[52px]">
                    <p className="text-xs md:text-[13px] text-gray-600 leading-relaxed">{f.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 md:py-16 bg-gray-950">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">상품 이야기부터 들려주세요</h2>
            <p className="text-gray-400 text-sm mb-7 leading-relaxed">
              사진이 아직 없어도 됩니다. 무엇을 파시는지, 어떤 분들이 사시는지만 알려주시면
              어떤 순서로 만들면 좋을지부터 정리해 드립니다. 상담과 견적은 0원입니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={CTA_HREF}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-sm"
              >
                상담 신청 <ArrowRight size={15} />
              </Link>
              <a
                href={KAKAO_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 text-white font-medium px-7 py-3.5 rounded-xl transition-colors text-sm"
              >
                카카오톡 문의
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
