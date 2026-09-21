"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Check,
  X,
  Loader2,
  RefreshCw,
  Send,
  AlertTriangle,
  Database,
  KeyRound,
  Link2,
  Unlink,
  UserRound,
} from "lucide-react";
import { AdminHeader, AdminFooter } from "../AdminNav";

/**
 * 카카오톡 알림 점검 (관리자)
 * 홈페이지 문의가 들어올 때 대표 카카오톡으로 알림이 가는지 여기서 확인한다.
 * 값은 이 화면에 나오지 않는다. 꽂혀 있다 · 없다만 나온다.
 *
 * 2026-09-21 준수 : 수신자 목록 · 토큰 저장소 상태 · [카카오 계정 연결] · [해제] · 사람별 시험 결과를 더했다.
 *   리프레시 토큰이 두 달마다 죽던 것을 회전 저장으로 이어 붙이고, 환경변수를 손대지 않고
 *   관리자 화면에서 계정을 붙이는 길을 열었다 (청설모 2026-09-21 과 같은 묶음).
 */

interface EnvStatus {
  hasRestApiKey: boolean;
  hasRefreshToken: boolean;
  ready: boolean;
}

interface Recipient {
  id: string;
  label: string;
  source: "env" | "store";
  updatedAt?: string;
  lastOkAt?: string;
  lastError?: string;
}

interface StoreHealth {
  ok: boolean;
  detail: string;
}

interface Report {
  id: string;
  label: string;
  ok: boolean;
  step: string;
  detail: string;
}

interface SendResult {
  ok: boolean;
  skipped?: boolean;
  step: string;
  error?: string;
  reports?: Report[];
}

interface Snapshot {
  env: EnvStatus;
  recipients: Recipient[];
  store: StoreHealth;
}

const STEP_LABEL: Record<string, string> = {
  env: "환경변수 확인",
  token: "토큰 재발급",
  send: "카카오 발송",
};

/** 연결 화면에서 돌아올 때 ?kakao=ok|error&code= 로 붙는 결과 코드 → 사람이 읽는 말 */
const RESULT_CODE_TEXT: Record<string, string> = {
  STATE: "연결 창을 10분 넘게 두었거나 다른 탭에서 열렸습니다. 다시 눌러 주세요",
  NO_REST_KEY: "KAKAO_REST_API_KEY 가 Vercel 에 없습니다",
  NO_SCOPE: "카카오톡 메시지 전송 동의항목이 열려 있지 않습니다. 콘솔에서 talk_message 를 켜고 다시 연결하세요",
  STORE: "토큰 저장에 실패했습니다. 위 토큰 저장소 칸을 확인하세요 (DATABASE_URL · ADMIN_SESSION_SECRET)",
  NETWORK: "카카오 서버에 닿지 못했습니다. 잠시 뒤 다시 눌러 주세요",
  DENIED: "동의 화면에서 취소됐습니다",
  KOE006: "돌아오는 주소가 카카오 콘솔에 등록돼 있지 않습니다 (https://www.harangmarketing.com/api/admin/kakao/callback)",
  KOE010: "카카오 콘솔에 클라이언트 시크릿이 켜져 있습니다. 끄거나 KAKAO_CLIENT_SECRET 을 Vercel 에 넣으세요",
  KOE101: "REST API 키가 이 앱의 키가 아닙니다",
  KOE004: "카카오 콘솔에서 카카오 로그인이 꺼져 있습니다",
  KOE205: "동의항목(카카오톡 메시지 전송)이 열려 있지 않습니다",
};

function fmtTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Dot({ on }: { on: boolean }) {
  return (
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
  );
}

function Row({ label, on, hint, mono = true }: { label: string; on: boolean; hint: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Dot on={on} />
      <div className="min-w-0">
        <p className={`text-sm font-bold text-gray-900 ${mono ? "font-mono" : ""}`}>{label}</p>
        <p className="text-xs text-gray-400 mt-0.5 break-words">{hint}</p>
      </div>
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 md:p-6 mb-4">
      <h2 className="text-base md:text-lg font-bold text-gray-900 mb-1">{title}</h2>
      {desc && <p className="text-xs text-gray-400 mb-2">{desc}</p>}
      {children}
    </section>
  );
}

function NotifyTestInner() {
  const router = useRouter();
  const search = useSearchParams();
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);
  const [message, setMessage] = useState("");
  const [label, setLabel] = useState("");

  const kakaoParam = search.get("kakao");
  const codeParam = search.get("code") ?? "";
  const banner =
    kakaoParam === "ok"
      ? { ok: true, text: "카카오 계정을 연결했습니다. 아래 받는 사람 목록에 올라와 있습니다" }
      : kakaoParam === "error"
        ? {
            ok: false,
            text: `연결 실패 (${codeParam || "UNKNOWN"}) · ${
              RESULT_CODE_TEXT[codeParam] ?? "카카오가 돌려준 오류 코드입니다. 콘솔 설정을 확인하세요"
            }`,
          }
        : null;

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
      setSnap({ env: data.env, recipients: data.recipients ?? [], store: data.store });
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
      setSnap({ env: data.env, recipients: data.recipients ?? [], store: data.store });
      setResult(data.result as SendResult);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  }

  async function remove(r: Recipient) {
    if (!window.confirm(`${r.label} 수신자를 해제할까요? 그 계정으로는 더 이상 알림이 가지 않습니다.`)) return;
    setRemoving(r.id);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/kakao?id=${encodeURIComponent(r.id)}`, {
        method: "DELETE",
        cache: "no-store",
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "해제하지 못했습니다");
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setRemoving(null);
    }
  }

  const env = snap?.env;
  const recipients = snap?.recipients ?? [];
  const canSend = Boolean(env?.hasRestApiKey) && recipients.length > 0;
  const connectHref = `/api/admin/kakao/connect?label=${encodeURIComponent(label.trim())}`;

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

        {banner && (
          <div
            className={`mb-4 text-xs font-bold rounded-xl px-4 py-2.5 border ${
              banner.ok
                ? "text-emerald-800 bg-emerald-50 border-emerald-100"
                : "text-red-700 bg-red-50 border-red-100"
            }`}
          >
            {banner.text}
          </div>
        )}

        {message && (
          <div className="mb-4 text-xs font-bold text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
            {message}
          </div>
        )}

        <Card
          title="환경변수 · 저장소"
          desc="Vercel 프로젝트 설정에 넣는 값과 토큰이 쌓이는 곳입니다. 화면에는 꽂혀 있다 · 없다만 나옵니다."
        >
          {loading && !snap ? (
            <p className="text-xs text-gray-400 py-3">읽는 중입니다</p>
          ) : (
            <div className="divide-y divide-gray-100">
              <Row
                label="KAKAO_REST_API_KEY"
                on={Boolean(env?.hasRestApiKey)}
                hint={
                  env?.hasRestApiKey
                    ? "꽂혀 있습니다"
                    : "카카오 개발자 콘솔의 REST API 키입니다. 이것이 없으면 아무것도 보낼 수 없습니다"
                }
              />
              <Row
                label="KAKAO_REFRESH_TOKEN"
                on={Boolean(env?.hasRefreshToken)}
                hint={
                  env?.hasRefreshToken
                    ? "꽂혀 있습니다 (선택 · 아래 [카카오 계정 연결] 로 붙인 계정이 있으면 없어도 됩니다)"
                    : "선택입니다. 아래 [카카오 계정 연결] 이 이 값을 대신합니다"
                }
              />
              <Row label="토큰 저장소 (DB)" on={Boolean(snap?.store.ok)} hint={snap?.store.detail ?? ""} mono={false} />
            </div>
          )}
        </Card>

        <Card title="받는 사람" desc="알림은 여기 올라온 계정마다 각자의 카카오톡 나와의 채팅으로 갑니다.">
          {loading && !snap ? (
            <p className="text-xs text-gray-400 py-3">읽는 중입니다</p>
          ) : recipients.length === 0 ? (
            <p className="flex items-start gap-1.5 text-xs text-amber-700 py-3">
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              받는 사람이 없습니다. 아래에서 계정을 연결하세요.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recipients.map((r) => (
                <li key={r.id} className="flex items-start gap-3 py-3">
                  <span className="mt-0.5 shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100">
                    {r.source === "env" ? (
                      <KeyRound size={16} className="text-gray-600" strokeWidth={2.2} />
                    ) : (
                      <UserRound size={16} className="text-[#0066FF]" strokeWidth={2.2} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-sm font-bold text-gray-900">{r.label}</p>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                          r.source === "env" ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-[#0066FF]"
                        }`}
                      >
                        {r.source === "env" ? "환경변수" : "연결 계정"}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 break-words">
                      {r.lastError ? (
                        <span className="text-red-700">마지막 오류 · {r.lastError}</span>
                      ) : r.lastOkAt ? (
                        <span className="text-gray-400">마지막 정상 {fmtTime(r.lastOkAt)}</span>
                      ) : (
                        <span className="text-gray-400">아직 보낸 적 없음</span>
                      )}
                    </p>
                  </div>
                  {r.source === "store" && (
                    <button
                      type="button"
                      onClick={() => remove(r)}
                      disabled={removing === r.id}
                      className="shrink-0 flex items-center gap-1 rounded-lg ring-1 ring-gray-200 px-2.5 py-1.5 text-[11px] font-black text-gray-500 hover:bg-gray-100 hover:text-red-700 disabled:opacity-50"
                    >
                      {removing === r.id ? <Loader2 size={12} className="animate-spin" /> : <Unlink size={12} />}
                      해제
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-700 mb-2">계정 연결</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value.slice(0, 20))}
                placeholder="받는 사람 이름 (예: 대표)"
                className="flex-1 rounded-xl ring-1 ring-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
              <a
                href={env?.hasRestApiKey ? connectHref : undefined}
                aria-disabled={!env?.hasRestApiKey}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black text-white ${
                  env?.hasRestApiKey ? "bg-[#0066FF] hover:bg-blue-700" : "bg-gray-300 pointer-events-none"
                }`}
              >
                <Link2 size={14} />
                카카오 계정 연결
              </a>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
              카카오 로그인 창이 뜹니다. 알림을 받을 계정으로 로그인하고 카카오톡 메시지 전송에 동의하면 이 목록에
              올라옵니다. 같은 계정으로 다시 누르면 덮어쓰기라 중복이 생기지 않습니다. 토큰은 암호화해서 DB 에만
              저장됩니다.
            </p>
          </div>
        </Card>

        <Card
          title="시험 발송"
          desc="누르면 받는 사람 전원의 카카오톡 나와의 채팅으로 한 통씩 갑니다. 고객에게는 가지 않습니다."
        >
          <button
            type="button"
            onClick={sendTest}
            disabled={sending || !canSend}
            className="mt-2 flex items-center gap-1.5 rounded-xl bg-[#0066FF] px-4 py-2.5 text-xs font-black text-white hover:bg-blue-700 disabled:opacity-40"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            시험 알림 보내기
          </button>
          {!canSend && !loading && (
            <p className="flex items-start gap-1.5 text-xs text-amber-700 mt-3">
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              REST API 키와 받는 사람이 하나 이상 있어야 보낼 수 있습니다. 문의 접수 자체는 그대로 됩니다.
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
                {result.ok ? "보냈습니다. 각자 카카오톡 나와의 채팅을 확인해 주세요" : "보내지 못했습니다"}
              </p>
              <p className="mt-1 text-[11px] opacity-80">마지막 단계: {STEP_LABEL[result.step] ?? result.step}</p>
              {result.reports && result.reports.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {result.reports.map((rep) => (
                    <li key={rep.id} className="flex items-start gap-1.5 break-words">
                      {rep.ok ? (
                        <Check size={12} className="mt-0.5 shrink-0" strokeWidth={3} />
                      ) : (
                        <X size={12} className="mt-0.5 shrink-0" strokeWidth={3} />
                      )}
                      <span>
                        <span className="font-bold">{rep.label}</span> · {rep.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                result.error && <p className="mt-1 break-words">{result.error}</p>
              )}
            </div>
          )}
        </Card>

        <Card title="알아 두실 것">
          <ul className="space-y-2 text-xs text-gray-500 leading-relaxed">
            <li>
              1) 알림은 <span className="font-semibold text-gray-700">각 계정의 카카오톡 나와의 채팅</span> 으로
              갑니다. 친구에게 보내는 방식은 카카오 심사를 따로 받아야 해서 쓰지 않았습니다.
            </li>
            <li>
              2) 리프레시 토큰은 <span className="font-semibold text-gray-700">두 달마다 갱신</span> 됩니다. 알림을 한
              번이라도 보내면(문의 · 시험 발송) 새 토큰이 저장소에 자동으로 적히므로 그대로 이어집니다. 두 달 넘게 한
              번도 안 보내 죽으면 [카카오 계정 연결] 을 다시 누르면 됩니다.
            </li>
            <li>
              3) 알림이 실패해도 <span className="font-semibold text-gray-700">문의는 그대로 저장</span> 됩니다.
              홈페이지 문의 화면에서 언제든 보실 수 있습니다.
            </li>
            <li>
              4){" "}
              <span className="font-semibold text-gray-700 inline-flex items-center gap-1">
                <Database size={11} />
                토큰 저장소
              </span>{" "}
              가 빨간색이면 Vercel 의 DATABASE_URL 또는 ADMIN_SESSION_SECRET 을 확인하세요. 그동안은 환경변수 토큰으로만
              갑니다.
            </li>
          </ul>
        </Card>
      </div>
      <AdminFooter />
    </main>
  );
}

export default function AdminNotifyTestPage() {
  // useSearchParams 는 Suspense 경계가 있어야 정적 빌드가 통과한다
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50" />}>
      <NotifyTestInner />
    </Suspense>
  );
}
