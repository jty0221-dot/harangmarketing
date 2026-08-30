# -*- coding: utf-8 -*-
"""
명함 뒷면 스캔 한 장에서 협력사 로고를 하나씩 오려내 홈페이지용 PNG 로 굽는다.

  python scripts/partners/build_logos.py

- 흰 배경은 알파로 빼서(unpremultiply) 어느 배경에 얹어도 색이 그대로 나오게 한다
- 캔버스는 전부 480x180 으로 통일한다. 그래야 CSS 에서 높이만 맞춰도
  가로 폭이 저절로 같아지고, 로고마다 scale 값을 손으로 만질 일이 없다
- 로고 안쪽 여백은 min(높이제한, 너비제한) 으로 잡는다. 정사각 마크는 높이가,
  가로로 긴 워드마크는 너비가 기준이 되어 눈에 보이는 크기가 얼추 맞는다

VERYGOOD WEDDING COMPANY 만 예외다. 명함 스캔이 오른쪽 끝에서 잘려
'VERYGOO' / 'WEDDING COMPAN' 까지만 남아 있어, 왕관만 떼어내고
글자는 같은 톤으로 다시 짠다.
"""
import io
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
CARD = r"E:\하랑\전태영\전태영 하랑 명함 뒷면.jpg"
OUT = os.path.join(ROOT, "public", "partners")

CANVAS = (384, 144)              # 화면 최대 64px 높이 x DPR 3 을 덮는 크기
H_MAX, W_MAX = 106, 323          # 캔버스 안에서 잉크가 차지할 최대 크기
BAND = (0, 870, None, 1580)      # 로고가 늘어선 띠 (명함 아래쪽 절반)
NEAR_WHITE = 18                  # 이 값보다 흰색에 가까우면 배경으로 본다
GAP = 31                         # 이 픽셀만큼 떨어진 잉크는 같은 로고로 묶는다

# 왼쪽 위부터 오른쪽 아래로 읽은 순서. 파일명이 곧 partners.ts 의 file 값이다.
NAMES = [
    "rok-marine-corps", "rok-navy", "shabu-all-day", "myeongryun-jinsa",
    "mercedes-benz", "motex", "bareun-dental", "seoul-fire-hq",
    "sobang", None, "verygood-wedding", "cleanpass",
    "yeonwoo-design", "thai-back-street", "mo-and-dot", "yeoljeong-clean",
    "skinmuse", "abom-clinic", "misogadeuk-dental", "ds-english",
    "cheongseolmo", "sw-seowon",
]


def ink_bbox(rgb, thr=NEAR_WHITE):
    """흰색이 아닌 픽셀이 차지하는 사각형."""
    d = 255 - np.asarray(rgb).astype(np.int16).min(axis=2)
    ys, xs = np.where(d > thr)
    if not len(ys):
        return None
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


def white_to_alpha(rgb):
    """흰 배경을 알파로 바꾼다. 색은 언프리멀티플라이해서 원래 색을 되살린다."""
    a = np.asarray(rgb).astype(np.float32)
    alpha = (255.0 - a.min(axis=2)) / 255.0
    safe = np.maximum(alpha, 1e-4)[..., None]
    color = np.clip((a - 255.0 * (1.0 - safe)) / safe, 0, 255)
    out = np.dstack([color, alpha[..., None] * 255.0]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def place(logo_rgba):
    """트리밍된 로고를 공통 캔버스 가운데에 얹는다."""
    w, h = logo_rgba.size
    s = min(H_MAX / h, W_MAX / w)
    nw, nh = max(1, round(w * s)), max(1, round(h * s))
    r = logo_rgba.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    canvas.alpha_composite(r, ((CANVAS[0] - nw) // 2, (CANVAS[1] - nh) // 2))
    return compress(canvas)


def compress(rgba):
    """알파를 살린 채 용량만 줄인다.

    기본 팔레트 변환(MEDIANCUT)은 알파를 버려서 반투명 가장자리가
    흰 사각형으로 뭉개진다(skinmuse 사례). FASTOCTREE 는 RGBA 를 그대로
    다뤄 같은 사고가 나지 않는다. 화면에서 44~58px 로 쓰는 로고라
    128색이면 원본과 구분이 안 되고 용량은 1/3 아래로 떨어진다.
    """
    a = np.asarray(rgba).astype(np.uint8).copy()
    a[a[..., 3] == 0] = (255, 255, 255, 0)
    return Image.fromarray(a, "RGBA").quantize(colors=128, method=Image.FASTOCTREE)


def segment(card):
    """띠 안에서 로고 덩어리를 찾아 (이름, 크롭) 목록으로 돌려준다."""
    W = card.size[0]
    x0b, y0b, _, y1b = BAND
    band = card.crop((x0b, y0b, W, y1b))
    d = 255 - np.asarray(band).astype(np.int16).min(axis=2)
    merged = ndimage.binary_dilation(d > NEAR_WHITE, np.ones((GAP, GAP), bool))
    lab, n = ndimage.label(merged)
    boxes = []
    for sy, sx in ndimage.find_objects(lab):
        w, h = sx.stop - sx.start, sy.stop - sy.start
        if w < 60 or h < 40:
            continue
        boxes.append((sx.start, sy.start, sx.stop, sy.stop))
    # 두 줄로 늘어서 있으니 위·아래 줄을 나눈 뒤 각 줄에서 왼쪽부터
    boxes.sort(key=lambda b: (0 if b[1] < 260 else 1, b[0]))
    out = []
    for i, (x0, y0, x1, y1) in enumerate(boxes):
        out.append((NAMES[i] if i < len(NAMES) else None,
                    band.crop((max(0, x0 - 14), max(0, y0 - 14), x1 + 14, y1 + 14))))
    return out


def trim_card_edge(im):
    """명함이 잘린 오른쪽 끝의 검은 띠를 걷어낸다. 안 걷으면 이게 로고로 잡힌다."""
    a = np.asarray(im.convert("RGB")).astype(np.int16)
    col = ((255 - a.min(axis=2)) > NEAR_WHITE).mean(axis=0)
    x = im.width
    while x > 1 and col[x - 1] > 0.8:
        x -= 1
    return im.crop((0, 0, x, im.height))


def rebuild_verygood(src):
    """왕관만 살리고 글자는 같은 톤으로 다시 짠다.

    스캔이 오른쪽에서 잘려 'VERYGOO' / 'WEDDING COMPAN' 까지만 남아 있다.
    원본 비율(왕관 폭 = 워드마크 폭의 0.17, 자간은 거의 한 글자 폭)을 재서 되살린다.
    """
    src = trim_card_edge(src)
    a = np.asarray(src.convert("RGB")).astype(np.int16)
    mask = (255 - a.min(axis=2)) > NEAR_WHITE
    lab, _ = ndimage.label(ndimage.binary_dilation(mask, np.ones((9, 9), bool)))
    sy, sx = min(ndimage.find_objects(lab), key=lambda s: s[0].start)
    crown = white_to_alpha(src.crop((sx.start, sy.start, sx.stop, sy.stop)))
    tone = tuple(int(v) for v in a[mask].mean(axis=0))

    MARK = 1600                                   # 워드마크 가로 폭
    face = r"C:\Windows\Fonts\pala.ttf"
    big, small = ImageFont.truetype(face, 96), ImageFont.truetype(face, 44)
    canvas = Image.new("RGBA", (MARK + 300, 800), (255, 255, 255, 0))
    dr = ImageDraw.Draw(canvas)

    def line(text, font, target, top):
        """글자를 하나씩 찍어 자간을 벌린다. 원본이 극단적으로 넓다."""
        glyphs = [dr.textlength(c, font=font) for c in text]
        track = (target - sum(glyphs)) / (len(text) - 1)
        x = (canvas.width - target) / 2
        for c, w in zip(text, glyphs):
            dr.text((x, top), c, font=font, fill=tone + (255,), anchor="lt")
            x += w + track

    cw = round(MARK * 0.17)
    ch = round(crown.height * cw / crown.width)
    canvas.alpha_composite(crown.resize((cw, ch), Image.LANCZOS),
                           ((canvas.width - cw) // 2, 40))
    line("VERYGOOD", big, MARK, 40 + ch + 40)
    line("WEDDING COMPANY", small, MARK, 40 + ch + 40 + 130)
    return canvas.crop(canvas.getbbox())


def main():
    card = Image.open(CARD).convert("RGB")
    os.makedirs(OUT, exist_ok=True)
    made = 0
    for name, crop in segment(card):
        if not name:
            continue
        if name == "verygood-wedding":
            logo = rebuild_verygood(crop)
        else:
            box = ink_bbox(crop)
            logo = white_to_alpha(crop.crop(box))
        place(logo).save(os.path.join(OUT, name + ".png"), optimize=True)
        made += 1
    print("%d files -> %s" % (made, OUT))


if __name__ == "__main__":
    main()
