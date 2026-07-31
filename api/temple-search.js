// api/temple-search.js — 카카오 로컬 API 사찰 키워드 검색
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const q = (req.query && req.query.q) || '';
  const region = (req.query && req.query.region) || '';
  if (!q && !region) return res.status(400).json({ error: 'q required' });

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'no kakao key' });

  // 검색어 구성: 지역 + 키워드 + "사찰"
  const keyword = [region, q, '사찰'].filter(Boolean).join(' ');

  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}&size=15&category_group_code=`;
    const r = await fetch(url, { headers: { Authorization: `KakaoAK ${apiKey}` } });
    if (!r.ok) return res.status(502).json({ error: 'kakao api error' });
    const data = await r.json();
    const places = (data.documents || []).map(d => ({
      id: 'kakao_' + d.id,
      name: d.place_name,
      address: d.road_address_name || d.address_name,
      lat: parseFloat(d.y),
      lng: parseFloat(d.x),
      phone: d.phone,
      url: d.place_url,
    }));
    return res.status(200).json({ places });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
