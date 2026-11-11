"use client";

import { useEffect } from "react";
import { captureAttribution, attributionLabel } from "../lib/attribution";
import { GA_EVENTS } from "./Analytics";

/**
 * 유입 경로 저장 + 연락 클릭 전환 측정.
 *
 * 카카오 상담·전화 버튼은 사이트 곳곳(헤더·하단 바·상담 페이지·진단 페이지)에 흩어져 있다.
 * 버튼마다 onClick 을 다는 대신 문서 전체에서 한 번만 듣는다.
 * GA_EVENTS.kakaoClick / phoneClick 은 만들어만 두고 부르는 곳이 없던 함수다.
 *
 * 화면에는 아무것도 그리지 않는다.
 */
export default function AttributionTracker() {
  useEffect(() => {
    captureAttribution();

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const label = attributionLabel();
      const where = `${location.pathname}${label ? ` · ${label}` : ""}`.slice(0, 100);
      if (href.startsWith("tel:")) GA_EVENTS.phoneClick(where);
      else if (href.includes("pf.kakao.com")) GA_EVENTS.kakaoClick(where);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
