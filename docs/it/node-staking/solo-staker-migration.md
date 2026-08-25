# Migrare dal Solo Staking a Rocket Pool

::: danger LA CONVERSIONE DEI VALIDATOR SOLO NON È PIÙ POSSIBILE
L'[aggiornamento Saturn 1](/it/upgrades/saturn-1/whats-new) ha rimosso la possibilità di convertire direttamente un validator solo esistente in un validator di Rocket Pool.
I minipool - inclusi i minipool "vacant" che rendevano possibile la conversione dei validator solo - non possono più essere creati, e i validator megapool possono essere creati solo tramite un nuovo deposito sulla Beacon Chain.

Per spostare il tuo stake dal solo staking a Rocket Pool, ora devi **uscire dal tuo validator solo** e **creare nuovi validator sotto un megapool**.
Questa pagina spiega cosa è cambiato e ti guida attraverso il nuovo processo.
:::

## Cosa è cambiato con Saturn 1

Prima di Saturn 1, un solo staker poteva convertire un validator attivo in un minipool di Rocket Pool senza farlo uscire dalla Beacon Chain.
Il processo prevedeva la creazione di uno speciale minipool "vacant", il cambio delle credenziali di prelievo del validator dalle credenziali BLS `0x00` originali all'indirizzo del minipool, il superamento dello scrub check dell'Oracle DAO e infine la promozione del minipool.

L'aggiornamento Saturn 1 ha sostituito i minipool con i [megapool](/it/node-staking/megapools/overview) come modalità di creazione dei nuovi validator, e la conversione dei validator solo non è stata mantenuta:

- **La creazione di minipool è disabilitata a livello di protocollo**, inclusi i minipool vacant. Non esiste più un contratto minipool verso cui puntare le credenziali di prelievo di un validator esistente.
- **I validator megapool vengono creati tramite la coda di deposito di Rocket Pool** con un nuovo deposito sulla Beacon Chain: un prestake di 1 ETH, seguito dai restanti 31 ETH una volta che il protocollo ha verificato on-chain le credenziali di prelievo del validator.
  Un validator già attivo non può passare attraverso questo flusso, quindi non esiste alcun meccanismo per assorbire un validator solo esistente in un megapool.
- I comandi dello Smartnode usati per la conversione (come `rocketpool node create-vacant-minipool` e `rocketpool minipool promote`) sono stati rimossi dalla CLI.

In breve: oggi l'unico modo per migrare dal solo staking è **far uscire il tuo validator dalla Beacon Chain e usare l'ETH prelevato per creare nuovi validator megapool**.

## Perché dovrei migrare?

La migrazione non è per tutti, ma i validator megapool di Rocket Pool godono di diversi vantaggi rispetto ai validator di solo staking convenzionali:

- **Guadagnano una commissione** sulla porzione di ETH presa in prestito dagli staker del pool (28 ETH per validator).
- Il tuo stake esistente di 32 ETH potrebbe essere usato per creare fino a **otto validator megapool** (con il bond attuale di 4 ETH ciascuno), guadagnando commissioni su fino a 224 ETH di ETH preso in prestito.
- Sono idonei a partecipare allo [Smoothing Pool](/it/node-staking/fee-distrib-sp#the-smoothing-pool), che raccoglie tutte le ricompense dell'Execution Layer (ad esempio dalle proposte di blocco e dalle [ricompense MEV](/it/node-staking/mev)) e le distribuisce equamente tra i partecipanti a ogni intervallo di ricompense.
- Se metti in staking RPL sul tuo megapool, guadagnerai [ricompense voter share](/it/node-staking/megapools/staking-and-claiming-rewards#how-voter-share-is-distributed-to-megapool-rpl-stakers) (una quota dei ricavi ETH del protocollo) in aggiunta alle ricompense di inflazione RPL, oltre al potere di voto nella [governance del pDAO](/it/pdao/overview). Lo staking di RPL è del tutto opzionale.

Detto questo, ci sono alcune differenze importanti da evidenziare:

- Dovrai accettare il **rischio degli smart contract**, poiché il protocollo è implementato come una serie di smart contract.
- L'operatività di nodo convenzionale si basa sullo **stack Smartnode**; dovrai accettare i rischi associati all'installazione e all'esecuzione di quel software sul tuo nodo.
- Essere un node operator comporta l'apprendimento di alcuni concetti nuovi, quindi c'è una **curva di apprendimento**.
- I validator megapool condividono le loro ricompense con gli staker del pool, quindi l'indirizzo di prelievo dei tuoi validator sarà il tuo contratto megapool sull'Execution Layer, **non un EOA sotto il tuo controllo**. Questo vale anche per il tuo **fee recipient** per le ricompense dell'Execution Layer.
- **Il tuo capitale non rende nulla mentre è in transito.** Tra l'uscita del tuo validator solo e l'attivazione dei tuoi validator megapool non guadagnerai ricompense. I nuovi validator megapool devono passare attraverso la coda di deposito di Rocket Pool _e_ la coda della Beacon Chain prima di iniziare ad attestare, quindi leggi la sezione **Considerazioni sulle tempistiche** qui sotto prima di uscire da qualsiasi cosa.

Ti invitiamo a valutare attentamente questi pro e contro prima di decidere di migrare.
Se desideri procedere con il processo, i passaggi sono descritti di seguito.

## Passo 1: Esci dal tuo validator solo

Il primo passo è far uscire il tuo validator solo dalla Beacon Chain e prelevarne il saldo:

1. Se il tuo validator ha ancora le credenziali di prelievo BLS `0x00`, devi prima [aggiornarle a credenziali di prelievo dell'Execution Layer](https://launchpad.ethereum.org/en/withdrawals) che puntino a un indirizzo sotto il tuo controllo. Senza questo passaggio, il tuo ETH non potrà essere prelevato dopo l'uscita.
1. Invia una **uscita volontaria (voluntary exit)** per il validator. Puoi farlo con il tuo client di Consenso / Validator; consulta la documentazione del tuo client per i dettagli.
1. Attendi che il validator passi attraverso la coda di uscita della Beacon Chain e che il suo saldo completo venga trasferito al tuo indirizzo di prelievo.

::: warning ATTENZIONE
Un'uscita volontaria è **irreversibile**. Una volta uscito, il tuo validator non potrà mai più validare - l'unica via di ritorno è creare un nuovo validator.
Assicurati di aver letto questa pagina per intero (in particolare la sezione **Considerazioni sulle tempistiche**) prima di uscire.
:::

[validatorqueue.com](https://www.validatorqueue.com/) è un sito utile per controllare la lunghezza attuale della coda di uscita della Beacon Chain.

## Passo 2: Configura un nodo Rocket Pool

Mentre aspetti che la tua uscita venga elaborata, puoi preparare il tuo nodo Rocket Pool.

Se sei nuovo all'operatività dei nodi Rocket Pool, inizia con la [guida del Node Operator](/it/node-staking/responsibilities), che copre tutto, dalla scelta dell'hardware all'[installazione dello stack Smartnode](/it/node-staking/installing/overview) e alla [registrazione del tuo nodo](/it/node-staking/prepare-node).
Dato che hai già gestito un tuo validator, molte di queste cose ti risulteranno familiari - e se già esegui i tuoi client di Esecuzione e Consenso, potrebbe interessarti la [configurazione ibrida con client esterni](/it/node-staking/install-modes#the-hybrid-configuration-with-external-clients).

## Passo 3: Crea i tuoi validator megapool

Una volta che l'ETH prelevato è nelle tue mani, sei pronto a creare validator megapool usando `rocketpool megapool deposit`.
Attualmente ogni validator richiede un **bond di 4 ETH** e prende in prestito **28 ETH** dallo staking pool, quindi i tuoi 32 ETH di stake prelevato potrebbero finanziare fino a **otto validator megapool**.
Il tuo contratto megapool viene distribuito automaticamente con il deposito del tuo primo validator, e ogni validator creato in seguito viene gestito dallo stesso megapool.

La guida [Creare un Megapool (Validator)](/it/node-staking/megapools/create-megapool-validator) ti accompagna passo dopo passo nell'intero processo, incluso il funzionamento della coda di deposito e come confermare uno stake riuscito.

::: tip NOTA
A differenza del vecchio processo di conversione, i tuoi nuovi validator useranno **nuove chiavi di validator** generate dal tuo wallet Smartnode.
Le tue vecchie chiavi del validator solo non vengono riutilizzate, e il Validator Client dello Smartnode gestirà le nuove chiavi per te - non c'è più una fase di importazione delle chiavi.
:::

## Considerazioni sulle tempistiche

Il vecchio processo di conversione non prevedeva tempi di inattività: il tuo validator continuava ad attestare per tutto il tempo.
Il nuovo percorso di migrazione comporta invece un periodo di inattività, quindi vale la pena comprendere le code coinvolte prima di far uscire il tuo validator solo:

1. **La coda di uscita della Beacon Chain**, che determina quanto rapidamente il tuo validator solo può uscire ed essere prelevato.
1. **La coda di deposito di Rocket Pool**, che determina quando i tuoi nuovi validator vengono abbinati all'ETH preso in prestito dal pool di deposito. I ticket della coda express sono stati distribuiti ai node operator esistenti in base all'ETH in bond nei minipool legacy; i nodi nuovi attualmente non ne ricevono, quindi i validator di un ex solo staker entreranno nella **coda standard**.
1. **La coda di deposito della Beacon Chain**, che i validator megapool attraversano **due volte**: una per il prestake di 1 ETH e una seconda per lo stake dei restanti 31 ETH, dopo che il protocollo ha verificato le credenziali di prelievo del validator.

Non guadagni ricompense dal momento in cui il tuo validator solo esce fino a quando i tuoi validator megapool non vengono attivati, quindi controlla le code prima di impegnarti.

::: tip Link utili
[validatorqueue.com](https://www.validatorqueue.com/) è un sito utile per controllare la lunghezza della coda della Beacon Chain. Questa coda dipende dalla quantità di ETH che entra ed esce dalla Beacon Chain.
:::

Se la coda di deposito dovesse risultare più lunga di quanto vorresti, puoi [rimuovere un validator dalla coda di deposito di Rocket Pool](/it/node-staking/megapools/create-megapool-validator#exit-a-validator-from-the-rocket-pool-deposit-queue) in qualsiasi momento prima che gli venga assegnato ETH, e ricevere il tuo bond come [credito di deposito](/it/node-staking/megapools/credit), riscattabile in rETH.

## Alternativa: fare staking senza gestire un nodo

Se, dopo aver valutato i pro e i contro, preferisci non gestire affatto un nodo, puoi semplicemente mettere in staking il tuo ETH prelevato con [rETH](/it/liquid-staking/overview) - il token di liquid staking di Rocket Pool - e guadagnare ricompense di staking senza hardware, manutenzione o code da parte tua.
