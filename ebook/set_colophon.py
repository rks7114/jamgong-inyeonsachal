#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
set_colophon.py — 판권의 미확정 값을 채운다

발행일·정가·ISBN은 사람이 정하는 값이다. 그래서 판권에 TBD로 박아두고
verify.py가 붙잡고 있다. 값이 정해지면 이 스크립트로 한 번에 채운다.

세 곳을 동시에 고친다.
  · 부록G 판권표          — 발행일·정가·ISBN
  · build_epub.py PUB_DATE — EPUB dc:date
  · content.opf dc:identifier — ISBN이 있으면 임시 UUID를 대체

사용:
    python ebook/set_colophon.py --date 2026-08-15 --price 19900 --isbn 979-11-XXXX-XXX-X
    python ebook/set_colophon.py --date 2026-08-15 --price 19900   # ISBN은 나중에
    python ebook/set_colophon.py --show                            # 현재 상태만
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COLOPHON = ROOT / "ebook" / "appendix" / "부록G-저자소개와판권.md"
BUILDER = ROOT / "ebook" / "build_epub.py"


def show() -> None:
    s = COLOPHON.read_text(encoding="utf-8")
    print("\n판권 현재 상태\n")
    for key in ("판차", "발행일", "정가", "ISBN", "사업자등록번호"):
        m = re.search(rf"\|\s*\*\*{key}\*\*\s*\|\s*([^|]+?)\s*\|", s)
        val = m.group(1) if m else "(항목 없음)"
        mark = "⚠" if val.startswith("TBD") else "✓"
        print(f"  {mark} {key:<12} {val}")
    m = re.search(r'PUB_DATE = "([^"]+)"', BUILDER.read_text(encoding="utf-8"))
    print(f"  · EPUB dc:date  {m.group(1) if m else '?'}")
    print()


def put(s: str, key: str, value: str) -> str:
    """판권표의 한 칸을 교체한다. 없으면 그대로 둔다."""
    return re.sub(rf"(\|\s*\*\*{key}\*\*\s*\|\s*)[^|]+?(\s*\|)",
                  lambda m: m.group(1) + value + m.group(2), s, count=1)


def main() -> None:
    ap = argparse.ArgumentParser(description="판권 미확정 값 채우기")
    ap.add_argument("--date", help="발행일 (YYYY-MM-DD)")
    ap.add_argument("--price", help="정가 (숫자만, 예: 19900)")
    ap.add_argument("--isbn", help="ISBN")
    ap.add_argument("--show", action="store_true", help="현재 상태만 보기")
    a = ap.parse_args()

    if a.show or not (a.date or a.price or a.isbn):
        show()
        return

    s = COLOPHON.read_text(encoding="utf-8")

    if a.date:
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", a.date):
            raise SystemExit("[error] 발행일은 YYYY-MM-DD 형식으로 주세요.")
        s = put(s, "발행일", a.date)
        b = BUILDER.read_text(encoding="utf-8")
        BUILDER.write_text(
            re.sub(r'PUB_DATE = "[^"]*"', f'PUB_DATE = "{a.date}"', b, count=1),
            encoding="utf-8")

    if a.price:
        n = re.sub(r"[^\d]", "", a.price)
        if not n:
            raise SystemExit("[error] 정가는 숫자로 주세요.")
        s = put(s, "정가", f"{int(n):,}원")

    if a.isbn:
        s = put(s, "ISBN", a.isbn)

    COLOPHON.write_text(s, encoding="utf-8")
    show()
    print("다음: python ebook/build_all.py   (전 판본 재생성 + 검사)\n")


if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:      # head 등으로 잘렸을 때
        pass
