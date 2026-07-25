import { getAllPosts } from "../lib/blog-posts";

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
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${BASE}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <guid isPermaLink="true">${url}</guid>
    </item>`;
    })
    .join("\n");

  const lastBuild = posts.length > 0 ? toRfc822(posts[0].date) : new Date().toUTCString();

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
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
