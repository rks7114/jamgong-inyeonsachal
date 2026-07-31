#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
strip_service.py — 원고에서 서비스 연결부만 떼어낸다

왜 필요한가.
이 책 30장 전부에 잼공인연사찰로 가는 CTA가 들어 있다. 한국판은 그것으로
설계되었다 — 책이 서비스를 설명하고 서비스가 책을 되받는 구조다.

그런데 해외판에서는 그 링크가 거짓말이 된다. 서비스는 한국 사찰
17,497곳으로 돌아가므로, 베트남 독자가 눌러 들어가면 베트남 절은
한 곳도 나오지 않는다. 그대로 두면 제1장부터 배격해 온
"확인할 수 없는 약속"을 우리가 하게 된다.

그래서 링크를 떼고 책이 혼자 서게 만든다. 대체재는 이미 있다 —
실천 상자가 30개 장에 빠짐없이 들어 있고, 서비스 없이 손으로 따라갈 수
있게 쓰여 있다.

판 갈래
  · SERVICE-ONLY  — 서비스가 있는 한국판에만 들어간다
  · BOOK-ONLY     — 서비스가 없는 판(해외)에만 들어간다

떼는 것 (해외판 = --no-cta)
  · <!-- CTA:AUTO-INSERT-START --> … <!-- CTA:AUTO-INSERT-END -->
  · > 🧭 **서비스에서 바로** … <!-- SITE-NOTE -->
  · <!-- SERVICE-ONLY-START --> … <!-- SERVICE-ONLY-END -->
  · <!--SO-->문장<!--/SO-->      ← 문단 안의 한 문장만 뗄 때

떼는 것 (한국판 = 기본)
  · <!-- BOOK-ONLY-START --> … <!-- BOOK-ONLY-END -->

떼지 않는 것
  · 실천 상자 — 서비스 없이 돌아가는 안내이므로 그대로 둔다
  · 본문에서 서비스를 언급하는 문장 — 사실 서술이라 남긴다
    (다만 제26장은 화면을 전제로 서술하므로 별도 재작성이 필요하다)

사용:
    python ebook/build_epub.py --no-cta
    python ebook/strip_service.py --report      # 무엇이 얼마나 떼어지는지
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAPTERS = ROOT / "ebook" / "chapters"
APPENDIX = ROOT / "ebook" / "appendix"

_CTA = re.compile(
    r"\n*<!--\s*CTA:AUTO-INSERT-START\s*-->.*?<!--\s*CTA:AUTO-INSERT-END\s*-->\n*",
    re.S,
)
_SITE_NOTE = re.compile(
    r"\n*^>\s*🧭\s*\*\*서비스에서 바로\*\*.*?<!--\s*SITE-NOTE\s*-->\n*",
    re.S | re.M,
)
_SERVICE_ONLY = re.compile(
    r"\n*<!--\s*SERVICE-ONLY-START\s*-->.*?<!--\s*SERVICE-ONLY-END\s*-->\n*", re.S)
_SO_INLINE = re.compile(r"<!--\s*SO\s*-->.*?<!--\s*/SO\s*-->", re.S)
_BOOK_ONLY = re.compile(
    r"\n*<!--\s*BOOK-ONLY-START\s*-->(.*?)<!--\s*BOOK-ONLY-END\s*-->\n*", re.S)


def strip_service(md: str) -> str:
    """해외판 — 서비스 연결부를 떼고 BOOK-ONLY 내용을 살린다."""
    md = _CTA.sub("\n\n", md)
    md = _SITE_NOTE.sub("\n\n", md)
    md = _SERVICE_ONLY.sub("\n\n", md)
    md = _SO_INLINE.sub("", md)
    md = _BOOK_ONLY.sub(lambda m: "\n\n" + m.group(1).strip() + "\n\n", md)
    # 블록이 빠지면서 '---'만 연달아 남는 자리를 정리한다
    md = re.sub(r"\n---\s*\n+---\s*\n", "\n---\n", md)
    md = re.sub(r"\n{3,}", "\n\n", md)
    md = re.sub(r"\n---\s*\n+(\*다음 장 예고)", r"\n---\n\n\1", md)
    return md.rstrip() + "\n"


def keep_service(md: str) -> str:
    """한국판 — 해외판 전용 문단만 덜어낸다. 나머지는 그대로 둔다."""
    md = _BOOK_ONLY.sub("\n\n", md)
    md = re.sub(r"<!--\s*/?SO\s*-->", "", md)
    md = re.sub(r"\n{3,}", "\n\n", md)
    return md.rstrip() + "\n"


def report() -> int:
    """어느 장에서 무엇이 몇 개 떼어지는지 세어 본다."""
    docs = sorted(CHAPTERS.glob("*.md")) + sorted(APPENDIX.glob("*.md"))
    cta = note = links_before = links_after = 0
    changed = 0
    for p in docs:
        md = p.read_text(encoding="utf-8")
        c = len(_CTA.findall(md))
        n = len(_SITE_NOTE.findall(md))
        out = strip_service(md)
        cta += c
        note += n
        links_before += md.count("jamgong.kr")
        links_after += out.count("jamgong.kr")
        if out != md:
            changed += 1
    print(f"\n문서 {len(docs)}개 중 {changed}개에서 서비스 연결부를 떼어냄\n")
    print(f"  CTA 블록            {cta:>4}개")
    print(f"  '서비스에서 바로'    {note:>4}개")
    print(f"  jamgong.kr 링크     {links_before:>4}개 → {links_after}개")
    if links_after:
        print("\n  ⚠ 마커 밖에 남은 링크가 있다. 본문에 직접 박힌 것이므로 확인이 필요하다.")
        for p in docs:
            out = strip_service(p.read_text(encoding="utf-8"))
            if "jamgong.kr" in out:
                for line in out.splitlines():
                    if "jamgong.kr" in line:
                        print(f"    {p.name}: {line.strip()[:80]}")
    print()
    return 1 if links_after else 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="원고에서 서비스 연결부 제거")
    ap.add_argument("--report", action="store_true", help="제거 대상 집계")
    a = ap.parse_args()
    raise SystemExit(report() if a.report else 0)
