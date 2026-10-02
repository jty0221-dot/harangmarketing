/**
 * 카톡 예약 발송 · 판매 페이지 데이터 (/kakao-sender)
 *
 * 가격 · 체험 건수 · 카카오채널 주소의 정본은 프로그램 쪽 판매설정.json 이다.
 *   E:\하랑\카톡예약발송\판매설정.json
 * 여기 숫자는 그 파일을 옮겨 적은 것이라, 저쪽이 바뀌면 이쪽도 같이 바꾼다.
 * 가격 변경은 대표 결재(C-35)다. 표기를 고치는 김에 숫자를 같이 바꾸지 않는다.
 *
 * 쓰지 않는 말: 오픈채팅 홍보 · 발송 보장 · 계정 안전 보장 · 카카오 공식.
 * 이 프로그램은 카카오와 제휴한 것이 아니다. 카카오 로고 · 브랜드 이미지도 쓰지 않는다.
 * 할인 · 기간 한정 문구도 넣지 않는다.
 */

import type { FaqItem } from "./seo";

export const KS = {
  name: "카톡 예약 발송",
  maker: "하랑마케팅",
  version: "1.5.4",
  /** 무료 체험 건수. 방 1곳에 한 번 보낸 것이 1건이다 (판매설정.json 무료체험.건수) */
  trialCount: 10,
  /** 항상 최신판을 받는 주소 (GitHub Releases latest) */
  downloadUrl:
    "https://github.com/jty0221-dot/kakao-sender/releases/latest/download/KakaoSender.zip",
  /** 사용 방법 안내 페이지 (판매설정.json 스토어주소) */
  guideUrl: "https://github.com/jty0221-dot/kakao-sender",
  /** 구매 · 문의 창구 (판매설정.json 카카오채널 · 사이트 공통 SITE.kakaoChat 과 같은 채널) */
  kakaoChannel: "https://pf.kakao.com/_MuUkG/chat",
} as const;

export const won = (n: number) => n.toLocaleString("ko-KR");

export type KsPlan = {
  id: string;
  name: string;
  /** 요금표 위에 붙는 짧은 이름 */
  label?: string;
  days: number;
  pcs: number;
  price: number;
  best: boolean;
  note: string;
};

/**
 * 요금제 넷 (부가세 포함 · 판매설정.json 요금제 그대로).
 * 추천은 1개월(명절 한 달권) · 2026-10-03 (토) 대표 확정 '명절 그거 좋은거 같아 진행'.
 * 한 달 환산가 같은 파생 숫자는 만들지 않는다. 화면의 숫자는 이 넷뿐이다.
 */
export const KS_PLANS: KsPlan[] = [
  {
    id: "m1",
    name: "1개월",
    label: "명절 한 달권",
    days: 30,
    pcs: 1,
    price: 5500,
    best: true,
    note: "설 · 추석 · 연말처럼 인사를 몰아서 보내는 달에 한 달만 쓰시는 분께 맞습니다.",
  },
  {
    id: "m6",
    name: "6개월",
    days: 180,
    pcs: 1,
    price: 27500,
    best: false,
    note: "회원방 공지처럼 달마다 보내는 글이 있는 분께 맞습니다.",
  },
  {
    id: "y1",
    name: "1년",
    days: 365,
    pcs: 1,
    price: 49500,
    best: false,
    note: "명절 인사와 정기 공지를 일 년 내내 이 프로그램으로 보내시는 분께 맞습니다.",
  },
  {
    id: "y1x3",
    name: "1년 3대",
    label: "사무실용",
    days: 365,
    pcs: 3,
    price: 110000,
    best: false,
    note: "사무실 PC 여러 대에서 같이 쓰시는 보험 · 딜러 · 대행사 사무실용입니다. PC 마다 기기 코드를 따로 받습니다.",
  },
];

export const KS_CHEAPEST = KS_PLANS.reduce((a, b) => (b.price < a.price ? b : a));
export const KS_PRICIEST = KS_PLANS.reduce((a, b) => (b.price > a.price ? b : a));

export type KsFeature = { title: string; desc: string };

/** 기능. 프로그램에 실제로 있는 것만 적는다 (1.5.4 기준) */
export const KS_FEATURES: KsFeature[] = [
  {
    title: "여러 방에 한 번에 보내기",
    desc: "보낼 방을 고르고 글을 한 번 쓰면 고른 방마다 차례로 보냅니다. 방마다 같은 글을 붙여 넣을 일이 없습니다.",
  },
  {
    title: "원하는 시각에 예약 발송",
    desc: "한 번 · 매일 · 매주 가운데 고르면 그 시각에 보냅니다. 새벽 인사나 아침 공지를 미리 걸어 둘 수 있습니다.",
  },
  {
    title: "예약 목록에서 바로 고치기",
    desc: "걸어 둔 예약의 시각 · 방 · 글을 목록에서 바로 고칩니다. 고친 예약은 다시 승인해야 나갑니다.",
  },
  {
    title: "사진 · 동영상 · 파일 같이 보내기",
    desc: "명절 인사 카드나 안내문 파일을 글과 함께 보냅니다.",
  },
  {
    title: "카톡방을 직접 찾아서 열기",
    desc: "방 이름을 넣으면 프로그램이 PC 카카오톡에서 그 방을 검색해 엽니다. 방 창을 미리 열어 두지 않아도 됩니다.",
  },
  {
    title: "방 목록 저장 · 그룹으로 묶기",
    desc: "자주 보내는 방을 저장해 두고 거래처 · 고객 · 회원처럼 그룹으로 묶어 한 번에 고릅니다.",
  },
];

/** 실수 발송을 막는 두 장치. 페이지에서 따로 크게 보여준다 */
export const KS_SAFETY: KsFeature[] = [
  {
    title: "보내기 전에 한 번 더 보여드립니다",
    desc: "보낼 방 목록과 글을 먼저 보여 드리고 확인을 받은 뒤에 보냅니다. 방을 잘못 고른 것을 보내기 전에 알 수 있습니다.",
  },
  {
    title: "예약은 승인해야 나갑니다",
    desc: "예약을 만들어 두기만 해서는 나가지 않습니다. 승인한 예약만 그 시각에 보내므로 시험 삼아 만든 예약이 실수로 나가지 않습니다.",
  },
];

export type KsUse = { who: string; why: string };

export const KS_FOR_WHOM: KsUse[] = [
  {
    who: "설 · 추석 · 연말 거래처 인사",
    why: "거래처 방이 수십 곳이면 인사 한 번에 반나절이 갑니다. 글과 카드 사진을 한 번 넣고 아침 시각에 예약해 두시면 됩니다.",
  },
  {
    who: "회원방 · 고객방 정기 공지",
    why: "휴무 안내 · 일정 공지처럼 여러 방에 같은 글이 나가야 할 때 방마다 옮겨 다니지 않아도 됩니다.",
  },
  {
    who: "보험 설계사 · 자동차 딜러",
    why: "고객마다 따로 열린 방이 많은 일입니다. 고객 방을 그룹으로 묶어 두면 안내 한 번이 모든 방에 나갑니다.",
  },
  {
    who: "마케팅 대행사 · 거래처가 많은 사무실",
    why: "클라이언트 방마다 보고 안내를 보내는 일을 한 번에 끝냅니다. 사무실 PC 여러 대라면 3대 요금제가 있습니다.",
  },
];

export type KsStep = { step: string; detail: string };

/** 구매 절차. 프로그램 안 구매 · 문의 창 흐름 그대로 */
export const KS_BUY_STEPS: KsStep[] = [
  { step: "프로그램 실행", detail: `먼저 무료 ${KS.trialCount}건으로 써 보시고 결정하셔도 됩니다.` },
  { step: "구매 · 문의 창에서 요금제 고르기", detail: "프로그램 안 구매 · 문의 단추를 누르면 요금제가 나옵니다." },
  { step: "기기 코드 복사", detail: "같은 창에 PC 마다 다른 기기 코드가 있습니다. 복사 단추를 누르시면 됩니다." },
  { step: "카카오톡 채널로 문의", detail: "하랑마케팅 채널에 기기 코드와 고르신 요금제를 보내 주세요." },
  { step: "입금", detail: "입금하실 곳은 채널에서 안내해 드립니다." },
  { step: "정품키 받아 입력", detail: "보내 드린 정품키를 프로그램에 넣으면 바로 이어서 쓰실 수 있습니다." },
];

export const KS_SMARTSCREEN_STEPS: KsStep[] = [
  { step: "추가 정보 누르기", detail: "파란 경고창 글 아래에 있는 추가 정보를 누릅니다." },
  { step: "실행 누르기", detail: "아래에 실행 단추가 생깁니다. 누르면 프로그램이 열립니다." },
];

export const KS_SPECS = [
  { label: "버전", value: KS.version },
  { label: "운영체제", value: "윈도우 PC" },
  { label: "필요한 것", value: "PC 카카오톡 로그인" },
  { label: "휴대폰", value: "쓸 수 없음" },
  { label: "무료 체험", value: `${KS.trialCount}건` },
  { label: "만든 곳", value: KS.maker },
];

export const KS_FAQ: FaqItem[] = [
  {
    q: "휴대폰에서도 쓸 수 있나요?",
    a: "쓸 수 없습니다. 윈도우 PC 에 설치된 PC 카카오톡을 이용하는 프로그램이라 PC 에서 내려받아 PC 카카오톡에 로그인한 상태로 쓰셔야 합니다.",
  },
  {
    q: "무료 체험은 몇 건까지인가요?",
    a: `정품키 없이 ${KS.trialCount}건까지 보내실 수 있습니다. 방 1곳에 한 번 보낸 것이 1건이라 방 ${KS.trialCount}곳에 한 번 보내면 체험이 끝납니다.`,
  },
  {
    q: "명절 한 달권은 무엇이 다른가요?",
    a: "1개월 요금제입니다. 기능은 다른 요금제와 같고 기간만 30일입니다. 설 · 추석 · 연말처럼 인사를 몰아서 보내는 달에만 쓰시는 분이 많아 따로 이름을 붙였습니다.",
  },
  {
    q: "방 개수나 보내는 건수에 제한이 있나요?",
    a: "정품키를 넣으면 기간으로만 씁니다. 방 개수나 건수로 요금을 나누지 않습니다.",
  },
  {
    q: "기간이 끝나면 자동으로 결제되나요?",
    a: "자동 결제가 없습니다. 기간이 끝나면 발송이 멈추고, 이어서 쓰시려면 다시 정품키를 받으시면 됩니다.",
  },
  {
    q: "카카오에서 만든 프로그램인가요?",
    a: "아닙니다. 하랑마케팅이 만든 프로그램이고 카카오와 제휴한 프로그램이 아닙니다. 카카오톡 운영정책은 카카오가 정하므로 보내시는 글과 방식은 그 정책 안에서 써 주세요.",
  },
  {
    q: "모르는 사람에게 광고를 보내는 데 써도 되나요?",
    a: "그런 용도로 만들지 않았습니다. 이미 대화하고 계신 거래처 · 고객 · 회원 방에 공지와 인사를 보내는 프로그램입니다. 광고성 메시지는 받는 분의 동의를 받고 보내셔야 합니다.",
  },
  {
    q: "내려받았는데 파란 경고창이 떠요",
    a: "윈도우가 서명 인증서가 없는 프로그램에 띄우는 창입니다. 추가 정보를 누르고 실행을 누르시면 열립니다. 서명 비용을 아껴 값을 낮췄습니다.",
  },
  {
    q: "새 버전은 어떻게 받나요?",
    a: "이 페이지의 내려받기 단추는 늘 최신판으로 연결됩니다. 새로 받아서 쓰시면 됩니다.",
  },
];
