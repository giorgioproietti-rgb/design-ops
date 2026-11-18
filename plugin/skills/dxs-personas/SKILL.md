---
name: "dxs-personas"
description: Step 2 del processo UX (personas) e test del design. Cerca le personas della testata affini ai segmenti di Blender, le trasforma in personaggi critici (utenti ostili o difficili), crea le protopersona mancanti con scheda su FigJam e scrive la corrispondenza segmenti-personaggi. Con --testDesign testa i wireframe su Figma con due user journey per personaggio (--task o --sentiment per il test veloce) e salva il report in 04_Validazione. Usa SEMPRE questa skill per personas critiche, test dell'utente peggiore, adversarial test o per far criticare un design da un lettore difficile. Di norma la lancia design-ops.
---

# DXS Personas – personas, protopersona e personaggi critici per il test del design

Questa skill parte dalle personas reali di una testata e ne costruisce la versione più difficile: il lettore che non ha tempo, non vuole imparare nulla di nuovo e trova un motivo per lamentarsi di tutto. Serve a scovare **attrito** nel design, non bug: terminologia da redazione, troppi passaggi, gerarchie poco chiare, testi illeggibili, stati vuoti, paywall ostili.

Il valore non sta nella cattiveria del personaggio, ma nel fatto che resta **ancorato a una persona reale della testata**. Un personaggio critico inventato da zero produce lamentele generiche; uno derivato dalle personas di riferimento produce lamentele che il team riconosce come plausibili. Per questo ogni tratto del personaggio deve essere tracciabile alla fonte o dichiarato come amplificazione.

La skill lavora su una cartella locale (Cowork / Claude Code).

## Regole d'ordine (mandatorie)

1. **Prima si cercano, poi si creano. Mai il contrario.** Le personas si cercano nelle fonti di riferimento della testata, nell'ordine: `personas.md`, `protopersonas.md`, board Figma della testata (passo 1.2b). Solo se dopo tutte e tre non ci sono almeno 2 personas affini si creano protopersona (passo 1.4).
2. **Le personas scritte da Blender non sono fonti di riferimento.** Le sezioni di `01_Blender/personas-journey.md` (`### PER-` o `### SEG-`) servono solo come descrizione dei segmenti e dei bisogni del progetto. Contano come personas di riferimento solo se la loro riga "Fonte" cita `personas.md`, `protopersonas.md` o la board Figma.
3. **Affinità contro un testo indipendente.** Se "Personas DXS" di `project.md` è stata scritta a partire dalle stesse personas che stai valutando, l'affinità è circolare: dillo e valuta contro i segmenti e i bisogni di `personas-journey.md` e `insight.md`.
4. **Ogni protopersona creata è visibile.** Dopo la validazione si salva in `protopersonas.md` **e** si crea la sua scheda nella pagina Figma dedicata (pagina Personas del FigJam del progetto, voce `FigJam` di `project.md`; assente → chiedila una volta). Senza scheda Figma la Fase 1 non si chiude: se la creazione fallisce, fermati e dillo.
5. **Ok esplicito.** Scelta delle protopersona, salvataggi e schede Figma solo dopo una risposta esplicita ("ok", "sì", la scelta di un'opzione). Qualsiasi altra risposta → "Confermi con ok?".

## Mappa dei file

**File della skill**

| File | A cosa serve |
|---|---|
| `references/fase1-estrazione-insight-ricerca.md` | Come trovare e analizzare le ricerche per costruire le protopersona |
| `references/fase1-modello-protopersona.md` | Modello della scheda protopersona (stessi campi delle schede personas) |
| `references/fase1-modello-personaggio-critico.md` | Modello del personaggio critico |
| `references/fase1-fonte-figma-personas-corriere.md` | Board Figma con le personas Corriere: link, node-id e come leggerla senza sprechi |
| `references/fase1-creazione-schede-figma-protopersona.md` | Come creare su Figma le schede delle protopersona validate |
| `references/fase2-procedura-test-design.md` | Procedura del test sul design: journey, task completion, sentiment, filtro pragmatico |
| `scripts/crea-schede-protopersona-figma.js` | Script pronto per disegnare le schede protopersona in FigJam |

**File di lavoro nelle cartelle dell'utente**

| File | Contenuto | Chi lo scrive |
|---|---|---|
| `project.md` | Dati del progetto: "testata", "Personas DXS", link `Figma WF` e `FigJam` | l'utente / Design Ops |
| `01_Blender/personas-journey.md` | Segmenti e personas del progetto (sezioni `### PER-` / `### SEG-`) | magic-blender |
| `personas.md` | Personas da ricerca, per testata, con scheda e personaggio critico | l'utente (la skill aggiunge solo personaggi critici mancanti e le schede trascritte dalla board) |
| `protopersonas.md` | Protopersona validate, riutilizzabili in altri progetti | la skill, dopo la validazione |
| `personaggi-del-progetto.md` | Personaggi scelti per ogni progetto, usati dal test sul design | la skill |
| `insight-ricerca.md` | Insight estratti dalle ricerche ed elenco dei file già analizzati | la skill |

## Comandi e fasi

| Invocazione | Fase | Cosa fa |
|---|---|---|
| skill senza comandi | **Fase 1 – Personas** | cerca o crea personas e personaggi critici e li salva su file |
| `--testDesign` | **Fase 2 – Test sul design** | test completo: task completion + sentiment journey |
| `--testDesign --task` | Fase 2, veloce | solo task completion |
| `--testDesign --sentiment` | Fase 2, veloce | solo sentiment journey |

Regole sui comandi:
- `--task` e `--sentiment` valgono **solo** concatenati a `--testDesign`. Se compaiono da soli, non eseguire nulla: rispondi in una riga che vanno usati con `--testDesign` e chiedi se lanciare il test.
- `--task` e `--sentiment` insieme equivalgono al test completo.
- La Fase 2 parte solo con `--testDesign`. Se l'utente chiede un test o un audit a parole senza il comando, chiedi in una riga se lanciare `--testDesign`.
- Senza `--testDesign` esegui solo la Fase 1, anche se nella richiesta c'è un link Figma.

Fermati e chiedi all'utente solo nei punti indicati: per il resto procedi, dichiarando le assunzioni fatte. Risposte in chat sintetiche (max 15 righe): il dettaglio sta nei file.

---

# Procedure

- **Fase 1** (personas, personaggi critici): leggi `references/fase1-procedura.md` prima di iniziare e seguila passo per passo. Le "Regole d'ordine" sopra valgono sempre.
- **Fase 2** (`--testDesign`): leggi `references/fase2-procedura-test-design.md`: prerequisiti, test completo e veloce, risultato finale.

# Output

Nella Fase 1 ometti "Test sul design"; nella Fase 2 riporta il Contesto in forma breve e poi solo "Test sul design".

```
# Personaggi critici – <Progetto> (<Testata>)

## Contesto
- project.md: <percorso>
- Testata: <valore>
- Personas DXS: "<descrizione>" (circolare: sì/no)
- Fonti cercate: personas.md / protopersonas.md / board Figma — esito di ciascuna; file analizzati: <n>; non analizzati: <elenco>

## Affinità
<tabella persona × attributi, % affinità, fonte, motivazione>

## Insight di ricerca
<solo se si creano protopersona: cartella analizzata, file letti / saltati, insight usati con fonte, contraddizioni>

## Protopersona create
<solo se create: percorso di protopersonas.md e link alla scheda Figma (obbligatorio)>

## Personaggi critici
<uno per persona selezionata, secondo template; percorso di personaggi-del-progetto.md aggiornato>

## Corrispondenza segmenti ↔ personaggi
<la tabella scritta in personaggi-del-progetto.md; n segmenti coperti su m>

## Test sul design
<solo in Fase 2; il report completo si salva come da `references/fase2-procedura-test-design.md` §8>

## Assunzioni e punti aperti
```

# Regole

- Prima cercare (personas.md, protopersonas.md, board Figma), poi creare. Mai il contrario.
- Le personas scritte da Blender non sono fonti di riferimento.
- Ogni segmento attivo di Blender ha una riga di corrispondenza: coperto o lacuna.
- Mai sovrascrivere file esistenti nella cartella della testata: solo aggiunte.
- Mai assumere la testata: se non è chiara, chiedi.
- Ogni tratto del personaggio critico è tracciabile (`[fonte]` / `[amplificato]`).
- Le protopersona sono sempre marcate "da validare", si basano sugli insight di ricerca quando esistono e hanno sempre una scheda Figma visibile.
- Nessuna protopersona viene salvata o portata su Figma senza la scelta esplicita dell'utente.
- La Fase 2 parte solo con `--testDesign`; `--task` e `--sentiment` valgono solo concatenati a esso.
- Nel test: 2 journey per ogni personaggio, un personaggio alla volta; il filtro pragmatico non si salta.
- Duro ma corretto: problemi reali, non inventati per fare scena.