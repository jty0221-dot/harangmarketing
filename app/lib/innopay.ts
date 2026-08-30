/**
 * 이노페이(INNOPAY) 직연동 — 서버 측
 *
 * 왜 포트원이 아니라 직연동인가:
 *   포트원 V2 가 지원하는 PG 목록(토스페이먼츠·KSNET·스마트로·나이스·이니시스·KPN·KCP·
 *   웰컴페이먼츠·카카오페이·네이버페이·토스페이·페이팔·엑심베이·페이레터·갤럭시아·Triple-A·
 *   KICC·페이먼트월·헥토)에 이노페이가 없다. 그래서 app/lib/portone.ts 를 재사용할 수 없고
 *   결제창 호출과 승인 요청을 직접 붙인다.
 *
 * 흐름 (이노페이 공개 자료 기준):
 *   1) 브라우저가 innopay.goPay() 로 결제창을 연다
 *   2) 카드 인증이 끝나면 이노페이가 returnUrl 로 tid 와 주문정보를 보낸다
 *   3) 우리 서버가 승인 API 를 호출해야 비로소 돈이 승인된다 (2번까지는 인증일 뿐이다)
 *
 * 보안 원칙:
 *   - 브라우저가 돌려준 금액을 믿지 않는다. 승인 요청 금액은 언제나 DB 의 신청 금액이다
 *   - 승인 응답 금액이 DB 금액과 다르면 반영하지 않는다
 *   - 성공 코드가 아닌 모든 경우는 실패로 본다 (fail-closed)
 *   - MID·MerchantKey 값은 코드에 적지 않는다. 환경변수 이름만 여기 있고 값은 대표가 넣는다
 */

/** 결제창 스크립트 — 브라우저에서 <script> 로 불러온다 */
export const INNOPAY_JS_SDK = "https://pg.innopay.co.kr/tpay/js/innopay.js";

/** 이노페이가 준 테스트 상점아이디 (심사 전 화면 확인용) */
export const INNOPAY_TEST_MID = "testpay01m";

const API_BASE = (process.env.INNOPAY_API_BASE || "https://api.innopay.co.kr").replace(/\/+$/, "");
const APPROVE_URL = `${API_BASE}/v1/transactions/pay`;
const TIMEOUT_MS = 20000;

/**
 * 상세 매뉴얼이 가맹점 로그인 뒤에 있어 아래 세 가지는 계약 후에 확정된다.
 * 확정되면 코드를 고치지 않고 환경변수만 채우면 되도록 한 곳에 모아 둔다.
 *
 *   INNOPAY_SUCCESS_CODES   승인 성공으로 볼 결과코드 (쉼표로 여러 개)
 *   INNOPAY_FIELD_TID       returnUrl 로 오는 거래번호 필드명 후보 (쉼표로 여러 개)
 *   INNOPAY_FIELD_MOID      주문번호 필드명 후보
 *   INNOPAY_FIELD_TOKEN     승인 요청에 넣을 인증 토큰 필드명 후보
 */
const SUCCESS_CODES = splitEnv(process.env.INNOPAY_SUCCESS_CODES, ["0000"]);
const TID_KEYS = splitEnv(process.env.INNOPAY_FIELD_TID, ["tid", "TID", "trxId", "authTid"]);
const MOID_KEYS = splitEnv(process.env.INNOPAY_FIELD_MOID, ["moid", "MOID", "orderNo", "orderNumber"]);
const TOKEN_KEYS = splitEnv(process.env.INNOPAY_FIELD_TOKEN, [
  "paymentToken",
  "PaymentToken",
  "authToken",
  "token",
]);

function splitEnv(raw: string | undefined, fallback: string[]): string[] {
  const list = (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : fallback;
}

/** 상점아이디와 서명키가 둘 다 있어야 승인 요청을 보낼 수 있다 */
export function innopayConfigured(): boolean {
  return Boolean(process.env.INNOPAY_MID && process.env.INNOPAY_MERCHANT_KEY);
}

export function innopayMid(): string {
  return process.env.INNOPAY_MID ?? "";
}

/**
 * 주문번호(MOID) — 충전 건 하나에 하나씩 붙는다.
 * 하이픈 허용 여부가 매뉴얼에서 확인되지 않아 영문·숫자만 쓴다.
 */
export function moidForCharge(chargeId: number): string {
  return `hrgchg${chargeId}`;
}

export function chargeIdFromMoid(moid: string): number | null {
  const m = /^hrgchg(\d+)$/.exec(String(moid ?? "").trim());
  if (!m) return null;
  const id = Number(m[1]);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

type Bag = Record<string, unknown>;

/**
 * 필드명 대소문자·표기가 매뉴얼 확정 전이라 후보를 순서대로 찾는다.
 * 중첩 객체(data·result)도 한 겹 펼쳐서 본다.
 */
export function pickField(bag: Bag, keys: string[]): string {
  const flat = new Map<string, string>();
  const put = (k: string, v: unknown) => {
    if (v == null) return;
    if (typeof v === "object") return;
    const s = String(v).trim();
    if (!s) return;
    const key = k.toLowerCase();
    if (!flat.has(key)) flat.set(key, s);
  };
  for (const [k, v] of Object.entries(bag)) {
    put(k, v);
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const [k2, v2] of Object.entries(v as Bag)) put(k2, v2);
    }
  }
  for (const k of keys) {
    const hit = flat.get(k.toLowerCase());
    if (hit) return hit;
  }
  return "";
}

export const readTid = (bag: Bag) => pickField(bag, TID_KEYS);
export const readMoid = (bag: Bag) => pickField(bag, MOID_KEYS);
export const readToken = (bag: Bag) => pickField(bag, TOKEN_KEYS);
export const readResultCode = (bag: Bag) =>
  pickField(bag, ["resultCode", "ResultCode", "resCd", "code", "authResultCode"]);
export const readResultMsg = (bag: Bag) =>
  pickField(bag, ["resultMsg", "ResultMsg", "resMsg", "message", "authResultMsg"]);

/** 성공 코드 목록에 정확히 들어 있을 때만 성공이다 (모르면 실패로 본다) */
export function isInnopaySuccess(code: string): boolean {
  const c = String(code ?? "").trim();
  return c !== "" && SUCCESS_CODES.includes(c);
}

export interface InnopayApproval {
  ok: boolean;
  resultCode: string;
  resultMsg: string;
  tid: string;
  moid: string;
  /** 이노페이가 승인했다고 답한 금액. 못 읽으면 -1 */
  amount: number;
  receiptUrl: string;
  raw: Bag;
}

/**
 * 승인 요청 — 이 호출이 성공해야 실제로 돈이 빠져나간다.
 * amount 는 반드시 DB 의 신청 금액을 넣는다. 브라우저가 보낸 금액을 넣지 않는다.
 */
export async function approveInnopay(params: {
  tid: string;
  moid: string;
  amount: number;
  paymentToken: string;
  taxFreeAmount?: number;
}): Promise<InnopayApproval> {
  const merchantKey = process.env.INNOPAY_MERCHANT_KEY ?? "";
  const mid = innopayMid();
  if (!mid || !merchantKey) {
    return fail("not-configured", "이노페이 상점 정보가 설정되지 않았습니다");
  }

  const body = {
    tid: params.tid,
    mid,
    moid: params.moid,
    amt: String(params.amount),
    taxFreeAmt: String(params.taxFreeAmount ?? 0),
  };

  let res: Response;
  try {
    res = await fetch(APPROVE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Payment-Token": params.paymentToken,
        "Merchant-Key": merchantKey,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    // 승인 요청이 나갔는지 못 나갔는지 알 수 없는 구간이다.
    // 여기서는 절대 잔액을 올리지 않고 사람이 확인하게 남긴다.
    return fail("network-error", "이노페이 승인 요청이 실패했습니다");
  }

  const text = await res.text();
  let json: Bag = {};
  try {
    json = JSON.parse(text) as Bag;
  } catch {
    return fail("bad-response", `승인 응답을 읽지 못했습니다 (HTTP ${res.status})`);
  }

  const resultCode = readResultCode(json);
  const amountText = pickField(json, ["amt", "amount", "totAmt", "goodsAmt", "cardAmt"]);
  const amount = amountText ? Number(amountText.replace(/[^0-9]/g, "")) : -1;

  return {
    ok: res.ok && isInnopaySuccess(resultCode),
    resultCode: resultCode || `http-${res.status}`,
    resultMsg: readResultMsg(json) || "",
    tid: readTid(json) || params.tid,
    moid: readMoid(json) || params.moid,
    amount: Number.isFinite(amount) ? amount : -1,
    receiptUrl: pickField(json, ["receiptUrl", "ReceiptUrl", "receipt_url", "billUrl"]),
    raw: json,
  };
}

function fail(code: string, msg: string): InnopayApproval {
  return { ok: false, resultCode: code, resultMsg: msg, tid: "", moid: "", amount: -1, receiptUrl: "", raw: {} };
}
