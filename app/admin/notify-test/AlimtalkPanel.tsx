"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";

interface Status {
  ready: boolean;
  missing: string[];
  recipients: number;
}

interface Result {
  ok: boolean;
  skipped?: boolean;
  sent?: number;
  error?: string;
}

/**
 * 알림톡 (하랑 채널 이름 알림) 점검 칸 · 2026-10-03 (토) 대표 지시 「무조건 하게 해」
 * 값이 다 꽂혔는지와 빠진 환경변수 이름을 보여 주고, 시험 알림톡을 한 통 보낸다. 값은 보이지 않는다.
 */
export default function AlimtalkPanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [template, setTemplate] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notify-test/alimtalk", { cache: "no-store" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "알림톡 상태를 불러오지 못했습니다");
      setStatus(data.status as Status);
      setTemplate(typeof data.template === "string" ? data.template : "");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    // effect 안에서 바로 setState 하지 않도록 한 틱 미룬다
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  async function sendTest() {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/notify-test/alimtalk", { method: "POST", cache: "no-store" });
      const data = await res.json();
      if (data.status) setStatus(data.status as Status);
      setResult((data.result as Result) ?? { ok: false, error: data.error || "응답 없음" });
    } catch (e) {
      setResult({ ok: false, error: e instanceof Error ? e.message : String(e) });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mb-6 rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm p-4 md:p-6">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center shrink-0">
          <MessageCircle size={16} className="text-gray-900" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-black text-gray-900">알림톡 · 하랑 채널 이름으로 받는 알림</h2>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            문의가 들어오면 하랑 카카오톡 채널 이름으로 대표님 휴대폰에 알림톡이 한 통 갑니다. 나와의 채팅 알림과 따로 오고,
            손님이 채널에서 보내기를 누르지 않아도 옵니다.
          </p>
        </div>
      </div>

      {error && <p className="text-xs font-bold text-red-600 mb-3">{error}</p>}

      {status && (
        <div
          className={`rounded-xl px-4 py-3 text-xs mb-3 ${
            status.ready ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-800"
          }`}
        >
          {status.ready ? (
            <span className="font-bold">준비됨 · 받는 번호 {status.recipients}개</span>
          ) : (
            <>
              <span className="font-bold">아직 꺼져 있습니다.</span> Vercel 환경변수에 넣을 이름 :{" "}
              {status.missing.length > 0 ? status.missing.join(", ") : "INQUIRY_ALERT_TO (휴대폰 번호 형식)"}
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={sendTest}
        disabled={sending || !status?.ready}
        className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 text-white px-4 py-2.5 text-xs font-black hover:bg-gray-800 disabled:opacity-40"
      >
        {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        알림톡 시험 발송
      </button>

      {result && (
        <p className={`mt-3 text-xs font-bold ${result.ok ? "text-blue-700" : "text-red-600"}`}>
          {result.ok ? `보냈습니다 · ${result.sent ?? 0}통` : `실패 · ${result.error ?? "원인 모름"}`}
        </p>
      )}

      {template && (
        <details className="mt-3">
          <summary className="text-xs font-bold text-gray-500 cursor-pointer">템플릿 심사에 올릴 본문 보기</summary>
          <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-[11px] text-gray-700">{template}</pre>
        </details>
      )}
    </section>
  );
}
