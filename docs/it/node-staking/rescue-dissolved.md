# Recuperare un Minipool Dissolto

Nel caso improbabile che il tuo minipool non faccia staking entro la finestra di dissoluzione, verrà "dissolto" dall'oDAO e i fondi degli utenti forniti saranno restituiti al deposit pool per essere utilizzati da un altro minipool. In questo scenario, dovrai eseguire il processo descritto di seguito per recuperare il tuo ETH e sbloccare il tuo RPL da unstakare.

## Aggiorna il tuo Minipool Delegate

È altamente raccomandato utilizzare l'ultimo minipool delegate quando esegui questo processo. I delegate più vecchi contengono un'operazione `selfdestruct` quando vengono chiusi, il che significa che se il processo non viene completato correttamente nell'ordine specificato, i fondi potrebbero essere bloccati per sempre. Puoi verificare che il tuo minipool sia sull'ultimo delegate tentando di [Aggiornare il tuo Delegate](./minipools/delegates#upgrading-your-delegate). Se il tuo minipool non appare nell'elenco dei minipool che possono essere aggiornati, puoi continuare qui sotto.

## Recupera il Saldo del Deposito Inutilizzato

::: tip NOTA
Se il tuo minipool è stato dissolto prima di Atlas, puoi saltare questo passaggio e andare direttamente a [Aumenta il Saldo della Beaconchain a 32 ETH](#increase-your-beaconchain-balance-to-32-eth).
Non è necessario recuperare il saldo del deposito inutilizzato perché l'intero importo del bond è stato depositato sulla beaconchain prima di Atlas.
:::

1 ETH dal tuo deposito iniziale del bond viene utilizzato come deposito iniziale sulla beaconchain per proteggere le credenziali di prelievo del tuo validator. L'importo rimanente viene depositato nel tuo minipool quando gli viene assegnato ETH dal deposit pool.

Quando il tuo minipool viene dissolto, l'ETH dell'utente viene restituito al deposit pool e il tuo ETH rimane nel minipool pronto per essere restituito a te. Utilizza la funzionalità [Distribuzione Manuale](./skimming#manual-distribution) delle ricompense per recuperare questo ETH che può poi essere utilizzato nel passaggio successivo per attivare il tuo validator.

## Aumenta il Saldo della Beaconchain a 32 ETH

Devi ricaricare il saldo del tuo validator al minimo richiesto per l'attivazione sulla beaconchain. Questo importo è **32 ETH**. Se hai un minipool con bond da 16 ETH, avrai bisogno di ulteriori 16 ETH e se hai un minipool con bond da 8 ETH avrai bisogno di ulteriori 24 ETH durante questo passaggio.

Deposita l'importo richiesto di ETH nell'indirizzo del tuo nodo e quindi esegui il seguente comando per iniziare il processo:

```shell
rocketpool minipool rescue-dissolved
```

Ti verrà presentato un elenco di minipool che soddisfano i criteri per un deposito manuale:

```
Please select a minipool to rescue:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (dissolved since 2023-02-08, 06:33 +0000 UTC)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (dissolved since 2023-02-08, 06:33 +0000 UTC)
```

Dopo aver selezionato il minipool che vuoi recuperare, ti verrà chiesto quale importo vuoi depositare manualmente:

```
1. All 16.000000 ETH required to rescue it
2. 1 ETH
3. A custom amount
```

L'opzione 1 verrà utilizzata nella maggior parte dei casi. È l'importo richiesto per portare il saldo della beaconchain fino ai 32 ETH richiesti. Le altre opzioni sono fornite per casi d'uso avanzati.

::: tip NOTA
Portare il saldo della beaconchain a 32 ETH significa che il tuo validator sarà in grado di partecipare attivamente ai compiti di validazione di Ethereum. Lo smartnode potrebbe non aver avuto la possibilità di riavviare il tuo validator dalla dissoluzione. Pertanto, è una buona idea riavviare manualmente il tuo validator per assicurarsi che abbia caricato le chiavi del validator e possa eseguire i compiti di validazione per evitare penalità durante il processo di recupero.

Se stai eseguendo la modalità Docker standard, questo può essere fatto con `docker restart rocketpool_validator`.
:::

Una volta completato questo passaggio, il tuo validator entrerà nella coda di ingresso e dovrai attendere che si verifichino i seguenti eventi:

1. Devono passare 2048 blocchi dell'execution layer affinché il tuo deposito venga accettato (~8 ore)
2. Devono passare fino a 32 epoche affinché i validator ti votino (~0,5 - 3,5 ore)
3. Un tempo variabile nella coda dei validator (6,4 minuti per ogni 4 validator nella coda)
4. Minimo 256 epoche di validazione prima che sia consentita un'uscita (27 ore)

### Uscire dal Validator

Una volta che il tuo validator è stato attivo per un minimo di 256 epoche, puoi uscire dal tuo minipool tramite lo stesso processo di qualsiasi altro minipool seguendo la guida [Uscire dal Validator](./withdraw#exiting-your-validator).

Il saldo completo di 32 ETH verrà restituito al tuo minipool e i minipool dissolti distribuiscono il 100% del loro saldo all'indirizzo di prelievo del node operator.
