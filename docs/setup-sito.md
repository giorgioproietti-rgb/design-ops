# Pubblicare il sito e le risposte intelligenti

Il sito è pubblico e gratuito. Ha due parti: le pagine (GitHub Pages) e il servizio delle risposte (Cloudflare Workers AI). Le pagine funzionano anche da sole, con la ricerca per parole; il servizio aggiunge una risposta breve scritta da un modello, basata solo sulla documentazione.

## Cosa serve
- Un account GitHub e un account Cloudflare gratuito (senza carta di credito).
- `git` e la GitHub CLI (`gh`), con l'accesso fatto una volta: `gh auth login`.
- Da Cloudflare: l'**Account ID** (nella pagina principale del pannello) e un **token API** creato dal modello "Edit Cloudflare Workers" (*My Profile → API Tokens → Create Token*). Se il primo deploy segnala permessi mancanti, aggiungi al token il permesso "Workers AI".
- Una sola volta, in Cloudflare (*Workers & Pages*), registra il sottodominio `workers.dev` se il pannello lo chiede.

## Mettere tutto online
1. Dalla cartella del repository: `./scripts/setup_github.sh <proprietario> <repository>`.
   Lo script scrive l'origine del sito nella configurazione, crea il repository pubblico, ti chiede Account ID e token (che salva come secret e non scrive mai nei file), pubblica il codice, attiva GitHub Pages e lancia il flusso "Sito".
2. Dopo qualche minuto il sito è su `https://<proprietario>.github.io/<repository>/`.
3. Quando il flusso ha pubblicato il servizio, copia il suo indirizzo (`https://design-ops-wiki.<sottodominio>.workers.dev`, nel log del passo "Pubblica il servizio delle risposte") e lancia:
   `gh variable set WORKER_URL --body "<indirizzo>"` e poi `gh workflow run docs.yml`.
   Da questo momento il sito mostra il pulsante "Chiedi all'assistente".

## Come funzionano le risposte
- Il sito cerca per parole nei propri contenuti. Il pulsante invia la domanda al servizio, che ritrova le sezioni pertinenti, le passa a un modello (Llama, su Workers AI) e restituisce una risposta breve con le fonti.
- Se la documentazione non copre la domanda, il servizio non interroga il modello e risponde "Non è documentato nel plugin".
- Le risposte hanno sempre le fonti cliccabili e un avviso: sono generate da un modello, quindi vanno controllate.
- Il servizio è lo stesso codice e lo stesso contenuto del sito, pubblicati dalla stessa esecuzione: risposte e documentazione restano allineate.

## Costi e limiti (gratis)
- Workers AI offre 10.000 "neuroni" al giorno senza costi, con il limite che si azzera ogni giorno alle 00:00 UTC. Una risposta usa circa 600 token in ingresso e 200 in uscita, quindi qualche decina di neuroni al massimo: bastano centinaia di risposte al giorno. Il consumo dipende dal modello e dal listino di Cloudflare, che può cambiare.
- Le domande già fatte si risolvono da una cache e non consumano la quota.
- Se la quota giornaliera finisce, la pagina lo dice e resta la ricerca per parole.
- Il servizio limita la lunghezza di domanda e risposta e il numero di richieste per indirizzo, e accetta solo richieste dal sito.
- Non si supera mai il piano gratuito senza un'azione tua: oltre i 10.000 neuroni le richieste falliscono, finché non si passa volontariamente a un piano a pagamento.

## Se Cloudflare ritira un modello
Cloudflare ritira i modelli con regolarità (per esempio `llama-3.1-8b-instruct` è stato deprecato a maggio 2026). Per questo:
- `LLM_MODELS` in `worker/wrangler.toml` è un elenco: se un modello non risponde, il servizio prova il successivo.
- Il flusso "Controllo servizio" verifica ogni lunedì che le risposte funzionino, e dopo ogni pubblicazione. Se fallisce, GitHub avvisa chi gestisce il repository.
- Per correggere: scegli un modello dall'elenco su https://developers.cloudflare.com/workers-ai/models/, aggiornalo in `LLM_MODELS` e fai un push.

## Feedback su Teams (facoltativo)
Per ricevere in un canale di Teams i feedback degli utenti serve un flusso di Teams e un secret sul servizio: la procedura è in `docs/feedback-teams.md`.

## Verifica
`python3 scripts/smoke_test.py --url <indirizzo del servizio>` controlla lo stato, una domanda in tema e una fuori tema.

## Il sito è pubblico
Chiunque conosca l'indirizzo può leggere il sito e fare domande. Nei file di `docs/` e nelle istruzioni delle skill non inserire indirizzi interni, identificativi del tenant, nomi di persone o dati riservati.

## Altri fornitori (facoltativo)
Il servizio funziona anche con fornitori compatibili con il formato OpenAI e con l'API di Anthropic: imposta `LLM_PROVIDER` (`openai` o `anthropic`), `LLM_BASE_URL` e `LLM_MODELS` in `worker/wrangler.toml` e aggiungi il secret `LLM_API_KEY` nel pannello Cloudflare. Servono un account e una chiave presso il fornitore.
