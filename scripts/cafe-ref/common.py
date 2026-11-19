# -*- coding: utf-8 -*-
"""카페 레퍼런스 수집 파이프라인 공용 모듈.

수집 대상은 윌메이드 카페 배포 게시판이다. (윌메이드 대표 게재 허락 확인됨)
게시글 본문은 [배너] + [키워드 캡처 N개] 가 세로로 이어 붙은 한 장짜리 이미지라,
네이버 초록 N 뱃지를 앵커로 행 경계를 찾아 배너를 제외한 캡처 구간만 잘라낸다.
잘라낸 조각에는 윌메이드 브랜딩이 들어가지 않는다.
"""
import os
import re
import sys
import json
import time
import subprocess
import urllib.request

from PIL import Image

HDR = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0"}

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))


def _board():
    """--board cafe|allinone (기본 cafe). 경로 상수가 import 시점에 정해져야 해서 argv 를 직접 본다."""
    for i, a in enumerate(sys.argv):
        if a == "--board" and i + 1 < len(sys.argv):
            return sys.argv[i + 1]
        if a.startswith("--board="):
            return a.split("=", 1)[1]
    return "cafe"


BOARD = _board()
if BOARD not in ("cafe", "allinone"):
    sys.exit(f"--board 는 cafe 또는 allinone 입니다 (받은 값: {BOARD})")

if BOARD == "cafe":
    BASE = "https://www.willmade.net/cafe/"
    PUBLIC_DIR = "public/cafe-ref"
    WORK = os.path.join(HERE, "work")        # 작업 산출물 (git 에 올리지 않음)
else:
    # 올인원(인플루언서 배포) 게시판. 구조는 카페 게시판과 같고, 데이터는 따로 둔다
    BASE = "https://www.willmade.net/all-in-one/"
    PUBLIC_DIR = "public/influencer-ref"
    WORK = os.path.join(HERE, "work", "allinone")

# 올인원 캡처는 썸네일 속 초록색이 N 뱃지로 잡히고, 뱃지 없는 확대 캡처가 앞 행에 붙어 온다.
# 그래서 뱃지를 왼쪽 끝에서만 찾고 한 행의 높이를 막는다. 카페 게시판은 예전 그대로 둔다.
BADGE_MAX_X = None if BOARD == "cafe" else 80
MAX_ROW_H = None if BOARD == "cafe" else 400
# 올인원 캡처는 서로 너무 닮아 12x12 해시로는 다른 캡처끼리 거리가 0 이 나온다 (2026-11-19 실측).
# 32x32 에서는 다른 캡처 24 이상 · 같은 캡처(팔레트 축소 뒤) 6 이하라 12 로 가른다.
HASH_N = 12 if BOARD == "cafe" else 32

PUBLIC_REF = os.path.join(REPO, *PUBLIC_DIR.split("/"))
TS_FILE = os.path.join(REPO, "app", "lib", "cafe-distribution.ts")
INF_FILE = os.path.join(REPO, "app", "lib", "influencer-ref.json")   # allinone 전용 데이터

PENDING = os.path.join(WORK, "pending")      # 키워드 판독 대기 중인 조각
SHEETS = os.path.join(WORK, "sheets")        # 판독용 대조표
LEDGER = os.path.join(WORK, "ledger.json")   # 이미 훑은 게시글·이미지 기록

# ── 잘라내기 파라미터 ────────────────────────────────────────────────
BANNER_SKIP = 900     # 상단 배너로 보고 무시할 높이
MERGE = 150           # 같은 행에서 중복 검출된 뱃지를 묶을 간격
MIN_ROW_H = 200       # 이보다 짧으면 캡처 한 행으로 보지 않는다
MAX_TAIL = 380        # 마지막 행의 최대 높이
MIN_SRC_W = 900       # 본문 이미지 최소 폭 (배너·로고 걸러내기)
MIN_SRC_H = 1500      # 본문 이미지 최소 높이
HAMMING = 6 if BOARD == "cafe" else 12   # aHash 해밍거리 이 이하면 같은 캡처로 본다
QUANTIZE = 192        # 저장 시 팔레트 색 수 (용량 60% 절감, 육안 차이 없음)


def get(url, binary=False, timeout=120):
    req = urllib.request.Request(url, headers=HDR)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
    return data if binary else data.decode("utf-8", "replace")


def ahash(im, n=HASH_N):
    """평균 해시. 재인코딩·팔레트 축소에도 값이 거의 변하지 않아 중복 판정에 쓴다."""
    g = im.convert("L").resize((n, n), Image.LANCZOS)
    px = list(g.getdata())
    avg = sum(px) / len(px)
    return "".join("1" if p > avg else "0" for p in px)


def hamming(a, b):
    return sum(1 for x, y in zip(a, b) if x != y)


def row_starts(img):
    """네이버 초록 N 뱃지 위치로 캡처 행의 시작 y 목록을 만든다."""
    W, H = img.size
    px = img.load()

    def green(p):
        r, g, b = p
        return g > 150 and r < 90 and 60 < b < 130

    ys = [y for y in range(0, H, 2)
          if sum(1 for x in range(0, BADGE_MAX_X or W, 3) if green(px[x, y])) > 2]
    if not ys:
        return []
    groups, cur = [], [ys[0]]
    for y in ys[1:]:
        if y - cur[-1] <= MERGE:
            cur.append(y)
        else:
            groups.append(cur)
            cur = [y]
    groups.append(cur)
    return [g[0] for g in groups if g[0] > BANNER_SKIP]


def slice_rows(img):
    """본문 이미지를 캡처 행 단위로 잘라 PIL 이미지 목록으로 돌려준다."""
    W, H = img.size
    starts = row_starts(img)
    out = []
    for i, y in enumerate(starts):
        end = starts[i + 1] if i + 1 < len(starts) else min(y + MAX_TAIL, H)
        if MAX_ROW_H:
            end = min(end, y + MAX_ROW_H)
        if end - y < MIN_ROW_H:
            continue
        out.append(img.crop((0, max(0, y - 30), W, end - 20)))
    return out


def list_categories():
    """게시판 카테고리 코드 -> 이름. 게시판이 바뀌어도 따라가도록 매번 긁는다."""
    html = get(BASE)
    found = re.findall(r'category=([A-Za-z0-9]{8,12})[^>]*>\s*([^<]{1,30}?)\s*<', html)
    cats = {}
    for code, name in found:
        name = name.strip()
        if name and code not in cats:
            cats[code] = name
    return cats


def list_posts(code, max_pages=12, sleep=0.5):
    """카테고리의 전체 게시글 idx (최신순)."""
    ids = []
    for p in range(1, max_pages + 1):
        try:
            html = get(f"{BASE}?category={code}&page={p}")
        except Exception:
            break
        found = [i for i in dict.fromkeys(re.findall(r"bmode=view&idx=(\d+)", html))
                 if i not in ids]
        if not found:
            break
        ids += found
        time.sleep(sleep)
    return ids


def post_date(html, today=None):
    """게시글 제목의 「11월17일」 을 YYYY-MM-DD 로. 연도는 제목에 없어 오늘 기준으로 추정한다."""
    m = re.search(r"(\d{1,2})월\s*(\d{1,2})일", html)
    if not m:
        return ""
    today = today or time.localtime()
    mon, day = int(m.group(1)), int(m.group(2))
    year = today.tm_year - (1 if mon > today.tm_mon else 0)
    return f"{year}-{mon:02d}-{day:02d}"


def post_meta(idx):
    """게시글 본문의 (이미지 URL 목록, 게시 날짜)."""
    html = get(f"{BASE}?bmode=view&idx={idx}&t=board")
    urls = list(dict.fromkeys(re.findall(
        r"https?://cdn\.imweb\.me/upload/\S+?\.(?:png|jpg|jpeg)", html)))
    return urls, post_date(html)


def post_images(idx):
    """게시글 본문의 이미지 URL 목록."""
    return post_meta(idx)[0]


# ── 사이트 데이터(cafe-distribution.ts) 읽기/쓰기 ──────────────────────
BLOCK_RE = re.compile(r'\{\s*slug: "([a-z-]+)",(.*?)\n  \},', re.S)


def read_categories():
    """REF_CATEGORIES 의 slug -> {prefix, keywords, kwspan} 을 뽑는다.

    kwspan 은 반드시 '파일 기준' 절대 오프셋이어야 한다.
    블록 본문 기준으로 두면 엉뚱한 위치에 키워드가 끼어든다.
    """
    with open(TS_FILE, encoding="utf-8") as f:
        src = f.read()
    blocks = {}
    for m in BLOCK_RE.finditer(src):
        slug, body = m.group(1), m.group(2)
        pm = re.search(r'imagePrefix: "([^"]+)"', body)
        km = re.search(r"keywords: \[(.*?)\]", body, re.S)
        if not (pm and km):
            continue
        base = m.start(2)
        blocks[slug] = {
            "prefix": pm.group(1).replace("/cafe-ref/", ""),
            "keywords": re.findall(r'"([^"]*)"', km.group(1)),
            "kwspan": (base + km.start(1), base + km.end(1)),
        }
    return src, blocks


def append_keywords(src, blocks, additions):
    """keywords 배열 끝에 키워드를 이어붙인 소스 문자열을 돌려준다.

    뒤쪽 블록부터 고쳐야 앞쪽 블록의 오프셋이 밀리지 않는다.
    """
    out = src
    for slug in sorted(additions, key=lambda s: -blocks[s]["kwspan"][0]):
        items = additions[slug]
        if not items:
            continue
        a, b = blocks[slug]["kwspan"]
        inner = out[a:b].rstrip()
        if not inner.endswith(","):
            inner += ","
        lines = ["      " + " ".join(f'"{k}",' for k in items[j:j + 4])
                 for j in range(0, len(items), 4)]
        out = out[:a] + inner + "\n" + "\n".join(lines) + "\n    " + out[b:]
    return out


# ── git 추적 상태 ────────────────────────────────────────────────────
def _git(*args):
    """repo 안에서 git 을 돌려 stdout 을 돌려준다. 실패하면 None."""
    try:
        r = subprocess.run(
            ("git", "-C", REPO, "-c", "core.quotepath=false") + args,
            capture_output=True, text=True, encoding="utf-8",
        )
    except (OSError, ValueError):
        return None
    return r.stdout if r.returncode == 0 else None


def git_state():
    """캡처 폴더(PUBLIC_DIR)의 git 상태를 (커밋됨, 스테이징됨) 집합으로 돌려준다.

    '디스크에 있다' 와 '배포된다' 는 다르다. Vercel 은 커밋된 것만 받으므로
    파일이 로컬에 있어도 커밋이 빠지면 배포 화면에서만 빈 칸이 된다.
    2026-08-22 배치가 정확히 그렇게 새서 사흘 동안 277칸이 깨져 있었다.

    git 을 쓸 수 없으면 (None, None).
    """
    tree = _git("ls-tree", "-r", "--name-only", "HEAD", PUBLIC_DIR)
    index = _git("ls-files", PUBLIC_DIR)
    if tree is None or index is None:
        return None, None
    names = lambda s: {os.path.basename(x) for x in s.splitlines() if x.strip()}
    return names(tree), names(index)


def load_ledger():
    if os.path.exists(LEDGER):
        with open(LEDGER, encoding="utf-8") as f:
            return json.load(f)
    return {"posts": {}, "hashes": []}


def load_inf():
    """allinone 데이터. [{file, keyword, category, date}] 최신이 앞."""
    if os.path.exists(INF_FILE):
        with open(INF_FILE, encoding="utf-8") as f:
            return json.load(f)
    return []


def save_ledger(led):
    os.makedirs(WORK, exist_ok=True)
    with open(LEDGER, "w", encoding="utf-8") as f:
        json.dump(led, f, ensure_ascii=False, indent=1)
