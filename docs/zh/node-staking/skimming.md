# 分配提取的奖励

您为Ethereum运行验证者获得的ETH奖励会通过称为"提取"的过程定期发送到您的minipool。
提取的频率取决于Beacon Chain上激活的验证者数量。在撰写本文时,验证者数量约为
500,000,这导致大约每2-3天进行一次提取。

提取的奖励将在您的每个minipool中累积,直到您"分配"它们。此过程根据您的佣金率和提供的ETH与借入的ETH的比率,在您作为节点运营者和rETH持有者之间分配提取的奖励。

::: warning 注意
为了访问您minipool的余额,您需要首先升级到[Atlas委托](./minipools/delegates)。
旧的Redstone委托不能用于分配minipool的余额。
:::

## 自动分配

默认情况下,Smartnode配置为在任何minipool的单个余额达到**1 ETH**时自动分配它们。此
阈值可以通过以下步骤在TUI中配置。

运行:

```shell
rocketpool service config
```

导航到下面显示的设置`Smartnode and TX Fee Settings > Auto Distribute Threshold`。

![](./images/tui-automatic-skimming.png)

更改此设置将调整Smartnode自动分配minipool的阈值。
将参数设置为0将禁用自动分配。

::: warning 警告
如果您决定禁用自动分配,重要的是您仍然定期执行手动分配。
阅读以下[手动分配部分](#manual-distribution)了解如何执行此操作。

经过很长一段时间后,您提取的奖励可能超过8 ETH。如果发生这种情况,您将无法再
分配它们,并且需要退出验证者才能访问您累积的奖励。

Rocket Pool采用了故障安全设计,允许任何人在长时间等待后,当
minipool余额超过8 ETH时分配您的minipool。为了保护您的资本,Smartnode会监控这种情况,并在发生时自动退出
您的minipool。
:::

## 手动分配

如果您禁用了提取奖励的自动分配,您需要使用以下流程定期自己分配它们。

您也可以随时使用此流程手动分配奖励,而无需等待上述自动过程。

如果您的minipool中少于8 ETH,您可以使用以下命令分配奖励:

```shell
rocketpool minipool distribute-balance
```

这将显示您有资格分配的minipool、它们有多少ETH以及您(节点运营者)将获得多少ETH:

```
WARNING: The following minipools are using an old delegate and cannot have their rewards safely distributed:
	0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
	0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0
	0x7E5705c149D11efc951fFc20349D7A96bc6b819C
	0x7E570625cE8F586c90ACa7fe8792EeAA79751778

Please upgrade the delegate for these minipools using `rocketpool minipool delegate-upgrade` in order to distribute their ETH balances.

Please select a minipool to distribute the balance of:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (0.112307 ETH available, 0.031200 ETH goes to you plus a refund of 0.024419 ETH)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (0.070754 ETH available, 0.000481 ETH goes to you plus a refund of 0.069399 ETH)
4: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (0.122064 ETH available, 0.070187 ETH goes to you plus a refund of 0.000000 ETH)
5: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (0.102739 ETH available, 0.000000 ETH goes to you plus a refund of 0.000000 ETH)
6: 0xffCAB546539b55756b1F85678f229dd707328A2F (0.070989 ETH available, 0.025201 ETH goes to you plus a refund of 0.000000 ETH)
```

开始时会提到使用原始启动委托的任何minipool,让您知道在升级其委托之前无法对它们调用`distribute-balance`。
此委托是在指定提取之前编写的,因此不具备分配提取奖励的方法。

请注意,对于符合条件的minipool,您还会看到**退款金额**。
这是直接欠您的金额(例如,因为您在[从16-ETH保证金迁移到8-ETH保证金](./leb-migration.mdx)之前或您[将solo验证者转换为minipool](./solo-staker-migration)并带有现有奖励之前在minipool中有余额)。
它不会与rETH持有者分享。

输入您要分配的minipool的编号。
您将像往常一样看到gas价格图表,并要求确认您的决定。
一旦确认,您的minipool余额将被分配:

```
Using a max fee of 2.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to distribute the ETH balance of 1 minipools? [y/n]
y

Distributing balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC...
Transaction has been submitted with hash 0xb883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully distributed the ETH balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC.
```

正如您可以[从交易中](https://zhejiang.beaconcha.in/tx/b883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9)看到的那样,这为节点的提款地址提供了节点的奖励份额(加上退款金额),并将其余部分返回给质押池。
