#!/usr/bin/env node
// 오행 매칭 성능 테스트 — matchTemples/matchCoupleTemples 벤치마크 + 이전 커밋과 결과 동일성 검증
//
// 사용법 (레포 루트에서):
//   node .claude/skills/saju-test/scripts/benchmark.js                # HEAD 엔진과 비교
//   node .claude/skills/saju-test/scripts/benchmark.js --ref HEAD~1   # 특정 커밋과 비교
//   node .claude/skills/saju-test/scripts/benchmark.js --no-compare   # 벤치마크만 (동일성 검증 생략)
//   --target-single 11.7 --target-couple 16.6                         # 목표치 재정의(ms)
//
// 종료 코드: 0 = 전부 통과, 1 = 성능 목표 미달 또는 결과 불일치

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "../../../..");
const args = process.argv.slice(2);
function argVal(name, def) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
}
const REF = argVal("--ref", "HEAD");
const COMPARE = !args.includes("--no-compare");
const TARGET_SINGLE = parseFloat(argVal("--target-single", "11.7"));
const TARGET_COUPLE = parseFloat(argVal("--target-couple", "16.6"));
// 목표치는 최적화 당시 실측값이라 여유가 없다. 허용 오차 없이는 측정 노이즈만으로
// 판정이 뒤집히므로, 기본 10% 여유를 두고 판정한다 (--tolerance 0 으로 엄격 모드 가능)
const TOLERANCE = parseFloat(argVal("--tolerance", "0.10"));
const LIMIT_SINGLE = TARGET_SINGLE * (1 + TOLERANCE);
const LIMIT_COUPLE = TARGET_COUPLE * (1 + TOLERANCE);

const engine = require(path.join(REPO_ROOT, "src/matching-engine.js"));
const db = require(path.join(REPO_ROOT, "src/temple-db.full.js"));

// ── 테스트 케이스 자동 생성 (결정적 — 매 실행 동일) ────────────────────
const PURPOSES = ["재물운", "건강운", "학업운", "인연운", "가정운", "수험합격", "취업운", "출산기도"];
const singleCases = [];
for (let i = 0; i < 10; i++) {
  singleCases.push({
    birthInput: { calendarType: "solar", year: 1960 + i * 4, month: (i % 12) + 1, day: (i * 3 % 28) + 1, hour: (i * 5) % 24, minute: (i * 7) % 60 },
    purpose: PURPOSES[i % 8],
    userLat: 37.5665, userLng: 126.978,
  });
}
const coupleCases = [];
for (let i = 0; i < 5; i++) {
  coupleCases.push({
    birthInputA: { year: 1985 + i, month: (i % 12) + 1, day: 5 + i, hour: 9 },
    birthInputB: { year: 1990 + i, month: 12 - (i % 12), day: 20 - i, hour: 14 },
    purpose: PURPOSES[i % 8],
    userLat: 35.1796, userLng: 129.0756,
  });
}

// ── 결과 검증: 지정 커밋의 엔진과 id 목록 비교 ─────────────────────────
// 임시 파일을 스킬 폴더 안에 두면 node가 레포 루트 node_modules를 그대로 찾는다
function loadBaselineEngine(ref) {
  const tmp = path.join(__dirname, `.baseline-${Date.now()}.tmp.js`);
  const src = execSync(`git show ${ref}:src/matching-engine.js`, { cwd: REPO_ROOT, maxBuffer: 32 * 1024 * 1024 });
  fs.writeFileSync(tmp, src);
  try {
    return { engine: require(tmp), cleanup: () => fs.unlinkSync(tmp) };
  } catch (e) {
    fs.unlinkSync(tmp);
    throw e;
  }
}

function idsOf(out) {
  return out.results.map((r) => r.temple.id + ":" + r.score);
}

let equivalence = null;
if (COMPARE) {
  const { engine: base, cleanup } = loadBaselineEngine(REF);
  try {
    const singleDiffs = [];
    singleCases.forEach((c, i) => {
      const a = idsOf(base.matchTemples(c, db));
      const b = idsOf(engine.matchTemples(c, db));
      if (JSON.stringify(a) !== JSON.stringify(b)) singleDiffs.push({ case: i, baseline: a, current: b });
    });
    const coupleDiffs = [];
    coupleCases.forEach((c, i) => {
      const a = idsOf(base.matchCoupleTemples(c, db));
      const b = idsOf(engine.matchCoupleTemples(c, db));
      if (JSON.stringify(a) !== JSON.stringify(b)) coupleDiffs.push({ case: i, baseline: a, current: b });
    });
    equivalence = { ref: REF, singleDiffs, coupleDiffs };
  } finally {
    cleanup();
  }
}

// ── 성능 실측 ──────────────────────────────────────────────────────────
// 공유 컨테이너/노트북에서는 벽시계 시간 편차가 크다. 라운드별 평균을 여러 번 재서
// 최솟값(노이즈가 가장 적게 섞인 라운드)을 판정 기준으로, 중앙값을 참고치로 쓴다.
function bench(fn, cases, rounds) {
  cases.forEach((c) => fn(c, db)); // 워밍업 (JIT + 캐시)
  cases.forEach((c) => fn(c, db));
  const perRound = [];
  for (let r = 0; r < rounds; r++) {
    const t0 = process.hrtime.bigint();
    cases.forEach((c) => fn(c, db));
    perRound.push(Number(process.hrtime.bigint() - t0) / 1e6 / cases.length);
  }
  perRound.sort((a, b) => a - b);
  return { min: perRound[0], median: perRound[Math.floor(perRound.length / 2)] };
}
const msSingle = bench(engine.matchTemples, singleCases, 9);
const msCouple = bench(engine.matchCoupleTemples, coupleCases, 9);

// ── 리포트 ─────────────────────────────────────────────────────────────
const okSingle = msSingle.min <= LIMIT_SINGLE;
const okCouple = msCouple.min <= LIMIT_COUPLE;
const okEquiv = !equivalence || (equivalence.singleDiffs.length === 0 && equivalence.coupleDiffs.length === 0);

console.log("# 오행 매칭 성능 테스트 리포트");
console.log(`실행: ${new Date().toISOString()} · DB ${db.length.toLocaleString()}건 · node ${process.version}`);
console.log("");
console.log("| 항목 | 최속 라운드 | 중앙값 | 목표 | 판정 |");
console.log("|---|---|---|---|---|");
const tolNote = TOLERANCE > 0 ? ` (+${Math.round(TOLERANCE * 100)}% 허용)` : "";
console.log(`| matchTemples (10케이스 × 9라운드) | ${msSingle.min.toFixed(2)}ms | ${msSingle.median.toFixed(2)}ms | ${TARGET_SINGLE}ms${tolNote} → ${LIMIT_SINGLE.toFixed(2)}ms 이하 | ${okSingle ? "✅ 통과" : "❌ 미달"} |`);
console.log(`| matchCoupleTemples (5케이스 × 9라운드) | ${msCouple.min.toFixed(2)}ms | ${msCouple.median.toFixed(2)}ms | ${TARGET_COUPLE}ms${tolNote} → ${LIMIT_COUPLE.toFixed(2)}ms 이하 | ${okCouple ? "✅ 통과" : "❌ 미달"} |`);
if (equivalence) {
  const n = equivalence.singleDiffs.length + equivalence.coupleDiffs.length;
  console.log(`| 결과 동일성 (${equivalence.ref} 대비, id:score) | 불일치 ${n}건 | 0건 | ${okEquiv ? "✅ 동일" : "⚠️ 불일치"} |`);
}
if (!okEquiv) {
  console.log("\n## 불일치 상세");
  console.log("의도한 로직 변경이면 정상입니다. 성능만 바꿨는데 불일치가 나오면 회귀입니다.");
  [...equivalence.singleDiffs.map((d) => ({ ...d, kind: "단일" })), ...equivalence.coupleDiffs.map((d) => ({ ...d, kind: "궁합" }))].forEach((d) => {
    console.log(`- ${d.kind} 케이스 #${d.case}: 기준 [${d.baseline.join(", ")}] → 현재 [${d.current.join(", ")}]`);
  });
}
console.log("");
console.log(okSingle && okCouple && okEquiv ? "전체 판정: ✅ 통과" : "전체 판정: ❌ 실패");
process.exit(okSingle && okCouple && okEquiv ? 0 : 1);
