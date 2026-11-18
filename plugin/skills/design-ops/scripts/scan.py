#!/usr/bin/env python3
"""Rileva le modifiche fatte a mano in una cartella di progetto rispetto all'ultimo snapshot.

Uso:
  python3 scan.py <cartella_progetto>                 solo lettura: mostra le differenze
  python3 scan.py <cartella_progetto> --update        mostra e poi salva il nuovo snapshot
  python3 scan.py <cartella_progetto> --lines applicato|ignorato   righe da accodare a storico.md
  python3 scan.py <cartella_progetto> --json          output per macchina
  python3 scan.py <cartella_progetto> --hash <file>   impronta di un file (8 caratteri)
  python3 scan.py <cartella_progetto> --touch <file>...   aggiorna lo snapshot solo per questi file

Non legge il contenuto dei file (solo dimensione, data e impronta): costo trascurabile.
"""
import argparse, hashlib, json, os, re, sys
from datetime import datetime

STATO = "_stato.json"
IGNORE_NAMES = {STATO, ".DS_Store", "Thumbs.db", "desktop.ini"}
IGNORE_RE = re.compile(r"(^~\$|\.tmp$|\.icloud$|^\.~lock|\.crdownload$|\.part$)")
MAX_HASH = 20 * 1024 * 1024
MTIME_TOL = 2  # secondi: la sincronizzazione ritocca spesso le date

# (regex, gate toccato, gravità base, nota). La prima regola che combacia vince.
RULES = [
    (r"^project\.md$", None, "alert", "manifest modificato fuori da Design Ops"),
    (r"^CHANGELOG\.md$", None, "alert", "changelog modificato fuori da Design Ops"),
    (r"^storico\.md$", None, "skip", ""),
    (r"^vincoli\.md$", None, "warn", "vincoli modificati fuori da Design Ops: verifica gli ID"),
    (r"^00_Input/_AVVIO\.md$", None, "info", "istruzioni di avvio"),
    (r"^00_Input/libreria/", "Personas", "warn", "libreria di testata"),
    (r"^00_Input/ricerca/", "Benchmark", "warn", "ricerca del progetto"),
    (r"^00_Input/", "Benchmark", "warn", "input del progetto"),
    (r"^01_Blender/", "Benchmark", "warn", "output di Blender"),
    (r"^02_Personas/", "Personas", "warn", "output delle personas"),
    (r"^03_Wireframe/", "Wireframe", "warn", "output dei wireframe"),
    (r"^04_Validazione/", "Wireframe validato", "warn", "report di validazione"),
    (r"^05_Handoff/", "Passaggio alla UI", "warn", "output di handoff"),
    (r".*", None, "info", "file non classificato"),
]
# Rilevanza dei gate per le regole "warn": se il gate non è ancora spuntato non c'è nulla da invalidare.


def sha1(path):
    h = hashlib.sha1()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def walk(root):
    out = {}
    for d, dirs, files in os.walk(root):
        dirs[:] = [x for x in dirs if not x.startswith(".")]
        for n in files:
            if n in IGNORE_NAMES or IGNORE_RE.search(n):
                continue
            p = os.path.join(d, n)
            rel = os.path.relpath(p, root).replace(os.sep, "/")
            try:
                st = os.stat(p)
            except OSError:
                continue
            out[rel] = {"s": st.st_size, "m": int(st.st_mtime), "h": None}
    return out


def gates_state(root):
    """Legge i gate spuntati da project.md. Ritorna {nome: bool}."""
    res = {}
    p = os.path.join(root, "project.md")
    if not os.path.exists(p):
        return res
    for line in open(p, encoding="utf-8", errors="ignore"):
        m = re.match(r"^- \[( |x|X)\] (.+?)(?: —.*)?$", line.strip())
        if m:
            res[re.sub(r"\s*\(.*\)$", "", m.group(2)).strip()] = m.group(1).lower() == "x"
    return res


OUT_AREAS = ("01_Blender/", "02_Personas/", "03_Wireframe/", "04_Validazione/", "05_Handoff/")


def classify(path, kind, gates):
    for rx, gate, sev, note in RULES:
        if re.search(rx, path):
            break
    if sev == "skip":
        return None
    if sev == "warn" and gate is not None:
        done = gates.get(gate)
        if done is False:
            sev, note = "info", note + " (gate non ancora chiuso)"
        elif done:
            if kind == "-" and path.startswith(OUT_AREAS):
                sev, note = "alert", note + " mancante a gate chiuso"
            else:
                note += " (gate chiuso)"
    return {"gate": gate, "sev": sev, "note": note}


def integrity(root):
    out = []
    pm, cl = os.path.join(root, "project.md"), os.path.join(root, "CHANGELOG.md")
    if os.path.exists(pm) and os.path.exists(cl):
        v1 = re.search(r"^versione:\s*([\d.]+)", open(pm, encoding="utf-8", errors="ignore").read(), re.M)
        v2 = re.search(r"^## v([\d.]+)", open(cl, encoding="utf-8", errors="ignore").read(), re.M)
        if v1 and v2 and v1.group(1) != v2.group(1):
            out.append("versione in project.md (%s) diversa dal changelog (%s)" % (v1.group(1), v2.group(1)))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("root")
    ap.add_argument("--update", action="store_true")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--lines", choices=["applicato", "ignorato"])
    ap.add_argument("--touch", nargs="+", metavar="FILE", help="aggiorna nello snapshot solo questi file (dopo una scrittura di Design Ops)")
    ap.add_argument("--hash", metavar="FILE", help="stampa l'impronta (8 caratteri) di un file del progetto")
    a = ap.parse_args()
    root = os.path.abspath(a.root)
    if not os.path.isdir(root):
        print("ERRORE: cartella non trovata: %s" % root); sys.exit(2)

    if a.touch:
        sp = os.path.join(root, STATO)
        if not os.path.exists(sp):
            print("Nessuno snapshot: niente da aggiornare."); return
        snap_all = json.load(open(sp))
        for rel in a.touch:
            rel = rel.replace(os.sep, "/")
            fp_ = os.path.join(root, rel)
            if os.path.isfile(fp_):
                st = os.stat(fp_)
                snap_all["files"][rel] = {"s": st.st_size, "m": int(st.st_mtime), "h": sha1(fp_) if st.st_size <= MAX_HASH else None}
            else:
                snap_all["files"].pop(rel, None)
        json.dump(snap_all, open(sp, "w"))
        print("Snapshot aggiornato per: " + ", ".join(a.touch)); return

    if a.hash:
        hp = os.path.join(root, a.hash)
        if not os.path.isfile(hp):
            print("ERRORE: file non trovato: %s" % a.hash); sys.exit(2)
        print(sha1(hp)[:8]); return

    cur = walk(root)
    snap_path = os.path.join(root, STATO)
    snap = None
    if os.path.exists(snap_path):
        try:
            snap = json.load(open(snap_path)).get("files")
        except Exception:
            snap = None

    changes, notes = [], []
    if snap is None:
        notes.append("BASELINE: nessuno snapshot, %d file" % len(cur))
    else:
        gates = gates_state(root)
        added = [p for p in cur if p not in snap]
        removed = [p for p in snap if p not in cur]
        modified = []
        for p in cur:
            if p in snap:
                s0 = snap[p]
                if cur[p]["s"] != s0["s"]:
                    modified.append(p)
                elif cur[p]["m"] != s0["m"]:
                    if s0.get("h") and cur[p]["s"] <= MAX_HASH:
                        if sha1(os.path.join(root, p)) != s0["h"]:
                            modified.append(p)
                    elif abs(cur[p]["m"] - s0["m"]) > MTIME_TOL:
                        modified.append(p)
        # rinominati: stessa impronta
        for p in added:
            if cur[p]["s"] <= MAX_HASH:
                cur[p]["h"] = sha1(os.path.join(root, p))
        by_hash = {s["h"]: q for q, s in snap.items() if s.get("h") and q in removed}
        renamed = []
        for p in list(added):
            h = cur[p].get("h")
            if h and h in by_hash:
                old = by_hash[h]
                renamed.append((old, p)); added.remove(p); removed.remove(old)
        for p in sorted(added):
            c = classify(p, "+", gates)
            if c: changes.append({"t": "+", "path": p, **c})
        for p in sorted(modified):
            c = classify(p, "~", gates)
            if c: changes.append({"t": "~", "path": p, **c})
        for p in sorted(removed):
            c = classify(p, "-", gates)
            if c: changes.append({"t": "-", "path": p, **c})
        for old, new in renamed:
            c = classify(new, ">", gates)
            if c: changes.append({"t": ">", "path": "%s -> %s" % (old, new), **c})
        if len(removed) > max(5, len(snap) // 2):
            notes.append("SYNC?: più della metà dei file risulta mancante, sincronizzazione incompleta? Non registrare finché non si risolve")
        notes += ["INTEGRITÀ: " + x for x in integrity(root)]

    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    if a.lines:
        for c in changes:
            print("%s · %s %s · %s · %s" % (now, c["t"], c["path"], c["gate"] or c["note"], a.lines))
    elif a.json:
        print(json.dumps({"baseline": snap is None, "changes": changes, "notes": notes}, ensure_ascii=False))
    else:
        order = {"alert": 0, "warn": 1, "info": 2}
        for n in notes: print(n)
        if snap is not None:
            if not changes:
                print("Nessuna modifica dall'ultimo snapshot.")
            else:
                print("%d modifiche dall'ultimo snapshot:" % len(changes))
                for c in sorted(changes, key=lambda c: order[c["sev"]]):
                    print("%s %s [%s] %s · %s" % (c["t"], c["path"], c["gate"] or "-", c["sev"], c["note"]))

    if a.update:
        for p, v in cur.items():
            if v["h"] is None and v["s"] <= MAX_HASH:
                v["h"] = sha1(os.path.join(root, p))
        json.dump({"versione": 1, "creato": now, "files": cur}, open(snap_path, "w"))


if __name__ == "__main__":
    main()
