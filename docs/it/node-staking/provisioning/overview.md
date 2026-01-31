---
next:
  text: Avvio di Rocketpool
  link: "/it/node-staking/starting-rp"
---

# Panoramica

Questa sezione copre i dettagli su come preparare il tuo nodo per lo staking con Rocket Pool una volta installato e configurato lo Smartnode.
È una sezione lunga perché ci sono molte informazioni sullo staking da coprire, quindi **leggi ogni guida prima di creare il tuo primo minipool!**

## Prerequisiti

Prima di preparare il tuo nodo per lo staking, assicurati di aver fatto quanto segue:

- Configurare una macchina nodo (o macchina virtuale) e proteggerla (tramite la guida [Protezione del tuo Nodo](../securing-your-node))
- Avere lo Smartnode [installato](../installing/overview) e [configurato](../config/overview) su di essa

## Guide

[Avvio di Rocket Pool](../starting-rp) ti mostrerà come avviare i servizi dello Smartnode per ciascuna modalità e come controllare il progresso di sincronizzazione dei tuoi client Execution e Consensus.

[Creazione di un Nuovo Wallet](../wallet-init) illustra il processo di creazione di un wallet completamente nuovo con lo Smartnode se questa è la tua prima volta che configuri un nodo.

[Importazione / Recupero di un Wallet Esistente](../recovering-rp.mdx) è un'alternativa alla creazione di un nuovo wallet.
Usa questa guida se hai già un wallet di nodo che vuoi recuperare sul tuo nodo (o se stai migrando da un servizio come Allnodes al tuo hardware).

[Preparazione del tuo Nodo per l'Operatività](../prepare-node.mdx) copre alcuni importanti primi passi che vorrai fare una volta caricato un wallet sul tuo nodo, ben prima di finanziarlo con ETH o RPL (a parte una piccola quantità di ETH per i costi del gas, ovviamente).

[Specificare un Nodo di Fallback](../fallback) ti guida attraverso il processo opzionale di puntare il tuo nodo a una seconda coppia (gestita esternamente) di client Execution e Consensus che può fungere da backup per i tuoi client primari se mai si interrompono, in modo che il tuo nodo possa continuare a validare mentre esegui la manutenzione su di essi.

[Distributori di Fee e lo Smoothing Pool](../fee-distrib-sp) discutono il modo in cui le ricompense dell'Execution layer vengono fornite al tuo nodo ogni volta che uno dei tuoi validator propone un blocco, come raccogliere tali ricompense, e descrive lo **Smoothing Pool** di Rocket Pool - una funzione popolare che combina le ricompense dell'Execution layer da tutti e le distribuisce equamente durante gli intervalli di ricompensa regolari di Rocket Pool.

[MEV, MEV-Boost e Ricompense MEV](../mev.mdx) spiega il **Maximum-Extractable Value** (MEV), il suo ruolo nell'ecosistema di staking, e come puoi configurarlo a tuo piacimento usando lo Smartnode.
