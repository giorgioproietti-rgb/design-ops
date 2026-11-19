#!/usr/bin/env bash
# Applica un aggiornamento ricevuto come zip UNENDO i file alla cartella del repository.
# Uso, dalla cartella del repository: bash scripts/apply_update.sh ~/Downloads/design-ops-wiki-update.zip
# Non trascinare le cartelle dello zip nel Finder scegliendo Sostituisci: sostituirebbe intere cartelle
# e cancellerebbe i file che lo zip non contiene.
set -euo pipefail
ZIP="${1:?Indica il percorso dello zip da applicare}"
cd "$(dirname "$0")/.."
[ -f "$ZIP" ] || { echo "File non trovato: $ZIP"; exit 1; }
if [ ! -d plugin ] || [ ! -d .git ]; then echo "Lancia lo script dalla cartella del repository (non trovo plugin e .git)"; exit 1; fi
unzip -o -q "$ZIP" -d .
echo "Aggiornamento applicato. File cambiati:"
git status --short
echo
echo "Se l'elenco e corretto: git add -A && git commit -m Aggiornamento && git push"
