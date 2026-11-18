# Multi-testata

Progetti con due o più testate: in `project.md` `testata: Multi-testata` e `testate: [A, B]`. Planner: due o più etichette testata. Cartella: `Progetti UX/Multi-testata/<AAAA-MM_Progetto>/`.

## Doppio conto
Ogni step si esegue per ciascuna testata di `testate`. L'esito del gate è per testata: "Corriere ✓ · Gazzetta ✓". Il gate si spunta solo se tutte sono ✓. Una ✗ lascia il gate aperto e crea una voce in Aperto con la testata. Nel riepilogo HC una riga per testata.

## Divergenze
Dove le testate chiedono cose diverse (personas, design system, header e footer, ADV, device): variante per testata solo se cambia ciò che l'utente vede, altrimenti una versione comune. Un conflitto che una variante non risolve diventa una domanda in Aperto (destinatario: design), non una scelta della skill.

## Override di lancio
Finché le skill non gestiscono il ciclo da sole, aggiungi al lancio:

> Progetto multi-testata: [A, B]. Esegui il lavoro per ciascuna testata. Librerie da `00_Input/libreria/<Testata>/`, ricerche da `Ricerca/<Testata>/`. Marca ogni evidenza, personaggio, pattern e frame con la testata (requisiti validi per tutte: "comune"). Chiudi con l'esito per testata e le divergenze.

Per step:
- **Blender**: benchmark e personas per testata.
- **Personas**: tabella di affinità e personaggi per testata.
- **Wireframe**: header, footer e ADV della testata. `dxs-adv-placement` ha regole solo per Corriere: per le altre segnala "regole mancanti".
- **Handoff**: user flow e annotation per le varianti di ciascuna testata.
