import Link from "next/link";
import {
  MapPin, Megaphone, ListOrdered, Store, Navigation, Layers, Camera,
  ClipboardList, Target, SlidersHorizontal, Search, BarChart3, TrendingUp,
  LineChart, Ban, ShieldCheck, Phone, ArrowRight, Eye, Route,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import FaqAccordion from "../../components/FaqAccordion";
import JsonLd from "../../components/JsonLd";
import PlaceRankCasesSection from "../../components/PlaceRankCases";
import {
  SITE, ORG_ID, LOCAL_ID, faqLd, breadcrumbLd, webPageLd, howToLd, type FaqItem,
} from "../../lib/seo";
import {
  RECORDS, SUMMARY, EXCLUDED_COUNT, SNAPSHOT_DATE, BIGGEST_GAIN,
  gap, fmt, MEASURE_NOTE, PAGE1_NOTE,
} from "../../lib/rank-records";
import {
  byCode, PLACE_RANK_GENERATED, PLACE_RANK_TOTALS,
} from "../../lib/place-rank-cases";

/**
 * 네이버 플레이스 랜딩.
 *
 * 왜 만들었나 (H-0118 1번) — 광고 키워드 실측에서 플레이스 계열 월 검색량이
 * 30,000 인데 착지할 페이지가 없었다. 플레이스는 app/services/page.tsx 의
 * 서비스 카드 한 칸(id: "place")으로만 존재했다.
 *
 * 검색 의도를 갈랐다 — '네이버플레이스등록' 18,410 은 사장님이 직접 하려고
 * 치는 말이지 대행을 찾는 말이 아니다. 그래서 등록 절차를 그대로 알려 주고
 * 거기서 다음 층(순위)으로 넘긴다. 등록을 대행 상품으로 팔지 않는다.
 *
 * 숫자는 손으로 적지 않는다. 순위 기록과 집계는 전부 app/lib/rank-records.ts
 * 에서 계산해 쓴다 (그 파일 헤더의 5규칙이 이 페이지에도 그대로 걸린다).
 *
 * 가격은 넣지 않는다. /services#pricing 한 곳에만 둔다. 같은 숫자를 두 곳에
 * 적으면 갈린다. 새 가격 표기는 결재 사항이다 (헌장 C-35).
 *
 * app/services/page.tsx 의 result 문구('평균 4주 내 Top 5 진입')는 여기서
 * 반복하지 않는다. MEASURE_NOTE 와 어긋나는 성과 확약에 가깝다.
 */

const PATH = "/services/place";
const URL = `${SITE.base}${PATH}`;
const CTA_HREF = "/contact?service=place";
const KAKAO_HREF = SITE.kakaoChat;

/* 집계 — 손으로 적지 않는다. RECORDS 를 다시 세어서 쓴다. */
const TOP_RECORDS = [...RECORDS].sort((a, b) => gap(b) - gap(a)).slice(0, 6);
const FASTEST = RECORDS.reduce((a, b) => (b.days < a.days ? b : a));
const INDUSTRY_COUNT = new Set(RECORDS.map((r) => r.industry)).size;
const EXCLUDED_TOTAL =
  EXCLUDED_COUNT.declined + EXCLUDED_COUNT.outsidePage1 + EXCLUDED_COUNT.insufficient;

/* 1페이지에 있는 자리는 두 종류다. 이 구분이 이 페이지의 뼈대다. */
const PAGE1_SLOTS = [
  {
    icon: Megaphone,
    label: "광고 지면 3자리",
    body: "돈을 내면 올라가는 자리입니다. 클릭당 비용이 네이버로 나가고, 예산을 멈추면 그날 내려옵니다. 광고비는 저희에게 주는 것이 아니라 네이버에 주는 것입니다.",
  },
  {
    icon: ListOrdered,
    label: "순위 1위부터 5위",
    body: "돈으로 살 수 없는 자리입니다. 정보 완성도, 키워드, 사진, 리뷰, 소식이 쌓여서 정해집니다. 올라가는 데 시간이 걸리고 대신 예산을 멈춰도 바로 내려오지 않습니다.",
  },
];

/* 등록 5단계 — 무료로 그대로 알려 준다. HowTo 구조화 데이터의 원천이다. */
const REGISTER_STEPS = [
  {
    icon: Store,
    name: "스마트플레이스에 사업자 정보로 가입합니다",
    text: "네이버 스마트플레이스에 접속해 사업자등록증 정보로 업체를 신규 등록합니다. 사업자등록번호와 대표자명이 등록증과 한 글자도 다르면 심사에서 막힙니다.",
  },
  {
    icon: Navigation,
    name: "주소와 전화번호, 영업시간을 정확히 넣습니다",
    text: "도로명 주소와 상세 주소를 지도상 실제 위치에 맞춥니다. 전화번호는 실제로 받는 번호여야 하고, 영업시간과 휴무일은 브레이크타임까지 적습니다.",
  },
  {
    icon: Layers,
    name: "업종 카테고리를 고릅니다",
    text: "고객이 어떤 검색어로 들어올지가 여기서 갈립니다. 카페인지 디저트카페인지, 정형외과인지 통증의학과인지에 따라 노출되는 검색어가 달라집니다.",
  },
  {
    icon: Camera,
    name: "대표 사진과 메뉴, 가격을 올립니다",
    text: "대표 사진 한 장이 검색 결과 목록에 그대로 나옵니다. 메뉴와 가격은 최신 메뉴판 기준으로만 넣습니다. 지난 행사가를 올려 두면 방문한 손님과 다투게 됩니다.",
  },
  {
    icon: ClipboardList,
    name: "네이버 심사를 기다립니다",
    text: "제출하면 영업일 기준 며칠 안에 승인됩니다. 여기까지가 등록이고 비용은 0원입니다. 사장님이 직접 하실 수 있습니다.",
  },
];

/* 등록 다음에 하는 일 — 상품 정의는 app/services/page.tsx 의 place features 를 따른다. */
const WORK = [
  {
    icon: SlidersHorizontal,
    title: "정보 완성도를 채웁니다",
    body: "비어 있는 칸이 있으면 그만큼 밀립니다. 상세설명, 찾아오는 길, 편의시설, 예약, 주차 정보를 글자 수 상한 안에서 다 채웁니다.",
  },
  {
    icon: Target,
    title: "키워드를 골라 넣습니다",
    body: "지역, 업종, 특징을 조합해 20개 이상을 잡습니다. 검색량이 큰 말만 고르지 않습니다. 이길 수 있는 말부터 잡아 자리를 만들고 거기서 큰 말로 올라갑니다.",
  },
  {
    icon: Search,
    title: "위에 있는 가게를 뜯어봅니다",
    body: "1위부터 5위가 무엇을 채웠고 무엇을 안 채웠는지 봅니다. 같은 것을 따라 하면 뒤에 서게 되므로, 그 가게에 없는 칸을 찾아 우리 쪽을 채웁니다.",
  },
  {
    icon: Camera,
    title: "사진 구성을 잡아 드립니다",
    body: "무엇을 어떤 순서로 몇 장 찍어야 하는지 목록으로 드립니다. 카카오톡으로 받은 압축본은 쓰지 않습니다. 원본을 주시면 보정해서 올립니다.",
  },
  {
    icon: BarChart3,
    title: "매일 순위를 재서 조정합니다",
    body: "밀린 날이 있으면 무엇이 바뀌었는지 그날 안에 찾습니다. 매일 저장한 스냅샷이 있어야 되돌릴 수 있습니다. 안 재면 밀린 것도 모릅니다.",
  },
];

/* 하지 않는 것 — 걸리면 계정이 죽는다. 죽으면 되돌릴 방법이 없다. */
const NEVER = [
  {
    title: "순위를 보장하지 않습니다",
    body: "몇 위까지 올려 드린다는 말을 계약서에도 화면에도 쓰지 않습니다. 경쟁 매장이 무엇을 하는지, 네이버가 기준을 언제 바꾸는지는 저희가 정하지 못합니다.",
  },
  {
    title: "저장과 리뷰를 사지 않습니다",
    body: "저장수, 리뷰, 트래픽을 돈으로 사는 업체가 있습니다. 걸리면 노출이 아니라 계정이 내려갑니다. 사장님 사업자로 만든 계정이라 되돌릴 방법이 없습니다.",
  },
  {
    title: "광고 자리를 순위라고 부르지 않습니다",
    body: "광고를 켜 놓고 1페이지에 올랐다고 말씀드리지 않습니다. 광고 지면 3자리와 순위 1위부터 5위는 다른 자리이고, 보고드릴 때 그 둘을 나눠서 씁니다.",
  },
  {
    title: "방문객과 매출을 숫자로 약속하지 않습니다",
    body: "순위는 저희가 매일 재는 값이라 근거를 댈 수 있지만, 방문객과 매출은 저희 계측 대상이 아닙니다. 재지 않은 숫자는 말씀드리지 않습니다.",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "네이버 플레이스 등록은 대행을 맡겨야 하나요?",
    a: "아닙니다. 등록은 무료이고 사장님이 직접 하실 수 있습니다. 스마트플레이스에 사업자 정보로 가입해 주소, 전화번호, 영업시간, 카테고리, 사진을 넣고 심사를 기다리면 됩니다. 저희가 하는 일은 그다음입니다. 등록만으로는 지도에 뜨기만 하고 위에 뜨지는 않습니다.",
  },
  {
    q: "플레이스 상위노출과 플레이스 광고는 뭐가 다른가요?",
    a: "1페이지에 있는 자리가 두 종류입니다. 광고 지면 3자리는 클릭당 비용을 네이버에 내고 사는 자리라 예산을 멈추면 그날 내려옵니다. 순위 1위부터 5위는 돈으로 살 수 없고 정보 완성도, 키워드, 사진, 리뷰가 쌓여서 정해집니다. 올라가는 데 시간이 걸리는 대신 예산을 멈춰도 바로 내려오지 않습니다. 저희는 두 자리를 나눠서 보고드립니다.",
  },
  {
    q: "얼마나 걸리나요?",
    a: `업종과 지역 경쟁 강도에 따라 다릅니다. 저희가 매일 잰 기록으로 말씀드리면, 지금까지 1페이지에 올라온 기록 중 가장 빨랐던 건은 ${FASTEST.industry} 업종의 ${fmt(FASTEST)} 로 ${FASTEST.days}일이 걸렸습니다. 반대로 32일을 계측하고도 몇 계단만 움직인 기록도 있습니다. 상담 때 지금 몇 위인지부터 재 보고 대략의 기간을 말씀드립니다.`,
  },
  {
    q: "순위를 보장해 주시나요?",
    a: "보장하지 않습니다. 몇 위까지 올려 드린다는 말을 계약서에도 화면에도 쓰지 않습니다. 경쟁 매장이 무엇을 하는지, 네이버가 기준을 언제 바꾸는지는 저희가 정하지 못하기 때문입니다. 대신 매일 순위를 저장해서 밀린 날에 무엇이 바뀌었는지 그날 안에 찾습니다.",
  },
  {
    q: "저장수나 리뷰를 늘려 주는 곳도 있던데요.",
    a: "저희는 하지 않습니다. 저장수, 리뷰, 트래픽을 돈으로 사면 걸렸을 때 노출이 아니라 계정이 내려갑니다. 사장님 사업자로 만든 계정이라 되돌릴 방법이 없습니다. 리뷰는 실제로 오신 손님이 남기시게 만드는 쪽으로 설계합니다.",
  },
  {
    q: "지금 순위가 몇 위인지 먼저 알 수 있을까요?",
    a: "네. 상담 비용은 0원이고 지금 몇 위인지부터 재 드립니다. 매장명과 지역, 노리는 검색어를 알려 주시면 현재 위치와 위에 있는 가게가 무엇을 채웠는지 정리해서 드립니다. 그걸 보고 진행 여부를 정하시면 됩니다.",
  },
];

const LD = [
  webPageLd({
    path: PATH,
    name: "네이버 플레이스 상위노출 · 지도 등록 대행",
    description:
      "네이버 지도 등록은 무료이고 사장님이 직접 하실 수 있습니다. 저희는 그다음을 합니다. 키워드를 골라 넣고 매일 순위를 재서 밀린 자리를 되찾습니다.",
    dateModified: SNAPSHOT_DATE,
  }),
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "네이버 플레이스 상위노출 대행",
    description:
      "네이버 스마트플레이스 정보 최적화, 지역·업종 키워드 세팅, 경쟁 매장 분석, 사진 구성 가이드, 매일 순위 계측과 조정. 순위는 매일 저장한 스냅샷 실측값으로만 보고하고 보장하지 않습니다.",
    serviceType: "네이버 플레이스 검색 최적화",
    provider: { "@id": ORG_ID },
    areaServed: "대한민국",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: URL,
      servicePhone: SITE.phoneIntl,
      serviceLocation: { "@id": LOCAL_ID },
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "KRW",
      url: `${SITE.base}/services#pricing`,
      description: "상담과 진단 비용 0원. 업종과 진행 범위에 따라 견적을 드립니다.",
    },
  },
  howToLd({
    path: PATH,
    name: "네이버 플레이스(스마트플레이스) 등록하는 법",
    description:
      "네이버 지도에 가게를 올리는 절차입니다. 등록 자체는 무료이고 사장님이 직접 하실 수 있습니다.",
    totalTime: "PT40M",
    steps: REGISTER_STEPS.map((s) => ({ name: s.name, text: s.text })),
  }),
  faqLd(FAQS, URL),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "네이버 플레이스", path: PATH },
  ]),
];

export default function PlaceServicePage() {
  return (
    <>
      <JsonLd data={LD} />
      <Header />

      <main>
        {/* 히어로 */}
        <section className="bg-gray-950 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 mb-6">
              <MapPin size={14} className="text-blue-400" strokeWidth={2.5} />
              <span className="text-xs md:text-[13px] font-semibold text-blue-200">
                네이버 플레이스 · 지도 검색
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white leading-snug tracking-tight">
              지도에 뜨는 것과 위에 뜨는 것은
              <br />
              다른 일입니다
            </h1>

            <p className="speakable mt-5 text-sm md:text-base leading-relaxed text-gray-300 max-w-2xl">
              네이버 지도에 가게를 등록하는 것까지는 무료이고 사장님이 직접 하실 수 있습니다.
              아래에 절차를 그대로 적어 두었습니다. 저희가 하는 일은 그다음입니다.
              키워드를 골라 넣고 매일 순위를 재서 밀린 자리를 되찾습니다.
              순위는 매일 저장한 스냅샷 실측값으로만 말씀드리고 보장하지 않습니다.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href={CTA_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 md:px-6 md:py-3.5 text-sm md:text-[15px] font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                지금 순위 무료로 재보기
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <a
                href={KAKAO_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 md:px-6 md:py-3.5 text-sm md:text-[15px] font-bold text-white hover:bg-white/15 transition-colors"
              >
                카카오톡으로 물어보기
              </a>
            </div>
          </div>
        </section>

        <AnswerBlock
          question="네이버 플레이스 상위노출, 대행을 맡겨야 하나요?"
          answer="지도에 올리는 등록은 무료라 직접 하시면 됩니다. 대행이 필요한 지점은 그다음입니다. 1페이지에는 광고 지면 3자리와 순위 1위부터 5위가 있는데, 광고는 예산을 멈추면 그날 내려오고 순위는 정보 완성도·키워드·사진·리뷰가 쌓여야 올라갑니다. 하랑마케팅은 순위를 매일 재서 밀린 자리를 되찾는 일을 합니다. 순위는 보장하지 않고 매일 저장한 실측값으로만 보고합니다. 상담 비용은 0원입니다."
          facts={[
            { label: "등록 비용", value: "0원 · 직접 가능" },
            { label: "매일 계측 중", value: `매장 ${SUMMARY.stores}곳 · 키워드 ${SUMMARY.keywords}개` },
            { label: "상담", value: "0원" },
          ]}
        />

        {/* 1페이지에 있는 자리는 두 종류다 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center shrink-0">
                <Eye size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight pt-1">
                1페이지에 있는 자리는 두 종류입니다
              </h2>
            </div>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 mb-8">
              이 둘을 섞어서 말하는 곳이 많습니다. 광고를 켜 두고 1페이지에 올랐다고 하면
              예산을 멈춘 다음 달에 왜 사라졌는지 설명할 방법이 없습니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAGE1_SLOTS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center shrink-0">
                      <s.icon size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900">{s.label}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{s.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-xs md:text-[13px] leading-relaxed text-gray-600">
              {PAGE1_NOTE}
            </p>
          </div>
        </section>

        {/* 등록은 직접 하셔도 됩니다 */}
        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gray-900 shadow-sm flex items-center justify-center shrink-0">
                <Route size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight pt-1">
                등록은 직접 하셔도 됩니다
              </h2>
            </div>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 mb-8">
              절차를 그대로 적어 두었습니다. 비용은 0원이고 40분이면 끝납니다.
              이걸 대행비를 받고 해 드리는 곳이 있는데, 저희는 여기에 값을 매기지 않습니다.
            </p>

            <ol className="space-y-3">
              {REGISTER_STEPS.map((s, i) => (
                <li
                  key={s.name}
                  id={`step-${i + 1}`}
                  className="scroll-mt-20 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-gray-900 shadow-sm flex items-center justify-center shrink-0">
                      <s.icon size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 mb-1.5">
                        <span className="text-xs font-black text-blue-600 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-base md:text-lg font-bold text-gray-900">{s.name}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">{s.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-2xl bg-gray-900 p-5 md:p-6">
              <p className="text-sm md:text-[15px] leading-relaxed text-gray-200">
                여기까지 하시면 네이버 지도에 가게가 뜹니다.
                <span className="font-semibold text-white"> 다만 위에 뜨지는 않습니다.</span>
                {" "}가게 이름을 그대로 치면 나오는데, 사장님이 원하시는 건
                이름을 모르는 손님이 지역과 업종으로 검색했을 때 나오는 것일 겁니다.
                그건 다음 층의 일입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 등록 다음에 하는 일 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight pt-1">
                등록 다음에 하는 일
              </h2>
            </div>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 mb-8">
              다섯 가지입니다. 하나씩 채우면 자리가 조금씩 올라가고,
              올라간 자리는 매일 재서 지킵니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WORK.map((w) => (
                <div
                  key={w.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center shrink-0">
                      <w.icon size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900">{w.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{w.body}</p>
                </div>
              ))}

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 md:p-6 flex flex-col justify-center">
                <p className="text-sm leading-relaxed text-gray-700">
                  진행 범위와 비용은 업종과 현재 상태에 따라 달라집니다.
                  같은 업종이어도 경쟁 강도가 다르면 해야 할 일이 다릅니다.
                </p>
                <Link
                  href="/services#pricing"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800"
                >
                  비용 기준 보기
                  <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 계측 기록 */}
        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gray-900 shadow-sm flex items-center justify-center shrink-0">
                <TrendingUp size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight pt-1">
                매일 재서 남긴 기록
              </h2>
            </div>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 mb-8">
              {SNAPSHOT_DATE} 스냅샷 기준입니다. 업체명과 지역은 밝히지 않고
              업종과 키워드 유형까지만 적습니다. 퍼센트로 말하지 않고 순위와 일수로만 말합니다.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {[
                { icon: Store, label: "계측 중인 매장", value: `${SUMMARY.stores}곳` },
                { icon: Layers, label: "계측 중인 키워드", value: `${SUMMARY.keywords}개` },
                { icon: ListOrdered, label: "1페이지 유지 키워드", value: `${SUMMARY.page1Keywords}개` },
                { icon: LineChart, label: `스냅샷 ${SUMMARY.snapshots}회 내내 유지`, value: `${SUMMARY.heldAllSnapshots}개` },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-gray-900 shadow-sm flex items-center justify-center mb-3">
                    <s.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-xl md:text-2xl font-black text-gray-900 tabular-nums">{s.value}</div>
                  <div className="text-xs md:text-[13px] text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left font-bold text-gray-700 px-4 py-3">업종</th>
                      <th className="text-left font-bold text-gray-700 px-4 py-3">키워드 유형</th>
                      <th className="text-left font-bold text-gray-700 px-4 py-3">순위 변화</th>
                      <th className="text-left font-bold text-gray-700 px-4 py-3">계측 기간</th>
                      <th className="text-left font-bold text-gray-700 px-4 py-3">1페이지 유지</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_RECORDS.map((r, i) => (
                      <tr key={`${r.industry}-${r.keyword}-${i}`} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{r.industry}</td>
                        <td className="px-4 py-3 text-gray-600">{r.keyword}</td>
                        <td className="px-4 py-3 font-bold text-blue-700 tabular-nums whitespace-nowrap">{fmt(r)}</td>
                        <td className="px-4 py-3 text-gray-600 tabular-nums whitespace-nowrap">{r.days}일</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {r.heldPage1 ? (
                            <span className="inline-flex items-center rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                              유지 중
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">
                              변동 있음
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-xs font-bold text-gray-500 mb-2">가장 많이 올라간 기록</div>
                <div className="text-lg md:text-xl font-black text-gray-900 tabular-nums">
                  {fmt(BIGGEST_GAIN)}
                </div>
                <p className="text-xs md:text-[13px] text-gray-600 mt-2 leading-relaxed">
                  {BIGGEST_GAIN.industry} 업종 · {BIGGEST_GAIN.days}일 계측 · {gap(BIGGEST_GAIN)}계단.
                  1페이지에 올라온 기록 중에서 가장 큰 폭입니다.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-xs font-bold text-gray-500 mb-2">가장 빨랐던 기록</div>
                <div className="text-lg md:text-xl font-black text-gray-900 tabular-nums">
                  {fmt(FASTEST)} · {FASTEST.days}일
                </div>
                <p className="text-xs md:text-[13px] text-gray-600 mt-2 leading-relaxed">
                  {FASTEST.industry} 업종. 같은 기간에 몇 계단만 움직인 기록도 있어서
                  이 속도를 기준으로 말씀드리지 않습니다.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gray-900 p-5 md:p-6">
              <p className="text-sm leading-relaxed text-gray-200">
                <span className="font-semibold text-white">
                  싣지 않은 기록도 {EXCLUDED_TOTAL}건 있습니다.
                </span>
                {" "}순위가 내려간 것 {EXCLUDED_COUNT.declined}건,
                올랐지만 1페이지 밖에 머문 것 {EXCLUDED_COUNT.outsidePage1}건,
                계측을 막 시작해 시작값이 없는 것 {EXCLUDED_COUNT.insufficient}건입니다.
                지우지 않고 남겨 둡니다. 올라간 것만 보여 드리면 이 표를 믿을 이유가 없어집니다.
              </p>
              <p className="text-xs md:text-[13px] leading-relaxed text-gray-400 mt-4">
                {MEASURE_NOTE} 지금까지 {INDUSTRY_COUNT}개 업종에서 계측했습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 매장별 계측 사례 — 위 표는 키워드 단위, 여기는 매장 단위다.
            숫자는 app/lib/place-rank-cases.ts 한 곳에서만 온다 */}
        <PlaceRankCasesSection
          cases={byCode("HC-03", "HC-04", "HC-01", "HC-02")}
          eyebrow="Place Rank"
          title="매장 한 곳에서 무엇이 움직였나"
          description={`${PLACE_RANK_GENERATED} 기준 ${PLACE_RANK_TOTALS.stores}곳 ${PLACE_RANK_TOTALS.keywords}개 키워드 가운데 네 곳입니다. 한 매장에서 키워드 여러 개를 함께 재면 어떻게 되는지 그대로 폈습니다.`}
          cta={{ href: "/cases/place-rank", label: "계측 사례 전체 보기" }}
          showAllKeywords
          background="bg-white"
        />

        {/* 하지 않는 것 */}
        <section className="py-14 md:py-20 bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 shadow-sm flex items-center justify-center shrink-0">
                <ShieldCheck size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight pt-1">
                하지 않는 것
              </h2>
            </div>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-400 mb-8">
              할 수 있는데 안 하는 것들입니다. 걸리면 노출이 내려가는 게 아니라
              사장님 사업자로 만든 계정이 내려갑니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NEVER.map((n) => (
                <div key={n.title} className="rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 shadow-sm flex items-center justify-center shrink-0">
                      <Ban size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-white">{n.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FaqAccordion
          items={FAQS}
          title="네이버 플레이스, 자주 묻는 질문"
          subtitle="상담 때 가장 많이 나오는 여섯 가지입니다."
          showMoreHref="/faq"
        />

        {/* CTA */}
        <section className="bg-gray-950 py-14 md:py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight">
              지금 몇 위인지부터 재보고 시작합니다
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-gray-300 max-w-2xl mx-auto">
              매장명과 지역, 노리는 검색어를 알려 주시면 현재 위치와
              위에 있는 가게가 무엇을 채웠는지 정리해 드립니다.
              상담 비용은 0원이고, 전화를 받는 사람이 대표입니다.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={CTA_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm md:text-[15px] font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                순위 무료로 재보기
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <a
                href={`tel:${SITE.phone.replace(/-/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm md:text-[15px] font-bold text-white hover:bg-white/15 transition-colors"
              >
                <Phone size={16} strokeWidth={2.5} />
                {SITE.phone}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
