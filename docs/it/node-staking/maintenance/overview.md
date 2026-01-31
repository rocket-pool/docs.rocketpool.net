---
next:
  text: Monitoraggio delle Prestazioni del Tuo Nodo
  link: "/it/node-staking/performance"
---

# Panoramica

In questa sezione, imparerete come monitorare la salute del vostro nodo e dei vostri validatori, tracciare i vostri guadagni ed eseguire manutenzione periodica come gli aggiornamenti.

## Prerequisiti

Prima di configurare il vostro Smartnode, assicuratevi di:

- Aver configurato una macchina nodo (o macchina virtuale) e averla messa in sicurezza (tramite la guida [Mettere in Sicurezza il Vostro Nodo](../securing-your-node))
- Avere lo Smartnode [installato](../installing/overview) e [configurato](../config/overview) su di essa
- Avere un portafoglio nodo caricato sul vostro Smartnode
- Sincronizzato i vostri client di esecuzione e consenso
- Fornito il vostro nodo con [un indirizzo di prelievo](../prepare-node.mdx#setting-your-withdrawal-address), configurato i vostri [client di fallback](../fallback) (opzionale), aderito alla [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (opzionale) e configurato [MEV](../mev.mdx)
- Creato almeno un [minipool](../create-validator.mdx)

## Guide

[Monitoraggio delle Prestazioni del Vostro Nodo](../performance) fornisce alcuni strumenti e tutorial per tenere d'occhio la salute del vostro nodo (dal punto di vista delle risorse, come il consumo di CPU e RAM) e le prestazioni dei vostri validatori sulla Beacon Chain.
Copre molti strumenti fondamentali che userete durante il vostro mandato come validatore Ethereum.

[Configurazione della Dashboard Grafana](../grafana.mdx) illustra come configurare il tracker delle metriche dello stack Smartnode e la dashboard Grafana - un punto di riferimento unico per monitorare tutto ciò che riguarda il vostro nodo e i validatori, e un elemento fondamentale nell'arsenale di ogni operatore di nodi.
_Consigliamo vivamente_ di esplorare la dashboard Grafana e di controllarla regolarmente.

[Notifiche di Avviso dello Stack Smartnode](./alerting.md) illustra come utilizzare la funzionalità di notifica avvisi dello Smartnode per ricevere notifiche sulla salute e sugli eventi importanti del vostro Rocket Pool Smartnode.

[Verifica degli Aggiornamenti](../updates) copre i processi cruciali di aggiornamento regolare del vostro nodo con nuove patch di sicurezza, come aggiornare lo Smartnode dopo un nuovo rilascio e come aggiornare manualmente le versioni dei client se i client che avete scelto rilasciano una nuova versione che l'ultimo rilascio dello Smartnode non include ancora.
Dovreste familiarizzare con l'intera sezione, poiché potreste dovervi fare riferimento ogni volta che viene rilasciato un aggiornamento.

[Backup del Vostro Nodo](../backups) è una guida opzionale che descrive come eseguire il backup della configurazione del vostro nodo e dei suoi dati della catena in caso di guasto hardware.

[Pruning del Client di Esecuzione](../pruning) è **importante** per chiunque esegua un client di esecuzione che consuma gradualmente tutto lo spazio su disco del vostro SSD e richiede pruning periodico (come Geth o Nethermind) per recuperare parte di quello spazio.
Se state eseguendo uno di quei client, dovreste sicuramente familiarizzare con il processo di pruning.

[Cambio di Client di Esecuzione o Consenso](../change-clients) è una guida utile; illustra il processo di cambio della vostra scelta di client e cosa aspettarsi durante il processo.
Questa è un'altra buona guida con cui familiarizzare, nel caso in cui dobbiate mai cambiare client per qualsiasi motivo in futuro.
