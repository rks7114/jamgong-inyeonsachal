# 오행 매칭 성능 테스트

`src/matching-engine.js`의 matchTemples / matchCoupleTemples 성능·회귀 테스트.

## 기능

- **테스트 케이스 자동 생성**: 결정적 시드로 matchTemples 10개, matchCoupleTemples 5개
- **성능 실측**: 목표 matchTemples 11.7ms 이하, matchCoupleTemples 16.6ms 이하 (9라운드 최속값 기준, 기본 +10% 허용 오차)
- **결과 검증**: 이전 커밋(`git show <ref>:src/matching-engine.js`)과 추천 사찰 id 목록 동일성 확인
- **벤치마크 리포트**: 마크다운 표 출력, 전부 통과 시 종료 코드 0

## 실행

레포 루트에서:

```bash
node .claude/skills/saju-test/scripts/benchmark.js              # HEAD와 비교 + 벤치마크
node .claude/skills/saju-test/scripts/benchmark.js --ref main   # 기준 커밋 지정
node .claude/skills/saju-test/scripts/benchmark.js --no-compare # 벤치마크만
```

옵션: `--target-single <ms>` `--target-couple <ms>` `--tolerance <비율>` (기본 0.10, 엄격 모드는 0)

## 해석 기준

- 성능만 바꿨는데 결과 불일치 → 회귀, 커밋 금지. 스코어링을 의도적으로 바꿨다면 불일치가 정상.
- 목표치는 최적화 당시(2026-08) 이 환경의 실측값. 다른 머신에서는 절대값보다 `--ref` 상대 비교가 중요.

상세 지침: `.claude/skills/saju-test/SKILL.md` (Claude Code가 스킬로 자동 로드하는 버전)
