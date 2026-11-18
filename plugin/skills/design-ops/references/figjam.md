# Pubblicazione su FigJam (output di ricerca)

Gli output di ricerca vivono in un FigJam dedicato al progetto, separato dal file di design: il file di design resta leggero e le modifiche alla ricerca (imprevisti, dati nuovi) non lo toccano.

Template: https://www.figma.com/board/UJQiuUZFuSDpnFO0RttACW/Template-Progetto-UX · pagine: Cover, User-Flow, Personas, Benchmark (più una pagina separatore). Il designer lo duplica e dà il link con `Avvia` (voce `FigJam` di `project.md`).

## Principi
- I file `.md` restano la fonte di verità: le skill leggono da lì. Il FigJam è la vista visuale e collaborativa.
- Nessuna sincronizzazione di ritorno. Una decisione presa nel FigJam entra con `Annota`, o con `Aggiorna` se cambia il perimetro.
- Si scrive solo in frame `[auto]`. I contenuti aggiunti a mano non si toccano. Mai cancellare.

## Mappa pagine

| Pagina | Fonte | Quando |
|---|---|---|
| Cover | `project.md`: progetto, testata, owner, scadenza, versione | prima pubblicazione |
| Benchmark | `01_Blender/benchmark.md` | dopo HC1 |
| User-Flow | journey di `01_Blender/personas-journey.md` | dopo HC1 |
| Personas | personas `PER-` di `personas-journey.md`; le schede delle protopersona le crea `dxs-personas` | dopo HC1; schede a fine step 2 |

Non creare pagine che il template non ha. Non toccare la pagina separatore.

## Layout (lo-fi)
- Ogni pubblicazione è un frame `[auto] <Pagina> · v<versione>`, con titolo e data.
- **Benchmark:** una card per competitor (nome, soluzione, fonte `BEN-NN`), sotto i pattern `BEN-P-NN` con l'implicazione per noi. Max 12 card per frame.
- **User-Flow:** un frame per journey. Step come nodi in fila collegati da connettori, sotto ogni nodo gli ID dei requisiti. Gli step senza requisito sono marcati.
- **Personas:** una card per `PER-NN`: nome, segmento, contesto d'uso, obiettivo, frustrazioni, fonte (`RIC-`). Nessuna foto.
- **Cover:** nome, testata, owner, scadenza, versione, link al file Figma di design.
- Testi brevi (max 80 caratteri per riga). Gli ID restano visibili: sono il contratto con le skill. Grigi lo-fi; il colore solo per lo stato (nuovo, da validare).

## Procedura
1. Prerequisito: `FigJam` in `project.md` nel formato `figma.com/board/<fileKey>/…`. Mancante → non pubblicare, voce in Aperto ("Duplicare il template FigJam") e prosegui.
2. Leggi `figma:figma-use` e `figma:figma-use-figjam` (una volta per sessione) e passa `skillNames: "figma-use,figma-use-figjam"` a `use_figma`.
3. Per ogni pagina: aprila **per nome** (gli id possono cambiare con la copia) e leggi con `get_figjam` solo i nomi dei frame presenti.
4. Crea il frame `[auto]` a destra dei contenuti esistenti. Una `use_figma` per pagina, max 15 elementi a chiamata, in sequenza.
5. Verifica con un solo `get_screenshot` (maxDimension 1024) per pagina. Correggi solo se illeggibile.
6. Scrivi in `project.md` il link alla pagina (voce `FigJam`).
7. Errore di `use_figma` con `safeToRetryWithoutCanvasRead: false` → controlla la pagina con `get_figjam` prima di riprovare, per non creare frame doppi.

## Aggiornamenti
- `Aggiorna` o una revisione che cambia un output → ripubblica solo quella pagina. Nuovo frame `[auto] <Pagina> · v<nuova>` accanto al vecchio; il vecchio si rinomina `[sostituito] <Pagina> · v<vecchia>` e non si cancella.
- Contenuti fuori dai frame `[auto]`: non toccarli. Quelli dentro un frame `[auto]` restano nel frame sostituito.
- Le modifiche fatte nel FigJam non vengono rilette: per tenerne conto usa `Annota` o `Aggiorna`.

## Se fallisce
La pubblicazione non blocca il flusso. Registra "Pubblicazione FigJam da rifare: <pagina>" in Aperto.

Nota: per ora le pagine si disegnano con `use_figma` seguendo questo layout. Script deterministici per Benchmark e User-Flow sono da costruire dopo la prima prova.
