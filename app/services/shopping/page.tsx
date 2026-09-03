import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import RankRecords from "../../components/RankRecords";
import FaqAccordion from "../../components/FaqAccordion";
import JsonLd from "../../components/JsonLd";
import { SITE, faqLd, type FaqItem } from "../../lib/seo";
import { PLACE_RANK_TOTALS } from "../../lib/place-rank-cases";
import Link from "next/link";
import { ArrowRight, ShoppingBag, TrendingUp, Star, Package, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "쇼핑몰·소매점 마케팅 대행사 | 온·오프라인 매출 증대",
  description: "의류·잡화·소매점·옷가게 맞춤 마케팅. 네이버 스마트스토어, 인스타그램 쇼핑, 플레이스 SEO 전문. 온·오프라인 동시 매출 증대 실제 성과.",
  keywords: ["쇼핑몰 마케팅", "소매점 마케팅", "의류 마케팅 대행사", "스마트스토어 마케팅", "인스타 쇼핑 마케팅"],
  openGraph: {
    title: "쇼핑몰·소매점 마케팅 대행사 | 하랑마케팅",
    description: "온·오프라인 매출을 동시에 올리는 쇼핑몰 마케팅.",
    url: "https://www.harangmarketing.com/services/shopping",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "쇼핑몰 마케팅 하랑마케팅" }],
  },
};

/* 온라인 쇼핑몰 업종은 공개할 순위 기록이 없다.
   히어로에 다른 업종 기록을 걸어 두었던 것을 전사 계측 현황으로 바꾼다.
   숫자 정본은 app/lib/rank-records.ts — 손으로 고치지 않는다 */
const RESULTS = [
  { label: "계측 매장", value: `${PLACE_RANK_TOTALS.stores}곳`, sub: "계측 중인 매장" },
  { label: "계측 키워드", value: `${PLACE_RANK_TOTALS.keywords}개`, sub: "플레이스 계측 키워드" },
  { label: "1페이지 유지", value: `${PLACE_RANK_TOTALS.page1Keywords}개`, sub: "1페이지 유지 키워드" },
];

/* 화면에 보이는 문답을 그대로 FAQPage 로 내보낸다.
   (구조화 데이터와 본문이 어긋나면 구글이 리치 결과를 제거한다)
   숫자는 app/lib/rank-records.ts 계측값만 쓴다 - 손으로 적지 않는다. */
const SERVICE_FAQ: FaqItem[] = [
  {
    q: "상세페이지만 바꿔도 매출이 오르나요?",
    a:
      "들어오는 사람이 있을 때만 오릅니다. 상세페이지는 이미 들어온 사람을 결제까지 데려가는 역할이라, 유입이 하루 몇 명인 상태에서 상세만 고치면 변화가 잘 보이지 않습니다. 그래서 저희는 유입과 상세를 같이 봅니다. 지금 어느 쪽이 막혀 있는지는 유입 수와 구매 전환을 놓고 보면 바로 갈립니다.",
  },
  {
    q: "상세페이지에서 가장 먼저 나와야 하는 것은 무엇인가요?",
    a:
      "이게 무엇이고 나에게 왜 필요한지입니다. 브랜드 이야기나 제조 공정을 앞에 두면 대부분 첫 화면에서 나갑니다. 첫 스크롤에서 제품과 용도 · 핵심 차이를 보여주고, 그다음에 근거와 후기 · 배송과 교환 정보를 둡니다. 불안을 지우는 순서대로 놓는 것이 설득 순서입니다.",
  },
  {
    q: "체험단 후기는 몇 개나 필요한가요?",
    a:
      "정해진 숫자는 없고 카테고리마다 다릅니다. 후기가 없으면 첫 구매가 안 일어나기 때문에 초기에는 도움이 되지만, 후기 숫자만 늘린다고 전환이 따라 오르지는 않습니다. 실제 사용한 사람이 쓴 글인지가 훨씬 크게 작용합니다. 저희는 구매 후기를 사거나 대신 쓰지 않고, 대가를 받은 글에는 그 사실을 표시하게 합니다.",
  },
  {
    q: "식품을 파는데 표시사항은 어떻게 해야 하나요?",
    a:
      "원재료와 용량 · 소비기한 · 보관방법 · 제조원 · 알레르기 유발 물질은 빠뜨릴 수 없는 법정 항목입니다. 이 값은 저희가 추측해서 채우지 않고 사장님께 확인받은 것만 넣습니다. 틀린 값은 빈 값보다 위험해서, 모르면 비워두고 여쭤봅니다. 효능이나 질병 예방을 말하는 표현도 쓰지 않습니다.",
  },
  {
    q: "스마트스토어와 자사몰 중 어디에 힘을 써야 하나요?",
    a:
      "파는 물건이 이미 검색되는 물건이면 스마트스토어가 빠릅니다. 검색량이 있는 카테고리에서는 유입을 네이버가 만들어 주기 때문입니다. 반대로 브랜드로 파는 물건이거나 재구매가 중요한 물건이면 자사몰에 쌓는 편이 오래갑니다. 둘 다 여신다면 스마트스토어로 먼저 팔리는 것을 확인하고 자사몰을 붙이는 순서를 권합니다.",
  },
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
          answer="온라인 쇼핑몰은 오프라인 매장과 달리 지역 키워드가 없으므로 상품 키워드 블로그 SEO와 체험단 후기 확보가 출발점입니다. 검색으로 유입된 고객이 후기를 보고 구매를 결정하기 때문입니다. 네이버 플레이스 순위는 매일 스냅샷으로 저장해 월 리포트로 공유합니다. 방문객·매출·예약 건수는 계측 대상이 아니어서 수치로 제시하지 않습니다. 쇼핑몰 마케팅은 전국 어디서나 비대면으로 진행되며, 비용은 상품군과 진행 범위에 따라 달라져 현황 진단 후 안내드립니다. 상담과 진단은 0원입니다."
          facts={[
            { label: "주력 채널", value: "상품 키워드 블로그 SEO" },
            { label: "보조 채널", value: "체험단 후기" },
            { label: "순위 계측", value: "매일 스냅샷" },
            { label: "상담·진단", value: "0원" },
          ]}
        />


        {/* 순위 계측 — 이 업종은 공개할 기록이 없다. 남의 업종 숫자를 빌려오지 않는다 */}
        <RankRecords industries={[]} industryLabel="온라인 쇼핑몰" />

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

        {/* 자주 묻는 질문 - 화면 노출 + FAQPage 구조화 데이터 */}
        <JsonLd data={faqLd(SERVICE_FAQ, `${SITE.base}/services/shopping`)} />
        <FaqAccordion
          items={SERVICE_FAQ}
          title="쇼핑몰 운영에서 가장 많이 받는 질문"
          subtitle="상담에서 실제로 나온 질문을 그대로 옮겼습니다. 상담 전에 미리 확인해보세요."
          showMoreHref="/faq"
        />

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
