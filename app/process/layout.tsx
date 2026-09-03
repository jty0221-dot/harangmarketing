import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "진행 과정 | 상담부터 성과까지 6단계",
  description: "하랑마케팅과 함께하면 어떻게 진행되나요? 무료 상담 신청부터 경쟁사 분석, 전략 제안, 계약, 실행, 월간 리포트까지 6단계 프로세스를 확인하세요.",
  openGraph: {
    title: "진행 과정 | 하랑마케팅",
    description: "상담부터 성과까지 6단계 진행 과정을 미리 확인하세요.",
    url: "https://www.harangmarketing.com/process",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 진행 과정" }],
  },
};

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
