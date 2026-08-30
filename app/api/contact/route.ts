import { NextRequest, NextResponse } from "next/server";
import { saveInquiry } from "../../lib/inquiries";

/* 서버리스 인스턴스 단위의 가벼운 과다 요청 방지.
   /api/sns/order 와 같은 방식이다. 완전한 차단이 아니라 자동 도배를 늦추는 장치다. */
const recent = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now();
  const list = (recent.get(ip) ?? []).filter((t) => now - t < 60_000);
  list.push(now);
  recent.set(ip, list);
  return list.length > 5;
}

/** 길이 상한 — DB 와 알림 웹훅으로 그대로 흘러가는 값이라 여기서 자른다 */
const LIMIT = { name: 60, phone: 40, industry: 60, budget: 60, goals: 300, message: 2000, source: 60 };
function capped(v: unknown, max: number): string {
  return String(v ?? "").slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (tooMany(ip)) {
      return NextResponse.json(
        { ok: false, error: "요청이 너무 잦습니다. 1분 뒤 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, phone, industry, budget, goals, message, source } = body;

    // 봇 트랩 — 사람 눈에 안 보이는 필드가 채워져 있으면 접수한 척만 한다
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "이름과 연락처를 입력해 주세요" }, { status: 400 });
    }

    const goalsText = goals?.length > 0 ? `\n목표: ${goals.join(", ")}` : "";
    const budgetText = budget ? `\n예산: ${budget}` : "";
    const msgText = message ? `\n추가 문의: ${message}` : "";

    /* 저장이 먼저다.
       예전에는 웹훅만 쐈다. 알림을 놓치거나 웹훅이 실패하면 문의가 그대로 사라졌다.
       저장에 실패해도 접수 자체는 막지 않는다(알림이라도 가야 한다). */
    let saved = false;
    try {
      await saveInquiry({
        name: capped(name, LIMIT.name),
        phone: capped(phone, LIMIT.phone),
        industry: industry ? capped(industry, LIMIT.industry) : undefined,
        budget: budget ? capped(budget, LIMIT.budget) : undefined,
        goals: Array.isArray(goals)
          ? capped(goals.join(", "), LIMIT.goals)
          : goals
            ? capped(goals, LIMIT.goals)
            : undefined,
        message: message ? capped(message, LIMIT.message) : undefined,
        source: source ? capped(source, LIMIT.source) : "web",
      });
      saved = true;
    } catch (e) {
      console.error("상담 저장 실패:", e);
    }

    const text = [
      "[하랑마케팅 상담 신청]",
      `이름/업체명: ${name}`,
      `연락처: ${phone}`,
      `업종: ${industry}`,
      budgetText,
      goalsText,
      msgText,
      saved ? "" : "저장 실패 — 이 메시지를 꼭 보관하세요",
    ]
      .filter(Boolean)
      .join("\n");

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      } catch (e) {
        console.error("상담 알림 웹훅 실패:", e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
