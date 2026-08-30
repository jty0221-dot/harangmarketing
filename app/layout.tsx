import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./wds.css";   // WDS 컴포넌트 계층(.w-card/.w-btn/.w-input/타이포 별칭) — 전역에서 쓴다
import SiteChrome from "./components/SiteChrome";
import JsonLd from "./components/JsonLd";
import { SITE, ORG_ID, SITE_ID, LOCAL_ID, ANSWER_SENTENCES } from "./lib/seo";

/**
 * GA4 측정 ID.
 * 브라우저에 그대로 노출되는 공개 식별자라 코드에 두어도 문제없다.
 * 측정 ID를 바꿔야 하면 Vercel 환경변수 NEXT_PUBLIC_GA_ID 로 덮어쓸 수 있다.
 *
 * 2026-08-21 교체: 기존 G-EKX3PHCHVZ 는 대표 구글 계정(jty0221)에서 보이지 않는
 * 다른 계정 소속 속성이라 데이터를 확인할 수 없었다. 대표 계정 안에
 * '하랑마케팅 홈페이지' 속성을 새로 만들어 그 측정 ID 로 바꿨다.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-L1NX7TPP9Z";

/** Bing Webmaster Tools 소유권 확인 코드 (구글 서치콘솔 Import 로 인증했다면 불필요) */
const BING_VERIFICATION = process.env.NEXT_PUBLIC_BING_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.harangmarketing.com"),
  title: {
    default: "하랑마케팅 | 소상공인 마케팅 대행사",
    template: "%s | 하랑마케팅",
  },
  description:
    `10년 경력 대표가 처음부터 끝까지. 네이버 플레이스·블로그·체험단·인스타그램으로 매출 상승. 상담 무료, 재계약률 ${SITE.stats.renewalRate}.`,
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
    "소상공인플레이스", "담당자직접관리마케팅", "재계약률97",
    "카페플레이스상위노출", "음식점플레이스", "학원블로그마케팅",
  ],
  authors: [{ name: "하랑마케팅", url: "https://www.harangmarketing.com/about" }],
  creator: "하랑마케팅",
  publisher: "하랑마케팅",
  alternates: {
    canonical: "https://www.harangmarketing.com",
    languages: { "ko-KR": "https://www.harangmarketing.com" },
    types: {
      "application/rss+xml": "https://www.harangmarketing.com/rss.xml",
      // GEO: LLM 크롤러용 평문 요약본 위치를 head에서 알림
      "text/plain": "https://www.harangmarketing.com/llms.txt",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.harangmarketing.com",
    siteName: "하랑마케팅",
    title: "하랑마케팅 | 소상공인 전문 마케팅 대행사",
    description:
      `플레이스·블로그·체험단·인스타그램 마케팅. 네이버 플레이스 순위를 매일 계측합니다. 상담 무료, 재계약률 ${SITE.stats.renewalRate}, 전국 어디든 진행합니다.`,
    images: [
      {
        url: "https://www.harangmarketing.com/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: `하랑마케팅 — 소상공인 전문 마케팅 대행사 | 재계약률 ${SITE.stats.renewalRate} · 10년 경력`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "하랑마케팅 — 소상공인 전문 마케팅 대행사",
    description: `10년 경력 · 플레이스 SEO · 블로그 · 체험단 · 인스타그램 · 재계약률 ${SITE.stats.renewalRate}`,
    images: ["/og-image.png"],
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
        {/* Black Han Sans — 카페 배포 상세/레퍼런스의 대형 헤드라인·숫자 전용 (본문 사용 금지) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap"
        />
        {/* 네이버 서치어드바이저 소유권 확인 */}
        <meta name="naver-site-verification" content="5e058632e3ac9891ac91638c144b083a4d694d0b" />
        {/* Bing Webmaster Tools — NEXT_PUBLIC_BING_VERIFICATION 설정 시에만 삽입 */}
        {BING_VERIFICATION && <meta name="msvalidate.01" content={BING_VERIFICATION} />}

        {/* AEO/GEO: AI 답변 엔진이 읽는 핵심 사실 요약 */}
        <meta name="description-extended" content={ANSWER_SENTENCES.whoWeAre} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="하랑마케팅 AI 요약본 (llms.txt)" />
        <meta name="geo.region" content="KR-41" />
        <meta name="geo.placename" content="경기도 고양시 일산동구" />
        <meta name="geo.position" content={`${SITE.geo.lat};${SITE.geo.lng}`} />
        <meta name="ICBM" content={`${SITE.geo.lat}, ${SITE.geo.lng}`} />

        {/* Google tag (gtag.js) — GA4 */}
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        {/*
          사이트 전역 엔티티 그래프 (SEO/AEO/GEO)

          여기에는 "모든 페이지에서 참이며 화면 콘텐츠와 무관한" 정보만 둔다.
          FAQPage / BreadcrumbList 는 페이지별 스키마이므로 각 페이지에서 선언한다.
          (FAQPage 를 전역에 두면 FAQ 가 보이지 않는 페이지에도 붙어 구글 정책 위반)
        */}
        <JsonLd
          data={[
            /* ── WebSite: 사이트 엔티티 + 사이트 내 검색 ── */
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": SITE_ID,
              name: SITE.name,
              alternateName: ["하랑 마케팅", "Harang Marketing", "하랑"],
              url: SITE.base,
              description: ANSWER_SENTENCES.whoWeAre,
              inLanguage: "ko-KR",
              publisher: { "@id": ORG_ID },
              copyrightHolder: { "@id": ORG_ID },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE.base}/blog?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            },

            /* ── Organization: AI 검색 엔티티 신뢰도의 뿌리 ── */
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": ORG_ID,
              name: SITE.name,
              alternateName: SITE.nameEn,
              legalName: SITE.legalName,
              url: SITE.base,
              slogan: "소상공인의 매출을 올리는 가장 확실한 방법",
              logo: {
                "@type": "ImageObject",
                url: `${SITE.base}/favicon.svg`,
                width: 400,
                height: 400,
              },
              image: `${SITE.base}/og-image.png`,
              description: ANSWER_SENTENCES.whoWeAre,
              foundingDate: SITE.foundingDate,
              founder: {
                "@type": "Person",
                "@id": `${SITE.base}/about#founder`,
                name: SITE.founder,
                jobTitle: "대표",
                worksFor: { "@id": ORG_ID },
                description:
                  "해병대 장교 출신. 2018년 전역 후 카페 창업과 마케팅 대행사 팀장 경험을 거쳐 2020년 하랑마케팅을 설립했습니다. 마케팅 경력 10년 이상.",
                knowsAbout: [
                  "네이버 플레이스 SEO",
                  "네이버 블로그 마케팅",
                  "체험단 마케팅",
                  "인스타그램 마케팅",
                  "소상공인 마케팅 전략",
                ],
                url: `${SITE.base}/about`,
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE.address.street,
                addressLocality: SITE.address.locality,
                addressRegion: SITE.address.region,
                postalCode: SITE.address.postalCode,
                addressCountry: SITE.address.country,
              },
              telephone: SITE.phoneIntl,
              email: SITE.email,
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                  telephone: SITE.phoneIntl,
                  email: SITE.email,
                  availableLanguage: ["ko"],
                  areaServed: "KR",
                  contactOption: "TollFree",
                  hoursAvailable: {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    opens: "09:00",
                    closes: "18:00",
                  },
                },
              ],
              areaServed: ["대한민국", "서울특별시", "경기도", "인천광역시"],
              knowsAbout: [
                "네이버 플레이스 SEO",
                "네이버 플레이스 상위 노출",
                "블로그 마케팅",
                "블로그 배포",
                "체험단 마케팅",
                "인스타그램 마케팅",
                "소상공인 마케팅",
                "자영업자 마케팅",
                "리뷰 마케팅",
                "카카오맵 마케팅",
                "맘카페 바이럴",
                "홈페이지형 블로그 제작",
                "지역 기반 로컬 마케팅",
              ],
              knowsLanguage: ["ko"],
              sameAs: [SITE.naverBlog, SITE.instagram, SITE.kakao],
              numberOfEmployees: { "@type": "QuantitativeValue", value: 5 },
              subjectOf: {
                "@type": "WebContent",
                name: "하랑마케팅 AI 요약본 (llms.txt)",
                url: `${SITE.base}/llms.txt`,
                encodingFormat: "text/plain",
              },
            },

            /* ── LocalBusiness: 네이버·구글 지도 및 로컬 검색 ── */
            {
              "@context": "https://schema.org",
              "@type": ["LocalBusiness", "ProfessionalService"],
              "@id": LOCAL_ID,
              name: SITE.name,
              image: `${SITE.base}/og-image.png`,
              logo: `${SITE.base}/favicon.svg`,
              url: SITE.base,
              telephone: SITE.phone,
              email: SITE.email,
              parentOrganization: { "@id": ORG_ID },
              description: ANSWER_SENTENCES.whatWeDo,
              currenciesAccepted: "KRW",
              paymentAccepted: "계좌이체, 신용카드",
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE.address.street,
                addressLocality: SITE.address.locality,
                addressRegion: SITE.address.region,
                postalCode: SITE.address.postalCode,
                addressCountry: SITE.address.country,
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: SITE.geo.lat,
                longitude: SITE.geo.lng,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
              /*
                aggregateRating 을 넣지 않는다.
                구글은 업체가 스스로 매긴 평점(self-serving review)을
                LocalBusiness·Organization 에서 리뷰 스니펫으로 인정하지 않고
                구조화 데이터 수동 조치 사유가 될 수 있다.
                출처가 검증되는 실제 리뷰를 페이지에 노출할 때만 다시 추가할 것.
              */
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "하랑마케팅 서비스",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "네이버 플레이스 SEO",
                      description:
                        "네이버 플레이스 상위 노출 최적화. 키워드 설정, 사진 최적화, 리뷰·답글 관리, 저장 수 개선을 통합 관리합니다.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "블로그 마케팅",
                      description:
                        "네이버 블로그 SEO 최적화 및 지역 키워드 상위 노출. 블로그 배포와 홈페이지형 블로그 제작을 포함합니다.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "체험단 모집 대행",
                      description: "업종별 맞춤 체험단 모집 및 실사용 후기 확보 대행. 2~4주 내 효과.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "인스타그램 마케팅",
                      description: "인스타그램 콘텐츠 제작, 릴스 기획, 해시태그 전략, 팔로워 증대.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "카카오맵 마케팅",
                      description: "카카오맵 플레이스 등록 및 상위 노출 최적화. 평균 신규 유입 30% 이상 증가.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "맘카페 바이럴 마케팅",
                      description:
                        "지역 맘카페를 활용한 실사용자 후기형 바이럴. 일반 블로그 대비 전환율 2~3배.",
                    },
                  },
                ],
              },
              areaServed: [
                { "@type": "Country", name: "대한민국" },
                { "@type": "City", name: "서울특별시" },
                { "@type": "AdministrativeArea", name: "경기도" },
                { "@type": "City", name: "인천광역시" },
              ],
              sameAs: [SITE.naverBlog, SITE.instagram, SITE.kakao],
            },

            /* ── SiteNavigationElement: AI 크롤러에 사이트 구조 전달 ── */
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "@id": `${SITE.base}/#sitenav`,
              name: "하랑마케팅 주요 메뉴",
              itemListElement: [
                { name: "회사 소개", path: "/about" },
                { name: "서비스", path: "/services" },
                { name: "진행 사례", path: "/cases" },
                { name: "진행 과정", path: "/process" },
                { name: "자주 묻는 질문", path: "/faq" },
                { name: "마케팅 인사이트", path: "/blog" },
                { name: "무료 상담", path: "/contact" },
              ].map((n, i) => ({
                "@type": "SiteNavigationElement",
                position: i + 1,
                name: n.name,
                url: `${SITE.base}${n.path}`,
              })),
            },
          ]}
        />
        {children}
        {/* 영업용 플로팅 요소 — 고객 전용 보고서(/r/…)에서는 뜨지 않는다 */}
        <SiteChrome />
      </body>
    </html>
  );
}
