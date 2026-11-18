# Contratti degli step

Il Project collega la sola cartella del progetto, più `Ricerca` e `Papers` in sola lettura (link e verifica in `references/ambiente.md`).

Cartella progetto attesa:

```
<Testata | Multi-testata>/
  <AAAA-MM_Progetto>/        ← cartella collegata al Project
    project.md · CHANGELOG.md · storico.md · _stato.json
    00_Input/                ← brief, trascrizioni, materiali MKTG
      _AVVIO.md              ← istruzioni di avvio e materiali richiesti
      libreria/<Testata>/    ← personas.md, protopersonas.md (copia in sola lettura, dal flusso 1)
      ricerca/               ← ricerche specifiche del progetto
    01_Blender/              ← output di magic-blender
    02_Personas/             ← personaggi-del-progetto.md, proposte-libreria.md
    03_Wireframe/            ← pagine.md, architettura.md; i frame stanno su Figma
    04_Validazione/           report dei test (dxs-personas --testDesign)
    05_Handoff/               handoff.md (dxs-handoff)
```

Indice:
- Step 1 – Benchmark (magic-blender)
- Step 2 – Personas (dxs-personas)
- Step 3 – Wireframe (dxs-wireframe)
- Step 4 – Wireframe validato
- Step 5 – Passaggio alla UI (dxs-handoff)

---

## Step 1 – Benchmark (`magic-blender`)

**Precondizioni**
- `project.md` con frontmatter valido.
- Almeno un file in `00_Input/`. Vuota → chiedi il brief, mai partire dal solo titolo.
- Ricerche: `Ricerca/<Testata>/` se trovato (`references/ambiente.md`), più `00_Input/ricerca/` per materiale specifico del progetto. Nessuna delle due → Blender segna lacuna e prosegue: non bloccare.
- `Papers` (facoltativa): supporto a Blender, sola lettura.

**Lancio**
Applica `magic-blender` con questi override:
- input da `00_Input/`, ricerche da `Ricerca/<Testata>/` (sola lettura) e da `00_Input/ricerca/`; i link di `project.md` sono solo riferimento
- paper da `Papers/` se collegata: il triage lo fa Blender, sola lettura
- tutti i file generati in `01_Blender/`
- non modificare `project.md`
- Fase 0 (input): i documenti sono già in `00_Input/`, raccolti con `Avvia`: non chiederli di nuovo, esegui solo la verifica di testata, prodotto e periodo
- `01_Blender/Blender.md` esiste → modalità aggiornamento, altrimenti prima analisi (rispondi tu alla domanda "esiste già un Blender.md?")

**Checkpoint**
1. **GATE-SKILL** (Blender, Fase 3): Blender si ferma con "Benchmark pronto" e attende sì o correzioni. Design Ops non interviene. Il pacchetto si genera solo dopo il sì.
2. **GATE-SKILL** (Blender, Fase 2): domanda una tantum su heatmap/scrollmap/recording. Lascia che la ponga Blender.
3. **HC1** (flusso, "Approvazione umana del quadro informativo"): dopo la generazione del pacchetto (Fase 4). Leggi solo da `01_Blender/Blender.md` le sezioni obiettivo, personas, vincoli, e da `01_Blender/domande.md` i titoli delle domande aperte. Presenta il riepilogo e attendi l'ok.

**Dopo l'ok → scritture**
- Contesto:
  - Obiettivo: una frase.
  - Personas DXS: una o due frasi di sintesi delle personas di Blender. È il testo che `dxs-personas` userà per l'affinità, quindi segmento, contesto d'uso e obiettivo devono esserci.
  - Vincoli: da Blender più scadenza dal frontmatter.
  - Device: già chiesto all'avvio. Se contraddice il "Contesto d'uso" di Blender, segnalalo in HC1.
- FigJam: pubblica Cover, Benchmark, User-Flow e Personas (personas `PER-`) come da `references/figjam.md`. Un errore non blocca.
- Link: Brief → `00_Input/`; Research → `00_Input/ricerca/`; Benchmark → `01_Blender/benchmark.md`; Blender → `01_Blender/Blender.md`.
- Gate: spunta Benchmark. Esito: "validato [data], [n] pattern, [n] domande aperte".
- Aperto: una riga per domanda di `domande.md` (Q-MKT / Q-BIZ / Q-DES) con destinatario. Max 5, il resto: "altre [n] in 01_Blender/domande.md".
- Fase: resta `benchmark`.
- Versione: minore. Changelog: tipo "Gate superato".

**Prossimo**: Personas.

---

## Step 2 – Personas (`dxs-personas`)

**Precondizioni**
- Step 1 chiuso (gate Benchmark spuntato).
- `project.md` con `testata` e `Personas DXS` non vuoti. Vuoti → torna allo step 1, non chiedere all'utente di inventarli.
- Librerie di testata in `00_Input/libreria/<Testata>/` (copia dal flusso 1). Assenti → avvisa in una riga: la skill parte senza personas di testata e creerà protopersona.
- `01_Blender/personas-journey.md` esiste.

**Lancio**
Applica `dxs-personas` Fase 1 (nessun `--testDesign`) con questi override:
- `project.md` = quello del progetto (la skill legge da sola `01_Blender/personas-journey.md` e `00_Input/ricerca/`)
- cartella ricerche = `Ricerca/<Testata>/` se trovato
- schede Figma delle protopersona: pagina `Personas` del FigJam di `project.md` (voce assente → la skill chiede il link: la Fase 1 non si chiude senza scheda)
- librerie (`personas.md`, `protopersonas.md`) da `00_Input/libreria/<Testata>/`, in sola lettura: non modificarle
- output: `personaggi-del-progetto.md` e `insight-ricerca.md` in `02_Personas/`; le protopersona nuove e le correzioni alle librerie in `02_Personas/proposte-libreria.md`, mai nelle librerie

**Checkpoint**
Nessun HC del flusso tra Personas e Wireframe. I checkpoint sono quelli interni della skill, Design Ops non li scavalca:
1. tabella di affinità mostrata all'utente (può dissentire dalla scelta)
2. validazione obbligatoria delle protopersona, a scelta multipla
3. nessun salvataggio né scheda Figma senza la scelta esplicita

**Dopo l'ultimo GATE-SKILL risolto → scritture**
Leggi solo il riepilogo finale della skill e il percorso del file salvato.
- Link: Personaggi → `02_Personas/personaggi-del-progetto.md`.
- Gate: spunta Personas. Esito: "[n] personaggi: [ID]; [n] protopersona nuove; [n] segmenti coperti su [m]". Segmenti in lacuna → una voce in Aperto ciascuno.
- Fase: `benchmark` → `wireframe`.
- Contesto → Personas DXS: aggiorna solo se la skill ha segnalato una contraddizione e l'utente l'ha accettata (chiedi ok prima di scrivere).
- Aperto: se sono state usate protopersona, aggiungi "Validare le protopersona con ricerca o utenti reali" con owner dal frontmatter.
- Versione: minore. Changelog: tipo "Gate superato".

**Prossimo**: Wireframe. Skill non ancora disponibile: dillo e fermati.

---

## Step 3 – Wireframe (`dxs-wireframe`)

**Precondizioni**
- Gate Personas spuntato.
- `01_Blender/personas-journey.md` e `principi.md` esistono; `02_Personas/personaggi-del-progetto.md` esiste, con la tabella di corrispondenza segmenti ↔ personaggi. Tabella mancante o con lacune → avvisa in una riga e prosegui: il wireframe segnala le lacune nel suo gate.
- Link `Figma WF` in `project.md` = file Figma del progetto, creato dal designer dal template con la libreria `DXS Corriere – Wireframe library` attiva. Vuoto → chiedi il link; con la risposta prosegui e scrivilo alla chiusura dello step. La skill non crea file.
- `Device` valorizzato nel Contesto. Vuoto → chiedilo; con la risposta prosegui e scrivilo alla chiusura dello step.

**Lancio**
Applica `dxs-wireframe` con il comando `Crea WF` (senza ADV). Per i progetti nuovi la skill propone prima l'architettura informativa (comando `Architettura`): è facoltativa e non è un gate del flusso. Aggiungi `--ADV` solo se l'utente lo chiede: oggi `dxs-adv-placement` ha regole solo per Corriere.
Override: i personaggi del progetto si leggono da `02_Personas/personaggi-del-progetto.md`. Se esiste `vincoli.md`, la skill legge le righe `aperto` e `recepito` con gravità `blocca` o `limita`.
Modalità, scelta dalla skill: `03_Wireframe/pagine.md` assente → creazione; report nuovo in `04_Validazione/` → revisione; requisiti cambiati da Blender → aggiornamento.

**Checkpoint**
1. **GATE-SKILL** (architettura, se fatta): tabella feature e aree; ok esplicito prima dello schema su Figma. Design Ops non interviene.
2. **GATE-SKILL**: elenco pagine, varianti e device. Stop obbligatorio, nessun frame prima del sì. Design Ops non interviene.
3. **HC2** (flusso, "wireframe pronti per la valutazione"): la skill chiude con il suo blocco HC2. Usalo così com'è, aggiungi "Per project.md" e "Serve".

**Dopo l'ok → scritture**
- Link: Figma WF → link con node-id della pagina (dal blocco HC2); Wireframe → `03_Wireframe/pagine.md`; Architettura → `03_Wireframe/architettura.md` (solo se esiste).
- Gate: spunta Wireframe. Esito: "[n] frame, copertura [n]/[n]".
- Aperto: gli avvisi del blocco HC2 (ADV non posizionabili, conflitti, requisiti non coperti), una riga ciascuno, max 3.
- Vincoli: per ogni `VIN-` citato come recepito nel blocco HC2 (`Vincoli recepiti`), imposta lo stato `recepito` con la versione, in `vincoli.md`.
- Fase: resta `wireframe` (copre creazione e validazione).
- Versione: minore. Changelog: tipo "Gate superato".

**Revisioni e aggiornamenti**
Li gestisce la skill, con il contatore `Revisioni auto` per pagina in `pagine.md` (max 2, poi decide il designer per quella pagina). I frame ritoccati a mano in Figma sono protetti: la pagina passa a `Manuale: sì` e non si rigenera senza ok esplicito. Design Ops non lo duplica. Una revisione o un aggiornamento registra una patch "Correzione" con il link, e non spunta gate.

**Prossimo**: Step 4, validazione (test in una sessione nuova, oppure pagine UX ✅ in Figma).

**Per lo step 4**: `dxs-personas --testDesign` salva il report in `04_Validazione/test-AAAA-MM-DD.md`. Ogni problema ha un ID `VAL-NN`, frame, personaggio, segmento e tipo (`modifica`, `flusso`, `requisito`). In fondo c'è la tabella "Decisione del designer", vuota: la compila Design Ops dopo l'ok del designer (`accettato`, `respinto`, `rimandato`). `dxs-wireframe` in revisione tratta solo i problemi `accettato` e cita `VAL-NN` nelle righe `Rev` di `pagine.md`. Un problema `accettato` senza una riga `Rev` con il suo ID è ancora aperto.

---

## Step 4 – Wireframe validato

È un gate. Due vie, e basta una: il ✅ delle pagine UX in Figma vale come approvazione del designer, il test è un aiuto e non un obbligo.

### Via test (`dxs-personas --testDesign`)

**Precondizioni**
- Gate "Wireframe" spuntato (HC2 passato) e `Figma WF` in `project.md`.
- `02_Personas/personaggi-del-progetto.md` esiste. Senza la tabella di corrispondenza avvisa in una riga e prosegui.
- **Sessione nuova.** Se lo step 3 è stato eseguito in questa sessione, fermati e chiedi di aprirne una nuova: chi valuta non deve aver costruito i wireframe.

**Lancio**
`dxs-personas --testDesign` (`--task` o `--sentiment` per il test veloce, su richiesta). Override: link da `Figma WF`; personaggi da `02_Personas/personaggi-del-progetto.md`; vincoli da `vincoli.md`; report in `04_Validazione/test-AAAA-MM-DD.md`.

**HC3 – decisione del designer**
1. `python3 scripts/validazione.py elenco 04_Validazione` → lista numerata di ROSSI e GIALLI.
2. Presenta:
```
**HC3 – Validazione** · [report]
[lista]
**Serve** – per numero: `accetto 1 2 · respingo 3 · rimando 4 · risolto 5`, oppure `accetto tutti i rossi`. I gialli senza risposta valgono "rimandato". Un problema di tipo requisito o vincolo non si risolve nel wireframe: diventa "rimandato" e va in Aperto.
```
3. Con la risposta: `python3 scripts/validazione.py decidi 04_Validazione --pos [--accetto ..] [--respingo ..] [--rimando ..] [--risolto ..] [--accetto-rossi] --gialli-rimando`, poi `python3 scripts/scan.py <progetto> --touch 04_Validazione/<report>`.
4. Risposta ambigua o assente → non scrivere nulla.

**Revisione**
- Problemi `accettato` senza riga `Rev` in `pagine.md` → proponi: "Lancio dxs-wireframe in revisione su [n] problemi?". La revisione parte in una **sessione nuova**. Limite: 2 revisioni automatiche per pagina; pagine manuali o protette escluse.
- Pagina a 2/2 o frame protetto: il designer corregge in Figma e dice `risolto N`. Si registra con `decidi --risolto`.
- Dopo la revisione: `python3 scripts/validazione.py stato 04_Validazione 03_Wireframe/pagine.md`. Il ritest si fa solo su richiesta: il nuovo report continua la numerazione `VAL-`.

**Chiusura (gate)**
- `validazione.py stato` deve dire CHIUDIBILE: nessun ROSSO senza decisione e nessun accettato senza riga `Rev`.
- Proponi: "Validazione chiusa: [n] risolti, [n] rimandati, [n] respinti. Spunto 'Wireframe validato'?" Con l'ok:
  - Gate: spunta "Wireframe validato". Esito: "test [data]: ROSSI [n] (risolti [n], rimandati [n], respinti [n]) · GIALLI [n]".
  - Aperto: i ROSSI rimandati e i problemi di tipo requisito o vincolo, una riga ciascuno ("VAL-NN: [problema] — richiede requisito, input per Blender"), max 5. Gli altri: "altri [n] in `04_Validazione/`".
  - Fase: `wireframe` → `handoff`. Versione: minore. Changelog: tipo "Gate superato".
- Prossimo: passaggio alla UI (`Handoff`).

### Via Figma
Pagine UX ✅: `references/figma-pagine.md`. Se esiste un report con ROSSI senza decisione, la proposta lo segnala.

---

## Step 5 – Passaggio alla UI (`dxs-handoff`)

**Precondizioni**
- Gate "Wireframe validato" spuntato.
- `03_Wireframe/pagine.md` esiste e `Figma WF` è in `project.md`.

**Lancio**
Applica `dxs-handoff` con il comando `Handoff` (`--note` solo le annotation, `--flow` solo lo user flow). Se `project.md` ha già `Figma Flow`, lo user flow si sostituisce nello stesso FigJam.

**Checkpoint**
1. **GATE-SKILL**: proposta di casi e azioni. Stop obbligatorio, nessuna scrittura prima dell'ok. Design Ops non interviene.
2. **HC** "Handoff pronto per la UI": la skill chiude con il suo blocco. Usalo così com'è e aggiungi solo "Per project.md" e "Serve".

**Dopo l'ok → scritture**
- Link: `Figma Flow` → FigJam dal blocco HC; Handoff → `05_Handoff/handoff.md`.
- Gate: spunta "Passaggio alla UI". Esito: "[n] casi · [n] azioni · [n] annotation · [n] aperti".
- Aperto: gli "Aperti" del blocco HC, max 5.
- Fase: `handoff` → `chiuso`. Versione: minore. Changelog: tipo "Gate superato".
- Se `Figma Flow` è nuovo, aggiorna la Cover (`references/figma-cover.md`).

**Fine del processo**: il progetto è consegnato alla UI. Ciò che segue (UI, audit, consegna ai dev) ha regole proprie e Design Ops non lo gestisce.

**Dopo la consegna**: se i wireframe vengono rigenerati, i frame perdono le annotation `Tap`. `dxs-wireframe` lo segnala in HC2: serve rilanciare `Handoff --note`. I frame protetti (ritoccati a mano) le mantengono.
