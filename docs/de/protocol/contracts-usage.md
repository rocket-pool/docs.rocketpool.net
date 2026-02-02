# Smart Contracts

## Einführung

Die Rocket Pool [Smart Contracts](https://www.ethereum.org/learn/#smart-contracts) bilden die Grundlage des Rocket Pool Protokolls. Sie sind die Basisinfrastruktur, auf der alle anderen Elemente des Netzwerks aufgebaut sind, der Smart Node Software-Stack und alle Web- oder Anwendungsschnittstellen.

Eine direkte Interaktion mit den Contracts ist normalerweise nicht erforderlich und wird durch die Verwendung anderer Software erleichtert. Dieser Abschnitt bietet eine detaillierte Beschreibung des Contract-Designs und Informationen zum Aufbau auf Rocket Pool für Entwickler, die es erweitern möchten. Alle Code-Beispiele sind in Solidity `v0.7.6` angegeben.

### Contract-Design

Die Rocket Pool Netzwerk-Contracts sind mit Blick auf Upgradierbarkeit gebaut und verwenden eine Hub-and-Spoke-Architektur. Der zentrale Hub des Netzwerks ist der `RocketStorage` Contract, der für die Speicherung des Zustands des gesamten Protokolls verantwortlich ist. Dies wird durch die Verwendung von Maps für Key-Value-Speicherung und Getter- und Setter-Methoden zum Lesen und Schreiben von Werten für einen Schlüssel implementiert.

Der `RocketStorage` Contract speichert auch die Adressen aller anderen Netzwerk-Contracts (nach Namen verschlüsselt) und beschränkt die Datenänderung nur auf diese Contracts. Mit dieser Architektur kann das Protokoll aktualisiert werden, indem neue Versionen eines bestehenden Contracts bereitgestellt und seine Adresse im Speicher aktualisiert werden. Dies gibt Rocket Pool die erforderliche Flexibilität, um Fehler zu beheben oder neue Funktionen zur Verbesserung des Protokolls zu implementieren.

### Interaktion mit Rocket Pool

Um mit dem Rocket Pool Netzwerk zu interagieren, erstellen Sie zunächst eine Instanz des `RocketStorage` Contracts mit seinem [Interface](https://github.com/rocket-pool/rocketpool/blob/master/contracts/interface/RocketStorageInterface.sol):

```solidity
import "RocketStorageInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(0);

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

}
```

Der obige Konstruktor sollte mit der Adresse des `RocketStorage` Contracts im entsprechenden Netzwerk aufgerufen werden.

Aufgrund der Architektur von Rocket Pool sollten die Adressen anderer Contracts nicht direkt verwendet, sondern vor der Verwendung aus der Blockchain abgerufen werden. Netzwerk-Upgrades können seit der vorherigen Interaktion stattgefunden haben, was zu veralteten Adressen führt. `RocketStorage` kann niemals die Adresse ändern, daher ist es sicher, eine Referenz darauf zu speichern.

Andere Contract-Instanzen können mit dem entsprechenden Interface aus dem [Rocket Pool Repository](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface) erstellt werden, z.B.:

```solidity
import "RocketStorageInterface.sol";
import "RocketDepositPoolInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(address(0));

    constructor(address _rocketStorageAddress) public {
        // It is safe to store reference to RocketStorage
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

    function exampleMethod() public {
        // All other contracts should be queried each time they are used
        address rocketDepositPoolAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketDepositPool")));
        RocketDepositPoolInterface rocketDepositPool = RocketDepositPoolInterface(rocketDepositPoolAddress);
        // ...
    }

}
```

Die Rocket Pool Contracts, wie in `RocketStorage` definiert, sind:

- `rocketVault` - Stores ETH held by network contracts (internal, not upgradeable)
- `rocketAuctionManager` - Handles the auctioning of RPL slashed from node operators' stake
- `rocketDepositPool` - Accepts user-deposited ETH and handles assignment to minipools
- `rocketSmoothingPool` - Receives priority fees and MEV
- `rocketMinipoolBase` - Contains the initialisation and delegate upgrade logic for minipools
- `rocketMinipoolBondReducer` - Handles bond reduction window and trusted node cancellation
- `rocketMinipoolFactory` - Handles creation of minipool contracts
- `rocketMinipoolDelegate` - Minipool utility contract (internal)
- `rocketMinipoolManager` - Creates & manages all minipools in the network
- `rocketMinipoolQueue` - Organises minipools into a queue for ETH assignment
- `rocketMinipoolStatus` - Handles minipool status updates from watchtower nodes
- `rocketMinipoolPenalty` - Stores penalties applied to node operators by the oDAO
- `rocketNetworkBalances` - Handles network balance updates from watchtower nodes
- `rocketNetworkFees` - Calculates node commission rates based on network node demand
- `rocketNetworkPrices` - Handles RPL price and effective stake updates from watchtower nodes
- `rocketNetworkWithdrawal` - Handles processing of beacon chain validator withdrawals
- `rocketNetworkPenalties` - Handles minipool penalties
- `rocketRewardsPool` - Handles the distribution of rewards to each rewards contract
- `rocketClaimDAO` - Handles the claiming of rewards for the pDAO
- `rocketNodeDeposit` - Handles node deposits for minipool creation
- `rocketMerkleDistributorMainnet` - Handles distribution of RPL and ETH rewards
- `rocketNodeDistributorDelegate` - Contains the logic for RocketNodeDistributors
- `rocketNodeDistributorFactory` - Handles creation of RocketNodeDistributor contracts
- `rocketNodeManager` - Registers & manages all nodes in the network
- `rocketNodeStaking` - Handles node staking and unstaking
- `rocketDAOProposal` - Contains common oDAO and pDAO functionality
- `rocketDAONodeTrusted` - Handles oDAO related proposals
- `rocketDAONodeTrustedProposals` - Contains oDAO proposal functionality (internal)
- `rocketDAONodeTrustedActions` - Contains oDAO action functionality (internal)
- `rocketDAONodeTrustedUpgrade` - Handles oDAO contract upgrade functionality (internal)
- `rocketDAONodeTrustedSettingsMembers` - Handles settings relating to trusted members
- `rocketDAONodeTrustedSettingsProposals` - Handles settings relating to proposals
- `rocketDAONodeTrustedSettingsMinipool` - Handles settings relating to minipools
- `rocketDAONodeTrustedSettingsRewards` - Handles settings relating to rewards
- `rocketDAOProtocol` - Handles pDAO related proposals
- `rocketDAOProtocolProposals` - Handles pDAO proposal functionality (internal)
- `rocketDAOProtocolActions` - Handles pDAO action functionality (internal)
- `rocketDAOProtocolSettingsInflation` - Handles settings related to inflation
- `rocketDAOProtocolSettingsRewards` - Handles settings related to rewards
- `rocketDAOProtocolSettingsAuction` - Handles settings related to auction system
- `rocketDAOProtocolSettingsNode` - Handles settings related to node operators
- `rocketDAOProtocolSettingsNetwork` - Handles settings related to the network
- `rocketDAOProtocolSettingsDeposit` - Handles settings related to deposits
- `rocketDAOProtocolSettingsMinipool` - Handles settings related to minipools
- `rocketTokenRETH` - The rETH token contract (not upgradeable)
- `rocketTokenRPL` - The RPL token contract (not upgradeable)
- `rocketUpgradeOneDotOne` - Handled the Rocket Pool protocol Redstone upgrade.
- `rocketUpgradeOneDotTwo` - Handled the Rocket Pool protocol Atlas upgrade
- `addressQueueStorage` - A utility contract (internal)
- `addressSetStorage` - A utility contract (internal)

Legacy Rocket Pool Contracts, die seit der ersten Bereitstellung aus `RocketStorage` entfernt wurden, sind:

- `rocketClaimNode` - Verarbeitete die Beanspruchung von Belohnungen für Node-Betreiber
- `rocketClaimTrustedNode` - Verarbeitete die Beanspruchung von Belohnungen für die oDAO

Contracts, die als "internal" gekennzeichnet sind, stellen keine Methoden bereit, die der allgemeinen Öffentlichkeit zugänglich sind, und sind daher im Allgemeinen nicht für Erweiterungen nützlich. Für Informationen zu spezifischen Contract-Methoden konsultieren Sie deren Interfaces im [Rocket Pool Repository](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface).

## Deposits

Der Hauptgrund für die Erweiterung des Rocket Pool Netzwerks besteht darin, benutzerdefinierte Einzahlungslogik zu implementieren, die Nutzereinzahlungen in den Deposit Pool leitet. Beispielsweise möchte ein Fondsmanager möglicherweise das ETH seiner Nutzer über eigene Smart Contracts in Rocket Pool staken und die Verwendung von Rocket Pool selbst von seinen Nutzern abstrahieren.

Hinweis: Die `RocketDepositPool` Contract-Adresse sollte nicht in Ihren Contracts fest codiert werden, sondern dynamisch aus `RocketStorage` abgerufen werden. Siehe [Interaktion mit Rocket Pool](#interacting-with-rocket-pool) für weitere Details.

### Implementierung

Das Folgende beschreibt einen grundlegenden Beispiel-Contract, der eingezahltes ETH an Rocket Pool weiterleitet und geprägtes rETH an den Aufrufer zurückgibt:

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
        // Check deposit amount
        require(msg.value > 0, "Invalid deposit amount");
        // Load contracts
        address rocketDepositPoolAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketDepositPool")));
        RocketDepositPoolInterface rocketDepositPool = RocketDepositPoolInterface(rocketDepositPoolAddress);
        address rocketTokenRETHAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketTokenRETH")));
        RocketTokenRETHInterface rocketTokenRETH = RocketTokenRETHInterface(rocketTokenRETHAddress);
        // Forward deposit to RP & get amount of rETH minted
        uint256 rethBalance1 = rocketTokenRETH.balanceOf(address(this));
        rocketDepositPool.deposit{value: msg.value}();
        uint256 rethBalance2 = rocketTokenRETH.balanceOf(address(this));
        require(rethBalance2 > rethBalance1, "No rETH was minted");
        uint256 rethMinted = rethBalance2 - rethBalance1;
        // Update user's balance
        balances[msg.sender] += rethMinted;
    }

    function withdraw() external {
        // Load contracts
        address rocketTokenRETHAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketTokenRETH")));
        RocketTokenRETHInterface rocketTokenRETH = RocketTokenRETHInterface(rocketTokenRETHAddress);
        // Transfer rETH to caller
        uint256 balance = balances[msg.sender];
        balances[msg.sender] = 0;
        require(rocketTokenRETH.transfer(msg.sender, balance), "rETH was not transferred to caller");
    }

}
```
