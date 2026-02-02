# Minipool con Bond di 8 ETH

Quando Rocket Pool è stato lanciato per la prima volta, supportava due tipi di minipool:

1. Un **bond di 16 ETH**, dove l'operatore del nodo forniva 16 ETH e i restanti 16 ETH provenivano dal pool di staking per creare un validatore completo (32 ETH).
2. Un **bond temporaneo di 32 ETH**, dove l'operatore del nodo forniva tutti i 32 ETH in modo da poter saltare il processo di inizializzazione e iniziare subito a validare sulla Beacon Chain, per poi ricevere un rimborso di 16 ETH una volta che il pool di deposito avesse avuto abbastanza ETH per coprirlo. A quel punto si sarebbe trasformato in un normale minipool con bond di 16 ETH.

Quest'ultimo è stato rimosso da una votazione della comunità diversi mesi dopo l'inizio della vita del protocollo perché non era più necessario e causava lunghi ritardi nei rimborsi.

Il primo rappresentava l'importo del bond più basso del protocollo perché garantiva che se un operatore del nodo avesse usato Rocket Pool per attaccare il protocollo Ethereum e avesse visto _l'intero bond_ slashato, avrebbe perso tanto quanto gli staker di rETH e non ne sarebbe uscito in vantaggio.

Dal lancio di Rocket Pool, la comunità ha condotto [ricerche significative](https://dao.rocketpool.net/t/leb8-discussion-thread/899) sulla sicurezza fornita da questo bond e ha scoperto che era molto conservativo.
A tutti gli effetti, uno slashing di 16 ETH è stato ritenuto irrealistico e un bond di 16 ETH forniva effettivamente gli stessi benefici di sicurezza di un bond di soli 8 ETH (più il requisito supplementare di RPL).
Pertanto, supportato da questa ricerca, l'aggiornamento Atlas introduce un nuovo tipo di minipool nell'elenco: il **bond di 8 ETH**, chiamato colloquialmente dalla comunità di Rocket Pool "LEB8" (Lower ETH Bond - 8 ETH).

Per creare un minipool da 8 ETH, l'operatore del nodo deve fornire solo **8 ETH propri** (più abbastanza RPL per coprire il requisito di collaterale - maggiori informazioni in [Collaterale RPL](#collaterale-rpl)).
Preleverà quindi **24 ETH** dal pool di deposito per completare il validatore e mettersi al lavoro sulla Beacon Chain.

Questo **apre la porta a nuovi potenziali operatori di nodi** che vogliono gestire un nodo ma non hanno proprio 16 ETH.
Inoltre, consente agli operatori di nodi più grandi di **mettere al lavoro più ETH dei pool staker** sulla Beacon Chain guadagnando ricompense.
Poiché funziona senza compromettere significativamente la sicurezza, tutti vincono!

In questa guida tratteremo tre argomenti:

- Come funzionano effettivamente i minipool con bond di 8 ETH e i numeri delle ricompense dietro di essi
- Come creare un nuovo minipool da 8 ETH
- Come migrare un minipool _esistente_ da 16 ETH a un minipool da 8 ETH senza uscire

Continua a leggere per saperne di più su ciascun argomento.

## Come Funzionano i Minipool con Bond di 8 ETH

Meccanicamente, i minipool con bond di 8 ETH si comportano **in modo identico** a tutti gli altri minipool del protocollo.
Ancora "possiedono" un validatore sulla Beacon Chain (rappresentano le credenziali di prelievo di quel validatore), sono ancora dotati di una commissione (anche se la commissione con Atlas **sarà fissata al 14%** per tutti i nuovi minipool) e forniscono tutte le stesse funzionalità che ha un minipool con bond di 16 ETH.
La differenza sta interamente nei numeri.

### Ricompense

Dal punto di vista della redditività (guardando _puramente_ alle ricompense in ETH e ignorando RPL), i minipool con bond di 8 ETH con una commissione del 14% forniscono _più ricompense_ all'operatore del nodo rispetto anche ai _minipool con bond di 16 ETH al 20% di commissione_ (che, a partire da Redstone, è la configurazione di ricompensa più alta possibile).
Allo stesso tempo, forniscono anche più ricompense ai _possessori di rETH_ grazie al fatto che gli operatori dei nodi stanno mettendo il capitale dei possessori di rETH a fruttare in modo più efficiente.

Vediamo un semplice esempio per illustrare.
Supponiamo di essere un operatore di nodo con 16 ETH disponibili per lo staking (più il bond RPL richiesto).
Supponiamo di aver guadagnato 1 ETH di ricompense sulla Beacon Chain per validatore.
Ecco come funziona la matematica per un singolo minipool da 16 ETH con una commissione del 20%, rispetto a due minipool da 8 ETH con una commissione del 14%:

```
1x Minipool da 16 ETH al 20%:
Ricompense: 1 ETH
Quota del Nodo = (16/32) + (16/32 * 0,2)
              = 0,5 + (0,5 * 0,2)
              = 0,5 + 0,1
              = 0,6 ETH

Quota rETH = 1 - 0,6
           = 0,4 ETH


2x Minipool da 8 ETH al 14%:
Ricompense: 2 ETH
Quota del Nodo = ((8/32) + (24/32 * 0,14)) * 2
               = (0,25 + (0,75 * 0,14)) * 2
               = (0,25 + 0,105) * 2
               = 0,71 ETH

Quota rETH = 2 - 0,71
           = 1,29 ETH
```

In altre parole, un operatore di nodo guadagnerà **il 18% in più di ETH** tramite due minipool da 8 ETH rispetto a quanto farebbe con un singolo minipool da 16 ETH con una commissione del 20%.

### Collaterale RPL

Per creare un minipool da 8 ETH, gli operatori dei nodi devono ancora mettere in stake abbastanza RPL per coprire i requisiti minimi di collaterale per il loro nodo (tenendo conto di tutti i suoi minipool di tutte le dimensioni del bond).

Queste regole sono state chiarite con Atlas:

- Il **minimo RPL** per minipool è **il 10% dell'importo _preso in prestito_**
- Il **massimo RPL** per minipool è **il 150% dell'importo _vincolato_**

Per un minipool da 16 ETH, questo rimane invariato; il minimo è 1,6 ETH di valore in RPL e il massimo è 24 ETH di valore in RPL.

Per un minipool da 8 ETH, questo diventa un **minimo di 2,4 ETH di valore in RPL** (10% dell'importo preso in prestito, che è 24 ETH) e un **massimo di 12 ETH di valore in RPL** (150% dell'importo vincolato).

Questi numeri sono stati selezionati dalla comunità di Rocket Pool [come parte di una votazione di governance](https://vote.rocketpool.net/#/proposal/0x7426469ae1f7c6de482ab4c2929c3e29054991601c95f24f4f4056d424f9f671).

## Creare un Nuovo Minipool da 8 ETH

Il processo per creare un nuovo minipool con un bond di 8 ETH è identico al processo per la creazione di un minipool da 16 ETH.

Esegui semplicemente il seguente comando:

```shell
rocketpool node deposit
```

Quando richiesto l'importo del bond, seleziona `8 ETH`:

```
Your eth2 client is on the correct network.

NOTE: by creating a new minipool, your node will automatically claim and distribute any balance you have in your fee distributor contract. If you don't want to claim your balance at this time, you should not create a new minipool.
Would you like to continue? [y/n]
y

Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.
...
```

::: tip NOTA
Questo esempio mostra anche l'uso del [**nuovo Sistema di Credito di Deposito**](../../node-staking/credit).
Poiché l'operatore del nodo ha 8 ETH in credito, creare questo minipool da 8 ETH è gratuito!
:::

Questo è tutto!
Il resto del processo è lo stesso delle [istruzioni usuali per la creazione del minipool](../../node-staking/create-validator.mdx).
