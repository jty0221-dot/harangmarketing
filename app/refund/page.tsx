import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "환불·취소 정책 — 하랑마케팅",
  description: "하랑마케팅 환불 및 취소 정책입니다.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "1. 기본 원칙",
    content: `하랑마케팅은 투명한 서비스 운영을 원칙으로 합니다. 서비스 시작 전 충분한 상담과 계약서 검토 시간을 드리며, 계약 체결 후에는 아래 기준에 따라 환불·취소를 처리합니다.`,
  },
  {
    title: "2. 계약 전 취소",
    content: `계약서 작성 전 상담 단계에서는 언제든지 취소 가능하며, 비용이 발생하지 않습니다.\n상담 비용은 0원입니다.`,
  },
  {
    title: "3. 계약 후 7일 이내 취소",
    content: `서비스가 아직 시작되지 않았거나 초기 분석 단계(착수 보고서 발행 전)라면 납부 금액의 전액 환불이 가능합니다.`,
  },
  {
    title: "4. 서비스 시작 후 중도 해지",
    content: `서비스 착수(콘텐츠 발행, 계정 세팅 등 포함) 이후 중도 해지 시:\n\n· 잔여 계약 기간 서비스료의 80% 환불 (이미 진행된 작업분 제외)\n· 단, 이용자 귀책 사유(허위 정보 제공, 계약 위반 등)로 인한 해지의 경우 환불 대상에서 제외될 수 있습니다.\n\n예시) 3개월 계약, 1개월 진행 후 해지 시 → 나머지 2개월분의 80% 환불`,
  },
  {
    title: "5. 성과 미달로 인한 환불",
    content: `목표 미달 시 전략을 즉시 수정하며, 성과 불만족으로 인한 해지는 협의 후 처리합니다.\n단순 변심에 의한 환불은 위 기준을 따릅니다.`,
  },
  {
    title: "6. 환불 불가 항목",
    content: `다음의 경우 환불이 제한됩니다.\n· 이미 발행·배포된 콘텐츠(블로그 글, SNS 게시물 등)\n· 체험단 모집이 완료된 경우\n· 플랫폼 수수료 등 직접 집행된 외부 비용`,
  },
  {
    title: "7. 환불 신청 방법",
    content: `환불 요청은 아래 연락처로 접수해 주세요.\n· 카카오톡: @하랑마케팅\n· 이메일: harangmarketing@naver.com\n· 전화: 010-7541-9054\n\n접수 후 3영업일 이내에 검토 결과를 안내드립니다.`,
  },
];

export default function RefundPage() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px] min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
            <ArrowLeft size={14} /> 홈으로
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <RefreshCw size={18} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">환불·취소 정책</h1>
              <p className="text-xs text-gray-400">하랑마케팅 · 최종 수정: 2024년 1월 1일</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-6">
            <p className="text-sm text-blue-700 font-semibold">
              환불·취소 관련 궁금한 점은 언제든지 카카오톡 또는 전화로 문의하시면 친절하게 안내해드립니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
            {SECTIONS.map((sec) => (
              <div key={sec.title} className="p-6">
                <h2 className="text-sm font-black text-gray-900 mb-3">{sec.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{sec.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3 flex-wrap">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-800 underline">개인정보처리방침</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-800 underline">이용약관</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
