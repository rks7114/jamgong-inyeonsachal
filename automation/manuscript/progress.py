#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
progress.py — 30장 원고 집필 진척 트래커 (Step 1 심화)

역할:
  - ebook/chapters/*.md 를 스캔해 장별 집필 상태·분량을 집계.
  - 목표 분량(장당 2,500~3,800자, 공백·마크다운 제외 실질 본문) 대비 미달/과다 장을 표시.
  - CTA 삽입 여부를 함께 점검(락인 퍼널 누락 방지).
  - 다음에 집필할 장을 자동 추천 → 자율 집필 루프의 입력으로 사용.

30장 규모에서는 "무엇을 얼마나 썼고 다음에 뭘 쓸지"를 사람이 기억할 수 없으므로,
이 스크립트가 자율 집필 루프의 상태 관리자 역할을 한다.

사용법:
  python automation/manuscript/progress.py            # 진척 리포트
  python automation/manuscript/progress.py --next     # 다음 집필 대상만 출력
  python automation/manuscript/progress.py --json     # 기계 판독용
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CHAPTERS_DIR = ROOT / "ebook" / "chapters"
TOC = ROOT / "ebook" / "00-목차.md"

TOTAL_CHAPTERS = 30
TARGET_MIN = 2500
TARGET_MAX = 3800

CTA_MARKER = "<!-- CTA:AUTO-INSERT-START -->"

# 부(部) 구성 — 목차와 동기화
PARTS = [
    ("제1부 왜 데이터인가", range(1, 5)),
    ("제2부 나의 사주 읽기", range(5, 10)),
    ("제3부 역학의 문법", range(10, 15)),
    ("제4부 시간의 흐름", range(15, 17)),
    ("제5부 5대 특허 해부", range(17, 22)),
    ("제6부 전국 사찰 DB", range(22, 26)),
    ("제7부 매칭 실전", range(26, 28)),
    ("제8부 개운·잼공몰·실천", range(28, 31)),
]


def korean_char_count(text: str) -> int:
    """CTA 블록·마크다운 기호를 제외한 본문 실질 글자 수."""
    # CTA 자동삽입 블록 제거(집필 분량이 아니므로)
    text = re.sub(
        re.escape(CTA_MARKER) + r".*?<!-- CTA:AUTO-INSERT-END -->",
        "",
        text,
        flags=re.DOTALL,
    )
    # 마크다운 기호/공백 제거 후 카운트
    text = re.sub(r"[#>*`|\-\[\]()!]", "", text)
    text = re.sub(r"\s+", "", text)
    return len(text)


def scan() -> list[dict]:
    rows = []
    for n in range(1, TOTAL_CHAPTERS + 1):
        matches = sorted(CHAPTERS_DIR.glob(f"{n:02d}-*.md"))
        if not matches:
            rows.append({"ch": n, "status": "todo", "chars": 0, "cta": False, "file": None})
            continue
        path = matches[0]
        text = path.read_text(encoding="utf-8")
        chars = korean_char_count(text)
        if chars < TARGET_MIN * 0.5:
            status = "draft"       # 뼈대만
        elif chars < TARGET_MIN:
            status = "short"       # 분량 미달
        elif chars <= TARGET_MAX * 1.25:
            status = "done"
        else:
            status = "long"        # 분량 과다 — 분할 검토
        rows.append(
            {
                "ch": n,
                "status": status,
                "chars": chars,
                "cta": CTA_MARKER in text,
                "file": str(path.relative_to(ROOT)),
            }
        )
    return rows


def next_target(rows: list[dict]) -> int | None:
    for r in rows:
        if r["status"] in ("todo", "draft", "short"):
            return r["ch"]
    return None


def report(rows: list[dict]) -> str:
    done = [r for r in rows if r["status"] == "done"]
    written = [r for r in rows if r["status"] != "todo"]
    total_chars = sum(r["chars"] for r in rows)
    pct = len(done) / TOTAL_CHAPTERS * 100

    bar_len = 30
    filled = int(bar_len * len(done) / TOTAL_CHAPTERS)
    bar = "█" * filled + "░" * (bar_len - filled)

    lines = [
        "# 《소문을 끄고 데이터를 켜다》 집필 진척",
        "",
        f"`{bar}` **{len(done)}/{TOTAL_CHAPTERS}장 완료 ({pct:.1f}%)**",
        "",
        f"- 착수한 장: {len(written)}장 / 총 {TOTAL_CHAPTERS}장",
        f"- 누적 분량: **{total_chars:,}자** (목표 약 {TARGET_MIN*TOTAL_CHAPTERS:,}~{TARGET_MAX*TOTAL_CHAPTERS:,}자)",
        "",
        "## 부(部)별 현황",
    ]

    icons = {"done": "✅", "short": "🟡", "draft": "🟠", "long": "🔵", "todo": "⚪"}
    for label, rng in PARTS:
        part_rows = [r for r in rows if r["ch"] in rng]
        part_done = sum(1 for r in part_rows if r["status"] == "done")
        marks = " ".join(icons[r["status"]] for r in part_rows)
        lines.append(f"- **{label}** ({part_done}/{len(part_rows)})  {marks}")

    # 주의가 필요한 장
    issues = [r for r in rows if r["status"] in ("short", "draft", "long")]
    missing_cta = [r for r in rows if r["file"] and not r["cta"]]
    if issues or missing_cta:
        lines += ["", "## 점검 필요"]
        for r in issues:
            note = {"short": "분량 미달", "draft": "뼈대만 작성", "long": "분량 과다(분할 검토)"}[r["status"]]
            lines.append(f"- {r['ch']}장: {note} ({r['chars']:,}자)")
        for r in missing_cta:
            lines.append(f"- {r['ch']}장: ⚠️ CTA 미삽입 — `python funnel/cta_injector.py` 실행 필요")

    nxt = next_target(rows)
    lines += ["", "## 다음 집필 대상"]
    lines.append(f"- **제{nxt}장** 부터 이어서 집필" if nxt else "- 🎉 전 장 집필 완료")

    lines += ["", f"_범례: {' '.join(f'{v}{k}' for k, v in icons.items())}_"]
    return "\n".join(lines)


def main() -> None:
    ap = argparse.ArgumentParser(description="원고 집필 진척 트래커")
    ap.add_argument("--next", action="store_true", help="다음 집필 대상 장 번호만 출력")
    ap.add_argument("--json", action="store_true", help="JSON 출력")
    args = ap.parse_args()

    rows = scan()
    if args.next:
        nxt = next_target(rows)
        print(nxt if nxt else "")
        return
    if args.json:
        print(json.dumps({"chapters": rows, "next": next_target(rows)}, ensure_ascii=False, indent=2))
        return
    print(report(rows))


if __name__ == "__main__":
    main()
