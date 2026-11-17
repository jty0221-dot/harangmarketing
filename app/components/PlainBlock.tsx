import type { ReactNode } from "react";
import { getPortfolio } from "../lib/portfolio";
import { SearchSketch } from "./sian/Sian";
import s from "./sian/sian.module.css";

/*
 * 처음 보는 대표님용 쉬운 풀이 · 진행 사례 사진 (2026-11-12 대표 지시분).
 * 2026-11-17 화면을 예전 카드 방식으로 되돌리면서, 글 줄 틀(sian)에 있던 것을 카드 모양으로 옮겼다.
 * 문장과 뜻풀이는 그대로다 (app/lib/plain-terms.ts). 병·의원 페이지는 진우 판정 통과 문장(CLINIC_PLAIN_TERMS)과 SearchSketch clinic 만 쓴다 (C-50).
 */

export { SearchSketch };

type Term = { term: string; desc: string };

const CARD = "rounded-2xl border bg-white shadow-sm p-5 md:p-8";
const LINE = { borderColor: "var(--h-border)" } as const;

/** 낱말 풀이 카드 묶음 */
export function TermCards({ terms, label = "이 페이지에 나오는 말" }: { terms: readonly Term[]; label?: string }) {
  return (
    <div className="mt-6 md:mt-8">
      <p className="text-sm font-bold" style={{ color: "var(--h-muted)" }}>{label}</p>
      <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {terms.map((t) => (
          <div key={t.term} className="rounded-xl border p-4" style={{ ...LINE, background: "var(--h-bg)" }}>
            <dt className="text-sm md:text-base font-bold" style={{ color: "var(--h-dark)" }}>{t.term}</dt>
            <dd className="mt-1 text-sm leading-relaxed" style={{ color: "var(--h-muted)" }}>{t.desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** 그림(SearchSketch)은 시안 틀의 색 변수를 쓰므로 그 변수가 있는 상자 안에 넣는다 */
export function SketchBox({ children }: { children: ReactNode }) {
  return <div className={s.root}>{children}</div>;
}

/** 카드 한 장을 담는 절. bare 는 이미 여백과 바탕이 있는 틀(/services/homepage) 안에 넣을 때 쓴다 */
function Shell({ id, label, bare, children }: { id?: string; label: string; bare?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={bare ? "my-10 md:my-14" : "py-10 md:py-14 bg-white"} aria-label={label}>
      <div className={bare ? undefined : "max-w-4xl mx-auto px-4 md:px-6"}>
        <div className={CARD} style={LINE}>{children}</div>
      </div>
    </section>
  );
}

/** 머리 아래 쉬운 풀이 카드 · 무슨 일인지 · 누구에게 필요한지 · 그림 · 낱말 풀이 */
export function Plain({ what, who, terms = [], bare, children }: {
  what: string;
  who: string;
  terms?: readonly Term[];
  bare?: boolean;
  children?: ReactNode;
}) {
  return (
    <Shell id="plain" label="쉽게 말하면 이런 일입니다" bare={bare}>
      <p className="text-sm font-bold" style={{ color: "var(--w-primary)" }}>처음이시라면</p>
      <h2 className="mt-1 text-xl md:text-2xl font-black" style={{ color: "var(--h-dark)" }}>
        쉽게 말하면 이런 일입니다
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--h-muted)" }}>
        어려운 말을 빼고 먼저 정리했습니다. 자세한 내용은 아래에 이어집니다.
      </p>
      <dl className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
        {[["무슨 일인가요", what], ["누구에게 필요한가요", who]].map(([k, v]) => (
          <div key={k} className="rounded-xl border p-4 md:p-5" style={LINE}>
            <dt className="text-sm font-bold" style={{ color: "var(--w-primary)" }}>{k}</dt>
            <dd className="mt-1.5 text-base font-semibold leading-relaxed" style={{ color: "var(--h-dark)", wordBreak: "keep-all" }}>{v}</dd>
          </div>
        ))}
      </dl>
      {children && <SketchBox>{children}</SketchBox>}
      {terms.length > 0 && <TermCards terms={terms} />}
    </Shell>
  );
}

/** 그림과 낱말 풀이만 싣는 카드 · /location · /cases/place-rank (2026-11-12 d9d259c 의 그림 절을 카드 모양으로) */
export function SketchCard({ eyebrow, title, desc, terms, children }: {
  eyebrow?: string;
  title: string;
  desc: string;
  terms: readonly Term[];
  children: ReactNode;
}) {
  return (
    <Shell label={title}>
      {eyebrow && <p className="text-sm font-bold" style={{ color: "var(--w-primary)" }}>{eyebrow}</p>}
      <h2 className="mt-1 text-xl md:text-2xl font-black" style={{ color: "var(--h-dark)" }}>{title}</h2>
      <p className="mt-2 text-sm" style={{ color: "var(--h-muted)" }}>{desc}</p>
      <SketchBox>{children}</SketchBox>
      <TermCards terms={terms} />
    </Shell>
  );
}

/** 설득 공정 시안 두 벌 카드 (2026-11-12 루미 · /services/persuasion 으로 잇는다) */
export function PersuasionSection({ bare, children }: { bare?: boolean; children: ReactNode }) {
  return (
    <Shell id="persuasion" label="걱정부터 정하고 짠 시안" bare={bare}>
      <h2 className="text-xl md:text-2xl font-black" style={{ color: "var(--h-dark)" }}>
        걱정부터 정하고 짠 시안
      </h2>
      <p className="mt-2 mb-5 text-sm" style={{ color: "var(--h-muted)" }}>
        상세페이지와 홈페이지 첫 화면을 같은 방법으로 짠 시안입니다.
      </p>
      <SketchBox>{children}</SketchBox>
      <p className="mt-5">
        <a href="/services/persuasion" className="inline-flex min-h-11 items-center text-sm font-bold" style={{ color: "var(--w-primary)" }}>
          방법 자세히 보기
        </a>
      </p>
    </Shell>
  );
}

/**
 * 업종 페이지의 실제 진행 사례 사진 네 장 · content/portfolio.json(하랑 블로그 사례)에서만 온다.
 * 사진이 있는 사례가 없으면 절 자체를 그리지 않는다.
 */
export function CaseShots({ slug, label }: { slug: string; label: string }) {
  const cases = (getPortfolio().industries.find((i) => i.slug === slug)?.cases ?? [])
    .filter((c) => c.image)
    .slice(0, 4);
  if (cases.length === 0) return null;
  return (
    <section className="py-12 md:py-16 bg-gray-50" aria-label={`${label} 진행 사례`}>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">{label} 진행 사례</h2>
          <p className="text-gray-500 text-sm">하랑 블로그에 올린 실제 진행 기록입니다. 사진을 누르면 원문으로 갑니다.</p>
        </div>
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {cases.map((c) => (
            <li key={c.logNo} className="min-w-0">
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <img src={c.image!} alt="" width={480} height={360} loading="lazy" decoding="async" className="block w-full aspect-[4/3] object-cover" />
                <span className="block p-3 md:p-4">
                  <span className="block text-sm font-bold text-gray-900 line-clamp-2">{c.title}</span>
                  <span className="mt-1 block text-xs text-gray-500">{c.date}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center">
          <a href="/portfolio" className="inline-flex min-h-11 items-center text-sm font-bold" style={{ color: "var(--w-primary)" }}>
            업종별 사례 더 보기
          </a>
        </p>
      </div>
    </section>
  );
}
