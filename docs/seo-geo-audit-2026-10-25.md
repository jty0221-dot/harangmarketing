# 하랑마케팅 SEO·GEO 기술 진단 및 협업 계획 (2026-10-25)

> 상태: 진단 및 준비만 완료. 운영 main 브랜치 변경/배포 없음. 민수 팀장 리뷰 후 단계별 적용.

## 검증된 운영 환경
- Vercel project: harangmarketing / Next.js 16.3.3 / Node 24.x
- production GitHub: jty0221-dot/harangmarketing, main
- www.harangmarketing.com, harangmarketing.com 도메인 연결
- app/layout.tsx: metadata, canonical, Google verification, OG, JSON-LD
- app/robots.ts: OAI-SearchBot 등 AI 및 검색 크롤러 규칙
- app/sitemap.ts: 동적 사이트맵
- app/llms.txt/route.ts: 공식 정보 평문 요약
- app/lib/seo.ts: SITE 단일 정본, 500건 이상, 재계약률 97.4%
- app/about/page.tsx: SHOW_PHOTO=false 유지

## 변경 금지 / 사실성 원칙
1. 홈페이지 디자인, 레이아웃, 기존 페이지 문구, 전환 기능은 승인 없이 변경하지 않는다.
2. 누적 500건 이상과 재계약률 97.4%는 임의 수정·삭제하지 않는다.
3. 대표 프로필 사진은 촬영 전까지 기존 비노출 설정 유지.
4. 네이버 공식 근거 없는 순위 알고리즘 가중치(40/35/25 등) 추가 금지. 해당 비율은 확인한 주요 소스에서 발견되지 않았으므로 사용자 발언으로 귀속하지 않는다.
5. SEO/GEO 점수는 OpenAI/Google 공식 점수인 것처럼 표시하지 않는다.
6. 검색 크롤러 허용 ≠ ChatGPT 추천 보장. llms.txt도 자동 인용 보장 없음.

## 적용 전 확인
- 배포된 /robots.txt, /sitemap.xml, /llms.txt 실제 HTTP 상태·응답 본문·캐시·콘텐츠 유형
- Google Search Console/네이버 서치어드바이저의 색인, 제출, 오류, 실적
- 페이지별 title, description, canonical, hreflang, noindex, JSON-LD 중복 및 화면 내용과 일치
- sitemap.ts의 미등록 경로 lastModified=now 문제: 실제 수정일이 없으면 lastModified 생략하도록 변경안 검토
- Vercel 커스텀 도메인 접근 및 AI 봇 WAF/보안 차단 여부
- 모바일 성능, Core Web Vitals, 실제 유입 전환
- 민감한 /admin /api /r 등은 robots 차단만으로 보안이 되지 않으므로 인증·noindex 별도 검증

## 권장 우선순위
P0: 배포 응답 검증, 색인 오류 수정, canonical/robots 충돌 해결.
P1: 실제 사례 출처와 날짜·측정 조건 정합성, 회사·서비스 정보 일관성, 질문형 서비스 FAQ.
P2: AI 추천 노출 실험: 브랜드/비브랜드 질문 분리, 동일 질문 반복, 지역·시간·검색 조건·인용 출처 기록.
P3: 월간 리포트(노출 횟수, 질문별 등장 여부, 경쟁사, 출처, 상담 전환).

## 민수 팀장 협업 절차
1. 이 브랜치의 진단 문서를 검토.
2. 변경 전 파일별 diff와 영향 범위 합의.
3. 별도 기능 브랜치에서 최소 수정, 빌드·테스트.
4. Vercel Preview에서 SEO 응답 검증.
5. 민수 팀장 검토 후 PR 병합·운영 배포.

## 후속 검증 결과 기록
- 체크 날짜, URL, HTTP status, user-agent, indexability, canonical, structured data, 발견 문제, 조치, 검증 결과.
