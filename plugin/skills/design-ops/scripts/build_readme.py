#!/usr/bin/env python3
"""Genera il payload use_figma che compila il Read Me del file Figma di progetto e rinomina le pagine.

Uso:
  build_readme.py <project.md>                 payload che scrive
  build_readme.py <project.md> --dry           payload che NON scrive: mostra prima e dopo
  build_readme.py <project.md> --no-rinomina   non rinomina le pagine

Legge da project.md: progetto, avvio, scadenza, Referenti (Contesto) e i link http della sezione Link.
Stampa il codice da passare a use_figma.
"""
import json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LABELS = [("planner", "Planner"), ("riferimento online", "Riferimento online"), ("design esistente", "Design esistente"),
          ("product snapshot", "Product Snapshot"), ("figjam", "Ricerca (FigJam)"), ("figma flow", "User flow (FigJam)")]
VUOTI = {"", "—", "-", "da definire", "dopo", "nessuno", "n.d."}


def frontmatter(md):
    m = re.match(r"^---\n(.*?)\n---", md, re.S)
    out = {}
    for line in (m.group(1) if m else "").splitlines():
        k, sep, v = line.partition(":")
        if k.strip() and sep:
            out[k.strip()] = re.sub(r"\s+#.*$", "", v).strip().strip("[]")
    return out


def links(md):
    m = re.search(r"^## Link\s*\n(.*?)(?=^## |\Z)", md, re.S | re.M)
    found = {}
    for lab, url in re.findall(r"([A-Za-zÀ-ÿ ]+?):\s*(?:\[[^\]]*\]\()?(https?://[^\s)\]]+)", m.group(1) if m else ""):
        found.setdefault(lab.strip().lower(), url)
    return [{"label": nice, "url": found[key]} for key, nice in LABELS if key in found]


def referenti(md):
    m = re.search(r"^- \*\*Referenti:\*\*\s*(.*)$", md, re.M)
    txt = (m.group(1) if m else "").strip()
    if txt.lower() in VUOTI:
        return []
    parti = [p.strip() for p in (re.split(r";", txt) if ";" in txt else re.split(r",|·", txt)) if p.strip()]
    return [p for p in parti if p.lower() not in VUOTI]


def minify(js):
    return "\n".join(s for s in (l.rstrip() for l in js.splitlines()) if s.strip() and not s.lstrip().startswith("//"))


def main(argv):
    if not argv:
        sys.exit(__doc__)
    path, flags = Path(argv[0]), argv[1:]
    md = path.read_text(encoding="utf-8")
    fm = frontmatter(md)
    if not fm.get("progetto"):
        sys.exit("ERRORE: 'progetto' mancante nel frontmatter di project.md")
    stime = []
    if fm.get("avvio", "").lower() not in VUOTI:
        stime.append(f"Avvio: {fm['avvio']}")
    if fm.get("scadenza", "").lower() not in VUOTI:
        stime.append(f"Scadenza: {fm['scadenza']}")
    data = {"nome": fm["progetto"], "referenti": referenti(md), "stime": stime, "links": links(md), "rinomina": "--no-rinomina" not in flags}
    if "--dry" in flags:
        data["dry"] = True
    js = minify((HERE / "compila-readme.js").read_text(encoding="utf-8"))
    print(js.replace("__DATA__", json.dumps(data, ensure_ascii=False, separators=(",", ":")), 1))


if __name__ == "__main__":
    main(sys.argv[1:])
