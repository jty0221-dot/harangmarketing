"use client";

import { useEffect, useRef, ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right" | "scale";
}

export default function RevealOnScroll({ children, delay = 0, className = "", from = "bottom" }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const fromClass = from === "left" ? "reveal-left" : from === "right" ? "reveal-right" : from === "scale" ? "reveal-scale" : "reveal-item";

  return (
    <div ref={ref} className={`${fromClass} ${className}`}>
      {children}
    </div>
  );
}
