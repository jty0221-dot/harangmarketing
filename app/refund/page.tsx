import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "환불·취소 정책",
  description: "하랑마케팅 환불 및 취소 정책입니다.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "1. 기본 원칙",
    content: `하랑마케팅은 투명한 서비스 운영을 원칙으로 합니다. 서비스 시작 전 충분한 상담과 계약서 검토 시간을 드리며, 계약 체결 후에는 아래 기준에 따라 환불·취소를 처리합니다.\n본 정책은 전자상거래 등에서의 소비자보호에 관한 법률을 따르며, 법률이 정한 소비자의 권리를 제한하지 않습니다.`,
  },
  {
    title: "2. 청약철회 기간",
    content: `이용자는 계약 내용을 확인할 수 있는 날부터 7일 이내에 청약을 철회할 수 있습니다.\n다만 서비스 제공이 이미 시작된 부분과 아래 6번의 환불 제한 항목은 청약철회 대상에서 제외됩니다.`,
  },
  {
    title: "3. 계약 전 취소",
    content: `계약서 작성 전 상담 단계에서는 언제든지 취소 가능하며, 비용이 발생하지 않습니다.\n상담 비용은 0원입니다.`,
  },
  {
    title: "4. 계약 후 7일 이내 취소",
    content: `서비스가 아직 시작되지 않았거나 초기 분석 단계(착수 보고서 발행 전)라면 납부 금액의 전액 환불이 가능합니다.`,
  },
  {
    title: "5. 서비스 시작 후 중도 해지",
    content: `서비스 착수(콘텐츠 발행, 계정 세팅 등 포함) 이후 중도 해지 시:\n\n· 잔여 계약 기간 서비스료의 80% 환불 (이미 진행된 작업분 제외)\n· 단, 이용자 귀책 사유(허위 정보 제공, 계약 위반 등)로 인한 해지의 경우 환불 대상에서 제외될 수 있습니다.\n\n예시) 3개월 계약, 1개월 진행 후 해지 시 → 나머지 2개월분의 80% 환불`,
  },
  {
    title: "6. 성과 미달로 인한 환불",
    content: `목표 미달 시 전략을 즉시 수정하며, 성과 불만족으로 인한 해지는 협의 후 처리합니다.\n단순 변심에 의한 환불은 위 기준을 따릅니다.`,
  },
  {
    title: "7. SNS 부스트 스토어 (예치금·건당 주문)",
    content: `가. 주문 취소\n· 작업이 시작되기 전이라면 주문은 전액 취소되고 결제 금액은 예치금으로 되돌아갑니다.\n· 작업이 이미 시작된 주문은 진행된 수량을 제외한 잔여분만 환불됩니다.\n· 회사 사정으로 주문을 완료하지 못한 경우 미진행분 전액을 예치금으로 돌려드립니다.\n\n나. 예치금 잔액 환불\n· 사용하지 않은 예치금 잔액은 언제든지 현금으로 환불받을 수 있습니다.\n· 신용카드로 충전한 금액은 결제 대행사를 통해 결제 취소로 처리하며, 무통장입금으로 충전한 금액은 지정한 계좌로 입금해 드립니다.\n· 환불 신청 시점에 진행 중인 주문이 있으면 그 주문이 끝난 뒤 남은 잔액을 정산합니다.\n· 예치금에는 이자가 붙지 않으며, 환불에 별도 수수료를 받지 않습니다.`,
  },
  {
    title: "8. 하랑 스튜디오 (내려받는 프로그램)",
    content: `· 내려받아 설치하는 디지털 콘텐츠는 이용이 시작되면 청약철회가 제한됩니다.\n· 이 때문에 회사는 구매 전에 사진 100장까지 무료로 써 보실 수 있는 체험을 제공합니다. 반드시 체험으로 확인한 뒤 구매해 주세요.\n· 프로그램이 정상적으로 동작하지 않거나 안내한 기능과 다른 경우에는 전액 환불해 드립니다.`,
  },
  {
    title: "9. 환불 제한 항목",
    content: `다음의 경우 환불이 제한됩니다.\n· 이미 발행·배포된 콘텐츠(블로그 글, SNS 게시물 등)\n· 체험단 모집이 완료된 경우\n· 플랫폼 수수료 등 직접 집행된 외부 비용\n· 이용이 시작된 디지털 콘텐츠(위 8번 참조)\n\n환불이 제한되는 경우에도 회사의 귀책으로 서비스가 제공되지 않았다면 환불 대상입니다.`,
  },
  {
    title: "10. 환불 신청 방법과 처리 기한",
    content: `환불 요청은 아래 연락처로 접수해 주세요.\n· 카카오톡 : @하랑마케팅\n· 이메일 : harangmarketing@naver.com\n· 전화 : 010-7541-9054\n\n· 접수 후 3영업일 이내에 검토 결과를 안내드립니다.\n· 환불이 확정되면 확정일부터 3영업일 이내에 환급합니다.\n· 신용카드 결제분은 결제 대행사에 즉시 취소를 요청하며, 카드사 사정에 따라 승인 취소가 반영되기까지 며칠이 더 걸릴 수 있습니다.\n· 계좌 입금은 이용자가 알려주신 계좌로 처리하며, 예금주가 다르면 확인이 지연될 수 있습니다.`,
  },
  {
    title: "11. 분쟁 해결",
    content: `환불 처리에 이견이 있는 경우 아래 기관에 조정을 신청할 수 있습니다.\n· 한국소비자원 소비자상담센터 : 국번없이 1372 · kca.go.kr\n· 전자거래분쟁조정위원회 : 1661-5714 · ecmc.or.kr`,
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
              <p className="text-xs text-gray-400">하랑마케팅 · 최종 개정: 2026년 8월 30일</p>
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
