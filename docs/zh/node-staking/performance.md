# 监控节点性能

现在您的节点已启动并运行,并且您已连接了一个或多个 minipool,您需要密切关注所有内容以确保它运行顺利。

您可以通过以下方式跟踪您的机器:

1. 直接利用机器指标
2. 通过使用第三方工具间接跟踪

建议根据您的需求结合使用两者。

## 直接跟踪机器状态

关于机器的状态,您可能想要关注几个有用的指标:

- CPU 使用率
- 剩余可用 RAM
- 交换空间使用情况(如果您启用了它)
- 剩余可用磁盘空间
- 网络 I/O(如果您的 ISP 实施数据上限)

::: tip 注意
下面的部分向您展示了一些监控方法,但它们需要您登录到机器的终端。
有一种更好、更方便、外观更好的方法,使用 [Grafana web 仪表板](./grafana.mdx),但它仍在开发中。
请继续关注该部分的完成!
:::

### CPU、RAM 和交换空间

前三个可以使用 `htop` 程序轻松查看。
这将为您提供系统资源的实时视图,如树莓派的屏幕截图所示:

```
htop
```

![Htop screenshot on raspberry pi](./local/images/pi/Htop.png)

在带有条形图的顶部显示中,编号的条形图分别指代 CPU 核心的当前使用率。

`Mem` 显示您当前使用的 RAM(在此屏幕截图中为 1.75 GB)以及总共有多少(3.70 GB)。

`Swp` 显示您使用的交换空间(85.8 MB)以及总共有多少(12.0 GB)。

在底部表格中,每一行代表一个进程。
您的执行层和共识层客户端可能位于顶部(在本例中为 Geth 和 Nimbus),您可以在标记为 `Command` 的最右侧列中看到。

`RES` 列显示每个进程占用的 RAM - 在此屏幕截图中,Geth 占用 748 MB,Nimbus 占用 383 MB。

`CPU%` 列显示每个进程消耗的 CPU 功率。
100% 代表单个核心,因此如果超过 100%,则意味着它使用了来自多个核心的大量资源(就像这里的 Geth,为 213%)。

### 剩余可用磁盘空间

使用以下命令可以轻松关注您有多少可用磁盘空间:

```
df -h
```

这将提供类似于以下示例的输出:

```
Filesystem        Size  Used Avail Use% Mounted on
...
/dev/mmcblk0p2     30G   12G   16G  43% /
...
/dev/sda1         1.8T  852G  981G  47% /mnt/rpdata
...
```

对于在一个驱动器上存储操作系统和执行层及共识层链数据的常规设置,您只需查看 `Mounted on` 列中有 `/` 的条目。
这代表您的主磁盘。
如果它看起来空间不足(例如,使用了 80% 左右),那么您需要开始考虑进行一些清理。
例如,如果您正在运行 Geth,您可能想查看[如何修剪它](./pruning)以清理一些空间。

对于将执行层和共识层链数据存储在单独驱动器上的设置,您还需要查看 `Mounted on` 列中有您的链数据文件夹的行。
在此示例中,我们将外部 SSD 挂载到 `/mnt/rpdata`,因此我们必须密切关注它以确保它不会增长太大。

### 网络 I/O 和数据使用

如果您想跟踪系统随时间使用的网络 I/O 量,可以安装一个名为 `vnstat` 的实用程序。
以下是在 Ubuntu / Debian 系统上安装它的示例:

```shell
sudo apt install vnstat
```

要运行它,请执行此操作(假设 `eth0` 是您用于互联网连接的网络接口的名称):

```
vnstat -i eth0
```

这不会立即起作用,因为它需要时间来收集有关您系统的数据,但随着时间的推移,它最终会看起来像这样:

```
$ vnstat -i eth0
Database updated: 2021-06-28 22:00:00

   eth0 since 2021-01-29

          rx:  3.33 TiB      tx:  4.25 TiB      total:  7.58 TiB

   monthly
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
       2021-05    550.19 GiB |  855.34 GiB |    1.37 TiB |    4.51 Mbit/s
       2021-06    498.13 GiB |  784.43 GiB |    1.25 TiB |    4.57 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated    535.31 GiB |  842.97 GiB |    1.35 TiB |

   daily
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
     yesterday     18.35 GiB |   32.00 GiB |   50.36 GiB |    5.01 Mbit/s
         today     18.26 GiB |   30.52 GiB |   48.78 GiB |    5.29 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated     19.92 GiB |   33.30 GiB |   53.22 GiB |
```

这将让您密切关注总网络使用情况,如果您的 ISP 实施数据上限,这可能会有所帮助。

请注意,大多数现代系统更常用其他网络接口,如 eno0 和 enp0s31f6,而不是 eth0。
如果您需要检查网络接口,请运行以下命令:

```shell
ls /sys/class/net
```

以太网(有线)设备通常以 `e` 开头,例如上面的示例。
无线设备通常以 `w` 开头。

## Smartnode 警报通知

[使用警报通知监控您的 Smartnode 堆栈](./maintenance/alerting.md)介绍了如何使用 Smartnode 警报通知功能来接收有关 Rocket Pool Smartnode 健康状况和重要事件的通知。

## 第三方性能监控

最好的监控使用瑞士奶酪模型:每个工具都有漏洞,但如果您将它们堆叠在一起,任何东西都不太可能漏掉并让您措手不及。

请注意,这些第三方工具被 Rocket Pool 社区使用,但未得到 Rocket Pool 团队的正式认可或支持。
如果您有工具建议,或者您是工具所有者,非常欢迎您添加包含工具详细信息的拉取请求。

### Beaconcha.in 网站:使用信标链作为指标来源

[Beaconcha.in](https://beaconcha.in) 区块浏览器网站和应用程序提供了一种通过查看链上活动来跟踪验证者性能的方法。
它们还提供接收[电子邮件通知](https://beaconcha.in/user/notifications)的选项,用于停机等重大事件。
导航到他们的网站,然后在屏幕顶部的搜索框中输入您验证者的公钥。

::: tip
如果您忘记了验证者的公钥,可以使用命令 `rocketpool minipool status` 轻松检索它。
:::

如果一切设置正确,您应该看到类似这样的内容:
![](./local/images/pi/Beaconchain.png)

::: tip 注意
上面的链接适用于 Beaconcha.in 的**主网**版本。
如果您在 Hoodi 测试网上运行,请使用[此链接](https://hoodi.beaconcha.in)!
:::

这是您验证者的所有信标链活动的记录。
您可以使用它来检查验证者在信标链上的余额,随着时间的推移观察它的增长并计算您的 APY。

您还可以使用它快速判断您的验证者是否活跃并正常运行。
如果是这样,所有证明的**状态**都应该说 `Attested`,理想情况下所有 **Opt. Incl. Dist.** 都应该是 0(尽管偶尔 1 或 2 也可以)。

如果有很多区块上面写着 `Missed`,那么您的验证者工作不正常。
如果您使用 Docker 或混合模式,应检查 `eth1`、`eth2` 和 `validator` 服务的日志(如果您使用原生模式,则使用相应的日志脚本),使用 `rocketpool service logs ...` 查找问题。

**您应该固定此选项卡或为其创建书签,以便您可以快速跳转到它并检查验证者的状态。**

#### 使用 Beaconcha.in 监控多个 Minipool

Beaconcha.in 有一个[仪表板视图](https://beaconcha.in/dashboard),允许您一次监控多个验证者或 minipool。
只需一次添加一个验证者索引。如果您有很多 minipool,可以运行:

```shell
rocketpool minipool status | grep Validator.index | awk -F " " '{print $3}' | paste -s -d, -
```

获取逗号分隔的列表,并将其放在 URL 栏中,如下所示:`https://beaconcha.in/dashboard?validators=123456,123457`

### Beaconcha.in 应用:验证者概述和推送通知

Beaconcha.in 网站是查看指标和设置电子邮件警报的好方法。
他们的移动应用程序具有更多"一目了然"的特性。
它还具有推送通知服务,包括一些有用的警报,如:

1. 错过证明等问题的通知
2. Rocket Pool 奖励轮次的通知
3. 节点上 RPL 的过度/不足抵押

请注意,该应用程序有免费版本,以及具有主屏幕小部件等便利功能的付费选项。

### 在 Beaconcha.in 上重命名您的验证者

Beaconcha.in 网站有一个功能,允许用户重命名他们的验证者,使其更容易识别/搜索。

要使用此功能,您需要使用节点钱包的私钥签署消息,以证明您是控制该验证者的人。

Smartnode v1.5.1 包括使用命令 `rocketpool node sign-message` 使用节点钱包的私钥签署消息的能力,然后提供您想要签署的消息。
它必须包含术语 'beaconcha.in' 才能用于重命名您的验证者。

![](../node-staking/images/sign-message.png)

在 Beaconcha.in 上打开您的验证者页面,然后单击 `Edit validator name` 按钮。

![](../node-staking/images/edit-validator-name.png)

从 sign-message 命令复制结果并将其粘贴到"Signature"字段中。
填写您想要的昵称,然后单击 `Save changes` 按钮。

![](../node-staking/images/paste-signed-message.png)

### Uptimerobot:端口扫描正常运行时间

[Uptimerobot](https://uptimerobot.com/) 服务是一个简单的服务,用于扫描 IP 地址的开放端口。
如果您的机器在您指定的端口上不可用,Uptimerobot 可以向您发送有问题的通知。
该服务具有多种通知选项,包括电子邮件、推送通知、短信、电话和 webhook。

设置屏幕看起来像这样:

![](./local/images/uptimerobot.png)

要监控的 IP 是您节点的外部 IP,您可以通过 `ssh` 登录到节点或物理登录,并在浏览器中打开 [icanhazip.com](https://icanhazip.com/) 或在终端中运行以下命令来找到它:

```shell
curl icanhazip.com
```

要监控的端口取决于您的节点设置;运行典型 Smartnode 安装的用户可能已转发端口 30303 和 9001,分别用于执行层和共识层客户端,因此这些是正常运行时间监控的良好选择。

### Rocketpool 指标仪表板

有多个社区主导的举措提供节点性能概述以及整个 Rocket Pool 网络。

### 使用 Pushover 编写脚本(高级)

::: tip 注意
[使用警报通知监控您的 Smartnode 堆栈](./maintenance/alerting.md)介绍了如何使用 Smartnode 警报通知功能,其中包括在您的节点有可用更新时发出通知。
:::

[Pushover](https://pushover.net/) 服务允许您向自己发送推送通知。

::: warning 注意
这是一项高级活动。
如果您熟悉 shell 脚本,它可能会有所帮助,但如果您对 shell 环境不熟悉,则不建议使用。
:::

开始使用 Pushover:

1. 在 [pushover.net](https://pushover.net/) 创建一个帐户
1. [创建 API 令牌](https://pushover.net/apps/build)
1. 安装 Pushover 移动应用程序和/或浏览器扩展
1. 为您关心的任何操作调用 Pushover API

通过结构如下的 `curl` 调用来调用 Pushover API 向您发送推送通知:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE=
MESSAGE_CONTENT=
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json
```

#### 示例:有可用更新时的推送通知

如果您使用 `unattended-upgrades` 和 `update-nofifier` 包设置了自动更新,您可能希望在节点有可用更新时收到推送通知。
执行此操作的一种潜在方法是在 `~/update-notifier.sh` 中创建一个脚本,并使用 `crontab` 在 9:00 每天触发它。

要执行此操作,首先通过运行以下命令创建脚本:

```shell
nano ~/update-notifier.sh
```

然后粘贴以下脚本:

```shell
#!/bin/bash

PUSHOVER_USER=
PUSHOVER_TOKEN=
NODE_ADDRESS="$(rocketpool node status | grep -Po "(?<=The node )(0x[A-Za-z0-9]{40})")"
EXPLORER_URL=https://beaconcha.in/validators/deposits?q=
#EXPLORER_URL=https://www.rp-metrics-dashboard.com/dashboard/MAINNET/
NOTIFICATION_URL="$EXPLORER_URL$NODE_ADDRESS"

if cat /var/lib/update-notifier/updates-available | grep -Pq '^(?!0)[0-9]* updates can be applied'; then


   MESSAGE_TITLE="⚠️ Rocket Pool node system updates available"
   MESSAGE_CONTENT="$( cat /var/lib/update-notifier/updates-available | grep -P '^(?!0)[0-9]* updates can be applied' )"

else

   MESSAGE_TITLE="✅ Rocket Pool node system up to date"
   MESSAGE_CONTENT="No system updates available"

fi

curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=$NOTIFICATION_URL&priority=0" https://api.pushover.net/1/messages.json

```

接下来,运行以下命令将脚本标记为可执行:

```shell
chmod u+x ~/update-notifier.sh
```

现在运行以下命令打开您的 crontab:

```shell
crontab -e
```

然后使用箭头键向下滚动,并添加行 `* 9 * * * ~/update-notifier.sh`,使文件看起来像这样:

```shell
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command

# This like triggers at 9 AM local time
# to configure your own times, refer to https://crontab.guru/
0 9 * * * ~/update-notifier.sh
```

然后按 `control+x` 退出,当询问您是否要保存更改时按 `Y`。

如果您有更新,您现在应该在当地时间 09:00 收到通知。
您可以在终端中输入以下内容来手动运行脚本:

```shell
~/update-notifier.sh
```

#### 示例:在 APC UPS 守护程序激活时收到通知

一些家庭质押者正在使用不间断电源和 `apcupsd` 实用程序来确保在断电时节点正常关闭。

`apcupsd` 实用程序使用 `apccontrol` 脚本来管理其逻辑,因此可以通过编辑 `/etc/apcupsd/apccontrol` 文件来监控此守护程序的活动。
要执行此操作,请运行:

```shell
sudo nano /etc/apcupsd/apccontrol
```

然后在行顶部添加以下代码,使文件看起来像这样:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE="UPS Daemon called"
MESSAGE_CONTENT="called with: $1"
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json

#
# Copyright (C) 1999-2002 Riccardo Facchetti <riccardo@master.oasi.gpa.it>
#
# platforms/apccontrol.  Generated from apccontrol.in by configure.
```

这将在您的 UPS 守护程序采取行动时向您发送推送通知,包括定期"自检"功能。
