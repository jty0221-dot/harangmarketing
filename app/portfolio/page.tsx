import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPortfolio } from "../lib/portfolio";
import PortfolioGrid from "./PortfolioGrid";

export const metadata: Metadata = {
  title: "업종별 마케팅 사례",
  description:
    "음식점·카페·병원·미용실·학원부터 인테리어·여행까지, 하랑마케팅이 직접 진행한 업종별 마케팅 사례를 모았습니다.",
};

export default function PortfolioPage() {
  const { industries, total, generatedAt } = getPortfolio();

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "var(--w-bg-alt)" }}>
        <div className="mx-auto max-w-[1100px] px-5 py-12 md:py-16">
          <div className="mb-8">
            <span className="w-chip w-chip-blue">
              <Briefcase size={12} strokeWidth={2.5} />
              PORTFOLIO
            </span>
            <h1 className="w-heading-1 mt-3" style={{ color: "var(--w-label-strong)" }}>
              업종별 마케팅 사례
            </h1>
            <p className="w-body-1 mt-3 max-w-[640px]" style={{ color: "var(--w-label-alt)" }}>
              직접 진행한 <strong style={{ color: "var(--w-primary)" }}>{total}건</strong>의 사례입니다.
              업종을 고르면 우리 매장과 비슷한 곳이 어떻게 달라졌는지 바로 확인하실 수 있습니다.
            </p>
          </div>

          <PortfolioGrid industries={industries} />

          <div
            className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-[16px] px-7 py-8"
            style={{ background: "var(--w-label-strong)" }}
          >
            <div>
              <p className="w-title-2" style={{ color: "#fff" }}>
                우리 매장은 어떻게 될지 궁금하세요?
              </p>
              <p className="w-body-2 mt-1.5" style={{ color: "var(--w-label-disable)" }}>
                상담 비용 없음 · 계약 강요 없음 · 24시간 내 연락
              </p>
            </div>
            <Link href="/contact" className="w-btn w-btn-primary">
              무료 진단 신청
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          {generatedAt && (
            <p className="w-caption-1 mt-6 text-center" style={{ color: "var(--w-label-assistive)" }}>
              최종 갱신 {generatedAt}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
