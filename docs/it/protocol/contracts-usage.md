# Smart Contract

## Introduzione

Gli [Smart Contract](https://www.ethereum.org/learn/#smart-contracts) di Rocket Pool costituiscono le fondamenta del protocollo Rocket Pool. Sono il livello base di infrastruttura su cui sono costruiti tutti gli altri elementi della rete, lo stack software Smart Node e tutte le interfacce web o applicative.

L'interazione diretta con i contratti solitamente non è necessaria ed è facilitata attraverso l'uso di altri software. Questa sezione fornisce una descrizione dettagliata del design dei contratti e informazioni su come costruire sopra Rocket Pool per gli sviluppatori che desiderano estenderlo. Tutti gli esempi di codice sono forniti in Solidity `v0.7.6`.

### Design dei Contratti

I contratti di rete di Rocket Pool sono costruiti con l'aggiornabilità in mente, utilizzando un'architettura hub-and-spoke. Il fulcro centrale della rete è il contratto `RocketStorage`, che è responsabile della memorizzazione dello stato dell'intero protocollo. Questo è implementato attraverso l'uso di mappe per l'archiviazione chiave-valore e metodi getter e setter per leggere e scrivere valori per una chiave.

Il contratto `RocketStorage` memorizza anche gli indirizzi di tutti gli altri contratti di rete (indicizzati per nome) e limita la modifica dei dati solo a quei contratti. Utilizzando questa architettura, il protocollo può essere aggiornato distribuendo nuove versioni di un contratto esistente e aggiornando il suo indirizzo nello storage. Questo fornisce a Rocket Pool la flessibilità necessaria per correggere bug o implementare nuove funzionalità per migliorare il protocollo.

### Interagire con Rocket Pool

Per iniziare a interagire con la rete Rocket Pool, crea prima un'istanza del contratto `RocketStorage` usando la sua [interfaccia](https://github.com/rocket-pool/rocketpool/blob/master/contracts/interface/RocketStorageInterface.sol):

```solidity
import "RocketStorageInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(0);

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

}
```

Il costruttore sopra dovrebbe essere chiamato con l'indirizzo del contratto `RocketStorage` sulla rete appropriata.

A causa dell'architettura di Rocket Pool, gli indirizzi degli altri contratti non dovrebbero essere usati direttamente ma recuperati dalla blockchain prima dell'uso. Potrebbero essere avvenuti aggiornamenti di rete dall'interazione precedente, risultando in indirizzi obsoleti. `RocketStorage` non può mai cambiare indirizzo, quindi è sicuro memorizzarne un riferimento.

Altre istanze di contratti possono essere create usando l'interfaccia appropriata presa dal [repository Rocket Pool](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface), ad esempio:

```solidity
import "RocketStorageInterface.sol";
import "RocketDepositPoolInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(address(0));

    constructor(address _rocketStorageAddress) public {
        // È sicuro memorizzare il riferimento a RocketStorage
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

    function exampleMethod() public {
        // Tutti gli altri contratti dovrebbero essere interrogati ogni volta che vengono utilizzati
        address rocketDepositPoolAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketDepositPool")));
        RocketDepositPoolInterface rocketDepositPool = RocketDepositPoolInterface(rocketDepositPoolAddress);
        // ...
    }

}
```

I contratti Rocket Pool, come definiti in `RocketStorage`, sono:

- `rocketVault` - Memorizza ETH detenuto dai contratti di rete (interno, non aggiornabile)
- `rocketAuctionManager` - Gestisce l'asta di RPL tagliato dallo stake dei node operator
- `rocketDepositPool` - Accetta ETH depositato dagli utenti e gestisce l'assegnazione ai minipool
- `rocketSmoothingPool` - Riceve priority fees e MEV
- `rocketMinipoolBase` - Contiene la logica di inizializzazione e aggiornamento delegato per i minipool
- `rocketMinipoolBondReducer` - Gestisce la finestra di riduzione del bond e la cancellazione del trusted node
- `rocketMinipoolFactory` - Gestisce la creazione dei contratti minipool
- `rocketMinipoolDelegate` - Contratto utility minipool (interno)
- `rocketMinipoolManager` - Crea e gestisce tutti i minipool nella rete
- `rocketMinipoolQueue` - Organizza i minipool in una coda per l'assegnazione ETH
- `rocketMinipoolStatus` - Gestisce gli aggiornamenti dello stato del minipool dai nodi watchtower
- `rocketMinipoolPenalty` - Memorizza le penalità applicate ai node operator dalla oDAO
- `rocketNetworkBalances` - Gestisce gli aggiornamenti del saldo di rete dai nodi watchtower
- `rocketNetworkFees` - Calcola i tassi di commissione del nodo in base alla domanda di nodi della rete
- `rocketNetworkPrices` - Gestisce gli aggiornamenti del prezzo RPL e dello stake effettivo dai nodi watchtower
- `rocketNetworkWithdrawal` - Gestisce l'elaborazione dei prelievi del validator della beacon chain
- `rocketNetworkPenalties` - Gestisce le penalità dei minipool
- `rocketRewardsPool` - Gestisce la distribuzione delle ricompense a ciascun contratto di ricompense
- `rocketClaimDAO` - Gestisce la richiesta di ricompense per la pDAO
- `rocketNodeDeposit` - Gestisce i depositi dei nodi per la creazione di minipool
- `rocketMerkleDistributorMainnet` - Gestisce la distribuzione delle ricompense RPL ed ETH
- `rocketNodeDistributorDelegate` - Contiene la logica per i RocketNodeDistributor
- `rocketNodeDistributorFactory` - Gestisce la creazione dei contratti RocketNodeDistributor
- `rocketNodeManager` - Registra e gestisce tutti i nodi nella rete
- `rocketNodeStaking` - Gestisce lo staking e l'unstaking dei nodi
- `rocketDAOProposal` - Contiene funzionalità comuni a oDAO e pDAO
- `rocketDAONodeTrusted` - Gestisce le proposte relative alla oDAO
- `rocketDAONodeTrustedProposals` - Contiene funzionalità delle proposte oDAO (interno)
- `rocketDAONodeTrustedActions` - Contiene funzionalità delle azioni oDAO (interno)
- `rocketDAONodeTrustedUpgrade` - Gestisce la funzionalità di aggiornamento del contratto oDAO (interno)
- `rocketDAONodeTrustedSettingsMembers` - Gestisce le impostazioni relative ai membri trusted
- `rocketDAONodeTrustedSettingsProposals` - Gestisce le impostazioni relative alle proposte
- `rocketDAONodeTrustedSettingsMinipool` - Gestisce le impostazioni relative ai minipool
- `rocketDAONodeTrustedSettingsRewards` - Gestisce le impostazioni relative alle ricompense
- `rocketDAOProtocol` - Gestisce le proposte relative alla pDAO
- `rocketDAOProtocolProposals` - Gestisce la funzionalità delle proposte pDAO (interno)
- `rocketDAOProtocolActions` - Gestisce la funzionalità delle azioni pDAO (interno)
- `rocketDAOProtocolSettingsInflation` - Gestisce le impostazioni relative all'inflazione
- `rocketDAOProtocolSettingsRewards` - Gestisce le impostazioni relative alle ricompense
- `rocketDAOProtocolSettingsAuction` - Gestisce le impostazioni relative al sistema d'asta
- `rocketDAOProtocolSettingsNode` - Gestisce le impostazioni relative ai node operator
- `rocketDAOProtocolSettingsNetwork` - Gestisce le impostazioni relative alla rete
- `rocketDAOProtocolSettingsDeposit` - Gestisce le impostazioni relative ai depositi
- `rocketDAOProtocolSettingsMinipool` - Gestisce le impostazioni relative ai minipool
- `rocketTokenRETH` - Il contratto del token rETH (non aggiornabile)
- `rocketTokenRPL` - Il contratto del token RPL (non aggiornabile)
- `rocketUpgradeOneDotOne` - Ha gestito l'upgrade del protocollo Rocket Pool Redstone.
- `rocketUpgradeOneDotTwo` - Ha gestito l'upgrade del protocollo Rocket Pool Atlas
- `addressQueueStorage` - Un contratto utility (interno)
- `addressSetStorage` - Un contratto utility (interno)

I contratti legacy di Rocket Pool, che sono stati rimossi da `RocketStorage` dalla distribuzione iniziale, sono:

- `rocketClaimNode` - Gestiva la richiesta di ricompense per i node operator
- `rocketClaimTrustedNode` - Gestiva la richiesta di ricompense per la oDAO

I contratti contrassegnati come "interni" non forniscono metodi accessibili al pubblico generale e quindi generalmente non sono utili per l'estensione. Per informazioni su metodi specifici dei contratti, consulta le loro interfacce nel [repository Rocket Pool](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface).

## Depositi

Il motivo principale per estendere la rete Rocket Pool è implementare una logica di deposito personalizzata che incanala i depositi degli utenti nella deposit pool. Ad esempio, un fund manager potrebbe voler mettere in stake l'ETH dei propri utenti in Rocket Pool tramite i propri smart contract e astrarre l'uso di Rocket Pool stesso dai propri utenti.

Nota: l'indirizzo del contratto `RocketDepositPool` non dovrebbe essere codificato nei tuoi contratti, ma recuperato da `RocketStorage` dinamicamente. Vedi [Interagire con Rocket Pool](#interagire-con-rocket-pool) per maggiori dettagli.

### Implementazione

Di seguito viene descritto un esempio di contratto base che inoltra l'ETH depositato in Rocket Pool e restituisce rETH mintato al chiamante:

```solidity
import "RocketStorageInterface.sol";
import "RocketDepositPoolInterface.sol";
import "RocketTokenRETHInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(address(0));
    mapping(address => uint256) balances;

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

    function deposit() external payable {
        // Controlla l'importo del deposito
        require(msg.value > 0, "Invalid deposit amount");
        // Carica i contratti
        address rocketDepositPoolAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketDepositPool")));
        RocketDepositPoolInterface rocketDepositPool = RocketDepositPoolInterface(rocketDepositPoolAddress);
        address rocketTokenRETHAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketTokenRETH")));
        RocketTokenRETHInterface rocketTokenRETH = RocketTokenRETHInterface(rocketTokenRETHAddress);
        // Inoltra il deposito a RP e ottieni la quantità di rETH mintato
        uint256 rethBalance1 = rocketTokenRETH.balanceOf(address(this));
        rocketDepositPool.deposit{value: msg.value}();
        uint256 rethBalance2 = rocketTokenRETH.balanceOf(address(this));
        require(rethBalance2 > rethBalance1, "No rETH was minted");
        uint256 rethMinted = rethBalance2 - rethBalance1;
        // Aggiorna il saldo dell'utente
        balances[msg.sender] += rethMinted;
    }

    function withdraw() external {
        // Carica i contratti
        address rocketTokenRETHAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketTokenRETH")));
        RocketTokenRETHInterface rocketTokenRETH = RocketTokenRETHInterface(rocketTokenRETHAddress);
        // Trasferisci rETH al chiamante
        uint256 balance = balances[msg.sender];
        balances[msg.sender] = 0;
        require(rocketTokenRETH.transfer(msg.sender, balance), "rETH was not transferred to caller");
    }

}
```
