"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2 } from "lucide-react";

const BENEFITS = [
  "입금 확인을 기다리지 않고 주문 즉시 진행",
  "충전·사용 내역과 잔액을 한 화면에서 확인",
  "주문 진행률과 잔여 수량 실시간 조회",
];

export default function SnsSignupPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sns/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password }),
      });
      const data = await res.json().catch(() => ({ ok: false, error: `서버 오류 (${res.status})` }));
      if (data.ok) {
        window.location.href = "/sns/me";
        return;
      }
      setError(data.error ?? "가입에 실패했습니다");
      setLoading(false);
    } catch {
      setError("네트워크 오류로 가입하지 못했습니다. 다시 시도해 주세요.");
      setLoading(false);
    }
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center px-5 py-16"
      style={{ background: "var(--w-bg-alt)" }}
    >
      <div className="w-full max-w-[400px]">
        <div className="mb-8">
          <p className="w-label-2" style={{ color: "var(--w-primary)" }}>
            SNS 부스트 스토어
          </p>
          <h1 className="w-heading-2 mt-1.5" style={{ color: "var(--w-text)" }}>
            회원가입
          </h1>
          <p className="w-body-2 mt-2" style={{ color: "var(--w-text-muted)" }}>
            가입하고 예치금을 충전하면 주문이 훨씬 빨라집니다.
          </p>
        </div>

        <ul
          className="mb-5 rounded-[12px] px-5 py-4"
          style={{ background: "var(--w-primary-weaker)", border: "1px solid var(--w-primary-border)" }}
        >
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2 py-1">
              <Check size={15} strokeWidth={3} className="mt-0.5 shrink-0" style={{ color: "var(--w-primary)" }} />
              <span className="w-label-1" style={{ color: "var(--w-text-sub)" }}>
                {b}
              </span>
            </li>
          ))}
        </ul>

        <form onSubmit={submit} className="w-card p-7">
          <div className="mb-5">
            <label className="w-field-label" htmlFor="name">
              이름
            </label>
            <input
              id="name"
              type="text"
              required
              autoFocus
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-input"
            />
          </div>

          <div className="mb-5">
            <label className="w-field-label" htmlFor="phone">
              휴대폰 번호
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              required
              autoComplete="username"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678"
              className="w-input w-num"
            />
            <p className="w-help">로그인 아이디로 쓰입니다. 하이픈은 넣지 않아도 돼요.</p>
          </div>

          <div className="mb-5">
            <label className="w-field-label" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자 이상"
              className="w-input"
            />
          </div>

          {error && <p className="w-error-text mb-4">{error}</p>}

          <button type="submit" disabled={loading} className="w-btn w-btn-primary w-full">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                가입 중
              </>
            ) : (
              <>
                가입하고 시작하기
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>

          <p className="w-caption-1 mt-4 text-center" style={{ color: "var(--w-text-assist)" }}>
            가입하면{" "}
            <Link href="/terms" target="_blank" className="underline">
              이용약관
            </Link>
            {" · "}
            <Link href="/privacy" target="_blank" className="underline">
              개인정보처리방침
            </Link>
            에 동의하는 것으로 봅니다.
          </p>
        </form>

        <p className="w-label-1 mt-6 text-center" style={{ color: "var(--w-text-muted)" }}>
          이미 회원이신가요?{" "}
          <Link href="/sns/login" className="font-bold hover:underline" style={{ color: "var(--w-primary)" }}>
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
