#!/usr/bin/env bash
# Mette online repository, sito e risposte intelligenti.
# Uso: ./scripts/setup_github.sh <proprietario> <repository>
# Richiede: git e GitHub CLI (gh) già autenticata con "gh auth login", e un account Cloudflare gratuito.
set -euo pipefail

OWNER="${1:?Indica il proprietario GitHub (utente o organizzazione)}"
REPO="${2:?Indica il nome del repository}"
ORIGIN="https://$(echo "$OWNER" | tr '[:upper:]' '[:lower:]').github.io"
cd "$(dirname "$0")/.."

command -v git >/dev/null || { echo "git non è installato"; exit 1; }
command -v gh  >/dev/null || { echo "GitHub CLI (gh) non è installata: https://cli.github.com"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Esegui prima: gh auth login"; exit 1; }

echo "1/6 Imposto l'origine consentita del servizio: $ORIGIN"
sed -i.bak "s|^ALLOWED_ORIGIN = .*|ALLOWED_ORIGIN = \"$ORIGIN\"|" worker/wrangler.toml && rm -f worker/wrangler.toml.bak

echo "2/6 Preparo il repository locale"
[ -d .git ] || git init -b main >/dev/null
git add -A
git commit -qm "Design Ops: plugin, documentazione e sito" || true

echo "3/6 Creo il repository pubblico $OWNER/$REPO"
gh repo create "$OWNER/$REPO" --public --source=. --remote=origin

echo "4/6 Salvo i dati di Cloudflare (da https://dash.cloudflare.com)"
read -r -p "Cloudflare Account ID: " CF_ACCOUNT
read -r -s -p "Cloudflare API token (modello \"Edit Cloudflare Workers\"): " CF_TOKEN; echo
gh secret set CLOUDFLARE_ACCOUNT_ID --repo "$OWNER/$REPO" --body "$CF_ACCOUNT"
gh secret set CLOUDFLARE_API_TOKEN --repo "$OWNER/$REPO" --body "$CF_TOKEN"

echo "5/6 Pubblico il codice e attivo GitHub Pages"
git push -u origin main
gh api -X POST "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 \
  || gh api -X PUT "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 || echo "Attiva a mano: Settings > Pages > Source: GitHub Actions"

echo "6/6 Rilancio il flusso Sito"
sleep 5; gh workflow run docs.yml --repo "$OWNER/$REPO" || true

cat <<MSG

Fatto. Il sito sarà su: $ORIGIN/$REPO/  (qualche minuto).
Quando il flusso "Sito" ha pubblicato il servizio, copia il suo indirizzo (https://design-ops-wiki.<sottodominio>.workers.dev,
lo trovi nel log del passo "Pubblica il servizio delle risposte" o in Cloudflare > Workers & Pages) e lancia:

  gh variable set WORKER_URL --repo $OWNER/$REPO --body "https://design-ops-wiki.<sottodominio>.workers.dev"
  gh workflow run docs.yml --repo $OWNER/$REPO

MSG
