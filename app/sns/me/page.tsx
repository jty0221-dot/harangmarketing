"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Wallet, Plus, LogOut, ArrowUpRight, ArrowDownRight, RefreshCw, Loader2,
} from "lucide-react";

interface LedgerEntry {
  id: number;
  kind: string;
  amount: number;
  balanceAfter: number;
  ref: string | null;
  memo: string | null;
  createdAt: string;
}

const KIND_LABEL: Record<string, string> = {
  charge: "충전",
  order: "주문",
  refund: "환불",
  admin_adjust: "조정",
};

export default function SnsMePage() {
  const [member, setMember] = useState<{ name: string; phone: string; balance: number } | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/sns/me");
    if (res.status === 401) {
      window.location.href = "/sns/login";
      return;
    }
    const data = await res.json().catch(() => ({ ok: false }));
    if (data.ok) {
      setMember(data.member);
      setLedger(data.ledger ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const logout = async () => {
    await fetch("/api/sns/auth/logout", { method: "POST" });
    window.location.href = "/sns/login";
  };

  const won = (n: number) => n.toLocaleString("ko-KR");

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-300" size={28} />
      </main>
    );
  }
  if (!member) return null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">마이페이지</p>
            <h1 className="text-xl font-black text-slate-900">{member.name}님</h1>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <LogOut size={14} strokeWidth={2.5} /> 로그아웃
          </button>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 p-6 shadow-sm text-white">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-bold mb-2">
            <Wallet size={14} strokeWidth={2.5} /> 예치금 잔액
          </div>
          <div className="text-3xl font-black tabular-nums">
            {won(member.balance)}
            <span className="text-lg font-bold text-slate-300 ml-1">원</span>
          </div>
          <div className="mt-4 flex gap-2">
            <Link
              href="/sns/charge"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white text-slate-900 px-4 py-2.5 text-sm font-black hover:bg-slate-100 transition-colors"
            >
              <Plus size={15} strokeWidth={2.5} /> 충전하기
            </Link>
            <Link
              href="/sns/order"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 ring-1 ring-white/20 text-white px-4 py-2.5 text-sm font-bold hover:bg-white/20 transition-colors"
            >
              주문하기
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-800">충전·사용 내역</h2>
            <button onClick={load} className="text-slate-400 hover:text-slate-700 transition-colors">
              <RefreshCw size={14} strokeWidth={2.5} />
            </button>
          </div>
          {ledger.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">아직 내역이 없어요. 충전하고 시작해보세요.</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {ledger.map((l) => {
                const plus = l.amount >= 0;
                return (
                  <li key={l.id} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          plus ? "bg-emerald-50" : "bg-slate-100"
                        }`}
                      >
                        {plus ? (
                          <ArrowDownRight size={15} className="text-emerald-600" strokeWidth={2.5} />
                        ) : (
                          <ArrowUpRight size={15} className="text-slate-500" strokeWidth={2.5} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800">{KIND_LABEL[l.kind] ?? l.kind}</p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {new Date(l.createdAt).toLocaleString("ko-KR")}
                          {l.ref ? ` · ${l.ref}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-black tabular-nums ${plus ? "text-emerald-600" : "text-slate-700"}`}>
                        {plus ? "+" : ""}
                        {won(l.amount)}
                      </p>
                      <p className="text-[11px] text-slate-400 tabular-nums">잔액 {won(l.balanceAfter)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
