import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import Link from "next/link";
import { ArrowRight, UtensilsCrossed, TrendingUp, Star, ShoppingCart, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "음식점·식당 마케팅 대행사 — 하랑마케팅 | 배달·플레이스 매출 증대 전문",
  description: "음식점·한식당·중식당·일식당·분식집 맞춤 마케팅. 배달의민족·쿠팡이츠 상위 노출, 네이버 플레이스 SEO, 블로그 체험단 전문. 실제 성과 보장.",
  keywords: ["음식점 마케팅", "식당 마케팅 대행사", "배달 매출 증대", "음식점 플레이스 SEO", "식당 블로그 마케팅"],
  openGraph: {
    title: "음식점·식당 마케팅 대행사 — 하랑마케팅",
    description: "배달·홀 매출 동시 증대. 음식점 전문 마케팅 전략.",
    url: "https://www.harangmarketing.com/services/restaurant",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "음식점 마케팅 하랑마케팅" }],
  },
};

const CHECKLIST = [
  "배민·쿠팡이츠에 등록은 했는데 주문이 거의 없다",
  "네이버 플레이스에 내 가게가 안 보인다",
  "블로그 체험단을 어디서 구해야 할지 모른다",
  "점심·저녁 피크 외 시간대 매출이 너무 없다",
  "단골이 생기지 않고 신규 고객이 재방문을 안 한다",
  "주변 경쟁 식당보다 검색 순위가 항상 낮다",
];

const RESULTS = [
  { label: "배달 월 매출 증가", value: "+127%", sub: "4개월 · 분식집" },
  { label: "플레이스 순위", value: "1위", sub: "3개월 · 한식당" },
  { label: "블로그 유입", value: "+340%", sub: "2개월 · 카레전문점" },
];

export default function RestaurantPage() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        <section className="bg-gray-950 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <UtensilsCrossed size={12} className="text-orange-400" />
              <span className="text-gray-400 text-xs font-medium">음식점·식당 전문 마케팅</span>
            </div>
            <h1 className="text-[36px] md:text-[52px] font-black text-white leading-tight mb-5">
              음식점 마케팅,<br />
              <span className="text-orange-400">배달도 홀도</span> 살립니다
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              배민·쿠팡이츠 상위 노출부터 네이버 플레이스 SEO, 블로그 체험단까지 — 음식점 매출에 직접 연결되는 마케팅만 합니다.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mb-8">
              {RESULTS.map(r => (
                <div key={r.label} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <div className="text-xl font-black text-orange-400 mb-0.5">{r.value}</div>
                  <div className="text-[11px] text-gray-400 leading-tight">{r.sub}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact?industry=음식점"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-colors">
                음식점 무료 상담 <ArrowRight size={15} />
              </Link>
              <Link href="/free-check"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/30 text-white font-medium text-sm transition-colors">
                내 가게 무료 진단
              </Link>
            </div>
          </div>
        </section>

        {/* AEO — 업종별 한 줄 정답 (AI 답변 엔진 인용 대상) */}
        <AnswerBlock
          question="음식점·배달 마케팅은 무엇부터 해야 하나요?"
          answer="음식점·배달 마케팅은 배달앱 리뷰 관리, 네이버 플레이스 맛집 키워드 노출, 지역 맘카페 바이럴 순으로 접근하는 것이 효과적입니다. 배달 매출은 리뷰 평점과 리뷰 수에 직접 연동되기 때문입니다. 하랑마케팅이 진행한 서울 마포 음식점은 4개월 만에 월 배달 매출이 480만원에서 1,022만원으로 113% 증가했습니다. 음식점 마케팅 비용은 월 30만원부터 시작하며 상담은 무료입니다."
          facts={[
            { label: "배달 매출", value: "+113%" },
            { label: "진행 기간", value: "4개월" },
            { label: "월 매출", value: "480→1,022만" },
            { label: "시작 비용", value: "월 30만원~" },
          ]}
        />


        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">이런 문제 겪고 계신가요?</h2>
                <p className="text-gray-500 text-sm mb-6">음식점 사장님들이 가장 많이 말씀하시는 고민들입니다</p>
                <div className="space-y-3">
                  {CHECKLIST.map(item => (
                    <div key={item} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-100 rounded-xl">
                      <CheckCircle2 size={15} className="text-orange-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">이렇게 해결합니다</h2>
                <p className="text-gray-500 text-sm mb-6">음식점 채널별 맞춤 전략</p>
                <div className="space-y-4">
                  {[
                    { icon: ShoppingCart, color: "from-orange-500 to-red-500", title: "배달 플랫폼 최적화", desc: "배민·쿠팡이츠 메뉴 사진 품질 개선, 리뷰 관리, 상위 노출 전략. 주문당 마진이 높은 메뉴 중심으로 재구성합니다." },
                    { icon: TrendingUp, color: "from-blue-500 to-indigo-600", title: "네이버 플레이스 SEO", desc: "지역 키워드 '맛집', '배달' 등 롱테일 키워드 공략. 리뷰 수·답글률·사진 수를 알고리즘 기준에 맞춰 최적화합니다." },
                    { icon: Star, color: "from-blue-600 to-orange-500", title: "블로그 체험단 운영", desc: "파워블로거, 인플루언서 체험단 섭외·운영. 1회성이 아닌 지속적인 콘텐츠 누적으로 검색 노출을 늘립니다." },
                  ].map(s => (
                    <div key={s.title} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0 shadow-sm`}>
                        <s.icon size={16} className="text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="font-black text-gray-900 text-sm mb-1">{s.title}</div>
                        <div className="text-xs text-gray-500 leading-relaxed">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 bg-gray-950">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">음식점 무료 진단 받기</h2>
            <p className="text-gray-400 text-sm mb-7">배달·홀 매출 분석부터 경쟁 식당 비교까지 0원.</p>
            <Link href="/contact?industry=음식점"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-sm">
              무료 상담 신청 <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
