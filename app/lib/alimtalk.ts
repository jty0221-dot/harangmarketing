import { createHmac, randomBytes } from "node:crypto";

/**
 * 알림톡 (카카오 비즈메시지) · 홈페이지 문의가 들어오면 하랑 카카오톡 채널 이름으로 대표 휴대폰에 한 통 보낸다.
 *
 * 왜 있나 (2026-10-03 (토) 대표 지시 「무조건 하게 해」)
 *   나에게 보내기 (kakao-notify.ts) 는 대표의 나와의 채팅에 쌓여 문의인지 눈에 띄지 않는다.
 *   알림톡은 하랑 채널 이름으로 보통 알림처럼 온다. 손님이 채널 창에서 보내기를 안 눌러도 대표가 문의를 안다.
 *   나에게 보내기와 웹훅은 그대로 둔다. 셋 중 무엇이 실패해도 접수는 성공으로 돌려준다.
 *
 * 발송 대행은 솔라피 (SOLAPI) REST v4 다. SDK 는 의존성이 커서 쓰지 않고 인증 헤더를 직접 만든다.
 *   POST https://api.solapi.com/messages/v4/send-many/detail  본문 { messages: [...] }
 *   Authorization: HMAC-SHA256 apiKey=…, date=ISO, salt=32자, signature=hex HMAC-SHA256(secret, date + salt)
 *
 * 필요한 값 · 이름만 적는다. 값은 대표가 Vercel 환경변수에 넣는다
 *   (순서 : 본부장\홈페이지\안내_2026-10-03_민수_알림톡_채널알림.md)
 *   SOLAPI_API_KEY · SOLAPI_API_SECRET  솔라피 API 키
 *   SOLAPI_PF_ID        솔라피에 연결한 하랑 카카오톡 채널의 발신 프로필 ID
 *   SOLAPI_TEMPLATE_ID  심사를 통과한 알림톡 템플릿 ID (본문은 ALIMTALK_TEMPLATE_TEXT 그대로)
 *   SOLAPI_FROM         솔라피에 등록한 발신번호
 *   INQUIRY_ALERT_TO    알림을 받을 휴대폰 번호 · 쉼표로 여러 개
 * 하나라도 없으면 보내지 않고 skipped 로 돌려준다. 이 파일의 함수는 예외를 던지지 않는다.
 * 손님 이름 · 연락처는 알림톡에 싣지 않는다. 문의 번호로 관리자 화면에서 본다.
 */

const SEND_URL = "https://api.solapi.com/messages/v4/send-many/detail";
const TIMEOUT_MS = 5_000;

/** 템플릿 심사에 그대로 올리는 본문. 글자나 변수 이름을 바꾸면 심사를 다시 받아야 한다 */
export const ALIMTALK_TEMPLATE_TEXT = [
  "[하랑마케팅] 홈페이지 새 문의",
  "",
  "문의 번호 : #{번호}",
  "들어온 곳 : #{경로}",
  "업종 : #{업종}",
  "접수 시각 : #{시각}",
  "",
  "관리자 화면의 홈페이지 문의에서 내용을 확인해 주세요.",
].join("\n");

const ENV_KEYS = [
  "SOLAPI_API_KEY",
  "SOLAPI_API_SECRET",
  "SOLAPI_PF_ID",
  "SOLAPI_TEMPLATE_ID",
  "SOLAPI_FROM",
  "INQUIRY_ALERT_TO",
] as const;

function env(key: string): string {
  return (process.env[key] ?? "").trim();
}

function digits(v: string): string {
  return v.replace(/\D/g, "");
}

function alertNumbers(): string[] {
  return env("INQUIRY_ALERT_TO")
    .split(",")
    .map(digits)
    .filter((n) => n.length >= 9);
}

export interface AlimtalkEnvStatus {
  ready: boolean;
  /** 비어 있는 환경변수 이름 (값은 돌려주지 않는다) */
  missing: string[];
  /** 받는 번호 개수 */
  recipients: number;
}

export function alimtalkEnvStatus(): AlimtalkEnvStatus {
  const missing: string[] = ENV_KEYS.filter((k) => !env(k));
  const recipients = alertNumbers().length;
  return { ready: missing.length === 0 && recipients > 0, missing, recipients };
}

function authHeader(apiKey: string, apiSecret: string): string {
  const date = new Date().toISOString();
  const salt = randomBytes(16).toString("hex");
  const signature = createHmac("sha256", apiSecret).update(date + salt).digest("hex");
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

/** 한국 시간 MM/DD HH:mm */
function kstStamp(d: Date): string {
  const k = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(k.getUTCMonth() + 1)}/${p(k.getUTCDate())} ${p(k.getUTCHours())}:${p(k.getUTCMinutes())}`;
}

export interface AlimtalkInput {
  /** 문의 번호. 저장에 실패했으면 null */
  id: number | null;
  /** 들어온 곳 (상담 신청 폼 · 무료 진단 · 광고 유입 표시) */
  source: string;
  industry: string;
}

export interface AlimtalkResult {
  ok: boolean;
  skipped?: boolean;
  /** 보낸 통수 */
  sent?: number;
  /** 사람이 읽는 실패 사유. 비밀값 · 번호는 들어가지 않는다 */
  error?: string;
}

/** 대행사 오류 문장에서 긴 숫자 (번호) 를 가리고 길이를 줄인다 */
function clean(s?: string): string {
  return (s ?? "").replace(/\d{6,}/g, "…").slice(0, 120);
}

/** 문의 한 건 → 받는 번호마다 알림톡 한 통. 던지지 않는다 */
export async function sendInquiryAlimtalk(input: AlimtalkInput): Promise<AlimtalkResult> {
  const status = alimtalkEnvStatus();
  if (!status.ready) {
    const why =
      status.missing.length > 0
        ? `환경변수 없음 · ${status.missing.join(", ")}`
        : "INQUIRY_ALERT_TO 에 쓸 수 있는 번호가 없음";
    return { ok: false, skipped: true, error: why };
  }

  const variables = {
    "#{번호}": input.id != null ? String(input.id) : "저장 실패",
    "#{경로}": (input.source || "홈페이지").slice(0, 40),
    "#{업종}": (input.industry || "적지 않음").slice(0, 40),
    "#{시각}": kstStamp(new Date()),
  };
  const messages = alertNumbers().map((num) => ({
    to: num,
    from: digits(env("SOLAPI_FROM")),
    kakaoOptions: {
      pfId: env("SOLAPI_PF_ID"),
      templateId: env("SOLAPI_TEMPLATE_ID"),
      variables,
      // 알림톡이 실패해도 문자로 바꿔 보내지 않는다 (비용 · 문자 문안 따로). 나에게 보내기가 뒤를 받친다
      disableSms: true,
    },
  }));

  let res: Response;
  try {
    res = await fetch(SEND_URL, {
      method: "POST",
      headers: {
        Authorization: authHeader(env("SOLAPI_API_KEY"), env("SOLAPI_API_SECRET")),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return { ok: false, error: "솔라피 서버 연결 실패" };
  }

  const data = (await res.json().catch(() => ({}))) as {
    errorCode?: string;
    errorMessage?: string;
    failedMessageList?: { statusCode?: string; statusMessage?: string }[];
  };
  if (!res.ok) {
    const code = data.errorCode ? ` · ${data.errorCode}` : "";
    const why = data.errorMessage ? ` · ${clean(data.errorMessage)}` : "";
    return { ok: false, error: `HTTP ${res.status}${code}${why}` };
  }
  const failed = data.failedMessageList ?? [];
  if (failed.length > 0) {
    const f = failed[0];
    const code = f.statusCode ? ` · ${f.statusCode}` : "";
    const why = f.statusMessage ? ` · ${clean(f.statusMessage)}` : "";
    return {
      ok: failed.length < messages.length,
      sent: messages.length - failed.length,
      error: `실패 ${failed.length}통${code}${why}`,
    };
  }
  return { ok: true, sent: messages.length };
}
