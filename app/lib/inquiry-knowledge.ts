export interface InquiryFaqFact { question: string; answer: string; source: string }
export interface InquiryKnowledge { facts: InquiryFaqFact[]; checkedAt: string; available: boolean }

/** The published FAQ is the price/policy authority. No private files or customer data are sent. */
export async function getPublicInquiryKnowledge(): Promise<InquiryKnowledge> {
  const source = "https://www.harangmarketing.com/faq";
  const facts: InquiryFaqFact[] = [];
  try {
    const res = await fetch(source, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error("faq-unavailable");
    const html = await res.text();
    function walk(value: unknown, depth = 0) {
      if (!value || typeof value !== "object" || depth > 8) return;
      if (Array.isArray(value)) { value.forEach(v => walk(v, depth + 1)); return; }
      const obj = value as Record<string, unknown>;
      if (obj["@type"] === "Question" && typeof obj.name === "string") {
        const answer = obj.acceptedAnswer as Record<string, unknown> | undefined;
        if (typeof answer?.text === "string") facts.push({ question: obj.name, answer: answer.text, source });
      }
      Object.values(obj).forEach(v => walk(v, depth + 1));
    }
    for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try { walk(JSON.parse(match[1])); } catch { /* only valid published structured data */ }
    }
    return { facts, available: facts.length > 0, checkedAt: new Date().toISOString() };
  } catch {
    return { facts: [], available: false, checkedAt: new Date().toISOString() };
  }
}
