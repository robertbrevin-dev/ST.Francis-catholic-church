from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

TARGET_W = 3840

BASE = Path(__file__).resolve().parent.parent / "public" / "images"
FILES = [
    ("bishop-john-lelei-walking.png", "bishop-john-lelei-walking-display.jpg"),
    ("bishop-john-lelei-blessing.png", "bishop-john-lelei-blessing-display.jpg"),
    ("bishop-john-lelei.png", "bishop-john-lelei-display.jpg"),
]


def process(src_name: str, out_name: str) -> None:
    src = BASE / src_name
    out = BASE / out_name
    im = Image.open(src).convert("RGB")
    w, h = im.size
    if w >= TARGET_W:
        new_im = im
    else:
        nh = max(1, int(round(h * (TARGET_W / w))))
        new_im = im.resize((TARGET_W, nh), Image.Resampling.LANCZOS)

    new_im = new_im.filter(
        ImageFilter.UnsharpMask(radius=1.0, percent=130, threshold=2)
    )
    new_im = ImageEnhance.Sharpness(new_im).enhance(1.06)
    new_im = ImageEnhance.Contrast(new_im).enhance(1.03)
    new_im.save(out, "JPEG", quality=94, optimize=True, progressive=True, subsampling=0)
    print(f"Wrote {out.name} ({new_im.size[0]}x{new_im.size[1]})")


def main() -> None:
    os.chdir(BASE)
    for src, dst in FILES:
        process(src, dst)


if __name__ == "__main__":
    main()
