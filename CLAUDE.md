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
