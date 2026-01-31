---
next:
  text: 创建新的 Minipool（验证者）
  link: "/zh/node-staking/create-validator"
---

::: danger 警告
Minipool 存款当前已禁用，正在为 Saturn 1 做准备。
:::

# 概述

本节介绍创建和迁移 minipool（Rocket Pool 验证者）的过程。在这里，您将学习如何开始验证以太坊网络并为此赚取奖励。

## 先决条件

在运行 minipool 之前，请确保您：

- 已设置节点机器（或虚拟机）并对其进行了保护（通过[保护您的节点](../securing-your-node)指南）
- 已在其上[安装](../installing/overview)并[配置](../config/overview) Smartnode
- 在 Smartnode 上加载了节点钱包
- 同步了执行和共识客户端
- 为节点配置了[提款地址](../prepare-node.mdx#setting-your-withdrawal-address)，设置了[备用客户端](../fallback)（可选），选择加入[平滑池](../fee-distrib-sp#the-smoothing-pool)（可选），并配置了 [MEV](../mev.mdx)

## 指南

[创建新的 Minipool（验证者）](../create-validator.mdx)解释了创建新 Rocket Pool minipool 和相应信标链验证者的过程。无论您是创建第一个 minipool 还是已经拥有一些并想再创建一个，本指南都会逐步指导您完成。

[Minipool 委托](./delegates)稍微解释了什么是 minipool 合约，并介绍了包含其大部分功能的**委托**合约。它还演示了如何在网络升级后更新 minipool 的委托以利用新功能。

[将独立验证者转换为 Minipool](../solo-staker-migration)介绍了将 Rocket Pool 之外的现有验证者（例如您用于独立质押的验证者）直接转换为 Rocket Pool minipool 的过程，而无需退出信标链并创建新的 minipool。如果您是想利用此功能的独立质押者，这就是适合您的指南！

[将 16-ETH Minipool 迁移到 8-ETH](../leb-migration.mdx)展示了如何将 minipool 的绑定 ETH 数量从 16 ETH 减少到 8 ETH，从而为您提供 8 ETH 的信用额度，可用于免费创建新的 minipool（当然，仍然需要支付 gas 费用）。

[存款信用系统](../credit)介绍了"ETH 信用"系统，该系统允许您在执行上述迁移之一后创建新的 minipool，而无需支付其 ETH 保证金。
