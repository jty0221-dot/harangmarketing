export interface YTVideo {
  videoId: string;
  title: string;
  published: string;
}

/** 마대남 채널 ID (https://www.youtube.com/@madaenam) */
export const MADAENAM_CHANNEL_ID = "UCGCBCIO5B-TALayNqmtAyUg";

/**
 * RSS 실패 시 fallback (최신 3개).
 * RSS 가 살아 있으면 이 값은 쓰이지 않는다.
 * 갱신: curl "https://www.youtube.com/feeds/videos.xml?channel_id=UCGCBCIO5B-TALayNqmtAyUg"
 */
export const FALLBACK_LATEST: YTVideo[] = [
  { videoId: "FqSLlw-Xv6Y", title: "신규 청소업체, 두 달 만에 하루 물량 15건 만든 순서 전부 공개합니다", published: "2026-08-20" },
  { videoId: "zZCimzueOB0", title: "네이버 검색광고 7종 30초 정리", published: "2026-08-18" },
  { videoId: "cwdl60K2D1M", title: "네이버 광고 켜기 전에 이 4개부터 채우세요", published: "2026-08-16" },
];

export async function getLatestVideos(channelId: string, count = 3): Promise<YTVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return FALLBACK_LATEST.slice(0, count);
    const xml = await res.text();
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, count);
    if (!entries.length) return FALLBACK_LATEST.slice(0, count);
    return entries.map(([, content]) => {
      const videoId = content.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
      const raw = content.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
      const title = raw.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
      const published = content.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
      return { videoId, title, published };
    });
  } catch {
    return FALLBACK_LATEST.slice(0, count);
  }
}
