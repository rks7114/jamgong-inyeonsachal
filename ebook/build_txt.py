#!/usr/bin/env python3
"""
원고 전체를 텍스트 파일 하나로 묶는다.

카톡·메일·메모장 어디에 붙여넣어도 그대로 읽히는 형태다.
EPUB이나 HTML을 열 수 없는 상대에게 책을 통째로 보낼 때 쓴다.

    python ebook/build_txt.py
    python ebook/build_txt.py -o /어딘가/책.txt

본문은 build_epub.py가 만든 XHTML을 되돌려 뽑는다. 마크다운을
따로 한 번 더 해석하면 EPUB과 내용이 어긋날 수 있기 때문이다.
"""
from __future__ import annotations

import argparse
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

from strip_service import strip_service

NO_CTA = False

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_epub import (  # noqa: E402
    APPENDIX, AUTHOR, CHAPTERS, PUBLISHER, SUBTITLE, TITLE,
    first_heading, render_blocks,
)

WIDTH = 40  # 제목 밑줄 길이


class ToText(HTMLParser):
    """XHTML → 읽을 수 있는 평문. 표는 칸을 ' | '로 잇는다."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.out: list[str] = []
        self.cells: list[str] = []
        self.row: list[str] = []
        self.tag_stack: list[str] = []
        self.in_cell = False
        self.quote = 0
        self.list_no: list[int | None] = []
        self.spans: list[str] = []

    # ── 도우미
    def emit(self, s: str) -> None:
        (self.cells if self.in_cell else self.out).append(s)

    def blank(self, n: int = 1) -> None:
        while self.out and self.out[-1] == "\n":
            self.out.pop()
        self.out.append("\n" * (n + 1))

    def handle_starttag(self, tag, attrs):
        self.tag_stack.append(tag)
        if tag in ("h1", "h2", "h3", "h4"):
            self.blank()
        elif tag == "p":
            self.blank()
            if self.quote:
                self.out.append("│ ")
        elif tag == "blockquote":
            self.quote += 1
            self.blank()
        elif tag in ("ul", "ol"):
            self.blank()
            self.list_no.append(1 if tag == "ol" else None)
        elif tag == "li":
            self.out.append("\n" + ("│ " if self.quote else ""))
            if self.list_no and self.list_no[-1] is not None:
                self.out.append(f"  {self.list_no[-1]}. ")
                self.list_no[-1] += 1
            else:
                self.out.append("  · ")
        elif tag in ("th", "td"):
            self.in_cell, self.cells = True, []
        elif tag == "tr":
            self.row = []
        elif tag == "table":
            self.blank()
        elif tag == "pre":
            self.blank()
        elif tag == "hr":
            self.blank()
            self.out.append("─" * WIDTH)
            self.blank()
        elif tag == "br":
            self.out.append("\n")
        elif tag in ("sub", "sup"):
            # 평문에는 첨자가 없다. a_ij, s^T 처럼 적어야 읽힌다
            self.emit("_" if tag == "sub" else "^")
        elif tag == "span":
            # 언더브레이스 설명은 식에 붙어버리므로 괄호로 떼어낸다
            cls = dict(attrs).get("class", "")
            self.spans.append(cls)
            if cls == "ubl":
                self.emit(" (")

    def handle_endtag(self, tag):
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()
        if tag in ("h1", "h2"):
            self.out.append("\n" + ("═" if tag == "h1" else "─") * WIDTH)
            self.blank()
        elif tag in ("h3", "h4", "p", "pre"):
            self.blank()
        elif tag == "blockquote":
            self.quote = max(0, self.quote - 1)
            self.blank()
        elif tag in ("ul", "ol"):
            if self.list_no:
                self.list_no.pop()
            self.blank()
        elif tag in ("th", "td"):
            self.in_cell = False
            self.row.append(" ".join("".join(self.cells).split()))
        elif tag == "tr":
            pre = "│ " if self.quote else ""
            self.out.append("\n" + pre + " | ".join(self.row))
            self.row = []
        elif tag == "table":
            self.blank()
        elif tag == "span":
            if self.spans and self.spans.pop() == "ubl":
                self.emit(")")

    def handle_data(self, data):
        if "pre" in self.tag_stack:
            self.emit(data)
        else:
            t = re.sub(r"\s+", " ", data)
            if t.strip() or (self.out and not self.out[-1].endswith((" ", "\n"))):
                self.emit(t)

    def text(self) -> str:
        s = "".join(self.out)
        s = re.sub(r"[ \t]+\n", "\n", s)
        s = re.sub(r"\n{4,}", "\n\n\n", s)
        return s.strip()


def to_text(md: str) -> str:
    p = ToText()
    p.feed(render_blocks(md.splitlines()))
    return p.text()


def build(out: Path) -> None:
    sources = sorted(CHAPTERS.glob("*.md")) + sorted(APPENDIX.glob("*.md"))
    if not sources:
        raise SystemExit("[error] 원고 파일을 찾을 수 없습니다.")

    head = [
        "═" * WIDTH, TITLE, f"— {SUBTITLE}", "",
        f"{AUTHOR} · {PUBLISHER}", "═" * WIDTH, "", "",
        "[목차]", "",
    ]
    body = []
    for path in sources:
        md = path.read_text(encoding="utf-8")
        if NO_CTA:
            md = strip_service(md)
        head.append("  " + first_heading(md, path.stem))
        body.append(to_text(md))

    page = "\n".join(head) + "\n\n\n" + ("\n\n\n" + "─" * WIDTH + "\n\n\n").join(body)
    page += f"\n\n\n{'═' * WIDTH}\n{TITLE}\n{AUTHOR} · {PUBLISHER}\n"
    page += "잼공인연사찰 www.jamgong.kr\n"

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8")

    chars = len(re.sub(r"\s", "", page))
    print(f"[ok] {out}  ({out.stat().st_size:,} bytes, "
          f"문서 {len(sources)}개, {chars:,}자, {len(page.splitlines()):,}행)")


def main() -> None:
    ap = argparse.ArgumentParser(description="원고 → 평문 텍스트")
    ap.add_argument("-o", "--out", type=Path,
                    default=Path(__file__).resolve().parent / "dist"
                    / "소문을끄고데이터를켜다.txt")
    ap.add_argument("--no-cta", action="store_true",
                    help="서비스 연결부(CTA·서비스에서 바로) 제거 — 해외판용")
    args = ap.parse_args()
    globals()["NO_CTA"] = args.no_cta
    build(args.out)


if __name__ == "__main__":
    main()
