# ChatGPT(OpenAI) 광고 스크립트

하랑마케팅 ChatGPT 광고 계정(캠페인 '하랑마케팅 캠페인')을 API 로 다루는 스크립트. 문서는 `docs/chatgpt-ads.md`, 그룹 문안은 `docs/chatgpt-ads/광고그룹_세팅표.md`.

## API 키

저장소에 두지 않는다. 아래 순서로 찾는다.

1. 환경변수 `OPENAI_ADS_API_KEY`
2. 환경변수 `OPENAI_ADS_API_KEY_FILE` 가 가리키는 파일
3. 기본 위치 `C:/Users/pc/Downloads/ads-manager-api-key.txt`

키 값은 어떤 스크립트도 출력하지 않는다.

## 실행 (Git Bash)

```bash
cd scripts/chatgpt-ads
export PYTHONIOENCODING=utf-8 MSYS_NO_PATHCONV=1
```

| 스크립트 | 하는 일 | 성격 |
|---|---|---|
| `review_check.py` | 광고별 심사 상태 조회, 바뀐 것 CHANGED 표시 | 읽기 |
| `report_data.py <시작> <끝>` | 기간 성과(노출·클릭·비용·전환) JSON. 끝 날짜 미포함 | 읽기 |
| `upload_images.py` | `docs/chatgpt-ads/ad-*.png` 업로드 → `file_ids.json` | 쓰기 |
| `create_service_groups.py [active\|paused]` | 세팅표대로 광고그룹·광고 생성 → `created.json` (이미 만든 건 건너뜀) | 쓰기, 광고비 발생 |

## 주의

- `ads.py` 는 User-Agent 헤더가 있어야 한다. 없으면 Cloudflare 가 403(1010)으로 막는다.
- Git Bash 에서는 `MSYS_NO_PATHCONV=1` 이 없으면 `/conversions/...` 같은 API 경로가 윈도우 경로로 바뀐다.
- 쓰기 스크립트는 실제 광고 계정을 바꾼다. 대표 승인 후에만 돌린다.
