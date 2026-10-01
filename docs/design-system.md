# 디자인 기준 — Wanted Design System (WDS)

새 화면을 만들거나 기존 화면을 다듬을 때 이 문서를 먼저 읽는다.

값은 **`Wanted Design System (Community).fig` 파일에서 직접 뽑았다.** 눈대중이나 기억이 아니다.
(.fig 는 zip → `canvas.fig` → zstd 해제 → Kiwi 바이너리. 색상 192개와 타이포 스펙을 그 안에서 읽었다.)

---

## 1. 두 벌의 토큰이 있다 — 섞지 말 것

| 토큰 | 어디에 |
|---|---|
| `--h-*` | 기존 마케팅 페이지(홈·서비스·블로그·지역·소개). 이름만 남았고 값은 WDS 단계다 (2026-08-22 절) |
| `--w-*` | **새로 만들거나 다듬는 화면.** WDS 기준 |

2026-08-22 부터 `--h-*` 도 WDS 단계를 가리켜 두 벌을 섞어도 색은 어긋나지 않는다.
그래도 새 화면은 `--w-*` 를 직접 쓴다. 값이 다른 것은 Tailwind 기본 회색(`gray-*`)이다.
`--w-*` 를 직접 쓰는 화면은 5절 표에 있다.

## 2. 색

### 척도 규칙

**숫자가 클수록 밝다. 100 = 흰색, 0 = 검정, 50 = 기준색.**
흔한 `50=중간, 900=진함` 방식과 **반대**다. 헷갈리기 쉬우니 주의.

### 주색

```
--w-blue-50   #0066FF   원티드 시그니처 블루. 버튼·링크·강조
--w-blue-45   #005EEB   hover
--w-blue-40   #0054D1   pressed
--w-blue-99   #F7FBFF   파란 계열 옅은 배경
```

### 중립 — 회색은 Cool Neutral 을 쓴다

순수 회색(`Neutral`)이 아니라 **파랑이 살짝 섞인 Cool Neutral** 이 WDS 의 기본 회색이다.
23단계(`--w-cn-0` ~ `--w-cn-100`)가 들어 있다. 주요 값:

```
100 #FFFFFF   99 #F7F7F8   98 #F4F4F5   97 #EAEBEC   96 #E1E2E4
 95 #DBDCDF   90 #C2C4C8   80 #AEB0B6   70 #989BA2   60 #878A93
 50 #70737C   40 #5A5C63   30 #46474C   25 #37383C   23 #333438
 22 #2E2F33   20 #292A2D   17 #212225   15 #1B1C1E   10 #171719
  7 #141415    5 #0F0F10    0 #000000
```

(전체 23단계와 나머지 13개 패밀리는 `docs/wds-colors.json` 에 있다)

### 상태색

```
--w-positive    #00BF40 (Green/50)
--w-cautionary  #FF9200 (Orange/50)
--w-negative    #FF4242 (Red/50)
```

### 화면에서는 시맨틱 이름만 쓴다

숫자 단계(`--w-cn-17`)를 직접 부르지 않는다. 아래 이름을 쓴다.

| 이름 | 쓰임 |
|---|---|
| `--w-bg` / `--w-bg-alt` | 카드 배경 / 페이지 바탕 |
| `--w-label-strong` | 제목 |
| `--w-label` | 본문 |
| `--w-label-alt` | 보조 설명 |
| `--w-label-assistive` | 더 약한 보조·캡션 |
| `--w-line` / `--w-line-strong` | 옅은 구분선 / 카드 테두리 |
| `--w-fill` / `--w-fill-strong` | 옅은 채움(태그·인용) |
| `--w-primary` / `-strong` / `-heavy` | 기본 / hover / pressed |

> 시맨틱 이름 체계는 WDS 것(Label·Line·Fill·Background·Primary·Status)을 따랐고,
> **어느 단계를 붙일지는 우리가 정했다.** 원본 .fig 의 변수 연결까지는 추출하지 못했다.

## 3. 타이포

`.w-heading1` 처럼 **유틸 클래스로 한 벌씩** 쓴다. 크기만 따로 지정하면 행간·자간이 어긋난다.

| 클래스 | 크기 | 출처 | 쓰임 |
|---|---|---|---|
| `.w-display2` | 56 / 40px | 실측 | 랜딩 대형 헤드라인 |
| `.w-display3` | 32px | 추정 | 문서 제목 |
| `.w-heading1` | 22px | 실측 | 화면 제목 |
| `.w-heading2` | 20px | 실측 | 큰 섹션 |
| `.w-headline1` | 18px | 실측 | 섹션 제목·강조 문장 |
| `.w-headline2` | 17px | 실측 | |
| `.w-body1` | 16px | 추정 | 긴 본문 |
| `.w-body2` | 15px | 추정 | 일반 본문 |
| `.w-label1` | 14px | 추정 | 버튼·입력 라벨 |
| `.w-label2` | 13px | 실측 | 작은 라벨 |
| `.w-caption1` | 12px | 실측 | 캡션 |
| `.w-caption2` | 11px | 실측 | 각주 |

**실측**은 .fig 스펙 시트에 px 라벨이 있던 값이다.
**추정**은 라벨이 없어 스케일 순서로 채운 값이다(빈 자리 32·16·15·14 가 순서대로 들어맞는다).
정확히 맞춰야 하면 Figma 에서 해당 텍스트 스타일을 열어 확인하면 된다.

### 자간

한글은 음수 자간이 필수다. `.fig` 전반에 **-1.309%** 가 쓰인다 → `--w-tracking: -0.01309em`.
유틸 클래스에 이미 들어 있다.

### 폰트

원본은 **Pretendard JP** 와 **Wanted Sans**. 우리 사이트는 이미 **Pretendard** 를 쓰므로 그대로 둔다.
(Wanted Sans 는 원티드 전용 서체라 우리가 쓸 이유가 없다.)

## 4. 컴포넌트 이름 — .fig 에 있던 것

새 UI 를 만들 때 이 이름과 상태 구성을 참고한다.

```
Button (Size=Large/Medium/Small/Tiny, Disable=True/False)
Icon Button · Text Button · Action Button · Leading/Trailing Button
Chip · Badge · Push Badge · Content Badge
Textinput/Textfield · Textinput/Textarea
Card · Card/List Card
Tab · Modal · Tooltip · Divider · GNB
상태: Normal · Hovered · Pressed · Disabled
```

크기를 `Large/Medium/Small/Tiny` 네 단계로 나누고 각 컴포넌트가 `Disable` 를 갖는 게 WDS 방식이다.

## 5. 적용 상태

| 화면 | 상태 |
|---|---|
| `/r/[code]` 진행 보고서 · SNS 회원 화면 · `/preview/wds` | `--w-*` 직접 사용 |
| 홈·서비스·블로그·지역·소개 | `--h-*` 이름 그대로, 값은 WDS 블루 (2026-08-22 통일 · 아래 절) |
| `/admin/*` | 미적용. 다음 손볼 때 전환 |

## 6. 원본 파일

`C:\Users\pc\Downloads\Wanted Design System (Community).fig`
추출한 색상 전체(192개): `C:\Users\pc\AppData\Local\Temp\fig\wds-colors.json` (임시 폴더라 지워질 수 있음)

## 7. 파일 나눔 — 색은 한 곳, 컴포넌트는 다른 곳

처음엔 두 갈래 작업이 각각 토큰을 만들어 이름이 겹쳤으나 **정리됐다.**

| 파일 | 역할 | 로드 |
|---|---|---|
| `app/globals.css` | **정본.** 색 램프(`--w-cn-*`·`--w-blue-*` 등 .fig 실측값) · 시맨틱 · 타이포 · shadow · radius | 전역 |
| `app/wds.css` | 그 위에 얹는 **컴포넌트 클래스만** (카드·버튼·입력·칩). 색을 다시 정의하지 않는다 | `/sns/*`, `/preview/*` |

**새 색이 필요하면 `globals.css` 에 추가한다.** `wds.css` 에서 색을 다시 선언하면
두 벌이 갈라져 회색 톤이 어긋난다.

## 8. 보고서 화면이 참고 사례다

`/r/[code]` (`app/r/[code]/page.tsx`) 가 WDS 를 처음부터 끝까지 적용한 화면이다.
새 화면을 짤 때 이 파일을 보고 따라가면 된다.

- 색·크기를 Tailwind 클래스(`text-gray-400`)로 쓰지 않고 전부 토큰·유틸로
- 섹션에 `01 02 03` 번호를 붙여 웹페이지가 아니라 문서로 읽히게
- 지표는 좋아지면 `--w-primary`, 나빠지면 `--w-cautionary` (방향은 라벨로 판단)
- 표지는 `--w-blue-20~40` 그라디언트, 요약 카드를 표지에 걸치게 올려 결론부터 보이게

---

## 파일 역할 — 색은 한 곳에서만 정의한다

| 파일 | 역할 |
|---|---|
| `app/globals.css` | **정본.** 색 13패밀리·쿨그레이 23단계·타이포 실측 px·그림자·모서리. 사이트 전역에 로드된다. |
| `app/wds.css` | **컴포넌트 계층만.** `.w-card` `.w-btn` `.w-input` `.w-chip` `.w-field-label` 과 하이픈 표기 타이포 별칭(`.w-title-1` 등). 색을 다시 정의하지 않고 globals 토큰에 연결한다. |
| `app/sns/theme.css` | `app/wds.css` 를 import 만 한다. |

한때 두 파일이 같은 색을 각자 정의해 값이 갈라질 뻔했다(`--w-bg-alt` 등).
**새 색이 필요하면 `globals.css` 에 추가하고, `wds.css` 에서는 별칭만 만든다.**

`wds.css` 가 쓰는 별칭 → globals 매핑:

```
--w-text          → --w-label-strong      --w-border         → --w-cn-96
--w-text-sub      → --w-label-neutral     --w-border-strong  → --w-line-strong
--w-text-muted    → --w-label-alt         --w-bg-sunken      → --w-cn-98
--w-text-assist   → --w-label-assistive   --w-primary-weak   → --w-blue-95
--w-text-disabled → --w-label-disable     --w-primary-weaker → --w-blue-99
--w-danger        → --w-negative          --w-primary-border → --w-blue-90
--w-success       → --w-positive          --w-warning        → --w-cautionary
```

## 적용 현황

- `--w-*` 적용 완료: 진행 보고서(`/r/[code]`), SNS 회원·충전·주문(`/sns/login·signup·me·charge·order`), 디자인 미리보기(`/preview/wds`)
- 미리보기 주소: `/preview/wds` — 팔레트·타이포·컴포넌트·섹션 예시를 한 화면에서 확인 (noindex)

---

## 2026-08-22 — 사이트 전체가 원티드 블루로 통일됐다

대표 결정(A안). 마케팅 페이지도 더 이상 네이비·앰버를 쓰지 않는다.

**방법:** `--h-*` 토큰의 **이름은 그대로 두고 값만** WDS 단계로 바꿨다.
이미 273곳에서 `var(--h-*)` 를 쓰고 있어서, 파일 하나로 전부 따라온다.

```
--h-dark       → var(--w-blue-10)   #001536
--h-navy       → var(--w-blue-20)   #002966
--h-navy-mid   → var(--w-blue-30)   #003E9C
--h-blue       → var(--w-blue-50)   #0066FF   ← 시그니처
--h-blue-light → var(--w-blue-60)   #3385FF
--h-amber      → var(--w-blue-50)   앰버 포인트는 블루로 흡수
--h-bg/surface/border/muted → Cool Neutral 99/98/96/50
```

**함께 정리한 것**
- Tailwind `amber-*` 161곳 → `blue-*` (29개 파일)
- 하드코딩 네이비 hex 5곳, 히어로 오버레이 rgba 16곳, `--hero-*` 토큰

**손대지 않은 것 (의도적)**
- **카카오 노랑** `bg-yellow-400` 71곳 — 카카오 브랜드 색이라 바꾸면 안 된다.
- 블로그 카테고리 태그 색(노랑·초록 등) — 브랜드색이 아니라 분류용이다.

**앞으로 새 화면은** `--w-*` 를 직접 쓴다. `--h-*` 는 기존 화면 호환용으로 남겨둔 것이다.

---

## 2026-09-30 · 화면 규칙 추가 (홈페이지 점검 A급 반영)

대표 지시 「모든 배포 진향결재가 필요한 것 전부 진행」 으로 점검표 A급을 한 번에 반영했다. 새 화면도 이 규칙을 따른다.

**장식**
- 그라데이션 장식을 걷어냈다(소개 3곳 · 문의 1곳). 아이콘 박스는 단색 배경에 흰 아이콘이다.
- 가짜 실시간 표시를 쓰지 않는다. 깜빡이는 점(`animate-pulse`) 2곳과 영업시간 상태 표시를 뺐다.
- 쓰지 않던 부품 4개(ChatWidget · EntryPopup · ReviewsSection · SocialProofToast)를 지웠다.

**눌리는 것**
- 여러 개 중에서 고르는 칩은 `aria-pressed` 로 눌림 상태를 알린다(문의의 업종 · 목표 · 예산).
- 켜고 끄는 단추(사진 자동 넘김 · 첫 화면 영상)는 `aria-pressed` 대신 이름이 바뀐다(멈춤 ↔ 재생).
- 터치 영역은 44px 이상이다. 칩과 글자 단추는 `min-h-11`, 아이콘 단추는 `h-11 min-w-11`.

**창과 팝업**
- 팝업은 Escape 로 닫힌다. 한글을 입력하는 중(`isComposing`)에는 닫지 않는다.
- 확대 창은 열 때 닫기 단추로 초점을 옮기고, 닫으면 연 카드로 돌려준다. 열려 있는 동안 Tab 은 창 안에서만 돈다.
- 새 창으로 열리는 링크에는 화면에 안 보이는 「(새 창)」 안내가 붙는다(`globals.css` 의 `a[target="_blank"]::after`). 링크마다 따로 적지 않는다.

**입력**
- 이름 · 상호 · 전화 칸에는 `autoComplete`(name · organization · tel)를, 전화와 숫자 칸에는 `inputMode`(tel · numeric)를 준다.

**사진과 영상**
- 대표 사진이 준비될 때까지 사진 자리를 숨긴다(홈 · 소개의 `SHOW_PHOTO = false`). 빈 자리나 임시 사진을 두지 않는다. 사진이 오면 값만 `true` 로 바꾼다.
- 첫 화면 영상에는 멈춤 단추가 있다. 움직임 줄이기(`prefers-reduced-motion`)를 켠 방문자에게는 자동 재생하지 않고 포스터 한 장만 보인다. 포스터는 `public/hero-v4-poster.jpg` 이고 2026-10-01 연진 최종본으로 바꿨다.
- 공유 카드(`public/og-image.png`)에는 숫자를 넣지 않는다. 화면의 숫자가 바뀌면 카드만 옛 숫자로 남기 때문이다. 2026-10-01 연진 최종본(남색 바탕)으로 바꿨다. 카드를 바꾸면 주소 뒤 `?v=` 날짜도 같이 바꾼다(`layout.tsx` · `app/lib/seo.ts` 의 `OG_IMAGE` · 소개 페이지).

**색 현황 (CI 색 통일 · 2026-10-01)**
- 단추 · 링크 · 모바일 주소창 색(`themeColor`)은 `#0066FF` 다. 초점 테두리도 `--w-primary` 를 쓴다.
- 표식은 세 벌이다. 밝은 바탕은 `public/harang-icon.svg`(기둥과 점 `#0066FF` · 띠 `#69A5FF`), 어두운 바탕은 `public/harang-icon-on-dark.svg`(기둥과 점 흰색 · 띠 `#69A5FF`), 작은 자리처럼 한 덩어리가 나은 곳은 `public/harang-icon-solid.svg`(전부 `#0066FF`)다. `#69A5FF` 는 표식 띠에만 쓴다.
- 헤더는 홈 첫 화면(어두운 영상 위)에서만 흰 표식을 쓰고, 내리거나 메뉴를 열거나 다른 페이지로 가면 파랑 표식을 쓴다.
- 어두운 바탕은 `#001536` 이다. 남색 바탕에 파랑 표식을 올리지 않는다.
- 파비콘은 `public/favicon.svg`(정사각 · 밝은 탭 `#0066FF` · 어두운 탭 `#69A5FF`)와 `favicon.ico`(16 · 32 · 48)다. 글자 묶음은 파비콘과 앱 아이콘에 쓰지 않는다.
- 앱 아이콘(192 · 512 · 마스커블 512 · 애플 180)은 `#001536` 바탕에 흰 표식을 60% 크기로 얹었다. 구조화 데이터 로고는 `public/harang-logo-square.png`(512 정사각 · 흰 바탕)다.
- 색을 CSS 필터(brightness · invert)로 바꾸지 않는다. 바탕에 맞는 파일을 고른다.
- 소개 페이지에 숨겨 둔 CI 안내(`SHOW_CI_GUIDE`)도 세 색으로 맞췄다. CMYK 는 참고값이라 인쇄하거나 안내를 켜기 전에 다시 확인한다.
- 아직 남은 것: `--cd-primary`, 소개 페이지 CI 배경 `#1A56FF` 과 CI 이미지, Tailwind 기본 파랑.

**숫자**
- 회사 연차는 손으로 적지 않고 `companyYear()`(`app/lib/seo.ts`)로 계산한다. 개업일 2020-04-15 기준이다.
