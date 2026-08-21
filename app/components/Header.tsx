"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown, MessageCircle, ArrowRight, Clock, Gift, TrendingUp, Shield } from "lucide-react";

const ANN_KEY = "harang_ann_v1";

const ANN_MESSAGES = [
  {
    badge: "이달 한정",
    badgeColor: "text-red-400",
    dot: "bg-red-400",
    text: <>신규 계약 3팀에게 <span className="text-white font-black">경쟁사 분석 리포트 무료 제공</span> · <span className="text-blue-400 font-bold">잔여 2자리</span></>,
    ctaLabel: "무료 신청",
    ctaHref: "/contact",
  },
  {
    badge: "실시간",
    badgeColor: "text-green-400",
    dot: "bg-green-400",
    text: <>이번 달 <span className="text-white font-black">12팀</span>이 무료 진단 신청 완료 · <span className="text-blue-300 font-bold">재계약률 95%</span></>,
    ctaLabel: "진단 신청",
    ctaHref: "/contact",
  },
  {
    badge: "신뢰",
    badgeColor: "text-blue-400",
    dot: "bg-blue-400",
    text: <>고의 작업 누락 시 <span className="text-white font-black">결제금액 10배 보상</span> · 대표 직접 담당 · <span className="text-blue-300 font-bold">상담 0원</span></>,
    ctaLabel: "자세히 보기",
    ctaHref: "/about",
  },
];

const NAV_ITEMS = [
  { label: "회사소개", href: "/about" },
  {
    label: "서비스",
    href: "/services",
    sub: [
      // 단독 상세페이지가 있는 상품은 해시가 아닌 실제 경로로 연결한다
      { label: "하랑 스튜디오 — 사진·영상 프로그램", href: "/studio" },
      { label: "최적화 블로그 · 카페 배포", href: "/services/cafe-distribution" },
      { label: "SNS 부스트 스토어 — 셀프 주문", href: "/sns" },
      { label: "블로그·기자단", href: "/services#blog" },
      { label: "플레이스 SEO", href: "/services#place" },
      { label: "SNS 마케팅", href: "/services#sns" },
      { label: "체험단·리뷰", href: "/services#review" },
      { label: "진행 과정", href: "/process" },
    ],
  },
  // 하랑 스튜디오(/studio)는 위 '서비스' 드롭다운 첫 줄에 둔다.
  // 최상위 항목으로 하나 더 넣으면 내비 폭(947px)이 모자라 스크롤 상태에서
  // 모든 메뉴 글자가 두 줄로 접힌다. 1280~1600px 전부에서 확인했다.
  // SNS스토어는 매출 직결 상품이라 예외로 최상위에 둔다 — 공백 없는 짧은 라벨이라
  // 자기 자신은 안 접히고, 대신 전화번호를 xl → 2xl 노출로 미뤄 폭을 확보했다.
  { label: "SNS스토어", href: "/sns", accent: true },
  { label: "마케팅 인사이트", href: "/blog" },
  { label: "진행사례", href: "/cases" },
  { label: "FAQ", href: "/faq" },
  { label: "상담신청", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  /**
   * 드롭다운 닫힘 지연 타이머.
   * 트리거와 메뉴 사이를 지날 때 순간적으로 hover 가 끊겨도 바로 닫히지 않게 한다.
   * (메뉴로 내려가다 닫혀서 하위 항목을 못 누르는 문제)
   */
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setDropdownOpen(true);
  };
  const closeDropdown = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    dropdownTimer.current = setTimeout(() => setDropdownOpen(false), 180);
  };
  useEffect(() => () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
  }, []);
  const [annClosed, setAnnClosed] = useState(true); // start true to avoid SSR flash
  const [annIdx, setAnnIdx] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem(ANN_KEY);
    if (saved !== "closed") setAnnClosed(false);
  }, []);

  useEffect(() => {
    if (annClosed) return;
    const t = setInterval(() => setAnnIdx((p) => (p + 1) % ANN_MESSAGES.length), 4000);
    return () => clearInterval(t);
  }, [annClosed]);

  const closeAnn = useCallback(() => {
    setAnnClosed(true);
    localStorage.setItem(ANN_KEY, "closed");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";
  const msg = ANN_MESSAGES[annIdx];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Bar */}
      {!annClosed && (
        <div className="relative bg-gray-950 border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${msg.dot} animate-pulse`} />
              <span className={`${msg.badgeColor} font-black text-[11px] uppercase tracking-wider`}>{msg.badge}</span>
            </div>
            <div className="hidden sm:block w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2 text-xs min-w-0">
              <span className="text-gray-300 truncate">{msg.text}</span>
            </div>
            <Link
              href={msg.ctaHref}
              /* 공지 바가 거의 검정이라 짙은 남색 버튼은 묻힌다 — 시그니처 블루로 띄운다 */
              className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-white font-black text-[11px] transition-colors"
              style={{ background: "var(--w-blue-50)" }}
            >
              <Clock size={10} strokeWidth={2.5} />
              {msg.ctaLabel}
              <ArrowRight size={10} strokeWidth={2.5} />
            </Link>
          </div>
          <button
            onClick={closeAnn}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-white/10 transition-colors text-gray-600 hover:text-gray-300"
            aria-label="닫기"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Nav Bar */}
      <div className={`transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-white/96 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[68px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <img src="/harang-icon.svg" alt="하랑마케팅 로고" className="w-8 h-8" />
              <div>
                <span
                  className={`font-black text-[17px] tracking-tight transition-colors ${
                    scrolled || !isHome ? "text-gray-900" : "text-white"
                  }`}
                >
                  {/* '마케팅'은 배경에 따라 색을 바꾼다.
                      흰 헤더에선 짙은 블루, 히어로 영상 위에선 밝은 블루라야 읽힌다. */}
                  하랑
                  <span
                    style={{
                      color: scrolled || !isHome ? "var(--w-blue-40)" : "var(--w-blue-70)",
                    }}
                  >
                    마케팅
                  </span>
                </span>
                {(scrolled || !isHome) && (
                  <div className="text-[11px] font-bold leading-none mt-0.5 tracking-tight" style={{ color: "var(--h-navy)" }}>
                    10년 경력 · 대표 직접 담당
                  </div>
                )}
              </div>
            </Link>

            {/* Desktop nav
                환경(OS 폰트 렌더링)에 따라 글자 폭이 달라져도 메뉴가 항목 안에서
                두 줄로 접히지 않도록 전 항목 whitespace-nowrap + 여백 축소.
                폭이 정 모자라면 항목이 접히는 대신 줄 전체가 유지된다.
                768~1023px(태블릿)는 nowrap 항목 전체가 들어가지 않아 햄버거로 전환. */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_ITEMS.map((item) =>
                item.sub ? (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={openDropdown}
                    onMouseLeave={closeDropdown}
                    onFocus={openDropdown}
                    onBlur={closeDropdown}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        pathname.startsWith(item.href)
                          ? scrolled || !isHome
                            ? "text-[#0C2351]"
                            : "text-blue-200"
                          : scrolled || !isHome
                          ? "text-gray-600 hover:text-gray-900"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {item.label}
                      <ChevronDown size={13} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                    </Link>
                    {dropdownOpen && (
                      /* pt-2 는 트리거와 메뉴 사이를 잇는 투명 브릿지다.
                         여기에 여백을 margin 으로 주면 그 틈에서 hover 가 끊겨
                         메뉴로 내려가는 도중 닫힌다. 반드시 padding 으로 둘 것. */
                      <div className="absolute left-0 top-full z-50 pt-2">
                        {/* w-64 — 가장 긴 항목이 한 줄에 들어가는 폭 */}
                        <div className="w-64 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                          {item.sub.map((s) => (
                            <Link
                              key={s.href}
                              href={s.href}
                              onClick={() => setDropdownOpen(false)}
                              className="flex min-h-[44px] items-center whitespace-nowrap px-4 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                            >
                              {s.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative whitespace-nowrap px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      pathname === item.href
                        ? scrolled || !isHome
                          ? ""
                          : "bg-white/10 text-white"
                        : item.accent
                        ? scrolled || !isHome
                          ? "font-bold text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                          : "font-bold text-blue-300 hover:text-blue-200 hover:bg-white/8"
                        : scrolled || !isHome
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        : "text-gray-300 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
              {/* SNS스토어 최상위 항목이 들어오며 1280~1535px 폭이 빠듯해졌다.
                  번호는 상단 공지·카카오 버튼·푸터에도 있어 2xl 부터만 보인다. */}
              <a
                href="tel:010-7541-9054"
                className={`hidden 2xl:flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-lg text-sm transition-colors ${scrolled || !isHome ? "text-gray-500 hover:text-gray-900" : "text-gray-400 hover:text-white"}`}
              >
                <Phone size={13} strokeWidth={2} />
                <span className="font-semibold text-xs">010-7541-9054</span>
              </a>
              <a
                href="https://pf.kakao.com/_MuUkG/chat"
                target="_blank"
                rel="noopener noreferrer"
                className={`ml-2 flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${scrolled || !isHome ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" : "bg-yellow-400/90 text-gray-900 hover:bg-yellow-300"}`}
              >
                <MessageCircle size={13} strokeWidth={2.5} />
                <span className="hidden lg:inline">카카오 상담</span>
              </a>
              <Link
                href="/contact"
                className="ml-1 flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90 shadow-sm"
                style={{ background: "var(--h-navy)" }}
              >
                무료 진단
              </Link>
            </nav>

            {/* Mobile button */}
            <button
              onClick={() => setOpen(!open)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled || !isHome
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="메뉴 열기"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="px-4 pt-4 pb-3 border-b border-gray-100">
              <div className="text-xs font-black text-gray-900">하랑마케팅</div>
              <div className="text-[11px] text-gray-400">10년 경력 · 소상공인 전문 · 대표 직접 담당</div>
            </div>
            <div className="px-4 py-3 space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      pathname === item.href || pathname.startsWith(item.href)
                        ? "bg-gray-100 text-gray-900 font-black"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.sub && (
                    <div className="ml-4 mt-0.5 space-y-0.5 mb-1">
                      {item.sub.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="flex min-h-[44px] items-center rounded-lg px-4 text-xs text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
                        >
                          · {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-2">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-1.5 w-full py-3.5 rounded-xl text-white font-black text-sm transition-opacity hover:opacity-90"
                style={{ background: "var(--h-navy)" }}
              >
                무료 진단 신청 (0원)
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://pf.kakao.com/_MuUkG/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-yellow-400 text-gray-900 font-bold text-sm"
                >
                  <MessageCircle size={13} strokeWidth={2.5} />카카오 상담
                </a>
                <a
                  href="tel:010-7541-9054"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm"
                >
                  <Phone size={13} strokeWidth={2.5} />전화 상담
                </a>
              </div>
              <p className="text-center text-[11px] text-gray-400">상담 비용 0원 · 계약 강요 없음 · 24시간 내 연락</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
