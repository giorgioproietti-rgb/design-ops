# Template, ID e stati

## Regole comuni

- Solo titoli e liste. Niente tabelle, immagini, formattazione complessa.
- Una voce per riga, autosufficiente. Niente "vedi sopra": cita l'ID.
- Ogni voce: ID, stato, fonte tra parentesi.
- Titoli e ordine delle sezioni fissi: l'agente Figma li usa come ancore.
- Condizioni per intero (chi, quando, eccezioni). Matrici → righe esplicite.

## ID

- `AREA-NN`: livello journey (obiettivo, ingresso, accesso). Es. `ONB-01`.
- `AREA-SOTTOAREA-NN`: step o componente. Es. `ONB-CLUB-02`.
- `PER-NN` personas · `PRIN-NN` principi · `SUG-AREA-NN` suggeriti.
- `Q-MKT-NN` · `Q-BIZ-NN` · `Q-DES-NN` domande.
- `BEN-NN` osservazioni · `BEN-P-NN` pattern · `RIC-NN` ricerca.
- Mai riusare un ID, nemmeno se sostituito o scartato.

## Stati

- `[confermato]` da brief o decisione esplicita.
- `[nuovo]` entrato nell'ultimo ciclo.
- `[modificato]` corretta la forma, non la regola.
- `[sostituito da ID]` non più valido, resta per traccia.
- `[in conflitto con ID]` risoluzione aperta.
- `[suggerito]` proposta con evidenza, non nel brief.
- `[scartato]` suggerimento rifiutato; motivo nel registro.

## Ciclo di vita

- Inizio aggiornamento: `[nuovo]` e `[modificato]` → `[confermato]`.
- Correzione di forma → stesso ID, `[modificato]`, "era / ora" nel registro.
- Cambio di regola (comportamento, visibilità, stati, dati) → nuovo ID `[nuovo]`, vecchio `[sostituito da ID]`. Nel dubbio: cambio di regola.
- Suggerito accettato → nuovo ID di journey `[nuovo]`, `SUG-` → `[sostituito da ID]`.
- Suggerito rifiutato → `[scartato]` + motivo. Nessuna risposta → resta `[suggerito]`.
- Conflitto risolto → vincente `[confermato]` (o `[nuovo]`), perdente `[sostituito da ID]`.

## `brief.md`

```markdown
# Brief – [Progetto]
Fonti: [doc 1, data] · [doc 2, data]

## Obiettivo
- [obiettivo di business] (fonte: doc, slide)
## Utenti
- [segmento] (fonte: ...)
## Regole di visibilità
- [chi vede cosa, eccezioni] (fonte: ...)
## Flussi
- [flusso e diramazioni] (fonte: ...)
## Stati
- [schermata/componente: stati] (fonte: ...)
## Dati da memorizzare
- [dato e perché serve] (fonte: ...)
## Vincoli
- [tecnico | legale | tempi | brand] (fonte: ...)
## Ambiguità
- [incongruenza o lacuna] (fonte: ...) → domanda per [Marketing | Business | Design]
```

## `benchmark.md`

```markdown
# Benchmark – [Progetto]
Flusso: [1 | 2 | 1+2] · Data: [data] · Stato: [in validazione | validato il data]
Coperti: [competitor] · Non coperti: [competitor]

## [Tema]
- BEN-01 [Competitor]: [soluzione]. Fonte: [link nodo | URL | screenshot utente | non verificato: motivo]

## Pattern
- BEN-P-01 [pattern] (da: BEN-01, BEN-04). Implicazione: [per noi]. Supporto: [RIC-NN, se c'è]

## Differenze rilevanti
- [differenza] (da: BEN-...). Implicazione: [...]
```

## `Blender.md`

```markdown
# Blender – [Progetto]
Aggiornato: [data] · Versione [N]

## Contesto
- Testata: [nome]
- Prodotto e piattaforma: [web | app | entrambi]
- Obiettivo di business: [una riga]
- Problema da risolvere: [una riga]
- Perimetro: dentro [...]; fuori [...]

## Personas
- PER-01 [nome] – [chi è, una riga]
- Personas DXS: [valore per il project.md]

## Vincoli
- [tecnico | legale | tempi | brand]: [vincolo] (fonte: ...)

## Link
### Brief
- [titolo] – [link o path]
### Benchmark
- [MegaBenchmark | Benchmark | benchmark.md] – [link]
### Ricerche
- [titolo, categoria] – [link]
### Riferimenti online
- [titolo] – [URL]

## Status
### Ricerca
- [completa | parziale | da avviare] · Lacune: [elenco breve] · Richieste aperte: [n]
### Benchmark
- [validato il data | in validazione | da rifare] · Flusso: [1 | 2 | 1+2]
```

## `insight.md`

```markdown
# Insight – [Progetto]
Aggiornato: [data]

## Insight chiave
- [max 5 insight, ognuno con RIC-]

## Evidenze
- RIC-01 [mercato | qualitativa | quantitativa | personas] Dato: [...]. Deduzione: [...]. Si applica a: [journey, step]. Solidità: [buona | debole: motivo]. Origine: [repository | papers | web | utente]. Fonte: [doc | URL | file allegato | link]

## Dati comportamentali
- [heatmap | scrollmap | recording] [pagina/flusso, periodo, device] – formato: [file | link | file + link]

## Lacune
- [categoria o tema senza evidenza] – impatto: [journey/decisione a rischio]

## Richieste di approfondimento
- [cosa serve] – perché: [decisione bloccata] – a chi: [team/persona] – stato: [aperta | in corso | chiusa]
```

## `domande.md`

```markdown
# Domande aperte – [Progetto]

## Marketing
- Q-MKT-01 [aperta | risolta: risposta, data] [domanda] (origine: ID o ambiguità)
## Business
- Q-BIZ-01 [...]
## Design
- Q-DES-01 [...]
```

## `principi.md`

```markdown
# Principi di design – [Progetto]
- PRIN-01 [stato] [principio, una riga] (evidenza: BEN-P-.., RIC-..)
```

## `personas-journey.md`

```markdown
# Personas e journey – [Progetto]
Versione [N] – [data] · Requisiti: [n] · In conflitto: [n] · Suggeriti: [n]

## Personas
### PER-01 – [Nome]
- Chi è: [...]
- Bisogni: [...]
- Frustrazioni: [...]
- Contesto d'uso: [device, momento]
- Journey principali: [J1, J2]
- Fonte: [Personas DXS | RIC-.. | protopersona]

## Journey da progettare
1. [Nome] – personas: PER-01
2. [Nome implicito, es. rifiuto] – personas: PER-02

## Journey 1 – [Nome]
### Obiettivo e punto d'ingresso
- ONB-01 [confermato] [obiettivo e ingresso] (fonte: ...)
### Condizioni di accesso
- ONB-02 [confermato] [a chi è mostrato] (fonte: ...)
- ONB-03 [confermato] [a chi non è mostrato] (fonte: ...)
### Step 1 – [Nome]
- ONB-CLUB-01 [confermato] [requisito] (fonte: ...)
- ONB-CLUB-02 [confermato] Stati: [default]; [dopo l'azione] (fonte: ...)
### Casi limite e dati
- ONB-DATI-01 [confermato] [dato e perché serve] (fonte: ...)
### Suggeriti
- SUG-ONB-01 [suggerito] [proposta]. Evidenza: [BEN-/RIC-, dato in breve]. Estende: [ID]
```

Esempio di requisito:
- ONB-CLUB-02 [confermato] La card Club non è mostrata a chi acquista solo Giochi e/o Lettura o solo prodotti gratuiti; con un prodotto gratuito e uno a pagamento è mostrata. (fonte: brief TYP, slide 11)

## `registro-input.md`

```markdown
## Input [N] – [data]
- Tipo: [brief | riunione | richiesta | ricerca | correzione]
- Fonte: [documento, persona, riunione]
- Contenuto: [max 3 bullet]
- Effetto: [ID creati, modificati, sostituiti]
```

## `registro-coerenza.md`

```markdown
## Ciclo [N] – [data] (input [N])
### Modifiche
- [ID] [modificato] – era: [...]; ora: [...]
- [ID vecchio] [sostituito da ID nuovo] – motivo: [...]
- [SUG-ID] [scartato] – motivo: [...]
### Conflitti
- [ID] vs [ID]: [descrizione]. Risoluzione: [scelta | aperta]. Motivo: [...]
### Impatto sul design
- [frame o sezione Figma]: [da rivedere: cosa | già coerente]
```
