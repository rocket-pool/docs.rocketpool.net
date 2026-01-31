# 使用警报通知监控您的 Smartnode 堆栈

Smartnode 警报通知功能允许您接收有关 Rocket Pool Smartnode 的健康状况和重要事件的通知。

## 警报系统概述

通知功能利用 [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) 来传递警报。警报功能要求您已经遵循了[设置 Grafana 仪表板](../grafana.mdx),该指南介绍了如何设置 Smartnode 堆栈的指标跟踪器。当 Smartnode 的重要指标超过某些阈值或发生特定事件(例如更改节点的费用接收者)时,将触发警报。

## 设置 Discord 通知

目前,通知可以发送到 Discord 频道。您可以在"Monitoring / Alerting"页面上的 Rocket Pool 文本用户界面(TUI)中配置 Discord 通知。

### 添加 Discord Webhook URL:

1. 导航到所需的 Discord 频道并打开其设置。
2. 在"Integrations"下,找到并单击"Webhooks"。
3. 单击"Create Webhook"。
4. 为 webhook 命名并选择要将警报发送到的频道。
5. 复制提供的 Webhook URL。
6. 在 Rocket Pool TUI 中,导航到"Monitoring / Alerting"页面。
7. 将复制的 Webhook URL 粘贴到指定字段中并保存配置。

::: tip 提示
缺少您最喜欢的通知方式? Rocket Pool 团队正在积极寻求社区关于其他通知目的地的反馈。欢迎在 https://github.com/rocket-pool/smartnode/issues 上建议新的通知目的地。
:::

## 禁用和启用警报

Rocket Pool TUI 提供了一个用户友好的界面来管理您的警报。您可以通过"Monitoring / Alerting"页面访问此功能。此界面允许您查看所有配置的警报列表,并根据您的偏好启用或禁用单个警报。

## 高级配置

::: warning 注意
本节适用于熟悉 Prometheus 和修改 YAML 文件的高级用户。
:::

对于更高级的警报配置,您可以根据 Smartnode 堆栈管理的 Prometheus 容器中可用的任何指标添加自己的警报。将包含 [Prometheus 警报规则](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)的自己的 yaml 文件添加到 `~/.rocketpool/alerting/rules/` 目录中,然后使用 `docker stop rocketpool_prometheus` 重新启动 Prometheus 容器,然后使用 `docker start rocketpool_prometheus`。然后运行 `docker logs rocketpool_prometheus` 以确认 Prometheus 成功加载了您的配置文件(您希望看到一行包含 _msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml_,而不是 _err="error loading config from \"/etc/prometheus/prometheus.yml\"..._)
