# Testare il tuo nodo Oracle DAO

Una volta configurato il tuo nodo e unito all'Oracle DAO, dovresti testarlo per assicurarti che sia in grado di svolgere i suoi compiti correttamente.
Il modo migliore per farlo è fargli costruire l'albero di Merkle per le ricompense Redstone utilizzando l'utility `treegen` di Rocket Pool.

### treegen

`treegen` è uno strumento in grado di riprodurre l'intero albero di Merkle delle ricompense e gli artefatti correlati per un precedente intervallo di ricompense tramite i tuoi client Execution e Consensus con accesso archiviale.
Può anche eseguire un "dry run" dell'intervallo corrente fingendo che sia terminato all'ultima epoca finalizzata (al momento dell'esecuzione) e producendo un albero parziale dall'inizio dell'intervallo fino a quel punto.

::: tip SUGGERIMENTO
Per maggiori informazioni sull'albero delle ricompense e sui file correlati, visita [**la specifica formale**](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/merkle-tree-spec).
:::

`treegen` può essere utilizzato come binario standalone (attualmente compilato solo per sistemi Linux, x64 e arm64) o come container Docker.

Se desideri scaricare il binario standalone, puoi trovarlo nelle release qui: [https://github.com/rocket-pool/treegen](https://github.com/rocket-pool/treegen).
Le istruzioni d'uso sono incluse nel README, ma tratteremo alcuni esempi anche qui di seguito.

Il tag del container Docker è `rocketpool/treegen:latest`.

## Costruire un albero in Dry-Run

Per un primo test, esegui `treegen` per generare un albero di dry-run che calcola l'albero dall'inizio dell'intervallo di ricompense fino all'ultimo slot (finalizzato).
Useremo [lo script](https://github.com/rocket-pool/treegen/blob/main/treegen.sh) incluso nel repository che sfrutta il container Docker per eseguirlo sulla macchina del nodo stesso per semplicità:

```shell
./treegen.sh -e http://localhost:8545 -b http://localhost:5052
```

::: warning NOTA
Nota che questa particolare configurazione richiede di esporre le API dell'Execution Client e del Beacon Node attraverso la configurazione Docker - assicurati di avere entrambe le opzioni abilitate nel TUI di `rocketpool service config`.
:::

Questo testerà la capacità dei tuoi client di rispondere alle query in modo tempestivo (ad esempio, se stai utilizzando un servizio di terze parti, questo sarà utile per valutare se il suo limite di query è insufficiente), ma **non testerà le loro capacità in modalità Archive**.
Produrrà un output come il seguente:

```
2022/11/06 12:11:37 Beacon node is configured for Mainnet.
2022/11/06 12:11:37 Generating a dry-run tree for the current interval (3)
2022/11/06 12:11:37 Snapshot Beacon block = 5077503, EL block = 15912334, running from 2022-10-27 01:35:39 -0400 EDT to 2022-11-06 12:11:37.672755513 -0500 EST m=+0.049901525

2022/11/06 12:11:38  Creating tree for 1684 nodes
2022/11/06 12:11:38  Pending RPL rewards: 27807066876373932561121 (27807.067)
2022/11/06 12:11:38  Total collateral RPL rewards: 19464946813461752792784 (19464.947)
2022/11/06 12:11:47  Calculated rewards:           19464946813461752792026 (error = 758 wei)
2022/11/06 12:11:47  Total Oracle DAO RPL rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Calculated rewards:           4171060031456089884168 (error = 0 wei)
2022/11/06 12:11:47  Expected Protocol DAO rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Actual Protocol DAO rewards:   4171060031456089884927 to account for truncation
2022/11/06 12:11:47  Smoothing Pool Balance: 62781809204406327225 (62.782)
2022/11/06 12:11:55  1229 / 1684 nodes were eligible for Smoothing Pool rewards
2022/11/06 12:12:03  Checking participation of 4364 minipools for epochs 156315 to 158671
2022/11/06 12:12:03  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/06 12:13:48  On Epoch 156415 of 158671 (4.24%)... (1m44.577189073s so far)

...

2022/11/06 12:49:55  On Epoch 158615 of 158671 (97.62%)... (37m51.785456663s so far)
2022/11/06 12:50:51  Finished participation check (total time = 38m47.979633935s)
2022/11/06 12:50:51  Pool staker ETH:    26638263090669169632 (26.638)
2022/11/06 12:50:51  Node Op ETH:        36143546113737157593 (36.144)
2022/11/06 12:50:51  Calculated NO ETH:  36143546113737155125 (error = 2468 wei)
2022/11/06 12:50:51  Adjusting pool staker ETH to 26638263090669172100 to account for truncation
2022/11/06 12:50:52 Saved minipool performance file to rp-minipool-performance-mainnet-3.json
2022/11/06 12:50:52 Generation complete! Saving tree...
2022/11/06 12:50:52 Saved rewards snapshot file to rp-rewards-mainnet-3.json
2022/11/06 12:50:52 Successfully generated rewards snapshot for interval 3.
```

Se viene eseguito senza errori, genererà gli artefatti dell'albero delle ricompense e li salverà come file JSON nella tua directory di lavoro.
Sei libero di esplorarli e assicurarti che i loro contenuti siano sensati, ma poiché sono file di dry-run, non sono memorizzati canonicamente da nessuna parte per il confronto.

## Costruire un albero canonico da un intervallo passato

Questo prossimo test consiste nel replicare uno degli alberi completi di un intervallo passato.
Questo richiederà accesso archiviale sia sull'Execution Layer che sul Consensus Layer, quindi servirà come un buon test di entrambe le capacità.

Al momento della stesura, **Intervallo 2** è una scelta ideale poiché è lontano nel passato e ha coinvolto lo Smoothing Pool (che rappresenta il carico computazionale maggiore nel calcolo delle ricompense per il periodo).

Esegui `treegen` usando il seguente comando:

```shell
./treegen.sh -e http://<your archive EC url> -b http://localhost:5052 -i 2
```

Nota che l'**URL dell'Execution Client** è diverso qui: _deve essere_ un EC Archive poiché il blocco snapshot per l'Intervallo 2 era lontano nel passato.

::: warning NOTA
A seconda della configurazione del tuo client, costruire questo albero può richiedere _ore_.
Lo Smartnode ti fornirà indicatori di stato sui suoi progressi lungo il percorso, come puoi vedere nell'esempio qui sotto.
:::

L'output apparirà così (troncato per brevità):

```
2022/11/07 23:44:34 Beacon node is configured for Mainnet.
2022/11/07 23:44:36 Found rewards submission event: Beacon block 5002079, execution block 15837359
2022/11/07 23:46:25  Creating tree for 1659 nodes
2022/11/07 23:46:26  Pending RPL rewards: 70597400644162994104151 (70597.401)
2022/11/07 23:46:26  Approx. total collateral RPL rewards: 49418180450914095872905 (49418.180)
2022/11/07 23:46:26  Calculating true total collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:47:06  On Node 100 of 1659 (6.03%)... (40.134456319s so far)
...
2022/11/07 23:57:41  On Node 1600 of 1659 (96.44%)... (11m14.880994468s so far)
2022/11/07 23:58:03  Calculating individual collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:58:14  On Node 100 of 1659 (6.03%)... (11.421791885s so far)
...
2022/11/08 00:01:20  On Node 1600 of 1659 (96.44%)... (3m16.598462676s so far)
2022/11/08 00:01:26  Calculated rewards:           49418180450914095872087 (error = 818 wei)
2022/11/08 00:01:26  Total Oracle DAO RPL rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Calculated rewards:           10589610096624449115610 (error = 12 wei)
2022/11/08 00:01:30  Expected Protocol DAO rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Actual Protocol DAO rewards:   10589610096624449116454 to account for truncation
2022/11/08 00:01:30  Smoothing Pool Balance: 209598268075128756591 (209.598)
2022/11/08 00:04:20  On Node 104 of 1659 (6.27%)... (2m49.443336528s so far)
...
2022/11/08 00:27:33  On Node 1664 of 1659 (99.70%)... (27m28.373343345s so far)
2022/11/07 16:40:36  1197 / 1659 nodes were eligible for Smoothing Pool rewards
2022/11/07 16:45:45  Checking participation of 4308 minipools for epochs 150015 to 156314
2022/11/07 16:45:45  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/07 16:47:24  On Epoch 150115 of 156314 (1.59%)... (1m38.552513232s so far)
...
2022/11/07 18:24:31  On Epoch 156215 of 156314 (98.43%)... (1h38m46.325518238s so far)
2022/11/07 18:26:10  Finished participation check (total time = 1h40m24.47206731s)
2022/11/07 18:26:10  Pool staker ETH:    88931841842952006598 (88.932)
2022/11/07 18:26:10  Node Op ETH:        120666426232176749993 (120.666)
2022/11/07 18:26:10  Calculated NO ETH:  120666426232176747457 (error = 2536 wei)
2022/11/07 18:26:10  Adjusting pool staker ETH to 88931841842952009134 to account for truncation
2022/11/07 18:26:10 Finished in 2h36m3.709234237s
2022/11/07 18:26:10 Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
2022/11/07 18:26:10 Saving JSON files...
2022/11/07 18:26:10 Saved minipool performance file to rp-minipool-performance-mainnet-2.json
2022/11/07 18:26:10 Saved rewards snapshot file to rp-rewards-mainnet-2.json
2022/11/07 18:26:10 Successfully generated rewards snapshot for interval 2.
```

La cosa chiave da cercare qui è questo messaggio alla fine:

```
Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
```

Se ricevi questo, allora il tuo watchtower può costruire l'albero correttamente.

::: danger NOTA
Mentre questo dimostra che puoi costruire l'albero, _devi_ assicurarti che il tuo token API di Web3.Storage sia stato inserito nella configurazione dello Smartnode in modo che possa caricare l'albero risultante su IPFS.
:::

### Prossimi passi

Successivamente, tratteremo come monitorare le prestazioni del tuo nodo.
