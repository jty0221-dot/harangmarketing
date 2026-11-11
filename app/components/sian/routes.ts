/*
 * 2026-11-12 시안 틀(app/components/sian)로 다시 짠 경로.
 * Header 가 이 목록을 보고 공지 띠를 끄고, 머리글을 홈처럼 투명하게 얹는다 (머리가 어두운 바탕이라).
 * 페이지를 새 틀로 옮기면 여기에 경로를 같이 적는다. 적지 않으면 공지 띠가 머리 위에 다시 뜬다.
 */
export const SIAN_ROUTES: ReadonlySet<string> = new Set([
  "/",
  "/services/cafe",
  "/services/clinic",
  "/services/beauty",
  "/services/restaurant",
  "/services/academy",
  "/services/shopping",
  "/services/place",
  "/services/blog-marketing",
  "/services/powercontents",
  "/services/review",
  "/services/instagram",
  "/services/homepage",
  "/services/detail-page",
  "/services/cafe-distribution",
  "/services/photo",
  "/services",
  "/about",
  "/cases",
  "/portfolio",
  "/process",
  "/faq",
  "/location",
  "/location/seoul",
  "/location/gyeonggi",
  "/location/incheon",
  "/contact",
]);
