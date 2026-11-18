---
name: "dxs-adv-placement"
description: Regole di posizionamento ADV per testata (homepage, articolo, altre pagine, desktop e mobile) con mappatura sui componenti ADV_item. Fornisce a dxs-wireframe le regole in formato eseguibile (placements/TESTATA.json) e risponde su posizioni, formati, sticky e preallocamento. Usa SEMPRE questa skill per chiedere dove vanno gli ADV, quali formati ha una pagina (Topleft, Frame1, Bottom, Taboola, Native strip), verificare l'ADV di un wireframe o registrare un nuovo documento di placement.
---

# DXS ADV placement – regole pubblicitarie per i wireframe

Fonte unica delle regole ADV del flusso. Non disegna: fornisce dati a `dxs-wireframe` e risposte al designer.

## Stile

Come magic-blender: risposta prima, bullet, max 20 parole, mai togliere numeri, formati, nomi posizione.

## File

- `placements/<testata>.json`: eseguibile. Per ogni `PageType/D|M`: `top` (sopra il contenuto), `aside` (colonna dx, solo desktop), `inline` (dopo il modulo n° di `_Content`), `preFooter`. Blocchi nel formato di `dxs-wireframe` (`adv`, `advbox`, `ed`, `sticky`).
- `references/<testata>.md`: regole complete in chiaro. Leggi solo la sezione della pagina richiesta.
- Testate disponibili: Corriere.

## Uso da dxs-wireframe

- Solo quando l'utente lancia il wireframe con `--ADV`. Non leggere il `.md`: passa il JSON a `build_payload.py --adv <percorso>/placements/<testata>.json`.
- `mancante: true` → nessun ADV automatico, avviso nel gate.
- Regole non automatizzate (fascioni HP, video player redazionale) → nel `.md`, da comporre a mano con blocchi `adv`.

## Domande del designer

- Leggi la sezione della pagina nel `.md`, rispondi con posizione, formato, condizione.
- Verifica su un wireframe Figma: leggi solo nomi e altezze dei frame (`get_metadata`), confronta con il JSON, segnala ADV mancanti, ordine errato, condizione sticky (sx − dx ≥ 1000 px) non rispettata.

## Nuovo documento di placement

1. PDF lunghi: estrai il testo pagina per pagina e salta i "visual to be" ripetuti.
2. Aggiorna il `.md` della testata, sezione per pagina, stesso formato.
3. Aggiorna il JSON. Ogni `adv` deve usare un nome in `varianti` (componenti DXS); formato senza variante → `advbox` con etichetta e misure.
4. Valida: `python3 scripts/validate.py placements/<testata>.json`.
5. Conflitto con le regole esistenti → chiedi quale vale, non sovrascrivere.

## Regole

- Mai inventare posizioni o formati: solo dai documenti RCS Pubblicità o da indicazione esplicita.
- Una regola nuova va sempre in entrambi i file.
- Le regole valgono per testata: mai applicare quelle Corriere a un'altra testata.
