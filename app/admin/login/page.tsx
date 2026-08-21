"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { AdminHeader } from "../AdminNav";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res
        .json()
        .catch(() => ({ ok: false, error: `서버 응답 오류 (${res.status})` }));

      if (data.ok) {
        // 전체 페이지 이동 — 쿠키가 확실히 전송돼 미들웨어를 통과한다
        window.location.href = "/admin";
        return;
      }
      setError(data.error ?? "로그인에 실패했습니다");
      setLoading(false);
    } catch {
      setError("네트워크 오류로 로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader />
      <main className="min-h-[calc(100vh-53px)] bg-gray-950 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-xl">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm mb-5">
          <Lock size={18} className="text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-lg font-black text-gray-900 mb-1">하랑마케팅 관리자</h1>
        <p className="text-xs text-gray-400 mb-6">블로그 글 작성 페이지입니다</p>

        <label className="block text-xs font-bold text-gray-700 mb-1.5">비밀번호</label>
        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-blue-400 focus:outline-none transition-colors mb-4"
        />

        {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-colors"
        >
          {loading ? "확인 중..." : "로그인"}
          {!loading && <ArrowRight size={15} />}
        </button>
      </form>
      </main>
    </>
  );
}
