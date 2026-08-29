import type { MetadataRoute } from "next";
import { SITE } from "./lib/seo";

/**
 * robots.txt
 *
 * 주의: public/robots.txt 를 다시 만들지 말 것.
 * 정적 파일이 이 라우트를 덮어써서 아래 설정이 전부 무시된다.
 *
 * GEO 정책: AI 학습·검색 크롤러를 전면 허용한다.
 * 차단하면 ChatGPT·Claude·Perplexity·Gemini 답변에서 하랑마케팅이 아예 인용되지 않는다.
 */

// 관리자·API·디자인 미리보기·클라이언트 보고서·SNS 기능 화면은 인덱스에서 뺀다 (메타 noindex 와 이중 방어).
// "/admin" 은 끝 슬래시 없이 — "/admin/" 은 bare /admin 경로와 매칭되지 않는다.
// "/r/" 은 끝 슬래시 필수 — "/r" 로 쓰면 /refund·/rss.xml 까지 막힌다.
const BLOCKED = ["/admin", "/api/", "/preview/", "/r/", "/sns/order", "/sns/track", "/sns/charge", "/sns/login", "/sns/signup", "/sns/me"];

/** 생성형 AI 검색·학습 크롤러 (GEO 핵심) */
const AI_BOTS = [
  "GPTBot",            // OpenAI 학습
  "OAI-SearchBot",     // ChatGPT 검색 인덱스
  "ChatGPT-User",      // ChatGPT 사용자 실시간 열람
  "ClaudeBot",         // Anthropic 학습
  "Claude-Web",        // Anthropic 웹 열람
  "Claude-User",       // Claude 사용자 실시간 열람
  "Claude-SearchBot",  // Claude 검색 인덱스
  "anthropic-ai",
  "PerplexityBot",     // Perplexity 인덱스
  "Perplexity-User",   // Perplexity 사용자 실시간 열람
  "Google-Extended",   // Gemini / AI 개요
  "Applebot-Extended", // Apple Intelligence
  "meta-externalagent",// Meta AI
  "Amazonbot",         // Alexa / Rufus
  "cohere-ai",
  "CCBot",             // Common Crawl (다수 LLM의 학습 원천)
  "Diffbot",
  "Timpibot",
  "Omgilibot",
  "YouBot",
];

/** 일반 검색엔진 크롤러 (SEO 핵심 — 네이버 우선) */
const SEARCH_BOTS = [
  "Yeti",              // 네이버
  "NaverBot",
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "Daum",              // 다음
  "Daumoa",
  "Applebot",
  "DuckDuckBot",
];

/** SNS 링크 미리보기 봇 — 공유 시 카드가 깨지지 않게 허용 */
const SOCIAL_BOTS = [
  "Twitterbot",
  "facebookexternalhit",
  "Slackbot",
  "LinkedInBot",
  "TelegramBot",
  "KakaoTalk-Scrap",
];

export default function robots(): MetadataRoute.Robots {
  const allow = (userAgent: string) => ({
    userAgent,
    allow: "/",
    disallow: BLOCKED,
  });

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: BLOCKED },
      ...AI_BOTS.map(allow),
      ...SEARCH_BOTS.map(allow),
      ...SOCIAL_BOTS.map(allow),
    ],
    sitemap: [`${SITE.base}/sitemap.xml`, `${SITE.base}/rss.xml`],
    host: SITE.base,
  };
}
