"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Link2, Phone, User, Send, CheckCircle2, Copy, Search,
  MessageCircle, AlertTriangle, Loader2, Minus, Plus, Wallet,
  Users, Heart, Eye, MessageSquare, Bookmark, TrendingUp,
  Star, Share2, Settings, Package, Check, Flame, ThumbsUp, Coins,
} from "lucide-react";
import {
  SNS_PLATFORMS, SNS_PRODUCTS, getProduct, productsByPlatform,
  groupedByPlatform, platformHasProducts,
  calcTotal, won, STORE, platformName,
  type PlatformId, type SnsProduct,
} from "../../lib/sns-store";
import { PlatformLogo } from "../PlatformLogo";

/**
 * 주문 페이지 — 3단 선택 (플랫폼 → 서비스 종류 → 상세 상품) + 주문서
 *
 * 상품이 293개라 예전처럼 select 하나에 다 넣으면 고르는 게 일이 된다.
 * 로고를 눈으로 먼저 고르고, 종류로 좁히고, 마지막에 상세만 보게 3단으로 나눴다.
 * 데스크톱에서는 오른쪽 주문서가 따라붙어 고르는 동안 금액이 계속 보인다.
 *
 * 색·타이포·모서리는 WDS 토큰(app/wds.css)만 쓴다. 브랜드 로고 색은 예외 —
 * 플랫폼 식별용이라 공식 브랜드 컬러를 그대로 둔다 (PlatformLogo).
 */

const KAKAO_CHAT = "https://pf.kakao.com/_MuUkG/chat";

/** 서비스 종류(그룹)별 아이콘 — 이모지 대신 lucide 를 쓴다 */
const GROUP_ICON: Record<string, typeof Users> = {
  "팔로워·구독": Users,
  "좋아요·반응": Heart,
  "조회수": Eye,
  "댓글": MessageSquare,
  "노출·저장": Bookmark,
  "상위노출": TrendingUp,
  "리뷰": Star,
  "확산·바이럴": Share2,
  "계정 관리": Settings,
  "기타": Package,
};

const BADGE_META: Record<
  NonNullable<SnsProduct["badge"]>,
  { icon: typeof Flame; cls: string }
> = {
  인기: { icon: Flame, cls: "w-chip-red" },
  추천: { icon: ThumbsUp, cls: "w-chip-blue" },
  가성비: { icon: Coins, cls: "w-chip-green" },
};

interface DoneInfo {
  no: string;
  total: number;
  bank: string | null;
  /** 회원 예치금으로 결제된 주문 — 입금 안내 대신 잔액을 보여준다 */
  paidByBalance?: boolean;
  balanceAfter?: number;
  notice?: string;
}

interface Me {
  name: string;
  balance: number;
}

/** 단계 머리표 — 숫자 배지 + 제목 + 지금 고른 값 */
function StepHead({
  n,
  title,
  picked,
}: {
  n: number;
  title: string;
  picked?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span
        className="w-num inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
        style={{ background: "var(--w-primary)", color: "var(--w-text-inverse)" }}
      >
        {n}
      </span>
      <h2 className="w-title-3" style={{ color: "var(--w-text)" }}>
        {title}
      </h2>
      {picked && (
        <span className="w-chip w-chip-blue truncate max-w-[45%]">{picked}</span>
      )}
      <span className="flex-1 h-px" style={{ background: "var(--w-line)" }} />
    </div>
  );
}

export default function OrderForm({ initialSlug }: { initialSlug: string | null }) {
  const initial = (initialSlug && getProduct(initialSlug)) || SNS_PRODUCTS[0];

  const [slug, setSlug] = useState(initial.slug);
  const product = getProduct(slug) ?? SNS_PRODUCTS[0];

  const [platform, setPlatform] = useState<PlatformId>(initial.platform);
  const [group, setGroup] = useState<string>(initial.group);
  const [q, setQ] = useState("");

  const [qty, setQty] = useState<number>(initial.min);
  const [qtyText, setQtyText] = useState<string>(String(initial.min));
  const [link, setLink] = useState("");
  const [contact, setContact] = useState("");
  const [depositor, setDepositor] = useState("");
  const [comments, setComments] = useState("");
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState(""); // 봇 트랩 — 화면에는 안 보인다
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<DoneInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [me, setMe] = useState<Me | null>(null); // 로그인 회원이면 예치금으로 결제한다

  useEffect(() => {
    let alive = true;
    fetch("/api/sns/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d?.ok) setMe({ name: d.member.name, balance: d.member.balance });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  /* ── 선택 상태 ─────────────────────────────── */

  const platforms = useMemo(
    () => SNS_PLATFORMS.filter((pl) => platformHasProducts(pl.id)),
    []
  );
  const groups = useMemo(() => groupedByPlatform(platform), [platform]);

  /** 3단계에 뿌릴 상품 — 검색어가 있으면 플랫폼 전체에서 찾는다 */
  const query = q.trim();
  const listed = useMemo(() => {
    if (query) {
      return productsByPlatform(platform).filter(
        (p) => p.name.includes(query) || p.desc.includes(query)
      );
    }
    return groups.find((g) => g.group === group)?.items ?? [];
  }, [query, platform, groups, group]);

  const pickProduct = (next: SnsProduct) => {
    setSlug(next.slug);
    setQty(next.min);
    setQtyText(String(next.min));
    setComments("");
    setError("");
  };

  const pickGroup = (g: string) => {
    setGroup(g);
    setQ("");
    const first = groups.find((x) => x.group === g)?.items[0];
    if (first) pickProduct(first);
  };

  const pickPlatform = (id: PlatformId) => {
    if (id === platform) return;
    setPlatform(id);
    setQ("");
    const gs = groupedByPlatform(id);
    const firstGroup = gs[0];
    if (firstGroup) {
      setGroup(firstGroup.group);
      pickProduct(firstGroup.items[0]);
    }
  };

  /* ── 수량·금액 ─────────────────────────────── */

  const commentLines = useMemo(
    () => comments.split("\n").map((l) => l.trim()).filter(Boolean),
    [comments]
  );
  const effectiveQty = product.needsComments ? commentLines.length : qty;
  const total = calcTotal(product, Math.max(0, effectiveQty));
  const qtyValid =
    Number.isInteger(effectiveQty) && effectiveQty >= product.min && effectiveQty <= product.max;

  const setQtyClamped = (n: number) => {
    const v = Math.max(product.min, Math.min(product.max, n));
    setQty(v);
    setQtyText(String(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!qtyValid) {
      setError(`수량은 ${won(product.min)}~${won(product.max)}${product.unitLabel} 사이로 입력해 주세요.`);
      return;
    }
    if (!agree) {
      setError("주문 유의사항 동의에 체크해 주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/sns/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.slug,
          qty: effectiveQty,
          link,
          contact,
          depositor,
          comments: product.needsComments ? comments : undefined,
          website,
        }),
      });
      const data = await res.json().catch(() => ({ ok: false, error: `서버 오류 (${res.status})` }));
      if (!data.ok) {
        setError(data.error ?? "접수 중 문제가 생겼습니다.");
      } else {
        setDone({
          no: data.no,
          total: data.total,
          bank: data.bank ?? null,
          paidByBalance: data.paidByBalance,
          balanceAfter: data.balanceAfter,
          notice: data.notice,
        });
        if (data.paidByBalance && typeof data.balanceAfter === "number") {
          setMe((m) => (m ? { ...m, balance: data.balanceAfter } : m));
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("네트워크 오류입니다. 잠시 후 다시 시도해 주세요.");
    }
    setSubmitting(false);
  };

  const copyNo = async () => {
    if (!done) return;
    try {
      await navigator.clipboard.writeText(done.no);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 미지원 브라우저는 무시
    }
  };

  /* ───────────── 접수 완료 화면 ───────────── */
  if (done) {
    return (
      <div className="max-w-2xl mx-auto w-card p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "var(--w-success)" }}
          >
            <CheckCircle2 size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="w-title-2" style={{ color: "var(--w-text)" }}>
            {done.paidByBalance ? "결제 완료 · 주문이 시작되었습니다" : "주문이 접수되었습니다"}
          </h2>
        </div>

        <div
          className="mt-5 rounded-[16px] p-5 text-center"
          style={{ background: "var(--w-bg-alt)", border: "1px solid var(--w-border)" }}
        >
          <p className="w-caption-1 font-bold" style={{ color: "var(--w-text-muted)" }}>
            주문번호
          </p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="w-num w-heading-1" style={{ color: "var(--w-text)" }}>
              {done.no}
            </span>
            <button
              onClick={copyNo}
              className="w-btn w-btn-ghost w-btn-sm"
              style={{ padding: "0 10px" }}
              aria-label="주문번호 복사"
            >
              <Copy size={15} strokeWidth={2.2} />
            </button>
          </div>
          {copied && (
            <p className="mt-1 w-caption-1 font-bold" style={{ color: "var(--w-success-dark)" }}>
              복사되었습니다
            </p>
          )}
          <p className="mt-2 w-body-2" style={{ color: "var(--w-text-sub)" }}>
            {done.paidByBalance ? "결제 금액" : "입금하실 금액"}{" "}
            <strong className="w-num font-bold" style={{ color: "var(--w-text)" }}>
              {won(done.total)}원
            </strong>
          </p>
        </div>

        {done.paidByBalance ? (
          <div
            className="mt-4 rounded-[16px] p-5 w-label-1"
            style={{ background: "var(--w-success-weak)", color: "var(--w-text-sub)" }}
          >
            <p className="font-bold" style={{ color: "var(--w-text)" }}>
              예치금에서 결제되었습니다
            </p>
            <p className="mt-1">
              남은 잔액{" "}
              <strong className="w-num w-title-3" style={{ color: "var(--w-success-dark)" }}>
                {won(done.balanceAfter ?? 0)}원
              </strong>
            </p>
            <p className="mt-2">{done.notice ?? STORE.startNote}</p>
          </div>
        ) : (
          <div
            className="mt-4 rounded-[16px] p-5 w-label-1"
            style={{
              background: "var(--w-primary-weaker)",
              border: "1px solid var(--w-primary-border)",
              color: "var(--w-text-sub)",
            }}
          >
            {done.bank ? (
              <>
                <p className="font-bold" style={{ color: "var(--w-text)" }}>
                  입금 계좌
                </p>
                <p className="mt-1 w-title-3" style={{ color: "var(--w-primary-active)" }}>
                  {done.bank}
                </p>
                <p className="mt-2">
                  입금자명을 주문서와 같게 해주시면 확인이 가장 빠릅니다. {STORE.startNote}
                </p>
              </>
            ) : (
              <>
                <p className="font-bold" style={{ color: "var(--w-text)" }}>
                  입금 안내는 카카오톡으로 드립니다
                </p>
                <p className="mt-1">
                  아래 버튼으로 카카오톡 채널에 <strong className="font-bold">주문번호 {done.no}</strong> 를
                  보내주시면 입금 계좌를 바로 안내해 드립니다. {STORE.startNote}
                </p>
              </>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
          {done.paidByBalance ? (
            <Link href="/sns/me" className="w-btn w-btn-primary flex-1">
              <Wallet size={15} strokeWidth={2.2} />
              마이페이지에서 진행 보기
            </Link>
          ) : (
            <a
              href={KAKAO_CHAT}
              target="_blank"
              rel="noopener noreferrer"
              className="w-btn flex-1"
              style={{ background: "#FEE500", color: "#3C1E1E" }}
            >
              <MessageCircle size={15} strokeWidth={2.2} />
              카카오톡 채널 열기
            </a>
          )}
          <Link href="/sns/track" className="w-btn w-btn-secondary flex-1">
            <Search size={15} strokeWidth={2.2} />
            주문 조회하기
          </Link>
        </div>

        <p className="mt-4 w-caption-1" style={{ color: "var(--w-text-assist)" }}>
          {done.paidByBalance
            ? "마이페이지에서 주문 진행률과 잔액을 언제든 확인할 수 있습니다."
            : "주문번호와 연락처만 있으면 언제든 진행 상황을 조회할 수 있습니다. 이 화면을 캡처해 두셔도 좋습니다."}
        </p>
      </div>
    );
  }

  /* ───────────── 주문 화면 ───────────── */
  return (
    <form onSubmit={handleSubmit}>
      {/* 회원 예치금 안내 — 로그인 상태면 잔액에서 즉시 결제된다 */}
      {me ? (
        <div
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[16px] px-5 py-4"
          style={{ background: "var(--w-primary-weaker)", border: "1px solid var(--w-primary-border)" }}
        >
          <div className="flex items-center gap-2.5">
            <Wallet size={16} strokeWidth={2.5} style={{ color: "var(--w-primary)" }} />
            <div>
              <p className="w-caption-1" style={{ color: "var(--w-text-muted)" }}>
                {me.name}님 예치금 잔액
              </p>
              <p className="w-title-2 w-num" style={{ color: "var(--w-text)" }}>
                {won(me.balance)}원
              </p>
            </div>
          </div>
          <Link href="/sns/charge" className="w-btn w-btn-secondary w-btn-sm">
            충전하기
          </Link>
        </div>
      ) : (
        <div
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[16px] px-5 py-4"
          style={{ background: "var(--w-primary-weaker)", border: "1px solid var(--w-primary-border)" }}
        >
          <p className="w-label-1" style={{ color: "var(--w-text-sub)" }}>
            <strong style={{ color: "var(--w-text)" }}>회원으로 주문하면</strong> 예치금 잔액에서 바로 결제되고
            입금 확인 없이 즉시 시작됩니다.
          </p>
          <div className="flex gap-2">
            <Link href="/sns/login" className="w-btn w-btn-secondary w-btn-sm">
              로그인
            </Link>
            <Link href="/sns/signup" className="w-btn w-btn-primary w-btn-sm">
              회원가입
            </Link>
          </div>
        </div>
      )}

      {/* ── 1단계 · 플랫폼 ── */}
      <section className="w-card p-5 md:p-6">
        <StepHead n={1} title="어느 채널을 키우시나요?" picked={platformName(platform)} />
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-2.5">
          {platforms.map((pl) => {
            const on = pl.id === platform;
            const count = productsByPlatform(pl.id).length;
            return (
              <button
                key={pl.id}
                type="button"
                onClick={() => pickPlatform(pl.id)}
                aria-pressed={on}
                aria-label={`${pl.name} · 상품 ${count}개`}
                className="flex flex-col items-center justify-center gap-1.5 rounded-[12px] px-2 py-3.5 transition-colors"
                style={{
                  background: on ? "var(--w-primary-weaker)" : "var(--w-bg)",
                  border: `1px solid ${on ? "var(--w-primary)" : "var(--w-border)"}`,
                  boxShadow: on ? "0 0 0 3px rgba(0, 102, 255, 0.10)" : "none",
                }}
              >
                <PlatformLogo id={pl.id} size={38} />
                <span
                  className="w-label-2 font-bold leading-tight text-center"
                  style={{ color: on ? "var(--w-primary-active)" : "var(--w-text)" }}
                >
                  <span className="sm:hidden">{pl.short}</span>
                  <span className="hidden sm:block">{pl.name}</span>
                </span>
                <span className="w-caption-1 w-num" style={{ color: "var(--w-text-assist)" }}>
                  {count}개
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 2단계 · 서비스 종류 ── */}
      <section className="w-card p-5 md:p-6 mt-4">
        <StepHead n={2} title="어떤 서비스가 필요하신가요?" picked={query ? undefined : group} />
        <div className="flex flex-wrap gap-2">
          {groups.map(({ group: g, items }) => {
            const on = !query && g === group;
            const Icon = GROUP_ICON[g] ?? Package;
            return (
              <button
                key={g}
                type="button"
                onClick={() => pickGroup(g)}
                aria-pressed={on}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] px-3.5 py-2.5 transition-colors"
                style={{
                  background: on ? "var(--w-primary)" : "var(--w-bg)",
                  border: `1px solid ${on ? "var(--w-primary)" : "var(--w-border)"}`,
                  color: on ? "var(--w-text-inverse)" : "var(--w-text-sub)",
                }}
              >
                <Icon size={15} strokeWidth={2.2} />
                <span className="w-label-1 font-bold">{g}</span>
                <span
                  className="w-caption-1 w-num"
                  style={{ color: on ? "rgba(255,255,255,0.72)" : "var(--w-text-assist)" }}
                >
                  {items.length}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3단계 · 상세 상품 + 주문서 ── */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-4 items-start">
        <section className="w-card p-5 md:p-6">
          <StepHead n={3} title="상세 서비스를 골라주세요" />

          <div className="relative mb-3">
            <Search
              size={16}
              strokeWidth={2.2}
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--w-text-disabled)" }}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`${platformName(platform)} 상품 검색 (예: 한국인, 조회수)`}
              className="w-input"
              style={{ paddingLeft: 40 }}
            />
          </div>

          {query && (
            <p className="mb-2 w-caption-1" style={{ color: "var(--w-text-muted)" }}>
              <strong style={{ color: "var(--w-text)" }}>&lsquo;{query}&rsquo;</strong> 검색 결과 {listed.length}개 ·
              종류를 다시 누르면 검색이 해제됩니다
            </p>
          )}

          <div className="max-h-[520px] overflow-y-auto pr-1 -mr-1 space-y-2">
            {listed.length === 0 ? (
              <p
                className="rounded-[12px] p-8 text-center w-body-2"
                style={{ background: "var(--w-bg-alt)", color: "var(--w-text-muted)" }}
              >
                해당하는 상품이 없습니다. 다른 단어로 찾아보시거나 카카오톡으로 문의해 주세요.
              </p>
            ) : (
              listed.map((p) => {
                const on = p.slug === slug;
                const badge = p.badge ? BADGE_META[p.badge] : null;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => pickProduct(p)}
                    aria-pressed={on}
                    className="w-full text-left rounded-[12px] p-3.5 transition-colors"
                    style={{
                      background: on ? "var(--w-primary-weaker)" : "var(--w-bg)",
                      border: `1px solid ${on ? "var(--w-primary)" : "var(--w-border)"}`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: on ? "var(--w-primary)" : "transparent",
                          border: `1px solid ${on ? "var(--w-primary)" : "var(--w-border-strong)"}`,
                        }}
                      >
                        {on && <Check size={12} strokeWidth={3} color="#fff" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-1.5">
                          <span className="w-label-1 font-bold" style={{ color: "var(--w-text)" }}>
                            {p.name}
                          </span>
                          {badge && (
                            <span className={`w-chip ${badge.cls}`}>
                              <badge.icon size={11} strokeWidth={2.5} />
                              {p.badge}
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block w-caption-1" style={{ color: "var(--w-text-muted)" }}>
                          최소 {won(p.min)}{p.unitLabel} · {won(p.min * p.unitPrice)}원부터
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block w-caption-1" style={{ color: "var(--w-text-assist)" }}>
                          1{p.unitLabel}당
                        </span>
                        <span
                          className="block w-num w-title-3"
                          style={{ color: on ? "var(--w-primary-active)" : "var(--w-text)" }}
                        >
                          {won(p.unitPrice)}원
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* ── 주문서 ── */}
        <div className="lg:sticky lg:top-[124px] space-y-4">
          <section className="w-card p-5 md:p-6">
            {/* 고른 상품 */}
            <div
              className="flex items-center gap-3 rounded-[12px] p-3.5"
              style={{ background: "var(--w-bg-alt)" }}
            >
              <PlatformLogo id={product.platform} size={40} />
              <div className="min-w-0 flex-1">
                <p className="w-caption-1" style={{ color: "var(--w-text-muted)" }}>
                  {platformName(product.platform)} · {product.group}
                </p>
                <p className="w-label-1 font-bold truncate" style={{ color: "var(--w-text)" }}>
                  {product.name}
                </p>
              </div>
            </div>
            <p className="mt-2.5 w-caption-1 leading-relaxed" style={{ color: "var(--w-text-muted)" }}>
              {product.desc}
            </p>

            {/* 수량 */}
            {product.needsComments ? (
              <div className="mt-4">
                <label className="w-field-label">
                  댓글 내용 <span style={{ fontWeight: 500, color: "var(--w-text-assist)" }}>(한 줄에 하나 · 줄 수 = 수량)</span>
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={5}
                  placeholder={"사장님 여기 진짜 맛있어요\n분위기 최고네요 재방문 의사 100%"}
                  className="w-input"
                  style={{ height: "auto", padding: "12px 16px", lineHeight: 1.6 }}
                />
                <p className="w-help w-num">
                  현재 {won(commentLines.length)}개 · 최소 {won(product.min)}개 ~ 최대 {won(product.max)}개
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <label className="w-field-label">
                  수량{" "}
                  <span className="w-num" style={{ fontWeight: 500, color: "var(--w-text-assist)" }}>
                    ({won(product.min)}~{won(product.max)}{product.unitLabel})
                  </span>
                </label>
                <div className="flex items-stretch gap-2">
                  <button
                    type="button"
                    onClick={() => setQtyClamped(qty - product.step)}
                    className="w-btn w-btn-secondary"
                    style={{ width: 52, padding: 0 }}
                    aria-label="수량 줄이기"
                  >
                    <Minus size={15} strokeWidth={2.5} />
                  </button>
                  <input
                    inputMode="numeric"
                    value={qtyText}
                    onChange={(e) => {
                      const t = e.target.value.replace(/[^0-9]/g, "");
                      setQtyText(t);
                      setQty(t === "" ? 0 : parseInt(t, 10));
                    }}
                    onBlur={() => setQtyClamped(qty || product.min)}
                    className="w-input w-num flex-1 min-w-0 text-center font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setQtyClamped(qty + product.step)}
                    className="w-btn w-btn-secondary"
                    style={{ width: 52, padding: 0 }}
                    aria-label="수량 늘리기"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[product.min, product.min * 2, product.min * 5, product.min * 10]
                    .filter((n, i, arr) => n <= product.max && arr.indexOf(n) === i)
                    .map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setQtyClamped(n)}
                        className="w-num rounded-[8px] px-2.5 py-1.5 w-caption-1 font-bold transition-colors"
                        style={{
                          background: qty === n ? "var(--w-primary-weak)" : "var(--w-fill)",
                          color: qty === n ? "var(--w-primary-active)" : "var(--w-text-muted)",
                        }}
                      >
                        {won(n)}{product.unitLabel}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* 링크 */}
            <div className="mt-4">
              <label className="w-field-label flex items-center gap-1.5">
                <Link2 size={12} strokeWidth={2.5} style={{ color: "var(--w-primary)" }} />
                {product.linkLabel}
              </label>
              <input
                required
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder={product.linkHint}
                className="w-input"
              />
              <p className="w-help">
                비공개 계정은 진행되지 않습니다. 링크가 틀리면 환불이 어려우니 한 번 더 확인해 주세요.
              </p>
            </div>

            {!me && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="w-field-label flex items-center gap-1.5">
                    <Phone size={12} strokeWidth={2.5} style={{ color: "var(--w-primary)" }} />
                    연락처 (전화번호 또는 카톡 ID)
                  </label>
                  <input
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-input"
                  />
                  <p className="w-help">주문 조회할 때 본인 확인용으로 씁니다.</p>
                </div>
                <div>
                  <label className="w-field-label flex items-center gap-1.5">
                    <User size={12} strokeWidth={2.5} style={{ color: "var(--w-primary)" }} />
                    입금자명
                  </label>
                  <input
                    required
                    value={depositor}
                    onChange={(e) => setDepositor(e.target.value)}
                    placeholder="입금하실 분 성함"
                    className="w-input"
                  />
                </div>
              </div>
            )}

            {/* 봇 트랩 — 사람에게는 보이지 않는다 */}
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
              placeholder="홈페이지"
            />

            <label
              className="mt-4 flex items-start gap-2.5 w-caption-1 leading-relaxed cursor-pointer"
              style={{ color: "var(--w-text-sub)" }}
            >
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                주문 유의사항에 동의합니다 — 작업 시작 전 전액 환불, 시작 후 미진행 수량 환불.
                검색 순위·알고리즘 노출은 보장 대상이 아닙니다. 연락처는 주문 확인·조회에만 사용됩니다.{" "}
                <Link
                  href="/refund"
                  target="_blank"
                  className="font-bold underline underline-offset-2"
                  style={{ color: "var(--w-primary)" }}
                >
                  환불 규정
                </Link>
              </span>
            </label>

            {/* 금액 */}
            <div
              className="mt-4 flex items-end justify-between gap-3 border-t pt-4"
              style={{ borderColor: "var(--w-line)" }}
            >
              <div className="min-w-0 w-caption-1" style={{ color: "var(--w-text-muted)" }}>
                <span className="w-num">{won(Math.max(0, effectiveQty))}</span>
                {product.unitLabel} × {won(product.unitPrice)}원
              </div>
              <div className="text-right shrink-0">
                <p className="w-caption-1" style={{ color: "var(--w-text-muted)" }}>
                  결제 금액
                </p>
                <p className="w-num w-heading-2" style={{ color: "var(--w-text)" }}>
                  {won(total)}원
                </p>
              </div>
            </div>

            {error && (
              <div
                className="mt-3 flex items-start gap-2 rounded-[12px] px-4 py-2.5 w-label-2 font-bold"
                style={{ background: "var(--w-danger-weak)", color: "var(--w-danger-dark)" }}
              >
                <AlertTriangle size={14} strokeWidth={2.5} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {/* 회원 — 잔액이 모자라면 결제 전에 알려주고 충전으로 보낸다 */}
            {me && qtyValid && me.balance < total && (
              <div
                className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-[12px] px-4 py-3"
                style={{ background: "var(--w-warning-weak)" }}
              >
                <p className="w-label-2 w-num font-bold" style={{ color: "var(--w-warning-dark)" }}>
                  잔액이 {won(total - me.balance)}원 부족합니다 (보유 {won(me.balance)}원)
                </p>
                <Link
                  href="/sns/charge"
                  className="w-btn w-btn-sm"
                  style={{ background: "var(--w-warning-dark)", color: "#fff" }}
                >
                  충전하기
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || (!!me && me.balance < total)}
              className="w-btn w-btn-primary mt-4 w-full"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} strokeWidth={2.2} />}
              {submitting ? (me ? "결제 중..." : "접수 중...") : me ? "잔액으로 결제하고 주문" : "주문 접수하기"}
            </button>
            <p className="mt-2.5 text-center w-caption-1" style={{ color: "var(--w-text-assist)" }}>
              {me
                ? "예치금에서 즉시 결제되고 바로 시작됩니다. 시작 전에는 전액 환불됩니다."
                : "접수 후 입금 안내가 나옵니다. 입금 전에는 비용이 발생하지 않습니다."}
            </p>
          </section>
        </div>
      </div>
    </form>
  );
}
