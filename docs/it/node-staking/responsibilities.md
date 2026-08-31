# Responsabilità di un Node Operator

## Come Funziona lo Staking su Ethereum

Come promemoria, lo staking in Proof of Stake avviene tramite **validator**.
Un validator è essenzialmente un singolo indirizzo sulla Beacon Chain a cui sono stati depositati 32 ETH sull'Execution layer.
I validator sono responsabili di mantenere la coerenza e la sicurezza della Beacon Chain.
Lo fanno ascoltando le transazioni e le nuove proposte di blocchi e **attestando** che il blocco proposto contiene transazioni legali e valide eseguendo calcoli e verifiche dietro le quinte.
Occasionalmente, hanno l'opportunità di proporre nuovi blocchi.

Ai validator vengono assegnate attestazioni e proposte di blocchi **su un calendario randomizzato**.
Questo è molto diverso dal vecchio sistema Proof of Work, dove tutti cercavano costantemente di competere tra loro per trovare il prossimo blocco prima degli altri.
Ciò significa che a differenza della Proof of Work dove i miner non avevano la garanzia di guadagnare una ricompensa di blocco a meno che non trovassero il prossimo blocco, i validator Proof of Stake _hanno_ la garanzia di avere un reddito lento e costante finché svolgono i loro compiti.
Se un validator è offline e perde un'attestazione o una proposta di blocco, verrà **leggermente penalizzato**.
Le penalità sono però piuttosto piccole; come regola generale, se un validator è offline per X ore, recupererà tutto l'ETH perso dopo le stesse X ore di ritorno online.

### Ricompense

I validator guadagnano ricompense sul consensus layer da Attestazioni, Proposte di Blocchi, Sync Committees (rare) e Ricompense da Slashing (estremamente rare). Guadagnano anche ricompense sull'execution layer da Priority Fees e MEV.

A partire da 5/2026, l'APR complessivo è ~2.634%, con 2.8% proveniente dal consensus layer APR e 0.22% dall'execution layer APR. Un posto dove trovare queste informazioni è l'[explorer rated](https://explorer.rated.network/network?network=mainnet&timeWindow=30d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake).

### Penalità

I validator vengono penalizzati con piccole quantità di ETH se sono offline e non riescono a svolgere i loro compiti assegnati.
Questo si chiama **leaking**.
Se un validator viola una delle regole fondamentali della Beacon chain e sembra attaccare la rete, potrebbe subire uno **slashing**.
Lo slashing è un'uscita forzata del validator senza il tuo permesso, accompagnata da una multa relativamente grande che rimuove parte del saldo ETH del validator.

Realisticamente, l'unica condizione che può causare uno slashing è se esegui le chiavi del tuo validator su due nodi contemporaneamente (come in una configurazione di failover/ridondanza, dove il tuo nodo di backup si accende accidentalmente mentre il tuo nodo principale è ancora in esecuzione).
Non permettere che ciò accada e **non subirai slashing**.
Lo slashing _non può verificarsi_ per essere offline per manutenzione.

Di seguito è riportata una tabella che mostra le penalità che possono accadere a un validator:

| Tipo                   | Layer     | Importo                                                                           |
| ---------------------- | --------- | --------------------------------------------------------------------------------- |
| Attestazione Mancata   | Consensus | -0.000011 ETH\* per attestazione (-9/10 del valore di una normale ricompensa)     |
| Proposta Mancata       | Consensus | 0                                                                                 |
| Sync Committee Mancato | Consensus | -0.00047 ETH\* per epoch (-0.1 ETH totale se offline per tutto il sync committee) |
| Slashing               | Consensus | Almeno 1/32 del tuo saldo, fino all'intero saldo in circostanze estreme           |

\*_Varia in base al numero totale di validator nella rete.
Approssimato per 435.000 validator attivi._

::: tip SUGGERIMENTO
Come regola generale, se sei offline per X ore (e non sei in un sync committee), recupererai tutto il tuo ETH perso dopo X ore una volta tornato online e attestando.
:::

## Come Funzionano i Nodi Rocket Pool

A differenza degli staker in solo, che sono tenuti a depositare 32 ETH per creare un nuovo validatore, i nodi di Rocket Pool devono depositare solo 4 ETH per validatore (chiamati "bonded ETH").
Questo sarà accoppiato con 28 ETH dallo staking pool (chiamati "borrowed ETH", che provengono dai depositi dei liquid staker in cambio di rETH) per creare un nuovo validator megapool.

Per la Beacon chain, un validator megapool sembra esattamente come un normale validatore.
Ha le stesse responsabilità, stesse regole da seguire, stesse ricompense e così via.
L'unica differenza è nel modo in cui il validator megapool è stato creato sull'execution layer e come funzionano i prelievi quando l'operatore del nodo decide di uscire volontariamente dal validator megapool.
Tutta la creazione, i prelievi e la delega delle ricompense sono gestiti dagli **smart contract** di Rocket Pool sulla blockchain Ethereum.
Questo lo rende completamente decentralizzato.

Un **Node** Rocket Pool è un singolo computer con un wallet Ethereum registrato presso gli smart contract di Rocket Pool.
Il nodo può quindi creare tutti i validator megapool che può permettersi, tutti in esecuzione felicemente sulla stessa macchina insieme.
**Un singolo nodo Rocket Pool può eseguire molti, molti validator megapool.**
Ogni validator megapool ha un impatto trascurabile sulle prestazioni complessive del sistema; alcune persone sono riuscite a eseguirne centinaia su un singolo nodo.

Il costo iniziale di un validator megapool è 4 ETH. Inoltre, un node operator può facoltativamente mettere in stake RPL sul proprio nodo per qualificarsi per ricompense aggiuntive e ottenere potere di voto all'interno della protocol DAO.

## Node Operator di Rocket Pool

I **node operator** sono il cuore e l'anima di Rocket Pool.
Sono gli individui che gestiscono i nodi Rocket Pool.

### Responsabilità

Mettono in funzione l'ETH dalla staking pool eseguendo validator megapool con esso, che guadagnano ricompense di staking per il protocollo Rocket Pool (e quindi, aumentano il valore di rETH).
Il loro lavoro è semplice, ma crucialmente importante: _eseguire validator con la massima qualità possibile e massimizzare le ricompense di staking_.

I node operator sono responsabili di:

- Configurare un computer (fisico o virtuale)
- Configurarlo correttamente, inclusa la rete domestica se applicabile
- Installare Rocket Pool su di esso e configurare validator per eseguire la validazione
- Proteggerlo, sia da minacce esterne che interne
- Mantenerlo per la durata dei loro validator

È una grande responsabilità e non è un lavoro semplice da configurare e dimenticare; devi prenderti cura del tuo nodo per tutto il tempo in cui fa staking.
Con grande responsabilità, tuttavia, arrivano grandi ricompense.

### Ricompense

Ecco i principali vantaggi di gestire un nodo Rocket Pool:

- Guadagni la tua porzione delle ricompense ETH di ogni validator, più una commissione.
  - Gestisci un validator con soli 4 ETH di capitale proprio, mentre i restanti 28 ETH provengono dai liquid staker.
  - Ogni validator megapool guadagna il 5% di commissione sulle ricompense generate dai 28 ETH del protocollo. Questo equivale al 35% in più rispetto allo staking in solo (`(4 bonded + 28 borrowed * 0.05) / 4 = 1.35`).
  - Unendoti allo [Smoothing Pool](fee-distrib-sp#lo-smoothing-pool), condividi le ricompense dell'execution layer (priority fee e MEV) con gli altri partecipanti, ottenendo rendimenti più costanti invece di dipendere dalla fortuna nelle proposte di blocco.
- Mettere in stake RPL ti fa guadagnare ricompense aggiuntive.
  - Gli staker di RPL guadagnano una [quota della commissione del protocollo](megapools/staking-and-claiming-rewards#come-la-quota-dei-votanti-viene-distribuita-agli-staker-rpl-del-megapool) (pagata in ETH) proporzionale al loro RPL in stake.
  - Guadagni inoltre ricompense di emissione (pagate in RPL) sull'RPL che metti in stake.
    - Alla fine di un periodo (ogni 28 giorni), viene effettuato uno snapshot del tuo RPL.
    - Puoi ottenere il rendimento massimo sull'RPL **fino al 15%** del valore del tuo ETH preso in prestito totale.
    - Otterrai rendimento sull'RPL anche oltre il 15%, ma a un livello decrescente.
  - Otterrai potere di voto basato sulla radice quadrata del tuo RPL in stake, fino al 150% del tuo ETH bonded.

### Limitazioni

Ci sono alcune limitazioni che accompagnano le ricompense sopra indicate:

- Se il tuo nodo performa male e finisci effettivamente per perdere ETH al momento in cui decidi di uscire dal tuo validator megapool, tutto l'ETH perso verrà dalla tua quota.
  - Ad esempio: se esci con un saldo di 31 ETH, il tuo validator megapool ha perso 1 ETH dal suo deposito iniziale di 32 ETH. Riceverai 3 ETH e 28 ETH verranno restituiti alla staking pool.
- Il tuo RPL in stake sarà meno liquido:
  - Non c'è alcun limite alla quantità di RPL in stake nel megapool che puoi togliere dallo stake, ma devi attendere 28 giorni dall'avvio dell'unstaking prima del prelievo. Questo impedisce agli utenti di aggirare il sistema di ricompense mettendo in stake RPL giusto in tempo per il periodo di ricompense di 28 giorni e ritirandolo subito dopo la fine del periodo.

### Ce la farai

Se sei abbastanza nuovo all'uso della riga di comando o alla manutenzione dei computer, questa può sembrare una sfida spaventosa.
Fortunatamente, uno dei principi fondamentali di Rocket Pool è la _decentralizzazione_ - il fatto che chiunque, ovunque, possa gestire un nodo se ha la determinazione e le conoscenze.
Mentre non possiamo aiutare con la determinazione, _possiamo_ aiutare con le conoscenze.
Questa sezione è ricca di guide, tutorial e informazioni che ti aiuteranno a capire come gestire un ottimo nodo Rocket Pool.
