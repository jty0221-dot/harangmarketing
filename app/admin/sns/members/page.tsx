"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Wallet, RefreshCw, Loader2, Send, XCircle, ExternalLink, Plus, Minus,
} from "lucide-react";
import { AdminHeader, AdminFooter } from "../../AdminNav";
import { platformName, type PlatformId } from "../../../lib/sns-store";

const won = (n: number) => n.toLocaleString("ko-KR");

interface MemberRow {
  id: number;
  name: string;
  phone: string;
  balance: number;
  status: string;
  createdAt: string;
  orderCount: number;
  chargedTotal: number;
}

interface OrderRow {
  no: string;
  memberId: number | null;
  productName: string;
  platform: string;
  qty: number;
  total: number;
  link: string;
  status: string;
  panelOrderId: number | null;
  panelStatus: string | null;
  remains: number | null;
  createdAt: string;
  lastError: string | null;
}

/** 회원 주문 기준 상태 표기 — pending 은 '결제 완료·발주 대기' */
const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "발주 대기", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  processing: { label: "진행 중", cls: "bg-blue-50 text-blue-700 ring-blue-200" },
  partial: { label: "부분 완료", cls: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
  completed: { label: "완료", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  canceled: { label: "취소·환불", cls: "bg-gray-100 text-gray-500 ring-gray-200" },
};

export default function AdminMembersPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"members" | "orders">("members");
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [mRes, oRes] = await Promise.all([
      fetch("/api/admin/sns/members"),
      fetch("/api/admin/sns/orders"),
    ]);
    if (mRes.status === 401 || oRes.status === 401) {
      router.push("/admin/login");
      return;
    }
    const m = await mRes.json().catch(() => ({ ok: false }));
    const o = await oRes.json().catch(() => ({ ok: false }));
    if (m.ok) setMembers(m.members ?? []);
    if (o.ok) setOrders(o.orders ?? []);
    if (!m.ok) setMessage(`회원 불러오기 오류: ${m.error}`);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const adjust = async (mem: MemberRow, sign: 1 | -1) => {
    const input = window.prompt(
      `${mem.name}님 잔액을 ${sign > 0 ? "지급" : "차감"}합니다. 금액을 입력하세요 (원)\n\n현재 잔액: ${won(mem.balance)}원`
    );
    if (!input) return;
    const amount = parseInt(input.replace(/[^0-9]/g, ""), 10);
    if (!amount) return;
    const memo = window.prompt("사유(선택) — 원장에 남습니다", sign > 0 ? "관리자 지급" : "관리자 차감") ?? "";

    setBusy(`adjust:${mem.id}`);
    setMessage("");
    const res = await fetch("/api/admin/sns/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "adjust", memberId: mem.id, amount: amount * sign, memo }),
    });
    const data = await res.json().catch(() => ({ ok: false, error: "네트워크 오류" }));
    setMessage(data.ok ? `${mem.name}님 잔액 ${won(data.balanceAfter)}원으로 조정` : `오류: ${data.error}`);
    await load();
    setBusy("");
  };

  const orderAct = async (op: "dispatch" | "refresh" | "cancel", no?: string) => {
    if (op === "cancel" && !window.confirm(`${no} 주문을 취소하고 결제액을 잔액으로 환불할까요?`)) return;
    setBusy(`${op}:${no ?? ""}`);
    setMessage("");
    const res = await fetch("/api/admin/sns/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op, no }),
    });
    const data = await res.json().catch(() => ({ ok: false, error: "네트워크 오류" }));
    if (!data.ok) setMessage(`오류: ${data.error}`);
    else if (op === "refresh") setMessage(`상태 동기화 완료 (${data.updated}건 변경)`);
    else if (op === "dispatch") setMessage(`발주 완료 (파트너 주문번호 ${data.panelOrderId})`);
    else if (op === "cancel") setMessage(`환불 완료 — 반영 후 잔액 ${won(data.result.balanceAfter)}원`);
    await load();
    setBusy("");
  };

  const memberName = (id: number | null) => members.find((m) => m.id === id)?.name ?? "—";
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-black text-gray-900">회원·잔액 관리</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                예치금 회원의 잔액과 잔액 결제 주문을 관리합니다. (무통장 비회원 주문은 SNS 주문 메뉴)
              </p>
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

          <div className="flex gap-1.5 mb-4">
            {([
              ["members", `회원 ${members.length}`],
              ["orders", `회원 주문 ${orders.length}`],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-lg px-4 py-2 text-xs font-black ring-1 transition-colors ${
                  tab === key
                    ? "bg-gray-900 text-white ring-gray-900"
                    : "bg-white text-gray-500 ring-gray-200 hover:bg-gray-100"
                }`}
              >
                {label}
                {key === "orders" && pendingCount > 0 && <span className="ml-1 text-amber-500">{pendingCount}</span>}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">불러오는 중...</p>
          ) : tab === "members" ? (
            members.length === 0 ? (
              <div className="bg-white rounded-2xl ring-1 ring-gray-100 p-10 text-center">
                <Users size={24} className="text-gray-300 mx-auto mb-2" strokeWidth={2} />
                <p className="text-sm text-gray-400">아직 가입한 회원이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl ring-1 ring-gray-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900 text-sm">{m.name}</span>
                        <span className="text-xs text-gray-400 tabular-nums">{m.phone}</span>
                        {m.status !== "active" && (
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-black ring-1 bg-red-50 text-red-600 ring-red-200">
                            {m.status}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-gray-400">
                        가입 {new Date(m.createdAt).toLocaleDateString("ko-KR")} · 주문 {m.orderCount}건 · 누적 충전{" "}
                        {won(m.chargedTotal)}원
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right mr-1">
                        <p className="text-[10px] font-bold text-gray-400">잔액</p>
                        <p className="text-lg font-black text-gray-900 tabular-nums leading-tight">{won(m.balance)}원</p>
                      </div>
                      <button
                        onClick={() => adjust(m, 1)}
                        disabled={busy !== ""}
                        title="잔액 지급"
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        {busy === `adjust:${m.id}` ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} strokeWidth={2.5} />}
                        지급
                      </button>
                      <button
                        onClick={() => adjust(m, -1)}
                        disabled={busy !== ""}
                        title="잔액 차감"
                        className="inline-flex items-center gap-1 rounded-xl bg-white ring-1 ring-gray-200 px-3 py-2.5 text-xs font-black text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        <Minus size={13} strokeWidth={2.5} />
                        차감
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <>
              <div className="mb-3 flex justify-end">
                <button
                  onClick={() => orderAct("refresh")}
                  disabled={busy !== ""}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white ring-1 ring-gray-200 px-4 py-2.5 text-xs font-black text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {busy === "refresh:" ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} strokeWidth={2.5} />}
                  상태 동기화
                </button>
              </div>
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl ring-1 ring-gray-100 p-10 text-center">
                  <Wallet size={24} className="text-gray-300 mx-auto mb-2" strokeWidth={2} />
                  <p className="text-sm text-gray-400">아직 잔액 결제 주문이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.map((o) => {
                    const s = STATUS[o.status] ?? { label: o.status, cls: "bg-gray-100 text-gray-500 ring-gray-200" };
                    return (
                      <div key={o.no} className="bg-white rounded-2xl ring-1 ring-gray-100 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-black text-gray-900 text-sm tabular-nums">{o.no}</span>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${s.cls}`}>
                                {s.label}
                              </span>
                              {o.lastError && (
                                <span className="rounded-full px-2 py-0.5 text-[10px] font-black ring-1 bg-red-50 text-red-600 ring-red-200">
                                  발주 오류
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 truncate">
                              {memberName(o.memberId)} · {platformName(o.platform as PlatformId)} · {o.productName} ·{" "}
                              {won(o.qty)}개 · <strong className="text-gray-700">{won(o.total)}원</strong>
                            </p>
                            <p className="mt-0.5 text-[11px] text-gray-400">
                              {new Date(o.createdAt).toLocaleString("ko-KR")}
                              {o.panelOrderId && ` · 발주 ${o.panelOrderId} · ${o.panelStatus ?? "—"}`}
                              {o.remains != null && ` · 잔여 ${o.remains}`}
                            </p>
                            <a
                              href={o.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline truncate max-w-full"
                            >
                              {o.link}
                              <ExternalLink size={10} />
                            </a>
                          </div>
                          {o.status === "pending" && !o.panelOrderId && (
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => orderAct("dispatch", o.no)}
                                disabled={busy !== ""}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                {busy === `dispatch:${o.no}` ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <Send size={13} strokeWidth={2.5} />
                                )}
                                발주
                              </button>
                              <button
                                onClick={() => orderAct("cancel", o.no)}
                                disabled={busy !== ""}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white ring-1 ring-gray-200 px-3 py-2.5 text-xs font-black text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                              >
                                <XCircle size={13} strokeWidth={2.5} />
                                취소·환불
                              </button>
                            </div>
                          )}
                        </div>
                        {o.lastError && <p className="mt-2 text-[11px] font-bold text-red-500">최근 오류: {o.lastError}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <AdminFooter />
    </>
  );
}
