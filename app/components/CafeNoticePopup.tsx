"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Megaphone, X, ArrowRight, Coffee } from "lucide-react";
import {
  CAFE_NOTICE,
  NOTICE_STORAGE_KEY,
  PARTNER_CAFES,
  noticeShowsOn,
} from "../lib/cafe-notice";
import { CAFE_TIERS, won } from "../lib/cafe-distribution";

/**
 * 대표카페 운영 공지 카드
 *
 * EntryPopup 과 같은 문법을 쓴다. 화면을 덮지 않고 구석에 붙는 카드다.
 * 배경을 어둡게 깔지 않아 뒤 내용을 계속 볼 수 있고, 닫으면 다시 뜨지 않는다.
 *
 * EntryPopup 과 다른 점이 셋이다.
 *   1) sessionStorage 가 아니라 localStorage 다. 공지는 브라우저를 닫았다 열어도
 *      한 번 읽었으면 끝이어야 한다. 상담 권유 카드와 성격이 다르다
 *   2) 스크롤 조건이 없다. 공지는 늦게 보여 줄 이유가 없어 0.8초 뒤 바로 띄운다
 *   3) 뜨는 경로가 정해져 있다 (NOTICE_PATHS). 카페 배포를 보러 온 사람에게만 뜬다
 *
 * 문구는 전부 app/lib/cafe-notice.ts 에 있고, 단가는 cafe-distribution.ts 의
 * CAFE_TIERS 를 읽는다. 이 파일에는 문장도 숫자도 적지 않는다.
 */
export default function CafeNoticePopup() {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const onNoticePath = noticeShowsOn(pathname);

  useEffect(() => {
    if (!onNoticePath) return;

    // 시크릿 창이나 저장소 차단 설정에서는 읽기 자체가 예외를 던진다.
    // 기록을 못 읽는 것과 안 읽은 것은 다르지만, 공지는 한 번 더 뜨는 쪽이 낫다.
    try {
      if (localStorage.getItem(NOTICE_STORAGE_KEY)) return;
    } catch {
      /* 저장소를 못 쓰는 브라우저. 그냥 띄운다 */
    }

    const timer = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(timer);
  }, [onNoticePath]);

  const dismiss = () => {
    try {
      localStorage.setItem(NOTICE_STORAGE_KEY, "1");
    } catch {
      /* 못 적어도 닫히기는 해야 한다 */
    }
    setClosing(true);
    setTimeout(() => setOpen(false), 180);
  };

  if (!open) return null;

  return (
    <aside
      aria-label={CAFE_NOTICE.title}
      className="fixed z-[9998] left-4 right-4 bottom-44 sm:left-auto sm:right-6 sm:bottom-24 sm:w-[380px]"
      style={{
        animation: closing
          ? "haNoticeOut 0.18s ease both"
          : "haNoticeIn 0.32s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <style>{`
        @keyframes haNoticeIn  { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform:none } }
        @keyframes haNoticeOut { from { opacity:1 } to { opacity:0; transform: translateY(8px) } }
      `}</style>

      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "var(--w-bg)",
          border: "1px solid var(--w-line-strong)",
          boxShadow: "var(--w-shadow-lg)",
        }}
      >
        <button
          onClick={dismiss}
          aria-label="공지 닫기"
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-[var(--w-fill)]"
        >
          <X size={16} style={{ color: "var(--w-label-assistive)" }} />
        </button>

        <div className="max-h-[62vh] overflow-y-auto p-5 pr-12">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "var(--w-primary)" }}
            >
              <Megaphone size={13} strokeWidth={2.5} style={{ color: "var(--w-text-inverse)" }} />
            </span>
            <span className="w-label-2 font-bold" style={{ color: "var(--w-primary-strong)" }}>
              {CAFE_NOTICE.eyebrow}
            </span>
            <span className="w-caption-1" style={{ color: "var(--w-label-assistive)" }}>
              {CAFE_NOTICE.date}
            </span>
          </div>

          <h2 className="w-title-3 mt-2" style={{ color: "var(--w-label-strong)" }}>
            {CAFE_NOTICE.title}
          </h2>
          <p className="w-caption-1 mt-1.5" style={{ color: "var(--w-label-alt)" }}>
            {CAFE_NOTICE.intro}
          </p>

          <ul className="mt-4 space-y-3">
            {CAFE_NOTICE.points.map((p) => (
              <li key={p.no} className="flex gap-2.5">
                <span
                  className="mt-0.5 flex h-5 shrink-0 items-center rounded px-1.5 text-[10px] font-bold"
                  style={{ background: "var(--w-primary)", color: "var(--w-text-inverse)" }}
                >
                  {p.no}
                </span>
                <div className="min-w-0">
                  <p className="w-label-2 font-semibold" style={{ color: "var(--w-label-strong)" }}>
                    {p.label}
                  </p>
                  <p className="w-caption-1 mt-0.5" style={{ color: "var(--w-label-alt)" }}>
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {PARTNER_CAFES.length > 0 && (
            <div className="mt-4">
              <p className="w-caption-1" style={{ color: "var(--w-label-alt)" }}>
                {CAFE_NOTICE.cafeLead}
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-2">
                {PARTNER_CAFES.map((c) => (
                  <li
                    key={c.label}
                    className="overflow-hidden rounded-lg"
                    style={{ border: "1px solid var(--w-line)" }}
                  >
                    {c.img ? (
                      <img
                        src={c.img}
                        alt={`${c.label} 노출 화면`}
                        width={320}
                        height={240}
                        className="block h-20 w-full object-cover object-top"
                        style={{ background: "var(--w-fill)" }}
                      />
                    ) : (
                      <div
                        className="flex h-20 w-full items-center justify-center"
                        style={{ background: "var(--w-fill)" }}
                      >
                        <Coffee
                          size={18}
                          strokeWidth={2}
                          style={{ color: "var(--w-label-assistive)" }}
                        />
                      </div>
                    )}
                    <div className="p-2">
                      <p
                        className="w-caption-1 truncate font-semibold"
                        style={{ color: "var(--w-label-strong)" }}
                      >
                        {c.label}
                      </p>
                      <p
                        className="w-caption-1 mt-0.5 truncate"
                        style={{ color: "var(--w-label-assistive)" }}
                      >
                        {c.kind}
                      </p>
                      {c.members && (
                        <p
                          className="w-caption-1 truncate"
                          style={{ color: "var(--w-label-assistive)" }}
                        >
                          {c.members}
                        </p>
                      )}
                      {c.isNew && (
                        <span
                          className="mt-1 inline-flex h-4 items-center rounded px-1 text-[10px] font-bold"
                          style={{ background: "var(--w-primary)", color: "var(--w-text-inverse)" }}
                        >
                          신규
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            className="mt-4 rounded-lg p-3"
            style={{ background: "var(--w-bg-alt)", border: "1px solid var(--w-line)" }}
          >
            <p className="w-caption-1" style={{ color: "var(--w-label-alt)" }}>
              {CAFE_NOTICE.tierLead}
            </p>

            <dl className="mt-2.5 space-y-2">
              {CAFE_TIERS.map((t) => (
                <div key={t.grade} className="flex items-baseline justify-between gap-3">
                  <dt className="w-caption-1 font-semibold" style={{ color: "var(--w-label-strong)" }}>
                    {t.grade}
                  </dt>
                  <dd
                    className="w-caption-1 shrink-0 font-bold tabular-nums"
                    style={{ color: "var(--w-primary-strong)" }}
                  >
                    {won(t.price)}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="w-caption-1 mt-2.5" style={{ color: "var(--w-label-assistive)" }}>
              {CAFE_NOTICE.tierNote}
            </p>
          </div>

          <div className="mt-3.5 space-y-1.5">
            {CAFE_NOTICE.closing.map((line) => (
              <p key={line} className="w-caption-1" style={{ color: "var(--w-label-alt)" }}>
                {line}
              </p>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Link
              href={CAFE_NOTICE.cta.href}
              onClick={dismiss}
              className="w-btn w-btn-primary flex-1"
            >
              {CAFE_NOTICE.cta.label}
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
            <button onClick={dismiss} className="w-btn w-btn-ghost">
              {CAFE_NOTICE.dismiss}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
