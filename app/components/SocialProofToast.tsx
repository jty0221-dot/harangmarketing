"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, TrendingUp, MessageCircle } from "lucide-react";

/**
 * 우하단 알림 — **실제 데이터만** 띄운다.
 *
 * 예전에는 '경기 고양 카페 사장님 방금 문의' 같은 문구 10개를 코드에 박아두고
 * 돌려썼다. 실제 문의가 아니어서 방문자에게 사실이 아닌 걸 보여주는 셈이었다.
 * 지금은 /api/social-proof 가 주는 것만 쓴다:
 *   - 실제 상담 신청(업종·경과 시간만, 이름·연락처는 서버에서 아예 내보내지 않는다)
 *   - 실제 진행 사례(블로그에서 수집한 119건)
 * 받아온 게 없으면 아무것도 띄우지 않는다.
 */

interface ProofItem {
  kind: "inquiry" | "case";
  text: string;
  sub: string;
  href?: string;
}

const DISMISS_KEY = "harang_proof_dismissed";

export default function SocialProofToast() {
  const [items, setItems] = useState<ProofItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // SSR 깜빡임 방지
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    setDismissed(false);
    fetch("/api/social-proof")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok && Array.isArray(d.items) && d.items.length) setItems(d.items);
      })
      .catch(() => {});
  }, []);

  // 하나 보여주고 쉬고, 다음 것으로
  useEffect(() => {
    if (dismissed || items.length === 0) return;
    const show = () => {
      setVisible(true);
      timer.current = setTimeout(() => {
        setVisible(false);
        timer.current = setTimeout(() => {
          setIdx((p) => (p + 1) % items.length);
          show();
        }, 6000);
      }, 6000);
    };
    const first = setTimeout(show, 9000);
    return () => {
      clearTimeout(first);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [items, dismissed]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
    setVisible(false);
  };

  if (dismissed || items.length === 0) return null;

  const item = items[idx];
  const Icon = item.kind === "case" ? TrendingUp : MessageCircle;

  const body = (
    <div
      className="flex items-start gap-3 rounded-[14px] px-4 py-3"
      style={{
        background: "var(--w-bg)",
        border: "1px solid var(--w-line-strong)",
        boxShadow: "var(--w-shadow-md)",
      }}
    >
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{ background: "var(--w-blue-95)" }}
      >
        <Icon size={14} strokeWidth={2.5} style={{ color: "var(--w-primary)" }} />
      </span>
      <div className="min-w-0 pr-4">
        <p className="w-label-2 font-bold leading-snug" style={{ color: "var(--w-label-strong)" }}>
          {item.text}
        </p>
        <p className="w-caption-1 mt-0.5" style={{ color: "var(--w-label-assistive)" }}>
          {item.sub}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dismiss();
        }}
        aria-label="알림 닫기"
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-[var(--w-fill)]"
      >
        <X size={12} style={{ color: "var(--w-label-assistive)" }} />
      </button>
    </div>
  );

  return (
    <div
      className="fixed bottom-4 left-4 z-[9997] hidden w-[330px] sm:block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity .35s ease, transform .35s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="relative">
        {item.href ? (
          <Link href={item.href} className="block">
            {body}
          </Link>
        ) : (
          body
        )}
      </div>
    </div>
  );
}
