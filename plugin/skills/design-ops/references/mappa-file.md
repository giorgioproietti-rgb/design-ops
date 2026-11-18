# Mappa dei file

Regole: ogni file ha **un solo scrittore**; chi legge non modifica. Contenuto → file di step. Stato → `project.md`. Storia → `CHANGELOG.md`. Eventi sui file → `storico.md`.

## Quale file per quale domanda

| Domanda | File |
|---|---|
| A che punto è il progetto? | `project.md` |
| Perché la versione è cambiata? | `CHANGELOG.md` |
| Da dove viene questo ID (`RIC-`, `PRIN-`…)? | `01_Blender/registro-input.md` |
| Cosa è cambiato negli ID e cosa va rivisto nel design? | `01_Blender/registro-coerenza.md` |
| Cosa è stato aggiunto, tolto o ritoccato nella cartella? | `storico.md` |
| Cosa ho condiviso, con chi e a che versione? | `storico.md` (righe `condiviso`) |
| Che feedback sono arrivati e su quale versione? | Aperto in `project.md`, poi changelog |
| Quali vincoli sono stati dichiarati e a cosa si applicano? | `vincoli.md` |
| Chi ha toccato un file? | Cronologia versioni di OneDrive |

## Governo del progetto

| File | Scopo | Scrive | Legge |
|---|---|---|---|
| `project.md` | Cruscotto: anagrafica, contesto, link, gate, voci aperte | Anagrafica: Planner e flusso 1. Il resto: Design Ops, dopo un ok | Tutte le skill, flusso 2 |
| `CHANGELOG.md` | Storia semantica e versionata: decisioni, gate, perimetro. Mai modificata a ritroso | Design Ops, dopo un ok | Design Ops, persone |
| `vincoli.md` | Registro dei vincoli tecnici, di business e di marketing (`VIN-NN`, gravità, collegamenti, stato) | Design Ops, con `Annota` | `dxs-wireframe`, `dxs-personas` (test), Design Ops |
| `storico.md` | Registro cronologico di ogni modifica rilevata fuori dal flusso, della decisione presa e delle condivisioni (`condiviso`). Solo in aggiunta | Design Ops | Persone, Design Ops |
| `_stato.json` | Snapshot dei file per il confronto. Non si modifica a mano | `scripts/scan.py` | `scripts/scan.py` |
| `00_Input/_AVVIO.md` | Istruzioni di avvio e materiali richiesti | Template (flusso 1) | Persone |

## Input (`00_Input/`)

| File | Scopo | Scrive | Legge |
|---|---|---|---|
| brief e materiali | Documenti di partenza | Persone | Blender |
| `ricerca/` | Ricerche specifiche del progetto | Persone | Blender, Personas |
| `libreria/<Testata>/` | `personas.md` e `protopersonas.md` della testata, copia in sola lettura | Flusso 1 | Personas |

## Blender (`01_Blender/`)

| File | Scopo | Scrive | Legge |
|---|---|---|---|
| `brief.md` | Brief unificato, ambiguità | Blender | Blender |
| `benchmark.md` | Competitor, osservazioni `BEN-`, pattern `BEN-P-` | Blender | Wireframe, FigJam |
| `Blender.md` | Dettaglio di contesto, personas, vincoli, link. `project.md` ne riporta la sintesi | Blender | Design Ops |
| `insight.md` | Evidenze `RIC-`, lacune, bisogni per journey | Blender | Personas, Wireframe |
| `domande.md` | Domande aperte per Marketing, Business, Design | Blender | Design Ops (voci di Aperto) |
| `principi.md` | Principi `PRIN-`, ognuno con evidenza | Blender | Wireframe |
| `personas-journey.md` | Segmenti, journey, requisiti per step, suggeriti | Blender | Personas, Wireframe |
| `registro-input.md` | **Cosa è entrato**: ogni input con fonte e ID creati o modificati | Blender | Blender |
| `registro-coerenza.md` | **Cosa è cambiato**: modifiche agli ID, conflitti, impatto sul design | Blender | Design Ops, Wireframe |

## Personas (`02_Personas/`)

| File | Scopo | Scrive | Legge |
|---|---|---|---|
| `personaggi-del-progetto.md` | Personaggi scelti per il progetto, usati dal test sul design, e tabella di corrispondenza segmenti ↔ personaggi | Personas | Wireframe, validazione |
| `insight-ricerca.md` | Insight dalle ricerche e file già analizzati | Personas | Personas |
| `proposte-libreria.md` | Protopersona nuove e correzioni alle librerie, da promuovere a mano | Personas | Persone |

## Wireframe, validazione, handoff

| File | Scopo | Scrive | Legge |
|---|---|---|---|
| `03_Wireframe/architettura.md` | Feature per priorità e importanza, aree | Wireframe | Wireframe |
| `03_Wireframe/pagine.md` | Pagine, varianti, copertura dei requisiti, revisioni automatiche | Wireframe | Wireframe, validazione |
| `04_Validazione/test-AAAA-MM-DD.md` | Report del test: problemi `VAL-NN` (frame, personaggio, tipo) e tabella "Decisione del designer" (da costruire) | Problemi: Personas. Decisione: Design Ops con `validazione.py decidi`, dopo l'ok del designer | Wireframe, Design Ops |
| `05_Handoff/handoff.md` | Casi e azioni del flusso per la UI. Le annotation `Tap` stanno su Figma, lo user flow in un FigJam (`Figma Flow`) | `dxs-handoff` | Designer UI |
