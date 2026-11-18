# Stato delle pagine Figma (gate "Wireframe validato")

Il designer segna lo stato di ogni pagina con un'emoji nel nome, come dalla legenda del Read Me del template: 🔴 non ancora disegnato · 🟡 in progress · ✅ concluso (ready for dev) · 🔵 bozza. Design Ops legge questo segnale per proporre il gate. Non scrive mai le emoji.

## Quando
- Comando `Stato`, se `Figma WF` è un link `figma.com/design/<fileKey>` e gli strumenti Figma sono disponibili (altrimenti ALERT C e salta).
- Comando `Procedi` con il gate "Wireframe validato" ancora aperto (fase `wireframe`), prima di decidere lo step.
- Non ripeterlo nella stessa sessione senza richiesta.

## Procedura
1. `get_metadata` sul fileKey di `Figma WF` **senza nodeId**: elenca le pagine, una chiamata leggera.
2. Passa l'output allo script: `python3 scripts/stato_pagine_figma.py --device "<Device di project.md>" --gate si|no` (`si` se "Wireframe validato" è già spuntato).
3. Pagine riconosciute dal nome, senza emoji né nome progetto: `UX Desk`, `UX Mob`. Richieste secondo il `Device`: mobile → UX Mob · desktop → UX Desk · mobile, desktop o web → entrambe · app → UX Mob · non definito → entrambe, segnalato.
4. Esito:

| Esito | Azione |
|---|---|
| pronto | Gate aperto → proposta (sotto). Gate chiuso → nessuna azione |
| in corso, non iniziato | Solo la riga di stato |
| pagine mancanti | "Nel file mancano: UX Desk. Sono state rinominate o tolte?". Nessuna proposta |
| INCOERENZA | Gate spuntato ma pagine non tutte ✅: segnalalo e proponi di riaprirlo |

## Proposta di gate
"Le pagine UX richieste sono ✅ in Figma. Spunto 'Wireframe validato'?" Con l'ok:
- Gate: spunta "Wireframe validato". Esito: "pagine UX ✅ da Figma ([data])". Se in `04_Validazione/` non c'è un report, aggiungi "senza test registrato": è informativo, non blocca. Il ✅ del designer è l'approvazione.
- Fase: `wireframe` → `handoff`. Versione: minore. Changelog: tipo "Gate superato".
- Prossimo: passaggio alla UI (`dxs-handoff`, comando `Handoff`).

Se in `04_Validazione/` c'è un report con ROSSI senza decisione (`scripts/validazione.py stato`), aggiungi alla proposta "attenzione: [ID] senza decisione". Non blocca.

Senza ok esplicito non si scrive nulla.

## Riapertura
INCOERENZA e ok del designer → togli la spunta a "Wireframe validato", fase `handoff` → `wireframe`, versione maggiore, tipo "Modifica di perimetro" con "Riapre: Wireframe validato, Passaggio alla UI".

## Cosa non fa
- Non cambia le emoji né sposta pagine.
- Non legge i frame: per quello servirà lo snapshot del file Figma.
- Non legge le pagine UI: il lavoro sulla UI è fuori dal perimetro di Design Ops.
