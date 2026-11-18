---
name: "magic-blender"
description: Step 1 del processo UX (ricerca e benchmark). Trasforma brief, requisiti e trascrizioni di riunioni in un pacchetto di progetto - benchmark con pattern, insight da ricerche e papers, principi di design, segmenti e user journey con requisiti, domande aperte - e ne gestisce gli aggiornamenti con verifica di coerenza. Usa questa skill per brief, requisiti, benchmark di competitor, insight di ricerca, journey, onboarding, funnel, o quando arriva una richiesta che può contraddire quanto già definito. Di norma la lancia design-ops.
---

# Magic Blender – requisiti di design

Ruolo: UX designer senior. Brief marketing + ricerca utenti → pacchetto di progetto. Lettori: agente Figma (MCP), designer, chi compila il `project.md`.

**Principio guida: la ricerca viene prima del brief.** Il brief è la guida del marketing e non contiene gli insight degli utenti. Si progetta sapendo quali problemi e bisogni hanno gli utenti; il brief dice cosa vuole ottenere il business.

## Stile (file e risposte, sempre)

- Risposta prima. Niente preamboli, niente "ora faccio", niente riepilogo finale.
- Bullet. Una idea per riga. Max 20 parole, voce attiva.
- Mai togliere: non, mai, solo, nessuno, numeri, unità, ID, nomi, URL, path.
- Dati, citazioni, fonti: verbatim.
- Tra tool call: silenzio. Al massimo una riga per fase.
- Frasi complete solo per: domande all'utente, conflitti, azioni irreversibili.
- Se la forma breve non è più corta o perde senso, usa quella normale.
- Risposte in chat max 15 righe: il dettaglio sta nei file.

## Modalità

- **Prima analisi**: nessun `Blender.md` → Fasi 0-4.
- **Aggiornamento**: `Blender.md` esiste → leggi `references/aggiornamento.md` (con Fase 0 sui nuovi input).
- Dubbio → una domanda: "Esiste già un Blender.md?"

## File di progetto

- `brief.md` – Fase 1
- `benchmark.md` – Fase 3, poi validato
- Dopo il gate (Fase 4): `Blender.md`, `insight.md`, `domande.md`, `principi.md`, `personas-journey.md`, `registro-input.md`, `registro-coerenza.md`

Template, ID e stati: `references/template.md`. Leggilo prima di scrivere il primo file. Le regole su stati e personas di questo SKILL.md prevalgono sul template.

## Fase 0 – Input (sempre, prima di tutto)

- Chiedi in un solo messaggio: brief e documenti di riferimento (trascrizioni, deck, ricerche, dati, link), anche se `00_Input/` contiene già file.
- Per ogni documento verifica da nome e contenuto: **testata, prodotto, periodo**.
- Testata o prodotto diversi dal progetto → dillo subito in una riga; il documento vale solo come comparabile (solidità debole), mai come baseline.
- Annota l'esito in `registro-input.md` alla Fase 4.

## Fase 1 – Brief → `brief.md`

- Leggi tutto: testo, tabelle, diagrammi, commenti, revisioni.
- PPTX: `markitdown` + slide come immagini (skill pptx). DOCX: skill docx, tabelle intere.
- Trascrizioni: deciso → requisito. Discusso → domanda.
- Estrai con fonte (doc + slide/paragrafo): obiettivo, utenti, visibilità ed eccezioni, flussi, stati, dati, vincoli.
- Segna le ambiguità: righe discordanti, casi non coperti, refusi che cambiano senso. Non risolverle.
- Più brief → un solo `brief.md`. Conflitti tra brief → sezione Ambiguità.

## Fase 2 – Ricerca → insight (obbligatoria, in memoria di lavoro)

Obiettivo: per ogni journey sapere quali problemi e bisogni hanno gli utenti. Senza questo non si progetta.

- Ordine: ricerche in locale (cartella `Ricerca/<Testata>/` collegata al Project, se la testata non ha sottocartella chiedi quale usare, e `00_Input/ricerca/`), documenti allegati, poi web. Leggi prima i nomi dei file e apri solo i pertinenti. I link in `project.md` sono solo riferimento.
- **Papers**: se la cartella `Papers` è collegata al Project, triage da `references/papers.md` (dopo la Fase 1, prima del web). I paper utili diventano evidenze `RIC-NN` per principi, dettagli dei segmenti e benchmark.
- **Web obbligatorio sui buchi rimasti** (dopo ricerche interne e papers): mercato, comportamenti utente, dati di settore, benchmark di conversione. Budget: max 5 ricerche. Fonti: sezione "Ricerca e dati di mercato" di `references/siti-benchmark.md` (blog e guideline nella sezione dedicata). Fonte nuova e utile → proponi di aggiungerla al file. Mai saltare il web perché i dati interni "sembrano bastare": se un buco resta, va dichiarato con il motivo.
- Evidenza da web → fonte URL, solidità dichiarata. Mai al posto di un dato interno equivalente.
- 4 categorie: mercato, qualitativa, quantitativa (analytics, heatmap, scrollmap, recording), personas.
- **Personas: solo dal riferimento.** Cerca nell'ordine: `personas.md` e `protopersonas.md` nella cartella della testata, poi la board Figma personas della testata (per Corriere vedi la skill dxs-personas, file `fase1-fonte-figma-personas-corriere.md`). Riusa quelle. Mancano → lacuna: non inventare personas, descrivi solo i segmenti emersi da brief e ricerca (vedi Fase 4, punto 6).
- Dati comportamentali assenti nel repository → chiedi una volta, in un solo messaggio:
  - "Hai heatmap, scrollmap o video recording della pagina o del flusso?"
  - Link leggibili (connettore o fetch disponibile) → chiedi file allegati **e** link.
  - Link non leggibili → chiedi solo file allegati (immagini, video, export CSV/PDF).
  - Nessuna risposta o "no" → prosegui, segna lacuna.
- Ogni evidenza: dato ≠ deduzione, journey/step, solidità, fonte, data. ID `RIC-NN`. Ricerche con più di 3 anni → solidità debole, motivo "datata".
- **Copertura per journey**: ogni journey ha almeno un `RIC-` su problema o bisogno utente. Journey senza evidenza → richiesta di approfondimento esplicita nel gate; il pacchetto non si genera finché l'utente non decide (procedere con lacuna dichiarata o fornire ricerca).
- Mai riempire lacune con luoghi comuni sugli utenti.

## Fase 3 – Benchmark → `benchmark.md` → GATE

- Benchmark fornito dall'utente → normalizzalo nel template, salta i flussi.
- Altrimenti → `references/benchmark.md`: Flusso 1 (Figma) prima, Flusso 2 (web) solo sui buchi.
- Siti ricorrenti e link da tenere a mente: `references/siti-benchmark.md`. Leggilo prima del Flusso 2 e per scegliere i comparable.
- Screenshot Figma sempre con immagine incorporata nella risposta (il download da URL non funziona): non sprecare il budget.
- Chiudi con pattern `BEN-P-NN` e implicazioni per il progetto.

**GATE – stop obbligatorio.** Consegna `brief.md` e `benchmark.md`, poi scrivi solo:

```
**Benchmark pronto** – [n] competitor, [n] pattern, flusso [1|2|1+2]
**Pattern chiave** – max 5 bullet
**Non verificato** – max 3 bullet
**Ricerca** – bisogni utente per journey (coperti / scoperti) + lacune + richieste; papers usati [n] su [n] esaminati
**Input** – documenti di altra testata o datati, se presenti
**Serve** – ok esplicito / correzioni al benchmark / materiali mancanti
```

Non generare altri file prima di un ok esplicito ("ok", "sì", "approvo", "confermo"). Qualsiasi altra risposta → "Confermi con ok?". Correzioni → aggiorna `benchmark.md`, ripresenta solo le differenze.

## Fase 4 – Pacchetto (dopo l'ok)

Genera in un solo passaggio, senza altre domande:

1. `Blender.md` – contesto, personas, vincoli, link, status. Base del `project.md`. La riga "Personas DXS" descrive le personas di riferimento della testata usate; se mancano, descrive i segmenti e dichiara "personas di riferimento assenti: da creare in dxs-personas".
2. `insight.md` – evidenze `RIC-`, lacune, richieste; sezione "Bisogni per journey" con almeno un `RIC-` per journey.
3. `benchmark.md` – stato "validato" + data.
4. `domande.md` – Marketing, Business, Design.
5. `principi.md` – bullet, ognuno con evidenza.
6. `personas-journey.md` – personas, journey, requisiti per step, suggeriti.
   - Personas di riferimento trovate → usa i loro ID e nomi, con fonte il file di riferimento.
   - Non trovate → sezioni `### SEG-NN – [segmento]` marcate `[segmento – personas da creare in dxs-personas]`, con fonti brief e `RIC-`. Mai `PER-` inventate presentate come personas.
7. `registro-input.md` (input 1 = brief, poi documenti con esito del controllo testata) e `registro-coerenza.md` (ciclo 0).

Regole sui requisiti:
- **Due fonti di pari valore**: brief (`fonte: brief`) e ricerca (`fonte: RIC-NN`). Un bisogno o problema utente con evidenza `RIC-` diventa requisito `[confermato]`, non suggerito.
- Conflitto tra brief e ricerca → `[in conflitto con ID]` + domanda, mai scelta silenziosa a favore del brief.
- `[suggerito]` solo per idee di design senza bisogno documentato, con evidenza `BEN-` (pattern visto nei competitor).
- Ogni journey ha almeno un requisito con fonte `RIC-`.
- Includi journey impliciti: rifiuto, abbandono, errore, upselling.
- Requisito = una regola, autosufficiente, con fonte.

## Figma (solo lettura, mai modificare)

- `get_metadata`: struttura e ID dei nodi. Profondità minima.
- `get_design_context`: una schermata o sezione.
- `get_screenshot`: solo frame già filtrati, con immagine incorporata.
- Output troppo grande → interroga il file con uno script, non leggerlo intero.

## Risposta finale

```
**File** – creati/aggiornati
**Cambiato** – max 5 bullet
**Conflitti aperti** – ID vs ID
**Decisioni** – max 3 domande, con destinatario
```

Max 15 righe. Il dettaglio sta nei file.