import Link from "next/link";
import { ArrowRight, Phone, ListChecks, Ban, Coins, ClipboardList, PackageCheck } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import AnswerBlock from "./AnswerBlock";
import FaqAccordion from "./FaqAccordion";
import JsonLd from "./JsonLd";
import { SITE, ORG_ID, LOCAL_ID, faqLd, breadcrumbLd, webPageLd, updatedAt, howToLd, type FaqItem } from "../lib/seo";

/**
 * 키워드 하나 = 페이지 하나 (스킬 seo-99-website 2단계) 서비스 페이지 틀.
 * 2026-10-08 대표 지시 「구글이든 네이버든 키워드에 대해 상위노출」 · 블로그마케팅 · 파워컨텐츠 전용 페이지가 없어서 만들었다.
 * 글은 아론 초안 (원고검사 종료 0) 을 데이터로 넣고, 이 틀은 자리 · 구조화 데이터만 맡는다 (민수).
 * 가격 숫자는 넣지 않는다. 단가는 /services 가격표 한 곳에서만 말한다 (C-35).
 */

export interface KeywordServiceData {
  path: string;
  badge: string;
  h1: string;
  intro: string;
  answer: { question: string; answer: string };
  facts: { label: string; value: string }[];
  serviceName: string;
  serviceDesc: string;
  includes: { title: string; body: string }[];
  steps: { name: string; text: string }[];
  costFactors: string[];
  never: { title: string; body: string }[];
  report: string;
  faqs: FaqItem[];
  faqTitle: string;
  ctaTitle: string;
  ctaBody: string;
  ctaHref: string;
  related: { label: string; href: string }[];
}

export default function KeywordServicePage({ d }: { d: KeywordServiceData }) {
  const URL = `${SITE.base}${d.path}`;
  const LD = [
    webPageLd({ path: d.path, name: d.h1, description: d.intro, dateModified: updatedAt(d.path) }),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${URL}#service`,
      name: d.serviceName,
      description: d.serviceDesc,
      serviceType: d.serviceName,
      provider: { "@id": ORG_ID },
      areaServed: "대한민국",
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: URL,
        servicePhone: SITE.phoneIntl,
        serviceLocation: { "@id": LOCAL_ID },
      },
    },
    howToLd({ path: d.path, name: `${d.badge} 진행 순서`, description: `${d.badge}를 어떤 순서로 진행하는지 정리했습니다.`, steps: d.steps.map((s) => ({ name: s.name, text: s.text })) }),
    faqLd(d.faqs, URL),
    breadcrumbLd([
      { name: "홈", path: "/" },
      { name: "서비스", path: "/services" },
      { name: d.badge, path: d.path },
    ]),
  ];

  return (
    <>
      <JsonLd data={LD} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* 히어로 */}
        <section className="bg-gray-950 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 mb-6">
              <PackageCheck size={14} className="text-blue-300" strokeWidth={2.5} />
              <span className="text-xs md:text-[13px] font-bold text-blue-200">{d.badge}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">{d.h1}</h1>
            <p className="speakable text-base md:text-lg text-gray-300 leading-relaxed mb-8 max-w-3xl">{d.intro}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={d.ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 md:px-6 md:py-3.5 text-sm md:text-base font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                무료 상담 신청
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <a
                href={SITE.kakaoChat}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 md:px-6 md:py-3.5 text-sm md:text-base font-bold text-white ring-1 ring-white/20 hover:bg-white/15 transition-colors"
              >
                <Phone size={18} strokeWidth={2.5} />
                카카오톡으로 문의
              </a>
            </div>
            <p className="mt-4 text-sm">
              <Link href="/services#pricing" className="inline-flex items-center min-h-11 text-gray-300 underline underline-offset-4 hover:text-white transition-colors">
                항목별 비용 보기
              </Link>
            </p>
          </div>
        </section>

        <AnswerBlock question={d.answer.question} answer={d.answer.answer} facts={d.facts} />

        {/* 포함 항목 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 md:mb-10">무엇이 포함되나요</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {d.includes.map((k) => (
                <div key={k.title} className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-[var(--w-primary)] shadow-sm flex items-center justify-center mb-4">
                    <ListChecks size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">{k.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{k.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 진행 순서 */}
        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 md:mb-10">진행 순서</h2>
            <ol className="space-y-3 md:space-y-4">
              {d.steps.map((s, i) => (
                <li key={s.name} className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
                  <div className="flex items-start gap-3 md:gap-4">
                    <span className="w-9 h-9 rounded-xl bg-[var(--w-primary)] text-white text-sm font-black flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5">{s.name}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{s.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 비용을 정하는 것 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[var(--w-primary)] shadow-sm flex items-center justify-center shrink-0">
                <Coins size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">비용을 정하는 것</h2>
            </div>
            <ul className="space-y-3 mb-6">
              {d.costFactors.map((c) => (
                <li key={c} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed">{c}</li>
              ))}
            </ul>
            <Link
              href="/services#pricing"
              className="inline-flex items-center justify-center gap-1.5 min-h-11 px-4 rounded-xl bg-[var(--w-primary)] hover:bg-[var(--w-primary-strong)] text-white text-sm font-bold transition-colors"
            >
              항목별 단가 보기 <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* 하지 않는 것 */}
        <section className="py-14 md:py-20 bg-gray-950">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-8 md:mb-10">하지 않는 것</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {d.never.map((n) => (
                <div key={n.title} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 md:p-6">
                  <div className="w-9 h-9 rounded-xl bg-[var(--w-primary)] shadow-sm flex items-center justify-center mb-4">
                    <Ban size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-2">{n.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 결과 보고 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[var(--w-primary)] shadow-sm flex items-center justify-center shrink-0">
                <ClipboardList size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">결과는 이렇게 보고합니다</h2>
            </div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl">{d.report}</p>
            {d.related.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {d.related.map((r) => (
                  <Link key={r.href} href={r.href} className="inline-flex items-center min-h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[var(--w-primary)] hover:text-[var(--w-primary-strong)] transition-colors">
                    {r.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <FaqAccordion items={d.faqs} title={d.faqTitle} subtitle="상담 전에 미리 확인해 보세요." showMoreHref="/faq" />

        {/* CTA */}
        <section className="py-14 md:py-16 bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">{d.ctaTitle}</h2>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">{d.ctaBody}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={d.ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm md:text-base font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                무료 상담 신청
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm md:text-base font-bold text-white ring-1 ring-white/20 hover:bg-white/15 transition-colors"
              >
                <Phone size={18} strokeWidth={2.5} />
                {SITE.phone}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
