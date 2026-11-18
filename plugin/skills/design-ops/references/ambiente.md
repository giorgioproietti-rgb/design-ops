# Ambiente: cartelle sincronizzate

Claude non legge SharePoint: lavora solo su cartelle presenti sul computer (sincronizzate con OneDrive) e concesse alla sessione. Verifica una volta per sessione, prima di ogni step. Non cercare altrove né su tutto il disco.

## Cartelle

| Cartella | Link | Serve a |
|---|---|---|
| Progetti UX (una sottocartella per progetto, dentro la testata) | https://rcsmediagroup.sharepoint.com/:f:/s/UXUITeam121/IgDrfaA80Ce0TZ_PnNQYcGRaAfQ76FJz66fO6Y3BpwFs5J0?e=60wNLG | `project.md` e output degli step |
| Ricerca (ricerche divise per testata; origine: Research Repository su SharePoint) | https://rcsmediagroup.sharepoint.com/:f:/s/UXUITeam121/IgDGVoP2bZfQS5Gqnp82tRHRAbO2vnvxcL6riVOO9DSNGR0?e=yU49ZI | ricerche per Blender e Personas |
| Papers (documenti esterni, dispense, ricerche dal web) | https://rcsmediagroup.sharepoint.com/:f:/s/UXUITeam121/IgDsN7ZC74gNSI3IfE8rGzjMAVqIdWi001POwpcpNfe4gkQ?e=A7UWYy | supporto a Blender: principi, personas, benchmark |

## Verifica

1. **Progetti.** `project.md` raggiungibile: cartella corrente, sottocartelle fino a 3 livelli, cartelle superiori. Nessuno → ALERT A e fermati.
2. **Ricerca** (solo prima degli step 1 e 2). Cerca la cartella `Ricerca` collegata al Project (o tra le cartelle accessibili alla sessione).
   - Trovata → ricerche = `Ricerca/<Testata>/` (multi-testata: una per testata), in sola lettura. Non copiare i file nel progetto. Nessuna sottocartella per la testata → chiedi quale usare.
   - Non trovata → ALERT B e prosegui con `00_Input/ricerca/`.
3. **Papers** (solo prima dello step 1). Cerca la cartella `Papers` tra quelle accessibili alla sessione.
   - Trovata → sola lettura; la usa Blender (skill `magic-blender`, file `papers.md` in `references`).
   - Non trovata → ALERT B e prosegui senza.
4. **Figma** (prima di Cover, FigJam e wireframe): gli strumenti Figma devono essere disponibili nella sessione. Non disponibili → ALERT C e prosegui senza.

## ALERT A (blocca)

```
⚠ Cartella del progetto non trovata (nessun project.md).
1. Se non è sul computer: apri "Progetti UX" (link sopra) → Sincronizza (o "Aggiungi collegamento a OneDrive").
2. Nel Project collega solo la cartella di questo progetto (menu +).
3. Apri una nuova sessione e scrivi "procedi".
Sincronizzazione bloccata dalle policy? Scarica la cartella del progetto dal browser, aprila qui e a fine step ricarica i file modificati.
```

Mostra il link di "Progetti UX" in chiaro.

## ALERT B (non blocca)

```
⚠ Non collegata al Project: [Ricerca] [Papers]. Procedo senza.
Collegala dal menu + (aggiungi cartella). Se non è sul computer, sincronizzala dal link sopra.
Per Ricerca, in alternativa, copia i file pertinenti in 00_Input/ricerca/.
```

Elenca solo le cartelle mancanti e mostra il loro link in chiaro.

## ALERT C (non blocca)

```
⚠ Connettore Figma non attivo in questa sessione.
Cover, FigJam e wireframe non sono disponibili: gli step 1 e 2 proseguono senza pubblicazione su Figma.
Attiva il connettore Figma nel Project e rilancia il comando.
```
