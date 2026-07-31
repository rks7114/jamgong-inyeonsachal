#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verify.py — 원고 자동 검사

정독 검수에서 실제로 나왔던 오류들을 다시 잡을 수 있게 만든 것이다.
사람이 읽어야만 보이는 것도 있지만, 기계가 잡을 수 있는 것을 기계가
놓치면 다음에도 같은 자리에서 같은 실수가 난다.

    python ebook/verify.py          # 전체 검사
    python ebook/verify.py -q       # 실패한 항목만

검사 항목
  1. 장 번호 연속성과 파일명·제목 일치
  2. 상호참조가 실재하는 장을 가리키는가
  3. 다음 장 예고가 실제 다음 장과 맞는가
  4. 옛 제목 잔존
  5. 핵심 수치가 장마다 어긋나지 않는가
  6. 관계행렬·가중치가 참조 구현과 일치하는가
  7. 사찰 DB 실측값과 본문 표기가 맞는가
  8. 마크다운 무결성 (표 열 수·CTA 마커·빈 제목)
  9. UTM 태그가 해당 장 번호인가
 10. 구현하지 않은 것을 구현했다고 적지 않았는가
 11. 서비스가 책의 약속을 지키는가 (길흉 판정·공포 문구·결과 약속)
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAPTERS = ROOT / "ebook" / "chapters"
APPENDIX = ROOT / "ebook" / "appendix"

FAILED: list[str] = []
PASSED: list[str] = []


def check(name: str, ok: bool, detail: str = "") -> None:
    """통과한 항목에는 사유를 붙이지 않는다 — 실패 사유만 읽히면 된다."""
    if ok:
        PASSED.append(name)
    else:
        FAILED.append(f"{name}{' — ' + detail if detail else ''}")


def norm(s: str) -> str:
    """한자 병기와 유니코드 부호를 지워 비교 가능한 형태로."""
    s = re.sub(r"\([一-龥]+\)", "", s)            # 대운(大運) → 대운
    return s.replace("−", "-").replace("–", "-").strip()


def chapters() -> dict[int, Path]:
    out = {}
    for p in sorted(CHAPTERS.glob("*.md")):
        m = re.match(r"(\d+)-", p.name)
        if m:
            out[int(m.group(1))] = p
    return out


def title_of(p: Path) -> str:
    return p.read_text(encoding="utf-8").split("\n", 1)[0].lstrip("# ").strip()


# ── 1~4. 구조
def check_structure(chs: dict[int, Path]) -> None:
    nums = sorted(chs)
    check("장 번호 연속", nums == list(range(1, max(nums) + 1)),
          f"누락 {[n for n in range(1, max(nums)+1) if n not in chs]}")

    bad = [p.name for n, p in chs.items()
           if not re.match(rf"제{n}장", title_of(p))]
    check("파일명↔제목 일치", not bad, str(bad))

    docs = list(chs.values()) + sorted(APPENDIX.glob("*.md"))
    oob = set()
    for p in docs:
        for m in re.finditer(r"제\s?(\d+)\s?장", p.read_text(encoding="utf-8")):
            if int(m.group(1)) not in chs:
                oob.add((p.name, m.group(0)))
    check("상호참조 유효", not oob, str(sorted(oob)[:5]))

    # 예고가 가리키는 장 번호
    wrong = []
    for n, p in chs.items():
        m = re.search(r"다음 장 예고\s*—\s*제(\d+)장", p.read_text(encoding="utf-8"))
        if m and int(m.group(1)) != n + 1:
            wrong.append(f"제{n}장→제{m.group(1)}장")
        elif not m and n < max(chs):
            wrong.append(f"제{n}장 예고 없음")
    check("다음 장 예고 번호", not wrong, str(wrong))

    # 예고 제목이 실제 제목과 겹치는가 (제1장에서 실제로 틀렸던 항목)
    mism = []
    for n, p in chs.items():
        m = re.search(r"다음 장 예고\s*—\s*제\d+장[.·]?\s*([^\n*]*)", p.read_text(encoding="utf-8"))
        if not m or n + 1 not in chs:
            continue
        fore = norm(m.group(1).strip().rstrip("*"))
        real = re.sub(r"^제\d+장[.·]\s*", "", title_of(chs[n + 1]))
        head = norm(re.split(r"[—:]", real)[0])
        if head and head[:6] not in fore:
            mism.append(f"제{n}장 예고 '{fore[:24]}' ↔ 실제 '{head[:24]}'")
    check("다음 장 예고 제목", not mism, str(mism))

    old = [p.name for p in docs + [ROOT / "README.md"]
           if "부적을 태우고" in p.read_text(encoding="utf-8")]
    check("옛 제목 잔존 없음", not old, str(old))


# ── 5. 핵심 수치
def check_numbers(chs: dict[int, Path]) -> None:
    docs = list(chs.values()) + sorted(APPENDIX.glob("*.md"))
    blob = "\n".join(p.read_text(encoding="utf-8") for p in docs)

    for label, pat, want in [
        ("사찰 총계", r"1?7[,.]?497", {"17,497"}),
        ("기도도량", r"\b465\b", {"465"}),
        ("상세정보", r"\b702\b", {"702"}),
        ("시너지 α", r"α\s*=\s*([\d.]+)", {"0.15"}),
    ]:
        found = {m.group(1) if m.groups() else m.group(0)
                 for m in re.finditer(pat, blob)}
        check(f"수치 일관 · {label}", found <= want, f"발견 {sorted(found)}")

    # K는 제19장이 민감도 설명으로 35를 의도적으로 쓴다
    ks = Counter(re.findall(r"K\s*=\s*(\d+)", blob))
    check("감쇠 K", ks.get("40", 0) >= 3 and set(ks) <= {"40", "35"},
          f"발견 {dict(ks)}")


# ── 6. 구현과의 일치
def check_against_code() -> None:
    try:
        out = subprocess.run([sys.executable, str(ROOT / "funnel" / "matcher.py"), "--matrix"],
                             capture_output=True, text=True, timeout=60).stdout
    except Exception as e:                                   # noqa: BLE001
        check("관계행렬 대조", False, f"실행 실패 {e}")
        return

    code = {}
    for line in out.split("\n"):
        cells = line.split()
        if len(cells) == 6 and cells[0] in "木火土金水":
            code[cells[0]] = [float(x) for x in cells[1:]]

    book = {}
    txt = (CHAPTERS / "18-제18장.md").read_text(encoding="utf-8")
    for line in txt.split("\n"):
        m = re.match(r"\|\s*\*\*([木火土金水])\*\*\s*\|(.+)\|", line)
        if m and "比" not in line:
            vals = re.findall(r"[+−-]?\d\.\d", m.group(2))
            if len(vals) == 5:
                book[m.group(1)] = [float(v.replace("−", "-").replace("+", ""))
                                    for v in vals]
    check("18장 관계행렬 25칸", book == code and len(code) == 5,
          f"책 {len(book)}행 · 코드 {len(code)}행")

    # 19장 최종 점수
    try:
        res = subprocess.run([sys.executable, str(ROOT / "funnel" / "matcher.py")],
                             capture_output=True, text=True, timeout=60).stdout
    except Exception as e:                                   # noqa: BLE001
        check("19장 계산 대조", False, str(e))
        return
    got = dict(re.findall(r"(\S+)\s+\(선형 [\d.]+ → 최종 (-?[\d.]+)\)", res))
    ch19 = (CHAPTERS / "19-제19장.md").read_text(encoding="utf-8")
    bad = [f"{k} 코드 {v}" for k, v in got.items() if v not in norm(ch19)]
    check("19장 최종 점수", not bad and len(got) == 3, str(bad))

    # 동급 판정 폭
    js = (ROOT / "src" / "matching-engine.js").read_text(encoding="utf-8")
    m = re.search(r"TIE_BAND\s*=\s*([\d.]+)", js)
    ch26 = (CHAPTERS / "26-제26장.md").read_text(encoding="utf-8")
    check("동급 판정 폭", bool(m) and f"{int(float(m.group(1)))}점 미만" in ch26,
          f"코드 {m.group(1) if m else '?'}")


# ── 7. 사찰 DB 실측
def check_db() -> None:
    js = """
      const db = require('./src/temple-db.full.js');
      const l = Array.isArray(db) ? db : (db.TEMPLE_DB || db.default || Object.values(db)[0]);
      console.log(JSON.stringify({
        total: l.length,
        coord: l.filter(t => t.lat && t.lng).length,
        history: l.filter(t => t.history).length,
        ohaeng: l.filter(t => t.ohaeng).length,
      }));
    """
    try:
        out = subprocess.run(["node", "-e", js], cwd=ROOT,
                             capture_output=True, text=True, timeout=120)
        d = json.loads(out.stdout.strip().split("\n")[-1])
    except Exception as e:                                   # noqa: BLE001
        check("DB 실측", False, f"읽기 실패 {e}")
        return

    ch22 = (CHAPTERS / "22-제22장.md").read_text(encoding="utf-8")
    for label, val in [("전체", d["total"]), ("좌표", d["coord"]), ("유래·연혁", d["history"])]:
        check(f"DB 표기 · {label}", f"{val:,}" in ch22, f"실측 {val:,}")

    # 프로파일이 실리면 제23장 5절 ⑤를 고쳐야 한다
    ch23 = (CHAPTERS / "23-제23장.md").read_text(encoding="utf-8")
    stale = d["ohaeng"] > 0 and "아직 서비스 데이터베이스에 올라가 있지 않다" in ch23
    check("프로파일 상태 서술", not stale,
          f"ohaeng {d['ohaeng']}건이 실렸는데 본문은 '아직 없다'고 적혀 있다")


# ── 8~9. 마크다운·UTM
def check_markdown(chs: dict[int, Path]) -> None:
    docs = list(chs.values()) + sorted(APPENDIX.glob("*.md"))
    tbl, cta, head = [], [], []
    for p in docs:
        lines = p.read_text(encoding="utf-8").split("\n")
        for i, l in enumerate(lines):
            if (l.strip().startswith("|") and i + 1 < len(lines)
                    and re.fullmatch(r"\|?[\s:\-|]+\|?", lines[i + 1].strip())
                    and "-" in lines[i + 1]):
                n = len(l.strip().strip("|").split("|"))
                j = i + 2
                while j < len(lines) and lines[j].strip().startswith("|"):
                    if len(lines[j].strip().strip("|").split("|")) != n:
                        tbl.append(f"{p.name}:{j+1}")
                    j += 1
            if re.fullmatch(r"#{1,6}\s*", l.strip()):
                head.append(f"{p.name}:{i+1}")
        t = "\n".join(lines)
        if t.count("<!-- CTA:AUTO-INSERT-START -->") != t.count("<!-- CTA:AUTO-INSERT-END -->"):
            cta.append(p.name)

    check("표 열 수", not tbl, str(tbl[:5]))
    check("CTA 마커 짝", not cta, str(cta))
    check("빈 제목 없음", not head, str(head[:5]))

    utm = [f"{p.name}→ch{m}" for n, p in chs.items()
           for m in re.findall(r"utm_content=ch(\d+)", p.read_text(encoding="utf-8"))
           if int(m) != n]
    check("UTM 장 번호", not utm, str(utm))


# ── 10. 구현 과장
def check_overclaim() -> None:
    """검수에서 실제로 나왔던 문장 형태를 다시 잡는다."""
    docs = sorted(CHAPTERS.glob("*.md")) + sorted(APPENDIX.glob("*.md")) \
        + [ROOT / "README.md", ROOT / "docs" / "자동화-시스템-개요.md",
           ROOT / "ebook" / "sales-page" / "상세페이지-카피.md"]
    engine = (ROOT / "src" / "matching-engine.js").read_text(encoding="utf-8")
    forbidden = []
    for feature, kw in [("파·해", ("파해", "破", "害")),
                        ("격국", ("격국", "格局"))]:
        if any(k in engine for k in kw):
            continue                      # 구현되면 이 검사는 자동으로 풀린다
        for p in docs:
            if not p.exists():
                continue
            for line in p.read_text(encoding="utf-8").split("\n"):
                if feature.replace("·", "") in line.replace("·", "") \
                        and re.search(r"(엔진|매칭).{0,20}(가중치|비중|낮게|반영|입력으로 (쓴다|삼는다))", line) \
                        and "않" not in line and "없다" not in line:
                    forbidden.append(f"{p.name}: {line.strip()[:60]}")
    check("엔진 미구현 기능 과장", not forbidden, str(forbidden[:3]))


# ── 11. 서비스가 책의 약속을 지키는가
def check_service_promises() -> None:
    """책이 '하지 않는다'고 적은 것을 코드가 하고 있지 않은지.

    책의 오류는 읽는 사람이 속는 것이지만, 이쪽은 서비스가 실제로 그렇게
    답한다. 그래서 따로 검사한다.
    """
    targets = [ROOT / "api" / "dream.js", ROOT / "api" / "chatbot.js",
               ROOT / "src" / "main.js"]
    src = {p.name: p.read_text(encoding="utf-8") for p in targets if p.exists()}

    # ① 꿈에 길흉을 판정하도록 지시하거나 화면에 그 이름을 걸지 않는다
    verdict = [n for n, t in src.items()
               if re.search(r"(길흉\s*판단|길\(吉\)\s*(또는|/)\s*흉)", t)
               and "판정하지" not in t]
    check("꿈 길흉 판정 없음", not verdict, str(verdict))

    # ② 상징 사전이 결과를 단정하지 않는다 (돼지=재물 식)
    dream = src.get("dream.js", "")
    omen = re.findall(r"meaning:\s*'[^']*(예고|징조|길상|운 상승)[^']*'", dream)
    check("상징 사전 예고 표현 없음", not omen, f"{len(omen)}건")

    # ③ 공포 문구 — 경고색·경고 아이콘을 신살에 붙이지 않는다
    fear = []
    for n, t in src.items():
        for m in re.finditer(r"[^\n]{0,120}삼재[^\n]{0,120}", t):
            seg = m.group(0)
            if "⚠️" in seg or "#ff8080" in seg:
                fear.append(f"{n}: {seg.strip()[:60]}")
    check("신살 공포 표시 없음", not fear, str(fear[:2]))

    # ④ 결과를 약속하지 않는다
    promise = [f"{n}" for n, t in src.items()
               if re.search(r"소원[^\n]{0,20}반드시 이루어진", t)]
    check("결과 약속 문구 없음", not promise, str(promise))


def main() -> None:
    ap = argparse.ArgumentParser(description="원고 자동 검사")
    ap.add_argument("-q", "--quiet", action="store_true", help="실패만 출력")
    args = ap.parse_args()

    chs = chapters()
    if not chs:
        raise SystemExit("[error] 원고를 찾을 수 없습니다.")

    check_structure(chs)
    check_numbers(chs)
    check_against_code()
    check_db()
    check_markdown(chs)
    check_overclaim()
    check_service_promises()

    if not args.quiet:
        for line in PASSED:
            print(f"  ✓ {line}")
    for line in FAILED:
        print(f"  ✗ {line}")

    total = len(PASSED) + len(FAILED)
    print(f"\n{len(PASSED)}/{total} 통과")
    sys.exit(1 if FAILED else 0)


if __name__ == "__main__":
    main()
