import "./theme.css";

/**
 * /sns/* 공통 레이아웃 — 원티드 디자인 시스템 기반 토큰(theme.css)을 주입한다.
 * 화면 구조는 각 페이지가 그대로 관리한다(헤더·푸터 포함).
 */
export default function SnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
