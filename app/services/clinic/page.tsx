import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, TrendingUp, Star, MapPin,
  Stethoscope, Users, MessageSquare, BarChart3, Clock,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "의원·한의원·피부과 마케팅 — 하랑마케팅 | 신환 유입 · 플레이스 SEO · 블로그",
  description: "의원·한의원·피부과 전문 마케팅. 의료법 준수 블로그, 플레이스 상위 노출, 리뷰 관리로 신환 예약을 늘립니다. 무료 상담 가능.",
  keywords: ["의원 마케팅", "한의원 마케팅", "피부과 마케팅", "병원 플레이스 SEO", "신환 유입 마케팅"],
  openGraph: {
    title: "의원·한의원·피부과 마케팅 — 하랑마케팅",
    description: "의료법을 준수하면서 신환이 늘어나는 병원 마케팅 전략.",
    url: "https://www.harangmarketing.com/services/clinic",
    images: [{ url: "https://www.harangmarketing.com/og-image.png", width: 1200, height: 630 }],
  },
};

const RESULTS = [
  { label: "플레이스 순위", before: "15위", after: "2위", period: "3개월" },
  { label: "신환(초진) 예약", before: "월 28명", after: "월 84명", period: "6개월" },
  { label: "블로그 유입", before: "월 320명", after: "월 1,200명", period: "4개월" },
];

const SERVICES = [
  {
    icon: MapPin,
    color: "from-blue-500 to-blue-700",
    title: "플레이스 SEO",
    desc: "진료과목 키워드 최적화 · 지역+과목 상위 노출",
  },
  {
    icon: Star,
    color: "from-blue-600 to-orange-600",
    title: "리뷰 관리",
    desc: "긍정 리뷰 확보 · 부정 리뷰 대응 전략",
  },
  {
    icon: MessageSquare,
    color: "from-purple-500 to-purple-700",
    title: "의료법 준수 블로그",
    desc: "의료광고 심의 기준 충족 · 증례 콘텐츠 기획",
  },
  {
    icon: ShieldCheck,
    color: "from-green-500 to-green-700",
    title: "신뢰도 콘텐츠",
    desc: "원장 전문성 강조 · 치료 과정 스토리텔링",
  },
];

const CHECKLIST = [
  "네이버 플레이스 순위가 5위 밖인가요?",
  "신환 예약이 월 30명 미만인가요?",
  "리뷰 응답률이 50% 미만인가요?",
  "블로그 포스팅이 불규칙하거나 월 4개 미만인가요?",
  "근처에 같은 과목 경쟁 의원이 3곳 이상인가요?",
];

export default function ClinicLandingPage() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-950 via-indigo-950 to-gray-950 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <Stethoscope size={12} strokeWidth={2.5} />
              의원 · 한의원 전문
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              초진 예약을<br />
              <span className="text-blue-400">3배 만드는 방법</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
              의료법을 준수하면서도 신환이 늘어나는 마케팅.<br />
              피부과·한의원·치과·정형외과 실제 성과로 검증.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm"
              >
                무료 상담 신청 <ArrowRight size={15} />
              </Link>
              <Link
                href="/free-check"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
              >
                내 의원 무료 진단
              </Link>
            </div>
          </div>
        </section>

        {/* AEO — 업종별 한 줄 정답 (AI 답변 엔진 인용 대상) */}
        <AnswerBlock
          question="병원·의원 마케팅은 무엇이 중요한가요?"
          answer="의원·한의원·피부과 마케팅은 신뢰도가 전부이므로 원장의 전문성을 담은 블로그 콘텐츠와 실제 환자 후기 확보가 가장 중요합니다. 하랑마케팅이 진행한 서울 강서 피부과는 6개월간 인스타그램 신규 예약이 월 12건에서 33건으로 300% 증가했고, 경기 안양 한의원은 4개월간 플레이스 리뷰 12개에서 89개, 초진 예약 월 15건에서 45건으로 늘었습니다. 의료광고법을 준수한 콘텐츠만 제작하며 비용은 월 30만원부터입니다."
          facts={[
            { label: "신규 예약", value: "+300%" },
            { label: "초진 예약", value: "15→45건" },
            { label: "플레이스 리뷰", value: "12→89개" },
            { label: "시작 비용", value: "월 30만원~" },
          ]}
        />


        {/* 체크리스트 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-2">
              이 중 하나라도 해당되면 신환 유입에 문제가 있습니다
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">방치할수록 주변 경쟁 의원에 환자를 뺏깁니다</p>
            <div className="space-y-3">
              {CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-gray-800 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 실제 성과 */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">실제 의원 성과</h2>
              <p className="text-gray-500 text-sm">경기 분당 피부과 · 하랑마케팅 6개월 운영</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {RESULTS.map((r, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-500 mb-3 font-medium">{r.label}</p>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-lg font-bold text-gray-400 line-through">{r.before}</span>
                    <ArrowRight size={14} className="text-gray-400" />
                    <span className="text-2xl font-black text-blue-600">{r.after}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
                    <Clock size={10} /> {r.period}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 서비스 구성 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-8">의원 전용 마케팅 패키지</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} shadow-sm flex items-center justify-center flex-shrink-0`}>
                    <s.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-0.5">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 md:py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
              <TrendingUp size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              우리 의원에 맞는 전략이 궁금하신가요?
            </h2>
            <p className="text-blue-100 text-sm mb-7">
              진료과목 · 지역 · 경쟁 현황을 분석해서<br />
              맞춤 전략을 무료로 제안해드립니다.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              의원 마케팅 무료 상담 <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
