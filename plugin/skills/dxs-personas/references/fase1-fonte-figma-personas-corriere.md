# Board Figma delle personas Corriere

Fonte: FigJam "Personas 2025"
Link: https://www.figma.com/board/wn3fi64SpppIkZLP5SjqWg/Personas-2025?node-id=0-1
fileKey: `wn3fi64SpppIkZLP5SjqWg` · sezione PERSONAS: node `92:1466`

## Schede note

| Persona | Segmento | node-id |
|---|---|---|
| Simone Sintetico | Abbonato | 77:1303 |
| Simone Sintetico | Prospect | 77:1368 |
| Paola Partecipe | Abbonato | 77:1433 |
| Paola Partecipe | Prospect | 77:1498 |
| Carlo Coscienzioso | Abbonato | 77:1563 |
| Carlo Coscienzioso | Prospect | 77:1627 |
| Giulia – Giovane millennial | Abbonato | 77:1754 |
| Giulia – Giovane millennial | Prospect | 77:1691 |
| Mirco – Giovane Gen Z | Prospect | 77:1818 |

Nella board la riga in alto è ABBONATI, quella in basso PROSPECT.

## Come leggerla senza sprecare risorse

1. **Non** chiamare `get_figjam` sul nodo radice `0:1`: restituisce circa 500 KB, quasi tutto materiale di ricerca non necessario.
2. Per ogni scheda serve `get_screenshot` (fileKey sopra, node-id della tabella, `maxDimension` 1500). I campi principali (nome, dati, citazione, motivazioni, bisogni, frustrazioni) **non** sono nei nomi dei layer, quindi i metadati da soli non bastano.
3. Leggi solo le schede che servono: se manca solo una variante, prendi solo quella.
4. Per scoprire schede nuove, chiama `get_figjam` sul nodo `92:1466` (circa 100 KB) e cerca i frame di primo livello chiamati `Personas template …`. Leggi poi solo i node-id non presenti in tabella e aggiorna la tabella.

## Come trascrivere in personas.md

Le 9 schede sono già trascritte in `personas.md` (estrazione del 2026-10-22). Rileggi la board solo per schede nuove o modificate.

Per ogni scheda nuova:
- un profilo `## <ID> · <Persona> – <Segmento>` nella sezione `# Corriere` (ID: `COR-<nn><A|P>`), e una riga nella tabella indice in testa al file
- **Scheda**: Dati, Citazione, Bio, Dimensioni (scala 1–5 stimata dalla barra), Abitudini di fruizione, Motivazioni, Bisogni e obiettivi, Frustrazioni, Bisogni informativi; parafrasi fedele, senza aggiungere tratti; segnala campi vuoti o duplicati
- **Personaggio critico**: costruito con `fase1-modello-personaggio-critico.md`
- Abbonato e Prospect sono profili separati e completi
- aggiorna la riga "Fonte" in testa alla sezione con la data di estrazione: è il segnale che evita di rileggere la board

## Altro materiale nella board

La board contiene anche le sezioni GIOVANI, TUTTE LE INTERVISTE – MOTIVAZIONI PER SOTTOSCRIZIONE, DIFFERENZE DI GENERE, DA CARTACEO A WEB, ALTRE FONTI, RICERCHE e ANALISI SINGOLE INTERVISTE. Non servono per le personas, ma sono una possibile fonte di insight per il passo 1.4a se la cartella delle ricerche locale non basta.
