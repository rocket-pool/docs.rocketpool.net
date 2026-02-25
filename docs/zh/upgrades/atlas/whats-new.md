# Atlas 更新

::: tip 注意
Atlas 于 `2023 年 4 月 18 日 00:00 UTC` 部署。请访问[这里](../houston/whats-new)阅读有关 Houston（最新协议升级）的信息。
:::

本页面描述了 Rocket Pool 的下一个主要更新（名为 **Atlas**）给协议带来的主要变化，包括对 Smartnode 堆栈和 Rocket Pool 协议本身的更新。

请仔细阅读此页面，以了解 Rocket Pool 先前版本（Redstone）和 Atlas 之间的所有差异。

## 新协议功能

Atlas 带来了一些令人兴奋的新功能，这些功能基于社区反馈和 Ethereum 协议本身的变化。
以下是这些变化的简要列表 - 单击其中任何一项以了解更多信息。

### Shapella 和提款

Ethereum 协议正准备进行下一次重大升级：执行层上的 **Shanghai** 和共识层上的 **Capella** - 由于这些现在是相互关联的，两者将同时发生。
Ethereum 用户亲切地将这次合并升级称为 [**"Shapella"**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement)。

Shapella 为信标链引入了**提款**，这意味着节点运营商现在能够访问当前锁定在信标链上的 ETH。
这有两种形式：

- 部分提款（**skimming**），您的奖励（您的信标链余额超过 32 ETH 的部分）被发送到执行层上的您的 minipool。这由协议本身每隔一段时间（在主网上大约每四到五天）_自动完成_。
- **完全提款**，您从信标链退出验证者，其整个余额被发送到执行层上的您的 minipool。这由协议本身在您的验证者从链中退出足够长时间后*自动完成*。

Atlas 为 minipool 引入了一个新的委托合约，允许节点运营商随时**分配** minipool 的 ETH 余额，在节点运营商和 rETH 持有者之间平均分配（当然还有佣金）。
这使节点运营商**立即访问**他们的信标链奖励！
它还将 rETH 持有者的份额放回存款池，因此可以用于以协议的汇率将 rETH 取消质押为 ETH（或创建新的 minipool）。

### 8-ETH 保证金 Minipool

Atlas 中最受期待的变化之一是引入了只需提供 8 ETH 即可创建 minipool 的能力，而不是 16 ETH。
节点运营商只保证了 8 ETH 的 Minipool 与来自质押池（由 rETH 持有者提供）的 **24 ETH** 匹配以创建验证者。
这大大降低了运行您自己的验证者的资本要求，*并且*为节点运营商和 rETH 质押者带来了更大的回报！
事实上，运行两个 8-ETH minipool 而不是一个 16-ETH minipool 将提供**超过 18% 的奖励** - 即使 16-ETH minipool 的佣金率为 20%。

创建 8 ETH minipool 要求您质押**至少 2.4 ETH 价值的 RPL** 和**最多 12 ETH 价值的 RPL**。
这些代表您从协议中*借入*的金额的 10%，以及您自己*保证*（质押）的金额的 150%。

可以使用 8 ETH 或 16 ETH 创建新的 minipool。
16 ETH minipool 与今天的工作方式没有变化，可供希望最小化对 RPL 代币敞口的用户使用。

要了解如何使用 8 ETH 保证金创建新的 minipool，请访问 [minipool 创建指南](../../node-staking/create-validator.mdx)。

此外，一旦应用了 Atlas，节点运营商可以**直接将现有的 16-ETH minipool 迁移到 8-ETH minipool，无需退出**。
这将给他们 8 ETH 的[存款信用](../../node-staking/credit)，可以用于**免费创建新的 8-ETH minipool**！

要了解有关 8-ETH 保证金 minipool 的更多信息，请访问[保证金减少指南](../../node-staking/leb-migration.mdx)。

### Solo 验证者转换

Shapella 升级的一部分涉及 solo 验证者能够[更改其验证者的提款凭证](https://notes.ethereum.org/@launchpad/withdrawals-faq)，从原始（现在未使用的）基于 BLS 的提款密钥更改为执行层上的地址。
该地址将是该验证者的所有奖励及其从信标链退出后的完整 ETH 余额的接收者。

常规 Rocket Pool 节点运营商不需要担心这些，因为协议在您创建 minipool 时会自动为您设置。
_然而_，作为对 solo 验证者的这一新要求的一部分，Atlas 带来了一个令人兴奋的机会：能够**创建一个特殊的 minipool**，它将成为您**现有 solo 验证者**的提款地址。

换句话说，这将允许您**直接将 solo 验证者转换为 Rocket Pool minipool，无需退出！**

这意味着您将获得 Rocket Pool minipool 的所有好处，包括：

- 能够将您的一个验证者（具有 32 ETH 保证金）转换为**四个 minipool**（每个具有 8 ETH 保证金），有效地**四倍**您在信标链上的存在
- 对 rETH 质押者提供的那些 minipool 部分的佣金
- 访问 Rocket Pool 的 [Smoothing Pool](../../node-staking/fee-distrib-sp#the-smoothing-pool) 以汇集和均匀分配来自区块提议和 MEV 的奖励

要了解有关将 solo 验证者转换为 minipool 的更多信息，请访问[将 Solo 验证者转换为 Minipool](../../node-staking/solo-staker-migration) 指南。

## 新 Smartnode 功能

除了对 Rocket Pool 协议的核心更改外，Atlas 还为 Smartnode 堆栈本身带来了一些令人兴奋的升级，这些升级存在于 v1.9.0 中。

### 自动奖励分配

如果您已经是活跃的 Rocket Pool 节点运营商，您可能熟悉处理某些自动化流程的 `rocketpool_node` 进程。
例如，它确保您拥有正确的费用接收者，并在 `prelaunch` minipool 通过 12 小时审查检查后自动为您运行第二个 `stake` 交易。

从 Atlas 开始，`node` 有一项新职责：**自动分配 minipool 奖励！**
这是由于 [Shapella 升级的工作方式](../../node-staking/skimming)，每隔几天从信标链中撇取您的奖励到您的 minipool。

每当您的一个 minipool 的余额超过用户指定的阈值（默认为 1 ETH）时，节点将自动对其运行 `distribute-balance`。
这将把您的奖励部分发送到您的提款地址，并将池质押者的部分发送回存款池。

可以在 `service config` TUI 的 `Smartnode and TX Fees` 部分的 `Auto-Distribute Threshold` 设置下更改阈值。

### 统一的 Grafana 仪表板

根据大众需求，我们创建了一个新的 [**Grafana 仪表板**](https://grafana.com/grafana/dashboards/24900-rocket-pool-dashboard-v1-4-0/) 来帮助节点运营商跟踪和评估其节点的状态、进度和整体健康状况：

![](../../node-staking/images/grafana-1.3.jpg)

它具有以下强烈要求的功能：

- 在单个仪表板中支持所有执行和共识客户端 - 不再需要根据您使用的客户端更改仪表板！
- 执行客户端统计信息，包括 CPU 和 RAM 使用情况以及对等计数
- 证明准确性跟踪，跟踪您在前一个 epoch 的证明"正确性"，以便您知道与最佳奖励相差多远
- 跟踪 Smoothing Pool 的余额
- 跟踪已索取和未索取的奖励，现在包括来自 Smoothing Pool 的 ETH
- 有关 Rocket Pool 基于 Snapshot 的治理投票的统计信息
- 如果您有一个用于操作系统的 SSD 和一个不同的用于链数据的 SSD，则可以跟踪第二个 SSD 的已用空间和温度
- 还有更多！

您可以按照我们的 [Grafana 指南](../../node-staking/grafana.mdx)使用 ID `21863` 从官方 Grafana 服务导入新仪表板。

这个新仪表板是一项爱的劳动，涉及社区成员 **0xFornax** 的广泛帮助 - 感谢您的所有辛勤工作！

### Nimbus 更改

Smartnode v1.9.0 引入了 Nimbus 的**拆分模式支持**！
Smartnode 现在将在单独的容器中运行它们，而不是在单个进程/容器中运行信标节点和验证客户端，就像其他客户端一样。这具有以下好处：

- Nimbus 现在支持**备用客户端**（当您的主客户端因维护而停机时，Nimbus 的验证客户端可以连接的辅助执行客户端和信标节点，例如重新同步）。
- Nimbus 现在在**外部管理（混合）模式**中受支持，因此您可以将 Smartnode 管理的验证客户端与您自己维护的外部信标节点配对。
- 信标节点不再需要在添加新 minipool 后重启，这意味着您在它重新连接到其对等点时不会失去证明。

### Lodestar 支持

[Lodestar](https://chainsafe.github.io/lodestar/) 现在被支持作为您选择的共识客户端的选项！
这是最新被正式接受到 [Ethereum 的 Launchpad](https://launchpad.ethereum.org/en/lodestar) 的新增内容，它已准备好进行验证。
Lodestar 支持您从其他客户端喜欢的许多出色功能，包括 Doppelganger 检测、MEV-Boost、外部管理的客户端（混合模式）等等！

### 新网络快照系统

在更技术性的注释上，v1.9.0 引入了一个全新的系统，用于快速捕获执行和共识层上**关于您节点的所有内容**的状态快照。
在幕后，该系统利用 [MakerDAO 的 multicall 合约](https://github.com/makerdao/multicall) 和 Will O'Beirne 的 [Ethereum Balance Checker 合约](https://github.com/wbobeirne/eth-balance-checker) 将数千个单独的执行客户端查询批处理到单个请求中。

这使得 `node` 进程对于拥有大量验证者的节点运营商来说对执行客户端的负担要小得多，并且应该显着降低其 CPU 负载，这将改善证明和整体奖励。

这个新系统还没有进入 CLI 本身，因此您在那里运行的任何命令（例如 `rocketpool minipool status`）仍将使用旧的单查询设置。
随着时间的推移，我们也会将其引入 CLI，这将使其所有命令都非常快速（_除了等待交易被验证，那仍然需要一段时间_）。
