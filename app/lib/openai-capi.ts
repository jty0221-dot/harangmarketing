import "server-only";

/**
 * ChatGPT 광고 Conversions API (서버 → OpenAI).
 * 문서 : developers.openai.com/ads/conversions-api (2026-10-06 확인)
 *
 * - 브라우저 픽셀(Analytics.tsx trackOpenAI)과 같은 id 로 보낸다. OpenAI 가 픽셀 ID · 이벤트 이름 · id 로 겹친 것을 하나로 친다.
 * - 키 OPENAI_CAPI_KEY (서버 전용) 와 픽셀 NEXT_PUBLIC_OPENAI_PIXEL_ID 가 둘 다 있을 때만 보낸다. 없으면 아무것도 안 한다.
 * - 개인정보는 보내지 않는다 (전화 · 이름 · IP 해시 없음). OpenAI 가 준 클릭 표식 oppref 와 픽셀 쿠키 obref 만 쓴다.
 * - 실패해도 상담 접수는 성공으로 둔다. 2.5초 넘으면 끊는다.
 * - 보안 (형권 2026-10-06 · SEC-040) :
 *   referer 와 쿠키는 브라우저가 마음대로 바꿀 수 있다 → source_url 은 우리 주소일 때 경로만 (쿼리 · 조각은 버린다), 표식은 길이 · 문자 검사.
 *   표식이 둘 다 없으면 보내지 않는다. OpenAI 가 어느 광고와도 잇지 못하는 이벤트이고,
 *   픽셀을 막은 브라우저의 신청을 서버가 대신 알리는 일이 된다.
 *   나중에 쿠키 동의 창을 달면 거부한 사람은 여기서도 보내지 않게 같이 막는다.
 */
const ENDPOINT = "https://bzr.openai.com/v1/events";
const SITE = "https://www.harangmarketing.com";
const SITE_HOSTS = new Set(["www.harangmarketing.com", "harangmarketing.com"]);
/** app/layout.tsx 의 OPENAI_PIXEL_ID 검사와 같은 규칙. 한쪽을 바꾸면 다른 쪽도 같이 바꾼다 */
const PIXEL_ID_RE = /^[A-Za-z0-9_-]{4,80}$/;

/** 브라우저가 보낸 event id 는 이 모양일 때만 쓴다 (아니면 서버가 새로 만든다 · 중복 제거는 안 된다) */
export function safeEventId(v: unknown): string {
  return typeof v === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(v) ? v : `srv-${crypto.randomUUID()}`;
}

/** 클릭 표식 · 픽셀 쿠키는 공백 없는 보이는 글자 512자까지만 보낸다 (형식은 OpenAI 가 정하므로 좁히지 않는다) */
function safeRef(v: unknown): string | undefined {
  return typeof v === "string" && /^[\x21-\x7e]{1,512}$/.test(v) ? v : undefined;
}

/** referer 는 우리 주소일 때 경로만 쓴다. 아니면 기본 경로 */
export function safeSourceUrl(ref: unknown, fallbackPath = "/contact"): string {
  if (typeof ref === "string" && ref) {
    try {
      const u = new URL(ref);
      if (u.protocol === "https:" && SITE_HOSTS.has(u.hostname)) return SITE + u.pathname.slice(0, 200);
    } catch {
      /* 주소 모양이 아니면 기본 경로 */
    }
  }
  return SITE + fallbackPath;
}

export async function sendOpenAIConversion(opts: {
  id: string;
  type: "lead_created";
  sourceUrl: string;
  oppref?: string;
  obref?: string;
}): Promise<void> {
  const key = process.env.OPENAI_CAPI_KEY;
  const pid = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID;
  // 픽셀 아이디는 layout.tsx 와 같은 형식일 때만 쓴다 (형권 2026-10-07 · SEC-040 남은작업 5).
  // 화면에 픽셀이 안 심기는 값이면 서버도 보내지 않는다. 화면과 서버가 따로 놀지 않게 한다.
  if (!key || !pid || !PIXEL_ID_RE.test(pid)) return;
  const oppref = safeRef(opts.oppref);
  const obref = safeRef(opts.obref);
  if (!oppref && !obref) return;
  const event: Record<string, unknown> = {
    id: opts.id,
    type: opts.type,
    timestamp_ms: Date.now(),
    action_source: "web",
    source_url: safeSourceUrl(opts.sourceUrl),
    data: { type: "customer_action" },
  };
  if (oppref) event.oppref = oppref;
  if (obref) event.user = { obref };
  try {
    const res = await fetch(`${ENDPOINT}?pid=${encodeURIComponent(pid)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ integration_source: "harang_site", events: [event] }),
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) console.error("ChatGPT 광고 전환 전송 실패:", res.status);
  } catch (e) {
    console.error("ChatGPT 광고 전환 전송 오류:", e instanceof Error ? e.name : "unknown");
  }
}
