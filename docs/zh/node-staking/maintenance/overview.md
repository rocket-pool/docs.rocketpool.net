---
next:
  text: 监控您的节点性能
  link: "/zh/node-staking/performance"
---

# 概述

在本节中,您将学习如何监控节点和验证者的健康状况、跟踪您的收益以及执行定期维护(例如更新)。

## 先决条件

在配置 Smartnode 之前,请确保您:

- 已设置节点机器(或虚拟机)并保护其安全(通过[保护您的节点](../securing-your-node)指南)
- 在其上[安装](../installing/overview)并[配置](../config/overview)了 Smartnode
- 在 Smartnode 上加载了节点钱包
- 同步了执行客户端和共识客户端
- 为节点提供了[提款地址](../prepare-node.mdx#setting-your-withdrawal-address),设置了[后备客户端](../fallback)(可选),选择加入[平滑池](../fee-distrib-sp#the-smoothing-pool)(可选),并配置了 [MEV](../mev.mdx)
- 创建了至少一个 [minipool](../create-validator.mdx)

## 指南

[监控您的节点性能](../performance)提供了一些工具和教程,用于监控节点的健康状况(从资源角度,例如 CPU 和 RAM 消耗)以及验证者在信标链上的性能。
它涵盖了许多您在担任以太坊验证者期间将使用的基本工具。

[设置 Grafana 仪表板](../grafana.mdx)介绍了如何设置 Smartnode 堆栈的指标跟踪器和 Grafana 仪表板 - 这是一个一站式商店,用于监控节点和验证者的所有内容,是每个节点运营商武器库中的主要工具。
我们*强烈*建议探索 Grafana 仪表板并定期检查它。

[Smartnode 堆栈警报通知](./alerting.md)介绍了如何使用 Smartnode 警报通知功能接收有关 Rocket Pool Smartnode 的健康状况和重要事件的通知。

[检查更新](../updates)涵盖了定期使用新安全补丁更新节点的关键过程、如何在新版本发布后更新 Smartnode,以及如果您选择的客户端发布了 Smartnode 最新版本尚未包含的新版本,如何手动更新客户端版本。
您应该熟悉整个部分,因为在发布更新时可能需要参考它。

[备份您的节点](../backups)是一个可选指南,描述了如何备份节点的配置及其链数据以防硬件故障。

[修剪执行客户端](../pruning)对于运行逐渐消耗所有 SSD 磁盘空间并需要定期修剪(例如 Geth 或 Nethermind)以回收一些空间的执行客户端的任何人来说都是**重要的**。
如果您运行其中一个客户端,您绝对应该熟悉修剪过程。

[更改执行或共识客户端](../change-clients)是一个有用的指南;它介绍了更改客户端选择的过程以及在此过程中可以预期的内容。
这是另一个值得熟悉的好指南,以防您将来出于任何原因需要切换客户端。
