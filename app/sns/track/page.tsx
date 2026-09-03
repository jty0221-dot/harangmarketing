import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ArrowLeft } from "lucide-react";
import TrackForm from "./TrackForm";

export const metadata: Metadata = {
  title: "주문 조회 | SNS 부스트 스토어",
  robots: { index: false, follow: false },
};

export default function SnsTrackPage() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px] min-h-screen" style={{ background: "var(--h-bg)" }}>
        <div className="max-w-xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <Link
            href="/sns"
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            스토어로 돌아가기
          </Link>

          <h1 className="mt-4 text-2xl md:text-3xl font-black" style={{ color: "var(--h-navy)", letterSpacing: "-0.03em" }}>
            주문 조회
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            주문번호와 주문할 때 남긴 연락처를 입력하면 진행 상황이 나옵니다.
          </p>

          <div className="mt-6">
            <TrackForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
