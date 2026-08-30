"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export default function AnimatedCounter({ to, duration = 1800, suffix = "", prefix = "", decimals = 0 }: Props) {
  const [value, setValue] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
