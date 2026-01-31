# 命令行界面简介

作为节点运营者,CLI 是您与 Rocket Pool 交互的主要工具。
您将使用它来创建新的 minipool、检查所有内容的状态、领取定期的 RPL 奖励、在准备好时退出和提取您的 minipool,以及进行许多其他活动。

一旦您完成执行层和信标链的同步,所有命令将可供您使用。
在本节中,我们将简要介绍一些更常见的命令以及 CLI 可以执行的其他一些技巧。

## 了解命令

要列出所有可用命令,请输入:

```shell
rocketpool help
```

输出将如下所示:

```
NAME:
   rocketpool - Rocket Pool CLI

USAGE:
   rocketpool [global options] command [command options] [arguments...]

VERSION:
   1.17.2

COMMANDS:
   auction, a   Manage Rocket Pool RPL auctions
   minipool, m  Manage the node's minipools
   network, e   Manage Rocket Pool network parameters
   node, n      Manage the node
   odao, o      Manage the Rocket Pool oracle DAO
   pdao, p      Manage the Rocket Pool Protocol DAO
   queue, q     Manage the Rocket Pool deposit queue
   security, c  Manage the Rocket Pool security council
   service, s   Manage Rocket Pool service
   wallet, w    Manage the node wallet
   help, h      Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --allow-root, -r              Allow rocketpool to be run as the root user
   --config-path path, -c path   Rocket Pool config asset path (default: "~/.rocketpool")
   --daemon-path path, -d path   Interact with a Rocket Pool service daemon at a path on the host OS, running outside of docker
   --maxFee value, -f value      The max fee (including the priority fee) you want a transaction to cost, in gwei (default: 0)
   --maxPrioFee value, -i value  The max priority fee you want a transaction to use, in gwei (default: 0)
   --gasLimit value, -l value    [DEPRECATED] Desired gas limit (default: 0)
   --nonce value                 Use this flag to explicitly specify the nonce that this transaction should use, so it can override an existing 'stuck' transaction
   --debug                       Enable debug printing of API commands
   --secure-session, -s          Some commands may print sensitive information to your terminal. Use this flag when nobody can see your screen to allow sensitive data to be printed without prompting
   --help, -h                    show help
   --version, -v                 print the version

COPYRIGHT:
   (c) 2025 Rocket Pool Pty Ltd
```

## Service 命令

service 组涉及管理 smart node 为您管理的各种服务。

这是 `rocketpool service help` 输出将显示的内容:

```
NAME:
   rocketpool service - Manage Rocket Pool service

USAGE:
   rocketpool service [global options] command [command options] [arguments...]

VERSION:
   1.17.2

COMMANDS:
   install, i                 Install the Rocket Pool service
   config, c                  Configure the Rocket Pool service
   status, u                  View the Rocket Pool service status
   start, s                   Start the Rocket Pool service
   pause, p                   Pause the Rocket Pool service
   stop, o                    Pause the Rocket Pool service (alias of 'rocketpool service pause')
   reset-docker, rd           Cleanup Docker resources, including stopped containers, unused images and networks. Stops and restarts Smartnode.
   prune-docker, pd           Cleanup unused Docker resources, including stopped containers, unused images, networks and volumes. Does not restart smartnode, so the running containers and the images and networks they reference will not be pruned.
   logs, l                    View the Rocket Pool service logs
   stats, a                   View the Rocket Pool service stats
   compose                    View the Rocket Pool service docker compose config
   version, v                 View the Rocket Pool service version information
   prune-eth1, n              Shuts down the main ETH1 client and prunes its database, freeing up disk space, then restarts it when it's done.
   install-update-tracker, d  Install the update tracker that provides the available system update count to the metrics dashboard
   get-config-yaml            Generate YAML that shows the current configuration schema, including all of the parameters and their descriptions
   resync-eth1                Deletes the main ETH1 client's chain data and resyncs it from scratch. Only use this as a last resort!
   resync-eth2                Deletes the ETH2 client's chain data and resyncs it from scratch. Only use this as a last resort!
   terminate, t               Deletes all of the Rocket Pool Docker containers and volumes, including your ETH1 and ETH2 chain data and your Prometheus database (if metrics are enabled). Also removes your entire `.rocketpool` configuration folder, including your wallet, password, and validator keys. Only use this if you are cleaning up the Smartnode and want to start over!

GLOBAL OPTIONS:
   --compose-file value, -f value  Optional compose files to override the standard Rocket Pool docker compose YAML files; this flag may be defined multiple times
   --help, -h                      show help
```

### `status`

此命令显示 Rocket Pool 管理的每个 Docker 容器的当前运行状态。
例如,默认 Docker 安装的输出如下所示:

```
        Name                       Command              State                                                       Ports
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
rocketpool_api          /bin/sleep infinity             Up
rocketpool_eth1         sh /setup/start-node.sh         Up      0.0.0.0:30303->30303/tcp,:::30303->30303/tcp, 0.0.0.0:30303->30303/udp,:::30303->30303/udp, 8545/tcp, 8546/tcp
rocketpool_eth2         sh /setup/start-beacon.sh       Up      0.0.0.0:9001->9001/tcp,:::9001->9001/tcp, 0.0.0.0:9001->9001/udp,:::9001->9001/udp
rocketpool_node         /go/bin/rocketpool node         Up
rocketpool_validator    sh /setup/start-validator.sh    Up
rocketpool_watchtower   /go/bin/rocketpool watchtower   Up
```

您可以使用它快速检查任何 Docker 容器是否有问题,或确保 `start` 或 `stop` 命令正确工作。

### `start` 和 `stop`

这两个命令您已经很熟悉了。
它们只是启动或停止所有 Rocket Pool 容器。

::: tip
`pause` 命令与 `stop` 命令的作用相同。
它只是作为早期版本 Rocket Pool 的遗留命令保留下来的。
:::

### `logs`

这是您应该已经看到的另一个命令。
您可以使用它查看每个 Docker 容器的输出日志。
这对于故障排除或从中获取更详细的状态报告很有用。

如果您只是执行 `rocketpool service logs` 而不带任何其他参数,它将聚合所有日志并一次性向您显示。

如果您想专注于一个容器的输出,可以在末尾添加一个参数来指定容器。
有效值为 `eth1`、`eth2`、`validator`、`api`、`node`、`watchtower`、`prometheus`、`grafana` 和 `node-exporter`。

### `stats`

此命令显示每个容器的一些资源统计信息,您可以使用这些信息来分析每个容器的硬件和网络消耗。

如果您的系统开始运行缓慢或出现 RAM 问题,您可能会发现它对监控容器很有用。

以下是一些示例输出:

```
CONTAINER ID   NAME                    CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O         PIDS
62314e5a0ecf   rocketpool_api          0.00%     18.89MiB / 62.78GiB   0.03%     50.6kB / 31.1kB   57.4MB / 0B       1
ac629c08c896   rocketpool_eth1         5.44%     18.13GiB / 62.78GiB   28.88%    1.63GB / 1.66GB   24.4GB / 37.7GB   27
4dfc7a2e939b   rocketpool_eth2         97.39%    2.369GiB / 62.78GiB   3.77%     1.79GB / 45MB     333MB / 24.1GB    2
a3c22f54eff0   rocketpool_node         0.00%     12.13MiB / 62.78GiB   0.02%     308kB / 504kB     0B / 0B           15
0d5818868ef6   rocketpool_validator    0.00%     936KiB / 62.78GiB     0.00%     12.1kB / 0B       4.57MB / 0B       2
88bea525fa89   rocketpool_watchtower   0.00%     12.05MiB / 62.78GiB   0.02%     304kB / 503kB     0B / 0B           16
```

::: tip 注意
此处的 RAM 统计信息显示**总分配内存**,包括_虚拟_内存。
它不显示原始_常驻_内存消耗。

类似地,CPU 使用率显示容器使用的所有 CPU 核心的平均总 CPU 消耗量。
这里,ETH2 的 CPU 显示接近 100%,因为它使用的是 Nimbus,它是单线程的。

您可能会发现像 `htop` 或 `btop` 这样的程序可以更好地了解实际资源消耗。
:::

### `config`

此命令再次运行配置面试。
如果您想更改执行层或共识层客户端的选择,或更改您在选择它们时最初指定的一些参数(例如验证者的涂鸦消息、要连接的最大对等节点数等),可以使用它。

您可以随时调用此命令,但更改要等到您调用 `rocketpool service stop` 和 `rocketpool service start` 后才会生效。

### `terminate`

此命令将关闭 Docker 容器,然后删除它们,删除 Rocket Pool 虚拟网络,并删除 ETH1 和 ETH2 链数据卷。
它基本上从您的 Docker 设置中删除所有 Rocket Pool 项目。
当您想清理 Rocket Pool 安装的这一部分时使用它。

::: warning
这将不可逆转地删除您的链数据,这意味着您需要再次同步 ETH1 和 ETH2。

这**不会**删除您的钱包和密码文件、配置设置或验证者密钥。
要删除这些内容,您需要在 Docker 或混合模式下删除 `~/.rocketpool/data` 文件夹,或在原生模式下删除相应的目录。
:::

## Node 命令

`node` 组涉及对您的 Rocket Pool 节点的操作。
我们将在下一节创建 minipool 时更深入地介绍这些内容,但一目了然地查看所有内容可能会有所帮助。

这是 `rocketpool node help` 输出将显示的内容:

```
NAME:
   rocketpool node - Manage the node

USAGE:
   rocketpool node [global options] command [command options] [arguments...]

VERSION:
   1.17.2

COMMANDS:
   status, s                                     Get the node's status
   sync, y                                       Get the sync progress of the eth1 and eth2 clients
   register, r                                   Register the node with Rocket Pool
   rewards, e                                    Get the time and your expected RPL rewards of the next checkpoint
   set-primary-withdrawal-address, w             Set the node's primary withdrawal address, which will receive all ETH rewards (and RPL if the RPL withdrawal address is not set)
   confirm-primary-withdrawal-address, f         Confirm the node's pending primary withdrawal address if it has been set back to the node's address itself
   set-rpl-withdrawal-address, srwa              Set the node's RPL withdrawal address, which will receive all RPL rewards and staked RPL withdrawals
   confirm-rpl-withdrawal-address, crwa          Confirm the node's pending rpl withdrawal address if it has been set back to the node's address itself
   allow-rpl-locking, arl                        Allow the node to lock RPL when creating governance proposals/challenges
   deny-rpl-locking, drl                         Do not allow the node to lock RPL when creating governance proposals/challenges
   set-timezone, t                               Set the node's timezone location
   swap-rpl, p                                   Swap old RPL for new RPL
   stake-rpl, k                                  Stake RPL against the node
   add-address-to-stake-rpl-whitelist, asw       Adds an address to your node's RPL staking whitelist, so it can stake RPL on behalf of your node.
   remove-address-from-stake-rpl-whitelist, rsw  Removes an address from your node's RPL staking whitelist, so it can no longer stake RPL on behalf of your node.
   claim-rewards, c                              Claim available RPL and ETH rewards for any checkpoint you haven't claimed yet
   withdraw-rpl, i                               Withdraw RPL staked against the node
   withdraw-eth, h                               Withdraw ETH staked on behalf of the node
   deposit, d                                    Make a deposit and create a minipool
   create-vacant-minipool, cvm                   Create an empty minipool, which can be used to migrate an existing solo staking validator as part of the 0x00 to 0x01 withdrawal credentials upgrade
   send, n                                       Send ETH or tokens from the node account to an address. ENS names supported. <token> can be 'rpl', 'eth', 'fsrpl' (for the old RPL v1 token), 'reth', or the address of an arbitrary token you want to send (including the 0x prefix).
   set-voting-delegate, sv                       (DEPRECATED) Use `rocketpool pdao set-signalling-address` instead
   clear-voting-delegate, cv                     (DEPRECATED) Use `rocketpool pdao clear-signalling-address` instead
   initialize-fee-distributor, z                 Create the fee distributor contract for your node, so you can withdraw priority fees and MEV rewards after the merge
   distribute-fees, b                            Distribute the priority fee and MEV rewards from your fee distributor to your withdrawal address and the rETH contract (based on your node's average commission)
   join-smoothing-pool, js                       Opt your node into the Smoothing Pool
   leave-smoothing-pool, ls                      Leave the Smoothing Pool
   sign-message, sm                              Sign an arbitrary message with the node's private key
   send-message                                  Send a zero-ETH transaction to the target address (or ENS) with the provided hex-encoded message as the data payload

GLOBAL OPTIONS:
   --help, -h  show help
```

以下是您在典型节点操作期间往往需要的一些命令的摘要。

### `status`

此命令将为您提供整个节点的高级概览。
它包括您质押了多少 ETH 和 RPL、您有多少 minipool 及其状态、您的 RPL 抵押率等等。

这是一旦您注册了节点并设置了一些 minipool 后 `rocketpool node status` 显示的示例:

```
=== Account and Balances ===
The node <node address> has a balance of 2.682258 ETH and 1881.677523 RPL.
The node has 0.000000 ETH in its credit balance and 0.000000 ETH staked on its behalf. 0.000000 can be used to make new minipools.
The node is registered with Rocket Pool with a timezone location of America/Los_Angeles.

=== Penalty Status ===
The node does not have any penalties for cheating with an invalid fee recipient.

=== Signalling on Snapshot ===
The node does not currently have a snapshot signalling address set.
To learn more about snapshot signalling, please visit /zh/legacy/houston/participate#setting-your-snapshot-signalling-address.
Rocket Pool has no Snapshot governance proposals being voted on.

=== Onchain Voting ===
The node has been initialized for onchain voting.
The node doesn't have a delegate, which means it can vote directly on onchain proposals. You can have another node represent you by running `rocketpool p svd <address>`.
The node is allowed to lock RPL to create governance proposals/challenges.
The node currently has 300.000000 RPL locked.

=== Primary Withdrawal Address ===
The node's primary withdrawal address has not been changed, so ETH rewards and minipool withdrawals will be sent to the node itself.
Consider changing this to a cold wallet address that you control using the `set-withdrawal-address` command.

=== RPL Withdrawal Address ===
The node's RPL withdrawal address has not been set. All RPL rewards will be sent to the primary withdrawal address.

=== Fee Distributor and Smoothing Pool ===
The node's fee distributor <fee distributer contract address> has a balance of 0.000000 ETH.
The node is currently opted into the Smoothing Pool <smoothing pool contract address>.

=== RPL Stake ===
NOTE: The following figures take *any pending bond reductions* into account.

The node has a total stake of 588.950796 RPL.
This is currently 4.01% of its borrowed ETH and 12.04% of its bonded ETH.

=== Minipools ===
The node has a total of 1 active minipool(s):
- 1 staking
```

### `sync`

此命令将显示执行层和共识层客户端的当前同步状态。
您可能会在首次设置节点时经常使用它,然后就再也不需要它了(除非您更改或重置客户端)。

`rocketpool node sync` 的输出将如下所示:

```
Your Smartnode is currently using the Hoodi Test Network.

Your eth1 client hasn't synced enough to determine if your eth1 and eth2 clients are on the same network.
To run this safety check, try again later when eth1 has made more sync progress.

Your primary execution client is still syncing (67.12%).
You do not have a fallback execution client enabled.
Your primary consensus client is still syncing (99.94%).
You do not have a fallback consensus client enabled.
```

请注意,**Prysm** 目前不提供其完成百分比 - 如果您使用它,您需要查看 `eth2` 日志。

### `stake-rpl`

当您想向节点添加更多 RPL 抵押品时,将使用此命令。
这样做将增加您的抵押率,从而在每个检查点增加您的 RPL 奖励(稍后会详细介绍)。

与到目前为止的其他命令不同,这个命令实际上是_交互式的_,因为它将触发交易 - 它不仅仅是信息性的。

它首先会询问您想质押多少 RPL,提供一些预定义选项以方便使用,或者能够指定自定义金额:

```
NOTE: By staking RPL, you become a member of the Rocket Pool pDAO. Stay informed on governance proposals by joining the Rocket Pool Discord.

Please choose an amount of RPL to stake:
1: 5% of borrowed ETH (733.993926 RPL) for one validator?
2: 10% of borrowed ETH (1467.987852 RPL) for one validator?
3: 15% of borrowed ETH (2201.981778 RPL) for one validator?
4: Your entire RPL balance (20000.000000 RPL)?
5: A custom amount
```

选择一个选项后,您将看到有关建议的 gas 价格和要使用的估计金额的一些信息,以及确认对话框。如果这是您首次在节点上质押 RPL,您需要授予质押合约与您的 RPL 交互的权限:

```
Before staking RPL, you must first give the staking contract approval to interact with your RPL.
This only needs to be done once for your node.
+============== Suggested Gas Prices ==============+
| Avg Wait Time |  Max Fee  |    Total Gas Cost    |
| 15 Seconds    | 4 gwei    | 0.0001 to 0.0001 ETH |
| 1 Minute      | 4 gwei    | 0.0001 to 0.0001 ETH |
| 3 Minutes     | 4 gwei    | 0.0001 to 0.0001 ETH |
| >10 Minutes   | 4 gwei    | 0.0001 to 0.0001 ETH |
+==================================================+

These prices include a maximum priority fee of 2.00 gwei.
Please enter your max fee (including the priority fee) or leave blank for the default of 4 gwei:

Using a max fee of 4.00 gwei and a priority fee of 2.00 gwei.
Do you want to let the staking contract interact with your RPL? [y/n]
y

Approving RPL for staking...
Transaction has been submitted with hash <transaction hash>.
You may follow its progress by visiting:
https://hoodi.etherscan.io/tx/<transaction hash>

Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully approved staking access to RPL.
RPL Stake Gas Info:
+============== Suggested Gas Prices ==============+
| Avg Wait Time |  Max Fee  |    Total Gas Cost    |
| 15 Seconds    | 4 gwei    | 0.0005 to 0.0007 ETH |
| 1 Minute      | 4 gwei    | 0.0005 to 0.0007 ETH |
| 3 Minutes     | 4 gwei    | 0.0005 to 0.0007 ETH |
| >10 Minutes   | 4 gwei    | 0.0005 to 0.0007 ETH |
+==================================================+

These prices include a maximum priority fee of 2.00 gwei.
Please enter your max fee (including the priority fee) or leave blank for the default of 4 gwei:

Using a max fee of 4.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to stake 733.993925 RPL? You will not be able to unstake this RPL until you exit your validators and close your minipools, or reach 2201.981777 staked RPL (15% of bonded eth)! [y/n]
```

如果您确认,您将看到交易哈希并获得 [Etherscan](https://etherscan.io) 的链接,以便您可以跟踪其进度:

```
Staking RPL...
Transaction has been submitted with hash <transaction hash>.
You may follow its progress by visiting:
https://hoodi.etherscan.io/tx/<transaction hash>

Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully staked 733.993925 RPL.
```

大多数操作只需要一个交易,因此 CLI 将等到它被包含在区块中然后退出。但是,stake-rpl 是需要两个交易的少数命令之一,因此此对话框将出现两次。

### `deposit`

此命令将允许您存入 ETH 并创建新的 minipool(新的以太坊验证者)。

系统将提示您交易的预期 gas 成本和最后一个确认对话框。
如果您接受,您的 ETH 存款将被处理,您将创建一个新的 minipool(和相应的以太坊验证者)。

(有关更多信息,请参阅下一节关于[创建 Minipool](./create-validator.mdx))。

### `claim-rewards`

当您的节点检测到新的奖励检查点时,它将自动下载该间隔信息的奖励树文件(如果您使用默认的下载模式 - 有关生成自己的树而不是下载它们的信息,请参见下文)。
然后,您可以使用以下命令查看您的奖励:

```
rocketpool node claim-rewards
```

随着间隔的过去和奖励的累积,输出将如下所示:

![](../node-staking/images/claim-rewards-gb.png)

在这里,您可以快速查看您在每个间隔赚取了多少奖励,并可以决定要领取哪些奖励。

您还可以指定要在此领取期间重新质押的金额:

![](../node-staking/images/autostake.png)

这将让您在一次交易中复利您的 RPL 奖励,使用的 gas 大大少于您目前使用旧版领取系统所需的 gas。

::: tip 注意
如果您更喜欢手动构建奖励检查点而不是下载 Oracle DAO 创建的检查点,您可以在 TUI 中将此设置从 `Download` 更改为 `Generate`:

![](../node-staking/images/tui-generate-tree.png)

如提示所示,您需要访问执行层客户端存档节点才能执行此操作。
如果您的本地执行层客户端不是存档节点,您可以在同一菜单中进一步向下的 `Archive-Mode EC URL` 中指定一个单独的节点(例如 Infura 或 Alchemy)。
此 URL 仅在生成 Merkle 树时使用;它不会用于验证职责。
:::

### `join-smoothing-pool`

```shell
rocketpool node join-smoothing-pool
```

这将在 Rocket Pool 合约中将您记录为选择加入,并自动将您的验证者客户端的 `fee recipient` 从您节点的分发合约更改为 Smoothing Pool 合约。

请注意,一旦您选择加入,在您可以选择退出之前有 **28 天的冷却期**(一个完整的奖励间隔长度)。

### `leave-smoothing-pool`

```shell
rocketpool node leave-smoothing-pool
```

如果您当前已选择加入,并且在选择加入后已等待至少 28 天,这将使您退出 Smoothing Pool。
一旦**当前 epoch 之后的下一个 epoch** 被最终确定,它将自动将您节点的 `fee recipient` 从 Smoothing Pool 更改回您节点的分发合约。
这是为了确保当您看到即将有提案时,您不会因为抢先退出流程而受到惩罚。

### `initialize-fee-distributor`

要初始化您节点的分发器,只需运行此新命令:

```shell
rocketpool node initialize-fee-distributor
```

### `distribute-fees`

当您的分发器已初始化后,您可以使用以下命令领取并分配其全部余额:

```shell
rocketpool node distribute-fees
```

这将把您的奖励份额发送到您的**提款地址**。

### `send`

此命令允许您从节点钱包向不同地址发送 ETH、RPL 或其他 Rocket Pool 相关代币。
如果您想将钱包上的资金转移到其他地方,这可能很有用。

使用 `send` 命令的语法如下:

```shell
rocketpool node send <amount> <token> <address or ENS name>
```

参数如下:

- `<amount>` 是要发送的代币数量。
- `<token>` 是要发送的代币 - 可以是 `eth`、`rpl`、`fsrpl`(旧版 RPL 代币)或 `reth`。
- `<address or ENS name>` 是要将代币发送到的以太坊地址(或 ENS 名称)。

例如:

```shell
rocketpool node send 1 eth <my friend's address>
```

将向我的朋友发送 1 ETH。

## Minipool 命令

`minipool` 组涉及影响您的 minipool 的命令。
与 `node` 组一样,我们将在下一节中更深入地介绍这些内容,但现在查看所有内容可能会有所帮助。

这是 `rocketpool minipool help` 输出将显示的内容:

```
NAME:
   rocketpool minipool - Manage the node's minipools

USAGE:
   rocketpool minipool [global options] command [command options] [arguments...]

VERSION:
   1.17.2

COMMANDS:
   status, s                   Get a list of the node's minipools
   stake, t                    Stake a minipool after the scrub check, moving it from prelaunch to staking.
   set-withdrawal-creds, swc   Convert the withdrawal credentials for a migrated solo validator from the old 0x00 value to the minipool address. Required to complete the migration process.
   import-key, ik              Import the externally-derived key for a minipool that was previously a solo validator, so the Smartnode's VC manages it instead of your externally-managed VC.
   promote, p                  Promote a vacant minipool after the scrub check, completing a solo validator migration.
   refund, r                   Refund ETH belonging to the node from minipools
   begin-bond-reduction, bbr   Begins the ETH bond reduction process for a minipool, taking it from 16 ETH down to 8 ETH (begins conversion of a 16 ETH minipool to an LEB8)
   reduce-bond, rb             Manually completes the ETH bond reduction process for a minipool from 16 ETH down to 8 ETH once it is eligible. Please run `begin-bond-reduction` first to start this process.
   distribute-balance, d       Distribute a minipool's ETH balance between your withdrawal address and the rETH holders.
   exit, e                     Exit staking minipools from the beacon chain
   close, c                    Withdraw any remaining balance from a minipool and close it
   delegate-upgrade, u         Upgrade a minipool's delegate contract to the latest version
   delegate-rollback, b        Roll a minipool's delegate contract back to its previous version
   set-use-latest-delegate, l  Use this to enable or disable the "use-latest-delegate" flag on one or more minipools. If enabled, the minipool will ignore its current delegate contract and always use whatever the latest delegate is.
   find-vanity-address, v      Search for a custom vanity minipool address
   rescue-dissolved, rd        Manually deposit ETH into the Beacon deposit contract for a dissolved minipool, activating it on the Beacon Chain so it can be exited.

GLOBAL OPTIONS:
   --help, -h  show help
```

以下是您通常会使用的命令摘要。

### `status`

此命令只是提供每个 minipool 的摘要。
这包括其当前状态、minipool 的 eth1 地址、其上的佣金(称为 `node fee`)、相应 ETH2 验证者的公钥以及其他一些内容:

```
$ rocketpool minipool status

1 Staking minipool(s):

--------------------

Address:                <minipool eth1 address>
Penalties:             0
Status updated:        2025-07-15, 08:31 +0000 UTC
Node fee:              5.000000%
Node deposit:          8.000000 ETH
RP ETH assigned:       2025-07-14, 20:26 +0000 UTC
RP deposit:            24.000000 ETH
Minipool Balance (EL): 0.064202 ETH
Your portion:          0.018458 ETH
Available refund:      0.000000 ETH
Total EL rewards:      0.018458 ETH
Validator pubkey:      <validator eth2 address>
Validator index:       <validator eth2 index>
Validator active:      yes
Beacon balance (CL):   32.000347 ETH
Your portion:          8.000099 ETH
Use latest delegate:   no
Delegate address:      0x56903694d881282D33ed0643EAe14263880Dd47F
Rollback delegate:     <none>
Effective delegate:    0x56903694d881282D33ed0643EAe14263880Dd47F
```

### `refund`

如果您存入 32 ETH 创建了一个 minipool,一旦 Rocket Pool 能够从 rETH 质押池贡献 16 ETH,此命令可让您从 minipool 中提取 16 ETH。

### `exit`

此命令为信标链上的验证者提交自愿退出。
当您想关闭验证者并提取其最终 ETH 余额时使用此命令。
请注意,**这无法撤消** - 一旦触发退出,验证者将永久关闭。

## 有用的标志

有一些有用的全局标志,您可以将其添加到上述某些命令中,您可能想利用这些标志。

### 设置自定义最大费用或优先费用(Gas 价格)

从 2021 年 7 月的 [London ETH1 硬分叉](https://coinquora.com/ethereum-london-hard-fork-all-you-need-to-know/)开始,以太坊交易不再为其交易使用单一 gas 价格。
相反,现代以太坊交易使用两个值:

- **max fee**,它描述了您愿意接受的交易的绝对最大 gas 价格
- **max priority fee**,它描述了您愿意"小费"矿工以将您的交易包含在区块中的最大金额

::: tip 提示
这两个值的工作方式可能有点复杂,因此这里有一些简单的示例。

假设当前网络费用(称为 **base fee**)为 50 gwei。
您提交了一笔交易,**max fee** 为 **80 gwei**,优先费用为 **2 gwei**。

因为网络的 base fee 低于您的 max fee,所以此交易可以在当前区块中被拾取。
它将花费您 **50 gwei** 的 base fee 和 **2 gwei** 的优先费用;即使您将 max fee 设置为 80,**它也只会花费您总共 52 gwei**。

作为另一个示例,假设您有相同的交易,但现在网络的 base fee 为 **100 gwei**。
由于 100 gwei 大于您的 80 gwei max fee,因此您的交易**不会**包含在此区块中。
相反,它将简单地停留在交易池中,直到 base fee 足够低以将其包含在内。

现在,假设当前 base fee 再次为 **50 gwei**,而您的交易的 max fee 为 **80** gwei,优先费用为 **4 gwei**。
它将以 **54 gwei** 的总成本执行。
4 gwei 优先费用将确保它包含在所有具有较低优先费用的交易之前。

如果您**真的**希望交易无论如何都通过,您可以将优先费用设置为与 max fee 相同。
这模拟了传统的 gas 行为,因此您的交易将使用您给它的所有 gas - 无论网络的 base fee 是否低于您的 max fee。
:::

默认情况下,Rocket Pool 将使用预言机查看当前交易池,并为您触发的任何交易建议合理的 max fee。
它使用 [EtherChain](https://etherchain.org/tools/gasnow) 作为其主要建议预言机,使用 [Etherscan](https://etherscan.io/gastracker) 作为备份。

如果您愿意,可以使用 `-f` 标志设置您愿意支付的自定义 max fee(以 gwei 为单位)。
您还可以使用 `-i` 标志设置自定义优先费用。

要执行此操作,请在 `rocketpool` 之后和其他命令信息之前添加它们。

例如,使用此标志调用 `node set-timezone` 将提供以下输出:

```
$ rocketpool -f 10 node set-timezone

Would you like to detect your timezone automatically? [y/n]
n

Please enter a timezone to register with in the format 'Country/City':
Australia/Brisbane

You have chosen to register with the timezone 'Australia/Brisbane', is this correct? [y/n]
y

Using the requested max fee of 10.00 gwei (including a max priority fee of 2.00 gwei).
Total cost: 0.0005 to 0.0007 ETH
Are you sure you want to set your timezone? [y/n]
```

这表明,无论网络建议什么 max fee,它都将在提交此交易时使用您的自定义 max fee 10 gwei(以及您指定的优先费用)。

::: warning 注意
如果您设置了手动 max fee,我们强烈建议您在提交交易之前使用第三方 gas 价格预言机(例如 [EtherChain](https://etherchain.org/tools/gasnow))来确定该费用对于当前网络条件是否足够高。
:::

### 取消/覆盖卡住的交易

有时,您可能会遇到这样的情况:您向网络发送了一笔交易,但您使用的 gas 价格对于网络条件来说太低了,执行它需要很长时间。
由于您的所有后续交易都将等到该交易通过,因此该交易基本上阻止了 Rocket Pool 节点上的所有操作。
为了处理这种情况,我们添加了一个全局标志,让您通过用其他内容替换它来"取消"此类交易。

每个以太坊钱包(包括您的节点钱包)都按顺序发送交易。
您发送的每笔交易都有一个称为 `nonce` 的数字,用于标识它在该序列中的位置。
您发送的第一笔交易的 `nonce` 为 0,您发送的下一笔交易的 `nonce` 为 1,依此类推。

这种覆盖技术涉及发送一个_新_交易,该交易使用与您现有的_卡住_交易相同的 `nonce`,但理想情况下将包含比卡住的交易更高的 gas 价格。
这意味着新交易将首先被挖掘。
一旦它被挖掘到区块中,旧交易将从网络中丢弃,就像它从未发送过一样。

要使用此标志,您首先需要找到卡住交易的 `nonce`:

1. 转到 ETH1 区块浏览器,例如 [https://etherscan.io](https://etherscan.io)。
1. 导航到您钱包的地址,并查看交易列表。
1. 从最近的交易开始浏览它们,直到找到列表中最远的具有 `Pending` 状态的交易。
1. 标记该交易的 `nonce`。这就是您需要的。

一旦您拥有它,只需使用 CLI 调用任何交易,在 `rocketpool` 之后和命令的其余部分之前使用 `--nonce <value> -i 2.2` 标志。

::: warning 注意
您**必须**包含 `-i`(优先费用)标志才能覆盖先前的交易。
此数字必须至少比旧交易使用的优先费用高 10%。
Smartnode 默认使用 2 gwei 的优先费用,因此值 `2.2` 通常足以进行覆盖。

如果您的旧交易使用了自定义费用(例如 10 gwei),您需要在覆盖交易中将其设置为至少高 10%(因此在此示例中为 11 gwei)。
:::

例如,假设我提交了一笔 `nonce` 为 10、max fee 为 20 gwei 的交易,但当前网络费用为 100 gwei,所以我的交易卡住了。
要修复它,我将提交一笔交易,其中我从自己向自己发送少量 ETH,使用更高的 max fee(例如 150 gwei)和更高的优先费用。
我会因此消耗一点 gas,但它会解除卡住的交易:

```
$ rocketpool --nonce 10 -f 150 -i 2.2 node send 0.0001 eth <node wallet address>

Using the requested max fee of 150.00 gwei (including a max priority fee of 2.20 gwei).
Total cost: 0.0032 to 0.0032 ETH
Are you sure you want to send 0.000100 eth to <node wallet address>? This action cannot be undone! [y/n]
```

Smartnode 堆栈将自动检查以确保您提供的 `nonce` 有效(它指的是待处理的交易),然后再发送它并意外浪费您的 gas。
如果不是,它将返回错误消息。
否则,它将继续并为您提供交易详细信息,以便您可以监控它以确认它确实覆盖了您的旧卡住交易。

这就是常见 CLI 命令的全部内容。
在下一节中,我们将介绍如何创建 minipool 并开始在信标链上进行验证。
