# Changelog

## 1.0.3 — 2026-11-18
- **Plugin ridotto alle sole istruzioni:** documentazione, domande frequenti e strumenti di rilascio non sono più nel plugin. Vivono in un repository con un sito sempre consultabile, che si ricostruisce da solo a ogni modifica.
- Il README del plugin rimanda alla documentazione online.

## 1.0.2 — 2026-11-18
- **Wiki:** nuove domande sull'aggiornamento (come sapere la versione installata, cosa cambia in ogni versione, effetto sui progetti già avviati, come rilasciare e aggiornare la wiki).

## 1.0.1 — 2026-11-18
- **Wiki del plugin:** pagina web con domande frequenti e ricerca intelligente che risponde solo con i contenuti del plugin. Si rigenera a ogni rilascio.
- **Strumenti di rilascio:** `tools/release.py` aggiorna versione, changelog, wiki e zip; `docs/manutenzione.md` spiega la procedura.

## 1.0.0 — 2026-11-17
Prima versione consolidata del processo, collaudata su un progetto reale.

- **design-ops:** comandi Avvia, Procedi, Stato, Aggiorna, Annota; perimetro e sessioni; controllo modifiche e storico; vincoli (`VIN-`); Cover, Read Me e nomi pagina su Figma; pubblicazione su FigJam; validazione con decisione del designer (HC3); step Handoff. Il processo termina con la consegna alla UI.
- **magic-blender:** triage dei papers.
- **dxs-personas:** schede su FigJam di progetto, tabella segmenti ↔ personaggi, report di validazione strutturato (`VAL-`), lettura dei vincoli. `SKILL.md` ridotto da 22 a 8 KB: le procedure delle due fasi sono in file di riferimento, caricati solo quando servono.
- **dxs-wireframe:** architettura informativa, limite di revisioni per pagina, frame ritoccati a mano protetti, vincoli.
- **dxs-handoff**, **dxs-adv-placement:** descrizioni allineate.

## Prossime versioni
- Matrice di tracciabilità e pacchetto di condivisione per il Business.
- Snapshot del file Figma e dipendenze con impronta.
- Script per le pagine FigJam di ricerca.
- Alleggerire `dxs-wireframe` nelle modalità revisione e aggiornamento.
- Plugin separato per la manutenzione della libreria (`dxs-component-robustness`, `dxs-figma-component-docs`, `dxs-infrastructure-robustness`).
