import fs from "fs";
import path from "path";
import type { OrderStatus } from "./sns-store";

/**
 * SNS 부스트 스토어 — 주문 대장 저장소 (서버 전용)
 *
 * 주문에는 고객 연락처가 들어가므로 공개 저장소(harangmarketing)에 두면 안 된다.
 *
 * 운영(Vercel):  비공개 레포(SNS_ORDERS_REPO)의 data/orders.json 에
 *               GITHUB_TOKEN 으로 커밋한다. 블로그 어드민과 같은 방식.
 * 로컬 개발:     SNS_ORDERS_REPO 또는 GITHUB_TOKEN 이 없으면
 *               content/sns-orders.local.json 파일로 대체한다 (gitignore 됨).
 *
 * 동시 주문으로 커밋이 충돌(409)하면 최신 내용을 다시 받아 한 번 재시도한다.
 */

export interface SnsOrder {
  no: string;
  createdAt: string;
  /** 상품 스냅샷 — 카탈로그가 나중에 바뀌어도 주문 당시 값을 유지한다 */
  product: string;
  productName: string;
  platform: string;
  sid: number;
  qty: number;
  unitPrice: number;
  total: number;
  link: string;
  contact: string;
  depositor: string;
  comments?: string;
  status: OrderStatus;
  /** 공급 파트너 발주 번호 — 발주 후에만 존재 */
  panelOrderId?: number;
  panelStatus?: string;
  startCount?: number;
  remains?: number;
  submittedAt?: string;
  adminMemo?: string;
  lastError?: string;
}

const ORDERS_PATH = "data/orders.json";
const LOCAL_FILE = path.join(process.cwd(), "content", "sns-orders.local.json");

function githubConfig(): { repo: string; token: string } | null {
  // 레포 이름은 비밀이 아니라 기본값을 둔다 (접근 권한은 어차피 토큰이 결정한다).
  // 토큰이 없으면 로컬 파일로 폴백 — Vercel 에서는 GITHUB_TOKEN 이 반드시 있어야 한다.
  const repo = process.env.SNS_ORDERS_REPO ?? "jty0221-del/harang-sns-orders";
  const token = process.env.GITHUB_TOKEN;
  if (!repo || !token) return null;
  return { repo, token };
}

async function githubApi(pathname: string, init?: RequestInit) {
  const cfg = githubConfig();
  if (!cfg) throw new Error("주문 저장소 설정 없음");
  const res = await fetch(`https://api.github.com/repos/${cfg.repo}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  return res;
}

async function loadFromGitHub(): Promise<{ orders: SnsOrder[]; sha: string }> {
  const res = await githubApi(`/contents/${ORDERS_PATH}`);
  if (!res.ok) {
    throw new Error(`주문 대장을 읽지 못했습니다 (${res.status}). SNS_ORDERS_REPO 레포와 ${ORDERS_PATH} 파일이 있는지 확인하세요.`);
  }
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { orders: JSON.parse(content) as SnsOrder[], sha: data.sha };
}

async function saveToGitHub(orders: SnsOrder[], sha: string, message: string): Promise<boolean> {
  const content = Buffer.from(JSON.stringify(orders, null, 2) + "\n", "utf-8").toString("base64");
  const res = await githubApi(`/contents/${ORDERS_PATH}`, {
    method: "PUT",
    body: JSON.stringify({ message, content, sha }),
  });
  if (res.status === 409) return false; // 다른 주문과 충돌 — 호출부에서 재시도
  if (!res.ok) throw new Error(`주문 대장 저장 실패 (${res.status})`);
  return true;
}

function loadFromLocal(): SnsOrder[] {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf-8")) as SnsOrder[];
  } catch {
    return [];
  }
}

function saveToLocal(orders: SnsOrder[]) {
  fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(orders, null, 2) + "\n", "utf-8");
}

/* ────────────────────────────────────────────────
   공개 API — 읽기 · 변형(append/update)
   ──────────────────────────────────────────────── */

export async function readOrders(): Promise<SnsOrder[]> {
  if (githubConfig()) return (await loadFromGitHub()).orders;
  return loadFromLocal();
}

/**
 * 주문 대장 변형 — mutate 가 최신 목록을 받아 고친 결과를 저장한다.
 * GitHub 커밋 충돌 시 최신본으로 한 번 더 시도한다.
 */
export async function mutateOrders(
  mutate: (orders: SnsOrder[]) => SnsOrder[],
  message: string
): Promise<SnsOrder[]> {
  if (!githubConfig()) {
    const next = mutate(loadFromLocal());
    saveToLocal(next);
    return next;
  }
  for (let attempt = 0; attempt < 2; attempt++) {
    const { orders, sha } = await loadFromGitHub();
    const next = mutate(orders);
    if (await saveToGitHub(next, sha, message)) return next;
  }
  throw new Error("주문 대장 저장이 계속 충돌합니다. 잠시 후 다시 시도해 주세요.");
}

export async function appendOrder(order: SnsOrder): Promise<void> {
  await mutateOrders((orders) => [order, ...orders], `주문 접수: ${order.no}`);
}

export async function updateOrder(
  no: string,
  patch: Partial<SnsOrder>,
  message?: string
): Promise<SnsOrder | undefined> {
  let updated: SnsOrder | undefined;
  await mutateOrders((orders) => {
    return orders.map((o) => {
      if (o.no !== no) return o;
      updated = { ...o, ...patch };
      return updated;
    });
  }, message ?? `주문 갱신: ${no}`);
  return updated;
}

/* ────────────────────────────────────────────────
   주문번호 — HB260821-XXXX (날짜 + 헷갈리는 글자 뺀 랜덤)
   ──────────────────────────────────────────────── */

const NO_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function genOrderNo(): string {
  const d = new Date();
  const ymd = [
    String(d.getFullYear()).slice(2),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("");
  let rand = "";
  for (let i = 0; i < 4; i++) {
    rand += NO_CHARS[Math.floor(Math.random() * NO_CHARS.length)];
  }
  return `HB${ymd}-${rand}`;
}

/** 연락처 비교 — 숫자만 남겨 비교하되, 숫자가 없으면(카톡 ID 등) 소문자 비교 */
export function contactMatches(saved: string, input: string): boolean {
  const digits = (s: string) => s.replace(/[^0-9]/g, "");
  const a = digits(saved);
  const b = digits(input);
  if (a.length >= 4 && b.length >= 4) return a === b || a.endsWith(b) || b.endsWith(a);
  return saved.trim().toLowerCase() === input.trim().toLowerCase();
}
