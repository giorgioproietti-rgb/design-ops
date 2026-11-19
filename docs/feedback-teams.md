# Feedback su Teams

Chi usa la wiki può scrivere al team con il pulsante "Feedback": il messaggio arriva in un canale di Teams, con il tipo (suggerimento, errore, domanda senza risposta), la pagina o la ricerca da cui si parte e un pulsante per aprire la pagina. Funziona tramite un flusso di Teams ("Workflows") e il servizio delle risposte, che custodisce l'indirizzo segreto del flusso.

## Attivazione, una sola volta
1. **Crea il flusso in Teams.** Nel canale che deve ricevere i messaggi apri *⋯ → Workflows* e scegli il modello **"Post to a channel when a webhook request is received"**. Seleziona team e canale e crea il flusso. Copia l'indirizzo che Teams mostra: contiene una firma segreta.
2. **Salva l'indirizzo sul servizio.** In Cloudflare apri *Workers & Pages → design-ops-wiki → Settings → Variables and secrets* e aggiungi il secret `TEAMS_WEBHOOK_URL` con quell'indirizzo. Non scriverlo mai nel repository né in una pagina.
3. **Prova.** `python3 scripts/teams_feedback.py "Prova" --url https://design-ops-wiki.<sottodominio>.workers.dev`. Dopo qualche secondo il messaggio compare nel canale; il servizio risponde "Feedback inviato".
4. **Controlla il sito.** Ricarica la pagina senza cache: nell'intestazione e nel piè di pagina c'è "Feedback". Se non lo vedi manca `WORKER_URL` (vedi `docs/setup-sito.md`).

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
| "troppi invii" (429) | Limite di 5 messaggi in 10 minuti | Riprova più tardi |

## Da sapere
- I flussi di Teams (Workflows) sono legati a chi li crea e non al canale: se il proprietario lascia l'organizzazione o disattiva il flusso, i messaggi si fermano. Aggiungi almeno un secondo proprietario in Power Automate.
- Il vecchio sistema dei connettori webhook di Office 365 è in ritiro: questa guida usa Workflows, la soluzione indicata da Microsoft.
