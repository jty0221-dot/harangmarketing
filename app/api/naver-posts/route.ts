/**
 * 네이버 블로그 글 목록 — 1시간마다 다시 가져온다 (ISR).
 * edge 런타임은 Next 16 에서 deprecated 라 nodejs 기본값으로 돌렸다.
 * revalidate 없이 두면 빌드 시점에 정적으로 굳어 새 글이 안 잡힌다.
 */
export const revalidate = 3600;

const BLOG_ID = "harangmarketing";
const NAVER_BASE = "https://blog.naver.com";
const PER_PAGE = 30;

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Referer: `${NAVER_BASE}/${BLOG_ID}`,
  Accept: "application/json, text/javascript, */*; q=0.01",
  "Accept-Language": "ko-KR,ko;q=0.9",
  "X-Requested-With": "XMLHttpRequest",
};

const CAT_NO_MAP: Record<number, string> = {
  11: "칼럼",
  12: "블로그",
  13: "플레이스",
  14: "인스타",
  8: "그외",
};

function fmtDate(raw: string): string {
  const s = String(raw ?? "").replace(/\D/g, "");
  if (s.length >= 8)
    return `${s.slice(0, 4)}.${s.slice(4, 6)}.${s.slice(6, 8)}`;
  try {
    const d = new Date(raw);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return raw.slice(0, 10);
  }
}

function resolveGroup(catNo: number, catName: string, title: string): string {
  if (CAT_NO_MAP[catNo]) return CAT_NO_MAP[catNo];
  const c = catName.toLowerCase();
  const t = title.toLowerCase();
  if (c.includes("칼럼")) return "칼럼";
  if (c.includes("플레이스") || t.includes("플레이스")) return "플레이스";
  if (c.includes("블로그") || t.includes("블로그")) return "블로그";
  if (c.includes("인스타") || c.includes("쓰레드") || c.includes("sns")) return "인스타";
  if (t.includes("플레이스")) return "플레이스";
  if (t.includes("블로그")) return "블로그";
  return "그외";
}

export async function GET() {
  try {
    const posts: Array<{
      title: string;
      link: string;
      thumbnail: string | null;
      pubDate: string;
      category: string;
      excerpt: string;
      group: string;
    }> = [];

    let page = 1;
    let total = Infinity;

    while (posts.length < Math.min(total, 500)) {
      const url =
        `${NAVER_BASE}/PostTitleListAsync.naver` +
        `?blogId=${BLOG_ID}&viewdate=&currentPage=${page}` +
        `&categoryNo=0&parentCategoryNo=0&countPerPage=${PER_PAGE}`;

      const res = await fetch(url, { headers: BROWSER_HEADERS });
      if (!res.ok) break;

      const text = await res.text();
      let data: { totalCount?: number; postList?: Array<{
        logNo?: string | number;
        title?: string;
        addDate?: string;
        categoryNo?: string | number;
        categoryName?: string;
        thumbnailUrl?: string;
      }> };

      try {
        data = JSON.parse(text);
      } catch {
        break;
      }

      if (page === 1) {
        total = data.totalCount ?? 0;
        if (total === 0) break;
      }

      const list = data.postList ?? [];
      if (!list.length) break;

      for (const p of list) {
        const logNo = String(p.logNo ?? "");
        const catNo = Number(p.categoryNo ?? 0);
        const catName = p.categoryName ?? "";
        const title = p.title ?? "";
        const thumb =
          p.thumbnailUrl && p.thumbnailUrl.startsWith("http")
            ? p.thumbnailUrl
            : null;

        posts.push({
          title,
          link: `${NAVER_BASE}/${BLOG_ID}/${logNo}`,
          thumbnail: thumb,
          pubDate: fmtDate(p.addDate ?? ""),
          category: catName,
          excerpt: "",
          group: resolveGroup(catNo, catName, title),
        });
      }

      if (list.length < PER_PAGE) break;
      page++;
    }

    return new Response(JSON.stringify({ posts, total: posts.length }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ posts: [], total: 0, error: String(e) }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
