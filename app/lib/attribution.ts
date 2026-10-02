/**
 * 유입 경로 기록 (브라우저 전용)
 *
 * 왜 필요한가
 *   상담 신청이 전부 source='web' 으로만 쌓여서, ChatGPT 광고를 켜도
 *   그 광고에서 온 문의가 몇 건인지 셀 방법이 없었다.
 *   광고 링크에 붙는 UTM·클릭 ID 를 첫 화면에서 잡아 두었다가
 *   상담 신청을 보낼 때 함께 넘긴다.
 *
 * 규칙
 *   마지막 '광고·캠페인' 유입을 기억한다. 그 뒤 직접 방문(파라미터 없음)은 덮어쓰지 않는다.
 *   30일이 지나면 버린다. 개인정보는 담지 않는다 (URL 파라미터와 리퍼러 도메인만).
 *   저장소가 막힌 브라우저(사생활 보호 모드)에서는 조용히 넘어간다.
 */

const KEY = "harang_attr_v1";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
/**
 * 매체가 랜딩 URL 에 자동으로 붙이는 클릭 ID. 앞에 있을수록 먼저 본다.
 * oppref: ChatGPT 광고 클릭 ID (developers.openai.com/ads/measurement-pixel, 2026-10-02 확인).
 *   OpenAI 픽셀이 같은 값을 __oppref 쿠키에도 따로 저장한다. 여기 보관은 상담 기록용이다.
 */
const CLICK_ID_KEYS = ["oppref", "gclid", "fbclid", "n_media"] as const;

/** ChatGPT 화면에서 넘어온 리퍼러 도메인 */
const CHATGPT_HOSTS = ["chatgpt.com", "chat.openai.com"];

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  click_id_type?: string;
  click_id?: string;
  referrer?: string;
  landing?: string;
  ts: number;
}

function referrerHost(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    return host === location.hostname.replace(/^www\./, "") ? undefined : host;
  } catch {
    return undefined;
  }
}

function read(): Attribution | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const a = JSON.parse(raw) as Attribution;
    if (!a?.ts || Date.now() - a.ts > TTL_MS) return null;
    return a;
  } catch {
    return null;
  }
}

/** 첫 화면에서 한 번 부른다. 광고·캠페인 흔적이 있을 때만 저장을 바꾼다 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(location.search);
  const next: Attribution = { ts: Date.now(), landing: location.pathname.slice(0, 80) };

  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) next[k] = v.slice(0, 80);
  }
  for (const k of CLICK_ID_KEYS) {
    const v = params.get(k);
    if (v) {
      next.click_id_type = k;
      next.click_id = v.slice(0, 200);
      break;
    }
  }
  const ref = referrerHost();
  if (ref) next.referrer = ref.slice(0, 80);

  const hasCampaign = Boolean(next.utm_source || next.click_id);
  const fromChatGPT = ref !== undefined && CHATGPT_HOSTS.includes(ref);
  if (!hasCampaign && !fromChatGPT) return;

  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* 저장소 차단 — 기록 없이 진행 */
  }
}

export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  return read();
}

/**
 * 관리자 화면·알림에 찍힐 한 줄 요약.
 * 예: 'chatgpt / cpc / place-check' · 'clid gclid' · 'ref chatgpt.com'
 */
export function attributionLabel(a: Attribution | null = getAttribution()): string {
  if (!a) return "";
  if (a.utm_source) {
    return [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ");
  }
  if (a.click_id_type === "oppref") return "chatgpt ads";
  if (a.click_id_type) return `clid ${a.click_id_type}`;
  if (a.referrer) return `ref ${a.referrer}`;
  return "";
}

/** ChatGPT(OpenAI 광고 또는 답변 속 링크)에서 온 방문인지 */
export function isChatGPTVisit(a: Attribution | null = getAttribution()): boolean {
  if (!a) return false;
  const src = (a.utm_source ?? "").toLowerCase();
  return (
    src.includes("chatgpt") ||
    src.includes("openai") ||
    a.click_id_type === "oppref" ||
    (a.referrer !== undefined && CHATGPT_HOSTS.includes(a.referrer))
  );
}
