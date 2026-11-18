#!/usr/bin/env python3
"""Legge l'elenco delle pagine di un file Figma di progetto e ne ricava lo stato dalle emoji del nome.

Uso:
  stato_pagine_figma.py --device "mobile, desktop" [--gate si|no] [--json] < elenco.txt

L'elenco e' l'output di get_metadata senza nodeId (righe "- 27:29: 🔴 UX Desk - Nome progetto"), oppure un nome di pagina per riga.
Legenda del template: 🔴 non ancora disegnato · 🟡 in progress · ✅ (o 🟢) concluso · 🔵 bozza.
Non scrive nulla: Design Ops propone, il designer decide.
"""
import argparse, json, re, sys

STATI = [("✅", "concluso"), ("🟢", "concluso"), ("✔", "concluso"), ("🟡", "in corso"), ("🔴", "non iniziato"), ("🔵", "bozza")]
KIND = re.compile(r"^(UX|UI)\s+(Desk|Mob)", re.I)


def pagine(testo):
    out = []
    for riga in testo.splitlines():
        riga = riga.strip()
        if not riga:
            continue
        m = re.match(r"^-\s*[\d:;]+\s*:\s*(.+)$", riga)
        nome = (m.group(1) if m else riga.lstrip("- ")).strip()
        if nome.lower().startswith("top-level pages") or nome.lower().startswith("no nodeid"):
            continue
        out.append(nome)
    return out


def classifica(nome):
    testa = nome[:8]
    stato = next((s for e, s in STATI if e in testa), "senza stato")
    pulito = re.sub(r"^[^A-Za-z]+", "", nome)
    k = KIND.match(pulito)
    if not k:
        return None
    return {"nome": nome, "tipo": f"{k.group(1).upper()} {'Desk' if k.group(2).lower() == 'desk' else 'Mob'}",
            "stato": stato, "categoria": "categoria" in nome.lower()}


def richieste(device):
    d = (device or "").lower()
    mob, desk = "mobile" in d or "app" in d, "desktop" in d or "web" in d
    if not (mob or desk):
        return ["Mob", "Desk"], False
    return ([k for k, on in (("Mob", mob), ("Desk", desk)) if on]), True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--device", default="")
    ap.add_argument("--gate", choices=["si", "no"], default=None, help="il gate 'Wireframe validato' e' gia' spuntato?")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--ui", action="store_true", help="mostra anche le pagine UI (fuori dal perimetro del processo)")
    a = ap.parse_args()
    pg = [p for p in (classifica(n) for n in pagine(sys.stdin.read())) if p]
    req, noto = richieste(a.device)
    ux = {}
    for k in req:
        trovate = [p for p in pg if p["tipo"] == f"UX {k}"]
        ux[k] = trovate
    mancanti = [f"UX {k}" for k, v in ux.items() if not v]
    non_conclusi = [f"UX {k}" for k, v in ux.items() if v and any(p["stato"] != "concluso" for p in v)]
    if mancanti:
        esito = "pagine mancanti"
    elif not non_conclusi:
        esito = "pronto"
    elif all(p["stato"] == "non iniziato" for v in ux.values() for p in v):
        esito = "non iniziato"
    else:
        esito = "in corso"
    incoerenza = (a.gate == "si" and esito != "pronto")
    ui = {}
    for p in pg:
        if p["tipo"].startswith("UI"):
            ui.setdefault(p["tipo"], []).append(p["stato"])
    res = {"device": a.device or "non definito", "device_noto": noto, "richieste": [f"UX {k}" for k in req],
           "ux": {f"UX {k}": sorted({p["stato"] for p in v}) or ["assente"] for k, v in ux.items()},
           "esito": esito, "mancanti": mancanti, "non_conclusi": non_conclusi, "incoerenza": incoerenza,
           "ui": {k: sorted(set(v)) for k, v in ui.items()}}
    if a.json:
        print(json.dumps(res, ensure_ascii=False)); return
    em = {"concluso": "✅", "in corso": "🟡", "non iniziato": "🔴", "bozza": "🔵", "senza stato": "·", "assente": "—"}
    print("Pagine UX (device: %s)" % res["device"] if noto else "Pagine UX (device non definito: richieste entrambe)")
    for k, v in res["ux"].items():
        print("  %s: %s" % (k, " ".join(em.get(s, s) + " " + s for s in v)))
    print("Esito: " + esito + ((" — mancano: " + ", ".join(mancanti)) if mancanti else (" — non conclusi: " + ", ".join(non_conclusi) if non_conclusi else "")))
    if incoerenza:
        print("INCOERENZA: il gate 'Wireframe validato' e' spuntato ma le pagine UX non sono tutte ✅")
    if ui and a.ui:
        print("UI: " + " · ".join("%s %s" % (k, "/".join(em.get(s, s) for s in sorted(set(v)))) for k, v in sorted(ui.items())))


if __name__ == "__main__":
    main()
