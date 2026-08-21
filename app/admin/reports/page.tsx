"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Plus, Save, Trash2, Copy, ExternalLink, Eye, Loader2,
  TrendingUp, X, Check, PencilLine, RotateCcw,
} from "lucide-react";
import { AdminHeader, AdminFooter } from "../AdminNav";
import RichTextEditor from "../RichTextEditor";

interface Metric {
  label: string;
  before: string;
  after: string;
}

interface Report {
  code: string;
  clientId: string | null;
  clientName: string;
  title: string;
  period: string;
  summary: string;
  metrics: Metric[];
  body: string;
  requests: string;
  status: "draft" | "published";
  viewCount: number;
  createdAt: string;
  publishedAt: string | null;
  lastViewedAt: string | null;
}

type Form = Omit<Report, "viewCount" | "createdAt" | "publishedAt" | "lastViewedAt">;

const SITE = "https://www.harangmarketing.com";

/**
 * 본문 기본 틀 — 새 보고서를 열면 이 내용이 들어가 있다.
 *
 * client-report 스킬의 4블록 구조(진행사항 · 남은작업 · 드리는 말씀 · 요청사항)를 그대로 따른다.
 * 다만 카톡이 아니라 웹 페이지라 꺾쇠 대신 제목 태그를 쓴다.
 * 문장은 대표님 말투 그대로 — 빈 칸을 채우기보다 고쳐 쓰는 쪽이 빠르라고 실제 문장으로 넣어둔다.
 */
const BODY_TEMPLATE = `<p>안녕하세요 대표님! 이번 기간 진행한 내용 정리해서 알려드립니다.</p>
<h2>진행사항</h2>
<ul>
<li>플레이스 SEO 최적화 — 상세설명·찾아오는길·대표키워드 반영 완료</li>
<li>블로그 포스팅 0건 발행 (키워드: )</li>
<li>블로그 배포 0건 진행</li>
<li>플레이스 광고 세팅·최적화 진행 중</li>
</ul>
<h2>남은 작업</h2>
<ul>
<li>체험단 모집 = 신청 0명 받았고 이번 주 예약 잡고 있습니다</li>
<li>영수증 리뷰 작업 = 사진이 아직 충분하지 않아 진행하지 않았습니다. 같은 종류 사진만 계속 올라가면 네이버도, 손님들도 이상하게 볼꺼라서요</li>
</ul>
<h2>드리는 말씀</h2>
<p>업체 몇가지 확인해보니 눈에 띄는 게 있어서 적어둡니다.</p>
<ol>
<li><strong>(항목명)</strong>
<ul>
<li>문제 — </li>
<li>해결책 — </li>
<li>왜 그래야 하는지 — </li>
</ul>
</li>
</ol>
<p>광고비는 저희에게 주는 게 아니라 네이버에 돈을 주고 최상단에 노출하는 겁니다. 소진이 가까워지면 미리 말씀드리겠습니다.</p>`;

const EMPTY: Form = {
  code: "",
  clientId: null,
  clientName: "",
  title: "",
  period: "",
  summary: "",
  metrics: [],
  body: "",
  requests: "",
  status: "draft",
};

/** 이번 주 월~금을 '2026-08-18 ~ 08-22' 형태로 */
function thisWeekLabel(): string {
  const now = new Date();
  const day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((day + 6) % 7));
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 4);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${mon.getFullYear()}-${p(mon.getMonth() + 1)}-${p(mon.getDate())} ~ ${p(fri.getMonth() + 1)}-${p(fri.getDate())}`;
}

function fmt(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function AdminReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");
  /**
   * 에디터는 마운트할 때의 값만 읽고 이후 value 변경은 반영하지 않는다.
   * 그래서 본문을 밖에서 갈아끼울 때(새 보고서·다른 보고서 수정·기본 틀 넣기) 이 키를 올려 다시 마운트시킨다.
   */
  const [editorKey, setEditorKey] = useState(0);

  /** 목록 새로고침. 첫 줄이 await 라서 effect 안에서 불러도 동기 setState 가 일어나지 않는다. */
  const load = useCallback(async () => {
    const res = await fetch("/api/admin/reports");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    if (data.ok) setReports(data.reports);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    // 첫 진입 시 목록을 가져온다. load 는 await 로 시작하므로 렌더 중 setState 가 일어나지 않는다.
    // (react-hooks/set-state-in-effect 는 effect 에서 도달 가능한 모든 setState 를 잡아내므로 여기서만 끈다)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const startNew = () => {
    setForm({ ...EMPTY, period: thisWeekLabel(), body: BODY_TEMPLATE });
    setEditorKey((k) => k + 1);
    setEditing(true);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** 본문을 기본 틀로 되돌린다. 쓰던 내용이 있으면 먼저 물어본다. */
  const insertTemplate = () => {
    const hasText = form.body.replace(/<[^>]*>/g, "").trim().length > 0;
    if (hasText && !confirm("지금 본문을 지우고 기본 틀로 바꿀까요?")) return;
    setForm((f) => ({ ...f, body: BODY_TEMPLATE }));
    setEditorKey((k) => k + 1);
  };

  const startEdit = (r: Report) => {
    setForm({
      code: r.code,
      clientId: r.clientId,
      clientName: r.clientName,
      title: r.title,
      period: r.period,
      summary: r.summary,
      metrics: r.metrics,
      body: r.body,
      requests: r.requests,
      status: r.status,
    });
    setEditorKey((k) => k + 1);
    setEditing(true);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (status: "draft" | "published") => {
    if (!form.clientName.trim()) return setMessage("업체명을 입력해주세요.");
    if (!form.title.trim()) return setMessage("보고서 제목을 입력해주세요.");
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status }),
    });
    const data = await res.json();
    setSaving(false);
    if (!data.ok) return setMessage(data.error || "저장에 실패했습니다.");
    setForm({
      code: data.report.code,
      clientId: data.report.clientId,
      clientName: data.report.clientName,
      title: data.report.title,
      period: data.report.period,
      summary: data.report.summary,
      metrics: data.report.metrics,
      body: data.report.body,
      requests: data.report.requests,
      status: data.report.status,
    });
    setMessage(status === "published" ? "공개했습니다. 아래 링크를 알림톡에 넣으세요." : "임시저장했습니다.");
    load();
  };

  const remove = async (code: string, name: string) => {
    if (!confirm(`${name} 보고서를 삭제할까요? 이미 보낸 링크는 열리지 않게 됩니다.`)) return;
    const res = await fetch(`/api/admin/reports?code=${encodeURIComponent(code)}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.ok) return setMessage(data.error || "삭제에 실패했습니다.");
    if (form.code === code) {
      setForm(EMPTY);
      setEditing(false);
    }
    load();
  };

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1800);
  };

  const setMetric = (i: number, patch: Partial<Metric>) => {
    setForm((f) => ({ ...f, metrics: f.metrics.map((m, idx) => (idx === i ? { ...m, ...patch } : m)) }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center">
              <FileText size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black text-gray-900">진행 보고서</h1>
              <p className="text-[12px] text-gray-500">알림톡 버튼이 여는 사장님용 보고 페이지</p>
            </div>
          </div>
          {!editing && (
            <button
              onClick={startNew}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-bold text-white hover:bg-blue-700 transition-colors"
            >
              <Plus size={15} strokeWidth={2.5} />
              새 보고서
            </button>
          )}
        </div>

        {message && (
          <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-[13px] font-semibold text-blue-800">
            {message}
          </div>
        )}

        {/* ── 작성 폼 ── */}
        {editing && (
          <section className="mt-5 rounded-2xl bg-white p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-black text-gray-900">
                {form.code ? "보고서 수정" : "새 보고서"}
              </h2>
              <button
                onClick={() => {
                  setEditing(false);
                  setForm(EMPTY);
                }}
                className="inline-flex items-center gap-1 text-[12px] font-bold text-gray-400 hover:text-gray-700"
              >
                <X size={14} strokeWidth={2.5} />
                닫기
              </button>
            </div>

            {/* 링크 — 저장된 뒤에만 */}
            {form.code && (
              <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-3.5">
                <p className="text-[12px] font-bold text-gray-500">알림톡에 넣을 값</p>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">
                      변수 <span className="font-mono">보고서링크</span> — 이 값 그대로
                    </p>
                    <div className="flex items-center gap-1.5">
                      <code className="flex-1 min-w-0 truncate rounded-lg bg-white border border-gray-200 px-2.5 py-2 text-[12px] font-mono text-gray-800">
                        r/{form.code}
                      </code>
                      <button
                        onClick={() => copy(`r/${form.code}`, "var")}
                        className="shrink-0 rounded-lg bg-gray-900 px-2.5 py-2 text-white hover:bg-gray-700"
                        title="복사"
                      >
                        {copied === "var" ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2.5} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">전체 주소 — 카톡에 직접 붙일 때</p>
                    <div className="flex items-center gap-1.5">
                      <code className="flex-1 min-w-0 truncate rounded-lg bg-white border border-gray-200 px-2.5 py-2 text-[12px] font-mono text-gray-800">
                        {SITE}/r/{form.code}
                      </code>
                      <button
                        onClick={() => copy(`${SITE}/r/${form.code}`, "url")}
                        className="shrink-0 rounded-lg bg-gray-900 px-2.5 py-2 text-white hover:bg-gray-700"
                        title="복사"
                      >
                        {copied === "url" ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2.5} />}
                      </button>
                      <a
                        href={`/r/${form.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-gray-600 hover:bg-gray-50"
                        title="새 창에서 열기"
                      >
                        <ExternalLink size={14} strokeWidth={2.5} />
                      </a>
                    </div>
                  </div>
                </div>
                {form.status === "draft" && (
                  <p className="mt-2.5 text-[12px] font-semibold text-blue-700">
                    아직 임시저장 상태입니다. 공개해야 사장님이 열 수 있습니다.
                  </p>
                )}
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="업체명" hint="보고서 상단에 'OOO 대표님' 으로 표시됩니다">
                <input
                  type="text"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  placeholder="소금정원 강화점"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-base outline-none focus:border-blue-400"
                />
              </Field>
              <Field label="보고 기간" hint="비워두면 표시하지 않습니다">
                <input
                  type="text"
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: e.target.value })}
                  placeholder="2026-08-18 ~ 08-22"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-base outline-none focus:border-blue-400"
                />
              </Field>
            </div>

            <Field label="제목" className="mt-3">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="8월 3주차 진행 보고"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-base outline-none focus:border-blue-400"
              />
            </Field>

            <Field label="한 줄 요약" hint="맨 위 강조 박스. 이번 보고의 핵심 한 문장" className="mt-3">
              <input
                type="text"
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="'강화도 카페' 키워드가 7위에서 3위로 올라왔습니다."
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-base outline-none focus:border-blue-400"
              />
            </Field>

            {/* 지표 */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[13px] font-bold text-gray-700">
                  <TrendingUp size={14} className="text-blue-600" strokeWidth={2.5} />
                  지표 변화
                </label>
                <button
                  onClick={() => setForm({ ...form, metrics: [...form.metrics, { label: "", before: "", after: "" }] })}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] font-bold text-gray-600 hover:bg-gray-50"
                >
                  <Plus size={13} strokeWidth={2.5} />
                  항목 추가
                </button>
              </div>
              {form.metrics.length === 0 ? (
                <p className="mt-2 text-[12px] text-gray-400">
                  순위·리뷰 수처럼 숫자로 보여줄 게 있으면 추가하세요. 없으면 비워둬도 됩니다.
                </p>
              ) : (
                <p className="mt-2 text-[12px] text-gray-400">
                  이전·현재가 둘 다 비어 있는 줄은 저장할 때 빠집니다. 한쪽만 채워도 됩니다.
                </p>
              )}
              {form.metrics.length > 0 && (
                <div className="mt-2 space-y-2">
                  {form.metrics.map((m, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto] gap-2 items-start">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={m.label}
                          onChange={(e) => setMetric(i, { label: e.target.value })}
                          placeholder="지표 (예: 강화도 카페 순위)"
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-base outline-none focus:border-blue-400"
                        />
                        <input
                          type="text"
                          value={m.before}
                          onChange={(e) => setMetric(i, { before: e.target.value })}
                          placeholder="이전 (7위)"
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-base outline-none focus:border-blue-400"
                        />
                        <input
                          type="text"
                          value={m.after}
                          onChange={(e) => setMetric(i, { after: e.target.value })}
                          placeholder="현재 (3위)"
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-base outline-none focus:border-blue-400"
                        />
                      </div>
                      <button
                        onClick={() => setForm({ ...form, metrics: form.metrics.filter((_, idx) => idx !== i) })}
                        className="rounded-xl border border-gray-200 p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        title="삭제"
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 본문 */}
            <div className="mt-5">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <label className="text-[13px] font-bold text-gray-700">본문</label>
                  <p className="mt-0.5 text-[12px] text-gray-400">
                    진행사항 · 남은 작업 · 드리는 말씀 순으로. 사진도 넣을 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={insertTemplate}
                  className="mb-0.5 inline-flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] font-bold text-gray-600 hover:bg-gray-50"
                  title="본문을 기본 틀로 되돌립니다"
                >
                  <RotateCcw size={13} strokeWidth={2.5} />
                  기본 틀
                </button>
              </div>
              <div className="mt-2">
                <RichTextEditor
                  key={editorKey}
                  value={form.body}
                  onChange={(html) => setForm({ ...form, body: html })}
                />
              </div>
            </div>

            <Field label="대표님께 요청드릴 것" hint="맨 아래 노란 박스로 강조됩니다. 없으면 비워두세요" className="mt-5">
              <textarea
                value={form.requests}
                onChange={(e) => setForm({ ...form, requests: e.target.value })}
                rows={3}
                placeholder="메뉴 사진 5장만 카톡으로 보내주세요. 다음 주 블로그에 들어갑니다."
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-base outline-none focus:border-blue-400 resize-y"
              />
            </Field>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => save("published")}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} strokeWidth={2.5} />}
                공개하고 링크 받기
              </button>
              <button
                onClick={() => save("draft")}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <PencilLine size={15} strokeWidth={2.5} />
                임시저장
              </button>
            </div>
          </section>
        )}

        {/* ── 목록 ── */}
        <section className="mt-6">
          <h2 className="text-[15px] font-black text-gray-900">
            보고서 목록 <span className="text-gray-400 font-bold">{reports.length}</span>
          </h2>

          {loading ? (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white p-6 text-[13px] text-gray-400 shadow-sm">
              <Loader2 size={15} className="animate-spin" />
              불러오는 중
            </div>
          ) : reports.length === 0 ? (
            <div className="mt-3 rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-[13px] text-gray-400">
                아직 보고서가 없습니다. [새 보고서] 를 눌러 첫 보고를 만들어보세요.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {reports.map((r) => (
                <div key={r.code} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-black text-blue-600">{r.clientName}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${
                            r.status === "published"
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                              : "bg-gray-100 text-gray-500 ring-gray-200"
                          }`}
                        >
                          {r.status === "published" ? "공개" : "임시저장"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[14px] font-bold text-gray-900 truncate">{r.title}</p>
                      <p className="mt-1 text-[12px] text-gray-400">
                        {r.period || "기간 없음"} · 작성 {fmt(r.createdAt)}
                        <span className="inline-flex items-center gap-1 ml-2">
                          <Eye size={11} strokeWidth={2.5} />
                          {r.viewCount}
                        </span>
                        {r.lastViewedAt && <span className="ml-1.5">최근 열람 {fmt(r.lastViewedAt)}</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => copy(`r/${r.code}`, r.code)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-2 text-[12px] font-bold text-gray-600 hover:bg-gray-50"
                        title="알림톡 변수값 복사"
                      >
                        {copied === r.code ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2.5} />}
                        링크
                      </button>
                      <a
                        href={`/r/${r.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                        title="열어보기"
                      >
                        <ExternalLink size={13} strokeWidth={2.5} />
                      </a>
                      <button
                        onClick={() => startEdit(r)}
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                        title="수정"
                      >
                        <PencilLine size={13} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => remove(r.code, r.clientName)}
                        className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        title="삭제"
                      >
                        <Trash2 size={13} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <AdminFooter />
    </div>
  );
}

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="text-[13px] font-bold text-gray-700">{label}</label>
      {hint && <p className="mt-0.5 mb-1.5 text-[12px] text-gray-400">{hint}</p>}
      <div className={hint ? "" : "mt-1.5"}>{children}</div>
    </div>
  );
}
