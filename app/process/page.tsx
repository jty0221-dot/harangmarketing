import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import AnswerBlock from "../components/AnswerBlock";
import { howToLd, webPageLd, breadcrumbLd } from "../lib/seo";
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

const STEPS = [
  {
    number: "01",
    icon: Phone,
    title: "무료 상담 신청",
    duration: "D-Day",
    accent: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/8",
    desc: "카카오톡 또는 전화로 연락하시면 됩니다. 상담 비용은 0원이며, 부담 없이 현재 상황을 말씀해 주세요.",
    details: [
      "카카오톡 채널 / 전화 / 홈페이지 폼 중 편한 방법으로",
      "현재 운영 중인 플랫폼·업종·고민 간단히 공유",
      "1영업일 내 대표가 직접 연락드립니다",
    ],
  },
  {
    number: "02",
    icon: Search,
    title: "무료 경쟁사 분석",
    duration: "D+1~2",
    accent: "text-indigo-400",
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/8",
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
    accent: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/8",
    desc: "분석 결과를 바탕으로 예산·기간·목표에 딱 맞는 마케팅 플랜을 제안드립니다. 억지로 패키지를 끼워 넣지 않습니다.",
    details: [
      "월 예산별 최적 서비스 조합 제안",
      "3·6개월 예상 성과 수치 제시",
      "진행 우선순위·타임라인 안내",
    ],
  },
  {
    number: "04",
    icon: Handshake,
    title: "계약 및 킥오프",
    duration: "D+4~7",
    accent: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/8",
    desc: "계약 후 즉시 킥오프 미팅에서 세부 실행 계획을 확정합니다. 대표가 직접 담당합니다.",
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
    accent: "text-blue-400",
    border: "border-blue-600/30",
    bg: "bg-blue-600/8",
    desc: "블로그·플레이스·SNS 채널별 콘텐츠를 제작·배포하고, 리뷰·체험단 캠페인을 가동합니다.",
    details: [
      "주 2회 이상 콘텐츠 업로드",
      "키워드 최적화 블로그 발행",
      "리뷰 캠페인·체험단 모집 진행",
    ],
  },
  {
    number: "06",
    icon: BarChart3,
    title: "월간 성과 리포트",
    duration: "매월 말",
    accent: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/8",
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
  { icon: Star, label: "재계약률 95%" },
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
      "하랑마케팅의 마케팅 대행은 무료 상담 신청, 무료 경쟁사 분석, 맞춤 전략 제안, 계약 및 킥오프, 실행 및 콘텐츠 제작, 월간 성과 리포트 6단계로 진행됩니다. 상담과 분석은 비용 0원이며 계약 강요가 없습니다.",
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
        {/* Hero — dark editorial */}
        <section className="bg-gray-950 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/6 rounded-full blur-3xl pointer-events-none" />
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
          answer="하랑마케팅의 마케팅 대행은 6단계로 진행됩니다. 1) 무료 상담 신청(당일), 2) 무료 경쟁사 분석 리포트 제공(1~2일), 3) 예산·목표 맞춤 전략 제안(3일), 4) 계약 및 킥오프 후 당일 실행 착수(4~7일), 5) 콘텐츠 제작·배포와 리뷰 캠페인 가동(1개월~), 6) 매월 말 성과 리포트와 전략 조정 순입니다. 상담과 분석 단계는 비용이 0원이며 계약을 강요하지 않습니다."
          facts={[
            { label: "상담·분석 비용", value: "0원" },
            { label: "첫 연락까지", value: "1영업일" },
            { label: "계약~착수", value: "당일" },
            { label: "리포트 주기", value: "매월" },
          ]}
        />

        {/* Timeline — dark */}
        <section className="py-14 md:py-20 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="relative">
              {/* vertical connector line */}
              <div className="absolute left-[27px] md:left-[31px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-blue-500/40 via-white/5 to-blue-500/10 rounded-full" />
              <div className="space-y-4">
                {STEPS.map((step) => (
                  <div key={step.number} className="relative flex gap-5 md:gap-6">
                    {/* Step icon */}
                    <div className="shrink-0 flex flex-col items-center z-10">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border ${step.border} flex items-center justify-center shadow-lg`}>
                        <step.icon size={18} className={step.accent} strokeWidth={2} />
                      </div>
                    </div>

                    {/* Content card */}
                    <div className={`flex-1 ${step.bg} border ${step.border} rounded-2xl p-5 mb-0`}>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className={`text-[10px] font-black ${step.accent} uppercase tracking-widest`}>Step {step.number}</span>
                          <h3 className="text-base md:text-lg font-black text-white leading-tight">{step.title}</h3>
                        </div>
                        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${step.border} ${step.accent} text-[11px] font-bold bg-white/5`}>
                          <Clock size={10} strokeWidth={2.5} />
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed mb-3">{step.desc}</p>
                      <ul className="space-y-1.5">
                        {step.details.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-xs text-gray-400">
                            <CheckCircle2 size={12} className={`${step.accent} shrink-0 mt-0.5`} strokeWidth={2.5} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-20 bg-gray-950">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2 text-center">자주 묻는 질문</h2>
            <p className="text-gray-500 text-sm text-center mb-10">진행 과정에서 가장 많이 물어보시는 것들</p>
            <div className="space-y-3">
              {[
                { q: "상담 후 꼭 계약해야 하나요?", a: "아닙니다. 무료 분석과 제안까지는 완전 무료이며 의무가 없습니다. 제안이 마음에 드실 때만 계약하시면 됩니다." },
                { q: "계약 기간은 얼마인가요?", a: "기본 3개월 단위이며, 성과에 따라 월 단위 연장도 가능합니다. 장기 계약 강요는 없습니다." },
                { q: "중간에 서비스를 변경할 수 있나요?", a: "가능합니다. 월 리포트 협의 시 서비스 항목을 추가·변경·교체할 수 있습니다." },
                { q: "결과가 나오는 데 얼마나 걸리나요?", a: "업종과 경쟁 강도에 따라 다르나 보통 1개월 차부터 순위 변화가 시작되고, 3개월 차에 가시적 성과가 납니다." },
                { q: "담당자가 자주 바뀌지 않나요?", a: "대표가 직접 전략을 수립하고 담당합니다. 신입 직원에게 맡기지 않으며, 10년+ 경력의 대표가 계약 기간 내내 1:1로 담당합니다." },
                { q: "작업 내용을 어떻게 확인할 수 있나요?", a: "매월 말 플랫폼별 순위·리뷰 수·방문자 수 등 수치가 담긴 상세 리포트를 제공합니다. 언제든지 카카오톡으로 진행 상황을 문의하실 수 있습니다." },
              ].map((faq, i) => (
                <details key={i} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none hover:bg-white/5 transition-colors">
                    <span className="font-bold text-white text-sm">{faq.q}</span>
                    <svg className="shrink-0 w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
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
            <p className="text-blue-100 text-sm mb-7">상담 비용 0원 · 계약 강요 없음 · 1영업일 내 연락</p>
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
