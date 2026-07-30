#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
daily_report.py — 셀프 최적화 회고 시스템 (Step 3)

역할:
  - 하루치 활동 로그(threads_*.jsonl, qa_*.jsonl)를 집계.
  - 발행 건수/카테고리 분포, Q&A 매칭률/미매칭 질문, 민감 응답 건수를 회고.
  - (선택) 유입/판매 지표 파일(analytics/metrics_YYYY-MM-DD.json)이 있으면
    전환율 기반의 가격 조정 '제안'을 계산해 리포트에 포함.
  - 결과를 automation/logs/report_YYYY-MM-DD.md 로 저장하고 콘솔 출력.

주의:
  가격은 '제안'만 계산한다. 실제 가격 변동은 사람이 확인 후 반영하거나,
  별도 승인 플래그(--apply-price)로만 적용하도록 안전장치를 둔다.

사용법:
  python automation/analytics/daily_report.py                 # 오늘 회고
  python automation/analytics/daily_report.py --date 2026-07-30
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
LOG_DIR = ROOT / "automation" / "logs"


def read_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    out = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line:
            try:
                out.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return out


def on_date(records: list[dict], date_str: str) -> list[dict]:
    return [r for r in records if str(r.get("ts", "")).startswith(date_str)]


def price_suggestion(metrics: dict) -> dict:
    """
    전환율 기반 단순 가격 조정 제안(휴리스틱).
    - 목표 전환율 대비 실제 전환율로 방향 결정.
    - 조정폭은 ±10% 이내로 제한(급변 방지).
    """
    visits = max(int(metrics.get("visits", 0)), 0)
    sales = max(int(metrics.get("sales", 0)), 0)
    current_price = float(metrics.get("current_price", 0) or 0)
    target_cvr = float(metrics.get("target_cvr", 0.02))  # 기본 목표 2%

    if visits == 0 or current_price <= 0:
        return {"status": "insufficient_data", "note": "방문/가격 데이터 부족 — 조정 보류"}

    cvr = sales / visits
    if cvr >= target_cvr * 1.5:
        factor, reason = 1.10, "전환율이 목표를 크게 상회 — 소폭 인상 여력"
    elif cvr >= target_cvr:
        factor, reason = 1.05, "전환율 목표 달성 — 소폭 인상 검토"
    elif cvr >= target_cvr * 0.5:
        factor, reason = 0.95, "전환율 목표 미달 — 소폭 인하 검토"
    else:
        factor, reason = 0.90, "전환율 크게 미달 — 인하 및 카피 점검 필요"

    suggested = round(current_price * factor, -2)  # 100원 단위 반올림
    return {
        "status": "ok",
        "cvr": round(cvr, 4),
        "target_cvr": target_cvr,
        "current_price": current_price,
        "suggested_price": suggested,
        "delta_pct": round((factor - 1) * 100, 1),
        "reason": reason,
    }


def build_report(date_str: str) -> str:
    month = date_str[:7]
    threads = on_date(read_jsonl(LOG_DIR / f"threads_{month}.jsonl"), date_str)
    qa = on_date(read_jsonl(LOG_DIR / f"qa_{month}.jsonl"), date_str)

    # 스레드 발행 집계
    published = [t for t in threads if t.get("status") == "published"]
    dry = [t for t in threads if t.get("status") == "dry_run"]
    errors = [t for t in threads if t.get("status") == "error"]
    cat_dist = Counter(t.get("category") for t in threads)

    # Q&A 집계
    total_qa = len(qa)
    matched = [q for q in qa if q.get("matched") and q.get("source") != "safety"]
    safety = [q for q in qa if q.get("source") == "safety"]
    unmatched = [q for q in qa if q.get("source") == "fallback"]
    match_rate = (len(matched) / total_qa * 100) if total_qa else 0.0

    # 가격 제안(선택 입력)
    metrics_path = LOG_DIR / f"metrics_{date_str}.json"
    price = None
    if metrics_path.exists():
        try:
            price = price_suggestion(json.loads(metrics_path.read_text(encoding="utf-8")))
        except Exception as e:
            price = {"status": "error", "note": str(e)}

    lines = [
        f"# 잼공인연사찰 일일 회고 — {date_str}",
        "",
        "## 1. 스레드 홍보 발행",
        f"- 총 시도: {len(threads)}건 (발행 {len(published)} / dry-run {len(dry)} / 실패 {len(errors)})",
        f"- 카테고리 분포: {dict(cat_dist) or '없음'}",
    ]
    if errors:
        lines.append(f"- ⚠️ 발행 실패 {len(errors)}건 — 원인 점검 필요: "
                     + "; ".join(e.get("error", "?") for e in errors[:3]))

    lines += [
        "",
        "## 2. 도반 Q&A 응대",
        f"- 총 문의: {total_qa}건",
        f"- KB 매칭 응답: {len(matched)}건 (매칭률 {match_rate:.1f}%)",
        f"- 안전 응답(민감 주제): {len(safety)}건",
        f"- 미매칭(폴백): {len(unmatched)}건",
    ]
    if unmatched:
        lines.append("- 🔧 미매칭 질문(지식베이스 보강 후보):")
        for q in unmatched[:10]:
            lines.append(f"    - {q.get('question', '')[:80]}")

    lines += ["", "## 3. 유입·판매 및 가격 제안"]
    if price is None:
        lines.append(f"- 지표 파일 없음: `logs/metrics_{date_str}.json` 제공 시 전환율/가격 제안 산출")
    elif price.get("status") == "ok":
        lines += [
            f"- 전환율(CVR): {price['cvr']*100:.2f}% (목표 {price['target_cvr']*100:.2f}%)",
            f"- 현재가: {price['current_price']:.0f}원 → 제안가: {price['suggested_price']:.0f}원 "
            f"({price['delta_pct']:+.1f}%)",
            f"- 판단 근거: {price['reason']}",
            "- ※ 제안일 뿐이며, 실제 반영은 담당자 확인/승인 후 진행.",
        ]
    else:
        lines.append(f"- 가격 제안 보류: {price.get('note') or price.get('status')}")

    lines += [
        "",
        "## 4. 내일을 위한 액션 아이템(자동 도출)",
    ]
    actions = []
    if match_rate < 70 and total_qa >= 3:
        actions.append("Q&A 매칭률이 낮음 — 미매칭 질문을 faq.json에 반영")
    if not published and not dry:
        actions.append("스레드 발행 기록 없음 — 크론/스케줄러 동작 확인")
    if errors:
        actions.append("스레드 발행 실패 원인(토큰/네트워크) 점검")
    if not actions:
        actions.append("특이사항 없음 — 현 파이프라인 유지")
    lines += [f"- [ ] {a}" for a in actions]

    lines.append("")
    lines.append(f"_생성: {dt.datetime.now().isoformat(timespec='seconds')}_")
    return "\n".join(lines)


def main() -> None:
    ap = argparse.ArgumentParser(description="일일 셀프 최적화 회고 리포트")
    ap.add_argument("--date", default=dt.date.today().isoformat(), help="YYYY-MM-DD")
    args = ap.parse_args()

    report = build_report(args.date)
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    out = LOG_DIR / f"report_{args.date}.md"
    out.write_text(report, encoding="utf-8")
    print(report)
    print(f"\n[saved] {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
