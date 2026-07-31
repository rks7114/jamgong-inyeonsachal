#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
taekil.py — 택일(擇日) 검산기

전자책 제20장에서 설명한 방식의 참조 구현체다. 하루하루의 일진(日辰)을
오행 분포로 바꾼 뒤, 제18~19장의 관계행렬로 나의 용신과의 관계를 잰다.

무엇을 쓰지 않는가부터 밝힌다.

  · 손 없는 날 — 쓰지 않는다. 음력 끝자리에서 나온 규칙일 뿐,
    그날 무슨 일이 더 잘 됐다는 근거가 없다.
  · 삼재 — 다루지 않는다.
  · 길신·흉신 신살 — 쓰지 않는다. 출처마다 표가 다르다.

쓰는 것은 하나다. **그날의 오행이 나에게 필요한 오행과 어떤 관계인가.**
규칙과 상수를 전부 공개하므로 독자가 손으로 검산할 수 있다.

계산 순서:
  ① 날짜 → 일진 간지        (60갑자 순환, 기준일로부터 세어 나감)
  ② 일진 → 오행 분포        (제8장 가중: 천간 1.0 / 지지 본기 1.0 / 지장간 0.3)
  ③ 분포 → 점수             (제18~19장 관계행렬 + 과잉 감쇠 + 시너지)

사용법:
  python funnel/taekil.py --yongsin 木 --from 2026-08-01 --days 21
  python funnel/taekil.py --yongsin 水 --from 2026-08-03 --days 12 --top 5
  python funnel/taekil.py --iljin 2026-08-07        # 그날 일진만 보기

주의:
  이 계산은 '어느 날이 더 맞느냐'를 상대 비교하는 것이지, 좋은 날과
  나쁜 날을 가르는 것이 아니다. 점수 차가 3점 안쪽이면 같은 날로 본다
  (제19장의 동점대 TIE_BAND).
"""
from __future__ import annotations

import argparse
import datetime as dt
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from matcher import ELEMENTS, hui_sin, relation, score  # noqa: E402
from ohang_calculator import GAN_ELEM, JI_ELEM, JIJANGGAN  # noqa: E402

GAN = "甲乙丙丁戊己庚辛壬癸"
JI = "子丑寅卯辰巳午未申酉戌亥"

# 60갑자 기준일. 이 날이 甲子日이다.
# lunar-javascript(서비스가 쓰는 것과 같은 역법 라이브러리)로 대조해 잡았다.
ANCHOR = dt.date(2026, 8, 18)

TIE_BAND = 3.0          # 이 안쪽 차이는 같은 날로 본다 (제19장)
W_GAN = 1.0
W_JI_MAIN = 1.0
W_HIDDEN = 0.3

WEEK = "월화수목금토일"


def iljin(d: dt.date) -> str:
    """그날의 일진 간지."""
    n = (d - ANCHOR).days % 60
    return GAN[n % 10] + JI[n % 12]


def day_elements(gz: str) -> dict[str, float]:
    """일진 두 글자를 오행 분포(합 100)로 편다.

    가중은 제8장과 같다. 다만 택일은 하루를 보는 것이라 월지 가산(1.5)이
    없다 — 그 자리는 사주에만 있는 자리다.
    """
    gan, ji = gz[0], gz[1]
    raw = {e: 0.0 for e in ELEMENTS}
    raw[GAN_ELEM[gan]] += W_GAN
    raw[JI_ELEM[ji]] += W_JI_MAIN
    hidden = JIJANGGAN[ji]
    for h in hidden[:-1]:                      # 본기는 이미 넣었다
        raw[GAN_ELEM[h]] += W_HIDDEN
    total = sum(raw.values())
    return {e: round(v / total * 100, 1) for e, v in raw.items()}


def rank(yongsin: str, start: dt.date, days: int) -> list[dict]:
    out = []
    for i in range(days):
        d = start + dt.timedelta(days=i)
        gz = iljin(d)
        dist = day_elements(gz)
        s = score(dist, yongsin)
        out.append({
            "date": d, "iljin": gz, "dist": dist,
            "score": s["score"] if isinstance(s, dict) else s,
            "detail": s,
        })
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description="택일 검산기 — 일진 오행과 용신의 관계")
    ap.add_argument("--yongsin", help="용신 (木火土金水)")
    ap.add_argument("--from", dest="start", default=None, help="시작일 YYYY-MM-DD")
    ap.add_argument("--days", type=int, default=14)
    ap.add_argument("--top", type=int, default=0, help="상위 N개만")
    ap.add_argument("--iljin", help="그 날짜의 일진만 출력")
    a = ap.parse_args()

    if a.iljin:
        d = dt.date.fromisoformat(a.iljin)
        gz = iljin(d)
        dist = day_elements(gz)
        print(f"{d}  {WEEK[d.weekday()]}  일진 {gz}")
        print("  " + "  ".join(f"{e} {dist[e]:>4.1f}%" for e in ELEMENTS))
        return

    if not a.yongsin:
        # 용신을 모르면 점수를 낼 수 없다. 일진만 펼쳐 보여 준다.
        start = dt.date.fromisoformat(a.start) if a.start else dt.date.today()
        print("용신이 없어 점수는 내지 않습니다. 일진만 폅니다.\n")
        for i in range(a.days):
            d = start + dt.timedelta(days=i)
            gz = iljin(d)
            dist = day_elements(gz)
            top = max(dist, key=dist.get)
            print(f"  {d} {WEEK[d.weekday()]}  {gz}   주된 오행 {top} {dist[top]:.1f}%")
        return

    if a.yongsin not in ELEMENTS:
        raise SystemExit(f"[error] 용신은 {' '.join(ELEMENTS)} 중 하나여야 합니다.")

    start = dt.date.fromisoformat(a.start) if a.start else dt.date.today()
    rows = rank(a.yongsin, start, a.days)
    hui = hui_sin(a.yongsin)
    ordered = sorted(rows, key=lambda r: -r["score"])
    best = ordered[0]["score"]

    print(f"용신 {a.yongsin} · 희신 {hui} · {start}부터 {a.days}일\n")
    print(f"  {'날짜':<12} {'요일':<3} {'일진':<5} {'점수':>7}   주된 관계")
    print("  " + "─" * 56)
    shown = ordered[: a.top] if a.top else rows
    for r in shown:
        d, dist = r["date"], r["dist"]
        top = max(dist, key=dist.get)
        rel = relation(top, a.yongsin)
        tie = " ◀ 동점대" if best - r["score"] <= TIE_BAND else ""
        print(f"  {d}  {WEEK[d.weekday()]}   {r['iljin']}  {r['score']:>7.1f}   "
              f"{top} {dist[top]:>4.1f}% → {rel}{tie}")
    print(f"\n  점수 차가 {TIE_BAND}점 안쪽이면 같은 날로 봅니다. "
          f"고르기 어려우면 형편이 되는 날을 고르십시오.")


if __name__ == "__main__":
    main()
