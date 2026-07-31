#!/usr/bin/env python3
"""
표지 SVG → PNG 래스터 변환.

판매 플랫폼 대부분이 SVG를 받지 않으므로, EPUB에 들어가는 것과
'같은 소스'에서 PNG를 뽑아낸다. 표지를 두 번 만들지 않기 위함이다.

    python ebook/render_cover.py                    # 긴 변 2560px (판매용 권장)
    python ebook/render_cover.py --long-edge 1800   # 미리보기용
    python ebook/render_cover.py -o /tmp/cover.png

헤드리스 크로미움만 있으면 되고 별도 파이썬 패키지는 필요 없다.
"""
from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_epub import cover_svg, raster_cover  # noqa: E402


def from_raster(out: Path, long_edge: int) -> bool:
    """ebook/cover.jpg 같은 실제 표지가 있으면 그것을 PNG 로 옮긴다.

    이 갈래가 없으면 코드로 그린 옛 SVG 가 렌더링되어, 제목이 바뀐 뒤에도
    옛 표지가 나온다. 실제로 그 사고가 한 번 났다.
    """
    src = raster_cover()
    if not src:
        return False
    path, _ = src
    try:
        from PIL import Image
    except ImportError:
        shutil.copyfile(path, out.with_suffix(path.suffix))
        print(f"[표지] {path.name} 를 그대로 복사 (PIL 없음)")
        return True
    im = Image.open(path).convert("RGB")
    w, h = im.size
    if max(w, h) != long_edge:
        r = long_edge / max(w, h)
        im = im.resize((round(w * r), round(h * r)), Image.LANCZOS)
    im.save(out, "PNG")
    print(f"[표지] {path.name} → {out.name}  {im.size[0]}x{im.size[1]}")
    return True

BASE_W, BASE_H = 1200, 1800  # cover_svg()의 캔버스 규격 (2:3)


def find_chromium() -> str:
    """설치 위치가 환경마다 달라 후보를 순서대로 훑는다."""
    env = os.environ.get("CHROMIUM_BIN")
    if env and Path(env).exists():
        return env

    for name in ("chromium", "chromium-browser", "google-chrome", "chrome"):
        found = shutil.which(name)
        if found:
            return found

    roots = [Path(os.environ.get("PLAYWRIGHT_BROWSERS_PATH", "/opt/pw-browsers"))]
    roots.append(Path.home() / ".cache" / "ms-playwright")
    for root in roots:
        if not root.is_dir():
            continue
        for pat in ("chromium*/chrome-linux/chrome", "chromium*/chrome-mac*/*.app/Contents/MacOS/*"):
            hits = sorted(root.glob(pat))
            if hits:
                return str(hits[0])

    raise SystemExit(
        "[error] 크로미움을 찾지 못했습니다.\n"
        "        CHROMIUM_BIN 환경변수로 직접 지정하거나 크롬/크로미움을 설치하십시오."
    )


def render(out: Path, long_edge: int) -> None:
    scale = long_edge / BASE_H
    width, height = round(BASE_W * scale), long_edge

    # 브라우저 기본 여백이 SVG를 밀어내 하단이 잘리므로 margin:0 래퍼로 감싼다.
    page = (
        "<!doctype html><meta charset='utf-8'>"
        "<style>html,body{margin:0;padding:0;overflow:hidden;background:#0E1518}"
        f"svg{{display:block;width:{BASE_W}px;height:{BASE_H}px}}</style>"
        + cover_svg().split("?>", 1)[1]
    )

    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / "cover.html"
        src.write_text(page, encoding="utf-8")
        out.parent.mkdir(parents=True, exist_ok=True)

        proc = subprocess.run(
            [
                find_chromium(),
                "--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
                f"--force-device-scale-factor={scale}",
                f"--window-size={BASE_W},{BASE_H}",
                f"--screenshot={out}",
                src.as_uri(),
            ],
            capture_output=True, text=True,
        )

    if not out.exists():
        sys.stderr.write(proc.stderr[-2000:] + "\n")
        raise SystemExit("[error] 렌더링에 실패했습니다.")

    print(f"[ok] {out}  ({width}x{height}, {out.stat().st_size:,} bytes)")
    if long_edge < 2560:
        print("[note] 판매 플랫폼 등록용은 --long-edge 2560 이상을 권장합니다.")


def main() -> None:
    ap = argparse.ArgumentParser(description="표지 SVG를 PNG로 렌더링합니다.")
    ap.add_argument("-o", "--out", type=Path,
                    default=Path(__file__).resolve().parent / "dist" / "cover.png")
    ap.add_argument("--long-edge", type=int, default=2560,
                    help="긴 변(세로) 픽셀. 기본 2560")
    ap.add_argument("--svg", action="store_true",
                    help="실제 표지를 무시하고 코드로 그린 SVG를 렌더링")
    args = ap.parse_args()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    if args.svg or not from_raster(args.out, args.long_edge):
        render(args.out, args.long_edge)


if __name__ == "__main__":
    main()
