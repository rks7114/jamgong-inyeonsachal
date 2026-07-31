#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
qa_agent.py — 24시간 도반 소통 Q&A 에이전트 (Step 3)

역할:
  - 유입 사용자의 질문에 사찰 톤앤매너 + 역학 데이터 기반으로 응대.
  - 1차: 지식 베이스(faq.json) 키워드 매칭으로 근거 있는 답변 생성.
  - 2차(선택): LLM API(ANTHROPIC_API_KEY)가 설정되면 톤 가이드 + KB를
    컨텍스트로 넣어 더 자연스러운 답변 생성. (미설정 시 KB 답변만 사용)
  - 민감 주제(의학/법률/재정/위기)는 안전 응답으로 우회.

인터페이스:
  - answer(question) -> dict  : 다른 파이프라인에서 임포트해 사용.
  - CLI:
      python automation/qa-agent/qa_agent.py "질문 내용"
      echo "질문" | python automation/qa-agent/qa_agent.py
      python automation/qa-agent/qa_agent.py --serve   # 간단 대화 루프(로컬 테스트)

로그: automation/logs/qa_YYYY-MM.jsonl (셀프 최적화용)
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
KB_PATH = Path(__file__).resolve().parent / "knowledge" / "faq.json"
LOG_DIR = ROOT / "automation" / "logs"

# 생명이 걸린 신호 — 전문가 안내와 같은 통에 담으면 안 된다.
# 의료·법률·재정 문의와 묶어 "전문가와 상의하세요"로 흘려보내던 것을 분리했다.
CRISIS = [
    "자살", "죽고싶", "죽고 싶", "죽고싶어", "극단적선택", "극단적 선택",
    "사라지고싶", "살기싫", "살고싶지않", "자해", "목숨을", "끝내고싶",
]

# 전문가 안내가 필요한 민감 키워드 (의료·법률·재정)
SENSITIVE = [
    "우울증", "병원", "암", "진단", "약",
    "소송", "고소", "이혼소송", "빚", "파산", "투자", "코인", "주식",
]


def load_kb() -> dict:
    return json.loads(KB_PATH.read_text(encoding="utf-8"))


def _tokenize(text: str) -> list[str]:
    return re.findall(r"[가-힣A-Za-z0-9]+", text.lower())


def is_crisis(question: str) -> bool:
    q = question.replace(" ", "")
    return any(word.replace(" ", "") in q for word in CRISIS)


def is_sensitive(question: str) -> bool:
    q = question.replace(" ", "")
    return any(word in q for word in SENSITIVE)


# 한국어 조사 — 짧은 키워드를 어절 단위로 판정할 때 붙는 것만 허용한다.
_PARTICLES = ("", "은", "는", "이", "가", "을", "를", "의", "도", "만", "에", "에서",
              "으로", "로", "과", "와", "랑", "이랑", "보다", "부터", "까지", "요")


def _short_kw_hit(kw: str, tokens: set[str]) -> bool:
    """
    한 글자 키워드를 부분 문자열로 보면 엉뚱한 데 걸린다.
    '향'이 '방향'에, '초'가 '기초'에, '점'이 '관점'에 걸려
    엉뚱하게 상품 추천 답변이 나가던 사고가 실제로 있었다.
    어절이 키워드로 '시작'하고 나머지가 조사일 때만 인정한다.

    두 글자 이상은 이 규칙을 적용하지 않는다. '얼마'가 '얼마예요'를
    놓치는 것처럼, 조사가 아닌 어미가 붙는 경우를 잡지 못하기 때문이다.
    """
    return any(t == kw + p for t in tokens for p in _PARTICLES)


def score_faq(question: str, entry: dict) -> int:
    """질문과 FAQ 항목의 키워드 겹침 점수."""
    q = question.lower()
    tokens = set(_tokenize(question))
    score = 0
    for kw in entry.get("keywords", []):
        k = kw.lower()
        hit = _short_kw_hit(k, tokens) if len(k) == 1 else k in q
        if hit:
            score += 2
    # 질문(q) 텍스트 토큰 겹침도 소폭 반영
    q_tokens = set(_tokenize(question))
    entry_tokens = set(_tokenize(entry.get("q", "")))
    score += len(q_tokens & entry_tokens)
    return score


def retrieve(question: str, kb: dict) -> tuple[dict | None, int]:
    best, best_score = None, 0
    for entry in kb["faq"]:
        s = score_faq(question, entry)
        if s > best_score:
            best, best_score = entry, s
    return best, best_score


def _llm_refine(question: str, base_answer: str, kb: dict) -> str | None:
    """ANTHROPIC_API_KEY가 있으면 톤 가이드로 답변을 다듬는다(선택). 실패 시 None."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return None
    try:
        import urllib.request

        tone = kb["_meta"]["tone_guide"]
        system = (
            "너는 '잼공인연사찰'의 도반 소통 담당이다. "
            f"말투: {tone['voice']} "
            f"반드시 지킬 것: {'; '.join(tone['must'])} "
            f"절대 금지: {'; '.join(tone['must_not'])} "
            "아래 초안 답변의 사실/근거는 유지하되, 더 자연스럽고 따뜻하게 다듬어라. "
            "새로운 사실을 지어내지 말 것."
        )
        payload = {
            "model": os.environ.get("QA_MODEL", "claude-opus-4-8"),
            "max_tokens": 600,
            "system": system,
            "messages": [
                {
                    "role": "user",
                    "content": f"[질문]\n{question}\n\n[초안 답변]\n{base_answer}",
                }
            ],
        }
        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=json.dumps(payload).encode(),
            headers={
                "content-type": "application/json",
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=40) as resp:
            data = json.loads(resp.read().decode())
        parts = [b.get("text", "") for b in data.get("content", []) if b.get("type") == "text"]
        refined = "".join(parts).strip()
        return refined or None
    except Exception as e:  # LLM 실패는 치명적이지 않음 — KB 답변으로 폴백
        print(f"[warn] LLM 다듬기 실패, KB 답변 사용: {e}", file=sys.stderr)
        return None


def answer(question: str, kb: dict | None = None) -> dict:
    kb = kb or load_kb()
    question = (question or "").strip()

    if not question:
        return {"source": "empty", "answer": kb["fallback"]["no_match"], "matched": None}

    # 위기 신호가 먼저다. 오행 이야기로 넘어가지 않고 사람에게 연결한다.
    if is_crisis(question):
        return {
            "source": "safety",
            "matched": "crisis",
            "answer": kb["fallback"]["crisis"],
        }

    if is_sensitive(question):
        return {
            "source": "safety",
            "matched": "sensitive",
            "answer": kb["fallback"]["sensitive"],
        }

    entry, score = retrieve(question, kb)
    if entry and score >= 2:
        base = entry["a"]
        matched = entry["id"]
        source = "kb"
    else:
        base = kb["fallback"]["no_match"]
        matched = None
        source = "fallback"

    refined = _llm_refine(question, base, kb)
    final = refined or base
    return {
        "source": "kb+llm" if refined else source,
        "matched": matched,
        "score": score,
        "answer": final,
    }


def log_qa(question: str, result: dict) -> None:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    month = dt.date.today().strftime("%Y-%m")
    with (LOG_DIR / f"qa_{month}.jsonl").open("a", encoding="utf-8") as f:
        f.write(
            json.dumps(
                {
                    "ts": dt.datetime.now().isoformat(timespec="seconds"),
                    "type": "qa",
                    "question": question,
                    "source": result.get("source"),
                    "matched": result.get("matched"),
                    "score": result.get("score"),
                },
                ensure_ascii=False,
            )
            + "\n"
        )


def _serve_loop() -> None:
    kb = load_kb()
    print("잼공인연사찰 도반 Q&A (로컬 테스트). 빈 줄 입력 시 종료.")
    while True:
        try:
            q = input("\n도반님: ").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if not q:
            break
        res = answer(q, kb)
        log_qa(q, res)
        print(f"\n인연사찰: {res['answer']}")


def main() -> None:
    args = sys.argv[1:]
    if args and args[0] == "--serve":
        _serve_loop()
        return
    if args:
        question = " ".join(args)
    else:
        question = sys.stdin.read()
    res = answer(question)
    log_qa(question, res)
    print(res["answer"])


if __name__ == "__main__":
    main()
