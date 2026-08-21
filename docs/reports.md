# 클라이언트 진행 보고서 (`/r/[code]`)

카카오 알림톡 버튼(작업 완료 보고 · 주간 진행 보고)이 여는 사장님용 페이지.
로그인 없이 링크 하나로 열리고, 검색엔진에는 노출되지 않는다.

## 구성

| 파일 | 역할 |
|---|---|
| `scripts/db/reports-schema.sql` | `reports` 테이블 (1회 실행) |
| `app/lib/reports.ts` | 데이터 계층 · 코드 생성/검증 |
| `app/r/[code]/page.tsx` | 사장님이 보는 공개 페이지 (noindex) |
| `app/api/admin/reports/route.ts` | 목록·저장·삭제 API |
| `app/admin/reports/page.tsx` | 관리자 작성 화면 |
| `app/globals.css` 의 `.report-body` | 본문 HTML 스타일 |

## 켜기

### 1) 테이블 — 할 일 없음

`reports` 테이블은 **첫 사용 시 앱이 스스로 만든다** (`create table if not exists`).
2026-08-21 배포 후 실제로 생성된 것을 확인했다.

`scripts/db/reports-schema.sql` 은 같은 내용의 원본 정의다.
**나중에 컬럼을 바꿀 때는** 이 파일을 고치고 Neon SQL Editor 에서 직접 반영해야 한다
— `if not exists` 는 이미 있는 테이블의 구조를 바꾸지 않는다.

### 2) 환경변수

- `DATABASE_URL` — Vercel 의 Neon 연동이 자동 주입 (이미 있음)
- `ADMIN_SESSION_SECRET` — 관리자 로그인용 (이미 있음)
- `REPORTS_API_TOKEN` — **선택**. 세금계산서 시스템이나 스크립트가 보고서를 자동 등록할 때만 필요.
  설정하지 않으면 관리자 로그인 쿠키로만 API 를 쓸 수 있다(더 안전).

로컬에서 화면을 띄워보려면 `.env.local` 에 `DATABASE_URL` 을 추가해야 한다.
지금 `.env.local` 에는 없어서 로컬에서는 `/r/...` 이 열리지 않는다(운영에서는 정상 동작).

## 배포 확인 (2026-08-21 금)

커밋 `1659803` 배포 후 운영에서 실측한 결과:

| 확인 | 결과 |
|---|---|
| `/r/zzzz` (형식 틀린 코드) | 404 — DB 조회 전에 차단 |
| `/r/abcdefghjkmn` (형식 맞고 없는 보고서) | 404 — DB 연결·테이블 자동생성 정상 |
| 같은 요청 반복 | 1.03s → 0.53s — 테이블이 이미 있어 DDL 재실행 없음 |
| `/admin/reports` | 307 → `/admin/login` (미들웨어 보호) |
| `/api/admin/reports` (인증 없이) | 401 |
| sitemap · rss · llms.txt · robots.txt | `/r/` 노출 0건 |

## 쓰는 순서

1. `/admin/reports` → **새 보고서**
2. 업체명 · 제목 · 기간 · 한 줄 요약을 채운다
3. 지표 변화(순위 7위 → 3위 같은 것)가 있으면 항목 추가. 없으면 비워도 된다

   **지표에는 방향이 분명한 값만 넣는다.** 좋아지면 파랑에 위 화살표, 나빠지면 주황에 아래
   화살표가 자동으로 붙는데, 판정은 라벨 글자로만 한다.
   작아질수록 좋은 값으로 보는 말: `순위 · 단가 · CPC · CPA · 이탈 · 취소 · 노쇼 · 반품`.
   나머지는 커질수록 좋은 값으로 본다.

   **광고비·예산은 지표에 넣지 않는다.** 많이 쓴 게 좋은지 나쁜지는 그때그때 다르다.
   실제로 어메이징 파크 보고서에서 '광고비 21만원 → 23만원' 이 주황으로 떠서,
   본문의 '2만원 더 쓰고 클릭 273회 더 받았다' 와 정반대로 읽혔다. 그런 값은 본문에서 설명한다.
4. 본문에 진행사항 · 남은 작업 · 드리는 말씀을 쓴다. 사진도 붙는다
   → `client-report` 스킬이 만든 문구를 그대로 붙여넣으면 된다
5. 요청사항이 있으면 맨 아래 칸에 (노란 박스로 강조된다)
6. **공개하고 링크 받기** → 화면에 두 값이 나온다
   - `r/xxxxxxxxxxxx` — **알림톡 변수 `보고서링크` 에 넣을 값**
   - `https://www.harangmarketing.com/r/xxxxxxxxxxxx` — 카톡에 직접 붙일 전체 주소
7. 팝빌 알림톡 발송 시 `보고서링크` 변수에 6번의 첫 번째 값을 넣는다

> 알림톡 템플릿의 버튼 링크가 `https://www.harangmarketing.com/#{보고서링크}` 형태라서,
> 변수값이 `r/xxxxxxxxxxxx` 처럼 **경로 전체**여야 한다. 코드만 넣으면 홈 화면으로 간다.

## 안전장치

- **코드**: 12자, 혼동되는 글자(0 O 1 l I) 제외한 31자 알파벳 → 31^12 ≈ 7.9경 가지.
  무작위 대입으로 남의 보고서를 열 수 없다. 형식이 틀린 코드는 DB 를 건드리기 전에 거른다.
- **noindex, nofollow, nocache** — 검색에 잡히면 다른 업체 보고서가 노출되는 사고가 된다.
- **임시저장(draft)** 상태에서는 링크가 있어도 열리지 않는다. 공개해야 열린다.
- **삭제하면 이미 보낸 링크도 죽는다.** 잘못 만든 보고서는 삭제, 내용만 고칠 거면 수정.
- 조회수·최근 열람 시각이 목록에 표시된다 — 사장님이 실제로 열어봤는지 알 수 있다.

## 나중에 이어붙일 것

- 세금계산서 시스템(`E:\하랑\세금계산서`)에서 발행·입금 결과를 보고서로 자동 등록
  → `REPORTS_API_TOKEN` 을 만들고 `POST /api/admin/reports` 에 `Authorization: Bearer <토큰>` 으로 호출
- 팝빌 알림톡 API 연동 시, 보고서 저장 → 알림톡 발송까지 한 번에

---

## "보고서 써줘" 로 자동 등록하기 (2026-08-21 추가)

관리자 화면에 로그인해서 붙여넣지 않아도 된다. Claude 에게 말하면 끝난다.

```
대표님: 소금정원 강화점 이번 주 보고서 써줘
Claude: (client-report 스킬로 본문 작성) → scripts/report.js 로 등록 → r/xxxxxxxxxxxx 전달
```

### 준비 (1회) — 토큰 넣기

`scripts/report.js` 는 관리자 로그인 대신 **토큰**으로 API 를 쓴다.
같은 값이 Vercel 과 로컬 양쪽에 있어야 한다.

1. Vercel → harangmarketing → Settings → Environment Variables → Add
   - Key: `REPORTS_API_TOKEN`
   - Value: 로컬 `.env.local` 의 `REPORTS_API_TOKEN` 값과 **똑같이**
   - Environments: Production (Preview 도 같이 체크해두면 편하다)
2. 저장 후 **재배포** — Vercel 은 환경변수를 추가해도 다시 배포해야 런타임에 반영된다.
   Deployments → 최신 항목 → Redeploy

토큰을 설정하지 않으면 API 는 관리자 로그인 쿠키만 받는다(= 자동 등록 불가, 화면 입력은 그대로 동작).

### 쓰는 법

```bash
cd E:/하랑/harang
node scripts/report.js <보고서.json>          # 공개 상태로 등록
node scripts/report.js <보고서.json> --draft  # 임시저장 (확인용)
node scripts/report.js --list                 # 최근 보고서 목록·조회수
```

JSON 모양과 필드는 `scripts/report.js` 상단 주석에 있다.
`code` 를 넣으면 그 보고서를 **수정**한다 — 이미 보낸 링크를 살린 채 내용만 바꿀 때 쓴다.

### 왜 토큰 방식인가

- 관리자 비밀번호를 스크립트나 대화에 넣지 않기 위해서다. 토큰은 이 용도로만 쓰이고 언제든 바꿀 수 있다.
- 토큰이 새면 보고서 등록만 가능하다. 회원·주문·정산 쪽은 건드리지 못한다.
- 바꾸고 싶으면 Vercel 과 `.env.local` 양쪽 값을 새로 맞추면 된다.
