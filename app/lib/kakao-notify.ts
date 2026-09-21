/**
 * 카카오톡 알림 — 홈페이지 문의가 들어오면 대표 카카오톡으로 한 통 보낸다.
 *
 * 카카오 "나에게 보내기"(memo) 를 쓴다. 친구에게 보내는 API 는 별도 심사를 받아야 하지만
 * 나에게 보내기는 토큰을 발급받은 본인 계정에만 가므로 심사가 없다.
 *
 * 필요한 값 — 이름만 적는다. 값은 대표가 Vercel 환경변수에 직접 넣는다.
 *   KAKAO_REST_API_KEY    카카오 개발자 콘솔의 REST API 키
 *   KAKAO_REFRESH_TOKEN   (선택) talk_message 동의를 받고 발급한 리프레시 토큰 · 쉼표로 여러 개
 *   KAKAO_CLIENT_SECRET   (선택) 콘솔에서 클라이언트 시크릿을 켰을 때만
 *
 * 수신자는 환경변수 토큰 + 관리자 화면 [카카오 계정 연결] 로 붙인 계정(DB · kakao-token-store) 이다.
 * 하나도 없으면 보내지 않고 skipped 로 돌려준다.
 * 문의 접수 자체는 알림과 무관하게 성공해야 하므로 이 파일의 함수는 예외를 던지지 않는다.
 * 실패는 전부 돌려주는 값으로만 말한다.
 *
 * 리프레시 토큰은 두 달마다 갱신된다. 카카오가 만료 한 달 전부터 새 토큰을 같이 내려주는데
 * 예전에는 그것을 저장할 곳이 없어 환경변수 토큰이 두 달 뒤 죽었다 (청설모 2026-09-21 KOE319).
 * 2026-09-21 준수 : 갱신 응답의 새 토큰을 kakao-token-store 에 암호화해 적는다. 알림을 한 번이라도
 *   쓰면(문의 · 관리자 테스트) 토큰이 스스로 이어진다.
 *
 * 2026-09-20 민수 : 알림 링크에 문의 번호를 붙이는 inquiryAdminLink 를 더했다.
 *   알림 본문은 200자라 답장 문안을 실을 수 없다. 대신 링크가 그 문의를 바로 펼쳐서
 *   화면의 문안을 복사하거나 문자로 보내게 한다.
 */

import {
  getKakaoRecipients,
  getKakaoRestApiKey,
  saveKakaoRecipient,
  markKakaoRecipient,
  type KakaoRecipient,
} from "./kakao-token-store";

const TOKEN_URL = "https://kauth.kakao.com/oauth/token";
const MEMO_URL = "https://kapi.kakao.com/v2/api/talk/memo/default/send";

/** 카카오 텍스트 템플릿 본문 상한 */
const TEXT_MAX = 200;
/** 문의 접수 응답을 붙잡아 두지 않는다 */
const TIMEOUT_MS = 5_000;
/** 알림을 눌렀을 때 열리는 곳 — 문의 목록 화면이다 */
const ADMIN_LINK = "https://www.harangmarketing.com/admin/inquiries";

/** 문의 한 건으로 바로 가는 링크 · 문의 화면이 ?id= 를 읽어 그 카드를 펼친다 */
export function inquiryAdminLink(id: number): string {
  return `${ADMIN_LINK}?id=${id}`;
}

/** 카카오 오류 코드 → 다음 행동. 값이 섞이지 않는 코드만 화면에 낸다 */
export const KAKAO_ERROR_HINT: Record<string, string> = {
  KOE319: "리프레시 토큰이 만료됐거나 취소됨 → 관리자 화면 [카카오 계정 연결] 로 다시 연결",
  KOE320: "토큰이 잘못됨 → 다시 연결",
  KOE101: "REST API 키가 틀림 → Vercel KAKAO_REST_API_KEY 확인",
  KOE010: "카카오 콘솔에 클라이언트 시크릿이 켜져 있음 → 끄거나 KAKAO_CLIENT_SECRET 을 Vercel 에 넣기",
  KOE004: "카카오 콘솔에서 카카오 로그인이 꺼져 있음",
  KOE205: "동의항목(카카오톡 메시지 전송)이 열려 있지 않음",
};

export type KakaoStep = "env" | "token" | "send";

export interface KakaoNotifyResult {
  ok: boolean;
  /** 수신자가 없어 아예 시도하지 않은 경우 */
  skipped?: boolean;
  /** 어디까지 갔는가 (여럿이면 가장 멀리 간 단계) */
  step: KakaoStep;
  /** 사람이 읽는 실패 사유. 비밀값은 들어가지 않는다 */
  error?: string;
  /** 수신자별 결과 */
  reports?: SendReport[];
}

export interface KakaoEnvStatus {
  hasRestApiKey: boolean;
  hasRefreshToken: boolean;
  ready: boolean;
}

/** 환경변수가 꽂혀 있는지만 본다. 값은 돌려주지 않는다 (DB 수신자는 세지 않는다) */
export function kakaoEnvStatus(): KakaoEnvStatus {
  const hasRestApiKey = Boolean(getKakaoRestApiKey());
  const hasRefreshToken = Boolean((process.env.KAKAO_REFRESH_TOKEN ?? "").trim());
  return { hasRestApiKey, hasRefreshToken, ready: hasRestApiKey && hasRefreshToken };
}

export interface RefreshResult {
  ok: boolean;
  accessToken?: string;
  status: number;
  /** 카카오 오류 코드 (KOE319 등) */
  errorCode?: string;
  /** 사람이 읽을 요약 (토큰·키 값은 들어가지 않는다) */
  reason?: string;
  rotated?: boolean;
}

/** 리프레시 토큰으로 액세스 토큰을 받는다. 새 리프레시 토큰이 오면 저장소에 적는다. */
export async function refreshKakaoAccessToken(recipient: KakaoRecipient): Promise<RefreshResult> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: getKakaoRestApiKey(),
    refresh_token: recipient.refreshToken,
  });
  const clientSecret = (process.env.KAKAO_CLIENT_SECRET ?? "").trim();
  if (clientSecret) body.set("client_secret", clientSecret);

  let res: Response;
  try {
    res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return { ok: false, status: 0, reason: "카카오 서버 연결 실패" };
  }

  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_code?: string;
  };

  if (!res.ok || !data.access_token) {
    const code = typeof data.error_code === "string" ? data.error_code : undefined;
    const reason = code
      ? `${code} · ${KAKAO_ERROR_HINT[code] ?? data.error ?? "카카오 오류"}`
      : `HTTP ${res.status}${data.error ? ` · ${data.error}` : ""}`;
    await markKakaoRecipient(recipient.id, { ok: false, error: reason });
    return { ok: false, status: res.status, errorCode: code, reason };
  }

  let rotated = false;
  if (data.refresh_token && data.refresh_token !== recipient.refreshToken) {
    // 만료 한 달 전부터 카카오가 새 리프레시 토큰을 내려준다 — 저장해야 다음 달에도 산다
    rotated = await saveKakaoRecipient(recipient.id, recipient.label, data.refresh_token);
  }
  await markKakaoRecipient(recipient.id, { ok: true });
  return { ok: true, accessToken: data.access_token, status: res.status, rotated };
}

/** 액세스 토큰으로 "나에게 보내기" 한 통. */
export async function sendKakaoMemo(
  accessToken: string,
  text: string,
  linkUrl?: string
): Promise<{ ok: boolean; status: number; errorCode?: string }> {
  const url = linkUrl || ADMIN_LINK;
  const templateObject = {
    object_type: "text",
    text: text.slice(0, TEXT_MAX),
    link: { web_url: url, mobile_web_url: url },
  };
  try {
    const res = await fetch(MEMO_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({ template_object: JSON.stringify(templateObject) }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) return { ok: true, status: res.status };
    const data = (await res.json().catch(() => ({}))) as { code?: number };
    return { ok: false, status: res.status, errorCode: data.code != null ? String(data.code) : undefined };
  } catch {
    return { ok: false, status: 0 };
  }
}

export interface SendReport {
  id: string;
  label: string;
  ok: boolean;
  step: KakaoStep;
  detail: string;
}

/**
 * 수신자 전원에게 보내고 결과를 사람별로 돌려준다.
 * 던지지 않는다 — 부르는 쪽은 결과만 보고 로그에 남기면 된다.
 */
export async function sendKakaoNotify(text: string, linkUrl?: string): Promise<KakaoNotifyResult> {
  if (!getKakaoRestApiKey()) {
    return { ok: false, skipped: true, step: "env", error: "KAKAO_REST_API_KEY 가 없어 보내지 않았습니다" };
  }
  const recipients = await getKakaoRecipients();
  if (recipients.length === 0) {
    return {
      ok: false,
      skipped: true,
      step: "env",
      error: "수신자가 없어 보내지 않았습니다 (관리자 화면 [카카오 계정 연결] 또는 KAKAO_REFRESH_TOKEN)",
    };
  }

  const reports: SendReport[] = [];
  for (const r of recipients) {
    const refreshed = await refreshKakaoAccessToken(r);
    if (!refreshed.ok || !refreshed.accessToken) {
      reports.push({ id: r.id, label: r.label, ok: false, step: "token", detail: `토큰 갱신 실패 · ${refreshed.reason ?? refreshed.status}` });
      continue;
    }
    const sent = await sendKakaoMemo(refreshed.accessToken, text, linkUrl);
    if (!sent.ok) {
      reports.push({
        id: r.id,
        label: r.label,
        ok: false,
        step: "send",
        detail: `발송 실패 · HTTP ${sent.status}${sent.errorCode ? ` · 코드 ${sent.errorCode}` : ""}`,
      });
      continue;
    }
    reports.push({ id: r.id, label: r.label, ok: true, step: "send", detail: `발송 성공${refreshed.rotated ? " (토큰 회전 저장)" : ""}` });
  }

  const ok = reports.some((r) => r.ok);
  const step: KakaoStep = reports.some((r) => r.step === "send") ? "send" : "token";
  return {
    ok,
    step,
    error: ok ? undefined : reports.map((r) => `${r.label}: ${r.detail}`).join(" / "),
    reports,
  };
}
