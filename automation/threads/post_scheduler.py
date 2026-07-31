#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
post_scheduler.py — 스레드(Threads) 자동 홍보 발행기 (Step 3)

역할:
  - 요일별 카테고리 로테이션(post_templates.json)에 따라 홍보 글 1건을 조립.
  - Threads Graph API로 발행. (자격증명이 없으면 dry-run으로 콘솔 출력)
  - 발행 결과를 automation/logs/threads_YYYY-MM.jsonl 에 기록(셀프 최적화용).

크론 연동:
  automation/crontab.example 참고. 매일 정해진 시각에 이 스크립트를 호출한다.

환경변수(발행 시 필요):
  THREADS_USER_ID      : Threads 사용자 ID (Graph API)
  THREADS_ACCESS_TOKEN : 장기 액세스 토큰
  → 미설정 시 자동으로 --dry-run 동작(안전). 실제 발행은 자격증명 주입 후.

사용법:
  python automation/threads/post_scheduler.py --dry-run
  python automation/threads/post_scheduler.py --category ohang_tip
  python automation/threads/post_scheduler.py            # 실발행(자격증명 있을 때)
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import random
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
TEMPLATES = Path(__file__).resolve().parent / "templates" / "post_templates.json"
LOG_DIR = ROOT / "automation" / "logs"

GRAPH_BASE = "https://graph.threads.net/v1.0"

# 오행 키워드(템플릿 placeholder 치환용)
ELEMENTS = {
    "木": "성장·추진",
    "火": "열정·표현",
    "土": "안정·중심",
    "金": "결단·정리",
    "水": "지혜·유연",
}

TEMPLE_EXAMPLES = [
    "고요한 산세의",
    "본존불이 약사여래인",
    "물가에 자리한",
    "숲이 깊은",
]


def load_templates() -> dict:
    return json.loads(TEMPLATES.read_text(encoding="utf-8"))


def pick_category(cfg: dict, override: str | None) -> str:
    if override:
        return override
    weekday = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"][dt.date.today().weekday()]
    cats = cfg["weekly_schedule"].get(weekday) or ["ohang_tip"]
    return random.choice(cats)


def build_post(cfg: dict, category: str) -> str:
    cat = next((c for c in cfg["categories"] if c["id"] == category), None)
    if not cat:
        raise SystemExit(f"[error] 알 수 없는 카테고리: {category}")
    template = random.choice(cat["templates"])
    element = random.choice(list(ELEMENTS))
    cta = cfg["_meta"]["cta_url"]
    cta_book = cfg["_meta"].get("cta_url_book", cta)
    tags = " ".join(random.sample(cfg["_meta"]["hashtags_pool"], k=3))

    text = (
        template.replace("{element}", element)
        .replace("{element_kw}", ELEMENTS[element])
        .replace("{temple_example}", random.choice(TEMPLE_EXAMPLES))
        .replace("{cta_book}", cta_book)
        .replace("{cta}", cta)
    )
    text = f"{text}\n\n{tags}"
    # Threads 글자 수 제한 방어
    max_len = int(cfg["_meta"].get("max_length", 500))
    if len(text) > max_len:
        text = text[: max_len - 1].rstrip() + "…"
    return text


def publish_to_threads(text: str) -> dict:
    """Threads 2-step 발행: 컨테이너 생성 → 발행."""
    user_id = os.environ["THREADS_USER_ID"]
    token = os.environ["THREADS_ACCESS_TOKEN"]

    def _post(url: str, data: dict) -> dict:
        body = urllib.parse.urlencode(data).encode()
        req = urllib.request.Request(url, data=body, method="POST")
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())

    create = _post(
        f"{GRAPH_BASE}/{user_id}/threads",
        {"media_type": "TEXT", "text": text, "access_token": token},
    )
    container_id = create["id"]
    published = _post(
        f"{GRAPH_BASE}/{user_id}/threads_publish",
        {"creation_id": container_id, "access_token": token},
    )
    return {"container_id": container_id, "post_id": published.get("id")}


def log_event(record: dict) -> None:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    month = dt.date.today().strftime("%Y-%m")
    log_file = LOG_DIR / f"threads_{month}.jsonl"
    with log_file.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")


def main() -> None:
    ap = argparse.ArgumentParser(description="스레드 자동 홍보 발행기")
    ap.add_argument("--category", help="카테고리 강제 지정 (ohang_tip/temple_case/philosophy)")
    ap.add_argument("--dry-run", action="store_true", help="발행 없이 콘솔 출력만")
    args = ap.parse_args()

    cfg = load_templates()
    category = pick_category(cfg, args.category)
    text = build_post(cfg, category)

    has_creds = bool(os.environ.get("THREADS_USER_ID") and os.environ.get("THREADS_ACCESS_TOKEN"))
    dry = args.dry_run or not has_creds

    print(f"[category] {category}")
    print(f"[length] {len(text)}자")
    print("-" * 40)
    print(text)
    print("-" * 40)

    record = {
        "ts": dt.datetime.now().isoformat(timespec="seconds"),
        "type": "threads_post",
        "category": category,
        "length": len(text),
        "text": text,
    }

    if dry:
        reason = "no_credentials" if not has_creds else "dry_run_flag"
        print(f"[dry-run] 실제 발행 생략 ({reason}). 자격증명 주입 후 실발행됩니다.")
        record["status"] = "dry_run"
        record["reason"] = reason
        log_event(record)
        return

    try:
        result = publish_to_threads(text)
        record["status"] = "published"
        record.update(result)
        print(f"[published] post_id={result.get('post_id')}")
    except Exception as e:  # 발행 실패도 로그로 남겨 회고에 반영
        record["status"] = "error"
        record["error"] = str(e)
        print(f"[error] 발행 실패: {e}", file=sys.stderr)
    log_event(record)


if __name__ == "__main__":
    main()
