import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "이용약관 — 하랑마케팅",
  description: "하랑마케팅 이용약관입니다.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "제1조 (목적)",
    content: `본 약관은 하랑마케팅(이하 "회사")이 제공하는 마케팅 대행 서비스의 이용 조건 및 절차, 회사와 이용자의 권리·의무 등 기본적인 사항을 규정함을 목적으로 합니다.`,
  },
  {
    title: "제2조 (서비스 내용)",
    content: `회사는 다음의 서비스를 제공합니다.\n· 네이버 플레이스 SEO 최적화\n· 블로그 마케팅 및 콘텐츠 제작\n· SNS(인스타그램 등) 마케팅\n· 체험단·리뷰 마케팅\n· 맘카페 바이럴 마케팅\n· 기타 합의된 마케팅 서비스`,
  },
  {
    title: "제3조 (계약 성립)",
    content: `서비스 이용 계약은 이용자의 계약 동의 및 대금 납부 후 회사의 승낙으로 성립합니다. 회사는 계약 시 서비스 범위, 기간, 금액을 명시한 계약서를 제공합니다.`,
  },
  {
    title: "제4조 (이용자의 의무)",
    content: `이용자는 다음 사항을 준수해야 합니다.\n· 허위 정보 제공 금지\n· 서비스 이용에 필요한 정보·자료의 적시 제공\n· 저작권·초상권 등 제3자 권리 침해 행위 금지\n· 서비스 대금의 기한 내 납부`,
  },
  {
    title: "제5조 (회사의 의무)",
    content: `회사는 다음 의무를 이행합니다.\n· 계약된 서비스의 성실한 수행\n· 월별 성과 리포트 제공\n· 이용자 개인정보의 안전한 관리\n· 서비스 관련 문의에 24시간 내 응답`,
  },
  {
    title: "제6조 (계약 해지 및 위약금)",
    content: `· 이용자 귀책으로 인한 중도 해지: 잔여 계약 기간의 30%에 해당하는 위약금 발생\n· 회사 귀책으로 인한 해지: 위약금 없이 환불\n· 양 당사자 합의 해지: 협의 후 진행`,
  },
  {
    title: "제7조 (면책)",
    content: `회사는 다음의 경우 책임을 지지 않습니다.\n· 포털·플랫폼 알고리즘 변경으로 인한 순위 변동\n· 이용자 귀책에 의한 서비스 지연\n· 천재지변, 불가항력적 사유로 인한 서비스 중단`,
  },
  {
    title: "제8조 (준거법)",
    content: `본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 회사 소재지 관할 법원을 전속 관할로 합니다.`,
  },
  {
    title: "부칙",
    content: `본 약관은 2024년 1월 1일부터 시행됩니다.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px] min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
            <ArrowLeft size={14} /> 홈으로
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <FileText size={18} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">이용약관</h1>
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
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-800 underline">개인정보처리방침</Link>
            <Link href="/refund" className="text-xs text-gray-500 hover:text-gray-800 underline">환불·취소 정책</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
