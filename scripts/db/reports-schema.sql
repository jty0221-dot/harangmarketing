-- 클라이언트 진행 보고서 (Neon Postgres)
-- 카카오 알림톡 버튼 → https://www.harangmarketing.com/r/<code> 로 열리는 읽기 전용 페이지.
-- 반복 실행 안전: 전부 IF NOT EXISTS.

create table if not exists reports (
  code         text primary key,              -- URL 코드. 추측 불가능한 12자 (lib/reports.ts 의 newCode)
  client_id    text,                          -- 세금계산서 시스템 거래처 ID (있으면). 없으면 null
  client_name  text not null,                 -- 화면에 보이는 업체명
  title        text not null,                 -- 예: 2026년 8월 3주차 진행 보고
  period       text,                          -- 예: 2026-08-18 ~ 08-22 (자유 문자열)
  summary      text,                          -- 맨 위 한 줄 요약
  metrics      jsonb not null default '[]',   -- [{label, before, after}] 순위·지표 변화
  body         text not null default '',      -- 본문 HTML (관리자 에디터가 만든 것)
  requests     text,                          -- 사장님께 요청할 것 (별도 강조 박스)
  status       text not null default 'draft', -- draft | published
  view_count   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  published_at timestamptz,
  last_viewed_at timestamptz
);

create index if not exists reports_client_idx on reports(client_name, created_at desc);
create index if not exists reports_created_idx on reports(created_at desc);
