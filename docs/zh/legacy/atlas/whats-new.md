# Atlas 更新

::: tip 注意
Atlas 于 `2023 年 4 月 18 日 00:00 UTC` 部署。请访问[此处](../houston/whats-new)阅读有关 Houston 的信息，这是最新的协议升级。
:::

本页面描述了 Rocket Pool 下一个主要更新（名为 **Atlas**）为协议带来的主要变化，包括对 Smartnode 堆栈和 Rocket Pool 协议本身的更新。

请仔细阅读本页面，以了解 Rocket Pool 之前版本（Redstone）与 Atlas 之间的所有差异。

## 新的协议功能

Atlas 带来了一些令人兴奋的新功能，这些功能基于社区反馈和以太坊协议本身的变化。
以下是这些变化的简要列表 - 单击其中任何一个以了解更多信息。

### Shapella 和提款

以太坊协议正准备进行下一次重大升级: 执行层的 **Shanghai** 和共识层的 **Capella** - 由于这些现在是相互关联的，两者将同时发生。
以太坊用户亲切地将这次联合升级称为 [**"Shapella"**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement)。

Shapella 为信标链引入了**提款**，这意味着节点运营者现在能够访问当前锁定在信标链上的 ETH。
这有两种形式:

- 部分提款（**撇取**），您的奖励（您的信标链余额超过 32 ETH 的部分）被发送到执行层上的您的 minipool。这由_协议本身自动完成_，每隔一段时间（主网上大约每四到五天一次）。
- **全额提款**，您从信标链退出验证者，其全部余额被发送到执行层上的您的 minipool。这在您的验证者从链上退出足够长时间后由_协议本身自动完成_。

Atlas 为 minipool 引入了一个新的委托合约，允许节点运营者随时**分配** minipool 的 ETH 余额，在节点运营者和 rETH 持有者之间平均分配（当然还有佣金）。
这使节点运营者能够**立即访问**他们的信标链奖励！
它还将 rETH 持有者的份额放回存款池，因此可以用于以协议的汇率解除 rETH 到 ETH 的质押（或创建新的 minipool）。

### 8-ETH 保证金 Minipool

Atlas 中最令人期待的变化之一是引入了只需提供 8 ETH 即可创建 minipool 的能力，而不是 16 ETH。
由其拥有节点运营者提供的保证金仅为 8 ETH 的 Minipool 将与来自质押池的 **24 ETH**（由 rETH 持有者提供）匹配，以创建验证者。
这大大降低了运行自己验证者的资本要求，_并且_为节点运营者和 rETH 质押者带来更高的回报！
事实上，运行两个 8-ETH minipool 而不是一个 16-ETH minipool 将提供**超过 18% 的奖励** - 即使 16-ETH minipool 的佣金率为 20%。

创建 8 ETH minipool 要求您质押**至少 2.4 ETH 价值的 RPL**，**最多 12 ETH 价值的 RPL**。
这些分别代表您从协议_借入_金额的 10%，以及您自己_保证金_（质押）金额的 150%。

新的 minipool 可以使用 8 ETH 或 16 ETH 创建。
16 ETH minipool 与今天的工作方式没有变化，适用于希望最小化对 RPL 代币敞口的用户。

要了解如何使用 8 ETH 保证金创建新的 minipool，请访问 [minipool 创建指南](../../node-staking/create-validator.mdx)。

此外，一旦应用 Atlas，节点运营者可以**直接将现有的 16-ETH minipool 迁移到 8-ETH minipool，无需退出**。
这将为他们返还 8 ETH 的[存款信用](../../node-staking/credit)，可用于**免费创建新的 8-ETH minipool**！

要了解有关 8-ETH 保证金 minipool 的更多信息，请访问[保证金减少指南](../../node-staking/leb-migration.mdx)。

### 独立验证者转换

Shapella 升级的一部分涉及独立验证者[更改其验证者的提款凭证](https://notes.ethereum.org/@launchpad/withdrawals-faq)的能力，从原始的（现在未使用的）基于 BLS 的提款密钥更改为执行层上的地址。
此地址将是该验证者所有奖励的接收者，以及退出信标链后的全部 ETH 余额。

常规 Rocket Pool 节点运营者不必担心任何这些，因为协议在您创建 minipool 时会自动为您设置。
_然而_，作为对独立验证者的这一新要求的一部分，Atlas 带来了一个令人兴奋的机会: 能够**创建一个特殊的 minipool**，它将成为您**现有独立验证者**的提款地址。

换句话说，这将允许您**直接将独立验证者转换为 Rocket Pool minipool，无需退出！**

这意味着您将获得 Rocket Pool minipool 的所有好处，包括:

- 能够将您的一个验证者（32 ETH 保证金）转换为**四个 minipool**（每个 8 ETH 保证金），有效地**四倍**您在信标链上的存在
- 在 rETH 质押者提供的这些 minipool 部分上获得佣金
- 访问 Rocket Pool 的 [Smoothing Pool](../../node-staking/fee-distrib-sp#the-smoothing-pool) 以汇集和均匀分配来自区块提议和 MEV 的奖励

要了解有关将独立验证者转换为 minipool 的更多信息，请访问[将独立验证者转换为 Minipool](../../node-staking/solo-staker-migration) 指南。

## 新的 Smartnode 功能

除了对 Rocket Pool 协议的核心变化外，Atlas 还为 Smartnode 堆栈本身带来了一些令人兴奋的升级，这些升级存在于 v1.9.0 中。

### 自动奖励分配

如果您已经是活跃的 Rocket Pool 节点运营者，您可能熟悉处理某些自动化流程的 `rocketpool_node` 进程。
例如，它确保您拥有正确的费用接收者，并在 `prelaunch` minipool 通过 12 小时审查检查后自动为您运行第二个 `stake` 交易。

从 Atlas 开始，`node` 有一个新职责: **自动分配 minipool 奖励！**
这是由于 [Shapella 升级的工作方式](../../node-staking/skimming)，每隔几天就会从信标链撇取您的奖励到您的 minipool。

每当您的一个 minipool 达到大于用户指定阈值（默认为 1 ETH）的余额时，节点将自动在其上运行 `distribute-balance`。
这将把您那份奖励发送到您的提款地址，并将池质押者的部分放回存款池。

可以在 `service config` TUI 的 `Smartnode and TX Fees` 部分的 `Auto-Distribute Threshold` 设置中更改阈值。

### 统一的 Grafana 仪表板

应大众需求，我们创建了一个新的 [**Grafana 仪表板**](https://grafana.com/grafana/dashboards/21863) 来帮助节点运营者跟踪和评估其节点的状态、进度和整体健康状况:

![](../../node-staking/images/grafana-1.3.jpg)

它具有以下高度要求的功能:

- 在单个仪表板中支持所有执行和共识客户端 - 不再根据您使用的客户端更改仪表板！
- 执行客户端统计信息，包括 CPU 和 RAM 使用情况以及对等计数
- 认证准确性跟踪，遵循您上一个 epoch 的认证"正确性"，因此您知道距离最佳奖励有多远
- 跟踪 Smoothing Pool 的余额
- 跟踪已领取和未领取的奖励，现在包括来自 Smoothing Pool 的 ETH
- 有关 Rocket Pool 基于 Snapshot 的治理投票的统计信息
- 如果您有一个用于操作系统和另一个用于链数据的第二个 SSD，则可以跟踪第二个 SSD 的已用空间和温度
- 更多！

您可以按照我们的 [Grafana 指南](../../node-staking/grafana.mdx)使用 ID `21863` 从官方 Grafana 服务导入新仪表板。

这个新仪表板是一项爱的劳动，涉及社区成员 **0xFornax** 的广泛帮助 - 感谢您所有的辛勤工作！

### Nimbus 变化

Smartnode v1.9.0 引入了对 Nimbus 的**分离模式支持**！
Smartnode 现在将在单独的容器中运行信标节点和验证客户端，而不是在单个进程/容器中运行它们，就像其他客户端一样。这有以下好处:

- Nimbus 现在支持**备用客户端**（当您的主要客户端因维护（如重新同步）而停机时，Nimbus 的验证客户端可以连接到的辅助执行客户端和信标节点）。
- Nimbus 现在在**外部管理（混合）模式**中受支持，因此您可以将 Smartnode 管理的验证客户端耦合到您自己维护的外部信标节点。
- 在添加新 minipool 后，信标节点不再需要重新启动，这意味着您在重新连接到其对等点时不会丢失认证。

### Lodestar 支持

[Lodestar](https://chainsafe.github.io/lodestar/) 现在作为您选择的共识客户端的选项受支持！
这是最新被正式接受到[以太坊启动板](https://launchpad.ethereum.org/en/lodestar)的客户端，它已准备好进行验证。
Lodestar 支持您从其他客户端喜爱的许多出色功能，包括 Doppelganger 检测、MEV-Boost、外部管理的客户端（混合模式）等！

### 新的网络快照系统

在稍微更技术性的说明上，v1.9.0 引入了一个全新的系统，用于快速捕获执行层和共识层上**关于您节点的所有内容**的快照。
在幕后，此系统利用 [MakerDAO 的 multicall 合约](https://github.com/makerdao/multicall)和 Will O'Beirne 的[以太坊余额检查器合约](https://github.com/wbobeirne/eth-balance-checker)将数千个单独的执行客户端查询批处理成单个请求。

这使得 `node` 进程对拥有大量验证者的节点运营者的执行客户端的负担大大减轻，并且应该显著降低其 CPU 负载，这将改善认证和整体奖励。

这个新系统还没有进入 CLI 本身，因此您在那里运行的任何命令（如 `rocketpool minipool status`）仍将使用旧的单查询设置。
随着时间的推移，我们将把它引入 CLI，这将使其所有命令都非常快速（_除了等待交易验证，那仍然需要一段时间_）。
