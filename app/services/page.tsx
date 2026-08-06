import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import {
  BookOpen, MapPin, Star, AtSign,
  CheckCircle2, ArrowRight, Clock, Package, TrendingUp,
  ChevronDown, Users, BarChart3, MessageSquare, Quote,
  Navigation, Palette, Layers,
} from "lucide-react";
import JsonLd from "../components/JsonLd";
import { REF_TOTAL } from "../lib/cafe-distribution";
import AnswerBlock from "../components/AnswerBlock";
import GlossarySection from "../components/GlossarySection";
import { ORG_ID, ANSWER_SENTENCES, webPageLd, breadcrumbLd, definitionsLd } from "../lib/seo";

export const metadata: Metadata = {
  title: "마케팅 서비스 — 하랑마케팅 | 플레이스 SEO · 블로그 · 체험단 · SNS",
  description: "네이버 플레이스 SEO, 블로그 마케팅, 리뷰·체험단, SNS(인스타그램·맘카페) 등 소상공인 맞춤 마케팅 서비스. 업종별 최적 패키지와 실제 성과를 확인하세요.",
  keywords: [
    "마케팅 서비스", "네이버 플레이스 SEO", "플레이스 상위노출",
    "블로그 마케팅", "블로그 상위노출", "키워드 SEO",
    "체험단 모집", "체험단 대행", "리뷰 마케팅",
    "인스타그램 마케팅", "릴스 마케팅", "SNS 마케팅",
    "맘카페 바이럴", "맘카페 마케팅",
    "카카오맵 마케팅", "카카오맵 상위노출",
    "소상공인 마케팅", "자영업자 마케팅", "소상공인 광고",
    "카페 마케팅", "음식점 마케팅", "미용실 마케팅",
    "학원 마케팅", "병원 마케팅", "피부과 마케팅",
    "네이버 블로그 대행", "플레이스 최적화", "구글 지도 마케팅",
  ],
  alternates: { canonical: "https://www.harangmarketing.com/services" },
  openGraph: {
    title: "하랑마케팅 서비스 — 소상공인 맞춤 마케팅",
    description: "플레이스 SEO부터 블로그·SNS까지. 10년 노하우 기반 업종별 맞춤 마케팅 서비스. 월 30만원부터 시작, 상담 무료.",
    url: "https://www.harangmarketing.com/services",
    images: [{ url: "https://www.harangmarketing.com/og-image.png", width: 1200, height: 630 }],
  },
};

const SERVICES = [
  {
    id: "cafe-distribution",
    icon: Layers,
    color: "from-blue-600 to-indigo-700",
    tag: "배포",
    title: "최적화 블로그 · 카페 배포",
    subtitle: "블로그 탭 + 카페 탭 동시 노출",
    desc: "최적화 블로그 배포에 카페 배포를 함께 진행해, 같은 키워드에서 고객이 들어올 경로를 두 배로 넓힙니다.",
    timeline: "게시 시작 3~7일 · 수량별 순차 진행",
    deliverables: [
      { label: "카페 배포", value: "최대 20건 추가", note: "최블 30건 진행 시" },
      { label: "1건당 단가", value: "28,600원~", note: "부가세 별도" },
      { label: "결과 보고", value: "게시 URL 전체", note: "링크 정리 전달" },
    ],
    features: [
      "업종·지역·목표 키워드 기준 카페 배정",
      "원고 작성 포함 / 미포함 선택 가능",
      "카페별 게시 형식에 맞춘 편집 처리",
      "게시 완료 후 전체 URL 정리 보고",
      "수량 분할 진행 협의 가능",
    ],
    rec: "블로그 노출은 되는데 검색 유입이 더 필요한 매장",
    result: `9개 업종 ${REF_TOTAL}개 키워드 카페 영역 노출 레퍼런스 공개`,
    href: "/services/cafe-distribution",
  },
  {
    id: "blog",
    icon: BookOpen,
    color: "from-blue-500 to-blue-700",
    tag: "SEO",
    title: "블로그 마케팅",
    subtitle: "검색 상단 노출 → 방문 고객 증대",
    desc: "네이버 블로그 상위 노출로 잠재 고객이 직접 찾아오게 만드는 콘텐츠 마케팅입니다.",
    timeline: "첫 노출 2~4주 · 상위권 안착 2~3개월",
    deliverables: [
      { label: "월 콘텐츠", value: "4~8건", note: "키워드 분석 기반" },
      { label: "SEO 최적화", value: "매 포스팅", note: "제목·본문·태그" },
      { label: "성과 리포트", value: "월 1회", note: "순위·조회수 포함" },
    ],
    features: [
      "업종·지역 키워드 분석 및 전략 수립",
      "상위노출 최적화 포스팅 작성",
      "사진·영상 첨부 고품질 콘텐츠",
      "경쟁사 블로그 분석 및 차별화",
      "월간 순위 변화 리포트 제공",
    ],
    rec: "네이버 검색으로 신규 고객을 유입하고 싶은 매장",
    result: "평균 3개월 내 지역 키워드 상위 10위 진입",
  },
  {
    id: "place",
    icon: MapPin,
    color: "from-blue-600 to-blue-800",
    tag: "플레이스",
    title: "네이버 플레이스 SEO",
    subtitle: "지도 상단 노출 → 당일 방문 증가",
    desc: "네이버 지도·플레이스 상위 노출로 '지금 근처 맛집 찾는 고객'을 매장으로 안내합니다.",
    timeline: "효과 체감 3~4주 · 상위권 안착 1~2개월",
    deliverables: [
      { label: "플레이스 최적화", value: "초기 완성", note: "정보·사진·카테고리" },
      { label: "키워드 세팅", value: "20개 이상", note: "지역·업종·특징" },
      { label: "순위 모니터링", value: "주 1회", note: "상위 노출 유지 관리" },
    ],
    features: [
      "플레이스 정보 완성도 100% 최적화",
      "업종·지역·특징 키워드 세팅",
      "경쟁 분석 기반 차별화 전략",
      "사진 구성 및 업로드 가이드",
      "주간 순위 모니터링 및 조정",
    ],
    rec: "근처 검색으로 당장 찾아오는 고객이 필요한 매장",
    result: "평균 4주 내 플레이스 Top 5 진입",
  },
  {
    id: "review",
    icon: Star,
    color: "from-blue-500 to-blue-700",
    tag: "리뷰",
    title: "리뷰 마케팅 · 체험단",
    subtitle: "리뷰 축적 → 신뢰도 · 재방문율 상승",
    desc: "체험단 모집부터 리뷰 관리까지. 진짜 방문 후기로 신규 고객의 결정을 돕습니다.",
    timeline: "체험단 시작 1~2주 · 리뷰 쌓기 1개월",
    deliverables: [
      { label: "체험단 모집", value: "월 10~30명", note: "업종별 맞춤 규모" },
      { label: "리뷰 포스팅", value: "체험단 전원", note: "블로그·플레이스" },
      { label: "리뷰 관리", value: "월 2회 점검", note: "답글 가이드 포함" },
    ],
    features: [
      "업종 맞춤 체험단 모집 및 관리",
      "블로그·플레이스·카카오맵 리뷰 확보",
      "체험단 안내자료·가이드 제작",
      "부정 리뷰 모니터링 및 대응 전략",
      "리뷰 답글 작성 대행",
    ],
    rec: "리뷰가 부족해 신규 고객 유입이 어려운 매장",
    result: "한 달 내 리뷰 30개+ 확보 (패키지 기준)",
  },
  {
    id: "sns",
    icon: AtSign,
    color: "from-blue-600 to-indigo-700",
    tag: "SNS",
    title: "SNS · 인스타그램 마케팅",
    subtitle: "팔로워 증가 → 예약·방문 연결",
    desc: "인스타그램 계정 육성부터 맘카페 입소문 마케팅까지. 온라인 인지도를 높여 실제 방문·예약으로 전환합니다.",
    timeline: "팔로워 증가 1개월 · 바이럴 효과 2~3개월",
    deliverables: [
      { label: "콘텐츠 제작", value: "월 12~16건", note: "피드·스토리·릴스" },
      { label: "맘카페 바이럴", value: "월 4~8건", note: "업종별 맞춤 전략" },
      { label: "인기 게시물 노출", value: "해시태그 최적화", note: "지역·업종 태그" },
    ],
    features: [
      "인스타그램 계정 육성 및 세팅",
      "피드·스토리·릴스 콘텐츠 제작",
      "인기 게시물 상위 노출 전략",
      "맘카페·지역 커뮤니티 자연스러운 입소문",
      "콘텐츠 공유·하이라이트 세팅",
    ],
    rec: "비주얼 중심 업종(카페·미용·음식점)이나 주부 고객 타겟 매장",
    result: "3개월 내 팔로워 500~1,000명 목표",
  },
  {
    id: "kakaomap",
    icon: Navigation,
    color: "from-blue-500 to-blue-700",
    tag: "카카오맵",
    title: "카카오맵 매장 관리",
    subtitle: "카카오 검색 노출 → 지도 상단 진입",
    desc: "국내 최다 사용 지도 앱 카카오맵에서 매장을 발견하는 고객을 잡습니다. 매장 관리 등록부터 트렌드 랭킹 상위 노출까지.",
    timeline: "등록·최적화 1~2주 · 상위 노출 1개월",
    deliverables: [
      { label: "매장 관리 등록", value: "대행 처리", note: "빠른 처리 보장" },
      { label: "카카오맵 리뷰", value: "실유저 기반", note: "100% 실사용자" },
      { label: "트렌드 랭킹", value: "상위 노출", note: "카카오맵 알고리즘 최적화" },
    ],
    features: [
      "카카오맵 매장 관리 등록 대행",
      "매장 정보 완성도 최적화",
      "실유저 기반 리뷰 확보",
      "트렌드 랭킹 상위 노출 전략",
      "카카오 플레이스 통합 관리",
    ],
    rec: "카카오맵으로 유입되는 고객을 놓치고 싶지 않은 매장",
    result: "한 달 내 카카오맵 트렌드 랭킹 Top 10 진입",
  },
  {
    id: "startup",
    icon: Palette,
    color: "from-blue-700 to-indigo-800",
    tag: "창업지원",
    title: "창업 지원 · 브랜딩",
    subtitle: "개업 전 온라인 세팅 → 오픈 첫날부터 효과",
    desc: "개업 준비부터 브랜딩까지. 홈페이지형 블로그 제작, 로고·명함 디자인, 메뉴판 제작을 원스텝으로 해결합니다.",
    timeline: "제작 기간 1~2주 · 오픈 전 완성 가능",
    deliverables: [
      { label: "홈페이지형 블로그", value: "전문 디자인", note: "네이버 블로그 기반" },
      { label: "로고·명함 디자인", value: "맞춤 제작", note: "브랜드 아이덴티티" },
      { label: "메뉴판 제작", value: "인쇄 가능 파일", note: "PDF·인쇄본" },
    ],
    features: [
      "홈페이지형 블로그 디자인 제작",
      "로고·명함·간판 디자인 지원",
      "메뉴판·전단지 제작",
      "플레이스·카카오맵 초기 세팅",
      "개업 전 온라인 인지도 빌드업",
    ],
    rec: "개업 예정이거나 브랜드를 새로 만들고 싶은 사장님",
    result: "개업 첫날부터 온라인에서 발견되는 매장 세팅",
  },
];

const FAQS = [
  {
    q: "계약 기간은 최소 얼마나 되나요?",
    a: "기본 3개월 약정으로 운영됩니다. 마케팅 효과는 단기보다 꾸준한 누적이 핵심이기 때문입니다. 실제로 대부분의 성과는 2~3개월차에 본격적으로 나타납니다.",
  },
  {
    q: "계약하면 바로 시작하나요?",
    a: "계약 당일 온보딩 미팅 후 즉시 착수합니다. 초기 분석(업종·경쟁사·키워드)은 1주일 내 완료하고 2주차부터 콘텐츠가 발행됩니다.",
  },
  {
    q: "결과가 안 나오면 어떻게 되나요?",
    a: "매월 성과 리포트를 함께 검토하며, 목표 미달 시 전략을 즉시 조정합니다. 95% 재계약률이 그 이유입니다. 단, 초기 기대치는 현실적으로 맞춰드립니다.",
  },
  {
    q: "여러 서비스를 함께 하면 할인되나요?",
    a: "네, 2개 이상 묶음 계약 시 할인이 적용됩니다. 풀패키지(4개 서비스)는 개별 합산 대비 최대 30% 절감됩니다. 무료 상담 시 맞춤 견적을 제안해드립니다.",
  },
  {
    q: "지역 제한이 있나요?",
    a: "전국 어디서나 비대면으로 진행합니다. 현장 촬영이 필요한 경우에는 사전에 안내드리고 별도 협의합니다.",
  },
  {
    q: "직접 담당자가 매번 바뀌지 않나요?",
    a: "대표가 모든 프로젝트에 직접 참여합니다. 계약부터 운영까지 담당자가 바뀌지 않는 것이 하랑의 원칙입니다.",
  },
  {
    q: "작은 매장도 효과가 있나요?",
    a: "오히려 소규모 매장일수록 효과가 빠릅니다. 대형 체인보다 지역 키워드 경쟁이 낮기 때문입니다. 월 100만 원 이하 예산으로도 성과를 낸 사례가 많습니다.",
  },
  {
    q: "지금 마케팅이 잘 되고 있는지 모르겠어요.",
    a: "무료 진단 상담을 통해 현재 노출 순위·경쟁사 현황·리뷰 현황을 분석해드립니다. 진단 결과만으로도 개선 방향이 보입니다. 비용은 0원입니다.",
  },
];

const INDUSTRY_LINKS = [
  { name: "카페·베이커리", href: "/services/cafe", color: "from-amber-500 to-orange-500", desc: "플레이스 1위 · 포토리뷰 · 인스타" },
  { name: "병원·의원", href: "/services/clinic", color: "from-blue-500 to-blue-700", desc: "블로그 신뢰 · 체험단 · 예약 증대" },
  { name: "뷰티·네일", href: "/services/beauty", color: "from-pink-500 to-rose-600", desc: "릴스 · 비포애프터 · 예약 마감" },
  { name: "음식점·식당", href: "/services/restaurant", color: "from-orange-500 to-red-500", desc: "배달 매출 · 플레이스 · 리뷰" },
  { name: "학원·교육", href: "/services/academy", color: "from-green-500 to-emerald-600", desc: "맘카페 · 수강생 증대 · 블로그" },
  { name: "쇼핑몰·소매점", href: "/services/shopping", color: "from-purple-500 to-purple-700", desc: "스마트스토어 · 인스타 · 오프라인" },
];

const SERVICES_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "하랑마케팅 마케팅 서비스",
  "description": "소상공인·자영업자 전문 마케팅 대행 서비스 목록",
  "url": "https://www.harangmarketing.com/services",
  "numberOfItems": 7,
  "itemListElement": [
    {
      "@type": "ListItem", "position": 1,
      "item": {
        "@type": "Service",
        "name": "최적화 블로그 · 카페 배포",
        "description": "최적화 블로그 배포와 네이버 카페 배포를 함께 진행해 블로그 탭·카페 탭에 동시 노출. 1건당 28,600원부터(부가세 별도), 게시 URL 전체 보고.",
        "provider": { "@id": ORG_ID },
        "areaServed": "대한민국",
        "offers": { "@type": "Offer", "priceCurrency": "KRW", "price": 483000 },
        "url": "https://www.harangmarketing.com/services/cafe-distribution",
      },
    },
    {
      "@type": "ListItem", "position": 2,
      "item": {
        "@type": "Service",
        "name": "블로그 마케팅",
        "description": "네이버 블로그 상위 노출 최적화. 키워드 SEO, 콘텐츠 제작, 블로그 배포 대행. 평균 3개월 내 지역 키워드 상위 10위 진입.",
        "provider": { "@id": ORG_ID },
        "areaServed": "대한민국",
        "offers": { "@type": "Offer", "priceRange": "월 30만원~", "priceCurrency": "KRW" },
        "url": "https://www.harangmarketing.com/services#blog",
      },
    },
    {
      "@type": "ListItem", "position": 3,
      "item": {
        "@type": "Service",
        "name": "네이버 플레이스 SEO",
        "description": "네이버 지도·플레이스 상위 노출 최적화. 리뷰 관리, 키워드 세팅, 사진 최적화. 평균 4주 내 Top 5 진입.",
        "provider": { "@id": ORG_ID },
        "areaServed": "대한민국",
        "offers": { "@type": "Offer", "priceRange": "월 30만원~", "priceCurrency": "KRW" },
        "url": "https://www.harangmarketing.com/services#place",
      },
    },
    {
      "@type": "ListItem", "position": 4,
      "item": {
        "@type": "Service",
        "name": "체험단 모집 대행",
        "description": "업종별 맞춤 체험단 모집 및 리뷰 마케팅 대행. 네이버 플레이스·블로그·배달앱 리뷰 확보.",
        "provider": { "@id": ORG_ID },
        "areaServed": "대한민국",
        "offers": { "@type": "Offer", "priceRange": "월 30만원~", "priceCurrency": "KRW" },
        "url": "https://www.harangmarketing.com/services#review",
      },
    },
    {
      "@type": "ListItem", "position": 5,
      "item": {
        "@type": "Service",
        "name": "인스타그램·SNS 마케팅",
        "description": "인스타그램 콘텐츠 기획, 릴스 제작, 팔로워 증가, DM 자동화. 카페·미용·네일 업종에 특화.",
        "provider": { "@id": ORG_ID },
        "areaServed": "대한민국",
        "offers": { "@type": "Offer", "priceRange": "월 30만원~", "priceCurrency": "KRW" },
        "url": "https://www.harangmarketing.com/services#sns",
      },
    },
    {
      "@type": "ListItem", "position": 6,
      "item": {
        "@type": "Service",
        "name": "카카오맵 마케팅",
        "description": "카카오맵 플레이스 등록 및 상위 노출 최적화, 트렌드 랭킹 진입 전략. 2개월 만에 Top 3 진입 사례.",
        "provider": { "@id": ORG_ID },
        "areaServed": "대한민국",
        "offers": { "@type": "Offer", "priceRange": "월 30만원~", "priceCurrency": "KRW" },
      },
    },
    {
      "@type": "ListItem", "position": 7,
      "item": {
        "@type": "Service",
        "name": "맘카페 바이럴 마케팅",
        "description": "지역 맘카페 커뮤니티 바이럴 마케팅. 학원·카페·음식점·네일 업종에 특화. 일반 블로그 대비 전환율 2~3배.",
        "provider": { "@id": ORG_ID },
        "areaServed": "대한민국",
        "offers": { "@type": "Offer", "priceRange": "월 30만원~", "priceCurrency": "KRW" },
      },
    },
  ],
};

const SERVICES_PAGE_LD = [
  SERVICES_LD,
  webPageLd({
    path: "/services",
    type: "CollectionPage",
    name: "서비스 — 하랑마케팅",
    description: ANSWER_SENTENCES.whatWeDo,
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
  ]),
  // 아래 GlossarySection 렌더링과 짝을 이룸
  definitionsLd("/services"),
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={SERVICES_PAGE_LD} />
      <Header />
      {/* cafe-dist 스코프 — 카페 배포 상세페이지와 같은 토큰·서체를 쓴다 */}
      <main className="cafe-dist pt-[104px] md:pt-[108px]">
        {/* Hero */}
        <section
          className="relative overflow-hidden py-14 md:py-20"
          style={{ background: "linear-gradient(160deg,#111 0%,#16224a 55%,#0b1226 100%)" }}
        >
          <div className="pointer-events-none absolute right-1/3 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
            <p className="mb-4 text-[13px] font-bold tracking-[2px]" style={{ color: "var(--cd-primary-lt3)" }}>
              SERVICES
            </p>
            <h1
              className="cd-display mb-5 text-[34px] leading-[1.15] text-white md:text-[52px]"
              style={{ letterSpacing: "-2px" }}
            >
              업종별로 다른 전략,
              <br />
              <span style={{ color: "var(--cd-primary-lt3)" }}>결과로 증명합니다</span>
            </h1>
            <p className="mb-8 max-w-xl text-[16px] leading-relaxed md:text-[18px]" style={{ color: "var(--cd-on-dark)" }}>
              핵심 마케팅 채널을 단독 또는 패키지로 운영합니다.
              <br />
              모든 서비스는 대표가 직접 담당합니다.
            </p>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <a key={s.id} href={`#${s.id}`}
                    className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-blue-400/30 bg-white/5 px-3.5 text-xs font-semibold text-blue-100 transition-colors hover:bg-white/10">
                    <Icon size={12} />
                    {s.title}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* AEO — 서비스·가격 한 줄 정답 */}
        <AnswerBlock
          question="하랑마케팅은 어떤 서비스를 얼마에 제공하나요?"
          answer={`${ANSWER_SENTENCES.whatWeDo} ${ANSWER_SENTENCES.price}`}
          facts={[
            { label: "핵심 서비스", value: "6종" },
            { label: "특화 업종", value: "6개" },
            { label: "시작 비용", value: "월 30만원~" },
            { label: "상담·진단", value: "0원" },
          ]}
        />

        {/* Key numbers */}
        <section className="py-6 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, val: "500+", label: "완료 프로젝트", color: "text-blue-600" },
                { icon: TrendingUp, val: "300%", label: "최대 매출 상승", color: "text-blue-600" },
                { icon: Star, val: "95%", label: "재계약률", color: "text-blue-700" },
                { icon: Clock, val: "10년+", label: "전문 경력", color: "text-indigo-600" },
              ].map(({ icon: Icon, val, label, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={18} className={color} strokeWidth={1.5} />
                  <div>
                    <div className={`text-xl font-black ${color}`}>{val}</div>
                    <div className="text-xs text-gray-400">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service cards */}
        <section className="py-10 md:py-14 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 space-y-8">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-20 overflow-hidden rounded-2xl bg-white shadow-sm"
                  style={
                    "href" in s && s.href
                      ? { border: "2px solid var(--cd-primary)", boxShadow: "0 14px 34px rgba(22,85,232,.14)" }
                      : { border: "1px solid var(--cd-border)" }
                  }
                >
                  {/* 커버 — 상세페이지가 있는 상품은 실제 노출 캡처를, 나머지는 브랜드 밴드를 쓴다.
                      캡처는 카페 영역 화면이라 해당 상품에만 붙여야 다른 서비스를 오인시키지 않는다. */}
                  {"href" in s && s.href ? (
                    <div className="relative">
                      <img
                        src="/cafe-ref/ref-r-01.png"
                        alt="네이버 카페 영역 상위노출 실제 화면"
                        width={1000}
                        height={290}
                        loading="lazy"
                        decoding="async"
                        className="block h-44 w-full object-cover object-top"
                      />
                      <span
                        className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-[11px] font-black text-white"
                        style={{ background: "var(--cd-primary)" }}
                      >
                        실제 노출 화면
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`flex h-24 items-center gap-3 bg-gradient-to-br px-6 md:px-8 ${s.color}`}
                    >
                      <Icon size={26} className="text-white/90" strokeWidth={1.5} />
                      <span className="cd-display text-[22px] text-white md:text-[26px]" style={{ letterSpacing: "-1px" }}>
                        {s.title}
                      </span>
                    </div>
                  )}
                  {/* Card header */}
                  <div className="p-6 md:p-8 border-b border-gray-50">
                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm shrink-0`}>
                        <Icon size={22} className="text-white" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${s.color} text-white text-[10px] font-black`}>
                            {s.tag}
                          </span>
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Clock size={10} />
                            {s.timeline}
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-1">{s.title}</h2>
                        <p className="text-sm font-semibold text-blue-600 mb-2">{s.subtitle}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <Package size={12} />받게 되는 것
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {s.deliverables.map((d) => (
                        <div key={d.label} className="bg-white rounded-xl p-4 border border-gray-100">
                          <div className="text-[11px] text-gray-400 mb-1">{d.label}</div>
                          <div className="text-base font-black text-gray-900">{d.value}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{d.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features + rec */}
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6">
                      <div>
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <BarChart3 size={12} />포함 서비스
                        </h3>
                        <ul className="space-y-2">
                          {s.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle2 size={14} className="text-blue-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <div className="text-[11px] font-bold text-blue-600 mb-1 flex items-center gap-1">
                            <Users size={10} />이런 분께 추천
                          </div>
                          <p className="text-xs text-blue-800 leading-relaxed">{s.rec}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <div className="text-[11px] font-bold text-blue-600 mb-1 flex items-center gap-1">
                            <TrendingUp size={10} />기대 성과
                          </div>
                          <p className="text-xs text-blue-800 leading-relaxed font-semibold">{s.result}</p>
                        </div>
                      </div>
                    </div>

                    {/* 별도 상세페이지가 있는 서비스만 노출 */}
                    {"href" in s && s.href && (
                      <Link
                        href={s.href}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-blue-700 sm:w-auto"
                      >
                        상품 상세 · 가격 보기 <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ 업종별 추천 ══ */}
        <section className="py-14 md:py-18 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">업종별 추천</p>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">내 업종엔 어떤 서비스가 맞나요?</h2>
              <p className="text-gray-400 text-sm mt-2">업종별로 성과가 가장 빠른 서비스를 먼저 추천합니다</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { industry: "카페·베이커리", firstRec: "플레이스 SEO", recs: ["체험단·리뷰", "인스타그램"], result: "+167% 방문객 · 3개월", color: "from-blue-500 to-blue-700" },
                { industry: "음식점·배달", firstRec: "리뷰 마케팅", recs: ["맘카페 바이럴", "플레이스 SEO"], result: "+113% 배달 매출 · 4개월", color: "from-blue-600 to-indigo-700" },
                { industry: "미용·뷰티·네일", firstRec: "인스타그램", recs: ["체험단·리뷰", "카카오맵"], result: "예약 2주 완전 마감", color: "from-blue-500 to-blue-700" },
                { industry: "의원·한의원·피부과", firstRec: "블로그 마케팅", recs: ["체험단·리뷰", "플레이스 SEO"], result: "+300% 신규예약 · 6개월", color: "from-blue-600 to-blue-800" },
                { industry: "학원·교육", firstRec: "맘카페 바이럴", recs: ["블로그 마케팅", "홈페이지형 블로그"], result: "+55% 수강생 · 3개월", color: "from-blue-700 to-indigo-800" },
                { industry: "온라인 쇼핑몰", firstRec: "블로그 SEO", recs: ["체험단·리뷰", "블로그 배포"], result: "+64% 매출 · 5개월", color: "from-blue-500 to-indigo-600" },
                { industry: "한의원·한방", firstRec: "블로그 마케팅", recs: ["플레이스 SEO", "리뷰 마케팅"], result: "+200% 초진 예약 · 4개월", color: "from-blue-600 to-indigo-700" },
                { industry: "개업·창업 준비", firstRec: "창업 지원·브랜딩", recs: ["플레이스 세팅", "블로그 마케팅"], result: "오픈 첫날부터 노출", color: "from-blue-700 to-blue-900" },
              ].map((ind) => (
                <div key={ind.industry} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className={`bg-gradient-to-br ${ind.color} px-4 py-3`}>
                    <div className="font-black text-white text-sm">{ind.industry}</div>
                    <div className="text-white/70 text-[10px] mt-0.5">{ind.result}</div>
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">우선 추천</div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-black mb-3">
                      {ind.firstRec}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">추가 옵션</div>
                    <div className="flex gap-1 flex-wrap">
                      {ind.recs.map((r) => (
                        <span key={r} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm">
                내 업종 맞춤 추천 받기 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 고객 후기 ══ */}
        <section className="py-14 md:py-18 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">고객 후기</p>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">실제 사장님들의 이야기</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: "카페 사장님",
                  location: "경기 고양",
                  service: "플레이스 SEO",
                  color: "from-blue-500 to-blue-700",
                  text: "3주 만에 '고양 카페 추천' 1위가 됐어요. 주말 웨이팅이 생겼고 하루 매출이 2배 됐습니다.",
                  metric: "매출 +210%",
                },
                {
                  name: "미용실 원장님",
                  location: "서울 마포",
                  service: "체험단·리뷰",
                  color: "from-blue-600 to-indigo-700",
                  text: "예약이 항상 2주 이상 밀려요. 인스타 포트폴리오도 같이 해주셔서 신규 고객 비율이 확 늘었어요.",
                  metric: "예약 100% 마감",
                },
                {
                  name: "한식당 대표님",
                  location: "인천 부평",
                  service: "블로그 마케팅",
                  color: "from-blue-500 to-blue-700",
                  text: "블로그 글 올리고 2달 후부터 네이버 검색 상단에 뜨기 시작했고 점심 손님이 40% 늘었어요.",
                  metric: "방문객 +140%",
                },
              ].map((t) => (
                <div key={t.name} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <Quote size={16} className="text-blue-200 mb-2" />
                  <p className="text-sm text-gray-700 leading-relaxed flex-1 mb-4">{t.text}</p>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${t.color} text-white text-xs font-black mb-4 w-fit`}>
                    <TrendingUp size={11} />
                    {t.metric}
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-gray-900">{t.name}</div>
                      <div className="text-[11px] text-gray-400">{t.location}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">{t.service}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Package comparison */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">패키지 비교</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">예산에 맞는 플랜 선택</h2>
              <p className="text-gray-400 text-sm">단독 서비스보다 패키지가 효율적입니다 — 2개 이상 묶으면 할인 적용</p>
            </div>

            {/* 이달 혜택 배너 */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-black text-blue-700 uppercase tracking-wider">이달 한정</span>
              </div>
              <p className="text-sm text-blue-800 font-medium">
                이번 달 신규 계약 3팀에게 <span className="font-black">경쟁사 분석 리포트 무료 제공</span> — 내 업종 상위 매장 전략을 한눈에 확인하세요.
              </p>
              <Link href="/contact" className="shrink-0 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors">
                혜택 받기
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-start">
              {[
                {
                  name: "스타터", price: "월 30~50만원대", badge: null,
                  color: "from-blue-500 to-blue-700",
                  desc: "마케팅을 처음 시작하는 매장",
                  roi: "월 30만 투자 → 평균 +60만 매출",
                  includes: ["블로그 포스팅 4건", "플레이스 기본 최적화", "월 리포트 1회"],
                },
                {
                  name: "그로스", price: "월 70~120만원대", badge: "인기",
                  color: "from-blue-600 to-indigo-700",
                  desc: "본격적으로 매출을 올리고 싶은 매장",
                  roi: "월 70만 투자 → 평균 +180만 매출",
                  includes: ["블로그 포스팅 8건", "플레이스 주간 관리", "체험단 월 15명", "인스타 월 8건"],
                },
                {
                  name: "풀패키지", price: "월 150~250만원대", badge: "최고 효율",
                  color: "from-blue-700 to-indigo-800",
                  desc: "전방위 마케팅으로 빠른 성장을 원하는 매장",
                  roi: "월 150만 투자 → 평균 +400만+ 매출",
                  includes: ["전 서비스 풀운영", "체험단 월 30명", "맘카페 바이럴 포함", "전담 전략 미팅"],
                },
              ].map((p) => (
                <div key={p.name} className={`rounded-2xl overflow-hidden border ${p.badge === "인기" ? "border-blue-300 shadow-xl shadow-blue-100/50 scale-[1.02]" : "border-gray-100 shadow-sm"}`}>
                  <div className={`bg-gradient-to-br ${p.color} p-5`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/70 text-[11px] font-black uppercase tracking-wider">{p.badge === "인기" ? "가장 많이 선택" : p.badge ?? "기본"}</span>
                      {p.badge === "인기" && <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black">HOT</span>}
                    </div>
                    <h3 className="font-black text-white text-xl mb-0.5">{p.name}</h3>
                    <div className="text-white/90 font-black text-lg">{p.price}</div>
                  </div>
                  <div className="bg-white p-5">
                    <p className="text-xs text-gray-400 mb-3">{p.desc}</p>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 mb-4">
                      <p className="text-[11px] text-blue-700 font-black">{p.roi}</p>
                      <p className="text-[10px] text-blue-500 mt-0.5">3개월 평균 실측치 기준</p>
                    </div>
                    <ul className="space-y-2 mb-5">
                      {p.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle2 size={11} className="text-blue-500 shrink-0" strokeWidth={2.5} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact" className={`block text-center py-3 rounded-xl text-sm font-black transition-colors ${p.badge === "인기" ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"}`}>
                      이 패키지로 상담하기
                    </Link>
                    <p className="text-[10px] text-gray-400 text-center mt-2">업종·규모에 따라 조정됩니다</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 성과 보장 약속 ══ */}
        <section className="py-14 md:py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">하랑의 약속</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                결과에 책임지는 대행사입니다
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                95% 재계약률은 단순 숫자가 아닙니다. 결과가 없으면 전략을 바꾸고, 실패하면 솔직히 말하는 것이 하랑의 방식입니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: "01",
                  title: "월 1회 성과 리포트",
                  desc: "순위·방문객·예약 수 등 실제 수치를 매월 투명하게 공유합니다. 좋은 숫자만 보여드리지 않습니다.",
                  color: "from-blue-500 to-blue-700",
                },
                {
                  icon: "02",
                  title: "목표 미달 시 전략 즉시 조정",
                  desc: "2개월 이내 가시적 성과가 없으면 추가 비용 없이 전략을 전면 재설계합니다.",
                  color: "from-blue-600 to-indigo-700",
                },
                {
                  icon: "03",
                  title: "계약 강요 없는 상담",
                  desc: "상담 후 진행이 어렵다고 판단되면 직접 말씀드립니다. 계약을 위한 과장된 약속은 드리지 않습니다.",
                  color: "from-blue-500 to-blue-700",
                },
              ].map((item) => (
                <div key={item.icon} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xs font-black mb-4 shadow-sm`}>
                    {item.icon}
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            {/* 신뢰 수치 */}
            <div className="bg-gradient-to-br from-gray-950 to-blue-950 rounded-2xl p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { val: "95%", label: "재계약률", sub: "10년 유지" },
                  { val: "95%", label: "재계약률", sub: "500+ 클라이언트" },
                  { val: "0원", label: "상담 비용", sub: "부담 없이 시작" },
                  { val: "24h", label: "연락 보장", sub: "대표 직접 응대" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl md:text-3xl font-black text-white mb-0.5">{s.val}</div>
                    <div className="text-xs font-bold text-gray-300">{s.label}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SNS section */}
        <section className="py-8 md:py-10 bg-gray-50 border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-black text-gray-800 text-base mb-1">마케팅 사례가 궁금하시면</h3>
                <p className="text-xs text-gray-400">네이버 블로그와 인스타그램에서 실제 운영 사례를 확인하세요</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href="https://blog.naver.com/harangmarketing" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 border border-green-100 text-green-700 text-xs font-bold hover:bg-green-100 transition-colors">
                  <span className="w-5 h-5 rounded bg-green-600 text-white text-[10px] font-black flex items-center justify-center">N</span>
                  네이버 블로그
                </a>
                <a href="https://www.instagram.com/jty0221/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold hover:bg-purple-100 transition-colors">
                  <span className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-pink-500 text-white text-[10px] font-black flex items-center justify-center">I</span>
                  인스타그램
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 성과 타임라인 */}
        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">기대 성과</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">계약 후 언제 효과가 날까요?</h2>
              <p className="text-gray-500 text-sm">업종·경쟁 강도에 따라 다를 수 있으며, 아래는 평균 기준입니다.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { period: "1주차", title: "분석 완료", desc: "업종·키워드·경쟁사 분석 리포트 + 전략 미팅", color: "bg-gray-900", dot: "bg-gray-400" },
                { period: "2~4주", title: "첫 콘텐츠 발행", desc: "블로그·플레이스 초기 콘텐츠 세팅, 노출 시작", color: "bg-blue-600", dot: "bg-blue-400" },
                { period: "1~2개월", title: "순위 상승 체감", desc: "검색 상위권 진입, 방문·예약 증가 확인 가능", color: "bg-indigo-600", dot: "bg-indigo-400" },
                { period: "3개월+", title: "본격 매출 증대", desc: "안정적 상위권 유지, 신규 고객 유입 자동화", color: "bg-blue-800", dot: "bg-blue-600" },
              ].map((step, i) => (
                <div key={i} className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className={`${step.color} px-4 py-3`}>
                    <div className="text-[11px] font-black text-white/70 uppercase tracking-widest mb-0.5">STEP {i + 1}</div>
                    <div className="text-white font-black text-sm">{step.period}</div>
                  </div>
                  <div className="p-4">
                    <div className="font-black text-gray-900 text-sm mb-1.5">{step.title}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 예산별 패키지 */}
        <section className="py-14 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">예산별 패키지</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">예산에 맞는 조합을 골라보세요</h2>
              <p className="text-gray-500 text-sm">정확한 금액은 무료 상담에서 업종·지역·목표 기반으로 안내드립니다.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  tier: "STARTER",
                  price: "30~50만원",
                  period: "/ 월",
                  desc: "소규모 매장 · 처음 시작하는 분",
                  color: "from-blue-500 to-blue-700",
                  highlight: false,
                  services: ["네이버 플레이스 SEO", "블로그 월 4편", "월 성과 리포트"],
                  result: "플레이스 Top 10 진입 목표",
                },
                {
                  tier: "GROWTH",
                  price: "70~120만원",
                  period: "/ 월",
                  desc: "매출 성장이 급한 매장 · 인기",
                  color: "from-blue-600 to-indigo-700",
                  highlight: true,
                  services: ["네이버 플레이스 SEO", "블로그 월 8편", "체험단 or SNS 운영", "리뷰 관리", "월 성과 리포트"],
                  result: "플레이스 Top 3 + 방문객 +100% 목표",
                },
                {
                  tier: "FULL",
                  price: "150~250만원",
                  period: "/ 월",
                  desc: "경쟁 업종 · 빠른 1등 목표",
                  color: "from-blue-700 to-indigo-800",
                  highlight: false,
                  services: ["전 채널 통합 운영", "블로그 월 12편+", "SNS + 체험단", "맘카페 바이럴", "광고 운영 (매체비 별도)", "주간 성과 리포트"],
                  result: "업종 1위 + 매출 극대화 목표",
                },
              ].map((pkg) => (
                <div
                  key={pkg.tier}
                  className={`rounded-2xl overflow-hidden border ${pkg.highlight ? "border-blue-200 shadow-xl shadow-blue-100/50 scale-[1.02]" : "border-gray-100 shadow-sm"} transition-all`}
                >
                  <div className={`bg-gradient-to-br ${pkg.color} px-6 py-6`}>
                    {pkg.highlight && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-black mb-3 uppercase tracking-wider">
                        가장 많이 선택
                      </div>
                    )}
                    <div className="text-[11px] font-black text-white/60 uppercase tracking-widest mb-1">{pkg.tier}</div>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-2xl font-black text-white">{pkg.price}</span>
                      <span className="text-white/60 text-xs mb-1">{pkg.period}</span>
                    </div>
                    <p className="text-white/70 text-xs">{pkg.desc}</p>
                  </div>
                  <div className="bg-white p-6">
                    <ul className="space-y-2 mb-5">
                      {pkg.services.map((s) => (
                        <li key={s} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                            <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          {s}
                        </li>
                      ))}
                    </ul>
                    <div className="text-[11px] text-blue-600 font-bold bg-blue-50 rounded-xl px-3 py-2 border border-blue-100 mb-4">
                      목표: {pkg.result}
                    </div>
                    <Link
                      href="/contact"
                      className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-sm font-black transition-colors ${pkg.highlight ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                    >
                      이 패키지로 상담 신청
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[11px] text-gray-400 mt-6">* 업종·목표·경쟁 강도에 따라 금액이 달라질 수 있습니다. 광고 집행비(네이버·인스타 등)는 별도입니다.</p>
          </div>
        </section>

        {/* 비교표 */}
        <section className="py-14 md:py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">왜 하랑인가</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">일반 대행사와 무엇이 다른가요?</h2>
              <p className="text-gray-500 text-sm">클라이언트가 바꾸고 나서 가장 많이 하는 말을 정리했습니다</p>
            </div>

            <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-w-[480px]">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-gray-100">
                <div className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">비교 항목</div>
                <div className="px-4 py-4 text-center bg-gray-50 border-l border-gray-100">
                  <div className="text-xs font-black text-gray-500 uppercase tracking-wider">일반 대행사</div>
                </div>
                <div className="px-4 py-4 text-center bg-blue-600 border-l border-blue-500">
                  <div className="text-xs font-black text-white uppercase tracking-wider">하랑마케팅</div>
                </div>
              </div>

              {/* Rows */}
              {[
                {
                  label: "담당자",
                  other: "신입·인턴 가능, 자주 교체",
                  harang: "대표 직접 담당 · 500+ 경험",
                  highlight: true,
                },
                {
                  label: "전략",
                  other: "일괄 패키지 적용",
                  harang: "업종별 맞춤 전략 설계",
                  highlight: false,
                },
                {
                  label: "성과 보고",
                  other: "월 1회 수치 리포트",
                  harang: "매출 연동 지표 + 실시간 공유",
                  highlight: true,
                },
                {
                  label: "소통",
                  other: "이메일·티켓 시스템",
                  harang: "카카오 직통 · 10분 내 응답",
                  highlight: false,
                },
                {
                  label: "계약",
                  other: "6개월~1년 장기 의무",
                  harang: "3개월 단위 · 성과 후 연장",
                  highlight: true,
                },
                {
                  label: "재계약률",
                  other: "업계 평균 65%",
                  harang: "95% (10년 유지)",
                  highlight: false,
                },
              ].map((row, i) => (
                <div key={row.label} className={`grid grid-cols-[1fr_1fr_1fr] border-b border-gray-50 last:border-b-0 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                  <div className="px-4 py-4 text-sm font-bold text-gray-700 flex items-center">{row.label}</div>
                  <div className="px-4 py-4 text-sm text-gray-400 border-l border-gray-100 flex items-center bg-gray-50/30">
                    {row.other}
                  </div>
                  <div className={`px-4 py-4 text-sm border-l border-blue-100 flex items-center gap-1.5 ${row.highlight ? "bg-blue-50 font-black text-blue-700" : "font-semibold text-gray-800"}`}>
                    <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {row.harang}
                  </div>
                </div>
              ))}
            </div>

            </div>
            <p className="text-center text-xs text-gray-400 mt-5">실제 대행사 전환 클라이언트 40% 경험 기반</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-14 md:py-20 bg-white scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-start">
              <div className="lg:sticky lg:top-24">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">FAQ</p>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3">자주 묻는 질문</h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">상담 전에 가장 많이 물어보시는 내용을 정리했습니다.</p>
                <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-yellow-400 text-gray-900 text-xs font-bold hover:bg-yellow-300 transition-colors">
                  <MessageSquare size={12} />더 물어보기
                </a>
              </div>
              <div className="space-y-2">
                {FAQS.map((faq, i) => (
                  <details key={i} className="group bg-gray-50 rounded-xl border border-gray-100 overflow-hidden hover:border-blue-100 transition-colors">
                    <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer font-bold text-gray-800 text-[15px] list-none select-none hover:bg-white transition-colors">
                      <span className="flex items-start gap-3">
                        <span className="text-[11px] font-black text-blue-500 bg-blue-50 rounded-lg px-2 py-1 shrink-0 mt-0.5">Q{i + 1}</span>
                        {faq.q}
                      </span>
                      <ChevronDown size={16} className="text-gray-300 group-open:rotate-180 transition-transform shrink-0" />
                    </summary>
                    <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4 ml-[52px]">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
            <div className="text-center mt-6">
              <Link href="/faq" className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:underline">
                비용·계약·효과 등 전체 FAQ 보기 <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 md:py-20 bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-purple-600/8 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 md:px-6 text-center">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">무료 진단</p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
              어떤 서비스가 맞는지<br />모르겠다면?
            </h2>
            <p className="text-gray-300 text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
              업종·예산·목표를 알려주시면 최적의 서비스 조합을<br className="hidden sm:block" />무료로 추천해드립니다. 비용·계약 강요 없습니다.
            </p>

            {/* 미니 신뢰지표 */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { label: "상담 비용", value: "0원" },
                { label: "계약 강요", value: "없음" },
                { label: "응답 시간", value: "24h 이내" },
                { label: "재계약률", value: "95%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 border border-white/12 text-xs">
                  <CheckCircle2 size={11} className="text-blue-400" strokeWidth={2.5} />
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white font-bold">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-sm">
                무료 전략 진단 신청 <ArrowRight size={15} />
              </Link>
              <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-300 transition-colors">
                <MessageSquare size={14} />카카오톡 바로 상담
              </a>
            </div>
          </div>
        </section>
        {/* ══ 견적 계산기 CTA ══ */}
        <section className="py-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8">
              <div className="flex-1">
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">3분 완성 · 무료</p>
                <h3 className="text-lg md:text-xl font-black text-gray-900 mb-1">
                  내 업종·예산에 맞는 패키지가 뭔지 모르겠다면?
                </h3>
                <p className="text-sm text-gray-500">
                  업종·예산·목표를 선택하면 최적 마케팅 조합과 예상 ROI를 즉시 계산해드립니다.
                </p>
              </div>
              <Link href="/estimate"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-colors shadow-sm">
                패키지 견적 계산기 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* 용어 정의 — definitionsLd("/services") 와 짝 */}
        <GlossarySection />

        {/* 업종별 전문 페이지 링크 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">업종별 전문 전략 보기</h2>
              <p className="text-gray-500 text-sm">업종마다 효과적인 채널과 전략이 다릅니다 — 내 업종 전용 페이지를 확인하세요</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {INDUSTRY_LINKS.map(ind => (
                <Link key={ind.name} href={ind.href}
                  className="group flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-md transition-all">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ind.color} flex items-center justify-center shrink-0 shadow-sm`}>
                    <ArrowRight size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-gray-900 text-sm">{ind.name}</div>
                    <div className="text-xs text-gray-400 truncate">{ind.desc}</div>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 shrink-0 ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
