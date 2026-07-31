#!/usr/bin/env node
/**
 * clean-temple-db.js — 사찰 DB 결함 정리
 *
 * 확인된 결함만 고친다. 판단이 필요한 것은 손대지 않고 보고만 한다.
 * 없는 것을 추정으로 메우지 않는다는 원칙(전자책 제22장 4절)을 그대로 적용한다.
 *
 *   ① 주소 접두어 '전남광주통합특별시' → '전남'
 *      1,424건. 일괄 치환이 잘못 들어간 흔적이며, 뒤따르는 시군구는 전부 전남이다.
 *   ② sido '광주' → '전남'
 *      sido=광주 1,082건 중 실제 광주광역시(동·서·남·북·광산구)는 0건이었다.
 *      전부 ①의 주소를 가진 전남 소재다.
 *
 * 인코딩이 깨진 글자(U+FFFD)는 원본이 무엇이었는지 알 수 없으므로 복원하지 않는다.
 * ①에 걸려 함께 해소되는 것만 사라지고, 나머지는 개수를 보고한다.
 *
 *   node scripts/clean-temple-db.js              # 미리보기 (기본)
 *   node scripts/clean-temple-db.js --write      # 실제 반영
 */
"use strict";

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "src", "temple-db.full.js");
const WRITE = process.argv.includes("--write");

/**
 * 주소 첫 어절(시도명)을 어떻게 고칠지 판정한다.
 *
 * 깨진 글자는 1:1로 치환되지 않고 늘어나며 접두어의 앞·중간·끝 어디에나
 * 나타난다. 그래서 글자 자리를 고정하지 않고 첫 어절을 통째로 본다.
 *
 * 주의 — '전북특별자치도'는 2024년부터 쓰는 정식 명칭이다(729건).
 * 잘못된 이름이 아니므로 고치지 않는다. 글자가 깨진 것만 복원한다.
 *
 * 반환: { token, fixed } 또는 null(손대지 않음)
 */
function sidoFix(addr) {
  const token = String(addr).split(/\s+/)[0] || "";
  if (!token || !/\uFFFD|통합특별시/.test(token)) return null; // 깨짐도 오염도 없으면 통과

  // ① '전남광주통합특별시' 계열 — 일괄 치환이 잘못 들어간 흔적. 뒤 시군구는 전부 전남이다.
  if (/^[전\uFFFD][남\uFFFD]/.test(token) && /광주|통합/.test(token.replace(/\uFFFD/g, ""))) {
    return { token, fixed: "전남" };
  }
  if (/통합특별시$|통합특별\uFFFD+$|통합특\uFFFD+시$/.test(token)) {
    return { token, fixed: "전남" };
  }

  // ② 정식 명칭인데 글자만 깨진 경우 — 이름을 바꾸지 않고 복원만 한다.
  const RESTORE = ["전북특별자치도", "강원특별자치도", "제주특별자치도",
                   "서울특별시", "부산광역시", "대구광역시", "인천광역시",
                   "광주광역시", "대전광역시", "울산광역시", "세종특별자치시",
                   "경기도", "충북", "충남", "전북", "전남", "경북", "경남", "강원"];
  for (const name of RESTORE) {
    // 깨진 글자 하나가 여러 개의 U+FFFD로 늘어나므로 자리마다 \uFFFD+ 를 허용한다.
    const re = new RegExp("^" + [...name].map((c) => `(?:${c}|\\uFFFD+)`).join("") + "$");
    if (re.test(token)) return { token, fixed: name };
  }

  return null; // 판단 불가 — 보고만 한다
}

const GWANGJU_GU = new Set(["동구", "서구", "남구", "북구", "광산구"]);

function main() {
  const db = require(DB_PATH);
  const stat = { total: db.length, addr: 0, sido: 0, skipped: [], mojibakeAfter: 0, unresolved: 0, byFix: {} };

  for (const t of db) {
    const fix = typeof t.address === "string" ? sidoFix(t.address) : null;
    const hadBadAddr = fix !== null && fix.fixed === "전남";

    if (fix) {
      t.address = (fix.fixed + " " + t.address.slice(fix.token.length)).replace(/\s+/g, " ").trim();
      stat.addr++;
      stat.byFix[fix.fixed] = (stat.byFix[fix.fixed] || 0) + 1;
    } else if (typeof t.address === "string" && t.address.includes("\uFFFD")) {
      stat.unresolved++;
    }

    if (t.sido === "광주") {
      if (hadBadAddr) {
        t.sido = "전남";
        stat.sido++;
      } else if (GWANGJU_GU.has(t.gugun)) {
        // 실제 광주광역시 — 건드리지 않는다
      } else {
        stat.skipped.push(`${t.name} (gugun=${t.gugun}) ${t.address || ""}`);
      }
    }
  }

  stat.mojibakeAfter = db.filter((t) => JSON.stringify(t).includes("�")).length;

  console.log(`레코드            ${stat.total.toLocaleString()}`);
  console.log(`주소 시도명 교정   ${stat.addr.toLocaleString()}`);
  for (const [k, v] of Object.entries(stat.byFix)) console.log(`    → ${k}  ${v.toLocaleString()}`);
  console.log(`sido 광주→전남     ${stat.sido.toLocaleString()}`);
  console.log(`남은 깨진 문자     ${stat.mojibakeAfter.toLocaleString()}  (원본 불명 — 복원하지 않음)`);
  if (stat.skipped.length) {
    console.log(`\n판단 보류 ${stat.skipped.length}건 — 사람이 확인해야 합니다:`);
    stat.skipped.slice(0, 10).forEach((s) => console.log("  " + s));
  }

  if (!WRITE) {
    console.log("\n[미리보기] 반영하려면 --write");
    return;
  }

  const header =
    "// src/temple-db.full.js — 전국 사찰 명단 (문화재청 + 카카오 좌표)\n" +
    `// 전체 ${db.length}건 | sido·gugun·purposes·history 포함\n` +
    "// scripts/clean-temple-db.js로 주소·시도 정리됨\n" +
    "module.exports = \n";
  fs.writeFileSync(DB_PATH, header + JSON.stringify(db, null, 2) + ";\n", "utf8");
  console.log(`\n[ok] ${DB_PATH} 갱신`);
}

main();
