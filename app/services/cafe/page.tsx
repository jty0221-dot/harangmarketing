import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, TrendingUp, Star, MapPin,
  Coffee, Users, MessageSquare, BarChart3, Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "카페·베이커리 마케팅 — 하랑마케팅 | 플레이스 SEO · 리뷰 · 블로그",
  description: "카페·베이커리 전문 마케팅. 네이버 플레이스 상위 노출, 포토리뷰 확보, 블로그·인스타 바이럴로 방문객을 늘립니다. 무료 상담 가능.",
  keywords: ["카페 마케팅", "카페 플레이스 SEO", "카페 리뷰 마케팅", "베이커리 마케팅", "네이버 플레이스 카페"],
  openGraph: {
    title: "카페·베이커리 마케팅 — 하랑마케팅",
    description: "플레이스 상위 노출부터 포토리뷰 확보까지. 카페 전문 마케팅 전략.",
    url: "https://www.harangmarketing.com/services/cafe",
    images: [{ url: "https://www.harangmarketing.com/og-image.png", width: 1200, height: 630 }],
  },
};

const RESULTS = [
  { label: "플레이스 순위", before: "27위", after: "3위", period: "2개월" },
  { label: "월 방문객", before: "120명", after: "380명", period: "3개월" },
  { label: "네이버 리뷰", before: "31개", after: "140개", period: "4개월" },
];

const SERVICES = [
  {
    icon: MapPin,
    color: "from-blue-500 to-blue-700",
    title: "플레이스 SEO",
    desc: "카페 키워드 최적화 · 상위 노출 · 경쟁사 분석",
  },
  {
    icon: Star,
    color: "from-blue-600 to-orange-600",
    title: "리뷰 · 체험단",
    desc: "음료·디저트 체험단 운영 · 포토리뷰 확보",
  },
  {
    icon: MessageSquare,
    color: "from-purple-500 to-purple-700",
    title: "블로그 · SNS",
    desc: "맛집 블로그 포스팅 · 인스타그램 바이럴",
  },
  {
    icon: BarChart3,
    color: "from-green-500 to-green-700",
    title: "월간 성과 리포트",
    desc: "순위 변화 · 방문객 추이 · 다음 달 전략",
  },
];

const CHECKLIST = [
  "네이버 플레이스 순위가 10위 밖인가요?",
  "리뷰가 30개 미만인가요?",
  "신규 오픈 후 6개월 이내인가요?",
  "주변 카페 대비 방문객이 적은가요?",
  "블로그·인스타 포스팅이 월 4개 미만인가요?",
];

export default function CafeLandingPage() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-950 via-orange-950 to-gray-950 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-600/30 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <Coffee size={12} strokeWidth={2.5} />
              카페 · 디저트 전문
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              카페 마케팅,<br />
              <span className="text-blue-400">이렇게 하면 됩니다</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
              네이버 플레이스 상위 노출부터 포토리뷰 확보까지.<br />
              전국 카페 30곳 이상 실제 성과로 검증된 전략.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-400 text-gray-950 font-bold px-6 py-3.5 rounded-xl transition-colors text-sm"
              >
                무료 상담 신청 <ArrowRight size={15} />
              </Link>
              <Link
                href="/free-check"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
              >
                내 카페 무료 진단
              </Link>
            </div>
          </div>
        </section>

        {/* AEO — 업종별 한 줄 정답 (AI 답변 엔진 인용 대상) */}
        <AnswerBlock
          question="카페 마케팅은 어떻게 해야 효과가 있나요?"
          answer="카페·베이커리 마케팅의 핵심은 네이버 플레이스 상위 노출, 포토리뷰 확보, 인스타그램 비주얼 콘텐츠 세 가지입니다. 사진 품질과 포토리뷰 수가 카페 업종의 플레이스 순위를 가장 크게 좌우하기 때문입니다. 하랑마케팅이 진행한 카페는 2개월 만에 플레이스 순위 27위에서 3위, 3개월 만에 월 방문객 120명에서 380명, 4개월 만에 네이버 리뷰 31개에서 140개로 늘었습니다. 카페 마케팅 비용은 월 30만원부터 시작하며 상담과 진단은 0원입니다."
          facts={[
            { label: "플레이스 순위", value: "27위→3위" },
            { label: "월 방문객", value: "120→380명" },
            { label: "네이버 리뷰", value: "31→140개" },
            { label: "시작 비용", value: "월 30만원~" },
          ]}
        />


        {/* 체크리스트 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-2">
              이 중 하나라도 해당되면 지금 바로 시작하세요
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">방치할수록 경쟁 카페에 자리를 뺏깁니다</p>
            <div className="space-y-3">
              {CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <CheckCircle2 size={18} className="text-blue-600 flex-shrink-0" strokeWidth={2.5} />
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
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">실제 카페 성과</h2>
              <p className="text-gray-500 text-sm">경기 분당 카페 · 하랑마케팅 4개월 운영</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {RESULTS.map((r, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-500 mb-3 font-medium">{r.label}</p>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-lg font-bold text-gray-400 line-through">{r.before}</span>
                    <ArrowRight size={14} className="text-gray-400" />
                    <span className="text-2xl font-black text-blue-700">{r.after}</span>
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
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-8">카페 전용 마케팅 패키지</h2>
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
        <section className="py-14 md:py-20 bg-gradient-to-br from-blue-600 to-orange-600">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
              <TrendingUp size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              내 카페도 가능한지 먼저 확인하세요
            </h2>
            <p className="text-blue-100 text-sm mb-7">
              무료 진단 후 가능성이 없으면 솔직히 말씀드립니다.<br />
              부담 없이 연락 주세요.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              카페 마케팅 무료 상담 <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
