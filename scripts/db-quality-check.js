#!/usr/bin/env node
// scripts/db-quality-check.js — 사찰 DB v2 데이터 품질 검증 (주간 정기 실행용)
//
// 사용법: node scripts/db-quality-check.js [--json]
// 출력: 마크다운 리포트 (--json이면 핵심 지표 JSON — 주차별 추이 비교용)
//
// DB v2 목표 지표 (0이 되면 해당 항목 완료):
//   duplicateIdRecords  id 중복 레코드 수 (기준선 3,484)
//   noCoordRecords      좌표 미확보 레코드 수 (기준선 4,175)
//   nonTempleHits       비사찰 의심 항목 수 (NON_TEMPLE_PATTERN 매칭)

const path = require("path");
const db = require(path.join(__dirname, "../src/temple-db.full.js"));

// matching-engine.js와 동일한 패턴 — 엔진이 이름으로 걸러내는 비사찰 항목
const NON_TEMPLE_PATTERN = /용품|상회|마트|주유소|굿당|무속|철물|식당|카페|홈쇼핑|불교마트|불교서적|장례|요양병원|수녀원|찐빵|음식체험|음식연구|음식문화원|음식협회|일관도|주점|편의점|농협(?!사)|슈퍼|마켓|주차|게스트하우스|펜션|호텔|모텔|민박|캠핑|공장|회사(?!불)|재단(?!불|법)|아파트|치킨|횟집|국수(?!암)|김밥나라|피자|커피(?!붓다)|벌크|코리엔탈|굽네|bhc/i;

const seen = new Map();
let dupRecords = 0, noCoord = 0, noId = 0, emptyHistory = 0, nonTemple = 0, noAddress = 0;
const dupExamples = [];

for (const t of db) {
  if (t.id == null || t.id === "") noId++;
  else if (seen.has(t.id)) {
    dupRecords++;
    if (dupExamples.length < 5) dupExamples.push(`${t.id} (${seen.get(t.id)} / ${t.name})`);
  } else seen.set(t.id, t.name);

  if (t.lat == null || t.lng == null) noCoord++;
  if (!t.history) emptyHistory++;
  if (!t.address) noAddress++;
  if (t.name && NON_TEMPLE_PATTERN.test(t.name)) nonTemple++;
}

const metrics = {
  date: new Date().toISOString().slice(0, 10),
  totalRecords: db.length,
  uniqueIds: seen.size,
  duplicateIdRecords: dupRecords,
  noIdRecords: noId,
  noCoordRecords: noCoord,
  noAddressRecords: noAddress,
  emptyHistoryRecords: emptyHistory,
  nonTempleHits: nonTemple,
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(metrics, null, 2));
  process.exit(0);
}

const pct = (n) => ((n / db.length) * 100).toFixed(1) + "%";
console.log("# 사찰 DB 데이터 품질 리포트");
console.log(`검사일: ${metrics.date} · 전체 ${db.length.toLocaleString()}건 · 고유 id ${seen.size.toLocaleString()}건`);
console.log("");
console.log("| 지표 | 건수 | 비율 | DB v2 기준선 |");
console.log("|---|---|---|---|");
console.log(`| id 중복 레코드 | ${dupRecords.toLocaleString()} | ${pct(dupRecords)} | 3,484 |`);
console.log(`| 좌표 미확보 | ${noCoord.toLocaleString()} | ${pct(noCoord)} | 4,175 |`);
console.log(`| 비사찰 의심 (이름 패턴) | ${nonTemple.toLocaleString()} | ${pct(nonTemple)} | — |`);
console.log(`| id 없음 | ${noId.toLocaleString()} | ${pct(noId)} | — |`);
console.log(`| 주소 없음 | ${noAddress.toLocaleString()} | ${pct(noAddress)} | — |`);
console.log(`| 연혁 없음 | ${emptyHistory.toLocaleString()} | ${pct(emptyHistory)} | — |`);
if (dupExamples.length) {
  console.log("");
  console.log("중복 id 예시: " + dupExamples.join(", "));
}
console.log("");
console.log("주의: 중복·비사찰 항목을 삭제하기 전에 매칭 엔진 영향을 확인할 것 —");
console.log("검색 dedup(seen[t.id])과 NON_TEMPLE_PATTERN이 이 데이터 상태에 의존한다.");
console.log("정리 후에는 반드시 saju-test 벤치마크로 추천 결과 변화를 검증한다.");
