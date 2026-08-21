"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Landmark } from "lucide-react";

const PRESETS = [10000, 30000, 50000, 100000, 300000, 500000];
const won = (n: number) => n.toLocaleString("ko-KR");

interface Charge {
  id: number;
  amount: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "입금 대기", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  paid: { label: "충전 완료", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  failed: { label: "취소됨", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
  expired: { label: "만료", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
};

export default function SnsChargePage() {
  const [preset, setPreset] = useState(30000);
  const [custom, setCustom] = useState("");
  const [charges, setCharges] = useState<Charge[]>([]);
  const [bank, setBank] = useState("");
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/sns/charge");
    if (res.status === 401) {
      window.location.href = "/sns/login";
      return;
    }
    const data = await res.json().catch(() => ({ ok: false }));
    if (data.ok) {
      setCharges(data.charges ?? []);
      setBank(data.bank ?? "");
      setReady(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const amount = custom ? parseInt(custom.replace(/[^0-9]/g, "") || "0", 10) : preset;

  const submit = async () => {
    if (!amount || amount < 5000) {
      setError("최소 5,000원부터 충전할 수 있어요");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/sns/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json().catch(() => ({ ok: false, error: "신청 실패" }));
    if (data.ok) {
      setSubmitted(amount);
      setBank(data.bank ?? bank);
      setCustom("");
      load();
    } else {
      setError(data.error ?? "충전 신청에 실패했습니다");
    }
    setLoading(false);
  };

  if (!ready) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-300" size={28} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:py-12">
      <div className="max-w-lg mx-auto space-y-5">
        <Link href="/sns/me" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={14} strokeWidth={2.5} /> 마이페이지
        </Link>

        <div>
          <h1 className="text-xl font-black text-slate-900">예치금 충전</h1>
          <p className="text-xs text-slate-400 mt-1">
            금액을 고르고 신청한 뒤 안내 계좌로 입금하시면, 확인 후 잔액이 채워져요.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <Check size={18} strokeWidth={2.5} />
              <span className="font-black">충전 신청 완료</span>
            </div>
            <p className="text-sm text-slate-600">
              아래 계좌로 <strong className="text-slate-900">{won(submitted)}원</strong>을 입금해 주세요. 입금이 확인되면 잔액에 반영됩니다.
            </p>
            <div className="rounded-xl bg-slate-900 text-white p-4">
              <div className="flex items-center gap-2 text-slate-300 text-xs font-bold mb-1">
                <Landmark size={13} strokeWidth={2.5} /> 입금 계좌
              </div>
              <p className="text-sm font-black">{bank}</p>
            </div>
            <p className="text-[11px] text-slate-400">
              입금자명이 가입하신 이름과 다르면 확인이 늦어질 수 있어요.
            </p>
            <button
              onClick={() => setSubmitted(null)}
              className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              다른 금액 더 충전하기
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPreset(p);
                    setCustom("");
                  }}
                  className={`py-3 rounded-xl text-sm font-black ring-1 transition-colors ${
                    !custom && preset === p
                      ? "bg-blue-600 text-white ring-blue-600"
                      : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {won(p)}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">직접 입력</label>
              <div className="relative">
                <input
                  inputMode="numeric"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="예: 70000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base focus:border-blue-400 focus:outline-none pr-10 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">원</span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-xs font-bold text-slate-500">충전 금액</span>
              <span className="text-lg font-black text-slate-900 tabular-nums">{won(amount || 0)}원</span>
            </div>
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-colors"
            >
              {loading ? "신청 중..." : "충전 신청하기"}
            </button>
          </div>
        )}

        {charges.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-800">충전 신청 내역</h2>
            </div>
            <ul className="divide-y divide-slate-50">
              {charges.map((c) => {
                const s = STATUS[c.status] ?? { label: c.status, cls: "bg-slate-100 text-slate-500 ring-slate-200" };
                return (
                  <li key={c.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-bold text-slate-800 tabular-nums">{won(c.amount)}원</p>
                      <p className="text-[11px] text-slate-400">{new Date(c.createdAt).toLocaleString("ko-KR")}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${s.cls}`}>{s.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
