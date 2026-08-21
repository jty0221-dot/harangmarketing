import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, ArrowDownRight, MessageCircle, Phone } from "lucide-react";
import { getPublishedReport, type ReportMetric } from "../../lib/reports";
import PrintButton from "./PrintButton";

/**
 * 클라이언트 진행 보고서 — 카카오 알림톡 버튼이 여는 페이지
 *
 * 성격
 *   웹페이지가 아니라 '문서'다. 사장님이 카톡에서 열어 읽고, 필요하면 저장하거나 인쇄한다.
 *   그래서 영업 요소를 전부 걷어내고(SiteChrome 에서 /r/ 제외)
 *   표지 → 01 지표 → 02 진행 내용 → 03 요청 → 문의 순으로만 쌓는다.
 *   섹션에 번호를 붙이는 건 웹페이지가 아니라 보고서로 읽히게 하려는 것이다.
 *
 * 디자인
 *   Wanted Design System 토큰(--w-*)만 쓴다. Tailwind 색 클래스(text-gray-400 등)를 섞지 않는다.
 *   자세한 규칙: docs/design-system.md
 *
 * 규칙
 *   · 코드가 곧 열쇠라서 검색엔진에 절대 노출하지 않는다(noindex, nofollow).
 *   · 대부분 휴대폰으로 연다. 모바일 우선.
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
 * 숫자가 좋아졌는지 판단한다.
 * 순위는 작아지는 게 좋고(3위 < 7위), 방문자·리뷰는 커지는 게 좋다. 라벨로 방향을 구분한다.
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
  return (lowerIsBetter ? b < a : b > a) ? "up" : "down";
}

export default async function ReportPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const report = await getPublishedReport(code);
  if (!report) notFound();

  const written = fmtDate(report.publishedAt || report.createdAt);

  // 섹션 번호는 실제로 존재하는 블록에만 붙인다 (비어 있는 섹션 번호가 뜨면 문서가 이상해진다)
  const sections: string[] = [];
  if (report.metrics.length > 0) sections.push("metrics");
  if (report.body) sections.push("body");
  if (report.requests) sections.push("requests");
  const no = (key: string) => String(sections.indexOf(key) + 1).padStart(2, "0");

  return (
    <div className="min-h-screen" style={{ background: "var(--w-bg-alt)" }}>
      {/* ── 표지 ── */}
      <header
        className="print:bg-white"
        style={{
          background:
            "linear-gradient(152deg, var(--w-blue-20) 0%, var(--w-blue-30) 58%, var(--w-blue-40) 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-3xl px-5 pb-12 pt-6 md:px-8 md:pb-14 md:pt-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src="/harang-icon.svg" alt="" className="h-5 w-5 brightness-0 invert" />
              <span className="w-label2 font-black text-white">하랑마케팅</span>
            </div>
            <span
              className="w-caption2 rounded-full px-2.5 py-1 font-bold"
              style={{ background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.75)" }}
            >
              진행 보고서
            </span>
          </div>

          <p className="w-label2 mt-7 font-bold" style={{ color: "var(--w-blue-90)" }}>
            {report.clientName} 대표님
          </p>
          <h1
            className="mt-1.5 font-black text-white"
            style={{
              fontSize: "clamp(24px, 6.4vw, var(--w-display3))",
              lineHeight: 1.28,
              letterSpacing: "var(--w-tracking)",
            }}
          >
            {report.title}
          </h1>

          <dl
            className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t pt-5 sm:grid-cols-3"
            style={{ borderColor: "rgba(255,255,255,.16)" }}
          >
            {report.period && <Meta label="보고 기간" value={report.period} />}
            <Meta label="작성일" value={written} />
            <Meta label="담당" value="전태영" />
          </dl>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pb-14 md:px-8">
        {/* ── 한 줄 요약 ── 표지에 걸치게 올려 열자마자 결론이 보이게 한다 */}
        {report.summary && (
          <div
            className="-mt-7 border-l-4 p-5 md:-mt-8 md:p-6"
            style={{
              background: "var(--w-bg)",
              borderColor: "var(--w-primary)",
              borderRadius: "var(--w-radius-lg)",
              boxShadow: "var(--w-shadow-lg)",
            }}
          >
            <p className="w-caption1 font-bold" style={{ color: "var(--w-primary)" }}>
              이번 보고 핵심
            </p>
            <p
              className="w-headline1 mt-1.5 font-bold"
              style={{ color: "var(--w-label-strong)" }}
            >
              {report.summary}
            </p>
          </div>
        )}

        {/* ── 지표 ── */}
        {report.metrics.length > 0 && (
          <Section number={no("metrics")} title="지표 변화">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {report.metrics.map((m, i) => (
                <MetricCard key={i} metric={m} />
              ))}
            </div>
          </Section>
        )}

        {/* ── 본문 ── */}
        {report.body && (
          <Section number={no("body")} title="진행 내용">
            <div
              className="report-body p-5 md:p-7"
              style={{
                background: "var(--w-bg)",
                border: "1px solid var(--w-line)",
                borderRadius: "var(--w-radius-lg)",
              }}
              dangerouslySetInnerHTML={{ __html: report.body }}
            />
          </Section>
        )}

        {/* ── 요청사항 ── */}
        {report.requests && (
          <Section number={no("requests")} title="대표님께 요청드릴 것">
            <div
              className="p-5 md:p-6"
              style={{
                background: "var(--w-orange-99)",
                border: "1px solid var(--w-orange-90)",
                borderRadius: "var(--w-radius-lg)",
              }}
            >
              <p
                className="w-body2 whitespace-pre-line"
                style={{ color: "var(--w-orange-30)", lineHeight: 1.75 }}
              >
                {report.requests}
              </p>
            </div>
          </Section>
        )}

        {/* ── 문의 ── */}
        <section
          className="mt-10 p-5 md:p-6 print:hidden"
          style={{
            background: "var(--w-bg)",
            border: "1px solid var(--w-line)",
            borderRadius: "var(--w-radius-lg)",
          }}
        >
          <p className="w-label2" style={{ color: "var(--w-label-alt)" }}>
            궁금하신 점이나 수정이 필요한 부분은 편하게 알려주세요. 바로 반영하겠습니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="tel:01090543788"
              className="w-label1 inline-flex items-center gap-1.5 px-4 py-3 font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--w-primary)", borderRadius: "var(--w-radius)" }}
            >
              <Phone size={15} strokeWidth={2.5} />
              010-9054-3788
            </a>
            <a
              href="https://pf.kakao.com/_MuUkG/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="w-label1 inline-flex items-center gap-1.5 px-4 py-3 font-bold transition-opacity hover:opacity-90"
              style={{ background: "#FEE500", color: "#191600", borderRadius: "var(--w-radius)" }}
            >
              <MessageCircle size={15} strokeWidth={2.5} />
              카카오톡 문의
            </a>
            <PrintButton />
          </div>
        </section>

        <p
          className="w-caption2 mt-8 text-center"
          style={{ color: "var(--w-label-assistive)", lineHeight: 1.7 }}
        >
          하랑마케팅 · 전태영 · {written} 작성
          <br />이 페이지는 {report.clientName} 대표님께만 전달된 링크입니다.
        </p>
      </main>
    </div>
  );
}

/** 표지의 메타 항목 (보고 기간·작성일·담당) */
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="w-caption2" style={{ color: "rgba(255,255,255,.5)" }}>
        {label}
      </dt>
      <dd className="w-label2 mt-0.5 font-semibold" style={{ color: "rgba(255,255,255,.92)" }}>
        {value}
      </dd>
    </div>
  );
}

/** 번호가 붙은 문서 섹션 */
function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex items-baseline gap-2.5">
        <span
          className="w-caption1 font-black tabular-nums"
          style={{ color: "var(--w-primary)" }}
        >
          {number}
        </span>
        <h2
          className="w-headline2 font-black"
          style={{ color: "var(--w-label-strong)", letterSpacing: "var(--w-tracking)" }}
        >
          {title}
        </h2>
      </div>
      <div
        className="mb-4 mt-2.5 h-px w-full"
        style={{ background: "var(--w-line)" }}
      />
      {children}
    </section>
  );
}

/** 지표 카드 — 좋아졌으면 파랑, 나빠졌으면 주황. 방향은 trendOf 가 정한다 */
function MetricCard({ metric: m }: { metric: ReportMetric }) {
  const trend = trendOf(m);
  const tone =
    trend === "up"
      ? "var(--w-primary)"
      : trend === "down"
        ? "var(--w-cautionary)"
        : "var(--w-label-strong)";

  return (
    <div
      className="p-4 md:p-5"
      style={{
        background: "var(--w-bg)",
        border: "1px solid var(--w-line)",
        borderRadius: "var(--w-radius-lg)",
      }}
    >
      <p className="w-caption1 font-bold" style={{ color: "var(--w-label-alt)" }}>
        {m.label}
      </p>
      <div className="mt-3 flex items-baseline gap-2">
        {m.before && (
          <>
            <span className="w-label1 font-semibold" style={{ color: "var(--w-label-assistive)" }}>
              {m.before}
            </span>
            <ArrowRight
              size={13}
              strokeWidth={2.5}
              className="shrink-0 self-center"
              style={{ color: "var(--w-line-strong)" }}
            />
          </>
        )}
        <span
          className="font-black leading-none tabular-nums"
          style={{
            color: tone,
            fontSize: "var(--w-heading1)",
            letterSpacing: "var(--w-tracking)",
          }}
        >
          {m.after || m.before}
        </span>
        {trend === "up" && (
          <ArrowUpRight size={16} strokeWidth={3} className="shrink-0 self-center" style={{ color: tone }} />
        )}
        {trend === "down" && (
          <ArrowDownRight size={16} strokeWidth={3} className="shrink-0 self-center" style={{ color: tone }} />
        )}
      </div>
    </div>
  );
}
