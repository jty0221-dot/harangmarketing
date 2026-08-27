import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import AnswerBlock from "../components/AnswerBlock";
import { SITE, howToLd, webPageLd, breadcrumbLd } from "../lib/seo";
import {
  Phone, MessageCircle, ArrowRight, CheckCircle2, Clock,
  Search, FileText, TrendingUp, BarChart3, Handshake,
  ShieldCheck, Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "진행 과정 — 하랑마케팅 | 상담부터 성과까지 6단계",
  description: "하랑마케팅 상담 신청부터 계약, 실행, 성과 리포트까지 6단계 진행 과정을 투명하게 공개합니다. 상담 비용 0원, 계약 강요 없음.",
  keywords: ["마케팅 대행사 진행 과정", "소상공인 마케팅 상담", "하랑마케팅 프로세스"],
  openGraph: {
    title: "하랑마케팅 진행 과정 — 상담부터 성과까지 6단계",
    description: "투명하게 공개하는 6단계 마케팅 진행 과정. 상담 비용 0원.",
    url: "https://www.harangmarketing.com/process",
    images: [{ url: "https://www.harangmarketing.com/og-image.png", width: 1200, height: 630 }],
  },
};

/**
 * 6단계 진행 과정.
 *
 * 단계를 색으로 구분하지 않는다 — 예전에는 01 파랑 · 02 인디고 · 03 보라 · 04 초록으로
 * 여섯 색이 붙어 있었는데, 강조가 여섯이면 강조가 없는 것과 같다.
 * 위계는 번호와 굵기가 만들고 색은 Primary #0066FF 하나만 쓴다 (WDS).
 *
 * 문구는 다른 페이지와 같은 값을 봐야 한다. 특히
 *   · 첫 연락 시점은 사이트 전체가 `24시간 내` 다 (여기만 `1영업일` 이었다)
 *   · 견적은 월 정액이 아니라 항목별 단가 조합이다 (app/lib/seo.ts 의 price 가 정본)
 *   · 몇 개월에 몇 위를 만들어 준다는 성과 확약 문구를 쓰지 않는다
 */
const STEPS = [
  {
    number: "01",
    icon: Phone,
    title: "무료 상담 신청",
    duration: "D-Day",
    desc: "카카오톡 또는 전화로 연락하시면 됩니다. 상담 비용은 0원이며, 부담 없이 현재 상황을 말씀해 주세요.",
    details: [
      "카카오톡 채널 / 전화 / 홈페이지 폼 중 편한 방법으로",
      "현재 운영 중인 플랫폼·업종·고민 간단히 공유",
      "24시간 내 전담 팀장이 직접 연락드립니다",
    ],
  },
  {
    number: "02",
    icon: Search,
    title: "무료 경쟁사 분석",
    duration: "D+1~2",
    desc: "네이버 플레이스·블로그·SNS 현황과 경쟁사를 비교 분석한 리포트를 무료로 제공합니다.",
    details: [
      "내 매장 현재 순위·리뷰·콘텐츠 현황 진단",
      "경쟁사 상위 3곳 전략 분석",
      "업종별 맞춤 성장 기회 도출",
    ],
  },
  {
    number: "03",
    icon: FileText,
    title: "맞춤 전략 제안",
    duration: "D+3",
    desc: "미리 정해둔 월 금액은 없습니다. 진단 결과에서 이 매장에 꼭 필요한 항목만 골라, 항목별 단가와 물량을 그대로 적은 견적서를 드립니다.",
    details: [
      "필요한 항목만 선택 · 안 쓰는 항목은 빼고 계산",
      "항목별 단가와 물량이 그대로 보이는 견적서",
      "진행 우선순위·타임라인 안내",
    ],
  },
  {
    number: "04",
    icon: Handshake,
    title: "계약 및 킥오프",
    duration: "D+4~7",
    desc: "계약 후 즉시 킥오프 미팅에서 세부 실행 계획을 확정합니다. 전담 팀장이 직접 관리합니다.",
    details: [
      "표준 계약서 작성 (전자서명 가능)",
      "계정 권한·소재·자료 인수인계",
      "계약 당일 실행 착수",
    ],
  },
  {
    number: "05",
    icon: TrendingUp,
    title: "실행 및 콘텐츠 제작",
    duration: "1개월~",
    desc: "블로그·플레이스·SNS 채널별 콘텐츠를 제작·배포하고, 리뷰·체험단 캠페인과 스마트스토어 상세페이지 작업을 계약한 항목대로 가동합니다.",
    details: [
      "계약한 항목·물량 그대로 제작·발행",
      "키워드 최적화 블로그 발행",
      "리뷰 캠페인·체험단 모집 진행",
      "스마트스토어 상세페이지 제작 (해당 항목 계약 시)",
    ],
  },
  {
    number: "06",
    icon: BarChart3,
    title: "월간 성과 리포트",
    duration: "매월 말",
    desc: "순위·방문자·리뷰·문의 등 핵심 KPI를 매월 리포트로 공유하고 다음 달 전략을 조정합니다.",
    details: [
      "플랫폼별 순위·노출·클릭 수치 공유",
      "전월 대비 성과 분석",
      "다음 달 전략 수정·개선 방향 협의",
    ],
  },
];

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "고의 누락 시 결제금액 10배 보상" },
  { icon: Star, label: `재계약률 ${SITE.stats.renewalRate}` },
  { icon: Clock, label: "24시간 소통 가능" },
];

/* ─── AEO 구조화 데이터 ───────────────────────────
   HowTo 는 "마케팅 대행 어떻게 진행돼?" 같은 절차형 질의에서
   AI 답변 엔진이 단계별로 그대로 인용하는 스키마다.
   step 배열은 화면에 렌더링되는 STEPS 와 같은 원본을 쓴다. */
const PROCESS_LD = [
  howToLd({
    path: "/process",
    name: "하랑마케팅 마케팅 대행 진행 과정 6단계",
    description:
      "하랑마케팅의 마케팅 대행은 무료 상담 신청, 무료 경쟁사 분석, 맞춤 전략 제안, 계약 및 킥오프, 실행 및 콘텐츠 제작, 월간 성과 리포트 6단계로 진행됩니다. 상담과 분석은 비용 0원이며 계약 강요가 없습니다. 월 정액이 아니라 필요한 항목만 골라 항목별 단가를 더해 견적을 냅니다.",
    totalTime: "P7D",
    steps: STEPS.map((s) => ({
      name: s.title,
      text: `${s.desc} (${s.duration}) ${s.details.join(". ")}`,
    })),
  }),
  webPageLd({
    path: "/process",
    name: "진행 과정 — 하랑마케팅",
    description: "상담 신청부터 월간 성과 리포트까지 6단계 마케팅 대행 진행 과정.",
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "진행 과정", path: "/process" },
  ]),
];

export default function ProcessPage() {
  return (
    <>
      <JsonLd data={PROCESS_LD} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* Hero — 다크. 사이트 문법이 '히어로만 다크, 본문은 라이트' 라 여기까지만 어둡다.
            orb·격자는 /process 만의 장식이 아니라 형제 페이지 7곳·14곳이 함께 쓰는
            관용구다. 여기서만 걷어내면 고치는 게 아니라 이 페이지만 튄다.
            불투명도만 최빈값(/8)으로 맞췄다 — 혼자 /6 이라 옅었다. */}
        <section className="bg-gray-950 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-5">Process</p>
              <h1 className="text-[36px] md:text-[52px] font-black text-white leading-tight mb-5">
                상담부터 성과까지<br />
                <span className="text-blue-400">6단계, 투명하게</span>
              </h1>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                어떻게 진행되는지 미리 알고 오시면 더 빠르게 시작할 수 있습니다.
                숨기는 단계 없이 전부 공개합니다.
              </p>

              {/* Trust strip */}
              <div className="flex flex-wrap gap-4 mb-8">
                {TRUST_POINTS.map(t => (
                  <div key={t.label} className="flex items-center gap-2">
                    <t.icon size={13} className="text-blue-400" strokeWidth={2.5} />
                    <span className="text-gray-400 text-xs font-medium">{t.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-colors shadow-lg shadow-blue-900/30">
                  지금 무료 상담 신청 <ArrowRight size={15} />
                </Link>
                <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-sm transition-colors">
                  <MessageCircle size={15} />
                  카카오로 먼저 물어보기
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* AEO — 절차형 질의 한 줄 정답 */}
        <AnswerBlock
          question="하랑마케팅 마케팅 대행은 어떻게 진행되나요?"
          answer="하랑마케팅의 마케팅 대행은 6단계로 진행됩니다. 1) 무료 상담 신청(당일), 2) 무료 경쟁사 분석 리포트 제공(1~2일), 3) 필요한 항목만 골라 항목별 단가를 더한 견적 제안(3일), 4) 계약 및 킥오프 후 당일 실행 착수(4~7일), 5) 계약한 항목·물량대로 콘텐츠 제작·배포와 리뷰 캠페인 가동(1개월~), 6) 매월 말 성과 리포트와 전략 조정 순입니다. 상담과 분석 단계는 비용이 0원이며 계약을 강요하지 않습니다. 미리 정해둔 월 정액 금액은 없습니다."
          facts={[
            { label: "상담·분석 비용", value: "0원" },
            { label: "첫 연락까지", value: "24시간" },
            { label: "계약~착수", value: "당일" },
            { label: "리포트 주기", value: "매월" },
          ]}
        />

        {/* Timeline — 라이트.
            연결선은 단색 1px 이다. 예전 그라데이션 선은 다크 배경에서 '빛나는 선' 으로
            보이려던 장치라 라이트로 내리면 근거가 사라진다. */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div>
              {STEPS.map((step, i) => {
                const isLast = i === STEPS.length - 1;
                return (
                  <div key={step.number} className="flex gap-5 md:gap-6">
                    {/* Step icon — 단색 배경 + Primary 아이콘. 그라데이션 박스 금지(WDS).
                        연결선은 이 칸 안에서 아이콘 아래로 흘러 다음 아이콘까지 닿는다.
                        바깥에 절대배치로 한 줄 긋던 방식은 마지막 카드가 길어지면
                        선이 145px 남아 흘렀다 — top-10 bottom-10 은 아이콘이 아니라
                        묶음 상자를 기준으로 재기 때문이다. 행 간격을 margin 이 아니라
                        바깥여백으로 둬야 칸 안의 선이 끊기지 않는다 — 행 안쪽여백은
                        칸 높이 밖이라 선이 다음 아이콘에 16px 못 미친다. */}
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm">
                        <step.icon size={16} style={{ color: "var(--h-blue)" }} strokeWidth={2.5} />
                      </div>
                      {!isLast && <div className="w-px flex-1 mt-2 bg-gray-200" />}
                    </div>

                    {/* Content card */}
                    <div className={`flex-1 min-w-0 bg-white border border-gray-100 rounded-2xl shadow-sm p-4 md:p-6 ${isLast ? "" : "mb-4"}`}>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0">
                          <span
                            className="text-[11px] font-semibold uppercase tracking-widest tabular-nums"
                            style={{ color: "var(--h-blue)" }}
                          >
                            Step {step.number}
                          </span>
                          <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight">{step.title}</h3>
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-100 bg-gray-50 text-gray-600 text-[11px] font-bold">
                          <Clock size={10} strokeWidth={2.5} />
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">{step.desc}</p>
                      <ul className="space-y-1.5">
                        {step.details.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-xs text-gray-500">
                            <CheckCircle2 size={12} className="shrink-0 mt-0.5" style={{ color: "var(--h-blue)" }} strokeWidth={2.5} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ — 라이트 */}
        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 text-center">자주 묻는 질문</h2>
            <p className="text-gray-500 text-sm text-center mb-10">진행 과정에서 가장 많이 물어보시는 것들</p>
            <div className="space-y-3">
              {[
                { q: "상담 후 꼭 계약해야 하나요?", a: "아닙니다. 무료 분석과 제안까지는 완전 무료이며 의무가 없습니다. 제안이 마음에 드실 때만 계약하시면 됩니다." },
                { q: "계약 기간은 얼마인가요?", a: "월 단위가 기본이라 1개월부터 가능하고 중도 해지 위약금이 없습니다. 3개월 이상 쌓아야 결과가 보이는 업종이면 진단 단계에서 미리 말씀드립니다." },
                { q: "월 얼마부터 시작할 수 있나요?", a: "미리 정해둔 월 금액이 없습니다. 항목별 단가를 정해두고 매장에 꼭 필요한 항목만 골라 더하기 때문에 업체마다 금액이 다릅니다. 진단 후 항목과 물량이 그대로 보이는 견적서를 드리고, 안 쓰는 항목은 빼고 계산합니다." },
                { q: "중간에 서비스를 변경할 수 있나요?", a: "가능합니다. 월 리포트 협의 시 서비스 항목을 추가·변경·교체할 수 있습니다." },
                { q: "결과가 나오는 데 얼마나 걸리나요?", a: "업종과 상권 경쟁도에 따라 달라서 하나로 말씀드리기 어렵습니다. 대신 계약 전 진단에서 이 상권이 어느 정도 걸리는 자리인지 먼저 말씀드리고, 매월 리포트에 실제 순위가 몇 위에서 몇 위로 움직였는지 숫자로 적어 드립니다. 몇 개월 안에 몇 위를 만들어 드리겠다고 미리 약속하지는 않습니다." },
                { q: "담당자가 자주 바뀌지 않나요?", a: "전담 팀장이 직접 전략을 수립하고 담당합니다. 신입 직원에게 맡기지 않으며, 10년+ 경력의 전담 팀장이 계약 기간 내내 1:1로 담당합니다." },
                { q: "작업 내용을 어떻게 확인할 수 있나요?", a: "매월 말 플랫폼별 순위·리뷰 수·방문자 수 등 수치가 담긴 상세 리포트를 제공합니다. 언제든지 카카오톡으로 진행 상황을 문의하실 수 있습니다." },
              ].map((faq, i) => (
                <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                    <span className="font-bold text-gray-900 text-sm">{faq.q}</span>
                    <svg className="shrink-0 w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-blue-600">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">준비됐다면, 지금 바로 시작하세요</h2>
            <p className="text-blue-100 text-sm mb-7">상담 비용 0원 · 계약 강요 없음 · 24시간 내 연락</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-black px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                무료 상담 신청 <ArrowRight size={15} />
              </Link>
              <Link href="/free-check"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-medium px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm">
                무료 플레이스 진단
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
