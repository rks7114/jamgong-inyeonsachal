#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
pregenerate.py — 홍보글을 미리 만들어 대기열에 쌓는다

왜 필요한가.
자격증명이 없어 지금은 아무 글도 나가지 않는다(post_scheduler가 dry_run으로
떨어진다). 그러나 토큰이 들어오는 날 그날치부터 만들기 시작하면 늦다.
미리 만들어 두면 승인 즉시 발행이 시작된다.

그리고 한 가지 더 — 미리 쌓아두면 **사람이 읽고 고칠 수 있다.**
자동 생성한 글이 그대로 나가는 것과, 서른 개를 눈으로 훑은 뒤 나가는 것은
다르다. 이 프로젝트의 원칙상 후자가 맞다.

같은 템플릿이 한 주 안에 두 번 나오지 않도록 고른다. 템플릿이 13개뿐이라
30일을 채우면 반복은 불가피하지만, 최소한 이웃하지는 않게 한다.

사용:
    python automation/threads/pregenerate.py                  # 30일치
    python automation/threads/pregenerate.py --days 60
    python automation/threads/pregenerate.py --start 2026-08-15
    python automation/threads/pregenerate.py --review         # 만든 것 훑어보기
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import random
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
QUEUE = HERE / "queue.jsonl"

sys.path.insert(0, str(HERE))
from post_scheduler import build_post, load_templates  # noqa: E402

WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]


def generate(days: int, start: dt.date, seed: int | None) -> list[dict]:
    random.seed(seed)          # build_post가 전역 random을 쓰므로 여기서 고정한다
    cfg = load_templates()
    out: list[dict] = []
    recent: list[str] = []                # 최근 쓴 글의 앞머리 — 중복 회피용

    for i in range(days):
        day = start + dt.timedelta(days=i)
        cats = cfg["weekly_schedule"].get(WEEKDAYS[day.weekday()]) or ["ohang_tip"]
        for cat in cats:
            text = ""
            for _ in range(12):           # 최근 것과 겹치면 다시 뽑는다
                text = build_post(cfg, cat)
                head = text[:40]
                if head not in recent:
                    break
            recent.append(text[:40])
            recent[:] = recent[-10:]
            out.append({
                "date": day.isoformat(),
                "weekday": WEEKDAYS[day.weekday()],
                "category": cat,
                "length": len(text),
                "text": text,
                "status": "queued",
            })
    return out


def review(path: Path) -> None:
    if not path.exists():
        raise SystemExit("[error] 대기열이 없습니다. 먼저 생성해 주세요.")
    rows = [json.loads(l) for l in path.read_text(encoding="utf-8").splitlines() if l.strip()]
    print(f"\n대기열 {len(rows)}건  ({rows[0]['date']} ~ {rows[-1]['date']})\n")
    from collections import Counter
    for k, v in Counter(r["category"] for r in rows).items():
        print(f"  {k:<14} {v}건")
    heads = Counter(r["text"][:40] for r in rows)
    dup = {k: v for k, v in heads.items() if v > 1}
    print(f"\n  글자수 {min(r['length'] for r in rows)}~{max(r['length'] for r in rows)}")
    print(f"  같은 첫머리 반복 {len(dup)}종")
    print("\n── 처음 3건\n")
    for r in rows[:3]:
        print(f"  [{r['date']} {r['weekday']} · {r['category']}]")
        for line in r["text"].splitlines():
            print(f"    {line}")
        print()


def main() -> None:
    ap = argparse.ArgumentParser(description="홍보글 사전 생성")
    ap.add_argument("--days", type=int, default=30)
    ap.add_argument("--start", help="시작일 YYYY-MM-DD (기본: 내일)")
    ap.add_argument("--seed", type=int, default=20260731, help="재현용 난수 씨앗")
    ap.add_argument("-o", "--out", type=Path, default=QUEUE)
    ap.add_argument("--review", action="store_true", help="만들어진 대기열 훑어보기")
    a = ap.parse_args()

    if a.review:
        review(a.out)
        return

    start = (dt.date.fromisoformat(a.start) if a.start
             else dt.date.today() + dt.timedelta(days=1))
    rows = generate(a.days, start, a.seed)
    a.out.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n",
                     encoding="utf-8")
    print(f"[ok] {a.out}  ({len(rows)}건, {rows[0]['date']} ~ {rows[-1]['date']})")
    print("     python automation/threads/pregenerate.py --review   ← 눈으로 훑어보기")
    print("\n  ⚠ 이 글들은 아직 나가지 않습니다. 발행에는 자격증명이 필요합니다.")


if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:
        pass
