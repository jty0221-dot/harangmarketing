"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";

export default function SnsLoginPage() {
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
        window.location.href = "/sns/me";
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
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 items-center justify-center shadow-sm ring-1 ring-slate-900/10 mb-3">
            <LogIn size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-black text-slate-900">SNS 부스트 로그인</h1>
          <p className="text-xs text-slate-400 mt-1">충전한 잔액으로 바로 주문하세요</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-100 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">휴대폰 번호</label>
            <input
              type="tel"
              inputMode="numeric"
              required
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base focus:border-blue-400 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">비밀번호</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base focus:border-blue-400 focus:outline-none transition-colors"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-colors"
          >
            {loading ? "확인 중..." : "로그인"}
            {!loading && <ArrowRight size={15} strokeWidth={2.5} />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          아직 회원이 아니세요?{" "}
          <Link href="/sns/signup" className="font-bold text-blue-600 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
