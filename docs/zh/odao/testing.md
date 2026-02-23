# 测试你的 Oracle DAO 节点

一旦你的节点设置完成并加入了 Oracle DAO，你应该对其进行测试，以确保它能够正常执行其职责。
最好的方法是使用 Rocket Pool 的 `treegen` 实用程序让它构建 Redstone 奖励 Merkle 树。

### treegen

`treegen` 是一个工具，可以通过你的归档 Execution 和 Consensus 客户端重现以前奖励间隔的整个奖励 Merkle 树和相关文件。
它还可以通过假设当前间隔在最新的已确定 epoch（运行时）结束来"干运行"当前间隔，并生成从间隔开始到该时间点的部分树。

::: tip 提示
有关奖励树本身和相关文件的更多信息，请访问[**正式规范**](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/merkle-tree-spec)。
:::

`treegen` 可以作为独立二进制文件（目前仅为 Linux 系统构建，支持 x64 和 arm64）或 Docker 容器使用。

如果你想下载独立二进制文件，可以在这里的发布版中找到：[https://github.com/rocket-pool/treegen](https://github.com/rocket-pool/treegen)。
使用说明包含在那里的 README 中，但我们也会在下面介绍一些示例。

它的 Docker 容器标签是 `rocketpool/treegen:latest`。

## 构建干运行树

对于首次测试，运行 `treegen` 生成干运行树，该树计算从奖励间隔开始到最新（已确定）槽位的树。
为了简单起见，我们将使用存储库中包含的[脚本](https://github.com/rocket-pool/treegen/blob/main/treegen.sh)，该脚本利用 Docker 容器在节点机器上运行它：

```shell
./treegen.sh -e http://localhost:8545 -b http://localhost:5052
```

::: warning 注意
请注意，此特定配置要求你通过 Docker 配置公开 Execution Client 和 Beacon Node API - 确保在 `rocketpool service config` TUI 中启用这两个选项。
:::

这将测试你的客户端及时响应查询的能力（例如，如果你使用第三方服务，这将有助于评估其查询速率限制是否不足），但**不会测试其归档模式功能**。
它将产生如下输出：

```
2022/11/06 12:11:37 Beacon node is configured for Mainnet.
2022/11/06 12:11:37 Generating a dry-run tree for the current interval (3)
2022/11/06 12:11:37 Snapshot Beacon block = 5077503, EL block = 15912334, running from 2022-10-27 01:35:39 -0400 EDT to 2022-11-06 12:11:37.672755513 -0500 EST m=+0.049901525

2022/11/06 12:11:38  Creating tree for 1684 nodes
2022/11/06 12:11:38  Pending RPL rewards: 27807066876373932561121 (27807.067)
2022/11/06 12:11:38  Total collateral RPL rewards: 19464946813461752792784 (19464.947)
2022/11/06 12:11:47  Calculated rewards:           19464946813461752792026 (error = 758 wei)
2022/11/06 12:11:47  Total Oracle DAO RPL rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Calculated rewards:           4171060031456089884168 (error = 0 wei)
2022/11/06 12:11:47  Expected Protocol DAO rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Actual Protocol DAO rewards:   4171060031456089884927 to account for truncation
2022/11/06 12:11:47  Smoothing Pool Balance: 62781809204406327225 (62.782)
2022/11/06 12:11:55  1229 / 1684 nodes were eligible for Smoothing Pool rewards
2022/11/06 12:12:03  Checking participation of 4364 minipools for epochs 156315 to 158671
2022/11/06 12:12:03  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/06 12:13:48  On Epoch 156415 of 158671 (4.24%)... (1m44.577189073s so far)

...

2022/11/06 12:49:55  On Epoch 158615 of 158671 (97.62%)... (37m51.785456663s so far)
2022/11/06 12:50:51  Finished participation check (total time = 38m47.979633935s)
2022/11/06 12:50:51  Pool staker ETH:    26638263090669169632 (26.638)
2022/11/06 12:50:51  Node Op ETH:        36143546113737157593 (36.144)
2022/11/06 12:50:51  Calculated NO ETH:  36143546113737155125 (error = 2468 wei)
2022/11/06 12:50:51  Adjusting pool staker ETH to 26638263090669172100 to account for truncation
2022/11/06 12:50:52 Saved minipool performance file to rp-minipool-performance-mainnet-3.json
2022/11/06 12:50:52 Generation complete! Saving tree...
2022/11/06 12:50:52 Saved rewards snapshot file to rp-rewards-mainnet-3.json
2022/11/06 12:50:52 Successfully generated rewards snapshot for interval 3.
```

如果运行没有错误，它将生成奖励树文件并将它们保存为工作目录中的 JSON 文件。
你可以自由探索它们并确保其内容是合理的，但由于它们是干运行文件，因此不会在任何地方规范存储以供比较。

## 从过去间隔构建规范树

下一个测试是复制过去间隔的完整树之一。
这将需要在 Execution Layer 和 Consensus Layer 上进行归档访问，因此它将作为两种能力的良好测试。

截至本文撰写时，**间隔 2** 是一个理想的选择，因为它在过去很久（），并且涉及 Smoothing Pool（这在计算该期间的奖励时占据了最大的计算负载）。

使用以下命令运行 `treegen`：

```shell
./treegen.sh -e http://<your archive EC url> -b http://localhost:5052 -i 2
```

请注意，这里的 **Execution Client URL** 不同：它*必须是*归档 EC，因为间隔 2 的快照区块在很久以前。

::: warning 注意
根据你的客户端配置，构建此树可能需要*数小时*。
Smartnode 会在过程中提供有关其进度的状态指示器，如下面的示例所示。
:::

输出将如下所示（为简洁起见进行了截断）：

```
2022/11/07 23:44:34 Beacon node is configured for Mainnet.
2022/11/07 23:44:36 Found rewards submission event: Beacon block 5002079, execution block 15837359
2022/11/07 23:46:25  Creating tree for 1659 nodes
2022/11/07 23:46:26  Pending RPL rewards: 70597400644162994104151 (70597.401)
2022/11/07 23:46:26  Approx. total collateral RPL rewards: 49418180450914095872905 (49418.180)
2022/11/07 23:46:26  Calculating true total collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:47:06  On Node 100 of 1659 (6.03%)... (40.134456319s so far)
...
2022/11/07 23:57:41  On Node 1600 of 1659 (96.44%)... (11m14.880994468s so far)
2022/11/07 23:58:03  Calculating individual collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:58:14  On Node 100 of 1659 (6.03%)... (11.421791885s so far)
...
2022/11/08 00:01:20  On Node 1600 of 1659 (96.44%)... (3m16.598462676s so far)
2022/11/08 00:01:26  Calculated rewards:           49418180450914095872087 (error = 818 wei)
2022/11/08 00:01:26  Total Oracle DAO RPL rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Calculated rewards:           10589610096624449115610 (error = 12 wei)
2022/11/08 00:01:30  Expected Protocol DAO rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Actual Protocol DAO rewards:   10589610096624449116454 to account for truncation
2022/11/08 00:01:30  Smoothing Pool Balance: 209598268075128756591 (209.598)
2022/11/08 00:04:20  On Node 104 of 1659 (6.27%)... (2m49.443336528s so far)
...
2022/11/08 00:27:33  On Node 1664 of 1659 (99.70%)... (27m28.373343345s so far)
2022/11/07 16:40:36  1197 / 1659 nodes were eligible for Smoothing Pool rewards
2022/11/07 16:45:45  Checking participation of 4308 minipools for epochs 150015 to 156314
2022/11/07 16:45:45  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/07 16:47:24  On Epoch 150115 of 156314 (1.59%)... (1m38.552513232s so far)
...
2022/11/07 18:24:31  On Epoch 156215 of 156314 (98.43%)... (1h38m46.325518238s so far)
2022/11/07 18:26:10  Finished participation check (total time = 1h40m24.47206731s)
2022/11/07 18:26:10  Pool staker ETH:    88931841842952006598 (88.932)
2022/11/07 18:26:10  Node Op ETH:        120666426232176749993 (120.666)
2022/11/07 18:26:10  Calculated NO ETH:  120666426232176747457 (error = 2536 wei)
2022/11/07 18:26:10  Adjusting pool staker ETH to 88931841842952009134 to account for truncation
2022/11/07 18:26:10 Finished in 2h36m3.709234237s
2022/11/07 18:26:10 Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
2022/11/07 18:26:10 Saving JSON files...
2022/11/07 18:26:10 Saved minipool performance file to rp-minipool-performance-mainnet-2.json
2022/11/07 18:26:10 Saved rewards snapshot file to rp-rewards-mainnet-2.json
2022/11/07 18:26:10 Successfully generated rewards snapshot for interval 2.
```

这里要寻找的关键信息是最后的这条消息：

```
Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
```

如果你收到此消息，那么你的 watchtower 可以正确构建树。

::: danger 注意
虽然这证明你可以构建树，但你*必须*确保你的 Web3.Storage API 令牌已输入到 Smartnode 的配置中，以便它可以将生成的树上传到 IPFS。
:::

### 下一步

接下来，我们将介绍如何监控你的节点性能。
