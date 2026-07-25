import type { Metadata, Viewport } from "next";
import "./globals.css";
import FloatingCTA from "./components/FloatingCTA";
import SocialProofToast from "./components/SocialProofToast";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.harangmarketing.com"),
  title: {
    default: "하랑마케팅 | 소상공인 마케팅 대행사",
    template: "%s | 하랑마케팅",
  },
  description:
    "10년 경력 대표 직접 담당. 네이버 플레이스·블로그·체험단·인스타그램으로 매출 상승. 상담 무료, 재계약률 95%.",
  keywords: [
    "마케팅대행사", "소상공인마케팅", "자영업자마케팅",
    "네이버플레이스", "플레이스SEO", "플레이스상위노출",
    "블로그마케팅", "블로그상위노출", "블로그배포",
    "체험단모집", "체험단대행", "리뷰마케팅",
    "인스타그램마케팅", "SNS마케팅", "맘카페바이럴",
    "하랑마케팅", "카페마케팅", "음식점마케팅",
    "학원마케팅", "미용실마케팅", "피부과마케팅",
    "카카오맵마케팅", "지역마케팅", "소상공인광고",
    "네이버플레이스순위올리기", "플레이스마케팅", "소상공인블로그",
    "서울마케팅대행사", "경기마케팅대행사", "전국마케팅대행사",
    "소상공인플레이스", "대표직접담당마케팅", "재계약률95",
    "카페플레이스상위노출", "음식점플레이스", "학원블로그마케팅",
  ],
  authors: [{ name: "하랑마케팅 대표 전태영", url: "https://harangmarketing.com/about" }],
  creator: "하랑마케팅",
  publisher: "하랑마케팅",
  alternates: {
    canonical: "https://www.harangmarketing.com",
    languages: { "ko-KR": "https://www.harangmarketing.com" },
    types: {
      "application/rss+xml": "https://www.harangmarketing.com/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://harangmarketing.com",
    siteName: "하랑마케팅",
    title: "하랑마케팅 | 소상공인 전문 마케팅 대행사",
    description:
      "플레이스·블로그·체험단·인스타그램 마케팅으로 매출 최대 +300%. 상담 무료, 재계약률 95%, 경기·서울·인천 전 지역.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "하랑마케팅 — 소상공인 전문 마케팅 대행사 | 재계약률 95% · 10년 경력",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "하랑마케팅 — 소상공인 전문 마케팅 대행사",
    description: "10년 경력 대표 직접 담당 · 플레이스 SEO · 블로그 · 체험단 · 인스타그램 · 재계약률 95%",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "AfYtoB_S-yaWlWRU11EAKsuhCduXfThm2IEi4ZNeYKQ",
    // 네이버 서치어드바이저 코드는 head에 직접 삽입
  },
  category: "마케팅",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        {/* 네이버 서치어드바이저 소유권 확인 */}
        <meta name="naver-site-verification" content="5e058632e3ac9891ac91638c144b083a4d694d0b" />
        {/* Bing Webmaster Tools */}
        <meta name="msvalidate.01" content="BING_VERIFICATION_CODE" />
        {/* Google Analytics GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', { page_path: window.location.pathname });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* ── WebSite + SearchAction (GEO/SEO: 사이트 엔티티 명확화) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://harangmarketing.com/#website",
              "name": "하랑마케팅",
              "alternateName": ["하랑 마케팅", "Harang Marketing"],
              "url": "https://harangmarketing.com",
              "description": "소상공인·자영업자 전문 마케팅 대행사. 네이버 플레이스 SEO, 블로그 마케팅, 체험단, 인스타그램 마케팅. 10년 경력 대표 직접 담당.",
              "inLanguage": "ko-KR",
              "potentialAction": {
                "@type": "SearchAction",
                "target": { "@type": "EntryPoint", "urlTemplate": "https://harangmarketing.com/blog?q={search_term_string}" },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* ── Organization (GEO: AI 검색 엔티티 신뢰도 강화) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://harangmarketing.com/#organization",
              "name": "하랑마케팅",
              "alternateName": "Harang Marketing",
              "legalName": "하랑마케팅",
              "url": "https://harangmarketing.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://harangmarketing.com/favicon.svg",
                "width": 400,
                "height": 400,
              },
              "image": "https://harangmarketing.com/opengraph-image",
              "description": "10년 경력의 마케팅 전문가 전태영 대표가 직접 운영하는 소상공인·자영업자 전문 마케팅 대행사입니다. 네이버 플레이스 SEO, 블로그 마케팅, 체험단 모집, 인스타그램 마케팅 서비스를 제공합니다. 재계약률 95%, 500건 이상 프로젝트 완료.",
              "foundingDate": "2015",
              "founder": {
                "@type": "Person",
                "name": "전태영",
                "jobTitle": "대표",
                "description": "해병대 장교 출신. 카페 창업 실패 후 마케팅 전문가로 전향. 10년 경력.",
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "장백로19 더루벤투스카운티 501호",
                "addressLocality": "고양시 일산동구",
                "addressRegion": "경기도",
                "postalCode": "10402",
                "addressCountry": "KR",
              },
              "telephone": "+82-10-7541-9054",
              "email": "harangmarketing@naver.com",
              "areaServed": ["서울", "경기도", "인천", "대한민국"],
              "knowsAbout": [
                "네이버 플레이스 SEO", "블로그 마케팅", "체험단 마케팅",
                "인스타그램 마케팅", "소상공인 마케팅", "리뷰 마케팅",
                "카카오맵 마케팅", "맘카페 바이럴", "SNS 마케팅",
              ],
              "sameAs": [
                "https://blog.naver.com/harangmarketing",
                "https://www.instagram.com/jty0221/",
                "https://pf.kakao.com/_MuUkG",
              ],
              "numberOfEmployees": { "@type": "QuantitativeValue", "value": 5 },
            }),
          }}
        />
        {/* ── LocalBusiness (네이버·구글 지도 연동 + 로컬 SEO) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["LocalBusiness", "ProfessionalService", "MarketingAgency"],
              "@id": "https://harangmarketing.com/#localbusiness",
              "name": "하랑마케팅",
              "image": "https://harangmarketing.com/opengraph-image",
              "url": "https://harangmarketing.com",
              "telephone": "010-7541-9054",
              "email": "harangmarketing@naver.com",
              "priceRange": "월 30만원~",
              "currenciesAccepted": "KRW",
              "paymentAccepted": "계좌이체, 카드",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "장백로19 더루벤투스카운티 501호",
                "addressLocality": "고양시 일산동구",
                "addressRegion": "경기도",
                "postalCode": "10402",
                "addressCountry": "KR",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 37.6630,
                "longitude": 126.7750,
              },
              "openingHoursSpecification": [
                { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "18:00" },
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": "127",
                "reviewCount": "127",
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "하랑마케팅 서비스",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "네이버 플레이스 SEO", "description": "네이버 플레이스 상위 노출 최적화. 키워드 설정, 사진 최적화, 리뷰 관리." } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "블로그 마케팅", "description": "네이버 블로그 SEO 최적화 및 키워드 상위 노출. 블로그 배포, 홈페이지형 블로그 제작." } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "체험단 모집 대행", "description": "업종별 맞춤 체험단 모집 및 리뷰 마케팅 대행." } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "인스타그램 마케팅", "description": "인스타그램 콘텐츠 제작, 팔로워 증가, 릴스 마케팅." } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "카카오맵 마케팅", "description": "카카오맵 플레이스 등록 및 상위 노출 최적화." } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "맘카페 바이럴 마케팅", "description": "지역 맘카페를 활용한 소상공인 바이럴 마케팅." } },
                ],
              },
              "areaServed": [
                { "@type": "City", "name": "서울" },
                { "@type": "AdministrativeArea", "name": "경기도" },
                { "@type": "City", "name": "인천" },
              ],
              "sameAs": [
                "https://blog.naver.com/harangmarketing",
                "https://www.instagram.com/jty0221/",
                "https://pf.kakao.com/_MuUkG",
              ],
            }),
          }}
        />
        {/* ── FAQPage (AEO: 답변 엔진·AI 검색 직접 노출) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "하랑마케팅 상담 비용이 얼마인가요?", "acceptedAnswer": { "@type": "Answer", "text": "하랑마케팅의 상담 비용은 완전 무료(0원)입니다. 경쟁사 분석, 현황 진단, 전략 제안까지 모두 무료로 제공합니다. 계약 강요 없이 솔직하게 안내드립니다." } },
                { "@type": "Question", "name": "네이버 플레이스 상위 노출까지 얼마나 걸리나요?", "acceptedAnswer": { "@type": "Answer", "text": "업종과 지역 경쟁 강도에 따라 다르지만, 보통 1개월 차부터 순위 변화가 시작되고 3개월 차에 Top 5 진입이 가능합니다. 실제 클라이언트 사례에서 3개월 만에 플레이스 1위를 달성했습니다." } },
                { "@type": "Question", "name": "어떤 업종에 특화되어 있나요?", "acceptedAnswer": { "@type": "Answer", "text": "카페·베이커리, 음식점·배달, 미용·네일·뷰티, 의원·한의원·피부과, 학원·교육, 온라인 쇼핑몰 6개 업종에 특화되어 있습니다. 10년간 500건 이상의 실전 프로젝트를 완료했습니다." } },
                { "@type": "Question", "name": "하랑마케팅 서비스 가격은 얼마인가요?", "acceptedAnswer": { "@type": "Answer", "text": "서비스 유형과 범위에 따라 다르며, 월 30만원부터 시작합니다. 무료 상담을 통해 업종과 목표에 맞는 맞춤 패키지와 정확한 견적을 제공합니다." } },
                { "@type": "Question", "name": "성과가 없으면 어떻게 되나요?", "acceptedAnswer": { "@type": "Answer", "text": "3개월 안에 협의한 목표치를 달성하지 못하면 다음 달 비용을 조정합니다. 고의 작업 누락 시 결제금액 10배 보상을 약속합니다. 계약 전에 성과 가능 여부를 솔직하게 먼저 안내드립니다." } },
                { "@type": "Question", "name": "최소 계약 기간이 얼마인가요?", "acceptedAnswer": { "@type": "Answer", "text": "기본 3개월 단위이며 성과에 따라 월 단위 연장도 가능합니다. 장기 계약 강요는 없습니다. 재계약률 95%로 고객 만족도가 높습니다." } },
                { "@type": "Question", "name": "지방에서도 상담 가능한가요?", "acceptedAnswer": { "@type": "Answer", "text": "네, 하랑마케팅은 전국 어디서나 비대면으로 서비스합니다. 경기도, 서울, 인천은 물론 지방 소상공인도 카카오톡·전화·화상으로 상담하고 온라인으로 모든 작업을 진행합니다." } },
                { "@type": "Question", "name": "네이버 블로그 마케팅이란 무엇인가요?", "acceptedAnswer": { "@type": "Answer", "text": "네이버 블로그 마케팅은 네이버 검색에서 업종·지역 관련 키워드로 블로그 글이 상위에 노출되도록 최적화하는 마케팅 방법입니다. 하랑마케팅은 블로그 배포, 키워드 SEO, 홈페이지형 블로그 제작 서비스를 제공합니다." } },
                { "@type": "Question", "name": "체험단 마케팅이란 무엇이고 효과가 있나요?", "acceptedAnswer": { "@type": "Answer", "text": "체험단 마케팅은 소비자에게 무료 또는 할인 제품·서비스를 제공하고 후기를 작성하게 하는 마케팅입니다. 실제 리뷰가 쌓이면 네이버 플레이스 순위와 신뢰도가 향상됩니다. 하랑마케팅은 업종별 최적화된 체험단 모집을 대행합니다." } },
              ],
            }),
          }}
        />
        {/* ── BreadcrumbList (네이버·구글 경로 탐색 구조화 데이터) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://www.harangmarketing.com" },
                { "@type": "ListItem", "position": 2, "name": "서비스", "item": "https://www.harangmarketing.com/services" },
                { "@type": "ListItem", "position": 3, "name": "진행사례", "item": "https://www.harangmarketing.com/cases" },
                { "@type": "ListItem", "position": 4, "name": "마케팅 인사이트", "item": "https://www.harangmarketing.com/blog" },
                { "@type": "ListItem", "position": 5, "name": "무료 상담", "item": "https://www.harangmarketing.com/contact" },
              ],
            }),
          }}
        />
        {children}
        <FloatingCTA />
        <SocialProofToast />
      </body>
    </html>
  );
}
