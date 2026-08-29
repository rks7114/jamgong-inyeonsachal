---
name: db-status
description: 잼공인연사찰 프로젝트 현황 요약 — 사용자가 "/db-status", "상태", "현황", "진행 상황 보여줘", "워크트리 상태"를 입력하면 이 스킬을 사용하세요. 모바일에서 짧은 입력으로 워크트리·DB 품질·성능·배포 상태를 한 번에 확인하는 용도입니다.
---

# 프로젝트 현황 요약 (/db-status)

모바일에서 한 줄로 프로젝트 전체 상태를 확인하는 단축 명령. 아래를 순서대로 실행하고 **한 화면에 들어가는 간결한 요약**으로 보고한다 (모바일 열람 전제 — 표는 짧게, 파일 경로 나열 금지).

## 수집 항목

1. **브랜치 현황**: `git fetch --all --quiet; git log --oneline -1 origin/main origin/feature/search-optimization origin/feature/temple-db-v2` — 각 브랜치 최신 커밋 한 줄씩. feature 브랜치가 main보다 몇 커밋 앞/뒤인지 (`git rev-list --left-right --count`).

2. **DB 품질**: feature/temple-db-v2의 `scripts/db-quality-check.js --json` 실행 (없으면 해당 브랜치 체크아웃 후). 기준선(id 중복 3,484 / 좌표 미확보 4,175 / 비사찰 237) 대비 증감만 보고.

3. **성능**: `node .claude/skills/saju-test/scripts/benchmark.js` 1회 — 통과/실패와 최속 라운드 수치만. 절대치 미달이면 "환경 부하 가능성"을 함께 표시 (saju-test 스킬의 상대 비교 규칙 참조).

4. **최근 리포트**: `.claude/db-quality-reports/` 최신 파일 날짜, GitHub 이슈 "DB 품질 주간 리포트" 최신 건 (이슈 도구 있을 때만).

## 출력 형식

```
📊 잼공인연사찰 현황 (YYYY-MM-DD HH:mm KST)
브랜치: main <해시> · 검색최적화 (+N/-N) · DB v2 (+N/-N)
DB 품질: 중복 N (기준 대비 ±N) · 좌표미확보 N (±N) · 비사찰 N (±N)
성능: ✅/❌ matchTemples N.Nms · couple N.Nms
최근 리포트: <날짜 또는 "아직 없음">
⚠️ 주의 필요: <있으면 한 줄, 없으면 생략>
```

이상 징후(품질 지표 악화, 벤치마크 결과 불일치, 브랜치 충돌 위험)가 있으면 ⚠️ 줄에 요약하고, 정상이면 그 줄을 생략한다.
