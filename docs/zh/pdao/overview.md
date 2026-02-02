---
next:
  text: The Protocol DAO
  link: "/zh/pdao/pdao"
---

# 概述

本节概述了设置节点以参与链上和 Snapshot 提案的过程。内容非常丰富，因此我们强烈建议您阅读 [Houston 升级](/zh/legacy/houston/whats-new)的概述。这将帮助您了解支持链上治理的最新功能以及如何参与塑造协议。

## 前置条件

在配置 Smartnode 之前，请确保您：

- 已设置节点机器（或虚拟机）并对其进行了安全加固（通过[保护您的节点](/zh/node-staking/securing-your-node)指南）
- 已在其上[安装](/zh/node-staking/installing/overview)并[配置](/zh/node-staking/config/overview) Smartnode
- 已在 Smartnode 上加载节点钱包
- 已同步执行层和共识层客户端
- 已为节点配置[提款地址](/zh/node-staking/prepare-node#setting-your-withdrawal-address)，设置[后备客户端](/zh/node-staking/fallback)（可选），选择加入[平滑池](/zh/node-staking/fee-distrib-sp#the-smoothing-pool)（可选），并配置 [MEV](/zh/node-staking/mev)
- 已创建至少一个 [minipool](/zh/node-staking/create-validator)

## 投票涉及三个地址

- pDAO 信号地址 — 将用作您的 Snapshot 地址，如果您想直接投票或想覆盖委托人的 Snapshot 投票。此地址仅用于 Snapshot，不用于链上投票。

- pDAO 委托节点 — 如果您选择委托投票。您将把它设置为委托人的节点地址。如果您选择委托人，他们将在 Snapshot 和链上提案中为您投票。

- 节点地址 — 如果您尚未委托投票或希望覆盖委托人的链上投票，您可以从节点执行此操作。

## 指南

[The Protocol DAO](/zh/pdao/pdao) 讨论了谁以及 pDAO 如何治理 Rocket Pool。本页将介绍如何在链上执行 pDAO 职责（如国库支出），以及全新安全委员会的角色。它还将引导您了解 pDAO 提案的生命周期，并解释为防止垃圾提案和击落恶意提案而采取的一些措施。

[非 smartnode 用户的投票设置](/zh/legacy/houston/nonsmartnode-setup)向非 smartnode 用户（如 Allnodes 用户）展示如何设置投票。

[初始化投票权](/zh/pdao/participate#initializing-voting)向您展示如何初始化节点的投票权。仅当您的节点在 Houston 升级之前注册时才需要此步骤。

[设置您的 Snapshot 信号地址](/zh/pdao/participate#setting-your-snapshot-signalling-address)将引导您完成设置信号地址的步骤。它将允许您使用节点的投票权在 Snapshot 上投票，而无需将节点的私钥加载到热钱包中。确保您手头有 Smartnode CLI，并为本指南准备一个地址（不是您的节点钱包）。

[委托投票权](/zh/pdao/participate#delegating-voting-power)是一个快速命令，您可以使用它来委托投票权，而不是直接对提案进行投票。

[查看提案的状态](/zh/pdao/participate#viewing-the-state-of-a-proposal)是关于如何查看过去和正在进行的链上提案列表的指南。您将能够检查状态并阅读任何给定链上提案的详细信息。

[对提案进行投票](/zh/pdao/participate#voting-on-a-proposal)向您展示如何对链上提案进行投票。本指南还介绍了四个选项：**弃权**、**赞成**、**反对**和**否决**。

[创建提案](/zh/pdao/participate#creating-a-proposal)引导您完成提出链上提案的要求和步骤。

[执行成功的提案](/zh/pdao/participate#executing-a-successful-proposal)将向您展示如何将成功提案的效果应用于 Rocket Pool 协议。

[领取保证金和奖励](/zh/pdao/participate#claiming-bonds-and-rewards)讨论了提案者或挑战者可以领取保证金或奖励的条件。

[创建和领取定期国库支出](/zh/pdao/participate#creating-a-recurring-treasury-spend)是一项功能，使 pDAO 能够完全控制添加、修改和删除定期付款。
