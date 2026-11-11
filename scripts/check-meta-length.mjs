// 사이트맵의 모든 쪽에서 meta description · og:description 길이를 잰다 (네이버 서치어드바이저 80자 권고).
// 사용: next start 로 띄운 뒤 `node scripts/check-meta-length.mjs [http://localhost:3000]`
// 넘는 쪽 · 빠진 쪽이 하나라도 있으면 종료 코드 1. 상한은 app/lib/seo.ts META_DESC_MAX 와 같다.
const MAX = 80;
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const SITE = "https://www.harangmarketing.com";

const unescape = (s) =>
  s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

function meta(html, attr, name) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    if (new RegExp(`${attr}="${name}"`, "i").test(tag)) {
      const m = tag.match(/content="([^"]*)"/i);
      return m ? unescape(m[1]) : "";
    }
  }
  return null;
}

const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => unescape(m[1]).replace(SITE, base));
const rows = [];
for (const url of urls) {
  const res = await fetch(url);
  const html = await res.text();
  const d = meta(html, "name", "description");
  const og = meta(html, "property", "og:description");
  const ogt = meta(html, "property", "og:title");
  const t = (html.match(/<title>([^<]*)<\/title>/i) || [])[1];
  rows.push({ path: decodeURI(url.slice(base.length) || "/"), status: res.status, d, og, ogt, title: t ? unescape(t) : null });
}

let over = 0;
for (const r of rows) {
  const dl = r.d == null ? -1 : [...r.d].length;
  const ol = r.og == null ? -1 : [...r.og].length;
  const bad = r.status !== 200 || dl < 0 || ol < 0 || dl > MAX || ol > MAX;
  if (bad) over++;
  if (bad || process.env.VERBOSE) console.log(`${bad ? "FAIL" : "ok  "}\t${r.status}\t${dl}\t${ol}\t${r.path}`);
}
if (process.env.JSON_OUT) (await import("node:fs")).writeFileSync(process.env.JSON_OUT, JSON.stringify(rows, null, 1));
const dOver = rows.filter((r) => r.d != null && [...r.d].length > MAX).length;
const oOver = rows.filter((r) => r.og != null && [...r.og].length > MAX).length;
// og:title 은 공유 미리보기 한 줄이라 45자를 넘으면 알리기만 한다 (블로그 · 사진 상세는 글 제목 그대로라 셈에서 뺀다)
const longOgTitle = rows.filter((r) => r.ogt && [...r.ogt].length > 45 && !/^\/blog\/|^\/services\/photo\/(food|stay)\//.test(r.path));
for (const r of longOgTitle) console.log(`WARN	og:title ${[...r.ogt].length}	${r.path}`);
console.log(`pages=${rows.length} description>${MAX}=${dOver} og:description>${MAX}=${oOver} fail=${over} og:title>45=${longOgTitle.length}`);
process.exit(over ? 1 : 0);
