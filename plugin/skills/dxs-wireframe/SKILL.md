---
name: "dxs-wireframe"
description: Step 3 del processo UX (architettura e wireframe). Trasforma journey, requisiti, personas e principi nell'elenco delle pagine con varianti per persona e stato, poi disegna i wireframe nella pagina Wireframe del file Figma con i template della Wireframe library (ADV solo con --ADV). Per i progetti nuovi propone prima l'architettura informativa (feature per priorità e importanza, aree). Modalità creazione, revisione (dal report di validazione) e aggiornamento. Usa SEMPRE questa skill per Wireframe, Crea WF, Disegna Flussi, Architettura, o per rifare o correggere wireframe e schermate. Di norma la lancia design-ops.
---

# DXS Wireframe – dai journey ai wireframe su Figma

Unica skill del flusso che **scrive** su Figma. Scrive solo nella pagina `Wireframe` del file di progetto, mai altrove.

**Principio guida:** si disegna per risolvere i problemi e i bisogni degli utenti documentati dalla ricerca (`RIC-`), non solo per eseguire il brief. Ogni pagina deve dire quale problema utente affronta.

## Stile (file e risposte)

Come magic-blender: risposta prima, bullet, max 20 parole, mai togliere ID/numeri/path. Tra tool call silenzio, max una riga per fase. Risposte in chat max 15 righe. Le Regole mandatorie di design-ops valgono anche qui (token, sessione per step, ok esplicito).

## Mappa file

- Legge: `project.md` (testata, tipologia, link Figma, Device), `01_Blender/personas-journey.md`, `01_Blender/principi.md`, `01_Blender/Blender.md`, `01_Blender/insight.md` (bisogni per journey e legenda), `01_Blender/benchmark.md` (solo legenda), `<cartella testata>/personaggi-del-progetto.md` (solo sezione del progetto), `vincoli.md` (radice del progetto: solo righe `aperto` o `recepito` con gravità `blocca` o `limita`).
- Scrive: `03_Wireframe/pagine.md`, `03_Wireframe/architettura.md`, frame su Figma.
- Usa: libreria `DXS Corriere – Wireframe library` (fileKey `VWSR4VWyhOv4nGIx59scGv`, chiavi in `references/wf-library.json`). `dxs-adv-placement/placements/<testata>.json`. La vecchia `WF_library` è archiviata: non usarla.
- Mai: `project.md` (lo scrive Design Ops), gate "Wireframe validato" (dopo `dxs-personas --testDesign` + decisione del designer).
- Dopo il gate "Wireframe validato": step 5 `dxs-handoff` (documentale). Aggiunge annotation `Tap` sugli elementi dei frame: mai rimuoverle.

## Comandi

- `Wireframe` · `Disegna Flussi` · `Crea WF`: wireframe **senza ADV** (default). Colonna dx e preFooter restano quelli neutri del template.
- `Architettura` · `Architettura informativa` · `Crea Architettura`: solo architettura informativa (`references/architettura.md`), poi fermati. Non chiamarla "IA": in italiano è l'intelligenza artificiale.
- Stesso comando + `--ADV` (es. `Crea WF --ADV`): aggiunge gli ADV della testata da dxs-adv-placement.
- `--ADV` vale solo con un comando wireframe. Da solo → una riga: va usato con un comando wireframe, chiedi se lanciarlo.
- Revisione e aggiornamento ereditano la riga `ADV` di `pagine.md`, salvo nuovo `--ADV` o richiesta di toglierli.

## Modalità

- Nessun `03_Wireframe/pagine.md` → **creazione** (passi 0-6).
- Report nuovo in `04_Validazione/` o richiesta di correggere i WF → **revisione**.
- Cambio requisiti segnalato da Blender o da Design Ops → **aggiornamento**.
- Revisione e aggiornamento: leggi `references/revisione-aggiornamento.md`, poi passi 4-6.
- Dubbio → una domanda.

## 0 – Architettura informativa (a richiesta o suggerita)

- Comando `Architettura` → esegui solo `references/architettura.md`.
- Comando wireframe, nessun `architettura.md`, progetto nuovo (`tipologia` "Nuovo prodotto" in `project.md`, o senza prodotto esistente) → una riga di suggerimento come da `references/architettura.md`, poi attendi la risposta. "No" → `Architettura: saltata` in `pagine.md`, vai al passo 1.
- `architettura.md` esiste (approvato) → l'elenco pagine del passo 3 parte dalle sue aree; feature P3 escluse salvo richiesta.

## 1 – Contesto (lettura minima)

- `project.md`: testata, link Figma del progetto (fileKey), `Device`, fase. Manca il link Figma → chiedi e fermati.
- Lanciata da Design Ops con gate Personas non spuntato → fermati. Da sola → prosegui, avviso in una riga.
- `personas-journey.md`: leggi personas o segmenti (`### PER-`, `### SEG-` o ID di personas di riferimento), "Journey da progettare", journey con requisiti. Salta `[sostituito]` e `[scartato]`; `[suggerito]` solo come proposta nel gate. I requisiti con fonte `RIC-` sono obbligatori quanto quelli del brief.
- `insight.md`: solo la sezione "Bisogni per journey" (o, se manca, le righe `RIC-` citate dai requisiti).
- `principi.md`: solo le righe `PRIN-`. `Blender.md`: solo contesto e vincoli.
- `personaggi-del-progetto.md`: solo i personaggi del progetto, per stati e casi limite che il test stresserà (errori, abbandono), e la tabella "Corrispondenza segmenti ↔ personaggi" della sezione del progetto. Per ogni segmento dei journey dà il personaggio di riferimento e quello critico da usare per le pagine di quel segmento. Segmento in lacuna o senza riga → segnalalo nel gate pagine, non inventare il personaggio.
- `vincoli.md` (se esiste): solo righe `aperto` o `recepito` con gravità `blocca` o `limita`. Applicali come scelte di layout. Un vincolo `blocca` collegato a una pagina o feature → non disegnarla come richiesto: segnalalo nel gate pagine con il `VIN-`. Mai modificare `vincoli.md` (lo scrive Design Ops).
- File grandi → `grep`/`sed` sulle sezioni, mai lettura intera.

## 2 – Device (controllo per non sprecare frame)

- `project.md` "Device" decide: `mobile` → m · `desktop` → d · `mobile, desktop` o `web` → m, d · `app` → solo m.
- Manca → cerca in `Blender.md` (vincoli, contesto d'uso) e nei requisiti. Ancora incerto → default m, d, segnalato nel gate.
- Per pagina: device di progetto ∩ device citati dai requisiti (es. "solo app", "solo desktop").
- Desktop con stessa struttura → stessa specifica, lo script affianca le `row`. Mai descrivere due volte.

## 3 – GATE-SKILL (stop obbligatorio)

Proponi l'elenco, niente JSON, niente Figma. Scrivi solo:

```
**Pagine** – [n] pagine · [n] varianti · [n] frame (m [n], d [n])
**Elenco** – WF-01 Nome · template · problema utente: RIC-.. · varianti: base, stato (motivo ID) · device
**Bisogni scoperti** – RIC- senza pagina che li risolve, con motivo
**Non coperti** – ID e motivo (fuori perimetro / manca info)
**Suggeriti** – SUG- proposti come pagina o variante, max 3
**Architettura** – [n] feature, P1 [n] (architettura.md) | non fatta  (solo se il file esiste)
**Device** – [valore] (fonte: project.md | Blender.md | default)
**Vincoli** – [n] attivi · applicati: VIN-.. su WF-.. · bloccanti: VIN-.. (serve decisione)  (solo se `vincoli.md` esiste)
**ADV** – no (default) | sì, testata [nome] · regole mancanti: [template]
**Serve** – ok esplicito / correzioni
```

Regole elenco:
- Una pagina per step di journey; step senza UI → fuori perimetro con motivo.
- Ogni pagina dichiara il problema o bisogno utente che affronta (`RIC-`). Un `RIC-` con requisito confermato senza pagina è un buco da segnalare, non un'opzione.
- Variante solo se cambia cosa vede l'utente (visibilità per persona, stato, errore, vuoto, piattaforma). Altrimenti un frame.
- Includi journey impliciti già in Blender: rifiuto, abbandono, errore, utente già registrato.
- Approvazione solo con ok esplicito ("ok", "sì", "approvo", "confermo"); altre risposte → "Confermi con ok?".

Correzioni → ripresenta solo le differenze. Nessun frame prima dell'ok.

## 4 – Specifica → `pagine.md`

1. Leggi `references/spec.md` (template, blocchi, varianti come patch, opzioni ADV).
2. **Template** di `WF/Page` (chiavi in `references/wf-library.json`). Proprietà: `Device` × `Header` (Homepage, Sezione) × `Colonne` (1, 2 solo desktop), slot `Contenuto`, `Aside`, `PreFooter`. Nella specifica si indica il tipo di pagina:
   - `HomePage` – solo homepage → Header Homepage, 2 colonne su desktop
   - `Articolo` – solo pagine articolo / foglia → Header Sezione, 2 colonne su desktop
   - `Default` – pagina base per tutto il resto: funnel, wall, checkout, registrazione, conferme, area personale, servizi → Header Sezione, 1 colonna. Se non indicato, lo script usa `Default`.
   - `"aside": false` su HomePage/Articolo → variante a 1 colonna; `"aside": [blocchi]` su Default → variante a 2 colonne.
   Il template non contiene ADV né contenuti: tutto arriva dal payload. Dettagli specifici (aside, preFooter) si chiariscono nel prompt della richiesta: se servono e non ci sono, chiedi una volta.
3. ADV solo con `--ADV`: non scriverli a mano, li inserisce `build_payload.py` dal JSON della testata. A mano solo i casi del `.md` di dxs-adv-placement con il blocco `adv`. Senza `--ADV` nessun blocco ADV.
4. Scrivi tutti i blocchi `wf` in un passaggio. Applica i `PRIN-` come scelte di layout, non come testo.
5. Sopra ogni blocco `wf` aggiungi le righe `- Problema utente: RIC-.. (deduzione breve)` e `- Principi: PRIN-.. (motivo breve)`: servono alle annotation e alla legenda del passo 5b.
6. Per ogni variante aggiungi nel JSON `"nota"`: una frase su cosa cambia rispetto alla base.
7. Testi reali brevi: `label` e `check` non vanno a capo, quindi max ~40 caratteri su mobile; frasi più lunghe → due `label` o un `banner`.
8. Pattern di piattaforma (es. un solo wallet per sistema operativo): base generica + variante per piattaforma, solo se cambia ciò che l'utente vede.
9. `python3 scripts/check_coverage.py 01_Blender/personas-journey.md 03_Wireframe/pagine.md`
   - ERRORE / NON COPERTI → correggi `pagine.md` e rilancia. Non serve chiedere.
   - AVVISO → riporta in HC2.

## 5 – Render su Figma

1. Leggi `skill figma-use` una volta per sessione, se disponibile. Libreria `DXS Corriere – Wireframe library` non attiva nel file di progetto → chiedi di attivarla e fermati. Se è attiva la vecchia `WF_library`, chiedi di fare Swap library verso la nuova prima del render.
2. **Contenitori esistenti** (`WF · Mobile` / `WF · Desktop`): `scripts/render-wf.js` v2 sostituisce i frame anche dentro i contenitori, non serve spostarli. Se lo script non contiene il commento "v2: upsert anche sui frame annidati", prima del render sposta i frame al primo livello della pagina (carica prima i font, vedi 5b).
3. `python3 scripts/build_payload.py 03_Wireframe/pagine.md [WF-..|WF-..:variante] [--device m|d]` → payload pronti, max 4 frame ciascuno. Con `--ADV` aggiungi `--adv <dxs-adv-placement>/placements/<testata>.json`. `--force` rigenera anche i frame ritoccati a mano: solo con ok esplicito.
4. Ogni payload → una `use_figma` sul fileKey del progetto, **in sequenza**. Non modificare il payload: se va cambiato, cambia `pagine.md`. Se un payload fallisce, rilancia solo quello.
5. Lo script (v3): istanzia la variante `WF/Page` (device × tipo di pagina × colonne), stacca, svuota i fondi degli slot, riempie `Contenuto`, `Aside` (solo desktop a 2 colonne) e `PreFooter`, rimuove `PreFooter` se non ha blocchi, aggiunge Topleft in `_Top`. Header e footer restano istanze della Wireframe library: all'handoff lo Swap library verso la Components library li converte. Template senza slot `Contenuto` → avviso "frame lasciato vuoto": fermati e chiedi di aggiungere lo slot nella libreria.
6. Primo payload della sessione → `get_screenshot` di un solo frame, con immagine incorporata nella risposta (il download da URL non funziona). Gli altri no.
7. `warnings` (slot mancanti, ADV non posizionabili, sticky sx − dx < 1000 px solo con `--ADV`, slot troppo stretti): correggi la specifica se dipende dal layout, altrimenti riporta in HC2. Max 2 tentativi automatici per pagina, poi decisione umana.
8. Stile: quello dei template (grigi, raggio 8, componenti `WF/Text block` e `WF/Block`). Testo reale solo in titoli, label, bottoni.
9. `protected` nell'esito: frame ritoccati a mano in Figma, non rigenerati. Riportali in HC2 e imposta `Manuale: sì` sulla loro pagina in `pagine.md`.

## 5b – Impaginazione, note e legenda (sempre, dopo il render)

Una sola `use_figma`, dopo l'ultimo payload. I frame del template contengono font DXS (Brera, Solferino…): prima di spostarli carica tutti i font dei TEXT della pagina con `getRangeAllFontNames`, altrimenti `appendChild` fallisce.

1. **Contenitore per device.** Un frame auto-layout orizzontale per device: `WF · Mobile` e/o `WF · Desktop`. `itemSpacing` ≥ 40 (default 60), padding 40, `counterAxisAlignItems` MIN, nessun fill. Frame in ordine di flusso: WF-01 → WF-n, varianti subito dopo la base. Contenitori impilati in verticale (mobile sopra), gap 200.
2. **Annotation parlata** su ogni frame (`annotations = [{labelMarkdown}]`, fallback `label` senza `**`). Mai sigle senza testo.
   - **Frame base:**
     - `**WF-xx · Pagina · base**` + una frase su cosa mostra la schermata
     - `**Problema utente**`: `- RIC-xx: deduzione` (da `insight.md`)
     - `**Requisiti**`: `- ID: testo del requisito` (da `personas-journey.md`, senza fonte)
     - `**Principi applicati**`: `- PRIN-xx: testo` (sezione omessa se vuota)
     - `**Vincoli**`: `- VIN-xx: testo` (sezione omessa se vuota)
     - `**Per chi**`: `- ID persona: nome`
     - `**Porta a:**` WF successive
   - **Frame variante (solo differenze):**
     - `**WF-xx · Pagina · variante**` + la `nota` della variante (cosa cambia rispetto alla base)
     - `**Requisiti in più**`: solo gli ID aggiunti dalla variante, con testo
     - riga: "Tutto il resto come nel frame base WF-xx."
   - Riga finale per tutti: "Legenda completa degli ID nel frame 'Legenda · ID' a destra."
3. **Frame `Legenda · ID`** a destra dei contenitori (x = fine contenitore + 120). Tabella auto-layout: titolo, sottotitolo con le fonti, riga di intestazione grigia, righe alternate. Colonne: Tipo (170) · ID (130, bold) · Descrizione (700, testo a capo) · Dove (130, pagine WF). Righe, in quest'ordine:
   - Problema utente: `RIC-` dichiarati dalle pagine, con deduzione
   - Requisito: tutti gli ID coperti dai frame
   - Fuori perimetro: ID e motivo da `pagine.md`
   - Principio: tutti i `PRIN-` con le evidenze tra parentesi
   - Persona: ID usati
   - Osservazione benchmark (`BEN-`), Pattern benchmark (`BEN-P-`), altre evidenze `RIC-` citate dai principi: Dove = "via PRIN"
   Se esiste già, sostituiscila.
4. Uno screenshot della sola legenda come controllo, con immagine incorporata. Registra in `pagine.md` una sezione "Impaginazione e note" con data, gap usato e numero di righe della legenda.

## 6 – HC2 (chiusura)

Aggiorna in `pagine.md` versione, data e `Figma WF` (`https://www.figma.com/design/<fileKey>/?node-id=<pageId con - >`). Poi scrivi solo:

```
**HC2 – Wireframe pronti per la valutazione**
**Figma WF** – [link]  (per Design Ops → project.md)
**Architettura** – architettura.md · [n] feature · Figma [link]  (solo se fatta)
**Frame** – [n] creati · [n] sostituiti · m [n] · d [n] · contenitori: [nomi] · legenda: [n] righe
**Copertura** – [n]/[n] requisiti · bisogni utente coperti [n]/[n] · fuori perimetro: ID
**Avvisi** – slot mancanti, ADV non posizionabili, sticky, regole ADV mancanti, conflitti
**Vincoli recepiti** – VIN-..  (Design Ops li imposta a `recepito`)  (solo se ce ne sono)
**Handoff** – solo in revisione dopo l'handoff: [n] frame rigenerati → rilanciare `Handoff --note`
**Prossimo** – dxs-personas --testDesign [link]
```

Max 12 righe. Il dettaglio sta in `pagine.md`.

## Regole

- Mai toccare frame fuori dalla pagina `Wireframe` né frame non generati dalla skill.
- Mai eliminare frame senza ok esplicito.
- Ogni pagina dichiara il problema utente che risolve (`RIC-`); i requisiti da ricerca non sono opzionali.
- Ogni frame porta l'area del requisito nel nome e gli ID, con il loro testo, in annotation (le varianti solo le differenze): è il contratto con Blender per la verifica di coerenza.
- Frame sempre raggruppati per device in auto-layout orizzontale con gap ≥ 40 px, e sempre accompagnati dal frame `Legenda · ID`.
- Template: `HomePage` e `Articolo` solo per quei tipi di pagina, `Default` per tutto il resto.
- Regole ADV solo da dxs-adv-placement: mai inventare posizioni o formati.
- Requisiti nuovi o diversi nati qui → input per `magic-blender`, non decisioni della skill.
- Revisioni automatiche max 2 per pagina, poi decisione umana per quella pagina. Un frame modificato a mano non si rigenera senza ok esplicito.
