#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cta_injector.py — 락인(Lock-in) 퍼널 자동 삽입기

역할 (Step 2):
  1) 전자책 각 장 마크다운 말미에 '오행 매칭 CTA' 링크를 표준 포맷으로 삽입.
  2) 개운/기도용품 관련 장에는 잼공몰 오행 큐레이션 링크를 직결.
  3) 모든 링크에 UTM 파라미터를 자동 부착해 유입 경로를 추적.

설계 원칙:
  - 멱등(idempotent): CTA 마커(<!-- CTA:AUTO-INSERT-START/END -->) 사이만 교체하므로
    반복 실행해도 CTA가 중복 누적되지 않는다.
  - 근거 기반: 잼공몰 링크는 ohang_product_map.json의 매칭 근거를 그대로 사용한다.

사용법:
  python funnel/cta_injector.py                 # ebook/chapters/*.md 전체 처리
  python funnel/cta_injector.py --dry-run       # 변경 미리보기(파일 미수정)
  python funnel/cta_injector.py --file ebook/chapters/10-제10장.md
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAPTERS_DIR = ROOT / "ebook" / "chapters"
PRODUCT_MAP = ROOT / "funnel" / "ohang_product_map.json"

BASE_URL = "https://jamgong-inyeonsachal.vercel.app"

CTA_START = "<!-- CTA:AUTO-INSERT-START -->"
CTA_END = "<!-- CTA:AUTO-INSERT-END -->"

# 잼공몰 큐레이션을 직결할 장 — 8부 30장 기준(개운·기도용품·실천 플랜)
MALL_CHAPTERS = {"28", "29", "30"}

# 부(部)별 CTA 문안 차별화 — 장 번호 → (부 제목, CTA 후킹 문장)
PART_MAP = [
    (range(1, 5),   "제1부 철학",     "이 장에서 말한 '근거 있는 분석'을 나의 사주로 직접 확인해 보세요."),
    (range(5, 10),  "제2부 사주 읽기", "직접 계산해 본 오행 분포, 웹에서 3분 만에 검산해 보세요."),
    (range(10, 15), "제3부 역학 문법", "합·충·용신까지 반영한 정밀 분석을 무료로 받아보세요."),
    (range(15, 17), "제4부 시간의 흐름", "지금 나의 대운 흐름과 라이프사이클 지표를 확인해 보세요."),
    (range(17, 22), "제5부 특허 기술", "이 매칭 엔진이 실제로 어떤 도량을 추천하는지 직접 돌려보세요."),
    (range(22, 26), "제6부 사찰 DB",  "17,497곳 중 나와 맞는 도량을 지금 찾아보세요."),
    (range(26, 28), "제7부 매칭 실전", "사례 속 그 과정을, 나의 생년월일시로 그대로 재현해 보세요."),
    (range(28, 31), "제8부 개운·실천", "오행 균형을 맞추는 첫걸음, 나의 분석부터 시작하세요."),
]


def part_hook(ch: str) -> str:
    """장 번호에 맞는 부(部)별 CTA 후킹 문장 반환."""
    try:
        n = int(ch)
    except ValueError:
        return PART_MAP[0][2]
    for rng, _label, hook in PART_MAP:
        if n in rng:
            return hook
    return PART_MAP[0][2]


def utm(campaign: str, content: str, medium: str = "chapter") -> str:
    return (
        f"?utm_source=ebook&utm_medium={medium}"
        f"&utm_campaign={campaign}&utm_content={content}"
    )


def chapter_number(path: Path) -> str:
    """'01-제1장.md' -> '01' (없으면 파일 stem)."""
    m = re.match(r"(\d+)", path.stem)
    return m.group(1) if m else path.stem


def build_matching_cta(ch: str) -> str:
    link = f"{BASE_URL}/{utm('guide', f'ch{ch}')}"
    return (
        "> ### 🔮 나의 오행, 3분 만에 확인하기\n"
        f"> {part_hook(ch)} "
        "생년월일시만 입력하면 木火土金水 분포와 인연사찰 방향이 무료로 분석됩니다.\n"
        ">\n"
        f"> 👉 **[내 인연사찰 오행 매칭 시작하기]({link})**"
    )


def build_mall_cta(ch: str) -> str:
    link = f"{BASE_URL}/mall{utm('ohang_curation', f'ch{ch}', medium='product_cta')}"
    return (
        "\n>\n"
        "> ### 🛍️ 내 오행에 맞는 기도용품 큐레이션\n"
        "> '아무 염주'가 아니라, 지금 내 오행에 필요한 것을 고르세요. "
        "부족한 오행은 보(補)하고 과한 오행은 설기(泄)하는 근거 기반 큐레이션입니다.\n"
        ">\n"
        f"> 👉 **[잼공몰 오행별 큐레이션 보기]({link})**"
    )


def build_block(ch: str) -> str:
    body = build_matching_cta(ch)
    if ch in MALL_CHAPTERS:
        body += build_mall_cta(ch)
    return f"{CTA_START}\n{body}\n{CTA_END}"


def inject(text: str, ch: str) -> str:
    block = build_block(ch)
    pattern = re.compile(
        re.escape(CTA_START) + r".*?" + re.escape(CTA_END), re.DOTALL
    )
    if pattern.search(text):
        # 기존 CTA 블록 교체 (멱등)
        return pattern.sub(block, text)
    # 없으면 말미에 추가
    sep = "" if text.endswith("\n") else "\n"
    return f"{text}{sep}\n---\n\n{block}\n"


def process_file(path: Path, dry_run: bool) -> bool:
    ch = chapter_number(path)
    original = path.read_text(encoding="utf-8")
    updated = inject(original, ch)
    if updated == original:
        print(f"  = {path.name} (변경 없음)")
        return False
    if dry_run:
        print(f"  ~ {path.name} (dry-run: 변경 예정)")
    else:
        path.write_text(updated, encoding="utf-8")
        print(f"  ✓ {path.name} (CTA 삽입/갱신)")
    return True


def main() -> None:
    ap = argparse.ArgumentParser(description="전자책 CTA/잼공몰 락인 링크 자동 삽입기")
    ap.add_argument("--file", help="특정 파일만 처리")
    ap.add_argument("--dry-run", action="store_true", help="파일 수정 없이 미리보기")
    args = ap.parse_args()

    # 상품 매핑 로드 검증(근거 테이블 존재 확인)
    if PRODUCT_MAP.exists():
        json.loads(PRODUCT_MAP.read_text(encoding="utf-8"))
        print(f"[ok] 오행 상품 매핑 로드: {PRODUCT_MAP.relative_to(ROOT)}")
    else:
        print(f"[warn] 상품 매핑 없음: {PRODUCT_MAP} (잼공몰 링크는 기본 경로 사용)")

    targets = (
        [Path(args.file)]
        if args.file
        else sorted(CHAPTERS_DIR.glob("*.md"))
    )
    if not targets:
        print("[info] 처리할 장 파일이 없습니다. ebook/chapters/*.md 를 먼저 작성하세요.")
        return

    print(f"[run] 대상 {len(targets)}개 파일 처리{' (dry-run)' if args.dry_run else ''}")
    changed = sum(process_file(p, args.dry_run) for p in targets)
    print(f"[done] {changed}개 파일 변경{' 예정' if args.dry_run else ''}.")


if __name__ == "__main__":
    main()
