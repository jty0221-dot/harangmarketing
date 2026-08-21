import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Check, Star, TrendingUp, Users, Phone, Search, Sparkles, ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "디자인 미리보기 — 하랑마케팅",
  robots: { index: false, follow: false },
};

/**
 * 디자인 시스템 미리보기 (비공개 · 검색 제외)
 *
 * 원티드 디자인 시스템에서 추출한 토큰을 하랑 홈페이지에 적용하면
 * 어떻게 보이는지 확인하는 페이지다. 실제 서비스 화면은 바뀌지 않는다.
 */

const BLUE = [
  ["50", "#F7FBFF"], ["100", "#EAF2FE"], ["200", "#C9DEFE"], ["300", "#9EC5FF"],
  ["400", "#69A5FF"], ["500", "#4F95FF"], ["600", "#3385FF"], ["700", "#1A75FF"],
  ["Primary", "#0066FF"], ["800", "#005EEB"], ["900", "#0054D1"], ["950", "#003E9C"],
];
const NEUTRAL = [
  ["50", "#F7F7F8"], ["100", "#F4F4F5"], ["200", "#EAEBEC"], ["300", "#E1E2E4"],
  ["400", "#C2C4C8"], ["500", "#989BA2"], ["600", "#70737C"], ["700", "#46474C"],
  ["800", "#2E2F33"], ["900", "#171719"], ["950", "#0F0F10"],
];
const SEMANTIC = [
  ["Danger", "#FF4242"], ["Success", "#00BF40"], ["Warning", "#FF9200"],
];

const TYPE = [
  ["Display 2", "w-display-2", "36 / 48"],
  ["Heading 1", "w-heading-1", "28 / 38"],
  ["Heading 2", "w-heading-2", "24 / 34"],
  ["Title 1", "w-title-1", "22 / 30"],
  ["Title 2", "w-title-2", "20 / 28"],
  ["Title 3", "w-title-3", "18 / 26"],
  ["Body 1", "w-body-1", "16 / 24"],
  ["Body 2", "w-body-2", "15 / 22"],
  ["Label 1", "w-label-1", "14 / 20"],
  ["Label 2", "w-label-2", "13 / 18"],
  ["Caption 1", "w-caption-1", "12 / 16"],
];

function Section({ id, title, desc, children }: { id: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-14 scroll-mt-24">
      <h2 className="w-title-1" style={{ color: "var(--w-text)" }}>{title}</h2>
      {desc && <p className="w-body-2 mt-1.5" style={{ color: "var(--w-text-muted)" }}>{desc}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div>
      <div
        className="h-14 rounded-[10px]"
        style={{ background: hex, border: "1px solid rgba(0,0,0,0.06)" }}
      />
      <p className="w-caption-1 mt-1.5 font-bold" style={{ color: "var(--w-text-sub)" }}>{name}</p>
      <p className="w-caption-1 w-num" style={{ color: "var(--w-text-assist)" }}>{hex}</p>
    </div>
  );
}

export default function WdsPreviewPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--w-bg-alt)" }}>
      {/* 미리보기 안내 바 */}
      <div style={{ background: "var(--w-text)" }}>
        <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-between gap-2 px-6 py-3">
          <p className="w-label-2" style={{ color: "#fff" }}>
            디자인 미리보기 · 실제 홈페이지에는 아직 적용되지 않았습니다
          </p>
          <Link href="/" className="w-caption-1 hover:underline" style={{ color: "var(--w-text-disabled)" }}>
            홈으로
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] px-6 py-12">
        <header className="mb-12">
          <p className="w-label-2" style={{ color: "var(--w-primary)" }}>Harang Design System</p>
          <h1 className="w-display-2 mt-2" style={{ color: "var(--w-text)" }}>
            홈페이지 리디자인 미리보기
          </h1>
          <p className="w-body-1 mt-3 max-w-[640px]" style={{ color: "var(--w-text-muted)" }}>
            원티드 디자인 시스템에서 추출한 실제 토큰(색상·타이포·그림자)을 기준으로 정리했습니다.
            아래 구성으로 홈페이지 전체를 맞추면 어떻게 보이는지 확인해 보세요.
          </p>
        </header>

        {/* 1. 색상 */}
        <Section id="color" title="색상" desc="Primary는 원티드 블루 #0066FF. 뉴트럴은 푸른기가 도는 쿨그레이입니다.">
          <p className="w-label-1 mb-2 font-bold" style={{ color: "var(--w-text-sub)" }}>Blue</p>
          <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {BLUE.map(([n, h]) => <Swatch key={h} name={n} hex={h} />)}
          </div>
          <p className="w-label-1 mb-2 font-bold" style={{ color: "var(--w-text-sub)" }}>Neutral</p>
          <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {NEUTRAL.map(([n, h]) => <Swatch key={h} name={n} hex={h} />)}
          </div>
          <p className="w-label-1 mb-2 font-bold" style={{ color: "var(--w-text-sub)" }}>Semantic</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {SEMANTIC.map(([n, h]) => <Swatch key={h} name={n} hex={h} />)}
          </div>
        </Section>

        {/* 2. 타이포 */}
        <Section id="type" title="타이포그래피" desc="Pretendard 기준. 크기 / 행간(px)">
          <div className="w-card divide-y" style={{ borderColor: "var(--w-line)" }}>
            {TYPE.map(([label, cls, size]) => (
              <div key={label} className="flex flex-wrap items-baseline justify-between gap-3 px-6 py-4">
                <span className={cls} style={{ color: "var(--w-text)" }}>
                  사장님, 오늘도 매출이 오릅니다
                </span>
                <span className="w-caption-1 w-num shrink-0" style={{ color: "var(--w-text-assist)" }}>
                  {label} · {size}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* 3. 컴포넌트 */}
        <Section id="components" title="컴포넌트" desc="버튼·입력·칩·카드 기본 규격">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="w-card p-6">
              <p className="w-label-1 mb-4 font-bold" style={{ color: "var(--w-text)" }}>버튼</p>
              <div className="flex flex-wrap gap-2">
                <button className="w-btn w-btn-primary">기본 버튼<ArrowRight size={16} strokeWidth={2.5} /></button>
                <button className="w-btn w-btn-secondary">보조 버튼</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button className="w-btn w-btn-primary w-btn-sm">작은 버튼</button>
                <button className="w-btn w-btn-secondary w-btn-sm">작은 보조</button>
                <button className="w-btn w-btn-ghost w-btn-sm">텍스트</button>
              </div>
              <div className="mt-2">
                <button className="w-btn w-btn-primary" disabled>비활성</button>
              </div>
            </div>

            <div className="w-card p-6">
              <p className="w-label-1 mb-4 font-bold" style={{ color: "var(--w-text)" }}>입력</p>
              <label className="w-field-label">업체명</label>
              <input className="w-input" placeholder="예: 하랑카페" />
              <p className="w-help">포커스하면 파란 링이 생깁니다.</p>
              <label className="w-field-label mt-4">연락처</label>
              <input className="w-input w-input-error w-num" defaultValue="010" />
              <p className="w-error-text mt-1.5">연락처를 정확히 입력해 주세요</p>
            </div>

            <div className="w-card p-6">
              <p className="w-label-1 mb-4 font-bold" style={{ color: "var(--w-text)" }}>상태 칩</p>
              <div className="flex flex-wrap gap-2">
                <span className="w-chip w-chip-blue">진행 중</span>
                <span className="w-chip w-chip-green">완료</span>
                <span className="w-chip w-chip-amber">대기</span>
                <span className="w-chip w-chip-red">오류</span>
                <span className="w-chip w-chip-neutral">취소</span>
              </div>
            </div>

            <div className="w-card p-6">
              <p className="w-label-1 mb-4 font-bold" style={{ color: "var(--w-text)" }}>그림자</p>
              <div className="grid grid-cols-4 gap-3">
                {["xs", "sm", "md", "lg"].map((s) => (
                  <div key={s} className="text-center">
                    <div
                      className="h-12 rounded-[10px]"
                      style={{ background: "#fff", boxShadow: `var(--w-shadow-${s})` }}
                    />
                    <p className="w-caption-1 mt-1.5" style={{ color: "var(--w-text-assist)" }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 4. 섹션 미리보기 */}
        <Section id="sections" title="홈페이지 섹션 적용 예시" desc="이 규격으로 전체 페이지를 맞추면 이렇게 보입니다.">
          {/* 히어로 */}
          <div className="w-card mb-4 overflow-hidden">
            <div
              className="px-8 py-14"
              style={{ background: "linear-gradient(135deg, #001536 0%, #003E9C 55%, #0054D1 100%)" }}
            >
              <span
                className="w-chip"
                style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}
              >
                <Sparkles size={12} strokeWidth={2.5} />
                재계약률 95% · 500+ 프로젝트
              </span>
              <h3 className="w-display-2 mt-4 max-w-[560px]" style={{ color: "#fff" }}>
                사장님 매장, 검색되게 만들어 드립니다
              </h3>
              <p className="w-body-1 mt-3 max-w-[520px]" style={{ color: "rgba(255,255,255,0.72)" }}>
                블로그·플레이스·리뷰까지 10년 경력 대표가 직접 담당합니다.
                상담 비용 없이 지금 진단부터 받아보세요.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                <span className="w-btn" style={{ background: "#fff", color: "var(--w-primary-active)" }}>
                  무료 진단 신청<ArrowRight size={16} strokeWidth={2.5} />
                </span>
                <span
                  className="w-btn"
                  style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)" }}
                >
                  <Phone size={15} strokeWidth={2.5} />010-7541-9054
                </span>
              </div>
            </div>
          </div>

          {/* 지표 */}
          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              [TrendingUp, "재계약률", "95%"],
              [Users, "누적 프로젝트", "500+"],
              [Star, "평균 만족도", "4.9"],
              [ShieldCheck, "대표 경력", "10년+"],
            ].map(([Icon, label, value], i) => {
              const I = Icon as typeof TrendingUp;
              return (
                <div key={i} className="w-card p-5">
                  <I size={18} strokeWidth={2.5} style={{ color: "var(--w-primary)" }} />
                  <p className="w-caption-1 mt-3" style={{ color: "var(--w-text-muted)" }}>{label as string}</p>
                  <p className="w-heading-2 w-num" style={{ color: "var(--w-text)" }}>{value as string}</p>
                </div>
              );
            })}
          </div>

          {/* 서비스 카드 */}
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            {[
              ["블로그 마케팅", "검색 상위 노출까지 책임지는 원고·발행 대행", "월 4만원/편~"],
              ["플레이스 SEO", "지도 노출·리뷰·저장까지 한 번에 관리", "맞춤 견적"],
              ["SNS 부스트", "팔로워·조회수를 원하는 만큼 셀프 주문", "건당 300원~"],
            ].map(([title, desc, price]) => (
              <div key={title} className="w-card p-6">
                <div className="flex items-start justify-between gap-2">
                  <p className="w-title-3" style={{ color: "var(--w-text)" }}>{title}</p>
                  <Search size={16} strokeWidth={2.5} style={{ color: "var(--w-text-disabled)" }} />
                </div>
                <p className="w-body-2 mt-2" style={{ color: "var(--w-text-muted)" }}>{desc}</p>
                <p className="w-label-1 mt-4 font-bold" style={{ color: "var(--w-primary)" }}>{price}</p>
                <ul className="mt-4 space-y-1.5">
                  {["계약 강요 없음", "24시간 내 연락"].map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <Check size={13} strokeWidth={3} style={{ color: "var(--w-success)" }} />
                      <span className="w-caption-1" style={{ color: "var(--w-text-sub)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="w-card flex flex-wrap items-center justify-between gap-4 p-8">
            <div>
              <p className="w-title-2" style={{ color: "var(--w-text)" }}>지금 무료 전략 진단을 받아보세요</p>
              <p className="w-body-2 mt-1" style={{ color: "var(--w-text-muted)" }}>
                상담 비용 없음 · 계약 강요 없음 · 24시간 내 연락
              </p>
            </div>
            <span className="w-btn w-btn-primary">진단 신청<ArrowRight size={16} strokeWidth={2.5} /></span>
          </div>
        </Section>

        <p className="w-caption-1 pb-8 text-center" style={{ color: "var(--w-text-assist)" }}>
          이 페이지는 검색에 노출되지 않습니다. 확정되면 홈페이지 전체에 적용합니다.
        </p>
      </div>
    </main>
  );
}
