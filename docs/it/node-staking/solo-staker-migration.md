::: danger ATTENZIONE
I depositi minipool sono attualmente disabilitati in preparazione per Saturn 1.
:::

# Conversione di un Validator Solo in un Minipool

Quando la Beacon Chain è stata lanciata per la prima volta, i validator sono stati creati con una coppia speciale di chiavi crittografiche - la **chiave del validator** e la **chiave di prelievo**.

La chiave del validator è una "hot key", il che significa che deve essere memorizzata su una macchina attiva connessa a Internet; questa è la chiave utilizzata per firmare le tue attestazioni e proposte, e serve anche come tuo "indirizzo" sulla Beacon Chain (la stringa esadecimale utilizzata per identificare il tuo validator).

La chiave di prelievo, d'altra parte, è una "cold key" che significa che _non_ viene (e infatti, _non dovrebbe_) essere memorizzata su una macchina attiva connessa a Internet.
È destinata a essere bloccata in cold storage in modo che non possa essere accessibile finché non è necessaria.
A differenza della chiave del validator, la chiave di prelievo non è responsabile dei compiti di validazione.
Invece, il suo unico compito è gestire il prelievo dei fondi del tuo validator sulla Beacon Chain (una volta che i prelievi erano stati implementati).

Questo sistema a doppia chiave era l'architettura iniziale con cui la Beacon Chain è stata lanciata.
All'epoca, né il Merge né i prelievi erano stati progettati, ma questo sistema era considerato abbastanza robusto da gestire qualsiasi forma che il protocollo avrebbe preso quando entrambi fossero stati implementati.

Avanti veloce ad oggi, e ora abbiamo una comprensione molto migliore di come funzionano i prelievi.
Fortunatamente, sono stati implementati in modo tale da rendere possibile per un validator esistente in solo staking sulla Beacon Chain (che utilizza le vecchie credenziali della chiave di prelievo) convertirsi **direttamente in un minipool Rocket Pool** senza dover uscire dal validator dalla Beacon Chain!

Se sei interessato a saperne di più su questo processo, allora questa guida fa per te.
Copriremo come funzionano i prelievi su Ethereum ad alto livello, spiegheremo come funziona il processo di conversione e termineremo con una procedura dettagliata su come convertire il tuo validator in un minipool.

## Perché Dovrei Convertire?

Prima di entrare nei dettagli tecnici, una domanda molto importante a cui rispondere è _perché_ un solo staker considererebbe questo processo in primo luogo.
La conversione in un minipool non è per tutti, ma questa sezione ti aiuterà a fare una scelta informata sul fatto che sia qualcosa che desideri perseguire o meno.

I minipool Rocket Pool godono di diversi vantaggi rispetto ai validator convenzionali in solo staking:

- **Guadagnano commissioni** sulla porzione di ETH che prendono in prestito dai pool stakers (24 ETH).
- I tuoi 32 ETH in bond esistenti potrebbero essere utilizzati per creare fino a **tre validator aggiuntivi** (oltre a quello che hai già).
- Sono idonei per la partecipazione allo [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool) che mette in comune tutti i premi del livello Execution (ad esempio, dalle proposte di blocco e [premi MEV](./mev.mdx)) e li distribuisce equamente tra i partecipanti durante ogni intervallo di ricompense.
- Se fai staking di RPL, guadagneranno commissioni bonus e premi di inflazione RPL (che attualmente forniscono un APR più alto rispetto ai premi di staking ETH).

Detto questo, ci sono alcune differenze che è importante evidenziare:

- Dovrai accettare il **rischio degli smart contract**, poiché il protocollo è implementato come una serie di smart contract.
- Allo stesso modo, l'operazione convenzionale del nodo sfrutta lo **stack Smartnode**; dovrai accettare eventuali rischi associati all'installazione e all'esecuzione di quel software sul tuo nodo.
- Essere un operatore di nodo comporta l'apprendimento di alcuni nuovi concetti, quindi c'è una **curva di apprendimento** associata al diventarne uno.
- I minipool sono tenuti a dividere i loro premi con i pool stakers, quindi l'indirizzo di prelievo del validator sarà uno smart contract sul livello Execution, **non un EOA che controlli**. Questo si applica anche al tuo **fee recipient** per i premi del livello Execution, che deve anche essere uno smart contract che possa dividere equamente i tuoi premi.
- L'**Oracle DAO** di Rocket Pool è responsabile del trasferimento delle informazioni dalla Beacon Chain al livello Execution, e per rilevare violazioni che il protocollo non può far rispettare (come un indirizzo fee recipient illegale). Gestire un minipool significa che dovrai fidarti dell'Oracle DAO per svolgere quel lavoro correttamente.

Ti incoraggiamo a considerare attentamente questi pro e contro prima di decidere di convertire il tuo validator solo.
Se desideri continuare con il processo, leggi le sezioni successive.

## Prerequisiti

Per poter iniziare il processo di conversione, dovrai soddisfare i seguenti criteri:

1. Devi avere [un nodo registrato con la rete Rocket Pool](./prepare-node.mdx) per ospitare il nuovo minipool.
1. Il validator che vuoi migrare deve essere **attivo** sulla Beacon chain. Non può essere in sospeso, tagliato, in uscita / uscito o ritirato.
1. Il validator deve avere un saldo di **almeno 32 ETH** sulla Beacon chain.
1. Il validator deve avere [credenziali di prelievo con chiave BLS](https://launchpad.ethereum.org/en/withdrawals) (credenziali `0x00`). La conversione **non può** essere effettuata su validator che sono già migrati ad altre credenziali di prelievo del livello Execution (credenziali `0x01`).
1. (Facoltativo) Se intendi far migrare automaticamente le credenziali di prelievo allo Smartnode per te, devi avere **la tua frase mnemonica a portata di mano**.

Se nessuna di queste condizioni è un impedimento per te, allora sei idoneo per iniziare la conversione del validator.

## Panoramica del Processo

Il primo passo è **creare un nuovo minipool "vacante"**.
A differenza dei minipool convenzionali, che creano un nuovo validator durante la loro creazione, i minipool vacanti sono minipool speciali progettati per gestire validator _esistenti_.
Di conseguenza, i minipool vacanti si comportano in modo leggermente diverso rispetto ai minipool convenzionali durante la fase `prelaunch`.
Una volta completata l'inizializzazione ed entrati nella fase `staking`, diventano minipool convenzionali.

Durante la creazione del minipool vacante, ti verrà data l'opzione di far cambiare automaticamente allo Smartnode le **credenziali di prelievo del tuo validator** dalla vecchia chiave di prelievo BLS al nuovo indirizzo del minipool vacante.
Se non vuoi farlo adesso, puoi far fare allo Smartnode più tardi con un comando dedicato, oppure puoi farlo tu stesso con uno strumento di terze parti.
Nota che cambiare le credenziali di prelievo del validator all'indirizzo del minipool è **richiesto** per la conversione, quindi indipendentemente da come lo fai, dovrà essere fatto affinché il processo venga completato con successo.

Una volta cambiate le credenziali di prelievo, avrai l'opzione di **importare la chiave privata del validator** nel Validator Client gestito dallo Smartnode.
Se vuoi che lo Smartnode mantenga il validator così non devi gestirlo tu stesso, questa è un'opzione attraente.
Se preferisci mantenere il tuo Validator Client e tenere le chiavi lì, sei libero di farlo.

A questo punto il tuo nuovo minipool entrerà nel periodo di **scrub check**, dove l'Oracle DAO analizzerà continuamente le informazioni del tuo validator sulla Beacon Chain per confermare che rimanga legale.
Questo include:

- Le credenziali di prelievo o non sono state ancora migrate (sono ancora le credenziali originali della chiave BLS `0x00`) o sono state migrate all'indirizzo del minipool. Migrarle a qualsiasi altro indirizzo del livello Execution causerà la cancellazione del pool.
  - Se le credenziali di prelievo sono ancora le credenziali originali della chiave BLS `0x00` entro la fine del periodo di scrub check, il pool verrà cancellato.
- Il validator è nello stato di staking attivo per la durata del controllo. Se passa allo stato tagliato, uscito o ritirato, il pool verrà cancellato.

::: tip NOTA
Un minipool vacante **cancellato** significa che non fa parte della rete Rocket Pool, ma ti darà comunque (l'operatore del nodo) accesso a tutti i tuoi fondi tramite i tipici metodi di recupero token nella CLI.
I fondi **non vengono persi** se i minipool vacanti vengono cancellati.
Maggiori informazioni sui minipool cancellati, le loro ramificazioni e come utilizzarli sono incluse più avanti in questa guida.
:::

Dopo che lo scrub check è passato, potrai **promuovere** il tuo minipool vacante.
Questo completerà la conversione e lo cambierà da un minipool vacante a uno regolare.
A questo punto il minipool agirà come ogni altro minipool sulla rete, e il tuo validator solo sarà ufficialmente convertito in un validator Rocket Pool!

Come parte del processo, la rete farà uno snapshot del tuo totale di premi sulla Beacon chain (e all'interno del tuo nuovo minipool, se vieni skimmato durante lo scrub check).
Riconoscerà che tutti quei premi appartengono a te e non dovrebbero essere condivisi con lo staking pool, quindi li fornirà tutti come **rimborso** che puoi richiedere in qualsiasi momento una volta completata la promozione.

Di seguito è riportata una procedura dettagliata del processo di conversione, incluse le istruzioni per ogni passaggio.

## Passo 1: Creazione di un Minipool Vacante

Per iniziare il processo di conversione, esegui il seguente comando con la CLI Smartnode:

```
rocketpool node create-vacant-minipool <validator pubkey>
```

Ad esempio, se volessi convertire un validator solo con pubkey `0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661`, eseguiresti:

```
rocketpool node create-vacant-minipool 0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661
```

Vedrai un breve riepilogo su cosa aspettarti durante il processo, poi ti verrà chiesto quale importo di bond vuoi utilizzare quando crei questo minipool:

```
Please choose an amount of ETH you want to use as your deposit for the new minipool (this will become your share of the balance, and the remainder will become the pool stakers' share):

1. 8 ETH
```

Una volta selezionato **8 ETH**, convertirai il tuo validator in un minipool con bond da 8-ETH.
Il tuo deposito originale di 32 ETH verrà convertito in un deposito di 8 ETH, con 24 ETH presi in prestito dai pool stakers.
Una volta completato il processo di conversione, avrai un [saldo di credito](./credit) di 24 ETH che puoi utilizzare per creare più minipool.

Una volta selezionata un'opzione, lo Smartnode eseguirà alcuni controlli per confermare che il validator che hai inserito e il tuo nodo passino entrambi tutti i requisiti prerequisiti elencati sopra.
Dopo di ciò, ti chiederà di confermare il tuo prezzo del gas e poi inviare la transazione per creare il nuovo minipool vacante.
Alla creazione, ti verrà presentato l'indirizzo del minipool:

```
Your minipool was made successfully!
Your new minipool's address is: 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Questo è l'indirizzo che utilizzerai quando cambierai le credenziali di prelievo del tuo validator.

A questo punto, lo Smartnode chiederà se desideri far fare questo automaticamente allo Smartnode (insieme all'importazione della chiave privata del validator nel Validator Client gestito dallo Smartnode, di cui si discute più avanti):

```
You have the option of importing your validator's private key into the Smartnode's Validator Client instead of running your own Validator Client separately. In doing so, the Smartnode will also automatically migrate your validator's withdrawal credentials from your BLS private key to the minipool you just created.

Would you like to import your key and automatically migrate your withdrawal credentials? [y/n]
```

Se rispondi `y` a questa domanda, lo Smartnode farà automaticamente i Passi 2 e 3; consulta la sezione [Cambio Automatico delle Credenziali di Prelievo e Importazione della Chiave](#automatic-withdrawal-credential-change-and-key-import) qui sotto.

Se rispondi `n` a questa domanda, il comando terminerà e avrai completato il Passo 1.
Passa alla sezione [Passo 2](#step-2-changing-the-validators-withdrawal-credentials) successivamente.

::: tip NOTA
Se rifiuti questo processo ora, puoi riprenderlo in un secondo momento usando la CLI.
Leggi le sezioni [**Passo 2**](#step-2-changing-the-validators-withdrawal-credentials) e [**Passo 3**](#optional-step-3-import-the-validator-key) qui sotto per imparare come farlo.
:::

### Cambio Automatico delle Credenziali di Prelievo e Importazione della Chiave

::: danger ATTENZIONE
Se scegli di far cambiare automaticamente allo Smartnode le tue credenziali di prelievo e importare la chiave privata del tuo validator, è **essenziale** che tu rimuova la chiave del validator dal tuo vecchio Validator Client che gestisci da solo, e **arresti il vecchio Validator Client** per assicurarti che non abbia ancora la chiave caricata in memoria.

Devi anche aspettare **almeno 15 minuti** dopo averlo fatto per assicurarti che abbia **mancato intenzionalmente almeno due attestazioni**.
Puoi verificarlo guardando un chain explorer come [https://beaconcha.in](https://beaconcha.in).

Se non aspetti almeno 15 minuti, il tuo validator **VERRÀ TAGLIATO** quando il Validator Client dello Smartnode inizierà ad attestare con la chiave del tuo validator!

Ti consigliamo vivamente di abilitare **doppelganger detection** nella configurazione dello Smartnode, per essere il più sicuro possibile contro il rischio di taglio.
:::

Se scegli di importare automaticamente la chiave del validator e cambiare le credenziali di prelievo all'indirizzo del minipool, lo Smartnode chiederà prima il mnemonic utilizzato per generare sia la chiave privata BLS del tuo validator che la corrispondente chiave di prelievo originale:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Dopo averlo inserito, lo Smartnode derivarà la tua vecchia chiave di prelievo basata su BLS usando il mnemonic e la pubkey del validator.
Quindi invierà un messaggio alla Beacon Chain, firmato dalla tua chiave di prelievo, indicando che desideri cambiare le credenziali di prelievo dalla vecchia chiave di prelievo BLS al nuovo indirizzo del minipool:

```
Changing withdrawal credentials to the minipool address... done!
```

Infine, importerà la chiave del tuo validator nel Validator Client dello Smartnode e chiederà se desideri riavviarlo, così inizia a validare con quella chiave:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

Con ciò, i passi 2 e 3 sono stati completati.
Puoi verificare che le credenziali di prelievo siano state cambiate correttamente e che la chiave stia validando attivamente usando un chain explorer come [https://beaconcha.in](https://beaconcha.in)

Vai alla sezione [Passo 4](#step-4-waiting-for-the-scrub-check) per saperne di più sullo scrub check.

## Passo 2: Cambio delle Credenziali di Prelievo del Validator

Quando hai creato il nuovo minipool vacante, il passo successivo è cambiare le credenziali di prelievo del tuo validator dalle vecchie credenziali con chiave BLS `0x00` alle nuove credenziali `0x01` che contengono il nuovo indirizzo del minipool.

Ci sono due modi per farlo:

1. Usando la CLI Smartnode, tramite il comando `rocketpool minipool set-withdrawal-creds`.
1. Usando uno strumento esterno di terze parti come [ethdo](https://github.com/wealdtech/ethdo).

In questa guida, vedremo come utilizzare il metodo 1 (lo Smartnode).
Per maggiori informazioni sul metodo 2, consulta la documentazione dello strumento che desideri utilizzare.

Inizia eseguendo il seguente comando:

```
rocketpool minipool set-withdrawal-creds <minipool address>
```

Ad esempio, se il nuovo indirizzo del minipool vacante fosse `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`, eseguiresti questo:

```
rocketpool minipool set-withdrawal-creds 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Lo Smartnode chiederà quindi il mnemonic utilizzato per generare sia la chiave del tuo validator che la corrispondente chiave di prelievo:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Dopo di ciò, eseguirà alcuni controlli di sicurezza per assicurarsi che le credenziali di prelievo del tuo validator possano essere cambiate.
Se ha successo, invierà quindi un messaggio alla Beacon Chain, firmato dalla tua chiave di prelievo, indicando che desideri cambiare le credenziali di prelievo dalla vecchia chiave di prelievo BLS al nuovo indirizzo del minipool:

```
Changing withdrawal credentials to the minipool address... done!
```

Questo è tutto!
Puoi verificare che le credenziali di prelievo siano state cambiate correttamente usando un chain explorer come [https://beaconcha.in](https://beaconcha.in).

## (Facoltativo) Passo 3: Importare la Chiave del Validator

Una volta convertito il tuo validator in un minipool, potresti voler far gestire al Validator Client dello Smartnode invece di quello che gestisci attualmente da solo.
Questo ha alcuni vantaggi:

- È "più pulito" dal punto di vista organizzativo (lo Smartnode gestisce i tuoi minipool, il tuo Validator Client gestito esternamente gestisce i tuoi validator in solo staking).
- Consente a comandi come `rocketpool minipool exit` (comandi che richiedono la chiave del tuo validator per firmare messaggi) di funzionare.

Tuttavia, ci sono alcune **considerazioni molto importanti** da comprendere prima di farlo:

- **Devi assicurarti** che la chiave del tuo validator sia stata rimossa dal tuo Validator Client, e che tu abbia aspettato almeno 15 minuti dopo averla rimossa prima di importarla nello Smartnode. Vedi il riquadro di avviso qui sotto.
- **Devi assicurarti** di avere il keystore del tuo validator _e il suo file password_ di cui hai fatto il backup, perché comandi come `rocketpool wallet recover` e `rocketpool wallet rebuild` **non possono** rigenerarli senza un backup poiché non sono stati derivati dal mnemonic del wallet dello Smartnode.

Se desideri importare la chiave del tuo validator nello Smartnode, continua a leggere qui sotto.

::: danger ATTENZIONE
Se scegli di far importare allo Smartnode la chiave privata del tuo validator, è **essenziale** che tu rimuova la chiave del validator dal tuo vecchio Validator Client che gestisci da solo, e **arresti il vecchio Validator Client** per assicurarti che non abbia ancora la chiave caricata in memoria.

Devi anche aspettare **almeno 15 minuti** dopo averlo fatto per assicurarti che abbia **mancato intenzionalmente almeno due attestazioni**.
Puoi verificarlo guardando un chain explorer come [https://beaconcha.in](https://beaconcha.in).

Se non aspetti almeno 15 minuti, il tuo validator **VERRÀ TAGLIATO** quando il Validator Client dello Smartnode inizierà ad attestare con la chiave del tuo validator!

Ti consigliamo vivamente di abilitare **doppelganger detection** nella configurazione dello Smartnode, per essere il più sicuro possibile contro il rischio di taglio.
:::

Inizia eseguendo il seguente comando:

```
rocketpool minipool import-key <minipool address>
```

Ad esempio, se il nuovo indirizzo del minipool vacante fosse `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`, eseguiresti questo:

```
rocketpool minipool import-key 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Lo Smartnode chiederà quindi il mnemonic utilizzato per generare la chiave del tuo validator:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Dopo di ciò, ciclerà attraverso le diverse chiavi generate da quel mnemonic finché non trova la chiave pubblica del tuo validator.
Quindi la importerà e chiederà se desideri riavviare il Validator Client dello Smartnode così carica la tua chiave:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

Con ciò, la chiave del tuo validator è ora importata nello Smartnode e dovresti vederla iniziare ad attestare.
Puoi confermare seguendo i log del Validator Client con questo comando:

```
rocketpool service logs validator
```

Puoi anche verificare che un chain explorer come [https://beaconcha.in](https://beaconcha.in) possa vedere il tuo Validator Client attestare con la chiave del tuo validator.

## Passo 4: Assegnare il Corretto Fee Recipient

Una volta avviato il processo di migrazione, è **imperativo** che ti assicuri che il tuo [fee recipient](./fee-distrib-sp#fee-recipients) sia impostato correttamente (o sul [fee distributor](./fee-distrib-sp#your-fee-distributor) del tuo nodo o sullo [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool) se hai optato per esso).
Se non lo fai e lo lasci sul fee recipient per i tuoi validator solo, verrai penalizzato e una porzione del tuo stake sulla Beacon Chain verrà dedotta per compensare la perdita.

::: tip NOTA
**Questo passaggio è richiesto solo se lasci la chiave del tuo validator nel tuo Validator Client gestito esternamente.**

Se la rimuovi dal tuo VC e la importi nel VC gestito da Rocket Pool, il tuo fee recipient verrà assegnato automaticamente all'indirizzo corretto dal processo `node`.
:::

Poiché potresti mantenere altre chiavi di solo-staking nel tuo VC che _non_ vuoi impostare sul fee distributor o Smoothing Pool, l'unico modo per farlo è utilizzare un file di configurazione VC per impostare manualmente il fee recipient per il validator in fase di migrazione.

Questo processo dipende da quale Consensus Client utilizzi; consulta la documentazione per i dettagli specifici ma ecco alcuni link utili:

[Lighthouse: tramite `validator_definitions.yml`](https://lighthouse-book.sigmaprime.io/suggested-fee-recipient.html#1-setting-the-fee-recipient-in-the-validator_definitionsyml)

**Lodestar** attualmente non supporta l'impostazione di fee recipient specifici per validator. Per favore non usare Lodestar se stai mantenendo la chiave nel tuo VC gestito esternamente con altre chiavi solo che non vengono migrate.

[Nimbus: tramite keymanager API](https://nimbus.guide/keymanager-api.html)

[Prysm: tramite `proposer-settings-file`](https://docs.prylabs.network/docs/execution-node/fee-recipient#configure-fee-recipient-via-jsonyaml-validator-only)

[Teku: tramite `validators-proposer-config`](https://docs.teku.consensys.net/how-to/configure/use-proposer-config-file)

Se stai usando eth-docker, puoi usare il comando [`./ethd keys set-recipient`](https://eth-docker.net/Support/AddValidator#set-individual-fee-recipient) per impostare destinatari individuali per ogni chiave che stai usando come descritto nella loro documentazione.

## Passo 5: Attendere lo Scrub Check

A questo punto, dovresti aver completato i passi 1 e 2 (creazione del minipool vacante e cambio delle credenziali di prelievo del tuo validator) e facoltativamente il passo 3 (importazione della chiave nello Smartnode).
Il passo successivo è attendere che lo **scrub check** venga completato.
Questo è un processo eseguito dall'Oracle DAO per verificare quanto segue:

1. Il saldo del tuo validator sulla Beacon Chain (e il saldo del tuo minipool sul livello Execution) devono sommarsi ad **almeno** il saldo che il tuo validator aveva quando hai creato per la prima volta il minipool vacante, meno un piccolo buffer di 0,01 ETH per tenere conto di eventuali attestazioni mancate accidentalmente durante la manutenzione.

- Ad esempio, se il tuo validator aveva un saldo sulla Beacon Chain di 35 ETH quando hai eseguito il passo 1, i saldi combinati della Beacon Chain e del minipool devono essere **almeno** 34,99 ETH per l'intera durata dello scrub check.

2. Il tuo validator deve rimanere nello stato di **staking attivo** per l'intero scrub check - non può essere tagliato, uscito o ritirato.
3. Le credenziali di prelievo del tuo validator devono essere o le **credenziali originali della chiave di prelievo basata su BLS**, o le **nuove credenziali 0x01 usando l'indirizzo del minipool**. Qualsiasi altra credenziale causerà la cancellazione del minipool.

- Ti viene concesso un periodo di grazia di **circa 2 giorni e mezzo** per eseguire il cambio delle credenziali di prelievo (85% della durata del periodo di scrub di 3 giorni).

Lo scrub check è transitorio; non devi fare nulla durante questo periodo se non mantenere il tuo validator online e performante.

Per monitorare quanto tempo rimane nello scrub check, puoi guardare i log del `node` con il seguente comando:

```
rocketpool service logs node
```

Le righe rilevanti appariranno così:

```
rocketpool_node  | 2023/03/06 04:51:32 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 04:51:32 Minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C has 44m0s left until it can be promoted.
```

Durerà **3 giorni**, dopodiché hai passato e puoi procedere al [Passo 6](#step-6-promoting-the-minipool) per promuovere il minipool vacante a uno completo.

### Lavorare con i Minipool Cancellati

Se il tuo minipool purtroppo non supera lo scrub check e viene dissolto, non preoccuparti - il tuo capitale non è perso.
I minipool vacanti dissolti essenzialmente agiscono come indirizzi di prelievo semplificati:

- Non fanno tecnicamente parte della rete Rocket Pool.
- Qualsiasi capitale depositato nel minipool appartiene _esclusivamente_ all'operatore del nodo. _Non_ viene diviso con i pool stakers.
- Non ti viene assegnato un credito di deposito per la creazione del minipool.

Puoi accedere al saldo del minipool in qualsiasi momento con il seguente comando:

```shell
rocketpool minipool distribute-balance
```

Questo invierà l'intero saldo del minipool all'indirizzo di prelievo del tuo nodo.

Quando hai fatto uscire il tuo validator dalla Beacon Chain e il suo saldo completo è stato inviato al minipool, puoi recuperarlo e chiudere il minipool con il seguente comando:

```shell
rocketpool minipool close
```

Ancora una volta, questo invierà l'intero saldo del minipool all'indirizzo di prelievo del tuo nodo.

## Passo 6: Promuovere il Minipool

Quando lo scrub check è stato superato con successo, puoi promuovere il minipool vacante a un minipool completo.
Questo può essere fatto in due modi:

1. Lascia che il processo `node` lo gestisca automaticamente non appena lo scrub check termina.
1. Fallo manualmente usando la CLI.

Il primo metodo promuoverà automaticamente il minipool per te, supponendo che tu abbia il processo / contenitore `node` in esecuzione e il costo del gas della rete sia al di sotto della soglia di transazione automatica che hai specificato nel processo di configurazione dello Smartnode (predefinito di 150).
Nei log del `node`, vedrai un output come il seguente:

```
rocketpool_node  | 2023/03/06 05:37:00 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 05:37:00 1 minipool(s) are ready for promotion...
rocketpool_node  | 2023/03/06 05:37:00 Promoting minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C...
rocketpool_node  | 2023/03/06 05:37:01 This transaction will use a max fee of 34.736742 Gwei, for a total of up to 0.009597 - 0.014396 ETH.
rocketpool_node  | 2023/03/06 05:37:01 Transaction has been submitted with hash 0x93c2662def6097da28e01b9145259736575ffc43b539b002b27e547065e66d7e.
rocketpool_node  | 2023/03/06 05:37:01 Waiting for the transaction to be validated...
rocketpool_node  | 2023/03/06 05:37:13 Successfully promoted minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C.
```

Se il tuo processo `node` è disabilitato, puoi usare il secondo metodo tramite il seguente comando:

```shell
rocketpool minipool promote
```

Da qui, seleziona semplicemente il tuo minipool vacante dall'elenco dei minipool idonei per la promozione e invia la transazione.

## Rivendicare i tuoi Premi Originali Pre-Conversione

Alla promozione, il tuo minipool entrerà nello stato `staking` ed è ufficialmente diventato un minipool Rocket Pool regolare.
Puoi rivedere i dettagli con questo comando:

```shell
rocketpool minipool status
```

Questo ti mostrerà lo stato del tuo nuovo minipool, i suoi saldi, il suo rimborso e così via.
Ad esempio:

```
Address:              0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
Penalties:            0
Status updated:       2023-03-06, 05:37 +0000 UTC
Node fee:             14.000000%
Node deposit:         8.000000 ETH
RP ETH assigned:       2023-03-06, 05:37 +0000 UTC
RP deposit:            24.000000 ETH
Minipool Balance (EL): 0.090012 ETH
Your portion:          0.001779 ETH
Available refund:      0.085000 ETH
Total EL rewards:      0.086779 ETH
...
```

Qui puoi vedere le seguenti informazioni importanti:

- `Node deposit` mostra quanto ETH hai personalmente messo in bond come parte di questo minipool (in questo caso, 8 ETH).
- `RP deposit` mostra quanto ETH hai preso in prestito dai pool stakers per creare il minipool (in questo caso, 24 ETH).
- `Available refund` mostra quanto del saldo del minipool va direttamente a te (non viene condiviso con i pool stakers. Questo ammonta a tutti i tuoi premi sulla Beacon Chain al momento in cui hai creato il minipool vacante.
- `Minipool Balance (EL)` mostra il saldo totale del contratto minipool.
- `Your portion (EL)` mostra quanto del saldo ti appartiene _dopo_ aver sottratto il rimborso dal saldo del minipool. In altre parole, questa è la tua quota dei premi che hai guadagnato _dopo_ aver creato il minipool vacante.
- `Total EL rewards` è il tuo rimborso più i tuoi premi post-conversione.

Per richiedere il tuo rimborso, esegui il seguente comando:

```shell
rocketpool minipool refund
```

Seleziona semplicemente il tuo minipool dall'elenco, approva la transazione e il tuo rimborso verrà inviato all'indirizzo di prelievo del tuo nodo.

## Utilizzare il tuo Credito del Nodo

Ora che hai un minipool promosso attivo, noterai che il tuo nodo ha un saldo di credito quando esegui `rocketpool node status`:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 355.785269 ETH and 16679.835547 RPL.
The node has 24.000000 ETH in its credit balance, which can be used to make new minipools.
```

In questo esempio, poiché abbiamo convertito il bond del validator originale di 32 ETH in un minipool da 8-ETH, abbiamo ricevuto [**24 ETH in credito**](./credit).
Questo credito può essere utilizzato per creare nuovi minipool e validator gratuitamente!

Esegui semplicemente il comando `rocketpool node deposit` e seleziona quale importo di bond vuoi utilizzare.
Se c'è abbastanza ETH nel tuo saldo di credito per coprire il bond, verrà utilizzato automaticamente e non dovrai fare staking di ETH aggiuntivi (anche se devi comunque pagare il gas).

::: warning NOTA
L'ETH utilizzato per il tuo saldo di credito proviene dallo staking pool.
Se lo staking pool non ha abbastanza ETH per coprire il tuo saldo di credito, non potrai usarlo finché non verrà depositato più ETH.
:::
