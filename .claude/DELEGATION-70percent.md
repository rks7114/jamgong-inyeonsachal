# 팁 28: 70% 업무 위임 최종 체크리스트

**목표**: 반복 작업의 70%를 Claude 에이전트에 완전 위임  
**시작 일자**: 2026-08-29  
**책임**: 사용자 (승인/모니터링) / 에이전트 (실행)

---

## 1. 자동화된 작업 목록 (70%)

### 1.1 일일 자동화 작업

| 작업 | 담당 에이전트 | 트리거 | 절차 | 예상 시간 |
|------|---------|--------|------|---------|
| 매칭 성능 벤치마크 | saju-expert | 매일 오전 9시 (UTC+9) | `node .claude/skills/saju-test/scripts/benchmark.js` | 2분 |
| DB 품질 체크 | temple-db-engineer | 매일 오전 10시 | `node .claude/skills/db-status/scripts/check.js` | 1분 |
| 배포 상태 모니터링 | ui-deploy-engineer | 매일 오전 11시 | Vercel API 폴링 (최근 배포 상태) | 30초 |
| 에이전트 상태 리포트 | 사용자 봇 | 매일 오후 6시 | 세 에이전트 상태 종합 (Slack 알림) | 1분 |

**자동화 도구**: 
- GitHub Actions (매일 워크플로우) 또는 
- Vercel Cron (서버리스 함수)

**예시 워크플로우** (`.github/workflows/daily-check.yml`):
```yaml
name: Daily Agent Tasks
on:
  schedule:
    - cron: '0 0 * * *'  # UTC 0시 = KST 9시

jobs:
  saju-benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: node .claude/skills/saju-test/scripts/benchmark.js
      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: saju-benchmark-${{ github.run_id }}
          path: benchmark-report.json

  db-quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: node .claude/skills/db-status/scripts/check.js > db-report.json
      - name: Upload report
        uses: actions/upload-artifact@v3
```

### 1.2 주간 자동화 작업

| 작업 | 담당 에이전트 | 주기 | 절차 | 예상 시간 |
|------|---------|-------|------|---------|
| 주간 요약 리포트 | 사용자 봇 | 매주 목요일 오전 9시 | 커밋 로그 + benchmark + db 리포트 종합 | 3분 |
| 주간 동기화 회의 | 3 에이전트 | 매주 금요일 오전 10시 | 템플릿 기반 진행상황 보고 (Slack) | 20분 |
| 코드 품질 스캔 | 전체 | 매주 금요일 오후 2시 | 보안/성능 리뷰 (자동 → 수동 승인) | 5분 |
| 우선도 정렬 회의 | 사용자 | 매주 금요일 오후 3시 | 다음주 작업 백로그 정렬 | 15분 |

### 1.3 월간 자동화 작업

| 작업 | 담당 에이전트 | 주기 | 절차 | 예상 시간 |
|------|---------|-------|------|---------|
| 월간 성과 평가 | 각 에이전트 | 월말 금요일 오전 9시 | 개인 평가 자료 생성 | 10분 |
| DB 중복/오류 분석 | temple-db-engineer | 월말 금요일 오전 10시 | db-quality-check.js + 분석 리포트 | 5분 |
| 배포 안정성 리포트 | ui-deploy-engineer | 월말 금요일 오전 11시 | Vercel 배포 실패율 + 빌드 성공률 | 3분 |
| 사주 계산 정확도 리포트 | saju-expert | 월말 금요일 오전 12시 | 회귀 테스트 + 성능 추이 분석 | 5분 |
| 팀 성과지표 계산 | 사용자 | 월말 금요일 오후 1시 | 배포 횟수 + 버그율 + 충돌 해결 시간 | 5분 |

### 1.4 분기별 자동화 작업

| 작업 | 담당 | 주기 | 절차 |
|------|------|------|------|
| 분기 동기화 회의 | 사용자 + 전원 | Q1/Q2/Q3/Q4 시작 월 첫 금요일 | 성과 검토 + 다음 분기 목표 수립 |
| 기술 부채 분석 | 각 에이전트 | 매 분기 말 | 리팩토링/성능 개선 백로그 수립 |
| 보안 감사 | 사용자 | 매 분기 | 의존성 보안 업데이트 + 설정 검토 |

---

## 2. 인간 판단이 필요한 작업 (30%)

### 2.1 설계 & 아키텍처 결정 (불가위임)

| 항목 | 사유 | 예시 |
|------|------|------|
| 새 기능 설계 | 비즈니스 목표 포함 | "거리 가중치 재도입", "새 오행 계산법" |
| 알고리즘 변경 | 정확도-성능 트레이드오프 | "벤치마크 11.7ms vs 정확도 99%" |
| 스키마 변경 | 마이그레이션 영향도 | DB 구조 재설계 |
| API 인터페이스 변경 | 클라이언트/서버 호환성 | 응답 필드 추가/제거 |
| 배포 정책 변경 | 롤아웃 전략 | 카나리 배포 도입 |

### 2.2 우선도 & 일정 관리 (불가위임)

| 항목 | 사유 | 예시 |
|------|------|------|
| 월간 백로그 우선도 | 비즈니스 임팩트 판단 | "검색 성능 > DB 정제" |
| 긴급 이슈 판단 | 라이브 영향도 평가 | "배포 실패 vs 경고" |
| 데드라인 조정 | 리소스 할당 | "분기 목표 연기 여부" |
| 스콥 조정 | 맥락 이해 | "MVP vs 완전 기능" |

### 2.3 충돌 해결 (불가위임)

| 항목 | 사유 |
|------|------|
| 에이전트 간 우선도 충돌 | 설계 재검토 필요 |
| 성능 vs 정확도 트레이드오프 | 최종 판단은 사용자 |
| 기술 선택 (예: 캐시 전략) | 장기 영향도 평가 |

### 2.4 승인 & 검증 (불가위임)

| 항목 | 체크 사항 |
|------|---------|
| 메인 브랜치 머지 | CI 통과 + 성과 리포트 검토 |
| 배포 실행 | vercel.json + .deploy 파일 확인 |
| 데이터 삭제 | 백업 + 쿼리 검증 |
| API 응답 변경 | 클라이언트 영향도 확인 |

### 2.5 외부 커뮤니케이션 (불가위임)

| 항목 | 예시 |
|------|------|
| 사용자/이해관계자 공지 | "새 기능 출시", "점검 공지" |
| 에러 리포트 답변 | "왜 이 에러가 났는가" |
| 특허/라이선스 결정 | "잼공결 라이선싱" |

---

## 3. 위임 전제 조건 (안전장치)

### 3.1 필수 체크리스트 (위임 전)

에이전트에게 작업을 위임하기 전 다음을 반드시 확인하세요:

**기술 준비**
- [ ] 자동화 스크립트/워크플로우 검증 (로컬 테스트 3회 이상)
- [ ] 에이전트 정의 문서 (`.claude/agents/*.md`) 최신화
- [ ] 에러 처리 및 롤백 절차 명문화
- [ ] 모니터링 대시보드 연결 (아래 4.1 참조)

**프로세스 준비**
- [ ] AGENT-OPERATIONS.md 숙지 (충돌 해결, 이슈 리포트 템플릿)
- [ ] 에이전트별 성과 평가 기준 이해 (월/분기)
- [ ] 주간 동기화 회의 일정 고정 (매주 금요일 10시)
- [ ] 긴급 중단 방법 확인 (아래 5.1 참조)

**리스크 평가**
- [ ] 각 작업의 "실패 시 영향도" 평가 (높음/중간/낮음)
- [ ] 자동 롤백 불가능한 작업 확인 (데이터 삭제 등)
- [ ] 에이전트 역할 오버래핑 감지
- [ ] 사용자 개입 필요 임계값 설정 (예: 실패율 > 5%)

### 3.2 에이전트별 승인 요건

**saju-expert 작업 승인 (매칭 엔진 수정)**
```
✅ benchmark 통과 (matchTemples < 11.7ms, matchCoupleTemples < 16.6ms)
✅ 회귀 테스트 통과 (결과 일관성 확인)
✅ 성능 변화 < 10%
✅ 커밋 메시지에 변경 근거 명시
→ 사용자: 결과 리뷰 후 main 머지 승인
```

**temple-db-engineer 작업 승인 (DB 정제)**
```
✅ db-quality-check.js 통과
✅ 검색 성능 150ms 유지
✅ 매칭 결과 영향도 benchmark로 검증
✅ 커밋에 변경 데이터 통계 첨부 (예: "중복 제거 50건")
→ 사용자: DB 변경 내역 검토 후 main 머지 승인
```

**ui-deploy-engineer 작업 승인 (배포)**
```
✅ 로컬 빌드 성공 (npm run build)
✅ dist/ 변경 검토 (번들 해시 + index.html 참조만 변경)
✅ Vercel 프리뷰 배포 성공
✅ 성능 영향도 체크 (Core Web Vitals)
→ 사용자: Vercel production 배포 승인
```

### 3.3 안전장치 (circuit breaker)

**자동 중단 조건**:
- benchmark 실패 또는 회귀 감지 → 즉시 롤백
- 배포 실패 3회 연속 → 자동 중단, 사용자 알림
- 버그 리포트 월 3건 초과 → 작업 속도 저하 검토
- 에이전트 간 충돌 해결 시간 > 24시간 → 사용자 개입

**모니터링 임계값**:
| 지표 | 정상 범위 | 경고 | 긴급 |
|------|---------|------|------|
| benchmark 성능 | < 11.7ms | 11.7-12.5ms | > 12.5ms |
| 배포 성공률 | > 95% | 90-95% | < 90% |
| DB 품질 (회귀) | 0 | < 5건 | > 5건 |
| 충돌 해결 시간 | < 12시간 | 12-24시간 | > 24시간 |

---

## 4. 모니터링 대시보드

### 4.1 대시보드 구성

**위치**: 인트라넷 또는 GitHub wiki  
**갱신 주기**: 매일 오전 9시 (자동)  
**접근**: 사용자만 + 에이전트 조회 가능

**대시보드 7개 섹션**:

#### Section 1: 일일 작업 상태 (Daily Pulse)
```
[매일 오전 9시 갱신]

saju-expert:
  ✅ Benchmark (matchTemples: 11.3ms, matchCoupleTemples: 16.2ms) | 2026-08-29 09:00
  ✅ 회귀 테스트 (0건) | 통과
  ⚠️ 차단 사항: 없음

temple-db-engineer:
  ✅ DB Quality Check (중복: 3,484, 좌표없음: 4,175, 비사찰: 234) | 2026-08-29 10:00
  ✅ 검색 성능 (150ms) | 통과
  ✅ 차단 사항: 없음

ui-deploy-engineer:
  ✅ 배포 상태 (마지막: 2026-08-28 14:23, 성공) | 정상
  ✅ 빌드 상태 (npm run build) | 성공
  ✅ 차단 사항: 없음
```

#### Section 2: 주간 핵심 지표 (Weekly KPI)
```
[매주 금요일 오후 3시 갱신]

배포:
  - 이번주 배포: 3회 (목표: 1회/주 이상) ✅
  - 배포 실패: 0건 ✅
  - 평균 빌드 시간: 45초

품질:
  - 라이브 버그: 0건 ✅
  - 벤치마크 회귀: 0건 ✅
  - 검색 성능 저하: 없음 ✅

협업:
  - 에이전트 간 충돌: 0건 ✅
  - 이슈 에스컬레이션: 1건 (Level 3 / 해결됨)
  - 평균 회의 시간: 18분 / 20분 목표
```

#### Section 3: 월간 성과 (Monthly Performance)
```
[매월 말 금요일 오후 1시 갱신]

saju-expert:
  - 알고리즘 정확도: 100% (회귀 0건) | 40점/40점 ✅
  - 성능 기준: 11.3ms / 11.7ms | 30점/30점 ✅
  - 협업 품질: 충돌 0건, 해결시간 평균 8시간 | 20점/20점 ✅
  - 문서화: 100% | 10점/10점 ✅
  - 월간 점수: 100/100 ⭐

temple-db-engineer:
  - 데이터 품질: 중복 감소 추세 | 35점/40점
  - 검색 응답성: 150ms | 30점/30점 ✅
  - 협업 품질: 사전 협의 100% | 20점/20점 ✅
  - 문서화: 95% | 9점/10점
  - 월간 점수: 94/100 ⭐

ui-deploy-engineer:
  - 배포 안정성: 0건 실패 | 40점/40점 ✅
  - 빌드 성공률: 100% | 30점/30점 ✅
  - 협업 품질: API 요청 평균 6시간 | 20점/20점 ✅
  - 문서화: 100% | 10점/10점 ✅
  - 월간 점수: 100/100 ⭐

팀 성과지표:
  - 배포 횟수: 12회 / 목표 12회 ✅
  - 라이브 버그: 1건 / 목표 < 2건 ✅
  - 충돌 해결 시간: 평균 10시간 / 목표 < 12시간 ✅
  - 사용자 만족도: 4.2 / 목표 4.0 ✅
  - 팀 점수: 95/100 ⭐
```

#### Section 4: 위험도 지표 (Risk Indicators)
```
[실시간 갱신]

🟢 정상 (Green)
  - 모든 지표가 정상 범위 내
  - 차단 사항 없음
  - 긴급 개입 불필요

🟡 주의 (Yellow)
  - benchmark 성능: 12.1ms (경고 범위)
  - 배포 성공률: 92% (90-95% 범위)
  - 충돌 해결 시간: 15시간 (12-24시간 범위)
  → 액션: 모니터링 강화, 다음 회의에서 논의

🔴 긴급 (Red)
  - [현재 없음]
  - 임계값 도달 시 자동 알림 (사용자 + Slack)
```

#### Section 5: 에이전트 활동 피드 (Activity Feed)
```
[시간순 역정렬]

2026-08-29 11:05 | saju-expert | ✅ benchmark 완료 (11.3ms)
2026-08-29 10:30 | temple-db-engineer | ✅ DB quality check 완료
2026-08-29 10:15 | ui-deploy-engineer | ✅ vercel 배포 상태 정상
2026-08-28 14:23 | ui-deploy-engineer | ✅ main 배포 완료 (#623e941)
2026-08-28 10:00 | saju-expert | 🔄 매칭 알고리즘 최적화 진행 중 (ETA: 28일)
2026-08-27 16:00 | temple-db-engineer | 🚨 이슈 리포트: 검색 성능 저하 (조사 중)
```

#### Section 6: 백로그 & 우선도 (Backlog)
```
[매주 금요일 갱신]

다음주 우선 작업:
1. ⭐⭐⭐ saju-expert: 신살 계산 정확도 개선 (ETA: 목요일)
2. ⭐⭐⭐ temple-db-engineer: 좌표 없는 레코드 500건 수동 검증 (ETA: 수요일)
3. ⭐⭐ ui-deploy-engineer: Core Web Vitals 성능 최적화 (ETA: 금요일)
4. ⭐ saju-expert: 설명 문구 개선 (ETA: 다음주)

진행 중 (예상 완료):
- saju-expert: 궁합 계산 로직 리팩토링 (2026-09-02)
- temple-db-engineer: 비사찰 항목 필터링 개선 (2026-08-31)
- ui-deploy-engineer: 모바일 UI 반응성 개선 (2026-09-05)
```

#### Section 7: 문제 해결 로그 (Issue Tracker)
```
[실시간]

🔴 높음 (High)
  - [없음]

🟡 중간 (Medium)
  - #1: 검색 성능 150ms 상한 근접 (149ms) | saju-expert 의존 | 2026-08-28 생성 | 상태: 조사 중

🟢 낮음 (Low)
  - #2: 일부 사찰명 표기 오류 (3건) | temple-db-engineer | 2026-08-25 생성 | 상태: 백로그
  - #3: 모바일 폰트 크기 조정 요청 | ui-deploy-engineer | 2026-08-22 생성 | 상태: 다음 분기
```

### 4.2 대시보드 구현 옵션

**Option A: GitHub Wiki (추천)**
- 마크다운 + GitHub API로 자동 갱신
- 링크: `https://github.com/rks7114/jamgong-inyeonsachal/wiki/Dashboard`
- 업데이트 스크립트: `.github/scripts/update-dashboard.js` (GitHub Actions)

**Option B: Vercel 클라우드 기능**
- 서버리스 함수로 대시보드 렌더링
- 엔드포인트: `https://jamgong-inyeonsachal.vercel.app/admin/dashboard`
- 실시간 업데이트 (WebSocket)

**Option C: Notion (간단함)**
- 자동 동기화 (외부 API)
- 권한 관리 기능 제공

---

## 5. 긴급 중단 프로토콜

### 5.1 중단 시나리오 & 절차

**Scenario 1: 배포 실패 (라이브 영향)**

**감지**: 
- Vercel CI 실패 또는 
- 사용자 보고: "사이트가 동작하지 않음"

**즉시 조치** (5분 내):
1. ui-deploy-engineer 작업 **즉시 중단** (`interrupt_session` 호출)
2. 마지막 성공 배포로 **자동 롤백** (Vercel revert 버튼)
3. git revert를 통해 마지막 커밋 되돌리기
4. 사용자 & Slack 알림: "배포 실패, 롤백 완료 (시간)"

**복구 절차**:
- 원인 파악: 빌드 실패 vs 런타임 오류
- 로컬 재현: `npm run build && npm run preview`
- 수정 후: 사용자 승인 후 재배포

**Scenario 2: 벤치마크 회귀 (알고리즘 정확도)**

**감지**:
- saju-expert benchmark.js 실패 또는
- 매칭 결과 불일치 (결과 어댑터 테스트 실패)

**즉시 조치** (10분 내):
1. saju-expert 작업 **즉시 중단**
2. git bisect로 버그 도입 커밋 찾기
3. 해당 커밋 **자동 revert**
4. benchmark 재실행 (통과 확인)

**복구 절차**:
- 버그 수정 후 benchmark 재통과 필요
- 사용자 승인 후 다시 커밋

**Scenario 3: DB 데이터 손상**

**감지**:
- db-quality-check.js 이상 감지 또는
- 중복/오류 급증

**즉시 조치** (3분 내):
1. temple-db-engineer 작업 **즉시 중단**
2. 최후 검증된 버전의 temple-db.full.js로 **수동 복구** (git checkout)
3. 사용자 & Slack 알림: "DB 복구 완료, 원인 조사 중"

**복구 절차**:
- git log로 마지막 유효한 DB 버전 확인
- 데이터 손상 원인 분석 (스크립트 버그 or 입력 오류)
- 수정 + 테스트 후 재추진

**Scenario 4: 에이전트 간 충돌 해결 지연 (> 24시간)**

**감지**:
- 충돌 보고 후 24시간 이상 미해결 또는
- 스스로 해결하려다 상황 악화

**즉시 조치** (24시간 이후):
1. 모든 관련 에이전트 작업 **일시 중단**
2. 사용자가 **최종 판단** 및 **명시적 지시**
3. 지시된 에이전트만 진행

**복구 절차**:
- 사용자: 설계 문서 + 코드 검토
- 최종 결정: (a) 롤백 (b) 수정 (c) 설계 재검토
- 결정 후 한 에이전트만 진행, 다른 쪽은 대기

**Scenario 5: 성능 저하 (누적)**

**감지**:
- 배포 후 사용자 성능 리포트 or
- Core Web Vitals 악화 (LCP > 2.5s)

**즉시 조치** (4시간 내):
1. ui-deploy-engineer에게 **원인 분석** 지시
2. 원인이 명확하면 **수정 + 재배포**
3. 원인이 불명확하면 **마지막 성공 배포로 롤백**

**복구 절차**:
- 성능 프로파일링 (DevTools, Vercel Analytics)
- 병목 지점 파악 (번들 크기 vs 렌더링 vs 네트워크)
- 최적화 후 재배포

### 5.2 중단 권한

| 상황 | 중단 권한 | 절차 |
|------|---------|------|
| 라이브 사이트 다운 | 사용자 (즉시) | Slack 메시지 1줄 + git revert |
| 벤치마크 회귀 | 사용자 또는 saju-expert | benchmark 재확인 후 confirm |
| DB 손상 | 사용자 (즉시) | git checkout + 원인 조사 |
| 충돌 > 24시간 | 사용자 (즉시) | 최종 판단 + 지시 |
| 성능 저하 > 임계값 | ui-deploy-engineer (사유 제시) | 롤백 + 분석 |

### 5.3 자동 중단 조건 (회로 차단기)

```javascript
// .claude/automation/circuit-breaker.js 스타일 의사코드

const thresholds = {
  benchmarkFailure: true,           // 첫 실패에 즉시 중단
  deployFailure: 3,                 // 3회 연속 실패
  bugReportPerMonth: 3,             // 월 3건 초과
  conflictResolutionHours: 24,      // 24시간 이상 미해결
  performanceDegradation: 0.1,      // 10% 이상 저하
};

// 중단 신호 수신 시
if (benchmarkFails || deployFailsThreshold || bugSpike || conflictTimeout || perfDegradation) {
  pauseAllAgents();
  notifyUser("🚨 자동 중단 활성화. 원인: " + reason);
  logIncident({ timestamp, reason, affectedAgents, status: "paused" });
}
```

### 5.4 사용자 수동 중단 방법

**방법 1: GitHub CLI (권장)**
```bash
# 모든 에이전트 작업 중단
gh workflow disable daily-check.yml weekly-sync.yml monthly-eval.yml

# 긴급: 즉시 모든 자동화 비활성화
cd .github/workflows && for f in *.yml; do gh workflow disable "$f"; done
```

**방법 2: 코드 수정**
```bash
# .claude/settings.json의 hooks 비활성화
edit .claude/settings.json  # PreToolUse/PostToolUse 주석 처리 또는 삭제
git add .claude/settings.json
git commit -m "긴급: 자동화 비활성화"
git push origin main
```

**방법 3: Vercel 콘솔**
- Vercel 대시보드 → Environment Variables → `AUTOMATION_DISABLED=true` 설정
- 이미 실행 중인 함수는 완료되고, 다음 트리거부터 실행 안 됨

### 5.5 중단 후 복구 절차

**Step 1: 원인 분석** (30분)
- 에이전트에게 문제 상황 설명 요청
- 로그 검토 (git log, benchmark report, Vercel CI 로그)
- 근본 원인 파악

**Step 2: 수정** (상황별)
- 코드 버그: 수정 + 로컬 테스트
- 설정 오류: 설정 갱신 + 재검증
- 외부 의존성: API 상태 확인, 재시도 정책 검토

**Step 3: 검증** (15분)
- 관련 테스트/benchmark 실행
- 로컬 환경에서 재현 불가능 확인

**Step 4: 재개** (5분)
```bash
# 자동화 재개
gh workflow enable daily-check.yml weekly-sync.yml monthly-eval.yml

# 또는 settings.json 훅 재활성화
edit .claude/settings.json  # 주석 제거
git add .claude/settings.json
git commit -m "자동화 복구 (원인: [설명])"
git push origin main
```

**Step 5: 모니터링** (1시간)
- 첫 번째 자동 작업 실행 확인
- 추가 오류 없는지 확인
- 대시보드 상태 녹색 확인

---

## 6. 구현 로드맵

### Phase 1: 기반 구축 (1주)
- [ ] GitHub Actions 워크플로우 생성 (.github/workflows/*.yml)
- [ ] 대시보드 스크립트 작성 (.github/scripts/update-dashboard.js)
- [ ] circuit-breaker.js 구현
- [ ] 이 문서 (DELEGATION-70percent.md) 확정

### Phase 2: 자동화 활성화 (2주)
- [ ] 일일 자동화 작업 활성화 (benchmark, db-check, deploy-monitor)
- [ ] 주간 자동화 활성화 (weekly report, sync meeting template)
- [ ] 에이전트에게 AGENT-OPERATIONS.md 브리핑
- [ ] 실제 운영으로 전환 (테스트 모드 → 프로덕션)

### Phase 3: 모니터링 & 튜닝 (3주)
- [ ] 대시보드 일일 모니터링 (사용자)
- [ ] 에이전트 피드백 수집 (주간 회의)
- [ ] 자동화 워크플로우 튜닝 (에러율 < 5%)
- [ ] 긴급 중단 프로토콜 테스트 (mock scenario)

### Phase 4: 검증 & 확대 (2주)
- [ ] 70% 위임율 달성 여부 확인
- [ ] 성과 지표 분석 (배포 안정성, 버그율, 협업 효율)
- [ ] 30% 인간 판단 작업이 정상 처리되는지 확인
- [ ] 문서화 및 최종 승인

---

## 7. 최종 체크리스트

### 7.1 위임 준비 완료 확인

```
✅ 기술
  ☐ 자동화 스크립트/워크플로우 검증 (로컬 3회)
  ☐ 에이전트 정의 문서 최신화
  ☐ 에러 처리 + 롤백 절차 명문화
  ☐ 대시보드 연결 확인

✅ 프로세스
  ☐ AGENT-OPERATIONS.md 숙지
  ☐ 성과 평가 기준 이해
  ☐ 주간 회의 일정 고정
  ☐ 긴급 중단 프로토콜 숙지

✅ 리스크
  ☐ 실패 시 영향도 평가
  ☐ 자동 롤백 불가능 작업 식별
  ☐ 임계값 설정 (circuit breaker)
  ☐ 에이전트 역할 오버래핑 없음

✅ 커뮤니케이션
  ☐ 에이전트에게 DELEGATION-70percent.md 공유
  ☐ 모니터링 대시보드 접근 권한 부여
  ☐ 주간 회의 알림 설정
  ☐ 긴급 중단 연락처 확인

☐ 최종 승인 (사용자)
  → 모든 체크박스 확인 후, "70% 위임 시작" 승인
```

### 7.2 운영 개선 루프

**매주 검토**:
- 대시보드 상태 (모든 지표 녹색?)
- 에이전트 보고사항 (예상치 못한 이슈?)
- 우선도 정렬 (다음주 계획 명확?)

**매월 검토**:
- 성과 지표 (70% 달성 여부?)
- 에이전트 만족도 (작업량 적절?)
- 자동화 효율성 (수정 필요한 부분?)

**매분기 검토**:
- 70% 위임 목표 달성 여부
- 30% 인간 판단 작업의 품질
- 다음 분기 개선 계획

---

## 부록: 용어 정의

| 용어 | 정의 |
|------|------|
| **자동화** | 스크립트/워크플로우로 반복 실행되는 작업 |
| **에이전트 위임** | Claude 에이전트가 자동으로 처리하는 작업 |
| **수동 승인** | 사용자가 검토 후 yes/no하는 과정 |
| **Circuit Breaker** | 임계값 도달 시 자동 중단하는 안전장치 |
| **Rollback** | 최후 안전한 상태로 되돌리기 |
| **Benchmark** | 성능/정확도 기준점 (saju-test 스킬) |

---

**최종 승인**: [대기 중]  
**적용 시작**: [사용자 승인 후]  
**문서 갱신 주기**: 분기별 (Q1/Q2/Q3/Q4 시작)
