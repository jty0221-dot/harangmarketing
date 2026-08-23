export const maxDuration = 60; // Vercel 함수 타임아웃 60초

import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { ArrowRight, ExternalLink, BookOpen, TrendingUp, MapPin, Star, MessageCircle } from "lucide-react";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import BlogListClient from "./BlogListClient";
import { getAllPosts } from "../lib/blog-posts";
import { getNaverBlogPosts } from "../lib/naver-blog";

export const metadata: Metadata = {
  title: "마케팅 블로그 — 하랑마케팅 | 소상공인 실전 마케팅 노하우",
  description: "10년 경력 실무진이 직접 쓰는 소상공인 마케팅 노하우. 네이버 플레이스 SEO, 블로그 마케팅, 리뷰 관리, 맘카페 바이럴 등 실제 성과 기반 인사이트.",
  keywords: ["소상공인 마케팅 블로그", "플레이스 SEO 방법", "카페 마케팅 노하우", "마케팅 대행사 블로그", "하랑마케팅 블로그"],
  openGraph: {
    title: "하랑마케팅 블로그 — 소상공인 실전 마케팅 인사이트",
    description: "플레이스 SEO, 블로그, 리뷰 관리 등 실제 성과로 검증된 소상공인 마케팅 노하우를 무료로 공유합니다.",
    url: "https://www.harangmarketing.com/blog",
    images: [{ url: "https://www.harangmarketing.com/og-image.png", width: 1200, height: 630 }],
  },
};

// 아래는 BlogListClient에 staticPosts=[]로 전달되어 실제 사용되지 않는 상태입니다.
// 네이버 블로그 및 CMS 글이 로드되면 이 배열을 채우거나 삭제하세요.
const _SAMPLE_POSTS = [
  {
    tag: "플레이스 SEO",
    tagColor: "bg-blue-50 text-blue-600 border-blue-100",
    accentColor: "border-l-blue-500",
    title: "2024 네이버 플레이스 상위 노출 알고리즘 완전 분석",
    preview: "리뷰 수, 답글률, 사진 개수, 저장 수 — 플레이스 순위를 결정하는 7가지 요소를 실제 데이터로 분석했습니다. 경쟁사 대비 어디에 집중해야 하는지 명확하게 알 수 있습니다.",
    readTime: "8분",
    result: "적용 후 플레이스 Top 5 평균 4주",
    href: "/blog/naver-place-algorithm",
    internal: true,
  },
  {
    tag: "블로그 마케팅",
    tagColor: "bg-blue-50 text-blue-700 border-blue-100",
    accentColor: "border-l-blue-600",
    title: "카페 사장님이 꼭 써야 하는 블로그 키워드 30선",
    preview: "지역명+카페, 분위기 카페, 데이트 카페 등 실제 검색량 높은 키워드 목록과 글쓰기 공식을 공개합니다. 이 키워드 하나로 월 방문객이 달라집니다.",
    readTime: "6분",
    result: "카페 블로그 적용 후 월 신규 방문 +43%",
    href: "/blog/cafe-blog-keywords",
    internal: true,
  },
  {
    tag: "체험단·리뷰",
    tagColor: "bg-blue-50 text-blue-600 border-blue-100",
    accentColor: "border-l-blue-500",
    title: "체험단 vs 일반 리뷰 — 뭐가 더 효과적인가?",
    preview: "체험단은 빠르고 리뷰는 신뢰도가 높습니다. 업종별로 어느 방식이 더 ROI가 높은지 실제 A/B 테스트 결과를 공개합니다.",
    readTime: "5분",
    result: "리뷰 전략 최적화 후 전환율 2.1배",
    href: "/blog/review-vs-experience",
    internal: true,
  },
  {
    tag: "SNS 마케팅",
    tagColor: "bg-blue-50 text-blue-700 border-blue-100",
    accentColor: "border-l-blue-700",
    title: "인스타그램 릴스로 예약 폭발 — 미용실 성공 케이스",
    preview: "수원 네일샵이 릴스 3개로 2주 만에 예약을 마감한 실제 사례입니다. 어떤 내용을, 어떻게 촬영하고, 무슨 해시태그를 달았는지 공개합니다.",
    readTime: "7분",
    result: "예약률 0% → 완전 마감, 2주",
    href: "/blog/instagram-reels-beauty",
    internal: true,
  },
  {
    tag: "업종별 전략",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
    accentColor: "border-l-indigo-600",
    title: "음식점 배달 매출 2배 만든 리뷰 마케팅 공식",
    preview: "배달앱에서 순위를 올리는 방법은 광고비가 아닙니다. 리뷰 수와 평점, 그리고 사장님 댓글이 핵심입니다. 서울 마포 음식점의 4개월 과정을 공개합니다.",
    readTime: "9분",
    result: "배달 매출 480만 → 1,022만원",
    href: "/blog/delivery-review-formula",
    internal: true,
  },
  {
    tag: "마케팅 비용",
    tagColor: "bg-blue-50 text-blue-600 border-blue-100",
    accentColor: "border-l-blue-400",
    title: "마케팅 예산 30만원으로 플레이스 1위 가능한가?",
    preview: "작은 예산으로 가장 효과적인 조합을 찾는 방법. 10년간 500개 프로젝트 데이터를 바탕으로 예산별 최적 전략을 제시합니다.",
    readTime: "6분",
    result: "소규모 예산 사례 3개 플레이스 Top 5 달성",
    href: "/blog/small-budget-place-top",
    internal: true,
  },
  {
    tag: "업종별 전략",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
    accentColor: "border-l-indigo-600",
    title: "맘카페 바이럴 마케팅 완전 가이드 — 수강생 55% 늘린 실전 전략",
    preview: "맘카페는 구매 결정권을 가진 주부가 모이는 최고의 로컬 채널입니다. 자연스럽게 입소문을 내는 방법, 업종별 콘텐츠 포인트, 실패 사례까지 공개합니다.",
    readTime: "7분",
    result: "학원 수강생 3개월 +55%, 카페 방문객 +40%",
    href: "/blog/momcafe-viral-guide",
    internal: true,
  },
  {
    tag: "리뷰 마케팅",
    tagColor: "bg-blue-50 text-blue-700 border-blue-100",
    accentColor: "border-l-blue-600",
    title: "네이버 플레이스 리뷰 100개 만들기 — 실전 로드맵",
    preview: "리뷰가 없으면 순위가 없고, 순위가 없으면 방문객이 없습니다. 리뷰 요청 문자 템플릿, 사장님 답글 공식, 3개월 단계별 로드맵을 공개합니다.",
    readTime: "8분",
    result: "리뷰 0개 → 3개월 만에 127개 달성 사례",
    href: "/blog/naver-place-review-100",
    internal: true,
  },
  {
    tag: "카카오맵",
    tagColor: "bg-yellow-50 text-yellow-700 border-yellow-100",
    accentColor: "border-l-yellow-500",
    title: "카카오맵 마케팅 완전 가이드 — 신규 고객 유입 +700% 달성 전략",
    preview: "네이버만 보다가 카카오맵을 놓치면 절반의 고객을 잃습니다. 트렌드 순위 올리는 법, 2개월 로드맵, 리뷰 요청 스크립트까지 실전 전략을 모두 공개합니다.",
    readTime: "7분",
    result: "카카오맵 신규 고객 유입 +700% · 2개월",
    href: "/blog/kakaomap-marketing-guide",
    internal: true,
  },
  {
    tag: "업종별 전략",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
    accentColor: "border-l-indigo-600",
    title: "의원·한의원 마케팅 완전 가이드 — 초진 예약 3배 만든 6개월 전략",
    preview: "병원·한의원은 신뢰가 전부입니다. 블로그로 원장님 전문성을 쌓고, 체험단으로 후기를 늘리고, 플레이스 SEO로 상위 노출까지 — 실제 경기 분당 피부과 6개월 성과를 공개합니다.",
    readTime: "8분",
    result: "초진 예약 +300% · 6개월 · 경기 분당 피부과",
    href: "/blog/clinic-marketing-guide",
    internal: true,
  },
  {
    tag: "SNS 마케팅",
    tagColor: "bg-pink-50 text-pink-600 border-pink-100",
    accentColor: "border-l-pink-500",
    title: "미용실·네일 인스타그램 팔로워 0명에서 1천명 만드는 법",
    preview: "미용 업종은 비포애프터 한 장이 광고 예산 수백만원보다 강합니다. 어떻게 찍고, 어떻게 올리고, 팔로워를 예약으로 전환하는지 실전 전략을 공개합니다.",
    readTime: "7분",
    result: "수원 네일샵 — 3개월 팔로워 1,200명·예약 마감",
    href: "/blog/beauty-instagram-follower",
    internal: true,
  },
  {
    tag: "플레이스 SEO",
    tagColor: "bg-blue-50 text-blue-600 border-blue-100",
    accentColor: "border-l-blue-500",
    title: "구글 지도 마케팅 — 외국인 관광객·MZ 고객 유입 전략",
    preview: "네이버만 보다가 구글 지도를 놓치면 MZ세대와 외국인 방문객을 잃습니다. 구글 비즈니스 프로필 최적화, 리뷰 전략, 사진 관리법을 공개합니다.",
    readTime: "6분",
    result: "구글 지도 월 방문 +280% · 4개월",
    href: "/blog/google-maps-seo",
    internal: true,
  },
  {
    tag: "블로그 마케팅",
    tagColor: "bg-blue-50 text-blue-700 border-blue-100",
    accentColor: "border-l-blue-600",
    title: "소상공인을 위한 로컬 키워드 발굴 완전 가이드",
    preview: "키워드를 잘못 고르면 글을 100개 써도 손님이 안 옵니다. 검색량은 많지만 경쟁이 낮은 틈새 키워드를 찾는 방법을 단계별로 공개합니다.",
    readTime: "8분",
    result: "키워드 전략 변경 후 블로그 유입 +310% · 3개월",
    href: "/blog/keyword-research-local",
    internal: true,
  },
  {
    tag: "리뷰 마케팅",
    tagColor: "bg-blue-50 text-blue-700 border-blue-100",
    accentColor: "border-l-blue-600",
    title: "사장님 답글 공식 20선 — 리뷰별 맞춤 템플릿 완전판",
    preview: "리뷰에 답글 달기가 귀찮은 가장 큰 이유는 뭐라고 써야 할지 모르기 때문입니다. 별점별·상황별 답글 20가지 템플릿을 공개합니다.",
    readTime: "5분",
    result: "답글률 30% → 95% 달성 후 플레이스 순위 2단계 상승",
    href: "/blog/review-response-templates",
    internal: true,
  },
  {
    tag: "업종별 전략",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
    accentColor: "border-l-indigo-600",
    title: "학원 수강생 55% 늘린 마케팅 — 맘카페부터 블로그까지",
    preview: "학원 마케팅은 학부모를 설득하는 일입니다. 학부모가 가는 채널(맘카페, 네이버 플레이스, 블로그)에 집중하면 수강생이 늘어납니다. 3개월 실전 과정을 공개합니다.",
    readTime: "8분",
    result: "수도권 영어학원 수강생 +55% · 3개월",
    href: "/blog/academy-marketing-guide",
    internal: true,
  },
];

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
