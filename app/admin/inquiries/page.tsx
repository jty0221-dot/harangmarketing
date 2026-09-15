"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw, Loader2, Check, CheckCircle2, RotateCcw, Phone, MessageSquare, ChevronDown,
} from "lucide-react";
import { AdminHeader, AdminFooter } from "../AdminNav";
import { INQUIRY_STATUS_LABEL, inquirySourceLabel, type InquiryStatus } from "../../lib/inquiry-status";

/**
 * 홈페이지 문의 목록 (관리자)
 * /contact 상담 신청 폼과 /free-check 무료 진단에서 들어온 문의를 본다.
 * 데이터는 /api/admin/inquiries 에서만 받는다. 이름·연락처는 관리자 세션이 있을 때만 나간다.
 * 상태는 셋뿐이다 : 새 문의 → 확인함 → 응대 완료. 메모 칸은 두지 않았다.
 */

interface Inquiry {
  id: number;
  name: string;
  phone: string;
  industry: string | null;
  budget: string | null;
  goals: string | null;
  message: string | null;
  source: string | null;
  status: InquiryStatus;
  createdAt: string;
}

type Filter = InquiryStatus | "all";

const STATUS_CHIP: Record<InquiryStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  checked: "bg-amber-50 text-amber-700 ring-amber-200",
  done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "new", label: INQUIRY_STATUS_LABEL.new },
  { key: "checked", label: INQUIRY_STATUS_LABEL.checked },
  { key: "done", label: INQUIRY_STATUS_LABEL.done },
];

function fmt(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString("ko-KR");
}

export default function AdminInquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [message, setMessage] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "목록을 불러오지 못했습니다");
      setInquiries(data.inquiries as Inquiry[]);
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

  async function setStatus(id: number, status: InquiryStatus) {
    setBusy(id);
    setMessage("");
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "status", id, status }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "상태를 바꾸지 못했습니다");
      setInquiries((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  const counts: Record<Filter, number> = { all: inquiries.length, new: 0, checked: 0, done: 0 };
  for (const q of inquiries) counts[q.status] += 1;
  const shown = filter === "all" ? inquiries : inquiries.filter((q) => q.status === filter);

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="min-w-0">
            <h1 className="text-xl font-black text-gray-900">홈페이지 문의</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              상담 신청 폼과 무료 진단으로 들어온 문의입니다. 확인한 건은 상태를 바꿔 두면 새 문의만 골라 볼 수 있습니다.
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
          <div className="mb-4 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
            {message}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-black ring-1 ${
                filter === f.key
                  ? "bg-gray-900 text-white ring-gray-900"
                  : "bg-white text-gray-500 ring-gray-200 hover:bg-gray-100"
              }`}
            >
              {f.label}
              <span className={`ml-1 ${filter === f.key ? "text-blue-300" : "text-blue-600"}`}>{counts[f.key]}</span>
            </button>
          ))}
        </div>

        {loading && inquiries.length === 0 ? (
          <div className="text-sm text-gray-400 bg-white rounded-2xl ring-1 ring-gray-100 p-8 text-center">
            불러오는 중입니다.
          </div>
        ) : shown.length === 0 ? (
          <div className="text-sm text-gray-400 bg-white rounded-2xl ring-1 ring-gray-100 p-8 text-center">
            {inquiries.length === 0 ? "들어온 문의가 없습니다." : "해당 상태의 문의가 없습니다."}
          </div>
        ) : (
          <div className="space-y-3">
            {shown.map((q) => {
              const open = openId === q.id;
              const working = busy === q.id;
              return (
                <div key={q.id} className="bg-white rounded-2xl ring-1 ring-gray-100 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : q.id)}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50/60"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-gray-900 truncate">{q.name || "-"}</span>
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ring-1 ${STATUS_CHIP[q.status]}`}>
                          {INQUIRY_STATUS_LABEL[q.status]}
                        </span>
                        {q.industry && <span className="text-xs text-gray-500 truncate">{q.industry}</span>}
                      </div>
                      <div className="mt-1 flex items-center gap-x-3 gap-y-1 flex-wrap text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-gray-400" />
                          {q.phone || "-"}
                        </span>
                        {q.budget && <span>예산 {q.budget}</span>}
                        <span>{inquirySourceLabel(q.source)}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-gray-400">
                        {fmt(q.createdAt)} · 접수 번호 {q.id}
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>

                  {open && (
                    <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50/50">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone size={13} className="text-gray-400" />
                        {q.phone ? (
                          <a href={"tel:" + q.phone} className="font-bold text-blue-600 underline underline-offset-2">
                            {q.phone}
                          </a>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                      {q.goals && (
                        <div className="text-xs text-gray-600">
                          <span className="font-bold text-gray-500 mr-1">원하는 것</span>
                          {q.goals}
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <MessageSquare size={13} className="mt-0.5 shrink-0 text-gray-400" />
                        <div className="flex-1 min-w-0 text-sm text-gray-800 whitespace-pre-wrap bg-white rounded-xl ring-1 ring-gray-100 p-3">
                          {q.message ? q.message : <span className="text-gray-400">문의 내용 없이 연락처만 남겼습니다.</span>}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {q.status === "new" && (
                          <button
                            type="button"
                            disabled={working}
                            onClick={() => setStatus(q.id, "checked")}
                            className="flex items-center gap-1.5 rounded-xl bg-white ring-1 ring-gray-200 px-4 py-2.5 text-xs font-black text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            {working ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                            확인함
                          </button>
                        )}
                        {q.status !== "done" && (
                          <button
                            type="button"
                            disabled={working}
                            onClick={() => setStatus(q.id, "done")}
                            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            {working ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                            응대 완료
                          </button>
                        )}
                        {q.status !== "new" && (
                          <button
                            type="button"
                            disabled={working}
                            onClick={() => setStatus(q.id, "new")}
                            className="flex items-center gap-1.5 rounded-xl bg-white ring-1 ring-gray-200 px-4 py-2.5 text-xs font-black text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            {working ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                            새 문의로 되돌리기
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <AdminFooter />
    </main>
  );
}
