# Manutenzione e rilasci

## Come è organizzato il repository

| Cartella | Contenuto | Si distribuisce? |
| --- | --- | --- |
| `plugin/` | Solo le istruzioni: manifest, skill, comandi e un README breve | Sì, come zip |
| `docs/` | Domande frequenti, guida, collaudo, guide dei flussi e template | No: diventa il sito |
| `site/` | Il generatore del sito e la ricerca | No |
| `worker/` | Il servizio che scrive le risposte intelligenti | No |
| `tests/` | Collaudi automatici di sito e servizio | No |
| `scripts/` | Rilascio, controlli e pacchetto del plugin | No |

Il plugin non contiene la documentazione: la documentazione vive online e si ricostruisce da sola.

## Applicare un aggiornamento ricevuto come zip
Dalla cartella del repository: `bash scripts/apply_update.sh ~/Downloads/<nome-dello-zip>.zip`. Lo script **unisce** i file dello zip a quelli esistenti e mostra l'elenco dei file cambiati; poi si fa commit e push. In alternativa, `unzip -o <zip>` nella cartella del repository.

Non trascinare le cartelle dello zip nel Finder scegliendo "Sostituisci": il Finder sostituisce l'intera cartella e cancella i file che lo zip non contiene (script, guide, configurazione del servizio). Se capita, il flusso "Sito" fallisce al primo passo.

## Cambiare la documentazione
1. Modifica i file in `docs/`. Le risposte stanno in `docs/faq.md`: una domanda per titolo `###`.
2. Fai commit su `main`. Il flusso "Sito" ricostruisce e ripubblica il sito, e aggiorna anche il servizio delle risposte intelligenti.

Ogni nuova funzione richiede tre cose:
- la sua domanda in `docs/faq.md`, con sotto il titolo l'argomento come commento: `<!-- argomento: per-iniziare -->`. Gli argomenti validi sono in `site/topics.json`; senza argomento il sito non si costruisce;
- una domanda di prova in `site/wiki-test-queries.json`;
- se è tra le più cercate, il titolo in `popular` di `site/topics.json`: sono i pulsanti sotto la ricerca nella home.

I controlli automatici verificano che la ricerca trovi la sezione attesa e che la pagina funzioni.

## Rilasciare una nuova versione del plugin
1. Modifica le skill o i comandi in `plugin/`.
2. `python3 scripts/release.py X.Y.Z --note "cosa cambia"`: aggiorna versione e changelog, controlla le skill e la ricerca del sito. Se un controllo fallisce, riporta i file alla versione precedente.
3. Commit, poi `git tag vX.Y.Z` e `git push --tags`.
4. Il flusso "Rilascio" crea lo zip del plugin e lo allega alla release di GitHub.
5. Carica lo zip (*Customize → Plugins*) oppure ripubblicalo all'organizzazione.

Il sito mostra in alto la versione del plugin e la data di aggiornamento, e la sezione Rilasci riporta il changelog.

Versioni: patch per correzioni, minore per nuove funzioni, maggiore per cambi che rompono i progetti esistenti.

## Il percorso interattivo
La pagina "Il percorso" legge `site/flow.json`: per ogni passo ci sono titolo, sintesi, input, output, comandi, controllo del designer, sessione, gate, "se ti perdi" e domande correlate; per ogni scambio con il Product Snapshot ci sono le due direzioni. Quando cambia un passo del processo, aggiorna quel file: il sito, la ricerca e le risposte dell'assistente si aggiornano insieme. Le domande correlate devono esistere in `docs/faq.md`, altrimenti il sito non si costruisce.

## Feedback
Il pulsante "Feedback" invia un messaggio al canale di Teams scelto: attivazione e problemi in `docs/feedback-teams.md`.

## Controlli automatici
A ogni modifica il repository verifica che ogni skill abbia nome e descrizione validi e che i riferimenti ai file esistano, che il sito si costruisca, che la ricerca trovi la sezione attesa per le domande di prova, che il servizio delle risposte si comporti come previsto (sicurezza, modelli di riserva, cache, limiti) e che la pagina funzioni. Ogni lunedì un controllo a parte verifica che le risposte del servizio pubblicato funzionino ancora.

## Risposte intelligenti
Il sito cerca per parole nei propri contenuti. Il pulsante "Chiedi all'assistente" invia la domanda al servizio in `worker/`, che ritrova le sezioni pertinenti, le passa a un modello gratuito di Cloudflare Workers AI e restituisce una risposta breve con le fonti. Il servizio ha lo stesso contenuto del sito, perché viene pubblicato dallo stesso flusso: risposta e documentazione restano allineate. Se la documentazione non copre la domanda, non interroga il modello e risponde "Non è documentato nel plugin". Configurazione, limiti e che cosa fare se un modello viene ritirato: `docs/setup-sito.md`.
