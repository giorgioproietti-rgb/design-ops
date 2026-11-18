# Cover Figma

Compila i due testi della pagina `Cover` del file di design del progetto (template Template-Progetto-*): il titolo e la scheda. Il resto della Cover, il Read Me e le altre pagine non si toccano.

## Quando
Dopo `Avvia`, se `Figma WF` è un link `figma.com/design/<fileKey>`. Si rifà su richiesta ("aggiorna la Cover") quando cambiano owner, testata o link. Riscrive le righe: non rilanciarla se il designer ha ritoccato la Cover a mano, senza prima chiedere.

## Cosa scrive

| Testo | Riga | Contenuto |
|---|---|---|
| Titolo | 1 | Nome del progetto |
| | 2 | Testata o testate |
| Scheda | 1 | "UX e UI Design · [tipologia]" |
| | 2 | "[Owner], Design Owner" |
| | 3 | Link cliccabili: Planner, Ricerca (FigJam), Product Snapshot, Riferimento online. Solo quelli presenti nella sezione Link di `project.md`, con indirizzo http |

Lo stile di ogni riga (grassetto, corsivo) resta quello del template. Il ruolo è sempre "Design Owner": se serve un altro ruolo si cambia a mano.

## Procedura
1. `python3 scripts/build_cover.py <project.md>` → payload.
2. Passalo a `use_figma` sul fileKey di `Figma WF`, con `skillNames: "figma-use,figma-generate-design"`. Leggi `figma-use` una volta per sessione.
3. L'esito riporta `mutatedNodeIds` e le righe scritte. Nessuno screenshot.
4. Errore → rispetta `safeToRetryWithoutCanvasRead`. Lo script si può rilanciare: ritrova i due testi dall'etichetta salvata o dal segnaposto.
5. "Testi della Cover non trovati" → il file non segue il template: non insistere. Prova `build_cover.py <project.md> --dry` (non scrive, mostra prima e dopo), poi segnala in Aperto "Cover non compilata".
6. Nessuna voce di changelog: fa parte dell'avvio.
