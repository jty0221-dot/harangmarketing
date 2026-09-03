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
  Stethoscope, MessageSquare,
  ShieldCheck, ScrollText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "의원·한의원·피부과 마케팅 — 하랑마케팅 | 신환 유입 · 플레이스 SEO · 블로그",
  description: "의원·한의원·피부과 전문 마케팅. 의료법 준수 블로그, 플레이스 상위 노출, 리뷰 관리로 신환 예약을 늘립니다. 무료 상담 가능.",
  keywords: ["의원 마케팅", "한의원 마케팅", "피부과 마케팅", "병원 플레이스 SEO", "신환 유입 마케팅"],
  openGraph: {
    title: "의원·한의원·피부과 마케팅 — 하랑마케팅",
    description: "의료법을 준수하면서 신환이 늘어나는 병원 마케팅 전략.",
    url: "https://www.harangmarketing.com/services/clinic",
    images: [{ url: "https://www.harangmarketing.com/og-image.png", width: 1200, height: 630 }],
  },
};

const SERVICES = [
  {
    icon: MapPin,
    color: "from-blue-500 to-blue-700",
    title: "플레이스 SEO",
    desc: "진료과목 키워드 최적화 · 지역+과목 상위 노출",
  },
  {
    icon: Star,
    color: "from-blue-600 to-orange-600",
    title: "리뷰 관리",
    desc: "긍정 리뷰 확보 · 부정 리뷰 대응 전략",
  },
  {
    icon: MessageSquare,
    color: "from-purple-500 to-purple-700",
    title: "의료법 준수 블로그",
    desc: "의료광고 심의 기준 충족 · 증례 콘텐츠 기획",
  },
  {
    icon: ShieldCheck,
    color: "from-green-500 to-green-700",
    title: "신뢰도 콘텐츠",
    desc: "원장 전문성 강조 · 치료 과정 스토리텔링",
  },
];

const CHECKLIST = [
  "네이버 플레이스 순위가 5위 밖인가요?",
  "신환 예약이 월 30명 미만인가요?",
  "리뷰 응답률이 50% 미만인가요?",
  "블로그 포스팅이 불규칙하거나 월 4개 미만인가요?",
  "근처에 같은 과목 경쟁 의원이 3곳 이상인가요?",
];

/* 화면에 보이는 문답을 그대로 FAQPage 로 내보낸다.
   (구조화 데이터와 본문이 어긋나면 구글이 리치 결과를 제거한다)
   숫자는 app/lib/rank-records.ts 계측값만 쓴다 - 손으로 적지 않는다. */
const SERVICE_FAQ: FaqItem[] = [
  {
    q: "병원 광고는 심의를 꼭 받아야 하나요?",
    a:
      "매체에 따라 다릅니다. 의료법 제57조는 신문과 정기간행물 · 현수막과 전단 · 전광판 · 이용자가 많은 인터넷 매체와 애플리케이션을 심의 대상으로 정하고 있습니다. 반대로 의료기관 명칭과 소재지 · 전화번호, 진료과목, 소속 의료인의 성명과 성별 및 면허의 종류만 알리는 광고는 심의를 받지 않아도 됩니다. 저희는 원고를 쓰기 전에 이 매체가 심의 대상인지부터 확인하고 시작합니다.",
  },
  {
    q: "환자 후기를 블로그에 올려도 되나요?",
    a:
      "치료경험담은 의료법 제56조 제2항이 금지하는 항목에 들어갑니다. 환자가 자발적으로 쓴 글이라도 병원이 그것을 시키거나 대가를 주면 제27조 제3항의 소개 · 알선 · 유인을 사주하는 행위가 될 수 있습니다. 그래서 저희는 병원에 체험단이나 후기 대가 지급을 권하지 않습니다. 대신 진료 과정과 장비 · 원장 이력처럼 사실로 확인되는 것을 씁니다.",
  },
  {
    q: "심의를 한 번 받으면 계속 쓸 수 있나요?",
    a:
      "심의 유효기간은 승인일부터 3년입니다. 기간이 끝나고도 같은 광고를 계속 쓰려면 만료 6개월 전에 다시 심의를 신청해야 합니다. 문제는 이 날짜를 관리하는 곳이 없으면 조용히 지나간다는 점입니다. 저희는 병원별로 심의 번호와 승인일 · 만료일을 대장에 적어 두고 만료 전에 먼저 알려드립니다.",
  },
  {
    q: "병원도 플레이스 순위가 올라가나요?",
    a:
      "매일 저장한 스냅샷 기준으로 지역 치과 키워드가 5위에서 1위까지 32일, 지역 역세권 치과 키워드가 6위에서 1위까지 32일, 지역 피부과 키워드가 10위에서 2위까지 32일 걸린 기록이 있습니다. 다만 이 숫자는 순위이지 환자 수가 아닙니다. 방문 환자와 예약 건수 · 매출은 저희가 계측할 수 있는 값이 아니라서 수치로 제시하지 않습니다. 순위 보장도 하지 않습니다.",
  },
  {
    q: "광고에 문제가 생기면 누가 책임지나요?",
    a:
      "의료법 제56조 제1항은 의료광고를 할 수 있는 주체를 의료기관 개설자와 의료기관의 장 또는 의료인으로 정하고 있습니다. 즉 광고의 주체는 병원이고 행정처분도 병원에 갑니다. 대행사가 썼다는 것은 면책 사유가 되지 않습니다. 그래서 저희는 원장님 확인을 받기 전에는 어떤 원고도 게시하지 않고, 심의가 필요한 매체는 심의필증을 받은 뒤에 올립니다.",
  },
];

export default function ClinicLandingPage() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-950 via-indigo-950 to-gray-950 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <Stethoscope size={12} strokeWidth={2.5} />
              의원 · 한의원 전문
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              병원 검색 마케팅은<br />
              <span className="text-blue-400">잰 숫자로 말합니다</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
              의료법 제56조와 제57조를 기준으로 원고를 검수합니다.<br />
              순위는 매일 저장해 월 리포트로 그대로 보여드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm"
              >
                무료 상담 신청 <ArrowRight size={15} />
              </Link>
              <Link
                href="/free-check"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
              >
                내 의원 무료 진단
              </Link>
            </div>
          </div>
        </section>

        {/* AEO — 업종별 한 줄 정답 (AI 답변 엔진 인용 대상) */}
        <AnswerBlock
          question="병원·의원 마케팅은 무엇이 중요한가요?"
          answer="의원·한의원·피부과 마케팅은 신뢰도가 전부이므로 원장님의 이력과 진료 과목을 사실대로 정리한 블로그 콘텐츠가 가장 중요합니다. 치료경험담은 의료법 제56조 제2항이 금지하는 항목이라 후기를 만들어 내는 방식은 쓰지 않습니다. 하랑마케팅이 진행한 치과는 지역 치과 키워드에서 5위가 1위가 됐고(32일 계측), 지역 역세권 치과 키워드에서도 6위가 1위가 됐습니다(32일 계측). 피부과는 지역 피부과 키워드에서 10위가 2위가 됐습니다(32일 계측). 네이버 플레이스 순위는 매일 스냅샷으로 저장해 월 리포트로 공유합니다. 방문객·매출·예약 건수는 계측 대상이 아니어서 수치로 제시하지 않습니다. 의료법 제56조와 제57조를 기준으로 원고를 검수한 뒤 병원 명의 채널에 올립니다. 비용은 진료 과목과 진행 범위에 따라 달라져 현황 진단 후 안내드립니다. 상담과 진단은 0원입니다."
          facts={[
            { label: "지역 치과 키워드", value: "5위 → 1위" },
            { label: "지역 피부과 키워드", value: "10위 → 2위" },
            { label: "계측 기간", value: "32일" },
            { label: "순위 계측", value: "매일 스냅샷" },
            { label: "상담·진단", value: "0원" },
          ]}
        />


        {/* 체크리스트 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-2">
              이 중 하나라도 해당되면 신환 유입에 문제가 있습니다
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">방치할수록 주변 경쟁 의원에 환자를 뺏깁니다</p>
            <div className="space-y-3">
              {CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-gray-800 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 순위 계측 기록 — 숫자는 app/lib/rank-records.ts 한 곳에서만 온다 */}
        <RankRecords industries={["치과", "피부과"]} industryLabel="의원·한의원·피부과" />

        {/* 서비스 구성 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-8">의원 전용 마케팅 패키지</h2>
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

        {/* 의료광고 심의 판정 자료 — 자료 본문은 /services/clinic/medical-ad-guide 가 정본이다 */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <Link
              href="/services/clinic/medical-ad-guide"
              className="group block bg-gray-50 hover:bg-white border border-gray-200 hover:border-blue-200 rounded-2xl p-5 md:p-7 shadow-sm transition-colors"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-9 h-9 rounded-xl shadow-sm flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--w-primary)" }}
                >
                  <ScrollText size={16} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-base md:text-lg font-black text-gray-900 mb-1.5 flex items-center gap-1.5">
                    의료광고 심의 대상 판정 자료
                    <ArrowRight
                      size={15}
                      className="text-gray-400 group-hover:text-blue-600 transition-colors"
                    />
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    어느 채널이 사전심의 대상인지, 심의 없이 쓸 수 있는 항목이 무엇인지를 의료법 제57조와
                    시행령 제24조 순서대로 정리했습니다. 채널 16곳 판정과 금지 15가지, 전후 사진 요건,
                    심의 유효기간까지 조문 번호와 함께 적었습니다.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 자주 묻는 질문 - 화면 노출 + FAQPage 구조화 데이터 */}
        <JsonLd data={faqLd(SERVICE_FAQ, `${SITE.base}/services/clinic`)} />
        <FaqAccordion
          items={SERVICE_FAQ}
          title="병원 · 의원에서 가장 많이 받는 질문"
          subtitle="의료법과 심의 기준이 걸리는 질문을 조문과 함께 정리했습니다. 상담 전에 미리 확인해보세요."
          showMoreHref="/faq"
        />

        {/* CTA */}
        <section className="py-14 md:py-20 bg-blue-600">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
              <TrendingUp size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              우리 의원에 맞는 전략이 궁금하신가요?
            </h2>
            <p className="text-blue-100 text-sm mb-7">
              진료과목 · 지역 · 경쟁 현황을 분석해서<br />
              맞춤 전략을 무료로 제안해드립니다.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              의원 마케팅 무료 상담 <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
