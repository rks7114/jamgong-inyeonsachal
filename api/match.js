// api/match.js
// Vercel Serverless Function — 오행 매칭 API
// 프론트엔드는 이 엔드포인트만 호출하고, 사찰 DB/오행 로직은 서버에서만 실행 (데이터·로직 노출 방지)

const { matchTemples } = require("../src/matching-engine.js");

// 행정안전부_문화_전통사찰 공식 데이터 1,905건 (2026.07 정제)
const TEMPLE_DB = require("../src/temple-db.full.js");

const WEATHER_CODE_MAP = {
  0: "맑음", 1: "대체로 맑음", 2: "구름 조금", 3: "흐림",
  45: "안개", 48: "짙은 안개",
  51: "이슬비", 53: "이슬비", 55: "강한 이슬비",
  61: "비", 63: "비", 65: "강한 비",
  71: "눈", 73: "눈", 75: "폭설",
  80: "소나기", 81: "소나기", 82: "강한 소나기",
  95: "뇌우",
};

/** 1위 사찰의 실시간 날씨 조회 (Open-Meteo — 무료, API 키 불필요) */
async function fetchTempleWeather(lat, lng) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=Asia%2FSeoul`;
    const res = await fetch(url);
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
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST 요청만 허용됩니다." });
    return;
  }

  try {
    const { birthDateTime, birthInput, purpose, userLat, userLng, memberUnlocked, region, maxDistanceKm } = req.body;

    if ((!birthDateTime && !birthInput) || !purpose) {
      res.status(400).json({ error: "생년월일시, 기도목적 정보가 필요합니다." });
      return;
    }

    // 위치 정보 없으면 서울시청 기본값으로 폴백
    const safeUserLat = userLat ?? 37.5665;
    const safeUserLng = userLng ?? 126.9780;

    const result = matchTemples(
      { birthDateTime, birthInput, purpose, userLat: safeUserLat, userLng: safeUserLng, memberUnlocked: !!memberUnlocked, region: region || "", maxDistanceKm: maxDistanceKm || null },
      TEMPLE_DB
    );

    // 1위 사찰의 실시간 날씨 조회 (실패해도 전체 응답은 정상 반환)
    if (result.results && result.results[0]) {
      const top = result.results[0].temple;
      const weather = await fetchTempleWeather(top.lat, top.lng);
      if (weather) result.results[0].weather = weather;
    }

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
