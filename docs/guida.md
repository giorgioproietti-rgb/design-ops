# Guida

Plugin del team UX/UI Design. Porta un progetto dalla richiesta in Planner alla **consegna di un file solido alla UI**: l'AI esegue il lavoro ripetitivo, il designer approva ai checkpoint. Ciò che segue la consegna (UI, audit, consegna ai dev) ha regole proprie e non è gestito qui.

## Il percorso

| Step | Skill | Output principale |
|---|---|---|
| Avvio | `design-ops` (`Avvia`) | `project.md` compilato, Cover del file Figma |
| 1 Benchmark e ricerca | `magic-blender` | pacchetto in `01_Blender/`, pagine su FigJam |
| 2 Personas | `dxs-personas` | `02_Personas/`, schede su FigJam |
| 3 Architettura e wireframe | `dxs-wireframe` (+ `dxs-adv-placement`) | `03_Wireframe/`, frame su Figma |
| 4 Wireframe validato | `dxs-personas --testDesign` oppure pagine UX ✅ | `04_Validazione/` |
| 5 Passaggio alla UI | `dxs-handoff` | `05_Handoff/`, annotation e user flow |

`design-ops` orchestra tutto: legge `project.md`, lancia lo step giusto, tiene i checkpoint e scrive manifest e changelog solo dopo l'ok.

## I cinque comandi

`Avvia` · `Procedi` · `Stato` · `Aggiorna` · `Annota`. Si scrivono come prima parola del messaggio, oppure come `/design-ops:avvia`, `/design-ops:procedi`, `/design-ops:stato`, `/design-ops:aggiorna`, `/design-ops:annota`.

## Requisiti

- App desktop di Claude con la cartella del progetto collegata al Project (le cartelle `Ricerca` e `Papers` in sola lettura, facoltative).
- Connettore Figma attivo (Cover, FigJam, wireframe, handoff).
- File Figma e FigJam duplicati dai template, template SharePoint aggiornato (vedi `docs/`).

## Installazione

1. **Rimuovi le skill installate singolarmente** (`design-ops`, `magic-blender`, `dxs-personas`, `dxs-wireframe`, `dxs-adv-placement`, `dxs-handoff`, `dxs-regia`, `magic-blender-v21`, `magic-blender-design-requirements`). Se restano, si attivano due volte.
2. *Customize → Plugins → Add → Upload plugin* e scegli lo zip.
3. Il plugin si carica nel **task successivo**. Se non compare, riavvia l'app.
4. Condivisione col team: un owner dell'organizzazione usa *Publish to org* (o carica lo zip nel marketplace dell'organizzazione) e lo imposta "disponibile" o "installato di default".

## Primo progetto

1. Crea la card in Planner (bucket "Nuovi progetti UX", etichetta della testata): il flusso crea la cartella.
2. Crea il Project di Claude seguendo `00_Input/_AVVIO.md` (solo la cartella del progetto collegata).
3. Metti il brief in `00_Input/` e scrivi `Avvia`.
