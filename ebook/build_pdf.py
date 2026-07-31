#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_pdf.py — HTML 판을 PDF로 굽는다

왜 필요한가.
EPUB은 리디·교보 같은 유통사가 받는 형식이고, 크몽처럼 파일을 직접
파는 곳은 PDF를 원한다. 같은 원고에서 두 형식이 나와야 내용이 갈리지 않는다.

브라우저의 인쇄 엔진을 그대로 쓴다. 별도 PDF 라이브러리를 넣지 않는
이유는 build_epub.py와 같다 — 의존성이 늘면 재현이 어려워진다.

사용:
    python ebook/build_pdf.py                 # 한국판
    python ebook/build_pdf.py --no-cta        # 해외판 (서비스 링크 없음)
    python ebook/build_pdf.py --preview       # 미리보기판 (제1장까지)
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "ebook" / "dist"

# 이 환경에 설치된 크로미움. 없으면 PATH에서 찾는다.
CANDIDATES = [
    Path("/opt/pw-browsers/chromium-1194/chrome-linux/chrome"),
    Path("/opt/pw-browsers/chromium/chrome-linux/chrome"),
]


def find_browser() -> Path:
    for p in CANDIDATES:
        if p.exists():
            return p
    from shutil import which
    for name in ("chromium", "chromium-browser", "google-chrome", "chrome"):
        w = which(name)
        if w:
            return Path(w)
    raise SystemExit(
        "[error] 크로미움을 찾지 못했습니다.\n"
        "        HTML을 브라우저에서 열고 '인쇄 → PDF로 저장'해도 결과는 같습니다."
    )


def build(html: Path, out: Path) -> None:
    if not html.exists():
        raise SystemExit(f"[error] 먼저 HTML을 만들어 주세요: {html.name}")

    out.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        str(find_browser()),
        "--headless", "--disable-gpu", "--no-sandbox",
        "--no-pdf-header-footer",          # 머리말·꼬리말 없이 본문만
        f"--print-to-pdf={out}",
        html.resolve().as_uri(),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    if not out.exists():
        sys.stderr.write(r.stderr[-2000:] + "\n")
        raise SystemExit("[error] PDF 생성 실패")

    data = out.read_bytes()
    pages = len(re.findall(rb"/Type\s*/Page[^s]", data))
    print(f"[ok] {out}  ({len(data):,} bytes, {pages}쪽)")
    if pages < 10:
        print("  ⚠ 쪽수가 너무 적습니다. HTML이 제대로 열렸는지 확인이 필요합니다.")


def main() -> None:
    ap = argparse.ArgumentParser(description="HTML → PDF")
    ap.add_argument("--no-cta", action="store_true", help="해외판 (서비스 링크 없음)")
    ap.add_argument("--preview", action="store_true", help="미리보기판")
    ap.add_argument("-o", "--out", type=Path)
    a = ap.parse_args()

    stem = "소문을끄고데이터를켜다"
    if a.preview:
        src, name = DIST / f"{stem}-미리보기.html", f"{stem}-미리보기.pdf"
    elif a.no_cta:
        src, name = DIST / f"{stem}-해외판.html", f"{stem}-해외판.pdf"
    else:
        src, name = DIST / f"{stem}.html", f"{stem}.pdf"

    build(src, a.out or DIST / name)


if __name__ == "__main__":
    main()
