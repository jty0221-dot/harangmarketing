"use client";

import { Printer } from "lucide-react";

/**
 * 보고서를 인쇄하거나 PDF 로 저장한다.
 * 사장님이 계약 근거로 남겨두거나 직원에게 보여줄 때 쓴다.
 * 이 버튼 하나 때문에 페이지 전체를 클라이언트 컴포넌트로 만들지 않으려고 따로 뺐다.
 */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-[13px] font-bold text-gray-600 transition-colors hover:bg-gray-50"
      style={{ borderColor: "var(--h-border)" }}
    >
      <Printer size={14} strokeWidth={2.5} />
      인쇄 · PDF 저장
    </button>
  );
}
