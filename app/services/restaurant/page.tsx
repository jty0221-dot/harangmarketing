import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import CaseShots from "../../components/sian/CaseShots";
import { Plain, SearchSketch,
  SianMain, PageHead, AnswerRow, Section, LineList, ItemList, Steps,
  RankSection, QuestionList, CostLine, CloseBand,
} from "../../components/sian/Sian";
import { PLAIN_TERMS } from "../../lib/plain-terms";
import { INDUSTRY_EXTRA } from "../../lib/industry-extra";
import { SITE, faqLd, webPageLd, type FaqItem, PAGE_UPDATED, ogImage } from "../../lib/seo";
import { byIndustry, byKeyword, fmtSentence, gap } from "../../lib/rank-records";
import { fmtMove } from "../../lib/place-rank-cases";

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
/* 기록이 없으면 FOOD_STORY 가 비어 문장 사이에 빈칸이 두 번 남는다. 끼울 때는 뒤 칸까지 같이 붙인다 */
const FOOD_STORY_SP = FOOD_STORY ? `${FOOD_STORY} ` : "";

const FOOD_FACTS = [
  ...(FOOD_1 ? [{ label: FOOD_1.keyword, value: fmtMove(FOOD_1) }, { label: "계측 기간", value: `${FOOD_1.days}일` }] : []),
  { label: "순위 계측", value: "순위 스냅샷" },
  { label: "상담 · 진단", value: "0원" },
];

/*
 * WebPage 구조화 데이터 - 이 페이지가 무엇인지 · 언제 바뀌었는지 · 어느 문장을 소리 내 읽어도 되는지(speakable) 를
 * AI 검색과 답변 엔진에 알린다 (2026-09-20 · 요청 68 · D-0290). 문장은 layout metadata 와 FOOD_STORY(순위 정본이
 * 찍은 문장) 를 그대로 재사용해 손으로 적은 숫자가 없다.
 */
const FOOD_PAGE_LD = webPageLd({
  path: "/services/restaurant",
  name: "음식점·식당 마케팅 대행 | 네이버 플레이스 정보 정비·순위 계측",
  description: `음식점·식당 전문 마케팅. 플레이스 리뷰 전략, 맘카페 바이럴, 블로그 맛집 등록. ${FOOD_STORY_SP}방문객·매출·예약 건수는 계측 대상이 아니어서 수치로 제시하지 않습니다.`,
  dateModified: PAGE_UPDATED["/services/restaurant"],
});

export const metadata: Metadata = {
  title: "음식점마케팅 · 식당 마케팅 대행사 | 네이버 플레이스 정보 정비",
  description: "음식점·한식당·중식당·일식당·분식집 맞춤 마케팅입니다. 네이버 플레이스 SEO, 블로그 체험단, 맘카페 바이럴을 하며 상권 진단은 0원입니다.",
  keywords: ["음식점 마케팅", "식당 마케팅 대행사", "맛집 마케팅", "음식점 플레이스 SEO", "식당 블로그 마케팅"],
  openGraph: {
    title: "손님이 검색할 때 보이게, 음식점 마케팅 · 하랑마케팅",
    description: "네이버 플레이스와 블로그로 음식점 검색 노출을 만듭니다.",
    url: "https://www.harangmarketing.com/services/restaurant",
    images: [ogImage("음식점 마케팅 하랑마케팅")],
  },
};

const CHECKLIST = [
  "리뷰가 몇 개 없어서 손님이 그냥 지나간다",
  "네이버 플레이스에 내 가게가 안 보인다",
  "블로그 체험단을 어디서 구해야 할지 모른다",
  "점심·저녁 피크 외 시간대 매출이 너무 없다",
  "단골이 생기지 않고 신규 고객이 재방문을 안 한다",
  "주변 경쟁 식당보다 검색 순위가 항상 낮다",
];


/* 화면에 보이는 문답을 그대로 FAQPage 로 내보낸다.
   (구조화 데이터와 본문이 어긋나면 구글이 리치 결과를 제거한다)
   숫자는 app/lib/rank-records.ts 계측값만 쓴다 - 손으로 적지 않는다. */
const SERVICE_FAQ: FaqItem[] = [
  {
    q: "네이버 검색광고와 플레이스·블로그 중 어디에 돈을 써야 하나요?",
    a:
      "성격이 다릅니다. 검색광고는 켜는 동안만 노출되는 비용이고, 네이버 플레이스와 블로그는 쌓아 두면 광고를 끄고도 남는 자산입니다. 당장 이번 달이 급한 곳은 두 가지를 같이 쓰고, 길게 보는 곳은 플레이스부터 세웁니다. 어느 쪽이든 지금 손님이 어디서 오는지 먼저 보고 정합니다.",
  },
  {
    q: "음식점 플레이스 순위는 얼마나 올라가나요?",
    a: FOOD_DURATIONS
      ? `저장해 둔 스냅샷 기준으로 ${FOOD_DURATIONS} 걸린 기록이 있습니다. 같은 기간에 순위가 내려간 곳도 있고 첫 페이지에 못 올라간 키워드도 있습니다. 그래서 몇 위까지 올려드린다는 약속은 하지 않습니다. 시작 전에 현재 순위를 재서 그 숫자부터 보여드립니다.`
      : "오르는 속도는 매장과 키워드마다 달라 한 숫자로 말씀드리기 어렵습니다. 순위가 내려가는 곳도 있고 첫 페이지에 못 올라가는 키워드도 있습니다. 그래서 몇 위까지 올려드린다는 약속은 하지 않습니다. 시작 전에 현재 순위를 재서 그 숫자부터 보여드립니다.",
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



const SOLUTIONS = [
  { title: "네이버 플레이스 SEO", desc: "지역 키워드 '맛집', '역세권 맛집' 등 롱테일 키워드 공략. 리뷰 수·답글률·사진 수를 알고리즘 기준에 맞춰 최적화합니다." },
  { title: "블로그 체험단 운영", desc: "파워블로거, 인플루언서 체험단 섭외·운영. 1회성이 아니라 콘텐츠를 꾸준히 쌓아 검색에 걸릴 글을 늘립니다." },
  { title: "지역 맘카페 바이럴", desc: "동네 맘카페와 지역 커뮤니티에 매장 소식을 배포합니다. 게시 URL 과 매체사 전달 내역을 그대로 드립니다." },
];

/* place-rank-cases.ts 의 업종 표기 그대로 · 음식점 계열만 */
const FOOD_INDUSTRIES = ["횟집", "고깃집", "샤브샤브집", "한식당", "돈가스집", "일식당", "요리주점", "소고기집"];

const FOOD_QUESTIONS = [...SERVICE_FAQ, ...INDUSTRY_EXTRA.restaurant.faqs];

export default function RestaurantPage() {
  return (
    <>
      <Header />
      <SianMain>
        <PageHead
          where="업종별 · 음식점 · 식당"
          title={<>음식점 마케팅,<br />네이버부터 제대로 합니다</>}
          lead="네이버 플레이스 SEO부터 블로그 체험단, 지역 맘카페 바이럴까지, 손님이 가게를 고르는 자리에 집중하는 마케팅만 합니다."
          primary={{ href: "/free-check", label: "내 가게 무료 진단" }}
          link={{ href: "/services#pricing", label: "항목별 비용 보기" }}
          facts={FOOD_FACTS}
        />

        {/* 처음 보는 대표님용 쉬운 풀이 · 뜻풀이는 app/lib/plain-terms.ts */}
        <Plain
          what="손님이 동네 맛집을 검색했을 때 우리 가게가 보이도록 네이버 플레이스 정보와 사진, 방문 후기, 지역 커뮤니티 글을 채우는 일입니다."
          who="단골은 있는데 새 손님이 검색으로 들어오지 않는 음식점 대표님께 필요합니다."
          terms={[PLAIN_TERMS.place, PLAIN_TERMS.placeSeo, PLAIN_TERMS.review, PLAIN_TERMS.momcafe]}
        >
          <SearchSketch focus={["place", "post"]} />
        </Plain>

        {/* AEO · 업종별 한 줄 정답 (AI 답변 엔진 인용 대상 · speakable) */}
        <AnswerRow
          question="음식점·식당 마케팅은 무엇부터 해야 하나요?"
          answer={`음식점·식당 마케팅은 네이버 플레이스 맛집 키워드 노출, 플레이스 리뷰 관리, 지역 맘카페 바이럴 순으로 접근하는 것이 효과적입니다. 검색해서 찾아오는 손님은 순위와 리뷰를 먼저 보기 때문입니다. ${FOOD_STORY_SP}네이버 플레이스 순위는 스냅샷으로 저장해 월 리포트로 공유합니다. 방문객·매출·예약 건수는 계측 대상이 아니어서 수치로 제시하지 않습니다. 음식점 마케팅 비용은 진행 범위에 따라 달라져 현황 진단 후 안내드리며, 상담과 진단은 0원입니다.`}
        />

        <Section soft title="이런 문제 겪고 계신가요?" desc="음식점 대표님들이 가장 많이 말씀하시는 고민들입니다.">
          <LineList items={CHECKLIST} />
        </Section>

        {/* 음식점 업종에서 잰 줄 · 숫자는 app/lib/place-rank-cases.ts 한 곳에서만 온다.
            예전 「음식점·식당 순위 계측 기록 (09-23 스냅샷)」 절과 머리의 순위 칸 셋은 머리 사실 줄과 이 표로 합쳤다 */}
        <RankSection industries={FOOD_INDUSTRIES} label="음식점" />

        <CaseShots slug="food" label="음식점" />

        <Section soft title="이렇게 해결합니다" desc="음식점 채널별 맞춤 전략.">
          <ItemList items={SOLUTIONS} one />
        </Section>

        <Section title={`${INDUSTRY_EXTRA.restaurant.label} 진행 순서`} desc="하랑 대표가 상담부터 계측까지 직접 맡습니다.">
          <Steps steps={INDUSTRY_EXTRA.restaurant.steps} />
        </Section>

        {/* 질문 · 상담 질문과 「진행 전에 확인하실 것」을 한 목록으로 합쳤다. FAQPage 와 같은 항목 */}
        <JsonLd data={FOOD_PAGE_LD} />
        <JsonLd data={faqLd(FOOD_QUESTIONS, `${SITE.base}/services/restaurant`)} />
        <Section
          soft
          id="faq"
          title="음식점 대표님들이 가장 많이 묻는 질문"
          desc="상담에서 실제로 나온 질문을 그대로 옮겼습니다. 순위 숫자는 저장해 둔 스냅샷 실측값입니다."
          more={{ href: "/faq", label: "전체 질문 보기" }}
          footer={<CostLine text={INDUSTRY_EXTRA.restaurant.price} />}
        >
          <QuestionList items={FOOD_QUESTIONS} />
        </Section>

        <CloseBand
          title="음식점 무료 진단 받기"
          text="현재 검색 순위 확인부터 경쟁 식당 비교까지 0원."
          primary={{ href: "/contact?industry=음식점", label: "무료 상담 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
