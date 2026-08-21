"use client";

import { usePathname } from "next/navigation";
import FloatingCTA from "./FloatingCTA";
import SocialProofToast from "./SocialProofToast";
import ChatWidget from "./ChatWidget";

/**
 * 화면에 떠 있는 요소들(하단 CTA 바 · 상담 챗봇)을 한곳에서 관리한다.
 *
 * SocialProofToast 는 /api/social-proof 가 주는 **실제 데이터**만 띄운다
 * (실제 상담 신청 + 실제 진행 사례). 예전의 가짜 목록은 걷어냈다.
 *
 * 왜 조건이 필요한가
 *   이 셋은 "아직 우리 고객이 아닌 사람"을 상담으로 데려오는 장치다.
 *   - /r/…   이미 계약한 사장님이 보는 진행 보고서. '신규 상담 잔여 2자리 선착순 마감' 이 뜨면
 *            맥락에 맞지 않고, 챗봇 아이콘이 본문까지 가린다.
 *   - /admin 대표님 본인이 쓰는 관리자 화면. 자기 사이트에서 자기한테 영업할 이유가 없다.
 *
 * 고객 전용 페이지를 새로 만들면 여기에 경로를 추가한다.
 */
const HIDE_ON = ["/r/", "/admin"];

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
