// api/geocode.js
// Vercel Serverless Function — 주소 텍스트를 좌표로 변환 (카카오 로컬 API)
// 사용자가 "현재 위치" 칸에 직접 입력한 주소를 실제 위경도로 바꿔주는 용도.

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST 요청만 허용됩니다." });
    return;
  }

  const { address } = req.body;
  if (!address || !address.trim()) {
    res.status(400).json({ error: "주소를 입력해주세요." });
    return;
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    // 키 미설정 시 서비스 전체가 죽지 않도록 안전하게 실패 응답만 반환
    res.status(200).json({ success: false, reason: "지오코딩 키 미설정" });
    return;
  }

  try {
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
    const kakaoRes = await fetch(url, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
    });

    if (!kakaoRes.ok) {
      res.status(200).json({ success: false, reason: "카카오 API 응답 오류" });
      return;
    }

    const data = await kakaoRes.json();
    if (!data.documents || data.documents.length === 0) {
      res.status(200).json({ success: false, reason: "주소를 찾을 수 없습니다." });
      return;
    }

    const doc = data.documents[0];
    res.status(200).json({
      success: true,
      lat: parseFloat(doc.y),
      lng: parseFloat(doc.x),
      matchedAddress: doc.address_name,
    });
  } catch (err) {
    console.error(err);
    res.status(200).json({ success: false, reason: "지오코딩 처리 중 오류" });
  }
};
