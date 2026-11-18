---
name: dxs-handoff
description: Passaggio alla UI (da wireframe validati a UI), dopo il gate "Wireframe validato". Dai wireframe validati (03_Wireframe/pagine.md) e dai journey propone azioni e casi del flusso, li fa confermare al designer e prepara il passaggio alla UI come documentazione - casi e azioni in 05_Handoff/handoff.md, annotation di interazione sugli elementi dei frame Figma (Dev Mode), user flow in FigJam. Non crea prototipi. Usa SEMPRE questa skill quando l'utente scrive "Handoff", "Prepara handoff", "Passa alla UI", chiede le annotazioni di interazione, lo user flow o "cosa succede se clicco" su un progetto DXS, o quando design-ops è in fase handoff, anche se non nomina la skill.
---

# DXS Handoff – dai WF validati alla fase UI

Destinatario: il designer UI in Figma. Obiettivo: documentazione e schema razionale del flusso, non un prototipo. Una sola fonte: `05_Handoff/handoff.md`. Da lì gli script generano annotation e user flow: Claude ragiona solo su casi e azioni.

## Stile

Come magic-blender: risposta prima, bullet, max 20 parole, mai togliere ID, testi esatti, path.

## Comandi

- `Handoff` · `Prepara handoff` · `Passa alla UI`: documento + annotation + user flow.
- Flag per farne solo una: `--note` (annotation), `--flow` (FigJam). Il documento si scrive sempre.
- Richiesta di prototipo → una riga: fuori dallo scopo della skill, l'handoff è documentale.
- Rilancio dopo una revisione dei WF → aggiornamento: solo azioni e casi toccati, uscite rigenerate. I frame rigenerati da dxs-wireframe perdono le annotation `Tap`: rilancia `--note`. I frame protetti (ritoccati a mano) le mantengono.

## Mappa file

- Legge: `project.md` (fileKey Figma, `Figma Flow` se esiste), `03_Wireframe/pagine.md` (via script), `01_Blender/personas-journey.md` (solo journey e step), ultimo report in `04_Validazione/` (solo problemi su interazioni e feedback).
- Scrive: `05_Handoff/handoff.md`; su Figma solo annotation sugli elementi della pagina `Wireframe`; un FigJam.
- Mai: `project.md` (Design Ops), frame della pagina `Wireframe` diversi dalle annotation degli elementi.

## 1 – Precondizioni

- Gate "Wireframe validato" spuntato. Lanciata da Design Ops senza gate → fermati. Da sola → prosegui con avviso in una riga.
- `03_Wireframe/pagine.md` e il link Figma del progetto. Mancano → chiedi e fermati.

## 2 – Inventario (zero lettura di file grandi)

- `python3 scripts/handoff.py inventario 03_Wireframe/pagine.md` → pagine, varianti, device, "naviga a", elementi interattivi con testo esatto.
- Dai journey: solo titoli degli step e stati (errore, rifiuto, abbandono). Dal report: solo i `VAL-` su flusso, feedback e stati.

## 3 – GATE-SKILL: proposta (stop obbligatorio)

Leggi `references/handoff-spec.md`. Proponi in chat, niente file, niente Figma:

```
**Casi** – [n]: C1 nome (J1 · PER) · C2 …
**Azioni** – [n]
- WF-01 «Abbonati» → WF-02 · feedback · stato
- WF-02 «Paga» → WF-03 | oppure WF-02:errore (pagamento rifiutato)
**Aperti** – stati/feedback non definiti nei WF (non inventati)
**Proposte** – testi di feedback suggeriti da Claude, marcati (proposta)
**Serve** – ok / correzioni
```

- Copri per ogni journey: percorso principale, alternativi, azione ripetuta, partenza da un altro punto.
- Testi `el` solo dall'inventario. Elemento che manca nei WF → riga in Aperti ("serve CTA in WF-03"), non un'azione.
- Correzioni → ripresenta solo le differenze. Nessuna scrittura prima del sì.

## 4 – Scrittura e controllo

1. Scrivi `05_Handoff/handoff.md` (template in `references/handoff-spec.md`): casi in chiaro + blocco `handoff`.
2. `python3 scripts/handoff.py check 03_Wireframe/pagine.md 05_Handoff/handoff.md`
   - ERRORE → correggi e rilancia, senza chiedere.
   - AVVISO (pagina irraggiungibile, vicolo cieco, testo non trovato) e APERTO → riportali in HC.

## 5 – Annotation su Figma (`--note`)

1. Leggi `skill figma-use` una volta per sessione, se disponibile.
2. `python3 scripts/handoff.py payload 03_Wireframe/pagine.md 05_Handoff/handoff.md [--device m|d]` → una `use_figma` sul fileKey del progetto. Non modificare il payload.
3. Lo script: annotation `**Tap «…»** → destinazione · Cambia · Feedback · Nota · Casi` sull'elemento (bottone, card, campo) nei frame originali, anche dentro i contenitori `WF · Mobile/Desktop`. Si aggiungono alle annotation di pagina del passo 5b di dxs-wireframe, che restano. Più esiti dello stesso elemento → una annotation con "Oppure". Rilancio → sostituisce solo le annotation `Tap`, le altre restano.
4. `warnings` (elemento non trovato, testo duplicato, frame mancante) → correggi `handoff.md` se è un refuso, altrimenti riporta. Max 2 tentativi, poi decisione umana.
5. Nessuno screenshot: la verifica è nel conteggio delle annotation restituito.

## 6 – User flow FigJam (`--flow`)

1. Leggi la skill `figma-generate-diagram` e il suo `references/flowchart.md` (obbligatorio prima di `generate_diagram`).
2. `python3 scripts/handoff.py mermaid 03_Wireframe/pagine.md 05_Handoff/handoff.md` → sorgente già conforme (ID camelCase, etichette tra virgolette, niente HTML o emoji).
3. `generate_diagram` con quel sorgente. Se `project.md` ha già `Figma Flow` → stesso fileKey, sostituisci il diagramma precedente (vedi skill). Altrimenti nuovo FigJam.

## 7 – HC (chiusura)

Aggiorna versione, data e link in `handoff.md`. Poi scrivi solo:

```
**HC – Handoff pronto per la UI**
**Documento** – 05_Handoff/handoff.md v[N]
**Figma Flow** – [link FigJam]  (per Design Ops → project.md)
**Annotation** – [n] elementi su [n] frame
**Casi** – [n] · azioni [n]
**Aperti** – [n]: elenco breve
**Prossimo** – fase UI
```

Max 12 righe.

## Regole

- Mai inventare stati, feedback o elementi: vanno in Aperti o, se proposti, marcati (proposta) e confermati al gate.
- Requisiti nuovi emersi → input per `magic-blender`.
- Niente prototipi né pagine aggiuntive su Figma: l'handoff è documentazione + annotation + user flow.
