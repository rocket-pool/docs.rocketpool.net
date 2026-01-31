---
next:
  text: Creare un Nuovo Minipool (Validatore)
  link: "/it/node-staking/create-validator"
---

::: danger ATTENZIONE
I depositi di minipool sono attualmente disabilitati in preparazione per Saturn 1.
:::

# Panoramica

Questa sezione copre i processi di creazione e migrazione dei minipool (validatori Rocket Pool).
Qui imparerai come iniziare a validare la rete Ethereum e guadagnare ricompense per questo.

## Prerequisiti

Prima di eseguire minipool, assicurati di:

- Aver configurato una macchina nodo (o macchina virtuale) e averla messa in sicurezza (tramite la guida [Mettere in Sicurezza il tuo Nodo](../securing-your-node))
- Aver [installato](../installing/overview) e [configurato](../config/overview) lo Smartnode su di essa
- Avere un wallet del nodo caricato sul tuo Smartnode
- Aver sincronizzato i tuoi client Execution e Consensus
- Aver fornito al tuo nodo [un indirizzo di prelievo](../prepare-node.mdx#setting-your-withdrawal-address), configurato i tuoi [client di fallback](../fallback) (opzionale), aderito alla [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (opzionale) e configurato [MEV](../mev.mdx)

## Guide

[Creare un Nuovo Minipool (Validatore)](../create-validator.mdx) spiega il processo di creazione di un nuovo minipool Rocket Pool e del corrispondente validatore sulla Beacon Chain.
Che tu stia creando il tuo primissimo minipool o ne abbia già alcuni e desideri crearne un altro, questa guida ti accompagnerà passo dopo passo.

[Il Delegate del Minipool](./delegates) spiega un po' cosa sia il contratto del minipool e introduce il contratto **delegate** che contiene la maggior parte delle sue funzionalità.
Mostra anche come aggiornare il delegate per i tuoi minipool dopo un aggiornamento della rete per sfruttare le nuove funzionalità.

[Convertire un Validatore Solo in un Minipool](../solo-staker-migration) illustra il processo di conversione di un validatore esistente al di fuori di Rocket Pool (come uno che usi per lo staking solo) direttamente in un minipool Rocket Pool senza dover uscire dalla Beacon Chain e creare un nuovo minipool.
Se sei un solo staker che vuole sfruttare questa capacità, questa è la guida per te!

[Migrare un Minipool da 16-ETH a 8-ETH](../leb-migration.mdx) mostra come ridurre la quantità bondata di ETH per un minipool da 16 ETH a 8 ETH, dandoti 8 ETH in credito che possono essere usati per creare un nuovo minipool gratuitamente (anche se costa ancora ETH per il gas, ovviamente).

[Il Sistema di Credito per i Depositi](../credit) copre il sistema "ETH Credit" che ti consente di creare nuovi minipool senza dover pagare per i loro bond ETH dopo aver eseguito una delle migrazioni sopra indicate.
