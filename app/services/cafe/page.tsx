import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import RankRecords from "../../components/RankRecords";
import PlaceRankCasesSection from "../../components/PlaceRankCases";
import FaqAccordion from "../../components/FaqAccordion";
import JsonLd from "../../components/JsonLd";
import { SITE, faqLd, type FaqItem } from "../../lib/seo";
import { byIndustry, PLACE_RANK_AS_OF } from "../../lib/place-rank-cases";
import { byKeyword, fmt, fmtSentence } from "../../lib/rank-records";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, TrendingUp, Star, MapPin,
  Coffee, MessageSquare, BarChart3,
} from "lucide-react";

/*
 * 순위 문장 — 손으로 적지 않는다.
 * 이 파일은 아래 FAQ 위에 「손으로 적지 않는다」고 적어 두고도 문장에 숫자를 직접 써 뒀고,
 * 스냅샷이 6회에서 11회로 바뀌자 셋이 틀린 값이 됐다 (56위 → 1위는 아예 없는 기록이었다).
 * 기록이 없으면 문장이 통째로 빠진다. 틀린 값보다 빈 값이 낫다 (C-42).
 */
const CAFE = byKeyword("지역 카페 키워드");
const DESSERT = byKeyword("지역 디저트카페 키워드");

const CAFE_STORY = [
  CAFE && `하랑마케팅이 진행한 카페는 지역 카페 키워드에서 ${fmtSentence(CAFE)}.`,
  DESSERT && `다른 카페는 지역 디저트카페 키워드에서 ${fmtSentence(DESSERT)}.`,
]
  .filter(Boolean)
  .join(" ");

const CAFE_DURATIONS = [
  CAFE && `지역 카페 키워드가 ${CAFE.from}위에서 ${CAFE.to}위까지 ${CAFE.days}일`,
  DESSERT && `지역 디저트카페 키워드가 ${DESSERT.from}위에서 ${DESSERT.to}위까지 ${DESSERT.days}일`,
]
  .filter(Boolean)
  .join(", ");

const CAFE_FACTS = [
  ...(CAFE ? [{ label: CAFE.keyword, value: fmt(CAFE) }] : []),
  ...(DESSERT ? [{ label: DESSERT.keyword, value: fmt(DESSERT) }] : []),
  ...(CAFE || DESSERT
    ? [{ label: "계측 기간", value: `${Math.max(CAFE?.days ?? 0, DESSERT?.days ?? 0)}일` }]
    : []),
  { label: "순위 계측", value: "매일 스냅샷" },
  { label: "상담·진단", value: "0원" },
];

export const metadata: Metadata = {
  title: "카페·베이커리 마케팅 | 플레이스 SEO · 리뷰 · 블로그",
  description: "카페·베이커리 전문 마케팅. 네이버 플레이스 상위 노출, 포토리뷰 확보, 블로그·인스타 바이럴로 방문객을 늘립니다. 무료 상담 가능.",
  keywords: ["카페 마케팅", "카페 플레이스 SEO", "카페 리뷰 마케팅", "베이커리 마케팅", "네이버 플레이스 카페"],
  openGraph: {
    title: "카페·베이커리 마케팅 | 하랑마케팅",
    description: "플레이스 상위 노출부터 포토리뷰 확보까지. 카페 전문 마케팅 전략.",
    url: "https://www.harangmarketing.com/services/cafe",
    images: [{ url: "https://www.harangmarketing.com/og-image.png", width: 1200, height: 630 }],
  },
};

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

/* 화면에 보이는 문답을 그대로 FAQPage 로 내보낸다.
   (구조화 데이터와 본문이 어긋나면 구글이 리치 결과를 제거한다)
   숫자는 app/lib/rank-records.ts 계측값만 쓴다 - 손으로 적지 않는다. */
const SERVICE_FAQ: FaqItem[] = [
  {
    q: "카페 플레이스 순위를 올리는 데 얼마나 걸리나요?",
    a:
      `저희가 매일 저장한 스냅샷 기준으로 ${CAFE_DURATIONS} 걸린 기록이 있습니다. 다만 이 숫자는 그 지역 · 그 경쟁 상황에서 나온 값이라 모든 카페에 같은 기간을 약속드리지 않습니다. 경쟁 업체가 많은 상권일수록 오래 걸리고, 내려간 곳도 있습니다. 시작 전에 현재 순위와 경쟁 업체 수를 먼저 재서 보여드립니다.`,
  },
  {
    q: "리뷰는 몇 개나 있어야 하나요?",
    a:
      "정해진 숫자는 없습니다. 다만 리뷰가 한 자리 수면 손님이 결정을 미루고, 최근 한 달 안에 달린 리뷰가 없으면 문 닫은 곳으로 오해받습니다. 그래서 총 개수보다 최근 리뷰가 꾸준히 붙는지가 더 중요합니다. 저희는 리뷰를 사거나 대신 써주지 않고, 방문한 손님이 남기기 쉽게 만드는 쪽으로 합니다.",
  },
  {
    q: "카페 사진은 무엇을 찍어야 하나요?",
    a:
      "손님이 검색할 때 궁금해하는 순서대로 찍습니다. 대표 메뉴 한 컷 · 앉는 자리가 보이는 내부 · 간판과 입구 · 주차 공간 · 메뉴판입니다. 이 다섯 가지가 없으면 순위가 올라도 방문으로 잘 넘어가지 않습니다. 카카오톡으로 보내주신 압축 사진은 화질이 떨어져 상세 화면에 그대로 쓰지 않고 원본을 다시 받습니다.",
  },
  {
    q: "인스타그램과 네이버 중 어디에 먼저 힘을 써야 하나요?",
    a:
      "지금 매출을 만드는 쪽이 먼저입니다. 카페는 대부분 지역 검색으로 발견되기 때문에 네이버 플레이스와 블로그를 먼저 세우고, 인스타그램은 그다음에 붙입니다. 인스타그램은 발견보다 재방문과 팬을 만드는 자리에 가깝습니다. 둘 다 하시더라도 순서를 바꾸면 같은 비용으로 덜 남습니다.",
  },
  {
    q: "오픈 전에도 마케팅을 시작할 수 있나요?",
    a:
      "오픈 전에 시작하는 편이 낫습니다. 플레이스 등록과 사진 · 메뉴 정리는 오픈 당일에 끝내는 것보다 미리 해두어야 첫 주부터 검색에 걸립니다. 다만 오픈 전에는 아직 리뷰가 없으니 첫 달은 방문을 만드는 데 집중합니다. 사업자등록과 영업신고가 끝나야 등록되는 항목이 있어서 일정은 미리 맞춰봅니다.",
  },
];

export default function CafeLandingPage() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 py-16 md:py-24">
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
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm"
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
          answer={`카페·베이커리 마케팅의 핵심은 네이버 플레이스 상위 노출, 포토리뷰 확보, 인스타그램 비주얼 콘텐츠 세 가지입니다. 사진 품질과 포토리뷰 수가 카페 업종의 플레이스 순위를 가장 크게 좌우하기 때문입니다. ${CAFE_STORY} 네이버 플레이스 순위는 매일 스냅샷으로 저장해 월 리포트로 공유합니다. 방문객·매출·예약 건수는 계측 대상이 아니어서 수치로 제시하지 않습니다. 카페 마케팅 비용은 상권 경쟁 강도와 진행 범위에 따라 달라져 현황 진단 후 안내드리며, 상담과 진단은 0원입니다.`}
          facts={CAFE_FACTS}
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

        {/* 순위 계측 기록 — 숫자는 app/lib/rank-records.ts 한 곳에서만 온다 */}
        <RankRecords industries={["카페"]} industryLabel="카페·베이커리" />

        {/* 카페 업종 계측 — 숫자는 app/lib/place-rank-cases.ts 한 곳에서만 온다 */}
        <PlaceRankCasesSection
          cases={byIndustry("카페")}
          eyebrow="Place Rank"
          title="카페 매장에서 잰 순위"
          description={`${PLACE_RANK_AS_OF} 기준으로 카페 업종에서 잰 기록입니다. 카드 하나가 키워드 하나입니다.`}
          cta={{ href: "/cases/place-rank", label: "다른 업종 기록도 보기" }}
          columns={2}
          background="bg-gray-50"
        />

        {/* 서비스 구성 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-8">카페 전용 마케팅 패키지</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl shadow-sm flex items-center justify-center flex-shrink-0" style={{ background: "var(--w-primary)" }}>
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

        {/* 자주 묻는 질문 - 화면 노출 + FAQPage 구조화 데이터 */}
        <JsonLd data={faqLd(SERVICE_FAQ, `${SITE.base}/services/cafe`)} />
        <FaqAccordion
          items={SERVICE_FAQ}
          title="카페 사장님들이 가장 많이 묻는 질문"
          subtitle="상담에서 실제로 나온 질문을 그대로 옮겼습니다. 순위 숫자는 매일 저장한 스냅샷 실측값입니다."
          showMoreHref="/faq"
        />

        {/* CTA */}
        <section className="py-14 md:py-20 bg-blue-600">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
              <TrendingUp size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              내 카페도 가능한지 먼저 확인하세요
            </h2>
            <p className="text-blue-50 text-sm mb-7">
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
