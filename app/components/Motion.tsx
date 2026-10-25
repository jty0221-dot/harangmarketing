"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 스크롤 움직임 (TR-0057 · 2026-10-24 · 기준 `홈페이지공장\움직임_적용기준.md` · 정본 `홈페이지공장\lib\motion.py`)
 *
 * 하랑은 B2B · 대행사 묶음이라 페이드 · 슬라이드 인 · 스태거 · 카운트업만 쓴다 (패럴랙스 없음).
 * - 숨기는 일은 <html class="mo"> 가 있을 때만 한다. 그 클래스는 layout 의 head 스크립트가
 *   동작 줄이기 · 자동 캡처(navigator.webdriver) · ?nomo 가 아닐 때만 붙인다. 원본 HTML 글은 그대로다
 * - 첫 화면에 이미 보이는 것(히어로 포함)은 건드리지 않는다
 * - 페이드 = 섹션 제목(main > section h2) · 슬라이드 인 + 스태거 = .stagger-children / [data-stagger] 의 자식
 * - 인쇄는 globals.css 의 @media print 가 다 보이게 한다
 */
/** globals.css 의 .mo [data-fx] transition 길이와 같아야 한다 */
const DUR = 0.7;

export default function Motion() {
  const pathname = usePathname() || "";

  useEffect(() => {
    if (!document.documentElement.classList.contains("mo") || pathname.startsWith("/admin")) return;

    // 처음 보고는 '숨길지' 만 정한다. 이미 보이거나 지나간 것은 그대로 두고, 아래에 있는 것만 숨긴다.
    // getBoundingClientRect 로 직접 재지 않는 것은 마운트 때 강제 레이아웃을 만들지 않으려고다
    const todo = new Map<Element, [string, number]>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          const el = en.target as HTMLElement;
          const first = todo.get(el);
          if (first) {
            todo.delete(el);
            if (en.isIntersecting || en.boundingClientRect.top < 0) {
              io.unobserve(el);
            } else {
              el.setAttribute("data-fx", first[0]);
              if (first[1]) el.style.setProperty("--mo-delay", `${first[1]}s`);
            }
            continue;
          }
          if (!en.isIntersecting) continue;
          el.classList.add("in");
          io.unobserve(el);
          // 다 나타난 뒤 표시를 걷는다. 카드의 hover 들림 · 기울기가 원래 transition 으로 돌아온다
          const delay = parseFloat(el.style.getPropertyValue("--mo-delay")) || 0;
          setTimeout(() => {
            el.removeAttribute("data-fx");
            el.classList.remove("in");
            el.style.removeProperty("--mo-delay");
          }, (DUR + delay) * 1000 + 50);
        }
      },
    );
    const mark = (el: HTMLElement, fx: string, delay = 0) => {
      if (todo.has(el) || el.hasAttribute("data-fx") || el.closest(".reveal-item,.reveal-left,.reveal-right,.reveal-scale")) return;
      todo.set(el, [fx, delay]);
      io.observe(el);
    };

    document.querySelectorAll<HTMLElement>("main > section h2").forEach((h) => mark(h, "fade"));
    document.querySelectorAll<HTMLElement>(".stagger-children, [data-stagger]").forEach((g) => {
      // 한 줄 안에서만 시간차가 의미 있다. 뒤쪽 칸이 너무 늦게 뜨지 않게 0.4초에서 끊는다
      Array.from(g.children).forEach((c, i) => mark(c as HTMLElement, "up", Math.min(i * 0.08, 0.4)));
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
