# 카페 배포 레퍼런스 자동 수집

`/services/cafe-distribution/reference` 의 업종별 캡처를 늘리는 파이프라인이다.
수집 대상은 윌메이드 카페 배포 게시판이며, 게재 허락을 받고 쓴다.

## 왜 두 단계인가

키워드는 캡처 이미지 안 네이버 검색창에 **그려진 글자**라 코드로 읽을 수 없다.
그래서 네트워크·자르기·중복제거·용량최적화·데이터반영은 전부 자동이고,
**키워드 판독 한 단계만** 사람(또는 Claude)이 한다.

판독을 쉽게 하려고 검색창 띠만 모은 대조표를 자동으로 만들어준다.
한 장에 22줄씩 들어가므로 100장짜리 배치도 대조표 5장이면 다 읽는다.

## 사용법

```bash
# 1) 새 게시글에서 캡처를 긁어온다
npm run refs:collect          # 새 글만 (ledger 기준)
npm run refs:collect -- --full  # 전체 다시 훑기

# 2) work/sheets/sheet_NN.png 를 보고
#    work/pending/keywords.json 의 빈 칸을 채운다
#    검색창이 안 보이는 조각은 "" 로 두면 자동으로 버려진다

# 3) 사이트에 반영한다
npm run refs:apply -- --dry-run   # 어디로 갈지 미리보기
npm run refs:apply                # 실제 반영

# 4) 빌드 확인 → 캡처까지 커밋 → 커밋 후 재검증
npm run build
git add public/cafe-ref app/lib/cafe-distribution.ts scripts/cafe-ref/classify.py
git commit
npm run refs:verify   # 0 이 나와야 배포해도 된다
```

### push 를 하면 자동으로 검사한다

`npm install` 을 한 번 돌리면 `core.hooksPath` 가 `scripts/hooks` 로 붙는다
(`scripts/install-hooks.js` · `npm run hooks:install` 로 따로 돌려도 된다).
그 뒤로는 `git push` 할 때마다 `scripts/hooks/pre-push` 가 위 검증을 돌리고,
커밋 안 된 캡처가 있으면 push 자체를 막는다.

훅을 repo 안에 두는 이유는 `.git/hooks` 가 clone 을 따라오지 않기 때문이다.
급하면 `git push --no-verify` 로 건너뛸 수 있지만, 건너뛴 만큼 화면이 깨진다.

### 4단계에서 `public/cafe-ref` 를 빼먹지 말 것

`apply.py` 는 **캡처(`public/cafe-ref/*.png`)** 와 **데이터(`cafe-distribution.ts`)**
두 곳을 같이 고친다. 둘 중 데이터만 커밋되면 로컬에는 파일이 남아 있어서
`npm run build` 도 통과하고 눈으로 봐도 멀쩡하다. **배포 화면에서만 빈 칸이 된다.**

2026-08-22 배치가 정확히 이렇게 새서 캡처 277장이 사흘 동안 깨진 채로 나가 있었다.
그래서 `refs:verify` 는 '파일이 있나' 가 아니라 **'커밋됐나'** 를 묻는다.

```bash
npm run refs:verify
```

커밋이 빠졌으면 접두어별 범위와 붙여넣을 `git add` 명령을 찍고 **종료코드 1** 로 끝난다.

## 자동으로 처리되는 것

- **중복 제거** — 이미 올라간 캡처와 aHash(12x12, 해밍거리 6)로 대조.
  재인코딩·팔레트 축소를 거쳐도 값이 거의 안 변해서 같은 캡처를 두 번 안 올린다.
- **업종 분류** — 게시판 카테고리가 아니라 키워드 문자열로 판정한다.
  게시글 한 건에 여러 업종이 섞여 올라오기 때문이다
  (뷰티 게시글 안에 점집·썬팅·세탁방 키워드가 함께 있었다).
  규칙은 `classify.py` 에 있고, 위에서부터 먼저 맞는 것을 채택한다.
- **같은 키워드 중복 제거** — 이미 그 업종에 있는 키워드면 캡처째 버린다.
- **용량 최적화** — 팔레트 192색. 장당 80KB → 30KB, 육안 차이 없음.
- **검증** — 키워드 개수와 캡처 파일이 1:1 로 맞는지 확인하고,
  안 맞으면 실패로 끝낸다.

`REF_TOTAL` 이 파생값이라 상세페이지·레퍼런스·서비스목록 본문과
JSON-LD(`numberOfItems`), `llms.txt` 는 손댈 필요 없이 따라온다.

## 분류 규칙 손보기

새 업종 키워드가 엉뚱한 탭으로 가면 `classify.py` 를 고친다.

- `RULES` 는 **순서가 곧 우선순위**다. 장례식장이 병의원으로 가야 하니
  `clinic` 이 맨 위에 있고, `용산강아지카페` 가 맛집으로 새지 않도록
  `pet` 이 `restaurant` 보다 위에 있다.
- 토큰으로 못 가르는 개별 키워드는 `OVERRIDE` 에 완전일치로 박는다
  (`청주중문`=시공 / `중문 갈치조림`=제주 지명 같은 경우).

## 파일

| 파일 | 역할 |
|---|---|
| `common.py` | 게시판 크롤링, 행 자르기, 해시, `cafe-distribution.ts` 읽기/쓰기 |
| `collect.py` | 1단계 — 수집 + 중복제거 + 대조표 생성 |
| `classify.py` | 키워드 → 업종 판정 규칙 |
| `apply.py` | 2단계 — 분류 + 이미지 저장 + 데이터 반영 + 검증 |
| `work/` | 작업 산출물. git 에 올리지 않는다 |
| `work/ledger.json` | 이미 훑은 게시글 기록. 재실행을 빠르게 한다 |

## 주의

`cafe-distribution.ts` 를 고칠 때 `keywords` 배열의 위치는
**파일 기준 절대 오프셋**이어야 한다. 블록 본문 기준으로 잡으면
엉뚱한 곳에 키워드가 끼어들고, 타입 검사는 통과하는데 화면에는
안 나오는 상태가 된다. `common.read_categories()` 가 이미 보정해서 돌려준다.
