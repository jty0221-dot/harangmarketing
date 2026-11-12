import Header from "../Header";
import Footer from "../Footer";
import JsonLd from "../JsonLd";
import { keywordServiceLd, type KeywordServiceData } from "../KeywordServicePage";
import {
  SianMain, PageHead, AnswerRow, Section, ItemList, LinkList, Steps,
  QuestionList, CostLine, CloseBand, Fold, Plain, SearchSketch, type SketchZone,
} from "./Sian";
import { PLAIN_TERMS, type PlainTerm } from "../../lib/plain-terms";

/* 처음 보는 대표님용 쉬운 풀이 · 경로별. 없는 경로는 절이 빠진다 */
const PLAIN: Record<string, { what: string; who: string; terms: PlainTerm[]; focus: SketchZone[] }> = {
  "/services/blog-marketing": {
    what: "손님이 검색하면서 궁금해하는 질문에 맞춰 블로그 글을 쓰고 올리는 일입니다. 올린 글의 주소는 전부 정리해서 드립니다.",
    who: "블로그가 필요한 줄은 알지만 직접 쓸 시간이 없거나, 무엇을 써야 할지 모르겠는 대표님께 필요합니다.",
    terms: [PLAIN_TERMS.blog, PLAIN_TERMS.keyword, PLAIN_TERMS.exposure],
    focus: ["post"],
  },
  "/services/powercontents": {
    what: "네이버 검색 결과에 광고로 실리는 글을 기획하고 쓰는 일입니다. 네이버 검수에서 돌아오면 고쳐서 다시 냅니다.",
    who: "네이버 광고를 하려는데 광고에 걸 글이 없거나, 검수에서 자꾸 돌아오는 대표님께 필요합니다.",
    terms: [PLAIN_TERMS.powercontents, PLAIN_TERMS.cpc, PLAIN_TERMS.keyword],
    focus: ["ad"],
  },
};

/*
 * 키워드 서비스 페이지(블로그마케팅 · 파워컨텐츠)의 2026-11-12 시안 틀.
 * 데이터와 구조화 데이터는 KeywordServicePage 와 같은 것을 쓴다 (병원 홈페이지 하위 페이지는 옛 틀 그대로 · 진우 검수본).
 */
export default function KeywordSian({ d }: { d: KeywordServiceData }) {
  const cost = d.costFactors ?? [];
  const plain = PLAIN[d.path];
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

        {plain && (
          <Plain what={plain.what} who={plain.who} terms={plain.terms}>
            <SearchSketch focus={plain.focus} />
          </Plain>
        )}

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
