# Distribuzione delle Ricompense Skimmate

Le ricompense ETH che ricevi per gestire un validator per Ethereum vengono routinamente inviate ai tuoi minipool in un processo chiamato "skimming".
La frequenza degli skim dipende dal numero di validator attivi sulla Beacon Chain. Al momento della scrittura, il numero di validator è di circa 500.000, il che comporta uno skim che si verifica approssimativamente ogni 2-3 giorni.

Le ricompense skimmate si accumuleranno in ciascuno dei tuoi minipool fino a quando non le "distribuisci". Questo processo distribuisce le ricompense skimmate tra te, come node operator, e i possessori di rETH in base al tuo tasso di commissione e al rapporto di ETH fornito e prestato.

::: warning NOTA
Per accedere al saldo del tuo minipool, dovrai prima aggiornare al [delegate Atlas](./minipools/delegates).
Il vecchio delegate Redstone non può essere utilizzato per distribuire il saldo del minipool.
:::

## Distribuzione Automatica

Per impostazione predefinita, lo Smartnode è configurato per distribuire automaticamente qualsiasi tuo minipool quando i loro saldi individuali raggiungono **1 ETH**. Questa soglia può essere configurata nella TUI seguendo i passaggi qui sotto.

Esegui:

```shell
rocketpool service config
```

Vai all'impostazione `Smartnode and TX Fee Settings > Auto Distribute Threshold` mostrata qui sotto.

![](./images/tui-automatic-skimming.png)

Modificare questa impostazione regolerà la soglia alla quale lo Smartnode distribuirà automaticamente i tuoi minipool.
Impostare il parametro a 0 disabiliterà le distribuzioni automatiche.

::: warning AVVISO
Se decidi di disabilitare la distribuzione automatica, è importante che tu esegua comunque una distribuzione manuale su base regolare. Leggi la [sezione sulla distribuzione manuale](#manual-distribution) che segue su come farlo.

Dopo un lungo periodo di tempo, le tue ricompense skimmate potrebbero superare gli 8 ETH. Se si verifica questa situazione, non sarai più in grado di distribuirle e dovrai uscire dal tuo validator per accedere alle ricompense accumulate.

Rocket Pool dispone di un design di sicurezza che consente a chiunque, dopo un lungo periodo di attesa, di distribuire il tuo minipool quando il suo saldo supera gli 8 ETH. Per proteggere il tuo capitale, lo Smartnode monitora questa situazione e uscirà automaticamente dal tuo minipool se si verifica.
:::

## Distribuzione Manuale

Se hai disabilitato la distribuzione automatica delle ricompense skimmate, dovrai distribuirle regolarmente tu stesso con il seguente processo.

Puoi anche distribuire manualmente le tue ricompense usando questo processo in qualsiasi momento senza attendere il processo automatico sopra.

Se il tuo minipool ha meno di 8 ETH, puoi distribuire le tue ricompense usando il seguente comando:

```shell
rocketpool minipool distribute-balance
```

Questo ti mostrerà i minipool che hai che sono idonei per la distribuzione, quanto ETH hanno, e quanto ETH riceverai tu (il node operator):

```
WARNING: The following minipools are using an old delegate and cannot have their rewards safely distributed:
	0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
	0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0
	0x7E5705c149D11efc951fFc20349D7A96bc6b819C
	0x7E570625cE8F586c90ACa7fe8792EeAA79751778

Please upgrade the delegate for these minipools using `rocketpool minipool delegate-upgrade` in order to distribute their ETH balances.

Please select a minipool to distribute the balance of:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (0.112307 ETH available, 0.031200 ETH goes to you plus a refund of 0.024419 ETH)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (0.070754 ETH available, 0.000481 ETH goes to you plus a refund of 0.069399 ETH)
4: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (0.122064 ETH available, 0.070187 ETH goes to you plus a refund of 0.000000 ETH)
5: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (0.102739 ETH available, 0.000000 ETH goes to you plus a refund of 0.000000 ETH)
6: 0xffCAB546539b55756b1F85678f229dd707328A2F (0.070989 ETH available, 0.025201 ETH goes to you plus a refund of 0.000000 ETH)
```

Qualsiasi minipool che utilizza il delegate di lancio originale verrà menzionato all'inizio, facendoti sapere che non puoi chiamare `distribute-balance` su di essi fino a quando non aggiorni i loro delegate.
Questo delegate è stato scritto prima che i prelievi skimmed fossero specificati e, come tale, non dispone di un modo per distribuire le ricompense skimmate.

Nota che per i minipool idonei, ti viene mostrato anche l'**importo del rimborso**.
Questo è un importo dovuto direttamente a te (ad esempio, perché avevi un saldo nel tuo minipool prima di [migrare da un bond da 16 ETH a uno da 8 ETH](./leb-migration.mdx) o hai [convertito un validator solo in un minipool](./solo-staker-migration) con ricompense esistenti).
Non sarà condiviso con i possessori di rETH.

Inserisci il numero del minipool che vuoi distribuire.
Ti verrà richiesto il grafico del prezzo del gas come al solito, e ti verrà chiesto di confermare la tua decisione.
Una volta fatto, il saldo del tuo minipool verrà distribuito:

```
Using a max fee of 2.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to distribute the ETH balance of 1 minipools? [y/n]
y

Distributing balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC...
Transaction has been submitted with hash 0xb883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully distributed the ETH balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC.
```

Come puoi vedere [dalla transazione](https://zhejiang.beaconcha.in/tx/b883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9), questo ha fornito all'indirizzo di prelievo del nodo la quota delle ricompense del nodo (più l'importo del rimborso) e ha restituito il resto allo staking pool.
