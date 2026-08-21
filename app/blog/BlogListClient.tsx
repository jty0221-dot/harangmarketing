"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ExternalLink, TrendingUp, BookOpen, ArrowRight, Lightbulb, FileText, MapPin, Camera, LayoutGrid } from "lucide-react";
import PhotoPlaceholder from "../components/PhotoPlaceholder";

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
            <span className="text-[11px] text-gray-400">{post.category}</span>
          )}
        </div>
        <h3 className="font-black text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <span className="text-[11px] text-gray-400">{post.pubDate}</span>
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

  const allNaverPosts = [...naverPosts, ...extraPosts];

  // 네이버 포스트 필터
  const filteredNaver = activeTab === "전체"
    ? allNaverPosts
    : allNaverPosts.filter((p) => p.group === activeTab);

  // 정적 포스트 (칼럼/블로그/플레이스/인스타 탭에선 숨김, 전체/그외에서만 노출)
  const showStatic = activeTab === "전체" || activeTab === "그외";
  const visibleStatic = showStatic
    ? (activeTab === "전체" ? staticPosts : staticPosts.filter((_, i) => i < 6))
    : [];

  // 관리자 작성 (전체에서만)
  const visibleDynamic = activeTab === "전체" ? dynamicPosts : [];

  // 현재 탭 정보
  const currentTab = TABS.find((t) => t.key === activeTab)!;

  // 탭별 카운트
  const countMap: Record<Tab, number> = {
    전체: allNaverPosts.length + dynamicPosts.length + staticPosts.length,
    칼럼: allNaverPosts.filter((p) => p.group === "칼럼").length,
    블로그: allNaverPosts.filter((p) => p.group === "블로그").length,
    플레이스: allNaverPosts.filter((p) => p.group === "플레이스").length,
    인스타: allNaverPosts.filter((p) => p.group === "인스타").length,
    그외: allNaverPosts.filter((p) => p.group === "그외").length + staticPosts.length,
  };

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
        <div className="border border-t-0 border-gray-200 rounded-b-2xl rounded-tr-2xl bg-white p-5 md:p-6">

          {/* 네이버 RSS 포스트 — 카드 그리드 */}
          {filteredNaver.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredNaver.map((post, i) => (
                <NaverPostCard key={i} post={post} />
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

          {/* 빈 상태 */}
          {filteredNaver.length === 0 && visibleDynamic.length === 0 && visibleStatic.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <BookOpen size={20} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">아직 작성된 글이 없습니다.</p>
              <p className="text-xs text-gray-300 mt-1">곧 업데이트될 예정입니다.</p>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
