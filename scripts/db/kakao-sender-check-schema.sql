-- 카톡 예약 발송 · 서버 정품 확인 (1.13.0 · 향후 방향 4) (Neon Postgres)
-- 설계 정본: E:\하랑\본부장\카톡예약\서버확인_설계_1.13.0.md 4장
-- 근거: 대표 지시 2026-10-08 (목) H-1169 · D-0632
-- 실행은 대표 결재 뒤 (설계 6장 3). 반복 실행 안전: 전부 IF NOT EXISTS.
--
-- 저장하는 것은 기기 코드 · 키 지문(정품키 SHA-256 앞 32자) · 버전 · 체험 사용 수뿐이다.
-- 방 이름 · 메시지 · 연락처 · 카톡 계정 · IP 는 넣지 않는다.

-- 기기별 체험 사용 수 · 마지막 확인
create table if not exists ks_devices (
  machine     text primary key,                      -- license.machine_id() · XXXX-XXXX-XXXX
  first_seen  timestamptz not null default now(),
  last_seen   timestamptz not null default now(),
  version     text,                                  -- 마지막으로 알린 앱 버전
  trial_used  integer not null default 0 check (trial_used >= 0), -- greatest 로만 올린다 (줄어들지 않는다)
  key_hash    text,                                  -- 마지막으로 본 키 지문 · 정품키 없으면 null
  checks      integer not null default 0             -- 확인 횟수
);
create index if not exists ks_devices_key_idx on ks_devices(key_hash);

-- 해지된 정품키 (환불 · 유출)
create table if not exists ks_revoked (
  key_hash    text primary key,                      -- 정품키 SHA-256 앞 32자
  revoked_at  timestamptz not null default now(),
  memo        text                                   -- 사유만. 손님 이름 · 연락처를 넣지 않는다
);
