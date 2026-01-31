::: danger ATTENZIONE
I depositi dei minipool sono attualmente disabilitati in preparazione a Saturn 1.
:::

# Il Delegate del Minipool

Ogni validatore che gestisci ha un contratto **minipool** come suo "proprietario", per così dire.
Il minipool è un contratto unico assegnato specificamente a quel validatore; funge da **indirizzo di prelievo**.
Tutti i premi e i saldi di staking prelevati dalla Beacon Chain verranno inviati al contratto minipool.

Ogni minipool è unico per garantire che tu (l'operatore del nodo) ne abbia il controllo assoluto.
Nessun altro lo controlla, nessun altro può modificarlo; è completamente sotto il tuo comando.

Detto questo, per ridurre al minimo i costi del gas durante i depositi dei nodi, il minipool _stesso_ contiene pochissime funzionalità effettive.
Quasi tutto ciò che può fare viene delegato a un contratto **delegate**.

Il contratto delegate del minipool è un contratto speciale che contiene la maggior parte della logica richiesta dai minipool - cose come la distribuzione equa del saldo tra te e gli staker del pool, per esempio.
A differenza dei minipool, dove ogni minipool è un contratto unico, il delegate è un singolo contratto a cui molti minipool possono "inoltrare" richieste.

Occasionalmente, il team di sviluppo di Rocket Pool pubblicherà un nuovo delegate del minipool che aggiunge nuove funzionalità.
Per esempio, nell'aggiornamento Atlas, abbiamo introdotto un nuovo delegate con supporto per la distribuzione dei premi skimmati senza dover chiudere il minipool.

I minipool possono avere i loro delegate aggiornati per sfruttare queste nuove funzionalità.
Gli aggiornamenti dei delegate sono **opzionali**, quindi puoi decidere se e quando vuoi utilizzarli.
Detto questo, sono solitamente necessari per sfruttare le nuove funzionalità introdotte dagli aggiornamenti di rete.

### Aggiornare il tuo Delegate

Per aggiornare un minipool a un nuovo contratto delegate, esegui semplicemente il seguente comando:

```shell
rocketpool minipool delegate-upgrade
```

Questo ti presenterà un elenco dei tuoi minipool che non stanno attualmente utilizzando l'ultimo delegate e sono idonei per l'aggiornamento:

```
Please select a minipool to upgrade:
1: All available minipools
2: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
3: 0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
4: 0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
5: 0x7E5705c149D11efc951fFc20349D7A96bc6b819C (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
6: 0x7E570625cE8F586c90ACa7fe8792EeAA79751778 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
7: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (using delegate 0x6aCEA7f89574Dd8BC6ffDfDca1965A3d756d5B20)
```

Seleziona quello/i che desideri aggiornare dall'elenco inserendo il numero corrispondente a sinistra dell'indirizzo del minipool.
Una volta selezionato, ti verrà chiesto di confermare le impostazioni del prezzo del gas, e dopo di che verrà inviata una transazione per aggiornare il minipool:

```
Using a max fee of 26.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to upgrade 1 minipools? [y/n]
y

Upgrading minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40...
Transaction has been submitted with hash 0xcd91c9a38f3438c3d8a45bb5f439014e5935dcb50b0704f3c5077f54174e99bb.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully upgraded minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40.
```

Puoi verificare che stia utilizzando l'ultimo delegate con `rocketpool minipool status`.
Tutti i minipool che _non_ stanno utilizzando l'ultimo delegate avranno una notifica gialla sotto il loro stato per farti sapere che possono essere aggiornati:

```
Address:              0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
Penalties:            0
...
Delegate address:      0x5c2D33A015D132D4f590f00df807Bb1052531ab9
Rollback delegate:     <none>
Effective delegate:    0x5c2D33A015D132D4f590f00df807Bb1052531ab9
*Minipool can be upgraded to delegate 0x149aE025fFC7E7bbcCc8d373d56797D637bF5D33!
```
