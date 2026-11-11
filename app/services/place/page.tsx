import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import {
  SianMain, PageHead, AnswerRow, Section, ItemList, Steps, RankSection,
  QuestionList, CostLine, CloseBand,
} from "../../components/sian/Sian";
import {
  SITE, ORG_ID, LOCAL_ID, faqLd, breadcrumbLd, webPageLd, howToLd, updatedAt, type FaqItem,
} from "../../lib/seo";
import { RECORDS, SNAPSHOT_DATE, fmt, MEASURE_NOTE } from "../../lib/rank-records";
import { TRACK_TOTALS } from "../../lib/track-record";

/**
 * 네이버 플레이스 랜딩.
 *
 * 왜 만들었나 (H-0118 1번) — 광고 키워드 실측에서 플레이스 계열 월 검색량이
 * 30,000 인데 착지할 페이지가 없었다. 플레이스는 app/services/page.tsx 의
 * 서비스 카드 한 칸(id: "place")으로만 존재했다.
 *
 * 검색 의도를 갈랐다 — '네이버플레이스등록' 18,410 은 사장님이 직접 하려고
 * 치는 말이지 대행을 찾는 말이 아니다. 그래서 등록 절차를 그대로 알려 주고
 * 거기서 다음 층(순위)으로 넘긴다. 등록을 대행 상품으로 팔지 않는다.
 *
 * 숫자는 손으로 적지 않는다. 순위 기록과 집계는 전부 app/lib/rank-records.ts
 * 에서 계산해 쓴다 (그 파일 헤더의 5규칙이 이 페이지에도 그대로 걸린다).
 *
 * 가격은 넣지 않는다. /services#pricing 한 곳에만 둔다. 같은 숫자를 두 곳에
 * 적으면 갈린다. 새 가격 표기는 결재 사항이다 (헌장 C-35).
 *
 * app/services/page.tsx 의 result 문구('평균 4주 내 Top 5 진입')는 여기서
 * 반복하지 않는다. MEASURE_NOTE 와 어긋나는 성과 확약에 가깝다.
 */

const PATH = "/services/place";
const URL = `${SITE.base}${PATH}`;
const CTA_HREF = "/contact?service=place";

/* 집계 · 손으로 적지 않는다. RECORDS 를 다시 세어서 쓴다.
   업종별 집계 표(TOP_RECORDS · 가장 많이 올라간 기록)와 키워드 카드 28장은 2026-11-12 시안에서
   순위 표 넉 줄(RankSection)과 /cases/place-rank 링크로 바꿨다. */
/* 「올라온 기록 중 가장 빨랐던 건」이라고 말하는 자리다. 유지는 후보에서 뺀다. */
const RISEN_RECORDS = RECORDS.filter((r) => r.from > r.to);
const FASTEST = RISEN_RECORDS.reduce((a, b) => (b.days < a.days ? b : a));
const INDUSTRY_COUNT = new Set(RECORDS.map((r) => r.industry)).size;

/* 1페이지에 있는 자리는 두 종류다. 이 구분이 이 페이지의 뼈대다. */
const PAGE1_SLOTS = [
  {
    label: "광고 지면 3자리",
    body: "돈을 내면 올라가는 자리입니다. 클릭당 비용이 네이버로 나가고, 예산을 멈추면 그날 내려옵니다. 광고비는 저희에게 주는 것이 아니라 네이버에 주는 것입니다.",
  },
  {
    label: "순위 1위부터 5위",
    body: "돈으로 살 수 없는 자리입니다. 정보 완성도, 키워드, 사진, 리뷰, 소식이 쌓여서 정해집니다. 올라가는 데 시간이 걸리고 대신 예산을 멈춰도 바로 내려오지 않습니다.",
  },
];

/* 등록 5단계 — 무료로 그대로 알려 준다. HowTo 구조화 데이터의 원천이다. */
const REGISTER_STEPS = [
  {
    name: "스마트플레이스에 사업자 정보로 가입합니다",
    text: "네이버 스마트플레이스에 접속해 사업자등록증 정보로 업체를 신규 등록합니다. 사업자등록번호와 대표자명이 등록증과 한 글자도 다르면 심사에서 막힙니다.",
  },
  {
    name: "주소와 전화번호, 영업시간을 정확히 넣습니다",
    text: "도로명 주소와 상세 주소를 지도상 실제 위치에 맞춥니다. 전화번호는 실제로 받는 번호여야 하고, 영업시간과 휴무일은 브레이크타임까지 적습니다.",
  },
  {
    name: "업종 카테고리를 고릅니다",
    text: "고객이 어떤 검색어로 들어올지가 여기서 갈립니다. 카페인지 디저트카페인지, 정형외과인지 통증의학과인지에 따라 노출되는 검색어가 달라집니다.",
  },
  {
    name: "대표 사진과 메뉴, 가격을 올립니다",
    text: "대표 사진 한 장이 검색 결과 목록에 그대로 나옵니다. 메뉴와 가격은 최신 메뉴판 기준으로만 넣습니다. 지난 행사가를 올려 두면 방문한 손님과 다투게 됩니다.",
  },
  {
    name: "네이버 심사를 기다립니다",
    text: "제출하면 영업일 기준 며칠 안에 승인됩니다. 여기까지가 등록이고 비용은 0원입니다. 대표님이 직접 하실 수 있습니다.",
  },
];

/* 등록 다음에 하는 일 — 상품 정의는 app/services/page.tsx 의 place features 를 따른다. */
const WORK = [
  {
    title: "정보 완성도를 채웁니다",
    body: "비어 있는 칸이 있으면 그만큼 밀립니다. 상세설명, 찾아오는 길, 편의시설, 예약, 주차 정보를 글자 수 상한 안에서 다 채웁니다.",
  },
  {
    title: "키워드를 골라 넣습니다",
    body: "지역, 업종, 특징을 조합해 20개 이상을 잡습니다. 검색량이 큰 말만 고르지 않습니다. 실제 제공 서비스와 매장 특징을 설명하는 말인지 먼저 확인합니다.",
  },
  {
    title: "위에 있는 가게를 뜯어봅니다",
    body: "1위부터 5위가 무엇을 채웠고 무엇을 안 채웠는지 봅니다. 같은 것을 따라 하면 뒤에 서게 되므로, 그 가게에 없는 칸을 찾아 우리 쪽을 채웁니다.",
  },
  {
    title: "사진 구성을 잡아 드립니다",
    body: "무엇을 어떤 순서로 몇 장 찍어야 하는지 목록으로 드립니다. 카카오톡으로 받은 압축본은 쓰지 않습니다. 원본을 주시면 보정해서 올립니다.",
  },
  {
    title: "오후 2~3시에 순위를 재서 조정합니다",
    body: "밀린 날이 있으면 무엇이 바뀌었는지 찾습니다. 저장해 둔 순위 스냅샷을 이전 측정값과 비교합니다. 안 재면 밀린 것도 모릅니다.",
  },
];

/* 하지 않는 것. 순위는 잰 값으로만 말한다 */
const NEVER = [
  {
    title: "말로만 하는 순위 약속은 하지 않습니다",
    body: "경쟁 매장이 무엇을 하는지, 네이버가 기준을 언제 바꾸는지는 저희가 정하지 못합니다. 그래서 순위는 정해진 시각에 재서 저장해 둔 값으로만 말씀드립니다.",
  },
  {
    title: "광고 자리를 순위라고 부르지 않습니다",
    body: "광고를 켜 놓고 1페이지에 올랐다고 말씀드리지 않습니다. 광고 지면 3자리와 순위 1위부터 5위는 다른 자리이고, 보고드릴 때 그 둘을 나눠서 씁니다.",
  },
  {
    title: "방문객과 매출을 숫자로 약속하지 않습니다",
    body: "순위는 저희가 정해진 시각에 재는 값이라 근거를 댈 수 있지만, 방문객과 매출은 저희 계측 대상이 아닙니다. 재지 않은 숫자는 말씀드리지 않습니다.",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "네이버 플레이스 등록은 대행을 맡겨야 하나요?",
    a: "아닙니다. 등록은 무료이고 대표님이 직접 하실 수 있습니다. 스마트플레이스에 사업자 정보로 가입해 주소, 전화번호, 영업시간, 카테고리, 사진을 넣고 심사를 기다리면 됩니다. 저희는 등록 이후 업체 정보와 사진을 정리하고 실제 측정값을 보고합니다.",
  },
  {
    q: "플레이스 정보 정비와 플레이스 광고는 뭐가 다른가요?",
    a: "정보 정비는 주소·영업시간·카테고리·사진 등 실제 매장 정보를 확인하는 작업입니다. 광고는 네이버에 별도 집행비를 내고 운영하는 유료 지면입니다. 정보 정비 결과와 광고 집행 내역을 나눠 보고하며 검색 순위나 노출을 확약하지 않습니다.",
  },
  {
    q: "얼마나 걸리나요?",
    a: `업종과 지역 경쟁 강도에 따라 다릅니다. 저희가 정해진 시각에 재서 남긴 기록으로 말씀드리면, 지금까지 1페이지에 올라온 기록 중 가장 빨랐던 건은 ${FASTEST.industry} 업종의 ${fmt(FASTEST)} 로 ${FASTEST.days}일이 걸렸습니다. 반대로 32일을 계측하고도 몇 계단만 움직인 기록도 있습니다. 상담 때 지금 몇 위인지부터 재 보고 대략의 기간을 말씀드립니다.`,
  },
  {
    q: "몇 위까지 올려 주시나요?",
    a: "몇 위까지 올려 드린다는 말을 화면에 쓰지 않습니다. 경쟁 매장이 무엇을 하는지, 네이버가 기준을 언제 바꾸는지는 저희가 정하지 못하기 때문입니다. 대신 정해진 시각에 순위를 재서 저장해 두고, 밀린 날에 무엇이 바뀌었는지 찾습니다.",
  },
  {
    q: "지금 순위가 몇 위인지 먼저 알 수 있을까요?",
    a: "네. 상담 비용은 0원이고 지금 몇 위인지부터 재 드립니다. 매장명과 지역, 노리는 검색어를 알려 주시면 현재 위치와 위에 있는 가게가 무엇을 채웠는지 정리해서 드립니다. 그걸 보고 진행 여부를 정하시면 됩니다.",
  },
];

const LD = [
  webPageLd({
    path: PATH,
    name: "네이버 플레이스 정보 정비 · 지도 등록 대행",
    description:
      "네이버 지도 등록은 무료이고 대표님이 직접 하실 수 있습니다. 저희는 그다음을 합니다. 키워드를 골라 넣고 오후 2~3시에 순위를 재서 밀린 키워드를 다시 손봅니다.",
    dateModified: updatedAt(PATH, SNAPSHOT_DATE),
  }),
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "네이버 플레이스 정보 정비 대행",
    description:
      "네이버 스마트플레이스 정보 최적화, 지역·업종 키워드 세팅, 경쟁 매장 분석, 사진 구성 가이드, 오후 2~3시 순위 계측과 조정. 순위는 저장해 둔 스냅샷 실측값으로만 보고하고 몇 위까지 올려 드린다는 말을 하지 않습니다.",
    serviceType: "네이버 플레이스 검색 최적화",
    provider: { "@id": ORG_ID },
    areaServed: "대한민국",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: URL,
      servicePhone: SITE.phoneIntl,
      serviceLocation: { "@id": LOCAL_ID },
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "KRW",
      url: `${SITE.base}/services#pricing`,
      description: "상담과 진단 비용 0원. 업종과 진행 범위에 따라 견적을 드립니다.",
    },
  },
  howToLd({
    path: PATH,
    name: "네이버 플레이스(스마트플레이스) 등록하는 법",
    description:
      "네이버 지도에 가게를 올리는 절차입니다. 등록 자체는 무료이고 대표님이 직접 하실 수 있습니다.",
    totalTime: "PT40M",
    steps: REGISTER_STEPS.map((s) => ({ name: s.name, text: s.text })),
  }),
  faqLd(FAQS, URL),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "네이버 플레이스", path: PATH },
  ]),
];

export default function PlaceServicePage() {
  return (
    <>
      <JsonLd data={LD} />
      <Header />
      <SianMain>
        <PageHead
          where="서비스 · 네이버 플레이스 · 지도 검색"
          title={<>지도에 뜨는 것과 위에 뜨는 것은<br />다른 일입니다</>}
          lead={<span className="speakable">네이버 지도 등록은 무료라 대표님이 직접 하실 수 있고, 절차는 아래에 적어 두었습니다. 저희는 그다음 키워드를 넣고 오후 2~3시에 순위를 재서 밀린 키워드를 다시 손봅니다. 몇 위까지 올려 드린다는 말 대신 실제로 잰 순위로만 말씀드립니다.</span>}
          primary={{ href: CTA_HREF, label: "지금 순위 무료로 재보기" }}
          link={{ href: "/services#pricing", label: "비용 기준 보기" }}
          facts={[
            { label: "등록 비용", value: "0원 · 직접 가능" },
            { label: "순위 계측", value: "하루 한 번" },
            { label: "맡아온 매장", value: `${TRACK_TOTALS.stores}곳` },
            { label: "상담", value: "0원" },
          ]}
        />

        <AnswerRow
          question="네이버 플레이스 정보 정비, 대행을 맡겨야 하나요?"
          answer="지도에 올리는 등록은 무료라 직접 하시면 됩니다. 대행이 필요한 지점은 그다음입니다. 하랑마케팅은 주소·영업시간·카테고리·사진 등 실제 매장 정보를 정리하고 오후 2~3시에 검색 순위를 계측해 측정일과 함께 보고합니다. 유료 광고는 별도 집행비와 운영 내역으로 구분합니다. 몇 위까지 올려 드린다는 말은 하지 않고 정해진 시각에 재서 저장한 실측값으로만 보고합니다. 상담 비용은 0원입니다."
        />

        <Section
          soft
          title="1페이지에 있는 자리는 두 종류입니다"
          desc="이 둘을 섞어서 말하는 곳이 많습니다. 광고를 켜 두고 1페이지에 올랐다고 하면 예산을 멈춘 다음 달에 왜 사라졌는지 설명할 방법이 없습니다."
        >
          <ItemList items={PAGE1_SLOTS.map((p) => ({ title: p.label, desc: p.body }))} />
        </Section>

        {/* 등록 5단계 · HowTo 단계 url(#step-N)이 가리키는 자리라 id 를 남긴다 */}
        <Section
          title="등록은 직접 하셔도 됩니다"
          desc="절차를 그대로 적어 두었습니다. 비용은 0원이고 40분이면 끝나서 저희는 여기에 값을 매기지 않습니다."
        >
          <Steps idPrefix="step-" steps={REGISTER_STEPS.map((r) => ({ title: r.name, desc: r.text }))} />
          <p style={{ marginTop: 24 }}>
            여기까지 하시면 네이버 지도에 가게가 뜹니다.
            <span className="font-semibold"> 다만 위에 뜨지는 않습니다.</span>
            {" "}가게 이름을 그대로 치면 나오는데, 대표님이 원하시는 건
            이름을 모르는 손님이 지역과 업종으로 검색했을 때 나오는 것일 겁니다.
            그건 다음 층의 일입니다.
          </p>
        </Section>

        <Section
          soft
          title="등록 다음에 하는 일"
          desc="다섯 가지입니다. 하나씩 채운 뒤 달라진 자리를 재서 기록하고, 밀린 날은 원인부터 찾습니다."
        >
          <ItemList items={WORK.map((w) => ({ title: w.title, desc: w.body }))} />
        </Section>

        {/* 계측 기록 · 숫자는 app/lib/place-rank-cases.ts 한 곳에서만 온다. 업종을 가리지 않고 검색수가 큰 줄부터 넷 */}
        <RankSection
          label="업종별"
          title="정해진 시각에 재서 남긴 기록"
          desc={`업체명과 지역은 밝히지 않고 업종과 키워드 유형까지만 적습니다. 퍼센트로 말하지 않고 순위와 일수로만 말합니다. ${MEASURE_NOTE} 지금까지 ${INDUSTRY_COUNT}개 업종에서 계측했습니다.`}
          more={{ href: "/cases/place-rank", label: "계측 사례 전체 보기" }}
        />

        <Section
          soft
          title="하지 않는 것"
          desc="말로 앞서 나가지 않는 것들입니다. 보고는 정해진 시각에 재서 저장해 둔 값으로만 드립니다."
        >
          <ItemList items={NEVER.map((n) => ({ title: n.title, desc: n.body }))} />
        </Section>

        <Section
          id="faq"
          title="네이버 플레이스, 자주 묻는 질문"
          desc={`상담 때 가장 많이 나오는 ${["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열"][FAQS.length] ?? FAQS.length} 가지입니다.`}
          more={{ href: "/faq", label: "전체 질문 보기" }}
          footer={<CostLine
            text="진행 범위와 비용은 업종과 현재 상태에 따라 달라집니다. 같은 업종이어도 경쟁 강도가 다르면 해야 할 일이 다릅니다."
            link={{ href: "/services#pricing", label: "비용 기준 보기" }}
          />}
        >
          <QuestionList items={FAQS} />
        </Section>

        <CloseBand
          title="지금 몇 위인지부터 재보고 시작합니다"
          text="매장명과 지역, 노리는 검색어를 알려 주시면 현재 위치와 위에 있는 가게가 무엇을 채웠는지 정리해 드립니다. 상담 비용은 0원이고, 전화를 받는 사람이 대표입니다."
          primary={{ href: CTA_HREF, label: "순위 무료로 재보기" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
