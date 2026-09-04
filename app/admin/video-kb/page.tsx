"use client";

import { useMemo, useState } from "react";
import {
  Clapperboard,
  Layers,
  Terminal,
  Wrench,
  ListVideo,
  Search,
  Copy,
  Check,
  ExternalLink,
  Info,
} from "lucide-react";
import { AdminHeader, AdminFooter } from "../AdminNav";
import {
  KB_META,
  KB_VIDEOS,
  KB_TECHNIQUES,
  KB_PROMPTS,
  KB_TOOLS,
  type KbCategory,
} from "./data";

const CATEGORIES: KbCategory[] = [
  "생성모델",
  "에이전트자동화",
  "편집",
  "디자인",
  "합성연출",
  "운영수익화",
];

const CATEGORY_BADGE: Record<string, string> = {
  생성모델: "bg-blue-50 text-blue-700 border-blue-100",
  에이전트자동화: "bg-violet-50 text-violet-700 border-violet-100",
  편집: "bg-amber-50 text-amber-700 border-amber-100",
  디자인: "bg-emerald-50 text-emerald-700 border-emerald-100",
  합성연출: "bg-rose-50 text-rose-700 border-rose-100",
  운영수익화: "bg-gray-100 text-gray-600 border-gray-200",
  판독불가: "bg-gray-50 text-gray-400 border-gray-100",
};

type Tab = "techniques" | "prompts" | "tools" | "videos";

const TABS: { key: Tab; label: string; icon: typeof Layers }[] = [
  { key: "techniques", label: "기법 사전", icon: Layers },
  { key: "prompts", label: "프롬프트", icon: Terminal },
  { key: "tools", label: "도구 지도", icon: Wrench },
  { key: "videos", label: "영상 100편", icon: ListVideo },
];

function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold whitespace-nowrap ${
        CATEGORY_BADGE[category] ?? CATEGORY_BADGE["운영수익화"]
      }`}
    >
      {category}
    </span>
  );
}

function CopyButton({ text, id }: { text: string; id: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className={`flex items-center gap-1.5 px-3 py-2 md:py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        copied
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
      }`}
      aria-label={`${id} 프롬프트 복사`}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

function videoUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export default function VideoKbPage() {
  const [tab, setTab] = useState<Tab>("techniques");
  const [category, setCategory] = useState<KbCategory | "전체">("전체");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const filteredTechniques = useMemo(
    () =>
      KB_TECHNIQUES.filter(
        (t) =>
          (category === "전체" || t.category === category) &&
          (!q ||
            [t.title, t.what, t.why, t.harang, ...t.tools]
              .join(" ")
              .toLowerCase()
              .includes(q)),
      ),
    [category, q],
  );

  const filteredPrompts = useMemo(
    () =>
      KB_PROMPTS.filter(
        (p) =>
          !q ||
          [p.title, p.use, p.model, p.text].join(" ").toLowerCase().includes(q),
      ),
    [q],
  );

  const filteredVideos = useMemo(
    () =>
      KB_VIDEOS.filter(
        (v) =>
          (category === "전체" || v.category === category) &&
          (!q || [v.title, v.gist].join(" ").toLowerCase().includes(q)),
      ),
    [category, q],
  );

  const videoByNo = useMemo(() => {
    const m = new Map<number, (typeof KB_VIDEOS)[number]>();
    KB_VIDEOS.forEach((v) => m.set(v.no, v));
    return m;
  }, []);

  const showCategoryFilter = tab === "techniques" || tab === "videos";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
          {/* 타이틀 */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Clapperboard size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-black text-gray-900">
                영상 지식고
              </h1>
              <p className="text-xs md:text-[13px] text-gray-500 mt-0.5">
                {KB_META.channel} 최신 {KB_META.total}편 전수 판독 · 기법 사전과
                복붙 프롬프트 · 수확 {KB_META.harvested}
              </p>
            </div>
          </div>

          {/* 정본 고지 */}
          <div className="flex items-start gap-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <Info size={15} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs md:text-[13px] text-gray-600 leading-relaxed">
              정본은 <span className="font-semibold text-gray-800">본부장\영상\챌린존_전수판독.md · 프롬프트_라이브러리.md</span> —
              이 페이지는 열람용 사본이며 어긋나면 md 가 이긴다. 채널 콘텐츠는
              학습·내부 참고용으로만 쓰고 원문 재게시는 하지 않는다.
            </p>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: "판독 영상", value: `${KB_META.read}/${KB_META.total}편` },
              { label: "기법", value: `${KB_TECHNIQUES.length}개` },
              { label: "프롬프트", value: `${KB_PROMPTS.length}개` },
              { label: "도구", value: `${KB_TOOLS.length}종` },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
              >
                <div className="text-[11px] font-semibold text-gray-400">
                  {s.label}
                </div>
                <div className="text-lg md:text-xl font-black text-gray-900 mt-0.5">
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* 탭 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs md:text-[13px] font-bold whitespace-nowrap transition-colors ${
                  tab === key
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-500 border border-gray-200 hover:text-gray-900"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* 검색 + 분류 필터 */}
          <div className="space-y-3">
            {tab !== "tools" && (
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    tab === "prompts"
                      ? "프롬프트 검색 (제목·용도·모델·본문)"
                      : "검색 (기법명·도구·내용)"
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-base md:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
            )}
            {showCategoryFilter && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1">
                {(["전체", ...CATEGORIES] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-2 md:py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-colors ${
                      category === c
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 기법 사전 */}
          {tab === "techniques" && (
            <div className="space-y-3 md:space-y-4">
              {filteredTechniques.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-400">
                  조건에 맞는 기법이 없습니다
                </div>
              )}
              {filteredTechniques.map((t) => {
                const prompt = t.promptId
                  ? KB_PROMPTS.find((p) => p.id === t.promptId)
                  : undefined;
                return (
                  <div
                    key={t.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-gray-300">
                            {t.id}
                          </span>
                          <CategoryBadge category={t.category} />
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mt-1.5">
                          {t.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {t.what}
                    </p>
                    <div className="bg-blue-50 rounded-xl p-3.5">
                      <div className="text-[11px] font-bold text-blue-700 mb-1">
                        왜 이렇게 하나
                      </div>
                      <p className="text-[13px] text-blue-900 leading-relaxed">
                        {t.why}
                      </p>
                    </div>
                    {t.how && t.how.length > 0 && (
                      <ol className="space-y-1 text-[13px] text-gray-600">
                        {t.how.map((step, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="font-bold text-gray-400 shrink-0">
                              {i + 1})
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                    {prompt && (
                      <div className="rounded-xl bg-gray-950 p-3.5 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-gray-400">
                            {prompt.id} · {prompt.model}
                          </span>
                          <CopyButton text={prompt.text} id={prompt.id} />
                        </div>
                        <pre className="text-xs text-gray-100 font-mono whitespace-pre-wrap break-words leading-relaxed max-h-48 overflow-y-auto">
                          {prompt.text}
                        </pre>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {t.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-medium"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-3 space-y-1.5">
                      <p className="text-[13px] text-gray-700">
                        <span className="font-bold text-gray-900">
                          하랑 적용
                        </span>{" "}
                        · {t.harang}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {t.sources.map((no) => {
                          const v = videoByNo.get(no);
                          if (!v) return null;
                          return (
                            <a
                              key={no}
                              href={videoUrl(v.videoId)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <ExternalLink size={10} />
                              <span className="line-clamp-1 max-w-[280px]">
                                {v.title}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 프롬프트 라이브러리 */}
          {tab === "prompts" && (
            <div className="space-y-3 md:space-y-4">
              {filteredPrompts.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-400">
                  조건에 맞는 프롬프트가 없습니다
                </div>
              )}
              {filteredPrompts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-gray-300">
                          {p.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-semibold">
                          {p.model}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mt-1.5">
                        {p.title}
                      </h3>
                      <p className="text-[13px] text-gray-500 mt-0.5">
                        {p.use}
                      </p>
                    </div>
                    <CopyButton text={p.text} id={p.id} />
                  </div>
                  <pre className="rounded-xl bg-gray-950 p-3.5 text-xs text-gray-100 font-mono whitespace-pre-wrap break-words leading-relaxed max-h-64 overflow-y-auto">
                    {p.text}
                  </pre>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {p.sources.map((no) => {
                      const v = videoByNo.get(no);
                      if (!v) return null;
                      return (
                        <a
                          key={no}
                          href={videoUrl(v.videoId)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLink size={10} />
                          <span className="line-clamp-1 max-w-[280px]">
                            {v.title}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 도구 지도 */}
          {tab === "tools" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 md:px-6 py-3 text-[11px] font-bold text-gray-400 whitespace-nowrap">
                        도구
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-gray-400">
                        역할
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-gray-400 whitespace-nowrap">
                        요금 (자막 기준)
                      </th>
                      <th className="px-4 md:px-6 py-3 text-[11px] font-bold text-gray-400">
                        하랑 판정
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {KB_TOOLS.map((tool) => (
                      <tr
                        key={tool.name}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="px-4 md:px-6 py-3 text-sm font-bold text-gray-900 whitespace-nowrap">
                          {tool.name}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-gray-600 min-w-[200px]">
                          {tool.role}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-gray-600 whitespace-nowrap">
                          {tool.pricing || "언급 없음"}
                        </td>
                        <td className="px-4 md:px-6 py-3 text-[13px] text-gray-600 min-w-[220px]">
                          {tool.verdict}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 영상 100편 */}
          {tab === "videos" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              {filteredVideos.length === 0 && (
                <div className="p-8 text-center text-sm text-gray-400">
                  조건에 맞는 영상이 없습니다
                </div>
              )}
              {filteredVideos.map((v) => (
                <div
                  key={v.no}
                  className="p-4 md:px-6 flex items-start gap-3"
                >
                  <span className="text-[11px] font-bold text-gray-300 w-7 shrink-0 pt-0.5">
                    {v.no + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={videoUrl(v.videoId)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {v.title}
                      </a>
                      <CategoryBadge category={v.category} />
                    </div>
                    <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">
                      {v.category === "판독불가"
                        ? "자막 없음 · 제목으로만 반영"
                        : v.gist}
                    </p>
                  </div>
                  <a
                    href={videoUrl(v.videoId)}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-gray-300 hover:text-blue-600 transition-colors pt-0.5"
                    aria-label="유튜브에서 보기"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <AdminFooter />
    </div>
  );
}
