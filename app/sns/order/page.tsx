import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ArrowLeft, ShieldCheck, Clock, RotateCcw } from "lucide-react";
import OrderForm from "./OrderForm";

/**
 * 주문 페이지 — ?p=상품slug 로 진입하면 해당 상품이 선택된 상태로 시작한다.
 * 얇은 기능성 페이지라 검색 인덱스에서는 뺀다.
 */

export const metadata: Metadata = {
  title: "주문하기 — SNS 부스트 스토어",
  robots: { index: false, follow: false },
};

/** 주문 전에 궁금해하는 세 가지 — 문구가 아니라 규정이라 여기 고정으로 둔다 */
const ASSURANCES = [
  { icon: ShieldCheck, text: "계정 비밀번호를 받지 않습니다" },
  { icon: Clock, text: "입금 확인 후 24시간 안에 시작" },
  { icon: RotateCcw, text: "시작 전 전액 환불" },
];

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
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <Link
            href="/sns"
            className="inline-flex items-center gap-1.5 w-label-2 font-bold transition-colors"
            style={{ color: "var(--w-text-muted)" }}
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            카탈로그로 돌아가기
          </Link>

          <h1 className="mt-4 w-heading-1" style={{ color: "var(--h-navy)" }}>
            주문하기
          </h1>
          <p className="mt-2 w-body-2" style={{ color: "var(--w-text-muted)" }}>
            채널 · 서비스 종류 · 상세 상품 순으로 세 번만 고르면 됩니다. 회원가입 없이 바로 접수됩니다.
          </p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {ASSURANCES.map((a) => (
              <span
                key={a.text}
                className="inline-flex items-center gap-1.5 w-caption-1"
                style={{ color: "var(--w-text-sub)" }}
              >
                <a.icon size={14} strokeWidth={2.2} style={{ color: "var(--w-primary)" }} />
                {a.text}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <OrderForm initialSlug={p ?? null} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
