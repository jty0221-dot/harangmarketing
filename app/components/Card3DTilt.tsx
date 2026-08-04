"use client";

import { useRef } from "react";

interface Card3DTiltProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
}

export default function Card3DTilt({
  children,
  className = "",
  style = {},
  intensity = 10,
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * intensity;
    const ry = ((cx - x) / cx) * intensity;

    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;

    if (glowRef.current) {
      const pct_x = (x / rect.width) * 100;
      const pct_y = (y / rect.height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${pct_x}% ${pct_y}%, rgba(255,255,255,0.12) 0%, transparent 65%)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    if (glowRef.current) {
      glowRef.current.style.background = "transparent";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        ...style,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
        willChange: "transform",
        position: "relative",
      }}
    >
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: 1,
          transition: "background 0.1s ease",
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
