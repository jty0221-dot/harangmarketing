import { BLOG_META } from "./blog-meta";
import { getAllPosts } from "./blog-posts";

/**
 * 블로그 글 통합 인덱스 (서버 전용)
 *
 * 하랑마케팅 블로그 글은 두 곳에 나뉘어 있다.
 *   1) content/blog-posts.json  — /admin 발행 글. 발행하면 GitHub Contents API 로
 *      main 에 커밋되어 재배포된다 (github-content.ts). 다만 개설 후 발행 0건 —
 *      2026-08 현재 실제 글은 전부 2) 경로다. 이 파일이 [] 인 것은 정상 상태다.
 *   2) app/lib/blog-meta.ts     — 코드로 넣은 글 (현재 전 편이 이 경로)
 *
 * sitemap · rss.xml · llms.txt 는 반드시 이 함수를 통해 글 목록을 가져올 것.
 * 각자 BLOG_META 만 직접 import 하면 /admin 에서 새 글을 발행해도
 * 검색엔진·AI 크롤러에는 영원히 노출되지 않는다. (이전에 그 상태였음)
 *
 * fs 를 쓰므로 서버 컴포넌트·라우트 핸들러에서만 호출해야 한다.
 */

export interface BlogEntry {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  /** 발행 경로 — 운영 중 문제 추적용 */
  source: "cms" | "static";
}

/** /admin 에서 발행한 글에 태그가 없을 때 쓰는 기본 분류 */
const DEFAULT_TAG = "마케팅 인사이트";

export function getBlogIndex(): BlogEntry[] {
  // /admin 발행 글 (published=true 만, 최신순)
  const cms: BlogEntry[] = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tag: DEFAULT_TAG,
    date: p.date,
    source: "cms",
  }));

  // 같은 슬러그면 /admin 에서 발행한 글이 우선
  const cmsSlugs = new Set(cms.map((p) => p.slug));
  const legacy: BlogEntry[] = BLOG_META.filter((m) => !cmsSlugs.has(m.slug)).map((m) => ({
    slug: m.slug,
    title: m.title,
    excerpt: m.excerpt,
    tag: m.tag,
    date: m.date,
    source: "static",
  }));

  return [...cms, ...legacy].sort((a, b) => b.date.localeCompare(a.date));
}
