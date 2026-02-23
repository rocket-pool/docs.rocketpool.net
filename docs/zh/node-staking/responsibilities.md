# Node Operator 的职责

## Ethereum Staking 的运作方式

提醒一下,Proof of Stake 中的 staking 是通过 **validators** 完成的。
validator 本质上是一个单一的 Beacon Chain 地址,在执行层上存入了 32 ETH。
Validators 负责维护 Beacon Chain 的一致性和安全性。
他们通过监听交易和新区块提案并**证明**所提议的区块包含合法有效的交易来实现这一点,方法是在幕后进行一些数字运算和验证。
偶尔,他们会自己提出新区块。

Validators 被分配证明和区块提案**按照随机化的时间表**。
这与旧的 Proof of Work 系统非常不同,在那个系统中,每个人都在不断地试图相互竞争并在其他人之前提出下一个区块。
这意味着,与 Proof of Work 中矿工除非找到下一个区块否则不保证获得区块奖励不同,Proof of Stake validators *保证*只要他们履行职责就能获得稳定的收入。
如果 validator 离线并错过证明或区块提案,它将**受到轻微惩罚**。
不过惩罚非常小;根据经验法则,如果 validator 离线 X 小时,它将在重新上线并证明 X 小时后收回所有损失的 ETH。

### 奖励

Validators 从证明、区块提案、同步委员会(罕见)和罚没奖励(极其罕见)中获得共识层奖励。他们还从优先费用和 MEV 中获得执行层奖励。

截至 2024 年 10 月,总体 APR 约为 3.5%,其中 2.8% 为共识层 APR,0.7% 为执行层 APR。可以在 [rated explorer](https://explorer.rated.network/network?network=mainnet&timeWindow=30d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake) 找到此信息的一个来源。

### 惩罚

如果 validators 离线并未能履行其分配的职责,他们将被扣除少量 ETH。
这称为 **leaking**。
如果 validator 违反了 Beacon chain 的核心规则之一并且似乎在攻击网络,它可能会被 **slashed**。
Slashing 是在未经您许可的情况下强制退出您的 validator,并伴随着相对较大的罚款,会移除您 validator 的一些 ETH 余额。

实际上,唯一可能导致 slashing 的情况是,如果您同时在两个节点上运行 validator 的密钥(例如故障转移/冗余设置,其中您的备份节点在主节点仍在运行时意外启动)。
不要让这种情况发生,**您就不会被 slashed**。
Slashing *不会*因维护而离线而发生。

下面是一个表格,显示了可能发生在 validator 上的惩罚:

| 类型           | 层次 | 数量                                                                 |
| -------------- | ---- | -------------------------------------------------------------------- |
| 错过证明       | 共识 | -0.000011 ETH\* 每次证明(-9/10 正常证明奖励的价值)                   |
| 错过提案       | 共识 | 0                                                                    |
| 错过同步委员会 | 共识 | -0.00047 ETH\* 每个 epoch(如果整个同步委员会期间离线则总计 -0.1 ETH) |
| Slashing       | 共识 | 至少是您余额的 1/32,在极端情况下最多可达您的全部余额                 |

\*_根据网络中 validators 的总数而变化。
近似值为 435,000 个活跃 validators。_

::: tip 提示
根据经验法则,如果您离线 X 小时(并且您不在同步委员会中),那么一旦您重新上线并证明 X 小时后,您将收回所有泄漏的 ETH。
:::

## Rocket Pool Nodes 的运作方式

与需要存入 32 ETH 来创建新 validator 的单独 stakers 不同,Rocket Pool nodes 每个 validator 只需要存入 8 ETH(称为"bond ETH")。
这将与来自 staking 池的 24 ETH(称为"borrowed ETH",来自流动性 staker 存款以换取 rETH)结合,创建一个新的 validator。
这个新的 validator 属于一个 **minipool**。

对于 Beacon chain,minipool 看起来与普通 validator 完全相同。
它具有相同的职责、必须遵循相同的规则、相同的奖励等等。
唯一的区别在于 minipool 在执行层上的创建方式,以及当 node operator 决定自愿退出 minipool 时提款的工作方式。
所有的创建、提款和奖励委托都由 Ethereum 链上的 Rocket Pool 的**智能合约**处理。
这使其完全去中心化。

Rocket Pool **Node** 是一台带有 Ethereum 钱包的单一计算机,已在 Rocket Pool 的智能合约中注册。
然后,节点可以创建尽可能多的 minipools,所有这些 minipools 都在同一台机器上愉快地运行。
**单个 Rocket Pool node 可以运行许多许多 minipools。**
每个 minipool 对整体系统性能的影响微乎其微;有些人已经能够在单个节点上运行数百个 minipools。

minipool 的前期成本是 8 ETH。此外,node operator 可以向其节点 stake RPL,以获得额外奖励的资格并在协议 DAO 中获得投票权。

## Rocket Pool Node Operators

**Node operators** 是 Rocket Pool 的核心和灵魂。
他们是运行 Rocket Pool nodes 的个人。

### 职责

他们通过运行 minipools 来利用 staking 池中的 ETH,这为 Rocket Pool 协议赚取 staking 奖励(因此,增加 rETH 的价值)。
他们的工作很简单,但至关重要:_以尽可能高的质量运行 validators,并最大化 staking 奖励_。

Node operators 负责:

- 设置计算机(物理或虚拟)
- 正确配置它,包括在适用的情况下配置他们的家庭网络
- 在其上安装 Rocket Pool 并设置 minipools 以执行验证
- 保护它免受外部和内部威胁
- 在其 validators 的整个生命周期中维护它

这是一项重大责任,不是简单的一劳永逸的工作;您需要在 staking 期间照顾您的节点。
然而,伴随着重大责任而来的是丰厚的回报。

### 奖励

以下是运行 Rocket Pool node 的主要好处:

- 您赚取每个 validator 的 ETH 奖励的一部分,外加佣金。
  - 对于没有 stake RPL 的 8 ETH-bonded minipools,这比单独 staking 多 30%(`(8+24*.1)/8 = 1.3`)
  - Staking RPL 提供提升的佣金。如果 RPL stake 价值达到或超过您借用的 ETH 总额的 10%,ETH 奖励比单独 staking 多 42%(`(8+24*.14)/8 = 1.42`)
  - **注意:**如果您不参与 smoothing pool,您将获得比单独 staking 多 15%(`(8+24*.05)/8 = 1.15`)——强烈建议在 2024-10-28 或之后创建 minipools 的用户选择加入 smoothing pool。
- 您还可以从您 stake 的 RPL 中获得发行奖励。
  - 在一个周期结束时(每 28 天),会对您的 RPL 进行快照。
  - 您可以在 RPL 上获得最高收益**最多达到**您借用的 ETH 总价值的 15%。
    - 您将从超出该部分的 RPL 中获得收益,但收益水平会递减。
  - 您将根据您 stake 的 RPL 的平方根获得投票权。

### 限制

伴随上述奖励而来的还有一些限制:

- 如果您的节点表现不佳,并且在您决定退出 minipool 时实际上失去了 ETH,所有损失的 ETH 都将从您的份额中扣除。
  - 例如:如果您以 30 ETH 的余额退出,那么您的 minipool 从其初始 32 ETH 存款中损失了 2 ETH。您将收到 6 ETH,24 ETH 将退还给 staking 池。
- 您 stake 的 RPL 将流动性较低
  - 您只能提取超过您 bonded ETH 价值 60% 的 RPL stake。
  - 如果您在过去 28 天内 stake 过,则无法提取 RPL

### 您能做到

如果您对使用命令行或计算机维护相当陌生,这可能看起来是一个可怕的挑战。
幸运的是,Rocket Pool 最核心的原则之一是*去中心化*——任何人,在任何地方,只要有决心和知识,都可以运行节点。
虽然我们无法帮助决心,但我们*可以*帮助知识。
本节充满了指南、演练和信息,将帮助您了解如何运行一个出色的 Rocket Pool node。
