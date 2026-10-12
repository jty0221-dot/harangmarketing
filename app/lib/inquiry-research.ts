import { lookup } from "node:dns/promises";
import { request } from "node:https";
import { isIP } from "node:net";
import { extractInquiryLinks, type InquiryLinkEvidence, type InquiryResearch } from "./inquiry-links";

const MAX_BYTES = 1_000_000;
const MAX_LINKS = 5;
const TIMEOUT_MS = 8000;

/** Reject non-public addresses, including mapped IPv4. DNS is pinned to the checked address. */
export function isPublicInquiryAddress(address: string): boolean {
  if (isIP(address) === 4) {
    const [a, b, c] = address.split(".").map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0 || (b === 2))) ||
      (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
      (a === 203 && b === 0 && c === 113));
  }
  if (isIP(address) !== 6) return false;
  const a = address.toLowerCase();
  const second = Number.parseInt(a.split(":")[1] || "0", 16);
  return /^[23][0-9a-f]{3}:/.test(a) && !/^2002:/.test(a) &&
    !(a.startsWith("2001:") && (second < 0x200 || second === 0xdb8)) && !a.startsWith("3fff:");
}

function cleanText(value: string): string {
  return value.replace(/<[^>]*>/g, " ")
    .replace(/&quot;|&#34;/gi, "").replace(/&apos;|&#39;/gi, "'")
    .replace(/&amp;/gi, "&").replace(/&lt;|&gt;/gi, " ").replace(/&nbsp;/gi, " ")
    .replace(/[\u0000-\u001f\u200b-\u200f\ufeff]/g, " ").replace(/\s+/g, " ").trim();
}

export function parseInquiryPage(url: string, html: string, status: number): InquiryLinkEvidence {
  const checkedAt = new Date().toISOString();
  const stripped = html.replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ");
  const text = cleanText(stripped);
  if (status >= 400 || /현재 서비스 접속이 불가|접근이 제한|접속이 제한|captcha|verify you are human|access denied|시스템오류/i.test(text)) {
    return { url, checkedAt, state: "blocked", reason: `페이지 접근 제한${status >= 400 ? ` (HTTP ${status})` : ""}` };
  }
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => {
    const attrs = new Map([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])([\s\S]*?)\2/g)].map((m) => [m[1].toLowerCase(), m[3]]));
    return { name: (attrs.get("property") || attrs.get("name") || "").toLowerCase(), content: attrs.get("content") || "" };
  });
  const title = cleanText(metas.find(m => m.name === "og:title")?.content || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").slice(0, 180);
  const description = cleanText(metas.find(m => m.name === "og:description" || m.name === "description")?.content || "").slice(0, 400);
  const products: string[] = [];
  function collect(value: unknown, depth = 0) {
    if (depth > 8 || !value || typeof value !== "object" || products.length >= 6) return;
    if (Array.isArray(value)) { value.forEach(v => collect(v, depth + 1)); return; }
    const obj = value as Record<string, unknown>;
    if ((obj["@type"] === "Product" || (Array.isArray(obj["@type"]) && obj["@type"].includes("Product"))) && typeof obj.name === "string") {
      const name = cleanText(obj.name).slice(0, 120);
      if (name && !products.includes(name)) products.push(name);
    }
    Object.values(obj).forEach(v => collect(v, depth + 1));
  }
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { collect(JSON.parse(m[1])); } catch { /* invalid schema is not evidence */ }
  }
  if (!title || (!description && !products.length && text.length < 150)) {
    return { url, checkedAt, state: "blocked", reason: "공개 페이지에서 분석할 내용을 충분히 읽지 못했습니다" };
  }
  return { url, checkedAt, state: "read", title, description: description || undefined, products };
}

async function getPage(raw: string, depth = 0, deadline = Date.now() + TIMEOUT_MS): Promise<{ html: string; status: number; url: string }> {
  const url = new URL(raw);
  // Public customer websites only. No credentials, alternate ports, or insecure transport.
  if (url.protocol !== "https:" || (url.port && url.port !== "443") || url.username || url.password) throw new Error("unsafe-url");
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (Date.now() >= deadline) throw new Error("timeout");
  let dnsTimer: ReturnType<typeof setTimeout> | undefined;
  const addresses = isIP(hostname) ? [{ address: hostname, family: isIP(hostname) }] : await Promise.race([
    lookup(hostname, { all: true }),
    new Promise<never>((_, reject) => { dnsTimer = setTimeout(() => reject(new Error("timeout")), deadline - Date.now()); }),
  ]).finally(() => { if (dnsTimer) clearTimeout(dnsTimer); });
  if (!addresses.length || addresses.some(a => !isPublicInquiryAddress(a.address))) throw new Error("unsafe-url");
  const pinned = addresses[0];
  return new Promise((resolve, reject) => {
    const req = request(url, {
      headers: { "User-Agent": "HarangInquiryReview/1.0", Accept: "text/html,application/xhtml+xml" },
      family: pinned.family,
      lookup: (_hostname, _options, callback) => callback(null, pinned.address, pinned.family),
    }, res => {
      const status = res.statusCode || 0;
      if ([301, 302, 303, 307, 308].includes(status) && res.headers.location) {
        res.destroy();
        if (depth >= 3) { reject(new Error("redirect-limit")); return; }
        getPage(new URL(res.headers.location, url).toString(), depth + 1, deadline).then(resolve, reject);
        return;
      }
      if (!/text\/html|application\/xhtml\+xml/i.test(res.headers["content-type"] || "")) {
        res.destroy(); reject(new Error("not-html")); return;
      }
      let bytes = 0;
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => {
        bytes += chunk.length;
        if (bytes > MAX_BYTES) { res.destroy(); reject(new Error("page-too-large")); }
        else chunks.push(chunk);
      });
      res.on("end", () => resolve({ html: Buffer.concat(chunks).toString("utf8"), status, url: url.toString() }));
      res.on("error", reject);
    });
    const timeout = setTimeout(() => req.destroy(new Error("timeout")), Math.max(1, deadline - Date.now()));
    req.on("close", () => clearTimeout(timeout));
    req.on("error", reject);
    req.end();
  });
}

export async function researchInquiryLinks(message?: string | null): Promise<InquiryResearch> {
  const urls = extractInquiryLinks(message);
  const links = await Promise.all(urls.slice(0, MAX_LINKS).map(async url => {
    try {
      const page = await getPage(url);
      // Keep the supplied URL as the identity, including after a validated redirect.
      return parseInquiryPage(url, page.html, page.status);
    } catch (e) {
      const unsafe = e instanceof Error && e.message === "unsafe-url";
      return { url, state: unsafe ? "unsafe" : "error", checkedAt: new Date().toISOString(),
        reason: unsafe ? "공개 HTTPS 주소만 확인할 수 있습니다" : "페이지 내용을 읽지 못했습니다" } as InquiryLinkEvidence;
    }
  }));
  return { links, checkedAt: new Date().toISOString(), truncated: urls.length > MAX_LINKS };
}
