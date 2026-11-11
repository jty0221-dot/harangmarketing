/**
 * 이용약관 개정 날짜 (2026-10-02 (금) 신설).
 *
 * 약관 화면 머리 한 줄 · 부칙 · 공지 띠의 약관 개정 공지가 이 값을 같이 읽는다.
 * 세 곳에 날짜를 따로 적으면 배포가 하루 밀렸을 때 한 곳만 옛 날짜로 남는다.
 *
 * 약관 제4조 : 약관을 바꾸면 시행일 7일 전부터 시행일까지 홈페이지에 공지한다.
 * 이용자에게 불리한 변경은 30일 전부터 공지하고 기존 이용자에게 따로 알린다.
 * 이번 개정 (제11조 중도 해지 위약금 삭제) 은 이용자에게 유리한 쪽이라 7일이다.
 *
 * 배포가 공고일보다 늦어지면 배포하는 날을 공고일로, 그 7일 뒤를 시행일로 다시 적고 올린다.
 * 지난 날짜를 공고일로 두면 공지한 적 없는 날에 공지했다고 적힌다.
 */

/** 이번 개정. announced 는 홈페이지에 공지를 거는 날 · effective 는 시행일 */
export const TERMS_REVISION = { announced: "2026-10-02", effective: "2026-10-09" } as const;

/** 바로 앞 개정. 부칙의 종전 약관 줄과 개정 이력 줄이 읽는다 */
export const TERMS_PREVIOUS = { announced: "2026-08-30", effective: "2026-09-06" } as const;

/** 2026-10-09 → 2026년 10월 9일 */
export function koDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

/** 2026-10-09 → 10월 9일 (공지 띠처럼 자리가 좁은 곳) */
export function koMonthDayShort(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}월 ${d}일`;
}
