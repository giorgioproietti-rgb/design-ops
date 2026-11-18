# Fase 1 – procedura completa

Da `SKILL.md`: si legge solo per la Fase 1. Le "Regole d'ordine" di `SKILL.md` valgono sempre.

## FASE 1 – Personas

Flusso: leggi `project.md` → cerca le personas di riferimento (file, protopersona, board) → valuta l'affinità → solo se mancano, crea protopersona (con insight di ricerca), falle validare, salvale e crea le schede su Figma → trasforma in personaggi critici → salva i file.

## 1.1 – Leggere project.md

Cerca `project.md` nella cartella di lavoro corrente e nelle sottocartelle (case-insensitive, anche `PROJECT.md`, `Project.md`). Se l'utente ne indica uno, usa quello.

- **Nessun file trovato** → chiedi il percorso.
- **Più file trovati** → elencali e chiedi quale usare. Non scegliere da solo: progetti di testate diverse portano a personas diverse.

Estrai due valori. Il formato può variare, quindi cerca la chiave in tutte queste forme:

- frontmatter YAML (`testata: Gazzetta`, `personas_dxs: ...`)
- riga in grassetto o elenco (`**Testata:** Corriere`, `- Personas DXS: ...`)
- titolo di sezione (`## Personas DXS` seguito da testo)
- riga di tabella (`| Testata | Corriere |`)

Le chiavi sono case-insensitive e possono avere varianti (`Personas DXS`, `Personas_DXS`, `personas-dxs`; `testata`, `Testata di riferimento`).

**Testata**: se manca o è ambigua, chiedi. Non assumere mai Corriere come default silenzioso.
**Personas DXS**: è la descrizione del pubblico target del progetto. Se manca, chiedi all'utente di descriverlo in una o due frasi. Controlla la regola d'ordine 3 (circolarità).

## 1.2 – Cercare le personas di riferimento

Controlla tutte le fonti A-C, in quest'ordine.

**A. File condiviso `personas.md`** (formato di riferimento). Cercalo accanto a `project.md`, poi nelle cartelle superiori fino alla radice del workspace. Il file ha in testa una tabella indice (ID, persona, segmento, personaggio critico), poi una sezione `# <Testata>` per testata e un blocco `## <ID> · <Persona> – <Segmento>` per profilo. Ogni profilo contiene la **Scheda** e il **Personaggio critico** già costruito. Per risparmiare token:
- leggi la tabella indice e, della sezione della testata, solo le **Schede** (servono per l'affinità)
- leggi il blocco **Personaggio critico** solo dei profili selezionati al passo 1.3
- ignora le altre testate

Abbonato e Prospect sono profili separati: valutali come personas distinte.

**B. Cartella della testata.** Cerca una cartella il cui nome corrisponda alla voce "testata", normalizzando: minuscole, senza accenti, spazi e trattini equivalenti, forme brevi ("Corriere della Sera" ↔ `corriere`, "La Gazzetta dello Sport" ↔ `gazzetta`). Dentro raccogli `personas.md`, i file con "persona" nel nome e quelli in `personas/`, `persona/`, `research/personas/`. Formati: `.md` e `.txt` diretti; PDF con la skill pdf; `.docx` con la skill docx. Elenca come "non analizzati" i formati che non puoi leggere.

**C. Protopersona già validate: `protopersonas.md`.** Sta accanto a `personas.md` e ha la stessa struttura (indice, sezione per testata, blocco con Scheda, Personaggio critico, progetto di origine e link alla scheda Figma). Leggilo con le stesse regole: una protopersona validata per un progetto precedente può servire anche al progetto corrente.

**D. Segmenti del progetto (Blender).** Se esiste `01_Blender/personas-journey.md`, leggi solo le sezioni `### PER-` / `### SEG-` (salta `[sostituito]` e `[scartato]`). Servono come descrizione dei bisogni del progetto, per l'affinità (se Personas DXS è circolare) e per costruire eventuali protopersona. **Non** contano come personas di riferimento (regola d'ordine 2) e **non** fanno saltare i passi 1.2b e 1.4.

## 1.2b – Board Figma della testata (obbligatoria se A-C non bastano)

Usala quando A-C non danno almeno 2 personas affini, salvo che la sezione della testata in `personas.md` riporti già la board come fonte con una data di estrazione (in quel caso è già stata letta: passa a 1.4).

Per Corriere procedura, link e node-id delle schede sono in `references/fase1-fonte-figma-personas-corriere.md`. Per altre testate chiedi il link della board, una volta. In sintesi: leggi le schede con lo screenshot dei singoli nodi (mai l'intera board, che è molto pesante), sempre con immagine incorporata nella risposta; trascrivile nella sezione della testata di `personas.md` (Scheda + Personaggio critico) con fonte e data; poi rifai il passo 1.3. Così le volte successive basta leggere il file locale.

## 1.3 – Valutare l'affinità

Scomponi la descrizione "Personas DXS" (o, se circolare, i segmenti e bisogni del progetto) in attributi confrontabili. Usa solo quelli effettivamente presenti:

| Attributo | Esempi |
|---|---|
| Segmento / rapporto con la testata | abbonato, lettore occasionale, utente social, tifoso |
| Età / fase di vita | studente, pendolare, pensionato |
| Contesto e device | mobile in metro, desktop in ufficio, app, newsletter |
| Obiettivo principale | aggiornarsi in fretta, approfondire, seguire una squadra |
| Familiarità digitale | alta, media, bassa |
| Interessi / sezioni | sport, economia, cronaca locale, nutrizione |

Per ogni persona assegna a ciascun attributo: **corrisponde** (2), **parziale** (1), **non corrisponde o non dichiarato** (0). L'affinità è la percentuale sul massimo possibile.

- **≥ 60%** → affine, utilizzabile
- **40–59%** → parzialmente affine: utilizzabile solo se non ci sono personas affini, e va segnalato
- **< 40%** → non affine

Seleziona al massimo 3 personas, in ordine di affinità. Mostra sempre la tabella di valutazione con una riga di motivazione e la fonte di ogni profilo (persona di riferimento / protopersona con progetto di origine): l'utente deve poter dissentire. A parità di affinità **preferisci sempre la persona reale**.

Se le personas affini sono **meno di 2** dopo A-C e 1.2b, completa con protopersona fino ad arrivare almeno a 2 (passo 1.4).

## 1.4 – Creare protopersona (solo dopo aver cercato)

Crea almeno 2 protopersona (o quante ne servono per arrivare a 2 personas utilizzabili). Prima di scriverle, cerca gli insight di ricerca.

### 1.4a – Estrarre gli insight di ricerca

Segui la procedura in `references/fase1-estrazione-insight-ricerca.md`. In sintesi:
1. Cartelle: `Ricerca/<Testata>/` collegata al Project, `00_Input/ricerca/` e `01_Blender/insight.md` del progetto, senza chiedere. Altrimenti cerca (`ricerche/`, `ricerca/`, `research/`, `paper/`, `studi/`, `insight/`) e, se ambiguo, chiedi.
2. Brief di analisi: `project.md` (obiettivo, "Personas DXS", testata).
3. Riusa `insight-ricerca.md` della testata se copre già i file; analizza solo i file nuovi o modificati.
4. Leggi in modo mirato i documenti pertinenti; insight brevi con fonte e livello di evidenza.
5. Aggiorna `insight-ricerca.md` (solo aggiunte).

### 1.4b – Costruire le protopersona

- **Insight trovati** → base: segmenti di `personas-journey.md` e "Personas DXS"; gli insight la precisano. Dove un insight contraddice la descrizione prevale l'insight, segnalato all'utente.
- **Nessun insight pertinente** → solo segmenti e contesto della testata, dichiarato.

Rendile diverse tra loro su almeno un asse rilevante (familiarità digitale, device, motivazione). Non duplicare personas o protopersona esistenti; se una è quasi affine, valuta una variante.

Template `references/fase1-modello-protopersona.md`, ogni campo con origine (`[ricerca: <file>]`, `[brief]`, `[assunzione]`), marcate `PROTOPERSONA – da validare`.

### 1.4c – Validazione dell'utente (obbligatoria)

Non salvare nulla prima della validazione.
1. **Mostra le protopersona in chat**, complete secondo il template, precedute da una riga sull'asse di differenziazione e una sulle fonti.
2. **Chiedi quali usare** con una domanda a scelta multipla, più la possibilità di chiedere modifiche. Modifiche → ripresenta solo quelle modificate.
3. Prosegui **solo con quelle scelte esplicitamente**. Meno di 2 → segnalalo.

### 1.4d – Salvataggio e scheda Figma (entrambi obbligatori)

**1. Salva in `protopersonas.md`**, mai in `personas.md`.
- posizione: stessa cartella di `personas.md`; se non c'è, cartella della testata
- se il file non esiste, crealo: titolo `# Protopersona DXS`, tabella indice (ID, nome, testata, progetto di origine, data di validazione, personaggio critico, link Figma), sezioni `# Corriere`, `# Gazzetta`, `# Altre testate`
- aggiungi in fondo alla sezione della testata e una riga nell'indice; non modificare righe esistenti
- annota progetto di origine, descrizione "Personas DXS", fonti di ricerca (o "nessuna"), data di validazione

**2. Crea le schede su Figma** nella pagina Personas del FigJam del progetto (voce `FigJam` di `project.md`; assente → chiedila una volta): un frame col nome del progetto e una scheda per protopersona, senza foto. Segui `references/fase1-creazione-schede-figma-protopersona.md` e lo script `scripts/crea-schede-protopersona-figma.js`, senza riscriverlo. Aggiungi il link della scheda in `protopersonas.md` e comunicalo.

**3.** Scheda Figma non creata → la Fase 1 non è chiusa: fermati, dillo e chiedi come procedere.

Le schede Figma si creano solo per le protopersona, mai per le personas esistenti.

## 1.5 – Trasformare in personaggi critici

**Riuso prima di tutto.** Se il profilo selezionato ha già il blocco "Personaggio critico", **usalo così com'è**. Adatta solo le due journey se non pertinenti e annota l'adattamento al passo 1.6.

Costruisci un nuovo personaggio critico (template `references/fase1-modello-personaggio-critico.md`) solo per i profili che non lo hanno; se il profilo sta in `personas.md` o `protopersonas.md`, aggiungilo in fondo al profilo. Per le nuove protopersona fallo subito dopo il passo 1.4d.

Principi di trasformazione:
- **Amplifica, non inventa.** Spingi i tratti al caso peggiore plausibile senza contraddire la fonte.
- **Traccia l'origine.** `[fonte]` o `[amplificato]` per ogni tratto.
- **Due journey** concrete e verificabili: A sul compito più frequente, B su un ingresso o obiettivo che mette sotto pressione il design. Se `insight.md` del progetto segnala problemi utente (errori, abbandoni), almeno una journey li attraversa.
- **Un termine di paragone** (via di fuga) e **una voce** (3–5 frasi, dure ma credibili, mai stereotipi offensivi).

Se il personaggio sembra non avere motivi di lamentarsi, è troppo indulgente.

## 1.6 – Salvare il file dei personaggi

Salva in `<cartella testata>/personaggi-del-progetto.md`:
- se non esiste, crealo con titolo `# Personaggi critici – <Testata>`
- se esiste, **non sovrascrivere nulla**: aggiungi in fondo `## <nome progetto> – <data>`
- in testa alla sezione: `project.md` di riferimento e fonte delle personas (riferimento / protopersona con link Figma)
- per i personaggi già in `personas.md` o `protopersonas.md` scrivi **solo il riferimento**: ID, affinità, journey adattate
- per i personaggi da altre fonti scrivi il blocco completo
- in ogni sezione di progetto scrivi `### Corrispondenza segmenti ↔ personaggi`: una riga per ogni segmento attivo di `01_Blender/personas-journey.md` (`### PER-` o `### SEG-`, esclusi `[sostituito]` e `[scartato]`).

  | Segmento | Personaggio di riferimento | Affinità | Personaggio critico | Esito |
  |---|---|---|---|---|
  | SEG-01 | `COR-P03` | 78% | <nome del personaggio critico> | coperto |

  Più personaggi per un segmento → separati da virgola. Nessun personaggio selezionato → `—` ed esito `lacuna`. L'affinità viene dalla tabella del passo 1.3: non inventare corrispondenze.

Chiudi la Fase 1 ricordando che il test si lancia con `--testDesign`.

