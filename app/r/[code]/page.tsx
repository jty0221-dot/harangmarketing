import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardCheck,
  MessageCircle,
  Phone,
} from "lucide-react";
import { getPublishedReport, type ReportMetric } from "../../lib/reports";
import PrintButton from "./PrintButton";

/**
 * 클라이언트 진행 보고서 — 카카오 알림톡 버튼이 여는 페이지
 *
 * 성격
 *   웹페이지라기보다 '문서'다. 사장님이 열어서 읽고, 필요하면 저장하거나 인쇄한다.
 *   그래서 마케팅 요소를 전부 걷어내고(SiteChrome 에서 /r/ 제외) 표지 → 지표 → 본문 → 요청 순으로만 쌓는다.
 *
 * 규칙
 *   · 코드가 곧 열쇠라서 검색엔진에는 절대 노출하지 않는다(noindex, nofollow).
 *   · 대부분 카톡에서 휴대폰으로 연다. 모바일 우선.
 *   · 매 요청마다 DB 를 읽으므로 캐시하지 않는다.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // 루트 레이아웃이 "%s | 하랑마케팅" 로 감싼다. 여기에 상호를 또 넣으면 중복된다.
  // 업체명은 넣지 않는다 — 링크를 받은 사람의 브라우저 기록·탭에 남기지 않기 위해서다.
  title: "진행 보고서",
  robots: { index: false, follow: false, nocache: true },
};

const WD = ["일", "월", "화", "수", "목", "금", "토"];

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} (${WD[d.getDay()]})`;
}

/**
 * 숫자가 좋아졌는지 판단해 색을 정한다.
 * 순위는 작아지는 게 좋고(3위 < 7위), 방문자·리뷰는 커지는 게 좋다. 라벨로 구분한다.
 */
function trendOf(m: ReportMetric): "up" | "down" | "flat" {
  const num = (v: string) => {
    const n = Number(String(v).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : null;
  };
  const a = num(m.before);
  const b = num(m.after);
  if (a === null || b === null || a === b) return "flat";
  const lowerIsBetter = /순위|위$|랭킹|rank/i.test(m.label);
  const improved = lowerIsBetter ? b < a : b > a;
  return improved ? "up" : "down";
}

export default async function ReportPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const report = await getPublishedReport(code);
  if (!report) notFound();

  const written = fmtDate(report.publishedAt || report.createdAt);

  return (
    <div className="min-h-screen" style={{ background: "var(--w-bg-alt)" }}>
      {/* ── 표지 ── 문서처럼 보이도록 상단을 하나의 띠로 잡는다 */}
      <header
        className="print:bg-white"
        style={{ background: "linear-gradient(155deg, var(--w-blue-20) 0%, var(--w-blue-30) 55%, var(--w-blue-40) 100%)" }}
      >
        <div className="mx-auto w-full max-w-3xl px-5 py-7 md:px-8 md:py-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src="/harang-icon.svg" alt="" className="h-5 w-5 brightness-0 invert" />
              <span className="text-[13px] font-black tracking-tight text-white">하랑마케팅</span>
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/70 ring-1 ring-white/15">
              진행 보고서
            </span>
          </div>

          <p className="w-label2 mt-6 font-bold" style={{ color: "var(--w-blue-90)" }}>{report.clientName} 대표님</p>
          <h1
            className="w-display3 mt-1 text-white"
            style={{ fontSize: "clamp(24px, 6vw, var(--w-display3))" }}
          >
            {report.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-white/15 pt-4 text-[12px] text-white/60">
            {report.period && (
              <span>
                <span className="text-white/40">보고 기간</span>{" "}
                <span className="font-semibold text-white/85">{report.period}</span>
              </span>
            )}
            <span>
              <span className="text-white/40">작성</span>{" "}
              <span className="font-semibold text-white/85">{written}</span>
            </span>
            <span>
              <span className="text-white/40">담당</span>{" "}
              <span className="font-semibold text-white/85">전태영</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pb-12 md:px-8">
        {/* ── 한 줄 요약 ── 표지와 본문 사이에 걸치게 올려 시선을 먼저 잡는다 */}
        {report.summary && (
          <div className="-mt-5 rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(15,32,68,0.10)] md:-mt-6 md:p-6">
            <p
              className="w-headline1 font-bold"
              style={{ color: "var(--w-label-strong)" }}
            >
              {report.summary}
            </p>
          </div>
        )}

        {/* ── 지표 ── */}
        {report.metrics.length > 0 && (
          <section className="mt-8">
            <SectionTitle>지표 변화</SectionTitle>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {report.metrics.map((m, i) => {
                const trend = trendOf(m);
                const tone =
                  trend === "up" ? "var(--w-primary)" : trend === "down" ? "var(--w-cautionary)" : "var(--w-label-strong)";
                return (
                  <div
                    key={i}
                    className="rounded-2xl border p-4 md:p-5"
                    style={{ borderColor: "var(--w-line-strong)", background: "var(--w-bg-elevated)" }}
                  >
                    <p className="w-caption1 font-bold" style={{ color: "var(--w-label-alt)" }}>{m.label}</p>
                    <div className="mt-2.5 flex items-baseline gap-2">
                      {m.before && (
                        <>
                          <span className="w-label1 font-semibold" style={{ color: "var(--w-label-assistive)" }}>{m.before}</span>
                          <ArrowRight size={13} className="shrink-0 text-gray-300" strokeWidth={2.5} />
                        </>
                      )}
                      <span
                        className="font-black leading-none"
                        style={{ color: tone, fontSize: "var(--w-heading1)", letterSpacing: "var(--w-tracking)" }}
                      >
                        {m.after || m.before}
                      </span>
                      {trend === "up" && (
                        <ArrowUpRight size={16} className="shrink-0 text-blue-600" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 본문 ── */}
        {report.body && (
          <section className="mt-8">
            <div
              className="report-body rounded-2xl border p-5 md:p-7"
              style={{ borderColor: "var(--w-line-strong)", background: "var(--w-bg-elevated)" }}
              dangerouslySetInnerHTML={{ __html: report.body }}
            />
          </section>
        )}

        {/* ── 요청사항 ── */}
        {report.requests && (
          <section className="mt-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 md:p-6">
              <h2 className="flex items-center gap-2 text-[14px] font-black text-amber-900">
                <ClipboardCheck size={15} strokeWidth={2.5} />
                대표님께 요청드릴 것
              </h2>
              <p className="mt-2.5 whitespace-pre-line text-[14px] leading-[1.75] text-amber-950 md:text-[15px]">
                {report.requests}
              </p>
            </div>
          </section>
        )}

        {/* ── 마무리 ── */}
        <section
          className="mt-8 rounded-2xl border p-5 md:p-6 print:hidden"
          style={{ borderColor: "var(--w-line-strong)", background: "var(--w-bg-elevated)" }}
        >
          <p className="w-label2" style={{ color: "var(--w-label-alt)" }}>
            궁금하신 점이나 수정이 필요한 부분은 편하게 알려주세요. 바로 반영하겠습니다.
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            <a
              href="tel:01090543788"
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--w-primary)" }}
            >
              <Phone size={14} strokeWidth={2.5} />
              010-9054-3788
            </a>
            <a
              href="https://pf.kakao.com/_MuUkG/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-[13px] font-bold text-amber-950 transition-colors hover:bg-amber-300"
            >
              <MessageCircle size={14} strokeWidth={2.5} />
              카카오톡 문의
            </a>
            <PrintButton />
          </div>
        </section>

        <p className="w-caption2 mt-7 text-center" style={{ color: "var(--w-label-assistive)" }}>
          하랑마케팅 · 전태영 · {written} 작성
          <br />이 페이지는 {report.clientName} 대표님께만 전달된 링크입니다.
        </p>
      </main>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="w-label1 flex items-center gap-2 font-black"
      style={{ color: "var(--w-label-strong)" }}
    >
      <span className="inline-block h-3.5 w-1 rounded-full" style={{ background: "var(--w-primary)" }} />
      {children}
    </h2>
  );
}
