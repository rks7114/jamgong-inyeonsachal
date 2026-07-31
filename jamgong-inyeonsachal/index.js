/**
 * jamgong-saju-core — 잼공 사주만세력 공통 엔진 v1.0
 *
 * 잼공인연사찰의 matching-engine.js에서 사주 계산 순수 로직만 분리한 독립 모듈입니다.
 * 잼공오라클(사주/작명/궁합), 잼공궁(택일) 등 사주 계산이 필요한 모든 잼공 서비스가
 * 이 모듈 하나를 공통으로 가져다 쓰도록 설계했습니다.
 *
 * → 서비스마다 사주 계산을 각자 다시 만들면 정확도가 서비스별로 달라질 위험이 있습니다.
 *   이 모듈로 통일하면 "잼공 전 서비스가 동일한 정확도의 사주 계산을 쓴다"는 게 보장됩니다.
 *
 * 계산 방식: lunar-javascript(6tail) 기반, 절기(節氣) 기준 정밀 만세력.
 * 국내 명리 계산과 동일한 방식이며, 더미/근사 로직이 아닌 실제 계산입니다.
 */

const { Solar } = require("lunar-javascript");

// 한자 오행 → 한글 오행 변환
const HANJA_OHAENG = { 木: "목", 火: "화", 土: "토", 金: "금", 水: "수" };

/**
 * 생년월일시 → 사주 팔자(八字) 객체 산출
 * @param {string} birthDateTime - ISO 문자열 "YYYY-MM-DDTHH:mm:ss" (양력 기준)
 * @returns {object} lunar-javascript의 EightChar 객체 (getYearGan(), getYearWuXing() 등 메서드 보유)
 */
function getEightChar(birthDateTime) {
  const d = new Date(birthDateTime);
  const solar = Solar.fromYmdHms(
    d.getFullYear(), d.getMonth() + 1, d.getDate(),
    d.getHours(), d.getMinutes(), d.getSeconds() || 0
  );
  return solar.getLunar().getEightChar();
}

/**
 * 사주 8글자(4주 × 천간/지지) → 오행 분포 카운트
 * @param {string} birthDateTime
 * @returns {{목:number,화:number,토:number,금:number,수:number}}
 */
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

/** 오행 분포에서 가장 부족한(개수가 적은) 오행 도출 */
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

/**
 * 오행 캘린더: 오늘부터 daysAhead일 이내에서, 그날의 일진(日辰) 오행이
 * targetOhaeng와 일치하는 날짜를 추천일로 반환 (최대 maxResults개)
 * → 잼공궁(택일)에서도 이 함수를 그대로 재사용 가능
 */
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

module.exports = {
  getEightChar,
  calculateOhaeng,
  findWeakOhaeng,
  getRecommendedDates,
};
