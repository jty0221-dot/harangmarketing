import { getBlogIndex } from "../lib/blog-index";
import {
  PLACE_RANK_GENERATED, PLACE_RANK_TOTALS,
} from "../lib/place-rank-cases";

export const revalidate = 86400;

const BASE = "https://www.harangmarketing.com";

function toRfc822(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  // getBlogIndex() 가 이미 최신순 정렬 + /admin 발행 글 병합까지 처리한다
  const sorted = getBlogIndex();

  // 순위 계측 사례는 글이 아니라 기록이라 블로그 색인에 없다.
  // 갱신을 구독으로 받아볼 수 있게 맨 앞에 한 건만 싣는다 (숫자는 lib 에서만 온다).
  const rankItem = `    <item>
      <title>${escapeXml(`네이버 플레이스 순위 계측 사례 ${PLACE_RANK_TOTALS.works}건`)}</title>
      <link>${BASE}/cases/place-rank</link>
      <description>${escapeXml(
        `${PLACE_RANK_TOTALS.stores}곳 ${PLACE_RANK_TOTALS.keywords}개 키워드를 매일 재고 있습니다. 그중 상승이 확인된 ${PLACE_RANK_TOTALS.works}건을 키워드마다 한 장씩, 시작 순위와 확인된 순위와 걸린 일수만 적었습니다.`
      )}</description>
      <pubDate>${toRfc822(PLACE_RANK_GENERATED)}</pubDate>
      <guid isPermaLink="false">${BASE}/cases/place-rank?d=${PLACE_RANK_GENERATED}</guid>
      <category>순위 계측</category>
    </item>`;

  const postItems = sorted
    .map((post) => {
      const url = `${BASE}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <guid isPermaLink="true">${url}</guid>
      <category>${escapeXml(post.tag)}</category>
    </item>`;
    })
    .join("\n");

  const items = [rankItem, postItems].filter(Boolean).join("\n");

  // 계측 기록이 글보다 최신일 수 있어 둘 중 나중 날짜를 쓴다 (YYYY-MM-DD 는 사전순 = 시간순)
  const newest = [PLACE_RANK_GENERATED, sorted[0]?.date]
    .filter((d): d is string => Boolean(d))
    .sort()
    .pop();
  const lastBuild = toRfc822(newest ?? new Date().toISOString());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>하랑마케팅 — 소상공인 마케팅 인사이트</title>
    <link>${BASE}/blog</link>
    <description>10년 경력 실무진이 직접 쓰는 네이버 플레이스·블로그·SNS 마케팅 실전 노하우</description>
    <language>ko</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE}/icon-192.png</url>
      <title>하랑마케팅</title>
      <link>${BASE}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
