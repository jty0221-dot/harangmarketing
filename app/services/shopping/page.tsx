import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import {
  SianMain, PageHead, AnswerRow, Section, LineList, ItemList, Steps,
  QuestionList, CostLine, CloseBand,
} from "../../components/sian/Sian";
import { INDUSTRY_EXTRA } from "../../lib/industry-extra";
import { SITE, faqLd, webPageLd, updatedAt, type FaqItem, ogImage } from "../../lib/seo";

const PAGE_TITLE = "쇼핑몰·소매점 마케팅 대행사 | 스마트스토어 · 인스타 · 플레이스";
const PAGE_DESCRIPTION = "쇼핑몰·소매점 마케팅. 네이버 스마트스토어, 인스타그램 쇼핑, 플레이스 SEO로 온라인 스토어와 오프라인 매장을 한 흐름으로 묶어 설계합니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: ["쇼핑몰 마케팅", "소매점 마케팅", "의류 마케팅 대행사", "스마트스토어 마케팅", "인스타 쇼핑 마케팅"],
  openGraph: {
    title: "스마트스토어와 매장을 한 흐름으로, 쇼핑몰 마케팅 · 하랑마케팅",
    description: "스마트스토어부터 매장 집객까지 온·오프라인을 함께 챙기는 쇼핑몰 마케팅.",
    url: "https://www.harangmarketing.com/services/shopping",
    images: [ogImage("쇼핑몰 마케팅 하랑마케팅")],
  },
};


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
      "원재료와 용량 · 소비기한 · 보관방법 · 제조원 · 알레르기 유발 물질은 빠뜨릴 수 없는 법정 항목입니다. 이 값은 저희가 추측해서 채우지 않고 대표님께 확인받은 것만 넣습니다. 틀린 값은 빈 값보다 위험해서, 모르면 비워두고 여쭤봅니다. 효능이나 질병 예방을 말하는 표현도 쓰지 않습니다.",
  },
  {
    q: "스마트스토어와 자사몰 중 어디에 힘을 써야 하나요?",
    a:
      "파는 물건이 이미 검색되는 물건이면 스마트스토어가 빠릅니다. 검색량이 있는 카테고리에서는 유입을 네이버가 만들어 주기 때문입니다. 반대로 브랜드로 파는 물건이거나 재구매가 중요한 물건이면 자사몰에 쌓는 편이 오래갑니다. 둘 다 여신다면 스마트스토어로 먼저 팔리는 것을 확인하고 자사몰을 붙이는 순서를 권합니다.",
  },
];



/* 머리 사실 줄 · 예전 정답 상자 아래 숫자 줄을 그대로 옮겼다 */
const SHOPPING_FACTS = [
  { label: "주력 채널", value: "상품 키워드 블로그 SEO" },
  { label: "보조 채널", value: "체험단 후기" },
  { label: "순위 계측", value: "스냅샷 저장" },
  { label: "상담 · 진단", value: "0원" },
];

const CHECKLIST = [
  "스마트스토어 일 방문자가 30명 미만인가요?",
  "인스타그램 팔로워가 500명 미만인가요?",
  "제품 사진은 있는데 구매 전환이 안 되나요?",
  "오프라인 매장인데 온라인에서 아예 안 보이나요?",
  "SNS 운영이 불규칙하거나 월 4개 미만인가요?",
];

const STRATEGY = [
  { title: "스마트스토어 최적화", desc: "상품 태그, 상세페이지 카피, 리뷰 관리, 스토어 SEO. 검색 유입부터 결제 버튼까지 가는 흐름을 손봅니다." },
  { title: "인스타그램 쇼핑 운영", desc: "제품 사진 기획, 릴스 콘텐츠, 쇼핑 태그 설정, 팔로워가 상품 페이지로 넘어가는 동선 세팅. 브랜드 이미지와 구매 동선을 함께 쌓습니다." },
  { title: "오프라인 집객 마케팅", desc: "네이버 플레이스·카카오맵 최적화로 근처 검색에 매장이 보이도록 세팅합니다. 오프라인 손님이 온라인 스토어도 찾을 수 있게 연결합니다." },
];

const SHOPPING_QUESTIONS = [...SERVICE_FAQ, ...INDUSTRY_EXTRA.shopping.faqs];

export default function ShoppingPage() {
  return (
    <>
      <Header />
      <SianMain>
        <PageHead
          where="업종별 · 쇼핑몰 · 소매점"
          title={<>쇼핑몰 매출,<br />온·오프라인 동시에</>}
          lead="스마트스토어·인스타그램 쇼핑부터 오프라인 매장 집객까지, 쇼핑몰과 소매점의 두 채널을 한 흐름으로 묶습니다."
          primary={{ href: "/free-check", label: "내 매장 무료 진단" }}
          link={{ href: "/services#pricing", label: "항목별 비용 보기" }}
          facts={SHOPPING_FACTS}
        />

        {/* AEO · 업종별 한 줄 정답 (AI 답변 엔진 인용 대상 · speakable) */}
        <AnswerRow
          question="온라인 쇼핑몰 마케팅은 무엇부터 시작해야 하나요?"
          answer="온라인 쇼핑몰은 오프라인 매장과 달리 지역 키워드가 없으므로 상품 키워드 블로그 SEO와 체험단 후기 확보가 출발점입니다. 검색으로 유입된 고객이 후기를 보고 구매를 결정하기 때문입니다. 네이버 플레이스 순위는 스냅샷으로 저장해 월 리포트로 공유합니다. 방문객·매출·예약 건수는 계측 대상이 아니어서 수치로 제시하지 않습니다. 쇼핑몰 마케팅은 전국 어디서나 비대면으로 진행되며, 비용은 상품군과 진행 범위에 따라 달라져 현황 진단 후 안내드립니다. 상담과 진단은 0원입니다."
        />

        <Section soft title="이 중 하나라도 해당되면 지금 바로 시작하세요" desc="유입이 없으면 좋은 상품도 팔리지 않습니다.">
          <LineList items={CHECKLIST} />
        </Section>

        {/* 순위 절 없음 · 온라인 쇼핑몰은 플레이스 순위 기록이 없다. 남의 업종 줄은 빌려오지 않는다 */}

        <Section title="쇼핑몰 마케팅 핵심 전략" desc="온라인과 오프라인을 연결하는 통합 마케팅.">
          <ItemList items={STRATEGY} one />
        </Section>

        <Section soft title={`${INDUSTRY_EXTRA.shopping.label} 진행 순서`} desc="하랑 대표가 상담부터 계측까지 직접 맡습니다.">
          <Steps steps={INDUSTRY_EXTRA.shopping.steps} />
        </Section>

        {/* 질문 · 상담 질문과 「진행 전에 확인하실 것」을 한 목록으로 합쳤다. FAQPage 와 같은 항목 */}
        <JsonLd data={webPageLd({ path: "/services/shopping", name: `${PAGE_TITLE} | 하랑마케팅`, description: PAGE_DESCRIPTION, dateModified: updatedAt("/services/shopping") })} />
        <JsonLd data={faqLd(SHOPPING_QUESTIONS, `${SITE.base}/services/shopping`)} />
        <Section
          id="faq"
          title="쇼핑몰 운영에서 가장 많이 받는 질문"
          desc="상담에서 실제로 나온 질문을 그대로 옮겼습니다. 상담 전에 미리 확인해보세요."
          more={{ href: "/faq", label: "전체 질문 보기" }}
          footer={<CostLine text={INDUSTRY_EXTRA.shopping.price} />}
        >
          <QuestionList items={SHOPPING_QUESTIONS} />
        </Section>

        <CloseBand
          title="쇼핑몰 무료 진단 받기"
          text="온·오프라인 채널 분석부터 판매 동선 전략까지 0원."
          primary={{ href: "/contact?industry=쇼핑몰", label: "무료 상담 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
