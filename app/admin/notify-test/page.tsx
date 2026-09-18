"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, X, Loader2, RefreshCw, Send, AlertTriangle } from "lucide-react";
import { AdminHeader, AdminFooter } from "../AdminNav";

/**
 * 카카오톡 알림 점검 (관리자)
 * 홈페이지 문의가 들어올 때 대표 카카오톡으로 알림이 가는지 여기서 확인한다.
 * 값은 이 화면에 나오지 않는다. 꽂혀 있다 · 없다만 나온다.
 */

interface EnvStatus {
  hasRestApiKey: boolean;
  hasRefreshToken: boolean;
  ready: boolean;
}

interface SendResult {
  ok: boolean;
  skipped?: boolean;
  step: string;
  error?: string;
}

const STEP_LABEL: Record<string, string> = {
  env: "환경변수 확인",
  token: "토큰 재발급",
  send: "카카오 발송",
};

function Row({ label, on, hint }: { label: string; on: boolean; hint: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span
        className={`mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-lg ${
          on ? "bg-emerald-600" : "bg-gray-300"
        }`}
      >
        {on ? (
          <Check size={13} className="text-white" strokeWidth={3} />
        ) : (
          <X size={13} className="text-white" strokeWidth={3} />
        )}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-gray-900 font-mono">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{on ? "꽂혀 있습니다" : hint}</p>
      </div>
    </div>
  );
}

export default function AdminNotifyTestPage() {
  const router = useRouter();
  const [env, setEnv] = useState<EnvStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notify-test", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "상태를 불러오지 못했습니다");
      setEnv(data.env as EnvStatus);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // 첫 불러오기 · effect 안에서 바로 setState 하지 않도록 한 틱 미룬다
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function sendTest() {
    setSending(true);
    setResult(null);
    setMessage("");
    try {
      const res = await fetch("/api/admin/notify-test", { method: "POST", cache: "no-store" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setEnv(data.env as EnvStatus);
      setResult(data.result as SendResult);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="min-w-0">
            <h1 className="text-xl font-black text-gray-900">카카오톡 알림 점검</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              홈페이지 문의가 들어오면 대표님 카카오톡으로 알림이 갑니다. 그 길이 열려 있는지 여기서 확인합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-white ring-1 ring-gray-200 px-3 py-2.5 text-xs font-black text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            새로고침
          </button>
        </div>

        {message && (
          <div className="mb-4 text-xs font-bold text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
            {message}
          </div>
        )}

        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 md:p-6 mb-4">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-1">환경변수</h2>
          <p className="text-xs text-gray-400 mb-2">
            Vercel 프로젝트 설정에 넣는 값 둘입니다. 화면에는 꽂혀 있다 · 없다만 나옵니다.
          </p>
          {loading && !env ? (
            <p className="text-xs text-gray-400 py-3">읽는 중입니다</p>
          ) : (
            <div className="divide-y divide-gray-100">
              <Row
                label="KAKAO_REST_API_KEY"
                on={Boolean(env?.hasRestApiKey)}
                hint="카카오 개발자 콘솔의 REST API 키입니다"
              />
              <Row
                label="KAKAO_REFRESH_TOKEN"
                on={Boolean(env?.hasRefreshToken)}
                hint="talk_message 동의를 받고 발급한 리프레시 토큰입니다"
              />
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 md:p-6 mb-4">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-1">시험 발송</h2>
          <p className="text-xs text-gray-400 mb-4">
            누르면 대표님 카카오톡 나와의 채팅으로 한 통 갑니다. 고객에게는 가지 않습니다.
          </p>
          <button
            type="button"
            onClick={sendTest}
            disabled={sending || !env?.ready}
            className="flex items-center gap-1.5 rounded-xl bg-[#0066FF] px-4 py-2.5 text-xs font-black text-white hover:bg-blue-700 disabled:opacity-40"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            시험 알림 보내기
          </button>
          {!env?.ready && !loading && (
            <p className="flex items-start gap-1.5 text-xs text-amber-700 mt-3">
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              환경변수가 채워지기 전까지는 보낼 수 없습니다. 문의 접수 자체는 그대로 됩니다.
            </p>
          )}

          {result && (
            <div
              className={`mt-4 rounded-xl px-4 py-3 text-xs ring-1 ${
                result.ok
                  ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                  : "bg-red-50 text-red-800 ring-red-200"
              }`}
            >
              <p className="font-black flex items-center gap-1.5">
                <Bell size={13} />
                {result.ok ? "보냈습니다. 카카오톡을 확인해 주세요" : "보내지 못했습니다"}
              </p>
              <p className="mt-1 text-[11px] opacity-80">
                마지막 단계: {STEP_LABEL[result.step] ?? result.step}
              </p>
              {result.error && <p className="mt-1 break-words">{result.error}</p>}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2">알아 두실 것</h2>
          <ul className="space-y-2 text-xs text-gray-500 leading-relaxed">
            <li>
              1) 알림은 <span className="font-semibold text-gray-700">대표님 카카오톡 나와의 채팅</span> 으로 갑니다.
              친구에게 보내는 방식은 카카오 심사를 따로 받아야 해서 쓰지 않았습니다.
            </li>
            <li>
              2) 리프레시 토큰은 <span className="font-semibold text-gray-700">두 달마다 만료</span> 됩니다.
              만료되면 시험 발송이 토큰 재발급 단계에서 멈춥니다. 그때 새 토큰으로 갈아 끼우시면 됩니다.
            </li>
            <li>
              3) 알림이 실패해도 <span className="font-semibold text-gray-700">문의는 그대로 저장</span> 됩니다.
              홈페이지 문의 화면에서 언제든 보실 수 있습니다.
            </li>
          </ul>
        </section>
      </div>
      <AdminFooter />
    </main>
  );
}
