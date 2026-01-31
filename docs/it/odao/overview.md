# Il Rocket Pool Oracle DAO

::: warning NOTA
Questa documentazione si applica solo ai membri dell'Oracle DAO di Rocket Pool.
Se non sei stato esplicitamente invitato all'Oracle DAO e intendi solo eseguire un normale nodo Rocket Pool, questa sezione della guida non si applica a te.
Puoi tranquillamente ignorarla, ma sei il benvenuto a leggerla se sei interessato.
:::

L'**Oracle DAO** è il gruppo di nodi speciali di Rocket Pool responsabili dei compiti amministrativi richiesti dal protocollo che non possono essere realizzati tramite Smart Contract a causa di limitazioni tecniche.
Sono essenzialmente gli stessi dei normali nodi Rocket Pool; usano gli stessi strumenti, possono essere configurati con gli stessi metodi e possono persino eseguire minipool regolari, ma hanno compiti supplementari che svolgono.
Questo include cose come:

- Trasferire informazioni dalla Beacon Chain all'Execution Layer, inclusi lo stato e i saldi dei validator
- Garantire che i minipool vengano creati utilizzando chiavi pubbliche dei validator che non siano già in uso e [abbiano le corrette credenziali di prelievo](https://github.com/rocket-pool/rocketpool-research/blob/master/Reports/withdrawal-creds-exploit) in modo che il protocollo possa finanziarli in sicurezza
- Costruire il Merkle tree delle ricompense alla fine di ogni periodo di ricompense e caricarlo su IPFS affinché altri node operator possano accedervi
- Monitorare le proposte per la conformità ai [requisiti del fee recipient](../node-staking/mev.mdx) di Rocket Pool
- Proporre e votare modifiche al protocollo principale, incluse modifiche ai parametri e approvazione di aggiornamenti dei contratti
- Proporre e votare sull'elenco dell'Oracle DAO, inclusi inviti e rimozioni di altri membri dell'Oracle DAO

Come ricompensa per l'adempimento di questi compiti, l'Oracle DAO riceve collettivamente una [piccola percentuale](https://rpips.rocketpool.net/RPIPs/RPIP-25) dell'inflazione totale di RPL prodotta in ogni periodo di ricompense, divisa equamente tra i suoi membri.

A differenza dei normali nodi Rocket Pool, che possono essere creati ed eseguiti senza permessi da chiunque, l'appartenenza all'Oracle DAO è **solo su invito** da parte dei membri esistenti.
Se sei stato recentemente invitato a unirti all'Oracle DAO, questa sezione della guida ti aiuterà a comprendere il tuo ruolo, configurare il tuo nodo e garantire che rimanga in salute.

## Requisiti

Per eseguire un nodo Oracle DAO, avrai bisogno di quanto segue:

- Accesso all'**endpoint RPC di un Execution Client**. Può essere un client eseguito localmente, come nel caso della maggior parte dei nodi Rocket Pool, oppure può collegarsi a client esterni che tu o la tua organizzazione mantenete in modo indipendente.
- Accesso a un **Execution Client in modalità Archive**, che può fungere da client primario o da client supplementare (fallback). Verrà utilizzato solo in rare circostanze in cui i compiti richiedono al tuo nodo di richiamare uno stato dell'Execution Layer che è stato rimosso dal tuo Execution Client. Tuttavia, è **fondamentale** avere accesso a un Archive Node durante questi periodi per garantire che i tuoi compiti possano essere svolti con successo.
  - Ti **consigliamo vivamente** di utilizzare un archive node locale per questo, poiché servizi come [Infura](https://infura.io/pricing) o [Alchemy](https://www.alchemy.com/pricing) hanno mostrato alcune difficoltà nel tenere il passo con la domanda durante periodi critici come la costruzione del rewards tree.
- Accesso all'**endpoint REST API di un Beacon Node in modalità Archive** (tramite HTTP). Può essere un client eseguito localmente, come nel caso della maggior parte dei nodi Rocket Pool, oppure può collegarsi a client esterni che tu o la tua organizzazione mantenete in modo indipendente.
- La CLI standard dello Smartnode.
- Il daemon Smartnode è configurato ed in esecuzione in modalità `watchtower` (questo è incluso con il bundle Smartnode standard per tutti gli utenti, ma svolge attivamente i compiti solo per i nodi Oracle DAO).
  - Può essere eseguito in un container Docker (configurazione standard) o come semplice servizio `systemd` (modalità "Native").
- Abbastanza ETH per pagare i costi del gas per i tuoi compiti (discusso più avanti).

::: warning NOTA
Se semplicemente non puoi eseguire un archive node locale e _devi_ fare affidamento su un servizio di terze parti, considera quanto segue:

Se prevedi di utilizzare **Infura** per il tuo fallback in modalità Archive, devi avere almeno il piano **Team**.
Il tier gratuito e il tier Developer non sono sufficienti.

Se prevedi di utilizzare **Alchemy**, devi avere almeno il piano **Growth**.
Il tier gratuito non è sufficiente.
:::

## Attività

I compiti dell'Oracle DAO sono suddivisi in due parti.

1. **Compiti automatizzati**: questi sono compiti relativi alla routine operativa di Rocket Pool, come il trasferimento di informazioni dal Consensus Layer all'Execution Layer, il calcolo di vari aspetti del protocollo off-chain e l'invio come aggiornamenti agli Smart Contract. Ognuno di questi viene eseguito automaticamente dal processo daemon `watchtower` e non richiede intervento manuale fintanto che i tuoi client Execution e Consensus e il tuo daemon `watchtower` operano normalmente.
2. **Compiti manuali**: questi sono compiti che richiedono il tuo processo decisionale e la comunicazione fuori banda con il resto dell'Oracle DAO per essere eseguiti. Includono cose come votare su aggiornamenti dei contratti, modifiche ai parametri e inviti o rimozioni di membri da/verso l'Oracle DAO. Questi possono essere tutti eseguiti tramite la CLI Smartnode standard.

Leggi la sezione successiva per imparare come configurare il tuo nodo Oracle DAO.
