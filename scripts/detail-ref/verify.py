# -*- coding: utf-8 -*-
"""상세페이지 레퍼런스 — 데이터 · 이미지 · git 3자 대응 검증.

    python scripts/detail-ref/verify.py

카페 배포(scripts/cafe-ref/apply.py --verify)와 같은 것을 막는다.
app/lib/detail-page-reference.ts 만 커밋되고 public/detail-ref 이미지가 빠지면
로컬에는 파일이 남아 있어 npm run build 도 눈으로 보는 확인도 전부 통과하고
배포 화면에서만 빈 칸이 된다. 08/22 배치 277장 · 08/25 배치 245장이 그렇게 샜다.

카페 쪽 apply.py 를 재사용하지 않는 이유는 데이터 모양이 다르기 때문이다.
카페는 번호 접두어(prefix + 일련번호)로 파일을 찾고, 여기는 slug 로 찾는다.
그리고 여기는 한 건에 썸네일과 전체보기 두 장이 걸린다.
"""
import os
import re
import sys
import subprocess

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA = os.path.join(ROOT, "app", "lib", "detail-page-reference.ts")
PUBLIC = os.path.join(ROOT, "public", "detail-ref")
REL = "public/detail-ref"


def works():
    """데이터가 가리키는 (slug, 분할장수) 를 문서 순서대로 돌려준다.

    REF_TABS 의 '전체' 탭은 slug 가 all 이고 이미지가 없으므로 제외한다 —
    작업물 행만 title 을 같이 갖는다는 점으로 가른다.

    parts 가 빈 배열이면 full/<slug>.jpg 한 장, 아니면 full/<slug>-N.jpg 여러 장이다.
    이 장수를 안 세면 -3 만 빠져도 화면 중간이 통째로 비는데 로컬에서는 안 보인다.
    """
    with open(DATA, encoding="utf-8") as f:
        src = f.read()
    out = []
    for m in re.finditer(r'\{ slug: "([a-z0-9-]+)",\s+title:.*?parts: \[([^\]]*)\]', src, re.S):
        raw = m.group(2).strip()
        out.append((m.group(1), len([x for x in raw.split(",") if x.strip()]) if raw else 0))
    return out


def git_tree():
    """HEAD 에 들어 있는 public/detail-ref 파일 경로 집합. git 을 못 쓰면 None."""
    try:
        out = subprocess.run(
            ["git", "ls-tree", "-r", "--name-only", "HEAD", REL],
            cwd=ROOT, capture_output=True, text=True, encoding="utf-8",
        )
    except OSError:
        return None
    if out.returncode != 0:
        return None
    return {line.strip() for line in out.stdout.splitlines() if line.strip()}


def main():
    want = works()
    if not want:
        print("데이터에서 작업물을 한 건도 읽지 못했습니다 — 파일 형식이 바뀐 것 같습니다.")
        return 1

    need = []          # (slug, 상대경로) 있어야 하는 이미지
    for s, nparts in want:
        need.append((s, REL + "/" + s + ".jpg"))
        if nparts:
            for i in range(1, nparts + 1):
                need.append((s, REL + "/full/%s-%d.jpg" % (s, i)))
        else:
            need.append((s, REL + "/full/" + s + ".jpg"))

    missing = [p for _, p in need if not os.path.exists(os.path.join(ROOT, p))]

    on_disk = set()
    for base, _dirs, files in os.walk(PUBLIC):
        for f in files:
            if f.endswith(".jpg"):
                rel = os.path.relpath(os.path.join(base, f), ROOT).replace("\\", "/")
                on_disk.add(rel)
    orphan = sorted(on_disk - {p for _, p in need})

    tree = git_tree()
    uncommitted = None if tree is None else sorted({p for _, p in need} - tree - set(missing))

    print("작업물 %d건 · 이미지 %d장" % (len(want), len(need)))
    print("  없는 이미지 %d장 %s" % (len(missing), missing[:5]))
    print("  안 쓰이는 이미지 %d장 %s" % (len(orphan), orphan[:5]))

    if uncommitted is None:
        print("  git 을 쓸 수 없어 커밋 여부는 확인하지 못했습니다.")
    elif uncommitted:
        print("  커밋 안 된 이미지 %d장 — 이대로 배포하면 그만큼 빈 칸이 됩니다." % len(uncommitted))
        for p in uncommitted[:8]:
            print("    " + p)
        if len(uncommitted) > 8:
            print("    ... 외 %d장" % (len(uncommitted) - 8))
        print()
        print("  git add public/detail-ref app/lib/detail-page-reference.ts")
    else:
        print("  커밋 안 된 이미지 없음 — 참조하는 이미지가 전부 git 에 있습니다.")

    return 1 if (missing or uncommitted) else 0


if __name__ == "__main__":
    sys.exit(main())
