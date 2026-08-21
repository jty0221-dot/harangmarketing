# SNS 부스트 스토어 — 회원 예치금 + 가상계좌 자동충전 설계

확정 방향 (2026-08-21, 대표 결정)
- 입금 확인: **PG 가상계좌(포트원)** — 입금 즉시 자동 충전
- 충전 구조: **회원 예치금** — 회원가입 후 충전, 잔액으로 주문 (snseyes add-funds 방식)

---

## 1. 왜 DB가 필요한가

지금 주문 대장은 GitHub 비공개 레포의 JSON 파일이다. 이건 "기록"에는 되지만
**돈(잔액)을 다루기엔 위험**하다. 두 주문이 거의 동시에 잔액을 깎으면
파일 방식은 마지막 저장이 앞의 것을 덮어써 잔액이 틀어진다(커밋 충돌·경합).

→ 잔액·거래는 **트랜잭션이 되는 DB**에 둔다. **Vercel Postgres**(대표가 이미 Vercel
사용 중 → 대시보드 Storage 탭에서 생성, 무료 티어, `DATABASE_URL` 자동 주입).

기존 비회원 건별 주문 흐름은 그대로 두고, 회원·예치금·충전만 DB로 새로 얹는다.

## 2. DB 스키마 (초안)

```sql
-- 회원
create table members (
  id            bigserial primary key,
  phone         text unique not null,      -- 로그인 아이디 = 휴대폰
  password_hash text not null,             -- scrypt/bcrypt
  name          text not null,
  balance       bigint not null default 0, -- 예치금 잔액(원). 항상 >= 0
  created_at    timestamptz not null default now(),
  status        text not null default 'active' -- active|blocked
);

-- 잔액 원장 (모든 증감의 진실. balance 는 이 합과 일치해야 한다)
create table ledger (
  id           bigserial primary key,
  member_id    bigint not null references members(id),
  kind         text not null,             -- charge|order|refund|admin_adjust
  amount       bigint not null,           -- +충전/환불, -주문
  balance_after bigint not null,
  ref          text,                      -- 충전ID 또는 주문번호
  memo         text,
  created_at   timestamptz not null default now()
);

-- 충전(가상계좌) — 포트원 결제 1건
create table charges (
  id           bigserial primary key,
  member_id    bigint not null references members(id),
  amount       bigint not null,
  status       text not null default 'pending', -- pending|paid|failed|expired
  pg_provider  text,                       -- 포트원 채널(이니시스 등)
  pg_tx_id     text unique,                -- 포트원 imp_uid / payment_id (멱등키)
  vbank_name   text,                       -- 발급된 가상계좌 은행
  vbank_num    text,                       -- 가상계좌 번호
  vbank_holder text,
  vbank_due    timestamptz,                -- 입금 기한
  created_at   timestamptz not null default now(),
  paid_at      timestamptz
);

-- 주문 — 회원 주문은 여기(잔액 차감). 기존 비회원 주문 대장과 병행.
create table orders (
  no           text primary key,          -- HB260821-XXXX
  member_id    bigint references members(id),
  product      text not null,
  product_name text not null,
  platform     text not null,
  sid          integer not null,
  qty          integer not null,
  unit_price   bigint not null,
  total        bigint not null,
  link         text not null,
  comments     text,
  status       text not null default 'processing', -- 잔액결제라 접수=즉시 진행
  panel_order_id bigint,
  panel_status text,
  start_count  integer,
  remains      integer,
  created_at   timestamptz not null default now(),
  submitted_at timestamptz,
  last_error   text
);
```

핵심 불변식: **members.balance = SUM(ledger.amount) for that member**, 항상 ≥ 0.
모든 증감은 `BEGIN … UPDATE members SET balance = balance ± n WHERE id=? AND balance ± n >= 0 … INSERT ledger … COMMIT` 한 트랜잭션으로. 조건 실패(잔액부족)면 롤백.

## 3. 충전 흐름 (포트원 가상계좌)

1. 회원이 `/sns/charge`에서 금액 입력(예: 50,000원) → "가상계좌 발급"
2. 서버가 포트원에 결제요청 → **회원 전용 가상계좌** 발급 → charges(pending) 저장,
   계좌번호·기한을 회원 화면에 표시
3. 회원이 그 계좌로 입금
4. 포트원이 **웹훅(POST /api/sns/charge/webhook)** 호출
5. 서버가 **포트원 REST로 결제 재조회**(위조 방지) → 금액·상태 확인
6. 멱등 처리(pg_tx_id 중복이면 무시) 후 트랜잭션:
   charges=paid + ledger(charge) + members.balance += amount
7. 회원 화면·카톡으로 "충전 완료" 알림

## 4. 주문 흐름 (잔액 결제)

1. 로그인 회원이 상품·수량·링크 입력 → "잔액으로 주문"
2. 서버 트랜잭션: 잔액 ≥ 금액이면 balance -= total + ledger(order) + orders(생성)
   - 부족하면 즉시 충전 페이지로 안내
3. 결제 성공 → **바로 snseyes 발주**(잔액결제는 입금확인이 필요 없으므로 자동)
   - 단, 파트너(도매) 잔액 부족 시엔 대기 + 대표 알림(기존 로직 재사용)
4. 마이페이지에서 진행률·잔여수량 조회

## 5. API (신설)

```
POST /api/sns/auth/signup      회원가입
POST /api/sns/auth/login       로그인(세션 쿠키)
POST /api/sns/auth/logout
GET  /api/sns/me               내 정보·잔액·최근 원장
POST /api/sns/charge           가상계좌 발급 요청 → 계좌 반환
POST /api/sns/charge/webhook   포트원 입금 통보(공개, 서명·재조회 검증)
POST /api/sns/order            (개편) 로그인 회원 잔액 주문
GET  /api/sns/orders           내 주문 목록
```

어드민(`/admin/sns`)에 회원·충전·잔액 조정·거래내역 탭 추가.

## 6. 화면 (신설/개편)

- `/sns/login`, `/sns/signup` — 회원가입·로그인 (하랑 톤, lucide 아이콘)
- `/sns/charge` — 충전(add-funds): 금액 선택 → 가상계좌 표시 → 입금 대기·완료
- `/sns/me` — 마이페이지: 잔액 크게, 충전/사용 내역, 주문 진행률
- `/sns/order` — 개편: 비로그인은 로그인 유도, 로그인은 잔액 표시+원클릭 결제
- 헤더에 로그인/잔액 표시

## 7. 대표 준비사항 (병렬 진행 — 심사가 병목)

1. **포트원 가입** (admin.portone.io) — 지금 시작. 가장 오래 걸림(1~2주).
   - 결제대행사(PG) 신청: **가상계좌 지원** PG 계약(예: KG이니시스·나이스페이먼츠).
     사업자등록증·정산계좌 필요.
   - 승인 후: REST API Key/Secret, 채널 키, 웹훅 URL 등록.
2. **Vercel Postgres 생성** (5분) — 대시보드 Storage → Postgres → 프로젝트 연결.
   `DATABASE_URL` 자동 생성.

## 8. 구현 단계 (내 작업 — PG 없이도 대부분 선행 가능)

- [x] P1. DB 연결 + 스키마 마이그레이션 + 회원가입/로그인/세션
      `/sns/signup` `/sns/login` `/sns/me` · `/api/sns/auth/*` `/api/sns/me`
- [x] P2. 충전 신청 + 계좌 안내 + **어드민 수동승인**(입금 확인 시 잔액 지급)
      `/sns/charge` · `/admin/sns/charges` · `app/lib/wallet.ts`(원자적 증감) `app/lib/charges.ts`
- [x] P3. 잔액 주문 흐름(원자적 차감 + 자동 발주)
      `app/lib/member-orders.ts` · `/api/sns/order` 회원 분기 · 주문폼 잔액 UI · `/api/sns/orders`
      결제와 주문 생성이 한 트랜잭션. 발주 실패해도 결제는 보존되고 pending 으로 남아 어드민이 재발주.
- [x] P5. 어드민 회원·주문 관리
      `/admin/sns/members` (회원 잔액 조회·수동 지급/차감 · 회원 주문 재발주·상태동기화·취소환불)
      `/api/admin/sns/members` `/api/admin/sns/orders`
- [~] P4. 포트원 연동 — **서버 측 완료, 키 대기**
      완료: `app/lib/portone.ts`(결제 재조회·웹훅 서명검증) ·
            `/api/sns/charge/webhook`(입금 → 금액검증 → 멱등 자동충전 → 카톡 알림) ·
            `approveChargeByPayment()`
      남은 것(PG 승인 후):
        1) Vercel 환경변수 `PORTONE_API_SECRET`, `PORTONE_WEBHOOK_SECRET` 입력
        2) 포트원 콘솔에 웹훅 주소 등록:
           `https://www.harangmarketing.com/api/sns/charge/webhook`
        3) `/sns/charge` 에 가상계좌 발급 버튼 연결 — 승인된 채널(KG이니시스 등)에 맞춰
           `paymentIdForCharge(chargeId)` 를 paymentId 로 써서 발급. 채널 확정 후 작업.
      키가 없으면 웹훅은 조용히 무시하고, 기존 수동승인(P2) 흐름이 그대로 동작한다.

즉 **P1·P2·P3·P5 는 지금 라이브**. P4 는 대표의 PG 심사 승인만 기다린다.
