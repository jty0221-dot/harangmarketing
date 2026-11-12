import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import PersuasionSians from "../../components/PersuasionSians";
import { Plain, SearchSketch,
  SianMain, PageHead, AnswerRow, Section, ItemList, LinkList, Steps, Table,
  QuestionList, CostLine, CloseBand,
} from "../../components/sian/Sian";
import { PLAIN_TERMS } from "../../lib/plain-terms";
import { SITE, ORG_ID, LOCAL_ID, faqLd, breadcrumbLd, webPageLd, updatedAt, howToLd, type FaqItem } from "../../lib/seo";
import { getDetailPageCases, INDUSTRY_LABEL } from "../../lib/detail-page-cases";
import { REF_TOTAL, REF_CATEGORIES } from "../../lib/detail-page-reference";
import d from "./detail.module.css";

/**
 * 스마트스토어 상세페이지 제작 — 서비스 상세 페이지
 *
 * 처음에는 납품 사례가 적어서 공정 공개형으로만 세웠는데(D-0077), 레퍼런스 38건을
 * 전량 수집해 두고도 이 페이지에서는 맨 아래 글자 링크 한 줄로만 걸어 놨었다.
 * 상세페이지를 맡길지 고민하는 사람이 제일 먼저 찾는 건 공정이 아니라 '만든 게 어떻게
 * 생겼나' 다 — 그걸 찾다가 못 찾으면 그냥 나간다 (2026-08-28 (금) 대표 지시).
 * 그래서 히어로 바로 밑에 실물 썸네일 밴드를 세웠다.
 *
 * 다섯 층이다. 0층 레퍼런스 · 1층 공정(9단) · 2층 게이트 · 3층 원칙 · 4층 사례.
 * 0층과 4층은 다른 것을 답한다 — 0층은 '무엇을 만들었나'(상호 없이 실물),
 * 4층은 '누구 것을 만들었나'(상호 공개 동의를 받은 건). 4층이 비어도 페이지는 선다.
 *
 * 단가는 우리 4등급안이다 (기획형 150,000 · 제작형 350,000 · 제작+영상형 550,000 · 앵커 1,500,000).
 * 블로그 홈페이지형 디자인 상품(STANDARD·DELUXE·PREMIUM) 등급표는 다른 상품의 것이라 여기 쓰지 않는다
 * (2026-08-27 (목) 대표 지시로 원복 · D-0078). 그 값이 들어가는 자리는 앵커 안의 스토어 스킨 원가 한 줄뿐이다.
 * 화면 금액은 부가세 별도(공급가)로 적는다 (2026-10-16 (금) 대표 결정 「전부 부가세 미포함 기준으로 작성해」). 수정 비용 · 원본 파일 금액도 같다.
 *
 * 디자인 기준은 WDS 다 (harang/CLAUDE.md).
 * 아이콘 박스는 단색 배경 + 흰 아이콘으로 한다 — 그라데이션 금지.
 * services/shopping 이 bg-gradient-to-br 를 쓰고 있는데 그건 기존 코드의 위반이라 베끼지 않는다.
 */

const PATH = "/services/detail-page";
const URL = `${SITE.base}${PATH}`;
const CTA_HREF = "/contact?service=detail-page";

/* 1층 · 공정 9단 (본부장 상세페이지_제작시스템.md 제2장과 같은 값) */
/**
 * 히어로 밑 밴드에 거는 미리보기 12장.
 * 종류마다 첫 건을 먼저 뽑고 남는 자리를 두 번째 건으로 채운다 —
 * 앞에서부터 12장을 자르면 생활·리빙만 나와서 '이 사람은 생활용품만 하는구나' 로 읽힌다.
 */
const SHOWCASE = REF_CATEGORIES
  .flatMap((c) => c.works.slice(0, 2).map((w, i) => ({ ...w, cat: c.slug, catShort: c.short, rank: i })))
  .sort((a, b) => a.rank - b.rank)
  .slice(0, 12);

const REF_HREF = "/services/detail-page/reference";

const SECTIONS = [
  { code: "S0", name: "인트로 훅", role: "3초 안에 멈추게 한다", note: "실물 컷을 모션으로" },
  { code: "S1", name: "메인카피", role: "약속을 한 문장으로 말한다", note: "카피 일체형 디자인" },
  { code: "S2", name: "대표 실사컷", role: "실물이 이렇게 생겼다는 증명", note: "실물 원본에서 출발" },
  { code: "S3", name: "신뢰 블록", role: "산지·등급·측정값", note: "확정된 값만 올린다" },
  { code: "S4", name: "디테일·단면", role: "가까이서 봐도 괜찮은가", note: "접사 컷" },
  { code: "S5", name: "구성·옵션", role: "고르게 만든다", note: "표로 정리" },
  { code: "S6", name: "배송·포장", role: "깨지거나 상하지 않을까를 지운다", note: "포장 방식 공개" },
  { code: "S7", name: "표시사항", role: "식품이면 법정 요건", note: "원재료·소비기한 등" },
  { code: "S8", name: "CS·반품", role: "분쟁을 미리 막는다", note: "교환·환불 기준 명시" },
];

/* 등급 · 4등급 단가안 (2026-08-27 (목) 대표 지시로 원복 — 블로그 홈페이지형 디자인 등급표는 다른 상품이라 여기 쓰지 않는다) */
const PLANS = [
  {
    key: "planning",
    name: "기획형",
    price: "150,000원",
    amount: 150000,
    lead: "3영업일",
    summary: "기획만 받고 제작은 직접 하십니다",
    forWhom: "디자이너나 편집자가 이미 있는 경우",
    includes: [
      "9단 섹션 구성표",
      "섹션별 카피 (문구)",
      "3블록 이미지 생성 프롬프트 패키지",
      "촬영 기획안",
    ],
    excludes: ["상세 이미지 제작은 들어가지 않습니다"],
    recommended: false,
  },
  {
    key: "production",
    name: "제작형",
    price: "350,000원",
    amount: 350000,
    lead: "7영업일",
    summary: "기획부터 상세 이미지 완성까지",
    forWhom: "만들 사람이 없는 경우 · 기본으로 안내드립니다",
    includes: [
      "기획형 전부",
      "9단 상세페이지 이미지 제작",
      "모바일 가독성 판 (글자 크기·여백 재조정)",
      "슬라이스 파일 납품",
    ],
    excludes: [],
    recommended: true,
  },
  {
    key: "video",
    name: "제작+영상형",
    price: "550,000원",
    amount: 550000,
    lead: "10영업일",
    summary: "상세 이미지에 움직이는 첫 화면까지",
    forWhom: "사진부터 없는 경우 · 촬영 기획부터 같이 갑니다",
    includes: [
      "제작형 전부",
      "S0 첫 화면 훅 GIF",
      "숏폼 1편 (15초 내외)",
      "START·END 프레임 기반 제작",
    ],
    excludes: [],
    recommended: false,
  },
];

/* 앵커 — 실제로 파는 상품이다. 팔 생각 없는 가짜 등급은 표시광고법 위반이라 세우지 않는다 */
const PACKAGE = {
  key: "brand",
  name: "브랜드 패키지",
  price: "1,500,000원",
  amount: 1500000,
  lead: "20영업일",
  summary: "상품 하나가 아니라 스토어 하나를 세웁니다",
  includes: [
    "상품 3종 상세페이지",
    "스마트스토어 스킨 디자인",
    "블로그·카페 배포 원고 3편",
  ],
};

const EXTRAS = [
  { name: "텍스트·문구 수정", price: "2회 포함 / 초과 회당 30,000원", note: "카피와 문구를 고치는 수정입니다" },
  { name: "이미지 재생성", price: "컷당 3회 포함 / 초과 컷당 20,000원", note: "같은 자리의 이미지를 다시 뽑는 경우입니다" },
  { name: "구성 순서 변경", price: "1회 포함 / 이후 기획 재작업 80,000원", note: "순서가 바뀌면 카피와 이미지가 전부 다시 갑니다" },
  { name: "촬영 원본 교체", price: "1회 포함 / 이후 재제작 견적 별도", note: "사진이 바뀌면 그 자리부터 다시 만듭니다" },
];

/* 2층 · 순서를 강제하는 게이트 두 개 */
const GATES = [
  {
    title: "기획 없이 이미지를 만들지 않습니다",
    body: "구성표와 카피가 확정되기 전에는 이미지 생성을 시작하지 않습니다. 순서를 정하지 않고 만든 이미지는 예쁘게 나와도 자리를 못 찾아 결국 다시 만들게 됩니다.",
  },
  {
    title: "이미지가 확정되기 전에 영상을 만들지 않습니다",
    body: "영상은 확정된 이미지에서 출발합니다. 이미지가 흔들리는 상태에서 영상부터 만들면 이미지를 고치는 순간 영상을 통째로 다시 만들어야 합니다.",
  },
];

/* 3층 · 원칙 */
const PRINCIPLES = [
  {
    title: "실물 사진에서 출발합니다",
    body: "AI 로 보정하거나 실사화하더라도 출발점은 대표님이 보내주신 실물 사진입니다. 글자만으로 없는 제품을 만들어 올리지 않습니다.",
  },
  {
    title: "받아본 손님이 사진과 다르다고 할 수 있으면 그건 보정이 아닙니다",
    body: "밝기·색온도·먼지 제거·배경 정리까지가 보정입니다. 양을 늘리거나 크기·색을 실물과 다르게 만드는 것은 하지 않습니다.",
  },
  {
    title: "모르는 값은 비워두고 여쭙습니다",
    body: "식품 표시사항의 원재료·용량·소비기한·제조원은 확인된 것만 적습니다. 상세페이지에서는 틀린 값이 빈 값보다 나쁩니다.",
  },
  {
    title: "안 하는 것도 적어 둡니다",
    body: "검증할 수 없는 최상급 표현, 효능·질병 예방 문구, 실제 판매 이력이 없는 정가에 붙이는 할인율, 남은 수량 깜빡임 같은 재촉 장치는 쓰지 않습니다.",
  },
];

/* 고객이 겪는 순서 */
const STEPS = [
  { name: "상품 확인", text: "상품·가격·옵션·표시사항과 지금 갖고 계신 사진을 봅니다. 사진이 없어도 시작합니다." },
  { name: "구성 기획", text: "어떤 불안을 몇 번째 화면에서 지울지 정합니다. 9단 구성표와 카피가 여기서 나옵니다." },
  { name: "촬영 기획", text: "필요한 컷을 목록으로 드립니다. 직접 찍으셔도 되고 촬영을 맡기셔도 됩니다." },
  { name: "이미지 제작", text: "섹션별로 만들고, 고르는 게 아니라 고쳐서 확정합니다." },
  { name: "확정과 납품", text: "슬라이스 파일로 드립니다. 등록까지 맡기시면 스토어에 올려 드립니다." },
];

const FAQS: FaqItem[] = [
  {
    q: "상세페이지 제작 비용은 얼마인가요?",
    a: "하랑마케팅 상세페이지는 세 등급입니다. 기획만 받는 기획형 150,000원, 기획과 이미지 제작을 함께 하는 제작형 350,000원, 여기에 첫 화면 훅 GIF 와 숏폼 1편이 붙는 제작+영상형 550,000원입니다. 상품 3종에 스토어 스킨과 배포 원고까지 묶는 브랜드 패키지는 1,500,000원입니다. 모두 부가세 별도 금액이고 상담과 견적은 0원입니다.",
  },
  {
    q: "어느 등급을 골라야 하나요?",
    a: "질문 하나로 갈립니다. 사진도 있고 만들 사람도 있다면 기획형입니다. 사진은 있는데 만들 사람이 없다면 제작형입니다. 사진부터 없다면 제작+영상형으로 촬영 기획부터 같이 갑니다. 저희는 상담에서 제작형을 기본으로 안내드립니다.",
  },
  {
    q: "제품 사진이 아직 없는데 시작할 수 있나요?",
    a: "시작할 수 있습니다. 사진이 없는 단계에서는 촬영 기획안부터 만듭니다. 어떤 컷이 몇 장 필요한지, 각 컷을 어떤 각도와 배경으로 찍어야 하는지를 목록으로 드리기 때문에 직접 찍으셔도 되고 촬영을 맡기셔도 됩니다. 사진이 없어서 시작을 미루지 않으셔도 됩니다.",
  },
  {
    q: "수정은 몇 번까지 되나요?",
    a: "수정은 종류마다 횟수가 다릅니다. 문구 수정은 2회까지 포함이고 넘으면 회당 30,000원, 이미지 재생성은 컷당 3회까지 포함이고 넘으면 컷당 20,000원입니다. 구성 순서 변경은 1회까지 포함이고 이후에는 기획 재작업 80,000원, 촬영 원본 교체는 1회까지 포함이고 이후에는 재제작 견적을 따로 드립니다. 순서와 사진이 바뀌면 카피와 이미지가 전부 다시 가기 때문입니다. 무제한 수정은 약속드리지 않습니다.",
  },
  {
    q: "AI 로 만든 이미지를 쓰나요?",
    a: "씁니다. 다만 실물 사진에서 출발한 것만 씁니다. 보내주신 제품 사진을 밝기·색·배경 정리를 거쳐 상세컷 수준으로 다듬는 방식이고 글자만으로 없는 제품을 만들어 내지 않습니다. AI 를 쓴 작업은 사례에도 그렇게 표시합니다.",
  },
  {
    q: "만든 파일을 직접 고칠 수 있나요?",
    a: "편집 가능한 원본 파일을 50,000원에 드립니다. 다만 유료 폰트나 유료 이미지가 들어간 뒤에 요청하시면 무료 소스로 바꾸는 작업이 한 번 더 들어가므로, 원본이 필요하시면 시작할 때 미리 말씀해 주시는 편이 낫습니다.",
  },
];

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "스마트스토어 상세페이지 제작",
    alternateName: ["상세페이지 제작", "상세페이지 외주", "제품 상세페이지 디자인"],
    serviceType: "이커머스 상세페이지 기획·제작",
    provider: { "@id": LOCAL_ID },
    brand: { "@id": ORG_ID },
    url: URL,
    inLanguage: "ko-KR",
    description:
      "스마트스토어 상세페이지를 9단 구성으로 기획하고 제작합니다. 기획 없이 이미지를 만들지 않고, 이미지가 확정되기 전에 영상을 만들지 않습니다. 실물 사진에서 출발한 컷만 사용합니다.",
    areaServed: { "@type": "Country", name: "대한민국" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KRW",
      lowPrice: 150000,
      highPrice: 1500000,
      offerCount: PLANS.length + 1,
      offers: [...PLANS, PACKAGE].map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: p.amount,
        priceCurrency: "KRW",
        description: p.summary,
        url: URL,
      })),
    },
  },
  webPageLd({
    path: PATH,
    name: "하랑마케팅 스마트스토어 상세페이지 제작",
    description: "이미지를 파는 게 아니라 순서를 팝니다. 9단 구성 · 게이트 2개 · 공정 전체 공개. 150,000원부터.",
    dateModified: updatedAt(PATH),
  }),
  howToLd({
    path: PATH,
    name: "상세페이지 제작이 진행되는 순서",
    description: "상품 확인부터 납품까지 다섯 단계로 진행합니다. 사진이 없는 상태에서도 시작합니다.",
    totalTime: "P7D",
    steps: STEPS.map((s) => ({ name: s.name, text: s.text })),
  }),
  faqLd(FAQS, URL),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "스마트스토어 상세페이지 제작", path: PATH },
  ]),
];

export default function DetailPageServicePage() {
  const cases = getDetailPageCases();

  return (
    <>
      <JsonLd data={LD} />
      <Header />
      <SianMain>
        {/* 머리 · 문의 단추 셋을 하나로 줄였다 (상담 신청). 카카오톡은 맺음 띠에 있다 */}
        <PageHead
          where="스마트스토어 상세페이지 제작"
          title={<>이미지를 파는 게 아니라<br />순서를 팝니다</>}
          lead="같은 상품도 어떤 불안을 몇 번째 화면에서 지우느냐로 결과가 갈립니다. 그래서 예쁘게 만들기 전에 순서부터 정합니다."
          primary={{ href: CTA_HREF, label: "상세페이지 상담 신청" }}
          link={{ href: REF_HREF, label: `제작 사례 ${REF_TOTAL}건 보기` }}
          facts={[
            { label: "기획형", value: "150,000원" },
            { label: "제작형", value: "350,000원" },
            { label: "제작+영상형", value: "550,000원" },
            { label: "상담·견적", value: "0원" },
          ]}
        />

        {/* 처음 보는 대표님용 쉬운 풀이 · 뜻풀이는 app/lib/plain-terms.ts */}
        <Plain
          what="스마트스토어 같은 온라인 가게의 상품 설명 화면을 만드는 일입니다. 무엇을 어떤 순서로 보여 줄지 먼저 정하고 그다음에 이미지를 만듭니다."
          who="상품은 올렸는데 들어온 사람이 사지 않고 나가는 판매자 대표님께 필요합니다."
          terms={[PLAIN_TERMS.detailPage, PLAIN_TERMS.smartstore, PLAIN_TERMS.conversion]}
        >
          <SearchSketch focus={["site"]} />
        </Plain>

        {/* AEO 한 줄 정답 (speakable) */}
        <AnswerRow
          question="스마트스토어 상세페이지 제작은 비용이 얼마이고 무엇부터 하나요?"
          answer="하랑마케팅 상세페이지 제작은 세 등급입니다. 기획만 받는 기획형 150,000원, 기획과 이미지 제작을 함께 하는 제작형 350,000원, 첫 화면 훅 GIF 와 숏폼 1편까지 붙는 제작+영상형 550,000원입니다. 상품 3종에 스토어 스킨과 배포 원고까지 묶는 브랜드 패키지 1,500,000원도 있습니다. 모두 부가세 별도 금액입니다. 제작은 이미지부터가 아니라 구성 기획부터 시작합니다. 어떤 불안을 몇 번째 화면에서 지울지 정한 다음 9단 구성표와 카피를 만들고 그 다음에 이미지를 만듭니다. 제품 사진이 아직 없어도 촬영 기획안부터 진행할 수 있습니다. 상담과 견적은 0원입니다."
        />

        {/* 0층 · 레퍼런스 (만든 것부터 보여준다) */}
        <Section
          soft
          id="reference"
          title={`만든 상세페이지 ${REF_TOTAL}건을 그대로 열어 뒀습니다`}
          desc={`앞부분만 잘라 붙인 미리보기가 아니라 처음부터 끝까지 다 있습니다. ${REF_CATEGORIES.length}가지 종류로 나눠 뒀으니 내 상품과 가까운 것부터 보시면 됩니다.`}
          more={{ href: REF_HREF, label: `${REF_TOTAL}건 전부 펼쳐 보기` }}
        >
          <LinkList links={REF_CATEGORIES.map((c) => ({ href: `${REF_HREF}?category=${c.slug}`, label: `${c.short} ${c.works.length}건` }))} />
          <ul className={d.thumbs}>
            {SHOWCASE.map((w) => (
              <li key={w.slug}>
                <Link href={`${REF_HREF}?category=${w.cat}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/detail-ref/${w.slug}.jpg`} alt={`${w.title} 상세페이지 상단 화면`} width={w.tw} height={w.th} loading="lazy" decoding="async" />
                  <small>{w.catShort}</small>
                  <span>{w.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className={d.note}>상호 노출 동의를 받기 전이라 제품 종류만 적습니다. 상호·브랜드는 쓰지 않습니다.</p>
        </Section>

        {/* 설득 공정 시안 · 걱정 세 개부터 정하고 짠 시안 두 벌 (2026-11-12 루미) */}
        <Section
          id="persuasion"
          title="걱정부터 정하고 짠 시안"
          desc="상세페이지와 홈페이지 첫 화면을 같은 방법으로 짠 시안입니다."
          more={{ href: "/services/persuasion", label: "방법 자세히 보기" }}
        >
          <PersuasionSians />
        </Section>

        {/* 1층 · 공정 9단 */}
        <Section title="상세페이지는 아홉 칸으로 만듭니다" desc="칸마다 하는 일이 다릅니다. 순서가 곧 설득 순서입니다.">
          <Table
            label="상세페이지 9단 구성"
            head={["칸", "이름", "하는 일", "만드는 법"]}
            rows={SECTIONS.map((s) => [s.code, s.name, s.role, s.note])}
          />
          <p className={d.note}>
            식품이 아니면 S7 이 빠지고 옵션이 하나면 S5 가 짧아집니다.
            칸 수를 채우려고 넣지 않습니다. 할 말이 없는 칸은 비웁니다.
          </p>
        </Section>

        {/* 2층 게이트 + 3층 원칙 · 예전 두 절을 한 목록으로 합쳤다 (게이트 둘이 앞) */}
        <Section
          soft
          title="일하는 원칙"
          desc="할 수 있는 것보다 안 하는 것을 먼저 적어 둡니다. 앞의 두 줄은 순서를 지키게 만드는 장치입니다. 이 둘만 지키면 다시 만드는 일이 거의 없습니다."
        >
          <ItemList items={[...GATES, ...PRINCIPLES].map((g) => ({ title: g.title, desc: g.body }))} />
        </Section>

        {/* 등급 · 등급마다 있던 문의 단추는 글자 링크로 (plan 값은 그대로 넘긴다) */}
        <Section id="plans" title="등급과 금액" desc="상담에서는 제작형을 기본으로 안내드립니다.">
          <div className={d.plans}>
            {PLANS.map((p) => (
              <div key={p.key} className={d.plan}>
                <div>
                  <h3>{p.name}{p.recommended && <span className={d.tag}>기본 추천</span>}</h3>
                  <p className={d.meta}>{p.summary}</p>
                  <p className={d.price}>{p.price}<small>부가세 별도</small></p>
                  <p className={d.meta}>{p.lead} · {p.forWhom}</p>
                </div>
                <div>
                  <ul>
                    {p.includes.map((it) => <li key={it}>{it}</li>)}
                    {p.excludes.map((it) => <li key={it} className={d.ex}>{it}</li>)}
                  </ul>
                  <Link href={`${CTA_HREF}&plan=${p.key}`} className={d.ask}>이 등급으로 문의</Link>
                </div>
              </div>
            ))}
            {/* 앵커 · 상품 하나가 아니라 스토어 하나 */}
            <div className={d.plan}>
              <div>
                <h3>{PACKAGE.name}</h3>
                <p className={d.meta}>{PACKAGE.summary}</p>
                <p className={d.price}>{PACKAGE.price}<small>부가세 별도</small></p>
                <p className={d.meta}>{PACKAGE.lead}</p>
              </div>
              <div>
                <ul>{PACKAGE.includes.map((it) => <li key={it}>{it}</li>)}</ul>
                <Link href={`${CTA_HREF}&plan=${PACKAGE.key}`} className={d.ask}>이 구성으로 문의</Link>
              </div>
            </div>
          </div>

          <p className={d.sub}>등급에 들어가지 않는 항목</p>
          <Table
            label="등급에 들어가지 않는 항목"
            head={["항목", "금액", "설명"]}
            rows={EXTRAS.map((e) => [e.name, e.price, e.note])}
          />
          <p className={d.note}>
            수정 횟수는 위 표대로입니다. 섹션 순서를 바꾸거나 촬영 원본을 교체하는 것은 수정이 아니라
            재제작이라 따로 안내드립니다. 무제한 수정은 약속드리지 않습니다.
          </p>
        </Section>

        {/* 4층 · 사례 (없으면 없다고 적는다) */}
        <Section
          soft
          title="작업 사례"
          desc="상호 노출에 동의해 주신 건만 올립니다."
          more={{ href: REF_HREF, label: `제작한 상세페이지 ${REF_TOTAL}건 종류별로 보기` }}
        >
          {cases.length === 0 ? (
            <div>
              <p className={d.sub} style={{ marginTop: 0 }}>상호를 밝힌 사례는 아직 없습니다</p>
              <p className={d.note}>
                만든 상세페이지 {REF_TOTAL}건은 맨 위에 종류별로 펼쳐 뒀습니다. 상호와 브랜드명은 서면 동의를 받은 건만 적고, 성과를 지어내지 않습니다.
              </p>
              <p className={d.note}>
                대신 위에 공정을 전부 적어 두었습니다.{" "}
                <span className="font-semibold">이 사람이 내 상품을 어떻게 다룰까</span>
                에는 완성 이미지 몇 장보다 이쪽이 더 직접 답한다고 봅니다.
              </p>
            </div>
          ) : (
            <div className={d.cases}>
              {cases.map((c) => (
                <article key={c.slug}>
                  {c.thumb && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.thumb} alt={c.title} loading="lazy" />
                  )}
                  <h3>{c.title}</h3>
                  <p className={d.meta}>
                    {INDUSTRY_LABEL[c.industry] ?? c.industry}{c.aiUsed ? " · AI 활용" : ""} · {c.client} · {c.date} · {c.sections}단 구성
                  </p>
                  <dl>
                    <dt>문제</dt><dd>{c.problem}</dd>
                    <dt>푼 방법</dt><dd>{c.approach}</dd>
                    {/* 성과는 근거가 있는 건만 채운다. 비어 있으면 영역 자체를 그리지 않는다 */}
                    {c.result && (<><dt>성과</dt><dd>{c.result}</dd></>)}
                  </dl>
                  {c.aiNote && <p className={d.note}>{c.aiNote}</p>}
                </article>
              ))}
            </div>
          )}
        </Section>

        <Section title="진행 순서" desc="사진이 없는 상태에서도 2번부터 시작할 수 있습니다.">
          <Steps steps={STEPS.map((s) => ({ title: s.name, desc: s.text }))} />
        </Section>

        {/* 질문 · FAQPage 와 같은 항목 */}
        <Section
          soft
          id="faq"
          title="자주 묻는 질문"
          more={{ href: "/faq", label: "전체 질문 보기" }}
          footer={
            <CostLine
              text="표기 금액은 상품 1개 기준입니다. 등급 사이 금액과 장당 단가는 따로 만들지 않습니다."
              link={{ href: "#plans", label: "등급과 금액 보기" }}
            />
          }
        >
          <QuestionList items={FAQS} />
        </Section>

        <CloseBand
          title="상품 이야기부터 들려주세요"
          text="사진이 아직 없어도 됩니다. 무엇을 파시는지, 어떤 분들이 사시는지만 알려주시면 어떤 순서로 만들면 좋을지부터 정리해 드립니다. 상담과 견적은 0원입니다."
          primary={{ href: CTA_HREF, label: "상담 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
