export const maxDuration = 60; // Vercel 함수 타임아웃 60초

import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { ArrowRight, ExternalLink, BookOpen, TrendingUp, MapPin, Star, MessageCircle } from "lucide-react";
import BlogListClient from "./BlogListClient";
import { getAllPosts } from "../lib/blog-posts";
import { getNaverBlogPosts } from "../lib/naver-blog";

export const metadata: Metadata = {
  title: "마케팅 블로그 | 소상공인 실전 마케팅 노하우",
  description: "10년 경력 실무진이 직접 쓰는 소상공인 마케팅 노하우. 네이버 플레이스 SEO, 블로그 마케팅, 리뷰 관리, 카카오맵 노출 등 실제 성과 기반 인사이트.",
  keywords: ["소상공인 마케팅 블로그", "플레이스 SEO 방법", "카페 마케팅 노하우", "마케팅 대행사 블로그", "하랑마케팅 블로그"],
  alternates: { canonical: "https://www.harangmarketing.com/blog" },
  openGraph: {
    title: "하랑마케팅 블로그 | 소상공인 실전 마케팅 인사이트",
    description: "플레이스 SEO, 블로그, 리뷰 관리 등 실제 성과로 검증된 소상공인 마케팅 노하우를 무료로 공유합니다.",
    url: "https://www.harangmarketing.com/blog",
    images: [{ url: "https://www.harangmarketing.com/og-image.png", width: 1200, height: 630 }],
  },
};

export default async function BlogPage() {
  const dynamicPosts = getAllPosts().map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, date: p.date }));
  const naverPosts = await getNaverBlogPosts();

  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 py-14 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-72 h-72 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Blog</p>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              마케팅 인사이트,<br /><span className="text-blue-400">무료로 공유합니다</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              10년 경력 실무진이 직접 쓰는 소상공인 마케팅 노하우.
              이론이 아닌 실제 성과로 검증된 방법만 담습니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://blog.naver.com/harangmarketing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-500 transition-colors shadow-sm"
              >
                <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center font-black text-xs">N</span>
                네이버 블로그 전체 보기
                <ExternalLink size={13} />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/15 transition-colors"
              >
                맞춤 전략 무료 상담 <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* Trust mini strip */}
        <section className="py-4 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                { icon: BookOpen, text: "실무진 직접 집필" },
                { icon: TrendingUp, text: "실제 성과 기반" },
                { icon: Star, text: "500+ 프로젝트 경험" },
                { icon: MapPin, text: "소상공인 전문" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Icon size={12} className="text-blue-500" strokeWidth={2.5} />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <BlogListClient staticPosts={[]} dynamicPosts={dynamicPosts} naverPosts={naverPosts} />

            {/* Load more — links to Naver blog */}
            <div className="text-center mt-8">
              <a
                href="https://blog.naver.com/harangmarketing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
              >
                <span className="w-5 h-5 rounded bg-green-600 text-white text-[11px] font-black flex items-center justify-center">N</span>
                네이버 블로그에서 더 보기
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </section>

        {/* 매주 팁 받기 */}
        <section className="py-10 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-5 md:gap-10">
            <div className="flex-1 text-center md:text-left">
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">무료 마케팅 팁</p>
              <h3 className="text-white font-black text-lg md:text-xl mb-1">매주 소상공인 마케팅 인사이트를 카카오로 받아보세요</h3>
              <p className="text-blue-100 text-sm">매주 1회 · 10년 경력 실무진 직접 작성 · 비용 없음</p>
            </div>
            <a
              href="https://pf.kakao.com/_MuUkG/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 text-gray-900 font-black text-sm hover:bg-yellow-300 transition-colors whitespace-nowrap"
            >
              <MessageCircle size={15} />
              카카오 채널 구독
              <ArrowRight size={13} />
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              글을 읽었는데 직접 적용이 어려우신가요?
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              무료 상담에서 업종·상황에 맞는 전략을 직접 제안해드립니다.<br />
              이론이 아닌 실행 계획으로 안내해드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                무료 전략 진단 신청 <ArrowRight size={14} />
              </Link>
              <a
                href="https://pf.kakao.com/_MuUkG/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-yellow-400 text-gray-900 font-black text-sm hover:bg-yellow-300 transition-colors"
              >
                <MessageCircle size={14} />
                카카오 바로 문의
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
