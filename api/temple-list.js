// api/temple-list.js — 사찰 목록 반환 (검색용, 이름+주소만)
const TEMPLE_DB = require("../src/temple-db.full.js");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=86400");
  const list = TEMPLE_DB.map(t => ({
    id: t.id,
    name: t.name,
    address: t.address || ""
  }));
  res.json(list);
};
