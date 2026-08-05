import { getBlogIndex } from "../lib/blog-index";

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

  const items = sorted
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

  const lastBuild = toRfc822(sorted[0]?.date ?? new Date().toISOString());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>하랑마케팅 — 소상공인 마케팅 인사이트</title>
    <link>${BASE}/blog</link>
    <description>10년 경력 대표가 직접 쓰는 네이버 플레이스·블로그·SNS 마케팅 실전 노하우</description>
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
