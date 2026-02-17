# Fee Distributor e lo Smoothing Pool

I node operator ricevono **priority fee** (**tip**) dalle transazioni che includono in qualsiasi blocco che propongono alla catena Ethereum.
Queste commissioni provengono e rimangono sul layer Execution.

A differenza della maggior parte delle ricompense di validazione che vengono generate sul layer Consensus e ritirate automaticamente periodicamente, queste commissioni sono _immediatamente liquide_.
In generale, le priority fee forniscono quasi tanto ETH quanto le ricompense Beacon Chain, quindi sono un ottimo vantaggio del Merge.

::: tip NOTA
Come rapido promemoria, ecco una ripartizione dei diversi tipi di ricompense e su quale layer vengono fornite:

- Layer Consensus: attestazioni, proposte di blocchi, sync committee, segnalazioni di slashing
- Layer Execution: priority fee e MEV (discusse nella prossima sezione) dalle proposte di blocchi

:::

## Fee Recipient

Quando proponi un blocco sulla catena Ethereum, il protocollo deve sapere dove inviare le tip di ogni transazione inclusa nel tuo blocco.
Non può inviarle all'indirizzo del tuo validator, perché è sul layer Consensus - non sul layer Execution.
Non può inviarle all'indirizzo del tuo minipool, perché deve funzionare anche per i solo staker e i solo staker non hanno un indirizzo sul layer Execution collegato ai loro validator come fa Rocket Pool.

Invece, il modo in cui funziona è abbastanza semplice: quando Rocket Pool avvia il tuo client Validator, passa un argomento chiamato **fee recipient**.
Il fee recipient è semplicemente un indirizzo sul layer Execution dove vuoi che vadano le tip.

Il `fee recipient` del tuo nodo può essere uno dei seguenti contratti speciali:

- Il tuo **Fee Distributor** personale del nodo
- Il contratto megapool del tuo nodo
- Lo **Smoothing Pool** (opt-in)

Lo Smart Node imposterà automaticamente il fee recipient corretto in base alla tua configurazione:

| Stato Smoothing Pool | Ha Validator Megapool | Ha Minipool | Fee Recipient |
|----------------------|-----------------------|-------------|---------------|
| Iscritto | No | Sì | Indirizzo Smoothing Pool |
| Iscritto | Sì | No | Indirizzo Smoothing Pool |
| Iscritto | Sì | Sì | Indirizzo Smoothing Pool (tutti i validator) |
| Non iscritto | No | Sì | Indirizzo contratto Fee Distributor |
| Non iscritto | Sì | No | Indirizzo contratto Megapool |
| Non iscritto | Sì | Sì | Validator megapool → Indirizzo Megapool<br>Validator minipool → Indirizzo Fee Distributor<br>(Impostato per validator tramite [keymanager API](https://ethereum.github.io/keymanager-APIs/#/Fee%20Recipient/setFeeRecipient)) |



Rocket Pool è progettato per distribuire equamente queste ricompense tra te e gli staker del pool rETH, nello stesso modo in cui distribuisce equamente le tue ricompense Beacon chain: la tua porzione di qualsiasi priority fee guadagnata dai tuoi validator minipool andrà a te (più la commissione media di tutti i tuoi minipool), e la porzione rimanente andrà agli staker del pool (meno la tua commissione media).
La porzione esatta dipende dal numero di minipool con bond da 8 ETH, minipool con bond da 16 ETH, e validator megapool con bond da 4 ETH che hai.

In breve, il **Fee Distributor** è un contratto unico collegato al tuo nodo che raccoglie e divide equamente le tue priority fee tra te e gli staker rETH.
È come il tuo caveau personale per le priority fee.
Chiunque (incluso tu) può distribuire il suo saldo in qualsiasi momento per garantire che le ricompense siano sempre disponibili per gli staker rETH.

Lo **Smoothing Pool** è un contratto speciale opt-in che consente a tutti i node operator partecipanti di aggregare e mettere insieme le loro priority fee e distribuirle equamente tra i partecipanti durante ogni intervallo di ricompense Rocket Pool (attualmente ogni 28 giorni) e gli staker del pool rETH.
Questa è una funzionalità molto interessante per i node operator che non vogliono preoccuparsi del fattore fortuna coinvolto nell'ottenere proposte di blocchi con priority fee elevate e preferirebbero avere un set di guadagni mensili bello, regolare e consistente.

Tratteremo entrambi di seguito in modo che tu comprenda la differenza e se vuoi o meno unirti allo Smoothing Pool.

::: tip NOTA
Per i minipool creati dopo il 28-10-2024, lo smoothing pool è FORTEMENTE raccomandato, poiché viene utilizzato per distribuire la commissione bonus. Se scegli di non partecipare allo smoothing pool, questi minipool riceveranno una commissione totale del 5%. Se partecipi allo smoothing pool, questi minipool riceveranno tra il 10% (nessun RPL in stake) e il 14% (stake RPL valutato al 10% dell'ETH preso in prestito o più) di commissione.
:::

## Il tuo Fee Distributor

Il tuo Fee Distributor è un contratto unico sul layer Execution che è **specifico per il tuo nodo**.
Conterrà tutte le priority fee che hai guadagnato nel tempo e contiene la logica necessaria per dividerle e distribuirle equamente agli staker del pool rETH e al tuo indirizzo di prelievo.
Questo processo di distribuzione **può essere chiamato da chiunque** (inclusi gli staker rETH) e può essere fatto **in qualsiasi momento**.
Non ha un limite di tempo prima che le ricompense scadano.

L'indirizzo del Fee Distributor del tuo nodo è **deterministicamente basato sul tuo indirizzo nodo**.
Ciò significa che è noto in anticipo, prima che il Fee Distributor sia stato creato.

I nuovi nodi Rocket Pool creeranno (inizializzeranno) automaticamente il contratto Fee Distributor del loro nodo al momento della registrazione.
Questo deve essere eseguito solo una volta.

Una ramificazione interessante di questo è che l'indirizzo del tuo Distributor potrebbe iniziare ad accumulare un saldo **prima** che tu abbia inizializzato il tuo contratto Fee Distributor.
Va bene, perché il tuo Distributor avrà accesso a tutto questo saldo esistente non appena lo inizializzi.

### Visualizzare il suo Indirizzo e Saldo

Puoi visualizzare l'indirizzo e il saldo del tuo fee distributor come parte di:

```shell
rocketpool node status
```

L'output apparirà così:

![](../node-staking/images/status-fee-distributor.png)

### Richiedere le commissioni dal tuo Fee Distributor

Puoi richiedere e distribuire l'intero saldo del tuo fee distributor usando il seguente comando:

```shell
rocketpool node distribute-fees
```

Questo invierà la tua quota delle ricompense al tuo **indirizzo di prelievo**.

::: warning NOTA SUGLI EVENTI TASSABILI
Ogni volta che crei un nuovo minipool, Rocket Pool chiamerà automaticamente `distribute-fees`.
Questo è per garantire che qualsiasi commissione tu abbia accumulato venga distribuita usando la commissione media del tuo nodo, che potrebbe cambiare quando crei il nuovo minipool. Questo non si applica alla creazione di validator megapool.

Inoltre, nota che chiunque può chiamare `distribute-fees` sul tuo fee distributor (per impedirti di tenere in ostaggio le ricompense rETH).
Potresti avere un evento tassabile ogni volta che questo metodo viene chiamato.

Tieni presenti queste condizioni quando decidi se utilizzare o meno lo Smoothing Pool (discusso di seguito).
:::

### Il Sistema di Penalità

Per garantire che i node operator non "imbroglino" modificando manualmente il fee recipient utilizzato nel loro client Validator, Rocket Pool impiega un sistema di penalità.

L'Oracle DAO è in grado di penalizzare i node operator che non seguono le regole del protocollo.

Se un nodo ha _scelto di non partecipare_ allo Smoothing Pool, i seguenti indirizzi sono considerati fee recipient validi:

- L'indirizzo rETH
- L'indirizzo dello Smoothing Pool
- Il contratto fee distributor del nodo
- Il contratto megapool del nodo

Se un nodo ha _scelto di partecipare_ allo Smoothing Pool, il seguente indirizzo è considerato un fee recipient valido:

- L'indirizzo dello Smoothing Pool

Un fee recipient diverso da uno degli indirizzi validi sopra è considerato **non valido**.

Il software Smart Node imposta automaticamente il fee recipient corretto in base alla tua configurazione (se sei iscritto allo Smoothing Pool e se hai validator megapool, minipool, o entrambi). Per i nodi con sia validator megapool che minipool mentre non sono iscritti, il fee recipient viene impostato per validator usando la keymanager API. L'elenco completo delle condizioni è riassunto [qui](/it/node-staking/fee-distrib-sp#fee-recipient).

Il software Smartnode è progettato per garantire che gli utenti onesti non vengano mai penalizzati, anche se deve portare offline il client Validator per farlo.
Se questo accade, smetterai di attestare e vedrai messaggi di errore nei tuoi file di log sul motivo per cui lo Smartnode non può impostare correttamente il tuo fee recipient.

## Lo Smoothing Pool

Lo **Smoothing Pool** è una funzionalità unica opt-in della rete Rocket Pool disponibile per i nostri node operator.
Essenzialmente, diventa il fee recipient per ogni node operator che sceglie di partecipare e accumula collettivamente le priority fee dai blocchi proposti da quei node operator in un grande pool. Durante un checkpoint delle ricompense Rocket Pool (gli stessi utilizzati per distribuire le ricompense RPL), il saldo ETH totale del pool viene distribuito equamente agli staker del pool e ai node operator che hanno scelto di partecipare.

In sostanza, lo Smoothing Pool è un modo per eliminare efficacemente la casualità associata all'essere selezionati per proposte di blocchi.
Se hai mai avuto una serie di sfortune e sei andato mesi senza una proposta, o se le tue proposte di blocchi hanno solo priority fee basse, potresti trovare lo Smoothing Pool molto interessante.

Per rendere la matematica facile da capire, il membro della community Ken Smith ha messo insieme un'[analisi massiccia](https://raw.githubusercontent.com/htimsk/SPanalysis/main/report/Analysis%20of%20the%20Smoothing%20Pool.pdf) che confronta la redditività dello Smoothing Pool e del Fee Distributor, riassunta bene con questo grafico:

![](../node-staking/images/sp-chart.png)

In breve, finché lo Smoothing Pool ha più minipool di quanti ne hai tu, è più probabile che tu ne esca avvantaggiato unendoti ad esso.

### Le Regole

Lo Smoothing Pool utilizza le seguenti regole:

- Durante un checkpoint delle ricompense Rocket Pool quando il saldo dello Smoothing Pool viene distribuito tra i node operator (tenendo conto della loro commissione), i node operator che fanno staking di RPL, gli staker rETH e potenzialmente il Rocket Pool DAO. Le percentuali esatte sono determinate dalla [governance del Protocol DAO (pDAO) di Rocket Pool](/it/pdao/overview)

- La scelta di partecipare allo Smoothing Pool viene fatta a **livello di nodo**. Se scegli di partecipare, tutti i tuoi minipool e i validator megapool partecipano.

- Chiunque può scegliere di partecipare in qualsiasi momento. Deve attendere un intero intervallo di ricompense (3 giorni su Hoodi, 28 giorni su Mainnet) prima di poter scegliere di uscire per prevenire il gaming del sistema (ad esempio uscire dallo SP subito dopo essere stati selezionati per proporre un blocco).
  - Una volta usciti, devono attendere un altro intero intervallo per scegliere di rientrare.

- Lo Smoothing Pool calcola la "quota" di ogni validator (porzione dell'ETH del pool per l'intervallo) posseduta da ogni nodo che ha scelto di partecipare.
  - La quota è una funzione della performance del tuo validator durante l'intervallo (calcolata guardando quante attestazioni hai inviato sulla Beacon Chain e quante hai perso) e della tua tariffa di commissione.

- La quota totale del tuo nodo è la somma delle quote dei tuoi validator.

- La quota totale del tuo nodo è scalata in base al tempo in cui sei stato partecipante.
  - Se sei stato partecipante per l'intero intervallo, ricevi la tua quota completa.
  - Se sei stato partecipante per il 30% di un intervallo, ricevi il 30% della tua quota completa.

Se sei interessato ai dettagli tecnici completi del calcolo delle ricompense dello Smoothing Pool, rivedi [la specifica completa qui](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/rewards-calculation-spec.md#smoothing-pool-rewards).

### Unirsi e Lasciare lo Smoothing Pool

Per scegliere di partecipare allo Smoothing Pool, esegui il seguente comando:

```shell
rocketpool node join-smoothing-pool
```

Questo ti registrerà come partecipante nei contratti Rocket Pool e cambierà automaticamente il `fee recipient` del tuo client Validator dal contratto distributor del tuo nodo al contratto dello Smoothing Pool.

Per lasciare il pool, esegui questo comando:

```shell
rocketpool node leave-smoothing-pool
```

Questo ti registrerà come non partecipante nei contratti Rocket Pool e, una volta passato un breve ritardo, cambierà automaticamente il `fee recipient` del tuo client Validator dal contratto dello Smoothing Pool al contratto Fee Distributor del tuo nodo.

### Rivendicare Ricompense dallo Smoothing Pool

Le ricompense dello Smoothing Pool sono raggruppate insieme a RPL alla fine di ogni intervallo di ricompense utilizzando il sistema di ricompense Redstone.
Rivendicarle è semplice come eseguire:

```shell
rocketpool node claim-rewards
```

Se hai scelto di partecipare allo Smoothing Pool, noterai che la quantità di ETH che ricevi per ogni intervallo è maggiore di zero:

```
Welcome to the new rewards system!
You no longer need to claim rewards at each interval - you can simply let them accumulate and claim them whenever you want.
Here you can see which intervals you haven't claimed yet, and how many rewards you earned during each one.

Rewards for Interval 0 (2022-08-04 01:35:39 -0400 EDT to 2022-09-01 01:35:39 -0400 EDT):
	Staking:        50.820133 RPL
	Smoothing Pool: 0.000000 ETH

Rewards for Interval 1 (2022-09-01 01:35:39 -0400 EDT to 2022-09-29 01:35:39 -0400 EDT):
	Staking:        40.668885 RPL
	Smoothing Pool: 0.096200 ETH

Total Pending Rewards:
	91.489018 RPL
	0.096200 ETH

Which intervals would you like to claim? Use a comma separated list (such as '1,2,3') or leave it blank to claim all intervals at once.
```

Nota che le ricompense dello Smoothing Pool nell'Intervallo 1 qui indicano che il nodo ha partecipato durante quell'intervallo e ha ricevuto ricompense di conseguenza.

Tratteremo di più sulla rivendicazione delle ricompense RPL e dello Smoothing Pool più avanti nella guida, nella sezione [Rivendicazione Ricompense](./rewards).

## Prossimi Passi

Una volta che hai deciso se vuoi o meno unirti allo Smoothing Pool, dai un'occhiata alla prossima sezione su MEV e le ricompense MEV.
