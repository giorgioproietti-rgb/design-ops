# ADV Corriere – regole per pagina

Fonte: PDF RCS Pubblicità (HP set 2025; Foglia desktop gen 2020 v1.2). Leggi solo la sezione della pagina che serve. Il JSON `placements/corriere.json` è la versione eseguibile: se cambi una regola qui, cambiala anche lì.

## Comuni (tutte le pagine)

- Adserver Google Ad Manager. Posizioni asincrone, lazy load.
- I formati collassano se invenduti → in pagina prevedere tappi editoriali (Native, Strillo Bacheca o editoriale).
- Position1 1x1: fuori pagina (Intropage 1000x620 desk / 320x480 mob, Overlay 400x350). In WF solo annotation.
- Topleft desktop: Skin, Leaderboard 728x90, Pushbar 940x60, Giantpushbar 940x90, Masthead 970x250, Giant Masthead 940x530. No sticky.
- Colonna dx sticky (desk + tablet): Frame + elementi sotto scorrono in blocco fino all'elemento di blocco. Frame1 300x250 o 300x600, altri Frame 300x250.
- Condizione sticky: altezza colonna sx − colonna dx ≥ 1000 px. La sx deve essere la più alta.
- Tablet: nessun breakpoint, usa il wide. Portrait senza Topleft.
- Refresh temporizzato ADV ogni X secondi su tutto il perimetro.
- IP esteri, solo desktop: Position7 overlay ancorata in basso (728x90, 940x60, 940x90, 970x90, 620x90), X in alto a dx, chiusura solo volontaria. Position3.1/3.2 skyscraper laterali 120/160x600 solo senza Skin, fino a fine fascioni.

## HomePage desktop

- Topleft in alto, no sticky. Skin solo fino a fine 1° blocco; nei fascioni sfondo bianco.
- Colonna dx: 1° player → Ticker 300x100 → 2° player → Frame1 → 3 editoriali → Bottom3 (native) → 5 editoriali → Frame2 → 3° player 640x360v autoplay sticky (318x179, sticky 343x193) → Contenuti personalizzati (Piano) → Frame3 → FrameX ogni 5 editoriali (in view).
- Colonna sx: Bottom (native) dopo 6° modulo; Bottomleft 728x90 dopo 11°; Bottomleft X dopo 14°; Bottom2 (native) dopo 17°.
- Fascioni tematici (= `_preFooter`): ognuno con Topleft (Leaderboard/Pushbar/Giantpushbar/Masthead) sopra e Frame1 in colonna dx (300x250 o 300x600; con 300x250 un editoriale in più). Ed. Locali: Bottomleft al posto del Frame1. Ordine indicativo.
- Native strip (RCS Studio): dopo il 1° e il 7° fascione o vicino alla fascia di pertinenza.
- Preallocamento: Topleft 120, Frame1-3/X 600, Bottom 250, Bottom2 287, Bottom3 250, Bottomleft 90; Frame1 nei fascioni 250.

## HomePage mobile

- Topleft sticky on top, senza X, chiude dopo 10 s (320x50 o 320x100).
- Dopo il contenuto n°: 3 Ticker 300x100 · 6 Frame1 · 9 Box Mktg · 12 Bottom · 15 Frame2 · 18 Bottom3 · 21 Box Mktg · 24 Native strip · 27 Bottom2 · 30 Frame3 · 33 Native strip · 35 FrameX, poi ogni 5.
- Fascioni: Frame1 e Frame2 (300x250 o 300x600). Ordine fasce può differire dal desktop.
- Preallocamento: Topleft 138, Bottom/Bottom2/Bottom3 341.

## Articolo desktop (foglia)

- Topleft in alto. Pos.1 fuori pagina.
- Colonna sx: titolo, sommario, foto apertura, capoversi, firma, Taboola (feed dopo il testo).
- Bottom1 inread 640x365 tra il 2° e il 3° capoverso, altrimenti a fine articolo.
- Video player 640x360 a discrezione della redazione, almeno 1 capoverso da Bottom1, no sticky, partenza al click.
- Colonna dx a blocchi sticky, ognuno seguito da 1000 px: [editoriale, Frame1, Bottom2 native] · [editoriale/Box Mkt, Bacheca1, Frame2, Widget Native] · [editoriale/Box Mkt, Frame3, Widget Native] · FrameX + Widget Native fino a fine Taboola.
- Salute: niente Taboola.

## Gallery desktop (template WF non ancora disponibile)

- Come articolo senza Bottom1: titolo, foto, dida, contenuto, firma, Taboola. Colonna dx uguale all'articolo.

## Card desktop (template WF non ancora disponibile)

- Titolo, indice, card. Frame1, Bottom2, Bacheca1, Frame2, Widget Native. Frame NO sticky. Taboola nell'ultima card.

## Infografica desktop (template WF non ancora disponibile)

- Solo Topleft, Position1 e Taboola sotto il testo. Nessuna colonna dx.

## Lacune

- Articolo mobile: regole non fornite.
- Fascioni HP: non automatizzati, da comporre a mano nel `_preFooter`.
