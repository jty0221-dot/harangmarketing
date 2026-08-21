import { NextResponse } from "next/server";
import { getRecentPublicInquiries } from "../../lib/inquiries";
import { getRecentCases } from "../../lib/portfolio";

/**
 * 홈페이지 우하단 알림에 쓸 데이터 (공개)
 *
 * 예전 알림은 코드에 박아둔 가짜 목록이었다. 여기서는 실제 데이터만 내보낸다.
 *   1) 최근 상담 신청 — 이름·연락처는 절대 내보내지 않고 업종과 시각만
 *   2) 실제 진행 사례 — 블로그에서 수집한 119건 중 최신
 *
 * 상담이 아직 쌓이지 않았으면 사례만 나간다.
 */

export const revalidate = 300; // 5분

export interface ProofItem {
  kind: "inquiry" | "case";
  text: string;
  sub: string;
  href?: string;
}

export async function GET() {
  const items: ProofItem[] = [];

  try {
    const inquiries = await getRecentPublicInquiries(6);
    for (const q of inquiries) {
      items.push({
        kind: "inquiry",
        text: `${q.industry} 사장님이 무료 진단을 신청했습니다`,
        sub: relativeTime(q.createdAt),
      });
    }
  } catch {
    // 상담 데이터가 없어도 사례만으로 동작한다
  }

  try {
    for (const c of getRecentCases(8)) {
      items.push({
        kind: "case",
        text: c.title.length > 46 ? `${c.title.slice(0, 46)}…` : c.title,
        sub: `${c.industry} · 진행 사례`,
        href: "/portfolio",
      });
    }
  } catch {}

  return NextResponse.json({ ok: true, items });
}

/** '3분 전' 처럼 사람이 읽는 표현으로. 정확한 시각은 내보내지 않는다. */
function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "최근";
  const min = Math.max(1, Math.round((Date.now() - then) / 60000));
  if (min < 60) return `${min}분 전`;
  const hour = Math.round(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.round(hour / 24);
  return `${day}일 전`;
}
