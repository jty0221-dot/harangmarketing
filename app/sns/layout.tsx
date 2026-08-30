import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "./theme.css";
import { SNS_STORE_ENABLED } from "../lib/feature-flags";

// 주문·충전·로그인·마이페이지 등 기능 화면은 색인하지 않는다.
// 공개 랜딩 /sns 는 자기 metadata 에서 index true 로 되살린다 (metadata 는 최상위 키 단위로 병합된다).
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * /sns/* 공통 레이아웃 — 원티드 디자인 시스템 기반 토큰(theme.css)을 주입한다.
 * 화면 구조는 각 페이지가 그대로 관리한다(헤더·푸터 포함).
 *
 * 스토어를 감춘 동안에는 여기서 한 번에 404 로 보낸다. 하위 7개 화면(/sns · order ·
 * track · charge · login · signup · me)이 전부 이 레이아웃을 지나므로 페이지마다
 * 손댈 필요가 없고, 되살릴 때도 스위치 한 곳만 켜면 된다.
 */
export default function SnsLayout({ children }: { children: React.ReactNode }) {
  if (!SNS_STORE_ENABLED) notFound();
  return <>{children}</>;
}
