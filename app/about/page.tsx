import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import {
  Shield, Target, TrendingUp, MessageCircle, Heart,
  CheckCircle2, ArrowRight, Quote, Star,
  Phone, BookOpen, MapPin, AtSign, Coffee, Users,
} from "lucide-react";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import JsonLd from "../components/JsonLd";
import AnswerBlock from "../components/AnswerBlock";
import { SITE, ORG_ID, ANSWER_SENTENCES, webPageLd, breadcrumbLd } from "../lib/seo";

const BASE = SITE.base;

/* 회사소개 구조화 데이터

   중요: Organization / Person 의 @id 는 루트 layout 에서 선언한 것과 반드시 같아야 한다.
   같은 회사를 다른 @id 로 두 번 선언하면 엔티티 그래프가 쪼개져
   구글·AI 가 "하랑마케팅"을 하나의 주체로 합치지 못한다.
   여기서는 참조(@id)만 하고 대표(Person) 정보만 상세히 확장한다. */
const ABOUT_LD = [
  webPageLd({
    path: "/about",
    type: "AboutPage",
    name: "회사소개 — 하랑마케팅",
    description:
      "해병대 장교 출신 전태영 대표가 직접 운영하는 소상공인 전문 마케팅 대행사. 카페 창업 실패를 딛고 500곳 이상의 소상공인과 함께 성장한 하랑마케팅의 이야기.",
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "회사소개", path: "/about" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE}/about#founder`,
    name: "전태영",
    givenName: "태영",
    familyName: "전",
    jobTitle: "대표",
    url: `${BASE}/about`,
    image: `${BASE}/og-image.png`,
    description:
      "하랑마케팅 대표. 해병대 장교로 복무 후 2018년 전역, 카페 창업과 마케팅 대행사 팀장 경험을 거쳐 2020년 4월 하랑마케팅을 설립했습니다. 마케팅 경력 10년 이상, 소상공인 500곳 이상의 성장을 지원했습니다.",
    worksFor: { "@id": ORG_ID },
    founderOf: { "@id": ORG_ID },
    nationality: { "@type": "Country", name: "대한민국" },
    knowsLanguage: ["ko"],
    knowsAbout: [
      "네이버 플레이스 SEO",
      "네이버 플레이스 상위 노출",
      "소상공인 마케팅",
      "블로그 마케팅",
      "체험단 마케팅",
      "인스타그램 마케팅",
      "맘카페 바이럴 마케팅",
      "로컬 비즈니스 마케팅",
    ],
    alumniOf: { "@type": "Organization", name: "대한민국 해병대" },
    sameAs: [SITE.instagram, SITE.naverBlog],
  },
];

export const metadata: Metadata = {
  title: "회사소개 — 하랑마케팅 | 10년 경력 소상공인 전문 마케팅 대행사",
  description: "해병대 장교 출신 대표가 직접 운영. 카페 창업 실패를 딛고 500곳 이상의 소상공인과 함께 성장한 하랑마케팅의 진짜 이야기.",
  keywords: [
    "하랑마케팅 소개", "소상공인 마케팅 대행사", "마케팅 대행사 신뢰", "투명한 마케팅",
    "마케팅 대행사 대표", "전태영", "전국 마케팅 대행사", "경기 마케팅 대행사", "수도권 마케팅 대행사",
    "소상공인 마케팅 전문가", "네이버 플레이스 전문가",
  ],
  alternates: { canonical: `${BASE}/about` },
  openGraph: {
    title: "하랑마케팅 — 대표가 직접 관리, 결과 없으면 솔직히 말씀드립니다",
    description: "해병대 장교 출신, 카페 창업 실패 경험. 대표님의 돈이 어디에 쓰이는지 직접 챙기고 설명합니다.",
    url: `${BASE}/about`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 소개" }],
  },
};

const PROMISES = [
  {
    num: "01",
    icon: Shield,
    color: "from-blue-500 to-blue-700",
    title: "투명하게 작업합니다",
    desc: "말로만 '믿어달라' 하지 않습니다. 약속한 작업을 100% 진행하고 결과를 투명하게 공유합니다. 고의로 빠뜨리거나 속인 사실이 확인되면 결제 금액의 10배를 보상해드립니다.",
    badge: "10배 보상 정책",
  },
  {
    num: "02",
    icon: Target,
    color: "from-blue-600 to-blue-800",
    title: "묶음 패키지 강요 없이, 꼭 필요한 것만",
    desc: "음식점과 학원, 쇼핑몰은 필요한 마케팅이 전혀 다릅니다. 불필요한 서비스를 끼워 넣지 않고, 업종에 딱 맞는 것만 골라 적은 비용으로 최대 효과를 만들어 드립니다.",
    badge: "업종별 맞춤 설계",
  },
  {
    num: "03",
    icon: TrendingUp,
    color: "from-blue-500 to-blue-700",
    title: "반짝 노출 NO, 지속 가능한 성장",
    desc: "단순 광고가 아닌 브랜드 신뢰도를 높이는 콘텐츠를 만듭니다. 지속적인 순위 체크, 키워드 최적화, 플랫폼 다각화로 시간이 지날수록 우상향하는 매출 그래프를 만들어냅니다.",
    badge: "장기 성장 설계",
  },
  {
    num: "04",
    icon: MessageCircle,
    color: "from-blue-700 to-indigo-700",
    title: "대표님을 귀찮게 하는 파트너",
    desc: "계약하고 나면 연락 두절되는 대행사에 지치셨나요? 하랑은 반대입니다. 24시간, 주말 없이 끊임없이 소통하고 피드백을 드립니다. 대표님과 저희가 한 팀이 될 때 결과가 달라집니다.",
    badge: "24시간 소통",
  },
  {
    num: "05",
    icon: Heart,
    color: "from-blue-600 to-blue-900",
    title: "실패 경험에서 나오는 진정성",
    desc: "하랑 대표는 카페 창업을 직접 했다가 실패한 경험이 있습니다. 마케팅이 단순한 비용이 아니라 생존을 위한 투자임을 누구보다 잘 압니다. 대표님의 돈을 제 돈처럼 무겁게 생각합니다.",
    badge: "대표가 직접 관리",
  },
];

const SERVICES_LIST = [
  { icon: MapPin, color: "from-blue-500 to-blue-700", title: "네이버 플레이스 SEO", items: ["SEO 최적화", "상위 노출", "순위 관리", "예약률 상승 세팅"] },
  { icon: BookOpen, color: "from-blue-600 to-blue-800", title: "블로그 마케팅", items: ["브랜드 블로그 관리 대행", "블로그 상위 노출", "최상위 블로그 배포", "기자단 배포"] },
  { icon: Users, color: "from-blue-500 to-blue-700", title: "바이럴 마케팅", items: ["맘카페 입소문 마케팅", "체험단 모집 (100% 실사용자)", "지역 커뮤니티 바이럴"] },
  { icon: AtSign, color: "from-blue-700 to-indigo-700", title: "SNS 마케팅", items: ["인스타그램 계정 육성", "인기 게시물 노출", "리그램", "하이라이트 세팅"] },
  { icon: MapPin, color: "from-blue-600 to-blue-800", title: "지도·리뷰 관리", items: ["카카오맵 매장 관리", "카카오맵 리뷰 (실유저)", "카카오맵 상위 노출"] },
  { icon: Coffee, color: "from-blue-500 to-indigo-600", title: "창업 지원", items: ["홈페이지형 블로그 제작", "로고·명함 디자인", "메뉴판 제작"] },
];

const FAQS = [
  {
    q: "대행사와 실행사 중 어디를 선택해야 하나요?",
    a: "마케팅 전반을 직접 운영할 수 있다면 실행사, 시간을 절약하면서 전반적인 마케팅을 맡기고 싶다면 대행사가 맞습니다.",
  },
  {
    q: "대행 비용은 어떻게 되나요?",
    a: "업종·지역·경쟁 상황에 따라 맞춤 결정됩니다. 강남 음식점과 지방 음식점이 같은 비용일 수 없듯, 상담 후 최적 견적을 제안드립니다.",
  },
  {
    q: "효과는 언제부터 나타나나요?",
    a: "최소 2개월 이상 꾸준히 진행하셨을 때 단기 매출뿐 아니라 브랜드 자체가 성장하는 것을 체감하실 수 있습니다. 단기 실행과 장기 브랜딩을 동시에 진행합니다.",
  },
  {
    q: "광고비가 비싸지는 않나요?",
    a: "무조건 싼 게 좋은 게 아닙니다. 1년 계약에 120만원(월 10만원)으로 마케팅을 해준다는 업체들은 대부분 기계적인 작업입니다. 하랑은 불필요한 서비스를 빼고 비용 대비 높은 효율을 만들어드립니다.",
  },
  {
    q: "계약 기간은 어떻게 되나요?",
    a: "월 단위 계약이 기본이라 1개월부터 가능하고 중도 해지 위약금도 없습니다. 다만 마케팅도 다이어트처럼 꾸준한 관리가 핵심이라, 3개월 이상 쌓아야 결과가 보이는 업종이면 미리 말씀드립니다.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={ABOUT_LD} />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">

        {/* Hero */}
        <section className="bg-gray-950 py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-blue-600/7 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-indigo-600/7 rounded-full blur-3xl" />
            <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-6">About Us</p>
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-black text-white mb-6 leading-[1.05] tracking-tight">
              결과가 없으면<br />솔직히 말씀드립니다
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
              수많은 대행사에 실망하셨던 그 마음, 누구보다 잘 알고 있습니다.
              500곳 이상의 대표님들이 돌고 돌아 하랑마케팅을 선택하신 이유를 솔직하게 이야기합니다.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              {[
                { val: "500+", label: "클라이언트" },
                { val: SITE.stats.renewalRate, label: "재계약률" },
                { val: "10년+", label: "경력" },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-3 md:p-4 text-center">
                  {/* 375px 3칸에서 칸 안쪽이 71px 뿐이라 '97.4%' 의 % 가 둘째 줄로 떨어졌다.
                      숫자는 줄바꿈하지 않는다 (2026-08-27 (목) 수정) */}
                  <div className="text-xl sm:text-2xl font-black text-white mb-0.5 whitespace-nowrap tabular-nums">{s.val}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AEO — 회사·대표 정체성 한 줄 정답 */}
        <AnswerBlock
          question="하랑마케팅 대표는 누구이고, 회사는 어떤 곳인가요?"
          answer={`${ANSWER_SENTENCES.whoWeAre} 대표 전태영은 해병대 장교로 복무 후 2018년 전역했고, 직접 카페를 창업해 실패한 경험과 마케팅 대행사 팀장 경력을 바탕으로 2020년 4월 하랑마케팅을 설립했습니다. 사장님 입장을 겪어본 사람이 마케팅을 맡는다는 것이 하랑마케팅의 출발점입니다.`}
          facts={[
            { label: "대표", value: "전태영" },
            { label: "설립", value: "2020.04.15" },
            { label: "담당 지역", value: "전국" },
            { label: "클라이언트", value: "500곳+" },
          ]}
        />

        {/* Pain Points */}
        <section className="py-14 md:py-20 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-6 text-center">혹시 이런 고민 중이신가요?</p>
            <div className="space-y-5">
              {[
                "마케팅, 해야 하는 건 아는데 막상 하려니 너무 어렵고 귀찮습니다.",
                "광고비는 썼는데 효과는 없고, 돈만 날린 기분이에요.",
                "내 가게처럼 책임지고 관리해 주는 곳, 정말 없을까요?",
              ].map((text, i) => (
                <div key={i} className="relative pl-6 border-l-4 border-red-500">
                  <div className="absolute -top-2 -left-1 text-red-500 text-5xl font-black leading-none select-none opacity-20">&ldquo;</div>
                  <p className="text-lg md:text-xl font-black text-gray-900 leading-snug">{text}</p>
                  <div className="absolute -bottom-1 left-0 w-1 h-3 bg-red-400 rounded-full opacity-50" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CEO Story */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 md:gap-14 items-start">
              {/* Photo */}
              <div className="flex flex-col items-center gap-4">
                <PhotoPlaceholder
                  label="대표 전태영 프로필 사진"
                  hint="정장 또는 캐주얼 정장 / 밝은 배경 / 세로형 인물 사진"
                  width="w-full"
                  height="h-64"
                  className="rounded-2xl"
                />
                <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                  <div className="font-black text-gray-900 text-base mb-0.5">전태영</div>
                  <div className="text-xs text-blue-600 font-bold">하랑마케팅 대표</div>
                  <div className="text-[11px] text-gray-400 mt-1">해병대 장교 출신 · 마케팅 경력 10년+ · 7년차 대표</div>
                  <div className="flex gap-0.5 justify-center mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} className="text-blue-400 fill-blue-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Story */}
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">대표 스토리</p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 leading-snug">
                  실패해 본 마케터가<br /><span className="text-blue-600">성공하는 길을 가장 잘 압니다</span>
                </h2>
                <div className="space-y-4 text-gray-600 text-base leading-relaxed">
                  <p>대학교 시절 서포터즈 활동을 시작으로 마케팅의 길에 들어섰고, <strong className="text-gray-900">2018년 해병대 장교로 전역한 후 전 재산을 털어 카페를 창업했다가 실패의 쓴맛을 봤습니다.</strong> 마케팅을 제대로 몰랐던 저는 금방 망했습니다.</p>
                  <p>이후 마케팅 대행사에 취업해 팀장까지 올라갔습니다. 그런데 내부에서 보이는 현실은 충격이었습니다. <strong className="text-gray-900">고객을 대충 대하고, 성과도 없으면서 돈만 받는 방식.</strong> 그 모습에 혐오감을 느꼈고, &lsquo;내가 직접 제대로 된 대행사를 만들자&rsquo;는 결심으로 2020년 4월 하랑마케팅을 설립했습니다.</p>
                  <p>카페를 직접 운영해 봤고, 대행사의 내부도 봤기에 <strong className="text-gray-900">대표님의 답답함과 대행사의 문제를 누구보다 잘 압니다.</strong> 그래서 하랑은 다릅니다.</p>
                </div>

                <div className="mt-7 p-5 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center mb-3 shadow-sm">
                    <Quote size={12} className="text-white" />
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed font-medium italic">
                    &lsquo;음식점은 맛이 본질이고, 마케팅은 그 본질을 빛나게 하는 도구입니다. 본질이 훌륭하다면, 그 가치를 세상에 알리는 일은 전문가에게 맡겨주세요.&rsquo;
                  </p>
                  <p className="text-xs text-blue-600 mt-2 font-bold">대표 전태영</p>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { val: "10년+", label: "마케팅 경력" },
                    { val: "500+", label: "함께한 대표님" },
                    { val: "10배", label: "기만행위 보상" },
                    { val: "24/7", label: "소통 가능" },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                      <div className="text-lg font-black text-blue-600">{s.val}</div>
                      <div className="text-[11px] text-gray-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Promises */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">하랑의 약속</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">왜 하랑마케팅을 선택해야 할까요?</h2>
              <p className="text-gray-400 text-sm mt-2">미사여구보다, 대표님이 가장 안심할 수 있는 5가지 약속을 드립니다</p>
            </div>
            <div className="space-y-4">
              {PROMISES.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.num} className="bg-white rounded-2xl p-6 md:p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex items-center gap-3 sm:shrink-0">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: "var(--w-primary)" }}>
                          <Icon size={20} className="text-white" strokeWidth={2} />
                        </div>
                        <span className="text-lg font-black sm:hidden" style={{ color: "var(--w-label-alt)" }}>{p.num}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-lg font-black hidden sm:block" style={{ color: "var(--w-label-alt)" }}>{p.num}</span>
                          <h3 className="font-black text-gray-900 text-base">{p.title}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-black">{p.badge}</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* All-in-One Services */}
        <section className="py-16 md:py-24 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">All-in-One 서비스</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">하랑을 통하면 원스텝으로 해결됩니다</h2>
              <p className="text-gray-400 text-sm mt-2">복잡한 마케팅 채널, 필요한 것만 골라 내 업체에 맞게 설계합니다</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES_LIST.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:bg-white hover:shadow-md transition-all">
                    <div className="p-5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm" style={{ background: "var(--w-primary)" }}>
                        <Icon size={17} className="text-white" strokeWidth={2} />
                      </div>
                      <h3 className="font-black text-gray-900 text-sm mb-2">{s.title}</h3>
                      <ul className="space-y-1">
                        {s.items.map((item) => (
                          <li key={item} className="flex items-center gap-1.5 text-xs text-gray-500">
                            <CheckCircle2 size={11} className="text-blue-400 shrink-0" strokeWidth={2.5} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-sm">
                서비스 상세 보기 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* CEO Letter */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mb-6 shadow-sm">
              <Quote size={17} className="text-white" />
            </div>
            <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-5">대표의 편지</p>
            <h2 className="text-xl md:text-2xl font-black text-white mb-6 leading-relaxed">
              광고비는 나가는데 전화는 울리지 않던 달, 저도 겪었습니다
            </h2>
            <div className="space-y-4 text-blue-100 text-base leading-relaxed mb-8">
              <p>가게 문을 닫고 그날 매출을 정산하다 보면 압니다. 오늘 들어온 손님 중에 처음 온 사람이 몇인지. 그 숫자가 며칠째 그대로일 때의 기분을요. 저는 그게 맛 때문인 줄 알았습니다. 아니었습니다. 그 골목에 우리 가게가 있다는 걸 아무도 몰랐을 뿐입니다.</p>
              <p>그때 맡겨봤던 대행사는 물어봐야 답이 왔습니다. 이번 달에 무엇을 했고 무엇이 달라졌는지는 끝까지 알 수 없었습니다. 나중에 그 안으로 들어가 일해보고 나서야 알았습니다. <strong className="text-white">답을 안 준 게 아니라, 보여드릴 것이 없었던 겁니다.</strong></p>
              <p>그래서 하랑은 순서를 뒤집었습니다. 물어보시기 전에 먼저 말씀드리고, 안 된 것은 안 됐다고 적습니다. 순위가 내려간 주에도 그대로 보내드립니다. 좋은 소식만 골라 보내면 그건 보고가 아니라 광고입니다.</p>
              <p>전화를 받는 사람도 접니다. 상담한 사람이 그대로 끝까지 맡습니다. 계약하자마자 처음 보는 담당자로 바뀌는 일은 없습니다.</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-8">
              <p className="text-sm text-blue-100 font-medium leading-relaxed">
                오늘 계약하지 않으셔도 됩니다. 지금 어디에서 돈이 새고 있는지만 듣고 가셔도 괜찮습니다. 대표님이 지금 넣고 계신 그 돈이, 제가 카페에 넣었던 돈과 다르지 않다는 걸 아니까요.
              </p>
              <p className="text-xs text-blue-300 mt-2 font-bold">하랑마케팅 대표 전태영</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blue-700 font-black text-sm hover:bg-blue-50 transition-colors shadow-lg">
                무료 상담 신청 <ArrowRight size={14} />
              </Link>
              <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/25 text-white font-bold text-sm hover:bg-white/18 transition-colors">
                <MessageCircle size={14} /> 카카오톡 문의
              </a>
            </div>
          </div>
        </section>

        {/* 10년 수치 배너 */}
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { value: "10년+", label: "마케팅 경력", sub: "서포터즈 활동부터 현재까지" },
                { value: "500+", label: "함께한 매장", sub: "전국 소상공인" },
                { value: SITE.stats.renewalRate, label: "재계약률", sub: "성과로 증명" },
                { value: "0원", label: "상담 비용", sub: "계약 강요 없음" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-4 md:p-5 text-center border border-gray-100 shadow-sm">
                  <div className="text-2xl md:text-3xl font-black text-blue-600 mb-0.5">{s.value}</div>
                  <div className="text-xs font-black text-gray-800">{s.label}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 하랑 vs 일반 대행사 비교 */}
        <section className="py-14 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Why Harang</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                대행사, 어디를 골라야 할까요?
              </h2>
              <p className="text-gray-500 text-sm">실제 소상공인 사장님들이 대행사 선택에서 가장 많이 겪는 문제와 하랑의 차이를 정직하게 비교했습니다.</p>
            </div>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="min-w-[600px] md:min-w-0 px-4 md:px-0">
                {/* Header row */}
                <div className="grid grid-cols-[1fr_1fr_1fr] gap-0 mb-1">
                  <div className="py-3 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">항목</div>
                  <div className="py-3 px-4 rounded-t-2xl bg-gray-100 text-center text-xs font-black text-gray-500 uppercase tracking-widest">일반 대행사</div>
                  <div className="py-3 px-4 rounded-t-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-center text-xs font-black text-white uppercase tracking-widest">하랑마케팅</div>
                </div>
                {[
                  { item: "담당자", general: "자주 바뀜 (이직·인수인계)", harang: "대표가 직접 관리 (처음부터 끝까지)" },
                  { item: "상담 비용", general: "유료 또는 계약 압박", harang: "완전 무료 · 계약 강요 없음" },
                  { item: "성과 보고", general: "복잡한 지표 · 실제 매출 연결 안 됨", harang: "매월 매출 연결 지표 리포트" },
                  { item: "작업 투명성", general: "어디에 썼는지 알기 어려움", harang: "매체사 전달 내역 100% 공유" },
                  { item: "부적합 시", general: "계약 기간 강제 유지", harang: "성과 미달 시 전략 즉시 수정 · 중도 해지 위약금 없음" },
                  { item: "보상 정책", general: "없음", harang: "고의 누락 시 결제금액 10배 보상" },
                  { item: "최소 계약", general: "6개월~1년", harang: "월 단위 · 1개월부터 가능" },
                ].map((row, i) => (
                  <div key={i} className={`grid grid-cols-[1fr_1fr_1fr] gap-0 ${i % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}>
                    <div className="py-4 px-4 text-sm font-bold text-gray-700 flex items-center border-b border-gray-100">{row.item}</div>
                    <div className="py-4 px-4 text-sm text-gray-400 flex items-center border-b border-gray-100 bg-gray-100/50">
                      <CheckCircle2 size={13} className="text-gray-300 shrink-0 mr-2" strokeWidth={2.5} />
                      {row.general}
                    </div>
                    <div className="py-4 px-4 text-sm text-blue-700 font-semibold flex items-center border-b border-blue-50 bg-blue-50/50">
                      <CheckCircle2 size={13} className="text-blue-500 shrink-0 mr-2" strokeWidth={2.5} />
                      {row.harang}
                    </div>
                  </div>
                ))}
                {/* Footer row */}
                <div className="grid grid-cols-[1fr_1fr_1fr] gap-0 mt-1">
                  <div />
                  <div className="rounded-b-2xl bg-gray-100 py-3 px-4 text-center text-xs text-gray-400 font-semibold">일반 대행사</div>
                  <div className="rounded-b-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 text-center text-xs text-white font-black">재계약률 {SITE.stats.renewalRate}</div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-colors shadow-sm">
                무료 상담으로 직접 확인하기 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">자주 묻는 질문</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">상담 전 미리 확인하세요</h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <details key={i} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-blue-100 transition-colors">
                  <summary className="flex items-center gap-3 p-5 cursor-pointer list-none select-none">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="font-bold text-gray-800 text-sm flex-1">Q. {faq.q}</span>
                    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 pt-3 ml-9 text-sm text-gray-500 leading-relaxed border-t border-blue-50">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>

            {/* 연혁 타임라인 */}
            <div className="mt-10 mb-10">
              <h2 className="text-xl font-black text-gray-900 mb-6 text-center">하랑마케팅 걸어온 길</h2>
              <div className="relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-gray-100" />
                <div className="space-y-6">
                  {[
                    { year: "2014~", event: "대학생 서포터즈 활동 · 마케팅 경력 시작", note: "브랜드 홍보, 콘텐츠 제작, 현장 마케팅 경험 축적" },
                    { year: "2018", event: "해병대 장교 전역 · 카페 창업 도전", note: "마케팅을 몰라 단기간 폐업. 소상공인의 아픔을 직접 경험" },
                    { year: "2018~", event: "마케팅 대행사 취업 · 팀장까지 근무", note: "내부에서 목격한 허위 보고·불성실 대응에 혐오감 → 직접 창업 결심" },
                    { year: "2020", event: "하랑마케팅 공식 설립 (4월 15일)", note: "'제대로 된 대행사를 만들자' · 소상공인 전문 마케팅 대행 시작" },
                    { year: "2022", event: "누적 클라이언트 100곳 돌파", note: "카페·음식점 중심 → 병원·뷰티·학원으로 업종 확장" },
                    { year: "2024", event: "배달 플랫폼·SNS 마케팅 서비스 추가", note: "배민·쿠팡이츠·인스타그램 전문 라인업 구축" },
                    { year: "2026", event: `누적 클라이언트 500곳+, 재계약률 ${SITE.stats.renewalRate}`, note: "7년차 · 대표가 직접 관리 원칙 유지 중" },
                  ].map((item) => (
                    <div key={item.year} className="flex gap-5 relative pl-10">
                      <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shrink-0 z-10">
                        <span className="text-[11px] font-black text-blue-600">{item.year.slice(2)}</span>
                      </div>
                      <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <div className="text-[11px] font-bold text-blue-600 mb-1">{item.year}</div>
                        <div className="font-black text-gray-900 text-sm mb-1">{item.event}</div>
                        <div className="text-xs text-gray-500">{item.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
              <p className="text-sm font-black text-gray-900 mb-1">더 궁금한 것이 있으신가요?</p>
              <p className="text-xs text-gray-500 mb-4">24시간 이내 대표가 직접 답변드립니다</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm transition-colors">
                  <MessageCircle size={14} /> 카카오톡 문의
                </a>
                <a href="tel:010-7541-9054"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors">
                  <Phone size={14} /> 010-7541-9054
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CI 섹션 ══ */}
        <section className="py-16 md:py-24 bg-white border-t border-gray-100" id="ci">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">

            {/* 헤더 */}
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px] bg-blue-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-600">Corporate Identity</span>
                <div className="w-6 h-[2px] bg-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3" style={{ letterSpacing: "-0.03em" }}>CI 소개</h2>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-2xl">
                하랑마케팅의 CI는 <strong className="text-gray-700">함께 더 높이</strong>라는 슬로건을 담아,
                두 사람이 서로를 이어주는 모습을 형상화했습니다.
                사장님과 함께 성장하는 하랑마케팅의 철학을 상징합니다.
              </p>
            </div>

            {/* ── 로고타입 — 가로형 ── */}
            <div className="mb-16">
              <h3 className="text-base font-black text-gray-900 mb-1">로고타입 · 가로형</h3>
              <p className="text-sm text-gray-400 mb-8">기본 사용 형태입니다. 넓은 지면 및 디지털 환경, 명함, 인쇄물 등에 사용합니다.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 컬러 */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 flex items-center justify-center h-44 px-10 py-6">
                    <img src="/ci/ci-logo-h-color.jpg" alt="하랑마케팅 가로형 로고 컬러" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-700">컬러</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">기본 사용 버전</p>
                  </div>
                </div>
                {/* 블루 배경 */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-center h-44 px-10 py-6" style={{ background: "#1A56FF" }}>
                    <img src="/ci/ci-logo-h-blue.jpg" alt="하랑마케팅 가로형 로고 블루배경" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-700">블루 배경</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">컬러 배경 사용 시</p>
                  </div>
                </div>
                {/* 흑백 */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 flex items-center justify-center h-44 px-10 py-6">
                    <img src="/ci/ci-logo-h-bw.jpg" alt="하랑마케팅 가로형 로고 흑백" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-700">흑백</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">흑백 인쇄 시</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 로고타입 — 세로형 ── */}
            <div className="mb-16">
              <h3 className="text-base font-black text-gray-900 mb-1">로고타입 · 세로형</h3>
              <p className="text-sm text-gray-400 mb-8">정방형 지면, SNS 프로필, 앱 아이콘 등 세로 배치가 적합한 환경에 사용합니다.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 flex items-center justify-center h-64 p-8">
                    <img src="/ci/ci-logo-v-en.jpg" alt="하랑마케팅 세로형 영문 로고" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-700">영문형</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Harang 영문 로고타입</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 flex items-center justify-center h-64 p-8">
                    <img src="/ci/ci-logo-v-ko.jpg" alt="하랑마케팅 세로형 국문 로고" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-700">국문형</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">하랑 국문 로고타입</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 슬로건 ── */}
            <div className="mb-16">
              <h3 className="text-base font-black text-gray-900 mb-1">슬로건</h3>
              <p className="text-sm text-gray-400 mb-8">하랑마케팅의 핵심 가치를 담은 브랜드 슬로건입니다.</p>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center py-12 px-6">
                <div className="text-center">
                  <p className="text-3xl md:text-5xl font-black text-blue-600 tracking-tight mb-3">하랑, 함께 더 높이</p>
                  <p className="text-sm text-gray-400">사장님과 함께, 더 높은 곳을 향해 성장합니다</p>
                </div>
              </div>
            </div>

            {/* ── 브랜드 색상 ── */}
            <div className="mb-10">
              <h3 className="text-base font-black text-gray-900 mb-1">브랜드 색상</h3>
              <p className="text-sm text-gray-400 mb-8">하랑마케팅의 공식 브랜드 컬러입니다. CI 적용 시 아래 색상 규정을 준수해야 합니다.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    name: "Harang Blue",
                    hex: "#1A56FF",
                    rgb: "RGB 26, 86, 255",
                    cmyk: "CMYK 90, 66, 0, 0",
                    desc: "신뢰, 전문성, 성장, 안정감",
                    dark: true,
                  },
                  {
                    name: "Harang Light Blue",
                    hex: "#7BA8FF",
                    rgb: "RGB 123, 168, 255",
                    cmyk: "CMYK 52, 34, 0, 0",
                    desc: "따뜻함, 동반, 함께, 부드러움",
                    dark: false,
                  },
                  {
                    name: "Harang Dark",
                    hex: "#001536",
                    rgb: "RGB 26, 26, 46",
                    cmyk: "CMYK 43, 43, 0, 82",
                    desc: "권위, 전문성, 신중함, 무게감",
                    dark: true,
                  },
                ].map((c) => (
                  <div key={c.hex} className="rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="h-32 flex items-end p-4" style={{ background: c.hex }}>
                      <span className={`text-sm font-black tracking-wider ${c.dark ? "text-white/70" : "text-gray-800/70"}`}>{c.hex}</span>
                    </div>
                    <div className="p-4">
                      <p className="font-black text-sm text-gray-900 mb-1">{c.name}</p>
                      <p className="text-[11px] text-gray-400 mb-0.5">{c.rgb}</p>
                      <p className="text-[11px] text-gray-400 mb-2">{c.cmyk}</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
