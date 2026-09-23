import Link from "next/link";
import { ArrowRight, BarChart3, Route, Search, ShieldCheck } from "lucide-react";

const CHECKS = [
  {
    icon: Search,
    title: "현재 검색 위치",
    text: "고객이 찾는 키워드에서 내 매장이 어디에 보이는지 확인합니다.",
  },
  {
    icon: Route,
    title: "놓치고 있는 유입 경로",
    text: "플레이스, 블로그, 콘텐츠 가운데 지금 막힌 경로를 먼저 찾습니다.",
  },
  {
    icon: BarChart3,
    title: "먼저 할 한 가지",
    text: "해야 할 일을 늘어놓지 않고 우선순위와 다음 확인 기준을 정합니다.",
  },
];

const MOMENTS = [
  {
    situation: "광고비는 나가는데 무엇이 달라졌는지 모르겠을 때",
    answer: "지출을 늘리기 전에 현재 위치와 확인할 숫자부터 정리합니다.",
  },
  {
    situation: "담당자가 바뀔 때마다 처음부터 다시 설명해야 할 때",
    answer: "상담한 하랑 대표가 진행 방향과 보고까지 계속 확인합니다.",
  },
  {
    situation: "여러 채널 중 어디부터 손대야 할지 막막할 때",
    answer: "업종과 지역에 맞춰 지금 필요한 경로부터 순서를 세웁니다.",
  },
];

export default function CustomerConfidenceSection() {
  return (
    <section className="bg-white py-14 md:py-20" aria-labelledby="confidence-heading">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--w-primary-strong)" }}>
            계약 전, 먼저 확인할 것
          </p>
          <h2 id="confidence-heading" className="mt-3 text-2xl font-black leading-tight md:text-4xl" style={{ color: "var(--h-dark)", letterSpacing: "-0.035em" }}>
            무엇이 문제인지 알면,<br className="hidden sm:block" /> 다음 선택은 선명해집니다
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 md:text-base" style={{ color: "var(--h-muted)" }}>
            더 많은 상품을 권하기 전에 대표님이 판단할 수 있는 기준부터 드립니다. 현재 상태와 우선순위, 다음에 확인할 숫자를 한 흐름으로 설명합니다.
          </p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {CHECKS.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "var(--h-border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--w-primary-bg)", color: "var(--w-primary-strong)" }}>
                  <Icon size={19} strokeWidth={2.3} />
                </div>
                <span className="text-xs font-black tabular-nums" style={{ color: "var(--w-label-assistive)" }}>0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-black" style={{ color: "var(--h-dark)" }}>{title}</h3>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--h-muted)" }}>{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border p-5 md:p-8" style={{ background: "var(--h-bg)", borderColor: "var(--h-border)" }}>
          <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--h-navy)", color: "white" }}>
                <ShieldCheck size={19} strokeWidth={2.3} />
              </div>
              <h3 className="mt-4 text-xl font-black leading-snug" style={{ color: "var(--h-dark)" }}>
                이런 순간이라면<br />확인부터 받아보세요
              </h3>
              <p className="mt-3 text-sm leading-6" style={{ color: "var(--h-muted)" }}>
                상담 비용은 0원이며 계약 여부는 설명을 들은 뒤 대표님이 결정합니다.
              </p>
            </div>
            <div className="space-y-3">
              {MOMENTS.map((item) => (
                <div key={item.situation} className="rounded-xl border bg-white p-4 md:flex md:items-start md:gap-5" style={{ borderColor: "var(--h-border)" }}>
                  <p className="font-bold leading-6 md:w-[48%]" style={{ color: "var(--h-dark)" }}>{item.situation}</p>
                  <p className="mt-2 text-sm leading-6 md:mt-0 md:flex-1" style={{ color: "var(--h-muted)" }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--h-border)" }}>
            <p className="text-xs font-semibold" style={{ color: "var(--h-muted)" }}>상담 비용 0원 · 계약 여부는 상담 후 결정 · 특정 순위와 매출은 미리 약속하지 않습니다</p>
            <Link href="/free-check" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm" style={{ background: "var(--h-navy)" }}>
              내 매장 현재 상태 확인하기
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
