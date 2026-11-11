import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Quote, TrendingDown } from "lucide-react";
import RankChart from "../RankChart";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbLd, webPageLd, ogImage, SITE } from "../../../lib/seo";
import { RESULT_CASES, getResultCase, leadFigure, otherCases, serviceLinks, visibleQuoteItems } from "../../../lib/result-cases";

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

function Card({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="w-card mt-4 p-5 md:p-6">
      <h2 className="flex items-center gap-2 w-title-3" style={{ color: "var(--w-label-strong)" }}>
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function ResultCasePage({ params }: { params: Params }) {
  const c = load((await params).id);
  const path = `/portfolio/cases/${c.id}`;
  // 큰 숫자 줄 : headline 이 없는 사례는 결과 표 앞 세 줄을 그대로 올린다 (같은 값 · 새 숫자를 만들지 않는다)
  const figures = c.headline?.length
    ? c.headline.slice(0, 3)
    : c.results.slice(0, 3).map((r) => ({ value: r.before ? `${r.before} → ${r.after}` : r.after, label: r.label }));
  const rankChart = c.series?.every((s) => s.unit === "위") ?? false;
  const links = serviceLinks(c.services);
  const quote = visibleQuoteItems(c);
  const others = otherCases(c);

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
            {c.scope && c.scope.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="진행 범위">
                {c.scope.map((s) => (
                  <li key={s} className="w-chip w-chip-neutral">{s}</li>
                ))}
              </ul>
            )}
          </header>

          {figures.length > 0 && (
            <section aria-label="핵심 숫자" className="w-card mt-8 grid grid-cols-1 sm:grid-cols-3">
              {figures.map((h, i) => (
                <div
                  key={h.label}
                  className={`min-w-0 px-5 py-5 md:px-6 ${i > 0 ? "border-t sm:border-l sm:border-t-0" : ""}`}
                  style={{ borderColor: "var(--w-line)" }}
                >
                  <p className="w-heading-2 w-num" style={{ color: "var(--w-primary)" }}>{h.value}</p>
                  <p className="w-label-1 mt-1" style={{ color: "var(--w-label-alt)" }}>{h.label}</p>
                </div>
              ))}
            </section>
          )}

          {c.series && c.series.length > 0 && (
            <Card title={rankChart ? "날짜별 순위" : "날짜별 기록"}>
              {rankChart && (
                <p className="w-caption-1 mt-1" style={{ color: "var(--w-label-alt)" }}>위로 갈수록 높은 순위입니다.</p>
              )}
              <RankChart series={c.series} />
              <p className="w-caption-1 mt-2" style={{ color: "var(--w-label-assistive)" }}>
                {c.series_note}
                {rankChart && <> 그래프에는 며칠 간격으로 골라 점을 찍었습니다.</>}
              </p>
            </Card>
          )}

          {c.beforeAfter && c.beforeAfter.length > 0 && (
            <Card title="전후 비교">
              <ul className="mt-4 space-y-6">
                {c.beforeAfter.map((b) => (
                  <li key={b.before}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
                      {[
                        ["전", b.beforeDate, b.before],
                        ["후", b.afterDate, b.after],
                      ].map(([k, when, src]) => (
                        <figure key={k} className="min-w-0 md:max-w-[360px]">
                          <p className="w-caption-1 font-semibold" style={{ color: k === "후" ? "var(--w-primary)" : "var(--w-label-alt)" }}>
                            {k} · {when}
                          </p>
                          {/* 누르면 원본 크기로 연다 (끌어서 비교하는 장치는 폰에서 헷갈려 넣지 않는다) */}
                          <a href={src} target="_blank" rel="noopener" className="mt-1.5 block" aria-label={`${b.caption} ${k} 사진 크게 보기`}>
                            {/* eslint-disable-next-line @next/next/no-img-element -- 캡처 비율이 제각각이라 원본 비율 그대로 */}
                            <img src={src} alt={`${b.caption} (${k})`} loading="lazy" className="w-full rounded-lg border" style={{ borderColor: "var(--w-line)" }} />
                          </a>
                        </figure>
                      ))}
                    </div>
                    <p className="w-body-2 mt-2" style={{ color: "var(--w-label)" }}>{b.caption}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* 견적 항목이 있으면 한 일 목록은 그 구역과 겹쳐 시작할 때 상태만 남긴다 */}
          <Card title={quote.length > 0 ? "시작할 때 상태" : "시작할 때 상태와 한 일"}>
            <p className="w-body-2 mt-2" style={{ color: "var(--w-label)" }}>{c.before}</p>
            {quote.length === 0 && (
              <ul className="mt-4 space-y-2">
                {c.did.map((d) => (
                  <li key={d} className="flex gap-2 w-body-2" style={{ color: "var(--w-label)" }}>
                    <Check size={16} className="mt-1 shrink-0" style={{ color: "var(--w-primary)" }} strokeWidth={2.5} />
                    <span className="min-w-0">{d}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {c.diagnosis && c.diagnosis.length > 0 && (
            <Card title="무엇이 문제였고 무엇을 바꿨나">
              <ol className="mt-2">
                {c.diagnosis.map((g, i) => (
                  <li
                    key={g.problem}
                    className={`grid grid-cols-1 gap-2 py-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start md:gap-3 ${i > 0 ? "border-t" : ""}`}
                    style={{ borderColor: "var(--w-line)" }}
                  >
                    {[
                      ["문제", g.problem],
                      ["한 일", g.action],
                      ["달라진 것", g.result],
                    ].map(([k, v], j) => (
                      <div key={k} className="contents">
                        {j > 0 && (
                          <ArrowRight size={16} aria-hidden="true" className="mt-0.5 hidden md:block" style={{ color: "var(--w-label-assistive)" }} />
                        )}
                        <div className="min-w-0">
                          <p className="w-caption-1 font-semibold" style={{ color: j === 2 ? "var(--w-primary)" : "var(--w-label-assistive)" }}>{k}</p>
                          <p className="w-body-2 mt-0.5" style={{ color: j === 2 ? "var(--w-label-strong)" : "var(--w-label)" }}>{v}</p>
                        </div>
                      </div>
                    ))}
                  </li>
                ))}
              </ol>
            </Card>
          )}

          {quote.length > 0 && (
            <section className="mt-10 mb-6">
              <h2 className="w-title-2" style={{ color: "var(--w-label-strong)" }}>견적서 항목별로 한 일</h2>
              <p className="w-body-2 mt-1" style={{ color: "var(--w-label-alt)" }}>견적서에 넣은 항목을 그대로 옮겼습니다. 금액은 뺐습니다</p>
              <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {quote.map((q) => (
                  <li key={q.item} className="w-card flex min-w-0 flex-col p-5 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="w-title-3 min-w-0" style={{ color: "var(--w-label-strong)" }}>{q.item}</h3>
                      {q.qty && <span className="w-chip w-chip-neutral shrink-0">{q.qty}</span>}
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {q.done.map((d) => (
                        <li key={d} className="flex gap-2 w-body-2" style={{ color: "var(--w-label)" }}>
                          <Check size={16} className="mt-1 shrink-0" style={{ color: "var(--w-primary)" }} strokeWidth={2.5} />
                          <span className="min-w-0">{d}</span>
                        </li>
                      ))}
                    </ul>
                    {q.result && (
                      <p className="w-label-1 w-num mt-auto pt-4 font-semibold" style={{ color: "var(--w-primary)" }}>{q.result}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {c.timeline && c.timeline.length > 0 && (
            <Card title="진행 순서">
              <ol className="mt-4">
                {c.timeline.map((t, i, all) => (
                  <li key={`${t.when}-${i}`} className="relative flex gap-4 pb-5 last:pb-0">
                    {i < all.length - 1 && (
                      <span aria-hidden="true" className="absolute left-[5px] top-4 bottom-0 w-px" style={{ background: "var(--w-line-strong)" }} />
                    )}
                    <span aria-hidden="true" className="relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full" style={{ background: "var(--w-primary)" }} />
                    <div className="min-w-0">
                      <p className="w-label-1 w-num font-semibold" style={{ color: "var(--w-label-strong)" }}>{t.when}</p>
                      <p className="w-body-2 mt-0.5" style={{ color: "var(--w-label)" }}>{t.what}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          )}

          <Card title="전후 숫자">
            {/* PC 는 표, 폰은 줄 목록 */}
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
            <ul className="mt-2 md:hidden">
              {c.results.map((r, i) => (
                <li key={r.label} className={`py-3 ${i > 0 ? "border-t" : ""}`} style={{ borderColor: "var(--w-line)" }}>
                  <p className="w-label-1 font-semibold" style={{ color: "var(--w-label-strong)" }}>{r.label}</p>
                  <p className="w-body-2 w-num mt-1" style={{ color: "var(--w-label-alt)" }}>
                    {r.before && (
                      <>
                        {r.before}
                        <ArrowRight size={14} className="mx-1.5 inline" />
                      </>
                    )}
                    <span className="font-semibold" style={{ color: "var(--w-primary)" }}>{r.after}</span>
                  </p>
                  {r.note && <p className="w-caption-1 mt-1" style={{ color: "var(--w-label-alt)" }}>{r.note}</p>}
                </li>
              ))}
            </ul>
            <p className="w-caption-1 mt-4" style={{ color: "var(--w-label-alt)" }}>
              상호는 가리고 지역은 넓게 적었습니다. 숫자는 고객께 드린 보고서의 값 그대로입니다. 결과는 업종과 지역에 따라 다릅니다
            </p>
          </Card>

          {c.low && (
            <Card title="중간에 내려갔던 구간" icon={<TrendingDown size={18} style={{ color: "var(--w-label-alt)" }} />}>
              <p className="w-body-2 mt-2" style={{ color: "var(--w-label)" }}>{c.low}</p>
            </Card>
          )}

          {c.voice && (
            <figure className="w-card mt-4 p-5 md:p-6">
              <Quote size={20} aria-hidden="true" style={{ color: "var(--w-primary)" }} />
              <blockquote className="w-body-1 mt-2" style={{ color: "var(--w-label-strong)" }}>{c.voice.text}</blockquote>
              <figcaption className="w-caption-1 mt-3" style={{ color: "var(--w-label-alt)" }}>{c.voice.who}</figcaption>
            </figure>
          )}

          {links.length > 0 && (
            <Card title="이 사례와 같은 일을 맡기려면">
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex min-h-11 items-center justify-between gap-2 rounded-xl border px-4 py-3 w-label-1 font-semibold"
                      style={{ borderColor: "var(--w-line-strong)", color: "var(--w-label-strong)" }}
                    >
                      {l.name} 안내
                      <ArrowRight size={16} style={{ color: "var(--w-primary)" }} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
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

          {others.length > 0 && (
            <section className="mt-12">
              <h2 className="w-title-2" style={{ color: "var(--w-label-strong)" }}>다른 성과 사례</h2>
              <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {others.map((o) => {
                  const f = leadFigure(o);
                  return (
                    <li key={o.id} className="min-w-0">
                      <Link href={`/portfolio/cases/${o.id}`} className="w-card flex h-full flex-col p-5 md:p-6">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="w-chip w-chip-neutral">{o.industry}</span>
                          <span className="w-caption-1" style={{ color: "var(--w-label-assistive)" }}>{o.period}</span>
                        </div>
                        <h3 className="w-title-3 mt-3" style={{ color: "var(--w-label-strong)" }}>{o.label}</h3>
                        {f && (
                          <>
                            <p className="w-title-1 w-num mt-3" style={{ color: "var(--w-primary)" }}>{f.value}</p>
                            <p className="w-caption-1 mt-0.5" style={{ color: "var(--w-label-alt)" }}>{f.label}</p>
                          </>
                        )}
                        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold" style={{ color: "var(--w-primary)" }}>
                          사례 보기
                          <ArrowRight size={14} />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
