# pagine.md – template e catalogo blocchi

Leggi prima di scrivere il primo blocco `wf`. Stesse regole di Blender: solo titoli e liste, una voce per riga, ID ovunque.

## Template

````markdown
# Pagine – [Progetto]
Versione [N] – [data] · Modalità: [creazione | revisione | aggiornamento]
Device: [m, d] (fonte: project.md "Device" | default)
Testata: [Corriere] · ADV: [no | sì] · Figma WF: [link pagina Wireframe]

## Journey 1 – [Nome] (da personas-journey.md)
### WF-01 – [Nome pagina]
- Requisiti: ONB-01, ONB-CLUB-01, ONB-CLUB-02
- Personas: PER-01, PER-02
- Varianti: base; PER-02 (ONB-CLUB-02: card Club nascosta)
- Stati: default; errore (ONB-CLUB-03)
- Device: m, d
- Naviga a: WF-02
- Revisioni auto: 0/2 · Manuale: no
```wf
{"id":"WF-01","area":"ONB-CLUB","nome":"Thank you page","template":"Default","devices":["m","d"],
 "req":["ONB-01","ONB-CLUB-01","ONB-CLUB-02"],"personas":["PER-01","PER-02"],"nav":["WF-02"],"footer":true,
 "blocks":[["h1","Grazie!"],["text",2],
   ["row",[["card",{"title":"Club","img":true,"lines":2,"cta":"Scopri"}],["card",{"title":"App","lines":2,"cta":"Scarica"}]]],
   ["btn","Vai al sito"]],
 "varianti":{"PER-02":{"del":[2],"req":["ONB-CLUB-02"]},
             "errore":{"set":{"0":["h1","Pagamento non riuscito"]},"add":[[0,["banner","Riprova",2]]],"req":["ONB-CLUB-03"]}}}
```

## Fuori perimetro
- ONB-DATI-01 – dato di tracciamento, nessuna UI
````

## Regole

- `Revisioni auto`: contatore **per pagina**, max 2. `Manuale: sì` → la pagina non si rigenera: Figma è la fonte. Si imposta quando un frame risulta ritoccato a mano o su richiesta del designer.
- Una pagina = un blocco `wf`. Gli elenchi sopra il blocco servono al designer, il JSON allo script: tienili allineati.
- `area`: prefisso del requisito di step (`ONB-CLUB`). Il nome frame inizia con l'area, così Blender trova le schermate con una ricerca per prefisso.
- Nome frame (lo genera lo script): `AREA · Pagina · variante · M|D`. Mai rinominare a mano: l'upsert si basa sul nome.
- `req`: tutti gli ID coperti dalla pagina base. `varianti.X.req`: ID in più coperti solo dalla variante.
- Variante solo se cambia cosa vede l'utente (visibilità per persona, stato, errore). Stessa UI per più personas → un frame, personas in annotation.
- Varianti = patch sul base, non copie: `set` sostituisce l'indice, `del` rimuove, `add` inserisce dopo l'indice (`-1` = in testa). Indici del base, livello superiore.
- `template`: tipo di pagina (`HomePage`, `Articolo`, `Default`), mappato sulle varianti `WF/Page` (Device × Header × Colonne): HomePage = Header Homepage + 2 colonne; Articolo = Header Sezione + 2 colonne; Default = Header Sezione + 1 colonna. `Default` = pagina base per tutto ciò che non è homepage o articolo (funnel, checkout, registrazione, conferme, servizi). Se non indicato: `Default`. Header, footer e griglia vengono dal template. Su mobile c'è sempre 1 colonna.
- Slot: `blocks` → `Contenuto`. Opzionali: `"aside": false | [blocchi]` (solo desktop: `false` passa alla variante a 1 colonna; una lista su `Default` passa alla variante a 2 colonne), `"preFooter": false | [blocchi]`, `"top": [blocchi]`. Assenti → regole ADV della testata (solo con `--ADV`). Slot vuoti (Aside senza blocchi su 2 colonne resta come area vuota; PreFooter senza blocchi) → PreFooter rimosso. Il template non contiene ADV: arrivano solo dal payload.
- ADV solo con il comando `--ADV` (riga `ADV: sì`). In quel caso `"adv": false` disattiva l'inserimento automatico; `"taboola": false` toglie Taboola (es. Salute). Valgono anche dentro una variante.
- Moduli = blocchi di primo livello di `blocks`: l'ADV "dopo il modulo n°" conta quelli (o solo i `text`, se la regola lo dice).
- Desktop non va descritto a parte: `row` affianca su `d`, impila su `m`. Struttura diversa per device → due pagine `WF` con `devices` distinti.
- Testo reale solo in titoli, label, bottoni, tab, chip. Il resto è `text` (barre `WF/Text block`).

## Catalogo blocchi `[tipo, a, c]`

- `["h1", "Titolo"]` · `["h2", "Sottotitolo"]` · `["label", "Etichetta"]`
- `["text", 3]` – 3 righe di testo come barre
- `["img", "16:9"]` – crossbox a tutta larghezza, ratio libero
- `["avatar", 48]` – cerchio con croce
- `["btn", "Testo", "primary|secondary|link"]` – su mobile a tutta larghezza
- `["input", "Email"]` · `["textarea", "Messaggio"]` · `["select", "Paese"]` – campo vuoto, label sopra
- `["check", "Testo"]` · `["radio", "Testo"]` · `["toggle", "Testo"]`
- `["tabs", ["A", "B"]]` – prima tab attiva · `["chips", ["A", "B"]]`
- `["card", {"title", "img": true|"4:3", "lines", "cta", "ctaKind"}]`
- `["list", {"n": 3, "lines": 2, "img": false, "avatar": true, "divider": true}]` o `["list", 3]`
- `["banner", "Messaggio", 2]` – box messaggio/errore con 2 righe
- `["modal", "Titolo", [blocchi]]` – dialog in pagina
- `["row", [blocchi], 3]` – colonne su desktop (3 = colonne, default n blocchi), impilato su mobile
- `["section", "Titolo", [blocchi]]` – gruppo con titolo opzionale
- `["divider"]` · `["space", 48]`
- `["adv", "Frame 1"]` – componente DXS `ADV_item` (Desk/Mobile per device); nomi in `varianti` del JSON della testata
- `["advbox", "Ticker", 300, 100]` – formato ADV senza componente: box tratteggiato con etichetta
- `["ed", "Contenuto editoriale", 200]` – area editoriale grigia con etichetta (colonna dx, box mkt)
- `["sticky", 1000]` – spazio di scorrimento della colonna dx

Manca un blocco → composizione con quelli esistenti. Mai codice Figma ad hoc dentro `pagine.md`.
