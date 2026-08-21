"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft, ArrowUpRight, LogOut, Plus, RefreshCw, Loader2, ExternalLink,
} from "lucide-react";

const won = (n: number) => n.toLocaleString("ko-KR");

interface LedgerEntry {
  id: number;
  kind: string;
  amount: number;
  balanceAfter: number;
  ref: string | null;
  memo: string | null;
  createdAt: string;
}

interface OrderRow {
  no: string;
  productName: string;
  qty: number;
  total: number;
  link: string;
  status: string;
  remains: number | null;
  createdAt: string;
}

const KIND_LABEL: Record<string, string> = {
  charge: "충전",
  order: "주문 결제",
  refund: "환불",
  admin_adjust: "조정",
};

const ORDER_STATUS: Record<string, { label: string; chip: string }> = {
  pending: { label: "진행 준비", chip: "w-chip-amber" },
  processing: { label: "진행 중", chip: "w-chip-blue" },
  partial: { label: "부분 완료", chip: "w-chip-blue" },
  completed: { label: "완료", chip: "w-chip-green" },
  canceled: { label: "취소·환불", chip: "w-chip-neutral" },
};

export default function SnsMePage() {
  const [member, setMember] = useState<{ name: string; phone: string; balance: number } | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [tab, setTab] = useState<"ledger" | "orders">("ledger");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [meRes, orderRes] = await Promise.all([fetch("/api/sns/me"), fetch("/api/sns/orders")]);
    if (meRes.status === 401) {
      window.location.href = "/sns/login";
      return;
    }
    const me = await meRes.json().catch(() => ({ ok: false }));
    const od = await orderRes.json().catch(() => ({ ok: false }));
    if (me.ok) {
      setMember(me.member);
      setLedger(me.ledger ?? []);
    }
    if (od.ok) setOrders(od.orders ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const logout = async () => {
    await fetch("/api/sns/auth/logout", { method: "POST" });
    window.location.href = "/sns/login";
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center" style={{ background: "var(--w-bg-alt)" }}>
        <Loader2 className="animate-spin" size={26} style={{ color: "var(--w-text-disabled)" }} />
      </main>
    );
  }
  if (!member) return null;

  return (
    <main className="min-h-screen px-5 py-10 md:py-14" style={{ background: "var(--w-bg-alt)" }}>
      <div className="mx-auto w-full max-w-[720px]">
        {/* 헤더 */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="w-label-2" style={{ color: "var(--w-text-assist)" }}>
              마이페이지
            </p>
            <h1 className="w-heading-2 mt-1" style={{ color: "var(--w-text)" }}>
              {member.name}님
            </h1>
            <p className="w-caption-1 w-num mt-1" style={{ color: "var(--w-text-assist)" }}>
              {member.phone}
            </p>
          </div>
          <button onClick={logout} className="w-btn w-btn-ghost w-btn-sm">
            <LogOut size={14} strokeWidth={2.5} />
            로그아웃
          </button>
        </div>

        {/* 잔액 */}
        <section className="w-card mb-4 p-7">
          <p className="w-label-2" style={{ color: "var(--w-text-muted)" }}>
            예치금 잔액
          </p>
          <p className="w-display-2 w-num mt-1.5" style={{ color: "var(--w-text)" }}>
            {won(member.balance)}
            <span className="w-title-2 ml-1" style={{ color: "var(--w-text-muted)" }}>
              원
            </span>
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link href="/sns/charge" className="w-btn w-btn-primary flex-1">
              <Plus size={16} strokeWidth={2.5} />
              충전하기
            </Link>
            <Link href="/sns/order" className="w-btn w-btn-secondary flex-1">
              주문하기
            </Link>
          </div>
        </section>

        {/* 탭 */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            {([
              ["ledger", `충전·사용 내역 ${ledger.length}`],
              ["orders", `주문 ${orders.length}`],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="w-btn w-btn-sm"
                style={
                  tab === key
                    ? { background: "var(--w-text)", color: "var(--w-text-inverse)" }
                    : { background: "var(--w-bg)", color: "var(--w-text-muted)", border: "1px solid var(--w-border)" }
                }
              >
                {label}
              </button>
            ))}
          </div>
          <button onClick={load} className="w-btn w-btn-ghost w-btn-sm" aria-label="새로고침">
            <RefreshCw size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* 내역 */}
        <section className="w-card overflow-hidden">
          {tab === "ledger" ? (
            ledger.length === 0 ? (
              <p className="w-body-2 px-6 py-14 text-center" style={{ color: "var(--w-text-assist)" }}>
                아직 내역이 없어요. 충전하고 시작해 보세요.
              </p>
            ) : (
              <ul>
                {ledger.map((l, i) => {
                  const plus = l.amount >= 0;
                  return (
                    <li
                      key={l.id}
                      className="flex items-center justify-between gap-3 px-6 py-4"
                      style={i > 0 ? { borderTop: "1px solid var(--w-line)" } : undefined}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                          style={{ background: plus ? "var(--w-success-weak)" : "var(--w-bg-sunken)" }}
                        >
                          {plus ? (
                            <ArrowDownLeft size={16} strokeWidth={2.5} style={{ color: "var(--w-success-dark)" }} />
                          ) : (
                            <ArrowUpRight size={16} strokeWidth={2.5} style={{ color: "var(--w-text-muted)" }} />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="w-label-1 font-bold" style={{ color: "var(--w-text)" }}>
                            {KIND_LABEL[l.kind] ?? l.kind}
                          </p>
                          <p className="w-caption-1 truncate" style={{ color: "var(--w-text-assist)" }}>
                            {new Date(l.createdAt).toLocaleString("ko-KR")}
                            {l.ref ? ` · ${l.ref}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p
                          className="w-label-1 w-num font-bold"
                          style={{ color: plus ? "var(--w-success-dark)" : "var(--w-text)" }}
                        >
                          {plus ? "+" : ""}
                          {won(l.amount)}원
                        </p>
                        <p className="w-caption-1 w-num" style={{ color: "var(--w-text-assist)" }}>
                          잔액 {won(l.balanceAfter)}원
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )
          ) : orders.length === 0 ? (
            <p className="w-body-2 px-6 py-14 text-center" style={{ color: "var(--w-text-assist)" }}>
              아직 주문이 없어요.{" "}
              <Link href="/sns/order" className="font-bold underline" style={{ color: "var(--w-primary)" }}>
                주문하러 가기
              </Link>
            </p>
          ) : (
            <ul>
              {orders.map((o, i) => {
                const s = ORDER_STATUS[o.status] ?? { label: o.status, chip: "w-chip-neutral" };
                return (
                  <li
                    key={o.no}
                    className="px-6 py-4"
                    style={i > 0 ? { borderTop: "1px solid var(--w-line)" } : undefined}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="w-label-2 w-num font-bold" style={{ color: "var(--w-text-muted)" }}>
                            {o.no}
                          </span>
                          <span className={`w-chip ${s.chip}`}>{s.label}</span>
                        </div>
                        <p className="w-label-1 mt-1 font-bold" style={{ color: "var(--w-text)" }}>
                          {o.productName}
                        </p>
                        <p className="w-caption-1 w-num mt-0.5" style={{ color: "var(--w-text-assist)" }}>
                          {won(o.qty)}개 · {new Date(o.createdAt).toLocaleString("ko-KR")}
                          {o.remains != null && ` · 잔여 ${won(o.remains)}`}
                        </p>
                        <a
                          href={o.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-caption-1 mt-1 inline-flex max-w-full items-center gap-1 truncate hover:underline"
                          style={{ color: "var(--w-primary)" }}
                        >
                          {o.link}
                          <ExternalLink size={10} />
                        </a>
                      </div>
                      <p className="w-label-1 w-num shrink-0 font-bold" style={{ color: "var(--w-text)" }}>
                        {won(o.total)}원
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <p className="w-caption-1 mt-6 text-center">
          <Link href="/sns" className="hover:underline" style={{ color: "var(--w-text-assist)" }}>
            스토어로 돌아가기
          </Link>
        </p>
      </div>
    </main>
  );
}
