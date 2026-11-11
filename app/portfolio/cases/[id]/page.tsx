import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, MessageCircle, TrendingDown } from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbLd, webPageLd, ogImage, SITE } from "../../../lib/seo";
import { RESULT_CASES, getResultCase } from "../../../lib/result-cases";

type Params = Promise<{ id: string }>;

export const dynamicParams = false;
export function generateStaticParams() {
  return RESULT_CASES.map(({ id }) => ({ id }));
}

function load(id: string) {
  const c = getResultCase(id);
  if (!c) notFound();
  return c;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = load((await params).id);
  const title = `${c.label} 성과 사례`;
  const url = `${SITE.base}/portfolio/cases/${c.id}`;
  return {
    title,
    description: c.summary,
    alternates: { canonical: url },
    ...(c.sample ? { robots: { index: false, follow: false } } : {}),
    openGraph: { title: `${title} | 하랑마케팅`, description: c.summary, url, images: [ogImage(title)] },
  };
}

export default async function ResultCasePage({ params }: { params: Params }) {
  const c = load((await params).id);
  const path = `/portfolio/cases/${c.id}`;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-[104px] md:pt-[108px]" style={{ background: "var(--w-bg-alt)" }}>
        <JsonLd
          data={[
            webPageLd({ path, name: `${c.label} 성과 사례 | 하랑마케팅`, description: c.summary }),
            breadcrumbLd([
              { name: "홈", path: "/" },
              { name: "업종별 사례", path: "/portfolio" },
              { name: c.label, path },
            ]),
          ]}
        />
        <div className="mx-auto max-w-4xl px-5 py-10 md:py-14">
          <Link
            href="/portfolio#result-cases"
            className="inline-flex min-h-11 items-center gap-1.5 w-label-1"
            style={{ color: "var(--w-label-alt)" }}
          >
            <ArrowLeft size={16} />
            성과 사례 목록
          </Link>

          <header className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-chip w-chip-blue">{c.industry}</span>
              <span className="w-chip w-chip-neutral">{c.period}</span>
              {c.sample && <span className="w-chip w-chip-neutral">가상 시안</span>}
            </div>
            <h1 className="w-heading-1 mt-3" style={{ color: "var(--w-label-strong)" }}>
              {c.label}
            </h1>
            <p className="w-body-1 mt-3 speakable" style={{ color: "var(--w-label-alt)" }}>
              {c.summary}
            </p>
            {c.services.length > 0 && (
              <p className="w-caption-1 mt-3" style={{ color: "var(--w-label-assistive)" }}>
                진행한 서비스 · {c.services.join(" · ")}
              </p>
            )}
          </header>

          <section className="w-card mt-8 p-5 md:p-6">
            <h2 className="w-title-3" style={{ color: "var(--w-label-strong)" }}>시작할 때 상태</h2>
            <p className="w-body-2 mt-2" style={{ color: "var(--w-label)" }}>{c.before}</p>
          </section>

          <section className="w-card mt-4 p-5 md:p-6">
            <h2 className="w-title-3" style={{ color: "var(--w-label-strong)" }}>한 일</h2>
            <ul className="mt-3 space-y-2">
              {c.did.map((d) => (
                <li key={d} className="flex gap-2 w-body-2" style={{ color: "var(--w-label)" }}>
                  <Check size={16} className="mt-1 shrink-0" style={{ color: "var(--w-primary)" }} strokeWidth={2.5} />
                  <span className="min-w-0">{d}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="w-card mt-4 p-5 md:p-6">
            <h2 className="w-title-3" style={{ color: "var(--w-label-strong)" }}>전후 숫자</h2>
            {/* PC 는 표, 폰은 카드 */}
            <table className="mt-4 hidden w-full text-left md:table">
              <thead>
                <tr className="w-caption-1" style={{ color: "var(--w-label-assistive)" }}>
                  <th className="py-2 pr-4 font-medium">항목</th>
                  <th className="py-2 pr-4 font-medium">시작</th>
                  <th className="py-2 pr-4 font-medium">결과</th>
                  <th className="py-2 font-medium">메모</th>
                </tr>
              </thead>
              <tbody>
                {c.results.map((r) => (
                  <tr key={r.label} className="border-t w-body-2" style={{ borderColor: "var(--w-line)" }}>
                    <td className="py-3 pr-4 font-semibold" style={{ color: "var(--w-label-strong)" }}>{r.label}</td>
                    <td className="py-3 pr-4 w-num" style={{ color: "var(--w-label-alt)" }}>{r.before}</td>
                    <td className="py-3 pr-4 w-num font-semibold" style={{ color: "var(--w-primary)" }}>{r.after}</td>
                    <td className="py-3" style={{ color: "var(--w-label-alt)" }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="mt-4 space-y-2 md:hidden">
              {c.results.map((r) => (
                <li key={r.label} className="rounded-lg px-4 py-3" style={{ background: "var(--w-bg-alt)" }}>
                  <p className="w-label-1 font-semibold" style={{ color: "var(--w-label-strong)" }}>{r.label}</p>
                  <p className="w-body-2 w-num mt-1" style={{ color: "var(--w-label-alt)" }}>
                    {r.before}
                    <ArrowRight size={14} className="mx-1.5 inline" />
                    <span className="font-semibold" style={{ color: "var(--w-primary)" }}>{r.after}</span>
                  </p>
                  {r.note && <p className="w-caption-1 mt-1" style={{ color: "var(--w-label-alt)" }}>{r.note}</p>}
                </li>
              ))}
            </ul>
            <p className="w-caption-1 mt-4" style={{ color: "var(--w-label-alt)" }}>
              고객 정보 보호를 위해 상호와 지역은 가렸습니다. 숫자는 고객께 드린 보고서의 값 그대로입니다.
              결과는 업종과 지역에 따라 다릅니다.
            </p>
          </section>

          {c.low && (
            <section className="w-card mt-4 p-5 md:p-6">
              <h2 className="flex items-center gap-2 w-title-3" style={{ color: "var(--w-label-strong)" }}>
                <TrendingDown size={18} style={{ color: "var(--w-label-alt)" }} />
                중간에 내려갔던 구간
              </h2>
              <p className="w-body-2 mt-2" style={{ color: "var(--w-label)" }}>{c.low}</p>
            </section>
          )}

          <div
            className="mt-10 flex flex-col gap-4 rounded-2xl px-6 py-7 sm:flex-row sm:items-center sm:justify-between"
            style={{ background: "var(--w-label-strong)" }}
          >
            <div className="min-w-0">
              <p className="w-title-2" style={{ color: "#fff" }}>우리 매장은 어디부터 보면 될까요?</p>
              <p className="w-body-2 mt-1.5" style={{ color: "var(--w-label-disable)" }}>
                상담 비용 없음 · 카카오톡 24시간 접수
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/contact" className="w-btn w-btn-primary">
                무료 진단 신청
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <a
                href="https://pf.kakao.com/_MuUkG/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-yellow-400 px-5 text-sm font-bold text-gray-900"
              >
                <MessageCircle size={14} />
                카카오 상담
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
