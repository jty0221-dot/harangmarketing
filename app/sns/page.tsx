import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import FaqAccordion from "../components/FaqAccordion";
import { SITE, ORG_ID, webPageLd, breadcrumbLd, faqLd } from "../lib/seo";
import { SNS_PLATFORMS, SNS_PRODUCTS, SNS_FAQ, STORE, won } from "../lib/sns-store";
import Catalog from "./Catalog";
import { PlatformLogo } from "./PlatformLogo";
import {
  Zap, ShieldCheck, Search, ArrowRight, MessageCircle, ClipboardList,
  Banknote, PlayCircle, Activity, BadgeCheck, Scale, LockKeyhole,
  BadgeCheck as Verified, TrendingUp, Grid3x3, Clapperboard, Bookmark,
} from "lucide-react";

/**
 * SNS 부스트 스토어 — 셀프 주문형 SNS 마케팅
 *
 * 대행 계약(월 단위) 상품과 달리 건당 주문하는 스토어라 최상위 /sns 에 둔다.
 * 스튜디오(/studio)와 같은 원칙: 확인할 수 없는 약속(순위·알고리즘 보장)을
 * 문구로 넣지 말 것. 보장 범위는 '주문 수치가 채워지는 것'까지다.
 *
 * 히어로 오른쪽 프로필 목업은 상품 개념을 그린 일러스트다.
 * 실존 계정·실측 수치처럼 보이게 만들지 말 것 (계정명도 자사 것만 쓴다).
 */

const PATH = "/sns";
const URL = `${SITE.base}${PATH}`;
const KAKAO = SITE.kakaoChat;

const MIN_UNIT = Math.min(...SNS_PRODUCTS.map((p) => p.unitPrice));

export const metadata: Metadata = {
  title: "SNS 부스트 스토어 — 인스타 팔로워·좋아요·조회수 셀프 주문",
  description:
    `인스타그램·유튜브·틱톡·네이버 등 전 플랫폼 ${SNS_PRODUCTS.length}개 상품을 회원가입 없이 건당 주문. ` +
    `1개당 ${won(MIN_UNIT)}원부터, 마케팅 경력 10년의 하랑마케팅이 직접 운영합니다.`,
  alternates: { canonical: URL },
  // 상위 sns/layout 이 기능 화면을 noindex 로 덮으므로 공개 랜딩인 이 페이지만 되살린다
  robots: { index: true, follow: true },
  openGraph: {
    title: "SNS 부스트 스토어 — 하랑마케팅 직영 셀프 주문",
    description: "대행 계약 없이 필요한 만큼만. 인스타 팔로워·좋아요·조회수 건당 주문.",
    url: URL,
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service`,
    name: `하랑마케팅 ${STORE.name}`,
    alternateName: STORE.nameEn,
    serviceType: "SNS 마케팅 부스팅 (셀프 주문)",
    provider: { "@id": ORG_ID },
    areaServed: "KR",
    url: URL,
    description:
      "인스타그램·유튜브·스레드·틱톡·페이스북·엑스·네이버·카카오 전 플랫폼의 팔로워·좋아요·조회수·트래픽을 회원가입 없이 건당 주문하는 셀프 마케팅 스토어입니다.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${STORE.name} 플랫폼`,
      itemListElement: SNS_PLATFORMS.map((pl) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `${pl.name} 부스팅`,
          description: SNS_PRODUCTS.filter((p) => p.platform === pl.id)
            .map((p) => p.name)
            .join(" · "),
        },
      })),
    },
  },
  webPageLd({
    path: PATH,
    name: "SNS 부스트 스토어 — 인스타 팔로워·좋아요·조회수 셀프 주문",
    description:
      `전 플랫폼 ${SNS_PRODUCTS.length}개 상품을 회원가입 없이 건당 주문하는 하랑마케팅 직영 스토어. ` +
      "비밀번호 없이 링크만으로 진행되고, 주문번호로 진행 상황을 실시간 확인할 수 있습니다.",
    type: "CollectionPage",
  }),
  faqLd(SNS_FAQ, URL),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "SNS 부스트 스토어", path: PATH },
  ]),
];

const STEPS: { icon: typeof Zap; title: string; desc: string }[] = [
  { icon: ClipboardList, title: "상품 선택", desc: "플랫폼별 카탈로그에서 상품과 수량을 고르면 금액이 바로 계산됩니다." },
  { icon: Banknote, title: "주문 접수 · 입금", desc: "링크와 연락처만 남기면 주문번호가 나옵니다. 안내 계좌로 입금해 주세요." },
  { icon: PlayCircle, title: "확인 후 시작", desc: STORE.startNote + " 큰 수량은 자연스러운 속도로 나눠 들어갑니다." },
  { icon: Activity, title: "진행 확인", desc: "주문번호로 시작 수치와 남은 수량을 실시간 조회할 수 있습니다." },
];

const TRUST: { icon: typeof Zap; title: string; desc: string }[] = [
  {
    icon: BadgeCheck,
    title: "마케팅 대행사 직영",
    desc: `재계약률 ${SITE.stats.renewalRate}의 하랑마케팅이 실제 고객사 캠페인에 쓰는 프로그램을 같은 라인으로 공급합니다. 판매만 하는 업체와 출발점이 다릅니다.`,
  },
  {
    icon: Scale,
    title: "과주문은 저희가 먼저 말립니다",
    desc: "계정 규모에 맞지 않는 급격한 수치는 역효과가 납니다. 무리한 주문은 접수 단계에서 조정을 권해드립니다.",
  },
  {
    icon: LockKeyhole,
    title: "비밀번호 없이, 링크만으로",
    desc: "회원가입도 계정 비밀번호도 받지 않습니다. 공개된 링크만으로 진행되고, 주문 정보는 주문 처리에만 사용합니다.",
  },
];

/** 히어로 목업의 게시물 타일 배경 — 실사진 대신 브랜드 톤 그라데이션 */
const POST_TILES = [
  "linear-gradient(135deg,#dbeafe,#93c5fd)",
  "linear-gradient(135deg,#fde68a,#f59e0b)",
  "linear-gradient(135deg,#e0e7ff,#a5b4fc)",
  "linear-gradient(135deg,#fce7f3,#f9a8d4)",
  "linear-gradient(135deg,#d1fae5,#6ee7b7)",
  "linear-gradient(135deg,#ede9fe,#c4b5fd)",
];

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[290px] sm:w-[310px]" aria-hidden>
      {/* 뒤 배경 광원 */}
      <div
        className="absolute -inset-8 rounded-full opacity-60 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(245,158,11,0.10) 45%, transparent 70%)" }}
      />

      {/* 폰 프레임 */}
      <div className="relative rounded-[2.4rem] bg-white ring-1 ring-gray-200 shadow-2xl shadow-blue-900/10 p-3">
        <div className="rounded-[1.9rem] bg-white ring-1 ring-gray-100 overflow-hidden">
          {/* 상단 바 */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <span className="text-[13px] font-black text-gray-900">harang_marketing</span>
            <Verified size={14} className="text-blue-500" strokeWidth={2.5} />
          </div>

          {/* 프로필 영역 */}
          <div className="flex items-center gap-4 px-4 py-2">
            <span className="relative inline-flex h-[58px] w-[58px] items-center justify-center rounded-full p-[2.5px]"
              style={{ background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)" }}>
              <span className="flex h-full w-full items-center justify-center rounded-full bg-white">
                <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full text-[13px] font-black text-white"
                  style={{ background: "var(--h-navy)" }}>
                  하랑
                </span>
              </span>
            </span>
            <div className="flex flex-1 items-center justify-between text-center">
              <div>
                <p className="text-[14px] font-black text-gray-900 tabular-nums">214</p>
                <p className="text-[11px] text-gray-400">게시물</p>
              </div>
              <div>
                <p className="text-[14px] font-black text-blue-600 tabular-nums">12,480</p>
                <p className="text-[11px] text-gray-400">팔로워</p>
              </div>
              <div>
                <p className="text-[14px] font-black text-gray-900 tabular-nums">87</p>
                <p className="text-[11px] text-gray-400">팔로잉</p>
              </div>
            </div>
          </div>

          {/* 성장 배지 + 버튼 */}
          <div className="px-4 pb-3 pt-1">
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-black text-emerald-600 ring-1 ring-emerald-100">
              <TrendingUp size={10} strokeWidth={3} />
              팔로워 +1,240 이번 주
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-1.5">
              <span className="rounded-lg bg-blue-600 py-1.5 text-center text-[11px] font-black text-white">팔로우</span>
              <span className="rounded-lg bg-gray-100 py-1.5 text-center text-[11px] font-black text-gray-700">메시지</span>
            </div>
          </div>

          {/* 게시물 그리드 */}
          <div className="flex items-center justify-center gap-6 border-t border-gray-100 py-1.5 text-gray-300">
            <Grid3x3 size={13} className="text-gray-700" />
            <Clapperboard size={13} />
            <Bookmark size={13} />
          </div>
          <div className="grid grid-cols-3 gap-[2px] px-[2px] pb-[2px]">
            {POST_TILES.map((bg, i) => (
              <span key={i} className="aspect-square" style={{ background: bg }} />
            ))}
          </div>
        </div>
      </div>

      {/* 플로팅 플랫폼 로고 */}
      <div className="absolute -right-5 top-6 anim-float">
        <PlatformLogo id="instagram" size={46} className="ring-4 ring-white shadow-lg" />
      </div>
      <div className="absolute -left-7 top-1/3 anim-float-slow">
        <PlatformLogo id="youtube" size={42} className="ring-4 ring-white shadow-lg" />
      </div>
      <div className="absolute -right-7 bottom-24 anim-float-slow">
        <PlatformLogo id="tiktok" size={38} className="ring-4 ring-white shadow-lg" />
      </div>
      <div className="absolute -left-5 bottom-8 anim-float">
        <PlatformLogo id="naver" size={40} className="ring-4 ring-white shadow-lg" />
      </div>

      {/* 플로팅 주문 카드 */}
      <div className="absolute -left-12 -bottom-5 hidden sm:block rounded-2xl bg-white px-4 py-3 ring-1 ring-gray-100 shadow-xl shadow-blue-900/10">
        <p className="text-[11px] font-bold text-gray-400">주문 예시</p>
        <p className="mt-0.5 text-[12.5px] font-black text-gray-900">한국인 팔로워 100명</p>
        <p className="text-[13px] font-black text-blue-600 tabular-nums">15,000원</p>
      </div>
    </div>
  );
}

export default function SnsStorePage() {
  return (
    <>
      <JsonLd data={LD} />
      <Header />

      <main className="pt-[104px] md:pt-[108px]">
        {/* ───────────── 첫 화면 ───────────── */}
        <section className="relative overflow-hidden" style={{ background: "var(--h-bg)" }}>
          <div className="absolute inset-0 dot-grid opacity-40" aria-hidden />
          <div className="relative max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-black ring-1 ring-gray-200 text-gray-700">
                  <Zap size={12} strokeWidth={2.5} className="text-blue-600" />
                  하랑마케팅 직영 · 회원가입 없이 주문
                </div>

                <h1
                  className="mt-5 text-[30px] leading-[1.22] font-black tracking-tight md:text-[44px] md:leading-[1.16]"
                  style={{ color: "var(--h-navy)" }}
                >
                  대행 계약 없이,
                  <br />
                  필요한 만큼만 <span className="text-blue-600">건당 주문</span>
                </h1>

                <p className="speakable mt-5 max-w-xl text-[15px] leading-relaxed text-gray-600 md:text-base">
                  SNS 부스트 스토어는 인스타그램·유튜브·틱톡·네이버 등 전 플랫폼의
                  팔로워·좋아요·조회수·트래픽을 건당 주문하는 하랑마케팅 직영 스토어입니다.
                  계정 비밀번호 없이 공개 링크만으로 진행되고, 주문번호로 진행 상황을
                  실시간 확인할 수 있습니다.
                </p>

                {/* 플랫폼 로고 스트립 */}
                <div className="mt-6 flex items-center gap-2 flex-wrap">
                  {SNS_PLATFORMS.map((pl) => (
                    <PlatformLogo key={pl.id} id={pl.id} size={30} className="ring-2 ring-white" />
                  ))}
                  <span className="ml-1 text-[11.5px] font-bold text-gray-400">
                    전 플랫폼 · {SNS_PRODUCTS.length}개 상품
                  </span>
                </div>

                <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                  <a
                    href="#catalog"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
                  >
                    상품 보러 가기
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </a>
                  <Link
                    href="/sns/track"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-50"
                  >
                    <Search size={15} strokeWidth={2.2} />
                    주문 조회
                  </Link>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  1개당 {won(MIN_UNIT)}원부터 · 비밀번호 불필요 · {STORE.startNote}
                </p>
              </div>

              {/* 오른쪽 비주얼 — 프로필 목업 (개념 일러스트) */}
              <div className="hidden lg:block">
                <PhoneMockup />
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── 카탈로그 ───────────── */}
        <section id="catalog" className="bg-white py-12 md:py-16 scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="rule-amber mb-8">
              <p className="text-[11px] font-black tracking-[0.18em] text-gray-400">CATALOG</p>
              <h2 className="mt-1 text-2xl md:text-3xl font-black" style={{ color: "var(--h-navy)", letterSpacing: "-0.03em" }}>
                플랫폼을 고르고, 바로 주문하세요
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                표시된 금액이 전부입니다. 수량을 정하면 단가 × 수량으로 바로 계산됩니다.
              </p>
            </div>
            <Catalog />
          </div>
        </section>

        {/* ───────────── 이용 방법 ───────────── */}
        <section className="py-12 md:py-16" style={{ background: "var(--h-bg)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="rule-amber mb-8">
              <p className="text-[11px] font-black tracking-[0.18em] text-gray-400">PROCESS</p>
              <h2 className="mt-1 text-2xl md:text-3xl font-black" style={{ color: "var(--h-navy)", letterSpacing: "-0.03em" }}>
                주문에서 완료까지
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map((s, i) => (
                <div key={s.title} className="bg-white rounded-2xl p-5 ring-1 ring-gray-100 shadow-sm card-hover">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center ring-1 ring-blue-800/20">
                      <s.icon size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-3xl font-black text-gray-100 select-none">{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-[15px] font-black text-gray-900">{s.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── 대행사 직영의 차이 ───────────── */}
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="rule-amber mb-8">
              <p className="text-[11px] font-black tracking-[0.18em] text-gray-400">WHY HARANG</p>
              <h2 className="mt-1 text-2xl md:text-3xl font-black" style={{ color: "var(--h-navy)", letterSpacing: "-0.03em" }}>
                판매 업체가 아니라, 마케팅 대행사입니다
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TRUST.map((t) => (
                <div key={t.title} className="rounded-2xl p-6 ring-1 ring-gray-100 shadow-sm card-navy-accent bg-white">
                  <div className="w-9 h-9 rounded-xl bg-slate-700 shadow-sm flex items-center justify-center ring-1 ring-slate-900/20">
                    <t.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="mt-4 text-[15px] font-black text-gray-900">{t.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">{t.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl px-5 py-4 md:px-6 bg-gray-50 ring-1 ring-gray-100 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <ShieldCheck size={18} className="text-blue-600 shrink-0" strokeWidth={2.2} />
              <p className="text-[13px] leading-relaxed text-gray-600">
                <strong className="font-black text-gray-800">정직 고지.</strong>{" "}
                이 스토어가 보장하는 것은 주문하신 수치가 채워지는 것까지입니다. 검색 순위나
                알고리즘 노출은 플랫폼이 결정하는 영역이라 약속드리지 않습니다. 계정 육성과
                콘텐츠 전략까지 필요하시면{" "}
                <Link href="/services#sns" className="font-bold text-blue-600 underline underline-offset-2">
                  SNS 마케팅 대행
                </Link>
                을 이용해 주세요.
              </p>
            </div>
          </div>
        </section>

        {/* ───────────── FAQ ───────────── */}
        <FaqAccordion
          items={SNS_FAQ}
          title="자주 묻는 질문"
          subtitle="주문 전에 가장 많이 물어보시는 것들입니다"
        />

        {/* ───────────── 마감 CTA ───────────── */}
        <section className="split-dark py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-5" aria-hidden>
              {SNS_PLATFORMS.slice(0, 6).map((pl) => (
                <PlatformLogo key={pl.id} id={pl.id} size={28} className="ring-2 ring-white/10 opacity-90" />
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white" style={{ letterSpacing: "-0.03em" }}>
              어떤 상품을 골라야 할지 모르겠다면
            </h2>
            <p className="mt-3 text-sm text-gray-300 max-w-xl mx-auto">
              계정 링크만 보내주세요. 지금 상태에서 어떤 수치부터 채우는 게 자연스러운지
              대표가 직접 봐드립니다. 상담은 무료입니다.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <a
                href={KAKAO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-400 px-6 py-3.5 text-sm font-black text-gray-900 shadow-sm transition hover:bg-blue-300"
              >
                <MessageCircle size={16} strokeWidth={2.2} />
                카카오톡으로 물어보기
              </a>
              <a
                href="#catalog"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/20"
              >
                카탈로그 다시 보기
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
