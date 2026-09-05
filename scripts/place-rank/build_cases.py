# -*- coding: utf-8 -*-
"""
플레이스 순위 포트폴리오 생성기 — 홈페이지 쪽 정본

무엇을 하나
  세영의 성과대장(E:\\하랑\\순위모니터\\성과대장.tsv)을 읽어
  content/place-rank-cases.json 을 다시 쓴다. 순위모니터는 읽기만 한다.

왜 여기 있나 (2026-09-04 (금) 대표 지시)
  세영의 홈페이지사례추출.py 는 `최고` 순위를 밖으로 내보낸다.
  한 번 1위를 찍었다가 지금 12위인 곳도 `1위` 로 실린다.
  대표 지시는 그 반대다 — 현재 몇위인지 체크하고 순위가 높아지지 않았다면 제외.
  그래서 이 생성기는 최고가 아니라 최신 스냅샷의 오늘 순위를 싣는다.

  추출기를 고치지 않고 새로 만든 이유는 소유자가 다르기 때문이다 (C-48 · 수정은 소유자).
  세영의 파일은 성과를 감지해 대장에 올리는 일까지, 이 파일은 그 대장을 화면 문구로 바꾸는 일까지다.

무엇을 후보로 삼나 (2026-09-05 (토) 대표 지시)
  대표 지시 원문 : 저거 말고도 상승한 내역이 겁나게 많은데 왜 저런것만 4개만 보여줘
  성과대장은 29행(중복 제거 25)인데 애드랭크가 재고 있는 키워드는 61개다.
  대장은 세영이 성과를 감지했을 때 적는 장부라 계측 전체를 담지 않는다.
  그래서 후보를 스냅샷에서 뽑고, 대장에 있는 건은 대장의 시작값을 쓴다.

  스냅샷의 시작 · 시작일은 30일 롤링이다 (게시판정.tsv 의 W-0027 판정에 적혀 있다).
  대장 밖 건의 카드는 계약 시작이 아니라 최근 30일 남짓의 구간을 말한다 —
  우리 기간을 짧게 말하는 쪽이라 부풀리는 방향이 아니다.

무엇을 앞에 두나 (2026-09-05 (토) 대표 지시)
  대표 지시 원문 : 상가청소 보다는 검색량이 높은 입주청소나, 청소업체 이런 키워드들 위주로
  지금까지는 시작 순위가 낮았던 순서였다. 100위에서 올라온 것이 앞에 섰는데
  그 키워드를 한 달에 400명이 찾으면 사장님에게 큰 숫자가 아니다.
  content/keyword-volume.tsv 의 실측 검색량을 붙여 그 순서로 싣는다.

가리는 규칙 (2026-09-04 (금) 대표 지시)
  상호를 아예 쓰지 않는다 — 00카페 · 00고깃집 처럼 업종만 남긴다.
  지역명도 쓰지 않는다 — 00동 맛집 · 00시 상가청소 처럼 행정단위만 남긴다.
  한 매장이 키워드를 여럿 가지면 각각 별도 작품으로 싣는다 (대표 지시 · 겹쳐도 추가).
  계측 도구 표기는 애드랭크까지다.

안 싣는 것
  미확인 계약 — 우리가 관리한 건지 확인되지 않았다 (C-42 · 틀린 값이 빈 값보다 나쁘다)
  게시불가 판정 — 검수자가 뺀 건 (게시판정.tsv)
  보고 제외 명단 — exclude.tsv
  현재 순위가 시작보다 떨어진 건 — 대표 지시
    2026-09-05 (토) 에 기준이 바뀌었다. 그 전에는 같은 순위(유지중)도 뺐는데
    대표 지시가 유지중인것들도 싹다 이다. 이제 하락만 뺀다
  병 · 의원 — 진우 검수 전까지 화면에 오르지 않는다 (C-50 · D-0177)
    대표가 피부과 · 치과도 올리라고 했으나(2026-09-05 (토)) 게이트는 준수가 못 연다.
    진우 검수 한 줄이 오면 MEDICAL 을 비우는 것이 아니라 게시판정.tsv 에 통과가 적힌다

쓰는 법
  python scripts/place-rank/build_cases.py          # 계산만 하고 보고서를 찍는다
  python scripts/place-rank/build_cases.py --write  # content/place-rank-cases.json 을 다시 쓴다
"""
import collections
import datetime
import json
import pathlib
import sys

MON = pathlib.Path("E:/하랑/순위모니터")
REPO = pathlib.Path(__file__).resolve().parents[2]
OUT = REPO / "content" / "place-rank-cases.json"
# 실제 키워드가 적혀 있어 저장소에 커밋하지 않는다 (.gitignore · .local 규칙)
MASK = REPO / "content" / "place-rank-mask.local.tsv"
# 이쪽은 지역명이 없어 커밋한다 — 키워드 유형별 월 검색수
VOL = REPO / "content" / "keyword-volume.tsv"

WRITE = "--write" in sys.argv


def rows(path):
    """머리글이 있는 TSV — 주석(#)과 빈 줄은 걷어낸다"""
    with open(path, encoding="utf-8-sig") as f:
        head = None
        for line in f:
            line = line.rstrip("\r\n")
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            cells = line.split("\t")
            if head is None:
                head = cells
                continue
            yield dict(zip(head, cells + [""] * (len(head) - len(cells))))


def plain(path, n):
    """머리글이 없는 TSV — n칸까지 맞춰 돌려준다"""
    with open(path, encoding="utf-8-sig") as f:
        for line in f:
            line = line.rstrip("\r\n")
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            cells = line.split("\t")
            yield (cells + [""] * n)[:n]


# ---------- 1. 대장 ----------
# 같은 매장·키워드가 두 벌 올라와 있다 — 한 건을 애드랭크와 루메인이 각각 잡은 것이다.
# 그대로 두면 같은 성과가 포트폴리오에 두 장으로 실린다. 대표가 별도의 작품 이라고 한 것은
# 키워드가 다른 경우이고, 이것은 키워드까지 같다.
#
# 애드랭크 행을 남긴다. 화면에 애드랭크를 적으므로 표기와 근거를 맞추는 것이고,
# 큰 숫자를 골라 남기는 것이 아니다 — 실제로 어느 꽃집은 다른 도구 113위 쪽이 더 크지만
# 애드랭크 83위 쪽을 남긴다.
_all = list(rows(MON / "성과대장.tsv"))
_pick = {}
for _w in _all:
    _key = (_w["매장"], _w["키워드"])
    _prev = _pick.get(_key)
    if _prev is None or (_w["출처"] == "애드랭크" and _prev["출처"] != "애드랭크"):
        _pick[_key] = _w
wins = [_w for _w in _all if _pick.get((_w["매장"], _w["키워드"])) is _w]
dropped_dup = [_w for _w in _all if _pick.get((_w["매장"], _w["키워드"])) is not _w]

# ---------- 2. 계약 구분 ----------
# 미확인은 막는다. 대표 지시의 조건이 우리가 관리하던거면 이고,
# 미확인은 관리했는지 자체를 모른다 (C-42).
#
# 대대행도 막는다 (2026-09-04 (금) 판정 · 한 번 열었다가 되돌렸다).
#   가림 처리를 하면 상호가 안 보이니 대대행을 열어도 되겠다고 잠깐 생각했는데,
#   계약구분.tsv 의 규칙은 대표 확인(2026-08-30 (일))이고 자사 채널·포트폴리오로 안 간다 고
#   적혀 있다. 대표가 확인한 규칙을 실무 판단으로 뒤집지 않는다 — 뒤집을 일이면 결재로 올린다.
#   막는 이유가 하나 더 있다: 대대행 두 건(경성갈비 · 엉터리네)은 애드랭크에 아예 없고
#   루메인에만 있다. 실으면 화면의 애드랭크 기준 이라는 문장이 거짓이 된다.
DEAL_OK = {"직계약", "자사"}
deal = {}
for store, kind, prime, why in plain(MON / "계약구분.tsv", 4):
    deal[store] = {"kind": kind, "prime": prime, "why": why}

# ---------- 3. 업종 ----------
industry = {}
for store, ind, label, why in plain(MON / "업종매핑.tsv", 4):
    industry[store] = ind

# ---------- 4. 빼는 것 ----------
excl = collections.defaultdict(set)
for store, kw, why in plain(MON / "exclude.tsv", 3):
    excl[store].add(kw)

verdict = {}
for wid, v, who, why in plain(MON / "게시판정.tsv", 4):
    verdict[wid] = (v, who, why)

# ---------- 5. 가림 표기 ----------
mask = {}
for kw, unit, detail, why in plain(MASK, 4):
    mask[kw] = (unit, detail)

# ---------- 6. 스냅샷 — 현재 순위 ----------
SRC = {"애드랭크": MON / "snapshots", "루메인": MON / "snapshots_lumain"}
seen = collections.defaultdict(dict)    # (매장, 키워드) -> {출처: (날짜, 오늘)}
covered = collections.defaultdict(set)  # 출처 -> {(매장, 키워드)}
# 스냅샷에도 시작 · 시작일 칸이 있다. 대장에 없는 키워드도 이걸로 상승 판정이 된다.
# 날짜 표기가 다르다 — 스냅샷은 2026.08.04, 대장은 2026-08-05. 여기서 맞춰 둔다.
snap_start = {}                         # (매장, 키워드) -> (날짜, 시작순위, 시작일)
latest_file = {}
for src, folder in SRC.items():
    files = sorted(folder.glob("*.tsv"))
    latest_file[src] = files[-1].stem if files else None
    for path in files:
        day = path.stem
        for r in rows(path):
            store, kw, today = r.get("매장", ""), r.get("키워드", ""), r.get("오늘", "")
            if not store or not kw or not today.strip().isdigit():
                continue
            covered[src].add((store, kw))
            prev = seen[(store, kw)].get(src)
            if prev is None or day > prev[0]:
                seen[(store, kw)][src] = (day, int(today))
            if src != "애드랭크":
                continue
            s0, d0 = r.get("시작", "").strip(), r.get("시작일", "").strip()
            if not s0.isdigit() or not d0:
                continue
            prev0 = snap_start.get((store, kw))
            if prev0 is None or day > prev0[0]:
                snap_start[(store, kw)] = (day, int(s0), d0.replace(".", "-"))


def current(store, kw):
    """표기용 현재 순위 — 애드랭크가 재고 있으면 애드랭크, 없으면 루메인"""
    got = seen.get((store, kw), {})
    for src in ("애드랭크", "루메인"):
        if src not in got:
            continue
        day, rank = got[src]
        mate = "루메인" if src == "애드랭크" else "애드랭크"
        other = got.get(mate)
        return {
            "src": src,
            "asOf": day,
            "rank": rank,
            "cross": {"src": mate, "asOf": other[0], "rank": other[1]} if other else None,
        }
    return None


# ---------- 6-B. 검색량 ----------
# 가림 표기의 공개세부(맛집 · 청소업체)로 join 한다. 지역이 붙은 실제 키워드로 잡지 않는다 —
# 이 저장소는 공개라 그런 키가 커밋되면 어느 가게인지 좁혀진다.
# 조회일을 손으로 적지 않는다. 적어 둔 날짜는 다음 사람이 안 고친다 —
# 표를 다시 뽑으면 asOf 도 같이 움직여야 화면 숫자와 근거 날짜가 어긋나지 않는다.
volume = {}
volume_asof = ""
for kind, mv, asof in plain(VOL, 3):
    if mv.strip().isdigit():
        volume[kind] = int(mv)
        if asof.strip() > volume_asof:
            volume_asof = asof.strip()


# ---------- 6-C. 후보 ----------
# 대장에 있으면 대장의 시작값(계약 시작)을 쓰고, 없으면 스냅샷의 30일 롤링 시작값을 쓴다.
CAND = {}
for _w in wins:
    if not _w["시작"].strip().isdigit():
        continue
    CAND[(_w["매장"], _w["키워드"])] = {
        "wid": _w["성과ID"], "store": _w["매장"], "kw": _w["키워드"],
        "start": int(_w["시작"]), "startDate": _w["시작일"].replace(".", "-"),
        "best": int(_w["최고"]) if _w["최고"].strip().isdigit() else None,
        "grade": _w["등급"], "origin": "대장",
    }
for _key, (_day, _s0, _d0) in snap_start.items():
    if _key in CAND:
        continue
    CAND[_key] = {
        "wid": None, "store": _key[0], "kw": _key[1],
        "start": _s0, "startDate": _d0,
        "best": None, "grade": "", "origin": "스냅샷",
    }
# 대장 밖 건에 번호를 붙인다. 정렬이 고정이라 다시 돌려도 같은 번호가 나온다.
# 게시판정.tsv 는 W- 번호로만 키를 잡고 있어 진우가 이 번호를 못 부른다 — 세영에게 넘긴 건이다.
_p = 0
for _key in sorted(CAND):
    if CAND[_key]["wid"] is None:
        _p += 1
        CAND[_key]["wid"] = "P-%04d" % _p
cands = [CAND[_key] for _key in sorted(CAND)]


# ---------- 7. 판정 ----------
MEDICAL = {"치과", "피부과", "한의원", "의원", "성형외과", "정형외과"}
passed, held = [], []

for c in cands:
    wid, store, kw = c["wid"], c["store"], c["kw"]
    tag = wid + " " + store + " · " + kw

    d = deal.get(store)
    if d is None or d["kind"] not in DEAL_OK:
        kind = d["kind"] if d else "없음"
        # 막는 이유가 구분마다 다르다. 한 문장으로 뭉치면 대장이 거짓을 적는다 —
        # 대대행은 우리가 올린 순위가 맞고, 그 가게가 우리 고객이 아닌 것이다.
        why = {
            "대대행": "원청(" + (d["prime"] if d else "") + ")의 고객이다 — 순위는 우리가 올렸지만"
                      " 상호 노출 동의를 우리가 받을 위치가 아니다 (대표 확인 2026-08-30)",
            "미확인": "우리가 관리한 건지 확인되지 않았다 (C-42)",
            "없음": "계약구분.tsv 에 없다 — 확인 전까지 미확인과 같이 막는다 (C-42)",
        }.get(kind, "계약구분이 " + kind + " 이다")
        held.append((tag, "계약구분 " + kind + " — " + why))
        continue
    if kw in excl.get(store, ()) or "*" in excl.get(store, ()):
        held.append((tag, "보고 제외 명단 (exclude.tsv)"))
        continue
    if wid in verdict and verdict[wid][0] == "게시불가":
        held.append((tag, verdict[wid][1] + " 게시불가 · " + verdict[wid][2][:40]))
        continue
    ind = industry.get(store)
    if not ind:
        held.append((tag, "업종매핑이 없다 — 상호를 가릴 수 없다 (C-42)"))
        continue
    if kw not in mask:
        held.append((tag, "가림 표기가 없다 — 지역명을 추측하지 않는다 (C-42)"))
        continue

    cur = current(store, kw)
    if cur is None:
        held.append((tag, "스냅샷에 이 키워드가 없다 — 현재 순위를 확인할 수 없다"))
        continue
    # 대표 지시 — 애드랭크 참고했다고만하고 루메인은 표기상으론 안보이게 해줘.
    # 화면에 애드랭크라고 적을 것이므로 애드랭크가 실제로 재고 있는 것만 싣는다.
    # 루메인은 아래 cross 로 교차 확인만 하고 JSON 으로 내보내지 않는다.
    if cur["src"] != "애드랭크":
        held.append((tag, "애드랭크가 이 키워드를 재고 있지 않다 — 루메인만 있다"))
        continue

    start = c["start"]
    if cur["rank"] > start:
        held.append((tag, "현재 " + str(cur["rank"]) + "위로 시작 " + str(start)
                     + "위보다 떨어졌다 (" + cur["asOf"] + " 기준 · 대표 지시)"))
        continue

    unit, detail = mask[kw]
    d0 = datetime.date.fromisoformat(c["startDate"])
    d1 = datetime.date.fromisoformat(cur["asOf"].replace(".", "-"))
    passed.append({
        "id": wid,
        "store": store,  # 내부 확인용 — JSON 으로 나가지 않는다
        "industry": ind,
        "storeLabel": "00" + ind.replace(" ", ""),
        "keywordLabel": ("00" + unit + " " + detail) if unit else ("00 " + detail),
        "from": start,
        "to": cur["rank"],
        # 올라간 건과 지킨 건을 한 칸으로 구분한다. 화면에서 문장이 달라진다 —
        # 3위에서 3위는 올랐다 가 아니라 지키고 있다 이다.
        "trend": "상승" if cur["rank"] < start else "유지",
        "volume": volume.get(detail, 0),
        "keywordType": detail,
        "origin": c["origin"],
        "days": (d1 - d0).days,
        "startDate": c["startDate"],
        "asOf": cur["asOf"],
        "best": c["best"],
        "page1": cur["rank"] <= 5,
        "grade": c["grade"],
        "deal": d["kind"],
        "srcUsed": cur["src"],
        "cross": cur["cross"],
        "medical": ind in MEDICAL,
    })

# ---------- 8. 계측 현황 ----------
# 스냅샷 매장을 그대로 세면 안 된다. 세 가지가 섞여 있다:
#   1) 미확인·대대행 — 우리 고객이라고 말할 수 없다 (C-42)
#   2) 유령 행 — 루메인에 같은 업체가 두 번 등록돼 있다 (계약구분 근거에 적혀 있다)
#   3) 보고 제외 명단 — exclude.tsv
# 세 가지를 걷어낸 수만 화면에 올린다. 부풀린 수를 올리면 나머지 숫자도 못 믿게 된다.
not_target = {s for s, kws in excl.items() if "*" in kws}
GHOST = {s for s, d in deal.items()
         if "유령" in d["why"] or "중복 등록" in d["why"]}


def countable(store):
    d = deal.get(store)
    return (d is not None and d["kind"] in DEAL_OK
            and store not in not_target and store not in GHOST)


live = {src: {(s, k) for (s, k) in covered[src] if countable(s)} for src in SRC}
pairs = live["애드랭크"] | live["루메인"]
now = {}
for pair in pairs:
    got = current(*pair)
    if got:
        now[pair] = got
page1 = {p for p, c in now.items() if c["rank"] <= 5}
monitoring = {
    "stores": len({s for (s, k) in pairs}),
    "keywords": len(pairs),
    "page1Keywords": len(page1),
    "page1Stores": len({s for (s, k) in page1}),
    "asOf": latest_file["애드랭크"],
}
# 스냅샷 회차는 화면에 올리지 않고 여기서만 센다.
# 도구별로 세면 키에 루메인 이 남는다 — 대표 지시가 표기상 안 보이게 다.
snap_count = {src: len(list(folder.glob("*.tsv"))) for src, folder in SRC.items()}

# ---------- 9. 보고서 ----------
print("[후보] %d건 (대장 %d · 스냅샷 %d) → 게시 가능 %d건 · 보류 %d건"
      % (len(cands), sum(1 for c in cands if c["origin"] == "대장"),
         sum(1 for c in cands if c["origin"] == "스냅샷"), len(passed), len(held)))
print("[스냅샷] 애드랭크 최신 " + str(latest_file["애드랭크"])
      + " · 루메인 최신 " + str(latest_file["루메인"]))
print("[스냅샷 회차] " + " · ".join(k + " " + str(v) + "회" for k, v in snap_count.items()))
print("[계측 중] 매장 " + str(monitoring["stores"]) + " · 키워드 " + str(monitoring["keywords"])
      + " · 1~5위 키워드 " + str(monitoring["page1Keywords"])
      + " (매장 " + str(monitoring["page1Stores"]) + ")")
print("")
print("게시 가능 — 현재 순위 기준")
for p in sorted(passed, key=lambda x: x["to"] - x["from"]):
    flag = []
    if p["medical"]:
        flag.append("진우 검수 대기")
    if p["deal"] == "대대행":
        flag.append("대대행")
    if p["srcUsed"] != "애드랭크":
        flag.append("애드랭크 미계측 · 루메인만")
    if p["cross"] and abs(p["cross"]["rank"] - p["to"]) >= 3:
        flag.append("교차 " + p["cross"]["src"] + " " + str(p["cross"]["rank"]) + "위")
    line = ("  " + p["id"] + " " + p["storeLabel"].ljust(12) + " " + p["keywordLabel"].ljust(14)
            + " " + str(p["from"]).rjust(3) + "위 → " + str(p["to"]).rjust(2) + "위 ("
            + str(p["days"]) + "일 · " + p["asOf"] + ") 최고 " + str(p["best"]) + "위 " + p["grade"])
    print(line + ("  [" + " · ".join(flag) + "]" if flag else ""))
print("")
print("보류")
for tag, why in held:
    print("  " + tag + " — " + why)

# ---------- 10. 출력 ----------
live_cases = [p for p in passed if not p["medical"]]
pending = [{"id": p["id"],
            "why": "병 · 의원이라 진우 검수 전에는 화면에 올리지 않는다 (C-50 · D-0177)"}
           for p in passed if p["medical"]]


def public(p):
    """화면으로 나가는 칸만 골라낸다 — store · deal · srcUsed 는 나가지 않는다"""
    return {
        "id": p["id"],
        "industry": p["industry"],
        "storeLabel": p["storeLabel"],
        "keywordLabel": p["keywordLabel"],
        "from": p["from"],
        "to": p["to"],
        "trend": p["trend"],
        "volume": p["volume"],
        "keywordType": p["keywordType"],
        "days": p["days"],
        "startDate": p["startDate"],
        "asOf": p["asOf"],
        "page1": p["page1"],
        "grade": p["grade"],
    }


doc = {
    "generated": datetime.date.today().isoformat(),
    "source": "E:/하랑/순위모니터/성과대장.tsv (세영 · 애드랭크 순위 계측)",
    "note": ("상호와 지역명을 쓰지 않는다. 업종과 행정단위까지만 공개한다 (2026-09-04 (금) 대표 지시). "
             "실리는 순위는 최고 기록이 아니라 최신 스냅샷의 현재 순위다. "
             "올라간 건과 지키고 있는 건을 함께 싣고 떨어진 건만 뺀다 (2026-09-05 (토) 대표 지시). "
             "순서는 키워드 월 검색수가 큰 쪽부터다 — content/keyword-volume.tsv."),
    "volumeAsOf": volume_asof,
    "monitoring": monitoring,
    # 검색량이 큰 키워드가 앞에 선다. 같으면 많이 올라온 쪽이 앞이다.
    "cases": [public(p) for p in sorted(live_cases,
                                        key=lambda x: (-x["volume"], x["to"] - x["from"]))],
    "pendingReview": pending,
}

if WRITE:
    prev = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
    nl = "\r\n" if prev and prev.count("\r\n") > prev.count("\n") / 2 else "\n"
    with open(OUT, "w", encoding="utf-8", newline="") as f:
        f.write(json.dumps(doc, ensure_ascii=False, indent=2).replace("\n", nl) + nl)
    print("")
    print("[기록] " + str(OUT) + " · 카드 " + str(len(doc["cases"]))
          + " · 검수대기 " + str(len(pending)))
else:
    print("")
    print("[계산만 했다] --write 를 붙이면 content/place-rank-cases.json 을 다시 쓴다")
