# 监控你的 Oracle DAO 节点

一旦你的节点启动并运行，定期监控其健康状况以确保它正确执行其自动化职责非常重要。
这涉及以下内容：

- 在操作系统级别监控物理（或虚拟）系统的健康状况
- 监控 Execution 和/或 Consensus 客户端的健康状况（如果你运行本地客户端）
- 确保你的节点定期向链提交所需的交易以进行状态更新
- 确保你的节点钱包中有足够的 ETH 余额来执行这些交易
- 定期对 Smartnode、你的客户端（如果适用）和操作系统应用更新
- 监控其他 Oracle DAO 成员的健康状况，如果你认为他们的节点运行不正常，请与他们沟通

在本节中，我们将通过 Smartnode 内置的 [Grafana](https://grafana.com/) 支持介绍一些如何执行这些操作的示例。

## 标准 Rocket Pool 仪表板

Smartnode 提供了一个方便的仪表板，允许你监控上面列出的许多指标。
每个 Consensus Client 都有一个仪表板。
以下是 Nimbus 仪表板的示例：

![](../node-staking/images/nimbus-dashboard.png)

- 你的机器硬件健康状况在左上象限中捕获。
- 如果左下象限中的网络统计数据正在填充，则你的 Execution 客户端运行正常。
- 如果右上象限中的对等体计数正在更新且为非零数字，则你的 Consensus 客户端运行正常；确切的数字取决于你选择的客户端和网络配置。
- 你的节点 ETH 余额显示在右下角的表格中。
- 任何操作系统更新或 Smartnode 更新都会显示在顶部中间面板的 `Available Updates` 框中。

::: tip 注意
操作系统和 Smartnode 更新需要更新跟踪器，你可以通过 `rocketpool service install-update-tracker` 安装。
:::

有关如何准备指标系统和 Smartnode 仪表板的信息，请访问 Smartnode 文档的[监控节点性能](../node-staking/performance)和[设置 Grafana 仪表板](../node-staking/grafana.mdx)页面。

## Oracle DAO 仪表板

我们还构建了一个专门为 Oracle DAO 成员量身定制的简单仪表板：

![](../odao/images/odao-dashboard.png)

此仪表板跟踪以下内容：

- 需要投票或执行的 Oracle DAO 提案的状态（有关这些的更多详细信息，请参阅下一节）
- 价格和余额更新的提交历史\*
- 每个 Oracle DAO 节点的 ETH 余额

\*_请注意，价格和余额提交目前需要 51% 的节点达成共识，此时提交被规范化。其他成员的提交将被还原，因为它们不再需要，因此如果你的节点在给定间隔内未提交，这并不意味着它处于离线状态。如果你连续错过超过 5 个间隔，你应该担心，并检查你的 `watchtower` 守护进程日志以验证是否存在任何问题。_

启用此仪表板是一个两步过程。

首先，在 `rocketpool service config` 编辑器的 `Metrics` 部分启用 Oracle DAO 指标：

![](../odao/images/tui-odao-metrics.png)

如果你在 Docker 或 Hybrid 模式下运行，这将重新启动你的 `node` 守护进程以应用更改。
如果你在 Native 模式下运行，请手动重新启动 `node` 服务。

其次，将 [Oracle DAO 仪表板](https://grafana.com/grafana/dashboards/15003-odao-member-dashboard/)从 Grafana Labs（ID `15003`）导入到你节点的本地 Grafana 服务器。

## 检查日志

如果你或其他 Oracle DAO 成员对你的节点表示担忧，第一道防线是使用以下命令（对于 Docker 和 Hybrid 模式）查看 `watchtower` 守护进程日志：

```shell
rocketpool service logs watchtower
```

这将显示 watchtower 容器的 `docker` 日志，截断到最后一百行左右。

要进一步查看，你可以使用 `-t` 标志来指示行数。
例如：

```shell
rocketpool service logs watchtower -t 2000
```

将显示最后 2000 行。
由于这会很快变得混乱，你可能希望将其通过管道传输到像 `less` 这样的实用程序中，以便可以滚动查看。

## 下一步

在下一节中，我们将介绍作为 Oracle DAO 成员必须手动执行的职责。
