import Link from "next/link";
import { ArrowRight, Bot, FileText, Globe2, LayoutGrid, MapPin, MessageCircle, Phone, Search, ShieldCheck } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import { SITE, breadcrumbLd, faqLd, webPageLd, updatedAt } from "../../lib/seo";
import { HP_DATA_DATE, HP_STATS } from "../../lib/homepage-portfolio";
import HomepageGallery from "./HomepageGallery";

const PATH = "/services/homepage";
const TITLE = "홈페이지 제작, 업종별 시안부터 보고 고르세요";
const DESC = "업종 45개 · 시안 274개를 미리 만들어 두었습니다. 네이버 통합검색과 AI 답변 노출 기본 세팅까지 넣어 15영업일 안에 대표님 명의로 넘겨 드립니다.";

/* 가격 : 홈페이지 공장 data/pricing.json 과 같은 숫자 (2026-10-04 · 근거 data/price_market.md). 바꾸면 C 결재 */
const TIERS = [
  { name: "라이트", build: "1,100,000원", monthly: "월 50,000원", pages: "메인 + 서브 3장", points: ["문의 전환 동선 포함", "검색 노출 기본 세팅", "수정 월 1회 (관리 선택 시)"] },
  { name: "스탠다드", build: "1,650,000원", monthly: "월 100,000원", pages: "메인 + 서브 5장", points: ["관리자 화면 · 블로그 연동", "키워드 노출 리포트 (관리)", "수정 월 3회 (관리 선택 시)"], rec: true },
  { name: "프리미엄", build: "2,200,000원", monthly: "월 200,000원", pages: "메인 + 서브 10장", points: ["새 콘텐츠 페이지 월 1장 (관리)", "AI 답변 노출 점검 (관리)", "수정 월 10회 (관리 선택 시)"] },
];

const INCLUDED = [
  { icon: Search, title: "검색 노출 기본 세팅", desc: "페이지마다 제목 · 설명 · 구조화 데이터 · 사이트맵 · RSS 를 넣고 네이버 서치어드바이저와 구글 서치콘솔에 등록합니다." },
  { icon: Bot, title: "AI 답변 노출 준비", desc: "질문형 답변 블록과 업체 정보 요약(llms.txt)을 넣어 AI 검색이 업체를 설명할 때 그대로 가져갈 수 있게 합니다." },
  { icon: Phone, title: "문의 전환 동선", desc: "휴대폰 화면 아래에 전화 · 문자 버튼을 고정해, 보던 손님이 바로 연락할 수 있게 만듭니다." },
  { icon: MapPin, title: "플레이스 정보 대조", desc: "홈페이지와 네이버 플레이스의 상호 · 주소 · 전화가 한 글자도 다르지 않게 맞춥니다." },
  { icon: FileText, title: "원고 · 사진 연결", desc: "업종에 맞는 문구 초안을 같이 만들고, 현장 사진은 보정만 해서 올립니다. 연출 사진을 실물처럼 쓰지 않습니다." },
  { icon: ShieldCheck, title: "대표님 명의 · 보안 설정", desc: "도메인과 서버는 대표님 명의로 등록합니다. 보안 헤더와 수집 차단 설정까지 넣어 넘겨 드립니다." },
];

const STEPS = [
  { day: "1~3일", title: "자료 받기", desc: "사업자 정보 · 도메인 · 현장 사진 원본" },
  { day: "4~6일", title: "시안 고르기", desc: "업종 시안 2~3개 중 선택 · 구성 확정" },
  { day: "7~12일", title: "제작", desc: "문구 · 사진 · 페이지 · 검색 세팅" },
  { day: "13~15일", title: "점검 · 오픈", desc: "모바일 · 문의 버튼 · 정보 대조 · 등록" },
];

const FAQ = [
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
              업종과 무드를 고르면 그 조합의 시안이 나옵니다. 실사형은 구조부터 다른 업체형 레이아웃이고, 카드를 누르면 시안이 새 창으로 열립니다.
            </p>
            <HomepageGallery />
          </section>

          {/* 포함 사항 */}
          <section className="mt-16">
            <h2 className="w-heading-2" style={{ color: "var(--w-label-strong)" }}>제작에 기본으로 들어가는 것</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INCLUDED.map((it) => (
                <div key={it.title} className="w-card p-5 md:p-6">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--w-primary)" }}>
                    <it.icon size={16} strokeWidth={2.5} color="#fff" />
                  </span>
                  <p className="w-title-3 mt-3" style={{ color: "var(--w-label-strong)" }}>{it.title}</p>
                  <p className="w-body-2 mt-1.5" style={{ color: "var(--w-label-alt)" }}>{it.desc}</p>
                </div>
              ))}
            </div>
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
            <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="w-card p-5">
                  <p className="w-caption-1 w-num font-bold" style={{ color: "var(--w-primary)" }}>{String(i + 1).padStart(2, "0")} · {s.day}</p>
                  <p className="w-title-3 mt-1" style={{ color: "var(--w-label-strong)" }}>{s.title}</p>
                  <p className="w-body-2 mt-1" style={{ color: "var(--w-label-alt)" }}>{s.desc}</p>
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
