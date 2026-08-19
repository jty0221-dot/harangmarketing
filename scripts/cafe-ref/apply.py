# -*- coding: utf-8 -*-
"""2단계 — 판독한 키워드로 캡처를 사이트에 반영한다.

    python scripts/cafe-ref/apply.py            # 실제 반영
    python scripts/cafe-ref/apply.py --dry-run  # 무엇이 어디로 갈지만 출력

하는 일
  1) work/pending/keywords.json 을 읽는다 (빈 값은 버린다)
  2) 키워드로 업종을 판정한다 (classify.py)
  3) 이미 그 업종에 있는 키워드 / 이번 배치 안 중복은 버린다
  4) 남은 캡처를 public/cafe-ref 에 다음 번호로 저장 (팔레트 축소로 용량 절감)
  5) app/lib/cafe-distribution.ts 의 keywords 배열에 이어붙인다
  6) 키워드 개수와 캡처 파일이 1:1 로 맞는지 검증한다

REF_TOTAL 이 파생값이라 상세페이지·레퍼런스·서비스목록 본문과
JSON-LD, llms.txt 는 손댈 필요 없이 따라온다.
"""
import os
import sys
import json
import argparse
import collections

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import (  # noqa: E402
    PUBLIC_REF, PENDING, TS_FILE, QUANTIZE,
    read_categories, append_keywords,
)
from classify import classify  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")


def verify():
    """키워드 ↔ 캡처 파일 1:1 대응 검증."""
    _, blocks = read_categories()
    referenced, missing = set(), []
    total = 0
    for slug, b in blocks.items():
        total += len(b["keywords"])
        for i in range(len(b["keywords"])):
            name = f"{b['prefix']}{i + 1:02d}.png"
            referenced.add(name)
            if not os.path.exists(os.path.join(PUBLIC_REF, name)):
                missing.append((slug, name))
    on_disk = {f for f in os.listdir(PUBLIC_REF) if f.endswith(".png")}
    orphan = sorted(on_disk - referenced)
    return total, missing, orphan


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    kwfile = os.path.join(PENDING, "keywords.json")
    if not os.path.exists(kwfile):
        print("판독표가 없습니다. 먼저 collect.py 를 돌리세요.")
        return 1

    with open(kwfile, encoding="utf-8") as f:
        raw = json.load(f)

    blank = [k for k, v in raw.items() if not str(v).strip()]
    pending = {k: str(v).strip() for k, v in raw.items() if str(v).strip()}
    print(f"판독표 {len(raw)}건 — 채워진 것 {len(pending)}건 / 빈 칸 {len(blank)}건(버림)")
    if not pending:
        print("채워진 키워드가 없습니다.")
        return 1

    src, blocks = read_categories()
    print(f"현재 업종 {len(blocks)}개 / 키워드 {sum(len(b['keywords']) for b in blocks.values())}개\n")

    additions = collections.defaultdict(list)   # slug -> [keyword]
    files = collections.defaultdict(list)       # slug -> [pending 파일명]
    dup_existing = dup_batch = unknown = 0

    for name in sorted(pending):
        kw = pending[name]
        slug = classify(kw)
        if slug not in blocks:
            print(f"  경고: 알 수 없는 업종 {slug} ({kw})")
            unknown += 1
            continue
        if kw in blocks[slug]["keywords"]:
            dup_existing += 1
            continue
        if kw in additions[slug]:
            dup_batch += 1
            continue
        additions[slug].append(kw)
        files[slug].append(name)

    added = sum(len(v) for v in additions.values())
    print(f"기존과 겹쳐 버림 {dup_existing}건 / 배치 안 중복 {dup_batch}건 / 업종 불명 {unknown}건")
    print(f"실제 추가 {added}건\n")
    if not added:
        return 0

    for slug in sorted(additions, key=lambda s: -len(additions[s])):
        before = len(blocks[slug]["keywords"])
        print(f"  {slug:14} {before:4} -> {before + len(additions[slug]):4}  (+{len(additions[slug])})")

    if args.dry_run:
        print("\n--dry-run 이므로 아무것도 바꾸지 않았습니다.")
        return 0

    # 이미지 저장
    for slug, names in files.items():
        prefix = blocks[slug]["prefix"]
        start = len(blocks[slug]["keywords"])
        for i, name in enumerate(names):
            im = Image.open(os.path.join(PENDING, f"{name}.png")).convert("RGB")
            dst = os.path.join(PUBLIC_REF, f"{prefix}{start + i + 1:02d}.png")
            im.quantize(colors=QUANTIZE, method=Image.MEDIANCUT).save(dst, optimize=True)

    # 데이터 파일 갱신
    with open(TS_FILE, "w", encoding="utf-8", newline="") as f:
        f.write(append_keywords(src, blocks, additions))

    total, missing, orphan = verify()
    print(f"\n키워드 {total}개")
    print(f"  없는 캡처 {len(missing)}개 {missing[:5]}")
    print(f"  안 쓰이는 캡처 {len(orphan)}개 {orphan[:5]}")
    if missing or orphan:
        print("\n검증 실패 — git checkout 으로 되돌리고 원인을 확인하세요.")
        return 1

    print("\n반영 완료. npm run build 로 확인 후 커밋하세요.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
