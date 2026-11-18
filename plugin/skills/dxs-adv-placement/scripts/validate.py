#!/usr/bin/env python3
"""Valida placements/<testata>.json: nomi adv esistenti tra le varianti DXS, blocchi noti, chiavi template."""
import json, sys
KNOWN = {"adv", "advbox", "ed", "sticky"}
d = json.load(open(sys.argv[1], encoding="utf-8"))
err = []
for key, t in d["template"].items():
    if t.get("mancante"):
        continue
    dev = key.split("/")[-1].lower()
    if dev not in ("d", "m"):
        err.append(f"{key}: suffisso device non valido")
    blocks = t.get("top", []) + t.get("aside", []) + t.get("preFooter", []) + [i["block"] for i in t.get("inline", [])]
    if dev == "m" and t.get("aside"):
        err.append(f"{key}: aside non previsto su mobile")
    for b in blocks:
        if b[0] not in KNOWN:
            err.append(f"{key}: blocco {b[0]} sconosciuto")
        elif b[0] == "adv" and b[1] not in d["varianti"][dev]:
            err.append(f"{key}: variante '{b[1]}' non esiste in {d['componenti'][dev]['nome']}")
    for i in t.get("inline", []):
        if not isinstance(i.get("after"), int):
            err.append(f"{key}: inline senza 'after' numerico")
print("\n".join("ERRORE " + e for e in err) or "OK")
sys.exit(1 if err else 0)
