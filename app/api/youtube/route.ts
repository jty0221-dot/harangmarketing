import { NextResponse } from "next/server";
import { getLatestVideos, MADAENAM_CHANNEL_ID } from "../../lib/youtube-rss";

/**
 * 마대남 유튜브 최신 영상 — RSS 를 서버에서 가져와 반환한다.
 * 유튜브 RSS 는 브라우저에서 직접 못 부르므로(CORS) 이 라우트를 거친다.
 * 1시간 캐시 — 새 영상이 올라오면 최대 1시간 안에 홈 화면에 자동 반영된다.
 */
export const revalidate = 3600;

export async function GET() {
  const videos = await getLatestVideos(MADAENAM_CHANNEL_ID, 3);
  return NextResponse.json(
    { videos },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
