/**
 * 카카오톡 알림 — 홈페이지 문의가 들어오면 대표 카카오톡으로 한 통 보낸다.
 *
 * 카카오 "나에게 보내기"(memo) 를 쓴다. 친구에게 보내는 API 는 별도 심사를 받아야 하지만
 * 나에게 보내기는 토큰을 발급받은 본인 계정에만 가므로 심사가 없다.
 * 받는 사람이 대표 한 사람이라 이 방식이면 충분하다.
 *
 * 필요한 값 둘 — 이름만 적는다. 값은 대표가 Vercel 환경변수에 직접 넣는다.
 *   KAKAO_REST_API_KEY   카카오 개발자 콘솔의 REST API 키
 *   KAKAO_REFRESH_TOKEN  talk_message 동의를 받고 발급한 리프레시 토큰
 *
 * 둘 중 하나라도 비어 있으면 보내지 않고 skipped 로 돌려준다.
 * 문의 접수 자체는 알림과 무관하게 성공해야 하므로 이 파일의 함수는 예외를 던지지 않는다.
 * 실패는 전부 돌려주는 값으로만 말한다.
 *
 * 리프레시 토큰은 두 달마다 갱신된다. 카카오가 만료 한 달 전부터 새 토큰을 같이 내려주는데
 * 이 파일에는 그것을 저장할 곳이 없다(환경변수는 읽기 전용이다).
 * 그래서 만료되면 토큰 단계에서 떨어지고, /admin/notify-test 화면이 그 사실을 보여 준다.
 */

const TOKEN_URL = "https://kauth.kakao.com/oauth/token";
const MEMO_URL = "https://kapi.kakao.com/v2/api/talk/memo/default/send";

/** 카카오 텍스트 템플릿 본문 상한 */
const TEXT_MAX = 200;
/** 문의 접수 응답을 붙잡아 두지 않는다 */
const TIMEOUT_MS = 5_000;
/** 알림을 눌렀을 때 열리는 곳 — 문의 목록 화면이다 */
const ADMIN_LINK = "https://harangmarketing.com/admin/inquiries";

export type KakaoStep = "env" | "token" | "send";

export interface KakaoNotifyResult {
  ok: boolean;
  /** 환경변수가 없어 아예 시도하지 않은 경우 */
  skipped?: boolean;
  /** 어디까지 갔는가 */
  step: KakaoStep;
  /** 사람이 읽는 실패 사유. 비밀값은 지나오면서 지워진다 */
  error?: string;
}

export interface KakaoEnvStatus {
  hasRestApiKey: boolean;
  hasRefreshToken: boolean;
  ready: boolean;
}

/** 환경변수가 꽂혀 있는지만 본다. 값은 돌려주지 않는다 */
export function kakaoEnvStatus(): KakaoEnvStatus {
  const hasRestApiKey = Boolean(process.env.KAKAO_REST_API_KEY);
  const hasRefreshToken = Boolean(process.env.KAKAO_REFRESH_TOKEN);
  return { hasRestApiKey, hasRefreshToken, ready: hasRestApiKey && hasRefreshToken };
}

/**
 * 어떤 문자열에서도 비밀값을 지운다.
 * 카카오 오류 본문을 그대로 화면에 띄우기 때문에 이 함수를 반드시 지나게 한다.
 */
function redact(s: string): string {
  let out = s;
  for (const v of [process.env.KAKAO_REST_API_KEY, process.env.KAKAO_REFRESH_TOKEN]) {
    if (v && v.length >= 8) out = out.split(v).join("***");
  }
  return out.slice(0, 300);
}

/** 리프레시 토큰으로 액세스 토큰을 새로 받는다 */
async function getAccessToken(): Promise<{ token: string } | { error: string }> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: String(process.env.KAKAO_REST_API_KEY),
      refresh_token: String(process.env.KAKAO_REFRESH_TOKEN),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const raw = await res.text();
  if (!res.ok) {
    return { error: `토큰 재발급 실패 (HTTP ${res.status}) ${redact(raw)}` };
  }
  try {
    const json = JSON.parse(raw) as { access_token?: string };
    if (!json.access_token) return { error: "토큰 응답에 access_token 이 없습니다" };
    return { token: json.access_token };
  } catch {
    return { error: "토큰 응답을 읽지 못했습니다" };
  }
}

/**
 * 카카오톡으로 한 통 보낸다.
 * 던지지 않는다 — 부르는 쪽은 결과만 보고 로그에 남기면 된다.
 */
export async function sendKakaoNotify(text: string, linkUrl?: string): Promise<KakaoNotifyResult> {
  if (!kakaoEnvStatus().ready) {
    return {
      ok: false,
      skipped: true,
      step: "env",
      error: "KAKAO_REST_API_KEY · KAKAO_REFRESH_TOKEN 이 없어 보내지 않았습니다",
    };
  }
  try {
    /* 토큰 단계에서 망이 끊기거나 시간이 다 되면 여기서 잡는다.
       아래 catch 로 흘려보내면 step 이 send 로 찍혀, 토큰도 못 받은 것을 발송 실패라고 화면이 말한다. */
    let token: Awaited<ReturnType<typeof getAccessToken>>;
    try {
      token = await getAccessToken();
    } catch (e) {
      return { ok: false, step: "token", error: redact(String(e)) };
    }
    if ("error" in token) return { ok: false, step: "token", error: token.error };

    const url = linkUrl || ADMIN_LINK;
    const res = await fetch(MEMO_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({
        template_object: JSON.stringify({
          object_type: "text",
          text: text.slice(0, TEXT_MAX),
          link: { web_url: url, mobile_web_url: url },
        }),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const raw = await res.text();
    if (!res.ok) {
      return { ok: false, step: "send", error: `발송 실패 (HTTP ${res.status}) ${redact(raw)}` };
    }
    return { ok: true, step: "send" };
  } catch (e) {
    return { ok: false, step: "send", error: redact(String(e)) };
  }
}
