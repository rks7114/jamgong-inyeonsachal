#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_all.py — 팔 수 있는 모든 판본을 한 번에 굽는다

판본이 셋이고 형식이 넷이라 손으로 돌리면 반드시 하나를 빠뜨린다.
빠뜨린 판본은 낡은 원고로 팔리게 되므로, 한 명령으로 묶는다.

  한국판     서비스 링크 포함 — 국내 유통용
  미리보기판  제1장까지 — 무료 공개·리드마그넷
  해외판     서비스 링크 없음 — 책 단독

형식별 쓸 곳
  EPUB  리디·교보·부크크 등 유통사
  PDF   크몽 등 파일 직판
  HTML  브라우저 열람·검수
  TXT   카톡 전송·검색

사용:
    python ebook/build_all.py            # 전부
    python ebook/build_all.py --skip-pdf # PDF 빼고 (브라우저 없을 때)
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EB = ROOT / "ebook"
DIST = EB / "dist"
STEM = "소문을끄고데이터를켜다"

# (판본 이름, 접미사, 추가 인자)
EDITIONS = [
    ("한국판", "", []),
    ("미리보기판", "-미리보기", ["--preview"]),
    ("해외판", "-해외판", ["--no-cta"]),
]


def run(args: list[str]) -> bool:
    r = subprocess.run([sys.executable, *args], capture_output=True, text=True, timeout=900)
    tail = (r.stdout or r.stderr).strip().splitlines()
    if r.returncode != 0:
        print(f"    ✗ {' '.join(Path(a).name for a in args[:1])} — {tail[-1] if tail else '실패'}")
        return False
    print(f"    {tail[-1] if tail else 'ok'}")
    return True


def main() -> None:
    ap = argparse.ArgumentParser(description="모든 판본 빌드")
    ap.add_argument("--skip-pdf", action="store_true", help="PDF 생략")
    a = ap.parse_args()

    DIST.mkdir(parents=True, exist_ok=True)
    ok = True
    for name, sfx, extra in EDITIONS:
        print(f"\n── {name}")
        ok &= run([str(EB / "build_epub.py"), *extra, "--out", str(DIST / f"{STEM}{sfx}.epub")])
        ok &= run([str(EB / "build_html.py"), *extra, "-o", str(DIST / f"{STEM}{sfx}.html")])
        ok &= run([str(EB / "build_txt.py"), *extra, "-o", str(DIST / f"{STEM}{sfx}.txt")])
        if not a.skip_pdf:
            ok &= run([str(EB / "build_pdf.py"), *extra,
                       "-o", str(DIST / f"{STEM}{sfx}.pdf")])

    # 한국판만 화면용을 하나 더 굽는다. 종이결·책등 그늘에 더해 표지의
    # 초록·금색을 조판에 얹은 판본이다. 태블릿·PC 로 읽는 분에게는 이쪽이
    # 낫고, 뽑아 보는 분에게는 기본판이 낫다 — 437쪽에 색을 깔면 잉크값이
    # 배로 들고 흑백 프린터에서는 초록도 금색도 그냥 회색으로 떨어진다.
    if not a.skip_pdf:
        print("\n── 한국판 화면용 (색 · 종이결)")
        ok &= run([str(EB / "build_html.py"), "--color",
                   "-o", str(DIST / f"{STEM}-화면용.html")])
        ok &= run([str(EB / "build_pdf.py"), "--paper",
                   "-o", str(DIST / f"{STEM}-화면용.pdf")])

    print("\n── 산출물")
    for p in sorted(DIST.glob(f"{STEM}*")):
        print(f"  {p.stat().st_size:>10,}  {p.name}")

    print("\n── 검사")
    v = subprocess.run([sys.executable, str(EB / "verify.py")],
                       capture_output=True, text=True, timeout=600)
    print("  " + (v.stdout.strip().splitlines() or ["?"])[-1])
    for line in v.stdout.splitlines():
        if line.strip().startswith("✗"):
            print("  " + line.strip())

    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
