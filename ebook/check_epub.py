#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_epub.py — EPUB이 유통사 심사를 통과할 형태인지 본다

리디·교보·부크크는 규격에 어긋난 파일을 반려한다. 반려되면 원고가 아무리
좋아도 며칠이 날아간다. epubcheck(자바)이 없는 환경이라, 실제로 반려 사유가
되는 항목만 골라 직접 검사한다.

보는 것
  · mimetype 이 첫 항목이고 무압축인가            ← 가장 흔한 반려 사유
  · container.xml 이 가리키는 OPF 가 실재하는가
  · 필수 메타데이터 (title·creator·language·identifier·date)
  · manifest 에 적힌 파일이 전부 들어 있는가
  · 패키지 안의 파일이 전부 manifest 에 적혀 있는가
  · spine 이 manifest 항목만 가리키는가
  · 표지가 cover-image 속성으로 지정되어 있는가
  · nav 문서(EPUB3)와 NCX(EPUB2 하위호환)가 있는가
  · 모든 XHTML 이 파싱되는가
  · 본문이 참조하는 이미지·CSS 가 실재하는가

사용:
    python ebook/check_epub.py                       # dist 안의 EPUB 전부
    python ebook/check_epub.py path/to/book.epub
"""
from __future__ import annotations

import argparse
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "ebook" / "dist"

NS = {
    "c": "urn:oasis:names:tc:opendocument:xmlns:container",
    "o": "http://www.idpf.org/2007/opf",
    "d": "http://purl.org/dc/elements/1.1/",
}


def check_one(path: Path) -> list[str]:
    """반려 사유가 될 만한 것만 모아 돌려준다. 빈 리스트면 통과."""
    bad: list[str] = []
    try:
        z = zipfile.ZipFile(path)
    except zipfile.BadZipFile:
        return ["ZIP 으로 열리지 않는다"]

    names = z.namelist()

    # ── mimetype — 반려 1순위
    if not names or names[0] != "mimetype":
        bad.append("mimetype 이 첫 항목이 아니다")
    elif z.getinfo("mimetype").compress_type != zipfile.ZIP_STORED:
        bad.append("mimetype 이 압축되어 있다 (무압축이어야 한다)")
    elif z.read("mimetype") != b"application/epub+zip":
        bad.append("mimetype 내용이 application/epub+zip 이 아니다")

    # ── container → OPF
    if "META-INF/container.xml" not in names:
        return bad + ["META-INF/container.xml 이 없다"]
    root = ET.fromstring(z.read("META-INF/container.xml"))
    rf = root.find(".//c:rootfile", NS)
    opf_path = rf.get("full-path") if rf is not None else None
    if not opf_path or opf_path not in names:
        return bad + [f"container 가 가리키는 OPF 가 없다: {opf_path}"]

    opf = ET.fromstring(z.read(opf_path))
    base = opf_path.rsplit("/", 1)[0] + "/" if "/" in opf_path else ""

    # ── 필수 메타데이터
    for tag in ("title", "creator", "language", "identifier", "date"):
        if opf.find(f".//d:{tag}", NS) is None:
            bad.append(f"dc:{tag} 가 없다")

    ident = opf.find(".//d:identifier", NS)
    if ident is not None and ident.text and "uuid:" in ident.text:
        bad.append(f"식별자가 임시 UUID 다 — ISBN 이 나오면 교체할 것 ({ident.text})")

    # ── manifest ↔ 실제 파일
    manifest = {}
    for it in opf.findall(".//o:manifest/o:item", NS):
        href = unquote(it.get("href", ""))
        manifest[it.get("id")] = (base + href, it.get("media-type", ""), it.get("properties", ""))
    missing = [h for _, (h, _, _) in manifest.items() if h not in names]
    if missing:
        bad.append(f"manifest 에 적혔으나 파일이 없다: {missing[:3]}")

    listed = {h for _, (h, _, _) in manifest.items()}
    orphan = [n for n in names
              if n not in listed
              and n not in ("mimetype", "META-INF/container.xml", opf_path)
              and not n.endswith("/")]
    if orphan:
        bad.append(f"파일은 있으나 manifest 에 없다: {orphan[:3]}")

    # ── spine
    for ref in opf.findall(".//o:spine/o:itemref", NS):
        if ref.get("idref") not in manifest:
            bad.append(f"spine 이 없는 항목을 가리킨다: {ref.get('idref')}")

    # ── 표지 · 목차
    if not any("cover-image" in p for _, _, p in manifest.values()):
        bad.append("cover-image 속성을 가진 항목이 없다 (표지 미지정)")
    if not any("nav" in p.split() for _, _, p in manifest.values()):
        bad.append("nav 문서가 없다 (EPUB3 필수)")
    if not any(m == "application/x-dtbncx+xml" for _, m, _ in manifest.values()):
        bad.append("NCX 가 없다 (구형 단말 하위호환)")

    # ── XHTML 파싱 · 참조 자원
    for _, (href, mtype, _) in manifest.items():
        if "html" not in mtype or href not in names:
            continue
        raw = z.read(href)
        try:
            ET.fromstring(raw)
        except ET.ParseError as e:
            bad.append(f"{href} 파싱 실패 — {e}")
            continue
        folder = href.rsplit("/", 1)[0] + "/" if "/" in href else ""
        for m in re.finditer(rb'(?:src|href)="([^"#:]+)"', raw):
            tgt = unquote(m.group(1).decode())
            if tgt.startswith(("http", "mailto", "data:")):
                continue
            full = folder + tgt
            while "/../" in full:
                full = re.sub(r"[^/]+/\.\./", "", full, count=1)
            if full not in names:
                bad.append(f"{href} 가 없는 파일을 참조한다: {tgt}")
    return bad


def main() -> None:
    ap = argparse.ArgumentParser(description="EPUB 규격 점검")
    ap.add_argument("files", nargs="*", type=Path)
    a = ap.parse_args()

    files = a.files or sorted(DIST.glob("*.epub"))
    if not files:
        raise SystemExit("[error] 검사할 EPUB 이 없습니다.")

    worst = 0
    for f in files:
        bad = check_one(f)
        print(f"\n{f.name}")
        if not bad:
            print("  ✓ 반려 사유 없음")
            continue
        for b in bad:
            fatal = not b.startswith("식별자가 임시")
            worst = max(worst, 1 if fatal else 0)
            print(f"  {'✗' if fatal else '⚠'} {b}")
    print()
    sys.exit(worst)


if __name__ == "__main__":
    main()
