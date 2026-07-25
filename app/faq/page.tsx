import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import {
  ArrowRight, MessageCircle, Phone, CheckCircle2,
  Clock, DollarSign, Users, TrendingUp, FileText,
  MapPin, HelpCircle, ShieldCheck, Calculator,
} from "lucide-react";

// FAQ JSON-LD will be injected in the component for rich results

export const metadata: Metadata = {
  title: "자주 묻는 질문 (FAQ) — 하랑마케팅 | 소상공인 마케팅 대행사",
  description: "하랑마케팅 상담 전 가장 많이 물어보시는 질문들을 모았습니다. 비용, 계약 기간, 효과, 지역, 업종 등 궁금한 것을 미리 확인하세요.",
  keywords: ["마케팅 대행사 FAQ", "소상공인 마케팅 비용", "네이버 플레이스 마케팅 가격", "마케팅 대행사 계약", "하랑마케팅 자주묻는질문"],
  openGraph: {
    title: "하랑마케팅 FAQ — 상담 전 미리 확인하세요",
    description: "비용, 계약, 효과, 업종별 질문 등 상담 전에 궁금한 것들을 정리했습니다.",
    url: "https://www.harangmarketing.com/faq",
    images: [{ url: "https://www.harangmarketing.com/og-image.png", width: 1200, height: 630 }],
  },
};

const FAQ_CATEGORIES = [
  {
    id: "cost",
    icon: DollarSign,
    label: "비용·가격",
    color: "from-blue-500 to-blue-700",
    questions: [
      {
        q: "마케팅 상담 비용이 있나요?",
        a: "상담 비용은 완전 무료입니다. 업종 분석, 경쟁사 현황, 맞춤 전략 제안까지 0원에 진행됩니다. 상담 후 계약 여부는 전적으로 사장님이 결정하시면 됩니다.",
      },
      {
        q: "한 달에 얼마나 드나요?",
        a: "업종·서비스 구성·목표에 따라 다릅니다. 단독 서비스는 월 30~50만원대부터, 2~3개 서비스 묶음 패키지는 월 70~120만원대, 전체 서비스 운영은 월 150~250만원대입니다. 정확한 견적은 무료 상담 후 안내드립니다.",
      },
      {
        q: "여러 서비스를 함께 하면 할인되나요?",
        a: "네, 2개 이상 묶음 계약 시 할인이 적용됩니다. 풀패키지(4개 서비스)는 개별 합산 대비 최대 30% 절감됩니다. 무료 상담 시 예산에 맞는 최적 조합을 제안해드립니다.",
      },
      {
        q: "광고비(매체 집행비)는 별도인가요?",
        a: "네이버 검색광고·인스타그램 광고 등 매체 집행비는 대행 수수료와 별도입니다. 단, 블로그·플레이스 SEO·체험단 등 콘텐츠 마케팅은 별도 매체비 없이 진행됩니다. 광고 운영이 필요한 경우 예산을 함께 설정합니다.",
      },
    ],
  },
  {
    id: "contract",
    icon: FileText,
    label: "계약·진행",
    color: "from-blue-500 to-blue-700",
    questions: [
      {
        q: "계약 기간은 최소 얼마나 되나요?",
        a: "기본 3개월 약정으로 운영됩니다. 마케팅 효과는 단기보다 꾸준한 누적이 핵심이기 때문입니다. 실제로 대부분의 성과는 2~3개월차에 본격적으로 나타납니다.",
      },
      {
        q: "계약하면 바로 시작하나요?",
        a: "계약 당일 온보딩 미팅 후 즉시 착수합니다. 초기 분석(업종·경쟁사·키워드)은 1주일 내 완료하고 2주차부터 콘텐츠가 발행됩니다.",
      },
      {
        q: "중도에 해지할 수 있나요?",
        a: "3개월 약정 기간 내 해지 시 잔여 기간에 따른 위약금이 발생할 수 있습니다. 다만 성과 부재·불만족으로 인한 경우는 협의 후 조정합니다. 억지로 잡지 않는 것이 하랑의 방침입니다.",
      },
      {
        q: "계약서가 있나요?",
        a: "네, 서비스 범위·기간·금액·비밀유지가 명시된 표준 계약서를 작성합니다. 계약 전 충분히 검토할 시간을 드립니다.",
      },
    ],
  },
  {
    id: "result",
    icon: TrendingUp,
    label: "효과·성과",
    color: "from-blue-600 to-indigo-700",
    questions: [
      {
        q: "효과가 언제 나오나요?",
        a: "서비스마다 다릅니다. 플레이스 SEO는 3~4주, 블로그 마케팅은 2~3개월, SNS는 1~2개월이 일반적입니다. 첫 상담 때 업종·경쟁 강도에 따른 현실적인 기간을 안내드립니다.",
      },
      {
        q: "결과가 안 나오면 어떻게 되나요?",
        a: "매월 성과 리포트를 함께 검토하며, 목표 미달 시 전략을 즉시 조정합니다. 95% 재계약률이 그 이유입니다. 단, 초기에 현실적인 기대치를 함께 설정하는 것이 중요합니다.",
      },
      {
        q: "성과는 어떻게 확인하나요?",
        a: "매월 순위·방문자·리뷰 수·예약 문의 등 실제 비즈니스 지표를 정리한 리포트를 드립니다. 복잡한 용어 없이 매출에 직결되는 숫자 위주로 설명합니다.",
      },
      {
        q: "100% 보장은 되나요?",
        a: "순위·방문객 100% 보장은 어떤 대행사도 솔직히 말하기 어렵습니다. 다만 목표 미달 시 전략 즉시 수정, 성과 투명 공개, 대표 직접 담당이라는 원칙으로 최선을 다합니다. 이것이 95% 재계약률로 나타납니다.",
      },
    ],
  },
  {
    id: "industry",
    icon: Users,
    label: "업종·규모",
    color: "from-blue-500 to-blue-700",
    questions: [
      {
        q: "작은 매장도 효과가 있나요?",
        a: "오히려 소규모 매장일수록 효과가 빠릅니다. 대형 체인보다 지역 키워드 경쟁이 낮기 때문입니다. 월 30~50만원 예산으로도 성과를 낸 사례가 많습니다.",
      },
      {
        q: "어떤 업종에 가장 효과가 좋나요?",
        a: "카페·음식점·미용실·학원·한의원·피부과 등 지역 기반 소상공인에게 가장 효과가 큽니다. 온라인 쇼핑몰은 블로그·체험단 중심으로 효과가 좋습니다. 업종 특성에 맞는 전략을 상담에서 안내드립니다.",
      },
      {
        q: "이미 다른 대행사를 이용 중인데 바꿔도 되나요?",
        a: "네, 기존 계약 종료 후 자연스럽게 전환하시면 됩니다. 이전 대행사 작업 내역을 분석해 개선점을 찾아드립니다. 전체 클라이언트의 약 40%가 대행사를 바꾸고 오신 분들입니다.",
      },
      {
        q: "개업 전 매장도 마케팅이 필요한가요?",
        a: "개업 전부터 시작하면 오픈 첫날부터 효과가 납니다. 플레이스 세팅, 블로그 사전 노출, 인스타 팔로워 확보를 미리 해두면 개업 직후 방문객이 빠르게 늘어납니다.",
      },
    ],
  },
  {
    id: "process",
    icon: Clock,
    label: "상담·진행 방식",
    color: "from-blue-700 to-indigo-800",
    questions: [
      {
        q: "상담은 어디서 어떻게 진행되나요?",
        a: "전화·카카오톡·화상·방문 중 원하시는 방식으로 진행합니다. 20~30분 무료 상담에서 업종 분석 결과와 맞춤 전략을 공유합니다. 대부분의 분들은 전화나 화상으로 진행합니다.",
      },
      {
        q: "지역 제한이 있나요?",
        a: "전국 어디서나 비대면으로 진행합니다. 현장 촬영이 필요한 경우에는 사전에 안내드리고 별도 협의합니다.",
      },
      {
        q: "담당자가 자주 바뀌지 않나요?",
        a: "대표가 모든 프로젝트에 직접 참여합니다. 계약부터 성과 보고까지 담당자가 바뀌지 않는 것이 하랑의 원칙입니다. 500+ 프로젝트 전부 대표 직접 담당했습니다.",
      },
      {
        q: "상담 신청 후 얼마나 기다려야 하나요?",
        a: "24시간 이내 대표가 직접 연락드립니다. 급한 경우 카카오톡으로 문의하시면 평균 10분 내에 응답드립니다.",
      },
    ],
  },
  {
    id: "platform",
    icon: MapPin,
    label: "플랫폼·채널",
    color: "from-blue-500 to-indigo-600",
    questions: [
      {
        q: "네이버 플레이스 순위는 얼마나 올릴 수 있나요?",
        a: "업종·지역·현재 순위·경쟁 강도에 따라 다릅니다. 평균적으로 4주 내 Top 5 진입이 목표입니다. 상담 시 현재 순위를 분석하고 현실적인 목표를 함께 설정합니다.",
      },
      {
        q: "인스타그램만 해도 될까요?",
        a: "업종에 따라 다릅니다. 카페·미용·음식점 등 비주얼 중심 업종은 인스타그램만으로도 효과가 좋습니다. 단, 네이버 플레이스와 병행하면 상호 보완 효과가 있습니다.",
      },
      {
        q: "블로그 운영을 직접 안 해도 되나요?",
        a: "네, 사장님이 직접 작성할 필요 없습니다. 글 작성부터 업로드·SEO 최적화·성과 모니터링까지 전부 대행합니다. 사장님은 결과 리포트만 확인하시면 됩니다.",
      },
      {
        q: "카카오맵도 관리해주나요?",
        a: "네, 카카오맵 플레이스 최적화 서비스가 있습니다. 카카오맵 노출 순위와 리뷰 관리를 통해 지역 검색 유입을 늘립니다.",
      },
    ],
  },
  {
    id: "estimate",
    icon: Calculator,
    label: "견적·패키지",
    color: "from-blue-700 to-blue-900",
    questions: [
      {
        q: "견적 계산기로 나온 패키지가 실제 견적과 동일한가요?",
        a: "견적 계산기는 업종·예산·목표 기반의 참고용 안내입니다. 실제 매장 상황, 경쟁 강도, 현재 순위에 따라 최적 조합이 달라질 수 있습니다. 무료 상담에서 더 정밀한 견적을 제공합니다.",
      },
      {
        q: "가장 저렴하게 시작할 수 있는 방법은 무엇인가요?",
        a: "월 30~50만원대 스타터 플랜으로 시작하실 수 있습니다. 플레이스 SEO 기초 최적화 + 블로그 관리 조합이 소규모 예산에서 가장 효율이 좋습니다. 예산이 부족한 경우 무료 상담에서 단계적 확장 방법을 안내드립니다.",
      },
      {
        q: "패키지를 중간에 변경할 수 있나요?",
        a: "네, 3개월 기본 약정 이후 성과와 예산에 맞게 업그레이드·다운그레이드가 가능합니다. 성과가 좋으면 채널을 추가하고, 예산이 부담되면 핵심 채널만 유지하는 방식으로 유연하게 운영합니다.",
      },
    ],
  },
];

const JSON_LD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_CATEGORIES.flatMap((cat) =>
    cat.questions.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    }))
  ),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_FAQ) }}
      />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 py-14 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-72 h-72 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">FAQ</p>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              상담 전 궁금한 것들,<br /><span className="text-blue-400">미리 확인하세요</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              10년간 가장 많이 들어온 질문들을 주제별로 정리했습니다.
            </p>
            <div className="flex flex-wrap gap-2">
              {FAQ_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <a key={cat.id} href={`#${cat.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-semibold hover:bg-white/20 transition-colors">
                    <Icon size={11} />
                    {cat.label}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick trust bar */}
        <section className="py-5 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                { icon: ShieldCheck, text: "상담 비용 0원", color: "text-blue-500" },
                { icon: CheckCircle2, text: "계약 강요 없음", color: "text-blue-500" },
                { icon: Clock, text: "24시간 내 연락", color: "text-blue-500" },
                { icon: HelpCircle, text: "더 궁금하면 카카오 문의", color: "text-blue-500" },
              ].map(({ icon: Icon, text, color }) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Icon size={13} className={color} strokeWidth={2.5} />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 space-y-10">
            {FAQ_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} id={cat.id} className="scroll-mt-24">
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-sm`}>
                      <Icon size={16} className="text-white" strokeWidth={2} />
                    </div>
                    <h2 className="text-lg font-black text-gray-900">{cat.label}</h2>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  {/* Questions */}
                  <div className="space-y-2">
                    {cat.questions.map((faq, i) => (
                      <details key={i} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-blue-100 transition-colors shadow-sm">
                        <summary className="flex items-start gap-3 p-5 cursor-pointer list-none select-none hover:bg-blue-50/30 transition-colors">
                          <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${cat.color} text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5`}>
                            Q
                          </div>
                          <span className="font-bold text-gray-800 text-sm flex-1 leading-snug">{faq.q}</span>
                          <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="px-5 pb-5 pt-3 ml-8 text-sm text-gray-500 leading-relaxed border-t border-blue-50">
                          {faq.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Still have questions CTA */}
        <section className="py-14 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-5 shadow-lg">
              <HelpCircle size={24} className="text-white" strokeWidth={2} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              더 궁금한 것이 있으신가요?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              위 내용으로 해결이 안 된 경우 바로 물어보세요.<br />
              카카오톡 평균 응답 10분 · 전화 즉시 연결
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://pf.kakao.com/_MuUkG/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-sm transition-colors shadow-sm"
              >
                <MessageCircle size={15} strokeWidth={2.5} />
                카카오톡으로 바로 질문하기
              </a>
              <a
                href="tel:010-7541-9054"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm transition-colors"
              >
                <Phone size={15} strokeWidth={2.5} />
                010-7541-9054
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-sm"
              >
                무료 진단 신청 <ArrowRight size={14} />
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-5">상담 비용 없음 · 계약 강요 없음 · 대표 직접 연락</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
