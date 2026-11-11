"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export default function ShareLink() {
  const [copied, setCopied] = useState(false)
  const [fallback, setFallback] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href.split("?")[0])
      setCopied(true)
    } catch { setFallback(true) }
  }
  return <div><button onClick={copy} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[var(--w-line-strong)] bg-[var(--w-bg-elevated)] px-5 py-3 font-semibold text-[var(--w-label-strong)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--w-primary)]">{copied ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}{copied ? "링크를 복사했어요" : "카카오톡에 보낼 링크 복사"}</button><p role="status" className="mt-2 text-sm text-[var(--w-label-alt)]">{fallback ? "브라우저 주소를 길게 눌러 복사한 뒤 카카오톡에 붙여넣어 주세요." : copied ? "카카오톡 대화창에 붙여넣으면 이 자료실을 공유할 수 있어요." : "받는 분도 로그인 없이 자료를 열 수 있어요."}</p></div>
}

