# Perimetro e sessioni

## Perimetro (rigido)

1. Scritture solo dentro la cartella del progetto (compresi `storico.md` e `_stato.json`, gestiti da Design Ops). `Ricerca`, `Papers` e `00_Input/libreria/` sono in sola lettura: mai modificare né aggiungere.
2. Proposte alle librerie (protopersona nuove, correzioni a personas) → `02_Personas/proposte-libreria.md`. Le promuove una persona.
3. Mai cancellare. Mai sovrascrivere un output esistente senza ok esplicito: aggiornamento dichiarato o nuova versione con suffisso `-v2`.
4. Mai leggere o toccare altri progetti. Più `project.md` raggiungibili, o percorso fuori dal progetto → fermati e segnala: il Project è collegato male.
5. Figma: si scrive solo nel FigJam del progetto (frame `[auto]` nelle pagine Cover, User-Flow, Personas, Benchmark), nella pagina Wireframe del file di design, nei due testi della pagina Cover, nei testi guida del Read Me, nei nomi delle pagine con "Nome progetto" e, per `dxs-handoff`, nelle annotation `Tap` degli elementi della pagina Wireframe e in un FigJam di user flow. Le board condivise (es. Personas 2025) sono in sola lettura.
6. Nessun lock in v1: un owner per progetto. Se due persone devono lavorare sullo stesso step, lo concordano fuori da Claude. Il controllo modifiche segnala comunque ciò che cambia nella cartella.

## Sessioni

Una sessione per step, con eccezioni:

| Passaggio | Sessione |
|---|---|
| Blender → Personas | nuova |
| Personas → Wireframe | nuova |
| Architettura → pagine → render (stesso step) | stessa |
| Wireframe → Validazione | nuova, obbligatoria (valutatore indipendente) |
| Validazione → Revisione WF | nuova |
| Validazione → Handoff | nuova |
| Correzioni dopo un HC, stesso step | stessa |

Perché: contesto piccolo, chi valuta non deve aver visto come è stato costruito, ogni sessione riparte da file noti.

## Prima di chiudere uno step

Controlla se l'utente ha dato indicazioni a voce non ancora scritte (decisioni, vincoli, correzioni). Ogni indicazione ancora valida va in "Aperto" o come "Decisione" nel changelog: la sessione successiva parte solo dai file.

Titolo di sessione suggerito: "[Progetto] · Step N Nome".
