#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
make_authornote.py — '저자 한마디'를 낱장 PDF로 굽는다

왜 따로 만드는가.
이 글은 홍보와 소개에 자주 쓰인다. 그런데 본문에서 잘라내기만 하면
흰 종이에 글자만 얹힌 꼴이 된다 — 책이 아니라 인쇄물로 보인다.

책장처럼 보이게 하는 것은 글자체가 아니라 **글자 아닌 것들**이다.

  · 종이색      순백은 화면의 색이지 종이의 색이 아니다
  · 판면        여백이 넓어야 글이 앉는다
  · 머리말      쪽 위에 책 이름이 있어야 '어느 책의 한 장'이 된다
  · 쪽번호      번호가 없으면 낱장이다
  · 첫 글자     들여 쓴 큰 첫 글자는 '여기서 글이 시작한다'는 표지다

머리말과 쪽번호는 CSS로 못 넣는다. 크로미움이 @page 여백 상자를
지원하지 않아서다. 그래서 다 구운 뒤에 직접 찍는다. 한글을 찍으려면
서체를 심어야 하므로, 머리말은 표지에도 쓴 로마자 제자(題字)를 쓴다.

사용:
    python ebook/make_authornote.py
    python ebook/make_authornote.py -o /어딘가/저자한마디.pdf
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "ebook"))
from build_epub import AUTHOR, PUBLISHER, SUBTITLE, TITLE, render_blocks  # noqa: E402
from build_pdf import find_browser  # noqa: E402

SRC = ROOT / "ebook" / "appendix" / "부록G-저자소개와판권.md"
RUNNING_HEAD = "JAMGONG INYEONSACHAL"

PAGE_W, PAGE_H = 148.0, 210.0          # A5 (mm)
MM = 72.0 / 25.4                        # mm → pt

CSS = """
@page { size: 148mm 210mm; margin: 24mm 20mm 26mm; }

html, body {
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
  margin: 0; padding: 0;
}
/* 배경을 칠하지 않는다. 종이는 PDF 단계에서 밑에 깐다 —
   여기서 칠하면 그 단색이 종이결과 책등 그늘을 덮어 버린다. */
body {
  color: #1a1714;
  font-family: "NanumMyeongjo", "Nanum Myeongjo", "UnBatang",
               "Batang", serif;
  font-size: 10.4pt;
  line-height: 1.85;
  text-align: justify;
  word-break: normal;
  hyphens: none;
}

/* 표제 — 쪽 위에 붙이지 않고 한 뼘 내려 앉힌다 */
.opener { padding-top: 14mm; margin-bottom: 12mm; text-align: center; }
.opener .orn {
  font-size: .95rem; letter-spacing: .9em; color: #9a8f7d;
  margin-bottom: 6mm;
}
.opener h1 {
  font-size: 1.4rem; font-weight: 400; letter-spacing: .02em;
  line-height: 1.5; margin: 0 0 5mm; border: 0; padding: 0;
}
.opener .rule {
  width: 26mm; height: 0; margin: 0 auto;
  border-top: .6pt solid #6b6255;
}

p { margin: 0; text-indent: 1em; }
p:first-of-type { text-indent: 0; }

/* 첫 글자를 키운다. 글이 시작하는 자리를 눈이 먼저 찾는다. */
.lead::first-letter {
  float: left; font-size: 3.05em; line-height: .84;
  padding: .06em .1em 0 0; color: #3b3228;
}

strong { font-weight: 700; color: #12100d; }
em { font-style: normal; }
a { color: inherit; text-decoration: none; }

blockquote { margin: 1.4em 0 1.4em 1.1em; padding-left: 1.1em;
             border-left: .8pt solid #b9ae9a; font-size: .96em; }
hr { border: 0; margin: 2em 0; text-align: center; }
hr::after { content: "· · ·"; letter-spacing: .55em; color: #9a8f7d; }

.sign { margin-top: 10mm; text-align: right; line-height: 1.9; }
.sign .d { font-size: .92em; color: #5c5346; }
.sign .n { font-size: 1.05em; letter-spacing: .06em; }

p, li { orphans: 2; widows: 2; }
"""


def extract() -> str:
    lines = SRC.read_text(encoding="utf-8").splitlines()
    i = next(n for n, l in enumerate(lines) if l.startswith("### 저자 한마디"))
    j = next(n for n, l in enumerate(lines) if l.startswith("## 이 책에 대하여"))
    body = lines[i + 1:j]
    md = "\n".join(body)
    md = re.sub(r"<!--\s*/?SO\s*-->", "", md)      # 판본 표시 제거
    return md.strip()


def build_html(md: str) -> str:
    # 맺음말(날짜·서명)은 따로 조판한다 — 본문 흐름과 다른 자리다
    parts = md.split("\n")
    sign_at = next((n for n, l in enumerate(parts)
                    if l.startswith("*2026년")), len(parts))
    body_md = "\n".join(parts[:sign_at]).strip()
    sign_md = [l.strip("*") for l in parts[sign_at:] if l.strip()]
    sign_md = [l.strip("*").strip() for l in sign_md]

    body = render_blocks(body_md.splitlines())
    # 첫 문단에 큰 첫 글자
    body = body.replace("<p>", '<p class="lead">', 1)

    sign = ""
    if sign_md:
        sign = ('<div class="sign">'
                + "".join(f'<div class="d">{s}</div>' for s in sign_md[:-1])
                + f'<div class="n">{sign_md[-1]}</div></div>')

    return f"""<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"/>
<title>저자 한마디 — {TITLE}</title><style>{CSS}</style></head><body>
<div class="opener">
  <div class="orn">❖</div>
  <h1>저자 한마디<br/>소문을 끄고, 데이터를 켜다</h1>
  <div class="rule"></div>
</div>
{body}{sign}
</body></html>"""


def paper_texture(gutter: str, dpi: int = 200) -> bytes:
    """종이 한 장을 그린다. JPEG 바이트로 돌려준다.

    진짜 책을 복사하면 세 가지가 같이 딸려 온다.
      ① 종이의 결   — 고른 색이 아니라 아주 미세한 얼룩이 있다
      ② 책등 그늘   — 안쪽으로 갈수록 어두워진다. 펼친 책은 평평하지 않다
      ③ 바깥 그늘   — 책배 쪽 가장자리가 아주 조금 어둡다
    이 셋이 없으면 아무리 잘 짜도 '화면에 띄운 글'로 보인다.
    """
    from PIL import Image, ImageFilter
    import random

    w = int(PAGE_W / 25.4 * dpi)
    h = int(PAGE_H / 25.4 * dpi)
    base = (250, 246, 237)

    rnd = random.Random(20260811)          # 판마다 같은 종이가 나오도록
    px = bytearray()
    for _ in range(w * h):
        n = rnd.gauss(0, 2.6)
        px += bytes((max(0, min(255, int(base[0] + n))),
                     max(0, min(255, int(base[1] + n))),
                     max(0, min(255, int(base[2] + n * 0.85)))))
    img = Image.frombytes("RGB", (w, h), bytes(px))
    img = img.filter(ImageFilter.GaussianBlur(0.6))   # 결이 너무 거칠지 않게

    # 그늘 — 곱하기로 얹는다
    shade = Image.new("L", (w, h), 255)
    sp = shade.load()
    gut_w = int(19 / 25.4 * dpi)            # 책등 그늘 폭 19mm
    edge_w = int(6 / 25.4 * dpi)            # 책배 그늘 폭 6mm
    for x in range(w):
        v = 255.0
        d = x if gutter == "left" else (w - 1 - x)
        if d < gut_w:                        # 안쪽 — 깊고 부드럽게
            t = 1.0 - d / gut_w
            v -= 34.0 * (t ** 2.1)
        e = (w - 1 - x) if gutter == "left" else x
        if e < edge_w:                       # 바깥 — 얕게
            v -= 9.0 * (1.0 - e / edge_w) ** 1.6
        for y in range(h):
            sp[x, y] = int(v)
    shade = shade.filter(ImageFilter.GaussianBlur(dpi / 60))

    # 곱하기 합성 — 종이 결 위에 그늘을 얹는다.
    # composite(a, b, m) = a·m + b·(1−m) 이므로 b를 검정으로 두면 곱하기다.
    dark = Image.new("L", (w, h), 0)
    img = Image.merge("RGB", [Image.composite(ch, dark, shade)
                              for ch in img.split()])

    import io
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=86, optimize=True)
    return buf.getvalue()


def background_pdf(tmp: Path, gutter: str) -> Path:
    """종이 한 장짜리 PDF. 본문 밑에 깔린다."""
    import base64
    jpg = base64.b64encode(paper_texture(gutter)).decode("ascii")
    html = tmp / f"paper-{gutter}.html"
    html.write_text(
        "<!doctype html><meta charset='utf-8'>"
        f"<style>@page{{size:{PAGE_W}mm {PAGE_H}mm;margin:0}}"
        "html,body{margin:0;padding:0}"
        f"img{{display:block;width:{PAGE_W}mm;height:{PAGE_H}mm}}</style>"
        f"<img src='data:image/jpeg;base64,{jpg}'>", encoding="utf-8")
    out = tmp / f"paper-{gutter}.pdf"
    subprocess.run(
        [str(find_browser()), "--headless", "--disable-gpu", "--no-sandbox",
         "--no-pdf-header-footer", f"--print-to-pdf={out}", html.as_uri()],
        capture_output=True, text=True, timeout=180)
    return out


def stamp(pdf: Path) -> int:
    """머리말과 쪽번호를 찍는다. 종이색도 쪽 전체에 깐다."""
    from pypdf import PdfReader, PdfWriter  # noqa: F401
    from pypdf.generic import (ArrayObject, DecodedStreamObject,
                               DictionaryObject, NameObject)

    w = PdfWriter(clone_from=str(pdf))
    font = DictionaryObject({
        NameObject("/Type"): NameObject("/Font"),
        NameObject("/Subtype"): NameObject("/Type1"),
        NameObject("/BaseFont"): NameObject("/Times-Roman"),
    })
    fref = w._add_object(font)

    for i, page in enumerate(w.pages):
        box = page.mediabox
        pw, ph = float(box.width), float(box.height)

        res = page[NameObject("/Resources")].get_object()
        fonts = res.get("/Font")
        if fonts is None:
            fonts = DictionaryObject()
            res[NameObject("/Font")] = fonts
        else:
            fonts = fonts.get_object()
        fonts[NameObject("/JMHead")] = fref

        ops = []
        # 쪽번호 — 밑에서 13mm, 가운데
        label = str(i + 1)
        ops.append(f"q BT /JMHead 9 Tf .28 .25 .21 rg 1 0 0 1 "
                   f"{pw/2 - 9*0.5*len(label)/2:.2f} {13*MM:.2f} Tm "
                   f"({label}) Tj ET Q")
        # 머리말 — 둘째 쪽부터. 첫 쪽은 표제가 그 자리를 쓴다.
        if i > 0:
            size, track = 7.0, 2.6
            width = sum(0.722 if c != " " else 0.25 for c in RUNNING_HEAD) * size \
                + track * (len(RUNNING_HEAD) - 1)
            ops.append(f"q BT /JMHead {size} Tf .55 .50 .43 rg {track} Tc "
                       f"1 0 0 1 {pw/2 - width/2:.2f} {ph - 15*MM:.2f} Tm "
                       f"({RUNNING_HEAD}) Tj ET Q")
            ops.append(f"q .78 .74 .66 RG .3 w "
                       f"{pw/2 - 18*MM:.2f} {ph - 17.6*MM:.2f} m "
                       f"{pw/2 + 18*MM:.2f} {ph - 17.6*MM:.2f} l S Q")

        st = DecodedStreamObject()
        st.set_data(("\n".join(ops) + "\n").encode("ascii"))
        ref = w._add_object(st)

        pre = DecodedStreamObject(); pre.set_data(b"q\n")
        post = DecodedStreamObject(); post.set_data(b"Q\n")
        cur = page.get(NameObject("/Contents"))
        old = list(cur) if isinstance(cur.get_object(), ArrayObject) else [cur]
        page[NameObject("/Contents")] = ArrayObject(
            [w._add_object(pre), *old, w._add_object(post), ref])

    # 종이를 본문 밑에 깐다. 홀수 쪽은 책등이 왼쪽, 짝수 쪽은 오른쪽이다 —
    # 펼친 책을 넘길 때 그늘이 좌우로 번갈아 오는 것이 자연스럽다.
    with tempfile.TemporaryDirectory() as td:
        papers = {g: PdfReader(str(background_pdf(Path(td), g))).pages[0]
                  for g in ("left", "right")}
        for i, page in enumerate(w.pages):
            page.merge_page(papers["left" if i % 2 == 0 else "right"],
                            over=False)

    w.add_metadata({"/Title": f"저자 한마디 — {TITLE}",
                    "/Author": AUTHOR, "/Subject": SUBTITLE})
    with open(pdf, "wb") as f:
        w.write(f)
    return len(w.pages)


def main() -> None:
    ap = argparse.ArgumentParser(description="'저자 한마디' 낱장 PDF")
    ap.add_argument("-o", "--out", type=Path,
                    default=ROOT / "ebook" / "dist" / "저자한마디.pdf")
    a = ap.parse_args()
    a.out.parent.mkdir(parents=True, exist_ok=True)

    html = build_html(extract())
    with tempfile.TemporaryDirectory() as td:
        src = Path(td) / "note.html"
        src.write_text(html, encoding="utf-8")
        r = subprocess.run(
            [str(find_browser()), "--headless", "--disable-gpu", "--no-sandbox",
             "--no-pdf-header-footer", f"--print-to-pdf={a.out}", src.as_uri()],
            capture_output=True, text=True, timeout=180)
    if not a.out.exists():
        sys.stderr.write(r.stderr[-1500:] + "\n")
        raise SystemExit("[error] PDF 생성 실패")

    pages = stamp(a.out)
    data = a.out.read_bytes()
    fonts = sorted({m.decode().split("+")[-1] for m in
                    re.findall(rb"/BaseFont\s*/([A-Za-z0-9+\-,._]+)", data)})
    print(f"[ok] {a.out}  ({len(data):,} bytes, {pages}쪽)")
    print(f"  · 서체 {', '.join(fonts)}")
    bad = [f for f in fonts if "WenQuanYi" in f or "Unifont" in f]
    if bad:
        print(f"  ⚠ 한글이 대체 서체로 박혔습니다: {', '.join(bad)}")


if __name__ == "__main__":
    main()
