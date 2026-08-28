"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Check, Phone, Star, TrendingUp, Users, ShieldCheck, Quote,
} from "lucide-react";
import { SITE } from "../../lib/seo";

/**
 * 홈페이지 리디자인 A/B 비교 (비공개 · 검색 제외)
 *
 * 두 안의 구조는 완전히 같고 색만 다르다. 위 버튼으로 즉시 바꿔가며 비교한다.
 *   A안 — 원티드 블루로 통일
 *   B안 — 하랑 네이비·앰버 유지 (구조만 원티드식)
 *
 * 실제 홈페이지 문구를 그대로 써서 비교가 실감나게 했다. 실서비스에는 영향 없다.
 */

const STATS = [
  [Users, "누적 클라이언트", "500+"],
  [TrendingUp, "재계약률", SITE.stats.renewalRate],
  [ShieldCheck, "직접 관리", "10년+"],
  [Star, "평균 만족도", "4.9"],
] as const;

const SERVICES = [
  ["블로그 마케팅", "검색 상위 노출까지 책임지는 원고·발행 대행", "편당 4만원 기준~", ["계약 강요 없음", "전담 팀장이 직접 검수"]],
  ["플레이스 SEO", "지도 노출·리뷰·저장까지 한 번에 관리", "맞춤 견적", ["순위 리포트 제공", "24시간 내 연락"]],
  ["SNS 부스트", "팔로워·조회수를 원하는 만큼 셀프 주문", "건당 300원~", ["회원 예치금 결제", "즉시 시작"]],
] as const;

const REVIEWS = [
  ["부천 · 진갈매갈", "매장 검색이 안 되던 게 제일 답답했는데, 이제 '부천 고깃집' 치면 저희가 나옵니다."],
  ["수원 · 미소나무치과", "리뷰 관리까지 알아서 해주시니 저는 진료만 보면 됩니다."],
] as const;

export default function HomeComparePage() {
  const [variant, setVariant] = useState<"a" | "b">("b");

  return (
    <div data-variant={variant} style={{ background: "var(--w-bg-alt)" }}>
      {/* 비교 스위처 */}
      <div className="sticky top-0 z-50" style={{ background: "var(--w-label-strong)" }}>
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-5 py-3">
          <p className="w-label-2" style={{ color: "#fff" }}>
            홈페이지 리디자인 비교 · 실제 사이트에는 적용 전
          </p>
          <div className="flex items-center gap-2">
            {([
              ["b", "B안 · 하랑 네이비"],
              ["a", "A안 · 원티드 블루"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setVariant(key)}
                className="w-btn w-btn-sm"
                style={
                  variant === key
                    ? { background: "#fff", color: "var(--w-label-strong)" }
                    : { background: "rgba(255,255,255,0.12)", color: "#fff" }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 헤더 */}
      <header style={{ background: "var(--w-bg)", borderBottom: "1px solid var(--w-line)" }}>
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-4">
          <span className="w-title-3" style={{ color: "var(--w-label-strong)" }}>하랑마케팅</span>
          <nav className="hidden items-center gap-6 md:flex">
            {["회사소개", "마케팅상품", "진행사례", "SNS스토어", "블로그"].map((m) => (
              <span key={m} className="w-label-1" style={{ color: "var(--w-label-neutral)" }}>{m}</span>
            ))}
          </nav>
          <span className="w-btn w-btn-sm" style={{ background: "var(--pv-primary)", color: "#fff" }}>
            무료 진단
          </span>
        </div>
      </header>

      {/* 히어로 */}
      <section
        className="px-5 py-20 md:py-28"
        style={{
          background: `linear-gradient(120deg, var(--pv-hero-from) 0%, var(--pv-hero-mid) 55%, var(--pv-hero-to) 100%)`,
        }}
      >
        <div className="mx-auto max-w-[1100px]">
          <span className="w-chip" style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}>
            데이터 기반 마케팅 파트너
          </span>
          <h1 className="w-display-2 mt-5 max-w-[680px]" style={{ color: "#fff" }}>
            광고비 아까운 대표님은<br />나가주세요
          </h1>
          <p className="w-body-1 mt-4 max-w-[560px]" style={{ color: "var(--pv-on-hero-dim)" }}>
            말 보단 결과! 지금 저희를 알게 되셨다면 절반은 성공입니다.
            영업 전화 한 통 없이, 이번 달에만 대표님 같은 분 12명이 찾아왔습니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="w-btn" style={{ background: "#fff", color: "var(--pv-primary-strong)" }}>
              무료 마케팅 진단 받기
              <ArrowRight size={16} strokeWidth={2.5} />
            </span>
            <span
              className="w-btn"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)" }}
            >
              <Phone size={15} strokeWidth={2.5} />
              010-7541-9054
            </span>
          </div>
        </div>
      </section>

      {/* 지표 */}
      <section className="mx-auto max-w-[1100px] px-5 py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map(([Icon, label, value]) => (
            <div key={label} className="w-card p-5">
              <Icon size={18} strokeWidth={2.5} style={{ color: "var(--pv-primary)" }} />
              <p className="w-caption-1 mt-3" style={{ color: "var(--w-label-alt)" }}>{label}</p>
              <p className="w-heading-2 w-num" style={{ color: "var(--w-label-strong)" }}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 서비스 */}
      <section className="mx-auto max-w-[1100px] px-5 pb-12">
        <span className="w-label-2 font-bold" style={{ color: "var(--pv-accent)" }}>SERVICE</span>
        <h2 className="w-heading-1 mt-1.5" style={{ color: "var(--w-label-strong)" }}>
          매장에 필요한 것만 골라서
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {SERVICES.map(([title, desc, price, feats]) => (
            <div key={title} className="w-card p-6">
              <p className="w-title-3" style={{ color: "var(--w-label-strong)" }}>{title}</p>
              <p className="w-body-2 mt-2" style={{ color: "var(--w-label-alt)" }}>{desc}</p>
              <p className="w-label-1 mt-4 font-bold" style={{ color: "var(--pv-primary)" }}>{price}</p>
              <ul className="mt-4 space-y-1.5">
                {feats.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <Check size={13} strokeWidth={3} style={{ color: "var(--pv-accent)" }} />
                    <span className="w-caption-1" style={{ color: "var(--w-label-neutral)" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 후기 */}
      <section className="mx-auto max-w-[1100px] px-5 pb-12">
        <div className="grid gap-4 md:grid-cols-2">
          {REVIEWS.map(([who, text]) => (
            <div
              key={who}
              className="rounded-[16px] p-6"
              style={{ background: "var(--pv-primary-weak)", border: "1px solid var(--pv-primary-border)" }}
            >
              <Quote size={18} strokeWidth={2.5} style={{ color: "var(--pv-primary)" }} />
              <p className="w-body-1 mt-3" style={{ color: "var(--w-label)" }}>{text}</p>
              <p className="w-label-2 mt-3 font-bold" style={{ color: "var(--w-label-alt)" }}>{who}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1100px] px-5 pb-16">
        <div
          className="flex flex-wrap items-center justify-between gap-5 rounded-[16px] px-8 py-9"
          style={{ background: "var(--pv-primary-strong)" }}
        >
          <div>
            <p className="w-title-1" style={{ color: "#fff" }}>지금 무료 전략 진단을 받아보세요</p>
            <p className="w-body-2 mt-1.5" style={{ color: "var(--pv-on-hero-dim)" }}>
              상담 비용 없음 · 계약 강요 없음 · 24시간 내 연락
            </p>
          </div>
          <span className="w-btn" style={{ background: "var(--pv-accent)", color: "#fff" }}>
            진단 신청하기
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
        </div>
      </section>

      {/* 푸터 */}
      <footer style={{ background: "var(--w-label-strong)" }}>
        <div className="mx-auto max-w-[1100px] px-5 py-10">
          <p className="w-title-3" style={{ color: "#fff" }}>하랑마케팅</p>
          <p className="w-caption-1 mt-2" style={{ color: "var(--w-label-disable)" }}>
            대표: 전태영 · 사업자등록번호 706-68-00281 · 통신판매업신고 2020-서울강서-1482
          </p>
          <p className="w-caption-1 mt-1" style={{ color: "var(--w-label-disable)" }}>
            경기 고양시 일산동구 장백로19 더루벤투스카운티 501호
          </p>
        </div>
      </footer>

      <p className="w-caption-1 py-8 text-center" style={{ color: "var(--w-label-assistive)" }}>
        비교용 화면입니다 · 검색에 노출되지 않습니다 ·{" "}
        <Link href="/preview/wds" className="underline">디자인 규격 보기</Link>
      </p>
    </div>
  );
}
