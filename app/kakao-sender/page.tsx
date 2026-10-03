import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import FaqAccordion from "../components/FaqAccordion";
import { SITE, ORG_ID, faqLd, breadcrumbLd, webPageLd, updatedAt } from "../lib/seo";
import {
  KS, KS_PLANS, KS_CHEAPEST, KS_PRICIEST, won,
  KS_FEATURES, KS_SAFETY, KS_AD, KS_FOR_WHOM, KS_SHOTS, KS_BUY_STEPS, KS_SMARTSCREEN_STEPS, KS_SPECS, KS_FAQ,
  KS_REFERRAL, KS_REFERRAL_STEPS, KS_REFERRAL_RULES,
} from "../lib/kakao-sender";
import {
  Download, ArrowRight, MessageCircle, Phone, MonitorSmartphone, Users, Send,
  CalendarClock, PencilLine, Paperclip, Search, FolderOpen, ShieldCheck, ListChecks,
  Star, ShoppingCart, Info, ExternalLink, Clock, Gift, CalendarPlus, Coins,
  Contact, RotateCcw, BarChart3, BookmarkPlus, FileSpreadsheet, Plug, FlaskConical, Eye, CalendarX2,
  Megaphone, UserCheck, Moon,
} from "lucide-react";

/**
 * 카톡 예약 발송 판매 페이지
 *
 * 대행 서비스가 아니라 자사 프로그램이라 /studio 처럼 최상위에 둔다.
 * 문구는 '내 거래처 · 고객 · 회원 방' 중심이다. 오픈채팅 홍보 도구로 읽히는 말,
 * 발송 보장 · 계정 안전 보장 · 카카오 공식 같은 말은 쓰지 않는다 (카카오 제휴가 아니다).
 * 입금계좌는 페이지에 싣지 않는다. 노출 여부는 대표 결재 대기다. 지금은 카카오톡 채널 문의만.
 * 추천 포인트 숫자는 lib 의 KS_REFERRAL 한 곳에서만 가져온다 (판매설정.json 추천포인트와 같다).
 * 화면 이미지는 실제 프로그램 캡처만 쓴다 (예시 이름 · 실제 고객 이름 없음 · 가짜 화면 금지).
 * 광고 글 칸은 법을 지키게 돕는 장치까지만 말한다. 법 조항 숫자 · 보장 표현은 쓰지 않는다.
 * 캡처는 프로그램 색(노랑) 그대로다. 페이지 색은 WDS 를 유지하고 카카오 로고 · 브랜드 이미지는 쓰지 않는다.
 */

const PATH = "/kakao-sender";
const URL = `${SITE.base}${PATH}`;
const TEL = `tel:${SITE.phone}`;

const FEATURE_ICONS = [
  Contact, Send, CalendarClock, RotateCcw, BarChart3, BookmarkPlus,
  PencilLine, Paperclip, Search, FolderOpen, FileSpreadsheet, Plug,
];
const SAFETY_ICONS = [ListChecks, FlaskConical, Eye, ShieldCheck, CalendarX2];
const AD_ICONS = [Megaphone, UserCheck, Moon];

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${URL}#software`,
    name: KS.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Windows",
    softwareVersion: KS.version,
    inLanguage: "ko-KR",
    url: URL,
    downloadUrl: KS.downloadUrl,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    description:
      "PC 카카오톡 채팅방 여러 곳에 같은 글을 한 번에 보내거나 원하는 시각에 예약해 보내는 윈도우 프로그램입니다. " +
      "글에 이름 자리를 넣으면 방마다 이름이 바뀌어 나갑니다. 거래처 · 고객 · 회원 방에 공지와 명절 인사를 보낼 때 씁니다.",
    featureList: [...KS_FEATURES, ...KS_SAFETY, ...KS_AD].map((f) => f.title),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KRW",
      lowPrice: KS_CHEAPEST.price,
      highPrice: KS_PRICIEST.price,
      offerCount: KS_PLANS.length,
      offers: KS_PLANS.map((p) => ({
        "@type": "Offer",
        name: p.label ? `${p.name} (${p.label})` : p.name,
        price: p.price,
        priceCurrency: "KRW",
        description: `${p.days}일 · PC ${p.pcs}대 · 부가세 포함.`,
        availability: "https://schema.org/InStock",
        seller: { "@id": ORG_ID },
      })),
    },
  },
  webPageLd({
    path: PATH,
    name: "카톡 예약 발송 | 거래처 카톡방에 한 번에, 원하는 시각에",
    description:
      `PC 카카오톡 방 여러 곳에 같은 글을 한 번에 보내거나 예약해 보내는 윈도우 프로그램. 무료 ${KS.trialCount}건 체험.`,
    dateModified: updatedAt(PATH),
  }),
  faqLd(KS_FAQ, URL),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: KS.name, path: PATH },
  ]),
];

/** 섹션 제목 앞 아이콘 박스. WDS 기준이라 단색 배경 + 흰 아이콘 (그라데이션 금지) */
function IconBox({ icon: Icon }: { icon: typeof Send }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--w-primary)] shadow-sm">
      <Icon size={16} className="text-white" strokeWidth={2.5} aria-hidden />
    </div>
  );
}

function PcOnlyNote() {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-white px-4 py-3 text-sm text-gray-700 ring-1 ring-gray-200">
      <MonitorSmartphone size={18} className="mt-0.5 shrink-0 text-[var(--w-primary)]" strokeWidth={2} aria-hidden />
      <p>
        <span className="font-semibold text-gray-900">PC 에서 내려받으세요.</span> 윈도우 PC 와 PC 카카오톡
        로그인이 필요한 프로그램이라 휴대폰에서는 쓸 수 없습니다.
      </p>
    </div>
  );
}

export default function KakaoSenderPage() {
  return (
    <>
      <JsonLd data={LD} />
      <Header />

      {/* 헤더가 고정이라 본문을 그만큼 내린다. 사이트 공통 값 */}
      <main className="pt-[104px] md:pt-[108px] overflow-x-hidden">
        {/* 첫 화면 */}
        <section className="bg-gray-50 pt-10 pb-12 md:pt-16 md:pb-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[var(--w-primary)] ring-1 ring-gray-200">
                  하랑마케팅이 만든 윈도우 프로그램 · 버전 {KS.version}
                </div>

                <h1 className="mt-4 text-[28px] leading-[1.3] font-black tracking-tight text-gray-900 md:text-[40px] md:leading-[1.25]">
                  거래처 카톡방 여러 곳에
                  <br />
                  <span className="text-[var(--w-primary)]">한 번에, 원하는 시각에</span>
                </h1>

                <p className="speakable mt-4 text-[15px] leading-relaxed text-gray-600 md:text-base">
                  카톡 예약 발송은 PC 카카오톡 채팅방 여러 곳에 같은 글을 한 번에 보내거나 원하는 시각에
                  예약해 보내는 윈도우 프로그램입니다. 글에 이름 자리를 넣으면 방마다 받는 분 이름으로 바뀌어
                  나갑니다. 거래처 · 고객 · 회원 방에 공지와 명절 인사를 한 번에 보내세요.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {[`무료 ${KS.trialCount}건 체험`, "예약은 승인해야 발송", "자동 결제 없음"].map((t) => (
                    <span
                      key={t}
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-gray-600 ring-1 ring-gray-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                  <a
                    href={KS.downloadUrl}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--w-primary)] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:opacity-90"
                  >
                    <Download size={16} strokeWidth={2.2} aria-hidden />
                    무료 체험판 내려받기 (PC)
                  </a>
                  <a
                    href="#price"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-100"
                  >
                    가격 보기
                    <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
                  </a>
                </div>

                <div className="mt-4">
                  <PcOnlyNote />
                </div>
              </div>

              {/* 실제 프로그램 화면 (예시 이름으로 찍은 1.8.0 캡처 · 실제 고객 이름 없음) */}
              <figure className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                <img
                  src={KS_SHOTS[0].src}
                  alt={KS_SHOTS[0].alt}
                  width={KS_SHOTS[0].width}
                  height={KS_SHOTS[0].height}
                  loading="eager"
                  decoding="async"
                  className="block h-auto w-full"
                />
                <figcaption className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
                  {KS_SHOTS[0].caption}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 쓰는 순서 · 화면 */}
        <section className="bg-white py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <IconBox icon={ListChecks} />
              <h2 className="text-xl font-black text-gray-900 md:text-2xl">이렇게 씁니다</h2>
            </div>

            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["보낼 방 고르기", "저장해 둔 방이나 그룹에서 고릅니다"],
                ["글 쓰기", "이름 자리를 넣고 사진 · 파일도 붙입니다"],
                ["바로 보내기 또는 예약", "한 번 · 매일 · 매주 · 매월 · 며칠마다"],
                ["확인하고 승인", "점검과 확인 창을 거친 뒤에 나갑니다"],
              ].map(([t, d], i) => (
                <li key={t} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--w-primary)] text-xs font-black text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-900">{t}</div>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {KS_SHOTS.slice(1, 5).map((shot) => (
                <figure key={shot.src} className="self-start overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                  <figcaption className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
                    {shot.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 기능 */}
        <section className="bg-gray-50 py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <IconBox icon={Send} />
              <h2 className="text-xl font-black text-gray-900 md:text-2xl">할 수 있는 것</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {KS_FEATURES.map((f, i) => {
                const Icon = FEATURE_ICONS[i] ?? Send;
                return (
                  <div key={f.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                    <Icon size={20} className="text-[var(--w-primary)]" strokeWidth={2} aria-hidden />
                    <h3 className="mt-3 text-base font-bold text-gray-900">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 실수 발송 방지 */}
        <section className="bg-white py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-2 flex items-center gap-3">
              <IconBox icon={ShieldCheck} />
              <h2 className="text-xl font-black text-gray-900 md:text-2xl">잘못 보내지 않게 여러 번 확인합니다</h2>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              여러 방에 보낸 글은 한 번 나가면 되돌리기 어렵습니다. 그래서 보내기 전에 점검하고 확인을 받습니다.
            </p>

            {/* 왼쪽 장치 다섯 · 오른쪽 확인 창 캡처. 캡처 높이에 카드가 늘어나지 않게 두 칸으로 나눈다 */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
              <div className="space-y-3">
                {KS_SAFETY.map((f, i) => {
                  const Icon = SAFETY_ICONS[i] ?? ShieldCheck;
                  return (
                    <div key={f.title} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 md:p-5">
                      <div className="flex items-center gap-2.5">
                        <Icon size={20} className="shrink-0 text-[var(--w-primary)]" strokeWidth={2} aria-hidden />
                        <h3 className="text-base font-bold text-gray-900">{f.title}</h3>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{f.desc}</p>
                    </div>
                  );
                })}
              </div>
              {/* 확인 창 캡처 (1.8.0 · 예시 이름) */}
              <figure className="overflow-hidden rounded-2xl bg-gray-50 shadow-sm ring-1 ring-gray-200 lg:sticky lg:top-32">
                <div className="flex justify-center p-4 md:p-5">
                  <img
                    src={KS_SHOTS[5].src}
                    alt={KS_SHOTS[5].alt}
                    width={KS_SHOTS[5].width}
                    height={KS_SHOTS[5].height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full max-w-[500px] rounded-xl ring-1 ring-gray-200"
                  />
                </div>
                <figcaption className="border-t border-gray-100 bg-white px-4 py-3 text-xs text-gray-500">
                  {KS_SHOTS[5].caption}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 광고 글 (1.9.0) */}
        <section id="ad" className="scroll-mt-28 bg-gray-50 py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-2 flex items-center gap-3">
              <IconBox icon={Megaphone} />
              <h2 className="text-xl font-black text-gray-900 md:text-2xl">광고 글은 규칙을 지키며 보내도록 돕습니다</h2>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              버전 1.9.0 부터 보내기 화면에 광고 글 체크가 있습니다. 체크하면 아래 세 가지가 함께 움직입니다.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {KS_AD.map((f, i) => {
                const Icon = AD_ICONS[i] ?? Megaphone;
                return (
                  <div key={f.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 md:p-6">
                    <div className="flex items-center gap-2.5">
                      <Icon size={20} className="text-[var(--w-primary)]" strokeWidth={2} aria-hidden />
                      <h3 className="text-base font-bold text-gray-900 md:text-lg">{f.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.desc}</p>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 flex items-start gap-2 rounded-2xl bg-white p-4 text-xs leading-relaxed text-gray-600 ring-1 ring-gray-200 md:p-5 md:text-[13px]">
              <Info size={14} className="mt-0.5 shrink-0 text-[var(--w-primary)]" strokeWidth={2.2} aria-hidden />
              <span>
                프로그램은 표기와 동의 확인을 돕는 장치입니다. 받는 분께 광고 수신 동의를 받는 일은 보내시는 분이
                하셔야 합니다.
              </span>
            </p>
          </div>
        </section>

        {/* 쓰임 */}
        <section className="bg-white py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <IconBox icon={Users} />
              <h2 className="text-xl font-black text-gray-900 md:text-2xl">이럴 때 씁니다</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {KS_FOR_WHOM.map((w) => (
                <div key={w.who} className="rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-200">
                  <div className="text-base font-bold text-gray-900">{w.who}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{w.why}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 가격 */}
        <section id="price" className="scroll-mt-28 bg-gray-50 py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-2 flex items-center gap-3">
              <IconBox icon={Star} />
              <h2 className="text-xl font-black text-gray-900 md:text-2xl">가격</h2>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              부가세 포함 가격입니다. 기간 안에는 방 수와 건수 제한이 없습니다. 먼저 무료 {KS.trialCount}건
              (방 1곳에 한 번 보낸 것이 1건)으로 써 보시고 결정하셔도 됩니다.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {KS_PLANS.map((p) => (
                <div
                  key={p.id}
                  className={`relative flex flex-col rounded-2xl bg-white p-5 shadow-sm ${
                    p.best ? "ring-2 ring-[var(--w-primary)]" : "ring-1 ring-gray-200"
                  }`}
                >
                  {p.best && (
                    <span className="absolute -top-2.5 left-5 rounded-full bg-[var(--w-primary)] px-2.5 py-0.5 text-[11px] font-black text-white">
                      추천
                    </span>
                  )}
                  <div className="text-sm font-black text-gray-900">
                    {p.label ?? p.name}
                    {p.label && <span className="ml-1.5 text-xs font-bold text-gray-500">{p.name}</span>}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black tracking-tight text-gray-900">{won(p.price)}</span>
                    <span className="text-sm font-bold text-gray-500">원</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600">
                      {p.days}일
                    </span>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600">
                      PC {p.pcs}대
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-gray-500">{p.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-white p-4 text-xs text-gray-600 ring-1 ring-gray-200">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[var(--w-primary)]" strokeWidth={2.2} aria-hidden />
                자동 결제 없음 · 기간이 끝나면 멈춥니다
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} className="text-[var(--w-primary)]" strokeWidth={2.2} aria-hidden />
                기간이 끝나기 전에 프로그램에서 미리 알려 드립니다
              </span>
            </div>
          </div>
        </section>

        {/* 구매 절차 */}
        <section id="buy" className="scroll-mt-28 bg-white py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-2 flex items-center gap-3">
              <IconBox icon={ShoppingCart} />
              <h2 className="text-xl font-black text-gray-900 md:text-2xl">구매는 이렇게 합니다</h2>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              정품키는 PC 마다 다른 기기 코드에 맞춰 드립니다. 그래서 프로그램 안에서 시작합니다.
            </p>

            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {KS_BUY_STEPS.map((s, i) => (
                <li key={s.step} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 md:p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--w-primary)] text-xs font-black text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900">{s.step}</div>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{s.detail}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={KS.kakaoChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--w-primary)] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:opacity-90"
              >
                <MessageCircle size={16} strokeWidth={2.2} aria-hidden />
                카카오톡 채널로 구매 문의
              </a>
              <a
                href={KS.guideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-100"
              >
                사용 방법 안내 보기
                <ExternalLink size={15} strokeWidth={2.2} aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* 추천 포인트 (1.7.0 부터) */}
        <section id="referral" className="scroll-mt-28 bg-gray-50 py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-2 flex items-center gap-3">
              <IconBox icon={Gift} />
              <h2 className="text-xl font-black text-gray-900 md:text-2xl">소개해 주시면 포인트가 쌓입니다</h2>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              버전 1.7.0 부터 구매 · 문의 창에 내 추천 코드와 소개 문구 복사 단추가 있습니다. 소개받은 분이
              결제하시면 결제액의 {KS_REFERRAL.rewardPercent}% 가 포인트로 쌓이고, 1점은 1원입니다.
            </p>

            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {KS_REFERRAL_STEPS.map((s, i) => (
                <li key={s.step} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 md:p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--w-primary)] text-xs font-black text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900">{s.step}</div>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{s.detail}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 md:p-6">
                <div className="flex items-center gap-2.5">
                  <CalendarPlus size={20} className="text-[var(--w-primary)]" strokeWidth={2} aria-hidden />
                  <h3 className="text-base font-bold text-gray-900 md:text-lg">정품 기간 연장</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  포인트 {won(KS_REFERRAL.extendPoints)}점마다 정품 기간을 {KS_REFERRAL.extendDays}일씩 늘려 드립니다.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 md:p-6">
                <div className="flex items-center gap-2.5">
                  <Coins size={20} className="text-[var(--w-primary)]" strokeWidth={2} aria-hidden />
                  <h3 className="text-base font-bold text-gray-900 md:text-lg">현금 환전</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {won(KS_REFERRAL.cashoutMin)}점부터 1점당 {KS_REFERRAL.cashoutRate}원으로 현금 환전해 드립니다.
                  사업자등록이 있으시면 세금계산서로, 아니시면 관련 세금을 떼고 보내 드립니다. 필요한 정보는 환전
                  때 따로 여쭙니다.
                </p>
              </div>
            </div>

            <ul className="mt-4 space-y-2 rounded-2xl bg-white p-4 text-xs leading-relaxed text-gray-600 ring-1 ring-gray-200 md:p-5 md:text-[13px]">
              {KS_REFERRAL_RULES.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <Info size={14} className="mt-0.5 shrink-0 text-[var(--w-primary)]" strokeWidth={2.2} aria-hidden />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 필요한 것 · 윈도우 경고창 */}
        <section id="smartscreen" className="scroll-mt-28 border-t border-gray-200 bg-gray-50 py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <IconBox icon={Info} />
              <h2 className="text-xl font-black text-gray-900 md:text-2xl">받기 전에 확인하실 것</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {KS_SPECS.map((s) => (
                <div key={s.label} className="rounded-xl bg-white p-3.5 ring-1 ring-gray-200">
                  <div className="text-xs font-bold text-gray-500">{s.label}</div>
                  <div className="mt-1 text-sm font-bold text-gray-900">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 md:p-6">
              <h3 className="text-base font-bold text-gray-900 md:text-lg">처음 실행할 때 파란 경고창이 뜨면</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                윈도우가 알 수 없는 앱이라는 창을 띄울 수 있습니다. 서명 인증서 비용을 아껴 값을 낮춘
                프로그램이라 나오는 창입니다. 아래 두 번만 누르시면 열립니다.
              </p>
              <ol className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {KS_SMARTSCREEN_STEPS.map((s, i) => (
                  <li key={s.step} className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--w-primary)] text-xs font-black text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900">{s.step}</div>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FaqAccordion
          items={KS_FAQ}
          title="카톡 예약 발송 자주 묻는 질문"
          subtitle="구매 전에 많이 여쭤보시는 것들입니다"
        />

        {/* 맺음 */}
        <section className="bg-[var(--w-primary)] py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 text-center md:px-6">
            <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              먼저 {KS.trialCount}건 보내 보시고 결정하세요
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white md:text-base">
              PC 에서 내려받아 압축을 풀고 실행하시면 됩니다. 정품키 없이 방 {KS.trialCount}곳까지 보내 보실 수 있습니다.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
              <a
                href={KS.downloadUrl}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-[var(--w-primary)] shadow-sm transition hover:bg-gray-100"
              >
                <Download size={16} strokeWidth={2.2} aria-hidden />
                무료 체험판 내려받기 (PC)
              </a>
              <a
                href={KS.kakaoChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black text-white ring-1 ring-white/60 transition hover:bg-white/10"
              >
                <MessageCircle size={16} strokeWidth={2.2} aria-hidden />
                카카오톡 채널 문의
              </a>
              <a
                href={TEL}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black text-white ring-1 ring-white/60 transition hover:bg-white/10"
              >
                <Phone size={16} strokeWidth={2.2} aria-hidden />
                {SITE.phone}
              </a>
            </div>

            <p className="mt-6 text-xs text-white">
              광고성 메시지는 받는 분의 동의를 받고 보내세요. 이 프로그램은 카카오와 관계가 없는 하랑마케팅 프로그램입니다.
            </p>
            <p className="mt-2 text-xs text-white">
              마케팅 대행도 함께 필요하시면{" "}
              <Link href="/services" className="font-black underline underline-offset-2">
                서비스 안내
              </Link>
              를 봐 주세요
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
