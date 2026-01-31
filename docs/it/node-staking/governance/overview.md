---
next:
  text: Il Protocol DAO
  link: "/it/legacy/houston/pdao#the-protocol-dao-pdao"
---

# Panoramica

Questa sezione delinea il processo di configurazione del tuo nodo per partecipare a proposte on-chain e snapshot. C'è molto da comprendere, quindi raccomandiamo vivamente di leggere una panoramica dell'[Aggiornamento Houston](/it/legacy/houston/whats-new). Questo ti aiuterà a comprendere le ultime funzionalità che abilitano la governance on-chain e come puoi partecipare nel plasmare il protocollo.

## Prerequisiti

Prima di configurare il tuo Smartnode, assicurati di:

- Aver configurato una macchina nodo (o macchina virtuale) e protetta (tramite la guida [Proteggere il tuo Nodo](../securing-your-node))
- Avere lo Smartnode [installato](../installing/overview) e [configurato](../config/overview) su di essa
- Avere un wallet nodo caricato sul tuo Smartnode
- Sincronizzato i tuoi client Execution e Consensus
- Provveduto il tuo nodo con [un indirizzo di prelievo](../prepare-node#impostare-il-tuo-indirizzo-di-prelievo), configurato i tuoi [client di fallback](../fallback) (opzionale), optato per lo [Smoothing Pool](../fee-distrib-sp#lo-smoothing-pool) (opzionale) e configurato [MEV](../mev)
- Creato almeno un [minipool](../create-validator)

## Ci sono tre indirizzi coinvolti nel voto

- pDAO Signalling Address — verrà utilizzato come tuo indirizzo Snapshot, se vuoi votare direttamente o se vuoi sovrascrivere il voto Snapshot del tuo delegato. Questo indirizzo viene utilizzato solo per Snapshot non per il voto on-chain.

- pDAO Delegate Node — se scegli di delegare il tuo voto. Lo imposterai all'indirizzo nodo del tuo delegato. Se scegli un delegato, voterà per te su Snapshot e per le proposte on-chain.

- Node Address — se non hai delegato il tuo voto o se desideri sovrascrivere il voto on-chain del tuo delegato puoi farlo dal tuo nodo.

## Guide

[Il Protocol DAO](/it/legacy/houston/pdao#the-protocol-dao-pdao) discute chi e come il pDAO governa Rocket Pool. Questa pagina ti informerà su come i compiti del pDAO come le spese del tesoro possono essere eseguiti on-chain, insieme al ruolo del nuovo Security Council. Ti guiderà anche attraverso il ciclo di vita di una proposta pDAO e spiegherà alcune delle misure adottate per prevenire lo spam e abbattere le proposte malevole.

[Configurazione del voto per utenti non-smartnode](/it/legacy/houston/nonsmartnode-setup) mostra agli utenti non-smartnode (come gli utenti Allnodes) come configurare il voto.

[Inizializzare il Potere di Voto](/it/legacy/houston/participate#initializing-voting) ti mostra come inizializzare il potere di voto del tuo nodo. Questo passaggio è richiesto solo se il tuo nodo è stato registrato prima dell'Aggiornamento Houston.

[Impostare il tuo Snapshot Signalling Address](/it/legacy/houston/participate#setting-your-snapshot-signalling-address) ti guiderà attraverso i passaggi per impostare un Signalling Address. Ti permetterà di votare su Snapshot usando il potere di voto del tuo nodo senza dover caricare la chiave privata del tuo nodo su un hot wallet. Assicurati di avere la tua CLI Smartnode a portata di mano e prepara un indirizzo (che non sia il tuo wallet nodo) per questa guida.

[Delegare il Potere di Voto](/it/legacy/houston/participate#delegating-voting-power) è un comando rapido che puoi usare per delegare il potere di voto invece di votare direttamente sulle proposte.

[Visualizzare lo Stato di una Proposta](/it/legacy/houston/participate#viewing-the-state-of-a-proposal) è una guida su come puoi visualizzare un elenco di proposte on-chain passate e in corso. Sarai in grado di controllare lo stato e leggere i dettagli di qualsiasi proposta on-chain.

[Votare su una Proposta](/it/legacy/houston/participate#voting-on-a-proposal) ti mostra come esprimere un voto su una proposta on-chain. Questa guida copre anche le quattro opzioni: **Astensione**, **Favorevole**, **Contrario** e **Veto**.

[Creare una Proposta](/it/legacy/houston/participate#creating-a-proposal) ti guida attraverso i requisiti e i passaggi per presentare una proposta on-chain.

[Eseguire una proposta di successo](/it/legacy/houston/participate#executing-a-successful-proposal) ti mostrerà come applicare gli effetti di una proposta di successo al Protocollo Rocket Pool.

[Rivendicare Bond e Ricompense](/it/legacy/houston/participate#claiming-bonds-and-rewards) discute le condizioni in cui i bond o le ricompense possono essere rivendicati da un Proponente o Sfidante.

[Creare e Rivendicare una spesa ricorrente del tesoro](/it/legacy/houston/participate#creating-a-recurring-treasury-spend) è una funzionalità che dà al pDAO il controllo completo sull'aggiunta, modifica e rimozione di pagamenti ricorrenti.
