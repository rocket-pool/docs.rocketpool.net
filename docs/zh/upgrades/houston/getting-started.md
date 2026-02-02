# Houston 快速入门

无论您是经验丰富的节点运营者、rETH 持有者还是好奇的旁观者,本页面都将帮助您开始探索 Houston 中包含的新功能。

##

### 初始化投票权

首先,如果您是**节点运营者**,最重要的步骤是[初始化投票](../houston/participate#initializing-voting)以解锁您的投票权。已初始化投票的节点将被计入网络总投票权的计算中。

在 Houston 创世时,pDAO 投票被禁用,直到足够数量的节点初始化了投票。这是为了防止在总投票权和法定人数较低时恶意提案通过。在足够多的节点初始化投票后,开关将被打开,pDAO 将掌舵。

要初始化投票权,请在 smartnode 中使用以下命令:

```shell
rocketpool pdao initialize-voting
```

您只需执行一次此操作。初始化投票将确保您节点的投票权被包含在未来的链上提案中,并允许您对其进行投票。

### 设置您的 Snapshot 信号地址

其次,您需要设置 Snapshot 信号地址。这允许节点运营者在浏览器或移动设备中参与 Snapshot 投票,而无需将其节点密钥暴露给热钱包。

设置此功能涉及几个步骤,因此您需要遵循本指南:
[设置您的 Snapshot 信号地址](../houston/participate#setting-your-snapshot-signalling-address)。

### 委托链上投票权

如果您想将链上投票权委托给您选择的社区成员,请点击[此处](../houston/participate#delegating-voting-power)了解如何操作。

##

# 指南

[完整 Houston 概览](../houston/whats-new)展示了完全链上的协议 DAO,并介绍了代表节点质押 ETH、设置 RPL 提款地址以及基于时间的余额和 RPL 提交等新功能。Houston 智能合约审计也可以在这里找到。

[协议 DAO](../houston/pdao)讨论了谁以及如何管理 Rocket Pool 的 pDAO。本页将介绍如何在链上执行财库支出等 pDAO 职责,以及全新安全委员会的角色。它还将引导您了解 pDAO 提案的生命周期,并解释一些防止垃圾提案和击落恶意提案的措施。

[参与提案](../houston/participate)包含详细的分步指南,介绍节点运营者如何参与 pDAO 提案。如果您热衷于提出链上提案、投票或委托投票权,这就是您需要的指南。

[代表节点质押 ETH](../houston/stake-eth-on-behalf.mdx)介绍了代表节点质押 ETH 的步骤。这是 Houston 中引入的新功能,旨在促进单一存款人场景。如果您想在主网上质押真实 ETH 之前先在测试网上试用,我们将演示如何操作。

[RPL 提款地址](../houston/rpl-withdrawal-address)向您展示如何为您的节点设置 RPL 提款地址。如果您想让单独的实体为节点提供 RPL 保险抵押品,这将非常有用。
