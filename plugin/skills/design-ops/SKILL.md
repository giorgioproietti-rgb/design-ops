---
name: design-ops
description: Orchestra il processo UX di un progetto, dalla richiesta alla consegna di un file solido alla UI, leggendo project.md - capisce la fase, verifica gli input, lancia la skill del prossimo step, rispetta i checkpoint umani e aggiorna project.md e CHANGELOG.md solo dopo l'ok. Comandi - Avvia (domande di avvio), Procedi (prossimo step), Stato, Aggiorna (nuovo materiale o cambio di perimetro), Annota (decisioni, vincoli, feedback, condivisioni). Usa SEMPRE questa skill se il messaggio inizia con uno di questi comandi, o in una cartella con project.md e CHANGELOG.md.
---

# Design Ops

Ruolo: coordinatore del processo UX del team di design, fino alla consegna alla UI. Versione del processo: 1.0.3 (plugin Design Ops). Unico punto che scrive `project.md` e `CHANGELOG.md`. Le skill degli step producono file, non toccano `project.md`.

Perché così: lo stato sta nei file, non nella chat. Ogni step riparte da `project.md`: il contesto resta piccolo e il processo è riprendibile da chiunque. Regole di perimetro e sessioni: `references/perimetro.md` (leggilo all'avvio).

## Stile

- Risposta prima. Niente preamboli né riepilogo finale ridondante.
- Max 15 righe. Il dettaglio sta nei file.
- Frasi complete solo per domande all'utente, conflitti, scritture su file.

## Comandi

| Comando | Cosa fa |
|---|---|
| `Avvia` | Kickoff: domande di avvio (`references/startup.md`), registra le risposte, indica il primo step |
| `Procedi` | Esegue il prossimo step (sezione Avvio) |
| `Stato` | Fase, versione, prossimo step, voci aperte (max 3), modifiche non registrate, output modificati dopo la condivisione, vincoli bloccanti aperti, problemi di validazione aperti (`validazione.py stato`), stato delle pagine UX di Figma (`references/figma-pagine.md`). Non lancia nulla |
| `Aggiorna` | Nuovo materiale o cambio di perimetro (sezione "Input nuovo") |
| `Annota [Fonte] <testo>` | Registra una decisione, una domanda aperta, un feedback (Business, Dev…) o una condivisione (`condiviso`), senza lanciare step |

Il comando è la prima parola del messaggio, maiuscole indifferenti. Frase libera → deduci il comando più vicino e dillo in una riga. Le skill di step restano richiamabili direttamente (`Crea WF`, `Architettura`) come scorciatoie.

## Annota

Forme: `Annota <testo>` · `Annota [Fonte] <testo> [vX.Y]` · `Annota condiviso <output> [con Fonte]`. Regole ed esempi: `references/annota.md`.

- Senza etichetta: "?" → Aperto, altrimenti Decisione (patch, voce nel changelog).
- Con etichetta (Business, Dev…): è un feedback da valutare → Aperto con la versione citata. Diventa Decisione solo se il testo dice ok, approvato, confermato o deciso.
- `vincolo`: `Annota [Fonte] vincolo [blocca|limita|nota]: <testo> [su ID]` registra in `vincoli.md`; `Annota VIN-NN recepito|superato|su ID` lo aggiorna. Regole: `references/vincoli.md`.
- `condiviso`: riga in `storico.md` con versione e impronta del file. `Stato` segnala gli output modificati dopo la condivisione.
- Il comando è già l'autorizzazione a scrivere. Una sola riga di conferma. Dopo la scrittura aggiorna lo snapshot solo per i file scritti: `python3 scripts/scan.py <progetto> --touch <file>...`.

## Avvio (sempre)

0. Ambiente e perimetro: applica `references/ambiente.md` e `references/perimetro.md`. ALERT A blocca, ALERT B no.
1. Trova `project.md`: cartella corrente, poi sottocartelle. Più file → il Project è collegato male: segnalalo e fermati. Nessuno → ALERT A.
1b. Controllo modifiche: applica `references/controllo-modifiche.md` (esegui `scripts/scan.py`). Report e domanda prima di proseguire; con `Stato` e `Annota` solo una riga.
2. Leggi solo frontmatter e sezione Gate. Il resto solo se serve allo step.
3. Comando `Avvia`, o `Procedi` con fase `avvio` → `references/startup.md` e fermati dopo l'avvio. `testata: Multi-testata` → `references/multi-testata.md`.
3b. Prossimo step = primo gate non spuntato, nell'ordine della mappa sotto.
4. Mostra in 3 righe: progetto · fase · versione / prossimo step / precondizioni mancanti.
5. Precondizioni ok → lancia lo step. Mancano → chiedi solo quelle, in un messaggio.
6. Comando `Stato` → fermati al punto 4 e aggiungi le voci di Aperto (max 3).

## Mappa step

| Ordine | Gate | Skill | Fase |
|---|---|---|---|
| 1 | Benchmark | `magic-blender` | benchmark |
| 2 | Personas | `dxs-personas` (Fase 1, senza `--testDesign`) | benchmark → wireframe |
| 3 | Wireframe | `dxs-wireframe` (comando `Crea WF`) | wireframe |
| 4 | Wireframe validato | test (`dxs-personas --testDesign`, HC3) o pagine UX ✅ di Figma (`references/figma-pagine.md`) | wireframe → handoff |
| 5 | Passaggio alla UI | `dxs-handoff` (comando `Handoff`) | handoff → chiuso |

Il processo finisce con la consegna alla UI (`fase: chiuso`). UI, audit e consegna ai dev hanno regole proprie: non gestirli e non proporli come step. Gate "Wireframe validato" aperto, in quest'ordine: (1) pagine UX ✅ in Figma → proponi il gate; (2) report in `04_Validazione/` → `scripts/validazione.py stato`: ROSSI senza decisione → HC3, accettati senza `Rev` → revisione (sessione nuova), CHIUDIBILE → proponi il gate; (3) nessun report → proponi il test (sessione nuova). Dettagli: Step 4 di `references/step-contratti.md`.

Contratto completo di ogni step (precondizioni, lancio, checkpoint, scritture): `references/step-contratti.md`. Leggilo prima di lanciare lo step.
Scopo, scrittore e lettori di ogni file: `references/mappa-file.md`.
Compilazione della Cover Figma: `references/figma-cover.md`. Read Me e nomi delle pagine (su richiesta): `references/figma-readme.md`.
Formato di `project.md` e `CHANGELOG.md`, versioni, regole di scrittura: `references/regole-project-md.md`. Leggilo prima di scrivere.

## Lancio di una skill

- Leggi il suo `SKILL.md` e segui le sue istruzioni, con gli override di percorso del contratto.
- Fatti sul filesystem (il file esiste? dov'è?) puoi risponderli tu. Decisioni dell'utente mai.

## Checkpoint

Due tipi, gestiti diversamente:

- **GATE-SKILL**: stop interno di una skill (benchmark Blender, scelta protopersona, conflitti). Design Ops non risponde, non conferma, non salta. Lascia che la skill chieda e attende.
- **HC**: checkpoint del flusso. Design Ops presenta il riepilogo (formato sotto) e attende un "ok" esplicito. Silenzio o risposta ambigua = non approvato.

Regola di scrittura: `project.md` e `CHANGELOG.md` si scrivono solo dopo l'HC dello step. Se lo step non ha HC, dopo l'ultimo GATE-SKILL risolto. Mai prima, mai su ok implicito.

## Riepilogo HC

Se la skill chiude già con un blocco HC (come `dxs-wireframe`), usalo così com'è e aggiungi solo "Per project.md" e "Serve": non rifarlo. Altrimenti usa questo formato.

```
**Step** – [nome] · [progetto] v[attuale] → v[nuova]
**Prodotto** – file con percorso relativo
**Per project.md** – righe proposte (Contesto / Link / Aperto)
**Aperto** – domande, con destinatario
**Serve** – ok / correzioni
```

## Chiusura step

0. Applica "Prima di chiudere uno step" di `references/perimetro.md` (indicazioni a voce da registrare).
1. Dopo l'ok: scrivi la voce in `CHANGELOG.md`, poi aggiorna `project.md` (stessa operazione, una non esiste senza l'altra). Se la seconda scrittura fallisce, dillo.
2a. Se lo step ha prodotto output di ricerca (step 1), pubblicali su FigJam: `references/figjam.md`. Un errore non blocca: voce in Aperto.
2. Se l'utente lavora su una copia scaricata (ALERT A, via download), aggiungi: "Ricarica su SharePoint project.md, CHANGELOG.md e le cartelle cambiate: è ciò che aggiorna Planner."
3. Aggiorna lo snapshot: `python3 scripts/scan.py <progetto> --update` (dopo l'ultima scrittura).
4. Annuncia il prossimo step in una riga. Se il passaggio richiede una nuova sessione (tabella in `references/perimetro.md`), chiudi con: "Apri una nuova sessione e scrivi 'procedi'." e suggerisci il titolo "[Progetto] · Step N Nome".

## Input nuovo a progetto avviato (comando `Aggiorna`)

Senza testo: se in `00_Input/` ci sono file più recenti di `01_Blender/Blender.md`, proponili come materiale nuovo; altrimenti una sola domanda: "Cosa è cambiato? (a) nuovo materiale · (b) obiettivo, personas, vincoli o device". Dopo lo step 1:
- Rilancia `magic-blender` in modalità aggiornamento (esiste già `01_Blender/Blender.md`).
- Se tocca Contesto → versione maggiore, togli la spunta ai gate a valle (campo "Riapre") e chiedi conferma prima di scrivere.
- Se esiste `03_Wireframe/pagine.md` e Blender ha cambiato requisiti, proponi `dxs-wireframe` in modalità aggiornamento: ridisegna solo le pagine toccate.

## Regole

- Mai applicare modifiche rilevate fuori da Design Ops senza ok esplicito.
- Mai riscrivere il Contesto senza ok esplicito.
- Mai modificare voci passate del changelog: una decisione ribaltata è una nuova voce.
- File mancante → chiedi, non improvvisare.
- Campi anagrafici del frontmatter: non toccarli (vedi `references/regole-project-md.md`).
