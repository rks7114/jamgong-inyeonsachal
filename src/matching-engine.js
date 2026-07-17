/**
 * 잼공인연사찰 - 오행 매칭 엔진 프로토타입 v1.0
 * 클(수석실장) 작성
 *
 * 주의: 사주 오행 계산은 간략화 버전입니다.
 * 실제 서비스에서는 정확한 만세력 라이브러리(예: KASI 음양력 API, lunar-javascript 등)로 교체 필요.
 */

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
    "기도할 때: 산신각이 있다면 함께 들러 삼배하세요. 금(金) 기운을 상징하는 서쪽을 바라보고 기도하면 좋습니다.",
    "마무리: 불전함에 작은 정성을 올리고, 감사한 마음으로 돌아나오세요.",
  ],
  건강운: [
    "도착하면: 경내를 천천히 한 바퀴 걸으며 몸과 마음을 이완하세요.",
    "기도할 때: 약사여래를 모신 전각(약사전)이 있다면 그곳에서 기도하세요. 토(土) 기운은 중앙·안정을 뜻합니다.",
    "마무리: 물이 있는 곳(약수터 등)이 있다면 한 모금 마시고 돌아나오세요.",
  ],
  학업운: [
    "도착하면: 탑 주위를 시계 방향으로 세 바퀴 돌며 마음을 정리하세요.",
    "기도할 때: 문수보살을 모신 전각이나 탑 앞에서 기도하면 좋습니다. 수(水) 기운은 지혜를 뜻합니다.",
    "마무리: 계곡이나 샘이 있다면 그 근처에서 잠시 머물다 돌아나오세요.",
  ],
  인연운: [
    "도착하면: 해가 잘 드는 남향 자리를 찾아 잠시 마음을 정리하세요.",
    "기도할 때: 관음전이 있다면 그곳에서 기도하세요. 화(火) 기운은 정열과 관계를 뜻합니다.",
    "마무리: 소망을 담아 소원지를 써서 걸어두는 것도 좋습니다 (사찰에 따라 유무 다름).",
  ],
  가정운: [
    "도착하면: 가족과 함께 왔다면 나란히 서서 대웅전을 참배하세요.",
    "기도할 때: 가족 모두의 이름을 마음속으로 부르며 삼배하세요. 목(木) 기운은 성장·화합을 뜻합니다.",
    "마무리: 경내의 나무 아래서 잠시 머물며 가족과 대화를 나눠보세요.",
  ],
  수험합격: [
    "도착하면: 문수전(文殊殿) 또는 탑 앞에서 합장하고 마음을 가다듬으세요.",
    "기도할 때: 시험 날짜와 이름을 마음속으로 밝히며 삼배하세요. 화(火) 기운은 집중력과 빛나는 성취를 뜻합니다.",
    "마무리: 소원지에 합격 소원을 적어 걸어두고, 감사한 마음으로 돌아나오세요.",
  ],
  취업운: [
    "도착하면: 칠성각(七星閣)이 있다면 먼저 들러 복록을 빌어보세요.",
    "기도할 때: 원하는 직장·직업을 마음속으로 구체적으로 떠올리며 삼배하세요. 금(金) 기운은 현실적 성취를 뜻합니다.",
    "마무리: 불전함에 정성을 올리고, 취업이 이뤄졌을 때 다시 방문하겠다는 마음으로 돌아나오세요.",
  ],
  출산기도: [
    "도착하면: 삼신각(三神閣)이 있는지 먼저 확인하세요. 임신·출산 기도의 핵심 전각입니다.",
    "기도할 때: 관음전에서도 기도하세요. 목(木) 기운은 새 생명·탄생·성장을 뜻합니다.",
    "마무리: 산신각에도 들러 건강한 출산을 기원하고, 마음이 편안해질 때까지 경내를 거니세요.",
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

  let weakest = null;
  let minScore = Infinity;
  for (const [element, count] of Object.entries(distribution)) {
    const score = count + (bonus[element] || 0);
    if (score < minScore) {
      minScore = score;
      weakest = element;
    }
  }
  const bonusNote = bonus[weakest] > 0 ? ` + 지장간 ${bonus[weakest]}` : "";
  return { 부족오행: weakest, 근거: `지장간 보정 포함 — ${weakest}(표면 ${distribution[weakest]}개${bonusNote})이 가장 약함` };
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

/**
 * 사찰 스코어링
 * @param {object} temple - {id, name, lat, lng, verified, tags}
 * @param {object} matchContext - {targetOhaeng, personalOhaeng, distribution, purpose, userLat, userLng}
 */
function scoreTemple(temple, matchContext) {
  const { targetOhaeng, personalOhaeng, distribution, purpose, userLat, userLng } = matchContext;

  // 1) 방위 적합도 (40점) — 목적 오행 완전일치 40, 개인 부족오행 일치 28, 불일치 15
  const bearing = calculateBearing(userLat, userLng, temple.lat, temple.lng);
  const templeOhaeng = bearingToOhaeng(bearing);
  const bangwiScore = templeOhaeng === targetOhaeng ? 40
    : (personalOhaeng && templeOhaeng === personalOhaeng ? 28 : 15);

  // 1-b) 개인 공명 점수 (0~20점) — 사주에서 이 사찰 오행이 부족할수록 강하게 가산
  const personalNeed = distribution ? Math.max(0, 4 - (distribution[templeOhaeng] || 0)) : 2;
  const personalResonance = personalNeed * 5; // 0~20점

  // 1-c) 생년월일 친연도 (±5점) — 같은 점수대에서 생년월일마다 다른 사찰이 나오도록
  const birthYear = matchContext.birthYear || 2000;
  const birthMonth = matchContext.birthMonth || 1;
  const birthDay = matchContext.birthDay || 1;
  const templeKey = temple.id
    ? (parseInt(String(temple.id).replace(/\D/g, "").slice(-3)) || temple.name.length)
    : temple.name.charCodeAt(0);
  const affinityRaw = (birthYear * 7 + birthMonth * 13 + birthDay * 3 + templeKey * 11) % 11;
  const birthAffinity = affinityRaw - 5; // -5 ~ +5점

  // 2) 목적 태그 일치도 (30점)
  const purposeTagMap = {
    재물운: ["재물", "산신각", "칠성"],
    건강운: ["약사도량", "치유"],
    학업운: ["문수", "학업"],
    인연운: ["관음도량", "인연"],
    가정운: ["평안", "가족"],
  };
  const relevantTags = purposeTagMap[purpose] || [];
  const tagMatch = (temple.tags || []).some((t) => relevantTags.includes(t));
  const purposeScore = tagMatch ? 30 : 10;

  // 3) 접근성 (20점) - 가까울수록 高, 200km 이상이면 0점 처리
  const distance = calculateDistance(userLat, userLng, temple.lat, temple.lng);
  const distanceScore = Math.max(0, 20 - (distance / 200) * 20);

  // 4) 데이터 신뢰도 (10점)
  const trustScore = temple.verified ? 10 : 4;

  // 5) 인연 시너지항 — 잼공감(CLI)·퍼피시너지(CSI)와 동일한 비가산 시너지 수학 코어
  //    CLI_Final = CLI_linear + β·√(W_A×W_B) 구조를 인연사찰 도메인에 적용.
  //    방위와 목적이 "동시에" 강하게 맞을 때, 단순 합산이 아니라 기하평균 시너지로 증폭시켜
  //    "겹으로 맞는 인연"이 단순 합보다 더 강한 인연으로 계산되도록 함.
  const BETA = 0.35; // 시너지 가중 파라미터 (추후 실사용 데이터로 베이지안 최적화 가능)
  const synergyBangwiPurpose = Math.sqrt((bangwiScore / 40) * (purposeScore / 30)) * 100;
  const synergyBonus = BETA * synergyBangwiPurpose * 0.12; // 스케일 보정 (0~약 4.2점 가산)

  const linearScore = bangwiScore + purposeScore + distanceScore + trustScore + personalResonance + birthAffinity;
  const totalScore = linearScore + synergyBonus;

  return {
    temple,
    score: Math.round(totalScore * 10) / 10,
    detail: { bearing, templeOhaeng, bangwiScore, purposeScore, distanceScore, trustScore, synergyBonus: Math.round(synergyBonus * 10) / 10, distanceKm: Math.round(distance) },
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
function generateReason(result, targetOhaeng, purpose, personalOhaeng) {
  const { temple, detail } = result;
  const matched = detail.templeOhaeng === targetOhaeng;
  const templeWaGwa = attachJosa(temple.name, ["과", "와"]);
  const templeEunNeun = attachJosa(temple.name, ["은", "는"]);
  if (matched) {
    if (personalOhaeng && personalOhaeng === targetOhaeng) {
      // 사주 부족 오행 = 목적 오행이 일치할 때만 "사주에서 부족하여" 표현 사용
      return `사주에서 ${targetOhaeng}(${OHAENG_BANGWI[targetOhaeng]}) 기운이 부족하여, ${detail.bearing}쪽에 위치한 ${templeWaGwa} 인연이 깊은 것으로 나옵니다.`;
    } else {
      // 목적 기반 오행으로 선택: 사주 부족 오행과 무관하게 기도 목적 방위가 맞는 사찰
      return `${purpose} 기도에 적합한 방위(${detail.bearing}쪽, ${targetOhaeng}(${OHAENG_BANGWI[targetOhaeng]}) 기운)에 위치한 ${templeWaGwa} 인연이 깊은 것으로 나옵니다.`;
    }
  }
  return `${templeEunNeun} ${purpose} 목적과 관련된 특징을 지닌 사찰로 확인됩니다.`;
}

/** 메인 매칭 함수 */
function matchTemples(request, templeDB) {
  const { distribution, branches } = calculateOhaeng(request.birthInput ?? request.birthDateTime);
  const weak = findWeakOhaeng(distribution, branches);
  const targetOhaeng = PURPOSE_OHAENG[request.purpose] || weak.부족오행;

  const bi = request.birthInput ?? request.birthDateTime ?? {};
  const matchContext = {
    targetOhaeng,
    personalOhaeng: weak.부족오행,
    distribution,
    purpose: request.purpose,
    userLat: request.userLat,
    userLng: request.userLng,
    birthYear: bi.year || 2000,
    birthMonth: bi.month || 1,
    birthDay: bi.day || 1,
  };

  // 좌표 정보 없는 사찰은 방위/거리 계산이 불가하므로 매칭 대상에서 제외
  let validTemples = templeDB.filter((t) => t.lat != null && t.lng != null);

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
  const purposeBearings = Object.keys(DIR_OHAENG).filter(k => DIR_OHAENG[k] === targetOhaeng);

  const allScored = validTemples
    .map((t) => scoreTemple(t, matchContext))
    .sort((a, b) => b.score - a.score);

  // 방위 일치 사찰만 추출 (점수 순)
  const dirMatched = allScored.filter(t => purposeBearings.includes(t.detail.bearing));
  // 방위 불일치 사찰 (보충용)
  const dirOther = allScored.filter(t => !purposeBearings.includes(t.detail.bearing));

  // 방위 일치 사찰이 2개 이상이면 앞에 배치, 나머지는 일반 풀로 보충 (단일 방위 목적도 포함)
  const primaryPool = dirMatched.length >= 2
    ? [...dirMatched, ...dirOther].slice(0, 20)
    : [...dirOther.slice(0, 3), ...dirMatched, ...dirOther.slice(3)].slice(0, 20);

  // 생년월일 + 기도목적별 오프셋으로 시드 결정 → 목적마다 다른 사찰이 선택됨
  const PURPOSE_SEED_OFFSETS = { 재물운: 0, 건강운: 5, 학업운: 11, 인연운: 17, 가정운: 23, 수험합격: 29, 취업운: 37, 출산기도: 43 };
  // 오행 분포를 seed에 반영 — 음력→양력 변환 후 계산된 값이므로 같은 날짜 숫자라도 음/양력에 따라 달라짐
  const distSeed = (distribution.목||0)*3 + (distribution.화||0)*7 + (distribution.토||0)*11 + (distribution.금||0)*13 + (distribution.수||0)*17;
  const baseSeed = ((bi.year || 2000) * 367 + (bi.month || 1) * 31 + (bi.day || 1) + distSeed)
    + (PURPOSE_SEED_OFFSETS[request.purpose] || 0);
  const seed = baseSeed % Math.max(primaryPool.length, 1);
  // 중복 제거: 같은 이름의 사찰이 2번 나오지 않도록
  const seenNames = new Set();
  const scored = [];
  for (let i = 0; scored.length < 3 && i < primaryPool.length; i++) {
    const t = primaryPool[(seed + i) % primaryPool.length];
    if (!seenNames.has(t.temple.name)) {
      seenNames.add(t.temple.name);
      scored.push({ ...t, reason: generateReason(t, targetOhaeng, request.purpose, weak.부족오행) });
    }
  }

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

  return { distribution, weak, targetOhaeng, results: scored, recommendedDates, purposeGuide: PURPOSE_GUIDE[request.purpose], eightChar };
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

  const PURPOSE_SEED_OFFSETS_C = { 재물운: 0, 건강운: 5, 학업운: 11, 인연운: 17, 가정운: 23, 수험합격: 29, 취업운: 37, 출산기도: 43 };
  const coupleBase = (biA.year||2000) * 11 + (biB.year||2000) * 7 + (biA.month||1) * 31 + (biB.day||1) * 13
    + (PURPOSE_SEED_OFFSETS_C[purpose] || 0);
  const coupleSeed = coupleBase % Math.max(couplePrimaryPool.length, 1);
  const coupleSeenNames = new Set();
  const scored = [];
  for (let i = 0; scored.length < 3 && i < couplePrimaryPool.length; i++) {
    const t = couplePrimaryPool[(coupleSeed + i) % couplePrimaryPool.length];
    if (!coupleSeenNames.has(t.temple.name)) {
      coupleSeenNames.add(t.temple.name);
      scored.push({ ...t, reason: generateCoupleReason(t, targetA, targetB) });
    }
  }
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

module.exports = { matchTemples, matchCoupleTemples };
