"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export default function SnsLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sns/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json().catch(() => ({ ok: false, error: `서버 오류 (${res.status})` }));
      if (data.ok) {
        router.replace("/sns/me");
        router.refresh();
        return;
      }
      setError(data.error ?? "로그인에 실패했습니다");
      setLoading(false);
    } catch {
      setError("네트워크 오류로 로그인하지 못했습니다. 다시 시도해 주세요.");
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
            로그인
          </h1>
          <p className="w-body-2 mt-2" style={{ color: "var(--w-text-muted)" }}>
            충전한 예치금으로 입금 확인 없이 바로 주문할 수 있어요.
          </p>
        </div>

        <form onSubmit={submit} className="w-card p-7">
          <div className="mb-5">
            <label className="w-field-label" htmlFor="phone">
              휴대폰 번호
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              required
              autoFocus
              autoComplete="username"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678"
              className={`w-input w-num${error ? " w-input-error" : ""}`}
            />
          </div>

          <div className="mb-5">
            <label className="w-field-label" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-input${error ? " w-input-error" : ""}`}
            />
          </div>

          {error && <p className="w-error-text mb-4">{error}</p>}

          <button type="submit" disabled={loading} className="w-btn w-btn-primary w-full">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                확인 중
              </>
            ) : (
              <>
                로그인
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        <p className="w-label-1 mt-6 text-center" style={{ color: "var(--w-text-muted)" }}>
          아직 회원이 아니신가요?{" "}
          <Link href="/sns/signup" className="font-bold hover:underline" style={{ color: "var(--w-primary)" }}>
            회원가입
          </Link>
        </p>
        <p className="w-caption-1 mt-3 text-center">
          <Link href="/sns" className="hover:underline" style={{ color: "var(--w-text-assist)" }}>
            스토어 둘러보기
          </Link>
        </p>
      </div>
    </main>
  );
}
