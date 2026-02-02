# FAQ (工作进行中)

### 与 32 ETH 单独验证者相比,使用 Rocket Pool 运行 minipool 有什么好处?

通过运行单个单独验证者,您将在 32 ETH 上获得 100% 的奖励。
通过运行两个 16 ETH minipool,您将在 32 ETH 上获得 100% 的奖励**加上** Rocket Pool 协议提供的 32 ETH 上 14% 的奖励。
通过运行四个 8 ETH minipool,您将在 32 ETH 上获得 100% 的奖励**加上** Rocket Pool 协议提供的 96 ETH 上 14% 的奖励。
您还可以选择使用 Rocket Pool 的 [Smoothing Pool](./prepare-node.mdx#smoothing-pool) 功能。

### 如何知道我的 rETH 值多少钱?它会重新调整基数吗?

rETH 代币不会重新调整基数。
您钱包上的代币数量将保持不变,但它们会随着时间的推移而升值。

### 我在运行节点时遇到技术问题,如何获得帮助?

您可以先查看 [Rocket Pool 支持](https://rocketpool.support)页面。
如果这没有帮助,您可以在 [Discord 服务器](https://discord.gg/rocketpool)的 Rocket Pool **#support** 频道提问。

### 如何获取测试 ETH 来试验创建和运行 minipool?我无法在水龙头频道发布消息。

请参阅[在 Hoodi 上获取测试 ETH](./testnet/overview#getting-test-eth-on-hoodi)。

### 如果我的机器损坏,如何恢复我的节点?

简短的回答:您的助记词是完全恢复节点所需的全部内容。
始终确保保持其安全。

要在新机器上恢复您的节点,首先要确保**您以前的机器不会再次上线**并使用密钥,因为使用相同密钥运行的两个节点**会让您被罚没**。
按照[步骤](./install-modes)在新机器上安装 Smartnode。
然后,通过运行命令 `rocketpool wallet recover` 并插入您的 24 个单词助记词来恢复您的节点钱包和验证者密钥。

### 为什么我的客户端没有同步?我的对等节点数量很少。

客户端需要有健康数量的对等节点才能正确同步。
您可以从[这里](https://www.yougetsignal.com/tools/open-ports/)运行测试,检查端口 30303 和 9001 是否打开。
如果它们关闭,您需要在路由器上设置端口转发。
此外,请确保您的节点具有静态本地 IP 地址,以便端口转发不会因您的节点获得新地址而中断。

### 我的共识客户端同步时间太长。我应该怎么办?

如果您没有使用[检查点同步](./config-docker#beacon-chain-checkpoint-syncing)启动同步过程,共识客户端可能需要很长时间才能同步。
即使您运行了很长时间,通常配置检查点同步 URL、使用 `rocketpool service resync-eth2` 清除当前同步数据并重新开始会更快。
您的客户端应该在不到一分钟的时间内同步。

### 我已经重新启动了。为什么 Grafana 说我仍然需要重新启动?

重新启动信息被缓存,仅每隔几个小时更新一次。
运行 `sudo apt update` 将强制更新。

### 我更改了执行层和/或信标链或共识层。如何清理旧数据?

如果您更改客户端,Rocketpool 不会删除旧卷。这些数据可能会浪费大量磁盘空间,您可能想删除它。要执行此操作,您需要找到这些卷。如果您使用默认的 Rocketpool 设置,docker 卷存储在 `/var/lib/docker/volumes/`。执行层在 `rocketpool_eth1clientdata/_data/*` 中,共识层在 `rocketpool_eth2clientdata/_data/*` 中。

要访问这些目录,您可能需要使用 `sudo -i` 以 root 身份运行 sudo。然后,您可以通过调用 `rm -rf <directory>` 删除目录。例如,如果您想删除所有 geth 数据,您将调用 `rm -rf /var/lib/docker/volumes/rocketpool_eth1clientdata/_data/geth/`。

要退出 root,输入 `exit`。
