import type { MetadataRoute } from "next";
import { getBlogIndex } from "./lib/blog-index";
import { PAGE_UPDATED, SITE, updatedAt } from "./lib/seo";
import { SNAPSHOT_DATE } from "./lib/rank-records";
import { PLACE_RANK_GENERATED } from "./lib/place-rank-cases";
import { SNS_STORE_ENABLED } from "./lib/feature-flags";

const BASE = SITE.base;


export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // 바뀐 날을 아는 페이지는 그 날을, 모르는 페이지는 오늘을 적는다 (app/lib/seo.ts PAGE_UPDATED).
  // 전부 오늘로 적으면 검색엔진이 어느 페이지가 진짜 바뀌었는지 구분하지 못한다.
  const lm = (path: string): Date => (PAGE_UPDATED[path] ? new Date(PAGE_UPDATED[path]) : now);
  // 순위 데이터가 따로 갱신되는 네 페이지는 그 데이터 날짜까지 같이 본다 (updatedAt · 2026-09-20 · 요청 69 · 09-21 요청 70 에 portfolio · cases 추가).

  const allStaticPages: MetadataRoute.Sitemap = [
    { url: BASE,                              lastModified: lm("/"), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/about`,                   lastModified: lm("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services`,                lastModified: lm("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services/cafe`,           lastModified: lm("/services/cafe"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/clinic`,         lastModified: lm("/services/clinic"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/clinic/medical-ad-guide`, lastModified: lm("/services/clinic/medical-ad-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/beauty`,         lastModified: lm("/services/beauty"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/restaurant`,     lastModified: lm("/services/restaurant"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/photo`,          lastModified: lm("/services/photo"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/photo/price`,    lastModified: lm("/services/photo/price"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/photo/food`,     lastModified: lm("/services/photo/food"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/services/photo/stay`,     lastModified: lm("/services/photo/stay"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/services/academy`,        lastModified: lm("/services/academy"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/shopping`,       lastModified: lm("/services/shopping"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/review`,         lastModified: lm("/services/review"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services/place`,          lastModified: new Date(updatedAt("/services/place", SNAPSHOT_DATE)), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services/instagram`,      lastModified: lm("/services/instagram"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/detail-page`,     lastModified: lm("/services/detail-page"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/detail-page/reference`,       lastModified: lm("/services/detail-page/reference"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/services/cafe-distribution`,           lastModified: lm("/services/cafe-distribution"), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/services/cafe-distribution/reference`, lastModified: lm("/services/cafe-distribution/reference"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/studio`,                  lastModified: lm("/studio"), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/sns`,                     lastModified: lm("/sns"), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/portfolio`,               lastModified: new Date(updatedAt("/portfolio", PLACE_RANK_GENERATED)), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/cases`,                   lastModified: new Date(updatedAt("/cases", PLACE_RANK_GENERATED)), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/cases/place-rank`,        lastModified: new Date(updatedAt("/cases/place-rank", PLACE_RANK_GENERATED)), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/contact`,                 lastModified: lm("/contact"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/free-check`,              lastModified: lm("/free-check"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/process`,                 lastModified: lm("/process"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/faq`,                     lastModified: lm("/faq"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`,                    lastModified: lm("/blog"), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/location`,                lastModified: lm("/location"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/location/gyeonggi`,       lastModified: lm("/location/gyeonggi"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/location/seoul`,          lastModified: lm("/location/seoul"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/location/incheon`,        lastModified: lm("/location/incheon"), changeFrequency: "monthly", priority: 0.8 },
  ];

  // SNS 부스트 스토어를 감춘 동안에는 사이트맵에서도 뺀다 (app/lib/feature-flags.ts).
  // 화면은 404 를 주고 robots 는 차단하므로 사이트맵에 남겨두면 서로 어긋난 신호가 된다.
  const staticPages: MetadataRoute.Sitemap = SNS_STORE_ENABLED
    ? allStaticPages
    : allStaticPages.filter((page) => page.url !== `${BASE}/sns`);


  // /admin 발행 글 + 기존 정적 글을 함께 포함한다 (getBlogIndex 참고)
  const blogPages: MetadataRoute.Sitemap = getBlogIndex().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
