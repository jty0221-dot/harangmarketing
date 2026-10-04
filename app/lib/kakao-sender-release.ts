/**
 * 카톡 예약 발송 · 최신 버전 정보 (서버에서만 읽는다)
 *
 * 정본은 프로그램 공개 저장소의 버전정보.json 이다. 대표가 판매자 도구의 버전 탭에서 올리면
 * 프로그램도 이 파일을 읽어 새 버전 단추를 켠다. 판매 페이지도 같은 파일을 읽어 손으로 고치지 않게 한다.
 *
 * - 한 시간마다 다시 읽는다 (fetch next.revalidate · ISR). 실패하면 KS.version 으로 떨어진다.
 * - 바뀐점은 밖에서 온 글이다. 화면에는 React 기본 이스케이프로만 그린다 (dangerouslySetInnerHTML 금지).
 * - 형식이 어긋난 값은 쓰지 않는다. 틀린 값이 빈 값보다 나쁘다.
 */

import { KS } from "./kakao-sender";

export const KS_RELEASE_URL =
  "https://raw.githubusercontent.com/jty0221-dot/kakao-sender/main/%EB%B2%84%EC%A0%84%EC%A0%95%EB%B3%B4.json";

export type KsRelease = {
  version: string;
  /** YYYY-MM-DD · 없으면 null */
  date: string | null;
  /** 화면용으로 짧게 자른 바뀐 점 한 줄 · 없으면 null */
  summary: string | null;
  /** 버전정보.json 에서 읽었는지 (false 면 KS.version 기본값) */
  live: boolean;
};

const VERSION_RE = /^\d{1,3}(\.\d{1,3}){1,3}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SUMMARY_MAX = 80;

/** 제어 문자 · 폭 0 문자 · 줄 구분 문자 · BOM (코드 값으로 본다) */
function isInvisible(code: number): boolean {
  return (
    code < 0x20 ||
    code === 0x7f ||
    (code >= 0x200b && code <= 0x200f) ||
    (code >= 0x2028 && code <= 0x202f) ||
    code === 0x2060 ||
    code === 0xfeff
  );
}

/** 제어 문자 · 폭 0 문자를 걷고, 첫 문장만 남기고, 길면 자른다 */
function toSummary(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const clean = Array.from(raw, (ch) => (isInvisible(ch.codePointAt(0) ?? 0) ? " " : ch))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return null;
  const end = clean.search(/[.!?](\s|$)/);
  const first = end >= 0 ? clean.slice(0, end + 1) : clean;
  return first.length > SUMMARY_MAX ? `${first.slice(0, SUMMARY_MAX - 1).trimEnd()}…` : first;
}

export async function getKsRelease(): Promise<KsRelease> {
  const fallback: KsRelease = { version: KS.version, date: null, summary: null, live: false };
  try {
    const res = await fetch(KS_RELEASE_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return fallback;
    const data: unknown = await res.json();
    if (!data || typeof data !== "object") return fallback;
    const d = data as Record<string, unknown>;
    const version = typeof d["최신버전"] === "string" ? d["최신버전"].trim() : "";
    if (!VERSION_RE.test(version)) return fallback;
    const date = typeof d["날짜"] === "string" && DATE_RE.test(d["날짜"]) ? d["날짜"] : null;
    return { version, date, summary: toSummary(d["바뀐점"]), live: true };
  } catch {
    return fallback;
  }
}

/** 2026-10-04 → 2026.10.04 (화면 표기) */
export function ksDateLabel(date: string | null): string | null {
  return date ? date.replace(/-/g, ".") : null;
}
