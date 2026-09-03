import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import RankRecords from "../../components/RankRecords";
import FaqAccordion from "../../components/FaqAccordion";
import JsonLd from "../../components/JsonLd";
import { SITE, faqLd, type FaqItem } from "../../lib/seo";
import { byIndustry, byKeyword, fmt, fmtSentence, gap } from "../../lib/rank-records";

/*
 * 순위 문장 — 손으로 적지 않는다.
 * 여기 숫자를 직접 써 뒀더니 셋 중 둘이 틀린 값이 됐다. 56위 → 1위는 08-31 스냅샷에
 * 아예 없는 기록이었고, 역세권 맛집도 13위가 아니라 11위에서 시작한 기록이다.
 * 기록이 없으면 그 절이 통째로 빠진다 (C-42).
 */
const FOOD_TOP = [...byIndustry("음식점")]
  .filter((r) => r.keyword === "지역 맛집 키워드")
  .sort((a, b) => gap(b) - gap(a));
const FOOD_1 = FOOD_TOP[0];
const FOOD_2 = FOOD_TOP[1];
const FOOD_STN = byKeyword("지역 역세권 맛집 키워드");

const FOOD_DURATIONS = [
  FOOD_1 && `지역 맛집 키워드가 ${FOOD_1.from}위에서 ${FOOD_1.to}위까지 ${FOOD_1.days}일`,
  FOOD_2 && `다른 곳은 ${FOOD_2.from}위에서 ${FOOD_2.to}위까지 ${FOOD_2.days}일`,
  FOOD_STN && `지역 역세권 맛집 키워드가 ${FOOD_STN.from}위에서 ${FOOD_STN.to}위까지 ${FOOD_STN.days}일`,
]
  .filter(Boolean)
  .join(", ");

const FOOD_STORY = [
  FOOD_1 && `하랑마케팅이 진행한 음식점은 지역 맛집 키워드에서 ${fmtSentence(FOOD_1)}.`,
  FOOD_2 && `다른 매장은 같은 유형 키워드에서 ${fmtSentence(FOOD_2)}.`,
  FOOD_STN && `지역 역세권 맛집 키워드에서는 ${fmtSentence(FOOD_STN)}.`,
]
  .filter(Boolean)
  .join(" ");

const FOOD_FACTS = [
  ...(FOOD_1 ? [{ label: FOOD_1.keyword, value: fmt(FOOD_1) }, { label: "계측 기간", value: `${FOOD_1.days}일` }] : []),
  { label: "순위 계측", value: "매일 스냅샷" },
  { label: "상담·진단", value: "0원" },
];
import Link from "next/link";
import { ArrowRight, UtensilsCrossed, TrendingUp, Star, ShoppingCart, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "음식점·식당 마케팅 대행사 | 배달·플레이스 매출 증대 전문",
  description: "음식점·한식당·중식당·일식당·분식집 맞춤 마케팅. 배달의민족·쿠팡이츠 상위 노출, 네이버 플레이스 SEO, 블로그 체험단 전문. 상권 진단부터 0원으로 시작합니다.",
  keywords: ["음식점 마케팅", "식당 마케팅 대행사", "배달 매출 증대", "음식점 플레이스 SEO", "식당 블로그 마케팅"],
  openGraph: {
    title: "음식점·식당 마케팅 대행사 | 하랑마케팅",
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

/* 카페·치과 기록이 음식점 페이지 히어로에 걸려 있던 것을 음식점 기록으로 바꾼다.
   숫자 정본은 app/lib/rank-records.ts — 손으로 고치지 않는다 */
const RESULTS = byIndustry("음식점").slice(0, 3).map((r) => ({
  label: `${r.keyword}-${r.from}`,
  value: `${r.to}위`,
  sub: `${r.from}위에서 · ${r.days}일`,
}));

/* 화면에 보이는 문답을 그대로 FAQPage 로 내보낸다.
   (구조화 데이터와 본문이 어긋나면 구글이 리치 결과를 제거한다)
   숫자는 app/lib/rank-records.ts 계측값만 쓴다 - 손으로 적지 않는다. */
const SERVICE_FAQ: FaqItem[] = [
  {
    q: "배달앱 광고와 네이버 중 어디에 돈을 써야 하나요?",
    a:
      "성격이 다릅니다. 배달앱 광고는 켜는 동안만 노출되는 비용이고, 네이버 플레이스와 블로그는 쌓아 두면 광고를 끄고도 남는 자산입니다. 배달 매출 비중이 큰 곳은 두 가지를 같이 쓰고, 홀 매출이 큰 곳은 네이버부터 세웁니다. 어느 쪽이든 지금 매출이 어디서 오는지 먼저 보고 정합니다.",
  },
  {
    q: "음식점 플레이스 순위는 얼마나 올라가나요?",
    a:
      `매일 저장한 스냅샷 기준으로 ${FOOD_DURATIONS} 걸린 기록이 있습니다. 같은 기간에 순위가 내려간 곳도 있고 첫 페이지에 못 올라간 키워드도 있습니다. 그래서 몇 위까지 올려드린다는 약속은 하지 않습니다. 시작 전에 현재 순위를 재서 그 숫자부터 보여드립니다.`,
  },
  {
    q: "리뷰에 악평이 달렸는데 지울 수 있나요?",
    a:
      "사실에 근거한 리뷰는 지울 수 없고 지우려 해서도 안 됩니다. 다만 욕설이나 명백한 허위 · 다른 가게와 혼동한 글은 플랫폼에 신고해 처리할 수 있습니다. 실제로 효과가 있는 것은 삭제보다 답글입니다. 어떻게 고쳤는지 적힌 답글은 그 리뷰를 읽는 다음 손님에게 설명이 됩니다.",
  },
  {
    q: "음식 사진은 전문가가 찍어야 하나요?",
    a:
      "꼭 그렇지는 않습니다. 창가 자리에서 낮에 찍고 접시를 정리하는 것만으로도 크게 달라집니다. 다만 대표 메뉴 서너 개는 제대로 찍어 두시는 편이 오래 남습니다. 저희는 밝기와 색온도를 맞추는 보정까지만 하고 양이나 크기를 실물과 다르게 만들지 않습니다.",
  },
  {
    q: "신메뉴를 낼 때마다 알려야 하나요?",
    a:
      "알리는 편이 낫습니다. 플레이스 소식과 블로그에 신메뉴가 올라가면 새 검색어가 하나 생기고, 기존 손님에게는 다시 올 이유가 됩니다. 다만 메뉴판과 가격을 같이 맞춰 두지 않으면 손님이 헛걸음합니다. 저희는 가격을 최신 메뉴판에서만 가져오고 지난 행사가를 쓰지 않습니다.",
  },
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
          answer={`음식점·배달 마케팅은 배달앱 리뷰 관리, 네이버 플레이스 맛집 키워드 노출, 지역 맘카페 바이럴 순으로 접근하는 것이 효과적입니다. 배달 매출은 리뷰 평점과 리뷰 수에 직접 연동되기 때문입니다. ${FOOD_STORY} 네이버 플레이스 순위는 매일 스냅샷으로 저장해 월 리포트로 공유합니다. 방문객·매출·예약 건수는 계측 대상이 아니어서 수치로 제시하지 않습니다. 음식점 마케팅 비용은 배달·홀 비중과 진행 범위에 따라 달라져 현황 진단 후 안내드리며, 상담과 진단은 0원입니다.`}
          facts={FOOD_FACTS}
        />

        {/* 순위 계측 기록 — 숫자는 app/lib/rank-records.ts 한 곳에서만 온다 */}
        <RankRecords industries={["음식점"]} industryLabel="음식점·배달" />

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
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: "var(--w-primary)" }}>
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

        {/* 자주 묻는 질문 - 화면 노출 + FAQPage 구조화 데이터 */}
        <JsonLd data={faqLd(SERVICE_FAQ, `${SITE.base}/services/restaurant`)} />
        <FaqAccordion
          items={SERVICE_FAQ}
          title="음식점 사장님들이 가장 많이 묻는 질문"
          subtitle="상담에서 실제로 나온 질문을 그대로 옮겼습니다. 순위 숫자는 매일 저장한 스냅샷 실측값입니다."
          showMoreHref="/faq"
        />

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
