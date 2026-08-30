import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import {
  BookOpen, MapPin, Star, AtSign,
  CheckCircle2, ArrowRight, Clock, Package, TrendingUp,
  ChevronDown, Users, BarChart3, MessageSquare,
  Navigation, Palette, Layers, Calculator, ListChecks, LayoutTemplate,
} from "lucide-react";
import JsonLd from "../components/JsonLd";
import { REF_TOTAL, REF_CATEGORIES } from "../lib/cafe-distribution";
import { REF_TOTAL as DP_TOTAL, REF_CUTS as DP_CUTS, REF_CATEGORIES as DP_CATEGORIES } from "../lib/detail-page-reference";
import AnswerBlock from "../components/AnswerBlock";
import GlossarySection from "../components/GlossarySection";
import { SITE, ORG_ID, ANSWER_SENTENCES, webPageLd, breadcrumbLd, definitionsLd } from "../lib/seo";

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
    description: "플레이스 SEO부터 블로그·SNS까지. 10년 노하우 기반 업종별 맞춤 마케팅 서비스. 견적은 진단 후 산정, 상담 무료.",
    url: "https://www.harangmarketing.com/services",
    images: [{ url: "https://www.harangmarketing.com/og-image.png", width: 1200, height: 630 }],
  },
};

/**
 * 상세페이지 카드 커버 — 한 장이 아니라 여러 장을 세워 넣는다.
 *
 * 상세페이지는 세로로 긴 물건(560x747)인데 카드 커버는 가로로 넓다(960x176).
 * 한 장을 폭에 맞추면 높이가 1229px 로 늘어나 위쪽 14% 만 남고,
 * 상세페이지의 위쪽 14% 는 배경 여백이라 화면에는 빈 띠만 보인다.
 * 칸을 좁게 나누면 같은 높이에서 잘리는 비율이 준다 — 5칸이면 한 장당 90% 가 보인다.
 *
 * 고르는 기준은 종류마다 첫 건이다. 앞에서부터 자르면 생활·리빙만 나와서
 * 생활용품만 하는 곳으로 읽힌다.
 */
const DP_COVERS = DP_CATEGORIES.slice(0, 5).map((c) => ({
  src: `/detail-ref/${c.works[0].slug}.jpg`,
  alt: `${c.works[0].title} 상세페이지 실제 납품 화면`,
}));

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
    result: `${REF_CATEGORIES.length}개 업종 ${REF_TOTAL}개 키워드 카페 영역 노출 레퍼런스 공개`,
    href: "/services/cafe-distribution",
    cover: "/cafe-ref/ref-r-01.png",
    coverAlt: "네이버 카페 영역 상위노출 실제 화면",
    coverBadge: "실제 노출 화면",
  },
  {
    // 팔고 있는데 이 목록에 없어서 /services 에서 상세페이지로 가는 길이 없었다.
    // 단가·일정은 /services/detail-page 의 PLANS 가 정본이고 여기는 요약만 적는다 (C-22).
    id: "detail-page",
    icon: LayoutTemplate,
    color: "from-blue-600 to-blue-800",
    tag: "상세페이지",
    title: "스마트스토어 상세페이지 제작",
    subtitle: "기획 · 카피 · 이미지까지 9단 구성",
    desc: "상품은 좋은데 안 팔리는 이유는 대부분 순서입니다. 어디서 멈추게 하고 어디서 불안을 지우고 어디서 결제로 넘길지를 먼저 짜고, 그 순서대로 이미지를 만듭니다.",
    timeline: "기획형 3영업일 · 제작형 7영업일",
    deliverables: [
      { label: "기획형", value: "150,000원", note: "구성표·카피·프롬프트" },
      { label: "제작형", value: "350,000원", note: "상세 이미지까지 · 가장 많이 하십니다" },
      { label: "제작+영상형", value: "550,000원", note: "첫 화면 GIF·숏폼 포함" },
    ],
    features: [
      "9단 섹션 구성표 — 무엇을 몇 번째에 보여줄지 먼저 정합니다",
      "섹션별 카피 작성 (확정 안 된 값은 비워 두고 여쭙습니다)",
      "9단 상세 이미지 제작 · 모바일 가독성 판 별도 조정",
      "슬라이스 파일 납품 — 받아서 바로 올리시면 됩니다",
      "문구 수정 2회 · 이미지 재생성 컷당 3회 포함",
      "식품은 표시사항(원재료·용량·소비기한·보관·제조원) 확인 후 등록",
    ],
    rec: "상품은 올렸는데 들어와서 그냥 나가는 스토어",
    result: `실물 상세페이지 ${DP_TOTAL}건 · 원본 ${DP_CUTS}컷 전체 공개 (잘라낸 구간 없음)`,
    href: "/services/detail-page",
    covers: DP_COVERS,
    coverBadge: "실제 납품 화면",
  },
  {
    // 대행 서비스가 아니라 자사 프로그램. 상세는 /studio 에 따로 있다.
    id: "studio",
    icon: Palette,
    color: "from-slate-700 to-slate-900",
    tag: "프로그램",
    title: "하랑 스튜디오 — 사진·영상 정리 프로그램",
    subtitle: "동영상 GIF 변환 · 사진 세탁 · 워터마크",
    desc: "대행 일을 하면서 매일 겪는 문제라 직접 만들어 쓰는 윈도우 프로그램입니다. 현장 사진 100장을 1분 안에 정리하고, 영상은 끌어다 놓으면 움짤이 됩니다. 파일을 외부에 올리지 않고 내 컴퓨터 안에서 처리합니다.",
    timeline: "설치 없음 · 받는 즉시 사용",
    deliverables: [
      { label: "무료 체험", value: "100장", note: "기능 제한 없음" },
      { label: "한 달", value: "4,900원", note: "1년 39,000원" },
      { label: "대행사 PC 3대", value: "89,000원", note: "1년 기준" },
    ],
    features: [
      "동영상 GIF 변환 · 목표 용량 자동 맞춤",
      "사진 100장 일괄 보정 (장마다 다른 값)",
      "영상에서 사진 뽑기 · 장면 전환 감지",
      "시공 전후 사진 한 장으로 붙이기",
      "매장명·연락처 워터마크",
      "영상 용량 줄이기 (카톡·블로그 규격)",
    ],
    rec: "현장 사진이 매일 쌓이는 대행사·청소·인테리어·설비",
    result: "사진 100장 정리 2시간 → 1분 (사무실 노트북 실측)",
    href: "/studio",
    cover: "/studio/shot-files.png",
    coverAlt: "하랑 스튜디오 사진 선택 화면",
    coverBadge: "프로그램 화면",
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
      { label: "매장 관리 등록", value: "대행 처리", note: "등록·최적화 1~2주" },
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
    a: "월 단위 계약이 기본이라 1개월부터 시작하실 수 있고 중도 해지 위약금이 없습니다. 다만 마케팅 효과는 단기보다 꾸준한 누적이 핵심이라, 대부분의 성과는 2~3개월차에 본격적으로 나타납니다. 3개월 이상 필요한 업종이면 진단 단계에서 먼저 말씀드립니다.",
  },
  {
    q: "계약하면 바로 시작하나요?",
    a: "계약 당일 온보딩 미팅 후 즉시 착수합니다. 초기 분석(업종·경쟁사·키워드)은 1주일 내 완료하고 2주차부터 콘텐츠가 발행됩니다.",
  },
  {
    q: "결과가 안 나오면 어떻게 되나요?",
    a: `매월 성과 리포트를 함께 검토하며, 목표 미달 시 전략을 즉시 조정합니다. ${SITE.stats.renewalRate} 재계약률이 그 이유입니다. 단, 초기 기대치는 현실적으로 맞춰드립니다.`,
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
    a: "대표가 모든 프로젝트에 직접 참여합니다. 상담한 사람이 계약부터 운영까지 그대로 맡습니다.",
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
  { name: "카페·베이커리", href: "/services/cafe", color: "from-blue-600 to-orange-500", desc: "플레이스 1위 · 포토리뷰 · 인스타" },
  { name: "병원·의원", href: "/services/clinic", color: "from-blue-500 to-blue-700", desc: "블로그 신뢰 · 체험단 · 예약 증대" },
  { name: "뷰티·네일", href: "/services/beauty", color: "from-pink-500 to-rose-600", desc: "릴스 · 비포애프터 · 예약 마감" },
  { name: "음식점·식당", href: "/services/restaurant", color: "from-orange-500 to-red-500", desc: "배달 매출 · 플레이스 · 리뷰" },
  { name: "학원·교육", href: "/services/academy", color: "from-green-500 to-emerald-600", desc: "맘카페 · 수강생 증대 · 블로그" },
  { name: "쇼핑몰·소매점", href: "/services/shopping", color: "from-purple-500 to-purple-700", desc: "스마트스토어 · 인스타 · 오프라인" },
];

/* ────────────────────────────────────────────────────────────
   가격 산출 근거 — 아래 숫자는 전부 실제로 나간 견적서에서 가져온다.
   단가를 바꾸면 CALC_EXAMPLES 의 합계도 같이 맞춘다. 월 금액 구간은 만들지 않는다 — HOW_WE_COMPOSE 참조.
   원본: E:/하랑/{미미샵|영삼이네우정소갈비|이지클린}/build_quote_hwp.py
   ──────────────────────────────────────────────────────────── */

const UNIT_PRICES: { item: string; unit: string; price: string; note?: string }[] = [
  { item: "플레이스 SEO 최적화", unit: "1회 세팅", price: "10~15만원" },
  { item: "대표키워드 상위노출 관리", unit: "키워드 1개 · 월", price: "3만원" },
  { item: "블로그 관리대행", unit: "1편", price: "4만원", note: "기준 단가입니다. 물량이 많거나 원고가 단순한 업종은 내려가고, 병의원처럼 의료광고 심의·전문 용어 확인이 붙는 업종은 올라갑니다." },
  { item: "최적화 블로그 배포", unit: "1건", price: "3만원" },
  { item: "카페 배포", unit: "1건", price: "3만원" },
  { item: "파워컨텐츠 원고 설계·검수 대응", unit: "1편", price: "5만원" },
  { item: "홈페이지형 블로그 디자인 STANDARD", unit: "1회", price: "20만원" },
  { item: "네이버 광고 세팅·운영대행", unit: "월", price: "15만원" },
  { item: "키워드 설계 · 리뷰 동선 · 순위 모니터링", unit: "월", price: "계약 시 포함" },
];

const CALC_EXAMPLES: {
  title: string;
  sub: string;
  lines: { label: string; calc: string; amount: string }[];
  total: string;
  note: string;
}[] = [
  {
    title: "플레이스만 잡으면 되는 경우",
    sub: "대표키워드가 이미 3위라 순위를 밀어올리기만 하면 됐던 고깃집",
    lines: [
      { label: "플레이스 SEO 최적화", calc: "15만원 × 1회", amount: "150,000" },
      { label: "대표키워드 상위노출 관리", calc: "3만원 × 5개", amount: "150,000" },
      { label: "리뷰 동선 · 소식/쿠폰 · 순위 모니터링", calc: "계약 포함", amount: "0" },
    ],
    total: "300,000",
    note: "부가세 포함 330,000원",
  },
  {
    title: "글을 퍼뜨리기만 하면 되는 경우",
    sub: "플레이스를 쓸 수 없어 검색 유입만 만들면 됐던 해외 매장",
    lines: [
      { label: "최적화 블로그 배포", calc: "3만원 × 3건", amount: "90,000" },
      { label: "카페 배포", calc: "3만원 × 7건", amount: "210,000" },
      { label: "키워드 설계 · 촬영 가이드", calc: "계약 포함", amount: "0" },
    ],
    total: "300,000",
    note: "부가세 포함 330,000원",
  },
  {
    title: "바닥부터 만들어야 하는 경우",
    sub: "리뷰 0건 · 가격표 13개 중 10개가 공란이던 청소업체",
    lines: [
      { label: "플레이스 SEO 최적화", calc: "10만원 × 1회", amount: "100,000" },
      { label: "홈페이지형 블로그 디자인", calc: "20만원 × 1회", amount: "200,000" },
      { label: "블로그 관리대행", calc: "기준 4만원 × 10편", amount: "400,000" },
      { label: "파워컨텐츠 원고 설계·검수", calc: "5만원 × 1편", amount: "50,000" },
      { label: "네이버 광고 세팅·운영대행", calc: "계약 포함", amount: "0" },
    ],
    total: "750,000",
    note: "1회성 세팅비가 빠지는 2개월차부터 월 450,000원 (부가세 포함 495,000원)",
  },
];

/**
 * 월 금액을 구간으로 묶어 걸어두지 않는다 (대표 지시 2026-08-23).
 * 업체마다 출발점과 물량이 달라 '월 얼마' 를 먼저 정해두면 매장을 그 금액에 맞추게 된다.
 * 대신 금액이 나오기까지의 순서를 공개한다 — 항목이 정해지면 금액은 계산의 결과다.
 */
const HOW_WE_COMPOSE: { step: string; title: string; body: string }[] = [
  {
    step: "현황 진단",
    title: "지금 비어 있는 칸부터 찾습니다",
    body: "리뷰 수 · 가격표 · 사진 · 현재 순위 · 경쟁 매장을 먼저 확인합니다. 이미 갖춰져 있는 항목에는 비용을 붙이지 않습니다.",
  },
  {
    step: "항목 선별",
    title: "꼭 필요한 것만 남깁니다",
    body: "채널을 전부 돌리는 게 정답이 아닙니다. 그 업종의 손님이 실제로 지나는 검색 경로에 있는 항목만 남기고 나머지는 물립니다.",
  },
  {
    step: "물량 조정",
    title: "양은 상권 경쟁도에 맞춥니다",
    body: "같은 블로그여도 경쟁이 촘촘한 상권은 편수가 올라가고 여유 있는 상권은 내려갑니다. 예산이 정해져 있으면 항목보다 물량을 먼저 조정합니다.",
  },
  {
    step: "견적 산출",
    title: "고른 항목만 더합니다",
    body: "정해둔 패키지 금액에 매장을 끼워 맞추지 않습니다. 항목과 물량이 정해지면 금액은 그 계산의 결과로 나옵니다.",
  },
];

const INDUSTRY_PRICE_DIFF: { industry: string; behavior: string; channel: string; volume: string }[] = [
  { industry: "음식점 · 뷔페", behavior: "지금 근처에서 먹을 곳을 찾는다", channel: "플레이스 SEO · 블로그/카페 배포", volume: "경쟁 상권은 배포 월 30건까지" },
  { industry: "카페 · 베이커리", behavior: "사진을 보고 갈 곳을 정한다", channel: "플레이스 · 인스타 · 광고", volume: "인스타 발행 월 8~20건" },
  { industry: "청소 · 시공", behavior: "문제가 생겼을 때 검색한다", channel: "블로그 · 파워링크", volume: "블로그 월 10~15편" },
  { industry: "뷰티 · 가발", behavior: "오래 비교하고 후기부터 본다", channel: "블로그 · 인스타 릴스", volume: "블로그 10편 + 릴스/피드 주 2회" },
  { industry: "레저 · 숙박", behavior: "주말과 시즌에 몰린다", channel: "파워링크 · 플레이스", volume: "성수기에 광고 예산 집중" },
];

const WHY_PRICE_DIFFERS: { title: string; body: string }[] = [
  {
    title: "출발점이 다릅니다",
    body: "리뷰가 0건이고 가격표가 비어 있으면 세팅부터 해야 합니다. 실제로 첫 달 75만원이던 견적이 세팅이 끝난 2개월차에 45만원으로 내려갔습니다. 이미 갖춰진 매장은 이 비용이 아예 붙지 않습니다.",
  },
  {
    title: "지금 순위가 다릅니다",
    body: "이미 3위인 매장을 1~2위로 밀어올리는 일과, 노출이 아예 없는 매장을 처음 올리는 일은 들어가는 물량이 다릅니다. 앞의 경우는 플레이스 항목만 붙이고 끝났고, 뒤의 경우는 콘텐츠 물량이 함께 들어갑니다.",
  },
  {
    title: "상권 경쟁 밀도가 다릅니다",
    body: "같은 고깃집이어도 대형 매장이 몰려 있는 수도권 상권과 지방 동네 상권은 필요한 배포 건수가 다릅니다. 경쟁이 촘촘할수록 같은 순위를 유지하는 데 드는 콘텐츠 양이 늘어납니다.",
  },
  {
    title: "채널 수와 물량이 다릅니다",
    body: "단가가 채널별 · 건별로 붙습니다. 블로그를 기준 단가 4만원으로 잡아도 월 4편과 월 15편은 44만원 차이가 납니다. 게다가 그 단가 자체가 업종을 탑니다 — 원고가 단순하면 내려가고 병의원처럼 심의가 걸리면 올라갑니다. 플레이스만 하는 것과 블로그 · 카페 · 파워컨텐츠 · 광고를 같이 도는 것은 항목 수부터 다릅니다.",
  },
  {
    title: "심의와 계절이 다릅니다",
    body: "의료 · 법률처럼 심의를 통과해야 하는 업종은 원고 설계와 검수 대응에 공수가 더 붙습니다. 에어컨 청소처럼 3~6월에 검색이 몰리는 업종은 비수기에 기반을 깔아둬야 성수기에 노출을 받습니다.",
  },
];

const SERVICES_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "하랑마케팅 마케팅 서비스와 프로그램",
  "description": "소상공인·자영업자 전문 마케팅 대행 서비스와 자체 제작 사진·영상 정리 프로그램 목록",
  "url": "https://www.harangmarketing.com/services",
  "numberOfItems": 8,
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
      },
    },
    {
      // 대행 서비스가 아니라 자사 소프트웨어라 Service 가 아닌 SoftwareApplication 으로 넣는다.
      // 상세 마크업은 /studio 페이지에 있고 여기서는 목록 항목으로만 선언한다.
      "@type": "ListItem", "position": 8,
      "item": {
        "@type": "SoftwareApplication",
        "name": "하랑 스튜디오",
        "description": "현장 사진 100장을 1분 안에 정리하고 영상을 GIF로 바꾸는 윈도우 프로그램. 파일을 외부에 올리지 않고 내 컴퓨터에서 처리합니다. 무료 100장 체험 후 한 달 4,900원.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Windows 10, Windows 11",
        "author": { "@id": ORG_ID },
        "offers": { "@type": "Offer", "price": 4900, "priceCurrency": "KRW" },
        "url": "https://www.harangmarketing.com/studio",
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
              모든 서비스는 대표가 직접 관리합니다.
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
            { label: "견적 방식", value: "항목 조합형" },
            { label: "기준 단가", value: "블로그 4만원/편 기준 · 업종별 조정" },
            { label: "구성", value: "업체별 맞춤" },
            { label: "상담·진단", value: "0원" },
          ]}
        />

        {/* Key numbers */}
        <section className="py-6 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, val: "500+", label: "완료 프로젝트", color: "text-blue-600" },
                { icon: TrendingUp, val: "3배", label: "최대 매출 상승", color: "text-blue-600" },
                { icon: Star, val: SITE.stats.renewalRate, label: "재계약률", color: "text-blue-700" },
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
                  {/* 커버 — 상품마다 자기 화면을 쓴다. 캡처를 공용으로 돌려 쓰면
                      다른 서비스의 화면이 붙어 고객을 오인시킨다. 없으면 브랜드 밴드.
                      세로로 긴 화면(상세페이지)은 한 장을 눕히면 여백만 남아서 여러 칸으로 세워 넣는다. */}
                  {"covers" in s && s.covers ? (
                    <div className="relative h-48 md:h-60 bg-gray-100 p-3">
                      {/* 칸 수와 보여줄 장수를 같이 움직인다. 칸만 줄이면 나머지가 아랫줄로
                          흘러 한 장이 납작해진다 — 좁은 화면에서는 아예 장수를 줄인다. */}
                      <div className="grid h-full grid-cols-2 grid-rows-1 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {s.covers.map((c, i) => (
                          <img
                            key={c.src}
                            src={c.src}
                            alt={c.alt}
                            width={560}
                            height={747}
                            loading="lazy"
                            decoding="async"
                            className={`h-full w-full rounded-lg border border-gray-200 bg-white object-cover object-top ${
                              i === 2 ? "hidden sm:block" : i === 3 ? "hidden md:block" : i >= 4 ? "hidden lg:block" : "block"
                            }`}
                          />
                        ))}
                      </div>
                      <span
                        className="absolute left-5 top-5 rounded-full px-3 py-1.5 text-[11px] font-black text-white"
                        style={{ background: "var(--cd-primary)" }}
                      >
                        {s.coverBadge}
                      </span>
                    </div>
                  ) : "cover" in s && s.cover ? (
                    <div className="relative">
                      <img
                        src={s.cover}
                        alt={s.coverAlt}
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
                        {s.coverBadge}
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
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0" style={{ background: "var(--w-primary)" }}>
                        <Icon size={22} className="text-white" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${s.color} text-white text-[11px] font-black`}>
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
                { industry: "카페·베이커리", firstRec: "플레이스 SEO", recs: ["체험단·리뷰", "인스타그램"], result: "19위 → 1위 · 20일 계측", color: "from-blue-500 to-blue-700" },
                { industry: "음식점·배달", firstRec: "리뷰 마케팅", recs: ["맘카페 바이럴", "플레이스 SEO"], result: "72위 → 2위 · 32일 계측", color: "from-blue-600 to-indigo-700" },
                { industry: "미용·뷰티·네일", firstRec: "인스타그램", recs: ["체험단·리뷰", "카카오맵"], result: "인스타그램 중심 설계", color: "from-blue-500 to-blue-700" },
                { industry: "의원·한의원·피부과", firstRec: "블로그 마케팅", recs: ["체험단·리뷰", "플레이스 SEO"], result: "5위 → 1위 · 32일 계측", color: "from-blue-600 to-blue-800" },
                { industry: "학원·교육", firstRec: "맘카페 바이럴", recs: ["블로그 마케팅", "홈페이지형 블로그"], result: "맘카페 바이럴 중심", color: "from-blue-700 to-indigo-800" },
                { industry: "온라인 쇼핑몰", firstRec: "블로그 SEO", recs: ["체험단·리뷰", "블로그 배포"], result: "블로그 SEO 중심", color: "from-blue-500 to-indigo-600" },
                { industry: "청소·시설관리", firstRec: "플레이스 SEO", recs: ["블로그 관리", "리뷰 마케팅"], result: "67위 → 4위 · 17일 계측", color: "from-blue-600 to-blue-800" },
                { industry: "개업·창업 준비", firstRec: "창업 지원·브랜딩", recs: ["플레이스 세팅", "블로그 마케팅"], result: "오픈 전 플레이스 세팅", color: "from-blue-700 to-blue-900" },
              ].map((ind) => (
                <div key={ind.industry} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className={`bg-gradient-to-br ${ind.color} px-4 py-3`}>
                    <div className="font-black text-white text-sm">{ind.industry}</div>
                    <div className="text-white/70 text-[11px] mt-0.5">{ind.result}</div>
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">우선 추천</div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-black mb-3">
                      {ind.firstRec}
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">추가 옵션</div>
                    <div className="flex gap-1 flex-wrap">
                      {ind.recs.map((r) => (
                        <span key={r} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[11px] font-medium">{r}</span>
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


        {/* ══ 가격 산출 근거 ══ */}
        <section id="pricing" className="py-14 md:py-20 bg-white scroll-mt-20">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">가격 산출 근거</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">가격을 먼저 정해두고 일을 맞추지 않습니다</h2>
              <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
                항목별 단가를 정해두고 매장에 필요한 항목만 더해 견적을 냅니다.
                아래 단가는 실제로 나간 견적서에 쓰인 금액 그대로이고, 계산 과정도 그대로 공개합니다.
              </p>
            </div>

            {/* 1) 항목별 단가 */}
            <div className="mb-12 md:mb-14">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                  <Calculator size={15} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-base md:text-lg font-black text-gray-900">1) 항목별 단가</h3>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left font-black text-gray-700 px-4 py-3">항목</th>
                      <th className="text-left font-black text-gray-700 px-4 py-3 whitespace-nowrap">단위</th>
                      <th className="text-right font-black text-gray-700 px-4 py-3 whitespace-nowrap">단가</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UNIT_PRICES.map((u) => (
                      <tr key={u.item} className="border-b border-gray-100 last:border-0 bg-white">
                        <td className="px-4 py-3 text-gray-800 font-bold">
                          {u.item}
                          {u.note && (
                            <span className="block mt-1 text-[11px] font-normal leading-relaxed text-gray-500">{u.note}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{u.unit}</td>
                        <td className="px-4 py-3 text-right font-black text-gray-900 tabular-nums whitespace-nowrap">{u.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-gray-400 mt-2.5 leading-relaxed">
                모든 금액은 부가세 별도입니다. 네이버·인스타 광고 집행비는 매체에 직접 나가는 실비라 대행료에 넣지 않습니다.
              </p>
            </div>

            {/* 2) 산출 예시 */}
            <div className="mb-12 md:mb-14">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                  <Package size={15} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-base md:text-lg font-black text-gray-900">2) 실제 견적 3건이 어떻게 나왔는가</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-start">
                {CALC_EXAMPLES.map((c) => (
                  <div key={c.title} className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                      <h4 className="font-black text-gray-900 text-sm mb-1">{c.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{c.sub}</p>
                    </div>
                    <div className="px-5 py-4">
                      <ul className="space-y-2.5 mb-3">
                        {c.lines.map((l) => (
                          <li key={l.label} className="flex items-start justify-between gap-3 text-xs">
                            <span className="text-gray-700 leading-snug">{l.label}</span>
                            <span className="text-gray-400 tabular-nums whitespace-nowrap shrink-0">{l.calc}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                        <span className="text-xs font-black text-gray-500">월 합계</span>
                        <span className="text-lg font-black text-blue-600 tabular-nums">{c.total}원</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">{c.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3) 조합 방식 — 월 금액 구간표를 걷어낸 자리 */}
            <div className="mb-12 md:mb-14">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                  <ListChecks size={15} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-base md:text-lg font-black text-gray-900">3) 필요한 것만 골라서 조합합니다</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {HOW_WE_COMPOSE.map((c, i) => (
                  <div key={c.step} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0 tabular-nums">
                        {i + 1}
                      </span>
                      <span className="text-[11px] font-black text-blue-700 tracking-wide">{c.step}</span>
                    </div>
                    <h4 className="font-black text-gray-900 text-sm mb-1.5 leading-snug">{c.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{c.body}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-2.5 leading-relaxed">
                그래서 &lsquo;월 얼마짜리 패키지&rsquo; 를 미리 만들어두지 않습니다. 같은 예산이어도 매장 상황에 따라 들어가는 항목이 달라지기 때문입니다.
              </p>
            </div>
            {/* 4) 업종별 차이 */}
            <div className="mb-12 md:mb-14">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                  <Layers size={15} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-base md:text-lg font-black text-gray-900">4) 업종마다 구성이 달라지는 지점</h3>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left font-black text-gray-700 px-4 py-3 whitespace-nowrap">업종</th>
                      <th className="text-left font-black text-gray-700 px-4 py-3">고객이 검색하는 방식</th>
                      <th className="text-left font-black text-gray-700 px-4 py-3">주력 채널</th>
                      <th className="text-left font-black text-gray-700 px-4 py-3">월 물량</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INDUSTRY_PRICE_DIFF.map((r) => (
                      <tr key={r.industry} className="border-b border-gray-100 last:border-0 bg-white">
                        <td className="px-4 py-3 font-black text-gray-900 whitespace-nowrap">{r.industry}</td>
                        <td className="px-4 py-3 text-gray-600">{r.behavior}</td>
                        <td className="px-4 py-3 text-gray-600">{r.channel}</td>
                        <td className="px-4 py-3 text-gray-600">{r.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-gray-400 mt-2.5 leading-relaxed">
                같은 예산이어도 업종에 따라 쓰는 곳이 달라집니다. 음식점은 배포 건수로, 청소업은 블로그 편수로, 카페는 사진과 인스타로 갑니다.
              </p>
            </div>

            {/* 5) 왜 다를 수밖에 없는가 */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                  <TrendingUp size={15} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-base md:text-lg font-black text-gray-900">5) 가격이 다를 수밖에 없는 이유</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {WHY_PRICE_DIFFERS.map((w, i) => (
                  <div
                    key={w.title}
                    className={`rounded-2xl border border-gray-200 bg-white shadow-sm p-4 md:p-5 ${i === WHY_PRICE_DIFFERS.length - 1 ? "md:col-span-2" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-black flex items-center justify-center shrink-0 tabular-nums">
                        {i + 1}
                      </span>
                      <h4 className="font-black text-gray-900 text-sm">{w.title}</h4>
                    </div>
                    <p className="text-xs md:text-[13px] text-gray-600 leading-relaxed">{w.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <p className="text-sm text-blue-900 leading-relaxed flex-1">
                  그래서 홈페이지에 정찰제 금액을 걸어두지 않습니다. 현황을 먼저 보고 필요한 항목만 골라 견적을 냅니다.
                  진단과 견적은 0원이고, 견적을 받고 안 하셔도 됩니다.
                </p>
                <Link
                  href="/contact"
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black transition-colors"
                >
                  내 매장 견적 받기
                  <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 하랑의 약속 ══ */}
        <section className="py-14 md:py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">하랑의 약속</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                결과에 책임지는 대행사입니다
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                {SITE.stats.renewalRate} 재계약률은 단순 숫자가 아닙니다. 결과가 없으면 전략을 바꾸고, 실패하면 솔직히 말하는 것이 하랑의 방식입니다.
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black mb-4 shadow-sm" style={{ background: "var(--w-primary)" }}>
                    {item.icon}
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            {/* 신뢰 수치 */}
            <div className="bg-gray-950 rounded-2xl p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { val: SITE.stats.renewalRate, label: "재계약률", sub: "누적 기준" },
                  { val: "500+", label: "완료 프로젝트", sub: "2020년~현재" },
                  { val: "0원", label: "상담 비용", sub: "부담 없이 시작" },
                  { val: "24h", label: "이내 연락", sub: "대표가 직접 응대" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl md:text-3xl font-black text-white mb-0.5">{s.val}</div>
                    <div className="text-xs font-bold text-gray-300">{s.label}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{s.sub}</div>
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
                  <span className="w-5 h-5 rounded bg-green-600 text-white text-[11px] font-black flex items-center justify-center">N</span>
                  네이버 블로그
                </a>
                <a href="https://www.instagram.com/jty0221/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold hover:bg-purple-100 transition-colors">
                  <span className="w-5 h-5 rounded bg-purple-600 text-white text-[11px] font-black flex items-center justify-center">I</span>
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

        {/* 구성 예시 — 금액을 걸지 않는다 (대표 지시 2026-08-23) */}
        <section className="py-14 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">구성 예시</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">실제로 이런 조합으로 계약합니다</h2>
              <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
                세 가지 중 하나를 고르는 게 아니라, 여기서 필요 없는 항목은 빼고 부족한 항목은 더해 매장에 맞게 다시 짜드립니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  tier: "한 채널 집중",
                  desc: "이미 순위가 어느 정도 나오거나, 한 곳만 확실히 잡으면 되는 매장",
                  highlight: false,
                  services: ["플레이스 SEO 최적화 1회", "대표키워드 상위노출 관리", "리뷰 유도 동선 설계", "순위 모니터링 · 경쟁업체 분석", "월 성과 리포트"],
                  result: "3위권 키워드를 1~2위로",
                },
                {
                  tier: "두세 채널 묶음",
                  desc: "검색 유입부터 만들어야 하는 매장 · 가장 많이 선택하는 구성",
                  highlight: true,
                  services: ["플레이스 SEO 최적화", "블로그 관리대행", "파워컨텐츠 원고 설계 · 검수 대응", "네이버 광고 세팅 · 운영대행", "월 성과 리포트"],
                  result: "검색 유입 만들고 문의 전환 붙이기",
                },
                {
                  tier: "전 채널 통합",
                  desc: "경쟁이 촘촘한 상권 · 지점이 여러 곳인 브랜드",
                  highlight: false,
                  services: ["블로그 · 카페 배포", "파워컨텐츠 원고", "플레이스 SEO · 트래픽 · 길찾기", "인스타 피드 · 릴스", "광고 운영 (집행비 별도)", "주간 성과 리포트"],
                  result: "지역 키워드 전 구간 점유",
                },
              ].map((pkg) => (
                <div
                  key={pkg.tier}
                  className={`rounded-2xl overflow-hidden border ${pkg.highlight ? "border-blue-200 shadow-xl shadow-blue-100/50 scale-[1.02]" : "border-gray-100 shadow-sm"} transition-all`}
                >
                  <div className={`px-6 py-6 ${pkg.highlight ? "bg-blue-600" : "bg-gray-900"}`}>
                    {pkg.highlight && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-black mb-3">
                        가장 많이 선택
                      </div>
                    )}
                    <div className="text-xl font-black text-white mb-2">{pkg.tier}</div>
                    <p className="text-white/70 text-xs leading-relaxed">{pkg.desc}</p>
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
                      className={`flex items-center justify-center gap-1.5 w-full py-3 rounded-xl text-sm font-black transition-colors ${pkg.highlight ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                    >
                      이 구성으로 상담 신청
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[11px] text-gray-400 mt-6 leading-relaxed">
              * 실제 계약·견적 9건에서 뽑은 구성입니다. 항목마다 물량은 매장마다 다르게 잡으므로 진단 후에 항목별로 다시 계산합니다.
            </p>
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
                  harang: "대표가 직접 관리 · 500+ 경험",
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-11 md:min-h-0 rounded-xl bg-yellow-400 text-gray-900 text-xs font-bold hover:bg-yellow-300 transition-colors">
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
              <Link href="/faq" className="inline-flex items-center gap-1.5 min-h-11 md:min-h-0 text-blue-600 font-semibold text-sm hover:underline">
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
                { label: "재계약률", value: SITE.stats.renewalRate },
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
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">상담 0원 · 24시간 내 연락</p>
                <h3 className="text-lg md:text-xl font-black text-gray-900 mb-1">
                  우리 매장엔 뭐가 필요한지 모르겠다면?
                </h3>
                <p className="text-sm text-gray-500">
                  업종·상권·경쟁 상황마다 필요한 게 다릅니다. 매장을 보고 맞춤으로 제안드립니다.
                </p>
              </div>
              <Link href="/contact"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-colors shadow-sm">
                무료 진단 신청 <ArrowRight size={14} />
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: "var(--w-primary)" }}>
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
