# L'Aggiornamento Redstone di Rocket Pool

Il prossimo importante aggiornamento di Rocket Pool, intitolato **Redstone**, è stato rilasciato per i test beta sulle reti di test Ropsten e Holesky.
Questa pagina descrive i principali cambiamenti che Redstone introduce, inclusi aggiornamenti sia allo stack Smartnode che al protocollo Rocket Pool in generale.

Leggi attentamente questa pagina per comprendere tutte le differenze tra la versione precedente di Rocket Pool e Redstone.

::: tip ATTENZIONE
Per informazioni dettagliate su come preparare il tuo nodo per l'aggiornamento e cosa fare dopo l'aggiornamento, consulta le seguenti guide:

- [Guida per la Modalità Docker](./docker-migration.mdx)
- [Guida per la Modalità Ibrida](./hybrid-migration.mdx)
- [Guida per la Modalità Nativa](./native-migration.mdx)

:::

## Modifiche ai Client e The Merge

Ropsten (e a breve, Holesky) ha completato con successo **The Merge dei Livelli Execution e Consensus**.
Non utilizza più la Proof-of-Work; invece, i validatori su Ropsten sono ora responsabili della creazione e della proposta di blocchi su entrambe le chain.
Sebbene questo porti alcuni interessanti benefici finanziari (che saranno discussi più avanti), comporta anche alcune modifiche importanti al modo in cui operano i validatori.

Di seguito è riportato un breve riepilogo delle modifiche al comportamento dei client come parte di The Merge:

- Il tuo client Execution ora utilizza tre porte API:
  - Una per l'accesso HTTP alla sua API (**default 8545**)
  - Una per l'accesso Websocket alla sua API (**default 8546**)
  - Una per la nuova **Engine API** utilizzata dai client Consensus dopo The Merge (**default 8551**)

- I client Execution ora richiedono un client Consensus per funzionare, e i client Consensus ora richiedono un client Execution per funzionare.
  - **Nessuno dei due può più operare in isolamento.**

- Un client Execution deve essere collegato a uno, e solo uno, client Consensus (e viceversa).
  - Non sarà possibile collegare più client Execution a un singolo client Consensus, o più client Consensus a un singolo client Execution.
  - A causa di questo, **i client execution di fallback non sono più disponibili** per i Node Operator di Rocket Pool.

- Sono richiesti **client execution completi**.
  - I provider remoti (come Infura e Pocket) non possono più essere utilizzati da alcun validatore, Rocket Pool o altro.

## Fee Recipient e il Tuo Distributor

Poiché i validatori sono ora responsabili della creazione di blocchi, ciò significa che ricevono le **priority fee** (note anche come **tips**) associate a ciascuna transazione.
Queste commissioni sono pagate in ETH e vengono fornite direttamente a te ogni volta che uno dei tuoi validatori minipool propone un blocco.
A differenza dell'ETH bloccato sulla Beacon Chain, **non devi aspettare i prelievi per accedere alle tue priority fee**!
Ti vengono semplicemente assegnate come parte del processo di proposta del blocco.

Per sapere dove inviare le commissioni, il tuo Validator Client richiede un parametro aggiuntivo noto come `fee recipient`.
Questo è l'indirizzo sul Livello Execution (ETH1) a cui verranno inviate tutte le priority fee guadagnate dal tuo nodo durante le proposte di blocchi.

Rocket Pool è progettato per distribuire equamente queste ricompense, allo stesso modo in cui distribuisce equamente le tue ricompense sulla Beacon chain: metà delle priority fee guadagnate dai tuoi validatori minipool andrà a te (più la commissione media di tutti i tuoi minipool), e l'altra metà andrà agli staker del pool (meno la tua commissione media).

A tal fine, lo Smartnode imposterà automaticamente il `fee recipient` del tuo Validator Client su un indirizzo speciale noto come **fee distributor** del tuo nodo.
Il tuo fee distributor è un contratto unico sul Livello Execution che è **specifico per il tuo nodo**.
Conterrà tutte le priority fee che hai guadagnato nel tempo e contiene la logica necessaria per dividerle e distribuirle equamente.
Questo processo di distribuzione è controllato da te (il Node Operator) e può essere eseguito quando preferisci.
Non ha un limite di tempo.

L'indirizzo del fee distributor del tuo nodo è **deterministicamente basato sull'indirizzo del tuo nodo**.
Ciò significa che è noto in anticipo, prima ancora che il fee distributor venga creato.
**Lo Smartnode utilizzerà questo indirizzo come tuo fee recipient.**

::: tip NOTA
Per impostazione predefinita, il tuo fee recipient sarà impostato sull'**indirizzo rETH** quando installi Smartnode v1.5.0 (se gli aggiornamenti del contratto Redstone non sono ancora stati distribuiti).
Lo Smartnode aggiornerà automaticamente questo all'indirizzo del fee distributor del tuo nodo una volta che l'aggiornamento Redstone sarà stato distribuito.

Un'eccezione a questa regola è se hai optato per il **Smoothing Pool** - vedi la sezione alla fine di questa pagina per maggiori informazioni.
:::

I nuovi nodi Rocket Pool inizializzeranno automaticamente il contratto distributor del loro nodo al momento della registrazione.
I nodi esistenti dovranno eseguire questo processo manualmente.
Questo deve essere eseguito solo una volta.

Una conseguenza interessante di questo è che l'indirizzo del tuo distributor potrebbe iniziare ad accumulare un saldo **prima** che tu abbia inizializzato il contratto del distributor del nodo.
Questo va bene, perché il tuo distributor otterrà l'accesso a tutto questo saldo esistente non appena lo inizializzi.

Puoi visualizzare il saldo del tuo fee distributor come parte di:

```shell
rocketpool node status
```

L'output apparirà così:

![](../../node-staking/images/status-fee-distributor.png)

Per inizializzare il distributor del tuo nodo, esegui semplicemente questo nuovo comando:

```shell
rocketpool node initialize-fee-distributor
```

::: warning NOTA
Dopo l'aggiornamento Redstone, devi chiamare questa funzione prima di poter creare nuovi minipool con `rocketpool node deposit`.
:::

Quando il tuo distributor è stato inizializzato, puoi richiedere e distribuire il suo intero saldo utilizzando il seguente comando:

```shell
rocketpool node distribute-fees
```

Questo invierà la tua quota delle ricompense al tuo **indirizzo di prelievo**.

## Modifiche al Protocollo Rocket Pool

Oltre alle modifiche ai client Execution e Consensus e alle nuove priority fee, il protocollo Rocket Pool stesso ha subito alcune modifiche importanti di cui dovresti essere consapevole.

### Nuovo Sistema di Ricompense

Una delle modifiche più significative introdotte con l'aggiornamento Redstone è il **nuovo sistema di ricompense**.
Questa è una revisione completa del modo in cui i Node Operator ricevono le loro ricompense RPL (ed ETH dal Smoothing Pool - discusso più avanti).

Il _vecchio_ sistema di ricompense aveva i seguenti svantaggi:

- Il claim costava circa 400k gas, che è piuttosto costoso.
- I Node Operator dovevano richiedere le ricompense a ogni intervallo (ogni 28 giorni), o le avrebbero perse. Ciò significava che i costi del gas potevano diventare proibitivamente costosi per i Node Operator con piccole quantità di RPL.
- Le ricompense erano determinate al momento del _claim_, non al momento del checkpoint. Se un utente faceva staking di una quantità significativa di RPL tra il checkpoint e il tuo claim, le tue ricompense potevano essere diluite e avresti ricevuto meno RPL di quanto ti aspettavi.

Il _nuovo_ sistema di claim risolve tutti questi problemi.

A ogni intervallo, l'Oracle DAO creerà collettivamente un **vero snapshot** dello stato dei Node Operator nella rete Rocket Pool, inclusi tutti i loro importi di stake effettivi.
Queste informazioni vengono compilate in un [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree) - un modo estremamente efficiente per rendere tutti i dettagli disponibili agli smart contract.
Il Merkle Tree viene incorporato in un file JSON e ospitato sull'[InterPlanetary File System (IPFS)](https://en.wikipedia.org/wiki/InterPlanetary_File_System), e la radice del Merkle Tree viene inviata ai contratti.

Questo nuovo sistema ha le seguenti caratteristiche:

- Ora puoi **lasciare accumulare le ricompense** per tutto il tempo che desideri. Non c'è più un limite di tempo su quando devi richiedere.
- Puoi richiedere **più intervalli** tutti in una volta.
- La tua prima transazione di claim utilizza circa 85k gas. Ogni transazione di claim successiva costa circa 55k gas.
  - Se stai richiedendo più intervalli contemporaneamente, ogni intervallo supplementare costa **6k gas**, quindi è più conveniente richiederli quanti più possibile in una volta.
- Le tue ricompense RPL **non vengono più diluite** - le tue ricompense RPL sono fissate al momento dello snapshot, e sei sempre idoneo per quell'importo.
- Puoi **restakare parte (o tutta) delle tue ricompense RPL** come parte della transazione di claim, il che riduce ulteriormente i requisiti di gas rispetto a oggi.
- Attualmente, **tutti i tuoi claim devono essere su Mainnet** ma abbiamo l'infrastruttura in atto per costruire la capacità di richiedere su reti Layer 2 in una data successiva.

Quando il tuo nodo rileva un nuovo checkpoint di ricompense, scaricherà automaticamente il file JSON per quell'intervallo.
Puoi quindi rivedere le tue ricompense utilizzando il seguente comando:

```shell
rocketpool node claim-rewards
```

Man mano che gli intervalli passano e accumuli ricompense, l'output apparirà così:

![](../../node-staking/images/claim-rewards-gb.png)

Qui puoi vedere rapidamente quante ricompense hai guadagnato a ogni intervallo e puoi decidere quali vuoi richiedere.
Nota che **il tempo di intervallo di Ropsten è impostato a 1 giorno per facilitare i test.**

Puoi anche specificare un importo che vuoi restakare durante questo claim:

![](../../node-staking/images/autostake.png)

Questo ti permetterà di comporre le tue ricompense RPL in una transazione, utilizzando sostanzialmente meno gas di quanto sia necessario utilizzare oggi.

::: tip NOTA
Se preferisci costruire manualmente il checkpoint delle ricompense invece di scaricare quello creato dall'Oracle DAO, puoi modificare questa impostazione da `Download` a `Generate` nella TUI:

![](../../node-staking/images/tui-generate-tree.png)

Come implica il suggerimento, avrai bisogno di accesso a un nodo archive per farlo.
Se il tuo client Execution locale non è un nodo archive, puoi specificarne uno separato (come Infura o Alchemy) nella casella `Archive-Mode EC URL` sotto di esso.
Questo URL verrà utilizzato solo quando si generano Merkle tree; non verrà utilizzato per i compiti di validazione.
:::

::: danger ATTENZIONE
Se sei sotto il 10% di collaterale RPL _al momento dello snapshot_, non sarai idoneo per le ricompense per quello snapshot.
A differenza del sistema attuale, dove puoi semplicemente "riempire" prima di richiedere per diventare nuovamente idoneo, questo sarà bloccato in quello snapshot per sempre e **non riceverai mai ricompense per quel periodo**.
**Devi** essere sopra il 10% di collaterale al momento di uno snapshot per ricevere ricompense per quel periodo.
:::

### Smoothing Pool

Un'ultima nuova funzionalità interessante dell'aggiornamento Redstone è il **Smoothing Pool**.
Il Smoothing Pool è **una funzionalità opt-in** che raggrupperà collettivamente le priority fee di ogni membro che ha optato per essa.
Durante un checkpoint di ricompense, il saldo ETH totale del pool viene diviso in una porzione per gli staker del pool e una porzione per i Node Operator.
Tutte le ricompense nella porzione Node Operator vengono **distribuite equamente a ogni membro del pool**.

In sostanza, il Smoothing Pool è un modo per eliminare efficacemente la casualità associata alle proposte di blocchi sulla Beacon Chain.
Se hai mai avuto una serie di sfortuna e sei andato mesi senza una proposta, potresti trovare il Smoothing Pool molto interessante.

::: tip NOTA
Le ricompense del Smoothing Pool sono incorporate nel Merkle Tree utilizzato per le ricompense RPL, quindi le richiedi allo stesso tempo in cui richiedi RPL utilizzando `rocketpool node claim-rewards`.
:::

Per aiutare a chiarire i dettagli, il Smoothing Pool utilizza le seguenti regole:

- L'opt-in al Smoothing Pool viene fatto a **livello di nodo**. Se opti, tutti i tuoi minipool sono inclusi.

- La quota totale del Node Operator è determinata dalla commissione media di ogni minipool in ogni nodo che ha optato per il Smoothing Pool.

- Chiunque può optare in qualsiasi momento. Devono attendere un intervallo di ricompense completo (1 giorno su Ropsten, 28 giorni su Mainnet) prima di optare per uscire per prevenire il gaming del sistema.
  - Una volta uscito, devi attendere un altro intervallo completo per optare di nuovo.

- Il Smoothing Pool calcola la "quota" di ogni minipool (porzione dell'ETH del pool per l'intervallo) posseduta da ogni nodo che ha optato.
  - La quota è una funzione della performance del tuo minipool durante l'intervallo (calcolata osservando quante attestazioni hai inviato sulla Beacon Chain e quante ne hai mancate) e del tasso di commissione del tuo minipool.

- La quota totale del tuo nodo è la somma delle quote dei tuoi minipool.

- La quota totale del tuo nodo è scalata dalla quantità di tempo in cui sei stato incluso.
  - Se sei stato incluso per l'intero intervallo, ricevi la tua quota completa.
  - Se sei stato incluso per il 30% di un intervallo, ricevi il 30% della tua quota completa.

Per optare nel Smoothing Pool, esegui il seguente comando:

```shell
rocketpool node join-smoothing-pool
```

Questo ti registrerà come incluso nei contratti Rocket Pool e modificherà automaticamente il `fee recipient` del tuo Validator Client dal contratto distributor del tuo nodo al contratto Smoothing Pool.

Per lasciare il pool, esegui questo comando:

```shell
rocketpool node leave-smoothing-pool
```

### Il Sistema di Penalità

Per garantire che i Node Operator non "imbroglino" modificando manualmente il fee recipient utilizzato nel loro Validator Client, Rocket Pool impiega un sistema di penalità.

L'Oracle DAO monitora costantemente ogni blocco prodotto dai Node Operator di Rocket Pool.
Qualsiasi blocco che abbia un fee recipient diverso da uno dei seguenti indirizzi è considerato **non valido**:

- L'indirizzo rETH
- L'indirizzo del Smoothing Pool
- Il contratto fee distributor del nodo (se non incluso nel Smoothing Pool)

Un minipool che ha proposto un blocco con un fee recipient **non valido** riceverà **uno strike**.
Al terzo strike, il minipool inizierà a ricevere **infrazioni** - ogni infrazione detrarrà **il 10% del suo saldo totale sulla Beacon Chain, inclusi i guadagni ETH** e li invierà agli staker del pool rETH al momento del prelievo dei fondi dal minipool.

Le infrazioni sono a livello di **minipool**, non a livello di **nodo**.

Il software Smartnode è progettato per garantire che gli utenti onesti non vengano mai penalizzati, anche se deve portare il Validator Client offline per farlo.
Se ciò accade, smetterai di attestare e vedrai messaggi di errore nei tuoi file di log sul perché lo Smartnode non può impostare correttamente il tuo fee recipient.

## Guide per Pre e Post-Aggiornamento

Per informazioni dettagliate su come preparare il tuo nodo per l'aggiornamento e cosa fare dopo l'aggiornamento, consulta le seguenti guide:

- [Guida per la Modalità Docker](./docker-migration.mdx)
- [Guida per la Modalità Ibrida](./hybrid-migration.mdx)
- [Guida per la Modalità Nativa](./native-migration.mdx)
