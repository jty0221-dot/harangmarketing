"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Save, Plus, Pencil, Eye, EyeOff } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { AdminHeader, AdminFooter } from "./AdminNav";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  published: boolean;
}

const EMPTY: Omit<Post, "date"> = { slug: "", title: "", excerpt: "", body: "", published: true };

export default function AdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/posts");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    if (data.ok) setPosts(data.posts);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isBodyEmpty = (html: string) => !html.replace(/<[^>]*>/g, "").trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBodyEmpty(form.body)) {
      setMessage("본문 내용을 입력해주세요.");
      return;
    }
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.ok) {
      setMessage("저장되었습니다. GitHub에 커밋되어 1~2분 후 사이트에 반영됩니다.");
      setForm(EMPTY);
      load();
    } else {
      setMessage(`오류: ${data.error}`);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const editPost = (p: Post) => {
    setForm({ slug: p.slug, title: p.title, excerpt: p.excerpt, body: p.body, published: p.published });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-black text-gray-900">하랑마케팅 블로그 관리자</h1>
            <p className="text-xs text-gray-400 mt-0.5">글 작성/수정 시 GitHub 저장소에 자동 커밋됩니다</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            <LogOut size={14} />
            로그아웃
          </button>
        </div>

        {/* 작성/수정 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 space-y-4">
          <div className="flex items-center gap-2 text-sm font-black text-gray-900 mb-2">
            {form.slug ? <Pencil size={15} className="text-blue-600" /> : <Plus size={15} className="text-blue-600" />}
            {form.slug ? "글 수정" : "새 글 작성"}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">제목</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base md:text-sm focus:border-blue-400 focus:outline-none transition-colors"
              placeholder="예: 광고비 절반으로 줄이는 3가지 방법"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">요약 (목록에 보이는 짧은 소개)</label>
            <input
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base md:text-sm focus:border-blue-400 focus:outline-none transition-colors"
              placeholder="한 줄 요약"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">본문</label>
            <RichTextEditor value={form.body} onChange={(html) => setForm((f) => ({ ...f, body: html }))} />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            바로 공개
          </label>

          {message && <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">{message}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-colors"
            >
              <Save size={14} />
              {saving ? "저장 중..." : form.slug ? "수정 저장" : "새 글 저장"}
            </button>
            {form.slug && (
              <button
                type="button"
                onClick={() => setForm(EMPTY)}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            )}
          </div>
        </form>

        {/* 글 목록 */}
        <h2 className="text-sm font-black text-gray-900 mb-3">작성된 글 ({posts.length})</h2>
        {loading ? (
          <p className="text-sm text-gray-500">불러오는 중...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-gray-500">아직 작성된 글이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {posts.map((p) => (
              <button
                key={p.slug}
                onClick={() => editPost(p)}
                className="w-full flex items-center justify-between gap-3 bg-white rounded-xl border border-gray-100 p-4 text-left hover:border-blue-200 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm truncate">{p.title}</span>
                    {p.published ? (
                      <Eye size={12} className="text-blue-500 shrink-0" />
                    ) : (
                      <EyeOff size={12} className="text-gray-300 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{p.date}</p>
                </div>
                <Pencil size={14} className="text-gray-300 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
      </main>
      <AdminFooter />
    </>
  );
}
