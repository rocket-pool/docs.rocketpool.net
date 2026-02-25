# L'Aggiornamento Atlas

::: tip NOTA
Atlas è stato distribuito il `18 aprile 2023, 00:00 UTC`. Si prega di visitare [qui](../houston/whats-new) per leggere su Houston, l'ultimo aggiornamento del protocollo.
:::

Questa pagina descrive i principali cambiamenti che il prossimo grande aggiornamento di Rocket Pool, intitolato **Atlas**, porta al protocollo, inclusi aggiornamenti sia allo stack Smartnode che al protocollo Rocket Pool in generale.

Si prega di leggere attentamente questa pagina per comprendere tutte le differenze tra la versione precedente di Rocket Pool (Redstone) e Atlas.

## Nuove Funzionalità del Protocollo

Atlas introduce alcune entusiasmanti nuove funzionalità che si basano sia sul feedback della comunità che sui cambiamenti al protocollo Ethereum stesso.
Di seguito è riportato un breve elenco di questi cambiamenti - cliccare su uno qualsiasi di essi per saperne di più.

### Shapella e Prelievi

Il protocollo Ethereum si sta preparando a subire il suo prossimo grande aggiornamento: **Shanghai** sul layer di Esecuzione, e **Capella** sul layer di Consenso - poiché questi sono ora interconnessi, entrambi avverranno contemporaneamente.
Gli utenti di Ethereum hanno affettuosamente chiamato l'aggiornamento combinato [**"Shapella"**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement) di conseguenza.

Shapella introduce i **prelievi** alla Beacon Chain, il che significa che gli operatori dei nodi sono ora in grado di accedere all'ETH che è attualmente bloccato sulla Beacon Chain.
Questo si presenta in due varianti:

- Prelievi parziali (**skimming**), dove le vostre ricompense (il vostro saldo in eccesso sulla Beacon Chain oltre 32 ETH) vengono inviate al vostro minipool sul Layer di Esecuzione. Questo viene fatto _automaticamente dal protocollo stesso_ di tanto in tanto (circa una volta ogni quattro o cinque giorni su Mainnet).
- **Prelievi completi**, dove uscite con il vostro validatore dalla Beacon Chain e il suo intero saldo viene inviato al vostro minipool sul Layer di Esecuzione. Questo viene fatto _automaticamente dal protocollo stesso_ una volta che il vostro validatore è uscito dalla chain da abbastanza tempo.

Atlas introduce un nuovo contratto delegato per i minipool che consente agli operatori dei nodi di **distribuire** il saldo ETH del minipool, dividendolo equamente tra l'operatore del nodo e i detentori di rETH (più la commissione, ovviamente) in qualsiasi momento.
Questo dà agli operatori dei nodi **accesso immediato** alle loro ricompense della Beacon Chain!
Inoltre, rimette la quota dei detentori di rETH nel deposit pool, quindi può essere utilizzata per fare unstake di rETH per ETH al tasso di cambio del protocollo (o per creare nuovi minipool).

### Minipool con Bond di 8 ETH

Uno dei cambiamenti più attesi apportati in Atlas è l'introduzione della possibilità di fornire solo 8 ETH per creare un minipool invece di 16 ETH.
I minipool con solo 8 ETH vincolati dal loro operatore del nodo proprietario vengono abbinati con **24 ETH** dal pool di staking (forniti dai detentori di rETH) per creare un validatore.
Questo riduce significativamente il requisito di capitale per gestire il proprio validatore _e_ si traduce in maggiori rendimenti sia per l'operatore del nodo che per gli staker di rETH!
Infatti, gestire due minipool da 8 ETH invece di un minipool da 16 ETH fornirà **oltre il 18% in più di ricompense** - anche se il minipool da 16 ETH ha un tasso di commissione del 20%.

La creazione di un minipool da 8 ETH richiede che tu faccia staking di un **minimo di 2,4 ETH in valore di RPL** e un **massimo di 12 ETH in valore di RPL**.
Questi rappresentano il 10% dell'importo che stai _prendendo in prestito_ dal protocollo, e il 150% dell'importo che stai _vincolando_ (staking) tu stesso.

I nuovi minipool possono essere creati con 8 ETH o 16 ETH.
I minipool da 16 ETH sono invariati rispetto a come funzionano oggi, e sono disponibili per gli utenti che desiderano minimizzare la loro esposizione al token RPL.

Per imparare come creare nuovi minipool usando un bond di 8 ETH, si prega di visitare la [guida alla creazione di minipool](../../node-staking/create-validator.mdx).

Inoltre, una volta applicato Atlas, gli operatori dei nodi possono **migrare i minipool esistenti da 16 ETH direttamente in minipool da 8 ETH senza bisogno di uscire**.
Questo gli restituirà 8 ETH in [credito di deposito](../../node-staking/credit), che può essere utilizzato per creare un **nuovo minipool da 8 ETH gratuitamente**!

Per saperne di più sui minipool con bond da 8 ETH, si prega di visitare la [guida alla riduzione del bond](../../node-staking/leb-migration.mdx).

### Conversione di Validatore Solo

Parte dell'aggiornamento Shapella implica la possibilità per i validatori solo di [cambiare le credenziali di prelievo dei loro validatori](https://notes.ethereum.org/@launchpad/withdrawals-faq) dalla chiave di prelievo originale basata su BLS (ora inutilizzata) a un indirizzo sul layer di Esecuzione.
Questo indirizzo sarà il destinatario di tutte le ricompense di quel validatore e del suo saldo ETH completo una volta che esce dalla Beacon Chain.

I normali operatori dei nodi di Rocket Pool non devono preoccuparsi di nulla di tutto ciò, poiché il protocollo ha impostato automaticamente questo per i vostri minipool quando li avete creati.
_Tuttavia_, come parte di questo nuovo requisito per i validatori solo, Atlas porta un'opportunità entusiasmante: la possibilità di **creare un minipool speciale** che diventerà l'indirizzo di prelievo per il vostro **validatore solo esistente**.

In altre parole, questo vi permetterà di **convertire direttamente un validatore solo in un minipool di Rocket Pool senza bisogno di uscire!**

Questo significa che otterrete tutti i vantaggi dei minipool di Rocket Pool, inclusi:

- La possibilità di convertire il vostro unico validatore (con un bond di 32 ETH) in **quattro minipool** (ciascuno con un bond di 8 ETH), effettivamente **quadruplicando** la vostra presenza sulla Beacon Chain
- Commissione sulla porzione di quei minipool fornita dagli staker di rETH
- Accesso alla [Smoothing Pool](../../node-staking/fee-distrib-sp#the-smoothing-pool) di Rocket Pool per raccogliere e distribuire uniformemente le ricompense dalle proposte di blocchi e MEV

Per saperne di più sulla conversione di un validatore solo in un minipool, si prega di visitare la guida [Conversione di un Validatore Solo in un Minipool](../../node-staking/solo-staker-migration).

## Nuove Funzionalità Smartnode

Oltre ai cambiamenti fondamentali al protocollo Rocket Pool, Atlas porta anche alcuni entusiasmanti aggiornamenti allo stack Smartnode stesso che sono presenti nella v1.9.0.

### Distribuzioni Automatiche delle Ricompense

Se sei già un operatore di nodi Rocket Pool attivo, potresti avere familiarità con il processo `rocketpool_node` che gestisce determinati processi automatizzati.
Ad esempio, assicura che tu abbia il destinatario delle commissioni corretto ed esegue automaticamente la seconda transazione `stake` per te dopo che i minipool `prelaunch` passano il controllo di scrub di 12 ore.

A partire da Atlas, il `node` ha un nuovo compito: **distribuzione automatica delle ricompense del minipool!**
Questo è dovuto al modo in cui funziona [l'aggiornamento Shapella](../../node-staking/skimming), prelevando le vostre ricompense dalla Beacon Chain nel vostro minipool ogni pochi giorni.

Ogni volta che uno dei vostri minipool raggiunge un saldo maggiore di una soglia specificata dall'utente (predefinita di 1 ETH), il nodo eseguirà automaticamente `distribute-balance` su di esso.
Questo invierà la vostra porzione delle ricompense al vostro indirizzo di prelievo, e la porzione dello staker del pool di nuovo al deposit pool.

La modifica della soglia può essere effettuata nella sezione `Smartnode and TX Fees` della TUI `service config`, sotto l'impostazione `Auto-Distribute Threshold`.

### Dashboard Grafana Unificata

Su richiesta popolare, abbiamo creato una nuova [**dashboard Grafana**](https://grafana.com/grafana/dashboards/24900-rocket-pool-dashboard-v1-4-0/) per aiutare gli operatori dei nodi a tracciare e valutare lo stato, il progresso e la salute generale dei loro nodi:

![](../../node-staking/images/grafana-1.3.jpg)

Viene fornita con le seguenti funzionalità molto richieste:

- Supporto per tutti i client di Esecuzione e Consenso in una singola dashboard - non più cambiare dashboard in base ai client che stai usando!
- Statistiche del client di Esecuzione, incluso l'uso di CPU e RAM, e il conteggio dei peer
- Tracciamento dell'accuratezza delle attestazioni che segue quanto "corrette" sono state le vostre attestazioni per l'epoca precedente, quindi sapete quanto siete lontani dalle ricompense ottimali
- Tracciamento del saldo della Smoothing Pool
- Tracciamento delle ricompense rivendicate e non rivendicate, ora incluso l'ETH dalla Smoothing Pool
- Statistiche sui voti di governance basati su Snapshot di Rocket Pool
- Spazio per tracciare lo spazio utilizzato e la temperatura di un secondo SSD se ne hai uno per il tuo OS e uno diverso per i dati della chain
- E altro ancora!

Puoi importare la nuova dashboard dal servizio ufficiale Grafana usando l'ID `21863` seguendo la nostra [guida Grafana](../../node-staking/grafana.mdx).

Questa nuova dashboard è stata un lavoro d'amore che ha coinvolto un ampio aiuto dal membro della comunità **0xFornax** - grazie per tutto il tuo duro lavoro!

### Modifiche Nimbus

Smartnode v1.9.0 introduce il **supporto della modalità split** per Nimbus!
Invece di eseguire il Beacon Node e il Validator Client all'interno di un singolo processo / container, lo Smartnode ora li eseguirà in container separati come gli altri client. Questo ha i seguenti vantaggi:

- Nimbus ora supporta **client di fallback** (un client di Esecuzione secondario e un Beacon Node a cui il Validator Client di Nimbus può connettersi quando i tuoi client primari sono inattivi per manutenzione, come la risincronizzazione).
- Nimbus è ora supportato nella **Modalità Gestita Esternamente (Ibrida)**, quindi puoi accoppiare il Validator Client che lo Smartnode gestisce a un Beacon Node esterno che mantieni da solo.
- Il Beacon Node non ha più bisogno di essere riavviato dopo l'aggiunta di nuovi minipool, il che significa che non perdi attestazioni mentre si riconnette ai suoi peer.

### Supporto Lodestar

[Lodestar](https://chainsafe.github.io/lodestar/) è ora supportato come opzione per il tuo Consensus Client di scelta!
Questa è l'ultima aggiunta ad essere ufficialmente accettata sul [Launchpad di Ethereum](https://launchpad.ethereum.org/en/lodestar), ed è pronta per la validazione.
Lodestar supporta molte delle grandi funzionalità che hai imparato ad amare dagli altri client, inclusi Doppelganger Detection, MEV-Boost, client gestiti esternamente (Hybrid Mode), e altro ancora!

### Nuovo Sistema di Snapshot della Rete

Su una nota leggermente più tecnica, la v1.9.0 introduce un sistema completamente nuovo per catturare rapidamente uno snapshot dello stato di **tutto ciò che riguarda il tuo nodo** sia sul layer di Esecuzione che su quello di Consenso.
Sotto il cofano, questo sistema sfrutta [il contratto multicall di MakerDAO](https://github.com/makerdao/multicall) e [il contratto Ethereum Balance Checker di Will O'Beirne](https://github.com/wbobeirne/eth-balance-checker) per raggruppare migliaia di singole query del client di Esecuzione in un'unica richiesta.

Questo rende il processo `node` molto meno oneroso sul client di Esecuzione per gli operatori di nodi con un gran numero di validatori, e dovrebbe ridurre significativamente il suo carico di CPU che migliorerà le attestazioni e le ricompense complessive.

Questo nuovo sistema non è ancora arrivato nella CLI stessa, quindi qualsiasi comando che esegui lì (come `rocketpool minipool status`) utilizzerà ancora la vecchia configurazione a query singola.
Nel tempo lo introdurremo anche nella CLI, il che renderà tutti i suoi comandi fulminei (_tranne che per l'attesa della validazione delle transazioni, che richiede ancora tempo_).
