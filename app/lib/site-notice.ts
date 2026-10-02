/**
 * 공지 띠에 거는 공지 (2026-10-02 (금) 신설).
 *
 * 대표 지시 「우리 하랑 홈페이지와 모든 내용이 공유가 잘되도록 민수와 협력해」 (보라 세션 경유).
 * 공지를 켜고 끄는 곳은 이 파일 한 곳이다. 켜진 공지는 머리의 공지 띠 (components/Header.tsx) 맨 앞에 서고,
 * 켜진 공지가 없으면 띠는 예전처럼 홍보 문구 셋만 돌린다.
 *
 * 쓰는 규칙
 *  1) 문장은 홈페이지에 이미 적힌 정본 값만 쓴다. 카카오 채널 홈 공지와 같은 글자로 건다
 *     (본부장/홈페이지/카카오공유_정본목록 · 카카오 쪽은 보라).
 *  2) 가격 · 계약 · 응답 약속을 새로 만드는 문장은 대표 결재다 (C-35). 보장이라는 말은 쓰지 않는다 (D-0521).
 *  3) 공지를 바꾸면 id 도 바꾼다. 닫기 기록이 켜진 공지들의 id 로 저장돼서, id 가 바뀌면 띠를 닫았던 사람에게도 다시 뜬다.
 *  4) until 은 한국 시간 날짜 (YYYY-MM-DD) 다. 그날까지 뜨고 다음 날부터 저절로 내려간다. 비워 두면 끌 때까지 뜬다.
 *  5) pinned 가 켜진 공지가 하나라도 있으면 띠는 그 공지만 보여 주고 홍보 문구는 돌리지 않는다 (휴무 안내처럼 놓치면 안 되는 것).
 *  6) 375px 에서 띠 글자 자리는 200px 안팎이다. mobileText 는 열다섯 자 안쪽으로 쓴다 (넘치면 끝이 말줄임표로 잘린다).
 */

import { TERMS_REVISION, koMonthDayShort } from "./terms-revision";

export type SiteNotice = {
  /** 닫기 기록 이름에 들어간다. 공지를 바꾸면 같이 바꾼다 */
  id: string;
  /** false 면 띠에 안 뜬다 */
  enabled: boolean;
  /** 이 날짜 (한국 시간) 까지 뜬다. 없으면 끌 때까지 */
  until?: string;
  /** 켜지면 이 공지만 띄우고 홍보 문구는 멈춘다 */
  pinned?: boolean;
  /** 태블릿 · PC 문장 */
  text: string;
  /** 휴대폰 문장 (열다섯 자 안쪽) */
  mobileText: string;
  /** 오른쪽 버튼 글자 */
  ctaLabel: string;
  /** 버튼이 여는 곳. 홈페이지 안 주소는 같은 창에서, http 로 시작하는 바깥 주소는 새 창에서 연다 (components/Header.tsx · 2026-10-02 대표 「전부 진행」) */
  ctaHref: string;
};

export const SITE_NOTICES: SiteNotice[] = [
  {
    // 약관 제4조 : 바꾼 약관은 시행일 7일 전부터 시행일까지 홈페이지에 공지한다. 날짜는 terms-revision.ts 가 정본이다
    id: `terms-${TERMS_REVISION.announced}`,
    enabled: true,
    until: TERMS_REVISION.effective,
    text: `이용약관 개정 · 중도 해지 위약금 조항 삭제 · ${koMonthDayShort(TERMS_REVISION.effective)} 시행`,
    mobileText: `약관 개정 · ${koMonthDayShort(TERMS_REVISION.effective)} 시행`,
    ctaLabel: "약관 보기",
    ctaHref: "/terms",
  },
  {
    // 응답 약속은 2026-09-30 (수) 대표 결정값 그대로다 (Footer · FloatingCTA · contact · faq 와 같은 말)
    id: "kakao-reply-2026-10-02",
    enabled: true,
    text: "카카오톡 문의 24시간 접수 · 하랑 대표가 하루 이내 답변",
    mobileText: "24시간 접수 · 하루 이내 답변",
    // 상담 신청 화면 첫 칸이 카카오톡 채널 버튼이다
    ctaLabel: "문의하기",
    ctaHref: "/contact",
  },
];

/** 한국 시간 오늘 날짜 (YYYY-MM-DD) */
export function kstToday(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** 지금 띠에 올릴 공지. 꺼진 것과 until 이 지난 것은 뺀다 */
export function activeNotices(today: string): SiteNotice[] {
  return SITE_NOTICES.filter((n) => n.enabled && (!n.until || today <= n.until));
}
