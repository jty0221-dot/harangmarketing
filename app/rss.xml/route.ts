import { getBlogIndex } from "../lib/blog-index";
import { PLACE_RANK_GENERATED } from "../lib/place-rank-cases";
import { CLINIC_LINE_PAGES } from "../lib/clinic-homepage";
import { PAGE_UPDATED } from "../lib/seo";

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
      <title>${escapeXml(`네이버 플레이스 순위 계측 사례 · 오후 2~3시에 잰 기록`)}</title>
      <link>${BASE}/cases/place-rank</link>
      <description>${escapeXml(
        `오후 2~3시에 잰 네이버 플레이스 순위를 키워드마다 한 장씩 적었습니다. 시작 순위와 확인된 순위와 걸린 일수만 적고, 상호와 지역명은 적지 않습니다.`
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

  // 병원 홈페이지 라인 여섯 쪽 (TR-0080) · RSS 를 서치어드바이저에 내면 사이트맵과 별도로 발견 경로가 하나 더 생긴다
  const clinicItems = CLINIC_LINE_PAGES.map((p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${BASE}${p.path}</link>
      <description>${escapeXml(p.desc)}</description>
      ${PAGE_UPDATED[p.path] ? `<pubDate>${toRfc822(PAGE_UPDATED[p.path])}</pubDate>` : ""}
      <guid isPermaLink="false">${BASE}${p.path}?d=${PAGE_UPDATED[p.path] ?? ""}</guid>
      <category>서비스 안내</category>
    </item>`).join("\n");

  const items = [rankItem, clinicItems, postItems].filter(Boolean).join("\n");

  // 피드에 포함된 글·계측·서비스 안내의 실제 수정일을 모두 반영한다.
  const newest = [PLACE_RANK_GENERATED, ...sorted.map(post => post.date), ...CLINIC_LINE_PAGES.map(page => PAGE_UPDATED[page.path])]
    .filter((d): d is string => Boolean(d))
    .sort()
    .pop();
  const lastBuild = newest ? toRfc822(newest) : undefined;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>하랑마케팅 · 소상공인 마케팅 인사이트</title>
    <link>${BASE}/blog</link>
    <description>10년 경력 실무진이 직접 쓰는 네이버 플레이스·블로그·SNS 마케팅 실전 노하우</description>
    <language>ko</language>
    ${lastBuild ? `<lastBuildDate>${lastBuild}</lastBuildDate>` : ""}
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
