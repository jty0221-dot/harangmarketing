import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import FaqAccordion from "../../components/FaqAccordion";
import JsonLd from "../../components/JsonLd";
import { SITE, ORG_ID, LOCAL_ID, faqLd, breadcrumbLd, webPageLd } from "../../lib/seo";
import {
  ArrowRight, ArrowLeft, MessageCircle, Phone, CheckCircle2, Check,
  Layers, Clock3, Wallet, FileText, Send, LinkIcon, ClipboardList,
  Images, TrendingUp, ShieldCheck, ChevronDown,
} from "lucide-react";
import {
  CAMPAIGN, REWARD_WITH_COPY, REWARD_WITHOUT_COPY, PRICE_NOTE,
  WHY_CAFE, PROCESS_STEPS, CAFE_FAQ, REF_CATEGORIES, REF_TOTAL, won,
  type RewardPlan,
} from "../../lib/cafe-distribution";

/** WHY_CAFE 항목 순서에 맞춘 아이콘 */
const WHY_ICONS = [Layers, Clock3, Wallet];
/** PROCESS_STEPS 순서에 맞춘 아이콘 */
const STEP_ICONS = [MessageCircle, FileText, Send, LinkIcon];

const PATH = "/services/cafe-distribution";
const URL = `${SITE.base}${PATH}`;

/* 가격은 부가세 별도 표기값을 그대로 싣는다.
   AI 답변 엔진이 "카페 배포 얼마"에 정확한 구간으로 답하게 하는 것이 목적. */
const cheapest = REWARD_WITHOUT_COPY[0];
const priciest = REWARD_WITH_COPY[REWARD_WITH_COPY.length - 1];

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "블로그 배포 (최적화·카페)",
    alternateName: ["카페 배포", "최적화 블로그 배포", "최블 카페 배포"],
    serviceType: "네이버 카페·블로그 배포 대행",
    provider: { "@id": LOCAL_ID },
    brand: { "@id": ORG_ID },
    url: URL,
    inLanguage: "ko-KR",
    description:
      "네이버 최적화 블로그 배포와 카페 배포를 함께 진행해 블로그 탭과 카페 탭에 동시 노출시키는 서비스입니다. 업종·지역·목표 키워드에 맞는 카페에 순차 게시하고 전체 게시 URL을 정리해 전달합니다.",
    areaServed: { "@type": "Country", name: "대한민국" },
    serviceOutput: {
      "@type": "Thing",
      name: "카페 상위노출 실적",
      description: `9개 업종 ${REF_TOTAL}개 키워드의 네이버 모바일 통합검색 카페 영역 노출 실사 캡처를 레퍼런스로 공개합니다.`,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KRW",
      lowPrice: cheapest.eventPrice,
      highPrice: priciest.eventPrice,
      offerCount: REWARD_WITH_COPY.length + REWARD_WITHOUT_COPY.length,
      description: "표기 금액은 부가세 별도입니다.",
      offers: [
        ...REWARD_WITH_COPY.map((p) => ({
          "@type": "Offer",
          name: `${p.base} + ${p.bonus} (원고 작성 포함)`,
          price: p.eventPrice,
          priceCurrency: "KRW",
          description: `${p.totalCount}, 1건당 ${p.unitPrice.toLocaleString("ko-KR")}원. 정상가 ${p.listPrice.toLocaleString("ko-KR")}원.`,
          availability: "https://schema.org/LimitedAvailability",
        })),
        ...REWARD_WITHOUT_COPY.map((p) => ({
          "@type": "Offer",
          name: `${p.base} + ${p.bonus} (원고 미포함)`,
          price: p.eventPrice,
          priceCurrency: "KRW",
          description: `${p.totalCount}, 1건당 ${p.unitPrice.toLocaleString("ko-KR")}원. 원고를 직접 제공하는 경우.`,
          availability: "https://schema.org/LimitedAvailability",
        })),
      ],
    },
  },
  webPageLd({
    path: PATH,
    name: "블로그 배포 (최적화·카페) — 하랑마케팅",
    description:
      "블로그 탭과 카페 탭에 동시 노출하는 배포 상품. 구성별 가격과 업종별 실사 레퍼런스를 공개합니다.",
  }),
  // 아래 FaqAccordion 으로 화면에 렌더링되는 항목과 동일 (짝을 유지할 것)
  faqLd(CAFE_FAQ, URL),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "블로그 배포 (최적화·카페)", path: PATH },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${URL}#reference-categories`,
    name: "카페 상위노출 레퍼런스 업종",
    numberOfItems: REF_CATEGORIES.length,
    itemListElement: REF_CATEGORIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      description: `${c.keywords.length}개 키워드 카페 영역 노출 실사 캡처`,
      url: `${URL}/reference?category=${c.slug}`,
    })),
  },
];

/* ─── 원고 포함 플랜 카드 (강조 카드 지원) ─── */
function PlanCard({ p }: { p: RewardPlan }) {
  return (
    <div
      className={`relative rounded-2xl bg-white p-4 md:p-6 ${
        p.featured ? "shadow-md ring-2 ring-blue-600" : "shadow-sm"
      }`}
      style={{ border: p.featured ? "none" : "1px solid var(--h-border)" }}
    >
      {p.featured && (
        <span className="absolute -top-3 left-4 md:left-6 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-black text-white shadow-sm">
          <TrendingUp size={11} strokeWidth={2.5} />
          가장 많이 선택
        </span>
      )}

      {/* 구성 */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pt-1">
        <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-black text-blue-700">
          {p.base}
        </span>
        <span className="text-sm font-bold text-gray-400">+</span>
        <span className="text-sm md:text-base font-bold" style={{ color: "var(--h-dark)" }}>
          {p.bonus}
        </span>
        {p.discount && (
          <span className="ml-auto inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-black text-red-600">
            {p.discount}% OFF
          </span>
        )}
      </div>

      {/* 가격 */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4"
        style={{ borderTop: "1px solid var(--h-border)" }}
      >
        <div>
          <div className="text-[11px] mb-0.5" style={{ color: "var(--h-muted)" }}>정상가</div>
          <div className="text-sm line-through" style={{ color: "#a2aabd" }}>{won(p.listPrice)}</div>
        </div>
        <div>
          <div className="text-[11px] mb-0.5" style={{ color: "var(--h-muted)" }}>이벤트가</div>
          <div className="text-lg md:text-2xl font-black tabular-nums" style={{ color: "var(--h-dark)" }}>
            {won(p.eventPrice)}
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 sm:text-right">
          <div className="text-[11px] mb-0.5" style={{ color: "var(--h-muted)" }}>
            {p.totalCount} · 1건당
          </div>
          <div className="text-base md:text-xl font-black tabular-nums text-blue-700">
            {won(p.unitPrice)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CafeDistributionPage() {
  return (
    <>
      <JsonLd data={LD} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">

        {/* ══ Hero ══ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 py-14 md:py-20">
          <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            {/* -my-2 py-2 로 시각적 여백은 유지하면서 터치 영역만 44px 로 넓힌다 */}
            <Link
              href="/services"
              className="-my-2 mb-4 inline-flex items-center gap-1.5 py-2 text-xs text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={13} /> 서비스 전체
            </Link>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-black text-white mb-5">
              <Images size={11} strokeWidth={2.5} />
              카페 배포 상품 OPEN
            </span>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">
              블로그 배포에<br />
              <span className="text-blue-400">카페 배포</span>를 더합니다
            </h1>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mb-6">
              같은 키워드를 검색해도 블로그 탭에서 멈추는 사람과 카페 탭까지 넘어가는 사람이 나뉩니다.
              두 영역에 함께 노출해 고객이 들어올 길을 넓힙니다.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {["최블 · 올인원 대량 진행건 기준", "카페 배포 최대 20건 추가 제공"].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-400/30 bg-white/5 px-3 py-1.5 text-xs font-semibold text-blue-100"
                >
                  <Check size={11} strokeWidth={3} />
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact?service=cafe-distribution"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-900/30 transition-colors hover:bg-blue-500"
              >
                이벤트 참여 문의 <ArrowRight size={15} />
              </Link>
              <a
                href="https://pf.kakao.com/_MuUkG/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-sm font-black text-gray-900 transition-colors hover:bg-yellow-300"
              >
                <MessageCircle size={15} /> 카카오로 먼저 물어보기
              </a>
            </div>

            <p className="mt-5 text-[11px] leading-relaxed text-gray-500">
              본 이벤트는 최블 · 올인원 상품 10건 · 20건 · 30건 진행 시 적용됩니다.
            </p>
          </div>
        </section>

        {/* ══ 캠페인 지표 — 실제 운영값을 관리할 때만 노출 (lib/cafe-distribution.ts) ══ */}
        {CAMPAIGN.showCampaignBar && (
          <section className="bg-gray-950 py-6 md:py-8">
            <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
              <dl className="grid grid-cols-3 gap-3 md:gap-6 mb-4">
                {[
                  { label: "참여 마감", value: CAMPAIGN.deadlineLabel, accent: true },
                  { label: "이번 회차 잔여", value: `${CAMPAIGN.remainingSlots} 슬롯` },
                  { label: "누적 진행", value: `${CAMPAIGN.cumulativeCount} 건` },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <dt className="text-[11px] md:text-xs mb-1 text-gray-500">{m.label}</dt>
                    <dd className={`text-lg md:text-2xl font-black tabular-nums ${m.accent ? "text-blue-400" : "text-white"}`}>
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                  style={{ width: `${CAMPAIGN.allocationRate}%` }}
                />
              </div>
              <p className="mt-2 text-center text-[11px] text-gray-500">
                이번 회차 배정률 {CAMPAIGN.allocationRate}% · 마감 시 다음 회차 대기
              </p>
            </div>
          </section>
        )}

        {/* ══ AEO — 한 줄 정답 ══ */}
        <AnswerBlock
          question="카페 배포란 무엇이고 비용은 얼마인가요?"
          answer="카페 배포는 네이버 카페 게시글로 목표 키워드의 카페 탭 영역에 노출시키는 배포 서비스입니다. 하랑마케팅은 최적화 블로그 배포(최블)와 카페 배포를 묶어 진행하며, 최블 10건에 카페 배포 5건, 20건에 10건, 30건에 20건을 추가 제공합니다. 원고 작성 포함 기준 총 50건 1,715,000원(1건당 34,300원), 원고를 직접 제공하면 총 50건 1,430,000원(1건당 28,600원)이며 모두 부가세 별도입니다. 진행 후 전체 게시 URL을 정리해 전달합니다."
          facts={[
            { label: "1건당 최저", value: "28,600원" },
            { label: "최대 추가 제공", value: "카페 20건" },
            { label: "레퍼런스", value: `${REF_TOTAL}개 키워드` },
            { label: "결과 보고", value: "게시 URL 전달" },
          ]}
        />

        {/* ══ WHY CAFE ══ */}
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">Why Cafe</p>
            <h2
              className="text-2xl md:text-4xl font-black leading-snug mb-4"
              style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}
            >
              소비자의 검색은<br />블로그 한 곳에서 끝나지 않습니다
            </h2>
            <p className="text-sm md:text-base leading-relaxed mb-8" style={{ color: "var(--h-muted)" }}>
              카페 탭은 실사용자의 후기가 모이는 영역으로 인식됩니다.
              여기에서 한 번 더 언급되는 것과 그렇지 않은 것의 신뢰 차이가 큽니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {WHY_CAFE.map((w, i) => {
                const Icon = WHY_ICONS[i];
                return (
                  <div
                    key={w.no}
                    className="rounded-2xl p-4 md:p-6 shadow-sm"
                    style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-sm ring-1 ring-blue-800/20">
                      <Icon size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="text-xl font-black text-blue-700 tabular-nums mb-1">{w.no}</div>
                    <h3 className="text-base font-bold mb-1.5" style={{ color: "var(--h-dark)" }}>{w.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--h-muted)" }}>{w.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ REWARD 01 · 02 ══ */}
        <section className="py-12 md:py-16" style={{ background: "var(--h-surface)" }}>
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            {/* REWARD 01 */}
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">Reward 01</p>
            <h2
              className="text-2xl md:text-3xl font-black mb-2"
              style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}
            >
              원고 작성 포함
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--h-muted)" }}>
              키워드 분석부터 원고 작성, 카페 게시까지 전부 하랑마케팅이 진행합니다.
            </p>

            <div className="space-y-4 md:space-y-5">
              {REWARD_WITH_COPY.map((p) => <PlanCard key={p.base} p={p} />)}
            </div>

            {/* REWARD 02 */}
            <div className="mt-12 md:mt-16">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">Reward 02</p>
              <h2
                className="text-2xl md:text-3xl font-black mb-2"
                style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}
              >
                원고 작성 미포함
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--h-muted)" }}>
                원고를 직접 제공하시는 경우 아래 단가가 적용됩니다. 카페별 게시 형식 편집은 하랑마케팅이 처리합니다.
              </p>

              <div className="space-y-3">
                {REWARD_WITHOUT_COPY.map((p) => (
                  <div
                    key={p.base}
                    className="rounded-2xl bg-white p-4 md:px-6 shadow-sm"
                    style={{ border: "1px solid var(--h-border)" }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-3 sm:items-center">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-black"
                          style={{ background: "var(--h-surface)", color: "#3c4459" }}>
                          {p.base}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: "var(--h-dark)" }}>
                          + {p.bonus}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:justify-end">
                        <span className="text-xs line-through" style={{ color: "#a2aabd" }}>{won(p.listPrice)}</span>
                        <span className="text-base md:text-lg font-black tabular-nums" style={{ color: "var(--h-dark)" }}>
                          {won(p.eventPrice)}
                        </span>
                        <span className="text-xs font-bold text-blue-700 tabular-nums">
                          1건당 {won(p.unitPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ul className="mt-6 space-y-1">
              {PRICE_NOTE.map((n) => (
                <li key={n} className="flex items-start gap-1.5 text-[12px]" style={{ color: "#8c95ab" }}>
                  <span aria-hidden="true">·</span>{n}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══ PROCESS ══ */}
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">Process</p>
            <h2
              className="text-2xl md:text-3xl font-black mb-8"
              style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}
            >
              신청부터 보고까지 4단계
            </h2>

            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {PROCESS_STEPS.map((s, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <li
                    key={s.no}
                    className="rounded-2xl p-4 md:p-5 shadow-sm"
                    style={{ background: "white", border: "1px solid var(--h-border)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white tabular-nums">
                        {s.no}
                      </span>
                      <Icon size={15} className="text-blue-600" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-sm md:text-base font-bold mb-1" style={{ color: "var(--h-dark)" }}>{s.title}</h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--h-muted)" }}>{s.desc}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ══ 레퍼런스 안내 ══ */}
        <section className="py-12 md:py-16" style={{ background: "var(--h-surface)" }}>
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div
              className="rounded-2xl bg-white p-5 md:p-8 shadow-sm"
              style={{ border: "1px solid var(--h-border)" }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm ring-1 ring-blue-700/20">
                  <ClipboardList size={16} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h2
                    className="text-xl md:text-2xl font-black mb-1"
                    style={{ color: "var(--h-dark)", letterSpacing: "-0.02em" }}
                  >
                    실제 노출 화면을 그대로 공개합니다
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--h-muted)" }}>
                    9개 업종 {REF_TOTAL}개 키워드의 네이버 모바일 통합검색 카페 영역 노출 캡처입니다.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {REF_CATEGORIES.map((c) => (
                  <span
                    key={c.slug}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold"
                    style={{ background: "var(--h-surface)", color: "#3c4459", border: "1px solid var(--h-border)" }}
                  >
                    {c.label}
                    <span className="tabular-nums text-blue-700">{c.keywords.length}</span>
                  </span>
                ))}
              </div>

              <Link
                href="/services/cafe-distribution/reference"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white transition-colors hover:bg-blue-700 sm:w-auto"
              >
                업종별 레퍼런스 전체 보기 <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ FAQ — layout.tsx 의 faqLd(CAFE_FAQ) 와 짝 ══ */}
        <FaqAccordion
          items={CAFE_FAQ}
          title="카페 배포, 이런 점이 궁금하실 겁니다"
          subtitle="상담 전에 가장 많이 받는 질문을 정리했습니다."
        />

        {/* ══ 최종 CTA ══ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 py-14 md:py-20">
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/40">
              <CheckCircle2 size={22} className="text-white" strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4">
              카페 + 블로그 동시 노출로<br />
              <span className="text-blue-400">검색 노출 구조를 넓혀보세요</span>
            </h2>

            <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-8">
              진행 전 상담을 통해 업종별 가능 여부를 확인해 드립니다. 상담 비용은 0원입니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                href="/contact?service=cafe-distribution"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-black text-white shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
              >
                이벤트 참여 문의 <ArrowRight size={16} />
              </Link>
              <a
                href="https://pf.kakao.com/_MuUkG/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 text-base font-bold text-gray-900 transition-colors hover:bg-yellow-300"
              >
                <MessageCircle size={16} /> 카카오톡 상담
              </a>
              <a
                href="tel:010-7541-9054"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-4 text-base font-medium text-white transition-colors hover:border-white/30"
              >
                <Phone size={16} /> 010-7541-9054
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {[
                { icon: ShieldCheck, text: "상담 비용 0원" },
                { icon: LinkIcon, text: "게시 URL 전체 전달" },
                { icon: ChevronDown, text: "부가세 별도 표기" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Icon size={12} className="text-blue-500" strokeWidth={2} />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
