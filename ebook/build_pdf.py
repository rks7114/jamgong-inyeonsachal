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
import tempfile
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


FRONT_MATTER = 2   # 표지 · 속표지 — 쪽번호를 붙이지 않는 앞부분
PAGE_W_MM, PAGE_H_MM = 148, 210     # A5


def cover_page(tmp: Path) -> Path | None:
    """표지만 담은 한 쪽짜리 PDF를 만든다.

    본문과 따로 굽는 이유가 있다. 크로미움은 @page 여백을 문서 전체에
    한 번만 적용한다 — 표지 쪽만 여백 0으로 두는 것이 안 된다. 그래서
    여백 0짜리 문서를 따로 만들어 맨 앞에 붙인다. 그래야 표지가 종이
    끝까지 찬다.
    """
    sys.path.insert(0, str(ROOT / "ebook"))
    from build_epub import raster_cover  # noqa: E402
    art = raster_cover()
    if not art:
        return None
    src, _ = art
    html = tmp / "cover.html"
    html.write_text(
        "<!doctype html><meta charset='utf-8'>"
        "<style>@page{size:%dmm %dmm;margin:0}"
        "html,body{margin:0;padding:0}"
        "img{display:block;width:%dmm;height:%dmm;object-fit:cover}</style>"
        "<img src='%s'>" % (PAGE_W_MM, PAGE_H_MM, PAGE_W_MM, PAGE_H_MM,
                            src.resolve().as_uri()),
        encoding="utf-8")
    out = tmp / "cover.pdf"
    subprocess.run(
        [str(find_browser()), "--headless", "--disable-gpu", "--no-sandbox",
         "--no-pdf-header-footer", f"--print-to-pdf={out}", html.as_uri()],
        capture_output=True, text=True, timeout=120)
    return out if out.exists() else None


def chapter_titles() -> list[str]:
    """원고 순서대로 장 제목을 얻는다. 책갈피(북마크)를 만드는 데 쓴다."""
    sys.path.insert(0, str(ROOT / "ebook"))
    from build_epub import CHAPTERS, APPENDIX, first_heading  # noqa: E402
    srcs = sorted(CHAPTERS.glob("*.md")) + sorted(APPENDIX.glob("*.md"))
    return [first_heading(p.read_text(encoding="utf-8"), p.stem) for p in srcs]


def _norm(s: str) -> str:
    return re.sub(r"\s+", "", s)


def finish(path: Path) -> dict[int, int]:
    """쪽번호 · 책갈피 · 문서정보를 얹는다.

    크로미움은 CSS의 쪽번호(@page 여백 상자)를 지원하지 않는다. 그래서
    다 구운 뒤에 종이 아래쪽 가운데에 직접 찍는다. 숫자는 PDF 기본 서체
    (Times-Roman)라 별도 임베딩이 필요 없다 — 파일이 무거워지지 않는다.
    """
    try:
        from pypdf import PdfReader, PdfWriter
        from pypdf.generic import (ArrayObject, DecodedStreamObject,
                                   DictionaryObject, NameObject)
    except ImportError:
        print("  · pypdf 가 없어 쪽번호·책갈피는 건너뜁니다 (pip install pypdf)")
        return {}

    sys.path.insert(0, str(ROOT / "ebook"))
    from build_epub import AUTHOR, SUBTITLE, TITLE  # noqa: E402

    writer = PdfWriter(clone_from=str(path))

    with tempfile.TemporaryDirectory() as td:
        cov = cover_page(Path(td))
        if cov:
            writer.insert_page(PdfReader(str(cov)).pages[0], 0)
        else:
            print("  · 표지 이미지가 없어 표지 쪽 없이 만듭니다")

    n = len(writer.pages)

    font = DictionaryObject({
        NameObject("/Type"): NameObject("/Font"),
        NameObject("/Subtype"): NameObject("/Type1"),
        NameObject("/BaseFont"): NameObject("/Times-Roman"),
    })
    font_ref = writer._add_object(font)
    SIZE = 9.0
    DIGIT_W = SIZE * 0.5      # Times-Roman 숫자는 모두 500/1000 em

    for i, page in enumerate(writer.pages):
        if i < FRONT_MATTER:
            continue
        label = str(i - FRONT_MATTER + 1)
        box = page.mediabox
        w, h = float(box.width), float(box.height)
        x = w / 2 - DIGIT_W * len(label) / 2
        y = float(box.bottom) + 34.0        # 종이 밑에서 12mm 남짓

        res = page[NameObject("/Resources")]
        if not isinstance(res, DictionaryObject):
            res = res.get_object()
        fonts = res.get("/Font")
        if fonts is None:
            fonts = DictionaryObject()
            res[NameObject("/Font")] = fonts
        else:
            fonts = fonts.get_object()
        fonts[NameObject("/JMFolio")] = font_ref

        ops = (f"q BT /JMFolio {SIZE} Tf 0.25 0.25 0.25 rg "
               f"1 0 0 1 {x:.2f} {y:.2f} Tm ({label}) Tj ET Q\n")
        st = DecodedStreamObject()
        st.set_data(ops.encode("ascii"))
        ref = writer._add_object(st)

        # 앞 내용이 그래픽 상태를 되돌려 놓지 않는 경우가 있어 q…Q로 감싼다
        pre = DecodedStreamObject(); pre.set_data(b"q\n")
        post = DecodedStreamObject(); post.set_data(b"Q\n")
        cur = page.get(NameObject("/Contents"))
        old = list(cur) if isinstance(cur.get_object(), ArrayObject) else [cur]
        page[NameObject("/Contents")] = ArrayObject(
            [writer._add_object(pre), *old, writer._add_object(post), ref])

    # 책갈피 — 뷰어 왼쪽에 장 목록이 뜬다. 370쪽짜리에서는 필수다.
    # 같은 훑기로 각 장이 몇 쪽에서 시작하는지도 함께 얻는다. 목차의
    # 쪽수는 이 값으로 채운다.
    titles, found = chapter_titles(), 0
    folios: dict[int, int] = {}
    if titles:
        texts = []
        for p in writer.pages:
            try:
                texts.append(_norm(p.extract_text() or ""))
            except Exception:
                texts.append("")
        # 목차 쪽에는 모든 장 제목이 적혀 있다. 거기서부터 찾으면 첫 장이
        # 자기 목차를 가리키게 된다. 그래서 제목이 여럿 모여 있는 쪽은
        # 목차로 보고 건너뛴다.
        keys = [_norm(t)[:14] for t in titles]
        cursor = FRONT_MATTER
        for j in range(FRONT_MATTER, min(n, FRONT_MATTER + 6)):
            if sum(1 for k in keys if k and k in texts[j]) >= 5:
                cursor = j + 1

        for idx, t in enumerate(titles, 1):
            key = _norm(t)[:14]
            for j in range(cursor, n):
                if key and key in texts[j]:
                    writer.add_outline_item(t, j)
                    folios[idx] = j - FRONT_MATTER + 1
                    cursor, found = j + 1, found + 1
                    break

    writer.add_metadata({
        "/Title": f"{TITLE} — {SUBTITLE}",
        "/Author": AUTHOR,
        "/Subject": SUBTITLE,
    })
    with open(path, "wb") as f:
        writer.write(f)
    print(f"  · 쪽번호 {n - FRONT_MATTER}개 · 책갈피 {found}/{len(titles)}")
    return folios


def render(html: Path, out: Path) -> None:
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


def fill_toc(html: Path, folios: dict[int, int], tmp: Path) -> Path | None:
    """목차의 빈 쪽수 칸을 채운 HTML 사본을 만든다.

    쪽수는 조판이 끝나야 알 수 있고, 조판은 HTML 이 있어야 한다 — 닭과
    달걀이다. 그래서 두 번 굽는다. 첫 판에서 각 장이 앉은 쪽을 읽고,
    그 숫자를 목차에 넣어 다시 굽는다. 숫자가 들어갈 자리는 처음부터
    폭을 잡아 두었으므로(.p의 min-width) 줄이 밀리지 않는다.
    """
    if not folios:
        return None
    src = html.read_text(encoding="utf-8")
    n = 0
    for idx, pg in folios.items():
        old = f'<span class="p" data-pg="doc{idx:02d}"></span>'
        if old in src:
            src = src.replace(old, old.replace("></span>", f">{pg}</span>"))
            n += 1
    if not n:
        return None
    out = tmp / html.name
    out.write_text(src, encoding="utf-8")
    return out


def build(html: Path, out: Path) -> None:
    if not html.exists():
        raise SystemExit(f"[error] 먼저 HTML을 만들어 주세요: {html.name}")

    out.parent.mkdir(parents=True, exist_ok=True)
    render(html, out)
    folios = finish(out)

    # 두 번째 판 — 목차에 쪽수를 넣어 다시 굽는다
    with tempfile.TemporaryDirectory() as td:
        marked = fill_toc(html, folios, Path(td))
        if marked:
            render(marked, out)
            again = finish(out)
            moved = sum(1 for k, v in again.items() if folios.get(k) != v)
            if moved:
                print(f"  ⚠ 두 번째 판에서 {moved}개 장의 쪽이 밀렸습니다 "
                      f"— 목차 쪽수가 최대 1쪽 어긋날 수 있습니다")
            else:
                print(f"  · 목차 쪽수 {len(again)}개 (두 판이 일치)")

    data = out.read_bytes()
    pages = len(re.findall(rb"/Type\s*/Page[^s]", data))
    fonts = sorted({m.decode().split("+")[-1] for m in
                    re.findall(rb"/BaseFont\s*/([A-Za-z0-9+\-,._]+)", data)})
    print(f"[ok] {out}  ({len(data):,} bytes, {pages}쪽)")
    print(f"  · 서체 {', '.join(fonts)}")
    if pages < 10:
        print("  ⚠ 쪽수가 너무 적습니다. HTML이 제대로 열렸는지 확인이 필요합니다.")
    bad = [f for f in fonts if "WenQuanYi" in f or "Unifont" in f]
    if bad:
        print(f"  ⚠ 한글이 대체 서체로 박혔습니다: {', '.join(bad)}")
        print("     나눔글꼴을 설치하십시오 — apt-get install -y fonts-nanum")


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
