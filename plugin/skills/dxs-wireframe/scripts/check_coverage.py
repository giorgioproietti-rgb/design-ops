#!/usr/bin/env python3
"""Controllo deterministico prima del render (zero token di ragionamento).

Uso: check_coverage.py personas-journey.md pagine.md [--changed ID,ID]

Verifica:
- requisiti attivi di personas-journey.md non coperti da nessuna pagina ne' in "Fuori perimetro"
- ID in pagine.md non attivi (sostituiti, scartati, inesistenti) -> pagine da aggiornare
- ID [in conflitto] usati in una pagina
- personas e destinazioni di navigazione inesistenti, blocchi sconosciuti, nomi frame duplicati
- --changed: pagine che contengono gli ID indicati (modalita' aggiornamento)
Exit 1 se ci sono errori bloccanti.
"""
import json, re, sys
from pathlib import Path

LINE = re.compile(r"^\s*-\s+((?:[A-Z]+-)+\d+)\s+\[([^\]]+)\]", re.M)
BLOCKS = {"adv", "advbox", "ed", "sticky", "h1", "h2", "label", "text", "img", "avatar", "btn", "input", "textarea", "select", "check",
          "radio", "toggle", "tabs", "chips", "card", "list", "divider", "space", "banner", "modal",
          "row", "section"}
INACTIVE = ("sostituito", "scartato")


def req_status(md):
    st = {}
    for rid, s in LINE.findall(md):
        st[rid] = s.strip()
    return st


def walk(blocks, bad):
    for b in blocks or []:
        if not isinstance(b, list) or not b:
            bad.append(str(b)); continue
        if b[0] not in BLOCKS:
            bad.append(b[0])
        if b[0] == "row":
            walk(b[1] if len(b) > 1 else [], bad)
        if b[0] in ("section", "modal"):
            walk(b[2] if len(b) > 2 else [], bad)


def main(argv):
    if len(argv) < 2:
        sys.exit(__doc__)
    pj = Path(argv[0]).read_text(encoding="utf-8")
    pg = Path(argv[1]).read_text(encoding="utf-8")
    changed = set()
    if "--changed" in argv:
        changed = set(argv[argv.index("--changed") + 1].split(","))

    st = req_status(pj)
    personas = {k for k in st if k.startswith("PER-")}
    personas |= set(re.findall(r"^###\s+(PER-\d+)", pj, re.M))
    active = {k for k, s in st.items()
              if not k.startswith(("PER-", "SUG-")) and not s.startswith(INACTIVE) and s != "suggerito"}
    conflict = {k for k, s in st.items() if s.startswith("in conflitto")}

    pages, errors, warn = [], [], []
    for i, raw in enumerate(re.findall(r"```wf\s*\n(.*?)```", pg, re.S), 1):
        try:
            pages.append(json.loads(raw))
        except json.JSONDecodeError as e:
            errors.append(f"JSON blocco {i}: {e}")
    fuori = set()
    m = re.search(r"^## Fuori perimetro\s*\n(.*?)(?=^## |\Z)", pg, re.M | re.S)
    if m:
        fuori = set(re.findall(r"^\s*-\s+((?:[A-Z]+-)+\d+)", m.group(1), re.M))

    ids = {p.get("id") for p in pages}
    covered, names, touched = set(), [], []
    for p in pages:
        pid = p.get("id", "?")
        for k in ("id", "area", "nome", "req", "blocks"):
            if k not in p:
                errors.append(f"{pid}: manca '{k}'")
        reqs = set(p.get("req", []))
        for v, patch in (p.get("varianti") or {}).items():
            reqs |= set(patch.get("req", []))
            if v.split(" ")[0].startswith("PER-") and v.split(" ")[0] not in personas:
                warn.append(f"{pid}: variante {v} senza persona in personas-journey")
            bad = []; walk(patch.get("add") and [b for _, b in patch["add"]], bad)
            walk(list((patch.get("set") or {}).values()), bad)
            if bad: errors.append(f"{pid}/{v}: blocchi sconosciuti {bad}")
            for dv in p.get("devices", ["m", "d"]):
                names.append(f"{p.get('area')} · {p.get('nome')} · {v} · {dv}")
        for dv in p.get("devices", ["m", "d"]):
            names.append(f"{p.get('area')} · {p.get('nome')} · base · {dv}")
            if dv not in ("m", "d"):
                errors.append(f"{pid}: device '{dv}' non valido (m|d)")
        covered |= reqs
        for r in sorted(reqs):
            if r not in st:
                errors.append(f"{pid}: {r} non esiste in personas-journey")
            elif st[r].startswith(INACTIVE):
                errors.append(f"{pid}: {r} [{st[r]}] -> aggiornare la pagina")
            elif r in conflict:
                warn.append(f"{pid}: {r} in conflitto, disegnare solo dopo la decisione")
        for per in p.get("personas", []):
            if per not in personas:
                warn.append(f"{pid}: persona {per} non trovata")
        for n in p.get("nav", []):
            if n not in ids:
                warn.append(f"{pid}: naviga a {n}, pagina inesistente")
        bad = []; walk(p.get("blocks"), bad)
        if bad:
            errors.append(f"{pid}: blocchi sconosciuti {bad}")
        if changed & reqs:
            touched.append(f"{pid} ({', '.join(sorted(changed & reqs))})")

    dup = sorted({n for n in names if names.count(n) > 1})
    if dup:
        errors.append(f"nomi frame duplicati: {dup}")
    missing = sorted(active - covered - fuori)

    print(f"Pagine: {len(pages)} · Frame: {len(names)} · Requisiti attivi: {len(active)} · "
          f"Coperti: {len(active & covered)} · Fuori perimetro: {len(fuori & active)}")
    if missing:
        print("NON COPERTI: " + ", ".join(missing))
    if touched:
        print("PAGINE TOCCATE: " + "; ".join(touched))
    for e in errors:
        print("ERRORE " + e)
    for w in warn:
        print("AVVISO " + w)
    if not (missing or errors or warn):
        print("OK")
    sys.exit(1 if errors or missing else 0)


if __name__ == "__main__":
    main(sys.argv[1:])
