-- SNS 부스트 스토어 — 회원 예치금 스키마 (Neon Postgres)
-- 반복 실행 안전: 모두 IF NOT EXISTS. 잔액 정합성은 애플리케이션 트랜잭션으로 보장.

-- 회원
create table if not exists members (
  id            bigserial primary key,
  phone         text unique not null,        -- 로그인 아이디 = 휴대폰(숫자만 저장)
  password_hash text not null,               -- scrypt
  name          text not null,
  balance       bigint not null default 0 check (balance >= 0), -- 예치금 잔액(원)
  status        text not null default 'active',                 -- active|blocked
  created_at    timestamptz not null default now()
);

-- 잔액 원장 — 모든 증감의 진실. balance = SUM(ledger.amount) 와 일치해야 한다.
create table if not exists ledger (
  id            bigserial primary key,
  member_id     bigint not null references members(id),
  kind          text not null,               -- charge|order|refund|admin_adjust
  amount        bigint not null,             -- +충전/환불, -주문
  balance_after bigint not null,
  ref           text,                        -- 충전ID 또는 주문번호
  memo          text,
  created_at    timestamptz not null default now()
);
create index if not exists ledger_member_idx on ledger(member_id, created_at desc);

-- 충전(가상계좌) — 포트원 결제 1건
create table if not exists charges (
  id            bigserial primary key,
  member_id     bigint not null references members(id),
  amount        bigint not null,
  status        text not null default 'pending', -- pending|paid|failed|expired
  pg_provider   text,
  pg_tx_id      text unique,                 -- 포트원 결제 식별자(멱등키)
  vbank_name    text,
  vbank_num     text,
  vbank_holder  text,
  vbank_due     timestamptz,
  created_at    timestamptz not null default now(),
  paid_at       timestamptz
);
create index if not exists charges_member_idx on charges(member_id, created_at desc);

-- 주문 — 회원 잔액 결제 주문 (기존 비회원 건별 주문 대장과 병행)
create table if not exists orders (
  no             text primary key,           -- HB260821-XXXX
  member_id      bigint references members(id),
  product        text not null,
  product_name   text not null,
  platform       text not null,
  sid            integer not null,
  qty            integer not null,
  unit_price     bigint not null,
  total          bigint not null,
  link           text not null,
  comments       text,
  status         text not null default 'processing', -- 잔액결제라 접수=즉시 진행
  panel_order_id bigint,
  panel_status   text,
  start_count    integer,
  remains        integer,
  created_at     timestamptz not null default now(),
  submitted_at   timestamptz,
  last_error     text
);
create index if not exists orders_member_idx on orders(member_id, created_at desc);
