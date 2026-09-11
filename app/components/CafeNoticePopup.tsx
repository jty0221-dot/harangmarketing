"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Megaphone, X, ArrowRight, ArrowLeft } from "lucide-react";
import {
  CAFE_NOTICE,
  NOTICE_STORAGE_KEY,
  CAFE_PAGES,
  CAFE_GROUPS_TOTAL,
  NOTICE_PAGES,
  cafeSheetAlt,
  groupPrice,
  noticeShowsOn,
} from "../lib/cafe-notice";
import { won } from "../lib/cafe-distribution";

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
 * 2026-09-11 (금) 대표 지시 「팝업 크기 조정해 2장으로 쪼개던지」 로 두 장이 됐다.
 * 한 장에 다 담았더니 375px 화면에서 내용 1,243px 이 창 503px 안에 들어가 740px 을 굴려야 했다.
 * 1장은 공지 본문, 2장부터가 카페 표다. 머리글과 버튼 줄은 굴러가지 않고 제자리에 남는다.
 * 카페 목록은 640px 이상에서 두 칸으로 나뉜다. 세로로 세우면 PC 에서도 창을 넘긴다.
 *
 * 같은 날 다시 「팝업 자체를 조금 늘려서 이미지나 로고 까지 같이 올라갈 수 있게 해줘 ·
 * 보면 못알아봐 고객 입장에서 항상 생각하라고」 가 왔다. 줄마다 로고를 28px 로 붙였더니
 * 「아니 그냥 로고 이미지에 있는 사진 그대로 팝업으로 만들어서 띄워」 가 돌아왔다 —
 * 글자로 다시 그린 표가 아니라 배포처가 넘긴 캡처 자체를 올리라는 뜻이다.
 * 그래서 표를 걷고 캡처를 묶음별로 잘라 넣었다. 잘라낸 것은 배포처 도매가 열과
 * 「화력보장」 배지 열 둘뿐이고 번호 · NEW 리본 · 로고 · 이름은 원본 픽셀 그대로다.
 * 자른 근거는 cafe-notice.ts 의 CAFE_GROUPS 주석에 적었다.
 * 그림에는 금액이 없으므로 단가는 묶음 머리에 글자로 붙는다 (groupPrice).
 * 장 수는 NOTICE_PAGES 가 센다 — 공지 한 장 · 대표카페 한 장 · 나머지 한 장이다.
 * PC 폭 520px 에서 그림(422px)은 원본 크기로 뜨고 모바일에서는 카드 폭에 맞춰 줄어든다.
 * 세로는 못 늘린다 — 위는 고정 헤더, 아래는 챗봇 버튼이라 본문만 굴러간다.
 * 이미지를 늦게 받는 lazy 설정은 쓰지 않는다. 이 카드는 fixed 로 떠 있어 브라우저가 화면
 * 밖으로 판정해 빈 칸으로 남는다. decoding 을 async 로 두고 width/height 로 대신한다.
 *
 * 높이를 vh 비율(52vh)로 잘랐더니 375x667 화면에서 카드 위쪽 20px 이 창 밖으로 나갔다.
 * 화면이 줄어도 머리글 · 버튼 줄 · 바깥 여백은 같이 줄지 않아서 합이 창을 넘긴 것이다.
 * 그래서 비율을 쓰지 않는다. top/bottom 으로 들어갈 상자를 먼저 잡고 카드를 세로 flex 로
 * 세운 뒤 본문에만 남은 높이를 준다. 상자 밖으로 나갈 자리가 없으니 어느 화면에서도 안 잘린다.
 * 위쪽 여백은 헤더를 피해서 잡는다. 고정 헤더가 모바일에서 103px 이라 top-16(64px)으로
 * 두면 카드가 헤더 아래 절반을 덮었다. top-28(112px) · sm:top-32(128px) 로 내려 비켜 세운다.
 *
 * 문구와 카페 명단은 전부 app/lib/cafe-notice.ts 에 있고, 단가는 groupPrice() 가
 * cafe-distribution.ts 의 등급표에서 찾아온다. 이 파일에는 문장도 숫자도 적지 않는다.
 */
export default function CafeNoticePopup() {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [page, setPage] = useState(1);
  const bodyRef = useRef<HTMLDivElement>(null);

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

  /** 장을 넘길 때 본문을 맨 위로 되돌린다. 2장 중간에서 시작하면 첫 줄을 놓친다 */
  const goto = (next: number) => {
    setPage(next);
    bodyRef.current?.scrollTo({ top: 0 });
  };

  if (!open) return null;

  return (
    <aside
      aria-label={CAFE_NOTICE.title}
      className="pointer-events-none fixed z-[9998] left-4 right-4 top-28 bottom-44 flex items-end sm:left-auto sm:right-6 sm:top-32 sm:bottom-24 sm:w-[520px]"
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
        className="pointer-events-auto relative flex max-h-full w-full flex-col overflow-hidden rounded-2xl"
        style={{
          background: "var(--w-bg)",
          border: "1px solid var(--w-line-strong)",
          boxShadow: "var(--w-shadow-lg)",
        }}
      >
        <button
          onClick={dismiss}
          aria-label="공지 닫기"
          className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-[var(--w-fill)]"
        >
          <X size={16} style={{ color: "var(--w-label-assistive)" }} />
        </button>

        {/* 머리글. 두 장 모두 같은 자리에 남는다 */}
        <div className="shrink-0 px-4 pr-12 pt-4 sm:px-5 sm:pr-12 sm:pt-5">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "var(--w-primary)" }}
            >
              <Megaphone size={13} strokeWidth={2.5} style={{ color: "var(--w-text-inverse)" }} />
            </span>
            <span className="w-label-2 shrink-0 font-bold" style={{ color: "var(--w-primary-strong)" }}>
              {CAFE_NOTICE.eyebrow}
            </span>
            <span className="w-caption-1 truncate" style={{ color: "var(--w-label-assistive)" }}>
              {CAFE_NOTICE.date}
            </span>
            <span
              className="w-caption-1 ml-auto shrink-0 tabular-nums"
              style={{ color: "var(--w-label-assistive)" }}
            >
              {page} / {NOTICE_PAGES}
            </span>
          </div>

          {page === 1 ? (
            <>
              <h2 className="w-title-3 mt-2" style={{ color: "var(--w-label-strong)" }}>
                {CAFE_NOTICE.title}
              </h2>
              <p className="w-caption-1 mt-1.5" style={{ color: "var(--w-label-alt)" }}>
                {CAFE_NOTICE.intro}
              </p>
            </>
          ) : (
            <>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <h2 className="w-title-3" style={{ color: "var(--w-label-strong)" }}>
                  {CAFE_NOTICE.cafeTitle}
                </h2>
                <span
                  className="w-label-2 shrink-0 font-bold tabular-nums"
                  style={{ color: "var(--w-primary-strong)" }}
                >
                  {CAFE_GROUPS_TOTAL}곳
                </span>
              </div>
              <p className="w-caption-1 mt-1.5" style={{ color: "var(--w-label-alt)" }}>
                {CAFE_NOTICE.cafeLeadSub}
              </p>
            </>
          )}
        </div>

        {/* 본문. 여기만 굴러간다 */}
        <div
          ref={bodyRef}
          className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3.5 sm:px-5"
        >
          {page === 1 ? (
            <>
              <ul className="space-y-3">
                {CAFE_NOTICE.points.map((p) => (
                  <li key={p.no} className="flex gap-2.5">
                    <span
                      className="mt-0.5 flex h-5 shrink-0 items-center rounded px-1.5 text-[10px] font-bold"
                      style={{ background: "var(--w-primary)", color: "var(--w-text-inverse)" }}
                    >
                      {p.no}
                    </span>
                    <div className="min-w-0">
                      <p
                        className="w-label-2 font-semibold"
                        style={{ color: "var(--w-label-strong)" }}
                      >
                        {p.label}
                      </p>
                      <p className="w-caption-1 mt-0.5" style={{ color: "var(--w-label-alt)" }}>
                        {p.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div
                className="mt-3.5 space-y-1.5 border-t pt-3.5"
                style={{ borderColor: "var(--w-line)" }}
              >
                {CAFE_NOTICE.closing.map((line) => (
                  <p key={line} className="w-caption-1" style={{ color: "var(--w-label-alt)" }}>
                    {line}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3">
                {(CAFE_PAGES[page - 2] ?? []).map((g) => {
                  const price = groupPrice(g.grade);
                  return (
                    <div key={g.label}>
                      <div
                        className="flex items-baseline justify-between gap-3 border-b pb-1.5"
                        style={{ borderColor: "var(--w-line-strong)" }}
                      >
                        <p
                          className="w-label-2 font-bold"
                          style={{ color: "var(--w-label-strong)" }}
                        >
                          {g.label}
                        </p>
                        {price !== undefined && (
                          <p
                            className="w-label-2 shrink-0 font-bold tabular-nums"
                            style={{ color: "var(--w-primary-strong)" }}
                          >
                            {won(price)}
                          </p>
                        )}
                      </div>

                      {g.note && (
                        <p
                          className="w-caption-1 mt-1"
                          style={{ color: "var(--w-label-assistive)" }}
                        >
                          {g.note}
                        </p>
                      )}

                      <div className="-mx-4 mt-2 sm:-mx-5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={g.sheet.src}
                          alt={cafeSheetAlt(g)}
                          width={g.sheet.width}
                          height={g.sheet.height}
                          decoding="async"
                          className="mx-auto block h-auto w-full"
                          style={{ maxWidth: g.sheet.width }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {page === NOTICE_PAGES && (
                <p className="w-caption-1 mt-3" style={{ color: "var(--w-label-assistive)" }}>
                  {CAFE_NOTICE.tierNote}
                </p>
              )}
            </>
          )}
        </div>

        {/* 버튼 줄. 굴러가지 않는다. 2장 맨 아래까지 내려가야 닫기가 보이면 안 된다 */}
        <div
          className="flex shrink-0 items-center gap-2 border-t px-4 py-3 sm:px-5"
          style={{ borderColor: "var(--w-line)", background: "var(--w-bg)" }}
        >
          {page > 1 && (
            <button onClick={() => goto(page - 1)} className="w-btn w-btn-ghost shrink-0">
              <ArrowLeft size={14} strokeWidth={2.5} />
              {CAFE_NOTICE.nav.prev}
            </button>
          )}
          {page < NOTICE_PAGES ? (
            <button
              onClick={() => goto(page + 1)}
              className="w-btn w-btn-primary flex-1"
            >
              {page === 1 ? CAFE_NOTICE.nav.next : CAFE_NOTICE.nav.more}
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          ) : (
            <Link
              href={CAFE_NOTICE.cta.href}
              onClick={dismiss}
              className="w-btn w-btn-primary flex-1"
            >
              {CAFE_NOTICE.cta.label}
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          )}
          {page === 1 && (
            <button onClick={dismiss} className="w-btn w-btn-ghost shrink-0">
              {CAFE_NOTICE.dismiss}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
