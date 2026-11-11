#!/usr/bin/env node
/**
 * IndexNow 알림 · 하랑 홈페이지 주소가 새로 생기거나 바뀌었을 때 네이버 · 빙에 바로 알린다.
 * (scripts/indexnow.js 2026-10-08 를 대신한다 · TR-0080 · 2026-10-28 (수) 민수)
 *
 * 왜 : 서치어드바이저 수동 수집 요청은 하루 50개 한도다. IndexNow 는 한 번에 10,000개까지 받는다.
 *   나머지는 사이트맵 · RSS · 내부 링크로 발견된다. 구글은 IndexNow 에 참여하지 않는다 (서치콘솔 사이트맵 제출).
 *
 * 엔드포인트 (2026-10-28 공식 문서 확인)
 *   네이버 : https://searchadvisor.naver.com/indexnow   (searchadvisor.naver.com/guide/indexnow-request · POST 1회 최대 10,000개)
 *   빙     : https://www.bing.com/indexnow
 *   공용   : https://api.indexnow.org/indexnow          (참여 엔진끼리 공유 · indexnow.org/documentation)
 *
 * 키 : public/<32자 16진수>.txt 파일 이름 = 파일 내용 = 키. 공개 파일이다 (비밀값 아님).
 *
 * 쓰는 법 (배포가 운영에 반영된 뒤 · 대표 결재 C)
 *   node scripts/indexnow.mjs --dry-run                  보낼 주소만 세어 본다 (아무것도 안 보냄)
 *   node scripts/indexnow.mjs                            운영 사이트맵 전부 → 네이버 · 빙
 *   node scripts/indexnow.mjs /services/homepage/clinic  고른 주소만
 *   node scripts/indexnow.mjs --sitemap http://localhost:3000/sitemap.xml --dry-run   로컬 사이트맵으로 점검
 *   node scripts/indexnow.mjs --engine naver             한 곳만 (naver · bing · indexnow)
 *
 * 응답 : 200 · 202 = 접수 · 400 형식 · 403 키 파일 못 읽음(배포 전) · 422 주소가 host 와 다름 · 429 너무 자주 보냄
 * 200 은 받았다는 뜻일 뿐 수집 · 색인을 뜻하지 않는다.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOST = "www.harangmarketing.com";
const BASE = `https://${HOST}`;
const MAX = 10000;
const ENGINES = {
  naver: "https://searchadvisor.naver.com/indexnow",
  bing: "https://www.bing.com/indexnow",
  indexnow: "https://api.indexnow.org/indexnow",
};

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const dryRun = flag("--dry-run");
const sitemapUrl = opt("--sitemap") ?? `${BASE}/sitemap.xml`;
const engineArg = opt("--engine");
const engines = engineArg ? [engineArg] : ["naver", "bing"];
for (const e of engines) if (!ENGINES[e]) { console.error(`모르는 엔진 : ${e} (naver · bing · indexnow)`); process.exit(2); }
const paths = args.filter((a, i) => !a.startsWith("--") && !["--sitemap", "--engine"].includes(args[i - 1]));

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const keyFile = readdirSync(publicDir).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) { console.error("public 에 IndexNow 키 파일(32자 16진수.txt)이 없습니다"); process.exit(1); }
const KEY = keyFile.replace(/\.txt$/, "");
if (readFileSync(join(publicDir, keyFile), "utf8").trim() !== KEY) { console.error(`${keyFile} 내용이 파일 이름과 다릅니다`); process.exit(1); }

// 윈도우 Git Bash 는 '/services/x' 인자를 'C:/Program Files/Git/services/x' 로 바꿔 넘긴다 (422 원인 · 2026-10-08)
const norm = (p) => {
  const q = p.replace(/^[A-Za-z]:[\\/].*?[\\/]Git(?=[\\/])/i, "").replace(/\\/g, "/");
  return q.startsWith("/") ? q : "/" + q;
};

let urls = paths.map((p) => (p.startsWith("http") ? p : BASE + norm(p)));
if (urls.length === 0) {
  const res = await fetch(sitemapUrl);
  if (!res.ok) { console.error(`사이트맵 ${sitemapUrl} ${res.status}`); process.exit(1); }
  const xml = await res.text();
  // 로컬 사이트맵을 읽어도 보내는 주소는 운영 host 로 맞춘다 (host 가 다르면 422)
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim().replace(/^https?:\/\/[^/]+/, BASE));
}
urls = [...new Set(urls)];
const bad = urls.filter((u) => new URL(u).host !== HOST);
if (bad.length) { console.error(`host 가 다른 주소 ${bad.length}개 : ${bad.slice(0, 3).join(" ")}`); process.exit(1); }

const chunks = [];
for (let i = 0; i < urls.length; i += MAX) chunks.push(urls.slice(i, i + MAX));
console.log(`주소 ${urls.length}개 · 묶음 ${chunks.length}개 · 엔진 ${engines.join(" · ")} · 키 ${KEY}`);

if (dryRun) {
  for (const u of urls.slice(0, 15)) console.log(`  ${u}`);
  if (urls.length > 15) console.log(`  … 외 ${urls.length - 15}개`);
  console.log("--dry-run : 아무것도 보내지 않았습니다");
} else {
let failed = 0;
for (const engine of engines) {
  for (const [i, urlList] of chunks.entries()) {
    const body = { host: HOST, key: KEY, keyLocation: `${BASE}/${KEY}.txt`, urlList };
    try {
      const res = await fetch(ENGINES[engine], {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(body),
      });
      const ok = res.status === 200 || res.status === 202;
      if (!ok) failed++;
      console.log(`${engine} 묶음 ${i + 1}/${chunks.length} · ${urlList.length}개 · HTTP ${res.status}${ok ? " 접수" : ""}`);
    } catch (e) {
      failed++;
      console.log(`${engine} 묶음 ${i + 1}/${chunks.length} · 전송 실패 · ${e.message}`);
    }
  }
}
// fetch 뒤 process.exit() 는 윈도우 Node 에서 libuv 단언으로 죽는다 (2026-10-28 실측) · 종료 코드만 남기고 자연 종료
process.exitCode = failed ? 1 : 0;
}
