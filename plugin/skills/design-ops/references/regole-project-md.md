# Regole di `project.md` e `CHANGELOG.md`

## Frontmatter

Chiavi: `progetto`, `planner_id`, `testata`, `testate`, `tipologia`, `owner`, `priorita`, `avvio`, `scadenza`, `fase`, `versione`, `dxs_version`, `changelog`, `aggiornato`.

- **Scrive Design Ops**: `fase`, `versione`, `aggiornato`, `dxs_version`.
- **Padrone Planner** (non modificare): `progetto`, `planner_id`, `testata`, `testate`, `tipologia`, `owner`, `priorita`, `avvio`, `scadenza`. Se l'utente chiede di cambiarli, dì che si cambiano in Planner. Se noti una discrepanza, segnalala senza correggere.
- `fase` ammette solo: `avvio`, `benchmark`, `wireframe`, `handoff`, `chiuso`. `benchmark` copre Blender e Personas; `wireframe` copre creazione e validazione e passa a `handoff` solo con il gate "Wireframe validato"; `handoff` copre il passaggio alla UI e passa a `chiuso` con l'HC di `dxs-handoff`. Il processo si chiude con la consegna alla UI: ciò che segue ha regole proprie. Sono i valori che Design Ops riconosce: non inventarne altri.
- `aggiornato`: data odierna (`date +%F`).

## Corpo

Sezioni fisse, in quest'ordine: titolo + riga Release · Contesto · Link · Gate · Aperto.

- Link: Brief, Riferimento online, Design esistente, Research, Benchmark, Blender, Personaggi, Figma WF, FigJam, Figma Flow, Architettura (solo se esiste), Product Snapshot. Voce senza dato: `—`.
- Riga Release: `**Release vX.Y.Z** (AAAA-MM-GG) — sintesi di una frase · [Changelog](./CHANGELOG.md)`. Riporta sempre l'ultima voce del changelog.
- Contesto: Obiettivo, Personas DXS, Device, Referenti, Vincoli. Se manca `Device` o `Referenti`, aggiungili.
- Gate (5 voci): Benchmark, Personas, Wireframe, Wireframe validato (personas + review designer), Passaggio alla UI (handoff). Gate di versioni precedenti (UI, Audit DXS, Handoff (ThePack)) non fanno parte del processo: lasciali e non proporli come prossimo step. Se il file ne ha meno, aggiungi le mancanti nell'ordine standard e registralo nel changelog come "Correzione".
- Gate spuntato: `- [x] Nome — esito breve ([link])`.
- Solo link e sintesi, mai contenuti. Max 60 righe totali.
- Aperto: quando una voce si chiude, toglila e registrala nel changelog come "Decisione".

## Versioni

- **Maggiore** (2.0.0): modifica di perimetro, cambia obiettivo, personas o vincoli. Riapre gate.
- **Minore** (1.3.0): gate superato.
- **Patch** (1.3.1): decisione dentro il perimetro, correzione, materiali di avvio. Le voci di Aperto e i link aggiunti dopo l'avvio non cambiano la versione.
- Parte da 1.0.0 alla creazione. Incrementando un livello, azzera quelli sotto.

## CHANGELOG

Voci più recenti in alto, sotto il titolo. Mai modificare voci passate.

```
## vX.Y.Z — AAAA-MM-GG · Gate superato | Decisione | Modifica di perimetro | Correzione
Sintesi in una riga.
- Esito: [link]
- Approvato da: [nome]
- Riapre: [gate]            ← solo per modifica di perimetro
```

Modifica di perimetro: aggiungi anche `- Prima: … → Dopo: …` e `- Motivo: …`.

## Ordine di scrittura

0. Modifiche rilevate applicate: righe in `storico.md` (`scan.py --lines`).
1. Voce in `CHANGELOG.md`.
2. `project.md`: frontmatter, riga Release, Gate, Link, Aperto, Contesto (solo con ok).
3. Rileggi il frontmatter di `project.md` e verifica che `versione` coincida con la voce in cima al changelog.
