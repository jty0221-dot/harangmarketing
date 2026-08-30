"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Copy, CreditCard, Landmark, Loader2 } from "lucide-react";

const PRESETS = [10000, 30000, 50000, 100000, 300000, 500000];
const won = (n: number) => n.toLocaleString("ko-KR");

/**
 * 결제창 설정 — 상점 아이디는 공개값이라 브라우저에 내려도 된다.
 * (돈을 움직이는 열쇠는 서버의 INNOPAY_MERCHANT_KEY · PORTONE_API_SECRET 이고 그건 내려가지 않는다)
 *
 * 카드 결제는 두 길이 있고 이노페이가 우선이다.
 *   이노페이  결제창을 직접 띄우고, 인증이 끝나면 우리 서버가 승인 API 를 불러 반영한다
 *   포트원    포트원이 지원하는 PG 를 쓸 때의 예전 경로. 이노페이는 포트원 지원 목록에 없다
 *
 * 어느 쪽 값도 없으면 카드 결제 자리를 아예 그리지 않고 예전처럼 무통장입금만 받는다.
 */
const INNOPAY_MID = process.env.NEXT_PUBLIC_INNOPAY_MID ?? "";
const INNOPAY_READY = Boolean(INNOPAY_MID);
const INNOPAY_SDK = "https://pg.innopay.co.kr/tpay/js/innopay.js";

const STORE_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID ?? "";
const CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY ?? "";
const PORTONE_READY = Boolean(STORE_ID && CHANNEL_KEY);

const CARD_READY = INNOPAY_READY || PORTONE_READY;
const TEST_MODE =
  process.env.NEXT_PUBLIC_PORTONE_TEST === "1" || process.env.NEXT_PUBLIC_INNOPAY_TEST === "1";

declare global {
  interface Window {
    innopay?: { goPay: (params: Record<string, string>) => void };
  }
}

/** 결제창 스크립트를 한 번만 올린다 */
let innopaySdk: Promise<void> | null = null;
function loadInnopaySdk(): Promise<void> {
  if (typeof window !== "undefined" && window.innopay) return Promise.resolve();
  if (innopaySdk) return innopaySdk;
  innopaySdk = new Promise<void>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = INNOPAY_SDK;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => {
      innopaySdk = null;
      reject(new Error("sdk"));
    };
    document.head.appendChild(el);
  });
  return innopaySdk;
}

interface Charge {
  id: number;
  amount: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

const STATUS: Record<string, { label: string; chip: string }> = {
  pending: { label: "입금 대기", chip: "w-chip-amber" },
  paid: { label: "충전 완료", chip: "w-chip-green" },
  failed: { label: "취소됨", chip: "w-chip-neutral" },
  expired: { label: "만료", chip: "w-chip-neutral" },
};

export default function SnsChargePage() {
  const router = useRouter();
  const [preset, setPreset] = useState(30000);
  const [custom, setCustom] = useState("");
  const [charges, setCharges] = useState<Charge[]>([]);
  const [bank, setBank] = useState("");
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [method, setMethod] = useState<"card" | "bank">(CARD_READY ? "card" : "bank");
  const [done, setDone] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/sns/charge");
    if (res.status === 401) {
      router.replace("/sns/login");
      return;
    }
    const data = await res.json().catch(() => ({ ok: false }));
    if (data.ok) {
      setCharges(data.charges ?? []);
      setBank(data.bank ?? "");
      setReady(true);
    }

    /**
     * 이노페이는 결제창에서 우리 서버(리턴 라우트)를 거쳐 이 화면으로 되돌아온다.
     * 그때 붙어 오는 값으로 결과를 보여주고 주소는 깨끗하게 되돌린다.
     * (새로고침해도 같은 안내가 다시 뜨지 않는다)
     */
    const sp = new URLSearchParams(window.location.search);
    const pay = sp.get("pay");
    if (pay) {
      if (pay === "ok") {
        const amt = Number(sp.get("amt") ?? 0);
        setDone(amt > 0 ? `${won(amt)}원이 충전되었습니다` : "결제가 완료되었습니다");
      } else {
        setError((sp.get("msg") ?? "").slice(0, 120) || "결제가 완료되지 않았습니다");
      }
      window.history.replaceState(null, "", "/sns/charge");
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const amount = custom ? parseInt(custom.replace(/[^0-9]/g, "") || "0", 10) : preset;

  const submit = async () => {
    if (!amount || amount < 5000) {
      setError("최소 5,000원부터 충전할 수 있어요.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/sns/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json().catch(() => ({ ok: false, error: "신청에 실패했습니다" }));
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

  /** 충전 건을 먼저 만든다. 이 id 가 주문번호(MOID)와 결제 식별자의 뿌리가 된다 */
  const createCharge = async (): Promise<{
    id: number;
    buyer: { name: string; phone: string };
  } | null> => {
    const res = await fetch("/api/sns/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json().catch(() => ({ ok: false }));
    if (!data.ok || !data.charge?.id) {
      setError(data.error ?? "충전 신청에 실패했습니다");
      return null;
    }
    return { id: data.charge.id, buyer: data.buyer ?? { name: "", phone: "" } };
  };

  /**
   * 이노페이 카드 결제 — 결제창을 띄우고 나면 이 화면을 떠난다.
   *
   * 결제창이 성공을 돌려줘도 그것만으로 잔액이 오르지 않는다. 인증이 끝나면 이노페이가
   * 우리 서버의 리턴 라우트를 부르고, 서버가 승인 API 를 호출해 금액까지 맞을 때만
   * 반영한 뒤 이 화면으로 되돌려 보낸다. 브라우저가 보낸 값은 어느 단계에서도 믿지 않는다.
   */
  const payWithInnopay = async () => {
    const created = await createCharge();
    if (!created) {
      setLoading(false);
      return;
    }
    try {
      await loadInnopaySdk();
    } catch {
      setError("결제창을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요");
      setLoading(false);
      load();
      return;
    }
    if (!window.innopay) {
      setError("결제창을 열지 못했습니다. 잠시 후 다시 시도해 주세요");
      setLoading(false);
      return;
    }
    window.innopay.goPay({
      payMethod: "CARD",
      mid: INNOPAY_MID,
      moid: `hrgchg${created.id}`,
      goodsName: "SNS 부스트 예치금 충전",
      amt: String(amount),
      buyerName: created.buyer.name,
      buyerTel: created.buyer.phone,
      buyerEmail: "",
      returnUrl: `${window.location.origin}/api/sns/charge/innopay/return`,
    });
    // 결제창이 뜨면 그다음은 리턴 라우트가 이어받는다. 버튼은 잠근 채로 둔다.
  };

  /**
   * 포트원 카드 결제 — 포트원이 지원하는 PG 를 쓸 때의 경로.
   *
   * 결제창이 성공을 돌려줘도 그것만으로 잔액을 올리지 않는다. 서버가 포트원 API 에
   * 다시 물어서 PAID 와 금액이 맞을 때만 반영한다 — 브라우저 응답은 위조될 수 있다.
   */
  const payWithCard = async () => {
    if (!amount || amount < 5000) {
      setError("최소 5,000원부터 충전할 수 있어요.");
      return;
    }
    setLoading(true);
    setError("");

    // 이노페이가 설정돼 있으면 그쪽이 우선이다 (포트원 지원 목록에 없는 PG 라 직접 붙였다)
    if (INNOPAY_READY) {
      await payWithInnopay();
      return;
    }

    try {
      const created = await createCharge();
      if (!created) {
        setLoading(false);
        return;
      }

      const PortOne = await import("@portone/browser-sdk/v2");
      const paid = await PortOne.default.requestPayment({
        storeId: STORE_ID,
        channelKey: CHANNEL_KEY,
        paymentId: `harang-charge-${created.id}`,
        orderName: `SNS 부스트 예치금 ${won(amount)}원`,
        totalAmount: amount,
        currency: "KRW",
        payMethod: "CARD",
        redirectUrl: `${window.location.origin}/sns/charge`,
      });

      // 사용자가 창을 닫았거나 카드사에서 막힌 경우 — 신청 건은 입금 대기로 남는다
      if (paid?.code) {
        setError(paid.message ?? "결제가 완료되지 않았습니다");
        setLoading(false);
        load();
        return;
      }

      const check = await fetch("/api/sns/charge/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: `harang-charge-${created.id}` }),
      });
      const result = await check.json().catch(() => ({ ok: false }));
      if (result.ok && result.status === "paid") {
        setDone(`${won(amount)}원이 충전되었습니다`);
        setCustom("");
      } else if (result.ok) {
        setDone("결제가 접수되었습니다. 확인되는 대로 잔액에 반영됩니다");
      } else {
        setError(result.error ?? "결제 확인에 실패했습니다");
      }
      load();
    } catch {
      setError("결제창을 열지 못했습니다. 잠시 후 다시 시도해 주세요");
    }
    setLoading(false);
  };

  const copyBank = async () => {
    try {
      await navigator.clipboard.writeText(bank);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 미지원 브라우저는 무시
    }
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center" style={{ background: "var(--w-bg-alt)" }}>
        <Loader2 className="animate-spin" size={26} style={{ color: "var(--w-text-disabled)" }} />
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-10 md:py-14" style={{ background: "var(--w-bg-alt)" }}>
      <div className="mx-auto w-full max-w-[560px]">
        <Link
          href="/sns/me"
          className="w-label-2 mb-5 inline-flex items-center gap-1.5 hover:underline"
          style={{ color: "var(--w-text-muted)" }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          마이페이지
        </Link>

        <div className="mb-6">
          <h1 className="w-heading-2" style={{ color: "var(--w-text)" }}>
            예치금 충전
          </h1>
          <p className="w-body-2 mt-2" style={{ color: "var(--w-text-muted)" }}>
            {CARD_READY
              ? "금액을 고르고 카드로 바로 결제하거나, 계좌로 입금하실 수 있습니다."
              : "금액을 고르고 신청한 뒤 안내 계좌로 입금하시면, 확인 후 잔액에 반영됩니다."}
          </p>
        </div>

        {done ? (
          <section className="w-card p-7">
            <div className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: "var(--w-success-weak)" }}
              >
                <Check size={16} strokeWidth={3} style={{ color: "var(--w-success-dark)" }} />
              </span>
              <h2 className="w-title-3" style={{ color: "var(--w-text)" }}>
                {done}
              </h2>
            </div>
            <div className="mt-5 flex gap-2">
              <Link href="/sns/me" className="w-btn w-btn-primary flex-1">
                마이페이지로
              </Link>
              <button onClick={() => setDone("")} className="w-btn w-btn-secondary flex-1">
                더 충전하기
              </button>
            </div>
          </section>
        ) : submitted ? (
          <section className="w-card p-7">
            <div className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: "var(--w-success-weak)" }}
              >
                <Check size={16} strokeWidth={3} style={{ color: "var(--w-success-dark)" }} />
              </span>
              <h2 className="w-title-3" style={{ color: "var(--w-text)" }}>
                충전 신청이 접수되었습니다
              </h2>
            </div>

            <div
              className="mt-5 rounded-[12px] px-5 py-4"
              style={{ background: "var(--w-bg-sunken)" }}
            >
              <p className="w-label-2" style={{ color: "var(--w-text-muted)" }}>
                입금하실 금액
              </p>
              <p className="w-heading-1 w-num mt-0.5" style={{ color: "var(--w-text)" }}>
                {won(submitted)}원
              </p>
            </div>

            <div
              className="mt-3 rounded-[12px] px-5 py-4"
              style={{ background: "var(--w-primary-weaker)", border: "1px solid var(--w-primary-border)" }}
            >
              <p className="w-label-2 flex items-center gap-1.5" style={{ color: "var(--w-primary-active)" }}>
                <Landmark size={13} strokeWidth={2.5} />
                입금 계좌
              </p>
              <p className="w-body-1 mt-1 font-bold" style={{ color: "var(--w-text)" }}>
                {bank}
              </p>
              <button onClick={copyBank} className="w-btn w-btn-secondary w-btn-sm mt-3">
                <Copy size={13} strokeWidth={2.5} />
                {copied ? "복사됨" : "계좌 복사"}
              </button>
            </div>

            <p className="w-help">입금자명이 가입하신 이름과 다르면 확인이 늦어질 수 있어요.</p>

            <button onClick={() => setSubmitted(null)} className="w-btn w-btn-secondary mt-5 w-full">
              다른 금액 더 충전하기
            </button>
          </section>
        ) : (
          <section className="w-card p-7">
            <p className="w-field-label">충전 금액</p>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((p) => {
                const active = !custom && preset === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPreset(p);
                      setCustom("");
                    }}
                    className="w-num h-[52px] rounded-[12px] text-[15px] font-bold transition-colors"
                    style={
                      active
                        ? {
                            background: "var(--w-primary-weak)",
                            color: "var(--w-primary-active)",
                            border: "1px solid var(--w-primary)",
                          }
                        : {
                            background: "var(--w-bg)",
                            color: "var(--w-text-sub)",
                            border: "1px solid var(--w-border)",
                          }
                    }
                  >
                    {won(p)}
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <label className="w-field-label" htmlFor="custom">
                직접 입력
              </label>
              <div className="relative">
                <input
                  id="custom"
                  inputMode="numeric"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="예: 70000"
                  className="w-input w-num pr-10"
                />
                <span
                  className="w-body-2 absolute right-4 top-1/2 -translate-y-1/2 font-bold"
                  style={{ color: "var(--w-text-assist)" }}
                >
                  원
                </span>
              </div>
            </div>

            <div
              className="mt-5 flex items-center justify-between rounded-[12px] px-5 py-4"
              style={{ background: "var(--w-bg-sunken)" }}
            >
              <span className="w-label-1" style={{ color: "var(--w-text-muted)" }}>
                충전 금액
              </span>
              <span className="w-title-2 w-num" style={{ color: "var(--w-text)" }}>
                {won(amount || 0)}원
              </span>
            </div>

            {CARD_READY && (
              <div className="mt-5">
                <p className="w-field-label">결제 방법</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { key: "card" as const, label: "카드 결제", icon: CreditCard, help: "바로 충전됩니다" },
                    { key: "bank" as const, label: "무통장 입금", icon: Landmark, help: "확인 후 반영됩니다" },
                  ]).map((m) => {
                    const active = method === m.key;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => {
                          setMethod(m.key);
                          setError("");
                        }}
                        className="flex flex-col items-start gap-1 rounded-[12px] px-4 py-3 text-left transition-colors"
                        style={
                          active
                            ? {
                                background: "var(--w-primary-weak)",
                                border: "1px solid var(--w-primary)",
                              }
                            : { background: "var(--w-bg)", border: "1px solid var(--w-border)" }
                        }
                      >
                        <span
                          className="w-label-1 flex items-center gap-1.5 font-bold"
                          style={{ color: active ? "var(--w-primary-active)" : "var(--w-text-sub)" }}
                        >
                          <Icon size={14} strokeWidth={2.5} />
                          {m.label}
                        </span>
                        <span className="w-caption-1" style={{ color: "var(--w-text-assist)" }}>
                          {m.help}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {error && <p className="w-error-text mt-3">{error}</p>}

            <button
              onClick={method === "card" ? payWithCard : submit}
              disabled={loading}
              className="w-btn w-btn-primary mt-5 w-full"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {method === "card" ? "결제창 여는 중" : "신청 중"}
                </>
              ) : method === "card" ? (
                `${won(amount || 0)}원 결제하기`
              ) : (
                "충전 신청하기"
              )}
            </button>
            <p className="w-help text-center">
              {method === "card"
                ? "카드 결제는 승인 즉시 잔액에 반영됩니다."
                : "신청 후 안내되는 계좌로 입금하시면 됩니다."}
            </p>

            {TEST_MODE && (
              <p
                className="w-caption-1 mt-4 rounded-[10px] px-4 py-3 text-center"
                style={{ background: "var(--w-bg-sunken)", color: "var(--w-text-assist)" }}
              >
                지금은 결제 심사용 테스트모드입니다. 실제로 돈이 빠져나가지 않습니다.
              </p>
            )}
          </section>
        )}

        {charges.length > 0 && (
          <section className="w-card mt-4 overflow-hidden">
            <p className="w-label-1 px-6 py-4 font-bold" style={{ color: "var(--w-text)", borderBottom: "1px solid var(--w-line)" }}>
              충전 신청 내역
            </p>
            <ul>
              {charges.map((c, i) => {
                const s = STATUS[c.status] ?? { label: c.status, chip: "w-chip-neutral" };
                return (
                  <li
                    key={c.id}
                    className="flex items-center justify-between px-6 py-4"
                    style={i > 0 ? { borderTop: "1px solid var(--w-line)" } : undefined}
                  >
                    <div>
                      <p className="w-label-1 w-num font-bold" style={{ color: "var(--w-text)" }}>
                        {won(c.amount)}원
                      </p>
                      <p className="w-caption-1" style={{ color: "var(--w-text-assist)" }}>
                        {new Date(c.createdAt).toLocaleString("ko-KR")}
                      </p>
                    </div>
                    <span className={`w-chip ${s.chip}`}>{s.label}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
