---
next:
  text: The Protocol DAO
  link: "/it/pdao/pdao"
---

# Panoramica

Questa sezione descrive il processo di configurazione del tuo nodo per partecipare a proposte on-chain e Snapshot. C'è molto da comprendere, quindi consigliamo vivamente di leggere una panoramica dell'[Houston Upgrade](/it/legacy/houston/whats-new). Questo ti aiuterà a comprendere le ultime funzionalità che abilitano la governance on-chain e come puoi partecipare nel plasmare il protocollo.

## Prerequisiti

Prima di configurare il tuo Smartnode, assicurati di:

- Aver configurato una macchina nodo (o macchina virtuale) e averla messa in sicurezza (tramite la guida [Mettere in sicurezza il tuo nodo](/it/node-staking/securing-your-node))
- Avere lo Smartnode [installato](/it/node-staking/installing/overview) e [configurato](/it/node-staking/config/overview) su di esso
- Avere un wallet nodo caricato sul tuo Smartnode
- Aver sincronizzato i tuoi client di Esecuzione e Consenso
- Aver provvisto il tuo nodo con [un indirizzo di prelievo](/it/node-staking/prepare-node#impostazione-del-tuo-indirizzo-di-prelievo-primario), configurato i tuoi [client di fallback](/it/node-staking/fallback) (opzionale), aderito alla [Smoothing Pool](/it/node-staking/fee-distrib-sp#lo-smoothing-pool) (opzionale), e configurato [MEV](/it/node-staking/mev)
- Creato almeno un [minipool](/it/node-staking/create-validator)

## Ci sono tre indirizzi coinvolti nel voto

- Indirizzo di segnalazione pDAO — verrà utilizzato come tuo indirizzo Snapshot, se vuoi votare direttamente o se vuoi sovrascrivere il voto Snapshot del tuo delegato. Questo indirizzo è utilizzato solo per Snapshot, non per il voto on-chain.

- Nodo delegato pDAO — se scegli di delegare il tuo voto. Lo imposterai sull'indirizzo del nodo del tuo delegato. Se scegli un delegato, questi voterà per te su Snapshot e per le proposte on-chain.

- Indirizzo del nodo — se non hai delegato il tuo voto o se desideri sovrascrivere il voto on-chain del tuo delegato, puoi farlo dal tuo nodo.

## Guide

[The Protocol DAO](/it/pdao/pdao) discute chi e come la pDAO governa Rocket Pool. Questa pagina ti informerà su come i compiti della pDAO come le spese del tesoro possono essere eseguiti on-chain, insieme al ruolo del nuovissimo Security Council. Ti guiderà anche attraverso il ciclo di vita di una proposta pDAO e spiegherà alcune delle misure adottate per prevenire lo spam e abbattere proposte malevole.

[Configurazione del voto per utenti non-smartnode](/it/legacy/houston/nonsmartnode-setup) mostra agli utenti non-smartnode (come gli utenti Allnodes) come configurare il voto.

[Inizializzazione del potere di voto](/it/pdao/participate#inizializzare-il-voto) ti mostra come inizializzare il potere di voto del tuo nodo. Questo passaggio è richiesto solo se il tuo nodo è stato registrato prima dell'Houston Upgrade.

[Impostazione dell'indirizzo di segnalazione Snapshot](/it/pdao/participate#impostare-lindirizzo-di-segnalazione-snapshot) ti guiderà attraverso i passaggi per impostare un indirizzo di segnalazione. Ti consentirà di votare su Snapshot utilizzando il potere di voto del tuo nodo senza dover caricare la chiave privata del tuo nodo su un wallet caldo. Assicurati di avere a portata di mano il tuo Smartnode CLI e prepara un indirizzo (che non sia il tuo wallet nodo) per questa guida.

[Delegare il potere di voto](/it/pdao/participate#delegare-il-potere-di-voto) è un rapido comando che puoi utilizzare per delegare il potere di voto invece di votare direttamente sulle proposte.

[Visualizzare lo stato di una proposta](/it/pdao/participate#visualizzare-lo-stato-di-una-proposta) è una guida su come puoi visualizzare un elenco di proposte on-chain passate e in corso. Sarai in grado di controllare lo stato e leggere i dettagli di qualsiasi proposta on-chain.

[Votare su una proposta](/it/pdao/participate#votare-su-una-proposta) ti mostra come esprimere un voto su una proposta on-chain. Questa guida illustra anche le quattro opzioni: **Astieniti**, **A favore**, **Contro** e **Veto**.

[Creare una proposta](/it/pdao/participate#creare-una-proposta) ti guida attraverso i requisiti e i passaggi per sollevare una proposta on-chain.

[Eseguire una proposta riuscita](/it/pdao/participate#eseguire-una-proposta-riuscita) ti mostrerà come applicare gli effetti di una proposta riuscita al Protocollo Rocket Pool.

[Richiedere garanzie e ricompense](/it/pdao/participate#richiedere-garanzie-e-ricompense) discute le condizioni in cui garanzie o ricompense possono essere richieste da un proponente o sfidante.

[Creare e richiedere una spesa ricorrente del tesoro](/it/pdao/participate#creare-una-spesa-ricorrente-del-tesoro) è una funzionalità che dà alla pDAO il controllo completo sull'aggiunta, modifica e rimozione di pagamenti ricorrenti.
