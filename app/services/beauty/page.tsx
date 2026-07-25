import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, TrendingUp, Star, MapPin,
  Scissors, Users, MessageSquare, BarChart3, Clock, Camera,
} from "lucide-react";

export const metadata: Metadata = {
  title: "미용·네일·피부샵 마케팅 — 하랑마케팅 | 플레이스 SEO · 인스타그램 · 체험단",
  description: "미용실·네일샵·피부샵 전문 마케팅. 인스타그램 팔로워 증가, 플레이스 상위 노출, 포토리뷰 확보로 예약을 꽉 채웁니다. 무료 상담 가능.",
  keywords: ["미용실 마케팅", "네일샵 마케팅", "피부샵 마케팅", "뷰티샵 플레이스 SEO", "헤어샵 인스타그램"],
  openGraph: {
    title: "미용·네일·피부샵 마케팅 — 하랑마케팅",
    description: "인스타그램·플레이스 동시 상승으로 예약을 꽉 채우는 뷰티샵 마케팅.",
    url: "https://www.harangmarketing.com/services/beauty",
    images: [{ url: "https://www.harangmarketing.com/og-image.png", width: 1200, height: 630 }],
  },
};

const RESULTS = [
  { label: "플레이스 순위", before: "18위", after: "4위", period: "2개월" },
  { label: "월 신규 예약", before: "45건", after: "130건", period: "3개월" },
  { label: "인스타 팔로워", before: "280명", after: "1,100명", period: "5개월" },
];

const SERVICES = [
  {
    icon: MapPin,
    color: "from-pink-500 to-rose-600",
    title: "플레이스 SEO",
    desc: "헤어·네일·피부 키워드 최적화 · 지역 상위 노출",
  },
  {
    icon: Camera,
    color: "from-purple-500 to-purple-700",
    title: "인스타그램 마케팅",
    desc: "시술 전후 사진 콘텐츠 · 릴스 · 팔로워 유입",
  },
  {
    icon: Star,
    color: "from-amber-500 to-orange-600",
    title: "리뷰 · 체험단",
    desc: "뷰티 체험단 모집 · 포토리뷰 확보 전략",
  },
  {
    icon: MessageSquare,
    color: "from-blue-500 to-blue-700",
    title: "블로그 마케팅",
    desc: "시술 후기 · 포트폴리오 블로그 · 맘카페 바이럴",
  },
];

const CHECKLIST = [
  "네이버 플레이스 순위가 10위 밖인가요?",
  "월 신규 예약이 50건 미만인가요?",
  "인스타그램 팔로워가 500명 미만인가요?",
  "리뷰 포토가 30장 미만인가요?",
  "주변에 경쟁 미용실·네일샵이 많은가요?",
];

export default function BeautyLandingPage() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-pink-950 via-rose-950 to-gray-950 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <Scissors size={12} strokeWidth={2.5} />
              미용실 · 네일 · 피부샵 전문
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              뷰티샵 예약을<br />
              <span className="text-pink-400">인스타·플레이스로 채우세요</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
              헤어·네일·피부 업종 특화 콘텐츠 전략.<br />
              인스타그램 · 네이버 플레이스 동시 상승.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-400 text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm"
              >
                무료 상담 신청 <ArrowRight size={15} />
              </Link>
              <Link
                href="/free-check"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
              >
                내 샵 무료 진단
              </Link>
            </div>
          </div>
        </section>

        {/* 체크리스트 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-2">
              이 중 하나라도 해당되면 지금 바로 시작하세요
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">예쁜 시술 사진이 있어도 노출이 안 되면 소용없습니다</p>
            <div className="space-y-3">
              {CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <CheckCircle2 size={18} className="text-pink-500 flex-shrink-0" strokeWidth={2.5} />
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
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">실제 뷰티샵 성과</h2>
              <p className="text-gray-500 text-sm">경기 수원 헤어샵 · 하랑마케팅 5개월 운영</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {RESULTS.map((r, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-500 mb-3 font-medium">{r.label}</p>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-lg font-bold text-gray-400 line-through">{r.before}</span>
                    <ArrowRight size={14} className="text-gray-400" />
                    <span className="text-2xl font-black text-pink-600">{r.after}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 text-xs font-bold px-2.5 py-1 rounded-full border border-pink-100">
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
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-8">뷰티 전용 마케팅 패키지</h2>
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
        <section className="py-14 md:py-20 bg-gradient-to-br from-pink-500 to-rose-600">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
              <TrendingUp size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              내 샵 마케팅, 어디서부터 시작할지 모르겠다면
            </h2>
            <p className="text-pink-100 text-sm mb-7">
              지금 바로 무료 상담 신청하면<br />
              현재 순위·리뷰·인스타 분석 후 맞춤 전략 제안.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-pink-700 font-bold px-7 py-3.5 rounded-xl hover:bg-pink-50 transition-colors text-sm"
            >
              뷰티샵 마케팅 무료 상담 <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
