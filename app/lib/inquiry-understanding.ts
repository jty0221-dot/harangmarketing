import { PUBLIC_SERVICES } from "./service-catalog";
import type { InquiryKind, InquiryReplyInput } from "./inquiry-reply";

export type InquiryIntent = "price" | "scope" | "schedule" | "contract" | "results" | "report" | "refund" | "refund-policy" | "complaint" | "existing" | "program" | "payment" | "contact" | "assets" | "greeting" | "general";
export interface InquiryAssessment {
  intents: InquiryIntent[];
  services: string[];
  supplied: string[];
  missing: string[];
  reviewReasons: string[];
  needsHumanReview: boolean;
  contactPreference: "message" | "email" | "phone" | "unspecified";
}

const SERVICE_WORDS: [string, RegExp][] = [
  ["kakao-sender", /카톡.*(?:예약|발송)|카카오.*예약.*발송/],
  ["studio", /하랑\s*스튜디오|gif\s*변환|사진\s*(?:세탁|정리)|exif|워터마크/i],
  ["startup", /홈페이지형\s*블로그|블로그\s*(?:스킨|디자인)|위젯|로고|명함/],
  ["detail-page", /상세\s*페이지|상품\s*(?:설명|페이지)\s*제작/],
  ["cafe-distribution", /맘카페|카페\s*(?:배포|홍보|바이럴)|기자단|블로그\s*배포/],
  ["review", /체험단|리뷰\s*(?:모집|마케팅|관리)/],
  ["powercontents", /파워\s*콘텐츠|파워\s*컨텐츠|광고\s*(?:반려|심사|검수)/],
  ["naver-ads", /검색\s*광고|파워링크|네이버\s*광고|광고\s*(?:세팅|운영|대행)/],
  ["sns", /인스타|릴스|sns\s*(?:운영|관리|마케팅)/i],
  ["photo", /사진\s*촬영|촬영\s*(?:가격|비용|견적)|메뉴\s*촬영|공간\s*촬영/],
  ["kakaomap", /카카오\s*맵/],
  ["blog", /블로그/],
  ["place", /플레이스|지도\s*순위/],
];
const INTENT_WORDS: [InquiryIntent, RegExp][] = [
  ["refund", /환불|해지|취소|반환/],
  ["complaint", /불만|항의|실망|약속.*(?:안|못)|사기|고소|소송|소비자원|연락.*(?:안|없)|문제\s*해결/],
  ["existing", /수정\s*(?:요청|해|부탁)|오탈자|진행\s*(?:상황|현황)|기존\s*(?:고객|계약)|결제했|입금했|계약했|작업\s*승인|시안\s*확정/],
  ["price", /가격|비용|견적|단가|얼마|요금|할인|부가세|vat|예산/i],
  ["scope", /어떻게\s*진행|진행\s*(?:방식|방법|과정)|포함|범위|관리.*(?:하나|되나)|제작.*(?:가능|되나)/],
  ["schedule", /언제|기간|납기|며칠|몇\s*(?:일|주|개월)|이번\s*주|다음\s*주|급해|급한|마감|오늘.*(?:가능|시작)/],
  ["contract", /계약\s*기간|최소\s*(?:기간|계약)|약정|위약금|월\s*단위/],
  ["results", /보장|1\s*위|일\s*위|상위\s*노출|매출|성과|효과|순위/],
  ["report", /보고서|리포트|실적|사례|포트폴리오|작업\s*확인|어디.*노출/],
  ["payment", /세금\s*계산서|현금\s*영수증|증빙|카드|결제\s*(?:방식|방법)|계좌/],
  ["contact", /전화|통화|카톡|카카오톡|메일|이메일|상담\s*시간/],
  ["assets", /사진.*(?:없|부족|누락)|자료.*(?:없|부족|보내|전송)|촬영.*어려|원본.*(?:전송|보내)/],
];

export function assessInquiry(q: InquiryReplyInput, kind: InquiryKind, links: string[]): InquiryAssessment {
  const message = q.message || "";
  const text = `${message} ${q.goals || ""}`;
  const services = SERVICE_WORDS.filter(([, re]) => re.test(text)).map(([id]) => id);
  if (services.includes("startup") || services.includes("cafe-distribution")) {
    const index = services.indexOf("blog");
    if (index >= 0 && !/블로그\s*(?:관리|원고|포스팅)/.test(text)) services.splice(index, 1);
  }
  const intentText = message.trim() || q.goals || "";
  const intents = INTENT_WORDS.filter(([, re]) => re.test(intentText)).map(([intent]) => intent);
  if (intents.includes("refund")) {
    const affirmative = intentText.replace(/(?:환불|해지|취소)[^.,\n]{0,14}(?:아닙니다|아니에요|안\s*(?:할|하)|하지\s*않)/g, "");
    if (!/환불|해지|취소|반환/.test(affirmative)) intents.splice(intents.indexOf("refund"), 1);
    else if (/조건|규정|기준|가능|위약|수수료|계약\s*기간/.test(affirmative) && !/(?:환불|해지|취소).{0,12}(?:해주세요|해\s*주세요|요청|처리해|하겠습니다)/.test(affirmative)) intents.splice(intents.indexOf("refund"), 1, "refund-policy");
  }
  if (services.includes("studio") || services.includes("kakao-sender")) intents.push("program");
  const questionless = !/[?？]|문의|얼마|가능|알려|부탁|해주|해\s*주세요/.test(message);
  if (!intents.length && questionless && /감사|고맙|확인했습니다|안녕하세요|자료.*(?:첨부|전달)|좋습니다|승인/.test(message)) intents.push("greeting");
  if (!intents.length) intents.push("general");
  const supplied = links.length ? ["링크"] : [];
  if (q.industry?.trim() && q.industry !== "기타 업종") supplied.push("업종");
  else if (kind !== "other") supplied.push("업종");
  if ((q.budget && !/미정|모르|상담/.test(q.budget)) || /(?:예산|월)\s*\d+[,.\d]*\s*(?:만\s*원|원)/.test(message)) supplied.push("예산");
  if (/서울|경기|인천|부산|대구|광주|대전|울산|제주|고양|일산|부천|김포|포항|강화|\S+[시군구]\s/.test(message)) supplied.push("지역");
  if (/방문\s*(?:수|자)?\s*[:：]?\s*\d|주문\s*(?:수|건)?\s*[:：]?\s*\d|유입\s*[:：]?\s*\d/.test(message)) supplied.push("통계");
  if (/\d{1,2}\s*시|오전|오후|점심|퇴근|저녁|주말/.test(message)) supplied.push("희망시간");
  const contactPreference = /(?:전화|통화).{0,10}(?:말고|어려|불가|안\s*돼)|(?:카톡|문자|톡).{0,8}(?:만|으로)|전화\s*하지/.test(message) ? "message"
    : /(?:메일|이메일).{0,8}(?:만|으로)|email/i.test(message) ? "email"
      : /전화|통화/.test(message) ? "phone" : "unspecified";
  const reviewReasons: string[] = [];
  if (intents.includes("refund") || intents.includes("complaint")) reviewReasons.push("계약·진행 기록을 확인한 대표 답변 필요");
  if (kind === "medical") reviewReasons.push("병의원 표현과 매체별 심의 범위 확인 필요");
  if (/보장|무조건|100\s*%|확실히.*(?:매출|순위)/.test(message)) reviewReasons.push("성과·순위 보장 조건을 자동으로 약속할 수 없음");
  if (/비밀번호|인증\s*번호|계정\s*접속|로그인.*대신/.test(message)) reviewReasons.push("계정 접근 범위와 안전한 전달 절차 확인 필요");
  if (/홈페이지\s*제작|앱\s*개발|채용|입사|제휴|협찬|협업|제품.*(?:교환|불량)|법률\s*자문/.test(message)) reviewReasons.push("공개 서비스 범위와 담당 확인 필요");
  if (intents.includes("general") && !services.length) reviewReasons.push("문의 의도와 적합한 담당 확인 필요");
  const missing: string[] = [];
  if (intents.includes("refund") || intents.includes("existing") || intents.includes("complaint")) {
    if (!/주문\s*번호|계약\s*(?:번호|일)|접수\s*번호/.test(message)) missing.push("계약·주문 식별 정보");
  } else if (!intents.includes("greeting") && !intents.every(i => i === "contact")) {
    if (!services.length && !text.trim()) missing.push("필요한 작업");
    if (!supplied.includes("업종") && !services.some(s => ["studio", "kakao-sender", "photo", "startup", "detail-page"].includes(s))) missing.push("업종과 필요한 작업");
    if (intents.includes("price") && !services.length) missing.push("견적을 받을 서비스와 물량");
    if (services.includes("photo") && !supplied.includes("지역")) missing.push("촬영 지역과 메뉴 수 또는 공간 규모");
    if (services.includes("detail-page") && !/상품\s*\d|\d+\s*종/.test(message)) missing.push("상품 종류와 제작 수량");
  }
  return { intents: [...new Set(intents)], services: [...new Set(services)], supplied: [...new Set(supplied)], missing: [...new Set(missing)].slice(0, 2),
    reviewReasons, needsHumanReview: reviewReasons.length > 0, contactPreference };
}

const SCOPE: Record<string, string> = {
  place: "플레이스는 매장 정보와 검색 키워드를 정리하고 순위 변화를 계측하는 작업으로 진행합니다.",
  blog: "블로그는 기존 계정의 상태와 실제 사례를 먼저 보고, 키워드·원고·이미지 작업·발행 범위를 나눠 제안드립니다.",
  "cafe-distribution": "블로그·카페 배포는 발행 매체와 건수, 원고 제공 여부를 구분해 구성합니다. 기존 브랜드 블로그 운영과는 별도 작업입니다.",
  review: "체험단은 모집과 선정, 방문 안내, 방문 확인과 리뷰 링크 회수까지 진행 범위를 정해 안내드립니다.",
  sns: "인스타그램은 현재 계정과 콘텐츠를 보고 피드·릴스 제작, 운영, 광고 집행 범위를 구분해 제안드립니다.",
  photo: "촬영은 메뉴와 공간 중 필요한 대상, 수량·규모·지역을 기준으로 구성과 보정 범위를 안내드립니다.",
  "detail-page": "상세페이지는 상품의 설명 순서와 카피를 기획하고 필요한 상세 이미지를 제작하는 방식입니다.",
  powercontents: "파워컨텐츠는 광고 원고 설계와 검수 대응 범위를 확인해 진행합니다. 플랫폼의 최종 승인을 대신 약속하지는 않습니다.",
  "naver-ads": "검색광고는 세팅·운영 수수료와 매체에 실제 사용하는 광고비를 나눠 안내드립니다.",
  kakaomap: "카카오맵은 매장 정보와 사진을 정리하는 작업 범위를 먼저 확인합니다.",
  startup: "홈페이지형 블로그는 일반 홈페이지와 다른 상품입니다. PC·모바일 커버, 위젯 등 필요한 구성과 적용 범위를 나눠 안내드립니다.",
  studio: "하랑 스튜디오는 사진 정리와 동영상 GIF 변환을 위한 윈도우 프로그램입니다. 문의하신 기능이 지원되는지부터 확인해 안내드립니다.",
  "kakao-sender": "카톡 예약 발송은 여러 카톡방에 공지와 인사를 예약해 보내는 윈도우 프로그램입니다. 사용 환경과 필요한 발송 방식부터 확인하겠습니다.",
};
function plain(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/["“”`*#—]/g, "").replace(/\s+/g, " ").trim();
}
function priceAnswer(q: InquiryReplyInput, a: InquiryAssessment): string {
  const facts = q.knowledge?.facts || [];
  const priceFacts = facts.filter(f => /가격|비용|얼마|단가/.test(f.question));
  const tokens: Record<string, RegExp> = { blog: /블로그/, startup: /홈페이지형|디자인|위젯/, photo: /촬영/, "detail-page": /상세페이지/, place: /플레이스/, "cafe-distribution": /배포|카페/, studio: /스튜디오/, "kakao-sender": /예약\s*발송/ };
  const designOnly = /로고|명함/.test(q.message || "") && !/홈페이지형|위젯|스킨/.test(q.message || "");
  const selected = a.services.flatMap(id => {
    const token = id === "startup" && designOnly ? /로고|명함/ : tokens[id];
    const fact = priceFacts.find(f => token?.test(f.question) && /부가세|무료|0원/.test(f.answer) && !/보장|무조건|항상.*1위/.test(f.answer));
    return fact ? [fact] : [];
  });
  // Do not reuse a general marketing bill as the price for an unrelated product.
  if (selected.length) {
    return `현재 홈페이지 공개 안내 기준입니다. ${[...new Set(selected.map(f => plain(f.answer)))].join(" ")} ${selected.length < a.services.length ? "공개 가격이 확인되지 않은 나머지 작업은 별도 견적으로 안내드립니다. " : ""}상세한 포함 범위와 최종 견적은 필요한 작업을 확인한 뒤 안내드리겠습니다.`;
  }
  if (/상담.*(?:비용|얼마|유료)|진단.*(?:비용|얼마|유료)/.test(q.message || "")) return "상담과 진단은 무료입니다. 상담 후 계약 여부는 대표님이 결정하시면 됩니다.";
  return `${a.services.length ? `${a.services.map(id => id === "startup" && designOnly ? "로고·명함" : inquiryServiceLabel(id)).join("·")} 비용은` : "비용은"} 작업 물량과 포함 범위에 따라 달라집니다. 공개 가격과 구성은 https://www.harangmarketing.com/services 에서 확인하실 수 있으며, 이번 문의의 최종 금액은 필요한 항목을 확인한 뒤 안내드리겠습니다. 확인하지 않은 가격을 먼저 약속드리지는 않겠습니다.`;
}

export function composeUnderstoodReply(q: InquiryReplyInput, kind: InquiryKind, head: string, links: string[]) {
  const a = assessInquiry(q, kind, links);
  const m = q.message || "";
  const answers: string[] = [];
  const isSupport = a.intents.some(i => ["refund", "complaint", "existing"].includes(i));
  const items = [/(?:프라|플라)모델/.test(m) ? "프라모델" : "", /그릇/.test(m) ? "그릇" : ""].filter(Boolean);
  if (kind === "shop" && !isSupport && items.length) answers.push(`${items.join("·")}${/구매\s*대행/.test(m) ? " 구매대행" : " 판매"}에 관한 요청으로 확인했습니다. 상품군별 구매 이유와 필요한 정보를 나눠 검토하겠습니다.`);
  if (a.intents.includes("complaint")) answers.push("말씀하신 불편과 문제를 먼저 확인하겠습니다. 기존 안내와 실제 진행 기록을 대조해 어떤 부분을 바로잡아야 하는지 안내드리겠습니다.");
  if (a.intents.includes("refund")) answers.push("취소·해지·환불 요청으로 확인했습니다. 계약 내용과 결제·착수·진행 내역에 따라 처리 범위가 달라져, 확인 후 가능한 조치와 정산 내용을 안내드리겠습니다. 접수 단계에서 환불 금액이나 완료일을 확정하지는 않겠습니다.");
  if (a.intents.includes("refund-policy")) answers.push("계약 전 해지·환불 조건에 관한 질문으로 확인했습니다. 선택하신 상품의 계약 기간, 착수 전후의 취소 조건과 정산 기준을 구분해 계약 전에 안내드리겠습니다.");
  if (a.intents.includes("existing") && !a.intents.includes("refund")) answers.push(/입금했|결제했/.test(m) ? "결제·입금 확인 요청으로 받았습니다. 실제 결제 기록과 대조한 뒤 확인 결과를 안내드리겠습니다." : "기존 작업에 관한 요청으로 확인했습니다. 요청하신 수정이나 진행 상태를 기존 작업 범위와 대조해 안내드리겠습니다.");
  if (a.intents.includes("price") && !isSupport) answers.push(priceAnswer(q, a));
  if (a.intents.includes("scope") || a.intents.includes("program") || (!isSupport && a.intents.includes("general"))) {
    answers.push(...a.services.map(id => id === "startup" && /로고|명함/.test(m) && !/홈페이지형|위젯|스킨/.test(m) ? "로고·명함은 필요한 디자인 종류와 시안·수정·원본 제공 범위를 나눠 견적과 진행 방법을 안내드립니다." : SCOPE[id]).filter(Boolean));
    if (!a.services.length && a.intents.includes("scope")) answers.push("현재 상태를 확인하고 필요한 작업과 비용을 제안드린 뒤, 진행 범위가 정해지면 작업과 결과 확인 방식까지 안내드립니다.");
  }
  if (a.intents.includes("program") && /맥|mac|아이폰|안드로이드|모바일/i.test(m)) answers.push("현재 공개 안내는 윈도우 프로그램 기준입니다. 문의하신 다른 운영체제에서 사용할 수 있다고 안내드리지는 않겠습니다.");
  if (a.intents.includes("contract") && !isSupport) answers.push("월 관리, 단건 제작, 개별 보장 조건이 있는 상품은 계약 기준이 서로 다릅니다. 문의하신 구성의 기간과 중단 조건을 구분해 계약 전에 안내드리겠습니다.");
  if (a.intents.includes("schedule")) answers.push("제작·작업 일정과 검색 노출·성과가 나타나는 기간은 구분해서 안내드립니다. 원하시는 일정과 필요한 자료, 현재 작업 가능 일정을 확인한 뒤 착수와 전달 시점을 말씀드리겠습니다.");
  if (a.intents.includes("results") && !isSupport) answers.push("순위나 매출은 현재 상태와 경쟁, 실제 유입·구매 흐름에 따라 달라져 결과를 일괄적으로 보장할 수는 없습니다. 가능한 작업과 확인할 지표를 먼저 정하고 실제 변화로 검토하겠습니다.");
  if (a.intents.includes("report")) answers.push("진행 사례는 https://www.harangmarketing.com/portfolio 에서 보실 수 있습니다. 실제 진행하는 작업은 게시 링크와 확인 가능한 지표를 기준으로 안내드리겠습니다.");
  if (a.intents.includes("payment")) answers.push("결제 방식과 증빙은 선택한 서비스·계약의 결제 내역을 기준으로 안내드리겠습니다. 이미 결제하신 건은 기록부터 확인하고, 발급이나 환불이 완료되기 전에는 완료됐다고 안내하지 않겠습니다.");
  if (a.intents.includes("assets")) answers.push("가지고 계신 사진과 현장 정보를 먼저 보고 활용 가능한 자료와 추가로 필요한 자료를 나누겠습니다. 확인 없이 모든 사진을 사용할 수 있다고 약속하지 않고, 원본 화질을 유지할 수 있는 전달 방식으로 안내드리겠습니다.");
  if (kind === "medical" && !isSupport) answers.push("병의원은 매체와 표현에 따라 사전 확인이 필요한 범위가 달라, 실제 사용할 문구와 소재를 검토한 뒤 진행 가능 범위를 안내드리겠습니다.");
  if (/홈페이지\s*제작/.test(m) && !/홈페이지형/.test(m)) answers.push("일반 홈페이지 제작과 홈페이지형 블로그는 다른 작업입니다. 필요한 기능과 관리 범위를 확인하고 실제 제공 가능한 구성을 구분해 안내드리겠습니다.");
  if (!answers.length && a.intents.includes("greeting")) answers.push(/감사|고맙/.test(m) ? "말씀 감사합니다. 추가로 확인하실 내용이 생기면 편하게 남겨주세요." : "남겨주신 내용 확인했습니다. 자료나 승인과 관련된 내용은 기존 작업에 맞춰 확인하겠습니다.");
  if (!answers.length) answers.push("남겨주신 내용을 확인했습니다. 필요한 작업과 담당 범위를 먼저 확인해 답변드리겠습니다.");
  const evidence = (q.research?.links || []).filter(e => links.includes(e.url));
  const read = evidence.filter(e => e.state === "read");
  const pending = links.length - new Set(evidence.map(e => e.url)).size;
  const linkLines = links.length ? [`보내주신 링크 ${links.length}개는 받은 자료로 확인했습니다.`,
    ...read.map(e => `공개 페이지에서 ${plain(e.title || "소개 정보")}${e.products?.length ? `, ${e.products.slice(0, 2).map(plain).join(", ")} 상품 정보` : ""}를 확인했습니다.`),
    evidence.some(e => e.state !== "read") ? `${evidence.filter(e => e.state !== "read").length}개 링크는 접속 제한이나 조회 오류로 내용을 읽지 못해 해당 페이지의 상태를 판단하지 않았습니다.` : "",
    pending > 0 ? "페이지 내용은 아직 확인 전이므로, 확인된 자료와 구분해서 검토하겠습니다." : ""].filter(Boolean) : [];
  if (isSupport) linkLines.splice(1); // A refund reply must not turn into a marketing audit.
  const questions = a.missing.length ? `추가로 필요한 것은 ${a.missing.join(", ")}입니다. 이미 전달하신 자료는 다시 보내주실 필요 없습니다.` : "";
  const preference = a.contactPreference === "message" ? "전화 대신 메시지로 안내드리겠습니다."
    : a.contactPreference === "email" ? "요청하신 이메일 안내 방식으로 준비하겠습니다."
      : a.contactPreference === "phone" ? (a.supplied.includes("희망시간") ? "남겨주신 통화 희망시간을 기준으로 연락 가능 여부를 확인하겠습니다." : "통화가 편하신 시간을 알려주시면 연락 가능 일정을 확인하겠습니다.") : "";
  const kakao = [head, ...answers, linkLines.join(" "), [questions, preference].filter(Boolean).join(" ")].filter(Boolean).join("\n\n");
  // Keep every requested answer in the SMS draft; silently dropping one is worse than a longer message.
  return { kakao, sms: kakao.replace(/\s*\n\s*/g, " "), needsResearch: !isSupport && (pending > 0 || (a.intents.includes("price") && !q.knowledge)), assessment: a };
}

export function inquiryServiceLabel(id: string): string {
  return PUBLIC_SERVICES.find(service => service.id === id)?.title || id;
}
