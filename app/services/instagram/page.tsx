import Link from "next/link";
import {
  AtSign, ClipboardList, Layers, Camera, TrendingUp, Ban, ShieldCheck,
  Phone, ArrowRight, Search, MessageCircle, Link2, Image as ImageIcon,
  BarChart3, Clock, Users, Target, Sparkles, ListOrdered,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnswerBlock from "../../components/AnswerBlock";
import FaqAccordion from "../../components/FaqAccordion";
import JsonLd from "../../components/JsonLd";
import {
  SITE, ORG_ID, LOCAL_ID, faqLd, breadcrumbLd, webPageLd, howToLd, type FaqItem,
} from "../../lib/seo";

/**
 * 인스타그램 계정 관리 랜딩.
 *
 * 왜 만들었나 (대표 지시 2026-09-05) · 서비스 허브(app/services/page.tsx)의
 * SNS 카드에는 href 가 없었다. 인스타를 파는데 착지할 페이지가 없었다는 뜻이다.
 * /sns 는 NEXT_PUBLIC_SNS_STORE 플래그로 통째로 404 라 그 아래 두면 안 된다.
 *
 * 문구의 근거 (지어내지 않았다)
 *   - 하랑 공식 블로그가 이 주제로 여덟 편을 썼고 논조가 일관된다.
 *     대표 글 제목이 계정 세팅 없이 광고비만 날리고 계시나요 이고,
 *     본문 도입이 많은 대행사가 노출 보장을 말한다는 지적으로 시작한다.
 *     그래서 이 페이지의 뼈대는 순서다. 세팅이 먼저고 확산이 나중이다.
 *   - 하이라이트 6칸은 본부장/인스타/하이라이트-표준.md 원문 그대로다.
 *   - 진단 30항목(8+6+5+6+5)은 본부장/인스타/진단-체크리스트.md 의 실제 구성이다.
 *   - 확산의 원칙은 본부장/인스타/부스트-정책.md 의 안전선을 옮긴 것이다.
 *
 * 옮기지 않은 것
 *   - 도매 단가. 부스트-정책.md 의 금액은 전부 원가라 화면에 적지 않는다.
 *   - 상품명. 계정상위노출 과 알고리즘 폭발 은 도매 스토어의 상품명이다.
 *     그대로 쓰면 노출 보장으로 읽혀 광고 심사에서 반려된다. 하는 일로 바꿔 적었다.
 *   - 사례 수치. 지은(인스타 팀장)에게 받기 전이라 비워 두었다.
 *     대신 무엇을 재서 보고하는지를 적어 페이지가 숫자 없이도 완결되게 했다.
 *     받으면 REPORT_METRICS 섹션 아래에 사례 섹션 하나를 끼우면 된다.
 *
 * 가격은 넣지 않는다. /services#pricing 한 곳에만 둔다. 새 가격 표기는 결재 사항이다.
 */

const PATH = "/services/instagram";
const URL = `${SITE.base}${PATH}`;
const CTA_HREF = "/contact?service=instagram";
const KAKAO_HREF = SITE.kakaoChat;

/* 이 페이지의 뼈대. 순서가 거꾸로면 돈이 샌다는 것을 두 줄로 보여 준다. */
const ORDER_WRONG = [
  "광고부터 돌립니다",
  "사람이 프로필에 들어옵니다",
  "무엇 하는 곳인지 3초 안에 모릅니다",
  "그대로 나갑니다. 광고비만 나갑니다",
];

const ORDER_RIGHT = [
  "계정을 30개 항목으로 잽니다",
  "막고 있는 것부터 고칩니다",
  "하이라이트로 들어온 사람이 지나갈 복도를 만듭니다",
  "그다음에 콘텐츠를 올리고 확산합니다",
];

/* 대표가 말한 네 가지를 하는 일 로 바꿔 적은 것 */
const WORKS = [
  {
    icon: ClipboardList,
    name: "계정 진단과 최적화",
    lead: "지금 무엇이 막고 있는지부터 잽니다",
    body:
      "프로필, 콘텐츠, 하이라이트, 지표, 계정 안전 다섯 갈래를 30개 항목으로 직접 재 봅니다. 잘하고 있는 것, 문제 다섯 가지, 손대지 않을 것, 4주 실행표 네 장으로 정리해 드립니다. 추측으로 적지 않고 저희가 못 재는 값은 측정 불가로 남깁니다.",
  },
  {
    icon: Layers,
    name: "하이라이트 세팅",
    lead: "프로필에 들어온 사람이 나가기 전에 거치는 복도입니다",
    body:
      "여섯 칸을 방문자가 머릿속에서 묻는 순서대로 세웁니다. 커버 시안을 여러 장 만들어 드리고 대표님이 고르시면 그 계열로 전부 맞춥니다. 칸마다 스토리를 서너 장씩 채워야 세팅이 끝난 것입니다.",
  },
  {
    icon: Camera,
    name: "콘텐츠 정기 발행",
    lead: "피드와 스토리와 릴스를 정해진 간격으로 올립니다",
    body:
      "무엇을 언제 올릴지는 저희가 정하고 릴스 영상 제작은 영상팀이 맡습니다. 새 주제를 찾는 것보다 이미 반응이 났던 글을 다시 쓰는 쪽이 빠릅니다. 몰아서 올리고 비우는 것이 반복되면 계정 성적이 먼저 떨어집니다.",
  },
  {
    icon: TrendingUp,
    name: "반응이 난 글의 확산",
    lead: "이미 움직이기 시작한 게시물의 초기 구간만 밀어 줍니다",
    body:
      "올린 직후 몇 시간이 그 게시물이 얼마나 퍼질지 정해지는 구간입니다. 그 구간에만 붙이고 반응이 없는 글과 비어 있는 계정에는 쓰지 않습니다. 한 번에 몰아 넣지 않고 시간을 나눠 넣습니다.",
  },
];

/* 본부장/인스타/하이라이트-표준.md 원문. 순서와 이름을 바꾸지 않는다. */
const HIGHLIGHT_SLOTS = [
  { no: "1", ask: "여기 뭐 하는 데지", name: "무슨 일", fill: "한 줄 소개 · 서비스 셋 · 안 하는 일" },
  { no: "2", ask: "진짜 하긴 하나", name: "작업물", fill: "실제 결과물 캡처 여러 장" },
  { no: "3", ask: "다른 사람은 뭐래", name: "후기", fill: "고객 후기 캡처 · 이름은 가림" },
  { no: "4", ask: "얼마고 어떻게 하지", name: "비용·절차", fill: "이미 공개한 단가 · 진행 단계" },
  { no: "5", ask: "믿을 만한가", name: "인사이트", fill: "업계 변화 정리 · 대표 관점" },
  { no: "6", ask: "어떻게 문의하지", name: "문의", fill: "상담 방법 · 링크 · 응답 시간" },
];

const HIGHLIGHT_RULES = [
  {
    icon: ListOrdered,
    title: "여섯 칸이 상한입니다",
    body: "휴대폰 첫 줄에 네 칸 반이 보이고 나머지는 옆으로 밀어야 나옵니다. 일곱 칸부터는 사실상 없는 칸입니다.",
  },
  {
    icon: Search,
    title: "이름은 여덟 자를 넘기지 않습니다",
    body: "넘으면 말줄임으로 잘려서 무슨 칸인지 알아볼 수 없게 됩니다.",
  },
  {
    icon: MessageCircle,
    title: "마지막 칸은 반드시 문의입니다",
    body: "복도의 끝에 문이 있어야 합니다. 여기까지 본 사람이 그냥 나가지 않게 하는 칸입니다.",
  },
];

/* 진단 30항목. 8+6+5+6+5 = 30 */
const DIAG_GROUPS = [
  {
    icon: Target,
    name: "프로필",
    count: 8,
    items: ["계정 유형", "검색되는 이름 칸", "소개글 첫 줄", "소개글 마지막 줄", "링크 도착지", "액션 버튼", "프로필 사진", "연결 계정"],
  },
  {
    icon: ImageIcon,
    name: "콘텐츠",
    count: 6,
    items: ["최근 게시일", "발행 간격의 규칙성", "릴스 비중", "첫 화면 세 장", "캡션 첫 두 줄", "해시태그"],
  },
  {
    icon: Layers,
    name: "하이라이트",
    count: 5,
    items: ["칸 개수와 순서", "커버 통일", "이름 길이", "안쪽 스토리 장수", "문의 칸 유무"],
  },
  {
    icon: BarChart3,
    name: "지표",
    count: 6,
    items: ["도달", "프로필 방문", "저장", "공유", "외부 링크 클릭", "참여율"],
  },
  {
    icon: ShieldCheck,
    name: "계정 안전",
    count: 5,
    items: ["2단계 인증", "권한 위임 방식", "연동 앱 정리", "제재 이력", "복구 수단"],
  },
];

const DIAG_TOTAL = DIAG_GROUPS.reduce((sum, g) => sum + g.count, 0);

/* 본부장/인스타/부스트-정책.md 의 안전선. 금액은 옮기지 않는다. */
const SPREAD_RULES = [
  {
    title: "반응이 난 글에만 붙입니다",
    body: "확산은 이미 굴러가기 시작한 것을 밀어 주는 일입니다. 아무도 안 보는 글에 붙이면 그 돈은 그냥 사라집니다.",
  },
  {
    title: "팔로워는 사지 않습니다",
    body: "숫자만 늘면 참여율이 내려가고, 참여율이 내려가면 그다음에 올리는 모든 글의 도달이 같이 깎입니다. 한 번 깎인 계정을 되돌리는 편이 더 비쌉니다.",
  },
  {
    title: "한 번에 몰아 넣지 않습니다",
    body: "올린 직후, 몇 시간 뒤, 다음 날로 나눠 넣습니다. 한꺼번에 들어가면 그래프 모양이 사람이 본 것처럼 보이지 않습니다.",
  },
  {
    title: "같은 글에 두 번 넣지 않습니다",
    body: "한 게시물에 반복해서 붙이는 것은 가장 눈에 띄는 방식입니다. 계정에 표시가 남습니다.",
  },
  {
    title: "계정마다 상한을 두고 넘기지 않습니다",
    body: "하루치와 한 달치 상한을 정해 놓고 그 안에서만 씁니다. 상한을 올려 달라는 요청은 받지 않습니다.",
  },
];

const NOT_DOING = [
  {
    title: "노출 순위를 보장하지 않습니다",
    body: "몇 위까지 올려 드린다는 말을 화면에도 계약서에도 쓰지 않습니다. 인스타가 기준을 언제 바꾸는지는 저희가 정하지 못합니다.",
  },
  {
    title: "팔로워와 좋아요를 사서 채우지 않습니다",
    body: "그날 숫자는 올라가지만 계정 성적이 내려갑니다. 걸리면 게시물이 아니라 계정이 내려갑니다.",
  },
  {
    title: "비밀번호를 받지 않습니다",
    body: "계정 권한은 인스타가 정한 방식으로만 받습니다. 아이디와 비밀번호를 알려 달라고 하지 않습니다.",
  },
  {
    title: "병원과 의원에는 체험단을 하지 않습니다",
    body: "후기는 의료법에서 치료경험담으로 봅니다. 시술을 무상이나 할인으로 주고 후기를 받는 구조는 제안한 대행사도 같이 걸립니다.",
  },
];

/* 숫자를 지어내지 않기 위한 자리. 무엇을 재는지만 적는다. */
const REPORT_METRICS = [
  { icon: Users, label: "도달", note: "몇 명에게 닿았는지" },
  { icon: AtSign, label: "프로필 방문", note: "글을 보고 프로필까지 들어온 수" },
  { icon: Sparkles, label: "저장과 공유", note: "다시 보려고 담아 둔 수" },
  { icon: Link2, label: "링크 클릭", note: "예약과 상담으로 넘어간 수" },
];

const STEPS = [
  {
    no: "01",
    name: "계정을 잽니다",
    text: "계정 아이디만 알려 주시면 로그인 없이 되는 범위까지 먼저 재 봅니다. 여기까지 비용이 들지 않습니다.",
  },
  {
    no: "02",
    name: "진단서를 드립니다",
    text: "잘하고 있는 것, 문제 다섯 가지, 손대지 않을 것, 4주 실행표를 정리해 드립니다. 이걸 보고 진행 여부를 정하시면 됩니다.",
  },
  {
    no: "03",
    name: "프로필과 하이라이트를 세팅합니다",
    text: "검색되는 이름 칸과 소개글, 링크 도착지를 먼저 고칩니다. 그다음 하이라이트 여섯 칸을 커버부터 안쪽 스토리까지 채웁니다.",
  },
  {
    no: "04",
    name: "정기 발행을 시작합니다",
    text: "피드와 스토리와 릴스를 정해진 간격으로 올립니다. 릴스 영상은 영상팀이 만들고 올리는 것은 계정 담당이 합니다.",
  },
  {
    no: "05",
    name: "매달 무엇이 움직였는지 보고드립니다",
    text: "도달과 프로필 방문, 저장과 공유, 링크 클릭을 재서 드립니다. 팔로워 수를 맨 앞에 두지 않습니다.",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "인스타 계정 최적화는 정확히 무슨 작업인가요?",
    a: "프로필, 콘텐츠, 하이라이트, 지표, 계정 안전 다섯 갈래를 30개 항목으로 실제로 재 보는 일부터 시작합니다. 검색되는 것은 아이디가 아니라 이름 칸이라 거기에 무엇이 들어 있는지, 소개글 마지막 줄에 행동 지시가 있는지, 링크를 눌렀을 때 상담으로 이어지는지 같은 것을 하나씩 봅니다. 재고 나서 잘하고 있는 것과 문제 다섯 가지, 손대지 않을 것, 4주 동안 무엇을 할지를 정리해 드립니다. 여기까지가 진단이고 비용이 들지 않습니다.",
  },
  {
    q: "하이라이트 세팅은 왜 따로 하나요?",
    a: "프로필에 들어온 사람이 게시물을 처음부터 보지 않기 때문입니다. 대부분 하이라이트를 눌러 보고 나갈지 남을지 정합니다. 그래서 여섯 칸을 방문자가 묻는 순서대로 세웁니다. 여기 뭐 하는 데지, 진짜 하긴 하나, 다른 사람은 뭐래, 얼마고 어떻게 하지, 믿을 만한가, 어떻게 문의하지 순서입니다. 여섯 칸이 상한이고 이름은 여덟 자를 넘기지 않으며 마지막 칸은 반드시 문의입니다. 인스타는 하이라이트를 손으로 정렬할 수 없어서 원하는 순서의 역순으로 올려야 합니다.",
  },
  {
    q: "릴스를 밀어 준다는 게 무슨 뜻인가요?",
    a: "올린 직후 몇 시간이 그 게시물이 얼마나 퍼질지 정해지는 구간입니다. 이미 반응이 나기 시작한 게시물의 그 구간에만 붙여서 더 많은 사람에게 닿게 합니다. 반응이 없는 글이나 비어 있는 계정에는 쓰지 않습니다. 그런 데 넣으면 돈만 나가고 계정에는 표시가 남습니다. 한 번에 몰아 넣지 않고 시간을 나눠 넣으며 같은 글에 두 번 붙이지 않습니다. 계정마다 하루치와 한 달치 상한을 정해 두고 그 안에서만 씁니다.",
  },
  {
    q: "팔로워를 늘려 주시나요?",
    a: "사서 늘리지 않습니다. 숫자만 채우면 참여율이 내려가고 참여율이 내려가면 그다음에 올리는 모든 글의 도달이 같이 깎입니다. 한 번 깎인 계정을 원래대로 돌리는 편이 처음부터 쌓는 것보다 오래 걸립니다. 저희는 프로필에 들어온 사람이 나가지 않게 만드는 쪽과 반응이 난 글이 더 퍼지게 하는 쪽으로 접근합니다.",
  },
  {
    q: "상위 노출을 보장해 주시나요?",
    a: "보장하지 않습니다. 인기 게시물에 몇 번째로 올려 드린다는 말을 하지 않습니다. 인스타가 기준을 언제 바꾸는지, 같은 해시태그를 쓰는 다른 계정이 무엇을 올리는지는 저희가 정하지 못하기 때문입니다. 대신 도달과 프로필 방문과 저장이 어떻게 움직였는지를 매달 재서 그대로 보여 드립니다.",
  },
  {
    q: "계정 비밀번호를 드려야 하나요?",
    a: "아닙니다. 인스타가 정한 권한 위임 방식으로만 받습니다. 아이디와 비밀번호를 알려 달라고 하지 않습니다. 진단은 로그인 없이 되는 범위까지 먼저 하고, 그 범위에서 못 재는 값은 측정 불가로 남겨 드립니다.",
  },
  {
    q: "블로그나 플레이스도 같이 해야 하나요?",
    a: "업종에 따라 다릅니다. 검색해서 찾아오는 손님이 많은 곳은 플레이스가 먼저이고, 보고 나서 마음이 움직이는 업종은 인스타가 먼저입니다. 상담 때 지금 어디에서 손님이 오고 있는지부터 보고 순서를 말씀드립니다. 다 하시라고 말씀드리지 않습니다.",
  },
];

const LD = [
  webPageLd({
    path: PATH,
    name: "인스타그램 계정 관리 · 하이라이트 세팅 · 릴스 발행",
    description:
      "인스타그램 계정을 30개 항목으로 실측해 막힌 곳부터 고칩니다. 하이라이트 여섯 칸 세팅, 피드와 스토리와 릴스 정기 발행, 반응이 난 게시물의 초기 확산까지 진행합니다.",
  }),
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "인스타그램 계정 관리 대행",
    description:
      "인스타그램 프로필 최적화, 하이라이트 여섯 칸 세팅, 피드와 스토리와 릴스 정기 발행, 반응이 난 게시물의 초기 확산. 팔로워와 좋아요를 구매하지 않고 노출 순위를 보장하지 않습니다.",
    serviceType: "인스타그램 계정 운영 대행",
    provider: { "@id": ORG_ID },
    areaServed: "대한민국",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: URL,
      servicePhone: SITE.phoneIntl,
      serviceLocation: { "@id": LOCAL_ID },
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "KRW",
      url: `${SITE.base}/services#pricing`,
      description: "상담과 계정 진단 비용 0원. 업종과 진행 범위에 따라 견적을 드립니다.",
    },
  },
  howToLd({
    path: PATH,
    name: "인스타그램 하이라이트 여섯 칸 세팅하는 법",
    description:
      "프로필에 들어온 사람이 묻는 순서대로 하이라이트를 배치하는 방법입니다. 인스타는 하이라이트를 손으로 정렬할 수 없어 원하는 순서의 역순으로 올려야 합니다.",
    totalTime: "PT2H",
    steps: HIGHLIGHT_SLOTS.slice()
      .reverse()
      .map((s) => ({
        name: `${s.name} 칸 만들기`,
        text: `${s.ask} 에 답하는 칸입니다. ${s.fill} 을 스토리로 올린 뒤 이 이름의 하이라이트로 담습니다. 역순으로 올리므로 이 칸을 먼저 만듭니다.`,
      })),
  }),
  faqLd(FAQS, URL),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "인스타그램", path: PATH },
  ]),
];

export default function InstagramServicePage() {
  return (
    <>
      <JsonLd data={LD} />
      <Header />

      <main className="pt-[104px] md:pt-[108px]">
        {/* 히어로 */}
        <section className="bg-gray-950 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 mb-6">
              <AtSign size={14} className="text-blue-400" strokeWidth={2.5} />
              <span className="text-xs md:text-[13px] font-semibold text-blue-200">
                인스타그램 · 계정 운영
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white leading-snug tracking-tight">
              팔로워를 사기 전에
              <br />
              계정부터 고칩니다
            </h1>

            <p className="mt-5 text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl">
              프로필에 들어온 사람이 나가는 이유는 대개 게시물이 아니라 세팅에 있습니다.
              무엇 하는 곳인지 3초 안에 알 수 없고, 눌러 볼 하이라이트가 없고,
              링크를 눌러도 상담으로 이어지지 않습니다.
              저희는 30개 항목을 직접 재서 막고 있는 것부터 찾습니다.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href={CTA_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                계정 진단 받기
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <a
                href={KAKAO_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                <MessageCircle size={16} strokeWidth={2.5} />
                카카오톡으로 묻기
              </a>
            </div>

            <p className="mt-4 text-xs md:text-[13px] text-gray-500">
              상담과 계정 진단 비용은 0원입니다. 진단서를 보고 진행 여부를 정하시면 됩니다.
            </p>
          </div>
        </section>

        <AnswerBlock
          question="인스타그램 계정 최적화는 무슨 작업인가요?"
          answer="인스타그램 계정 최적화는 프로필과 콘텐츠와 하이라이트와 지표와 계정 안전 다섯 갈래를 30개 항목으로 실측해서 방문자가 프로필에서 나가는 지점을 찾아 고치는 작업입니다. 하랑마케팅은 계정을 진단해 문제 다섯 가지와 4주 실행표를 드리고, 하이라이트 여섯 칸을 세팅한 다음 피드와 스토리와 릴스를 정기 발행합니다. 팔로워와 좋아요를 사서 늘리는 방식은 쓰지 않고 노출 순위를 보장하지 않습니다. 상담과 진단 비용은 0원입니다."
          facts={[
            { label: "진단 항목", value: `${DIAG_TOTAL}개` },
            { label: "하이라이트", value: "6칸 표준" },
            { label: "상담·진단", value: "0원" },
          ]}
        />

        {/* 순서 · 이 페이지의 뼈대 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 leading-snug tracking-tight">
              순서가 거꾸로면 돈이 샙니다
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
              광고를 돌려서 사람을 데려오는 것과 데려온 사람이 남는 것은 다른 일입니다.
              계정이 준비되지 않은 상태에서 광고부터 돌리면 들어온 사람이 그대로 나갑니다.
              저희가 진단을 먼저 하는 이유가 이것입니다.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gray-400 shadow-sm flex items-center justify-center shrink-0">
                    <Ban size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-base md:text-lg font-bold text-gray-700">흔한 순서</p>
                </div>
                <ol className="space-y-3">
                  {ORDER_WRONG.map((t, i) => (
                    <li key={t} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                      <span className="shrink-0 font-bold text-gray-400 tabular-nums">{i + 1}</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-base md:text-lg font-bold text-gray-900">저희 순서</p>
                </div>
                <ol className="space-y-3">
                  {ORDER_RIGHT.map((t, i) => (
                    <li key={t} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                      <span className="shrink-0 font-bold text-blue-600 tabular-nums">{i + 1}</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* 네 가지 작업 */}
        <section className="py-14 md:py-20" style={{ background: "var(--h-surface)" }}>
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 leading-snug tracking-tight">
              하는 일은 네 가지입니다
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
              앞의 둘이 세팅이고 뒤의 둘이 운영입니다.
              세팅을 건너뛰고 운영만 하면 올리는 만큼 나가고, 세팅만 하고 멈추면 그 자리에 그대로 있습니다.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {WORKS.map((w) => (
                <div
                  key={w.name}
                  className="rounded-2xl bg-white p-4 md:p-6 shadow-sm"
                  style={{ border: "1px solid var(--h-border)" }}
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center mb-4">
                    <w.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900">{w.name}</h3>
                  <p className="mt-1.5 text-sm font-semibold text-blue-700">{w.lead}</p>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 진단 30항목 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 leading-snug tracking-tight">
              무엇을 재는지 먼저 보여 드립니다
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
              감으로 좋다 나쁘다를 말하지 않기 위해 항목을 미리 정해 두었습니다.
              다섯 갈래 {DIAG_TOTAL}개 항목이고, 로그인 없이 되는 범위까지는 상담 전에 먼저 재 봅니다.
              저희가 못 재는 값은 측정 불가로 남기고 아는 척하지 않습니다.
            </p>

            <div className="mt-8 space-y-4">
              {DIAG_GROUPS.map((g) => (
                <div
                  key={g.name}
                  className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center shrink-0">
                      <g.icon size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base md:text-lg font-bold text-gray-900">{g.name}</p>
                      <p className="text-xs md:text-[13px] text-gray-500 tabular-nums">{g.count}개 항목</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <span
                        key={it}
                        className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs md:text-[13px] font-medium text-gray-700"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 하이라이트 6칸 */}
        <section className="py-14 md:py-20" style={{ background: "var(--h-surface)" }}>
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 leading-snug tracking-tight">
              하이라이트는 장식이 아니라 복도입니다
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
              프로필에 들어온 사람은 게시물을 처음부터 보지 않습니다.
              하이라이트를 눌러 보고 남을지 나갈지를 정합니다.
              그래서 방문자가 머릿속에서 묻는 순서 그대로 여섯 칸을 세웁니다.
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-3 pr-3 text-xs md:text-[13px] font-bold text-gray-500 w-10">칸</th>
                    <th className="py-3 pr-3 text-xs md:text-[13px] font-bold text-gray-500">방문자가 묻는 것</th>
                    <th className="py-3 pr-3 text-xs md:text-[13px] font-bold text-gray-500">이름</th>
                    <th className="py-3 text-xs md:text-[13px] font-bold text-gray-500">안에 넣는 것</th>
                  </tr>
                </thead>
                <tbody>
                  {HIGHLIGHT_SLOTS.map((s) => (
                    <tr key={s.no} className="border-b border-gray-200">
                      <td className="py-3 pr-3 text-sm font-bold text-blue-600 tabular-nums align-top">{s.no}</td>
                      <td className="py-3 pr-3 text-sm text-gray-700 align-top">{s.ask}</td>
                      <td className="py-3 pr-3 text-sm font-semibold text-gray-900 align-top whitespace-nowrap">{s.name}</td>
                      <td className="py-3 text-sm text-gray-600 align-top">{s.fill}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {HIGHLIGHT_RULES.map((r) => (
                <div
                  key={r.title}
                  className="rounded-2xl bg-white p-4 md:p-6 shadow-sm"
                  style={{ border: "1px solid var(--h-border)" }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gray-900 shadow-sm flex items-center justify-center mb-3">
                    <r.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-sm md:text-base font-bold text-gray-900">{r.title}</p>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 md:p-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 shadow-sm flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm md:text-base font-bold text-gray-900">
                    인스타에는 하이라이트를 손으로 정렬하는 기능이 없습니다
                  </p>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    최근에 스토리를 담은 칸이 왼쪽으로 옵니다.
                    그래서 원하는 순서의 역순으로 올려야 합니다.
                    문의 칸을 가장 먼저 만들고 무슨 일 칸을 가장 나중에 만듭니다.
                    이걸 모르고 순서대로 만들면 문의 칸이 맨 왼쪽에 서게 됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 확산의 원칙 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 leading-snug tracking-tight">
              확산은 되는 것을 미는 일입니다
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
              게시물을 올린 직후 몇 시간이 그 글이 얼마나 퍼질지 정해지는 구간입니다.
              이미 반응이 나기 시작한 글의 그 구간에만 붙입니다.
              안 되는 것을 되게 만드는 도구가 아니라 되기 시작한 것을 더 가게 하는 도구입니다.
            </p>

            <div className="mt-8 space-y-3">
              {SPREAD_RULES.map((r, i) => (
                <div
                  key={r.title}
                  className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm"
                >
                  <div className="flex gap-3">
                    <span className="shrink-0 text-sm font-black text-blue-600 tabular-nums pt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm md:text-base font-bold text-gray-900">{r.title}</p>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{r.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 무엇을 보고하는가. 사례 수치는 인스타 팀장에게 받아 이 아래에 붙인다 */}
        <section className="py-14 md:py-20" style={{ background: "var(--h-surface)" }}>
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 leading-snug tracking-tight">
              매달 무엇이 움직였는지 재서 드립니다
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
              팔로워 수를 맨 앞에 두지 않습니다.
              그 숫자는 올리기도 쉽고 사기도 쉬워서 무엇이 나아졌는지를 말해 주지 못합니다.
              대신 아래 넷을 봅니다. 재지 않은 숫자는 말씀드리지 않습니다.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {REPORT_METRICS.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl bg-white p-4 md:p-6 shadow-sm"
                  style={{ border: "1px solid var(--h-border)" }}
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center mb-3">
                    <m.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-sm md:text-base font-bold text-gray-900">{m.label}</p>
                  <p className="mt-1.5 text-xs md:text-[13px] text-gray-500 leading-relaxed">{m.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 안 하는 일 */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 leading-snug tracking-tight">
              안 하는 일을 먼저 말씀드립니다
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
              할 수 있는 것보다 안 하는 것을 먼저 말하는 편이 나중에 서로 덜 곤란합니다.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {NOT_DOING.map((n) => (
                <div
                  key={n.title}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-4 md:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-900 shadow-sm flex items-center justify-center shrink-0">
                      <Ban size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm md:text-base font-bold text-gray-900">{n.title}</p>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{n.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 진행 순서 */}
        <section className="py-14 md:py-20" style={{ background: "var(--h-surface)" }}>
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 leading-snug tracking-tight">
              진행은 이 순서로 갑니다
            </h2>

            <div className="mt-8 space-y-3">
              {STEPS.map((s) => (
                <div
                  key={s.no}
                  className="rounded-2xl bg-white p-4 md:p-6 shadow-sm"
                  style={{ border: "1px solid var(--h-border)" }}
                >
                  <div className="flex gap-4">
                    <span className="shrink-0 text-lg md:text-xl font-black text-blue-600 tabular-nums">
                      {s.no}
                    </span>
                    <div className="min-w-0">
                      <p className="text-base md:text-lg font-bold text-gray-900">{s.name}</p>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{s.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FaqAccordion
          items={FAQS}
          title="인스타그램 운영에서 자주 받는 질문"
          subtitle="상담 때 가장 많이 나오는 것들을 그대로 적었습니다."
          showMoreHref="/faq"
        />

        {/* CTA */}
        <section className="bg-gray-950 py-14 md:py-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-xl md:text-3xl font-black text-white leading-snug tracking-tight">
              지금 계정이 어디가 막혀 있는지부터 재 드립니다
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-300 leading-relaxed">
              계정 아이디만 알려 주시면 로그인 없이 되는 범위까지 먼저 재 봅니다.
              여기까지 비용이 들지 않고, 진단서를 보고 진행 여부를 정하시면 됩니다.
              상담하는 사람이 그대로 끝까지 맡습니다.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={CTA_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                계정 진단 받기
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                <Phone size={16} strokeWidth={2.5} />
                전화로 묻기
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
