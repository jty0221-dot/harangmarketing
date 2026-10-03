import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INDUSTRY_EXTRA, type IndustryKey } from "../lib/industry-extra";

// 업종 페이지 공통 : 진행 순서 4단계 + 진행 전에 확인하실 것 3문답 + 비용 안내 한 줄.
// 문답은 페이지의 '상담에서 나온 질문' 목록과 섞지 않고 여기서 따로 보여 준다.
export default function IndustrySteps({ industry }: { industry: IndustryKey }) {
  const d = INDUSTRY_EXTRA[industry];
  return (
    <section className="py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 text-center mb-2">{d.label} 진행 순서</h2>
        <p className="text-sm text-gray-500 text-center mb-8">하랑 대표가 상담부터 계측까지 직접 맡습니다.</p>

        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {d.steps.map((s, i) => (
            <li key={s.title} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm flex items-start gap-4">
              <span className="w-9 h-9 rounded-xl bg-[var(--w-primary)] text-white text-sm font-black flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm md:text-base mb-1">{s.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">진행 전에 확인하실 것</h3>
        <div className="space-y-3 mb-10">
          {d.faqs.map((f) => (
            <div key={f.q} className="border border-gray-200 rounded-2xl p-4 md:p-5">
              <p className="font-bold text-gray-900 text-sm md:text-base mb-1.5">{f.q}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-[var(--w-blue-99)] border border-[var(--w-blue-90)] p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-700">{d.price}</p>
          <Link
            href="/services#pricing"
            className="inline-flex items-center justify-center gap-1.5 min-h-11 px-4 rounded-xl bg-[var(--w-primary)] hover:bg-[var(--w-primary-strong)] text-white text-sm font-bold shrink-0 transition-colors"
          >
            항목별 단가 보기 <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
