# Contratos Inteligentes

## Introdução

Os [Contratos Inteligentes](https://www.ethereum.org/learn/#smart-contracts) do Rocket Pool formam a base do protocolo Rocket Pool. Eles são a camada base de infraestrutura sobre a qual todos os outros elementos da rede são construídos, a pilha de software Smart Node e todas as interfaces web ou de aplicação.

A interação direta com os contratos geralmente não é necessária e é facilitada através do uso de outro software. Esta seção fornece uma descrição detalhada do design do contrato e informações sobre como construir sobre o Rocket Pool para desenvolvedores que desejam estendê-lo. Todos os exemplos de código são fornecidos em Solidity `v0.7.6`.

### Design do Contrato

Os contratos da rede Rocket Pool são construídos com atualizabilidade em mente, usando uma arquitetura hub-and-spoke. O hub central da rede é o contrato `RocketStorage`, que é responsável por armazenar o estado de todo o protocolo. Isso é implementado através do uso de mapas para armazenamento chave-valor e métodos getter e setter para ler e escrever valores para uma chave.

O contrato `RocketStorage` também armazena os endereços de todos os outros contratos da rede (indexados por nome) e restringe a modificação de dados apenas a esses contratos. Usando esta arquitetura, o protocolo pode ser atualizado implantando novas versões de um contrato existente e atualizando seu endereço no armazenamento. Isso dá ao Rocket Pool a flexibilidade necessária para corrigir bugs ou implementar novos recursos para melhorar o protocolo.

### Interagindo com o Rocket Pool

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

Devido à arquitetura do Rocket Pool, os endereços de outros contratos não devem ser usados diretamente, mas recuperados da blockchain antes do uso. Atualizações da rede podem ter ocorrido desde a interação anterior, resultando em endereços desatualizados. `RocketStorage` nunca pode mudar de endereço, então é seguro armazenar uma referência a ele.

Outras instâncias de contrato podem ser criadas usando a interface apropriada retirada do [repositório Rocket Pool](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface), por exemplo:

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

Os contratos Rocket Pool, conforme definidos em `RocketStorage`, são:

- `rocketVault` - Armazena ETH mantido por contratos da rede (interno, não atualizável)
- `rocketAuctionManager` - Lida com o leilão de RPL confiscado do stake dos operadores de nós
- `rocketDepositPool` - Aceita ETH depositado por usuários e lida com atribuição a minipools
- `rocketSmoothingPool` - Recebe taxas de prioridade e MEV
- `rocketMinipoolBase` - Contém a lógica de inicialização e atualização de delegado para minipools
- `rocketMinipoolBondReducer` - Lida com janela de redução de vínculo e cancelamento de nó confiável
- `rocketMinipoolFactory` - Lida com criação de contratos de minipool
- `rocketMinipoolDelegate` - Contrato utilitário de minipool (interno)
- `rocketMinipoolManager` - Cria e gerencia todos os minipools na rede
- `rocketMinipoolQueue` - Organiza minipools em uma fila para atribuição de ETH
- `rocketMinipoolStatus` - Lida com atualizações de status de minipool de nós watchtower
- `rocketMinipoolPenalty` - Armazena penalidades aplicadas aos operadores de nós pelo oDAO
- `rocketNetworkBalances` - Lida com atualizações de saldo de rede de nós watchtower
- `rocketNetworkFees` - Calcula taxas de comissão de nó com base na demanda de nós da rede
- `rocketNetworkPrices` - Lida com atualizações de preço RPL e stake efetivo de nós watchtower
- `rocketNetworkWithdrawal` - Lida com processamento de retiradas de validadores da beacon chain
- `rocketNetworkPenalties` - Lida com penalidades de minipool
- `rocketRewardsPool` - Lida com a distribuição de recompensas para cada contrato de recompensas
- `rocketClaimDAO` - Lida com a reivindicação de recompensas para o pDAO
- `rocketNodeDeposit` - Lida com depósitos de nó para criação de minipool
- `rocketMerkleDistributorMainnet` - Lida com distribuição de recompensas RPL e ETH
- `rocketNodeDistributorDelegate` - Contém a lógica para RocketNodeDistributors
- `rocketNodeDistributorFactory` - Lida com criação de contratos RocketNodeDistributor
- `rocketNodeManager` - Registra e gerencia todos os nós na rede
- `rocketNodeStaking` - Lida com staking e unstaking de nós
- `rocketDAOProposal` - Contém funcionalidade comum de oDAO e pDAO
- `rocketDAONodeTrusted` - Lida com propostas relacionadas ao oDAO
- `rocketDAONodeTrustedProposals` - Contém funcionalidade de proposta do oDAO (interno)
- `rocketDAONodeTrustedActions` - Contém funcionalidade de ação do oDAO (interno)
- `rocketDAONodeTrustedUpgrade` - Lida com funcionalidade de atualização de contrato do oDAO (interno)
- `rocketDAONodeTrustedSettingsMembers` - Lida com configurações relacionadas a membros confiáveis
- `rocketDAONodeTrustedSettingsProposals` - Lida com configurações relacionadas a propostas
- `rocketDAONodeTrustedSettingsMinipool` - Lida com configurações relacionadas a minipools
- `rocketDAONodeTrustedSettingsRewards` - Lida com configurações relacionadas a recompensas
- `rocketDAOProtocol` - Lida com propostas relacionadas ao pDAO
- `rocketDAOProtocolProposals` - Lida com funcionalidade de proposta do pDAO (interno)
- `rocketDAOProtocolActions` - Lida com funcionalidade de ação do pDAO (interno)
- `rocketDAOProtocolSettingsInflation` - Lida com configurações relacionadas à inflação
- `rocketDAOProtocolSettingsRewards` - Lida com configurações relacionadas a recompensas
- `rocketDAOProtocolSettingsAuction` - Lida com configurações relacionadas ao sistema de leilão
- `rocketDAOProtocolSettingsNode` - Lida com configurações relacionadas aos operadores de nós
- `rocketDAOProtocolSettingsNetwork` - Lida com configurações relacionadas à rede
- `rocketDAOProtocolSettingsDeposit` - Lida com configurações relacionadas a depósitos
- `rocketDAOProtocolSettingsMinipool` - Lida com configurações relacionadas a minipools
- `rocketTokenRETH` - O contrato do token rETH (não atualizável)
- `rocketTokenRPL` - O contrato do token RPL (não atualizável)
- `rocketUpgradeOneDotOne` - Lidou com a atualização do protocolo Rocket Pool Redstone.
- `rocketUpgradeOneDotTwo` - Lidou com a atualização do protocolo Rocket Pool Atlas
- `addressQueueStorage` - Um contrato utilitário (interno)
- `addressSetStorage` - Um contrato utilitário (interno)

Contratos Rocket Pool legados, que foram removidos do `RocketStorage` desde a implantação inicial, são:

- `rocketClaimNode` - Lidou com a reivindicação de recompensas para operadores de nós
- `rocketClaimTrustedNode` - Lidou com a reivindicação de recompensas para o oDAO

Contratos marcados como "interno" não fornecem métodos acessíveis ao público em geral e, portanto, geralmente não são úteis para extensão. Para informações sobre métodos específicos de contratos, consulte suas interfaces no [repositório Rocket Pool](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface).

## Depósitos

A principal razão para estender a rede Rocket Pool é implementar lógica de depósito personalizada que canaliza depósitos de usuários para o pool de depósitos. Por exemplo, um gestor de fundos pode desejar fazer stake do ETH de seus usuários no Rocket Pool por meio de seus próprios contratos inteligentes e abstrair o uso do próprio Rocket Pool de seus usuários.

Nota: o endereço do contrato `RocketDepositPool` não deve ser codificado rigidamente em seus contratos, mas recuperado de `RocketStorage` dinamicamente. Veja [Interagindo com o Rocket Pool](#interagindo-com-o-rocket-pool) para mais detalhes.

### Implementação

O seguinte descreve um contrato de exemplo básico que encaminha ETH depositado para o Rocket Pool e rETH cunhado de volta ao chamador:

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
