# Avvio progetto — {{PROGETTO}}
Testata: {{TESTATA}} · Cartella: {{PERCORSO}}

## 1. Crea il Project in Claude (2 minuti)
1. App desktop di Claude → Projects → Nuovo progetto. Nome: «{{PROGETTO}}».
2. Collega **solo** la cartella di questo progetto (menu +). Mai la radice "Progetti UX", mai altri progetti.
3. Collega in sola lettura anche `Ricerca` e `Papers`. Se non sono sul Mac, sincronizzale prima.
4. Incolla le istruzioni del Project (punto 2).
5. Mac: tasto destro sulla cartella → "Mantieni sempre su questo dispositivo".
6. Duplica il template Figma (https://www.figma.com/design/ZpNyqTL8ranowMQIcs73WC/Template-Progetto-Corriere, vale per tutte le testate) e verifica che la libreria `DXS Corriere – Wireframe library` sia attiva nel file.
7. Duplica il template FigJam (https://www.figma.com/board/UJQiuUZFuSDpnFO0RttACW/Template-Progetto-UX) e tieni il link: ci finiranno benchmark, user flow e personas.
8. Metti il brief in `00_Input/` (file, non link) e scrivi **Avvia**.

## 2. Istruzioni del Project (da incollare)
```
Progetto UX/UI: {{PROGETTO}} ({{TESTATA}}). Per ogni richiesta usa la skill design-ops.
Comandi: Avvia · Procedi · Stato · Aggiorna · Annota [Fonte] <testo>.
Lavora solo dentro la cartella di questo progetto. Ricerca e Papers sono in sola lettura. Non toccare altri progetti.
Una sessione = uno step (eccezione: correzioni dello stesso step). A fine step chiedi di aprire una nuova sessione e scrivere "Procedi".
Non rispondere al posto mio ai checkpoint. Scrivi project.md e CHANGELOG.md solo dopo il mio ok.
Non cancellare né sovrascrivere file senza ok esplicito.
Progetti multi-testata: applica i controlli a tutte le testate indicate in project.md.
Risposte sintetiche: risposta prima, dettaglio nei file.
```

## 3. I 5 comandi
| Comando | Cosa fa |
|---|---|
| **Avvia** | Poche domande di avvio (Figma, device, riferimenti, referenti), poi registra tutto |
| **Procedi** | Esegue il prossimo step |
| **Stato** | Fase, versione, prossimo step, voci aperte |
| **Aggiorna** | Nuovo materiale o cambio di obiettivo, personas, vincoli, device |
| **Annota** `[Fonte] <testo>` | Registra una decisione o una domanda aperta; con `[Business]` o `[Dev]` un feedback; con `condiviso <output>` cosa hai condiviso e a che versione |

## 4. Tieni pronti per «Avvia»
- Brief in `00_Input/` (obbligatorio)
- Link al file Figma del progetto, duplicato dal template con la libreria la Wireframe library attiva
- Link al FigJam del progetto, duplicato dal template
- Device previsti (mobile, desktop, entrambi, app)
- URL del riferimento online, se c'è un prodotto esistente
- Design esistente (obbligatorio se Evoluzione o Redesign)
- Nomi di PO, Marketing, Dev per le domande aperte
- Altro: heatmap, scrollmap, recording, ricerche specifiche, Product Snapshot, linee guida Dev
