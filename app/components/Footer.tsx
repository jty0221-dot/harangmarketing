import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink, MessageCircle, ArrowRight, Handshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* 배포 상품 띠배너 — 모든 페이지 하단에서 상세페이지로 보내는 진입점 */}
      <Link
        href="/services/cafe-distribution"
        className="group block transition-opacity hover:opacity-95"
        style={{ background: "linear-gradient(90deg,#1655e8,#2f6bf5 55%,#5b8dfa)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black" style={{ color: "#1449c8" }}>
              신규 출시
            </span>
            <p className="text-[15px] font-black text-white md:text-[17px]">
              최적화 블로그 · 카페 배포
            </p>
            <p className="text-[13px] text-blue-100 md:text-[14px]">
              블로그 탭 + 카페 탭 동시 노출 · 1건당 28,600원부터
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-black transition-transform group-hover:translate-x-0.5 md:text-[14px]"
            style={{ color: "#1449c8" }}>
            상품 보기 <ArrowRight size={14} />
          </span>
        </div>
      </Link>

      {/* Pre-footer CTA strip */}
      <div style={{ background: "var(--h-dark)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Handshake size={13} className="text-yellow-300" strokeWidth={2.5} />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>재계약률 95% · 500+ 프로젝트</span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-white mb-1">
                지금 바로 무료 전략 진단을 받아보세요
              </h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                상담 비용 없음 · 계약 강요 없음 · 24시간 내 연락 보장
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white font-bold text-sm hover:bg-gray-100 transition-colors shadow-sm"
                style={{ color: "var(--h-navy)" }}>
                무료 진단 신청 <ArrowRight size={14} />
              </Link>
              <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 text-gray-900 font-bold text-sm hover:bg-yellow-300 transition-colors">
                <MessageCircle size={14} />카카오 상담
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Top band */}
      <div className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4 w-fit">
                <img src="/harang-icon.svg" alt="하랑마케팅 로고" className="w-8 h-8" />
                <span className="font-black text-white text-[17px]">하랑마케팅</span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                상생을 기반으로 한 마케팅.<br />
                10년 경력, 직접 담당합니다.
              </p>
              <div className="flex gap-2">
                {[
                  { label: "Blog", href: "https://blog.naver.com/harangmarketing", bg: "bg-green-600", letter: "N" },
                  { label: "Kakao", href: "https://pf.kakao.com/_MuUkG/chat", bg: "bg-yellow-400", letter: "K", dark: true },
                  { label: "Insta", href: "https://www.instagram.com/jty0221/", bg: "bg-gradient-to-br from-purple-600 to-pink-500", letter: "I" },
                  { label: "YouTube", href: "https://www.youtube.com/@madaenam", bg: "bg-red-600", letter: "Y" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center font-bold text-xs hover:opacity-80 transition-opacity shadow-sm ${s.dark ? "text-gray-900" : "text-white"}`}
                  >
                    {s.letter}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">서비스</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  // 단독 상세페이지가 있는 상품은 해시가 아닌 실제 경로로
                  ["하랑 스튜디오 (사진·영상 프로그램)", "/studio", true],
                  ["최적화 블로그 · 카페 배포", "/services/cafe-distribution", true],
                  ["카페 배포 레퍼런스", "/services/cafe-distribution/reference"],
                  ["블로그 마케팅", "/services#blog"],
                  ["플레이스 SEO", "/services#place"],
                  ["체험단·리뷰", "/services#review"],
                  ["인스타그램", "/services#sns"],
                  ["맘카페 바이럴", "/services"],
                  ["무료 플레이스 진단", "/free-check"],
                  ["패키지 견적 계산기", "/estimate"],
                ].map(([label, href, isNew]) => (
                  <li key={label as string}>
                    <Link
                      href={href as string}
                      className={`inline-flex items-center gap-1.5 transition-colors ${
                        isNew ? "font-bold text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-200"
                      }`}
                    >
                      {label}
                      {isNew && (
                        <span className="rounded px-1.5 py-0.5 text-[9px] font-black leading-none text-white"
                          style={{ background: "var(--h-navy)" }}>
                          NEW
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">바로가기</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  ["회사소개", "/about"],
                  ["마케팅상품", "/services"],
                  ["프로그램", "/studio"],
                  ["진행사례", "/cases"],
                  ["FAQ", "/faq"],
                  ["블로그", "/blog"],
                  ["진행과정", "/process"],
                  ["견적 계산기", "/estimate"],
                  ["상담신청", "/contact"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-gray-200 transition-colors text-gray-500">
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="https://blog.naver.com/harangmarketing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-gray-200 transition-colors text-gray-500"
                  >
                    네이버 블로그
                    <ExternalLink size={11} />
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">연락처</h4>
              <div className="space-y-2 mb-4">
                <a href="tel:010-7541-9054"
                  className="flex items-center gap-2.5 group bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl px-3 py-2.5 transition-colors">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--h-navy)" }}>
                    <Phone size={12} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold group-hover:text-blue-300 transition-colors">010-7541-9054</div>
                    <div className="text-[10px] text-gray-600">전화 상담</div>
                  </div>
                </a>
                <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 group bg-yellow-500/10 hover:bg-yellow-500/15 border border-yellow-500/20 rounded-xl px-3 py-2.5 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center shrink-0">
                    <MessageCircle size={12} className="text-gray-900" />
                  </div>
                  <div>
                    <div className="text-yellow-300 text-sm font-bold">카카오톡 상담</div>
                    <div className="text-[10px] text-gray-600">빠른 답변</div>
                  </div>
                </a>
                <a href="mailto:harangmarketing@naver.com"
                  className="flex items-center gap-2.5 group bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl px-3 py-2.5 transition-colors">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(12,35,81,0.3)" }}>
                    <Mail size={12} className="text-white" />
                  </div>
                  {/* min-w-0 이 없으면 이메일 주소가 flex 아이템의 최소 너비를 밀어올려
                      태블릿 폭(768px)에서 푸터 컬럼 밖으로 삐져나간다 */}
                  <div className="min-w-0">
                    <div className="truncate text-gray-300 text-xs group-hover:text-gray-100 transition-colors">harangmarketing@naver.com</div>
                    <div className="text-[10px] text-gray-600">이메일 문의</div>
                  </div>
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={11} className="text-gray-600 shrink-0 mt-0.5" />
                <span className="text-gray-600 text-[11px] leading-relaxed">
                  경기 고양시 일산동구 장백로19<br />더루벤투스카운티 501호
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-xs text-gray-600 space-y-1">
            <p>대표: 전태영 · 사업자등록번호: 706-68-00281 · 통신판매업신고: 2020-서울강서-1482</p>
            <p>개인정보보호책임자: 전태영</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
            <Link href="/terms" className="hover:text-gray-400 transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors font-semibold text-gray-500">개인정보처리방침</Link>
            <Link href="/refund" className="hover:text-gray-400 transition-colors">환불/취소 정책</Link>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-gray-700">
          {[
            ["재계약률 95%", "10년간 유지"],
            ["상담 비용 0원", "계약 강요 없음"],
            ["500+ 프로젝트", "대표 경력 10년+"],
            ["24시간 내 연락", "대표 직접 응답"],
          ].map(([val, sub]) => (
            <div key={val} className="flex items-center gap-1">
              <span className="font-black" style={{ color: "var(--h-blue-light)" }}>{val}</span>
              <span className="text-gray-700">·</span>
              <span>{sub}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-700 mt-3">© 2026 하랑마케팅. All rights reserved.</p>
      </div>
    </footer>
  );
}
