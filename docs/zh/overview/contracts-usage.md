# 智能合约

## 简介

Rocket Pool [智能合约](https://www.ethereum.org/learn/#smart-contracts) 构成了 Rocket Pool 协议的基础。它们是网络所有其他元素（智能节点软件栈和所有 Web 或应用程序界面）构建的基础设施层。

通常不需要直接与合约交互，而是通过使用其他软件来实现。本节详细介绍了合约设计，并为希望扩展 Rocket Pool 的开发人员提供了如何在其上构建的信息。所有代码示例均使用 Solidity `v0.7.6`。

### 合约设计

Rocket Pool 网络合约在设计时考虑了可升级性，采用中心辐射式架构。网络的中心枢纽是 `RocketStorage` 合约，负责存储整个协议的状态。这是通过使用键值存储的映射以及读取和写入键值的 getter 和 setter 方法来实现的。

`RocketStorage` 合约还存储所有其他网络合约的地址（按名称键入），并将数据修改限制为仅限这些合约。使用这种架构，可以通过部署现有合约的新版本并更新其在存储中的地址来升级协议。这为 Rocket Pool 提供了修复错误或实现新功能以改进协议所需的灵活性。

### 与 Rocket Pool 交互

要开始与 Rocket Pool 网络交互，首先使用其[接口](https://github.com/rocket-pool/rocketpool/blob/master/contracts/interface/RocketStorageInterface.sol)创建 `RocketStorage` 合约的实例：

```solidity
import "RocketStorageInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(0);

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

}
```

上述构造函数应使用相应网络上 `RocketStorage` 合约的地址进行调用。

由于 Rocket Pool 的架构，其他合约的地址不应直接使用，而应在使用前从区块链检索。自上次交互以来可能已发生网络升级，导致地址过时。`RocketStorage` 永远不会更改地址，因此可以安全地存储对它的引用。

可以使用从 [Rocket Pool 仓库](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface) 获取的适当接口创建其他合约实例，例如：

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

在 `RocketStorage` 中定义的 Rocket Pool 合约包括：

- `rocketVault` - 存储网络合约持有的 ETH（内部，不可升级）
- `rocketAuctionManager` - 处理从节点运营商质押中罚没的 RPL 的拍卖
- `rocketDepositPool` - 接受用户存入的 ETH 并处理分配给 minipool
- `rocketSmoothingPool` - 接收优先费用和 MEV
- `rocketMinipoolBase` - 包含 minipool 的初始化和委托升级逻辑
- `rocketMinipoolBondReducer` - 处理保证金减少窗口和受信任节点取消
- `rocketMinipoolFactory` - 处理 minipool 合约的创建
- `rocketMinipoolDelegate` - Minipool 实用合约（内部）
- `rocketMinipoolManager` - 创建和管理网络中的所有 minipool
- `rocketMinipoolQueue` - 将 minipool 组织到队列中以进行 ETH 分配
- `rocketMinipoolStatus` - 处理来自瞭望塔节点的 minipool 状态更新
- `rocketMinipoolPenalty` - 存储 oDAO 对节点运营商的处罚
- `rocketNetworkBalances` - 处理来自瞭望塔节点的网络余额更新
- `rocketNetworkFees` - 根据网络节点需求计算节点佣金率
- `rocketNetworkPrices` - 处理来自瞭望塔节点的 RPL 价格和有效质押更新
- `rocketNetworkWithdrawal` - 处理信标链验证器提款的处理
- `rocketNetworkPenalties` - 处理 minipool 处罚
- `rocketRewardsPool` - 处理向每个奖励合约分配奖励
- `rocketClaimDAO` - 处理 pDAO 的奖励领取
- `rocketNodeDeposit` - 处理用于创建 minipool 的节点存款
- `rocketMerkleDistributorMainnet` - 处理 RPL 和 ETH 奖励的分配
- `rocketNodeDistributorDelegate` - 包含 RocketNodeDistributor 的逻辑
- `rocketNodeDistributorFactory` - 处理 RocketNodeDistributor 合约的创建
- `rocketNodeManager` - 注册和管理网络中的所有节点
- `rocketNodeStaking` - 处理节点质押和取消质押
- `rocketDAOProposal` - 包含 oDAO 和 pDAO 的通用功能
- `rocketDAONodeTrusted` - 处理与 oDAO 相关的提案
- `rocketDAONodeTrustedProposals` - 包含 oDAO 提案功能（内部）
- `rocketDAONodeTrustedActions` - 包含 oDAO 操作功能（内部）
- `rocketDAONodeTrustedUpgrade` - 处理 oDAO 合约升级功能（内部）
- `rocketDAONodeTrustedSettingsMembers` - 处理与受信任成员相关的设置
- `rocketDAONodeTrustedSettingsProposals` - 处理与提案相关的设置
- `rocketDAONodeTrustedSettingsMinipool` - 处理与 minipool 相关的设置
- `rocketDAONodeTrustedSettingsRewards` - 处理与奖励相关的设置
- `rocketDAOProtocol` - 处理与 pDAO 相关的提案
- `rocketDAOProtocolProposals` - 处理 pDAO 提案功能（内部）
- `rocketDAOProtocolActions` - 处理 pDAO 操作功能（内部）
- `rocketDAOProtocolSettingsInflation` - 处理与通胀相关的设置
- `rocketDAOProtocolSettingsRewards` - 处理与奖励相关的设置
- `rocketDAOProtocolSettingsAuction` - 处理与拍卖系统相关的设置
- `rocketDAOProtocolSettingsNode` - 处理与节点运营商相关的设置
- `rocketDAOProtocolSettingsNetwork` - 处理与网络相关的设置
- `rocketDAOProtocolSettingsDeposit` - 处理与存款相关的设置
- `rocketDAOProtocolSettingsMinipool` - 处理与 minipool 相关的设置
- `rocketTokenRETH` - rETH 代币合约（不可升级）
- `rocketTokenRPL` - RPL 代币合约（不可升级）
- `rocketUpgradeOneDotOne` - 处理 Rocket Pool 协议 Redstone 升级
- `rocketUpgradeOneDotTwo` - 处理 Rocket Pool 协议 Atlas 升级
- `addressQueueStorage` - 实用合约（内部）
- `addressSetStorage` - 实用合约（内部）

自初始部署以来已从 `RocketStorage` 中移除的旧版 Rocket Pool 合约包括：

- `rocketClaimNode` - 处理节点运营商的奖励领取
- `rocketClaimTrustedNode` - 处理 oDAO 的奖励领取

标记为"内部"的合约不提供公众可访问的方法，因此通常对扩展没有用处。有关特定合约方法的信息，请查阅 [Rocket Pool 仓库](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface) 中的接口。

## 存款

扩展 Rocket Pool 网络的主要原因是实现自定义存款逻辑，将用户存款引导到存款池中。例如，基金经理可能希望通过自己的智能合约将其用户的 ETH 质押到 Rocket Pool 中，并将 Rocket Pool 本身的使用从用户那里抽象出来。

注意：`RocketDepositPool` 合约地址不应在您的合约中硬编码，而应从 `RocketStorage` 动态检索。有关更多详细信息，请参阅[与 Rocket Pool 交互](#与-rocket-pool-交互)。

### 实现

以下描述了一个基本示例合约，它将存入的 ETH 转发到 Rocket Pool 并将铸造的 rETH 返回给调用者：

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
