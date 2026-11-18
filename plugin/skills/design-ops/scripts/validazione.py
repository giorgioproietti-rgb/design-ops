#!/usr/bin/env python3
"""Gestisce il report di validazione (04_Validazione/test-AAAA-MM-DD.md) per l'HC3 di Design Ops.

Uso:
  validazione.py elenco <report|cartella>                      lista numerata di ROSSI e GIALLI per l'HC3
  validazione.py decidi <report|cartella> [opzioni]            scrive la tabella "Decisione del designer"
        --accetto ID...  --respingo ID...  --rimando ID...  --risolto ID...
        --pos               i numeri sono le posizioni dell'elenco (come li vede il designer), non gli ID
        --accetto-rossi     accetta tutti i ROSSI senza decisione
        --gialli-rimando    i problemi non ROSSI senza decisione diventano "rimandato"
        --nota ID=testo     (ripetibile)
  validazione.py stato <report|cartella> [pagine.md]           cosa resta aperto, se l'HC3 si puo' chiudere

ID: "VAL-07" oppure solo il numero (7). Con --pos i numeri sono le posizioni di `elenco`. Con una cartella usa il report piu' recente (test-*.md).
Decisioni: accettato (da correggere nel wireframe), respinto, rimandato, risolto (corretto a mano).
Un problema di Tipo requisito o vincolo non si risolve nel wireframe: se accettato diventa "rimandato".
"""
import argparse, re, sys
from pathlib import Path

DECISIONI = ["accettato", "respinto", "rimandato", "risolto"]
FUORI = {"requisito", "vincolo"}


def trova(p):
    p = Path(p)
    if p.is_dir():
        r = sorted(p.glob("test-*.md"))
        if not r:
            sys.exit("ERRORE: nessun report test-*.md in " + str(p))
        return r[-1]
    return p


def sezione(testo, titolo_rx):
    m = re.search(r"^##\s+(?:%s)\b.*?$" % titolo_rx, testo, re.M | re.I)
    if not m:
        return None, None, None
    fine = re.search(r"^##\s", testo[m.end():], re.M)
    a, b = m.end(), (m.end() + fine.start() if fine else len(testo))
    return a, b, testo[a:b]


def tabella(blocco):
    righe = [l for l in blocco.splitlines() if l.strip().startswith("|")]
    if len(righe) < 2:
        return [], []
    cut = lambda l: [c.strip() for c in l.strip().strip("|").split("|")]
    head = [h.lower() for h in cut(righe[0])]
    out = []
    for l in righe[1:]:
        c = cut(l)
        if all(re.fullmatch(r":?-{2,}:?", x) for x in c if x):
            continue
        out.append(dict(zip(head, c + [""] * (len(head) - len(c)))))
    return head, out


def norm(i):
    m = re.search(r"(\d+)", str(i))
    return "VAL-%02d" % int(m.group(1)) if m else str(i).upper()


def carica(report):
    t = report.read_text(encoding="utf-8")
    _, _, bp = sezione(t, r"Problemi")
    _, _, bd = sezione(t, r"Decisione del designer")
    if bp is None:
        sys.exit("ERRORE: sezione 'Problemi' non trovata in " + str(report))
    _, probs = tabella(bp)
    probs = [{**p, "id": norm(p.get("id", ""))} for p in probs if p.get("id")]
    _, dec = tabella(bd or "")
    decis = {norm(d.get("id", "")): {"decisione": d.get("decisione", "").lower(), "nota": d.get("nota", "")} for d in dec if d.get("id")}
    return t, probs, decis


def livello(p):
    return (p.get("livello", "") or "").upper()


def corto(s, n):
    s = re.sub(r"\s+", " ", s or "").strip()
    return s if len(s) <= n else s[: n - 1] + "…"


def ordine(probs):
    return [p["id"] for lv in ("ROSSO", "GIALLO") for p in probs if livello(p) == lv]


def cmd_elenco(a):
    r = trova(a.report); t, probs, decis = carica(r)
    n = {k: sum(1 for p in probs if livello(p) == k) for k in ("ROSSO", "GIALLO")}
    print("%s · problemi %d (ROSSO %d, GIALLO %d, altri %d)" % (r.name, len(probs), n["ROSSO"], n["GIALLO"], len(probs) - n["ROSSO"] - n["GIALLO"]))
    k = 0
    for lv in ("ROSSO", "GIALLO"):
        for p in [x for x in probs if livello(x) == lv]:
            k += 1
            d = decis.get(p["id"], {}).get("decisione", "")
            print("%d. %s · %s · %s · %s · %s%s" % (k, lv, p["id"], corto(p.get("frame", ""), 38), p.get("tipo", "-"), corto(p.get("problema reale", ""), 80), (" [" + d + "]") if d else ""))


def cmd_decidi(a):
    r = trova(a.report); t, probs, decis = carica(r)
    ids = {p["id"]: p for p in probs}
    avvisi = []
    pos = ordine(probs)
    def imposta(lista, dec):
        for x in lista or []:
            if a.pos:
                n = int(re.search(r"\d+", str(x)).group(0))
                if not 1 <= n <= len(pos):
                    avvisi.append("posizione fuori elenco: %s" % x); continue
                i = pos[n - 1]
            else:
                i = norm(x)
            if i not in ids:
                avvisi.append("ID non nel report: " + i); continue
            d = dec
            nota = decis.get(i, {}).get("nota", "")
            if d == "accettato" and ids[i].get("tipo", "").lower() in FUORI:
                d, nota = "rimandato", "richiede " + ids[i]["tipo"].lower() + ": fuori dal wireframe"
                avvisi.append("%s (%s) non si risolve nel wireframe: rimandato" % (i, ids[i]["tipo"].lower()))
            decis[i] = {"decisione": d, "nota": nota}
    imposta(a.accetto, "accettato"); imposta(a.respingo, "respinto"); imposta(a.rimando, "rimandato"); imposta(a.risolto, "risolto")
    if a.accetto_rossi:
        imposta([p["id"] for p in probs if livello(p) == "ROSSO" and not decis.get(p["id"], {}).get("decisione")], "accettato")
    if a.gialli_rimando:
        imposta([p["id"] for p in probs if livello(p) != "ROSSO" and not decis.get(p["id"], {}).get("decisione")], "rimandato")
    for kv in a.nota or []:
        i, _, txt = kv.partition("=")
        i = norm(i)
        if i in ids:
            decis.setdefault(i, {"decisione": "", "nota": ""})["nota"] = txt
    righe = ["| ID | Decisione | Nota |", "|---|---|---|"] + ["| %s | %s | %s |" % (p["id"], decis.get(p["id"], {}).get("decisione", ""), decis.get(p["id"], {}).get("nota", "")) for p in probs]
    nuova = "\n" + "\n".join(righe) + "\n"
    ia, ib, _ = sezione(t, r"Decisione del designer")
    if ia is None:
        t = t.rstrip("\n") + "\n\n## Decisione del designer\n" + nuova
    else:
        t = t[:ia] + nuova + t[ib:]
    r.write_text(t, encoding="utf-8")
    c = {k: sum(1 for v in decis.values() if v["decisione"] == k) for k in DECISIONI}
    print("Scritto %s: accettati %d · respinti %d · rimandati %d · risolti %d · senza decisione %d" % (r.name, c["accettato"], c["respinto"], c["rimandato"], c["risolto"], sum(1 for p in probs if not decis.get(p["id"], {}).get("decisione"))))
    for x in avvisi:
        print("AVVISO: " + x)


def pagine_info(path):
    rev, limite, wf = set(), [], None
    if not path or not Path(path).exists():
        return rev, limite, False
    for l in Path(path).read_text(encoding="utf-8").splitlines():
        if l.lstrip().startswith("#"):
            m = re.search(r"(WF-\d+)", l)
            if m: wf = m.group(1)
        if re.match(r"\s*-\s*Rev\b", l):
            rev.update(norm(x) for x in re.findall(r"VAL-\d+", l))
        m = re.search(r"Revisioni auto:\s*(\d)/2", l)
        if m and m.group(1) == "2" and wf: limite.append(wf)
    return rev, limite, True


def cmd_stato(a):
    r = trova(a.report); t, probs, decis = carica(r)
    rev, limite, ho_pagine = pagine_info(a.pagine)
    dec = lambda p: decis.get(p["id"], {}).get("decisione", "")
    rossi = [p for p in probs if livello(p) == "ROSSO"]
    senza_r = [p["id"] for p in rossi if not dec(p)]
    senza_a = [p["id"] for p in probs if not dec(p) and livello(p) == "GIALLO"]
    acc_aperti = [p["id"] for p in probs if dec(p) == "accettato" and p["id"] not in rev] if ho_pagine else [p["id"] for p in probs if dec(p) == "accettato"]
    fuori = [(p["id"], p.get("tipo", "").lower()) for p in probs if p.get("tipo", "").lower() in FUORI and dec(p) in ("rimandato", "accettato")]
    c = {k: sum(1 for p in probs if dec(p) == k) for k in DECISIONI}
    print("%s · problemi %d (ROSSO %d) · accettati %d · respinti %d · rimandati %d · risolti %d · senza decisione %d" % (r.name, len(probs), len(rossi), c["accettato"], c["respinto"], c["rimandato"], c["risolto"], sum(1 for p in probs if not dec(p))))
    if senza_r: print("ROSSI senza decisione: " + ", ".join(senza_r))
    if acc_aperti: print("Accettati senza riga Rev in pagine.md%s: %s" % ("" if ho_pagine else " (pagine.md non letto)", ", ".join(acc_aperti)))
    if limite and acc_aperti: print("Pagine a 2/2 revisioni: " + ", ".join(sorted(set(limite))) + " → correggi a mano e segna 'risolto'")
    if fuori: print("Fuori dal wireframe (Aperto): " + ", ".join("%s (%s)" % x for x in fuori))
    if senza_a: print("GIALLI senza decisione (non bloccano): " + ", ".join(senza_a))
    ok = not senza_r and not acc_aperti
    print("Esito: " + ("CHIUDIBILE" if ok else "NON chiudibile"))
    sys.exit(0 if ok else 1)


def main():
    ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest="cmd", required=True)
    e = sp.add_parser("elenco"); e.add_argument("report")
    d = sp.add_parser("decidi"); d.add_argument("report")
    for k in ("accetto", "respingo", "rimando", "risolto"): d.add_argument("--" + k, nargs="+")
    d.add_argument("--pos", action="store_true"); d.add_argument("--accetto-rossi", action="store_true"); d.add_argument("--gialli-rimando", action="store_true"); d.add_argument("--nota", action="append")
    s = sp.add_parser("stato"); s.add_argument("report"); s.add_argument("pagine", nargs="?")
    a = ap.parse_args()
    {"elenco": cmd_elenco, "decidi": cmd_decidi, "stato": cmd_stato}[a.cmd](a)


if __name__ == "__main__":
    main()
