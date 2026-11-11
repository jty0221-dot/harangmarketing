/**
 * 지금 함께하고 있는 곳 · 홈 로고 파노라마의 유일한 출처.
 *
 * 2026-11-12 (목) 대표 지시 「나랑 지금 하고 있는 업체들 로고도 넣어서 파노라마 형식으로 보여줘」.
 * 예전 목록(명함 뒷면 두 장 · 끝난 곳 포함)은 '함께 일했던 곳' 이었고, 이제 홈은 '지금 진행 중인 곳' 만 싣는다.
 *
 * 무엇이 '지금' 인가 (2026-11-12 대조)
 *   · 구글 시트 「하랑 마케팅」 상태 '진행 중'
 *   · .claude/skills/work-manager/references/contracts.md 진행 중 표 · 대장 밖 거래 고객 '진행'
 *   · 세금계산서/data/clients.json active
 *   셋 중 하나라도 종료 · 중단이면 넣지 않는다. '확인 필요' 인 곳도 넣지 않는다.
 *
 * 넣지 않는 것
 *   · 대대행 파트너 고객 (권준수 · 이익관 · 이준혁 주문분) · 우리 직계약이 아니다
 *   · 상호를 밖에 쓰지 않기로 한 곳 (세무법인 아성 대구점 · 바깥 글은 익명)
 *   · 개인 영업자를 남의 상표로 보여 주게 되는 곳 (벤츠 신부장 · 메르세데스 로고는 그 회사가 고객이라는 뜻이 된다)
 *
 * 로고 파일이 없는 곳은 file 을 비운다. 화면은 상호를 같은 칸에 글자로 적는다.
 * 로고를 받으면 public/partners/ 에 PNG(투명 · 384x144)로 넣고 file 만 채운다.
 * 병 · 의원은 로고만 싣고 옆에 성과 문구를 붙이지 않는다.
 */
export type Partner = {
  /** 화면에 글자로 나가는 상호 · 로고가 있으면 alt 로 들어간다 */
  name: string;
  /** public/partners/ 안의 파일명. 없으면 상호를 글자로 적는다 */
  file?: string;
};

export const CLIENTS_AS_OF = "2026년 11월";

// 로고와 글자 칸이 한쪽에 몰리지 않게 섞어 뒀다. 홈이 앞뒤 절반으로 갈라 두 줄에 담는다.
export const PARTNERS: Partner[] = [
  { name: "에이봄의원", file: "abom-clinic.png" },
  { name: "소금정원" },
  { name: "청설모 토탈케어", file: "cheongseolmo.png" },
  { name: "충무로 2층집" },
  { name: "모앤도트", file: "mo-and-dot.png" },
  { name: "LOCALS." },
  { name: "타이백스트릿", file: "thai-back-street.png" },
  { name: "미소나무치과" },
  { name: "샤브올데이", file: "shabu-all-day.png" },
  { name: "가츠오" },
  { name: "서원가설", file: "sw-seowon.png" },
  { name: "네일가영" },
  { name: "클린패스", file: "cleanpass.png" },
  { name: "미니데이카페" },
  { name: "소방", file: "sobang.png" },
  { name: "진갈매갈" },
  { name: "베리굿 웨딩", file: "verygood-wedding.png" },
  { name: "위드모터스" },
  { name: "미소가득치과", file: "misogadeuk-dental.png" },
  { name: "어사출또" },
  { name: "DS ENGLISH", file: "ds-english.png" },
  { name: "부천누수탐지" },
  { name: "울산입주청소" },
  { name: "의정부입주청소" },
];

/** 로고 원본 크기. 전부 같아서 CSS 는 높이만 잡으면 된다 */
export const PARTNER_LOGO = { w: 384, h: 144 } as const;
