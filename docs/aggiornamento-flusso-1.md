# Aggiornamento flusso 1 e template SharePoint — guida passo per passo

Per i flussi **"UX - Creazione progetto"** e **"UX - Sincronizza manifest su Planner"**. Segui l'ordine: ogni passo ha un controllo (✔) da superare prima di andare avanti.

Le interfacce di SharePoint e Power Automate cambiano: i nomi dei comandi qui sotto sono quelli italiani più comuni. Se un'etichetta è diversa, cerca la voce simile.

---

## 0. Prima di iniziare

### 0.1 Metti al sicuro il lavoro esistente
1. Apri il flusso 1 → **Salva con nome** → "UX - Creazione progetto (v2)". **Lavora sulla copia.**
2. Apri la v1 → **Esporta** → Pacchetto (.zip). Conserva il file: è il ritorno indietro.
3. Fai lo stesso per il flusso 2 ("UX - Sincronizza manifest su Planner (v2)").
4. **Disattiva v1 e v2 di entrambi i flussi** mentre lavori. Riattiverai solo la v2 al collaudo. Se v1 e v2 restano attivi insieme, ogni card crea due cartelle.

### 0.2 Raccogli questi valori (compila la tabella prima di toccare i flussi)

| Valore | Dove si trova | Il tuo valore |
|---|---|---|
| `<SITO>` | `https://rcsmediagroup.sharepoint.com/sites/UXUITeam121` | |
| `<LIB>` | Apri la libreria dei progetti nel browser: nell'indirizzo, la parola dopo `/sites/UXUITeam121/`. Spazi come spazi, non `%20`. Es. `Shared Documents` | |
| `<ROOT>` | Cartella dei progetti dentro la libreria. Es. `Progetti UX` | |
| `<PREFISSO>` | `/<LIB>/<ROOT>` | |
| `<LIBRERIE>` | Cartella con `personas.md` e `protopersonas.md` di ogni testata. Consiglio `<PREFISSO>/_Librerie/<Testata>/` | |
| ID bucket intake ("Nuovi progetti UX") | Vedi sotto | |
| ID bucket Benchmark (posizione iniziale della card) | Vedi sotto | |
| Etichette testata (slot) | Vedi sotto | |
| `<DOMINIO_TENANT>` | Copia il link di una card (Planner → ⋯ → Copia link) e leggi il dominio | |

**ID dei bucket.** Crea una card di prova in ogni bucket (o spostala), apri la v1 → Cronologia esecuzioni → output del trigger → `bucketId`. Annota la coppia nome bucket / ID.

**Slot delle etichette.** Su una card di prova metti le etichette Corriere e Gazzetta, poi nell'esecuzione apri l'output di "Ottieni un'attività" → `appliedCategories`: vedi `category1`, `category2`… Annota quale slot è quale testata. Nelle espressioni sotto ho usato `category1` = Corriere e `category2` = Gazzetta: **sostituiscili se i tuoi slot sono diversi.**

### 0.3 Regole che evitano il 90% degli errori
- **Rinomina ogni azione subito dopo averla creata** (⋯ → Rinomina), **prima** di scrivere espressioni che la citano. Se rinomini dopo, Power Automate aggiorna i contenuti dinamici ma **non le espressioni scritte a mano**: si rompono.
- Nomi senza spazi e con le maiuscole indicate (`GetTask`, `PercorsoCartella`…).
- Le espressioni vanno nella scheda **Espressione** (icona fx), non incollate come testo. Se nel campo vedi il testo `replace(...` scritto per intero, è sbagliato: deve comparire come etichetta colorata.
- Salva e usa **Controllo flusso** (Flow checker) a ogni blocco concluso.

---

## 1. SharePoint

**1.1 Cartella radice.** Nella libreria esiste `<ROOT>` con dentro `Corriere`, `Gazzetta`, `Da definire` e **`Multi-testata`** (nuova, crea ora). ✔ Le quattro cartelle ci sono, scritte esattamente così.

**1.2 Librerie di testata.** Crea `<ROOT>/_Librerie/Corriere/` e `<ROOT>/_Librerie/Gazzetta/` e mettici `personas.md` e `protopersonas.md` (se una testata non li ha, lascia la cartella vuota: il flusso non si ferma). ✔ Nel browser i percorsi coincidono con `<LIBRERIE>` della tabella.

**1.3 Template.** Crea `<ROOT>/_TEMPLATE_Progetto/`.
1. Estrai `template-progetto.zip` sul computer.
2. Carica i cinque file con questi nomi esatti: `project.md`, `CHANGELOG.md`, `storico.md`, `vincoli.md` e, dentro `00_Input/`, `_AVVIO.md`.
3. Crea a mano queste cartelle vuote: `00_Input/ricerca`, `00_Input/libreria`, `01_Blender`, `02_Personas`, `03_Wireframe`, `04_Validazione`, `05_Handoff`.
4. Elimina dal template qualunque file vecchio (`manifest.md`, `_lock.md`).
✔ Apri `project.md` nel browser: contiene `{{PROGETTO}}` e `fase: avvio`. L'albero corrisponde a:
```
_TEMPLATE_Progetto/
  project.md · CHANGELOG.md · storico.md · vincoli.md
  00_Input/ (_AVVIO.md · ricerca/ · libreria/)
  01_Blender/ · 02_Personas/ · 03_Wireframe/ · 04_Validazione/ · 05_Handoff/
```

**1.4 Prova della copia a mano.** Sul template: ⋯ → **Copia in** → `<ROOT>/Da definire` → rinomina in `PROVA_copia`. ✔ La copia contiene tutte le cartelle e i quattro file. Poi eliminala.

**1.5 Permessi del template.** Imposta il template in sola lettura per tutti tranne i proprietari del sito. ✔ Un collega non può modificarlo per errore.

**1.6 Account del flusso.** L'account che esegue il flusso (meglio un account di servizio) deve avere **modifica** su `<ROOT>`. Aggiungi almeno un co-proprietario ai flussi. ✔ Dal menu del flusso → Condividi.

---

## 2. Flusso 1 — "UX - Creazione progetto (v2)"

### 2.1 Struttura finale (in quest'ordine)

```
Trigger Planner (concorrenza 1)
Condizione: bucket = intake
└ Sì:
  Ambito "Esecuzione"
    GetTask
    TestateArray → TestateFiltrate → Testate → Testata
    Tipologia · Priorita · Avvio · Scadenza
    TitoloPulito → NomeCartella
    GetOwner → Owner
    PlannerLink
    PercorsoCartella · PercorsoRelativo
    CopiaCartella
    FileDaCompilare → [Ciclo CompilaFile]
    [Ciclo LibrerieTestata]
    LinkCartella
    Aggiorna dettagli attività
    Aggiorna attività (bucket Benchmark)
    Messaggio Teams
  Ambito "Errore" (se Esecuzione non riesce)
```

### 2.2 Azioni nuove o modificate

Le azioni che non cito (trigger, condizione, `GetTask`, `Tipologia`, `Priorita`, `Avvio`, `Scadenza`, `GetOwner`, `Owner`) restano come nella v1.

**`TestateArray`** (Componi):
```
createArray(if(contains(string(body('GetTask')),'"category1"'),'Corriere',''),if(contains(string(body('GetTask')),'"category2"'),'Gazzetta',''))
```
**`TestateFiltrate`** (Filtra matrice): *Da* `outputs('TestateArray')`; condizione (modalità avanzata): `@not(empty(item()))`.
**`Testate`** (Componi): `if(empty(body('TestateFiltrate')),'Da definire',join(body('TestateFiltrate'),', '))`
**`Testata`** (Componi, sostituisce quella vecchia):
```
if(greater(length(body('TestateFiltrate')),1),'Multi-testata',if(empty(body('TestateFiltrate')),'Da definire',first(body('TestateFiltrate'))))
```
✔ Prova: una card con due etichette deve dare `Testata` = `Multi-testata` e `Testate` = `Corriere, Gazzetta`.

**`TitoloPulito`** (Componi):
```
replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(trim(body('GetTask')?['title']),'/','-'),':','-'),'<','-'),'>','-'),'|','-'),decodeUriComponent('%5C'),'-'),'?',''),'*',''),'"',''),'#',''),'%','')
```
**`NomeCartella`** (Componi):
```
concat(formatDateTime(utcNow(),'yyyy-MM'),'_',substring(outputs('TitoloPulito'),0,min(length(outputs('TitoloPulito')),80)))
```
✔ Il titolo `Test: home/HP?` deve dare `2026-11_Test- home-HP`.

**`PlannerLink`** (Componi): `concat('https://tasks.office.com/<DOMINIO_TENANT>/Home/Task/',body('GetTask')?['id'])`. ✔ Aprilo da una prova: deve portare alla card.

**`PercorsoCartella`** (Componi): `concat('<PREFISSO>/',outputs('Testata'),'/',outputs('NomeCartella'))`
**`PercorsoRelativo`** (Componi): `concat('<ROOT>/',outputs('Testata'),'/',outputs('NomeCartella'))`
Il primo serve alle azioni "per percorso", il secondo a "Crea nuova cartella".

**`CopiaCartella`** (SharePoint → Copia cartella):
- Indirizzo sito: `<SITO>`.
- Cartella da copiare: `<PREFISSO>/_TEMPLATE_Progetto` (scrivila, non usare il selettore).
- Sito e cartella di destinazione: `<PREFISSO>/` + `outputs('Testata')` (espressione).
- Nome della nuova cartella: `outputs('NomeCartella')`.
- Se esiste già una cartella: **Non riuscire**.
✔ In un'esecuzione di prova la cartella appare in SharePoint con tutte le sottocartelle.

**Attesa dopo la copia.** SharePoint finisce di copiare in modo asincrono: i file possono non essere subito leggibili. Su `GetFileMeta` e `GetFile` (sotto) apri **Impostazioni → Criteri di ripetizione → Intervallo fisso**, 4 tentativi, intervallo `PT10S`.

### 2.3 Ciclo `CompilaFile`

1. **`FileDaCompilare`** (Componi): `createArray('project.md','CHANGELOG.md','storico.md','vincoli.md','00_Input/_AVVIO.md')`
2. **Applica a ciascuno** su `outputs('FileDaCompilare')` (nome `Applica_a_ciascuno`, quello predefinito con il trattino basso); in Impostazioni → Controllo della concorrenza: **attivato, grado 1**. Dentro, in quest'ordine:
   1. **`GetFileMeta`** — SharePoint → *Ottieni metadati file usando il percorso*. Sito `<SITO>`; percorso `concat(outputs('PercorsoCartella'),'/',items('Applica_a_ciascuno'))`.
   2. **`GetFile`** — *Ottieni contenuto file usando il percorso*, stesso percorso.
   3. **`Originale`** (Componi):
```
if(contains(string(body('GetFile')),'$content'),base64ToString(body('GetFile')?['$content']),string(body('GetFile')))
```
   4. **`Compilato`** (Componi):
```
replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(outputs('Originale'),'{{PROGETTO}}',body('GetTask')?['title']),'{{PLANNER_ID}}',body('GetTask')?['id']),'{{PLANNER_LINK}}',outputs('PlannerLink')),'{{TESTATA}}',outputs('Testata')),'{{TESTATE}}',outputs('Testate')),'{{TIPOLOGIA}}',outputs('Tipologia')),'{{OWNER}}',outputs('Owner')),'{{PRIORITA}}',outputs('Priorita')),'{{AVVIO}}',outputs('Avvio')),'{{SCADENZA}}',outputs('Scadenza')),'{{PERCORSO}}',outputs('PercorsoCartella')),'{{DATA}}',formatDateTime(utcNow(),'yyyy-MM-dd'))
```
   5. **`AggiornaFile`** — *Aggiorna file*. Sito `<SITO>`; **Identificatore file**: scegli *Identificatore* dai contenuti dinamici di `GetFileMeta` (non scriverlo a mano); Contenuto file: output di `Compilato`.
   Il nome dell'elemento nel ciclo può differire (`Applica_a_ciascuno_2`): se lo rinomini, aggiorna l'espressione del punto 1.
✔ Dopo il test, `project.md` non contiene più `{{` e `CHANGELOG.md` ha il nome del progetto. Se compaiono caratteri strani, apri l'output di `Originale`: era base64 e la condizione non ha scattato.

### 2.4 Ciclo `LibrerieTestata`

**Applica a ciascuno** su `body('TestateFiltrate')`, da rinominare `Per_ogni_testata` (⋯ → Rinomina, con il trattino basso). Dentro, in quest'ordine:
1. **`CreaCartellaLibreria`** — SharePoint → *Crea nuova cartella*. Sito `<SITO>`; Libreria: la libreria dei progetti; Percorso: `concat(outputs('PercorsoRelativo'),'/00_Input/libreria/',items('Per_ogni_testata'))`.
2. **`CopiaPersonas`** — *Copia file*. File: `concat('<PREFISSO>/_Librerie/',items('Per_ogni_testata'),'/personas.md')`. Destinazione: `concat(outputs('PercorsoCartella'),'/00_Input/libreria/',items('Per_ogni_testata'))`. Se esiste già: **Non riuscire**.
3. **`CopiaProtopersonas`** — come sopra con `protopersonas.md`. Su questa azione: **Configura esecuzione dopo** → spunta anche **non è riuscito** e **è stato ignorato** sull'azione precedente, così se `personas.md` manca il ciclo prosegue.
✔ `00_Input/libreria/Corriere/` contiene i due file. Se una testata non ha i file, la cartella resta vuota e il flusso termina senza errori.

### 2.5 Chiusura del flusso

- **`LinkCartella`**, **Aggiorna dettagli attività**, **Aggiorna attività** (bucket Benchmark, avanzamento "Non iniziata"): come nella v1. Il link cartella usa `PercorsoCartella`.
- **Messaggio Teams**: testo `Nuovo progetto UX: [titolo] ([Testata]). Owner: [Owner]. Cartella: [link]. Istruzioni di avvio: 00_Input/_AVVIO.md`.
- **Ambito `Errore`**: *Configura esecuzione dopo* sull'ambito → spunta **non è riuscito** e **è scaduto**; dentro un messaggio Teams all'owner con il titolo e il link all'esecuzione.
✔ Controllo flusso senza errori. Salva.

---

## 3. Flusso 2 — "UX - Sincronizza manifest su Planner (v2)"

**3.1 Bucket: nessuna modifica.** Lo spostamento delle card tra bucket è stato eliminato: le card stazionano dove le metti. Il flusso 1 usa il bucket "Benchmark" solo come posizione iniziale. Se nella v2 del flusso 2 è rimasta l'azione `Bucket` o lo spostamento, toglila.

**3.2 Evita la partenza a vuoto.** Quando il flusso 1 copia la cartella, SharePoint "crea" un `project.md` ancora con i segnaposto, e il flusso 2 parte. Subito dopo `PlannerId` aggiungi una **Condizione**: `not(contains(outputs('PlannerId'),'{'))`. Se è **Falso**: azione *Termina* con stato **Riuscito**. Tutto il resto del flusso va nel ramo **Vero**.
✔ Dopo la creazione di un progetto, nel flusso 2 vedi un'esecuzione "riuscita ma terminata" e una completa.

---

## 4. Collaudo (prima di attivare per tutti)

Attiva solo le v2 (le v1 restano disattivate). Usa card di prova.

| # | Prova | Cosa deve succedere |
|---|---|---|
| 1 | Card nel bucket intake, etichetta Corriere | Cartella `Corriere/AAAA-MM_Nome/` con tutte le sottocartelle; `project.md` senza `{{`, `testata: Corriere`, `testate: Corriere`, `fase: avvio`; `_AVVIO.md` compilato; `00_Input/libreria/Corriere/` con i due file; card in Benchmark; messaggio Teams |
| 2 | Due etichette (Corriere e Gazzetta) | Cartella in `Multi-testata/`; `testate: Corriere, Gazzetta`; due sottocartelle in `libreria` |
| 3 | Titolo `Test: home/HP?` | Cartella `AAAA-MM_Test- home-HP` |
| 4 | Stessa card ricreata col titolo uguale | Il flusso fallisce sulla copia (cartella esistente) e arriva l'avviso nell'ambito Errore |
| 5 | Facoltativo, solo se il flusso 2 aggiorna ancora la descrizione: in `project.md` cambia la versione | La descrizione della card riporta la nuova versione. La card **non** si sposta |
| 6 | Testata senza `protopersonas.md` | Nessun errore, cartella `libreria` vuota |

Dopo ogni prova: **Cronologia esecuzioni** → apri l'esecuzione → controlla che ogni azione sia verde e guarda gli output di `GetTask`, `Testata`, `NomeCartella`, `Originale`.

---

## 5. Errori comuni

| Sintomo | Causa probabile | Come risolvere |
|---|---|---|
| Il flusso non parte | Flusso spento, card creata in un altro piano, ID bucket sbagliato | Controlla l'interruttore, il piano del trigger e l'ID del bucket nella condizione |
| "Cartella non trovata" sulla copia | `<LIB>` scritto col nome visualizzato invece del nome nell'indirizzo, o cartella `Corriere`/`Multi-testata` mancante | Rileggi `<LIB>` dall'indirizzo; crea le cartelle |
| Restano `{{...}}` nei file | Azione rinominata dopo aver scritto l'espressione, o `Compilato` incollato come testo | Riscrivi l'espressione dal pulsante fx e controlla i nomi |
| `Testata` = "Da definire" | Slot delle etichette diversi da `category1`/`category2` | Leggi `appliedCategories` e correggi `TestateArray` |
| Caratteri strani nel file | Contenuto in base64 | Controlla `Originale` e la condizione su `$content` |
| Errore 404 su `GetFile` subito dopo la copia | Copia asincrona | Criteri di ripetizione su `GetFileMeta` e `GetFile` (2.2) |
| Il flusso 2 va in errore alla creazione | Partenza sui segnaposto | Condizione del punto 3.2 |
| Due cartelle per card | v1 e v2 attive insieme | Disattiva la v1 |
| "Accesso negato" | L'account del flusso non ha modifica sulla libreria | Punto 1.6 |

---

## 6. Messa in produzione e ritorno indietro

1. Dopo i sei test: **disattiva definitivamente la v1** (non eliminarla per una settimana) e lascia attiva la v2.
2. Rinomina le v2 togliendo "(v2)" e le v1 in "(vecchio)".
3. **Ritorno indietro:** disattiva la v2, riattiva la v1 e, se serve, reimporta il pacchetto del punto 0.1. Il template vecchio non ti serve: i progetti già creati non cambiano.
4. Se un progetto è già in corso con la struttura vecchia, non toccarlo: Design Ops aggiunge da solo le voci mancanti (gate, Device, Referenti) quando lo apri.
