// api/temple-search-slim.js — 검색용 슬림 사찰 목록 + id 단건 상세 조회
//
// 배경: /api/temple-list는 전체 필드 3.65MB를 내려보내지만, 클라이언트 검색은
// name/address/history만 스캔한다 (id는 중복 제거·클릭 식별용).
// history는 전체의 5.9%(0.215MB)뿐이라 포함해도 슬림 응답이 1.14MB(gzip 367KB)로,
// 연혁 검색과 스니펫 표시를 왕복 없이 유지할 수 있다.
//
// - GET /api/temple-search-slim        → [{id, name, address, history?}] 전체 목록
// - GET /api/temple-search-slim?id=X   → 해당 id의 전체 레코드 1건 (상세 페이지용)
//   같은 id의 중복 레코드(3,484건 존재)는 첫 번째 것을 반환 — 검색 dedup과 동일 규칙.
const TEMPLE_DB = require("../src/temple-db.full.js");

let _slimCache = null; // 웜 인스턴스에서 요청마다 17,497건 재매핑 방지
function getSlim() {
  if (!_slimCache) {
    _slimCache = TEMPLE_DB.map((t) => {
      const s = { id: t.id, name: t.name, address: t.address };
      if (t.history) s.history = t.history;
      return s;
    });
  }
  return _slimCache;
}

let _byIdCache = null;
function getById(id) {
  if (!_byIdCache) {
    _byIdCache = new Map();
    for (const t of TEMPLE_DB) {
      if (t.id != null && !_byIdCache.has(t.id)) _byIdCache.set(t.id, t);
    }
  }
  return _byIdCache.get(id) || null;
}

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=86400");

  const id = req.query && req.query.id;
  if (id) {
    const temple = getById(String(id));
    if (!temple) {
      res.statusCode = 404;
      res.json({ error: "temple not found", id: String(id) });
      return;
    }
    res.json(temple);
    return;
  }

  res.json(getSlim());
};
