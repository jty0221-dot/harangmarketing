import Header from "../Header";
import Footer from "../Footer";
import JsonLd from "../JsonLd";
import { keywordServiceLd, type KeywordServiceData } from "../KeywordServicePage";
import {
  SianMain, PageHead, AnswerRow, Section, ItemList, LinkList, Steps,
  QuestionList, CostLine, CloseBand, Fold,
} from "./Sian";

/*
 * 키워드 서비스 페이지(블로그마케팅 · 파워컨텐츠)의 2026-11-12 시안 틀.
 * 데이터와 구조화 데이터는 KeywordServicePage 와 같은 것을 쓴다 (병원 홈페이지 하위 페이지는 옛 틀 그대로 · 진우 검수본).
 */
export default function KeywordSian({ d }: { d: KeywordServiceData }) {
  const cost = d.costFactors ?? [];
  return (
    <>
      <JsonLd data={keywordServiceLd(d)} />
      <Header />
      <SianMain>
        <PageHead
          where={`서비스 · ${d.badge}`}
          title={d.h1}
          lead={<span className="speakable">{d.intro}</span>}
          primary={{ href: d.ctaHref, label: "무료 상담 신청" }}
          link={{ href: "/services#pricing", label: "항목별 비용 보기" }}
          facts={d.facts}
        />

        <AnswerRow question={d.answer.question} answer={d.answer.answer} />

        {d.includes?.length ? (
          <Section soft title={d.includesTitle ?? "무엇이 포함되나요"}>
            <ItemList items={d.includes.map((k) => ({ title: k.title, desc: k.body }))} />
          </Section>
        ) : null}

        {d.never?.length ? (
          <Section title="하지 않는 것">
            <ItemList items={d.never.map((n) => ({ title: n.title, desc: n.body }))} />
          </Section>
        ) : null}

        <Section soft title={d.report ? "결과는 이렇게 보고합니다" : "이어서 볼 곳"} desc={d.report}>
          {d.related.length > 0 && <LinkList links={d.related} />}
        </Section>

        {d.steps?.length ? (
          <Section title={d.stepsTitle ?? "진행 순서"}>
            <Steps steps={d.steps.map((s) => ({ title: s.name, desc: s.text }))} />
          </Section>
        ) : null}

        <Section
          soft
          id="faq"
          title={d.faqTitle}
          desc="상담 전에 미리 확인해 보세요."
          more={{ href: "/faq", label: "전체 질문 보기" }}
          footer={cost.length > 0 ? (
            <>
              <CostLine text={cost[0]} />
              {cost.length > 1 && (
                <Fold summary="비용을 정하는 것">
                  {cost.slice(1).map((c) => <p key={c}>{c}</p>)}
                </Fold>
              )}
            </>
          ) : undefined}
        >
          <QuestionList items={d.faqs} />
        </Section>

        <CloseBand title={d.ctaTitle} text={d.ctaBody} primary={{ href: d.ctaHref, label: "무료 상담 신청" }} />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
