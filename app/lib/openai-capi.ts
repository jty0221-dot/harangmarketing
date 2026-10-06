/**
 * ChatGPT 광고 Conversions API (서버 → OpenAI).
 * 문서 : developers.openai.com/ads/conversions-api (2026-10-06 확인)
 *
 * - 브라우저 픽셀(Analytics.tsx trackOpenAI)과 같은 id 로 보낸다. OpenAI 가 픽셀 ID · 이벤트 이름 · id 로 겹친 것을 하나로 친다.
 * - 키 OPENAI_CAPI_KEY (서버 전용) 와 픽셀 NEXT_PUBLIC_OPENAI_PIXEL_ID 가 둘 다 있을 때만 보낸다. 없으면 아무것도 안 한다.
 * - 개인정보는 보내지 않는다 (전화 · 이름 · IP 해시 없음). OpenAI 가 준 클릭 표식 oppref 와 픽셀 쿠키 obref 만 쓴다.
 * - 실패해도 상담 접수는 성공으로 둔다. 2.5초 넘으면 끊는다.
 */
const ENDPOINT = "https://bzr.openai.com/v1/events";

/** 브라우저가 보낸 event id 는 이 모양일 때만 쓴다 (아니면 서버가 새로 만든다 · 중복 제거는 안 된다) */
export function safeEventId(v: unknown): string {
  return typeof v === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(v) ? v : `srv-${crypto.randomUUID()}`;
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
  if (!key || !pid) return;
  const event: Record<string, unknown> = {
    id: opts.id,
    type: opts.type,
    timestamp_ms: Date.now(),
    action_source: "web",
    source_url: opts.sourceUrl,
    data: { type: "customer_action" },
  };
  if (opts.oppref) event.oppref = opts.oppref;
  if (opts.obref) event.user = { obref: opts.obref };
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
