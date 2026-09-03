#!/usr/bin/env node
'use strict'
/**
 * report.js — 진행 보고서를 홈페이지에 등록하고 링크를 돌려준다
 *
 * 왜 있나
 *   "OO 보고서 써줘" 한마디로 끝내기 위해서다.
 *   Claude 가 client-report 스킬로 내용을 쓰고 → 이 스크립트로 등록 → 링크만 받는다.
 *   관리자 화면에 로그인해 붙여넣는 단계가 사라진다.
 *
 * 쓰는 법
 *   node scripts/report.js <보고서.json>          공개 상태로 등록
 *   node scripts/report.js <보고서.json> --draft  임시저장 (링크는 나오지만 열리지 않음)
 *   node scripts/report.js --list                 최근 보고서 목록
 *
 * 입력 JSON (필수는 clientName, title)
 *   {
 *     "clientName": "00카페 00점",
 *     "title": "8월 3주차 진행 보고",
 *     "period": "2026-08-18 ~ 08-22",
 *     "summary": "'00동 카페' 키워드가 7위에서 3위로 올라왔습니다.",
 *     "metrics": [{ "label": "00동 카페 순위", "before": "7위", "after": "3위" }],
 *     "body": "<h2>진행사항</h2><ul><li>…</li></ul>",
 *     "requests": "1. 신메뉴 사진 5장만 보내주세요.",
 *     "code": "e2zfhpyry2wj"   // 있으면 그 보고서를 수정한다
 *   }
 *
 * 준비물 — .env.local 에 두 줄
 *   REPORTS_API_TOKEN=<Vercel 환경변수와 똑같은 값>
 *   REPORTS_SITE=https://www.harangmarketing.com   (없으면 이 값이 기본)
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const DEFAULT_SITE = 'https://www.harangmarketing.com'

/** .env.local 에서 값 하나 읽기 (dotenv 없이) */
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
  } catch (e) {
    /* 파일이 없으면 환경변수만 본다 */
  }
  return ''
}

function die(msg, hint) {
  console.error('\n[오류] ' + msg)
  if (hint) console.error('       ' + hint)
  console.error('')
  process.exit(1)
}

async function call(method, urlPath, body) {
  const site = (env('REPORTS_SITE') || DEFAULT_SITE).replace(/\/$/, '')
  const token = env('REPORTS_API_TOKEN')
  if (!token) {
    die(
      '.env.local 에 REPORTS_API_TOKEN 이 없습니다.',
      'Vercel 환경변수에 넣은 값과 똑같이 적어주세요. docs/reports.md 참고.'
    )
  }
  const res = await fetch(site + urlPath, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch (e) {
    die(`서버가 JSON 이 아닌 응답을 보냈습니다 (HTTP ${res.status})`, text.slice(0, 200))
  }
  if (res.status === 401) {
    die(
      '인증 실패 — 토큰이 다릅니다.',
      'Vercel 의 REPORTS_API_TOKEN 과 .env.local 값이 같은지, 값을 넣고 재배포했는지 확인하세요.'
    )
  }
  if (!json.ok) die(json.error || `요청 실패 (HTTP ${res.status})`)
  return { json, site }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.includes('--list')) {
    const { json, site } = await call('GET', '/api/admin/reports')
    const rows = json.reports || []
    console.log(`\n보고서 ${rows.length}건\n`)
    rows.slice(0, 20).forEach((r) => {
      const state = r.status === 'published' ? '공개' : '임시'
      console.log(
        `  ${state}  ${r.clientName}  ${r.title}`.padEnd(52) +
          `  조회 ${r.viewCount}  ${site}/r/${r.code}`
      )
    })
    console.log('')
    return
  }

  const file = args.find((a) => !a.startsWith('--'))
  if (!file) {
    die('보고서 JSON 파일 경로가 필요합니다.', 'node scripts/report.js <보고서.json> [--draft]')
  }

  let input
  try {
    input = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'))
  } catch (e) {
    die('JSON 을 읽지 못했습니다: ' + file, e.message)
  }

  if (!input.clientName || !input.title) {
    die('clientName 과 title 은 반드시 있어야 합니다.')
  }

  input.status = args.includes('--draft') ? 'draft' : 'published'

  const { json, site } = await call('POST', '/api/admin/reports', input)
  const r = json.report
  const url = `${site}/r/${r.code}`

  console.log('')
  console.log(`  ${r.status === 'published' ? '공개 완료' : '임시저장'} — ${r.clientName} · ${r.title}`)
  console.log('')
  console.log('  알림톡 변수 보고서링크 에 넣을 값')
  console.log(`    r/${r.code}`)
  console.log('')
  console.log('  전체 주소')
  console.log(`    ${url}`)
  console.log('')
  if (r.status !== 'published') {
    console.log('  임시저장 상태라 지금은 열리지 않습니다. 공개하려면 --draft 없이 다시 실행하세요.')
    console.log('')
  }
}

main().catch((e) => {
  die(e.message)
})
