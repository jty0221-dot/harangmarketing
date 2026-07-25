import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // 일반 크롤러 + AI 크롤러 전체 허용
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        // GPTBot (ChatGPT) — GEO 허용
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        // Google-Extended (Bard/Gemini) — GEO 허용
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        // ClaudeBot (Anthropic) — GEO 허용
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        // PerplexityBot — GEO 허용
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        // Yeti (Naver 크롤러) — 네이버 SEO 최우선
        userAgent: "Yeti",
        allow: "/",
        disallow: ["/admin/"],
      },
    ],
    sitemap: [
      "https://www.harangmarketing.com/sitemap.xml",
      "https://www.harangmarketing.com/rss.xml",
    ],
    host: "https://www.harangmarketing.com",
  };
}
