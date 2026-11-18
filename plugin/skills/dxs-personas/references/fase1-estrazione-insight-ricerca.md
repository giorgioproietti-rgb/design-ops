# Analisi delle ricerche per le protopersona

Obiettivo: estrarre dalla cartella delle ricerche solo gli insight utili a costruire le protopersona del progetto, spendendo il minimo indispensabile in letture.

## 1. Trovare la cartella

Se esiste la cartella `Ricerca` collegata al Project, usa `Ricerca/<Testata>/` (nessuna sottocartella per la testata → chiedi quale usare) insieme a `00_Input/ricerca/`, senza chiedere. Altrimenti cerca, in ordine: cartella del progetto (accanto a `project.md`), cartella della testata, radice del workspace. Nomi accettati (case-insensitive, anche come sottocartelle): `ricerche`, `ricerca`, `research`, `paper`, `papers`, `studi`, `insight`, `insights`, `user-research`. Se `project.md` indica un percorso per le ricerche, usa quello.

- Una cartella trovata → usala.
- Più cartelle → elencale e chiedi quali usare (anche tutte).
- Nessuna → registra "nessuna ricerca trovata" e prosegui con il flusso basato solo su "Personas DXS".

## 2. Definire il brief di analisi

Dal `project.md` ricava in 3–5 righe:
- obiettivo del progetto / prodotto
- target ("Personas DXS")
- testata
- domande a cui le protopersona devono rispondere (chi usa il prodotto, in che contesto, con quali bisogni e frustrazioni, cosa usa oggi)

Il brief è il filtro: un insight entra solo se risponde ad almeno una di queste domande per questo target.

## 3. Riusare il lavoro già fatto

Se esiste `<cartella testata>/insight-ricerca.md`, leggilo per primo. Contiene l'elenco dei file già analizzati con data di modifica. Analizza solo:
- file non presenti nell'elenco
- file con data di modifica più recente di quella registrata

Gli insight già presenti si riusano se pertinenti al brief corrente.

## 4. Selezionare e leggere in modo mirato

Formati: `.md`/`.txt` diretti; PDF con la skill `pdf-reading`; `.docx` con la skill `docx`; `.xlsx`/`.csv` (dati di survey) con la skill `xlsx`. Elenca come "non analizzati" i formati non leggibili.

Per contenere tempo e token:
1. **Triage**: per ogni file leggi solo titolo, abstract/executive summary o prime righe. Classifica: pertinente / marginale / non pertinente al brief.
2. **Lettura mirata** solo dei pertinenti: sintesi, risultati, conclusioni, sezioni su segmenti, comportamenti, bisogni. Salta metodologia estesa, bibliografia, appendici, salvo che servano a valutare l'evidenza.
3. Se i file pertinenti sono più di 8, parti dai più recenti e dai più specifici per testata e target; segnala quelli non letti.

## 5. Estrarre gli insight

Formato di ogni insight (una riga, massimo due):

```
- [I-<n>] <insight in forma di fatto osservato, non di raccomandazione> — fonte: <file, pagina/sezione> · evidenza: <alta | media | bassa> · tag: <comportamento | bisogno | frustrazione | contesto | device | segmento>
```

Livello di evidenza:
- **alta**: dato quantitativo su campione ampio, o ricerca specifica su questa testata e questo target
- **media**: ricerca qualitativa (interviste, test) o dati di settore su un target simile
- **bassa**: report generici, opinioni, dati vecchi (più di 3 anni) o su mercati diversi

Regole:
- Solo fatti presenti nei documenti. Nessuna inferenza presentata come insight.
- Parafrasa, non copiare passaggi lunghi.
- Segnala le contraddizioni tra fonti e quelle con "Personas DXS".
- Punta a 5–15 insight utili; meglio pochi e solidi che molti e generici.

## 6. Aggiornare insight-ricerca.md

In `<cartella testata>/insight-ricerca.md`, solo aggiunte:

```markdown
## Analisi – <data> – progetto <nome>
Brief: <3-5 righe>
Cartella: <percorso>

### File analizzati
| File | Ultima modifica | Esito triage |
|---|---|---|

### Insight
- [I-1] …
```

## 7. Usare gli insight nelle protopersona

- Ogni tratto supportato da un insight porta `[ricerca: <file>]` (o il codice `I-<n>`).
- Gli insight con evidenza alta prevalgono su "Personas DXS" in caso di contraddizione; quelli con evidenza bassa la integrano soltanto.
- Se gli insight indicano segmenti distinti, usali come asse di differenziazione tra le protopersona.
