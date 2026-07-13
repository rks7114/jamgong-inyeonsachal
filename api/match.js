// api/match.js
// Vercel Serverless Function — 오행 매칭 API
// 프론트엔드는 이 엔드포인트만 호출하고, 사찰 DB/오행 로직은 서버에서만 실행 (데이터·로직 노출 방지)

const { matchTemples } = require("../src/matching-engine.js");

// 행정안전부_문화_전통사찰 공식 데이터 1,905건 (2026.07 정제)
const TEMPLE_DB = require("../src/temple-db.full.js");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST 요청만 허용됩니다." });
    return;
  }

  try {
    const { birthDateTime, purpose, userLat, userLng, memberUnlocked } = req.body;

    if (!birthDateTime || !purpose || userLat == null || userLng == null) {
      res.status(400).json({ error: "생년월일시, 기도목적, 위치 정보가 모두 필요합니다." });
      return;
    }

    const result = matchTemples(
      { birthDateTime, purpose, userLat, userLng, memberUnlocked: !!memberUnlocked },
      TEMPLE_DB
    );

    res.status(200).json({
      success: true,
      disclaimer: "본 결과는 참고용 추정치이며, 정밀 사주 감정은 잼공 오라클 정식 서비스를 이용해 주세요.",
      ...result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "매칭 처리 중 오류가 발생했습니다." });
  }
};
