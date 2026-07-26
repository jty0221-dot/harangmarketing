export interface YTVideo {
  videoId: string;
  title: string;
  published: string;
}

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

// RSS 실패 시 fallback (최신 3개)
const FALLBACK_LATEST: YTVideo[] = [
  { videoId: "L0XdKXCN_Zw", title: "문신·반영구 사장님, 이제 당당하게 네이버 마케팅 하세요 | 2026 정책 완전정리", published: "2026-07-18" },
  { videoId: "q2IcOuqWLjE", title: "출장 서비스업 대표님들! 마케팅 이렇게만 하세요", published: "2026-07-09" },
  { videoId: "u06CD3BTqyE", title: "2026년 블로그 상위노출 네이버의 충격적인 결정(네이버 메이트, AI 브리핑)", published: "2026-07-01" },
];
