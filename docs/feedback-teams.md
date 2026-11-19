# Feedback dal sito al team

Chi usa la wiki può scrivere al team con il pulsante "Feedback": il messaggio arriva al team come email di GitHub, come messaggio in Teams, o in entrambi i modi, con il tipo (suggerimento, errore, domanda senza risposta), la pagina o la ricerca da cui si parte e un pulsante per aprire la pagina. Funziona tramite un flusso di Teams ("Workflows") e il servizio delle risposte, che custodisce l'indirizzo segreto del flusso.

## Attivazione, una sola volta
1. **Crea il flusso in Teams.** Per un canale: nel canale apri *⋯ → Workflows* e scegli il modello **"Post to a channel when a webhook request is received"**, seleziona team e canale e crea il flusso. Per la chat "Flussi di lavoro" o per una chat di gruppo segui la sezione "Dove arrivano i messaggi" qui sotto. In ogni caso copia l'indirizzo del flusso: contiene una firma segreta.
2. **Salva l'indirizzo sul servizio, come secret.** In Cloudflare apri *Workers & Pages → design-ops-wiki → Settings → Variables and secrets*, scegli **Add → tipo Secret** e crea `TEAMS_WEBHOOK_URL` con l'indirizzo completo. In alternativa, da terminale nella cartella `worker`: `npx wrangler secret put TEAMS_WEBHOOK_URL`.
   - **Deve essere un secret, non una variabile di testo.** Le variabili di testo si leggono in chiaro nel pannello e, se non sono nel file `wrangler.toml`, vengono cancellate a ogni pubblicazione: il feedback smetterebbe di funzionare dopo il primo push. I secret restano.
   - **Non scriverlo in `wrangler.toml`**: il repository è pubblico e chiunque potrebbe pubblicare messaggi nel tuo canale.
   - **L'indirizzo deve essere completo.** Un flusso con trigger "Anyone" ha un indirizzo che, dopo `api-version=1`, continua con parametri come `sp`, `sv` e `sig`. Se il tuo finisce con `api-version=1`, è stato copiato troppo corto e Teams rifiuterà le richieste.
3. **Prova.** `python3 scripts/teams_feedback.py "Prova" --url https://design-ops-wiki.<sottodominio>.workers.dev`. Dopo qualche secondo il messaggio compare nel canale; il servizio risponde "Feedback inviato".
4. **Controlla il sito.** Ricarica la pagina senza cache: nell'intestazione e nel piè di pagina c'è "Feedback". Se non lo vedi manca `WORKER_URL` (vedi `docs/setup-sito.md`).

## Se "Anyone" non è disponibile: feedback tramite GitHub
Un indirizzo del flusso senza `sig=` richiede un accesso Microsoft (Entra) che il servizio non può dare: capita quando l'organizzazione impone l'accesso con l'account aziendale, o quando l'impostazione "Anyone" non si applica al tuo ambiente. In quel caso il servizio salva ogni feedback come *issue* in un repository GitHub **privato**, e GitHub ti avvisa per email, senza bisogno di Power Automate. Se la tua organizzazione lo consente, un flusso può portare l'issue anche in Teams. Non serve nessun accesso anonimo.

1. **Crea un repository privato**, per esempio `design-ops-feedback`, con le Issues attive (lo sono di default).
2. **Crea un token.** In GitHub: *Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token*. Come proprietario scegli il tuo utente, come accesso **Only select repositories** con solo il repository dei feedback, e in *Repository permissions* imposta **Issues: Read and write**. Scegli la scadenza più lunga consentita e metti un promemoria per rinnovarlo.
3. **Salva due secret in Cloudflare** (*Workers & Pages → design-ops-wiki → Settings → Variables and secrets → Add → Secret*): `GITHUB_TOKEN` con il token e `GITHUB_FEEDBACK_REPO` con `proprietario/design-ops-feedback`. Poi distribuisci la modifica.
4. **Prova.** `python3 scripts/teams_feedback.py "Prova" --url https://design-ops-wiki.<sottodominio>.workers.dev` deve rispondere "Feedback inviato a: github." e nel repository compare una issue.
5. **Ricevi la notifica.** Scegli una di queste strade:
   - **Email di GitHub (la più semplice: nessun flusso, nessun accesso speciale).**
     1. Nel repository dei feedback usa *Watch → All activity* (oppure *Custom → Issues*).
     2. Nel tuo profilo, in *Settings → Notifications*, lascia selezionata **Email** sotto *Watching* e, nelle preferenze delle email, attiva **Include your own updates**: per impostazione predefinita GitHub non ti avvisa delle tue stesse azioni, e le issue create dal servizio con il tuo token risultano tue. Le altre persone non ne hanno bisogno.
     3. Per avvisare il team, aggiungi i colleghi in *Settings → Collaborators* del repository: ognuno fa *Watch → All activity* e riceve un'email per ogni feedback.
     4. Con l'app **GitHub Mobile** ricevi anche la notifica sul telefono.
   - **Power Automate → Teams** (solo se la politica dell'organizzazione lo consente). Accedendo a GitHub quando richiesto, scegli uno di questi trigger:
     - **When an issue is opened** (*Quando viene aperto un problema*), con proprietario e nome del repository dei feedback: scatta per ogni issue ed è la scelta più semplice;
     - **When an issue is assigned to me** (*Quando un nuovo problema viene aperto e assegnato all'utente*): scatta solo per le issue assegnate all'account GitHub collegato. Funziona perché il servizio assegna ogni feedback al proprietario del repository; per assegnarli a un'altra persona crea il secret `GITHUB_FEEDBACK_ASSIGNEE` con il suo nome utente GitHub (con `-` non si assegna a nessuno, e quel trigger non scatterà).
     Come azione di Teams scegli **Post message in a chat or channel**, oppure l'azione che pubblica un messaggio per te stesso nella chat "Flussi di lavoro", con titolo, testo e link dell'issue presi dai contenuti dinamici del trigger.
6. **Prova di nuovo.** Con le email di GitHub arriva un messaggio da `notifications@github.com` con titolo e testo del feedback; con Power Automate arriva in Teams.

Da sapere:
- Ogni feedback resta come issue nel repository privato: si può tracciare e chiudere quando è gestito.
- Se Power Automate mostra **"Sospeso: Non è possibile eseguire il flusso di lavoro perché è bloccato dai criteri dei dati dell'organizzazione"**, la politica dell'organizzazione (DLP) non consente di collegare GitHub a Teams: non serve alcun flusso, usa le email di GitHub del punto 5.
- Se il token scade, lo script risponde "GitHub ha rifiutato il token (401)": ne crei uno nuovo e aggiorni il secret.
- Si possono usare **entrambi i canali**: se sono configurati Teams e GitHub, il messaggio va a tutti e due, e lo script dice quali lo hanno ricevuto.
- Non sono incluse altre strade, come autenticare il servizio con un'app Microsoft Entra: richiede un amministratore dell'organizzazione.

## Il flusso risulta "Sospeso: bloccato dai criteri dei dati"
Significa che l'organizzazione applica una politica di prevenzione della perdita di dati (DLP) di Power Platform: un flusso non può usare insieme connettori di gruppi diversi, per esempio GitHub e Microsoft Teams, oppure usa un connettore vietato. Non dipende da come hai costruito il flusso, e il servizio non c'entra: la decisione la prende l'amministratore.

Hai tre strade, in ordine di semplicità:
1. **Senza Power Automate: l'app GitHub per Teams.** Nel canale scelto aggiungi l'app **GitHub** (*+ → App*) e collega il tuo account. Poi scrivi nel canale `@GitHub subscribe proprietario/design-ops-feedback issues`: ogni nuova issue compare nel canale, senza flussi e senza criteri dei dati. Dipende dai permessi sulle app di Teams della tua organizzazione.
2. **Senza Teams: le notifiche di GitHub.** Ricevi un'email, o una notifica sull'app mobile di GitHub, per ogni nuova issue del repository dei feedback. Dalle impostazioni notifiche di GitHub attiva l'email e controlla l'opzione per ricevere anche i tuoi aggiornamenti: le issue le crea il servizio con il tuo token, quindi risultano scritte da te.
3. **Chiedere un'eccezione all'amministratore.** La richiesta è piccola: inserire il connettore **GitHub** nello stesso gruppo del connettore **Microsoft Teams** (Business) per l'ambiente che usi, oppure un'eccezione per quel flusso. Il flusso gestisce solo suggerimenti e segnalazioni sulla documentazione, non dati dei clienti. Dopo la modifica riapri il flusso, salvalo e riattivalo.

Chi amministra può vedere quale criterio blocca il flusso nell'interfaccia di amministrazione di Power Platform. Lo stesso tipo di criteri può spiegare perché un indirizzo di flusso con accesso anonimo non è disponibile.

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
- Il servizio non conserva nulla e non registra l'indirizzo di chi scrive: i messaggi restano in Teams e, se usi il canale GitHub, come issue nel repository privato. Il modulo ricorda di non scrivere dati personali o riservati.

## Diagnosi dal sito
Apri `https://<proprietario>.github.io/<repository>/#diagnosi`: la pagina controlla, dal tuo browser, che il servizio sia raggiungibile, mostra quali canali di feedback sono configurati (Teams, GitHub) e permette di inviare un messaggio di prova, spiegando in italiano il motivo di ogni rifiuto. È il modo più rapido per capire perché dal sito il feedback non parte.

## Se qualcosa non va

| Sintomo | Causa probabile | Cosa fare |
|---|---|---|
| Lo script dice "il feedback non è attivo" (503) | Manca il secret `TEAMS_WEBHOOK_URL` | Aggiungilo in Cloudflare (passo 2) |
| "invio non riuscito (502)" | Il flusso è disattivato o l'indirizzo non è più valido | In Power Automate controlla la cronologia del flusso e, se serve, creane uno nuovo e aggiorna il secret |
| Il messaggio non compare in Teams ma l'invio è riuscito | Il flusso è fermo o la scheda è vuota | Controlla la cronologia esecuzioni del flusso |
| Il servizio risponde "invio non riuscito" (502) e in Power Automate compare l'errore 401 | Nel trigger non è impostato **Who can trigger the flow? = Anyone** | Cambia l'impostazione e salva il flusso |
| Il feedback funzionava e ha smesso dopo un aggiornamento | `TEAMS_WEBHOOK_URL` era una variabile di testo e la pubblicazione l'ha cancellata | Ricrealo come secret (passo 2) |
| "troppi invii" (429) | Limite di 5 messaggi in 10 minuti | Riprova più tardi |

## Il servizio risponde 502: leggere il codice di Teams
Un 502 significa che il servizio ha ricevuto il messaggio ma Teams lo ha rifiutato. Lo script `scripts/teams_feedback.py` mostra il codice con cui Teams ha risposto e lo spiega. Per provare l'indirizzo del flusso senza passare dal servizio, dal terminale (l'indirizzo va tra virgolette perché contiene il carattere `&`, e non va incollato in chat né nei file):
`TEAMS_WEBHOOK_URL="<indirizzo completo>" python3 scripts/teams_feedback.py "Prova diretta"`

| Codice di Teams | Causa probabile | Cosa fare |
|---|---|---|
| 401 o 403 | L'indirizzo è senza firma (deve contenere `sig=` dopo `api-version=1`) oppure il trigger non è su **Anyone** | Copia di nuovo l'indirizzo completo dal trigger e imposta **Who can trigger the flow? = Anyone** |
| 404 o 410 | Indirizzo scritto male o flusso eliminato | Controlla l'indirizzo, oppure crea un nuovo flusso e aggiorna il secret |
| 400 | Formato non accettato dal flusso | Nell'azione **Post card in a chat or channel** il contenuto della scheda deve essere **Attachment adaptive card** preso dal trigger |
| 429 | Power Automate limita le richieste | Riprova tra qualche minuto |
| 500 o più | Problema di Power Automate | Controlla la cronologia del flusso e riprova |
| 0 | Il servizio non ha raggiunto Teams (rete) | Riprova e controlla l'indirizzo |

Per il canale GitHub i codici sono questi:

| Codice di GitHub | Causa probabile | Cosa fare |
|---|---|---|
| 401 | Token scaduto o non valido | Crea un nuovo token e aggiorna `GITHUB_TOKEN` |
| 403 | Al token manca il permesso Issues in lettura e scrittura | Correggi i permessi del token |
| 404 | Repository non trovato o token senza accesso | Controlla `GITHUB_FEEDBACK_REPO` (proprietario/nome) e l'accesso del token |
| 410 o 422 | Issues disattivate nel repository | Attivale nelle impostazioni del repository |

Se l'issue compare nel repository ma non ricevi né email né messaggi in Teams: per le email controlla di aver fatto *Watch* sul repository e di aver attivato **Include your own updates**; per Power Automate, controlla il trigger del flusso: "assegnato all'utente" parte solo se l'issue è assegnata all'account GitHub collegato al flusso. Apri l'issue e verifica il campo *Assignees*, oppure passa al trigger **When an issue is opened**.

## Da sapere
- I flussi di Teams (Workflows) sono legati a chi li crea e non al canale: se il proprietario lascia l'organizzazione o disattiva il flusso, i messaggi si fermano. Aggiungi almeno un secondo proprietario in Power Automate.
- Il vecchio sistema dei connettori webhook di Office 365 è in ritiro: questa guida usa Workflows, la soluzione indicata da Microsoft.
