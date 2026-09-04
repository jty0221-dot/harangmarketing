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
  RECORDS + 하락 + 1페이지밖 + 정체 = SUMMARY.keywords 가 정확히 맞아야 한다.

쓰는 법
  python scripts/place-rank/rank_records.py
  찍힌 블록을 app/lib/rank-records.ts 의 같은 이름 자리에 그대로 옮긴다.
  TSV 는 저장소 밖(E:\하랑\순위모니터)에 있어 빌드가 읽을 수 없다.
  그래서 옮겨 적기는 남지만, 세는 것은 사람이 하지 않는다.

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

# 화면에 실을 순서를 정하는 표. 저장소 안에 있고 키워드 유형 단위라 지역명이 없다.
# 여기 없는 유형은 0 으로 두고 뒤로 보낸다 — 추정해서 숫자를 만들지 않는다 (C-42).
VOLUME_TSV = str(pathlib.Path(__file__).resolve().parents[2] / "content" / "keyword-volume.tsv")

# 키워드 꼬리 → (공개 표기, 업종). 긴 것부터 본다 — `입주청소` 가 `청소` 보다 먼저 걸려야 한다.
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
    ("디저트카페", "디저트카페", "카페"),
    ("카페", "카페", "카페"),
    ("데이트", "데이트", "카페"),
    ("샤브샤브", "샤브샤브", "음식점"),
    ("맛집", "맛집", "음식점"),
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

    rec, decl, out1, flat = [], [], [], []
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
        if today > start:
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

    print('export const SNAPSHOT_DATE = "%s";\n' % last_date)
    print("export const RECORDS: RankRecord[] = [")
    for ind, label, f, t, d, held in pub:
        print(
            '  { industry: "%s", keyword: "지역 %s 키워드", from: %d, to: %d, days: %d, heldPage1: %s },'
            % (ind, label, f, t, d, "true" if held else "false")
        )
    print("];\n")

    line = lambda rows: " · ".join("지역 %s %d위 → %d위" % (l, f, t) for _, l, f, t, _, _ in rows)
    print(" * 하락 — " + line(decl))
    print(" * 1페이지 밖 — " + line(out1))
    print(
        "\nexport const EXCLUDED_COUNT = { declined: %d, outsidePage1: %d, insufficient: %d };"
        % (len(decl), len(out1), insuf)
    )
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
    print(
        """
export const SUMMARY = {
  stores: %d,
  keywords: %d,
  page1Keywords: %d,
  page1Stores: %d,
  heldAllSnapshots: %d,
  snapshots: %d,
};"""
        % (
            len({r["매장"] for r in last}),
            len(ok),
            len(p1),
            len({r["매장"] for r in p1}),
            held_all,
            len(snaps),
        )
    )

    # 산수 점검 — 네 갈래를 합치면 keywords 와 딱 맞아야 한다. 안 맞으면 갈래가 새고 있다.
    total = len(rec) + len(decl) + len(out1) + len(flat)
    mark = "맞음" if total == len(ok) else "어긋남"
    print(
        "\n// 검산 → %d(상승) + %d(유지) + %d(하락) + %d(1페이지밖) = %d · keywords %d · %s"
        % (len(rec), len(flat), len(decl), len(out1), total, len(ok), mark)
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

    return 0


if __name__ == "__main__":
    sys.exit(main())
