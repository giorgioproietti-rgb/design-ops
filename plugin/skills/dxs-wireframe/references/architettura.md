# Architettura informativa

Scopo: prima di disegnare le pagine, mettere ordine in feature e aree. Due output: la **tabella delle feature** per priorità e importanza, e l'**architettura per aree**. Schema di riferimento: frame «IA — Auto-Risparmio» del file Figma «Startup Gazzetta» (nodo 5840:4810). Le regole sono qui sotto: non serve riaprirlo.

## Quando
- **Richiesta**: `Architettura`, `Architettura informativa`, `Crea Architettura`.
- **Suggerita** (una volta per progetto, solo se lanciata con un comando wireframe) quando `tipologia` in `project.md` è "Nuovo prodotto", oppure `Riferimento online` è vuoto e il brief descrive un prodotto, app o servizio che non esiste ancora. Non suggerirla per Feature, Evoluzione o Redesign, salvo richiesta.
- Il suggerimento è una riga: "Progetto nuovo: parto dall'architettura informativa (tabella feature + aree)? sì / no, vado alle pagine". Risposta "no" → scrivi `Architettura: saltata` in `pagine.md` e non richiederla.
- `architettura.md` esiste già → non rifarla. Cambio requisiti → **aggiornamento**: ricalcola solo le feature con ID toccati, incrementa la versione del file, ridisegna solo le aree cambiate.

## Input (lettura minima, `grep`/`sed` sulle sezioni)
- `personas-journey.md`: requisiti (ID) e personas (`PER-`, `SEG-`). Gli `[suggerito]` restano separati.
- `brief.md`: feature citate. `insight.md` sezione "Bisogni per journey". `principi.md`: righe `PRIN-`.
- `project.md`: `Device`, `testata`, `tipologia`.

## 1. Feature
- Una feature è una capacità che l'utente usa (es. "Prezzi carburante real-time"): non una pagina e non un requisito atomico. Raggruppa i requisiti affini. Nome max 4 parole. ID `FEA-NN`, propri di questa skill.
- Fonti: requisiti decisi, requisiti con fonte `RIC-`, `SUG-`.
- Ogni requisito finisce in almeno una feature o in "Fuori perimetro" con motivo.

## 2. Priorità
- **P1 Must have (MVP)**: requisito deciso e necessario a completare il journey principale di almeno una persona primaria, oppure obbligo dichiarato dal business o dalla legge.
- **P2 Should have**: requisito deciso non bloccante, o bisogno `RIC-` solido non coperto dal MVP.
- **P3 Fase 2**: `[suggerito]`, rinviato nel brief, o dipendente da dati o integrazioni non confermati.
- Priorità incerta → la più bassa plausibile, più un dubbio nel gate. Mai P1 per default.

## 3. Importanza
- **Alta**: la usano 3 o più personas, o è nel journey principale della persona primaria.
- **Media**: 2 personas. **Bassa**: 1 persona.
- Sigla persona: iniziali del nome (2 lettere, es. Pendolare Urbano → PU). Doppioni → seconda lettera. Legenda in testa al file.

## 4. Aree
- **Navigazione principale**: `Device` mobile o app → bottom navigation, max 5 tab più "Altro" (account, notifiche, impostazioni). Desktop → menu principale, max 7 voci. Ogni tab ha nome e funzione in una parola.
- **Macro-area**: sezione dentro un tab. Area con una sola feature → accorpala. Tab con solo feature P3 → non è un tab: spostala in "Altro".
- **Trasversali**: aree usate da più tab (es. Emergenze, Scadenze). Fuori dai tab, segnate "(cross)".
- Ogni feature sta in una sola area. Se serve altrove compare come rimando nella nota, non duplicata nel conteggio.

## 5. File `03_Wireframe/architettura.md`

```
---
tipo: architettura
progetto: [nome]
versione: 1.0
aggiornato: AAAA-MM-GG
---
# Architettura — [Progetto]
[n] feature · [n] macro-aree · [n] personas · P1 [n] · P2 [n] · P3 [n]
Personas: PU = Pendolare Urbano (PER-01) · ...
Priorità: P1 Must have (MVP) · P2 Should have · P3 Fase 2
Importanza: Alta (3+ personas o journey principale) · Media (2) · Bassa (1)

## Tabella feature
### P1 – Must have
| ID | Feature | Area | Importanza | Personas | Requisiti | Nota |
### P2 – Should have
### P3 – Fase 2
(ordine nel gruppo: importanza decrescente)

## Architettura per aree
Navigazione principale · [bottom nav, n tab]
- Tab 1 · [Nome] — [funzione]
  - Macro-area [Nome]
    - FEA-01 [Feature] [P1] [PU, GF]
Altro: ...
Trasversali: ...

## Fuori perimetro
- [ID requisito] — [motivo]
```

## 6. Controlli prima del gate
- Ogni requisito coperto o fuori perimetro. Ogni feature ha almeno una persona. Ogni persona ha almeno una feature P1 (altrimenti dubbio). Nessuna area vuota. Tab entro il limite del device.
- Vincoli: un `VIN-` con gravità `blocca` collegato a una feature → dubbio nel gate. Non cambiare la priorità da soli.

## 7. GATE-SKILL (stop obbligatorio)
Scrivi `architettura.md` in un solo passaggio, poi scrivi solo:

```
**Architettura pronta** – [n] feature · [n] aree · P1 [n] · P2 [n] · P3 [n] → 03_Wireframe/architettura.md
**Aree** – Nome: [n] feature (P1 [n]) · ...  (max 10 righe)
**Dubbi** – max 5: priorità incerte, feature senza persona, persona senza P1, requisiti non coperti
**Serve** – ok esplicito / correzioni
```

Correzioni → aggiorna il file e ripresenta solo le differenze. Nessuno schema su Figma prima dell'ok.

## 8. Schema su Figma (dopo l'ok)
Una `use_figma` (leggi `figma-use` una volta per sessione; carica i font prima di creare testo). Scrive solo nella pagina `Wireframe`: frame `Architettura · [Progetto]`, a sinistra dei contenitori `WF · …` (x = −larghezza frame − 120). Se esiste, sostituiscilo. Non toccare altri frame.

- **Titolo**: «[Progetto] — Architettura Informativa» e riga con i contatori.
- **Legenda** (fascia): chip P1, P2, P3; «Opacità ridotta = Fase 2 / bassa priorità»; sigle delle personas.
- **Contenuto**: etichetta «Bottom navigation (n tab)» sopra le colonne, una colonna per tab nell'ordine di navigazione, poi la colonna "Altro" e quella delle trasversali.
- **Card**: intestazione area 143×36 (nome in grassetto, funzione in piccolo); card feature 143×62, gap 5: nome, chip priorità 24×16, chip personas 22×16 ciascuno. Macro-aree di uno stesso tab impilate nella colonna, ognuna con la sua intestazione.
- **Stile lo-fi** come i WF: grigi, raggio 8. Chip P1 nero con testo bianco, P2 grigio, P3 con solo contorno. Card P3 a opacità 50%.
- Controllo: uno screenshot, con immagine incorporata.

## 9. Dopo l'architettura
- Comando solo architettura → fermati con: "Architettura pronta. Per i wireframe: `Crea WF`."
- Con comando wireframe → prosegui dal passo 3 della skill: l'elenco pagine parte dalle aree di `architettura.md` (una pagina per step di journey, come sempre). Le feature P3 non diventano pagine, salvo richiesta.
