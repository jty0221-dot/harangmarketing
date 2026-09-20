#!/usr/bin/env node
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/ 아래는 Node 가 바로 실행하는 CommonJS 다 (scripts/report.js 와 같은 방식)
/**
 * pull.js : 홈페이지에 들어온 문의와 첫 답 문안을 가져와 보고용으로 정리한다
 *
 * 왜 있나
 *   문의가 오면 관리자 화면(/admin/inquiries)이 그 문의에 맞는 첫 답 문안을 만든다.
 *   그런데 준수(본부장)·새미(비서실장)·보라(상담실장)는 로컬에서 도는 에이전트라 그 화면을 못 연다.
 *   이 스크립트가 피드(/api/admin/inquiries/feed)를 읽어 최근 문의를 한 장으로 정리해 준다.
 *   준수 교대·새미 아침 브리핑·보라 모니터가 이 한 줄을 부르면 '자동 보고' 가 된다.
 *
 * 쓰는 법
 *   node scripts/inquiries/pull.js                     최근 24시간 문의 (이름·전화는 가려서)
 *   node scripts/inquiries/pull.js --since 7d          최근 7일  (24h · 7d · 30d · 2026-09-20 도 됨)
 *   node scripts/inquiries/pull.js --full              이름·전화를 가리지 않고 (내 화면에서만 볼 때)
 *   node scripts/inquiries/pull.js --json              서버 응답 그대로 (다른 스크립트에 넘길 때)
 *   node scripts/inquiries/pull.js --write             보고 파일로 저장 (전화 없음 · 이름 가림)
 *       저장 위치 : E:/하랑/본부장/홈페이지/문의보고_최근.md  (INQUIRY_REPORT_MD 로 바꿀 수 있다)
 *
 * 가리는 규칙 (화면 밖으로 나가는 것은 전부 가린다)
 *   이름은 첫 글자 + OO, 전화는 뒤 4자리만, 문의문은 앞 40자만. 문안 속 이름도 같이 가린다.
 *   실명·전화·복사용 문안은 관리자 화면에서 본다 : /admin/inquiries?id=<번호>
 *   이 스크립트는 읽기만 한다. 상태를 바꾸지 않고 아무것도 보내지 않는다.
 *
 * 준비물 : .env.local 에 두 줄 (scripts/report.js 와 같은 값)
 *   REPORTS_API_TOKEN=<Vercel 환경변수와 똑같은 값>
 *   REPORTS_SITE=https://www.harangmarketing.com   (없으면 이 값이 기본)
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..', '..')
const DEFAULT_SITE = 'https://www.harangmarketing.com'
const DEFAULT_REPORT = path.resolve(ROOT, '..', '본부장', '홈페이지', '문의보고_최근.md')
const CLIP = 40

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
  } catch {
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

/** 인자 하나 읽기 : --since 7d 와 --since=7d 둘 다 받는다 */
function arg(args, name) {
  const i = args.indexOf(name)
  if (i >= 0 && args[i + 1] && !args[i + 1].startsWith('--')) return args[i + 1]
  const eq = args.find((a) => a.startsWith(name + '='))
  return eq ? eq.slice(name.length + 1) : ''
}

async function fetchFeed(since) {
  const site = (env('REPORTS_SITE') || DEFAULT_SITE).replace(/\/$/, '')
  const token = env('REPORTS_API_TOKEN')
  if (!token) {
    die(
      '.env.local 에 REPORTS_API_TOKEN 이 없습니다.',
      'Vercel 환경변수에 넣은 값과 똑같이 적어주세요. docs/reports.md 참고.'
    )
  }
  const url = site + '/api/admin/inquiries/feed?since=' + encodeURIComponent(since)
  const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    die(`서버가 JSON 이 아닌 응답을 보냈습니다 (HTTP ${res.status})`, text.slice(0, 200))
  }
  if (res.status === 401) {
    die(
      '인증 실패. 토큰이 다릅니다.',
      'Vercel 의 REPORTS_API_TOKEN 과 .env.local 값이 같은지, 값을 넣고 재배포했는지 확인하세요.'
    )
  }
  if (!json.ok) die(json.error || `요청 실패 (HTTP ${res.status})`)
  return { json, site }
}

/* ---------- 가리기 ---------- */

/** 문안이 쓰는 것과 같은 규칙으로 이름 뒤 호칭을 뗀다 (lib/inquiry-reply.ts 의 cleanName) */
function cleanName(name) {
  return String(name || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*(대표님|사장님|원장님|담당자님|대표|사장|원장|님)$/u, '')
    .trim()
    .slice(0, 30)
}

function maskName(name) {
  const n = cleanName(name)
  return n ? n.slice(0, 1) + 'OO' : '(이름 없음)'
}

function maskPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  return digits.length >= 4 ? '끝 ' + digits.slice(-4) : '(없음)'
}

function clip(text, n) {
  const t = String(text || '').replace(/\s+/g, ' ').trim()
  if (!t) return ''
  return t.length > n ? t.slice(0, n) + '...' : t
}

/** 문안 속 실명을 가린 이름으로 바꾼다. 문안은 호칭을 뗀 이름을 쓰므로 그것도 같이 바꾼다 */
function maskReply(text, name) {
  let out = String(text || '')
  const masked = maskName(name)
  // 호칭을 뗀 이름을 먼저 바꾼다. 원래 이름을 먼저 바꾸면 '홍길동 대표님' 의 호칭까지 지워진다
  for (const n of [cleanName(name), String(name || '').trim()]) {
    if (n && n.length >= 1) out = out.split(n).join(masked)
  }
  return out
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

/** ISO 시각을 한국 시각 '2026-09-20 (일) 14:02' 로 */
function fmtKst(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso || '')
  const k = new Date(d.getTime() + 9 * 3600 * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return (
    `${k.getUTCFullYear()}-${p(k.getUTCMonth() + 1)}-${p(k.getUTCDate())}` +
    ` (${DAYS[k.getUTCDay()]}) ${p(k.getUTCHours())}:${p(k.getUTCMinutes())}`
  )
}

/** 화면에 낼 모양으로 한 건을 정리한다. full 이 아니면 전부 가린다 */
function view(q, site, full) {
  const reply = q.reply || { kakao: '', sms: '', kindLabel: '' }
  return {
    id: q.id,
    when: fmtKst(q.createdAt),
    name: full ? String(q.name || '') : maskName(q.name),
    phone: full ? String(q.phone || '') : maskPhone(q.phone),
    industry: q.industry || '',
    budget: q.budget || '',
    goals: q.goals || '',
    message: full ? String(q.message || '') : clip(q.message, CLIP),
    source: q.sourceLabel || q.source || '',
    status: q.statusLabel || q.status || '',
    kind: reply.kindLabel || '',
    kakao: full ? reply.kakao : maskReply(reply.kakao, q.name),
    sms: full ? reply.sms : maskReply(reply.sms, q.name),
    link: `${site}/admin/inquiries?id=${q.id}`,
  }
}

function indent(text, pad) {
  return String(text || '')
    .split('\n')
    .map((l) => pad + l)
    .join('\n')
}

/* ---------- 출력 ---------- */

function renderText(items, since, now) {
  const lines = [`홈페이지 문의 · 최근 ${since} · ${items.length}건 (기준 ${fmtKst(now)})`, '']
  if (!items.length) lines.push('새 문의가 없습니다.')
  items.forEach((v, i) => {
    lines.push(`${i + 1}) ${v.when} · ${v.source} · ${v.status} · ${v.kind}`)
    lines.push(`   이름 ${v.name} · 연락처 ${v.phone}` + (v.industry ? ` · 업종 ${v.industry}` : ''))
    if (v.budget || v.goals) lines.push(`   예산 ${v.budget || '(없음)'} · 목표 ${v.goals || '(없음)'}`)
    if (v.message) lines.push(`   문의 : ${v.message}`)
    lines.push('   카톡용 문안 :')
    lines.push(indent(v.kakao, '   | '))
    lines.push('   문자용 문안 :')
    lines.push(indent(v.sms, '   | '))
    lines.push(`   화면 : ${v.link}`)
    lines.push('')
  })
  return lines.join('\n')
}

/** 보고 파일 : 전화는 아예 적지 않고, 이름은 가리고, 문의문은 앞 40자만 */
function renderMd(items, since, now) {
  const out = [
    `# 홈페이지 문의 보고 (최근 ${since})`,
    '',
    `- 만든 시각 : ${fmtKst(now)} · 만든 것 : scripts/inquiries/pull.js (읽기만 한다)`,
    `- 건수 : ${items.length}건`,
    '- 이 파일에는 전화번호를 적지 않는다. 이름은 첫 글자만, 문의문은 앞 40자만 남긴다',
    '- 실명 · 전화 · 복사용 문안은 관리자 화면에서 본다 (건마다 아래 화면 링크)',
    '- 보내는 것은 사람이다. 문안을 복사해 카톡으로 붙이거나 화면의 문자 버튼을 누른다',
    '',
  ]
  if (!items.length) out.push('새 문의가 없습니다.', '')
  items.forEach((v, i) => {
    out.push(`## ${i + 1}. ${v.when} · ${v.name} · ${v.kind}`, '')
    out.push(`- 경로 : ${v.source} · 상태 : ${v.status}`)
    const facts = []
    if (v.industry) facts.push(`업종 : ${v.industry}`)
    if (v.budget) facts.push(`예산 : ${v.budget}`)
    if (v.goals) facts.push(`목표 : ${v.goals}`)
    if (facts.length) out.push('- ' + facts.join(' · '))
    if (v.message) out.push(`- 문의 : ${v.message}`)
    out.push(`- 화면 : ${v.link}`, '')
    out.push('카톡용 문안 (이름은 가린 것 · 실명 문안은 화면에서 복사)', '')
    out.push(indent(v.kakao, '> '), '')
    out.push('문자용 문안', '')
    out.push(indent(v.sms, '> '), '')
  })
  return out.join('\n')
}

async function main() {
  const args = process.argv.slice(2)
  const since = arg(args, '--since') || '24h'
  const full = args.includes('--full')
  const asJson = args.includes('--json')
  const write = args.includes('--write')

  const { json, site } = await fetchFeed(since)
  const now = new Date()

  if (asJson) {
    process.stdout.write(JSON.stringify(json, null, 2) + '\n')
    return
  }

  const items = (json.inquiries || []).map((q) => view(q, site, full))
  process.stdout.write(renderText(items, since, now) + '\n')

  if (write) {
    // 파일은 언제나 가린 판이다. --full 을 같이 줘도 파일에는 실명을 적지 않는다
    const masked = full ? (json.inquiries || []).map((q) => view(q, site, false)) : items
    const file = env('INQUIRY_REPORT_MD') || DEFAULT_REPORT
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, renderMd(masked, since, now), 'utf8')
    console.log('보고 파일 : ' + file)
  }
}

main().catch((e) => die('실행 중 오류: ' + (e && e.message ? e.message : String(e))))
