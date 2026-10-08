#!/usr/bin/env node
/**
 * IndexNow 알림 · 하랑 홈페이지 주소가 새로 생기거나 바뀌었을 때 검색엔진에 바로 알린다.
 *
 * api.indexnow.org 한 곳에 보내면 참여 검색엔진(네이버 · 빙 · 얀덱스 등)이 같이 받는다. 구글은 참여하지 않는다
 * (구글은 서치 콘솔 사이트맵 제출 · 색인 요청으로 한다 · 대표 계정).
 * 키는 공개용이다 (public/<키>.txt 파일과 같은 값). 비밀값이 아니다.
 *
 * 쓰는 법 (배포가 운영에 반영된 뒤)
 *   node scripts/indexnow.js                 운영 사이트맵의 주소 전부
 *   node scripts/indexnow.js /blog /services  고른 주소만
 *
 * 응답 : 200 · 202 = 접수 · 403 = 키 파일을 못 읽음 (배포 전) · 422 = 주소가 host 와 다름 · 429 = 너무 자주 보냄
 * 2026-10-08 (목) 민수 · 전 페이지 점검에서 구글 색인 7쪽 · 네이버 웹문서 56쪽 확인 뒤 추가
 */
const fs = require("fs");
const path = require("path");

const HOST = "www.harangmarketing.com";
const BASE = `https://${HOST}`;
const keyFile = fs.readdirSync(path.join(__dirname, "..", "public")).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error("public 에 IndexNow 키 파일(32자 16진수.txt)이 없습니다");
  process.exit(1);
}
const KEY = keyFile.replace(/\.txt$/, "");

(async () => {
  // 윈도우 Git Bash 는 '/services/x' 같은 인자를 'C:/Program Files/Git/services/x' 로 바꿔 넘긴다 (422 원인 · 2026-10-08).
  // 그 앞부분을 걷어내고, 앞에 / 가 없으면 붙인다
  const norm = (p) => {
    const q = p.replace(/^[A-Za-z]:[\\/].*?[\\/]Git(?=[\\/])/i, "").replace(/\\/g, "/");
    return q.startsWith("/") ? q : "/" + q;
  };
  let urls = process.argv.slice(2).map((p) => (p.startsWith("http") ? p : BASE + norm(p)));
  if (urls.length === 0) {
    const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
    urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  }
  const body = { host: HOST, key: KEY, keyLocation: `${BASE}/${KEY}.txt`, urlList: urls.slice(0, 10000) };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow ${res.status} · 주소 ${body.urlList.length}개`);
  process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
})();
