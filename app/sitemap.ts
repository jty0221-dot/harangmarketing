import type { MetadataRoute } from "next";
import { BLOG_META } from "./lib/blog-meta";

const BASE = "https://www.harangmarketing.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                              lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/about`,                   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services`,                lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services/cafe`,           lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/clinic`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/beauty`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/restaurant`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/academy`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/shopping`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/cases`,                   lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/cases/cafe-ilsan-place-1st`,             lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/cases/clinic-gangnam-booking-300`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/cases/restaurant-mapo-delivery-2x`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`,                 lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/free-check`,              lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/estimate`,                lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/process`,                 lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/faq`,                     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`,                    lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/location/gyeonggi`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/location/seoul`,          lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/location/incheon`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/terms`,                   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/privacy`,                 lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/refund`,                  lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = BLOG_META.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
