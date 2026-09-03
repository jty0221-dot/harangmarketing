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
      /* 지어낸 사례 심층 리포트 3편을 내렸다 (2026-09-04 · D-0181).
         방문객 +167% · 배달 매출 +113% · 신규 예약 +300% 는 어느 계측에서 나온 값인지 댈 수가 없었고
         피부과 편은 예약 건수를 적은 것만으로 D-0177 에 걸렸다.
         여섯 주소가 이미 색인돼 있어 404 로 두지 않고 실측 기록 페이지로 넘긴다.
         지역명을 뺐던 옛 주소 셋도 같은 곳으로 모은다. */
      { source: "/cases/cafe-place-1st", destination: "/cases/place-rank", permanent: true },
      { source: "/cases/clinic-booking-300", destination: "/cases/place-rank", permanent: true },
      { source: "/cases/restaurant-delivery-2x", destination: "/cases/place-rank", permanent: true },
      { source: "/cases/cafe-ilsan-place-1st", destination: "/cases/place-rank", permanent: true },
      { source: "/cases/clinic-gangnam-booking-300", destination: "/cases/place-rank", permanent: true },
      { source: "/cases/restaurant-mapo-delivery-2x", destination: "/cases/place-rank", permanent: true },
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
      {
        // 이노페이 결제창 복귀 지점만 프레임 허용 — 전역 SAMEORIGIN 을 이 한 경로에서 푼다.
        // 이노페이 결제창은 우리 페이지 위에 iframe 으로 뜨고, 카드 인증이 끝나면 그 프레임
        // 안에서 이 주소를 연다. SAMEORIGIN 이면 문서가 아예 안 떠서 결제 결과를 못 받는다.
        // 뒤에 오는 규칙이 앞의 값을 덮는다(Next.js Header Overriding Behavior).
        // frame-ancestors 로 이노페이 도메인만 허용하고, X-Frame-Options 는 최신 브라우저가
        // 무시하는 값으로 바꿔 CSP 판정만 남긴다.
        source: "/api/sns/charge/innopay/return",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.innopay.co.kr https://innopay.co.kr",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
