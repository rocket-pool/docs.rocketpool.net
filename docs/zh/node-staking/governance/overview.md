---
next:
  text: Protocol DAO
  link: "/zh/legacy/houston/pdao#the-protocol-dao-pdao"
---

# 概述

本节概述了设置节点以参与链上和快照提案的过程。内容涉及很多,我们强烈建议您通读[Houston升级](/zh/legacy/houston/whats-new)的概述。这将帮助您了解启用链上治理的最新功能以及如何参与塑造协议。

## 前提条件

在配置您的Smartnode之前,请确保您已:

- 设置好节点机器(或虚拟机)并对其进行了安全保护(通过[保护您的节点](../securing-your-node)指南)
- 在其上[安装](../installing/overview)并[配置](../config/overview)了Smartnode
- 在您的Smartnode上加载了节点钱包
- 同步了您的Execution和Consensus客户端
- 为节点配置了[提款地址](../prepare-node#setting-your-withdrawal-address),设置了[备用客户端](../fallback)(可选),选择加入[Smoothing Pool](../fee-distrib-sp#the-smoothing-pool)(可选),并配置了[MEV](../mev)
- 创建了至少一个[minipool](../create-validator)

## 投票涉及三个地址

- pDAO信号地址 — 如果您想直接投票或想覆盖您的委托人的Snapshot投票,将用作您的Snapshot地址。此地址仅用于Snapshot,不用于链上投票。

- pDAO委托节点 — 如果您选择委托您的投票。您将把此设置为您的委托人的节点地址。如果您选择委托人,他们将在Snapshot和链上提案中为您投票。

- 节点地址 — 如果您没有委托您的投票,或者如果您希望覆盖您的委托人的链上投票,您可以从您的节点执行此操作。

## 指南

[Protocol DAO](/zh/legacy/houston/pdao#the-protocol-dao-pdao)讨论了谁以及pDAO如何治理Rocket Pool。此页面将向您介绍如何在链上执行财库支出等pDAO职责,以及全新安全委员会的角色。它还将引导您了解pDAO提案的生命周期,并解释为防止垃圾邮件和击倒恶意提案而采取的一些措施。

[非smartnode用户的投票设置](/zh/legacy/houston/nonsmartnode-setup)向非smartnode用户(如Allnodes用户)展示如何设置投票。

[初始化投票权](/zh/legacy/houston/participate#initializing-voting)向您展示如何初始化节点的投票权。仅当您的节点在Houston升级之前注册时才需要此步骤。

[设置您的Snapshot信号地址](/zh/legacy/houston/participate#setting-your-snapshot-signalling-address)将引导您完成设置信号地址的步骤。它将允许您使用节点的投票权在Snapshot上投票,而无需将节点的私钥加载到热钱包上。确保您手头有Smartnode CLI,并为本指南准备一个地址(不是您的节点钱包)。

[委托投票权](/zh/legacy/houston/participate#delegating-voting-power)是一个快速命令,您可以使用它来委托投票权,而不是直接对提案进行投票。

[查看提案状态](/zh/legacy/houston/participate#viewing-the-state-of-a-proposal)是关于如何查看过去和正在进行的链上提案列表的指南。您将能够检查状态并阅读任何给定链上提案的详细信息。

[对提案进行投票](/zh/legacy/houston/participate#voting-on-a-proposal)向您展示如何对链上提案投票。本指南还介绍了四个选项:**弃权**、**支持**、**反对**和**否决**。

[创建提案](/zh/legacy/houston/participate#creating-a-proposal)引导您了解提出链上提案的要求和步骤。

[执行成功的提案](/zh/legacy/houston/participate#executing-a-successful-proposal)将向您展示如何将成功提案的效果应用于Rocket Pool协议。

[领取保证金和奖励](/zh/legacy/houston/participate#claiming-bonds-and-rewards)讨论了提案人或挑战者可以领取保证金或奖励的条件。

[创建和领取经常性财库支出](/zh/legacy/houston/participate#creating-a-recurring-treasury-spend)是一项功能,使pDAO完全控制添加、修改和删除经常性支付。
