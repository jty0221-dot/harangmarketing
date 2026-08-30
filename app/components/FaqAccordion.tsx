import Link from "next/link";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import type { FaqItem } from "../lib/seo";

/**
 * FAQ 아코디언 (AEO)
 *
 * 네이티브 <details>/<summary> 를 쓰는 이유:
 * 1) JS 없이도 DOM 에 질문·답변이 모두 존재한다 → 크롤러와 AI 가 전부 읽는다.
 * 2) 구글은 "사용자가 펼칠 수 있는" 형태의 FAQ 를 FAQPage 로 인정한다.
 *    (JS 로 조건부 렌더링하면 마크업만 있고 본문이 없는 상태가 되어 정책 위반)
 *
 * 이 컴포넌트를 쓰는 페이지는 반드시 같은 items 로 faqLd() 를 함께 선언해야 한다.
 */
export default function FaqAccordion({
  items,
  title = "자주 묻는 질문",
  subtitle,
  showMoreHref,
}: {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
  showMoreHref?: string;
}) {
  return (
    <section className="py-10 md:py-16 bg-white" aria-labelledby="faq-heading">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center shrink-0 ring-1 ring-blue-800/20">
            <HelpCircle size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <h2
            id="faq-heading"
            className="text-2xl md:text-3xl font-black"
            style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}
          >
            {title}
          </h2>
        </div>

        {subtitle && (
          <p className="text-sm md:text-[15px] mb-6 leading-relaxed" style={{ color: "var(--h-muted)" }}>
            {subtitle}
          </p>
        )}

        <div className="space-y-2 md:space-y-3">
          {items.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl bg-white shadow-sm overflow-hidden"
              style={{ border: "1px solid var(--h-border)" }}
            >
              <summary className="flex items-start justify-between gap-3 cursor-pointer list-none px-4 md:px-6 py-4 md:py-5 hover:bg-gray-50 transition-colors">
                <h3
                  className="text-sm md:text-base font-bold leading-snug min-w-0"
                  style={{ color: "var(--h-dark)" }}
                >
                  {f.q}
                </h3>
                <ChevronDown
                  size={18}
                  className="shrink-0 mt-0.5 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={2.5}
                />
              </summary>
              <div
                className="px-4 md:px-6 pb-4 md:pb-5 -mt-1"
                style={{ borderTop: "1px solid var(--h-border)" }}
              >
                <p
                  className="speakable text-sm leading-relaxed pt-4"
                  style={{ color: "#4B5563" }}
                >
                  {f.a}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
          {showMoreHref && (
            <Link
              href={showMoreHref}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-colors hover:opacity-80"
              style={{ border: "1.5px solid var(--h-border)", color: "var(--h-dark)" }}
            >
              <HelpCircle size={15} strokeWidth={2.5} />
              전체 질문 보기
            </Link>
          )}
          <a
            href="https://pf.kakao.com/_MuUkG/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm transition-colors"
          >
            <MessageCircle size={15} strokeWidth={2.5} />
            여기에 없는 질문 물어보기
          </a>
        </div>
      </div>
    </section>
  );
}
