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
import { ArrowRight, BookOpen, TrendingUp, Users, Star, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "학원·교육 마케팅 대행사 | 수강생 증대 전문",
  description: "학원·공부방·과외·교습소 맞춤 마케팅. 네이버 플레이스 SEO, 블로그, 카카오채널 운영 전문. 수강생 증대 실제 성과. 무료 상담.",
  keywords: ["학원 마케팅", "교육 마케팅 대행사", "학원 수강생 늘리기", "학원 플레이스 SEO", "공부방 마케팅"],
  openGraph: {
    title: "학원·교육 마케팅 대행사 | 하랑마케팅",
    description: "수강생을 늘리는 학원 마케팅 전략. 실제 성과 보유.",
    url: "https://www.harangmarketing.com/services/academy",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "학원 마케팅 하랑마케팅" }],
  },
};

/* 학원·교육 업종은 공개할 순위 기록이 없다.
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
    q: "학원 마케팅 비용은 보통 얼마나 드나요?",
    a:
      "학원 마케팅 비용은 무엇을 하느냐에 따라 갈립니다. 블로그와 플레이스처럼 쌓아 두면 남는 작업은 월 단위 관리비가 들고, 검색광고처럼 클릭할 때마다 나가는 비용은 네이버에 직접 결제하는 광고비라 저희에게 오지 않습니다. 두 가지를 섞어 쓰는 것이 보통이고, 시작 금액은 지역과 경쟁 강도에 따라 달라집니다. 상담은 0원이고 상담하는 사람은 하랑 대표입니다.",
  },
  {
    q: "맘카페 마케팅은 효과가 있나요?",
    a:
      "맘카페는 학원을 고르는 자리라기보다 이미 후보에 오른 학원을 검증하는 자리입니다. 그래서 맘카페 하나만 하면 잘 움직이지 않고, 검색에서 먼저 발견된 다음 맘카페에서 확인이 되면 문의로 이어집니다. 저희는 맘카페를 단독 상품으로 팔지 않고 블로그 · 플레이스와 묶어 씁니다. 카페 규칙을 어기는 홍보 글이나 계정 구매는 하지 않습니다.",
  },
  {
    q: "학원도 네이버 플레이스 순위가 올라가나요?",
    a:
      "플레이스 최적화 자체는 업종을 가리지 않습니다. 다만 저희가 매일 저장한 스냅샷 가운데 학원 업종의 순위 기록은 아직 공개할 것이 없어서, 다른 업종의 숫자를 학원 성과처럼 말씀드리지 않습니다. 지금 학원에서 확인할 수 있는 것은 현재 순위와 경쟁 업체 수까지이고, 계측이 쌓이면 그 숫자로 다시 보고드립니다. 순위를 미리 약속드리지 않는 이유도 같습니다.",
  },
  {
    q: "블로그는 원장님이 직접 써야 하나요?",
    a:
      "원장님이 쓰시면 가장 좋지만 현실적으로 매주 쓰기는 어렵습니다. 저희가 초안을 쓰고 원장님은 수업 이야기와 사진만 주시는 방식이 오래갑니다. 발행 전에 원장님 확인을 받고 올리기 때문에 사실과 다른 문장이 나갈 일은 없습니다. 학원명과 강사 경력처럼 확인이 필요한 값은 서류로 받은 것만 씁니다.",
  },
  {
    q: "계약 기간이나 위약금이 있나요?",
    a:
      "기본은 월 단위이고 자동 연장되는 약정을 걸지 않습니다. 중간에 그만두실 때 위약금을 청구하지 않습니다. 다만 블로그와 플레이스는 쌓이면서 효과가 나오는 작업이라 한 달만 보고 판단하기는 어렵습니다. 계약서에 적힌 범위 밖의 일이 생기면 먼저 말씀드리고 진행합니다.",
  },
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
                  <div className="text-[11px] text-gray-400 leading-tight">{r.sub}</div>
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
          answer="학원·교육 마케팅은 지역 맘카페 바이럴과 홈페이지형 블로그가 핵심입니다. 학부모가 학원을 고를 때 광고보다 동네 엄마들의 실제 후기를 먼저 찾아보기 때문입니다. 네이버 플레이스 순위는 매일 스냅샷으로 저장해 월 리포트로 공유합니다. 방문객·매출·예약 건수는 계측 대상이 아니어서 수치로 제시하지 않습니다. 학원 마케팅 비용은 과목과 진행 범위에 따라 달라져 현황 진단 후 안내드리며, 상담과 진단은 0원입니다."
          facts={[
            { label: "주력 채널", value: "맘카페 바이럴" },
            { label: "보조 채널", value: "홈페이지형 블로그" },
            { label: "순위 계측", value: "매일 스냅샷" },
            { label: "상담·진단", value: "0원" },
          ]}
        />


        {/* 순위 계측 — 이 업종은 공개할 기록이 없다. 남의 업종 숫자를 빌려오지 않는다 */}
        <RankRecords industries={[]} industryLabel="학원·교육" />

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
                { icon: Star, color: "from-blue-600 to-orange-500", title: "성과 리뷰·수강 후기 관리", desc: "수강생 학부모 후기를 전략적으로 쌓습니다. 긍정적 후기가 신뢰를 만들고 신규 문의로 이어집니다." },
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
        <JsonLd data={faqLd(SERVICE_FAQ, `${SITE.base}/services/academy`)} />
        <FaqAccordion
          items={SERVICE_FAQ}
          title="학원 마케팅에서 가장 많이 받는 질문"
          subtitle="상담에서 실제로 나온 질문을 그대로 옮겼습니다. 상담 전에 미리 확인해보세요."
          showMoreHref="/faq"
        />

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
