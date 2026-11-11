import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import {
  SianMain, PageHead, AnswerRow, Section, LineList, ItemList, Steps,
  RankSection, QuestionList, CostLine, CloseBand,
} from "../../components/sian/Sian";
import { INDUSTRY_EXTRA } from "../../lib/industry-extra";
import { SITE, faqLd, webPageLd, updatedAt, type FaqItem, ogImage } from "../../lib/seo";

const PAGE_TITLE = "학원·교육 마케팅 대행사 | 학원 플레이스 · 블로그 전문";
const PAGE_DESCRIPTION = "학원·공부방·과외·교습소 맞춤 마케팅. 네이버 플레이스 SEO, 블로그, 카카오채널 운영 전문. 학부모가 학원을 찾는 검색 자리부터 채웁니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: ["학원 마케팅", "교육 마케팅 대행사", "학원 수강생 늘리기", "학원 플레이스 SEO", "공부방 마케팅"],
  openGraph: {
    title: "학부모가 검색하는 자리를 채우는 학원 마케팅 · 하랑마케팅",
    description: "학부모가 검색하는 자리를 채우는 학원 마케팅 전략. 하랑 대표가 직접 상담합니다.",
    url: "https://www.harangmarketing.com/services/academy",
    images: [ogImage("학원 마케팅 하랑마케팅")],
  },
};


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
      "플레이스 최적화 자체는 업종을 가리지 않습니다. 다만 저희가 저장해 둔 스냅샷 가운데 학원 업종의 순위 기록은 아직 공개할 것이 없어서, 다른 업종의 숫자를 학원 성과처럼 말씀드리지 않습니다. 지금 학원에서 확인할 수 있는 것은 현재 순위와 경쟁 업체 수까지이고, 계측이 쌓이면 그 숫자로 다시 보고드립니다. 순위를 미리 약속드리지 않는 이유도 같습니다.",
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



/* 머리 사실 줄 · 예전 정답 상자 아래 숫자 줄을 그대로 옮겼다 */
const ACADEMY_FACTS = [
  { label: "주력 채널", value: "맘카페 바이럴" },
  { label: "보조 채널", value: "홈페이지형 블로그" },
  { label: "순위 계측", value: "스냅샷 저장" },
  { label: "상담 · 진단", value: "0원" },
];

const CHECKLIST = [
  "네이버 플레이스 순위가 5위 밖인가요?",
  "신규 수강 문의 전화가 월 10건 미만인가요?",
  "주변에 같은 과목 학원이 3곳 이상인가요?",
  "블로그·SNS 포스팅이 월 4개 미만인가요?",
  "학부모가 온라인에서 내 학원을 찾기 어렵나요?",
];

const STRATEGY = [
  { title: "학부모 검색 키워드 공략", desc: "'지역명+학원', '지역명+과외' 등 학부모가 실제로 검색하는 키워드를 네이버 플레이스와 블로그에 집중 배치합니다." },
  { title: "맘카페·지역 커뮤니티 입소문", desc: "지역 맘카페와 학부모 커뮤니티에서 자연스럽게 회자되도록 합니다. 강요하지 않고 자연스럽게." },
  { title: "성과 리뷰·수강 후기 관리", desc: "수강생 학부모 후기를 꾸준히 쌓고 답글까지 관리합니다. 새 학부모가 상담 전에 먼저 읽는 글입니다." },
];

/* place-rank-cases.ts 의 업종 표기 그대로 */
const ACADEMY_INDUSTRIES = ["영어학원"];

const ACADEMY_QUESTIONS = [...SERVICE_FAQ, ...INDUSTRY_EXTRA.academy.faqs];

export default function AcademyPage() {
  return (
    <>
      <Header />
      <SianMain>
        <PageHead
          where="업종별 · 학원 · 교육"
          title={<>학원 수강생,<br />학부모 검색에서 시작합니다</>}
          lead="학원·공부방·교습소·과외 등 교육 업종에 특화된 마케팅. 학부모가 검색하는 키워드와 플랫폼에 집중합니다."
          primary={{ href: "/free-check", label: "내 학원 무료 진단" }}
          link={{ href: "/services#pricing", label: "항목별 비용 보기" }}
          facts={ACADEMY_FACTS}
        />

        {/* AEO · 업종별 한 줄 정답 (AI 답변 엔진 인용 대상 · speakable) */}
        <AnswerRow
          question="학원 마케팅은 어떻게 수강생을 늘리나요?"
          answer="학원·교육 마케팅은 지역 맘카페 바이럴과 홈페이지형 블로그가 핵심입니다. 학부모가 학원을 고를 때 광고보다 동네 엄마들의 실제 후기를 먼저 찾아보기 때문입니다. 네이버 플레이스 순위는 스냅샷으로 저장해 월 리포트로 공유합니다. 방문객·매출·예약 건수는 계측 대상이 아니어서 수치로 제시하지 않습니다. 학원 마케팅 비용은 과목과 진행 범위에 따라 달라져 현황 진단 후 안내드리며, 상담과 진단은 0원입니다."
        />

        <Section soft title="이 중 하나라도 해당되면 지금 바로 시작하세요" desc="학부모가 검색하는 자리에서 지금 어디쯤인지 무료로 확인해 드립니다.">
          <LineList items={CHECKLIST} />
        </Section>

        {/* 학원 업종에서 잰 줄만 싣는다. 지금은 1~5위 줄이 없어 절이 빠진다 · 남의 업종 줄은 빌려오지 않는다 */}
        <RankSection industries={ACADEMY_INDUSTRIES} label="학원" />

        <Section title="학원 마케팅 핵심 전략" desc="학부모가 학원을 찾는 방식에 맞게 설계합니다.">
          <ItemList items={STRATEGY} one />
        </Section>

        <Section soft title={`${INDUSTRY_EXTRA.academy.label} 진행 순서`} desc="하랑 대표가 상담부터 계측까지 직접 맡습니다.">
          <Steps steps={INDUSTRY_EXTRA.academy.steps} />
        </Section>

        {/* 질문 · 상담 질문과 「진행 전에 확인하실 것」을 한 목록으로 합쳤다. FAQPage 와 같은 항목 */}
        <JsonLd data={webPageLd({ path: "/services/academy", name: `${PAGE_TITLE} | 하랑마케팅`, description: PAGE_DESCRIPTION, dateModified: updatedAt("/services/academy") })} />
        <JsonLd data={faqLd(ACADEMY_QUESTIONS, `${SITE.base}/services/academy`)} />
        <Section
          id="faq"
          title="학원 마케팅에서 가장 많이 받는 질문"
          desc="상담에서 실제로 나온 질문을 그대로 옮겼습니다. 상담 전에 미리 확인해보세요."
          more={{ href: "/faq", label: "전체 질문 보기" }}
          footer={<CostLine text={INDUSTRY_EXTRA.academy.price} />}
        >
          <QuestionList items={ACADEMY_QUESTIONS} />
        </Section>

        <CloseBand
          title="학원 무료 진단 받기"
          text="경쟁 학원 분석·현재 순위·개선 방향까지 0원."
          primary={{ href: "/contact?industry=학원", label: "무료 상담 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
