#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
matcher.py — 인연사찰 매칭 엔진 참조 구현 (특허 ① 해설용)

전자책 제17~19장에서 공개한 계산식을 그대로 구현한 참조 구현체.
"규칙과 상수를 공개했으므로 독자가 검산하고 반박할 수 있다"는
이 책의 원칙을 코드로 보장한다.

구성 (제17장에서 세운 네 문제에 대응):
  ① 생극 비대칭      → 5x5 방향성 관계행렬        (제18장)
  ② 과잉의 포화       → 편차 감쇠 g(x)=Kx/(K+x)   (제19장)
  ③ 조합의 도약       → 비가산 시너지 a*sqrt(용*희) (제19장)
  ④ 사용자별 기준     → 용신을 입력으로 받음        (제14장)

점수식:
  score = Σ_{M>0} g(x_a)·M[a]  +  Σ_{M<0} x_a·M[a]  +  α·√(x_용신·x_희신)
          ────감쇠된 보강────      ──손상(감쇠 없음)──     ───시너지───

상수 (전부 설계 선택이며 자연 상수가 아님 — 제19장 5절 참고):
  比 +1.0 / 生 +0.6 / 洩 -0.3 / 耗 -0.1 / 剋 -0.8
  K = 40.0 (포화 기준값)   α = 0.15 (시너지 비중)

사용법:
  python funnel/matcher.py                      # 제17~19장 예시 3곳 재현
  python funnel/matcher.py --yongsin 火         # 다른 용신으로 계산
  python funnel/matcher.py --matrix             # 관계행렬 출력
  python funnel/matcher.py --temple 청암사=木55,水15,火10,土10,金10 --yongsin 木
"""
from __future__ import annotations

import argparse
import math
import sys

ELEMENTS = ["木", "火", "土", "金", "水"]

SHENG = {"木": "火", "火": "土", "土": "金", "金": "水", "水": "木"}  # a 生 b
KE = {"木": "土", "土": "水", "水": "火", "火": "金", "金": "木"}      # a 剋 b

REL_WEIGHT = {"比": 1.0, "生": 0.6, "洩": -0.3, "耗": -0.1, "剋": -0.8}

K_SAT = 40.0    # 편차 감쇠 기준값
ALPHA = 0.15    # 시너지 비중

# 제17~19장 본문 예시
DEFAULT_TEMPLES = {
    "청암사": {"木": 55, "水": 15, "火": 10, "土": 10, "金": 10},
    "벽수사": {"木": 30, "水": 40, "火": 10, "土": 10, "金": 10},
    "금강사": {"木": 40, "水": 5, "火": 10, "土": 5, "金": 40},
}


def relation(a: str, b: str) -> str:
    """환경 오행 a가 나의 용신 b에 대해 갖는 관계."""
    if a == b:
        return "比"
    if SHENG[a] == b:
        return "生"   # a가 b를 생함 — 간접 보강
    if SHENG[b] == a:
        return "洩"   # b가 a를 생함 — 내가 소모됨
    if KE[a] == b:
        return "剋"   # a가 b를 침 — 직접 손상
    if KE[b] == a:
        return "耗"   # b가 a를 침 — 내가 힘을 씀
    raise ValueError(f"관계 판정 불가: {a}, {b}")


def matrix() -> dict[str, dict[str, float]]:
    """행=환경 오행, 열=용신 오행인 5x5 방향성 관계행렬."""
    return {a: {b: REL_WEIGHT[relation(a, b)] for b in ELEMENTS} for a in ELEMENTS}


def damp(x: float) -> float:
    """편차 감쇠 g(x) = Kx/(K+x). x가 커져도 K를 넘지 못한다."""
    return K_SAT * x / (K_SAT + x)


def hui_sin(yongsin: str) -> str:
    """희신 = 용신을 생해주는 오행."""
    return next(a for a in ELEMENTS if SHENG[a] == yongsin)


def score(temple: dict[str, float], yongsin: str, *, linear: bool = False) -> dict:
    """도량 하나의 매칭 점수를 계산한다."""
    M = matrix()
    hui = hui_sin(yongsin)

    if linear:  # 제18장 단계 (감쇠·시너지 없음)
        total = sum(temple.get(e, 0) * M[e][yongsin] for e in ELEMENTS)
        return {"total": total, "boost": total, "harm": 0.0, "synergy": 0.0}

    boost = sum(damp(temple.get(e, 0)) * M[e][yongsin]
                for e in ELEMENTS if M[e][yongsin] > 0)
    harm = sum(temple.get(e, 0) * M[e][yongsin]
               for e in ELEMENTS if M[e][yongsin] < 0)
    synergy = ALPHA * math.sqrt(temple.get(yongsin, 0) * temple.get(hui, 0))
    return {
        "total": boost + harm + synergy,
        "boost": boost,
        "harm": harm,
        "synergy": synergy,
        "yongsin": yongsin,
        "huisin": hui,
    }


def breakdown(temple: dict[str, float], yongsin: str) -> list[str]:
    """항목별 기여 내역 — 결과를 역추적할 수 있게 한다."""
    M = matrix()
    lines = []
    for e in ELEMENTS:
        x = temple.get(e, 0)
        if not x:
            continue
        w = M[e][yongsin]
        rel = relation(e, yongsin)
        if w > 0:
            lines.append(f"    {e} {x:>4} → 감쇠 {damp(x):5.1f} × {w:+.1f} = {damp(x)*w:+7.2f}  ({rel})")
        else:
            lines.append(f"    {e} {x:>4} →      {x:5.1f} × {w:+.1f} = {x*w:+7.2f}  ({rel})")
    return lines


def parse_temple(spec: str) -> tuple[str, dict[str, float]]:
    """'청암사=木55,水15,...' 형식을 파싱."""
    if "=" not in spec:
        raise ValueError("형식: 이름=木55,水15,火10,土10,金10")
    name, body = spec.split("=", 1)
    dist = {}
    for part in body.split(","):
        part = part.strip()
        if not part:
            continue
        elem, val = part[0], part[1:]
        if elem not in ELEMENTS:
            raise ValueError(f"알 수 없는 오행: {elem}")
        dist[elem] = float(val)
    return name.strip(), dist


def print_matrix() -> None:
    M = matrix()
    print("방향성 관계행렬 (행=환경 오행, 열=나의 용신)\n")
    print("        " + "".join(f"{b:>8}" for b in ELEMENTS))
    for a in ELEMENTS:
        print(f"   {a}    " + "".join(f"{M[a][b]:>8.1f}" for b in ELEMENTS))
    asym = sum(1 for a in ELEMENTS for b in ELEMENTS if M[a][b] != M[b][a])
    print(f"\n비대칭 칸: {asym}/25  (M ≠ M^T — 대칭 유사도로는 표현 불가)")


def main() -> None:
    ap = argparse.ArgumentParser(description="인연사찰 매칭 엔진 참조 구현 (특허 ①)")
    ap.add_argument("--yongsin", default="木", help="용신 오행 (기본 木)")
    ap.add_argument("--temple", action="append", help="이름=木55,水15,... (반복 가능)")
    ap.add_argument("--matrix", action="store_true", help="관계행렬만 출력")
    args = ap.parse_args()

    if args.matrix:
        print_matrix()
        return

    if args.yongsin not in ELEMENTS:
        print(f"[error] 용신은 {'/'.join(ELEMENTS)} 중 하나여야 합니다.", file=sys.stderr)
        raise SystemExit(1)

    try:
        temples = (dict(parse_temple(s) for s in args.temple)
                   if args.temple else DEFAULT_TEMPLES)
    except ValueError as e:
        print(f"[error] {e}", file=sys.stderr)
        raise SystemExit(1)

    yong = args.yongsin
    hui = hui_sin(yong)
    print(f"용신 {yong} · 희신 {hui}  (K={K_SAT:g}, α={ALPHA})\n")

    results = {}
    for name, dist in temples.items():
        lin = score(dist, yong, linear=True)["total"]
        fin = score(dist, yong)
        results[name] = (lin, fin)
        print(f"  {name}  (선형 {lin:.1f} → 최종 {fin['total']:.2f})")
        for line in breakdown(dist, yong):
            print(line)
        print(f"    시너지 α√({dist.get(yong,0)}×{dist.get(hui,0)}) = {fin['synergy']:+7.2f}")
        print(f"    보강 {fin['boost']:.2f} + 손상 {fin['harm']:.2f} + 시너지 {fin['synergy']:.2f}"
              f" = {fin['total']:.2f}\n")

    print("순위 비교")
    lin_rank = sorted(results, key=lambda n: -results[n][0])
    fin_rank = sorted(results, key=lambda n: -results[n][1]["total"])
    print("  선형(18장):", " > ".join(lin_rank))
    print("  최종(19장):", " > ".join(fin_rank))

    top = [(n, results[n][1]["total"]) for n in fin_rank]
    if len(top) >= 2:
        gap = top[0][1] - top[1][1]
        note = ("격차가 작습니다 — 사실상 동급이니 접근성·인연으로 고르세요."
                if gap < 3 else "1위가 뚜렷합니다.")
        print(f"\n  1·2위 격차 {gap:.2f} → {note}")
    neg = [n for n, s in top if s < 0]
    if neg:
        print(f"  음수 총점: {', '.join(neg)} — 지금의 균형에 도움이 적은 도량입니다.")


if __name__ == "__main__":
    main()
