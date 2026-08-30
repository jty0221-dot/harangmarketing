import { NextRequest, NextResponse } from "next/server";
import {
  approveInnopay,
  chargeIdFromMoid,
  innopayConfigured,
  isInnopaySuccess,
  readMoid,
  readResultCode,
  readResultMsg,
  readTid,
  readToken,
} from "../../../../../lib/innopay";
import { approveChargeByPayment, getChargeById } from "../../../../../lib/charges";

/**
 * 이노페이 결제창 복귀 지점 (returnUrl)
 *
 * 카드 인증이 끝나면 이노페이가 이 주소로 결과를 보낸다. 여기까지는 인증일 뿐이라
 * 돈이 아직 빠져나가지 않았다 — 우리 서버가 승인 API 를 불러야 결제가 성립한다.
 *
 * 이노페이 가맹점 관리자에 등록할 주소:
 *   https://www.harangmarketing.com/api/sns/charge/innopay/return
 *
 * 지키는 선:
 *   1) 브라우저가 보낸 금액을 쓰지 않는다. 승인 요청 금액은 DB 의 신청 금액이다
 *   2) 승인 응답 금액이 DB 금액과 다르면 반영하지 않고 사장님께 알린다
 *   3) 성공 코드가 아니면 전부 실패로 본다
 *   4) 같은 요청이 두 번 와도 잔액은 한 번만 오른다 (pg_tx_id unique + status 조건부 갱신)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Bag = Record<string, unknown>;

async function readBody(req: NextRequest): Promise<Bag> {
  const bag: Bag = {};
  for (const [k, v] of req.nextUrl.searchParams.entries()) bag[k] = v;

  const type = (req.headers.get("content-type") ?? "").toLowerCase();
  try {
    if (type.includes("application/json")) {
      const json = (await req.json()) as Bag;
      Object.assign(bag, json);
    } else if (type.includes("form")) {
      const form = await req.formData();
      for (const [k, v] of form.entries()) if (typeof v === "string") bag[k] = v;
    }
  } catch {
    // 본문을 못 읽어도 쿼리스트링만으로 판정한다
  }
  return bag;
}

async function handle(req: NextRequest) {
  const bag = await readBody(req);
  const moid = readMoid(bag);
  const chargeId = chargeIdFromMoid(moid);
  const tid = readTid(bag);
  const authCode = readResultCode(bag);

  if (!chargeId) return back("fail", "주문 정보를 확인하지 못했습니다");
  if (!innopayConfigured()) return back("fail", "결제 설정이 아직 준비되지 않았습니다", chargeId);

  // 인증 단계에서 이미 실패한 경우 — 승인 요청을 보내지 않는다
  if (authCode && !isInnopaySuccess(authCode)) {
    return back("fail", readResultMsg(bag) || "카드 인증이 완료되지 않았습니다", chargeId);
  }
  if (!tid) return back("fail", "거래 번호를 받지 못했습니다", chargeId);

  const charge = await getChargeById(chargeId);
  if (!charge) return back("fail", "충전 신청 내역을 찾지 못했습니다", chargeId);
  if (charge.status === "paid") return back("ok", "", chargeId, charge.amount);
  if (charge.status !== "pending") return back("fail", "이미 종료된 충전 신청입니다", chargeId);

  const approval = await approveInnopay({
    tid,
    moid,
    amount: charge.amount, // DB 금액 — 브라우저가 보낸 값이 아니다
    paymentToken: readToken(bag),
  });

  if (!approval.ok) {
    console.error("이노페이 승인 실패:", chargeId, approval.resultCode, approval.resultMsg);
    return back("fail", approval.resultMsg || "결제 승인이 거절되었습니다", chargeId);
  }

  // 응답 금액을 읽을 수 있으면 대조한다. 필드명을 못 읽어 -1 이면 우리가 보낸 금액이
  // 그대로 승인된 것이므로 통과시키되, 다른 금액이 찍혀 오면 반영하지 않는다.
  if (approval.amount >= 0 && approval.amount !== charge.amount) {
    await notifyOwner(
      `[SNS 부스트] 이노페이 승인 금액 불일치 — 확인 필요\n충전#${chargeId} · 신청 ${charge.amount.toLocaleString("ko-KR")}원 · 승인 ${approval.amount.toLocaleString("ko-KR")}원\n자동 반영하지 않았습니다. 이노페이 관리자에서 취소 여부를 확인하세요. (거래번호 ${approval.tid})`
    );
    return back("fail", "결제 금액이 맞지 않아 처리하지 못했습니다. 담당자가 확인합니다", chargeId);
  }

  const result = await approveChargeByPayment(chargeId, approval.tid, charge.amount, {
    provider: "innopay",
    memo: "카드 결제 자동충전",
  });

  if (result === "mismatch") {
    await notifyOwner(
      `[SNS 부스트] 이노페이 충전 금액 불일치 — 확인 필요\n충전#${chargeId} · 거래번호 ${approval.tid}\n어드민에서 확인하세요.`
    );
    return back("fail", "결제 확인 중 문제가 생겼습니다. 담당자가 확인합니다", chargeId);
  }
  if (!result) {
    // 이미 반영된 건 (중복 호출) — 사용자에게는 성공으로 보여준다
    return back("ok", "", chargeId, charge.amount);
  }

  await notifyOwner(
    `[SNS 부스트] 카드 충전 완료 (이노페이)\n충전#${chargeId} · ${result.amount.toLocaleString("ko-KR")}원\n회원 잔액 ${result.balanceAfter.toLocaleString("ko-KR")}원`
  );
  return back("ok", "", chargeId, result.amount);
}

export const POST = handle;
export const GET = handle;

/**
 * 결제창(iframe·팝업) 안에서 우리 충전 화면으로 되돌린다.
 * iframe 이면 top 을, 팝업이면 opener 를 옮기고 자기 창을 닫는다.
 */
function back(status: "ok" | "fail", message: string, chargeId?: number, amount?: number) {
  const q = new URLSearchParams({ pay: status });
  if (chargeId) q.set("charge", String(chargeId));
  if (amount && amount > 0) q.set("amt", String(amount));
  if (message) q.set("msg", message);
  const target = `/sns/charge?${q.toString()}`;

  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="robots" content="noindex">
<title>결제 확인</title>
<noscript><meta http-equiv="refresh" content="0;url=${escapeHtml(target)}"></noscript>
</head><body style="margin:0;font-family:system-ui,-apple-system,'Malgun Gothic',sans-serif;
display:flex;align-items:center;justify-content:center;height:100vh;color:#70737C;font-size:14px">
결제 결과를 확인하고 있습니다
<script>
(function () {
  var url = ${JSON.stringify(target)};
  try {
    if (window.opener && window.opener !== window && !window.opener.closed) {
      window.opener.location.replace(url);
      window.close();
      return;
    }
  } catch (e) {}
  try {
    (window.top || window).location.replace(url);
  } catch (e) {
    window.location.replace(url);
  }
})();
</script>
</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      // 프레임 허용은 next.config.ts 의 경로별 헤더 규칙에서 준다.
      // 여기서 또 넣으면 헤더가 두 개가 되어 브라우저가 충돌로 보고 아예 막는다.
    },
  });
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function notifyOwner(text: string) {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {}
}
