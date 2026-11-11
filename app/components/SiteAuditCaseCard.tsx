import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { auditDate, type SiteAuditCase } from "../lib/site-audit-cases";

/* 홈페이지 분석 · 개선안 사례 카드 · /portfolio 와 /services/homepage/tax 가 같이 쓴다.
   숫자와 문장은 content/site-audit-cases.json 한 곳에서 온다. 하랑 제작이 아닌 사례라 제작 · 리뉴얼 낱말을 쓰지 않는다. */

export default function SiteAuditCaseCard({ c, showService = true }: { c: SiteAuditCase; showService?: boolean }) {
  const rows: { label: string; before: string; after: string }[] = [
    { label: "라이트하우스 성능", before: `${c.before.performance}점`, after: `${c.after.performance}점` },
    { label: "첫 화면 큰 요소", before: c.before.lcp, after: c.after.lcp },
    { label: "한 번 열 때 받는 양", before: c.before.weight, after: c.after.weight },
    { label: "쪽 수", before: c.before.pages, after: c.after.pages },
  ];

  return (
    <div className="w-card min-w-0 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="w-title-3" style={{ color: "var(--w-label-strong)" }}>
          {c.title}
        </h3>
        {[c.industry, `지역 ${c.region}`, c.kind].map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-lg px-2 py-1 text-[11px] font-medium"
            style={{ background: "var(--w-bg-alt)", color: "var(--w-label-alt)" }}
          >
            {t}
          </span>
        ))}
      </div>
      <p className="w-caption-1 mt-2" style={{ color: "var(--w-label-alt)" }}>
        한 일 · {c.work.join(" · ")} · {auditDate(c.measuredAt)} 측정
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {([
          ["before", c.before.label, "고객 동의를 받아 싣습니다. 상호와 지역은 가렸습니다"],
          ["after", c.after.label, "시안 화면 · 업체명과 사진은 가상"],
        ] as const).map(([key, label, note]) => {
          const img = c.images[key];
          return (
            <figure key={key} className="min-w-0">
              <p className="w-label-2 mb-2 font-semibold" style={{ color: key === "after" ? "var(--w-primary)" : "var(--w-label-strong)" }}>
                {label}
              </p>
              <div className="overflow-hidden rounded-xl" style={{ border: "1px solid var(--w-line)", background: "var(--w-bg-alt)" }}>
                <Image src={img.src} alt={img.alt} width={img.w} height={img.h} sizes="(max-width: 768px) 100vw, 520px" className="h-auto w-full" />
              </div>
              <figcaption className="w-caption-1 mt-2" style={{ color: "var(--w-label-alt)" }}>
                {note}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl" style={{ border: "1px solid var(--w-line)" }}>
        <div className="grid grid-cols-[1.2fr_1fr_1fr] text-[12px] md:text-[13px]" style={{ background: "var(--w-bg-alt)", color: "var(--w-label-alt)" }}>
          <span className="px-3 py-2">항목</span>
          <span className="px-3 py-2">{c.before.label}</span>
          <span className="px-3 py-2">{c.after.label}</span>
        </div>
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[1.2fr_1fr_1fr] text-sm" style={{ borderTop: "1px solid var(--w-line)" }}>
            <span className="min-w-0 px-3 py-2.5" style={{ color: "var(--w-label-alt)" }}>{r.label}</span>
            <span className="w-num px-3 py-2.5" style={{ color: "var(--w-label-strong)" }}>{r.before}</span>
            <span className="w-num px-3 py-2.5 font-semibold" style={{ color: "var(--w-primary)" }}>{r.after}</span>
          </div>
        ))}
      </div>
      <p className="w-caption-1 mt-2" style={{ color: "var(--w-label-alt)" }}>
        {c.afterNote}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="min-w-0 rounded-xl p-4" style={{ background: "var(--w-bg-alt)" }}>
          <p className="w-label-1 font-semibold" style={{ color: "var(--w-label-strong)" }}>지금 사이트의 좋은 점</p>
          <ul className="mt-2 space-y-2">
            {c.good.map((g) => (
              <li key={g} className="flex gap-2 w-body-2" style={{ color: "var(--w-label-alt)" }}>
                <CheckCircle2 size={16} strokeWidth={2.5} className="mt-0.5 shrink-0" style={{ color: "var(--w-primary)" }} />
                <span className="min-w-0">{g}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 rounded-xl p-4" style={{ background: "var(--w-bg-alt)" }}>
          <p className="w-label-1 font-semibold" style={{ color: "var(--w-label-strong)" }}>하랑이 찾은 문제</p>
          <ul className="mt-2 space-y-2">
            {c.issues.map((g) => (
              <li key={g} className="flex gap-2 w-body-2" style={{ color: "var(--w-label-alt)" }}>
                <AlertCircle size={16} strokeWidth={2.5} className="mt-0.5 shrink-0" style={{ color: "var(--w-label-assistive)" }} />
                <span className="min-w-0">{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {c.demo && (
          <a href={c.demo} target="_blank" rel="noopener noreferrer" className="w-btn w-btn-secondary min-h-[44px]">
            새 틀 시안 보기
            <ExternalLink size={14} strokeWidth={2.5} />
          </a>
        )}
        {showService && c.service && (
          <Link href={c.service} className="w-btn w-btn-primary min-h-[44px]">
            세무사 홈페이지 알아보기
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        )}
      </div>
    </div>
  );
}
