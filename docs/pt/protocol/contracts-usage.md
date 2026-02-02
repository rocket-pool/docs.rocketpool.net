# Contratos Inteligentes

## Introdução

Os [Contratos Inteligentes](https://www.ethereum.org/learn/#smart-contracts) do Rocket Pool formam a base do protocolo Rocket Pool. Eles são a camada de infraestrutura base sobre a qual todos os outros elementos da rede são construídos, a pilha de software Smart Node e todas as interfaces web ou aplicadas.

A interação direta com os contratos geralmente não é necessária, e é facilitada através do uso de outro software. Esta seção fornece uma descrição detalhada do design dos contratos e informações sobre como construir no topo do Rocket Pool para desenvolvedores que desejam estendê-lo. Todos os exemplos de código são dados como Solidity `v0.7.6`.

### Design dos Contratos

Os contratos de rede do Rocket Pool são construídos com atualizabilidade em mente, usando uma arquitetura hub-and-spoke. O hub central da rede é o contrato `RocketStorage`, que é responsável por armazenar o estado de todo o protocolo. Isso é implementado através do uso de mapas para armazenamento de chave-valor e métodos getter e setter para leitura e escrita de valores para uma chave.

O contrato `RocketStorage` também armazena os endereços de todos os outros contratos de rede (com chave por nome) e restringe a modificação de dados apenas para esses contratos. Usando essa arquitetura, o protocolo pode ser atualizado implantando novas versões de um contrato existente e atualizando seu endereço no armazenamento. Isso dá ao Rocket Pool a flexibilidade necessária para corrigir bugs ou implementar novos recursos para melhorar o protocolo.

### Interagindo com Rocket Pool

Para começar a interagir com a rede Rocket Pool, primeiro crie uma instância do contrato `RocketStorage` usando sua [interface](https://github.com/rocket-pool/rocketpool/blob/master/contracts/interface/RocketStorageInterface.sol):

```solidity
import "RocketStorageInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(0);

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

}
```

O construtor acima deve ser chamado com o endereço do contrato `RocketStorage` na rede apropriada.

Devido à arquitetura do Rocket Pool, os endereços de outros contratos não devem ser usados diretamente, mas recuperados do blockchain antes do uso. Atualizações de rede podem ter ocorrido desde a interação anterior, resultando em endereços desatualizados. `RocketStorage` nunca pode mudar de endereço, portanto é seguro manter uma referência a ele.

Outras instâncias de contrato podem ser criadas usando a interface apropriada do [repositório Rocket Pool](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface), por ex:

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

The Rocket Pool contracts, as defined in `RocketStorage`, are:

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

Legacy Rocket Pool contracts, that have been removed from `RocketStorage` since the initial deployment, are:

- `rocketClaimNode` - Handled the claiming of rewards for node operators
- `rocketClaimTrustedNode` - Handled the claiming of rewards for the oDAO

Contracts marked as “internal” do not provide methods which are accessible to the general public, and so are generally not useful for extension. For information on specific contract methods, consult their interfaces in the [Rocket Pool repository](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface).

## Deposits

The main reason for extending the Rocket Pool network is to implement custom deposit logic which funnels user deposits into the deposit pool. For example, a fund manager may wish to stake their users’ ETH in Rocket Pool via their own smart contracts, and abstract the use of Rocket Pool itself away from their users.

Note: the `RocketDepositPool` contract address should not be hard-coded in your contracts, but retrieved from `RocketStorage` dynamically. See [Interacting With Rocket Pool](#interacting-with-rocket-pool) for more details.

### Implementation

The following describes a basic example contract which forwards deposited ETH into Rocket Pool and minted rETH back to the caller:

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
