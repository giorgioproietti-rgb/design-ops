#!/usr/bin/env python3
"""Stampa le note di una versione dal CHANGELOG.md. Uso: python3 scripts/release_notes.py X.Y.Z"""
import re, sys
from pathlib import Path

ver = sys.argv[1]
t = (Path(__file__).resolve().parent.parent / "CHANGELOG.md").read_text(encoding="utf-8")
m = re.search(r"^## %s .*?\n(.*?)(?=^## |\Z)" % re.escape(ver), t, re.M | re.S)
print((m.group(1).strip() if m else "Versione %s." % ver))
