"""public/sian 정적 시안에 <base href> 를 넣는다.

왜 : next.config trailingSlash false 라 /sian/x/ 가 /sian/x 로 바뀌고,
상대 경로 (assets/... · ../...) 가 /sian/assets/... 로 풀려 css · 사진이 404 가 된다 (2026-10-30 대표 지적).
각 html 에 자기 폴더 주소를 base 로 박아 주소 끝 / 와 상관없이 같은 파일을 찾게 한다.
Next 로 만든 시안 (_next 폴더가 있는 것) 은 절대 경로라 건드리지 않는다. 이미 base 가 있으면 건너뛴다.
사용 : python scripts/sian_base_fix.py [--check]
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "public" / "sian"
REL = re.compile(r'''(?:href|src|srcset)=["'](?!https?:|//|/|#|data:|mailto:|tel:|sms:)[^"']+''', re.I)

def base_for(f: Path) -> str:
    rel = f.parent.relative_to(ROOT).as_posix()
    return "/sian/" + (rel + "/" if rel != "." else "")

def targets():
    for site in sorted(p for p in ROOT.iterdir() if p.is_dir()):
        if (site / "_next").exists():
            continue
        for f in site.rglob("*.html"):
            yield f

def main(check: bool) -> int:
    need = done = 0
    for f in targets():
        t = f.read_text(encoding="utf-8", errors="surrogateescape")
        if re.search(r"<base\s", t, re.I) or not REL.search(t):
            continue
        need += 1
        if check:
            continue
        m = re.search(r"<head[^>]*>", t, re.I)
        if not m:
            continue
        t = t[:m.end()] + f'<base href="{base_for(f)}">' + t[m.end():]
        f.write_text(t, encoding="utf-8", errors="surrogateescape")
        done += 1
    print(f"base 필요 {need} · 넣음 {done}")
    return 1 if check and need else 0

if __name__ == "__main__":
    assert base_for(ROOT / "a" / "b" / "index.html") == "/sian/a/b/"   # 자체 점검
    sys.exit(main("--check" in sys.argv))
