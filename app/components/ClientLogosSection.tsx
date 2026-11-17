"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PARTNERS, PARTNER_LOGO, CLIENTS_AS_OF, type Partner } from "../lib/partners";

/**
 * 지금 함께하고 있는 곳 로고 슬라이더 (2026-11-12 대표 지시 · 로고 이미지만 · 상호 글자 없음).
 *
 * 로고 목록은 `app/lib/partners.ts` 한 곳에서만 관리한다. 여기는 손댈 일이 없다.
 * 두 줄이 서로 반대로 흐르고, 마우스를 올린 줄만 멈추면서 색이 돌아온다.
 * 모션을 끈 사용자에게는 흐르지 않는 격자로 보여준다.
 */

// 홀·짝으로 갈라 두 줄에 나눠 담는다. 무거운 마크가 한 줄에 몰리지 않는다
// 로고가 열한 장이라 한 벌이 화면보다 짧다. 세 번 이어 붙여 넓은 화면에서도 빈칸 없이 흐르게 한다
const fill = (row: Partner[]) => [0, 1, 2].flatMap((n) => row.map((p) => ({ p, dup: n > 0 })));
const ROW_A = fill(PARTNERS.filter((_, i) => i % 2 === 0));
const ROW_B = fill(PARTNERS.filter((_, i) => i % 2 === 1));
type Item = { p: Partner; dup: boolean };

function Logo({ p, dup }: Item) {
  // 가로로 흘러가는 줄이라 lazy 를 걸면 첫 바퀴에 빈칸이 보인다.
  // 32장 210KB 뿐이라 한 번에 받되 우선순위만 낮춰 본문 로딩을 막지 않는다
  const img = (
    <img
      src={`/partners/${p.file}`}
      alt={dup ? "" : `${p.name} 로고`}
      width={PARTNER_LOGO.w}
      height={PARTNER_LOGO.h}
      fetchPriority="low"
      decoding="async"
    />
  );
  return <li className={dup ? "hp-item hp-dup" : "hp-item"} aria-hidden={dup || undefined}>{img}</li>;
}

function Row({ items, anim }: { items: Item[]; anim: string }) {
  return (
    <div className="hp-row">
      <div className={`hp-track ${anim}`}>
        {[0, 1].map((copy) => (
          // 두 벌을 이어 붙이고 절반만큼 밀면 이음매가 보이지 않는다
          <ul className="hp-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {items.map((it, i) => (
              <Logo key={`${copy}-${i}`} p={it.p} dup={it.dup} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function ClientLogosSection() {
  return (
    <section
      className="py-12 md:py-16 overflow-hidden"
      style={{
        background: "var(--h-bg)",
        borderTop: "1px solid var(--h-border)",
        borderBottom: "1px solid var(--h-border)",
      }}
      aria-labelledby="partners-heading"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <p
            className="text-[11px] font-black uppercase tracking-[0.18em] shrink-0"
            style={{ color: "var(--h-muted)" }}
          >
            지금 함께하는 곳
          </p>
          <div className="h-px flex-1" style={{ background: "var(--h-border)" }} />
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div className="max-w-2xl">
            <h2
              id="partners-heading"
              className="text-xl md:text-2xl font-black tracking-tight"
              style={{ color: "var(--h-dark)" }}
            >
              지금 함께하고 있는 곳들
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--h-muted)" }}>
              {CLIENTS_AS_OF} 기준, 하랑 대표가 직접 맡아 진행 중인 매장과 브랜드입니다. 음식점과 카페부터 치과 · 의원, 입주청소와 설비까지.
            </p>
          </div>
          <Link
            href="/cases"
            className="inline-flex items-center gap-1.5 text-sm font-bold shrink-0 py-3 md:py-0"
            style={{ color: "var(--h-blue)" }}
          >
            성과 사례 보기
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      <div className="relative mt-8 md:mt-10">
        <Row items={ROW_A} anim="hp-a" />
        <Row items={ROW_B} anim="hp-b" />

        <div
          className="absolute inset-y-0 left-0 w-12 md:w-28 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--h-bg), transparent)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-12 md:w-28 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--h-bg), transparent)" }}
        />
      </div>

      <style>{`
        .hp-row { overflow: hidden; }
        .hp-row + .hp-row { margin-top: 14px; }
        .hp-track { display: flex; width: max-content; }
        .hp-set {
          display: flex; align-items: center;
          gap: 28px; padding-right: 28px;
          margin: 0; padding-left: 0; list-style: none;
        }
        .hp-item { display: flex; align-items: center; flex: none; }
        .hp-item img {
          height: 44px; width: auto; display: block;
          filter: grayscale(1); opacity: 0.5;
          transition: filter .25s ease, opacity .25s ease, transform .25s ease;
        }
        .hp-item:hover img { filter: none; opacity: 1; transform: translateY(-2px); }

        @keyframes hp-slide-a { from { transform: translateX(0); }      to { transform: translateX(-50%); } }
        @keyframes hp-slide-b { from { transform: translateX(-50%); }   to { transform: translateX(0); } }
        /* 로고가 늘면 같은 시간에 더 긴 줄을 밀어야 해 체감 속도가 빨라진다.
           줄당 16장 기준으로 잡은 값이다. 로고를 크게 늘리면 같이 늘린다 */
        .hp-a { animation: hp-slide-a 68s linear infinite; }
        .hp-b { animation: hp-slide-b 88s linear infinite; }
        .hp-row:hover .hp-track { animation-play-state: paused; }

        @media (min-width: 768px) {
          .hp-row + .hp-row { margin-top: 22px; }
          .hp-set { gap: 44px; padding-right: 44px; }
          .hp-item img { height: 58px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hp-track { animation: none; width: 100%; flex-wrap: wrap; justify-content: center; }
          .hp-set { flex-wrap: wrap; justify-content: center; padding-right: 0; }
          .hp-set[aria-hidden="true"], .hp-dup { display: none; }
          .hp-item img { transition: none; }
        }
      `}</style>
    </section>
  );
}
