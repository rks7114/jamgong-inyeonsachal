// api/match-couple.js
// Vercel Serverless Function — 궁합 사찰 매칭 API

const { matchCoupleTemples } = require("../src/matching-engine.js");
const TEMPLE_DB = require("../src/temple-db.full.js");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST 요청만 허용됩니다." });
    return;
  }

  try {
    const { birthInputA, birthInputB, purpose, userLat, userLng, memberUnlocked } = req.body;

    if (!birthInputA || !birthInputB || !purpose || userLat == null || userLng == null) {
      res.status(400).json({ error: "두 사람의 생년월일시, 기도목적, 위치 정보가 모두 필요합니다." });
      return;
    }

    const result = matchCoupleTemples(
      { birthInputA, birthInputB, purpose, userLat, userLng, memberUnlocked: !!memberUnlocked },
      TEMPLE_DB
    );

    res.status(200).json({
      success: true,
      disclaimer: "본 결과는 참고용 추정치이며, 정밀 사주 감정은 잼공 오라클 정식 서비스를 이용해 주세요.",
      ...result,
    });
  } catch (err) {
    console.error("궁합 매칭 오류:", err);
    res.status(500).json({ error: "매칭 처리 중 오류가 발생했습니다." });
  }
};
