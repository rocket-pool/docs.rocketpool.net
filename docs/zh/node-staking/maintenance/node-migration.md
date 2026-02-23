# 从一个节点迁移到另一个节点

有时,您的节点机器不再能够完成其工作,您需要迁移到另一台机器。
例如,如果您正在升级节点,或者您正在从基于云的节点迁移到本地托管在专用硬件上的节点,甚至如果您的节点本身遭受灾难性的硬件故障并且您需要在备份机器上运行验证者,都可能发生这种情况。
无论哪种情况,本指南将帮助您了解如何安全地将钱包和验证者密钥从一个节点迁移到另一个节点而不会被罚没。

## 罚没和罚没数据库

我们鼓励您在将钱包从一台机器移动到另一台机器或在另一台机器上恢复钱包时如此谨慎的主要原因是**罚没**的风险。
当您的一个或多个验证者密钥做了违反信标链规则的事情并且看起来您正在尝试攻击网络时,就会发生罚没。
作为响应,链将强制退出您的验证者并实施严厉的惩罚 - 惩罚的大小取决于在您自己的两周内还有多少验证者也被罚没,但目前最低为 **1 ETH**,没有最大值。

虽然有几种情况可以被解释为"攻击网络",但实际上唯一意外发生的是**双重证明**(或**双重提议**)。
当您的验证者为同一个时隙提交两个具有不同投票的证明(或两个区块提议)时,就会发生这种情况(例如,它为特定时隙投票给两个不同的候选区块,而不是选择一个)。

为了解决这个问题,您的验证者客户端托管了所谓的**罚没数据库**。
罚没数据库只是您验证者投票的记录(即每次投票的时隙和该投票所针对的区块的哈希),因此它知道不要对已经投票的内容进行投票。

### 避免被罚没

每个验证者客户端都维护一个罚没数据库,以确保您的节点永远不会双重证明或双重提议。
那么,问题来自于您在**没有**罚没数据库的情况下开始验证,因此没有您的验证者之前投票内容的记录的情况。
这可能发生在几种情况下:

1. 您刚刚更改了共识客户端,新客户端没有从旧客户端继承罚没数据库(Smartnode 在客户端更改期间不会这样做)。
2. 您在一台机器上加载了钱包并且正在积极证明,然后在第一台机器仍在积极证明时将钱包加载到第二台机器上。
3. 您在一台机器上停止验证并将钱包加载到第二台机器上,但您没有等待足够长的时间让当前 epoch 最终确定,因此您的第二台机器为您的验证者已经证明过的时隙证明。

避免被罚没的标准方法是**在最后一次成功证明后至少等待 15 分钟**,然后再启动验证者客户端并再次证明,并且**确保您的验证者密钥仅存在于一台机器上**。

更具体地说,计划是等到您的验证者有意错过了一次证明,**并且该错过已被最终确定**。
一旦达到最终性,您的验证者就不能再为已最终确定的 epoch 投票,并且可以安全地再次开始证明。

15 分钟的等待时间来自一个经验法则,即在正常运行时(例如,在正常共识下),信标链大约需要 7 分钟来最终确定一个 epoch。
等待 15 分钟可确保您至少错过了一个 epoch,并等待了足够长的时间让该 epoch 最终确定,并有一个小缓冲区以确保安全。

## 节点迁移清单

考虑到上述背景,这是您在迁移节点时可以遵循的有用清单,以确保您不会被罚没。
这是为了最大限度地提高安全性而设计的,因此虽然您可能认为某些步骤是不必要的,但我们**强烈**建议您完成所有步骤。

1. 按照这些指南**准备新节点**,从"准备节点"部分开始,到安装 Smartnode 并同步执行客户端和共识客户端结束。
   - :warning: **不要**初始化新钱包或在节点上恢复旧钱包。允许它在*没有钱包的情况下*同步客户端。

2. **等待**,直到您的客户端在新节点上完全同步。
3. 通过在新机器上运行 `rocketpool wallet test-recovery` 确认您已正确记录了助记词。这将*模拟*密钥恢复以确认您的节点钱包和所有 minipool 的验证者密钥可以正确恢复,但不会*实际*恢复它们并将它们保存到磁盘,因此没有罚没风险。
   1. 如果 Smartnode 无法使用您提供的助记词恢复您的节点钱包,那么您的助记词可能无效。**停止**执行此过程;从旧节点中删除密钥意味着它们可能**永远丢失**。
   2. 在这种情况下,我们建议尽快退出您的验证者并提取您的资本,以便您可以使用您拥有有效助记词的新节点重新开始。
4. **停止验证**您的旧节点(例如,使用 `rocketpool service stop` 关闭验证者客户端)。
5. 从旧节点**删除您的密钥**(例如,使用 `rocketpool wallet purge`)。
   1. 通过查看节点的 `data` 文件夹(默认为 `~/.rocketpool/data/validators/`)**验证**密钥已被删除 - 每个共识客户端在该数据文件夹下都有自己的文件夹,其中包含自己的密钥副本。
   2. 请参阅下面的[验证密钥删除](#verifying-key-removal)部分,了解如何执行此操作的说明。
   3. 确保**所有**密钥都已被删除。

6. **关闭**旧节点并通过拔下以太网电缆或 Wi-Fi 模块将其与互联网断开连接。

7. 使用以下方法之一**擦除旧节点的 SSD**:
   1. 使用带有 Linux 安装的可启动 USB 驱动器(例如流行的 [GParted](https://gparted.org/download.php))并使用它来擦除驱动器。
   2. 从旧节点**物理移除它**,使用 USB 转换器将其连接到另一台机器,并使用 [GParted](https://installati.one/debian/11/gparted/) 等工具擦除驱动器。
   3. 从旧节点**物理移除它**并用锤子敲击它以将其打破并确保它永远不会再被使用。

8. **等待**至少 15 分钟再继续。使用区块浏览器(例如 [https://beaconcha.in](https://beaconcha.in))查看验证者的证明记录。等到至少有一次证明被记录为缺失*并且相应的 epoch 已被最终确定*。
   1. 注意:如果您有多个 minipool,您必须确保*所有 minipool* 都至少错过了一次已最终确定的证明。

9. 按照[导入/恢复现有钱包](../recovering-rp.mdx)中的说明在新机器上**恢复您的节点钱包**。

10. **重新启动验证者客户端**以确保加载了验证者密钥(例如,使用 `docker restart rocketpool_validator`)。

您的验证者密钥现在将加载到新节点上,您可以安全地使用它开始证明。

## 验证密钥删除

验证者密钥以 `json` 文件的形式存储在磁盘上。
它们保存在节点的 `data` 文件夹中。
默认情况下,您可以在这里找到它们:

```shell
~/.rocketpool/data/validators/
```

::: warning 注意
如果您使用 `service config` TUI 更改了 `data` 目录(例如,您正在使用 Aegis 密钥并将其设置为 `data` 文件夹,则应将上述路径更改为 `<your data folder>/validators`。)
:::

每个客户端都有自己的密钥副本,因为每个客户端期望它们采用不同的格式或配置。

要在磁盘上**查找**密钥,请运行以下命令:

```shell
sudo find ~/.rocketpool/data/validators -type f -name "*.json"
```

例如,在有两个 minipool 的机器上,输出将如下所示:

```shell
/home/joe/.rocketpool/data/validators/teku/keys/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b.json
/home/joe/.rocketpool/data/validators/teku/keys/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/accounts/all-accounts.keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/keymanageropts.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
```

这显示了一个密钥**尚未**被删除并且仍在文件系统上的示例。

如果您的密钥**已**被删除,您不应该在该命令的输出中看到任何客户端的任何文件夹中的任何十六进制字符串(以 `0x` 开头的大字符串)。
