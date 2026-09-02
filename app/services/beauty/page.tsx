import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import RankRecords from "../../components/RankRecords";
import FaqAccordion from "../../components/FaqAccordion";
import JsonLd from "../../components/JsonLd";
import { SITE, faqLd, type FaqItem } from "../../lib/seo";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, TrendingUp, Star, MapPin,
  Scissors, MessageSquare, Camera,
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
    color: "from-blue-600 to-orange-600",
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

/* 화면에 보이는 문답을 그대로 FAQPage 로 내보낸다.
   (구조화 데이터와 본문이 어긋나면 구글이 리치 결과를 제거한다)
   숫자는 app/lib/rank-records.ts 계측값만 쓴다 - 손으로 적지 않는다. */
const SERVICE_FAQ: FaqItem[] = [
  {
    q: "미용실 인스타그램은 팔로워를 늘려야 예약이 늘어나나요?",
    a:
      "팔로워 수와 예약 수는 생각보다 붙어 있지 않습니다. 예약은 대부분 지역 검색과 저장에서 오고, 인스타그램은 시술 결과를 확인하는 자리로 쓰입니다. 그래서 저희는 팔로워를 사거나 이벤트로 숫자만 올리는 방식을 쓰지 않습니다. 시술 카테고리별로 결과 사진을 정리해 두는 쪽이 예약까지 훨씬 짧게 갑니다.",
  },
  {
    q: "네일샵도 네이버 플레이스가 중요한가요?",
    a:
      "중요합니다. 네일과 속눈썹은 집이나 직장 가까운 곳을 지도에서 찾아 예약하는 경우가 많아서, 지도에서 몇 번째에 보이는지가 문의 수를 그대로 바꿉니다. 저희는 플레이스 정보와 사진 · 메뉴 · 예약 버튼까지 정리한 다음 순위를 매일 저장해 변화를 봅니다. 다만 미용 업종은 아직 공개할 순위 기록이 없어서 다른 업종 숫자를 대신 보여드리지 않습니다.",
  },
  {
    q: "체험단은 꼭 해야 하나요?",
    a:
      "필수는 아닙니다. 체험단은 후기가 아예 없어서 첫 방문이 망설여지는 초기에 쓰는 도구이고, 후기가 이미 쌓인 곳에서는 굳이 하지 않아도 됩니다. 하는 경우에도 실제 방문하고 실제 시술을 받은 사람만 씁니다. 대가를 받고 쓴 글에는 그 사실을 표시하게 합니다.",
  },
  {
    q: "시술 사진은 어떻게 찍어야 하나요?",
    a:
      "같은 자리 · 같은 조명에서 시술 전과 후를 찍는 것이 가장 강합니다. 저희는 밝기와 색온도를 맞추고 배경을 정리하는 보정까지만 합니다. 손톱 모양이나 색을 실물과 다르게 바꾸지 않습니다. 받아보신 손님이 사진과 다르다고 말할 수 있으면 그건 보정이 아니라 조작이라고 봅니다.",
  },
  {
    q: "예약이 꽉 차면 마케팅을 멈춰야 하나요?",
    a:
      "멈추기보다 방향을 바꾸는 편이 낫습니다. 예약이 찼다는 것은 지금 손님이 온다는 뜻이지 다음 달에도 온다는 뜻은 아니고, 플레이스 순위는 손을 놓으면 다시 내려갑니다. 이럴 때는 신규 유입을 늘리는 대신 단가가 높은 시술을 앞으로 빼고 재방문을 붙이는 쪽으로 옮깁니다. 실제로 그렇게 조정한 곳이 있고 판단은 사장님과 같이 합니다.",
  },
];

export default function BeautyLandingPage() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 py-16 md:py-24">
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

        {/* AEO — 업종별 한 줄 정답 (AI 답변 엔진 인용 대상) */}
        <AnswerBlock
          question="미용실·네일샵 마케팅은 어떤 채널이 가장 효과적인가요?"
          answer="미용·네일·뷰티 업종은 인스타그램 릴스와 비포애프터 포트폴리오가 가장 효과적입니다. 시술 결과를 눈으로 확인해야 예약으로 이어지는 업종이기 때문입니다. 네이버 플레이스 순위는 매일 스냅샷으로 저장해 월 리포트로 공유합니다. 방문객·매출·예약 건수는 계측 대상이 아니어서 수치로 제시하지 않습니다. 뷰티 마케팅 비용은 시술 구성과 진행 범위에 따라 달라져 현황 진단 후 안내드리며, 상담과 진단은 0원입니다."
          facts={[
            { label: "주력 채널", value: "인스타 릴스" },
            { label: "보조 채널", value: "비포애프터 포트폴리오" },
            { label: "순위 계측", value: "매일 스냅샷" },
            { label: "상담·진단", value: "0원" },
          ]}
        />


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

        {/* 순위 계측 — 뷰티 업종은 공개할 기록이 없다. 남의 업종 숫자를 빌려오지 않는다 */}
        <RankRecords industries={[]} industryLabel="미용·네일·뷰티" />

        {/* 서비스 구성 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-8">뷰티 전용 마케팅 패키지</h2>
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
        <JsonLd data={faqLd(SERVICE_FAQ, `${SITE.base}/services/beauty`)} />
        <FaqAccordion
          items={SERVICE_FAQ}
          title="미용실 · 네일샵 사장님들이 가장 많이 묻는 질문"
          subtitle="상담에서 실제로 나온 질문을 그대로 옮겼습니다. 상담 전에 미리 확인해보세요."
          showMoreHref="/faq"
        />

        {/* CTA */}
        <section className="py-14 md:py-20 bg-pink-600">
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
