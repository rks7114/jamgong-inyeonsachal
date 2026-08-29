# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

잼공인연사찰 (jamgong.kr / jamgong-inyeonsachal.vercel.app) — a Korean Buddhist temple-matching service. It analyzes a user's birth date/time (사주팔자, 오행) and recommends temples from a government DB of 1,905 traditional temples, plus 사주 reading, 궁합 (couple compatibility), 꿈해몽 (dream interpretation), 택일 (date selection), and a chatbot. All UI text, data, and commit messages are in Korean.

## Commands

```bash
npm install
npm run dev      # Vite dev server (frontend only — /api/* serverless functions do NOT run under Vite)
npm run build    # vite build → dist/
npm run preview  # serve the built dist/
```

There are no tests and no linter. There is no vite.config — Vite uses root `index.html` as the entry, which loads `/src/main.js`.

## Deployment model (important — read before assuming anything)

Vercel does **not** build this repo: `vercel.json` sets `buildCommand: "echo skip"` and serves the **committed `dist/` directory** as-is, plus `api/*.js` as serverless functions. Consequences:

- Changes to `index.html` / `src/main.js` / `src/style.css` only reach production if you run `npm run build` and commit the resulting `dist/` output.
- Changes to `api/*.js` deploy directly (functions are read from source, not dist).
- `.deploy` contains the word "trigger" — it is touched/committed solely to force a Vercel redeploy.
- MP3 audio is streamed in production from `https://raw.githubusercontent.com/rks7114/jamgong-inyeonsachal/main/src/audio/` — files on the **main branch** are live assets; renaming or deleting them breaks the live site.
- Function timeout overrides (`maxDuration`) live in `vercel.json`; add an entry there for any new long-running function.
- Secrets are Vercel env vars: `ANTHROPIC_API_KEY` (chatbot, dream, taekil, saju-explain) and `KAKAO_REST_API_KEY` (geocode, temple-search).

## Architecture

**Frontend** — a single-page vanilla-JS app, no framework:
- `index.html` — shell with inline visual-effect scripts (background orbs, mist, sakura petals, PC header nav) and an `#app` container.
- `src/main.js` (~11,000 lines) — the entire app. Every screen (매칭 폼, 나침반 결과, 사주, 궁합, 꿈해몽, 사찰 상세, 챗봇 등) is rendered as template strings into `#app`; navigation is function calls, not a router. Calls the `/api/*` endpoints for anything involving the full temple DB or AI.
- `src/temple-slim.js` — slim temple list (`{n, s, g}` name/시도/군구) bundled into the client for autocomplete search.
- `src/style.css` — global styles.

**Backend** — Vercel serverless functions in `api/` (CommonJS):
- `match.js` / `match-couple.js` — temple matching; both `require("../src/matching-engine.js")` and `../src/temple-db.full.js`. Also fetch current weather per temple from Open-Meteo.
- `saju.js` — 사주팔자/대운/삼재; lunar↔solar conversion via the KASI (한국천문연구원) public API with `lunar-javascript` as fallback.
- `saju-explain.js`, `dream.js`, `taekil.js`, `chatbot.js` — Anthropic API-backed interpretation/chat endpoints.
- `geocode.js`, `temple-search.js` — Kakao REST API proxies.
- `temple-list.js` — serves temple data to the client.

**Matching engine** (`src/matching-engine.js`, CommonJS, shared by the API functions): birth date/time → 8-character 사주 → 오행 (목·화·토·금·수) distribution → weak element (용신) → prayer-purpose element mapping → scores temples on element fit, distance/bearing, verified history, and a +15 bonus for 조계종 head temples; returns top 3 with reasons. Design doc: `jamgong-inyeonsachal/오행매칭로직_설계.md`. Tone rule from the design doc: no absolute claims — results are always phrased as "참고용 추정치".

**Temple DB** (`src/temple-db.full.js`, ~7 MB): 1,905 temples from 행정안전부 public data. 1,494 have coordinates (EPSG:2097 → WGS84 converted); entries without coordinates are auto-excluded from matching. `verified: true` marks the ~1,500 with documented history and boosts their score.

**Content page fragments** (`src/page-*.html`): standalone HTML fragments (styles + markup + inline scripts, no doctype) for the jamgong.kr content pages (home, 순례, 음악, 만세력, 택일 등). Files named `page-X-partN.html` / `page-X-jsN.html` are continuation chunks of the same page, split for size. Assembled copies are committed as `dist/page-*.html`, but **the assembly step is not in this repo** — recent commits edit only the `src/` fragments. When changing a page, edit the `src/` fragment; don't assume editing `dist/page-*.html` alone is the workflow, and don't expect the root Vite build to pick fragments up (nothing in `src/main.js` references them).

## Traps

- `jamgong-inyeonsachal/` (nested directory) is a stale snapshot of the earlier MVP — do not edit it; only its `오행매칭로직_설계.md` design doc is still a useful reference.
- Root-level `main.js` and `matching-engine.js` are older superseded copies of the `src/` versions.
- `dist/` is committed and contains many stale hashed bundles (plus a nested `dist/dist/`); the live entry is whatever `dist/index.html` currently references.
- Membership gating is a plain string check in `src/main.js` (`MEMBER_CODE`), stored in localStorage — it is an access code for YouTube channel members, not a payment system.

## 팁 21: MCP vs API 선택 기준

### 전제
MCP = Claude(개발 도구) 접근 프로토콜
API = 서비스 사용자(브라우저) 접근 경로
→ 프로덕션 기능은 무조건 API/클라이언트
→ MCP는 "개발 보조" 도구로만 의미 있음

### 선택 기준표
| 기준 | 클라이언트 직접 구현 | API 엔드포인트 | MCP 서버(개발 보조) |
|------|---------|------|-----|
| 복잡도 | 낮음 (현 구조) | 중간 (함수 추가) | 높음 (별도 서버) |
| 유지보수 | main.js 집중 | api/ 파일 분리 | 관리 대상 추가 |
| 비용 | 0 (정적 서빙) | 함수 호출 과금 | 호스팅 비용 |
| 성능 | 최고 (네트워크 0) | 왕복 지연 있음 | 사용자 성능 무관 |
| 보안 | 공개 데이터만 | API 키 은닉 가능 | 자체 인증 필요 |

### 워크트리 1: 검색 성능 재정의
선택: 직접 구현 + 기존 API 보조 (MCP 불필요)

현실:
- 검색은 사용자 대면 기능 (왕복 지연 치명적)
- /api/temple-list 3.65MB 전체 전송 = 진짜 병목

해결책:
- 슬림 API 분리 (name/address/id만)
- 초기 로딩 최적화
- history 전문 검색만 서버로

### 워크트리 2: 사찰 DB v2
선택: 직접 구현 유지, MCP는 개발 보조만 (선택적)

상황:
- 17,497건 = 외부 DB 도입 불필요 (콜드스타트 0 비용)
- 복잡도·비용·지연만 증가

실제 과제:
- 데이터 품질 (id 중복 3,484건, 좌표 미확보)
- 파일 분리 (6.4MB → 검색용/상세용)

MCP 활용:
- 선택적: 반복 쿼리 도구 (필수 아님)
- 순서: 스크립트로 시작 → 쿼리 증가 시 MCP 승격

### 한 줄 요약
사용자가 부르는 기능 = API/클라이언트
Claude가 부르는 도구 = MCP
→ 이 프로젝트는 MCP 프로덕션 코드 없음, DB 정제 개발 편의만
