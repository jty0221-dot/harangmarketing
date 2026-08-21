import { NextRequest, NextResponse } from "next/server";
import { saveInquiry } from "../../lib/inquiries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, industry, budget, goals, message, source } = body;

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
        name: String(name),
        phone: String(phone),
        industry: industry ? String(industry) : undefined,
        budget: budget ? String(budget) : undefined,
        goals: Array.isArray(goals) ? goals.join(", ") : goals ? String(goals) : undefined,
        message: message ? String(message) : undefined,
        source: source ? String(source) : "web",
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
