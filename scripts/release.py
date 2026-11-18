#!/usr/bin/env python3
"""Prepara un rilascio del plugin: versione, changelog e controlli.

Uso:  python3 scripts/release.py X.Y.Z --note "cosa cambia" [--note "..."] [--date AAAA-MM-GG]

1. aggiorna la versione in plugin/.claude-plugin/plugin.json, plugin/skills/design-ops/SKILL.md e references/startup.md
2. aggiunge la voce al CHANGELOG.md
3. controlla il plugin, costruisce il sito e ne verifica la ricerca
Se un controllo fallisce, riporta i file alla versione precedente.
Poi: commit, tag vX.Y.Z e push dei tag. Il flusso "Rilascio" crea lo zip.
"""
import argparse, datetime, json, re, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = ["plugin/.claude-plugin/plugin.json", "plugin/skills/design-ops/SKILL.md", "plugin/skills/design-ops/references/startup.md", "CHANGELOG.md"]


def sub(path, rx, new):
    p = ROOT / path
    t, n = re.subn(rx, new, p.read_text(encoding="utf-8"), count=1)
    if not n:
        raise ValueError("in %s non trovo %r" % (path, rx))
    p.write_text(t, encoding="utf-8")


def ver(v):
    return tuple(int(x) for x in v.split("."))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("version"); ap.add_argument("--note", action="append", default=[])
    ap.add_argument("--date", default=datetime.date.today().isoformat())
    a = ap.parse_args()
    if not re.fullmatch(r"\d+\.\d+\.\d+", a.version):
        sys.exit("ERRORE: la versione deve essere del tipo 1.2.3")
    if not a.note:
        sys.exit("ERRORE: serve almeno una --note per il changelog")
    pj = ROOT / FILES[0]
    meta = json.loads(pj.read_text(encoding="utf-8")); old = meta["version"]
    if ver(a.version) <= ver(old):
        sys.exit("ERRORE: la versione %s non è successiva a %s" % (a.version, old))
    copia = {f: (ROOT / f).read_bytes() for f in FILES}

    def ripristina(msg):
        for f, b in copia.items():
            (ROOT / f).write_bytes(b)
        sys.exit(msg + "\nI file sono stati riportati alla versione precedente.")

    try:
        meta["version"] = a.version
        pj.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        sub(FILES[1], r"Versione del processo: [\d.]+ \(plugin Design Ops\)", "Versione del processo: %s (plugin Design Ops)" % a.version)
        sub(FILES[2], r"\(Design Ops v[\d.]+\)", "(Design Ops v%s)" % a.version)
        voce = "## %s — %s\n%s\n\n" % (a.version, a.date, "\n".join("- " + n for n in a.note))
        sub(FILES[3], r"(# Changelog\n\n)", lambda m: m.group(1) + voce)
    except ValueError as e:
        ripristina("ERRORE: " + str(e))
    print("Versione %s → %s, changelog aggiornato." % (old, a.version))

    for cmd in ([sys.executable, "scripts/validate_plugin.py"], [sys.executable, "site/build_site.py", "--date", a.date]):
        if subprocess.run(cmd, cwd=ROOT).returncode:
            ripristina("ERRORE: controllo fallito (%s)." % " ".join(cmd[1:3]))
    if shutil.which("node"):
        if subprocess.run(["node", "site/test_wiki.js", "dist/site/index.html"], cwd=ROOT).returncode:
            ripristina("ERRORE: la ricerca del sito non supera i controlli. Correggi docs/faq.md o site/wiki-test-queries.json.")
    else:
        print("AVVISO: node non trovato, controlli della ricerca saltati.")
    print("Pronto. Prossimi passi:\n  git add -A && git commit -m \"Rilascio %s\"\n  git tag v%s && git push && git push --tags" % (a.version, a.version))


if __name__ == "__main__":
    main()
