"use client";

import { useState } from "react";
import { Search, Loader2, AlertTriangle, MessageCircle, PackageCheck, Timer, XCircle, CheckCircle2 } from "lucide-react";
import { won } from "../../lib/sns-store";

const KAKAO_CHAT = "https://pf.kakao.com/_MuUkG/chat";

interface TrackResult {
  no: string;
  createdAt: string;
  platform: string;
  productName: string;
  qty: number;
  total: number;
  status: "pending" | "processing" | "partial" | "completed" | "canceled";
  statusLabel: string;
  startCount: number | null;
  remains: number | null;
}

const STATUS_STYLE: Record<TrackResult["status"], { chip: string; icon: typeof Timer }> = {
  pending: { chip: "bg-amber-50 text-amber-700 ring-amber-200", icon: Timer },
  processing: { chip: "bg-blue-50 text-blue-700 ring-blue-200", icon: Loader2 },
  partial: { chip: "bg-indigo-50 text-indigo-700 ring-indigo-200", icon: PackageCheck },
  completed: { chip: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2 },
  canceled: { chip: "bg-gray-100 text-gray-500 ring-gray-200", icon: XCircle },
};

export default function TrackForm() {
  const [no, setNo] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/sns/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no, contact }),
      });
      const data = await res.json();
      if (data.ok) setResult(data.order as TrackResult);
      else setError(data.error ?? "조회에 실패했습니다.");
    } catch {
      setError("네트워크 오류입니다. 잠시 후 다시 시도해 주세요.");
    }
    setLoading(false);
  };

  const done = result ? Math.max(0, result.qty - (result.remains ?? result.qty)) : 0;
  const progress =
    result && result.status !== "pending"
      ? result.status === "completed"
        ? 100
        : result.remains !== null
          ? Math.min(100, Math.round((done / result.qty) * 100))
          : null
      : 0;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-5 md:p-6 space-y-4">
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">주문번호</label>
          <input
            required
            value={no}
            onChange={(e) => setNo(e.target.value.toUpperCase())}
            placeholder="HB260821-XXXX"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base font-bold tracking-wide focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">연락처 (주문 시 입력한 번호 또는 카톡 ID)</label>
          <input
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="010-0000-0000"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 ring-1 ring-red-100 px-4 py-2.5 text-[12.5px] font-bold text-red-600">
            <AlertTriangle size={14} strokeWidth={2.5} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} strokeWidth={2.2} />}
          {loading ? "조회 중..." : "조회하기"}
        </button>
      </form>

      {result && (
        <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black tracking-widest text-gray-400">{result.no}</p>
              <h2 className="mt-0.5 text-[15px] font-black text-gray-900 truncate">
                {result.platform} · {result.productName}
              </h2>
            </div>
            {(() => {
              const s = STATUS_STYLE[result.status];
              return (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-black ring-1 shrink-0 ${s.chip}`}>
                  <s.icon size={12} strokeWidth={2.5} className={result.status === "processing" ? "animate-spin" : ""} />
                  {result.statusLabel}
                </span>
              );
            })()}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-gray-50 ring-1 ring-gray-100 py-3">
              <p className="text-[11px] font-bold text-gray-400">주문 수량</p>
              <p className="mt-0.5 text-lg font-black text-gray-900 tabular-nums">{won(result.qty)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 ring-1 ring-gray-100 py-3">
              <p className="text-[11px] font-bold text-gray-400">결제 금액</p>
              <p className="mt-0.5 text-lg font-black text-gray-900 tabular-nums">{won(result.total)}원</p>
            </div>
          </div>

          {result.status === "pending" && (
            <p className="mt-4 text-[13px] leading-relaxed text-gray-500">
              입금 확인 대기 중입니다. 입금하셨다면 확인까지 잠시 걸릴 수 있고, 확인 즉시 시작됩니다.
              급하시면 카카오톡으로 주문번호를 보내주세요.
            </p>
          )}

          {progress !== null && result.status !== "pending" && result.status !== "canceled" && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                <span>진행률</span>
                <span className="tabular-nums">
                  {result.remains !== null ? `${won(done)} / ${won(result.qty)}` : ""} {progress}%
                </span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {result.startCount !== null && (
                <p className="mt-1.5 text-[11px] text-gray-400 tabular-nums">시작 시점 수치: {won(result.startCount)}</p>
              )}
            </div>
          )}

          <a
            href={KAKAO_CHAT}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-5 py-3 text-[13px] font-black text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-100"
          >
            <MessageCircle size={14} strokeWidth={2.2} />
            문의가 필요하면 카카오톡으로
          </a>
        </div>
      )}
    </div>
  );
}
