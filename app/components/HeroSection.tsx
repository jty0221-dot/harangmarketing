"use client";

import { useRef, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";

import { SITE, companyYear } from "../lib/seo";
import s from "../home.module.css";

/**
 * 동작 줄이기 설정. 켜 둔 방문자에게는 배경 영상을 처음부터 멈춘 채로 보여준다 (WCAG 2.2.2).
 * 서버에서는 설정을 알 수 없으니 false 로 그리고, 브라우저에서 값을 읽어 맞춘다.
 */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getReducedMotionOnServer = () => false;

/**
 * 개업 연차. 한국 시간 기준 올해에서 개업 연도를 빼고 1을 더한다 (2020년 개업 → 2026년 7년차).
 * 계산은 app/lib/seo.ts 의 companyYear 한 곳이다. 해가 바뀌면 저절로 한 해 늘어난다.
 */
function companyYearText(): string {
  return `${companyYear()}년차`;
}

/**
 * 첫 화면 아래 네 칸. 숫자는 SITE 상수와 개업 연도에서만 온다 (1-C · 회사 나이와 대표 경력은 다른 숫자다).
 */
const FACTS = [
  { value: `${SITE.foundingDate.slice(0, 4)}년 개업`, sub: `올해 ${companyYearText()}` },
  { value: `마케터 경력 ${SITE.stats.years}`, sub: "대행사 팀장 출신 대표가 직접" },
  { value: `누적 프로젝트 ${SITE.stats.projects}`, sub: `${SITE.stats.years} 경력 동안` },
  { value: "상담 · 진단 0원", sub: "계약 여부는 상담 뒤에 결정" },
];

/**
 * 홈 첫 화면 (2026-11-12 시안). 떠다니는 숫자 카드 · SCROLL 표시 · 문구 위 꾸밈 줄은 걷었다.
 * 경쟁사 분석 리포트 한 줄은 홈에서만 숨긴 상단 공지 띠에서 옮겨 왔다.
 */
export default function HeroSection({ videoSpeed = 1 }: { videoSpeed?: number }) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getReducedMotionOnServer);
  // null 이면 방문자가 아직 버튼을 누르지 않은 것이다. 그때는 동작 줄이기 설정을 따른다
  const [pauseChoice, setPauseChoice] = useState<boolean | null>(null);
  const paused = pauseChoice ?? reduceMotion;
  // 아래 재생 재시도 효과는 videoSpeed 가 바뀔 때만 다시 걸리므로, 멈춤 여부는 ref 로 읽는다
  const pausedRef = useRef(paused);
  const readyRef = useRef(false);

  // 이 효과가 재생 재시도 효과보다 먼저 선언돼야 첫 렌더에서 pausedRef 가 먼저 맞춰진다
  useEffect(() => {
    pausedRef.current = paused;
    const v = vidRef.current;
    if (!v) return;
    if (paused) v.pause();
    else if (readyRef.current) v.play().catch(() => {});
  }, [paused]);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    const r = isFinite(videoSpeed) && videoSpeed > 0 ? videoSpeed : 1;
    v.playbackRate = r;

    // 영상(약 2.7MB)은 페이지가 다 뜬 뒤에 받는다. 그 전에는 포스터가 보인다.
    // 처음부터 받으면 휴대폰에서 글자 · 스크립트와 회선을 다퉈 첫 화면이 늦어졌다 (2026-10-07 실측)
    readyRef.current = false;
    const onCanPlay = () => {
      if (readyRef.current && !pausedRef.current) v.play().catch(() => {});
    };

    const tryPlay = () => {
      // 아직 받을 차례가 아니거나, 방문자가 멈췄거나 동작 줄이기를 켰으면 틀지 않는다
      if (!readyRef.current || pausedRef.current) return;
      // 데이터 미로드 상태면 load() 재호출 후 canplay 이벤트에서 재시도
      if (v.readyState === 0) {
        v.load();
        v.removeEventListener("canplay", onCanPlay);
        v.addEventListener("canplay", onCanPlay, { once: true });
      } else {
        v.play().catch(() => {});
      }
    };

    // 1차: 페이지가 다 뜨고 1.2초 뒤 받기 시작 (Chrome MEI 차단 시 다운로드도 막히므로 명시적 load())
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    const start = () => { readyRef.current = true; tryPlay(); };
    const schedule = () => { startTimer = setTimeout(start, 1200); };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

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
      readyRef.current = false;
      v.removeEventListener("canplay", onCanPlay);
      if (startTimer) clearTimeout(startTimer);
      window.removeEventListener("load", schedule);
      EVENTS.forEach(e => document.removeEventListener(e, onInteract));
      io.disconnect();
    };
  }, [videoSpeed]);

  return (
    <section className={s.hero}>
      {/* autoPlay 속성은 두지 않는다. load() 가 자동 재생 표시를 다시 켜서, 멈춘 뒤에도 영상이 저절로 다시 돈다.
          재생은 위 효과의 tryPlay 가 멈춤 여부를 확인하고 맡는다 */}
      <video ref={vidRef} muted loop playsInline preload="none" poster="/hero-v4-poster.jpg" aria-hidden="true">
        <source src="/hero-v4.mp4" type="video/mp4" />
      </video>

      {/* 5초 넘게 움직이는 화면은 멈출 수 있어야 한다 (WCAG 2.2.2) */}
      <button
        type="button"
        onClick={() => setPauseChoice(!paused)}
        aria-label={paused ? "배경 영상 재생" : "배경 영상 멈춤"}
        className={s.pause}
      >
        {paused ? <Play size={16} strokeWidth={2.5} aria-hidden="true" /> : <Pause size={16} strokeWidth={2.5} aria-hidden="true" />}
      </button>

      <div className={s.wrap}>
        <h1>
          매출을 장담하는 대신,<br />
          될 확률을 높입니다.
        </h1>
        <p className={s.lead}>
          마케팅 비용은 광고비가 아니라 {SITE.stats.years} 동안 쌓은 경험과 문제를 푸는 시간입니다.
          상품 · 가격 · 시장 · 고객 마음까지 따져, 지금 조건에서 가장 효율적인 길을 하랑 대표가 함께 찾습니다.
        </p>
        <div className={s.acts}>
          <Link href="/free-check" className={`${s.btn} ${s.btnWhite}`}>내 매장 현재 상태 확인하기</Link>
          <Link href="/cases/place-rank" className={s.textLink}>실제 계측 사례 보기</Link>
        </div>
        <p className={s.gift}>상담을 신청하시면 경쟁사 분석 리포트를 드립니다. 계약 전에 확인하실 수 있습니다.</p>
        <dl className={s.facts}>
          {FACTS.map((f) => (
            <div key={f.value}>
              <dt>{f.value}</dt>
              <dd>{f.sub}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
