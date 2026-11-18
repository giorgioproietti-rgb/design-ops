# Schede protopersona su Figma

Da eseguire **solo dopo** che l'utente ha validato le protopersona e indicato quali usare (passo 1.4c). Si crea una scheda per ogni protopersona scelta, nessuna per quelle scartate.

Destinazione: FigJam del progetto (voce `FigJam` di `project.md`, formato `figma.com/board/<fileKey>/…`), pagina **Personas**. fileKey = quello del link. La pagina si trova per nome, non per id. Voce assente → chiedi il link una volta (Design Ops lo chiede già con `Avvia`).

## Prerequisiti (obbligatori per use_figma)

1. Leggi le skill `figma:figma-use` e `figma:figma-use-figjam` (solo il SKILL.md: lo script è già pronto, non servono i riferimenti di dettaglio).
2. Carica gli schemi dei tool Figma con una sola ricerca (`use_figma`, `get_figjam`, `get_screenshot`).
3. Nella chiamata a `use_figma` passa `skillNames: "figma-use,figma-use-figjam"`.

## Procedura

1. **Prepara i dati** nel formato sotto, uno per protopersona scelta, con gli stessi contenuti salvati in `protopersonas.md`.
2. **Esegui lo script** `scripts/crea-schede-protopersona-figma.js`: leggilo, sostituisci `__DATA__` con l'oggetto JSON e passalo a `use_figma` (fileKey sopra). Lo script:
   - apre la pagina Personas (per nome)
   - crea un frame con il **nome del progetto** a destra dei contenuti esistenti (se il nome esiste già, aggiunge la data: non tocca mai i frame esistenti)
   - dentro il frame crea una scheda per protopersona, **senza foto**, con la struttura delle schede Corriere: colonna identità (badge "PROTOPERSONA – da validare", nome, citazione, dati), colonna Bio e Abitudini, colonna con Dimensioni (4 barre), Motivazioni, Bisogni e obiettivi, Frustrazioni, Bisogni informativi, più fonti e assunzioni
   - restituisce l'id del frame e delle schede
3. **Verifica una volta** con `get_screenshot` sull'id del frame (`maxDimension` 1024 basta). Correggi solo se qualcosa è illeggibile o sovrapposto, poi fermati.
4. **Registra il link**: nel blocco di ogni protopersona in `protopersonas.md` aggiungi la riga `Scheda Figma: <link `FigJam` di project.md, senza node-id>?node-id=<frameId con - al posto di :>`. Dai lo stesso link all'utente.

Se `use_figma` restituisce un errore, segui `safeToRetryWithoutCanvasRead`: se è `false`, controlla la pagina con `get_figjam` prima di riprovare, per non creare frame doppi.

## Formato dei dati

```json
{
  "progetto": "Nome progetto da project.md",
  "testata": "Corriere",
  "data": "2026-10-22",
  "personasDXS": "descrizione da project.md",
  "personas": [
    {
      "id": "COR-PP01",
      "nome": "Nome Cognome-aggettivo",
      "etichetta": "Il pendolare delle 7:40",
      "genere": "Donna",
      "eta": "34 anni",
      "occupazione": "Consulente",
      "citazione": "frase che riassume il rapporto con l'informazione",
      "bio": "2-3 frasi",
      "dimensioni": { "spesa": 2, "fruizione": 3, "ritmo": 4, "interesse": 3 },
      "abitudini": ["…", "…"],
      "motivazioni": ["…"],
      "bisogni": ["…"],
      "frustrazioni": ["…"],
      "bisogniInformativi": ["connect me / update me", "tipo di notizie: …"],
      "fonti": ["ricerche/report-2025.pdf"],
      "assunzioni": ["…"]
    }
  ]
}
```

Dimensioni su scala 1–5 (1 = estremo sinistro: assente / passiva / variabile / personale; 5 = estremo destro: continuativa / attiva / routiniero / civico). Nelle schede Figma i tag di origine `[ricerca]`, `[brief]`, `[assunzione]` non vanno riportati: restano in `protopersonas.md`; su Figma le fonti e le assunzioni stanno in fondo alla scheda.
