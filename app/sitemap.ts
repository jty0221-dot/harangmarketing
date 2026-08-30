import type { MetadataRoute } from "next";
import { getBlogIndex } from "./lib/blog-index";
import { SITE } from "./lib/seo";
import { SNS_STORE_ENABLED } from "./lib/feature-flags";

const BASE = SITE.base;

/** 사례 상세 슬러그 — app/cases/[slug]/page.tsx 의 CASES 키와 반드시 일치시킬 것 */
const CASE_SLUGS = [
  "cafe-place-1st",
  "clinic-booking-300",
  "restaurant-delivery-2x",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const allStaticPages: MetadataRoute.Sitemap = [
    { url: BASE,                              lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/about`,                   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services`,                lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services/cafe`,           lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/clinic`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/beauty`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/restaurant`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/academy`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/shopping`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/detail-page`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/detail-page/reference`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/services/cafe-distribution`,           lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/services/cafe-distribution/reference`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/studio`,                  lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/sns`,                     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/portfolio`,               lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/cases`,                   lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/contact`,                 lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/free-check`,              lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/process`,                 lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/faq`,                     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`,                    lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/location`,                lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/location/gyeonggi`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/location/seoul`,          lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/location/incheon`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // SNS 부스트 스토어를 감춘 동안에는 사이트맵에서도 뺀다 (app/lib/feature-flags.ts).
  // 화면은 404 를 주고 robots 는 차단하므로 사이트맵에 남겨두면 서로 어긋난 신호가 된다.
  const staticPages: MetadataRoute.Sitemap = SNS_STORE_ENABLED
    ? allStaticPages
    : allStaticPages.filter((page) => page.url !== `${BASE}/sns`);

  const casePages: MetadataRoute.Sitemap = CASE_SLUGS.map((slug) => ({
    url: `${BASE}/cases/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // /admin 발행 글 + 기존 정적 글을 함께 포함한다 (getBlogIndex 참고)
  const blogPages: MetadataRoute.Sitemap = getBlogIndex().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...casePages, ...blogPages];
}
