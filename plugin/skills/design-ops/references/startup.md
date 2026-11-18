# Startup (comando `Avvia`)

Quando: comando `Avvia`, oppure `Procedi` con fase `avvio`. Non è un gate. Scopo: avere in un solo messaggio tutto ciò che serve per non fermarsi più avanti. Si chiede solo ciò che non si legge da file o da Planner.

## Già noto: non chiedere
- Da Planner (frontmatter): nome, testata/e, tipologia, owner, scadenza, priorità.
- Da file: cartella del progetto (ALERT A), brief (`ls 00_Input/`), librerie (`00_Input/libreria/`).

## Brief assente
Prima di tutto, una riga: "Metti il brief in `00_Input/` (file, non link) e scrivi 'fatto'." Senza brief fermati: non fare le altre domande.

## Domande
Un solo messaggio, rispondibile per numero. Ometti la 5 se la tipologia non è Evoluzione o Redesign e rinumera.

```
Avvio · [Progetto] · [Testata/e] · [Tipologia]
1. Figma del progetto (dal template, con la Wireframe library attiva): link  [dopo]
2. FigJam del progetto (dal template): link  [dopo]
3. Device: mobile · desktop · entrambi · app
4. Riferimento online: URL  [nessuno]
5. Design esistente: link Figma o file in 00_Input  [nessuno]
6. Referenti: PO / Marketing / Dev  [dopo]
7. Altro (heatmap, scrollmap, recording, ricerche, Product Snapshot, linee guida Dev): in 00_Input o link  [nessuno]
Rispondi per numero, es.: "1 <link> · 2 <link> · 3 entrambi · 4 nessuno · 6 dopo · 7 nessuno"
```

Regole sulle risposte:
- "dopo" → voce in Aperto con owner dal frontmatter ("Creare il file Figma dal template", "Duplicare il template FigJam", "Indicare i referenti").
- "nessuno" → `—` in project.md. Blender segnalerà la lacuna.
- Domanda senza risposta → trattala come "dopo", non richiederla. Device senza risposta → entrambi, segnalato.

## Dopo le risposte
1. Scrivi (le risposte dell'utente sono autorizzazione): Link (Figma WF, FigJam, Riferimento online, Design esistente, Product Snapshot se indicato), Contesto (Device, Referenti), Aperto.
2. Controlli: `Figma WF` deve essere `figma.com/design/<fileKey>`; board o Make → "non va bene: serve un file Design". `FigJam` deve essere `figma.com/board/<fileKey>`; altro formato → segnala (template in `references/figjam.md`). la Wireframe library attiva: ricordalo in una riga, da qui non è verificabile.
3. Cover Figma: con `Figma WF` valido, compilala come da `references/figma-cover.md`.
4. Snapshot iniziale: `python3 scripts/scan.py <progetto> --update`.
5. Changelog: patch, tipo "Correzione", "Materiali di avvio registrati (Design Ops v1.0.3)", link nell'esito. Imposta `fase: benchmark` (era `avvio`).
6. Chiudi con: "Avvio completato. Scrivi `Procedi` per lo step 1 (Benchmark). Se vuoi, compilo anche il Read Me e rinomino le pagine del file Figma: scrivi 'Read Me'."
