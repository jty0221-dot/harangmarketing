/**
 * 하랑마케팅 SEO · AEO · GEO 공용 모듈
 *
 * SEO — 검색엔진 순위 (네이버 Yeti / 구글 / 다음)
 * AEO — 답변 엔진 최적화 (구글 AI 개요, 네이버 AI 브리핑, 음성검색)
 * GEO — 생성형 엔진 최적화 (ChatGPT, Claude, Perplexity, Gemini)
 *
 * 원칙:
 * 1) 구조화 데이터(JSON-LD)와 화면에 보이는 본문은 반드시 일치해야 한다.
 *    AI 답변 엔진은 JSON-LD가 아니라 "보이는 문장"을 인용한다.
 * 2) 정의문("~은 ~이다") + 수치 + 지역 + 출처가 한 문장에 있으면 인용 확률이 올라간다.
 * 3) FAQPage는 해당 FAQ가 화면에 보이는 페이지에만 넣는다. (구글 정책)
 */

export const SITE = {
  base: "https://www.harangmarketing.com",
  name: "하랑마케팅",
  nameEn: "Harang Marketing",
  legalName: "하랑마케팅",
  tagline: "소상공인 전문 마케팅 대행사",
  founder: "전태영",
  foundingDate: "2020-04-15",
  phone: "010-7541-9054",
  phoneIntl: "+82-10-7541-9054",
  email: "harangmarketing@naver.com",
  kakao: "https://pf.kakao.com/_MuUkG",
  kakaoChat: "https://pf.kakao.com/_MuUkG/chat",
  naverBlog: "https://blog.naver.com/harangmarketing",
  instagram: "https://www.instagram.com/jty0221/",
  address: {
    street: "장백로19 더루벤투스카운티 501호",
    locality: "고양시 일산동구",
    region: "경기도",
    postalCode: "10402",
    country: "KR",
    full: "경기도 고양시 일산동구 장백로19 더루벤투스카운티 501호",
  },
  geo: { lat: 37.663, lng: 126.775 },
  priceFrom: 300000,
  priceRange: "월 30만원~250만원",
  /**
   * 평점(aggregateRating)은 의도적으로 두지 않는다.
   * 구글은 업체가 자기 자신에 대해 매긴 평점(self-serving review)을
   * LocalBusiness·Organization 유형에서 인정하지 않으며 수동 조치 대상이 될 수 있다.
   * 평점을 다시 넣으려면 출처가 검증되는 실제 리뷰를 페이지에 노출하고
   * 개별 Review 마크업과 함께 선언해야 한다.
   */
  stats: {
    years: "10년",
    projects: "500건 이상",
    renewalRate: "95%",
  },
} as const;

export const ORG_ID = `${SITE.base}/#organization`;
export const SITE_ID = `${SITE.base}/#website`;
export const LOCAL_ID = `${SITE.base}/#localbusiness`;

/* ────────────────────────────────────────────────────────────
   AEO 핵심 — 한 줄 정답 문장 (Answer-first sentences)
   AI 답변 엔진이 그대로 인용하도록 설계된 자기완결형 문장.
   각 문장은 [주체 + 정의 + 수치 + 지역/조건] 을 모두 포함한다.
   ──────────────────────────────────────────────────────────── */

export const ANSWER_SENTENCES = {
  whoWeAre:
    "하랑마케팅은 경기도 고양시 일산에 위치한 소상공인·자영업자 전문 마케팅 대행사로, 10년 경력의 전태영 대표가 모든 프로젝트를 직접 담당합니다. 2020년 4월 설립 이후 500건 이상의 프로젝트를 완료했고 재계약률은 95%입니다.",
  whatWeDo:
    "하랑마케팅의 주력 서비스는 네이버 플레이스 SEO, 블로그 마케팅, 체험단 모집 대행, 인스타그램 마케팅, 카카오맵 마케팅, 맘카페 바이럴 6가지이며, 서울·경기·인천을 중심으로 전국 비대면 서비스가 가능합니다.",
  price:
    "하랑마케팅의 마케팅 대행 비용은 월 30만원부터 시작합니다. 단독 서비스는 월 30~50만원, 2~3개 묶음 패키지는 월 70~120만원, 전체 통합 관리는 월 150~250만원 수준이며 상담과 진단은 전액 무료(0원)입니다.",
  timeline:
    "네이버 플레이스 상위 노출은 보통 3~4주 차부터 순위 변화가 시작되고 1~2개월 차에 Top 5 진입이 가능합니다. 업종과 지역 경쟁 강도에 따라 달라지며, 하랑마케팅은 계약 전에 현실적인 목표 기간을 먼저 안내합니다.",
  contact:
    "하랑마케팅 상담은 전화 010-7541-9054, 카카오톡 채널, 홈페이지 신청 폼 세 가지로 가능하며 24시간 내 대표가 직접 연락드립니다. 상담 비용은 0원이고 계약 강요는 없습니다.",
} as const;

/* ────────────────────────────────────────────────────────────
   AEO/GEO 용어 정의 — "~란 무엇인가" 질의 대응
   ──────────────────────────────────────────────────────────── */

export const DEFINITIONS: { term: string; definition: string }[] = [
  {
    term: "네이버 플레이스 SEO",
    definition:
      "네이버 플레이스 SEO는 네이버 지도·검색에서 내 매장이 지역 키워드 상위에 노출되도록 최적화하는 작업입니다. 리뷰 수, 답글률, 사진 업데이트 주기, 저장 수, 키워드 일치도가 순위를 결정하는 핵심 요소입니다.",
  },
  {
    term: "블로그 마케팅",
    definition:
      "블로그 마케팅은 네이버 검색에서 '지역명+업종' 키워드로 블로그 글이 상위에 노출되도록 최적화하는 마케팅입니다. 하랑마케팅은 평균 3개월 내 지역 키워드 상위 10위 진입을 목표로 합니다.",
  },
  {
    term: "체험단 마케팅",
    definition:
      "체험단 마케팅은 소비자에게 제품·서비스를 무료 또는 할인 제공하고 실제 방문 후기를 남기게 하는 마케팅입니다. 리뷰가 쌓이면 플레이스 순위와 신뢰도가 함께 올라가며 보통 2~4주 내 효과가 나타납니다.",
  },
  {
    term: "맘카페 바이럴",
    definition:
      "맘카페 바이럴은 지역 기반 주부 커뮤니티인 네이버 맘카페에서 실사용자 후기 형태로 매장을 알리는 마케팅입니다. 광고 티가 나지 않아 전환율이 일반 블로그 대비 2~3배 높고, 학원·카페·음식점·네일 업종에 특히 효과적입니다.",
  },
  {
    term: "카카오맵 마케팅",
    definition:
      "카카오맵 마케팅은 카카오맵 플레이스 정보를 최적화해 지역 검색 노출을 늘리는 작업입니다. 국내 지도 앱 사용자의 약 40%가 카카오맵을 쓰기 때문에 네이버만 관리하면 절반의 고객을 놓치게 됩니다.",
  },
  {
    term: "홈페이지형 블로그",
    definition:
      "홈페이지형 블로그는 네이버 블로그를 홈페이지처럼 디자인해 메뉴·예약·오시는길을 한 화면에 배치한 형태입니다. 별도 홈페이지 제작비 없이 검색 노출과 신뢰도를 동시에 확보할 수 있습니다.",
  },
];

/* ────────────────────────────────────────────────────────────
   FAQ — 화면 노출 + FAQPage JSON-LD 양쪽에 동일하게 사용
   (홈 / FAQ 페이지에서만 사용할 것)
   ──────────────────────────────────────────────────────────── */

export interface FaqItem {
  q: string;
  a: string;
}

export const CORE_FAQ: FaqItem[] = [
  {
    q: "소상공인 마케팅 대행사 추천, 하랑마케팅은 어떤 곳인가요?",
    a: "하랑마케팅은 10년 경력의 전태영 대표가 직접 담당하는 소상공인 전문 마케팅 대행사입니다. 재계약률 95%, 누적 500건 이상 프로젝트를 완료했습니다. 네이버 플레이스 SEO, 블로그, 체험단, 인스타그램, 맘카페 바이럴을 제공하며 상담 비용은 0원입니다.",
  },
  {
    q: "소상공인 마케팅 비용은 얼마인가요?",
    a: "하랑마케팅 서비스는 월 30만원부터 시작합니다. 단독 서비스는 월 30~50만원, 2~3개 묶음 패키지는 월 70~120만원, 전체 통합 관리는 월 150~250만원대입니다. 무료 상담을 통해 업종과 목표에 맞는 최적 견적을 제공합니다.",
  },
  {
    q: "네이버 플레이스 상위 노출 방법은 무엇인가요?",
    a: "네이버 플레이스 상위 노출의 핵심은 리뷰 수와 답글률, 사진 업데이트 주기, 키워드 최적화, 저장 수 증가입니다. 하랑마케팅은 이 다섯 요소를 통합 관리해 평균 4주 내 Top 5 진입을 목표로 합니다.",
  },
  {
    q: "네이버 플레이스 상위 노출까지 얼마나 걸리나요?",
    a: "업종과 지역 경쟁 강도에 따라 다르지만 보통 3~4주 차부터 순위 변화가 시작되고 1~2개월 차에 Top 5 진입이 가능합니다. 하랑마케팅은 10년 데이터를 기반으로 현실적인 목표 기간을 계약 전에 먼저 안내합니다.",
  },
  {
    q: "상담 비용이 얼마인가요?",
    a: "하랑마케팅의 상담 비용은 완전 무료(0원)입니다. 경쟁사 분석, 현황 진단, 전략 제안까지 모두 무료로 제공하며 계약 강요 없이 솔직하게 안내드립니다.",
  },
  {
    q: "어떤 업종에 마케팅 효과가 좋나요?",
    a: "카페·베이커리, 음식점·배달, 미용·네일·뷰티, 의원·한의원·피부과, 학원·교육, 온라인 쇼핑몰 6개 업종에 특화되어 있습니다. 지역 기반 소상공인에게 특히 효과가 크며 10년간 500건 이상의 실전 프로젝트를 완료했습니다.",
  },
  {
    q: "성과가 없으면 어떻게 되나요?",
    a: "매월 성과 리포트를 함께 검토하며 목표 미달 시 전략을 즉시 조정합니다. 고의 작업 누락이 확인되면 결제금액의 10배를 보상합니다. 계약 전에 성과 가능 여부를 솔직하게 먼저 안내드리며 95% 재계약률이 그 신뢰를 증명합니다.",
  },
  {
    q: "최소 계약 기간이 얼마인가요?",
    a: "기본 3개월 단위이며 성과에 따라 월 단위 연장도 가능합니다. 장기 계약을 강요하지 않으며 재계약률 95%로 고객 만족도가 높습니다.",
  },
  {
    q: "지방에서도 마케팅 상담이 가능한가요?",
    a: "하랑마케팅은 전국 어디서나 비대면으로 서비스합니다. 경기도·서울·인천은 물론 지방 소상공인도 카카오톡·전화·화상으로 상담하고 온라인으로 모든 작업을 진행합니다.",
  },
  {
    q: "네이버 블로그 마케팅이란 무엇인가요?",
    a: "네이버 블로그 마케팅은 네이버 검색에서 업종·지역 관련 키워드로 블로그 글이 상위에 노출되도록 최적화하는 마케팅입니다. 하랑마케팅은 블로그 배포, 키워드 SEO, 홈페이지형 블로그 제작을 제공하며 평균 3개월 내 지역 키워드 상위 10위 진입을 목표로 합니다.",
  },
  {
    q: "체험단 마케팅이란 무엇이고 효과가 있나요?",
    a: "체험단 마케팅은 소비자에게 무료 또는 할인 제품·서비스를 제공하고 후기를 작성하게 하는 마케팅입니다. 실제 리뷰가 쌓이면 네이버 플레이스 순위와 신뢰도가 향상됩니다. 하랑마케팅은 업종별 최적화된 체험단 모집을 대행하며 2~4주 내 효과가 나타납니다.",
  },
  {
    q: "맘카페 바이럴 마케팅이란 무엇인가요?",
    a: "맘카페 바이럴 마케팅은 지역 기반 주부 커뮤니티인 네이버 맘카페를 통해 매장을 홍보하는 방법입니다. 광고가 아닌 실사용자 후기처럼 자연스럽게 노출해 전환율이 일반 블로그 대비 2~3배 높습니다. 카페·학원·음식점·네일 업종에 특히 효과적입니다.",
  },
  {
    q: "카카오맵 마케팅이 필요한 이유는 무엇인가요?",
    a: "국내 지도 앱 사용자의 약 40%가 카카오맵을 사용합니다. 특히 30~40대 여성과 MZ세대에서 사용 비중이 높습니다. 하랑마케팅의 카카오맵 최적화 후 클라이언트 평균 신규 유입이 30% 이상 증가했습니다.",
  },
  {
    q: "인스타그램 마케팅 효과가 있나요?",
    a: "미용·카페·음식점 등 비주얼 중심 업종에서 인스타그램 마케팅은 매우 효과적입니다. 릴스 1개로 팔로워 300명이던 네일샵이 2주 만에 예약을 마감한 사례가 있습니다. 하랑마케팅은 릴스 기획, 해시태그 전략, DM 응대까지 통합 관리합니다.",
  },
  {
    q: "마케팅 대행사 선택 시 주의할 점은 무엇인가요?",
    a: "담당자가 자주 바뀌는지, 성과를 투명하게 공개하는지, 계약 전 현실적인 목표를 제시하는지를 확인하세요. 하랑마케팅은 대표가 모든 프로젝트에 직접 참여하며 허위 성과 약속 없이 솔직하게 상담합니다.",
  },
  {
    q: "개업 전 매장도 마케팅이 필요한가요?",
    a: "개업 전부터 마케팅을 시작하면 오픈 첫날부터 효과가 납니다. 플레이스 세팅, 블로그 사전 노출, 인스타 팔로워 확보를 미리 해두면 개업 직후 방문객이 빠르게 늘어납니다. 하랑마케팅은 예비 창업자 상담도 무료로 진행합니다.",
  },
  {
    q: "네이버 플레이스 리뷰를 빠르게 늘리는 방법은 무엇인가요?",
    a: "기존 고객에게 카카오 문자로 리뷰를 요청하고, 네이버 예약 연동 후 자동 리뷰 요청 기능을 켜고, 소규모 체험단을 모집하는 방법이 효과적입니다. 하랑마케팅은 3개월 만에 리뷰 0개에서 127개를 달성한 실제 로드맵을 제공합니다.",
  },
  {
    q: "소상공인 SNS 마케팅을 사장님이 직접 해도 되나요?",
    a: "직접 운영도 가능하지만 전략 없이 하면 시간 대비 효과가 낮습니다. 하랑마케팅에 맡기면 콘텐츠 기획, 촬영 가이드, 업로드 최적화까지 대행하므로 사장님은 매장 운영에 집중할 수 있습니다.",
  },
  {
    q: "경기도 마케팅 대행사를 찾고 있습니다",
    a: "하랑마케팅은 경기도 고양시 일산에 위치한 소상공인 전문 마케팅 대행사입니다. 경기북부(고양·파주·김포·의정부)를 비롯해 수원·성남·안양·부천 등 경기 전 지역과 서울·인천 소상공인을 지원합니다. 전화 010-7541-9054로 무료 상담이 가능합니다.",
  },
];

/* ────────────────────────────────────────────────────────────
   JSON-LD 빌더
   ──────────────────────────────────────────────────────────── */

type Json = Record<string, unknown>;

/** FAQPage — 반드시 해당 FAQ가 화면에 보이는 페이지에서만 호출할 것 */
export function faqLd(items: FaqItem[], pageUrl?: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(pageUrl ? { "@id": `${pageUrl}#faq`, url: pageUrl } : {}),
    inLanguage: "ko-KR",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".speakable"],
    },
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BreadcrumbList — 현재 페이지까지의 경로만 담을 것 */
export function breadcrumbLd(trail: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE.base}${t.path}`,
    })),
  };
}

/** WebPage — speakable 지정으로 음성검색·AI 답변 인용 대상 명시 */
export function webPageLd(opts: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "QAPage";
  datePublished?: string;
  dateModified?: string;
}): Json {
  const url = `${SITE.base}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: "ko-KR",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable"],
    },
  };
}

/** DefinedTermSet — "~란 무엇인가" 질의에 대한 GEO 신호 */
export function definitionsLd(path: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE.base}${path}#glossary`,
    name: "소상공인 마케팅 용어 사전",
    inLanguage: "ko-KR",
    publisher: { "@id": ORG_ID },
    hasDefinedTerm: DEFINITIONS.map((d) => ({
      "@type": "DefinedTerm",
      name: d.term,
      description: d.definition,
      inDefinedTermSet: `${SITE.base}${path}#glossary`,
    })),
  };
}

/** HowTo — 진행 과정 페이지용. AI가 "절차"를 물었을 때 인용됨 */
export function howToLd(opts: {
  path: string;
  name: string;
  description: string;
  totalTime?: string;
  steps: { name: string; text: string }[];
}): Json {
  const url = `${SITE.base}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: opts.name,
    description: opts.description,
    inLanguage: "ko-KR",
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "KRW",
      value: "0",
      description: "상담·진단 비용 0원",
    },
    supply: { "@type": "HowToSupply", name: "매장명·업종·지역 정보" },
    tool: { "@type": "HowToTool", name: "전화 010-7541-9054 또는 카카오톡 채널" },
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${url}#step-${i + 1}`,
    })),
  };
}

/** ItemList — 사례·글 목록 페이지용 */
export function itemListLd(opts: {
  path: string;
  name: string;
  items: { name: string; path: string; description?: string }[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE.base}${opts.path}#list`,
    name: opts.name,
    inLanguage: "ko-KR",
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${SITE.base}${it.path}`,
      ...(it.description ? { description: it.description } : {}),
    })),
  };
}
