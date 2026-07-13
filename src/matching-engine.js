/**
 * 잼공인연사찰 - 오행 매칭 엔진 프로토타입 v1.0
 * 클(수석실장) 작성
 *
 * 주의: 사주 오행 계산은 간략화 버전입니다.
 * 실제 서비스에서는 정확한 만세력 라이브러리(예: KASI 음양력 API, lunar-javascript 등)로 교체 필요.
 */

const OHAENG_BANGWI = {
  목: "동", 화: "남", 토: "중앙", 금: "서", 수: "북",
};

const PURPOSE_OHAENG = {
  재물운: "금",
  건강운: "토",
  학업운: "수",
  인연운: "화",
  가정운: "목",
};

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
};

const { Solar, Lunar } = require("lunar-javascript");

const HANJA_OHAENG = { 木: "목", 火: "화", 土: "토", 金: "금", 水: "수" };

function getEightChar(birthInput) {
  if (typeof birthInput === "string") {
    const d = new Date(birthInput);
    const solar = Solar.fromYmdHms(
      d.getFullYear(), d.getMonth() + 1, d.getDate(),
      d.getHours(), d.getMinutes(), d.getSeconds() || 0
    );
    return solar.getLunar().getEightChar();
  }

  const { calendarType, year, month, day, hour = 12, minute = 0, isLeapMonth = false } = birthInput;

  if (calendarType === "lunar") {
    const lunarDateOnly = Lunar.fromYmd(year, isLeapMonth ? -month : month, day);
    const correspondingSolar = lunarDateOnly.getSolar();
    const preciseSolar = Solar.fromYmdHms(
      correspondingSolar.getYear(), correspondingSolar.getMonth(), correspondingSolar.getDay(),
      hour, minute, 0
    );
    return preciseSolar.getLunar().getEightChar();
  }

  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  return solar.getLunar().getEightChar();
}

function getRecommendedDates(targetOhaeng, daysAhead = 30, maxResults = 5) {
  const results = [];
  const today = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const solar = Solar.fromYmdHms(d.getFullYear(), d.getMonth() + 1, d.getDate(), 12, 0, 0);
    const bazi = solar.getLunar().getEightChar();
    const dayWuXing = bazi.getDayWuXing();
    const dayElements = [...dayWuXing].map((h) => HANJA_OHAENG[h]).filter(Boolean);

    if (dayElements.includes(targetOhaeng)) {
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      results.push({ date: dateStr, dayOhaeng: dayElements.join("") });
    }
    if (results.length >= maxResults) break;
  }
  return results;
}

function calculateOhaeng(birthDateTime) {
  const bazi = getEightChar(birthDateTime);
  const dist = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  [bazi.getYearWuXing(), bazi.getMonthWuXing(), bazi.getDayWuXing(), bazi.getTimeWuXing()]
    .forEach((pair) => {
      [...pair].forEach((hanja) => {
        const element = HANJA_OHAENG[hanja];
        if (element) dist[element]++;
      });
    });

  return dist;
}

function findWeakOhaeng(distribution) {
  let weakest = null;
  let minCount = Infinity;
  for (const [element, count] of Object.entries(distribution)) {
    if (count < minCount) {
      minCount = count;
      weakest = element;
    }
  }
  return { 부족오행: weakest, 근거: `사주 8글자 중 ${weakest}(${minCount}개)이 가장 약함` };
}

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

function bearingToOhaeng(bearing) {
  const map = {
    동: "목", 동북: "목", 북: "수", 남서: "토",
    남: "화", 동남: "화", 서: "금", 북서: "금",
  };
  return map[bearing] || "토";
}

function scoreTemple(temple, matchContext) {
  const { targetOhaeng, purpose, userLat, userLng } = matchContext;

  const bearing = calculateBearing(userLat, userLng, temple.lat, temple.lng);
  const templeOhaeng = bearingToOhaeng(bearing);
  const bangwiScore = templeOhaeng === targetOhaeng ? 40 : 15;

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

  const distance = calculateDistance(userLat, userLng, temple.lat, temple.lng);
  const distanceScore = Math.max(0, 20 - (distance / 200) * 20);

  const trustScore = temple.verified ? 10 : 4;

  const BETA = 0.35;
  const synergyBangwiPurpose = Math.sqrt((bangwiScore / 40) * (purposeScore / 30)) * 100;
  const synergyBonus = BETA * synergyBangwiPurpose * 0.12;

  const linearScore = bangwiScore + purposeScore + distanceScore + trustScore;
  const totalScore = linearScore + synergyBonus;

  return {
    temple,
    score: Math.round(totalScore * 10) / 10,
    detail: { bearing, templeOhaeng, bangwiScore, purposeScore, distanceScore, trustScore, synergyBonus: Math.round(synergyBonus * 10) / 10, distanceKm: Math.round(distance) },
  };
}

function attachJosa(word, [withBatchim, withoutBatchim]) {
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return word + withoutBatchim;
  const hasBatchim = (code - 0xac00) % 28 !== 0;
  return word + (hasBatchim ? withBatchim : withoutBatchim);
}

function generateReason(result, targetOhaeng, purpose) {
  const { temple, detail } = result;
  const matched = detail.templeOhaeng === targetOhaeng;
  const templeWaGwa = attachJosa(temple.name, ["과", "와"]);
  const templeEunNeun = attachJosa(temple.name, ["은", "는"]);
  if (matched) {
    return `사주에서 ${targetOhaeng}(${OHAENG_BANGWI[targetOhaeng]}) 기운이 부족하여, ${detail.bearing}쪽에 위치한 ${templeWaGwa} 인연이 깊은 것으로 나옵니다.`;
  }
  return `${templeEunNeun} ${purpose} 목적과 관련된 특징을 지닌 사찰로 확인됩니다.`;
}

function matchTemples(request, templeDB) {
  const distribution = calculateOhaeng(request.birthInput ?? request.birthDateTime);
  const weak = findWeakOhaeng(distribution);
  const targetOhaeng = PURPOSE_OHAENG[request.purpose] || weak.부족오행;

  const matchContext = {
    targetOhaeng,
    purpose: request.purpose,
    userLat: request.userLat,
    userLng: request.userLng,
  };

  const validTemples = templeDB.filter((t) => t.lat != null && t.lng != null);

  const scored = validTemples
    .map((t) => scoreTemple(t, matchContext))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => ({ ...r, reason: generateReason(r, targetOhaeng, request.purpose) }));

  const calendarCount = request.memberUnlocked ? 15 : 3;
  const recommendedDates = getRecommendedDates(targetOhaeng, 45, calendarCount);

  return { distribution, weak, targetOhaeng, results: scored, recommendedDates, purposeGuide: PURPOSE_GUIDE[request.purpose] };
}

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
    const label = targetA === targetB ? targetA : `${targetA}·${targetB}`;
    return `두 분 모두에게 필요한 기운(${label})과 방향이 겹치는 ${templeWaGwa} 인연이 깊은 것으로 나옵니다.`;
  }
  return `${templeWaGwa} 두 분의 사주를 함께 고려했을 때 인연이 확인되는 사찰입니다.`;
}

function matchCoupleTemples(request, templeDB) {
  const { birthInputA, birthInputB, purpose, userLat, userLng, memberUnlocked } = request;

  const distributionA = calculateOhaeng(birthInputA);
  const distributionB = calculateOhaeng(birthInputB);
  const targetA = PURPOSE_OHAENG[purpose] || findWeakOhaeng(distributionA).부족오행;
  const targetB = PURPOSE_OHAENG[purpose] || findWeakOhaeng(distributionB).부족오행;

  const ctxA = { targetOhaeng: targetA, purpose, userLat, userLng };
  const ctxB = { targetOhaeng: targetB, purpose, userLat, userLng };

  const validTemples = templeDB.filter((t) => t.lat != null && t.lng != null);

  const scored = validTemples
    .map((t) => scoreTempleForCouple(t, ctxA, ctxB))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => ({ ...r, reason: generateCoupleReason(r, targetA, targetB) }));

  const calendarCount = memberUnlocked ? 15 : 3;

  return {
    distribution: distributionA,
    targetOhaeng: targetA,
    distributionA, distributionB, targetA, targetB,
    results: scored,
    recommendedDates: getRecommendedDates(targetA, 45, calendarCount),
    purposeGuide: PURPOSE_GUIDE[request.purpose],
  };
}

module.exports = { matchTemples, matchCoupleTemples, calculateOhaeng, findWeakOhaeng, scoreTemple, getRecommendedDates };
