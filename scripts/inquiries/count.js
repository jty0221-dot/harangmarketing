#!/usr/bin/env node
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/ 아래는 Node 가 바로 실행하는 CommonJS 다 (scripts/inquiries/pull.js 와 같은 방식)
/**
 * count.js : 홈페이지 문의를 건수로만 센다 (새미 08:30 아침 브리핑용)
 *
 * 왜 있나
 *   새미(비서실장)의 아침 브리핑은 카톡으로 나간다. 거기에는 이름 · 전화 · 문의문이 한 글자도 들어가면 안 된다.
 *   pull.js 는 가린 이름 · 전화 끝 4자리 · 문의문 앞부분까지 찍으므로 브리핑에 쓰지 않는다.
 *   이 스크립트는 숫자 셋과 관리자 화면 주소만 낸다.
 *
 * 세는 것
 *   접수             : 최근 24시간 안에 들어온 문의 (상태 무관) · --hours 로 창을 바꾼다
 *   미응대           : 상태가 응대 완료(done)가 아닌 문의 = 새 문의(new) + 확인함(checked)
 *   48시간 넘은 미응대 : 미응대 가운데 들어온 지 48시간이 지난 것
 *
 * 쓰는 법
 *   node scripts/inquiries/count.js              한 줄 요약
 *   node scripts/inquiries/count.js --json       숫자만 담은 JSON (기계용)
 *   node scripts/inquiries/count.js --hours 72   접수 창을 72시간으로 (브리핑이 하루 이상 비었을 때)
 *
 * 지키는 것
 *   이름 · 연락처 · 문의문 · 메모 · 답 문안은 어떤 경우에도 찍지 않는다. 오류 때도 서버 본문을 찍지 않는다.
 *   환경변수는 이름으로만 읽는다 (REPORTS_API_TOKEN · REPORTS_SITE, .env.local 또는 프로세스 환경). 값은 찍지 않는다.
 *   읽기만 한다. 문의 상태를 바꾸지 않고 아무것도 보내지 않는다.
 *   실제 문의는 관리자 화면에서 연다 : https://www.harangmarketing.com/admin/inquiries
 *
 * 한계
 *   피드(/api/admin/inquiries/feed)는 최신 300건까지만 준다. 300건이 다 차면 그보다 오래된 미응대는
 *   셀 수 없으므로 capped 로 알린다.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..', '..')
const DEFAULT_SITE = 'https://www.harangmarketing.com'
const ADMIN_PATH = '/admin/inquiries'
// 화면 주소는 환경값이 아니라 고정 주소로 적는다 (.env.local 값을 출력에 싣지 않기 위해)
const ADMIN_URL = DEFAULT_SITE + ADMIN_PATH
// app/api/admin/inquiries/feed/route.ts 의 MAX_ROWS 와 같은 값
const FEED_MAX = 300
// 피드의 since 는 이 날짜 이후 전부 = 피드가 주는 최신 300건 전부
const SINCE_ALL = '2000-01-01'
const STALE_HOURS = 48
const HOUR_MS = 3600 * 1000
const TIMEOUT_MS = 20000

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

/** .env.local 에서 값 하나 읽기 (dotenv 없이 · pull.js 와 같은 규칙) */
function env(key) {
  if (process.env[key]) return process.env[key]
  try {
    const raw = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq < 0) continue
      if (t.slice(0, eq).trim() !== key) continue
      return t
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, '')
    }
  } catch {
    /* 파일이 없으면 환경변수만 본다 */
  }
  return ''
}

/** 인자 하나 읽기 : --hours 72 와 --hours=72 둘 다 받는다 */
function arg(args, name) {
  const i = args.indexOf(name)
  if (i >= 0 && args[i + 1] && !args[i + 1].startsWith('--')) return args[i + 1]
  const eq = args.find((a) => a.startsWith(name + '='))
  return eq ? eq.slice(name.length + 1) : ''
}

/** 시각을 한국 시각 '2026-09-24 (목) 08:30' 으로 */
function fmtKst(ms) {
  const k = new Date(ms + 9 * HOUR_MS)
  const p = (n) => String(n).padStart(2, '0')
  return (
    `${k.getUTCFullYear()}-${p(k.getUTCMonth() + 1)}-${p(k.getUTCDate())}` +
    ` (${DAYS[k.getUTCDay()]}) ${p(k.getUTCHours())}:${p(k.getUTCMinutes())}`
  )
}

/** 실패 : 한 줄만 낸다. 서버 본문 · 환경값은 싣지 않는다 */
function fail(msg, asJson) {
  if (asJson) {
    process.stdout.write(
      JSON.stringify({ ok: false, error: msg, adminPath: ADMIN_PATH, adminUrl: ADMIN_URL }) + '\n'
    )
  } else {
    console.error('[오류] 홈페이지 문의 건수 확인 실패 · ' + msg)
  }
  process.exit(1)
}

/** 피드를 읽어 문의 목록만 돌려준다. 목록은 이 함수 밖에서 세기만 하고 찍지 않는다 */
async function fetchRows(asJson) {
  const token = env('REPORTS_API_TOKEN')
  if (!token) fail('REPORTS_API_TOKEN 이 없습니다 (.env.local 또는 환경변수)', asJson)
  const site = (env('REPORTS_SITE') || DEFAULT_SITE).replace(/\/$/, '')
  const url = site + '/api/admin/inquiries/feed?since=' + encodeURIComponent(SINCE_ALL)

  let res
  try {
    const opts = { headers: { Authorization: 'Bearer ' + token } }
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
      opts.signal = AbortSignal.timeout(TIMEOUT_MS)
    }
    res = await fetch(url, opts)
  } catch (e) {
    const code = (e && e.cause && e.cause.code) || (e && e.name) || 'unknown'
    fail(`사이트에 연결하지 못했습니다 (${code})`, asJson)
  }

  if (res.status === 401) {
    fail('인증 실패 (REPORTS_API_TOKEN 이 서버 값과 다릅니다)', asJson)
  }
  let json = null
  try {
    json = JSON.parse(await res.text())
  } catch {
    fail(`서버 응답을 읽지 못했습니다 (HTTP ${res.status})`, asJson)
  }
  if (!json || !json.ok) {
    // 서버의 error 는 고정 문구다. 그래도 길이를 자른다
    const why = json && typeof json.error === 'string' ? json.error.slice(0, 80) : ''
    fail(why ? `${why} (HTTP ${res.status})` : `요청 실패 (HTTP ${res.status})`, asJson)
  }
  if (!Array.isArray(json.inquiries)) fail('서버 응답에 문의 목록이 없습니다', asJson)
  return json.inquiries
}

/** 숫자만 센다. 개인 정보가 담긴 필드(이름 · 연락처 · 문의문 등)는 읽지도 않는다 */
function count(rows, nowMs, hours) {
  const receivedFrom = nowMs - hours * HOUR_MS
  const staleBefore = nowMs - STALE_HOURS * HOUR_MS
  const out = { received: 0, unanswered: 0, byStatus: { new: 0, checked: 0 }, stale: 0 }
  for (const r of rows) {
    const t = Date.parse(r && r.createdAt)
    const status = r && r.status
    if (!Number.isNaN(t) && t >= receivedFrom) out.received++
    if (status === 'done') continue
    out.unanswered++
    if (status === 'checked') out.byStatus.checked++
    else out.byStatus.new++
    if (!Number.isNaN(t) && t <= staleBefore) out.stale++
  }
  return out
}

async function main() {
  const args = process.argv.slice(2)
  const asJson = args.includes('--json')
  const rawHours = arg(args, '--hours')
  const hours = rawHours ? Number(rawHours) : 24
  if (!Number.isInteger(hours) || hours < 1 || hours > 720) {
    fail('--hours 는 1 ~ 720 사이 정수로 적습니다', asJson)
  }

  const rows = await fetchRows(asJson)
  const nowMs = Date.now()
  const c = count(rows, nowMs, hours)
  const capped = rows.length >= FEED_MAX

  if (asJson) {
    process.stdout.write(
      JSON.stringify(
        {
          ok: true,
          checkedAt: fmtKst(nowMs),
          hours,
          received: c.received,
          unanswered: c.unanswered,
          unansweredByStatus: c.byStatus,
          staleHours: STALE_HOURS,
          stale: c.stale,
          capped,
          adminPath: ADMIN_PATH,
          adminUrl: ADMIN_URL,
        },
        null,
        2
      ) + '\n'
    )
    return
  }

  const lines = [
    `홈페이지 문의 · 접수 ${c.received}건 (최근 ${hours}시간)` +
      ` · 미응대 ${c.unanswered}건 (새 문의 ${c.byStatus.new} · 확인함 ${c.byStatus.checked})` +
      ` · ${STALE_HOURS}시간 넘은 미응대 ${c.stale}건` +
      (capped ? ` · 최신 ${FEED_MAX}건 안에서 셈` : ''),
    `화면 : ${ADMIN_URL} · 기준 ${fmtKst(nowMs)}`,
  ]
  process.stdout.write(lines.join('\n') + '\n')
}

main().catch((e) => fail('실행 중 오류 (' + ((e && e.name) || 'Error') + ')', process.argv.includes('--json')))
