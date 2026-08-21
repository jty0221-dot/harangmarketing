# 디자인 기준 — Wanted Design System (WDS)

새 화면을 만들거나 기존 화면을 다듬을 때 이 문서를 먼저 읽는다.

값은 **`Wanted Design System (Community).fig` 파일에서 직접 뽑았다.** 눈대중이나 기억이 아니다.
(.fig 는 zip → `canvas.fig` → zstd 해제 → Kiwi 바이너리. 색상 192개와 타이포 스펙을 그 안에서 읽었다.)

---

## 1. 두 벌의 토큰이 있다 — 섞지 말 것

| 토큰 | 어디에 |
|---|---|
| `--h-*` | 기존 마케팅 페이지(홈·서비스·블로그·SNS 스토어). 하랑 브랜드 네이비·앰버 |
| `--w-*` | **새로 만들거나 다듬는 화면.** WDS 기준 |

한 화면 안에서 두 벌을 섞으면 회색 톤이 미묘하게 어긋난다(순수 회색 vs 쿨그레이).
화면 단위로 한 쪽을 고른다. 지금 `--w-*` 로 넘어간 화면: **진행 보고서(`/r/[code]`)**.

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
100 #FFFFFF   98 #F4F4F5   96 #EAEBEC   90 #DBDCDF   80 #C2C4C8
70 #AEB0B6    60 #989BA2   50 #878A93   40 #70737C   30 #5A5C63
20 #37383C    17 #333438   10 #212225    0 #000000
```

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
| `/r/[code]` 진행 보고서 | WDS 적용 완료 |
| `/admin/*` | 미적용 — 다음 손볼 때 전환 |
| 홈·서비스·블로그·SNS | `--h-*` 유지. 브랜드 정체성이 걸려 있어 함부로 바꾸지 않는다 |

## 6. 원본 파일

`C:\Users\pc\Downloads\Wanted Design System (Community).fig`
추출한 색상 전체(192개): `C:\Users\pc\AppData\Local\Temp\fig\wds-colors.json` (임시 폴더라 지워질 수 있음)
