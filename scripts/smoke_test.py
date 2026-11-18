#!/usr/bin/env python3
"""Verifica che il servizio delle risposte funzioni: stato, risposta a una domanda in tema, fuori tema.

Uso: python3 scripts/smoke_test.py --url https://design-ops-wiki.<sottodominio>.workers.dev [--origin https://org.github.io]
L'origine, se non indicata, si legge da worker/wrangler.toml. Esce con errore se il servizio non risponde bene:
la causa più probabile è un modello ritirato da Cloudflare (aggiorna LLM_MODELS in worker/wrangler.toml).
"""
import argparse, json, re, sys, urllib.error, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument("--url", required=True)
ap.add_argument("--origin", default="")
a = ap.parse_args()
origin = a.origin
if not origin:
    m = re.search(r'^ALLOWED_ORIGIN\s*=\s*"([^"]*)"', (ROOT / "worker" / "wrangler.toml").read_text(encoding="utf-8"), re.M)
    origin = m.group(1) if m else ""
if not origin:
    sys.exit("ERRORE: origine non indicata e ALLOWED_ORIGIN vuoto in worker/wrangler.toml")


def call(method, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(a.url, data=data, method=method, headers={"Content-Type": "application/json", "Origin": origin, "User-Agent": "design-ops-smoke-test/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            return r.status, json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode() or "{}")
        except Exception:
            return e.code, {}


s, d = call("GET")
if s != 200 or not d.get("ok"):
    sys.exit("ERRORE: il servizio non risponde (GET %s). Controlla l'indirizzo e che il Worker sia pubblicato." % s)
print("Servizio attivo: versione %s, %s sezioni, fornitore %s." % (d.get("version"), d.get("sections"), d.get("provider")))

s, d = call("POST", {"q": "Come installo il plugin?"})
if s == 429:
    print("AVVISO: limite giornaliero o di frequenza raggiunto, la risposta non è stata verificata."); sys.exit(0)
if s != 200 or not (d.get("answer") or "").strip() or not d.get("sources"):
    sys.exit("ERRORE: nessuna risposta valida (stato %s: %s). Probabile modello ritirato: aggiorna LLM_MODELS in worker/wrangler.toml." % (s, d.get("error", "risposta vuota")))
print("Risposta in tema: %d caratteri, %d fonti." % (len(d["answer"]), len(d["sources"])))

s, d = call("POST", {"q": "ricetta della carbonara"})
if s != 200 or "Non è documentato" not in (d.get("answer") or ""):
    sys.exit("ERRORE: una domanda fuori tema non ha risposto 'Non è documentato' (stato %s)." % s)
print("Fuori tema gestito correttamente. Servizio verificato.")
