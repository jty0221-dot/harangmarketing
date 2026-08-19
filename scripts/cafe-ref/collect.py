# -*- coding: utf-8 -*-
"""1단계 — 새 캡처를 긁어와 판독 대기열에 넣는다.

    python scripts/cafe-ref/collect.py            # 새 게시글만 (빠름)
    python scripts/cafe-ref/collect.py --full     # 전체 게시글 다시 훑기

하는 일
  1) 게시판 카테고리·게시글 목록을 긁는다
  2) 본문 이미지를 캡처 행 단위로 잘라낸다
  3) 이미 사이트에 올라간 캡처(public/cafe-ref) 와 해시로 대조해 중복을 버린다
  4) 남은 조각을 work/pending 에 넣고, 검색창 띠만 모은 대조표를 work/sheets 에 만든다
  5) work/pending/keywords.json 에 빈 칸이 생긴다 — 여기를 채우고 apply.py 를 돌린다

키워드는 캡처 안 검색창에 그려진 글자라 코드로 읽을 수 없다.
대조표(sheets/sheet_NN.png)를 보고 keywords.json 을 채우면 나머지는 전부 자동이다.
"""
import io
import os
import sys
import json
import time
import shutil
import argparse

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import (  # noqa: E402
    PUBLIC_REF, WORK, PENDING, SHEETS, HAMMING,
    MIN_SRC_W, MIN_SRC_H, ahash, hamming, slice_rows,
    list_categories, list_posts, post_images, get,
    load_ledger, save_ledger,
)

sys.stdout.reconfigure(encoding="utf-8")

# 대조표: 검색창 영역과 한 장당 행 수
STRIP = (24, 6, 660, 78)
ROW_H = 46
PER_SHEET = 22
LABEL_W = 92


def existing_hashes():
    """이미 사이트에 올라간 캡처들의 해시."""
    out = []
    if not os.path.isdir(PUBLIC_REF):
        return out
    for f in sorted(os.listdir(PUBLIC_REF)):
        if f.endswith(".png"):
            try:
                out.append(ahash(Image.open(os.path.join(PUBLIC_REF, f))))
            except Exception:
                pass
    return out


def build_sheets(files):
    """검색창 띠만 모아 판독용 대조표를 만든다."""
    shutil.rmtree(SHEETS, ignore_errors=True)
    os.makedirs(SHEETS, exist_ok=True)
    n = 0
    for i in range(0, len(files), PER_SHEET):
        chunk = files[i:i + PER_SHEET]
        sh = Image.new("RGB", (LABEL_W + 640, ROW_H * len(chunk) + 8), "white")
        dr = ImageDraw.Draw(sh)
        for r, name in enumerate(chunk):
            im = Image.open(os.path.join(PENDING, name))
            strip = im.crop(STRIP).resize((640, ROW_H - 6), Image.LANCZOS)
            y = r * ROW_H + 4
            sh.paste(strip, (LABEL_W, y))
            dr.text((6, y + ROW_H // 2 - 10), name.replace(".png", ""), fill="black")
            dr.line([(0, y - 2), (sh.width, y - 2)], fill="#cccccc")
        sh.save(os.path.join(SHEETS, f"sheet_{n:02d}.png"))
        n += 1
    return n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--full", action="store_true", help="이미 훑은 게시글도 다시 처리")
    ap.add_argument("--max-pages", type=int, default=12)
    ap.add_argument("--limit", type=int, default=300,
                    help="한 번에 가져올 최대 조각 수. 판독 부담을 감당할 만큼만 끊어 간다")
    ap.add_argument("--category", default="",
                    help="이 문자열이 들어간 카테고리만 (예: 뷰티)")
    args = ap.parse_args()

    os.makedirs(WORK, exist_ok=True)
    shutil.rmtree(PENDING, ignore_errors=True)
    os.makedirs(PENDING, exist_ok=True)

    led = load_ledger()
    seen_posts = set() if args.full else set(led["posts"])
    known = existing_hashes() + (led["hashes"] if not args.full else [])
    print(f"기존 캡처 해시 {len(known)}개 확보")

    cats = list_categories()
    print(f"게시판 카테고리 {len(cats)}개\n")

    fresh, batch_hashes = [], []
    dup_site = dup_batch = 0

    stop = False
    for code, label in cats.items():
        if stop:
            break
        if args.category and args.category not in label:
            continue
        ids = list_posts(code, max_pages=args.max_pages)
        todo = [i for i in ids if i not in seen_posts]
        print(f"{label:20} 전체 {len(ids):3}건 / 새 글 {len(todo):3}건")
        for idx in todo:
            try:
                urls = post_images(idx)
            except Exception as e:
                print(f"    {idx} 본문 실패: {e}")
                continue
            for u in urls:
                try:
                    raw = get(u, binary=True)
                except Exception:
                    continue
                # 디스크를 거치지 않는다 — 임시파일 쓰기가 간헐적으로 실패한다
                try:
                    im = Image.open(io.BytesIO(raw)).convert("RGB")
                except Exception:
                    continue
                if im.width < MIN_SRC_W or im.height < MIN_SRC_H:
                    continue
                for crop in slice_rows(im):
                    h = ahash(crop)
                    if any(hamming(h, k) <= HAMMING for k in known):
                        dup_site += 1
                        continue
                    if any(hamming(h, k) <= HAMMING for k in batch_hashes):
                        dup_batch += 1
                        continue
                    batch_hashes.append(h)
                    name = f"new_{len(fresh) + 1:04d}.png"
                    crop.save(os.path.join(PENDING, name))
                    fresh.append(name)
                    if len(fresh) >= args.limit:
                        break
            # 상한에 걸려 중간에 끊긴 글은 기록하지 않는다 — 다음 실행에서 다시 훑어야 한다
            if len(fresh) >= args.limit:
                print(f"    상한 {args.limit}장 도달 — 여기서 멈춥니다")
                stop = True
                break
            led["posts"][idx] = label
            time.sleep(0.7)

    led["hashes"] = list(dict.fromkeys(led["hashes"] + batch_hashes))
    save_ledger(led)

    print(f"\n중복 버림 — 사이트에 이미 있음 {dup_site}장 / 이번 배치 안 {dup_batch}장")
    print(f"신규 조각 {len(fresh)}장")

    if not fresh:
        print("\n새로 추가할 캡처가 없습니다.")
        return

    sheets = build_sheets(fresh)
    kwfile = os.path.join(PENDING, "keywords.json")
    with open(kwfile, "w", encoding="utf-8") as f:
        json.dump({n.replace(".png", ""): "" for n in fresh}, f,
                  ensure_ascii=False, indent=1)

    print(f"대조표 {sheets}장 -> {SHEETS}")
    print(f"판독표 -> {kwfile}")
    print("\n다음 순서")
    print("  1) work/sheets/sheet_NN.png 를 보고 keywords.json 의 빈 칸을 채운다")
    print('     (검색창이 안 보이는 조각은 빈 문자열 "" 로 두면 자동으로 버려진다)')
    print("  2) python scripts/cafe-ref/apply.py")


if __name__ == "__main__":
    main()
