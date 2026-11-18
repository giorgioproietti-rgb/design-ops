# Controllo modifiche (a ogni attivazione)

Le cartelle possono cambiare fuori da Design Ops: file copiati, tolti, rinominati, `project.md` ritoccato a mano. Design Ops lo verifica a ogni comando, mostra gli impatti e chiede prima di tenerne conto. Claude non ha un listener sempre attivo: il controllo avviene quando si attiva un comando.

## Esecuzione
1. `python3 scripts/scan.py <cartella del progetto>` (lo script sta accanto a `SKILL.md`). Solo lettura, non apre i file: confronta dimensione, data e impronta con `_stato.json`.
2. Nessuno snapshot (primo avvio) → "BASELINE": nessuna domanda. Lo snapshot si crea alla fine di `Avvia`.
3. Nessuna modifica → prosegui senza dire nulla.
4. Solo `info` → una riga ("N file non rilevanti") e prosegui.
5. Almeno una `warn` o `alert` → report e domanda (sotto). `Avvia`, `Procedi`, `Aggiorna` chiedono. `Stato` e `Annota` mostrano una riga ("N modifiche non registrate: scrivi `Procedi` o `Aggiorna` per esaminarle") e non toccano lo snapshot.
6. Nota `SYNC?` (più della metà dei file mancante): non è una cancellazione. Avvisa "sincronizzazione incompleta, riprova tra poco" e fermati.
7. Nota `INTEGRITÀ` (versione di `project.md` diversa dal changelog): trattala come un `alert` del manifest.

## Report e domanda
Max 10 righe: elenco numerato con simbolo (`+` nuovo, `~` modificato, `-` tolto, `>` rinominato), percorso, gate toccato e impatto proposto. Poi:

> Applico? **sì** (tutte) · **no** (ignora e registra) · numeri (es. "1, 3")

## Impatti

| Cosa è cambiato | Impatto | Proposta se applicata |
|---|---|---|
| `project.md` o `CHANGELOG.md` modificato a mano, o versioni diverse | Manifest incoerente | Mostra la differenza, chiedi quale vale, allinea versione e changelog (voce "Correzione") |
| Input nuovo o modificato (`00_Input/`, ricerca) a gate Benchmark chiuso | Il benchmark non copre più il materiale | `Aggiorna`: Blender in aggiornamento. Se tocca il Contesto → versione maggiore e gate a valle riaperti ("Riapre") |
| Input tolto | Evidenze che lo citavano | Segnala le righe di `registro-input.md` che lo citano; `Aggiorna` per ricalcolare |
| Libreria di testata modificata | Personas | Proponi di rivalutare le personas (`Procedi` riapre lo step 2) |
| Output di step modificato a mano (`01_` – `05_`), gate chiuso | L'output non coincide più con ciò che il gate ha approvato | Registra come Decisione ("modificato a mano"). Non sovrascriverlo: gli step a valle lo leggono così com'è. Se è `pagine.md`, Figma può non coincidere: proponi la revisione dei wireframe |
| Output mancante a gate chiuso (`alert`) | Gate senza prova | Chiedi: ripristinare dalla cronologia versioni di OneDrive, rifare lo step o togliere la spunta (riapre) |
| `vincoli.md` modificato a mano | Registro non allineato | Segnala. Non è un gate: allinea con `Annota` (`references/vincoli.md`) |
| Rinominato | I file che lo citano puntano al nome vecchio | Solo segnalazione |
| Non classificato | Nessuno | Chiedi dove va, oppure lascia |

Gate non ancora chiuso → la modifica è solo `info`: non c'è nulla da invalidare.

## Cosa fanno "sì" e "no"
- **sì**, per ogni modifica scelta:
  1. riga in `storico.md`: `python3 scripts/scan.py <progetto> --lines applicato`, accodata (append);
  2. se la tabella prevede un effetto sul manifest: voce in `CHANGELOG.md` (patch "Decisione" o "Correzione"; maggiore con "Riapre" se riapre dei gate) e `project.md`, con le regole di scrittura di `references/regole-project-md.md`;
  3. mai modificare il contenuto dei file dell'utente.
- **no**: riga in `storico.md` con `--lines ignorato`, nessun cambio a gate e manifest. Lo snapshot si aggiorna, quindi non viene riproposto.
- Risposta ambigua o assente → non approvato: non scrivere nulla, lascia lo snapshot e riproponi al prossimo comando.

## Storico (`storico.md`)
Registro cronologico, append-only, di tutto ciò che è stato rilevato e deciso. Complementa `CHANGELOG.md`, che resta la storia semantica (versioni, decisioni, gate, perimetro).

Formato: `AAAA-MM-GG hh:mm · + percorso · gate · applicato|ignorato`. Le condivisioni (`Annota condiviso`) hanno una riga propria, vedi `references/annota.md`.

- Oltre 300 righe: sposta le più vecchie in `storico-archivio/AAAA-MM.md` e lascia le ultime 100.
- L'autore di una modifica non è rilevabile da qui: si legge dalla cronologia versioni di OneDrive.

## Snapshot (`_stato.json`)
Lo scrive solo `scan.py --update`, mai a mano. Aggiornalo:
1. a fine di ogni step, dopo l'ultima scrittura (storico e changelog compresi), così le modifiche della sessione non risultano esterne;
2. dopo la risposta al report.
3. dopo un `Annota`, solo per i file scritti: `scan.py --touch <file>...`.

## Avviso opzionale (Power Automate)
Un listener che scrive sui file non è consigliato: produce versioni inutili e collide con le sessioni. Un flusso può invece solo avvisare l'owner su Teams quando `project.md` o `CHANGELOG.md` cambiano fuori da Design Ops o quando un brief viene tolto.
