/**
 * 잼공인연사찰 - 오행 매칭 엔진 프로토타입 v1.0
 * 클(수석실장) 작성
 *
 * 주의: 사주 오행 계산은 간략화 버전입니다.
 * 실제 서비스에서는 정확한 만세력 라이브러리(예: KASI 음양력 API, lunar-javascript 등)로 교체 필요.
 */

// ── 0. 조계종 우선 사찰 목록 ─────────────────────────────────────────
// 조계종 25개 본사 + 주요 직할 사찰 — 기도 공간이 충분하고 방문 추천에 적합한 사찰
// 이 목록에 포함된 사찰은 매칭 점수에 +15점 가산 (종단 신뢰도 보너스)
const JOGYE_TEMPLES = new Set([
  // 25본사
  "조계사","용주사","신흥사","월정사","법주사","마곡사","수덕사","직지사",
  "은해사","불국사","통도사","해인사","쌍계사","범어사","동화사","선운사",
  "금산사","화엄사","송광사","백양사","대흥사","관음사","봉선사","흥국사","봉암사",
  // 주요 직할·말사
  "도선사","화계사","봉은사","진관사","흥천사","청룡사","삼각산","개운사",
  "백련사","선암사","운주사","내소사","실상사","부석사","관룡사","표충사",
  "석굴암","감은사지","천은사","연곡사","쌍봉사","태안사","구례화엄사",
  "용문사","상원사","오대산월정사","정암사","건봉사","신흥사","낙산사",
  "전등사","마니산","보문사","정수사","미황사","도갑사","천관사","금둔사",
  "운문사","팔공산동화사","갓바위","파계사","기림사","골굴사","장항사",
  "다보사","영축산통도사","표충비각","성불사"
]);

// ── 1. 오행-방위 대응표 ─────────────────────
const OHAENG_BANGWI = {
  목: "동", 화: "남", 토: "중앙", 금: "서", 수: "북",
};

// ── 3. 기도목적 → 관련 오행 매핑 ─────────────────────
const PURPOSE_OHAENG = {
  재물운: "금",
  건강운: "토",
  학업운: "수",
  인연운: "화",
  가정운: "목",
  수험합격: "화",   // 화(火) — 빛나는 성취·열기
  취업운: "금",    // 금(金) — 현실적 직업·경제활동
  출산기도: "목",  // 목(木) — 새 생명·탄생·성장
};

// 기도목적별 구체적 행동 가이드 — "인연이 깊다"에서 그치지 않고 실제로 뭘 하면 좋은지 안내
const PURPOSE_GUIDE = {
  재물운: [
    "도착하면: 일주문을 지날 때 마음을 가다듬고, 대웅전을 먼저 참배하세요.",
    "기도할 때: 대웅전에서 삼배 후 나한전이 있다면 들러 오백 나한님께 재물운을 발원하세요. 서쪽을 향해 기도하면 금(金) 기운이 더해집니다.",
    "마무리: 불전함에 작은 정성을 올리고, 감사한 마음으로 돌아나오세요.",
  ],
  건강운: [
    "도착하면: 경내를 천천히 한 바퀴 걸으며 몸과 마음을 이완하세요.",
    "기도할 때: 약사전이 있다면 약사여래 부처님께 건강 회복을 발원하세요. 없다면 대웅전에서 108배를 올리세요.",
    "마무리: 약수터가 있다면 한 모금 마시고, 감사한 마음으로 돌아나오세요.",
  ],
  학업운: [
    "도착하면: 탑 주위를 시계 방향으로 세 바퀴 돌며 마음을 정리하세요.",
    "기도할 때: 문수전이 있다면 지혜를 구하는 기도를, 없다면 대웅전에서 집중력과 기억력이 높아지기를 발원하세요.",
    "마무리: 나한전이 있다면 학업을 이룬 나한을 찾아 소원을 올리고 돌아나오세요.",
  ],
  인연운: [
    "도착하면: 해가 잘 드는 남향 자리를 찾아 잠시 마음을 정리하세요.",
    "기도할 때: 관음전이 있다면 그곳에서 기도하세요. 관세음보살님은 인연과 자비의 보살입니다.",
    "마무리: 소망을 담아 소원지를 써서 걸어두는 것도 좋습니다 (사찰에 따라 유무 다름).",
  ],
  가정운: [
    "도착하면: 가족과 함께 왔다면 나란히 서서 대웅전을 참배하세요.",
    "기도할 때: 가족 이름을 마음속으로 부르며 삼배하세요. 지장전이 있다면 조상님의 가호도 함께 빌어보세요.",
    "마무리: 경내를 조용히 거닐며 가족과 대화를 나눠보세요.",
  ],
  수험합격: [
    "도착하면: 문수전 또는 대웅전 앞에서 합장하고 마음을 가다듬으세요.",
    "기도할 때: 시험 날짜와 이름을 마음속으로 밝히며 삼배하세요. 나한전이 있다면 합격을 도운 나한님을 찾아보세요.",
    "마무리: 소원지에 합격 소원을 적어 걸어두고, 감사한 마음으로 돌아나오세요.",
  ],
  취업운: [
    "도착하면: 대웅전을 먼저 참배하고, 관음전이 있다면 들러 새 인연과 기회를 발원하세요.",
    "기도할 때: 원하는 직장·직업을 마음속으로 구체적으로 떠올리며 삼배하세요.",
    "마무리: 불전함에 정성을 올리고, 취업이 이뤄졌을 때 다시 방문하겠다는 마음으로 돌아나오세요.",
  ],
  출산기도: [
    "도착하면: 관음전을 먼저 찾아 임신·출산을 기원하세요. 관세음보살님은 산모와 아기를 보살펴 주십니다.",
    "기도할 때: 대웅전에서도 새 생명의 건강한 탄생을 간절히 발원하세요.",
    "마무리: 약사전이 있다면 들러 산모와 아기의 건강을 함께 발원하고, 마음이 편안해질 때까지 경내를 거니세요.",
  ],
};

const { Solar, Lunar } = require("lunar-javascript");

// 한자 오행 → 한글 오행 변환
const HANJA_OHAENG = { 木: "목", 火: "화", 土: "토", 金: "금", 水: "수" };

/**
 * 생년월일시 → 실제 만세력 기반 사주 팔자 산출 (양력/음력 모두 지원)
 * lunar-javascript(6tail) 사용 — 절기(節氣) 기준 정밀 계산, 국내 명리 계산과 동일 방식
 *
 * 두 가지 입력 형태를 모두 받는다 (하위 호환 유지):
 * 1) 문자열: "YYYY-MM-DDTHH:mm:ss" (양력 기준, 기존 방식)
 * 2) 객체: { calendarType: "solar"|"lunar", year, month, day, hour, minute, isLeapMonth }
 */
/**
 * 진태양시(眞太陽時) 보정 — 경도 기반
 * 한국 표준시(KST)는 동경 135° 기준. 실제 출생지 경도에 따라 보정.
 * 보정값(분) = (경도 - 135) × 4
 * 예) 서울(126.978°) → (126.978-135)×4 ≈ -32분
 */
function applyTrueSolarTime(year, month, day, hour, minute, longitude) {
  if (longitude == null) return { year, month, day, hour, minute };
  const correctionMin = Math.round((longitude - 135) * 4);
  const d = new Date(year, month - 1, day, hour, minute + correctionMin, 0);
  return {
    year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(),
    hour: d.getHours(), minute: d.getMinutes(),
  };
}

function getEightChar(birthInput) {
  // 1) 문자열(기존 방식, 양력) — 하위 호환
  if (typeof birthInput === "string") {
    const d = new Date(birthInput);
    const solar = Solar.fromYmdHms(
      d.getFullYear(), d.getMonth() + 1, d.getDate(),
      d.getHours(), d.getMinutes(), d.getSeconds() || 0
    );
    return solar.getLunar().getEightChar();
  }

  // 2) 객체 — 양력/음력 분기
  let { calendarType, year, month, day, hour = 12, minute = 0, isLeapMonth = false, birthLongitude } = birthInput;

  // 진태양시 보정 (출생지 경도가 있을 때만)
  if (birthLongitude != null) {
    const adj = applyTrueSolarTime(year, month, day, hour, minute, birthLongitude);
    year = adj.year; month = adj.month; day = adj.day;
    hour = adj.hour; minute = adj.minute;
  }

  if (calendarType === "lunar") {
    const lunarDateOnly = Lunar.fromYmd(year, isLeapMonth ? -month : month, day);
    const correspondingSolar = lunarDateOnly.getSolar();
    const preciseSolar = Solar.fromYmdHms(
      correspondingSolar.getYear(), correspondingSolar.getMonth(), correspondingSolar.getDay(),
      hour, minute, 0
    );
    return preciseSolar.getLunar().getEightChar();
  }

  // 기본: 양력
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  return solar.getLunar().getEightChar();
}

/**
 * 오행 캘린더: 오늘부터 daysAhead일 이내에서, 그날의 일진(日辰) 오행이
 * targetOhaeng와 일치하는 날짜들을 추천일로 반환 (최대 maxResults개)
 * @param {string} targetOhaeng - 부족/목표 오행 ("목"|"화"|"토"|"금"|"수")
 * @param {number} daysAhead - 앞으로 며칠까지 볼지 (기본 30일)
 * @param {number} maxResults - 최대 반환 개수 (기본 5, 멤버십은 더 크게 요청 가능)
 */
function getRecommendedDates(targetOhaeng, daysAhead = 30, maxResults = 5) {
  const results = [];
  const today = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const solar = Solar.fromYmdHms(d.getFullYear(), d.getMonth() + 1, d.getDate(), 12, 0, 0);
    const bazi = solar.getLunar().getEightChar();
    const dayWuXing = bazi.getDayWuXing(); // 예: "木火" (일간+일지 오행 두 글자)
    const dayElements = [...dayWuXing].map((h) => HANJA_OHAENG[h]).filter(Boolean);

    if (dayElements.includes(targetOhaeng)) {
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      results.push({ date: dateStr, dayOhaeng: dayElements.join("") });
    }
    if (results.length >= maxResults) break;
  }
  return results;
}

/** 사주 8글자(4주 × 천간/지지) → 오행 분포 카운트 + 4지지 추출 */
function calculateOhaeng(birthDateTime) {
  let bazi;
  try {
    bazi = getEightChar(birthDateTime);
  } catch (e) {
    // 음력→양력 변환 실패 시 양력으로 재시도
    if (birthDateTime && typeof birthDateTime === "object" && birthDateTime.calendarType === "lunar") {
      try {
        bazi = getEightChar({ ...birthDateTime, calendarType: "solar" });
      } catch (e2) {
        bazi = getEightChar({ calendarType: "solar", year: birthDateTime.year || 1990, month: birthDateTime.month || 1, day: 1, hour: 12, minute: 0 });
      }
    } else {
      throw e;
    }
  }
  const dist = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  // 각 기둥의 "천간오행+지지오행" 두 글자(예: "金金")를 분해해 카운트
  [bazi.getYearWuXing(), bazi.getMonthWuXing(), bazi.getDayWuXing(), bazi.getTimeWuXing()]
    .forEach((pair) => {
      [...pair].forEach((hanja) => {
        const element = HANJA_OHAENG[hanja];
        if (element) dist[element]++;
      });
    });

  // 4지지(地支) 추출 — findWeakOhaeng 지장간 보정에 사용
  const branches = [bazi.getYear(), bazi.getMonth(), bazi.getDay(), bazi.getTime()]
    .map((p) => (p && p.length >= 2 ? p[1] : ""))
    .filter(Boolean);

  return { distribution: dist, branches };
}

/** 부족 오행(용신 후보) 도출 — 지장간 중기 보정 포함 */
function findWeakOhaeng(distribution, branches) {
  // 지장간(支藏干): [여기, (중기,) 정기] 순서. 정기는 표면 오행과 일치해 이미 계산됨.
  const JJG = {
    '子':['壬','癸'],       '丑':['癸','辛','己'],
    '寅':['戊','丙','甲'],  '卯':['甲','乙'],
    '辰':['乙','癸','戊'],  '巳':['戊','庚','丙'],
    '午':['丙','己','丁'],  '未':['丁','乙','己'],
    '申':['戊','壬','庚'],  '酉':['庚','辛'],
    '戌':['辛','丁','戊'],  '亥':['甲','壬'],
  };
  const GAN_OH = { '甲':'목','乙':'목','丙':'화','丁':'화','戊':'토','己':'토','庚':'금','辛':'금','壬':'수','癸':'수' };

  // 중기(中氣)에 1.0점 가중치 추가 — 申의 壬水·寅의 丙火처럼 겉에 안 보이는 숨은 기운 반영
  const bonus = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  if (Array.isArray(branches)) {
    for (const ji of branches) {
      const stems = JJG[ji] || [];
      if (stems.length === 3) {
        const midOh = GAN_OH[stems[1]];
        if (midOh) bonus[midOh] += 1.0;
      }
    }
  }

  // 月令(월령) 가중치 +2 — 명리학 정통 기준: 월지 정기(正氣) 오행이 사주에서 가장 강한 기운
  // 예: 寅月 → 甲(목) → bonus.목 += 2 → 목이 월령의 힘을 받아 약하지 않음 판정
  const JEONGGI_MAP = {
    子:'癸',丑:'己',寅:'甲',卯:'乙',辰:'戊',巳:'丙',
    午:'丁',未:'己',申:'庚',酉:'辛',戌:'戊',亥:'壬'
  };
  const monthBranch = Array.isArray(branches) ? branches[1] : null; // 월지(月支)
  const monthJeonggi = monthBranch ? JEONGGI_MAP[monthBranch] : null;
  const monthJeonggiOh = monthJeonggi ? GAN_OH[monthJeonggi] : null;
  if (monthJeonggiOh) bonus[monthJeonggiOh] += 2.0;

  // 동점 시 표면 카운트가 더 낮은 오행을 약한 것으로 판정
  let weakest = null;
  let minScore = Infinity;
  let minSurface = Infinity;
  for (const [element, count] of Object.entries(distribution)) {
    const score = count + (bonus[element] || 0);
    if (score < minScore || (score === minScore && count < minSurface)) {
      minScore = score;
      minSurface = count;
      weakest = element;
    }
  }
  const bonusNote = bonus[weakest] > 0 ? ` + 지장간·월령 ${bonus[weakest]}` : "";
  return { 부족오행: weakest, 근거: `지장간·월령 보정 포함 — ${weakest}(표면 ${distribution[weakest]}개${bonusNote})이 가장 약함` };
}

/** 두 좌표 간 방위각(bearing) 계산 → 8방위 변환 */
function calculateBearing(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;

  const directions = ["북", "동북", "동", "동남", "남", "남서", "서", "북서"];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/** 방위각 원값(0~360°). 오행 프로파일은 여덟 칸으로 뭉개기 전의 각도를 쓴다. */
function bearingDegrees(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** 두 좌표 간 거리(km, Haversine) */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** 8방위를 오행으로 근사 매핑 (동북/동남 등 경계 방위는 인접 오행으로 절충) */
function bearingToOhaeng(bearing) {
  const map = {
    동: "목", 동북: "목", 북: "수", 남서: "토",
    남: "화", 동남: "화", 서: "금", 북서: "금",
  };
  return map[bearing] || "토";
}

// ── 방향성 관계행렬 · 과잉 감쇠 · 비가산 시너지 (특허 ① 계열) ─────────
// 전자책 제18~19장에 공개한 계산식. funnel/matcher.py의 참조 구현과 같은 상수를 쓴다.
// 규칙과 상수를 공개했으므로 독자가 검산하고 반박할 수 있다 — 그것이 이 엔진의 전제다.
//
// score = Σ_{M>0} g(x)·M  +  Σ_{M<0} x·M  +  α·√(x_용신 · x_희신)
//         ──감쇠된 보강──     ─손상(감쇠 없음)─    ───시너지───
//
// 상수는 전부 설계 선택이며 자연 상수가 아니다(제19장 5절).

const OH = ["목", "화", "토", "금", "수"];
const SHENG = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" }; // a 生 b
const KE     = { 목: "토", 토: "수", 수: "화", 화: "금", 금: "목" }; // a 剋 b
const REL_WEIGHT = { 比: 1.0, 生: 0.6, 洩: -0.3, 耗: -0.1, 剋: -0.8 };
const K_SAT = 40.0; // 과잉 감쇠(포화) 기준값 — 특허 명세서의 편차 Δ와는 다른 장치
const ALPHA = 0.15; // 시너지 비중

/** 환경 오행 a가 나의 용신 b에 대해 갖는 관계 (25칸 중 20칸이 비대칭) */
function relation(a, b) {
  if (a === b) return "比";
  if (SHENG[a] === b) return "生"; // a가 b를 생함 — 간접 보강
  if (SHENG[b] === a) return "洩"; // b가 a를 생함 — 내가 소모됨
  if (KE[a] === b) return "剋";    // a가 b를 침 — 직접 손상
  if (KE[b] === a) return "耗";    // b가 a를 침 — 내가 힘을 씀
  return "比";
}

/** 과잉 감쇠 g(x) = Kx/(K+x). 아무리 커도 K를 넘지 못한다. 손상에는 적용하지 않는다. */
function damp(x) {
  return (K_SAT * x) / (K_SAT + x);
}

/** 희신 = 용신을 생해주는 오행 */
function huiSin(yongsin) {
  return OH.find((a) => SHENG[a] === yongsin);
}

/**
 * 도량의 오행 프로파일.
 *
 * 제23장은 산세·수세·방위 셋으로 좌표를 낸다고 했으나, 현재 DB가 전 사찰에
 * 대해 갖고 있는 것은 좌표에서 계산한 방위와 기도 목적뿐이다. 없는 것을
 * 추정으로 메우지 않는다(제22장 4절) — 있는 신호만으로 구성하고,
 * 산세·수세가 확보된 도량은 그 값이 들어오면 바로 반영되도록 열어 둔다.
 */
function templeOhaengProfile(temple, bearingOhaeng, bearingDeg) {
  const p = { 목: 10, 화: 10, 토: 10, 금: 10, 수: 10 }; // 기준선

  if (bearingDeg != null) {
    // 방위각을 다섯 칸으로 스냅하면 도량 사이의 차이가 통째로 사라진다.
    // 실제로 측정된 값은 각도이므로, 사방(수北0°·목東90°·화南180°·금西270°)에
    // 대한 각거리로 연속 배분한다. 토는 중앙이라 방위 성분이 없어 기준선만 갖는다.
    const CARD = { 수: 0, 목: 90, 화: 180, 금: 270 };
    for (const [e, deg] of Object.entries(CARD)) {
      let d = Math.abs(((bearingDeg - deg + 540) % 360) - 180); // 0~180
      if (d < 90) p[e] += 34 * Math.cos((d * Math.PI) / 180);   // 90° 넘으면 기여 없음
    }
  } else if (bearingOhaeng) {
    p[bearingOhaeng] += 30;
  }

  const purposeEl = PURPOSE_OHAENG[temple.mainPurpose];
  if (purposeEl) p[purposeEl] += 15;

  if (temple.ohaeng) { // 제25장 정밀 프로파일이 확보된 도량은 그 값이 우선
    for (const e of OH) if (temple.ohaeng[e] != null) p[e] = temple.ohaeng[e];
  }
  for (const e of OH) p[e] = Math.round(p[e] * 10) / 10;
  return p;
}

/** 제18~19장 점수식. 항목별 내역을 함께 돌려 결과를 역추적할 수 있게 한다. */
function ohaengFitScore(profile, yongsin) {
  const hui = huiSin(yongsin);
  let boost = 0, harm = 0;
  const parts = [];
  for (const e of OH) {
    const x = profile[e] || 0;
    const rel = relation(e, yongsin);
    const w = REL_WEIGHT[rel];
    const contrib = w > 0 ? damp(x) * w : x * w;
    if (w > 0) boost += contrib; else harm += contrib;
    parts.push({ 오행: e, 값: x, 관계: rel, 가중치: w, 기여: Math.round(contrib * 100) / 100 });
  }
  const synergy = ALPHA * Math.sqrt((profile[yongsin] || 0) * (profile[hui] || 0));
  return {
    total: boost + harm + synergy,
    boost, harm, synergy, yongsin, huisin: hui, parts,
  };
}

/**
 * 사찰 스코어링
 * @param {object} temple - {id, name, lat, lng, verified, tags}
 * @param {object} matchContext - {targetOhaeng, personalOhaeng, distribution, purpose, userLat, userLng}
 */
function scoreTemple(temple, matchContext) {
  const { targetOhaeng, personalOhaeng, distribution, purpose, userLat, userLng } = matchContext;

  // 1) 방위 적합도 (최대 40점)
  // 기도목적 오행 방위 일치: 33점 (사용자 의도 반영)
  // 기도목적 + 사주 부족오행 둘 다 일치: 40점 (완벽 인연)
  // 사주 부족오행만 일치: 24점 (사주 보완)
  // 불일치: 13점
  const purposeOh = matchContext.purposeOhaeng || targetOhaeng;
  const personalOh = matchContext.personalOhaeng;
  const bearing = calculateBearing(userLat, userLng, temple.lat, temple.lng);
  const templeOhaeng = bearingToOhaeng(bearing);
  const matchesPurpose  = templeOhaeng === purposeOh;
  const matchesPersonal = personalOh && templeOhaeng === personalOh;
  const bangwiScore = (matchesPurpose && matchesPersonal) ? 40  // 기도목적 + 사주 동시 일치
    : matchesPurpose  ? 33  // 기도목적만 일치
    : matchesPersonal ? 24  // 사주 부족오행만 일치
    : 13;                   // 불일치

  // 1-b) 오행 적합도 — 제18~19장 관계행렬·감쇠·시너지 (이 엔진의 본체)
  //      용신을 입력으로 받으므로 사람마다 순위가 새로 계산된다. 절대적으로
  //      좋은 사찰은 없다(제19장 4절).
  const yongsin = personalOh || purposeOh || "토";
  const bearingDeg = (userLat != null && userLng != null)
    ? bearingDegrees(userLat, userLng, temple.lat, temple.lng) : null;
  const profile = templeOhaengProfile(temple, templeOhaeng, bearingDeg);
  const fit = ohaengFitScore(profile, yongsin);
  const ohaengScore = fit.total;

  // 1-c) 생년월일 해시 가산점은 제거했다.
  //      (birthYear*7 + birthMonth*31 + birthDay*17 + templeKey*11) % 61 - 30 이
  //      전체 점수 폭의 40% 이상을 차지하고 있었다. 결과를 다양해 보이게 하려는
  //      장치였을 뿐 역학적 근거가 없다. 근거 없는 것은 넣지 않는다(제1장 원칙 ①).
  //      사람마다 결과가 달라지는 것은 용신이 다르기 때문이지 난수 때문이 아니다.

  // 2) 목적 태그 일치도 (30점)
  const purposeTagMap = {
    재물운: ["재물", "나한", "관음"],
    건강운: ["약사도량", "치유"],
    학업운: ["문수", "학업"],
    인연운: ["관음도량", "인연"],
    가정운: ["평안", "가족"],
  };
  const relevantTags = purposeTagMap[purpose] || [];
  const tagMatch = (temple.tags || []).some((t) => relevantTags.includes(t));
  const purposeScore = tagMatch ? 30 : 10;

  // 3) 접근성 점수 — 인연사찰은 거리/지역 무관, 사주 오행으로만 전국에서 찾음
  // 거리 점수 완전 제거: 서울에서 멀어도 인연이 맞으면 추천
  const distance = (userLat && userLng) ? calculateDistance(userLat, userLng, temple.lat, temple.lng) : 0;
  const distanceScore = 0; // 거리 점수 제거 — 전국 동등 경쟁

  // 4) 데이터 신뢰도 + 조계종 보너스 (최대 13점)
  // 조계종 보너스를 3점으로 낮춰 생년월일 다양성(±30점)이 결과에 충분히 반영되도록 조정
  const jogyeBonus = JOGYE_TEMPLES.has(temple.name) ? 3 : 0;
  const trustScore = (temple.verified ? 10 : 4) + jogyeBonus;

  // 5) 합산 — 오행 적합도가 본체이고, 나머지는 보조다.
  //    시너지는 ohaengFitScore 안에서 α·√(x_용신·x_희신)으로 이미 계산됐다.
  //    기존의 β=0.35 방위·목적 시너지는 제거했다. 책이 공개한 시너지는
  //    "용신과 희신이 함께 있을 때"의 것이지 "방위와 목적이 맞을 때"의 것이 아니다.
  const totalScore = ohaengScore + purposeScore + distanceScore + trustScore;

  return {
    temple,
    score: Math.round(totalScore * 10) / 10,
    detail: {
      bearing, templeOhaeng,
      // 결과를 역추적할 수 있도록 항목을 그대로 노출한다(제26장 3절 ⑤).
      ohaengScore: Math.round(ohaengScore * 10) / 10,
      용신: fit.yongsin, 희신: fit.huisin,
      보강: Math.round(fit.boost * 10) / 10,
      손상: Math.round(fit.harm * 10) / 10,
      시너지: Math.round(fit.synergy * 10) / 10,
      내역: fit.parts,
      프로파일: profile,
      bangwiScore, purposeScore, distanceScore, trustScore,
      distanceKm: Math.round(distance),
    },
  };
}

/** 한글 받침 유무에 따라 올바른 조사를 붙임 (예: "봉은사" + [과,와] → "봉은사와") */
function attachJosa(word, [withBatchim, withoutBatchim]) {
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return word + withoutBatchim; // 한글 아니면 기본값
  const hasBatchim = (code - 0xac00) % 28 !== 0;
  return word + (hasBatchim ? withBatchim : withoutBatchim);
}

/** 결과 설명 자동 생성 (템플릿 조합 - AI 생성 아님, 정직성 원칙) */
function generateReason(result, targetOhaeng, purpose, personalOhaeng, purposeOhaeng) {
  const { temple, detail } = result;
  const templeWaGwa = attachJosa(temple.name, ["과", "와"]);
  const templeEunNeun = attachJosa(temple.name, ["은", "는"]);
  const oh = targetOhaeng; // 사주 부족오행 (주 기준)
  const poh = purposeOhaeng || oh;

  if (detail.templeOhaeng === oh && oh === poh) {
    // 사주 부족오행 = 기도목적 오행 완전 일치
    return `사주에서 ${oh}(${OHAENG_BANGWI[oh]}) 기운이 가장 부족하며 ${purpose}에도 최적인 방위(${detail.bearing}쪽)에 위치한 ${templeWaGwa} 인연이 매우 깊은 것으로 나옵니다.`;
  } else if (detail.templeOhaeng === oh) {
    // 사주 부족오행 방위 일치 (기도목적은 다름)
    const purposeNote = poh !== oh ? ` ${purpose}을(를) 위한 ${poh}(${OHAENG_BANGWI[poh]}) 기운도 함께 보완됩니다.` : "";
    return `사주에서 부족한 ${oh}(${OHAENG_BANGWI[oh]}) 기운을 채워주는 ${detail.bearing}쪽에 위치한 ${templeWaGwa} 인연이 깊은 것으로 나옵니다.${purposeNote}`;
  } else if (detail.templeOhaeng === poh) {
    // 기도목적 오행 방위 일치
    return `${purpose} 기도에 적합한 ${poh}(${OHAENG_BANGWI[poh]}) 기운의 방위(${detail.bearing}쪽)에 위치한 ${templeWaGwa} 인연이 닿아 있습니다. 사주의 ${oh}(${OHAENG_BANGWI[oh]}) 기운 보완도 함께 고려됩니다.`;
  }
  return `${templeEunNeun} ${purpose} 목적과 연관된 기운을 지닌 사찰로, 사주 오행 분포와 인연이 있는 것으로 나옵니다.`;
}

/** 메인 매칭 함수 */
function matchTemples(request, templeDB) {
  const { distribution, branches } = calculateOhaeng(request.birthInput ?? request.birthDateTime);
  const weak = findWeakOhaeng(distribution, branches);

  // ── 매칭 기준: 기도목적 오행 우선 + 사주 부족오행 가산점 ──
  // 기도목적 방위가 primary (사용자가 명확히 선택한 의도)
  // 사주 부족오행이 기도목적과 같으면 시너지 보너스 → 개인화된 점수 차이 발생
  // 생년월일 다양화는 birthAffinity ±18점으로 같은 목적 내에서도 다른 사찰이 나오게 함
  const weakOhaeng = weak.부족오행;
  const purposeOhaeng = PURPOSE_OHAENG[request.purpose] || weakOhaeng;
  const targetOhaeng = purposeOhaeng; // 기도목적이 주 방위 기준

  const bi = request.birthInput ?? request.birthDateTime ?? {};
  const matchContext = {
    targetOhaeng,                         // 사주 부족오행 (주 기준)
    purposeOhaeng,                        // 기도목적 오행 (보조)
    personalOhaeng: weak.부족오행,
    distribution,
    purpose: request.purpose,
    userLat: request.userLat,
    userLng: request.userLng,
    birthYear: bi.year || 2000,
    birthMonth: bi.month || 1,
    birthDay: bi.day || 1,
  };

  // 기도 공간이 부족하거나 방문 추천에 적합하지 않은 소규모 도심 사찰 제외 목록
  // (법당이 하나뿐이거나 단체 기도 방문이 어려운 경우)
  const EXCLUDE_TEMPLES = new Set([
    '대각사',  // 서울 종로구 — 법당 1개, 기도 공간 부족
  ]);

  // 비사찰 이름 패턴 — 불교용품점, 굿당, 마트, 주유소, 음식점, 치킨집 등 사찰이 아닌 항목 제외
  const NON_TEMPLE_PATTERN = /용품|상회|마트|주유소|굿당|무속|철물|식당|카페|홈쇼핑|불교마트|불교서적|장례|요양병원|수녀원|찐빵|음식체험|음식연구|음식문화원|음식협회|일관도|주점|편의점|농협(?!사)|슈퍼|마켓|주차|게스트하우스|펜션|호텔|모텔|민박|캠핑|공장|회사(?!불)|재단(?!불|법)|아파트|치킨|횟집|국수(?!암)|김밥나라|피자|커피(?!붓다)|벌크|코리엔탈|굽네|bhc|bhc/i;

  // 좌표 정보 없는 사찰 + 제외 목록 사찰 + 비사찰 항목 모두 매칭 대상에서 제외
  let validTemples = templeDB.filter((t) =>
    t.lat != null && t.lng != null &&
    !EXCLUDE_TEMPLES.has(t.name) &&
    !NON_TEMPLE_PATTERN.test(t.name)
  );

  // 기도 여행 지역 필터 — 특정 시/도를 선택하면 해당 지역 사찰만 대상으로 함
  if (request.region) {
    const regionFiltered = validTemples.filter((t) => t.address?.includes(request.region));
    // 필터 결과가 5개 이상이면 적용, 너무 적으면 전국으로 폴백
    if (regionFiltered.length >= 5) validTemples = regionFiltered;
  }

  // 거리 제한 필터 (지역 선택이 없을 때만 적용)
  if (!request.region && request.maxDistanceKm && request.userLat && request.userLng) {
    const distFiltered = validTemples.filter((t) => {
      const dlat = (t.lat - request.userLat) * 111;
      const dlng = (t.lng - request.userLng) * 111 * Math.cos(request.userLat * Math.PI / 180);
      return Math.sqrt(dlat * dlat + dlng * dlng) <= request.maxDistanceKm;
    });
    if (distFiltered.length >= 5) validTemples = distFiltered;
  }

  // ── 목적별 방위 분리 사찰 선택 ──────────────────────────────────────────
  // 각 목적의 방위(재물운=서/북서, 가정운=동/동북, 인연운=남/동남, 학업운=북, 건강운=남서)로
  // 먼저 필터링 → 방위가 다르면 사찰 풀 자체가 달라지므로 목적마다 반드시 다른 사찰이 나옴
  const DIR_OHAENG = { 동:"목", 동북:"목", 북:"수", 남서:"토", 남:"화", 동남:"화", 서:"금", 북서:"금" };
  // 사주 부족오행 방위 + 기도목적 오행 방위 둘 다 포함 (합집합)
  const weakBearings    = Object.keys(DIR_OHAENG).filter(k => DIR_OHAENG[k] === targetOhaeng);
  const purposeBearings = Object.keys(DIR_OHAENG).filter(k => DIR_OHAENG[k] === purposeOhaeng);
  const targetBearings  = [...new Set([...weakBearings, ...purposeBearings])];

  const allScored = validTemples
    .map((t) => scoreTemple(t, matchContext))
    .sort((a, b) => b.score - a.score);

  // 사주/목적 방위 일치 사찰 우선, 나머지 보충
  const dirMatched = allScored.filter(t => targetBearings.includes(t.detail.bearing));
  const dirOther   = allScored.filter(t => !targetBearings.includes(t.detail.bearing));

  // 방위 일치 사찰 최대 10개 + 나머지 30개 = 40개 풀
  // → 경기도처럼 특정 방위 사찰이 적은 지역에서도 다양한 결과 보장
  const primaryPool = dirMatched.length >= 2
    ? [...dirMatched.slice(0, 10), ...dirOther.slice(0, 30)].slice(0, 40)
    : [...dirOther.slice(0, 10), ...dirMatched, ...dirOther.slice(10)].slice(0, 40);

  // ── 시드 기반 셔플로 매번 다른 사찰 추출 ────────────────────────────────
  // 점수가 높은 특정 사찰(대각사 등)이 독점되지 않도록 Fisher-Yates 셔플 적용
  const PURPOSE_SEED_OFFSETS = { 재물운: 1031, 건강운: 2053, 학업운: 3079, 인연운: 4099, 가정운: 5147, 수험합격: 6197, 취업운: 7211, 출산기도: 8221 };
  const distSeed = (distribution.목||0)*97 + (distribution.화||0)*191 + (distribution.토||0)*283 + (distribution.금||0)*379 + (distribution.수||0)*467;
  // 시, 분까지 반영해 같은 날 다른 시간대 입력도 다른 결과
  const hourSeed = (bi.hour || 0) * 1009 + (bi.minute || 0) * 13;
  const baseSeed = Math.abs(
    (bi.year || 2000) * 40507 + (bi.month || 1) * 3001 + (bi.day || 1) * 997
    + distSeed + hourSeed + (PURPOSE_SEED_OFFSETS[request.purpose] || 0)
  );

  // 점수 순으로 세우되, 동급 구간 안에서만 시드로 섞는다.
  //
  // 이전에는 순서의 60%를 난수가 정했다(scoreNorm*0.40 + rand*0.60). 결과가
  // 다양해 보이게 하려는 장치였지만, 그러면 "왜 이 도량인가"에 답할 수 없다.
  // 제26장 3절 ④에서 격차 3점 미만은 사실상 동급이라고 밝혔으므로, 그 폭
  // 안에서만 섞는다. 동급 아닌 것을 섞지는 않는다.
  const TIE_BAND = 3.0; // 제26장 3절 ④의 '사실상 동급' 폭
  function rankWithTieShuffle(arr, seed) {
    const sorted = [...arr].sort((a, b) => b.score - a.score);
    const out = [];
    let s = seed >>> 0;
    for (let i = 0; i < sorted.length; ) {
      let j = i;
      while (j < sorted.length && sorted[i].score - sorted[j].score < TIE_BAND) j++;
      const group = sorted.slice(i, j);
      for (let k = group.length - 1; k > 0; k--) { // Fisher-Yates (시드 고정)
        s = (s * 1664525 + 1013904223) >>> 0;
        const r = s % (k + 1);
        [group[k], group[r]] = [group[r], group[k]];
      }
      out.push(...group);
      i = j;
    }
    return out;
  }

  const shuffled = rankWithTieShuffle(primaryPool, baseSeed);

  // 오행 적합도가 음수인 도량은 제외한다.
  // 고정 임계값(옛 50점)이 아니라 부호로 거른다 — 음수는 "지금 이 사람의
  // 균형에 보탬이 되지 않는다"는 뜻이지 나쁜 절이라는 뜻이 아니다(제26장 4절).
  const seenNames = new Set();
  const scored = [];
  for (let pass = 0; pass < 2 && scored.length < 3; pass++) {
    for (let i = 0; scored.length < 3 && i < shuffled.length; i++) {
      const t = shuffled[i];
      const ok = pass === 0 ? (t.detail?.ohaengScore ?? 0) > 0 : true; // 2차: 조건 완화
      if (ok && !seenNames.has(t.temple.name)) {
        seenNames.add(t.temple.name);
        scored.push({ ...t, reason: generateReason(t, targetOhaeng, request.purpose, weak.부족오행, purposeOhaeng) });
      }
    }
  }

  // 최종 점수 내림차순 (1위가 가장 인연 강한 사찰)
  scored.sort((a, b) => b.score - a.score);

  // 멤버십 회원은 확장된 캘린더(15일), 비회원은 기본(3일) — 클라이언트가 알려주는 소프트 게이팅
  const calendarCount = request.memberUnlocked ? 15 : 3;
  const recommendedDates = getRecommendedDates(targetOhaeng, 45, calendarCount);

  // 사주 팔자 데이터 — 결과 화면에 표시
  let eightChar = null;
  try {
    const bazi = getEightChar(request.birthInput ?? request.birthDateTime);
    eightChar = {
      year:  bazi.getYear(),  month: bazi.getMonth(),
      day:   bazi.getDay(),   time:  bazi.getTime(),
      yearWx:  bazi.getYearWuXing(),  monthWx: bazi.getMonthWuXing(),
      dayWx:   bazi.getDayWuXing(),   timeWx:  bazi.getTimeWuXing(),
    };
  } catch(_) {}

  return { distribution, weak, targetOhaeng, purpose: request.purpose, results: scored, recommendedDates, purposeGuide: PURPOSE_GUIDE[request.purpose], eightChar };
}

/** 궁합사찰 점수 계산 */
function scoreTempleForCouple(temple, matchContextA, matchContextB) {
  const resultA = scoreTemple(temple, matchContextA);
  const resultB = scoreTemple(temple, matchContextB);
  const avgScore = (resultA.score + resultB.score) / 2;
  const BETA_COUPLE = 0.3;
  const synergyCouple = BETA_COUPLE * Math.sqrt(resultA.score * resultB.score) * 0.12;
  return {
    temple,
    score: Math.round((avgScore + synergyCouple) * 10) / 10,
    detail: resultA.detail,
    detailA: resultA.detail,
    detailB: resultB.detail,
    synergyCouple: Math.round(synergyCouple * 10) / 10,
  };
}

function generateCoupleReason(result, targetA, targetB) {
  const { temple, detailA, detailB } = result;
  const templeWaGwa = attachJosa(temple.name, ["과", "와"]);
  const bothMatch = detailA.templeOhaeng === targetA && detailB.templeOhaeng === targetB;
  if (bothMatch) {
    const label = targetA === targetB ? targetA : `${targetA}-${targetB}`;
    return `두 분 모두에게 필요한 기운(${label})과 방향이 겹치는 ${templeWaGwa} 인연이 깊은 것으로 나옵니다.`;
  }
  return `${templeWaGwa} 두 분의 사주를 함께 고려했을 때 인연이 확인되는 사찰입니다.`;
}

/** 궁합사찰 매칭 메인 함수 */
function matchCoupleTemples(request, templeDB) {
  const { birthInputA, birthInputB, purpose, userLat, userLng, memberUnlocked } = request;
  const resA = calculateOhaeng(birthInputA);
  const resB = calculateOhaeng(birthInputB);
  const distributionA = resA.distribution;
  const distributionB = resB.distribution;
  const idealOhaeng = PURPOSE_OHAENG[purpose];
  const targetA = (distributionA[idealOhaeng] ?? 0) <= 2 ? idealOhaeng : findWeakOhaeng(distributionA, resA.branches).부족오행;
  const targetB = (distributionB[idealOhaeng] ?? 0) <= 2 ? idealOhaeng : findWeakOhaeng(distributionB, resB.branches).부족오행;
  const biA = birthInputA ?? {};
  const biB = birthInputB ?? {};
  const ctxA = { targetOhaeng: targetA, personalOhaeng: findWeakOhaeng(distributionA, resA.branches).부족오행, distribution: distributionA, purpose, userLat, userLng, birthYear: biA.year||2000, birthMonth: biA.month||1, birthDay: biA.day||1 };
  const ctxB = { targetOhaeng: targetB, personalOhaeng: findWeakOhaeng(distributionB, resB.branches).부족오행, distribution: distributionB, purpose, userLat, userLng, birthYear: biB.year||2000, birthMonth: biB.month||1, birthDay: biB.day||1 };
  let validTemples = templeDB.filter((t) => t.lat != null && t.lng != null);

  // 기도 여행 지역 필터
  if (request.region) {
    const rf = validTemples.filter((t) => t.address?.includes(request.region));
    if (rf.length >= 5) validTemples = rf;
  }

  // 궁합: 두 사람의 목적 방위 합집합으로 먼저 필터링 → 목적별 다른 풀 보장
  const DIR_OHAENG_C = { 동:"목", 동북:"목", 북:"수", 남서:"토", 남:"화", 동남:"화", 서:"금", 북서:"금" };
  const coupleBearings = [...new Set([
    ...Object.keys(DIR_OHAENG_C).filter(k => DIR_OHAENG_C[k] === targetA),
    ...Object.keys(DIR_OHAENG_C).filter(k => DIR_OHAENG_C[k] === targetB),
  ])];

  const allCoupleScored = validTemples
    .map((t) => scoreTempleForCouple(t, ctxA, ctxB))
    .sort((a, b) => b.score - a.score);

  // 방위 일치 사찰 먼저, 부족하면 일반으로 보충
  const coupleDirMatched = allCoupleScored.filter(t => coupleBearings.includes(t.detail.bearing));
  const coupleDirOther = allCoupleScored.filter(t => !coupleBearings.includes(t.detail.bearing));
  const couplePrimaryPool = coupleDirMatched.length >= 2
    ? [...coupleDirMatched, ...coupleDirOther].slice(0, 20)
    : [...coupleDirOther.slice(0, 3), ...coupleDirMatched, ...coupleDirOther.slice(3)].slice(0, 20);

  // 시드 기반 셔플로 매번 다른 사찰 추출 (단일 매칭)
  const PURPOSE_SEED_OFFSETS_C = { 재물운: 1031, 건강운: 2053, 학업운: 3079, 인연운: 4099, 가정운: 5147, 수험합격: 6197, 취업운: 7211, 출산기도: 8221 };
  const coupleBase = Math.abs(
    (biA.year||2000) * 40507 + (biA.month||1) * 3001 + (biA.day||1) * 997
    + (biB.year||2000) * 20011 + (biB.month||1) * 1511 + (biB.day||1) * 499
    + (PURPOSE_SEED_OFFSETS_C[purpose] || 0)
  );

  function seededShuffleC(arr, seed) {
    const a = arr.map((item) => ({ item, order: 0 }));
    let s = seed;
    for (let i = 0; i < a.length; i++) {
      s = (s * 1664525 + 1013904223) >>> 0;
      const scoreNorm = (a[i].item.score || 0) / 100;
      a[i].order = scoreNorm * 0.40 + (s / 0xFFFFFFFF) * 0.60;
    }
    return a.sort((x, y) => y.order - x.order).map(o => o.item);
  }

  const coupleShuffled = seededShuffleC(couplePrimaryPool, coupleBase);
  const coupleSeenNames = new Set();
  const scored = [];
  for (let i = 0; scored.length < 3 && i < coupleShuffled.length; i++) {
    const t = coupleShuffled[i];
    if (!coupleSeenNames.has(t.temple.name)) {
      coupleSeenNames.add(t.temple.name);
      scored.push({ ...t, reason: generateCoupleReason(t, targetA, targetB) });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  const calendarCount = memberUnlocked ? 15 : 3;

  return {
    distributionA,
    distributionB,
    targetA,
    targetB,
    results: scored,
    recommendedDates: getRecommendedDates(targetA, 45, calendarCount),
    purposeGuide: PURPOSE_GUIDE[purpose],
  };
}

module.exports = { matchTemples, matchCoupleTemples, calculateOhaeng, findWeakOhaeng, getEightChar,
  // 제18~19장 계산식 — 독자가 검산할 수 있도록 내보낸다.
  relation, damp, huiSin, ohaengFitScore, templeOhaengProfile,
  REL_WEIGHT, K_SAT, ALPHA };
