/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/ 아래는 Node 가 바로 실행하는 CommonJS 다 (scripts/report.js 와 같은 방식)
/**
 * naver-api.js : 네이버 클라우드 키로 검색 · 검색어 트렌드 · 지도(주소 → 좌표) 를 부른다
 *
 * 왜 있나
 *   순위 · 레퍼런스 · 키워드 무게를 사람이 손으로 재고 있었다 (데이터랩 화면 · 검색 화면).
 *   2026-10-03 (토) 대표가 네이버 클라우드에 애플리케이션을 만들고 「전부 진행할 수 있게」 를 지시했다.
 *   이 스크립트가 키 하나로 세 가지를 같은 방식으로 부른다.
 *
 * 키 (값은 대표만 넣는다 · 문서 · 커밋 · 대화에 값을 적지 않는다)
 *   E:\하랑\harang\.env.local (git 에 안 올라감) 또는 실행할 때의 환경변수
 *   NAVER_API_HUB_CLIENT_ID      NAVER API HUB 애플리케이션 Client ID   (검색 · 검색어 트렌드)
 *   NAVER_API_HUB_CLIENT_SECRET  NAVER API HUB 애플리케이션 Client Secret
 *   NCP_MAPS_CLIENT_ID           Maps 애플리케이션 Client ID   (지도 · 주소 → 좌표 · API HUB 와 다른 상품)
 *   NCP_MAPS_CLIENT_SECRET       Maps 애플리케이션 Client Secret
 *
 * 쓰는 법
 *   node scripts/naver-api/naver-api.js check                       키가 들어 있는지와 세 갈래 호출 상태만 본다
 *   node scripts/naver-api/naver-api.js blog "부천 맛집" [개수]      블로그 검색 (최신순)
 *   node scripts/naver-api/naver-api.js cafe "부천 맛집" [개수]      카페글 검색 (최신순)
 *   node scripts/naver-api/naver-api.js local "부천 맛집"            지역 (업체 · 기관) 검색
 *   node scripts/naver-api/naver-api.js trend 2026-01-01 2026-09-30 month "맛집:부천맛집,부천 맛집" "카페:부천카페"
 *   node scripts/naver-api/naver-api.js geocode "서울특별시 중구 세종대로 110"
 *
 * 지키는 선
 *   · 키 값은 어디에도 찍지 않는다. check 는 「들어 있음 / 없음」 과 HTTP 상태만 낸다
 *   · 읽기만 한다. 파일을 쓰지 않는다 (결과는 화면으로만 나간다)
 *   · 공식 문서 기준 (2026-10-03 확인) : 주소 naverapihub.apigw.ntruss.com · 헤더 X-NCP-APIGW-API-KEY-ID / X-NCP-APIGW-API-KEY ·
 *     검색 GET /search/v1/{blog|cafearticle|local} · 트렌드 POST /search-trend/v1/search (그룹 5개 · 그룹당 검색어 20개까지)
 *   · 지도 주소는 새 주소 (maps.apigw) 를 먼저 부르고 안 되면 옛 주소 (naveropenapi.apigw) 로 한 번 더 부른다
 */
const fs = require("fs");
const path = require("path");

const HUB = "https://naverapihub.apigw.ntruss.com";
const MAPS_HOSTS = ["https://maps.apigw.ntruss.com", "https://naveropenapi.apigw.ntruss.com"];

/** .env.local 을 읽어 이미 있는 환경변수는 덮지 않고 채운다. 값은 돌려주지 않는다 */
function loadEnvLocal() {
  // 저장소 안 .env.local 이 먼저 · 작업 폴더 (worktree) 에서 돌릴 때는 원래 폴더의 .env.local 을 본다
  const file = [path.join(__dirname, "..", "..", ".env.local"), "E:/하랑/harang/.env.local"].find((f) => fs.existsSync(f));
  if (!file) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}

function keys(kind) {
  const [idName, secretName] =
    kind === "maps"
      ? ["NCP_MAPS_CLIENT_ID", "NCP_MAPS_CLIENT_SECRET"]
      : ["NAVER_API_HUB_CLIENT_ID", "NAVER_API_HUB_CLIENT_SECRET"];
  const id = process.env[idName];
  const secret = process.env[secretName];
  if (!id || !secret) {
    const missing = [!id && idName, !secret && secretName].filter(Boolean).join(" · ");
    throw new Error(`키가 없습니다 : ${missing} (E:\\하랑\\harang\\.env.local 에 이름 = 값 으로 넣어 주세요)`);
  }
  return { "X-NCP-APIGW-API-KEY-ID": id, "X-NCP-APIGW-API-KEY": secret };
}

async function call(url, init, kind) {
  const res = await fetch(url, {
    ...init,
    headers: { ...(init && init.headers), ...keys(kind) },
    signal: AbortSignal.timeout(15000),
  });
  const text = await res.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text.slice(0, 300) };
  }
  return { status: res.status, body };
}

const strip = (s) => String(s || "").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

async function search(kind, query, display = 10, sort) {
  const q = new URLSearchParams({ query, display: String(display), start: "1" });
  // 웹문서(webkr)는 정렬 값이 없다. 순위를 잴 때는 정확도순(sim)으로 부른다
  if (kind !== "webkr") q.set("sort", sort || (kind === "local" ? "random" : "date"));
  if (kind !== "local") q.set("format", "json");
  return call(`${HUB}/search/v1/${kind}?${q}`, { method: "GET" }, "hub");
}

/**
 * 순위 재기 : 키워드마다 웹문서 · 블로그 정확도순 100건 안에서 우리 주소가 몇 번째인지 본다.
 * 검색 API 결과는 실제 검색 화면 순서와 다를 수 있다 (같은 날 같은 방법으로 재서 흐름을 본다).
 */
async function rank(keywords, site = "harangmarketing.com", blogId = "harangmarketing") {
  const rows = [];
  for (const k of keywords) {
    const pos = async (kind, match) => {
      const r = await search(kind, k, 100, "sim");
      if (r.status !== 200) return `HTTP${r.status}`;
      const i = (r.body.items || []).findIndex((it) => match(String(it.link || "")));
      return i < 0 ? "100밖" : String(i + 1);
    };
    rows.push([k, await pos("webkr", (l) => l.includes(site)), await pos("blog", (l) => l.includes(`blog.naver.com/${blogId}`))]);
  }
  return rows;
}

async function trend(startDate, endDate, timeUnit, groups) {
  const keywordGroups = groups.map((g) => {
    const [name, list] = g.split(":");
    return { groupName: name, keywords: (list || name).split(",").map((k) => k.trim()).filter(Boolean) };
  });
  if (keywordGroups.length > 5) throw new Error("그룹은 5개까지입니다 (공식 한도)");
  return call(
    `${HUB}/search-trend/v1/search`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ startDate, endDate, timeUnit, keywordGroups }) },
    "hub",
  );
}

async function geocode(query) {
  let last = null;
  for (const host of MAPS_HOSTS) {
    last = await call(`${host}/map-geocode/v2/geocode?${new URLSearchParams({ query })}`, { method: "GET", headers: { Accept: "application/json" } }, "maps");
    if (last.status === 200) return { ...last, host };
  }
  return { ...last, host: MAPS_HOSTS[MAPS_HOSTS.length - 1] };
}

async function check() {
  const has = (n) => (process.env[n] ? "들어 있음" : "없음");
  console.log("키 (값은 찍지 않음)");
  for (const n of ["NAVER_API_HUB_CLIENT_ID", "NAVER_API_HUB_CLIENT_SECRET", "NCP_MAPS_CLIENT_ID", "NCP_MAPS_CLIENT_SECRET"]) {
    console.log(`  ${n} : ${has(n)}`);
  }
  const line = async (label, fn) => {
    try {
      const r = await fn();
      const note = r.status === 200 ? "정상" : r.status === 401 ? "인증 실패 (키 값 · 애플리케이션에 그 API 를 골랐는지 확인)" : r.status === 429 ? "하루 호출 한도 초과" : "확인 필요";
      console.log(`  ${label} : HTTP ${r.status} · ${note}`);
      return r.status === 200;
    } catch (e) {
      console.log(`  ${label} : 건너뜀 · ${e.message}`);
      return false;
    }
  };
  console.log("호출 상태");
  const ok = [
    await line("블로그 검색", () => search("blog", "하랑마케팅", 1)),
    await line("카페글 검색", () => search("cafearticle", "하랑마케팅", 1)),
    await line("검색어 트렌드", () => trend("2026-01-01", "2026-01-31", "month", ["시험:마케팅"])),
    await line("지도 (주소 → 좌표)", () => geocode("서울특별시 중구 세종대로 110")),
  ];
  console.log(`결과 : ${ok.filter(Boolean).length} / ${ok.length} 정상`);
  return ok.every(Boolean) ? 0 : 1;
}

async function main() {
  loadEnvLocal();
  const [cmd, ...args] = process.argv.slice(2);
  if (cmd === "check") process.exit(await check());
  if (cmd === "blog" || cmd === "cafe" || cmd === "local") {
    const kind = cmd === "cafe" ? "cafearticle" : cmd;
    const r = await search(kind, args[0], Math.min(Number(args[1]) || 10, cmd === "local" ? 5 : 100));
    if (r.status !== 200) {
      console.error(`HTTP ${r.status}`, JSON.stringify(r.body).slice(0, 300));
      process.exit(1);
    }
    console.log(`전체 ${r.body.total ?? "?"}건 중 ${(r.body.items || []).length}건`);
    for (const it of r.body.items || []) {
      console.log(`- ${strip(it.title)} | ${it.postdate || ""} | ${it.bloggername || it.cafename || it.category || ""} | ${it.link}`);
    }
    return;
  }
  if (cmd === "trend") {
    const [startDate, endDate, timeUnit, ...groups] = args;
    const r = await trend(startDate, endDate, timeUnit, groups);
    if (r.status !== 200) {
      console.error(`HTTP ${r.status}`, JSON.stringify(r.body).slice(0, 300));
      process.exit(1);
    }
    for (const g of r.body.results || []) {
      console.log(`[${g.title}] ` + g.data.map((d) => `${d.period} ${d.ratio}`).join(" · "));
    }
    return;
  }
  if (cmd === "rank") {
    console.log("키워드\t웹문서 순위\t블로그 순위");
    for (const row of await rank(args)) console.log(row.join("\t"));
    return;
  }
  if (cmd === "geocode") {
    const r = await geocode(args.join(" "));
    if (r.status !== 200) {
      console.error(`HTTP ${r.status}`, JSON.stringify(r.body).slice(0, 300));
      process.exit(1);
    }
    for (const a of r.body.addresses || []) console.log(`${a.roadAddress} | 경도 ${a.x} · 위도 ${a.y}`);
    return;
  }
  console.log("쓰는 법은 파일 머리 주석을 보세요 (check · blog · cafe · local · trend · geocode)");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
