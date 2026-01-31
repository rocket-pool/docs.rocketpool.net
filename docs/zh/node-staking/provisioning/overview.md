---
next:
  text: 启动 Rocketpool
  link: "/zh/node-staking/starting-rp"
---

# 概述

本节介绍如何在安装和配置 Smartnode 后为使用 Rocket Pool 质押配置节点的详细信息。
这是一个很长的部分,因为有很多关于质押的信息需要涵盖,所以**请在创建第一个 minipool 之前阅读每个指南!**

## 前提条件

在为质押配置节点之前,请确保你已完成以下操作:

- 设置了节点机器(或虚拟机)并对其进行了保护(通过[保护你的节点](../securing-your-node)指南)
- 在其上[安装](../installing/overview)并[配置](../config/overview)了 Smartnode

## 指南

[启动 Rocket Pool](../starting-rp) 将向你展示如何为每种模式启动 Smartnode 服务,以及如何检查执行客户端和共识客户端的同步进度。

[创建新钱包](../wallet-init)介绍了如果这是你第一次设置节点,如何使用 Smartnode 创建全新钱包的过程。

[导入/恢复现有钱包](../recovering-rp.mdx)是创建新钱包的替代方案。
如果你已经有一个想要恢复到节点的节点钱包(或者如果你正在从 Allnodes 等服务迁移到自己的硬件),请使用本指南。

[为操作准备节点](../prepare-node.mdx)介绍了在将钱包加载到节点后你将要采取的一些重要的第一步,远在你为其提供任何 ETH 或 RPL 之前(当然,除了少量用于 gas 成本的 ETH)。

[指定备用节点](../fallback)引导你完成将节点指向第二个(外部管理的)执行客户端和共识客户端对的可选过程,如果主客户端出现故障,它可以充当备份,以便在你对它们执行维护时节点可以继续验证。

[费用分配器和平滑池](../fee-distrib-sp)讨论了每次你的一个 validator 提议区块时如何将执行层奖励提供给你的节点,如何收集这些奖励,并描述了 Rocket Pool 的**平滑池** - 一个流行的功能,它结合了来自每个人的执行层奖励,并在 Rocket Pool 的定期奖励间隔期间均匀分配它们。

[MEV、MEV-Boost 和 MEV 奖励](../mev.mdx)解释了**最大可提取价值**(MEV)、它在质押生态系统中的作用,以及如何使用 Smartnode 根据你的喜好配置它。
