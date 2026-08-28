"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw, Send, XCircle, ExternalLink, Loader2, Wallet, StickyNote, Check,
} from "lucide-react";
import { AdminHeader, AdminFooter } from "../AdminNav";
import { ORDER_STATUS_LABEL, platformName, won, type OrderStatus, type PlatformId } from "../../lib/sns-store";

interface AdminOrder {
  no: string;
  createdAt: string;
  product: string;
  productName: string;
  platform: string;
  sid: number;
  qty: number;
  unitPrice: number;
  total: number;
  link: string;
  contact: string;
  depositor: string;
  comments?: string;
  status: OrderStatus;
  panelOrderId?: number;
  panelStatus?: string;
  startCount?: number;
  remains?: number;
  submittedAt?: string;
  adminMemo?: string;
  lastError?: string;
}

const STATUS_CHIP: Record<OrderStatus, string> = {
  pending: "bg-blue-50 text-blue-700 ring-blue-200",
  processing: "bg-blue-50 text-blue-700 ring-blue-200",
  partial: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  canceled: "bg-gray-100 text-gray-500 ring-gray-200",
};

const FILTERS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pending", label: "입금 대기" },
  { key: "processing", label: "진행 중" },
  { key: "partial", label: "부분 완료" },
  { key: "completed", label: "완료" },
  { key: "canceled", label: "취소" },
];

export default function AdminSnsPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [balance, setBalance] = useState<{ balance: number; currency: string } | null>(null);
  const [lowBalance, setLowBalance] = useState(30000);
  const [topupUrl, setTopupUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string>(""); // 진행 중인 작업 표시: `${op}:${no}`
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [message, setMessage] = useState("");
  const [openNo, setOpenNo] = useState<string | null>(null);
  const [memoDraft, setMemoDraft] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/sns");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    if (data.ok) {
      setOrders(data.orders);
      setBalance(data.balance);
      if (data.lowBalance) setLowBalance(data.lowBalance);
      setTopupUrl(data.topupUrl ?? null);
    } else {
      setMessage(`불러오기 오류: ${data.error}`);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (op: string, no?: string, extra?: Record<string, unknown>) => {
    setBusy(`${op}:${no ?? ""}`);
    setMessage("");
    try {
      const res = await fetch("/api/admin/sns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op, no, ...extra }),
      });
      const data = await res.json();
      if (!data.ok) setMessage(`오류: ${data.error}`);
      else if (data.warning) setMessage(data.warning);
      else if (op === "refresh") setMessage(`상태 동기화 완료 (${data.updated}건 변경)`);
      await load();
    } catch (e) {
      setMessage(`네트워크 오류: ${String(e)}`);
    }
    setBusy("");
  };

  const submitOrder = (o: AdminOrder) => {
    const okConfirm = window.confirm(
      `입금 확인 후 발주합니다.\n\n${o.no} · ${o.productName} ${won(o.qty)}개\n결제액 ${won(o.total)}원 (${o.depositor})\n\n발주하면 파트너 잔액이 실제로 차감됩니다. 진행할까요?`
    );
    if (okConfirm) act("submit", o.no);
  };

  const cancelOrder = (o: AdminOrder) => {
    if (window.confirm(`${o.no} 주문을 취소 처리할까요? (발주 전 주문만 가능)`)) act("cancel", o.no);
  };

  const visible = orders.filter((o) => filter === "all" || o.status === filter);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-black text-gray-900">SNS 부스트 주문 관리</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                입금 확인 → 발주 → 상태 동기화. 발주 버튼을 눌러야 파트너에 주문이 들어갑니다.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 ring-1 ${
                  balance && balance.balance < lowBalance
                    ? "bg-red-50 ring-red-200"
                    : "bg-white ring-gray-200"
                }`}
              >
                <Wallet
                  size={14}
                  className={balance && balance.balance < lowBalance ? "text-red-600" : "text-blue-600"}
                  strokeWidth={2.5}
                />
                <span className="text-xs font-bold text-gray-500">파트너 잔액</span>
                <span
                  className={`text-sm font-black tabular-nums ${
                    balance && balance.balance < lowBalance ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {balance ? `${won(Math.floor(balance.balance))}원` : "—"}
                </span>
                {topupUrl && (
                  <a
                    href={topupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`ml-1 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-black transition-colors ${
                      balance && balance.balance < lowBalance
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    충전
                    <ExternalLink size={10} strokeWidth={2.5} />
                  </a>
                )}
              </div>
              <button
                onClick={() => act("refresh")}
                disabled={busy !== ""}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white ring-1 ring-gray-200 px-4 py-2.5 text-xs font-black text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {busy === "refresh:" ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} strokeWidth={2.5} />}
                상태 동기화
              </button>
            </div>
          </div>

          {message && (
            <p className="mb-4 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
              {message}
            </p>
          )}

          {balance && balance.balance < lowBalance && (
            <p className="mb-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              파트너 잔액이 {won(lowBalance)}원 아래입니다. 잔액이 부족하면 발주가 실패하니 충전 버튼으로 미리 채워두세요.
              (부족 상태에서 주문·발주가 생기면 카카오톡 웹훅으로도 알림이 갑니다)
            </p>
          )}

          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 mb-4">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-black ring-1 transition-colors ${
                  filter === f.key
                    ? "bg-gray-900 text-white ring-gray-900"
                    : "bg-white text-gray-500 ring-gray-200 hover:bg-gray-100"
                }`}
              >
                {f.label}
                {f.key === "pending" && pendingCount > 0 && (
                  <span className="ml-1 text-blue-600">{pendingCount}</span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">불러오는 중...</p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-gray-400 bg-white rounded-2xl ring-1 ring-gray-100 p-8 text-center">
              해당 상태의 주문이 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {visible.map((o) => {
                const isOpen = openNo === o.no;
                return (
                  <div key={o.no} className="bg-white rounded-2xl ring-1 ring-gray-100 overflow-hidden">
                    <button
                      onClick={() => {
                        setOpenNo(isOpen ? null : o.no);
                        setMemoDraft(o.adminMemo ?? "");
                      }}
                      className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50/60 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-gray-900 text-sm tabular-nums">{o.no}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ring-1 ${STATUS_CHIP[o.status]}`}>
                            {ORDER_STATUS_LABEL[o.status]}
                          </span>
                          {o.lastError && (
                            <span className="rounded-full px-2 py-0.5 text-[11px] font-black ring-1 bg-red-50 text-red-600 ring-red-200">
                              발주 오류
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500 truncate">
                          {platformName(o.platform as PlatformId)} · {o.productName} · {won(o.qty)}개 ·{" "}
                          <strong className="text-gray-700">{won(o.total)}원</strong> · 입금자 {o.depositor}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          {new Date(o.createdAt).toLocaleString("ko-KR")} · {o.contact}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        {o.status === "pending" && (
                          <span className="hidden md:inline text-[11px] font-black text-blue-700">입금 확인 필요</span>
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50/50">
                        <div className="text-xs text-gray-600 break-all">
                          <span className="font-black text-gray-800">링크: </span>
                          <a href={o.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2">
                            {o.link}
                          </a>
                          <ExternalLink size={11} className="inline ml-1 text-gray-400" />
                        </div>
                        {o.comments && (
                          <div className="text-xs text-gray-600 whitespace-pre-wrap rounded-lg bg-white ring-1 ring-gray-100 p-3">
                            <span className="font-black text-gray-800">지정 댓글:</span>
                            {"\n"}{o.comments}
                          </div>
                        )}
                        {o.panelOrderId && (
                          <p className="text-[11px] text-gray-400 tabular-nums">
                            발주번호 {o.panelOrderId} · 파트너 상태 {o.panelStatus ?? "—"} · 시작수치{" "}
                            {o.startCount ?? "—"} · 잔여 {o.remains ?? "—"}
                            {o.submittedAt && ` · 발주 ${new Date(o.submittedAt).toLocaleString("ko-KR")}`}
                          </p>
                        )}
                        {o.lastError && (
                          <p className="text-[11px] font-bold text-red-500">최근 오류: {o.lastError}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-2">
                          {o.status === "pending" && !o.panelOrderId && (
                            <button
                              onClick={() => submitOrder(o)}
                              disabled={busy !== ""}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              {busy === `submit:${o.no}` ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} strokeWidth={2.5} />}
                              입금 확인했고, 발주하기
                            </button>
                          )}
                          {o.status === "pending" && (
                            <button
                              onClick={() => cancelOrder(o)}
                              disabled={busy !== ""}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-white ring-1 ring-gray-200 px-4 py-2.5 text-xs font-black text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                              <XCircle size={13} strokeWidth={2.5} />
                              주문 취소
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <StickyNote size={13} className="text-gray-400 shrink-0" strokeWidth={2.5} />
                          <input
                            value={memoDraft}
                            onChange={(e) => setMemoDraft(e.target.value)}
                            placeholder="관리자 메모 (입금 확인 시각 등)"
                            className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 text-base md:text-xs focus:border-blue-400 focus:outline-none bg-white"
                          />
                          <button
                            onClick={() => act("memo", o.no, { memo: memoDraft })}
                            disabled={busy !== ""}
                            className="inline-flex items-center gap-1 rounded-lg bg-white ring-1 ring-gray-200 px-3 py-2 text-xs font-black text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            <Check size={12} strokeWidth={2.5} />
                            저장
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <AdminFooter />
    </>
  );
}
