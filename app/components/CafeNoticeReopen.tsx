"use client";

import { Megaphone } from "lucide-react";
import { NOTICE_OPEN_EVENT } from "../lib/cafe-notice";

/**
 * 카페 목록 다시 보기 버튼 (2026-09-20 · 요청 69)
 *
 * 대표카페 운영 변경 안내는 한 번 닫으면 다시 뜨지 않는다 (CafeNoticePopup · localStorage).
 * 카페 배포 페이지의 카드에는 카페 이름을 찍지 않으므로 (2026-09-09 (수) 대표 지시),
 * 안내를 닫은 사람이 목록을 다시 보려면 길이 없었다. 이 버튼이 NOTICE_OPEN_EVENT 를 보내면
 * SiteChrome 이 항상 올려 두는 CafeNoticePopup 이 첫 장부터 다시 연다.
 * 닫기 기록은 건드리지 않는다. 직접 눌러서 여는 것이라 다음 방문에 저절로 뜨면 안 된다.
 * 색은 .cafe-dist 스코프의 --cd-* 토큰만 쓴다. 재촉 문구와 깜빡임은 없다.
 */
export default function CafeNoticeReopen() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(NOTICE_OPEN_EVENT))}
      className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-[10px] px-4 text-[14px] font-black transition-opacity hover:opacity-80 md:text-[15px]"
      style={{ color: "var(--cd-primary)", border: "1px solid var(--cd-primary)", background: "#fff" }}
    >
      <Megaphone size={16} strokeWidth={2.5} aria-hidden="true" />
      카페 목록 다시 보기
    </button>
  );
}
