# Piano di collaudo — primo progetto reale

Scopo: verificare l'intero flusso, da `Avvia` a `Handoff`, e in particolare le parti **non ancora provate in un file Figma reale**. Si può riprendere da qualunque fase: per ogni passo trovi cosa fare, cosa deve succedere e cosa mandarmi se non torna.

Legenda: ✔ atteso · ⚠ non provato finora (da guardare con attenzione).

## 0. Prima di iniziare

- [ ] Installate le versioni consolidate: `design-ops`, `magic-blender`, `dxs-personas`, `dxs-wireframe`, `dxs-handoff`, `dxs-adv-placement`. Rimosse `dxs-regia`, `magic-blender-v21`, `magic-blender-design-requirements`.
- [ ] Template SharePoint aggiornato: `project.md` a 5 gate con `Figma Flow`, `vincoli.md`, cartella `05_Handoff` (niente `05_Audit` né `06_Handoff`).
- [ ] Project di Claude con la sola cartella del progetto, più `Ricerca` e `Papers` in sola lettura. Connettore Figma attivo.
- [ ] File Figma duplicato dal template, con la libreria "DXS Corriere – Wireframe library" attiva. FigJam duplicato dal template.
- [ ] Nel progetto: brief in `00_Input/`.

Ogni step gira in una **sessione nuova**, tranne le correzioni dello stesso step.

## 1. Avvia

| Fai | Atteso | Controlla |
|---|---|---|
| `Avvia` | Un solo messaggio con 6-7 domande. Se manca il brief, si ferma prima | Nessuna domanda su nome, testata, owner, scadenza |
| Rispondi per numero | `project.md`: Link, Device e Referenti scritti; "dopo" → voce in Aperto; `fase: benchmark`; versione 1.0.1; voce in `CHANGELOG.md`; creato `_stato.json` | Il frontmatter non ha altri cambiamenti |
| (automatico) Cover Figma ⚠ | Titolo: nome progetto e testata. Scheda: tipo di attività, "Owner, Design Owner", link cliccabili | Stile (grassetto, corsivo) mantenuto; i link si aprono; rilanciando non si duplicano righe |
| `Read Me` (facoltativo) ⚠ | Titolo, stakeholder, stime, link scritti; "Nome progetto" sostituito nei nomi delle pagine | Overview e Legenda invariati; le emoji restano |

## 2. Step 1 — Benchmark (`Procedi`)

- ✔ Alert B se `Ricerca` o `Papers` non sono collegate. Senza brief, si ferma.
- ✔ Blender si ferma a "Benchmark pronto": rispondi ok. Poi genera il pacchetto in `01_Blender/`.
- ✔ **HC1:** riepilogo del quadro informativo. Dopo il tuo ok: Contesto in `project.md`, Aperto con le domande, gate Benchmark, versione 1.1.0.
- ⚠ **FigJam:** pagine Cover, Benchmark, User-Flow e Personas con frame `[auto]`. Controlla che le pagine si trovino per nome e che i testi siano leggibili.
- Se `Papers` è collegata: in `registro-input.md` c'è la selezione (max 8 paper).
- Prova `Annota [Business] spostare il filtro, su v1.1` → compare in Aperto. `Annota [Dev] vincolo: ... su WF-02` → riga in `vincoli.md`.

## 3. Step 2 — Personas (`Procedi`, sessione nuova)

- ✔ Tabella di affinità; validazione delle protopersona (a scelta multipla).
- ⚠ **Schede su FigJam:** nella pagina `Personas`, un frame col nome del progetto. Senza link FigJam la skill lo chiede.
- ✔ `02_Personas/personaggi-del-progetto.md` con la tabella "Corrispondenza segmenti ↔ personaggi". I segmenti in lacuna → voce in Aperto.
- ✔ Gate Personas, `fase: wireframe`, versione 1.2.0.

## 4. Step 3 — Wireframe (`Procedi`, sessione nuova)

- ✔ Progetto nuovo: una riga che propone l'architettura informativa. Con "sì": `03_Wireframe/architettura.md`, tabella feature con P1/P2/P3 e importanza, controllo e **stop** per il tuo ok.
- ✔ Gate pagine con una riga **Vincoli** (se ne hai registrati). Stop per l'ok.
- ✔ Render nella pagina `Wireframe`: contenitori per device, annotation parlate, frame `Legenda · ID`, riga `ADV` solo con `--ADV`.
- ⚠ **Protezione:** modifica a mano un testo in un frame, poi lancia una revisione sulla stessa pagina. Il frame deve comparire in `protected`, restare intatto, e la pagina passare a `Manuale: sì`.
- ✔ **HC2:** blocco con link Figma, copertura, avvisi, "Vincoli recepiti". Dopo l'ok: gate Wireframe, versione 1.3.0, i `VIN-` citati passano a `recepito`.

## 5. Controllo modifiche e condivisioni

- Copia un file in `00_Input/` e scrivi `Stato`: una riga "N modifiche non registrate". Con `Procedi` compare il report con gli impatti; rispondi `no` → riga "ignorato" in `storico.md`.
- `Annota condiviso architettura con Business`, poi modifica `architettura.md`: `Stato` deve dire "architettura modificata dopo la condivisione".
- Dopo un `Annota` il comando successivo **non** deve segnalare `project.md` come modificato dall'esterno.

## 6. Step 4 — Validazione (`Procedi`, sessione nuova)

- ✔ Se in questa sessione hai fatto lo step 3, Design Ops chiede di aprirne una nuova.
- ✔ Test con i personaggi. Report in `04_Validazione/test-AAAA-MM-DD.md`. ⚠ Controlla che la tabella "Problemi" abbia colonne ID, Livello, Frame, Tipo e "Decisione del designer".
- ✔ **HC3:** elenco numerato. Rispondi `accetto 1 2 · rimando 3`. Un problema di tipo requisito o vincolo diventa "rimandato" da solo.
- ✔ Revisione in una sessione nuova: righe `Rev: VAL-NN` in `pagine.md`, contatore `n/2` per pagina.
- ✔ Alla fine `validazione.py stato` dice CHIUDIBILE; dopo l'ok: gate "Wireframe validato", `fase: handoff`, versione 1.4.0.
- Via alternativa: segna ✅ le pagine UX in Figma e scrivi `Stato`: deve proporre il gate.

## 7. Step 5 — Handoff (`Handoff`, sessione nuova)

- ✔ Proposta di casi e azioni, con **stop**.
- ⚠ Annotation `Tap` sugli elementi dei frame; user flow in un FigJam.
- ✔ HC "Handoff pronto per la UI". Dopo l'ok: `Figma Flow` in `project.md`, gate "Passaggio alla UI", `fase: chiuso`, versione 1.5.0. La Cover mostra il link "User flow".

## 8. Esito e cosa mandarmi

Per ogni riga che non torna mandami: il testo dell'errore, l'output dello step, e questi file della cartella del progetto: `project.md`, `CHANGELOG.md`, `storico.md`, l'eventuale report di validazione. Per Figma, uno screenshot della pagina interessata.

**Criteri per pubblicare il plugin:** tutti i passi ✔ completati, e i ⚠ provati almeno una volta senza modifiche manuali di rimedio.
