#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ohang_calculator.py — 오행 분포 계산 검산기

전자책 제8장에서 공개한 가중 규칙을 그대로 구현한 참조 구현체.
"규칙을 공개했으므로 독자가 검산할 수 있다"는 이 책의 원칙을 실제로 보장한다.

가중 규칙 (제8장 4절):
  - 천간            1.0
  - 지지 본기        1.0  (단, 월지 본기는 1.5 — 계절을 결정하는 자리)
  - 지장간 여기·중기  0.3  (잠재된 기운)

판정 기준 (제8장 5절):
  - 30% 이상  과다(過多)
  - 12~30%    정상
  - 12% 미만  부족(不足)
  - 0%        무(無)

사용법:
  # 사주 여덟 글자를 시주·일주·월주·연주 순으로 (관례 표기 순서)
  python funnel/ohang_calculator.py --saju 壬申 甲子 丙戌 庚午
  python funnel/ohang_calculator.py --saju 壬申 甲子 丙戌 庚午 --json

주의:
  이 스크립트는 '이미 뽑힌 사주 여덟 글자'로 오행 분포를 계산한다.
  생년월일시 → 사주 변환(만세력·절기·시차 보정)은 별도이며 웹 서비스가 담당한다.
"""
from __future__ import annotations

import argparse
import json
import sys

# 천간·지지 → 오행
GAN_ELEM = {
    "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
    "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水",
}
JI_ELEM = {
    "寅": "木", "卯": "木", "巳": "火", "午": "火",
    "辰": "土", "戌": "土", "丑": "土", "未": "土",
    "申": "金", "酉": "金", "亥": "水", "子": "水",
}

# 지장간 — 마지막 원소가 본기(本氣), 앞은 여기·중기
JIJANGGAN = {
    "子": ["壬", "癸"],
    "丑": ["癸", "辛", "己"],
    "寅": ["戊", "丙", "甲"],
    "卯": ["甲", "乙"],
    "辰": ["乙", "癸", "戊"],
    "巳": ["戊", "庚", "丙"],
    "午": ["丙", "己", "丁"],
    "未": ["丁", "乙", "己"],
    "申": ["戊", "壬", "庚"],
    "酉": ["庚", "辛"],
    "戌": ["辛", "丁", "戊"],
    "亥": ["戊", "甲", "壬"],
}

ELEMENTS = ["木", "火", "土", "金", "水"]

W_GAN = 1.0
W_JI_MAIN = 1.0
W_MONTH_MAIN = 1.5
W_HIDDEN = 0.3

EXCESS = 30.0
DEFICIENT = 12.0


def calculate(pillars: list[str]) -> dict:
    """
    pillars: 시주·일주·월주·연주 순의 두 글자 문자열 4개. 예: ["壬申","甲子","丙戌","庚午"]
    관례 표기(오른쪽이 연주)를 따르므로 월주는 인덱스 2.
    """
    if len(pillars) != 4:
        raise ValueError("사주는 네 기둥(시주·일주·월주·연주)이어야 합니다.")

    score = {e: 0.0 for e in ELEMENTS}
    detail = {e: [] for e in ELEMENTS}

    MONTH_IDX = 2  # 시·일·월·연 → 월주
    DAY_IDX = 1

    for idx, pillar in enumerate(pillars):
        if len(pillar) != 2:
            raise ValueError(f"기둥은 천간+지지 두 글자여야 합니다: {pillar!r}")
        gan, ji = pillar[0], pillar[1]
        if gan not in GAN_ELEM:
            raise ValueError(f"알 수 없는 천간: {gan}")
        if ji not in JI_ELEM:
            raise ValueError(f"알 수 없는 지지: {ji}")

        # 천간
        e = GAN_ELEM[gan]
        score[e] += W_GAN
        detail[e].append(f"{gan}(천간) {W_GAN}")

        # 지지: 본기 + 여기/중기
        hidden = JIJANGGAN[ji]
        *rest, main = hidden
        w_main = W_MONTH_MAIN if idx == MONTH_IDX else W_JI_MAIN
        em = GAN_ELEM[main]
        score[em] += w_main
        detail[em].append(f"{main}({ji}본기{'·월지' if idx == MONTH_IDX else ''}) {w_main}")
        for h in rest:
            eh = GAN_ELEM[h]
            score[eh] += W_HIDDEN
            detail[eh].append(f"{h}({ji}지장간) {W_HIDDEN}")

    total = sum(score.values())
    ratio = {e: (score[e] / total * 100 if total else 0.0) for e in ELEMENTS}

    def verdict(pct: float) -> str:
        if pct == 0:
            return "무(無)"
        if pct >= EXCESS:
            return "과다"
        if pct < DEFICIENT:
            return "부족"
        return "정상"

    day_gan = pillars[DAY_IDX][0]
    day_elem = GAN_ELEM[day_gan]
    day_pct = ratio[day_elem]

    return {
        "pillars": pillars,
        "score": {e: round(score[e], 2) for e in ELEMENTS},
        "ratio": {e: round(ratio[e], 1) for e in ELEMENTS},
        "verdict": {e: verdict(ratio[e]) for e in ELEMENTS},
        "detail": detail,
        "total": round(total, 2),
        "day_gan": day_gan,
        "day_element": day_elem,
        "day_element_pct": round(day_pct, 1),
        "strength": "신약(身弱)" if day_pct < 20 else "신강(身强)",
    }


def render(r: dict) -> str:
    lines = [
        f"사주(시·일·월·연): {' '.join(r['pillars'])}",
        f"일간: {r['day_gan']}({r['day_element']}) — {r['strength']} "
        f"[일간 오행 {r['day_element_pct']}%]",
        "",
        f"{'오행':<4}{'점수':>7}{'비율':>9}   판정",
        "-" * 34,
    ]
    for e in ELEMENTS:
        lines.append(
            f"{e:<4}{r['score'][e]:>7.1f}{r['ratio'][e]:>8.1f}%   {r['verdict'][e]}"
        )
    lines += ["-" * 34, f"{'총점':<4}{r['total']:>7.1f}{100.0:>8.1f}%", "", "계산 내역:"]
    for e in ELEMENTS:
        if r["detail"][e]:
            lines.append(f"  {e}: " + " + ".join(r["detail"][e]))
    return "\n".join(lines)


def main() -> None:
    ap = argparse.ArgumentParser(
        description="오행 분포 계산 검산기 (전자책 제8장 규칙 구현)"
    )
    ap.add_argument(
        "--saju", nargs=4, metavar=("시주", "일주", "월주", "연주"),
        default=["壬申", "甲子", "丙戌", "庚午"],
        help="시주 일주 월주 연주 순 (기본값: 제8장 예시 사주)",
    )
    ap.add_argument("--json", action="store_true", help="JSON으로 출력")
    args = ap.parse_args()

    try:
        result = calculate(args.saju)
    except ValueError as e:
        print(f"[error] {e}", file=sys.stderr)
        raise SystemExit(1)

    if args.json:
        result.pop("detail", None)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(render(result))


if __name__ == "__main__":
    main()
