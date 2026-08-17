import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import FaqAccordion from "../components/FaqAccordion";
import { SITE, ORG_ID, faqLd, breadcrumbLd, webPageLd } from "../lib/seo";
import {
  STUDIO, PLANS, CHEAPEST, YEARLY, PRICIEST, won,
  FEATURES, MEASURED, VS_ONLINE, FOR_WHOM, STUDIO_FAQ, SPECS,
  SMARTSCREEN_STEPS,
} from "../lib/studio";
import {
  MonitorDown, Check, X, ArrowRight, Clock, ShieldCheck, Info,
  Zap, MessageCircle, Phone, Download, Users, Star,
} from "lucide-react";

/**
 * 하랑 스튜디오 제품 페이지
 *
 * 대행 서비스가 아니라 자사 소프트웨어라 /services 아래가 아닌 최상위에 둔다.
 * 노리는 검색어는 '동영상 gif 변환 프로그램' · '사진 세탁 프로그램' 이다.
 *
 * 검색 순위 상승이나 저품질 회피를 약속하는 문장은 넣지 말 것.
 * 확인할 방법이 없는 주장이라 환불 분쟁의 빌미가 된다. (FAQ 에 그대로 명시해 두었다)
 */

const PATH = "/studio";
const URL = `${SITE.base}${PATH}`;

const KAKAO = SITE.kakaoChat;
const TEL = `tel:${SITE.phone}`;

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${URL}#software`,
    name: STUDIO.name,
    alternateName: [STUDIO.nameEn, "하랑스튜디오"],
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "사진·영상 일괄 편집",
    operatingSystem: "Windows 10, Windows 11",
    softwareVersion: STUDIO.version,
    fileSize: `${STUDIO.fileSizeMb}MB`,
    inLanguage: "ko-KR",
    url: URL,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    description:
      "현장 사진을 한 번에 보정하고 영상을 GIF로 바꾸는 윈도우 프로그램입니다. " +
      "파일을 외부 서버에 올리지 않고 사용자 컴퓨터 안에서 처리합니다. " +
      "사진 세탁, 워터마크, 비포·애프터 붙이기, 영상에서 사진 뽑기, 영상 압축을 하나로 묶었습니다.",
    featureList: FEATURES.map((f) => f.title),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KRW",
      lowPrice: CHEAPEST.price,
      highPrice: PRICIEST.price,
      offerCount: PLANS.length,
      offers: PLANS.map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: p.price,
        priceCurrency: "KRW",
        description: `${p.note} PC ${p.pcs}대.`,
        availability: "https://schema.org/InStock",
        seller: { "@id": ORG_ID },
      })),
    },
    // 평점은 넣지 않는다. 자사 제품에 자사가 매긴 별점은 구글이 인정하지 않는다.
  },
  webPageLd({
    path: PATH,
    name: "하랑 스튜디오 — 동영상 GIF 변환 · 사진 세탁 프로그램",
    description:
      `현장 사진 ${STUDIO.trialCount}장을 1분 안에 정리하고 영상을 움짤로 바꾸는 윈도우 프로그램. ` +
      `업로드 없이 내 컴퓨터에서 처리합니다. 무료 ${STUDIO.trialCount}장 체험 후 한 달 ${won(CHEAPEST.price)}원.`,
  }),
  faqLd(STUDIO_FAQ, URL),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "하랑 스튜디오", path: PATH },
  ]),
];

export default function StudioPage() {
  return (
    <>
      <JsonLd data={LD} />
      <Header />

      {/* 헤더가 고정이라 본문을 그만큼 내린다. 사이트 공통 값 */}
      <main className="pt-[104px] md:pt-[108px]">
        {/* ───────────────────────── 첫 화면 ───────────────────────── */}
        <section className="bg-gradient-to-b from-slate-50 to-white pt-10 pb-12 md:pt-16 md:pb-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-700 ring-1 ring-blue-100">
                  <Zap size={12} strokeWidth={2.5} />
                  마케팅 대행사가 직접 만들어 매일 쓰는 도구
                </div>

                <h1 className="mt-4 text-[28px] leading-[1.25] font-black tracking-tight text-gray-900 md:text-[40px] md:leading-[1.2]">
                  동영상 GIF 변환,
                  <br />
                  <span className="text-blue-600">사진 세탁</span>까지 한 번에
                </h1>

                <p className="speakable mt-4 text-[15px] leading-relaxed text-gray-600 md:text-base">
                  하랑 스튜디오는 현장 사진 {STUDIO.trialCount}장을 1분 안에 보정하고, 영상을 끌어다 놓으면
                  움짤로 바꿔주는 윈도우 프로그램입니다. 파일을 어디에도 올리지 않고 내 컴퓨터
                  안에서 처리하므로 클라이언트 사진이 밖으로 나가지 않습니다.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {["설치 없음", "인터넷 없어도 동작", `무료 ${STUDIO.trialCount}장`].map((t) => (
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
                    href={KAKAO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <Download size={16} strokeWidth={2.2} />
                    무료 체험판 받기
                  </a>
                  <a
                    href="#price"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-50"
                  >
                    가격 보기
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </a>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  카카오톡으로 파일 하나 보내드립니다 · 한 달 {won(CHEAPEST.price)}원 ·
                  1년 {won(YEARLY.price)}원
                </p>
              </div>

              {/* 실제 화면이 넘어가는 움짤 */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                <img
                  src="/studio/demo-flow.gif"
                  alt="하랑 스튜디오 사용 순서 — 사진을 넣고 세탁 강도를 고르고 실행합니다"
                  width={1000}
                  height={633}
                  loading="eager"
                  decoding="async"
                  className="block w-full"
                />
                <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
                  사진을 넣고, 강도를 고르고, 실행을 누르면 끝입니다
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── 측정값 ───────────────────────── */}
        <section className="bg-gray-900 py-10 md:py-14">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-lg font-black text-white md:text-xl">
              사무실 노트북으로 직접 재봤습니다
            </h2>
            <p className="mt-1.5 text-sm text-gray-400">
              말로만 하면 믿기 어려우니 같은 일을 손으로 했을 때와 나란히 두었습니다.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {MEASURED.map((m) => (
                <div key={m.job} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 md:p-5">
                  <div className="text-sm font-bold text-white">{m.job}</div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                        손으로
                      </div>
                      <div className="mt-0.5 text-sm text-gray-400 line-through">{m.manual}</div>
                    </div>
                    <ArrowRight size={16} className="shrink-0 text-blue-400" strokeWidth={2.2} />
                    <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                        프로그램
                      </div>
                      <div className="mt-0.5 text-base font-black text-white">{m.withApp}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────── 기능 ───────────────────────── */}
        <section className="bg-white py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-sm ring-1 ring-blue-800/20">
                <MonitorDown size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 md:text-2xl">무엇이 되나요</h2>
                <p className="text-sm text-gray-500">여섯 가지가 프로그램 하나에 들어 있습니다</p>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              {FEATURES.map((f, i) => (
                <article
                  key={f.id}
                  id={f.id}
                  className="scroll-mt-20 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* 홀수 번째는 사진을 오른쪽에 두어 눈이 지그재그로 흐르게 한다 */}
                    <div className={`p-5 md:p-7 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                      <span className="inline-block rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                        {f.tag}
                      </span>
                      <h3 className="mt-3 text-lg font-black text-gray-900 md:text-xl">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.desc}</p>
                      <ul className="mt-4 space-y-1.5">
                        {f.points.map((p) => (
                          <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check size={15} className="mt-0.5 shrink-0 text-blue-600" strokeWidth={2.5} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={`bg-gray-50 p-4 md:p-5 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                      <img
                        src={`/studio/${f.shot}`}
                        alt={f.alt}
                        width={1500}
                        height={950}
                        loading="lazy"
                        decoding="async"
                        className="block w-full rounded-xl ring-1 ring-gray-200"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* 프로그램이 만든 결과물 */}
            <div className="mt-8 overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-200 md:mt-10">
              <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr]">
                <img
                  src="/studio/demo-gif.gif"
                  alt="현장 영상을 GIF로 바꾼 결과"
                  width={560}
                  height={316}
                  loading="lazy"
                  decoding="async"
                  className="block w-full"
                />
                <div className="p-5 md:p-7">
                  <span className="inline-block rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-gray-500 ring-1 ring-gray-200">
                    결과물 예시
                  </span>
                  <h3 className="mt-3 text-lg font-black text-gray-900">
                    왼쪽 움짤도 이 프로그램으로 만들었습니다
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    9초짜리 현장 영상을 그대로 넣어서 뽑았습니다. 목표 용량을 20MB로 두면
                    그 아래로 들어올 때까지 크기와 색상을 알아서 낮춥니다. 블로그에 올릴 때
                    용량 때문에 막히는 일이 없습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── 무료 사이트와의 차이 ───────────────────────── */}
        <section className="bg-gray-50 py-10 md:py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-xl font-black text-gray-900 md:text-2xl">
              무료 변환 사이트로 하면 되지 않나요
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              저희도 한동안 그렇게 썼습니다. 그러다 세 가지에서 막혔습니다. 파일을 올리고
              기다려야 하고, 무료는 용량 제한이 걸리고, 무엇보다{" "}
              <b className="text-gray-900">클라이언트 현장 사진이 어디인지 모를 외부 서버로 올라갑니다.</b>
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[520px] overflow-hidden rounded-2xl bg-white text-sm shadow-sm ring-1 ring-gray-200">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">
                      항목
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">
                      무료 변환 사이트
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-blue-600">
                      하랑 스튜디오
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {VS_ONLINE.map((r) => (
                    <tr key={r.item} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3 font-bold text-gray-700">{r.item}</td>
                      <td className="px-4 py-3 text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                          <X size={13} className="shrink-0 text-gray-300" strokeWidth={2.5} />
                          {r.online}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        <span className="inline-flex items-center gap-1.5">
                          <Check size={13} className="shrink-0 text-blue-600" strokeWidth={2.5} />
                          {r.studio}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ───────────────────────── 누가 쓰면 좋은가 ───────────────────────── */}
        <section className="bg-white py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 shadow-sm ring-1 ring-emerald-800/20">
                <Users size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-black text-gray-900 md:text-2xl">
                이런 분들이 쓰십니다
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {FOR_WHOM.map((w) => (
                <div key={w.who} className="rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-200">
                  <div className="text-base font-black text-gray-900">{w.who}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{w.why}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────── 가격 ───────────────────────── */}
        <section id="price" className="scroll-mt-20 bg-gray-50 py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm ring-1 ring-orange-700/20">
                <Star size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-black text-gray-900 md:text-2xl">가격</h2>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              먼저 무료 {STUDIO.trialCount}장을 써보시고 결정하셔도 됩니다. 자동 결제가 아니라
              기간이 끝나면 그냥 멈춥니다. 해지하실 일이 없습니다.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PLANS.map((p) => (
                <div
                  key={p.id}
                  className={`relative rounded-2xl bg-white p-5 shadow-sm ${
                    p.best ? "ring-2 ring-blue-600" : "ring-1 ring-gray-200"
                  }`}
                >
                  {p.best && (
                    <span className="absolute -top-2.5 left-5 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-black text-white">
                      추천
                    </span>
                  )}
                  <div className="text-sm font-black text-gray-900">{p.name}</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black tracking-tight text-gray-900">
                      {won(p.price)}
                    </span>
                    <span className="text-sm font-bold text-gray-400">원</span>
                  </div>
                  {p.perMonth && p.perMonth !== p.price && (
                    <div className="mt-0.5 text-xs font-bold text-blue-600">
                      한 달 {won(p.perMonth)}원꼴
                    </div>
                  )}
                  {p.pcs > 1 && (
                    <div className="mt-2 inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-black text-indigo-700">
                      PC {p.pcs}대
                    </div>
                  )}
                  <p className="mt-2.5 text-xs leading-relaxed text-gray-500">{p.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-white p-4 text-xs text-gray-500 ring-1 ring-gray-200">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" strokeWidth={2.2} />
                자동 결제 없음
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} className="text-blue-600" strokeWidth={2.2} />
                만료 전 미리 안내
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MonitorDown size={14} className="text-indigo-600" strokeWidth={2.2} />
                새 버전은 프로그램이 알아서 받음
              </span>
            </div>
          </div>
        </section>

        {/* ───────────────────────── 솔직하게 ───────────────────────── */}
        <section className="bg-white py-10 md:py-14">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200 md:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-sm ring-1 ring-amber-800/20">
                  <Info size={16} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-base font-black text-gray-900 md:text-lg">
                    미리 말씀드릴 부분
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    이 프로그램은 사진과 영상을 정리하는 시간을 줄여주는 도구입니다.
                    검색 순위가 오른다거나 특정 판정을 피해 간다는 이야기는 드리지 않습니다.
                    각 플랫폼의 기준은 공개되어 있지 않고 저희도 확인할 방법이 없습니다.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    다만 {STUDIO.trialCount}장이 1분 안에 끝난다는 것과 결과물이 서로 다른
                    파일이라는 것, 이 두 가지는 프로그램이 직접 보여드립니다.
                    무료 {STUDIO.trialCount}장으로 그 부분만 확인해 보시고 판단하시면 됩니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 사양 */}
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {SPECS.map((s) => (
                <div key={s.label} className="rounded-xl bg-gray-50 p-3.5 ring-1 ring-gray-200">
                  <div className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                    {s.label}
                  </div>
                  <div className="mt-1 text-sm font-bold text-gray-900">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────── 윈도우 보안 경고 ─────────────── */}
        {/* 받으신 분이 처음 부딪히는 벽이라 FAQ 에 묻지 않고 크게 둔다 */}
        <section id="smartscreen" className="scroll-mt-20 bg-gray-50 py-10 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 shadow-sm ring-1 ring-blue-800/20">
                <ShieldCheck size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 md:text-2xl">
                  파란 경고창이 뜨면 이렇게 하세요
                </h2>
                <p className="text-sm text-gray-500">
                  처음 실행하실 때 한 번 나옵니다. 두 번만 누르시면 됩니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
              <img
                src="/studio/smartscreen-guide.png"
                alt="Windows의 PC 보호 경고창에서 추가 정보와 실행을 누르는 순서"
                width={1400}
                height={900}
                loading="lazy"
                decoding="async"
                className="block w-full rounded-2xl shadow-sm ring-1 ring-gray-200"
              />

              <div className="space-y-3">
                {SMARTSCREEN_STEPS.map((s, i) => (
                  <div key={s.step} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white">
                        {i + 1}
                      </span>
                      <div>
                        <div className="text-sm font-black text-gray-900">{s.step}</div>
                        <p className="mt-1 text-xs leading-relaxed text-gray-500">{s.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                  <div className="text-xs font-black uppercase tracking-wider text-gray-400">
                    왜 이게 뜨나요
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
                    윈도우는 코드 서명 인증서가 없는 프로그램이면 일단 이 창을 띄웁니다.
                    개인이 만든 프로그램은 거의 다 이렇게 나옵니다.
                    저희도 인증서를 준비하고 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 받은 파일이 맞는지 직접 확인하실 수 있게 지문을 공개한다 */}
            <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-sm font-black text-gray-900">
                  받으신 파일이 맞는지 확인하는 법
                </span>
                <span className="text-xs text-gray-400">
                  버전 {STUDIO.version} · 약 {STUDIO.fileSizeMb}MB
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                걱정되시면 파일 지문을 직접 맞춰보실 수 있습니다. 명령 프롬프트에{" "}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-800">
                  certutil -hashfile &quot;파일경로&quot; SHA256
                </code>{" "}
                을 입력하시면 나오는 값이 아래와 같아야 합니다.
              </p>
              <div className="mt-3 overflow-x-auto">
                <code className="block whitespace-nowrap rounded-xl bg-gray-900 px-4 py-3 font-mono text-[11px] leading-relaxed text-emerald-300 md:text-xs">
                  {STUDIO.sha256}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── FAQ ───────────────────────── */}
        <FaqAccordion
          items={STUDIO_FAQ}
          title="하랑 스튜디오 자주 묻는 질문"
          subtitle="구매 전에 가장 많이 여쭤보시는 것들입니다"
        />

        {/* ───────────────────────── 맺음 ───────────────────────── */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 text-center md:px-6">
            <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              먼저 {STUDIO.trialCount}장 써보시고 결정하세요
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-blue-50 md:text-base">
              카카오톡으로 파일 하나 보내드립니다. 설치 과정 없이 더블클릭하면 바로 열립니다.
              실제 프로젝트 하나를 통째로 돌려보기에 충분한 양입니다.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
              <a
                href={KAKAO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-blue-700 shadow-sm transition hover:bg-blue-50"
              >
                <MessageCircle size={16} strokeWidth={2.2} />
                카카오톡으로 체험판 받기
              </a>
              <a
                href={TEL}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500/30 px-6 py-3.5 text-sm font-black text-white ring-1 ring-white/30 transition hover:bg-blue-500/40"
              >
                <Phone size={16} strokeWidth={2.2} />
                {SITE.phone}
              </a>
            </div>

            <p className="mt-5 text-xs text-blue-100">
              마케팅 대행도 함께 필요하시면{" "}
              <Link href="/services" className="font-black underline underline-offset-2">
                서비스 안내
              </Link>
              를 봐주세요
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
