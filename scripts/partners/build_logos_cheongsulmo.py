# -*- coding: utf-8 -*-
"""
청설모 명함 뒷면(주요 거래처)에서 로고를 하나씩 오려내 홈페이지용 PNG 로 굽는다.

  python scripts/partners/build_logos_cheongsulmo.py

하랑 명함(`build_logos.py`)과 원본 성격이 다르다.
  · 하랑 쪽은 인쇄물 스캔이라 잉크 덩어리를 뭉쳐서 찾아야 했다
  · 청설모 쪽은 디자인 원본이라 배경이 순백이고 로고가 줄 단위로 반듯하게 놓여 있다
    → y 띠를 먼저 끊고 각 띠 안에서 x 로만 나누면 정확히 떨어진다

배경을 뺄 때도 방식이 다르다. 하랑 스캔은 밝기로 알파를 만들었지만
여기에는 KFC 흰 줄, 투썸 흰 글자처럼 **로고 안쪽의 흰색**이 있다.
밝기만 보면 그게 같이 뚫린다. 그래서 테두리에서 이어지는 흰색만
바깥 배경으로 보고(플러드필), 안쪽 흰색은 그대로 남긴다.

대한민국 해병대는 하랑 명함에도 있어 여기서는 굽지 않는다(rok-marine-corps.png).
"""
import io
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
CARD = r"E:\하랑\전태영\전태영 청설모 명함 뒷면.jpg"
OUT = os.path.join(ROOT, "public", "partners")

CANVAS = (384, 144)     # build_logos.py 와 같은 캔버스. 섞어 놓아도 크기가 맞는다
H_MAX, W_MAX = 106, 323
INK = 18                # 이보다 어두우면 잉크로 본다 (배경 순백 기준)
CORE_BG = 8             # 이보다 밝으면 확실한 배경. JPEG 노이즈를 감안해 조금 준다
FEATHER = 24            # 가장자리 반투명 구간 폭
X_GAP = 80              # 이만큼 떨어지면 다른 로고

# 로고가 놓인 y 띠. 제목·구분선·연락처 줄을 뺀 세 줄이다
BANDS = [(536, 760), (848, 1085), (1372, 1636)]

# 왼쪽부터 읽은 순서. None 은 굽지 않는다(중복·불필요)
NAMES = [
    ["hanwha-hotels-resorts", "k-water", "kigam"],
    ["postech", "jongro-m-school", None],          # None = 해병대, 하랑 명함과 중복
    ["kfc", "pascucci", "twosome-place",
     "compose-coffee", "kuu-kuu", "vands-clinic"],
]


def bg_to_alpha(rgb):
    """바깥 흰 배경만 알파로 뺀다. 로고 안쪽 흰색은 불투명하게 남긴다."""
    a = np.asarray(rgb).astype(np.float32)
    d = 255.0 - a.min(axis=2)                      # 0 = 순백

    lab, _ = ndimage.label(d <= CORE_BG)
    edge = np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    outside = np.isin(lab, np.setdiff1d(np.unique(edge), [0]))
    # 안티에일리어싱된 테두리 한두 픽셀도 바깥으로 끌어와 반투명 처리한다
    outside = ndimage.binary_dilation(outside, np.ones((5, 5), bool))

    alpha = np.ones(d.shape, np.float32)
    alpha[outside] = np.clip((d[outside] - 2.0) / FEATHER, 0.0, 1.0)

    safe = np.maximum(alpha, 1e-4)[..., None]
    color = np.clip((a - 255.0 * (1.0 - safe)) / safe, 0, 255)
    out = np.dstack([color, alpha[..., None] * 255.0]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


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


def place(logo_rgba):
    """트리밍된 로고를 공통 캔버스 가운데에 얹는다."""
    w, h = logo_rgba.size
    s = min(H_MAX / h, W_MAX / w)
    nw, nh = max(1, round(w * s)), max(1, round(h * s))
    r = logo_rgba.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    canvas.alpha_composite(r, ((CANVAS[0] - nw) // 2, (CANVAS[1] - nh) // 2))
    return compress(canvas)


def split_row(ink, y0, y1):
    """한 띠 안에서 로고가 차지하는 x 구간을 왼쪽부터 돌려준다."""
    cols = ink[y0:y1].sum(axis=0) > 0
    runs, s = [], None
    for x, v in enumerate(cols):
        if v and s is None:
            s = x
        elif not v and s is not None:
            runs.append((s, x))
            s = None
    if s is not None:
        runs.append((s, len(cols)))

    merged = []
    for r in runs:
        if merged and r[0] - merged[-1][1] < X_GAP:
            merged[-1] = (merged[-1][0], r[1])
        else:
            merged.append(r)
    return [m for m in merged if m[1] - m[0] > 40]


def tight(ink, x0, x1, y0, y1):
    """띠 높이가 아니라 그 로고가 실제로 쓰는 높이로 다시 조인다."""
    sub = ink[y0:y1, x0:x1]
    ys = np.where(sub.any(axis=1))[0]
    return y0 + ys.min(), y0 + ys.max() + 1


def main():
    card = Image.open(CARD).convert("RGB")
    ink = (255 - np.asarray(card).astype(np.int16).min(axis=2)) > INK
    os.makedirs(OUT, exist_ok=True)

    made, skipped = 0, 0
    for (y0, y1), names in zip(BANDS, NAMES):
        spans = split_row(ink, y0, y1)
        if len(spans) != len(names):
            raise SystemExit("띠 %s 에서 %d 개를 찾았는데 이름은 %d 개다: %s"
                             % ((y0, y1), len(spans), len(names), spans))
        for (x0, x1), name in zip(spans, names):
            if not name:
                skipped += 1
                continue
            ty0, ty1 = tight(ink, x0, x1, y0, y1)
            crop = card.crop((x0 - 6, ty0 - 6, x1 + 6, ty1 + 6))
            place(bg_to_alpha(crop)).save(os.path.join(OUT, name + ".png"), optimize=True)
            made += 1
    print("%d files (+%d skipped) -> %s" % (made, skipped, OUT))


if __name__ == "__main__":
    main()
