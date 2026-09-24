/**
 * 홈페이지 문의 상태 (서버·클라이언트 공용 상수)
 *
 * inquiries.ts 는 DB 모듈을 끌고 들어오므로 관리자 화면(클라이언트)이 직접 import 하면 안 된다.
 * 화면과 API 가 같은 값을 보도록 상태 이름과 표시 문구, 메모 상한만 여기 따로 둔다.
 *
 * new     : 들어왔고 아직 아무도 안 봤다
 * checked : 봤다 (전화 전이거나 통화 중)
 * done    : 응대가 끝났다
 */
export const INQUIRY_STATUSES = ["new", "checked", "done"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "새 문의",
  checked: "확인함",
  done: "응대 완료",
};

export function isInquiryStatus(v: unknown): v is InquiryStatus {
  return typeof v === "string" && (INQUIRY_STATUSES as readonly string[]).includes(v);
}

/**
 * 관리자 메모 상한 (글자 수). 화면의 textarea maxLength 와 API 검사가 같은 값을 본다.
 * 메모는 관리자 화면에서만 보는 내부 기록이다. 고객에게 나가지 않는다.
 */
export const INQUIRY_MEMO_MAX = 2000;

/**
 * 저장할 메모 모양으로 다듬는다. 앞뒤 공백을 걷고, Postgres text 가 받지 않는 NUL 문자를 뺀다.
 * 문자열이 아니면 null, 다듬고 나서 비면 빈 문자열이다 (빈 값 저장 = 메모 지우기).
 */
export function normalizeInquiryMemo(v: unknown): string | null {
  if (typeof v !== "string") return null;
  return v.split("\u0000").join("").trim();
}

/** 어느 화면에서 들어왔는지. /api/contact 가 저장하는 source 값 기준 */
export function inquirySourceLabel(source: string | null): string {
  if (!source || source === "web") return "상담 신청 폼";
  if (source === "free-check") return "무료 진단";
  return source;
}
