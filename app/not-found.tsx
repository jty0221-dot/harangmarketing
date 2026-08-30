import Link from "next/link";
import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ArrowRight, MessageCircle, Home, Search, Phone } from "lucide-react";

import { SITE } from "./lib/seo";
export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 — 하랑마케팅",
  description: "요청하신 페이지가 존재하지 않습니다. 하랑마케팅 홈으로 돌아가세요.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px] min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-2xl w-full text-center">
            {/* 404 graphic */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="text-[120px] md:text-[160px] font-black text-gray-100 leading-none select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-200">
                  <Search size={28} className="text-white" strokeWidth={2} />
                </div>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              페이지를 찾을 수 없어요
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
              요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
              아래 링크에서 원하시는 내용을 찾아보세요.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 text-left">
              {[
                { label: "서비스 소개", href: "/services", sub: "블로그·플레이스·SNS" },
                { label: "진행 사례", href: "/cases", sub: "업종별 성과 확인" },
                { label: "업종별 사례", href: "/portfolio", sub: "공개 사례 119건" },
                { label: "상담 신청", href: "/contact", sub: "무료 · 0원" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-md transition-all group"
                >
                  <div className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-0.5">
                    {link.label}
                  </div>
                  <div className="text-[11px] text-gray-400">{link.sub}</div>
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Home size={15} />
                홈으로 돌아가기
              </Link>
              <a
                href="https://pf.kakao.com/_MuUkG/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 text-gray-900 font-black text-sm hover:bg-yellow-300 transition-colors"
              >
                <MessageCircle size={15} />
                카카오로 문의하기
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors"
              >
                무료 상담 신청 <ArrowRight size={14} />
              </Link>
            </div>

            <div className="inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Phone size={11} className="text-blue-500" strokeWidth={2.5} />
                010-7541-9054
              </span>
              <span>상담 비용 0원</span>
              <span>24시간 내 연락</span>
              <span>재계약률 {SITE.stats.renewalRate}</span>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
