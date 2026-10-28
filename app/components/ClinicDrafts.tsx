import Link from "next/link";
import { ExternalLink, LayoutTemplate } from "lucide-react";
import { HP_DRAFTS, hpDemoUrl, hpThumb } from "../lib/homepage-portfolio";

/**
 * 병원 홈페이지 쪽의 진료과목 시안 묶음 (TR-0080). 정본 데이터는 홈페이지 공장 (content/homepage-portfolio.json).
 * 업체명 · 사진은 전부 가상이라 띠를 같이 단다 (C-52 · 세팅안 나-1).
 */
export default function ClinicDrafts({ title, prefixes, limit = 9 }: { title: string; prefixes: string[]; limit?: number }) {
  const drafts = HP_DRAFTS.filter((d) => prefixes.some((p) => d.slug.startsWith(p))).slice(0, limit);
  if (drafts.length === 0) return null;
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--w-primary)] shadow-sm flex items-center justify-center shrink-0">
            <LayoutTemplate size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">{title}</h2>
        </div>
        <p className="mb-6 inline-flex rounded-lg bg-gray-100 px-3 py-1.5 text-xs md:text-[13px] font-semibold text-gray-600">시안 화면 · 업체명과 사진은 가상</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drafts.map((d) => (
            <a
              key={d.slug}
              href={hpDemoUrl(d.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-[var(--w-primary)] transition-colors"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hpThumb(d.slug)} alt={`${d.industry} 홈페이지 시안 PC 화면`} width={560} height={350} loading="lazy" className="h-full w-full object-cover object-top" />
              </div>
              <div className="p-4 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{d.name}</p>
                <p className="mt-1 text-xs text-gray-500">{d.real ? "실사형 레이아웃" : `디자인 · ${d.design}`}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--w-primary)]">
                  시안 열어 보기 <ExternalLink size={11} strokeWidth={2.5} />
                </span>
              </div>
            </a>
          ))}
        </div>
        <Link href="/services/homepage?group=medical" className="mt-6 inline-flex items-center min-h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[var(--w-primary)] transition-colors">
          병원 · 의원 시안 전체 보기
        </Link>
      </div>
    </section>
  );
}
