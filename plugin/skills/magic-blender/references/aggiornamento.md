# Aggiornamento – verifica di coerenza

Obiettivo: nessuna modifica entra senza vedere cosa rompe tra requisiti e design.

## Input necessari

- Chiedi solo i file che servono all'input: sempre `Blender.md`, `personas-journey.md`, `registro-input.md`, `registro-coerenza.md`.
- `insight.md`, `benchmark.md`, `principi.md`, `domande.md` solo se l'input li tocca.
- File mancante → procedi, segnala in una riga.

## Passi

0. Stati `[nuovo]`/`[modificato]` → `[confermato]` (ciclo di vita in `template.md`).
1. Registra l'input in `registro-input.md`.
2. Scomponi l'input: un requisito = una regola. Trascrizioni: solo il deciso; il resto → `domande.md`.
3. Ricerca o benchmark nuovi → prima `insight.md` / `benchmark.md`. Poi verifica se rafforzano, indeboliscono o smentiscono `PRIN-` e `SUG-` collegati.
4. Confronta ogni requisito con lista e design (Figma, sola lettura, solo schermate interessate). Classifica:
   - **Conferma** → aggiorna solo la fonte.
   - **Estende** → nuovo ID `[nuovo]`.
   - **Modifica** dichiarata → forma: `[modificato]`; regola: nuovo ID + `[sostituito da ID]`.
   - **Contraddice** → passo 5.
   - **Duplica** → non aggiungere, cita l'ID esistente.
5. Contraddizioni: mai scegliere in silenzio.
   - Prima verifica: è un'eccezione alla regola? Allora è un'estensione.
   - Mostra le due versioni con fonte e data.
   - Indica quale prevale e perché (recenza, decisione esplicita, autorità). Dichiara se è un tuo giudizio.
   - Proponi risoluzione e impatto sul design.
   - Autorità incerta o impatto rilevante → **GATE**: chiedi all'utente prima di scrivere.
   - Finché aperta: entrambi `[in conflitto con ID]`, nulla cancellato.
6. Effetti indiretti: matrici incomplete, numerazione stepper, varianti di schermata.
7. Aggiorna i file toccati + `registro-coerenza.md` (modifiche, conflitti, impatto sul design, anche "già coerente").
8. `Blender.md` → aggiorna solo Status, Link, Versione se cambiano.

## Risposta

Formato "Risposta finale" di `SKILL.md`. Aggiungi "Schermate da rivedere" se ci sono, max 5 bullet.
