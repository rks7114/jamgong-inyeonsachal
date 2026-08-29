#!/usr/bin/env node
// scripts/db-query.js — 사찰 DB 자연어 질의용 쿼리 도구 (DB v2 정리 작업 보조)
//
// Claude가 자연어 요청을 아래 서브커맨드로 번역해 실행한다 (팁 21: 스크립트 우선, MCP는 승격 시).
//
// 사용법:
//   node scripts/db-query.js duplicates [--limit N] [--full]     id 중복 그룹 (기준선 3,484건)
//   node scripts/db-query.js no-coords [--sido 서울] [--limit N]  좌표 미확보 (기준선 4,175건)
//   node scripts/db-query.js non-temple [--limit N]              비사찰 의심 (기준선 237건)
//   node scripts/db-query.js find [--name X] [--sido X] [--gugun X] [--sect X]
//                                 [--verified] [--has-history] [--limit N]
//   node scripts/db-query.js get <id>                            id로 전체 레코드 1건
//   공통: --json (기계 판독용), --count (건수만), --limit 기본 30

const path = require("path");
const db = require(path.join(__dirname, "../src/temple-db.full.js"));

// matching-engine.js와 동일 패턴 유지 (db-quality-check.js와 공유하는 기준)
const NON_TEMPLE_PATTERN = /용품|상회|마트|주유소|굿당|무속|철물|식당|카페|홈쇼핑|불교마트|불교서적|장례|요양병원|수녀원|찐빵|음식체험|음식연구|음식문화원|음식협회|일관도|주점|편의점|농협(?!사)|슈퍼|마켓|주차|게스트하우스|펜션|호텔|모텔|민박|캠핑|공장|(?<!불)회사|재단(?!불|법)|아파트|치킨|횟집|국수(?!암)|김밥나라|피자|커피(?!붓다)|벌크|코리엔탈|굽네|bhc/i;

const args = process.argv.slice(2);
const cmd = args[0];
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i !== -1 && args[i + 1] ? args[i + 1] : d; };
const LIMIT = parseInt(val("--limit", "30"), 10);
const AS_JSON = has("--json");
const COUNT_ONLY = has("--count");

function line(t, extra) {
  const coord = t.lat != null ? "📍" : "⛔좌표없음";
  return `${t.id || "(id없음)"} | ${t.name} | ${(t.address || "").slice(0, 40)} | ${coord}${extra ? " | " + extra : ""}`;
}

function output(rows, describe) {
  if (COUNT_ONLY) { console.log(rows.length); return; }
  if (AS_JSON) { console.log(JSON.stringify(rows.slice(0, LIMIT), null, 1)); return; }
  console.log(`# ${describe} — 총 ${rows.length.toLocaleString()}건${rows.length > LIMIT ? ` (상위 ${LIMIT}건 표시, --limit로 조정)` : ""}`);
  rows.slice(0, LIMIT).forEach((r) => console.log(typeof r === "string" ? r : line(r)));
}

switch (cmd) {
  case "duplicates": {
    const byId = new Map();
    for (const t of db) {
      if (t.id == null) continue;
      if (!byId.has(t.id)) byId.set(t.id, []);
      byId.get(t.id).push(t);
    }
    const groups = [...byId.entries()].filter(([, v]) => v.length > 1)
      .sort((a, b) => b[1].length - a[1].length);
    const dupRecordCount = groups.reduce((s, [, v]) => s + v.length - 1, 0);
    if (COUNT_ONLY) { console.log(dupRecordCount); break; }
    if (AS_JSON) {
      console.log(JSON.stringify(groups.slice(0, LIMIT).map(([id, v]) => ({ id, count: v.length, names: v.map(t => t.name), addresses: v.map(t => t.address) })), null, 1));
      break;
    }
    console.log(`# id 중복 — 중복 그룹 ${groups.length.toLocaleString()}개, 잉여 레코드 ${dupRecordCount.toLocaleString()}건${groups.length > LIMIT ? ` (상위 ${LIMIT}그룹 표시)` : ""}`);
    for (const [id, v] of groups.slice(0, LIMIT)) {
      console.log(`${id} ×${v.length}: ${v.map(t => `${t.name}${has("--full") ? `(${t.address})` : ""}`).join(" / ")}`);
    }
    break;
  }
  case "no-coords": {
    let rows = db.filter((t) => t.lat == null || t.lng == null);
    const sido = val("--sido");
    if (sido) rows = rows.filter((t) => (t.sido || "").includes(sido) || (t.address || "").includes(sido));
    output(rows, `좌표 미확보${sido ? ` (${sido})` : ""}`);
    break;
  }
  case "non-temple": {
    const rows = db.filter((t) => t.name && NON_TEMPLE_PATTERN.test(t.name))
      .map((t) => line(t, "패턴: " + (t.name.match(NON_TEMPLE_PATTERN) || [""])[0]));
    output(rows, "비사찰 의심 (이름 패턴 매칭)");
    break;
  }
  case "find": {
    let rows = db;
    if (val("--name")) rows = rows.filter((t) => (t.name || "").includes(val("--name")));
    if (val("--sido")) rows = rows.filter((t) => (t.sido || "").includes(val("--sido")) || (t.address || "").includes(val("--sido")));
    if (val("--gugun")) rows = rows.filter((t) => (t.gugun || "").includes(val("--gugun")));
    if (val("--sect")) rows = rows.filter((t) => (t.sect || "").includes(val("--sect")));
    if (has("--verified")) rows = rows.filter((t) => t.verified);
    if (has("--has-history")) rows = rows.filter((t) => t.history);
    output(rows, "검색 결과");
    break;
  }
  case "get": {
    const id = args[1];
    const found = db.filter((t) => String(t.id) === String(id));
    if (!found.length) { console.error(`id ${id} 없음`); process.exit(1); }
    console.log(JSON.stringify(found.length === 1 ? found[0] : found, null, 2));
    if (found.length > 1) console.error(`주의: 같은 id 레코드 ${found.length}건 (중복)`);
    break;
  }
  default:
    console.log("서브커맨드: duplicates | no-coords | non-temple | find | get <id>");
    console.log("옵션: --limit N --json --count --full --sido --gugun --name --sect --verified --has-history");
    process.exit(cmd ? 1 : 0);
}
