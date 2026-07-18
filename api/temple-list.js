// api/temple-list.js — 사찰 전체 데이터 반환 (검색 + 상세페이지용)
const TEMPLE_DB = require("../src/temple-db.full.js");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.json(TEMPLE_DB);
};
