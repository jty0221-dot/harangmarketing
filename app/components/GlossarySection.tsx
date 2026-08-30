import { BookMarked } from "lucide-react";
import { DEFINITIONS } from "../lib/seo";

/**
 * 용어 정의 섹션 (AEO/GEO)
 *
 * "네이버 플레이스 SEO란?", "맘카페 바이럴이 뭐야?" 같은 정의형 질의는
 * AI 답변 엔진이 가장 많이 받는 유형이다.
 * 정의문을 <dt>/<dd> 시맨틱 마크업으로 노출하면 발췌 대상으로 잡히기 쉽다.
 */
export default function GlossarySection() {
  return (
    <section className="py-10 md:py-16" style={{ background: "var(--h-surface)" }} aria-labelledby="glossary-heading">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center shrink-0 ring-1 ring-blue-700/20">
            <BookMarked size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <h2
            id="glossary-heading"
            className="text-2xl md:text-3xl font-black"
            style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}
          >
            마케팅 용어, 쉽게 정리했습니다
          </h2>
        </div>
        <p className="text-sm md:text-[15px] mb-6 leading-relaxed" style={{ color: "var(--h-muted)" }}>
          상담 중 가장 많이 나오는 용어를 사장님 눈높이에서 풀어썼습니다.
        </p>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {DEFINITIONS.map((d) => (
            <div
              key={d.term}
              className="rounded-2xl bg-white p-4 md:p-6 shadow-sm"
              style={{ border: "1px solid var(--h-border)" }}
            >
              <dt
                className="text-base md:text-lg font-black mb-2"
                style={{ color: "var(--h-blue)", letterSpacing: "-0.02em" }}
              >
                {d.term}
              </dt>
              <dd className="speakable text-sm leading-relaxed" style={{ color: "#4B5563" }}>
                {d.definition}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
