# Vincoli

Registro dei vincoli che non nascono dal design: tecnici (dev), di business, di marketing. Un vincolo cambia **come** si progetta. Un cambio di obiettivo, personas, device o scadenza è invece una modifica di perimetro: `Aggiorna`.

## File
`vincoli.md` nella radice del progetto. Lo scrive solo Design Ops. Lo leggono `dxs-wireframe`, `dxs-personas` (test del design) e Design Ops.

```
# Vincoli — [Progetto]

| ID | Fonte | Data | Versione | Vincolo | Gravità | Collegato a | Stato |
|---|---|---|---|---|---|---|---|
| VIN-01 | Dev | 2026-11-12 | v1.3.0 | Il refresh non deve spostare i contenuti (CLS) | limita | WF-02, FEA-05 | aperto |
```

- **ID:** `VIN-NN`, progressivo, mai riusato.
- **Versione:** quella a cui si riferisce l'informazione (come in `Annota`).
- **Gravità:** `blocca` (impedisce una pagina o feature così com'è), `limita` (cambia come si progetta), `nota` (informativo).
- **Collegato a:** ID di pagine `WF-`, feature `FEA-` o requisiti. `—` se non noto.
- **Stato:** `aperto` (da recepire), `recepito` (il design ne tiene conto), `superato` (non vale più).

## Registrare
`Annota [Fonte] vincolo [blocca|limita|nota]: <testo> [vX.Y] [su ID, ID]`

- Gravità mancante → `limita`. Fonte mancante → `n.d.`. Versione mancante → l'attuale.
- Collegamenti mancanti: se il testo cita il nome di una pagina di `pagine.md` o di una feature di `architettura.md`, proponilo in una riga ("Collegato a WF-02: ok?"). Altrimenti `—`.
- Conferma in una riga: "Registrato VIN-03 (limita) su WF-02."
- `blocca` → aggiungi in Aperto: "VIN-NN blocca [ID]: da valutare — Owner: [owner]". Se il vincolo cambia il perimetro, indica `Aggiorna`.
- Nessuna nuova versione: il registro non è un gate. Se il vincolo cambia una scelta, registrala a parte come Decisione.
- Dopo la scrittura aggiorna lo snapshot solo per `vincoli.md` e `project.md` (`scan.py --touch`, vedi `references/annota.md`).

## Aggiornare
- `Annota VIN-NN su WF-03, FEA-02` → aggiunge i collegamenti.
- `Annota VIN-NN recepito` o `superato` → cambia lo stato.
- Il testo di un vincolo non si modifica: se cambia, `superato` e nuovo `VIN-`. Mai cancellare righe.
- `recepito`: lo imposta Design Ops dopo HC2 per i `VIN-` che `dxs-wireframe` cita come recepiti.

## Chi lo legge
- **`dxs-wireframe`:** solo righe `aperto` o `recepito` con gravità `blocca` o `limita`. Le applica come scelte di layout e le cita nell'annotation e nel gate pagine.
- **`dxs-personas` (test):** un problema che nasce da un vincolo noto ha `Tipo` = `vincolo`, con il `VIN-NN`. Non si propone come correzione del wireframe.
- **Design Ops:** `Stato` mostra quanti vincoli `blocca` sono aperti.

## Esempi
- `Annota [Dev] vincolo: il refresh non deve spostare i contenuti (CLS) su WF-02` → `VIN-01`, `limita`, collegato a `WF-02`.
- `Annota [Business] vincolo blocca: niente prezzo in pagina per motivi legali, su v1.2` → `VIN-02`, `blocca`, e voce in Aperto.
- `Annota VIN-01 recepito` → stato `recepito`.
