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

## 9. 이노페이(INNOPAY) 카드결제 직연동 — 2026-08-31 (일)

### 왜 포트원이 아니라 직연동인가

포트원 V2 가 지원하는 PG 목록에 **이노페이가 없다**. 실측한 목록은 토스페이먼츠 · KSNET ·
스마트로 · 나이스정보통신 · KG이니시스 · KG이니시스 일본결제 · 한국결제네트웍스(KPN) · NHN KCP ·
웰컴페이먼츠 · 카카오페이 · 네이버페이 · 토스페이 · 페이팔 · 엑심베이 · 페이레터 · 갤럭시아머니트리 ·
Triple-A · 이지페이(KICC) · 페이먼트월 · 헥토파이낸셜 스무 곳이다.

그래서 이미 만들어 둔 `app/lib/portone.ts` 계통을 이노페이에 재사용할 수 없다. 결제창 호출과
승인 요청을 직접 붙였다. **포트원 경로는 지우지 않고 그대로 뒀다** — 나중에 포트원이 지원하는 PG 로
가더라도 코드를 다시 쓰지 않아도 된다.

### 흐름

1. 회원이 `/sns/charge` 에서 금액을 고르고 카드 결제를 누른다
2. 서버가 충전 건(pending)을 만든다. 이 id 가 주문번호 MOID(`hrgchg<id>`)가 된다
3. 브라우저가 `innopay.goPay()` 로 결제창을 띄운다
4. 카드 인증이 끝나면 이노페이가 `returnUrl` 로 거래번호(TID)를 보낸다. **여기까지는 인증이고 돈은 아직 안 빠진다**
5. 리턴 라우트가 **DB 의 신청 금액으로** 승인 API 를 호출한다 (브라우저가 보낸 금액을 쓰지 않는다)
6. 승인 성공 + 금액 일치일 때만 `charges=paid` · `ledger` · `members.balance` 를 한 트랜잭션으로 올린다
7. 결제창 프레임에서 `/sns/charge` 로 되돌리고 결과를 보여준다

### 만든 것

```
app/lib/innopay.ts                          승인 API 호출 · MOID 변환 · 성공코드 판정 · 필드 추출
app/api/sns/charge/innopay/return/route.ts  결제창 복귀 지점(returnUrl) · 승인 · 잔액 반영
app/api/sns/charge/route.ts                 POST 응답에 구매자 이름·연락처 추가(결제창 입력값)
app/lib/charges.ts                          approveChargeByPayment 에 provider·memo 인자 · getChargeById
app/sns/charge/page.tsx                     결제창 호출 · 복귀 결과 표시
next.config.ts                              리턴 경로만 프레임 허용(전역 SAMEORIGIN 예외)
```

### 대표 준비사항

1. **이노페이 가맹점 계약·심사** — 이게 병목이다. 사업자등록증 · 정산계좌 필요
2. 승인 후 Vercel 환경변수에 값을 넣는다 (**이름만 여기 적는다. 값은 대표가 직접 넣는다**)

   | 이름 | 무엇 | 공개 여부 |
   |---|---|---|
   | `INNOPAY_MID` | 상점아이디 (영문·숫자 10자리) | 서버 전용 |
   | `INNOPAY_MERCHANT_KEY` | 가맹점 서명키 | **서버 전용 · 절대 노출 금지** |
   | `NEXT_PUBLIC_INNOPAY_MID` | 결제창에 넣는 상점아이디 (`INNOPAY_MID` 와 같은 값) | 공개값 |
   | `NEXT_PUBLIC_INNOPAY_TEST` | `1` 이면 화면에 테스트 안내 문구 표시 | 공개값 |

   `NEXT_PUBLIC_INNOPAY_MID` 가 비어 있으면 카드 결제 자리를 아예 그리지 않고
   기존 무통장입금(P2)만 받는다. 지금 상태가 그렇다.

3. 이노페이 가맹점 관리자에 복귀 주소를 등록한다

   ```
   https://www.harangmarketing.com/api/sns/charge/innopay/return
   ```

### 계약 후에 확정할 값 (매뉴얼이 로그인 뒤에 있다)

이노페이 기술 매뉴얼(`/guide/*`)은 전부 가맹점 로그인 뒤에 있어 아래 세 가지를 계약 전에
확정할 수 없다. **코드를 고치지 않고 환경변수만 채우면 되도록 한 곳에 모아 뒀다**
(`app/lib/innopay.ts` 상단).

| 이름 | 무엇 | 기본값 |
|---|---|---|
| `INNOPAY_SUCCESS_CODES` | 승인 성공으로 볼 결과코드 (쉼표로 여러 개) | `0000` |
| `INNOPAY_FIELD_TID` | 복귀 시 오는 거래번호 필드명 후보 | `tid,TID,trxId,authTid` |
| `INNOPAY_FIELD_MOID` | 주문번호 필드명 후보 | `moid,MOID,orderNo,orderNumber` |
| `INNOPAY_FIELD_TOKEN` | 승인 요청에 넣을 인증 토큰 필드명 후보 | `paymentToken,PaymentToken,authToken,token` |
| `INNOPAY_API_BASE` | 승인 API 주소 (스테이징 분리용) | `https://api.innopay.co.kr` |

**모르는 것은 성공으로 보지 않는다.** 성공 코드 목록에 정확히 들어 있을 때만 승인으로 처리하고,
아니면 잔액을 올리지 않는다. 취소·환불 API 규격도 매뉴얼에 있어 아직 붙이지 않았다 —
현재 취소는 어드민 수동 처리(P5)로 간다.

### 지키는 선

- 브라우저가 보낸 금액을 어느 단계에서도 쓰지 않는다. 승인 요청 금액은 언제나 DB 의 신청 금액이다
- 승인 응답 금액이 DB 금액과 다르면 반영하지 않고 사장님께 알린다
- 승인 요청이 네트워크 오류로 끝나면 잔액을 올리지 않는다. 돈은 PG 에 남고 사람이 확인한다
- 같은 요청이 두 번 와도 잔액은 한 번만 오른다 (`pg_tx_id` unique + `status='pending'` 조건부 갱신)
- 프레임 허용은 리턴 경로 한 곳만 푼다. 나머지 페이지는 전역 `SAMEORIGIN` 그대로다
