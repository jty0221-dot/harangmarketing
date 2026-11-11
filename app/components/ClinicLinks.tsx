import Link from "next/link";
import { ArrowRight, FileText, ShieldCheck } from "lucide-react";
import JsonLd from "./JsonLd";
import { itemListLd } from "../lib/seo";
import { MEDICAL_PROCESS } from "../lib/medical-process";
import { CLINIC_LINE_PAGES, CLINIC_HUB_PATH } from "../lib/clinic-homepage";

/** 병원 홈페이지에 글자로 있어야 할 다섯 가지 (세팅안 나-2 절 순서 · N-01 · N-02) */
export function ClinicTextFive() {
  const items = ["진료과목", "의료진", "진료시간", "위치와 주차", "예약 방법"];
  return (
    <section className="py-14 md:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[var(--w-primary)] shadow-sm flex items-center justify-center shrink-0">
            <FileText size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">병원 홈페이지에 글자로 있어야 할 다섯 가지</h2>
        </div>
        <ol className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {items.map((t, i) => (
            <li key={t} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm">
              <span className="mr-1.5 text-[var(--w-primary)]">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 의료광고 검수 공정 (clinic 쪽과 같은 네 줄 · N-03) */
export function ClinicProcess() {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[var(--w-primary)] shadow-sm flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">의료광고 검수 공정</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MEDICAL_PROCESS.map((m) => (
            <div key={m.title} className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--w-primary)] shadow-sm flex items-center justify-center shrink-0">
                <m.icon size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-gray-900 mb-1">{m.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 허브 → 하위 쪽 전부 (N-06 · 카드 설명은 각 쪽 H1) + ItemList */
export function ClinicSubpages() {
  const subs = CLINIC_LINE_PAGES.filter((p) => p.path !== CLINIC_HUB_PATH);
  return (
    <section className="py-14 md:py-20 bg-gray-50">
      <JsonLd data={itemListLd({ path: CLINIC_HUB_PATH, name: "진료과목별 병원 홈페이지", items: subs.map((p) => ({ name: p.title, path: p.path, description: p.h1 })) })} />
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">진료과목별 병원 홈페이지</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subs.map((p) => (
            <Link key={p.path} href={p.path} className="group rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm hover:border-[var(--w-primary)] transition-colors">
              <p className="text-base md:text-lg font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
                {p.title.split(" · ")[0]}
                <ArrowRight size={15} className="text-gray-500 group-hover:text-[var(--w-primary)]" />
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{p.h1}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
