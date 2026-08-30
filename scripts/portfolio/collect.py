# -*- coding: utf-8 -*-
"""
네이버 블로그 포트폴리오 → 홈페이지 업종별 사례 자동 수집

블로그의 '포트폴리오' 카테고리(8번)는 업종 16개로 갈라지는 인덱스 글이고,
실제 사례는 업종별 하위 카테고리에 글로 쌓여 있다. 그 글들을 긁어와
content/portfolio.json 과 public/portfolio/*.jpg 로 만든다.

    python scripts/portfolio/collect.py            # 전체 수집(이미 받은 이미지는 건너뜀)
    python scripts/portfolio/collect.py --force    # 이미지까지 다시 받기
    python scripts/portfolio/collect.py --limit 3  # 업종당 3건만 (빠른 확인용)

새 사례를 블로그에 올린 뒤 다시 실행하면 그것만 추가된다.
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_JSON = os.path.join(ROOT, "content", "portfolio.json")
IMG_DIR = os.path.join(ROOT, "public", "portfolio")

BLOG_ID = "harangmarketing"
BASE = "https://blog.naver.com"

# 포트폴리오 인덱스 글(223433604348)의 업종 버튼이 가리키는 카테고리 번호
INDUSTRIES = [
    (34, "음식/요리", "food"),
    (36, "카페", "cafe"),
    (25, "병원", "clinic"),
    (29, "미용/뷰티", "beauty"),
    (28, "서비스", "service"),
    (33, "여행/숙박", "travel"),
    (23, "인테리어", "interior"),
    (24, "학원/교육", "academy"),
    (31, "운동/요가", "fitness"),
    (36 + 100, "", ""),  # placeholder 제거용 — 아래에서 걸러진다
    (27, "공공기관", "public"),
    (30, "자동차", "car"),
    (32, "스튜디오", "studio"),
    (17, "분양/부동산", "realestate"),
    (26, "금융/법률", "finance"),
    (35, "애완동물", "pet"),
    (37, "기타", "etc"),
]
INDUSTRIES = [x for x in INDUSTRIES if x[1]]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Referer": f"{BASE}/{BLOG_ID}",
    "Accept-Language": "ko-KR,ko;q=0.9",
}
DELAY = 0.5  # 네이버에 부담 주지 않도록 요청 간 간격


def get(url, headers=None, timeout=30):
    req = urllib.request.Request(url, headers={**HEADERS, **(headers or {})})
    return urllib.request.urlopen(req, timeout=timeout).read()


def list_posts(category_no, limit=None):
    """카테고리의 글 목록. 네이버 응답은 JSON 이지만 pagingHtml 에 잘못된 이스케이프가
    섞여 있어 json.loads 가 깨진다. 필요한 필드만 정규식으로 뽑는다."""
    posts, page = [], 1
    while True:
        url = (
            f"{BASE}/PostTitleListAsync.naver?blogId={BLOG_ID}&viewdate="
            f"&currentPage={page}&categoryNo={category_no}&parentCategoryNo=&countPerPage=30"
        )
        raw = get(url, {"X-Requested-With": "XMLHttpRequest"}).decode("utf-8", "replace")
        total = int((re.search(r'"totalCount"\s*:\s*"?(\d+)"?', raw) or [0, 0])[1])
        for m in re.finditer(
            r'"logNo"\s*:\s*"(\d+)"[\s\S]*?"title"\s*:\s*"([^"]*)"[\s\S]*?"addDate"\s*:\s*"([^"]*)"',
            raw,
        ):
            log_no, title_enc, add_date = m.groups()
            posts.append(
                {
                    "logNo": log_no,
                    "title": urllib.parse.unquote_plus(title_enc),
                    "date": normalize_date(add_date),
                }
            )
            if limit and len(posts) >= limit:
                return posts
        if len(posts) >= total or page > 12:
            return posts
        page += 1
        time.sleep(DELAY)


def normalize_date(s):
    """'2024. 5. 2.' → '2024.05.02'"""
    nums = re.findall(r"\d+", s or "")
    if len(nums) >= 3:
        return f"{int(nums[0]):04d}.{int(nums[1]):02d}.{int(nums[2]):02d}"
    return (s or "").strip()


def strip_tags(html):
    import html as _html

    html = re.sub(r"<(script|style)[\s\S]*?</\1>", " ", html)
    html = re.sub(r"<[^>]+>", " ", html)
    html = _html.unescape(html)  # &#x27; &nbsp; 등 전부 복원
    return re.sub(r"\s+", " ", html).strip()


def is_boilerplate(text):
    """모든 글 앞머리에 붙는 인사말·홍보 문구는 요약으로 쓰지 않는다."""
    t = text.replace(" ", "")
    if t.startswith("안녕하세요"):
        return True
    for k in ("하랑", "제안서", "카카오톡", "문의주세", "상담문의", "010-"):
        if k in t:
            return True
    return False


def fetch_post(log_no):
    """본문에서 대표 이미지와 요약문을 뽑는다."""
    url = (
        f"{BASE}/PostView.naver?blogId={BLOG_ID}&logNo={log_no}"
        f"&redirect=Dlog&widgetTypeCall=true&directAccess=false"
    )
    html = get(url).decode("utf-8", "replace")
    m = re.search(r'<div class="se-main-container">([\s\S]*)', html)
    body = m.group(1) if m else html

    images = []
    for u in re.findall(r'<img[^>]+src="(https://postfiles[^"]+)"', body):
        base = u.split("?")[0]
        if base not in [x.split("?")[0] for x in images]:
            images.append(u)

    # 본문 문단 중 광고·안내 문구가 아닌 첫 문장
    texts = [
        t.strip()
        for t in re.findall(r'<p class="se-text-paragraph[^"]*"[^>]*>([\s\S]*?)</p>', body)
    ]
    excerpt = ""
    for t in texts:
        plain = strip_tags(t)
        if len(plain) >= 25 and not is_boilerplate(plain):
            excerpt = plain[:140]
            break

    return images, excerpt


def save_image(url, dest, force=False):
    """대표 이미지를 내려받아 폭 720px 로 줄여 저장한다. 성공하면 True."""
    if os.path.exists(dest) and not force:
        return True
    try:
        data = get(url + ("&" if "?" in url else "?") + "type=w966", timeout=45)
    except Exception:
        return False
    try:
        from PIL import Image
        import io as _io

        im = Image.open(_io.BytesIO(data)).convert("RGB")
        if im.width > 720:
            im = im.resize((720, round(im.height * 720 / im.width)), Image.LANCZOS)
        im.save(dest, "JPEG", quality=78, optimize=True, progressive=True)
    except Exception:
        with open(dest, "wb") as f:
            f.write(data)
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="이미지까지 다시 받기")
    ap.add_argument("--limit", type=int, default=None, help="업종당 최대 건수")
    args = ap.parse_args()

    os.makedirs(IMG_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)

    out = {"generatedAt": datetime.now().strftime("%Y-%m-%d"), "industries": []}
    total_cases = 0

    for cat_no, name, slug in INDUSTRIES:
        try:
            posts = list_posts(cat_no, args.limit)
        except Exception as e:
            print(f"  {name}: 목록 실패 {e}")
            continue

        cases = []
        for p in posts:
            time.sleep(DELAY)
            try:
                images, excerpt = fetch_post(p["logNo"])
            except Exception as e:
                print(f"    - {p['logNo']} 본문 실패 {e}")
                continue
            image_path = None
            if images:
                fname = f"{slug}-{p['logNo']}.jpg"
                if save_image(images[0], os.path.join(IMG_DIR, fname), args.force):
                    image_path = f"/portfolio/{fname}"
            cases.append(
                {
                    "logNo": p["logNo"],
                    "title": p["title"],
                    "date": p["date"],
                    "url": f"{BASE}/{BLOG_ID}/{p['logNo']}",
                    "image": image_path,
                    "excerpt": excerpt,
                }
            )

        cases.sort(key=lambda c: c["date"], reverse=True)
        out["industries"].append(
            {"slug": slug, "name": name, "categoryNo": cat_no, "count": len(cases), "cases": cases}
        )
        total_cases += len(cases)
        print(f"  {name:10s} {len(cases):3d}건")

    out["industries"].sort(key=lambda x: x["count"], reverse=True)
    out["total"] = total_cases
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f"\n총 {total_cases}건 → {OUT_JSON}")
    print(f"이미지 → {IMG_DIR}")


if __name__ == "__main__":
    sys.exit(main())
