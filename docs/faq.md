# Domande frequenti

### Cos'è Design Ops e a cosa serve?
<!-- argomento: per-iniziare -->
Design Ops è il plugin del team UX/UI Design. Porta un progetto dalla richiesta in Planner alla consegna di un file solido alla UI. L'assistente esegue il lavoro ripetitivo (ricerca, personas, wireframe, note per la UI); il designer approva a ogni controllo. Ciò che segue la consegna (lavoro sulla UI, audit del design system, consegna agli sviluppatori) ha regole proprie e non è gestito dal plugin.

### Quali sono gli step del processo?
<!-- argomento: per-iniziare -->
Avvio, Benchmark e ricerca (`magic-blender`), Personas (`dxs-personas`), Architettura e wireframe (`dxs-wireframe`), Wireframe validato (test con `dxs-personas --testDesign` oppure pagine UX ✅ in Figma) e Passaggio alla UI (`dxs-handoff`). `design-ops` li orchestra: legge `project.md`, lancia lo step giusto e scrive manifest e changelog solo dopo l'ok del designer.

### Dove vedo input, output e comandi di ogni passo?
<!-- argomento: per-iniziare -->
Nella pagina "Il percorso" del sito: uno schema interattivo con tutti i passi, dal punto di partenza condiviso alla consegna alla UI. Cliccando un passo vedi in sintesi cosa fa, che input serve, che output produce, quali comandi usare, quale controllo deve fare il designer e cosa fare se ti perdi. Se non sai a che punto sei, scrivi `Stato`.

### Quali comandi posso usare?
<!-- argomento: per-iniziare -->
Cinque: `Avvia`, `Procedi`, `Stato`, `Aggiorna`, `Annota`. Si scrivono come prima parola del messaggio, oppure come comandi con la barra: `/design-ops:avvia`, `/design-ops:procedi`, `/design-ops:stato`, `/design-ops:aggiorna`, `/design-ops:annota`.

### Come inizio un nuovo progetto?
<!-- argomento: per-iniziare -->
1. Crea la card in Planner nel bucket "Nuovi progetti UX", con l'etichetta della testata: il flusso automatico crea la cartella del progetto da template.
2. Crea il Project di Claude con la sola cartella del progetto. `Ricerca` e `Papers` si collegano in sola lettura (facoltative).
3. Metti il brief in `00_Input/` e scrivi `Avvia`.

### Cosa fa il comando Avvia?
<!-- argomento: per-iniziare -->
Pone in un solo messaggio le domande di avvio: link Figma, link FigJam, device, riferimento online, design esistente (solo per Evoluzione e Redesign), referenti e altro. Le risposte vanno in `project.md`. Poi porta la fase a `benchmark`, registra la voce nel changelog, crea lo snapshot di controllo e compila la Cover del file Figma. Se manca il brief si ferma prima.

### Come passo allo step successivo?
<!-- argomento: per-iniziare -->
Scrivi `Procedi`. Design Ops legge `project.md`, controlla gli input e lancia la skill del prossimo step. Ogni step parte in una sessione nuova; fanno eccezione le correzioni dello stesso step.

### Perché ogni step richiede una sessione nuova?
<!-- argomento: per-iniziare -->
Per tenere il contesto leggero. Per la validazione e la revisione dei wireframe c'è anche un motivo di indipendenza: chi valuta non deve aver costruito i wireframe.

### Quali sono i gate del progetto?
<!-- argomento: progetto-e-file -->
Cinque: Benchmark, Personas, Wireframe, Wireframe validato e Passaggio alla UI. Un gate si spunta in `project.md` solo dopo l'ok esplicito del designer, e ogni gate superato porta una versione minore nel changelog.

### Che fasi ha un progetto?
<!-- argomento: progetto-e-file -->
`avvio`, `benchmark`, `wireframe`, `handoff` e `chiuso`. Con il gate "Wireframe validato" si passa da `wireframe` a `handoff`; con la consegna alla UI il progetto diventa `chiuso`.

### Cosa contiene project.md?
<!-- argomento: progetto-e-file -->
È il cruscotto del progetto: anagrafica da Planner, fase, versione, gate, contesto (obiettivo, utenti, device, referenti), link e voci aperte. Lo scrive Design Ops dopo l'ok del designer, mai le skill di step.

### Come funzionano le versioni del changelog?
<!-- argomento: progetto-e-file -->
Versione maggiore: cambio di perimetro. Minore: gate superato. Patch: decisioni e correzioni. Ogni voce dice cosa è cambiato e perché.

### Come registro una decisione, un feedback o una domanda aperta?
<!-- argomento: progetto-e-file -->
Con `Annota [Fonte] testo`, per esempio `Annota [Business] spostare il filtro, su v1.1`. I feedback con etichetta finiscono tra le voci aperte; una decisione si registra solo se è un ok esplicito. Il comando scrive e conferma in una riga.

### Cos'è vincoli.md e come lo uso?
<!-- argomento: progetto-e-file -->
È il registro dei vincoli tecnici, di business e di marketing, con ID `VIN-NN`. Si compila con `Annota [Dev] vincolo: testo su WF-02`. La gravità è `blocca`, `limita` (predefinita) o `nota`. Per aggiornarlo: `Annota VIN-01 recepito`, `Annota VIN-01 superato` o `Annota VIN-01 su WF-03`. Un vincolo non cambia la versione; uno bloccante crea una voce tra gli aperti.

### Cosa succede se cambio un file a mano?
<!-- argomento: progetto-e-file -->
`Stato` segnala quante modifiche non sono registrate. Con `Procedi` compare un report con gli impatti sul processo; rispondi per registrarle oppure per ignorarle. Le scelte vanno nello storico.

### Come registro che ho condiviso un output con il Business o i Dev?
<!-- argomento: progetto-e-file -->
Con `Annota condiviso architettura con Business`. Design Ops scrive nello storico versione e impronta del file; se in seguito l'output cambia, `Stato` segnala che è stato modificato dopo la condivisione.

### Come funziona la validazione dei wireframe?
<!-- argomento: wireframe-e-ui -->
In una sessione nuova, `dxs-personas --testDesign` prova i wireframe con i personaggi critici e produce un report con i problemi (ID `VAL-NN`). Design Ops presenta un elenco di rossi e gialli: rispondi per numero, per esempio `accetto 1 2 · respingo 3 · rimando 4`. I problemi accettati tornano ai wireframe in revisione (massimo 2 per pagina). Quando ogni rosso ha una decisione e ogni accettato una correzione, propone di spuntare "Wireframe validato".

### Cosa succede ai problemi di tipo requisito o vincolo?
<!-- argomento: wireframe-e-ui -->
Non si risolvono nel wireframe: se li accetti diventano "rimandato" e finiscono tra le voci aperte, come input per `magic-blender` o per il registro dei vincoli.

### Posso validare senza il test?
<!-- argomento: wireframe-e-ui -->
Sì. Se le pagine `UX Mob` e `UX Desk` richieste dal device sono segnate ✅ in Figma, Design Ops propone di spuntare "Wireframe validato". Il ✅ del designer vale come approvazione.

### Come funziona il passaggio alla UI?
<!-- argomento: wireframe-e-ui -->
Con `Handoff` (`dxs-handoff`): propone casi e azioni del flusso (stop per l'ok), aggiunge le annotation `Tap` sugli elementi dei frame, crea lo user flow in un FigJam e chiude con il blocco "Handoff pronto per la UI". Salva il link `Figma Flow`, spunta il gate "Passaggio alla UI" e porta la fase a `chiuso`.

### Cosa scrive il plugin su Figma?
<!-- argomento: wireframe-e-ui -->
Solo: i due testi della Cover, i testi guida del Read Me e i nomi delle pagine con "Nome progetto" (su richiesta), i frame della pagina Wireframe, le annotation `Tap` e le pagine di ricerca nel FigJam del progetto (frame `[auto]`). Non tocca le altre pagine né i frame che non ha generato.

### Cosa succede se modifico a mano un frame generato?
<!-- argomento: wireframe-e-ui -->
I frame ritoccati a mano sono protetti: non vengono rigenerati, compaiono come "protected" e la loro pagina passa a `Manuale: sì`. Si rigenerano solo con ok esplicito.

### Quante revisioni automatiche si fanno per pagina?
<!-- argomento: wireframe-e-ui -->
Al massimo 2. Poi la decisione passa al designer, che corregge a mano e segna il problema come `risolto`.

### Quale libreria usano i wireframe?
<!-- argomento: wireframe-e-ui -->
La "DXS Corriere – Wireframe library", che deve essere attiva nel file di progetto. La vecchia `WF_library` è archiviata e non va usata.

### Come aggiungo gli ADV ai wireframe?
<!-- argomento: wireframe-e-ui -->
Con `--ADV` accanto a un comando wireframe, per esempio `Crea WF --ADV`. Gli ADV arrivano dalle regole di `dxs-adv-placement`, che oggi coprono solo il Corriere.

### Il plugin funziona per Gazzetta e per più testate insieme?
<!-- argomento: wireframe-e-ui -->
Sì per le due testate, tramite l'etichetta in Planner. Un progetto multi-testata vive in una cartella a parte (`Multi-testata`) e viene contato per ciascuna testata.

### Come compilo il Read Me e rinomino le pagine del file Figma?
<!-- argomento: wireframe-e-ui -->
Su richiesta, scrivendo "Read Me". Design Ops scrive titolo, stakeholder, stime e link, e sostituisce "Nome progetto" nei nomi delle pagine. Non tocca Overview e Legenda.

### Come installo il plugin?
<!-- argomento: installazione -->
Rimuovi le skill installate singolarmente, poi usa *Customize → Plugins → Add → Upload plugin* e scegli lo zip. Il plugin compare nel task successivo; se non appare, riavvia l'app. Per la condivisione col team un owner dell'organizzazione usa "Publish to org".

### Perché devo rimuovere le skill installate singolarmente?
<!-- argomento: installazione -->
Perché il plugin contiene già le stesse skill: se restano entrambe, si attivano due volte.

### Come si aggiorna il plugin?
<!-- argomento: installazione -->
Si ricarica il nuovo zip. Ogni progetto registra la versione del processo nella voce di changelog dell'avvio. Se un aggiornamento non si applica, disinstalla, reinstalla e riavvia l'app.

### Come so quale versione del plugin ho e se è aggiornata?
<!-- argomento: installazione -->
In alto la wiki mostra la versione del plugin e la data di aggiornamento: confrontala con la versione del plugin installato e con la sezione Rilasci. Ogni progetto registra inoltre "Design Ops vX.Y.Z" nella voce di changelog dell'avvio, così si sa con quale versione è stato fatto.

### Cosa è cambiato nell'ultima versione?
<!-- argomento: installazione -->
Lo trovi nella sezione Rilasci (il changelog): ogni versione elenca novità e correzioni. Le funzioni previste per le prossime versioni sono nella voce "Prossime versioni".

### Cosa succede ai progetti già avviati quando il plugin si aggiorna?
<!-- argomento: installazione -->
Continuano a funzionare: nelle versioni patch e minori i file di progetto (`project.md`, changelog, storico) non cambiano formato. Una versione maggiore indica un cambio che può richiedere di adattare i progetti esistenti, e lo spiega nei Rilasci.

### Come rilascio una nuova versione e aggiorno la wiki?
<!-- argomento: installazione -->
Per chi mantiene il plugin. Lancia `python3 tools/release.py X.Y.Z --note "cosa cambia"`: aggiorna versione e changelog, rigenera la wiki, controlla la ricerca e crea lo zip. Poi carica lo zip e, in una chat di Claude con la cartella del plugin, scrivi "pubblica la wiki del plugin sul link esistente": il link condiviso non cambia. Se hai aggiunto una funzione, aggiungi anche la sua domanda in `docs/faq.md` e una domanda di prova in `tools/wiki-test-queries.json`.

### Dopo aver creato la card in Planner non è stata creata la cartella. Perché?
<!-- argomento: problemi -->
Le cause più comuni: la card è finita in un bucket diverso da "Nuovi progetti UX" (per esempio se la crea Copilot); il proprietario non è risolvibile; le etichette mancano e la cartella `Da definire` non esiste; il flusso non è partito. Il punto di partenza è la cronologia esecuzioni del flusso 1: dice se è partito, in quale azione si è fermato e con quale errore.

### Cosa serve per usare il plugin?
<!-- argomento: per-iniziare -->
L'app desktop di Claude con la cartella del progetto collegata al Project, il connettore Figma attivo (Cover, FigJam, wireframe, handoff), il file Figma e il FigJam duplicati dai template e il template SharePoint aggiornato.

### Senza il connettore Figma cosa funziona?
<!-- argomento: problemi -->
Design Ops lo segnala all'inizio e lavora sui file locali (ricerca, personas, documenti). Servono invece il connettore per compilare la Cover, pubblicare su FigJam, disegnare i wireframe e preparare l'handoff.

### Cosa non è incluso nel plugin?
<!-- argomento: problemi -->
Il lavoro sulla UI, l'audit del design system e la consegna agli sviluppatori. Non sono inclusi nemmeno, per ora, lo scambio automatico con il Product Snapshot e la manutenzione della libreria (`dxs-component-robustness`, `dxs-figma-component-docs`, `dxs-infrastructure-robustness`).

### Come funziona lo scambio con il Product Snapshot?
<!-- argomento: problemi -->
È una proposta ancora da definire. Il design manda le decisioni allo snapshot, che restituisce aggiornamenti e punti da attenzionare, in quattro momenti: durante i wireframe, dopo la validazione, al passaggio alla UI e durante il lavoro sulla UI. Design Ops non scrive mai sul Product Snapshot: ne legge soltanto le nuove versioni, copiate da un flusso automatico in una cartella del progetto.

### Come funzionano la ricerca e le risposte del sito?
<!-- argomento: problemi -->
La ricerca cerca per parole in tutta la documentazione. Il pulsante "Chiedi all'assistente" scrive una risposta breve usando solo le sezioni trovate e mostra le fonti: se la documentazione non copre la domanda, risponde "Non è documentato nel plugin". Le risposte sono generate automaticamente, quindi vanno controllate nelle fonti.

### Come segnalo un problema o propongo un miglioramento?
<!-- argomento: problemi -->
Usa il pulsante "Feedback" del sito: il messaggio arriva direttamente al team, con la pagina o la ricerca da cui parti. Scegli se è un suggerimento, un errore o una domanda senza risposta. Le correzioni escono in una nuova versione del plugin e compaiono nella sezione Rilasci.

### Cosa significano gli ID che compaiono nei file?
<!-- argomento: progetto-e-file -->
`WF-NN` pagina wireframe · `FEA-NN` feature dell'architettura · `RIC-NN` insight di ricerca · `PRIN-NN` principio di design · `SEG-NN` segmento · `PER-NN` persona · `BEN-NN` osservazione di benchmark · `BEN-P-NN` pattern di benchmark · `SUG-NN` suggerimento · `VAL-NN` problema di validazione · `VIN-NN` vincolo.

### Dove trovo il piano di collaudo e la guida dei flussi Power Automate?
<!-- argomento: problemi -->
Nella cartella `docs` del plugin: `piano-collaudo.md` per verificare il processo su un progetto reale, `aggiornamento-flusso-1.md` per la creazione automatica dei progetti da Planner e `template-progetto` per i file del template SharePoint.
