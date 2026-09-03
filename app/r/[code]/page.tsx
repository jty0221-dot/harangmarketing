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
 *
 * 대부분은 커지는 게 좋지만(방문자·리뷰·클릭), 두 부류는 작아지는 게 좋다.
 *   · 순위 — 3위가 7위보다 낫다
 *   · 단가·이탈 — 클릭당 단가 423원이 733원보다 낫다
 * 라벨에서 이 둘을 걸러낸다. 못 걸러내면 좋아진 걸 주황으로 표시해 대표님이 오해하신다.
 *
 * 광고비·예산처럼 '많이 쓴 게 좋은지 나쁜지' 가 맥락에 달린 값은 여기서 판단할 수 없다.
 * 그런 값은 지표 카드에 넣지 말고 본문에서 설명한다.
 */
function trendOf(m: ReportMetric): "up" | "down" | "flat" {
  const num = (v: string) => {
    const n = Number(String(v).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : null;
  };
  const a = num(m.before);
  const b = num(m.after);
  if (a === null || b === null || a === b) return "flat";
  const lowerIsBetter = /순위|위$|랭킹|rank|단가|cpc|cpa|이탈|취소|노쇼|반품/i.test(m.label);
  return (lowerIsBetter ? b < a : b > a) ? "up" : "down";
}

/**
 * 표에 열 이름을 심는다 — 좁은 화면에서 표를 카드로 펼치기 위한 준비다.
 *
 * 왜 필요한가
 *   보고서 본문은 사장님이 쓴 HTML 을 그대로 렌더한다. 데스크톱에서는 표가 표로 읽히지만
 *   휴대폰(대부분 여기서 연다)에서는 열이 네댓 개만 돼도 페이지 전체가 옆으로 밀린다.
 *   실측 — 7열짜리 견적 표 하나가 375px 화면에서 문서 폭을 505px 로 늘렸다(130px 이 화면 밖).
 *
 *   가로 스크롤로 가두는 방법도 있지만, 그러면 사장님이 오른쪽에 뭐가 더 있는지 모른 채 지나간다.
 *   그래서 한 줄을 카드 한 장으로 눕히고, 각 칸 앞에 그 칸이 무슨 열인지 붙인다.
 *   CSS 는 `열 이름` 을 모르므로 여기서 `data-l` 로 심어 준다(globals.css 의 ::before 가 읽는다).
 *
 * 무엇을 하는가
 *   1) 첫 줄을 머리줄로 보고 `data-head` 를 붙인다 — 본문 마크다운 변환기가 <thead>·<th> 를
 *      만들어 주지 않아서(실측 `hasThead: false`) 첫 줄이 그냥 데이터로 렌더되고 있었다.
 *   2) 둘째 줄부터 각 칸에 `data-l="열 이름"` 을 심는다.
 *   3) 빈 칸은 `data-x` 로 표시한다 — 모바일 카드에서 `열 이름: (빈칸)` 줄이 남으면 지저분하다.
 *   4) 표에 `data-cards` 를 붙인다. 이걸 못 붙인 표는 CSS 가 가로 스크롤로 가둔다.
 *
 * 렌더할 때마다 돌기 때문에 이미 DB 에 저장된 지난 보고서까지 소급해서 좋아진다.
 * 값을 고치지 않고 속성만 더한다 — 표 안의 숫자·글자는 한 글자도 건드리지 않는다.
 */
/**
 * 표시(`H-0102` · `측정 불가`) 안의 공백을 줄바꿈 없는 공백으로 바꾼다.
 *
 * 휴대폰 화면이 좁아 표시가 줄 끝에 걸리면 공백 자리에서 갈라지는데,
 * 배경을 깐 상자라 반으로 잘린 회색 조각 두 개로 보인다.
 * 공백을 붙여 두면 표시가 통째로 다음 줄로 내려간다.
 */
function withUnbreakableCode(html: string): string {
  return html.replace(/<code([^>]*)>([\s\S]*?)<\/code>/gi, (whole, attrs: string, body: string) => {
    if (/<[a-z]/i.test(body)) return whole; // 태그가 든 코드 블록은 손대지 않는다

    // 붙임표도 줄바꿈 자리다 — `H-0102` 가 `H-` / `0102` 로 갈라졌다.
    // 짧은 표시는 통째로 안 끊기게 표를 달아 두고(CSS 가 nowrap 으로 받는다),
    // 긴 경로(`sec/Q-0187-oauth-state-cron-failclose`)는 그대로 접히게 둔다.
    const nb = body.length <= 24 ? ' data-nb="1"' : "";
    return `<code${attrs}${nb}>${body.replace(/ /g, "\u00a0")}</code>`;
  });
}

function withColumnLabels(html: string): string {
  const text = (frag: string) =>
    frag.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
  const attr = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  return html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (whole, tableAttrs: string, inner: string) => {
    if (/data-cards/i.test(tableAttrs)) return whole;

    const rows = inner.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
    const headRow = rows[0];
    if (!headRow || rows.length < 2) return whole; // 머리줄 + 최소 한 줄이 있어야 카드가 성립한다

    const heads = (headRow.match(/<(t[hd])[^>]*>[\s\S]*?<\/\1>/gi) || []).map(text);
    if (heads.length < 2) return whole; // 한 칸짜리는 표가 아니라 상자다

    let r = -1;
    const out = inner.replace(/<tr([^>]*)>([\s\S]*?)<\/tr>/gi, (rowWhole, rowAttrs: string, cells: string) => {
      r += 1;
      if (r === 0) return `<tr${rowAttrs} data-head="1">${cells}</tr>`;

      let c = -1;
      const newCells = cells.replace(
        /<(t[hd])([^>]*)>([\s\S]*?)<\/\1>/gi,
        (cellWhole, tag: string, cellAttrs: string, body: string) => {
          c += 1;
          const label = heads[c] || "";
          const value = text(body);
          const empty = value === "";
          // 값이 길면 이름 옆에 세우지 않는다 — 휴대폰에서 칸 너비가 절반뿐이라
          // 문장이 여섯 줄로 접히고 오른쪽 정렬이라 줄 시작이 들쭉날쭉해진다.
          // 긴 값은 이름을 윗줄에 두고 아래로 폭을 다 쓴다.
          const long = value.length > 16;
          const add =
            (label ? ` data-l="${attr(label)}"` : "") +
            (empty ? ' data-x="1"' : "") +
            (long ? ' data-long="1"' : "");
          // 칸 내용을 한 겹 싼다 — 휴대폰에서 칸 하나를 `이름 : 값` 두 쪽으로 눕히는데,
          // 싸지 않으면 칸 안의 <strong> · <code> 하나하나가 저마다 한 쪽이 돼 옆으로 밀린다.
          // 실측 — 문장이 든 칸에서 요소 셋이 화면(375px) 밖 389~416px 로 나가 있었다.
          // 데스크톱에서는 span 한 겹일 뿐이라 보이는 것이 달라지지 않는다.
          return `<${tag}${cellAttrs}${add}><span data-v="1">${body}</span></${tag}>`;
        },
      );
      return `<tr${rowAttrs}>${newCells}</tr>`;
    });

    return `<table${tableAttrs} data-cards="1">${out}</table>`;
  });
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
            // 휴대폰에서는 한 줄에 하나씩 — 2열이면 칸이 155px 이라
            // `2026-08-24 ~ 2026-08-30` 이 `2026-08-` 에서 잘려 두 줄이 됐다
            className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 border-t pt-5 sm:grid-cols-3"
            style={{ borderColor: "rgba(255,255,255,.16)" }}
          >
            {report.period && <Meta label="보고 기간" value={report.period} />}
            <Meta label="작성일" value={written} />
            <Meta label="담당" value="하랑마케팅" />
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
              dangerouslySetInnerHTML={{ __html: withColumnLabels(withUnbreakableCode(report.body)) }}
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
              href="tel:01075419054"
              className="w-label1 inline-flex items-center gap-1.5 px-4 py-3 font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--w-primary)", borderRadius: "var(--w-radius)" }}
            >
              <Phone size={15} strokeWidth={2.5} />
              010-7541-9054
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
          하랑마케팅 · {written} 작성
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
