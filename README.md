# 잼공인연사찰

생년월일시 사주 오행(木火土金水) 분석으로 전국 사찰을 매칭하는 서비스 —
그 원리를 계산 규칙까지 전부 공개한 **전자책**과 **자동화 시스템**.

**웹 서비스** · [jamgong-inyeonsachal.vercel.app](https://jamgong-inyeonsachal.vercel.app)

---

## 구성

| 경로 | 내용 |
|---|---|
| `ebook/` | 전자책 《부적을 태우고 데이터를 켜다》 원고·부록·EPUB 빌더 |
| `funnel/` | 오행 계산기 · 매칭 엔진 참조 구현 · CTA 자동 삽입기 |
| `automation/` | 스레드 발행 · Q&A 에이전트 · 일일 회고 · 집필 트래커 |
| `docs/` | 시스템 개요 |

---

## 📖 전자책

**《부적을 태우고 데이터를 켜다》** — 사주 오행으로 찾는 나의 인연 도량
지은이 **제운 박충호** (잼공 연구소)

생년월일시 오행 분석으로 전국 사찰을 매칭하는 원리를, 계산 규칙까지 전부 공개한 책입니다.

- **8부 30장 + 부록 7종**, 약 102,000자
- 전 장 CTA 삽입 완료 · 28~30장은 잼공몰 큐레이션 직결

```bash
python ebook/build_epub.py     # → ebook/dist/부적을태우고데이터를켜다.epub
python ebook/render_cover.py   # → ebook/dist/cover.png (1707×2560, 판매 등록용)
```

외부 의존성(pandoc·calibre) 없이 표준 라이브러리만으로 EPUB 3을 생성합니다.
표지는 코드로 그린 SVG 한 벌이 원본이고, 판매 플랫폼용 PNG도 같은 소스에서 뽑습니다 — 표지를 두 번 만들지 않습니다.

### 집필 원칙

1. 주술·부적·"카더라"식 마케팅을 전면 배제한다
2. 모든 주장은 오행 역학 논리 또는 데이터로 근거를 제시한다
3. 독자가 스스로 검증·재현할 수 있는 방법을 함께 제공한다

이 원칙은 자기 자신에게도 적용했습니다. 특허 상수가 설계 선택임(18장), 용신 판정이 해석임(14장), 사찰 좌표에 판단이 개입함(23장), 다섯 특허의 근거 강도가 서로 다름(부록 F)을 본문에 밝혀 두었습니다.

---

## 🔍 검산 도구

본문의 계산은 전부 공개되어 있고, 참조 구현체로 직접 확인할 수 있습니다.

```bash
# 제8장 — 오행 분포 가중 계산
python funnel/ohang_calculator.py --saju 壬申 甲子 丙戌 庚午

# 제17~19장 — 매칭 엔진 (관계행렬 · 편차 감쇠 · 비가산 시너지)
python funnel/matcher.py
python funnel/matcher.py --matrix          # 5×5 방향성 관계행렬
python funnel/matcher.py --yongsin 火      # 용신을 바꿔 재계산
```

마지막 명령이 이 시스템의 핵심을 보여줍니다. **용신이 바뀌면 순위가 통째로 뒤집힙니다** — 절대적으로 좋은 사찰은 없고, 순위는 사람마다 새로 계산됩니다.

---

## ⚙️ 자동화 파이프라인

```
스레드 발행 ─┐
Q&A 응대    ─┼─▶ logs/*.jsonl ─▶ 일일 회고 ─┬─▶ 미매칭 질문 → 지식베이스 보강
(유입·판매) ─┘                              └─▶ 전환율 → 가격 조정 '제안'
```

```bash
python funnel/cta_injector.py --dry-run                  # CTA 삽입 미리보기 (멱등)
python automation/threads/post_scheduler.py --dry-run    # 홍보글 미리보기
python automation/qa-agent/qa_agent.py "이거 미신 아닌가요?"
python automation/analytics/daily_report.py              # 일일 회고
python automation/manuscript/progress.py                 # 집필 진척
crontab automation/crontab.example                       # 스케줄 등록 (경로 수정 후)
```

### 안전 기본값

- **자격증명이 없으면 외부로 발행하지 않습니다.** 기본은 항상 dry-run
- **가격은 자동 변동하지 않습니다.** 리포트는 '제안'만 하고 반영은 사람이
- **민감 주제(의학·법률·재정·위기)는 응대하지 않고 전문가로 안내합니다**

설정은 `automation/.env.example`을 `.env`로 복사해 채우면 됩니다.
운영 상세는 [`automation/README.md`](automation/README.md).

---

## 고지

이 책과 서비스는 **의료·법률·재정 자문이 아닙니다.** 결과를 약속하지 않으며, 불교 교리를 대변하지 않습니다. 저자의 종단 관계를 포함한 전체 고지는 부록 G에 있습니다.

계산 결과나 사찰 데이터에 이견이 있으시면 근거와 함께 알려주십시오. 수정 이력을 남기고 반영합니다.

---

**© 잼공 (JAMGONG)** · 브랜드 잼공인연사찰

> 맹신이 끝나는 곳에서, 진짜 정성이 시작된다.
