#!/usr/bin/env python3
"""Genera il payload use_figma che compila la Cover del file Figma di progetto.

Uso:
  build_cover.py <project.md>          payload che scrive
  build_cover.py <project.md> --dry    payload che NON scrive: restituisce prima/dopo di ogni riga

Legge da project.md: progetto, testata/testate, tipologia, owner e, dalla sezione Link, i link http
(Planner, FigJam, Product Snapshot, Riferimento online). Stampa il codice da passare a use_figma.
"""
import json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LABELS = [("planner", "Planner"), ("figjam", "Ricerca (FigJam)"), ("figma flow", "User flow (FigJam)"), ("product snapshot", "Product Snapshot"), ("riferimento online", "Riferimento online")]


def frontmatter(md):
    m = re.match(r"^---\n(.*?)\n---", md, re.S)
    out = {}
    for line in (m.group(1) if m else "").splitlines():
        k, _, v = line.partition(":")
        if k.strip() and _:
            out[k.strip()] = re.sub(r"\s+#.*$", "", v).strip().strip("[]")
    return out


def links(md):
    m = re.search(r"^## Link\s*\n(.*?)(?=^## |\Z)", md, re.S | re.M)
    found = {}
    for lab, url in re.findall(r"([A-Za-zÀ-ÿ ]+?):\s*(?:\[[^\]]*\]\()?(https?://[^\s)\]]+)", m.group(1) if m else ""):
        found.setdefault(lab.strip().lower(), url)
    return [{"label": nice, "url": found[key]} for key, nice in LABELS if key in found]


def minify(js):
    return "\n".join(s for s in (l.rstrip() for l in js.splitlines()) if s.strip() and not s.lstrip().startswith("//"))


def main(argv):
    if not argv:
        sys.exit(__doc__)
    path, dry = Path(argv[0]), "--dry" in argv[1:]
    md = path.read_text(encoding="utf-8")
    fm = frontmatter(md)
    if not fm.get("progetto"):
        sys.exit("ERRORE: 'progetto' mancante nel frontmatter di project.md")
    testate = [t.strip() for t in (fm.get("testate") or fm.get("testata") or "").split(",") if t.strip()]
    tip = fm.get("tipologia", "")
    data = {
        "nome": fm["progetto"],
        "area": " · ".join(testate) or "—",
        "tipo": "UX e UI Design" + (f" · {tip}" if tip and tip.lower() != "da definire" else ""),
        "owner": f"{fm['owner']}, Design Owner" if fm.get("owner") else "Design Owner da definire",
        "links": links(md),
    }
    if dry:
        data["dry"] = True
    js = minify((HERE / "compila-cover.js").read_text(encoding="utf-8"))
    print(js.replace("__DATA__", json.dumps(data, ensure_ascii=False, separators=(",", ":")), 1))


if __name__ == "__main__":
    main(sys.argv[1:])
