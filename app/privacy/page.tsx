import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "하랑마케팅의 개인정보처리방침입니다.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "1. 수집하는 개인정보 항목",
    content: `가. 상담 신청\n· 성명, 연락처(휴대전화번호), 업종, 문의 내용\n\n나. 서비스 계약\n· 상호, 사업자등록번호, 대표자명, 이메일 주소, 세금계산서 발행 정보\n\n다. SNS 부스트 스토어 회원 가입\n· 성명, 휴대전화번호, 비밀번호(단방향 암호화하여 저장)\n· 결제·충전 내역, 주문 내역, 예치금 잔액\n\n라. 자동으로 수집되는 정보\n· 접속 IP, 방문 일시, 브라우저 및 기기 정보, 쿠키, 서비스 이용 기록`,
  },
  {
    title: "2. 개인정보의 처리 목적",
    content: `· 상담 접수와 답변, 견적 안내\n· 서비스 계약의 체결과 이행, 요금 정산\n· 회원 식별과 로그인 유지, 예치금 관리, 주문 처리\n· 결제 대금 승인과 취소, 환불 처리\n· 서비스 개선과 통계 분석\n· 법령상 의무 이행\n\n회사는 위 목적 외의 용도로 개인정보를 이용하지 않으며, 목적이 변경되는 경우 사전에 동의를 받습니다.`,
  },
  {
    title: "3. 보유 및 이용 기간",
    content: `· 상담 문의: 상담 완료 후 1년\n· 서비스 계약 정보: 계약 종료 후 5년\n· 회원 정보: 회원 탈퇴 시 지체 없이 파기. 단, 예치금 잔액이 남아 있는 경우 정산 완료까지 보관\n\n다음은 관계 법령에 따라 정해진 기간 동안 보관합니다.\n· 계약 또는 청약철회에 관한 기록: 5년 (전자상거래법)\n· 대금 결제 및 재화 공급에 관한 기록: 5년 (전자상거래법)\n· 소비자 불만 또는 분쟁 처리에 관한 기록: 3년 (전자상거래법)\n· 표시·광고에 관한 기록: 6개월 (전자상거래법)\n· 세금계산서 등 거래 증빙: 5년 (국세기본법)\n· 접속 기록: 3개월 (통신비밀보호법)`,
  },
  {
    title: "4. 개인정보의 제3자 제공",
    content: `회사는 원칙적으로 수집한 개인정보를 제3자에게 제공하지 않습니다.\n다만 다음의 경우에는 예외로 합니다.\n· 정보주체가 사전에 동의한 경우\n· 법령에 특별한 규정이 있거나 수사기관이 법령에 정해진 절차와 방법에 따라 요구하는 경우\n\n체험단·리뷰 마케팅과 같이 이용자의 정보를 외부 참여자에게 전달해야 하는 서비스는 계약 단계에서 제공 항목과 대상을 따로 안내하고 동의를 받은 뒤에만 진행합니다.`,
  },
  {
    title: "5. 개인정보 처리의 위탁",
    content: `회사는 서비스 운영을 위해 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다.\n\n· Vercel Inc. : 웹사이트 호스팅과 서버 운영\n· Neon Inc. : 데이터베이스 보관\n· 주식회사 코리아포트원(PortOne) : 신용카드 결제 처리와 결제 대행\n· Google LLC : 방문 통계 분석(Google Analytics)\n\n위탁 계약 시 개인정보 보호 관련 지시 준수, 재위탁 제한, 안전성 확보조치, 손해배상 책임에 관한 사항을 문서로 정하고 있으며, 위탁 업무의 내용이나 수탁자가 변경되는 경우 본 방침을 통해 알려 드립니다.`,
  },
  {
    title: "6. 개인정보의 국외 이전",
    content: `회사가 이용하는 일부 서비스는 서버가 국외에 있어 개인정보가 국외로 이전됩니다.\n\n· 이전받는 자 : Vercel Inc. (미국) · Neon Inc. (미국) · Google LLC (미국)\n· 이전 항목 : 서비스 이용 기록, 접속 IP, 쿠키, 회원 정보 및 주문 정보(데이터베이스 보관분)\n· 이전 국가와 시점 : 이용자가 서비스를 이용하는 시점에 정보통신망을 통해 각 사업자의 서버로 전송\n· 이전 목적 : 웹사이트 호스팅, 데이터 보관, 이용 통계 분석\n· 보유 기간 : 위탁 계약 종료 시 또는 본 방침의 보유 기간까지\n\n서버가 위치한 지역은 각 사업자가 지정한 리전을 따르며, 변경되는 경우 본 방침을 통해 알려 드립니다.\n정보주체는 국외 이전을 거부할 수 있으며, 이 경우 회원 가입과 온라인 결제 등 일부 기능의 이용이 제한될 수 있습니다.`,
  },
  {
    title: "7. 개인정보의 파기",
    content: `보유 기간이 만료되거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다.\n· 전자 파일 : 복원이 불가능한 방법으로 영구 삭제\n· 서면 : 분쇄 또는 소각\n\n법령에 따라 보존해야 하는 정보는 다른 개인정보와 분리하여 별도로 보관합니다.`,
  },
  {
    title: "8. 정보주체와 법정대리인의 권리",
    content: `정보주체는 언제든지 다음의 권리를 행사할 수 있습니다.\n· 개인정보 열람 요구\n· 오류가 있는 경우 정정 요구\n· 삭제 요구\n· 처리 정지 요구\n\n권리 행사는 이메일 또는 전화로 접수할 수 있으며, 회사는 접수일로부터 10일 이내에 조치하고 결과를 알려 드립니다.\n· 이메일 : harangmarketing@naver.com\n· 전화 : 010-7541-9054\n\n정보주체가 대리인을 통해 권리를 행사하는 경우 위임장을 제출해야 합니다.`,
  },
  {
    title: "9. 만 14세 미만 아동의 개인정보",
    content: `회사가 제공하는 서비스는 사업자를 대상으로 하며, 만 14세 미만 아동의 개인정보를 수집하지 않습니다.\n만 14세 미만 아동의 개인정보가 수집된 사실을 알게 된 경우 지체 없이 파기합니다.`,
  },
  {
    title: "10. 쿠키의 사용",
    content: `회사는 이용자에게 맞는 서비스를 제공하고 방문 통계를 확인하기 위해 쿠키를 사용합니다.\n· 로그인 유지에 필요한 쿠키 : 회원 서비스 이용에 반드시 필요합니다\n· 통계 분석 쿠키(Google Analytics) : 방문 경로와 페이지 이용 현황을 확인하는 데 사용합니다\n\n이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다. 다만 로그인 쿠키를 거부하면 회원 서비스 이용이 제한됩니다.`,
  },
  {
    title: "11. 개인정보의 안전성 확보조치",
    content: `회사는 개인정보의 안전한 처리를 위해 다음의 조치를 하고 있습니다.\n\n· 관리적 조치 : 개인정보 취급자를 대표 1인으로 최소화하고 접근 권한을 관리합니다\n· 기술적 조치 : 비밀번호는 단방향 암호화하여 저장하고, 모든 통신 구간에 HTTPS 암호화를 적용하며, 관리자 화면은 별도 인증으로 접근을 제한합니다\n· 접속 기록을 보관하고 위조·변조를 방지합니다\n· 물리적 조치 : 개인정보가 담긴 서면은 잠금장치가 있는 장소에 보관합니다\n\n회사는 결제 카드번호와 계좌 비밀번호를 직접 수집하거나 보관하지 않습니다. 카드 결제 정보는 결제 대행사가 처리하며 회사에 전달되지 않습니다.`,
  },
  {
    title: "12. 개인정보 보호책임자",
    content: `개인정보 처리에 관한 업무를 총괄하고 불만 처리와 피해 구제를 담당합니다.\n· 책임자 : 전태영 (대표)\n· 이메일 : harangmarketing@naver.com\n· 전화 : 010-7541-9054`,
  },
  {
    title: "13. 권익 침해 구제 방법",
    content: `개인정보 침해로 인한 상담과 피해 구제가 필요한 경우 아래 기관에 문의할 수 있습니다.\n\n· 개인정보 침해신고센터 : 국번없이 118 · privacy.kisa.or.kr\n· 개인정보 분쟁조정위원회 : 1833-6972 · kopico.go.kr\n· 대검찰청 사이버수사과 : 국번없이 1301 · spo.go.kr\n· 경찰청 사이버수사국 : 국번없이 182 · ecrm.police.go.kr`,
  },
  {
    title: "14. 처리방침의 변경",
    content: `본 방침의 내용을 추가하거나 삭제·수정하는 경우 시행 7일 전부터 홈페이지 공지사항 또는 본 페이지를 통해 알려 드립니다.\n다만 이용자의 권리에 중대한 영향을 주는 변경은 시행 30일 전에 알려 드립니다.\n\n· 공고일 : 2026년 8월 30일\n· 시행일 : 2026년 9월 6일\n· 이전 방침 : 2024년 1월 1일 시행 (본 방침 시행과 동시에 대체됩니다)`,
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
              <p className="text-xs text-gray-400">하랑마케팅 · 2026년 8월 30일 개정 · 2026년 9월 6일 시행</p>
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
