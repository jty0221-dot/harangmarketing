import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import Link from "next/link";
import { ArrowRight, ShoppingBag, TrendingUp, Star, Package, CheckCircle2, Search, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "쇼핑몰·소매점 마케팅 대행사 — 하랑마케팅 | 온·오프라인 매출 증대",
  description: "의류·잡화·소매점·옷가게 맞춤 마케팅. 네이버 스마트스토어, 인스타그램 쇼핑, 플레이스 SEO 전문. 온·오프라인 동시 매출 증대 실제 성과.",
  keywords: ["쇼핑몰 마케팅", "소매점 마케팅", "의류 마케팅 대행사", "스마트스토어 마케팅", "인스타 쇼핑 마케팅"],
  openGraph: {
    title: "쇼핑몰·소매점 마케팅 대행사 — 하랑마케팅",
    description: "온·오프라인 매출을 동시에 올리는 쇼핑몰 마케팅.",
    url: "https://www.harangmarketing.com/services/shopping",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "쇼핑몰 마케팅 하랑마케팅" }],
  },
};

const RESULTS = [
  { label: "스마트스토어 매출", value: "+156%", sub: "3개월 · 의류 쇼핑몰" },
  { label: "인스타 팔로워", value: "0→3천", sub: "4개월 · 잡화점" },
  { label: "오프라인 방문", value: "+89%", sub: "2개월 · 액세서리 샵" },
];

export default function ShoppingPage() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        <section className="bg-gray-950 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <ShoppingBag size={12} className="text-purple-400" />
              <span className="text-gray-400 text-xs font-medium">쇼핑몰·소매점 전문 마케팅</span>
            </div>
            <h1 className="text-[36px] md:text-[52px] font-black text-white leading-tight mb-5">
              쇼핑몰 매출,<br />
              <span className="text-purple-400">온·오프라인 동시에</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              스마트스토어·인스타그램 쇼핑부터 오프라인 매장 집객까지 — 쇼핑몰과 소매점의 두 채널을 동시에 살립니다.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mb-8">
              {RESULTS.map(r => (
                <div key={r.label} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <div className="text-xl font-black text-purple-400 mb-0.5">{r.value}</div>
                  <div className="text-[11px] text-gray-400 leading-tight">{r.sub}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact?industry=쇼핑몰"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-colors">
                쇼핑몰 무료 상담 <ArrowRight size={15} />
              </Link>
              <Link href="/free-check"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/30 text-white font-medium text-sm transition-colors">
                내 매장 무료 진단
              </Link>
            </div>
          </div>
        </section>

        {/* AEO — 업종별 한 줄 정답 (AI 답변 엔진 인용 대상) */}
        <AnswerBlock
          question="온라인 쇼핑몰 마케팅은 무엇부터 시작해야 하나요?"
          answer="온라인 쇼핑몰은 오프라인 매장과 달리 지역 키워드가 없으므로 상품 키워드 블로그 SEO와 체험단 후기 확보가 출발점입니다. 검색으로 유입된 고객이 후기를 보고 구매를 결정하기 때문입니다. 하랑마케팅이 진행한 온라인 쇼핑몰은 4개월 만에 월 매출이 230만원에서 377만원으로 64% 증가했습니다. 쇼핑몰 마케팅은 전국 어디서나 비대면으로 진행되며, 비용은 상품군과 진행 범위에 따라 달라져 현황 진단 후 안내드립니다. 상담과 진단은 0원입니다."
          facts={[
            { label: "월 매출", value: "230→377만" },
            { label: "증가율", value: "+64%" },
            { label: "진행 기간", value: "4개월" },
            { label: "상담·진단", value: "0원" },
          ]}
        />


        {/* 체크리스트 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-2">
              이 중 하나라도 해당되면 지금 바로 시작하세요
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">유입이 없으면 좋은 상품도 팔리지 않습니다</p>
            <div className="space-y-3">
              {[
                "스마트스토어 일 방문자가 30명 미만인가요?",
                "인스타그램 팔로워가 500명 미만인가요?",
                "제품 사진은 있는데 구매 전환이 안 되나요?",
                "오프라인 매장인데 온라인에서 아예 안 보이나요?",
                "SNS 운영이 불규칙하거나 월 4개 미만인가요?",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <CheckCircle2 size={18} className="text-purple-500 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-gray-800 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">쇼핑몰 마케팅 핵심 전략</h2>
            <p className="text-gray-500 text-sm text-center mb-10">온라인과 오프라인을 연결하는 통합 마케팅</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: Package, color: "from-purple-500 to-purple-700", title: "스마트스토어 최적화", desc: "상품 태그, 상세페이지 카피, 리뷰 관리, 스토어 SEO. 검색 유입부터 구매 전환율까지 끌어올립니다." },
                { icon: TrendingUp, color: "from-pink-500 to-rose-500", title: "인스타그램 쇼핑 운영", desc: "제품 사진 기획, 릴스 콘텐츠, 쇼핑 태그 설정, 팔로워 기반 매출 전환. 브랜드 이미지와 매출을 동시에 쌓습니다." },
                { icon: Star, color: "from-blue-600 to-orange-500", title: "오프라인 집객 마케팅", desc: "네이버 플레이스·카카오맵 최적화로 '근처 검색' 유입을 늘립니다. 오프라인 방문 고객이 온라인 구매로도 이어집니다." },
              ].map(s => (
                <div key={s.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 shadow-sm" style={{ background: "var(--w-primary)" }}>
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
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">쇼핑몰 무료 진단 받기</h2>
            <p className="text-gray-400 text-sm mb-7">온·오프라인 채널 분석부터 매출 증대 전략까지 0원.</p>
            <Link href="/contact?industry=쇼핑몰"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-sm">
              무료 상담 신청 <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
