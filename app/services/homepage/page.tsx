import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import { Plain, SearchSketch, SianMain, PageHead, Section, ItemList, QuestionList, CloseBand } from "../../components/sian/Sian";
import { PLAIN_TERMS } from "../../lib/plain-terms";
import { SITE, breadcrumbLd, faqLd, webPageLd, updatedAt } from "../../lib/seo";
import { HP_DATA_DATE, HP_STATS } from "../../lib/homepage-portfolio";
import HomepageGallery from "./HomepageGallery";
import { HOMEPAGE_TIERS } from "../../lib/homepage-pricing";
import h from "./homepage.module.css";

const PATH = "/services/homepage";
const TITLE = "홈페이지 제작, 검색에서 발견되고 문의하기까지";
const DESC = "업종별 디자인에 SEO·GEO·AEO를 고려한 정보 구성과 문의 동선을 함께 설계합니다. 실제 시안을 비교하고 대표님 업체에 필요한 제작 범위를 확인하세요";

/* 가격은 app/lib/homepage-pricing.ts 한 곳에서 온다 (pricing.json 과 같은 숫자 · 바꾸면 C 결재) */
const TIERS = HOMEPAGE_TIERS;

/** desc 안의 bold 문장만 굵게 (<b> · font-weight 600) (발주서 '굵게 처리할 문장' 표) */
type Card = { title: string; desc: string; bold?: string };

function Emph({ text, bold }: { text: string; bold?: string }) {
  if (!bold || !text.includes(bold)) return <>{text}</>;
  const [before, ...rest] = text.split(bold);
  return (
    <>
      {before}
      <b>{bold}</b>
      {rest.join(bold)}
    </>
  );
}

const PHOTO_NOTES: Card[] = [
  { title: "휴대폰 사진이면 충분합니다", desc: "어떤 장면을 어떻게 찍으면 되는지 촬영 가이드를 보내 드립니다. 매장 · 작업 · 외관 몇 장이면 첫 화면을 채울 수 있습니다" },
  { title: "촬영이 필요하면 따로 상의합니다", desc: "직접 찍기 어려우시면 하랑 촬영을 따로 견적으로 안내해 드립니다. 촬영 없이 먼저 열고 사진은 나중에 바꿔도 됩니다" },
  { title: "사진 자리는 비워 두고 엽니다", desc: "사진이 늦어지면 그 자리는 깔끔하게 비워 두고 먼저 오픈합니다. 실제와 다른 사진으로 채우지 않습니다", bold: "실제와 다른 사진으로 채우지 않습니다" },
];

const INCLUDED: Card[] = [
  { title: "검색 노출 기본 세팅", desc: "페이지마다 제목 · 설명 · 구조화 데이터 · 사이트맵 · RSS 를 넣고 네이버 서치어드바이저와 구글 서치콘솔에 등록합니다" },
  { title: "AI 검색을 고려한 정보 구성", desc: "확인된 업체·서비스 정보와 실제 고객 질문의 답을 정리합니다. AI가 내용을 파악할 수 있도록 준비하며, 추천이나 인용 여부는 각 플랫폼이 판단합니다" },
  { title: "문의 전환 동선", desc: "휴대폰 화면 아래에 전화 · 문자 버튼을 고정해, 보던 손님이 바로 연락할 수 있게 만듭니다" },
  { title: "플레이스 정보 대조", desc: "확인된 상호 · 주소 · 전화 · 영업 정보를 홈페이지와 네이버 플레이스에 일관되게 안내합니다" },
  { title: "원고 · 사진 연결", desc: "업종에 맞는 문구 초안을 같이 만들고, 현장 사진은 보정만 해서 올립니다. 연출 사진을 실물처럼 쓰지 않습니다" },
  { title: "대표님 명의 · 보안 설정", desc: "도메인과 서버는 대표님 명의로 등록합니다. 보안 헤더와 수집 차단 설정까지 넣어 넘겨 드립니다" },
];

const STEPS: { title: string; desc: string; bold?: string }[] = [
  { title: "상담", desc: "업종 · 지역 · 원하는 분위기를 듣고 맞는 시안을 함께 고릅니다" },
  { title: "자료 받기", desc: "상호 · 전화 · 영업시간 · 서비스 메뉴 · 사진을 받습니다. 빈 곳은 질문지로 채웁니다" },
  { title: "초안", desc: "고르신 시안 위에 대표님 업체 정보를 넣은 초안을 보내 드립니다. 초안에는 확인 전이라는 표시가 붙습니다", bold: "확인 전이라는 표시가 붙습니다" },
  { title: "수정 · 검수", desc: "수정 요청을 반영하고 검색 기본 세팅 · 모바일 화면 · 보안 설정을 검사기로 확인합니다" },
  { title: "오픈 · 인계", desc: "대표님 명의 도메인으로 열고 관리 방법을 알려 드립니다. 월 관리는 선택입니다" },
];

const FAQ = [
  { q: "가게 사진이 하나도 없는데 괜찮나요?", a: "괜찮습니다. 촬영 가이드를 보내 드리고, 휴대폰으로 찍으신 사진으로 시작합니다. 사진이 늦어지면 그 자리는 비워 두고 먼저 엽니다" },
  { q: "우리 업종이 목록에 없으면요?", a: "가장 가까운 시안에서 시작해 대표님 업종에 맞게 구성과 문구를 새로 짭니다" },
  { q: "시안을 고르면 어디까지 바뀌나요?", a: "고르신 시안을 바탕으로 대표님 업체의 상호 · 사진 · 문구로 바꿔 만듭니다. 서비스 메뉴와 고객이 확인할 조건도 함께 정리합니다" },
  { q: "제작 기간은 얼마나 걸리나요?", a: "계약금 입금일부터 15영업일입니다. 사진과 정보가 늦게 오면 그만큼 늦어집니다" },
  { q: "도메인과 서버는 누구 명의인가요?", a: "대표님 명의로 등록하고 계정도 대표님이 가지십니다. 저희와 계약이 끝나도 홈페이지는 그대로 대표님 것입니다" },
  { q: "월 관리는 꼭 해야 하나요?", a: "선택입니다. 오픈 후 3개월은 오류 수정이 무상이고, 월 관리는 그 다음 달부터 월 단위로 고르실 수 있습니다" },
  { q: "검색 순위나 AI 답변 노출이 보장되나요?", a: "보장되지 않습니다. 검색 수집과 내용 이해를 위한 기본 설정, 확인된 업체 정보와 질문·답변 구성을 준비합니다. 순위·AI 인용·문의 성과는 플랫폼의 판단과 경쟁 상황, 콘텐츠·운영 조건에 따라 달라집니다. 관리와 리포트는 선택한 계약 범위를 따릅니다" },
  { q: "SEO·GEO·AEO는 무엇이 다른가요?", a: "SEO는 검색이 페이지를 수집하고 내용을 이해할 수 있도록 제목·설명·구조·사이트맵 등을 정리하는 일입니다. GEO와 AEO는 생성형 검색과 질문·답변 상황을 고려해 확인된 사업 정보, 서비스 조건, 근거와 명확한 답을 구성하는 관점입니다. 별도의 특수 파일이나 스키마 하나로 AI 추천이 보장되지는 않습니다" },
];

const LD = [
  webPageLd({ path: PATH, type: "CollectionPage", name: `${TITLE} | 하랑마케팅`, description: DESC, dateModified: updatedAt(PATH, HP_DATA_DATE) }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "홈페이지 제작", path: PATH },
  ]),
  faqLd(FAQ, `${SITE.base}${PATH}`),
];

/** 가는 선 목록 · desc 안의 bold 문장만 굵게 (발주서 '굵게 처리할 문장' 표). 카드 · 아이콘 상자는 걷었다 */
function EmphList({ items }: { items: Card[] }) {
  return (
    <dl className={h.items}>
      {items.map((it) => (
        <div key={it.title}>
          <dt>{it.title}</dt>
          <dd><Emph text={it.desc} bold={it.bold} /></dd>
        </div>
      ))}
    </dl>
  );
}

export default function HomepageServicePage() {
  const facts = [
    { label: "시안", value: `${HP_STATS.drafts}개` },
    { label: "업종", value: `${HP_STATS.industries}종` },
    { label: "디자인", value: `${HP_STATS.designs}가지` },
    { label: "제작 기간", value: "15영업일" },
  ];
  return (
    <>
      <Header />
      <SianMain>
        <JsonLd data={LD} />
        {/* 머리 · 단추는 시안 비교 하나. 카카오톡 상담은 맺음 띠에 있다 */}
        <PageHead
          where="홈페이지 제작"
          title={<>예쁘게 만든 홈페이지,<br />고객이 찾고 문의할 수 있어야 합니다</>}
          lead="하랑은 업종에 맞는 디자인에 SEO·GEO·AEO와 상담 동선을 함께 설계합니다. 고객이 서비스를 발견하고, 필요한 내용을 이해하고, 문의할 수 있는 홈페이지를 만듭니다"
          primary={{ href: "#gallery", label: "우리 업종 시안 비교하기" }}
          link={{ href: "#pricing", label: "제작 · 관리 가격 보기" }}
          facts={facts}
        />

        {/* 처음 보는 대표님용 쉬운 풀이 · 뜻풀이는 app/lib/plain-terms.ts */}
        <Plain
          what="업종에 맞는 홈페이지를 만들고, 검색엔진과 AI 가 읽을 수 있게 가게 정보를 글자로 정리하는 일입니다. 본 사람이 바로 문의할 수 있는 길도 같이 놓습니다."
          who="홈페이지가 없거나, 있어도 검색에 잡히지 않고 문의가 오지 않는 대표님께 필요합니다."
          terms={[PLAIN_TERMS.seo, PLAIN_TERMS.aeo, PLAIN_TERMS.geo]}
        >
          <SearchSketch focus={["site"]} />
        </Plain>

        <Section
          title="홈페이지는 고객이 판단하는 기준이 됩니다"
          desc="블로그·플레이스·SNS에서 관심을 가진 고객에게 서비스 범위, 선택 이유와 문의 방법을 한곳에서 안내할 수 있습니다. 검색 결과와 AI 답변에서 업체를 비교하는 고객에게도, 정확하고 확인 가능한 정보를 제공할 준비가 필요합니다. 디자인만으로는 검색 유입과 문의 전환까지 해결하기 어렵습니다"
        >
          <ItemList items={[
            { title: "검색에서 발견", desc: "업종·서비스별 제목과 설명, 수집 가능한 페이지 구조로 찾을 기반을 준비합니다" },
            { title: "내용을 이해", desc: "누구를 위한 서비스인지, 어디까지 제공하는지, 어떤 조건인지 명확히 안내합니다" },
            { title: "비교하고 신뢰", desc: "확인된 업체 정보와 실제 사진·사례, 고객이 자주 묻는 질문을 연결합니다" },
            { title: "편하게 문의", desc: "고객이 정보를 읽는 흐름에 전화·카카오톡·문의 버튼과 준비할 내용을 배치합니다" },
          ]} />
        </Section>

        <Section soft title="디자인과 함께 설계하는 검색·정보·문의 구조">
          <ItemList items={[
            { title: "SEO · 검색이 읽을 수 있도록", desc: "페이지별 제목·설명, 서비스별 정보 구조, 사이트맵과 검색 도구 등록을 준비합니다. 고객이 쓰는 검색어와 페이지 내용이 맞는지 확인합니다" },
            { title: "GEO · 업체와 서비스가 분명하도록", desc: "상호·위치·서비스·대상·제공 조건을 확인된 정보로 정리합니다. 다른 매체와의 정보 일관성과 설명을 뒷받침하는 근거를 함께 살핍니다" },
            { title: "AEO · 질문에 명확히 답하도록", desc: "실제 상담에서 나오는 질문을 바탕으로 답과 적용 조건을 구성합니다. FAQ와 읽기 쉬운 문단 구조를 사용하고, 답을 확인한 뒤 문의할 수 있게 연결합니다" },
            { title: "상담할 때 함께 정하는 제작 범위", desc: "업종별 페이지 구성안, 제목·설명과 사업 정보 정리, 질문·답변 초안, 문의 버튼 위치, 모바일 화면과 기본 검색 설정을 확인합니다. 페이지 수·연동·콘텐츠 추가·운영 점검은 선택한 제작 및 관리 계약을 기준으로 정합니다" },
          ]} />
          <p className={h.note}>검색 순위·AI 추천이나 인용·매출은 보장하지 않습니다. 오픈 후에도 실제 유입과 문의를 살펴 개선해야 합니다</p>
        </Section>

        {/* 시안 갤러리 · id="gallery" 는 HomepageGallery 가 광고 링크로 열릴 때 스크롤 대상으로 쓴다 */}
        <Section
          id="gallery"
          title="업종별 시안"
          desc="색상만 비교하지 마세요. 첫 화면에서 묻는 질문, 정보를 보여주는 순서와 고객의 다음 행동이 어떻게 다른지 확인해 보세요. 프리미엄 15개 안과 기존 251개 시안을 둘러보고 업체에 맞는 구조를 함께 정합니다"
          footer={<div className={h.gallery}><HomepageGallery /></div>}
        >
          <ItemList one items={[
            { title: "세무사 · 세무법인 홈페이지", href: "/services/homepage/tax", desc: "상담 세무사 소개 · 기장료 안내 · 서비스별 페이지를 갖춘 세무 틀과 분석 · 개선안 사례를 모았습니다" },
            { title: "병원 · 의원 홈페이지", href: "/services/homepage/clinic", desc: "진료과목 · 의료진 · 진료시간 정리와 의료법 문구 검수, 검색 기본 세팅을 함께 하는 병원 홈페이지 제작" },
          ]} />
        </Section>

        {/* 사진 안내 (발주 2026-10-04) */}
        <Section soft title="사진이 없어도 시작할 수 있습니다">
          <EmphList items={PHOTO_NOTES} />
        </Section>

        {/* 포함 사항 */}
        <Section title="제작에 기본으로 들어가는 것">
          <EmphList items={INCLUDED} />
        </Section>

        {/* 가격 · 숫자는 HOMEPAGE_TIERS 그대로 (바꾸면 C 결재) */}
        <Section
          soft
          id="pricing"
          title="제작 · 관리 가격"
          desc="제작비와 월 관리비 모두 부가세 별도입니다. 도메인 · 서버 실비(연 수만 원)는 대표님 명의로 직접 결제하십니다"
        >
          <div className={h.tiers}>
            {TIERS.map((t) => (
              <div key={t.name} className={`${h.tier} ${t.rec ? h.rec : ""}`}>
                <h3>{t.name}{t.rec && <span className={h.tag}>상담 기본</span>}</h3>
                <p className={h.pages}>{t.pages}</p>
                <p className={h.build}>{t.build}</p>
                <p className={h.monthly}>관리 {t.monthly}</p>
                <ul>{t.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            ))}
          </div>
        </Section>

        {/* 진행 순서 · 번호는 글자로만 */}
        <Section title="15영업일 진행 순서">
          <ol className={h.steps}>
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className={h.no}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p><Emph text={s.desc} bold={s.bold} /></p>
              </li>
            ))}
          </ol>
        </Section>

        {/* 자주 묻는 질문 (FAQPage 스키마와 같은 내용) */}
        <Section soft id="faq" title="자주 묻는 질문" more={{ href: "/faq", label: "전체 질문 보기" }}>
          <QuestionList items={FAQ} />
        </Section>

        <CloseBand
          title="우리 업체에 필요한 홈페이지는 무엇일까요?"
          text="업종 · 현재 운영 매체 · 고객 문의에서 자주 막히는 점을 알려 주세요. 필요한 구성부터 함께 정합니다"
          primary={{ href: "/contact", label: "상담 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
