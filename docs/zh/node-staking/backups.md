# 备份您的节点

::: tip 注意
此内容目前为 **Docker 模式** 安装编写。
对于 Hybrid 或 Native 用户，某些位置可能有所不同。
:::

一般来说，如果您通过 Smartnode 创建了节点钱包和 minipool，您唯一真正需要保存的用于从完全故障中恢复节点的东西是**节点钱包的助记词**
其他所有内容都可以从中轻松恢复。

如果您的 minipool 使用外部生成的验证者密钥（例如，您从 **Allnodes** 迁移到自己的自托管节点），您还需要验证者的私钥库文件，因为它们无法从节点钱包中恢复。

话虽如此，一旦合并发生，您将不再能够使用轻量级 Execution 客户端（例如 Pocket 或 Infura）作为后备，如果您需要重新同步 Execution 层链。
此外，您需要一个活跃且健康的 Execution 客户端才能正确证明。
拥有快速可靠的方法来从 Execution 客户端故障（例如数据库损坏、SSD 故障或硬件被盗/损坏）中恢复将至关重要，因为从头开始同步可能需要数小时甚至数天。

在本指南中，我们将向您展示如何备份其中一些内容，以帮助提高节点的弹性并最大程度地减少不必要的停机时间。

::: warning 注意
本指南假设您已将 Smartnode 安装到默认目录（`~/.rocketpool`）。
如果您指定了不同的安装目录，请在以下说明中相应地替换它。
:::

## 可以备份的项目

### Smartnode 配置

Smartnode 的配置存储在 `~/.rocketpool/user-settings.yml` 中。
您可以保存并替换它以恢复所有 Smartnode 设置（即您在 `rocketpool service config` 中指定的内容）。

### Execution 客户端 / ETH1 客户端链数据

Execution 客户端的链数据可能是最重要的备份项。
如前所述，重新同步您的 EC 链数据可能需要几天时间。
合并后，这意味着数小时到数天的停机时间和利润损失！

链数据存储在 `rocketpool_eth1clientdata` Docker 卷中，默认情况下位于 `/var/lib/docker/volumes/rocketpool_eth1clientdata`。
请注意，此文件夹通常无法被非特权用户帐户访问；您需要提升到 `root` 用户才能看到它。

::: tip 注意
如果您在初始 Smartnode 安装期间更改了 Docker 的存储位置（例如在第二块 SSD 上运行 Docker 的用户），您将在 `/<您的外部挂载点>/docker/volumes/rocketpool_eth1clientdata` 中找到该卷

如果您不记得使用了哪个安装路径，可以检查 `/etc/docker/daemon.json` 以获取其位置。
如果该文件不存在，则使用默认位置。
:::

有关如何高效备份您的 Execution 链数据的详细说明，请参阅下面的[备份您的 Execution 链数据](#备份您的-execution-链数据)部分。

### 监控和指标数据

此数据存储在 `rocketpool_grafana-storage` Docker 卷中，默认情况下位于 `/var/lib/docker/volumes/rocketpool_grafana-storage`（如果您自定义了 Docker 存储位置，则位于 `/<您的外部挂载点>/docker/volumes/rocketpool_prometheus-data`）。

## **不应**备份的项目

### 私钥和密码

您的节点钱包的私钥和用于加密它的密码文件分别存储在 `~/.rocketpool/data/wallet` 和 `~/.rocketpool/data/password` 中。
这些文件通常不需要备份，因为可以使用 `rocketpool wallet recover` 从您的助记词中恢复它们。

如果出于某种原因，您_确实_决定备份这些文件，您需要**极其小心**如何存储它们。
任何获得这些文件访问权限的人都将获得对您的节点钱包、其验证者以及您存储在其中用于 gas 等的任何资金的访问权限。

我们**强烈建议**您不要备份这些文件，只需在必要时使用您的钱包助记词恢复它们。

### Consensus 客户端链数据

与 Execution 层数据不同，Consensus 层数据对您的节点来说并不那么重要，这要归功于[检查点同步](./config-docker#beacon-chain-checkpoint-syncing)。
Consensus 客户端可以轻松使用此技术立即重新同步到 Beacon 链的头部并恢复验证职责。

## 备份您的 Execution 链数据

Smartnode 带有通过 `rocketpool service export-eth1-data` 命令备份您的 Execution 链数据的能力。
在底层，这利用了 `rsync`，这是 Linux 中强大的备份/复制工具。

`rsync` 比较源目录（您的 Docker 卷）和目标目录（您的备份位置）中的文件。
如果源文件在目标目录中不存在，它将被完全复制。
但是，如果它_确实_存在，`rsync` 将仅复制两个文件之间的_更改_。

这意味着第一次备份将花费大量时间，因为它必须初始复制所有数据。
后续备份将仅复制上次备份和现在之间的更改，从而使过程更快。

作为备份策略的一部分，您可能希望计划定期运行 `export-eth1-data`。
为了确保链数据的完整性，运行此命令将**在备份数据之前安全关闭 Execution 客户端**。
如果您选择每周安排它，您的 Execution 客户端只会在更新备份时停机几分钟。
这当然比从头开始重新同步数据所需的数天时间要好。

要触发备份，首先**挂载要导出数据的存储介质**。
例如，这可能是外部硬盘驱动器。

::: tip 提示
如果您不知道如何在 Linux 上挂载外部设备，这很简单！
将设备插入您的节点，并按照[类似这样的指南](https://www.addictivetips.com/ubuntu-linux-tips/mount-external-hard-drives-in-linux/)学习如何挂载它。
:::

挂载后，记下其挂载路径。
对于此示例，假设我们要将链数据存储在名为 `/mnt/external-drive` 的文件夹中，该外部设备挂载到该文件夹。
在下面看到它的任何地方都替换为您的实际挂载路径。

现在，运行以下命令：

```shell
rocketpool service export-eth1-data /mnt/external-drive
```

这将检查您的目标文件夹是否可达并且有足够的可用空间来存储链数据。
输出将如下所示：

```
This will export your execution client's chain data to an external directory, such as a portable hard drive.
If your execution client is running, it will be shut down.
Once the export is complete, your execution client will restart automatically.

You have a fallback execution client configured (http://<some address>:8545).
Rocket Pool (and your consensus client) will use that while the main client is offline.

Chain data size:       87 GiB
Target dir free space: 287 GiB
Your target directory has enough space to store the chain data.

NOTE: Once started, this process *will not stop* until the export is complete - even if you exit the command with Ctrl+C.
Please do not exit until it finishes so you can watch its progress.

Are you sure you want to export your execution layer chain data? [y/n]
```

如您所见，链数据将小于 100 GB（对于 Hoodi 测试网；Ethereum 主网将大一个数量级），外部文件夹有 287 GiB 可用，因此可以继续导出。

准备好后，在这里输入 `y` 并按 `Enter`。
这将停止您的 Execution 客户端并开始将其链数据复制到您的目标文件夹。
您将看到每个单独文件的进度在运行时通过屏幕。

::: warning 注意
重要的是，您_不要_在运行时退出终端。
如果这样做，复制将继续在后台运行，但您将无法跟踪其进度！
:::

完成后，它将自动重新启动您的 Execution 客户端容器。

**请注意，导出完成后，您现有的链数据不会从您的节点中删除！**

### 恢复您的 Execution 链数据

如果您需要恢复备份的链数据，只需运行以下命令。

```shell
rocketpool service import-eth1-data /mnt/external-drive
```

::: danger 警告
这将自动删除您的 `rocketpool_eth1clientdata` 卷中的任何现有 Execution 客户端数据！
:::

完成后，您的 Execution 客户端将准备就绪。
