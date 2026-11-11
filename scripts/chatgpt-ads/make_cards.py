# ChatGPT 광고용 서비스 카드(1080x1080) 생성. 사용: python make_cards.py [키 ...]  (키 없으면 전부)
# Edge 헤드리스로 HTML 을 찍어 docs/chatgpt-ads/ad-<키>.png 로 저장한다. 문구는 각 서비스 페이지의 실제 문구만 쓴다.
import json, re, subprocess, sys, tempfile, time, pathlib
from PIL import Image

REPO = pathlib.Path(__file__).resolve().parents[2]
OUT = REPO / "docs/chatgpt-ads"
ICONS = REPO / "node_modules/lucide-react/dist/esm/icons"
LOGO = (REPO / "public/harang-icon.svg").as_uri()
EDGE = r"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"

# 키, 제목, 사실 두 줄, 강조색, 배경 틴트, lucide 아이콘
CARDS = [
    ("place", "네이버 플레이스 SEO", ["키워드 20개 이상 세팅", "매일 오후 순위 계측과 원인 보고"], "#0066FF", "#EAF2FE", "search"),
    ("blog", "블로그 관리대행", ["월 4~8건 키워드 기반 발행", "게시 URL 전체 공개"], "#00A86B", "#E6F7EF", "book-open"),
    ("cafe", "블로그 · 카페 배포", ["10건 · 30건 패키지", "건마다 노출 위치와 URL 보고"], "#7B4DFF", "#F0EBFF", "megaphone"),
    ("review", "체험단 · 리뷰 마케팅", ["회차당 5~30명 섭외", "리뷰는 사지 않습니다"], "#FF7A00", "#FFF1E5", "users"),
    ("instagram", "인스타그램 운영", ["30개 항목 무료 진단", "문제 다섯 가지와 4주 실행표"], "#E1306C", "#FDE9F0", "at-sign"),
    ("photo", "매장 사진촬영", ["메뉴 10컷 + 인테리어 5장부터", "플레이스 · 인스타 규격으로 납품"], "#1F2937", "#EEF0F3", "camera"),
    ("detail", "스마트스토어 상세페이지", ["9단 구성으로 설득 순서 기획", "슬라이스 파일 납품"], "#0E7490", "#E3F4F8", "layout-template"),
    ("naver-ads", "네이버 광고 운영대행", ["운영비와 광고비를 나눠 견적", "광고비는 네이버에 내는 실비"], "#03C75A", "#E5F8EC", "chart-column"),
    ("homepage", "홈페이지 제작", ["업종별 시안 255개 중에서 고르기", "15영업일 · 대표님 명의 도메인"], "#2F3A8F", "#ECEEFB", "monitor-smartphone"),
]

TPL = """<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
html{{background:#fff}}html,body{{width:1080px;height:1080px;overflow:hidden}}
body{{font-family:Pretendard,sans-serif;background:{tint};letter-spacing:-0.02em;color:#171719;position:relative}}
.wrap{{position:absolute;inset:72px;display:flex;flex-direction:column}}
.brand{{display:flex;align-items:center;gap:16px;font-size:44px;font-weight:800}}.brand img{{height:64px}}.brand b{{color:#0066FF}}
.icon{{margin-top:110px;width:176px;height:176px;border-radius:44px;background:{accent};display:flex;align-items:center;justify-content:center;box-shadow:0 20px 48px -16px {accent}}}
.icon svg{{width:100px;height:100px;stroke:#fff;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}}
h1{{margin-top:64px;font-size:84px;font-weight:800;line-height:1.15}}
ul{{margin-top:40px;list-style:none}}
li{{font-size:44px;font-weight:600;color:#3A3D44;line-height:1.5;display:flex;align-items:center;gap:20px}}
li::before{{content:"";width:14px;height:14px;border-radius:50%;background:{accent};flex:none}}
.foot{{margin-top:auto;display:flex;justify-content:space-between;align-items:center;font-size:34px;font-weight:700;color:#70737C}}
.chip{{background:#fff;border-radius:999px;padding:16px 32px;color:{accent};font-weight:800}}
</style></head><body><div class="wrap">
<div class="brand"><img src="{logo}"><span>하랑<b>마케팅</b></span></div>
<div class="icon"><svg viewBox="0 0 24 24">{icon}</svg></div>
<h1>{title}</h1><ul>{items}</ul>
<div class="foot"><span>harangmarketing.com</span><span class="chip">상담 비용 0원</span></div>
</div></body></html>"""


def icon_svg(name):
    src = (ICONS / f"{name}.mjs").read_text(encoding="utf-8")
    node = re.search(r"const __iconNode = (\[[\s\S]*?\]);\n", src).group(1)
    parts = []
    for tag, attrs in re.findall(r'\[\s*"(\w+)",\s*(\{[^}]*\})\s*\]', node):
        a = json.loads(re.sub(r"(\w+):", r'"\1":', attrs.replace("'", '"')))
        parts.append(f"<{tag} " + " ".join(f'{k}="{v}"' for k, v in a.items() if k != "key") + "/>")
    return "".join(parts)


def render(key, title, facts, accent, tint, icon):
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="harang-card-"))
    html = tmp / "card.html"
    html.write_text(TPL.format(tint=tint, accent=accent, logo=LOGO, icon=icon_svg(icon), title=title,
                               items="".join(f"<li>{f}</li>" for f in facts)), encoding="utf-8")
    raw = tmp / "raw.png"
    for attempt in range(4):  # Edge 헤드리스가 가끔 파일을 안 남기고 끝나서 다시 찍는다
        subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--no-first-run", f"--user-data-dir={tmp / f'prof{attempt}'}",
                        "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1120,1300",
                        "--virtual-time-budget=6000", f"--screenshot={raw}", html.as_uri()], capture_output=True, timeout=90)
        for _ in range(20):
            if raw.exists() and raw.stat().st_size > 0: break
            time.sleep(0.5)
        if raw.exists(): break
    out = OUT / f"ad-{key}.png"
    Image.open(raw).convert("RGB").crop((0, 0, 1080, 1080)).save(out, "PNG")  # 창 아래 여백을 잘라 정사각형으로
    return out


if __name__ == "__main__":
    only = set(sys.argv[1:])
    for c in CARDS:
        if only and c[0] not in only: continue
        p = render(*c)
        print(c[0], p.stat().st_size)
