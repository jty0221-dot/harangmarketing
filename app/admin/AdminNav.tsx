import Link from "next/link";
import { Home, BookOpen, ExternalLink, ShoppingBag, Wallet, FileText, Users, Clapperboard } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="bg-gray-950 border-b border-white/5">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/harang-icon.svg" alt="하랑마케팅" className="w-6 h-6" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="text-white font-black text-sm">하랑 관리자</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <BookOpen size={13} />
            블로그 글
          </Link>
          <Link
            href="/admin/sns"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ShoppingBag size={13} />
            SNS 주문
          </Link>
          <Link
            href="/admin/sns/charges"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Wallet size={13} />
            충전 관리
          </Link>
          <Link
            href="/admin/sns/members"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Users size={13} />
            회원·잔액
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FileText size={13} />
            진행 보고서
          </Link>
          <Link
            href="/admin/video-kb"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Clapperboard size={13} />
            영상 지식고
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Home size={13} />
            홈페이지
          </Link>
          <Link
            href="/blog"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <BookOpen size={13} />
            블로그 보기
            <ExternalLink size={11} />
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function AdminFooter() {
  return (
    <footer className="border-t border-gray-100 py-6">
      <div className="max-w-4xl mx-auto px-4 md:px-6 flex items-center justify-between text-[11px] text-gray-400">
        <span>하랑마케팅 관리자 페이지</span>
        <Link href="/" className="hover:text-gray-600 transition-colors">
          ← 홈페이지로 돌아가기
        </Link>
      </div>
    </footer>
  );
}
