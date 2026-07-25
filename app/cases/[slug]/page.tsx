import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ArrowLeft, ArrowRight, TrendingUp, Clock, MapPin, CheckCircle2, Star, MessageCircle } from "lucide-react";

const CASES: Record<string, {
  title: string;
  category: string;
  location: string;
  period: string;
  services: string[];
  metric: string;
  metricLabel: string;
  color: string;
  accentColor: string;
  story: string;
  challenge: string;
  solution: string[];
  results: { label: string; before: string; after: string }[];
  quote: string;
  cta: string;
}> = {
  "cafe-ilsan-place-1st": {
    title: "플레이스 '일산 카페' 키워드 1위 달성",
    category: "카페",
    location: "경기 일산",
    period: "3개월",
    services: ["플레이스 SEO", "블로그 배포", "리뷰 마케팅"],
    metric: "+167%",
    metricLabel: "방문객 증가",
    color: "from-blue-500 to-blue-700",
    accentColor: "text-blue-600",
    story: "개업 6개월차였지만 근처 카페에 치여 검색에서 전혀 보이지 않았어요. 하랑과 함께 3개월 만에 '일산 카페' 1위가 됐고, 주말엔 대기줄이 생겼습니다.",
    challenge: "개업 6개월 차 카페임에도 불구하고 '일산 카페' 키워드에서 15위 밖으로 밀려 검색 유입이 전혀 없었습니다. 리뷰는 8개뿐이었고, 경쟁 카페들이 100개 이상의 리뷰를 보유한 상황이었습니다.",
    solution: [
      "경쟁 카페 5곳 리뷰·사진·키워드 상세 분석 후 공략 포인트 도출",
      "방문자 리뷰 유도 프로세스 구축 (QR 코드 + 리마인드 카드)",
      "사장님 답글 템플릿 제공으로 답글률 95%+ 달성",
      "네이버 블로그 포스팅 12개 배포 (일산 카페 관련 롱테일 키워드)",
      "플레이스 사진 신규 촬영 및 업로드 (메뉴·공간·음료 각 10장+)",
    ],
    results: [
      { label: "플레이스 순위", before: "15위 밖", after: "1위 달성" },
      { label: "리뷰 수", before: "8개", after: "120개+" },
      { label: "하루 방문객", before: "평균 30명", after: "평균 80명" },
    ],
    quote: "처음엔 마케팅에 돈을 써도 되나 망설였어요. 3개월 후엔 주말마다 줄이 서있습니다.",
    cta: "카페 마케팅 상담하기",
  },
  "clinic-gangnam-booking-300": {
    title: "피부과 인스타그램 신규 예약 300% 달성",
    category: "병원·의원",
    location: "서울 강서",
    period: "6개월",
    services: ["인스타그램 마케팅", "체험단 모집", "블로그 관리"],
    metric: "+300%",
    metricLabel: "신규 예약 증가",
    color: "from-blue-600 to-indigo-700",
    accentColor: "text-indigo-600",
    story: "SNS를 어떻게 해야 할지 막막했어요. 6개월 후엔 예약이 밀릴 정도가 됐고, 원장님이 직접 운영하지 않아도 돌아가는 채널이 생겼습니다.",
    challenge: "피부과 원장님이 직접 인스타그램을 운영하고 있었지만 팔로워 200명에서 수개월째 정체 중이었습니다. SNS가 실제 예약으로 이어지지 않았고, 어떤 콘텐츠를 올려야 할지 방향을 잡지 못한 상황이었습니다.",
    solution: [
      "의료 광고법 준수 범위 내 콘텐츠 전략 수립",
      "피부 고민별 솔루션 릴스 시리즈 기획·촬영 지원",
      "실제 환자 체험단 모집 및 후기 콘텐츠 제작",
      "인스타그램 예약 링크 → 카카오 채널 연동으로 전환 경로 단순화",
      "블로그 '강서 피부과' '강서 피부 고민' 키워드 포스팅 배포",
    ],
    results: [
      { label: "팔로워", before: "200명", after: "3,800명" },
      { label: "체험단 후기", before: "없음", after: "60개+" },
      { label: "월 신규 예약", before: "20건", after: "80건" },
    ],
    quote: "이제 인스타에서 '이 클리닉 어때요?' 질문이 올 정도예요. SNS가 진짜 일을 하기 시작했어요.",
    cta: "병원·의원 마케팅 상담하기",
  },
  "restaurant-mapo-delivery-2x": {
    title: "배달앱 리뷰 10개 → 180개, 매출 2배",
    category: "음식점",
    location: "서울 마포",
    period: "4개월",
    services: ["리뷰 마케팅", "맘카페 바이럴", "블로그 배포"],
    metric: "+113%",
    metricLabel: "배달 매출 증가",
    color: "from-orange-500 to-red-600",
    accentColor: "text-orange-600",
    story: "맛은 자신 있었는데 리뷰가 없으니 주문이 없더라고요. 4개월 만에 매출이 두 배가 됐어요. 이제 리뷰가 리뷰를 부릅니다.",
    challenge: "마포구에 오픈한 지 1년 된 음식점으로, 배달앱 리뷰가 10개 미만이었습니다. 배달의민족 노출이 저조해 신규 주문이 거의 없는 상황이었고, 근처 경쟁 식당들이 리뷰 200개 이상을 보유하고 있어 진입이 어렵게 느껴졌습니다.",
    solution: [
      "배달의민족·쿠팡이츠 메뉴 사진 전면 교체 (기존 대비 클릭율 3배↑)",
      "주문 후 리뷰 유도 메시지 시스템 구축",
      "마포 맘카페·지역 커뮤니티 자연스러운 바이럴 운영",
      "네이버 플레이스 최적화로 오프라인 방문객도 동시 증가",
      "점심·저녁 피크타임 맞춤 할인 이벤트로 초기 리뷰 집중 확보",
    ],
    results: [
      { label: "배달앱 노출", before: "저조", after: "상위 노출" },
      { label: "리뷰 수", before: "10개 미만", after: "180개+" },
      { label: "월 배달 매출", before: "150만원", after: "320만원" },
    ],
    quote: "이제 리뷰가 리뷰를 부르더라고요. 처음 리뷰 50개가 제일 어렵고, 그 다음부터는 스스로 굴러갔어요.",
    cta: "음식점 마케팅 상담하기",
  },
};

export async function generateStaticParams() {
  return Object.keys(CASES).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = CASES[slug];
  if (!c) return {};
  return {
    title: `${c.title} — 하랑마케팅 성공 사례`,
    description: c.story,
    openGraph: {
      title: c.title,
      description: c.story,
      url: `https://harangmarketing.com/cases/${slug}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: c.title }],
    },
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CASES[slug];
  if (!c) notFound();

  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        <section className="bg-gray-950 py-14 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <Link href="/cases" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-8 transition-colors">
              <ArrowLeft size={14} /> 전체 성공 사례
            </Link>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-xs font-bold bg-white/10 text-gray-300 px-3 py-1 rounded-full">{c.category}</span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={11} /> {c.location}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Clock size={11} /> {c.period}
              </span>
            </div>
            <h1 className="text-[28px] md:text-[40px] font-black text-white leading-tight mb-6">{c.title}</h1>
            <div className="flex flex-wrap gap-2">
              {c.services.map(s => (
                <span key={s} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              {c.results.map(r => (
                <div key={r.label}>
                  <div className={`text-2xl md:text-3xl font-black mb-0.5 ${c.accentColor}`}>{r.after}</div>
                  <div className="text-xs font-bold text-gray-900 mb-0.5">{r.label}</div>
                  <div className="text-xs text-gray-400">{r.before} → {r.after}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-4">문제 상황</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-8">{c.challenge}</p>
                <h2 className="text-xl font-black text-gray-900 mb-4">해결 방법</h2>
                <div className="space-y-3">
                  {c.solution.map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={15} className={`${c.accentColor} mt-0.5 shrink-0`} strokeWidth={2.5} />
                      <span className="text-sm text-gray-700">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-4">Before / After</h2>
                <div className="space-y-3 mb-8">
                  {c.results.map(r => (
                    <div key={r.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                      <div className="text-xs font-bold text-gray-400 mb-2">{r.label}</div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-red-50 rounded-xl p-3">
                          <div className="text-xs text-red-400 mb-1">이전</div>
                          <div className="font-black text-gray-700 text-sm">{r.before}</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3">
                          <div className="text-xs text-green-500 mb-1">이후</div>
                          <div className="font-black text-green-700 text-sm">{r.after}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <blockquote className="bg-gray-900 rounded-2xl p-5 border-l-4 border-blue-500">
                  <p className="text-white text-sm leading-relaxed italic mb-3">"{c.quote}"</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                    </div>
                    <span className="text-gray-500 text-xs">{c.location} {c.category} 사장님</span>
                  </div>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 bg-gray-950">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-black text-white mb-3">우리 매장도 이런 결과 가능할까요?</h2>
            <p className="text-gray-400 text-sm mb-7">무료 진단으로 현황을 파악하고 가능성을 먼저 확인하세요.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-sm">
                {c.cta} <ArrowRight size={15} />
              </Link>
              <Link href="/cases"
                className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-white font-medium px-7 py-3.5 rounded-xl transition-colors text-sm">
                다른 사례 보기
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
