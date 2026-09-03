import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import AnswerBlock from "../../../components/AnswerBlock";
import FaqAccordion from "../../../components/FaqAccordion";
import JsonLd from "../../../components/JsonLd";
import { SITE, faqLd, breadcrumbLd, webPageLd, type FaqItem } from "../../../lib/seo";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  Camera,
  CircleAlert,
  ClipboardList,
  FileSearch,
  Info,
  Landmark,
  ScrollText,
  Scale,
  Stethoscope,
} from "lucide-react";

/**
 * 의료광고 심의 판정 자료 (HP/MED · Q-0292)
 *
 * 이 페이지는 의료광고가 아니라 하랑 용역 소개다.
 *  - 특정 병원의 진료를 알리는 문장 · 병원 실명 · 진료 사진을 넣지 않는다 (의료법 제56조 제1항)
 *  - 순위 숫자를 싣지 않는다. 계측 기록의 자리는 /services/clinic 의 RankRecords 다 (D-0177)
 *  - 보장 · 확약 · 몇 위까지 · 몇 배 · 예약 건수 · 환자 수 · 매출은 과거형으로도 적지 않는다 (D-0177)
 *
 * 근거 원본 (기억으로 쓰지 않는다)
 *   본부장\PERSONA-진우.md
 *   본부장\병의원\심의대상_매체판정.md
 *   본부장\병의원\화면판정_체험단_순위보장.md
 *   본부장\병의원\화면판정_순위사례_HC09_HC10.md
 *
 * 법령 조회일 2026-09-02. 개정되면 판정이 바뀌므로 화면에도 조회일을 적는다.
 */

const PATH = "/services/clinic/medical-ad-guide";

const DESCRIPTION =
  "의료광고 사전심의가 필요한 매체와 심의 없이 쓸 수 있는 아홉 가지 항목을 의료법 제57조와 시행령 제24조 순서대로 정리했습니다. 채널 16곳 판정과 확인 불가로 남긴 항목까지 그대로 적었습니다.";

export const metadata: Metadata = {
  title: "의료광고 심의 대상 판정 자료 | 병원 · 치과 · 한의원 마케팅",
  description: DESCRIPTION,
  keywords: [
    "의료광고 심의",
    "의료광고 사전심의 대상",
    "병원마케팅",
    "치과마케팅",
    "한의원 마케팅",
    "병원 홈페이지 제작",
    "병원 개원 광고",
    "의료법 제56조",
    "의료법 제57조",
    "전후 사진 의료법",
  ],
  alternates: { canonical: `${SITE.base}${PATH}` },
  openGraph: {
    title: "의료광고 심의 대상 판정 자료 | 하랑마케팅",
    description: DESCRIPTION,
    url: `${SITE.base}${PATH}`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "하랑마케팅 의료광고 심의 판정 자료" }],
  },
};

/** 법령 조회일 — 화면과 구조화 데이터가 같은 날짜를 쓴다 */
const CHECKED_AT = "2026-09-02";

/* ── 내용 축 : 심의 없이 쓸 수 있는 아홉 가지 ───────────────── */
const EXEMPT_NINE: { item: string; basis: string }[] = [
  { item: "의료기관의 명칭과 소재지와 전화번호", basis: "법 제57조 제3항 제1호" },
  { item: "의료기관이 설치하고 운영하는 진료과목", basis: "법 제57조 제3항 제2호" },
  { item: "소속 의료인의 성명과 성별 및 면허의 종류", basis: "법 제57조 제3항 제3호" },
  { item: "의료기관 개설자 및 개설연도", basis: "시행령 제24조 제7항 제1호" },
  { item: "의료기관의 인터넷 홈페이지 주소", basis: "시행령 제24조 제7항 제2호" },
  { item: "의료기관의 진료일 및 진료시간", basis: "시행령 제24조 제7항 제3호" },
  { item: "법 제3조의5 제1항에 따라 전문병원으로 지정받은 사실", basis: "시행령 제24조 제7항 제4호" },
  { item: "법 제58조 제1항에 따라 의료기관 인증을 받은 사실", basis: "시행령 제24조 제7항 제5호" },
  {
    item: "개설자 또는 소속 의료인이 법 제77조 제1항에 따라 전문의 자격을 인정받은 사실 및 그 전문과목",
    basis: "시행령 제24조 제7항 제6호",
  },
];

const EXEMPT_PLACES: { where: string; verdict: string }[] = [
  { where: "홈페이지 하단 사업자 정보와 진료시간 안내", verdict: "거의 전부 아홉 가지 안입니다" },
  { where: "네이버 플레이스 기본 정보", verdict: "거의 전부 아홉 가지 안입니다" },
  { where: "블로그와 인스타그램 프로필 영역", verdict: "대개 아홉 가지 안입니다" },
  { where: "의료진 소개 페이지", verdict: "자격 사실까지면 아홉 가지 안입니다" },
  { where: "진료 정보 본문 글과 시술 소개", verdict: "아홉 가지 밖입니다. 매체 축으로 넘어갑니다" },
];

/* ── 매체 축 : 채널 16곳 판정 ──────────────────────────────── */
type Verdict = "심의 대상" | "대상 아님" | "확인 불가" | "광고 자체 금지" | "시행 전";

const CHANNELS: { channel: string; verdict: Verdict; basis: string; note: string }[] = [
  {
    channel: "현수막과 벽보와 전단",
    verdict: "심의 대상",
    basis: "법 제57조 제1항 제2호",
    note: "법률 본문에 이름이 그대로 있습니다. 시행령을 볼 것도 없습니다",
  },
  {
    channel: "버스와 지하철 광고",
    verdict: "심의 대상",
    basis: "법 제57조 제1항 제2호",
    note: "차량은 교통수단이고 역사는 교통시설입니다. 내부 표시와 영상 광고도 조문에 명시돼 있습니다",
  },
  {
    channel: "전광판",
    verdict: "심의 대상",
    basis: "법 제57조 제1항 제3호",
    note: "법률 본문에 있습니다",
  },
  {
    channel: "신문과 인터넷신문과 잡지의 기사형 광고",
    verdict: "심의 대상",
    basis: "법 제57조 제1항 제1호",
    note: "법률 본문에 있습니다. 기사 형태라는 점에서 제56조 제2항 제10호에 따로 걸립니다",
  },
  {
    channel: "인터넷뉴스서비스",
    verdict: "심의 대상",
    basis: "시행령 제24조 제1항 제1호",
    note: "같은 네이버라도 뉴스 지면과 블로그 지면은 판정이 다릅니다",
  },
  {
    channel: "병원 자체 홈페이지",
    verdict: "대상 아님",
    basis: "시행령 제24조 제1항 네 가지 어디에도 없습니다",
    note: "인터넷뉴스서비스가 아니고 방송사업자도 아닙니다. 남는 제4호는 일일 평균 이용자 10만명 요건에서 걸러집니다",
  },
  {
    channel: "네이버 블로그",
    verdict: "확인 불가",
    basis: "시행령 제24조 제1항 제4호",
    note: "네이버는 10만명을 넘는 사업자입니다. 못 끊은 것은 운영하는 인터넷 매체의 단위입니다",
  },
  {
    channel: "네이버 플레이스",
    verdict: "확인 불가",
    basis: "시행령 제24조 제1항 제4호",
    note: "같은 해석에 걸립니다. 다만 기본 정보는 아홉 가지 안이라 실무에서는 대부분 면제로 풀립니다",
  },
  {
    channel: "네이버 카페",
    verdict: "확인 불가",
    basis: "시행령 제24조 제1항 제4호",
    note: "같은 해석에 걸립니다. 카페 글은 형식상 제56조 제2항 제10호와 제2호 위험이 겹칩니다",
  },
  {
    channel: "네이버 검색광고",
    verdict: "확인 불가",
    basis: "시행령 제24조 제1항 제4호",
    note: "병원 계정이 아니라 네이버 지면에 직접 실립니다. 법과 별개로 매체사 검수 정책을 따로 확인합니다",
  },
  {
    channel: "인스타그램",
    verdict: "확인 불가",
    basis: "시행령 제24조 제2항과 제1항 제4호",
    note: "사회 관계망 서비스라는 점은 다툼이 적습니다. 못 끊은 것은 개별 계정 단위 여부입니다",
  },
  {
    channel: "스레드",
    verdict: "확인 불가",
    basis: "시행령 제24조 제2항",
    note: "인스타그램과 같은 사업자이고 같은 논점입니다",
  },
  {
    channel: "유튜브",
    verdict: "확인 불가",
    basis: "시행령 제24조 제1항 제4호 또는 제2항",
    note: "어느 호로 가는지부터 갈립니다. 제2호와 제3호는 아닙니다",
  },
  {
    channel: "카카오톡 채널",
    verdict: "확인 불가",
    basis: "시행령 제24조 제1항 제4호 또는 제2항",
    note: "메신저를 사회 관계망 서비스로 보는지가 갈립니다. 친구에게 보내는 메시지는 정보통신망법 제50조 수신동의가 따로 걸립니다",
  },
  {
    channel: "지상파와 케이블 등 방송법상 방송",
    verdict: "광고 자체 금지",
    basis: "법 제56조 제3항",
    note: "심의를 받고 하는 문제가 아니라 아예 할 수 없습니다",
  },
  {
    channel: "비대면진료 중개매체",
    verdict: "시행 전",
    basis: "법 제57조 제1항 제4호의2",
    note: "2026년 12월 24일 시행 예정입니다. 시행일을 대장에 걸어 두고 미리 준비합니다",
  },
];

const VERDICT_STYLE: Record<Verdict, string> = {
  "심의 대상": "bg-blue-600 text-white",
  "대상 아님": "bg-gray-100 text-gray-700 border border-gray-200",
  "확인 불가": "bg-amber-50 text-amber-700 border border-amber-200",
  "광고 자체 금지": "bg-red-50 text-red-700 border border-red-200",
  "시행 전": "bg-gray-100 text-gray-500 border border-gray-200",
};

/* ── 제56조 제2항 금지 15가지 ─────────────────────────────── */
const BANNED_15: { no: string; what: string; where: string }[] = [
  { no: "제1호", what: "평가를 받지 않은 신의료기술 광고", where: "새 장비와 새 시술 소개 글에서 걸립니다" },
  {
    no: "제2호",
    what: "환자 치료경험담 등 치료 효과를 오인하게 할 우려가 있는 내용",
    where: "후기와 체험단과 리뷰가 전부 여기입니다",
  },
  { no: "제3호", what: "거짓된 내용", where: "없는 자격과 없는 실적" },
  {
    no: "제4호",
    what: "다른 의료인등의 기능이나 진료 방법과 비교",
    where: "다른 병원은 3개월이고 저희는 1개월이라는 식의 문장",
  },
  { no: "제5호", what: "다른 의료인등을 비방", where: "다른 진료 방식을 낮춰 부르는 문장" },
  { no: "제6호", what: "수술 장면 등 직접적인 시술행위를 노출", where: "시술 영상과 절개 사진" },
  {
    no: "제7호",
    what: "심각한 부작용 등 중요한 정보를 누락",
    where: "전후 사진에 부작용 문구가 빠진 것",
  },
  { no: "제8호", what: "객관적인 사실을 과장", where: "통증 없는, 재발 없는 같은 단정" },
  {
    no: "제9호",
    what: "법적 근거가 없는 자격이나 명칭을 표방",
    where: "전문과 선정의료기관이 여기서 걸립니다",
  },
  {
    no: "제10호",
    what: "기사 또는 전문가 의견 형태로 표현되는 광고",
    where: "기사형 광고와 기고문 형식",
  },
  {
    no: "제11호",
    what: "심의를 받지 않았거나 심의받은 내용과 다른 광고",
    where: "심의 대상 매체인데 그냥 올린 것",
  },
  { no: "제12호", what: "외국인환자를 유치하기 위한 국내광고", where: "외국인 진료 홍보" },
  {
    no: "제13호",
    what: "소비자를 속이거나 잘못 알게 할 우려가 있는 방법으로 비급여 진료비용을 할인하거나 면제",
    where: "이벤트가와 패키지가",
  },
  {
    no: "제14호",
    what: "각종 상장과 감사장과 인증과 보증과 추천을 사용하거나 유사하게 표현",
    where: "인증 병원, 선정 같은 표기",
  },
  { no: "제15호", what: "그 밖에 대통령령으로 정하는 내용", where: "시행령을 따로 봅니다" },
];

/* ── 전문 표기 판정 ────────────────────────────────────────── */
const PRO_WORDS: { word: string; verdict: string; basis: string; ok: boolean }[] = [
  {
    word: "전문병원으로 지정받은 사실",
    verdict: "쓸 수 있습니다",
    basis: "시행령 제24조 제7항 제4호와 법 제3조의5 제1항",
    ok: true,
  },
  {
    word: "전문의 자격과 그 전문과목",
    verdict: "쓸 수 있습니다",
    basis: "시행령 제24조 제7항 제6호와 법 제77조 제1항",
    ok: true,
  },
  {
    word: "의료기관 인증을 받은 사실",
    verdict: "쓸 수 있습니다",
    basis: "시행령 제24조 제7항 제5호와 법 제58조 제1항",
    ok: true,
  },
  {
    word: "임플란트 전문이나 교정 전문 같은 표현",
    verdict: "쓰지 않습니다",
    basis: "자격이 아니라 표현이라 법 제56조 제2항 제9호로 넘어갑니다",
    ok: false,
  },
];

/* ── 심의기구 셋 ──────────────────────────────────────────── */
const COMMITTEES: { name: string; scope: string }[] = [
  {
    name: "의료광고심의위원회",
    scope:
      "의사, 의원, 병원, 한의사가 개설한 곳을 제외한 요양병원, 정신병원, 치과를 제외한 종합병원, 조산사와 조산원 및 그 개설자",
  },
  {
    name: "치과의료광고심의위원회",
    scope: "치과의사, 치과의원, 치과병원, 치과 종합병원과 그 개설자",
  },
  {
    name: "한방의료광고심의위원회",
    scope: "한의사, 한의원, 한방병원, 한의사가 개설한 요양병원과 그 개설자",
  },
];

/* ── 개원 준비 단계 ───────────────────────────────────────── */
const OPENING_CLINIC: { title: string; body: string }[] = [
  {
    title: "인쇄물은 심의가 먼저이고 제작이 나중입니다",
    body: "현수막과 벽보와 전단, 교통수단 광고, 전광판은 법률 본문에 이름이 그대로 있는 확실한 심의 대상입니다. 인쇄를 넘긴 뒤에 심의가 반려되면 인쇄비가 통째로 날아가고, 심의 없이 걸면 제56조 제2항 제11호가 됩니다.",
  },
  {
    title: "병원 홈페이지는 심의 대상이 아니지만 검수는 제일 촘촘해야 합니다",
    body: "시행령 제24조 제1항 네 가지 어디에도 걸리지 않아 심의는 받지 않습니다. 다만 병원 명의로 나가는 매체라 제56조 제2항 15가지가 전면 적용됩니다.",
  },
  {
    title: "방송은 심의를 받고 하는 문제가 아니라 아예 할 수 없습니다",
    body: "근거는 제56조 제3항입니다. 지상파와 케이블 등 방송법상 방송으로는 의료광고를 하지 못합니다.",
  },
];

/* ── 자주 묻는 질문 (화면 노출 문장을 그대로 FAQPage 로 내보낸다) ── */
const GUIDE_FAQ: FaqItem[] = [
  {
    q: "우리 병원 홈페이지도 심의를 받아야 하나요?",
    a: "병원 자체 홈페이지는 시행령 제24조 제1항이 정한 네 가지 인터넷 매체 어디에도 해당하지 않습니다. 인터넷뉴스서비스가 아니고, 방송사업자가 운영하는 홈페이지도 아니며, 방송이나 TV나 라디오 명칭을 쓰는 매체도 아닙니다. 남는 것은 일일 평균 이용자 수 10만명 이상인 사업자가 운영하는 인터넷 매체인데 의원과 치과의원 홈페이지가 여기에 해당하지 않습니다. 다만 심의를 받지 않을 뿐이고 제56조 제2항의 금지 15가지는 그대로 적용됩니다. 병원 명의로 나가는 매체라 오히려 검수가 제일 촘촘해야 하는 자리입니다.",
  },
  {
    q: "네이버 블로그와 인스타그램은 심의 대상인가요?",
    a: "저희는 확인 불가로 적어 둡니다. 시행령 제24조 제1항 제4호가 일일 평균 이용자 수 10만명 이상인 사업자가 운영하는 인터넷 매체를 대상으로 정하는데, 이 10만명이 플랫폼 단위인지 개별 계정 단위인지가 조문만으로 갈리지 않습니다. 이 한 줄에 온라인 채널 여덟이 걸려 있어서 지어내서 답하지 않습니다. 대신 실무의 답은 내용 축에서 먼저 나옵니다. 의료기관의 명칭과 소재지와 전화번호, 진료과목, 진료일과 진료시간, 홈페이지 주소처럼 아홉 가지 항목 안에 있는 글은 매체와 상관없이 심의를 받지 않습니다. 설득이 시작되는 문장부터 매체를 봅니다.",
  },
  {
    q: "심의 유효기간이 지나면 어떻게 되나요?",
    a: "심의 유효기간은 승인받은 날부터 3년이고, 계속 광고하시려면 만료 6개월 전에 재심의를 신청해야 합니다. 만료된 뒤에도 같은 광고가 걸려 있으면 그 순간부터 제56조 제2항 제11호의 심의를 받지 않은 광고가 됩니다. 위반은 발행일이 아니라 게시 중인 동안 계속 성립하기 때문에 지난 광고일수록 위험이 쌓입니다. 그래서 저희는 병원별로 심의기구와 심의번호와 승인일과 만료일을 대장에 적어 두고 만료 전에 먼저 알려드립니다.",
  },
  {
    q: "전후 사진을 올려도 되나요?",
    a: "시술명과 시술일자와 부작용 경고 세 가지가 같이 붙어야 합니다. 근거는 제56조 제2항 제7호로, 기능이나 진료 방법과 관련해 심각한 부작용 같은 중요한 정보를 누락한 광고를 금지합니다. 셋 중 하나라도 없으면 저희는 게시하지 않습니다. 수술 장면처럼 직접적인 시술행위를 노출하는 것은 제6호로 따로 금지되므로 사진을 쓸 수 있는지부터 먼저 갈립니다. 환자 얼굴이 들어온 사진은 서면 동의를 확인하기 전까지 쓰지 않습니다.",
  },
  {
    q: "임플란트 전문이라고 써도 되나요?",
    a: "지정과 자격과 인증은 사실이고 전문은 표현입니다. 법 제3조의5 제1항에 따라 전문병원으로 지정받은 사실, 법 제77조 제1항에 따라 전문의 자격을 인정받은 사실과 그 전문과목, 법 제58조 제1항에 따라 의료기관 인증을 받은 사실은 심의 없이 쓸 수 있는 아홉 가지 안에 있습니다. 반대로 임플란트 전문이나 교정 전문 같은 표현은 자격이 아니라 표현이라서 제56조 제2항 제9호의 법적 근거가 없는 자격이나 명칭 표방으로 넘어갑니다. 그래서 저희는 이 단어를 보면 지우기 전에 어느 지정인지 어느 전문과목인지부터 여쭙습니다.",
  },
  {
    q: "병원 이벤트나 체험단을 진행해도 되나요?",
    a: "저희는 권하지 않습니다. 치료경험담은 제56조 제2항 제2호가 금지하는 항목이고, 제27조 제3항은 누구든지 영리를 목적으로 환자를 소개하고 알선하고 유인하는 행위 및 이를 사주하는 행위를 하지 못하게 합니다. 조문이 누구든지이고 사주하는 행위까지 적혀 있어서 그 구조를 제안한 대행사도 같이 걸립니다. 대신 원장님 명의의 진료 정보 글과 진료가 아닌 영역의 안내, 자연히 쌓인 리뷰의 답글 관리를 합니다.",
  },
];

const NEXT_LINKS = [
  { href: "/services/clinic", label: "병원과 의원 마케팅", desc: "진행 범위와 순위 계측 기록을 봅니다" },
  { href: "/services/place", label: "네이버 플레이스 SEO", desc: "플레이스 기본 정보와 순위 작업을 봅니다" },
  { href: "/faq", label: "자주 묻는 질문", desc: "계약과 비용에서 많이 받는 질문입니다" },
  { href: "/contact", label: "상담 신청", desc: "지금 글이 위반 상태인지부터 봅니다" },
];

const PAGE_LD = webPageLd({
  path: PATH,
  name: "의료광고 심의 대상 판정 자료",
  description: DESCRIPTION,
  dateModified: CHECKED_AT,
});

const CRUMB_LD = breadcrumbLd([
  { name: "홈", path: "/" },
  { name: "서비스", path: "/services" },
  { name: "병원 · 의원 마케팅", path: "/services/clinic" },
  { name: "의료광고 심의 판정 자료", path: PATH },
]);

/** 섹션 제목 — 단색 아이콘 박스 (WDS · 그라데이션 금지) */
function SectionHead({
  icon: Icon,
  title,
  lead,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl shadow-sm flex items-center justify-center shrink-0"
          style={{ background: "var(--w-primary)" }}
        >
          <Icon size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-snug">{title}</h2>
      </div>
      {lead && <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed">{lead}</p>}
    </div>
  );
}

export default function MedicalAdGuidePage() {
  return (
    <>
      <JsonLd data={PAGE_LD} />
      <JsonLd data={CRUMB_LD} />
      <JsonLd data={faqLd(GUIDE_FAQ, `${SITE.base}${PATH}`)} />
      <Header />
      <main className="pt-[104px] md:pt-[108px] overflow-x-hidden">
        {/* Hero */}
        <section className="bg-gray-950 py-14 md:py-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">
              <Stethoscope size={13} strokeWidth={2.5} />
              Medical Ad Review
            </p>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
              의료광고,
              <br />
              심의부터 보고 시작합니다
            </h1>
            <p className="mt-5 text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl">
              병원 글을 쓰기 전에 하랑마케팅이 실제로 보는 판정표입니다. 어느 채널이 사전심의 대상인지,
              심의 없이 쓸 수 있는 항목이 무엇인지를 의료법 제57조와 시행령 제24조 순서대로 정리했습니다.
            </p>
            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
              <div className="flex items-start gap-3">
                <Info size={16} className="text-blue-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                <div className="min-w-0 space-y-2">
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                    이 자료는 판단용입니다. 심의 신청서와 병원 채널에 인용하실 때는 국가법령정보센터에서
                    조문을 직접 복사해 쓰십시오.
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                    법령 조회일은 2026년 9월 2일입니다. 법이 개정되면 판정도 바뀝니다. 제57조 제1항 제4호의2
                    비대면진료 중개매체는 2025년 12월 23일 신설돼 2026년 12월 24일 시행 예정이라, 오늘 기준으로는
                    아직 심의 의무가 없습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AEO — 한 줄 정답 */}
        <AnswerBlock
          question="병원 광고는 어떤 경우에 사전심의를 받아야 하나요?"
          answer="판정은 두 축입니다. 매체 축은 이 채널이 의료법 제57조 제1항과 시행령 제24조가 정한 심의 대상 매체인지 보고, 내용 축은 그 광고가 법 제57조 제3항과 시행령 제24조 제7항이 정한 아홉 가지 항목만으로 구성됐는지 봅니다. 두 축이 만나는 자리에서만 심의 의무가 생깁니다. 매체가 심의 대상이어도 내용이 아홉 가지 안이면 그대로 올립니다. 현수막과 전단, 교통수단 광고, 전광판, 신문과 인터넷신문, 인터넷뉴스서비스 다섯은 법률 본문에 이름이 그대로 있어 확실한 심의 대상이고, 병원 자체 홈페이지는 시행령이 정한 네 가지 인터넷 매체 어디에도 걸리지 않아 대상이 아닙니다. 다만 심의 대상이 아니라는 말은 아무거나 써도 된다는 뜻이 아닙니다. 제56조 제2항의 금지 15가지는 매체를 가리지 않고 전부 적용됩니다."
          facts={[
            { label: "확실한 심의 대상", value: "5개 채널" },
            { label: "심의 없이 쓰는 항목", value: "9가지" },
            { label: "심의 유효기간", value: "3년" },
            { label: "재심의 신청", value: "만료 6개월 전" },
          ]}
        />

        {/* 1. 내용 축 — 아홉 가지 */}
        <section id="exempt-nine" className="py-12 md:py-16 bg-white scroll-mt-28">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHead
              icon={ClipboardList}
              title="심의 없이 쓸 수 있는 아홉 가지"
              lead="법 제57조 제3항의 세 가지와 시행령 제24조 제7항의 여섯 가지를 합친 것입니다. 원장님이 물으시는 것의 상당수가 여기서 끝납니다. 아래 아홉 가지만으로 구성된 광고는 심의 대상 매체에 올려도 심의를 받지 않습니다."
            />

            <ol className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {EXEMPT_NINE.map((e, i) => (
                <li
                  key={e.basis}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm flex items-start gap-3"
                >
                  <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center shrink-0 tabular-nums">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-relaxed">{e.item}</p>
                    <p className="text-xs text-gray-500 mt-1.5">{e.basis}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 md:p-5">
              <div className="flex items-start gap-3">
                <CircleAlert size={16} className="text-amber-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-amber-900 mb-1.5">섞이면 전체가 심의 대상으로 돌아갑니다</p>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    면제는 이 아홉 가지로만 구성된 광고에 붙습니다. 아홉 가지 밖의 문장이 한 줄만 들어가도
                    그 광고 전체가 심의 대상이 되고, 아홉 가지 부분만 떼어 면제되지 않습니다.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-base md:text-lg font-bold text-gray-900 leading-relaxed">
              정보만 적으시면 그대로 올리시면 됩니다. 설득을 시작하는 순간 매체를 봐야 합니다.
            </p>

            <div className="mt-6 divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
              {EXEMPT_PLACES.map((p) => (
                <div
                  key={p.where}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-1 sm:gap-4 items-start p-4 bg-white"
                >
                  <p className="text-sm font-semibold text-gray-900 min-w-0">{p.where}</p>
                  <p className="text-xs md:text-[13px] text-gray-500 sm:text-right">{p.verdict}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. 매체 축 — 채널 16곳 */}
        <section id="channels" className="py-12 md:py-16 bg-gray-50 scroll-mt-28">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHead
              icon={FileSearch}
              title="채널 16곳 판정"
              lead="판정은 넷입니다. 심의 대상, 대상 아님, 확인 불가, 광고 자체 금지. 확인 불가는 대상이 아니라는 뜻이 아니라 끊을 근거가 없다는 뜻입니다. 모든 줄에 앞의 아홉 가지가 먼저 걸립니다. 내용이 아홉 가지 안이면 아래 판정과 상관없이 심의를 받지 않습니다."
            />

            <div className="space-y-3">
              {CHANNELS.map((c) => (
                <div
                  key={c.channel}
                  className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`text-[11px] font-black px-2.5 py-1 rounded-lg shrink-0 ${VERDICT_STYLE[c.verdict]}`}
                    >
                      {c.verdict}
                    </span>
                    <p className="text-sm md:text-base font-bold text-gray-900 min-w-0">{c.channel}</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-1.5">{c.basis}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.note}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-gray-500 leading-relaxed">
              세어 보면 심의 대상 5, 대상 아님 1, 확인 불가 8, 광고 자체 금지 1, 시행 전 1로 합이 16입니다.
            </p>
          </div>
        </section>

        {/* 3. 확인 불가 */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHead icon={CircleAlert} title="확인 불가로 남긴 것" />
            <div className="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                시행령 제24조 제1항 제4호는 전년도 말 기준 직전 3개월간 일일 평균 이용자 수가 10만명 이상인
                사업자가 운영하는 인터넷 매체를 심의 대상으로 정합니다. 여기서 10만명이 플랫폼 단위인지 개별
                계정 단위인지가 조문만으로 갈리지 않습니다. 이 한 줄에 온라인 채널 여덟이 전부 걸려 있습니다.
              </p>
              <p>
                그래서 저희는 이 여덟을 확인 불가로 적어 둡니다. 대상이 아니라고 말하지 않고 대상이라고도
                말하지 않습니다. 여기서 틀리면 원장님이 심의를 빠뜨리게 되고, 틀린 값은 빈 값보다 나쁘기
                때문입니다. 다음 걸음은 더 읽는 것이 아니라 자율심의기구에 직접 묻는 것입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 4. 금지 15가지 */}
        <section id="banned-15" className="py-12 md:py-16 bg-gray-50 scroll-mt-28">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHead
              icon={Scale}
              title="금지되는 의료광고 15가지"
              lead="제56조 제2항입니다. 심의와 연결된 것은 제11호 하나뿐이고 나머지 열넷은 매체를 가리지 않고 전부 걸립니다. 심의 대상이 아닌 채널에서도 똑같이 위반입니다."
            />

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-white">
              {BANNED_15.map((b) => (
                <div key={b.no} className="p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg shrink-0">
                      {b.no}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-relaxed">{b.what}</p>
                      <p className="text-xs md:text-[13px] text-gray-500 mt-1.5 leading-relaxed">{b.where}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-gray-600 leading-relaxed">
              제56조 제5항도 같이 봅니다. 제2호부터 제5호까지와 제7호부터 제9호까지를 위반하면
              보건복지부장관이나 시장과 군수와 구청장이 지체 없이 공정거래위원회에 통보합니다. 보건소
              시정명령으로 끝나는 길과 공정거래위원회로 넘어가는 길이 따로 있습니다.
            </p>
          </div>
        </section>

        {/* 5. 전후 사진 */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHead icon={Camera} title="전후 사진은 세 가지가 같이 붙습니다" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {["시술명", "시술일자", "부작용 경고"].map((t) => (
                <div
                  key={t}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm text-center"
                >
                  <p className="text-base md:text-lg font-black text-gray-900">{t}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                셋 중 하나라도 없으면 저희는 게시하지 않습니다. 근거는 제56조 제2항 제7호로, 기능이나 진료
                방법과 관련해 심각한 부작용 같은 중요한 정보를 누락한 광고를 금지합니다. 수술 장면처럼
                직접적인 시술행위를 노출하는 것은 제6호로 따로 금지되므로 사진 자체를 쓸 수 있는지부터
                갈립니다.
              </p>
              <p className="font-semibold text-gray-900">
                환자 얼굴이 들어온 사진은 서면 동의를 확인하기 전까지 쓰지 않습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 6. 전문 표기 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHead
              icon={BadgeCheck}
              title="전문이라는 말은 사실일 때만 씁니다"
              lead="지정과 자격과 인증은 사실이고 전문은 표현입니다. 이 한 줄이 경계입니다."
            />

            <div className="space-y-3">
              {PRO_WORDS.map((p) => (
                <div
                  key={p.word}
                  className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className={`text-[11px] font-black px-2.5 py-1 rounded-lg shrink-0 ${
                        p.ok
                          ? "bg-blue-600 text-white"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {p.verdict}
                    </span>
                    <p className="text-sm md:text-base font-bold text-gray-900 min-w-0">{p.word}</p>
                  </div>
                  <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed">{p.basis}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                그래서 저희는 전문이라는 단어를 보면 지우기 전에 어느 지정인지 어느 전문과목인지부터
                여쭙습니다. 답이 나오면 쓸 수 있고 안 나오면 뺍니다.
              </p>
              <p>
                인증 로고도 같은 자리에서 갈립니다. 제56조 제2항 제14호는 예외 넷을 조문에 명시합니다.
                법 제58조에 따른 의료기관 인증, 정부조직법상 중앙행정기관과 특별지방행정기관과 부속기관 및
                지방자치법상 지방자치단체와 공공기관운영법상 공공기관에서 받은 인증과 보증, 다른 법령에 따라
                받은 인증과 보증, 세계보건기구와 협력을 맺은 국제평가기구 인증 등 대통령령으로 정하는
                광고입니다. 넷 중 어디에도 해당하지 않으면 뺍니다.
              </p>
            </div>
          </div>
        </section>

        {/* 7. 심의 유효기간 */}
        <section id="expiry" className="py-12 md:py-16 bg-white scroll-mt-28">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHead icon={CalendarClock} title="심의는 만료되는 자산입니다" />

            <div className="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                심의 유효기간은 승인받은 날부터 3년입니다. 계속 광고하시려면 유효기간 만료 6개월 전에
                재심의를 신청해야 합니다. 근거는 제57조 제8항과 제9항입니다.
              </p>
              <p>
                만료된 뒤에도 같은 광고가 걸려 있으면 그 순간부터 제56조 제2항 제11호의 심의를 받지 않은
                광고로 바뀝니다. 위반은 발행일이 아니라 게시 중인 동안 계속 성립합니다. 아무도 날짜를 세지
                않으면 조용히 지나갑니다.
              </p>
              <p>
                그래서 저희가 병원 건에서 상시로 하는 일이 만료일을 세는 일입니다. 병원별로 심의기구와
                심의번호와 승인일과 만료일을 대장에 적어 두고 만료 전에 먼저 알려드립니다.
              </p>
            </div>

            <p className="mt-8 mb-4 text-sm font-bold text-gray-900">심의기구는 진료 영역에 따라 갈립니다</p>
            <div className="space-y-3">
              {COMMITTEES.map((c) => (
                <div key={c.name} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl shadow-sm flex items-center justify-center shrink-0"
                      style={{ background: "var(--w-primary)" }}
                    >
                      <Landmark size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm md:text-base font-bold text-gray-900 mb-1">{c.name}</p>
                      <p className="text-xs md:text-[13px] text-gray-600 leading-relaxed">{c.scope}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm font-semibold text-gray-900">
              치과와 병원은 심의기구가 다릅니다. 같은 곳에 넣지 않습니다.
            </p>
          </div>
        </section>

        {/* 8. 후기와 체험단 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHead icon={ScrollText} title="후기와 체험단을 병원에 권하지 않는 이유" />

            <div className="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                치료경험담은 제56조 제2항 제2호가 금지하는 항목입니다. 그리고 제27조 제3항은 누구든지
                본인부담금을 면제하거나 할인하는 행위, 금품 등을 제공하는 행위, 영리를 목적으로 환자를
                의료기관이나 의료인에게 소개하고 알선하고 유인하는 행위 및 이를 사주하는 행위를 하지 못하게
                합니다.
              </p>
              <p>
                조문이 누구든지이고 사주하는 행위까지 적혀 있습니다. 그래서 시술을 무상이나 할인으로 주고
                후기를 받는 구조는 병원만 걸리는 것이 아니라 그것을 제안한 대행사도 같이 걸립니다. 성과가
                안 나와서가 아니라 우리가 걸리기 때문에 하지 않습니다.
              </p>
              <p className="font-semibold text-gray-900">대신 이렇게 합니다.</p>
              <ul className="space-y-2">
                {[
                  "원장님 명의의 진료 정보 글",
                  "주차와 대기시간과 예약 편의와 시설처럼 진료가 아닌 영역의 안내",
                  "자연히 쌓인 리뷰의 답글 관리",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0 mt-2"
                      style={{ background: "var(--w-primary)" }}
                    />
                    <span className="text-sm text-gray-800 font-medium">{t}</span>
                  </li>
                ))}
              </ul>
              <p>
                무료 상담이나 무료 검진, 비급여 진료비 할인, 페이백 같은 금전적 혜택 문구도 쓰지 않습니다.
                진료를 받아보세요, 상담을 받아보세요, 저희 병원을 추천합니다 같은 직접 권유도 마찬가지입니다.
                연락을 유도하는 링크를 지나치게 많이 배치하는 것도 보건소 모니터링 대상입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 9. 개원 준비 */}
        <section id="opening" className="py-12 md:py-16 bg-white scroll-mt-28">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHead icon={Building2} title="개원을 준비하실 때 먼저 걸리는 것" />
            <div className="space-y-3 md:space-y-4">
              {OPENING_CLINIC.map((o) => (
                <div key={o.title} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5">
                  <p className="text-sm md:text-base font-bold text-gray-900 mb-2 leading-snug">{o.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{o.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. 광고 주체 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHead icon={Scale} title="광고의 주체는 병원입니다" />
            <div className="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                제56조 제1항은 의료광고를 할 수 있는 주체를 의료기관 개설자와 의료기관의 장 또는 의료인으로
                정하고, 그 밖의 자는 의료광고를 하지 못하게 합니다. 광고의 주체는 병원이고 행정처분도 병원에
                갑니다. 대행사가 썼다는 것은 면책 사유가 되지 않습니다.
              </p>
              <p>
                그래서 하랑은 원고를 만들고 게시는 병원 명의 채널에서 합니다. 하랑 채널에 특정 병원의 진료를
                알리는 글을 올리지 않고, 사례로 쓸 때도 병원명과 진료 내용을 지우고 저희 용역 이야기로만
                씁니다.
              </p>
              <p className="font-semibold text-gray-900">
                병원 화면에는 이미 잰 것만 적습니다. 보장이나 확약, 몇 위까지, 몇 배 같은 말을 쓰지 않습니다.
                예약 건수와 환자 수와 매출은 저희가 계측하지 못하는 값이라 지난 일로도 적지 않습니다.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FaqAccordion
          items={GUIDE_FAQ}
          title="의료광고 심의에서 가장 많이 받는 질문"
          subtitle="조문 번호와 함께 정리했습니다. 상담 전에 미리 확인해보세요."
          showMoreHref="/faq"
        />

        {/* CTA */}
        <section className="py-14 md:py-20 bg-blue-600">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
              <Stethoscope size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              우리 병원 글이 지금 어느 축에 있는지부터 봅니다
            </h2>
            <p className="text-blue-100 text-sm mb-7 leading-relaxed">
              지금 올라가 있는 글과 홈페이지 문구를 조문 번호로 짚어 드립니다.
              <br />
              상담과 진단은 0원이고, 상담은 하랑 대표가 직접 합니다.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              병원 마케팅 상담 신청 <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* 이어서 볼 곳 */}
        <section className="py-12 md:py-16 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-lg md:text-xl font-black text-gray-900 mb-5">이어서 볼 곳</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {NEXT_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-4 md:p-5 transition-colors"
                >
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    {l.label}
                    <ArrowRight
                      size={14}
                      className="text-gray-400 group-hover:text-blue-600 transition-colors"
                    />
                  </p>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{l.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
