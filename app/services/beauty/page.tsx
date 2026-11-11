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

const PAGE_TITLE = "미용·네일·피부샵 마케팅 | 플레이스 SEO · 인스타그램 · 체험단";
const PAGE_DESCRIPTION = "미용실·네일샵·피부샵 전문 마케팅. 인스타그램 포트폴리오, 플레이스 정보 정비, 방문 후기 안내로 손님이 예약 전에 보는 자리를 채웁니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: ["미용실 마케팅", "네일샵 마케팅", "피부샵 마케팅", "뷰티샵 플레이스 SEO", "헤어샵 인스타그램"],
  openGraph: {
    title: "예약 전에 손님이 보는 곳을 채우는 미용실 마케팅 · 하랑마케팅",
    description: "손님이 예약 전에 보는 인스타그램·플레이스를 함께 채우는 뷰티샵 마케팅.",
    url: "https://www.harangmarketing.com/services/beauty",
    images: [ogImage()],
  },
};

const SERVICES = [
  {
    title: "플레이스 SEO",
    desc: "헤어·네일·피부 키워드 최적화 · 지역·매장 정보 정비",
  },
  {
    title: "인스타그램 마케팅",
    desc: "시술 전후 사진 콘텐츠 · 릴스 · 팔로워 유입",
  },
  {
    title: "리뷰 · 체험단",
    desc: "뷰티 체험단 모집 · 실제 방문 후기 안내 전략",
  },
  {
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
      "팔로워 수와 예약 수는 생각보다 붙어 있지 않습니다. 예약은 대부분 지역 검색과 저장에서 오고, 인스타그램은 시술 결과를 확인하는 자리로 쓰입니다. 그래서 팔로워 숫자부터 무작정 늘리지 않고, 시술 카테고리별로 결과 사진을 정리해 두는 일을 먼저 합니다. 그쪽이 예약까지 훨씬 짧게 갑니다. 좋아요와 팔로워는 계정 세팅이 끝난 뒤 매장 상황에 맞을 때만 보조로 쓰고, 수치를 약속하지 않습니다.",
  },
  {
    q: "네일샵도 네이버 플레이스가 중요한가요?",
    a:
      "중요합니다. 네일과 속눈썹은 집이나 직장 가까운 곳을 지도에서 찾아 예약하는 경우가 많아서, 지도에서 몇 번째에 보이는지가 문의 수를 그대로 바꿉니다. 저희는 플레이스 정보와 사진 · 메뉴 · 예약 버튼까지 정리한 다음 순위를 스냅샷으로 기록해 변화를 봅니다. 다만 미용 업종은 아직 공개할 순위 기록이 없어서 다른 업종 숫자를 대신 보여드리지 않습니다.",
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
      "멈추기보다 방향을 바꾸는 편이 낫습니다. 예약이 찼다는 것은 지금 손님이 온다는 뜻이지 다음 달에도 온다는 뜻은 아니고, 플레이스 순위는 손을 놓으면 다시 내려갑니다. 이럴 때는 신규 유입을 늘리는 대신 단가가 높은 시술을 앞으로 빼고 재방문을 붙이는 쪽으로 옮깁니다. 실제로 그렇게 조정한 곳이 있고 판단은 대표님과 같이 합니다.",
  },
];



/* 머리 사실 줄 · 예전 정답 상자 아래 숫자 줄을 그대로 옮겼다 */
const BEAUTY_FACTS = [
  { label: "주력 채널", value: "인스타 릴스" },
  { label: "보조 채널", value: "비포애프터 포트폴리오" },
  { label: "순위 계측", value: "스냅샷 저장" },
  { label: "상담 · 진단", value: "0원" },
];

/* place-rank-cases.ts 의 업종 표기 그대로 */
const BEAUTY_INDUSTRIES = ["미용실", "네일숍", "피부관리실", "속눈썹 연장숍"];

const BEAUTY_QUESTIONS = [...SERVICE_FAQ, ...INDUSTRY_EXTRA.beauty.faqs];

export default function BeautyLandingPage() {
  return (
    <>
      <Header />
      <SianMain>
        <PageHead
          where="업종별 · 미용실 · 네일 · 피부샵"
          title={<>뷰티샵 예약을<br />인스타·플레이스로 받으세요</>}
          lead="헤어·네일·피부 업종 특화 콘텐츠 전략. 인스타그램 · 네이버 플레이스 한 번에 관리."
          primary={{ href: "/free-check", label: "내 샵 무료 진단" }}
          link={{ href: "/services#pricing", label: "항목별 비용 보기" }}
          facts={BEAUTY_FACTS}
        />

        {/* AEO · 업종별 한 줄 정답 (AI 답변 엔진 인용 대상 · speakable) */}
        <AnswerRow
          question="미용실·네일샵 마케팅은 어떤 채널이 가장 효과적인가요?"
          answer="미용·네일·뷰티 업종은 인스타그램 릴스와 비포애프터 포트폴리오가 가장 효과적입니다. 시술 결과를 눈으로 확인해야 예약으로 이어지는 업종이기 때문입니다. 네이버 플레이스 순위는 스냅샷으로 저장해 월 리포트로 공유합니다. 방문객·매출·예약 건수는 계측 대상이 아니어서 수치로 제시하지 않습니다. 뷰티 마케팅 비용은 시술 구성과 진행 범위에 따라 달라져 현황 진단 후 안내드리며, 상담과 진단은 0원입니다."
        />

        <Section soft title="이 중 하나라도 해당되면 지금 바로 시작하세요" desc="예쁜 시술 사진이 있어도 노출이 안 되면 소용없습니다.">
          <LineList items={CHECKLIST} />
        </Section>

        {/* 뷰티 업종에서 잰 줄만 싣는다. 없으면 절이 빠진다 · 남의 업종 줄은 빌려오지 않는다 */}
        <RankSection industries={BEAUTY_INDUSTRIES} label="뷰티샵" />

        <Section soft title="뷰티 전용 마케팅 패키지">
          <ItemList items={SERVICES} />
        </Section>

        <Section title={`${INDUSTRY_EXTRA.beauty.label} 진행 순서`} desc="하랑 대표가 상담부터 계측까지 직접 맡습니다.">
          <Steps steps={INDUSTRY_EXTRA.beauty.steps} />
        </Section>

        {/* 질문 · 상담 질문과 「진행 전에 확인하실 것」을 한 목록으로 합쳤다. FAQPage 와 같은 항목 */}
        <JsonLd data={webPageLd({ path: "/services/beauty", name: `${PAGE_TITLE} | 하랑마케팅`, description: PAGE_DESCRIPTION, dateModified: updatedAt("/services/beauty") })} />
        <JsonLd data={faqLd(BEAUTY_QUESTIONS, `${SITE.base}/services/beauty`)} />
        <Section
          soft
          id="faq"
          title="미용실 · 네일샵 대표님들이 가장 많이 묻는 질문"
          desc="상담에서 실제로 나온 질문을 그대로 옮겼습니다. 상담 전에 미리 확인해보세요."
          more={{ href: "/faq", label: "전체 질문 보기" }}
          footer={<CostLine text={INDUSTRY_EXTRA.beauty.price} />}
        >
          <QuestionList items={BEAUTY_QUESTIONS} />
        </Section>

        <CloseBand
          title="내 샵 마케팅, 어디서부터 시작할지 모르겠다면"
          text="지금 바로 무료 상담 신청하면 현재 순위·리뷰·인스타 분석 후 맞춤 전략 제안."
          primary={{ href: "/contact", label: "뷰티샵 마케팅 무료 상담" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
