#!/usr/bin/env node
/**
 * 보고 시점 계산기 — 오늘 어느 업체에 보고서를 써야 하는지 알려준다.
 *
 * 왜 필요한가
 *   보고서를 쓰는 것보다 '써야 할 때를 아는 것' 이 먼저 무너진다.
 *   25곳을 머리로 기억할 수 없어서, 계약 대장과 실제 보고 이력을 맞대어 계산한다.
 *
 * 두 가지 시점 (2026-08-22 대표 지시)
 *   1) 주간 보고 — 매주 월요일. 지난주가 지났으니 정리해서 보낸다.
 *   2) 재계약 보고 — 재계약일 D-5. 재계약 문자와 같이 나간다.
 *      '이만큼 올려드렸습니다' 가 곧 재계약 설득 자료라서 문자만 보내지 않는다.
 *      재계약을 안 하면 그게 계약 종료이므로, 이 보고가 최종 보고를 겸한다.
 *
 * 진실의 출처
 *   업체 명단·재계약날 = work-manager 스킬의 contracts.md (원본은 구글 시트)
 *   마지막 보고일       = 보고서 DB (scripts/report.js 로 올린 것)
 *   두 곳을 맞대어 보므로 어느 한쪽만 고쳐도 여기서 티가 난다.
 *
 * 쓰기
 *   node scripts/report-due.js              오늘 기준
 *   node scripts/report-due.js --date 2026-08-24   특정 날짜로 미리 보기
 *   node scripts/report-due.js --all        기한 안 됐어도 전 업체 상태
 *   node scripts/report-due.js --json       새미 브리핑 등 기계용
 *
 * contracts.md 위치가 다르면 .env.local 에 CONTRACTS_MD=<경로> 를 넣는다.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const DEFAULT_SITE = 'https://www.harangmarketing.com'
const DEFAULT_CONTRACTS =
  'C:\\Users\\pc\\.claude\\skills\\work-manager\\references\\contracts.md'

/** 주간 보고 요일 — 0=일 … 1=월 (2026-08-22 대표 지시: 월요일 통일) */
const WEEKLY_DOW = 1
/** 재계약일 며칠 전에 보고할지 — 재계약 문자와 같은 날 */
const RENEWAL_LEAD = 5
/** 마지막 보고가 이만큼 지나면 요일과 상관없이 밀린 것으로 본다 */
const OVERDUE_DAYS = 10

const WD = ['일', '월', '화', '수', '목', '금', '토']

// ── 공통 (scripts/report.js 와 같은 방식) ────────────────────────────────

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
      return t.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
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

// ── 날짜 (전부 한국 시간 기준) ───────────────────────────────────────────

/** Date → 'YYYY-MM-DD' (한국 시간). 시스템 시계를 그대로 쓴다 — 추측하지 않는다. */
function ymd(d) {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
  return p
}

/** 'YYYY-MM-DD' → 날짜 비교용 UTC 자정. 시간대 계산을 한 번만 하려는 것이다. */
function parseYmd(s) {
  const [y, m, d] = s.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

function addDays(s, n) {
  const t = new Date(parseYmd(s) + n * 86400000)
  const p = (x) => String(x).padStart(2, '0')
  return `${t.getUTCFullYear()}-${p(t.getUTCMonth() + 1)}-${p(t.getUTCDate())}`
}

function diffDays(a, b) {
  return Math.round((parseYmd(a) - parseYmd(b)) / 86400000)
}

function dow(s) {
  return new Date(parseYmd(s)).getUTCDay()
}

function label(s) {
  return `${s} (${WD[dow(s)]})`
}

/**
 * 재계약날은 '매월 반복되는 일자' 다 (contracts.md 핵심 규칙).
 * 30일·31일이 없는 달은 그 달의 마지막 날로 당긴다 — 2월에 30일 계약이 사라지면 안 된다.
 */
function renewalOn(today, dayOfMonth, monthOffset) {
  const [y, m] = today.split('-').map(Number)
  const base = new Date(Date.UTC(y, m - 1 + (monthOffset || 0), 1))
  const yy = base.getUTCFullYear()
  const mm = base.getUTCMonth()
  const last = new Date(Date.UTC(yy, mm + 1, 0)).getUTCDate()
  const d = Math.min(dayOfMonth, last)
  const p = (x) => String(x).padStart(2, '0')
  return `${yy}-${p(mm + 1)}-${p(d)}`
}

// ── contracts.md 읽기 ────────────────────────────────────────────────────

/**
 * 별칭 '(= …)' 을 떼어 보기 좋은 이름만 남긴다.
 * 끝까지 욕심내서 지운다 — '대림역 소방 (=(주)소방)' 은 괄호가 겹쳐 있어
 * 짧게 끊으면 '대림역 소방소방)' 이 된다.
 */
function displayName(s) {
  return String(s).replace(/\*\*/g, '').replace(/\s*\(=.*\)\s*$/, '').trim()
}

/** 업체명 비교용. 표기 차이(공백·별칭·강조)를 지우고 맞댄다. */
function normName(s) {
  return displayName(s).replace(/\s+/g, '')
}

function readContracts() {
  const file = env('CONTRACTS_MD') || DEFAULT_CONTRACTS
  let raw
  try {
    raw = fs.readFileSync(file, 'utf8')
  } catch (e) {
    die(
      'contracts.md 를 못 읽었습니다: ' + file,
      '경로가 다르면 .env.local 에 CONTRACTS_MD=<경로> 를 넣어주세요.'
    )
  }

  const lines = raw.split(/\r?\n/)
  const start = lines.findIndex((l) => l.startsWith('## 진행 중 업체 상세'))
  if (start < 0) {
    die(
      "contracts.md 에서 '## 진행 중 업체 상세' 를 못 찾았습니다.",
      '문서 구조가 바뀌었다면 이 스크립트도 같이 고쳐야 합니다.'
    )
  }

  const clients = []
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('## ')) break
    if (!line.startsWith('|')) continue
    const cells = line.split('|').slice(1, -1).map((c) => c.trim())
    if (cells.length < 7) continue
    if (cells[0] === '업체' || cells[0].startsWith('---')) continue

    const name = cells[0].replace(/\*\*/g, '').trim()
    const dayRaw = cells[1].replace(/\*\*/g, '').trim()
    const note = cells[6] || ''

    // 돈스탑처럼 대표가 감시 제외를 지시한 곳은 보고 대상에서도 뺀다
    if (note.includes('감시 제외')) continue

    const m = dayRaw.match(/(\d+)/)
    clients.push({
      name: displayName(name),
      key: normName(name),
      renewalDay: m ? Number(m[1]) : null,
      // 어느 것부터 쓸지 정하는 데만 쓴다. 월요일에 24건이 한꺼번에 뜨므로 순서가 필요하다.
      fee: Number(String(cells[3]).replace(/[^0-9]/g, '')) || 0,
      note,
    })
  }

  if (clients.length === 0) {
    die(
      'contracts.md 에서 업체를 하나도 못 읽었습니다.',
      '표 형식이 바뀌었을 수 있습니다. 조용히 넘어가면 보고를 통째로 빠뜨리므로 여기서 멈춥니다.'
    )
  }
  return { clients, file }
}

// ── 보고 이력 ────────────────────────────────────────────────────────────

async function fetchReports() {
  const site = (env('REPORTS_SITE') || DEFAULT_SITE).replace(/\/$/, '')
  const token = env('REPORTS_API_TOKEN')
  if (!token) {
    die(
      '.env.local 에 REPORTS_API_TOKEN 이 없습니다.',
      'docs/reports-token-setup.md 를 보고 넣어주세요.'
    )
  }
  const res = await fetch(site + '/api/admin/reports', {
    headers: { Authorization: 'Bearer ' + token },
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch (e) {
    die(`서버가 JSON 이 아닌 응답을 보냈습니다 (HTTP ${res.status})`, text.slice(0, 200))
  }
  if (res.status === 401) {
    die('인증 실패 — 토큰이 다릅니다.', 'Vercel 값과 .env.local 값이 같은지 확인하세요.')
  }
  if (!json.ok) die(json.error || `보고서 목록을 못 가져왔습니다 (HTTP ${res.status})`)
  return json.reports || []
}

/** 업체별 마지막 '공개' 보고일. 임시저장은 보낸 게 아니므로 세지 않는다. */
function lastReportByClient(reports) {
  const map = new Map()
  for (const r of reports) {
    if (r.status !== 'published') continue
    const key = normName(r.clientName)
    const day = ymd(new Date(r.publishedAt || r.createdAt))
    const prev = map.get(key)
    if (!prev || day > prev.date) map.set(key, { date: day, title: r.title, code: r.code })
  }
  return map
}

// ── 계산 ─────────────────────────────────────────────────────────────────

function analyze(today, clients, lastMap) {
  const isWeeklyDay = dow(today) === WEEKLY_DOW

  return clients.map((c) => {
    const last = lastMap.get(c.key) || null
    const since = last ? diffDays(today, last.date) : null

    // 재계약일 — 이번 달 것이 이미 지났으면 다음 달을 본다
    let renewal = null
    let dday = null
    if (c.renewalDay) {
      renewal = renewalOn(today, c.renewalDay, 0)
      if (diffDays(renewal, today) < 0) renewal = renewalOn(today, c.renewalDay, 1)
      dday = diffDays(renewal, today)
    }

    const reasons = []
    if (dday === RENEWAL_LEAD) {
      reasons.push({
        kind: 'renewal',
        text: `재계약 ${label(renewal)} D-${RENEWAL_LEAD} — 재계약 문자와 같이 나간다`,
      })
    }
    if (isWeeklyDay && (since === null || since >= 7)) {
      reasons.push({
        kind: 'weekly',
        text: since === null ? '주간 보고 — 첫 보고' : `주간 보고 — 마지막 보고 ${since}일 전`,
      })
    }
    if (!isWeeklyDay && since !== null && since >= OVERDUE_DAYS) {
      reasons.push({ kind: 'overdue', text: `보고가 밀렸다 — 마지막 보고 ${since}일 전` })
    }
    // '한 번도 안 보냈다' 는 급한 일로 올리지 않는다.
    // 이 시스템이 새것이라 대부분이 여기 해당하는데, 매일 20줄씩 뜨면 아무도 안 읽는다.
    // 월요일이 되면 위 주간 규칙에 자연히 걸리므로, 평일에는 맨 아래 한 줄로만 센다.

    return { ...c, last, since, renewal, dday, reasons }
  })
}

// ── 출력 ─────────────────────────────────────────────────────────────────

function pad(s, n) {
  // 한글은 두 칸으로 세어야 터미널에서 줄이 맞는다
  let w = 0
  for (const ch of String(s)) w += /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\uFF00-\uFF60]/.test(ch) ? 2 : 1
  return String(s) + ' '.repeat(Math.max(0, n - w))
}

/** 재계약이 걸린 곳 먼저, 그다음 돈 많이 내는 곳 순. 월요일에 24건이 뜨므로 순서가 곧 우선순위다. */
function byPriority(a, b) {
  const ar = a.reasons.some((x) => x.kind === 'renewal') ? 0 : 1
  const br = b.reasons.some((x) => x.kind === 'renewal') ? 0 : 1
  if (ar !== br) return ar - br
  return b.fee - a.fee
}

function printHuman(today, rows, showAll, contractsFile) {
  const due = rows.filter((r) => r.reasons.length > 0).sort(byPriority)
  const renewalSoon = rows
    .filter((r) => r.dday !== null && r.dday > RENEWAL_LEAD && r.dday <= 14)
    .sort((a, b) => a.dday - b.dday)
  const never = rows.filter((r) => r.since === null && r.reasons.length === 0)

  console.log('')
  console.log(`  보고 시점 점검 — ${label(today)}`)
  console.log(`  대상 ${rows.length}곳 · 오늘 써야 할 곳 ${due.length}곳`)
  console.log('')

  if (due.length === 0) {
    console.log('  오늘 나가야 할 보고는 없습니다.')
  } else {
    for (const r of due) {
      const kinds = r.reasons.map((x) => x.kind)
      const tag = kinds.includes('renewal')
        ? '[재계약]'
        : kinds.includes('overdue')
          ? '[밀림]  '
          : '[주간]  '
      console.log(`  ${tag} ${pad(r.name, 26)}`)
      for (const reason of r.reasons) console.log(`           ${reason.text}`)
      if (r.last) console.log(`           지난 보고: ${label(r.last.date)} · ${r.last.title}`)
      if (r.note) console.log(`           대장 메모: ${r.note.replace(/\*\*/g, '').slice(0, 76)}`)
      console.log('')
    }
    console.log('  쓰려면 — 클로드에게 "<업체명> 보고서 써줘" 라고 하시면 됩니다.')
    console.log('')
  }

  if (renewalSoon.length > 0) {
    console.log('  다가오는 재계약 (D-14 이내)')
    for (const r of renewalSoon) {
      console.log(`    D-${pad(r.dday, 3)} ${pad(r.name, 26)} ${label(r.renewal)}`)
    }
    console.log('')
  }

  if (never.length > 0) {
    console.log(`  아직 첫 웹 보고 전 ${never.length}곳 — 다음 월요일에 주간 대상으로 올라옵니다`)
    console.log('    ' + never.map((r) => r.name).join(' · '))
    console.log('')
  }

  if (showAll) {
    console.log('  전체 상태')
    for (const r of rows.slice().sort((a, b) => (b.since ?? 9999) - (a.since ?? 9999))) {
      const s = r.since === null ? '보고 없음' : `${r.since}일 전`
      console.log(`    ${pad(r.name, 26)} ${pad(s, 12)} ${r.renewal ? '재계약 ' + r.renewal : ''}`)
    }
    console.log('')
  }

  console.log(`  업체 명단 출처: ${contractsFile}`)
  console.log('')
}

// ── 실행 ─────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const asJson = args.includes('--json')
  const showAll = args.includes('--all')
  const di = args.indexOf('--date')
  const today = di >= 0 && args[di + 1] ? args[di + 1] : ymd(new Date())

  if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) die(`날짜 형식이 잘못됐습니다: ${today}`, '예: --date 2026-08-24')

  const { clients, file } = readContracts()
  const reports = await fetchReports()
  const rows = analyze(today, clients, lastReportByClient(reports))

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          today,
          weekday: WD[dow(today)],
          total: rows.length,
          due: rows
            .filter((r) => r.reasons.length > 0)
            .map((r) => ({
              name: r.name,
              kinds: r.reasons.map((x) => x.kind),
              reasons: r.reasons.map((x) => x.text),
              lastReport: r.last ? r.last.date : null,
              daysSince: r.since,
              renewal: r.renewal,
              dday: r.dday,
            })),
          renewalSoon: rows
            .filter((r) => r.dday !== null && r.dday <= 14)
            .sort((a, b) => a.dday - b.dday)
            .map((r) => ({ name: r.name, renewal: r.renewal, dday: r.dday })),
        },
        null,
        2
      )
    )
    return
  }

  printHuman(today, rows, showAll, file)
}

main().catch((e) => die(String((e && e.message) || e)))
