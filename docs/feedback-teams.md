# Feedback su Teams

Chi usa la wiki può scrivere al team con il pulsante "Feedback": il messaggio arriva in un canale di Teams, con il tipo (suggerimento, errore, domanda senza risposta), la pagina o la ricerca da cui si parte e un pulsante per aprire la pagina. Funziona tramite un flusso di Teams ("Workflows") e il servizio delle risposte, che custodisce l'indirizzo segreto del flusso.

## Attivazione, una sola volta
1. **Crea il flusso in Teams.** Per un canale: nel canale apri *⋯ → Workflows* e scegli il modello **"Post to a channel when a webhook request is received"**, seleziona team e canale e crea il flusso. Per la chat "Flussi di lavoro" o per una chat di gruppo segui la sezione "Dove arrivano i messaggi" qui sotto. In ogni caso copia l'indirizzo del flusso: contiene una firma segreta.
2. **Salva l'indirizzo sul servizio, come secret.** In Cloudflare apri *Workers & Pages → design-ops-wiki → Settings → Variables and secrets*, scegli **Add → tipo Secret** e crea `TEAMS_WEBHOOK_URL` con l'indirizzo completo. In alternativa, da terminale nella cartella `worker`: `npx wrangler secret put TEAMS_WEBHOOK_URL`.
   - **Deve essere un secret, non una variabile di testo.** Le variabili di testo si leggono in chiaro nel pannello e, se non sono nel file `wrangler.toml`, vengono cancellate a ogni pubblicazione: il feedback smetterebbe di funzionare dopo il primo push. I secret restano.
   - **Non scriverlo in `wrangler.toml`**: il repository è pubblico e chiunque potrebbe pubblicare messaggi nel tuo canale.
   - **L'indirizzo deve essere completo.** Un flusso con trigger "Anyone" ha un indirizzo che, dopo `api-version=1`, continua con parametri come `sp`, `sv` e `sig`. Se il tuo finisce con `api-version=1`, è stato copiato troppo corto e Teams rifiuterà le richieste.
3. **Prova.** `python3 scripts/teams_feedback.py "Prova" --url https://design-ops-wiki.<sottodominio>.workers.dev`. Dopo qualche secondo il messaggio compare nel canale; il servizio risponde "Feedback inviato".
4. **Controlla il sito.** Ricarica la pagina senza cache: nell'intestazione e nel piè di pagina c'è "Feedback". Se non lo vedi manca `WORKER_URL` (vedi `docs/setup-sito.md`).

## Dove arrivano i messaggi

| Destinazione | Chi li vede | Quando sceglierla |
|---|---|---|
| Canale di Teams | Tutti i membri del canale | Feedback gestiti dal team (consigliato). I Workflows non pubblicano nei canali privati |
| Chat di gruppo | Chi partecipa alla chat | Pochi referenti |
| Chat "Flussi di lavoro" (la chat con il Flow bot) | Solo il destinatario indicato nel flusso | Se una persona sola gestisce i feedback, oppure per le prove |

I messaggi non cambiano: il servizio invia sempre la stessa scheda, e conta solo dove la pubblica il flusso. Nei canali e nelle chat di gruppo il mittente appare come "[nome di chi ha creato il flusso] via Workflows".

### Usare la chat "Flussi di lavoro"
I modelli già pronti puntano a un canale, quindi il flusso va creato da zero. Dal menu dell'app Workflows di Teams (o da Power Automate, *Crea → Flusso cloud istantaneo*):
1. Trigger **When a Teams webhook request is received**. In **Who can trigger the flow?** scegli **Anyone**: senza questa impostazione il servizio riceve un errore 401.
2. Azione **Post card in a chat or channel** con **Post as: Flow bot**, **Post in: Chat with Flow bot** e, in **Recipient**, l'indirizzo email di chi deve ricevere i feedback. Per una chat di gruppo scegli invece **Post in: Group chat**.
3. In **Adaptive card** inserisci il contenuto dinamico **Attachment adaptive card** preso dal trigger.
4. Salva, copia l'indirizzo del trigger e prosegui dal punto 2 dell'attivazione.

Le voci possono avere nomi leggermente diversi nella lingua del tuo Teams. Con la chat "Flussi di lavoro" tieni presente che:
- chi la riceve la può silenziare, e un feedback non letto non è visibile a nessun altro;
- per avvisare più persone serve un'azione per ciascun destinatario, oppure una chat di gruppo o un canale;
- se il destinatario lascia l'organizzazione, i messaggi non arrivano più.

## Cosa arriva in Teams
Una scheda con: tipo, messaggio, pagina, testo cercato, contatto (se l'utente lo ha scritto), versione del plugin e data. Se l'utente parte da una pagina, c'è il pulsante "Apri la pagina".

## Dallo script
- Tramite il servizio del sito (consigliato): `python3 scripts/teams_feedback.py "Il passo 4 non è chiaro" --tipo errore --pagina "Il percorso · Wireframe" --url https://design-ops-wiki.<sottodominio>.workers.dev`
- Direttamente al flusso di Teams, per chi amministra: `TEAMS_WEBHOOK_URL="https://..." python3 scripts/teams_feedback.py "Prova"`
- `--dry-run` mostra il messaggio senza inviarlo; il testo può arrivare anche da standard input (`echo "testo" | python3 scripts/teams_feedback.py -`).

## Protezioni
- Si accettano solo richieste dal sito, e il messaggio è limitato a 1.000 caratteri.
- Al massimo 5 invii ogni 10 minuti per indirizzo. Un campo nascosto, che le persone non vedono, ferma i programmi automatici.
- I link nel testo vengono neutralizzati, così un messaggio non può portare un collegamento cliccabile in Teams.
- Il servizio non salva nulla e non registra l'indirizzo di chi scrive: i messaggi restano solo in Teams. Il modulo ricorda di non scrivere dati personali o riservati.

## Se qualcosa non va

| Sintomo | Causa probabile | Cosa fare |
|---|---|---|
| Lo script dice "il feedback non è attivo" (503) | Manca il secret `TEAMS_WEBHOOK_URL` | Aggiungilo in Cloudflare (passo 2) |
| "invio non riuscito (502)" | Il flusso è disattivato o l'indirizzo non è più valido | In Power Automate controlla la cronologia del flusso e, se serve, creane uno nuovo e aggiorna il secret |
| Il messaggio non compare in Teams ma l'invio è riuscito | Il flusso è fermo o la scheda è vuota | Controlla la cronologia esecuzioni del flusso |
| Il servizio risponde "invio non riuscito" (502) e in Power Automate compare l'errore 401 | Nel trigger non è impostato **Who can trigger the flow? = Anyone** | Cambia l'impostazione e salva il flusso |
| Il feedback funzionava e ha smesso dopo un aggiornamento | `TEAMS_WEBHOOK_URL` era una variabile di testo e la pubblicazione l'ha cancellata | Ricrealo come secret (passo 2) |
| "troppi invii" (429) | Limite di 5 messaggi in 10 minuti | Riprova più tardi |

## Da sapere
- I flussi di Teams (Workflows) sono legati a chi li crea e non al canale: se il proprietario lascia l'organizzazione o disattiva il flusso, i messaggi si fermano. Aggiungi almeno un secondo proprietario in Power Automate.
- Il vecchio sistema dei connettori webhook di Office 365 è in ritiro: questa guida usa Workflows, la soluzione indicata da Microsoft.
