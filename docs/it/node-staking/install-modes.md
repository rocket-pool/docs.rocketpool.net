# Selezione di una Modalità Rocket Pool

Lo stack Smartnode di Rocket Pool è abbastanza flessibile; ci sono diversi modi per eseguirlo.
Può configurare un intero nodo completo da zero, può integrarsi con distribuzioni esistenti di client Execution o Consensus, e può persino funzionare nativamente come un insieme di servizi di sistema.
In questa sezione, tratteremo i modi tipici di configurare e utilizzare lo stack Smartnode.

## La Configurazione Predefinita Basata su Docker

La modalità predefinita, e il modo più comune per eseguire uno Smartnode, è fargli creare un'intera istanza di nodo completo sulla tua macchina locale che Rocket Pool gestisce.

Per ottenere questo risultato, lo Smartnode utilizza [container Docker](https://www.docker.com/resources/what-container).
In sostanza, un container Docker è un piccolo sandbox che viene preconfigurato con un programma, tutte le sue dipendenze e tutta la configurazione necessaria per funzionare correttamente.
Quando non è più necessario, può semplicemente essere eliminato.
È un piccolo pacchetto autonomo che permette alle cose di funzionare senza creare disordine nel filesystem effettivo o in altri programmi.

Questa modalità è ciò che l'Installer Smartnode distribuirà per te.
Utilizza i seguenti container Docker:

- `rocketpool_api` - Contiene la funzionalità effettiva che lo Smartnode fornisce quando interagisci con esso tramite l'interfaccia a riga di comando (CLI) di Rocket Pool.
- `rocketpool_node` - È un processo in background che controllerà periodicamente e richiederà le ricompense RPL dopo un checkpoint di ricompensa (se hai abilitato la richiesta automatica, più avanti su questo), ed è responsabile dello staking di nuovi validatori quando crei una minipool.
- `rocketpool_watchtower` - Viene utilizzato dai Nodi Oracle per svolgere compiti relativi agli oracle. Per gli operatori di nodi regolari, questo rimarrà semplicemente inattivo.
- `rocketpool_eth1` - Questo sarà il tuo client Execution.
- `rocketpool_eth2` - Questo sarà il tuo client Consensus beacon node.
- `rocketpool_validator` - Questo sarà il tuo client Validator, che è responsabile dei tuoi compiti da validatore (come attestare i blocchi o proporre nuovi blocchi).

Nella maggior parte delle situazioni, questa è una buona opzione da scegliere quando si crea un nuovo nodo da zero.
È la procedura più veloce e che richiede meno interventi manuali.
Gestirà anche gli aggiornamenti dei client Execution e Consensus con ogni nuova release dello Smartnode, quindi non devi preoccupartene (anche se puoi aggiornarli manualmente in qualsiasi momento se lo desideri).

::: warning NOTA
Attualmente, alcuni dei container Docker devono essere eseguiti come utente `root` per funzionare correttamente.
Sebbene i container Docker siano generalmente molto bravi a impedire a un utente di uscire nel tuo sistema operativo principale, potresti non essere a tuo agio con questo requisito per motivi di sicurezza.
In questo caso, ti suggeriamo di utilizzare la modalità di configurazione Nativa elencata di seguito.
:::

Se desideri utilizzare questa modalità, procedi alla sezione [Configurazione di un Nodo Rocket Pool Standard con Docker](./docker).

## La Configurazione Ibrida con Client Esterni

La configurazione ibrida è adatta per gli utenti che sono interessati a eseguire un nodo Rocket Pool, ma hanno già i propri client Execution e/o Consensus in esecuzione per altri scopi (ad esempio, perché stanno già facendo staking in solo).

In questa modalità, Rocket Pool distribuirà container Docker per i propri processi e per un client Validator che gestisce, ma ignorerà i container del client Execution e del Beacon Node per qualsiasi client esterno che già esegui e mantieni.
**Poiché Rocket Pool creerà e manterrà nuove chiavi del validatore per ciascuna delle minipool del tuo nodo, è importante che esegua il proprio client Validator.**

Quando si utilizza questa configurazione, lo Smartnode utilizzerà i seguenti container Docker (che sono stati descritti sopra):

- `rocketpool_api`
- `rocketpool_node`
- `rocketpool_watchtower`
- `rocketpool_validator`

I container `rocketpool_eth1` e `rocketpool_eth2` saranno inclusi o esclusi, a seconda di quali client hai già in esecuzione esternamente.

Se desideri utilizzare questa modalità, procedi alla sezione [Configurazione di un Nodo Rocket Pool Standard con Docker](./docker).
Quando ti viene richiesto di scegliere una modalità di gestione per i tuoi client Execution e/o Consensus, scegli l'opzione **Gestito Esternamente** che è descritta in dettaglio all'interno di quella sezione.

## La Configurazione Nativa senza Docker

Questa configurazione bypassa completamente Docker.
Invece di eseguire lo stack Smartnode tramite Docker, ogni processo verrà installato come servizio di sistema locale (ad es. tramite `systemd`).
Ciò include i processi `node`, `watchtower`, `eth1`, `eth2` e `validator`.

Questa configurazione offre la massima flessibilità perché ti consente di regolare con precisione i parametri di Rocket Pool (come la sua postura di sicurezza, dove si trovano i client Execution e Consensus, dove si trovano i dati della chain, dove si trovano le tue chiavi e così via).
È anche la più difficile da configurare e mantenere.

In questa modalità, l'Installer Smartnode non è più rilevante.
Sei responsabile dell'istanziazione, manutenzione e aggiornamento manuale dell'infrastruttura Smartnode, dei client ETH e dei client validatori.

::: danger ATTENZIONE
Sebbene forniamo della documentazione di esempio su come farlo, suggeriamo che questa modalità dovrebbe essere utilizzata solo da **amministratori di sistema esperti**.
:::

Se desideri utilizzare questa modalità, procedi alla sezione [Configurazione di un Nodo Rocket Pool Nativo senza Docker](./native.mdx).
