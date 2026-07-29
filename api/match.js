// api/match.js
let _matchTemples = null;
let _TEMPLE_DB = null;
function loadDeps() {
  if (!_matchTemples) _matchTemples = require("../src/matching-engine.js").matchTemples;
  if (!_TEMPLE_DB) _TEMPLE_DB = require("../src/temple-db.full.js");
}

const WEATHER_CODE_MAP = {
  0: "맑음", 1: "대체로 맑음", 2: "구름 조금", 3: "흐림",
  45: "안개", 48: "짙은 안개",
  51: "이슬비", 53: "이슬비", 55: "강한 이슬비",
  61: "비", 63: "비", 65: "강한 비",
  71: "눈", 73: "눈", 75: "폭설",
  80: "소나기", 81: "소나기", 82: "강한 소나기",
  95: "뇌우",
};

async function fetchTempleWeather(lat, lng) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=Asia%2FSeoul`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const temp = data.current?.temperature_2m;
    const code = data.current?.weather_code;
    if (temp == null) return null;
    return { temp: Math.round(temp), condition: WEATHER_CODE_MAP[code] || "정보 없음" };
  } catch (e) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }

  try {
    loadDeps();
    const { birthDateTime, birthInput, purpose, userLat, userLng, memberUnlocked, region, maxDistanceKm } = req.body;

    if ((!birthDateTime && !birthInput) || !purpose) {
      res.status(400).json({ error: "생년월일시, 기도목적 정보가 필요합니다." });
      return;
    }

    const safeUserLat = userLat ?? 37.5665;
    const safeUserLng = userLng ?? 126.9780;

    const result = _matchTemples(
      { birthDateTime, birthInput, purpose, userLat: safeUserLat, userLng: safeUserLng, memberUnlocked: !!memberUnlocked, region: region || "", maxDistanceKm: maxDistanceKm || null },
      _TEMPLE_DB
    );

    if (result.results && result.results[0]) {
      const top = result.results[0].temple;
      const weather = await fetchTempleWeather(top.lat, top.lng);
      if (weather) result.results[0].weather = weather;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      success: true,
      disclaimer: "본 결과는 참고용 추정치이며, 정밀 사주 감정은 잼공 오라클 정식 서비스를 이용해 주세요.",
      ...result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `[${err.constructor?.name}] ${err.message}` });
  }
};
