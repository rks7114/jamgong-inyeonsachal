#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_text.py — 원고의 표기 오류를 기계가 잡을 수 있는 만큼 잡는다

이 책은 "근거를 대지 않는 것은 팔지 않는다"고 말한다. 그런데 오탈자가
있으면 독자는 그 주장부터 의심한다. 내용의 정확성과 표기의 정확성은
독자에게 같은 것으로 읽힌다.

사람이 읽어야만 보이는 것이 대부분이지만, **기계가 확실히 잡을 수 있는
것을 기계가 놓치면 다음 판에서도 같은 자리에 남는다.**

그래서 오탐이 거의 없는 규칙만 넣었다. 애매한 것은 넣지 않았다 —
경고가 많으면 아무도 안 보게 되고, 그러면 없는 것과 같다.

건너뛰는 것: 코드 블록, 표, 인용 안의 예시, HTML 주석

사용:
    python ebook/check_text.py            # 전체
    python ebook/check_text.py -v         # 문장까지 보기
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAPTERS = ROOT / "ebook" / "chapters"
APPENDIX = ROOT / "ebook" / "appendix"

# (이름, 정규식, 설명) — 오탐이 거의 없는 것만
RULES: list[tuple[str, str, str]] = [
    ("중복 단어",      r"(?<![가-힣])([가-힣]{2,4})\s+\1(?![가-힣])", "같은 말이 두 번"),
    ("중복 공백",      r"[가-힣][ ]{2,}[가-힣]", "공백 두 칸 이상"),
    ("쉼표 앞 공백",   r"\s+,", "쉼표 앞에 공백"),
    ("마침표 뒤 붙음", r"[가-힣]\.[가-힣]", "마침표 뒤 공백 없음"),
    ("할수",          r"[가-힣]\s?할수\s", "'할 수'로 띄어야 함"),
    ("있슴/없슴",      r"(있|없)슴", "'있음/없음'"),
    ("몇일",          r"몇\s?일(?![가-힣])", "'며칠'이 맞음"),
    ("왠",            r"왠(?!지)", "'웬'이 맞음 (왠지만 예외)"),
    ("어떻해",         r"어떻해", "'어떡해'가 맞음"),
    ("역활",          r"역활", "'역할'이 맞음"),
    ("들어나",         r"들어나(다|는|서)", "'드러나'가 맞음"),
    ("바램",          r"바램(?![가-힣])", "'바람'이 맞음 (희망의 뜻일 때)"),
    ("에요",          r"[가-힣][^이]에요", "받침 뒤에는 '이에요'"),
    ("로서/로써",      r"방법으로서", "수단은 '로써'"),
    ("함으로",         r"함으로(?!써)\s", "이유는 '하므로', 수단은 '함으로써'"),
]

# 한자 병기 형식 — 붙여 쓰는 것이 이 책의 관례다.
# 다만 "줄여도 좋을 것 (金)"처럼 절 표지로 쓰인 한자는 병기가 아니므로,
# 앞 낱말과 음절 수가 맞을 때만 병기로 본다.
HANJA_SPACED = r"(?<![가-힣])([가-힣]{2,4})\s+\(([一-龥]{2,4})\)"


def hanja_mismatch(m: "re.Match") -> bool:
    return len(m.group(1)) == len(m.group(2))


def strip_noise(md: str) -> str:
    """검사하면 안 되는 구역을 지운다. 줄 수는 유지한다."""
    def blank(m: re.Match) -> str:
        return "\n" * m.group(0).count("\n")
    md = re.sub(r"```.*?```", blank, md, flags=re.S)        # 코드 블록
    md = re.sub(r"<!--.*?-->", blank, md, flags=re.S)       # 주석
    md = re.sub(r"^\|.*$", "", md, flags=re.M)              # 표
    md = re.sub(r"`[^`\n]*`", "\u0000", md)               # 인라인 코드
    #   지운 자리를 빈칸으로 두면 앞뒤 공백이 붙어 없던 오류가 생긴다.
    #   글자 하나를 남겨 두어 그 오탐을 막는다.
    return md


def scan(paths: list[Path], verbose: bool) -> int:
    total = 0
    for p in paths:
        text = strip_noise(p.read_text(encoding="utf-8"))
        hits: list[tuple[int, str, str]] = []
        for lineno, line in enumerate(text.splitlines(), 1):
            if not line.strip() or line.lstrip().startswith(("#", "---", ">")):
                # 인용(>)은 예시를 담는 자리라 규칙 적용에서 뺀다
                if not line.lstrip().startswith(">"):
                    continue
            for name, pat, why in RULES:
                for m in re.finditer(pat, line):
                    hits.append((lineno, name, m.group(0).strip()))
            for m in re.finditer(HANJA_SPACED, line):
                if hanja_mismatch(m):
                    hits.append((lineno, "한자 병기 띄어씀", m.group(0).strip()))
        if hits:
            total += len(hits)
            print(f"\n{p.name}  {len(hits)}건")
            for lineno, name, frag in hits[: (99 if verbose else 6)]:
                print(f"  {lineno:>4}  {name:<14} {frag[:40]}")
            if not verbose and len(hits) > 6:
                print(f"        … 외 {len(hits)-6}건 (-v 로 전체)")
    print(f"\n총 {total}건")
    return total


def main() -> None:
    ap = argparse.ArgumentParser(description="원고 표기 점검")
    ap.add_argument("-v", "--verbose", action="store_true")
    a = ap.parse_args()
    paths = sorted(CHAPTERS.glob("*.md")) + sorted(APPENDIX.glob("*.md"))
    n = scan(paths, a.verbose)
    sys.exit(1 if n else 0)


if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:
        pass
