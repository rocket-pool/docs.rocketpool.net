# L'Aggiornamento Atlas

::: tip NOTA
Atlas è stato deployato il `18 aprile 2023, 00:00 UTC`. Visita [qui](../houston/whats-new) per leggere di Houston, l'ultimo aggiornamento del protocollo.
:::

Questa pagina descrive le principali modifiche che il prossimo grande aggiornamento di Rocket Pool, intitolato **Atlas**, porta al protocollo, inclusi aggiornamenti sia allo stack Smartnode che al protocollo Rocket Pool in generale.

Leggi attentamente questa pagina per comprendere tutte le differenze tra la versione precedente di Rocket Pool (Redstone) e Atlas.

## Nuove Funzionalità del Protocollo

Atlas introduce alcune entusiasmanti nuove funzionalità basate sia sul feedback della comunità che sui cambiamenti al protocollo Ethereum stesso.
Di seguito è riportato un breve elenco di questi cambiamenti - clicca su uno qualsiasi di essi per saperne di più.

### Shapella e Prelievi

Il protocollo Ethereum si sta preparando a subire il suo prossimo grande aggiornamento: **Shanghai** sul layer Execution e **Capella** sul layer Consensus - poiché questi sono ora interconnessi, entrambi si verificheranno contemporaneamente.
Gli utenti di Ethereum hanno affettuosamente iniziato a chiamare l'aggiornamento combinato [**"Shapella"**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement) di conseguenza.

Shapella introduce i **prelievi** alla Beacon Chain, il che significa che i node operator ora possono accedere agli ETH che sono attualmente bloccati sulla Beacon Chain.
Questo si presenta in due versioni:

- Prelievi parziali (**skimming**), dove le tue ricompense (il tuo saldo Beacon Chain in eccesso rispetto a 32 ETH) vengono inviate al tuo minipool sul layer Execution. Questo viene fatto _automaticamente dal protocollo stesso_ ogni tanto (circa una volta ogni quattro o cinque giorni su Mainnet).
- **Prelievi completi**, dove esci dal tuo validator dalla Beacon Chain e il suo intero saldo viene inviato al tuo minipool sul layer Execution. Questo viene fatto _automaticamente dal protocollo stesso_ una volta che il tuo validator è stato uscito dalla chain abbastanza a lungo.

Atlas introduce un nuovo contratto delegato per i minipool che consente ai node operator di **distribuire** il saldo ETH del minipool, dividendolo equamente tra il node operator e i possessori di rETH (più la commissione, ovviamente) in qualsiasi momento.
Questo dà ai node operator **accesso immediato** alle loro ricompense della Beacon Chain!
Inoltre rimette la quota dei possessori di rETH nel deposit pool, in modo che possa essere utilizzata per unstake rETH per ETH al tasso di cambio del protocollo (o per creare nuovi minipool).

### Minipool con Bond di 8 ETH

Uno dei cambiamenti più attesi apportati in Atlas è l'introduzione della possibilità di fornire solo 8 ETH per creare un minipool invece di 16 ETH.
I minipool con solo 8 ETH vincolati dal loro node operator proprietario vengono abbinati a **24 ETH** dal staking pool (fornito dai possessori di rETH) per creare un validator.
Questo riduce significativamente il requisito di capitale per gestire il proprio validator _e_ si traduce in maggiori rendimenti sia per il node operator che per gli staker rETH!
Infatti, gestire due minipool da 8 ETH invece di un minipool da 16 ETH fornirà **oltre il 18% di ricompense in più** - anche se il minipool da 16 ETH ha un tasso di commissione del 20%.

La creazione di un minipool da 8 ETH richiede di stakare un **minimo di 2,4 ETH di valore in RPL** e un **massimo di 12 ETH di valore in RPL**.
Questi rappresentano il 10% dell'importo che stai _prendendo in prestito_ dal protocollo e il 150% dell'importo che stai _vincolando_ (stakando) tu stesso.

I nuovi minipool possono essere creati con 8 ETH o 16 ETH.
I minipool da 16 ETH non sono cambiati rispetto a come funzionano oggi e sono disponibili per gli utenti che vogliono minimizzare la loro esposizione al token RPL.

Per imparare come creare nuovi minipool utilizzando un bond di 8 ETH, visita la [guida alla creazione di minipool](../../node-staking/create-validator.mdx).

Inoltre, una volta applicato Atlas, i node operator possono **migrare i minipool esistenti da 16 ETH direttamente in minipool da 8 ETH senza dover uscire**.
Questo restituirà loro 8 ETH in [credito di deposito](../../node-staking/credit), che può essere utilizzato per creare un **nuovo minipool da 8 ETH gratuitamente**!

Per saperne di più sui minipool con bond da 8 ETH, visita la [guida alla riduzione del bond](../../node-staking/leb-migration.mdx).

### Conversione di Validator Solo

Parte dell'aggiornamento Shapella prevede la possibilità per i validator solo di [cambiare le credenziali di prelievo dei loro validator](https://notes.ethereum.org/@launchpad/withdrawals-faq) dalla chiave di prelievo originale basata su BLS (ora inutilizzata) a un indirizzo sul layer Execution.
Questo indirizzo sarà il destinatario di tutte le ricompense di quel validator e del suo saldo ETH completo una volta che esce dalla Beacon Chain.

I regolari node operator di Rocket Pool non devono preoccuparsi di tutto questo, poiché il protocollo ha configurato automaticamente questo per i tuoi minipool quando li hai creati.
_Tuttavia_, come parte di questo nuovo requisito per i validator solo, Atlas porta un'opportunità entusiasmante: la possibilità di **creare un minipool speciale** che diventerà l'indirizzo di prelievo per il tuo **validator solo esistente**.

In altre parole, questo ti permetterà di **convertire direttamente un validator solo in un minipool Rocket Pool senza dover uscire**!

Questo significa che otterrai tutti i vantaggi dei minipool Rocket Pool, inclusi:

- La possibilità di convertire il tuo unico validator (con un bond di 32 ETH) in **quattro minipool** (ciascuno con un bond di 8 ETH), **quadruplicando** efficacemente la tua presenza sulla Beacon Chain
- Commissione sulla porzione di quei minipool fornita dagli staker rETH
- Accesso alla [Smoothing Pool](../../node-staking/fee-distrib-sp#the-smoothing-pool) di Rocket Pool per raggruppare e distribuire uniformemente le ricompense dalle proposte di blocco e MEV

Per saperne di più sulla conversione di un validator solo in un minipool, visita la guida [Convertire un Validator Solo in un Minipool](../../node-staking/solo-staker-migration).

## Nuove Funzionalità dello Smartnode

Oltre alle modifiche principali al protocollo Rocket Pool, Atlas porta anche alcuni entusiasmanti aggiornamenti allo stack Smartnode stesso presenti nella v1.9.0.

### Distribuzioni Automatiche delle Ricompense

Se sei già un node operator attivo di Rocket Pool, potresti avere familiarità con il processo `rocketpool_node` che gestisce determinati processi automatizzati.
Ad esempio, assicura che tu abbia il fee recipient corretto ed esegue automaticamente la seconda transazione `stake` per te dopo che i minipool `prelaunch` superano il controllo di scrub di 12 ore.

A partire da Atlas, il `node` ha un nuovo dovere: **distribuzione automatica delle ricompense del minipool**!
Questo è dovuto al modo in cui [funziona l'aggiornamento Shapella](../../node-staking/skimming), skimmando le tue ricompense dalla Beacon Chain nel tuo minipool ogni pochi giorni.

Ogni volta che uno dei tuoi minipool raggiunge un saldo superiore a una soglia specificata dall'utente (predefinita di 1 ETH), il nodo eseguirà automaticamente `distribute-balance` su di esso.
Questo invierà la tua porzione delle ricompense al tuo indirizzo di prelievo e la porzione dello staker del pool di nuovo al deposit pool.

La modifica della soglia può essere effettuata nella sezione `Smartnode and TX Fees` del TUI `service config`, nell'impostazione `Auto-Distribute Threshold`.

### Dashboard Grafana Unificato

A grande richiesta, abbiamo creato un nuovo [**dashboard Grafana**](https://grafana.com/grafana/dashboards/21863) per aiutare i node operator a monitorare e valutare lo stato, i progressi e la salute generale dei loro nodi:

![](../../node-staking/images/grafana-1.3.jpg)

Viene fornito con le seguenti funzionalità molto richieste:

- Supporto per tutti i client Execution e Consensus in un unico dashboard - non è più necessario cambiare dashboard in base ai client che stai utilizzando!
- Statistiche del client Execution, incluso l'utilizzo di CPU e RAM e il conteggio dei peer
- Monitoraggio dell'accuratezza dell'attestazione che segue quanto "corrette" sono state le tue attestazioni per l'epoca precedente, così sai quanto sei lontano dalle ricompense ottimali
- Monitoraggio del saldo della Smoothing Pool
- Monitoraggio delle ricompense richieste e non richieste, ora incluso ETH dalla Smoothing Pool
- Statistiche sui voti di governance basati su Snapshot di Rocket Pool
- Spazio per monitorare lo spazio usato e la temperatura di un secondo SSD se ne hai uno per il tuo OS e uno diverso per i dati della chain
- E altro ancora!

Puoi importare il nuovo dashboard dal servizio Grafana ufficiale utilizzando l'ID `21863` seguendo la nostra [guida Grafana](../../node-staking/grafana.mdx).

Questo nuovo dashboard è stato un lavoro d'amore che ha coinvolto un aiuto estensivo dal membro della comunità **0xFornax** - grazie per tutto il tuo duro lavoro!

### Modifiche a Nimbus

Smartnode v1.9.0 introduce il **supporto per la modalità divisa** per Nimbus!
Invece di eseguire il Beacon Node e il Validator Client all'interno di un singolo processo / container, lo Smartnode ora li eseguirà in container separati come gli altri client. Questo ha i seguenti vantaggi:

- Nimbus ora supporta i **client di fallback** (un client Execution secondario e un Beacon Node a cui il Validator Client di Nimbus può connettersi quando i tuoi client primari sono inattivi per manutenzione, come la risincronizzazione).
- Nimbus è ora supportato in **Modalità Esternamente Gestita (Ibrida)**, quindi puoi accoppiare il Validator Client gestito dallo Smartnode a un Beacon Node esterno che mantieni da solo.
- Il Beacon Node non deve più essere riavviato dopo l'aggiunta di nuovi minipool, il che significa che non perdi attestazioni mentre si riconnette ai suoi peer.

### Supporto Lodestar

[Lodestar](https://chainsafe.github.io/lodestar/) è ora supportato come opzione per il tuo Consensus Client di scelta!
Questa è l'aggiunta più recente ad essere ufficialmente accettata sul [Launchpad di Ethereum](https://launchpad.ethereum.org/en/lodestar) ed è pronta per la validazione.
Lodestar supporta molte delle grandi funzionalità che hai imparato ad amare dagli altri client, inclusa Doppelganger Detection, MEV-Boost, client gestiti esternamente (Modalità Ibrida) e altro ancora!

### Nuovo Sistema di Snapshot della Rete

Su una nota un po' più tecnica, la v1.9.0 introduce un nuovo sistema per catturare rapidamente uno snapshot dello stato di **tutto ciò che riguarda il tuo nodo** sia sui layer Execution che Consensus.
Sotto il cofano, questo sistema sfrutta [il contratto multicall di MakerDAO](https://github.com/makerdao/multicall) e il [contratto Ethereum Balance Checker di Will O'Beirne](https://github.com/wbobeirne/eth-balance-checker) per raggruppare migliaia di singole query del client Execution in un'unica richiesta.

Questo rende il processo `node` molto meno gravoso sul client Execution per i node operator con un gran numero di validator e dovrebbe ridurre significativamente il suo carico CPU, il che migliorerà le attestazioni e le ricompense complessive.

Questo nuovo sistema non è ancora arrivato nella CLI stessa, quindi qualsiasi comando che esegui lì (come `rocketpool minipool status`) utilizzerà ancora il vecchio setup a singola query.
Nel tempo lo introdurremo anche nella CLI, il che renderà tutti i suoi comandi velocissimi (_tranne l'attesa che le transazioni vengano validate, quella richiede ancora un po' di tempo_).
