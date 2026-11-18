# Read Me e nomi delle pagine (Figma)

Compila i testi guida del Read Me del file di design e sostituisce "Nome progetto" nei nomi delle pagine. È facoltativo: si fa su richiesta ("Read Me", "compila il Read Me", "rinomina le pagine"). A fine `Avvia` Design Ops lo propone con una riga.

## Cosa scrive

| Dove | Contenuto |
|---|---|
| Titolo | Nome del progetto, al posto di "Nome progetto" |
| Stakeholders di riferimento | Una riga per referente di `Contesto → Referenti` (separati da `;`, o da virgola se non ci sono `;`). Nessun referente → "Da definire" |
| Stime e deadline | "Avvio: [data]" e "Scadenza: [data]" dal frontmatter |
| Link e risorse | Link cliccabili: Planner, Riferimento online, Design esistente, Product Snapshot, Ricerca (FigJam), User flow (FigJam). Solo quelli con indirizzo http nella sezione Link |
| Nomi delle pagine | "Nome progetto" → nome del progetto in tutte le pagine che lo contengono (UX e UI). Emoji e resto del nome restano |

La prima riga di ogni testo (la guida del template) resta; sotto vanno le righe nuove. **Non si toccano** Overview ("Di cosa si tratta"), Legenda, Cover e le pagine "Categoria".

## Procedura
1. `python3 scripts/build_readme.py <project.md>`. Con `--no-rinomina` non rinomina le pagine.
2. Passa il payload a `use_figma` sul fileKey di `Figma WF`, con `skillNames: "figma-use,figma-generate-design"`. Una chiamata, senza screenshot.
3. L'esito riporta i nodi scritti e il numero di pagine rinominate.
4. Si può rilanciare: le righe scritte prima si sostituiscono e quelle in eccesso si tolgono. Le pagine già rinominate non cambiano: se il progetto cambia nome, si correggono a mano.
5. "Testi del Read Me non trovati" → il file non segue il template. Non insistere: prova `build_readme.py <project.md> --dry` (non scrive, mostra prima e dopo) e segnala in Aperto.
6. Nessuna voce di changelog.

## Attenzione
- Riscrive le righe: se il designer ha ritoccato il Read Me a mano, chiedi prima di rilanciarlo.
- Le pagine si riconoscono dal nome senza emoji né nome progetto (`references/figma-pagine.md`): la rinomina non rompe la lettura dello stato.
