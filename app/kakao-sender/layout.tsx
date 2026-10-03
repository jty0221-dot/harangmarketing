import type { Metadata } from "next";
import { SITE, ogImage } from "../lib/seo";
import { KS, KS_CHEAPEST, won } from "../lib/kakao-sender";

const PATH = "/kakao-sender";
const URL = `${SITE.base}${PATH}`;

export const metadata: Metadata = {
  // 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙이므로 브랜드명을 넣지 않는다
  title: "카톡 단체 발송 · 예약 발송 PC 프로그램 | 카톡 예약 발송",
  description:
    `거래처 · 고객 · 회원 카톡방 여러 곳에 같은 글을 한 번에 보내거나 원하는 시각에 예약해 보내는 윈도우 프로그램입니다. ` +
    `무료 ${KS.trialCount}건 체험 후 명절 한 달권 ${won(KS_CHEAPEST.price)}원.`,
  keywords: [
    "카톡 예약 발송", "카톡 예약 전송", "카카오톡 예약 메시지", "카톡 단체 발송",
    "카톡 여러 방 동시 전송", "카톡 명절 인사 보내기", "거래처 명절 인사 카톡",
    "카톡 공지 한번에", "PC 카카오톡 자동 발송", "하랑마케팅 프로그램",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "카톡 예약 발송 | 거래처 카톡방에 한 번에, 원하는 시각에",
    description:
      `PC 카카오톡 방 여러 곳에 공지와 명절 인사를 한 번에. 보내기 전에 방과 글을 한 번 더 보여 드립니다. 무료 ${KS.trialCount}건 체험.`,
    url: URL,
    images: [ogImage("카톡 예약 발송 프로그램")],
  },
};

/** 메타데이터만 담당한다. 구조화 데이터는 page.tsx 에서 선언한다 */
export default function KakaoSenderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
