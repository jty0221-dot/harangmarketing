# -*- coding: utf-8 -*-
r"""
app/lib/rank-records.ts 본문 생성기 — 손으로 세지 않는다.

왜 이게 있나
  rank-records.ts 는 원래 "최신 TSV 를 열어 손으로 옮겨 적는" 파일이었다.
  그래서 스냅샷이 5회 쌓이고 5일이 지나도록 2026-08-26 에 멈춰 있었고,
  손으로 세는 동안 두 가지가 조용히 틀려 있었다.
    1) 정체(오늘 == 시작)를 하락에 섞어 세고 있었다 → 화면에 「순위가 내려간 것 N건」으로 나간다
    2) heldAllSnapshots 가 "잡힌 회차에서만 1~5위" 를 세고 있었다
       → 화면은 「누적 스냅샷 N회 내내 한 번도 벗어나지 않았다」라고 말한다. 다른 문장이다
  세는 일을 스크립트에 넘기면 이 둘이 산수로 닫힌다.
  RECORDS + 하락 + 1페이지밖 + 정체 + 병·의원 = SUMMARY.keywords 가 정확히 맞아야 한다.

쓰는 법
  python scripts/place-rank/rank_records.py           계산만 한다 (아무것도 안 쓴다)
  python scripts/place-rank/rank_records.py --write   app/lib/rank-records.ts 를 갱신한다

  TSV 는 저장소 밖(E:\하랑\순위모니터)에 있어 빌드가 읽을 수 없다. 그래서 값을 옮겨 심는
  구간이 남는데, 그 구간을 사람이 하면 거기서 멈춘다 — 실제로 08-26 에 5일 멈춰 있었다.
  --write 는 rank-records.ts 의 다섯 자리(SNAPSHOT_DATE · RECORDS · 제외 주석 ·
  EXCLUDED_COUNT · SUMMARY)만 갈아 끼운다. 나머지 줄은 한 글자도 건드리지 않는다.
  검산이 어긋나면 아무것도 쓰지 않고 멈춘다 — 틀린 값이 빈 값보다 나쁘다 (C-42).
  (2026-09-05 (토) 대표 지시 · 최신 날짜 기준으로 계속 체크되게 체계 확립)

지키는 선 (헌장 C-36 · 2026-09-04 (금) 대표 지시)
  · 읽기만 한다. 아무 파일도 쓰지 않는다. 스냅샷은 지우지 않는다
  · 상호와 지역명을 절대 찍지 않는다. 매장명은 키워드 이력을 묶는 딕셔너리 열쇠로만 쓰고
    출력에는 업종과 키워드 유형까지만 나간다 (「00카페」 「00고기집」 식 가림)
  · 업종 사전에 없는 키워드는 짐작해서 붙이지 않고 미분류로 남겨 경고한다.
    틀린 값이 빈 값보다 나쁘다 (C-42)

입력 형식 — E:\하랑\순위모니터\snapshots\YYYY-MM-DD.tsv (탭 구분 · 머리글 있음)
  매장  키워드  기준일  오늘  어제  7일전  시작  시작일  점수  일수  진단
  예)   입주청소<TAB>울산입주청소<TAB>2026.08.31<TAB>5<TAB>5<TAB>4<TAB>2<TAB>2026.07.31<TAB>31.7<TAB>32<TAB>안정
  파일 안 날짜는 점(2026.08.31), 파일 이름은 하이픈(2026-08-31)이다. 기준일은 파일 이름에서 딴다
"""
import collections
import glob
import io
import pathlib
import re
import sys

# 윈도우 기본 콘솔은 cp949 라 한글 · 화살표에서 깨진다. 환경변수 없이도 돌게 여기서 맞춘다.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

SNAP_GLOB = "E:/하랑/순위모니터/snapshots/*.tsv"

# 갱신 대상. 이 파일 기준 두 칸 위가 저장소 뿌리다 (scripts/place-rank/ → harang/).
TS_PATH = pathlib.Path(__file__).resolve().parents[2] / "app" / "lib" / "rank-records.ts"
WRITE = "--write" in sys.argv

# 화면에 실을 순서를 정하는 표. 저장소 안에 있고 키워드 유형 단위라 지역명이 없다.
# 여기 없는 유형은 0 으로 두고 뒤로 보낸다 — 추정해서 숫자를 만들지 않는다 (C-42).
VOLUME_TSV = str(pathlib.Path(__file__).resolve().parents[2] / "content" / "keyword-volume.tsv")

# 키워드 꼬리 → (공개 표기, 업종). 긴 것부터 본다 — `입주청소` 가 `청소` 보다 먼저 걸려야 한다.
# 병·의원은 다른 업종과 규칙이 다르다 — 진우가 통과시킨 것만 화면에 올린다 (C-50 · D-0177).
# 다른 업종은 순위가 오르면 그대로 실리지만, 의료광고는 순위 숫자 자체가
# 병원 명의 광고로 옮겨 붙을 수 있어 의료법 제56조가 걸린다.
#
# 왜 화면에서 지우는 것으로 안 끝나나 — 시작값이 30일 롤링이라 매일 바뀐다.
# 실제로 게시불가 판정을 받은 건이 09-03 에는 하락(3위 → 5위)이라 저절로 빠져 있다가
# 09-05 에는 유지(4위 → 4위)가 되어 화면에 다시 올라왔다.
# 화면에서 손으로 지우면 다음 --write 때 돌아온다. 그래서 게이트를 여기 둔다.
MED = {"치과", "피부과", "의원", "한의원", "성형외과", "안과", "정형외과", "통증의학과"}

# 진우가 게재 가능으로 판정한 (업종, 공개 표기) 짝만 통과시킨다. 상호는 여기에도 적지 않는다.
# 판정 정본 : E:\ud558랑\ubcf8부장\ubcd1의원\uc778계_홈페이지_병의원_2026-09-05.md
# 여기에 줄을 추가하려면 진우 판정이 먼저다. 생각만으로 푸지 않는다.
MED_OK = {("치과", "치과"), ("치과", "역세권 치과")}

KIND = [
    ("입주청소", "입주청소", "입주청소"),
    ("상가청소", "상가청소", "청소"),
    ("사무실청소", "사무실청소", "청소"),
    ("정기청소", "정기청소", "청소"),
    ("병원청소", "병원청소", "청소"),
    ("후드청소", "후드청소", "청소"),
    ("에어컨청소", "에어컨청소", "청소"),
    ("청소업체", "청소업체", "청소"),
    ("청소", "청소", "청소"),
    ("누수탐지", "누수탐지", "누수탐지"),
    ("누수", "누수", "누수탐지"),
    ("디저트카페", "디저트카페", "카페"),
    ("카페", "카페", "카페"),
    ("데이트", "데이트", "카페"),
    ("샤브샤브", "샤브샤브", "음식점"),
    ("맛집", "맛집", "음식점"),
    ("점심", "점심", "음식점"),
    ("회식", "회식", "음식점"),
    ("고기집", "고기집", "음식점"),
    ("고깃집", "고기집", "음식점"),
    ("삼겹살", "삼겹살", "음식점"),
    ("삽겹살", "삼겹살", "음식점"),
    ("소갈비", "소갈비", "음식점"),
    ("갈비", "갈비", "음식점"),
    ("치과", "치과", "치과"),
    ("피부과", "피부과", "피부과"),
    ("꽃집", "꽃집", "꽃집"),
    ("맞춤가발", "맞춤가발", "가발"),
    ("가발", "가발", "가발"),
    ("붙임머리", "붙임머리", "네일"),
    ("속눈썹", "속눈썹", "네일"),
    ("네일샵", "네일", "네일"),
    ("네일", "네일", "네일"),
    ("카센터", "카센터", "카센터"),
    ("미용실", "미용실", "미용실"),
    ("정장", "정장", "정장"),
    ("마사지", "마사지", "마사지"),
]


def kind(kw):
    """키워드에서 지역을 떼고 업종과 공개 표기만 남긴다. 모르면 (None, None)."""
    for suf, label, ind in KIND:
        if kw.endswith(suf):
            # `○○역치과` 처럼 앞이 역 이름이면 역세권으로 갈라 적는다.
            # 같은 매장의 다른 키워드라 한 줄로 묶으면 두 줄이 똑같이 보인다.
            if kw[: len(kw) - len(suf)].endswith("역"):
                label = "역세권 " + label
            return label, ind
    return None, None


def load(path):
    """머리글 한 줄 + 데이터. 열 이름으로 뽑아 쓴다 (열 순서가 바뀌어도 버틴다)."""
    rows, head = [], None
    for line in io.open(path, encoding="utf-8-sig"):
        cells = line.rstrip("\r\n").split("\t")
        if head is None:
            head = cells
            continue
        if len(cells) >= len(head):
            rows.append(dict(zip(head, cells)))
    return rows


def num(v):
    """순위 칸은 비어 있거나 `-` 일 수 있다. 숫자가 아니면 None."""
    v = (v or "").strip()
    return int(v) if re.fullmatch(r"\d+", v) else None


def volumes():
    """키워드 유형 → 월 검색수. 표가 없으면 빈 표로 돌려보내 순서만 예전 기준으로 간다."""
    out = {}
    try:
        with io.open(VOLUME_TSV, encoding="utf-8") as f:
            for ln in f:
                if ln.startswith("#") or not ln.strip():
                    continue
                c = ln.rstrip("\n").split("\t")
                if len(c) >= 2 and num(c[1]) is not None:
                    out[c[0].strip()] = int(c[1])
    except IOError:
        print("[경고] 검색량 표를 못 읽었다: %s" % VOLUME_TSV)
    return out


def vol(vmap, label):
    """`역세권 맛집` 처럼 앞에 붙은 수식은 떼고 유형만 본다."""
    return vmap.get(label.replace("역세권 ", "").strip(), 0)


# rank-records.ts 안에서 갈아 끼울 여섯 자리. 정규식은 각각 딱 한 번만 맞아야 한다.
# 두 번 맞거나 한 번도 못 맞으면 파일 구조가 바뀐 것이라 아무것도 쓰지 않고 멈춘다.
TS_ANCHORS = [
    ("HEADER", r"^ \* 기준 스냅샷: [^\n]*"),
    ("SNAPSHOT_DATE", r'^export const SNAPSHOT_DATE = "[^"]*";'),
    ("RECORDS", r"^export const RECORDS: RankRecord\[\] = \[$.*?^\];"),
    ("EXCLUDED", r"^ \* 하락 — .*?^ \* 데이터 부족 — [^\n]*"),
    ("EXCLUDED_COUNT", r"^export const EXCLUDED_COUNT = \{[^\n]*\};"),
    ("SUMMARY", r"^export const SUMMARY = \{$.*?^\};"),
]


def write_ts(B, mark):
    """계산한 블록을 app/lib/rank-records.ts 에 넣는다. 사람이 옮겨 적던 구간을 없앤다."""
    if mark != "맞음":
        print("\n[중단] 검산이 어긋났다. 갈래가 새는 상태로 화면에 올리지 않는다 (C-42)")
        return 1
    if not TS_PATH.exists():
        print("\n[중단] 갱신 대상이 없다: %s" % TS_PATH)
        return 1

    src = io.open(TS_PATH, encoding="utf-8").read()
    new = src
    for key, pat in TS_ANCHORS:
        hits = len(re.findall(pat, new, flags=re.M | re.S))
        if hits != 1:
            print("\n[중단] %s 자리를 %d개 찾았다 (1개여야 한다). 아무것도 쓰지 않았다" % (key, hits))
            return 1
        # 치환문을 람다로 감싼다. \g 같은 역참조가 원고 안에 있어도 그대로 들어간다.
        new = re.sub(pat, lambda m, v=B[key]: v, new, count=1, flags=re.M | re.S)

    if new == src:
        print("\n// 바뀐 값이 없다. %s 는 그대로 둔다" % TS_PATH.name)
        return 0
    io.open(TS_PATH, "w", encoding="utf-8", newline="\n").write(new)
    print("\n// 갱신함 → %s (여섯 자리)" % TS_PATH)
    return 0


def main():
    paths = sorted(glob.glob(SNAP_GLOB))
    if not paths:
        print("스냅샷이 없다: %s" % SNAP_GLOB)
        return 2

    snaps = [(p[-14:-4], load(p)) for p in paths]  # 파일 이름 YYYY-MM-DD
    last_date, last = snaps[-1]

    # (매장, 키워드) → 회차별 순위. 매장명은 여기서만 쓰고 출력에는 나가지 않는다.
    hist = collections.defaultdict(list)
    for _, rows in snaps:
        for r in rows:
            v = num(r.get("오늘"))
            if v is not None:
                hist[(r["매장"], r["키워드"])].append(v)

    rec, decl, out1, flat, med = [], [], [], [], []
    insuf = 0
    unmatched = set()

    for r in last:
        store, kw = r["매장"], r["키워드"]
        start, today, days = num(r.get("시작")), num(r.get("오늘")), num(r.get("일수"))
        label, ind = kind(kw)
        if label is None:
            unmatched.add(kw)
            continue
        if start is None or today is None:
            insuf += 1  # 계측을 막 시작해 시작값이 없다
            continue
        h = hist[(store, kw)]
        # 전 회차에 빠짐없이 잡히면서 한 번도 1~5위를 벗어나지 않았는가.
        # 잡힌 회차만 보면 11회 중 3회만 나온 키워드도 통과해 버린다.
        held = len(h) == len(snaps) and all(v <= 5 for v in h)
        row = (ind, label, start, today, days or 0, held)

        # 네 갈래다. 순서가 중요하다 — 정체를 하락에 섞으면 화면 숫자가 거짓이 된다.
        # 2026-09-05 (토) 대표 지시로 정체(유지)도 싣는다. 빼는 것은 하락뿐이다.
        # 갈래는 그대로 넷으로 둔다 — 유지를 상승으로 세면 화면이 거짓말을 한다.
        if ind in MED and (ind, label) not in MED_OK:
            med.append(row)         # 병·의원인데 진우 판정이 없다 → 안 싣는다 (맨 앞에 둔다)
        elif today > start:
            decl.append(row)        # 내려갔다 → 안 싣는다
        elif today > 5:
            out1.append(row)        # 올랐지만(혹은 그대로) 1페이지 밖이다 → 안 싣는다
        elif today == start:
            flat.append(row)        # 이미 1~5위였고 그대로다 → 유지로 싣는다
        else:
            rec.append(row)         # 올랐고 1페이지 안이다 → 상승으로 싣는다

    # 순서는 검색량이 정한다 (2026-09-05 (토) 대표 지시).
    # 시작 순위가 낮았던 것을 앞세우면 한 달에 400명 찾는 키워드가 맨 앞에 선다.
    # 같은 검색량이면 계단 수, 그다음 현재 순위 순이다.
    vmap = volumes()
    pub = rec + flat
    pub.sort(key=lambda x: (-vol(vmap, x[1]), -(x[2] - x[3]), x[3]))
    decl.sort(key=lambda x: x[3] - x[2], reverse=True)
    out1.sort(key=lambda x: x[2] - x[3], reverse=True)

    # 아래 블록은 화면으로 그대로 간다. 찍기만 하고 끝내지 않고 B 에 담아 두는 이유는
    # --write 가 이걸 rank-records.ts 의 같은 자리에 넣기 때문이다 (사람이 옮겨 적지 않는다).
    B = {}
    B["HEADER"] = " * 기준 스냅샷: %s (%d회 누적 · %s ~ %s)" % (
        last_date, len(snaps), snaps[0][0], last_date
    )
    B["SNAPSHOT_DATE"] = 'export const SNAPSHOT_DATE = "%s";' % last_date
    B["RECORDS"] = "\n".join(
        ["export const RECORDS: RankRecord[] = ["]
        + [
            '  { industry: "%s", keyword: "지역 %s 키워드", from: %d, to: %d, days: %d, heldPage1: %s },'
            % (ind, label, f, t, d, "true" if held else "false")
            for ind, label, f, t, d, held in pub
        ]
        + ["];"]
    )
    print(B["SNAPSHOT_DATE"] + "\n")
    print(B["RECORDS"] + "\n")

    item = lambda rows: ["지역 %s %d위 → %d위" % (l, f, t) for _, l, f, t, _, _ in rows]

    def wrap(head, rows):
        # 주석 폭을 사람이 맞추지 않는다. 세 건마다 접고 이어지는 줄은 여덟 칸 들여쓴다.
        xs = item(rows)
        if not xs:
            return " * %s — 없음" % head
        parts = [" · ".join(xs[i:i + 3]) for i in range(0, len(xs), 3)]
        return "\n".join(
            (" * %s — " % head if i == 0 else " *        ") + p + (" ·" if i < len(parts) - 1 else "")
            for i, p in enumerate(parts)
        )

    B["EXCLUDED"] = "\n".join([
        wrap("하락", decl),
        wrap("1페이지 밖", out1),
        wrap("병·의원 검수 대기", med),
        " * 데이터 부족 — %d건 (계측 시작 직후라 시작값이 없다)" % insuf,
    ])
    B["EXCLUDED_COUNT"] = (
        "export const EXCLUDED_COUNT = { declined: %d, outsidePage1: %d, "
        "insufficient: %d, pendingReview: %d };"
        % (len(decl), len(out1), insuf, len(med))
    )
    print(B["EXCLUDED"])
    print("\n" + B["EXCLUDED_COUNT"])
    print(
        "// 실은 것 → 상승 %d건 · 유지 %d건 (유지는 RECORDS 안에서 from === to 로 가려낸다)"
        % (len(rec), len(flat))
    )

    ok = [
        r for r in last
        if num(r.get("시작")) is not None and num(r.get("오늘")) is not None and kind(r["키워드"])[0]
    ]
    p1 = [r for r in ok if num(r["오늘"]) <= 5]
    held_all = sum(
        1 for r in p1
        if len(hist[(r["매장"], r["키워드"])]) == len(snaps)
        and all(v <= 5 for v in hist[(r["매장"], r["키워드"])])
    )
    # 주석 안 숫자까지 같이 만든다. 값만 갈아 끼우면 `누적 스냅샷 15회` 가 옛 회차로 남는다.
    B["SUMMARY"] = "\n".join([
        "export const SUMMARY = {",
        "  /** 매일 계측 중인 매장 수 */",
        "  stores: %d," % len({r["매장"] for r in last}),
        "  /** 매일 계측 중인 키워드 수 (시작값이 없는 %d건 제외) */" % insuf,
        "  keywords: %d," % len(ok),
        "  /** 기준일에 1페이지(1~5위)를 지키고 있는 키워드 수 */",
        "  page1Keywords: %d," % len(p1),
        "  /** 기준일에 1페이지를 지키고 있는 매장 수 */",
        "  page1Stores: %d," % len({r["매장"] for r in p1}),
        "  /** 누적 스냅샷 %d회에 빠짐없이 잡히면서 한 번도 1페이지 밖으로 나가지 않은 키워드 수 */"
        % len(snaps),
        "  heldAllSnapshots: %d," % held_all,
        "  /** 누적 스냅샷 회차 */",
        "  snapshots: %d," % len(snaps),
        "};",
    ])
    print("\n" + B["SUMMARY"])

    # 산수 점검 — 네 갈래를 합치면 keywords 와 딱 맞아야 한다. 안 맞으면 갈래가 새고 있다.
    total = len(rec) + len(decl) + len(out1) + len(flat) + len(med)
    mark = "맞음" if total == len(ok) else "어긋남"
    print(
        "\n// 검산 → %d(상승) + %d(유지) + %d(하락) + %d(1페이지밖) + %d(병·의원) = %d · keywords %d · %s"
        % (len(rec), len(flat), len(decl), len(out1), len(med), total, len(ok), mark)
    )

    if rec:
        big = max(rec, key=lambda x: x[2] - x[3])
        fast = min(rec, key=lambda x: x[4])
        print(
            "// BIGGEST_GAIN → %s 업종 · 지역 %s 키워드 · %d위 → %d위 · %d계단 · %d일"
            % (big[0], big[1], big[2], big[3], big[2] - big[3], big[4])
        )
        print("// 가장 빠른 건 → 지역 %s 키워드 %d일" % (fast[1], fast[4]))
        print("// 업종 수 → %d" % len({r[0] for r in rec}))

    if unmatched:
        # 짐작해서 붙이지 않는다. 사전에 없으면 그 줄은 화면에서 통째로 빠진다.
        print("\n[경고] 업종 사전에 없는 키워드 %d개 — KIND 에 꼬리를 추가한다" % len(unmatched))
        for kw in sorted(unmatched):
            print("        %s" % kw)

    if WRITE:
        return write_ts(B, mark)
    print("\n// (계산만 했다. app/lib/rank-records.ts 를 갱신하려면 --write 를 붙인다)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
