"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Check, X, Loader2, RefreshCw } from "lucide-react";
import { AdminHeader, AdminFooter } from "../../AdminNav";

interface PendingCharge {
  id: number;
  memberId: number;
  amount: number;
  status: string;
  createdAt: string;
  memberName: string;
  memberPhone: string;
}

const won = (n: number) => n.toLocaleString("ko-KR");

export default function AdminChargesPage() {
  const router = useRouter();
  const [charges, setCharges] = useState<PendingCharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/sns/charges");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json().catch(() => ({ ok: false }));
    if (data.ok) setCharges(data.charges ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (op: "approve" | "reject", c: PendingCharge) => {
    if (
      op === "approve" &&
      !window.confirm(
        `${c.memberName}님의 ${won(c.amount)}원 충전을 승인할까요?\n\n통장 입금을 확인한 뒤 승인하세요. 승인하면 즉시 잔액에 반영됩니다.`
      )
    )
      return;
    if (op === "reject" && !window.confirm(`${c.memberName}님의 ${won(c.amount)}원 충전 신청을 반려할까요?`)) return;

    setBusy(`${op}:${c.id}`);
    setMessage("");
    const res = await fetch("/api/admin/sns/charges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op, id: c.id }),
    });
    const data = await res.json().catch(() => ({ ok: false, error: "네트워크 오류" }));
    if (!data.ok) setMessage(`오류: ${data.error}`);
    else if (op === "approve") setMessage(`${c.memberName}님 충전 완료 — 반영 후 잔액 ${won(data.result.balanceAfter)}원`);
    else setMessage("반려 처리했습니다");
    await load();
    setBusy("");
  };

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-black text-gray-900">예치금 충전 관리</h1>
              <p className="text-xs text-gray-400 mt-0.5">통장 입금을 확인하고 승인하면 회원 잔액에 반영됩니다.</p>
            </div>
            <button
              onClick={load}
              disabled={busy !== ""}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white ring-1 ring-gray-200 px-4 py-2.5 text-xs font-black text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} strokeWidth={2.5} /> 새로고침
            </button>
          </div>

          {message && (
            <p className="mb-4 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
              {message}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-gray-400">불러오는 중...</p>
          ) : charges.length === 0 ? (
            <div className="bg-white rounded-2xl ring-1 ring-gray-100 p-10 text-center">
              <Wallet size={24} className="text-gray-300 mx-auto mb-2" strokeWidth={2} />
              <p className="text-sm text-gray-400">입금 확인을 기다리는 충전 신청이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {charges.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl ring-1 ring-gray-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900 text-lg tabular-nums">{won(c.amount)}원</span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-black ring-1 bg-blue-50 text-blue-700 ring-blue-200">
                        입금 대기
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      <strong className="text-gray-700">{c.memberName}</strong> · {c.memberPhone} ·{" "}
                      {new Date(c.createdAt).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => act("approve", c)}
                      disabled={busy !== ""}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      {busy === `approve:${c.id}` ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Check size={13} strokeWidth={2.5} />
                      )}
                      입금 확인·승인
                    </button>
                    <button
                      onClick={() => act("reject", c)}
                      disabled={busy !== ""}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white ring-1 ring-gray-200 px-3 py-2.5 text-xs font-black text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <X size={13} strokeWidth={2.5} /> 반려
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <AdminFooter />
    </>
  );
}
