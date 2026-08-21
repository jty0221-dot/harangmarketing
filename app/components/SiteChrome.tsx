"use client";

import { usePathname } from "next/navigation";
import FloatingCTA from "./FloatingCTA";
import SocialProofToast from "./SocialProofToast";
import ChatWidget from "./ChatWidget";

/**
 * 화면에 떠 있는 영업용 요소들(하단 CTA 바 · 상담 신청 알림 · 상담 챗봇)을 한곳에서 관리한다.
 *
 * 왜 조건이 필요한가
 *   이 셋은 "아직 우리 고객이 아닌 사람"을 상담으로 데려오는 장치다.
 *   이미 계약한 사장님이 보는 진행 보고서(/r/…)에 '신규 상담 잔여 2자리 선착순 마감' 이 뜨면
 *   맥락에 맞지 않고, 챗봇 아이콘이 본문까지 가린다.
 */
const HIDE_ON = ["/r/"];

export default function SiteChrome() {
  const pathname = usePathname() || "";
  if (HIDE_ON.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <>
      <FloatingCTA />
      <SocialProofToast />
      <ChatWidget />
    </>
  );
}
