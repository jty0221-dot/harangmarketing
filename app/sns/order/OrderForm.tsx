"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Link2, Phone, User, Send, CheckCircle2, Copy, Search,
  MessageCircle, AlertTriangle, Loader2, Minus, Plus, Wallet,
} from "lucide-react";
import {
  SNS_PLATFORMS, SNS_PRODUCTS, getProduct, productsByPlatform,
  calcTotal, won, STORE, platformName,
} from "../../lib/sns-store";
import { PlatformLogo } from "../PlatformLogo";

const KAKAO_CHAT = "https://pf.kakao.com/_MuUkG/chat";

interface DoneInfo {
  no: string;
  total: number;
  bank: string | null;
  /** 회원 예치금으로 결제된 주문 — 입금 안내 대신 잔액을 보여준다 */
  paidByBalance?: boolean;
  balanceAfter?: number;
  notice?: string;
}

interface Me {
  name: string;
  balance: number;
}

export default function OrderForm({ initialSlug }: { initialSlug: string | null }) {
  const initial = (initialSlug && getProduct(initialSlug)) || SNS_PRODUCTS[0];

  const [slug, setSlug] = useState(initial.slug);
  const product = getProduct(slug) ?? SNS_PRODUCTS[0];

  const [qty, setQty] = useState<number>(initial.min);
  const [qtyText, setQtyText] = useState<string>(String(initial.min));
  const [link, setLink] = useState("");
  const [contact, setContact] = useState("");
  const [depositor, setDepositor] = useState("");
  const [comments, setComments] = useState("");
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState(""); // 봇 트랩 — 화면에는 안 보인다
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<DoneInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [me, setMe] = useState<Me | null>(null); // 로그인 회원이면 예치금으로 결제한다

  useEffect(() => {
    let alive = true;
    fetch("/api/sns/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d?.ok) setMe({ name: d.member.name, balance: d.member.balance });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const commentLines = useMemo(
    () => comments.split("\n").map((l) => l.trim()).filter(Boolean),
    [comments]
  );
  const effectiveQty = product.needsComments ? commentLines.length : qty;
  const total = calcTotal(product, Math.max(0, effectiveQty));
  const qtyValid =
    Number.isInteger(effectiveQty) && effectiveQty >= product.min && effectiveQty <= product.max;

  const changeProduct = (nextSlug: string) => {
    const next = getProduct(nextSlug);
    if (!next) return;
    setSlug(nextSlug);
    setQty(next.min);
    setQtyText(String(next.min));
    setError("");
  };

  const setQtyClamped = (n: number) => {
    const v = Math.max(product.min, Math.min(product.max, n));
    setQty(v);
    setQtyText(String(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!qtyValid) {
      setError(`수량은 ${won(product.min)}~${won(product.max)}${product.unitLabel} 사이로 입력해 주세요.`);
      return;
    }
    if (!agree) {
      setError("주문 유의사항 동의에 체크해 주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/sns/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.slug,
          qty: effectiveQty,
          link,
          contact,
          depositor,
          comments: product.needsComments ? comments : undefined,
          website,
        }),
      });
      const data = await res.json().catch(() => ({ ok: false, error: `서버 오류 (${res.status})` }));
      if (!data.ok) {
        setError(data.error ?? "접수 중 문제가 생겼습니다.");
      } else {
        setDone({
          no: data.no,
          total: data.total,
          bank: data.bank ?? null,
          paidByBalance: data.paidByBalance,
          balanceAfter: data.balanceAfter,
          notice: data.notice,
        });
        if (data.paidByBalance && typeof data.balanceAfter === "number") {
          setMe((m) => (m ? { ...m, balance: data.balanceAfter } : m));
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("네트워크 오류입니다. 잠시 후 다시 시도해 주세요.");
    }
    setSubmitting(false);
  };

  const copyNo = async () => {
    if (!done) return;
    try {
      await navigator.clipboard.writeText(done.no);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 미지원 브라우저는 무시
    }
  };

  /* ───────────── 접수 완료 화면 ───────────── */
  if (done) {
    return (
      <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm flex items-center justify-center ring-1 ring-emerald-700/20">
            <CheckCircle2 size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-black text-gray-900">
            {done.paidByBalance ? "결제 완료 · 주문이 시작되었습니다" : "주문이 접수되었습니다"}
          </h2>
        </div>

        <div className="mt-5 rounded-2xl bg-gray-50 ring-1 ring-gray-100 p-5 text-center">
          <p className="text-[11px] font-black tracking-widest text-gray-400">주문번호</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-2xl md:text-3xl font-black tracking-wide text-gray-900 tabular-nums">{done.no}</span>
            <button
              onClick={copyNo}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="주문번호 복사"
            >
              <Copy size={15} strokeWidth={2.2} />
            </button>
          </div>
          {copied && <p className="mt-1 text-[11px] font-bold text-emerald-600">복사되었습니다</p>}
          <p className="mt-2 text-sm text-gray-600">
            {done.paidByBalance ? "결제 금액" : "입금하실 금액"}{" "}
            <strong className="font-black text-gray-900">{won(done.total)}원</strong>
          </p>
        </div>

        {done.paidByBalance ? (
          <div className="mt-4 rounded-2xl ring-1 p-5 text-[13px] leading-relaxed bg-emerald-50/60 ring-emerald-100 text-gray-700">
            <p className="font-black text-gray-900">예치금에서 결제되었습니다</p>
            <p className="mt-1">
              남은 잔액{" "}
              <strong className="text-[15px] font-black text-emerald-700 tabular-nums">
                {won(done.balanceAfter ?? 0)}원
              </strong>
            </p>
            <p className="mt-2">{done.notice ?? STORE.startNote}</p>
          </div>
        ) : (
        <div className="mt-4 rounded-2xl ring-1 p-5 text-[13px] leading-relaxed bg-blue-50/60 ring-blue-100 text-gray-700">
          {done.bank ? (
            <>
              <p className="font-black text-gray-900">입금 계좌</p>
              <p className="mt-1 text-[15px] font-black text-blue-700">{done.bank}</p>
              <p className="mt-2">
                입금자명을 주문서와 같게 해주시면 확인이 가장 빠릅니다.
                {" "}{STORE.startNote}
              </p>
            </>
          ) : (
            <>
              <p className="font-black text-gray-900">입금 안내는 카카오톡으로 드립니다</p>
              <p className="mt-1">
                아래 버튼으로 카카오톡 채널에 <strong className="font-bold">주문번호 {done.no}</strong> 를
                보내주시면 입금 계좌를 바로 안내해 드립니다. {STORE.startNote}
              </p>
            </>
          )}
        </div>
        )}

        <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
          {done.paidByBalance ? (
            <Link
              href="/sns/me"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-black text-white transition hover:bg-gray-800"
            >
              <Wallet size={15} strokeWidth={2.2} />
              마이페이지에서 진행 보기
            </Link>
          ) : (
            <a
              href={KAKAO_CHAT}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-400 px-5 py-3 text-sm font-black text-gray-900 transition hover:bg-blue-300"
            >
              <MessageCircle size={15} strokeWidth={2.2} />
              카카오톡 채널 열기
            </a>
          )}
          <Link
            href="/sns/track"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-50"
          >
            <Search size={15} strokeWidth={2.2} />
            주문 조회하기
          </Link>
        </div>

        <p className="mt-4 text-[11px] text-gray-400">
          {done.paidByBalance
            ? "마이페이지에서 주문 진행률과 잔액을 언제든 확인할 수 있습니다."
            : "주문번호와 연락처만 있으면 언제든 진행 상황을 조회할 수 있습니다. 이 화면을 캡처해 두셔도 좋습니다."}
        </p>
      </div>
    );
  }

  /* ───────────── 주문 폼 ───────────── */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 회원 예치금 안내 — 로그인 상태면 잔액에서 즉시 결제된다 */}
      {me ? (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] px-5 py-4"
          style={{ background: "var(--w-primary-weaker)", border: "1px solid var(--w-primary-border)" }}
        >
          <div className="flex items-center gap-2.5">
            <Wallet size={16} strokeWidth={2.5} style={{ color: "var(--w-primary)" }} />
            <div>
              <p className="w-caption-1" style={{ color: "var(--w-text-muted)" }}>
                {me.name}님 예치금 잔액
              </p>
              <p className="w-title-2 w-num" style={{ color: "var(--w-text)" }}>
                {won(me.balance)}원
              </p>
            </div>
          </div>
          <Link href="/sns/charge" className="w-btn w-btn-secondary w-btn-sm">
            충전하기
          </Link>
        </div>
      ) : (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] px-5 py-4"
          style={{ background: "var(--w-primary-weaker)", border: "1px solid var(--w-primary-border)" }}
        >
          <p className="w-label-1" style={{ color: "var(--w-text-sub)" }}>
            <strong style={{ color: "var(--w-text)" }}>회원으로 주문하면</strong> 예치금 잔액에서 바로 결제되고
            입금 확인 없이 즉시 시작됩니다.
          </p>
          <div className="flex gap-2">
            <Link href="/sns/login" className="w-btn w-btn-secondary w-btn-sm">
              로그인
            </Link>
            <Link href="/sns/signup" className="w-btn w-btn-primary w-btn-sm">
              회원가입
            </Link>
          </div>
        </div>
      )}

      {/* 상품 선택 */}
      <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-5 md:p-6">
        {/* 선택된 상품 미리보기 */}
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 ring-1 ring-gray-100 p-3.5">
          <PlatformLogo id={product.platform} size={44} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-gray-400">{platformName(product.platform)}</p>
            <p className="text-[15px] font-black text-gray-900 truncate">{product.name}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold text-gray-400">1{product.unitLabel}당</p>
            <p className="text-[17px] font-black text-blue-600 tabular-nums leading-tight">{won(product.unitPrice)}원</p>
          </div>
        </div>

        <label className="block text-xs font-black text-gray-700 mb-1.5">상품 변경</label>
        <select
          value={slug}
          onChange={(e) => changeProduct(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base bg-white focus:border-blue-400 focus:outline-none transition-colors"
        >
          {SNS_PLATFORMS.map((pl) => {
            const list = productsByPlatform(pl.id);
            if (list.length === 0) return null;
            return (
              <optgroup key={pl.id} label={pl.name}>
                {list.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} — {won(p.unitPrice)}원/{p.unitLabel}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
        <p className="mt-2 text-[12.5px] leading-relaxed text-gray-500">{product.desc}</p>

        {/* 수량 */}
        {product.needsComments ? (
          <div className="mt-4">
            <label className="block text-xs font-black text-gray-700 mb-1.5">
              댓글 내용 <span className="font-bold text-gray-400">(한 줄에 하나 · 줄 수 = 수량)</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={5}
              placeholder={"사장님 여기 진짜 맛있어요\n분위기 최고네요 재방문 의사 100%"}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:border-blue-400 focus:outline-none transition-colors"
            />
            <p className="mt-1.5 text-[11px] text-gray-400 tabular-nums">
              현재 {won(commentLines.length)}개 · 최소 {won(product.min)}개 ~ 최대 {won(product.max)}개
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <label className="block text-xs font-black text-gray-700 mb-1.5">
              수량 <span className="font-bold text-gray-400">({won(product.min)}~{won(product.max)}{product.unitLabel})</span>
            </label>
            <div className="flex items-stretch gap-2">
              <button
                type="button"
                onClick={() => setQtyClamped(qty - product.step)}
                className="w-11 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center transition-colors"
                aria-label="수량 줄이기"
              >
                <Minus size={15} strokeWidth={2.5} />
              </button>
              <input
                inputMode="numeric"
                value={qtyText}
                onChange={(e) => {
                  const t = e.target.value.replace(/[^0-9]/g, "");
                  setQtyText(t);
                  setQty(t === "" ? 0 : parseInt(t, 10));
                }}
                onBlur={() => setQtyClamped(qty || product.min)}
                className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-gray-200 text-base text-center font-black tabular-nums focus:border-blue-400 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setQtyClamped(qty + product.step)}
                className="w-11 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center transition-colors"
                aria-label="수량 늘리기"
              >
                <Plus size={15} strokeWidth={2.5} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[product.min, product.min * 2, product.min * 5, product.min * 10]
                .filter((n, i, arr) => n <= product.max && arr.indexOf(n) === i)
                .map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setQtyClamped(n)}
                    className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] font-bold text-gray-500 ring-1 ring-gray-200 hover:bg-gray-100 transition-colors tabular-nums"
                  >
                    {won(n)}{product.unitLabel}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* 링크 · 연락처 */}
      <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-5 md:p-6 space-y-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-black text-gray-700 mb-1.5">
            <Link2 size={12} strokeWidth={2.5} className="text-blue-600" />
            {product.linkLabel}
          </label>
          <input
            required
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder={product.linkHint}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:border-blue-400 focus:outline-none transition-colors"
          />
          <p className="mt-1.5 text-[11px] text-gray-400">
            비공개 계정은 진행되지 않습니다. 링크가 틀리면 환불이 어려우니 한 번 더 확인해 주세요.
          </p>
        </div>

        {!me && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-black text-gray-700 mb-1.5">
              <Phone size={12} strokeWidth={2.5} className="text-blue-600" />
              연락처 (전화번호 또는 카톡 ID)
            </label>
            <input
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:border-blue-400 focus:outline-none transition-colors"
            />
            <p className="mt-1.5 text-[11px] text-gray-400">주문 조회할 때 본인 확인용으로 씁니다.</p>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-black text-gray-700 mb-1.5">
              <User size={12} strokeWidth={2.5} className="text-blue-600" />
              입금자명
            </label>
            <input
              required
              value={depositor}
              onChange={(e) => setDepositor(e.target.value)}
              placeholder="입금하실 분 성함"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:border-blue-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
        )}

        {/* 봇 트랩 — 사람에게는 보이지 않는다 */}
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] w-px h-px opacity-0"
          placeholder="홈페이지"
        />

        <label className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            주문 유의사항에 동의합니다 — 작업 시작 전 전액 환불, 시작 후 미진행 수량 환불.
            검색 순위·알고리즘 노출은 보장 대상이 아닙니다. 연락처는 주문 확인·조회에만 사용됩니다.{" "}
            <Link href="/refund" target="_blank" className="font-bold text-blue-600 underline underline-offset-2">
              환불 규정
            </Link>
          </span>
        </label>
      </div>

      {/* 금액 요약 + 접수 */}
      <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-5 md:p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {product.name} × <span className="tabular-nums">{won(Math.max(0, effectiveQty))}</span>{product.unitLabel}
          </div>
          <div className="text-right">
            <p className="text-[11px] font-black tracking-widest text-gray-400">결제 금액</p>
            <p className="text-2xl font-black text-gray-900 tabular-nums">{won(total)}원</p>
          </div>
        </div>

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 ring-1 ring-red-100 px-4 py-2.5 text-[12.5px] font-bold text-red-600">
            <AlertTriangle size={14} strokeWidth={2.5} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* 회원 — 잔액이 모자라면 결제 전에 알려주고 충전으로 보낸다 */}
        {me && qtyValid && me.balance < total && (
          <div
            className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-[12px] px-4 py-3"
            style={{ background: "var(--w-warning-weak)" }}
          >
            <p className="w-label-1 w-num font-bold" style={{ color: "var(--w-warning-dark)" }}>
              잔액이 {won(total - me.balance)}원 부족합니다 (보유 {won(me.balance)}원)
            </p>
            <Link
              href="/sns/charge"
              className="w-btn w-btn-sm"
              style={{ background: "var(--w-warning-dark)", color: "#fff" }}
            >
              충전하기
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || (!!me && me.balance < total)}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-[15px] font-black text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} strokeWidth={2.2} />}
          {submitting ? (me ? "결제 중..." : "접수 중...") : me ? "잔액으로 결제하고 주문" : "주문 접수하기"}
        </button>
        <p className="mt-2.5 text-center text-[11px] text-gray-400">
          {me
            ? "예치금에서 즉시 결제되고 바로 시작됩니다. 시작 전에는 전액 환불됩니다."
            : "접수 후 입금 안내가 나옵니다. 입금 전에는 비용이 발생하지 않습니다."}
        </p>
      </div>
    </form>
  );
}
