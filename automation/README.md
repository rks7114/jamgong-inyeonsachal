# 잼공인연사찰 완전 자동화 시스템 (Full-Auto Loop)

> 벤치마킹: '윤자동' 유형의 AI 자동화 퍼널 — 기획·집필·상세페이지·SNS 홍보·24시간 도반 소통·회고를 AI가 스스로 수행하는 루프.
> 이 디렉터리는 **Step 3(홍보·소통·회고 파이프라인)** 의 실행 스크립트를 담는다. Step 1(전자책)·Step 2(락인 퍼널)는 각각 `ebook/`, `funnel/` 참고.

## 전체 구조

```
jamagong/
├── ebook/                     # [Step 1] 전자책 원고 + 상세페이지 카피
│   ├── 00-목차.md
│   ├── chapters/01-제1장.md   #  (제1장 전문 초안 완성)
│   └── sales-page/상세페이지-카피.md
├── funnel/                    # [Step 2] 락인(Lock-in) 퍼널
│   ├── cta_injector.py        #  각 장에 오행 매칭 CTA / 잼공몰 링크 자동 삽입
│   └── ohang_product_map.json #  오행 → 잼공몰 기도용품 매칭 근거 테이블
└── automation/               # [Step 3] 24시간 자율 파이프라인
    ├── threads/               #  스레드 자동 홍보 발행
    │   ├── post_scheduler.py
    │   └── templates/post_templates.json
    ├── qa-agent/              #  24시간 도반 Q&A 응대
    │   ├── qa_agent.py
    │   └── knowledge/faq.json
    ├── analytics/             #  일일 셀프 최적화 회고
    │   └── daily_report.py
    ├── logs/                  #  런타임 로그(jsonl) + 리포트(md) — .gitignore
    ├── crontab.example        #  스케줄 정의
    └── .env.example           #  자격증명 템플릿
```

## 데이터 흐름 (셀프 최적화 루프)

```
   스레드 발행 ─┐
   Q&A 응대   ─┼─▶ logs/*.jsonl ─▶ daily_report.py ─▶ report_YYYY-MM-DD.md
   (유입/판매)─┘                        │
                                        └─▶ 미매칭 질문 → faq.json 보강 (액션아이템)
                                        └─▶ 전환율     → 가격 조정 '제안'
```

## 빠른 시작

```bash
# 0) (선택) 자격증명 설정 — 없으면 모든 스크립트가 안전한 dry-run 으로 동작
cp automation/.env.example automation/.env   # 값 채우기

# 1) [Step 2] 전자책 각 장에 CTA/잼공몰 링크 삽입 (멱등)
python funnel/cta_injector.py --dry-run
python funnel/cta_injector.py

# 2) [Step 3] 스레드 홍보 글 미리보기
python automation/threads/post_scheduler.py --dry-run

# 3) [Step 3] Q&A 응대 테스트
python automation/qa-agent/qa_agent.py "이거 미신 아닌가요?"
python automation/qa-agent/qa_agent.py --serve   # 대화 루프

# 4) [Step 3] 일일 회고 리포트
python automation/analytics/daily_report.py

# 5) 크론 등록(경로 수정 후)
crontab automation/crontab.example
```

## 각 컴포넌트

### 1. 스레드 자동 홍보 (`threads/post_scheduler.py`)
- 요일별 카테고리 로테이션(오행 팁 / 인연사찰 사례 / 철학)으로 글을 조립.
- `THREADS_USER_ID` + `THREADS_ACCESS_TOKEN` 있으면 Threads Graph API로 실발행, 없으면 dry-run.
- 모든 발행에 UTM(`utm_source=threads`) 부착, 결과를 `logs/threads_*.jsonl`에 기록.
- **자격증명 미설정 시 절대 외부로 발행하지 않는다**(안전 기본값).

### 2. 도반 Q&A 에이전트 (`qa-agent/qa_agent.py`)
- 지식베이스(`faq.json`) 키워드 매칭으로 근거 있는 답변 생성.
- `ANTHROPIC_API_KEY` 있으면 톤 가이드+KB를 컨텍스트로 넣어 답변을 더 자연스럽게 다듬음(사실은 유지).
- 의학·법률·재정·위기 등 **민감 주제는 전문가 안내로 우회**.
- `answer(question)` 함수로 임포트해 웹 위젯/웹훅/서버리스에 연결 가능.

### 3. 셀프 최적화 회고 (`analytics/daily_report.py`)
- 하루치 로그 집계: 발행 건수·카테고리, Q&A 매칭률·미매칭 질문, 민감 응답 수.
- `logs/metrics_YYYY-MM-DD.json`(방문·판매·현재가) 제공 시 전환율 기반 **가격 조정 '제안'** 산출.
- 내일의 액션 아이템 자동 도출(예: 매칭률 낮으면 faq.json 보강).

## 안전·운영 원칙
- **가격은 자동 변동하지 않는다.** 리포트는 '제안'만 하며, 반영은 사람 확인/승인 후.
- **자격증명 없으면 외부 발행 없음.** 기본은 항상 dry-run.
- **민감 주제는 응대하지 않고 전문가로 안내.**
- **브랜드 톤 준수:** 공포·과장·주술 배제, 모든 응대에 근거 제시.

## metrics 파일 형식 (선택)
`automation/logs/metrics_2026-07-30.json`:
```json
{ "visits": 1200, "sales": 18, "current_price": 19900, "target_cvr": 0.02 }
```
