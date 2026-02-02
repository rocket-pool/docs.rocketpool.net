# Smart Contracts

## Введение

[Smart Contracts](https://www.ethereum.org/learn/#smart-contracts) Rocket Pool формируют основу протокола Rocket Pool. Они являются базовым уровнем инфраструктуры, на котором построены все остальные элементы сети, стек программного обеспечения Smart Node и все веб-интерфейсы или интерфейсы приложений.

Прямое взаимодействие с контрактами обычно не требуется и осуществляется через использование другого программного обеспечения. Этот раздел содержит подробное описание дизайна контрактов и информацию о том, как строить поверх Rocket Pool для разработчиков, желающих его расширить. Все примеры кода приведены как Solidity `v0.7.6`.

### Дизайн контрактов

Контракты сети Rocket Pool построены с учетом обновляемости, используя архитектуру hub-and-spoke. Центральным узлом сети является контракт `RocketStorage`, который отвечает за хранение состояния всего протокола. Это реализовано через использование maps для хранения ключ-значение и методов getter и setter для чтения и записи значений для ключа.

Контракт `RocketStorage` также хранит адреса всех других сетевых контрактов (по имени) и ограничивает изменение данных только этими контрактами. Используя эту архитектуру, протокол может быть обновлен путем развертывания новых версий существующего контракта и обновления его адреса в хранилище. Это дает Rocket Pool гибкость, необходимую для исправления ошибок или реализации новых функций для улучшения протокола.

### Взаимодействие с Rocket Pool

Чтобы начать взаимодействие с сетью Rocket Pool, сначала создайте экземпляр контракта `RocketStorage`, используя его [интерфейс](https://github.com/rocket-pool/rocketpool/blob/master/contracts/interface/RocketStorageInterface.sol):

```solidity
import "RocketStorageInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(0);

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

}
```

Приведенный выше конструктор должен быть вызван с адресом контракта `RocketStorage` в соответствующей сети.

Из-за архитектуры Rocket Pool адреса других контрактов не должны использоваться напрямую, а должны быть извлечены из блокчейна перед использованием. Обновления сети могли произойти с момента предыдущего взаимодействия, что привело к устаревшим адресам. `RocketStorage` никогда не может изменить адрес, поэтому безопасно хранить ссылку на него.

Другие экземпляры контрактов могут быть созданы с использованием соответствующего интерфейса, взятого из [репозитория Rocket Pool](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface), например:

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

Контракты Rocket Pool, как определено в `RocketStorage`, это:

- `rocketVault` - Хранит ETH, удерживаемый сетевыми контрактами (внутренний, не обновляемый)
- `rocketAuctionManager` - Управляет аукционом RPL, изъятого из stake операторов нод
- `rocketDepositPool` - Принимает внесенный пользователями ETH и управляет назначением на minipools
- `rocketSmoothingPool` - Получает приоритетные комиссии и MEV
- `rocketMinipoolBase` - Содержит логику инициализации и обновления делегата для minipools
- `rocketMinipoolBondReducer` - Управляет окном сокращения залога и отменой доверенной ноды
- `rocketMinipoolFactory` - Управляет созданием контрактов minipool
- `rocketMinipoolDelegate` - Служебный контракт minipool (внутренний)
- `rocketMinipoolManager` - Создает и управляет всеми minipools в сети
- `rocketMinipoolQueue` - Организует minipools в очередь для назначения ETH
- `rocketMinipoolStatus` - Управляет обновлениями статуса minipool от нод watchtower
- `rocketMinipoolPenalty` - Хранит штрафы, применяемые к операторам нод oDAO
- `rocketNetworkBalances` - Управляет обновлениями баланса сети от нод watchtower
- `rocketNetworkFees` - Рассчитывает ставки комиссии нод на основе спроса на ноды в сети
- `rocketNetworkPrices` - Управляет обновлениями цен RPL и эффективного stake от нод watchtower
- `rocketNetworkWithdrawal` - Управляет обработкой выводов validator beacon chain
- `rocketNetworkPenalties` - Управляет штрафами minipool
- `rocketRewardsPool` - Управляет распределением наград на каждый контракт наград
- `rocketClaimDAO` - Управляет получением наград для pDAO
- `rocketNodeDeposit` - Управляет депозитами нод для создания minipool
- `rocketMerkleDistributorMainnet` - Управляет распределением наград RPL и ETH
- `rocketNodeDistributorDelegate` - Содержит логику для RocketNodeDistributors
- `rocketNodeDistributorFactory` - Управляет созданием контрактов RocketNodeDistributor
- `rocketNodeManager` - Регистрирует и управляет всеми нодами в сети
- `rocketNodeStaking` - Управляет staking и unstaking нод
- `rocketDAOProposal` - Содержит общую функциональность oDAO и pDAO
- `rocketDAONodeTrusted` - Управляет предложениями, связанными с oDAO
- `rocketDAONodeTrustedProposals` - Содержит функциональность предложений oDAO (внутренний)
- `rocketDAONodeTrustedActions` - Содержит функциональность действий oDAO (внутренний)
- `rocketDAONodeTrustedUpgrade` - Управляет функциональностью обновления контракта oDAO (внутренний)
- `rocketDAONodeTrustedSettingsMembers` - Управляет настройками, относящимися к доверенным членам
- `rocketDAONodeTrustedSettingsProposals` - Управляет настройками, относящимися к предложениям
- `rocketDAONodeTrustedSettingsMinipool` - Управляет настройками, относящимися к minipools
- `rocketDAONodeTrustedSettingsRewards` - Управляет настройками, относящимися к наградам
- `rocketDAOProtocol` - Управляет предложениями, связанными с pDAO
- `rocketDAOProtocolProposals` - Управляет функциональностью предложений pDAO (внутренний)
- `rocketDAOProtocolActions` - Управляет функциональностью действий pDAO (внутренний)
- `rocketDAOProtocolSettingsInflation` - Управляет настройками, связанными с инфляцией
- `rocketDAOProtocolSettingsRewards` - Управляет настройками, связанными с наградами
- `rocketDAOProtocolSettingsAuction` - Управляет настройками, связанными с системой аукционов
- `rocketDAOProtocolSettingsNode` - Управляет настройками, связанными с операторами нод
- `rocketDAOProtocolSettingsNetwork` - Управляет настройками, связанными с сетью
- `rocketDAOProtocolSettingsDeposit` - Управляет настройками, связанными с депозитами
- `rocketDAOProtocolSettingsMinipool` - Управляет настройками, связанными с minipools
- `rocketTokenRETH` - Контракт токена rETH (не обновляемый)
- `rocketTokenRPL` - Контракт токена RPL (не обновляемый)
- `rocketUpgradeOneDotOne` - Управлял обновлением протокола Rocket Pool Redstone.
- `rocketUpgradeOneDotTwo` - Управлял обновлением протокола Rocket Pool Atlas
- `addressQueueStorage` - Служебный контракт (внутренний)
- `addressSetStorage` - Служебный контракт (внутренний)

Устаревшие контракты Rocket Pool, которые были удалены из `RocketStorage` с момента первоначального развертывания:

- `rocketClaimNode` - Управлял получением наград для операторов нод
- `rocketClaimTrustedNode` - Управлял получением наград для oDAO

Контракты, помеченные как "внутренние", не предоставляют методы, доступные для широкой публики, и поэтому обычно не полезны для расширения. Для получения информации о конкретных методах контрактов обратитесь к их интерфейсам в [репозитории Rocket Pool](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface).

## Депозиты

Основная причина для расширения сети Rocket Pool - реализация пользовательской логики депозитов, которая направляет пользовательские депозиты в пул депозитов. Например, управляющий фондом может захотеть stake ETH своих пользователей в Rocket Pool через свои собственные смарт-контракты и абстрагировать использование Rocket Pool от своих пользователей.

Примечание: адрес контракта `RocketDepositPool` не должен быть жестко закодирован в ваших контрактах, а должен быть извлечен из `RocketStorage` динамически. См. [Взаимодействие с Rocket Pool](#взаимодействие-с-rocket-pool) для более подробной информации.

### Реализация

Ниже описан базовый пример контракта, который перенаправляет внесенный ETH в Rocket Pool и отправляет отчеканенный rETH обратно вызывающему:

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
