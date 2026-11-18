# Template – Protopersona

Le protopersona usano gli **stessi campi delle schede Corriere** (board "Personas 2025"), così sono confrontabili con le personas reali e si possono riportare su Figma senza conversioni.

Ogni campo porta l'origine: `[ricerca: <file>]`, `[brief]` o `[assunzione]`. Preferisci sempre un dato di ricerca a un'assunzione.

```markdown
## <ID> · <Nome> – PROTOPERSONA
> PROTOPERSONA – da validare con ricerca
> Derivata da Personas DXS: "<citazione della descrizione>"
> Fonti di ricerca: <elenco file | nessuna>
> Progetto di origine: <nome> · Creata il: <data> · Validata dall'utente il: <data>
> Scheda Figma: <link, aggiunto dopo la creazione>

### Scheda
**Dati:** <Genere> · <età> · <occupazione> [origine]
**Etichetta:** <es. "Il pendolare delle 7:40">
**Citazione:** "<frase sul suo rapporto con l'informazione>" [origine]
**Bio:** <2-3 frasi> [origine]

**Dimensioni:** Spesa per abbonamenti <1-5> · Modalità di fruizione <1-5> · Ritmo lavorativo <1-5> · Interesse per la notizia <1-5>

**Abitudini di fruizione**
- <quando, dove, device, canali, rapporto con la testata> [origine]

**Motivazioni**
- … [origine]

**Bisogni e obiettivi**
- … [origine]

**Frustrazioni**
- … [origine]

**Bisogni informativi:** <connect me / update me / …> · <tipo di notizie> · <come usa la homepage> [origine]

**Insight chiave:** <2-3 insight di ricerca che più l'hanno definita, con fonte; omettere se nessuna ricerca>

**Assunzioni (da verificare):**
- <ogni elemento non presente né in Personas DXS né nella ricerca>
```

Si salva in `protopersonas.md` (stessa struttura di `personas.md`). ID: `<sigla testata>-PP<nn>` (es. `COR-PP01`, `GAZ-PP01`), progressivo nella sezione della testata. Il prefisso `PP` distingue le protopersona dalle personas reali anche nei riferimenti di `personaggi-del-progetto.md`.

Dopo la validazione, in fondo al blocco va aggiunto il `### Personaggio critico` secondo `fase1-modello-personaggio-critico.md`, come nei profili di `personas.md`.

## Come differenziare due protopersona

Scegli un asse su cui sono opposte, coerente con la descrizione e con gli insight. Esempi:
- familiarità digitale bassa vs alta
- lettura veloce da mobile vs approfondimento da desktop
- abbonato fedele vs lettore occasionale che non vuole pagare
- ingresso dalla home vs ingresso da un link social direttamente sull'articolo

Indica l'asse scelto in una riga sopra le protopersona.
