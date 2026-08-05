import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import Link from "next/link";
import { ArrowRight, BookOpen, TrendingUp, Users, Star, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "학원·교육 마케팅 대행사 — 하랑마케팅 | 수강생 증대 전문",
  description: "학원·공부방·과외·교습소 맞춤 마케팅. 네이버 플레이스 SEO, 블로그, 카카오채널 운영 전문. 수강생 증대 실제 성과. 무료 상담.",
  keywords: ["학원 마케팅", "교육 마케팅 대행사", "학원 수강생 늘리기", "학원 플레이스 SEO", "공부방 마케팅"],
  openGraph: {
    title: "학원·교육 마케팅 대행사 — 하랑마케팅",
    description: "수강생을 늘리는 학원 마케팅 전략. 실제 성과 보유.",
    url: "https://www.harangmarketing.com/services/academy",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "학원 마케팅 하랑마케팅" }],
  },
};

const RESULTS = [
  { label: "수강생 증가", value: "+68%", sub: "3개월 · 영어학원" },
  { label: "플레이스 순위", value: "Top 3", sub: "2개월 · 수학학원" },
  { label: "문의 전화", value: "+210%", sub: "4개월 · 미술학원" },
];

export default function AcademyPage() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        <section className="bg-gray-950 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <BookOpen size={12} className="text-green-400" />
              <span className="text-gray-400 text-xs font-medium">학원·교육 전문 마케팅</span>
            </div>
            <h1 className="text-[36px] md:text-[52px] font-black text-white leading-tight mb-5">
              학원 수강생,<br />
              <span className="text-green-400">마케팅으로 채웁니다</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              학원·공부방·교습소·과외 등 교육 업종에 특화된 마케팅. 학부모가 검색하는 키워드와 플랫폼에 집중합니다.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mb-8">
              {RESULTS.map(r => (
                <div key={r.label} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <div className="text-xl font-black text-green-400 mb-0.5">{r.value}</div>
                  <div className="text-[10px] text-gray-400 leading-tight">{r.sub}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact?industry=학원"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm transition-colors">
                학원 무료 상담 <ArrowRight size={15} />
              </Link>
              <Link href="/free-check"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/30 text-white font-medium text-sm transition-colors">
                내 학원 무료 진단
              </Link>
            </div>
          </div>
        </section>

        {/* AEO — 업종별 한 줄 정답 (AI 답변 엔진 인용 대상) */}
        <AnswerBlock
          question="학원 마케팅은 어떻게 수강생을 늘리나요?"
          answer="학원·교육 마케팅은 지역 맘카페 바이럴과 홈페이지형 블로그가 핵심입니다. 학부모가 학원을 고를 때 광고보다 동네 엄마들의 실제 후기를 먼저 찾아보기 때문입니다. 하랑마케팅이 진행한 경기 고양 학원은 3개월 만에 수강생이 62명에서 96명으로 55% 증가했습니다. 맘카페 바이럴은 일반 블로그 대비 전환율이 2~3배 높으며, 학원 마케팅 비용은 월 30만원부터 시작합니다."
          facts={[
            { label: "수강생", value: "62→96명" },
            { label: "증가율", value: "+55%" },
            { label: "진행 기간", value: "3개월" },
            { label: "시작 비용", value: "월 30만원~" },
          ]}
        />


        {/* 체크리스트 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-2">
              이 중 하나라도 해당되면 지금 바로 시작하세요
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">방치할수록 주변 경쟁 학원에 학부모를 뺏깁니다</p>
            <div className="space-y-3">
              {[
                "네이버 플레이스 순위가 5위 밖인가요?",
                "신규 수강 문의 전화가 월 10건 미만인가요?",
                "주변에 같은 과목 학원이 3곳 이상인가요?",
                "블로그·SNS 포스팅이 월 4개 미만인가요?",
                "학부모가 온라인에서 내 학원을 찾기 어렵나요?",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-gray-800 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">학원 마케팅 핵심 전략</h2>
            <p className="text-gray-500 text-sm text-center mb-10">학부모가 학원을 찾는 방식에 맞게 설계합니다</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-0">
              {[
                { icon: TrendingUp, color: "from-green-500 to-emerald-600", title: "학부모 검색 키워드 공략", desc: "'지역명+학원', '지역명+과외' 등 학부모가 실제로 검색하는 키워드를 네이버 플레이스와 블로그에 집중 배치합니다." },
                { icon: Users, color: "from-blue-500 to-blue-700", title: "맘카페·지역 커뮤니티 입소문", desc: "지역 맘카페와 학부모 커뮤니티에서 자연스럽게 회자되도록 합니다. 강요하지 않고 자연스럽게." },
                { icon: Star, color: "from-amber-500 to-orange-500", title: "성과 리뷰·수강 후기 관리", desc: "수강생 학부모 후기를 전략적으로 쌓습니다. 긍정적 후기가 신뢰를 만들고 신규 문의로 이어집니다." },
              ].map(s => (
                <div key={s.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-sm`}>
                    <s.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-2">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 bg-gray-950">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">학원 무료 진단 받기</h2>
            <p className="text-gray-400 text-sm mb-7">경쟁 학원 분석·현재 순위·개선 방향까지 0원.</p>
            <Link href="/contact?industry=학원"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-sm">
              무료 상담 신청 <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
