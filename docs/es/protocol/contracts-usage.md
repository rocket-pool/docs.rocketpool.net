# Smart Contracts

## Introducción

Los [Smart Contracts](https://www.ethereum.org/learn/#smart-contracts) de Rocket Pool forman la base del protocolo de Rocket Pool. Son la capa base de infraestructura sobre la cual se construyen todos los demás elementos de la red, el stack de software Smart Node y todas las interfaces web o de aplicación.

La interacción directa con los contratos generalmente no es necesaria y se facilita mediante el uso de otro software. Esta sección proporciona una descripción detallada del diseño del contrato e información sobre cómo construir sobre Rocket Pool para desarrolladores que deseen extenderlo. Todos los ejemplos de código se dan en Solidity `v0.7.6`.

### Diseño del Contrato

Los contratos de red de Rocket Pool están construidos pensando en la actualización, utilizando una arquitectura de hub-and-spoke. El hub central de la red es el contrato `RocketStorage`, que es responsable de almacenar el estado de todo el protocolo. Esto se implementa mediante el uso de mapas para almacenamiento clave-valor, y métodos getter y setter para leer y escribir valores para una clave.

El contrato `RocketStorage` también almacena las direcciones de todos los demás contratos de red (indexados por nombre), y restringe la modificación de datos solo a esos contratos. Usando esta arquitectura, el protocolo puede actualizarse desplegando nuevas versiones de un contrato existente y actualizando su dirección en el almacenamiento. Esto le da a Rocket Pool la flexibilidad necesaria para corregir errores o implementar nuevas características para mejorar el protocolo.

### Interacting With Rocket Pool

Para comenzar a interactuar con la red de Rocket Pool, primero crea una instancia del contrato `RocketStorage` usando su [interface](https://github.com/rocket-pool/rocketpool/blob/master/contracts/interface/RocketStorageInterface.sol):

```solidity
import "RocketStorageInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(0);

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

}
```

El constructor anterior debe llamarse con la dirección del contrato `RocketStorage` en la red apropiada.

Debido a la arquitectura de Rocket Pool, las direcciones de otros contratos no deben usarse directamente sino recuperarse de la blockchain antes de su uso. Pueden haber ocurrido actualizaciones de red desde la interacción anterior, resultando en direcciones obsoletas. `RocketStorage` nunca puede cambiar de dirección, por lo que es seguro almacenar una referencia a él.

Se pueden crear otras instancias de contrato usando la interfaz apropiada tomada del [repositorio de Rocket Pool](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface), por ejemplo:

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

Los contratos de Rocket Pool, como se definen en `RocketStorage`, son:

- `rocketVault` - Almacena ETH retenido por contratos de red (interno, no actualizable)
- `rocketAuctionManager` - Maneja la subasta de RPL confiscado de la participación de operadores de nodo
- `rocketDepositPool` - Acepta ETH depositado por usuarios y maneja la asignación a minipools
- `rocketSmoothingPool` - Recibe tarifas de prioridad y MEV
- `rocketMinipoolBase` - Contiene la lógica de inicialización y actualización de delegado para minipools
- `rocketMinipoolBondReducer` - Maneja la ventana de reducción de bonos y cancelación de nodo confiable
- `rocketMinipoolFactory` - Maneja la creación de contratos de minipool
- `rocketMinipoolDelegate` - Contrato de utilidad de minipool (interno)
- `rocketMinipoolManager` - Crea y administra todos los minipools en la red
- `rocketMinipoolQueue` - Organiza minipools en una cola para asignación de ETH
- `rocketMinipoolStatus` - Maneja actualizaciones de estado de minipool desde nodos watchtower
- `rocketMinipoolPenalty` - Almacena penalizaciones aplicadas a operadores de nodo por el oDAO
- `rocketNetworkBalances` - Maneja actualizaciones de balance de red desde nodos watchtower
- `rocketNetworkFees` - Calcula tasas de comisión de nodo basadas en la demanda de nodos de red
- `rocketNetworkPrices` - Maneja actualizaciones de precio de RPL y participación efectiva desde nodos watchtower
- `rocketNetworkWithdrawal` - Maneja el procesamiento de retiros de validadores de beacon chain
- `rocketNetworkPenalties` - Maneja penalizaciones de minipool
- `rocketRewardsPool` - Maneja la distribución de recompensas a cada contrato de recompensas
- `rocketClaimDAO` - Maneja la reclamación de recompensas para el pDAO
- `rocketNodeDeposit` - Maneja depósitos de nodo para creación de minipool
- `rocketMerkleDistributorMainnet` - Maneja distribución de recompensas de RPL y ETH
- `rocketNodeDistributorDelegate` - Contiene la lógica para RocketNodeDistributors
- `rocketNodeDistributorFactory` - Maneja creación de contratos RocketNodeDistributor
- `rocketNodeManager` - Registra y administra todos los nodos en la red
- `rocketNodeStaking` - Maneja staking y unstaking de nodo
- `rocketDAOProposal` - Contiene funcionalidad común de oDAO y pDAO
- `rocketDAONodeTrusted` - Maneja propuestas relacionadas con oDAO
- `rocketDAONodeTrustedProposals` - Contiene funcionalidad de propuesta de oDAO (interno)
- `rocketDAONodeTrustedActions` - Contiene funcionalidad de acción de oDAO (interno)
- `rocketDAONodeTrustedUpgrade` - Maneja funcionalidad de actualización de contrato de oDAO (interno)
- `rocketDAONodeTrustedSettingsMembers` - Maneja configuraciones relacionadas con miembros de confianza
- `rocketDAONodeTrustedSettingsProposals` - Maneja configuraciones relacionadas con propuestas
- `rocketDAONodeTrustedSettingsMinipool` - Maneja configuraciones relacionadas con minipools
- `rocketDAONodeTrustedSettingsRewards` - Maneja configuraciones relacionadas con recompensas
- `rocketDAOProtocol` - Maneja propuestas relacionadas con pDAO
- `rocketDAOProtocolProposals` - Maneja funcionalidad de propuesta de pDAO (interno)
- `rocketDAOProtocolActions` - Maneja funcionalidad de acción de pDAO (interno)
- `rocketDAOProtocolSettingsInflation` - Maneja configuraciones relacionadas con inflación
- `rocketDAOProtocolSettingsRewards` - Maneja configuraciones relacionadas con recompensas
- `rocketDAOProtocolSettingsAuction` - Maneja configuraciones relacionadas con sistema de subasta
- `rocketDAOProtocolSettingsNode` - Maneja configuraciones relacionadas con operadores de nodo
- `rocketDAOProtocolSettingsNetwork` - Maneja configuraciones relacionadas con la red
- `rocketDAOProtocolSettingsDeposit` - Maneja configuraciones relacionadas con depósitos
- `rocketDAOProtocolSettingsMinipool` - Maneja configuraciones relacionadas con minipools
- `rocketTokenRETH` - El contrato del token rETH (no actualizable)
- `rocketTokenRPL` - El contrato del token RPL (no actualizable)
- `rocketUpgradeOneDotOne` - Manejó la actualización Redstone del protocolo Rocket Pool.
- `rocketUpgradeOneDotTwo` - Manejó la actualización Atlas del protocolo Rocket Pool
- `addressQueueStorage` - Un contrato de utilidad (interno)
- `addressSetStorage` - Un contrato de utilidad (interno)

Los contratos de Rocket Pool legacy, que han sido eliminados de `RocketStorage` desde el despliegue inicial, son:

- `rocketClaimNode` - Manejó la reclamación de recompensas para operadores de nodo
- `rocketClaimTrustedNode` - Manejó la reclamación de recompensas para el oDAO

Los contratos marcados como "interno" no proporcionan métodos que sean accesibles al público en general, y por lo tanto generalmente no son útiles para extensión. Para información sobre métodos de contrato específicos, consulta sus interfaces en el [repositorio de Rocket Pool](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface).

## Deposits

La razón principal para extender la red de Rocket Pool es implementar lógica de depósito personalizada que canaliza los depósitos de usuarios al deposit pool. Por ejemplo, un administrador de fondos puede desear hacer staking del ETH de sus usuarios en Rocket Pool a través de sus propios smart contracts, y abstraer el uso de Rocket Pool en sí de sus usuarios.

Nota: la dirección del contrato `RocketDepositPool` no debe codificarse de forma fija en tus contratos, sino recuperarse dinámicamente desde `RocketStorage`. Ver [Interacting With Rocket Pool](#interacting-with-rocket-pool) para más detalles.

### Implementation

Lo siguiente describe un contrato de ejemplo básico que reenvía ETH depositado a Rocket Pool y rETH acuñado de vuelta al llamador:

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
