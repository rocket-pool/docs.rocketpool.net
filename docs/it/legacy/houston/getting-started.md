# Guida Rapida Houston

Che tu sia un Node Operator esperto, un possessore di rETH o un osservatore curioso, questa pagina ti aiuterà a iniziare a esplorare le nuove funzionalità incluse in Houston.

##

### Inizializzazione del Potere di Voto

Prima di tutto, il passo più importante se sei un **Node Operator** è [inizializzare il voto](../houston/participate#initializing-voting) per sbloccare il tuo potere di voto. I nodi che hanno inizializzato il voto sono inclusi quando viene calcolato il potere di voto totale della rete.

Alla genesi di Houston, il voto pDAO è disabilitato finché un numero sufficiente di nodi non ha inizializzato il voto. Questo per prevenire che proposte malevole vengano approvate mentre il potere di voto totale e il quorum sono bassi. Dopo che abbastanza nodi hanno inizializzato il voto, verrà attivato un interruttore e pDAO avrà il timone.

Per inizializzare il potere di voto, usa questo comando nello smartnode:

```shell
rocketpool pdao initialize-voting
```

Devi farlo solo una volta. Inizializzare il voto garantirà che il potere di voto del tuo nodo sia incluso nelle future proposte on-chain e ti permetterà di votare su di esse.

### Impostazione del tuo Indirizzo di Segnalazione Snapshot

In secondo luogo, vorrai impostare il tuo indirizzo di segnalazione snapshot. Questo permette ai node operator di partecipare ai voti Snapshot nel loro browser o dispositivo mobile senza dover esporre le chiavi del nodo a un hot wallet.

L'impostazione di questo comporta una serie di passaggi, quindi vorrai seguire questa guida:
[Impostazione del tuo Indirizzo di Segnalazione Snapshot](../houston/participate#setting-your-snapshot-signalling-address).

### Delega del Potere di Voto On-Chain

Se vuoi delegare il potere di voto on-chain a un membro della comunità di tua scelta, clicca [qui](../houston/participate#delegating-voting-power) per imparare come.

##

# Guide

[Panoramica Completa di Houston](../houston/whats-new) presenta il Protocol DAO completamente on-chain e introduce nuove funzionalità come lo staking di ETH per conto di un nodo, l'impostazione di un indirizzo di prelievo RPL e le presentazioni di saldo e RPL basate sul tempo. Qui si possono trovare anche gli audit degli smart contract di Houston.

[Il Protocol DAO](../houston/pdao) discute chi e come pDAO governa Rocket Pool. Questa pagina ti informerà su come i compiti pDAO come le spese del tesoro possono essere eseguiti on-chain, insieme al ruolo del nuovissimo Security Council. Ti guiderà anche attraverso il ciclo di vita di una proposta pDAO e spiegherà alcune delle misure prese per prevenire lo spam e abbattere le proposte malevole.

[Partecipazione alle Proposte](../houston/participate) include una guida dettagliata passo-passo su come i Node Operator possono partecipare alle proposte pDAO. Se sei interessato a presentare una proposta on-chain, votare o delegare il potere di voto, questa è la guida per te.

[Stake ETH per Conto di un Nodo](../houston/stake-eth-on-behalf.mdx) esamina i passaggi per lo staking di ETH per conto di un nodo. È una nuova funzionalità introdotta in Houston per facilitare scenari con un singolo depositante. Ti guideremo attraverso come farlo su una testnet se vuoi provarlo prima di fare staking di ETH reale su mainnet.

[Indirizzo di Prelievo RPL](../houston/rpl-withdrawal-address) ti mostra come impostare un indirizzo di prelievo RPL per il tuo nodo. Questo è utile se vuoi consentire a un'entità separata di fornire la garanzia collaterale RPL per un nodo.
