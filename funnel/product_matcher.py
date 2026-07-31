#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
product_matcher.py — 상품궁합 순위화 참조 구현 (특허 ① 명세서판)

인연사찰 엔진(matcher.py)과 이름이 비슷하지만 같은 것이 아니다.
이쪽은 **특허 명세서에 적힌 상수와 결합 방식을 그대로** 옮긴 것이고,
matcher.py는 인연사찰 서비스가 실제로 쓰는 다른 상수를 쓴다.
차이는 전자책 1권 제19장 5절 ④와 docs/특허-분석-검산.md 2절에 밝혀 두었다.

  구분          명세서(이 파일)                  인연사찰(matcher.py)
  ─────────────────────────────────────────────────────────────────
  역상생        +0.30                            -0.3  ← 부호가 반대
  역상극        -0.20                            -0.1
  상극          -0.40                            -0.8
  시너지        γ·G·max(0,1-δΔ)  3요소 기하평균   α·√(x_용·x_희)  2요소
  통합          CS = 100[L + S(1-L)]  잔여 구간   보강+손상+시너지 합산
  과잉 처리     (없음 — clip으로만)              g(x)=Kx/(K+x), K=40

왜 이 파일이 먼저 필요한가.
2권의 모든 숫자는 이 구현으로 검산한 뒤에 본문에 적는다. 1권에서
matcher.py가 했던 역할과 같다. 규칙과 상수를 공개했으니 독자가
반박할 수 있다 — 그것이 이 시리즈가 파는 유일한 것이다.

사용법:
  python funnel/product_matcher.py                # 명세서 실시예 1·2 재현
  python funnel/product_matcher.py --matrix       # 25칸 관계행렬
  python funnel/product_matcher.py --selftest     # 명세서 값과 대조 (종료코드 0/1)
"""
from __future__ import annotations

import argparse
import sys

ELEMENTS = ["목", "화", "토", "금", "수"]

SHENG = {"목": "화", "화": "토", "토": "금", "금": "수", "수": "목"}  # a 生 b
KE = {"목": "토", "토": "수", "수": "화", "화": "금", "금": "목"}      # a 剋 b

# 명세서 3절의 여섯 관계 규칙. 25칸이 이 여섯 값만으로 일의적으로 결정된다.
# '무관계'는 오행 다섯 사이에서는 실제로 한 번도 나오지 않는다 —
# 어떤 쌍이든 생 아니면 극 관계에 있기 때문이다. 성분이 여섯 이상으로
# 늘어나는 확장을 위해 규칙에만 남겨 둔 자리로 읽는 것이 맞다.
REL = {
    "동일": 1.00,    # 대상 = 보완 필요
    "상생": 0.60,    # 대상이 보완 필요를 생함
    "역상생": 0.30,  # 보완 필요가 대상을 생함
    "무관계": 0.00,
    "역상극": -0.20,  # 보완 필요가 대상을 극함
    "상극": -0.40,   # 대상이 보완 필요를 극함
}

THETA = 0.15      # 부족 판정 임계값
R_MIN, R_MAX = -0.40, 1.00
GAMMA = 0.25      # 시너지 상한계수 γ
DELTA = 0.80      # 편차 감쇠계수 δ — 요소 간 최대-최소 차이에 걸린다
EPS = 1e-9


def relation(target: str, need: str) -> str:
    """행=대상 오행, 열=사용자에게 보완이 필요한 오행."""
    if target == need:
        return "동일"
    if SHENG[target] == need:
        return "상생"
    if SHENG[need] == target:
        return "역상생"
    if KE[target] == need:
        return "상극"
    if KE[need] == target:
        return "역상극"
    return "무관계"


def matrix() -> dict[str, dict[str, float]]:
    return {t: {n: REL[relation(t, n)] for n in ELEMENTS} for t in ELEMENTS}


def deficiency(v: list[float], theta: float = THETA) -> list[float]:
    """결핍벡터 D. d_i = max(0, θ-v_i)/θ

    모든 성분이 충분하면 D가 영벡터가 되어 이후 나눗셈이 무너진다.
    명세서는 그때 '보완 우선 성분에 대체 결핍값 ε을 부여한다'고만 적어
    두었으므로, 어느 성분에 줄지는 호출 측이 정하도록 남긴다.
    """
    return [max(0.0, theta - x) / theta for x in v]


def z_vector(D: list[float]) -> list[float]:
    """z = R·D — 대상 오행별로 '이 성분을 가진 물건이 얼마나 맞는가'."""
    M = matrix()
    return [sum(M[t][ELEMENTS[j]] * D[j] for j in range(5)) for t in ELEMENTS]


def fitness(a: list[float], D: list[float]) -> float:
    """통합벡터 a와 결핍벡터 D로부터 적합도 하나를 낸다 (E1·E3·E4 공통).

    raw를 Σd로 나누는 이유는 결핍이 많은 사람일수록 분자가 커지기
    때문이다. 나누지 않으면 '부족한 게 많은 사람'의 점수가 자동으로
    높아진다 — 사람 사이 비교가 불가능해진다.
    """
    z = z_vector(D)
    raw = sum(a[i] * z[i] for i in range(5)) / max(sum(D), EPS)
    return clip((raw - R_MIN) / (R_MAX - R_MIN))


def clip(x: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, x))


def synergy(core: list[float], gamma: float = GAMMA, delta: float = DELTA) -> dict:
    """편차 감쇠형 비가산 시너지.

    S = γ · G · max(0, 1 - δ·Δ)      G = (ΠE)^(1/n),  Δ = max(E) - min(E)

    기하평균이라 하나가 0이면 전체가 0이다. 그리고 Δ가 붙어 있어서,
    가중합이 같아도 요소가 고르게 충족된 쪽이 더 큰 시너지를 받는다.
    이것이 '단순 가중합으로는 구별되지 않는 두 대상'을 가르는 자리다.
    """
    n = len(core)
    prod = 1.0
    for e in core:
        prod *= e
    G = prod ** (1.0 / n)
    spread = max(core) - min(core)
    return {"G": G, "delta": spread, "S": gamma * G * max(0.0, 1 - delta * spread)}


def integrate(fits: list[float], weights: list[float], core_idx: list[int] | None = None) -> dict:
    """포화 방지형 통합점수.

    CS = 100·[L + S·(1-L)]

    시너지를 그냥 더하지 않고 **남은 구간에만** 넣는다. 그래서 L과 S가
    각각 0~1이면 CS는 클리핑 없이 0~100이 된다. L이 1에 가까울수록
    시너지가 들어갈 자리가 줄어들어 상위권이 100점에 몰리지 않는다.
    """
    w = normalize(weights)
    L = sum(w[i] * fits[i] for i in range(len(fits)))
    idx = core_idx if core_idx is not None else list(range(min(3, len(fits))))
    syn = synergy([fits[i] for i in idx])
    S = syn["S"]
    return {
        "L": L, "G": syn["G"], "spread": syn["delta"], "S": S,
        "CS": 100.0 * (L + S * (1 - L)),
        "기본기여": [w[i] * fits[i] for i in range(len(fits))],
        "시너지기여": S * (1 - L),
    }


def normalize(w: list[float], mask: list[bool] | None = None) -> list[float]:
    """결측 서브벡터의 가중치를 0으로 두고 나머지를 합계 1로 재정규화."""
    if mask is not None:
        w = [x if m else 0.0 for x, m in zip(w, mask)]
    s = sum(w)
    return [x / s for x in w] if s > EPS else [0.0] * len(w)


# ── 명세서 실시예 ──────────────────────────────────────────────────

def example_1() -> dict:
    """실시예 1 — 사용자 특성벡터와 오행 보완 적합도."""
    v = [0.10, 0.25, 0.35, 0.20, 0.10]
    D = deficiency(v)
    a = [0.50, 0.10, 0.10, 0.10, 0.20]
    z = z_vector(D)
    raw = sum(a[i] * z[i] for i in range(5)) / max(sum(D), EPS)
    return {"v": v, "D": D, "a": a, "raw": raw, "E1": fitness(a, D)}


def example_2() -> dict:
    """실시예 2 — 기본점수가 같은데 균형도로 순위가 갈린다."""
    w = [0.35, 0.30, 0.20]
    out = {}
    for name, K in (("A", [0.6214, 1.0000, 0.7100]),
                    ("B", [0.9900, 0.4700, 0.8598])):
        r = integrate(K, w)
        r["단순가산"] = 100.0 * (r["L"] + r["S"])  # 비교예
        out[name] = r
    return out


def print_matrix() -> None:
    M = matrix()
    print("\n방향성 오행 관계행렬 — 특허 명세서판 (행=대상, 열=보완 필요)\n")
    print("        " + "".join(f"{e:>8}" for e in ELEMENTS))
    for t in ELEMENTS:
        print(f"  {t:<4}" + "".join(f"{M[t][n]:>8.2f}" for n in ELEMENTS))
    asym = sum(1 for t in ELEMENTS for n in ELEMENTS if M[t][n] != M[n][t])
    print(f"\n비대칭 칸: {asym}/25   '무관계 0.00' 등장: "
          f"{sum(1 for t in ELEMENTS for n in ELEMENTS if M[t][n] == 0)}칸")
    print("※ 인연사찰 엔진(matcher.py --matrix)과 값이 다르다. 의도된 차이다.\n")


def selftest() -> int:
    """명세서에 인쇄된 값과 대조한다. 어긋나면 종료코드 1."""
    checks: list[tuple[str, float, float, float]] = []
    e1 = example_1()
    checks.append(("실시예1 raw", e1["raw"], 0.47, 0.005))
    checks.append(("실시예1 E1", e1["E1"], 0.6214, 0.0001))

    e2 = example_2()
    for name, exp in (("A", {"L": 0.7759, "G": 0.7613, "spread": 0.3786,
                             "S": 0.1327, "CS": 80.56, "단순가산": 90.86}),
                      ("B", {"L": 0.7759, "G": 0.7368, "spread": 0.5200,
                             "S": 0.1076, "CS": 80.00, "단순가산": 88.35})):
        for k, want in exp.items():
            tol = 0.02 if k in ("CS", "단순가산") else 0.0002
            checks.append((f"실시예2 {name}·{k}", e2[name][k], want, tol))

    bad = 0
    print("\n명세서 대조\n")
    for label, got, want, tol in checks:
        ok = abs(got - want) <= tol
        bad += not ok
        print(f"  {'✓' if ok else '✗'} {label:<20} 계산 {got:>9.4f}   명세서 {want:>8.4f}")
    print(f"\n{len(checks)-bad}/{len(checks)} 일치\n")
    return 1 if bad else 0


def main() -> None:
    ap = argparse.ArgumentParser(description="상품궁합 순위화 참조 구현 (특허 ① 명세서판)")
    ap.add_argument("--matrix", action="store_true", help="25칸 관계행렬 출력")
    ap.add_argument("--selftest", action="store_true", help="명세서 값과 대조")
    args = ap.parse_args()

    if args.matrix:
        print_matrix()
        return
    if args.selftest:
        sys.exit(selftest())

    e1 = example_1()
    print("\n[실시예 1] 오행 보완 적합도")
    print(f"  v      {['%.2f' % x for x in e1['v']]}   (θ={THETA})")
    print(f"  D      {['%.3f' % x for x in e1['D']]}")
    print(f"  a      {['%.2f' % x for x in e1['a']]}")
    print(f"  raw    {e1['raw']:.4f}      E1 = {e1['E1']:.4f}")

    e2 = example_2()
    print("\n[실시예 2] 같은 기본점수, 다른 순위")
    print(f"  {'':<5}{'L':>9}{'G':>9}{'Δ':>9}{'S':>9}{'CS':>9}{'단순가산':>11}")
    for n in ("A", "B"):
        r = e2[n]
        print(f"  대상{n} {r['L']:>9.4f}{r['G']:>9.4f}{r['spread']:>9.4f}"
              f"{r['S']:>9.4f}{r['CS']:>9.2f}{r['단순가산']:>11.2f}")
    gap = e2["A"]["CS"] - e2["B"]["CS"]
    print(f"\n  기본점수는 소수 넷째 자리까지 같다. 순위를 가른 것은 편차뿐이고,")
    print(f"  그 결과 격차는 {gap:.2f}점이다. 잔여 구간에 넣지 않고 단순 가산했다면")
    print(f"  {e2['A']['단순가산']:.2f} / {e2['B']['단순가산']:.2f}로 상위권에 몰렸을 것이다.\n")


if __name__ == "__main__":
    main()
