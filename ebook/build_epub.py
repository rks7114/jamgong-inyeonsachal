#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_epub.py — 마크다운 원고 → EPUB 3 변환기 (표준 라이브러리만 사용)

외부 의존성(pandoc·calibre 등) 없이 동작하도록 직접 구현했다.
이 원고가 실제로 쓰는 마크다운 문법만 처리한다:
  제목(#~####) · 강조(**, *) · 표 · 인용(>) · 목록(-, 1.) ·
  코드펜스(```) · 수평선(---) · 링크 · HTML 주석(CTA 마커, 제거)

사용법:
  python ebook/build_epub.py                    # ebook/dist/*.epub 생성
  python ebook/build_epub.py --out ebook/dist/book.epub
"""
from __future__ import annotations

import argparse
import html
import re
import struct
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAPTERS = ROOT / "ebook" / "chapters"
APPENDIX = ROOT / "ebook" / "appendix"

TITLE = "부적을 태우고 데이터를 켜다"
SUBTITLE = "사주 오행으로 찾는 나의 인연 도량"
AUTHOR = "제운 박충호"
PUBLISHER = "잼공 연구소"
LANG = "ko"
UID = "urn:uuid:jamgong-inyeonsachal-guide-v1"

CSS = """\
html { -epub-hyphens: auto; }
body { margin: 1em; line-height: 1.7; word-break: keep-all; }
h1 { font-size: 1.6em; line-height: 1.35; margin: 1.2em 0 0.8em;
     padding-bottom: 0.4em; border-bottom: 3px solid #444; }
h2 { font-size: 1.25em; margin: 1.8em 0 0.6em;
     padding-left: 0.5em; border-left: 5px solid #666; }
h3 { font-size: 1.08em; margin: 1.4em 0 0.5em; }
h4 { font-size: 1em; margin: 1.2em 0 0.4em; }
p { margin: 0.7em 0; text-align: justify; }
strong { font-weight: bold; }
blockquote { margin: 1.1em 0; padding: 0.8em 1em;
             background: #f5f5f5; border-left: 4px solid #999; }
blockquote p { margin: 0.45em 0; }
table { border-collapse: collapse; width: 100%; margin: 1.1em 0;
        font-size: 0.9em; }
th, td { border: 1px solid #bbb; padding: 0.45em 0.6em; text-align: left; }
th { background: #eee; font-weight: bold; }
pre { background: #f0f0f0; padding: 0.8em; overflow-x: auto;
      font-size: 0.82em; line-height: 1.45; white-space: pre-wrap; }
code { font-family: monospace; }
hr { border: 0; border-top: 1px solid #ccc; margin: 1.6em 0; }
ul, ol { margin: 0.7em 0; padding-left: 1.5em; }
li { margin: 0.3em 0; }
a { color: #0a58a0; text-decoration: underline; }
em { font-style: italic; }
.chapter-nav { font-size: 0.9em; color: #666; font-style: italic; }
"""


# ---------- 인라인 변환 ----------

def inline(text: str) -> str:
    """인라인 마크다운 → XHTML. 이스케이프를 먼저 하고 태그를 넣는다."""
    out = html.escape(text, quote=False)
    # 코드 (다른 변환보다 먼저 보호)
    out = re.sub(r"`([^`]+)`", lambda m: f"<code>{m.group(1)}</code>", out)
    # 링크
    out = re.sub(r"\[([^\]]+)\]\(([^)]+)\)",
                 lambda m: f'<a href="{html.escape(m.group(2), quote=True)}">{m.group(1)}</a>',
                 out)
    # 굵게 → 기울임 순서로 (** 먼저)
    out = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", out)
    out = re.sub(r"(?<![*\w])\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", out)
    return out


# ---------- 블록 변환 ----------

def split_row(line: str) -> list[str]:
    return [c.strip() for c in line.strip().strip("|").split("|")]


def is_sep(line: str) -> bool:
    return bool(re.fullmatch(r"\|?[\s:\-|]+\|?", line.strip())) and "-" in line


def render_blocks(lines: list[str]) -> str:
    """블록 단위 파싱. blockquote 내부는 재귀 처리한다."""
    out: list[str] = []
    i = 0
    n = len(lines)

    while i < n:
        raw = lines[i]
        line = raw.rstrip()
        stripped = line.strip()

        # 빈 줄
        if not stripped:
            i += 1
            continue

        # HTML 주석 (CTA 마커) 제거
        if stripped.startswith("<!--"):
            while i < n and "-->" not in lines[i]:
                i += 1
            i += 1
            continue

        # 코드 펜스
        if stripped.startswith("```"):
            i += 1
            buf = []
            while i < n and not lines[i].strip().startswith("```"):
                buf.append(html.escape(lines[i].rstrip("\n"), quote=False))
                i += 1
            i += 1
            out.append("<pre><code>" + "\n".join(buf) + "</code></pre>")
            continue

        # 수평선
        if re.fullmatch(r"-{3,}|\*{3,}|_{3,}", stripped):
            out.append("<hr/>")
            i += 1
            continue

        # 제목
        m = re.match(r"(#{1,6})\s+(.*)", stripped)
        if m:
            lvl = min(len(m.group(1)), 6)
            out.append(f"<h{lvl}>{inline(m.group(2))}</h{lvl}>")
            i += 1
            continue

        # 표
        if stripped.startswith("|") and i + 1 < n and is_sep(lines[i + 1]):
            head = split_row(stripped)
            i += 2
            body = []
            while i < n and lines[i].strip().startswith("|"):
                body.append(split_row(lines[i].strip()))
                i += 1
            t = ["<table>", "<thead><tr>"]
            t += [f"<th>{inline(c)}</th>" for c in head]
            t.append("</tr></thead><tbody>")
            for row in body:
                t.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in row) + "</tr>")
            t.append("</tbody></table>")
            out.append("".join(t))
            continue

        # 인용 — 연속된 > 블록을 모아 재귀 처리
        if stripped.startswith(">"):
            buf = []
            while i < n and lines[i].strip().startswith(">"):
                buf.append(re.sub(r"^\s*>\s?", "", lines[i].rstrip()))
                i += 1
            out.append("<blockquote>" + render_blocks(buf) + "</blockquote>")
            continue

        # 목록 (들여쓰기된 하위 항목은 상위 항목에 이어 붙임)
        m_ul = re.match(r"[-*+]\s+(.*)", stripped)
        m_ol = re.match(r"\d+[.)]\s+(.*)", stripped)
        if m_ul or m_ol:
            tag = "ul" if m_ul else "ol"
            items: list[str] = []
            while i < n:
                cur = lines[i].rstrip()
                if not cur.strip():
                    # 목록 뒤 빈 줄이 나오고 다음이 목록이 아니면 종료
                    nxt = lines[i + 1].strip() if i + 1 < n else ""
                    if not re.match(r"([-*+]|\d+[.)])\s+", nxt):
                        break
                    i += 1
                    continue
                mm = re.match(r"\s*(?:[-*+]|\d+[.)])\s+(.*)", cur)
                if mm and not cur.startswith(("  ", "\t")):
                    items.append(inline(mm.group(1)))
                elif cur.startswith(("  ", "\t")) and items:
                    sub = re.sub(r"^\s*(?:[-*+]|\d+[.)])?\s*", "", cur)
                    items[-1] += "<br/>" + inline(sub)
                else:
                    break
                i += 1
            out.append(f"<{tag}>" + "".join(f"<li>{x}</li>" for x in items) + f"</{tag}>")
            continue

        # 문단 — 연속 줄을 하나로
        buf = [stripped]
        i += 1
        while i < n:
            nxt = lines[i].rstrip()
            s = nxt.strip()
            if (not s or s.startswith(("#", ">", "|", "```", "<!--"))
                    or re.fullmatch(r"-{3,}", s)
                    or re.match(r"([-*+]|\d+[.)])\s+", s)):
                break
            buf.append(s)
            i += 1
        para = inline(" ".join(buf))
        cls = ' class="chapter-nav"' if para.startswith("<em>") else ""
        out.append(f"<p{cls}>{para}</p>")

    return "".join(out)


def md_to_xhtml(md: str, title: str) -> str:
    body = render_blocks(md.splitlines())
    return f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="{LANG}">
<head><meta charset="utf-8"/><title>{html.escape(title)}</title>
<link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>{body}</body></html>"""


# ---------- 표지 이미지 (SVG) ----------
# EPUB 3은 SVG를 cover-image로 지원한다. 래스터 생성 도구(PIL 등) 없이도
# 판매 플랫폼 썸네일에 쓸 표지를 만들기 위해 벡터로 그린다.
# 색은 오행 팔레트를 그대로 쓴다 — 木 청록 / 火 적 / 土 황토 / 金 은백 / 水 감청.

_MOK, _HWA, _TO, _GEUM, _SU = "#3E8E6E", "#C4453A", "#C79A3E", "#8E969D", "#2C4A6B"
_EMBER = "#D9612C"
# 표지 전용 — 채도를 낮춰 인쇄물의 무게감에 가깝게 잡은 색
_BRASS = "#B08D3F"   # 금박 대신 놋쇠빛. 가는 선과 소제목에만 쓴다
_ASH   = "#A9694A"   # 사그라드는 불빛 — '태우고'
_LIT   = "#63A98C"   # 켜지는 빛 — '켜다'
_LINE  = "#3A464C"   # 격자 윤곽선
_CHIP_ROWS = [  # 5x5 관계행렬 모티프 (행마다 한 칸씩 회전하는 구조)
    [(_MOK,1.0),(_MOK,.5),(_HWA,.35),(_GEUM,.3),(_SU,.4)],
    [(_HWA,.35),(_HWA,1.0),(_TO,.5),(_GEUM,.25),(_SU,.3)],
    [(_MOK,.3),(_TO,.35),(_TO,1.0),(_GEUM,.5),(_SU,.25)],
    [(_MOK,.2),(_HWA,.3),(_TO,.3),(_GEUM,1.0),(_SU,.5)],
    [(_MOK,.5),(_HWA,.2),(_TO,.25),(_GEUM,.35),(_SU,1.0)],
]


def cover_svg() -> str:
    """
    표지 레이아웃 (1200x1800, 2:3)
      상단  제호 블록      134 ~  598
      중단  5x5 관계행렬    642 ~ 1496   ← 판면 폭(150~1050)을 꽉 채운다
      하단  서지 블록      1556 ~ 1690   ← 저자·발행을 좌측 축에 세로로 묶음
      위아래 여백을 100px 안팎으로 맞춰 서지가 밑단에 몰리지 않게 한다.
            구분선 폭(308)을 저자명 폭에 맞춰 블록으로 묶는다
    모든 요소가 x=150 좌측 축을 공유한다.
    """
    W, H = 1200, 1800
    MARGIN = 150

    # 5x5 관계행렬 — 칸을 색으로 꽉 채우면 색견본처럼 보인다.
    # 선으로만 그리고 대각선(比, 자기 자신과의 관계) 다섯 칸만 채운다.
    size, gap, gx0, gy0 = 150, 26, MARGIN, 642
    cells = []
    for r, row in enumerate(_CHIP_ROWS):
        for c, (col, _) in enumerate(row):
            x = gx0 + c * (size + gap)
            y = gy0 + r * (size + gap)
            if r == c:  # 대각선 — 오행 본색을 앉힌다
                cells.append(f'<rect x="{x}" y="{y}" width="{size}" height="{size}" '
                             f'rx="2" fill="{col}" fill-opacity=".82"/>')
            else:
                cells.append(f'<rect x="{x}" y="{y}" width="{size}" height="{size}" '
                             f'rx="2" fill="{col}" fill-opacity=".055" '
                             f'stroke="{_LINE}" stroke-opacity=".5" stroke-width="1"/>')
    grid_bottom = gy0 + 4 * (size + gap) + size

    return f"""<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0C1417"/>
      <stop offset="55%" stop-color="#101A1E"/>
      <stop offset="100%" stop-color="#080E11"/>
    </linearGradient>
    <radialGradient id="ember" cx="16%" cy="11%" r="46%">
      <stop offset="0%" stop-color="{_EMBER}" stop-opacity=".30"/>
      <stop offset="100%" stop-color="{_EMBER}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="46%" r="72%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity=".42"/>
    </radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="{W}" height="{H}" fill="url(#paper)"/>
  <rect width="{W}" height="{H}" fill="url(#ember)"/>
  <rect width="{W}" height="{H}" filter="url(#grain)" opacity=".05"/>
  <rect width="{W}" height="{H}" fill="url(#vignette)"/>
  <rect x="56" y="56" width="{W-112}" height="{H-112}" fill="none"
        stroke="{_BRASS}" stroke-opacity=".22" stroke-width="1"/>

  <text x="{MARGIN}" y="196" fill="{_BRASS}" font-size="25" letter-spacing="15"
        font-family="sans-serif">JAMGONG INYEONSACHAL</text>

  <text x="{MARGIN}" y="336" fill="{_ASH}" font-size="116" font-weight="bold"
        font-family="sans-serif" letter-spacing="-2">부적을 태우고</text>
  <text x="{MARGIN}" y="470" fill="{_LIT}" font-size="116" font-weight="bold"
        font-family="sans-serif" letter-spacing="-2">데이터를 켜다</text>

  <line x1="{MARGIN}" y1="524" x2="{W-MARGIN}" y2="524"
        stroke="{_BRASS}" stroke-opacity=".38" stroke-width="1"/>
  <text x="{MARGIN}" y="576" fill="#A6B0B4" font-size="40"
        font-family="sans-serif">사주 오행으로 찾는 나의 인연 도량</text>
  <text x="{MARGIN}" y="622" fill="#6A767B" font-size="27" letter-spacing="1"
        font-family="sans-serif">생년월일시 오행 분석 · 전국 사찰 매칭</text>

  {''.join(cells)}

  <line x1="{MARGIN}" y1="{grid_bottom + 62}" x2="{MARGIN + 308}" y2="{grid_bottom + 62}"
        stroke="{_BRASS}" stroke-opacity=".75" stroke-width="2"/>
  <text x="{MARGIN}" y="{grid_bottom + 140}" fill="#E8E3D9" font-size="54" font-weight="bold"
        font-family="sans-serif">{AUTHOR}</text>
  <text x="{MARGIN}" y="{grid_bottom + 196}" fill="#78848A" font-size="28" letter-spacing="1"
        font-family="sans-serif">{PUBLISHER}</text>
</svg>"""


# ---------- 표지 이미지 (래스터 우선) ----------

COVER_DIR = ROOT / "ebook"
_RASTER_CANDIDATES = (("cover.png", "image/png"),
                      ("cover.jpg", "image/jpeg"),
                      ("cover.jpeg", "image/jpeg"))


def raster_cover() -> tuple[Path, str] | None:
    """
    ebook/cover.png(또는 .jpg)가 있으면 그것을 표지로 쓴다.
    없으면 코드로 그린 SVG로 돌아간다. 디자이너가 만든 표지를 넣을 때
    빌더를 고치지 않아도 되게 하려는 것이다.
    """
    for name, mime in _RASTER_CANDIDATES:
        p = COVER_DIR / name
        if p.is_file():
            return p, mime
    return None


def image_size(path: Path) -> tuple[int, int] | None:
    """PNG/JPEG 크기를 표준 라이브러리만으로 읽는다 (규격 경고용)."""
    data = path.read_bytes()
    if data[:8] == b"\x89PNG\r\n\x1a\n" and data[12:16] == b"IHDR":
        return struct.unpack(">II", data[16:24])
    if data[:2] == b"\xff\xd8":
        i = 2
        while i + 9 < len(data):
            if data[i] != 0xFF:
                i += 1
                continue
            marker, seglen = data[i + 1], struct.unpack(">H", data[i + 2:i + 4])[0]
            if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
                h, w = struct.unpack(">HH", data[i + 5:i + 9])
                return w, h
            i += 2 + seglen
    return None


def check_cover(path: Path) -> None:
    size = image_size(path)
    if not size:
        print(f"[warn] {path.name} 크기를 읽지 못했습니다 — 규격 확인을 건너뜁니다.")
        return
    w, h = size
    print(f"[표지] {path.name}  {w}x{h}")
    if h < 2560:
        print(f"[warn] 세로 {h}px — 판매 플랫폼 등록은 2560px 이상을 권장합니다.")
    ratio = h / w if w else 0
    if not 1.45 <= ratio <= 1.65:
        print(f"[warn] 비율 1:{ratio:.2f} — 2:3(1:1.5) 안팎을 권장합니다.")


# ---------- EPUB 조립 ----------

def first_heading(md: str, fallback: str) -> str:
    for line in md.splitlines():
        m = re.match(r"#\s+(.*)", line.strip())
        if m:
            return re.sub(r"\*\*|`", "", m.group(1)).strip()
    return fallback


def build(out_path: Path) -> None:
    docs = []  # (id, filename, title, xhtml)

    # 표지 — ebook/cover.png이 있으면 그것을, 없으면 코드로 그린 SVG를 쓴다
    art = raster_cover()
    if art:
        art_path, cover_mime = art
        cover_name = "cover" + art_path.suffix.lower()
        check_cover(art_path)
    else:
        art_path, cover_name, cover_mime = None, "cover.svg", "image/svg+xml"

    cover_xhtml = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="{LANG}">
<head><meta charset="utf-8"/><title>{html.escape(TITLE)}</title>
<style>body{{margin:0;padding:0;text-align:center}}
img{{max-width:100%;max-height:100vh;object-fit:contain}}</style></head>
<body><img src="{cover_name}" alt="{html.escape(TITLE)}"/></body></html>"""
    docs.append(("cover", "cover.xhtml", TITLE, cover_xhtml))

    sources = sorted(CHAPTERS.glob("*.md")) + sorted(APPENDIX.glob("*.md"))
    if not sources:
        raise SystemExit("[error] 원고 파일을 찾을 수 없습니다.")

    for idx, path in enumerate(sources, 1):
        md = path.read_text(encoding="utf-8")
        title = first_heading(md, path.stem)
        fid = f"doc{idx:02d}"
        docs.append((fid, f"{fid}.xhtml", title, md_to_xhtml(md, title)))

    # nav.xhtml
    nav_items = "".join(
        f'<li><a href="{fn}">{html.escape(t)}</a></li>' for _, fn, t, _ in docs
    )
    nav = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="{LANG}">
<head><meta charset="utf-8"/><title>목차</title>
<link rel="stylesheet" type="text/css" href="style.css"/></head>
<body><nav epub:type="toc" id="toc"><h1>목차</h1><ol>{nav_items}</ol></nav></body></html>"""

    # toc.ncx (EPUB2 호환 — 구형 리더 대응)
    ncx_points = "".join(
        f'<navPoint id="np{i}" playOrder="{i}"><navLabel><text>{html.escape(t)}'
        f'</text></navLabel><content src="{fn}"/></navPoint>'
        for i, (_, fn, t, _) in enumerate(docs, 1)
    )
    ncx = f"""<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head><meta name="dtb:uid" content="{UID}"/><meta name="dtb:depth" content="1"/>
<meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head>
<docTitle><text>{html.escape(TITLE)}</text></docTitle>
<navMap>{ncx_points}</navMap></ncx>"""

    manifest = "".join(
        f'<item id="{fid}" href="{fn}" media-type="application/xhtml+xml"/>'
        for fid, fn, _, _ in docs
    )
    spine = "".join(f'<itemref idref="{fid}"/>' for fid, _, _, _ in docs)

    opf = f"""<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="bookid">{UID}</dc:identifier>
<dc:title>{html.escape(TITLE)}</dc:title>
<dc:creator>{html.escape(AUTHOR)}</dc:creator>
<dc:publisher>{html.escape(PUBLISHER)}</dc:publisher>
<dc:language>{LANG}</dc:language>
<dc:description>{html.escape(SUBTITLE)}</dc:description>
<meta property="dcterms:modified">2026-07-31T00:00:00Z</meta>
<meta name="cover" content="cover-img"/>
</metadata>
<manifest>{manifest}
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
<item id="css" href="style.css" media-type="text/css"/>
<item id="cover-img" href="{cover_name}" media-type="{cover_mime}" properties="cover-image"/>
</manifest>
<spine toc="ncx"><itemref idref="nav"/>{spine}</spine>
</package>"""

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out_path, "w") as z:
        # mimetype은 반드시 첫 항목이며 무압축이어야 한다
        z.writestr(zipfile.ZipInfo("mimetype"), "application/epub+zip",
                   compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml",
                   '<?xml version="1.0" encoding="utf-8"?>\n'
                   '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">'
                   '<rootfiles><rootfile full-path="OEBPS/content.opf" '
                   'media-type="application/oebps-package+xml"/></rootfiles></container>',
                   compress_type=zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/content.opf", opf, zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/nav.xhtml", nav, zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/toc.ncx", ncx, zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/style.css", CSS, zipfile.ZIP_DEFLATED)
        if art_path:
            z.write(art_path, f"OEBPS/{cover_name}")
        else:
            z.writestr("OEBPS/cover.svg", cover_svg(), zipfile.ZIP_DEFLATED)
        for _, fn, _, xhtml in docs:
            z.writestr(f"OEBPS/{fn}", xhtml, zipfile.ZIP_DEFLATED)

    print(f"[ok] {out_path}  ({out_path.stat().st_size:,} bytes, 문서 {len(docs)}개)")


def main() -> None:
    ap = argparse.ArgumentParser(description="마크다운 원고 → EPUB 3 변환")
    ap.add_argument("--out", default=str(ROOT / "ebook" / "dist" / "부적을태우고데이터를켜다.epub"))
    args = ap.parse_args()
    build(Path(args.out))


if __name__ == "__main__":
    main()
