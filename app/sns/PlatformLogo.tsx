import {
  siInstagram, siYoutube, siThreads, siTiktok,
  siFacebook, siX, siNaver, siKakaotalk, siTelegram,
} from "simple-icons";
import type { PlatformId } from "../lib/sns-store";

/**
 * 플랫폼 공식 로고 (simple-icons 경로 데이터)
 *
 * lucide 에는 브랜드 아이콘이 없어 simple-icons 를 쓴다.
 * 로고는 각 플랫폼 서비스를 가리키는 식별 용도로만 사용한다 (제휴 표시 아님).
 * 틀 색은 공식 브랜드 컬러 기준. 인스타그램만 공식 그라데이션을 CSS 로 흉내낸다.
 */

interface Brand {
  path: string;
  /** 타일 배경 (tailwind class 가 아닌 inline style 로 준다 — 브랜드색은 팔레트 밖 값) */
  bg: string;
  /** 글리프 색 — 대부분 흰색, 카카오만 짙은 갈색 */
  fg: string;
  /** 밝은 배경 위 단색 글리프 색 */
  plain: string;
}

/**
 * 국내 커머스 브랜드는 simple-icons 에 글리프가 없다.
 * 상표를 흉내 내지 않고, 브랜드 색 타일 위에 짧은 워드마크를 얹어 구분한다.
 * mark 가 두 줄이면 위아래로 쌓는다 (38px 타일에서 한 줄로는 안 읽힌다).
 */
interface WordMark {
  mark: string[];
  bg: string;
  fg: string;
  plain: string;
}

const WORDMARKS: Partial<Record<PlatformId, WordMark>> = {
  coupang: { mark: ["쿠팡"], bg: "#C81E2D", fg: "#ffffff", plain: "#C81E2D" },
  musinsa: { mark: ["무신사"], bg: "#111111", fg: "#ffffff", plain: "#111111" },
  oliveyoung: { mark: ["올리브", "영"], bg: "#A0CE3B", fg: "#ffffff", plain: "#79A227" },
  ohou: { mark: ["오늘의", "집"], bg: "#35C5F0", fg: "#ffffff", plain: "#1B9FC9" },
  baemin: { mark: ["배민"], bg: "#2AC1BC", fg: "#ffffff", plain: "#1C9A96" },
  daangn: { mark: ["당근"], bg: "#FF6F0F", fg: "#ffffff", plain: "#E85F00" },
};

/** 워드마크가 없는 플랫폼이 들어왔을 때의 최후 기본값 */
const NEUTRAL: WordMark = { mark: ["SNS"], bg: "#8B95A1", fg: "#ffffff", plain: "#8B95A1" };

const BRANDS: Partial<Record<PlatformId, Brand>> = {
  instagram: {
    path: siInstagram.path,
    bg: "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 48%, #6228d7 100%)",
    fg: "#ffffff",
    plain: "#E1306C",
  },
  youtube: { path: siYoutube.path, bg: "#FF0000", fg: "#ffffff", plain: "#FF0000" },
  threads: { path: siThreads.path, bg: "#111111", fg: "#ffffff", plain: "#111111" },
  tiktok: { path: siTiktok.path, bg: "#111111", fg: "#ffffff", plain: "#111111" },
  facebook: { path: siFacebook.path, bg: "#0866FF", fg: "#ffffff", plain: "#0866FF" },
  x: { path: siX.path, bg: "#111111", fg: "#ffffff", plain: "#111111" },
  telegram: { path: siTelegram.path, bg: "#229ED9", fg: "#ffffff", plain: "#229ED9" },
  naver: { path: siNaver.path, bg: "#03C75A", fg: "#ffffff", plain: "#03C75A" },
  kakao: { path: siKakaotalk.path, bg: "#FEE500", fg: "#3C1E1E", plain: "#3C1E1E" },
};

/** 브랜드 포인트 컬러 — 카드 테두리·글자 강조 등에 쓴다 */
export function brandColor(id: PlatformId): string {
  return BRANDS[id]?.plain ?? WORDMARKS[id]?.plain ?? NEUTRAL.plain;
}

/** 작은 타일에서는 워드마크가 뭉개진다 — 28px 미만이면 첫 글자만 남긴다 */
function wordMarkLines(w: WordMark, size: number): string[] {
  if (size < 28) return [w.mark.join("").slice(0, 1)];
  return w.mark;
}

function markFontSize(w: WordMark, size: number): number {
  if (size < 28) return Math.round(size * 0.5);
  const longest = Math.max(...w.mark.map((m) => m.length));
  const ratio = longest >= 3 ? 0.29 : longest === 2 ? 0.4 : 0.5;
  return Math.max(8, Math.round(size * ratio));
}

/**
 * 타일형 로고 — 브랜드색 라운드 사각형 안에 글리프.
 * size 는 타일 한 변(px). 글리프는 타일의 54% 크기.
 */
export function PlatformLogo({
  id,
  size = 36,
  radius,
  className = "",
}: {
  id: PlatformId;
  size?: number;
  radius?: number;
  className?: string;
}) {
  const b = BRANDS[id];
  const w = b ? null : WORDMARKS[id] ?? NEUTRAL;
  const glyph = Math.round(size * 0.54);
  return (
    <span
      className={`inline-flex flex-col items-center justify-center shrink-0 shadow-sm leading-none ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius ?? Math.max(8, Math.round(size * 0.28)),
        background: b?.bg ?? w!.bg,
      }}
      aria-hidden
    >
      {b ? (
        <svg width={glyph} height={glyph} viewBox="0 0 24 24" role="img">
          <path d={b.path} fill={b.fg} />
        </svg>
      ) : (
        wordMarkLines(w!, size).map((line, i) => (
          <span
            key={i}
            style={{
              color: w!.fg,
              fontSize: markFontSize(w!, size),
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.12,
            }}
          >
            {line}
          </span>
        ))
      )}
    </span>
  );
}

/** 단색 글리프 — 밝은 배경 위에 로고만 얹을 때 */
export function PlatformGlyph({
  id,
  size = 16,
  color,
  className = "",
}: {
  id: PlatformId;
  size?: number;
  color?: string;
  className?: string;
}) {
  const b = BRANDS[id];
  if (!b) {
    const w = WORDMARKS[id] ?? NEUTRAL;
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 leading-none ${className}`}
        style={{ width: size, height: size, color: color ?? w.plain, fontSize: Math.round(size * 0.8), fontWeight: 800 }}
        aria-hidden
      >
        {w.mark.join("").slice(0, 1)}
      </span>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-hidden className={`shrink-0 ${className}`}>
      <path d={b.path} fill={color ?? b.plain} />
    </svg>
  );
}
