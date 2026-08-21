import "../wds.css";
import "./variants.css";

/** 디자인 미리보기 전용 레이아웃 — WDS 토큰 + 비교용 팔레트만 주입한다(실서비스 화면에는 영향 없음) */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
