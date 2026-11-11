import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import YouTubeSection from "../components/YouTubeSection";
import JsonLd from "../components/JsonLd";
import {
  SianMain, PageHead, AnswerRow, Section, LineList, ItemList, Table, QuestionList, CloseBand,
} from "../components/sian/Sian";
import s from "../components/sian/sian.module.css";
import { SITE, ORG_ID, ANSWER_SENTENCES, webPageLd, updatedAt, breadcrumbLd, companyYear } from "../lib/seo";

const BASE = SITE.base;
const SHOW_CI_GUIDE = false;
/** 대표 사진이 아직 없다 (2026-09-30 대표 확인) · 사진이 들어오면 true 로 바꾼다 */
const SHOW_PHOTO = false;

/* 회사소개 구조화 데이터

   중요: Organization / Person 의 @id 는 루트 layout 에서 선언한 것과 반드시 같아야 한다.
   같은 회사를 다른 @id 로 두 번 선언하면 엔티티 그래프가 쪼개져
   구글·AI 가 "하랑마케팅"을 하나의 주체로 합치지 못한다.
   여기서는 참조(@id)만 하고 대표(Person) 정보만 상세히 확장한다. */
const ABOUT_LD = [
  webPageLd({
    path: "/about",
    type: "AboutPage",
    name: "회사소개 | 하랑마케팅",
    description:
      "해병대 장교 출신 전태영 대표가 직접 운영하는 소상공인 전문 마케팅 대행사. 카페 창업 실패를 딛고, 개업 전 경력까지 합쳐 10년 동안 누적 500건 프로젝트를 맡아 온 하랑마케팅 대표의 이야기.",
    dateModified: updatedAt("/about"),
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
      "하랑마케팅 대표. 해병대 장교로 복무 후 2018년 전역, 카페 창업과 마케팅 대행사 팀장 경험을 거쳐 2020년 4월 하랑마케팅을 설립했습니다. 마케팅 경력 10년 이상, 개업 전 경력까지 합쳐 누적 500건의 프로젝트를 맡아 왔습니다.",
    worksFor: { "@id": ORG_ID },
    founderOf: { "@id": ORG_ID },
    nationality: { "@type": "Country", name: "대한민국" },
    knowsLanguage: ["ko"],
    knowsAbout: [
      "네이버 플레이스 SEO",
      "네이버 플레이스 정보 정비",
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
  title: "회사소개 | 소상공인 전문 마케팅 대행사 · 대표 10년 경력",
  description: "하랑마케팅 회사소개. 해병대 장교 출신 대표가 카페 창업 실패를 딛고 10년 경력 누적 500건을 직접 맡아 온 이야기입니다.",
  keywords: [
    "하랑마케팅 소개", "소상공인 마케팅 대행사", "마케팅 대행사 신뢰", "투명한 마케팅",
    "마케팅 대행사 대표", "전태영", "전국 마케팅 대행사", "경기 마케팅 대행사", "수도권 마케팅 대행사",
    "소상공인 마케팅 전문가", "네이버 플레이스 전문가",
  ],
  alternates: { canonical: `${BASE}/about` },
  openGraph: {
    title: "10년 경력 대표가 직접 맡는 마케팅 회사소개 · 하랑마케팅",
    description: "해병대 장교 출신, 카페 창업 실패 경험. 대표님의 돈이 어디에 쓰이는지 직접 챙기고 설명합니다.",
    url: `${BASE}/about`,
    images: [{ url: "/og-image.png?v=20261001", width: 1200, height: 630, alt: "하랑마케팅 소개" }],
  },
};

const PROMISES = [
  {
    title: "투명하게 작업합니다",
    desc: "말로만 믿어달라고 하지 않습니다. 계약한 작업은 빠짐없이 진행하고, 게시한 글은 URL 을 전부 드려 직접 확인하실 수 있게 합니다. 좋은 숫자만 골라 보여드리지 않고 잰 결과를 그대로 공유합니다.",
    badge: "작업 내역 전량 공개",
  },
  {
    title: "묶음 패키지 강요 없이, 꼭 필요한 것만",
    desc: "음식점과 학원, 쇼핑몰은 필요한 마케팅이 전혀 다릅니다. 불필요한 서비스를 끼워 넣지 않고 현재 상태와 예산에 맞는 항목만 제안합니다.",
    badge: "업종별 맞춤 설계",
  },
  {
    title: "반짝 노출 NO, 지속 가능한 성장",
    desc: "단순 광고보다 검색 기록과 콘텐츠가 함께 쌓이는 구조를 만듭니다. 순위를 계속 확인하고 변화가 없으면 실행 항목을 다시 조정합니다.",
    badge: "장기 성장 설계",
  },
  {
    title: "대표님을 귀찮게 하는 파트너",
    desc: "계약 뒤에도 진행 내역과 결과를 같은 기준으로 공유합니다. 문의는 언제든 남기실 수 있고, 확인한 내용을 순서대로 답변드립니다.",
    badge: "문의 상시 접수",
  },
  {
    title: "실패 경험에서 나오는 진정성",
    desc: "하랑 대표는 카페 창업을 직접 했다가 실패한 경험이 있습니다. 마케팅이 단순한 비용이 아니라 생존을 위한 투자임을 누구보다 잘 압니다. 대표님의 돈을 제 돈처럼 무겁게 생각합니다.",
    badge: "대표가 직접 관리",
  },
];

const SERVICES_LIST = [
  { title: "네이버 플레이스 SEO", items: ["SEO 최적화", "정보 정비", "순위 계측", "네이버 예약 연동 세팅"] },
  { title: "블로그 마케팅", items: ["브랜드 블로그 관리 대행", "블로그 원고 작성·게시 보고", "블로그 원고 배포", "기자단 배포"] },
  { title: "바이럴 마케팅", items: ["맘카페 입소문 마케팅", "체험단 모집 (실사용자 기반)", "지역 커뮤니티 바이럴"] },
  { title: "SNS 마케팅", items: ["인스타그램 계정 육성", "게시물 구성·발행", "리그램", "하이라이트 세팅"] },
  { title: "지도·리뷰 관리", items: ["카카오맵 매장 관리", "카카오맵 후기 확인·답글", "카카오맵 정보 정비"] },
  { title: "창업 지원", items: ["홈페이지형 블로그 제작", "로고·명함 디자인", "메뉴판 제작"] },
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
    a: "업종과 상권 경쟁도에 따라 달라서 하나로 말씀드리기 어렵습니다. 계약 전 진단에서 이 상권이 어느 정도 걸리는 자리인지 먼저 말씀드리고, 매월 순위가 몇 위에서 몇 위로 움직였는지 숫자로 적어 드립니다. 단기 실행과 장기 브랜딩은 동시에 진행합니다.",
  },
  {
    q: "광고비가 비싸지는 않나요?",
    a: "싼 것이 늘 좋은 것은 아닙니다. 금액만 보고 고르면 필요한 작업이 빠지거나 필요 없는 작업이 들어가기 쉽습니다. 하랑은 불필요한 서비스를 빼고 필요한 항목에만 비용을 쓰도록 구성합니다.",
  },
  {
    q: "계약 기간은 어떻게 되나요?",
    a: "월 단위 계약이 기본이고 중도 해지 위약금도 없습니다. 다만 마케팅을 처음 하시는 분은 기초공사와 인테리어 같은 기본 세팅부터 잡아야 해서 2~3개월 이상은 진행하셔야 합니다.",
  },
];

/* 2026-11-12 시안 틀로 다시 짰다 (세부 카테고리 3차).
   머리 숫자 칸 · 정답 상자 숫자 · 10년 수치 띠는 머리 사실 줄 하나로 합쳤다. 회사 숫자는 CLAUDE.md 1-C 그대로 */
const PAINS = [
  "마케팅, 해야 하는 건 아는데 막상 하려니 너무 어렵고 귀찮습니다.",
  "광고비는 썼는데 효과는 없고, 돈만 날린 기분이에요.",
  "내 가게처럼 꼼꼼히 관리해 주는 곳, 정말 없을까요?",
];

const COMPARE = [
  { item: "담당자", general: "자주 바뀜 (이직·인수인계)", harang: "대표가 직접 관리 (처음부터 끝까지)" },
  { item: "상담 비용", general: "유료 또는 계약 압박", harang: "완전 무료 · 계약 강요 없음" },
  { item: "성과 보고", general: "업체마다 보고 기준이 다름", harang: "매월 순위 기록 · 게시 URL 리포트" },
  { item: "작업 투명성", general: "게시 위치를 확인하기 어려운 경우가 있음", harang: "게시 URL 전체 전달" },
  { item: "부적합 시", general: "계약 기간 강제 유지", harang: "성과 미달 시 전략 즉시 수정 · 중도 해지 위약금 없음" },
  { item: "순위 약속", general: "몇 위까지 올려준다고 약속", harang: "약속 대신 정해진 시각 계측 · 잰 숫자 그대로 공개" },
  { item: "최소 계약", general: "6개월~1년", harang: "월 단위 · 처음이면 2~3개월 이상" },
];

const HISTORY = [
  { year: "2014~", event: "대학생 서포터즈 활동 · 마케팅 경력 시작", note: "브랜드 홍보, 콘텐츠 제작, 현장 마케팅 경험 축적" },
  { year: "2018", event: "해병대 장교 전역 · 카페 창업 도전", note: "마케팅을 몰라 단기간 폐업. 소상공인의 아픔을 직접 경험" },
  { year: "2018~", event: "마케팅 대행사 취업 · 팀장까지 근무", note: "내부에서 목격한 허위 보고·불성실 대응에 혐오감 → 직접 창업 결심" },
  { year: "2020", event: "하랑마케팅 공식 설립 (4월 15일)", note: "'제대로 된 대행사를 만들자' · 소상공인 전문 마케팅 대행 시작" },
  { year: "2024", event: "배달 플랫폼·SNS 마케팅 서비스 추가", note: "배민·쿠팡이츠·인스타그램 전문 라인업 구축" },
  { year: "2026", event: "대표 10년 경력 누적 500건 프로젝트", note: "7년차 · 대표가 직접 관리 원칙 유지 중" },
];

const PROSE = { display: "grid", gap: 16 } as const;
const QUOTE = { margin: 0, paddingLeft: 20, borderLeft: "2px solid var(--ink)" } as const;
const SIGN = { marginTop: 8, fontSize: 15 } as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={ABOUT_LD} />
      <Header />
      <SianMain>
        <PageHead
          where="회사소개 · About Us"
          title={<>결과가 없으면<br />솔직히 말씀드립니다</>}
          lead="수많은 대행사에 실망하셨던 그 마음, 누구보다 잘 알고 있습니다. 누적 500건의 프로젝트를 함께한 대표님들이 하랑마케팅을 선택하신 이유를 솔직하게 이야기합니다."
          primary={{ href: "/contact", label: "무료 상담 신청" }}
          link={{ href: "/services", label: "서비스 상세 보기" }}
          facts={[
            { value: "10년", label: "마케팅 경력 · 서포터즈 활동부터" },
            { value: "500건", label: "누적 프로젝트 · 대표 경력 10년 합산" },
            { value: `${companyYear()}년차`, label: "2020.04.15 개업" },
            { value: "0원", label: "상담 비용 · 계약 강요 없음" },
          ]}
        />

        {/* AEO · 회사 · 대표 정체성 한 줄 정답 (speakable) */}
        <AnswerRow
          question="하랑마케팅 대표는 누구이고, 회사는 어떤 곳인가요?"
          answer={`${ANSWER_SENTENCES.whoWeAre} 대표 전태영은 해병대 장교로 복무 후 2018년 전역했고, 직접 카페를 창업해 실패한 경험과 마케팅 대행사 팀장 경력을 바탕으로 2020년 4월 하랑마케팅을 설립했습니다. 매장을 직접 운영해 본 사람이 마케팅을 맡는다는 것이 하랑마케팅의 출발점입니다.`}
        />

        <Section soft title="혹시 이런 고민 중이신가요?">
          <LineList items={PAINS} />
        </Section>

        <Section
          eyebrow="대표 스토리"
          title="실패해 본 마케터가 성공하는 길을 가장 잘 압니다"
          desc={<>전태영 · 하랑마케팅 대표<br />해병대 장교 출신 · 마케팅 경력 10년 · {companyYear()}년차 대표 · 담당 지역 전국</>}
        >
          {SHOW_PHOTO && (
            <PhotoPlaceholder
              label="대표 전태영 프로필 사진"
              hint="정장 또는 캐주얼 정장 / 밝은 배경 / 세로형 인물 사진"
              width="w-full"
              height="h-64"
              className="rounded-2xl"
            />
          )}
          <div className={s.answer} style={PROSE}>
            <p>대학교 시절 서포터즈 활동을 시작으로 마케팅의 길에 들어섰고, <strong className="font-semibold">2018년 해병대 장교로 전역한 후 전 재산을 털어 카페를 창업했다가 실패의 쓴맛을 봤습니다.</strong> 마케팅을 제대로 몰랐던 저는 금방 망했습니다.</p>
            <p>이후 마케팅 대행사에 취업해 팀장까지 올라갔습니다. 그런데 내부에서 보이는 현실은 충격이었습니다. <strong className="font-semibold">고객을 대충 대하고, 성과도 없으면서 돈만 받는 방식.</strong> 그 모습에 혐오감을 느꼈고, &lsquo;내가 직접 제대로 된 대행사를 만들자&rsquo;는 결심으로 2020년 4월 하랑마케팅을 설립했습니다.</p>
            <p>카페를 직접 운영해 봤고, 대행사의 내부도 봤기에 <strong className="font-semibold">대표님의 답답함과 대행사의 문제를 누구보다 잘 압니다.</strong> 그래서 하랑은 다릅니다.</p>
            <p>하랑이라는 이름은 순우리말로 <strong className="font-semibold">하늘 아래 높은 뜻을 가진 사람들의 모임</strong>이라는 뜻입니다.</p>
            <blockquote style={QUOTE}>
              <p>&lsquo;음식점은 맛이 본질이고, 마케팅은 그 본질을 빛나게 하는 도구입니다. 본질이 훌륭하다면, 그 가치를 세상에 알리는 일은 전문가에게 맡겨주세요.&rsquo;</p>
              <p className="font-semibold" style={SIGN}>대표 전태영</p>
            </blockquote>
          </div>
        </Section>

        <Section soft title="왜 하랑마케팅을 선택해야 할까요?" desc="미사여구보다, 대표님이 가장 안심할 수 있는 5가지 약속을 드립니다">
          <ItemList one items={PROMISES.map((p) => ({ title: p.title, desc: `${p.desc} (${p.badge})` }))} />
        </Section>

        <Section
          title="하랑을 통하면 원스텝으로 해결됩니다"
          desc="복잡한 마케팅 채널, 필요한 것만 골라 내 업체에 맞게 설계합니다"
          more={{ href: "/services", label: "서비스 상세 보기" }}
        >
          <ItemList items={SERVICES_LIST.map((x) => ({ title: x.title, desc: x.items.join(" · ") }))} />
        </Section>

        {/* 유튜브 최신 영상 (채널 RSS 로 자동 갱신) */}
        <YouTubeSection variant="latest" />

        <Section soft eyebrow="대표의 편지" title="광고비는 나가는데 전화는 울리지 않던 달, 저도 겪었습니다">
          <div className={s.answer} style={PROSE}>
            <p>가게 문을 닫고 그날 매출을 정산하다 보면 압니다. 오늘 들어온 손님 중에 처음 온 사람이 몇인지. 그 숫자가 며칠째 그대로일 때의 기분을요. 저는 그게 맛 때문인 줄 알았습니다. 아니었습니다. 그 골목에 우리 가게가 있다는 걸 아무도 몰랐을 뿐입니다.</p>
            <p>그때 맡겨봤던 대행사는 물어봐야 답이 왔습니다. 이번 달에 무엇을 했고 무엇이 달라졌는지는 끝까지 알 수 없었습니다. 나중에 그 안으로 들어가 일해보고 나서야 알았습니다. <strong className="font-semibold">답을 안 준 게 아니라, 보여드릴 것이 없었던 겁니다.</strong></p>
            <p>그래서 하랑은 순서를 뒤집었습니다. 물어보시기 전에 먼저 말씀드리고, 안 된 것은 안 됐다고 적습니다. 순위가 내려간 주에도 그대로 보내드립니다. 좋은 소식만 골라 보내면 그건 보고가 아니라 광고입니다.</p>
            <p>전화를 받는 사람도 접니다. 상담한 사람이 그대로 끝까지 맡습니다. 계약하자마자 처음 보는 담당자로 바뀌는 일은 없습니다.</p>
            <blockquote style={QUOTE}>
              <p>오늘 계약하지 않으셔도 됩니다. 지금 어디에서 돈이 새고 있는지만 듣고 가셔도 괜찮습니다. 대표님이 지금 넣고 계신 그 돈이, 제가 카페에 넣었던 돈과 다르지 않다는 걸 아니까요.</p>
              <p className="font-semibold" style={SIGN}>하랑마케팅 대표 전태영</p>
            </blockquote>
          </div>
        </Section>

        <Section
          eyebrow="Why Harang"
          title="대행사, 어디를 골라야 할까요?"
          desc="실제 소상공인 대표님들이 대행사 선택에서 가장 많이 겪는 문제와 하랑의 차이를 정직하게 비교했습니다."
        >
          <Table
            label="일반 대행사와 하랑마케팅 비교"
            head={["항목", "일반 대행사", "하랑마케팅"]}
            rows={COMPARE.map((r) => [r.item, r.general, <span key="h" className="font-semibold">{r.harang}</span>])}
          />
        </Section>

        <Section soft title="하랑마케팅 걸어온 길">
          <ItemList one items={HISTORY.map((h) => ({ title: `${h.year} · ${h.event}`, desc: h.note }))} />
        </Section>

        <Section id="faq" eyebrow="자주 묻는 질문" title="상담 전 미리 확인하세요" more={{ href: "/faq", label: "전체 질문 보기" }}>
          <QuestionList items={FAQS} />
        </Section>

        {/* CI 안내 · 지금은 꺼 둠 (SHOW_CI_GUIDE) */}
        {SHOW_CI_GUIDE && (<>
        {/* ══ CI 섹션 ══ */}
        <section className="py-16 md:py-24 bg-white border-t border-gray-100" id="ci">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">

            {/* 헤더 */}
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px] bg-[var(--w-primary)]" />
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--w-primary-strong)]">Corporate Identity</span>
                <div className="w-6 h-[2px] bg-[var(--w-primary)]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3" style={{ letterSpacing: "-0.03em" }}>CI 소개</h2>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-2xl">
                하랑마케팅의 CI는 <strong className="text-gray-700">하늘 아래 높은 뜻을 가진 사람들의 모임</strong>이라는 이름의 뜻을 담아,
                두 사람이 서로를 이어주는 모습을 형상화했습니다.
                대표님과 함께 성장하는 하랑마케팅의 철학을 상징합니다.
              </p>
            </div>

            {/* ── 로고타입 — 가로형 ── */}
            <div className="mb-16">
              <h3 className="text-base font-black text-gray-900 mb-1">로고타입 · 가로형</h3>
              <p className="text-sm text-gray-500 mb-8">기본 사용 형태입니다. 넓은 지면 및 디지털 환경, 명함, 인쇄물 등에 사용합니다.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 컬러 */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 flex items-center justify-center h-44 px-10 py-6">
                    <img src="/ci/ci-logo-h-color.jpg" alt="하랑마케팅 가로형 로고 컬러" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-700">컬러</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">기본 사용 버전</p>
                  </div>
                </div>
                {/* 블루 배경 */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-center h-44 px-10 py-6" style={{ background: "var(--w-primary)" }}>
                    <img src="/ci/ci-logo-h-blue.jpg" alt="하랑마케팅 가로형 로고 블루배경" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-700">블루 배경</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">컬러 배경 사용 시</p>
                  </div>
                </div>
                {/* 흑백 */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 flex items-center justify-center h-44 px-10 py-6">
                    <img src="/ci/ci-logo-h-bw.jpg" alt="하랑마케팅 가로형 로고 흑백" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-700">흑백</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">흑백 인쇄 시</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 로고타입 — 세로형 ── */}
            <div className="mb-16">
              <h3 className="text-base font-black text-gray-900 mb-1">로고타입 · 세로형</h3>
              <p className="text-sm text-gray-500 mb-8">정방형 지면, SNS 프로필, 앱 아이콘 등 세로 배치가 적합한 환경에 사용합니다.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 flex items-center justify-center h-64 p-8">
                    <img src="/ci/ci-logo-v-en.jpg" alt="하랑마케팅 세로형 영문 로고" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-700">영문형</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Harang 영문 로고타입</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 flex items-center justify-center h-64 p-8">
                    <img src="/ci/ci-logo-v-ko.jpg" alt="하랑마케팅 세로형 국문 로고" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-700">국문형</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">하랑 국문 로고타입</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 슬로건 ── */}
            <div className="mb-16">
              <h3 className="text-base font-black text-gray-900 mb-1">슬로건</h3>
              <p className="text-sm text-gray-500 mb-8">하랑마케팅의 핵심 가치를 담은 브랜드 슬로건입니다.</p>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center py-12 px-6">
                <div className="text-center">
                  <p className="text-2xl md:text-4xl font-black text-[var(--w-primary)] tracking-tight break-keep mb-3">직접 확인하고 솔직하게 설명하는 소상공인 마케팅</p>
                  <p className="text-sm text-gray-500">하랑마케팅이 일하는 방식을 한 줄로 담았습니다</p>
                </div>
              </div>
            </div>

            {/* ── 브랜드 색상 ── */}
            <div className="mb-10">
              <h3 className="text-base font-black text-gray-900 mb-1">브랜드 색상</h3>
              <p className="text-sm text-gray-500 mb-8">하랑마케팅의 공식 브랜드 컬러입니다. CI 적용 시 아래 색상 규정을 준수해야 합니다.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* CMYK 는 화면 색을 단순 환산한 참고값이다. 인쇄하거나 SHOW_CI_GUIDE 를 켜기 전에 인쇄소 기준으로 다시 확인한다. */}
                {[
                  {
                    name: "Harang Blue",
                    hex: "#0066FF",
                    rgb: "RGB 0, 102, 255",
                    cmyk: "CMYK 100, 60, 0, 0",
                    desc: "신뢰, 전문성, 성장, 안정감",
                    dark: true,
                  },
                  {
                    name: "Harang Light Blue · 표식 띠 전용",
                    hex: "#69A5FF",
                    rgb: "RGB 105, 165, 255",
                    cmyk: "CMYK 59, 35, 0, 0",
                    desc: "따뜻함, 동반, 함께, 부드러움",
                    dark: false,
                  },
                  {
                    name: "Harang Dark",
                    hex: "#001536",
                    rgb: "RGB 0, 21, 54",
                    cmyk: "CMYK 100, 61, 0, 79",
                    desc: "권위, 전문성, 신중함, 무게감",
                    dark: true,
                  },
                ].map((c) => (
                  <div key={c.hex} className="rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="h-32 flex items-end p-4" style={{ background: c.hex }}>
                      <span className={`text-sm font-black tracking-wider ${c.dark ? "text-white" : "text-gray-900"}`}>{c.hex}</span>
                    </div>
                    <div className="p-4">
                      <p className="font-black text-sm text-gray-900 mb-1">{c.name}</p>
                      <p className="text-[11px] text-gray-500 mb-0.5">{c.rgb}</p>
                      <p className="text-[11px] text-gray-500 mb-2">{c.cmyk}</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
        </>)}

        <CloseBand
          title="더 궁금한 것이 있으신가요?"
          text="카카오톡 문의는 24시간 접수하고, 하랑 대표가 직접 답변드립니다"
          primary={{ href: "/contact", label: "무료 상담 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
