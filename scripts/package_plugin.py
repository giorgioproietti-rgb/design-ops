#!/usr/bin/env python3
"""Crea lo zip del plugin (solo la cartella plugin/) in dist/design-ops-X.Y.Z.zip.

Uso: python3 scripts/package_plugin.py [--site-url URL]
Il segnaposto {{SITE_URL}} del README si sostituisce con l'indirizzo del sito; senza indirizzo la riga sparisce.
"""
import argparse, json, re, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGIN = ROOT / "plugin"

ap = argparse.ArgumentParser(); ap.add_argument("--site-url", default="")
a = ap.parse_args()
ver = json.loads((PLUGIN / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))["version"]
out = ROOT / "dist"; out.mkdir(exist_ok=True)
zp = out / ("design-ops-%s.zip" % ver)
with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(PLUGIN.rglob("*")):
        if not f.is_file() or "__pycache__" in f.parts or f.suffix == ".pyc":
            continue
        rel = f.relative_to(PLUGIN)
        if rel == Path("README.md"):
            t = f.read_text(encoding="utf-8")
            t = t.replace("{{SITE_URL}}", a.site_url) if a.site_url else re.sub(r"^\*\*Documentazione.*\n\n?", "", t, flags=re.M)
            z.writestr(str(Path("design-ops") / rel), t)
        else:
            z.write(f, Path("design-ops") / rel)
print("Creato %s (%d KB)" % (zp.relative_to(ROOT), zp.stat().st_size // 1024))
