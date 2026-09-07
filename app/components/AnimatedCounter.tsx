"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface Props {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

/**
 * useLayoutEffect 는 서버에 없다. 서버에서 부르면 React 가 경고를 찍으므로 브라우저에서만 쓴다.
 * 이 훅이 필요한 이유는 아래 첫 번째 훅의 주석에 적었다.
 */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function AnimatedCounter({ to, duration = 1800, suffix = "", prefix = "", decimals = 0 }: Props) {
  /*
   * 처음 값이 0 이 아니라 to 다 (2026-09-07 (월)).
   *
   * 이 숫자는 브라우저가 화면을 그린 뒤 자바스크립트가 세어 올리는 값이었다. 그래서 서버가 내보내는
   * HTML 에는 언제나 0 이 박혔다. 사람 눈에는 안 보이는 차이지만 검색 로봇과 AI 는 그 HTML 을 읽는다.
   * 실제로 /cases 의 정적 HTML 이 `0건 순위 계측 사례` · `0+ 완료 프로젝트` 로 나가고 있었다.
   *
   * 그래서 서버가 내보내는 값은 완성된 숫자로 두고, 세어 올리는 일은 브라우저에서만 시작한다.
   * 0 으로 내려놓는 것은 아래 useBeforePaint 안에서 하는데, 그 훅은 화면을 칠하기 전에 끝나므로
   * 방문자가 완성된 숫자를 먼저 봤다가 0 으로 되돌아가는 깜빡임은 생기지 않는다.
   */
  const [value, setValue] = useState(to);
  const [flipped, setFlipped] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  /* 화면을 칠하기 직전에 출발선으로 되돌린다. 움직임을 원치 않는 방문자에게는 되돌리지 않는다 */
  useBeforePaint(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      started.current = true;
      return;
    }
    setValue(0);
    setFlipped(false);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setFlipped(true);
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(parseFloat((eased * to).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(tick);
            else setValue(to);
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration, decimals]);

  return (
    <span
      ref={ref}
      className="tabular-nums"
      style={{
        display: "inline-block",
        perspective: "400px",
        transformStyle: "preserve-3d",
      }}
    >
      <span
        style={{
          display: "inline-block",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateX(0deg)" : "rotateX(-90deg)",
          transformOrigin: "center bottom",
          transition: flipped ? "transform 0.7s cubic-bezier(0.2,0.8,0.2,1)" : "none",
        }}
      >
        {prefix}{decimals > 0 ? value.toFixed(decimals) : Math.floor(value)}
        {suffix ? <span className="counter-suffix">{suffix}</span> : null}
      </span>
    </span>
  );
}
