import type { Metadata } from "next";

// 관리자 화면 전체를 검색 색인에서 뺀다 (미들웨어 차단·robots.ts 와 삼중 방어)
export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
