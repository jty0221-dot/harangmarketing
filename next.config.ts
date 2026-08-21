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
    return [{ source: "/estimate", destination: "/contact", permanent: true }];
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
    ];
  },
};

export default nextConfig;
