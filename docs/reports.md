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

## 켜기 (1회)

### 1) 테이블 만들기

Neon 콘솔(또는 Vercel → Storage → Neon → Open in Neon) 의 SQL Editor 에
`scripts/db/reports-schema.sql` 내용을 붙여넣고 실행한다. 반복 실행해도 안전하다.

### 2) 환경변수

- `DATABASE_URL` — Vercel 의 Neon 연동이 자동 주입 (이미 있음)
- `ADMIN_SESSION_SECRET` — 관리자 로그인용 (이미 있음)
- `REPORTS_API_TOKEN` — **선택**. 세금계산서 시스템이나 스크립트가 보고서를 자동 등록할 때만 필요.
  설정하지 않으면 관리자 로그인 쿠키로만 API 를 쓸 수 있다(더 안전).

로컬에서 화면을 띄워보려면 `.env.local` 에 `DATABASE_URL` 을 추가해야 한다.
지금 `.env.local` 에는 없어서 로컬에서는 `/r/...` 이 열리지 않는다.

## 쓰는 순서

1. `/admin/reports` → **새 보고서**
2. 업체명 · 제목 · 기간 · 한 줄 요약을 채운다
3. 지표 변화(순위 7위 → 3위 같은 것)가 있으면 항목 추가. 없으면 비워도 된다
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
