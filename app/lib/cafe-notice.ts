/**
 * 대표카페 운영 공지 — 화면에 뜨는 공지 팝업의 유일한 출처.
 *
 * 문구·날짜·노출 경로를 여기서만 고친다. 컴포넌트 안에 문장을 적지 않는다.
 * 공지를 새로 띄우려면 id 를 바꾼다 — 닫기 기록이 id 로 저장돼서
 * id 가 바뀌면 이미 닫은 사람에게도 다시 뜬다.
 *
 * 단가는 여기 적지 않는다. cafe-distribution.ts 의 CAFE_TIERS 가 정본이고
 * 팝업은 그것을 읽어서 보여준다. 두 곳에 숫자를 적으면 한쪽만 고쳐진다.
 */

/**
 * 새로 들어온 대표카페. 한 줄이 카드 한 장이 된다.
 *
 * label   화면에 뜨는 이름. 상호를 그대로 적지 않는다.
 *         2026-09-07 (월) 대표 지시 「업체명을 오픈하지않고 00카페 이런식으로」 를 따른다.
 *         레퍼런스 캡처 안에 카페 이름이 보이는 것과는 다른 문제다. 캡처는 "여기 한 번
 *         올렸다" 는 증거고, 제휴처 명단은 "여기서 받아 온다" 는 지도다. 이 저장소는
 *         공개라 지도를 그리면 원가가 같이 나간다.
 * kind    카페 주제. cafe-distribution.ts 대형 카페 등급의 topics 와 같은 말을 쓴다.
 * img     캡처 경로 (public 기준). 없으면 카드가 아이콘 타일로 뜬다. 레이아웃은 안 깨진다.
 * members 회원 규모. 확인한 것만 적는다. 모르면 비워 둔다 (헌장 C-42).
 */
export type PartnerCafe = {
  label: string;
  kind: string;
  img?: string;
  members?: string;
  isNew?: boolean;
};

/**
 * 비워 둔다. 어느 카페 2곳인지 대표 확정이 아직 없다.
 *
 * 단가 안내 옆에 서는 값이라 틀리면 그대로 우리가 한 약속이 된다 (헌장 C-42 · C-35).
 * 확정되면 여기 두 줄만 채운다. 채우는 순간 팝업에 카드가 뜬다.
 */
export const PARTNER_CAFES: PartnerCafe[] = [];

/**
 * 공지를 띄울 경로.
 *
 * "/" 는 메인 한 장에서만 뜬다. 앞부분 매칭으로 두면 39개 라우트 전부에 뜬다.
 * 나머지 항목은 앞부분이 맞으면 뜬다 (하위 경로 포함).
 */
export const NOTICE_PATHS = ["/", "/services/cafe-distribution"];

export const CAFE_NOTICE = {
  /** 이 값을 바꾸면 이미 닫은 사람에게도 다시 뜬다 */
  id: "cafe-notice-2026-09-10",
  date: "2026-09-10 (목)",
  eyebrow: "운영 공지",
  title: "대표카페 운영 변경 안내",
  intro: "대표카페 운영에 바뀐 점이 있어 먼저 알려드립니다.",

  points: [
    {
      no: "01",
      label: "제휴처 2곳 추가 확보",
      body: "대표카페 제휴처 2곳을 새로 확보했습니다. 다른 대표카페와도 제휴 협의를 이어가고 있습니다.",
    },
    {
      no: "02",
      label: "대표카페 단가 조정",
      body: "네이버 노출 환경이 바뀌면서 게시 자리를 잡고 발행 뒤 노출을 확인하는 작업이 늘었습니다. 그 작업 비용을 반영해 단가를 조정했습니다.",
    },
  ],

  /** 새 카페 카드 위에 붙는 줄. PARTNER_CAFES 가 비면 이 줄도 같이 사라진다 */
  cafeLead: "이번에 새로 들어온 대표카페입니다.",

  /** 표 위에 붙는 한 줄. 대표카페가 어느 등급인지 알려 준다 */
  tierLead: "현재 카페 등급별 건당 단가입니다. 대표카페는 아래 대형 카페 등급입니다.",
  tierNote: "부가세 별도. 원고 작성을 맡기시면 건당 추가 비용이 붙습니다.",

  closing: [
    "지금은 제휴처를 늘리는 일을 가장 앞에 두고 있습니다. 제휴처가 넓어지는 대로 단가를 다시 내릴 계획입니다.",
    "갑작스러운 변경으로 불편을 드려 죄송합니다. 빠르게 정상화하겠습니다.",
  ],

  cta: { label: "단가 문의하기", href: "/contact" },
  dismiss: "확인했습니다",
} as const;

/** 닫기 기록 저장 키. 두 컴포넌트가 각자 문자열을 조립하면 한쪽만 틀어진다 */
export const NOTICE_STORAGE_KEY = `harang_notice_${CAFE_NOTICE.id}`;

/**
 * 이 경로에서 공지 카드가 뜨는가.
 *
 * "/" 만 정확히 맞춘다. 앞부분 매칭으로 두면 모든 라우트에 뜬다.
 */
export function noticeShowsOn(pathname: string): boolean {
  return NOTICE_PATHS.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));
}

/**
 * 공지 카드가 지금 그 자리를 차지하고 있는가.
 *
 * 같은 자리(데스크톱 우하단 · 모바일 하단)에 카드를 띄우는 쪽이 물어본다.
 * 메인에는 상담 카드가 이미 그 자리에 뜬다 — 두 장이 겹치면 뒤 카드가 앞 카드를 통째로 덮는다.
 * 저장소를 못 읽으면 공지는 뜨는 쪽으로 동작하므로 여기서도 뜬다고 답한다.
 */
export function noticeOccupies(pathname: string): boolean {
  if (!noticeShowsOn(pathname)) return false;
  try {
    return !localStorage.getItem(NOTICE_STORAGE_KEY);
  } catch {
    return true;
  }
}
