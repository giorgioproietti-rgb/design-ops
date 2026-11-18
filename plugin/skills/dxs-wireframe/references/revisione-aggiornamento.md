# Revisione e aggiornamento

Leggi solo in queste modalità. Principio: tocca solo i frame interessati. Lo script fa upsert per nome: stessi nomi → stessa posizione, il resto della pagina Figma non cambia.

## Revisione (da `04_Validazione/`)

1. Leggi il report più recente in `04_Validazione/`. Estrai solo i problemi con `Decisione` = `accettato` nella sezione "Decisione del designer". Tabella ancora vuota → tutti i ROSSI, dichiarandolo.
2. Mappa ogni problema → pagina `WF-` / variante dalla colonna `Frame`: l'ID `WF-NN` se c'è, altrimenti area e nome pagina del frame (`AREA · Pagina · variante · M|D`) da cercare in `pagine.md`. Colonna `Tipo`: `modifica` → passo 4; `flusso` → nuova pagina (passo 4); `requisito` → non risolverlo qui (passo 7). `vincolo` → non risolverlo qui: riportalo in HC2 con il `VIN-NN`.
3. Per ogni pagina da modificare controlla `Revisioni auto` e `Manuale` nel suo blocco di `pagine.md`. 2/2 o `Manuale: sì` → non toccarla: elencala in HC2 con i suoi problemi ("serve decisione del designer" oppure "frame manuale: da correggere a mano"). Le altre pagine procedono.
4. Modifica solo i blocchi `wf` coinvolti. Problemi di flusso (pagina mancante, ordine) → nuova pagina `WF-` con ID nuovo, mai riusare un ID.
5. `check_coverage.py`, poi `build_payload.py pagine.md WF-03 WF-05:PER-02 [--adv <json testata> se `ADV: sì`]` (solo il necessario).
6. Incrementa `Revisioni auto` solo delle pagine modificate, poi versione e data. Un tentativo in più per una pagina solo su richiesta esplicita del designer: riporta il suo contatore a 1/2 e registra una Decisione. Sotto la pagina aggiungi `- Rev [n]: VAL-NN → [modifica] (fonte: report)`. L'ID del problema è obbligatorio: permette a Design Ops di verificare che i problemi accettati siano stati trattati.
6b. Dopo il render, `protected` nell'esito = frame ritoccati a mano in Figma, non rigenerati. Imposta `Manuale: sì` sulla loro pagina in `pagine.md` e riportali in HC2. Rigenerarli solo con ok esplicito, con `--force`.
7. Problemi che chiedono requisiti nuovi o diversi → non risolverli qui: segnalali come input per `magic-blender`.

## Aggiornamento (da Blender)

1. Input: ID cambiati da `registro-coerenza.md` / `registro-input.md` dell'ultimo ciclo (`[nuovo]`, `[sostituito da ID]`, `[in conflitto con ID]`).
2. `check_coverage.py personas-journey.md pagine.md --changed ID,ID` → pagine toccate, requisiti non coperti, ID non più attivi.
3. GATE-SKILL ridotto: proponi solo le differenze (pagine da modificare, aggiungere, eliminare). Attendi il sì.
4. Pagine con tutti i requisiti `[sostituito]` → proponi l'eliminazione dei frame. Eliminare è irreversibile: solo con sì esplicito, poi rimuovi i frame per nome.
5. `[in conflitto]` → non disegnare la parte in conflitto; segnalala in HC2.
6. Render solo delle pagine toccate. Il contatore `Revisioni auto` non si incrementa (è un cambio di requisiti, non una revisione).

## Eliminare frame (solo dopo sì)

```js
const page = figma.root.children.find(p => p.name === 'Wireframe');
await figma.setCurrentPageAsync(page);
const names = __NAMES__; const removed = [];
for (const n of page.children.filter(n => names.includes(n.name))) { removed.push(n.name); n.remove(); }
return { removed };
```

## Dopo l'handoff

- Se esiste `05_Handoff/handoff.md`, i frame rigenerati perdono le annotation `Tap` di dxs-handoff. Elencali in HC2 e indica di rilanciare `Handoff --note`.
- Elemento rinominato o rimosso (testo di bottone, card, campo) → segnalalo: le azioni in `handoff.md` vanno aggiornate.
