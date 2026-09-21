import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../lib/admin-auth";
import { describeKakaoRecipients, getKakaoRestApiKey, kakaoStoreHealth, removeKakaoRecipient } from "../../../lib/kakao-token-store";

/**
 * 알림 체계 상태 (관리자 전용).
 * GET    : REST 키 유무 · 수신자 목록(토큰 값 없음) · 토큰 저장소(DB) 상태
 * DELETE : ?id= 수신자 해제 (환경변수 수신자는 DB 행이 없으므로 화면에서 버튼을 감춘다)
 * 비밀값은 어느 쪽으로도 돌려주지 않는다.
 */
async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

function unauthorized() {
  return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
}

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  const [recipients, store] = await Promise.all([describeKakaoRecipients(), kakaoStoreHealth()]);
  return NextResponse.json({
    ok: true,
    kakao: { restApiKey: Boolean(getKakaoRestApiKey()), recipients },
    store,
    at: new Date().toISOString(),
  });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthed())) return unauthorized();
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!/^[A-Za-z0-9\-_]{1,80}$/.test(id)) {
    return NextResponse.json({ ok: false, error: "id 가 올바르지 않습니다" }, { status: 400 });
  }
  const ok = await removeKakaoRecipient(id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}
