import Link from "next/link";
import {
  Users, PenLine, Megaphone, ShieldCheck, Ban, Stethoscope,
  Search, ClipboardList, CalendarCheck, FileCheck2, MessageSquare,
  Phone, ArrowRight, Store,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import FaqAccordion from "../../components/FaqAccordion";
import JsonLd from "../../components/JsonLd";
import {
  SITE, ORG_ID, LOCAL_ID, faqLd, breadcrumbLd, webPageLd, howToLd, type FaqItem,
} from "../../lib/seo";
import { TRACK_RECORD } from "../../lib/track-record";

/**
 * 체험단 · 리뷰 마케팅 랜딩.
 *
 * 왜 만들었나 (H-0118 1번) — 광고 키워드 실측에서 체험단 계열 월 검색량이
 * 63,000 인데 착지할 페이지가 없었다. 체험단은 app/services/page.tsx 의
 * 서비스 카드 한 칸으로만 존재했다.
 *
 * 상품 정의를 새로 만들지 않았다. 모집 규모 · 기간 · 산출은 전부
 * app/services/page.tsx 의 review 항목에 이미 발행된 값이고,
 * 진행 기록은 app/lib/track-record.ts 에서 세어서 쓴다. 손으로 적지 않는다.
 *
 * 가격은 넣지 않는다. 화면에 적힌 숫자는 대표가 한 약속이 되므로
 * 새 가격 표기는 결재 사항이다.
 */

const PATH = "/services/review";
const URL = `${SITE.base}${PATH}`;
const CTA_HREF = "/contact?service=review";
const KAKAO_HREF = SITE.kakaoChat;

/* 실제로 체험단을 진행한 기록 — 세어서 쓴다.
   track-record.ts 가 바뀌면 이 숫자도 같이 바뀐다. */
const REVIEW_GROUPS = TRACK_RECORD
  .map((g) => ({
    name: g.name,
    count: g.items.filter((it) => it.work.includes("체험단")).length,
  }))
  .filter((g) => g.count > 0)
  .sort((a, b) => b.count - a.count);

const REVIEW_TOTAL = REVIEW_GROUPS.reduce((sum, g) => sum + g.count, 0);

/* 두 갈래. 둘 다 진행하지만 글이 남는 자리가 다르다 */
const KINDS = [
  {
    icon: PenLine,
    title: "블로그 체험단",
    lead: "검색에 남습니다",
    body: "네이버 블로그에 방문 후기가 올라갑니다. 지역과 업종을 함께 쓴 글이라 나중에 검색으로 찾아오는 손님이 읽습니다. 오늘 반응은 조용한 대신 반년 뒤에도 남아 있습니다.",
    fit: "검색으로 찾아오는 손님이 중요한 매장",
  },
  {
    icon: Megaphone,
    title: "인플루언서 체험단",
    lead: "지금 퍼집니다",
    body: "팔로워 1만에서 30만 사이의 방문형 인플루언서를 섭외합니다. 릴스와 피드로 올라가고 반응이 그 주에 옵니다. 대신 며칠 지나면 타임라인 아래로 내려갑니다.",
    fit: "새로 열었거나 신메뉴를 알려야 하는 매장",
  },
];

/* 고객이 겪는 순서 */
const STEPS = [
  {
    icon: Search,
    name: "무엇을 남길지 정합니다",
    text: "메뉴인지 공간인지 시술인지부터 정합니다. 여기가 흔들리면 열 명이 와도 열 개의 다른 글이 남습니다.",
  },
  {
    icon: Users,
    name: "사람을 고릅니다",
    text: "지역과 방문 가능 여부, 지난 글의 성격을 보고 고릅니다. 숫자만 큰 계정은 부르지 않습니다.",
  },
  {
    icon: CalendarCheck,
    name: "방문을 준비합니다",
    text: "일정을 나눠 잡고 안내자료와 촬영 가이드를 만들어 드립니다. 같은 날 몰리면 매장이 버티지 못합니다.",
  },
  {
    icon: FileCheck2,
    name: "올라온 글을 확인합니다",
    text: "약속한 항목이 들어갔는지, 대가를 받은 사실이 표시됐는지 확인합니다. 빠지면 다시 요청합니다.",
  },
  {
    icon: MessageSquare,
    name: "리뷰를 관리합니다",
    text: "답글 방향을 잡아 드리고 부정 리뷰가 올라오면 어떻게 답할지 같이 정합니다. 월 2회 점검합니다.",
  },
];

/* 하지 않는 것. 파는 쪽이 아니라 안 파는 쪽을 먼저 적는다 */
const NEVER = [
  {
    icon: Ban,
    title: "리뷰를 사지 않습니다",
    body: "방문하지 않은 사람이 쓴 글은 남기지 않습니다. 순위가 잠깐 오르더라도 플랫폼이 잡아내면 매장 계정이 같이 다칩니다.",
  },
  {
    icon: ShieldCheck,
    title: "대가를 숨기지 않습니다",
    body: "무료 제공이나 원고료를 받고 쓴 글에는 그 사실을 글 안에 표시하게 합니다. 표시가 빠진 글은 수정을 요청합니다.",
  },
  {
    icon: Stethoscope,
    title: "병원에는 체험단을 하지 않습니다",
    body: "치료경험담은 의료법 제56조 제2항이 금지하는 항목이고, 대가를 주고 후기를 쓰게 하는 것은 제27조 제3항에 걸릴 수 있습니다. 그리고 그 책임은 대행사가 아니라 병원에 갑니다.",
  },
  {
    icon: Store,
    title: "필요 없는 매장에는 권하지 않습니다",
    body: "후기가 이미 쌓인 곳에서는 체험단을 더 해도 크게 달라지지 않습니다. 그런 매장에는 리뷰 관리나 다른 항목을 먼저 말씀드립니다.",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "체험단은 몇 명 정도 부르나요?",
    a: "월 10명에서 30명 사이에서 업종과 매장 규모에 맞춰 정합니다. 숫자를 먼저 정하지 않고 하루에 몇 팀까지 받을 수 있는지부터 여쭤봅니다. 좌석이 스무 개인 곳에 서른 명을 한 주에 몰아넣으면 정작 오시는 손님이 자리를 못 잡습니다.",
  },
  {
    q: "언제부터 글이 올라오나요?",
    a: "모집과 섭외에 보통 1주에서 2주가 걸리고, 방문한 뒤 글이 올라오기까지 다시 며칠이 걸립니다. 리뷰가 눈에 띄게 쌓이는 것은 대체로 한 달째부터입니다. 계약한 주에 후기가 쏟아지는 방식이 아닙니다.",
  },
  {
    q: "블로그와 인스타그램 중 어느 쪽이 낫나요?",
    a: "남는 자리가 다릅니다. 블로그는 검색에 남아 반년 뒤에도 읽히고, 인스타그램은 그 주에 반응이 오는 대신 금방 내려갑니다. 검색으로 찾아오는 손님이 중요한 매장은 블로그부터, 새로 열었거나 알려야 할 것이 생긴 매장은 인스타그램부터 씁니다. 둘 다 하는 경우도 많습니다.",
  },
  {
    q: "후기가 마음에 들지 않게 쓰이면 어떻게 하나요?",
    a: "약속한 항목이 빠졌거나 사실과 다른 부분은 수정을 요청합니다. 다만 다녀간 사람의 감상 자체를 바꿔 달라고는 하지 않습니다. 그건 광고지 후기가 아니고 읽는 사람이 먼저 알아봅니다. 그래서 방문 전에 무엇을 보여 드릴지 맞추는 단계에 시간을 더 씁니다.",
  },
  {
    q: "병원이나 한의원도 체험단이 되나요?",
    a: "권하지 않습니다. 치료경험담은 의료법이 금지하는 항목이고, 대가를 주고 후기를 쓰게 하면 소개와 알선, 유인을 사주한 것이 될 수 있습니다. 그리고 그 책임은 대행사가 아니라 병원에 갑니다. 병원은 체험단 대신 진료 과정과 장비, 원장 이력처럼 사실로 확인되는 것으로 씁니다.",
  },
  {
    q: "체험단에 참여하고 싶은데 어떻게 신청하나요?",
    a: "이 페이지는 매장을 운영하시는 사장님께 드리는 안내입니다. 하랑마케팅은 체험단 모집 플랫폼이 아니라 매장을 대신해 사람을 섭외하는 대행사라, 참여자를 상시로 모집하는 창구는 따로 두고 있지 않습니다.",
  },
];

const LD = [
  webPageLd({
    path: PATH,
    name: "블로그 체험단 · 인플루언서 체험단 모집 대행",
    description:
      "매장에 방문할 블로거와 인플루언서를 모집하고 후기가 올라오는 것까지 대표가 직접 진행하는 체험단 대행입니다.",
  }),
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "체험단 모집 대행",
    description:
      "블로그 체험단과 인플루언서 체험단 모집, 방문 일정 조율, 후기 확인, 리뷰 관리 대행. 실제 방문한 참여자만 섭외하고 대가를 받은 글에는 그 사실을 표시하게 합니다.",
    serviceType: "체험단 모집 대행",
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
      description: "상담과 진단 비용 0원. 모집 규모와 기간에 따라 견적을 드립니다.",
    },
  },
  howToLd({
    path: PATH,
    name: "체험단 진행 순서",
    description: "매장 체험단을 무엇부터 정하고 어떤 순서로 진행하는지 5단계로 정리했습니다.",
    steps: STEPS.map((s) => ({ name: s.name, text: s.text })),
  }),
  faqLd(FAQS, URL),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "체험단 · 리뷰 마케팅", path: PATH },
  ]),
];

export default function ReviewServicePage() {
  return (
    <>
      <JsonLd data={LD} />
      <Header />

      <main>
        {/* 히어로 */}
        <section className="bg-gray-950 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 mb-6">
              <Users size={14} className="text-blue-300" strokeWidth={2.5} />
              <span className="text-xs md:text-[13px] font-bold text-blue-200">체험단 · 리뷰 마케팅</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">
              블로그 체험단 ·<br className="md:hidden" /> 인플루언서 체험단 모집 대행
            </h1>

            <p className="speakable text-base md:text-lg text-gray-300 leading-relaxed mb-8 max-w-3xl">
              실제로 방문한 사람이 실제로 쓴 글만 남깁니다. 매장에 맞는 블로거와 인플루언서를
              찾아 섭외하고, 방문 일정을 나눠 잡고, 올라온 글까지 확인하는 것을 하랑 대표가
              직접 합니다. 리뷰를 사지 않습니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={CTA_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 md:px-6 md:py-3.5 text-sm md:text-base font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                무료로 구성안 받기
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <a
                href={KAKAO_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 md:px-6 md:py-3.5 text-sm md:text-base font-bold text-white ring-1 ring-white/20 hover:bg-white/15 transition-colors"
              >
                <Phone size={18} strokeWidth={2.5} />
                카카오톡으로 문의
              </a>
            </div>

            <p className="mt-6 text-xs md:text-[13px] text-gray-500">
              매장을 운영하시는 사장님께 드리는 안내입니다. 체험단 참여를 찾아오셨다면 이 페이지가 아닙니다.
            </p>
          </div>
        </section>

        <AnswerBlock
          question="체험단 대행은 무엇을 해주나요?"
          answer="하랑마케팅의 체험단 대행은 매장 업종에 맞는 블로거와 인플루언서를 모집하고, 방문 일정과 안내자료를 준비하고, 올라온 글을 확인하는 것까지 대표가 직접 진행합니다. 모집 규모는 월 10명에서 30명 사이에서 업종에 맞춰 정하고, 첫 체험단은 보통 1주에서 2주 안에 시작합니다."
          facts={[
            { label: "모집 규모", value: "월 10~30명" },
            { label: "시작까지", value: "1~2주" },
            { label: "리뷰 점검", value: "월 2회" },
            { label: "상담 비용", value: "0원" },
          ]}
        />

        {/* 두 갈래 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              두 갈래가 있습니다
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8 md:mb-10 max-w-2xl">
              둘 다 진행합니다. 어느 쪽이 더 좋은가가 아니라 글이 남는 자리가 다릅니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {KINDS.map((k) => (
                <div
                  key={k.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center mb-4">
                    <k.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">{k.title}</h3>
                  <p className="text-sm font-bold text-blue-600 mb-3">{k.lead}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{k.body}</p>
                  <div className="rounded-lg bg-gray-50 px-3 py-2.5">
                    <p className="text-xs md:text-[13px] text-gray-700">
                      <span className="font-bold text-gray-900">이런 매장</span> · {k.fit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 진행 순서 */}
        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              진행 순서
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8 md:mb-10 max-w-2xl">
              사람을 부르는 것보다 무엇을 남길지 정하는 데 시간을 더 씁니다.
            </p>

            <ol className="space-y-3 md:space-y-4">
              {STEPS.map((s, i) => (
                <li
                  key={s.name}
                  className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center shrink-0">
                      <s.icon size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 mb-1.5">
                        <span className="text-xs font-black text-blue-600 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-base md:text-lg font-bold text-gray-900">{s.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{s.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 진행 기록 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center shrink-0">
                <ClipboardList size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                실제로 진행한 기록
              </h2>
            </div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8 max-w-2xl">
              계약 대장에서 체험단이 실제 진행 항목으로 들어간 건만 세었습니다.
              상호는 공개하지 않고 업종만 적습니다.
            </p>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-6">
              <p className="text-sm text-gray-700 mb-5">
                체험단을 진행한 매장{" "}
                <span className="font-black text-gray-900 tabular-nums">{REVIEW_TOTAL}곳</span>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {REVIEW_GROUPS.map((g) => (
                  <div
                    key={g.name}
                    className="rounded-xl bg-white border border-gray-200 px-3 py-3 md:px-4 md:py-4"
                  >
                    <p className="text-xs md:text-[13px] text-gray-500 mb-1 truncate" title={g.name}>
                      {g.name}
                    </p>
                    <p className="text-lg md:text-xl font-black text-gray-900 tabular-nums">
                      {g.count}곳
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs md:text-[13px] text-gray-500 leading-relaxed">
                병원과 의원은 이 목록에 없습니다. 하지 않기 때문입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 하지 않는 것 */}
        <section className="py-14 md:py-20 bg-gray-950">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              하지 않는 것
            </h2>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-8 md:mb-10 max-w-2xl">
              체험단은 잘못 굴리면 매장이 손해를 봅니다. 그래서 무엇을 파는지보다
              무엇을 안 하는지를 먼저 말씀드립니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {NEVER.map((n) => (
                <div
                  key={n.title}
                  className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 md:p-6"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center mb-4">
                    <n.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-2">{n.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs md:text-[13px] text-gray-500 leading-relaxed">
              병원과 의원 마케팅은 체험단 대신 다른 방법으로 진행합니다.{" "}
              <Link href="/services/clinic" className="text-blue-400 font-semibold hover:text-blue-300">
                의원 · 한의원 · 피부과 안내 보기
              </Link>
            </p>
          </div>
        </section>

        <FaqAccordion
          items={FAQS}
          title="체험단 자주 묻는 질문"
          subtitle="상담에서 가장 많이 나오는 여섯 가지를 그대로 적었습니다."
          showMoreHref="/faq"
        />

        {/* CTA */}
        <section className="py-14 md:py-16 bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              몇 명을 언제 부를지부터 같이 정합니다
            </h2>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto">
              업종과 지역, 하루에 받을 수 있는 팀 수를 알려주시면 구성안을 정리해 드립니다.
              상담과 진단은 0원이고, 상담한 사람이 그대로 끝까지 맡습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={CTA_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm md:text-base font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                무료로 구성안 받기
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm md:text-base font-bold text-white ring-1 ring-white/20 hover:bg-white/15 transition-colors"
              >
                <Phone size={18} strokeWidth={2.5} />
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
