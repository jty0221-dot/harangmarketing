import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  /**
   * content/blog-posts.json 은 fs.readFileSync 로 읽기 때문에
   * Next 의 자동 의존성 추적에 잡히지 않는다.
   * ISR 재생성 시점(rss.xml, llms.txt)에 파일이 없으면 글 목록이 비므로
   * 배포 번들에 항상 포함시킨다.
   */
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  /* 견적 계산기 폐지 — 업체마다 금액이 달라 계산기 방식이 맞지 않는다.
     기존 링크·검색 유입은 상담 페이지로 넘긴다. */
  async redirects() {
    return [
      { source: "/estimate", destination: "/contact", permanent: true },
      /* 사례 주소에서 지역명을 뺐다. 사례는 지역이 아니라 업종으로 묶이고,
         이전 주소는 이미 색인돼 있어 301 로 넘긴다. */
      { source: "/cases/cafe-ilsan-place-1st", destination: "/cases/cafe-place-1st", permanent: true },
      { source: "/cases/clinic-gangnam-booking-300", destination: "/cases/clinic-booking-300", permanent: true },
      { source: "/cases/restaurant-mapo-delivery-2x", destination: "/cases/restaurant-delivery-2x", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/hero-v4.mp4",
        headers: [
          { key: "Accept-Ranges", value: "bytes" },
          { key: "Content-Type", value: "video/mp4" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // 전역 보안 응답 헤더 (심층방어).
        // X-Frame-Options 는 DENY 가 아니라 SAMEORIGIN — /r/[code] 보고서를 동일 출처
        // 미리보기·인쇄 프레임에서 열 여지를 남긴다. CSP 는 인라인 JSON-LD·GA 스크립트가
        // 많아 여기 enforce 로 넣지 않는다(필요 시 Report-Only 로 먼저 관측 후 좁힌다).
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
