import Link from "next/link";
import { ArrowRight, Bot, Camera, FileText, Globe2, Image as ImageIcon, ImageOff, LayoutGrid, LayoutTemplate, MapPin, MessageCircle, Phone, Search, ShieldCheck, Smartphone, WandSparkles } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import { SITE, breadcrumbLd, faqLd, webPageLd, updatedAt } from "../../lib/seo";
import { HP_DATA_DATE, HP_STATS } from "../../lib/homepage-portfolio";
import HomepageGallery from "./HomepageGallery";

const PATH = "/services/homepage";
const TITLE = "홈페이지 제작, 업종별 시안부터 보고 고르세요";
const DESC = `업종 ${HP_STATS.industries}개 · 시안 ${HP_STATS.drafts}개를 미리 만들어 두었습니다. 네이버 통합검색과 AI 답변 노출 기본 세팅까지 넣어 15영업일 안에 대표님 명의로 넘겨 드립니다.`;

/* 가격 : 홈페이지 공장 data/pricing.json 과 같은 숫자 (2026-10-04 · 근거 data/price_market.md). 바꾸면 C 결재 */
const TIERS = [
  { name: "라이트", build: "1,100,000원", monthly: "월 50,000원", pages: "메인 + 서브 3장", points: ["문의 전환 동선 포함", "검색 노출 기본 세팅", "수정 월 1회 (관리 선택 시)"] },
  { name: "스탠다드", build: "1,650,000원", monthly: "월 100,000원", pages: "메인 + 서브 5장", points: ["관리자 화면 · 블로그 연동", "키워드 노출 리포트 (관리)", "수정 월 3회 (관리 선택 시)"], rec: true },
  { name: "프리미엄", build: "2,200,000원", monthly: "월 200,000원", pages: "메인 + 서브 10장", points: ["새 콘텐츠 페이지 월 1장 (관리)", "AI 답변 노출 점검 (관리)", "수정 월 10회 (관리 선택 시)"] },
];

/** desc 안의 bold 문장만 font-semibold 로 굵게 (발주서 '굵게 처리할 문장' 표) */
type Card = { icon: typeof Search; title: string; desc: string; bold?: string };

function Emph({ text, bold }: { text: string; bold?: string }) {
  if (!bold || !text.includes(bold)) return <>{text}</>;
  const [before, ...rest] = text.split(bold);
  return (
    <>
      {before}
      <span className="font-semibold" style={{ color: "var(--w-label-strong)" }}>{bold}</span>
      {rest.join(bold)}
    </>
  );
}

/* 발주 2026-10-04 루미 · 시안은 판매용 견본 · 사진 안내 */
const SAMPLE_NOTES: Card[] = [
  { icon: LayoutTemplate, title: "판매용으로 미리 만든 시안", desc: "하랑마케팅이 업종별로 직접 만들어 둔 견본 화면입니다. 실제 고객 사이트가 아니며 업체명 · 연락처 · 수치는 모두 가상입니다.", bold: "실제 고객 사이트가 아니며" },
  { icon: ImageIcon, title: "사진은 AI로 만든 예시", desc: "업종 분위기를 보여 드리려고 넣은 예시 사진입니다. 대표님 홈페이지에는 이 사진을 쓰지 않고, 대표님 매장과 작업 사진으로 바꿔 넣습니다.", bold: "대표님 홈페이지에는 이 사진을 쓰지 않고" },
  { icon: WandSparkles, title: "고르신 시안을 대표님 업체로", desc: "마음에 드는 시안을 고르시면 구조와 분위기는 살리고 상호 · 문구 · 사진 · 서비스 메뉴를 대표님 업체에 맞게 다시 씁니다. 목록에 없는 업종도 가장 가까운 시안에서 시작합니다." },
];

const PHOTO_NOTES: Card[] = [
  { icon: Smartphone, title: "휴대폰 사진이면 충분합니다", desc: "어떤 장면을 어떻게 찍으면 되는지 촬영 가이드를 보내 드립니다. 매장 · 작업 · 외관 몇 장이면 첫 화면을 채울 수 있습니다." },
  { icon: Camera, title: "촬영이 필요하면 따로 상의합니다", desc: "직접 찍기 어려우시면 하랑 촬영을 따로 견적으로 안내해 드립니다. 촬영 없이 먼저 열고 사진은 나중에 바꿔도 됩니다." },
  { icon: ImageOff, title: "사진 자리는 비워 두고 엽니다", desc: "사진이 늦어지면 그 자리는 깔끔하게 비워 두고 먼저 오픈합니다. 실제와 다른 사진으로 채우지 않습니다.", bold: "실제와 다른 사진으로 채우지 않습니다." },
];

const INCLUDED: Card[] = [
  { icon: Search, title: "검색 노출 기본 세팅", desc: "페이지마다 제목 · 설명 · 구조화 데이터 · 사이트맵 · RSS 를 넣고 네이버 서치어드바이저와 구글 서치콘솔에 등록합니다." },
  { icon: Bot, title: "AI 답변 노출 준비", desc: "질문형 답변 블록과 업체 정보 요약(llms.txt)을 넣어 AI 검색이 업체를 설명할 때 그대로 가져갈 수 있게 합니다." },
  { icon: Phone, title: "문의 전환 동선", desc: "휴대폰 화면 아래에 전화 · 문자 버튼을 고정해, 보던 손님이 바로 연락할 수 있게 만듭니다." },
  { icon: MapPin, title: "플레이스 정보 대조", desc: "홈페이지와 네이버 플레이스의 상호 · 주소 · 전화가 한 글자도 다르지 않게 맞춥니다." },
  { icon: FileText, title: "원고 · 사진 연결", desc: "업종에 맞는 문구 초안을 같이 만들고, 현장 사진은 보정만 해서 올립니다. 연출 사진을 실물처럼 쓰지 않습니다." },
  { icon: ShieldCheck, title: "대표님 명의 · 보안 설정", desc: "도메인과 서버는 대표님 명의로 등록합니다. 보안 헤더와 수집 차단 설정까지 넣어 넘겨 드립니다." },
];

const STEPS: { title: string; desc: string; bold?: string }[] = [
  { title: "상담", desc: "업종 · 지역 · 원하는 분위기를 듣고 맞는 시안을 함께 고릅니다." },
  { title: "자료 받기", desc: "상호 · 전화 · 영업시간 · 서비스 메뉴 · 사진을 받습니다. 빈 곳은 질문지로 채웁니다." },
  { title: "초안", desc: "고르신 시안 위에 대표님 업체 정보를 넣은 초안을 보내 드립니다. 초안에는 확인 전이라는 표시가 붙습니다.", bold: "확인 전이라는 표시가 붙습니다." },
  { title: "수정 · 검수", desc: "수정 요청을 반영하고 검색 기본 세팅 · 모바일 화면 · 보안 설정을 검사기로 확인합니다." },
  { title: "오픈 · 인계", desc: "대표님 명의 도메인으로 열고 관리 방법을 알려 드립니다. 월 관리는 선택입니다." },
];

const FAQ = [
  { q: "시안 속 업체는 실제로 있는 곳인가요?", a: "아닙니다. 판매용으로 만든 견본이라 업체명 · 연락처 · 수치는 모두 가상입니다." },
  { q: "시안 사진을 그대로 쓰나요?", a: "쓰지 않습니다. 시안 사진은 AI로 만든 예시이고, 대표님 홈페이지에는 대표님 매장과 작업 사진을 넣습니다." },
  { q: "가게 사진이 하나도 없는데 괜찮나요?", a: "괜찮습니다. 촬영 가이드를 보내 드리고, 휴대폰으로 찍으신 사진으로 시작합니다. 사진이 늦어지면 그 자리는 비워 두고 먼저 엽니다." },
  { q: "우리 업종이 목록에 없으면요?", a: "가장 가까운 시안에서 시작해 대표님 업종에 맞게 구성과 문구를 새로 짭니다." },
  { q: "시안은 그대로 쓰나요?", a: "고르신 시안을 바탕으로 대표님 업체의 상호 · 사진 · 문구로 바꿔 만듭니다. 시안 속 업체명과 수치는 예시라 그대로 쓰지 않습니다." },
  { q: "제작 기간은 얼마나 걸리나요?", a: "계약금 입금일부터 15영업일입니다. 사진과 정보가 늦게 오면 그만큼 늦어집니다." },
  { q: "도메인과 서버는 누구 명의인가요?", a: "대표님 명의로 등록하고 계정도 대표님이 가지십니다. 저희와 계약이 끝나도 홈페이지는 그대로 대표님 것입니다." },
  { q: "월 관리는 꼭 해야 하나요?", a: "선택입니다. 오픈 후 3개월은 오류 수정이 무상이고, 월 관리는 그 다음 달부터 월 단위로 고르실 수 있습니다." },
  { q: "검색 순위를 올려 주나요?", a: "순위는 약속하지 않습니다. 검색에 잡히기 위한 기본 세팅을 넣고, 관리를 맡기시면 잰 숫자를 날짜와 함께 보고드립니다." },
];

const LD = [
  webPageLd({ path: PATH, type: "CollectionPage", name: `${TITLE} | 하랑마케팅`, description: DESC, dateModified: updatedAt(PATH, HP_DATA_DATE) }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "홈페이지 제작", path: PATH },
  ]),
  faqLd(FAQ, `${SITE.base}${PATH}`),
];

/** '제작에 기본으로 들어가는 것' 과 같은 카드 : w-card · 단색 primary 아이콘 박스 · 흰 아이콘 */
function CardGrid({ items }: { items: Card[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <div key={it.title} className="w-card p-5 md:p-6">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--w-primary)" }}>
            <it.icon size={16} strokeWidth={2.5} color="#fff" />
          </span>
          <p className="w-title-3 mt-3" style={{ color: "var(--w-label-strong)" }}>{it.title}</p>
          <p className="w-body-2 mt-1.5" style={{ color: "var(--w-label-alt)" }}>
            <Emph text={it.desc} bold={it.bold} />
          </p>
        </div>
      ))}
    </div>
  );
}

export default function HomepageServicePage() {
  const stats = [
    { label: "시안", value: HP_STATS.drafts, unit: "개" },
    { label: "업종", value: HP_STATS.industries, unit: "종" },
    { label: "디자인", value: HP_STATS.designs, unit: "가지" },
    { label: "제작 기간", value: 15, unit: "영업일" },
  ];
  return (
    <>
      <Header />
      <main className="min-h-screen pt-[104px] md:pt-[108px]" style={{ background: "var(--w-bg-alt)" }}>
        <JsonLd data={LD} />
        <div className="mx-auto max-w-[1100px] px-5 py-12 md:py-16">
          {/* 소개 */}
          <section className="mb-10">
            <span className="w-chip w-chip-blue">
              <Globe2 size={12} strokeWidth={2.5} />
              HOMEPAGE
            </span>
            <h1 className="w-heading-1 mt-3" style={{ color: "var(--w-label-strong)" }}>
              업종에 맞는 홈페이지,
              <br />
              시안부터 보고 고르세요
            </h1>
            <p className="w-body-1 mt-3 max-w-[680px]" style={{ color: "var(--w-label-alt)" }}>
              네이버가 통합검색에서 홈페이지를 같이 보여 주는 쪽으로 바뀌고 있습니다. 업종별로 시안을 미리 만들어 두었으니
              아래에서 직접 눌러 보시고, 마음에 드는 시안을 고르시면 대표님 업체로 바꿔 15영업일 안에 넘겨 드립니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href="#gallery" className="w-btn w-btn-primary min-h-[44px]">
                <LayoutGrid size={16} strokeWidth={2.5} />
                시안 구경하기
              </a>
              <a href={SITE.kakaoChat} target="_blank" rel="noopener noreferrer" className="w-btn w-btn-secondary min-h-[44px]">
                <MessageCircle size={16} strokeWidth={2.5} />
                카카오톡 상담
              </a>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="w-card px-4 py-4 md:px-5 md:py-5">
                  <p className="w-caption-1" style={{ color: "var(--w-label-assistive)" }}>{s.label}</p>
                  <p className="w-title-1 w-num mt-1" style={{ color: "var(--w-label-strong)" }}>
                    {s.value}
                    <span className="w-label-2 ml-0.5" style={{ color: "var(--w-label-alt)" }}>{s.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 시안 갤러리 */}
          <section id="gallery" className="scroll-mt-28">
            <h2 className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>업종별 시안</h2>
            <p className="w-body-2 mt-2 mb-6 max-w-[680px]" style={{ color: "var(--w-label-alt)" }}>
              업종과 무드를 고르면 그 조합의 시안이 나옵니다. 같은 병원이라도 피부과 · 치과 · 성형외과 · 안과처럼 진료 과목마다, 같은 자동차라도 정비 · 판금도색 · PPF · 썬팅처럼 일마다 시안을 따로 만들어 두었습니다. 카드를 누르면 시안이 새 창으로 열립니다.
            </p>
            <HomepageGallery />
          </section>

          {/* 시안은 견본 (발주 2026-10-04) */}
          <section className="mt-16">
            <h2 className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>시안은 이렇게 만든 견본입니다</h2>
            <CardGrid items={SAMPLE_NOTES} />
          </section>

          {/* 사진 안내 (발주 2026-10-04) */}
          <section className="mt-16">
            <h2 className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>사진이 없어도 시작할 수 있습니다</h2>
            <CardGrid items={PHOTO_NOTES} />
          </section>

          {/* 포함 사항 */}
          <section className="mt-16">
            <h2 className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>제작에 기본으로 들어가는 것</h2>
            <CardGrid items={INCLUDED} />
          </section>

          {/* 가격 */}
          <section className="mt-16">
            <h2 className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>제작 · 관리 가격</h2>
            <p className="w-body-2 mt-2" style={{ color: "var(--w-label-alt)" }}>
              제작비는 부가세 포함, 월 관리비는 부가세 별도입니다. 도메인 · 서버 실비(연 수만 원)는 대표님 명의로 직접 결제하십니다.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {TIERS.map((t) => (
                <div key={t.name} className="w-card flex flex-col p-5 md:p-6" style={t.rec ? { outline: "2px solid var(--w-primary)" } : undefined}>
                  <div className="flex items-center gap-2">
                    <p className="w-title-2" style={{ color: "var(--w-label-strong)" }}>{t.name}</p>
                    {t.rec && <span className="w-chip w-chip-blue">상담 기본</span>}
                  </div>
                  <p className="w-caption-1 mt-1" style={{ color: "var(--w-label-alt)" }}>{t.pages}</p>
                  <p className="w-title-1 w-num mt-3" style={{ color: "var(--w-label-strong)" }}>{t.build}</p>
                  <p className="w-label-1 w-num mt-1" style={{ color: "var(--w-primary)" }}>관리 {t.monthly}</p>
                  <ul className="mt-4 space-y-1.5">
                    {t.points.map((p) => (
                      <li key={p} className="w-body-2" style={{ color: "var(--w-label-alt)" }}>· {p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 진행 순서 */}
          <section className="mt-16">
            <h2 className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>15영업일 진행 순서</h2>
            <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="w-card p-5">
                  <p className="w-caption-1 w-num font-bold" style={{ color: "var(--w-primary)" }}>{i + 1}단계</p>
                  <p className="w-title-3 mt-1" style={{ color: "var(--w-label-strong)" }}>{s.title}</p>
                  <p className="w-body-2 mt-1" style={{ color: "var(--w-label-alt)" }}>
                    <Emph text={s.desc} bold={s.bold} />
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* 자주 묻는 질문 (FAQPage 스키마와 같은 내용) */}
          <section className="mt-16">
            <h2 className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>자주 묻는 질문</h2>
            <div className="mt-6 space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="w-card p-5">
                  <summary className="w-title-3 cursor-pointer" style={{ color: "var(--w-label-strong)" }}>{f.q}</summary>
                  <p className="w-body-2 mt-2" style={{ color: "var(--w-label-alt)" }}>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* 상담 */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-[16px] px-7 py-8" style={{ background: "var(--w-label-strong)" }}>
            <div>
              <p className="w-title-2" style={{ color: "#fff" }}>마음에 드는 시안이 있으세요?</p>
              <p className="w-body-2 mt-1.5" style={{ color: "var(--w-label-disable)" }}>시안 이름을 알려 주시면 대표님 업체로 바꾼 초안을 먼저 보여 드립니다</p>
            </div>
            <Link href="/contact" className="w-btn w-btn-primary min-h-[44px]">
              상담 신청
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
