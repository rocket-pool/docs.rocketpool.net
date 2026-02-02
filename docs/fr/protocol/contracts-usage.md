# Contrats intelligents

## Introduction

Les [contrats intelligents](https://www.ethereum.org/learn/#smart-contracts) de Rocket Pool forment la fondation du protocole Rocket Pool. Ils constituent la couche de base de l'infrastructure sur laquelle tous les autres éléments du réseau sont construits, la pile logicielle du Smart Node et toutes les interfaces web ou d'application.

L'interaction directe avec les contrats n'est généralement pas nécessaire et est facilitée par l'utilisation d'autres logiciels. Cette section fournit une description détaillée de la conception des contrats et des informations sur la façon de construire au-dessus de Rocket Pool pour les développeurs souhaitant l'étendre. Tous les exemples de code sont donnés en Solidity `v0.7.6`.

### Conception des contrats

Les contrats réseau de Rocket Pool sont construits avec l'évolutivité à l'esprit, en utilisant une architecture en étoile. Le centre central du réseau est le contrat `RocketStorage`, qui est responsable du stockage de l'état de l'ensemble du protocole. Cela est implémenté par l'utilisation de cartes pour le stockage clé-valeur, et des méthodes getter et setter pour lire et écrire des valeurs pour une clé.

Le contrat `RocketStorage` stocke également les adresses de tous les autres contrats réseau (indexés par nom), et restreint la modification des données à ces contrats uniquement. En utilisant cette architecture, le protocole peut être mis à niveau en déployant de nouvelles versions d'un contrat existant et en mettant à jour son adresse dans le stockage. Cela donne à Rocket Pool la flexibilité nécessaire pour corriger les bugs ou implémenter de nouvelles fonctionnalités pour améliorer le protocole.

### Interagir avec Rocket Pool

Pour commencer à interagir avec le réseau Rocket Pool, créez d'abord une instance du contrat `RocketStorage` en utilisant son [interface](https://github.com/rocket-pool/rocketpool/blob/master/contracts/interface/RocketStorageInterface.sol) :

```solidity
import "RocketStorageInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(0);

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

}
```

Le constructeur ci-dessus doit être appelé avec l'adresse du contrat `RocketStorage` sur le réseau approprié.

En raison de l'architecture de Rocket Pool, les adresses des autres contrats ne doivent pas être utilisées directement mais récupérées de la blockchain avant utilisation. Des mises à niveau du réseau peuvent avoir eu lieu depuis l'interaction précédente, entraînant des adresses obsolètes. `RocketStorage` ne peut jamais changer d'adresse, il est donc sûr d'en stocker une référence.

D'autres instances de contrat peuvent être créées en utilisant l'interface appropriée tirée du [dépôt Rocket Pool](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface), par exemple :

```solidity
import "RocketStorageInterface.sol";
import "RocketDepositPoolInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(address(0));

    constructor(address _rocketStorageAddress) public {
        // Il est sûr de stocker une référence à RocketStorage
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

    function exampleMethod() public {
        // Tous les autres contrats doivent être interrogés à chaque fois qu'ils sont utilisés
        address rocketDepositPoolAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketDepositPool")));
        RocketDepositPoolInterface rocketDepositPool = RocketDepositPoolInterface(rocketDepositPoolAddress);
        // ...
    }

}
```

Les contrats Rocket Pool, tels que définis dans `RocketStorage`, sont :

- `rocketVault` - Stocke l'ETH détenu par les contrats réseau (interne, non évolutif)
- `rocketAuctionManager` - Gère la mise aux enchères du RPL confisqué de la mise des opérateurs de nœuds
- `rocketDepositPool` - Accepte l'ETH déposé par les utilisateurs et gère l'attribution aux minipools
- `rocketSmoothingPool` - Reçoit les frais de priorité et le MEV
- `rocketMinipoolBase` - Contient la logique d'initialisation et de mise à niveau du délégué pour les minipools
- `rocketMinipoolBondReducer` - Gère la fenêtre de réduction de caution et l'annulation du nœud de confiance
- `rocketMinipoolFactory` - Gère la création de contrats minipool
- `rocketMinipoolDelegate` - Contrat utilitaire de minipool (interne)
- `rocketMinipoolManager` - Crée et gère tous les minipools du réseau
- `rocketMinipoolQueue` - Organise les minipools dans une file d'attente pour l'attribution d'ETH
- `rocketMinipoolStatus` - Gère les mises à jour de statut des minipools à partir des nœuds de surveillance
- `rocketMinipoolPenalty` - Stocke les pénalités appliquées aux opérateurs de nœuds par l'oDAO
- `rocketNetworkBalances` - Gère les mises à jour de solde du réseau à partir des nœuds de surveillance
- `rocketNetworkFees` - Calcule les taux de commission des nœuds en fonction de la demande de nœuds du réseau
- `rocketNetworkPrices` - Gère les mises à jour du prix RPL et de la mise effective à partir des nœuds de surveillance
- `rocketNetworkWithdrawal` - Gère le traitement des retraits de validateur de la beacon chain
- `rocketNetworkPenalties` - Gère les pénalités des minipools
- `rocketRewardsPool` - Gère la distribution des récompenses à chaque contrat de récompenses
- `rocketClaimDAO` - Gère la réclamation des récompenses pour la pDAO
- `rocketNodeDeposit` - Gère les dépôts de nœuds pour la création de minipools
- `rocketMerkleDistributorMainnet` - Gère la distribution des récompenses RPL et ETH
- `rocketNodeDistributorDelegate` - Contient la logique pour les RocketNodeDistributors
- `rocketNodeDistributorFactory` - Gère la création de contrats RocketNodeDistributor
- `rocketNodeManager` - Enregistre et gère tous les nœuds du réseau
- `rocketNodeStaking` - Gère la mise et le retrait de mise des nœuds
- `rocketDAOProposal` - Contient des fonctionnalités communes oDAO et pDAO
- `rocketDAONodeTrusted` - Gère les propositions liées à l'oDAO
- `rocketDAONodeTrustedProposals` - Contient les fonctionnalités de proposition oDAO (interne)
- `rocketDAONodeTrustedActions` - Contient les fonctionnalités d'action oDAO (interne)
- `rocketDAONodeTrustedUpgrade` - Gère les fonctionnalités de mise à niveau du contrat oDAO (interne)
- `rocketDAONodeTrustedSettingsMembers` - Gère les paramètres relatifs aux membres de confiance
- `rocketDAONodeTrustedSettingsProposals` - Gère les paramètres relatifs aux propositions
- `rocketDAONodeTrustedSettingsMinipool` - Gère les paramètres relatifs aux minipools
- `rocketDAONodeTrustedSettingsRewards` - Gère les paramètres relatifs aux récompenses
- `rocketDAOProtocol` - Gère les propositions liées à la pDAO
- `rocketDAOProtocolProposals` - Gère les fonctionnalités de proposition pDAO (interne)
- `rocketDAOProtocolActions` - Gère les fonctionnalités d'action pDAO (interne)
- `rocketDAOProtocolSettingsInflation` - Gère les paramètres liés à l'inflation
- `rocketDAOProtocolSettingsRewards` - Gère les paramètres liés aux récompenses
- `rocketDAOProtocolSettingsAuction` - Gère les paramètres liés au système d'enchères
- `rocketDAOProtocolSettingsNode` - Gère les paramètres liés aux opérateurs de nœuds
- `rocketDAOProtocolSettingsNetwork` - Gère les paramètres liés au réseau
- `rocketDAOProtocolSettingsDeposit` - Gère les paramètres liés aux dépôts
- `rocketDAOProtocolSettingsMinipool` - Gère les paramètres liés aux minipools
- `rocketTokenRETH` - Le contrat du jeton rETH (non évolutif)
- `rocketTokenRPL` - Le contrat du jeton RPL (non évolutif)
- `rocketUpgradeOneDotOne` - A géré la mise à niveau du protocole Rocket Pool Redstone.
- `rocketUpgradeOneDotTwo` - A géré la mise à niveau du protocole Rocket Pool Atlas
- `addressQueueStorage` - Un contrat utilitaire (interne)
- `addressSetStorage` - Un contrat utilitaire (interne)

Les anciens contrats Rocket Pool, qui ont été supprimés de `RocketStorage` depuis le déploiement initial, sont :

- `rocketClaimNode` - Gérait la réclamation des récompenses pour les opérateurs de nœuds
- `rocketClaimTrustedNode` - Gérait la réclamation des récompenses pour l'oDAO

Les contrats marqués comme "internes" ne fournissent pas de méthodes accessibles au grand public, et ne sont donc généralement pas utiles pour l'extension. Pour des informations sur les méthodes de contrat spécifiques, consultez leurs interfaces dans le [dépôt Rocket Pool](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface).

## Dépôts

La raison principale d'étendre le réseau Rocket Pool est de mettre en œuvre une logique de dépôt personnalisée qui canalise les dépôts des utilisateurs dans le pool de dépôt. Par exemple, un gestionnaire de fonds peut souhaiter miser l'ETH de ses utilisateurs dans Rocket Pool via ses propres contrats intelligents, et abstraire l'utilisation de Rocket Pool elle-même de ses utilisateurs.

Remarque : l'adresse du contrat `RocketDepositPool` ne doit pas être codée en dur dans vos contrats, mais récupérée dynamiquement depuis `RocketStorage`. Voir [Interagir avec Rocket Pool](#interagir-avec-rocket-pool) pour plus de détails.

### Implémentation

Ce qui suit décrit un exemple de contrat de base qui transfère l'ETH déposé dans Rocket Pool et le rETH frappé à l'appelant :

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
        // Vérifier le montant du dépôt
        require(msg.value > 0, "Invalid deposit amount");
        // Charger les contrats
        address rocketDepositPoolAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketDepositPool")));
        RocketDepositPoolInterface rocketDepositPool = RocketDepositPoolInterface(rocketDepositPoolAddress);
        address rocketTokenRETHAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketTokenRETH")));
        RocketTokenRETHInterface rocketTokenRETH = RocketTokenRETHInterface(rocketTokenRETHAddress);
        // Transférer le dépôt vers RP et obtenir la quantité de rETH frappée
        uint256 rethBalance1 = rocketTokenRETH.balanceOf(address(this));
        rocketDepositPool.deposit{value: msg.value}();
        uint256 rethBalance2 = rocketTokenRETH.balanceOf(address(this));
        require(rethBalance2 > rethBalance1, "No rETH was minted");
        uint256 rethMinted = rethBalance2 - rethBalance1;
        // Mettre à jour le solde de l'utilisateur
        balances[msg.sender] += rethMinted;
    }

    function withdraw() external {
        // Charger les contrats
        address rocketTokenRETHAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketTokenRETH")));
        RocketTokenRETHInterface rocketTokenRETH = RocketTokenRETHInterface(rocketTokenRETHAddress);
        // Transférer rETH à l'appelant
        uint256 balance = balances[msg.sender];
        balances[msg.sender] = 0;
        require(rocketTokenRETH.transfer(msg.sender, balance), "rETH was not transferred to caller");
    }

}
```
