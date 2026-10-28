import type { KeywordServiceData } from "../components/KeywordServicePage";
import type { FaqItem } from "./seo";

/*
 * 병원 홈페이지 라인 · 허브 + GEO + 과목 쪽 넷 (TR-0080 · 2026-10-28 · 민수)
 * 설계 정본 : 본부장/홈페이지/병의원라인_세팅안_20261027.md (나) · (다) · (마)
 * 문장 정본 : 본부장/병의원/판정_Q0715_홈페이지.md 1절 통과 + 2절 바꿀 문장. ID 를 주석에 단다. 글자를 바꾸면 진우 재판정.
 * 새로 쓴 문장(N-xx)은 본부장/홈페이지/병원허브_진우검수요청_20261028.md 에 모았다. 진우 통과 전 배포하지 않는다.
 * 가격 칸이 비어 있는 H-05 · G-06 은 넣지 않는다 (판정 조건 1 · 대표 결재 C).
 * 하랑 도메인에 의료기관 타입 6종 · review · aggregateRating 을 쓰지 않는다 (인계 8절 · G-05 조건).
 * 네이버 월간 검색 (2026-10-27 · 태욱 실측표) : 병원홈페이지제작 1,810 · 병원홈페이지 220 · 병원GEO 580 · 병원AEO 50 ·
 * 치과홈페이지제작 120 · 성형외과홈페이지제작 100 · 피부과홈페이지제작 60 · 한의원홈페이지 50 · 한의원홈페이지제작 35
 */

export const CLINIC_HUB_PATH = "/services/homepage/clinic";
const BASE_CRUMBS = [
  { name: "홈", path: "/" },
  { name: "서비스", path: "/services" },
  { name: "홈페이지 제작", path: "/services/homepage" },
];
const HUB_CRUMBS = [...BASE_CRUMBS, { name: "병원 홈페이지 제작", path: CLINIC_HUB_PATH }];

const FACTS = [
  { label: "제작 기간", value: "15영업일" },
  { label: "도메인 · 서버", value: "원장님 명의" },
  { label: "오류 수정", value: "오픈 후 3개월 무상" },
  { label: "상담 · 진단", value: "0원" },
];

// 10/27 커밋 b591098 때 진우 검수를 거친 CTA 문장 그대로
const CTA = {
  ctaTitle: "지금 병원 홈페이지부터 같이 봅니다",
  ctaBody: "지금 홈페이지가 있으시면 주소를, 없으시면 진료과목과 지역을 알려 주세요. 무엇을 먼저 고칠지 무료 진단으로 알려 드립니다. 제작비는 홈페이지 제작 가격표에 공개해 두었습니다.",
  ctaHref: "/contact?service=homepage",
};

/* ── 판정 통과 문답 ── */
const H06: FaqItem = { q: "제작 기간은 얼마나 걸리나요?", a: "계약금 입금일부터 15영업일입니다. 의료법 점검은 이 기간 안의 점검 단계에 들어 있습니다. 사진과 진료 정보가 늦게 오면 그만큼 늦어집니다." };
const H07: FaqItem = { q: "병원 홈페이지도 의료법에 걸리나요?", a: "일일 평균 이용자가 10만 명에 못 미치는 병원 자체 홈페이지는 의료광고 사전심의 대상이 아닙니다. 심의 대상이 아니어도 의료법 제56조 제2항의 금지 항목은 그대로 적용됩니다. 그래서 치료경험담 칸을 만들지 않고, 전후 사진은 시술명 · 시술일자 · 부작용 경고 세 가지가 함께 있을 때만 싣습니다. 모든 문구는 의료법 검수를 거친 뒤 원장님 확인을 받아 공개합니다." };
const H08: FaqItem = { q: "만든 뒤 효과는 어떻게 확인하나요?", a: "저희가 재는 것은 세 가지입니다. 검색엔진이 쪽을 수집했는지(서치어드바이저 · 서치콘솔 기록), 구조화 데이터 검사 결과, 정해 둔 질문을 AI 에 물었을 때 병원이 언급됐는지를 질문 원문과 날짜와 함께 적은 관측 기록입니다. 이 세 가지를 날짜와 함께 보고드립니다." };
const H09: FaqItem = { q: "오픈한 뒤 관리는 어떻게 하나요?", a: "오픈 후 3개월은 오류 수정이 무상입니다. 그 다음부터 월 관리는 선택이고, 진료시간 · 의료진 · 진료과목처럼 바뀌는 문구는 의료법 검수를 거쳐 반영합니다. 도메인과 서버는 원장님 명의라 계약이 끝나도 홈페이지는 원장님 것입니다." };
const G07: FaqItem = { q: "세팅은 얼마나 걸리나요?", a: "새로 만들면 제작 기간 15영업일 안에 함께 끝납니다. 정비는 쪽 수를 본 뒤 진단서에 일정을 적어 드립니다." };
const G08: FaqItem = { q: "AI 가 우리 병원 문구를 바꿔 말하면 의료법 문제가 생기지 않나요?", a: "AI 는 문장을 줄여 옮길 때 뒤에 붙은 조건을 먼저 빼는 일이 잦습니다. 그래서 조건을 문장 끝에 붙이지 않고 주어 안에 넣어, 잘려서 인용돼도 약속이나 과장으로 읽히지 않게 씁니다. 모든 문구는 의료법 검수를 거친 뒤 원장님 확인을 받아 공개합니다." };
const G09: FaqItem = { q: "세팅한 뒤 무엇을 보여 주나요?", a: "검색 수집 기록 · 구조화 데이터 검사 결과 · AI 질문 관측 기록(질문 원문 · 날짜 · 사용한 AI)을 보여 드립니다. 관측 기록은 그날 그 질문에 대한 결과라서 질문 원문과 날짜를 같이 적어 드립니다." };
const G10: FaqItem = { q: "한 번 세팅하면 끝인가요?", a: "AI 답변과 검색 화면은 계속 바뀝니다. 월 관리에는 검색 수집 상태 점검이 들어 있고, 진료 정보가 바뀌면 화면 글자와 구조화 데이터를 같이 맞춥니다." };
export const C04: FaqItem = { q: "병원 홈페이지도 같이 만들 수 있나요?", a: "만듭니다. 진료과목 · 의료진 · 진료시간 · 위치를 글자와 구조화 데이터로 정리하는 병원 홈페이지를 진료과목별 시안에서 골라 시작합니다. 문구는 블로그 원고와 같은 의료법 검수를 거치고, 도메인은 원장님 명의로 등록합니다." };
export const C05: FaqItem = { q: "AI 답변에 우리 병원이 나오게 할 수 있나요?", a: "AI 답변에 어느 병원이 나올지는 AI 가 정합니다. 저희는 AI 가 병원을 설명할 때 근거로 삼는 공식 홈페이지에 진료 정보와 자주 받는 질문의 답을 글자로 갖춰 두고, 정해 둔 질문을 AI 에 물어 본 관측 기록을 날짜와 함께 보여 드립니다." };

/* ── 허브 ── */
export const CLINIC_HOMEPAGE_TITLE = "병원 홈페이지 제작 · 진료과목별 시안 · 의료법 검수"; // H-01
export const CLINIC_HOMEPAGE_DESC = "진료과목 · 의료진 · 진료시간 · 위치를 글자와 구조화 데이터로 정리하는 병원 홈페이지 제작입니다. 문구는 의료법 검수를 거치고 도메인은 원장님 명의로 등록합니다."; // H-03
export const CLINIC_HOMEPAGE_KEYWORDS = ["병원 홈페이지 제작", "병원 홈페이지", "병원 홈페이지 제작 업체", "병원 홈페이지 제작 비용", "의원 홈페이지 제작", "개원 홈페이지 제작", "병원 홈페이지 리뉴얼", "병원 홈페이지 유지관리"];

export const CLINIC_HOMEPAGE: KeywordServiceData = {
  path: CLINIC_HUB_PATH,
  badge: "병원 홈페이지 제작",
  h1: "병원 홈페이지, 검색과 AI 가 읽을 수 있는 글자로 만듭니다", // H-02
  // 아래 intro · includes · steps · costFactors · never 3 · 4 · report · FAQ 셋은 b591098 (10/27) 진우 검수 문장 그대로
  intro:
    "병원 홈페이지는 환자가 진료과목과 의료진, 진료시간, 오시는 길을 확인하고 예약이나 문의로 넘어가는 자리입니다. 하랑마케팅은 병·의원 홈페이지를 만들 때 의료광고에 쓰면 안 되는 표현을 따로 검수하고, 네이버 · 구글 검색과 AI 답변 서비스가 수집해 갈 수 있도록 구조화 데이터 · 사이트맵 · 질문과 답 같은 기본 구조를 함께 세팅합니다. 2020년에 개업한 7년차 회사이고, 마케터 경력 10년 동안 누적 500건을 진행했습니다.",
  answer: {
    question: "병원 홈페이지 제작은 무엇이 다른가요?", // H-04
    answer:
      "병원 홈페이지는 예쁜 화면보다 진료과목 · 의료진 · 진료시간 · 위치가 글자로 적혀 있는지가 먼저입니다. 이미지 안에 넣은 글자는 검색엔진과 AI 가 본문으로 읽기 어렵습니다. 하랑마케팅은 이 정보를 글자와 구조화 데이터로 정리하고, 문구는 의료법 검수를 거친 뒤 원장님 확인을 받아 공개합니다.",
  },
  facts: FACTS,
  serviceName: "병원 홈페이지 제작",
  serviceDesc:
    "병·의원의 진료과목 · 의료진 · 진료시간 · 오시는 길을 환자가 찾기 쉽게 정리하고, 의료법 문구 검수와 SEO · AEO · GEO 기본 세팅을 함께 하는 병원 홈페이지 제작.",
  includes: [
    { title: "진료 정보 구조", body: "진료과목 · 의료진 · 진료시간 · 오시는 길 · 주차 안내를 환자가 찾는 순서대로 나누고, 진료과목마다 따로 볼 수 있게 페이지를 짭니다." },
    { title: "의료법 문구 검수", body: "치료경험담 · 다른 병원과의 비교 · 과장 · 법적 근거 없는 '전문' 명칭과 인증 표기처럼 의료법 제56조 제2항에 걸리는 표현을 올리기 전에 기준표로 한 줄씩 따로 확인합니다. 전후 사진은 같은 조건에서 찍고 결과를 과장하는 보정 없이, 시술명 · 시술일자 · 발생할 수 있는 부작용 경고 문구를 사진 안에 함께 적을 때만 씁니다. 환자 얼굴이 나오면 서면 동의를 확인한 뒤에 씁니다." },
    { title: "SEO 기본 세팅", body: "페이지마다 제목 · 설명 · 구조화 데이터(병원 정보 · 자주 묻는 질문) · 사이트맵을 넣고 네이버 서치어드바이저와 구글 서치콘솔에 등록합니다." },
    { title: "AEO · GEO 질문과 답 구성", body: "환자가 실제로 묻는 진료시간 · 주차 · 예약 방법 · 진료과목을 질문과 답으로 정리하고, 병원명 · 주소 · 전화번호를 네이버 플레이스와 지도에 적힌 정보와 똑같이 맞춥니다." },
  ],
  steps: [
    { name: "상담 · 자료 확인", text: "진료과목, 의료진 약력, 진료시간, 사진, 이미 쓰고 계신 문구를 받아 무엇을 먼저 보여 줄지 정합니다." },
    { name: "구성 · 문구 초안", text: "진료과목별 페이지와 자주 묻는 질문을 짜고, 확인된 정보로만 문구를 씁니다." },
    { name: "의료법 문구 검수", text: "올리기 전에 표현을 한 줄씩 확인하고, 고칠 곳은 걸리는 조항과 함께 알려 드립니다." },
    { name: "오픈 · 검색 등록", text: "원장님 명의 도메인으로 열고 네이버 서치어드바이저와 구글 서치콘솔에 등록한 뒤 관리 방법을 알려 드립니다." },
  ],
  costFactors: [
    "제작비는 홈페이지 제작 가격표의 등급을 기준으로 합니다.",
    "진료과목과 의료진이 많아 페이지가 늘어나면 제작 범위가 커집니다.",
    "예약 연동이나 현장 촬영이 필요하면 범위를 따로 확인합니다.",
    "도메인 · 서버 실비는 원장님 명의로 직접 결제하십니다.",
  ],
  // 10/27 판정 H-08 : 결과 약속을 부정하는 두 칸(순위 · AI 노출 / 환자 수 · 매출)은 뺐다. 설계 사실 두 칸만 남긴다
  never: [
    { title: "환자 치료 후기를 홈페이지에 싣지 않습니다", body: "치료경험담은 의료법 제56조 제2항 제2호의 금지 항목이라 싣지 않습니다. 전후 사진은 위 조건을 모두 갖춘 경우에만 씁니다." },
    { title: "체험단 · 후기 이벤트를 붙이지 않습니다", body: "병·의원에는 후기를 대가로 받는 방식을 제안하지 않습니다." },
  ],
  report:
    "오픈할 때 검색 도구 등록 화면과 페이지 목록을 함께 드립니다. 월 관리를 고르시면 계약 범위 안에서 수정 내역을 정리해 드리고, 문구를 바꿀 때마다 같은 기준으로 다시 검수합니다. 상담한 하랑 대표가 끝까지 맡습니다.",
  faqs: [
    H06,
    H07,
    H08,
    H09,
    { q: "인증 로고나 전문 표기를 넣어도 되나요?", a: "보건복지부 전문병원 지정이나 의료기관 인증처럼 법령에 근거가 있는 것만 넣습니다. 근거가 없는 '전문' 명칭이나 민간 상장 · 추천 표기는 의료법 제56조 제2항 제9호 · 제14호에 걸려 빼 드립니다." },
    { q: "치과 · 한의원 · 피부과도 만들 수 있나요?", a: "만들 수 있습니다. 진료과마다 환자가 찾는 정보와 조심할 표현이 달라, 진료과목에 맞춰 구성과 문구를 따로 짭니다." },
    { q: "홈페이지 말고 병원 마케팅도 같이 맡길 수 있나요?", a: "맡기실 수 있습니다. 네이버 플레이스 · 블로그 · 검색광고 같은 병원 마케팅은 병원 마케팅 안내에서 범위를 보시고, 홈페이지와 정보가 어긋나지 않게 같이 맞춥니다." },
  ],
  faqTitle: "병원 홈페이지 제작 자주 묻는 질문",
  ...CTA,
  crumbs: HUB_CRUMBS,
  related: [
    { label: "병원 GEO · AEO 세팅", href: `${CLINIC_HUB_PATH}/geo` },
    { label: "홈페이지 제작 · 가격", href: "/services/homepage" },
    { label: "병원 마케팅", href: "/services/clinic" },
    { label: "의료광고 심의 판정 자료", href: "/services/clinic/medical-ad-guide" },
    { label: "무료 진단", href: "/free-check" },
  ],
};

/* ── GEO · AEO ── */
export const CLINIC_GEO_PATH = `${CLINIC_HUB_PATH}/geo`;
export const CLINIC_GEO_TITLE = "병원 GEO · AEO 세팅 · AI 가 읽는 병원 홈페이지"; // G-01
export const CLINIC_GEO_DESC = "검색엔진이 찾는 기초(SEO) 위에 AI 브리핑이 인용할 수 있는 답(AEO)과 생성형 AI 가 병원을 설명할 근거(GEO)를 차례로 쌓는 병원 홈페이지 세팅입니다."; // G-03
export const CLINIC_GEO_KEYWORDS = ["병원 GEO", "병원 AEO", "병원 SEO", "병원 AI 검색 최적화", "병원 AI 브리핑", "GEO 뜻", "AEO 뜻", "생성형 엔진 최적화"];

/* C-07 · C-08 · C-09 · seo.ts DEFINITIONS 와 같은 글자 */
export const CLINIC_DEFINITIONS = [
  { term: "GEO(생성형 엔진 최적화)", definition: "ChatGPT · Claude · Gemini 같은 생성형 AI 가 업체를 설명할 때 근거로 삼을 수 있도록 공식 홈페이지에 업체 · 서비스 · 위치 정보를 확인된 사실로 정리하는 작업. 답변에 나오는지는 AI 가 정한다." },
  { term: "AEO(답변 엔진 최적화)", definition: "네이버 AI 브리핑 · 구글 AI 개요처럼 검색 결과 위에 답을 보여 주는 영역이 인용할 수 있도록 질문과 짧은 답을 쪽 안에 정리하는 작업." },
  { term: "llms.txt", definition: "생성형 AI 가 사이트를 읽을 때 참고하도록 사이트 루트에 두는 업체 정보 요약 파일. 검색 순위를 바꾸는 장치가 아니라 읽기 쉬운 안내문이다." },
];

export const CLINIC_GEO: KeywordServiceData = {
  path: CLINIC_GEO_PATH,
  badge: "병원 GEO · AEO 세팅",
  h1: "병원 GEO · AEO 세팅, 기초 공사부터 3층까지", // G-02
  intro: CLINIC_GEO_DESC,
  answer: {
    question: "병원 GEO · AEO 세팅은 무엇인가요?", // G-04
    answer:
      "SEO 는 검색엔진이 병원 홈페이지를 찾고 읽게 하는 기초입니다. AEO 는 네이버 AI 브리핑과 구글 AI 개요 같은 답변 영역이 인용할 수 있게 질문과 답을 정리하는 일이고, GEO 는 ChatGPT · Claude · Gemini 같은 생성형 AI 가 병원을 설명할 때 근거로 삼을 정보를 공식 홈페이지에 갖춰 두는 일입니다. 검색엔진이 찾지 못한 쪽은 AI 도 찾기 어려워서 세 가지를 따로 하지 않고 기초부터 차례로 쌓습니다.",
  },
  facts: [FACTS[0], FACTS[1], FACTS[3]],
  serviceName: "병원 GEO · AEO 세팅",
  serviceDesc: CLINIC_GEO_DESC,
  includesTitle: "세 가지 말의 뜻", // N-11
  includes: CLINIC_DEFINITIONS.map((d) => ({ title: d.term, body: d.definition })),
  stepsTitle: "병원 홈페이지 점검 다섯", // N-12
  steps: [ // G-05
    "진료과목 · 의료진 · 진료시간 · 위치 · 주차가 이미지가 아니라 글자로 있는가",
    "사진 파일명과 대체 텍스트에 뜻이 있는가",
    "병원 정보가 구조화 데이터로 표시되어 있는가",
    "환자가 실제로 묻는 질문에 답하는 쪽이 있는가",
    "사이트맵 · llms.txt · 서치어드바이저 등록이 되어 있는가",
  ].map((text, i) => ({ name: `점검 ${i + 1}`, text })),
  faqs: [G07, G08, G09, G10, C05],
  faqTitle: "병원 GEO · AEO 세팅 자주 묻는 질문",
  ...CTA,
  crumbs: [...HUB_CRUMBS, { name: "GEO · AEO 세팅", path: CLINIC_GEO_PATH }],
  related: [
    { label: "병원 홈페이지 제작", href: CLINIC_HUB_PATH },
    { label: "홈페이지 제작 · 가격", href: "/services/homepage" },
    { label: "병원 마케팅", href: "/services/clinic" },
    { label: "의료광고 심의 판정 자료", href: "/services/clinic/medical-ad-guide" },
    { label: "무료 진단", href: "/free-check" },
  ],
};

/* ── 과목 쪽 넷 (나-4) · 과목마다 다른 것은 의료법 문답과 시안뿐. 비용 · 기간 · 효과 · 유지는 허브 문답으로 보낸다 ── */
export type ClinicSubjectKey = "dental" | "derma" | "plastic" | "oriental";

export const CLINIC_SUBJECTS: Record<ClinicSubjectKey, {
  name: string; title: string; desc: string; keywords: string[]; prefixes: string[]; data: KeywordServiceData;
}> = {} as never;

const SUBJECT_SRC: { key: ClinicSubjectKey; name: string; title: string; h1: string; intro: string; faq: FaqItem; keywords: string[]; prefixes: string[] }[] = [
  {
    key: "dental", name: "치과",
    title: "치과 홈페이지 제작 · 진료 안내를 글자로", // P-01
    h1: "치과 홈페이지, 진료 안내를 글자로 정리합니다",
    intro: "치과 홈페이지는 진료 항목과 의료진, 진료시간과 위치를 환자가 글자로 확인하는 자리입니다. 하랑마케팅은 치과 시안에서 골라 시작하고, 의료진 소개에는 확인한 지정과 자격만 적습니다. 문구는 의료법 검수를 거친 뒤 원장님 확인을 받아 공개합니다.", // N-21
    faq: { q: "임플란트 전문 같은 표현을 써도 되나요?", a: "전문병원 지정 · 전문의 자격 · 의료기관 인증처럼 지정받은 사실은 쓸 수 있지만, 임플란트 전문 같은 표현은 자격이 아니라 표현이라 의료법 제56조 제2항 제9호에 걸릴 수 있습니다. 홈페이지에는 어느 지정 · 어느 자격인지 확인한 사실만 적습니다." }, // P-02
    keywords: ["치과 홈페이지 제작", "치과 홈페이지", "치과 홈페이지 제작 비용", "치과 홈페이지 리뉴얼"],
    prefixes: ["dental-", "tpl-tm-medic-care-dental"],
  },
  {
    key: "derma", name: "피부과",
    title: "피부과 홈페이지 제작 · 전후 사진 기준까지", // P-03
    h1: "피부과 홈페이지, 사진보다 기준이 먼저입니다",
    intro: "피부과 홈페이지에서 가장 조심할 곳은 전후 사진입니다. 하랑마케팅은 피부과 시안에서 골라 시작하고, 사진은 시술명 · 시술일자 · 부작용 경고가 함께 있을 때만 싣는 기준을 먼저 정한 뒤 화면을 짭니다. 문구는 의료법 검수를 거친 뒤 원장님 확인을 받아 공개합니다.", // N-22
    faq: { q: "시술 전후 사진을 홈페이지에 올려도 되나요?", a: "시술명 · 시술일자 · 부작용 경고 세 가지가 함께 있을 때만 싣습니다(의료법 제56조 제2항 제7호). 시술 장면을 직접 보여 주는 사진은 제6호로 따로 금지되고, 환자 얼굴이 나온 사진은 서면 동의를 확인하기 전까지 쓰지 않습니다." }, // P-04
    keywords: ["피부과 홈페이지 제작", "피부과 홈페이지", "피부과 홈페이지 리뉴얼", "피부클리닉 홈페이지"],
    prefixes: ["derma-", "skincare-", "tpl-tm-maison-doree-skincare"],
  },
  {
    key: "plastic", name: "성형외과",
    title: "성형외과 홈페이지 제작 · 의료법 검수", // P-05
    h1: "성형외과 홈페이지, 후기 칸 없이 설계합니다",
    intro: "성형외과 홈페이지는 후기를 모으는 칸 없이 설계합니다. 하랑마케팅은 성형외과 시안에서 골라 시작하고, 수술 정보와 의료진 · 진료시간 · 위치를 글자로 정리합니다. 문구는 의료법 검수를 거친 뒤 원장님 확인을 받아 공개합니다.", // N-23
    faq: { q: "수술 후기나 사례를 홈페이지에 모아도 되나요?", a: "치료경험담은 의료법 제56조 제2항 제2호가 금지하는 항목이라 후기 칸을 만들지 않습니다. 전후 사진은 시술명 · 시술일자 · 부작용 경고가 함께 있을 때만 싣고, 수술 장면은 싣지 않습니다." }, // P-06
    keywords: ["성형외과 홈페이지 제작", "성형외과 홈페이지", "성형외과 홈페이지 리뉴얼"],
    prefixes: ["plastic-"],
  },
  {
    key: "oriental", name: "한의원",
    title: "한의원 홈페이지 제작 · 진료 과정을 글자로", // P-07
    h1: "한의원 홈페이지, 진료 과정을 사실대로 적습니다",
    intro: "한의원 홈페이지는 진료 과정과 진료 방식을 사실대로 적는 자리입니다. 하랑마케팅은 한의원 시안에서 골라 시작하고, 치료 효과를 단정하는 문장 없이 진료과목 · 의료진 · 진료시간 · 위치를 글자로 정리합니다. 문구는 의료법 검수를 거친 뒤 원장님 확인을 받아 공개합니다.", // N-24
    faq: { q: "한약이나 침 치료 효과를 적어도 되나요?", a: "치료 효과를 단정하거나 다른 진료법과 견주거나 깎아내리는 문장은 쓰지 않습니다. 의료법 제56조 제2항 제8호(과장) · 제4호(비교) · 제5호(비방)에 걸리기 때문입니다. 진료 과정과 진료 방식을 사실대로 적고, 문구는 의료법 검수를 거친 뒤 원장님 확인을 받아 공개합니다." }, // P-08 (2절)
    keywords: ["한의원 홈페이지 제작", "한의원 홈페이지", "한의원 홈페이지 리뉴얼", "한방병원 홈페이지"],
    prefixes: ["oriental-"],
  },
];

for (const s of SUBJECT_SRC) {
  const path = `${CLINIC_HUB_PATH}/${s.key}`;
  CLINIC_SUBJECTS[s.key] = {
    name: s.name, title: s.title, desc: s.intro, keywords: s.keywords, prefixes: s.prefixes,
    data: {
      path,
      badge: `${s.name} 홈페이지 제작`,
      h1: s.h1,
      intro: s.intro,
      answer: { question: s.faq.q, answer: s.faq.a },
      facts: FACTS,
      serviceName: `${s.name} 홈페이지 제작`,
      serviceDesc: s.intro,
      faqs: [s.faq],
      faqTitle: `${s.name} 홈페이지 제작 자주 묻는 질문`, // N-27
      ...CTA,
      crumbs: [...HUB_CRUMBS, { name: `${s.name} 홈페이지 제작`, path }],
      related: [
        { label: "병원 홈페이지 제작", href: CLINIC_HUB_PATH },
        { label: "병원 GEO · AEO 세팅", href: CLINIC_GEO_PATH },
        ...SUBJECT_SRC.filter((o) => o.key !== s.key).map((o) => ({ label: `${o.name} 홈페이지 제작`, href: `${CLINIC_HUB_PATH}/${o.key}` })),
        { label: "의료광고 심의 판정 자료", href: "/services/clinic/medical-ad-guide" },
      ],
    },
  };
}

/** 사이트맵 · llms.txt · RSS · 허브 하위 목록이 같이 쓰는 목록 (허브 먼저) */
export const CLINIC_LINE_PAGES: { path: string; title: string; desc: string; h1: string }[] = [
  { path: CLINIC_HUB_PATH, title: CLINIC_HOMEPAGE_TITLE, desc: CLINIC_HOMEPAGE_DESC, h1: CLINIC_HOMEPAGE.h1 },
  { path: CLINIC_GEO_PATH, title: CLINIC_GEO_TITLE, desc: CLINIC_GEO_DESC, h1: CLINIC_GEO.h1 },
  ...SUBJECT_SRC.map((s) => ({ path: `${CLINIC_HUB_PATH}/${s.key}`, title: s.title, desc: s.intro, h1: s.h1 })),
];
