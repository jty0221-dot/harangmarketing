import type { MetadataRoute } from "next";
import { SITE } from "./lib/seo";

/**
 * 웹 앱 매니페스트.
 *
 * icon-192·icon-512·apple-touch-icon 는 public 에 이미 있었는데
 * 이것들을 묶는 매니페스트가 없어서, 안드로이드 홈 화면 추가 때 아이콘과 이름이
 * 제대로 안 잡히고 크롬 주소창 테마색도 안 먹었다.
 *
 * display 를 standalone 으로 두면 홈 화면에서 열 때 브라우저 UI 없이 뜬다.
 * theme_color 는 WDS Primary(#0066FF) 를 그대로 쓴다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} · ${SITE.tagline}`,
    short_name: SITE.name,
    description:
      "네이버 플레이스·블로그·SNS 를 함께 관리하는 소상공인 전문 마케팅 대행사입니다. 상담 비용은 0원입니다.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#0066FF",
    lang: "ko",
    dir: "ltr",
    categories: ["business", "marketing"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
