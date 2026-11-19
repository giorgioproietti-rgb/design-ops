#!/usr/bin/env python3
"""Controlla il plugin prima di sito e rilascio. Esce con errore se qualcosa non va.

Verifica: manifest valido; ogni skill ha nome uguale alla cartella e una descrizione valida (max 1024 caratteri,
senza due punti seguiti da spazio); i file citati nelle skill esistono; i comandi hanno una descrizione;
la versione coincide in manifest, design-ops, avvio e changelog.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGIN = ROOT / "plugin"
errori = []
# file citati che appartengono a skill esterne al plugin (per esempio quelle di Figma)
ESTERNI = {("dxs-handoff", "references/flowchart.md")}


def err(msg):
    errori.append(msg)


def main():
    try:
        manifest = json.loads((PLUGIN / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))
    except Exception as e:
        sys.exit("ERRORE: manifest non valido (%s)" % e)
    for k in ("name", "version", "description"):
        if not manifest.get(k):
            err("manifest: manca '%s'" % k)
    ver = manifest.get("version", "")
    if not re.fullmatch(r"\d+\.\d+\.\d+", ver):
        err("manifest: versione non valida (%r)" % ver)

    skills = sorted(p for p in (PLUGIN / "skills").iterdir() if p.is_dir())
    if not skills:
        err("nessuna skill in plugin/skills")
    for sk in skills:
        f = sk / "SKILL.md"
        if not f.exists():
            err("%s: manca SKILL.md" % sk.name); continue
        t = f.read_text(encoding="utf-8")
        m = re.match(r"^---\n(.*?)\n---", t, re.S)
        if not m:
            err("%s: frontmatter mancante" % sk.name); continue
        name = re.search(r"^name:\s*\"?([^\"\n]+)\"?\s*$", m.group(1), re.M)
        desc = re.search(r"^description:\s*(.+)$", m.group(1), re.M)
        if not name or name.group(1).strip() != sk.name:
            err("%s: il nome nel frontmatter non coincide con la cartella" % sk.name)
        if not desc:
            err("%s: descrizione mancante" % sk.name)
        else:
            d = desc.group(1)
            if len(d) > 1024:
                err("%s: descrizione di %d caratteri (max 1024)" % (sk.name, len(d)))
            if ": " in d:
                err("%s: la descrizione contiene due punti seguiti da spazio (rompe il frontmatter)" % sk.name)
        for md in sk.rglob("*.md"):
            for ref in set(re.findall(r"`((?:references|scripts|assets)/[A-Za-z0-9_.\-]+\.[a-z]+)`", md.read_text(encoding="utf-8"))):
                if not (sk / ref).exists() and (sk.name, ref) not in ESTERNI:
                    err("%s: %s cita %s, che non esiste" % (sk.name, md.relative_to(sk), ref))
    for c in sorted((PLUGIN / "commands").glob("*.md")):
        if not re.search(r"^description:\s*\S", c.read_text(encoding="utf-8"), re.M):
            err("comando %s: descrizione mancante" % c.name)

    do = (PLUGIN / "skills" / "design-ops" / "SKILL.md").read_text(encoding="utf-8")
    st = (PLUGIN / "skills" / "design-ops" / "references" / "startup.md").read_text(encoding="utf-8")
    cl = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
    m1 = re.search(r"Versione del processo: ([\d.]+)", do)
    m2 = re.search(r"\(Design Ops v([\d.]+)\)", st)
    m3 = re.search(r"^## ([\d.]+) ", cl, re.M)
    for nome, m in (("design-ops/SKILL.md", m1), ("references/startup.md", m2), ("CHANGELOG.md (prima voce)", m3)):
        if not m:
            err("%s: versione non trovata" % nome)
        elif m.group(1) != ver:
            err("%s indica la versione %s, il manifest %s" % (nome, m.group(1), ver))
    if "{{SITE_URL}}" not in (PLUGIN / "README.md").read_text(encoding="utf-8"):
        err("plugin/README.md: manca il segnaposto {{SITE_URL}}")

    if errori:
        print("Controlli falliti:"); [print(" -", e) for e in errori]; sys.exit(1)
    print("Plugin v%s: %d skill, %d comandi, controlli superati." % (ver, len(skills), len(list((PLUGIN / "commands").glob("*.md")))))


if __name__ == "__main__":
    main()
