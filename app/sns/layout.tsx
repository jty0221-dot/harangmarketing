import type { Metadata } from "next";
import "./theme.css";

// 주문·충전·로그인·마이페이지 등 기능 화면은 색인하지 않는다.
// 공개 랜딩 /sns 는 자기 metadata 에서 index true 로 되살린다 (metadata 는 최상위 키 단위로 병합된다).
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * /sns/* 공통 레이아웃 — 원티드 디자인 시스템 기반 토큰(theme.css)을 주입한다.
 * 화면 구조는 각 페이지가 그대로 관리한다(헤더·푸터 포함).
 */
export default function SnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
