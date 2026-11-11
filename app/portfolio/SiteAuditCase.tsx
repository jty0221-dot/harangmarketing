import { ScanSearch } from "lucide-react";
import SiteAuditCaseCard from "../components/SiteAuditCaseCard";
import { SITE_AUDIT_CASES } from "../lib/site-audit-cases";

/* 홈페이지 분석 · 개선안 사례 구역 · 2026-10-23 (금) 대표 지시 · 루미 배정
   하랑이 만든 사이트가 아니라 공개 사이트를 진단하고 같은 흐름의 새 틀을 짠 기록이다.
   동의가 확인된 사례(consent)만 오고, 하나도 없으면 구역을 그리지 않는다. */

export default function SiteAuditCase() {
  if (SITE_AUDIT_CASES.length === 0) return null;
  return (
    <section className="mt-16">
      <div className="mb-6">
        <span className="w-chip w-chip-blue">
          <ScanSearch size={12} strokeWidth={2.5} />
          SITE AUDIT
        </span>
        <h2 className="w-heading-2 mt-3" style={{ color: "var(--w-label-strong)" }}>
          홈페이지 분석 · 개선안 사례
        </h2>
        <p className="w-body-2 mt-3 max-w-[680px]" style={{ color: "var(--w-label-alt)" }}>
          지금 쓰고 계신 홈페이지를 휴대폰에서 직접 재 보고, 같은 화면 흐름을 하랑 틀로 새로 짜서 나란히 비교했습니다.
          하랑이 만든 사이트가 아니라 분석과 개선안을 드린 사례이고, 고객 동의를 받아 상호와 지역을 가린 채로 싣습니다.
        </p>
      </div>
      <div className="space-y-4">
        {SITE_AUDIT_CASES.map((c) => (
          <SiteAuditCaseCard key={c.slug} c={c} />
        ))}
      </div>
    </section>
  );
}
