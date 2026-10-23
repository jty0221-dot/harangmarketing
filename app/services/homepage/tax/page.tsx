import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BookOpen, Building2, CalendarClock, Calculator, ExternalLink, FileSearch, Gauge,
  KeyRound, Layers, MessageCircle, Phone, ScanSearch, Search, UserRound,
} from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import JsonLd from "../../../components/JsonLd";
import SiteAuditCaseCard from "../../../components/SiteAuditCaseCard";
import { SITE, breadcrumbLd, faqLd, ogImage, updatedAt, webPageLd } from "../../../lib/seo";
import { HOMEPAGE_TIERS } from "../../../lib/homepage-pricing";
import { siteAuditCase } from "../../../lib/site-audit-cases";

/* 세무사 홈페이지 소개 · 2026-10-23 (금) 대표 지시 · 루미 배정 · 민수
   자리 : /services/homepage 아래 업종 소개 쪽 (/services/clinic/medical-ad-guide 처럼 상품 아래 하위 쪽)
   재료 : 홈페이지공장 out/tax-firm-b (가상 시안 · noindex) · out/asung-daegu/portfolio (동의 받은 분석 사례)
   가격 : app/lib/homepage-pricing.ts 의 이미 공개된 숫자만 쓴다. 세무 전용 가격을 새로 만들지 않는다 (C 결재)
   문구 : 세무사 광고에서 문제 될 낱말(최상급 · 순위 · 결과 약속 · 이전 경력 앞세우기)을 쓰지 않는다 */

const PATH = "/services/homepage/tax";
const URL = `${SITE.base}${PATH}`;
const TITLE = "세무사 홈페이지 제작, 상담 전에 신뢰를 만드는 사무소 홈페이지";
const DESC =
  "세무 · 회계 사무소용 홈페이지 틀을 미리 만들어 두었습니다. 상담 세무사 소개, 관리 방식, 기장료 안내, 서비스별 페이지와 검색 · AI 기본 세팅까지 사무소에 맞게 바꿔 15영업일 안에 엽니다";
const SIAN = "/sian/tax-firm-b-w8k3qz/index.html";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["세무사 홈페이지", "세무사 홈페이지 제작", "세무법인 홈페이지", "세무회계 홈페이지", "세무사무소 홈페이지", "세무사 브랜딩"],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "세무사 홈페이지 제작 | 하랑마케팅",
    description: DESC,
    url: URL,
    images: [ogImage("하랑마케팅 세무사 홈페이지 제작")],
  },
};

type Item = { icon: typeof Search; title: string; desc: string };

const SEES: Item[] = [
  { icon: UserRound, title: "누가 상담하는지", desc: "대표 세무사 인사와 등록번호, 상담을 어떻게 진행하는지 먼저 보여 드립니다" },
  { icon: Layers, title: "매달 무엇을 해 주는지", desc: "기장부터 신고, 세무 일정 안내까지 관리 방식을 세 단계로 정리합니다" },
  { icon: Calculator, title: "기장료가 대략 얼마인지", desc: "개인사업자와 법인으로 나눈 요금 카드에 시작가와 달라지는 조건을 같이 적습니다" },
  { icon: Building2, title: "법인설립은 어떤 순서인지", desc: "설립 네 단계와 단계마다 준비할 서류를 한 화면에 안내합니다" },
  { icon: CalendarClock, title: "신고 기한이 언제인지", desc: "연도를 적지 않은 세무 일정이라 지난 안내가 첫 화면에 남지 않습니다" },
  { icon: Phone, title: "바로 연락하는 방법", desc: "휴대폰 화면 아래에 전화 · 카카오톡 · 블로그 버튼을 고정해 보던 자리에서 바로 묻게 합니다" },
];

const DOES: Item[] = [
  { icon: Gauge, title: "빠른 속도", desc: "사진은 WebP 로 화면 폭에 맞게 줄이고 무거운 영상과 숫자가 올라가는 효과는 넣지 않습니다. 휴대폰 데이터로 들어온 손님도 첫 화면을 바로 봅니다" },
  { icon: FileSearch, title: "서비스별 페이지", desc: "기장 대리 · 신고와 절세 · 세무조사 대응 · 법인설립 · 양도 상속 증여를 각각 한 쪽으로 나눕니다. 서비스 검색어로 들어올 자리가 생기고, 등급에 따라 라이트 3쪽 · 스탠다드 5쪽 · 프리미엄 10쪽으로 넣습니다" },
  { icon: Search, title: "검색 · AI 기본 세팅", desc: "페이지마다 제목과 설명, 세무 사무소 구조화 데이터, 자주 묻는 질문, sitemap · RSS · llms.txt 를 넣고 네이버 서치어드바이저와 구글 서치콘솔에 등록합니다" },
  { icon: KeyRound, title: "대표님이 직접 가지는 홈페이지", desc: "도메인과 서버는 대표님 명의로 등록하고 계정도 대표님이 가지십니다. 요금표 · 공지 · 세무 일정은 월 관리에서 고쳐 드리고 계약이 끝나도 홈페이지는 그대로 대표님 것입니다" },
];

const SIAN_PAGES = ["홈 (인사 · 요금 · 자주 묻는 질문 · 오시는 길)", "기장 대리", "신고와 절세", "세무조사 대응", "법인설립", "양도 · 상속 · 증여", "세무 블로그"];

const STEPS: { title: string; desc: string }[] = [
  { title: "시안 확인", desc: "아래 세무 시안을 둘러보고 남길 구성과 바꿀 구성을 고릅니다" },
  { title: "상담", desc: "상담 세무사 소개 · 기장료 안내 방식 · 사진 · 맡는 서비스를 확인합니다" },
  { title: "문구와 사진 교체", desc: "사무소 정보로 바꾼 초안을 보내 드리고 대표님이 문구를 확인하십니다" },
  { title: "오픈", desc: "계약금 입금일부터 15영업일 안에 대표님 명의 도메인으로 엽니다. 오픈 뒤 3개월은 오류 수정이 무상입니다" },
];

const FAQ = [
  { q: "세무사 광고 규정에 걸릴 문구는 어떻게 하나요?", a: "최상급 표현, 결과를 약속하는 문장, 이전 경력을 앞세우는 문구, 무료를 미끼로 쓰는 문구는 처음부터 넣지 않고 씁니다. 규정 원문과의 최종 대조는 대표님께서 하시고, 확인하신 문구로만 엽니다" },
  { q: "기장료를 홈페이지에 적어야 하나요?", a: "적을지 말지는 대표님이 정하십니다. 적으신다면 시작가와 금액이 달라지는 조건을 같이 안내해 손님이 상담 전에 범위를 알 수 있게 합니다" },
  { q: "사무소 사진이 없어도 시작할 수 있나요?", a: "휴대폰으로 찍으신 사진으로 시작할 수 있고 촬영 가이드를 보내 드립니다. 시안의 사진은 AI 로 만든 가상 사진이라 실제 홈페이지에는 쓰지 않습니다" },
  { q: "지금 쓰는 홈페이지가 있으면 어떻게 하나요?", a: "먼저 휴대폰에서 속도와 구성을 재 보고 남길 것과 바꿀 것을 정리해 드립니다. 이 쪽의 분석 · 개선안 사례가 그렇게 정리한 예입니다" },
  { q: "검색 순위나 AI 답변에 꼭 나오나요?", a: "순위와 AI 답변 노출은 약속드리지 않습니다. 검색이 읽을 수 있는 구조와 기본 등록까지 해 드리고, 결과는 각 플랫폼의 판단과 경쟁 상황에 따라 달라집니다" },
];

const LD = [
  webPageLd({ path: PATH, type: "WebPage", name: `${TITLE} | 하랑마케팅`, description: DESC, dateModified: updatedAt(PATH) }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "홈페이지 제작", path: "/services/homepage" },
    { name: "세무사 홈페이지", path: PATH },
  ]),
  faqLd(FAQ, URL),
];

function Cards({ items, cols }: { items: Item[]; cols: string }) {
  return (
    <div className={`mt-6 grid grid-cols-1 gap-4 ${cols}`}>
      {items.map((it) => (
        <div key={it.title} className="w-card min-w-0 p-5 md:p-6">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--w-primary)" }}>
            <it.icon size={16} strokeWidth={2.5} color="#fff" />
          </span>
          <h3 className="w-title-3 mt-3" style={{ color: "var(--w-label-strong)" }}>{it.title}</h3>
          <p className="w-body-2 mt-1.5" style={{ color: "var(--w-label-alt)" }}>{it.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default function TaxHomepagePage() {
  const audit = siteAuditCase("tax-audit-1");
  const stats = [
    { label: "라이트하우스 성능", value: "99", unit: "점" },
    { label: "접근성", value: "100", unit: "점" },
    { label: "첫 화면 큰 요소", value: "1.95", unit: "초" },
    { label: "한 번 열 때 받는 양", value: "182", unit: "KB" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-[104px] md:pt-[108px]" style={{ background: "var(--w-bg-alt)" }}>
        <JsonLd data={LD} />
        <div className="mx-auto max-w-[1100px] px-5 py-12 md:py-16">
          <nav className="w-caption-1 mb-4" style={{ color: "var(--w-label-alt)" }} aria-label="현재 위치">
            <Link href="/services/homepage" className="hover:underline">홈페이지 제작</Link>
            <span className="mx-1.5">/</span>
            <span>세무사 홈페이지</span>
          </nav>

          {/* 소개 */}
          <section className="mb-14 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_420px]">
            <div className="min-w-0">
              <span className="w-chip w-chip-blue">
                <Calculator size={12} strokeWidth={2.5} />
                TAX OFFICE HOMEPAGE
              </span>
              <h1 className="w-heading-1 mt-3" style={{ color: "var(--w-label-strong)" }}>
                세무사 홈페이지,
                <br />
                손님이 상담 전에 먼저 확인하는 곳입니다
              </h1>
              <p className="w-body-1 mt-3 max-w-[620px]" style={{ color: "var(--w-label-alt)" }}>
                기장을 맡길 세무사를 찾는 대표님은 검색 결과와 홈페이지를 먼저 봅니다.
                누가 상담하는지, 매달 무엇을 해 주는지, 기장료가 대략 얼마인지가 바로 보여야 문의로 이어집니다.
                하랑은 세무 · 회계 사무소용 틀을 미리 만들어 두고 사무소에 맞게 바꿔 엽니다.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <a href={SIAN} target="_blank" rel="noopener noreferrer" className="w-btn w-btn-primary min-h-[44px]">
                  세무 시안 보기
                  <ExternalLink size={16} strokeWidth={2.5} />
                </a>
                <a href={SITE.kakaoChat} target="_blank" rel="noopener noreferrer" className="w-btn w-btn-secondary min-h-[44px]">
                  <MessageCircle size={16} strokeWidth={2.5} />
                  카카오톡 상담
                </a>
              </div>
            </div>
            <figure className="min-w-0">
              <div className="overflow-hidden rounded-2xl shadow-sm" style={{ border: "1px solid var(--w-line)", background: "#fff" }}>
                <Image
                  src="/portfolio/site-audit/tax-a-after-pc.webp"
                  alt="가상 세무법인 시안의 PC 첫 화면"
                  width={960}
                  height={600}
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="h-auto w-full"
                  priority
                />
              </div>
              <figcaption className="w-caption-1 mt-2" style={{ color: "var(--w-label-alt)" }}>
                시안 화면 · 업체명과 사진은 가상
              </figcaption>
            </figure>
          </section>

          {/* 손님이 보는 것 */}
          <section className="mb-14" aria-labelledby="tax-sees">
            <h2 id="tax-sees" className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>
              손님이 홈페이지에서 확인하는 여섯 가지
            </h2>
            <p className="w-body-2 mt-3 max-w-[720px]" style={{ color: "var(--w-label-alt)" }}>
              세무 상담 전에 손님이 묻는 질문은 거의 같습니다. 그 질문에 답하는 순서대로 첫 화면부터 문의 버튼까지 이어 붙였습니다.
            </p>
            <Cards items={SEES} cols="sm:grid-cols-2 lg:grid-cols-3" />
          </section>

          {/* 하랑이 해 주는 것 */}
          <section className="mb-14" aria-labelledby="tax-does">
            <h2 id="tax-does" className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>
              하랑이 해 드리는 것
            </h2>
            <Cards items={DOES} cols="md:grid-cols-2" />
            <div className="w-card mt-4 p-5">
              <h3 className="w-title-3" style={{ color: "var(--w-label-strong)" }}>문구는 세무사 광고 기준을 먼저 생각하고 씁니다</h3>
              <p className="w-body-2 mt-2" style={{ color: "var(--w-label-alt)" }}>
                최상급 표현, 결과를 약속하는 문장, 이전 경력을 앞세우는 문구, 무료를 미끼로 쓰는 문구는 처음부터 넣지 않습니다.
                최종 문구는 대표님께서 확인하신 뒤에 엽니다.
              </p>
            </div>
          </section>

          {/* 시안 */}
          <section className="mb-14" aria-labelledby="tax-sian">
            <h2 id="tax-sian" className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>
              세무 시안을 직접 눌러 보세요
            </h2>
            <p className="w-body-2 mt-3 max-w-[720px]" style={{ color: "var(--w-label-alt)" }}>
              가상의 세무법인으로 만든 스탠다드 기준 시안입니다. 홈 한 쪽에 대표 세무사 인사 · 요금 · 자주 묻는 질문 · 오시는 길을 담고 서비스 5쪽을 따로 두었습니다. 검색에는 잡히지 않게 막아 두었습니다.
            </p>
            <div className="w-card mt-6 grid grid-cols-1 gap-6 p-5 md:grid-cols-[1fr_200px] md:p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="w-title-3" style={{ color: "var(--w-label-strong)" }}>○○ 세무법인 B</h3>
                  <span className="w-chip w-chip-neutral">세무 · 회계</span>
                  <span className="w-chip w-chip-neutral">홈과 서비스 5쪽</span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {SIAN_PAGES.map((p) => (
                    <li key={p} className="rounded-lg px-2.5 py-1.5 text-[12px]" style={{ background: "var(--w-bg-alt)", color: "var(--w-label-alt)" }}>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {stats.map((s) => (
                    <div key={s.label} className="min-w-0 rounded-xl px-3 py-3" style={{ background: "var(--w-bg-alt)" }}>
                      <p className="w-caption-1" style={{ color: "var(--w-label-assistive)" }}>{s.label}</p>
                      <p className="w-title-2 w-num mt-1" style={{ color: "var(--w-label-strong)" }}>
                        {s.value}
                        <span className="w-label-2 ml-0.5" style={{ color: "var(--w-label-alt)" }}>{s.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>
                <p className="w-caption-1 mt-3" style={{ color: "var(--w-label-alt)" }}>
                  가상 시안 홈을 라이트하우스 휴대폰 기준으로 3회 잰 중앙값입니다 (2026.10.23). 서비스 쪽은 1.97초 · 206KB 였고, 실제 사무소 홈페이지는 사진과 내용에 따라 달라집니다.
                </p>
                <a href={SIAN} target="_blank" rel="noopener noreferrer" className="w-btn w-btn-primary mt-5 min-h-[44px]">
                  시안 둘러보기
                  <ExternalLink size={16} strokeWidth={2.5} />
                </a>
              </div>
              <figure className="mx-auto w-full max-w-[200px]">
                <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid var(--w-line)", background: "#fff" }}>
                  <Image
                    src="/portfolio/site-audit/tax-b-sian-m.webp"
                    alt="가상 세무법인 시안의 휴대폰 첫 화면"
                    width={390}
                    height={844}
                    sizes="200px"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="w-caption-1 mt-2 text-center" style={{ color: "var(--w-label-alt)" }}>
                  시안 화면 · 업체명과 사진은 가상
                </figcaption>
              </figure>
            </div>
          </section>

          {/* 분석 사례 */}
          {audit && (
            <section className="mb-14" aria-labelledby="tax-audit">
              <span className="w-chip w-chip-blue">
                <ScanSearch size={12} strokeWidth={2.5} />
                SITE AUDIT
              </span>
              <h2 id="tax-audit" className="w-heading-2 mt-3" style={{ color: "var(--w-label-strong)" }}>
                지금 쓰는 세무 홈페이지를 재 보면 이렇습니다
              </h2>
              <p className="w-body-2 mt-3 mb-6 max-w-[720px]" style={{ color: "var(--w-label-alt)" }}>
                고객 동의를 받아 상호와 지역을 가린 분석 · 개선안 사례입니다. 하랑이 만든 사이트가 아니고, 같은 화면 흐름을 하랑 틀로 새로 짜서 나란히 비교했습니다.
              </p>
              <SiteAuditCaseCard c={audit} showService={false} />
            </section>
          )}

          {/* 가격 */}
          <section className="mb-14" aria-labelledby="tax-price">
            <h2 id="tax-price" className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>제작 · 관리 가격</h2>
            <p className="w-body-2 mt-2 max-w-[760px]" style={{ color: "var(--w-label-alt)" }}>
              홈페이지 제작과 같은 가격표이고 제작비와 월 관리비 모두 부가세 별도입니다.
              서비스 쪽은 등급에 따라 라이트 3쪽 · 스탠다드 5쪽 · 프리미엄 10쪽이 들어갑니다. 위 시안이 스탠다드 5쪽 기준입니다.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {HOMEPAGE_TIERS.map((t) => (
                <div key={t.name} className="w-card flex flex-col p-5 md:p-6" style={t.rec ? { outline: "2px solid var(--w-primary)" } : undefined}>
                  <div className="flex items-center gap-2">
                    <p className="w-title-2" style={{ color: "var(--w-label-strong)" }}>{t.name}</p>
                    {t.rec && <span className="w-chip w-chip-blue">상담 기본</span>}
                  </div>
                  <p className="w-caption-1 mt-1" style={{ color: "var(--w-label-alt)" }}>{t.pages}</p>
                  <p className="w-title-1 w-num mt-3" style={{ color: "var(--w-label-strong)" }}>{t.build}</p>
                  <p className="w-label-1 w-num mt-1" style={{ color: "var(--w-primary)" }}>관리 {t.monthly}</p>
                  <ul className="mt-4 space-y-1.5">
                    {t.points.map((p) => (
                      <li key={p} className="w-body-2" style={{ color: "var(--w-label-alt)" }}>· {p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="w-caption-1 mt-3" style={{ color: "var(--w-label-alt)" }}>
              도메인 · 서버 실비는 대표님 명의로 직접 결제하십니다.
            </p>
          </section>

          {/* 진행 순서 */}
          <section className="mb-14" aria-labelledby="tax-steps">
            <h2 id="tax-steps" className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>진행 순서</h2>
            <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="w-card p-5">
                  <p className="w-caption-1 w-num font-bold" style={{ color: "var(--w-primary)" }}>{i + 1}단계</p>
                  <p className="w-title-3 mt-1" style={{ color: "var(--w-label-strong)" }}>{s.title}</p>
                  <p className="w-body-2 mt-1" style={{ color: "var(--w-label-alt)" }}>{s.desc}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* 자주 묻는 질문 */}
          <section aria-labelledby="tax-faq">
            <h2 id="tax-faq" className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>자주 묻는 질문</h2>
            <div className="mt-6 space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="w-card p-5">
                  <summary className="w-title-3 cursor-pointer" style={{ color: "var(--w-label-strong)" }}>{f.q}</summary>
                  <p className="w-body-2 mt-2" style={{ color: "var(--w-label-alt)" }}>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* 상담 */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-[16px] px-7 py-8" style={{ background: "var(--w-label-strong)" }}>
            <div className="min-w-0">
              <p className="w-title-2" style={{ color: "#fff" }}>사무소 홈페이지, 지금 상태부터 같이 보겠습니다</p>
              <p className="w-body-2 mt-1.5" style={{ color: "var(--w-label-disable)" }}>
                지금 쓰는 주소나 블로그를 알려 주시면 휴대폰 속도와 구성을 먼저 재 보고 필요한 쪽부터 정리해 드립니다
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/contact" className="w-btn w-btn-primary min-h-[44px]">
                상담 신청
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link href="/services/homepage#gallery" className="w-btn w-btn-secondary min-h-[44px]">
                <BookOpen size={16} strokeWidth={2.5} />
                다른 업종 시안
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
