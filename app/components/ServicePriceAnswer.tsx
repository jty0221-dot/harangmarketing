import { ChevronRight, Sparkles } from "lucide-react";
import { ANSWER_SENTENCES } from "../lib/seo";
import { BLOG_UNIT_WITH_COPY, BLOG_UNIT_WITHOUT_COPY, CAFE_TIER_MIN, won } from "../lib/cafe-distribution";

/**
 * /services 전용 — 서비스·가격 정답 블록
 *
 * seo.ts 의 ANSWER_SENTENCES.price 를 한 문단으로 두면 단가 여섯 개가 문장 속에 묻혀
 * 읽히지 않는다. 같은 내용을 단가표와 안내 두 칸으로 나눠 보여 준다.
 * 원문 문단은 /faq 와 llms.txt 에 그대로 남아 AI 답변이 인용한다.
 *
 * 단가를 바꿀 때는 seo.ts 의 price 문장과 같이 바꾼다. 가격 문구 변경은 결재 대상이다.
 */
type Line = { unit: string; price: string };
type Row = { name: string; href?: string; lines: Line[] };

const ROWS: Row[] = [
  { name: "플레이스 SEO 최적화", href: "#place", lines: [{ unit: "1회", price: "10~15만원" }] },
  { name: "대표키워드 관리", lines: [{ unit: "", price: "키워드 확인 후 안내" }] },
  { name: "블로그 관리대행", href: "#blog", lines: [{ unit: "편당", price: "4만원" }] },
  {
    name: "최적화 블로그 배포",
    href: "#cafe-distribution",
    lines: [
      { unit: "원고 포함 건당", price: won(BLOG_UNIT_WITH_COPY) },
      { unit: "원고 직접 제공 건당", price: won(BLOG_UNIT_WITHOUT_COPY) },
    ],
  },
  { name: "카페 배포", href: "#cafe-distribution", lines: [{ unit: "건당", price: `${won(CAFE_TIER_MIN)}부터` }] },
  { name: "파워컨텐츠", href: "#powercontents", lines: [{ unit: "편당", price: "5만원" }] },
];

const NOTES = [
  {
    title: "기준 단가는 고정가가 아닙니다",
    body: "업종과 난이도에 따라 오르내립니다. 블로그 원고는 물량이 많거나 내용이 단순한 업종이면 4만원보다 낮아지고, 병의원처럼 의료광고 심의와 전문 용어 확인이 필요한 업종은 4만원보다 높아집니다.",
  },
  {
    title: "월 계약 금액은 미리 정해두지 않습니다",
    body: "현황을 진단해 꼭 필요한 항목만 고르고 상권 경쟁도에 맞춰 물량을 정한 뒤 그 항목만 더해 산출하므로 업체마다 달라집니다.",
  },
];

export default function ServicePriceAnswer() {
  return (
    <section className="py-6 md:py-10" style={{ background: "var(--h-surface)" }} aria-label="핵심 요약">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div
          className="rounded-2xl bg-white p-4 md:p-8 shadow-sm"
          style={{ border: "1px solid var(--h-border)" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black tracking-[0.16em] mb-1" style={{ color: "var(--h-amber)" }}>
                한눈에 보는 정답
              </p>
              <h2 className="text-base md:text-xl font-bold leading-snug" style={{ color: "var(--h-dark)" }}>
                하랑마케팅은 어떤 서비스를 얼마에 제공하나요?
              </h2>
            </div>
          </div>

          <p
            className="speakable mt-4 text-[15px] md:text-base leading-relaxed font-medium"
            style={{ color: "var(--h-dark)" }}
          >
            하랑마케팅은 패키지 정찰제가 아니라 항목별 단가를 조합해 견적을 냅니다. 광고 집행비는 실비로 별도이고 상담과 진단은 0원입니다.
          </p>

          <div className="mt-5 md:mt-6 rounded-xl overflow-hidden" style={{ border: "1px solid var(--h-border)" }}>
            <div
              className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs font-semibold"
              style={{ background: "var(--h-bg)", color: "var(--h-muted)" }}
            >
              <span>항목</span>
              <span>기준 단가 · 부가세 별도</span>
            </div>
            <ul>
              {ROWS.map((r) => (
                <li
                  key={r.name + r.lines[0].price}
                  className="flex items-start justify-between gap-4 px-4 py-3.5"
                  style={{ borderTop: "1px solid var(--h-border)" }}
                >
                  {r.href ? (
                    <a
                      href={r.href}
                      className="group inline-flex items-center gap-0.5 min-w-0 text-sm md:text-[15px] font-semibold hover:text-blue-600 transition-colors"
                      style={{ color: "var(--h-dark)" }}
                    >
                      {r.name}
                      <ChevronRight size={14} className="shrink-0 opacity-40 group-hover:opacity-100" />
                    </a>
                  ) : (
                    <span className="min-w-0 text-sm md:text-[15px] font-semibold" style={{ color: "var(--h-dark)" }}>
                      {r.name}
                    </span>
                  )}
                  <div className="shrink-0 text-right space-y-1">
                    {r.lines.map((l) => (
                      <p key={l.price} className="leading-snug">
                        {l.unit && (
                          <span className="text-xs mr-1.5" style={{ color: "var(--h-muted)" }}>
                            {l.unit}
                          </span>
                        )}
                        <span
                          className={
                            l.unit
                              ? "text-sm md:text-base font-bold tabular-nums"
                              : "text-[13px] md:text-sm font-medium"
                          }
                          style={{ color: l.unit ? "var(--h-blue)" : "var(--h-muted)" }}
                        >
                          {l.price}
                        </span>
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 md:mt-4">
            {NOTES.map((n) => (
              <div key={n.title} className="rounded-xl p-4" style={{ background: "var(--h-bg)" }}>
                <p className="text-sm font-bold mb-1" style={{ color: "var(--h-dark)" }}>
                  {n.title}
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--h-muted)" }}>
                  {n.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--h-border)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--h-muted)" }}>
              제공 서비스
            </p>
            <p className="speakable text-[13px] leading-relaxed" style={{ color: "var(--h-muted)" }}>
              {ANSWER_SENTENCES.whatWeDo}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
