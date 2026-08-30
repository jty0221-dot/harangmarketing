export type BlogGroup = "칼럼" | "블로그" | "플레이스" | "인스타" | "그외";

export interface NaverBlogPost {
  title: string;
  link: string;
  thumbnail: string | null;
  pubDate: string;
  category: string;
  excerpt: string;
  group: BlogGroup;
}

const BLOG_ID    = "harangmarketing";
const NAVER_BASE = "https://blog.naver.com";
const RSS_URL    = "https://rss.blog.naver.com/harangmarketing.xml";
const RSS2JSON   = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&count=100`;
const PER_PAGE   = 30;

// 사장님 실제 카테고리 번호 → 탭 그룹
const CAT_NO_MAP: Record<number, BlogGroup> = {
  11: "칼럼",
  12: "블로그",
  13: "플레이스",
  14: "인스타",
   8: "그외",   // 포트폴리오
};

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Referer: `${NAVER_BASE}/${BLOG_ID}`,
  Accept: "application/json, text/javascript, */*; q=0.01",
  "Accept-Language": "ko-KR,ko;q=0.9",
  "X-Requested-With": "XMLHttpRequest",
};

// ─── 유틸 ────────────────────────────────────────────────────────────────────

function fmtDate(raw: string): string {
  const s = String(raw ?? "").replace(/\D/g, "");
  if (s.length >= 8) return `${s.slice(0,4)}.${s.slice(4,6)}.${s.slice(6,8)}`;
  try {
    const d = new Date(raw);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
  } catch { return raw.slice(0,10); }
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi,"")
    .replace(/<[^>]+>/g,"")
    .replace(/&nbsp;/g," ").replace(/&amp;/g,"&")
    .replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"')
    .replace(/\s+/g," ").trim();
}

function logNoFromUrl(url: string): string {
  return String(url ?? "").match(/\/(\d{8,})(?:\?|$)/)?.[1] ?? "";
}

function resolveGroup(catNo: number, catName: string, title: string): BlogGroup {
  // 1. 번호로 먼저 매칭
  if (CAT_NO_MAP[catNo]) return CAT_NO_MAP[catNo];

  // 2. 이름으로 매칭
  const c = catName.toLowerCase(), t = title.toLowerCase();
  if (c.includes("칼럼")) return "칼럼";
  if (c.includes("플레이스") || t.includes("플레이스") || t.includes("스마트플레이스")) return "플레이스";
  if (c.includes("블로그") || t.includes("블로그")) return "블로그";
  if (c.includes("인스타") || c.includes("쓰레드") || c.includes("sns") ||
      t.includes("인스타") || t.includes("릴스")) return "인스타";

  // 3. 제목 키워드
  if (t.includes("플레이스") || t.includes("스마트플레이스")) return "플레이스";
  if (t.includes("블로그")) return "블로그";

  return "그외";
}

// ─── Step 1: rss2json — 최신 글 + 썸네일 + excerpt 확보 ─────────────────────

interface RssItem {
  title?: string; link?: string; thumbnail?: string;
  pubDate?: string; categories?: string[]; description?: string; content?: string;
}

async function fetchRss(): Promise<{ posts: NaverBlogPost[]; thumbMap: Map<string, string> }> {
  const thumbMap = new Map<string, string>();
  try {
    const res = await fetch(RSS2JSON, { next: { revalidate: 3600 } });
    if (!res.ok) return { posts: [], thumbMap };
    const data = await res.json();
    if (data.status !== "ok" || !Array.isArray(data.items)) return { posts: [], thumbMap };

    const posts: NaverBlogPost[] = (data.items as RssItem[]).map((item) => {
      const cat   = (item.categories ?? [])[0] ?? "";
      const title = item.title ?? "";
      const logNo = logNoFromUrl(item.link ?? "");

      let thumbnail: string | null = (item.thumbnail ?? "").startsWith("http") ? item.thumbnail! : null;
      if (!thumbnail && item.content) {
        const m = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (m) thumbnail = m[1];
      }
      if (thumbnail && logNo) thumbMap.set(logNo, thumbnail);

      const raw = stripHtml(item.description ?? item.content ?? "");
      return {
        title,
        link:      item.link ?? "",
        thumbnail,
        pubDate:   fmtDate(item.pubDate ?? ""),
        category:  cat,
        excerpt:   raw.length > 120 ? raw.slice(0,120).trimEnd()+"..." : raw,
        group:     resolveGroup(0, cat, title),
      };
    });

    return { posts, thumbMap };
  } catch {
    return { posts: [], thumbMap };
  }
}

// ─── Step 2: PostTitleListAsync — categoryNo=0으로 전체 글 페이지네이션 ───────

interface RawPost {
  logNo?:       string | number;
  title?:       string;
  addDate?:     string;
  categoryNo?:  string | number;
  categoryName?: string;
  thumbnailUrl?: string;
}

async function fetchAllPostsApi(thumbMap: Map<string, string>): Promise<NaverBlogPost[]> {
  const posts: NaverBlogPost[] = [];
  let page = 1;
  let total = Infinity;

  while (posts.length < Math.min(total, 2000)) {
    const url =
      `${NAVER_BASE}/PostTitleListAsync.naver` +
      `?blogId=${BLOG_ID}&viewdate=&currentPage=${page}` +
      `&categoryNo=0&parentCategoryNo=0&countPerPage=${PER_PAGE}`;

    try {
      const res = await fetch(url, {
        headers: BROWSER_HEADERS,
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;

      const text = await res.text();
      let data: { totalCount?: number; postList?: RawPost[] };
      try { data = JSON.parse(text); } catch { break; }

      if (page === 1) {
        total = data.totalCount ?? 0;
        if (total === 0) break;
      }

      const list = data.postList ?? [];
      if (!list.length) break;

      for (const p of list) {
        const logNo   = String(p.logNo ?? "");
        const catNo   = Number(p.categoryNo ?? 0);
        const catName = p.categoryName ?? "";
        const title   = p.title ?? "";
        const rawThumb = p.thumbnailUrl?.startsWith("http") ? p.thumbnailUrl : null;

        posts.push({
          title,
          link:      `${NAVER_BASE}/${BLOG_ID}/${logNo}`,
          thumbnail: rawThumb ?? thumbMap.get(logNo) ?? null,
          pubDate:   fmtDate(p.addDate ?? ""),
          category:  catName,
          excerpt:   "",
          group:     resolveGroup(catNo, catName, title),
        });
      }

      if (list.length < PER_PAGE) break;
      page++;
    } catch { break; }
  }

  return posts;
}

// ─── 메인 export ─────────────────────────────────────────────────────────────

export async function getNaverBlogPosts(): Promise<NaverBlogPost[]> {
  // 1. rss2json: 최신 100개 + 썸네일 맵 확보
  const { posts: rssPosts, thumbMap } = await fetchRss();

  const rssLogNos = new Set(rssPosts.map(p => logNoFromUrl(p.link)));

  // 2. PostTitleListAsync: 전체 글 (categoryNo=0) — rss에 없는 구 글만 추가
  let apiPosts: NaverBlogPost[] = [];
  try {
    const all = await fetchAllPostsApi(thumbMap);
    // rss2json에서 이미 가져온 글은 제외 (썸네일/excerpt가 더 풍부하므로 rss 우선)
    apiPosts = all.filter(p => !rssLogNos.has(logNoFromUrl(p.link)));
  } catch { /* 차단 시 무시 */ }

  // 3. 병합 → 날짜 내림차순
  const merged = [...rssPosts, ...apiPosts];
  merged.sort((a, b) => b.pubDate.localeCompare(a.pubDate));

  if (merged.length === 0) return directXmlFallback();
  return merged;
}

// ─── 최후 폴백: RSS XML 직접 파싱 ────────────────────────────────────────────

async function directXmlFallback(): Promise<NaverBlogPost[]> {
  try {
    const res = await fetch(RSS_URL, {
      headers: { "User-Agent": BROWSER_HEADERS["User-Agent"], Referer: NAVER_BASE },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    return xml.split("<item>").slice(1, 51).map(raw => {
      const b   = raw.split("</item>")[0];
      const get = (tag: string) => {
        const m = b.match(new RegExp(`<${tag}[^>]*>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*</${tag}>`));
        return m?.[1]?.trim() ?? "";
      };
      const desc  = get("description");
      const title = get("title");
      const cat   = get("category");
      const img   = desc.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? null;
      const link  = (b.match(/<link>\s*([^\s<]+)\s*<\/link>/)?.[1] ?? get("link"))
        .replace(/\?fromRss=true.*$/,"");
      const text  = stripHtml(desc);
      return {
        title, link,
        thumbnail: img,
        pubDate:   fmtDate(get("pubDate")),
        category:  cat,
        excerpt:   text.length > 120 ? text.slice(0,120).trimEnd()+"..." : text,
        group:     resolveGroup(0, cat, title),
      };
    });
  } catch { return []; }
}
