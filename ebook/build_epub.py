#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_epub.py — 마크다운 원고 → EPUB 3 변환기 (표준 라이브러리만 사용)

외부 의존성(pandoc·calibre 등) 없이 동작하도록 직접 구현했다.
이 원고가 실제로 쓰는 마크다운 문법만 처리한다:
  제목(#~####) · 강조(**, *) · 표 · 인용(>) · 목록(-, 1.) ·
  코드펜스(```) · 수평선(---) · 링크 · HTML 주석(CTA 마커, 제거)

사용법:
  python ebook/build_epub.py                    # dist/*.epub 생성
  python ebook/build_epub.py --out dist/book.epub
"""
from __future__ import annotations

import argparse
import html
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAPTERS = ROOT / "ebook" / "chapters"
APPENDIX = ROOT / "ebook" / "appendix"

TITLE = "부적을 태우고 데이터를 켜다"
SUBTITLE = "사주 오행으로 찾는 나의 인연 도량"
AUTHOR = "박충호"
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


# ---------- EPUB 조립 ----------

def first_heading(md: str, fallback: str) -> str:
    for line in md.splitlines():
        m = re.match(r"#\s+(.*)", line.strip())
        if m:
            return re.sub(r"\*\*|`", "", m.group(1)).strip()
    return fallback


def build(out_path: Path) -> None:
    docs = []  # (id, filename, title, xhtml)

    # 표지
    cover_md = (f"# {TITLE}\n\n## {SUBTITLE}\n\n---\n\n**{AUTHOR}** 지음\n\n"
                f"잼공인연사찰 공식 가이드\n\n"
                f"발행 · {PUBLISHER}\n\n"
                f"웹 서비스 · https://jamgong-inyeonsachal.vercel.app\n")
    docs.append(("cover", "cover.xhtml", TITLE, md_to_xhtml(cover_md, TITLE)))

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
</metadata>
<manifest>{manifest}
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
<item id="css" href="style.css" media-type="text/css"/>
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
        for _, fn, _, xhtml in docs:
            z.writestr(f"OEBPS/{fn}", xhtml, zipfile.ZIP_DEFLATED)

    print(f"[ok] {out_path}  ({out_path.stat().st_size:,} bytes, 문서 {len(docs)}개)")


def main() -> None:
    ap = argparse.ArgumentParser(description="마크다운 원고 → EPUB 3 변환")
    ap.add_argument("--out", default=str(ROOT / "dist" / "부적을태우고데이터를켜다.epub"))
    args = ap.parse_args()
    build(Path(args.out))


if __name__ == "__main__":
    main()
