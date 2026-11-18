# Annota

L'allineamento con Business e Dev avviene offline. Per questo serve sapere da chi arriva un'indicazione, a quale versione si riferisce e cosa è stato condiviso.

## Forme
- `Annota <testo>`
- `Annota [Fonte] <testo> [vX.Y]`
- `Annota condiviso <output> [con Fonte]`

Fonte: Business, Dev, Marketing, Design, o un'altra etichetta. La versione (`vX.Y` o `vX.Y.Z`) è quella a cui si riferisce il feedback; se manca vale l'attuale, cioè la prima voce di `CHANGELOG.md`.

## Senza etichetta
- Testo con "?" → riga in Aperto, owner dal frontmatter se non indicato. Nessuna nuova versione.
- Altrimenti → Decisione: patch, voce in `CHANGELOG.md` (max 15 parole, più il motivo se dato).

## Con etichetta (feedback dell'allineamento)
È un input da valutare, non una decisione: la decide il designer.
- → riga in Aperto: `- [Fonte] testo (su vX.Y) — da valutare — Owner: <owner>`, anche senza "?". Nessuna nuova versione.
- Se il testo dice "ok", "approvato", "confermato" o "deciso" → Decisione (patch), con etichetta e versione nel testo della voce.
- Versione citata diversa dall'attuale → avvisa: "Il feedback è su vX.Y, la versione attuale è vZ: verifica che valga ancora."
- Quando una voce di Aperto si chiude, spostala nel changelog come Decisione.

## `condiviso`
Registra che un output è stato condiviso, senza nuova versione. Aggiungi una riga a `storico.md`:

`AAAA-MM-GG hh:mm · condiviso · <output> (vX.Y.Z@impronta) · con <Fonte>`

L'impronta: `python3 scripts/scan.py <progetto> --hash <file>` (8 caratteri).

| Output | File |
|---|---|
| architettura | `03_Wireframe/architettura.md` |
| wireframe, pagine | `03_Wireframe/pagine.md` (i frame stanno su Figma: l'impronta copre solo l'elenco) |
| benchmark | `01_Blender/benchmark.md` |
| principi | `01_Blender/principi.md` |
| journey, personas | `01_Blender/personas-journey.md` |
| personaggi | `02_Personas/personaggi-del-progetto.md` |
| altro | chiedi il file, oppure registra senza impronta |

## Vincoli
`Annota [Fonte] vincolo [blocca|limita|nota]: <testo> [su ID]` e `Annota VIN-NN recepito|superato|su ID`: regole in `references/vincoli.md`.

## Snapshot dopo la scrittura
`Annota` modifica `project.md`, `CHANGELOG.md`, `storico.md` o `vincoli.md`. Dopo ogni scrittura: `python3 scripts/scan.py <progetto> --touch <file scritti>`. Aggiorna solo quei file, così le modifiche esterne non ancora segnalate restano visibili al controllo successivo.

## Controllo in `Stato`
Per ogni output con una riga `condiviso` nello storico (solo l'ultima per output) confronta l'impronta con quella attuale. Se è diversa aggiungi una riga: "architettura modificata dopo la condivisione (v1.3.0)". Max 3 righe.

## Limiti
- Cambio di obiettivo, personas, vincoli o device → non registrare: "Sembra una modifica di perimetro: usa `Aggiorna`."
- Il comando è già l'autorizzazione a scrivere. Una sola riga di conferma.

## Esempi
- `Annota [Business] spostare il filtro prezzo in alto, su v1.3` → Aperto: "[Business] spostare il filtro prezzo in alto (su v1.3.0) — da valutare".
- `Annota [Dev] il refresh in pagina causa CLS?` → Aperto, con la domanda.
- `Annota [Business] approvato wireframe v1.3` → Decisione (patch): "[Business] approvato wireframe (v1.3.0)".
- `Annota condiviso architettura con Business` → riga in `storico.md`, con la versione e l'impronta.
