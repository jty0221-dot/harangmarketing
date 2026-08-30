/**
 * 공급 파트너 API 클라이언트 (서버 전용 — 라우트 핸들러에서만 import 할 것)
 *
 * 파트너사 주소·키는 환경변수로만 관리한다.
 * 공개 저장소에 공급처가 드러나면 도매 라인이 노출되므로 코드에 쓰지 말 것.
 *
 * 필요한 환경변수:
 *   SMM_API_URL — 파트너 API 엔드포인트
 *   SMM_API_KEY — 파트너 API 키
 */

interface PanelParams {
  [key: string]: string | number | undefined;
}

function env(name: "SMM_API_URL" | "SMM_API_KEY"): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} 환경변수가 설정되지 않았습니다`);
  return v;
}

async function callPanel<T>(params: PanelParams): Promise<T> {
  const body = new URLSearchParams();
  body.set("key", env("SMM_API_KEY"));
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) body.set(k, String(v));
  }
  const res = await fetch(env("SMM_API_URL"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`공급 파트너 API 오류 (HTTP ${res.status})`);
  const data = (await res.json()) as T & { error?: string };
  if (data && typeof data === "object" && "error" in data && data.error) {
    throw new Error(`공급 파트너 응답: ${data.error}`);
  }
  return data;
}

/** 잔액 조회 */
export async function panelBalance(): Promise<{ balance: number; currency: string }> {
  const r = await callPanel<{ balance: string; currency: string }>({ action: "balance" });
  return { balance: Number(r.balance), currency: r.currency };
}

/** 발주 — 실제 비용이 차감되므로 반드시 어드민 확인 뒤에만 호출한다 */
export async function panelAddOrder(opts: {
  sid: number;
  link: string;
  quantity: number;
  /** 지정 댓글형 — 줄바꿈으로 구분, 줄 수 = 수량 */
  comments?: string;
}): Promise<number> {
  const r = await callPanel<{ order: number }>({
    action: "add",
    service: opts.sid,
    link: opts.link,
    quantity: opts.quantity,
    comments: opts.comments,
  });
  if (!r.order) throw new Error("발주 응답에 주문번호가 없습니다");
  return Number(r.order);
}

export interface PanelStatus {
  charge?: string;
  start_count?: string | number;
  status: string;
  remains?: string | number;
  currency?: string;
  error?: string;
}

/** 발주 상태 조회 — 여러 건이면 한 번에 조회한다 (최대 100건) */
export async function panelStatusMulti(orderIds: number[]): Promise<Record<string, PanelStatus>> {
  if (orderIds.length === 0) return {};
  if (orderIds.length === 1) {
    const r = await callPanel<PanelStatus>({ action: "status", order: orderIds[0] });
    return { [String(orderIds[0])]: r };
  }
  return callPanel<Record<string, PanelStatus>>({
    action: "status",
    orders: orderIds.slice(0, 100).join(","),
  });
}

/** 파트너 상태 문자열 → 스토어 주문 상태 */
export function mapPanelStatus(
  s: string
): "processing" | "partial" | "completed" | "canceled" {
  const t = s.trim().toLowerCase();
  if (t === "completed") return "completed";
  if (t === "partial") return "partial";
  if (t === "canceled" || t === "cancelled" || t === "refunded") return "canceled";
  // Pending · In progress · Processing 등은 전부 진행 중으로 본다
  return "processing";
}
