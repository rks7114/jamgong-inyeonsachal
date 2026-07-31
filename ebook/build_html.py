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

from strip_service import strip_service, keep_service

NO_CTA = False
PREVIEW = False
COLOR = False

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_epub import (  # noqa: E402
    AUTHOR, CHAPTERS, APPENDIX, CSS, LANG, PUBLISHER, SUBTITLE, TITLE,
    cover_svg, first_heading, raster_cover, render_blocks,
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

/* 속표지 — 종이(PDF)에서만 보인다. 화면에서는 표지 바로 아래라 군더더기다. */
.titlepage { display: none; }

/* ── 인쇄(PDF) 조판 ─────────────────────────────────────────────
   화면과 종이는 읽는 방식이 다르다. 화면은 스크롤이고 종이는 넘김이다.
   그래서 서체·여백·끊는 자리를 따로 잡는다.

   본문을 명조(세리프)로 바꾸는 것이 가장 큰 변화다. 고딕은 화면에서
   또렷하지만 긴 글을 종이로 읽을 때는 명조가 눈이 덜 피로하다.

   서체 이름을 붙여 쓴 "NanumMyeongjo"가 맨 앞인 데는 이유가 있다.
   크로미움은 이 이름만 알아듣는다. "Nanum Myeongjo"처럼 띄우면
   못 찾고 엉뚱한 중국어 서체로 떨어진다. 실제로 그렇게 한 판을
   구웠다가 한글이 전부 중국어 고딕으로 박힌 적이 있다.

   뒤에 UnBatang 을 세운 것도 같은 사고를 막기 위함이다. 나눔명조에는
   한자가 없다. 이 책은 木火土金水를 수백 번 쓰므로, 한자를 받아 줄
   명조 하나를 반드시 뒤에 놓아야 한다.

   Noto Serif CJK 는 쓰지 않는다. 크로미움이 이 서체를 PDF 에 심을 때
   글자마다 그림(Type3)으로 바꿔 넣어, 파일이 부풀고 글자 검색이
   어긋난다. 서체가 좋아도 결과물이 나쁘면 쓸 수 없다.

   빌드 환경 준비:
       apt-get install -y fonts-nanum fonts-unfonts-core                */
@page {
  size: 148mm 210mm;              /* A5 — 전자책 PDF 로 흔한 판형 */
  margin: 27mm 23mm 31mm;         /* 아래를 넉넉히 — 쪽번호가 앉을 자리 */
}
@media print {
  html { font-size: 10pt; }
  body { max-width: none; margin: 0; padding: 0;
         font-family: "NanumMyeongjo", "Nanum Myeongjo", "나눔명조",
                      "UnBatang", "Baekmuk Batang", "AppleMyungjo",
                      "Batang", "바탕", serif;
         font-weight: 400;
         line-height: 1.98; text-align: justify;
         hyphens: none; color: #231f1a; }   /* 순검정은 인쇄물의 색이다 */
  /* 배경은 칠하지 않는다. 화면용은 PDF 단계에서 종이를 밑에 까는데,
     여기서 흰색을 칠하면 그 종이를 정확히 판면 크기로 덮어 버린다. */

  /* 화면에서는 낱말이 잘리지 않게 keep-all 을 쓰지만, 종이는 반대다.
     좁은 A5 단에서 낱말을 통째로 넘기면 앞줄에 구멍이 뚫린다.
     종이책이 음절 단위로 끊는 데는 이유가 있다.                    */
  body, p, li, td, th, blockquote { word-break: normal; line-break: normal; }

  nav.toc { break-after: page; background: none; border: 0;
            padding: 0; margin: 0; }
  nav.toc ol { columns: 1; }
  nav.toc h2 { font-size: 1.25rem; text-align: center; letter-spacing: .35em;
               margin: 0 0 2.6em; font-weight: 400; }
  nav.toc li { font-size: .95em; margin: .45em 0; text-align: left; }
  nav.toc a { color: inherit; text-decoration: none;
              display: flex; align-items: baseline; gap: .45em; }
  nav.toc .t { flex: 0 1 auto; }
  nav.toc .d { flex: 1 1 auto; min-width: 1.5em; align-self: flex-end;
               border-bottom: .4pt dotted #aaa; transform: translateY(-.3em); }
  nav.toc .p { flex: 0 0 auto; min-width: 2.2em; text-align: right;
               font-size: .95em; }
  .totop, a[href^="http"]::after { display: none; }
  a { color: inherit; text-decoration: none; }

  /* 장은 새 쪽에서 시작한다. 제목을 쪽 위에 딱 붙이지 않고 한 뼘
     내려 앉히면 넘길 때마다 숨 쉴 자리가 생긴다. */
  section.doc { break-before: page; border-top: 0; margin-top: 0;
                padding-top: 0; }
  section.doc:first-of-type { break-before: avoid; }

  /* 장 도비라 — 제목 위에 장식을 놓고 한 뼘 더 내려 앉힌다.
     넘길 때마다 '새 장이 시작한다'가 눈에 먼저 들어와야 한다. */
  section.doc > h1:first-child::before {
    content: "❖"; display: block; text-align: center;
    font-size: .82rem; letter-spacing: .9em; color: #9a8f7d;
    margin: 0 0 9mm; font-weight: 400; }
  h1 { font-size: 1.5rem; font-weight: 400; letter-spacing: .01em;
       line-height: 1.5; text-align: left; border: 0;
       margin: 0 0 2.6em; padding: 20mm 0 .7em;
       border-bottom: .6pt solid #4a423a; }
  h2 { font-size: 1.1rem; font-weight: 700; letter-spacing: .01em;
       margin: 2.4em 0 .9em; border: 0; break-after: avoid;
       text-align: left; }
  h3 { font-size: 1rem; font-weight: 700; margin: 1.8em 0 .5em;
       break-after: avoid; text-align: left; }

  /* 한국 책의 관례 — 문단 첫 줄을 들여쓰고 문단 사이는 띄우지 않는다.
     다만 제목·인용·표 바로 뒤의 첫 문단은 들여쓰지 않는다. */
  p { margin: 0; text-indent: 1em; }
  h1 + p, h2 + p, h3 + p, blockquote + p, table + p, ul + p, ol + p,
  hr + p, pre + p, p.math + p { text-indent: 0; }

  /* 인용은 색칠한 상자가 아니라 여백으로 구분한다. 종이에서 회색
     바탕은 잉크만 먹고 품위를 떨어뜨린다. */
  blockquote { break-inside: avoid; background: none; border: 0;
               border-left: .8pt solid #999;
               margin: 1.5em 0 1.5em 1.2em; padding: .1em 0 .1em 1.1em;
               font-size: .95em; line-height: 1.72; }
  blockquote p { text-indent: 0; }

  /* 표는 세로줄 없이 가로 괘선만 — 인쇄물의 기본형 */
  table { break-inside: avoid; width: 100%; font-size: .87em;
          border-collapse: collapse; margin: 1.4em 0;
          border-top: 1pt solid #222; border-bottom: 1pt solid #222; }
  th, td { border: 0; border-bottom: .4pt solid #ccc;
           padding: .42em .5em; text-align: left; }
  th { background: none; font-weight: 700; border-bottom: .6pt solid #666; }
  tr:last-child td { border-bottom: 0; }

  ul, ol { margin: 1em 0 1em 1.2em; padding-left: .8em; }
  li { margin: .25em 0; }

  /* 고정폭 서체에도 한글이 들어간다. 한글 없는 고정폭을 쓰면 그 글자만
     엉뚱한 서체로 떨어지므로 나눔고딕코딩을 앞에 세운다. */
  pre { break-inside: avoid; font-size: .8em; line-height: 1.55;
        background: #f6f6f4; border: 0; border-left: .8pt solid #bbb;
        padding: .7em .9em; margin: 1.3em 0; }
  pre, code, code * { font-family: "NanumGothicCoding", "D2Coding",
                      "DejaVu Sans Mono", "UnDotum", monospace; }
  code { font-size: .92em; }

  /* 한글에 기울임은 쓰지 않는다. 기울임체가 없는 서체는 다른 서체로
     통째로 갈아타 버려서, 그 줄만 얼굴이 달라진다. */
  em, i, .chapter-nav { font-style: normal; }
  .chapter-nav { display: block; font-size: .92em; color: #555;
                 line-height: 1.65; }
  .chapter-nav em { color: #333; }

  /* 가운뎃점 세 개 — 장면이 바뀌는 자리 */
  hr { border: 0; height: auto; margin: 1.9em 0; text-align: center;
       page-break-after: avoid; }
  hr::after { content: "· · ·"; letter-spacing: .5em; color: #777;
              font-size: .95em; }

  /* 표지는 여기서 그리지 않는다. build_pdf.py 가 여백 0 짜리 쪽으로 따로
     구워 맨 앞에 붙인다. 크로미움이 쪽마다 다른 여백(@page cover)을
     받아 주지 않아, 여기 두면 표지에 흰 테가 남거나 아래가 잘린다. */
  img.cover { display: none; }

  .titlepage { display: block; break-after: page; text-align: center;
               padding-top: 52mm; }
  .titlepage .t { font-size: 1.9rem; letter-spacing: .04em; line-height: 1.4; }
  .titlepage .s { font-size: .98rem; color: #444; margin-top: 1.4em;
                  letter-spacing: .02em; }
  .titlepage .a { font-size: 1rem; margin-top: 26mm; }
  .titlepage .pub { font-size: .88rem; color: #555; margin-top: 1em; }

  /* 한 줄만 남기고 넘어가는 것을 막는다 */
  p, li { orphans: 2; widows: 2; }
}
/* ── 색 (화면용) ──────────────────────────────────────────────
   표지에서 가져온 색이다. 새로 고르지 않는 이유는 하나 —
   책은 표지와 속이 같은 얼굴이어야 한다.

   본문 글자는 먹빛 그대로 둔다. 긴 글에 색을 입히면 읽기가 나빠진다.
   색은 '여기가 어디인가'를 알려 주는 자리에만 쓴다.

   초록은 표지 바탕색(#123329)을 그대로 쓰지 않고 밝혔다. 바탕색을
   종이 위에 글자로 얹으면 그냥 검정으로 읽힌다 — 값이 아니라
   자리를 봐야 한다.                                              */
@media print {
  .clr h1 { color: #1C5E49; }
  .clr h2, .clr h3 { color: #1C5E49; }
  /* 강조는 초록으로 하되 아주 깊게. 중간 초록으로 두면 볼드가 773군데라
     쪽마다 링크가 널린 것처럼 보인다. 색은 알아채기 직전까지만 쓴다. */
  .clr strong { color: #1B3A31; }

  /* 장 도비라 — 마름모를 키워 금빛으로 세우고, 제목 밑은 홑줄이 아니라
     겹줄로 받친다. 양장본 속표지에서 쓰는 괘선이다. 색만 바꾸는 것과
     선을 바꾸는 것은 다르다 — 눈에 먼저 들어오는 쪽은 선이다. */
  .clr section.doc > h1:first-child::before {
    content: "❖"; color: #A8791F; font-size: .96rem;
    letter-spacing: 1.1em; margin-bottom: 10mm; }
  .clr h1 { border-bottom: 3pt double #A8791F; }

  /* 제사(題辭) — 37장이 전부 인용문 한 줄로 열린다. 원래는 본문 인용과
     같은 모양이라 그냥 인용으로 읽혔다. 왼쪽 괘선을 떼고 가운데로 모아
     따로 세운다. 두문자(드롭캡)를 쓰지 않은 이유도 이것이다 —
     장의 첫 글자가 인용문의 글자라 내려 앉힐 자리가 없다. */
  .clr section.doc > h1 + blockquote {
    border-left: 0; color: #4A5C52;
    margin: .2em 8mm 0; padding: 0;
    font-size: .96em; line-height: 1.78; }
  /* 가운데로 모으는 글은 어절 중간에서 끊기면 안 된다. 본문은 줄을 꽉
     채워야 하니 그냥 두지만, 여기는 keep-all 로 어절을 지킨다. */
  .clr section.doc > h1 + blockquote p {
    text-align: center; word-break: keep-all; text-wrap: balance; }

  .clr blockquote { border-left-color: #C9A75C; }
  .clr hr::after { color: #C9A75C; }
  .clr nav.toc h2 { color: #1C5E49; }
  .clr nav.toc .d { border-bottom-color: #C7B48A; }
  .clr .titlepage .t { color: #1C5E49; }
  .clr .titlepage .s, .clr .titlepage .pub { color: #6B5E44; }

  /* 회색 바탕은 크림색 종이 위에서 차갑게 뜬다. 종이 쪽으로 당긴다. */
  .clr pre { background: #F4F0E6; border-left-color: #C9A75C; }
  .clr code { color: #17513E; }

  .clr table { border-top-color: #1C5E49; border-bottom-color: #1C5E49; }
  .clr th { color: #1C5E49; border-bottom-color: #A8791F; }
}

/* 화면에는 쪽수도 점선도 뜻이 없다 — 스크롤에는 쪽이 없다. */
@media screen {
  nav.toc { break-after: auto; }
  nav.toc a { display: inline; }
  nav.toc .d, nav.toc .p { display: none; }
}
"""


def slugify(idx: int) -> str:
    return f"doc{idx:02d}"


def build(out: Path) -> None:
    sources = sorted(CHAPTERS.glob("*.md")) + sorted(APPENDIX.glob("*.md"))
    if PREVIEW:                                  # 미리보기판 — 제1장까지만
        sources = [p for p in sources if p.name.startswith(("01-", "부록G"))]
    if not sources:
        raise SystemExit("[error] 원고 파일을 찾을 수 없습니다.")

    # EPUB과 같은 규칙 — ebook/cover.png이 있으면 그것을, 없으면 SVG를 심는다
    art = raster_cover()
    if art:
        art_path, mime = art
        cover_uri = f"data:{mime};base64," + base64.b64encode(
            art_path.read_bytes()
        ).decode("ascii")
    else:
        cover_uri = "data:image/svg+xml;base64," + base64.b64encode(
            cover_svg().encode("utf-8")
        ).decode("ascii")

    toc, body = [], []
    for i, path in enumerate(sources, 1):
        md = path.read_text(encoding="utf-8")
        md = strip_service(md) if NO_CTA else keep_service(md)
        title = first_heading(md, path.stem)
        anchor = slugify(i)
        # 쪽수 칸은 비워 둔다. 종이 쪽수는 조판이 끝나야 알 수 있으므로
        # build_pdf.py 가 다 구운 뒤에 이 자리에 숫자를 채워 넣는다.
        toc.append(
            f'<li><a href="#{anchor}"><span class="t">{html.escape(title)}</span>'
            f'<span class="d"></span>'
            f'<span class="p" data-pg="{anchor}"></span></a></li>')
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
<body id="top" class="{'clr' if COLOR else ''}">
<img class="cover" src="{cover_uri}" alt="{html.escape(TITLE)} 표지"/>
<div class="titlepage">
  <div class="t">{html.escape(TITLE)}</div>
  <div class="s">{html.escape(SUBTITLE)}</div>
  <div class="a">{html.escape(AUTHOR)}</div>
  <div class="pub">{html.escape(PUBLISHER)}</div>
</div>
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
                    / "소문을끄고데이터를켜다.html")
    ap.add_argument("--no-cta", action="store_true",
                    help="서비스 연결부(CTA·서비스에서 바로) 제거 — 해외판용")
    ap.add_argument("--preview", action="store_true",
                    help="미리보기판 — 제1장까지만")
    ap.add_argument("--color", action="store_true",
                    help="화면용 — 표지의 초록·금색을 조판에 얹는다")
    args = ap.parse_args()
    globals()["NO_CTA"] = args.no_cta
    globals()["PREVIEW"] = args.preview
    globals()["COLOR"] = args.color
    build(args.out)


if __name__ == "__main__":
    main()
