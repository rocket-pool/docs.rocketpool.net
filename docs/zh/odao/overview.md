# Rocket Pool Oracle DAO

::: warning 注意
此文档仅适用于 Rocket Pool Oracle DAO 的成员。
如果您没有明确受邀加入 Oracle DAO，只是打算运行普通的 Rocket Pool 节点，本指南的这一部分不适用于您。
您可以放心地跳过这部分，但如果您感兴趣，也欢迎阅读。
:::

**Oracle DAO** 是一组特殊的 Rocket Pool 节点，负责执行由于技术限制而无法通过智能合约实现的协议管理职责。
它们本质上与普通的 Rocket Pool 节点相同；使用相同的工具，可以通过相同的方法进行配置，甚至可以运行普通的 minipool，但它们还执行额外的任务。
包括以下内容：

- 在信标链和执行层之间传递信息，包括 validator 状态和余额
- 确保 minipool 使用的 validator 公钥未被使用，并且[具有正确的提款凭证](https://github.com/rocket-pool/rocketpool-research/blob/master/Reports/withdrawal-creds-exploit)，以便协议可以安全地为其提供资金
- 在每个奖励期结束时构建奖励 Merkle 树并将其上传到 IPFS，供其他 Node Operator 访问
- 监控提案是否符合 Rocket Pool 的[费用接收方要求](../node-staking/mev.mdx)
- 提议和投票修改核心协议，包括更改参数和批准合约升级
- 提议和投票 Oracle DAO 名单，包括邀请和移除其他 Oracle DAO 成员

作为履行这些职责的奖励，Oracle DAO 在每个奖励期获得总 RPL 通胀的[一小部分](https://rpips.rocketpool.net/RPIPs/RPIP-25)，由其成员平均分配。

与任何人都可以无需许可创建和运行的普通 Rocket Pool 节点不同，Oracle DAO 的成员资格**仅限受邀**，需要现有成员邀请。
如果您最近被邀请加入 Oracle DAO，本指南的这一部分将帮助您了解您的角色、设置节点并确保其保持健康。

## 要求

要运行 Oracle DAO 节点，您需要以下内容：

- 访问 **Execution Client 的 RPC 端点**。这可以是本地运行的客户端（如大多数 Rocket Pool 节点的情况），也可以链接到您或您的组织独立维护的外部客户端。
- 访问 **归档模式执行客户端**，它可以作为您的主要客户端或补充（备用）客户端。只有在极少数情况下，当职责需要您的节点调用已从执行客户端中修剪的执行层状态时才会使用它。尽管如此，在这些期间拥有访问归档节点的权限是**至关重要的**，以确保您的职责能够成功履行。
  - 我们**强烈**建议您为此使用本地归档节点，因为 [Infura](https://infura.io/pricing) 或 [Alchemy](https://www.alchemy.com/pricing) 等服务在构建奖励树等关键期间的需求跟上方面表现出一些困难。
- 访问 **归档模式信标节点的 REST API 端点**（通过 HTTP）。这可以是本地运行的客户端（如大多数 Rocket Pool 节点的情况），也可以链接到您或您的组织独立维护的外部客户端。
- 标准 Smart Node CLI。
- Smart Node 守护进程已配置并以 `watchtower` 模式运行（这包含在所有用户的标准 Smart Node 捆绑包中，但仅为 Oracle DAO 节点主动执行职责）。
  - 这可以在 Docker 容器中运行（标准设置）或作为简单的 `systemd` 服务（"Native" 模式）运行。
- 足够的 ETH 来支付您职责的 gas 费用（稍后讨论）。

::: warning 注意
如果您确实无法运行本地归档节点并且*必须*依赖第三方服务，请考虑以下内容：

如果您计划使用 **Infura** 作为归档模式备用，您必须至少拥有 **Team** 计划。
免费层和开发者层不够用。

如果您计划使用 **Alchemy**，您必须至少拥有 **Growth** 计划。
免费层不够用。
:::

## 活动

Oracle DAO 职责分为两部分。

1. **自动化职责**：这些是与常规 Rocket Pool 操作相关的职责，例如在共识层和执行层之间传递信息、在链下计算协议的各个方面，并将它们作为更新提交到智能合约。只要您的执行和共识客户端以及 `watchtower` 守护进程都正常运行，这些都由 `watchtower` 守护进程自动执行，无需手动干预。
2. **手动职责**：这些是需要您自己做出决定并与 Oracle DAO 的其他成员进行带外通信才能执行的职责。包括投票合约升级、更改参数以及邀请或将成员踢出 Oracle DAO 等。这些都可以通过标准 Smart Node CLI 完成。

阅读下一节，了解如何设置您的 Oracle DAO 节点。
