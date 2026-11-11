#!/usr/bin/env node
/**
 * 카톡 예약 발송 판매 페이지 추적 확인 (한 번만 받는다 · 폴링 금지)
 *
 * 1) 페이지가 보이는 버전 = 프로그램 저장소 버전정보.json 최신버전
 * 2) 페이지의 요금 숫자 = 판매설정.json 요금제 가격 (넷 다, 순서 무관)
 * 3) 페이지의 무료 체험 건수 = 판매설정.json 무료체험.건수
 *
 * 종료 코드 : 0 일치 · 1 어긋남 · 2 확인 불가 (403 · 네트워크 · 파일 없음)
 * 403 은 장애가 아니라 Vercel DDoS 방어다. 되풀이해 두드리지 말고 시간을 두고 한 번 더 돌린다.
 *
 * 사용 :
 *   node scripts/check-kakao-sender-version.mjs
 *   node scripts/check-kakao-sender-version.mjs --url http://localhost:3000/kakao-sender
 *   node scripts/check-kakao-sender-version.mjs --settings E:/하랑/카톡예약발송/판매설정.json
 *
 * 판매설정.json 에는 화면에 올리지 않는 값(입금계좌 등)도 있다. 이 스크립트는 요금제 가격과
 * 체험 건수만 읽고 다른 값은 출력하지 않는다.
 * 추적 문서 : E:\하랑\본부장\홈페이지\추적_카톡예약발송_판매페이지.md
 */

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const arg = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};

const PAGE_URL = arg("--url", "https://www.harangmarketing.com/kakao-sender");
const SETTINGS = arg("--settings", "E:/하랑/카톡예약발송/판매설정.json");
const RELEASE_URL =
  "https://raw.githubusercontent.com/jty0221-dot/kakao-sender/main/%EB%B2%84%EC%A0%84%EC%A0%95%EB%B3%B4.json";

const lines = [];
const say = (s) => lines.push(s);
/* process.exit() 를 바로 부르면 윈도우에서 닫히는 중인 fetch 소켓과 부딪혀 libuv 가 죽는다 (종료 127).
   그래서 결과를 던져 맨 아래에서 exitCode 로 끝낸다. */
class Done {
  constructor(code) {
    this.code = code;
  }
}
const done = (code) => {
  throw new Done(code);
};

async function get(url, accept) {
  const res = await fetch(url, {
    headers: { "user-agent": "harang-ks-tracker/1.0 (one-shot check)", accept },
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
  });
  return res;
}

async function main() {
  say(`확인 시각 : ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`);
  say(`페이지 : ${PAGE_URL}`);

  // 1) 정본 두 개
  let release;
  try {
    const r = await get(RELEASE_URL, "application/json");
    if (!r.ok) {
      say(`버전정보.json 응답 ${r.status}`);
      done(2);
    }
    release = await r.json();
  } catch (e) {
    if (e instanceof Done) throw e;
    say(`버전정보.json 을 못 읽었다 : ${e.message}`);
    done(2);
  }
  const wantVersion = String(release["최신버전"] ?? "").trim();
  say(`정본 최신버전 : ${wantVersion} (${release["날짜"] ?? "날짜 없음"})`);

  let settings;
  try {
    settings = JSON.parse(readFileSync(SETTINGS, "utf8").replace(/^\uFEFF/, ""));
  } catch (e) {
    if (e instanceof Done) throw e;
    say(`판매설정.json 을 못 읽었다 : ${SETTINGS} · ${e.message}`);
    done(2);
  }
  const wantPrices = (settings["요금제"] ?? []).map((p) => Number(p["가격"])).sort((a, b) => a - b);
  const wantTrial = Number(settings?.["무료체험"]?.["건수"]);
  say(`정본 요금 : ${wantPrices.join(" · ")} · 체험 ${wantTrial}건`);

  // 2) 페이지 한 번
  let html;
  try {
    const r = await get(PAGE_URL, "text/html");
    if (r.status === 403) {
      say("페이지 응답 403 · Vercel DDoS 방어다. 장애가 아니다. 시간을 두고 한 번 더 돌린다");
      done(2);
    }
    if (!r.ok) {
      say(`페이지 응답 ${r.status}`);
      done(2);
    }
    html = await r.text();
  } catch (e) {
    if (e instanceof Done) throw e;
    say(`페이지를 못 받았다 : ${e.message}`);
    done(2);
  }

  // 보이는 버전 (React 가 텍스트 사이에 <!-- --> 를 넣을 수 있다)
  const flat = html.replace(/<!-- -->/g, "");
  const badge = flat.match(/윈도우 프로그램 · 버전 (\d+(?:\.\d+){1,3})/);
  const ld = flat.match(/"softwareVersion":"([^"]+)"/);
  const seenVersion = badge?.[1] ?? null;
  const ldVersion = ld?.[1] ?? null;
  say(`페이지 버전 : 화면 ${seenVersion ?? "못 찾음"} · 구조화 데이터 ${ldVersion ?? "못 찾음"}`);

  // 요금 (구조화 데이터 Offer 의 price)
  const offerBlock = flat.match(/"offers":\[(.*?)\]\}/s)?.[1] ?? "";
  const seenPrices = [...offerBlock.matchAll(/"price":(\d+)/g)].map((m) => Number(m[1])).sort((a, b) => a - b);
  say(`페이지 요금 : ${seenPrices.length ? seenPrices.join(" · ") : "못 찾음"}`);

  const trialM = flat.match(/무료 (\d+)건 체험/);
  const seenTrial = trialM ? Number(trialM[1]) : null;
  say(`페이지 체험 : ${seenTrial ?? "못 찾음"}건`);

  const bad = [];
  if (seenVersion !== wantVersion) bad.push(`화면 버전 ${seenVersion} ≠ 정본 ${wantVersion}`);
  if (ldVersion !== wantVersion) bad.push(`구조화 데이터 버전 ${ldVersion} ≠ 정본 ${wantVersion}`);
  if (JSON.stringify(seenPrices) !== JSON.stringify(wantPrices))
    bad.push(`요금 ${seenPrices.join("·")} ≠ 판매설정 ${wantPrices.join("·")} (가격 변경은 대표 결재 C-35)`);
  if (seenTrial !== wantTrial) bad.push(`체험 ${seenTrial} ≠ 판매설정 ${wantTrial}`);

  for (const b of bad) say(`어긋남 : ${b}`);
  done(bad.length ? 1 : 0);
}

let code = 2;
try {
  await main();
} catch (e) {
  if (e instanceof Done) code = e.code;
  else say(`예상 못 한 오류 : ${e?.message ?? e}`);
}
say(`결과 : ${code === 0 ? "일치 (종료 0)" : code === 1 ? "어긋남 (종료 1)" : "확인 불가 (종료 2)"}`);
console.log(lines.join(String.fromCharCode(10)));
process.exitCode = code;
