import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../lib/admin-auth";
import { kakaoEnvStatus, sendKakaoNotify } from "../../../lib/kakao-notify";
import { describeKakaoRecipients, kakaoStoreHealth } from "../../../lib/kakao-token-store";

/**
 * 카카오톡 알림 점검 API (관리자 전용)
 *
 * GET  : 환경변수 유무 · 수신자 목록(토큰 값 없음) · 토큰 저장소(DB) 상태. 보내지 않는다
 * POST : 수신자 전원에게 시험 메시지를 한 통씩 보내고 사람별 결과를 돌려준다
 *
 * /admin/notify-test 화면만 부른다. 인증은 관리자 세션 쿠키 한 갈래다 — 문의 API 와 같다.
 * 비밀값은 어느 쪽으로도 돌려주지 않는다. 있다 · 없다만 말한다.
 * 수신자 해제(DELETE)와 계정 연결은 /api/admin/kakao 쪽이다.
 */

async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

function unauthorized() {
  return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
}

async function snapshot() {
  const [recipients, store] = await Promise.all([describeKakaoRecipients(), kakaoStoreHealth()]);
  return { env: kakaoEnvStatus(), recipients, store };
}

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  return NextResponse.json({ ok: true, ...(await snapshot()) });
}

export async function POST() {
  if (!(await isAuthed())) return unauthorized();
  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  const result = await sendKakaoNotify(
    ["[하랑마케팅 알림 점검]", "관리자 화면에서 보낸 시험 메시지입니다.", `보낸 시각: ${now}`].join("\n")
  );
  if (!result.ok) console.error("카카오 알림 점검 실패:", result.step, result.error);
  // 발송 뒤 다시 읽는다 — 토큰 회전 저장 · 마지막 오류가 바로 화면에 보이도록
  return NextResponse.json({ ok: result.ok, ...(await snapshot()), result });
}
