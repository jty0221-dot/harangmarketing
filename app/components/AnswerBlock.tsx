import { Sparkles } from "lucide-react";

/**
 * AEO 핵심 컴포넌트 — "한 줄 정답" 블록
 *
 * 구글 AI 개요, 네이버 AI 브리핑, ChatGPT·Perplexity 는 JSON-LD 가 아니라
 * 화면에 보이는 본문 문장을 그대로 인용한다.
 * 따라서 각 페이지 상단에 자기완결형 정답 문장을 눈에 보이게 배치한다.
 *
 * .speakable 클래스는 layout / 각 페이지의 SpeakableSpecification 과 짝을 이룬다.
 */
export default function AnswerBlock({
  question,
  answer,
  facts,
}: {
  /** 이 블록이 답하는 질문. 검색 질의문과 최대한 같은 형태로 쓸 것 */
  question: string;
  /** 주체·정의·수치·지역이 모두 들어간 자기완결형 문장 */
  answer: string;
  /** 인용 가능한 핵심 수치 (선택) */
  facts?: { label: string; value: string }[];
}) {
  return (
    <section
      className="py-6 md:py-10"
      style={{ background: "var(--h-surface)" }}
      aria-label="핵심 요약"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div
          className="rounded-2xl bg-white p-4 md:p-6 shadow-sm"
          style={{ border: "1px solid var(--h-border)" }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-sm flex items-center justify-center shrink-0 ring-1 ring-blue-700/20">
              <Sparkles size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p
                className="text-[11px] font-black tracking-[0.16em] uppercase mb-1"
                style={{ color: "var(--h-amber)" }}
              >
                한눈에 보는 정답
              </p>
              <h2
                className="text-base md:text-lg font-bold leading-snug"
                style={{ color: "var(--h-dark)" }}
              >
                {question}
              </h2>
            </div>
          </div>

          <p
            className="speakable text-sm md:text-[15px] leading-relaxed"
            style={{ color: "#374151" }}
          >
            {answer}
          </p>

          {facts && facts.length > 0 && (
            <dl
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4"
              style={{ borderTop: "1px solid var(--h-border)" }}
            >
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs mb-0.5" style={{ color: "var(--h-muted)" }}>
                    {f.label}
                  </dt>
                  <dd
                    className="text-base md:text-lg font-black tabular-nums"
                    style={{ color: "var(--h-blue)" }}
                  >
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
