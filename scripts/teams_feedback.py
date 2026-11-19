#!/usr/bin/env python3
"""Invia un feedback al team su Teams da terminale.

Due modi:
  1) tramite il servizio del sito (consigliato: non serve conoscere l'indirizzo del flusso di Teams)
       python3 scripts/teams_feedback.py "Il passo 4 non è chiaro" --url https://design-ops-wiki.<sottodominio>.workers.dev
  2) direttamente al flusso di Teams, per chi amministra (indirizzo del webhook nella variabile TEAMS_WEBHOOK_URL)
       TEAMS_WEBHOOK_URL="https://..." python3 scripts/teams_feedback.py "Prova"

Opzioni: --tipo suggerimento|errore|domanda|altro  --contatto "nome"  --pagina "titolo"  --origin https://<utente>.github.io  --dry-run
Il messaggio può arrivare anche da standard input: echo "testo" | python3 scripts/teams_feedback.py -
"""
import argparse, datetime, json, os, re, sys, urllib.error, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TIPI = {"suggerimento": "Suggerimento", "errore": "Errore", "domanda": "Domanda senza risposta", "altro": "Altro"}

ap = argparse.ArgumentParser(description="Invia un feedback al team su Teams")
ap.add_argument("messaggio", help="testo del feedback, oppure - per leggerlo da standard input")
ap.add_argument("--tipo", choices=list(TIPI), default="suggerimento")
ap.add_argument("--contatto", default="")
ap.add_argument("--pagina", default="")
ap.add_argument("--url", default=os.environ.get("WORKER_URL", ""), help="indirizzo del servizio del sito")
ap.add_argument("--origin", default="", help="origine del sito (di solito si legge da worker/wrangler.toml)")
ap.add_argument("--webhook", default=os.environ.get("TEAMS_WEBHOOK_URL", ""), help="indirizzo del flusso di Teams (invio diretto)")
ap.add_argument("--dry-run", action="store_true", help="mostra il messaggio senza inviarlo")
a = ap.parse_args()

testo = (sys.stdin.read() if a.messaggio == "-" else a.messaggio).strip()
if len(testo) < 3:
    sys.exit("ERRORE: scrivi un messaggio di almeno 3 caratteri.")
testo = testo[:1000]


SPIEGA = {
    400: "Teams ha rifiutato il formato del messaggio: nel flusso controlla l'azione Post card in a chat or channel e che il contenuto della scheda sia Attachment adaptive card preso dal trigger.",
    401: "Teams ha rifiutato la richiesta (401): l'indirizzo del flusso e senza firma (deve contenere sig=) oppure nel trigger non e impostato Who can trigger the flow = Anyone.",
    403: "Teams ha rifiutato la richiesta (403): l'indirizzo del flusso e senza firma o non valido, oppure il trigger non e impostato su Anyone.",
    404: "Teams non trova il flusso (404): indirizzo scritto male oppure flusso eliminato.",
    410: "Il flusso non esiste piu (410): crea un nuovo flusso e aggiorna l'indirizzo.",
    429: "Power Automate sta limitando le richieste (429): riprova tra qualche minuto.",
    0: "Il servizio non e riuscito a raggiungere Teams (errore di rete): riprova e controlla l'indirizzo del flusso.",
}


SPIEGA_GH = {
    401: "GitHub ha rifiutato il token (401): e scaduto o non valido. Creane uno nuovo e aggiorna il secret GITHUB_TOKEN.",
    403: "GitHub ha negato l'operazione (403): al token manca il permesso Issues in lettura e scrittura sul repository dei feedback.",
    404: "GitHub non trova il repository (404): controlla GITHUB_FEEDBACK_REPO (proprietario/nome) e che il token abbia accesso.",
    410: "Nel repository dei feedback le Issues sono disattivate (410): attivale nelle impostazioni.",
    422: "GitHub ha rifiutato i dati (422): controlla che le Issues siano attive nel repository dei feedback.",
    0: "Il servizio non e riuscito a raggiungere GitHub (errore di rete): riprova.",
}


def spiega_gh(codice):
    return SPIEGA_GH.get(codice) or "GitHub ha risposto con lo stato %s." % codice


def spiega(codice):
    return SPIEGA.get(codice) or ("Power Automate ha avuto un problema (%s): riprova piu tardi e controlla la cronologia del flusso." % codice if codice and codice >= 500 else "Teams ha risposto con lo stato %s." % codice)


def post(url, body, headers):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method="POST", headers=dict({"Content-Type": "application/json", "User-Agent": "design-ops-feedback/1.0"}, **headers))
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            try:
                return r.status, json.loads(r.read().decode() or "{}")
            except Exception:
                return r.status, {}
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode() or "{}")
        except Exception:
            return e.code, {}
    except (urllib.error.URLError, OSError) as e:
        sys.exit("ERRORE: indirizzo non raggiungibile (%s)." % getattr(e, "reason", e))


if a.webhook and not a.url:
    # invio diretto: stessa scheda che costruisce il servizio
    facts = [{"title": "Pagina", "value": a.pagina}] if a.pagina else []
    if a.contatto:
        facts.append({"title": "Contatto", "value": a.contatto})
    facts.append({"title": "Ricevuto", "value": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")})
    body = {"type": "message", "attachments": [{"contentType": "application/vnd.microsoft.card.adaptive", "contentUrl": None, "content": {
        "type": "AdaptiveCard", "$schema": "http://adaptivecards.io/schemas/adaptive-card.json", "version": "1.2", "msteams": {"width": "Full"},
        "body": [{"type": "TextBlock", "text": "Feedback sulla wiki Design Ops", "weight": "Bolder", "size": "Medium", "wrap": True},
                 {"type": "TextBlock", "text": TIPI[a.tipo], "weight": "Bolder", "color": "Attention" if a.tipo == "errore" else "Accent", "spacing": "None", "wrap": True},
                 {"type": "TextBlock", "text": re.sub(r"[\[\]]", "", testo), "wrap": True},
                 {"type": "FactSet", "facts": facts}]}}]}
    target, headers = a.webhook, {}
elif a.url:
    origin = a.origin
    if not origin:
        m = re.search(r'^ALLOWED_ORIGIN\s*=\s*"([^"]*)"', (ROOT / "worker" / "wrangler.toml").read_text(encoding="utf-8"), re.M) if (ROOT / "worker" / "wrangler.toml").exists() else None
        origin = m.group(1) if m else ""
    if not origin:
        sys.exit("ERRORE: indica l'origine del sito con --origin (per esempio https://utente.github.io).")
    body = {"tipo": a.tipo, "messaggio": testo, "contatto": a.contatto, "pagina": {"titolo": a.pagina, "id": "", "path": ""}, "ricerca": "", "versione": "", "sito": ""}
    target, headers = a.url.rstrip("/") + "/feedback", {"Origin": origin}
else:
    sys.exit("ERRORE: indica --url (servizio del sito) oppure --webhook (flusso di Teams).")

if a.dry_run:
    print("Destinazione:", target.split("?")[0]); print(json.dumps(body, ensure_ascii=False, indent=2)); sys.exit(0)
diretto = bool(a.webhook and not a.url)
s, risposta = post(target, body, headers)
if s in (200, 202):
    inviato = risposta.get("inviato") or []
    print("Feedback inviato" + (" a: " + ", ".join(inviato) if inviato else "") + ".")
    for canale, codice in (risposta.get("errori") or {}).items():
        print("ATTENZIONE: %s non ha ricevuto il messaggio. %s" % (canale, spiega(codice) if canale == "teams" else spiega_gh(codice)))
elif diretto:
    sys.exit("ERRORE: invio non riuscito. " + spiega(s))
elif s == 429:
    sys.exit("ERRORE: troppi invii, riprova tra qualche minuto.")
elif s == 503:
    sys.exit("ERRORE: il feedback non e attivo sul servizio (manca TEAMS_WEBHOOK_URL oppure GITHUB_TOKEN e GITHUB_FEEDBACK_REPO).")
elif s == 502 and ("teams" in risposta or "github" in risposta):
    righe = []
    if "teams" in risposta: righe.append(spiega(risposta["teams"]))
    if "github" in risposta: righe.append(spiega_gh(risposta["github"]))
    sys.exit("ERRORE: il servizio ha ricevuto il messaggio ma nessun canale lo ha accettato. " + " ".join(righe))
else:
    sys.exit("ERRORE: invio non riuscito (stato %s)." % s)
