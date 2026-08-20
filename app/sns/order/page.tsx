import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ArrowLeft } from "lucide-react";
import OrderForm from "./OrderForm";

/**
 * 주문 페이지 — ?p=상품slug 로 진입하면 해당 상품이 선택된 상태로 시작한다.
 * 얇은 기능성 페이지라 검색 인덱스에서는 뺀다.
 */

export const metadata: Metadata = {
  title: "주문하기 — SNS 부스트 스토어",
  robots: { index: false, follow: false },
};

export default async function SnsOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;

  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px] min-h-screen" style={{ background: "var(--h-bg)" }}>
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <Link
            href="/sns"
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            카탈로그로 돌아가기
          </Link>

          <h1 className="mt-4 text-2xl md:text-3xl font-black" style={{ color: "var(--h-navy)", letterSpacing: "-0.03em" }}>
            주문하기
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            회원가입 없이 바로 접수됩니다. 계정 비밀번호는 받지 않습니다.
          </p>

          <div className="mt-6">
            <OrderForm initialSlug={p ?? null} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
