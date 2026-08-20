import { NextRequest, NextResponse } from "next/server";
import { getProduct, isQtyValid, calcTotal, platformName } from "../../../lib/sns-store";
import { appendOrder, genOrderNo, type SnsOrder } from "../../../lib/sns-orders";
import { panelBalance } from "../../../lib/smm-panel";

/**
 * 주문 접수 (공개)
 *
 * 여기서는 대장 기록과 알림만 한다.
 * 공급 파트너 발주는 어드민이 입금을 확인한 뒤 /api/admin/sns 에서 실행한다.
 * (접수 즉시 발주하면 미입금 주문이 파트너 잔액을 소진한다)
 */

function isHttpUrl(s: string): boolean {
  const t = s.trim().toLowerCase();
  return t.startsWith("http://") || t.startsWith("https://");
}

/** 서버리스 인스턴스 단위의 가벼운 과다 요청 방지 */
const recent = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now();
  const list = (recent.get(ip) ?? []).filter((t) => now - t < 60_000);
  list.push(now);
  recent.set(ip, list);
  return list.length > 5;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "요청 형식이 올바르지 않습니다" }, { status: 400 });
  }

  // 봇 트랩 — 사람 눈에 안 보이는 필드가 채워져 있으면 접수한 척만 한다
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, no: genOrderNo() });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) {
    return NextResponse.json(
      { ok: false, error: "요청이 너무 잦습니다. 1분 뒤 다시 시도해 주세요." },
      { status: 429 }
    );
  }

  const slug = String(body.product ?? "");
  const product = getProduct(slug);
  if (!product) {
    return NextResponse.json({ ok: false, error: "상품을 찾을 수 없습니다" }, { status: 400 });
  }

  const link = String(body.link ?? "").trim();
  const contact = String(body.contact ?? "").trim();
  const depositor = String(body.depositor ?? "").trim();
  let qty = Number(body.qty);
  let comments: string | undefined;

  if (product.needsComments) {
    const lines = String(body.comments ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      return NextResponse.json({ ok: false, error: "댓글 내용을 입력해 주세요 (한 줄에 하나)" }, { status: 400 });
    }
    comments = lines.join("\n");
    qty = lines.length; // 지정 댓글은 줄 수가 곧 수량
  }

  if (!isQtyValid(product, qty)) {
    return NextResponse.json(
      { ok: false, error: `수량은 ${product.min}~${product.max} 사이여야 합니다` },
      { status: 400 }
    );
  }
  if (!isHttpUrl(link) || link.length > 500) {
    return NextResponse.json({ ok: false, error: "링크는 http(s):// 로 시작하는 주소여야 합니다" }, { status: 400 });
  }
  if (contact.length < 5 || contact.length > 60) {
    return NextResponse.json({ ok: false, error: "연락처(전화번호 또는 카카오톡 ID)를 입력해 주세요" }, { status: 400 });
  }
  if (depositor.length < 1 || depositor.length > 30) {
    return NextResponse.json({ ok: false, error: "입금자명을 입력해 주세요" }, { status: 400 });
  }

  const total = calcTotal(product, qty);
  const order: SnsOrder = {
    no: genOrderNo(),
    createdAt: new Date().toISOString(),
    product: product.slug,
    productName: product.name,
    platform: product.platform,
    sid: product.sid,
    qty,
    unitPrice: product.unitPrice,
    total,
    link,
    contact,
    depositor,
    ...(comments ? { comments } : {}),
    status: "pending",
  };

  try {
    await appendOrder(order);
  } catch (e) {
    console.error("주문 저장 실패:", e);
    return NextResponse.json(
      { ok: false, error: "주문 접수 중 문제가 생겼습니다. 카카오톡 채널로 문의해 주세요." },
      { status: 500 }
    );
  }

  // 사장님 알림 — 상담 신청과 같은 웹훅을 쓴다 (없으면 조용히 생략)
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    // 파트너 잔액을 함께 보내 충전 타이밍을 놓치지 않게 한다 (조회 실패는 무시)
    let balanceLine = "";
    try {
      const b = await panelBalance();
      const low = b.balance < Number(process.env.SMM_LOW_BALANCE ?? 30000);
      balanceLine = `파트너 잔액: ${Math.floor(b.balance).toLocaleString("ko-KR")}원${low ? " — 충전 필요!" : ""}`;
    } catch {}
    const text = [
      "[SNS 부스트 주문]",
      `주문번호: ${order.no}`,
      `상품: ${platformName(product.platform)} · ${product.name}`,
      `수량: ${qty.toLocaleString("ko-KR")}${product.unitLabel} · 금액: ${total.toLocaleString("ko-KR")}원`,
      `링크: ${link}`,
      `연락처: ${contact} · 입금자명: ${depositor}`,
      balanceLine,
    ].filter(Boolean).join("\n");
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    } catch {
      // 알림 실패가 주문 실패가 되어서는 안 된다
    }
  }

  return NextResponse.json({
    ok: true,
    no: order.no,
    total,
    // 견적서 하단과 같은 수금 계좌 — 고객에게 보여주는 공개 정보라 기본값을 코드에 둔다.
    // 계좌를 바꾸면 SNS_BANK 환경변수로 덮어쓸 수 있다.
    bank: process.env.SNS_BANK || "국민은행 0947-0104-384081 (예금주: 전태영(하랑))",
  });
}
