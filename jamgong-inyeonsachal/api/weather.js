// api/weather.js
// Vercel Serverless Function — 좌표 기반 실시간 날씨 조회 (Open-Meteo, 키 불필요)
// 사찰 상세페이지에서 순위와 상관없이 그 사찰의 날씨를 온디맨드로 가져오는 용도.

const WEATHER_CODE_MAP = {
  0: "맑음", 1: "대체로 맑음", 2: "구름 조금", 3: "흐림",
  45: "안개", 48: "짙은 안개",
  51: "이슬비", 53: "이슬비", 55: "강한 이슬비",
  61: "비", 63: "비", 65: "강한 비",
  71: "눈", 73: "눈", 75: "폭설",
  80: "소나기", 81: "소나기", 82: "강한 소나기",
  95: "뇌우",
};

module.exports = async function handler(req, res) {
  const { lat, lng } = req.query || {};
  if (!lat || !lng) {
    res.status(400).json({ success: false, error: "lat, lng가 필요합니다." });
    return;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=Asia%2FSeoul`;
    const weatherRes = await fetch(url);
    if (!weatherRes.ok) {
      res.status(200).json({ success: false });
      return;
    }
    const data = await weatherRes.json();
    const temp = data.current?.temperature_2m;
    const code = data.current?.weather_code;
    if (temp == null) {
      res.status(200).json({ success: false });
      return;
    }
    res.status(200).json({
      success: true,
      temp: Math.round(temp),
      condition: WEATHER_CODE_MAP[code] || "정보 없음",
    });
  } catch (err) {
    res.status(200).json({ success: false });
  }
};
