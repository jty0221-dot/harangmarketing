/** Shared by the client draft and server research. Never treat a URL as page evidence. */
export type InquiryLinkState = "read" | "blocked" | "error" | "unsafe";
export interface InquiryLinkEvidence {
  url: string;
  state: InquiryLinkState;
  checkedAt: string;
  title?: string;
  description?: string;
  products?: string[];
  reason?: string;
}
export interface InquiryResearch {
  links: InquiryLinkEvidence[];
  checkedAt: string;
  truncated: boolean;
}

export function extractInquiryLinks(message?: string | null): string[] {
  const matches = (message || "").match(/(?:https?:\/\/|www\.|(?:smartstore|brand|blog)\.naver\.com\/)[^\s<>"']+/gi) || [];
  const links = new Set<string>();
  for (const match of matches) {
    const candidate = match.replace(/[.,;!?、。)\]}]+$/u, "");
    try {
      const url = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) continue;
      url.hash = "";
      links.add(url.toString());
    } catch { /* malformed text is not a link */ }
  }
  return [...links];
}
