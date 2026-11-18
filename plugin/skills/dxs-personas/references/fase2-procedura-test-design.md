# Test sul design in personaggio (Fase 2, `--testDesign`)

## FASE 2 – Test sul design (`--testDesign`)

## 2.1 – Prerequisiti

**Personaggi.** Leggi in `<cartella testata>/personaggi-del-progetto.md` la sezione più recente del progetto corrente. Per i personaggi indicati con un ID, leggi il blocco "Personaggio critico" in `personas.md` o `protopersonas.md`, con le journey adattate. Se il file o la sezione non esistono, esegui prima la Fase 1, dichiarandolo.

**Link al design**, in quest'ordine:
1. link Figma presente nella richiesta
2. voce `Figma WF` di `project.md` (`Figma UI` solo se l'utente chiede di testare la UI). Voce vuota o assente → cerca una voce come "Figma", "Design", "Prototipo" o il primo URL `figma.com`
3. se non c'è, chiedilo

Se `project.md` contiene più link Figma e nessuno è `Figma WF`, elencali e chiedi quale testare.

**Vincoli.** Se accanto a `project.md` esiste `vincoli.md`, leggi le righe `aperto` e `recepito`. Un problema che dipende da un vincolo noto non è una correzione del design: `Tipo` = `vincolo`, con il `VIN-NN` nel campo del problema (`references/fase2-procedura-test-design.md` §8).

## 2.2 – Il test

Il test coinvolge **tutti i personaggi del progetto**, ciascuno con **2 user journey**, valutate su **task completion** e **sentiment journey**, tenuti separati.

### Test completo e test veloce

- `--testDesign` → test completo, entrambi i piani
- `--testDesign --task` → solo task completion
- `--testDesign --sentiment` → solo sentiment journey

Nel test veloce le journey restano 2 per personaggio, ma:
- non chiedere conferma delle journey: proponile ed eseguile subito, elencandole in testa al report
- valuta e riporta solo il piano richiesto
- la recensione in personaggio si riduce al verdetto e alle 3 lamentele più forti
- il filtro pragmatico resta obbligatorio
- chiudi segnalando che l'altro piano non è stato valutato e offrendo di eseguirlo

Procedura dettagliata, scale, recensione e filtro pragmatico: `references/fase2-procedura-test-design.md`. Leggilo prima di iniziare.

In sintesi:
1. Recupera i frame dal link (screenshot con immagine incorporata + struttura/testi; le annotation dei frame e il frame "Legenda · ID" spiegano requisiti e principi)
2. Definisci le 2 journey per ogni personaggio sul file reale e chiedi conferma in un solo passaggio (non nel test veloce)
3. Percorri ogni journey in personaggio, frame per frame, un personaggio alla volta
4. Valuta task completion e sentiment (solo uno dei due con `--task` o `--sentiment`)
5. Scrivi la recensione in personaggio
6. Esci dal personaggio e applica il filtro pragmatico (ROSSO / GIALLO / BIANCO / VERDE): obbligatorio
7. Riepilogo journey e massimo 10 problemi prioritizzati

---

---

Per ogni personaggio critico del progetto (da `personaggi-del-progetto.md`) il test percorre **2 user journey** e valuta ciascuna su due piani:
- **Task completion**: il personaggio riesce a portare a termine il compito? Con quanti passaggi e dove si blocca?
- **Sentiment journey**: come cambia il suo stato d'animo passo dopo passo? Dove cresce la frustrazione, dove si rilassa, in che punto rischia di abbandonare?

I due piani vanno tenuti separati perché misurano cose diverse: una journey può essere completata e lasciare comunque il personaggio esasperato, oppure piacergli finché non si blocca all'ultimo passo.

## Modalità

- **`--testDesign`** (test completo): esegui tutte le sezioni.
- **`--testDesign --task`**: salta la sezione 5 (sentiment) e, nel riepilogo finale, le colonne sul sentiment. Nella sezione 3 non annotare lo stato d'animo, solo le azioni.
- **`--testDesign --sentiment`**: salta la sezione 4 (task completion) e, nel riepilogo finale, le colonne su esito e passaggi. Il personaggio prosegue comunque lungo il percorso ideale anche dove si bloccherebbe, così la curva copre l'intera journey; segna questi punti come "forzato" nella tabella del sentiment.

In entrambe le modalità veloci: niente conferma preliminare delle journey (sezione 2), recensione ridotta (sezione 6), filtro pragmatico applicato solo ai problemi del piano valutato.

## 1. Recuperare il design

Il link arriva dalla richiesta o da `project.md` (voce `Figma WF`) (vedi SKILL.md, passo 2.1). Dal link ricava file key e node-id. Con il connettore Figma:
- `get_screenshot` su ciascun frame da analizzare: è ciò che il personaggio "vede"
- `get_metadata` per l'elenco dei frame figli, dei testi e dell'ordine degli elementi

Se esiste un prototipo con collegamenti, usa l'ordine dei collegamenti per ricostruire i percorsi. Distingui mobile e desktop: fai lavorare ciascun personaggio sul device del suo contesto d'uso; se il file contiene solo l'altro, dichiaralo come limite.

## 2. Definire le 2 user journey per personaggio

Parti dalle journey già abbozzate nella scheda del personaggio e verificale sul file:
- **Journey A – compito principale**: la cosa che il personaggio fa più spesso (es. leggere le 3 notizie principali prima della fermata).
- **Journey B – compito secondario o situazione critica**: un obiettivo diverso o un punto d'ingresso diverso, scelto per mettere sotto pressione il design (es. arriva da un link social direttamente su un articolo e incontra il paywall; vuole ritrovare un articolo letto ieri; vuole seguire una partita in diretta).

Per ogni journey scrivi:
- **Obiettivo** formulato come lo direbbe il personaggio
- **Punto d'ingresso** (home, articolo da link esterno, notifica, newsletter…)
- **Criterio di completamento** verificabile sul design ("vede il risultato finale della partita", non "si informa")
- **Percorso ideale**: sequenza di frame e numero minimo di passaggi
- **Frame coinvolti** (nome o node-id)

Se il file non contiene i frame necessari per una journey, proponi una journey alternativa coperta dal file e segnalalo. Nel test completo, prima di eseguire, mostra all'utente le journey proposte per tutti i personaggi e chiedi conferma in un solo passaggio; nel test veloce eseguile subito ed elencale in testa al report.

## 3. Eseguire la journey (in personaggio)

Resta nel personaggio e percorri la journey frame per frame. Per ogni passo annota:
- cosa vede per primo e se capisce dove si trova
- cosa fa per avanzare (tap, scroll, ricerca, ritorno indietro)
- se l'azione lo porta avanti, lo devia o lo blocca
- come si sente e cosa direbbe in quel momento

Categorie di attrito da tenere d'occhio: prima impressione, gerarchia editoriale (notizia, opinione, sponsorizzato, live), leggibilità (testo, contrasto, aree di tocco), terminologia da redazione o da prodotto, navigazione e orientamento, interruzioni (paywall, cookie, popup newsletter, login, pubblicità), stati vuoti ed errori se previsti nel file.

Sul design statico non si possono misurare tempi reali o errori tecnici: le stime vanno dichiarate come tali.

## 4. Valutazione task completion

Per ogni journey:

| Campo | Valore |
|---|---|
| Esito | ✅ Completata · ⚠️ Completata con difficoltà · ❌ Non completata |
| Passaggi effettivi / ideali | es. 7 / 3 |
| Deviazioni | passi fuori percorso, ritorni indietro |
| Punti di blocco | frame e motivo |
| Errori probabili | azioni sbagliate che il design induce |
| Tempo percepito | stima qualitativa (rapido / accettabile / lungo) |

Più di 5 passaggi per il compito principale è quasi sempre un problema serio. Una journey "completata con difficoltà" va sempre spiegata: è lì che di solito si nascondono i problemi più utili.

## 5. Valutazione sentiment journey

Per ogni passo della journey assegna un punteggio emotivo su scala da −2 a +2:

| Punteggio | Stato |
|---|---|
| +2 | soddisfatto, sorpreso in positivo |
| +1 | a suo agio |
| 0 | neutro |
| −1 | irritato, confuso |
| −2 | esasperato, sul punto di abbandonare |

Tabella del sentiment:

| # | Frame | Azione | Sentiment | Frase del personaggio | Causa |
|---|---|---|---|---|---|

Poi sintetizza:
- **Curva**: andamento complessivo (es. "parte a 0, crolla a −2 al paywall, risale a +1 alla lettura")
- **Punto più basso**: frame, causa, rischio di abbandono
- **Punto più alto**: cosa funziona davvero per questo personaggio
- **Sentiment finale**: con quale umore chiude, e se tornerebbe domani

Se il sentiment non scende mai sotto lo 0, il personaggio è probabilmente troppo indulgente: rileggi la scheda e rifai la journey con più rigore.

Quando il file di lavoro lo consente, accompagna la tabella con un grafico a linee del sentiment (asse X: passi, asse Y: −2/+2), una linea per journey.

## 6. Recensione in personaggio

Una per personaggio, dopo le sue 2 journey. Nel test veloce scrivi solo il verdetto e le 3 lamentele più forti.

Formato completo:

```
Recensione di <Soprannome> su <Progetto>

Lo userebbe ancora? Sì / No / Forse, se…

IL BUONO (ammesso a denti stretti):
- …

IL BRUTTO (problemi veri):
- …

L'INACCETTABILE (lo farebbe chiudere subito):
- …

VERDETTO: "<una frase nel personaggio>"
```

## 7. Filtro pragmatico (obbligatorio)

Esci dal personaggio e valuta ogni problema emerso come designer: blocchi e deviazioni (task completion), punti con sentiment ≤ −1 (sentiment journey). Nel test veloce considera solo quelli del piano valutato.

- 🔴 **ROSSO – problema UX reale**: lo avrebbe anche un lettore competente ma di fretta. Da correggere.
- 🟡 **GIALLO – valido ma a bassa priorità**: problema reale solo per utenti estremi. Da annotare.
- ⚪ **BIANCO – rumore del personaggio**: resistenza al digitale, gusto personale. Non agire.
- 🟢 **VERDE – idea nascosta**: la lamentela rivela un'opportunità (orientamento, scorciatoia, nuova funzione).

Criteri:
1. Un lettore di 35 anni, competente ma di fretta, avrebbe lo stesso problema? → ROSSO
2. È un problema di accessibilità (contrasto, dimensione testo, aree di tocco, WCAG AA)? → ROSSO
3. Blocca la task completion di una journey? → ROSSO, a prescindere dal personaggio
4. È "lo voglio come sul giornale di carta"? → BIANCO
5. È un'inefficienza reale nel flusso (passaggi in più, deviazioni)? → GIALLO o ROSSO
6. Correggerlo complicherebbe l'esperienza per l'80% che sta bene? → BIANCO
7. Rivela un momento di orientamento o onboarding mancante? → VERDE
8. Il problema dipende da un componente della libreria DXS e non dal singolo frame? → segnalalo: impatta tutte le testate che lo usano

Un problema che compare in più journey o in più personaggi sale di priorità.

Zero voci BIANCHE è un segnale, non un errore: vuol dire che i problemi sono reali.

## 8. Risultato finale

Apri il report indicando il comando usato (`--testDesign`, con o senza `--task` / `--sentiment`) e la fonte del link. Nel test veloce chiudi con una riga che segnala il piano non valutato e offre di eseguirlo con il comando corrispondente.

**Salvataggio.** Se esiste `project.md`, scrivi il report completo in `04_Validazione/test-AAAA-MM-DD.md` accanto a `project.md` (crea la cartella se manca; file già esistente → suffisso `-2`), con questa struttura:
1. Intestazione in frontmatter: `tipo: validazione`, `progetto`, `data`, `versione_progetto` (prima voce di `CHANGELOG.md`), `comando`, `figma` (link testato).
2. Riepilogo journey.
3. Problemi (tabella sotto).
4. `## Decisione del designer`: tabella `| ID | Decisione | Nota |` con una riga vuota per ogni problema. La compila Design Ops dopo l'ok del designer, con `accettato` (da correggere), `respinto` o `rimandato`.

In chat mostra solo: intestazione (comando e fonte del link), riepilogo journey, problemi ROSSI e GIALLI con ID e priorità, e il percorso del file.

**Riepilogo journey** (tutti i personaggi; nel test veloce tieni solo le colonne del piano valutato):

| Personaggio | Journey | Esito | Passaggi eff./ideali | Sentiment min | Sentiment finale |
|---|---|---|---|---|---|

**Problemi prioritizzati** (massimo 10, ordinati per gravità). ID `VAL-NN`, progressivi nel progetto: se in `04_Validazione/` ci sono report precedenti, continua dal numero più alto, così un ID non si ripete mai.

| ID | Livello | Frame | Personaggio e segmento | Journey | Piano | Problema reale | Tipo | Citazione del personaggio | Correzione suggerita | Componente DXS |
|---|---|---|---|---|---|---|---|---|---|---|

- `Frame`: nome del frame come appare in Figma, id del nodo e, se l'annotation del frame lo riporta, l'ID pagina `WF-NN`. Es. `ONB-CLUB · Thank you page · base · M (123:45) · WF-01`.
- `Personaggio e segmento`: dalla tabella "Corrispondenza segmenti ↔ personaggi" di `personaggi-del-progetto.md`.
- `Piano`: `task` o `sentiment`.
- `Tipo`: `modifica` (si corregge il frame), `flusso` (pagina mancante o ordine sbagliato), `requisito` (serve un requisito nuovo o diverso: non si risolve nel wireframe), `vincolo` (nasce da un vincolo noto di `vincoli.md`: cita il `VIN-NN`; non si risolve nel wireframe).

Le voci GIALLE oltre il limite vanno in un unico elenco riassuntivo; le BIANCHE solo elencate.
