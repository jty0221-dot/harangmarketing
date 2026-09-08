import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import { SITE, ORG_ID, LOCAL_ID, faqLd, breadcrumbLd, webPageLd } from "../../lib/seo";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import {
  PACKAGES,
  PACKAGE_SIZES,
  CAFE_TIERS,
  CAFE_COPY_FEE,
  PRICE_NOTE,
  PRICE_MIN,
  PRICE_MAX,
  packageLabel,
  unitPrice,
  copyDiscount,
  WHY_CAFE,
  PROCESS_STEPS,
  CAFE_FAQ,
  REF_CATEGORIES,
  REF_TOTAL,
  won,
  PROOF_SAMPLES,
  GUARANTEES,
  PRICE_REVISED_AT,
  PRICE_REVISION_REASON,
  WHATS_NEW,
  type CafePackage,
  type CafeTier,
} from "../../lib/cafe-distribution";

/**
 * 최적화 블로그 · 카페 배포 상품 상세페이지
 *
 * design_handoff_cafe_distribution 의 Cafe-Detail-Page 를 그대로 재현한다.
 * - 기준 폭 860px 중앙 정렬 (모바일에서만 폭·패딩 축소)
 * - 색상은 .cafe-dist 스코프의 --cd-* 토큰 = README Design Tokens 원본값
 * - 대형 헤드라인·숫자는 .cd-display / .cd-num (Black Han Sans)
 * 사이트 공통 토큰(--h-*)이나 max-w-4xl 컨테이너로 바꾸지 말 것. 디자인이 무너진다.
 * 2026-09-07 (월) 가격·구성 갱신 — 이벤트·회차·잔여 슬롯 장치를 걷고 10건·30건 패키지 두 가격 체계로 바꿨다.
 * 2026-09-08 (화) 대표 지시 — 히어로 후킹 문장 · 달라진 점(UPDATE) 섹션 · 경쟁 심화 단가 조정 안내 · FAQ 문답을 더했다.
 */

const PATH = "/services/cafe-distribution";
const URL = `${SITE.base}${PATH}`;

const CTA_HREF = "/contact?service=cafe-distribution";
const KAKAO_HREF = "https://pf.kakao.com/_MuUkG/chat";

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "최적화 블로그 · 카페 배포",
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
      description: `${REF_CATEGORIES.length}개 업종 ${REF_TOTAL}개 키워드의 네이버 모바일 통합검색 카페 영역 노출 실사 캡처를 레퍼런스로 공개합니다.`,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KRW",
      lowPrice: PRICE_MIN,
      highPrice: PRICE_MAX,
      offerCount: PACKAGES.length * 2 + CAFE_TIERS.length,
      description: "표기 금액은 부가세 별도입니다.",
      offers: [
        ...PACKAGES.map((p) => ({
          "@type": "Offer",
          name: `${p.size}건 ${p.kind} (${packageLabel(p)}) · 원고 작성 포함`,
          price: p.withCopy,
          priceCurrency: "KRW",
          description: `총 ${p.size}건, 1건당 ${unitPrice(p.withCopy, p.size).toLocaleString("ko-KR")}원. 원고 작성 포함.`,
          availability: "https://schema.org/InStock",
        })),
        ...PACKAGES.map((p) => ({
          "@type": "Offer",
          name: `${p.size}건 ${p.kind} (${packageLabel(p)}) · 원고 직접 제공`,
          price: p.withoutCopy,
          priceCurrency: "KRW",
          description: `총 ${p.size}건, 1건당 ${unitPrice(p.withoutCopy, p.size).toLocaleString("ko-KR")}원. 원고를 직접 제공하는 경우.`,
          availability: "https://schema.org/InStock",
        })),
        ...CAFE_TIERS.map((t) => ({
          "@type": "Offer",
          name: `카페 단건 배포 · ${t.grade}`,
          price: t.price,
          priceCurrency: "KRW",
          description: `${t.desc} 건당 금액, 원고 작성까지 맡기면 ${CAFE_COPY_FEE.toLocaleString("ko-KR")}원 추가.`,
          availability: "https://schema.org/InStock",
        })),
      ],
    },
  },
  webPageLd({
    path: PATH,
    name: "최적화 블로그 · 카페 배포 | 하랑마케팅",
    description:
      "블로그 탭과 카페 탭에 동시 노출하는 배포 상품. 구성별 가격과 업종별 실사 레퍼런스를 공개합니다.",
  }),
  faqLd(CAFE_FAQ, URL),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "최적화 블로그 · 카페 배포", path: PATH },
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

/** 섹션 내부 폭 — 데스크톱 860px 기준, 모바일에서 패딩만 축소 */
const INNER = "mx-auto w-full max-w-[860px] px-5 md:px-[60px]";

/* ─── 패키지 한 줄 — 구성 · 원고 작성 포함 · 원고 직접 제공 · 1건당 ─── */
function PackageRow({ p }: { p: CafePackage }) {
  const unit = unitPrice(p.withCopy, p.size);
  return (
    <div
      className="rounded-[20px] bg-white md:rounded-[16px]"
      style={
        p.featured
          ? { border: "2px solid var(--cd-primary)", boxShadow: "0 14px 34px rgba(22,85,232,.14)" }
          : { border: "1px solid var(--cd-border)" }
      }
    >
      <div className="grid grid-cols-2 items-center gap-x-4 gap-y-4 px-4 py-4 md:grid-cols-[1fr_140px_140px_110px] md:px-7 md:py-5">
        <div className="col-span-2 flex flex-wrap items-center gap-2 md:col-span-1">
          <span
            className="inline-flex items-center justify-center rounded-[10px] px-3 py-1.5 text-[14px] font-black md:text-[15px]"
            style={
              p.featured
                ? { background: "var(--cd-primary)", color: "#fff" }
                : { background: "var(--cd-tint-2)", color: "var(--cd-primary-deep)" }
            }
          >
            {p.kind}
          </span>
          <span className="text-[16px] font-bold md:text-[17px]" style={{ color: "var(--cd-ink-2)" }}>
            {packageLabel(p)}
          </span>
          {p.featured && (
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-black md:text-[12px]"
              style={{ background: "var(--cd-tint-2)", color: "var(--cd-primary)" }}
            >
              먼저 권하는 구성
            </span>
          )}
        </div>
        <div className="md:text-right">
          <div className="mb-1 text-[12px]" style={{ color: "var(--cd-muted-2)" }}>원고 작성 포함</div>
          <div className="cd-num whitespace-nowrap text-[18px] leading-none sm:text-[22px]" style={{ color: "var(--cd-ink-3)" }}>
            {won(p.withCopy)}
          </div>
        </div>
        <div className="md:text-right">
          <div className="mb-1 text-[12px]" style={{ color: "var(--cd-muted-2)" }}>원고 직접 제공</div>
          <div className="cd-num whitespace-nowrap text-[18px] leading-none sm:text-[22px]" style={{ color: "var(--cd-primary-deep)" }}>
            {won(p.withoutCopy)}
          </div>
        </div>
        <div
          className="col-span-2 flex items-baseline justify-between text-[13px] md:col-span-1 md:block md:text-right md:text-[14px]"
          style={{ color: "var(--cd-muted-2)" }}
        >
          <span className="md:hidden">1건당 · 원고 포함 기준</span>
          <span className="font-bold" style={{ color: "var(--cd-body)" }}>{won(unit)}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── 카페 단건 한 줄 — 등급 · 설명 · 건당 ─── */
function CafeTierRow({ t }: { t: CafeTier }) {
  return (
    <div
      className="grid grid-cols-1 items-center gap-3 rounded-[20px] bg-white px-4 py-4 md:grid-cols-[170px_1fr_140px] md:gap-5 md:rounded-[16px] md:px-7 md:py-5"
      style={{ border: "1px solid var(--cd-border)" }}
    >
      <span
        className="inline-flex w-fit items-center justify-center rounded-[10px] px-3 py-1.5 text-[14px] font-black md:text-[15px]"
        style={{ background: "var(--cd-tint-3)", color: "var(--cd-body)" }}
      >
        {t.grade}
      </span>
      <p className="text-[14px] leading-[1.7] md:text-[15px]" style={{ color: "var(--cd-body-2)" }}>
        {t.desc}
      </p>
      <div className="flex items-baseline gap-2 md:justify-end">
        <span className="cd-num whitespace-nowrap text-[20px] leading-none md:text-[22px]" style={{ color: "var(--cd-ink-3)" }}>
          {won(t.price)}
        </span>
        <span className="text-[12px]" style={{ color: "var(--cd-muted-2)" }}>
          건당
        </span>
      </div>
    </div>
  );
}

export default function CafeDistributionPage() {
  return (
    <>
      <JsonLd data={LD} />
      <Header />

      <main className="cafe-dist pt-[104px] md:pt-[108px]" style={{ background: "#fff" }}>

        {/* ══ 1. 히어로 ══ */}
        <section
          className="px-5 py-14 text-center md:px-[60px] md:pb-[90px] md:pt-[70px]"
          style={{ background: "linear-gradient(160deg,#111 0%,#16224a 55%,#0b1226 100%)" }}
        >
          <div className="mx-auto w-full max-w-[860px]">
            <div className="mb-7 flex justify-start">
              <Link
                href="/services"
                className="-my-3 inline-flex min-h-[44px] items-center gap-1.5 py-3 text-xs transition-colors hover:text-white"
                style={{ color: "var(--cd-on-dark-2)" }}
              >
                <ArrowLeft size={13} /> 서비스 전체
              </Link>
            </div>

            <span
              className="inline-block rounded-full px-6 py-2.5 text-[15px] font-black text-white md:px-[34px] md:py-3 md:text-[19px]"
              style={{ background: "var(--cd-primary-lt)" }}
            >
              네이버 최적화 블로그 · 카페 배포
            </span>

            {/* 로고 카드 — 로고가 흰 배경 JPG라 반드시 흰 카드 안에 넣는다 */}
            <div
              className="mx-auto mt-8 flex h-[128px] w-[128px] items-center justify-center rounded-[26px] bg-white md:mt-10 md:h-[172px] md:w-[172px] md:rounded-[34px]"
              style={{ boxShadow: "0 18px 50px rgba(22,85,232,.35)" }}
            >
              <img
                src="/harang-icon.svg"
                alt="하랑마케팅"
                width={132}
                height={132}
                className="h-[96px] w-[96px] object-contain md:h-[132px] md:w-[132px]"
              />
            </div>

            <h1
              className="cd-display mt-8 text-[40px] leading-[1.06] text-white md:mt-10 md:text-[62px]"
              style={{ letterSpacing: "-2px" }}
            >
              최적화 블로그 · 카페 배포
              <br />
              <span style={{ color: "var(--cd-primary-lt3)" }}>발행 뒤 노출 확인까지</span>
            </h1>

            <p className="mx-auto mt-6 max-w-[640px] text-pretty text-[16px] leading-[1.7] md:mt-8 md:text-[19px]" style={{ color: "var(--cd-on-dark-2)" }}>
              블로그 탭에서 멈추는 고객도, 카페 탭까지 넘어가는 고객도 있습니다.{" "}
              <br className="hidden md:block" />
              두 곳 모두에 우리 이야기를 두는 배포입니다.
            </p>

            <div className="mx-auto mt-7 flex max-w-[620px] flex-col gap-3 md:mt-8">
              {["10건 · 30건 패키지 · 원고 포함 / 직접 제공", "발행한 건마다 노출 위치와 게시 URL 보고"].map((t) => (
                <span
                  key={t}
                  className="rounded-full px-5 py-3 text-[15px] font-bold text-white md:px-8 md:py-3.5 md:text-[21px]"
                  style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(127,166,255,.4)" }}
                >
                  {t}
                </span>
              ))}
            </div>

            <p className="mt-6 text-[13px] leading-relaxed md:text-[14px]" style={{ color: "var(--cd-on-dark-2)" }}>
              {PRICE_REVISED_AT} 개정 단가 기준. 표기 금액은 부가세 별도이며, 업종에 따라 진행이 어려운 경우 상담 때 먼저 말씀드립니다.
            </p>
          </div>
        </section>

        {/* ══ 2. 요약 스트립 — 상품의 뼈대 네 가지 ══ */}
        <section
          className="px-5 py-8 md:px-[60px]"
          style={{ background: "var(--cd-dark)", borderTop: "1px solid rgba(255,255,255,.06)" }}
        >
          <div className="mx-auto w-full max-w-[860px]">
            <dl className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
              {[
                { label: "패키지", value: "10건 · 30건" },
                { label: "가격", value: "원고 포함 · 직접 제공" },
                { label: "카페 단건", value: "등급별 건당 단가" },
                { label: "결과", value: "노출 확인 · URL 보고" },
              ].map((m, i) => (
                <div
                  key={m.label}
                  className={`px-2 text-center ${i % 2 === 1 ? "border-l border-white/10" : ""} ${i === 2 ? "md:border-l md:border-white/10" : ""}`}
                >
                  <dt className="mb-1.5 text-[12px] md:text-[13px]" style={{ color: "var(--cd-on-dark-3)" }}>
                    {m.label}
                  </dt>
                  <dd className="text-[15px] font-black text-white md:text-[17px]">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ══ 3. 문제 제기 — 스크롤 서사의 출발점 ══ */}
        <section className="py-14 md:py-[66px]" style={{ background: "var(--cd-dark-2)" }}>
          <div className={INNER}>
            <p className="mb-4 text-[13px] font-bold tracking-[2px] md:text-[14px]" style={{ color: "var(--cd-primary-lt3)" }}>
              PROBLEM
            </p>
            <h2
              className="cd-display text-[28px] leading-[1.25] text-white md:text-[42px]"
              style={{ letterSpacing: "-1.5px" }}
            >
              블로그는 올리고 있는데
              <br />
              왜 문의는 그대로일까요
            </h2>

            <p className="mt-6 text-[16px] leading-[1.8] md:text-[18px]" style={{ color: "var(--cd-on-dark)" }}>
              블로그 탭에서 내 글을 본 사람은 이미 봤습니다.
              문제는 <strong className="font-bold text-white">블로그를 건너뛰고 카페 탭부터 여는 사람들</strong>입니다.
              광고 같지 않은 후기를 찾으려는 사람일수록 그렇습니다. 이쪽에는 우리 이야기가 아예 없습니다.
            </p>

            {/* 있음 / 없음 대비 */}
            <div className="mt-9 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              <div
                className="rounded-[18px] p-5 md:p-7"
                style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)" }}
              >
                <p className="mb-2 text-[13px] font-bold" style={{ color: "var(--cd-on-dark-2)" }}>
                  블로그만 진행했을 때
                </p>
                <p className="cd-display text-[22px] leading-tight md:text-[26px]" style={{ color: "#8f9cba" }}>
                  블로그 탭에서만 노출
                </p>
                <p className="mt-3 text-[14px] leading-[1.7]" style={{ color: "var(--cd-on-dark-2)" }}>
                  카페 탭으로 넘어간 고객에게는 우리 매장이 보이지 않습니다.
                </p>
              </div>

              <div
                className="rounded-[18px] p-5 md:p-7"
                style={{ background: "rgba(22,85,232,.18)", border: "1px solid rgba(127,166,255,.45)" }}
              >
                <p className="mb-2 text-[13px] font-bold" style={{ color: "var(--cd-primary-lt3)" }}>
                  카페 배포를 함께 했을 때
                </p>
                <p className="cd-display text-[22px] leading-tight text-white md:text-[26px]">
                  블로그 + 카페 양쪽 노출
                </p>
                <p className="mt-3 text-[14px] leading-[1.7]" style={{ color: "var(--cd-on-dark)" }}>
                  어느 탭을 열든 우리 이야기가 한 번은 보입니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 4. WHY CAFE ══ */}
        <section className="bg-white py-14 md:py-[66px]">
          <div className={INNER}>
            <p className="mb-4 text-[13px] font-bold tracking-[2px] md:text-[14px]" style={{ color: "var(--cd-primary)" }}>
              WHY CAFE
            </p>
            <h2
              className="cd-display text-[30px] leading-[1.25] md:text-[42px]"
              style={{ color: "var(--cd-ink)", letterSpacing: "-1.5px" }}
            >
              소비자의 검색은
              <br />
              블로그 한 곳에서 끝나지 않습니다
            </h2>
            <p
              className="mt-6 text-[16px] leading-[1.8] md:text-[18px]"
              style={{ color: "var(--cd-body-2)", textWrap: "pretty" }}
            >
              같은 키워드를 검색해도 블로그 탭에서 멈추는 사람과 카페 탭까지 넘어가는 사람이 나뉩니다.
              카페 탭은 실사용자의 후기가 모이는 영역으로 인식되기 때문에, 여기에서 한 번 더 언급되는 것과
              그렇지 않은 것의 신뢰 차이가 큽니다.
            </p>

            <div className="mt-9 grid grid-cols-1 gap-[18px] md:grid-cols-3">
              {WHY_CAFE.map((w) => (
                <div
                  key={w.no}
                  className="rounded-[18px] px-6 py-7 md:px-6 md:py-[30px]"
                  style={{ background: "var(--cd-tint)", border: "1px solid var(--cd-border-2)" }}
                >
                  <div className="cd-num mb-3 text-[30px] md:text-[34px]" style={{ color: "var(--cd-primary)" }}>
                    {w.no}
                  </div>
                  <h3 className="mb-2 text-[17px] font-bold md:text-[18px]" style={{ color: "var(--cd-ink-2)" }}>
                    {w.title}
                  </h3>
                  <p className="text-[15px] leading-[1.7]" style={{ color: "var(--cd-body-2)" }}>{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 5. 실제 노출 증거 — 가격을 보기 전에 실물을 먼저 보여준다 ══ */}
        <section className="bg-white pb-14 md:pb-[66px]">
          <div className={INNER}>
            <div className="rounded-[20px] p-5 md:p-8" style={{ background: "var(--cd-dark)" }}>
              <p className="mb-3 text-[13px] font-bold tracking-[2px] md:text-[14px]" style={{ color: "var(--cd-primary-lt3)" }}>
                PROOF
              </p>
              <h2
                className="cd-display text-[24px] leading-[1.25] text-white md:text-[34px]"
                style={{ letterSpacing: "-1.5px" }}
              >
                말로 설명하지 않겠습니다.
                <br />
                실제 검색 화면입니다
              </h2>
              <p className="mt-4 text-[15px] leading-[1.8] md:text-[16px]" style={{ color: "var(--cd-on-dark)" }}>
                아래는 네이버 모바일 통합검색에서 카페 영역에 노출된 실제 화면입니다.
                보정하지 않았고, 진행 건마다 이런 캡처와 게시 URL을 함께 드립니다.
              </p>
              <p className="mt-3 text-[15px] leading-[1.8] md:text-[16px]" style={{ color: "var(--cd-on-dark)" }}>
                몇 건 올렸는지보다 어디에 떴는지가 결과를 가릅니다. 그래서 발행 뒤 키워드마다 노출 위치를 확인하고 캡처와 URL을 남깁니다.
              </p>

              {/* 배포 기준 — 레퍼런스 배너와 동일한 지표 */}
              <div className="mt-6 flex flex-col gap-2.5">
                {[
                  "모바일 통합검색 카페 영역 노출",
                  "실제 대행사에 전달된 실사 증빙 자료",
                  "지역맘 카페 · 대형 카페 커뮤니티 배포",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white px-4 py-2.5 text-center text-[13px] font-black md:px-6 md:py-3 md:text-[16px]"
                    style={{ color: "var(--cd-primary-deep)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* 업종별 대표 캡처 — 각 업종 링크는 레퍼런스 해당 탭으로 바로 보낸다 */}
              <div className="mt-7 flex flex-col gap-3 md:gap-4">
                {PROOF_SAMPLES.map((s) => (
                  <figure key={s.image} className="overflow-hidden rounded-[14px] bg-white">
                    <figcaption
                      className="flex items-center gap-2.5 px-3 py-2.5 md:px-[18px] md:py-3"
                      style={{ background: "var(--cd-tint)", borderBottom: "1px solid var(--cd-border-2)" }}
                    >
                      <span
                        className="shrink-0 rounded-[5px] px-2 py-1 text-[11px] font-black text-white"
                        style={{ background: "var(--cd-primary)" }}
                      >
                        N
                      </span>
                      <span
                        className="min-w-0 flex-1 truncate text-[14px] font-bold md:text-[16px]"
                        style={{ color: "var(--cd-ink-2)" }}
                        title={s.keyword}
                      >
                        {s.keyword}
                      </span>
                      <Link
                        href={`${PATH}/reference?category=${s.slug}`}
                        className="hidden shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold transition-colors hover:opacity-80 sm:inline-flex"
                        style={{ background: "#fff", border: "1px solid var(--cd-border)", color: "var(--cd-body-2)" }}
                      >
                        {s.industry}
                        <span style={{ color: "var(--cd-primary)" }}>{s.count}</span>
                      </Link>
                    </figcaption>
                    <img
                      src={s.image}
                      alt={`'${s.keyword}' 검색 시 네이버 카페 영역 노출 화면 (${s.industry})`}
                      width={1000}
                      height={290}
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full"
                    />
                    {/* 모바일에서는 업종 칩을 캡처 아래로 내린다 (헤더가 좁아 잘림) */}
                    <Link
                      href={`${PATH}/reference?category=${s.slug}`}
                      className="flex min-h-[44px] items-center justify-between px-3 text-[13px] font-bold sm:hidden"
                      style={{ background: "var(--cd-tint)", borderTop: "1px solid var(--cd-border-2)", color: "var(--cd-body-2)" }}
                    >
                      <span>{s.industry}</span>
                      <span style={{ color: "var(--cd-primary)" }}>{s.count}건 보기</span>
                    </Link>
                  </figure>
                ))}
              </div>

              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <p className="text-[14px]" style={{ color: "var(--cd-on-dark-2)" }}>
                  이 외에 {REF_CATEGORIES.length}개 업종 {REF_TOTAL}개 키워드를 모두 공개하고 있습니다.
                </p>
                <Link
                  href={`${PATH}/reference`}
                  className="inline-flex w-full shrink-0 items-center justify-center rounded-full px-6 py-3 text-[15px] font-black text-white transition-opacity hover:opacity-90 sm:w-auto"
                  style={{ background: "linear-gradient(90deg,#1655e8,#5b8dfa)" }}
                >
                  레퍼런스 {REF_TOTAL}건 전체 보기
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 5-B. UPDATE — 가격을 보기 전에 무엇이 바뀌었는지 먼저 밝힌다 (2026-09-08 (화) 대표 지시) ══ */}
        <section className="bg-white py-14 md:py-[66px]" style={{ borderTop: "1px solid var(--cd-border)" }}>
          <div className={INNER}>
            <p className="mb-3 text-[13px] font-bold tracking-[2px] md:text-[14px]" style={{ color: "var(--cd-primary)" }}>
              UPDATE
            </p>
            <h2 className="cd-display text-[28px] leading-[1.25] md:text-[38px]" style={{ color: "var(--cd-ink)", letterSpacing: "-1.5px" }}>
              {PRICE_REVISED_AT},
              <br />
              이렇게 바뀌었습니다
            </h2>
            <p className="mt-5 text-[15px] leading-[1.8] md:text-[16px]" style={{ color: "var(--cd-body-2)" }}>
              {PRICE_REVISION_REASON} 그 김에 구성과 보고 방식도 다시 짰습니다.
              가격표를 보기 전에 달라진 점을 먼저 밝힙니다.
            </p>

            {/* 첫 항목(단가 조정 사유)만 한 줄을 다 쓴다. 나머지는 순서가 아니라 목록이라 번호를 붙이지 않는다 */}
            <div className="mt-9 grid grid-cols-1 gap-[14px] md:grid-cols-2">
              {WHATS_NEW.map((w, i) => (
                <div
                  key={w.title}
                  className={`rounded-[18px] px-6 py-6 md:px-7 ${i === 0 ? "md:col-span-2 md:py-8" : "md:py-7"}`}
                  style={{ background: i === 0 ? "var(--cd-tint-2)" : "var(--cd-tint)", border: "1px solid var(--cd-border-2)" }}
                >
                  <h3 className="mb-2 text-[17px] font-bold md:text-[18px]" style={{ color: "var(--cd-ink-2)" }}>
                    {w.title}
                  </h3>
                  <p className="text-[14px] leading-[1.75] md:text-[15px]" style={{ color: "var(--cd-body-2)" }}>
                    {w.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 6. PRICE — 구성과 가격 ══ */}
        <section className="py-14 md:py-[66px]" style={{ background: "var(--cd-tint)" }}>
          <div className={INNER}>
            <p className="mb-3 text-[13px] font-bold tracking-[2px] md:text-[14px]" style={{ color: "var(--cd-primary)" }}>
              PRICE
            </p>
            <h2 className="cd-display text-[28px] md:text-[38px]" style={{ color: "var(--cd-ink)", letterSpacing: "-1.5px" }}>
              구성과 가격
            </h2>
            <p className="mt-4 text-[15px] leading-[1.8] md:text-[16px]" style={{ color: "var(--cd-body-2)" }}>
              금액을 먼저 공개합니다. 상담 뒤에 견적이 달라지지 않도록 표에 적힌 기준 그대로 안내합니다.
              10건과 30건, 두 크기에서 최적화 블로그와 카페의 비율을 고릅니다.
              원고 작성을 맡기는 경우와 원고를 직접 주시는 경우의 금액을 나란히 적었습니다.
            </p>

            {PACKAGE_SIZES.map((size) => (
              <div key={size} className="mt-10">
                <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="text-[20px] font-black md:text-[24px]" style={{ color: "var(--cd-ink)" }}>
                    {size}건 패키지
                  </h3>
                  <span className="text-[13px] md:text-[14px]" style={{ color: "var(--cd-muted-2)" }}>
                    원고를 직접 주시면 {won(copyDiscount(size))} 내려갑니다
                  </span>
                </div>
                <div
                  className="mb-2 hidden grid-cols-[1fr_140px_140px_110px] gap-4 px-7 text-[12px] font-bold md:grid"
                  style={{ color: "var(--cd-muted-2)" }}
                >
                  <span>구성</span>
                  <span className="text-right">원고 작성 포함</span>
                  <span className="text-right">원고 직접 제공</span>
                  <span className="text-right">1건당 · 원고 포함</span>
                </div>
                <div className="flex flex-col gap-[14px] md:gap-2.5">
                  {PACKAGES.filter((p) => p.size === size).map((p) => (
                    <PackageRow key={`${p.size}-${p.blog}-${p.cafe}`} p={p} />
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-12">
              <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="text-[20px] font-black md:text-[24px]" style={{ color: "var(--cd-ink)" }}>
                  카페만 단건으로
                </h3>
                <span className="text-[13px] md:text-[14px]" style={{ color: "var(--cd-muted-2)" }}>
                  원고 작성까지 맡기시면 건당 {won(CAFE_COPY_FEE)} 추가
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {CAFE_TIERS.map((t) => (
                  <CafeTierRow key={t.grade} t={t} />
                ))}
              </div>
            </div>

            <p className="mt-6 text-[13px] leading-relaxed" style={{ color: "var(--cd-muted-2)" }}>
              {PRICE_NOTE.map((n) => `· ${n}`).join(" ")}
            </p>
          </div>
        </section>

        {/* ══ 7. PROMISE — 가격을 본 직후의 망설임을 받아준다 ══ */}
        <section className="bg-white py-14 md:py-[66px]">
          <div className={INNER}>
            <p className="mb-4 text-[13px] font-bold tracking-[2px] md:text-[14px]" style={{ color: "var(--cd-primary)" }}>
              PROMISE
            </p>
            <h2
              className="cd-display mb-8 text-[28px] leading-[1.25] md:text-[38px]"
              style={{ color: "var(--cd-ink)", letterSpacing: "-1.5px" }}
            >
              결제 전에 먼저 밝히는 것들
            </h2>

            <div className="flex flex-col gap-3">
              {GUARANTEES.map((g) => (
                <div
                  key={g.title}
                  className="flex items-start gap-4 rounded-[16px] p-5 md:p-6"
                  style={{ background: "var(--cd-tint)" }}
                >
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "var(--cd-primary)" }}
                  >
                    <Check size={15} className="text-white" strokeWidth={3} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="mb-1 text-[16px] font-bold md:text-[18px]" style={{ color: "var(--cd-ink-2)" }}>
                      {g.title}
                    </h3>
                    <p className="text-[14px] leading-[1.7] md:text-[15px]" style={{ color: "var(--cd-body-2)" }}>
                      {g.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 중간 CTA — 스크롤이 긴 상세페이지에서 이탈 지점을 잡아준다 */}
            <div
              className="mt-9 flex flex-col items-center gap-4 rounded-[20px] px-5 py-7 text-center md:px-8"
              style={{ background: "var(--cd-tint-2)" }}
            >
              <p className="text-[16px] font-bold leading-[1.6] md:text-[18px]" style={{ color: "var(--cd-ink-2)" }}>
                내 업종도 카페 배포가 되는지부터 확인해 보세요
              </p>
              <p className="-mt-2 text-[14px]" style={{ color: "var(--cd-body-2)" }}>
                업종과 목표 키워드만 알려주시면 가능 여부를 먼저 알려드립니다. 상담 0원.
              </p>
              <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
                <Link
                  href={CTA_HREF}
                  className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-black text-white transition-opacity hover:opacity-90"
                  style={{ background: "var(--cd-primary)" }}
                >
                  가능 여부 문의하기
                </Link>
                <a
                  href={KAKAO_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-bold text-gray-900 transition-opacity hover:opacity-90"
                  style={{ background: "#FAE100" }}
                >
                  카카오톡으로 묻기
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 9. PROCESS ══ */}
        <section className="bg-white py-14 md:py-[66px]">
          <div className={INNER}>
            <p className="mb-4 text-[13px] font-bold tracking-[2px] md:text-[14px]" style={{ color: "var(--cd-primary)" }}>
              PROCESS
            </p>
            <h2
              className="cd-display mb-9 text-[28px] md:text-[38px]"
              style={{ color: "var(--cd-ink)", letterSpacing: "-1.5px" }}
            >
              신청부터 보고까지 4단계
            </h2>

            <ol className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STEPS.map((s) => (
                <li
                  key={s.no}
                  className="rounded-[16px] px-5 py-6 md:px-5 md:py-[26px]"
                  style={{ border: "1px solid var(--cd-border-2)" }}
                >
                  <span
                    className="mb-4 flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-black text-white"
                    style={{ background: "var(--cd-primary)" }}
                  >
                    {s.no}
                  </span>
                  <h3 className="mb-1.5 text-[17px] font-bold" style={{ color: "var(--cd-ink-2)" }}>{s.title}</h3>
                  <p className="text-[14px] leading-[1.7]" style={{ color: "var(--cd-body-2)" }}>{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ══ 7. 레퍼런스 안내 ══ */}
        <section className="py-14 md:py-[66px]" style={{ background: "var(--cd-tint)" }}>
          <div className={INNER}>
            <p className="mb-4 text-[13px] font-bold tracking-[2px] md:text-[14px]" style={{ color: "var(--cd-primary)" }}>
              REFERENCE
            </p>
            <h2
              className="cd-display mb-4 text-[28px] leading-[1.25] md:text-[38px]"
              style={{ color: "var(--cd-ink)", letterSpacing: "-1.5px" }}
            >
              노출된 결과만 증빙으로 남깁니다
            </h2>
            <p className="mb-7 text-[16px] leading-[1.8] md:text-[18px]" style={{ color: "var(--cd-body-2)" }}>
              업종 {REF_CATEGORIES.length}개 · 키워드 {REF_TOTAL}개의 네이버 모바일 통합검색 카페 영역 노출 캡처를
              그대로 공개합니다. 진행 건별 게시 URL과 검색 결과 캡처를 함께 전달드립니다.
            </p>

            {/* 업종이 14개라 정식 라벨을 쓰면 칩이 서너 줄로 늘어진다. 축약 라벨 사용. */}
            <div className="mb-8 flex flex-wrap gap-2">
              {REF_CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`${PATH}/reference?category=${c.slug}`}
                  title={c.label}
                  className="whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-bold transition-colors hover:border-blue-300"
                  style={{ background: "#fff", border: "1px solid var(--cd-border)", color: "var(--cd-body-2)" }}
                >
                  {c.short}
                  <span className="ml-1.5" style={{ color: "var(--cd-primary)" }}>{c.keywords.length}</span>
                </Link>
              ))}
            </div>

            <Link
              href={`${PATH}/reference`}
              className="inline-flex w-full items-center justify-center rounded-full px-8 py-4 text-[17px] font-black text-white transition-opacity hover:opacity-90 md:w-auto md:text-[19px]"
              style={{ background: "linear-gradient(90deg,#1655e8,#5b8dfa)" }}
            >
              업종별 레퍼런스 전체 보기
            </Link>
          </div>
        </section>

        {/* ══ 8. FAQ — LD 의 faqLd(CAFE_FAQ) 와 짝 ══ */}
        <section className="bg-white py-14 md:py-[66px]">
          <div className={INNER}>
            <p className="mb-4 text-[13px] font-bold tracking-[2px] md:text-[14px]" style={{ color: "var(--cd-primary)" }}>
              FAQ
            </p>
            <h2
              className="cd-display mb-9 text-[28px] md:text-[38px]"
              style={{ color: "var(--cd-ink)", letterSpacing: "-1.5px" }}
            >
              자주 묻는 질문
            </h2>

            <div className="flex flex-col gap-[14px]">
              {CAFE_FAQ.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-[16px] px-5 py-5 md:px-[26px] md:py-6"
                  style={{ background: "var(--cd-tint)" }}
                >
                  {/* -my-2 py-2 — 시각 여백은 그대로 두고 터치 영역만 44px 로 */}
                  <summary className="-my-2 flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 py-2">
                    <h3 className="text-[16px] font-bold md:text-[17px]" style={{ color: "var(--cd-ink-2)" }}>
                      Q. {f.q}
                    </h3>
                    <ChevronDown
                      size={18}
                      className="mt-0.5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                      style={{ color: "var(--cd-muted)" }}
                      strokeWidth={2.5}
                    />
                  </summary>
                  <p className="speakable mt-4 text-[15px] leading-[1.8]" style={{ color: "var(--cd-body-2)" }}>
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 9. CTA ══ */}
        <section
          className="px-5 py-16 text-center md:px-[60px] md:py-20"
          style={{ background: "linear-gradient(160deg,#111,#16224a 60%,#0b1226)" }}
        >
          <div className="mx-auto w-full max-w-[860px]">
            <span
              className="mx-auto mb-7 flex h-[46px] w-[46px] items-center justify-center rounded-[12px]"
              style={{ background: "var(--cd-primary-lt)" }}
            >
              <Check size={24} className="text-white" strokeWidth={3} />
            </span>

            <h2 className="text-[24px] font-bold leading-[1.4] text-white md:text-[30px]">
              카페 + 블로그 동시 노출로
              <br />
              검색 노출 구조를 넓혀보세요
            </h2>

            <p className="mt-4 text-[15px] md:text-[16px]" style={{ color: "var(--cd-on-dark-2)" }}>
              진행 전 상담을 통해 업종별 가능 여부를 확인해 드립니다. 상담 비용 0원.
            </p>

            <div className="mx-auto mt-9 flex w-full max-w-[520px] flex-col gap-3">
              <Link
                href={CTA_HREF}
                className="block rounded-full py-5 text-[20px] font-black text-white md:py-6 md:text-[24px]"
                style={{ background: "linear-gradient(90deg,#2f6bf5,#7fa6ff)" }}
              >
                구성 상담 신청하기
              </Link>
              <a
                href={KAKAO_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full py-4 text-[16px] font-bold text-gray-900 transition-colors hover:bg-yellow-300"
                style={{ background: "#FAE100" }}
              >
                카카오톡으로 먼저 물어보기
              </a>
            </div>

            <p className="mt-8 text-[13px] leading-relaxed" style={{ color: "var(--cd-on-dark-4)" }}>
              하랑마케팅 · 표기 금액 부가세 별도
              <br />
              진행 전 상담을 통해 업종별 가능 여부를 확인해 드립니다.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
