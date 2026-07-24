// api/match-couple.js
// Vercel Serverless Function — 궁합 사찰 매칭 API

// 지연 로딩 (lazy load) — cold start 타임아웃 방지
let _matchCoupleTemples = null;
let _getEightChar = null;
let _TEMPLE_DB = null;
function loadDeps() {
  if (!_matchCoupleTemples) {
    const me = require("../src/matching-engine.js");
    _matchCoupleTemples = me.matchCoupleTemples;
    _getEightChar = me.getEightChar;
  }
  if (!_TEMPLE_DB) _TEMPLE_DB = require("../src/temple-db.full.js");
}

/* ── 합충형 사전 ── */
const CHEONGAN_HAP = [['甲','己'],['乙','庚'],['丙','辛'],['丁','壬'],['戊','癸']];
const JIJI_HAP6   = [['子','丑'],['寅','亥'],['卯','戌'],['辰','酉'],['巳','申'],['午','未']];
const JIJI_CHUNG  = [['子','午'],['丑','未'],['寅','申'],['卯','酉'],['辰','戌'],['巳','亥']];
const JIJI_SAM_HAP = [['申','子','辰'],['亥','卯','未'],['寅','午','戌'],['巳','酉','丑']];
const JIJI_SAM_HAP_NAME = ['수국(水局)','목국(木局)','화국(火局)','금국(金局)'];

const HANJA_OHAENG = {
  '木':'목','火':'화','土':'토','金':'금','水':'수',
};

function extractPillars(bazi) {
  const pairs = [
    { label:'년주(年柱)', char: bazi.getYear(),  wx: bazi.getYearWuXing()  },
    { label:'월주(月柱)', char: bazi.getMonth(), wx: bazi.getMonthWuXing() },
    { label:'일주(日柱)', char: bazi.getDay(),   wx: bazi.getDayWuXing()   },
    { label:'시주(時柱)', char: bazi.getTime(),  wx: bazi.getTimeWuXing()  },
  ];
  return pairs.map(p => ({
    label: p.label,
    stem:   p.char?.[0] || '',
    branch: p.char?.[1] || '',
    wx:     [...(p.wx||'')].map(h => HANJA_OHAENG[h]).filter(Boolean),
  }));
}

function analyzeHapChung(pillarsA, pillarsA_full, pillarsB, pillarsB_full) {
  const results = [];

  // 천간합 검사 (년·월·일·시 천간 간 비교)
  for (const pa of pillarsA) {
    for (const pb of pillarsB) {
      const pair = [pa.stem, pb.stem].sort().join('');
      for (const [s1,s2] of CHEONGAN_HAP) {
        if (pair === [s1,s2].sort().join('')) {
          results.push({ type:'천간합(天干合)', a:pa.stem, b:pb.stem, pillarA:pa.label, pillarB:pb.label, positive:true });
        }
      }
      // 천간 충 (정반대 천간): 갑경, 을신, 병임, 정계, 무갑... (간단 처리)
      const CHEONGAN_CHUNG = [['甲','庚'],['乙','辛'],['丙','壬'],['丁','癸']];
      for (const [s1,s2] of CHEONGAN_CHUNG) {
        if (pair === [s1,s2].sort().join('')) {
          results.push({ type:'천간충(天干沖)', a:pa.stem, b:pb.stem, pillarA:pa.label, pillarB:pb.label, positive:false });
        }
      }
    }
  }

  // 지지합 (6합)
  for (const pa of pillarsA) {
    for (const pb of pillarsB) {
      const pair = [pa.branch, pb.branch].sort().join('');
      for (const [b1,b2] of JIJI_HAP6) {
        if (pair === [b1,b2].sort().join('')) {
          results.push({ type:'지지육합(地支六合)', a:pa.branch, b:pb.branch, pillarA:pa.label, pillarB:pb.label, positive:true });
        }
      }
      // 지지 충
      for (const [b1,b2] of JIJI_CHUNG) {
        if (pair === [b1,b2].sort().join('')) {
          results.push({ type:'지지충(地支沖)', a:pa.branch, b:pb.branch, pillarA:pa.label, pillarB:pb.label, positive:false });
        }
      }
    }
  }

  // 삼합 검사 (두 사람 지지 합쳐서 3글자 조합)
  const allBranchesA = pillarsA.map(p=>p.branch).filter(Boolean);
  const allBranchesB = pillarsB.map(p=>p.branch).filter(Boolean);
  for (let i=0; i<JIJI_SAM_HAP.length; i++) {
    const trio = JIJI_SAM_HAP[i];
    const hasAll = trio.every(b => allBranchesA.includes(b) || allBranchesB.includes(b));
    const fromA = trio.filter(b => allBranchesA.includes(b));
    const fromB = trio.filter(b => allBranchesB.includes(b));
    if (hasAll && fromA.length > 0 && fromB.length > 0) {
      results.push({ type:`지지삼합(地支三合) ${JIJI_SAM_HAP_NAME[i]}`, a:fromA.join(''), b:fromB.join(''), pillarA:'', pillarB:'', positive:true });
    }
  }

  return results;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST 요청만 허용됩니다." });
    return;
  }

  try {
    loadDeps();
    const { birthInputA, birthInputB, purpose, userLat, userLng, memberUnlocked } = req.body;

    if (!birthInputA || !birthInputB || !purpose || userLat == null || userLng == null) {
      res.status(400).json({ error: "두 사람의 생년월일시, 기도목적, 위치 정보가 모두 필요합니다." });
      return;
    }

    // 사찰 매칭
    const result = _matchCoupleTemples(
      { birthInputA, birthInputB, purpose, userLat, userLng, memberUnlocked: !!memberUnlocked },
      _TEMPLE_DB
    );

    // 팔자 데이터 추출
    let pillarsA = [], pillarsB = [], hapChung = [];
    try {
      const baziA = _getEightChar(birthInputA);
      const baziB = _getEightChar(birthInputB);
      pillarsA = extractPillars(baziA);
      pillarsB = extractPillars(baziB);
      hapChung = analyzeHapChung(pillarsA, pillarsA, pillarsB, pillarsB);
    } catch(e) {
      console.warn('팔자 추출 오류:', e.message);
    }

    res.status(200).json({
      success: true,
      disclaimer: "본 결과는 참고용 추정치이며, 정밀 사주 감정은 잼공 오라클 정식 서비스를 이용해 주세요.",
      ...result,
      pillarsA,
      pillarsB,
      hapChung,
      genderA: birthInputA.gender || 'male',
      genderB: birthInputB.gender || 'female',
    });
  } catch (err) {
    console.error("궁합 매칭 오류:", err);
    res.status(500).json({ error: "매칭 처리 중 오류가 발생했습니다." });
  }
};
