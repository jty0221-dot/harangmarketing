"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { ExternalLink, BookOpen, ArrowRight, Lightbulb, FileText, MapPin, Camera, LayoutGrid, Search, X } from "lucide-react";

interface StaticPost {
  tag: string;
  tagColor: string;
  accentColor: string;
  title: string;
  preview: string;
  readTime: string;
  result: string;
  href: string;
  internal: boolean;
}

interface DynamicPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

interface NaverPost {
  title: string;
  link: string;
  thumbnail: string | null;
  pubDate: string;
  category: string;
  excerpt: string;
  group: string;
}

interface Props {
  staticPosts: StaticPost[];
  dynamicPosts: DynamicPost[];
  naverPosts: NaverPost[];
}

type Tab = "전체" | "칼럼" | "블로그" | "플레이스" | "인스타" | "그외";

const TABS: { key: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: "전체",   label: "전체",   icon: <LayoutGrid  size={14} strokeWidth={2.5} />, desc: "모든 마케팅 인사이트" },
  { key: "칼럼",   label: "칼럼",   icon: <Lightbulb   size={14} strokeWidth={2.5} />, desc: "마케팅 전략 & 트렌드 분석" },
  { key: "블로그", label: "블로그", icon: <FileText    size={14} strokeWidth={2.5} />, desc: "블로그 SEO & 콘텐츠 운영" },
  { key: "플레이스",label:"플레이스",icon: <MapPin     size={14} strokeWidth={2.5} />, desc: "네이버 플레이스 상위노출 전략" },
  { key: "인스타", label: "인스타", icon: <Camera     size={14} strokeWidth={2.5} />, desc: "인스타그램 & SNS 마케팅" },
  { key: "그외",   label: "그외",   icon: <BookOpen    size={14} strokeWidth={2.5} />, desc: "업종별 마케팅 사례 모음" },
];

/*
  검색어 ↔ 주소창 ?q= 동기화

  /blog 는 정적으로 굽는다. useSearchParams 를 쓰면 정적 프리렌더에서 가장 가까운
  Suspense 경계까지 클라이언트 렌더로 빠져 첫 HTML 에서 글 목록이 통째로 사라진다.
  그래서 주소창은 useSyncExternalStore 로 직접 읽는다. 서버 스냅샷은 빈 문자열이라
  구운 HTML 에는 전체 목록이 실리고, 하이드레이션 직후 ?q= 값으로 한 번 다시 그린다.
  layout.tsx 의 WebSite SearchAction(urlTemplate /blog?q=) 이 이 동작을 전제로 한다.
*/
function subscribeUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function readUrlQuery() {
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

function readServerQuery() {
  return "";
}

/** 이동 없이 주소창만 바꾼다. data 를 null 로 넘겨야 Next 라우터가 새 주소를 같이 안다 */
function writeUrlQuery(value: string) {
  const url = new URL(window.location.href);
  const q = value.trim();
  if (q) url.searchParams.set("q", q);
  else url.searchParams.delete("q");
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) window.history.replaceState(null, "", next);
}

/** 공백으로 나눈 단어가 모두 들어 있어야 맞는 글로 본다 (대소문자 무시) */
function toTerms(query: string) {
  return query.normalize("NFC").toLowerCase().split(/\s+/).filter(Boolean);
}

function matchesTerms(terms: string[], ...fields: string[]) {
  if (terms.length === 0) return true;
  const haystack = fields.join(" ").normalize("NFC").toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

function NaverPostCard({ post }: { post: NaverPost }) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-blue-100 transition-all"
    >
      {post.thumbnail ? (
        <img
          src={post.thumbnail}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-40 object-cover bg-gray-100 group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-40 bg-blue-600 flex items-center justify-center">
          <BookOpen size={32} className="text-blue-200" />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
            <span className="w-3 h-3 rounded bg-green-600 text-white text-[11px] font-black flex items-center justify-center leading-none">N</span>
            네이버 블로그
          </span>
          {post.category && (
            <span className="text-[11px] text-gray-600">{post.category}</span>
          )}
        </div>
        <h3 className="font-black text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <span className="text-[11px] text-gray-600">{post.pubDate}</span>
          <ExternalLink size={11} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
        </div>
      </div>
    </a>
  );
}

export default function BlogListClient({ staticPosts, dynamicPosts, naverPosts }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("전체");
  const [extraPosts, setExtraPosts] = useState<NaverPost[]>([]);
  const fetched = useRef(false);

  // 검색어 : 입력 전에는 주소창 ?q= 를, 한 번이라도 입력하면 입력값을 따른다
  const urlQuery = useSyncExternalStore(subscribeUrl, readUrlQuery, readServerQuery);
  const [draft, setDraft] = useState<string | null>(null);
  const query = draft ?? urlQuery;
  const terms = toTerms(query);
  const hasQuery = terms.length > 0;
  const inputRef = useRef<HTMLInputElement>(null);

  const changeQuery = (value: string) => {
    setDraft(value);
    writeUrlQuery(value);
  };

  const clearQuery = () => {
    changeQuery("");
    inputRef.current?.focus();
  };

  // SSR posts의 logNo 집합 — 중복 제거용
  const sseLogNos = new Set(
    naverPosts.map((p) => {
      const m = p.link.match(/\/(\d{8,})(?:\?|$)/);
      return m?.[1] ?? "";
    })
  );

  // Edge API로 추가 포스트 lazy-load (Cloudflare 네트워크 → Naver 차단 우회)
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("/api/naver-posts")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.posts?.length) return;
        const fresh = (data.posts as NaverPost[]).filter((p) => {
          const m = p.link.match(/\/(\d{8,})(?:\?|$)/);
          return m?.[1] ? !sseLogNos.has(m[1]) : true;
        });
        setExtraPosts(fresh);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 검색어로 먼저 거른 뒤 탭으로 한 번 더 거른다 (제목 + 요약)
  const allNaverPosts = [...naverPosts, ...extraPosts].filter((p) => matchesTerms(terms, p.title, p.excerpt));
  const searchedStatic = staticPosts.filter((p) => matchesTerms(terms, p.title, p.preview));
  const searchedDynamic = dynamicPosts.filter((p) => matchesTerms(terms, p.title, p.excerpt));

  // 네이버 포스트 필터
  const filteredNaver = activeTab === "전체"
    ? allNaverPosts
    : allNaverPosts.filter((p) => p.group === activeTab);

  // 정적 포스트 (칼럼/블로그/플레이스/인스타 탭에선 숨김, 전체/그외에서만 노출)
  const showStatic = activeTab === "전체" || activeTab === "그외";
  const visibleStatic = showStatic
    ? (activeTab === "전체" ? searchedStatic : searchedStatic.filter((_, i) => i < 6))
    : [];

  // 관리자 작성 (전체에서만)
  const visibleDynamic = activeTab === "전체" ? searchedDynamic : [];

  // 현재 탭 정보
  const currentTab = TABS.find((t) => t.key === activeTab)!;

  // 탭별 카운트 (검색 중이면 탭마다 맞는 글 수)
  const countMap: Record<Tab, number> = {
    전체: allNaverPosts.length + searchedDynamic.length + searchedStatic.length,
    칼럼: allNaverPosts.filter((p) => p.group === "칼럼").length,
    블로그: allNaverPosts.filter((p) => p.group === "블로그").length,
    플레이스: allNaverPosts.filter((p) => p.group === "플레이스").length,
    인스타: allNaverPosts.filter((p) => p.group === "인스타").length,
    그외: allNaverPosts.filter((p) => p.group === "그외").length + searchedStatic.length,
  };

  // 지금 탭에 보이는 글 수
  const shownCount = filteredNaver.length + visibleDynamic.length + visibleStatic.length;

  return (
    <>
      {/* ── 마케팅 꿀팁 배너 ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <Lightbulb size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">마케팅 인사이트</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-1">
          {currentTab.label === "전체" ? "전체 인사이트" : `${currentTab.label} 마케팅`}
        </h2>
        <p className="text-sm text-gray-500">{currentTab.desc}</p>
      </div>

      {/* ── 글 검색 (제목 + 요약 · 주소창 ?q= 와 동기화) ── */}
      <form
        role="search"
        aria-label="블로그 글 검색"
        className="mb-5"
        onSubmit={(e) => {
          e.preventDefault();
          inputRef.current?.blur();
        }}
      >
        <label htmlFor="blog-search" className="sr-only">블로그 글 검색</label>
        <div className="relative w-full sm:max-w-md">
          <Search
            size={16}
            strokeWidth={2.5}
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--w-label-assistive)" }}
          />
          <input
            ref={inputRef}
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) {
                e.preventDefault();
                clearQuery();
              }
            }}
            placeholder="제목이나 내용으로 찾기 (예: 플레이스, 리뷰)"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            aria-controls="blog-results"
            className="w-full h-12 pl-11 pr-12 rounded-xl border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 shadow-sm transition-colors focus:outline-none focus:border-[var(--w-primary)] focus:ring-[3px] focus:ring-[rgba(0,102,255,0.12)] [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              aria-label="검색어 지우기"
              className="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
        <p role="status" aria-live="polite" className="text-xs md:text-[13px] text-gray-500 mt-2 min-h-[1.25rem]">
          {hasQuery && (
            <>
              {activeTab === "전체" ? "" : `${currentTab.label} 탭 `}검색 결과{" "}
              <span className="font-semibold text-gray-900">{shownCount}건</span>
            </>
          )}
        </p>
      </form>

      {/* ── 폴더형 카테고리 탭 ── */}
      <div className="mb-8">
        {/* 탭 헤더 — 폴더 느낌 */}
        <div className="flex gap-0 overflow-x-auto scrollbar-hide border-b border-gray-200">
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group relative shrink-0 flex items-center gap-1.5 px-4 md:px-5 py-3 text-sm font-bold transition-all border-t border-l border-r rounded-t-xl -mb-px ${
                  isActive
                    ? "bg-white text-blue-600 border-gray-200 z-10 border-b-white"
                    : "bg-gray-50 text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}>
                  {tab.icon}
                </span>
                <span className="whitespace-nowrap">{tab.label}</span>
                {countMap[tab.key] > 0 && (
                  <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-full ml-0.5 ${
                    isActive ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"
                  }`}>
                    {countMap[tab.key]}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* 탭 컨텐츠 박스 */}
        <div id="blog-results" className="border border-t-0 border-gray-200 rounded-b-2xl rounded-tr-2xl bg-white p-5 md:p-6">

          {/* 네이버 RSS 포스트 — 카드 그리드 */}
          {filteredNaver.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredNaver.map((post) => (
                <NaverPostCard key={post.link} post={post} />
              ))}
            </div>
          )}

          {/* 관리자 작성 포스트 */}
          {visibleDynamic.length > 0 && (
            <div className="space-y-3 mb-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider">직접 작성 인사이트</p>
              {visibleDynamic.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <FileText size={13} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{post.date}</p>
                  </div>
                  <ArrowRight size={13} className="text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          )}

          {/* 검색 결과 없음 */}
          {shownCount === 0 && hasQuery && (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 break-keep [overflow-wrap:anywhere]">
                <span className="font-semibold text-gray-900">{query.trim()}</span>에 맞는 글을 찾지 못했습니다.
              </p>
              <p className="text-xs text-gray-500 mt-1">다른 단어로 다시 찾아보세요.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {activeTab !== "전체" && countMap["전체"] > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("전체")}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--w-primary)] text-white text-sm font-bold hover:bg-[var(--w-blue-45)] transition-colors"
                  >
                    전체 탭 결과 {countMap["전체"]}건 보기 <ArrowRight size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearQuery}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-bold hover:border-gray-300 transition-colors"
                >
                  <X size={13} /> 검색어 지우기
                </button>
              </div>
            </div>
          )}

          {/* 빈 상태 */}
          {shownCount === 0 && !hasQuery && (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <BookOpen size={20} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-500">아직 작성된 글이 없습니다.</p>
              <p className="text-xs text-gray-300 mt-1">곧 업데이트될 예정입니다.</p>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
