# ChatGPT(OpenAI) 광고 셋팅 실행서

작성 2026-10-02 · 근거는 OpenAI 공식 문서 (각 항목 끝 출처)

## 1. 홈페이지에 이미 들어간 것 (코드)

| 항목 | 위치 | 동작 |
|---|---|---|
| 측정 픽셀 | `app/layout.tsx` head 맨 위 | `NEXT_PUBLIC_OPENAI_PIXEL_ID` 가 있을 때만 심긴다. 없으면 아무것도 안 나간다 |
| 클릭 ID 보관 | 픽셀 SDK 자동 | 랜딩 URL 의 `oppref` 를 `__oppref` 쿠키(30일)에 저장 |
| 유입 경로 저장 | `app/lib/attribution.ts` + `app/components/AttributionTracker.tsx` | UTM·`oppref`·chatgpt.com 리퍼러를 localStorage `harang_attr_v1` 에 30일 보관 |
| 상담 기록에 유입 표시 | `/contact`, `/free-check` → `/api/contact` | `source` 가 `web · chatgpt / cpc / place-check` 처럼 저장. 관리자 문의함에 그대로 보인다 |
| 전환 이벤트 | `app/components/Analytics.tsx` | 신청 저장 성공 시 `lead_created`(OpenAI) + `generate_lead`(GA4). 카카오·전화 클릭은 OpenAI custom `kakao_click`/`phone_click`, GA4 `kakao_click`/`phone_click` |
| 광고 심사 봇 허용 | `app/robots.ts` | `OAI-AdsBot` 명시 허용 (막히면 광고 승인 안 남) |

검증 (2026-10-02, 로컬 dev + 테스트 픽셀 ID): SDK 로드, `__oppref` 쿠키 생성, 유입 저장, 두 폼의 source 전송, `lead_created`·custom 이벤트 호출, robots 반영 확인. 실제 픽셀 ID 로 서버 수신 여부는 광고관리자 이벤트 화면에서 확인해야 한다 (아래 2장 5번).

## 2. 대표님이 직접 할 일 (계정·결제라 대신 못 함)

1. 가입: https://ads.openai.com 에 하랑 ChatGPT 계정으로 로그인. 국가 대한민국, 통화 KRW, 시간대 서울. 셋 다 나중에 못 바꾼다. 광고주 사업자가 한국 소재여야 한다.
2. 결제수단: 사업자 카드 등록. 공식 문서상 후불(일정 금액 도달 또는 월말 청구)이다. 단톡방의 '선불 충전' 이야기와 다르니 화면에 나오는 대로 따른다. 신규 계정은 본인 확인 전까지 한국만 노출될 수 있다.
3. 픽셀 만들기: 광고관리자 > 도구 > 전환(Conversions) > 데이터 소스 > 새 픽셀. 나온 Pixel ID 를 복사.
4. Vercel 에 넣기: Vercel > harang 프로젝트 > Settings > Environment Variables 에 `NEXT_PUBLIC_OPENAI_PIXEL_ID = <복사한 ID>` (Production) 저장 후 Redeploy. 이 코드가 main 에 배포된 뒤여야 한다.
5. 전환 설정: 전환 탭에서 `lead_created` 를 캠페인 최적화 전환으로 지정. 이벤트 화면에 테스트 신청 1건이 찍히는지 본다. `kakao_click`·`phone_click` 은 보조 지표로만 본다 (최적화 목표로 쓰면 허수에 학습된다).
6. 캠페인 만들기: 아래 3장 값으로.

## 3. 캠페인 초안

- 목표: 무료 플레이스 진단 신청
- 예산: 일 25,000원 (최저). 일 예산은 7일 평균이라 하루 최대 2배까지 나갈 수 있다. 2주 돌리고 판단.
- 지역: 대한민국
- 랜딩 URL (공식 권고: 홈보다 구체 페이지):
  `https://www.harangmarketing.com/free-check?utm_source=chatgpt&utm_medium=cpc&utm_campaign=place-check`
  `oppref` 는 OpenAI 가 자동으로 붙인다. 손으로 넣지 않는다.

### 소재 (제목 3~50자 · 본문 100자 이하, 글자수 확인함)

| # | 제목 | 본문 |
|---|---|---|
| A | 내 매장 플레이스 순위, 무료로 진단해 드립니다 (26자) | 경쟁 매장 3곳과 순위·리뷰를 비교해 1영업일 안에 알려드립니다. 진단 비용 0원, 계약 강요 없습니다. (58자) |
| B | 광고비 쓰기 전에 매장 진단부터 받아 보세요 (24자) | 네이버 플레이스, 블로그, 리뷰 중 어디가 막혔는지 대표가 직접 보고 알려드립니다. 상담 무료. (53자) |
| C | 소상공인 마케팅, 작업 내역 전부 공개합니다 (24자) | 게시 URL 전체 전달, 주간 진행 보고서 제공. 카페·음식점·청소업체 사례를 확인하세요. |

문구는 모두 사이트에 이미 있는 사실(무료 진단 3곳 비교·1영업일, 게시 URL 전달, 진행 보고서)만 썼다.
이미지: 640×640 이상 JPEG/PNG/WebP. 파비콘 128×128 이상(사이트 `icon-192.png` 사용 가능).

### 컨텍스트 힌트 (광고그룹 단위, 상황을 구체적으로)

단톡방 후기의 핵심: '급한 일정에 쇼핑백 만드는 업체 알려줘' 처럼 상황을 그대로 넣었을 때 문의 전환이 컸다. 키워드가 아니라 '이런 대화에서 보여 달라' 는 설명이다.

- 네이버 플레이스 순위가 갑자기 떨어져서 원인을 알고 싶은 카페·음식점 사장님
- 동네 장사 시작했는데 네이버에 내 가게가 안 보여서 마케팅 대행사를 찾는 상황
- 마케팅 대행사에 맡겼다가 뭘 했는지 몰라서 작업 내역을 공개하는 업체를 찾는 상황
- 체험단·블로그 리뷰를 늘리고 싶은데 월 50만원 안쪽 예산으로 할 수 있는 곳
- 청소업체·학원 원장이 지역 검색에서 상위에 나오는 방법을 묻는 상황
- 매장 사진 촬영과 네이버 플레이스 세팅을 한 번에 맡길 곳을 찾는 상황

## 4. 운영 전 확인

- 정책: 건강·금융·법률 서비스는 미국 외 지역에서 원칙적 금지. 병원·세무 클라이언트 광고는 대행 불가로 안내. 하랑 자체(마케팅 대행)는 금지 목록에 없지만 최종은 심사가 정한다.
- 노출 대상: 유료 요금제 사용자에게는 광고가 안 뜬다 (단톡 후기). 무료 사용자 대상이라는 전제로 소재를 쓴다.
- 판단 기준: 2주 뒤 관리자 문의함에서 source 에 `chatgpt` 가 붙은 건수 ÷ 광고비. 네이버·메타와 같은 기준(문의 1건 비용)으로 비교한다. 광고관리자 숫자만 보지 않는다.
- 픽셀 디버그: 테스트할 때만 `debug: true` 로 콘솔 확인. 운영 코드에 남기지 않는다.
- 동의: 현재 사이트에 쿠키 동의 배너가 없어 픽셀 consent 는 기본값(true)이다. 개인정보처리방침에 'OpenAI 광고 측정 쿠키(__oppref, __obref)' 항목 추가를 검토한다.

## 출처

- 픽셀·이벤트·oppref·쿠키: https://developers.openai.com/ads/measurement-pixel
- 지원 국가(한국 셀프서비스 가능): https://help.openai.com/en/articles/20001245
- 최저 예산 KRW 25,000 / 7일 평균: https://help.openai.com/en/articles/20001210
- 후불 결제: https://help.openai.com/en/articles/20001216
- 랜딩·OAI-AdsBot: https://help.openai.com/en/articles/20001212
- 광고 정책 v1.6: https://openai.com/policies/ad-policies/
