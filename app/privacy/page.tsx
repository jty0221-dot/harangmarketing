import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "개인정보처리방침 — 하랑마케팅",
  description: "하랑마케팅의 개인정보처리방침입니다.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "1. 수집하는 개인정보",
    content: `하랑마케팅은 상담 신청 시 다음의 개인정보를 수집합니다.\n· 성명, 연락처(전화번호), 업종, 문의 내용\n· 서비스 계약 시: 사업자등록번호, 이메일 주소\n· 자동 수집 정보: 접속 IP, 방문 일시, 브라우저 정보 (쿠키 등)`,
  },
  {
    title: "2. 수집 목적",
    content: `· 상담 및 견적 제공\n· 서비스 계약 및 이행\n· 서비스 개선 및 통계 분석\n· 법령상 의무 이행`,
  },
  {
    title: "3. 보유 및 이용 기간",
    content: `· 상담 문의: 상담 완료 후 1년\n· 서비스 계약 정보: 계약 종료 후 5년 (전자상거래법 기준)\n· 단, 법령에 별도 보유 기간이 정해진 경우 해당 기간 준수`,
  },
  {
    title: "4. 제3자 제공",
    content: `하랑마케팅은 원칙적으로 수집한 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 의한 경우 또는 정보주체의 동의가 있는 경우는 예외입니다.`,
  },
  {
    title: "5. 개인정보의 파기",
    content: `보유 기간이 만료되거나 목적이 달성된 개인정보는 지체 없이 파기합니다.\n· 전자 파일: 복원 불가능한 방법으로 영구 삭제\n· 서면: 분쇄 또는 소각`,
  },
  {
    title: "6. 정보주체의 권리",
    content: `정보주체는 언제든지 다음의 권리를 행사할 수 있습니다.\n· 개인정보 조회·수정·삭제 요청\n· 처리 정지 요청\n· 요청 연락처: harangmarketing@naver.com`,
  },
  {
    title: "7. 쿠키 사용",
    content: `웹사이트는 서비스 개선을 위해 쿠키를 사용합니다. 브라우저 설정에서 쿠키 허용 여부를 변경할 수 있으며, 쿠키를 거부해도 서비스 이용은 가능합니다.`,
  },
  {
    title: "8. 개인정보 보호책임자",
    content: `· 책임자: 전태영 (대표)\n· 이메일: harangmarketing@naver.com\n· 전화: 010-7541-9054`,
  },
  {
    title: "9. 시행일",
    content: `본 방침은 2024년 1월 1일부터 시행됩니다.`,
  },
];

export default function PrivacyPage() {
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
              <ShieldCheck size={18} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">개인정보처리방침</h1>
              <p className="text-xs text-gray-400">하랑마케팅 · 최종 수정: 2024년 1월 1일</p>
            </div>
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
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-800 underline">이용약관</Link>
            <Link href="/refund" className="text-xs text-gray-500 hover:text-gray-800 underline">환불·취소 정책</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
