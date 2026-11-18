# Benchmark – due flussi

## Flusso 1 – Figma (default)

- Input: link ai file **MegaBenchmark** e **Benchmark**. Cercali in `Blender.md`, `project.md`, messaggi dell'utente.
- Mancano → chiedili una volta. Il connettore Figma non cerca file per nome.
- Keyword dal `brief.md`: tema (es. onboarding, paywall, TYP), piattaforma, competitor.
- `get_metadata` sul file, solo pagine e frame di primo livello.
- Filtra per keyword su nomi di pagine e frame. Nessun match → prova sinonimi IT/EN, poi stop.
- `get_screenshot` solo sui frame filtrati. Budget: max 15.
- Ogni osservazione → `BEN-NN`, fonte = link al nodo.
- Esito: elenca competitor e temi coperti.
- Passa al Flusso 2 solo se: tema non coperto, meno di 3 competitor, materiale più vecchio di 18 mesi.

## Flusso 2 – Web (solo sui buchi)

- Siti e link: `references/siti-benchmark.md`. Parti dalla tabella "Fissi".
- Aggiungi concorrenti diretti e comparable di altri settori, se il problema lo richiede (tabelle dedicate nello stesso file).
- Sito nuovo trovato e utile → proponi all'utente di aggiungerlo a `siti-benchmark.md`.
- Parti pubbliche → ricerca web. Budget: max 2 ricerche per competitor.
- Dietro login o abbonamento → solo screenshot dell'utente. La ricerca web non vede queste aree.
- Evidenza assente → "non verificato: [motivo]". Mai dedurre il funzionamento.

## Pattern

- Raggruppa per tema, non per sito.
- Pattern = soluzione vista in almeno 2 competitor. ID `BEN-P-NN`, cita le `BEN-` di origine.
- Differenze rilevanti: solo se cambiano una scelta di design.
- Ogni pattern → implicazione per il progetto, in una riga.
