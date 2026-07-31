#!/usr/bin/env python3
"""
원고 전체를 파일 하나짜리 HTML로 묶는다.

EPUB은 전용 뷰어가 있어야 열리지만, 이 파일은 더블클릭하면
어느 브라우저에서든 바로 열린다. 표지 이미지까지 파일 안에
심어 두므로 이 파일 하나만 있으면 된다.

    python ebook/build_html.py
    python ebook/build_html.py -o /어딘가/책.html

본문 변환은 build_epub.py의 것을 그대로 쓴다. 같은 원고에서
두 가지 결과물이 서로 다르게 나오는 일을 막기 위함이다.
"""
from __future__ import annotations

import argparse
import base64
import html
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_epub import (  # noqa: E402
    AUTHOR, CHAPTERS, APPENDIX, CSS, LANG, PUBLISHER, SUBTITLE, TITLE,
    cover_svg, first_heading, render_blocks,
)

# 화면으로 읽을 때만 필요한 것 — 목차 사이드바, 본문 폭 제한, 다크 모드
EXTRA_CSS = """
:root { color-scheme: light dark; }
body { max-width: 44rem; margin: 0 auto; padding: 2rem 1.2rem 6rem;
       font-family: system-ui, "Malgun Gothic", sans-serif; }
img.cover { display: block; width: 100%; max-width: 26rem; margin: 0 auto 3rem;
            box-shadow: 0 2px 24px rgba(0,0,0,.28); }
nav.toc { background: #f7f7f5; border: 1px solid #ddd; border-radius: 8px;
          padding: 1.2em 1.4em; margin: 2em 0 3em; }
nav.toc h2 { border: 0; padding: 0; margin: 0 0 .6em; font-size: 1.15em; }
nav.toc ol { list-style: none; padding-left: 0; margin: 0;
             columns: 2; column-gap: 2em; }
nav.toc li { margin: .28em 0; font-size: .92em; break-inside: avoid; }
section.doc { border-top: 1px solid #ddd; padding-top: 1.5rem; margin-top: 4rem; }
section.doc:first-of-type { border-top: 0; margin-top: 0; }
.totop { display: block; text-align: right; font-size: .85em; margin-top: 2.5em; }
@media (prefers-color-scheme: dark) {
  body { background: #14181a; color: #dcdcd8; }
  h1, h2 { border-color: #3a4247; }
  blockquote { background: #1d2225; border-left-color: #4a5359; }
  th { background: #22282b; }
  th, td { border-color: #3a4247; }
  pre { background: #1a1f22; }
  nav.toc { background: #1a1f22; border-color: #333a3e; }
  hr { border-top-color: #333a3e; }
  a { color: #7fb6e8; }
}
@media print { nav.toc { break-after: page; } .totop { display: none; } }
"""


def slugify(idx: int) -> str:
    return f"doc{idx:02d}"


def build(out: Path) -> None:
    sources = sorted(CHAPTERS.glob("*.md")) + sorted(APPENDIX.glob("*.md"))
    if not sources:
        raise SystemExit("[error] 원고 파일을 찾을 수 없습니다.")

    cover_uri = "data:image/svg+xml;base64," + base64.b64encode(
        cover_svg().encode("utf-8")
    ).decode("ascii")

    toc, body = [], []
    for i, path in enumerate(sources, 1):
        md = path.read_text(encoding="utf-8")
        title = first_heading(md, path.stem)
        anchor = slugify(i)
        toc.append(f'<li><a href="#{anchor}">{html.escape(title)}</a></li>')
        body.append(
            f'<section class="doc" id="{anchor}">{render_blocks(md.splitlines())}'
            f'<a class="totop" href="#top">▲ 목차로</a></section>'
        )

    page = f"""<!DOCTYPE html>
<html lang="{LANG}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>{html.escape(TITLE)} — {html.escape(SUBTITLE)}</title>
<meta name="author" content="{html.escape(AUTHOR)}"/>
<style>{CSS}{EXTRA_CSS}</style>
</head>
<body id="top">
<img class="cover" src="{cover_uri}" alt="{html.escape(TITLE)} 표지"/>
<nav class="toc"><h2>목차</h2><ol>{''.join(toc)}</ol></nav>
{''.join(body)}
<hr/>
<p style="text-align:center;font-size:.88em;opacity:.7">
{html.escape(AUTHOR)} · {html.escape(PUBLISHER)}</p>
</body>
</html>"""

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8")

    chars = len(re.sub(r"<[^>]+>|\s", "", page))
    print(f"[ok] {out}  ({out.stat().st_size:,} bytes, "
          f"문서 {len(sources)}개, 본문 약 {chars:,}자)")


def main() -> None:
    ap = argparse.ArgumentParser(description="원고 → 단일 HTML")
    ap.add_argument("-o", "--out", type=Path,
                    default=Path(__file__).resolve().parent / "dist"
                    / "부적을태우고데이터를켜다.html")
    build(ap.parse_args().out)


if __name__ == "__main__":
    main()
