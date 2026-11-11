import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import {
  SianMain, PageHead, AnswerRow, Section, ItemList, Steps, QuestionList, CostLine, CloseBand, Fold,
} from "../components/sian/Sian";
import { SITE, howToLd, webPageLd, updatedAt, breadcrumbLd, faqLd, ogImage } from "../lib/seo";

export const metadata: Metadata = {
  title: "진행 과정 | 상담부터 성과까지 6단계",
  description: "하랑마케팅 상담 신청부터 계약, 실행, 성과 리포트까지 6단계 진행 과정을 투명하게 공개합니다. 상담 비용 0원, 계약 강요 없음.",
  keywords: ["마케팅 대행사 진행 과정", "소상공인 마케팅 상담", "하랑마케팅 프로세스"],
  alternates: { canonical: "https://www.harangmarketing.com/process" },
  openGraph: {
    title: "하랑마케팅 진행 과정 | 상담부터 성과까지 6단계",
    description: "투명하게 공개하는 6단계 마케팅 진행 과정. 상담 비용 0원.",
    url: "https://www.harangmarketing.com/process",
    images: [ogImage()],
  },
};

/**
 * 6단계 진행 과정.
 *
 * 단계를 색으로 구분하지 않는다 — 예전에는 01 파랑 · 02 인디고 · 03 보라 · 04 초록으로
 * 여섯 색이 붙어 있었는데, 강조가 여섯이면 강조가 없는 것과 같다.
 * 위계는 번호와 굵기가 만들고 색은 Primary #0066FF 하나만 쓴다 (WDS).
 *
 * 문구는 다른 페이지와 같은 값을 봐야 한다. 특히
 *   · 첫 연락 시점은 약속하지 않는다. 카카오톡 문의를 24시간 접수한다는 사실만 적는다 (2026-09-25 결재 · 상담은 평일)
 *   · 견적은 월 정액이 아니라 항목별 단가 조합이다 (app/lib/seo.ts 의 price 가 정본)
 *   · 몇 개월에 몇 위를 만들어 준다는 성과 확약 문구를 쓰지 않는다
 */
const STEPS = [
  {
    title: "무료 상담 신청",
    duration: "D-Day",
    desc: "카카오톡 또는 전화로 연락하시면 됩니다. 상담 비용은 0원이며, 부담 없이 현재 상황을 말씀해 주세요.",
    details: [
      "카카오톡 채널 / 전화 / 홈페이지 폼 중 편한 방법으로",
      "현재 운영 중인 플랫폼·업종·고민 간단히 공유",
      "카카오톡 문의는 24시간 접수하고, 하랑 대표가 직접 연락드립니다",
    ],
  },
  {
    title: "무료 경쟁사 분석",
    duration: "D+1~2",
    desc: "네이버 플레이스·블로그·SNS 현황과 경쟁사를 비교 분석한 리포트를 무료로 제공합니다.",
    details: [
      "내 매장 현재 순위·리뷰·콘텐츠 현황 진단",
      "경쟁사 상위 3곳 전략 분석",
      "업종별 맞춤 성장 기회 도출",
    ],
  },
  {
    title: "맞춤 전략 제안",
    duration: "D+3",
    desc: "월 금액은 매장마다 다릅니다. 진단 결과에서 이 매장에 꼭 필요한 항목만 골라, 항목별 단가와 물량을 그대로 적은 견적서를 드립니다.",
    details: [
      "필요한 항목만 선택 · 안 쓰는 항목은 빼고 계산",
      "항목별 단가와 물량이 그대로 보이는 견적서",
      "진행 우선순위·타임라인 안내",
    ],
  },
  {
    title: "계약 및 킥오프",
    duration: "D+4~7",
    desc: "계약 후 즉시 킥오프 미팅에서 세부 실행 계획을 확정합니다. 대표가 직접 관리합니다.",
    details: [
      "표준 계약서 작성 (전자서명 가능)",
      "계정 권한·소재·자료 인수인계",
      "계약 당일 실행 착수",
    ],
  },
  {
    title: "실행 및 콘텐츠 제작",
    duration: "1개월~",
    desc: "블로그·플레이스·SNS 채널별 콘텐츠를 제작·배포하고, 리뷰·체험단 캠페인과 스마트스토어 상세페이지 작업을 계약한 항목대로 가동합니다.",
    details: [
      "계약한 항목·물량 그대로 제작·발행",
      "키워드 최적화 블로그 발행",
      "리뷰 캠페인·체험단 모집 진행",
      "스마트스토어 상세페이지 제작 (해당 항목 계약 시)",
    ],
  },
  {
    title: "월간 성과 리포트",
    duration: "매월 말",
    desc: "순위·방문자·리뷰·문의 등 핵심 KPI를 매월 리포트로 공유하고 다음 달 전략을 조정합니다.",
    details: [
      "플랫폼별 순위·노출·클릭 수치 공유",
      "전월 대비 성과 분석",
      "다음 달 전략 수정·개선 방향 협의",
    ],
  },
];

/* 머리 아래 신뢰 줄 · 예전 아이콘 줄에서 글만 옮겼다 */
const TRUST_POINTS = [
  "게시 URL 전체 전달 · 작업 내역 공개",
  "10년 경력 누적 500건 프로젝트",
  "카카오톡 24시간 접수",
];

const FAQS = [
  { q: "상담 후 꼭 계약해야 하나요?", a: "아닙니다. 무료 분석과 제안까지는 완전 무료이며 의무가 없습니다. 제안이 마음에 드실 때만 계약하시면 됩니다." },
  { q: "계약 기간은 얼마인가요?", a: "월 단위가 기본이고 중도 해지 위약금이 없습니다. 다만 마케팅을 처음 하시는 분은 기초공사와 인테리어 같은 기본 세팅부터 잡아야 해서 2~3개월 이상은 진행하셔야 합니다." },
  { q: "월 얼마부터 시작할 수 있나요?", a: "월 금액은 매장마다 다릅니다. 항목별 단가를 정해두고 매장에 꼭 필요한 항목만 골라 더하기 때문입니다. 블로그 관리대행 편당 평균 3~5만원처럼 기준 단가는 서비스 안내에 공개해 두었고, 시작 금액을 공개한 상품은 그 금액부터이며 실제 범위는 상담에서 확인합니다. 진단 후 항목과 물량이 그대로 보이는 견적서를 드리고, 안 쓰는 항목은 빼고 계산합니다." },
  { q: "중간에 서비스를 변경할 수 있나요?", a: "가능합니다. 월 리포트 협의 시 서비스 항목을 추가·변경·교체할 수 있습니다." },
  { q: "결과가 나오는 데 얼마나 걸리나요?", a: "업종과 상권 경쟁도에 따라 달라서 하나로 말씀드리기 어렵습니다. 대신 계약 전 진단에서 이 상권이 어느 정도 걸리는 자리인지 먼저 말씀드리고, 매월 리포트에 실제 순위가 몇 위에서 몇 위로 움직였는지 숫자로 적어 드립니다. 몇 개월 안에 몇 위를 만들어 드리겠다고 미리 약속하지는 않습니다." },
  { q: "담당자가 자주 바뀌지 않나요?", a: "상담한 하랑 대표가 계약부터 운영까지 그대로 맡습니다. 10년 경력의 대표가 계약 기간 내내 직접 담당하고, 중간에 처음 보는 담당자로 바뀌는 일은 없습니다." },
  { q: "작업 내용을 어떻게 확인할 수 있나요?", a: "매월 말 플랫폼별 순위·리뷰 수 등 저희가 직접 계측한 수치로 상세 리포트를 제공합니다. 매출·방문객은 계측 대상이 아니라 리포트에 넣지 않습니다. 언제든지 카카오톡으로 진행 상황을 문의하실 수 있습니다." },
];

/* ─── AEO 구조화 데이터 ───────────────────────────
   HowTo 는 "마케팅 대행 어떻게 진행돼?" 같은 절차형 질의에서
   AI 답변 엔진이 단계별로 그대로 인용하는 스키마다.
   step 배열은 화면에 렌더링되는 STEPS 와 같은 원본을 쓴다. */
const PROCESS_LD = [
  howToLd({
    path: "/process",
    name: "하랑마케팅 마케팅 대행 진행 과정 6단계",
    description:
      "하랑마케팅의 마케팅 대행은 무료 상담 신청, 무료 경쟁사 분석, 맞춤 전략 제안, 계약 및 킥오프, 실행 및 콘텐츠 제작, 월간 성과 리포트 6단계로 진행됩니다. 상담과 분석은 비용 0원이며 계약 강요가 없습니다. 월 정액이 아니라 필요한 항목만 골라 항목별 단가를 더해 견적을 냅니다.",
    totalTime: "P7D",
    steps: STEPS.map((s) => ({
      name: s.title,
      text: `${s.desc} (${s.duration}) ${s.details.join(". ")}`,
    })),
  }),
  webPageLd({
    path: "/process",
    name: "진행 과정 | 하랑마케팅",
    description: "상담 신청부터 월간 성과 리포트까지 6단계 마케팅 대행 진행 과정.",
    dateModified: updatedAt("/process"),
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "진행 과정", path: "/process" },
  ]),
  faqLd(FAQS, `${SITE.base}/process`),
];

export default function ProcessPage() {
  return (
    <>
      <JsonLd data={PROCESS_LD} />
      <Header />
      <SianMain>
        <PageHead
          where="Process · 진행 과정"
          title={<>상담부터 성과까지<br />6단계, 투명하게</>}
          lead={<>어떻게 진행되는지 미리 알고 오시면 더 빠르게 시작할 수 있습니다. 숨기는 단계 없이 전부 공개합니다.<br />{TRUST_POINTS.join(" · ")}</>}
          primary={{ href: "/contact", label: "지금 무료 상담 신청" }}
          link={{ href: "/free-check", label: "무료 플레이스 진단" }}
          facts={[
            { label: "상담·분석 비용", value: "0원" },
            { label: "카카오톡 문의 접수", value: "24시간" },
            { label: "계약~착수", value: "당일" },
            { label: "리포트 주기", value: "매월" },
          ]}
        />

        {/* AEO · 절차형 질의 한 줄 정답 (speakable) */}
        <AnswerRow
          question="하랑마케팅 마케팅 대행은 어떻게 진행되나요?"
          answer="하랑마케팅의 마케팅 대행은 6단계로 진행됩니다. 1) 무료 상담 신청(당일), 2) 무료 경쟁사 분석 리포트 제공(1~2일), 3) 필요한 항목만 골라 항목별 단가를 더한 견적 제안(3일), 4) 계약 및 킥오프 후 당일 실행 착수(4~7일), 5) 계약한 항목·물량대로 콘텐츠 제작·배포와 리뷰 캠페인 가동(1개월~), 6) 매월 말 성과 리포트와 전략 조정 순입니다. 상담과 분석 단계는 비용이 0원이며 계약을 강요하지 않습니다. 미리 정해둔 월 정액 금액은 없습니다."
        />

        {/* 6단계 · HowTo 단계 url(#step-1 …)이 가리키는 자리 */}
        <Section soft title="상담부터 성과까지 6단계" desc="단계마다 걸리는 시점을 함께 적었습니다. 세부 항목은 아래에서 펼쳐 보실 수 있습니다.">
          <Steps idPrefix="step-" steps={STEPS.map((st) => ({ title: `${st.title} · ${st.duration}`, desc: st.desc }))} />
          <Fold summary="단계별 세부 항목">
            <ItemList one items={STEPS.map((st) => ({ title: st.title, desc: st.details.join(" · ") }))} />
          </Fold>
        </Section>

        <Section
          id="faq"
          title="자주 묻는 질문"
          desc="진행 과정에서 가장 많이 물어보시는 것들"
          more={{ href: "/faq", label: "전체 질문 보기" }}
          footer={<CostLine text="월 정액이 아니라 필요한 항목만 골라 항목별 단가를 더해 견적을 냅니다." />}
        >
          <QuestionList items={FAQS} />
        </Section>

        <CloseBand
          title="준비됐다면, 지금 바로 시작하세요"
          text="상담 비용 0원 · 계약 강요 없음 · 카카오톡 24시간 접수"
          primary={{ href: "/contact", label: "무료 상담 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
