# handoff.md – formato e regole

Leggi prima di scrivere `05_Handoff/handoff.md`. Stile Blender: titoli e liste, una voce per riga, ID ovunque. Il blocco `handoff` è l'unica fonte per gli script; le liste sopra servono al designer e vanno tenute allineate.

## Template

````markdown
# Handoff – [Progetto]
Versione [N] – [data] · WF: pagine.md v[N] · Validazione: 04_Validazione/test-[data].md
Figma Flow: [link FigJam]

## Casi
### C1 – Abbonamento da paywall (J1 · PER-01)
1. WF-01 Articolo · tocca «Abbonati» → WF-02 Checkout
2. WF-02 Checkout · tocca «Paga» → WF-03 Thank you · loader sul bottone
3. WF-03 Thank you · tocca «Vai al sito» → WF-01 abbonato · toast «Benvenuto» 3 s in alto, con X

### C2 – Pagamento rifiutato (J1 · PER-02)
1. …

## Aperti
- WF-02: stato loader non definito nei WF

```handoff
{"azioni":[
  {"da":"WF-01","el":"Abbonati","tap":"WF-02"},
  {"da":"WF-02","el":"Paga","tap":"WF-03","fb":"Loader sul bottone fino alla risposta"},
  {"da":"WF-02","el":"Paga","tap":"WF-02:errore","nota":"pagamento rifiutato"},
  {"da":"WF-03","el":"Vai al sito","tap":"WF-01:abbonato","stato":"paywall rimosso","fb":"Toast «Benvenuto» 3 s in alto, con X"}],
 "casi":[{"id":"C1","nome":"Abbonamento da paywall","journey":"J1","personas":["PER-01"],"passi":["WF-01","WF-02","WF-03","WF-01:abbonato"]}],
 "aperti":["WF-02: stato loader non definito nei WF"]}
```
````

## Azioni

- `da`: pagina `WF-xx`. `var`: variante sorgente (default `base`, `*` = tutte).
- `el`: testo **esatto** dell'elemento come in `pagine.md` (bottone, link, card, tab, chip, campo). Prendilo da `handoff.py inventario`, mai riscritto.
- `tap`: `WF-xx` o `WF-xx:variante` · `back` · `ext:https://…` · `none` (azione senza navigazione: toggle, check).
- `stato`: cosa cambia nella UI all'arrivo (attivo/disattivo, etichette, check). `fb`: feedback con testo, posizione, durata, chiusura. `nota`: condizione ("pagamento rifiutato").
- Stesso elemento con più esiti → più azioni. Il primo è il percorso principale; gli altri finiscono nella stessa annotation come "Oppure".

## Casi (dai journey di `personas-journey.md`)

- Per ogni journey: percorso principale, alternativi (errore, rifiuto, abbandono), azione ripetuta (già fatta), punto di partenza diverso (stessa azione da un'altra pagina).
- `passi`: frame in ordine; ogni coppia consecutiva deve avere un'azione. Varianti di stato (`WF-02:errore`) sono passi a sé.
- Un caso ha senso solo se cambia ciò che vede l'utente. Niente casi duplicati per persona se la UI è la stessa.

## Regole

- Stato o feedback non definito nei WF o nei requisiti → riga in `aperti`, mai inventato in silenzio.
- Testi di feedback: dai requisiti o dal report di validazione; se proposti da Claude, segnali con "(proposta)".
- Requisiti nuovi emersi → input per `magic-blender`, non decisioni dell'handoff.
