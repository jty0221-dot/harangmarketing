"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";

interface HeroSectionProps {
  videoSpeed?: number;
  showCta?: boolean;
  filmGrain?: boolean;
}

export default function HeroSection({
  videoSpeed = 1,
  showCta = true,
  filmGrain = true,
}: HeroSectionProps) {
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    const r = isFinite(videoSpeed) && videoSpeed > 0 ? videoSpeed : 1;
    v.playbackRate = r;

    // Chrome MEI 차단 시 비디오 데이터 다운로드도 막힘 → 명시적 load() 호출
    v.load();

    const tryPlay = () => {
      // 데이터 미로드 상태면 load() 재호출 후 canplay 이벤트에서 재시도
      if (v.readyState === 0) {
        v.load();
        v.addEventListener("canplay", () => v.play().catch(() => {}), { once: true });
      } else {
        v.play().catch(() => {});
      }
    };

    // 1차: 즉시 시도
    tryPlay();

    // 2차: 사용자 첫 상호작용(스크롤·클릭·터치) 시 재시도 — Chrome MEI 정책 우회
    const onInteract = () => tryPlay();
    const EVENTS = ["pointerdown", "touchstart", "scroll", "keydown"] as const;
    EVENTS.forEach(e => document.addEventListener(e, onInteract, { once: true, passive: true }));

    // 3차: IntersectionObserver — 히어로 섹션이 뷰포트에 진입할 때 재시도
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) tryPlay(); },
      { threshold: 0.1 }
    );
    io.observe(v);

    return () => {
      EVENTS.forEach(e => document.removeEventListener(e, onInteract));
      io.disconnect();
    };
  }, [videoSpeed]);

  return (
    <>
      <style>{`
        @keyframes haFadeUp {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes haLineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes haZoom {
          from { transform: scale(1.0); }
          to   { transform: scale(1.07); }
        }
        @keyframes haGrainShift {
          0%   { transform: translate(0,0); }
          25%  { transform: translate(-3%,2%); }
          50%  { transform: translate(2%,-3%); }
          75%  { transform: translate(-2%,-2%); }
          100% { transform: translate(0,0); }
        }
        @keyframes haCue {
          0%,100% { transform: translateY(0);  opacity: .55; }
          50%     { transform: translateY(7px); opacity: 1;   }
        }
        @keyframes haFloat0 {
          0%,100% { transform: perspective(600px) rotateX(4deg) rotateY(-6deg) translateY(0px); }
          50%     { transform: perspective(600px) rotateX(2deg) rotateY(-4deg) translateY(-10px); }
        }
        @keyframes haFloat1 {
          0%,100% { transform: perspective(600px) rotateX(-3deg) rotateY(5deg) translateY(0px); }
          50%     { transform: perspective(600px) rotateX(-5deg) rotateY(3deg) translateY(-12px); }
        }
        @keyframes haFloat2 {
          0%,100% { transform: perspective(600px) rotateX(5deg) rotateY(4deg) translateY(0px); }
          50%     { transform: perspective(600px) rotateX(3deg) rotateY(6deg) translateY(-8px); }
        }
        @keyframes haStatIn {
          from { opacity: 0; transform: perspective(600px) rotateX(20deg) translateY(30px); }
          to   { opacity: 1; }
        }
      `}</style>

      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100dvh",
          overflow: "hidden",
          background: "#001536",
          fontFamily: "'Pretendard','Apple SD Gothic Neo',sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* ── 배경 동영상 ── */}
        <video
          ref={vidRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 46%",
            willChange: "transform",
            animation: "haZoom 34s ease-in-out infinite alternate",
          }}
        >
          <source src="/hero-v4.mp4" type="video/mp4" />
        </video>

        {/* ── 우하단 블러 코너 ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "clamp(165px,18%,310px)",
            height: "clamp(115px,20%,245px)",
            pointerEvents: "none",
            zIndex: 3,
            backdropFilter: "blur(37px) brightness(0.78)",
            WebkitBackdropFilter: "blur(37px) brightness(0.78)",
            background:
              "radial-gradient(118% 118% at 100% 100%, rgba(0,21,54,0.92) 0%, rgba(0,21,54,0.78) 32%, rgba(0,21,54,0.3) 58%, rgba(0,21,54,0) 80%)",
            WebkitMaskImage:
              "radial-gradient(150% 150% at 100% 100%, #000 45%, transparent 100%)",
            maskImage:
              "radial-gradient(150% 150% at 100% 100%, #000 45%, transparent 100%)",
          }}
        />

        {/* ── 그라디언트 오버레이들 ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(125% 120% at 52% 40%, rgba(0,21,54,0) 46%, rgba(0,21,54,0.4) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(94deg, rgba(0,25,64,0.86) 0%, rgba(0,25,64,0.46) 32%, rgba(0,25,64,0.06) 60%, rgba(0,25,64,0) 76%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(0deg, rgba(0,21,54,0.76) 0%, rgba(0,21,54,0.18) 36%, rgba(0,21,54,0) 56%)",
          }}
        />

        {/* ── 필름 그레인 ── */}
        {filmGrain && (
          <div
            style={{
              position: "absolute",
              inset: "-6%",
              pointerEvents: "none",
              opacity: 0.09,
              mixBlendMode: "overlay",
              animation: "haGrainShift 1.6s steps(2) infinite",
              backgroundImage:
                "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22140%22 height=%22140%22 filter=%22url(%23n)%22/></svg>')",
            }}
          />
        )}

        {/* ── 텍스트 콘텐츠 ── */}
        <div
          style={{
            position: "absolute",
            left: "clamp(24px,4vw,72px)",
            right: "clamp(24px,4vw,72px)",
            bottom: "clamp(40px,7vh,86px)",
            zIndex: 5,
          }}
        >
          {/* 에이블 문구 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: "clamp(16px,2vh,24px)",
              animation: "haFadeUp .8s cubic-bezier(.2,.7,.2,1) .15s both",
            }}
          >
            <span
              style={{
                display: "block",
                width: 34,
                height: 2,
                background: "#fff",
                transformOrigin: "left",
                animation: "haLineGrow .7s ease .5s both",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "clamp(11px,1.05vw,15px)",
                fontWeight: 600,
                letterSpacing: "0.14em",
              }}
            >
              데이터 기반 마케팅 파트너
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              margin: 0,
              color: "#fff",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              fontSize: "clamp(28px,4.7vw,74px)",
              textShadow: "0 2px 30px rgba(5,12,32,0.4)",
              animation: "haFadeUp .9s cubic-bezier(.2,.7,.2,1) .28s both",
            }}
          >
            광고비 아까운 대표님은 나가주세요.
          </h1>

          {/* 서브 1 */}
          <p
            style={{
              margin: "clamp(16px,2.2vh,26px) 0 0",
              color: "#fff",
              fontWeight: 600,
              lineHeight: 1.45,
              letterSpacing: "-0.015em",
              fontSize: "clamp(15px,1.9vw,30px)",
              wordBreak: "keep-all",
              overflowWrap: "break-word",
              animation: "haFadeUp .9s cubic-bezier(.2,.7,.2,1) .44s both",
            }}
          >
            영업 전화 한 통 없이, 이번 달에만 대표님 같은 분{" "}
            <span
              style={{
                color: "#fff",
                fontWeight: 800,
                borderBottom: "3px solid rgba(255,255,255,0.85)",
                paddingBottom: 1,
              }}
            >
              12명
            </span>
            이 찾아왔습니다.
          </p>

          {/* 서브 2 */}
          <p
            style={{
              margin: "clamp(10px,1.4vh,16px) 0 0",
              color: "rgba(255,255,255,0.86)",
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
              fontSize: "clamp(13px,1.45vw,22px)",
              wordBreak: "keep-all",
              overflowWrap: "break-word",
              animation: "haFadeUp .9s cubic-bezier(.2,.7,.2,1) .58s both",
            }}
          >
            말 보단 결과! 지금 저희를 알게 되셨다면 절반은 성공입니다.
          </p>

          {/* CTA 버튼 */}
          {showCta && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 14,
                marginTop: "clamp(24px,3.2vh,40px)",
                animation: "haFadeUp .9s cubic-bezier(.2,.7,.2,1) .7s both",
              }}
            >
              <Link
                href="/free-check"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  background: "#fff",
                  color: "#001536",
                  fontWeight: 700,
                  fontSize: "clamp(13px,1.15vw,18px)",
                  padding: "15px 28px",
                  borderRadius: 999,
                  boxShadow: "0 12px 34px rgba(6,14,40,0.4)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                무료 마케팅 진단 받기
                <span style={{ fontSize: "1.1em", lineHeight: 1 }}>→</span>
              </Link>
              <Link
                href="/cases"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "clamp(13px,1.15vw,18px)",
                  padding: "15px 26px",
                  borderRadius: 999,
                  border: "1.5px solid rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                성공사례 보기
              </Link>
            </div>
          )}
        </div>

        {/* ── 3D 떠다니는 통계 카드 (데스크톱만) ── */}
        <div
          style={{
            position: "absolute",
            right: "clamp(24px,5vw,80px)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            pointerEvents: "none",
          }}
          className="hidden lg:flex"
        >
          {[
            { value: "500+", label: "누적 클라이언트", sub: "7년간 직접 관리", delay: "1s", anim: "haFloat0" },
            { value: "95%", label: "재계약률", sub: "성과가 증명한 신뢰", delay: "1.15s", anim: "haFloat1" },
            { value: "10년+", label: "현장 마케팅 경력", sub: "대행사 팀장 출신", delay: "1.3s", anim: "haFloat2" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 16,
                padding: "16px 22px",
                minWidth: 160,
                boxShadow: "0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.15)",
                animation: `haStatIn .9s cubic-bezier(.2,.7,.2,1) ${stat.delay} both, ${stat.anim} 5s ease-in-out ${stat.delay} infinite`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(20px,1.8vw,28px)",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: 4,
                  textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 2 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── 스크롤 큐 ── */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 7,
            animation: "haFadeUp 1s ease 1s both",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 11,
              letterSpacing: "0.22em",
              fontWeight: 600,
            }}
          >
            SCROLL
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 16,
              lineHeight: 1,
              animation: "haCue 1.8s ease-in-out infinite",
            }}
          >
            ↓
          </span>
        </div>
      </section>
    </>
  );
}
