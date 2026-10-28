import { ClipboardCheck, Images, UserX, CalendarClock } from "lucide-react";

/*
 * 의료광고 검수 공정 — 진우(병·의원 팀장) 인계서 제5절 문장 그대로다.
 * 정본 : E:\하랑\본부장\병의원\인계_홈페이지_병의원_2026-09-05.md
 * services/clinic 과 병원 홈페이지 허브가 같이 쓴다 (TR-0080 에서 page.tsx 밖으로 옮김 · 글자 변경 0).
 *
 * 읽기 좋게 다듬지 않는다. 네 줄은 의료법 조문에서 나온 것이라
 * 문장을 부드럽게 고치는 순간 우리가 지키겠다고 적은 것과 실제가 어긋난다.
 * 고치려면 진우 검수가 먼저다 (C-50).
 */
export const MEDICAL_PROCESS = [
  {
    icon: ClipboardCheck,
    title: "쓰는 사람과 보는 사람을 나눕니다",
    desc: "병원 · 의원 원고는 의료법 검수를 따로 거칩니다.",
  },
  {
    icon: Images,
    title: "전후 사진은 세 가지가 함께 있어야 합니다",
    desc: "전후 사진은 시술명 · 시술일자 · 부작용 경고 세 가지가 함께 있어야 게시합니다.",
  },
  {
    icon: UserX,
    title: "체험단은 병원에 제안하지 않습니다",
    desc: "치료경험담을 대가로 받는 체험단은 병원에 제안하지 않습니다.",
  },
  {
    icon: CalendarClock,
    title: "심의 유효기간을 대장으로 셈니다",
    desc: "사전심의 대상 광고는 승인 유효기간 3년을 대장으로 관리합니다.",
  },
];
