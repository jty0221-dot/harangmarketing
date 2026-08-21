import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  TrendingUp,
  ArrowRight,
  ClipboardCheck,
  MessageCircle,
  Phone,
  FileText,
} from "lucide-react";
import { getPublishedReport } from "../../lib/reports";

/**
 * 클라이언트 진행 보고서 — 카카오 알림톡 버튼이 여는 페이지
 *
 * · 로그인 없이 코드로 연다. 코드가 곧 열쇠라서 검색엔진에는 절대 노출하지 않는다(noindex, nofollow).
 * · 대부분 카톡에서 휴대폰으로 열기 때문에 모바일 우선으로 짠다.
 * · 매 요청마다 DB 를 읽어야 하므로 캐시하지 않는다.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "진행 보고서 — 하랑마케팅",
  robots: { index: false, follow: false, nocache: true },
};

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const wd = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} (${wd})`;
}

export default async function ReportPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const report = await getPublishedReport(code);
  if (!report) notFound();

  const hasMetrics = report.metrics.length > 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--h-bg)" }}>
      {/* 상단 — 마케팅 네비게이션 없이 발신 주체만 밝힌다 */}
      <header className="bg-white border-b" style={{ borderColor: "var(--h-border)" }}>
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/harang-icon.svg" alt="" className="w-6 h-6" />
            <span className="text-[15px] font-black" style={{ color: "var(--h-navy)" }}>
              하랑마케팅
            </span>
          </Link>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            진행 보고서
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* 제목 */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-sm flex items-center justify-center shrink-0">
            <FileText size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-blue-600">{report.clientName} 대표님</p>
            <h1
              className="mt-0.5 text-xl md:text-2xl font-black leading-snug"
              style={{ color: "var(--h-navy)", letterSpacing: "-0.03em" }}
            >
              {report.title}
            </h1>
            {report.period && (
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] text-gray-500">
                <CalendarDays size={13} strokeWidth={2.5} />
                {report.period}
              </p>
            )}
          </div>
        </div>

        {/* 한 줄 요약 */}
        {report.summary && (
          <div
            className="mt-5 rounded-2xl p-4 md:p-5 bg-white shadow-sm border-l-4"
            style={{ borderColor: "var(--h-amber)" }}
          >
            <p className="text-[15px] md:text-base font-bold leading-relaxed" style={{ color: "var(--h-navy)" }}>
              {report.summary}
            </p>
          </div>
        )}

        {/* 지표 변화 */}
        {hasMetrics && (
          <section className="mt-6">
            <h2 className="flex items-center gap-2 text-[15px] font-black" style={{ color: "var(--h-navy)" }}>
              <TrendingUp size={16} className="text-blue-600" strokeWidth={2.5} />
              지표 변화
            </h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.metrics.map((m, i) => (
                <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-[13px] font-bold text-gray-500">{m.label}</p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-[15px] font-bold text-gray-400 line-through decoration-gray-300">
                      {m.before || "-"}
                    </span>
                    <ArrowRight size={14} className="text-gray-300 shrink-0" strokeWidth={2.5} />
                    <span className="text-lg font-black text-blue-600">{m.after || "-"}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 본문 */}
        {report.body && (
          <section className="mt-6">
            <div
              className="report-body rounded-2xl bg-white p-4 md:p-6 shadow-sm"
              dangerouslySetInnerHTML={{ __html: report.body }}
            />
          </section>
        )}

        {/* 요청사항 */}
        {report.requests && (
          <section className="mt-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 md:p-5">
              <h2 className="flex items-center gap-2 text-[15px] font-black text-amber-900">
                <ClipboardCheck size={16} strokeWidth={2.5} />
                대표님께 요청드릴 것
              </h2>
              <p className="mt-2 text-[14px] md:text-[15px] leading-relaxed text-amber-900 whitespace-pre-line">
                {report.requests}
              </p>
            </div>
          </section>
        )}

        {/* 문의 */}
        <section className="mt-8 rounded-2xl bg-white p-4 md:p-5 shadow-sm">
          <p className="text-[13px] text-gray-500">
            궁금하신 점이나 수정이 필요한 부분은 편하게 알려주세요.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="tel:01090543788"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-gray-800"
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
          </div>
        </section>

        <p className="mt-6 text-center text-[11px] text-gray-400">
          하랑마케팅 · 전태영 · {fmtDate(report.publishedAt || report.createdAt)} 작성
          <br />이 페이지는 {report.clientName} 대표님께만 전달된 링크입니다.
        </p>
      </main>
    </div>
  );
}
