---
name: db-query
description: 사찰 DB 자연어 질의 — 사용자가 "중복 보여줘", "좌표 없는 사찰", "비사찰 리스트", "OO사 찾아줘", "id로 조회" 등 사찰 데이터에 대해 자연어로 물으면 반드시 이 스킬을 사용해 scripts/db-query.js로 번역·실행하세요. DB v2 정리 작업(중복 제거, 좌표 보완, 비사찰 정리) 중의 모든 데이터 조회가 대상입니다. 6.4MB DB 파일을 직접 grep하지 마세요.
---

# 사찰 DB 자연어 질의 (db-query)

자연어 요청을 `scripts/db-query.js` 호출로 번역해 실행한다. DB 파일(6.4MB)을 직접 읽거나 grep하는 것보다 빠르고 정확하다.

## 자연어 → 명령 번역표

| 사용자가 말하면 | 실행 |
|---|---|
| "id 중복 보여줘 / 중복 그룹" | `node scripts/db-query.js duplicates --limit 20` |
| "좌표 없는 사찰은?" | `node scripts/db-query.js no-coords` |
| "서울에서 좌표 없는 곳" | `node scripts/db-query.js no-coords --sido 서울` |
| "비사찰 의심 리스트" | `node scripts/db-query.js non-temple` |
| "관음사 찾아줘" | `node scripts/db-query.js find --name 관음사` |
| "조계종 verified 사찰" | `node scripts/db-query.js find --sect 조계 --verified` |
| "이 id 전체 레코드" | `node scripts/db-query.js get <id>` |
| "~는 몇 건?" | 해당 명령 + `--count` |

공통 옵션: `--limit N`(기본 30) · `--json`(가공용) · `--full`(duplicates에서 주소 표시)

## 결과 해석 시 주의

- **기준선(2026-08-29)**: 중복 그룹 1,409개 = 잉여 레코드 3,484건, 좌표 미확보 4,175건, 비사찰 의심 237건.
- **비사찰 의심 목록에는 오탐이 있다**: `회사(?!불)` 패턴은 "회사" 뒤의 불만 검사하므로 실제 사찰인 **불회사(佛會寺, 나주)** 가 잘못 걸린다. 이 패턴은 매칭 엔진(matching-engine.js)이 그대로 쓰므로 불회사가 매칭 대상에서도 제외되고 있다 — 정리 작업 시 목록을 기계적으로 삭제하지 말고 반드시 육안 검토할 것. 패턴 수정은 saju-expert 영역(엔진 변경 + saju-test 검증 필요).
- 대량 삭제·수정 전에는 `db-quality-check.js`로 전후 지표를 남기고, saju-test로 매칭 영향 확인.

## 승격 기준 (팁 21)

반복 쿼리 패턴이 이 스크립트로 감당 안 될 만큼 늘어나면(조인·집계가 매번 새로 필요) 그때 MCP 서버로 승격을 검토한다. 그 전에는 서브커맨드 추가로 대응.
